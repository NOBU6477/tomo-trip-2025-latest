// CSP完全準拠パネルシステム
console.log('✅ CSP準拠パネル開始');

(function cspCompliantPanel() {
    'use strict';
    
    // 既存パネル全削除（CSP準拠）
    function removeExistingPanels() {
        const panelSelectors = [
            '#immediate-test-panel',
            '#nuclear-panel', 
            '#emergency-guidance-panel',
            '#debug-guidance-panel',
            '#guidance-panel',
            '#simple-management-panel',
            '#final-management-panel',
            '#direct-green-panel',
            '#emergency-green-panel',
            '#test-simple-panel'
        ];
        
        panelSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
                console.log('✅ パネル削除:', selector);
            }
        });
        
        // 固定位置要素の検索と削除
        const fixedElements = document.querySelectorAll('div[style*="position: fixed"]');
        fixedElements.forEach(el => {
            if (el.style.top === '20px' && el.style.right === '20px') {
                el.remove();
                console.log('✅ 固定要素削除');
            }
        });
    }
    
    // CSP準拠の管理パネル作成
    function createCSPCompliantPanel() {
        console.log('✅ CSP準拠パネル作成');
        
        // LocalStorageデータ取得
        let bookmarkCount = 0;
        let compareCount = 0;
        
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            bookmarkCount = bookmarks.length;
            compareCount = compares.length;
        } catch (e) {
            console.log('✅ データ読み込みエラー:', e);
        }
        
        // パネル要素作成
        const panel = document.createElement('div');
        panel.id = 'csp-compliant-panel';
        panel.className = 'management-panel';
        
        // スタイル適用（CSP準拠）
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '2147483647',
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(40, 167, 69, 0.5)',
            fontFamily: '"Noto Sans JP", Arial, sans-serif',
            fontWeight: 'bold',
            maxWidth: '350px',
            minWidth: '300px',
            border: '3px solid rgba(255, 255, 255, 0.9)',
            visibility: 'visible',
            opacity: '1',
            display: 'block',
            pointerEvents: 'auto'
        };
        
        Object.assign(panel.style, styles);
        
        // ヘッダー作成
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; align-items: center; margin-bottom: 18px; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 12px;';
        
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: 26px; margin-right: 10px;';
        icon.textContent = '🎯';
        
        const titleContainer = document.createElement('div');
        
        const title = document.createElement('div');
        title.style.cssText = 'font-size: 19px; font-weight: bold;';
        title.textContent = 'ガイド管理センター';
        
        const subtitle = document.createElement('div');
        subtitle.style.cssText = 'font-size: 12px; opacity: 0.85;';
        subtitle.textContent = 'CSP準拠システム';
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);
        header.appendChild(icon);
        header.appendChild(titleContainer);
        panel.appendChild(header);
        
        // 選択状況表示
        const statusSection = document.createElement('div');
        statusSection.style.cssText = 'background: rgba(255,255,255,0.15); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.2);';
        
        const statusTitle = document.createElement('div');
        statusTitle.style.cssText = 'font-size: 16px; font-weight: bold; margin-bottom: 10px;';
        statusTitle.textContent = '📊 現在の選択状況';
        
        const statusGrid = document.createElement('div');
        statusGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;';
        
        const bookmarkStatus = document.createElement('div');
        bookmarkStatus.style.cssText = 'background: rgba(255,193,7,0.2); padding: 8px; border-radius: 6px; text-align: center;';
        bookmarkStatus.innerHTML = `<div>⭐ ブックマーク</div><div style="font-size: 16px; font-weight: bold;">${bookmarkCount}件</div>`;
        
        const compareStatus = document.createElement('div');
        compareStatus.style.cssText = 'background: rgba(23,162,184,0.2); padding: 8px; border-radius: 6px; text-align: center;';
        compareStatus.innerHTML = `<div>✓ 比較対象</div><div style="font-size: 16px; font-weight: bold;">${compareCount}/3件</div>`;
        
        statusGrid.appendChild(bookmarkStatus);
        statusGrid.appendChild(compareStatus);
        statusSection.appendChild(statusTitle);
        statusSection.appendChild(statusGrid);
        panel.appendChild(statusSection);
        
        // 機能セクション
        const featuresSection = document.createElement('div');
        featuresSection.style.cssText = 'background: rgba(255,255,255,0.15); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.2);';
        
        const featuresTitle = document.createElement('div');
        featuresTitle.style.cssText = 'font-size: 16px; font-weight: bold; margin-bottom: 12px;';
        featuresTitle.textContent = '⚡ 利用可能な機能';
        
        const featuresContainer = document.createElement('div');
        featuresContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
        
        // 機能ボタン作成（CSP準拠）
        if (bookmarkCount > 0) {
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.style.cssText = 'background: linear-gradient(135deg, #ffc107, #ffb300); color: #000; padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; font-size: 13px; font-weight: bold; border: none;';
            bookmarkBtn.textContent = `📚 ブックマーク管理 (${bookmarkCount}件)`;
            bookmarkBtn.addEventListener('click', function() {
                showBookmarkManager(bookmarkCount);
            });
            featuresContainer.appendChild(bookmarkBtn);
        }
        
        if (compareCount > 0) {
            const compareBtn = document.createElement('button');
            compareBtn.style.cssText = 'background: linear-gradient(135deg, #17a2b8, #138496); color: white; padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; font-size: 13px; font-weight: bold; border: none;';
            compareBtn.textContent = `🔍 ガイド比較表示 (${compareCount}件)`;
            compareBtn.addEventListener('click', function() {
                showCompareManager(compareCount);
            });
            featuresContainer.appendChild(compareBtn);
        }
        
        if (compareCount >= 2) {
            const bookingBtn = document.createElement('button');
            bookingBtn.style.cssText = 'background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 12px; border-radius: 6px; text-align: center; cursor: pointer; font-size: 14px; font-weight: bold; border: 2px solid rgba(255,255,255,0.8);';
            bookingBtn.textContent = '🚀 予約プロセス開始';
            bookingBtn.addEventListener('click', function() {
                startBookingProcess(compareCount);
            });
            featuresContainer.appendChild(bookingBtn);
        }
        
        if (bookmarkCount === 0 && compareCount === 0) {
            const instruction = document.createElement('div');
            instruction.style.cssText = 'font-size: 12px; line-height: 1.6; opacity: 0.9;';
            instruction.innerHTML = `
                <div style="margin-bottom: 6px;">• ガイドカードの左上<strong>⭐</strong>でブックマーク</div>
                <div style="margin-bottom: 6px;">• ガイドカードの左上<strong>✓</strong>で比較選択</div>
                <div>• 最大3人まで同時比較が可能</div>
            `;
            featuresContainer.appendChild(instruction);
        }
        
        featuresSection.appendChild(featuresTitle);
        featuresSection.appendChild(featuresContainer);
        panel.appendChild(featuresSection);
        
        // 閉じるボタン
        const closeSection = document.createElement('div');
        closeSection.style.cssText = 'text-align: center; margin-top: 16px;';
        
        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 11px;';
        closeBtn.textContent = 'パネルを閉じる';
        closeBtn.addEventListener('click', function() {
            panel.style.display = 'none';
        });
        
        closeSection.appendChild(closeBtn);
        panel.appendChild(closeSection);
        
        // DOM追加
        document.body.appendChild(panel);
        
        console.log('✅ CSP準拠パネル作成完了');
        return panel;
    }
    
    // 機能実装（CSP準拠）
    function showBookmarkManager(count) {
        const message = `📚 ブックマーク管理センター\n\n現在のブックマーク: ${count}件\n\n管理機能:\n• 一括削除\n• 個別削除\n• 詳細表示\n• データエクスポート\n\n本格的な管理インターフェースは開発中です。`;
        alert(message);
    }
    
    function showCompareManager(count) {
        const message = `🔍 ガイド比較センター\n\n比較対象: ${count}件\n\n比較機能:\n• 並列表示\n• 詳細比較\n• 評価分析\n• 価格比較\n\n比較表示システムは開発中です。`;
        alert(message);
    }
    
    function startBookingProcess(count) {
        const message = `🚀 予約プロセス開始\n\n選択可能なガイド: ${count}件\n\n予約手順:\n1. ガイド最終選択\n2. 日程調整\n3. 料金確認\n4. 予約確定\n\n予約システムとの連携は開発中です。`;
        alert(message);
    }
    
    // パネル更新
    function updatePanel() {
        const existingPanel = document.getElementById('csp-compliant-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        createCSPCompliantPanel();
    }
    
    // システム実行
    function executeSystem() {
        console.log('✅ CSP準拠システム実行');
        
        removeExistingPanels();
        
        setTimeout(() => {
            createCSPCompliantPanel();
            console.log('✅ CSP準拠システム完了');
        }, 1000);
    }
    
    // 実行
    executeSystem();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeSystem);
    }
    
    // 定期更新
    setInterval(updatePanel, 15000);
    
    console.log('✅ CSP準拠パネルシステム設定完了');
})();