// シンプル管理システム - CSP対応版

// 1. 管理ボタンの作成（CSP対応）
function createSimpleManagementButton() {
    console.log('シンプル管理ボタン作成開始');
    
    // 既存削除
    const existing = document.getElementById('simple-management-btn');
    if (existing) existing.remove();
    
    // ボタン作成
    const button = document.createElement('div');
    button.id = 'simple-management-btn';
    button.textContent = '🏆';
    button.title = '管理センター';
    
    // インラインスタイル（CSP対応）
    button.setAttribute('style', `
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
        z-index: 999999999 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        border: 2px solid white !important;
        user-select: none !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
    `);
    
    // クリックイベント（CSP対応）
    button.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('シンプル管理ボタンクリック');
        showSimplePanel();
    };
    
    // ホバー効果
    button.onmouseenter = function() {
        this.style.transform = 'scale(1.1)';
        this.style.backgroundColor = '#45a049';
    };
    
    button.onmouseleave = function() {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '#4CAF50';
    };
    
    document.body.appendChild(button);
    console.log('✅ シンプル管理ボタン作成完了');
    return button;
}

// 2. 管理パネルの作成
function createSimplePanel() {
    console.log('シンプル管理パネル作成開始');
    
    const existing = document.getElementById('simple-management-panel');
    if (existing) existing.remove();
    
    const panel = document.createElement('div');
    panel.id = 'simple-management-panel';
    
    panel.setAttribute('style', `
        display: none !important;
        position: fixed !important;
        bottom: 90px !important;
        right: 20px !important;
        background-color: #4CAF50 !important;
        color: white !important;
        padding: 20px !important;
        border-radius: 15px !important;
        z-index: 999999998 !important;
        min-width: 280px !important;
        text-align: center !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
        border: 2px solid white !important;
    `);
    
    panel.innerHTML = `
        <h6 style="margin: 0 0 15px 0; font-weight: bold;">📋 管理センター</h6>
        <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <div style="margin-bottom: 5px; font-size: 13px;">比較中: <span id="simple-comparison-count">0</span>/3人</div>
            <div style="font-size: 13px;">ブックマーク: <span id="simple-bookmark-count">0</span>人</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button onclick="showSimpleComparison()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">比較表示</button>
            <button onclick="showSimpleBookmarks()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">ブックマーク表示</button>
            <button onclick="clearSimpleAll()" style="background: rgba(220,53,69,0.6); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">全て削除</button>
        </div>
        <button onclick="hideSimplePanel()" style="position: absolute; top: 5px; right: 8px; background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
    `;
    
    document.body.appendChild(panel);
    console.log('✅ シンプル管理パネル作成完了');
    return panel;
}

// 3. 不要な要素の削除（CSP対応版）
function removeUnwantedElements() {
    console.log('不要要素削除開始');
    
    let removedCount = 0;
    
    // 「読み込み中のページ」モーダルの削除
    const loadingModals = document.querySelectorAll('[id*="loading"], [class*="loading"], [data-bs-target*="loading"]');
    loadingModals.forEach(modal => {
        if (modal.textContent.includes('読み込み中') || modal.textContent.includes('ページの内容')) {
            modal.remove();
            removedCount++;
            console.log('読み込み中モーダル削除');
        }
    });
    
    // モーダルトリガー要素の削除
    const modalTriggers = document.querySelectorAll('*');
    modalTriggers.forEach(element => {
        if (element.getAttribute && (
            element.getAttribute('data-bs-toggle') === 'modal' ||
            element.getAttribute('data-toggle') === 'modal'
        )) {
            const target = element.getAttribute('data-bs-target') || element.getAttribute('data-target');
            if (target && target.includes('loading')) {
                element.removeAttribute('data-bs-toggle');
                element.removeAttribute('data-toggle');
                element.removeAttribute('data-bs-target');
                element.removeAttribute('data-target');
                element.onclick = null;
                console.log('モーダルトリガー無効化');
            }
        }
    });
    
    // 丸いアイコンの削除
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        // 丸い形状で小さなアイコン
        if ((computedStyle.borderRadius === '50%' || 
             element.style.borderRadius === '50%' ||
             computedStyle.borderRadius.includes('50%')) &&
            rect.width > 10 && rect.width < 80 &&
            rect.height > 10 && rect.height < 80 &&
            element.id !== 'simple-management-btn' &&
            (element.textContent.includes('⭐') || 
             element.textContent.includes('✓') ||
             element.className.includes('bookmark') ||
             element.className.includes('compare'))) {
            
            element.remove();
            removedCount++;
        }
        
        // 白い空の要素
        if ((computedStyle.backgroundColor === 'rgb(255, 255, 255)' || 
             computedStyle.backgroundColor === 'white') &&
            rect.width > 20 && rect.width < 200 &&
            rect.height > 20 && rect.height < 200 &&
            !element.textContent.trim() &&
            !element.querySelector('img, button, input, select') &&
            !element.closest('.modal, .navbar, .hero-section')) {
            
            element.remove();
            removedCount++;
        }
    });
    
    console.log(`✅ 不要要素削除完了: ${removedCount}個削除`);
}

// 4. フィルター機能の修復
function fixFilterFunctionality() {
    console.log('フィルター機能修復開始');
    
    const filterBtn = document.getElementById('filterToggleBtn');
    const filterCard = document.getElementById('filter-card');
    
    if (!filterBtn || !filterCard) {
        console.log('フィルター要素が見つかりません');
        return;
    }
    
    // 新しいイベントハンドラー
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
    
    console.log('✅ フィルター機能修復完了');
}

// 5. グローバル関数定義
function showSimplePanel() {
    const panel = document.getElementById('simple-management-panel');
    if (panel) {
        panel.style.display = 'block';
        updateSimpleCounters();
    }
}

function hideSimplePanel() {
    const panel = document.getElementById('simple-management-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

function showSimpleComparison() {
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
}

function showSimpleBookmarks() {
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
}

function clearSimpleAll() {
    if (confirm('全ての選択を削除しますか？')) {
        localStorage.removeItem('bookmarkList');
        localStorage.removeItem('comparisonList');
        updateSimpleCounters();
        alert('全ての選択を削除しました');
    }
}

function updateSimpleCounters() {
    const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    
    const bookmarkCounter = document.getElementById('simple-bookmark-count');
    const comparisonCounter = document.getElementById('simple-comparison-count');
    
    if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
    if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
}

// 6. 初期化システム
function initializeSimpleSystem() {
    console.log('🔧 シンプルシステム初期化開始');
    
    // 段階的実行
    setTimeout(function() {
        removeUnwantedElements();
    }, 100);
    
    setTimeout(function() {
        createSimpleManagementButton();
    }, 200);
    
    setTimeout(function() {
        createSimplePanel();
    }, 300);
    
    setTimeout(function() {
        fixFilterFunctionality();
    }, 400);
    
    setTimeout(function() {
        updateSimpleCounters();
        console.log('✅ シンプルシステム初期化完了');
    }, 500);
    
    // 継続監視（10秒間隔）
    setInterval(function() {
        if (!document.getElementById('simple-management-btn')) {
            console.log('管理ボタン再作成');
            createSimpleManagementButton();
        }
        
        if (!document.getElementById('simple-management-panel')) {
            console.log('管理パネル再作成');
            createSimplePanel();
        }
        
        removeUnwantedElements();
    }, 10000);
}

// 7. 実行開始
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSimpleSystem);
} else {
    initializeSimpleSystem();
}

// 追加実行
setTimeout(initializeSimpleSystem, 100);
setTimeout(initializeSimpleSystem, 500);
setTimeout(initializeSimpleSystem, 1000);