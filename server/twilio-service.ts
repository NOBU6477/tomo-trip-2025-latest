/**
 * Twilioを使用した電話番号認証サービス
 * 
 * このモジュールは、Twilioを使用してSMS認証コードを送信し
 * 検証するためのユーティリティ関数を提供します。
 */

import twilio from 'twilio';

// 開発環境では、Twilioのクライアントをモックします
// 本番環境では、実際のTwilioクライアントを使用します
let twilioClient: any;
try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
    console.log('Twilio client initialized');
  } else {
    console.warn('Twilio credentials not found, using mock implementation');
    twilioClient = null;
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
  twilioClient = null;
}

// 検証コードをメモリに保存（本番環境では使用しない）
// 実際のアプリケーションでは、これをデータベースに保存する必要があります
interface VerificationData {
  code: string;
  expiry: Date;
  attempts: number;
}

const verificationCodes: Record<number, VerificationData> = {};

/**
 * 6桁の認証コードを生成する
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 電話番号に認証コードを送信する
 * @param phoneNumber 送信先電話番号（国際形式：+819012345678）
 * @param userId ユーザーID
 * @returns レスポンスオブジェクト（テスト環境の場合はmockCode付き）
 */
export async function sendVerificationCode(phoneNumber: string, userId: number): Promise<{ verificationCode: string, mockCode?: string }> {
  try {
    // テスト環境では固定コードを使用
    const verificationCode = process.env.NODE_ENV === 'production' ? generateVerificationCode() : '123456';
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10); // 10分間有効

    // 検証コードをメモリに保存
    verificationCodes[userId] = {
      code: verificationCode,
      expiry: expiryTime,
      attempts: 0
    };

    // 本番環境では実際にSMSを送信
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      await twilioClient.messages.create({
        body: `【ローカルガイド】認証コード: ${verificationCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      console.log(`Verification code sent to ${phoneNumber}`);
      
      // 本番環境ではモックコードを返さない
      return { 
        verificationCode: verificationCode 
      };
    } else {
      // 開発環境ではコンソールに出力
      console.log(`[MOCK] Verification code for ${userId}: ${verificationCode}`);
      console.log(`[INFO] テスト環境では認証コード「123456」を使用できます`);
      
      // テスト環境ではモックコードも一緒に返す
      return { 
        verificationCode: verificationCode,
        mockCode: verificationCode
      };
    }
  } catch (error) {
    console.error('認証コード送信エラー:', error);
    throw new Error('認証コードの送信に失敗しました');
  }
}

/**
 * 認証コードを検証する
 * @param userId ユーザーID
 * @param code 検証する認証コード
 * @returns 検証結果（成功：true、失敗：false）
 */
export function verifyCode(userId: number, code: string): boolean {
  const verification = verificationCodes[userId];
  
  if (!verification) {
    console.log(`認証情報がありません: userId=${userId}`);
    return false;
  }
  
  // 有効期限切れの場合
  if (new Date() > verification.expiry) {
    console.log(`認証コードの有効期限切れ: userId=${userId}`);
    delete verificationCodes[userId];
    return false;
  }
  
  // 試行回数を増やす
  verification.attempts += 1;
  
  // 最大試行回数（5回）を超えた場合
  if (verification.attempts > 5) {
    console.log(`最大試行回数超過: userId=${userId}`);
    delete verificationCodes[userId];
    return false;
  }
  
  // コードが一致するか確認
  if (verification.code === code) {
    console.log(`認証成功: userId=${userId}`);
    delete verificationCodes[userId]; // 使用済みのコードを削除
    return true;
  }
  
  console.log(`認証コード不一致: userId=${userId}, 入力=${code}, 正解=${verification.code}`);
  return false;
}