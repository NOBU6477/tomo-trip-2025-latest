/**
 * 強力なヘッダー修正システム
 * 不要なユーザー表示を確実に削除
 */

(function() {
  'use strict';

  /**
   * 強制的に不要な要素を削除
   */
  function aggressiveCleanup() {
    console.log('強力なヘッダークリーンアップを実行');
    
    // 特定のテキストパターンを含む全ての要素を削除
    const unwantedPatterns = [
      'undefined さん',
      '優 さん', 
      'ユーザー',
      /^undefined\s*$/,
      /^優\s*$/,
      /^\s*さん\s*$/
    ];

    document.querySelectorAll('*').forEach(element => {
      const text = element.textContent.trim();
      
      // パターンマッチング
      const shouldRemove = unwantedPatterns.some(pattern => {
        if (typeof pattern === 'string') {
          return text === pattern;
        } else {
          return pattern.test(text);
        }
      });

      // 保護すべき要素かチェック
      const isProtected = (
        element.tagName === 'HTML' ||
        element.tagName === 'BODY' ||
        element.tagName === 'HEAD' ||
        element.closest('script') ||
        element.closest('style') ||
        element.textContent.includes('Local Guide') ||
        element.textContent.includes('ホーム') ||
        element.textContent.includes('ガイドを探す') ||
        element.textContent.includes('使い方') ||
        element.textContent.includes('日本語') ||
        element.textContent.includes('English') ||
        element.textContent.includes('ログイン') ||
        element.textContent.includes('新規登録') ||
        element.textContent.includes('旅行者として登録') ||
        element.textContent.includes('ガイドとして登録') ||
        element.id === 'languageDropdown' ||
        element.id === 'registerDropdown' ||
        element.id === 'navbar-user-area' ||
        element.closest('#languageDropdown') ||
        element.closest('#registerDropdown') ||
        element.closest('#navbar-user-area') ||
        element.closest('[data-bs-toggle="modal"]') ||
        element.getAttribute('data-bs-toggle') === 'modal' ||
        element.classList.contains('btn') ||
        element.closest('.btn')
      );

      if (shouldRemove && !isProtected) {
        console.log('不要要素を削除:', text, element.tagName);
        element.remove();
      }
    });
  }

  /**
   * ナビバー内の不要なドロップダウンを特定して削除
   */
  function removeUnwantedDropdowns() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const dropdowns = navbar.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const text = dropdown.textContent.trim();
      
      // 不要なドロップダウンの条件
      if ((text.includes('ユーザー') || text.includes('さん') || text.includes('undefined')) &&
          dropdown.id !== 'languageDropdown' &&
          dropdown.id !== 'registerDropdown' &&
          !dropdown.closest('#navbar-user-area')) {
        
        console.log('不要なドロップダウンを削除:', text);
        dropdown.remove();
      }
    });
  }

  /**
   * 言語ドロップダウンを強制的に日本語に設定
   */
  function forceJapaneseLanguage() {
    const languageBtn = document.getElementById('languageDropdown');
    if (languageBtn) {
      languageBtn.textContent = '日本語';
      languageBtn.setAttribute('data-lang', 'ja');
    }

    // 英語モードを無効化
    document.body.classList.remove('english-mode');
    document.documentElement.setAttribute('lang', 'ja');
  }

  /**
   * navbar-user-areaを適切に管理
   */
  function cleanUserArea() {
    const userArea = document.getElementById('navbar-user-area');
    if (!userArea) {
      console.log('navbar-user-areaが見つからないため復元');
      restoreUserArea();
      return;
    }

    // ログインと新規登録ボタンの存在確認
    const loginBtn = userArea.querySelector('[data-bs-target="#loginModal"]');
    const registerBtn = userArea.querySelector('#registerDropdown');
    
    if (!loginBtn || !registerBtn) {
      console.log('必要なボタンが不足しているため復元');
      restoreUserArea();
      return;
    }

    // 不要な子要素のみをチェック
    const children = userArea.querySelectorAll('*');
    children.forEach(child => {
      const text = child.textContent.trim();
      if ((text.includes('undefined') || text.includes('優') || 
          (text.includes('さん') && text !== 'undefined さん' && text !== '優 さん')) &&
          !text.includes('ログイン') && 
          !text.includes('新規登録') &&
          !text.includes('旅行者として登録') &&
          !text.includes('ガイドとして登録')) {
        console.log('navbar-user-area内の不要要素を削除:', text);
        child.remove();
      }
    });
  }

  /**
   * navbar-user-areaを復元
   */
  function restoreUserArea() {
    let userArea = document.getElementById('navbar-user-area');
    if (!userArea) {
      // navbar-user-areaが存在しない場合、作成
      const navbar = document.querySelector('.navbar .container');
      if (navbar) {
        const navbarCollapse = navbar.querySelector('.navbar-collapse');
        if (navbarCollapse) {
          userArea = document.createElement('div');
          userArea.id = 'navbar-user-area';
          navbarCollapse.appendChild(userArea);
        }
      }
    }

    if (userArea) {
      userArea.innerHTML = `
        <button class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
          ログイン
        </button>
        <div class="dropdown d-inline-block">
          <button class="btn btn-light dropdown-toggle" id="registerDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            新規登録
          </button>
          <ul class="dropdown-menu dropdown-menu-end register-dropdown" aria-labelledby="registerDropdown">
            <li>
              <a class="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#registerTouristModal" href="#">
                <div class="register-icon tourist-icon me-2">
                  <i class="bi bi-person"></i>
                </div>
                <div>
                  <div class="fw-bold">旅行者として登録</div>
                  <div class="small text-muted">ローカルガイドと一緒に特別な旅を体験</div>
                </div>
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item d-flex align-items-center" href="guide-registration-form.html">
                <div class="register-icon guide-icon me-2">
                  <i class="bi bi-map"></i>
                </div>
                <div>
                  <div class="fw-bold">ガイドとして登録</div>
                  <div class="small text-muted">あなたの知識と経験を共有しましょう</div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      `;
      console.log('navbar-user-areaを復元しました');
    }
  }

  /**
   * 中央ナビゲーションエリアの不要な要素を削除
   */
  function cleanCenterNav() {
    const navbarNav = document.querySelector('.navbar-nav');
    if (!navbarNav) return;

    const unwantedElements = navbarNav.querySelectorAll('*');
    unwantedElements.forEach(element => {
      const text = element.textContent.trim();
      
      // 中央エリアに表示されるべきでない要素
      if ((text.includes('ユーザー') || text.includes('さん') || text.includes('undefined')) &&
          !element.closest('.nav-link') &&
          !text.includes('ホーム') &&
          !text.includes('ガイドを探す') &&
          !text.includes('使い方')) {
        
        console.log('中央ナビの不要要素を削除:', text);
        element.remove();
      }
    });
  }

  /**
   * 完全なクリーンアップを実行
   */
  function executeCompleteCleanup() {
    // まず必要な要素を復元
    restoreUserArea();
    forceJapaneseLanguage();
    
    // その後で不要な要素を削除
    aggressiveCleanup();
    removeUnwantedDropdowns();
    cleanUserArea();
    cleanCenterNav();
  }

  /**
   * 継続的な監視とクリーンアップ
   */
  function setupAggressiveMonitoring() {
    // 高頻度でクリーンアップを実行
    setInterval(executeCompleteCleanup, 500);

    // DOM変更を即座に捕捉
    const observer = new MutationObserver(function() {
      setTimeout(executeCompleteCleanup, 10);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
  }

  /**
   * 他のスクリプトによる干渉を防ぐ
   */
  function preventInterference() {
    // 問題を起こす関数を無効化
    const problematicFunctions = [
      'updateNavbarUserArea',
      'createUserMenu', 
      'updateUserMenu',
      'showUserInfo',
      'displayUserData',
      'fillUserMenu'
    ];

    problematicFunctions.forEach(funcName => {
      if (window[funcName]) {
        window[funcName] = function() {
          console.log(`${funcName} blocked by aggressive-header-fix`);
          return false;
        };
      }
    });

    // sessionStorageの問題データをクリア
    try {
      const problematicKeys = ['currentUser', 'userDisplayName'];
      problematicKeys.forEach(key => {
        const data = sessionStorage.getItem(key);
        if (data && (data.includes('undefined') || data.includes('優'))) {
          sessionStorage.removeItem(key);
          console.log(`Removed problematic sessionStorage key: ${key}`);
        }
      });
    } catch (e) {
      console.log('SessionStorage cleanup error:', e);
    }
  }

  /**
   * 初期化
   */
  function initialize() {
    console.log('強力なヘッダー修正システムを開始');
    
    preventInterference();
    
    // 即座に実行
    executeCompleteCleanup();
    
    // 短い間隔で再実行
    setTimeout(executeCompleteCleanup, 100);
    setTimeout(executeCompleteCleanup, 500);
    setTimeout(executeCompleteCleanup, 1000);
    
    // 継続監視を開始
    setupAggressiveMonitoring();
  }

  // DOM準備後すぐに初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // ページ表示時にも実行
  window.addEventListener('pageshow', initialize);
  
  // 少し遅延してからも実行
  setTimeout(initialize, 1000);

})();