// 即座テストパネル - 最優先実行
(function() {
    console.log('🚀 即座テストパネル開始');
    
    // 即座に実行
    function createTestPanel() {
        console.log('🚀 テストパネル作成中...');
        
        // 赤い警告パネルを画面中央に作成
        const testPanel = document.createElement('div');
        testPanel.id = 'immediate-test-panel';
        testPanel.innerHTML = `
            <div style="text-align: center;">
                <h2 style="color: white; margin: 0 0 10px 0;">🚀 テストパネル表示成功</h2>
                <p style="color: white; margin: 0 0 15px 0;">JavaScriptは正常に動作しています</p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: white; color: red; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    パネルを閉じる
                </button>
            </div>
        `;
        
        // 最優先スタイル適用
        testPanel.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 999999999 !important;
            background: red !important;
            color: white !important;
            padding: 30px !important;
            border-radius: 10px !important;
            border: 5px solid white !important;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.8) !important;
            font-family: Arial, sans-serif !important;
            font-size: 16px !important;
            width: 400px !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            pointer-events: auto !important;
        `;
        
        document.body.appendChild(testPanel);
        console.log('🚀 テストパネル追加完了');
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (testPanel && testPanel.parentNode) {
                testPanel.remove();
                console.log('🚀 テストパネル自動削除');
            }
        }, 10000);
    }
    
    // 即座実行
    createTestPanel();
    
    // 1秒後にも実行
    setTimeout(createTestPanel, 1000);
    
    console.log('🚀 即座テストパネル設定完了');
})();