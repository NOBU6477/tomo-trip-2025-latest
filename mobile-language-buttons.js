/**
 * モバイル対応言語切り替えボタン実装
 * 日本語・英語サイト両方に対応
 */

(function() {
  'use strict';
  
  function setupMobileLanguageButtons() {
    console.log('🔄 モバイル言語ボタンを設定中...');
    
    // 既存の言語ボタンエリアを確認
    let langContainer = document.querySelector('.language-switcher-center');
    
    if (!langContainer) {
      // 言語ボタンコンテナを作成
      langContainer = document.createElement('div');
      langContainer.className = 'language-switcher-center';
      
      // ナビゲーションバーに挿入
      const navbar = document.querySelector('.navbar .container-fluid');
      if (navbar) {
        const centerDiv = document.createElement('div');
        centerDiv.className = 'd-flex justify-content-center flex-grow-1';
        centerDiv.appendChild(langContainer);
        navbar.insertBefore(centerDiv, navbar.querySelector('#navbar-user-area'));
      }
    }
    
    // 現在のページが日本語版か英語版かを判定
    const isJapaneseSite = window.location.pathname.includes('index.html') || 
                          (!window.location.pathname.includes('index-en.html') && !window.location.pathname.includes('en'));
    
    // ボタンHTMLを生成
    langContainer.innerHTML = `
      <button class="btn lang-btn-jp ${isJapaneseSite ? 'active' : ''}" onclick="window.location.href='${isJapaneseSite ? 'index.html' : 'index.html'}'" style="
        background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
        color: white;
        border: none;
        border-radius: 25px 0 0 25px;
        padding: 8px 20px;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(255,107,107,0.3);
        ${isJapaneseSite ? 'opacity: 1; transform: scale(1.05);' : ''}
      ">
        🇯🇵 日本語
      </button>
      <button class="btn lang-btn-en ${!isJapaneseSite ? 'active' : ''}" onclick="window.location.href='${isJapaneseSite ? 'index-en.html' : 'index-en.html'}'" style="
        background: linear-gradient(135deg, #4287f5, #64a8ff);
        color: white;
        border: none;
        border-radius: 0 25px 25px 0;
        padding: 8px 20px;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(66,135,245,0.3);
        margin-left: -1px;
        ${!isJapaneseSite ? 'opacity: 1; transform: scale(1.05);' : ''}
      ">
        🇺🇸 English
      </button>
    `;
    
    // モバイルCSS適用
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
      @media (max-width: 768px) {
        .language-switcher-center {
          display: flex !important;
          justify-content: center !important;
          margin: 1rem 0 !important;
          order: 2 !important;
        }
        
        .navbar-collapse {
          flex-direction: column !important;
        }
        
        #navbar-user-area {
          order: 3 !important;
          margin-top: 1rem !important;
        }
        
        .lang-btn-jp, .lang-btn-en {
          min-width: 100px !important;
          font-size: 13px !important;
          padding: 8px 16px !important;
        }
      }
    `;
    document.head.appendChild(mobileStyle);
    
    console.log('✅ モバイル言語ボタンを設定しました');
  }
  
  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileLanguageButtons);
  } else {
    setupMobileLanguageButtons();
  }
  
  // ページが完全に読み込まれた後も実行
  window.addEventListener('load', setupMobileLanguageButtons);
  
})();