// 緊急ボタン修正システム - 即座に実行

console.log('🚨 緊急ボタン修正システム開始');

// 1. 即座に実行する緊急ボタン作成
function createEmergencyButton() {
    console.log('緊急ボタン作成開始');
    
    // 全ての既存管理ボタンを削除
    const existingButtons = document.querySelectorAll('#jp-management-btn, #emergency-btn, #force-management-btn, #direct-management-btn, #immediate-management-btn, [id*="management"]');
    existingButtons.forEach(btn => {
        btn.remove();
        console.log('既存ボタン削除:', btn.id);
    });
    
    // 新しい緊急ボタンを作成
    const btn = document.createElement('div');
    btn.id = 'emergency-button-fix';
    btn.innerHTML = '🏆';
    btn.title = '管理センター';
    
    // 最強CSS設定（!important多用）
    btn.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 70px !important;
        height: 70px !important;
        background: linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1) !important;
        color: white !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 30px !important;
        cursor: pointer !important;
        z-index: 2147483647 !important;
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.6) !important;
        border: 4px solid white !important;
        user-select: none !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        transition: all 0.3s ease !important;
        font-family: Arial, sans-serif !important;
        text-align: center !important;
        line-height: 1 !important;
        transform: scale(1) !important;
    `;
    
    // アニメーション追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes emergencyPulse {
            0% { 
                transform: scale(1) !important; 
                box-shadow: 0 10px 30px rgba(255, 107, 107, 0.6) !important;
            }
            50% { 
                transform: scale(1.1) !important; 
                box-shadow: 0 15px 40px rgba(255, 107, 107, 0.8) !important;
            }
            100% { 
                transform: scale(1) !important; 
                box-shadow: 0 10px 30px rgba(255, 107, 107, 0.6) !important;
            }
        }
        #emergency-button-fix {
            animation: emergencyPulse 2s infinite !important;
        }
        #emergency-button-fix:hover {
            transform: scale(1.2) !important;
            box-shadow: 0 20px 50px rgba(255, 107, 107, 0.9) !important;
        }
    `;
    document.head.appendChild(style);
    
    // クリックイベント（複数の方法で設定）
    btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        showEmergencyPanel();
        console.log('緊急ボタンクリック成功！');
    };
    
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showEmergencyPanel();
    }, { passive: false });
    
    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        showEmergencyPanel();
    }, { passive: false });
    
    // ホバーイベント
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2) !important';
        this.style.boxShadow = '0 20px 50px rgba(255, 107, 107, 0.9) !important';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) !important';
        this.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.6) !important';
    });
    
    // DOMに追加
    document.body.appendChild(btn);
    console.log('✅ 緊急ボタン作成完了:', btn.id);
    
    return btn;
}

