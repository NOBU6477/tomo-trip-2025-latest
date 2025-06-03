/**
 * ガイドカード強制表示スクリプト
 * CSSレベルでの非表示を完全に回避し、すべてのガイドカードを強制表示する
 */

(function() {
  'use strict';

  // 強制表示用のCSSスタイルを注入
  function injectForceDisplayStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      /* ガイドカード強制表示 */
      .guide-grid .col,
      .guide-grid .col-md-4,
      .guide-grid .col-lg-4,
      .guide-cards .col,
      .guide-cards .col-md-4,
      .guide-cards .col-lg-4,
      .guide-card,
      .card {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        height: auto !important;
        width: auto !important;
        transform: none !important;
      }
      
      /* 隠しクラスを無効化 */
      .d-none {
        display: block !important;
      }
      
      /* ガイドカードコンテナの強制表示 */
      .guide-grid,
      .guide-cards,
      #guide-grid {
        display: flex !important;
        flex-wrap: wrap !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
    console.log('強制表示CSSを注入しました');
  }

  // ガイドカードを物理的に強制表示
  function forceShowAllCards() {
    const containers = document.querySelectorAll('.guide-grid, .guide-cards, #guide-grid');
    
    containers.forEach(container => {
      // コンテナ自体を強制表示
      container.style.display = 'flex';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
      
      // 子要素のカードをすべて強制表示
      const cards = container.querySelectorAll('.col, .guide-card, .card');
      cards.forEach((card, index) => {
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        card.style.position = 'relative';
        card.style.transform = 'none';
        card.classList.remove('d-none');
        
        console.log(`カード${index + 1}を強制表示: ${card.querySelector('.card-title, h5, h6')?.textContent || 'Unknown'}`);
      });
    });
  }

  // DOM変更の監視とカード強制表示
  function setupMutationObserver() {
    const observer = new MutationObserver(() => {
      forceShowAllCards();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  // 初期化
  function init() {
    console.log('ガイドカード強制表示スクリプトを開始');
    
    // CSSスタイルを注入
    injectForceDisplayStyles();
    
    // 即座に強制表示
    forceShowAllCards();
    
    // DOM変更を監視
    setupMutationObserver();
    
    // 定期的に強制表示を実行
    setInterval(forceShowAllCards, 1000);
  }

  // ページ読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();