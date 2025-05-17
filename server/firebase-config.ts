/**
 * Firebase Admin SDKの設定
 */

import * as admin from 'firebase-admin';
import { getStorage, Bucket } from 'firebase-admin/storage';
import fs from 'fs';

// Firebase Admin SDKの初期化
let firebaseAdmin: admin.app.App | null = null;
let firebaseBucket: Bucket | null = null;

try {
  // Firebaseの認証情報を環境変数から取得
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // 秘密鍵の改行文字を正しく処理
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  // 秘密鍵が定義されており、文字列として使用可能かチェック
  const formattedPrivateKey = privateKey && typeof privateKey === 'string' 
    ? privateKey.replace(/\\n/g, '\n') 
    : undefined;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  
  if (clientEmail && formattedPrivateKey && projectId) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey
      }),
      storageBucket: `${projectId}.appspot.com`
    });
    firebaseBucket = getStorage().bucket();
    console.log('Firebase Admin SDK initialized');
  } else {
    console.warn('Firebase credentials not found, using mock implementation');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  console.log('Using mock Firebase Admin SDK implementation');
}

/**
 * Firebase認証のモック実装
 * 開発環境で使用するためのダミー実装です
 */
class MockAuth {
  async verifyIdToken(idToken: string) {
    // ダミー実装：実際の検証は行わず、常に成功を返す
    console.log(`[MOCK] Verifying token: ${idToken.substring(0, 10)}...`);
    return {
      uid: 'mock-firebase-uid-123456',
      email: 'mock@example.com',
      phone_number: '+819012345678'
    };
  }
}

/**
 * Firebase Storageのモック実装
 * 開発環境で使用するためのダミー実装です
 */
class MockStorage {
  bucket() {
    return {
      file(path: string) {
        console.log(`[MOCK] Creating file reference: ${path}`);
        return {
          // ファイル保存のモック
          save(data: Buffer, options: any) {
            console.log(`[MOCK] Saving file: ${path} (${data.length} bytes)`);
            return Promise.resolve();
          },
          // 署名付きURLのモック
          getSignedUrl(options: any) {
            console.log(`[MOCK] Generating signed URL for: ${path}`);
            return Promise.resolve([`https://mock-firebase-storage.example.com/${path}`]);
          }
        };
      }
    };
  }
}

// 実際のFirebase SDKまたはモックを使用
export const auth = firebaseAdmin ? firebaseAdmin.auth() : new MockAuth();
export const storage = firebaseBucket ? { bucket: () => firebaseBucket } : new MockStorage();

/**
 * 電話番号認証を開始する
 * 実際の実装では、Firebase Authenticationの電話番号認証を使用します
 * 
 * @param phoneNumber 検証する電話番号
 * @returns 検証ID と モック認証コード
 */
export async function verifyPhoneNumber(phoneNumber: string): Promise<{ verificationId: string, mockCode: string }> {
  // この実装はモックです
  // 実際の実装では、Firebase Authentication APIを使用して
  // 電話番号認証を行います
  console.log(`[MOCK] Starting phone verification for: ${phoneNumber}`);
  
  // モック認証用に6桁の認証コードを生成
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[MOCK] Verification code for ${phoneNumber}: ${mockCode}`);
  
  return {
    verificationId: `mock-verification-id-${Date.now()}`,
    mockCode
  };
}

/**
 * Firebase IDトークンを検証する
 * 
 * @param idToken 検証するIDトークン
 * @returns 検証結果
 */
export async function verifyIdToken(idToken: string) {
  return auth.verifyIdToken(idToken);
}