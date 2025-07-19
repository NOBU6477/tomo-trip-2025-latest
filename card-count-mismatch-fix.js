/**
 * カード数不一致修正システム
 * 問題：18枚表示 vs 24人カウンター、フィルター時もっと見るボタン消失
 */

console.log('🔢 カード数不一致修正システム開始');

// 即座に実行
(function() {
  console.log('⚡ カード数不一致修正開始');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeCardCountFix);
  } else {
    executeCardCountFix();
  }
  
  // 複数回実行で確実に修正
  setTimeout(executeCardCountFix, 1000);
  setTimeout(executeCardCountFix, 3000);
  setTimeout(executeCardCountFix, 5000);
})();

function executeCardCountFix() {
  console.log('🔢 カード数不一致修正実行');
  
  try {
    // 1. 現在の表示状況を正確に把握
    const actualCardCount = analyzeCurrentDisplay();
    
    // 2. カウンターとカード数を同期
    synchronizeCounterAndCards(actualCardCount);
    
    // 3. フィルター時のもっと見るボタン修正
    fixLoadMoreButtonInFilter();
    
    // 4. ページング機能を正常化
    normalizePageSystem();
    
    console.log('✅ カード数不一致修正完了');
    
  } catch (error) {
    console.error('❌ カード数不一致修正エラー:', error);
  }
}

function analyzeCurrentDisplay() {
  console.log('📊 現在の表示状況分析');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.error('❌ guide-cards-container が見つかりません');
    return 0;
  }
  
  // 複数のセレクターで正確なカード数を取得
  const cardSelectors = [
    '.guide-item',
    '.guide-card',
    '.col-md-4',
    '[data-guide-id]',
    '[id*="guide-card"]'
  ];
  
  let maxCount = 0;
  const counts = {};
  
  cardSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    counts[selector] = elements.length;
    maxCount = Math.max(maxCount, elements.length);
  });
  
  console.log('📊 セレクター別カード数:', counts);
  console.log(`📊 最大カード数: ${maxCount}枚`);
  
  // 重複カードの検出
  const allCards = container.querySelectorAll('.col-md-4, .guide-item, .card');
  const uniqueIds = new Set();
  const duplicates = [];
  
  allCards.forEach(card => {
    const id = card.getAttribute('data-guide-id') || card.id || 'no-id';
    if (uniqueIds.has(id)) {
      duplicates.push(id);
    } else {
      uniqueIds.add(id);
    }
  });
  
  if (duplicates.length > 0) {
    console.log(`⚠️ 重複カード検出: ${duplicates.length}件 - ${duplicates.join(', ')}`);
  }
  
  return maxCount;
}

function synchronizeCounterAndCards(actualCardCount) {
  console.log(`🔄 カウンターとカード数の同期: ${actualCardCount}枚`);
  
  // カード数に基づいて正確なカウンターテキストを生成
  let correctCounterText;
  const totalGuides = 24; // 全体のガイド数
  
  if (actualCardCount === 0) {
    correctCounterText = 'ガイドが見つかりませんでした';
  } else if (actualCardCount === totalGuides) {
    correctCounterText = `${totalGuides}人のガイドが見つかりました`;
  } else if (actualCardCount <= 12) {
    correctCounterText = `${actualCardCount}人のガイドを表示中（全${totalGuides}人中）`;
  } else {
    correctCounterText = `${actualCardCount}人のガイドを表示中（全${totalGuides}人中）`;
  }
  
  // カウンター要素を更新
  updateAllCounterElements(correctCounterText);
  
  // HTMLの#guide-count-numberも更新
  const countNumber = document.getElementById('guide-count-number');
  if (countNumber) {
    countNumber.textContent = actualCardCount.toString();
    console.log(`📊 #guide-count-number更新: ${actualCardCount}`);
  }
  
  console.log(`🔄 同期完了: "${correctCounterText}"`);
}

