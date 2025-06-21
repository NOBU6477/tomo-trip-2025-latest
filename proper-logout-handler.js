/**
 * 適切なログアウト処理ハンドラー
 * セッション永続化システムと連携して正しくログアウトを実行
 */

(function() {
  'use strict';

  console.log('適切なログアウトハンドラー初期化');

  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    setupLogoutHandlers();
    createLogoutFunction();
  });

  /**
   * ログアウト処理の作成
   */
  function createLogoutFunction() {
    // グローバルログアウト関数を作成
    window.properLogout = function() {
      if (confirm('ログアウトしますか？')) {
        executeLogout();
      }
    };

    // 既存のログアウト関数をオーバーライド
    window.logout = window.properLogout;
    window.handleLogout = window.properLogout;
    window.touristLogout = window.properLogout;
  }

  /**
   * ログアウト実行
   */
  function executeLogout() {
    console.log('ログアウト処理開始');
    
    // ログアウト中フラグを設定（セッション保護を無効化）
    window.isLoggingOut = true;
    window.allowLogout = true;
    
    try {
      // 統一認証バリデーターを使用してログアウト
      if (window.AuthValidator) {
        window.AuthValidator.performCompleteLogout();
      } else {
        // フォールバック処理
        localStorage.removeItem('touristData');
        localStorage.removeItem('guideData');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('pendingGuideId');
        
        // グローバル変数をリセット
        if (window.touristLoggedIn !== undefined) {
          window.touristLoggedIn = false;
        }
        if (window.currentTouristData !== undefined) {
          window.currentTouristData = null;
        }
      }

      console.log('ログアウト処理完了');
      
      // UIを更新
      updateUIAfterLogout();
      
      // 成功メッセージを表示
      showLogoutMessage();
      
      // ページをリダイレクト
      setTimeout(() => {
        if (window.location.pathname.includes('guide-details.html') || 
            window.location.pathname.includes('guide-profile.html')) {
          window.location.href = 'index.html';
        } else {
          window.location.reload();
        }
      }, 1500);
      
    } catch (error) {
      console.error('ログアウトエラー:', error);
      // エラーが発生してもページをリロード
      window.location.reload();
    } finally {
      // フラグをリセット
      setTimeout(() => {
        window.isLoggingOut = false;
        window.allowLogout = false;
      }, 2000);
    }
  }

  /**
   * ログアウト後のUI更新
   */
  function updateUIAfterLogout() {
    // ユーザーメニューを非表示
    const userMenus = document.querySelectorAll('#nav-user-menu, .user-menu, [id*="user-menu"]');
    userMenus.forEach(menu => {
      menu.classList.add('d-none');
    });

    // ログインボタンを表示
    const loginButtons = document.querySelectorAll('#nav-login-btn, .login-btn');
    loginButtons.forEach(btn => {
      btn.classList.remove('d-none');
    });

    // ナビゲーションエリアをリセット
    const navUserArea = document.getElementById('navbar-user-area');
    if (navUserArea) {
      navUserArea.innerHTML = `
        <a href="#" class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
          ログイン
        </a>
        <div class="dropdown">
          <button class="btn btn-light dropdown-toggle" type="button" id="registerDropdown" data-bs-toggle="dropdown">
            新規登録
          </button>
          <ul class="dropdown-menu register-dropdown">
            <li>
              <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#registerTouristModal">
                <div class="d-flex align-items-center">
                  <div class="icon-container tourist-icon">
                    <i class="bi bi-person"></i>
                  </div>
                  <div>
                    <div class="fw-bold">観光客として登録</div>
                    <div class="text-muted">ガイドを探して予約しましょう</div>
                  </div>
                </div>
              </a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#registerGuideModal">
                <div class="d-flex align-items-center">
                  <div class="icon-container guide-icon">
                    <i class="bi bi-map"></i>
                  </div>
                  <div>
                    <div class="fw-bold">ガイドとして登録</div>
                    <div class="text-muted">あなたの知識と経験を共有しましょう</div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      `;
    }

    // ボディからユーザータイプ属性を削除
    document.body.removeAttribute('data-user-type');
  }

  /**
   * ログアウトメッセージを表示
   */
  function showLogoutMessage() {
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
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;
    message.textContent = 'ログアウトしました';
    document.body.appendChild(message);

    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 3000);
  }

  /**
   * ログアウトボタンのイベントハンドラー設定
   */
  function setupLogoutHandlers() {
    // 様々なログアウトボタンセレクター
    const logoutSelectors = [
      '#logout-btn',
      '#profile-logout-btn',
      '#top-logout-btn',
      '.logout-btn',
      '[id*="logout"]',
      'a[href="#logout"]',
      '[data-action="logout"]'
    ];

    logoutSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => {
        // 既存のイベントリスナーを削除
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
        }
        
        // 新しいイベントリスナーを追加
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.properLogout();
        });
      });
    });

    // 動的に追加されるログアウトボタンに対応
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // ログアウトボタンかどうかを判定
      if (target.id && target.id.includes('logout') ||
          target.className && target.className.includes('logout') ||
          target.textContent && target.textContent.includes('ログアウト') ||
          target.getAttribute('data-action') === 'logout') {
        
        e.preventDefault();
        e.stopPropagation();
        window.properLogout();
      }
    });
  }

  console.log('適切なログアウトハンドラー初期化完了');
})();