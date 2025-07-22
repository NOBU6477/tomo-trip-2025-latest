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
        try {
            console.log(`🔄 ブックマーク切り替え開始: ガイド${guideId}`);
            
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const isBookmarked = bookmarks.includes(guideId);
            const icon = button.querySelector('i');
            
            if (isBookmarked) {
                // ブックマークから削除
                const index = bookmarks.indexOf(guideId);
                bookmarks.splice(index, 1);
                
                // ボタンスタイルをリセット
                button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                button.style.color = '';
                
                // アイコンを空の星に変更
                if (icon) {
                    icon.className = 'bi bi-star';
                    icon.style.color = '#ffc107';
                }
                
                console.log(`📚 ガイド${guideId}のブックマークを解除`);
                this.showAlert('ブックマークから削除しました', 'info');
                
            } else {
                // ブックマークに追加
                bookmarks.push(guideId);
                
                // ボタンスタイルを変更
                button.style.backgroundColor = '#fff3cd';
                button.style.color = '#856404';
                
                // アイコンを塗りつぶした星に変更
                if (icon) {
                    icon.className = 'bi bi-star-fill';
                    icon.style.color = '#ffc107';
                }
                
                console.log(`📚 ガイド${guideId}をブックマークに追加`);
                this.showAlert('ブックマークに追加しました！', 'success');
            }
            
            // LocalStorageに保存
            localStorage.setItem('bookmarkedGuides', JSON.stringify(bookmarks));
            
            // ツールバーの数値を更新
            this.updateToolbarCounts();
            
            // 統一管理モーダルシステムに通知
            if (window.unifiedManagementModal) {
                window.unifiedManagementModal.refreshBookmarkData();
            }
            
            console.log(`✅ ブックマーク状態更新完了: ${bookmarks.length}件`);
            
        } catch (error) {
            console.error('❌ ブックマーク切り替えエラー:', error);
            this.showAlert('ブックマーク操作でエラーが発生しました', 'error');
        }
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
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const comparisons = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
            
            // ブックマーク状態の復元
            if (bookmarks.includes(guideId)) {
                bookmarkBtn.style.backgroundColor = '#fff3cd';
                bookmarkBtn.style.color = '#856404';
                const bookmarkIcon = bookmarkBtn.querySelector('i');
                if (bookmarkIcon) {
                    bookmarkIcon.className = 'bi bi-star-fill';
                    bookmarkIcon.style.color = '#ffc107';
                }
                console.log(`🔄 ガイド${guideId}: ブックマーク状態を復元`);
            }
            
            // 比較状態の復元
            if (comparisons.includes(guideId)) {
                compareBtn.style.backgroundColor = '#d4edda';
                compareBtn.style.color = '#155724';
                const compareIcon = compareBtn.querySelector('i');
                if (compareIcon) {
                    compareIcon.className = 'bi bi-check-circle-fill';
                    compareIcon.style.color = '#28a745';
                }
                console.log(`🔄 ガイド${guideId}: 比較状態を復元`);
            }
            
        } catch (error) {
            console.error(`❌ ガイド${guideId}の状態復元エラー:`, error);
        }
    }
    
    updateToolbarCounts() {
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const comparisons = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
            
            console.log(`📊 ツールバー更新: ブックマーク${bookmarks.length}件, 比較${comparisons.length}件`);
            
            // フローティングツールバーの更新（複数の可能なセレクタを試行）
            const toolbarSelectors = [
                '.floating-toolbar',
                '[class*="toolbar"]',
                '.btn-group'
            ];
            
            let toolbar = null;
            for (const selector of toolbarSelectors) {
                toolbar = document.querySelector(selector);
                if (toolbar) break;
            }
            
            if (toolbar) {
                // 比較ボタンの更新
                const comparingSelectors = [
                    '.floating-toolbar .btn:first-child',
                    '.floating-toolbar button:first-child',
                    '[data-bs-target="#unified-comparison-modal"]',
                    'button:contains("Comparing")',
                    'button[onclick*="comparison"]'
                ];
                
                for (const selector of comparingSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        const isJapanese = window.location.pathname.includes('index.html') || !window.location.pathname.includes('index-en.html');
                        element.textContent = isJapanese ? 
                            `比較中: ${comparisons.length}/3人` : 
                            `Comparing: ${comparisons.length}/3 people`;
                        break;
                    }
                }
                
                // ブックマークボタンの更新
                const bookmarkSelectors = [
                    '.floating-toolbar .btn:nth-child(3)',
                    '.floating-toolbar button:nth-child(3)',
                    '[data-bs-target="#unified-bookmark-modal"]',
                    'button:contains("Bookmark")',
                    'button[onclick*="bookmark"]'
                ];
                
                for (const selector of bookmarkSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        const isJapanese = window.location.pathname.includes('index.html') || !window.location.pathname.includes('index-en.html');
                        element.textContent = isJapanese ? 
                            `ブックマーク(${bookmarks.length})` : 
                            `Bookmarks(${bookmarks.length})`;
                        break;
                    }
                }
            }
            
            // 代替アプローチ: すべてのボタンをチェック
            document.querySelectorAll('button').forEach(btn => {
                const text = btn.textContent.toLowerCase();
                if (text.includes('comparing') || text.includes('比較')) {
                    const isJapanese = text.includes('比較');
                    btn.textContent = isJapanese ? 
                        `比較中: ${comparisons.length}/3人` : 
                        `Comparing: ${comparisons.length}/3 people`;
                } else if (text.includes('bookmark') || text.includes('ブックマーク')) {
                    const isJapanese = text.includes('ブックマーク');
                    btn.textContent = isJapanese ? 
                        `ブックマーク(${bookmarks.length})` : 
                        `Bookmarks(${bookmarks.length})`;
                }
            });
            
        } catch (error) {
            console.error('❌ ツールバー更新エラー:', error);
        }
    }
    
    showAlert(message, type = 'info') {
        // アラート表示システム
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`;
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
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(alertContainer);
        
        // 閉じるボタンのイベント
        alertContainer.querySelector('.btn-close').addEventListener('click', () => {
            alertContainer.remove();
        });
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.remove();
            }
        }, 3000);
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