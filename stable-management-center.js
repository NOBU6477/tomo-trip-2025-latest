// 安定した管理センター - エラーを起こさない単純設計
console.log('🏆 安定管理センター開始');

(function stableManagementCenter() {
    'use strict';
    
    // シンプルな管理センター作成
    function createStableManagementCenter() {
        console.log('🏆 安定管理センター作成');
        
        // 既存のパネルを削除
        const existingPanels = document.querySelectorAll('[id*="management"], [class*="management"], [style*="position: fixed"]');
        existingPanels.forEach(panel => {
            if (panel.innerHTML && (panel.innerHTML.includes('比較') || panel.innerHTML.includes('ブックマーク') || panel.innerHTML.includes('management'))) {
                panel.remove();
                console.log('🏆 既存パネル削除');
            }
        });
        
        // 新しい安定パネル作成
        const managementPanel = document.createElement('div');
        managementPanel.id = 'stable-management-center';
        managementPanel.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                border: 3px solid #ff0000;
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 9999;
                color: white;
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 200px;
                backdrop-filter: blur(10px);
            ">
                <div style="text-align: center; font-weight: bold; margin-bottom: 10px; font-size: 16px;">
                    🏆究極管理センター
                </div>
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button id="compare-btn" style="
                        background: rgba(255,255,255,0.2);
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 20px;
                        color: white;
                        padding: 8px 12px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    ">📊 比較(0)</button>
                    <button id="bookmark-btn" style="
                        background: rgba(255,255,255,0.2);
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 20px;
                        color: white;
                        padding: 8px 12px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    ">⭐ お気に入り(0)</button>
                    <button id="history-btn" style="
                        background: rgba(255,255,255,0.2);
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 20px;
                        color: white;
                        padding: 8px 12px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.3s ease;
                    ">📚 履歴</button>
                </div>
            </div>
        `;
        
        // body要素に追加
        document.body.appendChild(managementPanel);
        console.log('🏆 安定管理センター配置完了');
        
        // ボタンイベント設定
        setupButtonEvents();
    }
    
    // ボタンのイベント設定
    function setupButtonEvents() {
        const compareBtn = document.getElementById('compare-btn');
        const bookmarkBtn = document.getElementById('bookmark-btn');
        const historyBtn = document.getElementById('history-btn');
        
        if (compareBtn) {
            compareBtn.addEventListener('click', function() {
                alert('比較機能：選択したガイドを比較できます');
            });
        }
        
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', function() {
                alert('お気に入り機能：気に入ったガイドを保存できます');
            });
        }
        
        if (historyBtn) {
            historyBtn.addEventListener('click', function() {
                alert('履歴機能：見たガイドの履歴を確認できます');
            });
        }
        
        console.log('🏆 ボタンイベント設定完了');
    }
    
    // 言語切り替え対応
    function handleLanguageSwitch() {
        console.log('🏆 言語切り替え対応');
        
        // 言語切り替えボタンのクリックを監視
        const languageButtons = document.querySelectorAll('[onclick*="switchTo"], [onclick*="English"], [onclick*="Japanese"]');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('🏆 言語切り替え検出');
                
                // 少し待ってから管理センターを再作成
                setTimeout(() => {
                    createStableManagementCenter();
                }, 1000);
            });
        });
    }
    
    // ページ監視システム
    function setupPageMonitoring() {
        console.log('🏆 ページ監視開始');
        
        // 定期的にパネルの存在をチェック
        setInterval(() => {
            const panel = document.getElementById('stable-management-center');
            if (!panel) {
                console.log('🏆 パネル消失検出 - 再作成');
                createStableManagementCenter();
            }
        }, 5000); // 5秒間隔
    }
    
    // 初期化
    function initialize() {
        console.log('🏆 安定管理センター初期化');
        
        // DOM読み込み後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                createStableManagementCenter();
                handleLanguageSwitch();
                setupPageMonitoring();
            });
        } else {
            createStableManagementCenter();
            handleLanguageSwitch();
            setupPageMonitoring();
        }
    }
    
    // 実行
    initialize();
    
    console.log('🏆 安定管理センターシステム起動完了');
})();