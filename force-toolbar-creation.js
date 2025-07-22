// 強制ツールバー作成システム
console.log('🚀 強制ツールバー作成システム開始');

class ForceToolbarCreation {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🔧 強制ツールバー初期化');
        
        // 即座に実行
        this.createCompleteToolbar();
        
        // DOMContentLoaded後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createCompleteToolbar());
        }
        
        // 段階的実行
        setTimeout(() => this.createCompleteToolbar(), 1000);
        setTimeout(() => this.createCompleteToolbar(), 3000);
        setTimeout(() => this.verifyToolbarFunction(), 5000);
    }
    
    createCompleteToolbar() {
        console.log('🛠️ 完全ツールバー作成開始');
        
        // 既存のツールバーを全て削除
        const existingToolbars = document.querySelectorAll('.floating-toolbar, .toolbar, [class*="toolbar"], [style*="bottom"], [style*="fixed"]');
        existingToolbars.forEach(toolbar => {
            if (toolbar.textContent.includes('ブックマーク') || 
                toolbar.textContent.includes('比較') || 
                toolbar.textContent.includes('履歴')) {
                console.log('🗑️ 既存ツールバー削除:', toolbar.textContent.trim());
                toolbar.remove();
            }
        });
        
        // 新しいツールバーHTML
        const toolbarHTML = `
            <div id="force-toolbar" class="floating-toolbar" style="
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 99999 !important;
                background: rgba(255, 255, 255, 0.98) !important;
                border: 3px solid #4287f5 !important;
                border-radius: 25px !important;
                padding: 15px 20px !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.25) !important;
                display: flex !important;
                gap: 12px !important;
                align-items: center !important;
                backdrop-filter: blur(15px) !important;
                font-family: 'Noto Sans JP', sans-serif !important;
            ">
                <!-- 比較ボタン -->
                <button id="force-compare-btn" class="btn btn-outline-success btn-sm" style="
                    border-radius: 20px !important;
                    padding: 10px 15px !important;
                    font-size: 13px !important;
                    font-weight: bold !important;
                    border: 2px solid #28a745 !important;
                    background: rgba(40, 167, 69, 0.1) !important;
                    color: #28a745 !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1.0)'">
                    <i class="bi bi-check-circle me-1"></i>比較中: <span id="force-compare-count">0</span>/3人
                </button>
                
                <!-- ブックマークボタン -->
                <button id="force-bookmark-btn" class="btn btn-outline-warning btn-sm" style="
                    border-radius: 20px !important;
                    padding: 10px 15px !important;
                    font-size: 13px !important;
                    font-weight: bold !important;
                    border: 3px solid #ffc107 !important;
                    background: rgba(255, 193, 7, 0.2) !important;
                    color: #b8860b !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3) !important;
                " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 15px rgba(255, 193, 7, 0.5)'" 
                   onmouseout="this.style.transform='scale(1.0)'; this.style.boxShadow='0 2px 8px rgba(255, 193, 7, 0.3)'">
                    <i class="bi bi-star me-1"></i>ブックマーク(<span id="force-bookmark-count">0</span>)
                </button>
                
                <!-- 履歴ボタン -->
                <button id="force-history-btn" class="btn btn-outline-info btn-sm" style="
                    border-radius: 20px !important;
                    padding: 10px 15px !important;
                    font-size: 13px !important;
                    font-weight: bold !important;
                    border: 2px solid #17a2b8 !important;
                    background: rgba(23, 162, 184, 0.1) !important;
                    color: #17a2b8 !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1.0)'">
                    <i class="bi bi-clock-history me-1"></i>履歴
                </button>
                
                <!-- ページジャンプボタン -->
                <button id="force-jump-btn" class="btn btn-outline-secondary btn-sm" style="
                    border-radius: 20px !important;
                    padding: 10px 15px !important;
                    font-size: 13px !important;
                    font-weight: bold !important;
                    border: 2px solid #6c757d !important;
                    background: rgba(108, 117, 125, 0.1) !important;
                    color: #6c757d !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1.0)'">
                    <i class="bi bi-skip-end me-1"></i>ページジャンプ
                </button>
            </div>
        `;
        
        // ツールバーを追加
        document.body.insertAdjacentHTML('beforeend', toolbarHTML);
        
        // イベントリスナーを設定
        this.setupForceEventListeners();
        
        // カウントを更新
        this.updateForceCounts();
        
        console.log('✅ 強制ツールバー作成完了');
    }
    
    setupForceEventListeners() {
        console.log('🎧 強制イベントリスナー設定');
        
        // ブックマークボタン
        const bookmarkBtn = document.getElementById('force-bookmark-btn');
        if (bookmarkBtn) {
            // 既存のイベントを削除
            bookmarkBtn.removeEventListener('click', this.handleBookmarkClick);
            
            // 新しいイベントを追加
            bookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                console.log('⭐ 強制ブックマークボタンクリック！');
                
                // 視覚的フィードバック
                bookmarkBtn.style.transform = 'scale(0.9)';
                bookmarkBtn.style.backgroundColor = '#28a745';
                bookmarkBtn.style.color = 'white';
                
                setTimeout(() => {
                    bookmarkBtn.style.transform = 'scale(1.0)';
                    bookmarkBtn.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
                    bookmarkBtn.style.color = '#b8860b';
                }, 200);
                
                // ブックマーク管理表示
                this.showForceBookmarkModal();
            });
            
            // 追加のイベント監視
            bookmarkBtn.addEventListener('mousedown', (e) => {
                console.log('🖱️ ブックマークボタンマウスダウン');
            });
            
            bookmarkBtn.addEventListener('mouseup', (e) => {
                console.log('🖱️ ブックマークボタンマウスアップ');
            });
            
            console.log('✅ ブックマークボタンイベント設定完了');
        }
        
        // 比較ボタン
        const compareBtn = document.getElementById('force-compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔍 強制比較ボタンクリック');
                this.showForceCompareModal();
            });
        }
        
        // 履歴ボタン
        const historyBtn = document.getElementById('force-history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📚 強制履歴ボタンクリック');
                this.showForceHistoryModal();
            });
        }
        
        // ページジャンプボタン
        const jumpBtn = document.getElementById('force-jump-btn');
        if (jumpBtn) {
            jumpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 強制ページジャンプボタンクリック');
                this.showForceJumpModal();
            });
        }
        
        // ドキュメント全体のクリック監視（フォールバック）
        document.addEventListener('click', (e) => {
            const target = e.target;
            const text = target.textContent.toLowerCase();
            
            if (text.includes('ブックマーク') && target.closest('#force-toolbar')) {
                console.log('🔄 フォールバッククリック検出');
                e.preventDefault();
                e.stopPropagation();
                this.showForceBookmarkModal();
            }
        }, true);
        
        console.log('✅ 全イベントリスナー設定完了');
    }
    
    showForceBookmarkModal() {
        console.log('⭐ 強制ブックマークモーダル表示');
        
        // 既存モーダル削除
        const existing = document.getElementById('force-bookmark-modal');
        if (existing) existing.remove();
        
        // LocalStorageからデータ取得
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        const modalHTML = `
            <div id="force-bookmark-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.8);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Noto Sans JP', sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 35px;
                    border-radius: 20px;
                    max-width: 700px;
                    width: 95%;
                    max-height: 85%;
                    overflow-y: auto;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
                    border: 4px solid #ffc107;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid #ffc107;
                    ">
                        <h3 style="
                            margin: 0; 
                            color: #ffc107; 
                            display: flex; 
                            align-items: center;
                            font-weight: bold;
                        ">
                            ⭐ ブックマーク管理 (強制システム)
                        </h3>
                        <button onclick="document.getElementById('force-bookmark-modal').remove()" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    border-radius: 50%;
                                    width: 40px;
                                    height: 40px;
                                    font-size: 20px;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: bold;
                                ">×</button>
                    </div>
                    <div id="force-bookmark-content">
                        ${this.generateForceBookmarkContent(bookmarkedGuides)}
                    </div>
                    <div style="
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <button onclick="forceToolbarCreation.clearAllForceBookmarks()" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    padding: 12px 25px;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    font-weight: bold;
                                    font-size: 14px;
                                ">🗑️ 全削除</button>
                        <button onclick="document.getElementById('force-bookmark-modal').remove()" 
                                style="
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    padding: 12px 25px;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    font-size: 14px;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('✅ 強制ブックマークモーダル表示完了');
    }
    
    generateForceBookmarkContent(bookmarkedGuides) {
        if (bookmarkedGuides.length === 0) {
            return `
                <div style="text-align: center; padding: 50px; color: #666;">
                    <div style="font-size: 72px; margin-bottom: 25px;">📚</div>
                    <h4 style="margin-bottom: 15px;">ブックマークされたガイドはありません</h4>
                    <p style="font-size: 16px;">ガイドカードの⭐ボタンをクリックしてブックマークしてください</p>
                    <div style="
                        margin-top: 20px; 
                        padding: 15px; 
                        background: #fff3cd; 
                        border-radius: 10px; 
                        border: 2px solid #ffc107;
                    ">
                        <small style="color: #b8860b; font-weight: bold;">
                            ✅ 強制ツールバーシステムで正常に動作しています
                        </small>
                    </div>
                </div>
            `;
        }
        
        let content = `
            <div style="
                margin-bottom: 25px; 
                padding: 20px; 
                background: #fff3cd; 
                border-radius: 12px; 
                border: 2px solid #ffc107;
            ">
                <strong style="color: #b8860b; font-size: 18px;">
                    📊 ブックマーク済み: ${bookmarkedGuides.length}件
                </strong>
                <br><small style="color: #666; margin-top: 5px; display: block;">
                    強制ツールバーシステムで管理されています
                </small>
            </div>
        `;
        
        bookmarkedGuides.forEach(guideId => {
            content += `
                <div style="
                    padding: 20px;
                    border: 3px solid #ffc107;
                    border-radius: 15px;
                    margin: 15px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fffbf0;
                    box-shadow: 0 3px 10px rgba(255, 193, 7, 0.2);
                ">
                    <div>
                        <strong style="color: #b8860b; font-size: 16px;">⭐ ガイド ${guideId}</strong>
                        <br><small style="color: #666; margin-top: 5px; display: block;">
                            強制システムで管理中
                        </small>
                    </div>
                    <button onclick="forceToolbarCreation.removeForceBookmark(${guideId})" 
                            style="
                                background: #dc3545;
                                color: white;
                                border: none;
                                padding: 10px 18px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 13px;
                            ">🗑️ 削除</button>
                </div>
            `;
        });
        
        return content;
    }
    
    removeForceBookmark(guideId) {
        console.log(`⭐ 強制ブックマーク削除: ガイド${guideId}`);
        
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const updatedBookmarks = bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        
        // 表示更新
        const contentDiv = document.getElementById('force-bookmark-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.generateForceBookmarkContent(updatedBookmarks);
        }
        
        // カウント更新
        this.updateForceCounts();
        
        console.log(`✅ ガイド${guideId}強制削除完了`);
    }
    
    clearAllForceBookmarks() {
        if (confirm('強制システム確認: 全てのブックマークを削除しますか？')) {
            localStorage.setItem('bookmarkedGuides', '[]');
            
            // 表示更新
            const contentDiv = document.getElementById('force-bookmark-content');
            if (contentDiv) {
                contentDiv.innerHTML = this.generateForceBookmarkContent([]);
            }
            
            // カウント更新
            this.updateForceCounts();
            
            console.log('⭐ 全ブックマーク強制削除完了');
        }
    }
    
    updateForceCounts() {
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        
        // カウント表示更新
        const bookmarkCount = document.getElementById('force-bookmark-count');
        const compareCount = document.getElementById('force-compare-count');
        
        if (bookmarkCount) bookmarkCount.textContent = bookmarkedGuides.length;
        if (compareCount) compareCount.textContent = comparedGuides.length;
        
        console.log(`📊 強制カウント更新: ブックマーク${bookmarkedGuides.length}件, 比較${comparedGuides.length}件`);
    }
    
    showForceCompareModal() {
        console.log('🔍 強制比較モーダル表示');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        alert(`🔍 比較機能 (強制システム)\n\n現在比較中: ${comparedGuides.length}/3人\n\nガイドカードのチェックアイコンをクリックして比較対象を選択してください。`);
    }
    
    showForceHistoryModal() {
        alert('📚 履歴機能 (強制システム)\n\n閲覧履歴機能は開発中です。\n近日公開予定です。');
    }
    
    showForceJumpModal() {
        alert('🔄 ページジャンプ機能 (強制システム)\n\nページジャンプ機能は開発中です。\n近日公開予定です。');
    }
    
    verifyToolbarFunction() {
        console.log('🔍 ツールバー機能検証');
        
        const toolbar = document.getElementById('force-toolbar');
        const bookmarkBtn = document.getElementById('force-bookmark-btn');
        
        if (toolbar) {
            console.log('✅ 強制ツールバー存在確認');
            
            if (bookmarkBtn) {
                console.log('✅ ブックマークボタン存在確認');
                
                // ボタンの視覚的強調
                bookmarkBtn.style.animation = 'pulse 2s infinite';
                
                // CSS アニメーションを追加
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
                
                // 3秒後にアニメーション停止
                setTimeout(() => {
                    bookmarkBtn.style.animation = '';
                }, 3000);
                
                console.log('✅ ツールバー機能検証完了');
            } else {
                console.error('❌ ブックマークボタンが見つかりません');
            }
        } else {
            console.error('❌ 強制ツールバーが見つかりません');
        }
    }
}

// インスタンス作成
window.forceToolbarCreation = new ForceToolbarCreation();

console.log('✅ 強制ツールバー作成システム準備完了');