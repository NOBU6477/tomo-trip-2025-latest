// 最終管理システム - 確実な動作保証
console.log('🎯 最終管理システム開始');

(function finalManagementSystem() {
    'use strict';
    
    // 既存の全てのパネルを強制削除
    function removeAllExistingPanels() {
        const panelIds = [
            'immediate-test-panel',
            'nuclear-panel', 
            'emergency-guidance-panel',
            'debug-guidance-panel',
            'guidance-panel',
            'simple-management-panel'
        ];
        
        panelIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
                console.log('🎯 削除:', id);
            }
        });
        
        // クラス名での検索も実行
        const panels = document.querySelectorAll('[id*="panel"], [class*="panel"]');
        panels.forEach(panel => {
            if (panel.style.position === 'fixed' && 
                (panel.style.top === '20px' || panel.style.top.includes('20px'))) {
                panel.remove();
                console.log('🎯 固定パネル削除:', panel.id || panel.className);
            }
        });
    }
    
    // 最終管理パネル作成
    function createFinalManagementPanel() {
        console.log('🎯 最終管理パネル作成開始');
        
        // LocalStorageデータ取得
        let bookmarkCount = 0;
        let compareCount = 0;
        let bookmarks = [];
        let compares = [];
        
        try {
            bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            bookmarkCount = bookmarks.length;
            compareCount = compares.length;
        } catch (e) {
            console.log('🎯 LocalStorage読み込みエラー:', e);
        }
        
        // パネル要素作成
        const panel = document.createElement('div');
        panel.id = 'final-management-panel';
        panel.className = 'management-panel-final';
        
        // 確実なスタイル適用
        const panelStyles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '2147483647',
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(40, 167, 69, 0.5)',
            fontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', Arial, sans-serif",
            fontWeight: '600',
            maxWidth: '380px',
            minWidth: '320px',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            visibility: 'visible',
            opacity: '1',
            display: 'block',
            pointerEvents: 'auto',
            transform: 'translateZ(0)',
            willChange: 'transform'
        };
        
        // スタイル適用
        Object.assign(panel.style, panelStyles);
        
        // 内容構築
        panel.innerHTML = buildPanelHTML(bookmarkCount, compareCount);
        
        // DOM追加
        document.body.appendChild(panel);
        
        // イベント設定
        setupPanelEvents(panel);
        
        // スタイル保護
        protectPanelStyles(panel, panelStyles);
        
        console.log('🎯 最終管理パネル作成完了', { bookmarkCount, compareCount });
        
        return panel;
    }
    
    function buildPanelHTML(bookmarkCount, compareCount) {
        const currentTime = new Date().toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let html = `
            <!-- ヘッダー -->
            <div style="display: flex; align-items: center; margin-bottom: 20px; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 15px;">
                <div style="font-size: 28px; margin-right: 12px;">🎯</div>
                <div style="flex: 1;">
                    <div style="font-size: 20px; font-weight: bold; margin-bottom: 3px;">ガイド管理センター</div>
                    <div style="font-size: 12px; opacity: 0.85;">選択・比較・予約管理 | ${currentTime}</div>
                </div>
            </div>
            
            <!-- 選択状況 -->
            <div style="background: rgba(255,255,255,0.15); padding: 18px; border-radius: 12px; margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; display: flex; align-items: center;">
                    <span style="margin-right: 8px;">📊</span>現在の選択状況
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                    <div style="background: rgba(255,193,7,0.2); padding: 10px; border-radius: 8px; border-left: 4px solid #ffc107;">
                        <div style="font-weight: bold; margin-bottom: 4px;">⭐ ブックマーク</div>
                        <div style="font-size: 18px; font-weight: bold;">${bookmarkCount}件</div>
                    </div>
                    <div style="background: rgba(23,162,184,0.2); padding: 10px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                        <div style="font-weight: bold; margin-bottom: 4px;">✓ 比較対象</div>
                        <div style="font-size: 18px; font-weight: bold;">${compareCount}/3件</div>
                    </div>
                </div>
            </div>
        `;
        
        // ステップ表示
        if (bookmarkCount === 0 && compareCount === 0) {
            html += `
                <div style="background: rgba(255,255,255,0.15); padding: 18px; border-radius: 12px; margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; display: flex; align-items: center;">
                        <span style="margin-right: 8px;">📚</span>ガイド選択を開始
                    </div>
                    <div style="font-size: 13px; line-height: 1.6; opacity: 0.9;">
                        <div style="margin-bottom: 8px;">• ガイドカードの左上<strong>⭐</strong>ボタンでブックマーク</div>
                        <div style="margin-bottom: 8px;">• ガイドカードの左上<strong>✓</strong>ボタンで比較対象選択</div>
                        <div>• 最大3人まで同時比較が可能です</div>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="background: rgba(255,255,255,0.15); padding: 18px; border-radius: 12px; margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center;">
                        <span style="margin-right: 8px;">⚡</span>利用可能な機能
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
            `;
            
            if (bookmarkCount > 0) {
                html += `
                    <button class="action-btn" data-action="manage-bookmarks" style="
                        background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
                        color: #000;
                        border: none;
                        padding: 12px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <span style="margin-right: 8px;">📚</span>ブックマーク管理 (${bookmarkCount}件)
                    </button>
                `;
            }
            
            if (compareCount > 0) {
                html += `
                    <button class="action-btn" data-action="compare-guides" style="
                        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
                        color: white;
                        border: none;
                        padding: 12px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 14px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <span style="margin-right: 8px;">🔍</span>ガイド比較表示 (${compareCount}件)
                    </button>
                `;
            }
            
            if (compareCount >= 2) {
                html += `
                    <button class="action-btn" data-action="start-booking" style="
                        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                        color: white;
                        border: 2px solid rgba(255,255,255,0.8);
                        padding: 14px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 15px;
                        transition: all 0.3s ease;
                        box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <span style="margin-right: 8px;">🚀</span>予約プロセス開始
                    </button>
                `;
            }
            
            if (bookmarkCount > 0 || compareCount > 0) {
                html += `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 5px;">
                        <button class="action-btn" data-action="export-data" style="
                            background: rgba(255,255,255,0.2);
                            color: white;
                            border: 1px solid rgba(255,255,255,0.5);
                            padding: 10px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 12px;
                            transition: all 0.3s ease;
                        ">
                            💾 エクスポート
                        </button>
                        <button class="action-btn" data-action="reset-all" style="
                            background: rgba(220,53,69,0.2);
                            color: white;
                            border: 1px solid rgba(220,53,69,0.5);
                            padding: 10px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 12px;
                            transition: all 0.3s ease;
                        ">
                            🗑️ 全リセット
                        </button>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // フッター
        html += `
            <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                <button class="action-btn" data-action="close-panel" style="
                    background: rgba(255,255,255,0.15);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.4);
                    padding: 8px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                ">
                    パネルを閉じる
                </button>
            </div>
        `;
        
        return html;
    }
    
    function setupPanelEvents(panel) {
        // クリックイベント
        panel.addEventListener('click', function(e) {
            const action = e.target.getAttribute('data-action') || 
                          e.target.closest('[data-action]')?.getAttribute('data-action');
            
            if (!action) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎯 アクション実行:', action);
            executeAction(action, panel);
        });
        
        // ホバー効果
        panel.addEventListener('mouseover', function(e) {
            if (e.target.classList.contains('action-btn')) {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = e.target.style.boxShadow.replace('0 4px', '0 8px').replace('0 6px', '0 12px');
            }
        });
        
        panel.addEventListener('mouseout', function(e) {
            if (e.target.classList.contains('action-btn')) {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = e.target.style.boxShadow.replace('0 8px', '0 4px').replace('0 12px', '0 6px');
            }
        });
    }
    
    function executeAction(action, panel) {
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
            case 'reset-all':
                resetAllSelections(panel);
                break;
            case 'close-panel':
                panel.style.display = 'none';
                break;
        }
    }
    
    function showBookmarkManagement() {
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const message = `📚 ブックマーク管理センター\n\n現在のブックマーク: ${bookmarks.length}件\n${bookmarks.map(id => `• ガイドID: ${id}`).join('\n')}\n\n管理オプション:\n• 一括削除\n• 個別削除\n• 詳細表示\n• データエクスポート\n\n本格的な管理インターフェースは開発中です。`;
            alert(message);
        } catch (e) {
            alert('❌ ブックマークデータの読み込みに失敗しました。');
        }
    }
    
    function showCompareManagement() {
        try {
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            const message = `🔍 ガイド比較センター\n\n比較対象: ${compares.length}件\n${compares.map(id => `• ガイドID: ${id}`).join('\n')}\n\n比較機能:\n• 並列表示\n• 詳細比較\n• 評価分析\n• 価格比較\n\n比較表示システムは開発中です。`;
            alert(message);
        } catch (e) {
            alert('❌ 比較データの読み込みに失敗しました。');
        }
    }
    
    function startBookingProcess() {
        try {
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            const message = `🚀 予約プロセス開始\n\n選択可能なガイド:\n${compares.map(id => `• ガイドID: ${id}`).join('\n')}\n\n予約手順:\n1. ガイド最終選択\n2. 日程調整\n3. 料金確認\n4. 予約確定\n\n予約システムとの連携は開発中です。`;
            alert(message);
        } catch (e) {
            alert('❌ 予約データの処理に失敗しました。');
        }
    }
    
    function exportData() {
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            
            const exportData = {
                export_timestamp: new Date().toISOString(),
                export_date: new Date().toLocaleDateString('ja-JP'),
                data: {
                    bookmarks: bookmarks,
                    compares: compares,
                    total_bookmarks: bookmarks.length,
                    total_compares: compares.length
                },
                system_info: {
                    user_agent: navigator.userAgent,
                    url: window.location.href
                }
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `guide_selections_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            alert('💾 データエクスポート完了\n\nファイルがダウンロードされました。\n\n内容: ブックマーク・比較データ');
        } catch (e) {
            console.error('🎯 エクスポートエラー:', e);
            alert('❌ データエクスポートに失敗しました。');
        }
    }
    
    function resetAllSelections(panel) {
        if (confirm('🗑️ 全データリセット\n\nブックマークと比較対象を全て削除しますか？\n\nこの操作は取り消せません。')) {
            try {
                localStorage.removeItem('bookmarkedGuides');
                localStorage.removeItem('comparedGuides');
                
                // パネル更新
                updatePanel(panel);
                
                alert('✅ 全データをリセットしました。\n\nブックマーク・比較対象が削除されました。');
            } catch (e) {
                alert('❌ データリセットに失敗しました。');
            }
        }
    }
    
    function updatePanel(panel) {
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            
            panel.innerHTML = buildPanelHTML(bookmarks.length, compares.length);
            setupPanelEvents(panel);
            
            console.log('🎯 パネル更新完了', { bookmarks: bookmarks.length, compares: compares.length });
        } catch (e) {
            console.error('🎯 パネル更新エラー:', e);
        }
    }
    
    function protectPanelStyles(panel, originalStyles) {
        // MutationObserver でスタイル変更を監視
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // スタイルが変更された場合、復元
                    Object.assign(panel.style, originalStyles);
                    console.log('🎯 スタイル保護: 強制復元');
                }
            });
        });
        
        observer.observe(panel, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // 定期的なスタイル確認
        setInterval(function() {
            if (panel.style.display === 'none' || panel.style.visibility === 'hidden') {
                Object.assign(panel.style, originalStyles);
                console.log('🎯 スタイル保護: 定期復元');
            }
        }, 2000);
    }
    
    // システム初期化
    function initializeSystem() {
        console.log('🎯 最終管理システム初期化');
        
        // 既存パネル削除
        removeAllExistingPanels();
        
        // 少し待ってから新パネル作成
        setTimeout(function() {
            const panel = createFinalManagementPanel();
            
            // 定期更新設定
            setInterval(function() {
                updatePanel(panel);
            }, 10000);
            
            console.log('🎯 最終管理システム初期化完了');
        }, 500);
    }
    
    // 実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSystem);
    } else {
        initializeSystem();
    }
    
    console.log('🎯 最終管理システム設定完了');
})();