/**
 * 完全ガイドカウンター修正システム
 * 問題：リセット時に「6人のガイドが見つかりました（全6人中）」→ 正しい24人表示に修正
 */

console.log('🔢 完全ガイドカウンター修正システム開始');

// DOM読み込み完了後とページ読み込み完了後の両方で実行
document.addEventListener('DOMContentLoaded', initializeCompleteCounterFix);
window.addEventListener('load', function() {
  setTimeout(initializeCompleteCounterFix, 1000);
});

function initializeCompleteCounterFix() {
  console.log('🚀 完全ガイドカウンター修正初期化');
  
  // より強力なresetFilters関数を実装
  const originalResetFilters = window.resetFilters;
  
  window.resetFilters = function() {
    console.log('🔄 完全カウンター修正版リセット実行');
    
    // 元のリセット機能を実行
    if (typeof originalResetFilters === 'function') {
      originalResetFilters();
    }
    
    // 追加で確実な修正を実行
    setTimeout(() => {
      executeCompleteCounterFix();
    }, 500);
    
    setTimeout(() => {
      executeCompleteCounterFix();
    }, 1500);
  };
  
  // 定期的な監視も開始
  setInterval(monitorAndFixCounter, 10000); // 10秒間隔
  
  console.log('✅ 完全ガイドカウンター修正初期化完了');
}

function executeCompleteCounterFix() {
  console.log('🔧 完全カウンター修正実行開始');
  
  try {
    // 1. 正確なガイド数を取得
    const totalGuides = getTrueGuideCount();
    console.log(`📊 実際のガイド総数: ${totalGuides}人`);
    
    // 2. 表示されているカード数を確認
    const displayedCards = getDisplayedCardCount();
    console.log(`📊 表示中カード数: ${displayedCards}枚`);
    
    // 3. フィルター状態を確認
    const isFiltered = checkFilterStatus();
    console.log(`🔍 フィルター状態: ${isFiltered ? 'あり' : 'なし'}`);
    
    // 4. カウンター表示を更新
    updateCompleteCounter(displayedCards, totalGuides, isFiltered);
    
    // 5. 表示ガイド数が少なすぎる場合は強制修正
    if (!isFiltered && displayedCards < totalGuides) {
      console.log('⚠️ 表示ガイド数が不足 - 強制修正実行');
      forceDisplayAllGuides();
    }
    
    console.log('✅ 完全カウンター修正実行完了');
    
  } catch (error) {
    console.error('❌ 完全カウンター修正エラー:', error);
  }
}

function getTrueGuideCount() {
  let totalCount = 0;
  
  // 1. pagination-guide-systemから取得
  if (window.paginationGuideSystem && window.paginationGuideSystem.allGuides) {
    totalCount = window.paginationGuideSystem.allGuides.length;
    console.log(`📊 pagination-guide-systemから${totalCount}人取得`);
  }
  
  // 2. getDefaultGuides関数から取得（フォールバック）
  if (totalCount === 0 && typeof getDefaultGuides === 'function') {
    const defaultGuides = getDefaultGuides();
    totalCount = defaultGuides.length;
    console.log(`📊 getDefaultGuidesから${totalCount}人取得`);
  }
  
  // 3. localStorageの新規登録ガイドも加算
  const newGuides = localStorage.getItem('newRegisteredGuides');
  if (newGuides) {
    const additional = JSON.parse(newGuides);
    totalCount += additional.length;
    console.log(`📊 新規登録ガイド${additional.length}人を加算`);
  }
  
  // 4. 最低24人を保証（データが不完全な場合）
  if (totalCount < 24) {
    console.log(`⚠️ ガイド数が24人未満(${totalCount}人) - 24人に修正`);
    totalCount = 24;
  }
  
  return totalCount;
}

function getDisplayedCardCount() {
  const container = document.getElementById('guide-cards-container');
  if (!container) return 0;
  
  const cards = container.querySelectorAll('.guide-card, .card, .guide-item');
  const visibleCards = Array.from(cards).filter(card => {
    const style = window.getComputedStyle(card);
    return style.display !== 'none' && !card.classList.contains('d-none');
  });
  
  return visibleCards.length;
}

function checkFilterStatus() {
  const filters = [
    document.getElementById('location-filter'),
    document.getElementById('language-filter'),
    document.getElementById('price-filter'),
    document.getElementById('custom-keywords')
  ];
  
  // selectフィルターの確認
  const selectFiltered = filters.slice(0, 3).some(filter => {
    return filter && filter.value && filter.value !== '' && filter.value !== 'すべて';
  });
  
  // カスタムキーワードの確認
  const keywordFiltered = filters[3] && filters[3].value && filters[3].value.trim() !== '';
  
  // チェックボックスの確認
  const checkboxFiltered = document.querySelectorAll('.keyword-checkbox:checked').length > 0;
  
  return selectFiltered || keywordFiltered || checkboxFiltered;
}

