/**
 * Firebase統合決済システム
 * Firebaseを使用して決済データを保存・管理するモジュール
 */

// Firebaseからの必要なモジュールをインポート
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Firebase設定
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * 決済情報をFirestoreに保存する関数
 * @param {Object} paymentData - 決済情報オブジェクト
 * @returns {Promise<string>} 作成された決済ドキュメントのID
 */
export async function savePaymentToFirebase(paymentData) {
  try {
    // 決済情報にタイムスタンプを追加
    const paymentWithTimestamp = {
      ...paymentData,
      createdAt: serverTimestamp(),
      status: 'pending' // 初期状態は保留中
    };

    // Firestoreに決済情報を保存
    const docRef = await addDoc(collection(db, "payments"), paymentWithTimestamp);
    console.log("決済情報が保存されました。ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("決済情報の保存に失敗しました:", error);
    throw error;
  }
}

/**
 * 決済状態を更新する関数
 * @param {string} paymentId - 決済ID
 * @param {string} newStatus - 新しい決済状態 ('completed', 'failed', 'refunded')
 * @returns {Promise<void>}
 */
export async function updatePaymentStatus(paymentId, newStatus) {
  try {
    const paymentRef = doc(db, "payments", paymentId);
    await updateDoc(paymentRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    console.log(`決済状態が更新されました - ID: ${paymentId}, 新しい状態: ${newStatus}`);
  } catch (error) {
    console.error("決済状態の更新に失敗しました:", error);
    throw error;
  }
}

/**
 * 決済情報を取得する関数
 * @param {string} paymentId - 決済ID
 * @returns {Promise<Object|null>} 決済情報オブジェクト
 */
export async function getPaymentInfo(paymentId) {
  try {
    const paymentRef = doc(db, "payments", paymentId);
    const paymentSnap = await getDoc(paymentRef);
    
    if (paymentSnap.exists()) {
      return paymentSnap.data();
    } else {
      console.log("指定された決済情報は存在しません");
      return null;
    }
  } catch (error) {
    console.error("決済情報の取得に失敗しました:", error);
    throw error;
  }
}

/**
 * 現在ログインしているユーザーの決済履歴を作成する関数
 * @param {string} paymentId - 決済ID
 * @param {Object} historyData - 決済履歴データ
 * @returns {Promise<string>} 作成された履歴ドキュメントのID
 */
export async function createPaymentHistory(paymentId, historyData) {
  return new Promise((resolve, reject) => {
    // 現在のユーザー状態を確認
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // ユーザーIDを履歴データに追加
          const historyWithUser = {
            ...historyData,
            userId: user.uid,
            paymentId: paymentId,
            createdAt: serverTimestamp()
          };
          
          // Firestoreに履歴を保存
          const docRef = await addDoc(collection(db, "payment_history"), historyWithUser);
          console.log("決済履歴が作成されました。ID:", docRef.id);
          resolve(docRef.id);
        } catch (error) {
          console.error("決済履歴の作成に失敗しました:", error);
          reject(error);
        }
      } else {
        reject(new Error("ユーザーがログインしていません"));
      }
    });
  });
}

// モジュールとしてエクスポート
export default {
  savePaymentToFirebase,
  updatePaymentStatus,
  getPaymentInfo,
  createPaymentHistory
};