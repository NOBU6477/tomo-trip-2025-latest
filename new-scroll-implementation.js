/**
 * 新しいスクロール実装
 * 現在のUIを保持しながら確実にスクロールを有効化
 */

(function() {
  'use strict';
  
  console.log('🚀 新しいスクロール実装を開始');
  
  // 1. 基本的なスクロール設定を強制適用
  function enforceBasicScroll() {
    // HTML要素のスクロール設定
    const html = document.documentElement;
    html.style.overflow = 'visible';
    html.style.overflowY = 'auto';
    html.style.height = 'auto';
    html.style.minHeight = '100vh';
    
    // Body要素のスクロール設定
    const body = document.body;
    body.style.overflow = 'visible';
    body.style.overflowY = 'auto';
    body.style.height = 'auto';
    body.style.minHeight = '500vh'; // 十分な高さを確保
    body.style.position = 'static';
    
    // modal-openクラスを削除
    body.classList.remove('modal-open');
  }
  
  // 2. 妨害要素を除去
  function removeScrollBlockers() {
    // 問題のあるCSSルールを上書き
    const style = document.createElement('style');
    style.id = 'scroll-enforcement';
    style.textContent = `
      html, body {
        overflow: visible !important;
        overflow-y: auto !important;
        height: auto !important;
        min-height: 500vh !important;
        position: static !important;
      }
      
      body.modal-open {
        overflow: visible !important;
        overflow-y: auto !important;
        padding-right: 0 !important;
        position: static !important;
      }
      
      .modal-backdrop {
        display: none !important;
      }
      
      * {
        max-height: none !important;
      }
    `;
    
    // 既存のスタイルを削除してから新しいものを追加
    const existingStyle = document.getElementById('scroll-enforcement');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);
  }
  
  // 3. スクロールテストコンテンツを追加
  function addScrollTestContent() {
    // 既存のテストコンテンツがあれば削除
    const existingTest = document.getElementById('scroll-test-content');
    if (existingTest) {
      existingTest.remove();
    }
    
    // スクロールテスト用コンテンツを追加
    const scrollTest = document.createElement('div');
    scrollTest.id = 'scroll-test-content';
    scrollTest.style.cssText = `
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 200vh;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.1));
      z-index: -1;
      pointer-events: none;
    `;
    
    document.body.appendChild(scrollTest);
  }
  
  // 4. スクロール監視システム
  function setupScrollMonitoring() {
    // DOM変更を監視してスクロール阻害を防止
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target === document.body && target.classList.contains('modal-open')) {
            target.classList.remove('modal-open');
            target.style.overflow = 'visible';
            target.style.overflowY = 'auto';
          }
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // スタイル変更を監視
    const styleObserver = new MutationObserver(() => {
      enforceBasicScroll();
    });
    
    styleObserver.observe(document.head, {
      childList: true,
      subtree: true
    });
  }
  
  // 5. 初期化処理
  function initialize() {
    enforceBasicScroll();
    removeScrollBlockers();
    addScrollTestContent();
    setupScrollMonitoring();
    
    console.log('✅ 新しいスクロール実装完了');
    
    // 5秒後に動作確認
    setTimeout(() => {
      const canScroll = document.body.scrollHeight > window.innerHeight;
      console.log('📊 スクロール状態:', canScroll ? '有効' : '無効');
      console.log('📏 ページ高さ:', document.body.scrollHeight);
      console.log('📏 画面高さ:', window.innerHeight);
    }, 5000);
  }
  
  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // ページロード完了後にも実行
  window.addEventListener('load', initialize);
  
})();