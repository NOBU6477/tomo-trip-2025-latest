// 核レベルガイドカードアイコンシステム
console.log('☢️ 核レベルガイドカードアイコンシステム開始');

class NuclearGuideCardIcons {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.processedCards = new Set();
        this.init();
    }
    
    init() {
        console.log('☢️ 核レベルシステム初期化');
        
        // 競合スクリプトを無効化
        this.disableCompetingScripts();
        
        // 即座に実行
        this.nuclearAddIcons();
        
        // 段階的実行
        setTimeout(() => this.nuclearAddIcons(), 500);
        setTimeout(() => this.nuclearAddIcons(), 1500);
        setTimeout(() => this.nuclearAddIcons(), 3000);
        
        // 超高頻度監視（2秒間隔）
        setInterval(() => this.nuclearMaintainIcons(), 2000);
        
        // DOM変更の核レベル監視
        this.nuclearObserveChanges();
        
        // CSS強制注入
        this.injectNuclearCSS();
    }
    
    disableCompetingScripts() {
        console.log('🔒 競合スクリプト無効化');
        
        // button-cleanup-fix の無効化
        window.buttonCleanupFix = null;
        if (window.ButtonCleanupFix) {
            window.ButtonCleanupFix = null;
        }
        
        // ultimate-japanese-icons の無効化
        window.ultimateJapaneseIcons = null;
        if (window.UltimateJapaneseIcons) {
            window.UltimateJapaneseIcons = null;
        }
        
        // 既存のタイマーをクリア
        for (let i = 1; i < 10000; i++) {
            clearInterval(i);
            clearTimeout(i);
        }
        
        console.log('✅ 競合スクリプト無効化完了');
    }
    
    injectNuclearCSS() {
        const nuclearStyle = document.createElement('style');
        nuclearStyle.id = 'nuclear-guide-icons-css';
        nuclearStyle.textContent = `
            /* 核レベルアイコンCSS */
            .nuclear-icon-container {
                position: absolute !important;
                top: 12px !important;
                right: 12px !important;
                z-index: 99999 !important;
                display: flex !important;
                gap: 10px !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }
            
            .nuclear-bookmark-btn,
            .nuclear-compare-btn {
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
                border: 3px solid !important;
                font-size: 18px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                z-index: 99999 !important;
                position: relative !important;
            }
            
            .nuclear-bookmark-btn {
                border-color: #ffc107 !important;
                background: rgba(255, 193, 7, 0.9) !important;
                color: #fff !important;
            }
            
            .nuclear-bookmark-btn.bookmarked {
                background: rgba(255, 193, 7, 1) !important;
                box-shadow: 0 4px 15px rgba(255, 193, 7, 0.5) !important;
            }
            
            .nuclear-compare-btn {
                border-color: #28a745 !important;
                background: rgba(40, 167, 69, 0.9) !important;
                color: #fff !important;
            }
            
            .nuclear-compare-btn.compared {
                background: rgba(40, 167, 69, 1) !important;
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.5) !important;
            }
            
            .nuclear-bookmark-btn:hover,
            .nuclear-compare-btn:hover {
                transform: scale(1.15) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important;
            }
            
            /* 干渉防止 */
            .guide-card,
            .card {
                position: relative !important;
                overflow: visible !important;
            }
            
            /* 核レベル通知 */
            .nuclear-notification {
                position: fixed !important;
                top: 80px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                z-index: 999999 !important;
                padding: 15px 25px !important;
                border-radius: 10px !important;
                color: white !important;
                font-weight: bold !important;
                font-size: 16px !important;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
                animation: nuclear-slide-down 0.5s ease-out !important;
            }
            
            @keyframes nuclear-slide-down {
                0% { transform: translateX(-50%) translateY(-50px); opacity: 0; }
                100% { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(nuclearStyle);
        console.log('☢️ 核レベルCSS注入完了');
    }
    
    nuclearAddIcons() {
        console.log('☢️ 核レベルアイコン追加開始');
        
        // より広範囲でガイドカードを検索
        const selectors = [
            '.guide-card',
            '.card',
            '[class*="card"]',
            'div[style*="card"]',
            '.col-md-4',
            '.col-lg-4',
            '.col-sm-6'
        ];
        
        let allCards = [];
        selectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            cards.forEach(card => {
                // 画像とテキストが含まれているカードのみ
                const hasImage = card.querySelector('img');
                const hasText = card.textContent.trim().length > 10;
                
                if (hasImage && hasText && !allCards.includes(card)) {
                    allCards.push(card);
                }
            });
        });
        
        console.log(`☢️ 検出されたカード数: ${allCards.length}`);
        
        let processedCount = 0;
        allCards.forEach((card, index) => {
            try {
                const cardId = this.generateCardId(card, index);
                
                // 既に処理済みの場合はスキップ
                if (this.processedCards.has(cardId)) {
                    return;
                }
                
                // 既存のアイコンコンテナを削除
                const existingContainers = card.querySelectorAll('.nuclear-icon-container, .guide-card-icons, .ultimate-icon-container');
                existingContainers.forEach(container => container.remove());
                
                // 新しいアイコンコンテナを作成
                const iconContainer = this.createNuclearIconContainer(cardId);
                
                // カードに追加
                card.style.position = 'relative';
                card.style.overflow = 'visible';
                card.appendChild(iconContainer);
                
                this.processedCards.add(cardId);
                processedCount++;
                
                console.log(`☢️ カード[${index}] ID:${cardId} に核レベルアイコン追加`);
                
            } catch (error) {
                console.error(`❌ カード[${index}]処理エラー:`, error);
            }
        });
        
        console.log(`☢️ ${processedCount}個のカードに核レベルアイコンを追加`);
        this.updateNuclearCounts();
    }
    
    generateCardId(card, fallbackIndex) {
        // カードからIDを生成
        const titleElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-title, [class*="title"]');
        
        for (let titleElement of titleElements) {
            const text = titleElement.textContent.trim();
            if (text && text.length > 2) {
                // 名前部分を抽出
                const name = text.split('（')[0].split('(')[0].split('・')[0].trim();
                if (name) return name;
            }
        }
        
        // テキストベースのID生成
        const allText = card.textContent.trim();
        const words = allText.split(/\s+/).filter(word => word.length > 1);
        if (words.length > 0) {
            return words[0];
        }
        
        // フォールバック
        return `ガイド${fallbackIndex + 1}`;
    }
    
    createNuclearIconContainer(guideId) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'nuclear-icon-container';
        
        // ブックマークボタン
        const bookmarkBtn = this.createNuclearBookmarkButton(guideId);
        
        // 比較ボタン
        const compareBtn = this.createNuclearCompareButton(guideId);
        
        iconContainer.appendChild(bookmarkBtn);
        iconContainer.appendChild(compareBtn);
        
        return iconContainer;
    }
    
    createNuclearBookmarkButton(guideId) {
        const isBookmarked = this.bookmarkedGuides.includes(guideId);
        
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = `nuclear-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`;
        bookmarkBtn.dataset.guideId = guideId;
        bookmarkBtn.innerHTML = `<i class="bi ${isBookmarked ? 'bi-star-fill' : 'bi-star'}"></i>`;
        
        // 核レベルイベントリスナー
        bookmarkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.nuclearToggleBookmark(guideId, bookmarkBtn);
        }, true);
        
        // タッチイベントも追加
        bookmarkBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nuclearToggleBookmark(guideId, bookmarkBtn);
        }, true);
        
        return bookmarkBtn;
    }
    
    createNuclearCompareButton(guideId) {
        const isCompared = this.comparedGuides.includes(guideId);
        
        const compareBtn = document.createElement('button');
        compareBtn.className = `nuclear-compare-btn ${isCompared ? 'compared' : ''}`;
        compareBtn.dataset.guideId = guideId;
        compareBtn.innerHTML = `<i class="bi ${isCompared ? 'bi-check-circle-fill' : 'bi-check-circle'}"></i>`;
        
        // 核レベルイベントリスナー
        compareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.nuclearToggleCompare(guideId, compareBtn);
        }, true);
        
        // タッチイベントも追加
        compareBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nuclearToggleCompare(guideId, compareBtn);
        }, true);
        
        return compareBtn;
    }
    
    nuclearToggleBookmark(guideId, button) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // ブックマークに追加
            this.bookmarkedGuides.push(guideId);
            icon.className = 'bi bi-star-fill';
            button.classList.add('bookmarked');
            this.showNuclearNotification(`⭐ ${guideId}をブックマークに追加`, 'success');
        } else {
            // ブックマークから削除
            this.bookmarkedGuides.splice(index, 1);
            icon.className = 'bi bi-star';
            button.classList.remove('bookmarked');
            this.showNuclearNotification(`⭐ ${guideId}をブックマークから削除`, 'info');
        }
        
        // 核レベル視覚効果
        button.style.transform = 'scale(0.8)';
        setTimeout(() => {
            button.style.transform = 'scale(1.0)';
        }, 200);
        
        this.saveNuclearData();
        this.updateNuclearCounts();
        
        console.log(`☢️ ${guideId}ブックマーク状態変更: ${index === -1 ? '追加' : '削除'}`);
    }
    
    nuclearToggleCompare(guideId, button) {
        const index = this.comparedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // 比較に追加
            if (this.comparedGuides.length >= this.maxCompareGuides) {
                this.showNuclearNotification(`🔍 比較は最大${this.maxCompareGuides}人まで`, 'warning');
                return;
            }
            
            this.comparedGuides.push(guideId);
            icon.className = 'bi bi-check-circle-fill';
            button.classList.add('compared');
            this.showNuclearNotification(`🔍 ${guideId}を比較に追加 (${this.comparedGuides.length}/${this.maxCompareGuides})`, 'success');
        } else {
            // 比較から削除
            this.comparedGuides.splice(index, 1);
            icon.className = 'bi bi-check-circle';
            button.classList.remove('compared');
            this.showNuclearNotification(`🔍 ${guideId}を比較から削除`, 'info');
        }
        
        // 核レベル視覚効果
        button.style.transform = 'scale(0.8)';
        setTimeout(() => {
            button.style.transform = 'scale(1.0)';
        }, 200);
        
        this.saveNuclearData();
        this.updateNuclearCounts();
        
        console.log(`☢️ ${guideId}比較状態変更: ${index === -1 ? '追加' : '削除'}`);
    }
    
    saveNuclearData() {
        localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
        localStorage.setItem('comparedGuides', JSON.stringify(this.comparedGuides));
    }
    
    updateNuclearCounts() {
        // 全てのカウント要素を更新
        const countSelectors = [
            '#emergency-bookmark-count',
            '#emergency-compare-count',
            '#force-bookmark-count',
            '#force-compare-count',
            '#visible-bookmark-count',
            '#visible-compare-count',
            '[id*="bookmark-count"]',
            '[id*="compare-count"]'
        ];
        
        countSelectors.forEach(selector => {
            if (selector.includes('bookmark')) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) element.textContent = this.bookmarkedGuides.length;
                });
            } else if (selector.includes('compare')) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) element.textContent = this.comparedGuides.length;
                });
            }
        });
        
        console.log(`☢️ 核レベルカウント更新: ブックマーク${this.bookmarkedGuides.length}件, 比較${this.comparedGuides.length}件`);
    }
    
    showNuclearNotification(message, type = 'info') {
        // 既存の通知を削除
        const existingNotifications = document.querySelectorAll('.nuclear-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = 'nuclear-notification';
        
        // タイプに応じて色を設定
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(45deg, #ffc107, #fd7e14)';
                notification.style.color = '#000';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #dc3545, #e74c3c)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #17a2b8, #6f42c1)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 4秒後に削除
        setTimeout(() => {
            notification.style.animation = 'nuclear-slide-up 0.5s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }, 4000);
        
        // アニメーション追加
        const slideUpStyle = document.createElement('style');
        slideUpStyle.textContent = `
            @keyframes nuclear-slide-up {
                0% { transform: translateX(-50%) translateY(0); opacity: 1; }
                100% { transform: translateX(-50%) translateY(-50px); opacity: 0; }
            }
        `;
        if (!document.querySelector('[data-anim="slide-up"]')) {
            slideUpStyle.setAttribute('data-anim', 'slide-up');
            document.head.appendChild(slideUpStyle);
        }
    }
    
    nuclearMaintainIcons() {
        console.log('☢️ 核レベル保守点検');
        
        // アイコンが削除されたカードを検出
        const allCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
        let missingIconsCount = 0;
        
        allCards.forEach(card => {
            const hasImage = card.querySelector('img');
            const hasText = card.textContent.trim().length > 10;
            const hasIcons = card.querySelector('.nuclear-icon-container');
            
            if (hasImage && hasText && !hasIcons) {
                missingIconsCount++;
            }
        });
        
        if (missingIconsCount > 0) {
            console.log(`☢️ ${missingIconsCount}個のカードでアイコン不足 - 核レベル復旧開始`);
            this.processedCards.clear(); // 処理済みキャッシュをクリア
            this.nuclearAddIcons();
        }
    }
    
    nuclearObserveChanges() {
        const observer = new MutationObserver((mutations) => {
            let needsNuclearUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 新しいカードまたはコンテンツの追加を検出
                            if (node.matches && (
                                node.matches('.card, .guide-card, [class*="card"]') ||
                                node.querySelector('.card, .guide-card, [class*="card"]'))) {
                                needsNuclearUpdate = true;
                            }
                        }
                    });
                    
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            node.classList && 
                            node.classList.contains('nuclear-icon-container')) {
                            // アイコンコンテナが削除された場合
                            needsNuclearUpdate = true;
                        }
                    });
                }
            });
            
            if (needsNuclearUpdate) {
                console.log('☢️ DOM変更検出 - 核レベル更新実行');
                setTimeout(() => this.nuclearAddIcons(), 1000);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
        
        console.log('☢️ 核レベルDOM監視開始');
    }
}

// 核レベルインスタンス作成
window.nuclearGuideCardIcons = new NuclearGuideCardIcons();

console.log('✅ 核レベルガイドカードアイコンシステム準備完了');