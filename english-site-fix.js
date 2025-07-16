/**
 * 英語サイト専用修正スクリプト
 * 日本語サイトと同じ言語切り替えデザインを強制適用
 */

(function() {
  'use strict';
  
  console.log('🇺🇸 英語サイト修正開始');
  
  // 古いドロップダウンを完全削除
  function removeOldDropdown() {
    const selectors = [
      '.dropdown[aria-labelledby="languageDropdown"]',
      '#languageDropdown',
      '.nav-item.dropdown',
      '.dropdown-toggle'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.textContent.includes('English') || el.textContent.includes('日本語')) {
          el.remove();
          console.log('🗑️ 古いドロップダウンを削除:', selector);
        }
      });
    });
  }
  
  // CSS強制適用
  function applyCSSFix() {
    const style = document.createElement('style');
    style.id = 'english-site-fix-css';
    style.textContent = `
      /* 古いドロップダウンを完全に隠す - より強力なセレクター */
      .dropdown[aria-labelledby="languageDropdown"],
      #languageDropdown,
      .nav-item.dropdown,
      .dropdown-toggle,
      .btn.btn-outline-light.dropdown-toggle,
      nav .dropdown {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      
      /* 中央言語ボタンを強制表示 */
      .language-switcher-center {
        display: flex !important;
        align-items: center !important;
        gap: 0 !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 1000 !important;
      }
      
      .lang-btn-jp, .lang-btn-en {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        font-size: 13px !important;
        min-width: 100px !important;
        transition: all 0.3s ease !important;
        position: relative !important;
        z-index: 1001 !important;
      }
      
      .lang-btn-jp:hover {
        background: linear-gradient(135deg, #ff5252, #ff7979) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 15px rgba(255,107,107,0.4) !important;
      }
      
      .lang-btn-en:hover {
        background: linear-gradient(135deg, #2196f3, #4fc3f7) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 15px rgba(66,135,245,0.4) !important;
      }
      
      /* ナビゲーション中央配置を確保 */
      .d-flex.justify-content-center.flex-grow-1 {
        display: flex !important;
        justify-content: center !important;
        flex-grow: 1 !important;
        position: relative !important;
      }
      
      /* ナビゲーションバー内で古いボタンを隠す */
      .navbar-nav .dropdown,
      .navbar .dropdown {
        display: none !important;
      }
      
      @media (max-width: 768px) {
        .language-switcher-center {
          margin: 0.5rem 0 !important;
        }
        .lang-btn-jp, .lang-btn-en {
          min-width: 80px !important;
          font-size: 12px !important;
          padding: 6px 15px !important;
        }
      }
    `;
    
    const existingStyle = document.getElementById('english-site-fix-css');
    if (existingStyle) existingStyle.remove();
    document.head.appendChild(style);
  }
  
  // 継続的監視と修正
  function continuousMonitoring() {
    let attempts = 0;
    const maxAttempts = 10;
    
    const monitor = setInterval(() => {
      attempts++;
      
      // 古いドロップダウンが再表示されていないかチェック
      const oldElements = document.querySelectorAll('.dropdown[aria-labelledby="languageDropdown"], #languageDropdown');
      if (oldElements.length > 0) {
        console.log('🔄 古いドロップダウンを再削除');
        removeOldDropdown();
      }
      
      // 新しいボタンが見えているかチェック
      const newButtons = document.querySelector('.language-switcher-center');
      if (!newButtons || getComputedStyle(newButtons).display === 'none') {
        console.log('🔄 言語ボタンを再表示');
        applyCSSFix();
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(monitor);
        console.log('✅ 英語サイト監視完了');
      }
    }, 200);
  }
  
  // 実行
  function execute() {
    // 即座に実行
    removeOldDropdown();
    applyCSSFix();
    
    // DOMContentLoaded後にも実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
          removeOldDropdown();
          applyCSSFix();
          continuousMonitoring();
          console.log('✅ 英語サイト修正完了');
        }, 100);
      });
    } else {
      setTimeout(() => {
        removeOldDropdown();
        applyCSSFix();
        continuousMonitoring();
        console.log('✅ 英語サイト修正完了');
      }, 100);
    }
  }
  
  execute();
  
})();