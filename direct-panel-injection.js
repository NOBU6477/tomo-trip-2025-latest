// 直接パネル注入システム - 最優先実行
console.log('💉 直接パネル注入開始');

// 即座実行（他のスクリプトより先に）
(function directPanelInjection() {
    'use strict';
    
    console.log('💉 直接注入実行');
    
    // 強制削除関数
    function forceRemoveAllPanels() {
        // IDベース削除
        const panelIds = [
            'immediate-test-panel',
            'nuclear-panel', 
            'emergency-guidance-panel',
            'debug-guidance-panel',
            'guidance-panel',
            'simple-management-panel',
            'final-management-panel'
        ];
        
        panelIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
                console.log('💉 ID削除:', id);
            }
        });
        
        // 固定位置要素の削除
        const fixedElements = document.querySelectorAll('*');
        fixedElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.position === 'fixed' && 
                (styles.top === '20px' || el.style.top === '20px') &&
                (styles.right === '20px' || el.style.right === '20px')) {
                el.remove();
                console.log('💉 固定要素削除:', el.tagName, el.id, el.className);
            }
        });
        
        console.log('💉 全パネル削除完了');
    }
    
    // 緑パネル作成
    function createGreenPanel() {
        console.log('💉 緑パネル作成開始');
        
        // LocalStorageデータ取得
        let bookmarkCount = 0;
        let compareCount = 0;
        
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            bookmarkCount = bookmarks.length;
            compareCount = compares.length;
        } catch (e) {
            console.log('💉 LocalStorage読み込みエラー:', e);
        }
        
        // パネル要素作成
        const panel = document.createElement('div');
        panel.id = 'direct-green-panel';
        
        // 内容設定
        panel.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="font-size: 24px; margin-right: 10px;">🎯</div>
                <div>
                    <div style="font-size: 18px; font-weight: bold;">ガイド管理センター</div>
                    <div style="font-size: 12px; opacity: 0.9;">直接注入システム</div>
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <div style="font-size: 16px; margin-bottom: 10px;">📊 選択状況</div>
                <div style="font-size: 14px;">
                    ⭐ ブックマーク: ${bookmarkCount}件<br>
                    ✓ 比較対象: ${compareCount}/3件<br>
                    🕒 時刻: ${new Date().toLocaleTimeString()}
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <div style="font-size: 16px; margin-bottom: 10px;">🎯 利用可能な機能</div>
                ${bookmarkCount > 0 ? `<button onclick="alert('📚 ブックマーク管理\\n\\n現在: ${bookmarkCount}件')" style="background: #ffc107; color: #000; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; margin: 5px; display: block; width: calc(100% - 10px);">📚 ブックマーク管理</button>` : ''}
                ${compareCount > 0 ? `<button onclick="alert('🔍 ガイド比較\\n\\n比較中: ${compareCount}件')" style="background: #17a2b8; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; margin: 5px; display: block; width: calc(100% - 10px);">🔍 ガイド比較</button>` : ''}
                ${compareCount >= 2 ? `<button onclick="alert('🚀 予約プロセス開始')" style="background: #dc3545; color: white; border: 2px solid white; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; margin: 5px; display: block; width: calc(100% - 10px);">🚀 予約開始</button>` : ''}
                ${(bookmarkCount === 0 && compareCount === 0) ? '<div style="font-size: 13px; line-height: 1.5;">• ガイドカードの⭐でブックマーク<br>• ガイドカードの✓で比較選択<br>• 最大3人まで比較可能</div>' : ''}
            </div>
            
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.style.display='none'" style="background: rgba(255,255,255,0.3); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 12px;">パネルを閉じる</button>
            </div>
        `;
        
        // スタイル設定（重要属性を直接設定）
        panel.setAttribute('style', `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            background: linear-gradient(45deg, #28a745, #20c997) !important;
            color: white !important;
            padding: 20px !important;
            border-radius: 15px !important;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4) !important;
            font-family: 'Noto Sans JP', Arial, sans-serif !important;
            font-weight: bold !important;
            max-width: 350px !important;
            border: 3px solid white !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            pointer-events: auto !important;
        `);
        
        // DOM追加
        document.body.appendChild(panel);
        
        console.log('💉 緑パネル作成完了');
        
        // 定期更新
        setInterval(() => {
            try {
                const newBookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
                const newCompares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
                
                if (newBookmarks.length !== bookmarkCount || newCompares.length !== compareCount) {
                    panel.remove();
                    bookmarkCount = newBookmarks.length;
                    compareCount = newCompares.length;
                    setTimeout(createGreenPanel, 100);
                    console.log('💉 パネル更新:', { bookmarks: bookmarkCount, compares: compareCount });
                }
            } catch (e) {
                console.log('💉 更新エラー:', e);
            }
        }, 5000);
        
        return panel;
    }
    
    // システム実行
    function executeSystem() {
        console.log('💉 システム実行開始');
        
        // 強制削除
        forceRemoveAllPanels();
        
        // 少し待ってから緑パネル作成
        setTimeout(() => {
            createGreenPanel();
            console.log('💉 システム実行完了');
        }, 1000);
    }
    
    // 即座実行
    executeSystem();
    
    // DOMロード後にも実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeSystem);
    }
    
    // 3秒後にも実行（保険）
    setTimeout(executeSystem, 3000);
    
    console.log('💉 直接パネル注入システム設定完了');
})();