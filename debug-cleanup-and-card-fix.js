/**
 * デバッグ情報の非表示とガイドカード表示を統合修正
 */

(function() {
  'use strict';

  // デバッグ情報の非表示処理
  function hideDebugInfo() {
    // デバッグテキストが表示されているエリアを非表示
    const debugElements = document.querySelectorAll('*');
    debugElements.forEach(element => {
      if (element.textContent && 
          (element.textContent.includes('text = text.replace') || 
           element.textContent.includes('console.log') ||
           element.textContent.includes('翻訳完了') ||
           element.textContent.includes('ガイド翻訳') ||
           element.textContent.length > 500)) {
        element.style.display = 'none';
      }
    });

    // デバッグ用のスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
      /* デバッグ情報を非表示 */
      body::before,
      body::after {
        display: none !important;
      }
      
      /* 長いテキストを非表示 */
      *[style*="white-space"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ガイドカードの強制表示処理
  function forceShowGuideCards() {
    console.log('ガイドカードの表示修正を開始');

    // すべてのガイドカードを検索
    const possibleCardSelectors = [
      '.guide-card',
      '.card',
      '.col-md-4',
      '.col-lg-4',
      '.guide-item',
      '[data-guide]'
    ];

    let cardsFound = 0;
    let cardsShown = 0;

    possibleCardSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        const text = element.textContent;
        
        // ガイドカードの特徴をチェック
        if (text.includes('ガイド') && 
            (text.includes('円') || text.includes('¥') || text.includes('詳細'))) {
          
          cardsFound++;
          
          // カード自体を表示
          if (element.style.display === 'none' || element.classList.contains('d-none')) {
            element.style.display = '';
            element.classList.remove('d-none');
            cardsShown++;
          }
          
          // 親コンテナも表示
          const parent = element.closest('.col, .guide-item, .col-md-4, .col-lg-4');
          if (parent && (parent.style.display === 'none' || parent.classList.contains('d-none'))) {
            parent.style.display = '';
            parent.classList.remove('d-none');
            cardsShown++;
          }
        }
      });
    });

    console.log(`ガイドカード: ${cardsFound}件発見、${cardsShown}件を表示修正`);

    // フィルターの無効化
    disableFilteringTemporarily();
  }

  // フィルター機能の一時無効化
  function disableFilteringTemporarily() {
    // 統一フィルター関数を無効化
    if (window.executeUnifiedFilter) {
      const originalFilter = window.executeUnifiedFilter;
      window.executeUnifiedFilter = function() {
        console.log('フィルターを一時無効化中');
        // 全カードを表示状態にリセット
        forceShowGuideCards();
      };
    }

    // 他のフィルター関数も無効化
    ['applyFilters', 'filterGuides', 'runFilter'].forEach(funcName => {
      if (window[funcName]) {
        window[funcName] = forceShowGuideCards;
      }
    });
  }

  // ページのクリーンアップ
  function cleanupPage() {
    hideDebugInfo();
    forceShowGuideCards();
    
    // ガイド数カウンターを修正
    const counters = document.querySelectorAll('#search-results-counter, .guide-counter');
    const visibleCards = document.querySelectorAll('.guide-card:not([style*="display: none"]):not(.d-none), .card:not([style*="display: none"]):not(.d-none)').length;
    
    counters.forEach(counter => {
      if (counter.textContent.includes('ガイド')) {
        counter.textContent = `${visibleCards}件のガイドを表示`;
      }
    });
  }

  // 即座に実行
  cleanupPage();

  // DOMロード後に実行
  document.addEventListener('DOMContentLoaded', cleanupPage);

  // ページロード後に実行
  window.addEventListener('load', cleanupPage);

  // 定期的に実行（3秒間隔）
  const cleanupInterval = setInterval(cleanupPage, 3000);

  // 10秒後に定期実行を停止
  setTimeout(() => {
    clearInterval(cleanupInterval);
    console.log('ページクリーンアップ完了');
  }, 10000);

  // グローバル関数として公開
  window.cleanupPage = cleanupPage;
  window.forceShowGuideCards = forceShowGuideCards;

})();