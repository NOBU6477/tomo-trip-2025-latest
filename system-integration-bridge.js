/**
 * システム統合ブリッジ
 * 既存システムと高度ページネーションの橋渡し
 */

console.log('🌉 システム統合ブリッジ開始');

class SystemIntegrationBridge {
  constructor() {
    this.isAdvancedPaginationActive = false;
    this.fallbackMode = false;
    this.init();
  }

  init() {
    console.log('🌉 システム統合ブリッジ初期化');
    
    // システム間の調整
    this.coordinateSystems();
    
    // 統一インターフェース提供
    this.setupUnifiedInterface();
    
    // フォールバック機能準備
    this.prepareFallbackSystem();
    
    // 監視システム開始
    this.startSystemMonitoring();
  }

  coordinateSystems() {
    console.log('🔗 システム間調整開始');
    
    // 高度ページネーションの利用可能性を確認
    setTimeout(() => {
      if (window.advancedPagination && window.getDefaultGuides) {
        console.log('✅ 高度ページネーション利用可能');
        this.isAdvancedPaginationActive = true;
        this.activateAdvancedMode();
      } else {
        console.log('⚠️ 高度ページネーション未利用可能 - フォールバック');
        this.fallbackMode = true;
        this.activateFallbackMode();
      }
    }, 1000);
  }

  activateAdvancedMode() {
    console.log('🚀 高度モード活性化');
    
    // 既存システムを高度ページネーション対応に切り替え
    this.switchToAdvancedPagination();
    
    // UI更新
    this.updateUIForAdvancedMode();
    
    // 既存機能との統合
    this.integrateExistingFeatures();
  }

  switchToAdvancedPagination() {
    console.log('🔄 高度ページネーション切り替え');
    
    // もっと見るボタンコンテナを高度ページネーション用に更新
    const loadMoreContainer = document.getElementById('load-more-btn');
    if (loadMoreContainer && window.advancedPagination) {
      // 高度ページネーションの初期表示
      window.advancedPagination.setupAdvancedPagination();
      
      console.log('🔄 高度ページネーション切り替え完了');
    }
  }

  updateUIForAdvancedMode() {
    console.log('🎨 高度モードUI更新');
    
    // ガイドカウンターを高度ページネーション対応に更新
    this.updateGuideCounterForPagination();
    
    // ヘッダーに高度ページネーション案内を追加
    this.addAdvancedPaginationIndicator();
    
    // フローティングツールバー確認
    setTimeout(() => {
      this.ensureFloatingToolbar();
    }, 2000);
  }

