/**
 * 統一検索フィルターシステム
 * 複数のフィルタースクリプトの競合を解決し、安定した検索結果を提供
 */

(function() {
  'use strict';

  // 重複実行防止
  if (window.unifiedFilterInitialized) {
    return;
  }
  window.unifiedFilterInitialized = true;

  let filterConfig = {
    location: '',
    language: '',
    fee: 0,
    keywords: [],
    initialized: false
  };

  // DOM読み込み完了後に初期化
  document.addEventListener('DOMContentLoaded', function() {
    if (filterConfig.initialized) return;
    
    console.log('統一検索フィルターシステムを初期化中...');
    initializeUnifiedFilter();
    filterConfig.initialized = true;
  });

  /**
   * 統一フィルターシステムの初期化
   */
  function initializeUnifiedFilter() {
    // 既存のフィルター関数を無効化
    disableConflictingFilters();
    
    // 新しいフィルターシステムをセットアップ
    setupUnifiedFilterSystem();
    
    // イベントリスナーを設定
    setupEventListeners();
    
    console.log('統一検索フィルターシステムの初期化完了');
  }

  /**
   * 競合するフィルター関数を無効化
   */
  function disableConflictingFilters() {
    // 既存のapplyFilters関数をバックアップして無効化
    if (window.applyFilters && typeof window.applyFilters === 'function') {
      window.originalApplyFilters = window.applyFilters;
    }
    
    // 他のフィルター関数も無効化
    const conflictingFunctions = [
      'filterGuides',
      'enhancedFilterGuides', 
      'applyAdvancedFilters'
    ];
    
    conflictingFunctions.forEach(funcName => {
      if (window[funcName]) {
        window[`original_${funcName}`] = window[funcName];
        window[funcName] = function() {
          console.log(`${funcName}は統一フィルターシステムにより無効化されました`);
        };
      }
    });
  }

  /**
   * 統一フィルターシステムのセットアップ
   */
  function setupUnifiedFilterSystem() {
    // 新しいapplyFilters関数を定義
    window.applyFilters = function() {
      console.log('統一フィルターシステムでフィルターを適用中...');
      executeUnifiedFilter();
    };
    
    // リセット関数も統一
    window.resetFilters = function() {
      console.log('統一フィルターシステムでフィルターをリセット中...');
      resetUnifiedFilters();
    };
  }

  /**
   * 統一フィルターの実行
   */
  function executeUnifiedFilter() {
    // フィルター値を取得
    const filterValues = getFilterValues();
    
    // すべてのガイドカードを取得
    const allCards = getAllGuideCards();
    
    console.log(`フィルター対象: ${allCards.length}枚のカード`);
    console.log('フィルター条件:', filterValues);
    
    let visibleCount = 0;
    
    // 各カードをフィルタリング
    allCards.forEach((card, index) => {
      const cardData = extractCardInformation(card);
      const shouldShow = evaluateCardMatch(cardData, filterValues);
      
      console.log(`カード${index + 1}: ${shouldShow ? '表示' : '非表示'} - ${cardData.name} (${cardData.location})`);
      
      setCardVisibility(card, shouldShow);
      
      if (shouldShow) {
        visibleCount++;
      }
    });
    
    // 結果を更新
    updateSearchResults(visibleCount);
    
    console.log(`フィルター完了: ${visibleCount}件のガイドを表示`);
  }

  /**
   * フィルター値を取得
   */
  function getFilterValues() {
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    const customKeywordInput = document.getElementById('keyword-filter-custom');
    
    // キーワードを収集
    const keywords = [];
    
    // チェックボックスのキーワード
    keywordCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        keywords.push(checkbox.value.toLowerCase().trim());
      }
    });
    
    // カスタムキーワード
    if (customKeywordInput && customKeywordInput.value) {
      const customKeywords = customKeywordInput.value
        .split(',')
        .map(kw => kw.trim().toLowerCase())
        .filter(kw => kw !== '');
      keywords.push(...customKeywords);
    }
    
    return {
      location: locationFilter ? locationFilter.value : '',
      language: languageFilter ? languageFilter.value : '',
      fee: feeFilter ? parseInt(feeFilter.value) || 0 : 0,
      keywords: keywords
    };
  }

  /**
   * すべてのガイドカードを取得
   */
  function getAllGuideCards() {
    // 複数のセレクターでカードを検索
    const selectors = [
      '.guide-card',
      '.card',
      '[data-guide-id]',
      '.col .card',
      '.guide-item .card'
    ];
    
    const cards = new Set();
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // カード内にガイド情報があるかチェック
        if (isValidGuideCard(el)) {
          cards.add(el);
        }
      });
    });
    
    return Array.from(cards);
  }

  /**
   * 有効なガイドカードかどうか判定
   */
  function isValidGuideCard(element) {
    const text = element.textContent.toLowerCase();
    
    // ガイド関連のテキストが含まれているかチェック
    const guideIndicators = [
      'guide', 'ガイド', '詳細を見る', '¥', 'セッション',
      '北海道', '沖縄', '東京', '大阪', '京都', 'japan'
    ];
    
    return guideIndicators.some(indicator => text.includes(indicator));
  }

  /**
   * カード情報を抽出
   */
  function extractCardInformation(card) {
    const text = card.textContent.toLowerCase();
    
    // カード名を抽出
    const nameElement = card.querySelector('.card-title, h5, h4, h3, .guide-name');
    const name = nameElement ? nameElement.textContent.trim() : 'Unknown Guide';
    
    // 地域情報を抽出
    let location = '';
    
    // 沖縄県の詳細チェック
    const okinawaPatterns = [
      /沖縄県?\s*([^\s,。]+)/,
      /okinawa\s*([^\s,。]+)/i,
      /(那覇|石垣|宮古島|竹富島|西表島|久米島|座間味|渡嘉敷|与那国|波照間|黒島|小浜島|新城島|鳩間島|由布島|嘉弥真島|伊是名|伊平屋|粟国|多良間)/
    ];
    
    for (const pattern of okinawaPatterns) {
      const match = text.match(pattern);
      if (match) {
        location = match[0];
        break;
      }
    }
    
    // 沖縄が見つからない場合、他の地域をチェック
    if (!location) {
      const generalPatterns = [
        /北海道\s*([^\s,。]+)/,
        /東京都?\s*([^\s,。]+)/,
        /大阪府?\s*([^\s,。]+)/,
        /京都府?\s*([^\s,。]+)/,
        /神奈川県?\s*([^\s,。]+)/,
        /千葉県?\s*([^\s,。]+)/,
        /埼玉県?\s*([^\s,。]+)/,
        /愛知県?\s*([^\s,。]+)/,
        /兵庫県?\s*([^\s,。]+)/,
        /福岡県?\s*([^\s,。]+)/
      ];
      
      for (const pattern of generalPatterns) {
        const match = text.match(pattern);
        if (match) {
          location = match[0];
          break;
        }
      }
    }
    
    // 言語情報を抽出
    const hasEnglish = text.includes('english') || text.includes('英語');
    const languages = hasEnglish ? '日本語,英語' : '日本語';
    
    // 料金情報を抽出
    const feeMatch = text.match(/¥?([0-9,]+)\s*(?:円|セッション)/);
    const fee = feeMatch ? parseInt(feeMatch[1].replace(/,/g, '')) : 0;
    
    return {
      name: name,
      location: location,
      languages: languages,
      fee: fee,
      fullText: text
    };
  }

  /**
   * カードがフィルター条件に一致するかを評価
   */
  function evaluateCardMatch(cardData, filterValues) {
    // 地域フィルター
    let locationMatch = true;
    if (filterValues.location && filterValues.location !== 'すべて') {
      const filterLocation = filterValues.location.toLowerCase();
      const cardLocation = cardData.location.toLowerCase();
      
      if (filterLocation.includes('沖縄')) {
        locationMatch = cardLocation.includes('沖縄') || 
                      cardLocation.includes('okinawa') ||
                      cardLocation.includes('那覇') ||
                      cardLocation.includes('石垣') ||
                      cardLocation.includes('宮古');
      } else {
        locationMatch = cardLocation.includes(filterLocation) || 
                      cardData.fullText.includes(filterLocation);
      }
    }
    
    // 言語フィルター
    let languageMatch = true;
    if (filterValues.language && filterValues.language !== 'すべて') {
      languageMatch = cardData.languages.toLowerCase().includes(filterValues.language.toLowerCase());
    }
    
    // 料金フィルター
    let feeMatch = true;
    if (filterValues.fee > 0) {
      feeMatch = cardData.fee <= filterValues.fee;
    }
    
    // キーワードフィルター
    let keywordMatch = true;
    if (filterValues.keywords.length > 0) {
      keywordMatch = filterValues.keywords.some(keyword => 
        cardData.fullText.includes(keyword.toLowerCase())
      );
    }
    
    return locationMatch && languageMatch && feeMatch && keywordMatch;
  }

  /**
   * カードの表示/非表示を設定
   */
  function setCardVisibility(card, visible) {
    const container = card.closest('.col, .guide-item, .col-md-4, .col-lg-4');
    
    if (visible) {
      if (container) {
        container.style.display = '';
        container.classList.remove('d-none');
      }
      card.style.display = '';
      card.classList.remove('d-none');
    } else {
      if (container) {
        container.style.display = 'none';
        container.classList.add('d-none');
      }
      card.style.display = 'none';
      card.classList.add('d-none');
    }
  }

  /**
   * 検索結果を更新
   */
  function updateSearchResults(count) {
    // 結果カウンターを更新
    const counters = document.querySelectorAll('#search-results-counter, .search-results-counter');
    counters.forEach(counter => {
      counter.textContent = `${count}件のガイドが見つかりました`;
    });
    
    // 結果がない場合のメッセージを管理
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (count === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'alert alert-info text-center mt-3';
        noResultsMsg.innerHTML = '条件に一致するガイドが見つかりませんでした。';
        
        const container = document.querySelector('.guides-container, .row');
        if (container) {
          container.appendChild(noResultsMsg);
        }
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  /**
   * フィルターをリセット
   */
  function resetUnifiedFilters() {
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    const customKeywordInput = document.getElementById('keyword-filter-custom');
    
    if (locationFilter) locationFilter.value = 'すべて';
    if (languageFilter) languageFilter.value = 'すべて';
    if (feeFilter) feeFilter.value = '';
    
    keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    if (customKeywordInput) customKeywordInput.value = '';
    
    // 全カードを表示
    executeUnifiedFilter();
  }

  /**
   * イベントリスナーを設定
   */
  function setupEventListeners() {
    // フィルター適用ボタン
    const applyButton = document.getElementById('apply-filters');
    if (applyButton) {
      const newApplyButton = applyButton.cloneNode(true);
      applyButton.parentNode.replaceChild(newApplyButton, applyButton);
      
      newApplyButton.addEventListener('click', function(e) {
        e.preventDefault();
        executeUnifiedFilter();
      });
    }
    
    // リセットボタン
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
      const newResetButton = resetButton.cloneNode(true);
      resetButton.parentNode.replaceChild(newResetButton, resetButton);
      
      newResetButton.addEventListener('click', function(e) {
        e.preventDefault();
        resetUnifiedFilters();
      });
    }
    
    // 地域フィルターの即座適用
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) {
      locationFilter.addEventListener('change', function() {
        setTimeout(executeUnifiedFilter, 100);
      });
    }
  }

  console.log('統一検索フィルターシステムがロードされました');

})();