// 日本語版専用修正システム - 英語版干渉排除

console.log('🇯🇵 日本語版専用修正開始');

// 1. 管理ボタンの強制作成（日本語版専用）
function createJapaneseManagementButton() {
    console.log('日本語版管理ボタン作成');
    
    // 既存削除
    const existing = document.querySelector('#jp-management-btn, #emergency-btn, #direct-management-btn, #immediate-management-btn');
    if (existing) existing.remove();
    
    // 新しいボタン作成
    const btn = document.createElement('div');
    btn.id = 'jp-management-btn';
    btn.innerHTML = '🏆';
    btn.title = '管理センター（日本語版）';
    
    // スタイル直接設定
    btn.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 60px !important;
        height: 60px !important;
        background: linear-gradient(135deg, #4CAF50, #45a049) !important;
        color: white !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 24px !important;
        cursor: pointer !important;
        z-index: 2147483647 !important;
        box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4) !important;
        border: 3px solid white !important;
        user-select: none !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        transition: all 0.3s ease !important;
    `;
    
    // ホバー効果
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 8px 30px rgba(76, 175, 80, 0.6)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
    });
    
    // クリックイベント
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleJapanesePanel();
    });
    
    document.body.appendChild(btn);
    console.log('✅ 日本語版管理ボタン作成完了');
}

// 2. 管理パネルの強制作成（日本語版専用）
function createJapaneseManagementPanel() {
    console.log('日本語版管理パネル作成');
    
    // 既存削除
    const existing = document.querySelector('#jp-management-panel, #emergency-panel, #direct-management-panel, #immediate-management-panel');
    if (existing) existing.remove();
    
    const panel = document.createElement('div');
    panel.id = 'jp-management-panel';
    panel.style.cssText = `
        display: none !important;
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        background: linear-gradient(135deg, #4CAF50, #45a049) !important;
        color: white !important;
        padding: 25px !important;
        border-radius: 20px !important;
        z-index: 2147483646 !important;
        min-width: 320px !important;
        text-align: center !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
        border: 3px solid white !important;
        backdrop-filter: blur(10px) !important;
    `;
    
    panel.innerHTML = `
        <h5 style="margin: 0 0 20px 0; font-weight: bold; font-size: 18px;">📋 管理センター</h5>
        <div style="margin: 15px 0; padding: 15px; background: rgba(255,255,255,0.15); border-radius: 12px; backdrop-filter: blur(5px);">
            <div style="margin-bottom: 8px; font-size: 14px; font-weight: 500;">比較中: <span id="jp-comparison-count">0</span>/3人</div>
            <div style="font-size: 14px; font-weight: 500;">ブックマーク: <span id="jp-bookmark-count">0</span>人</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <button id="jp-comparison-btn" style="background: rgba(255,255,255,0.25); border: none; color: white; padding: 12px 20px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">📊 比較表示</button>
            <button id="jp-bookmark-btn" style="background: rgba(255,255,255,0.25); border: none; color: white; padding: 12px 20px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">⭐ ブックマーク表示</button>
            <button id="jp-clear-btn" style="background: rgba(220,53,69,0.7); border: none; color: white; padding: 12px 20px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">🗑️ 全て削除</button>
        </div>
        <button id="jp-close-btn" style="position: absolute; top: 8px; right: 12px; background: none; border: none; color: white; font-size: 20px; cursor: pointer; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
    `;
    
    document.body.appendChild(panel);
    
    // パネル内ボタンのイベント設定
    document.getElementById('jp-comparison-btn').addEventListener('click', showJapaneseComparison);
    document.getElementById('jp-bookmark-btn').addEventListener('click', showJapaneseBookmarks);
    document.getElementById('jp-clear-btn').addEventListener('click', clearJapaneseAll);
    document.getElementById('jp-close-btn').addEventListener('click', hideJapanesePanel);
    
    // ボタンホバー効果
    ['jp-comparison-btn', 'jp-bookmark-btn', 'jp-clear-btn'].forEach(id => {
        const btn = document.getElementById(id);
        btn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.4)';
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            if (id === 'jp-clear-btn') {
                this.style.background = 'rgba(220,53,69,0.7)';
            } else {
                this.style.background = 'rgba(255,255,255,0.25)';
            }
            this.style.transform = 'translateY(0)';
        });
    });
    
    console.log('✅ 日本語版管理パネル作成完了');
}

// 3. 不要要素の積極的削除（日本語版専用）
function cleanupJapaneseInterference() {
    console.log('日本語版干渉要素削除開始');
    
    let removedCount = 0;
    const allElements = document.querySelectorAll('*');
    
    for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i];
        
        // 英語版関連要素の削除
        if (el.id && (el.id.includes('en-') || el.id.includes('english-') || el.id.includes('eng-'))) {
            el.remove();
            removedCount++;
            continue;
        }
        
        // 不要な丸いアイコンの削除
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        
        if (el.id !== 'jp-management-btn' && 
            rect.width > 10 && rect.width < 80 && 
            rect.height > 10 && rect.height < 80 &&
            (styles.borderRadius === '50%' || el.style.borderRadius === '50%') &&
            (el.textContent.indexOf('⭐') !== -1 || 
             el.textContent.indexOf('✓') !== -1 ||
             el.className.indexOf('bookmark') !== -1 ||
             el.className.indexOf('compare') !== -1)) {
            el.remove();
            removedCount++;
            continue;
        }
        
        // 白い空要素の削除
        if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
             styles.backgroundColor === 'white') &&
            rect.width > 20 && rect.width < 300 &&
            rect.height > 20 && rect.height < 300 &&
            !el.textContent.trim() &&
            !el.querySelector('img, button, input, select') &&
            !el.closest('.modal, .navbar, .hero-section, .card, .form-control')) {
            el.remove();
            removedCount++;
            continue;
        }
        
        // 「読み込まれているページの内容」モーダルの無効化
        if (el.textContent && el.textContent.includes('読み込まれているページ')) {
            el.removeAttribute('data-bs-toggle');
            el.removeAttribute('data-bs-target');
            el.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
        }
    }
    
    console.log(`✅ 日本語版干渉要素削除完了: ${removedCount}個削除`);
}

// 4. グローバル関数定義（日本語版専用）
window.toggleJapanesePanel = function() {
    const panel = document.getElementById('jp-management-panel');
    if (panel) {
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            updateJapaneseCounters();
        } else {
            panel.style.display = 'none';
        }
    }
};

window.hideJapanesePanel = function() {
    const panel = document.getElementById('jp-management-panel');
    if (panel) {
        panel.style.display = 'none';
    }
};

window.showJapaneseComparison = function() {
    const comparisonList = JSON.parse(localStorage.getItem('jp-comparisonList') || '[]');
    if (comparisonList.length === 0) {
        alert('比較するガイドが選択されていません。\n\nガイドカードの「比較追加」ボタンをクリックして、ガイドを選択してください。');
        return;
    }
    
    let message = '【比較中のガイド一覧】\n\n';
    comparisonList.forEach(function(guide, index) {
        message += `${index + 1}. ${guide.name || '名前不明'}\n`;
        message += `   📍 ${guide.location || '場所不明'}\n`;
        message += `   💰 ¥${guide.price || '6000'}/セッション\n`;
        message += `   ⭐ ${guide.rating || '4.5'}★\n\n`;
    });
    alert(message);
};

window.showJapaneseBookmarks = function() {
    const bookmarkList = JSON.parse(localStorage.getItem('jp-bookmarkList') || '[]');
    if (bookmarkList.length === 0) {
        alert('ブックマークされたガイドはありません。\n\nガイドカードの「ブックマーク」ボタンをクリックして、お気に入りのガイドを保存してください。');
        return;
    }
    
    let message = '【ブックマーク済みガイド一覧】\n\n';
    bookmarkList.forEach(function(guide, index) {
        message += `${index + 1}. ${guide.name || '名前不明'}\n`;
        message += `   📍 ${guide.location || '場所不明'}\n`;
        message += `   💰 ¥${guide.price || '6000'}/セッション\n`;
        message += `   ⭐ ${guide.rating || '4.5'}★\n\n`;
    });
    alert(message);
};

window.clearJapaneseAll = function() {
    if (confirm('全ての選択（ブックマーク・比較）を削除しますか？\n\nこの操作は取り消せません。')) {
        localStorage.removeItem('jp-bookmarkList');
        localStorage.removeItem('jp-comparisonList');
        updateJapaneseCounters();
        alert('✅ 全ての選択を削除しました');
    }
};

function updateJapaneseCounters() {
    const bookmarkList = JSON.parse(localStorage.getItem('jp-bookmarkList') || '[]');
    const comparisonList = JSON.parse(localStorage.getItem('jp-comparisonList') || '[]');
    
    const bookmarkCounter = document.getElementById('jp-bookmark-count');
    const comparisonCounter = document.getElementById('jp-comparison-count');
    
    if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
    if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
}

// 5. フィルターボタン修復（日本語版専用）
function fixJapaneseFilter() {
    console.log('日本語版フィルター修復');
    
    const filterBtn = document.getElementById('filterToggleBtn');
    const filterCard = document.getElementById('filter-card');
    
    if (filterBtn && filterCard) {
        // 既存イベントを削除
        filterBtn.onclick = null;
        
        // 新しいイベントを設定
        filterBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (filterCard.classList.contains('d-none')) {
                filterCard.classList.remove('d-none');
                filterCard.style.display = 'block';
                filterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
            } else {
                filterCard.classList.add('d-none');
                filterCard.style.display = 'none';
                filterBtn.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込み';
            }
        };
        
        console.log('✅ 日本語版フィルター修復完了');
    }
}

// 6. 初期化システム（日本語版専用）
function initializeJapaneseSystem() {
    console.log('🔧 日本語版システム初期化開始');
    
    // 即座に実行
    cleanupJapaneseInterference();
    createJapaneseManagementButton();
    createJapaneseManagementPanel();
    fixJapaneseFilter();
    updateJapaneseCounters();
    
    console.log('✅ 日本語版システム初期化完了');
}

// 7. 実行開始（複数タイミング）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeJapaneseSystem);
} else {
    initializeJapaneseSystem();
}

setTimeout(initializeJapaneseSystem, 100);
setTimeout(initializeJapaneseSystem, 500);
setTimeout(initializeJapaneseSystem, 1000);

// 8. 継続監視システム（3秒間隔）
setInterval(function() {
    if (!document.getElementById('jp-management-btn')) {
        console.log('日本語版管理ボタン再作成');
        createJapaneseManagementButton();
    }
    
    if (!document.getElementById('jp-management-panel')) {
        console.log('日本語版管理パネル再作成');
        createJapaneseManagementPanel();
    }
    
    cleanupJapaneseInterference();
    updateJapaneseCounters();
}, 3000);

console.log('✅ 日本語版専用修正システム完全初期化完了');