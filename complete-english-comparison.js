// 英語版完全比較システム - 日本語版の仕様を完全コピー
console.log('🇺🇸 Complete English Comparison System - 初期化中');

class CompleteEnglishComparison {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('englishBookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('englishComparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateToolbarCounts();
        this.setupFloatingToolbar();
        console.log('✅ Complete English Comparison System 初期化完了');
    }

    setupEventListeners() {
        // ブックマークボタンのクリックイベント（日本語版と同じ）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.bookmark-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleBookmark(guideId, btn);
            }
        });

        // 比較ボタンのクリックイベント（日本語版と同じ）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.compare-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.compare-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleComparison(guideId, btn);
            }
        });

        // フローティングツールバーボタン（日本語版と同じ）
        document.addEventListener('click', (e) => {
            if (e.target.closest('#showBookmarks')) {
                this.showBookmarks();
            }
            if (e.target.closest('#showComparison')) {
                this.showComparison();
            }
        });

        console.log('✅ Complete English Comparison イベントリスナー設定完了');
    }

    toggleBookmark(guideId, button) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // ブックマークに追加（日本語版と同じ動作）
            this.bookmarkedGuides.push(guideId);
            icon.className = 'bi bi-star-fill';
            icon.style.color = '#ffc107';
            button.style.backgroundColor = '#fff3cd';
            this.showAlert('Added to bookmarks!', 'success');
        } else {
            // ブックマークから削除（日本語版と同じ動作）
            this.bookmarkedGuides.splice(index, 1);
            icon.className = 'bi bi-star';
            icon.style.color = '#ffc107';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('Removed from bookmarks', 'info');
        }
        
        this.saveBookmarks();
        this.updateToolbarCounts();
        console.log(`📌 Guide ${guideId} bookmark toggled: ${index === -1 ? 'added' : 'removed'}`);
    }

    toggleComparison(guideId, button) {
        const index = this.comparedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // 比較に追加（日本語版と同じ動作）
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
            // 比較から削除（日本語版と同じ動作）
            this.comparedGuides.splice(index, 1);
            icon.className = 'bi bi-check-circle';
            icon.style.color = '#28a745';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('Removed from comparison', 'info');
        }
        
        this.saveComparison();
        this.updateToolbarCounts();
        console.log(`🔍 Guide ${guideId} comparison toggled: ${index === -1 ? 'added' : 'removed'}`);
    }

    saveBookmarks() {
        localStorage.setItem('englishBookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
    }

    saveComparison() {
        localStorage.setItem('englishComparedGuides', JSON.stringify(this.comparedGuides));
    }

    updateToolbarCounts() {
        // フローティングツールバーの数値を更新（日本語版と同じ）
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
        // 表示されているガイドカードの状態を更新（日本語版と同じ）
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            const guideId = parseInt(btn.dataset.guideId);
            const icon = btn.querySelector('i');
            
            if (this.bookmarkedGuides.includes(guideId)) {
                icon.className = 'bi bi-star-fill';
                btn.style.backgroundColor = '#fff3cd';
            } else {
                icon.className = 'bi bi-star';
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
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
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    setupFloatingToolbar() {
        // フローティングツールバーが存在しない場合は作成（日本語版と同じ構造）
        let toolbar = document.querySelector('.floating-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.className = 'floating-toolbar position-fixed';
            toolbar.style.cssText = `
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 25px;
                padding: 10px 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                z-index: 1030;
                display: flex;
                gap: 15px;
                align-items: center;
            `;
            
            // 比較中の表示
            const comparisonInfo = document.createElement('span');
            comparisonInfo.textContent = `Comparing: ${this.comparedGuides.length}/${this.maxCompareGuides} people`;
            comparisonInfo.style.fontSize = '14px';
            comparisonInfo.style.color = '#666';
            
            // 比較ボタン
            const compareBtn = document.createElement('button');
            compareBtn.id = 'showComparison';
            compareBtn.className = 'btn btn-primary btn-sm';
            compareBtn.innerHTML = '<i class="bi bi-list-check me-1"></i>Compare';
            
            // ブックマークボタン
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.id = 'showBookmarks';
            bookmarkBtn.className = 'btn btn-outline-primary btn-sm';
            bookmarkBtn.innerHTML = `<i class="bi bi-bookmark-star me-1"></i>Bookmarks(${this.bookmarkedGuides.length})`;
            
            // 履歴ボタン
            const historyBtn = document.createElement('button');
            historyBtn.className = 'btn btn-outline-secondary btn-sm';
            historyBtn.innerHTML = '<i class="bi bi-clock-history me-1"></i>History';
            
            toolbar.appendChild(comparisonInfo);
            toolbar.appendChild(compareBtn);
            toolbar.appendChild(bookmarkBtn);
            toolbar.appendChild(historyBtn);
            
            document.body.appendChild(toolbar);
        }
    }

    showBookmarks() {
        if (this.bookmarkedGuides.length === 0) {
            this.showAlert('No bookmarked guides', 'info');
            return;
        }
        
        // 日本語版と同じアラート内容
        alert(`Bookmarked guides: ${this.bookmarkedGuides.length} people\n\nYou can save interesting guides with the bookmark feature.\n\nDetailed view will be implemented in the future.`);
    }

    showComparison() {
        if (this.comparedGuides.length === 0) {
            this.showAlert('No guides selected for comparison', 'info');
            return;
        }
        
        // 日本語版と同じアラート内容
        alert(`Guides in comparison: ${this.comparedGuides.length} people\n\nYou can compare up to 3 guides.\n\nComparison screen will be implemented in the future.`);
    }

    showAlert(message, type = 'info') {
        // 日本語版と同じアラート表示システム
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
    console.log('🇺🇸 English site detected - initializing complete comparison system');
    
    // システム初期化
    document.addEventListener('DOMContentLoaded', () => {
        window.completeEnglishComparison = new CompleteEnglishComparison();
    });
    
    // ガイドが新しく表示された際の状態更新
    document.addEventListener('guidesDisplayed', () => {
        if (window.completeEnglishComparison) {
            window.completeEnglishComparison.updateCardStates();
        }
    });
    
    // 即座に実行
    if (document.readyState !== 'loading') {
        window.completeEnglishComparison = new CompleteEnglishComparison();
    }
} else {
    console.log('🇯🇵 Japanese site detected - skipping English comparison system');
}

console.log('🎉 Complete English Comparison System loaded');