/**
 * 完全スクロール修正システム
 * 全体ページのスクロールを確実に有効化
 */

(function() {
  'use strict';
  
  console.log('完全スクロール修正開始');

  function completeScrollFix() {
    // 1. 基本スクロール設定の強制適用
    const style = document.createElement('style');
    style.id = 'complete-scroll-fix';
    style.textContent = `
      /* 全体ページスクロール強制有効化 */
      html {
        overflow-y: scroll !important;
        overflow-x: hidden !important;
        height: 100% !important;
        scroll-behavior: smooth !important;
      }
      
      body {
        overflow-y: scroll !important;
        overflow-x: hidden !important;
        height: auto !important;
        min-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        position: static !important;
      }
      
      /* コンテナの適切な高さ設定 */
      #main-content, .container, .container-fluid {
        height: auto !important;
        min-height: calc(100vh + 500px) !important;
        overflow: visible !important;
      }
      
      /* 協賛店登録セクションのスクロール無効化 */
      .sponsor-section,
      .sponsor-banner,
      .sponsor-scroll {
        overflow-x: hidden !important;
        overflow-y: visible !important;
        height: auto !important;
      }
      
      /* モーダルのスクロール設定 */
      .modal-open {
        overflow-y: scroll !important;
        padding-right: 0 !important;
      }
      
      /* その他要素のスクロール設定 */
      .card, .guide-card, section {
        overflow: visible !important;
      }
      
      /* スクロールバー常時表示 */
      ::-webkit-scrollbar {
        width: 8px !important;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f1f1 !important;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #888 !important;
        border-radius: 4px !important;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #555 !important;
      }
    `;
    
    // 既存のスクロール修正CSSを削除
    const existingScrollCSS = document.getElementById('scroll-fix-css');
    if (existingScrollCSS) {
      existingScrollCSS.remove();
    }
    
    document.head.appendChild(style);

    // 2. JavaScriptでの強制設定
    document.documentElement.style.overflowY = 'scroll';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowY = 'scroll';
    document.body.style.overflowX = 'hidden';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';

    // 3. 協賛店登録エリアのスクロール無効化
    const sponsorSections = document.querySelectorAll('.sponsor-section, .sponsor-banner, .sponsor-scroll');
    sponsorSections.forEach(section => {
      section.style.overflowX = 'hidden';
      section.style.overflowY = 'visible';
      section.style.height = 'auto';
    });

    // 4. メインコンテンツの高さ確保
    const mainContent = document.querySelector('main') || document.body;
    if (mainContent) {
      mainContent.style.minHeight = 'calc(100vh + 500px)';
      mainContent.style.height = 'auto';
    }

    // 5. ページの最下部にスクロールテスト用要素を追加
    let scrollTestElement = document.getElementById('scroll-test-element');
    if (!scrollTestElement) {
      scrollTestElement = document.createElement('div');
      scrollTestElement.id = 'scroll-test-element';
      scrollTestElement.style.cssText = `
        height: 200px;
        background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
        margin: 50px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 18px;
        border-radius: 10px;
      `;
      scrollTestElement.innerHTML = '<p>スクロールテストエリア - ページの一番下です</p>';
      document.body.appendChild(scrollTestElement);
    }

    // 6. スクロール機能のテスト
    function testScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      
      console.log('スクロール状態:', {
        scrollTop: scrollTop,
        scrollHeight: scrollHeight,
        clientHeight: clientHeight,
        canScroll: scrollHeight > clientHeight
      });
      
      if (scrollHeight <= clientHeight) {
        console.warn('ページの高さが不足しています。コンテンツを追加します。');
        
        // 追加コンテンツを挿入
        const additionalContent = document.createElement('div');
        additionalContent.style.cssText = `
          height: 1000px;
          background: linear-gradient(180deg, #f8f9fa, #e9ecef);
          margin: 20px 0;
          padding: 50px 20px;
          text-align: center;
          color: #6c757d;
        `;
        additionalContent.innerHTML = `
          <h3>追加コンテンツエリア</h3>
          <p>スクロール機能確認のための追加エリアです</p>
          <div style="height: 800px; display: flex; align-items: center; justify-content: center;">
            <p>スクロールして確認してください</p>
          </div>
        `;
        document.body.appendChild(additionalContent);
      }
    }

    // 7. 定期的なスクロール設定チェック
    setInterval(function() {
      if (document.documentElement.style.overflowY !== 'scroll') {
        document.documentElement.style.overflowY = 'scroll';
        document.body.style.overflowY = 'scroll';
        console.log('スクロール設定を復元しました');
      }
    }, 1000);

    testScroll();
    console.log('完全スクロール修正完了');
  }

  // 即座に実行
  completeScrollFix();

  // DOM読み込み完了後にも実行
  document.addEventListener('DOMContentLoaded', completeScrollFix);
  window.addEventListener('load', completeScrollFix);

  console.log('完全スクロール修正システム完了');
})();