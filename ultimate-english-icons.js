// 英語版究極アイコンシステム - 日本語版の完全コピー
console.log('🇺🇸 Ultimate English Icons System Starting');

// 他のアイコンシステムを無効化
window.disableOtherEnglishIconSystems = true;

class UltimateEnglishIcons {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('englishBookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('englishComparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.isProcessing = false;
        this.init();
    }

    init() {
        console.log('🎯 Ultimate English Icons System Initialization');
        
        // 既存のアイコンを全て削除
        this.removeAllExistingIcons();
        
        // アイコンを強制表示
        this.forceDisplayIcons();
        
        // イベントリスナー設定
        this.setupEventListeners();
        
        // フローティングツールバー設定
        this.setupFloatingToolbar();
        
        // 定期監視
        setInterval(() => this.maintainIcons(), 3000);
        
        // DOM変更監視
        this.observeAndMaintain();
        
        console.log('✅ Ultimate English Icons System Initialized');
    }

    removeAllExistingIcons() {
        // 全ての既存アイコンを削除
        const existingIcons = document.querySelectorAll('.bookmark-btn, .compare-btn, .english-icon-container, .icon-container-en');
        existingIcons.forEach(icon => icon.remove());
        console.log(`🗑️ Removed ${existingIcons.length} existing icons`);
    }

    forceDisplayIcons() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            console.log('🔄 Force Display Icons Starting');

            // ガイドカードを検索
            const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
            let processedCount = 0;

            guideCards.forEach((card, index) => {
                try {
                    // 画像があるカードのみ処理
                    const img = card.querySelector('img');
                    if (!img) return;

                    // 既存のアイコンを削除
                    const existingIcons = card.querySelectorAll('.bookmark-btn, .compare-btn');
                    existingIcons.forEach(icon => icon.remove());

                    const guideId = index + 1;

                    // 画像の親要素を取得
                    let imgContainer = img.parentElement;
                    imgContainer.style.position = 'relative';

                    // アイコンコンテナ作成
                    const iconContainer = document.createElement('div');
                    iconContainer.className = 'ultimate-english-icon-container';
                    iconContainer.style.cssText = `
                        position: absolute !important;
                        top: 10px !important;
                        left: 10px !important;
                        z-index: 2000 !important;
                        display: flex !important;
                        gap: 6px !important;
                        pointer-events: auto !important;
                    `;

                    // ブックマークボタン（円形）
                    const bookmarkBtn = this.createCircularButton('bookmark', guideId, {
                        icon: 'bi-star',
                        color: '#ffc107',
                        title: 'Add to bookmarks'
                    });

                    // 比較ボタン（円形）
                    const compareBtn = this.createCircularButton('compare', guideId, {
                        icon: 'bi-check-circle',
                        color: '#28a745',
                        title: 'Add to comparison'
                    });

                    iconContainer.appendChild(bookmarkBtn);
                    iconContainer.appendChild(compareBtn);
                    imgContainer.appendChild(iconContainer);

                    // 状態を復元
                    this.restoreButtonState(bookmarkBtn, compareBtn, guideId);

                    processedCount++;

                } catch (error) {
                    console.error(`❌ Card ${index + 1} processing error:`, error);
                }
            });

