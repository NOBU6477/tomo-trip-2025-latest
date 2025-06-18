/**
 * ヘッダー表示の完全修正システム
 * 中央の不要なユーザー表示を削除し、言語表示を正常化
 */

(function() {
  'use strict';

  /**
   * 中央の不要なユーザー表示を完全削除
   */
  function removeUnwantedUserDisplay() {
    console.log('不要なユーザー表示を削除開始');
    
    // ナビバー内の全ての要素をチェック
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // 「undefined さん」「優 さん」などの表示を探して削除
    const allElements = navbar.querySelectorAll('*');
    allElements.forEach(element => {
      const text = element.textContent || '';
      
      // 不要なユーザー表示パターンをチェック
      if (text.includes('undefined') || 
          text.includes('さん') || 
          (text.includes('優') && !element.closest('#languageDropdown')) ||
          text.match(/^\s*[^\s]+\s*さん\s*$/)) {
        
        // navbar-user-area内の要素は保護
        if (!element.closest('#navbar-user-area') && 
            !element.closest('#languageDropdown') && 
            !element.closest('#registerDropdown')) {
          
          console.log('不要なユーザー表示要素を削除:', text, element);
          element.remove();
        }
      }
    });

    // 特定の位置にある要素も確認
    const centerElements = navbar.querySelectorAll('.navbar-nav .dropdown:not(#languageDropdown):not(#registerDropdown)');
    centerElements.forEach(element => {
      const text = element.textContent || '';
      if (text.includes('さん') || text.includes('undefined') || 
          (text.includes('優') && !text.includes('英語') && !text.includes('English'))) {
        console.log('中央位置の不要要素を削除:', element);
        element.remove();
      }
    });
  }

  /**
   * 言語ドロップダウンを日本語に固定
   */
  function fixLanguageDisplay() {
    const languageBtn = document.getElementById('languageDropdown');
    if (languageBtn) {
      // 強制的に日本語表示に戻す
      languageBtn.textContent = '日本語';
      languageBtn.setAttribute('data-current-lang', 'ja');
      
      console.log('言語ドロップダウンを日本語に修正');
    }

    // 言語切り替えイベントをリセット
    document.addEventListener('click', function(e) {
      if (e.target.closest('#languageDropdown')) {
        // 言語ドロップダウンの表示を強制的に日本語に保持
        setTimeout(() => {
          const btn = document.getElementById('languageDropdown');
          if (btn && btn.textContent !== '日本語') {
            btn.textContent = '日本語';
          }
        }, 100);
      }
    });
  }

  /**
   * navbar-user-areaの内容を適切に管理
   */
  function manageUserArea() {
    const userArea = document.getElementById('navbar-user-area');
    if (!userArea) return;

    // ログイン状態をチェック
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      // 未ログイン時：ログインと新規登録ボタンのみ表示
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
    } else {
      // ログイン時：適切なユーザーメニューを表示
      const userName = currentUser.name || currentUser.firstName || 'ユーザー';
      const userType = currentUser.userType === 'guide' ? 'ガイド' : '観光客';
      
      userArea.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle me-1"></i> ${userName}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><h6 class="dropdown-header">${userType}アカウント</h6></li>
            <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>プロフィール</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-calendar-check me-2"></i>予約一覧</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>設定</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="handleLogout()"><i class="bi bi-box-arrow-right me-2"></i>ログアウト</a></li>
          </ul>
        </div>
      `;
    }
  }

  /**
   * 現在のユーザー情報を取得
   */
  function getCurrentUser() {
    try {
      const sources = ['currentUser', 'guideRegistrationData', 'touristRegistrationData'];
      for (const key of sources) {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && parsed.email && (parsed.name || parsed.firstName)) {
            return parsed;
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * DOM変更を監視して継続的に修正
   */
  function setupContinuousMonitoring() {
    const observer = new MutationObserver(function(mutations) {
      let needsCleanup = false;
      
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent || '';
            
            // 不要なユーザー表示が追加された場合
            if (text.includes('undefined') || text.includes('さん')) {
              needsCleanup = true;
            }
            
            // 言語ドロップダウンが変更された場合
            if (node.id === 'languageDropdown' || node.closest('#languageDropdown')) {
              needsCleanup = true;
            }
          }
        });
      });
      
      if (needsCleanup) {
        setTimeout(() => {
          removeUnwantedUserDisplay();
          fixLanguageDisplay();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * ページ読み込み時の不要な処理を無効化
   */
  function disableUnwantedInitialization() {
    // 問題を起こす可能性のある関数を無効化
    const problematicFunctions = [
      'updateNavbarUserArea',
      'createUserMenu',
      'updateUserMenu',
      'fillUserMenu',
      'showUserInfo'
    ];

    problematicFunctions.forEach(funcName => {
      if (window[funcName]) {
        console.log(`無効化: ${funcName}`);
        window[funcName] = function() {
          console.log(`${funcName} は無効化されています`);
          return;
        };
      }
    });
  }

  /**
   * 初期化とクリーンアップの実行
   */
  function initialize() {
    console.log('ヘッダークリーンアップシステムを開始');
    
    // 即座に実行
    removeUnwantedUserDisplay();
    fixLanguageDisplay();
    disableUnwantedInitialization();
    
    // 少し遅延してから再度実行
    setTimeout(() => {
      removeUnwantedUserDisplay();
      fixLanguageDisplay();
      manageUserArea();
    }, 500);
    
    // さらに遅延してから最終チェック
    setTimeout(() => {
      removeUnwantedUserDisplay();
      fixLanguageDisplay();
    }, 1500);

    // 継続監視を開始
    setupContinuousMonitoring();
  }

  // DOM準備後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // ページ表示時にも実行
  window.addEventListener('pageshow', initialize);

})();