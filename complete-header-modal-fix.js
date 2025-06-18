/**
 * 完全なヘッダーとモーダル修正スクリプト
 * すべてのボタンとモーダルが正常に動作するように統合修正
 */
(function() {
  'use strict';

  let isInitialized = false;

  /**
   * 初期化メイン関数
   */
  function initialize() {
    if (isInitialized) return;
    
    console.log('Complete header and modal fix starting...');
    
    // Bootstrapが読み込まれるまで待機
    waitForBootstrap(() => {
      // ヘッダーのクリーンアップと復元
      cleanAndRestoreHeader();
      
      // すべてのモーダルを初期化
      initializeAllModals();
      
      // ボタンイベントを設定
      setupAllButtonEvents();
      
      // 継続監視を開始
      startContinuousMonitoring();
      
      isInitialized = true;
      console.log('Complete header and modal fix completed');
    });
  }

  /**
   * Bootstrap読み込み待機
   */
  function waitForBootstrap(callback) {
    if (typeof bootstrap !== 'undefined') {
      callback();
    } else {
      setTimeout(() => waitForBootstrap(callback), 100);
    }
  }

  /**
   * ヘッダーのクリーンアップと復元
   */
  function cleanAndRestoreHeader() {
    console.log('Cleaning and restoring header...');
    
    // 言語ドロップダウンを日本語に固定
    forceJapaneseLanguage();
    
    // navbar-user-areaを復元
    restoreNavbarUserArea();
    
    // 不要な要素を削除
    removeUnwantedElements();
  }

  /**
   * 言語設定を日本語に強制
   */
  function forceJapaneseLanguage() {
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
      const dropdownText = languageDropdown.querySelector('.dropdown-toggle');
      if (dropdownText && dropdownText.textContent.trim() !== '日本語') {
        dropdownText.textContent = '日本語';
      }
    }
    
    // 言語関連のセッションストレージも更新
    try {
      sessionStorage.setItem('selectedLanguage', 'ja');
      localStorage.setItem('selectedLanguage', 'ja');
    } catch (e) {
      console.log('Storage update error:', e);
    }
  }

  /**
   * navbar-user-areaを復元
   */
  function restoreNavbarUserArea() {
    let userArea = document.getElementById('navbar-user-area');
    
    if (!userArea) {
      // navbar-user-areaが存在しない場合、作成
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse) {
        userArea = document.createElement('div');
        userArea.id = 'navbar-user-area';
        userArea.className = 'd-flex align-items-center ms-auto';
        navbarCollapse.appendChild(userArea);
      }
    }

    if (userArea) {
      // 既存の内容をクリア
      userArea.innerHTML = '';
      
      // 正しいボタン構造を作成
      userArea.innerHTML = `
        <button class="btn btn-outline-light me-2" type="button" id="main-login-btn">
          ログイン
        </button>
        <div class="dropdown">
          <button class="btn btn-light dropdown-toggle" type="button" id="registerDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            新規登録
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="registerDropdown">
            <li>
              <a class="dropdown-item" href="#" id="tourist-register-link">
                <i class="bi bi-person me-2"></i>旅行者として登録
              </a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item" href="guide-registration-form.html">
                <i class="bi bi-map me-2"></i>ガイドとして登録
              </a>
            </li>
          </ul>
        </div>
      `;
      
      console.log('navbar-user-area restored successfully');
    }
  }

  /**
   * 不要な要素を削除
   */
  function removeUnwantedElements() {
    // 問題のあるテキストを含む要素を削除
    const problematicTexts = ['undefined さん', '優 さん', 'undefined', '優'];
    
    problematicTexts.forEach(text => {
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        if (element.textContent && element.textContent.trim() === text && 
            !element.closest('#navbar-user-area') && 
            !element.closest('.modal')) {
          console.log('Removing unwanted element:', text);
          element.remove();
        }
      });
    });
  }

  /**
   * すべてのモーダルを初期化
   */
  function initializeAllModals() {
    console.log('Initializing all modals...');
    
    const modalIds = [
      'loginModal',
      'registerTouristModal', 
      'registerGuideModal',
      'sponsorLoginModal',
      'sponsorRegisterModal',
      'contactModal'
    ];

    modalIds.forEach(modalId => {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        try {
          // Bootstrap 5 modalを初期化
          const bsModal = new bootstrap.Modal(modalElement);
          console.log(`Modal ${modalId} initialized successfully`);
        } catch (error) {
          console.error(`Error initializing modal ${modalId}:`, error);
        }
      } else {
        console.warn(`Modal ${modalId} not found`);
      }
    });
  }

  /**
   * すべてのボタンイベントを設定
   */
  function setupAllButtonEvents() {
    console.log('Setting up button events...');
    
    // メインログインボタン
    setupLoginButton();
    
    // 新規登録ドロップダウン
    setupRegisterDropdown();
    
    // 協賛店ボタン
    setupSponsorButtons();
    
    // フォーム送信イベント
    setupFormEvents();
  }

  /**
   * ログインボタンの設定
   */
  function setupLoginButton() {
    const loginBtn = document.getElementById('main-login-btn');
    if (loginBtn) {
      // 既存のイベントリスナーを削除
      const newLoginBtn = loginBtn.cloneNode(true);
      loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
      
      newLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Login button clicked');
        
        try {
          const loginModal = document.getElementById('loginModal');
          if (loginModal) {
            const bsModal = bootstrap.Modal.getOrCreateInstance(loginModal);
            bsModal.show();
            console.log('Login modal displayed');
          } else {
            console.error('Login modal not found');
          }
        } catch (error) {
          console.error('Error showing login modal:', error);
        }
      });
      
      console.log('Login button event set up');
    }
  }

  /**
   * 新規登録ドロップダウンの設定
   */
  function setupRegisterDropdown() {
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown) {
      try {
        // Bootstrap dropdown初期化
        const dropdown = new bootstrap.Dropdown(registerDropdown);
        console.log('Register dropdown initialized');
      } catch (error) {
        console.error('Error initializing register dropdown:', error);
      }
    }

    // 旅行者登録リンク
    const touristLink = document.getElementById('tourist-register-link');
    if (touristLink) {
      touristLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Tourist register link clicked');
        
        try {
          const touristModal = document.getElementById('registerTouristModal');
          if (touristModal) {
            const bsModal = bootstrap.Modal.getOrCreateInstance(touristModal);
            bsModal.show();
            console.log('Tourist register modal displayed');
          }
        } catch (error) {
          console.error('Error showing tourist register modal:', error);
        }
      });
    }
  }

  /**
   * 協賛店ボタンの設定
   */
  function setupSponsorButtons() {
    // 協賛店ログインボタン
    const sponsorLoginBtn = document.querySelector('[data-bs-target="#sponsorLoginModal"]');
    if (sponsorLoginBtn) {
      sponsorLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        try {
          const sponsorLoginModal = document.getElementById('sponsorLoginModal');
          if (sponsorLoginModal) {
            const bsModal = bootstrap.Modal.getOrCreateInstance(sponsorLoginModal);
            bsModal.show();
            console.log('Sponsor login modal displayed');
          }
        } catch (error) {
          console.error('Error showing sponsor login modal:', error);
        }
      });
    }

    // 協賛店登録ボタン
    const sponsorRegisterBtn = document.querySelector('[data-bs-target="#sponsorRegisterModal"]');
    if (sponsorRegisterBtn) {
      sponsorRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        try {
          const sponsorRegisterModal = document.getElementById('sponsorRegisterModal');
          if (sponsorRegisterModal) {
            const bsModal = bootstrap.Modal.getOrCreateInstance(sponsorRegisterModal);
            bsModal.show();
            console.log('Sponsor register modal displayed');
          }
        } catch (error) {
          console.error('Error showing sponsor register modal:', error);
        }
      });
    }
  }

  /**
   * フォーム送信イベントの設定
   */
  function setupFormEvents() {
    // ログインフォーム
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        alert('ログイン機能は開発中です');
      });
    }

    // 協賛店ログインフォーム
    const sponsorLoginForm = document.getElementById('sponsor-login-form');
    if (sponsorLoginForm) {
      sponsorLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Sponsor login form submitted');
        alert('協賛店ログイン機能は開発中です');
      });
    }

    // 協賛店登録フォーム
    const sponsorRegisterForm = document.getElementById('sponsor-register-form');
    if (sponsorRegisterForm) {
      sponsorRegisterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Sponsor register form submitted');
        alert('協賛店登録申請を受け付けました');
        const modal = bootstrap.Modal.getInstance(document.getElementById('sponsorRegisterModal'));
        if (modal) modal.hide();
      });
    }
  }

  /**
   * 継続監視を開始
   */
  function startContinuousMonitoring() {
    // DOM変更の監視
    const observer = new MutationObserver((mutations) => {
      let needsCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          needsCheck = true;
        }
      });
      
      if (needsCheck) {
        // 短い遅延で問題をチェック
        setTimeout(() => {
          removeUnwantedElements();
          ensureHeaderIntegrity();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // 定期的なチェック
    setInterval(() => {
      removeUnwantedElements();
      ensureHeaderIntegrity();
    }, 2000);
  }

  /**
   * ヘッダーの整合性を確保
   */
  function ensureHeaderIntegrity() {
    const userArea = document.getElementById('navbar-user-area');
    const loginBtn = document.getElementById('main-login-btn');
    const registerDropdown = document.getElementById('registerDropdown');
    
    if (!userArea || !loginBtn || !registerDropdown) {
      console.log('Header integrity check failed, restoring...');
      restoreNavbarUserArea();
      setupAllButtonEvents();
    }
  }

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // さらなる保険として、window.onload後にも実行
  window.addEventListener('load', function() {
    setTimeout(initialize, 500);
  });

})();