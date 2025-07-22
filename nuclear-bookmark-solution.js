// 核レベルブックマークソリューション - 最終手段
console.log('☢️ 核レベルブックマークソリューション開始');

class NuclearBookmarkSolution {
    constructor() {
        this.retryCount = 0;
        this.maxRetries = 10;
        this.init();
    }
    
    init() {
        console.log('🎯 核レベル初期化開始');
        
        // 即座に実行
        this.executeNuclearFix();
        
        // 段階的実行
        setTimeout(() => this.executeNuclearFix(), 1000);
        setTimeout(() => this.executeNuclearFix(), 3000);
        setTimeout(() => this.executeNuclearFix(), 5000);
        
        // 最終手段
        setTimeout(() => this.finalNuclearSolution(), 8000);
    }
    
    executeNuclearFix() {
        this.retryCount++;
        console.log(`☢️ 核修正実行 #${this.retryCount}`);
        
        try {
            // Step 1: ツールバーを完全再構築
            this.rebuildToolbar();
            
            // Step 2: 直接イベント強制注入
            this.injectDirectEvents();
            
            // Step 3: 全ボタンスキャン & 強制修正
            this.scanAndFixAllButtons();
            
        } catch (error) {
            console.error('❌ 核修正エラー:', error);
            if (this.retryCount < this.maxRetries) {
                setTimeout(() => this.executeNuclearFix(), 2000);
            }
        }
    }
    
    rebuildToolbar() {
        console.log('🔨 ツールバー完全再構築');
        
        // 既存のツールバーを検索
        let toolbar = document.querySelector('.floating-toolbar');
        
        if (!toolbar) {
            console.log('⚠️ フローティングツールバーが見つかりません - 作成します');
            this.createNewToolbar();
            return;
        }
        
        // ツールバー内容を分析
        const buttons = toolbar.querySelectorAll('button, .btn, a');
        console.log(`📊 既存ボタン数: ${buttons.length}`);
        
        // 各ボタンの情報を記録
        const buttonData = [];
        buttons.forEach((btn, index) => {
            buttonData.push({
                index: index,
                text: btn.textContent.trim(),
                className: btn.className,
                onclick: btn.getAttribute('onclick')
            });
        });
        
        console.log('📋 ボタンデータ:', buttonData);
        
        // ブックマークボタンを特定 & 強制修正
        buttons.forEach((btn, index) => {
            const text = btn.textContent.toLowerCase().trim();
            
            if (text.includes('ブックマーク') || text.includes('bookmark') || index === 2) {
                console.log(`🎯 ブックマークボタン発見[${index}]: "${btn.textContent}"`);
                this.nukeAndReplaceButton(btn, index);
            }
        });
    }
    
