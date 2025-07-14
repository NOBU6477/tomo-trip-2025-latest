/**
 * 究極のスクロール修正システム
 * 簡潔かつ効果的なoverflowの設定に集中
 */

(function() {
  'use strict';
  
  console.log('🎯 究極のスクロール修正開始');
  
  // シンプルな修正アプローチ
  function applySimpleScrollFix() {
    // CSSによる強制設定
    const style = document.createElement('style');
    style.id = 'ultimate-scroll-fix';
    style.innerHTML = `
      /* 究極のシンプル設定 */
      html {
        overflow: auto !important;
        overflow-y: auto !important;
      }
      
      body {
        overflow: auto !important;
        overflow-y: auto !important;
        min-height: 500vh !important;
        height: auto !important;
      }
      
      /* modal-open無効化 */
      body.modal-open {
        overflow: auto !important;
        overflow-y: auto !important;
        padding-right: 0 !important;
      }
      
      /* 全要素のhidden防止 */
      * {
        overflow: auto !important;
      }
      
      .container, .container-fluid {
        overflow: auto !important;
        min-height: auto !important;
      }
    `;
    
    // 既存の修正CSSを削除して新しいものを追加
    const existing = document.getElementById('ultimate-scroll-fix');
    if (existing) existing.remove();
    
    document.head.appendChild(style);
    console.log('✅ CSS強制設定完了');
  }
  
  // 継続監視システム（50ms間隔）
  function setupContinuousMonitoring() {
    setInterval(() => {
      // modal-openクラス即座削除
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
      }
      
      // bodyスタイル直接設定
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.overflow === 'hidden' || bodyStyle.overflowY === 'hidden') {
        document.body.style.overflow = 'auto';
        document.body.style.overflowY = 'auto';
        document.body.style.minHeight = '500vh';
        console.log('🔧 body overflow 強制修正');
      }
      
      // htmlスタイル確認
      const htmlStyle = window.getComputedStyle(document.documentElement);
      if (htmlStyle.overflow === 'hidden' || htmlStyle.overflowY === 'hidden') {
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.overflowY = 'auto';
        console.log('🔧 html overflow 強制修正');
      }
      
    }, 50); // 50msごとに監視
  }
  
  // DOM変更監視
  function setupDOMMonitoring() {
    const observer = new MutationObserver(() => {
      // modal-openが追加されたら即座に削除
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    console.log('👁️ DOM変更監視開始');
  }
  
  // 初期化
  function initialize() {
    // 即座に適用
    applySimpleScrollFix();
    setupDOMMonitoring();
    
    // DOM読み込み後に再適用
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          applySimpleScrollFix();
          setupContinuousMonitoring();
        }, 100);
      });
    } else {
      setTimeout(() => {
        applySimpleScrollFix();
        setupContinuousMonitoring();
      }, 100);
    }
    
    // ページ完全読み込み後に最終適用
    window.addEventListener('load', () => {
      setTimeout(() => {
        applySimpleScrollFix();
        console.log('🎯 究極のスクロール修正完了');
      }, 200);
    });
  }
  
  // 即座に開始
  initialize();
  
})();