function updateAllCounterElements(counterText) {
  console.log(`📊 全カウンター要素更新: "${counterText}"`);
  
  const counterSelectors = [
    '#guides-count',
    '.guide-counter',
    '.text-primary.fw-bold.fs-5',
    '.counter-badge',
    '[class*="counter"]'
  ];
  
  let updateCount = 0;
  
  counterSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // ガイド関連の要素のみ更新
        const currentText = element.textContent || element.innerHTML;
        if (currentText.includes('ガイド') || currentText.includes('人の') || currentText.includes('guides')) {
          element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
          updateCount++;
        }
      });
    } catch (error) {
      console.log(`⚠️ セレクター ${selector} でエラー: ${error.message}`);
    }
  });
  
  console.log(`📊 カウンター更新完了: ${updateCount}箇所`);
}

function fixLoadMoreButtonInFilter() {
  console.log('🔘 フィルター時もっと見るボタン修正');
  
  // 既存のフィルター関数をオーバーライド
  const originalSearchGuides = window.searchGuides;
  const originalApplyFilters = window.applyFilters;
  
  // searchGuides関数を拡張
  window.searchGuides = function() {
    console.log('🔍 フィルター検索実行（拡張版）');
    
    // 元の関数があれば実行
    if (originalSearchGuides && typeof originalSearchGuides === 'function') {
      originalSearchGuides();
    }
    
    // フィルター後の処理
    setTimeout(() => {
      handlePostFilterActions();
    }, 500);
  };
  
  // applyFilters関数を拡張
  if (window.emergencyPaginationSystem && window.emergencyPaginationSystem.applyFilters) {
    const originalApplyFiltersMethod = window.emergencyPaginationSystem.applyFilters;
    
    window.emergencyPaginationSystem.applyFilters = function() {
      console.log('🔍 緊急システムフィルター実行（拡張版）');
      
      // 元のメソッドを実行
      originalApplyFiltersMethod.call(this);
      
      // フィルター後の処理
      setTimeout(() => {
        handlePostFilterActions();
      }, 500);
    };
  }
  
  console.log('🔘 フィルター関数拡張完了');
}

function handlePostFilterActions() {
  console.log('🔄 フィルター後処理実行');
  
  // フィルター後のカード数を取得
  const filteredCardCount = analyzeCurrentDisplay();
  
  // カウンターを更新
  synchronizeCounterAndCards(filteredCardCount);
  
  // もっと見るボタンの状態を修正
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    // フィルター結果に関係なく、24枚未満なら表示
    if (filteredCardCount < 24) {
      const remaining = 24 - filteredCardCount;
      loadMoreBtn.innerHTML = `
        <button class="btn btn-primary btn-lg load-more-button" onclick="handleFilteredLoadMore()">
          もっと見る（残り${remaining}人）
        </button>
      `;
      loadMoreBtn.style.display = 'block';
      console.log(`🔘 フィルター後もっと見るボタン表示: 残り${remaining}人`);
    } else {
      loadMoreBtn.style.display = 'none';
      console.log('🔘 フィルター後もっと見るボタン非表示（全員表示済み）');
    }
  }
}

function normalizePageSystem() {
  console.log('📄 ページングシステム正常化');
  
  // 18枚表示を12枚に修正
  const container = document.getElementById('guide-cards-container');
  if (!container) return;
  
  const currentCards = container.querySelectorAll('.col-md-4, .guide-item, .card');
  const currentCount = currentCards.length;
  
  if (currentCount > 12) {
    console.log(`📄 ${currentCount}枚 → 12枚に調整`);
    
    // 13枚目以降を非表示
    currentCards.forEach((card, index) => {
      if (index >= 12) {
        card.style.display = 'none';
        console.log(`📄 カード${index + 1}を非表示`);
      }
    });
    
    // カウンターを12枚表示に更新
    synchronizeCounterAndCards(12);
    
    // もっと見るボタンを強制表示
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      const remaining = currentCount - 12;
      loadMoreBtn.innerHTML = `
        <button class="btn btn-primary btn-lg load-more-button" onclick="handleNormalizedLoadMore()">
          もっと見る（残り${remaining}人）
        </button>
      `;
      loadMoreBtn.style.display = 'block';
      console.log(`📄 もっと見るボタン強制表示: 残り${remaining}人`);
    }
  }
}

