// ツールバー可視性修正システム
console.log('👁️ ツールバー可視性修正システム開始');

class ToolbarVisibilityFix {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🔧 可視性修正初期化');
        
        // 即座に実行
        this.fixToolbarVisibility();
        
        // 段階的実行
        setTimeout(() => this.fixToolbarVisibility(), 500);
        setTimeout(() => this.fixToolbarVisibility(), 1000);
        setTimeout(() => this.fixToolbarVisibility(), 2000);
        setTimeout(() => this.createVisibleToolbar(), 3000);
        
        // 継続監視
        setInterval(() => this.ensureVisibility(), 5000);
    }
    
    fixToolbarVisibility() {
        console.log('👁️ ツールバー可視性修正開始');
        
        // 隠されている可能性のある要素を検索
        const hiddenElements = document.querySelectorAll(`
            [style*="display: none"],
            [style*="display:none"],
            [style*="visibility: hidden"],
            [style*="visibility:hidden"],
            [style*="opacity: 0"],
            [style*="opacity:0"],
            .d-none,
            .hidden,
            .invisible
        `);
        
        console.log(`🔍 隠されている要素数: ${hiddenElements.length}`);
        
        hiddenElements.forEach((element, index) => {
            const text = element.textContent.toLowerCase();
            
            if (text.includes('ブックマーク') || text.includes('比較') || 
                text.includes('toolbar') || text.includes('ツールバー') ||
                element.classList.contains('floating-toolbar') ||
                element.id.includes('toolbar') || element.id.includes('force-')) {
                
                console.log(`👁️ 隠されたツールバー要素発見[${index}]: "${element.textContent.trim()}"`);
                
                // 可視化
                element.style.display = 'flex';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.classList.remove('d-none', 'hidden', 'invisible');
                
                console.log(`✅ 要素[${index}]を可視化しました`);
            }
        });
        
        // 特定のツールバーを検索して可視化
        this.makeToolbarsVisible();
    }
    
    makeToolbarsVisible() {
        console.log('🛠️ ツールバー強制可視化');
        
        // ツールバー候補を検索
        const toolbarCandidates = document.querySelectorAll(`
            .floating-toolbar,
            #force-toolbar,
            [class*="toolbar"],
            [id*="toolbar"],
            [class*="floating"],
            [style*="position: fixed"],
            [style*="bottom"],
            [style*="right"]
        `);
        
        console.log(`🔍 ツールバー候補数: ${toolbarCandidates.length}`);
        
        toolbarCandidates.forEach((toolbar, index) => {
            const text = toolbar.textContent.toLowerCase();
            
            if (text.includes('ブックマーク') || text.includes('比較') || 
                text.includes('履歴') || text.includes('ページ')) {
                
                console.log(`🎯 ツールバー発見[${index}]: "${toolbar.textContent.trim()}"`);
                
                // 強制可視化
                toolbar.style.cssText += `
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    z-index: 99999 !important;
                    background: rgba(255, 255, 255, 0.98) !important;
                    border: 3px solid #4287f5 !important;
                    border-radius: 25px !important;
                    padding: 15px 20px !important;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.25) !important;
                    backdrop-filter: blur(15px) !important;
                `;
                
                // クラス削除
                toolbar.classList.remove('d-none', 'hidden', 'invisible');
                
                // ボタンも可視化
                const buttons = toolbar.querySelectorAll('button, .btn');
                buttons.forEach(btn => {
                    btn.style.cssText += `
                        display: inline-flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    `;
                });
                
                console.log(`✅ ツールバー[${index}]を強制可視化しました`);
            }
        });
    }
    
    createVisibleToolbar() {
        console.log('🏗️ 可視ツールバー作成');
        
        // 既存の可視ツールバーをチェック
        const existingVisible = document.querySelector('#visible-toolbar');
        if (existingVisible) {
            console.log('⚠️ 可視ツールバーは既に存在します');
            return;
        }
        
        // 新しい可視ツールバーを作成
        const visibleToolbarHTML = `
            <div id="visible-toolbar" class="floating-toolbar" style="
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 999999 !important;
                background: rgba(255, 255, 255, 0.98) !important;
                border: 4px solid #ff4444 !important;
                border-radius: 25px !important;
                padding: 18px 25px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
                display: flex !important;
                gap: 15px !important;
                align-items: center !important;
                backdrop-filter: blur(15px) !important;
                font-family: 'Noto Sans JP', sans-serif !important;
                animation: pulse-border 2s infinite !important;
            ">
                <!-- 比較ボタン -->
                <button id="visible-compare-btn" class="btn btn-outline-success btn-sm" style="
                    border-radius: 20px !important;
                    padding: 12px 18px !important;
                    font-size: 14px !important;
                    font-weight: bold !important;
                    border: 3px solid #28a745 !important;
                    background: rgba(40, 167, 69, 0.15) !important;
                    color: #28a745 !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    display: inline-flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                ">
                    <i class="bi bi-check-circle me-1"></i>比較中: <span id="visible-compare-count">0</span>/3人
                </button>
                
                <!-- ブックマークボタン -->
                <button id="visible-bookmark-btn" class="btn btn-outline-warning btn-sm" style="
                    border-radius: 20px !important;
                    padding: 12px 18px !important;
                    font-size: 14px !important;
                    font-weight: bold !important;
                    border: 4px solid #ffc107 !important;
                    background: rgba(255, 193, 7, 0.25) !important;
                    color: #b8860b !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    display: inline-flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    box-shadow: 0 3px 10px rgba(255, 193, 7, 0.4) !important;
                ">
                    <i class="bi bi-star me-1"></i>ブックマーク(<span id="visible-bookmark-count">0</span>)
                </button>
                
                <!-- 履歴ボタン -->
                <button id="visible-history-btn" class="btn btn-outline-info btn-sm" style="
                    border-radius: 20px !important;
                    padding: 12px 18px !important;
                    font-size: 14px !important;
                    font-weight: bold !important;
                    border: 3px solid #17a2b8 !important;
                    background: rgba(23, 162, 184, 0.15) !important;
                    color: #17a2b8 !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    display: inline-flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                ">
                    <i class="bi bi-clock-history me-1"></i>履歴
                </button>
            </div>
        `;
        
        // CSSアニメーションを追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-border {
                0% { border-color: #ff4444; }
                50% { border-color: #44ff44; }
                100% { border-color: #ff4444; }
            }
        `;
        document.head.appendChild(style);
        
        // ツールバーを追加
        document.body.insertAdjacentHTML('beforeend', visibleToolbarHTML);
        
        // イベントリスナーを設定
        this.setupVisibleEventListeners();
        
        // カウント更新
        this.updateVisibleCounts();
        
        console.log('✅ 可視ツールバー作成完了');
    }
    
    setupVisibleEventListeners() {
        console.log('🎧 可視イベントリスナー設定');
        
        // ブックマークボタン
        const bookmarkBtn = document.getElementById('visible-bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('⭐ 可視ブックマークボタンクリック！');
                
                // 視覚的フィードバック
                bookmarkBtn.style.transform = 'scale(0.9)';
                bookmarkBtn.style.backgroundColor = '#28a745';
                bookmarkBtn.style.color = 'white';
                
                setTimeout(() => {
                    bookmarkBtn.style.transform = 'scale(1.0)';
                    bookmarkBtn.style.backgroundColor = 'rgba(255, 193, 7, 0.25)';
                    bookmarkBtn.style.color = '#b8860b';
                }, 200);
                
                // ブックマーク管理表示
                this.showVisibleBookmarkModal();
            });
            
            console.log('✅ 可視ブックマークボタンイベント設定完了');
        }
        
        // 比較ボタン
        const compareBtn = document.getElementById('visible-compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔍 可視比較ボタンクリック');
                this.showVisibleCompareModal();
            });
        }
        
        // 履歴ボタン
        const historyBtn = document.getElementById('visible-history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📚 可視履歴ボタンクリック');
                this.showVisibleHistoryModal();
            });
        }
    }
    
    showVisibleBookmarkModal() {
        console.log('⭐ 可視ブックマークモーダル表示');
        
        // 既存モーダル削除
        const existing = document.getElementById('visible-bookmark-modal');
        if (existing) existing.remove();
        
        // LocalStorageからデータ取得
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        const modalHTML = `
            <div id="visible-bookmark-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.85);
                z-index: 9999999;
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                align-items: center;
                justify-content: center;
                font-family: 'Noto Sans JP', sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    max-width: 750px;
                    width: 95%;
                    max-height: 85%;
                    overflow-y: auto;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    border: 5px solid #ffc107;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 35px;
                        padding-bottom: 25px;
                        border-bottom: 4px solid #ffc107;
                    ">
                        <h2 style="
                            margin: 0; 
                            color: #ffc107; 
                            display: flex; 
                            align-items: center;
                            font-weight: bold;
                        ">
                            ⭐ ブックマーク管理 (可視システム)
                        </h2>
                        <button onclick="document.getElementById('visible-bookmark-modal').remove()" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    border-radius: 50%;
                                    width: 45px;
                                    height: 45px;
                                    font-size: 22px;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: bold;
                                ">×</button>
                    </div>
                    <div id="visible-bookmark-content">
                        ${this.generateVisibleBookmarkContent(bookmarkedGuides)}
                    </div>
                    <div style="
                        margin-top: 35px;
                        padding-top: 25px;
                        border-top: 3px solid #ddd;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <button onclick="toolbarVisibilityFix.clearAllVisibleBookmarks()" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    padding: 15px 30px;
                                    border-radius: 12px;
                                    cursor: pointer;
                                    font-weight: bold;
                                    font-size: 16px;
                                ">🗑️ 全削除</button>
                        <button onclick="document.getElementById('visible-bookmark-modal').remove()" 
                                style="
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    padding: 15px 30px;
                                    border-radius: 12px;
                                    cursor: pointer;
                                    font-size: 16px;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('✅ 可視ブックマークモーダル表示完了');
    }
    
    generateVisibleBookmarkContent(bookmarkedGuides) {
        if (bookmarkedGuides.length === 0) {
            return `
                <div style="text-align: center; padding: 60px; color: #666;">
                    <div style="font-size: 80px; margin-bottom: 30px;">📚</div>
                    <h3 style="margin-bottom: 20px;">ブックマークされたガイドはありません</h3>
                    <p style="font-size: 18px; margin-bottom: 25px;">ガイドカードの⭐ボタンをクリックしてブックマークしてください</p>
                    <div style="
                        margin-top: 25px; 
                        padding: 20px; 
                        background: #fff3cd; 
                        border-radius: 12px; 
                        border: 3px solid #ffc107;
                    ">
                        <strong style="color: #b8860b; font-size: 16px;">
                            ✅ 可視ツールバーシステムで正常に動作しています
                        </strong>
                    </div>
                </div>
            `;
        }
        
        let content = `
            <div style="
                margin-bottom: 30px; 
                padding: 25px; 
                background: #fff3cd; 
                border-radius: 15px; 
                border: 3px solid #ffc107;
            ">
                <strong style="color: #b8860b; font-size: 20px;">
                    📊 ブックマーク済み: ${bookmarkedGuides.length}件
                </strong>
                <br><small style="color: #666; margin-top: 8px; display: block; font-size: 14px;">
                    可視ツールバーシステムで管理されています
                </small>
            </div>
        `;
        
        bookmarkedGuides.forEach(guideId => {
            content += `
                <div style="
                    padding: 25px;
                    border: 4px solid #ffc107;
                    border-radius: 18px;
                    margin: 18px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fffbf0;
                    box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
                ">
                    <div>
                        <strong style="color: #b8860b; font-size: 18px;">⭐ ガイド ${guideId}</strong>
                        <br><small style="color: #666; margin-top: 8px; display: block;">
                            可視システムで管理中
                        </small>
                    </div>
                    <button onclick="toolbarVisibilityFix.removeVisibleBookmark(${guideId})" 
                            style="
                                background: #dc3545;
                                color: white;
                                border: none;
                                padding: 12px 20px;
                                border-radius: 10px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 14px;
                            ">🗑️ 削除</button>
                </div>
            `;
        });
        
        return content;
    }
    
    removeVisibleBookmark(guideId) {
        console.log(`⭐ 可視ブックマーク削除: ガイド${guideId}`);
        
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const updatedBookmarks = bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        
        // 表示更新
        const contentDiv = document.getElementById('visible-bookmark-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.generateVisibleBookmarkContent(updatedBookmarks);
        }
        
        // カウント更新
        this.updateVisibleCounts();
        
        console.log(`✅ ガイド${guideId}可視削除完了`);
    }
    
    clearAllVisibleBookmarks() {
        if (confirm('可視システム確認: 全てのブックマークを削除しますか？')) {
            localStorage.setItem('bookmarkedGuides', '[]');
            
            // 表示更新
            const contentDiv = document.getElementById('visible-bookmark-content');
            if (contentDiv) {
                contentDiv.innerHTML = this.generateVisibleBookmarkContent([]);
            }
            
            // カウント更新
            this.updateVisibleCounts();
            
            console.log('⭐ 全ブックマーク可視削除完了');
        }
    }
    
    updateVisibleCounts() {
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        
        // カウント表示更新
        const bookmarkCount = document.getElementById('visible-bookmark-count');
        const compareCount = document.getElementById('visible-compare-count');
        
        if (bookmarkCount) bookmarkCount.textContent = bookmarkedGuides.length;
        if (compareCount) compareCount.textContent = comparedGuides.length;
        
        console.log(`📊 可視カウント更新: ブックマーク${bookmarkedGuides.length}件, 比較${comparedGuides.length}件`);
    }
    
    showVisibleCompareModal() {
        console.log('🔍 可視比較モーダル表示');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        alert(`🔍 比較機能 (可視システム)\n\n現在比較中: ${comparedGuides.length}/3人\n\nガイドカードのチェックアイコンをクリックして比較対象を選択してください。`);
    }
    
    showVisibleHistoryModal() {
        alert('📚 履歴機能 (可視システム)\n\n閲覧履歴機能は開発中です。\n近日公開予定です。');
    }
    
    ensureVisibility() {
        console.log('👁️ 可視性継続確認');
        
        // 可視ツールバーの存在確認
        const visibleToolbar = document.getElementById('visible-toolbar');
        if (!visibleToolbar) {
            console.log('⚠️ 可視ツールバーが消失 - 再作成');
            this.createVisibleToolbar();
        } else {
            // 可視性確認
            const computedStyle = window.getComputedStyle(visibleToolbar);
            if (computedStyle.display === 'none' || 
                computedStyle.visibility === 'hidden' || 
                computedStyle.opacity === '0') {
                
                console.log('⚠️ 可視ツールバーが隠されています - 修正');
                this.makeToolbarsVisible();
            }
        }
    }
}

// インスタンス作成
window.toolbarVisibilityFix = new ToolbarVisibilityFix();

console.log('✅ ツールバー可視性修正システム準備完了');