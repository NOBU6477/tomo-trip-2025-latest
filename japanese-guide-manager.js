// 日本語版専用ガイド管理システム - スケーラブル対応
console.log('🇯🇵 日本語版ガイド管理システム開始');

class JapaneseGuideManager {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        this.maxCompareGuides = 3;
        this.isJapanese = true;
        this.init();
    }
    
    init() {
        console.log('🎯 日本語版ガイド管理初期化開始');
        
        // グローバルインスタンス設定
        window.japaneseGuideManager = this;
        
        // ツールバー機能強化
        this.enhanceToolbar();
        
        // 管理モーダルシステム設定
        this.setupManagementModals();
        
        // 削除・リセット機能追加
        this.addResetFunctionality();
        
        // 定期監視システム
        this.startMonitoring();
        
        console.log('✅ 日本語版ガイド管理システム初期化完了');
    }
    
    enhanceToolbar() {
        // フローティングツールバーの機能を強化
        setTimeout(() => {
            this.addToolbarEventListeners();
            this.addResetButton();
            this.updateToolbarDisplay();
        }, 1000);
    }
    
    addToolbarEventListeners() {
        // 複数のセレクタでボタンを検索
        const findAndEnhanceButton = (selectors, callback, buttonName) => {
            for (const selector of selectors) {
                const buttons = document.querySelectorAll(selector);
                if (buttons.length > 0) {
                    buttons.forEach(btn => {
                        // 既存のイベントを削除
                        btn.removeAttribute('onclick');
                        const clonedBtn = btn.cloneNode(true);
                        btn.parentNode.replaceChild(clonedBtn, btn);
                        
                        // 新しいイベントリスナー追加
                        clonedBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            callback();
                        });
                    });
                    console.log(`✅ ${buttonName}ボタンイベント設定完了 (${buttons.length}個)`);
                    return true;
                }
            }
            return false;
        };
        
        // 比較ボタンの機能強化
        const comparisonSelectors = [
            '.floating-toolbar .btn:first-child',
            'button[onclick*="comparison"]',
            '[class*="compare"]',
            'button:contains("比較")',
            'button:contains("Comparing")',
            '.btn:contains("比較中")',
            '.floating-toolbar button:first-of-type'
        ];
        
        findAndEnhanceButton(comparisonSelectors, () => {
            this.showComparisonManagement();
        }, '比較');
        
        // ブックマークボタンの機能強化
        const bookmarkSelectors = [
            '.floating-toolbar .btn:nth-child(3)',
            'button[onclick*="bookmark"]',
            '[class*="bookmark"]',
            'button:contains("ブックマーク")',
            'button:contains("Bookmark")',
            '.btn:contains("ブックマーク")',
            '.floating-toolbar button:nth-of-type(3)'
        ];
        
        findAndEnhanceButton(bookmarkSelectors, () => {
            this.showBookmarkManagement();
        }, 'ブックマーク');
        
        // フォールバック: 全てのツールバーボタンに対して検索
        setTimeout(() => {
            this.addFallbackEventListeners();
        }, 2000);
    }
    
    addFallbackEventListeners() {
        // ツールバー内の全ボタンをスキャン
        const toolbarButtons = document.querySelectorAll('.floating-toolbar button, .floating-toolbar .btn');
        
        toolbarButtons.forEach((btn, index) => {
            const text = btn.textContent.toLowerCase().trim();
            
            // ブックマークボタンを特定
            if (text.includes('ブックマーク') || text.includes('bookmark') || index === 2) {
                console.log(`📍 ブックマークボタン発見: "${btn.textContent}" (index: ${index})`);
                
                // 既存のイベントを削除
                const clonedBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(clonedBtn, btn);
                
                // 新しいイベントリスナー追加
                clonedBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔄 ブックマーク管理モーダルを表示');
                    this.showBookmarkManagement();
                });
                
                console.log('✅ ブックマークボタンにフォールバックイベント設定完了');
            }
            
            // 比較ボタンを特定
            if (text.includes('比較') || text.includes('comparing') || index === 0) {
                console.log(`📍 比較ボタン発見: "${btn.textContent}" (index: ${index})`);
                
                // 既存のイベントを削除
                const clonedBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(clonedBtn, btn);
                
                // 新しいイベントリスナー追加
                clonedBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔄 比較管理モーダルを表示');
                    this.showComparisonManagement();
                });
                
                console.log('✅ 比較ボタンにフォールバックイベント設定完了');
            }
        });
    }
    
    addResetButton() {
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar && !toolbar.querySelector('.reset-btn')) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'btn btn-outline-danger btn-sm reset-btn';
            resetBtn.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i>リセット';
            resetBtn.style.cssText = `
                border-radius: 20px !important;
                padding: 6px 12px !important;
                font-size: 12px !important;
                margin-left: 8px !important;
                background-color: rgba(255, 255, 255, 0.95) !important;
            `;
            
            resetBtn.addEventListener('click', () => {
                this.resetAllSelections();
            });
            
            toolbar.appendChild(resetBtn);
            console.log('✅ リセットボタン追加完了');
        }
    }
    
    setupManagementModals() {
        // 管理モーダルのHTMLを追加
        this.addModalHTML();
    }
    
    addModalHTML() {
        // 既存のモーダルを削除
        const existingComparison = document.getElementById('japanese-comparison-modal');
        const existingBookmark = document.getElementById('japanese-bookmark-modal');
        if (existingComparison) existingComparison.remove();
        if (existingBookmark) existingBookmark.remove();
        
        // 比較管理モーダル
        const comparisonModalHTML = `
            <div class="modal fade" id="japanese-comparison-modal" tabindex="-1" style="z-index: 1055;">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-check-circle me-2"></i>比較管理
                            </h5>
                            <button type="button" class="btn-close btn-close-white" onclick="japaneseGuideManager.closeModal('japanese-comparison-modal')"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle me-2"></i>
                                比較中のガイドを管理できます。最大3人まで選択可能です。個別削除または全削除ができます。
                            </div>
                            <div id="japanese-comparison-list"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" onclick="japaneseGuideManager.clearAllComparisons()">
                                <i class="bi bi-trash me-1"></i>全て削除
                            </button>
                            <button type="button" class="btn btn-success" onclick="japaneseGuideManager.startComparison()">
                                <i class="bi bi-play me-1"></i>比較開始
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="japaneseGuideManager.closeModal('japanese-comparison-modal')">閉じる</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // ブックマーク管理モーダル
        const bookmarkModalHTML = `
            <div class="modal fade" id="japanese-bookmark-modal" tabindex="-1" style="z-index: 1055;">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">
                                <i class="bi bi-star me-2"></i>ブックマーク管理
                            </h5>
                            <button type="button" class="btn-close" onclick="japaneseGuideManager.closeModal('japanese-bookmark-modal')"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-star me-2"></i>
                                ブックマークしたガイドを管理できます。不要なものは個別削除または全削除してください。
                            </div>
                            <div id="japanese-bookmark-list"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" onclick="japaneseGuideManager.clearAllBookmarks()">
                                <i class="bi bi-trash me-1"></i>全て削除
                            </button>
                            <button type="button" class="btn btn-primary" onclick="japaneseGuideManager.closeModal('japanese-bookmark-modal')">閉じる</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // モーダルをページに追加
        document.body.insertAdjacentHTML('beforeend', comparisonModalHTML);
        document.body.insertAdjacentHTML('beforeend', bookmarkModalHTML);
        
        console.log('✅ モーダルHTML追加完了');
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
            
            // バックドロップ削除
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            
            console.log(`✅ モーダル ${modalId} を閉じました`);
        }
    }
    
    showComparisonManagement() {
        console.log('🔄 比較管理モーダル表示');
        
        // データ更新
        this.comparedGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        // リスト更新
        this.updateComparisonList();
        
        // モーダル表示
        const modal = new bootstrap.Modal(document.getElementById('japanese-comparison-modal'));
        modal.show();
    }
    
    showBookmarkManagement() {
        console.log('🔄 ブックマーク管理モーダル表示開始');
        
        try {
            // データ更新
            this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            console.log('📚 ブックマークデータ:', this.bookmarkedGuides);
            
            // モーダルが存在するか確認
            let modalElement = document.getElementById('japanese-bookmark-modal');
            if (!modalElement) {
                console.log('⚠️ ブックマークモーダルが存在しません。再作成します。');
                this.addModalHTML();
                modalElement = document.getElementById('japanese-bookmark-modal');
            }
            
            // リスト更新
            this.updateBookmarkList();
            
            // モーダル表示
            if (modalElement) {
                // Bootstrap モーダルチェック
                if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                    console.log('✅ ブックマーク管理モーダル表示成功');
                } else {
                    // フォールバック: 直接表示
                    modalElement.style.display = 'block';
                    modalElement.classList.add('show');
                    document.body.classList.add('modal-open');
                    console.log('✅ ブックマーク管理モーダル（フォールバック）表示成功');
                }
            } else {
                console.error('❌ ブックマークモーダル要素が見つかりません');
                this.showAlert('ブックマーク管理画面の表示に失敗しました', 'error');
            }
            
        } catch (error) {
            console.error('❌ ブックマーク管理モーダル表示エラー:', error);
            this.showAlert('ブックマーク管理画面でエラーが発生しました', 'error');
        }
    }
    
    updateComparisonList() {
        const listContainer = document.getElementById('japanese-comparison-list');
        if (!listContainer) return;
        
        if (this.comparedGuides.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-check-circle display-4 mb-3"></i>
                    <p>比較するガイドが選択されていません</p>
                    <small>ガイドカードの比較ボタン（✓）をクリックして選択してください</small>
                </div>
            `;
            return;
        }
        
        const listHTML = this.comparedGuides.map(guideId => {
            const guideData = this.getGuideData(guideId);
            return `
                <div class="guide-management-item mb-3 p-3 border rounded border-success" data-guide-id="${guideId}">
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
                                <span class="badge bg-warning text-dark me-2">${guideData.rating}★</span>
                                <span class="text-success fw-bold">¥${guideData.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div class="guide-actions">
                            <button class="btn btn-outline-danger btn-sm" 
                                    onclick="japaneseGuideManager.removeFromComparison(${guideId})">
                                <i class="bi bi-trash me-1"></i>削除
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        listContainer.innerHTML = listHTML;
    }
    
    updateBookmarkList() {
        const listContainer = document.getElementById('japanese-bookmark-list');
        if (!listContainer) return;
        
        if (this.bookmarkedGuides.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-star display-4 mb-3"></i>
                    <p>ブックマークされたガイドはありません</p>
                    <small>ガイドカードの星ボタン（☆）をクリックしてブックマークしてください</small>
                </div>
            `;
            return;
        }
        
        const listHTML = this.bookmarkedGuides.map(guideId => {
            const guideData = this.getGuideData(guideId);
            return `
                <div class="guide-management-item mb-3 p-3 border rounded border-warning" data-guide-id="${guideId}">
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
                                <span class="badge bg-warning text-dark me-2">${guideData.rating}★</span>
                                <span class="text-success fw-bold">¥${guideData.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div class="guide-actions">
                            <button class="btn btn-outline-danger btn-sm" 
                                    onclick="japaneseGuideManager.removeFromBookmark(${guideId})">
                                <i class="bi bi-trash me-1"></i>削除
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        listContainer.innerHTML = listHTML;
    }
    
    getGuideData(guideId) {
        // 実際のガイドカードからデータを抽出
        const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
        const targetCard = Array.from(guideCards).find((card, index) => {
            return (index + 1) === parseInt(guideId);
        });
        
        if (targetCard) {
            const img = targetCard.querySelector('img');
            const nameElement = targetCard.querySelector('h5, h6, .card-title, [class*="name"], strong');
            const locationElement = targetCard.querySelector('[class*="location"], .text-muted, small');
            const priceElement = targetCard.querySelector('[class*="price"], .text-success, .fw-bold, .text-primary');
            const ratingElement = targetCard.querySelector('.badge, [class*="rating"], .text-warning');
            
            // 名前抽出
            let name = 'ガイド名取得中';
            if (nameElement) {
                name = nameElement.textContent.trim();
                name = name.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ');
                if (name.length > 20) name = name.substring(0, 20) + '...';
            }
            
            // 場所抽出
            let location = '東京都';
            if (locationElement) {
                const locationText = locationElement.textContent.trim();
                const locationMatch = locationText.match(/(東京都|[一-龯]+(県|府|道))/);
                if (locationMatch) {
                    location = locationMatch[0];
                }
            }
            
            // 価格抽出
            let price = 8000;
            if (priceElement) {
                const priceText = priceElement.textContent;
                const priceMatch = priceText.match(/¥?(\d{1,3}(?:,\d{3})*)/);
                if (priceMatch) {
                    price = parseInt(priceMatch[1].replace(/,/g, ''));
                }
            }
            
            // 評価抽出
            let rating = 4.5;
            if (ratingElement) {
                const ratingText = ratingElement.textContent;
                const ratingMatch = ratingText.match(/(\d+\.?\d*)★?/);
                if (ratingMatch) {
                    rating = parseFloat(ratingMatch[1]);
                }
            }
            
            return {
                id: guideId,
                name: name,
                location: location,
                image: img ? img.src : 'https://via.placeholder.com/60x60',
                price: price,
                rating: rating
            };
        }
        
        // フォールバックデータ
        return {
            id: guideId,
            name: `ガイド${guideId}`,
            location: '東京都',
            image: 'https://via.placeholder.com/60x60',
            price: 8000,
            rating: 4.5
        };
    }
    
    removeFromComparison(guideId) {
        const index = this.comparedGuides.indexOf(guideId);
        if (index !== -1) {
            this.comparedGuides.splice(index, 1);
            localStorage.setItem('comparisonGuides', JSON.stringify(this.comparedGuides));
            
            // ボタン状態更新
            this.updateButtonState(guideId, 'comparison', false);
            
            // リスト更新
            this.updateComparisonList();
            
            // ツールバー更新
            this.updateToolbarDisplay();
            
            this.showAlert(`ガイド${guideId}を比較から削除しました`, 'success');
            console.log(`✅ ガイド${guideId}を比較から削除`);
        }
    }
    
    removeFromBookmark(guideId) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        if (index !== -1) {
            this.bookmarkedGuides.splice(index, 1);
            localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
            
            // ボタン状態更新
            this.updateButtonState(guideId, 'bookmark', false);
            
            // リスト更新
            this.updateBookmarkList();
            
            // ツールバー更新
            this.updateToolbarDisplay();
            
            this.showAlert(`ガイド${guideId}をブックマークから削除しました`, 'success');
            console.log(`✅ ガイド${guideId}をブックマークから削除`);
        }
    }
    
    clearAllComparisons() {
        if (confirm('全ての比較選択をリセットしますか？')) {
            this.comparedGuides = [];
            localStorage.setItem('comparisonGuides', '[]');
            
            // 全ボタン状態更新
            this.updateAllButtonStates('comparison', false);
            
            // リスト更新
            this.updateComparisonList();
            
            // ツールバー更新
            this.updateToolbarDisplay();
            
            this.showAlert('全ての比較選択をリセットしました', 'info');
            console.log('🔄 全比較選択をリセット');
        }
    }
    
    clearAllBookmarks() {
        if (confirm('全てのブックマークを削除しますか？')) {
            this.bookmarkedGuides = [];
            localStorage.setItem('bookmarkedGuides', '[]');
            
            // 全ボタン状態更新
            this.updateAllButtonStates('bookmark', false);
            
            // リスト更新
            this.updateBookmarkList();
            
            // ツールバー更新
            this.updateToolbarDisplay();
            
            this.showAlert('全てのブックマークを削除しました', 'info');
            console.log('🔄 全ブックマークを削除');
        }
    }
    
    resetAllSelections() {
        if (confirm('ブックマークと比較選択を全てリセットしますか？')) {
            this.bookmarkedGuides = [];
            this.comparedGuides = [];
            localStorage.setItem('bookmarkedGuides', '[]');
            localStorage.setItem('comparisonGuides', '[]');
            
            // 全ボタン状態更新
            this.updateAllButtonStates('bookmark', false);
            this.updateAllButtonStates('comparison', false);
            
            // ツールバー更新
            this.updateToolbarDisplay();
            
            this.showAlert('全ての選択をリセットしました', 'success');
            console.log('🔄 全選択をリセット');
        }
    }
    
    startComparison() {
        if (this.comparedGuides.length === 0) {
            this.showAlert('比較するガイドを選択してください', 'warning');
            return;
        }
        
        // 比較画面を表示（実装予定）
        this.showAlert(`${this.comparedGuides.length}人のガイドで比較を開始します`, 'info');
        console.log('🚀 比較開始:', this.comparedGuides);
    }
    
    updateButtonState(guideId, type, isActive) {
        const buttons = document.querySelectorAll(`[data-guide-id="${guideId}"].${type}-btn, [data-guide-id="${guideId}"].square-${type}-btn`);
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
        const buttons = document.querySelectorAll(`.${type}-btn, .square-${type}-btn`);
        buttons.forEach(btn => {
            const guideId = btn.getAttribute('data-guide-id');
            if (guideId) {
                this.updateButtonState(parseInt(guideId), type, isActive);
            }
        });
    }
    
    updateToolbarDisplay() {
        // ツールバーの数値更新
        this.comparedGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        // 比較ボタンテキスト更新
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('comparing') || text.includes('比較')) {
                btn.textContent = `比較中: ${this.comparedGuides.length}/3人`;
            } else if (text.includes('bookmark') || text.includes('ブックマーク')) {
                btn.textContent = `ブックマーク(${this.bookmarkedGuides.length})`;
            }
        });
        
        console.log(`📊 ツールバー更新: ブックマーク${this.bookmarkedGuides.length}件, 比較${this.comparedGuides.length}件`);
    }
    
    showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'} alert-dismissible fade show`;
        alertContainer.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 9999 !important;
            min-width: 300px !important;
            max-width: 400px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        `;
        
        alertContainer.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(alertContainer);
        
        alertContainer.querySelector('.btn-close').addEventListener('click', () => {
            alertContainer.remove();
        });
        
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.remove();
            }
        }, 3000);
    }
    
    addResetFunctionality() {
        // 既存のリセット機能を強化
        console.log('🔄 リセット機能を追加');
    }
    
    startMonitoring() {
        // 定期的な状態監視
        setInterval(() => {
            this.updateToolbarDisplay();
        }, 3000);
        
        console.log('👁️ 定期監視システム開始');
    }
}

// インスタンス作成
setTimeout(() => {
    if (!window.japaneseGuideManager) {
        new JapaneseGuideManager();
    }
}, 1000);

console.log('✅ 日本語版ガイド管理システム準備完了');