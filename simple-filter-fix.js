/**
 * シンプルフィルター修正版 - 直接HTML構造に合わせた実装
 */

console.log('シンプルフィルター修正版を開始...');

// DOM読み込み完了を待つ
function waitForDOM() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilter);
  } else {
    initFilter();
  }
}

function initFilter() {
  console.log('フィルター初期化開始');
  
  // 要素を確認
  const searchBtn = document.getElementById('apply-filters');
  const resetBtn = document.getElementById('reset-filters');
  const locationSelect = document.getElementById('location-filter');
  const languageSelect = document.getElementById('language-filter');
  const feeSelect = document.getElementById('fee-filter');
  const keywordInput = document.getElementById('keyword-filter-custom');
  const keywordBoxes = document.querySelectorAll('.keyword-checkbox');
  const guideItems = document.querySelectorAll('.guide-item');
  
  console.log('要素確認:', {
    searchBtn: !!searchBtn,
    resetBtn: !!resetBtn,
    locationSelect: !!locationSelect,
    languageSelect: !!languageSelect,
    feeSelect: !!feeSelect,
    keywordInput: !!keywordInput,
    keywordBoxes: keywordBoxes.length,
    guideItems: guideItems.length
  });
  
  if (!searchBtn || !resetBtn) {
    console.error('重要なボタンが見つかりません');
    return;
  }
  
  // 検索ボタンのイベント
  searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('検索ボタンがクリックされました');
    performFilter();
  });
  
  // リセットボタンのイベント
  resetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('リセットボタンがクリックされました');
    resetFilters();
  });
  
  console.log('イベントリスナー設定完了');
}

function performFilter() {
  console.log('フィルタリング実行中...');
  
  const locationSelect = document.getElementById('location-filter');
  const languageSelect = document.getElementById('language-filter');
  const feeSelect = document.getElementById('fee-filter');
  const keywordInput = document.getElementById('keyword-filter-custom');
  const keywordBoxes = document.querySelectorAll('.keyword-checkbox:checked');
  const guideItems = document.querySelectorAll('.guide-item');
  
  // フィルター条件を取得
  const filters = {
    location: locationSelect ? locationSelect.value : '',
    language: languageSelect ? languageSelect.value : '',
    fee: feeSelect ? feeSelect.value : '',
    customKeywords: keywordInput ? keywordInput.value.toLowerCase() : '',
    selectedKeywords: Array.from(keywordBoxes).map(cb => cb.value.toLowerCase())
  };
  
  console.log('フィルター条件:', filters);
  
  let visibleCount = 0;
  
  guideItems.forEach((item, index) => {
    const card = item.querySelector('.guide-card');
    if (!card) {
      console.log(`カード${index}: guide-cardが見つかりません`);
      return;
    }
    
    const cardData = {
      location: card.dataset.location || '',
      languages: card.dataset.languages || '',
      fee: card.dataset.fee || '0',
      keywords: card.dataset.keywords || '',
      text: card.textContent.toLowerCase()
    };
    
    console.log(`カード${index}データ:`, cardData);
    
    let shouldShow = true;
    
    // 地域フィルター
    if (filters.location && filters.location !== '' && filters.location !== 'すべて') {
      const locationMatch = cardData.location.toLowerCase().includes(filters.location.toLowerCase()) ||
                           cardData.text.includes(filters.location.toLowerCase());
      if (!locationMatch) {
        shouldShow = false;
        console.log(`カード${index}: 地域でフィルターアウト`);
      }
    }
    
    // 言語フィルター
    if (shouldShow && filters.language && filters.language !== '' && filters.language !== 'すべて') {
      const languageMatch = cardData.languages.toLowerCase().includes(filters.language.toLowerCase()) ||
                           cardData.text.includes(filters.language.toLowerCase());
      if (!languageMatch) {
        shouldShow = false;
        console.log(`カード${index}: 言語でフィルターアウト`);
      }
    }
    
    // 料金フィルター
    if (shouldShow && filters.fee && filters.fee !== '' && filters.fee !== 'すべて') {
      const cardFee = parseInt(cardData.fee) || 0;
      const filterFee = parseInt(filters.fee) || 0;
      
      // 簡易料金マッチング
      let feeMatch = false;
      if (filterFee === 6000) {
        feeMatch = cardFee >= 6000;
      } else if (filterFee === 10000) {
        feeMatch = cardFee <= 10000;
      } else if (filterFee === 15000) {
        feeMatch = cardFee <= 15000;
      } else if (filterFee === 20000) {
        feeMatch = cardFee <= 20000;
      } else {
        feeMatch = true;
      }
      
      if (!feeMatch) {
        shouldShow = false;
        console.log(`カード${index}: 料金でフィルターアウト`);
      }
    }
    
    // キーワードフィルター
    if (shouldShow && filters.selectedKeywords.length > 0) {
      const keywordMatch = filters.selectedKeywords.some(keyword => 
        cardData.text.includes(keyword) || cardData.keywords.toLowerCase().includes(keyword)
      );
      if (!keywordMatch) {
        shouldShow = false;
        console.log(`カード${index}: キーワードでフィルターアウト`);
      }
    }
    
    // カスタムキーワード
    if (shouldShow && filters.customKeywords) {
      const customKeywords = filters.customKeywords.split(',').map(k => k.trim());
      const customMatch = customKeywords.some(keyword => 
        cardData.text.includes(keyword)
      );
      if (!customMatch) {
        shouldShow = false;
        console.log(`カード${index}: カスタムキーワードでフィルターアウト`);
      }
    }
    
    // 表示/非表示を設定
    if (shouldShow) {
      item.style.display = '';
      visibleCount++;
      console.log(`カード${index}: 表示`);
    } else {
      item.style.display = 'none';
      console.log(`カード${index}: 非表示`);
    }
  });
  
  console.log(`フィルタリング完了: ${visibleCount}件表示`);
  
  // 結果メッセージ更新
  updateResultMessage(visibleCount);
}

