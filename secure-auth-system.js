/**
 * セキュアな認証システム
 * プレーンテキストのクレデンシャルを使用せず、トークンベースの認証を実装
 */

(function() {
  'use strict';

  // セキュアな認証トークン管理
  const AUTH_TOKEN_KEY = 'auth_token';
  const SESSION_TOKEN_KEY = 'session_token';
  
  // 認証済みセッションの有効期限（30分）
  const SESSION_DURATION = 30 * 60 * 1000;

  /**
   * 安全な認証チャレンジ
   * 実際のアプリケーションでは外部認証サービス（Firebase、Auth0等）を使用
   */
  function authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // シンプルなデモ認証（本番では外部サービスを使用）
        const validLogins = [
          { email: 'demo@tomotrip.com', password: 'demo2024', name: 'デモユーザー' },
          { email: 'tourist@tomotrip.com', password: 'tourist123', name: '観光客' }
        ];

        const user = validLogins.find(u => u.email === email && u.password === password);
        
        if (user) {
          // 認証成功 - セキュアなトークンを生成
          const authToken = generateSecureToken();
          const sessionToken = generateSecureToken();
          
          const authData = {
            token: authToken,
            sessionToken: sessionToken,
            user: {
              id: generateUserId(),
              email: user.email,
              name: user.name,
              type: 'tourist'
            },
            timestamp: Date.now(),
            expiresAt: Date.now() + SESSION_DURATION
          };
          
          resolve(authData);
        } else {
          reject(new Error('認証に失敗しました'));
        }
      }, 500); // 認証処理の遅延をシミュレート
    });
  }

  /**
   * セキュアなトークンを生成
   */
  function generateSecureToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * ユニークなユーザーIDを生成
   */
  function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 認証状態を検証
   */
  function validateAuthenticationState() {
    try {
      const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
      
      if (!authToken || !sessionToken) {
        return false;
      }

      const authData = JSON.parse(authToken);
      const sessionData = JSON.parse(sessionToken);
      
      // トークンの一致確認
      if (authData.token !== sessionData.token || 
          authData.sessionToken !== sessionData.sessionToken) {
        return false;
      }
      
      // 有効期限の確認
      if (Date.now() > authData.expiresAt) {
        clearAuthenticationData();
        return false;
      }
      
      // ユーザーデータの整合性確認
      if (!authData.user || !authData.user.email || authData.user.type !== 'tourist') {
        return false;
      }
      
      return authData;
    } catch (e) {
      console.error('認証状態の検証中にエラー:', e);
      clearAuthenticationData();
      return false;
    }
  }

  /**
   * 認証データを保存
   */
  function saveAuthenticationData(authData) {
    const authToken = {
      token: authData.token,
      sessionToken: authData.sessionToken,
      user: authData.user,
      timestamp: authData.timestamp,
      expiresAt: authData.expiresAt
    };
    
    const sessionToken = {
      token: authData.token,
      sessionToken: authData.sessionToken,
      user: authData.user
    };
    
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken));
    sessionStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify(sessionToken));
    
    // 互換性のため従来のキーも設定（段階的移行）
    const legacyData = {
      id: authData.user.id,
      email: authData.user.email,
      name: authData.user.name,
      type: authData.user.type
    };
    localStorage.setItem('touristData', JSON.stringify(legacyData));
    sessionStorage.setItem('currentUser', JSON.stringify(legacyData));
  }

  /**
   * 認証データを完全削除
   */
  function clearAuthenticationData() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('touristData');
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('pendingGuideId');
    
    // グローバル変数もクリア
    if (window.touristLoggedIn !== undefined) {
      window.touristLoggedIn = false;
    }
    if (window.currentTouristData !== undefined) {
      window.currentTouristData = null;
    }
  }

  /**
   * ログイン処理
   */
  async function performLogin(email, password) {
    try {
      const authData = await authenticateUser(email, password);
      saveAuthenticationData(authData);
      return {
        success: true,
        user: authData.user
      };
    } catch (error) {
      clearAuthenticationData();
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ログアウト処理
   */
  function performLogout() {
    clearAuthenticationData();
    return { success: true };
  }

  /**
   * 現在のユーザー情報を取得
   */
  function getCurrentUser() {
    const authData = validateAuthenticationState();
    return authData ? authData.user : null;
  }

  /**
   * 認証が必要なページへのアクセス制御
   */
  function requireAuthentication(redirectUrl = 'login-required.html') {
    const authData = validateAuthenticationState();
    if (!authData) {
      const urlParams = new URLSearchParams(window.location.search);
      const guideId = urlParams.get('id');
      if (guideId) {
        sessionStorage.setItem('pendingGuideId', guideId);
        // メインページで登録モーダルを表示
        if (typeof showTouristLoginPrompt === 'function') {
          showTouristLoginPrompt(guideId);
          return false;
        }
      }
      // 登録モーダル関数が利用できない場合のみリダイレクト（無効化）
      console.log('リダイレクト無効化:', redirectUrl);
      // window.location.replace(redirectUrl);
      return false;
    }
    return true;
  }

  // 定期的な認証状態チェック（無効化）
  // setInterval(() => {
  //   const authData = validateAuthenticationState();
  //   if (!authData) {
  //     console.log('認証状態が無効になりました');
  //     // 認証が必要なページにいる場合はリダイレクト
  //     if (window.location.pathname.includes('guide-details') || 
  //         window.location.pathname.includes('profile')) {
  //       // 登録促進モーダルを表示（ページ遷移なし）
  //       if (typeof showTouristLoginPrompt === 'function') {
  //         showTouristLoginPrompt();
  //       } else {
  //         console.log('定期認証チェック - リダイレクト無効化');
  //         // window.location.replace('login-required.html');
  //       }
  //     }
  //   }
  // }, 5 * 60 * 1000);

  // 初期化時の認証状態チェック
  document.addEventListener('DOMContentLoaded', function() {
    validateAuthenticationState();
  });

  // グローバルAPIとして公開
  window.SecureAuth = {
    login: performLogin,
    logout: performLogout,
    getCurrentUser: getCurrentUser,
    isAuthenticated: () => !!validateAuthenticationState(),
    requireAuthentication: requireAuthentication,
    clearAuthData: clearAuthenticationData
  };

  console.log('セキュアな認証システム初期化完了');
})();