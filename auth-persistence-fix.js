/**
 * 認証持続性修正スクリプト
 * ページナビゲーション時の認証状態完全保持
 */

(function() {
  'use strict';
  
  console.log('認証持続性修正開始');
  
  // 即座に認証状態を確認し保護
  const existingAuth = localStorage.getItem('touristData');
  if (existingAuth) {
    try {
      const authData = JSON.parse(existingAuth);
      if (authData && authData.type === 'tourist' && authData.isAuthenticated) {
        // 保護フラグを即座設定
        window.protectTouristAuth = true;
        window.authProtectionActive = true;
        window.touristAuthData = authData;
        
        console.log('既存認証を保護:', authData.name);
        
        // 即座にUIを更新
        setTimeout(() => {
          if (typeof updateLoginStateUI === 'function') {
            updateLoginStateUI();
          }
        }, 100);
      }
    } catch (e) {
      console.warn('認証データ解析エラー:', e);
    }
  }
  
  // ページロード完了時の確実な復元
  window.addEventListener('load', function() {
    console.log('ページロード完了 - 認証状態最終確認');
    
    const touristData = localStorage.getItem('touristData');
    if (touristData) {
      try {
        const userData = JSON.parse(touristData);
        if (userData && userData.type === 'tourist' && userData.isAuthenticated) {
          // UI状態を確認して必要に応じて修正
          const registerBtn = document.getElementById('registerDropdown');
          if (registerBtn && registerBtn.textContent.includes('新規登録')) {
            console.log('ページロード後UI不整合検出 - 修正実行');
            if (typeof updateLoginStateUI === 'function') {
              updateLoginStateUI();
            }
          }
          
          // ログインボタンを隠す
          const loginBtn = document.querySelector('button[data-bs-target="#loginModal"]');
          if (loginBtn && loginBtn.style.display !== 'none') {
            loginBtn.style.display = 'none';
          }
        }
      } catch (e) {
        console.warn('ページロード後認証チェックエラー:', e);
      }
    }
  });
  
  // ページ可視性変更時の復元
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      console.log('ページ再表示 - 認証状態復元');
      
      const touristData = localStorage.getItem('touristData');
      if (touristData) {
        try {
          const userData = JSON.parse(touristData);
          if (userData && userData.type === 'tourist' && userData.isAuthenticated) {
            if (typeof updateLoginStateUI === 'function') {
              updateLoginStateUI();
            }
          }
        } catch (e) {
          console.warn('可視性変更時認証チェックエラー:', e);
        }
      }
    }
  });
  
  // フォーカス時の復元
  window.addEventListener('focus', function() {
    console.log('ウィンドウフォーカス - 認証状態復元');
    
    const touristData = localStorage.getItem('touristData');
    if (touristData) {
      try {
        const userData = JSON.parse(touristData);
        if (userData && userData.type === 'tourist' && userData.isAuthenticated) {
          if (typeof updateLoginStateUI === 'function') {
            updateLoginStateUI();
          }
        }
      } catch (e) {
        console.warn('フォーカス時認証チェックエラー:', e);
      }
    }
  });
  
  // より頻繁なUI監視
  setInterval(() => {
    const touristData = localStorage.getItem('touristData');
    const registerBtn = document.getElementById('registerDropdown');
    
    if (touristData && registerBtn) {
      try {
        const userData = JSON.parse(touristData);
        if (userData && userData.type === 'tourist' && userData.isAuthenticated) {
          if (registerBtn.textContent.includes('新規登録')) {
            console.log('UI不整合検出 - 自動修正');
            if (typeof updateLoginStateUI === 'function') {
              updateLoginStateUI();
            }
          }
        }
      } catch (e) {
        console.warn('定期UI監視エラー:', e);
      }
    }
  }, 2000);
  
  console.log('認証持続性修正完了');
})();