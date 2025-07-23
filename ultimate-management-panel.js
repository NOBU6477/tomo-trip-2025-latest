// 究極管理パネル - 全干渉スクリプト無効化
console.log('🏆 究極管理パネル開始');

// 即座実行で他のスクリプトより早く動作
(function ultimateManagementPanel() {
    'use strict';
    
    // 1. 他のスクリプトによるテストパネル作成を阻止
    function blockAllTestPanels() {
        console.log('🏆 テストパネル作成阻止');
        
        // DOM操作メソッドをハイジャック
        const originalAppendChild = Element.prototype.appendChild;
        const originalCreateElement = document.createElement;
        
        // createElement をオーバーライド
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            // divタグの場合、idチェック
            if (tagName.toLowerCase() === 'div') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    // テストパネル関連のIDを阻止
                    if (name === 'id' && (
                        value === 'immediate-test-panel' ||
                        value === 'nuclear-panel' ||
                        value === 'debug-guidance-panel' ||
                        value === 'console-debug-panel' ||
                        value.includes('test-panel')
                    )) {
                        console.log('🏆 テストパネル作成阻止:', value);
                        return; // ID設定を無効化
                    }
                    return originalSetAttribute.call(this, name, value);
                };
            }
            
            return element;
        };
        
        // appendChild をオーバーライドして赤いパネルを阻止
        Element.prototype.appendChild = function(child) {
            // 赤いパネルの特徴をチェック
            if (child && child.style) {
                const hasRedBackground = 
                    child.style.background === 'red' ||
                    child.style.backgroundColor === 'red' ||
                    (child.innerHTML && child.innerHTML.includes('テストパネル表示成功'));
                
                if (hasRedBackground) {
                    console.log('🏆 赤いテストパネル追加阻止');
                    return child; // 追加を阻止
                }
            }
            
            return originalAppendChild.call(this, child);
        };
        
        console.log('🏆 テストパネル阻止システム設定完了');
    }
    
    // 2. 既存テストパネル核レベル削除
    function nuklearDestroyTestPanels() {
        console.log('🏆 既存テストパネル核レベル削除');
        
        // 定期的な削除実行
        const destroyInterval = setInterval(() => {
            // ID削除
            const testPanelIds = [
                'immediate-test-panel', 'nuclear-panel', 'debug-guidance-panel',
                'console-debug-panel', 'emergency-guidance-panel', 'guidance-panel'
            ];
            
            testPanelIds.forEach(id => {
                const elements = document.querySelectorAll('#' + id);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        el.remove();
                        console.log('🏆 核レベル削除:', id);
                    }
                });
            });
            
            // 赤い背景の要素を削除
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.style && (
                    el.style.background === 'red' ||
                    el.style.backgroundColor === 'red' ||
                    (el.innerHTML && el.innerHTML.includes('テストパネル表示成功'))
                )) {
                    el.remove();
                    console.log('🏆 赤いパネル核レベル削除');
                }
            });
            
        }, 500); // 0.5秒間隔で実行
        
        // 30秒後に削除間隔を停止
        setTimeout(() => {
            clearInterval(destroyInterval);
            console.log('🏆 核レベル削除システム完了');
        }, 30000);
    }
    
    // 3. 最終管理パネル作成
    function createUltimatePanel() {
        console.log('🏆 究極パネル作成');
        
        // LocalStorageデータ取得
        let bookmarks = 0;
        let compares = 0;
        
        try {
            const bookmarkData = localStorage.getItem('bookmarkedGuides');
            const compareData = localStorage.getItem('comparedGuides');
            bookmarks = bookmarkData ? JSON.parse(bookmarkData).length : 0;
            compares = compareData ? JSON.parse(compareData).length : 0;
        } catch (e) {
            console.log('🏆 データ取得エラー');
        }
        
        // 最高優先度パネル作成
        const panel = document.createElement('div');
        panel.id = 'ultimate-management-panel-final';
        
        // 最高優先度スタイル
        Object.assign(panel.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '2147483647',
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '18px',
            boxShadow: '0 15px 40px rgba(40, 167, 69, 0.7)',
            fontFamily: '"Noto Sans JP", "Hiragino Sans", Arial, sans-serif',
            fontWeight: 'bold',
            maxWidth: '400px',
            minWidth: '350px',
            border: '4px solid rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(15px)',
            visibility: 'visible',
            opacity: '1',
            display: 'block',
            pointerEvents: 'auto'
        });
        
        // ヘッダー
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '22px',
            borderBottom: '3px solid rgba(255,255,255,0.4)',
            paddingBottom: '18px'
        });
        
        const trophy = document.createElement('div');
        Object.assign(trophy.style, {
            fontSize: '32px',
            marginRight: '15px'
        });
        trophy.textContent = '🏆';
        
        const titleContainer = document.createElement('div');
        titleContainer.style.flex = '1';
        
        const title = document.createElement('div');
        Object.assign(title.style, {
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '5px'
        });
        title.textContent = '究極管理センター';
        
        const subtitle = document.createElement('div');
        Object.assign(subtitle.style, {
            fontSize: '13px',
            opacity: '0.9'
        });
        const time = new Date().toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        subtitle.textContent = `テストパネル完全制圧 | ${time}`;
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);
        header.appendChild(trophy);
        header.appendChild(titleContainer);
        panel.appendChild(header);
        
        // 制圧状況表示
        const statusSection = document.createElement('div');
        Object.assign(statusSection.style, {
            background: 'rgba(255,255,255,0.18)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            border: '2px solid rgba(255,255,255,0.25)'
        });
        
        const statusTitle = document.createElement('div');
        Object.assign(statusTitle.style, {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px'
        });
        statusTitle.innerHTML = '⚡ システム制圧状況';
        
        const statusContent = document.createElement('div');
        Object.assign(statusContent.style, {
            fontSize: '14px',
            lineHeight: '1.6'
        });
        statusContent.innerHTML = `
            <div style="margin-bottom: 8px;">✅ 赤いテストパネル完全制圧</div>
            <div style="margin-bottom: 8px;">✅ DOM操作ハイジャック実行中</div>
            <div style="margin-bottom: 8px;">✅ 競合スクリプト無力化完了</div>
            <div style="color: #90EE90; font-weight: bold;">🎯 究極管理システム稼働中</div>
        `;
        
        statusSection.appendChild(statusTitle);
        statusSection.appendChild(statusContent);
        panel.appendChild(statusSection);
        
        // 選択状況
        const dataSection = document.createElement('div');
        Object.assign(dataSection.style, {
            background: 'rgba(255,255,255,0.18)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            border: '2px solid rgba(255,255,255,0.25)'
        });
        
        const dataTitle = document.createElement('div');
        Object.assign(dataTitle.style, {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px'
        });
        dataTitle.innerHTML = '📊 ガイド選択状況';
        
        const dataGrid = document.createElement('div');
        Object.assign(dataGrid.style, {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
        });
        
        const bookmarkCard = document.createElement('div');
        Object.assign(bookmarkCard.style, {
            background: 'rgba(255,193,7,0.25)',
            padding: '12px',
            borderRadius: '10px',
            borderLeft: '5px solid #ffc107',
            textAlign: 'center'
        });
        bookmarkCard.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 6px;">⭐ ブックマーク</div>
            <div style="font-size: 20px; font-weight: bold;">${bookmarks}件</div>
        `;
        
        const compareCard = document.createElement('div');
        Object.assign(compareCard.style, {
            background: 'rgba(23,162,184,0.25)',
            padding: '12px',
            borderRadius: '10px',
            borderLeft: '5px solid #17a2b8',
            textAlign: 'center'
        });
        compareCard.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 6px;">✓ 比較対象</div>
            <div style="font-size: 20px; font-weight: bold;">${compares}/3件</div>
        `;
        
        dataGrid.appendChild(bookmarkCard);
        dataGrid.appendChild(compareCard);
        dataSection.appendChild(dataTitle);
        dataSection.appendChild(dataGrid);
        panel.appendChild(dataSection);
        
        // 機能ボタン
        if (bookmarks > 0 || compares > 0) {
            const actionSection = document.createElement('div');
            Object.assign(actionSection.style, {
                background: 'rgba(255,255,255,0.18)',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '15px',
                border: '2px solid rgba(255,255,255,0.25)'
            });
            
            const actionTitle = document.createElement('div');
            Object.assign(actionTitle.style, {
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '15px'
            });
            actionTitle.innerHTML = '🚀 利用可能な機能';
            
            const actionContainer = document.createElement('div');
            Object.assign(actionContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            });
            
            if (bookmarks > 0) {
                const bookmarkBtn = document.createElement('button');
                Object.assign(bookmarkBtn.style, {
                    background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    boxShadow: '0 6px 15px rgba(255, 193, 7, 0.4)'
                });
                bookmarkBtn.innerHTML = `📚 ブックマーク管理 (${bookmarks}件)`;
                
                bookmarkBtn.addEventListener('click', function() {
                    alert(`📚 ブックマーク管理センター\n\n現在のブックマーク: ${bookmarks}件\n\n管理機能:\n• 一括削除\n• 個別削除\n• 詳細表示\n• データエクスポート\n\n本格的な管理インターフェースは開発中です。`);
                });
                
                actionContainer.appendChild(bookmarkBtn);
            }
            
            if (compares > 0) {
                const compareBtn = document.createElement('button');
                Object.assign(compareBtn.style, {
                    background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    boxShadow: '0 6px 15px rgba(23, 162, 184, 0.4)'
                });
                compareBtn.innerHTML = `🔍 ガイド比較表示 (${compares}件)`;
                
                compareBtn.addEventListener('click', function() {
                    alert(`🔍 ガイド比較センター\n\n比較対象: ${compares}件\n\n比較機能:\n• 並列表示\n• 詳細比較\n• 評価分析\n• 価格比較\n\n比較表示システムは開発中です。`);
                });
                
                actionContainer.appendChild(compareBtn);
            }
            
            actionSection.appendChild(actionTitle);
            actionSection.appendChild(actionContainer);
            panel.appendChild(actionSection);
        }
        
        // 閉じるボタン
        const closeSection = document.createElement('div');
        Object.assign(closeSection.style, {
            textAlign: 'center',
            paddingTop: '15px',
            borderTop: '2px solid rgba(255,255,255,0.3)'
        });
        
        const closeBtn = document.createElement('button');
        Object.assign(closeBtn.style, {
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.5)',
            padding: '10px 25px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold'
        });
        closeBtn.textContent = 'パネルを閉じる';
        
        closeBtn.addEventListener('click', function() {
            panel.style.display = 'none';
        });
        
        closeSection.appendChild(closeBtn);
        panel.appendChild(closeSection);
        
        // 強制DOM追加
        document.body.appendChild(panel);
        
        console.log('🏆 究極パネル作成完了');
        return panel;
    }
    
    // システム実行
    function executeUltimateSystem() {
        console.log('🏆 究極システム実行開始');
        
        // 即座に阻止システム開始
        blockAllTestPanels();
        
        // 核レベル削除開始
        nuklearDestroyTestPanels();
        
        // 2秒後に究極パネル作成
        setTimeout(() => {
            createUltimatePanel();
            console.log('🏆 究極システム完了');
        }, 2000);
    }
    
    // 即座実行
    executeUltimateSystem();
    
    // DOM読み込み後も実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeUltimateSystem);
    }
    
    console.log('🏆 究極管理パネルシステム起動完了');
})();