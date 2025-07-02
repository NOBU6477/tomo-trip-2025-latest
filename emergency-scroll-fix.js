/**
 * 緊急スクロール修復システム
 * 最高優先度でスクロール機能を強制復元
 */
(function() {
  'use strict';
  
  console.log('🚨 緊急スクロール修復システム起動');
  
  // 最高優先度CSS強制適用
  function injectEmergencyScrollCSS() {
    const style = document.createElement('style');
    style.id = 'emergency-scroll-fix';
    style.innerHTML = `
      /* 最高優先度でスクロールを強制有効化 */
      body, html {
        overflow: visible !important;
        overflow-y: scroll !important;
        overflow-x: visible !important;
        height: auto !important;
        max-height: none !important;
        min-height: 100vh !important;
        position: static !important;
        padding-right: 0px !important;
        touch-action: auto !important;
      }
      
      /* モーダル使用時もスクロール維持 */
      body.modal-open {
        overflow: visible !important;
        overflow-y: scroll !important;
        padding-right: 0px !important;
      }
      
      /* バックドロップを非表示 */
      .modal-backdrop {
        display: none !important;
      }
      
      /* ページ全体のスクロール確保 */
      #app, .container-fluid, .main-content {
        position: static !important;
        overflow: visible !important;
      }
    `;
    
    // head要素の最後に追加して他のCSSより優先
    document.head.appendChild(style);
    console.log('✅ 緊急スクロール修復CSS適用完了');
  }
  
  // スクロール状態を監視・修復
  function monitorAndFixScroll() {
    setInterval(() => {
      // bodyのoverflow設定をチェック・修復
      if (document.body.style.overflow === 'hidden' || 
          window.getComputedStyle(document.body).overflow === 'hidden') {
        document.body.style.overflow = 'visible';
        document.body.style.overflowY = 'scroll';
        console.log('🔧 スクロール設定を修復しました');
      }
      
      // htmlのoverflow設定をチェック・修復
      if (document.documentElement.style.overflow === 'hidden' || 
          window.getComputedStyle(document.documentElement).overflow === 'hidden') {
        document.documentElement.style.overflow = 'visible';
        document.documentElement.style.overflowY = 'scroll';
        console.log('🔧 HTMLスクロール設定を修復しました');
      }
      
      // modal-openクラスによる影響を修復
      if (document.body.classList.contains('modal-open')) {
        document.body.style.overflow = 'visible';
        document.body.style.paddingRight = '0px';
      }
    }, 50); // 50ms間隔で高頻度監視
  }
  
  // 言語切り替えリンクの監視と修復
  function protectLanguageSwitching() {
    const languageLinks = document.querySelectorAll('a[href*="index"]');
    
    languageLinks.forEach(link => {
      link.addEventListener('click', () => {
        console.log('🔄 言語切り替えを検出 - スクロール保護強化');
        
        // 新しいページに移動する前にスクロール状態を強制設定
        sessionStorage.setItem('forceScrollFix', 'true');
      });
    });
  }
  
  // ページ読み込み時の強制修復
  function forceFixOnLoad() {
    if (sessionStorage.getItem('forceScrollFix') === 'true') {
      console.log('🔧 ページ読み込み時の強制スクロール修復実行');
      
      // 複数回実行して確実に修復
      setTimeout(() => {
        document.body.style.overflow = 'visible';
        document.body.style.overflowY = 'scroll';
        document.documentElement.style.overflow = 'visible';
        document.documentElement.style.overflowY = 'scroll';
      }, 100);
      
      setTimeout(() => {
        document.body.style.overflow = 'visible';
        document.body.style.overflowY = 'scroll';
        document.documentElement.style.overflow = 'visible';
        document.documentElement.style.overflowY = 'scroll';
      }, 300);
      
      setTimeout(() => {
        document.body.style.overflow = 'visible';
        document.body.style.overflowY = 'scroll';
        document.documentElement.style.overflow = 'visible';
        document.documentElement.style.overflowY = 'scroll';
      }, 500);
      
      // フラグをクリア
      sessionStorage.removeItem('forceScrollFix');
    }
  }
  
  // 初期化
  function initialize() {
    injectEmergencyScrollCSS();
    monitorAndFixScroll();
    protectLanguageSwitching();
    forceFixOnLoad();
    
    console.log('✅ 緊急スクロール修復システム完全初期化');
  }
  
  // 即座に実行
  initialize();
  
  // DOMContentLoaded後にも再実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  // ページ完全読み込み後にも再実行
  window.addEventListener('load', initialize);
  
})();