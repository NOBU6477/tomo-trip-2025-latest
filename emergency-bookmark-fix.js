// 緊急ブックマークボタン修正システム
console.log('🚨 緊急ブックマークボタン修正システム開始');

class EmergencyBookmarkFix {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🎯 緊急ブックマーク修正初期化');
        
        // 即座に実行
        this.fixBookmarkButton();
        
        // 3秒後に再実行
        setTimeout(() => this.fixBookmarkButton(), 3000);
        
        // 5秒後に最終確認
        setTimeout(() => this.finalCheck(), 5000);
        
        // DOM変更監視
        this.observeToolbar();
    }
    
    fixBookmarkButton() {
        console.log('🔧 ブックマークボタン修正開始');
        
        // ツールバーを検索
        const toolbar = document.querySelector('.floating-toolbar');
        if (!toolbar) {
            console.error('❌ フローティングツールバーが見つかりません');
            return;
        }
        
        console.log('✅ フローティングツールバー発見');
        
        // ツールバー内のボタンをすべて取得
        const buttons = toolbar.querySelectorAll('button, .btn, a');
        console.log(`📊 ツールバー内ボタン数: ${buttons.length}`);
        
        let bookmarkButton = null;
        let bookmarkButtonIndex = -1;
        
        // ブックマークボタンを特定
        buttons.forEach((btn, index) => {
            const text = btn.textContent.trim();
            console.log(`   ボタン[${index}]: "${text}"`);
            
            // ブックマークボタンの特定条件
            if (text.includes('ブックマーク') || 
                text.includes('Bookmark') || 
                text.includes('bookmark') ||
                index === 2) { // 3番目のボタン
                bookmarkButton = btn;
                bookmarkButtonIndex = index;
                console.log(`🎯 ブックマークボタン特定: [${index}] "${text}"`);
            }
        });
        
        if (!bookmarkButton) {
            console.error('❌ ブックマークボタンが見つかりません');
            // フォールバック: 3番目のボタンを強制的にブックマークボタンとする
            if (buttons.length >= 3) {
                bookmarkButton = buttons[2];
                bookmarkButtonIndex = 2;
                console.log('🔄 フォールバック: 3番目のボタンをブックマークボタンとして使用');
            } else {
                return;
            }
        }
        
        // 既存のイベントリスナーを完全に削除
        const newButton = bookmarkButton.cloneNode(true);
        bookmarkButton.parentNode.replaceChild(newButton, bookmarkButton);
        
        // 新しいイベントリスナーを追加
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('🚨 緊急ブックマークハンドラー実行!');
            
            // 日本語ガイド管理システムが利用可能か確認
            if (window.japaneseGuideManager) {
                console.log('✅ 日本語ガイド管理システム利用可能');
                try {
                    window.japaneseGuideManager.showBookmarkManagement();
                } catch (error) {
                    console.error('❌ ブックマーク管理表示エラー:', error);
                    this.showDirectBookmarkModal();
                }
            } else {
                console.log('⚠️ 日本語ガイド管理システム利用不可 - 直接モーダル表示');
                this.showDirectBookmarkModal();
            }
        });
        
        // クリックテスト
        newButton.addEventListener('mousedown', () => {
            console.log('🖱️ ブックマークボタンマウスダウン検出');
        });
        
        newButton.addEventListener('mouseup', () => {
            console.log('🖱️ ブックマークボタンマウスアップ検出');
        });
        
        // ボタンスタイルを強調して確認
        newButton.style.border = '2px solid #ff0000';
        newButton.style.backgroundColor = '#fff3cd';
        
        console.log('✅ ブックマークボタン修正完了');
        
        // 2秒後にスタイルを元に戻す
        setTimeout(() => {
            newButton.style.border = '';
            newButton.style.backgroundColor = '';
        }, 2000);
    }
    
    showDirectBookmarkModal() {
        console.log('🔄 直接ブックマークモーダル表示');
        
        // 既存のモーダルを削除
        const existingModal = document.getElementById('emergency-bookmark-modal');
        if (existingModal) existingModal.remove();
        
        // 簡易ブックマークモーダルを作成
        const modalHTML = `
            <div id="emergency-bookmark-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80%;
                    overflow-y: auto;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #ddd;
                    ">
                        <h5 style="margin: 0; color: #ffc107;">
                            ⭐ ブックマーク管理
                        </h5>
                        <button onclick="document.getElementById('emergency-bookmark-modal').remove()" 
                                style="
                                    background: none;
                                    border: none;
                                    font-size: 24px;
                                    cursor: pointer;
                                    color: #666;
                                ">×</button>
                    </div>
                    <div id="emergency-bookmark-content">
                        <p>ブックマークシステムを確認中...</p>
                    </div>
                    <div style="
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                        text-align: right;
                    ">
                        <button onclick="document.getElementById('emergency-bookmark-modal').remove()" 
                                style="
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    padding: 8px 16px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // ブックマークデータを表示
        this.displayBookmarkData();
    }
    
    displayBookmarkData() {
        const contentDiv = document.getElementById('emergency-bookmark-content');
        if (!contentDiv) return;
        
        // LocalStorageからブックマークデータを取得
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        if (bookmarkedGuides.length === 0) {
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <p>📚 ブックマークされたガイドはありません</p>
                    <small>ガイドカードの⭐ボタンをクリックしてブックマークしてください</small>
                </div>
            `;
        } else {
            let html = `<p><strong>ブックマーク済み: ${bookmarkedGuides.length}件</strong></p>`;
            
            bookmarkedGuides.forEach(guideId => {
                html += `
                    <div style="
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        margin: 5px 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span>ガイド ${guideId}</span>
                        <button onclick="emergencyBookmarkFix.removeBookmark(${guideId})" 
                                style="
                                    background: #dc3545;
                                    color: white;
                                    border: none;
                                    padding: 4px 8px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                ">削除</button>
                    </div>
                `;
            });
            
            html += `
                <div style="margin-top: 15px; text-align: center;">
                    <button onclick="emergencyBookmarkFix.clearAllBookmarks()" 
                            style="
                                background: #dc3545;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 4px;
                                cursor: pointer;
                            ">全て削除</button>
                </div>
            `;
            
            contentDiv.innerHTML = html;
        }
    }
    
    removeBookmark(guideId) {
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const updatedBookmarks = bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        
        console.log(`✅ ガイド${guideId}をブックマークから削除`);
        
        // 表示を更新
        this.displayBookmarkData();
        
        // ボタンの状態を更新
        this.updateButtonStates();
    }
    
    clearAllBookmarks() {
        if (confirm('全てのブックマークを削除しますか？')) {
            localStorage.setItem('bookmarkedGuides', '[]');
            console.log('🔄 全ブックマークを削除');
            
            // 表示を更新
            this.displayBookmarkData();
            
            // ボタンの状態を更新
            this.updateButtonStates();
        }
    }
    
    updateButtonStates() {
        // ツールバーの表示を更新
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        // ブックマークボタンのテキストを更新
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) {
            const buttons = toolbar.querySelectorAll('button, .btn');
            buttons.forEach(btn => {
                const text = btn.textContent;
                if (text.includes('ブックマーク') || text.includes('Bookmark')) {
                    btn.textContent = `ブックマーク(${bookmarkedGuides.length})`;
                }
            });
        }
    }
    
    finalCheck() {
        console.log('🔍 最終確認開始');
        
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) {
            const buttons = toolbar.querySelectorAll('button, .btn');
            console.log(`📊 最終確認: ツールバーボタン数 ${buttons.length}`);
            
            buttons.forEach((btn, index) => {
                const hasEventListeners = btn._eventListeners || 
                                        btn.onclick || 
                                        btn.getAttribute('onclick') ||
                                        btn.addEventListener;
                
                console.log(`   ボタン[${index}]: "${btn.textContent.trim()}" - イベント: ${hasEventListeners ? 'あり' : 'なし'}`);
                
                // ブックマークボタンにイベントが無い場合は警告
                const text = btn.textContent.toLowerCase();
                if ((text.includes('ブックマーク') || text.includes('bookmark') || index === 2) && !hasEventListeners) {
                    console.warn(`⚠️ ブックマークボタン[${index}]にイベントリスナーがありません`);
                }
            });
        }
    }
    
    observeToolbar() {
        // ツールバーの変更を監視
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        console.log('🔄 ツールバーに変更を検出 - ブックマークボタンを再修正');
                        setTimeout(() => this.fixBookmarkButton(), 100);
                    }
                });
            });
            
            observer.observe(toolbar, {
                childList: true,
                subtree: true
            });
            
            console.log('👁️ ツールバー変更監視開始');
        }
    }
}

// インスタンス作成
window.emergencyBookmarkFix = new EmergencyBookmarkFix();

console.log('✅ 緊急ブックマークボタン修正システム準備完了');