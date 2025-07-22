// 緊急可視性オーバーライドシステム
console.log('🚨 緊急可視性オーバーライドシステム開始');

// 他のスクリプトによる隠蔽を防ぐ
class EmergencyVisibilityOverride {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🔧 緊急可視性初期化');
        
        // 即座に実行
        this.emergencyCreateToolbar();
        
        // 継続監視（1秒間隔）
        setInterval(() => this.forceVisibility(), 1000);
        
        // DOM変更監視
        this.observeAndForceVisibility();
    }
    
    emergencyCreateToolbar() {
        console.log('🚨 緊急ツールバー作成');
        
        // 全ての隠蔽CSSを無効化
        this.disableHidingCSS();
        
        // 緊急ツールバーを作成
        const emergencyToolbar = document.createElement('div');
        emergencyToolbar.id = 'emergency-toolbar';
        emergencyToolbar.className = 'emergency-floating-toolbar';
        
        emergencyToolbar.innerHTML = `
            <!-- 比較ボタン -->
            <button id="emergency-compare-btn" style="
                border-radius: 18px;
                padding: 12px 16px;
                font-size: 13px;
                font-weight: bold;
                border: 3px solid #28a745;
                background: rgba(40, 167, 69, 0.2);
                color: #28a745;
                cursor: pointer;
                margin-right: 10px;
                transition: all 0.3s ease;
            ">
                <i class="bi bi-check-circle me-1"></i>比較中: <span id="emergency-compare-count">0</span>/3人
            </button>
            
            <!-- ブックマークボタン -->
            <button id="emergency-bookmark-btn" style="
                border-radius: 18px;
                padding: 12px 16px;
                font-size: 13px;
                font-weight: bold;
                border: 4px solid #ffc107;
                background: rgba(255, 193, 7, 0.3);
                color: #b8860b;
                cursor: pointer;
                margin-right: 10px;
                transition: all 0.3s ease;
                box-shadow: 0 3px 10px rgba(255, 193, 7, 0.4);
            ">
                <i class="bi bi-star me-1"></i>ブックマーク(<span id="emergency-bookmark-count">0</span>)
            </button>
            
            <!-- 履歴ボタン -->
            <button id="emergency-history-btn" style="
                border-radius: 18px;
                padding: 12px 16px;
                font-size: 13px;
                font-weight: bold;
                border: 3px solid #17a2b8;
                background: rgba(23, 162, 184, 0.2);
                color: #17a2b8;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="bi bi-clock-history me-1"></i>履歴
            </button>
        `;
        
        // 絶対的なスタイル設定（!importantで強制）
        const toolbarStyle = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            background: rgba(255, 255, 255, 0.98) !important;
            border: 5px solid #ff6b6b !important;
            border-radius: 25px !important;
            padding: 18px 25px !important;
            box-shadow: 0 15px 35px rgba(0,0,0,0.3) !important;
            display: flex !important;
            gap: 15px !important;
            align-items: center !important;
            backdrop-filter: blur(20px) !important;
            font-family: 'Noto Sans JP', sans-serif !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            transform: none !important;
            overflow: visible !important;
            clip: auto !important;
            animation: emergency-pulse 2s infinite !important;
        `;
        
        emergencyToolbar.style.cssText = toolbarStyle;
        
        // CSSアニメーションを追加
        this.addEmergencyCSS();
        
        // DOMに追加
        document.body.appendChild(emergencyToolbar);
        
        // イベントリスナーを設定
        this.setupEmergencyEventListeners();
        
        // カウント更新
        this.updateEmergencyCounts();
        
        console.log('✅ 緊急ツールバー作成完了');
    }
    
    disableHidingCSS() {
        console.log('🔒 隠蔽CSS無効化');
        
        // 隠蔽の可能性があるCSSルールを無効化
        const style = document.createElement('style');
        style.id = 'emergency-visibility-override';
        style.textContent = `
            /* 緊急可視性オーバーライド */
            .floating-toolbar,
            [class*="toolbar"],
            [id*="toolbar"],
            .emergency-floating-toolbar,
            #emergency-toolbar {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: fixed !important;
                z-index: 999999 !important;
                pointer-events: auto !important;
                transform: none !important;
                overflow: visible !important;
                clip: auto !important;
            }
            
            /* 緊急ツールバーアニメーション */
            @keyframes emergency-pulse {
                0% { 
                    border-color: #ff6b6b; 
                    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                }
                50% { 
                    border-color: #4ecdc4; 
                    box-shadow: 0 20px 40px rgba(78, 205, 196, 0.4);
                }
                100% { 
                    border-color: #ff6b6b; 
                    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                }
            }
            
            /* ボタンホバー効果 */
            #emergency-bookmark-btn:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 5px 15px rgba(255, 193, 7, 0.6) !important;
            }
            
            /* 隠蔽防止 */
            body, html {
                overflow-x: auto !important;
                overflow-y: auto !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 隠蔽CSS無効化完了');
    }
    
    addEmergencyCSS() {
        // 既存のCSSスタイルがない場合のみ追加
        if (!document.getElementById('emergency-css')) {
            const style = document.createElement('style');
            style.id = 'emergency-css';
            style.textContent = `
                @keyframes emergency-pulse {
                    0% { border-color: #ff6b6b; }
                    50% { border-color: #4ecdc4; }
                    100% { border-color: #ff6b6b; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupEmergencyEventListeners() {
        console.log('🎧 緊急イベントリスナー設定');
        
        // ブックマークボタン
        const bookmarkBtn = document.getElementById('emergency-bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('⭐ 緊急ブックマークボタンクリック！');
                
                // 視覚的フィードバック
                bookmarkBtn.style.transform = 'scale(0.9)';
                bookmarkBtn.style.backgroundColor = '#28a745';
                bookmarkBtn.style.color = 'white';
                
                setTimeout(() => {
                    bookmarkBtn.style.transform = 'scale(1.0)';
                    bookmarkBtn.style.backgroundColor = 'rgba(255, 193, 7, 0.3)';
                    bookmarkBtn.style.color = '#b8860b';
                }, 200);
                
                // ブックマーク管理表示
                this.showEmergencyBookmarkModal();
            });
            
            console.log('✅ 緊急ブックマークボタンイベント設定完了');
        }
        
        // 比較ボタン
        const compareBtn = document.getElementById('emergency-compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔍 緊急比較ボタンクリック');
                this.showEmergencyCompareModal();
            });
        }
        
        // 履歴ボタン
        const historyBtn = document.getElementById('emergency-history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📚 緊急履歴ボタンクリック');
                this.showEmergencyHistoryModal();
            });
        }
    }
    
    showEmergencyBookmarkModal() {
        console.log('⭐ 緊急ブックマークモーダル表示');
        
        // 既存モーダル削除
        const existing = document.getElementById('emergency-bookmark-modal');
        if (existing) existing.remove();
        
        // LocalStorageからデータ取得
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        const modalHTML = `
            <div id="emergency-bookmark-modal" style="
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
                    padding: 45px !important;
                    border-radius: 25px !important;
                    max-width: 800px !important;
                    width: 95% !important;
                    max-height: 90% !important;
                    overflow-y: auto !important;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.6) !important;
                    border: 6px solid #ff6b6b !important;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    animation: emergency-modal-appear 0.5s ease-out !important;
                ">
                    <div style="
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        margin-bottom: 40px !important;
                        padding-bottom: 30px !important;
                        border-bottom: 5px solid #ff6b6b !important;
                    ">
                        <h1 style="
                            margin: 0 !important; 
                            color: #ff6b6b !important; 
                            display: flex !important; 
                            align-items: center !important;
                            font-weight: bold !important;
                            font-size: 28px !important;
                        ">
                            🚨 緊急ブックマーク管理
                        </h1>
                        <button onclick="document.getElementById('emergency-bookmark-modal').remove()" 
                                style="
                                    background: #dc3545 !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 50% !important;
                                    width: 50px !important;
                                    height: 50px !important;
                                    font-size: 24px !important;
                                    cursor: pointer !important;
                                    display: flex !important;
                                    align-items: center !important;
                                    justify-content: center !important;
                                    font-weight: bold !important;
                                ">×</button>
                    </div>
                    <div id="emergency-bookmark-content">
                        ${this.generateEmergencyBookmarkContent(bookmarkedGuides)}
                    </div>
                    <div style="
                        margin-top: 40px !important;
                        padding-top: 30px !important;
                        border-top: 4px solid #ddd !important;
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                    ">
                        <button onclick="emergencyVisibilityOverride.clearAllEmergencyBookmarks()" 
                                style="
                                    background: #dc3545 !important;
                                    color: white !important;
                                    border: none !important;
                                    padding: 18px 35px !important;
                                    border-radius: 15px !important;
                                    cursor: pointer !important;
                                    font-weight: bold !important;
                                    font-size: 18px !important;
                                ">🗑️ 全削除</button>
                        <button onclick="document.getElementById('emergency-bookmark-modal').remove()" 
                                style="
                                    background: #6c757d !important;
                                    color: white !important;
                                    border: none !important;
                                    padding: 18px 35px !important;
                                    border-radius: 15px !important;
                                    cursor: pointer !important;
                                    font-size: 18px !important;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        // モーダルアニメーション追加
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            @keyframes emergency-modal-appear {
                0% { transform: scale(0.7); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(modalStyle);
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('✅ 緊急ブックマークモーダル表示完了');
    }
    
    generateEmergencyBookmarkContent(bookmarkedGuides) {
        if (bookmarkedGuides.length === 0) {
            return `
                <div style="text-align: center; padding: 70px; color: #666;">
                    <div style="font-size: 100px; margin-bottom: 35px;">📚</div>
                    <h2 style="margin-bottom: 25px; color: #ff6b6b;">ブックマークされたガイドはありません</h2>
                    <p style="font-size: 20px; margin-bottom: 30px;">ガイドカードの⭐ボタンをクリックしてブックマークしてください</p>
                    <div style="
                        margin-top: 30px; 
                        padding: 25px; 
                        background: #ffebee; 
                        border-radius: 15px; 
                        border: 4px solid #ff6b6b;
                    ">
                        <strong style="color: #c62828; font-size: 18px;">
                            🚨 緊急可視性オーバーライドシステムで確実に動作しています
                        </strong>
                    </div>
                </div>
            `;
        }
        
        let content = `
            <div style="
                margin-bottom: 35px; 
                padding: 30px; 
                background: #ffebee; 
                border-radius: 18px; 
                border: 4px solid #ff6b6b;
            ">
                <strong style="color: #c62828; font-size: 22px;">
                    📊 ブックマーク済み: ${bookmarkedGuides.length}件
                </strong>
                <br><small style="color: #666; margin-top: 10px; display: block; font-size: 16px;">
                    緊急可視性オーバーライドシステムで管理されています
                </small>
            </div>
        `;
        
        bookmarkedGuides.forEach(guideId => {
            content += `
                <div style="
                    padding: 30px;
                    border: 5px solid #ff6b6b;
                    border-radius: 20px;
                    margin: 20px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #fff5f5;
                    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
                ">
                    <div>
                        <strong style="color: #c62828; font-size: 20px;">⭐ ガイド ${guideId}</strong>
                        <br><small style="color: #666; margin-top: 10px; display: block;">
                            緊急システムで管理中
                        </small>
                    </div>
                    <button onclick="emergencyVisibilityOverride.removeEmergencyBookmark(${guideId})" 
                            style="
                                background: #dc3545;
                                color: white;
                                border: none;
                                padding: 15px 25px;
                                border-radius: 12px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 16px;
                            ">🗑️ 削除</button>
                </div>
            `;
        });
        
        return content;
    }
    
    removeEmergencyBookmark(guideId) {
        console.log(`⭐ 緊急ブックマーク削除: ガイド${guideId}`);
        
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const updatedBookmarks = bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
        
        // 表示更新
        const contentDiv = document.getElementById('emergency-bookmark-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.generateEmergencyBookmarkContent(updatedBookmarks);
        }
        
        // カウント更新
        this.updateEmergencyCounts();
        
        console.log(`✅ ガイド${guideId}緊急削除完了`);
    }
    
    clearAllEmergencyBookmarks() {
        if (confirm('緊急システム確認: 全てのブックマークを削除しますか？')) {
            localStorage.setItem('bookmarkedGuides', '[]');
            
            // 表示更新
            const contentDiv = document.getElementById('emergency-bookmark-content');
            if (contentDiv) {
                contentDiv.innerHTML = this.generateEmergencyBookmarkContent([]);
            }
            
            // カウント更新
            this.updateEmergencyCounts();
            
            console.log('⭐ 全ブックマーク緊急削除完了');
        }
    }
    
    updateEmergencyCounts() {
        const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        
        // カウント表示更新
        const bookmarkCount = document.getElementById('emergency-bookmark-count');
        const compareCount = document.getElementById('emergency-compare-count');
        
        if (bookmarkCount) bookmarkCount.textContent = bookmarkedGuides.length;
        if (compareCount) compareCount.textContent = comparedGuides.length;
        
        console.log(`📊 緊急カウント更新: ブックマーク${bookmarkedGuides.length}件, 比較${comparedGuides.length}件`);
    }
    
    showEmergencyCompareModal() {
        console.log('🔍 緊急比較モーダル表示');
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        alert(`🔍 比較機能 (緊急システム)\n\n現在比較中: ${comparedGuides.length}/3人\n\nガイドカードのチェックアイコンをクリックして比較対象を選択してください。`);
    }
    
    showEmergencyHistoryModal() {
        alert('📚 履歴機能 (緊急システム)\n\n閲覧履歴機能は開発中です。\n近日公開予定です。');
    }
    
    forceVisibility() {
        // 緊急ツールバーの存在確認
        const emergencyToolbar = document.getElementById('emergency-toolbar');
        if (!emergencyToolbar) {
            console.log('⚠️ 緊急ツールバーが消失 - 再作成');
            this.emergencyCreateToolbar();
            return;
        }
        
        // 可視性確認と強制修正
        const computedStyle = window.getComputedStyle(emergencyToolbar);
        if (computedStyle.display === 'none' || 
            computedStyle.visibility === 'hidden' || 
            computedStyle.opacity === '0' ||
            computedStyle.zIndex < '999999') {
            
            console.log('⚠️ 緊急ツールバーが隠されています - 強制修正');
            
            const toolbarStyle = `
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 999999 !important;
                background: rgba(255, 255, 255, 0.98) !important;
                border: 5px solid #ff6b6b !important;
                border-radius: 25px !important;
                padding: 18px 25px !important;
                box-shadow: 0 15px 35px rgba(0,0,0,0.3) !important;
                display: flex !important;
                gap: 15px !important;
                align-items: center !important;
                backdrop-filter: blur(20px) !important;
                font-family: 'Noto Sans JP', sans-serif !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                transform: none !important;
                overflow: visible !important;
                clip: auto !important;
                animation: emergency-pulse 2s infinite !important;
            `;
            
            emergencyToolbar.style.cssText = toolbarStyle;
        }
    }
    
    observeAndForceVisibility() {
        // DOM変更監視
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    // ツールバーが削除されたか確認
                    const emergencyToolbar = document.getElementById('emergency-toolbar');
                    if (!emergencyToolbar) {
                        console.log('🔄 DOM変更によりツールバーが削除 - 再作成');
                        setTimeout(() => this.emergencyCreateToolbar(), 100);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        console.log('👁️ DOM変更監視開始');
    }
}

// インスタンス作成
window.emergencyVisibilityOverride = new EmergencyVisibilityOverride();

console.log('✅ 緊急可視性オーバーライドシステム準備完了');