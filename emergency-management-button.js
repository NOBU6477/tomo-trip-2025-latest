// 緊急管理ボタン強制表示システム

(function() {
    'use strict';
    
    console.log('🚨 緊急管理ボタン強制表示開始');
    
    // 既存の要素を全削除
    function clearAllExistingButtons() {
        const existing = document.querySelectorAll('[id*="management"], [id*="nuclear"], [id*="trigger"], [id*="final"]');
        existing.forEach(el => {
            if (!el.closest('script')) {
                el.remove();
                console.log('既存要素削除:', el.id);
            }
        });
    }
    
    // 緊急ボタン作成
    function createEmergencyButton() {
        console.log('緊急ボタン作成開始');
        
        // 完全に新しいボタンを作成
        const button = document.createElement('div');
        button.id = 'emergency-management-btn';
        button.innerHTML = '🏆';
        button.title = '管理センター';
        
        // 最強のスタイル設定
        button.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            background: #4CAF50 !important;
            color: white !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            cursor: pointer !important;
            z-index: 999999999 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            border: 2px solid white !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            pointer-events: auto !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: scale(1) !important;
        `;
        
        // クリックイベント
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('緊急ボタンクリック');
            showEmergencyPanel();
        });
        
        // ホバー効果
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = '#45a049';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '#4CAF50';
        });
        
        // bodyに直接追加
        document.body.appendChild(button);
        console.log('✅ 緊急ボタン作成完了');
        
        return button;
    }
    
    // 緊急パネル作成
    function createEmergencyPanel() {
        const panel = document.createElement('div');
        panel.id = 'emergency-management-panel';
        panel.style.cssText = `
            display: none !important;
            position: fixed !important;
            bottom: 90px !important;
            right: 20px !important;
            background: #4CAF50 !important;
            color: white !important;
            padding: 20px !important;
            border-radius: 15px !important;
            z-index: 999999998 !important;
            min-width: 280px !important;
            text-align: center !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
            border: 2px solid white !important;
        `;
        
        panel.innerHTML = `
            <h6 style="margin: 0 0 15px 0; font-weight: bold;">📋 管理センター</h6>
            <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <div style="margin-bottom: 5px; font-size: 13px;">比較中: <span id="emergency-comparison-count">0</span>/3人</div>
                <div style="font-size: 13px;">ブックマーク: <span id="emergency-bookmark-count">0</span>人</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="showEmergencyComparison()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">比較表示</button>
                <button onclick="showEmergencyBookmarks()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">ブックマーク表示</button>
                <button onclick="clearEmergencyAll()" style="background: rgba(220,53,69,0.6); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">全て削除</button>
            </div>
            <button onclick="hideEmergencyPanel()" style="position: absolute; top: 5px; right: 8px; background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
        `;
        
        document.body.appendChild(panel);
        console.log('✅ 緊急パネル作成完了');
        return panel;
    }
    
    // グローバル関数定義
    window.showEmergencyPanel = function() {
        const panel = document.getElementById('emergency-management-panel');
        if (panel) {
            panel.style.display = 'block';
            updateEmergencyCounters();
        }
    };
    
    window.hideEmergencyPanel = function() {
        const panel = document.getElementById('emergency-management-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    };
    
    window.showEmergencyComparison = function() {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        if (comparisonList.length === 0) {
            alert('比較するガイドが選択されていません。');
            return;
        }
        
        let message = '【比較中のガイド】\n\n';
        comparisonList.forEach((guide, index) => {
            message += `${index + 1}. ${guide.name || '名前不明'}\n`;
            message += `   📍 ${guide.location || '場所不明'}\n`;
            message += `   💰 ¥${guide.price || '6000'}/セッション\n\n`;
        });
        alert(message);
    };
    
    window.showEmergencyBookmarks = function() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        if (bookmarkList.length === 0) {
            alert('ブックマークされたガイドはありません。');
            return;
        }
        
        let message = '【ブックマーク済みガイド】\n\n';
        bookmarkList.forEach((guide, index) => {
            message += `${index + 1}. ${guide.name || '名前不明'}\n`;
            message += `   📍 ${guide.location || '場所不明'}\n`;
            message += `   💰 ¥${guide.price || '6000'}/セッション\n\n`;
        });
        alert(message);
    };
    
    window.clearEmergencyAll = function() {
        if (confirm('全ての選択を削除しますか？')) {
            localStorage.removeItem('bookmarkList');
            localStorage.removeItem('comparisonList');
            updateEmergencyCounters();
            alert('全ての選択を削除しました');
        }
    };
    
    function updateEmergencyCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('emergency-bookmark-count');
        const comparisonCounter = document.getElementById('emergency-comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
    }
    
    // 初期化システム
    function emergencyInitialize() {
        console.log('🚨 緊急初期化開始');
        
        clearAllExistingButtons();
        
        setTimeout(() => {
            createEmergencyButton();
        }, 50);
        
        setTimeout(() => {
            createEmergencyPanel();
        }, 100);
        
        setTimeout(() => {
            updateEmergencyCounters();
            console.log('✅ 緊急初期化完了');
        }, 150);
        
        // 継続監視
        setInterval(() => {
            if (!document.getElementById('emergency-management-btn')) {
                console.log('緊急ボタン再作成');
                createEmergencyButton();
            }
            
            if (!document.getElementById('emergency-management-panel')) {
                console.log('緊急パネル再作成');
                createEmergencyPanel();
            }
        }, 5000);
    }
    
    // 複数実行
    emergencyInitialize();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', emergencyInitialize);
    }
    
    setTimeout(emergencyInitialize, 100);
    setTimeout(emergencyInitialize, 500);
    setTimeout(emergencyInitialize, 1000);
    
})();