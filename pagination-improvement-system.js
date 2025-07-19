/**
 * ページネーション改善システム
 * スケーラブルなガイド表示のための複数ソリューション
 */

console.log('📄 ページネーション改善システム開始');

class PaginationImprovementSystem {
  constructor() {
    this.currentPage = 1;
    this.guidesPerPage = 12;
    this.totalGuides = 0;
    this.allGuides = [];
    this.init();
  }

  init() {
    console.log('📄 ページネーション改善システム初期化');
    this.setupImprovedPagination();
    this.setupScrollToTopAfterLoad();
  }

  // ソリューション1: 従来型ページネーション（1, 2, 3...）
  setupTraditionalPagination() {
    console.log('📄 従来型ページネーション設定');
    
    const container = document.getElementById('guide-cards-container');
    const paginationArea = document.getElementById('load-more-btn');
    
    if (!container || !paginationArea) return;

    this.allGuides = window.getDefaultGuides ? window.getDefaultGuides() : [];
    this.totalGuides = this.allGuides.length;
    const totalPages = Math.ceil(this.totalGuides / this.guidesPerPage);

    // ページネーションボタンを生成
    paginationArea.innerHTML = `
      <div class="d-flex justify-content-center mt-4">
        <nav aria-label="ガイドページネーション">
          <ul class="pagination pagination-lg">
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="window.paginationSystem.goToPage(${this.currentPage - 1})">&laquo; 前へ</a>
            </li>
            ${this.generatePageNumbers(totalPages)}
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="window.paginationSystem.goToPage(${this.currentPage + 1})">次へ &raquo;</a>
            </li>
          </ul>
        </nav>
      </div>
    `;
  }

  generatePageNumbers(totalPages) {
    let pageNumbers = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers += `
        <li class="page-item ${i === this.currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="window.paginationSystem.goToPage(${i})">${i}</a>
        </li>
      `;
    }

