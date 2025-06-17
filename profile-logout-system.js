/**
 * プロフィールページログアウトシステム
 * ユーザーメニューとログアウト機能を完全実装
 */

class ProfileLogoutSystem {
  constructor() {
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    if (window.location.pathname.includes('guide-profile.html')) {
      this.createUserMenu();
      this.setupLogoutFunction();
      console.log('プロフィールログアウトシステム初期化完了');
    }
  }

  /**
   * ユーザーメニューを作成
   */
  createUserMenu() {
    const userArea = document.getElementById('navbar-user-area');
    if (!userArea) return;

    // 現在のユーザー情報を取得
    const currentUser = this.getCurrentUser();
    const userName = currentUser ? currentUser.name : '優';

    // ユーザーメニューHTML
    const userMenuHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" 
                type="button" 
                id="userMenuDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false">
          <i class="bi bi-person-circle me-2"></i>
          ${userName}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
          <li>
            <h6 class="dropdown-header d-flex align-items-center">
              <i class="bi bi-person-badge me-2"></i>
              ガイドアカウント
            </h6>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item" href="guide-profile.html">
              <i class="bi bi-person-gear me-2"></i>
              プロフィール編集
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="index.html">
              <i class="bi bi-house me-2"></i>
              ホームページ
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" id="view-guide-cards">
              <i class="bi bi-card-list me-2"></i>
              ガイド一覧を見る
            </a>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item text-danger" href="#" id="logout-button">
              <i class="bi bi-box-arrow-right me-2"></i>
              ログアウト
            </a>
          </li>
        </ul>
      </div>
    `;

    userArea.innerHTML = userMenuHTML;

    // ガイド一覧表示ボタンのイベント
    const viewGuideCardsBtn = document.getElementById('view-guide-cards');
    if (viewGuideCardsBtn) {
      viewGuideCardsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.viewGuideCards();
      });
    }

    // ログアウトボタンのイベント
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }
  }

  /**
   * ログアウト機能を設定
   */
  setupLogoutFunction() {
    // グローバル関数として登録（他のスクリプトからも呼び出し可能）
    window.logout = () => this.handleLogout();
    window.handleLogout = () => this.handleLogout();
  }

  /**
   * ログアウト処理
   */
  handleLogout() {
    console.log('ログアウト処理を開始');

    // 確認ダイアログを表示
    const confirmLogout = confirm('ログアウトしますか？\n\n注意：保存されていない変更は失われます。');
    
    if (!confirmLogout) {
      console.log('ログアウトがキャンセルされました');
      return;
    }

    // ローディング表示
    this.showLogoutProgress();

    // セッションデータをクリア
    this.clearSessionData();

    // ローカルストレージから一時データをクリア
    this.clearTemporaryData();

    // ログアウト完了メッセージ
    this.showLogoutSuccess();

    // ホームページにリダイレクト
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }

  /**
   * ログアウト進行状況を表示
   */
  showLogoutProgress() {
    const progressHTML = `
      <div id="logout-progress" class="position-fixed top-50 start-50 translate-middle" style="z-index: 9999;">
        <div class="card shadow-lg border-0">
          <div class="card-body text-center p-4">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">ログアウト中...</span>
            </div>
            <h5 class="card-title">ログアウト中</h5>
            <p class="card-text text-muted">しばらくお待ちください...</p>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" style="z-index: 9998;"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', progressHTML);
  }

  /**
   * ログアウト成功メッセージを表示
   */
  showLogoutSuccess() {
    const progressElement = document.getElementById('logout-progress');
    if (progressElement) {
      progressElement.innerHTML = `
        <div class="card shadow-lg border-0">
          <div class="card-body text-center p-4">
            <i class="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
            <h5 class="card-title">ログアウト完了</h5>
            <p class="card-text text-muted">ホームページにリダイレクトしています...</p>
          </div>
        </div>
      `;
    }
  }

  /**
   * セッションデータをクリア
   */
  clearSessionData() {
    const sessionKeys = [
      'currentUser',
      'guideRegistrationData',
      'currentGuideId',
      'guideBasicData',
      'userPreferences'
    ];

    sessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
      console.log(`セッション削除: ${key}`);
    });
  }

  /**
   * 一時データをクリア
   */
  clearTemporaryData() {
    // ガイドセッション関連の一時データのみクリア
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('guide_') || key.startsWith('temp_')) {
        sessionStorage.removeItem(key);
        console.log(`一時データ削除: ${key}`);
      }
    });

    // ローカルストレージから一時的なプロフィール変更をクリア
    const profiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    const currentUserId = sessionStorage.getItem('currentGuideId');
    
    if (currentUserId && profiles[currentUserId]) {
      // 完全に削除せず、一時的な変更のみクリア
      delete profiles[currentUserId].tempChanges;
      localStorage.setItem('guideProfiles', JSON.stringify(profiles));
    }
  }

  /**
   * ガイド一覧を表示
   */
  viewGuideCards() {
    console.log('ガイド一覧を表示');
    
    // 新しいタブでガイド一覧を開く
    const guideListURL = 'index.html#guides';
    window.open(guideListURL, '_blank');
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
   * 緊急ログアウト（エラー時用）
   */
  emergencyLogout() {
    console.log('緊急ログアウトを実行');
    
    // すべてのストレージをクリア
    sessionStorage.clear();
    
    // ページを強制リロード
    window.location.href = 'index.html';
  }
}

// グローバル関数として公開
window.ProfileLogoutSystem = ProfileLogoutSystem;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.profileLogoutSystem = new ProfileLogoutSystem();
  });
} else {
  window.profileLogoutSystem = new ProfileLogoutSystem();
}

// ページ表示時にも初期化
window.addEventListener('pageshow', () => {
  if (!window.profileLogoutSystem) {
    window.profileLogoutSystem = new ProfileLogoutSystem();
  }
});