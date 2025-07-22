// ガイドカードアイコン追加システム
console.log('🎯 ガイドカードアイコン追加システム開始');

class GuideCardIcons {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.init();
    }
    
    init() {
        console.log('🔧 ガイドカードアイコン初期化');
        
        // 即座に実行
        this.addIconsToGuideCards();
        
        // DOMContentLoaded後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.addIconsToGuideCards());
        }
        
        // 段階的実行
        setTimeout(() => this.addIconsToGuideCards(), 1000);
        setTimeout(() => this.addIconsToGuideCards(), 3000);
        setTimeout(() => this.addIconsToGuideCards(), 5000);
        
        // 継続監視
        setInterval(() => this.maintainIcons(), 5000);
        
        // DOM変更監視
        this.observeCardChanges();
    }
    
    addIconsToGuideCards() {
        console.log('🎯 ガイドカードアイコン追加開始');
        
        // ガイドカードを検索
        const guideCards = document.querySelectorAll('.card, .guide-card, [class*="card"]');
        let processedCount = 0;
        
        guideCards.forEach((card, index) => {
            try {
                // 画像とタイトルがあるカードのみ処理
                const img = card.querySelector('img');
                const title = card.querySelector('h5, h6, .card-title, [class*="title"]');
                
                if (!img || !title) return;
                
                // ガイドIDを取得または生成
                let guideId = this.extractGuideId(card, index);
                
                // 既存のアイコンを削除
                const existingIcons = card.querySelectorAll('.guide-card-icons, .bookmark-btn, .compare-btn');
                existingIcons.forEach(icon => icon.remove());
                
                // アイコンコンテナを作成
                const iconContainer = this.createIconContainer(guideId);
                
                // カードの右上に追加
                card.style.position = 'relative';
                card.appendChild(iconContainer);
                
                processedCount++;
                console.log(`✅ ガイドカード[${index}] ID:${guideId} にアイコン追加`);
                
            } catch (error) {
                console.error(`❌ ガイドカード[${index}]処理エラー:`, error);
            }
        });
        
        console.log(`📊 ${processedCount}個のガイドカードにアイコンを追加しました`);
        
        // ツールバーのカウントも更新
        this.updateToolbarCounts();
    }
    
    extractGuideId(card, fallbackIndex) {
        // カードからガイドIDを抽出
        const titleElement = card.querySelector('h5, h6, .card-title');
        if (titleElement) {
            const titleText = titleElement.textContent.trim();
            
            // タイトルから名前を抽出してIDとして使用
            const name = titleText.split('（')[0].split('(')[0].trim();
            if (name) {
                return name;
            }
        }
        
        // フォールバック: インデックスをIDとして使用
        return fallbackIndex + 1;
    }
    
    createIconContainer(guideId) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'guide-card-icons';
        iconContainer.style.cssText = `
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
            z-index: 10 !important;
            display: flex !important;
            gap: 8px !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        // ブックマークボタン
        const bookmarkBtn = this.createBookmarkButton(guideId);
        
        // 比較ボタン
        const compareBtn = this.createCompareButton(guideId);
        
        iconContainer.appendChild(bookmarkBtn);
        iconContainer.appendChild(compareBtn);
        
        return iconContainer;
    }
    
    createBookmarkButton(guideId) {
        const isBookmarked = this.bookmarkedGuides.includes(guideId);
        
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.dataset.guideId = guideId;
        
        bookmarkBtn.innerHTML = `<i class="bi ${isBookmarked ? 'bi-star-fill' : 'bi-star'}"></i>`;
        
        bookmarkBtn.style.cssText = `
            width: 35px !important;
            height: 35px !important;
            border-radius: 50% !important;
            border: 2px solid #ffc107 !important;
            background: ${isBookmarked ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 255, 255, 0.9)'} !important;
            color: #ffc107 !important;
            font-size: 16px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            transition: all 0.3s ease !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 20 !important;
        `;
        
        // イベントリスナー
        bookmarkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleBookmark(guideId, bookmarkBtn);
        });
        
        // ホバー効果
        bookmarkBtn.addEventListener('mouseenter', () => {
            bookmarkBtn.style.transform = 'scale(1.1)';
            bookmarkBtn.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.4)';
        });
        
        bookmarkBtn.addEventListener('mouseleave', () => {
            bookmarkBtn.style.transform = 'scale(1.0)';
            bookmarkBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });
        
        return bookmarkBtn;
    }
    
    createCompareButton(guideId) {
        const isCompared = this.comparedGuides.includes(guideId);
        
        const compareBtn = document.createElement('button');
        compareBtn.className = 'compare-btn';
        compareBtn.dataset.guideId = guideId;
        
        compareBtn.innerHTML = `<i class="bi ${isCompared ? 'bi-check-circle-fill' : 'bi-check-circle'}"></i>`;
        
        compareBtn.style.cssText = `
            width: 35px !important;
            height: 35px !important;
            border-radius: 50% !important;
            border: 2px solid #28a745 !important;
            background: ${isCompared ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 255, 255, 0.9)'} !important;
            color: #28a745 !important;
            font-size: 16px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            transition: all 0.3s ease !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 20 !important;
        `;
        
        // イベントリスナー
        compareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleComparison(guideId, compareBtn);
        });
        
        // ホバー効果
        compareBtn.addEventListener('mouseenter', () => {
            compareBtn.style.transform = 'scale(1.1)';
            compareBtn.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
        });
        
        compareBtn.addEventListener('mouseleave', () => {
            compareBtn.style.transform = 'scale(1.0)';
            compareBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });
        
        return compareBtn;
    }
    
    toggleBookmark(guideId, button) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // ブックマークに追加
            this.bookmarkedGuides.push(guideId);
            icon.className = 'bi bi-star-fill';
            button.style.backgroundColor = 'rgba(255, 193, 7, 0.3)';
            this.showNotification(`⭐ ${guideId}をブックマークに追加しました`, 'success');
        } else {
            // ブックマークから削除
            this.bookmarkedGuides.splice(index, 1);
            icon.className = 'bi bi-star';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            this.showNotification(`⭐ ${guideId}をブックマークから削除しました`, 'info');
        }
        
        // 視覚的フィードバック
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1.0)';
        }, 150);
        
        this.saveBookmarks();
        this.updateToolbarCounts();
        
        console.log(`⭐ ガイド${guideId}のブックマーク状態変更: ${index === -1 ? '追加' : '削除'}`);
    }
    
    toggleComparison(guideId, button) {
        const index = this.comparedGuides.indexOf(guideId);
        const icon = button.querySelector('i');
        
        if (index === -1) {
            // 比較に追加
            if (this.comparedGuides.length >= this.maxCompareGuides) {
                this.showNotification(`🔍 比較できるのは最大${this.maxCompareGuides}人までです`, 'warning');
                return;
            }
            
            this.comparedGuides.push(guideId);
            icon.className = 'bi bi-check-circle-fill';
            button.style.backgroundColor = 'rgba(40, 167, 69, 0.3)';
            this.showNotification(`🔍 ${guideId}を比較に追加しました (${this.comparedGuides.length}/${this.maxCompareGuides})`, 'success');
        } else {
            // 比較から削除
            this.comparedGuides.splice(index, 1);
            icon.className = 'bi bi-check-circle';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            this.showNotification(`🔍 ${guideId}を比較から削除しました`, 'info');
        }
        
        // 視覚的フィードバック
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1.0)';
        }, 150);
        
        this.saveComparison();
        this.updateToolbarCounts();
        
        console.log(`🔍 ガイド${guideId}の比較状態変更: ${index === -1 ? '追加' : '削除'}`);
    }
    
    saveBookmarks() {
        localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
    }
    
    saveComparison() {
        localStorage.setItem('comparedGuides', JSON.stringify(this.comparedGuides));
    }
    
    updateToolbarCounts() {
        // 緊急ツールバーのカウント更新
        const emergencyBookmarkCount = document.getElementById('emergency-bookmark-count');
        const emergencyCompareCount = document.getElementById('emergency-compare-count');
        
        if (emergencyBookmarkCount) emergencyBookmarkCount.textContent = this.bookmarkedGuides.length;
        if (emergencyCompareCount) emergencyCompareCount.textContent = this.comparedGuides.length;
        
        // 他のツールバーのカウントも更新
        const allBookmarkCounts = document.querySelectorAll('#force-bookmark-count, #visible-bookmark-count, #bookmark-count');
        const allCompareCounts = document.querySelectorAll('#force-compare-count, #visible-compare-count, #compare-count');
        
        allBookmarkCounts.forEach(element => {
            if (element) element.textContent = this.bookmarkedGuides.length;
        });
        
        allCompareCounts.forEach(element => {
            if (element) element.textContent = this.comparedGuides.length;
        });
        
        console.log(`📊 ツールバーカウント更新: ブックマーク${this.bookmarkedGuides.length}件, 比較${this.comparedGuides.length}件`);
    }
    
    showNotification(message, type = 'info') {
        // 通知を表示
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999999;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        // タイプに応じて色を設定
        switch (type) {
            case 'success':
                notification.style.background = '#28a745';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#000';
                break;
            case 'error':
                notification.style.background = '#dc3545';
                break;
            default:
                notification.style.background = '#17a2b8';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 3秒後に削除
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    maintainIcons() {
        // アイコンが削除された場合の復旧
        const cardsWithoutIcons = document.querySelectorAll('.card:not(:has(.guide-card-icons)), .guide-card:not(:has(.guide-card-icons))');
        
        if (cardsWithoutIcons.length > 0) {
            console.log(`🔧 ${cardsWithoutIcons.length}個のカードでアイコンが不足 - 復旧中`);
            this.addIconsToGuideCards();
        }
    }
    
    observeCardChanges() {
        // DOM変更監視
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 新しいカードが追加された場合
                            if (node.classList.contains('card') || 
                                node.classList.contains('guide-card') ||
                                node.querySelector('.card, .guide-card')) {
                                needsUpdate = true;
                            }
                        }
                    });
                }
            });
            
            if (needsUpdate) {
                console.log('🔄 新しいカードが検出されました - アイコン追加');
                setTimeout(() => this.addIconsToGuideCards(), 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ カード変更監視開始');
    }
}

// インスタンス作成
window.guideCardIcons = new GuideCardIcons();

console.log('✅ ガイドカードアイコン追加システム準備完了');