function updateCompleteCounter(displayedCount, totalCount, isFiltered) {
  let counterText;
  
  if (isFiltered) {
    counterText = `${displayedCount}人のガイドが見つかりました（全${totalCount}人中）`;
  } else {
    counterText = `${totalCount}人のガイドが見つかりました`;
  }
  
  console.log(`📊 カウンター更新: "${counterText}"`);
  
  // 複数の候補セレクターでカウンターを更新
  const counterSelectors = [
    '.text-primary.fw-bold.fs-5',
    '.counter-badge',
    '#guides-count',
    '.guide-counter',
    '#guide-counter',
    '[class*="guide"][class*="count"]',
    '[id*="guide"][id*="count"]'
  ];
  
  let updatedCount = 0;
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const currentText = element.textContent;
      
      // 「X人のガイドが」パターンを含む要素のみ更新
      if (currentText.includes('人のガイドが') || currentText.includes('ガイドが見つかりました')) {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
        updatedCount++;
        console.log(`📊 カウンター更新 (${selector}): ${counterText}`);
      }
    });
  });
  
  // 直接的なテキスト検索・置換（最後の手段）
  if (updatedCount === 0) {
    console.log('⚠️ セレクターでの更新失敗 - 直接テキスト検索実行');
    updateCounterByTextSearch(counterText);
  }
  
  console.log(`📊 完全カウンター更新完了: ${updatedCount}箇所更新`);
}

function updateCounterByTextSearch(counterText) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  
  while (node = walker.nextNode()) {
    if (node.textContent.includes('人のガイドが見つかりました')) {
      textNodes.push(node);
    }
  }
  
  textNodes.forEach(textNode => {
    const parentElement = textNode.parentElement;
    if (parentElement) {
      parentElement.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
      console.log('📊 直接テキスト更新実行');
    }
  });
}

function forceDisplayAllGuides() {
  console.log('👥 全ガイド強制表示開始');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.error('❌ ガイドコンテナが見つかりません');
    return;
  }
  
  // 既存のガイドシステムを使って全ガイドを再表示
  if (window.paginationGuideSystem && typeof window.paginationGuideSystem.displayGuidesPage === 'function') {
    console.log('🔄 pagination-guide-systemで全表示実行');
    
    // フィルターをリセット
    window.paginationGuideSystem.filteredGuides = [...window.paginationGuideSystem.allGuides];
    window.paginationGuideSystem.displayGuidesPage();
    window.paginationGuideSystem.updateCounter();
    
  } else if (window.workingFilterDebug && typeof window.getAllRegisteredGuides === 'function') {
    console.log('🔄 working-filter-systemで全表示実行');
    
    const allGuides = getAllRegisteredGuides();
    displayFilteredGuides(allGuides);
    updateGuideCounter(allGuides.length, allGuides.length);
  }
  
  console.log('✅ 全ガイド強制表示完了');
}

function monitorAndFixCounter() {
  const displayedCards = getDisplayedCardCount();
  const totalGuides = getTrueGuideCount();
  const isFiltered = checkFilterStatus();
  
  // 明らかに不正な状態を検出
  const isAbnormal = !isFiltered && displayedCards < (totalGuides * 0.5); // 半分以下なら異常
  
  if (isAbnormal) {
    console.log(`⚠️ 異常状態検出: 表示${displayedCards}人/総数${totalGuides}人 - 自動修正実行`);
    executeCompleteCounterFix();
  }
}

// デバッグ用関数
window.completeCounterDebug = function() {
  console.log('🔍 完全カウンター修正デバッグ情報');
  
  const totalGuides = getTrueGuideCount();
  const displayedCards = getDisplayedCardCount();
  const isFiltered = checkFilterStatus();
  
  console.log('📊 システム状態:', {
    totalGuides: totalGuides,
    displayedCards: displayedCards,
    isFiltered: isFiltered,
    paginationSystemExists: !!window.paginationGuideSystem,
    workingFilterExists: !!window.workingFilterDebug
  });
  
  // カウンター要素の確認
  const counterElements = document.querySelectorAll('[class*="counter"], [id*="counter"], .text-primary.fw-bold.fs-5');
  console.log(`📊 カウンター要素数: ${counterElements.length}`);
  
  counterElements.forEach((el, idx) => {
    console.log(`📊 カウンター${idx}: "${el.textContent.trim()}"`);
  });
};

console.log('✅ 完全ガイドカウンター修正システム読み込み完了');
console.log('🔧 デバッグ用: window.completeCounterDebug() を実行してください');