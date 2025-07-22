// 強化管理システム - 一括管理と動線改善
console.log('🎯 強化管理システム開始');

class EnhancedManagementSystem {
    constructor() {
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        this.maxCompareGuides = 3;
        this.init();
    }
    
    init() {
        console.log('🎯 強化管理システム初期化');
        
        // 動線ガイダンスシステムを追加
        this.addGuidanceSystem();
        
        // ツールバーボタンの強化
        this.enhanceToolbarButtons();
        
        // 継続監視
        setInterval(() => this.updateGuidance(), 5000);
    }
    
    addGuidanceSystem() {
        console.log('🎯 動線ガイダンスシステム追加');
        
        // ガイダンスパネルを作成
        const guidancePanel = document.createElement('div');
        guidancePanel.id = 'guidance-panel';
        guidancePanel.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 99998 !important;
            background: linear-gradient(45deg, #28a745, #20c997) !important;
            color: white !important;
            padding: 20px !important;
            border-radius: 15px !important;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4) !important;
            font-family: 'Noto Sans JP', sans-serif !important;
            font-weight: bold !important;
            max-width: 350px !important;
            border: 3px solid white !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        `;
        
        document.body.appendChild(guidancePanel);
        this.updateGuidanceContent();
        
        console.log('✅ ガイダンスパネル追加完了');
    }
    
    updateGuidanceContent() {
        const guidancePanel = document.getElementById('guidance-panel');
        if (!guidancePanel) return;
        
        const bookmarkCount = this.bookmarkedGuides.length;
        const compareCount = this.comparedGuides.length;
        
        let content = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="font-size: 24px; margin-right: 10px;">🎯</div>
                <div>
                    <div style="font-size: 18px; font-weight: bold;">次のステップガイド</div>
                    <div style="font-size: 12px; opacity: 0.9;">何をしますか？</div>
                </div>
            </div>
        `;
        
        if (bookmarkCount === 0 && compareCount === 0) {
            content += `
                <div style="margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                    <div style="font-size: 16px; margin-bottom: 10px;">📚 ステップ1: ガイドを選択</div>
                    <div style="font-size: 14px; line-height: 1.4;">
                        • ガイドカードの左上⭐でブックマーク<br>
                        • ガイドカードの左上✓で比較対象選択<br>
                        • 最大3人まで比較可能
                    </div>
                </div>
            `;
        } else {
            content += `
                <div style="margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 10px;">
                    <div style="font-size: 16px; margin-bottom: 10px;">📊 現在の選択状況</div>
                    <div style="font-size: 14px; line-height: 1.4;">
                        ⭐ ブックマーク: ${bookmarkCount}件<br>
                        ✓ 比較対象: ${compareCount}/3件
                    </div>
                </div>
            `;
            
            content += `
                <div style="margin-bottom: 15px;">
                    <div style="font-size: 16px; margin-bottom: 10px;">🎯 次にできること:</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
            `;
            
            if (bookmarkCount > 0) {
                content += `
                    <button onclick="enhancedManagementSystem.showBookmarkManagement()" 
                            style="background: #ffc107; color: #000; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                        📚 ブックマーク管理 (${bookmarkCount}件)
                    </button>
                `;
            }
            
            if (compareCount > 0) {
                content += `
                    <button onclick="enhancedManagementSystem.showCompareView()" 
                            style="background: #17a2b8; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                        🔍 ガイド比較 (${compareCount}件)
                    </button>
                `;
            }
            
            if (compareCount >= 2) {
                content += `
                    <button onclick="enhancedManagementSystem.startBookingProcess()" 
                            style="background: #dc3545; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; border: 2px solid white;">
                        🚀 予約プロセス開始
                    </button>
                `;
            }
            
            content += `
                    </div>
                </div>
            `;
        }
        
        content += `
            <div style="text-align: center; margin-top: 15px;">
                <button onclick="document.getElementById('guidance-panel').style.display='none'" 
                        style="background: rgba(255,255,255,0.3); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    ガイドを閉じる
                </button>
            </div>
        `;
        
        guidancePanel.innerHTML = content;
    }
    
    enhanceToolbarButtons() {
        console.log('🎯 ツールバーボタン強化');
        
        // 緊急ツールバーボタンの機能強化
        setTimeout(() => {
            const emergencyBookmarkBtn = document.getElementById('emergency-bookmark-btn');
            if (emergencyBookmarkBtn) {
                emergencyBookmarkBtn.onclick = () => this.showBookmarkManagement();
            }
            
            const emergencyCompareBtn = document.getElementById('emergency-compare-btn');
            if (emergencyCompareBtn) {
                emergencyCompareBtn.onclick = () => this.showCompareView();
            }
            
            const emergencyHistoryBtn = document.getElementById('emergency-history-btn');
            if (emergencyHistoryBtn) {
                emergencyHistoryBtn.onclick = () => this.showHistory();
            }
        }, 2000);
    }
    
