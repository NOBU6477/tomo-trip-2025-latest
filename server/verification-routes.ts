/**
 * 電話番号認証と身分証明書関連のルート
 */
import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendVerificationCode, verifyCode } from './twilio-service';
import { storage } from './storage';

const router = Router();

// ファイルアップロード用の設定
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB制限
  }
});

// アップロードフォルダがなければ作成
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

/**
 * 認証済みユーザーのみアクセス可能なミドルウェア
 */
const requireAuth = (req: any, res: Response, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: '認証が必要です' });
  }
  next();
};

/**
 * 電話番号認証コード送信
 */
router.post('/user/verify-phone/send', requireAuth, async (req: any, res: Response, next: any) => {
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
    
    // 電話番号認証コードを送信
    try {
      const response = await sendVerificationCode(phoneNumber, userId);
      
      // 電話番号とステータスをデータベースに保存
      await storage.updateUser(userId, { 
        phoneNumber,
        phoneVerificationStatus: 'pending'
      });
      
      // レスポンスオブジェクトを作成
      const responseObj: any = { 
        success: true, 
        message: '認証コードを送信しました' 
      };
      
      // テスト環境ではモックコードをレスポンスに含める
      if (response.mockCode) {
        responseObj.mockCode = response.mockCode;
      }
      
      res.json(responseObj);
    } catch (error) {
      console.error('電話番号認証エラー:', error);
      return res.status(500).json({ message: '電話番号認証の開始に失敗しました' });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * 電話番号認証コード検証
 */
router.post('/user/verify-phone/verify', requireAuth, async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user?.id;
    const { verificationCode } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' });
    }
    
    if (!verificationCode) {
      return res.status(400).json({ message: '検証コードは必須です' });
    }
    
    // 検証コードを確認
    const isValid = verifyCode(userId, verificationCode);
    
    if (!isValid) {
      return res.status(400).json({ message: '無効な検証コードです' });
    }
    
    // 電話番号認証ステータスを更新
    const user = await storage.updatePhoneVerificationStatus(userId, 'verified');
    
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

/**
 * 身分証明書アップロード
 */
router.post('/user/upload-id-document', requireAuth, upload.single('document'), async (req: any, res: Response, next: any) => {
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
    
    return res.status(201).json(idDocument);
  } catch (err) {
    next(err);
  }
});

/**
 * 身分証明書一覧取得
 */
router.get('/user/id-documents', requireAuth, async (req: any, res: Response, next: any) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: '認証が必要です' });
    }
    
    const idDocuments = await storage.getIdDocuments(userId);
    return res.json(idDocuments);
  } catch (err) {
    next(err);
  }
});

export default router;