// ガイド選択管理システム - 削除・リセット機能付き
console.log('🎯 ガイド選択管理システム開始');

class GuideSelectionManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupToolbarEnhancements();
        this.setupManagementModal();
        this.monitorSelectionChanges();
        console.log('✅ ガイド選択管理システム初期化完了');
    }
    
    setupToolbarEnhancements() {
        // フローティングツールバーの機能拡張
        this.enhanceToolbarButtons();
        this.addResetButton();
    }
    
    enhanceToolbarButtons() {
        // 比較ボタンにクリックイベント追加
        const findAndEnhanceButton = (selectors, callback) => {
            for (const selector of selectors) {
                const btn = document.querySelector(selector);
                if (btn) {
                    btn.addEventListener('click', callback);
                    console.log(`✅ ボタン強化: ${selector}`);
                    return true;
                }
            }
            return false;
        };
        
        // 比較管理ボタン
        const comparisonSelectors = [
            'button[onclick*="comparison"]',
            '.floating-toolbar .btn:first-child',
            'button:contains("比較")',
            'button:contains("Comparing")'
        ];
        
        findAndEnhanceButton(comparisonSelectors, (e) => {
            e.preventDefault();
            this.showComparisonManagement();
        });
        
        // ブックマーク管理ボタン
        const bookmarkSelectors = [
            'button[onclick*="bookmark"]',
            '.floating-toolbar .btn:nth-child(3)',
            'button:contains("ブックマーク")',
            'button:contains("Bookmark")'
        ];
        
        findAndEnhanceButton(bookmarkSelectors, (e) => {
            e.preventDefault();
            this.showBookmarkManagement();
        });
    }
    
    addResetButton() {
        // リセットボタンをツールバーに追加
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'btn btn-outline-danger btn-sm';
            resetBtn.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i>リセット';
            resetBtn.style.cssText = `
                border-radius: 20px !important;
                padding: 6px 12px !important;
                font-size: 12px !important;
                margin-left: 8px !important;
            `;
            
            resetBtn.addEventListener('click', () => {
                this.resetAllSelections();
            });
            
            toolbar.appendChild(resetBtn);
            console.log('✅ リセットボタンを追加');
        }
    }
    
    showComparisonManagement() {
        const comparisons = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        const isJapanese = !window.location.pathname.includes('index-en.html');
        
        const modalHtml = `
            <div class="modal fade" id="comparison-management-modal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-check-circle me-2"></i>
                                ${isJapanese ? '比較管理' : 'Comparison Management'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle me-2"></i>
                                ${isJapanese ? 
                                  '比較中のガイドを管理できます。個別削除または全削除が可能です。' : 
                                  'Manage guides for comparison. Individual or bulk removal available.'}
                            </div>
                            <div id="comparison-guide-list">
                                ${this.generateGuideList(comparisons, 'comparison')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" onclick="guideSelectionManager.clearAllComparisons()">
                                <i class="bi bi-trash me-1"></i>
                                ${isJapanese ? '全て削除' : 'Clear All'}
                            </button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                                ${isJapanese ? '閉じる' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modalHtml, 'comparison-management-modal');
    }
    
    showBookmarkManagement() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const isJapanese = !window.location.pathname.includes('index-en.html');
        
        const modalHtml = `
            <div class="modal fade" id="bookmark-management-modal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-star me-2"></i>
                                ${isJapanese ? 'ブックマーク管理' : 'Bookmark Management'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-star me-2"></i>
                                ${isJapanese ? 
                                  'ブックマークしたガイドを管理できます。不要なものは削除してください。' : 
                                  'Manage your bookmarked guides. Remove unwanted ones.'}
                            </div>
                            <div id="bookmark-guide-list">
                                ${this.generateGuideList(bookmarks, 'bookmark')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" onclick="guideSelectionManager.clearAllBookmarks()">
                                <i class="bi bi-trash me-1"></i>
                                ${isJapanese ? '全て削除' : 'Clear All'}
                            </button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                                ${isJapanese ? '閉じる' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modalHtml, 'bookmark-management-modal');
    }
    
    generateGuideList(guideIds, type) {
        if (guideIds.length === 0) {
            const isJapanese = !window.location.pathname.includes('index-en.html');
            return `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-${type === 'bookmark' ? 'star' : 'check-circle'} display-4 mb-3"></i>
                    <p>${isJapanese ? 
                        (type === 'bookmark' ? 'ブックマークされたガイドはありません' : '比較するガイドが選択されていません') :
                        (type === 'bookmark' ? 'No bookmarked guides' : 'No guides selected for comparison')
                    }</p>
                </div>
            `;
        }
        
        return guideIds.map(guideId => {
            const guideData = this.getGuideData(guideId);
            return `
                <div class="guide-management-item mb-3 p-3 border rounded" data-guide-id="${guideId}">
                    <div class="d-flex align-items-center">
                        <div class="guide-image me-3">
                            <img src="${guideData.image}" alt="${guideData.name}" 
                                 style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
                        </div>
                        <div class="guide-info flex-grow-1">
                            <h6 class="mb-1 fw-bold">${guideData.name}</h6>
                            <p class="mb-1 text-muted small">
                                <i class="bi bi-geo-alt me-1"></i>${guideData.location}
                            </p>
                            <div class="d-flex align-items-center">
                                <span class="badge bg-primary me-2">${guideData.rating}★</span>
                                <span class="text-success fw-bold">¥${guideData.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div class="guide-actions">
                            <button class="btn btn-outline-danger btn-sm" 
                                    onclick="guideSelectionManager.removeFromSelection(${guideId}, '${type}')">
                                <i class="bi bi-trash me-1"></i>削除
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    getGuideData(guideId) {
        // 実際のガイドカードからデータを取得
        const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
        const targetCard = Array.from(guideCards).find((card, index) => {
            return (index + 1) === parseInt(guideId);
        });
        
        if (targetCard) {
            const img = targetCard.querySelector('img');
            const nameElement = targetCard.querySelector('h5, h6, .card-title, [class*="name"]');
            const locationElement = targetCard.querySelector('[class*="location"], .text-muted');
            const priceElement = targetCard.querySelector('[class*="price"], .text-success, .fw-bold');
            const ratingElement = targetCard.querySelector('.badge, [class*="rating"]');
            
            return {
                name: nameElement ? nameElement.textContent.trim() : `ガイド${guideId}`,
                location: locationElement ? locationElement.textContent.trim() : '東京都',
                image: img ? img.src : 'https://via.placeholder.com/60x60',
                price: priceElement ? parseInt(priceElement.textContent.replace(/[^\d]/g, '')) || 8000 : 8000,
                rating: ratingElement ? parseFloat(ratingElement.textContent) || 4.5 : 4.5
            };
        }
        
        // フォールバックデータ
        return {
            name: `ガイド${guideId}`,
            location: '東京都',
            image: 'https://via.placeholder.com/60x60',
            price: 8000,
            rating: 4.5
        };
    }
    
    showModal(modalHtml, modalId) {
        // 既存モーダルを削除
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        // 新しいモーダルを追加
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // モーダル表示
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        // モーダルが閉じられた時の後処理
        document.getElementById(modalId).addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
    }
    
    removeFromSelection(guideId, type) {
        const storageKey = type === 'bookmark' ? 'bookmarkedGuides' : 'comparisonGuides';
        const selections = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        const index = selections.indexOf(guideId);
        if (index !== -1) {
            selections.splice(index, 1);
            localStorage.setItem(storageKey, JSON.stringify(selections));
            
            // ボタンの状態更新
            this.updateButtonState(guideId, type, false);
            
            // ツールバー更新
            this.updateToolbarCounts();
            
            // モーダル内容更新
            const listContainer = document.getElementById(`${type}-guide-list`);
            if (listContainer) {
                listContainer.innerHTML = this.generateGuideList(selections, type);
            }
            
            const isJapanese = !window.location.pathname.includes('index-en.html');
            this.showAlert(
                isJapanese ? 
                `ガイド${guideId}を${type === 'bookmark' ? 'ブックマーク' : '比較'}から削除しました` :
                `Guide ${guideId} removed from ${type}`,
                'success'
            );
            
            console.log(`✅ ガイド${guideId}を${type}から削除`);
        }
    }
    
    clearAllComparisons() {
        const isJapanese = !window.location.pathname.includes('index-en.html');
        const confirmMessage = isJapanese ? 
            '全ての比較選択をリセットしますか？' : 
            'Clear all comparison selections?';
            
        if (confirm(confirmMessage)) {
            localStorage.setItem('comparisonGuides', '[]');
            this.updateAllButtonStates('comparison', false);
            this.updateToolbarCounts();
            
            // モーダル内容更新
            const listContainer = document.getElementById('comparison-guide-list');
            if (listContainer) {
                listContainer.innerHTML = this.generateGuideList([], 'comparison');
            }
            
            this.showAlert(
                isJapanese ? '全ての比較選択をリセットしました' : 'All comparisons cleared',
                'info'
            );
            
            console.log('🔄 全比較選択をリセット');
        }
    }
    
    clearAllBookmarks() {
        const isJapanese = !window.location.pathname.includes('index-en.html');
        const confirmMessage = isJapanese ? 
            '全てのブックマークを削除しますか？' : 
            'Clear all bookmarks?';
            
        if (confirm(confirmMessage)) {
            localStorage.setItem('bookmarkedGuides', '[]');
            this.updateAllButtonStates('bookmark', false);
            this.updateToolbarCounts();
            
            // モーダル内容更新
            const listContainer = document.getElementById('bookmark-guide-list');
            if (listContainer) {
                listContainer.innerHTML = this.generateGuideList([], 'bookmark');
            }
            
            this.showAlert(
                isJapanese ? '全てのブックマークを削除しました' : 'All bookmarks cleared',
                'info'
            );
            
            console.log('🔄 全ブックマークを削除');
        }
    }
    
    resetAllSelections() {
        const isJapanese = !window.location.pathname.includes('index-en.html');
        const confirmMessage = isJapanese ? 
            'ブックマークと比較選択を全てリセットしますか？' : 
            'Reset all bookmarks and comparisons?';
            
        if (confirm(confirmMessage)) {
            localStorage.setItem('bookmarkedGuides', '[]');
            localStorage.setItem('comparisonGuides', '[]');
            
            this.updateAllButtonStates('bookmark', false);
            this.updateAllButtonStates('comparison', false);
            this.updateToolbarCounts();
            
            this.showAlert(
                isJapanese ? '全ての選択をリセットしました' : 'All selections reset',
                'success'
            );
            
            console.log('🔄 全選択をリセット');
        }
    }
    
    updateButtonState(guideId, type, isActive) {
        const buttons = document.querySelectorAll(`[data-guide-id="${guideId}"].${type}-btn`);
        buttons.forEach(btn => {
            const icon = btn.querySelector('i');
            if (type === 'bookmark') {
                if (isActive) {
                    btn.style.backgroundColor = '#fff3cd';
                    btn.style.color = '#856404';
                    if (icon) {
                        icon.className = 'bi bi-star-fill';
                        icon.style.color = '#ffc107';
                    }
                } else {
                    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    btn.style.color = '';
                    if (icon) {
                        icon.className = 'bi bi-star';
                        icon.style.color = '#ffc107';
                    }
                }
            } else if (type === 'comparison') {
                if (isActive) {
                    btn.style.backgroundColor = '#d4edda';
                    btn.style.color = '#155724';
                    if (icon) {
                        icon.className = 'bi bi-check-circle-fill';
                        icon.style.color = '#28a745';
                    }
                } else {
                    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    btn.style.color = '';
                    if (icon) {
                        icon.className = 'bi bi-check-circle';
                        icon.style.color = '#28a745';
                    }
                }
            }
        });
    }
    
    updateAllButtonStates(type, isActive) {
        const buttons = document.querySelectorAll(`.${type}-btn`);
        buttons.forEach(btn => {
            const guideId = btn.getAttribute('data-guide-id');
            if (guideId) {
                this.updateButtonState(parseInt(guideId), type, isActive);
            }
        });
    }
    
    updateToolbarCounts() {
        if (window.buttonCleanupFix) {
            window.buttonCleanupFix.updateToolbarCounts();
        }
    }
    
    showAlert(message, type = 'info') {
        if (window.buttonCleanupFix) {
            window.buttonCleanupFix.showAlert(message, type);
        }
    }
    
    monitorSelectionChanges() {
        // 定期的に選択状態を監視
        setInterval(() => {
            this.updateToolbarCounts();
        }, 2000);
    }
}

// グローバルインスタンス作成
window.guideSelectionManager = new GuideSelectionManager();

console.log('✅ Guide Selection Manager Loaded - 選択管理・削除・リセット機能を追加');