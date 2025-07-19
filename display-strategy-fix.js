/**
 * 表示戦略修正システム - ユーザー要望に合わせた表示方式の実装
 * ユーザー確認：24人全員表示 or 12人ずつページング表示
 */

console.log('📋 表示戦略修正システム開始');

// 設定可能な表示モード
const DISPLAY_MODES = {
  ALL_AT_ONCE: 'all_at_once',      // 24人全員を一度に表示
  PAGINATION: 'pagination'         // 12人ずつページング表示
};

// デフォルト設定（ユーザーの要望に応じて変更可能）
let currentDisplayMode = DISPLAY_MODES.PAGINATION; // 現在はページング

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', initializeDisplayStrategy);
window.addEventListener('load', function() {
  setTimeout(initializeDisplayStrategy, 1000);
});

function initializeDisplayStrategy() {
  console.log('🚀 表示戦略システム初期化');
  
  // ユーザー設定の確認（localStorage から取得）
  const savedMode = localStorage.getItem('guideDisplayMode');
  if (savedMode && Object.values(DISPLAY_MODES).includes(savedMode)) {
    currentDisplayMode = savedMode;
    console.log(`📋 保存された表示モード: ${currentDisplayMode}`);
  }
  
  // 表示戦略を適用
  applyDisplayStrategy();
  
  // デバッグ情報を提供
  setTimeout(displayStrategyDebugInfo, 2000);
  
  console.log('✅ 表示戦略システム初期化完了');
}

function applyDisplayStrategy() {
  console.log(`📋 表示戦略適用: ${currentDisplayMode}`);
  
  switch (currentDisplayMode) {
    case DISPLAY_MODES.ALL_AT_ONCE:
      applyAllAtOnceStrategy();
      break;
    
    case DISPLAY_MODES.PAGINATION:
      applyPaginationStrategy();
      break;
    
    default:
      console.log('⚠️ 不明な表示モード - デフォルトのページングを適用');
      applyPaginationStrategy();
      break;
  }
}

function applyAllAtOnceStrategy() {
  console.log('📋 全員一括表示戦略を適用');
  
  try {
    // 全ガイドデータを取得
    const allGuides = getAllGuidesData();
    console.log(`📊 全ガイド取得: ${allGuides.length}人`);
    
    // 全員を一度に表示
    displayAllGuides(allGuides);
    
    // カウンター更新
    updateDisplayCounter(allGuides.length, allGuides.length, false);
    
    // もっと見るボタンを非表示
    hideLoadMoreButton();
    
    console.log(`✅ 全員一括表示完了: ${allGuides.length}人表示`);
    
  } catch (error) {
    console.error('❌ 全員一括表示エラー:', error);
  }
}

function applyPaginationStrategy() {
  console.log('📋 ページング表示戦略を適用');
  
  try {
    // pagination-guide-systemが存在する場合
    if (window.paginationGuideSystem) {
      console.log('🔄 既存pagination-guide-systemを使用');
      
      // 初期ページを表示
      window.paginationGuideSystem.currentPage = 0;
      window.paginationGuideSystem.displayGuidesPage();
      window.paginationGuideSystem.updateCounter();
      window.paginationGuideSystem.updateLoadMoreButton();
      
    } else {
      console.log('🔄 独自ページングシステムを適用');
      applyCustomPagination();
    }
    
    console.log('✅ ページング表示適用完了');
    
  } catch (error) {
    console.error('❌ ページング表示エラー:', error);
  }
}

function applyCustomPagination() {
  const allGuides = getAllGuidesData();
  const guidesPerPage = 12;
  const firstPage = allGuides.slice(0, guidesPerPage);
  
  // 最初の12人を表示
  displayAllGuides(firstPage);
  
  // カウンター更新
  updateDisplayCounter(firstPage.length, allGuides.length, false);
  
  // もっと見るボタンを表示
  if (allGuides.length > guidesPerPage) {
    showLoadMoreButton(allGuides.length - guidesPerPage);
  }
  
  console.log(`📄 カスタムページング: ${firstPage.length}人表示/${allGuides.length}人中`);
}