    showBookmarkManagement() {
        console.log('📚 ブックマーク管理画面表示');
        
        // 既存モーダル削除
        const existing = document.getElementById('enhanced-bookmark-modal');
        if (existing) existing.remove();
        
        const modalHTML = `
            <div id="enhanced-bookmark-modal" style="
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.95) !important;
                z-index: 99999999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-family: 'Noto Sans JP', sans-serif !important;
                pointer-events: auto !important;
            ">
                <div style="
                    background: white !important;
                    padding: 40px !important;
                    border-radius: 25px !important;
                    max-width: 900px !important;
                    width: 95% !important;
                    max-height: 90% !important;
                    overflow-y: auto !important;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.8) !important;
                    border: 5px solid #ffc107 !important;
                ">
                    <div style="
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        margin-bottom: 30px !important;
                        padding-bottom: 20px !important;
                        border-bottom: 4px solid #ffc107 !important;
                    ">
                        <h1 style="
                            margin: 0 !important; 
                            color: #ffc107 !important; 
                            display: flex !important; 
                            align-items: center !important;
                            font-weight: bold !important;
                            font-size: 28px !important;
                        ">
                            📚 ブックマーク管理センター
                        </h1>
                        <button onclick="document.getElementById('enhanced-bookmark-modal').remove()" 
                                style="
                                    background: #dc3545 !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 50% !important;
                                    width: 50px !important;
                                    height: 50px !important;
                                    font-size: 24px !important;
                                    cursor: pointer !important;
                                    font-weight: bold !important;
                                ">×</button>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <div style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            background: #fff3cd !important;
                            padding: 20px !important;
                            border-radius: 15px !important;
                            border: 3px solid #ffc107 !important;
                        ">
                            <div>
                                <h3 style="margin: 0; color: #856404; font-size: 20px;">
                                    📊 合計: ${this.bookmarkedGuides.length}件のブックマーク
                                </h3>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                    一括操作で効率的に管理できます
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button onclick="enhancedManagementSystem.selectAllBookmarks()" 
                                        style="
                                            background: #28a745; color: white; border: none; 
                                            padding: 12px 20px; border-radius: 10px; cursor: pointer; 
                                            font-weight: bold; font-size: 14px;
                                        ">✓ 全選択</button>
                                <button onclick="enhancedManagementSystem.clearAllBookmarks()" 
                                        style="
                                            background: #dc3545; color: white; border: none; 
                                            padding: 12px 20px; border-radius: 10px; cursor: pointer; 
                                            font-weight: bold; font-size: 14px;
                                        ">🗑️ 全削除</button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="bookmark-list-container">
                        ${this.generateBookmarkList()}
                    </div>
                    
                    <div style="
                        margin-top: 30px !important;
                        padding-top: 20px !important;
                        border-top: 3px solid #ddd !important;
                        display: flex !important;
                        justify-content: center !important;
                        gap: 15px !important;
                    ">
                        <button onclick="enhancedManagementSystem.exportBookmarks()" 
                                style="
                                    background: #17a2b8; color: white; border: none; 
                                    padding: 15px 25px; border-radius: 12px; cursor: pointer; 
                                    font-weight: bold; font-size: 16px;
                                ">📤 エクスポート</button>
                        <button onclick="document.getElementById('enhanced-bookmark-modal').remove()" 
                                style="
                                    background: #6c757d; color: white; border: none; 
                                    padding: 15px 25px; border-radius: 12px; cursor: pointer; 
                                    font-size: 16px;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.updateGuidance();
        console.log('✅ ブックマーク管理画面表示完了');
    }
    
    generateBookmarkList() {
        if (this.bookmarkedGuides.length === 0) {
            return `
                <div style="text-align: center; padding: 80px; color: #666;">
                    <div style="font-size: 100px; margin-bottom: 30px;">📚</div>
                    <h3 style="margin-bottom: 20px; font-size: 24px;">ブックマークがありません</h3>
                    <p style="font-size: 18px; margin-bottom: 30px;">ガイドカードの⭐ボタンでブックマークを追加してください</p>
                </div>
            `;
        }
        
        let content = '';
        this.bookmarkedGuides.forEach((guideId, index) => {
            content += `
                <div style="
                    padding: 25px;
                    border: 4px solid #ffc107;
                    border-radius: 20px;
                    margin: 20px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(45deg, #fff3cd, #ffeeba);
                    box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <div style="
                                background: #ffc107; color: white; border-radius: 50%; 
                                width: 40px; height: 40px; display: flex; align-items: center; 
                                justify-content: center; margin-right: 15px; font-weight: bold;
                            ">${index + 1}</div>
                            <div>
                                <h4 style="margin: 0; color: #856404; font-size: 20px; font-weight: bold;">
                                    ⭐ ${guideId}
                                </h4>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                    ブックマーク登録日: ${new Date().toLocaleDateString('ja-JP')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button onclick="enhancedManagementSystem.viewGuideDetails('${guideId}')" 
                                style="
                                    background: #28a745; color: white; border: none; 
                                    padding: 12px 18px; border-radius: 10px; cursor: pointer; 
                                    font-weight: bold; font-size: 14px;
                                ">👁️ 詳細</button>
                        <button onclick="enhancedManagementSystem.removeBookmark('${guideId}')" 
                                style="
                                    background: #dc3545; color: white; border: none; 
                                    padding: 12px 18px; border-radius: 10px; cursor: pointer; 
                                    font-weight: bold; font-size: 14px;
                                ">🗑️ 削除</button>
                    </div>
                </div>
            `;
        });
        
        return content;
    }
    
    showCompareView() {
        console.log('🔍 比較画面表示');
        
        if (this.comparedGuides.length === 0) {
            alert('比較対象が選択されていません。\nガイドカードの✓ボタンで比較対象を選択してください。');
            return;
        }
        
        // 比較モーダル作成
        const existing = document.getElementById('enhanced-compare-modal');
        if (existing) existing.remove();
        
        const modalHTML = `
            <div id="enhanced-compare-modal" style="
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.95) !important;
                z-index: 99999999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-family: 'Noto Sans JP', sans-serif !important;
            ">
                <div style="
                    background: white !important;
                    padding: 40px !important;
                    border-radius: 25px !important;
                    max-width: 1200px !important;
                    width: 95% !important;
                    max-height: 90% !important;
                    overflow-y: auto !important;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.8) !important;
                    border: 5px solid #28a745 !important;
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
                            font-weight: bold !important;
                            font-size: 28px !important;
                        ">
                            🔍 ガイド比較センター
                        </h1>
                        <button onclick="document.getElementById('enhanced-compare-modal').remove()" 
                                style="
                                    background: #dc3545 !important;
                                    color: white !important;
                                    border: none !important;
                                    border-radius: 50% !important;
                                    width: 50px !important;
                                    height: 50px !important;
                                    font-size: 24px !important;
                                    cursor: pointer !important;
                                    font-weight: bold !important;
                                ">×</button>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <div style="
                            background: #d4edda !important;
                            padding: 20px !important;
                            border-radius: 15px !important;
                            border: 3px solid #28a745 !important;
                            text-align: center !important;
                        ">
                            <h3 style="margin: 0 0 10px 0; color: #155724; font-size: 20px;">
                                📊 ${this.comparedGuides.length}人のガイドを比較中
                            </h3>
                            <p style="margin: 0; color: #666; font-size: 14px;">
                                詳細比較して最適なガイドを選択してください
                            </p>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        ${this.generateCompareCards()}
                    </div>
                    
                    <div style="
                        text-align: center; margin-top: 30px; padding-top: 20px; 
                        border-top: 3px solid #ddd; display: flex; justify-content: center; gap: 15px;
                    ">
                        <button onclick="enhancedManagementSystem.startBookingProcess()" 
                                style="
                                    background: #dc3545; color: white; border: none; 
                                    padding: 18px 35px; border-radius: 15px; cursor: pointer; 
                                    font-weight: bold; font-size: 18px; border: 3px solid white;
                                ">🚀 選択したガイドで予約開始</button>
                        <button onclick="document.getElementById('enhanced-compare-modal').remove()" 
                                style="
                                    background: #6c757d; color: white; border: none; 
                                    padding: 15px 25px; border-radius: 12px; cursor: pointer; 
                                    font-size: 16px;
                                ">閉じる</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('✅ 比較画面表示完了');
    }
    
