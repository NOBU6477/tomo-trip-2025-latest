/**
 * 統一フィルターシステム
 * 複数条件の同時絞り込みとガイド数カウントの正確な表示
 */

(function() {
  'use strict';

  let isInitialized = false;
  
  // フィルター要素のキャッシュ
  let filterElements = {
    location: null,
    language: null,
    fee: null,
    keywordCheckboxes: [],
    customKeyword: null,
    applyBtn: null,
    resetBtn: null,
    counter: null
  };

  // 初期化
  function initialize() {
    if (isInitialized) return;
    
    console.log('統一フィルターシステム初期化開始');
    
    // DOM要素を取得
    cacheFilterElements();
    
    // イベントリスナーを設定
    setupEventListeners();
    
    // 初期カウント表示
    updateGuideCount();
    
    isInitialized = true;
    console.log('統一フィルターシステム初期化完了');
  }

  // フィルター要素をキャッシュ
  function cacheFilterElements() {
    filterElements.location = document.getElementById('location-filter');
    filterElements.language = document.getElementById('language-filter');
    filterElements.fee = document.getElementById('fee-filter');
    filterElements.keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    filterElements.customKeyword = document.getElementById('keyword-filter-custom');
    filterElements.applyBtn = document.getElementById('apply-filters');
    filterElements.resetBtn = document.getElementById('reset-filters');
    filterElements.counter = document.getElementById('search-results-counter');
    
    console.log('フィルター要素キャッシュ完了:', {
      location: !!filterElements.location,
      language: !!filterElements.language,
      fee: !!filterElements.fee,
      keywords: filterElements.keywordCheckboxes.length,
      customKeyword: !!filterElements.customKeyword,
      applyBtn: !!filterElements.applyBtn,
      resetBtn: !!filterElements.resetBtn,
      counter: !!filterElements.counter
    });
  }

  // イベントリスナー設定
  function setupEventListeners() {
    // 検索ボタン
    if (filterElements.applyBtn) {
      filterElements.applyBtn.addEventListener('click', applyFilters);
    }
    
    // リセットボタン
    if (filterElements.resetBtn) {
      filterElements.resetBtn.addEventListener('click', resetFilters);
    }
    
    // リアルタイム検索（オプション - コメントアウト状態）
    // setupRealtimeFiltering();
  }

  // リアルタイムフィルタリング設定（必要に応じて有効化）
  function setupRealtimeFiltering() {
    [filterElements.location, filterElements.language, filterElements.fee].forEach(element => {
      if (element) {
        element.addEventListener('change', applyFilters);
      }
    });
    
    filterElements.keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', applyFilters);
    });
    
    if (filterElements.customKeyword) {
      let timeout;
      filterElements.customKeyword.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(applyFilters, 500);
      });
    }
  }

  // フィルター条件を取得
  function getFilterCriteria() {
    const criteria = {
      location: filterElements.location ? filterElements.location.value.trim() : '',
      language: filterElements.language ? filterElements.language.value.trim() : '',
      fee: filterElements.fee ? parseInt(filterElements.fee.value) || 0 : 0,
      keywords: []
    };

    // チェックボックスキーワード
    filterElements.keywordCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        criteria.keywords.push(checkbox.value.toLowerCase().trim());
      }
    });

    // カスタムキーワード
    if (filterElements.customKeyword && filterElements.customKeyword.value.trim()) {
      const customKeywords = filterElements.customKeyword.value
        .split(',')
        .map(kw => kw.trim().toLowerCase())
        .filter(kw => kw !== '');
      criteria.keywords.push(...customKeywords);
    }

    return criteria;
  }

  // ガイドカードが条件に一致するかチェック
  function matchesFilters(guideCard, criteria) {
    // データ属性から情報を取得
    const cardLocation = (guideCard.getAttribute('data-location') || '').toLowerCase();
    const cardLanguages = (guideCard.getAttribute('data-languages') || '').toLowerCase();
    const cardFee = parseInt(guideCard.getAttribute('data-fee') || '0');
    const cardKeywords = (guideCard.getAttribute('data-keywords') || '').toLowerCase();

    // 地域フィルター
    let matchesLocation = true;
    if (criteria.location && criteria.location !== 'すべて') {
      const searchLocation = criteria.location.toLowerCase();
      
      // 北海道の特別処理
      if (searchLocation === '北海道') {
        matchesLocation = cardLocation.includes('北海道') || 
                         cardLocation.includes('札幌') || 
                         cardLocation.includes('函館') || 
                         cardLocation.includes('旭川');
      } else {
        matchesLocation = cardLocation.includes(searchLocation);
      }
    }

    // 言語フィルター
    let matchesLanguage = true;
    if (criteria.language && criteria.language !== 'すべて') {
      const searchLanguage = criteria.language.toLowerCase();
      matchesLanguage = cardLanguages.split(',').some(lang => 
        lang.trim() === searchLanguage
      );
    }

    // 料金フィルター
    let matchesFee = true;
    if (criteria.fee > 0) {
      matchesFee = cardFee <= criteria.fee;
    }

    // キーワードフィルター
    let matchesKeywords = true;
    if (criteria.keywords.length > 0) {
      const cardKeywordList = cardKeywords.split(',').map(kw => kw.trim());
      matchesKeywords = criteria.keywords.some(keyword => 
        cardKeywordList.some(cardKw => cardKw.includes(keyword))
      );
    }

    return matchesLocation && matchesLanguage && matchesFee && matchesKeywords;
  }

  // フィルター適用
  function applyFilters() {
    console.log('フィルター適用開始');
    
    const criteria = getFilterCriteria();
    console.log('フィルター条件:', criteria);

    const guideCards = document.querySelectorAll('.guide-card');
    let visibleCount = 0;

    guideCards.forEach(card => {
      const guideItem = card.closest('.guide-item');
      const matches = matchesFilters(card, criteria);

      if (matches) {
        // 表示
        if (guideItem) {
          guideItem.style.display = '';
          guideItem.classList.remove('hidden-guide', 'filtered-out');
          guideItem.style.opacity = '1';
        }
        card.style.display = '';
        card.classList.remove('hidden-guide', 'filtered-out');
        card.style.opacity = '1';
        visibleCount++;
      } else {
        // 非表示
        if (guideItem) {
          guideItem.style.display = 'none';
          guideItem.classList.add('filtered-out');
        }
        card.style.display = 'none';
        card.classList.add('filtered-out');
      }
    });

    // カウント更新
    updateGuideCount(visibleCount);
    
    // 結果なしメッセージの表示制御
    toggleNoResultsMessage(visibleCount === 0);

    console.log(`フィルター適用完了: ${visibleCount}件のガイドが表示中`);
  }

  // フィルターリセット
  function resetFilters() {
    console.log('フィルターリセット開始');

    // フィルター要素をリセット
    if (filterElements.location) filterElements.location.value = '';
    if (filterElements.language) filterElements.language.value = '';
    if (filterElements.fee) filterElements.fee.value = '';
    if (filterElements.customKeyword) filterElements.customKeyword.value = '';

    filterElements.keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // 全ガイドを表示
    const guideCards = document.querySelectorAll('.guide-card');
    guideCards.forEach(card => {
      const guideItem = card.closest('.guide-item');
      
      if (guideItem) {
        guideItem.style.display = '';
        guideItem.classList.remove('hidden-guide', 'filtered-out');
        guideItem.style.opacity = '1';
      }
      card.style.display = '';
      card.classList.remove('hidden-guide', 'filtered-out');
      card.style.opacity = '1';
    });

    // カウント更新
    updateGuideCount();
    
    // 結果なしメッセージを非表示
    toggleNoResultsMessage(false);

    console.log('フィルターリセット完了');
  }

  // ガイド数カウント更新
  function updateGuideCount(visibleCount = null) {
    if (!filterElements.counter) return;

    if (visibleCount === null) {
      // 全体のガイド数を取得
      const allGuides = document.querySelectorAll('.guide-card');
      visibleCount = allGuides.length;
    }

    filterElements.counter.textContent = `${visibleCount}件のガイドが見つかりました`;
  }

  // 結果なしメッセージの表示制御
  function toggleNoResultsMessage(show) {
    const noResultsElement = document.getElementById('no-results-message');
    if (noResultsElement) {
      if (show) {
        noResultsElement.classList.remove('d-none');
      } else {
        noResultsElement.classList.add('d-none');
      }
    }
  }

  // グローバル関数として公開
  window.unifiedFilterSystem = {
    initialize: initialize,
    applyFilters: applyFilters,
    resetFilters: resetFilters
  };

  // DOMContentLoaded時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // 既存のapplyFilters関数をオーバーライド
  window.applyFilters = applyFilters;

})();