function getAllGuidesData() {
  let allGuides = [];
  
  // 1. pagination-guide-systemから取得
  if (window.paginationGuideSystem && window.paginationGuideSystem.allGuides) {
    allGuides = [...window.paginationGuideSystem.allGuides];
    console.log(`📊 pagination-guide-systemから${allGuides.length}人取得`);
  }
  
  // 2. getDefaultGuides関数から取得（フォールバック）
  if (allGuides.length === 0 && typeof getDefaultGuides === 'function') {
    allGuides = getDefaultGuides();
    console.log(`📊 getDefaultGuidesから${allGuides.length}人取得`);
  }
  
  // 3. localStorageの新規登録ガイドも追加
  const newGuides = localStorage.getItem('newRegisteredGuides');
  if (newGuides) {
    const additional = JSON.parse(newGuides);
    additional.forEach(guide => {
      if (!allGuides.find(g => g.id === guide.id)) {
        allGuides.push(guide);
      }
    });
    console.log(`📊 新規登録ガイド${additional.length}人を追加`);
  }
  
  return allGuides;
}

function displayAllGuides(guides) {
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.error('❌ guide-cards-container が見つかりません');
    return;
  }
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // 各ガイドのカードを生成・表示
  guides.forEach((guide, index) => {
    const guideCard = createDisplayGuideCard(guide, index);
    container.appendChild(guideCard);
  });
  
  console.log(`🖼️ ガイドカード表示完了: ${guides.length}枚`);
}

