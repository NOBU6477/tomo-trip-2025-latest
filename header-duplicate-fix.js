/**
 * ヘッダー重複表示修正システム
 * 中央の不要なユーザー表示を削除し、右側のみ残す
 */

(function() {
  'use strict';

  /**
   * 重複したユーザー表示を検出して削除
   */
  function removeDuplicateUserDisplays() {
    console.log('重複ユーザー表示の検出を開始');

    // ナビゲーションバー内のすべての要素をチェック
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // 中央に表示されている可能性のあるユーザー表示を探す
    const suspiciousElements = navbar.querySelectorAll('.dropdown, .btn, .nav-item, .navbar-text, [class*="user"]');
    
    suspiciousElements.forEach(element => {
      const text = element.textContent || '';
      
      // 「優」や「さん」を含み、かつ右端（navbar-user-area）ではない要素を削除
      if ((text.includes('優') || text.includes('さん') || text.includes('ユーザー')) && 
          !element.closest('#navbar-user-area')) {
        
        console.log('中央の重複ユーザー表示を削除:', element);
        element.remove();
      }
    });

    // 特定の位置にある要素もチェック
    const centerElements = navbar.querySelectorAll('.navbar-nav .dropdown, .me-auto ~ .dropdown');
    centerElements.forEach(element => {
      const text = element.textContent || '';
      if (text.includes('優') || text.includes('さん')) {
        console.log('中央位置の重複要素を削除:', element);
        element.remove();
      }
    });
  }

  /**
   * 右側のユーザーメニューのみを保持
   */
  function ensureOnlyRightUserMenu() {
    const navbarUserArea = document.getElementById('navbar-user-area');
    if (!navbarUserArea) return;

    console.log('右側ユーザーメニューエリアを確認');

    // navbar-user-area以外の場所にあるユーザー関連要素を削除
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const allDropdowns = navbar.querySelectorAll('.dropdown');
    allDropdowns.forEach(dropdown => {
      // navbar-user-area内ではない、かつユーザー関連のドロップダウンを削除
      if (!dropdown.closest('#navbar-user-area') && 
          !dropdown.closest('#languageDropdown') &&
          !dropdown.id.includes('language') &&
          !dropdown.id.includes('register')) {
        
        const text = dropdown.textContent || '';
        if (text.includes('優') || text.includes('さん') || text.includes('ガイド') || text.includes('ユーザー')) {
          console.log('navbar-user-area外のユーザードロップダウンを削除:', dropdown);
          dropdown.remove();
        }
      }
    });
  }

  /**
   * 言語ドロップダウンと登録ドロップダウンを保護
   */
  function protectEssentialDropdowns() {
    // 言語ドロップダウンを保護
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
      languageDropdown.setAttribute('data-protected', 'true');
    }

    // 登録ドロップダウンを保護
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown) {
      registerDropdown.setAttribute('data-protected', 'true');
    }
  }

  /**
   * ナビバーを監視して新しい重複を防ぐ
   */
  function setupNavbarMonitor() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 新しく追加された要素がユーザー表示の場合
            const text = node.textContent || '';
            if ((text.includes('優') || text.includes('さん')) && 
                !node.closest('#navbar-user-area') &&
                !node.hasAttribute('data-protected')) {
              
              console.log('新しい重複ユーザー表示を即座に削除:', node);
              node.remove();
            }
          }
        });
      });
    });

    observer.observe(navbar, { childList: true, subtree: true });
    console.log('ナビバー監視を開始');
  }

  /**
   * 初期化処理
   */
  function initialize() {
    console.log('ヘッダー重複表示修正システム開始');

    // 保護すべき要素をマーク
    protectEssentialDropdowns();

    // 重複削除実行
    removeDuplicateUserDisplays();
    ensureOnlyRightUserMenu();

    // 監視開始
    setupNavbarMonitor();

    console.log('ヘッダー重複表示修正完了');
  }

  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // 遅延実行で確実に適用
  setTimeout(initialize, 500);
  setTimeout(removeDuplicateUserDisplays, 1500);
  setTimeout(ensureOnlyRightUserMenu, 2000);

})();