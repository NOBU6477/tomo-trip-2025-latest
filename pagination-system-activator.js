/**
 * ページネーションシステム活性化
 * 既存システムから高度ページネーションへの移行管理
 */

console.log('🚀 ページネーションシステム活性化開始');

// 即座に実行
(function() {
  console.log('⚡ 高度ページネーション活性化');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activatePaginationSystem);
  } else {
    activatePaginationSystem();
  }
  
  // 遅延実行で確実に活性化
  setTimeout(activatePaginationSystem, 2000);
})();

function activatePaginationSystem() {
  console.log('🚀 ページネーション活性化実行');
  
  try {
    // 1. 既存のもっと見るボタンを無効化
    disableOldLoadMoreSystem();
    
    // 2. 高度ページネーションシステム初期化
    initializeAdvancedPagination();
    
    // 3. システム統合
    integrateWithExistingSystems();
    
    // 4. UI更新
    updateUIForPagination();
    
    console.log('✅ ページネーション活性化完了');
    
  } catch (error) {
    console.error('❌ ページネーション活性化エラー:', error);
  }
}

function disableOldLoadMoreSystem() {
  console.log('🔄 既存ロードモアシステム無効化');
  
  // 既存のもっと見るボタンを高度ページネーション案内に変更
  const loadMoreContainer = document.getElementById('load-more-btn');
  if (loadMoreContainer) {
    loadMoreContainer.innerHTML = `
      <div class="text-center mb-4">
        <div class="card border-primary">
          <div class="card-body py-4">
            <h5 class="card-title text-primary mb-3">
              <i class="bi bi-rocket-takeoff-fill me-2"></i>高度ページネーションシステム
            </h5>
            <p class="text-muted mb-3">
              より使いやすいページネーション機能に切り替わりました
            </p>
            <button class="btn btn-primary btn-lg" onclick="window.activatePaginationSystem()">
              ページネーション表示を開始
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  console.log('🔄 既存システム無効化完了');
}

function initializeAdvancedPagination() {
  console.log('🚀 高度ページネーション初期化');
  
  // 高度ページネーションシステムが未初期化の場合は初期化
  if (!window.advancedPagination && window.AdvancedPaginationSystem) {
    window.advancedPagination = new window.AdvancedPaginationSystem();
    console.log('🚀 高度ページネーションシステム新規作成');
  }
  
  // データ整合性確認
  if (window.advancedPagination) {
    window.advancedPagination.loadData();
    console.log('📊 高度ページネーション データ読み込み完了');
  }
}

function integrateWithExistingSystems() {
  console.log('🔗 既存システム統合');
  
  // リセット機能との統合
  if (window.resetFilters) {
    const originalReset = window.resetFilters;
    
    window.resetFilters = function() {
      console.log('🔄 統合リセット実行');
      
      // 元のリセット実行
      if (originalReset && typeof originalReset === 'function') {
        originalReset();
      }
      
      // 高度ページネーションリセット
      setTimeout(() => {
        if (window.advancedPagination) {
          window.advancedPagination.currentPage = 1;
          window.advancedPagination.displayCurrentPage();
          window.advancedPagination.setupAdvancedPagination();
        }
      }, 1000);
    };
  }
  
  // フィルターシステムとの統合
  if (window.unifiedFilterSystem) {
    const originalFilter = window.unifiedFilterSystem.applyFilters;
    
    if (originalFilter) {
      window.unifiedFilterSystem.applyFilters = function() {
        console.log('🔍 統合フィルター実行');
        
        // 元のフィルター実行
        originalFilter.call(this);
        
        // 高度ページネーションでフィルター結果を表示
        setTimeout(() => {
          if (window.advancedPagination) {
            window.advancedPagination.loadData(); // フィルター結果を反映
            window.advancedPagination.currentPage = 1;
            window.advancedPagination.displayCurrentPage();
            window.advancedPagination.setupAdvancedPagination();
          }
        }, 500);
      };
    }
  }
  
  console.log('🔗 システム統合完了');
}

function updateUIForPagination() {
  console.log('🎨 UI更新実行');
  
  // ガイドカウンター更新
  updateGuideCounter();
  
  // フローティングツールバー表示確認
  setTimeout(() => {
    const toolbar = document.getElementById('floating-toolbar');
    if (toolbar) {
      toolbar.style.display = 'block';
      console.log('🛠️ フローティングツールバー表示');
    }
  }, 1000);
  
  // ページネーション領域のスタイル調整
  const paginationArea = document.getElementById('load-more-btn');
  if (paginationArea) {
    paginationArea.classList.add('advanced-pagination-area');
  }
  
  console.log('🎨 UI更新完了');
}

function updateGuideCounter() {
  console.log('📊 ガイドカウンター更新');
  
  const totalGuides = window.getDefaultGuides ? window.getDefaultGuides().length : 24;
  const counterText = `${totalGuides}人のガイドが登録されています`;
  
  // 複数のセレクターでカウンター要素を更新
  const counterSelectors = [
    '#guides-count',
    '.guide-counter',
    '.text-primary.fw-bold.fs-5',
    '[class*="counter"]'
  ];
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
    });
  });
  
  console.log(`📊 カウンター更新完了: "${counterText}"`);
}

// グローバル関数として活性化関数を提供
window.activatePaginationSystem = function() {
  console.log('🚀 手動ページネーション活性化');
  
  if (window.advancedPagination) {
    // 既に初期化済みの場合は表示のみ更新
    window.advancedPagination.displayCurrentPage();
    window.advancedPagination.setupAdvancedPagination();
  } else {
    // 未初期化の場合は完全初期化
    activatePaginationSystem();
  }
};

// 高度ページネーション強制切り替え関数
window.forceAdvancedPagination = function() {
  console.log('💪 強制高度ページネーション切り替え');
  
  // すべての既存システムを無効化
  if (window.emergencyPaginationSystem) {
    window.emergencyPaginationSystem.disabled = true;
  }
  
  // 既存のもっと見るボタンイベントを無効化
  const loadMoreBtns = document.querySelectorAll('[onclick*="loadMore"], [onclick*="handleUnified"]');
  loadMoreBtns.forEach(btn => {
    btn.onclick = () => window.activatePaginationSystem();
  });
  
  // 高度ページネーション強制実行
  activatePaginationSystem();
  
  console.log('💪 強制切り替え完了');
};

// デバッグ用情報表示
window.paginationSystemDebug = function() {
  console.log('🔧 ページネーションシステムデバッグ情報');
  
  const info = {
    advancedPagination: !!window.advancedPagination,
    totalGuides: window.getDefaultGuides ? window.getDefaultGuides().length : 0,
    currentPage: window.advancedPagination ? window.advancedPagination.currentPage : 'N/A',
    floatingToolbar: !!document.getElementById('floating-toolbar'),
    loadMoreContainer: !!document.getElementById('load-more-btn')
  };
  
  console.table(info);
  
  return info;
};

console.log('✅ ページネーションシステム活性化システム読み込み完了');
console.log('🔧 デバッグ用: window.paginationSystemDebug() を実行してください');