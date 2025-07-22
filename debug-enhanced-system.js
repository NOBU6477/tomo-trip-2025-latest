// デバッグ用 - CSP対応強化管理システム
console.log('🔍 デバッグ強化システム開始');

function createDebugEnhancedManagementSystem() {
    console.log('🔍 CSP対応デバッグシステム初期化');
    
    // 基本データ管理
    let bookmarkedGuides = [];
    let comparedGuides = [];
    
    try {
        bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        console.log('📊 データ読み込み完了:', { bookmarks: bookmarkedGuides.length, compares: comparedGuides.length });
    } catch (e) {
        console.log('⚠️ LocalStorage読み込みエラー:', e);
    }
    
    // ガイダンスパネル作成（CSP対応）
    function createGuidancePanel() {
        console.log('🎯 ガイダンスパネル作成開始');
        
        // 既存削除
        const existing = document.getElementById('debug-guidance-panel');
        if (existing) {
            existing.remove();
        }
        
        // パネル作成
        const panel = document.createElement('div');
        panel.id = 'debug-guidance-panel';
        panel.className = 'debug-guidance-panel';
        
        // CSS直接適用（CSP対応）
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '99998';
        panel.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        panel.style.color = 'white';
        panel.style.padding = '20px';
        panel.style.borderRadius = '15px';
        panel.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
        panel.style.fontFamily = "'Noto Sans JP', sans-serif";
        panel.style.fontWeight = 'bold';
        panel.style.maxWidth = '350px';
        panel.style.border = '3px solid white';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.pointerEvents = 'auto';
        
        // 内容作成
        const content = createGuidanceContent(bookmarkedGuides.length, comparedGuides.length);
        panel.innerHTML = content;
        
        // DOM追加
        document.body.appendChild(panel);
        
        // イベントリスナー追加（CSP対応）
        addPanelEventListeners(panel);
        
        console.log('✅ ガイダンスパネル作成完了');
        return panel;
    }
    
    // ガイダンス内容作成
    function createGuidanceContent(bookmarkCount, compareCount) {
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
                    <button data-action="show-bookmarks" 
                            style="background: #ffc107; color: #000; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                        📚 ブックマーク管理 (${bookmarkCount}件)
                    </button>
                `;
            }
            
            if (compareCount > 0) {
                content += `
                    <button data-action="show-compare" 
                            style="background: #17a2b8; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">
                        🔍 ガイド比較 (${compareCount}件)
                    </button>
                `;
            }
            
            if (compareCount >= 2) {
                content += `
                    <button data-action="start-booking" 
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
                <button data-action="close-panel" 
                        style="background: rgba(255,255,255,0.3); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    ガイドを閉じる
                </button>
            </div>
        `;
        
        return content;
    }
    
    // イベントリスナー追加（CSP対応）
    function addPanelEventListeners(panel) {
        panel.addEventListener('click', function(e) {
            const action = e.target.getAttribute('data-action');
            if (!action) return;
            
            console.log('🔍 アクション実行:', action);
            
            switch (action) {
                case 'show-bookmarks':
                    showBookmarkManagement();
                    break;
                case 'show-compare':
                    showCompareView();
                    break;
                case 'start-booking':
                    startBookingProcess();
                    break;
                case 'close-panel':
                    panel.style.display = 'none';
                    break;
            }
        });
    }
    
    // ブックマーク管理画面
    function showBookmarkManagement() {
        console.log('📚 ブックマーク管理画面表示');
        alert(`📚 ブックマーク管理センター\n\n現在のブックマーク: ${bookmarkedGuides.length}件\n\n• 一括削除\n• 個別削除\n• エクスポート\n• 詳細表示\n\n機能を準備中です。`);
    }
    
    // 比較画面
    function showCompareView() {
        console.log('🔍 比較画面表示');
        if (comparedGuides.length === 0) {
            alert('比較対象が選択されていません。\nガイドカードの✓ボタンで比較対象を選択してください。');
            return;
        }
        alert(`🔍 ガイド比較センター\n\n比較中: ${comparedGuides.length}件\n${comparedGuides.map(id => `• ${id}`).join('\n')}\n\n詳細比較機能を準備中です。`);
    }
    
    // 予約プロセス
    function startBookingProcess() {
        console.log('🚀 予約プロセス開始');
        if (comparedGuides.length === 0) {
            alert('比較対象を選択してください。');
            return;
        }
        alert(`🚀 予約プロセス開始\n\n選択可能なガイド:\n${comparedGuides.map(id => `• ${id}`).join('\n')}\n\n次のステップで詳細を選択してください。`);
    }
    
    // 初期化
    function init() {
        console.log('🔍 デバッグシステム初期化');
        createGuidancePanel();
        
        // 定期更新
        setInterval(() => {
            try {
                const newBookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
                const newCompares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
                
                if (newBookmarks.length !== bookmarkedGuides.length || newCompares.length !== comparedGuides.length) {
                    bookmarkedGuides = newBookmarks;
                    comparedGuides = newCompares;
                    
                    const panel = document.getElementById('debug-guidance-panel');
                    if (panel) {
                        const content = createGuidanceContent(bookmarkedGuides.length, comparedGuides.length);
                        panel.innerHTML = content;
                        addPanelEventListeners(panel);
                    }
                    
                    console.log('🔄 ガイダンス更新:', { bookmarks: bookmarkedGuides.length, compares: comparedGuides.length });
                }
            } catch (e) {
                console.log('⚠️ 更新エラー:', e);
            }
        }, 5000);
    }
    
    // DOMロード待ち
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ デバッグ強化システム準備完了');
}

// 実行
createDebugEnhancedManagementSystem();