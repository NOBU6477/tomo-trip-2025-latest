/**
 * もっと見るボタン修正システム
 * 問題：ボタンがクリックできない、クリック後の処理が不正
 */

console.log('🔘 もっと見るボタン修正システム開始');

// 即座に実行
(function() {
  console.log('⚡ もっと見るボタン修正開始');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeLoadMoreFix);
  } else {
    executeLoadMoreFix();
  }
  
  // 遅延実行で確実に修正
  setTimeout(executeLoadMoreFix, 1000);
  setTimeout(executeLoadMoreFix, 3000);
  setTimeout(executeLoadMoreFix, 5000);
})();

function executeLoadMoreFix() {
  console.log('🔘 もっと見るボタン修正実行');
  
  try {
    // 1. 既存のボタンの状態を分析
    analyzeCurrentButtonState();
    
    // 2. ボタンのクリックイベントを修正
    fixButtonClickEvents();
    
    // 3. ボタンの表示状態を修正
    fixButtonVisibility();
    
    // 4. 統一されたボタン処理システムを実装
    implementUnifiedButtonSystem();
    
    console.log('✅ もっと見るボタン修正完了');
    
  } catch (error) {
    console.error('❌ もっと見るボタン修正エラー:', error);
  }
}

function analyzeCurrentButtonState() {
  console.log('🔍 もっと見るボタン状態分析');
  
  const loadMoreBtn = document.getElementById('load-more-btn');
  const container = document.getElementById('guide-cards-container');
  
  if (!loadMoreBtn) {
    console.log('⚠️ load-more-btn要素が存在しません');
    return;
  }
  
  if (!container) {
    console.log('⚠️ guide-cards-container要素が存在しません');
    return;
  }
  
  // ボタンの現在の状態
  const buttonDisplay = window.getComputedStyle(loadMoreBtn).display;
  const buttonInnerHTML = loadMoreBtn.innerHTML;
  const hasClickHandler = loadMoreBtn.onclick !== null;
  
  // カードの現在の状態
  const totalCards = container.querySelectorAll('.col-md-4, .guide-item').length;
  const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length;
  const hiddenCards = totalCards - visibleCards;
  
  console.log('🔍 ボタン状態:', {
    display: buttonDisplay,
    hasClickHandler: hasClickHandler,
    innerHTML: buttonInnerHTML.substring(0, 50) + '...',
    totalCards: totalCards,
    visibleCards: visibleCards,
    hiddenCards: hiddenCards
  });
  
  // 問題を特定
  if (buttonDisplay === 'none') {
    console.log('🚨 問題: ボタンが非表示');
  }
  
  if (!hasClickHandler && !buttonInnerHTML.includes('onclick=')) {
    console.log('🚨 問題: クリックハンドラーが設定されていない');
  }
  
  if (hiddenCards > 0 && buttonDisplay === 'none') {
    console.log('🚨 問題: 隠れたカードがあるのにボタンが非表示');
  }
}

function fixButtonClickEvents() {
  console.log('🔧 ボタンクリックイベント修正');
  
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (!loadMoreBtn) return;
  
  // 既存のクリックハンドラーをクリア
  loadMoreBtn.onclick = null;
  loadMoreBtn.removeAttribute('onclick');
  
  // 新しいイベントリスナーを追加
  const newButton = loadMoreBtn.querySelector('button');
  if (newButton) {
    // 既存のイベントリスナーをクリア
    newButton.onclick = null;
    newButton.removeAttribute('onclick');
    
    // 新しいクリックハンドラーを設定
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔘 統一もっと見るボタンクリック');
      handleUnifiedLoadMore();
    });
    
    console.log('🔧 新しいクリックハンドラー設定完了');
  }
}

function fixButtonVisibility() {
  console.log('👁️ ボタン表示状態修正');
  
  const loadMoreBtn = document.getElementById('load-more-btn');
  const container = document.getElementById('guide-cards-container');
  
  if (!loadMoreBtn || !container) return;
  
  const totalCards = container.querySelectorAll('.col-md-4, .guide-item').length;
  const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length;
  const hiddenCards = totalCards - visibleCards;
  
  if (hiddenCards > 0) {
    // 隠れたカードがある場合はボタンを表示
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.innerHTML = `
      <button class="btn btn-primary btn-lg load-more-button">
        もっと見る（残り${hiddenCards}人）
      </button>
    `;
    
    // ボタンにクリックハンドラーを再設定
    const button = loadMoreBtn.querySelector('button');
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 修正版もっと見るボタンクリック');
        handleUnifiedLoadMore();
      });
    }
    
    console.log(`👁️ ボタン表示設定: 残り${hiddenCards}人`);
  } else {
    // 全カード表示済みの場合は非表示
    loadMoreBtn.style.display = 'none';
    console.log('👁️ ボタン非表示設定（全員表示済み）');
  }
}