    generateCompareCards() {
        return this.comparedGuides.map((guideId, index) => `
            <div style="
                border: 4px solid #28a745;
                border-radius: 20px;
                padding: 25px;
                background: linear-gradient(45deg, #d4edda, #c3e6cb);
                box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
                text-align: center;
            ">
                <div style="
                    background: #28a745; color: white; border-radius: 50%; 
                    width: 50px; height: 50px; display: flex; align-items: center; 
                    justify-content: center; margin: 0 auto 15px auto; font-weight: bold; font-size: 20px;
                ">${index + 1}</div>
                <h4 style="margin: 0 0 15px 0; color: #155724; font-size: 20px; font-weight: bold;">
                    ✓ ${guideId}
                </h4>
                <div style="margin-bottom: 20px; font-size: 14px; color: #666;">
                    <div>⭐ 評価: 4.${Math.floor(Math.random() * 9) + 1}/5.0</div>
                    <div>💰 料金: ¥${(Math.floor(Math.random() * 5) + 6) * 1000}/セッション</div>
                    <div>🗣️ 言語: 日本語、英語</div>
                    <div>📍 エリア: 東京都内</div>
                </div>
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button onclick="enhancedManagementSystem.selectForBooking('${guideId}')" 
                            style="
                                background: #dc3545; color: white; border: none; 
                                padding: 10px 15px; border-radius: 8px; cursor: pointer; 
                                font-weight: bold; font-size: 13px;
                            ">🚀 予約</button>
                    <button onclick="enhancedManagementSystem.removeFromCompare('${guideId}')" 
                            style="
                                background: #6c757d; color: white; border: none; 
                                padding: 10px 15px; border-radius: 8px; cursor: pointer; 
                                font-size: 13px;
                            ">削除</button>
                </div>
            </div>
        `).join('');
    }
    
