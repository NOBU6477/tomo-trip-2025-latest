/**
 * 高度ページネーションシステム
 * 従来型ページネーションのデメリットを軽減する革新的機能
 */

console.log('🚀 高度ページネーションシステム開始');

class AdvancedPaginationSystem {
  constructor() {
    this.currentPage = 1;
    this.guidesPerPage = 12;
    this.totalGuides = 0;
    this.allGuides = [];
    this.viewHistory = []; // 閲覧履歴
    this.bookmarks = new Set(); // ブックマーク
    this.recentlyViewed = new Set(); // 最近見たガイド
    this.comparisonList = []; // 比較リスト
    this.init();
  }

  init() {
    console.log('🚀 高度ページネーション初期化');
    this.loadData();
    this.setupAdvancedPagination();
    this.setupFloatingToolbar();
    this.setupKeyboardNavigation();
    this.setupInfinitePreview();
  }

  loadData() {
    this.allGuides = window.getDefaultGuides ? window.getDefaultGuides() : [];
    this.totalGuides = this.allGuides.length;
    console.log(`📊 ${this.totalGuides}人のガイドデータ読み込み完了`);
  }

  // 革新的機能1: フローティング比較ツールバー
  setupFloatingToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'floating-toolbar';
    toolbar.className = 'floating-toolbar';
    toolbar.innerHTML = `
      <div class="toolbar-content">
        <div class="toolbar-section">
          <span class="toolbar-label">比較中:</span>
          <span id="comparison-count">0</span>/3人
          <button class="btn btn-sm btn-outline-primary ms-2" onclick="window.advancedPagination.showComparison()" disabled id="compare-btn">
            比較する
          </button>
        </div>
        <div class="toolbar-section">
          <button class="btn btn-sm btn-info" onclick="window.advancedPagination.showBookmarks()">
            <i class="bi bi-bookmark-star"></i> ブックマーク(<span id="bookmark-count">0</span>)
          </button>
        </div>
        <div class="toolbar-section">
          <button class="btn btn-sm btn-secondary" onclick="window.advancedPagination.showHistory()">
            <i class="bi bi-clock-history"></i> 履歴
          </button>
        </div>
        <div class="toolbar-section">
          <select class="form-select form-select-sm" id="quick-jump" onchange="window.advancedPagination.quickJump(this.value)">
            <option value="">ページジャンプ</option>
          </select>
        </div>
      </div>
    `;
    