function implementUnifiedButtonSystem() {
  console.log('🔧 統一ボタンシステム実装');
  
  // グローバル関数として統一されたもっと見る処理を定義
  window.handleUnifiedLoadMore = function() {
    console.log('🔘 統一もっと見る処理開始');
    
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.error('❌ guide-cards-container が見つかりません');
      return;
    }
    
    // 隠れているカードを検索
    const hiddenCards = container.querySelectorAll('.col-md-4[style*="display: none"], .guide-item[style*="display: none"]');
    const showCount = Math.min(hiddenCards.length, 12); // 最大12枚ずつ表示
    
    console.log(`🔘 隠れたカード: ${hiddenCards.length}枚, 表示予定: ${showCount}枚`);
    
    if (showCount === 0) {
      console.log('⚠️ 表示する隠れたカードがありません');
      const loadMoreBtn = document.getElementById('load-more-btn');
      if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
      }
      return;
    }
    
    // カードを表示
    for (let i = 0; i < showCount; i++) {
      hiddenCards[i].style.display = 'block';
      console.log(`🔘 カード${i + 1}を表示`);
    }
    
    // カウンターを更新
    updateUnifiedCounter();
    
    // ボタン状態を更新
    updateUnifiedButton();
    
    console.log(`🔘 統一もっと見る処理完了: ${showCount}枚追加表示`);
  };
  
  // 既存の関数をオーバーライド
  if (window.emergencyPaginationSystem && window.emergencyPaginationSystem.loadMore) {
    window.emergencyPaginationSystem.loadMore = window.handleUnifiedLoadMore;
    console.log('🔧 緊急システムのloadMoreをオーバーライド');
  }
  
  // その他の関数もオーバーライド
  window.handleFilteredLoadMore = window.handleUnifiedLoadMore;
  window.handleNormalizedLoadMore = window.handleUnifiedLoadMore;
  window.forceLoadMoreGuides = window.handleUnifiedLoadMore;
  
  console.log('🔧 統一ボタンシステム実装完了');
}

function updateUnifiedCounter() {
  console.log('📊 統一カウンター更新');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) return;
  
  const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length;
  const totalCards = container.querySelectorAll('.col-md-4, .guide-item').length;
  
  let counterText;
  if (visibleCards === totalCards) {
    counterText = `${totalCards}人のガイドが見つかりました`;
  } else {
    counterText = `${visibleCards}人のガイドを表示中（全${totalCards}人中）`;
  }
  
  // カウンター要素を更新
  const counterSelectors = [
    '#guides-count',
    '.guide-counter',
    '.text-primary.fw-bold.fs-5',
    '#guide-count-number'
  ];
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (selector === '#guide-count-number') {
        element.textContent = visibleCards.toString();
      } else {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
      }
    });
  });
  
  console.log(`📊 統一カウンター更新完了: "${counterText}"`);
}

function updateUnifiedButton() {
  console.log('🔘 統一ボタン更新');
  
  const container = document.getElementById('guide-cards-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  if (!container || !loadMoreBtn) return;
  
  const totalCards = container.querySelectorAll('.col-md-4, .guide-item').length;
  const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length;
  const hiddenCards = totalCards - visibleCards;
  
  if (hiddenCards > 0) {
    loadMoreBtn.innerHTML = `
      <button class="btn btn-primary btn-lg load-more-button">
        もっと見る（残り${hiddenCards}人）
      </button>
    `;
    loadMoreBtn.style.display = 'block';
    
    // クリックハンドラーを再設定
    const button = loadMoreBtn.querySelector('button');
    if (button) {
      button.onclick = null;
      button.removeAttribute('onclick');
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.handleUnifiedLoadMore();
      });
    }
    
    console.log(`🔘 統一ボタン表示: 残り${hiddenCards}人`);
  } else {
    loadMoreBtn.style.display = 'none';
    console.log('🔘 統一ボタン非表示（全員表示済み）');
  }
}

// フィルター関数との連携
function enhanceFilterIntegration() {
  console.log('🔍 フィルター連携強化');
  
  // 既存のフィルター関数を拡張
  const originalResetFilters = window.resetFilters;
  window.resetFilters = function() {
    console.log('🔄 統合リセット実行');
    
    if (originalResetFilters && typeof originalResetFilters === 'function') {
      originalResetFilters();
    }
    
    // リセット後の処理
    setTimeout(() => {
      fixButtonVisibility();
      updateUnifiedCounter();
    }, 500);
  };
  
  // 検索関数を拡張
  const originalSearchGuides = window.searchGuides;
  window.searchGuides = function() {
    console.log('🔍 統合検索実行');
    
    if (originalSearchGuides && typeof originalSearchGuides === 'function') {
      originalSearchGuides();
    }
    
    // 検索後の処理
    setTimeout(() => {
      fixButtonVisibility();
      updateUnifiedCounter();
    }, 500);
  };
  
  console.log('🔍 フィルター連携強化完了');
}

// 監視システム
function startButtonMonitoring() {
  console.log('👁️ ボタン監視開始');
  
  setInterval(() => {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const container = document.getElementById('guide-cards-container');
    
    if (loadMoreBtn && container) {
      const totalCards = container.querySelectorAll('.col-md-4, .guide-item').length;
      const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length;
      const hiddenCards = totalCards - visibleCards;
      const buttonDisplay = window.getComputedStyle(loadMoreBtn).display;
      
      // 不整合を検出
      if (hiddenCards > 0 && buttonDisplay === 'none') {
        console.log('👁️ ボタン表示不整合検出 - 自動修正');
        fixButtonVisibility();
      }
      
      // クリックハンドラーの確認
      const button = loadMoreBtn.querySelector('button');
      if (button && !button.onclick && !button.addEventListener) {
        console.log('👁️ クリックハンドラー不整合検出 - 自動修正');
        fixButtonClickEvents();
      }
    }
  }, 3000); // 3秒間隔で監視
}

// 初期化実行
setTimeout(() => {
  enhanceFilterIntegration();
  startButtonMonitoring();
}, 2000);

// デバッグ用関数
window.loadMoreDebug = function() {
  console.log('🔘 もっと見るボタンデバッグ情報');
  
  analyzeCurrentButtonState();
  
  console.log('🔧 デバッグ修正実行');
  executeLoadMoreFix();
  
  console.log('🔘 手動もっと見る実行');
  window.handleUnifiedLoadMore();
};

console.log('✅ もっと見るボタン修正システム読み込み完了');
console.log('🔧 デバッグ用: window.loadMoreDebug() を実行してください');