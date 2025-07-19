/**
 * モバイル対応ページング機能修正スクリプト
 * 携帯デバイスでのページング表示とボタン動作を最適化
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 モバイル対応ページング機能初期化');
  
  // モバイルデバイス判定
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 768;
  
  if (isMobile || isSmallScreen) {
    console.log('📱 モバイルデバイス検出 - ページング機能を最適化');
    
    // モバイル用CSS追加
    addMobilePaginationStyles();
    
    // タッチ操作対応
    setupMobileTouchEvents();
    
    // レスポンシブ表示調整
    adjustMobileDisplay();
    
    // スクロール最適化
    optimizeMobileScrolling();
  }
  
  // 画面サイズ変更時の再調整
  window.addEventListener('resize', function() {
    const newIsSmall = window.innerWidth <= 768;
    if (newIsSmall !== isSmallScreen) {
      setTimeout(() => {
        adjustMobileDisplay();
      }, 300);
    }
  });
});

function addMobilePaginationStyles() {
  const style = document.createElement('style');
  style.id = 'mobile-pagination-styles';
  style.textContent = `
    /* モバイル用ページング機能スタイル */
    @media (max-width: 768px) {
      /* ガイドカードの調整 */
      .guide-card {
        margin-bottom: 1rem !important;
      }
      
      .guide-item, .col-md-4, .col-lg-4 {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
      }
      
      /* もっと見るボタンのモバイル最適化 */
      .load-more-button {
        width: 100% !important;
        padding: 12px 24px !important;
        font-size: 1.1rem !important;
        border-radius: 25px !important;
        box-shadow: 0 4px 15px rgba(0,123,255,0.3) !important;
        margin: 20px 0 !important;
      }
      
      .load-more-button:active {
        transform: scale(0.98) !important;
        box-shadow: 0 2px 8px rgba(0,123,255,0.4) !important;
      }
      
      /* カウンター表示の調整 */
      .counter-badge {
        font-size: 0.9rem !important;
        padding: 8px 16px !important;
        border-radius: 20px !important;
      }
      
      /* ガイドカード内容の最適化 */
      .guide-card .card-body {
        padding: 1rem !important;
      }
      
      .guide-card .card-title {
        font-size: 1.1rem !important;
        margin-bottom: 0.5rem !important;
      }
      
      .guide-card .card-text {
        font-size: 0.9rem !important;
        line-height: 1.4 !important;
      }
      
      .guide-card .price-badge {
        font-size: 1rem !important;
        font-weight: 600 !important;
      }
      
      /* バッジの調整 */
      .guide-card .badge {
        font-size: 0.75rem !important;
        padding: 0.25rem 0.5rem !important;
        margin: 0.1rem !important;
      }
      
      /* ボタンの調整 */
      .guide-card .btn-sm {
        font-size: 0.8rem !important;
        padding: 0.375rem 0.75rem !important;
      }
    }
    
    /* タッチデバイス用のホバー効果無効化 */
    @media (hover: none) {
      .load-more-button:hover {
        background-color: #007bff !important;
        transform: none !important;
      }
      
      .guide-card:hover {
        transform: none !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
      }
    }
    
    /* フィルター表示の調整 */
    @media (max-width: 768px) {
      .filter-section {
        padding: 1rem 0.5rem !important;
      }
      
      .filter-section .form-control,
      .filter-section .form-select {
        margin-bottom: 0.75rem !important;
      }
    }
  `;
  document.head.appendChild(style);
  console.log('📱 モバイル用CSSスタイルを追加');
}

function setupMobileTouchEvents() {
  // もっと見るボタンのタッチ対応
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('load-more-button')) {
      e.preventDefault();
      
      // ボタンを一時的に無効化（重複クリック防止）
      e.target.disabled = true;
      e.target.textContent = window.location.pathname.includes('index-en.html') ? 'Loading...' : '読み込み中...';
      
      // 0.5秒後にページング機能を実行
      setTimeout(() => {
        if (window.paginationGuideSystem) {
          window.paginationGuideSystem.loadMoreGuides();
        }
        
        // ボタンを再有効化
        setTimeout(() => {
          e.target.disabled = false;
        }, 500);
      }, 500);
    }
  });
  
  console.log('📱 モバイルタッチイベントを設定');
}

function adjustMobileDisplay() {
  // ガイドカードコンテナーの調整
  const container = document.getElementById('guide-cards-container');
  if (container && window.innerWidth <= 768) {
    container.classList.add('mobile-optimized');
    
    // 既存のガイドカードをモバイル用に調整
    const guideItems = container.querySelectorAll('.col-md-4, .col-lg-4, .guide-item');
    guideItems.forEach(item => {
      item.classList.add('col-12');
      item.style.marginBottom = '1rem';
    });
  }
  
  // カウンター表示の調整
  const counterBadges = document.querySelectorAll('.counter-badge');
  counterBadges.forEach(badge => {
    if (window.innerWidth <= 768) {
      badge.style.fontSize = '0.9rem';
      badge.style.padding = '8px 16px';
    }
  });
  
  console.log('📱 モバイル表示を調整');
}

function optimizeMobileScrolling() {
  let isLoading = false;
  
  // 無限スクロール（オプション）
  window.addEventListener('scroll', function() {
    if (isLoading || window.innerWidth > 768) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;
    const threshold = documentHeight - 200; // 200px手前でトリガー
    
    if (scrollPosition >= threshold) {
      const loadMoreBtn = document.querySelector('.load-more-button');
      if (loadMoreBtn && loadMoreBtn.style.display !== 'none' && !loadMoreBtn.disabled) {
        isLoading = true;
        
        // 自動でもっと見る機能を実行
        if (window.paginationGuideSystem && window.paginationGuideSystem.hasMoreGuides()) {
          console.log('📱 モバイル無限スクロール: 次のページを読み込み');
          window.paginationGuideSystem.loadMoreGuides();
          
          setTimeout(() => {
            isLoading = false;
          }, 2000);
        } else {
          isLoading = false;
        }
      }
    }
  });
  
  console.log('📱 モバイル無限スクロールを設定');
}

// ページング機能との連携
window.addEventListener('paginationUpdated', function(event) {
  if (window.innerWidth <= 768) {
    console.log('📱 ページング更新 - モバイル表示を再調整');
    setTimeout(() => {
      adjustMobileDisplay();
    }, 100);
  }
});

// ページングシステムがロードされた後の初期化
window.addEventListener('load', function() {
  setTimeout(() => {
    if (window.paginationGuideSystem && (window.innerWidth <= 768 || /Mobile|Android|iPhone/i.test(navigator.userAgent))) {
      console.log('📱 ページングシステムとモバイル機能の連携完了');
      adjustMobileDisplay();
    }
  }, 1500);
});