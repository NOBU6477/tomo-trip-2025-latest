// シンプル管理パネル - 確実な動作保証
console.log('✅ シンプル管理パネル開始');

(function() {
    // 赤いテストパネルを閉じてから緑のパネルを表示
    setTimeout(function() {
        const testPanel = document.getElementById('immediate-test-panel');
        if (testPanel) {
            testPanel.remove();
            console.log('✅ テストパネル削除完了');
        }
        
        createManagementPanel();
    }, 3000);
    
    function createManagementPanel() {
        console.log('✅ 管理パネル作成開始');
        
        // 既存パネル削除
        const existing = document.getElementById('simple-management-panel');
        if (existing) existing.remove();
        
        // LocalStorageデータ取得
        let bookmarks = [];
        let compares = [];
        try {
            bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        } catch (e) {
            console.log('✅ LocalStorage読み込みエラー:', e);
        }
        
        // パネル作成
        const panel = document.createElement('div');
        panel.id = 'simple-management-panel';
        
        // スタイル適用
        panel.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999998 !important;
            background: linear-gradient(45deg, #28a745, #20c997) !important;
            color: white !important;
            padding: 25px !important;
            border-radius: 15px !important;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4) !important;
            font-family: 'Noto Sans JP', Arial, sans-serif !important;
            font-weight: bold !important;
            max-width: 380px !important;
            border: 3px solid white !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            pointer-events: auto !important;
        `;
        
        // 内容作成
        panel.innerHTML = createPanelContent(bookmarks.length, compares.length);
        
        // DOM追加
        document.body.appendChild(panel);
        
        // イベントリスナー追加
        addEventListeners(panel);
        
        console.log('✅ 管理パネル作成完了');
        
        // 定期更新
        setInterval(function() {
            updatePanelContent(panel);
        }, 5000);
    }
    
    function createPanelContent(bookmarkCount, compareCount) {
        let content = `
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="font-size: 28px; margin-right: 12px;">🎯</div>
                <div>
                    <div style="font-size: 20px; font-weight: bold;">ガイド管理センター</div>
                    <div style="font-size: 13px; opacity: 0.9;">選択状況と次のステップ</div>
                </div>
            </div>
        `;
        
        // 選択状況表示
        content += `
            <div style="background: rgba(255,255,255,0.25); padding: 18px; border-radius: 12px; margin-bottom: 20px;">
                <div style="font-size: 17px; margin-bottom: 12px;">📊 現在の選択状況</div>
                <div style="font-size: 15px; line-height: 1.6;">
                    ⭐ ブックマーク: <span style="background: #ffc107; color: #000; padding: 2px 8px; border-radius: 5px;">${bookmarkCount}件</span><br>
                    ✓ 比較対象: <span style="background: #17a2b8; color: white; padding: 2px 8px; border-radius: 5px;">${compareCount}/3件</span>
                </div>
            </div>
        `;
        
        // 次のステップ
        if (bookmarkCount === 0 && compareCount === 0) {
            content += `
                <div style="background: rgba(255,255,255,0.25); padding: 18px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="font-size: 17px; margin-bottom: 12px;">📚 ステップ1: ガイドを選択</div>
                    <div style="font-size: 14px; line-height: 1.5;">
                        • ガイドカードの左上⭐でブックマーク<br>
                        • ガイドカードの左上✓で比較対象選択<br>
                        • 最大3人まで比較可能
                    </div>
                </div>
            `;
        } else {
            content += `
                <div style="background: rgba(255,255,255,0.25); padding: 18px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="font-size: 17px; margin-bottom: 15px;">🎯 利用可能な機能:</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
            `;
            
            if (bookmarkCount > 0) {
                content += `
                    <button data-action="manage-bookmarks" style="
                        background: #ffc107; 
                        color: #000; 
                        border: none; 
                        padding: 12px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-weight: bold; 
                        font-size: 14px;
                        transition: transform 0.2s;
                    ">
                        📚 ブックマーク管理 (${bookmarkCount}件)
                    </button>
                `;
            }
            
            if (compareCount > 0) {
                content += `
                    <button data-action="compare-guides" style="
                        background: #17a2b8; 
                        color: white; 
                        border: none; 
                        padding: 12px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-weight: bold; 
                        font-size: 14px;
                        transition: transform 0.2s;
                    ">
                        🔍 ガイド比較 (${compareCount}件)
                    </button>
                `;
            }
            
            if (compareCount >= 2) {
                content += `
                    <button data-action="start-booking" style="
                        background: #dc3545; 
                        color: white; 
                        border: 2px solid white; 
                        padding: 15px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-weight: bold; 
                        font-size: 16px;
                        transition: transform 0.2s;
                    ">
                        🚀 予約プロセス開始
                    </button>
                `;
            }
            
            if (bookmarkCount > 0 || compareCount > 0) {
                content += `
                    <button data-action="export-data" style="
                        background: rgba(255,255,255,0.3); 
                        color: white; 
                        border: 1px solid white; 
                        padding: 10px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-weight: bold; 
                        font-size: 13px;
                    ">
                        💾 データエクスポート
                    </button>
                `;
            }
            
            content += `
                    </div>
                </div>
            `;
        }
        
        // 閉じるボタン
        content += `
            <div style="text-align: center; margin-top: 15px;">
                <button data-action="close-panel" style="
                    background: rgba(255,255,255,0.3); 
                    color: white; 
                    border: 1px solid white; 
                    padding: 10px 20px; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    font-size: 13px;
                    font-weight: bold;
                ">
                    パネルを閉じる
                </button>
            </div>
        `;
        
        return content;
    }
    
    function addEventListeners(panel) {
        panel.addEventListener('click', function(e) {
            const action = e.target.getAttribute('data-action');
            if (!action) return;
            
            console.log('✅ アクション実行:', action);
            
            switch (action) {
                case 'manage-bookmarks':
                    showBookmarkManagement();
                    break;
                case 'compare-guides':
                    showCompareManagement();
                    break;
                case 'start-booking':
                    startBookingProcess();
                    break;
                case 'export-data':
                    exportData();
                    break;
                case 'close-panel':
                    panel.style.display = 'none';
                    break;
            }
        });
        
        // ホバー効果
        panel.addEventListener('mouseover', function(e) {
            if (e.target.tagName === 'BUTTON' && e.target.getAttribute('data-action') !== 'close-panel') {
                e.target.style.transform = 'translateY(-2px)';
            }
        });
        
        panel.addEventListener('mouseout', function(e) {
            if (e.target.tagName === 'BUTTON') {
                e.target.style.transform = 'translateY(0)';
            }
        });
    }
    
    function updatePanelContent(panel) {
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            
            const newContent = createPanelContent(bookmarks.length, compares.length);
            panel.innerHTML = newContent;
            addEventListeners(panel);
            
            console.log('✅ パネル更新:', { bookmarks: bookmarks.length, compares: compares.length });
        } catch (e) {
            console.log('✅ 更新エラー:', e);
        }
    }
    
    // 機能実装
    function showBookmarkManagement() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const message = `📚 ブックマーク管理センター\n\n現在のブックマーク: ${bookmarks.length}件\n\n利用可能な機能:\n• 一括削除\n• 個別削除\n• 詳細表示\n• エクスポート\n\n詳細管理画面は開発中です。`;
        alert(message);
    }
    
    function showCompareManagement() {
        const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        const message = `🔍 ガイド比較センター\n\n比較対象: ${compares.length}件\n${compares.map(id => `• ${id}`).join('\n')}\n\n並列比較表示機能は開発中です。`;
        alert(message);
    }
    
    function startBookingProcess() {
        const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        const message = `🚀 予約プロセス開始\n\n選択可能なガイド:\n${compares.map(id => `• ${id}`).join('\n')}\n\n予約システムとの連携機能は開発中です。`;
        alert(message);
    }
    
    function exportData() {
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            
            const exportData = {
                export_date: new Date().toISOString(),
                bookmarks: bookmarks,
                compares: compares,
                total_bookmarks: bookmarks.length,
                total_compares: compares.length
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `guide_data_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            alert('💾 データエクスポート完了\nファイルがダウンロードされました。');
        } catch (e) {
            console.log('✅ エクスポートエラー:', e);
            alert('❌ エクスポートに失敗しました。');
        }
    }
    
    console.log('✅ シンプル管理パネルシステム準備完了');
})();