/**
 * 直接的なスクロール強制有効化
 * 最も確実な方法でスクロール問題を解決
 */
(function() {
  'use strict';
  
  console.log('🔧 直接スクロール強制システム開始');
  
  // 最も強力なCSS強制適用
  function applyForceScrollCSS() {
    // 既存のスタイルを削除
    const existingStyle = document.getElementById('force-scroll-css');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'force-scroll-css';
    style.setAttribute('data-priority', 'highest');
    
    // 最高優先度のCSS
    style.textContent = `
      /* 最優先スクロール有効化 */
      body, html {
        overflow: visible !important;
        overflow-y: scroll !important;
        overflow-x: visible !important;
        height: auto !important;
        max-height: none !important;
        min-height: 100vh !important;
        position: static !important;
        padding-right: 0 !important;
        margin: 0 !important;
        touch-action: auto !important;
        user-select: auto !important;
        pointer-events: auto !important;
      }
      
      /* Bootstrap Modal対策 */
      body.modal-open {
        overflow: visible !important;
        overflow-y: scroll !important;
        padding-right: 0 !important;
      }
      
      /* 全てのモーダル背景を無効化 */
      .modal-backdrop {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* 固定要素の干渉防止 */
      .fixed-top, .fixed-bottom, .sticky-top {
        position: relative !important;
      }
      
      /* 全体コンテナの確保 */
      .container, .container-fluid {
        overflow: visible !important;
        height: auto !important;
      }
    `;
    
    // headの最初に挿入して最高優先度を確保
    document.head.insertBefore(style, document.head.firstChild);
    console.log('✅ 強制スクロールCSS適用完了');
  }
  
  // JavaScript レベルでの強制修正
  function forceEnableScrollJavaScript() {
    console.log('🔧 JavaScript強制修正実行');
    
    // body要素の全属性をクリア
    const body = document.body;
    const html = document.documentElement;
    
    // クラス削除
    body.classList.remove('modal-open', 'no-scroll', 'overflow-hidden');
    html.classList.remove('modal-open', 'no-scroll', 'overflow-hidden');
    
    // スタイル属性を完全にクリア
    body.removeAttribute('style');
    html.removeAttribute('style');
    
    // 新しいスタイルを強制適用
    body.style.cssText = 'overflow: visible !important; overflow-y: scroll !important; height: auto !important;';
    html.style.cssText = 'overflow: visible !important; overflow-y: scroll !important; height: auto !important;';
    
    // modal-backdrop削除
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    
    // 全てのモーダル要素を非表示
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    
    console.log('✅ JavaScript強制修正完了');
  }
  
  // DOM監視による継続的修正
  function setupContinuousMonitoring() {
    const observer = new MutationObserver(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.overflow === 'hidden' || bodyStyle.overflowY === 'hidden') {
        console.log('🚨 スクロール無効化検出 - 即座に修正');
        forceEnableScrollJavaScript();
        applyForceScrollCSS();
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: false,
      subtree: false
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: false,
      subtree: false
    });
    
    console.log('📡 継続監視開始');
    return observer;
  }
  
  // 言語切り替え時の完全オーバーライド
  function overrideLanguageSwitch() {
    const originalSwitch = window.forceLanguageSwitch;
    
    if (originalSwitch) {
      window.forceLanguageSwitch = function(lang) {
        console.log('🌐 言語切り替えオーバーライド:', lang);
        
        // 事前修正
        forceEnableScrollJavaScript();
        applyForceScrollCSS();
        
        // 元の処理実行
        const result = originalSwitch.call(this, lang);
        
        // 処理後の修正（複数回実行）
        [50, 100, 200, 500, 1000, 2000].forEach(delay => {
          setTimeout(() => {
            forceEnableScrollJavaScript();
            applyForceScrollCSS();
          }, delay);
        });
        
        return result;
      };
      
      console.log('✅ 言語切り替えオーバーライド完了');
    }
  }
  
  // 緊急修復関数をグローバルに公開
  window.emergencyScrollRepair = function() {
    console.log('🚨 緊急スクロール修復実行');
    
    forceEnableScrollJavaScript();
    applyForceScrollCSS();
    
    // ページ全体を再描画
    document.body.style.display = 'none';
    setTimeout(() => {
      document.body.style.display = '';
      forceEnableScrollJavaScript();
      applyForceScrollCSS();
    }, 10);
    
    console.log('✅ 緊急修復完了');
  };
  
  // 初期化関数
  function initialize() {
    console.log('🔧 直接スクロール強制システム初期化');
    
    // 即座に修正実行
    forceEnableScrollJavaScript();
    applyForceScrollCSS();
    
    // 継続監視開始
    setupContinuousMonitoring();
    
    // 言語切り替えオーバーライド
    overrideLanguageSwitch();
    
    // 追加の安全策として遅延実行
    setTimeout(() => {
      forceEnableScrollJavaScript();
      applyForceScrollCSS();
    }, 100);
    
    console.log('✅ 直接スクロール強制システム準備完了');
    console.log('緊急時: emergencyScrollRepair() を実行してください');
  }
  
  // 即座に初期化実行
  initialize();
  
})();