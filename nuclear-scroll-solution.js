/**
 * 核兵器級スクロール解決システム
 * あらゆるスクロール阻害要因を完全に排除
 */

(function() {
  'use strict';
  
  console.log('🚀 核兵器級スクロール解決システム開始');
  
  // 1. CSSの完全リセット
  function forceScrollCSS() {
    const style = document.createElement('style');
    style.id = 'nuclear-scroll-fix';
    style.innerHTML = `
      /* 完全スクロール強制 */
      * {
        overflow: visible !important;
      }
      
      html, body {
        overflow: auto !important;
        overflow-y: scroll !important;
        height: auto !important;
        min-height: 300vh !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .modal-open {
        overflow: auto !important;
        overflow-y: scroll !important;
        padding-right: 0 !important;
        position: static !important;
      }
      
      .container, .container-fluid {
        min-height: auto !important;
        height: auto !important;
        overflow: visible !important;
      }
      
      /* すべてのfixedとabsolute要素の干渉防止 */
      [style*="position: fixed"], [style*="position: absolute"] {
        pointer-events: auto !important;
      }
    `;
    
    // 既存のスタイルを削除してから追加
    const existing = document.getElementById('nuclear-scroll-fix');
    if (existing) existing.remove();
    
    document.head.appendChild(style);
  }
  
  // 2. JavaScript干渉の完全排除
  function eliminateJSInterference() {
    // modal-openクラスの監視と即座削除
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
        forceScrollCSS(); // CSS再適用
      }
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });
    
    // Bootstrapのモーダルイベントを無効化
    document.addEventListener('show.bs.modal', function(e) {
      setTimeout(() => {
        document.body.classList.remove('modal-open');
        forceScrollCSS();
      }, 50);
    });
    
    document.addEventListener('shown.bs.modal', function(e) {
      setTimeout(() => {
        document.body.classList.remove('modal-open');
        forceScrollCSS();
      }, 50);
    });
  }
  
  // 3. DOM再構築でリセット
  function reconstructDOM() {
    // ページ高さを物理的に確保
    const spacer = document.createElement('div');
    spacer.id = 'nuclear-scroll-spacer';
    spacer.style.cssText = `
      height: 300vh !important;
      width: 1px !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -9999 !important;
    `;
    
    // 既存のスペーサーを削除
    const existing = document.getElementById('nuclear-scroll-spacer');
    if (existing) existing.remove();
    
    document.body.appendChild(spacer);
  }
  
  // 4. 緊急監視システム
  function emergencyMonitoring() {
    setInterval(() => {
      // スクロール可能性チェック
      const canScroll = document.documentElement.scrollHeight > window.innerHeight;
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const bodyOverflowY = window.getComputedStyle(document.body).overflowY;
      
      if (!canScroll || bodyOverflow === 'hidden' || bodyOverflowY === 'hidden') {
        console.log('⚠️ スクロール阻害検出 - 緊急修復実行');
        forceScrollCSS();
        reconstructDOM();
        
        // modal-openクラスを強制削除
        document.body.classList.remove('modal-open');
        
        // body要素のstyle属性を直接修正
        document.body.style.cssText = `
          overflow: auto !important;
          overflow-y: scroll !important;
          height: auto !important;
          min-height: 300vh !important;
          position: static !important;
          padding-right: 0px !important;
        `;
      }
    }, 50); // 50msごとに監視
  }
  
  // 5. 初期化実行
  function initialize() {
    // 即座に実行
    forceScrollCSS();
    eliminateJSInterference();
    reconstructDOM();
    
    // DOM読み込み後に再実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          forceScrollCSS();
          reconstructDOM();
          emergencyMonitoring();
        }, 100);
      });
    } else {
      setTimeout(() => {
        forceScrollCSS();
        reconstructDOM();
        emergencyMonitoring();
      }, 100);
    }
    
    // ページ完全読み込み後に最終実行
    window.addEventListener('load', () => {
      setTimeout(() => {
        forceScrollCSS();
        reconstructDOM();
        console.log('✅ 核兵器級スクロール解決完了');
      }, 200);
    });
  }
  
  // 即座に開始
  initialize();
  
})();