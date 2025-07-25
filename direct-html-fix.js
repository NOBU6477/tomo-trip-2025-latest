// 直接HTML修正システム - 最終手段

// 1. 管理ボタンの直接HTML注入
function injectManagementButtonDirectly() {
    console.log('直接HTML注入開始');
    
    // 既存削除
    const existing = document.getElementById('direct-management-btn');
    if (existing) existing.remove();
    
    // HTML文字列を直接bodyに注入
    const buttonHTML = `
        <div id="direct-management-btn" 
             onclick="toggleDirectPanel()" 
             onmouseenter="this.style.transform='scale(1.1)'; this.style.backgroundColor='#45a049'" 
             onmouseleave="this.style.transform='scale(1)'; this.style.backgroundColor='#4CAF50'"
             style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: #4CAF50;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                z-index: 999999999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 2px solid white;
                user-select: none;
                pointer-events: auto;
                visibility: visible;
                opacity: 1;
             ">🏆</div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', buttonHTML);
    console.log('✅ 直接HTML注入完了');
}

// 2. 管理パネルの直接HTML注入
function injectManagementPanelDirectly() {
    console.log('直接パネル注入開始');
    
    const existing = document.getElementById('direct-management-panel');
    if (existing) existing.remove();
    
    const panelHTML = `
        <div id="direct-management-panel" 
             style="
                display: none;
                position: fixed;
                bottom: 90px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                border-radius: 15px;
                z-index: 999999998;
                min-width: 280px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                border: 2px solid white;
             ">
            <h6 style="margin: 0 0 15px 0; font-weight: bold;">📋 管理センター</h6>
            <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <div style="margin-bottom: 5px; font-size: 13px;">比較中: <span id="direct-comparison-count">0</span>/3人</div>
                <div style="font-size: 13px;">ブックマーク: <span id="direct-bookmark-count">0</span>人</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="showDirectComparison()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">比較表示</button>
                <button onclick="showDirectBookmarks()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">ブックマーク表示</button>
                <button onclick="clearDirectAll()" style="background: rgba(220,53,69,0.6); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">全て削除</button>
            </div>
            <button onclick="hideDirectPanel()" style="position: absolute; top: 5px; right: 8px; background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
    console.log('✅ 直接パネル注入完了');
}

// 3. 不要要素の積極的削除
function aggressiveCleanup() {
    console.log('積極的クリーンアップ開始');
    
    let removedCount = 0;
    
    // 全要素をスキャン
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        
        // 丸いアイコン（比較・ブックマーク）の削除
        if (rect.width > 10 && rect.width < 80 && 
            rect.height > 10 && rect.height < 80 &&
            (styles.borderRadius === '50%' || element.style.borderRadius === '50%') &&
            element.id !== 'direct-management-btn' &&
            (element.textContent.includes('⭐') || 
             element.textContent.includes('✓') ||
             element.className.includes('bookmark') ||
             element.className.includes('compare'))) {
            
            element.remove();
            removedCount++;
        }
        
        // 白い空要素の削除
        if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
             styles.backgroundColor === 'white') &&
            rect.width > 20 && rect.width < 300 &&
            rect.height > 20 && rect.height < 300 &&
            !element.textContent.trim() &&
            !element.querySelector('img, button, input, select') &&
            !element.closest('.modal, .navbar, .hero-section, .card, .form-control')) {
            
            element.remove();
            removedCount++;
        }
        
        // 読み込み中モーダルの削除
        if (element.textContent.includes('読み込み中') || 
            element.textContent.includes('ページの内容')) {
            
            // モーダルトリガーを無効化
            element.removeAttribute('data-bs-toggle');
            element.removeAttribute('data-bs-target');
            element.onclick = null;
            
            // モーダル自体を削除
            if (element.classList.contains('modal')) {
                element.remove();
                removedCount++;
            }
        }
    });
    
    console.log(`✅ 積極的クリーンアップ完了: ${removedCount}個削除`);
}

// 4. グローバル関数定義（window直接設定）
window.toggleDirectPanel = function() {
    const panel = document.getElementById('direct-management-panel');
    if (panel) {
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            updateDirectCounters();
        } else {
            panel.style.display = 'none';
        }
    }
};

window.hideDirectPanel = function() {
    const panel = document.getElementById('direct-management-panel');
    if (panel) {
        panel.style.display = 'none';
    }
};

window.showDirectComparison = function() {
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    if (comparisonList.length === 0) {
        alert('比較するガイドが選択されていません。');
        return;
    }
    
    let message = '【比較中のガイド】\n\n';
    comparisonList.forEach(function(guide, index) {
        message += (index + 1) + '. ' + (guide.name || '名前不明') + '\n';
        message += '   📍 ' + (guide.location || '場所不明') + '\n';
        message += '   💰 ¥' + (guide.price || '6000') + '/セッション\n\n';
    });
    alert(message);
};

window.showDirectBookmarks = function() {
    const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
    if (bookmarkList.length === 0) {
        alert('ブックマークされたガイドはありません。');
        return;
    }
    
    let message = '【ブックマーク済みガイド】\n\n';
    bookmarkList.forEach(function(guide, index) {
        message += (index + 1) + '. ' + (guide.name || '名前不明') + '\n';
        message += '   📍 ' + (guide.location || '場所不明') + '\n';
        message += '   💰 ¥' + (guide.price || '6000') + '/セッション\n\n';
    });
    alert(message);
};

window.clearDirectAll = function() {
    if (confirm('全ての選択を削除しますか？')) {
        localStorage.removeItem('bookmarkList');
        localStorage.removeItem('comparisonList');
        updateDirectCounters();
        alert('全ての選択を削除しました');
    }
};

function updateDirectCounters() {
    const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    
    const bookmarkCounter = document.getElementById('direct-bookmark-count');
    const comparisonCounter = document.getElementById('direct-comparison-count');
    
    if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
    if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
}

// 5. フィルター機能の直接修復
function fixFilterDirectly() {
    console.log('フィルター直接修復開始');
    
    const filterBtn = document.getElementById('filterToggleBtn');
    const filterCard = document.getElementById('filter-card');
    
    if (filterBtn && filterCard) {
        // 既存イベントを削除
        filterBtn.onclick = null;
        
        // 新しいイベントを直接設定
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
        
        console.log('✅ フィルター直接修復完了');
    }
}

// 6. 初期化システム
function initializeDirectSystem() {
    console.log('🔧 直接システム初期化開始');
    
    // 即座に実行
    aggressiveCleanup();
    injectManagementButtonDirectly();
    injectManagementPanelDirectly();
    fixFilterDirectly();
    updateDirectCounters();
    
    console.log('✅ 直接システム初期化完了');
    
    // 継続監視（5秒間隔）
    setInterval(function() {
        if (!document.getElementById('direct-management-btn')) {
            console.log('管理ボタン再注入');
            injectManagementButtonDirectly();
        }
        
        if (!document.getElementById('direct-management-panel')) {
            console.log('管理パネル再注入');
            injectManagementPanelDirectly();
        }
        
        aggressiveCleanup();
    }, 5000);
}

// 7. 実行開始（複数タイミング）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDirectSystem);
} else {
    initializeDirectSystem();
}

setTimeout(initializeDirectSystem, 100);
setTimeout(initializeDirectSystem, 500);
setTimeout(initializeDirectSystem, 1000);
setTimeout(initializeDirectSystem, 2000);