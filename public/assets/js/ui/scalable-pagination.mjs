// スケーラブルなペジネーションシステム
// Scalable pagination system for growing guide numbers

export class ScalablePagination {
    constructor(options = {}) {
        this.itemsPerPage = options.itemsPerPage || 12; // 3列x4行のグリッド
        this.currentPage = 1;
        this.totalItems = 0;
        this.totalPages = 0;
        this.maxVisiblePages = options.maxVisiblePages || 5;
        this.container = options.container || '#paginationContainer';
        this.loadingCallback = options.onPageLoad || null;
        this.data = [];
        this.filteredData = [];
        
        // モバイルでは表示数を調整
        if (window.innerWidth < 768) {
            this.itemsPerPage = 6; // 2列x3行
        }
    }
    
    // データを設定
    setData(data) {
        this.data = data;
        this.filteredData = [...data];
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
    }
    
    // フィルタリングされたデータを設定
    setFilteredData(filteredData) {
        this.filteredData = filteredData;
        this.totalItems = filteredData.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
    }
    
    // 現在のページのアイテムを取得
    getCurrentPageItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredData.slice(startIndex, endIndex);
    }
    
    // ページに移動
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        
        if (this.loadingCallback) {
            this.loadingCallback(this.getCurrentPageItems(), page, this.totalPages);
        }
        
        this.renderPagination();
        this.updatePageInfo();
        
        // スムーズスクロール
        const guideSection = document.getElementById('guideSection') || document.querySelector('.guide-cards-container');
        if (guideSection) {
            guideSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // 次のページ
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }
    
    // 前のページ
    prevPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }
    
    // ペジネーションUIを描画
    renderPagination() {
        const container = document.querySelector(this.container);
        if (!container) return;
        
        if (this.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        const paginationHtml = this.generatePaginationHtml();
        container.innerHTML = paginationHtml;
        
        // イベントリスナーを設定
        this.attachPaginationEvents();
    }
    
    // ペジネーションHTMLを生成
    generatePaginationHtml() {
        let html = '<nav aria-label="ガイドページネーション">';
        html += '<ul class="pagination justify-content-center mb-4" style="flex-wrap: wrap;">';
        
        // 前へボタン
        html += `<li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">`;
        html += `<button class="page-link" data-action="prev" ${this.currentPage === 1 ? 'disabled' : ''}>`;
        html += '<i class="bi bi-chevron-left"></i> 前へ</button></li>';
        
        // ページ番号ボタン
        const pageNumbers = this.getVisiblePages();
        
        // 最初のページ
        if (pageNumbers[0] > 1) {
            html += `<li class="page-item"><button class="page-link" data-page="1">1</button></li>`;
            if (pageNumbers[0] > 2) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // 表示範囲のページ
        pageNumbers.forEach(page => {
            const isActive = page === this.currentPage;
            html += `<li class="page-item ${isActive ? 'active' : ''}">`;
            html += `<button class="page-link" data-page="${page}">${page}</button></li>`;
        });
        
        // 最後のページ
        const lastVisible = pageNumbers[pageNumbers.length - 1];
        if (lastVisible < this.totalPages) {
            if (lastVisible < this.totalPages - 1) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            html += `<li class="page-item"><button class="page-link" data-page="${this.totalPages}">${this.totalPages}</button></li>`;
        }
        
        // 次へボタン
        html += `<li class="page-item ${this.currentPage === this.totalPages ? 'disabled' : ''}">`;
        html += `<button class="page-link" data-action="next" ${this.currentPage === this.totalPages ? 'disabled' : ''}>`;
        html += '次へ <i class="bi bi-chevron-right"></i></button></li>';
        
        html += '</ul></nav>';
        
        return html;
    }
    
    // 表示するページ番号の配列を取得
    getVisiblePages() {
        const pages = [];
        const halfVisible = Math.floor(this.maxVisiblePages / 2);
        
        let start = Math.max(1, this.currentPage - halfVisible);
        let end = Math.min(this.totalPages, this.currentPage + halfVisible);
        
        // 範囲を調整してmaxVisiblePages分表示
        if (end - start + 1 < this.maxVisiblePages) {
            if (start === 1) {
                end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
            } else if (end === this.totalPages) {
                start = Math.max(1, end - this.maxVisiblePages + 1);
            }
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    }
    
    // ペジネーションイベントを設定
    attachPaginationEvents() {
        const container = document.querySelector(this.container);
        if (!container) return;
        
        // 委任イベントハンドラ
        container.addEventListener('click', (event) => {
            event.preventDefault();
            const button = event.target.closest('button');
            if (!button) return;
            
            const action = button.dataset.action;
            const page = button.dataset.page;
            
            if (action === 'prev') {
                this.prevPage();
            } else if (action === 'next') {
                this.nextPage();
            } else if (page) {
                this.goToPage(parseInt(page));
            }
        });
    }
    
    // ページ情報を更新
    updatePageInfo() {
        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
            
            pageInfo.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">
                        ${startItem}-${endItem}件目 (全${this.totalItems}件中)
                    </span>
                    <div class="d-flex align-items-center gap-2">
                        <label for="itemsPerPageSelect" class="text-muted small">表示件数:</label>
                        <select id="itemsPerPageSelect" class="form-select form-select-sm" style="width: auto;">
                            <option value="6" ${this.itemsPerPage === 6 ? 'selected' : ''}>6件</option>
                            <option value="12" ${this.itemsPerPage === 12 ? 'selected' : ''}>12件</option>
                            <option value="24" ${this.itemsPerPage === 24 ? 'selected' : ''}>24件</option>
                            <option value="48" ${this.itemsPerPage === 48 ? 'selected' : ''}>48件</option>
                        </select>
                    </div>
                </div>
            `;
            
            // 表示件数変更のイベントリスナー
            const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
            if (itemsPerPageSelect) {
                itemsPerPageSelect.addEventListener('change', (e) => {
                    this.changeItemsPerPage(parseInt(e.target.value));
                });
            }
        }
    }
    
    // 表示件数を変更
    changeItemsPerPage(newItemsPerPage) {
        const oldItemsPerPage = this.itemsPerPage;
        this.itemsPerPage = newItemsPerPage;
        
        // 現在位置を保持するため、現在の最初のアイテムのインデックスを計算
        const currentFirstItemIndex = (this.currentPage - 1) * oldItemsPerPage;
        
        // 新しいページサイズでの総ページ数を再計算
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // 新しいページ番号を計算
        this.currentPage = Math.floor(currentFirstItemIndex / this.itemsPerPage) + 1;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        
        // 表示を更新
        if (this.loadingCallback) {
            this.loadingCallback(this.getCurrentPageItems(), this.currentPage, this.totalPages);
        }
        
        this.renderPagination();
        this.updatePageInfo();
        
        console.log(`表示件数を${newItemsPerPage}件に変更`);
    }
    
    // 現在の状態を取得
    getState() {
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalItems: this.totalItems,
            itemsPerPage: this.itemsPerPage,
            hasNextPage: this.currentPage < this.totalPages,
            hasPrevPage: this.currentPage > 1
        };
    }
    
    // ページ情報更新関数（guide-renderer.mjsとの整合性のため）
    updatePageInfo() {
        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
            
            pageInfo.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted">
                        ${startItem}-${endItem}件目 (全${this.totalItems}件中)
                    </span>
                    <div class="d-flex align-items-center gap-2">
                        <label for="itemsPerPageSelect" class="text-muted small">表示件数:</label>
                        <select id="itemsPerPageSelect" class="form-select form-select-sm" style="width: auto;">
                            <option value="6" ${this.itemsPerPage === 6 ? 'selected' : ''}>6件</option>
                            <option value="12" ${this.itemsPerPage === 12 ? 'selected' : ''}>12件</option>
                            <option value="24" ${this.itemsPerPage === 24 ? 'selected' : ''}>24件</option>
                            <option value="48" ${this.itemsPerPage === 48 ? 'selected' : ''}>48件</option>
                        </select>
                    </div>
                </div>
            `;
            
            // 表示件数変更のイベントリスナー
            const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
            if (itemsPerPageSelect) {
                itemsPerPageSelect.addEventListener('change', (e) => {
                    this.changeItemsPerPage(parseInt(e.target.value));
                });
            }
        }
    }
}

// ペジネーション用のスタイルを追加
const paginationStyles = document.createElement('style');
paginationStyles.innerHTML = `
    .pagination .page-link {
        border-radius: 8px;
        margin: 0 2px;
        color: #667eea;
        border: 1px solid #e0e4e7;
        padding: 8px 12px;
        transition: all 0.3s ease;
    }
    
    .pagination .page-link:hover {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-color: transparent;
        transform: translateY(-1px);
    }
    
    .pagination .page-item.active .page-link {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-color: transparent;
        color: white;
    }
    
    .pagination .page-item.disabled .page-link {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
        .pagination .page-link {
            padding: 6px 8px;
            font-size: 14px;
        }
        
        .pagination {
            gap: 2px;
        }
    }
`;
document.head.appendChild(paginationStyles);