// フィルター用のもっと見る処理
window.handleFilteredLoadMore = function() {
  console.log('🔘 フィルター用もっと見る実行');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) return;
  
  const hiddenCards = container.querySelectorAll('.col-md-4[style*="display: none"], .guide-item[style*="display: none"]');
  const showCount = Math.min(hiddenCards.length, 12);
  
  for (let i = 0; i < showCount; i++) {
    hiddenCards[i].style.display = 'block';
  }
  
  // カウンター更新
  const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])');
  synchronizeCounterAndCards(visibleCards.length);
  
  // ボタン状態更新
  handlePostFilterActions();
  
  console.log(`🔘 フィルター用もっと見る完了: ${showCount}枚追加表示`);
};

// 正常化用のもっと見る処理
window.handleNormalizedLoadMore = function() {
  console.log('🔘 正常化用もっと見る実行');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) return;
  
  const hiddenCards = container.querySelectorAll('.col-md-4[style*="display: none"], .guide-item[style*="display: none"]');
  const showCount = Math.min(hiddenCards.length, 12);
  
  for (let i = 0; i < showCount; i++) {
    hiddenCards[i].style.display = 'block';
  }
  
  // カウンター更新
  const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])');
  synchronizeCounterAndCards(visibleCards.length);
  
  // ボタン状態更新
  const loadMoreBtn = document.getElementById('load-more-btn');
  const remainingHidden = container.querySelectorAll('.col-md-4[style*="display: none"], .guide-item[style*="display: none"]').length;
  
  if (remainingHidden > 0) {
    loadMoreBtn.innerHTML = `
      <button class="btn btn-primary btn-lg load-more-button" onclick="handleNormalizedLoadMore()">
        もっと見る（残り${remainingHidden}人）
      </button>
    `;
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
  
  console.log(`🔘 正常化用もっと見る完了: ${showCount}枚追加表示`);
};

// リセット機能の拡張
const originalResetFilters = window.resetFilters;
window.resetFilters = function() {
  console.log('🔄 リセット実行（拡張版）');
  
  // 元のリセット関数を実行
  if (originalResetFilters && typeof originalResetFilters === 'function') {
    originalResetFilters();
  }
  
  // 追加のリセット処理
  setTimeout(() => {
    normalizePageSystem();
    executeCardCountFix();
  }, 500);
};

// 継続的な監視システム
function startCardCountMonitoring() {
  console.log('👁️ カード数監視開始');
  
  let lastCardCount = 0;
  
  setInterval(() => {
    const currentCardCount = analyzeCurrentDisplay();
    
    // カード数に変化があった場合
    if (currentCardCount !== lastCardCount) {
      console.log(`👁️ カード数変化検出: ${lastCardCount} → ${currentCardCount}`);
      synchronizeCounterAndCards(currentCardCount);
      lastCardCount = currentCardCount;
    }
    
    // カウンターとカード数の不一致を検出
    const counterElement = document.getElementById('guide-count-number');
    if (counterElement) {
      const counterValue = parseInt(counterElement.textContent || '0');
      if (counterValue !== currentCardCount && currentCardCount > 0) {
        console.log(`👁️ カウンター不一致検出: カウンター${counterValue} vs カード${currentCardCount}`);
        synchronizeCounterAndCards(currentCardCount);
      }
    }
  }, 5000); // 5秒間隔で監視
}

// 5秒後に監視開始
setTimeout(startCardCountMonitoring, 5000);

// デバッグ用関数
window.cardCountDebug = function() {
  console.log('🔢 カード数不一致デバッグ情報');
  
  const actualCards = analyzeCurrentDisplay();
  const counterElement = document.getElementById('guide-count-number');
  const counterValue = counterElement ? parseInt(counterElement.textContent || '0') : 0;
  
  console.log('🔢 現在の状態:', {
    actualCardCount: actualCards,
    counterValue: counterValue,
    mismatch: actualCards !== counterValue,
    loadMoreButton: !!document.getElementById('load-more-btn'),
    emergencySystemExists: !!window.emergencyPaginationSystem
  });
  
  // 手動修正実行
  executeCardCountFix();
};

console.log('✅ カード数不一致修正システム読み込み完了');
console.log('🔧 デバッグ用: window.cardCountDebug() を実行してください');