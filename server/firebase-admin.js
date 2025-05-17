/**
 * Firebaseサーバー側管理モジュール
 * Firebase Admin SDKを使用したサーバーサイド処理
 */

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// 環境変数から認証情報を取得
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

// Firebase Admin SDKの初期化
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
    console.log('Firebase Admin SDKを初期化しました');
  } catch (error) {
    console.error('Firebase Admin SDKの初期化に失敗しました:', error);
  }
}

// Firestoreインスタンスを取得
const db = getFirestore();

/**
 * 予約データをFirestoreに保存する関数
 * @param {Object} bookingData - 予約データ
 * @returns {Promise<string>} 生成された予約ID
 */
async function createBooking(bookingData) {
  try {
    // 予約データにタイムスタンプを追加
    const bookingWithTimestamp = {
      ...bookingData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Firestoreに予約データを保存
    const docRef = await db.collection('bookings').add(bookingWithTimestamp);
    console.log('予約データを保存しました。ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('予約データの保存に失敗しました:', error);
    throw error;
  }
}

/**
 * ユーザーIDによる予約一覧の取得
 * @param {string} userId - ユーザーID
 * @param {string} userType - ユーザータイプ ('guide' または 'tourist')
 * @returns {Promise<Array>} 予約オブジェクトの配列
 */
async function getBookingsByUser(userId, userType) {
  try {
    // ユーザータイプに応じたフィールド名を決定
    const fieldName = userType === 'guide' ? 'guideId' : 'touristId';
    
    // Firestoreからデータを取得
    const snapshot = await db.collection('bookings')
      .where(fieldName, '==', userId)
      .orderBy('bookingDate', 'desc')
      .get();
    
    // 結果を配列に変換
    const bookings = [];
    snapshot.forEach(doc => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('予約データの取得に失敗しました:', error);
    throw error;
  }
}

/**
 * 予約状態を更新する関数
 * @param {string} bookingId - 予約ID
 * @param {string} status - 新しい予約状態
 * @returns {Promise<void>}
 */
async function updateBookingStatus(bookingId, status) {
  try {
    await db.collection('bookings').doc(bookingId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`予約状態を更新しました - ID: ${bookingId}, 新しい状態: ${status}`);
  } catch (error) {
    console.error('予約状態の更新に失敗しました:', error);
    throw error;
  }
}

/**
 * 決済情報をFirestoreに保存する関数
 * @param {Object} paymentData - 決済情報オブジェクト
 * @returns {Promise<string>} 生成された決済ID
 */
async function createPayment(paymentData) {
  try {
    // 決済データにタイムスタンプを追加
    const paymentWithTimestamp = {
      ...paymentData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending' // 初期状態は保留中
    };
    
    // Firestoreに決済データを保存
    const docRef = await db.collection('payments').add(paymentWithTimestamp);
    console.log('決済データを保存しました。ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('決済データの保存に失敗しました:', error);
    throw error;
  }
}

/**
 * 決済状態を更新する関数
 * @param {string} paymentId - 決済ID
 * @param {string} status - 新しい決済状態
 * @returns {Promise<void>}
 */
async function updatePaymentStatus(paymentId, status) {
  try {
    await db.collection('payments').doc(paymentId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`決済状態を更新しました - ID: ${paymentId}, 新しい状態: ${status}`);
  } catch (error) {
    console.error('決済状態の更新に失敗しました:', error);
    throw error;
  }
}

// モジュールとしてエクスポート
module.exports = {
  admin,
  db,
  createBooking,
  getBookingsByUser,
  updateBookingStatus,
  createPayment,
  updatePaymentStatus
};