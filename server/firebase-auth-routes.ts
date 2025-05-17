/**
 * Firebase認証関連のルート
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyIdToken } from './firebase-config';
import { storage } from './storage';
import { saveIdDocument } from './verification-service';

const router = Router();

/**
 * クライアント用のFirebase設定を提供
 */
router.get('/firebase-config', (req: Request, res: Response) => {
  // フロントエンド用のFirebase設定を返す（機密情報は含めない）
  const clientConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
  };
  
  res.json(clientConfig);
});

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
 * Firebase IDトークンを検証するミドルウェア
 */
const verifyFirebaseToken = async (req: Request, res: Response, next: any) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({ message: '認証トークンがありません' });
    }
    
    try {
      // Firebaseトークンを検証
      const decodedToken = await verifyIdToken(idToken);
      (req as any).firebaseUser = decodedToken;
      next();
    } catch (error) {
      console.error('Firebase認証エラー:', error);
      return res.status(401).json({ message: '無効な認証トークンです' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Firebase認証で確認された電話番号をデータベースに保存
 */
router.post('/verify-phone-firebase', verifyFirebaseToken, async (req: Request, res: Response, next: any) => {
  try {
    const { userId, phoneNumber } = req.body;
    const firebaseUid = (req as any).firebaseUser.uid;
    
    if (!userId || !phoneNumber) {
      return res.status(400).json({ message: 'ユーザーIDと電話番号は必須です' });
    }
    
    // 電話番号認証ステータスを更新
    const user = await storage.verifyPhoneNumber(userId, phoneNumber);
    
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    // Firebaseのuidを関連付け
    await storage.updateUser(userId, { firebaseUid });
    
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

/**
 * Firebase Storageを使用した身分証明書アップロード
 */
router.post('/upload-id-document', verifyFirebaseToken, upload.single('document'), async (req: Request, res: Response, next: any) => {
  try {
    const { userId, documentType } = req.body;
    
    if (!userId || !documentType || !req.file) {
      return res.status(400).json({ 
        message: 'ユーザーID、書類タイプ、およびドキュメントファイルは必須です' 
      });
    }
    
    // 身分証明書をFirebase Storageにアップロードし、DBに情報を保存
    const idDocument = await saveIdDocument(
      Number(userId),
      documentType,
      req.file.path
    );
    
    res.status(201).json(idDocument);
  } catch (error) {
    next(error);
  }
});

/**
 * ユーザーの身分証明書一覧を取得
 */
router.get('/id-documents/:userId', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: '無効なユーザーIDです' });
    }
    
    const idDocuments = await storage.getIdDocuments(userId);
    return res.json(idDocuments);
  } catch (error) {
    console.error('ID書類取得エラー:', error);
    return res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default router;