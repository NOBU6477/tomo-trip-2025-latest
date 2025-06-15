/**
 * 新しいフィルターシステム - 完全再構築版
 * シンプルで確実に動作するフィルター機能
 */

(function() {
  'use strict';

  // フィルターシステムの状態
  let filterState = {
    initialized: false,
    searchButton: null,
    resetButton: null,
    locationFilter: null,
    languageFilter: null,
    feeFilter: null,
    keywordInput: null,
    keywordCheckboxes: [],
    guideCards: []
  };

  // DOM要素の取得と初期化
  function initializeElements() {
    console.log('新しいフィルターシステム: DOM要素を初期化中...');
    
    // ボタン要素
    filterState.searchButton = document.getElementById('apply-filters');
    filterState.resetButton = document.getElementById('reset-filters');
    
    // フィルター要素
    filterState.locationFilter = document.getElementById('location-filter');
    filterState.languageFilter = document.getElementById('language-filter');
    filterState.feeFilter = document.getElementById('fee-filter');
    filterState.keywordInput = document.getElementById('keyword-filter-custom');
    
    // チェックボックス
    filterState.keywordCheckboxes = Array.from(document.querySelectorAll('.keyword-checkbox'));
    
    // ガイドカード
    filterState.guideCards = Array.from(document.querySelectorAll('.guide-item'));
    
    console.log('要素取得結果:', {
      searchButton: !!filterState.searchButton,
      resetButton: !!filterState.resetButton,
      locationFilter: !!filterState.locationFilter,
      languageFilter: !!filterState.languageFilter,
      feeFilter: !!filterState.feeFilter,
      keywordInput: !!filterState.keywordInput,
      keywordCheckboxes: filterState.keywordCheckboxes.length,
      guideCards: filterState.guideCards.length
    });
  }

  // イベントリスナーの設定
  function setupEventListeners() {
    console.log('イベントリスナーを設定中...');
    
    // 検索ボタン
    if (filterState.searchButton) {
      filterState.searchButton.addEventListener('click', handleSearch);
      console.log('検索ボタンにイベントリスナーを追加');
    } else {
      console.error('検索ボタンが見つかりません');
    }
    
    // リセットボタン
    if (filterState.resetButton) {
      filterState.resetButton.addEventListener('click', handleReset);
      console.log('リセットボタンにイベントリスナーを追加');
    } else {
      console.error('リセットボタンが見つかりません');
    }
    
    // リアルタイム検索（オプション）
    const realTimeElements = [
      filterState.locationFilter,
      filterState.languageFilter,
      filterState.feeFilter
    ].filter(el => el);
    
    realTimeElements.forEach(element => {
      element.addEventListener('change', handleSearch);
    });
    
    filterState.keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleSearch);
    });
  }

  // 検索処理
  function handleSearch(event) {
    if (event) {
      event.preventDefault();
    }
    
    console.log('検索処理を実行中...');
    
    try {
      // フィルター条件を収集
      const filters = collectFilterValues();
      console.log('収集したフィルター条件:', filters);
      
      // カードをフィルタリング
      let visibleCount = 0;
      
      filterState.guideCards.forEach(card => {
        const shouldShow = evaluateCard(card, filters);
        
        if (shouldShow) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      updateResultCount(visibleCount);
      console.log(`検索完了: ${visibleCount}件のガイドを表示`);
      
    } catch (error) {
      console.error('検索処理でエラーが発生:', error);
      alert('検索中にエラーが発生しました。ページを再読み込みしてください。');
    }
  }

  // フィルター値の収集
  function collectFilterValues() {
    const filters = {
      location: '',
      language: '',
      fee: '',
      keywords: [],
      customKeywords: ''
    };
    
    // セレクトボックスの値
    if (filterState.locationFilter) {
      filters.location = filterState.locationFilter.value;
    }
    
    if (filterState.languageFilter) {
      filters.language = filterState.languageFilter.value;
    }
    
    if (filterState.feeFilter) {
      filters.fee = filterState.feeFilter.value;
    }
    
    // チェックボックスの値
    filterState.keywordCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        filters.keywords.push(checkbox.value.toLowerCase());
      }
    });
    
    // カスタムキーワード
    if (filterState.keywordInput && filterState.keywordInput.value.trim()) {
      filters.customKeywords = filterState.keywordInput.value.toLowerCase();
    }
    
    return filters;
  }

  // カードの評価
  function evaluateCard(card, filters) {
    const cardText = card.textContent.toLowerCase();
    const cardData = extractCardData(card);
    
    // 地域フィルター
    if (filters.location && filters.location !== 'すべて' && filters.location !== '') {
      if (!matchesLocation(cardData, filters.location)) {
        return false;
      }
    }
    
    // 言語フィルター
    if (filters.language && filters.language !== 'すべて' && filters.language !== '') {
      if (!matchesLanguage(cardData, filters.language)) {
        return false;
      }
    }
    
    // 料金フィルター
    if (filters.fee && filters.fee !== 'すべて' && filters.fee !== '') {
      if (!matchesFee(cardData, filters.fee)) {
        return false;
      }
    }
    
    // キーワードフィルター
    if (filters.keywords.length > 0) {
      const keywordMatch = filters.keywords.some(keyword => 
        cardText.includes(keyword)
      );
      if (!keywordMatch) {
        return false;
      }
    }
    
    // カスタムキーワード
    if (filters.customKeywords) {
      const customKeywords = filters.customKeywords.split(',').map(k => k.trim());
      const customMatch = customKeywords.some(keyword => 
        cardText.includes(keyword)
      );
      if (!customMatch) {
        return false;
      }
    }
    
    return true;
  }

  // カードデータの抽出
  function extractCardData(card) {
    return {
      location: card.dataset.location || '',
      languages: card.dataset.languages || '',
      fee: card.dataset.fee || '0',
      keywords: card.dataset.keywords || '',
      text: card.textContent.toLowerCase()
    };
  }

  // 地域マッチング
  function matchesLocation(cardData, filterLocation) {
    const cardLocation = cardData.location.toLowerCase();
    const filterLoc = filterLocation.toLowerCase();
    
    // 都道府県名での完全一致
    if (cardLocation.includes(filterLoc)) {
      return true;
    }
    
    // テキスト内での部分一致
    if (cardData.text.includes(filterLoc)) {
      return true;
    }
    
    return false;
  }

  // 言語マッチング
  function matchesLanguage(cardData, filterLanguage) {
    const cardLanguages = cardData.languages.toLowerCase();
    const filterLang = filterLanguage.toLowerCase();
    
    if (cardLanguages.includes(filterLang)) {
      return true;
    }
    
    // 英語の特別処理
    if (filterLang === '英語' && cardData.text.includes('english')) {
      return true;
    }
    
    return false;
  }

  // 料金マッチング
  function matchesFee(cardData, filterFee) {
    const cardFee = parseInt(cardData.fee) || 0;
    const filterFeeNum = parseInt(filterFee) || 0;
    
    // 簡易的な料金フィルタリング
    if (filterFeeNum === 6000) {
      return cardFee >= 6000;
    } else if (filterFeeNum === 10000) {
      return cardFee <= 10000;
    } else if (filterFeeNum === 15000) {
      return cardFee <= 15000;
    } else if (filterFeeNum === 20000) {
      return cardFee <= 20000;
    }
    
    return true;
  }

  // リセット処理
  function handleReset(event) {
    if (event) {
      event.preventDefault();
    }
    
    console.log('フィルターをリセット中...');
    
    try {
      // セレクトボックスをリセット
      if (filterState.locationFilter) {
        filterState.locationFilter.selectedIndex = 0;
      }
      
      if (filterState.languageFilter) {
        filterState.languageFilter.selectedIndex = 0;
      }
      
      if (filterState.feeFilter) {
        filterState.feeFilter.selectedIndex = 0;
      }
      
      // テキスト入力をクリア
      if (filterState.keywordInput) {
        filterState.keywordInput.value = '';
      }
      
      // チェックボックスをクリア
      filterState.keywordCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // 全カードを表示
      filterState.guideCards.forEach(card => {
        card.style.display = '';
      });
      
      updateResultCount(filterState.guideCards.length);
      console.log('リセット完了');
      
    } catch (error) {
      console.error('リセット処理でエラーが発生:', error);
    }
  }

  // 結果件数の更新
  function updateResultCount(count) {
    const resultElements = document.querySelectorAll('.search-results, .result-count, .guide-count');
    resultElements.forEach(element => {
      element.textContent = `${count}件のガイドが見つかりました`;
    });
    
    // 結果が0件の場合のメッセージ表示
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
      if (count === 0) {
        noResultsMessage.classList.remove('d-none');
      } else {
        noResultsMessage.classList.add('d-none');
      }
    }
  }

  // 初期化関数
  function initialize() {
    if (filterState.initialized) {
      console.log('フィルターシステムは既に初期化されています');
      return;
    }
    
    console.log('新しいフィルターシステムを初期化中...');
    
    // DOM要素の初期化
    initializeElements();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // 初期状態の設定
    updateResultCount(filterState.guideCards.length);
    
    filterState.initialized = true;
    console.log('新しいフィルターシステムの初期化完了');
  }

  // DOM準備完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // 既にDOMが読み込まれている場合は少し遅らせて実行
    setTimeout(initialize, 100);
  }

  // ページ完全読み込み後にも実行（念のため）
  window.addEventListener('load', function() {
    setTimeout(initialize, 200);
  });

})();