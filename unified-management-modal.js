// 統一管理モーダルシステム - 日本語版と英語版の完全統一
console.log('🔄 統一管理モーダルシステム開始');

class UnifiedManagementModal {
    constructor(language = 'ja') {
        this.language = language;
        this.isJapanese = language === 'ja';
        this.texts = this.getTexts();
        
        // 既存のモーダル表示関数をオーバーライド
        this.overrideExistingModals();
    }
    
    getTexts() {
        return {
            ja: {
                bookmarkTitle: 'ブックマーク管理',
                comparisonTitle: '比較管理',
                bookmarkInfo: 'ブックマークしたガイドを管理できます。不要なものは削除できます。',
                comparisonInfo: '比較中のガイドを管理できます。最大3人まで選択可能です。',
                bookmarkEmpty: 'ブックマークされたガイドはありません',
                comparisonEmpty: '比較するガイドが選択されていません',
                removeBtn: '削除',
                clearAllBtn: '全て削除',
                closeBtn: '閉じる',
                startComparisonBtn: '比較開始',
                location: '東京都',
                confirmClearAll: '全ての{type}を削除しますか？',
                removedAlert: 'ガイド{id}を{type}から削除しました',
                clearedAlert: '全ての{type}を削除しました'
            },
            en: {
                bookmarkTitle: 'Bookmark Management',
                comparisonTitle: 'Comparison Management',
                bookmarkInfo: 'Manage your bookmarked guides. Remove unwanted ones.',
                comparisonInfo: 'Manage guides for comparison. You can select up to 3 guides.',
                bookmarkEmpty: 'No bookmarked guides',
                comparisonEmpty: 'No guides selected for comparison',
                removeBtn: 'Remove',
                clearAllBtn: 'Clear All',
                closeBtn: 'Close',
                startComparisonBtn: 'Start Comparison',
                location: 'Tokyo',
                confirmClearAll: 'Clear all {type}?',
                removedAlert: 'Guide {id} removed from {type}',
                clearedAlert: 'All {type} cleared'
            }
        };
    }
    
    overrideExistingModals() {
        // 日本語版のオーバーライド
        if (window.ultimateJapaneseIcons) {
            window.ultimateJapaneseIcons.showManagementModal = (type) => {
                this.showUnifiedModal(type);
            };
        }
        
        // 英語版のオーバーライド
        if (window.ultimateEnglishIcons) {
            window.ultimateEnglishIcons.showManagementModal = (type) => {
                this.showUnifiedModal(type);
            };
        }
        
        console.log('✅ 既存モーダル関数をオーバーライド完了');
    }
    
    showUnifiedModal(type) {
        const isBookmark = type === 'bookmark';
        const t = this.texts[this.language];
        
        // 適切なインスタンスからデータを取得
        const instance = this.isJapanese ? window.ultimateJapaneseIcons : window.ultimateEnglishIcons;
        if (!instance) {
            console.error('アイコンシステムのインスタンスが見つかりません');
            return;
        }
        
        const guides = isBookmark ? instance.bookmarkedGuides : instance.comparedGuides;
        const title = isBookmark ? t.bookmarkTitle : t.comparisonTitle;
        const info = isBookmark ? t.bookmarkInfo : t.comparisonInfo;
        const emptyMessage = isBookmark ? t.bookmarkEmpty : t.comparisonEmpty;
        
        console.log(`📋 統一モーダル表示: ${type}, ガイド数: ${guides.length}`);
        
        if (guides.length === 0) {
            instance.showAlert(emptyMessage, 'info');
            return;
        }
        
        // 既存モーダルを削除
        this.removeExistingModals();
        
        // 新しいモーダルを作成
        const modal = this.createModalElement(type, title, info, guides, emptyMessage, t);
        document.body.appendChild(modal);
        
        // Bootstrap モーダルを表示
        const bsModal = new bootstrap.Modal(modal, {
            backdrop: 'static',
            keyboard: true
        });
        bsModal.show();
        
        // イベントリスナーを設定
        this.setupModalEvents(modal, type, bsModal, instance, t);
    }
    