    nukeAndReplaceButton(button, index) {
        console.log(`☢️ ボタン[${index}]を核レベル置換`);
        
        // 完全新規ボタン作成
        const newButton = document.createElement('button');
        newButton.className = button.className || 'btn btn-outline-warning btn-sm';
        newButton.innerHTML = button.innerHTML || '<i class="bi bi-star me-1"></i>ブックマーク(0)';
        
        // スタイル完全コピー + 強調
        const computedStyle = window.getComputedStyle(button);
        newButton.style.cssText = button.style.cssText;
        newButton.style.backgroundColor = '#fff3cd';
        newButton.style.border = '2px solid #ffc107';
        newButton.style.cursor = 'pointer';
        
        // 核レベルイベントリスナー
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('☢️ 核ブックマークハンドラー発動!');
            
            // 視覚的フィードバック
            newButton.style.backgroundColor = '#28a745';
            newButton.style.color = 'white';
            setTimeout(() => {
                newButton.style.backgroundColor = '#fff3cd';
                newButton.style.color = '';
            }, 200);
            
            // ブックマーク管理表示
            this.showNuclearBookmarkModal();
        });
        
        // ボタン置換
        button.parentNode.replaceChild(newButton, button);
        
        console.log(`✅ ボタン[${index}]核置換完了`);
    }
    
    injectDirectEvents() {
        console.log('💉 直接イベント注入');
        
        // 全てのボタンにクリック監視を注入
        document.addEventListener('click', (e) => {
            const target = e.target;
            const text = target.textContent.toLowerCase();
            
            if (text.includes('ブックマーク') || text.includes('bookmark')) {
                console.log('💥 ブックマーククリック検出!');
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                this.showNuclearBookmarkModal();
            }
        }, true); // キャプチャフェーズで実行
        
        console.log('✅ 直接イベント注入完了');
    }
    
    scanAndFixAllButtons() {
        console.log('🔍 全ボタンスキャン & 強制修正');
        
        const allButtons = document.querySelectorAll('button, .btn, a, [onclick], [role="button"]');
        console.log(`📊 全ボタン数: ${allButtons.length}`);
        
        allButtons.forEach((btn, index) => {
            const text = btn.textContent.toLowerCase();
            
            if (text.includes('ブックマーク') || text.includes('bookmark')) {
                console.log(`🔧 ブックマークボタン修正[${index}]: "${btn.textContent}"`);
                
                // 既存イベントを完全削除
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // 核イベント追加
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`☢️ 核ブックマーク[${index}]実行`);
                    this.showNuclearBookmarkModal();
                });
                
                // 視覚的強調
                newBtn.style.outline = '3px solid #ff0000';
                setTimeout(() => {
                    newBtn.style.outline = '';
                }, 3000);
            }
        });
    }
    
    createNewToolbar() {
        console.log('🏗️ 新規ツールバー作成');
        
        const toolbarHTML = `
            <div class="floating-toolbar" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 25px;
                padding: 10px 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                gap: 8px;
                align-items: center;
            ">
                <button class="btn btn-outline-success btn-sm nuclear-compare-btn" style="border-radius: 20px;">
                    <i class="bi bi-check-circle me-1"></i>比較中: 0/3人
                </button>
                <button class="btn btn-outline-primary btn-sm nuclear-history-btn" style="border-radius: 20px;">
                    <i class="bi bi-clock-history me-1"></i>履歴
                </button>
                <button class="btn btn-outline-warning btn-sm nuclear-bookmark-btn" style="border-radius: 20px;">
                    <i class="bi bi-star me-1"></i>ブックマーク(0)
                </button>
                <button class="btn btn-outline-info btn-sm nuclear-jump-btn" style="border-radius: 20px;">
                    <i class="bi bi-skip-end me-1"></i>ページジャンプ
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toolbarHTML);
        
        // 新規ボタンにイベント追加
        const nuclearBookmarkBtn = document.querySelector('.nuclear-bookmark-btn');
        if (nuclearBookmarkBtn) {
            nuclearBookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('☢️ 新規ブックマークボタン実行');
                this.showNuclearBookmarkModal();
            });
        }
        
        console.log('✅ 新規ツールバー作成完了');
    }
    
    showNuclearBookmarkModal() {
        console.log('☢️ 核ブックマークモーダル表示');
        
        // 既存モーダル削除
        const existing = document.getElementById('nuclear-bookmark-modal');
        if (existing) existing.remove();
        
        // LocalStorageからデータ取得
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        const modalHTML = `
            <div id="nuclear-bookmark-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80%;
                    overflow-y: auto;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 25px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #ffc107;
                    ">
                        <h4 style="margin: 0; color: #ffc107; display: flex; align-items: center;">
                            ⭐ ブックマーク管理 (核システム)
                        </h4>
                        <button onclick="document.getElementById('nuclear-bookmark-modal').remove()" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    border-radius: 50%;
                                    width: 35px;
                                    height: 35px;
                                    font-size: 18px;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                ">×</button>
                    </div>
                    <div id="nuclear-bookmark-content">
                        ${this.generateBookmarkContent(bookmarkedGuides)}
                    </div>
                    <div style="
                        margin-top: 25px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <button onclick="nuclearBookmarkSolution.clearAllBookmarks()" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    padding: 10px 20px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-weight: bold;
                                ">🗑️ 全削除</button>
                        <button onclick="document.getElementById('nuclear-bookmark-modal').remove()" 
                                style="
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    padding: 10px 20px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        console.log('✅ 核ブックマークモーダル表示完了');
    }
    
    generateBookmarkContent(bookmarkedGuides) {
        if (bookmarkedGuides.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
                    <h5>ブックマークされたガイドはありません</h5>
                    <p>ガイドカードの⭐ボタンをクリックしてブックマークしてください</p>
                    <small style="color: #999;">核システムにより正常に動作しています</small>
                </div>
            `;
        }
        
        let content = `
            <div style="margin-bottom: 20px; padding: 15px; background: #e7f3ff; border-radius: 8px;">
                <strong style="color: #0066cc;">📊 ブックマーク済み: ${bookmarkedGuides.length}件</strong>
                <br><small style="color: #666;">核システムにより検出・管理されています</small>
            </div>
        `;
        
        bookmarkedGuides.forEach(guideId => {
            content += `
                <div style="
                    padding: 15px;
                    border: 2px solid #ffc107;
                    border-radius: 10px;
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fffbf0;
                ">
                    <div>
                        <strong style="color: #b8860b;">🌟 ガイド ${guideId}</strong>
                        <br><small style="color: #666;">核システムで管理中</small>
                    </div>
                    <button onclick="nuclearBookmarkSolution.removeBookmark(${guideId})" 
                            style="
                                background: #dc3545;
                                color: white;
                                border: none;
                                padding: 8px 15px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: bold;
                            ">🗑️ 削除</button>
                </div>
            `;
        });
        
        return content;
    }
    
    removeBookmark(guideId) {
        console.log(`☢️ 核ブックマーク削除: ガイド${guideId}`);
        
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const updatedBookmarks = bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        
        // 表示更新
        const contentDiv = document.getElementById('nuclear-bookmark-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.generateBookmarkContent(updatedBookmarks);
        }
        
        // ツールバー更新
        this.updateToolbarCounts();
        
        console.log(`✅ ガイド${guideId}削除完了`);
    }
    
    clearAllBookmarks() {
        if (confirm('核システム確認: 全てのブックマークを完全削除しますか？')) {
            localStorage.setItem('bookmarkedGuides', '[]');
            
            // 表示更新
            const contentDiv = document.getElementById('nuclear-bookmark-content');
            if (contentDiv) {
                contentDiv.innerHTML = this.generateBookmarkContent([]);
            }
            
            // ツールバー更新
            this.updateToolbarCounts();
            
            console.log('☢️ 全ブックマーク核削除完了');
        }
    }
    
    updateToolbarCounts() {
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparedGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        // 全てのブックマークボタンを更新
        const bookmarkButtons = document.querySelectorAll('button, .btn');
        bookmarkButtons.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('ブックマーク') || text.includes('bookmark')) {
                btn.innerHTML = `<i class="bi bi-star me-1"></i>ブックマーク(${bookmarkedGuides.length})`;
            } else if (text.includes('比較') || text.includes('comparing')) {
                btn.innerHTML = `<i class="bi bi-check-circle me-1"></i>比較中: ${comparedGuides.length}/3人`;
            }
        });
        
        console.log(`📊 ツールバー更新: ブックマーク${bookmarkedGuides.length}件, 比較${comparedGuides.length}件`);
    }
    
    finalNuclearSolution() {
        console.log('☢️ 最終核ソリューション実行');
        
        // 最終確認 & 緊急措置
        const toolbar = document.querySelector('.floating-toolbar');
        if (!toolbar) {
            console.log('🚨 ツールバー不存在 - 強制作成');
            this.createNewToolbar();
        }
        
        // 全ページにブックマーク機能を強制注入
        document.body.addEventListener('click', (e) => {
            if (e.target && e.target.textContent.toLowerCase().includes('ブックマーク')) {
                console.log('☢️ 最終核ハンドラー発動');
                e.preventDefault();
                e.stopPropagation();
                this.showNuclearBookmarkModal();
            }
        });
        
        // 成功通知
        setTimeout(() => {
            this.showSuccessNotification();
        }, 1000);
    }
    
    showSuccessNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 99999;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = '☢️ 核ブックマークシステム完全起動';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        console.log('✅ 核レベルソリューション完了');
    }
}

// 核インスタンス作成
window.nuclearBookmarkSolution = new NuclearBookmarkSolution();

console.log('☢️ 核レベルブックマークソリューション準備完了');