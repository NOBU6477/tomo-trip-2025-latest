// 日本語版究極アイコンシステム - 競合スクリプト無効化＋強制表示
console.log('🇯🇵 究極日本語アイコンシステム開始');

// 他のアイコンシステムを無効化
window.disableOtherIconSystems = true;

// 競合するスクリプトの関数を無効化
if (window.forceJapaneseIcons) window.forceJapaneseIcons = () => {};
if (window.nuclearForceJapaneseIcons) window.nuclearForceJapaneseIcons = () => {};

class UltimateJapaneseIcons {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.isProcessing = false;
        this.init();
    }

    init() {
        console.log('🎯 究極日本語アイコンシステム初期化');
        
        // グローバルインスタンスとして設定
        window.ultimateJapaneseIcons = this;
        
        // 既存のアイコンを全て削除
        this.removeAllExistingIcons();
        
        // アイコンを強制表示
        this.forceDisplayIcons();
        
        // イベントリスナー設定
        this.setupEventListeners();
        
        // 定期監視
        setInterval(() => this.maintainIcons(), 3000);
        
        // DOM変更監視
        this.observeAndMaintain();
        
        console.log('✅ 究極日本語アイコンシステム初期化完了');
    }

    removeAllExistingIcons() {
        // 全ての既存アイコンを削除
        const existingIcons = document.querySelectorAll('.bookmark-btn, .compare-btn, .japanese-icon-container, .icon-container-jp');
        existingIcons.forEach(icon => icon.remove());
        console.log(`🗑️ 既存アイコン ${existingIcons.length} 個を削除`);
    }

    forceDisplayIcons() {
        // ボタンクリーンアップシステムが存在する場合は処理をスキップ
        if (window.buttonCleanupFix) {
            console.log('⏭️ Button Cleanup Fix が有効なため、処理をスキップ');
            return;
        }

        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            console.log('🔄 アイコン強制表示開始（非推奨：Button Cleanup Fix使用推奨）');

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
                    iconContainer.className = 'ultimate-icon-container';
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
                        title: 'このガイドをブックマーク'
                    });

                    // 比較ボタン（円形）
                    const compareBtn = this.createCircularButton('compare', guideId, {
                        icon: 'bi-check-circle',
                        color: '#28a745',
                        title: '比較に追加'
                    });

                    iconContainer.appendChild(bookmarkBtn);
                    iconContainer.appendChild(compareBtn);
                    imgContainer.appendChild(iconContainer);

                    // 状態を復元
                    this.restoreButtonState(bookmarkBtn, compareBtn, guideId);

                    processedCount++;

                } catch (error) {
                    console.error(`❌ カード${index + 1}処理エラー:`, error);
                }
            });

            console.log(`✅ ${processedCount}枚のカードにアイコンを追加`);

        } catch (error) {
            console.error('❌ アイコン表示エラー:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    createCircularButton(type, guideId, config) {
        const button = document.createElement('button');
        button.className = `btn btn-sm btn-light ${type}-btn ultimate-${type}-btn`;
        button.setAttribute('data-guide-id', guideId);
        button.setAttribute('title', config.title);
        
        // 円形スタイル
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

        // ホバーエフェクト
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
        // ブックマーククリック
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ultimate-bookmark-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.ultimate-bookmark-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleBookmark(guideId, btn);
            }
        });

        // 比較クリック
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ultimate-compare-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.ultimate-compare-btn');
                const guideId = parseInt(btn.dataset.guideId);
                this.toggleComparison(guideId, btn);
            }
        });

        // フローティングツールバーのボタン
        document.addEventListener('click', (e) => {
            // ブックマーク表示ボタン
            if (e.target.id === 'showBookmarks' || e.target.closest('#showBookmarks')) {
                e.preventDefault();
                e.stopPropagation();
                this.showBookmarks();
            }
            
            // 比較表示ボタン
            if (e.target.id === 'showComparison' || e.target.closest('#showComparison')) {
                e.preventDefault();
                e.stopPropagation();
                this.showComparison();
            }
        });

        console.log('✅ 究極アイコンイベントリスナー設定完了');
    }

    toggleBookmark(guideId, button) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            this.bookmarkedGuides.push(guideId);
            icon.className = 'bi bi-star-fill';
            button.style.backgroundColor = '#fff3cd';
            this.showAlert('ブックマークに追加しました！', 'success');
        } else {
            this.bookmarkedGuides.splice(index, 1);
            icon.className = 'bi bi-star';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('ブックマークから削除しました', 'info');
        }
        
        localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
        this.updateToolbarCounts();
    }

    toggleComparison(guideId, button) {
        const index = this.comparedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            if (this.comparedGuides.length >= this.maxCompareGuides) {
                this.showAlert(`比較できるのは最大${this.maxCompareGuides}人までです`, 'warning');
                return;
            }
            
            this.comparedGuides.push(guideId);
            icon.className = 'bi bi-check-circle-fill';
            button.style.backgroundColor = '#d4edda';
            this.showAlert('比較に追加しました！', 'success');
        } else {
            this.comparedGuides.splice(index, 1);
            icon.className = 'bi bi-check-circle';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('比較から削除しました', 'info');
        }
        
        localStorage.setItem('comparedGuides', JSON.stringify(this.comparedGuides));
        this.updateToolbarCounts();
    }

    updateToolbarCounts() {
        // フローティングツールバーの更新
        const bookmarkBtn = document.getElementById('showBookmarks');
        const comparisonInfo = document.querySelector('.floating-toolbar .d-flex span');
        const comparisonCount = document.querySelector('.floating-toolbar span[class*="comparison"]');
        
        if (bookmarkBtn) {
            bookmarkBtn.innerHTML = `<i class="bi bi-bookmark-star me-1"></i>ブックマーク(${this.bookmarkedGuides.length})`;
        }
        
        if (comparisonInfo) {
            comparisonInfo.textContent = `比較中: ${this.comparedGuides.length}/${this.maxCompareGuides}人`;
        }
        
        // 比較カウント表示の更新
        if (comparisonCount) {
            comparisonCount.textContent = this.comparedGuides.length;
        }
        
        // より具体的なセレクターで比較カウントを更新
        const comparisonCountElements = document.querySelectorAll('[class*="comparison"], #comparison-count, .comparison-count');
        comparisonCountElements.forEach(element => {
            if (element.tagName === 'SPAN' && element.textContent.match(/^\d+$/)) {
                element.textContent = this.comparedGuides.length;
            }
        });
    }

    maintainIcons() {
        // アイコンが消えていないかチェック
        const visibleIcons = document.querySelectorAll('.ultimate-icon-container');
        const guideCards = document.querySelectorAll('.guide-card, .card');
        
        if (visibleIcons.length < guideCards.length) {
            console.log('🔧 アイコンが不足しています。再表示します。');
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
            this.showAlert('ブックマークされたガイドはありません', 'info');
            return;
        }
        
        this.showManagementModal('bookmark');
    }

    showComparison() {
        console.log('📋 比較リスト表示開始');
        console.log('比較対象ガイド数:', this.comparedGuides.length);
        console.log('比較対象:', this.comparedGuides);
        
        if (this.comparedGuides.length === 0) {
            this.showAlert('比較するガイドが選択されていません\n\nガイドカードの✓ボタンをクリックして比較対象を選択してください。', 'info');
            return;
        }
        
        console.log('🎯 比較管理モーダル表示');
        this.showManagementModal('comparison');
    }

    showManagementModal(type) {
        const isBookmark = type === 'bookmark';
        const guides = isBookmark ? this.bookmarkedGuides : this.comparedGuides;
        const title = isBookmark ? 'ブックマーク管理' : '比較管理';
        const emptyMessage = isBookmark ? 'ブックマークされたガイドはありません' : '比較するガイドが選択されていません';
        
        if (guides.length === 0) {
            this.showAlert(emptyMessage, 'info');
            return;
        }
        
        // モーダルを作成
        const modalId = `${type}-management-modal`;
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
                                 class="rounded-circle" width="50" height="50" alt="ガイド${guideId}">
                        </div>
                        <div>
                            <h6 class="mb-1">ガイド ${guideId}</h6>
                            <small class="text-muted">東京都</small>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm remove-guide-btn" 
                            data-guide-id="${guideId}" data-type="${type}">
                        <i class="bi bi-x-circle"></i> 削除
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
                                ${isBookmark ? 'ブックマークしたガイドを管理できます。不要なものは削除できます。' : '比較中のガイドを管理できます。最大3人まで選択可能です。'}
                            </div>
                        </div>
                        <div id="${type}-guide-list">
                            ${guideListHTML}
                        </div>
                        ${guides.length === 0 ? `<div class="text-center py-4 text-muted">${emptyMessage}</div>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-danger" id="clear-all-${type}">
                            <i class="bi bi-trash"></i> 全て削除
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                        ${!isBookmark ? '<button type="button" class="btn btn-primary" id="start-comparison">比較開始</button>' : ''}
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
                const list = modal.querySelector(`#${type}-guide-list`);
                if (list.children.length === 0) {
                    list.innerHTML = `<div class="text-center py-4 text-muted">${isBookmark ? 'ブックマークされたガイドはありません' : '比較するガイドが選択されていません'}</div>`;
                }
                
                this.showAlert(`ガイド${guideId}を${isBookmark ? 'ブックマーク' : '比較'}から削除しました`, 'success');
            }
        });
        
        // 全て削除ボタン
        const clearAllBtn = modal.querySelector(`#clear-all-${type}`);
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                const confirmMessage = `全ての${isBookmark ? 'ブックマーク' : '比較対象'}を削除しますか？`;
                if (confirm(confirmMessage)) {
                    if (isBookmark) {
                        this.clearAllBookmarks();
                    } else {
                        this.clearAllComparisons();
                    }
                    bsModal.hide();
                    this.showAlert(`全ての${isBookmark ? 'ブックマーク' : '比較対象'}を削除しました`, 'success');
                }
            });
        }
        
        // 比較開始ボタン（比較モーダルのみ）
        const startComparisonBtn = modal.querySelector('#start-comparison');
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
            localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
            this.updateToolbarCounts();
            this.updateGuideCardIcon(guideId, 'bookmark', false);
        }
    }

    removeFromComparison(guideId) {
        const index = this.comparedGuides.indexOf(guideId);
        if (index !== -1) {
            this.comparedGuides.splice(index, 1);
            localStorage.setItem('comparedGuides', JSON.stringify(this.comparedGuides));
            this.updateToolbarCounts();
            this.updateGuideCardIcon(guideId, 'compare', false);
        }
    }

    clearAllBookmarks() {
        this.bookmarkedGuides = [];
        localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
        this.updateToolbarCounts();
        this.updateAllGuideCardIcons('bookmark', false);
    }

    clearAllComparisons() {
        this.comparedGuides = [];
        localStorage.setItem('comparedGuides', JSON.stringify(this.comparedGuides));
        this.updateToolbarCounts();
        this.updateAllGuideCardIcons('compare', false);
    }

    updateGuideCardIcon(guideId, type, isActive) {
        const cards = document.querySelectorAll(`.ultimate-${type}-btn[data-guide-id="${guideId}"]`);
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
        const cards = document.querySelectorAll(`.ultimate-${type}-btn`);
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
            this.showAlert('比較するには最低2人のガイドを選択してください', 'warning');
            return;
        }
        
        alert(`比較機能\n\n選択されたガイド: ${this.comparedGuides.length}人\n\n詳細な比較画面は今後実装予定です。\n現在の選択: ${this.comparedGuides.join(', ')}`);
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

// 日本語サイトでのみ実行
if (!window.location.pathname.includes('index-en')) {
    console.log('🇯🇵 日本語サイト検出 - 究極アイコンシステム開始');
    
    // 即座に初期化
    window.ultimateJapaneseIcons = new UltimateJapaneseIcons();
    
    // DOM読み込み後も実行
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.ultimateJapaneseIcons) {
            window.ultimateJapaneseIcons = new UltimateJapaneseIcons();
        }
    });
} else {
    console.log('🇺🇸 英語サイト検出 - 日本語システムをスキップ');
}

console.log('📱 究極日本語アイコンシステム読み込み完了');