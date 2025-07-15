/**
 * 最終ヘッダー修正システム
 * すべての干渉を排除して確実に日本語表示を維持
 */

(function() {
  'use strict';
  
  console.log('🔥 最終ヘッダー修正システム開始');
  
  // 即座にHTMLを強制書き換え
  function forceJapaneseHeaders() {
    const navbar = document.querySelector('.navbar-collapse');
    if (!navbar) return;
    
    // 新規登録ボタンを完全に置換
    const allButtons = navbar.querySelectorAll('button, .btn');
    allButtons.forEach(btn => {
      const text = btn.textContent.trim();
      if (text.includes('Sign Up') || text === 'Register' || btn.onclick && btn.onclick.toString().includes('showRegisterOptions')) {
        btn.innerHTML = '新規登録';
        btn.className = 'btn btn-light';
        btn.setAttribute('onclick', 'showRegisterOptions()');
        console.log('✅ 新規登録ボタンを強制修正');
      }
      
      if (text.includes('Login') || text.includes('Sign In') || btn.getAttribute('data-bs-target') === '#loginModal') {
        btn.innerHTML = 'ログイン';
        btn.className = 'btn btn-outline-light me-2';
        console.log('✅ ログインボタンを強制修正');
      }
    });
    
    // 言語切り替えエリアを完全に置換
    const langArea = navbar.querySelector('.language-switcher, .dropdown, #languageDropdown');
    if (langArea) {
      langArea.outerHTML = `
        <div class="language-switcher me-3" style="display: flex !important; gap: 5px;">
          <button class="btn btn-outline-light btn-sm lang-btn active" style="font-size: 12px;">
            🇯🇵 日本語
          </button>
          <button class="btn btn-outline-light btn-sm lang-btn" onclick="window.location.href='index-en.html'" style="font-size: 12px;">
            🇺🇸 English
          </button>
        </div>
      `;
      console.log('✅ 言語切り替えを強制修正');
    }
  }
  
  // ドロップダウン要素を完全に削除
  function removeDropdownElements() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle, .dropdown-menu, [id*="Dropdown"]');
    dropdowns.forEach(element => {
      if (element.textContent.includes('日本語') || element.textContent.includes('English') || element.id.includes('language')) {
        element.remove();
        console.log('🗑️ ドロップダウン要素を削除');
      }
    });
  }
  
  // 翻訳関数を完全に無効化
  function disableAllTranslation() {
    const translationVars = ['translationData', 'translations', 'translateText', 'switchToEnglish', 'changeLanguage'];
    translationVars.forEach(varName => {
      if (window[varName]) {
        window[varName] = function() { return false; };
      }
    });
  }
  
  // CSS強制適用
  function applyForcedStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 英語テキストを強制的に隠す */
      .btn:contains("Sign Up"), 
      button:contains("Sign Up"),
      .dropdown-toggle:contains("Sign Up") {
        display: none !important;
      }
      
      /* ドロップダウンスタイルを無効化 */
      .dropdown-toggle::after {
        display: none !important;
      }
      
      /* 言語切り替えボタンを確実に表示 */
      .language-switcher {
        display: flex !important;
        gap: 5px !important;
      }
      
      .lang-btn {
        display: inline-block !important;
        font-size: 12px !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // 超強力な継続監視システム
  function setupUltraMonitoring() {
    // 50ms間隔で監視
    setInterval(() => {
      forceJapaneseHeaders();
      removeDropdownElements();
      disableAllTranslation();
    }, 50);
    
    // DOM変更を即座にキャッチ
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          setTimeout(() => {
            forceJapaneseHeaders();
            removeDropdownElements();
          }, 10);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // 初期化
  function initialize() {
    applyForcedStyles();
    forceJapaneseHeaders();
    removeDropdownElements();
    disableAllTranslation();
    setupUltraMonitoring();
    
    console.log('💥 最終ヘッダー修正システム完全起動');
  }
  
  // 最高優先度で即座に実行
  initialize();
  
  // 複数のタイミングで実行を保証
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  window.addEventListener('load', initialize);
  setTimeout(initialize, 100);
  setTimeout(initialize, 500);
  setTimeout(initialize, 1000);
  
})();