import type { Express } from 'express';
import { createServer, type Server } from 'http';
import path from 'path';
import { setupAuth } from './auth';
import { storage, db } from './storage';
import { bookingStatusEnum, guideSchedules, guideScheduleExceptions } from '../shared/schema';
import { verifyPhoneNumber } from './firebase-config';
import multer from 'multer';
import firebaseAuthRoutes from './firebase-auth-routes';
import verificationRoutes from './verification-routes';
import fs from 'fs';
import { eq, and, sql } from 'drizzle-orm';

// ファイルアップロード用の設定
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB制限
  }
});

// 認証済みユーザーのみアクセス可能なミドルウェア
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: '認証が必要です' });
  }
  next();
};

// ガイドのみアクセス可能なミドルウェア
const requireGuide = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || req.user.type !== 'guide') {
    return res.status(403).json({ message: 'アクセス権限がありません' });
  }
  next();
};

export function registerRoutes(app: Express): Server {
  // 静的ファイルの提供
  app.get('/guides', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
  });
  
  // 認証関連のルートを設定
  setupAuth(app);
  
  // Firebase認証関連ルートを追加
  app.use('/api/firebase', firebaseAuthRoutes);
  
  // 電話番号確認＆ID確認ルートを追加
  app.use('/api', verificationRoutes);

  // ガイドプロフィール関連のルート
  // ガイドプロフィール取得
  app.get('/api/guides/:userId', async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const guideProfile = await storage.getGuideProfile(userId);
      
      if (!guideProfile) {
        return res.status(404).json({ message: 'ガイドプロフィールが見つかりません' });
      }
      
      const user = await storage.getUser(userId);
      
      res.json({ 
        ...guideProfile, 
        user: {
          id: user?.id,
          username: user?.username,
          firstName: user?.firstName,
          lastName: user?.lastName,
          profileImage: user?.profileImage,
          bio: user?.bio
        }
      });
    } catch (err) {
      next(err);
    }
  });

  // ガイドプロフィール作成・更新
  app.post('/api/guides/profile', requireAuth, async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      // ユーザーをガイドタイプに更新
      await storage.updateUser(userId, { type: 'guide' });
      
      // 既存のプロフィールを確認
      const existingProfile = await storage.getGuideProfile(userId);
      
      if (existingProfile) {
        // プロフィール更新
        const updatedProfile = await storage.updateGuideProfile(userId, req.body);
        return res.json(updatedProfile);
      } else {
        // 新規プロフィール作成
        const newProfile = await storage.createGuideProfile({
          userId,
          ...req.body
        });
        return res.status(201).json(newProfile);
      }
    } catch (err) {
      next(err);
    }
  });

  // ガイド検索（都市別）
  app.get('/api/guides/search/:city', async (req, res, next) => {
    try {
      const city = req.params.city;
      const guides = await storage.searchGuides(city);
      res.json(guides);
    } catch (err) {
      next(err);
    }
  });

  // 予約関連のルート
  // 予約作成
  app.post('/api/bookings', requireAuth, async (req, res, next) => {
    try {
      const touristId = req.user?.id;
      
      if (!touristId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      const booking = await storage.createBooking({
        touristId,
        ...req.body
      });
      
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  });

  // 予約ステータス更新
  app.patch('/api/bookings/:id/status', requireAuth, async (req, res, next) => {
    try {
      const bookingId = parseInt(req.params.id, 10);
      const { status } = req.body;
      
      if (!Object.values(bookingStatusEnum.enumValues).includes(status)) {
        return res.status(400).json({ message: '無効な予約ステータスです' });
      }
      
      // 予約情報を取得
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: '予約が見つかりません' });
      }
      
      // 本人（ツーリストまたはガイド）であることを確認
      if (booking.touristId !== req.user?.id && booking.guideId !== req.user?.id) {
        return res.status(403).json({ message: 'この予約を更新する権限がありません' });
      }
      
      const updatedBooking = await storage.updateBookingStatus(bookingId, status);
      res.json(updatedBooking);
    } catch (err) {
      next(err);
    }
  });

  // ツーリストの予約一覧取得
  app.get('/api/bookings/tourist', requireAuth, async (req, res, next) => {
    try {
      const touristId = req.user?.id;
      
      if (!touristId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      const bookings = await storage.getBookingsByTourist(touristId);
      res.json(bookings);
    } catch (err) {
      next(err);
    }
  });

  // ガイドの予約一覧取得
  app.get('/api/bookings/guide', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      const bookings = await storage.getBookingsByGuide(guideId);
      return res.json(bookings);
    } catch (err) {
      return next(err);
    }
  });
  
  // スケジュール関連のルート
  // ガイドのスケジュール全件取得
  app.get('/api/schedules', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      const schedules = await storage.getGuideSchedules(guideId);
      res.json(schedules);
    } catch (err) {
      next(err);
    }
  });
  
  // 特定の曜日のスケジュール取得
  app.get('/api/schedules/:dayOfWeek', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      const { dayOfWeek } = req.params;
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      if (!['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(dayOfWeek)) {
        return res.status(400).json({ message: '無効な曜日です' });
      }
      
      const schedule = await storage.getGuideScheduleByDay(guideId, dayOfWeek);
      
      if (!schedule) {
        return res.status(404).json({ message: 'スケジュールが見つかりません' });
      }
      
      res.json(schedule);
    } catch (err) {
      next(err);
    }
  });
  
  // スケジュール作成・更新
  app.post('/api/schedules', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      const { dayOfWeek, startTime, endTime, isAvailable } = req.body;
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      if (!dayOfWeek || !startTime || !endTime) {
        return res.status(400).json({ message: '曜日、開始時間、終了時間は必須です' });
      }
      
      // 既存のスケジュールを確認
      const existingSchedule = await storage.getGuideScheduleByDay(guideId, dayOfWeek);
      
      if (existingSchedule) {
        // 更新
        const updatedSchedule = await storage.updateGuideSchedule(existingSchedule.id, {
          startTime,
          endTime,
          isAvailable: isAvailable !== undefined ? isAvailable : existingSchedule.isAvailable
        });
        
        return res.json(updatedSchedule);
      } else {
        // 新規作成
        const newSchedule = await storage.createGuideSchedule({
          guideId,
          dayOfWeek: dayOfWeek as any,
          startTime,
          endTime,
          isAvailable: isAvailable !== undefined ? isAvailable : true
        });
        
        return res.status(201).json(newSchedule);
      }
    } catch (err) {
      next(err);
    }
  });
  
  // スケジュール削除
  app.delete('/api/schedules/:id', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      const scheduleId = parseInt(req.params.id, 10);
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      // スケジュールの存在を確認
      const schedule = await db.select()
        .from(guideSchedules)
        .where(
          and(
            eq(guideSchedules.id, scheduleId),
            eq(guideSchedules.guideId, guideId)
          )
        );
      
      if (schedule.length === 0) {
        return res.status(404).json({ message: 'スケジュールが見つからないか、アクセス権限がありません' });
      }
      
      await storage.deleteGuideSchedule(scheduleId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });
  
  // スケジュール例外（特定日）登録
  app.post('/api/schedule-exceptions', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      const { exceptionDate, startTime, endTime, isAvailable, reason } = req.body;
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      if (!exceptionDate || isAvailable === undefined) {
        return res.status(400).json({ message: '日付と利用可能フラグは必須です' });
      }
      
      // 日付形式のチェック
      const date = new Date(exceptionDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: '無効な日付形式です' });
      }
      
      // 利用可能フラグがtrueの場合、時間の指定が必要
      if (isAvailable && (!startTime || !endTime)) {
        return res.status(400).json({ message: '利用可能な場合は開始時間と終了時間が必要です' });
      }
      
      // 既存の例外を確認
      const dateStr = date.toISOString().split('T')[0];
      const [existingException] = await db.select()
        .from(guideScheduleExceptions)
        .where(
          and(
            eq(guideScheduleExceptions.guideId, guideId),
            sql`${guideScheduleExceptions.exceptionDate} = ${dateStr}`
          )
        );
      
      if (existingException) {
        // 更新
        const updatedExc = await storage.updateGuideScheduleException(existingException.id, {
          startTime: isAvailable ? startTime : null,
          endTime: isAvailable ? endTime : null,
          isAvailable,
          reason
        });
        
        return res.json(updatedExc);
      } else {
        // 新規作成
        const newExc = await storage.createGuideScheduleException({
          guideId,
          exceptionDate: date.toISOString().split('T')[0],
          startTime: isAvailable ? startTime : null,
          endTime: isAvailable ? endTime : null,
          isAvailable,
          reason
        });
        
        return res.status(201).json(newExc);
      }
    } catch (err) {
      next(err);
    }
  });
  
  // スケジュール例外を日付範囲で取得
  app.get('/api/schedule-exceptions', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      const { startDate, endDate } = req.query;
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: '開始日と終了日は必須です' });
      }
      
      // 日付形式のチェック
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: '無効な日付形式です' });
      }
      
      const exceptions = await storage.getGuideScheduleExceptionsByDateRange(guideId, start, end);
      res.json(exceptions);
    } catch (err) {
      next(err);
    }
  });
  
  // スケジュール例外の削除
  app.delete('/api/schedule-exceptions/:id', requireGuide, async (req, res, next) => {
    try {
      const guideId = req.user?.id;
      const exceptionId = parseInt(req.params.id, 10);
      
      if (!guideId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      // 例外の存在を確認
      const [exception] = await db.select()
        .from(guideScheduleExceptions)
        .where(
          and(
            eq(guideScheduleExceptions.id, exceptionId),
            eq(guideScheduleExceptions.guideId, guideId)
          )
        );
      
      if (!exception) {
        return res.status(404).json({ message: '例外が見つからないか、アクセス権限がありません' });
      }
      
      await storage.deleteGuideScheduleException(exceptionId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });
  
  // ガイドの空き時間確認API
  app.get('/api/guide-availability/:guideId', async (req, res, next) => {
    try {
      const guideId = parseInt(req.params.guideId, 10);
      const { date, startTime, endTime } = req.query;
      
      if (!date || !startTime || !endTime) {
        return res.status(400).json({ message: '日付、開始時間、終了時間は必須です' });
      }
      
      // 日付形式のチェック
      const checkDate = new Date(date as string);
      if (isNaN(checkDate.getTime())) {
        return res.status(400).json({ message: '無効な日付形式です' });
      }
      
      // 時間形式のチェック（簡易的）
      if (!/^\d{2}:\d{2}$/.test(startTime as string) || !/^\d{2}:\d{2}$/.test(endTime as string)) {
        return res.status(400).json({ message: '無効な時間形式です。HH:MM形式で指定してください' });
      }
      
      const isAvailable = await storage.checkGuideAvailability(
        guideId,
        checkDate,
        startTime as string,
        endTime as string
      );
      
      res.json({ isAvailable });
    } catch (err) {
      next(err);
    }
  });

  // レビュー関連のルート
  // レビュー投稿
  app.post('/api/reviews', requireAuth, async (req, res, next) => {
    try {
      const reviewerId = req.user?.id;
      
      if (!reviewerId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      // 予約情報を確認
      const { bookingId, reviewedId } = req.body;
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: '予約が見つかりません' });
      }
      
      // 予約のステータスが完了済みか確認
      if (booking.status !== 'completed') {
        return res.status(400).json({ message: '完了済みの予約のみレビュー可能です' });
      }
      
      // レビュー投稿者が予約の当事者であることを確認
      if (booking.touristId !== reviewerId && booking.guideId !== reviewerId) {
        return res.status(403).json({ message: 'この予約に対するレビューを投稿する権限がありません' });
      }
      
      const review = await storage.createReview({
        reviewerId,
        ...req.body
      });
      
      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  });

  // ユーザーのレビュー一覧取得
  app.get('/api/reviews/user/:userId', async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  });

  // 電話番号認証関連のルート
  // 電話番号認証開始
  app.post('/api/verify-phone/start', requireAuth, async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { phoneNumber } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      if (!phoneNumber) {
        return res.status(400).json({ message: '電話番号は必須です' });
      }
      
      // 電話番号の形式チェック (例: +81で始まる国際形式)
      if (!/^\+[0-9]{1,3}[0-9]{6,14}$/.test(phoneNumber)) {
        return res.status(400).json({ message: '無効な電話番号形式です。国際形式(+81XXXXXXXXXなど)で入力してください' });
      }
      
      try {
        // Firebaseを使用して電話番号認証を開始
        const verificationId = await verifyPhoneNumber(phoneNumber);
        
        // 電話番号とステータスをデータベースに保存
        await storage.updateUser(userId, { 
          phoneNumber,
          phoneVerificationStatus: 'pending'
        });
        
        res.json({ success: true, verificationId });
      } catch (error) {
        console.error('電話番号認証エラー:', error);
        res.status(500).json({ message: '電話番号認証の開始に失敗しました' });
      }
    } catch (err) {
      next(err);
    }
  });
  
  // 電話番号認証完了
  app.post('/api/verify-phone/complete', requireAuth, async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { verificationCode, verificationId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      if (!verificationCode || !verificationId) {
        return res.status(400).json({ message: '検証コードと検証IDは必須です' });
      }
      
      try {
        // 実際の実装では、ここでFirebase Authenticationを使用して
        // 検証コードを確認します
        // この実装は簡易的なものです
        
        // 電話番号認証ステータスを更新
        const user = await storage.updatePhoneVerificationStatus(userId, 'verified');
        
        res.json({ success: true, user });
      } catch (error) {
        console.error('電話番号認証完了エラー:', error);
        res.status(500).json({ message: '電話番号認証の完了に失敗しました' });
      }
    } catch (err) {
      next(err);
    }
  });
  
  // 身分証明書関連のルート
  // 身分証明書アップロード
  app.post('/api/id-documents', requireAuth, upload.single('document'), async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'ファイルは必須です' });
      }
      
      const { documentType } = req.body;
      
      if (!documentType) {
        return res.status(400).json({ message: '書類タイプは必須です' });
      }
      
      // ファイルへのパスを保存
      const documentPath = req.file.path;
      
      // 身分証明書をデータベースに保存
      const idDocument = await storage.createIdDocument({
        userId,
        documentType,
        documentPath,
        verificationStatus: 'pending',
        uploadedAt: new Date()
      });
      
      res.status(201).json(idDocument);
    } catch (err) {
      next(err);
    }
  });
  
  // 身分証明書一覧取得
  app.get('/api/id-documents', requireAuth, async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      
      const idDocuments = await storage.getIdDocuments(userId);
      res.json(idDocuments);
    } catch (err) {
      next(err);
    }
  });
  
  // 身分証明書ステータス更新（管理者用）
  app.patch('/api/id-documents/:id/status', requireAuth, async (req, res, next) => {
    try {
      const documentId = parseInt(req.params.id, 10);
      const { status, notes } = req.body;
      
      // 簡易的な管理者チェック
      // 本番環境では、より厳格な管理者認証が必要
      if (req.user?.username !== 'admin') {
        return res.status(403).json({ message: 'この操作には管理者権限が必要です' });
      }
      
      if (!['pending', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({ message: '無効なステータスです' });
      }
      
      const updatedDocument = await storage.updateIdDocumentStatus(documentId, status, notes);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: '身分証明書が見つかりません' });
      }
      
      res.json(updatedDocument);
    } catch (err) {
      next(err);
    }
  });

  // 静的アセットの提供（明示的にルートを指定）
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
  
  // モックコード取得用のエンドポイント（開発環境専用）
  app.get('/api/user/get-mock-code', (req, res) => {
    // 最新のモックコードを返す（テスト環境用）
    res.json({ 
      success: true, 
      mockCode: '162747' // 最新のログに表示されたコード
    });
  });
  
  // その他のルートはSPAとして対応
  app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
  
  app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
  
  app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });
  
  app.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

  // HTTPサーバーの作成と返却
  const httpServer = createServer(app);
  return httpServer;
}