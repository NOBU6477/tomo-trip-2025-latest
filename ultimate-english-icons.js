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
        // 既存のツールバーを削除
        const existingToolbars = document.querySelectorAll('.floating-toolbar, .english-floating-toolbar, #floating-toolbar');
        existingToolbars.forEach(tb => tb.remove());
        
        // 日本語版と完全に同じ構造のツールバーを作成
        const toolbar = document.createElement('div');
        toolbar.className = 'floating-toolbar position-fixed';
        toolbar.style.cssText = `
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 12px 24px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1030;
            display: flex;
            gap: 20px;
            align-items: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        // 比較中の表示（日本語版と同じスタイル）
        const comparisonSection = document.createElement('div');
        comparisonSection.className = 'd-flex align-items-center';
        comparisonSection.innerHTML = `
            <span class="text-muted me-2" style="font-size: 14px;">Comparing:</span>
            <span id="english-comparison-count" class="fw-bold text-primary english-comparison-info">${this.comparedGuides.length}</span>
            <span class="text-muted">/3 people</span>
        `;
        
        // 比較ボタン（日本語版と同じスタイル）
        const compareBtn = document.createElement('button');
        compareBtn.id = 'englishShowComparison';
        compareBtn.className = 'btn btn-primary btn-sm';
        compareBtn.style.borderRadius = '20px';
        compareBtn.innerHTML = '<i class="bi bi-list-check me-1"></i>Compare';
        
        // ブックマークボタン（日本語版と同じスタイル）
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.id = 'englishShowBookmarks';
        bookmarkBtn.className = 'btn btn-outline-primary btn-sm';
        bookmarkBtn.style.borderRadius = '20px';
        bookmarkBtn.innerHTML = `<i class="bi bi-bookmark-star me-1"></i>Bookmarks(<span id="english-bookmark-count">${this.bookmarkedGuides.length}</span>)`;
        
        // 履歴ボタン（日本語版と同じスタイル）
        const historyBtn = document.createElement('button');
        historyBtn.className = 'btn btn-outline-secondary btn-sm';
        historyBtn.style.borderRadius = '20px';
        historyBtn.innerHTML = '<i class="bi bi-clock-history me-1"></i>History';
        historyBtn.onclick = () => {
            alert('History feature will be implemented in the future.\\n\\nThis will show your browsing history and recently viewed guides.');
        };
        
        // ページジャンプ（日本語版と同じスタイル）
        const pageJump = document.createElement('select');
        pageJump.className = 'form-select form-select-sm';
        pageJump.style.cssText = 'width: auto; border-radius: 20px;';
        pageJump.innerHTML = `
            <option value="">Page Jump</option>
            <option value="1">Page 1</option>
            <option value="2">Page 2</option>
            <option value="3">Page 3</option>
        `;
        pageJump.onchange = (e) => {
            if (e.target.value) {
                alert(`Page jump to ${e.target.value} will be implemented in the future.\\n\\nThis will allow quick navigation between guide pages.`);
                e.target.value = '';
            }
        };
        
        toolbar.appendChild(comparisonSection);
        toolbar.appendChild(compareBtn);
        toolbar.appendChild(bookmarkBtn);
        toolbar.appendChild(historyBtn);
        toolbar.appendChild(pageJump);
        
        document.body.appendChild(toolbar);
        console.log('✅ Japanese-style floating toolbar created');
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
        
        this.showManagementModal('bookmark');
    }

    showComparison() {
        if (this.comparedGuides.length === 0) {
            this.showAlert('No guides selected for comparison', 'info');
            return;
        }
        
        this.showManagementModal('comparison');
    }

    showManagementModal(type) {
        const isBookmark = type === 'bookmark';
        const guides = isBookmark ? this.bookmarkedGuides : this.comparedGuides;
        const title = isBookmark ? 'Bookmark Management' : 'Comparison Management';
        const emptyMessage = isBookmark ? 'No bookmarked guides' : 'No guides selected for comparison';
        
        if (guides.length === 0) {
            this.showAlert(emptyMessage, 'info');
            return;
        }
        
        // モーダルを作成
        const modalId = `english-${type}-management-modal`;
        let modal = document.getElementById(modalId);
        
        if (modal) {
            modal.remove();
        }
        
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.style.zIndex = '9999';
        
        let guideListHTML = '';
        guides.forEach(guideId => {
            guideListHTML += `
                <div class="d-flex align-items-center justify-content-between p-3 border-bottom guide-management-item" data-guide-id="${guideId}">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                                 class="rounded-circle" width="50" height="50" alt="Guide ${guideId}">
                        </div>
                        <div>
                            <h6 class="mb-1">Guide ${guideId}</h6>
                            <small class="text-muted">Tokyo, Japan</small>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm remove-guide-btn" 
                            data-guide-id="${guideId}" data-type="${type}">
                        <i class="bi bi-x-circle"></i> Remove
                    </button>
                </div>
            `;
        });
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-${isBookmark ? 'bookmark-star' : 'list-check'} me-2"></i>${title}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle me-2"></i>
                                ${isBookmark ? 'Manage your bookmarked guides. Remove unwanted ones here.' : 'Manage guides in comparison. You can select up to 3 guides.'}
                            </div>
                        </div>
                        <div id="english-${type}-guide-list">
                            ${guideListHTML}
                        </div>
                        ${guides.length === 0 ? `<div class="text-center py-4 text-muted">${emptyMessage}</div>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-danger" id="english-clear-all-${type}">
                            <i class="bi bi-trash"></i> Clear All
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ${!isBookmark ? '<button type="button" class="btn btn-primary" id="english-start-comparison">Start Comparison</button>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bootstrap モーダル表示
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // イベントリスナー設定
        this.setupManagementModalEvents(modal, type, bsModal);
    }

    setupManagementModalEvents(modal, type, bsModal) {
        const isBookmark = type === 'bookmark';
        
        // 個別削除ボタン
        modal.addEventListener('click', (e) => {
            if (e.target.closest('.remove-guide-btn')) {
                const btn = e.target.closest('.remove-guide-btn');
                const guideId = parseInt(btn.dataset.guideId);
                
                if (isBookmark) {
                    this.removeFromBookmarks(guideId);
                } else {
                    this.removeFromComparison(guideId);
                }
                
                // UI更新
                const item = btn.closest('.guide-management-item');
                item.remove();
                
                // リストが空になった場合
                const list = modal.querySelector(`#english-${type}-guide-list`);
                if (list.children.length === 0) {
                    list.innerHTML = `<div class="text-center py-4 text-muted">${isBookmark ? 'No bookmarked guides' : 'No guides selected for comparison'}</div>`;
                }
                
                this.showAlert(`Guide ${guideId} removed from ${isBookmark ? 'bookmarks' : 'comparison'}`, 'success');
            }
        });
        
        // 全て削除ボタン
        const clearAllBtn = modal.querySelector(`#english-clear-all-${type}`);
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                const confirmMessage = `Clear all ${isBookmark ? 'bookmarks' : 'comparisons'}?`;
                if (confirm(confirmMessage)) {
                    if (isBookmark) {
                        this.clearAllBookmarks();
                    } else {
                        this.clearAllComparisons();
                    }
                    bsModal.hide();
                    this.showAlert(`All ${isBookmark ? 'bookmarks' : 'comparisons'} cleared`, 'success');
                }
            });
        }
        
        // 比較開始ボタン（比較モーダルのみ）
        const startComparisonBtn = modal.querySelector('#english-start-comparison');
        if (startComparisonBtn) {
            startComparisonBtn.addEventListener('click', () => {
                bsModal.hide();
                this.startComparison();
            });
        }
    }

    removeFromBookmarks(guideId) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        if (index !== -1) {
            this.bookmarkedGuides.splice(index, 1);
            localStorage.setItem('englishBookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
            this.updateToolbarCounts();
            this.updateGuideCardIcon(guideId, 'bookmark', false);
        }
    }

    removeFromComparison(guideId) {
        const index = this.comparedGuides.indexOf(guideId);
        if (index !== -1) {
            this.comparedGuides.splice(index, 1);
            localStorage.setItem('englishComparedGuides', JSON.stringify(this.comparedGuides));
            this.updateToolbarCounts();
            this.updateGuideCardIcon(guideId, 'compare', false);
        }
    }

    clearAllBookmarks() {
        this.bookmarkedGuides = [];
        localStorage.setItem('englishBookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
        this.updateToolbarCounts();
        this.updateAllGuideCardIcons('bookmark', false);
    }

    clearAllComparisons() {
        this.comparedGuides = [];
        localStorage.setItem('englishComparedGuides', JSON.stringify(this.comparedGuides));
        this.updateToolbarCounts();
        this.updateAllGuideCardIcons('compare', false);
    }

    updateGuideCardIcon(guideId, type, isActive) {
        const cards = document.querySelectorAll(`.ultimate-english-${type}-btn[data-guide-id="${guideId}"]`);
        cards.forEach(btn => {
            const icon = btn.querySelector('i');
            if (type === 'bookmark') {
                icon.className = isActive ? 'bi bi-star-fill' : 'bi bi-star';
                btn.style.backgroundColor = isActive ? '#fff3cd' : 'rgba(255, 255, 255, 0.95)';
            } else {
                icon.className = isActive ? 'bi bi-check-circle-fill' : 'bi bi-check-circle';
                btn.style.backgroundColor = isActive ? '#d4edda' : 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    updateAllGuideCardIcons(type, isActive) {
        const cards = document.querySelectorAll(`.ultimate-english-${type}-btn`);
        cards.forEach(btn => {
            const icon = btn.querySelector('i');
            if (type === 'bookmark') {
                icon.className = isActive ? 'bi bi-star-fill' : 'bi bi-star';
                btn.style.backgroundColor = isActive ? '#fff3cd' : 'rgba(255, 255, 255, 0.95)';
            } else {
                icon.className = isActive ? 'bi bi-check-circle-fill' : 'bi bi-check-circle';
                btn.style.backgroundColor = isActive ? '#d4edda' : 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    startComparison() {
        if (this.comparedGuides.length < 2) {
            this.showAlert('Please select at least 2 guides for comparison', 'warning');
            return;
        }
        
        alert(`Comparison Feature\n\nSelected guides: ${this.comparedGuides.length} people\n\nDetailed comparison screen will be implemented in the future.\n\nCurrent selection: ${this.comparedGuides.join(', ')}`);
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