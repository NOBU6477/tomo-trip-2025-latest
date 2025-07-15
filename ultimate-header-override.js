/**
 * 究極のヘッダーオーバーライドシステム
 * あらゆる干渉を排除してブラウザ表示を強制修正
 */

(function() {
  'use strict';
  
  console.log('⚡ 究極のヘッダーオーバーライドシステム開始');
  
  // ページロード直後に即座に実行
  function immediateHeaderFix() {
    const style = document.createElement('style');
    style.textContent = `
      /* 英語テキストを強制的に隠す */
      button:contains("Sign Up") { display: none !important; }
      .btn:contains("Sign Up") { display: none !important; }
      
      /* 新規登録ボタンの強制表示 */
      .btn-light[onclick*="showRegisterOptions"]::after {
        content: "新規登録" !important;
        display: inline !important;
      }
      
      /* 言語ドロップダウンを強制的に隠す */
      #languageDropdown, .dropdown-toggle[id*="language"] {
        display: none !important;
      }
      
      /* 直接ボタン形式の言語切り替えを強制表示 */
      .language-switcher {
        display: flex !important;
        gap: 5px !important;
      }
      
      .lang-btn {
        display: inline-block !important;
        padding: 5px 10px !important;
        border: 1px solid rgba(255,255,255,0.5) !important;
        border-radius: 5px !important;
        color: white !important;
        background: transparent !important;
      }
      
      .lang-btn.active {
        background: rgba(255,255,255,0.2) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // DOM要素を強制的に再構築
  function reconstructNavbar() {
    setTimeout(() => {
      const navbar = document.querySelector('.navbar .container');
      if (!navbar) return;
      
      // 新規登録ボタン強制修正
      const buttons = navbar.querySelectorAll('button, .btn');
      buttons.forEach(btn => {
        if (btn.textContent.includes('Sign Up') || btn.onclick && btn.onclick.toString().includes('showRegisterOptions')) {
          btn.innerHTML = '新規登録';
          btn.className = 'btn btn-light';
          btn.setAttribute('onclick', 'showRegisterOptions()');
          console.log('✅ 新規登録ボタンを強制修正');
        }
      });
      
      // 言語切り替えエリア強制修正
      const langArea = navbar.querySelector('.language-switcher, .dropdown');
      if (langArea) {
        langArea.outerHTML = `
          <div class="language-switcher me-3" style="display: flex; gap: 5px;">
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
    }, 100);
  }
  
  // ブラウザ開発者ツール対応
  function disableTranslation() {
    // Google翻訳などを無効化
    const metaNoTranslate = document.createElement('meta');
    metaNoTranslate.name = 'google';
    metaNoTranslate.content = 'notranslate';
    document.head.appendChild(metaNoTranslate);
    
    document.documentElement.classList.add('notranslate');
    document.documentElement.setAttribute('translate', 'no');
  }
  
  // 強制リロード対応
  function forceRefresh() {
    // ページが完全に読み込まれた後に最終チェック
    window.addEventListener('load', () => {
      setTimeout(() => {
        const hasSignUp = document.body.textContent.includes('Sign Up');
        const hasDropdown = document.getElementById('languageDropdown');
        
        if (hasSignUp || hasDropdown) {
          console.log('⚠️ まだ英語要素が残っています。強制リロード実行');
          reconstructNavbar();
          
          // さらに2秒後に再チェック
          setTimeout(() => {
            if (document.body.textContent.includes('Sign Up')) {
              console.log('🔄 最終手段: ページリロード');
              window.location.reload();
            }
          }, 2000);
        }
      }, 1000);
    });
  }
  
  // すべてのシステムを起動
  function initialize() {
    immediateHeaderFix();
    disableTranslation();
    reconstructNavbar();
    forceRefresh();
    
    // 継続監視
    setInterval(reconstructNavbar, 5000);
    
    console.log('💥 究極のヘッダーオーバーライドシステム完全起動');
  }
  
  // 最高優先度で即座に実行
  initialize();
  
})();