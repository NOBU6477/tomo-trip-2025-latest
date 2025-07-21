// ブックマークと比較機能システム
console.log('ブックマークと比較機能システム - 初期化中');

class BookmarkComparisonSystem {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateToolbarCounts();
        console.log('ブックマーク・比較システム初期化完了');
    }

    setupEventListeners() {
        // ブックマークボタンのクリックイベント
        document.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.bookmark-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleBookmark(guideId, btn);
            }
        });

        // 比較ボタンのクリックイベント
        document.addEventListener('click', (e) => {
            if (e.target.closest('.compare-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.compare-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleComparison(guideId, btn);
            }
        });

        // フローティングツールバーボタン
        document.addEventListener('click', (e) => {
            if (e.target.closest('#showBookmarks')) {
                this.showBookmarks();
            }
            if (e.target.closest('#showComparison')) {
                this.showComparison();
            }
        });

        console.log('ブックマーク・比較イベントリスナー設定完了');
    }

    toggleBookmark(guideId, button) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // ブックマークに追加
            this.bookmarkedGuides.push(guideId);
            icon.className = 'bi bi-star-fill';
            icon.style.color = '#ffc107';
            button.style.backgroundColor = '#fff3cd';
            this.showAlert('ブックマークに追加しました！', 'success');
        } else {
            // ブックマークから削除
            this.bookmarkedGuides.splice(index, 1);
            icon.className = 'bi bi-star';
            icon.style.color = '#ffc107';
            button.style.backgroundColor = 'white';
            this.showAlert('ブックマークから削除しました', 'info');
        }
        
        this.saveBookmarks();
        this.updateToolbarCounts();
        console.log(`ガイド${guideId}のブックマーク状態を変更: ${index === -1 ? '追加' : '削除'}`);
    }

    toggleComparison(guideId, button) {
        const index = this.comparedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // 比較に追加
            if (this.comparedGuides.length >= this.maxCompareGuides) {
                this.showAlert(`比較できるのは最大${this.maxCompareGuides}人までです`, 'warning');
                return;
            }
            
            this.comparedGuides.push(guideId);
            icon.className = 'bi bi-check-circle-fill';
            icon.style.color = '#28a745';
            button.style.backgroundColor = '#d4edda';
            this.showAlert('比較に追加しました！', 'success');
        } else {
            // 比較から削除
            this.comparedGuides.splice(index, 1);
            icon.className = 'bi bi-check-circle';
            icon.style.color = '#28a745';
            button.style.backgroundColor = 'white';
            this.showAlert('比較から削除しました', 'info');
        }
        
        this.saveComparison();
        this.updateToolbarCounts();
        console.log(`ガイド${guideId}の比較状態を変更: ${index === -1 ? '追加' : '削除'}`);
    }

    saveBookmarks() {
        localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
    }

    saveComparison() {
        localStorage.setItem('comparedGuides', JSON.stringify(this.comparedGuides));
    }

    updateToolbarCounts() {
        // フローティングツールバーの数値を更新
        const bookmarkBtn = document.getElementById('showBookmarks');
        const compareBtn = document.getElementById('showComparison');
        const comparisonInfo = document.querySelector('.floating-toolbar .d-flex span');
        
        if (bookmarkBtn) {
            bookmarkBtn.innerHTML = `<i class="bi bi-bookmark-star me-1"></i>ブックマーク(${this.bookmarkedGuides.length})`;
        }
        
        if (compareBtn) {
            compareBtn.innerHTML = `<i class="bi bi-list-check me-1"></i>比較`;
        }
        
        if (comparisonInfo) {
            comparisonInfo.textContent = `比較中: ${this.comparedGuides.length}/${this.maxCompareGuides}人`;
        }

        // ガイドカードの状態を更新
        this.updateCardStates();
    }

    updateCardStates() {
        // 表示されているガイドカードの状態を更新
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            const guideId = parseInt(btn.dataset.guideId);
            const icon = btn.querySelector('i');
            
            if (this.bookmarkedGuides.includes(guideId)) {
                icon.className = 'bi bi-star-fill';
                btn.style.backgroundColor = '#fff3cd';
            } else {
                icon.className = 'bi bi-star';
                btn.style.backgroundColor = 'white';
            }
        });

        document.querySelectorAll('.compare-btn').forEach(btn => {
            const guideId = parseInt(btn.dataset.guideId);
            const icon = btn.querySelector('i');
            
            if (this.comparedGuides.includes(guideId)) {
                icon.className = 'bi bi-check-circle-fill';
                btn.style.backgroundColor = '#d4edda';
            } else {
                icon.className = 'bi bi-check-circle';
                btn.style.backgroundColor = 'white';
            }
        });
    }

    showBookmarks() {
        if (this.bookmarkedGuides.length === 0) {
            this.showAlert('ブックマークされたガイドがありません', 'info');
            return;
        }
        
        alert(`ブックマーク済みガイド: ${this.bookmarkedGuides.length}人\n\nブックマーク機能で気になるガイドを保存できます。\n\n詳細画面は今後実装予定です。`);
    }

    showComparison() {
        if (this.comparedGuides.length === 0) {
            this.showAlert('比較するガイドが選択されていません', 'info');
            return;
        }
        
        alert(`比較中のガイド: ${this.comparedGuides.length}人\n\n最大3人まで比較できます。\n\n比較画面は今後実装予定です。`);
    }

    showAlert(message, type = 'info') {
        // Bootstrap風のアラート表示
        const alertContainer = document.getElementById('alert-container') || document.body;
        const alertDiv = document.createElement('div');
        
        const alertClass = {
            'success': 'alert-success',
            'info': 'alert-info',
            'warning': 'alert-warning',
            'danger': 'alert-danger'
        };
        
        alertDiv.className = `alert ${alertClass[type]} alert-dismissible fade show`;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';
        
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        alertContainer.appendChild(alertDiv);
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }
}

// システム初期化
document.addEventListener('DOMContentLoaded', () => {
    window.bookmarkComparisonSystem = new BookmarkComparisonSystem();
});

// ガイドが新しく表示された際の状態更新
document.addEventListener('guidesDisplayed', () => {
    if (window.bookmarkComparisonSystem) {
        window.bookmarkComparisonSystem.updateCardStates();
    }
});

console.log('ブックマーク・比較システム読み込み完了');