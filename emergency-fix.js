// 緊急修正システム - テストパネル除去とボタン機能復旧
console.log('🚨 緊急修正開始');

(function emergencyFix() {
    'use strict';
    
    // 1. 赤いテストパネルを完全除去
    function removeTestPanels() {
        console.log('🚨 テストパネル除去');
        
        // テストパネル要素を特定・削除
        const testPanels = document.querySelectorAll('*');
        testPanels.forEach(element => {
            const text = element.textContent || '';
            const style = element.style.cssText || '';
            const className = element.className || '';
            
            if (
                text.includes('テストパネル') ||
                text.includes('データ取得') ||
                text.includes('システム状態') ||
                text.includes('パネルを閉じる') ||
                style.includes('position: fixed') && style.includes('red') ||
                className.includes('test') ||
                element.id.includes('test')
            ) {
                element.remove();
                console.log('🚨 テストパネル削除:', element.tagName);
            }
        });
    }
    
    // 2. 管理センターを再構築
    function rebuildManagementCenter() {
        console.log('🚨 管理センター再構築');
        
        // 既存の管理センターを削除
        const existing = document.getElementById('stable-management-center');
        if (existing) existing.remove();
        
        // 新しい管理センターを作成
        const panel = document.createElement('div');
        panel.id = 'emergency-management-center';
        panel.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(45deg, #4CAF50, #2196F3);
                border: 2px solid #fff;
                border-radius: 12px;
                padding: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 99999;
                color: white;
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 13px;
                min-width: 180px;
            ">
                <div style="text-align: center; font-weight: bold; margin-bottom: 8px; font-size: 14px;">
                    🏆究極管理センター
                </div>
                <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="handleCompare()" style="
                        background: rgba(255,255,255,0.25);
                        border: none;
                        border-radius: 15px;
                        color: white;
                        padding: 6px 10px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: bold;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.4)'" 
                       onmouseout="this.style.background='rgba(255,255,255,0.25)'">
                        📊 比較
                    </button>
                    <button onclick="handleBookmark()" style="
                        background: rgba(255,255,255,0.25);
                        border: none;
                        border-radius: 15px;
                        color: white;
                        padding: 6px 10px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: bold;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.4)'" 
                       onmouseout="this.style.background='rgba(255,255,255,0.25)'">
                        ⭐ お気に入り
                    </button>
                    <button onclick="handleHistory()" style="
                        background: rgba(255,255,255,0.25);
                        border: none;
                        border-radius: 15px;
                        color: white;
                        padding: 6px 10px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: bold;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.4)'" 
                       onmouseout="this.style.background='rgba(255,255,255,0.25)'">
                        📚 履歴
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        console.log('🚨 管理センター再構築完了');
    }
    
    // 3. グローバル関数を定義
    function defineGlobalFunctions() {
        console.log('🚨 グローバル関数定義');
        
        window.handleCompare = function() {
            console.log('🚨 比較ボタンクリック');
            alert('比較機能\n\n選択したガイドを比較できます。\n現在開発中です。');
        };
        
        window.handleBookmark = function() {
            console.log('🚨 ブックマークボタンクリック');
            alert('お気に入り機能\n\n気に入ったガイドを保存できます。\n現在開発中です。');
        };
        
        window.handleHistory = function() {
            console.log('🚨 履歴ボタンクリック');
            alert('履歴機能\n\n閲覧したガイドの履歴を確認できます。\n現在開発中です。');
        };
        
        console.log('🚨 グローバル関数定義完了');
    }
    
    // 4. 継続監視システム
    function setupContinuousMonitoring() {
        console.log('🚨 継続監視開始');
        
        // テストパネルの継続除去
        setInterval(removeTestPanels, 2000);
        
        // 管理センターの継続監視
        setInterval(function() {
            const panel = document.getElementById('emergency-management-center');
            if (!panel) {
                console.log('🚨 管理センター消失 - 再構築');
                rebuildManagementCenter();
                defineGlobalFunctions();
            }
        }, 3000);
    }
    
    // 即座実行
    function executeEmergencyFix() {
        console.log('🚨 緊急修正実行');
        
        // 段階的実行
        removeTestPanels();
        setTimeout(rebuildManagementCenter, 100);
        setTimeout(defineGlobalFunctions, 200);
        setTimeout(setupContinuousMonitoring, 300);
        
        setTimeout(() => {
            console.log('🚨 緊急修正完了 - 管理センター機能復旧');
        }, 500);
    }
    
    // 実行
    executeEmergencyFix();
    
    console.log('🚨 緊急修正システム起動完了');
})();