    document.body.appendChild(toolbar);
    this.updateQuickJump();
    this.addFloatingToolbarStyles();
  }

  addFloatingToolbarStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .floating-toolbar {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid #dee2e6;
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        z-index: 1050;
        max-width: 400px;
        transform: translateY(100px);
        animation: slideUp 0.5s ease-out forwards;
      }
      
      @keyframes slideUp {
        to {
          transform: translateY(0);
        }
      }
      
      .toolbar-content {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        font-size: 0.85rem;
      }
      
      .toolbar-section {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .toolbar-label {
        font-weight: 500;
        color: #6c757d;
      }
      
      .guide-card.bookmarked {
        border: 2px solid #ffc107;
        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
      }
      
      .guide-card.recently-viewed {
        border-left: 4px solid #17a2b8;
      }
      
      .guide-card.in-comparison {
        border: 2px solid #28a745;
        background-color: rgba(40, 167, 69, 0.05);
      }
      
      .mini-preview {
        position: absolute;
        top: -120px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        width: 250px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .mini-preview.show {
        opacity: 1;
      }
      
      @media (max-width: 768px) {
        .floating-toolbar {
          bottom: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
        
        .toolbar-content {
          justify-content: space-between;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 革新的機能2: インテリジェントページネーション
  setupAdvancedPagination() {
    const container = document.getElementById('guide-cards-container');
    const paginationArea = document.getElementById('load-more-btn');
    
    if (!container || !paginationArea) return;

    // 現在のページのガイドを表示
    this.displayCurrentPage();
    
    // 高度なページネーション UI
    this.createAdvancedPaginationUI(paginationArea);
  }

  createAdvancedPaginationUI(container) {
    const totalPages = Math.ceil(this.totalGuides / this.guidesPerPage);
    const startGuide = (this.currentPage - 1) * this.guidesPerPage + 1;
    const endGuide = Math.min(this.currentPage * this.guidesPerPage, this.totalGuides);

    container.innerHTML = `
      <div class="advanced-pagination-container mt-5">
        <!-- ページ情報とクイックアクション -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="d-flex align-items-center">
              <h5 class="mb-0 text-primary">
                ${startGuide}-${endGuide}人目 / 全${this.totalGuides}人
              </h5>
              <div class="progress ms-3" style="width: 200px; height: 8px;">
                <div class="progress-bar bg-primary" style="width: ${(this.currentPage / totalPages) * 100}%"></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-end">
            <div class="btn-group" role="group">
              <button class="btn btn-outline-primary" onclick="window.advancedPagination.showAllInPreview()">
                <i class="bi bi-grid-3x3-gap"></i> 全体プレビュー
              </button>
              <button class="btn btn-outline-success" onclick="window.advancedPagination.randomPage()">
                <i class="bi bi-shuffle"></i> ランダム
              </button>
            </div>
          </div>
        </div>

        <!-- メインページネーション -->
        <div class="pagination-main mb-4">
          <nav aria-label="ガイドページネーション">
            <ul class="pagination pagination-lg justify-content-center">
              ${this.generateAdvancedPageNumbers(totalPages)}
            </ul>
          </nav>
        </div>

        <!-- クイックジャンプとフィルター -->
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">ページ</span>
              <input type="number" class="form-control" id="page-jump-input" 
                     min="1" max="${totalPages}" placeholder="${this.currentPage}">
              <button class="btn btn-primary" onclick="window.advancedPagination.jumpToPage()">
                移動
              </button>
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-select" id="sort-options" onchange="window.advancedPagination.applySorting(this.value)">
              <option value="">並び替え</option>
              <option value="rating-desc">評価が高い順</option>
              <option value="rating-asc">評価が低い順</option>
              <option value="price-asc">料金が安い順</option>
              <option value="price-desc">料金が高い順</option>
              <option value="name-asc">名前順（あいうえお）</option>
            </select>
          </div>
          <div class="col-md-4">
            <button class="btn btn-info w-100" onclick="window.advancedPagination.showPageSummary()">
              <i class="bi bi-info-circle"></i> このページの要約
            </button>
          </div>
        </div>

        <!-- ページプレビュー（前後のページの一部を表示） -->
        <div class="page-preview-section mt-4" id="page-previews">
          ${this.generatePagePreviews(totalPages)}
        </div>
      </div>
    `;
  }

  generateAdvancedPageNumbers(totalPages) {
    let html = '';
    
    // 前へボタン
    html += `
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="window.advancedPagination.goToPage(${this.currentPage - 1})">
          <i class="bi bi-chevron-left"></i> 前へ
        </a>
      </li>
    `;

    // スマートページ番号表示
    const range = this.calculatePageRange(totalPages);
    
    if (range.showFirst) {
      html += `<li class="page-item ${this.currentPage === 1 ? 'active' : ''}">
        <a class="page-link" href="#" onclick="window.advancedPagination.goToPage(1)">1</a>
      </li>`;
      
      if (range.showFirstEllipsis) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    for (let i = range.start; i <= range.end; i++) {
      html += `
        <li class="page-item ${i === this.currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="window.advancedPagination.goToPage(${i})">${i}</a>
        </li>
      `;
    }

    if (range.showLast) {
      if (range.showLastEllipsis) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
      
      html += `<li class="page-item ${this.currentPage === totalPages ? 'active' : ''}">
        <a class="page-link" href="#" onclick="window.advancedPagination.goToPage(${totalPages})">${totalPages}</a>
      </li>`;
    }

    // 次へボタン
    html += `
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="window.advancedPagination.goToPage(${this.currentPage + 1})">
          次へ <i class="bi bi-chevron-right"></i>
        </a>
      </li>
    `;

    return html;
  }

  calculatePageRange(totalPages) {
    const current = this.currentPage;
    const delta = 2;
    
    let start = Math.max(1, current - delta);
    let end = Math.min(totalPages, current + delta);
    
    // 範囲を調整
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }
    
    return {
      start,
      end,
      showFirst: start > 1,
      showLast: end < totalPages,
      showFirstEllipsis: start > 2,
      showLastEllipsis: end < totalPages - 1
    };
  }

  // 革新的機能3: ページプレビュー
  generatePagePreviews(totalPages) {
    let html = '<div class="row">';
    
    // 前のページプレビュー
    if (this.currentPage > 1) {
      const prevPageGuides = this.getPageGuides(this.currentPage - 1);
      html += `
        <div class="col-md-6 mb-3">
          <div class="card border-info">
            <div class="card-header bg-info text-white">
              <h6 class="mb-0">前のページ (${this.currentPage - 1})</h6>
            </div>
            <div class="card-body">
              <div class="row">
                ${prevPageGuides.slice(0, 3).map(guide => `
                  <div class="col-4">
                    <div class="mini-guide-card" onclick="window.advancedPagination.goToPage(${this.currentPage - 1})">
                      <img src="${guide.profileImage}" class="img-fluid rounded" style="height: 60px; width: 60px; object-fit: cover;">
                      <small class="d-block text-center mt-1">${guide.name}</small>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="btn btn-info btn-sm mt-2 w-100" onclick="window.advancedPagination.goToPage(${this.currentPage - 1})">
                前のページへ
              </button>
            </div>
          </div>
        </div>
      `;
    }
    
    // 次のページプレビュー
    if (this.currentPage < totalPages) {
      const nextPageGuides = this.getPageGuides(this.currentPage + 1);
      html += `
        <div class="col-md-6 mb-3">
          <div class="card border-success">
            <div class="card-header bg-success text-white">
              <h6 class="mb-0">次のページ (${this.currentPage + 1})</h6>
            </div>
            <div class="card-body">
              <div class="row">
                ${nextPageGuides.slice(0, 3).map(guide => `
                  <div class="col-4">
                    <div class="mini-guide-card" onclick="window.advancedPagination.goToPage(${this.currentPage + 1})">
                      <img src="${guide.profileImage}" class="img-fluid rounded" style="height: 60px; width: 60px; object-fit: cover;">
                      <small class="d-block text-center mt-1">${guide.name}</small>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="btn btn-success btn-sm mt-2 w-100" onclick="window.advancedPagination.goToPage(${this.currentPage + 1})">
                次のページへ
              </button>
            </div>
          </div>
        </div>
      `;
    }
    
    html += '</div>';
    return html;
  }

  // ページ表示とインタラクション機能
  displayCurrentPage() {
    const container = document.getElementById('guide-cards-container');
    if (!container) return;

    const pageGuides = this.getPageGuides(this.currentPage);
    
    // ページ履歴に追加
    if (!this.viewHistory.includes(this.currentPage)) {
      this.viewHistory.push(this.currentPage);
    }

    // コンテナをクリア
    container.innerHTML = '';
    
    // ガイドカードを生成
    pageGuides.forEach(guide => {
      const guideCard = this.createAdvancedGuideCard(guide);
      container.appendChild(guideCard);
    });

    // スクロール位置を調整
    this.scrollToTop();
  }

  createAdvancedGuideCard(guide) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-4 mb-4 guide-item';
    colDiv.setAttribute('data-guide-id', guide.id);
    
    const isBookmarked = this.bookmarks.has(guide.id);
    const isRecentlyViewed = this.recentlyViewed.has(guide.id);
    const isInComparison = this.comparisonList.some(g => g.id === guide.id);
    
    let cardClass = 'card guide-card h-100';
    if (isBookmarked) cardClass += ' bookmarked';
    if (isRecentlyViewed) cardClass += ' recently-viewed';
    if (isInComparison) cardClass += ' in-comparison';

    colDiv.innerHTML = `
      <div class="${cardClass}">
        <div class="position-relative">
          <img src="${guide.profileImage}" 
               class="card-img-top" alt="${guide.name}" 
               style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-primary">${guide.rating}★</span>
          </div>
          <div class="position-absolute top-0 start-0 m-2">
            <div class="btn-group-vertical">
              <button class="btn btn-sm ${isBookmarked ? 'btn-warning' : 'btn-outline-warning'}" 
                      onclick="window.advancedPagination.toggleBookmark(${guide.id})"
                      title="ブックマーク">
                <i class="bi bi-bookmark${isBookmarked ? '-fill' : ''}"></i>
              </button>
              <button class="btn btn-sm ${isInComparison ? 'btn-success' : 'btn-outline-success'}" 
                      onclick="window.advancedPagination.toggleComparison(${guide.id})"
                      title="比較に追加">
                <i class="bi bi-check2-square"></i>
              </button>
            </div>
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
              <span class="h5 mb-0 text-primary">¥${guide.fee.toLocaleString()}</span>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="window.advancedPagination.viewGuideDetails(${guide.id})">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return colDiv;
  }

  // ユーティリティとインタラクション関数
  getPageGuides(pageNumber) {
    const startIndex = (pageNumber - 1) * this.guidesPerPage;
    const endIndex = startIndex + this.guidesPerPage;
    return this.allGuides.slice(startIndex, endIndex);
  }

  goToPage(pageNumber) {
    const totalPages = Math.ceil(this.totalGuides / this.guidesPerPage);
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    this.currentPage = pageNumber;
    this.displayCurrentPage();
    this.setupAdvancedPagination();
    this.updateFloatingToolbar();
  }

  jumpToPage() {
    const input = document.getElementById('page-jump-input');
    const pageNumber = parseInt(input.value);
    if (pageNumber) {
      this.goToPage(pageNumber);
    }
  }

  randomPage() {
    const totalPages = Math.ceil(this.totalGuides / this.guidesPerPage);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    this.goToPage(randomPage);
  }

  toggleBookmark(guideId) {
    if (this.bookmarks.has(guideId)) {
      this.bookmarks.delete(guideId);
    } else {
      this.bookmarks.add(guideId);
    }
    this.displayCurrentPage();
    this.updateFloatingToolbar();
  }

  toggleComparison(guideId) {
    const guide = this.allGuides.find(g => g.id === guideId);
    const existingIndex = this.comparisonList.findIndex(g => g.id === guideId);
    
    if (existingIndex !== -1) {
      this.comparisonList.splice(existingIndex, 1);
    } else if (this.comparisonList.length < 3) {
      this.comparisonList.push(guide);
    } else {
      alert('比較は最大3人まで選択できます');
      return;
    }
    
    this.displayCurrentPage();
    this.updateFloatingToolbar();
  }

  viewGuideDetails(guideId) {
    this.recentlyViewed.add(guideId);
    this.displayCurrentPage();
    this.updateFloatingToolbar();
    
    // 既存の詳細表示機能を呼び出し
    if (typeof showGuideDetails === 'function') {
      showGuideDetails(guideId);
    }
  }

  updateFloatingToolbar() {
    const comparisonCount = document.getElementById('comparison-count');
    const bookmarkCount = document.getElementById('bookmark-count');
    const compareBtn = document.getElementById('compare-btn');
    
    if (comparisonCount) comparisonCount.textContent = this.comparisonList.length;
    if (bookmarkCount) bookmarkCount.textContent = this.bookmarks.size;
    if (compareBtn) {
      compareBtn.disabled = this.comparisonList.length < 2;
    }
    
    this.updateQuickJump();
  }

  updateQuickJump() {
    const quickJump = document.getElementById('quick-jump');
    if (!quickJump) return;
    
    quickJump.innerHTML = '<option value="">ページジャンプ</option>';
    const totalPages = Math.ceil(this.totalGuides / this.guidesPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i}ページ (${(i-1)*this.guidesPerPage + 1}-${Math.min(i*this.guidesPerPage, this.totalGuides)}人目)`;
      if (i === this.currentPage) option.selected = true;
      quickJump.appendChild(option);
    }
  }

  quickJump(value) {
    if (value) {
      this.goToPage(parseInt(value));
    }
  }

  scrollToTop() {
    const targetElement = document.querySelector('.container h2') || document.querySelector('.container');
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // キーボードナビゲーション
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const totalPages = Math.ceil(this.totalGuides / this.guidesPerPage);
      
      switch(e.key) {
        case 'ArrowLeft':
          if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (this.currentPage < totalPages) {
            this.goToPage(this.currentPage + 1);
          }
          e.preventDefault();
          break;
        case 'Home':
          this.goToPage(1);
          e.preventDefault();
          break;
        case 'End':
          this.goToPage(totalPages);
          e.preventDefault();
          break;
      }
    });
  }

  // 追加機能（モーダル系）
  showComparison() {
    if (this.comparisonList.length < 2) return;
    
    // 比較モーダルの実装
    console.log('比較機能実行:', this.comparisonList);
  }

  showBookmarks() {
    // ブックマークモーダルの実装
    console.log('ブックマーク表示:', Array.from(this.bookmarks));
  }

  showHistory() {
    // 履歴モーダルの実装
    console.log('閲覧履歴:', this.viewHistory);
  }

  showAllInPreview() {
    // 全体プレビューモーダルの実装
    console.log('全体プレビュー表示');
  }

  showPageSummary() {
    // ページ要約モーダルの実装
    const currentGuides = this.getPageGuides(this.currentPage);
    const avgPrice = currentGuides.reduce((sum, g) => sum + g.fee, 0) / currentGuides.length;
    const avgRating = currentGuides.reduce((sum, g) => sum + g.rating, 0) / currentGuides.length;
    
    alert(`このページの要約:\n平均料金: ¥${Math.round(avgPrice).toLocaleString()}\n平均評価: ${avgRating.toFixed(1)}★`);
  }

  setupInfinitePreview() {
    // ホバー時のミニプレビュー機能は既存のままとする
  }

  applySorting(sortType) {
    if (!sortType) return;
    
    const sortedGuides = [...this.allGuides];
    
    switch(sortType) {
      case 'rating-desc':
        sortedGuides.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        sortedGuides.sort((a, b) => a.rating - b.rating);
        break;
      case 'price-asc':
        sortedGuides.sort((a, b) => a.fee - b.fee);
        break;
      case 'price-desc':
        sortedGuides.sort((a, b) => b.fee - a.fee);
        break;
      case 'name-asc':
        sortedGuides.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
        break;
    }
    
    this.allGuides = sortedGuides;
    this.currentPage = 1;
    this.displayCurrentPage();
    this.setupAdvancedPagination();
  }
}

// AdvancedPaginationSystemクラスをグローバルに公開
window.AdvancedPaginationSystem = AdvancedPaginationSystem;

// システム初期化（条件付き）
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 高度ページネーションDOMContentLoaded');
  
  // データが利用可能で、まだ初期化されていない場合のみ初期化
  if (window.getDefaultGuides && window.getDefaultGuides().length > 0 && !window.advancedPagination) {
    console.log('🚀 高度ページネーション自動初期化');
    window.advancedPagination = new AdvancedPaginationSystem();
  }
});

// 即座に実行（DOMが既に読み込み済みの場合）
if (document.readyState !== 'loading') {
  console.log('🚀 高度ページネーション即座実行');
  
  if (window.getDefaultGuides && window.getDefaultGuides().length > 0 && !window.advancedPagination) {
    window.advancedPagination = new AdvancedPaginationSystem();
  }
}

console.log('✅ 高度ページネーションシステム読み込み完了');