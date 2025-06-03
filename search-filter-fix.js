/**
 * 検索フィルター修正スクリプト
 * 地域検索で正確な結果を表示するための包括的修正
 */

(function() {
  'use strict';

  let isInitialized = false;

  document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('検索フィルター修正スクリプトを初期化中...');
    initializeFilterFix();
  });

  function initializeFilterFix() {
    // 既存のフィルター関数をオーバーライド
    overrideFilterFunctions();
    
    // フィルターボタンのイベントを再設定
    setupFilterButtons();
    
    // 地域選択変更時の即座適用
    setupLocationFilter();
  }

  /**
   * 既存のフィルター関数をオーバーライド
   */
  function overrideFilterFunctions() {
    // グローバルなapplyFilters関数をオーバーライド
    window.applyFilters = function() {
      console.log('修正されたフィルターを適用中...');
      
      const locationFilter = document.getElementById('location-filter');
      const languageFilter = document.getElementById('language-filter');
      const feeFilter = document.getElementById('fee-filter');
      const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
      const customKeywordInput = document.getElementById('keyword-filter-custom');
      
      // フィルター値を取得
      const location = locationFilter ? locationFilter.value : '';
      const language = languageFilter ? languageFilter.value : '';
      const fee = feeFilter ? parseInt(feeFilter.value) || 0 : 0;
      
      // キーワードを取得
      const selectedKeywords = Array.from(keywordCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());
      
      const customKeywords = customKeywordInput && customKeywordInput.value 
        ? customKeywordInput.value.split(',').map(kw => kw.trim().toLowerCase()).filter(kw => kw !== '')
        : [];
      
      const allKeywords = [...selectedKeywords, ...customKeywords];
      
      // 全ガイドカードを取得
      const allGuideCards = document.querySelectorAll('.guide-card, .card');
      let visibleCount = 0;
      
      console.log(`フィルター条件: 地域="${location}", 言語="${language}", 料金=${fee}, キーワード=[${allKeywords.join(', ')}]`);
      
      allGuideCards.forEach((card, index) => {
        const cardId = card.getAttribute('data-guide-id') || index;
        
        // カードデータを取得
        const cardData = extractCardData(card);
        
        // 各条件をチェック
        const matchesLocation = checkLocationMatch(location, cardData.location);
        const matchesLanguage = checkLanguageMatch(language, cardData.languages);
        const matchesFee = checkFeeMatch(fee, cardData.fee);
        const matchesKeywords = checkKeywordsMatch(allKeywords, cardData.keywords);
        
        console.log(`カードID=${cardId}: 地域=${matchesLocation}, 言語=${matchesLanguage}, 料金=${matchesFee}, キーワード=${matchesKeywords}`);
        
        // 表示判定
        const shouldShow = matchesLocation && matchesLanguage && matchesFee && matchesKeywords;
        
        // カードを表示/非表示
        toggleCardVisibility(card, shouldShow);
        
        if (shouldShow) {
          visibleCount++;
        }
      });
      
      console.log(`フィルター完了: ${visibleCount}件のガイドが表示されています`);
      updateResultsDisplay(visibleCount);
    };
  }

  /**
   * カードデータを抽出
   */
  function extractCardData(card) {
    const cardText = card.textContent.toLowerCase();
    
    // 地域情報を抽出
    const locationElement = card.querySelector('.location, .card-text, [class*="location"]');
    let location = '';
    if (locationElement) {
      location = locationElement.textContent.toLowerCase();
    } else {
      // テキストから地域を推測
      const locationPatterns = [
        /北海道|札幌|函館|旭川|小樽|釧路/,
        /青森|弘前|八戸/,
        /岩手|盛岡/,
        /宮城|仙台/,
        /秋田/,
        /山形/,
        /福島|いわき/,
        /茨城|水戸|つくば/,
        /栃木|宇都宮/,
        /群馬|前橋|高崎/,
        /埼玉|さいたま|川越|所沢/,
        /千葉|船橋|柏/,
        /東京|新宿|渋谷|原宿|浅草|銀座|上野|池袋|品川|秋葉原/,
        /神奈川|横浜|川崎|鎌倉|湘南/,
        /新潟|長岡/,
        /富山/,
        /石川|金沢/,
        /福井/,
        /山梨|甲府/,
        /長野|松本/,
        /岐阜|高山/,
        /静岡|浜松|熱海/,
        /愛知|名古屋|豊田/,
        /三重|津|伊勢/,
        /滋賀|大津/,
        /京都|嵐山|清水/,
        /大阪|梅田|難波|天王寺/,
        /兵庫|神戸|姫路/,
        /奈良/,
        /和歌山/,
        /鳥取/,
        /島根|松江|出雲/,
        /岡山|倉敷/,
        /広島|尾道|福山/,
        /山口|下関/,
        /徳島/,
        /香川|高松/,
        /愛媛|松山/,
        /高知/,
        /福岡|博多|北九州/,
        /佐賀/,
        /長崎|佐世保/,
        /熊本/,
        /大分|別府/,
        /宮崎/,
        /鹿児島|屋久島/,
        /沖縄|那覇|石垣|宮古島|竹富島|西表島|久米島|座間味|渡嘉敷|伊是名|伊平屋|粟国|宮古|多良間|与那国|波照間|黒島|小浜島|新城島|鳩間島|由布島|嘉弥真島/
      ];
      
      for (const pattern of locationPatterns) {
        const match = cardText.match(pattern);
        if (match) {
          location = match[0];
          break;
        }
      }
    }
    
    // 言語情報を抽出
    const languages = cardText.includes('english') || cardText.includes('英語') ? '日本語,英語' : '日本語';
    
    // 料金情報を抽出
    const feeMatch = cardText.match(/¥([0-9,]+)|([0-9,]+)円/);
    const fee = feeMatch ? parseInt(feeMatch[1] || feeMatch[2], 10) : 0;
    
    // キーワード情報を抽出
    const keywords = cardText.replace(/[¥,]/g, ' ').toLowerCase();
    
    return {
      location: location,
      languages: languages,
      fee: fee,
      keywords: keywords
    };
  }

  /**
   * 地域マッチング判定
   */
  function checkLocationMatch(filterLocation, cardLocation) {
    if (!filterLocation || filterLocation === 'すべて') {
      return true;
    }
    
    const filter = filterLocation.toLowerCase();
    const card = cardLocation.toLowerCase();
    
    console.log(`地域条件チェック: 条件="${filter}", カード地域="${card}"`);
    
    // 沖縄県の特別処理
    if (filter.includes('沖縄')) {
      const okinawaKeywords = [
        '沖縄', 'okinawa', '那覇', 'naha', '石垣', 'ishigaki',
        '宮古島', 'miyako', '竹富島', 'taketomi', '西表島', 'iriomote',
        '久米島', 'kumejima', '座間味', 'zamami', '渡嘉敷', 'tokashiki',
        '伊是名', 'izena', '伊平屋', 'iheya', '粟国', 'aguni',
        '多良間', 'tarama', '与那国', 'yonaguni', '波照間', 'hateruma',
        '黒島', 'kuroshima', '小浜島', 'kohamajima', '新城島', 'aragusuku',
        '鳩間島', 'hatoma', '由布島', 'yubu', '嘉弥真島', 'kayama'
      ];
      
      return okinawaKeywords.some(keyword => card.includes(keyword));
    }
    
    // 北海道の特別処理
    if (filter.includes('北海道') || filter.includes('hokkaido')) {
      const hokkaidoKeywords = [
        '北海道', 'hokkaido', '札幌', 'sapporo', '函館', 'hakodate',
        '旭川', 'asahikawa', '小樽', 'otaru', '釧路', 'kushiro',
        '帯広', 'obihiro', '稚内', 'wakkanai', '網走', 'abashiri'
      ];
      
      return hokkaidoKeywords.some(keyword => card.includes(keyword));
    }
    
    // 一般的な部分マッチング
    return card.includes(filter) || filter.includes(card);
  }

  /**
   * 言語マッチング判定
   */
  function checkLanguageMatch(filterLanguage, cardLanguages) {
    if (!filterLanguage || filterLanguage === 'すべて') {
      return true;
    }
    
    return cardLanguages.toLowerCase().includes(filterLanguage.toLowerCase());
  }

  /**
   * 料金マッチング判定
   */
  function checkFeeMatch(filterFee, cardFee) {
    if (!filterFee || filterFee === 0) {
      return true;
    }
    
    return cardFee <= filterFee;
  }

  /**
   * キーワードマッチング判定
   */
  function checkKeywordsMatch(filterKeywords, cardKeywords) {
    if (filterKeywords.length === 0) {
      return true;
    }
    
    return filterKeywords.some(keyword => 
      keyword && cardKeywords.includes(keyword.toLowerCase())
    );
  }

  /**
   * カードの表示/非表示を切り替え
   */
  function toggleCardVisibility(card, shouldShow) {
    const guideItem = card.closest('.guide-item, .col, .col-md-4, .col-lg-4');
    
    if (shouldShow) {
      if (guideItem) {
        guideItem.style.display = '';
        guideItem.classList.remove('d-none', 'hidden-guide');
      }
      card.style.display = '';
      card.classList.remove('d-none', 'hidden-guide');
    } else {
      if (guideItem) {
        guideItem.style.display = 'none';
        guideItem.classList.add('hidden-guide');
      }
      card.style.display = 'none';
      card.classList.add('hidden-guide');
    }
  }

  /**
   * 結果表示を更新
   */
  function updateResultsDisplay(count) {
    // 結果カウンターを更新
    let counter = document.getElementById('search-results-counter');
    if (!counter) {
      counter = document.querySelector('.search-results-counter');
    }
    
    if (counter) {
      counter.textContent = `${count}件のガイドが見つかりました`;
    }
    
    // 結果がない場合のメッセージ
    let noResultsMessage = document.getElementById('no-results-message');
    if (count === 0) {
      if (!noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.id = 'no-results-message';
        noResultsMessage.className = 'alert alert-info text-center mt-3';
        noResultsMessage.innerHTML = '条件に一致するガイドが見つかりませんでした。検索条件を変更してお試しください。';
        
        const container = document.querySelector('.guides-container, .row');
        if (container) {
          container.appendChild(noResultsMessage);
        }
      }
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }
  }

  /**
   * フィルターボタンの設定
   */
  function setupFilterButtons() {
    const applyButton = document.getElementById('apply-filters');
    const resetButton = document.getElementById('reset-filters');
    
    if (applyButton) {
      // 既存のイベントを削除して新しいものを設定
      const newApplyButton = applyButton.cloneNode(true);
      applyButton.parentNode.replaceChild(newApplyButton, applyButton);
      
      newApplyButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.applyFilters();
      });
    }
    
    if (resetButton) {
      const newResetButton = resetButton.cloneNode(true);
      resetButton.parentNode.replaceChild(newResetButton, resetButton);
      
      newResetButton.addEventListener('click', function(e) {
        e.preventDefault();
        resetFilters();
      });
    }
  }

  /**
   * 地域フィルターの即座適用設定
   */
  function setupLocationFilter() {
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) {
      locationFilter.addEventListener('change', function() {
        setTimeout(() => {
          window.applyFilters();
        }, 100);
      });
    }
  }

  /**
   * フィルターリセット
   */
  function resetFilters() {
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
    
    // フィルターを適用（全て表示）
    window.applyFilters();
  }

  // グローバル関数として公開
  window.fixedApplyFilters = window.applyFilters;
  window.resetFilters = resetFilters;

})();

console.log('検索フィルター修正スクリプトがロードされました');