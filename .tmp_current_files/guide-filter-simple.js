/**
 * ガイド検索シンプルフィルタリング機能
 * エラーを避けるため最小限のコードに抑えた実装
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('シンプルガイド検索フィルターを初期化しています...');
  
  // フィルターの要素を取得
  const locationFilter = document.getElementById('location-filter');
  const languageFilter = document.getElementById('language-filter');
  const feeFilter = document.getElementById('fee-filter');
  const keywordChecks = document.querySelectorAll('.keyword-checkbox');
  const keywordCustomInput = document.getElementById('keyword-filter-custom');
  const applyFilterBtn = document.getElementById('apply-filters');
  const resetFilterBtn = document.getElementById('reset-filters');
  
  // 結果カウンター用の要素
  let searchResultsCounter = document.querySelector('.search-results-counter');
  if (!searchResultsCounter) {
    // なければ作成
    searchResultsCounter = document.createElement('p');
    searchResultsCounter.className = 'search-results-counter';
    const container = document.querySelector('.guides-container') || document.querySelector('.container');
    if (container) {
      container.insertBefore(searchResultsCounter, container.firstChild);
    }
  }
  
  // 重複している結果カウンターを削除
  const counters = document.querySelectorAll('.search-results-counter');
  if (counters.length > 1) {
    for (let i = 1; i < counters.length; i++) {
      counters[i].remove();
    }
  }
  
  // 都市から都道府県を取得
  const cityToPrefecture = {
    '札幌': '北海道', '函館': '北海道', '旭川': '北海道',
    '仙台': '宮城県', '東京': '東京都', '渋谷': '東京都', '新宿': '東京都',
    '横浜': '神奈川県', '名古屋': '愛知県', '大阪': '大阪府', '京都': '京都府',
    '神戸': '兵庫県', '広島': '広島県', '福岡': '福岡県', '那覇': '沖縄県'
  };
  
  // フィルター適用ボタンのイベントリスナーを設定
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('フィルターを適用...');
      applyFilters();
    });
  }
  
  // リセットボタンのイベントリスナーを設定
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('フィルターをリセット...');
      resetFilters();
    });
  }
  
  // フィルターをリセットする関数
  function resetFilters() {
    // 各フィルターの値をリセット
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (feeFilter) feeFilter.value = '';
    if (keywordCustomInput) keywordCustomInput.value = '';
    
    // チェックボックスをすべて解除
    keywordChecks.forEach(function(check) {
      check.checked = false;
    });
    
    // すべてのカードを表示
    showAllCards();
  }
  
  // すべてのカードを表示する関数
  function showAllCards() {
    const guideItems = document.querySelectorAll('.guide-item');
    const guideCards = document.querySelectorAll('.guide-card');
    
    guideItems.forEach(function(item) {
      item.style.display = '';
      item.classList.remove('hidden-guide');
      item.style.opacity = '1';
    });
    
    guideCards.forEach(function(card) {
      card.style.display = '';
      card.classList.remove('hidden-guide');
      card.style.opacity = '1';
    });
    
    // 結果カウンターを更新
    if (searchResultsCounter) {
      searchResultsCounter.textContent = guideCards.length + '件のガイドが見つかりました';
    }
  }
  
  // フィルターを適用する関数
  function applyFilters() {
    // 現在のフィルター値を取得
    const location = locationFilter ? locationFilter.value : '';
    const language = languageFilter ? languageFilter.value : '';
    const fee = feeFilter && feeFilter.value ? parseInt(feeFilter.value) : 0;
    
    // チェックされたキーワード
    const selectedKeywords = [];
    keywordChecks.forEach(function(check) {
      if (check.checked) {
        selectedKeywords.push(check.value.toLowerCase());
      }
    });
    
    // カスタムキーワード
    const customKeywords = [];
    if (keywordCustomInput && keywordCustomInput.value) {
      const keywords = keywordCustomInput.value.split(',');
      keywords.forEach(function(keyword) {
        const trimmed = keyword.trim().toLowerCase();
        if (trimmed) {
          customKeywords.push(trimmed);
        }
      });
    }
    
    // すべてのキーワードを結合
    const allKeywords = selectedKeywords.concat(customKeywords);
    
    // ガイドカードとアイテムを取得
    const guideCards = document.querySelectorAll('.guide-card');
    let visibleCount = 0;
    
    // 各カードをフィルタリング
    guideCards.forEach(function(card) {
      // カードのテキスト内容を取得（部分一致検索用）
      const cardText = card.textContent.toLowerCase();
      
      // ロケーションチェック
      let matchesLocation = true;
      if (location && location !== 'すべて') {
        if (location === '北海道') {
          // 北海道の特別対応
          matchesLocation = 
            cardText.includes('北海道') || 
            cardText.includes('札幌') || 
            cardText.includes('函館') || 
            cardText.includes('旭川');
        } else {
          // 通常の地域検索
          matchesLocation = cardText.includes(location.toLowerCase());
        }
      }
      
      // 言語チェック
      let matchesLanguage = true;
      if (language && language !== 'すべて') {
        matchesLanguage = cardText.includes(language.toLowerCase());
      }
      
      // 料金チェック
      let matchesFee = true;
      if (fee > 0) {
        // カード内の料金表示を検索
        const feeMatch = cardText.match(/¥([0-9,]+)/);
        if (feeMatch) {
          const cardFee = parseInt(feeMatch[1].replace(/,/g, ''));
          matchesFee = cardFee <= fee;
        }
      }
      
      // キーワードチェック
      let matchesKeywords = true;
      if (allKeywords.length > 0) {
        matchesKeywords = allKeywords.some(function(keyword) {
          return cardText.includes(keyword);
        });
      }
      
      // 親要素取得
      const guideItem = card.closest('.guide-item');
      
      // すべての条件に一致する場合
      if (matchesLocation && matchesLanguage && matchesFee && matchesKeywords) {
        if (guideItem) {
          guideItem.style.display = '';
          guideItem.classList.remove('hidden-guide');
          guideItem.style.opacity = '1';
        }
        card.style.display = '';
        card.classList.remove('hidden-guide');
        card.style.opacity = '1';
        visibleCount++;
      } else {
        // 条件に一致しない場合
        if (guideItem) {
          guideItem.style.display = 'none';
          guideItem.classList.add('hidden-guide');
        }
        card.style.display = 'none';
        card.classList.add('hidden-guide');
      }
    });
    
    // 検索結果カウンターを更新
    if (searchResultsCounter) {
      searchResultsCounter.textContent = visibleCount + '件のガイドが見つかりました';
    }
    
    console.log('フィルター適用完了: ' + visibleCount + '件のガイドが一致');
  }
  
  // 初期表示では全てのカードを表示
  showAllCards();
});