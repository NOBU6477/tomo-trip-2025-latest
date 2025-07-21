// 英語版比較システム - 日本語版と同じ仕様
console.log('English Comparison System - 初期化中');

class EnglishComparisonSystem {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateToolbarCounts();
        console.log('English Comparison System 初期化完了');
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

        console.log('English Comparison System イベントリスナー設定完了');
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
            this.showAlert('Added to bookmarks!', 'success');
        } else {
            // ブックマークから削除
            this.bookmarkedGuides.splice(index, 1);
            icon.className = 'bi bi-star';
            icon.style.color = '#ffc107';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            this.showAlert('Removed from bookmarks', 'info');
        }
        
        this.saveBookmarks();
        this.updateToolbarCounts();
        console.log(`Guide ${guideId} bookmark toggled: ${index === -1 ? 'added' : 'removed'}`);
    }

    toggleComparison(guideId, button) {
        const index = this.comparedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // 比較に追加
            if (this.comparedGuides.length >= this.maxCompareGuides) {
                this.showAlert(`You can compare up to ${this.maxCompareGuides} guides maximum`, 'warning');
                return;
            }
            
            this.comparedGuides.push(guideId);
            icon.className = 'bi bi-check-circle-fill';
            icon.style.color = '#28a745';
            button.style.backgroundColor = '#d4edda';
            this.showAlert('Added to comparison!', 'success');
        } else {
            // 比較から削除
            this.comparedGuides.splice(index, 1);
            icon.className = 'bi bi-check-circle';
            icon.style.color = '#28a745';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            this.showAlert('Removed from comparison', 'info');
        }
        
        this.saveComparison();
        this.updateToolbarCounts();
        console.log(`Guide ${guideId} comparison toggled: ${index === -1 ? 'added' : 'removed'}`);
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
            bookmarkBtn.innerHTML = `<i class="bi bi-bookmark-star me-1"></i>Bookmarks(${this.bookmarkedGuides.length})`;
        }
        
        if (compareBtn) {
            compareBtn.innerHTML = `<i class="bi bi-list-check me-1"></i>Compare`;
        }
        
        if (comparisonInfo) {
            comparisonInfo.textContent = `Comparing: ${this.comparedGuides.length}/${this.maxCompareGuides} people`;
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
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
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
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        });
    }

    showBookmarks() {
        if (this.bookmarkedGuides.length === 0) {
            this.showAlert('No bookmarked guides', 'info');
            return;
        }
        
        alert(`Bookmarked guides: ${this.bookmarkedGuides.length} people\n\nYou can save interesting guides with the bookmark feature.\n\nDetailed view will be implemented in the future.`);
    }

    showComparison() {
        if (this.comparedGuides.length === 0) {
            this.showAlert('No guides selected for comparison', 'info');
            return;
        }
        
        alert(`Guides in comparison: ${this.comparedGuides.length} people\n\nYou can compare up to 3 guides.\n\nComparison screen will be implemented in the future.`);
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

// 英語サイトでのみ初期化
if (window.location.pathname.includes('index-en') || document.title.includes('English')) {
    console.log('🇺🇸 English site detected - initializing comparison system');
    
    document.addEventListener('DOMContentLoaded', () => {
        window.englishComparisonSystem = new EnglishComparisonSystem();
    });
    
    // ガイドが新しく表示された際の状態更新
    document.addEventListener('guidesDisplayed', () => {
        if (window.englishComparisonSystem) {
            window.englishComparisonSystem.updateCardStates();
        }
    });
} else {
    console.log('🇯🇵 Japanese site detected - skipping English comparison system');
}

console.log('English Comparison System loaded');