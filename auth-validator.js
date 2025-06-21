/**
 * 統一認証バリデーター
 * すべての認証チェックを一元管理し、認証バイパスを防止
 */

(function() {
  'use strict';

  // 有効な認証クレデンシャル（本番では外部サービスから取得）
  const VALID_CREDENTIALS = [
    { email: 'test@example.com', password: 'password', name: 'テストユーザー' },
    { email: 'tourist@test.com', password: 'test123', name: '観光客テスト' }
  ];

  /**
   * 認証クレデンシャルを検証
   */
  function validateCredentials(email, password) {
    return VALID_CREDENTIALS.find(cred => 
      cred.email === email && cred.password === password
    );
  }

  /**
   * 保存された認証データの有効性を検証
   */
  function validateStoredAuthData(dataString) {
    if (!dataString) return false;

    try {
      const parsedData = JSON.parse(dataString);
      
      // 必須フィールドの存在確認
      const hasRequiredFields = parsedData && 
                               parsedData.email && 
                               parsedData.type === 'tourist' &&
                               parsedData.id &&
                               parsedData.name;

      // メールアドレスの形式確認
      const isValidEmail = typeof parsedData.email === 'string' && 
                          parsedData.email.includes('@') && 
                          parsedData.email.length > 5;

      // 認証されたユーザーかどうかの確認
      const isAuthenticatedUser = VALID_CREDENTIALS.some(cred => 
        cred.email === parsedData.email && cred.name === parsedData.name
      );

      return hasRequiredFields && isValidEmail && isAuthenticatedUser;
    } catch (e) {
      console.error('認証データの解析に失敗:', e);
      return false;
    }
  }

  /**
   * 現在のログイン状態を確認
   */
  function getCurrentLoginStatus() {
    const touristData = localStorage.getItem('touristData');
    const sessionData = sessionStorage.getItem('currentUser');

    // 両方のストレージデータを検証
    const isLocalStorageValid = validateStoredAuthData(touristData);
    const isSessionValid = validateStoredAuthData(sessionData);

    // どちらか一方でも無効な場合は全て削除
    if (touristData && !isLocalStorageValid) {
      console.log('無効なlocalStorageデータを削除');
      localStorage.removeItem('touristData');
    }

    if (sessionData && !isSessionValid) {
      console.log('無効なsessionStorageデータを削除');
      sessionStorage.removeItem('currentUser');
    }

    // 両方が有効な場合のみログイン済みとみなす
    return isLocalStorageValid && isSessionValid;
  }

  /**
   * 不正な認証データをクリーンアップ
   */
  function cleanupInvalidAuthData() {
    const touristData = localStorage.getItem('touristData');
    const sessionData = sessionStorage.getItem('currentUser');

    if (touristData && !validateStoredAuthData(touristData)) {
      localStorage.removeItem('touristData');
      console.log('不正なtouristDataを削除しました');
    }

    if (sessionData && !validateStoredAuthData(sessionData)) {
      sessionStorage.removeItem('currentUser');
      console.log('不正なsessionDataを削除しました');
    }

    // グローバル変数もリセット
    if (window.touristLoggedIn !== undefined) {
      window.touristLoggedIn = getCurrentLoginStatus();
    }
    if (window.currentTouristData !== undefined && !getCurrentLoginStatus()) {
      window.currentTouristData = null;
    }
  }

  /**
   * 安全な認証データ保存
   */
  function saveAuthenticationData(authenticatedUser) {
    const authData = {
      id: 'tourist_' + Date.now(),
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      type: 'tourist',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('touristData', JSON.stringify(authData));
    sessionStorage.setItem('currentUser', JSON.stringify(authData));

    return authData;
  }

  /**
   * 完全ログアウト処理
   */
  function performCompleteLogout() {
    // 認証データを完全削除
    localStorage.removeItem('touristData');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('pendingGuideId');

    // グローバル変数をリセット
    if (window.touristLoggedIn !== undefined) {
      window.touristLoggedIn = false;
    }
    if (window.currentTouristData !== undefined) {
      window.currentTouristData = null;
    }

    console.log('完全ログアウト処理完了');
  }

  // ページ読み込み時に認証データをクリーンアップ
  document.addEventListener('DOMContentLoaded', function() {
    cleanupInvalidAuthData();
  });

  // 定期的な認証状態チェック（5秒ごと）
  setInterval(cleanupInvalidAuthData, 5000);

  // グローバルに公開
  window.AuthValidator = {
    validateCredentials,
    validateStoredAuthData,
    getCurrentLoginStatus,
    cleanupInvalidAuthData,
    saveAuthenticationData,
    performCompleteLogout
  };

  console.log('統一認証バリデーター初期化完了');
})();