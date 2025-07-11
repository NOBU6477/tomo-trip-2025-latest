/**
 * 究極のスクロール修正システム
 * あらゆるスクロール阻害要因を完全に除去
 */

(function() {
  'use strict';
  
  console.log('🚀 究極のスクロール修正システム開始');
  
  // CSSリセット用スタイル
  function injectUltimateScrollCSS() {
    const existingStyle = document.getElementById('ultimate-scroll-fix');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'ultimate-scroll-fix';
    style.textContent = `
      /* 究極のスクロール修正 */
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        height: auto !important;
        min-height: 100vh !important;
        position: static !important;
        padding-right: 0 !important;
        margin-right: 0 !important;
        box-sizing: border-box !important;
      }
      
      body.modal-open {
        overflow-y: auto !important;
        padding-right: 0 !important;
        position: static !important;
      }
      
      /* Bootstrap modal による overflow hidden を無効化 */
      .modal-open {
        overflow: auto !important;
        padding-right: 0 !important;
      }
      
      /* 全体的なスクロール確保 */
      #root, .container, .container-fluid, main, .main-content {
        overflow: visible !important;
      }
      
      /* ヘッダーロゴの視認性向上 */
      .hero-section div[style*="position: absolute"]:first-child {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        z-index: 1000 !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ 究極スクロールCSS注入完了');
  }
  
  // スクロール状態を強制修正
  function forceScrollState() {
    // HTMLとBODYの直接修正
    document.documentElement.style.cssText = `
      overflow-x: hidden !important; 
      overflow-y: auto !important; 
      height: auto !important; 
      position: static !important;
    `;
    
    document.body.style.cssText = `
      overflow-x: hidden !important; 
      overflow-y: auto !important; 
      height: auto !important; 
      position: static !important; 
      padding-right: 0 !important; 
      margin-right: 0 !important;
    `;
    
    // 問題のあるクラスを削除
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
  }
  
  // 継続的な監視と修正
  function setupUltimateMonitoring() {
    // MutationObserver でのリアルタイム監視
    const observer = new MutationObserver(function(mutations) {
      let needsFix = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          if ((target === document.body || target === document.documentElement) &&
              (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
            needsFix = true;
          }
        }
      });
      
      if (needsFix) {
        forceScrollState();
      }
    });
    
    // BODY と HTML を監視
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // 50ms間隔での強制チェック
    setInterval(function() {
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;
      
      if (bodyOverflow === 'hidden' || htmlOverflow === 'hidden' || 
          document.body.classList.contains('modal-open')) {
        forceScrollState();
        console.log('🔧 スクロール状態を修正しました');
      }
    }, 50);
  }
  
  // 初期化関数
  function initialize() {
    injectUltimateScrollCSS();
    forceScrollState();
    setupUltimateMonitoring();
    
    console.log('🎯 究極のスクロール修正システム初期化完了');
    
    // スクロール状態のテスト
    setTimeout(function() {
      const canScroll = window.innerHeight < document.body.scrollHeight;
      console.log('📊 スクロール可能:', canScroll);
      console.log('📊 ページ高さ:', document.body.scrollHeight);
      console.log('📊 ビューポート高さ:', window.innerHeight);
    }, 1000);
  }
  
  // 即座に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // ページ表示時にも実行
  window.addEventListener('pageshow', initialize);
  
  // グローバル関数として公開
  window.ultimateScrollFix = {
    fix: forceScrollState,
    init: initialize,
    inject: injectUltimateScrollCSS
  };
  
})();