            console.log(`✅ Added icons to ${processedCount} cards`);

        } catch (error) {
            console.error('❌ Icon display error:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    createCircularButton(type, guideId, config) {
        const button = document.createElement('button');
        button.className = `btn btn-sm btn-light ${type}-btn ultimate-english-${type}-btn`;
        button.setAttribute('data-guide-id', guideId);
        button.setAttribute('title', config.title);
        
        // 円形スタイル（日本語版と同じ）
        button.style.cssText = `
            border-radius: 50% !important;
            width: 38px !important;
            height: 38px !important;
            padding: 0 !important;
            border: 2px solid rgba(255,255,255,0.8) !important;
            background-color: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(6px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 3px 6px rgba(0,0,0,0.15) !important;
            position: relative !important;
            z-index: 2001 !important;
        `;

        // アイコン作成
        const icon = document.createElement('i');
        icon.className = `bi ${config.icon}`;
        icon.style.cssText = `
            color: ${config.color} !important;
            font-size: 18px !important;
            line-height: 1 !important;
            pointer-events: none !important;
        `;

        button.appendChild(icon);

        // ホバーエフェクト（日本語版と同じ）
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.15)';
            button.style.boxShadow = '0 5px 12px rgba(0,0,0,0.25)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
        });

        return button;
    }

    restoreButtonState(bookmarkBtn, compareBtn, guideId) {
        // ブックマーク状態を復元
        const bookmarkIcon = bookmarkBtn.querySelector('i');
        if (this.bookmarkedGuides.includes(guideId)) {
            bookmarkIcon.className = 'bi bi-star-fill';
            bookmarkBtn.style.backgroundColor = '#fff3cd';
        }

        // 比較状態を復元
        const compareIcon = compareBtn.querySelector('i');
        if (this.comparedGuides.includes(guideId)) {
            compareIcon.className = 'bi bi-check-circle-fill';
            compareBtn.style.backgroundColor = '#d4edda';
        }
    }

    setupEventListeners() {
        // ブックマーククリック（日本語版と同じ機能）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ultimate-english-bookmark-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.ultimate-english-bookmark-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleBookmark(guideId, btn);
            }
        });

        // 比較クリック（日本語版と同じ機能）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ultimate-english-compare-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.ultimate-english-compare-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleComparison(guideId, btn);
            }
        });

        // フローティングツールバーボタン
        document.addEventListener('click', (e) => {
            if (e.target.closest('#englishShowBookmarks')) {
                this.showBookmarks();
            }
            if (e.target.closest('#englishShowComparison')) {
                this.showComparison();
            }
        });

        console.log('✅ Ultimate English Icons Event Listeners Set');
    }

    toggleBookmark(guideId, button) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            this.bookmarkedGuides.push(guideId);
            icon.className = 'bi bi-star-fill';
            button.style.backgroundColor = '#fff3cd';
            this.showAlert('Added to bookmarks!', 'success');
        } else {
            this.bookmarkedGuides.splice(index, 1);
            icon.className = 'bi bi-star';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('Removed from bookmarks', 'info');
        }
        
        localStorage.setItem('englishBookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
        this.updateToolbarCounts();
    }

    toggleComparison(guideId, button) {
        const index = this.comparedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            if (this.comparedGuides.length >= this.maxCompareGuides) {
                this.showAlert(`You can compare up to ${this.maxCompareGuides} guides maximum`, 'warning');
                return;
            }
            
            this.comparedGuides.push(guideId);
            icon.className = 'bi bi-check-circle-fill';
            button.style.backgroundColor = '#d4edda';
            this.showAlert('Added to comparison!', 'success');
        } else {
            this.comparedGuides.splice(index, 1);
            icon.className = 'bi bi-check-circle';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('Removed from comparison', 'info');
        }
        
        localStorage.setItem('englishComparedGuides', JSON.stringify(this.comparedGuides));
        this.updateToolbarCounts();
    }

    setupFloatingToolbar() {
        // フローティングツールバーを作成（日本語版と同じ構造）
        let toolbar = document.querySelector('.english-floating-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.className = 'english-floating-toolbar position-fixed';
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
            comparisonInfo.className = 'english-comparison-info';
            
            // 比較ボタン
            const compareBtn = document.createElement('button');
            compareBtn.id = 'englishShowComparison';
            compareBtn.className = 'btn btn-primary btn-sm';
            compareBtn.innerHTML = '<i class="bi bi-list-check me-1"></i>Compare';
            
            // ブックマークボタン
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.id = 'englishShowBookmarks';
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

    updateToolbarCounts() {
        // フローティングツールバーの更新
        const bookmarkBtn = document.getElementById('englishShowBookmarks');
        const comparisonInfo = document.querySelector('.english-comparison-info');
        
        if (bookmarkBtn) {
            bookmarkBtn.innerHTML = `<i class="bi bi-bookmark-star me-1"></i>Bookmarks(${this.bookmarkedGuides.length})`;
        }
        
        if (comparisonInfo) {
            comparisonInfo.textContent = `Comparing: ${this.comparedGuides.length}/${this.maxCompareGuides} people`;
        }
    }

    maintainIcons() {
        // アイコンが消えていないかチェック
        const visibleIcons = document.querySelectorAll('.ultimate-english-icon-container');
        const guideCards = document.querySelectorAll('.guide-card, .card');
        
        if (visibleIcons.length < guideCards.length) {
            console.log('🔧 Icons missing. Re-displaying.');
            this.forceDisplayIcons();
        }
    }

    observeAndMaintain() {
        const observer = new MutationObserver((mutations) => {
            let shouldRefresh = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList?.contains('guide-card') || 
                                node.classList?.contains('card') ||
                                node.querySelector?.('.guide-card, .card')) {
                                shouldRefresh = true;
                            }
                        }
                    });
                }
            });

            if (shouldRefresh) {
                setTimeout(() => this.forceDisplayIcons(), 200);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
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
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'warning' ? '#856404' : '#0c5460'};
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            font-weight: 500;
        `;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }
}

// 英語サイトでのみ実行
if (window.location.pathname.includes('index-en') || document.title.includes('English')) {
    console.log('🇺🇸 English site detected - Ultimate Icons System Starting');
    
    // 即座に初期化
    window.ultimateEnglishIcons = new UltimateEnglishIcons();
    
    // DOM読み込み後も実行
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.ultimateEnglishIcons) {
            window.ultimateEnglishIcons = new UltimateEnglishIcons();
        }
    });
    
    // ガイドが新しく表示された際の状態更新
    document.addEventListener('guidesDisplayed', () => {
        if (window.ultimateEnglishIcons) {
            window.ultimateEnglishIcons.forceDisplayIcons();
        }
    });
} else {
    console.log('🇯🇵 Japanese site detected - Skipping English system');
}

console.log('📱 Ultimate English Icons System Loaded');