// 2. 緊急管理パネル作成
function createEmergencyPanel() {
    // 既存パネル削除
    const existingPanels = document.querySelectorAll('#emergency-panel, #jp-management-panel, [id*="panel"]');
    existingPanels.forEach(panel => {
        if (panel.id.includes('management') || panel.id.includes('emergency')) {
            panel.remove();
        }
    });
    
    const panel = document.createElement('div');
    panel.id = 'emergency-panel';
    panel.style.cssText = `
        display: none !important;
        position: fixed !important;
        bottom: 100px !important;
        right: 20px !important;
        background: linear-gradient(135deg, #FF6B6B, #4ECDC4) !important;
        color: white !important;
        padding: 25px !important;
        border-radius: 20px !important;
        z-index: 2147483646 !important;
        min-width: 350px !important;
        max-width: 90vw !important;
        text-align: center !important;
        box-shadow: 0 15px 50px rgba(0,0,0,0.4) !important;
        border: 4px solid white !important;
        backdrop-filter: blur(15px) !important;
        animation: slideUp 0.3s ease !important;
    `;
    
    // スライドアップアニメーション追加
    const panelStyle = document.createElement('style');
    panelStyle.textContent = `
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(panelStyle);
    
    panel.innerHTML = `
        <div style="text-align: center;">
            <h4 style="margin: 0 0 20px 0; font-weight: bold; font-size: 20px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">📋 管理センター</h4>
            
            <div style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 15px; backdrop-filter: blur(5px);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 16px; font-weight: 600;">比較中:</span>
                    <span id="emergency-comparison-count" style="font-size: 16px; font-weight: 600; color: #FFE55C;">0/3人</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 16px; font-weight: 600;">ブックマーク:</span>
                    <span id="emergency-bookmark-count" style="font-size: 16px; font-weight: 600; color: #FFE55C;">0人</span>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 15px; margin: 20px 0;">
                <button id="emergency-comparison-btn" onclick="showEmergencyComparison()" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 15px 25px; border-radius: 15px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">📊 比較表示</button>
                
                <button id="emergency-bookmark-btn" onclick="showEmergencyBookmarks()" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 15px 25px; border-radius: 15px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">⭐ ブックマーク表示</button>
                
                <button id="emergency-clear-btn" onclick="clearEmergencyAll()" style="background: rgba(220,53,69,0.8); border: none; color: white; padding: 15px 25px; border-radius: 15px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s ease; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🗑️ 全て削除</button>
            </div>
            
            <button onclick="hideEmergencyPanel()" style="position: absolute; top: 10px; right: 15px; background: rgba(255,255,255,0.3); border: none; color: white; font-size: 24px; cursor: pointer; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">×</button>
        </div>
    `;
    
    document.body.appendChild(panel);
    console.log('✅ 緊急パネル作成完了');
    
    return panel;
}

// 3. グローバル関数定義
window.showEmergencyPanel = function() {
    let panel = document.getElementById('emergency-panel');
    if (!panel) {
        panel = createEmergencyPanel();
    }
    
    panel.style.display = 'block';
    updateEmergencyCounters();
    console.log('緊急パネル表示');
};

window.hideEmergencyPanel = function() {
    const panel = document.getElementById('emergency-panel');
    if (panel) {
        panel.style.display = 'none';
    }
};

window.showEmergencyComparison = function() {
    const comparisonList = JSON.parse(localStorage.getItem('emergency-comparisonList') || '[]');
    if (comparisonList.length === 0) {
        alert('📊 比較機能\n\n現在比較するガイドが選択されていません。\n\nガイドカードから「比較追加」ボタンをクリックして、最大3人までのガイドを選択してください。\n\n選択したガイドの詳細情報を比較表示できます。');
        return;
    }
    
    let message = '【📊 比較中のガイド一覧】\n\n';
    comparisonList.forEach(function(guide, index) {
        message += `${index + 1}. ${guide.name || '名前不明'}\n`;
        message += `   📍 場所: ${guide.location || '場所不明'}\n`;
        message += `   💰 料金: ¥${guide.price || '6000'}/セッション\n`;
        message += `   ⭐ 評価: ${guide.rating || '4.5'}★\n`;
        message += `   🗣️ 言語: ${guide.languages || '日本語'}\n\n`;
    });
    
    message += `合計 ${comparisonList.length} 人のガイドを比較中です。`;
    alert(message);
};

window.showEmergencyBookmarks = function() {
    const bookmarkList = JSON.parse(localStorage.getItem('emergency-bookmarkList') || '[]');
    if (bookmarkList.length === 0) {
        alert('⭐ ブックマーク機能\n\nブックマークされたガイドはまだありません。\n\nガイドカードの「ブックマーク」ボタン（⭐）をクリックして、お気に入りのガイドを保存してください。\n\nブックマークしたガイドはいつでもこちらから確認できます。');
        return;
    }
    
    let message = '【⭐ ブックマーク済みガイド一覧】\n\n';
    bookmarkList.forEach(function(guide, index) {
        message += `${index + 1}. ${guide.name || '名前不明'}\n`;
        message += `   📍 場所: ${guide.location || '場所不明'}\n`;
        message += `   💰 料金: ¥${guide.price || '6000'}/セッション\n`;
        message += `   ⭐ 評価: ${guide.rating || '4.5'}★\n`;
        message += `   🗣️ 言語: ${guide.languages || '日本語'}\n\n`;
    });
    
    message += `合計 ${bookmarkList.length} 人のガイドをブックマーク中です。`;
    alert(message);
};

window.clearEmergencyAll = function() {
    const bookmarkList = JSON.parse(localStorage.getItem('emergency-bookmarkList') || '[]');
    const comparisonList = JSON.parse(localStorage.getItem('emergency-comparisonList') || '[]');
    const total = bookmarkList.length + comparisonList.length;
    
    if (total === 0) {
        alert('🗑️ 削除機能\n\n削除する項目がありません。\n\nブックマークや比較リストに項目がある場合のみ削除できます。');
        return;
    }
    
    if (confirm(`🗑️ 全ての選択を削除\n\n以下の項目を削除しますか？\n• ブックマーク: ${bookmarkList.length}人\n• 比較リスト: ${comparisonList.length}人\n\nこの操作は取り消せません。`)) {
        localStorage.removeItem('emergency-bookmarkList');
        localStorage.removeItem('emergency-comparisonList');
        updateEmergencyCounters();
        alert('✅ 削除完了\n\n全ての選択（ブックマーク・比較リスト）を削除しました。');
    }
};

function updateEmergencyCounters() {
    const bookmarkList = JSON.parse(localStorage.getItem('emergency-bookmarkList') || '[]');
    const comparisonList = JSON.parse(localStorage.getItem('emergency-comparisonList') || '[]');
    
    const bookmarkCounter = document.getElementById('emergency-bookmark-count');
    const comparisonCounter = document.getElementById('emergency-comparison-count');
    
    if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length + '人';
    if (comparisonCounter) comparisonCounter.textContent = comparisonList.length + '/3人';
}

// 4. 即座実行システム
function immediateExecution() {
    console.log('🚨 即座実行開始');
    
    // DOM準備確認
    if (!document.body) {
        console.log('body未準備 - 100ms後再試行');
        setTimeout(immediateExecution, 100);
        return;
    }
    
    // ボタン作成
    const btn = createEmergencyButton();
    const panel = createEmergencyPanel();
    
    // カウンター更新
    updateEmergencyCounters();
    
    console.log('✅ 即座実行完了');
    return { btn, panel };
}

// 5. 複数タイミングでの実行
// 即座に実行
immediateExecution();

// DOM読み込み完了時に実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', immediateExecution);
} else {
    immediateExecution();
}

// 遅延実行（確実性のため）
setTimeout(immediateExecution, 100);
setTimeout(immediateExecution, 500);
setTimeout(immediateExecution, 1000);

// 6. 継続監視システム
setInterval(function() {
    const btn = document.getElementById('emergency-button-fix');
    const panel = document.getElementById('emergency-panel');
    
    if (!btn) {
        console.log('⚠️ 緊急ボタン消失 - 再作成');
        createEmergencyButton();
    }
    
    if (!panel) {
        console.log('⚠️ 緊急パネル消失 - 再作成');
        createEmergencyPanel();
    }
    
    updateEmergencyCounters();
}, 3000);

console.log('✅ 緊急ボタン修正システム完全初期化完了');