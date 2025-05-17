/**
 * Firebase関連の機能を提供するクライアントスクリプト
 */

(function() {
  console.log('Firebase クライアント初期化');
  
  // モックモードフラグ
  let mockMode = true;
  
  // モックユーザー情報
  const mockUser = {
    uid: "mock-user-123",
    displayName: "テストユーザー",
    email: "test@example.com",
    phoneNumber: "+819012345678",
    photoURL: null,
    providerId: "phone",
    isAnonymous: false
  };
  
  // アプリ初期化フラグ
  let isInitialized = false;
  
  /**
   * Firebaseを初期化する
   * @param {string} apiKey - Firebase API Key
   * @param {string} projectId - Firebase Project ID
   * @param {string} appId - Firebase App ID
   * @returns {Promise<boolean>} 初期化成功の場合はtrue
   */
  async function initFirebase(apiKey, projectId, appId) {
    if (isInitialized) {
      console.log('Firebase既に初期化済み');
      return true;
    }
    
    // API Keyがモック値の場合はモックモードを使用
    if (!apiKey || apiKey === "mock-api-key") {
      console.log('モックFirebase使用');
      mockMode = true;
      isInitialized = true;
      return false;
    }
    
    try {
      // Firebase設定を作成
      const firebaseConfig = {
        apiKey: apiKey,
        authDomain: `${projectId}.firebaseapp.com`,
        projectId: projectId,
        storageBucket: `${projectId}.appspot.com`,
        appId: appId
      };
      
      // Firebase初期化
      console.log('Firebase実際に初期化');
      firebase.initializeApp(firebaseConfig);
      
      // 実際の初期化
      mockMode = false;
      isInitialized = true;
      console.log('Firebase初期化成功');
      return true;
    } catch (error) {
      console.error('Firebase初期化エラー:', error);
      mockMode = true;
      isInitialized = true; // エラーでも初期化済みとマーク
      return false;
    }
  }
  
  /**
   * サインイン処理
   * @param {string} phoneNumber - 電話番号
   * @returns {Promise<object>} 認証処理結果
   */
  async function signInWithPhone(phoneNumber) {
    if (mockMode) {
      console.log('モック電話認証実行:', phoneNumber);
      // モック認証の情報を返す
      return {
        success: true,
        verificationId: 'mock-verification-id',
        message: 'モードモードでは認証コード「123456」を使用してください'
      };
    }
    
    try {
      // reCAPTCHAの作成 (実際の実装では必要)
      const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
      });
      
      // 電話認証の開始
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
      
      // 認証IDを保存
      window.confirmationResult = confirmationResult;
      
      return {
        success: true,
        verificationId: confirmationResult.verificationId,
        message: 'SMSを送信しました。認証コードを入力してください'
      };
    } catch (error) {
      console.error('電話認証エラー:', error);
      return {
        success: false,
        error: error.message || 'SMS送信に失敗しました'
      };
    }
  }
  
  /**
   * 認証コードを確認
   * @param {string} code - 認証コード
   * @returns {Promise<object>} 認証結果
   */
  async function verifyPhoneCode(code) {
    if (mockMode) {
      console.log('モード認証コード確認:', code);
      
      // テスト用コードの検証
      if (code === '123456') {
        // 認証成功時のモックユーザー情報
        sessionStorage.setItem('user', JSON.stringify(mockUser));
        
        return {
          success: true,
          user: mockUser,
          message: 'モック認証成功'
        };
      } else {
        return {
          success: false,
          error: '無効な認証コードです'
        };
      }
    }
    
    try {
      if (!window.confirmationResult) {
        return {
          success: false,
          error: '認証情報がありません。再度電話番号を送信してください'
        };
      }
      
      // コードの確認
      const result = await window.confirmationResult.confirm(code);
      
      // ユーザー情報をセッションに保存
      sessionStorage.setItem('user', JSON.stringify(result.user));
      
      return {
        success: true,
        user: result.user,
        message: '認証が成功しました'
      };
    } catch (error) {
      console.error('認証コード確認エラー:', error);
      return {
        success: false,
        error: error.message || '認証コードが無効です'
      };
    }
  }
  
  /**
   * 認証状態を確認
   * @returns {Promise<object>} 認証状態
   */
  async function checkAuthState() {
    if (mockMode) {
      // セッションからユーザー情報を取得
      const userJson = sessionStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          return {
            isLoggedIn: true,
            user: user
          };
        } catch (e) {
          console.error('ユーザー情報の解析エラー:', e);
          return { isLoggedIn: false };
        }
      }
      return { isLoggedIn: false };
    }
    
    // 実際のFirebase認証状態チェック
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          resolve({
            isLoggedIn: true,
            user: user
          });
        } else {
          resolve({ isLoggedIn: false });
        }
      });
    });
  }
  
  /**
   * ファイルをアップロード
   * @param {File} file - アップロードするファイル
   * @param {string} path - アップロード先のパス
   * @returns {Promise<object>} アップロード結果
   */
  async function uploadFile(file, path) {
    if (mockMode) {
      console.log('モックファイルアップロード:', path);
      
      // ファイルの内容をDataURLとしてローカルストレージに保存
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          const key = `mock_file_${path}`;
          localStorage.setItem(key, dataUrl);
          
          resolve({
            success: true,
            url: key, // ローカルキーを疑似URLとして返す
            path: path,
            message: 'ファイルがモックアップロードされました'
          });
        };
        reader.onerror = (error) => {
          resolve({
            success: false,
            error: 'ファイル読み込みエラー: ' + error
          });
        };
        reader.readAsDataURL(file);
      });
    }
    
    // 実際のFirebase Storage実装
    try {
      if (!firebase.storage) {
        throw new Error('Firebaseストレージが初期化されていません');
      }
      
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(path);
      
      // ファイルアップロード
      await fileRef.put(file);
      
      // ダウンロードURLを取得
      const downloadUrl = await fileRef.getDownloadURL();
      
      return {
        success: true,
        url: downloadUrl,
        path: path,
        message: 'ファイルがアップロードされました'
      };
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
      return {
        success: false,
        error: error.message || 'ファイルアップロードに失敗しました'
      };
    }
  }
  
  /**
   * ファイルのURLを取得
   * @param {string} path - ファイルパス
   * @returns {Promise<object>} ファイルURL取得結果
   */
  async function getFileUrl(path) {
    if (mockMode) {
      console.log('モックファイルURL取得:', path);
      const key = `mock_file_${path}`;
      const dataUrl = localStorage.getItem(key);
      
      if (dataUrl) {
        return {
          success: true,
          url: dataUrl,
          path: path
        };
      } else {
        return {
          success: false,
          error: 'ファイルが見つかりません'
        };
      }
    }
    
    try {
      if (!firebase.storage) {
        throw new Error('Firebaseストレージが初期化されていません');
      }
      
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(path);
      
      // ダウンロードURLを取得
      const url = await fileRef.getDownloadURL();
      
      return {
        success: true,
        url: url,
        path: path
      };
    } catch (error) {
      console.error('ファイルURL取得エラー:', error);
      return {
        success: false,
        error: error.message || 'ファイルURLの取得に失敗しました'
      };
    }
  }
  
  /**
   * ログアウト処理
   * @returns {Promise<object>} ログアウト結果
   */
  async function signOut() {
    if (mockMode) {
      console.log('モックログアウト実行');
      sessionStorage.removeItem('user');
      return {
        success: true,
        message: 'ログアウトしました'
      };
    }
    
    try {
      await firebase.auth().signOut();
      sessionStorage.removeItem('user');
      return {
        success: true,
        message: 'ログアウトしました'
      };
    } catch (error) {
      console.error('ログアウトエラー:', error);
      return {
        success: false,
        error: error.message || 'ログアウトに失敗しました'
      };
    }
  }
  
  // 関数をグローバルに公開
  window.initFirebase = initFirebase;
  window.firebaseAuth = {
    signInWithPhone,
    verifyPhoneCode,
    checkAuthState,
    signOut
  };
  window.firebaseStorage = {
    uploadFile,
    getFileUrl
  };
  
  console.log('Firebase クライアント設定完了');
})();