    return pageNumbers;
  }

  // ソリューション2: 改良型「もっと見る」（古いカードを置換）
  setupReplacementPagination() {
    console.log('📄 置換型ページネーション設定');
    
    const paginationArea = document.getElementById('load-more-btn');
    if (!paginationArea) return;

    this.allGuides = window.getDefaultGuides ? window.getDefaultGuides() : [];
    this.totalGuides = this.allGuides.length;
    const remainingGuides = Math.max(0, this.totalGuides - (this.currentPage * this.guidesPerPage));

    if (remainingGuides > 0) {
      paginationArea.innerHTML = `
        <div class="text-center mt-4">
          <button class="btn btn-primary btn-lg" onclick="window.paginationSystem.loadNextPageReplacement()">
            次の12人を表示（残り${remainingGuides}人）
          </button>
          <div class="mt-2 text-muted">
            現在 ${(this.currentPage - 1) * this.guidesPerPage + 1}-${Math.min(this.currentPage * this.guidesPerPage, this.totalGuides)} / 全${this.totalGuides}人
          </div>
        </div>
      `;
    } else {
      paginationArea.innerHTML = `
        <div class="text-center mt-4">
          <div class="alert alert-info">
            全${this.totalGuides}人のガイドを表示中
          </div>
          <button class="btn btn-outline-primary" onclick="window.paginationSystem.goToPage(1)">
            最初のページに戻る
          </button>
        </div>
      `;
    }
  }

  // ソリューション3: スマートロード（最適表示数調整）
  setupSmartPagination() {
    console.log('📄 スマートページネーション設定');
    
    const screenHeight = window.innerHeight;
    const cardHeight = 400; // 推定カードの高さ
    const optimalCards = Math.max(6, Math.min(18, Math.floor(screenHeight / cardHeight * 3)));
    
    this.guidesPerPage = optimalCards;
    console.log(`📄 画面サイズに基づく最適表示数: ${optimalCards}人`);
    
    this.setupReplacementPagination();
  }

  // 現在の改良実装：スクロール位置保持 + スムーズアニメーション
  setupImprovedPagination() {
    console.log('📄 改良ページネーション設定');
    
    const paginationArea = document.getElementById('load-more-btn');
    if (!paginationArea) return;

    this.allGuides = window.getDefaultGuides ? window.getDefaultGuides() : [];
    this.totalGuides = this.allGuides.length;
    const currentlyShown = document.querySelectorAll('.guide-item:not([style*="display: none"])').length;
    const remainingGuides = Math.max(0, this.totalGuides - currentlyShown);

    if (remainingGuides > 0) {
      paginationArea.innerHTML = `
        <div class="text-center mt-5 mb-4">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <div class="card border-0 bg-light">
                <div class="card-body py-4">
                  <h5 class="card-title text-primary mb-3">
                    <i class="bi bi-plus-circle-fill me-2"></i>さらにガイドを見る
                  </h5>
                  <p class="text-muted mb-3">
                    現在${currentlyShown}人表示中 / 全${this.totalGuides}人のガイドが登録されています
                  </p>
                  <button class="btn btn-primary btn-lg px-5" onclick="window.paginationSystem.smartLoadMore()" id="smart-load-more-btn">
                    次の${Math.min(12, remainingGuides)}人を表示
                  </button>
                  <div class="mt-3">
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar bg-primary" role="progressbar" 
                           style="width: ${(currentlyShown / this.totalGuides) * 100}%"></div>
                    </div>
                    <small class="text-muted">進捗: ${Math.round((currentlyShown / this.totalGuides) * 100)}%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      this.showCompletionMessage(currentlyShown);
    }
  }

  smartLoadMore() {
    console.log('📄 スマートロードモア実行');
    
    const container = document.getElementById('guide-cards-container');
    if (!container) return;

    // 現在表示中のカード数を取得
    const currentlyVisible = container.querySelectorAll('.guide-item:not([style*="display: none"])').length;
    const nextBatch = Math.min(12, this.totalGuides - currentlyVisible);

    // ローディングアニメーション表示
    this.showLoadingAnimation();

    setTimeout(() => {
      // 次のバッチを表示
      const hiddenCards = container.querySelectorAll('.guide-item[style*="display: none"]');
      for (let i = 0; i < nextBatch && i < hiddenCards.length; i++) {
        hiddenCards[i].style.display = 'block';
        hiddenCards[i].classList.add('fade-in-animation');
      }

      // ページネーション更新
      this.setupImprovedPagination();
      
      // スムーズスクロール（新しく表示されたカードの最初に）
      if (hiddenCards.length > 0) {
        setTimeout(() => {
          hiddenCards[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      }

    }, 800); // ローディング時間
  }

  showLoadingAnimation() {
    const loadBtn = document.getElementById('smart-load-more-btn');
    if (loadBtn) {
      loadBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>読み込み中...';
      loadBtn.disabled = true;
    }
  }

  showCompletionMessage(totalShown) {
    const paginationArea = document.getElementById('load-more-btn');
    if (!paginationArea) return;

    paginationArea.innerHTML = `
      <div class="text-center mt-5 mb-4">
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="card border-0 bg-success text-white">
              <div class="card-body py-4">
                <h5 class="card-title mb-3">
                  <i class="bi bi-check-circle-fill me-2"></i>全ガイド表示完了
                </h5>
                <p class="mb-3">
                  ${totalShown}人すべてのガイドを表示しました
                </p>
                <div class="d-flex gap-2 justify-content-center flex-wrap">
                  <button class="btn btn-light" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <i class="bi bi-arrow-up me-2"></i>トップに戻る
                  </button>
                  <button class="btn btn-outline-light" onclick="window.paginationSystem.resetToFirstPage()">
                    <i class="bi bi-arrow-clockwise me-2"></i>最初から見る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ユーティリティ関数
  goToPage(pageNumber) {
    this.currentPage = pageNumber;
    this.displayPage(pageNumber);
    this.setupTraditionalPagination();
  }

  displayPage(pageNumber) {
    const container = document.getElementById('guide-cards-container');
    if (!container) return;

    const startIndex = (pageNumber - 1) * this.guidesPerPage;
    const endIndex = startIndex + this.guidesPerPage;
    const guidesToShow = this.allGuides.slice(startIndex, endIndex);

    // コンテナをクリア
    container.innerHTML = '';
    
    // 指定ページのガイドを表示
    guidesToShow.forEach(guide => {
      const guideCard = this.createGuideCard(guide);
      container.appendChild(guideCard);
    });

    // トップにスクロール
    document.querySelector('.container h2').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  resetToFirstPage() {
    this.currentPage = 1;
    // すべてのカードを非表示にして、最初の12人だけ表示
    const container = document.getElementById('guide-cards-container');
    if (!container) return;

    const allCards = container.querySelectorAll('.guide-item');
    allCards.forEach((card, index) => {
      if (index < 12) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    this.setupImprovedPagination();
    
    // トップにスクロール
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  loadNextPageReplacement() {
    this.currentPage++;
    this.displayPage(this.currentPage);
    this.setupReplacementPagination();
  }

  createGuideCard(guide) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-4 mb-4 guide-item';
    colDiv.setAttribute('data-guide-id', guide.id);
    colDiv.setAttribute('data-fee', guide.fee);
    
    colDiv.innerHTML = `
      <div class="card guide-card h-100">
        <div class="position-relative">
          <img src="${guide.profileImage}" 
               class="card-img-top" alt="${guide.name}" 
               style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-primary">${guide.rating}★</span>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${guide.name}</h5>
          <p class="text-muted small mb-2">
            <i class="bi bi-geo-alt-fill"></i> ${guide.location}
          </p>
          <p class="card-text flex-grow-1">${guide.description}</p>
          <div class="mb-3">
            <div class="d-flex flex-wrap gap-1">
              ${guide.languages.map(lang => 
                `<span class="badge bg-light text-dark">${lang}</span>`
              ).join('')}
            </div>
          </div>
          <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="h5 mb-0 text-primary">¥${guide.fee.toLocaleString()}/セッション</span>
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

  setupScrollToTopAfterLoad() {
    // CSSアニメーション追加
    const style = document.createElement('style');
    style.textContent = `
      .fade-in-animation {
        animation: fadeInUp 0.6s ease-out;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .spin {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// システム初期化
document.addEventListener('DOMContentLoaded', function() {
  window.paginationSystem = new PaginationImprovementSystem();
});

// 即座に実行
if (document.readyState !== 'loading') {
  window.paginationSystem = new PaginationImprovementSystem();
}

console.log('✅ ページネーション改善システム読み込み完了');