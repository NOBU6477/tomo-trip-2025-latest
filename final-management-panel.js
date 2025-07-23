// 最終管理パネル - 確実な動作保証
console.log('🎯 最終管理パネル開始');

// 最後に読み込まれるため、他の全スクリプト実行後に動作
(function finalManagementPanel() {
    'use strict';
    
    // 全ての既存パネルを強制削除
    function nuklearRemoveAllPanels() {
        console.log('🎯 全パネル核レベル削除');
        
        // 既知のIDで削除
        const panelIds = [
            'immediate-test-panel', 'nuclear-panel', 'emergency-guidance-panel',
            'debug-guidance-panel', 'guidance-panel', 'simple-management-panel',
            'final-management-panel', 'direct-green-panel', 'emergency-green-panel',
            'test-simple-panel', 'csp-compliant-panel'
        ];
        
        panelIds.forEach(id => {
            const elements = document.querySelectorAll('#' + id);
            elements.forEach(el => {
                if (el) {
                    el.remove();
                    console.log('🎯 ID削除:', id);
                }
            });
        });
        
        // position:fixed で top:20px, right:20px の要素をすべて削除
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.style.position === 'fixed' || 
                window.getComputedStyle(el).position === 'fixed') {
                const top = el.style.top || window.getComputedStyle(el).top;
                const right = el.style.right || window.getComputedStyle(el).right;
                
                if ((top === '20px' || top.includes('20px')) && 
                    (right === '20px' || right.includes('20px'))) {
                    el.remove();
                    console.log('🎯 固定要素削除:', el.tagName, el.className);
                }
            }
        });
        
        // 中央固定の赤いパネルも削除（テストパネル）
        const centerElements = document.querySelectorAll('*');
        centerElements.forEach(el => {
            if ((el.style.position === 'fixed' || window.getComputedStyle(el).position === 'fixed') &&
                (el.style.background === 'red' || 
                 el.style.backgroundColor === 'red' ||
                 window.getComputedStyle(el).backgroundColor === 'rgb(255, 0, 0)')) {
                el.remove();
                console.log('🎯 赤いテストパネル削除');
            }
        });
        
        console.log('🎯 全パネル削除完了');
    }
    
    // 最終管理パネル作成
    function createFinalPanel() {
        console.log('🎯 最終パネル作成開始');
        
        // LocalStorageデータ取得
        let bookmarks = 0;
        let compares = 0;
        
        try {
            const bookmarkData = localStorage.getItem('bookmarkedGuides');
            const compareData = localStorage.getItem('comparedGuides');
            bookmarks = bookmarkData ? JSON.parse(bookmarkData).length : 0;
            compares = compareData ? JSON.parse(compareData).length : 0;
        } catch (e) {
            console.log('🎯 LocalStorage読み込みエラー');
        }
        
        // パネル要素作成
        const panel = document.createElement('div');
        panel.id = 'final-management-panel-ultimate';
        
        // スタイル設定（直接適用）
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '2147483647';
        panel.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        panel.style.color = 'white';
        panel.style.padding = '22px';
        panel.style.borderRadius = '15px';
        panel.style.boxShadow = '0 12px 35px rgba(40, 167, 69, 0.6)';
        panel.style.fontFamily = '"Noto Sans JP", "Hiragino Sans", Arial, sans-serif';
        panel.style.fontWeight = 'bold';
        panel.style.maxWidth = '380px';
        panel.style.minWidth = '320px';
        panel.style.border = '3px solid rgba(255, 255, 255, 0.9)';
        panel.style.backdropFilter = 'blur(10px)';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.display = 'block';
        panel.style.pointerEvents = 'auto';
        
        // ヘッダー部分
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.marginBottom = '20px';
        header.style.borderBottom = '2px solid rgba(255,255,255,0.3)';
        header.style.paddingBottom = '15px';
        
        const emoji = document.createElement('div');
        emoji.style.fontSize = '28px';
        emoji.style.marginRight = '12px';
        emoji.textContent = '🎯';
        
        const titleContainer = document.createElement('div');
        titleContainer.style.flex = '1';
        
        const title = document.createElement('div');
        title.style.fontSize = '20px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '3px';
        title.textContent = 'ガイド管理センター';
        
        const subtitle = document.createElement('div');
        subtitle.style.fontSize = '12px';
        subtitle.style.opacity = '0.85';
        const currentTime = new Date().toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        subtitle.textContent = `最終システム | ${currentTime}`;
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);
        header.appendChild(emoji);
        header.appendChild(titleContainer);
        panel.appendChild(header);
        
        // 選択状況セクション
        const statusSection = document.createElement('div');
        statusSection.style.background = 'rgba(255,255,255,0.15)';
        statusSection.style.padding = '18px';
        statusSection.style.borderRadius = '12px';
        statusSection.style.marginBottom = '18px';
        statusSection.style.border = '1px solid rgba(255,255,255,0.2)';
        
        const statusTitle = document.createElement('div');
        statusTitle.style.fontSize = '16px';
        statusTitle.style.fontWeight = 'bold';
        statusTitle.style.marginBottom = '12px';
        statusTitle.style.display = 'flex';
        statusTitle.style.alignItems = 'center';
        statusTitle.innerHTML = '<span style="margin-right: 8px;">📊</span>現在の選択状況';
        
        const statusGrid = document.createElement('div');
        statusGrid.style.display = 'grid';
        statusGrid.style.gridTemplateColumns = '1fr 1fr';
        statusGrid.style.gap = '12px';
        statusGrid.style.fontSize = '14px';
        
        const bookmarkCard = document.createElement('div');
        bookmarkCard.style.background = 'rgba(255,193,7,0.2)';
        bookmarkCard.style.padding = '10px';
        bookmarkCard.style.borderRadius = '8px';
        bookmarkCard.style.borderLeft = '4px solid #ffc107';
        bookmarkCard.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">⭐ ブックマーク</div>
            <div style="font-size: 18px; font-weight: bold;">${bookmarks}件</div>
        `;
        
        const compareCard = document.createElement('div');
        compareCard.style.background = 'rgba(23,162,184,0.2)';
        compareCard.style.padding = '10px';
        compareCard.style.borderRadius = '8px';
        compareCard.style.borderLeft = '4px solid #17a2b8';
        compareCard.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">✓ 比較対象</div>
            <div style="font-size: 18px; font-weight: bold;">${compares}/3件</div>
        `;
        
        statusGrid.appendChild(bookmarkCard);
        statusGrid.appendChild(compareCard);
        statusSection.appendChild(statusTitle);
        statusSection.appendChild(statusGrid);
        panel.appendChild(statusSection);
        
        // 機能セクション
        const featuresSection = document.createElement('div');
        featuresSection.style.background = 'rgba(255,255,255,0.15)';
        featuresSection.style.padding = '18px';
        featuresSection.style.borderRadius = '12px';
        featuresSection.style.marginBottom = '18px';
        featuresSection.style.border = '1px solid rgba(255,255,255,0.2)';
        
        const featuresTitle = document.createElement('div');
        featuresTitle.style.fontSize = '16px';
        featuresTitle.style.fontWeight = 'bold';
        featuresTitle.style.marginBottom = '15px';
        featuresTitle.style.display = 'flex';
        featuresTitle.style.alignItems = 'center';
        featuresTitle.innerHTML = '<span style="margin-right: 8px;">⚡</span>利用可能な機能';
        
        const featuresContainer = document.createElement('div');
        featuresContainer.style.display = 'flex';
        featuresContainer.style.flexDirection = 'column';
        featuresContainer.style.gap = '10px';
        
        // 機能ボタン作成
        if (bookmarks > 0) {
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.style.background = 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)';
            bookmarkBtn.style.color = '#000';
            bookmarkBtn.style.border = 'none';
            bookmarkBtn.style.padding = '12px 16px';
            bookmarkBtn.style.borderRadius = '8px';
            bookmarkBtn.style.cursor = 'pointer';
            bookmarkBtn.style.fontWeight = 'bold';
            bookmarkBtn.style.fontSize = '14px';
            bookmarkBtn.style.transition = 'all 0.3s ease';
            bookmarkBtn.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
            bookmarkBtn.style.display = 'flex';
            bookmarkBtn.style.alignItems = 'center';
            bookmarkBtn.style.justifyContent = 'center';
            bookmarkBtn.innerHTML = `<span style="margin-right: 8px;">📚</span>ブックマーク管理 (${bookmarks}件)`;
            
            bookmarkBtn.addEventListener('click', function() {
                alert(`📚 ブックマーク管理センター\n\n現在のブックマーク: ${bookmarks}件\n\n管理機能:\n• 一括削除\n• 個別削除\n• 詳細表示\n• データエクスポート\n\n本格的な管理インターフェースは開発中です。`);
            });
            
            featuresContainer.appendChild(bookmarkBtn);
        }
        
        if (compares > 0) {
            const compareBtn = document.createElement('button');
            compareBtn.style.background = 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)';
            compareBtn.style.color = 'white';
            compareBtn.style.border = 'none';
            compareBtn.style.padding = '12px 16px';
            compareBtn.style.borderRadius = '8px';
            compareBtn.style.cursor = 'pointer';
            compareBtn.style.fontWeight = 'bold';
            compareBtn.style.fontSize = '14px';
            compareBtn.style.transition = 'all 0.3s ease';
            compareBtn.style.boxShadow = '0 4px 12px rgba(23, 162, 184, 0.3)';
            compareBtn.style.display = 'flex';
            compareBtn.style.alignItems = 'center';
            compareBtn.style.justifyContent = 'center';
            compareBtn.innerHTML = `<span style="margin-right: 8px;">🔍</span>ガイド比較表示 (${compares}件)`;
            
            compareBtn.addEventListener('click', function() {
                alert(`🔍 ガイド比較センター\n\n比較対象: ${compares}件\n\n比較機能:\n• 並列表示\n• 詳細比較\n• 評価分析\n• 価格比較\n\n比較表示システムは開発中です。`);
            });
            
            featuresContainer.appendChild(compareBtn);
        }
        
        if (compares >= 2) {
            const bookingBtn = document.createElement('button');
            bookingBtn.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
            bookingBtn.style.color = 'white';
            bookingBtn.style.border = '2px solid rgba(255,255,255,0.8)';
            bookingBtn.style.padding = '14px 16px';
            bookingBtn.style.borderRadius = '8px';
            bookingBtn.style.cursor = 'pointer';
            bookingBtn.style.fontWeight = 'bold';
            bookingBtn.style.fontSize = '15px';
            bookingBtn.style.transition = 'all 0.3s ease';
            bookingBtn.style.boxShadow = '0 6px 16px rgba(220, 53, 69, 0.4)';
            bookingBtn.style.display = 'flex';
            bookingBtn.style.alignItems = 'center';
            bookingBtn.style.justifyContent = 'center';
            bookingBtn.innerHTML = `<span style="margin-right: 8px;">🚀</span>予約プロセス開始`;
            
            bookingBtn.addEventListener('click', function() {
                alert(`🚀 予約プロセス開始\n\n選択可能なガイド: ${compares}件\n\n予約手順:\n1. ガイド最終選択\n2. 日程調整\n3. 料金確認\n4. 予約確定\n\n予約システムとの連携は開発中です。`);
            });
            
            featuresContainer.appendChild(bookingBtn);
        }
        
        if (bookmarks === 0 && compares === 0) {
            const instruction = document.createElement('div');
            instruction.style.fontSize = '13px';
            instruction.style.lineHeight = '1.6';
            instruction.style.opacity = '0.9';
            instruction.innerHTML = `
                <div style="margin-bottom: 8px;">• ガイドカードの左上<strong>⭐</strong>ボタンでブックマーク</div>
                <div style="margin-bottom: 8px;">• ガイドカードの左上<strong>✓</strong>ボタンで比較対象選択</div>
                <div>• 最大3人まで同時比較が可能です</div>
            `;
            featuresContainer.appendChild(instruction);
        }
        
        featuresSection.appendChild(featuresTitle);
        featuresSection.appendChild(featuresContainer);
        panel.appendChild(featuresSection);
        
        // 閉じるボタン
        const closeSection = document.createElement('div');
        closeSection.style.textAlign = 'center';
        closeSection.style.marginTop = '15px';
        closeSection.style.paddingTop = '15px';
        closeSection.style.borderTop = '1px solid rgba(255,255,255,0.2)';
        
        const closeBtn = document.createElement('button');
        closeBtn.style.background = 'rgba(255,255,255,0.15)';
        closeBtn.style.color = 'white';
        closeBtn.style.border = '1px solid rgba(255,255,255,0.4)';
        closeBtn.style.padding = '8px 20px';
        closeBtn.style.borderRadius = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '12px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.transition = 'all 0.3s ease';
        closeBtn.textContent = 'パネルを閉じる';
        
        closeBtn.addEventListener('click', function() {
            panel.style.display = 'none';
        });
        
        closeSection.appendChild(closeBtn);
        panel.appendChild(closeSection);
        
        // DOM追加
        document.body.appendChild(panel);
        
        console.log('🎯 最終パネル作成完了');
        return panel;
    }
    
    // システム実行
    function executeSystem() {
        console.log('🎯 最終システム実行');
        
        // 段階的実行
        nuklearRemoveAllPanels();
        
        setTimeout(() => {
            createFinalPanel();
            console.log('🎯 最終システム完了');
        }, 1500);
    }
    
    // 実行（最後に読み込まれるため確実）
    executeSystem();
    
    // 定期更新
    setInterval(() => {
        const existingPanel = document.getElementById('final-management-panel-ultimate');
        if (existingPanel) {
            existingPanel.remove();
            setTimeout(createFinalPanel, 100);
        }
    }, 20000);
    
    console.log('🎯 最終管理パネルシステム設定完了');
})();