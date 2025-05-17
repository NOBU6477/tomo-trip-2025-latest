/**
 * 電話番号認証サービス
 * 
 * このモジュールは、電話番号認証に関連するビジネスロジックを提供します。
 * フロントエンドではFirebase Authenticationを使用し、
 * バックエンドではその結果を検証して保存します。
 */

import { storage } from './storage';
import { storage as firebaseStorage } from './firebase-config';
import path from 'path';
import fs from 'fs';

/**
 * ユーザーの電話番号を確認済みとしてマーク
 * @param userId ユーザーID
 * @param phoneNumber 確認済み電話番号
 * @param firebaseUid Firebaseユーザー固有ID
 * @returns 更新されたユーザー情報
 */
export async function verifyUserPhoneNumber(
  userId: number, 
  phoneNumber: string, 
  firebaseUid: string
) {
  try {
    // 電話番号とFirebase UIDを保存
    const user = await storage.updateUser(userId, {
      phoneNumber,
      phoneVerificationStatus: 'verified',
      firebaseUid
    });
    
    return user;
  } catch (error) {
    console.error('電話番号確認更新エラー:', error);
    throw new Error('電話番号確認の更新に失敗しました');
  }
}

/**
 * IDドキュメントのアップロード情報を保存
 * @param userId ユーザーID
 * @param documentType 書類タイプ (passport, driverLicense, etc.)
 * @param filePath アップロードされたファイルのパス
 * @returns 保存されたドキュメント情報
 */
export async function saveIdDocument(
  userId: number,
  documentType: string,
  filePath: string
) {
  try {
    // 本番環境では、ファイルをFirebase Storageにアップロード
    // ここでは簡易実装としてファイルパスをそのまま保存
    // Firebase Storageを使用する場合は、以下のようにアップロードし、URLを取得
    let documentUrl = filePath;
    
    if (firebaseStorage) {
      try {
        const fileExtension = path.extname(filePath);
        const fileName = `${userId}_${documentType}_${Date.now()}${fileExtension}`;
        const fileData = fs.readFileSync(filePath);
        
        // Firebase Storageにアップロード
        const fileRef = firebaseStorage.bucket().file(`documents/${fileName}`);
        await fileRef.save(fileData, {
          contentType: getContentType(fileExtension)
        });
        
        // URLを生成（期限付き）
        const [url] = await fileRef.getSignedUrl({
          action: 'read',
          expires: '03-01-2500' // 長期間有効
        });
        
        documentUrl = url;
        
        // ローカルファイルを削除
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Firebase Storageアップロードエラー:', error);
        // エラーが発生した場合はローカルパスを使用
      }
    }
    
    // DBにドキュメント情報を保存
    const idDocument = await storage.createIdDocument({
      userId,
      documentType,
      documentPath: documentUrl,
      verificationStatus: 'pending',
      uploadedAt: new Date()
    });
    
    return idDocument;
  } catch (error) {
    console.error('ID書類保存エラー:', error);
    throw new Error('ID書類の保存に失敗しました');
  }
}

/**
 * ファイル拡張子からContent Typeを取得
 */
function getContentType(extension: string): string {
  switch (extension.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}