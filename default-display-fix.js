/**
 * デフォルト表示修正システム
 * ページ読み込み時に全ガイドを表示し、フィルターをリセット
 */

(function() {
  'use strict';
  
  console.log('🔧 デフォルト表示修正開始');
  
  function resetToDefaultDisplay() {
    try {
      // 1. 全ガイドカードを表示
      const allGuideCards = document.querySelectorAll('.guide-item, .guide-card, [class*="guide"]');
      allGuideCards.forEach(card => {
        if (card.classList.contains('guide-item') || card.classList.contains('guide-card')) {
          card.classList.remove('d-none');
          card.style.display = 'block';
          card.style.visibility = 'visible';
        }
      });
      
      // 2. フィルター要素をリセット
      const filterInputs = document.querySelectorAll('input[type="checkbox"], input[type="text"], select');
      filterInputs.forEach(input => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else if (input.type === 'text') {
          input.value = '';
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0;
        }
      });
      
      // 3. カウンターを正確に更新
      const visibleGuides = document.querySelectorAll('.guide-item:not(.d-none), .guide-card:not(.d-none)');
      const totalGuides = visibleGuides.length;
      
      const isEnglishSite = window.location.href.includes('index-en.html');
      
      if (isEnglishSite) {
        const counter = document.querySelector('#guide-counter, .guide-counter');
        if (counter) {
          counter.textContent = `Found ${totalGuides} guides`;
        }
      } else {
        const counter = document.querySelector('#search-results-counter');
        if (counter) {
          counter.textContent = `${totalGuides}人のガイドが見つかりました`;
        }
      }
      
      console.log(`✅ デフォルト表示完了: ${totalGuides}ガイド`);
      
    } catch (error) {
      console.error('デフォルト表示エラー:', error);
    }
  }
  
  function forceShowAllGuides() {
    // より強力な全表示処理
    setTimeout(() => {
      const hiddenGuides = document.querySelectorAll('.guide-item.d-none, .guide-card.d-none, [style*="display: none"]');
      hiddenGuides.forEach(guide => {
        guide.classList.remove('d-none');
        guide.style.display = 'block';
        guide.style.visibility = 'visible';
      });
      
      // "Load More" ボタンがある場合は自動クリック
      const loadMoreButtons = document.querySelectorAll('[class*="load"], [class*="more"], [class*="show"]');
      loadMoreButtons.forEach(btn => {
        if (btn.textContent.includes('more') || btn.textContent.includes('もっと') || btn.textContent.includes('さらに')) {
          btn.click();
        }
      });
      
      resetToDefaultDisplay();
    }, 500);
  }
  
  function preventFilterAutoApply() {
    // フィルターの自動適用を防ぐ
    const filterElements = document.querySelectorAll('input, select, button');
    filterElements.forEach(element => {
      // change イベントを一時的に無効化
      const originalOnChange = element.onchange;
      element.onchange = null;
      
      // 後で復元
      setTimeout(() => {
        element.onchange = originalOnChange;
      }, 2000);
    });
  }
  
  function initialize() {
    // 即座にデフォルト表示実行
    resetToDefaultDisplay();
    
    // フィルター自動適用を防ぐ
    preventFilterAutoApply();
    
    // 追加の強制表示
    forceShowAllGuides();
    
    // 継続的な監視（3秒間）
    let attempts = 0;
    const monitorInterval = setInterval(() => {
      resetToDefaultDisplay();
      attempts++;
      
      if (attempts >= 6) { // 3秒 × 6回 = 18秒
        clearInterval(monitorInterval);
        console.log('✅ デフォルト表示監視完了');
      }
    }, 3000);
    
    console.log('✅ デフォルト表示修正システム初期化完了');
  }
  
  // 複数のタイミングで実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // ページ完全読み込み後にも実行
  window.addEventListener('load', () => {
    setTimeout(initialize, 1000);
  });
  
})();