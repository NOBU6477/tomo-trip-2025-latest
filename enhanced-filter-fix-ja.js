/**
 * Enhanced Filter Fix for Japanese Site
 * 日本語版サイト専用の強化フィルターシステム
 */

(function() {
  'use strict';
  
  console.log('🔧 日本語版強化フィルター開始');
  
  // Global variables
  let isFilterSystemInitialized = false;
  let guidesLoaded = false;
  
  // Wait for guides to be loaded
  function waitForGuides() {
    return new Promise((resolve) => {
      const checkGuides = () => {
        const guideCards = document.querySelectorAll('.guide-item, [data-guide-id], .card');
        console.log(`ガイドカード検出: ${guideCards.length}件`);
        
        if (guideCards.length >= 5 || guidesLoaded) {
          guidesLoaded = true;
          resolve(guideCards.length);
        } else {
          setTimeout(checkGuides, 100);
        }
      };
      checkGuides();
    });
  }
  
  // Enhanced filter function for Japanese site
  function enhancedFilterGuidesJA() {
    console.log('🔍 日本語版フィルター処理開始');
    
    // Get filter values
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter'); 
    const feeFilter = document.getElementById('fee-filter');
    const keywordCustomInput = document.getElementById('keyword-filter-custom');
    
    const locationValue = locationFilter?.value?.toLowerCase() || '';
    const languageValue = languageFilter?.value?.toLowerCase() || '';
    const feeValue = feeFilter?.value || '';
    
    // Get keyword values from checkboxes
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox:checked, input[type="checkbox"]:checked');
    const selectedKeywords = Array.from(keywordCheckboxes).map(cb => {
      return cb.value?.toLowerCase() || cb.nextElementSibling?.textContent?.toLowerCase() || '';
    }).filter(k => k);
    
    // Get custom keywords
    const customKeywords = keywordCustomInput?.value?.toLowerCase() || '';
    const customKeywordArray = customKeywords ? 
      customKeywords.split(',').map(k => k.trim()).filter(k => k) : [];
    
    const allKeywords = [...selectedKeywords, ...customKeywordArray];
    
    console.log('フィルター条件:', {
      location: locationValue,
      language: languageValue,
      fee: feeValue,
      keywords: allKeywords
    });
    
    // Get all possible guide cards with multiple selectors
    const allPossibleCards = [
      ...document.querySelectorAll('.guide-item'),
      ...document.querySelectorAll('[data-guide-id]'),
      ...document.querySelectorAll('.col-lg-4 .card'),
      ...document.querySelectorAll('.col-md-6 .card'),
      ...document.querySelectorAll('.guide-card'),
      ...document.querySelectorAll('.card')
    ];
    
    // Remove duplicates
    const uniqueCards = Array.from(new Set(allPossibleCards));
    console.log(`発見されたガイドカード: ${uniqueCards.length}件`);
    
    let visibleCount = 0;
    
    uniqueCards.forEach((card, index) => {
      const shouldShow = checkCardMatchesFiltersJA(card, {
        location: locationValue,
        language: languageValue,
        fee: feeValue,
        keywords: allKeywords
      });
      
      console.log(`カード ${index + 1}: ${shouldShow ? '表示' : '非表示'}`);
      
      if (shouldShow) {
        showCardJA(card);
        visibleCount++;
      } else {
        hideCardJA(card);
      }
    });
    
    // Update results display in Japanese
    updateResultsDisplayJA(visibleCount);
    
    console.log(`✅ フィルター完了: ${visibleCount}/${uniqueCards.length}件のガイドを表示`);
  }
  
  // Check if card matches filters (Japanese version)
  function checkCardMatchesFiltersJA(card, filters) {
    // Skip if no active filters
    if (!filters.location && !filters.language && !filters.fee && filters.keywords.length === 0) {
      return true;
    }
    
    // Get card text content
    const cardText = card.textContent?.toLowerCase() || '';
    const cardName = card.querySelector('.card-title, h5, h6')?.textContent?.toLowerCase() || '';
    const cardLocation = card.querySelector('.location, .text-muted')?.textContent?.toLowerCase() || '';
    const cardPrice = card.querySelector('.price, .badge')?.textContent?.toLowerCase() || '';
    const cardDescription = card.querySelector('.card-text, p')?.textContent?.toLowerCase() || '';
    
    console.log('カード内容:', {
      name: cardName,
      location: cardLocation,
      price: cardPrice,
      description: cardDescription.substring(0, 50)
    });
    
    // Location filter (Japanese prefectures)
    if (filters.location && filters.location !== 'all') {
      const prefectureMapping = {
        '北海道': ['hokkaido', '札幌', 'sapporo'],
        '青森': ['aomori'],
        '岩手': ['iwate'],
        '宮城': ['miyagi', '仙台', 'sendai'],
        '秋田': ['akita'],
        '山形': ['yamagata'],
        '福島': ['fukushima'],
        '茨城': ['ibaraki'],
        '栃木': ['tochigi'],
        '群馬': ['gunma'],
        '埼玉': ['saitama'],
        '千葉': ['chiba'],
        '東京': ['tokyo', 'tokyo'],
        '神奈川': ['kanagawa', '横浜', 'yokohama'],
        '新潟': ['niigata'],
        '富山': ['toyama'],
        '石川': ['ishikawa', '金沢', 'kanazawa'],
        '福井': ['fukui'],
        '山梨': ['yamanashi'],
        '長野': ['nagano'],
        '岐阜': ['gifu'],
        '静岡': ['shizuoka'],
        '愛知': ['aichi', '名古屋', 'nagoya'],
        '三重': ['mie'],
        '滋賀': ['shiga'],
        '京都': ['kyoto', 'kyoto'],
        '大阪': ['osaka', 'osaka'],
        '兵庫': ['hyogo', '神戸', 'kobe'],
        '奈良': ['nara'],
        '和歌山': ['wakayama'],
        '鳥取': ['tottori'],
        '島根': ['shimane'],
        '岡山': ['okayama'],
        '広島': ['hiroshima'],
        '山口': ['yamaguchi'],
        '徳島': ['tokushima'],
        '香川': ['kagawa'],
        '愛媛': ['ehime'],
        '高知': ['kochi'],
        '福岡': ['fukuoka'],
        '佐賀': ['saga'],
        '長崎': ['nagasaki'],
        '熊本': ['kumamoto'],
        '大分': ['oita'],
        '宮崎': ['miyazaki'],
        '鹿児島': ['kagoshima'],
        '沖縄': ['okinawa']
      };
      
      const searchTerms = prefectureMapping[filters.location] || [filters.location];
      const hasLocationMatch = searchTerms.some(term => 
        cardText.includes(term) || 
        cardLocation.includes(term)
      );
      
      if (!hasLocationMatch) {
        console.log('地域フィルター不適合');
        return false;
      }
    }
    
    // Language filter
    if (filters.language && filters.language !== 'all') {
      const languageMapping = {
        '英語': ['english', 'eng'],
        '中国語': ['chinese', 'china'],
        '韓国語': ['korean', 'korea'],
        'フランス語': ['french', 'france'],
        'スペイン語': ['spanish', 'spain'],
        'ドイツ語': ['german', 'germany']
      };
      
      const searchTerms = languageMapping[filters.language] || [filters.language];
      const hasLanguageMatch = searchTerms.some(term => 
        cardText.includes(term)
      );
      
      if (!hasLanguageMatch) {
        console.log('言語フィルター不適合');
        return false;
      }
    }
    
    // Fee filter
    if (filters.fee && filters.fee !== 'all') {
      const priceMatch = cardPrice.match(/[\d,]+/);
      if (priceMatch) {
        const price = parseInt(priceMatch[0].replace(',', ''));
        switch (filters.fee) {
          case 'under-10000':
            if (price >= 10000) return false;
            break;
          case '10000-20000':
            if (price < 10000 || price > 20000) return false;
            break;
          case 'over-20000':
            if (price <= 20000) return false;
            break;
        }
      }
    }
    
    // Keyword filter (Japanese keywords)
    if (filters.keywords.length > 0) {
      const keywordMapping = {
        'ナイトツアー': ['night', 'ナイト', '夜'],
        'グルメ': ['gourmet', 'グルメ', '料理', '食事'],
        '写真スポット': ['photo', 'spots', '写真', 'フォト'],
        '料理': ['cuisine', '料理', 'クッキング'],
        'アクティビティ': ['activities', 'アクティビティ', '体験']
      };
      
      const hasKeyword = filters.keywords.some(keyword => {
        const searchTerms = keywordMapping[keyword] || [keyword];
        return searchTerms.some(term => 
          cardText.includes(term) || 
          cardName.includes(term) || 
          cardDescription.includes(term)
        );
      });
      
      if (!hasKeyword) {
        console.log('キーワードフィルター不適合');
        return false;
      }
    }
    
    return true;
  }
  
  // Show card function (Japanese version)
  function showCardJA(card) {
    card.style.display = '';
    card.style.opacity = '1';
    card.style.visibility = 'visible';
    card.classList.remove('filtered-out', 'hidden-guide', 'd-none');
    
    // Show parent containers
    const parentCol = card.closest('.col, .col-lg-4, .col-md-6, .col-sm-12');
    if (parentCol) {
      parentCol.style.display = '';
      parentCol.style.opacity = '1';
      parentCol.classList.remove('filtered-out', 'hidden-guide', 'd-none');
    }
  }
  
  // Hide card function (Japanese version)
  function hideCardJA(card) {
    card.style.display = 'none';
    card.style.opacity = '0';
    card.classList.add('filtered-out');
    
    // Hide parent containers
    const parentCol = card.closest('.col, .col-lg-4, .col-md-6, .col-sm-12');
    if (parentCol) {
      parentCol.style.display = 'none';
      parentCol.classList.add('filtered-out');
    }
  }
  
  // Reset all filters (Japanese version)
  function resetAllFiltersJA() {
    console.log('🔄 フィルターリセット中...');
    
    // Clear all filter inputs
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCustomInput = document.getElementById('keyword-filter-custom');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (feeFilter) feeFilter.value = '';
    if (keywordCustomInput) keywordCustomInput.value = '';
    
    // Clear keyword checkboxes
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox, input[type="checkbox"]');
    keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Show all cards
    const allCards = [
      ...document.querySelectorAll('.guide-item'),
      ...document.querySelectorAll('[data-guide-id]'),
      ...document.querySelectorAll('.card')
    ];
    
    const uniqueCards = Array.from(new Set(allCards));
    uniqueCards.forEach(card => showCardJA(card));
    
    // Update results display
    updateResultsDisplayJA(uniqueCards.length);
    
    console.log(`✅ リセット完了: 全${uniqueCards.length}件のガイドを表示`);
  }
  
  // Update results display (Japanese version)
  function updateResultsDisplayJA(count) {
    // Use the global Japanese counter function
    if (window.updateFilterResultsJapanese) {
      window.updateFilterResultsJapanese(count);
    } else {
      // Fallback implementation
      const counterElements = document.querySelectorAll('.counter-badge, [class*="counter"], .badge');
      counterElements.forEach(element => {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}人のガイドが見つかりました`;
      });
    }
    
    console.log(`結果表示更新: ${count}人のガイド`);
  }
  
  // Setup enhanced filter event listeners (Japanese version)
  function setupEnhancedFilterEventsJA() {
    console.log('🎛️ 日本語版フィルターイベント設定中...');
    
    // Apply filters button
    const applyBtn = document.getElementById('apply-filters') || 
                    document.querySelector('[onclick*="filterGuides"]') ||
                    document.querySelector('.btn:contains("検索")') ||
                    document.querySelector('.btn-primary');
    
    if (applyBtn) {
      // Remove existing events
      const newApplyBtn = applyBtn.cloneNode(true);
      applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
      
      newApplyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔍 フィルター適用ボタンクリック');
        enhancedFilterGuidesJA();
      });
      
      console.log('✅ 適用ボタン設定完了');
    }
    
    // Reset filters button
    const resetBtn = document.getElementById('reset-filters') ||
                    document.querySelector('[onclick*="resetFilters"]') ||
                    document.querySelector('.btn:contains("リセット")') ||
                    document.querySelector('.btn-secondary');
    
    if (resetBtn) {
      // Remove existing events
      const newResetBtn = resetBtn.cloneNode(true);
      resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
      
      newResetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔄 フィルターリセットボタンクリック');
        resetAllFiltersJA();
      });
      
      console.log('✅ リセットボタン設定完了');
    }
    
    console.log('✅ 日本語版フィルターイベント設定完了');
  }
  
  // Initialize enhanced filter system (Japanese version)
  async function initializeEnhancedFiltersJA() {
    if (isFilterSystemInitialized) {
      console.log('フィルターシステム既に初期化済み');
      return;
    }
    
    // Check if this is the Japanese site
    const currentURL = window.location.href;
    const isJapaneseSite = !currentURL.includes('index-en.html');
    
    if (!isJapaneseSite) {
      console.log('英語サイトのため処理をスキップ');
      return;
    }
    
    console.log('🚀 日本語版強化フィルターシステム初期化中...');
    
    // Wait for guides to load
    const guideCount = await waitForGuides();
    console.log(`ガイド読み込み完了: ${guideCount}件`);
    
    // Setup events
    setupEnhancedFilterEventsJA();
    
    // Initial display update
    updateResultsDisplayJA(guideCount);
    
    isFilterSystemInitialized = true;
    console.log('✅ 日本語版強化フィルターシステム初期化完了');
  }
  
  // Multiple initialization attempts
  function attemptInitializationJA() {
    initializeEnhancedFiltersJA();
    
    // Retry after delays
    setTimeout(initializeEnhancedFiltersJA, 500);
    setTimeout(initializeEnhancedFiltersJA, 1500);
    setTimeout(initializeEnhancedFiltersJA, 3000);
  }
  
  // Start initialization
  attemptInitializationJA();
  
  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptInitializationJA);
  }
  
  // Window load
  window.addEventListener('load', attemptInitializationJA);
  
  // Visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(attemptInitializationJA, 100);
    }
  });
  
  console.log('📝 日本語版強化フィルター設定完了');
  
})();