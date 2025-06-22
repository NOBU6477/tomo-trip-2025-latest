/**
 * 包括的なガイドフィルターシステム
 * 複数の条件を同時に適用し、条件に一致するガイドのみを表示
 */

(function() {
  'use strict';
  
  let isInitialized = false;
  
  function initializeComprehensiveFilter() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('包括的フィルターシステムを初期化中...');
    
    // DOM要素の取得
    const elements = {
      locationFilter: document.getElementById('location-filter'),
      languageFilter: document.getElementById('language-filter'),
      feeFilter: document.getElementById('fee-filter'),
      keywordCustomInput: document.getElementById('keyword-filter-custom'),
      keywordCheckboxes: document.querySelectorAll('.keyword-checkbox'),
      applyFiltersBtn: document.getElementById('apply-filters'),
      resetFiltersBtn: document.getElementById('reset-filters'),
      searchResultsCounter: document.getElementById('search-results-counter'),
      noResultsMessage: document.getElementById('no-results-message'),
      loadMoreBtn: document.getElementById('load-more-guides')
    };
    
    // 要素の存在確認
    if (!elements.applyFiltersBtn) {
      console.error('フィルターボタンが見つかりません');
      return;
    }
    
    // イベントリスナーの設定
    setupEventListeners(elements);
    
    // 初期状態の設定
    resetToInitialState();
    
    console.log('包括的フィルターシステムの初期化完了');
  }
  
  function setupEventListeners(elements) {
    // フィルター適用ボタン
    elements.applyFiltersBtn.addEventListener('click', function(e) {
      e.preventDefault();
      applyFilters(elements);
    });
    
    // リセットボタン
    if (elements.resetFiltersBtn) {
      elements.resetFiltersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        resetFilters(elements);
      });
    }
    
    // 「もっと見る」ボタン
    if (elements.loadMoreBtn) {
      elements.loadMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loadMoreGuides();
      });
    }
    
    // リアルタイム検索（Enterキー）
    if (elements.keywordCustomInput) {
      elements.keywordCustomInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyFilters(elements);
        }
      });
    }
  }
  
  function applyFilters(elements) {
    console.log('フィルター適用開始');
    
    // フィルター条件の取得
    const filters = getFilterCriteria(elements);
    console.log('フィルター条件:', filters);
    
    // 全ガイドカードを取得
    const allGuideItems = document.querySelectorAll('.guide-item');
    
    let matchingGuides = [];
    let totalGuides = allGuideItems.length;
    
    // 各ガイドカードを評価
    allGuideItems.forEach(guideItem => {
      const matches = evaluateGuideCard(guideItem, filters);
      
      if (matches) {
        matchingGuides.push(guideItem);
        // マッチしたガイドを表示
        guideItem.classList.remove('hidden-guide', 'filtered-out');
        guideItem.style.display = '';
      } else {
        // マッチしないガイドを非表示
        guideItem.classList.add('filtered-out');
        guideItem.style.display = 'none';
      }
    });
    
    // 結果の表示
    displayFilterResults(matchingGuides.length, totalGuides, elements);
    
    // 「もっと見る」ボタンの状態更新
    updateLoadMoreButton(matchingGuides);
    
    console.log(`フィルター完了: ${matchingGuides.length}/${totalGuides}件がマッチ`);
  }
  
  function getFilterCriteria(elements) {
    const selectedKeywords = [];
    
    // チェックボックスのキーワードを取得
    if (elements.keywordCheckboxes) {
      elements.keywordCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selectedKeywords.push(checkbox.value.toLowerCase());
        }
      });
    }
    
    // カスタムキーワードを取得
    let customKeywords = [];
    if (elements.keywordCustomInput && elements.keywordCustomInput.value.trim()) {
      customKeywords = elements.keywordCustomInput.value
        .split(',')
        .map(keyword => keyword.trim().toLowerCase())
        .filter(keyword => keyword.length > 0);
    }
    
    return {
      location: elements.locationFilter ? elements.locationFilter.value.trim() : '',
      language: elements.languageFilter ? elements.languageFilter.value.trim() : '',
      maxFee: elements.feeFilter && elements.feeFilter.value ? parseInt(elements.feeFilter.value) : 0,
      keywords: [...selectedKeywords, ...customKeywords]
    };
  }
  
  function evaluateGuideCard(guideItem, filters) {
    // データ属性から情報を取得
    const guideCard = guideItem.querySelector('.guide-card');
    if (!guideCard) return false;
    
    const guideData = extractGuideData(guideItem, guideCard);
    
    // 各フィルター条件をチェック
    const locationMatch = checkLocationMatch(guideData.location, filters.location);
    const languageMatch = checkLanguageMatch(guideData.languages, filters.language);
    const feeMatch = checkFeeMatch(guideData.fee, filters.maxFee);
    const keywordMatch = checkKeywordMatch(guideData, filters.keywords);
    
    // すべての条件にマッチする場合のみtrue
    const matches = locationMatch && languageMatch && feeMatch && keywordMatch;
    
    if (filters.location || filters.language || filters.maxFee > 0 || filters.keywords.length > 0) {
      console.log(`ガイド評価: ${guideData.name}`, {
        location: locationMatch,
        language: languageMatch,
        fee: feeMatch,
        keyword: keywordMatch,
        overall: matches
      });
    }
    
    return matches;
  }
  
  function extractGuideData(guideItem, guideCard) {
    // カード内のテキスト情報を取得
    const nameElement = guideCard.querySelector('.card-title');
    const locationElement = guideCard.querySelector('.guide-location, .card-text.text-muted');
    const descriptionElement = guideCard.querySelector('.card-text:not(.text-muted)');
    const feeElement = guideCard.querySelector('.badge.bg-primary');
    const languageElements = guideCard.querySelectorAll('.guide-lang, .badge.bg-light');
    
    // データ属性からも取得（存在する場合）
    const dataLocation = guideCard.getAttribute('data-location') || '';
    const dataLanguages = guideCard.getAttribute('data-languages') || '';
    const dataFee = guideCard.getAttribute('data-fee') || '';
    const dataKeywords = guideCard.getAttribute('data-keywords') || '';
    
    return {
      name: nameElement ? nameElement.textContent.trim() : '',
      location: dataLocation || (locationElement ? locationElement.textContent.trim() : ''),
      description: descriptionElement ? descriptionElement.textContent.trim() : '',
      fee: parseInt(dataFee || (feeElement ? feeElement.textContent.replace(/[^0-9]/g, '') : '0')) || 0,
      languages: dataLanguages || Array.from(languageElements).map(el => el.textContent.trim()).join(','),
      keywords: dataKeywords,
      fullText: guideItem.textContent.toLowerCase()
    };
  }
  
  function checkLocationMatch(guideLocation, filterLocation) {
    if (!filterLocation) return true;
    
    const filterLower = filterLocation.toLowerCase();
    const guideLower = guideLocation.toLowerCase();
    
    // 完全一致または部分一致
    return guideLower.includes(filterLower) || filterLower.includes(guideLower);
  }
  
  function checkLanguageMatch(guideLanguages, filterLanguage) {
    if (!filterLanguage) return true;
    
    const filterLower = filterLanguage.toLowerCase();
    const guideLower = guideLanguages.toLowerCase();
    
    return guideLower.includes(filterLower);
  }
  
  function checkFeeMatch(guideFee, maxFee) {
    if (!maxFee || maxFee === 0) return true;
    
    return guideFee <= maxFee;
  }
  
  function checkKeywordMatch(guideData, keywords) {
    if (!keywords || keywords.length === 0) return true;
    
    const searchText = [
      guideData.description,
      guideData.keywords,
      guideData.fullText
    ].join(' ').toLowerCase();
    
    // いずれかのキーワードにマッチすればOK
    return keywords.some(keyword => searchText.includes(keyword));
  }
  
  function displayFilterResults(matchingCount, totalCount, elements) {
    // 結果カウンターの更新
    if (elements.searchResultsCounter) {
      if (matchingCount === totalCount) {
        elements.searchResultsCounter.textContent = `全${totalCount}件のガイドを表示中`;
      } else {
        elements.searchResultsCounter.textContent = `${matchingCount}件のガイドが見つかりました（全${totalCount}件中）`;
      }
    }
    
    // 結果なしメッセージの表示/非表示
    if (elements.noResultsMessage) {
      if (matchingCount === 0) {
        elements.noResultsMessage.classList.remove('d-none');
      } else {
        elements.noResultsMessage.classList.add('d-none');
      }
    }
  }
  
  function updateLoadMoreButton(matchingGuides) {
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (!loadMoreBtn) return;
    
    const visibleGuides = matchingGuides.filter(guide => 
      !guide.classList.contains('hidden-guide')
    );
    
    // フィルター後は「もっと見る」ボタンを非表示
    // （フィルター結果はすべて表示する仕様）
    loadMoreBtn.style.display = 'none';
  }
  
  function loadMoreGuides() {
    const hiddenGuides = document.querySelectorAll('.guide-item.hidden-guide:not(.filtered-out)');
    const showCount = Math.min(3, hiddenGuides.length);
    
    for (let i = 0; i < showCount; i++) {
      hiddenGuides[i].classList.remove('hidden-guide');
    }
    
    if (hiddenGuides.length <= showCount) {
      const loadMoreBtn = document.getElementById('load-more-guides');
      if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
      }
    }
  }
  
  function resetFilters(elements) {
    console.log('フィルターをリセット中...');
    
    // フォーム要素のリセット
    if (elements.locationFilter) elements.locationFilter.value = '';
    if (elements.languageFilter) elements.languageFilter.value = '';
    if (elements.feeFilter) elements.feeFilter.value = '';
    if (elements.keywordCustomInput) elements.keywordCustomInput.value = '';
    
    // チェックボックスのリセット
    if (elements.keywordCheckboxes) {
      elements.keywordCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }
    
    // 初期状態に戻す
    resetToInitialState();
    
    console.log('フィルターリセット完了');
  }
  
  function resetToInitialState() {
    const allGuideItems = document.querySelectorAll('.guide-item');
    const initialVisibleCount = 3;
    
    allGuideItems.forEach((item, index) => {
      // フィルタークラスを削除
      item.classList.remove('filtered-out');
      item.style.display = '';
      
      // 初期表示数以外は非表示
      if (index >= initialVisibleCount) {
        item.classList.add('hidden-guide');
      } else {
        item.classList.remove('hidden-guide');
      }
    });
    
    // 結果表示の更新
    const elements = {
      searchResultsCounter: document.getElementById('search-results-counter'),
      noResultsMessage: document.getElementById('no-results-message')
    };
    
    if (elements.searchResultsCounter) {
      elements.searchResultsCounter.textContent = `全${allGuideItems.length}件のガイドを表示中`;
    }
    
    if (elements.noResultsMessage) {
      elements.noResultsMessage.classList.add('d-none');
    }
    
    // 「もっと見る」ボタンの状態更新
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (loadMoreBtn) {
      if (allGuideItems.length > initialVisibleCount) {
        loadMoreBtn.style.display = 'inline-block';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  }
  
  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComprehensiveFilter);
  } else {
    setTimeout(initializeComprehensiveFilter, 100);
  }
  
})();