function createDisplayGuideCard(guide, index) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-md-4 mb-4 guide-item';
  colDiv.setAttribute('data-guide-id', guide.id);
  colDiv.setAttribute('data-fee', guide.fee || 6000);
  colDiv.id = `display-guide-card-${guide.id}`;
  
  colDiv.innerHTML = `
    <div class="card guide-card h-100">
      <div class="position-relative">
        <img src="${guide.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}" 
             class="card-img-top" alt="${guide.name}" 
             style="height: 200px; object-fit: cover;">
        <div class="position-absolute top-0 end-0 m-2">
          <span class="badge bg-primary">${guide.rating || 4.0}★</span>
        </div>
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${guide.name}</h5>
        <p class="text-muted small mb-2">
          <i class="bi bi-geo-alt-fill"></i> ${guide.location || '未設定'}
        </p>
        <p class="card-text flex-grow-1">${guide.description || 'ガイドの説明がありません'}</p>
        <div class="mb-3">
          <div class="d-flex flex-wrap gap-1">
            ${(guide.languages || ['日本語']).map(lang => 
              `<span class="badge bg-light text-dark">${lang}</span>`
            ).join('')}
          </div>
        </div>
        <div class="mt-auto">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="h5 mb-0 text-primary">¥${(guide.fee || 6000).toLocaleString()}/セッション</span>
          </div>
          <div class="d-grid">
            <button class="btn btn-primary" onclick="showGuideDetails(${guide.id})">詳細を見る</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return colDiv;
}

function updateDisplayCounter(displayedCount, totalCount, isFiltered) {
  let counterText;
  
  if (isFiltered) {
    counterText = `${displayedCount}人のガイドが見つかりました（全${totalCount}人中）`;
  } else {
    if (currentDisplayMode === DISPLAY_MODES.ALL_AT_ONCE) {
      counterText = `${totalCount}人のガイドが見つかりました`;
    } else {
      counterText = `${displayedCount}人のガイドを表示中（全${totalCount}人中）`;
    }
  }
  
  console.log(`📊 表示戦略カウンター更新: "${counterText}"`);
  
  // カウンター要素を更新
  const counterSelectors = [
    '.text-primary.fw-bold.fs-5',
    '.counter-badge',
    '#guides-count',
    '.guide-counter',
    '#guide-counter'
  ];
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
    });
  });
}

function showLoadMoreButton(remainingCount) {
  let loadMoreBtn = document.getElementById('load-more-btn');
  
  if (!loadMoreBtn) {
    // もっと見るボタンを作成
    loadMoreBtn = document.createElement('div');
    loadMoreBtn.id = 'load-more-btn';
    loadMoreBtn.className = 'text-center mt-4';
    
    const container = document.getElementById('guide-cards-container');
    if (container && container.parentNode) {
      container.parentNode.insertBefore(loadMoreBtn, container.nextSibling);
    }
  }
  
  loadMoreBtn.innerHTML = `
    <button class="btn btn-primary btn-lg load-more-button" onclick="loadMoreGuides()">
      もっと見る（残り${remainingCount}人）
    </button>
  `;
  
  loadMoreBtn.style.display = 'block';
  console.log(`🔘 もっと見るボタン表示: 残り${remainingCount}人`);
}

function hideLoadMoreButton() {
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
    console.log('🔘 もっと見るボタン非表示');
  }
}

// もっと見るボタンのクリックハンドラー
window.loadMoreGuides = function() {
  console.log('🔘 もっと見るボタンクリック');
  
  if (window.paginationGuideSystem && typeof window.paginationGuideSystem.loadMoreGuides === 'function') {
    window.paginationGuideSystem.loadMoreGuides();
  } else {
    // カスタム実装での次ページ読み込み
    loadNextPage();
  }
};

function loadNextPage() {
  const allGuides = getAllGuidesData();
  const currentCards = document.querySelectorAll('#guide-cards-container .guide-item').length;
  const guidesPerPage = 12;
  const nextBatch = allGuides.slice(currentCards, currentCards + guidesPerPage);
  
  if (nextBatch.length > 0) {
    const container = document.getElementById('guide-cards-container');
    nextBatch.forEach((guide, index) => {
      const guideCard = createDisplayGuideCard(guide, currentCards + index);
      container.appendChild(guideCard);
    });
    
    const newTotal = currentCards + nextBatch.length;
    updateDisplayCounter(newTotal, allGuides.length, false);
    
    // 残りがあるかチェック
    if (newTotal >= allGuides.length) {
      hideLoadMoreButton();
    } else {
      showLoadMoreButton(allGuides.length - newTotal);
    }
    
    console.log(`📄 次ページ読み込み: ${nextBatch.length}人追加、合計${newTotal}人表示`);
  }
}

// 表示モード変更関数（ユーザーが選択可能）
window.setDisplayMode = function(mode) {
  if (Object.values(DISPLAY_MODES).includes(mode)) {
    currentDisplayMode = mode;
    localStorage.setItem('guideDisplayMode', mode);
    console.log(`📋 表示モード変更: ${mode}`);
    applyDisplayStrategy();
  } else {
    console.error('❌ 無効な表示モード:', mode);
  }
};

function displayStrategyDebugInfo() {
  console.log('📋 表示戦略デバッグ情報');
  
  const allGuides = getAllGuidesData();
  const displayedCards = document.querySelectorAll('#guide-cards-container .guide-item').length;
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  console.log('📊 表示戦略状態:', {
    currentMode: currentDisplayMode,
    totalGuides: allGuides.length,
    displayedCards: displayedCards,
    loadMoreButtonVisible: loadMoreBtn && loadMoreBtn.style.display !== 'none',
    paginationSystemExists: !!window.paginationGuideSystem
  });
  
  console.log('📋 利用可能な表示モード:');
  console.log('- ALL_AT_ONCE: 24人全員を一度に表示');
  console.log('- PAGINATION: 12人ずつページング表示（デフォルト）');
  console.log('💡 変更方法: setDisplayMode("all_at_once") または setDisplayMode("pagination")');
}

// デバッグ用関数をグローバルに公開
window.displayStrategyDebug = function() {
  displayStrategyDebugInfo();
};

console.log('✅ 表示戦略修正システム読み込み完了');
console.log('🔧 デバッグ用: window.displayStrategyDebug() を実行してください');
console.log('⚙️ 表示モード変更: window.setDisplayMode("all_at_once") で全員表示に変更可能');