    removeExistingModals() {
        // 全ての既存モーダルを削除
        const existingModals = document.querySelectorAll('.modal[id*="management"], .modal[id*="bookmark"], .modal[id*="comparison"]');
        existingModals.forEach(modal => modal.remove());
        
        // モーダル背景も削除
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        // body クラスをクリーンアップ
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
    
    createModalElement(type, title, info, guides, emptyMessage, t) {
        const isBookmark = type === 'bookmark';
        const modalId = `unified-${type}-modal`;
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', `${modalId}-title`);
        modal.setAttribute('aria-hidden', 'true');
        modal.style.zIndex = '1055';
        
        let guideListHTML = '';
        guides.forEach(guideId => {
            guideListHTML += `
                <div class="d-flex align-items-center justify-content-between p-3 border-bottom guide-management-item" data-guide-id="${guideId}">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                                 class="rounded-circle border" width="50" height="50" alt="${this.isJapanese ? 'ガイド' : 'Guide'}${guideId}">
                        </div>
                        <div>
                            <h6 class="mb-1 fw-bold">${this.isJapanese ? 'ガイド' : 'Guide'} ${guideId}</h6>
                            <small class="text-muted">${t.location}</small>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm remove-guide-btn" 
                            data-guide-id="${guideId}" data-type="${type}">
                        <i class="bi bi-x-circle me-1"></i>${t.removeBtn}
                    </button>
                </div>
            `;
        });
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content shadow-lg border-0">
                    <div class="modal-header bg-light border-bottom">
                        <h5 class="modal-title fw-bold" id="${modalId}-title">
                            <i class="bi bi-${isBookmark ? 'bookmark-star text-warning' : 'list-check text-primary'} me-2"></i>${title}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="alert alert-info border-0 bg-light">
                                <i class="bi bi-info-circle me-2"></i>${info}
                            </div>
                        </div>
                        <div id="${type}-guide-list" class="border rounded">
                            ${guides.length > 0 ? guideListHTML : `<div class="text-center py-4 text-muted">${emptyMessage}</div>`}
                        </div>
                    </div>
                    <div class="modal-footer bg-light border-top">
                        <button type="button" class="btn btn-outline-danger" id="clear-all-${type}">
                            <i class="bi bi-trash me-1"></i>${t.clearAllBtn}
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="bi bi-x-lg me-1"></i>${t.closeBtn}
                        </button>
                        ${!isBookmark ? `<button type="button" class="btn btn-primary" id="start-comparison">
                            <i class="bi bi-play-circle me-1"></i>${t.startComparisonBtn}
                        </button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    setupModalEvents(modal, type, bsModal, instance, t) {
        const isBookmark = type === 'bookmark';
        const typeText = isBookmark ? (this.isJapanese ? 'ブックマーク' : 'bookmarks') : (this.isJapanese ? '比較対象' : 'comparison');
        
        // 個別削除ボタン
        modal.addEventListener('click', (e) => {
            if (e.target.closest('.remove-guide-btn')) {
                const btn = e.target.closest('.remove-guide-btn');
                const guideId = parseInt(btn.dataset.guideId);
                
                this.removeGuide(guideId, type, instance, t, typeText);
                
                // UI更新
                const item = btn.closest('.guide-management-item');
                item.remove();
                
                // リストが空になった場合
                const list = modal.querySelector(`#${type}-guide-list`);
                if (list.children.length === 0) {
                    const emptyMessage = isBookmark ? t.bookmarkEmpty : t.comparisonEmpty;
                    list.innerHTML = `<div class="text-center py-4 text-muted">${emptyMessage}</div>`;
                }
            }
        });
        
        // 全て削除ボタン
        const clearAllBtn = modal.querySelector(`#clear-all-${type}`);
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                const confirmMessage = t.confirmClearAll.replace('{type}', typeText);
                if (confirm(confirmMessage)) {
                    this.clearAllGuides(type, instance, t, typeText);
                    bsModal.hide();
                }
            });
        }
        
        // 比較開始ボタン
        const startComparisonBtn = modal.querySelector('#start-comparison');
        if (startComparisonBtn) {
            startComparisonBtn.addEventListener('click', () => {
                instance.startComparison();
            });
        }
    }
    
    removeGuide(guideId, type, instance, t, typeText) {
        if (type === 'bookmark') {
            instance.removeFromBookmarks(guideId);
        } else {
            instance.removeFromComparison(guideId);
        }
        
        const message = t.removedAlert.replace('{id}', guideId).replace('{type}', typeText);
        instance.showAlert(message, 'success');
    }
    
    clearAllGuides(type, instance, t, typeText) {
        if (type === 'bookmark') {
            instance.clearAllBookmarks();
        } else {
            instance.clearAllComparisons();
        }
        
        const message = t.clearedAlert.replace('{type}', typeText);
        instance.showAlert(message, 'success');
    }
}

// 日本語版用インスタンス
if (!window.location.pathname.includes('index-en')) {
    window.unifiedManagementModal = new UnifiedManagementModal('ja');
    console.log('🇯🇵 日本語版統一管理モーダル初期化完了');
} else {
    window.unifiedManagementModal = new UnifiedManagementModal('en');
    console.log('🇺🇸 英語版統一管理モーダル初期化完了');
}

console.log('✅ Unified Management Modal System Loaded');