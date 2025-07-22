// ツールバーボタン修正システム
console.log('🔧 ツールバーボタン修正システム開始');

class ToolbarButtonFix {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🔧 ツールバーボタン修正初期化');
        
        // 段階的実行
        setTimeout(() => this.fixToolbarButtons(), 1000);
        setTimeout(() => this.fixToolbarButtons(), 3000);
        setTimeout(() => this.fixToolbarButtons(), 5000);
        
        // 継続監視
        setInterval(() => this.ensureToolbarFunctionality(), 10000);
    }
    
    fixToolbarButtons() {
        console.log('🔧 ツールバーボタン修正開始');
        
        // 緊急ツールバーのボタンを修正
        this.fixEmergencyToolbarButtons();
        
        // その他のツールバーボタンも修正
        this.fixAllToolbarButtons();
    }
    
    fixEmergencyToolbarButtons() {
        console.log('🚨 緊急ツールバーボタン修正');
        
        // 緊急ブックマークボタン
        const emergencyBookmarkBtn = document.getElementById('emergency-bookmark-btn');
        if (emergencyBookmarkBtn) {
            // 既存のイベントリスナーを削除
            const newBookmarkBtn = emergencyBookmarkBtn.cloneNode(true);
            emergencyBookmarkBtn.parentNode.replaceChild(newBookmarkBtn, emergencyBookmarkBtn);
            
            // 新しいイベントリスナーを追加
            newBookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🔧 修正済み緊急ブックマークボタンクリック');
                this.showFixedBookmarkModal();
            });
            
            console.log('✅ 緊急ブックマークボタン修正完了');
        }
        
        // 緊急比較ボタン
        const emergencyCompareBtn = document.getElementById('emergency-compare-btn');
        if (emergencyCompareBtn) {
            // 既存のイベントリスナーを削除
            const newCompareBtn = emergencyCompareBtn.cloneNode(true);
            emergencyCompareBtn.parentNode.replaceChild(newCompareBtn, emergencyCompareBtn);
            
            // 新しいイベントリスナーを追加
            newCompareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🔧 修正済み緊急比較ボタンクリック');
                this.showFixedCompareModal();
            });
            
            console.log('✅ 緊急比較ボタン修正完了');
        }
        
        // 緊急履歴ボタン
        const emergencyHistoryBtn = document.getElementById('emergency-history-btn');
        if (emergencyHistoryBtn) {
            // 既存のイベントリスナーを削除
            const newHistoryBtn = emergencyHistoryBtn.cloneNode(true);
            emergencyHistoryBtn.parentNode.replaceChild(newHistoryBtn, emergencyHistoryBtn);
            
            // 新しいイベントリスナーを追加
            newHistoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🔧 修正済み緊急履歴ボタンクリック');
                this.showFixedHistoryModal();
            });
            
            console.log('✅ 緊急履歴ボタン修正完了');
        }
    }
    
    fixAllToolbarButtons() {
        console.log('🔧 全ツールバーボタン修正');
        
        // 全てのブックマーク関連ボタン
        const bookmarkButtons = document.querySelectorAll(`
            [id*="bookmark-btn"],
            [class*="bookmark-btn"],
            button[title*="ブックマーク"],
            button:contains("ブックマーク")
        `);
        
        bookmarkButtons.forEach((btn, index) => {
            if (btn.id === 'emergency-bookmark-btn') return; // 既に処理済み
            
            // イベントリスナーを再設定
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🔧 修正済みブックマークボタン[${index}]クリック`);
                this.showFixedBookmarkModal();
            });
        });
        
        // 全ての比較関連ボタン
        const compareButtons = document.querySelectorAll(`
            [id*="compare-btn"],
            [class*="compare-btn"],
            button[title*="比較"],
            button:contains("比較")
        `);
        
        compareButtons.forEach((btn, index) => {
            if (btn.id === 'emergency-compare-btn') return; // 既に処理済み
            
            // イベントリスナーを再設定
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🔧 修正済み比較ボタン[${index}]クリック`);
                this.showFixedCompareModal();
            });
        });
        
        console.log(`✅ ${bookmarkButtons.length}個のブックマークボタンと${compareButtons.length}個の比較ボタンを修正`);
    }
    
    showFixedBookmarkModal() {
        console.log('🔧 修正済みブックマークモーダル表示');
        
        // 既存モーダル削除
        const existing = document.getElementById('fixed-bookmark-modal');
        if (existing) existing.remove();
        
        // LocalStorageからデータ取得
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        const modalHTML = `
            <div id="fixed-bookmark-modal" style="
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.9) !important;
                z-index: 99999999 !important;
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                align-items: center !important;
                justify-content: center !important;
                font-family: 'Noto Sans JP', sans-serif !important;
                pointer-events: auto !important;
            ">
                <div style="
                    background: white !important;
                    padding: 40px !important;
                    border-radius: 20px !important;
                    max-width: 800px !important;
                    width: 95% !important;
                    max-height: 90% !important;
                    overflow-y: auto !important;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.6) !important;
                    border: 5px solid #28a745 !important;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                ">
                    <div style="
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        margin-bottom: 30px !important;
                        padding-bottom: 20px !important;
                        border-bottom: 4px solid #28a745 !important;
                    ">
                        <h1 style="
                            margin: 0 !important; 
                            color: #28a745 !important; 
                            display: flex !important; 
                            align-items: center !important;
                            font-weight: bold !important;
                            font-size: 26px !important;
                        ">
                            🔧 修正済みブックマーク管理
                        </h1>
                        <button onclick="document.getElementById('fixed-bookmark-modal').remove()" 
                                style="
                                    background: #dc3545 !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 50% !important;
                                    width: 45px !important;
                                    height: 45px !important;
                                    font-size: 22px !important;
                                    cursor: pointer !important;
                                    display: flex !important;
                                    align-items: center !important;
                                    justify-content: center !important;
                                    font-weight: bold !important;
                                ">×</button>
                    </div>
                    <div id="fixed-bookmark-content">
                        ${this.generateFixedBookmarkContent(bookmarkedGuides)}
                    </div>
                    <div style="
                        margin-top: 30px !important;
                        padding-top: 20px !important;
                        border-top: 3px solid #ddd !important;
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                    ">
                        <button onclick="toolbarButtonFix.clearAllFixedBookmarks()" 
                                style="
                                    background: #dc3545 !important;
                                    color: white !important;
                                    border: none !important;
                                    padding: 15px 30px !important;
                                    border-radius: 12px !important;
                                    cursor: pointer !important;
                                    font-weight: bold !important;
                                    font-size: 16px !important;
                                ">🗑️ 全削除</button>
                        <button onclick="document.getElementById('fixed-bookmark-modal').remove()" 
                                style="
                                    background: #6c757d !important;
                                    color: white !important;
                                    border: none !important;
                                    padding: 15px 30px !important;
                                    border-radius: 12px !important;
                                    cursor: pointer !important;
                                    font-size: 16px !important;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('✅ 修正済みブックマークモーダル表示完了');
    }
    
    generateFixedBookmarkContent(bookmarkedGuides) {
        if (bookmarkedGuides.length === 0) {
            return `
                <div style="text-align: center; padding: 60px; color: #666;">
                    <div style="font-size: 80px; margin-bottom: 30px;">📚</div>
                    <h3 style="margin-bottom: 20px;">ブックマークされたガイドはありません</h3>
                    <p style="font-size: 18px; margin-bottom: 25px;">ガイドカードの⭐ボタンをクリックしてブックマークしてください</p>
                    <div style="
                        margin-top: 25px; 
                        padding: 20px; 
                        background: #d4edda; 
                        border-radius: 12px; 
                        border: 3px solid #28a745;
                    ">
                        <strong style="color: #155724; font-size: 16px;">
                            🔧 修正済みツールバーシステムで確実に動作しています
                        </strong>
                    </div>
                </div>
            `;
        }
        
        let content = `
            <div style="
                margin-bottom: 30px; 
                padding: 25px; 
                background: #d4edda; 
                border-radius: 15px; 
                border: 3px solid #28a745;
            ">
                <strong style="color: #155724; font-size: 20px;">
                    📊 ブックマーク済み: ${bookmarkedGuides.length}件
                </strong>
                <br><small style="color: #666; margin-top: 8px; display: block; font-size: 14px;">
                    修正済みツールバーシステムで管理されています
                </small>
            </div>
        `;
        
        bookmarkedGuides.forEach(guideId => {
            content += `
                <div style="
                    padding: 25px;
                    border: 4px solid #28a745;
                    border-radius: 18px;
                    margin: 18px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f8fff8;
                    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
                ">
                    <div>
                        <strong style="color: #155724; font-size: 18px;">⭐ ${guideId}</strong>
                        <br><small style="color: #666; margin-top: 8px; display: block;">
                            修正済みシステムで管理中
                        </small>
                    </div>
                    <button onclick="toolbarButtonFix.removeFixedBookmark('${guideId}')" 
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
    
    removeFixedBookmark(guideId) {
        console.log(`🔧 修正済みブックマーク削除: ${guideId}`);
        
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const updatedBookmarks = bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        
        // 表示更新
        const contentDiv = document.getElementById('fixed-bookmark-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.generateFixedBookmarkContent(updatedBookmarks);
        }
        
        // カウント更新
        this.updateFixedCounts();
        
        console.log(`✅ ${guideId}修正済み削除完了`);
    }
    
    clearAllFixedBookmarks() {
        if (confirm('修正済みシステム確認: 全てのブックマークを削除しますか？')) {
            localStorage.setItem('bookmarkedGuides', '[]');
            
            // 表示更新
            const contentDiv = document.getElementById('fixed-bookmark-content');
            if (contentDiv) {
                contentDiv.innerHTML = this.generateFixedBookmarkContent([]);
            }
            
            // カウント更新
            this.updateFixedCounts();
            
            console.log('🔧 全ブックマーク修正済み削除完了');
        }
    }
    
    showFixedCompareModal() {
        console.log('🔧 修正済み比較モーダル表示');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        
        let message = `🔧 比較機能 (修正済みシステム)\n\n現在比較中: ${comparedGuides.length}/3人\n\n`;
        
        if (comparedGuides.length === 0) {
            message += 'ガイドカードのチェックアイコンをクリックして比較対象を選択してください。';
        } else {
            message += '比較中のガイド:\n' + comparedGuides.map(id => `• ${id}`).join('\n');
        }
        
        alert(message);
    }
    
    showFixedHistoryModal() {
        alert('🔧 履歴機能 (修正済みシステム)\n\n閲覧履歴機能は開発中です。\n近日公開予定です。');
    }
    
    updateFixedCounts() {
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        
        // 全てのカウント要素を更新
        const allCountElements = document.querySelectorAll(`
            [id*="bookmark-count"],
            [id*="compare-count"]
        `);
        
        allCountElements.forEach(element => {
            if (element.id.includes('bookmark')) {
                element.textContent = bookmarkedGuides.length;
            } else if (element.id.includes('compare')) {
                element.textContent = comparedGuides.length;
            }
        });
        
        console.log(`🔧 修正済みカウント更新: ブックマーク${bookmarkedGuides.length}件, 比較${comparedGuides.length}件`);
    }
    
    ensureToolbarFunctionality() {
        console.log('🔧 ツールバー機能確認');
        
        // 緊急ツールバーの存在確認
        const emergencyToolbar = document.getElementById('emergency-toolbar');
        if (!emergencyToolbar) {
            console.log('⚠️ 緊急ツールバーが見つかりません');
            return;
        }
        
        // ボタンのクリック可能性確認
        const emergencyBookmarkBtn = document.getElementById('emergency-bookmark-btn');
        const emergencyCompareBtn = document.getElementById('emergency-compare-btn');
        const emergencyHistoryBtn = document.getElementById('emergency-history-btn');
        
        let needsFix = false;
        
        if (emergencyBookmarkBtn) {
            const computedStyle = window.getComputedStyle(emergencyBookmarkBtn);
            if (computedStyle.pointerEvents === 'none' || 
                computedStyle.display === 'none' || 
                computedStyle.visibility === 'hidden') {
                needsFix = true;
            }
        }
        
        if (needsFix) {
            console.log('⚠️ ツールバーボタンに問題検出 - 修正実行');
            this.fixToolbarButtons();
        }
    }
}

// インスタンス作成
window.toolbarButtonFix = new ToolbarButtonFix();

console.log('✅ ツールバーボタン修正システム準備完了');