    // アクション関数群
    removeBookmark(guideId) {
        this.bookmarkedGuides = this.bookmarkedGuides.filter(id => id !== guideId);
        localStorage.setItem('bookmarkedGuides', JSON.stringify(this.bookmarkedGuides));
        
        // 表示更新
        const container = document.getElementById('bookmark-list-container');
        if (container) {
            container.innerHTML = this.generateBookmarkList();
        }
        
        this.updateAllCounts();
        this.updateGuidance();
        console.log(`📚 ブックマーク削除: ${guideId}`);
    }
    
    clearAllBookmarks() {
        if (confirm('全てのブックマークを削除しますか？')) {
            this.bookmarkedGuides = [];
            localStorage.setItem('bookmarkedGuides', '[]');
            
            const container = document.getElementById('bookmark-list-container');
            if (container) {
                container.innerHTML = this.generateBookmarkList();
            }
            
            this.updateAllCounts();
            this.updateGuidance();
            console.log('📚 全ブックマーク削除完了');
        }
    }
    
    selectForBooking(guideId) {
        alert(`🚀 ${guideId}の予約プロセスを開始します。\n\n次のステップ:\n1. 日程選択\n2. プラン選択\n3. 連絡先入力\n4. 支払い確認`);
        console.log(`🚀 予約選択: ${guideId}`);
    }
    
    startBookingProcess() {
        if (this.comparedGuides.length === 0) {
            alert('比較対象を選択してください。');
            return;
        }
        
        alert(`🚀 予約プロセスを開始します。\n\n選択可能なガイド:\n${this.comparedGuides.map(id => `• ${id}`).join('\n')}\n\n次のステップで詳細を選択してください。`);
    }
    
    removeFromCompare(guideId) {
        this.comparedGuides = this.comparedGuides.filter(id => id !== guideId);
        localStorage.setItem('comparedGuides', JSON.stringify(this.comparedGuides));
        
        // 比較画面を再表示
        document.getElementById('enhanced-compare-modal').remove();
        this.showCompareView();
        
        this.updateAllCounts();
        this.updateGuidance();
        console.log(`🔍 比較から削除: ${guideId}`);
    }
    
    updateAllCounts() {
        // 全てのカウント要素を更新
        const allCountElements = document.querySelectorAll('[id*="bookmark-count"], [id*="compare-count"]');
        
        allCountElements.forEach(element => {
            if (element.id.includes('bookmark')) {
                element.textContent = this.bookmarkedGuides.length;
            } else if (element.id.includes('compare')) {
                element.textContent = this.comparedGuides.length;
            }
        });
    }
    
    updateGuidance() {
        // LocalStorageから最新データを取得
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        
        // ガイダンス内容を更新
        this.updateGuidanceContent();
    }
    
    showHistory() {
        alert('📖 履歴機能\n\n閲覧履歴機能は開発中です。\n近日公開予定です。');
    }
    
    exportBookmarks() {
        const data = {
            bookmarks: this.bookmarkedGuides,
            exportDate: new Date().toISOString(),
            count: this.bookmarkedGuides.length
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookmarks_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('📤 ブックマークエクスポート完了');
    }
}

// インスタンス作成
window.enhancedManagementSystem = new EnhancedManagementSystem();

console.log('✅ 強化管理システム準備完了');