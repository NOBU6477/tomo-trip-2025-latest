/**
 * 統一フィルター修正システム
 * フィルター機能の完全修復
 */

(function() {
  'use strict';
  
  console.log('🔍 統一フィルター修正システム開始');
  
  let locationFilter, languageFilter, feeFilter, keywordInputs, customKeywordInput;
  let allGuideCards = [];
  
  // フィルター要素を初期化
  function initializeFilterElements() {
    locationFilter = document.getElementById('location-filter');
    languageFilter = document.getElementById('language-filter');
    feeFilter = document.getElementById('fee-filter');
    keywordInputs = document.querySelectorAll('.keyword-checkbox, input[type="checkbox"][name="keywords"]');
    customKeywordInput = document.getElementById('custom-keywords');
    
    // ガイドカードを取得
    allGuideCards = Array.from(document.querySelectorAll('.guide-card, .guide-item'));
    
    console.log(`フィルター要素初期化完了: ${allGuideCards.length}件のガイドを検出`);
  }
  
  // フィルター条件を取得
  function getFilterCriteria() {
    const criteria = {
      location: locationFilter ? locationFilter.value : '',
      language: languageFilter ? languageFilter.value : '',
      fee: feeFilter ? parseInt(feeFilter.value) || 0 : 0,
      keywords: []
    };
    
    // チェックされたキーワードを取得
    if (keywordInputs) {
      keywordInputs.forEach(input => {
        if (input.checked) {
          criteria.keywords.push(input.value.toLowerCase());
        }
      });
    }
    
    // カスタムキーワードを取得
    if (customKeywordInput && customKeywordInput.value) {
      const customKeywords = customKeywordInput.value
        .split(',')
        .map(kw => kw.trim().toLowerCase())
        .filter(kw => kw);
      criteria.keywords.push(...customKeywords);
    }
    
    return criteria;
  }
  
  // ガイドカードがフィルター条件に一致するかチェック
  function matchesFilters(card, criteria) {
    const cardText = card.textContent.toLowerCase();
    const cardData = {
      location: card.getAttribute('data-location') || '',
      languages: card.getAttribute('data-languages') || '',
      fee: parseInt(card.getAttribute('data-fee') || '6000'),
      keywords: card.getAttribute('data-keywords') || ''
    };
    
    // 地域フィルター
    if (criteria.location && criteria.location !== 'すべて') {
      const locationMatch = cardData.location.toLowerCase().includes(criteria.location.toLowerCase()) ||
                           cardText.includes(criteria.location.toLowerCase());
      if (!locationMatch) return false;
    }
    
    // 言語フィルター
    if (criteria.language && criteria.language !== 'すべて') {
      const languageMatch = cardData.languages.toLowerCase().includes(criteria.language.toLowerCase()) ||
                            cardText.includes(criteria.language.toLowerCase());
      if (!languageMatch) return false;
    }
    
    // 料金フィルター
    if (criteria.fee > 0) {
      if (cardData.fee > criteria.fee) return false;
    }
    
    // キーワードフィルター
    if (criteria.keywords.length > 0) {
      const keywordMatch = criteria.keywords.some(keyword => 
        cardData.keywords.toLowerCase().includes(keyword) ||
        cardText.includes(keyword)
      );
      if (!keywordMatch) return false;
    }
    
    return true;
  }
  
  // フィルターを適用
  function applyFilters() {
    console.log('フィルター適用開始');
    
    const criteria = getFilterCriteria();
    console.log('フィルター条件:', criteria);
    
    let visibleCount = 0;
    
    allGuideCards.forEach((card, index) => {
      const matches = matchesFilters(card, criteria);
      const guideItem = card.closest('.guide-item') || card;
      
      if (matches) {
        // 表示
        guideItem.style.display = '';
        guideItem.classList.remove('hidden-guide', 'filtered-out', 'd-none');
        card.style.display = '';
        card.classList.remove('hidden-guide', 'filtered-out', 'd-none');
        visibleCount++;
      } else {
        // 非表示
        guideItem.style.display = 'none';
        guideItem.classList.add('filtered-out');
        card.style.display = 'none';
        card.classList.add('filtered-out');
      }
    });
    
    // カウンター更新
    updateGuideCounter(visibleCount);
    
    // 結果なしメッセージ
    toggleNoResultsMessage(visibleCount === 0);
    
    console.log(`フィルター適用完了: ${visibleCount}件のガイドが表示中`);
  }
  
  // ガイドカウンターを更新
  function updateGuideCounter(count) {
    const counters = document.querySelectorAll(
      '#search-results-counter, #guide-counter, .counter-badge, .guide-count'
    );
    
    counters.forEach(counter => {
      counter.textContent = `${count}人のガイドが見つかりました`;
    });
  }
  
  // 結果なしメッセージの表示制御
  function toggleNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (show) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'col-12 text-center my-5';
        noResultsMsg.innerHTML = `
          <div class="alert alert-info">
            <h5>検索結果がありません</h5>
            <p>条件に一致するガイドが見つかりませんでした。<br>別の検索条件をお試しください。</p>
          </div>
        `;
        
        const guidesContainer = document.querySelector('#guides .row, .guides-container');
        if (guidesContainer) {
          guidesContainer.appendChild(noResultsMsg);
        }
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }
  
  // フィルターイベントリスナーを設定
  function setupFilterListeners() {
    const filterElements = [locationFilter, languageFilter, feeFilter, customKeywordInput];
    
    filterElements.forEach(element => {
      if (element) {
        element.addEventListener('change', applyFilters);
        element.addEventListener('input', applyFilters);
      }
    });
    
    // キーワードチェックボックス
    keywordInputs.forEach(input => {
      input.addEventListener('change', applyFilters);
    });
    
    // フィルタートグルボタン
    const toggleButton = document.getElementById('toggle-filter-button');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        const filterContainer = document.getElementById('filter-container');
        if (filterContainer) {
          filterContainer.classList.toggle('d-none');
        }
      });
    }
    
    console.log('✅ フィルターイベントリスナー設定完了');
  }
  
  // グローバル関数として公開
  window.applyFilters = applyFilters;
  window.initializeFilterElements = initializeFilterElements;
  
  // 初期化
  function initialize() {
    setTimeout(() => {
      initializeFilterElements();
      setupFilterListeners();
      
      // 初期表示でフィルターを適用
      applyFilters();
      
      console.log('✅ 統一フィルターシステム起動完了');
    }, 1000);
  }
  
  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();