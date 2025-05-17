import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express } from 'express';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from './storage';
import { User as UserType } from '../shared/schema';

declare global {
  namespace Express {
    // Expressのユーザー型を拡張
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

// パスワードのハッシュ化
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

// パスワードの比較
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// 認証機能のセットアップ
export function setupAuth(app: Express) {
  // セッション設定
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'local-guide-secret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1週間
    }
  };

  app.set('trust proxy', 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // ローカル認証戦略の設定
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: 'ユーザー名またはパスワードが間違っています' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  // セッションへのユーザー情報の保存と取得
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // 認証関連のルート
  // 新規ユーザー登録
  app.post('/api/register', async (req, res, next) => {
    try {
      // ユーザー名またはメールアドレスが既に使用されているか確認
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: 'このユーザー名は既に使用されています' });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
      }

      // 新規ユーザーの作成
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // ユーザーをログイン状態にする
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ 
          id: user.id, 
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type
        });
      });
    } catch (err) {
      next(err);
    }
  });

  // ログイン
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info.message || 'ログインに失敗しました' });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ 
          id: user.id, 
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type
        });
      });
    })(req, res, next);
  });

  // ログアウト
  app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // ユーザー情報取得
  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: '認証されていません' });
    }
    
    const user = req.user as UserType;
    res.json({ 
      id: user.id, 
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.type,
      profileImage: user.profileImage,
      bio: user.bio
    });
  });
}