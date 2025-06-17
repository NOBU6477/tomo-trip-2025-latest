/**
 * 自動復元防止システム
 * 他のスクリプトによるユーザー状態の自動復元を完全に阻止
 */

(function() {
  'use strict';

  // グローバルフラグでログアウト状態を管理
  window.isLoggedOut = false;
  window.preventUserRestore = false;

  /**
   * 自動復元スクリプトを無効化
   */
  function disableAutoRestoreScripts() {
    // session-sync-fix.jsを無効化
    window.sessionSyncLoaded = true;
    window.sessionSyncFixApplied = true;

    // homepage-logout-sync.jsの定期チェックを無効化
    if (window.HomepageLogoutSync) {
      window.HomepageLogoutSync.prototype.setupPeriodicCheck = function() {
        console.log('定期チェックを無効化しました');
      };
    }

    // 既存のsetIntervalを停止
    const highestId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestId; i++) {
      clearInterval(i);
      clearTimeout(i);
    }

    console.log('自動復元スクリプトを無効化しました');
  }

  /**
   * ストレージ操作をオーバーライド
   */
  function overrideStorageOperations() {
    const originalSetItem = sessionStorage.setItem;
    const originalSetItem2 = localStorage.setItem;

    sessionStorage.setItem = function(key, value) {
      if (window.preventUserRestore && (
        key === 'currentUser' || 
        key === 'isLoggedIn' || 
        key === 'userType' ||
        key === 'guideRegistrationCompleted'
      )) {
        console.log('ログアウト後のデータ復元を阻止:', key);
        return;
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.setItem = function(key, value) {
      if (window.preventUserRestore && (
        key === 'currentUser' || 
        key === 'touristData' || 
        key === 'guideData'
      )) {
        console.log('ログアウト後のデータ復元を阻止:', key);
        return;
      }
      return originalSetItem2.call(this, key, value);
    };
  }

  /**
   * 完全ログアウト処理
   */
  function executeCompleteLogout() {
    console.log('完全ログアウト処理開始');

    // フラグ設定
    window.isLoggedOut = true;
    window.preventUserRestore = true;

    // 自動復元スクリプトを無効化
    disableAutoRestoreScripts();

    // 全データクリア
    sessionStorage.clear();
    
    const keysToRemove = [
      'currentUser', 'touristData', 'guideData', 'guideRegistrationData',
      'latestGuideRegistration', 'guideBasicData', 'userPreferences',
      'isLoggedIn', 'userType', 'guideRegistrationCompleted'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // プロフィールデータクリア
    localStorage.removeItem('guideProfiles');

    // UI更新
    updateUIToLoggedOut();

    // 5秒後に復元防止を解除
    setTimeout(() => {
      window.preventUserRestore = false;
      console.log('復元防止を解除');
    }, 5000);

    console.log('完全ログアウト処理完了');
  }

  /**
   * UIをログアウト状態に更新
   */
  function updateUIToLoggedOut() {
    // ユーザーメニューを削除
    const userMenus = document.querySelectorAll(
      '#nav-user-menu, #navbar-user-area .dropdown, [id*="user-menu"], .user-menu'
    );
    userMenus.forEach(menu => menu.remove());

    // ナビバーを未ログイン状態に戻す
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

    // 右上のユーザー表示を削除
    const userDisplays = document.querySelectorAll('[class*="user-"], .navbar-text');
    userDisplays.forEach(display => {
      if (display.textContent.includes('ユーザー') || display.textContent.includes('さん')) {
        display.remove();
      }
    });

    console.log('UIをログアウト状態に更新');
  }

  /**
   * ログアウトボタンの設定
   */
  function setupLogoutHandlers() {
    const logoutSelectors = [
      '#profile-logout-btn', '#top-logout-btn', '[id*="logout"]',
      '.logout-btn', 'a[href="#logout"]', '[data-action="logout"]'
    ];

    logoutSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          if (confirm('ログアウトしますか？')) {
            executeCompleteLogout();
            
            // 成功メッセージ
            const msg = document.createElement('div');
            msg.style.cssText = `
              position: fixed; top: 20px; right: 20px; z-index: 9999;
              background: #28a745; color: white; padding: 15px 20px;
              border-radius: 5px; font-weight: bold;
            `;
            msg.textContent = 'ログアウトしました';
            document.body.appendChild(msg);

            setTimeout(() => msg.remove(), 3000);
            
            // ページリロード
            setTimeout(() => window.location.reload(), 1000);
          }
        });
      });
    });
  }

  // 初期化処理
  function initialize() {
    // ストレージ操作をオーバーライド
    overrideStorageOperations();

    // 自動復元スクリプトを無効化
    disableAutoRestoreScripts();

    // ログアウトハンドラーを設定
    setupLogoutHandlers();

    // グローバル関数として公開
    window.handleLogout = executeCompleteLogout;
    window.logout = executeCompleteLogout;

    console.log('自動復元防止システム初期化完了');
  }

  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // 遅延実行で確実に適用
  setTimeout(initialize, 500);
  setTimeout(setupLogoutHandlers, 1000);
  setTimeout(setupLogoutHandlers, 3000);

})();