function resetFilters() {
  console.log('フィルターリセット実行中...');
  
  const locationSelect = document.getElementById('location-filter');
  const languageSelect = document.getElementById('language-filter');
  const feeSelect = document.getElementById('fee-filter');
  const keywordInput = document.getElementById('keyword-filter-custom');
  const keywordBoxes = document.querySelectorAll('.keyword-checkbox');
  const guideItems = document.querySelectorAll('.guide-item');
  
  // フォームをリセット
  if (locationSelect) locationSelect.selectedIndex = 0;
  if (languageSelect) languageSelect.selectedIndex = 0;
  if (feeSelect) feeSelect.selectedIndex = 0;
  if (keywordInput) keywordInput.value = '';
  
  keywordBoxes.forEach(cb => cb.checked = false);
  
  // 全カードを表示
  guideItems.forEach(item => {
    item.style.display = '';
  });
  
  updateResultMessage(guideItems.length);
  console.log('リセット完了');
}

function updateResultMessage(count) {
  // 結果メッセージを探して更新
  const resultElements = document.querySelectorAll('.search-results, .result-count, .guide-count');
  resultElements.forEach(el => {
    el.textContent = `${count}件のガイドが見つかりました`;
  });
  
  // メインの件数表示を探す
  const mainCountElement = document.querySelector('h2, .section-title');
  if (mainCountElement && mainCountElement.textContent.includes('ガイド')) {
    mainCountElement.textContent = `人気のガイド (${count}件)`;
  }
  
  // 0件の場合のメッセージ
  const noResultsMessage = document.getElementById('no-results-message');
  if (noResultsMessage) {
    if (count === 0) {
      noResultsMessage.classList.remove('d-none');
    } else {
      noResultsMessage.classList.add('d-none');
    }
  }
}

// 実行開始
waitForDOM();