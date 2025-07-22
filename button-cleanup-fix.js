// ボタン重複削除システム - 丸いボタンを削除して四角いボタンのみ表示
console.log('🔘 ボタン重複削除システム開始');

class ButtonCleanupFix {
    constructor() {
        this.init();
    }
    
    init() {
        this.removeCircularButtons();
        this.ensureSquareButtonsOnly();
        this.setupContinuousMonitoring();
    }
    
    removeCircularButtons() {
        console.log('🗑️ 丸いボタンを削除中...');
        
        // 丸いボタンを特定して削除
        const circularButtons = document.querySelectorAll(`
            button[style*="border-radius: 50%"],
            .btn[style*="border-radius: 50%"],
            .ultimate-bookmark-btn[style*="border-radius: 50%"],
            .ultimate-compare-btn[style*="border-radius: 50%"],
            .ultimate-english-bookmark-btn[style*="border-radius: 50%"],
            .ultimate-english-compare-btn[style*="border-radius: 50%"]
        `);
        
        let removedCount = 0;
        circularButtons.forEach(button => {
            if (button.style.borderRadius === '50%' || button.style.borderRadius.includes('50%')) {
                console.log(`🗑️ 丸いボタンを削除: ${button.className}`);
                button.remove();
                removedCount++;
            }
        });
        
        console.log(`✅ ${removedCount}個の丸いボタンを削除`);
    }
    
    ensureSquareButtonsOnly() {
        console.log('🔲 四角いボタンのみ表示確認中...');
        
        // 各ガイドカードを確認
        const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
        
        guideCards.forEach((card, index) => {
            try {
                const img = card.querySelector('img');
                if (!img) return;
                
                // 既存のボタンをすべて削除
                const allButtons = card.querySelectorAll('.bookmark-btn, .compare-btn, button[data-guide-id]');
                allButtons.forEach(btn => btn.remove());
                
                // 既存のアイコンコンテナも削除
                const iconContainers = card.querySelectorAll('.ultimate-icon-container, .icon-container-jp, .japanese-icon-container');
                iconContainers.forEach(container => container.remove());
                
                const guideId = index + 1;
                
                // 画像の親要素を取得
                let imgContainer = img.parentElement;
                imgContainer.style.position = 'relative';
                
                // 新しいアイコンコンテナ作成
                const iconContainer = document.createElement('div');
                iconContainer.className = 'square-button-container';
                iconContainer.style.cssText = `
                    position: absolute !important;
                    top: 8px !important;
                    left: 8px !important;
                    z-index: 2000 !important;
                    display: flex !important;
                    gap: 4px !important;
                    pointer-events: auto !important;
                `;
                
                // 四角いブックマークボタン作成
                const bookmarkBtn = this.createSquareButton('bookmark', guideId, {
                    icon: 'bi-star',
                    color: '#ffc107',
                    title: 'このガイドをブックマーク'
                });
                
                // 四角い比較ボタン作成
                const compareBtn = this.createSquareButton('compare', guideId, {
                    icon: 'bi-check-circle',
                    color: '#28a745',
                    title: '比較に追加'
                });
                
                iconContainer.appendChild(bookmarkBtn);
                iconContainer.appendChild(compareBtn);
                imgContainer.appendChild(iconContainer);
                
                // 既存の選択状態を復元
                this.restoreButtonState(bookmarkBtn, compareBtn, guideId);
                
            } catch (error) {
                console.error(`❌ カード${index + 1}ボタン修正エラー:`, error);
            }
        });
        
        console.log(`✅ 四角いボタンシステムを適用`);
    }
    
