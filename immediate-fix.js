// 即座修正システム - 最優先実行

console.log('🚨 即座修正システム開始');

// 1. 即座に管理ボタンを作成
(function createImmediateButton() {
    console.log('即座管理ボタン作成');
    
    // div要素を作成
    var button = document.createElement('div');
    button.id = 'immediate-management-btn';
    button.innerHTML = '🏆';
    button.title = '管理センター';
    
    // スタイルを設定
    button.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 60px !important;
        height: 60px !important;
        background-color: #4CAF50 !important;
        color: white !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 24px !important;
        cursor: pointer !important;
        z-index: 2147483647 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        border: 2px solid white !important;
        user-select: none !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
    `;
    
    // イベントリスナー
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleImmediatePanel();
    });
    
    // bodyに追加
    document.body.appendChild(button);
    console.log('✅ 即座管理ボタン作成完了');
})();

// 2. 即座にパネルを作成
(function createImmediatePanel() {
    console.log('即座管理パネル作成');
    
    var panel = document.createElement('div');
    panel.id = 'immediate-management-panel';
    panel.style.cssText = `
        display: none !important;
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        background-color: #4CAF50 !important;
        color: white !important;
        padding: 20px !important;
        border-radius: 15px !important;
        z-index: 2147483646 !important;
        min-width: 280px !important;
        text-align: center !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
        border: 2px solid white !important;
    `;
    
    panel.innerHTML = `
        <h6 style="margin: 0 0 15px 0; font-weight: bold;">📋 管理センター</h6>
        <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <div style="margin-bottom: 5px; font-size: 13px;">比較中: <span id="immediate-comparison-count">0</span>/3人</div>
            <div style="font-size: 13px;">ブックマーク: <span id="immediate-bookmark-count">0</span>人</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="immediate-comparison-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">比較表示</button>
            <button id="immediate-bookmark-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">ブックマーク表示</button>
            <button id="immediate-clear-btn" style="background: rgba(220,53,69,0.6); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">全て削除</button>
        </div>
        <button id="immediate-close-btn" style="position: absolute; top: 5px; right: 8px; background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
    `;
    
    document.body.appendChild(panel);
    
    // パネル内のボタンイベント
    document.getElementById('immediate-comparison-btn').addEventListener('click', showImmediateComparison);
    document.getElementById('immediate-bookmark-btn').addEventListener('click', showImmediateBookmarks);
    document.getElementById('immediate-clear-btn').addEventListener('click', clearImmediateAll);
    document.getElementById('immediate-close-btn').addEventListener('click', hideImmediatePanel);
    
    console.log('✅ 即座管理パネル作成完了');
})();

// 3. 不要要素を即座に削除
(function immediateCleanup() {
    console.log('即座クリーンアップ開始');
    
    var removedCount = 0;
    var allElements = document.querySelectorAll('*');
    
    for (var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        var rect = element.getBoundingClientRect();
        var styles = window.getComputedStyle(element);
        
        // 丸いアイコンの削除
        if (rect.width > 10 && rect.width < 80 && 
            rect.height > 10 && rect.height < 80 &&
            element.id !== 'immediate-management-btn' &&
            (styles.borderRadius === '50%' || element.style.borderRadius === '50%') &&
            (element.textContent.indexOf('⭐') !== -1 || 
             element.textContent.indexOf('✓') !== -1 ||
             element.className.indexOf('bookmark') !== -1 ||
             element.className.indexOf('compare') !== -1)) {
            
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
            !element.closest('.modal, .navbar, .hero-section, .card')) {
            
            element.remove();
            removedCount++;
        }
    }
    
    console.log('✅ 即座クリーンアップ完了: ' + removedCount + '個削除');
})();

// 4. グローバル関数定義
function toggleImmediatePanel() {
    var panel = document.getElementById('immediate-management-panel');
    if (panel) {
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            updateImmediateCounters();
        } else {
            panel.style.display = 'none';
        }
    }
}

function hideImmediatePanel() {
    var panel = document.getElementById('immediate-management-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

function showImmediateComparison() {
    var comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    if (comparisonList.length === 0) {
        alert('比較するガイドが選択されていません。');
        return;
    }
    
    var message = '【比較中のガイド】\n\n';
    for (var i = 0; i < comparisonList.length; i++) {
        var guide = comparisonList[i];
        message += (i + 1) + '. ' + (guide.name || '名前不明') + '\n';
        message += '   📍 ' + (guide.location || '場所不明') + '\n';
        message += '   💰 ¥' + (guide.price || '6000') + '/セッション\n\n';
    }
    alert(message);
}

function showImmediateBookmarks() {
    var bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
    if (bookmarkList.length === 0) {
        alert('ブックマークされたガイドはありません。');
        return;
    }
    
    var message = '【ブックマーク済みガイド】\n\n';
    for (var i = 0; i < bookmarkList.length; i++) {
        var guide = bookmarkList[i];
        message += (i + 1) + '. ' + (guide.name || '名前不明') + '\n';
        message += '   📍 ' + (guide.location || '場所不明') + '\n';
        message += '   💰 ¥' + (guide.price || '6000') + '/セッション\n\n';
    }
    alert(message);
}

function clearImmediateAll() {
    if (confirm('全ての選択を削除しますか？')) {
        localStorage.removeItem('bookmarkList');
        localStorage.removeItem('comparisonList');
        updateImmediateCounters();
        alert('全ての選択を削除しました');
    }
}

function updateImmediateCounters() {
    var bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
    var comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    
    var bookmarkCounter = document.getElementById('immediate-bookmark-count');
    var comparisonCounter = document.getElementById('immediate-comparison-count');
    
    if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
    if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
}

// 5. フィルター修復
(function fixImmediateFilter() {
    var filterBtn = document.getElementById('filterToggleBtn');
    var filterCard = document.getElementById('filter-card');
    
    if (filterBtn && filterCard) {
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
        console.log('✅ フィルター即座修復完了');
    }
})();

// 6. 継続監視（3秒間隔）
setInterval(function() {
    if (!document.getElementById('immediate-management-btn')) {
        console.log('管理ボタン消失 - 再作成');
        createImmediateButton();
    }
    
    if (!document.getElementById('immediate-management-panel')) {
        console.log('管理パネル消失 - 再作成');
        createImmediatePanel();
    }
    
    // 不要要素の継続削除
    immediateCleanup();
}, 3000);

console.log('✅ 即座修正システム完全初期化完了');