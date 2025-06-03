/**
 * ガイドカード緊急表示修正
 * フィルターによる非表示を強制的に解除
 */

(function() {
  'use strict';

  console.log('ガイドカード緊急修正を開始');

  // 即座に実行
  emergencyShowCards();

  // DOM変更を監視
  const observer = new MutationObserver(emergencyShowCards);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // 定期実行
  setInterval(emergencyShowCards, 1000);

  function emergencyShowCards() {
    // すべてのガイドカードコンテナを強制表示
    const containers = document.querySelectorAll('.col, .col-md-4, .col-lg-4, .guide-item');
    
    containers.forEach(container => {
      // カードが含まれているかチェック
      const hasCard = container.querySelector('.card, .guide-card') || 
                     container.textContent.includes('ガイド') ||
                     container.textContent.includes('円/') ||
                     container.textContent.includes('詳細を見る');
      
      if (hasCard) {
        // 強制表示
        container.style.display = '';
        container.classList.remove('d-none');
        
        // 内部のカードも表示
        const cards = container.querySelectorAll('.card, .guide-card');
        cards.forEach(card => {
          card.style.display = '';
          card.classList.remove('d-none');
        });
      }
    });

    // 直接的にすべてのカードを表示
    const allCards = document.querySelectorAll('.card, .guide-card');
    allCards.forEach(card => {
      card.style.display = '';
      card.classList.remove('d-none');
      
      // 親要素も表示
      let parent = card.parentElement;
      while (parent && parent !== document.body) {
        if (parent.style.display === 'none') {
          parent.style.display = '';
        }
        parent.classList.remove('d-none');
        parent = parent.parentElement;
      }
    });

    // フィルター関数を無効化
    if (window.executeUnifiedFilter) {
      window.executeUnifiedFilter = function() {
        console.log('フィルター無効化 - すべてのカードを表示');
        emergencyShowCards();
      };
    }
  }

  // グローバル関数として公開
  window.emergencyShowCards = emergencyShowCards;

  console.log('ガイドカード緊急修正を初期化完了');
})();