    createSquareButton(type, guideId, config) {
        const button = document.createElement('button');
        button.className = `btn btn-sm btn-light ${type}-btn square-${type}-btn`;
        button.setAttribute('data-guide-id', guideId);
        button.setAttribute('title', config.title);
        
        // 四角いスタイル
        button.style.cssText = `
            border-radius: 6px !important;
            width: 32px !important;
            height: 32px !important;
            padding: 0 !important;
            border: 1px solid rgba(255,255,255,0.8) !important;
            background-color: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(6px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
            position: relative !important;
            z-index: 2001 !important;
        `;
        
        // アイコン作成
        const icon = document.createElement('i');
        icon.className = `bi ${config.icon}`;
        icon.style.cssText = `
            color: ${config.color} !important;
            font-size: 14px !important;
            line-height: 1 !important;
            pointer-events: none !important;
        `;
        
        button.appendChild(icon);
        
        // ホバーエフェクト
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
        });
        
        // クリックイベント
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (type === 'bookmark') {
                this.toggleBookmark(guideId, button);
            } else if (type === 'compare') {
                this.toggleComparison(guideId, button);
            }
        });
        
        return button;
    }
    
    toggleBookmark(guideId, button) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const isBookmarked = bookmarks.includes(guideId);
        
        if (isBookmarked) {
            const index = bookmarks.indexOf(guideId);
            bookmarks.splice(index, 1);
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            console.log(`📚 ガイド${guideId}のブックマークを解除`);
        } else {
            bookmarks.push(guideId);
            button.style.backgroundColor = '#ffc107';
            button.style.color = 'white';
            console.log(`📚 ガイド${guideId}をブックマークに追加`);
        }
        
        localStorage.setItem('bookmarkedGuides', JSON.stringify(bookmarks));
        this.updateToolbarCounts();
    }
    
    toggleComparison(guideId, button) {
        const comparisons = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        const isComparing = comparisons.includes(guideId);
        
        if (isComparing) {
            const index = comparisons.indexOf(guideId);
            comparisons.splice(index, 1);
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            console.log(`🔍 ガイド${guideId}を比較から削除`);
        } else {
            if (comparisons.length >= 3) {
                alert('比較できるのは最大3人までです');
                return;
            }
            comparisons.push(guideId);
            button.style.backgroundColor = '#28a745';
            button.style.color = 'white';
            console.log(`🔍 ガイド${guideId}を比較に追加`);
        }
        
        localStorage.setItem('comparisonGuides', JSON.stringify(comparisons));
        this.updateToolbarCounts();
    }
    
    restoreButtonState(bookmarkBtn, compareBtn, guideId) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparisons = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        if (bookmarks.includes(guideId)) {
            bookmarkBtn.style.backgroundColor = '#ffc107';
            bookmarkBtn.style.color = 'white';
        }
        
        if (comparisons.includes(guideId)) {
            compareBtn.style.backgroundColor = '#28a745';
            compareBtn.style.color = 'white';
        }
    }
    
    updateToolbarCounts() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparisons = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        // フローティングツールバーの更新
        const comparingElement = document.querySelector('.floating-toolbar .btn:first-child');
        if (comparingElement) {
            comparingElement.textContent = `Comparing: ${comparisons.length}/3 people`;
        }
        
        const bookmarksElement = document.querySelector('.floating-toolbar .btn:nth-child(3)');
        if (bookmarksElement) {
            bookmarksElement.textContent = `Bookmarks(${bookmarks.length})`;
        }
    }
    
    setupContinuousMonitoring() {
        // DOM変更を監視して丸いボタンが追加されたら即座に削除
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 丸いボタンが追加された場合は削除
                            const circularButtons = node.querySelectorAll ? 
                                node.querySelectorAll('button[style*="border-radius: 50%"], .btn[style*="border-radius: 50%"]') : [];
                            
                            circularButtons.forEach(btn => {
                                console.log('🗑️ 新しく追加された丸いボタンを削除');
                                btn.remove();
                            });
                            
                            // ノード自体が丸いボタンの場合
                            if (node.style && (node.style.borderRadius === '50%' || node.style.borderRadius.includes('50%'))) {
                                console.log('🗑️ 丸いボタンノードを削除');
                                node.remove();
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 定期的なクリーンアップ
        setInterval(() => {
            this.removeCircularButtons();
        }, 5000);
        
        console.log('👁️ 継続的な監視システムを開始');
    }
}

// グローバルインスタンス作成
window.buttonCleanupFix = new ButtonCleanupFix();

console.log('✅ Button Cleanup Fix Loaded - 丸いボタンを削除し四角いボタンのみ表示します');