  updateGuideCounterForPagination() {
    console.log('📊 ページネーション対応カウンター更新');
    
    const totalGuides = window.getDefaultGuides ? window.getDefaultGuides().length : 24;
    const currentPage = window.advancedPagination ? window.advancedPagination.currentPage : 1;
    const guidesPerPage = 12;
    
    const startGuide = (currentPage - 1) * guidesPerPage + 1;
    const endGuide = Math.min(currentPage * guidesPerPage, totalGuides);
    
    const counterText = `${startGuide}-${endGuide}人目を表示中 / 全${totalGuides}人`;
    
    // カウンター要素を更新
    const counterSelectors = [
      '#guides-count',
      '.guide-counter',
      '.text-primary.fw-bold.fs-5'
    ];
    
    counterSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.innerHTML = `
          <i class="bi bi-grid-3x3-gap me-2"></i>${counterText}
          <small class="text-muted ms-2">(ページネーション表示)</small>
        `;
      });
    });
    
    console.log(`📊 ページネーション対応カウンター: "${counterText}"`);
  }

  addAdvancedPaginationIndicator() {
    console.log('🏷️ 高度ページネーション指標追加');
    
    // ヘッダーに高度ページネーション稼働中の表示を追加
    const headerContainer = document.querySelector('.container h2');
    if (headerContainer && !document.getElementById('pagination-indicator')) {
      const indicator = document.createElement('div');
      indicator.id = 'pagination-indicator';
      indicator.className = 'alert alert-success d-flex align-items-center mt-3';
      indicator.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        <div>
          <strong>高度ページネーション稼働中</strong>
          <small class="d-block text-muted">
            ブックマーク、比較機能、キーボードナビゲーション(←→)が利用できます
          </small>
        </div>
        <button class="btn btn-sm btn-outline-success ms-auto" onclick="window.systemBridge.showAdvancedFeatures()">
          機能一覧
        </button>
      `;
      
      headerContainer.parentNode.insertBefore(indicator, headerContainer.nextSibling);
    }
  }

  ensureFloatingToolbar() {
    console.log('🛠️ フローティングツールバー確認');
    
    const toolbar = document.getElementById('floating-toolbar');
    if (!toolbar && window.advancedPagination) {
      // フローティングツールバーが作成されていない場合は強制作成
      window.advancedPagination.setupFloatingToolbar();
      console.log('🛠️ フローティングツールバー強制作成');
    } else if (toolbar) {
      // 既存ツールバーの表示確認
      toolbar.style.display = 'block';
      console.log('🛠️ フローティングツールバー表示確認');
    }
  }

  integrateExistingFeatures() {
    console.log('🔗 既存機能統合');
    
    // リセットボタンとの統合
    this.integrateResetFunction();
    
    // フィルターシステムとの統合
    this.integrateFilterSystem();
    
    // 検索機能との統合
    this.integrateSearchFunction();
  }

  integrateResetFunction() {
    console.log('🔄 リセット機能統合');
    
    const originalReset = window.resetFilters;
    
    window.resetFilters = function() {
      console.log('🔄 統合リセット機能実行');
      
      // 元のリセット実行
      if (originalReset && typeof originalReset === 'function') {
        originalReset();
      }
      
      // 高度ページネーション対応リセット
      setTimeout(() => {
        if (window.advancedPagination) {
          // 1ページ目に戻る
          window.advancedPagination.currentPage = 1;
          
          // データ再読み込み
          window.advancedPagination.loadData();
          
          // 表示更新
          window.advancedPagination.displayCurrentPage();
          window.advancedPagination.setupAdvancedPagination();
          
          // カウンター更新
          window.systemBridge.updateGuideCounterForPagination();
        }
      }, 1000);
    };
  }

  integrateFilterSystem() {
    console.log('🔍 フィルターシステム統合');
    
    // フィルター適用時の高度ページネーション対応
    if (window.unifiedFilterSystem) {
      const originalApplyFilters = window.unifiedFilterSystem.applyFilters;
      
      if (originalApplyFilters) {
        window.unifiedFilterSystem.applyFilters = function() {
          console.log('🔍 統合フィルター適用');
          
          // 元のフィルター実行
          originalApplyFilters.call(this);
          
          // 高度ページネーションでフィルター結果対応
          setTimeout(() => {
            if (window.advancedPagination) {
              // フィルター結果をページネーションに反映
              window.advancedPagination.currentPage = 1;
              window.advancedPagination.loadData();
              window.advancedPagination.displayCurrentPage();
              window.advancedPagination.setupAdvancedPagination();
              window.systemBridge.updateGuideCounterForPagination();
            }
          }, 500);
        };
      }
    }
  }

  integrateSearchFunction() {
    console.log('🔍 検索機能統合');
    
    // 検索実行時の高度ページネーション対応
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="検索"]');
    
    searchInputs.forEach(input => {
      input.addEventListener('input', debounce(() => {
        if (window.advancedPagination) {
          // 検索結果に基づいてページネーションを更新
          setTimeout(() => {
            window.advancedPagination.currentPage = 1;
            window.advancedPagination.displayCurrentPage();
            window.advancedPagination.setupAdvancedPagination();
            window.systemBridge.updateGuideCounterForPagination();
          }, 300);
        }
      }, 300));
    });
  }

  activateFallbackMode() {
    console.log('⚠️ フォールバックモード活性化');
    
    // 既存システムの安定化
    this.stabilizeExistingSystems();
    
    // フォールバック用UI更新
    this.updateUIForFallbackMode();
  }

  stabilizeExistingSystems() {
    console.log('🔧 既存システム安定化');
    
    // 既存のもっと見るボタンシステムを安定化
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML = `
        <div class="text-center mt-4">
          <button class="btn btn-primary btn-lg" onclick="window.systemBridge.fallbackLoadMore()">
            もっと見る
          </button>
          <div class="mt-2 text-muted">
            <i class="bi bi-info-circle"></i> 標準表示モード
          </div>
        </div>
      `;
    }
  }

  updateUIForFallbackMode() {
    console.log('🎨 フォールバックモードUI更新');
    
    // フォールバックモードの表示
    const headerContainer = document.querySelector('.container h2');
    if (headerContainer && !document.getElementById('fallback-indicator')) {
      const indicator = document.createElement('div');
      indicator.id = 'fallback-indicator';
      indicator.className = 'alert alert-warning d-flex align-items-center mt-3';
      indicator.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>
        <div>
          <strong>標準表示モード</strong>
          <small class="d-block text-muted">
            通常のもっと見る表示で動作中です
          </small>
        </div>
      `;
      
      headerContainer.parentNode.insertBefore(indicator, headerContainer.nextSibling);
    }
  }

  fallbackLoadMore() {
    console.log('⚠️ フォールバック ロードモア実行');
    
    // 基本的なロードモア機能
    const container = document.getElementById('guide-cards-container');
    const hiddenCards = container.querySelectorAll('.guide-item[style*="display: none"]');
    
    const cardsToShow = Math.min(12, hiddenCards.length);
    for (let i = 0; i < cardsToShow; i++) {
      hiddenCards[i].style.display = 'block';
    }
    
    // ボタン状態を更新
    const remainingCards = hiddenCards.length - cardsToShow;
    if (remainingCards > 0) {
      const loadMoreBtn = document.getElementById('load-more-btn');
      loadMoreBtn.innerHTML = `
        <div class="text-center mt-4">
          <button class="btn btn-primary btn-lg" onclick="window.systemBridge.fallbackLoadMore()">
            もっと見る（残り${remainingCards}人）
          </button>
        </div>
      `;
    } else {
      this.showCompletionMessage();
    }
  }

  showCompletionMessage() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.innerHTML = `
      <div class="text-center mt-4">
        <div class="alert alert-success">
          <i class="bi bi-check-circle-fill me-2"></i>
          全てのガイドを表示しました
        </div>
      </div>
    `;
  }

  startSystemMonitoring() {
    console.log('👁️ システム監視開始');
    
    // 5秒間隔でシステム状態を監視
    setInterval(() => {
      this.monitorSystemHealth();
    }, 5000);
  }

  monitorSystemHealth() {
    // 高度ページネーションの状態確認
    if (!this.isAdvancedPaginationActive && window.advancedPagination && !this.fallbackMode) {
      console.log('🔄 高度ページネーション復旧検出');
      this.isAdvancedPaginationActive = true;
      this.activateAdvancedMode();
    }
    
    // フローティングツールバーの表示確認
    if (this.isAdvancedPaginationActive) {
      const toolbar = document.getElementById('floating-toolbar');
      if (toolbar && toolbar.style.display === 'none') {
        toolbar.style.display = 'block';
      }
    }
  }

  // ユーザー向け機能
  showAdvancedFeatures() {
    alert(`高度ページネーション機能一覧:

🔖 ブックマーク: ガイドカード左上の星アイコン
🔍 比較機能: ガイドカード左上のチェックアイコン（最大3人）
⌨️ キーボード: ←→ でページ移動、Home/End で最初/最後
🎯 クイックジャンプ: ページ番号入力で直接移動
📊 並び替え: 評価順、料金順、名前順
🎲 ランダム: ランダムページ機能
📈 進捗表示: 現在位置と進捗バーの表示

画面右下のフローティングツールバーから各機能にアクセスできます。`);
  }

  // デバッグ機能
  getSystemStatus() {
    return {
      isAdvancedPaginationActive: this.isAdvancedPaginationActive,
      fallbackMode: this.fallbackMode,
      advancedPaginationExists: !!window.advancedPagination,
      dataAvailable: !!(window.getDefaultGuides && window.getDefaultGuides().length > 0),
      floatingToolbarExists: !!document.getElementById('floating-toolbar'),
      currentMode: this.isAdvancedPaginationActive ? 'Advanced' : (this.fallbackMode ? 'Fallback' : 'Initializing')
    };
  }
}

// デバウンス関数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// システム初期化
document.addEventListener('DOMContentLoaded', function() {
  window.systemBridge = new SystemIntegrationBridge();
});

if (document.readyState !== 'loading') {
  window.systemBridge = new SystemIntegrationBridge();
}

console.log('✅ システム統合ブリッジ読み込み完了');