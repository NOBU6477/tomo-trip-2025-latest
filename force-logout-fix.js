/**
 * 強制ログアウト修正システム
 * 他のスクリプトによる干渉を防ぎ、確実にログアウト状態を維持
 */

(function() {
  'use strict';

  let isLoggingOut = false;

  /**
   * 完全ログアウト処理
   */
  function performCompleteLogout() {
    if (isLoggingOut) return;
    isLoggingOut = true;

    console.log('強制ログアウト処理を開始');

    try {
      // 1. セッションストレージを完全クリア
      sessionStorage.clear();

      // 2. ローカルストレージからユーザー関連データを削除
      const keysToRemove = [
        'currentUser',
        'touristData', 
        'guideData',
        'guideRegistrationData',
        'latestGuideRegistration',
        'guideBasicData',
        'userPreferences',
        'isLoggedIn',
        'userType',
        'guideRegistrationCompleted'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // 3. ガイドプロフィールデータからユーザー情報をクリア
      try {
        const profiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
        localStorage.setItem('guideProfiles', JSON.stringify({}));
      } catch (e) {
        localStorage.removeItem('guideProfiles');
      }

      // 4. 他のスクリプトによる自動復元を防ぐ
      preventAutoRestore();

      console.log('ログアウト処理完了');
      return true;

    } catch (error) {
      console.error('ログアウト処理エラー:', error);
      return false;
    }
  }

  /**
   * 自動復元を防ぐ
   */
  function preventAutoRestore() {
    // setIntervalやsetTimeoutによる自動復元を無効化
    const originalSetItem = sessionStorage.setItem;
    const originalSetItem2 = localStorage.setItem;

    // 一時的にストレージの書き込みを制限
    let blockWrites = true;
    
    sessionStorage.setItem = function(key, value) {
      if (blockWrites && (key === 'currentUser' || key === 'isLoggedIn' || key === 'userType')) {
        console.log('ログアウト後のユーザーデータ復元を阻止:', key);
        return;
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.setItem = function(key, value) {
      if (blockWrites && (key === 'currentUser' || key === 'guideData' || key === 'touristData')) {
        console.log('ログアウト後のユーザーデータ復元を阻止:', key);
        return;
      }
      return originalSetItem2.call(this, key, value);
    };

    // 3秒後に制限を解除
    setTimeout(() => {
      blockWrites = false;
      sessionStorage.setItem = originalSetItem;
      localStorage.setItem = originalSetItem2;
      console.log('ストレージ書き込み制限を解除');
    }, 3000);
  }

  /**
   * UI状態をログアウト状態に更新
   */
  function updateUIToLoggedOut() {
    // ユーザーメニューを削除
    const userMenus = document.querySelectorAll('#nav-user-menu, #navbar-user-area .dropdown, [id*="user-menu"]');
    userMenus.forEach(menu => {
      if (menu) menu.remove();
    });

    // ログイン/登録ボタンを表示
    const loginButtons = document.querySelectorAll('[data-key="login"], [data-key="register"]');
    loginButtons.forEach(btn => {
      if (btn) btn.style.display = 'block';
    });

    // ナビバーのユーザーエリアをクリア
    const navbarUserArea = document.getElementById('navbar-user-area');
    if (navbarUserArea) {
      navbarUserArea.innerHTML = `
        <a href="#" class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
          ログイン
        </a>
        <a href="#" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#registerModal">
          新規登録
        </a>
      `;
    }

    console.log('UIをログアウト状態に更新');
  }

  /**
   * 強制ログアウト実行
   */
  function executeForceLogout() {
    const success = performCompleteLogout();
    
    if (success) {
      updateUIToLoggedOut();
      
      // 成功メッセージ表示
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        font-weight: bold;
      `;
      message.textContent = 'ログアウトしました';
      document.body.appendChild(message);

      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 3000);

      // ページをリロードして確実にリセット
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  /**
   * ログアウト処理をオーバーライド
   */
  window.handleLogout = function() {
    if (confirm('ログアウトしますか？')) {
      executeForceLogout();
    }
  };

  window.logout = window.handleLogout;

  /**
   * ログアウトボタンを設定
   */
  function setupLogoutButtons() {
    const selectors = [
      '#profile-logout-btn',
      '#top-logout-btn', 
      '[id*="logout"]',
      '.logout-btn',
      'a[href="#logout"]'
    ];

    selectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        button.removeEventListener('click', window.handleLogout);
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.handleLogout();
        });
      });
    });
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogoutButtons);
  } else {
    setupLogoutButtons();
  }

  // 動的に追加されるボタンにも対応
  setTimeout(setupLogoutButtons, 1000);
  setTimeout(setupLogoutButtons, 3000);

  console.log('強制ログアウト修正システム初期化完了');
})();