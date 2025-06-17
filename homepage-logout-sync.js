/**
 * ホームページログアウト同期システム
 * ログアウト後にトップページの表示を正しく更新
 */

class HomepageLogoutSync {
  constructor() {
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
      this.setupLogoutDetection();
      this.checkLoginStatus();
      this.setupPeriodicCheck();
      console.log('ホームページログアウト同期システム初期化');
    }
  }

  /**
   * ログアウト検出システムを設定
   */
  setupLogoutDetection() {
    // ページ表示時にセッション状態をチェック
    window.addEventListener('pageshow', () => {
      this.checkLoginStatus();
    });

    // フォーカス時にもチェック
    window.addEventListener('focus', () => {
      this.checkLoginStatus();
    });

    // sessionStorageの変更を監視
    window.addEventListener('storage', (e) => {
      if (e.key === 'currentUser' || e.key === null) {
        this.checkLoginStatus();
      }
    });

    // より強力なログアウト検出のためのタイマー
    this.setupPeriodicCheck();

    // ページが隠れている時の状態保持
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // ページが再表示された時に状態をチェック
        setTimeout(() => this.checkLoginStatus(), 100);
      }
    });
  }

  /**
   * ログイン状態をチェック
   */
  checkLoginStatus() {
    const currentUser = this.getCurrentUser();
    
    if (currentUser) {
      this.updateUIForLoggedInUser(currentUser);
    } else {
      this.updateUIForLoggedOutUser();
    }
  }

  /**
   * 現在のユーザー情報を取得
   */
  getCurrentUser() {
    try {
      const userJson = sessionStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error('ユーザー情報取得エラー:', e);
      return null;
    }
  }

  /**
   * ログイン状態のUI更新
   */
  updateUIForLoggedInUser(user) {
    console.log('ログイン状態のUI更新:', user.name);

    // ログイン/登録ボタンを非表示
    this.hideLoginRegisterButtons();

    // ユーザーメニューを表示
    this.showUserMenu(user);

    // ユーザータイプ固有の表示
    this.showUserTypeSpecificElements(user);
  }

  /**
   * ログアウト状態のUI更新
   */
  updateUIForLoggedOutUser() {
    console.log('ログアウト状態のUI更新');

    // ユーザーメニューを非表示
    this.hideUserMenu();

    // ログイン/登録ボタンを表示
    this.showLoginRegisterButtons();

    // ユーザータイプ固有の要素を非表示
    this.hideUserTypeSpecificElements();
  }

  /**
   * ログイン/登録ボタンを非表示
   */
  hideLoginRegisterButtons() {
    const selectors = [
      'button[data-bs-target="#loginModal"]',
      '#nav-login-btn',
      '.btn[data-i18n="nav.login"]',
      'button[id*="login"]',
      '#registerDropdown',
      'button[id*="register"]',
      '.btn[data-i18n="nav.register"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'none';
      });
    });
  }

  /**
   * ログイン/登録ボタンを表示
   */
  showLoginRegisterButtons() {
    const selectors = [
      'button[data-bs-target="#loginModal"]',
      '#nav-login-btn',
      '.btn[data-i18n="nav.login"]',
      'button[id*="login"]',
      '#registerDropdown',
      'button[id*="register"]',
      '.btn[data-i18n="nav.register"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = '';
      });
    });
  }

  /**
   * ユーザーメニューを表示
   */
  showUserMenu(user) {
    // 既存のユーザーメニューを探す
    let userMenu = document.getElementById('nav-user-menu');
    
    if (!userMenu) {
      userMenu = this.createUserMenu(user);
    } else {
      this.updateUserMenu(userMenu, user);
    }

    if (userMenu) {
      userMenu.style.display = '';
      userMenu.classList.remove('d-none');
    }
  }

  /**
   * ユーザーメニューを非表示
   */
  hideUserMenu() {
    const userMenu = document.getElementById('nav-user-menu');
    if (userMenu) {
      userMenu.style.display = 'none';
      userMenu.classList.add('d-none');
    }

    // 既存のログアウトボタンも削除
    const logoutButtons = document.querySelectorAll('#logout-btn, .logout-btn');
    logoutButtons.forEach(btn => btn.remove());
  }

  /**
   * ユーザーメニューを作成
   */
  createUserMenu(user) {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return null;

    const userMenuHTML = `
      <li class="nav-item dropdown" id="nav-user-menu">
        <a class="nav-link dropdown-toggle text-white" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle me-1"></i>
          <span id="nav-user-name">${user.name || 'ユーザー'}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
          <li>
            <h6 class="dropdown-header">
              <i class="bi bi-person-badge me-2"></i>
              ${user.userType === 'guide' ? 'ガイドアカウント' : '観光客アカウント'}
            </h6>
          </li>
          <li><hr class="dropdown-divider"></li>
          ${user.userType === 'guide' ? `
          <li>
            <a class="dropdown-item" href="guide-profile.html">
              <i class="bi bi-person-gear me-2"></i>
              プロフィール編集
            </a>
          </li>
          ` : ''}
          <li>
            <a class="dropdown-item" href="index.html">
              <i class="bi bi-house me-2"></i>
              ホーム
            </a>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item text-danger" href="#" id="top-logout-btn">
              <i class="bi bi-box-arrow-right me-2"></i>
              ログアウト
            </a>
          </li>
        </ul>
      </li>
    `;

    navbarNav.insertAdjacentHTML('beforeend', userMenuHTML);

    // ログアウトボタンのイベントを設定
    const logoutBtn = document.getElementById('top-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    return document.getElementById('nav-user-menu');
  }

  /**
   * ユーザーメニューを更新
   */
  updateUserMenu(userMenu, user) {
    const userNameSpan = userMenu.querySelector('#nav-user-name');
    if (userNameSpan) {
      userNameSpan.textContent = user.name || 'ユーザー';
    }
  }

  /**
   * ユーザータイプ固有の要素を表示
   */
  showUserTypeSpecificElements(user) {
    if (user.userType === 'guide') {
      document.querySelectorAll('.guide-only').forEach(el => {
        el.classList.remove('d-none');
        el.style.display = '';
      });
    }

    if (user.userType === 'tourist') {
      document.querySelectorAll('.tourist-only').forEach(el => {
        el.classList.remove('d-none');
        el.style.display = '';
      });
    }
  }

  /**
   * ユーザータイプ固有の要素を非表示
   */
  hideUserTypeSpecificElements() {
    document.querySelectorAll('.guide-only, .tourist-only').forEach(el => {
      el.classList.add('d-none');
      el.style.display = 'none';
    });
  }

  /**
   * ログアウト処理
   */
  handleLogout() {
    const confirmLogout = confirm('ログアウトしますか？');
    
    if (confirmLogout) {
      // セッションデータをクリア
      sessionStorage.clear();
      localStorage.removeItem('currentUser');
      
      // UIを更新
      this.updateUIForLoggedOutUser();
      
      // ページをリロード
      window.location.reload();
    }
  }

  /**
   * 定期的なチェックを設定
   */
  setupPeriodicCheck() {
    // 3秒ごとにログイン状態をチェック
    setInterval(() => {
      this.checkLoginStatus();
    }, 3000);
  }

  /**
   * 強制的にログアウト状態にリセット
   */
  forceLogoutState() {
    console.log('強制ログアウト状態にリセット');
    
    // セッションをクリア
    sessionStorage.clear();
    
    // UIを更新
    this.updateUIForLoggedOutUser();
  }
}

// グローバルに公開
window.HomepageLogoutSync = HomepageLogoutSync;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.homepageLogoutSync = new HomepageLogoutSync();
  });
} else {
  window.homepageLogoutSync = new HomepageLogoutSync();
}

// ページ表示時にも初期化
window.addEventListener('pageshow', () => {
  if (!window.homepageLogoutSync) {
    window.homepageLogoutSync = new HomepageLogoutSync();
  }
});