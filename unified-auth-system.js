/**
 * 統一認証システム
 * 全ての認証処理を一元管理し、競合を防止
 */

(function() {
  'use strict';

  // 有効な認証クレデンシャル
  const VALID_CREDENTIALS = [
    { email: 'demo@tomotrip.com', password: 'demo2024', name: 'デモユーザー' },
    { email: 'tourist@tomotrip.com', password: 'tourist123', name: '観光客' }
  ];

  let isInitialized = false;

  /**
   * 初期化
   */
  function initialize() {
    if (isInitialized) return;
    isInitialized = true;

    console.log('統一認証システム初期化');
    
    // ページ読み込み完了後に認証フォームを設定
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupAuthenticationForms);
    } else {
      setupAuthenticationForms();
    }

    // アラートコンテナを作成
    createAlertContainer();
  }

  /**
   * 認証フォームの設定
   */
  function setupAuthenticationForms() {
    // メインログインフォーム
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      // 既存のイベントリスナーを削除
      const newForm = loginForm.cloneNode(true);
      loginForm.parentNode.replaceChild(newForm, loginForm);
      
      newForm.addEventListener('submit', handleLogin);
      console.log('メインログインフォームを設定しました');
    }

    // 観光客専用ログインフォーム
    const touristForm = document.getElementById('tourist-login-form');
    if (touristForm) {
      const newTouristForm = touristForm.cloneNode(true);
      touristForm.parentNode.replaceChild(newTouristForm, touristForm);
      
      newTouristForm.addEventListener('submit', handleTouristLogin);
      console.log('観光客専用ログインフォームを設定しました');
    }

    // ガイド詳細リンクの設定
    setupGuideDetailLinks();
  }

  /**
   * メインログイン処理
   */
  async function handleLogin(e) {
    e.preventDefault();
    
    const userType = document.querySelector('input[name="login-user-type"]:checked')?.value || 'tourist';
    
    if (userType !== 'tourist') {
      showAlert('現在は観光客ログインのみ対応しています', 'info');
      return;
    }

    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      showAlert('メールアドレスとパスワードを入力してください', 'danger');
      return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent || 'ログイン';
    
    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '認証中...';
      }

      const result = await authenticateUser(email, password);
      
      if (result.success) {
        saveAuthenticationData(result.user);
        updateUI(true, result.user);
        closeModal('loginModal');
        
        showAlert('ログインしました', 'success');
        
        // ペンディング中のガイドIDがあるかチェック（リダイレクト無効化）
        const pendingGuideId = sessionStorage.getItem('pendingGuideId');
        if (pendingGuideId) {
          console.log('ペンディングガイドID:', pendingGuideId, 'リダイレクトを無効化');
          // sessionStorage.removeItem('pendingGuideId'); // 削除せずに保持
          // window.location.href = `guide-details.html?id=${pendingGuideId}`; // リダイレクト無効化
        }
      } else {
        showAlert(result.error, 'danger');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      showAlert('認証処理中にエラーが発生しました', 'danger');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  }

  /**
   * 観光客専用ログイン処理
   */
  async function handleTouristLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('tourist-login-email')?.value;
    const password = document.getElementById('tourist-login-password')?.value;

    if (!email || !password) {
      showAlert('メールアドレスとパスワードを入力してください', 'danger');
      return;
    }

    try {
      const result = await authenticateUser(email, password);
      
      if (result.success) {
        saveAuthenticationData(result.user);
        updateUI(true, result.user);
        closeModal('loginTouristModal');
        showAlert('ログインしました', 'success');
      } else {
        showAlert(result.error, 'danger');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      showAlert('認証処理中にエラーが発生しました', 'danger');
    }
  }

  /**
   * 認証処理
   */
  function authenticateUser(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = VALID_CREDENTIALS.find(cred => 
          cred.email === email && cred.password === password
        );
        
        if (user) {
          resolve({
            success: true,
            user: {
              id: 'tourist_' + Date.now(),
              email: user.email,
              name: user.name,
              type: 'tourist'
            }
          });
        } else {
          resolve({
            success: false,
            error: 'メールアドレスまたはパスワードが正しくありません'
          });
        }
      }, 300);
    });
  }

  /**
   * 認証データを保存
   */
  function saveAuthenticationData(user) {
    const authData = {
      ...user,
      timestamp: Date.now()
    };
    
    localStorage.setItem('touristData', JSON.stringify(authData));
    sessionStorage.setItem('currentUser', JSON.stringify(authData));
    
    // グローバル変数を更新
    if (window.touristLoggedIn !== undefined) {
      window.touristLoggedIn = true;
    }
    if (window.currentTouristData !== undefined) {
      window.currentTouristData = authData;
    }
  }

  /**
   * 認証状態を確認
   */
  function isAuthenticated() {
    try {
      const touristData = localStorage.getItem('touristData');
      const sessionData = sessionStorage.getItem('currentUser');
      
      if (!touristData || !sessionData) return false;
      
      const parsed = JSON.parse(touristData);
      return parsed && parsed.email && parsed.type === 'tourist';
    } catch (e) {
      return false;
    }
  }

  /**
   * 現在のユーザーを取得
   */
  function getCurrentUser() {
    try {
      const touristData = localStorage.getItem('touristData');
      return touristData ? JSON.parse(touristData) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * ログアウト処理
   */
  function logout() {
    localStorage.removeItem('touristData');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('pendingGuideId');
    
    if (window.touristLoggedIn !== undefined) {
      window.touristLoggedIn = false;
    }
    if (window.currentTouristData !== undefined) {
      window.currentTouristData = null;
    }
    
    updateUI(false);
    showAlert('ログアウトしました', 'info');
    
    // ページによってはリダイレクト
    if (window.location.pathname.includes('guide-details') || 
        window.location.pathname.includes('profile')) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  }

  /**
   * UIを更新
   */
  function updateUI(isLoggedIn, user = null) {
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navUserMenu = document.getElementById('nav-user-menu');
    const navUserName = document.getElementById('nav-user-name');
    
    if (navLoginBtn && navUserMenu) {
      if (isLoggedIn && user) {
        navLoginBtn.classList.add('d-none');
        navUserMenu.classList.remove('d-none');
        
        if (navUserName) {
          navUserName.textContent = user.name;
        }
        
        document.body.setAttribute('data-user-type', 'tourist');
      } else {
        navLoginBtn.classList.remove('d-none');
        navUserMenu.classList.add('d-none');
        document.body.removeAttribute('data-user-type');
      }
    }
  }

  /**
   * ガイド詳細リンクの設定
   */
  function setupGuideDetailLinks() {
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      if (target.classList.contains('guide-details-link') ||
          target.hasAttribute('data-guide-id') ||
          (target.classList.contains('btn') && target.textContent.includes('詳細を見る'))) {
        
        e.preventDefault();
        e.stopPropagation();
        
        let guideId = target.getAttribute('data-guide-id');
        if (!guideId) {
          const guideCard = target.closest('.guide-card');
          if (guideCard) {
            guideId = guideCard.getAttribute('data-guide-id');
          }
        }

        if (!guideId) {
          console.error('ガイドIDが見つかりません');
          return;
        }

        if (isAuthenticated()) {
          window.location.href = `guide-details.html?id=${guideId}`;
        } else {
          sessionStorage.setItem('pendingGuideId', guideId);
          if (typeof showTouristLoginPrompt === 'function') {
            showTouristLoginPrompt(guideId);
          }
        }
      }
    });
  }

  /**
   * モーダルを閉じる
   */
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && window.bootstrap) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  /**
   * アラートコンテナを作成
   */
  function createAlertContainer() {
    if (!document.getElementById('alert-container')) {
      const container = document.createElement('div');
      container.id = 'alert-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        z-index: 9999;
      `;
      document.body.appendChild(container);
    }
  }

  /**
   * アラート表示
   */
  function showAlert(message, type = 'info') {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(alert);

    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  // 高速切り替わり防止のフラグ
  let redirectInProgress = false;

  // グローバルAPIとして公開
  window.UnifiedAuth = {
    isAuthenticated,
    getCurrentUser,
    logout,
    requireAuth: () => {
      if (!isAuthenticated()) {
        // 既にリダイレクト中の場合は何もしない
        if (redirectInProgress) return false;
        
        redirectInProgress = true;
        const urlParams = new URLSearchParams(window.location.search);
        const guideId = urlParams.get('id');
        if (guideId) {
          sessionStorage.setItem('pendingGuideId', guideId);
        }
        
        // 登録促進モーダルを表示（ページ遷移なし）
        if (typeof showTouristLoginPrompt === 'function') {
          showTouristLoginPrompt();
        } else {
          console.log('統一認証システム - リダイレクト無効化');
          // setTimeout(() => {
          //   window.location.replace('login-required.html');
          // }, 200);
        }
        return false;
      }
      return true;
    }
  };

  // 初期化
  initialize();

  console.log('統一認証システム準備完了');
})();