// 日本語版ツールバー修正システム
console.log('🎯 日本語版ツールバー修正システム開始');

class JapaneseToolbarFix {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🔧 日本語版ツールバー初期化');
        
        // DOMContentLoaded後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToolbar());
        } else {
            this.setupToolbar();
        }
        
        // 段階的実行
        setTimeout(() => this.setupToolbar(), 1000);
        setTimeout(() => this.setupToolbar(), 3000);
        setTimeout(() => this.fixBookmarkButton(), 5000);
    }
    
    setupToolbar() {
        console.log('🛠️ ツールバー設定開始');
        
        // 既存のツールバーを検索
        let toolbar = document.querySelector('.floating-toolbar');
        
        if (!toolbar) {
            console.log('⚠️ フローティングツールバーが見つかりません - 作成します');
            this.createJapaneseToolbar();
            return;
        }
        
        console.log('✅ 既存ツールバー発見 - ボタンを修正します');
        this.fixExistingToolbar(toolbar);
    }
    
    createJapaneseToolbar() {
        console.log('🏗️ 日本語版ツールバー作成');
        
        // 既存のツールバーを削除
        const existingToolbars = document.querySelectorAll('.floating-toolbar, .toolbar, [class*="toolbar"]');
        existingToolbars.forEach(tb => tb.remove());
        
        const toolbarHTML = `
            <div class="floating-toolbar japanese-toolbar" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 25px;
                padding: 12px 18px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                display: flex;
                gap: 10px;
                align-items: center;
                backdrop-filter: blur(10px);
                border: 2px solid #4287f5;
            ">
                <button id="jp-compare-btn" class="btn btn-outline-success btn-sm" style="
                    border-radius: 20px;
                    padding: 8px 12px;
                    font-size: 12px;
                    border: 2px solid #28a745;
                    background: rgba(40, 167, 69, 0.1);
                ">
                    <i class="bi bi-check-circle me-1"></i>比較中: <span id="compare-count">0</span>/3人
                </button>
                
                <button id="jp-bookmark-btn" class="btn btn-outline-warning btn-sm" style="
                    border-radius: 20px;
                    padding: 8px 12px;
                    font-size: 12px;
                    border: 2px solid #ffc107;
                    background: rgba(255, 193, 7, 0.1);
                    cursor: pointer;
                ">
                    <i class="bi bi-star me-1"></i>ブックマーク(<span id="bookmark-count">0</span>)
                </button>
                
                <button id="jp-history-btn" class="btn btn-outline-info btn-sm" style="
                    border-radius: 20px;
                    padding: 8px 12px;
                    font-size: 12px;
                    border: 2px solid #17a2b8;
                    background: rgba(23, 162, 184, 0.1);
                ">
                    <i class="bi bi-clock-history me-1"></i>履歴
                </button>
                
                <button id="jp-jump-btn" class="btn btn-outline-secondary btn-sm" style="
                    border-radius: 20px;
                    padding: 8px 12px;
                    font-size: 12px;
                    border: 2px solid #6c757d;
                    background: rgba(108, 117, 125, 0.1);
                ">
                    <i class="bi bi-skip-end me-1"></i>ページジャンプ
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toolbarHTML);
        
        // イベントリスナーを追加
        this.addJapaneseEventListeners();
        
        // カウント更新
        this.updateCounts();
        
        console.log('✅ 日本語版ツールバー作成完了');
    }
    
    fixExistingToolbar(toolbar) {
        console.log('🔧 既存ツールバー修正');
        
        // ブックマークボタンを検索
        const buttons = toolbar.querySelectorAll('button, .btn, a');
        console.log(`📊 ツールバー内ボタン数: ${buttons.length}`);
        
        buttons.forEach((btn, index) => {
            const text = btn.textContent.toLowerCase().trim();
            console.log(`   ボタン[${index}]: "${btn.textContent.trim()}"`);
            
            // ブックマークボタンを特定
            if (text.includes('ブックマーク') || text.includes('bookmark') || 
                text.includes('star') || index === 2) {
                
                console.log(`🎯 ブックマークボタン発見[${index}]: "${btn.textContent}"`);
                this.enhanceBookmarkButton(btn);
            }
            
            // 比較ボタンを特定
            if (text.includes('比較') || text.includes('comparing') || 
                text.includes('compare') || index === 0) {
                
                console.log(`🎯 比較ボタン発見[${index}]: "${btn.textContent}"`);
                this.enhanceCompareButton(btn);
            }
        });
    }
    
    enhanceBookmarkButton(button) {
        console.log('⭐ ブックマークボタン強化');
        
        // ボタンに日本語ガイド管理システム用のIDを追加
        button.id = 'enhanced-bookmark-btn';
        
        // 既存のイベントリスナーを削除
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // 強化されたスタイルを適用
        newButton.style.cssText += `
            border: 3px solid #ffc107 !important;
            background: rgba(255, 193, 7, 0.2) !important;
            color: #b8860b !important;
            font-weight: bold !important;
            transform: scale(1.05) !important;
            box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3) !important;
        `;
        
        // 新しいイベントリスナーを追加
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('⭐ 強化ブックマークボタンクリック!');
            
            // 視覚的フィードバック
            newButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                newButton.style.transform = 'scale(1.05)';
            }, 150);
            
            // ブックマーク管理表示
            this.showBookmarkManagement();
        });
        
        // ホバー効果
        newButton.addEventListener('mouseenter', () => {
            newButton.style.transform = 'scale(1.1)';
            newButton.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.5)';
        });
        
        newButton.addEventListener('mouseleave', () => {
            newButton.style.transform = 'scale(1.05)';
            newButton.style.boxShadow = '0 2px 8px rgba(255, 193, 7, 0.3)';
        });
        
        console.log('✅ ブックマークボタン強化完了');
    }
    
    enhanceCompareButton(button) {
        console.log('🔍 比較ボタン強化');
        
        // ボタンに日本語ガイド管理システム用のIDを追加
        button.id = 'enhanced-compare-btn';
        
        // 既存のイベントリスナーを削除
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // 新しいイベントリスナーを追加
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔍 強化比較ボタンクリック!');
            this.showComparisonManagement();
        });
        
        console.log('✅ 比較ボタン強化完了');
    }
    
    addJapaneseEventListeners() {
        console.log('🎧 日本語版イベントリスナー追加');
        
        // ブックマークボタン
        const bookmarkBtn = document.getElementById('jp-bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('⭐ 日本語ブックマークボタンクリック!');
                this.showBookmarkManagement();
            });
            
            // ホバー効果
            bookmarkBtn.addEventListener('mouseenter', () => {
                bookmarkBtn.style.transform = 'scale(1.1)';
                bookmarkBtn.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.5)';
            });
            
            bookmarkBtn.addEventListener('mouseleave', () => {
                bookmarkBtn.style.transform = 'scale(1.0)';
                bookmarkBtn.style.boxShadow = '';
            });
        }
        
        // 比較ボタン
        const compareBtn = document.getElementById('jp-compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔍 日本語比較ボタンクリック!');
                this.showComparisonManagement();
            });
        }
        
        // 履歴ボタン
        const historyBtn = document.getElementById('jp-history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📚 履歴ボタンクリック');
                this.showHistoryModal();
            });
        }
        
        // ページジャンプボタン
        const jumpBtn = document.getElementById('jp-jump-btn');
        if (jumpBtn) {
            jumpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 ページジャンプボタンクリック');
                this.showPageJumpModal();
            });
        }
        
        console.log('✅ 日本語版イベントリスナー追加完了');
    }
    
    showBookmarkManagement() {
        console.log('⭐ ブックマーク管理表示');
        
        // 日本語ガイド管理システムが利用可能か確認
        if (window.japaneseGuideManager) {
            try {
                window.japaneseGuideManager.showBookmarkManagement();
                return;
            } catch (error) {
                console.error('❌ 日本語ガイド管理システムエラー:', error);
            }
        }
        
        // フォールバック: 独自モーダル表示
        this.showJapaneseBookmarkModal();
    }
    
    showComparisonManagement() {
        console.log('🔍 比較管理表示');
        
        // 日本語ガイド管理システムが利用可能か確認
        if (window.japaneseGuideManager) {
            try {
                window.japaneseGuideManager.showComparisonManagement();
                return;
            } catch (error) {
                console.error('❌ 日本語ガイド管理システムエラー:', error);
            }
        }
        
        // フォールバック: 独自モーダル表示
        this.showJapaneseCompareModal();
    }
    
    showJapaneseBookmarkModal() {
        console.log('📋 日本語ブックマークモーダル表示');
        
        // 既存モーダル削除
        const existing = document.getElementById('jp-bookmark-modal');
        if (existing) existing.remove();
        
        // LocalStorageからデータ取得
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        const modalHTML = `
            <div id="jp-bookmark-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
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
                    border: 3px solid #ffc107;
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
                            ⭐ ブックマーク管理 (日本語版)
                        </h4>
                        <button onclick="document.getElementById('jp-bookmark-modal').remove()" 
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
                    <div id="jp-bookmark-content">
                        ${this.generateJapaneseBookmarkContent(bookmarkedGuides)}
                    </div>
                    <div style="
                        margin-top: 25px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <button onclick="japaneseToolbarFix.clearAllBookmarks()" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    padding: 10px 20px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-weight: bold;
                                ">🗑️ 全削除</button>
                        <button onclick="document.getElementById('jp-bookmark-modal').remove()" 
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
        console.log('✅ 日本語ブックマークモーダル表示完了');
    }
    
    generateJapaneseBookmarkContent(bookmarkedGuides) {
        if (bookmarkedGuides.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
                    <h5>ブックマークされたガイドはありません</h5>
                    <p>ガイドカードの⭐ボタンをクリックしてブックマークしてください</p>
                    <small style="color: #999;">日本語版ツールバーシステムで管理されています</small>
                </div>
            `;
        }
        
        let content = `
            <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; border: 1px solid #ffc107;">
                <strong style="color: #b8860b;">📊 ブックマーク済み: ${bookmarkedGuides.length}件</strong>
                <br><small style="color: #666;">日本語版ツールバーシステムで管理されています</small>
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
                        <strong style="color: #b8860b;">⭐ ガイド ${guideId}</strong>
                        <br><small style="color: #666;">日本語版で管理中</small>
                    </div>
                    <button onclick="japaneseToolbarFix.removeBookmark(${guideId})" 
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
        console.log(`⭐ ブックマーク削除: ガイド${guideId}`);
        
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const updatedBookmarks = bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        
        // 表示更新
        const contentDiv = document.getElementById('jp-bookmark-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.generateJapaneseBookmarkContent(updatedBookmarks);
        }
        
        // カウント更新
        this.updateCounts();
        
        console.log(`✅ ガイド${guideId}削除完了`);
    }
    
    clearAllBookmarks() {
        if (confirm('日本語版確認: 全てのブックマークを削除しますか？')) {
            localStorage.setItem('bookmarkedGuides', '[]');
            
            // 表示更新
            const contentDiv = document.getElementById('jp-bookmark-content');
            if (contentDiv) {
                contentDiv.innerHTML = this.generateJapaneseBookmarkContent([]);
            }
            
            // カウント更新
            this.updateCounts();
            
            console.log('⭐ 全ブックマーク削除完了');
        }
    }
    
    updateCounts() {
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparedGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        // カウント表示更新
        const bookmarkCount = document.getElementById('bookmark-count');
        const compareCount = document.getElementById('compare-count');
        
        if (bookmarkCount) bookmarkCount.textContent = bookmarkedGuides.length;
        if (compareCount) compareCount.textContent = comparedGuides.length;
        
        // 全てのブックマークボタンを更新
        document.querySelectorAll('button, .btn').forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('ブックマーク') || text.includes('bookmark')) {
                if (btn.querySelector('span')) {
                    btn.querySelector('span').textContent = bookmarkedGuides.length;
                } else {
                    btn.innerHTML = btn.innerHTML.replace(/\(\d+\)/, `(${bookmarkedGuides.length})`);
                }
            } else if (text.includes('比較') || text.includes('comparing')) {
                if (btn.querySelector('span')) {
                    btn.querySelector('span').textContent = comparedGuides.length;
                } else {
                    btn.innerHTML = btn.innerHTML.replace(/\d+\/3/, `${comparedGuides.length}/3`);
                }
            }
        });
        
        console.log(`📊 カウント更新: ブックマーク${bookmarkedGuides.length}件, 比較${comparedGuides.length}件`);
    }
    
    showJapaneseCompareModal() {
        console.log('🔍 日本語比較モーダル表示');
        
        const comparedGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        alert(`🔍 比較機能 (日本語版)\n\n現在比較中: ${comparedGuides.length}/3人\n\nガイドカードのチェックアイコンをクリックして比較対象を選択してください。`);
    }
    
    showHistoryModal() {
        alert('📚 履歴機能\n\n閲覧履歴機能は開発中です。\n近日公開予定です。');
    }
    
    showPageJumpModal() {
        alert('🔄 ページジャンプ機能\n\nページジャンプ機能は開発中です。\n近日公開予定です。');
    }
    
    fixBookmarkButton() {
        console.log('🔧 最終ブックマークボタン修正');
        
        // 全てのブックマーク関連ボタンを検索
        const allButtons = document.querySelectorAll('button, .btn, a, [role="button"]');
        
        allButtons.forEach((btn, index) => {
            const text = btn.textContent.toLowerCase();
            
            if (text.includes('ブックマーク') || text.includes('bookmark')) {
                console.log(`🎯 ブックマークボタン発見[${index}]: "${btn.textContent}"`);
                
                // 既存イベントを削除
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // 強化イベント追加
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`⭐ 修正ブックマーク[${index}]クリック`);
                    this.showBookmarkManagement();
                });
                
                // 視覚的強調
                newBtn.style.border = '3px solid #ffc107';
                newBtn.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
                newBtn.style.fontWeight = 'bold';
                
                console.log(`✅ ブックマークボタン[${index}]修正完了`);
            }
        });
    }
}

// インスタンス作成
window.japaneseToolbarFix = new JapaneseToolbarFix();

console.log('✅ 日本語版ツールバー修正システム準備完了');