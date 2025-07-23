// 緊急HTML注入システム - DOM直接操作
console.log('🚨 緊急HTML注入開始');

// 即座実行（ページロード前でも動作）
(function emergencyHTMLInjection() {
    'use strict';
    
    // 全パネル削除（強制）
    function nuklearPanelRemoval() {
        console.log('🚨 核レベルパネル削除');
        
        // 既知のIDで削除
        const panelIds = [
            'immediate-test-panel', 'nuclear-panel', 'emergency-guidance-panel',
            'debug-guidance-panel', 'guidance-panel', 'simple-management-panel',
            'final-management-panel', 'direct-green-panel'
        ];
        
        panelIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.parentNode.removeChild(element);
                console.log('🚨 削除:', id);
            }
        });
        
        // すべての固定位置要素をチェック
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const computed = window.getComputedStyle(el);
            if (computed.position === 'fixed' && 
                computed.top === '20px' && 
                computed.right === '20px') {
                el.parentNode.removeChild(el);
                console.log('🚨 固定要素削除:', el.tagName);
            }
        });
    }
    
    // 緑パネル強制作成
    function forceCreateGreenPanel() {
        console.log('🚨 緑パネル強制作成');
        
        // LocalStorageデータ読み込み
        let bookmarks = 0;
        let compares = 0;
        
        try {
            const bookmarkData = localStorage.getItem('bookmarkedGuides');
            const compareData = localStorage.getItem('comparedGuides');
            bookmarks = bookmarkData ? JSON.parse(bookmarkData).length : 0;
            compares = compareData ? JSON.parse(compareData).length : 0;
        } catch (e) {
            console.log('🚨 LocalStorage読み込みエラー');
        }
        
        // HTML文字列作成
        const panelHTML = `
            <div id="emergency-green-panel" style="
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
                color: white !important;
                padding: 20px !important;
                border-radius: 15px !important;
                box-shadow: 0 10px 30px rgba(40, 167, 69, 0.5) !important;
                font-family: 'Noto Sans JP', Arial, sans-serif !important;
                font-weight: bold !important;
                max-width: 360px !important;
                min-width: 300px !important;
                border: 3px solid rgba(255, 255, 255, 0.9) !important;
                visibility: visible !important;
                opacity: 1 !important;
                display: block !important;
                pointer-events: auto !important;
            ">
                <div style="display: flex; align-items: center; margin-bottom: 18px; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 12px;">
                    <div style="font-size: 26px; margin-right: 10px;">🎯</div>
                    <div>
                        <div style="font-size: 19px; font-weight: bold;">ガイド管理センター</div>
                        <div style="font-size: 12px; opacity: 0.85;">緊急注入システム</div>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">📊 現在の選択状況</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                        <div style="background: rgba(255,193,7,0.2); padding: 8px; border-radius: 6px; text-align: center;">
                            <div>⭐ ブックマーク</div>
                            <div style="font-size: 16px; font-weight: bold;">${bookmarks}件</div>
                        </div>
                        <div style="background: rgba(23,162,184,0.2); padding: 8px; border-radius: 6px; text-align: center;">
                            <div>✓ 比較対象</div>
                            <div style="font-size: 16px; font-weight: bold;">${compares}/3件</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">⚡ 利用可能な機能</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${bookmarks > 0 ? `
                        <div style="background: linear-gradient(135deg, #ffc107, #ffb300); color: #000; padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; font-size: 13px; font-weight: bold;" onclick="alert('📚 ブックマーク管理センター\\n\\n現在のブックマーク: ${bookmarks}件\\n\\n管理機能:\\n• 一括削除\\n• 個別削除\\n• 詳細表示\\n• エクスポート')">
                            📚 ブックマーク管理 (${bookmarks}件)
                        </div>` : ''}
                        ${compares > 0 ? `
                        <div style="background: linear-gradient(135deg, #17a2b8, #138496); color: white; padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; font-size: 13px; font-weight: bold;" onclick="alert('🔍 ガイド比較センター\\n\\n比較対象: ${compares}件\\n\\n比較機能:\\n• 並列表示\\n• 詳細比較\\n• 評価分析\\n• 価格比較')">
                            🔍 ガイド比較表示 (${compares}件)
                        </div>` : ''}
                        ${compares >= 2 ? `
                        <div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 12px; border-radius: 6px; text-align: center; cursor: pointer; font-size: 14px; font-weight: bold; border: 2px solid rgba(255,255,255,0.8);" onclick="alert('🚀 予約プロセス開始\\n\\n選択可能なガイド: ${compares}件\\n\\n予約手順:\\n1. ガイド最終選択\\n2. 日程調整\\n3. 料金確認\\n4. 予約確定')">
                            🚀 予約プロセス開始
                        </div>` : ''}
                        ${bookmarks === 0 && compares === 0 ? `
                        <div style="font-size: 12px; line-height: 1.6; opacity: 0.9;">
                            <div style="margin-bottom: 6px;">• ガイドカードの左上<strong>⭐</strong>でブックマーク</div>
                            <div style="margin-bottom: 6px;">• ガイドカードの左上<strong>✓</strong>で比較選択</div>
                            <div>• 最大3人まで同時比較が可能</div>
                        </div>` : ''}
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 16px;">
                    <div style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 11px; display: inline-block;" onclick="document.getElementById('emergency-green-panel').style.display='none'">
                        パネルを閉じる
                    </div>
                </div>
            </div>
        `;
        
        // HTML注入
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        console.log('🚨 緑パネルHTML注入完了');
        
        return document.getElementById('emergency-green-panel');
    }
    
    // システム実行
    function executeEmergencySystem() {
        console.log('🚨 緊急システム実行');
        
        // パネル削除
        nuklearPanelRemoval();
        
        // 緑パネル作成
        setTimeout(() => {
            forceCreateGreenPanel();
            console.log('🚨 緊急システム完了');
        }, 800);
    }
    
    // 複数タイミングで実行
    executeEmergencySystem(); // 即座
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeEmergencySystem);
    }
    
    setTimeout(executeEmergencySystem, 2000); // 2秒後
    setTimeout(executeEmergencySystem, 5000); // 5秒後
    
    // 定期監視と復元
    setInterval(() => {
        const panel = document.getElementById('emergency-green-panel');
        if (!panel) {
            console.log('🚨 パネル消失検出 - 復元');
            executeEmergencySystem();
        }
    }, 10000);
    
    console.log('🚨 緊急HTML注入システム設定完了');
})();