/**
 * ガイドカード表示修正スクリプト
 * フィルターで非表示になったカードを強制表示
 */

(function() {
  'use strict';

  console.log('ガイドカード表示修正を開始...');

  // 即座に実行
  forceShowAllGuideCards();

  // DOMロード後にも実行
  document.addEventListener('DOMContentLoaded', forceShowAllGuideCards);
  
  // ページロード後にも実行
  window.addEventListener('load', forceShowAllGuideCards);

  // 定期的にチェック
  setInterval(forceShowAllGuideCards, 2000);

  /**
   * すべてのガイドカードを強制表示
   */
  function forceShowAllGuideCards() {
    console.log('ガイドカードの表示状態をチェック中...');
    
    // 複数のセレクタでガイドカードを検索
    const cardSelectors = [
      '.guide-card',
      '.card.guide-card',
      '.guide-item .card',
      '.col-md-4 .card',
      '.col .card',
      '[data-guide-id]'
    ];

    let totalCards = 0;
    let visibleCards = 0;

    cardSelectors.forEach(selector => {
      const cards = document.querySelectorAll(selector);
      
      cards.forEach(card => {
        // 重複チェック
        if (card.dataset.processed) return;
        card.dataset.processed = 'true';
        
        totalCards++;
        
        // カード自体を表示
        if (card.style.display === 'none' || card.classList.contains('d-none')) {
          card.style.display = '';
          card.classList.remove('d-none');
          console.log('カードを表示:', card);
        }
        
        // 親コンテナも表示
        const parentContainer = card.closest('.col, .guide-item, .col-md-4, .col-lg-4');
        if (parentContainer && (parentContainer.style.display === 'none' || parentContainer.classList.contains('d-none'))) {
          parentContainer.style.display = '';
          parentContainer.classList.remove('d-none');
          console.log('親コンテナを表示:', parentContainer);
        }
        
        // 可視性をチェック
        const rect = card.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          visibleCards++;
        }
      });
    });

    console.log(`ガイドカード状況: 総数 ${totalCards}, 表示中 ${visibleCards}`);
    
    // カードが見つからない場合、より深く検索
    if (totalCards === 0) {
      findAndShowHiddenCards();
    }
    
    // フィルターをリセット
    resetAllFilters();
    
    // カウンターを更新
    updateGuideCounter();
  }

  /**
   * 隠れているカードを詳細検索
   */
  function findAndShowHiddenCards() {
    console.log('隠れているカードを詳細検索中...');
    
    // すべてのdivを検索してガイドカードっぽいものを探す
    const allDivs = document.querySelectorAll('div');
    
    allDivs.forEach(div => {
      const text = div.textContent.toLowerCase();
      
      // ガイドカードの特徴をチェック
      if (text.includes('ガイド') || 
          text.includes('guide') || 
          text.includes('円/') || 
          text.includes('¥') ||
          text.includes('詳細を見る') ||
          div.querySelector('.card-title, .card-body, .btn')) {
        
        // 非表示になっているかチェック
        if (div.style.display === 'none' || div.classList.contains('d-none')) {
          div.style.display = '';
          div.classList.remove('d-none');
          console.log('隠れていたカードを発見・表示:', div);
        }
      }
    });
  }

  /**
   * すべてのフィルターをリセット
   */
  function resetAllFilters() {
    // 検索フィルター要素をリセット
    const filterElements = [
      '#location-filter',
      '#language-filter',
      '#fee-filter',
      '#keyword-filter-custom'
    ];
    
    filterElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        if (element.tagName === 'SELECT') {
          element.value = 'すべて';
        } else {
          element.value = '';
        }
      }
    });
    
    // チェックボックスをリセット
    const checkboxes = document.querySelectorAll('.keyword-checkbox, input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    console.log('フィルターをリセットしました');
  }

  /**
   * ガイドカウンターを更新
   */
  function updateGuideCounter() {
    const visibleCards = document.querySelectorAll('.guide-card:not([style*="display: none"]):not(.d-none)').length;
    
    const counters = document.querySelectorAll('#search-results-counter, .guide-counter');
    counters.forEach(counter => {
      counter.textContent = `${visibleCards}件のガイドを表示`;
    });
    
    // 「〇件のガイドが見つかりました」も更新
    const foundMessages = document.querySelectorAll('*');
    foundMessages.forEach(element => {
      if (element.textContent && element.textContent.includes('件のガイドが見つかりました')) {
        element.textContent = `${visibleCards}件のガイドが見つかりました`;
      }
    });
  }

  /**
   * フィルター機能を一時的に無効化
   */
  function disableFilterFunctions() {
    // 統一フィルター機能を無効化
    if (window.executeUnifiedFilter) {
      window.executeUnifiedFilter = function() {
        console.log('フィルター機能を無効化しました');
        forceShowAllGuideCards();
      };
    }
    
    // 他のフィルター関数も無効化
    const filterFunctions = [
      'applyFilters',
      'filterGuides',
      'executeFilter',
      'runFilter'
    ];
    
    filterFunctions.forEach(funcName => {
      if (window[funcName]) {
        window[funcName] = function() {
          console.log(`${funcName} を無効化しました`);
          forceShowAllGuideCards();
        };
      }
    });
  }

  // フィルター機能を無効化
  disableFilterFunctions();

  // グローバル関数として公開
  window.forceShowAllGuideCards = forceShowAllGuideCards;
  window.resetAllFilters = resetAllFilters;

  console.log('ガイドカード表示修正スクリプトを初期化完了');

})();