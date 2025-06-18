/**
 * ヘッダー表示の完全修正システム
 * 中央の不要なユーザー表示を削除し、言語表示を正常化
 */

(function() {
  'use strict';

  /**
   * 中央の不要なユーザー表示を的確に削除
   */
  function removeUnwantedUserDisplay() {
    console.log('不要なユーザー表示を削除開始');
    
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // より広範囲で要素をチェック
    const allElements = navbar.querySelectorAll('*');
    
    allElements.forEach(element => {
      const text = element.textContent.trim();
      
      // 不要なユーザー表示のパターンを拡張
      const isUnwantedUserDisplay = (
        text === 'undefined さん' ||
        text === '優 さん' ||
        text === 'ユーザー' ||
        (text.includes('undefined') && text.includes('さん')) ||
        (text.includes('さん') && text.length < 10 && !text.includes('日本語') && !text.includes('English'))
      );
      
      // 重要な要素は絶対に保護
      const isProtectedElement = (
        element.id === 'languageDropdown' ||
        element.id === 'registerDropdown' ||
        element.id === 'navbar-user-area' ||
        element.closest('#languageDropdown') ||
        element.closest('#registerDropdown') ||
        element.closest('#navbar-user-area') ||
        element.classList.contains('navbar-brand') ||
        element.closest('.navbar-brand') ||
        element.classList.contains('nav-link') ||
        element.closest('.nav-link') ||
        element.tagName === 'A' && element.textContent.includes('ホーム') ||
        element.tagName === 'A' && element.textContent.includes('ガイドを探す') ||
        element.tagName === 'A' && element.textContent.includes('使い方') ||
        element.textContent.includes('ログイン') ||
        element.textContent.includes('新規登録')
      );
      
      if (isUnwantedUserDisplay && !isProtectedElement) {
        console.log('不要なユーザー表示要素を削除:', text, element);
        element.remove();
      }
    });

    // 特に中央エリアの不要な要素を確認
    const centerArea = navbar.querySelector('.navbar-nav');
    if (centerArea) {
      const centerDropdowns = centerArea.querySelectorAll('.dropdown');
      centerDropdowns.forEach(dropdown => {
        const text = dropdown.textContent.trim();
        if ((text.includes('ユーザー') || text.includes('さん')) && 
            !dropdown.closest('#languageDropdown') && 
            !dropdown.closest('#registerDropdown')) {
          console.log('中央エリアの不要ドロップダウンを削除:', text);
          dropdown.remove();
        }
      });
    }
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
   * ヘッダー構造を確実に復元
   */
  function ensureHeaderStructure() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
      console.log('ナビバーが見つからないため復元します');
      restoreCompleteHeader();
      return;
    }

    // 必須要素の存在確認
    const brand = navbar.querySelector('.navbar-brand');
    const navbarNav = navbar.querySelector('.navbar-nav');
    const languageDropdown = document.getElementById('languageDropdown');
    const userArea = document.getElementById('navbar-user-area');

    // 欠けている要素があれば復元
    if (!brand || !navbarNav || !languageDropdown || !userArea) {
      console.log('ヘッダー要素が不完全なため復元します');
      restoreCompleteHeader();
    }
  }

  /**
   * 完全なヘッダー構造を復元
   */
  function restoreCompleteHeader() {
    const existingNavbar = document.querySelector('.navbar');
    if (existingNavbar) {
      existingNavbar.remove();
    }

    const headerHtml = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" href="#">Local Guide</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link active" href="#">ホーム</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#guides">ガイドを探す</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#how-it-works">使い方</a>
              </li>
            </ul>

            <div class="dropdown me-3">
              <button class="btn btn-outline-light dropdown-toggle" id="languageDropdown" data-bs-toggle="dropdown">
                日本語
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" data-lang="ja">日本語</a></li>
                <li><a class="dropdown-item" href="#" data-lang="en">English</a></li>
              </ul>
            </div>

            <div id="navbar-user-area">
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
            </div>
          </div>
        </div>
      </nav>
    `;

    // body要素の最初に挿入
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
    console.log('ヘッダー構造を復元しました');
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
    // より頻繁にチェックする監視システム
    setInterval(() => {
      removeUnwantedUserDisplay();
      fixLanguageDisplay();
    }, 1000);

    const observer = new MutationObserver(function(mutations) {
      let needsCleanup = false;
      
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent || '';
            
            // 不要なユーザー表示が追加された場合
            if (text.includes('undefined') || text.includes('さん') || text.includes('ユーザー')) {
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
        }, 50);
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
    
    // まずヘッダー構造を確保
    ensureHeaderStructure();
    
    // 少し遅延してから不要な要素のみを削除
    setTimeout(() => {
      removeUnwantedUserDisplay();
      fixLanguageDisplay();
    }, 300);
    
    // さらに遅延してから最終チェック
    setTimeout(() => {
      removeUnwantedUserDisplay();
      fixLanguageDisplay();
    }, 1000);

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