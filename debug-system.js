// デバッグシステム - 問題原因特定

console.log('🔍 デバッグシステム開始');

// 1. DOM状態の確認
function checkDOMStatus() {
    console.log('=== DOM状態確認 ===');
    console.log('document.readyState:', document.readyState);
    console.log('body exists:', !!document.body);
    console.log('head exists:', !!document.head);
    
    // 管理ボタンの存在確認
    const buttons = document.querySelectorAll('#jp-management-btn, #emergency-btn, #direct-management-btn, #immediate-management-btn');
    console.log('管理ボタン数:', buttons.length);
    buttons.forEach((btn, index) => {
        console.log(`ボタン${index + 1}:`, btn.id, btn.style.display, btn.style.visibility);
    });
    
    // 🏆アイコンの存在確認
    const trophyElements = Array.from(document.querySelectorAll('*')).filter(el => el.textContent.includes('🏆'));
    console.log('🏆要素数:', trophyElements.length);
    
    return {
        buttonsFound: buttons.length,
        trophyFound: trophyElements.length,
        domReady: document.readyState === 'complete'
    };
}

// 2. JavaScript実行状況の確認
function checkJavaScriptStatus() {
    console.log('=== JavaScript実行状況確認 ===');
    
    // グローバル関数の存在確認
    const functions = ['toggleJapanesePanel', 'showJapaneseComparison', 'showJapaneseBookmarks', 'clearJapaneseAll'];
    functions.forEach(func => {
        console.log(`${func}:`, typeof window[func]);
    });
    
    // LocalStorage確認
    console.log('LocalStorage jp-bookmarkList:', localStorage.getItem('jp-bookmarkList'));
    console.log('LocalStorage jp-comparisonList:', localStorage.getItem('jp-comparisonList'));
    
    return {
        functionsLoaded: functions.filter(func => typeof window[func] === 'function').length,
        totalFunctions: functions.length
    };
}

// 3. CSS・スタイル状況の確認
function checkStyleStatus() {
    console.log('=== CSS・スタイル状況確認 ===');
    
    const body = document.body;
    if (body) {
        const bodyStyles = window.getComputedStyle(body);
        console.log('body overflow:', bodyStyles.overflow, bodyStyles.overflowY);
        console.log('body position:', bodyStyles.position);
        console.log('body z-index:', bodyStyles.zIndex);
    }
    
    // fixed要素の確認
    const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const styles = window.getComputedStyle(el);
        return styles.position === 'fixed';
    });
    console.log('fixed要素数:', fixedElements.length);
    fixedElements.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        console.log(`fixed要素${index + 1}:`, el.id || el.className, `z-index:${styles.zIndex}`, `bottom:${styles.bottom}`, `right:${styles.right}`);
    });
    
    return {
        fixedElementsFound: fixedElements.length
    };
}

// 4. エラー状況の確認
function checkErrorStatus() {
    console.log('=== エラー状況確認 ===');
    
    // エラーイベントリスナーを追加
    window.addEventListener('error', function(e) {
        console.error('JavaScript エラー:', e.error, e.filename, e.lineno);
    });
    
    // 未処理のPromise拒否を監視
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise 拒否:', e.reason);
    });
    
    return {
        errorListenersAdded: true
    };
}

// 5. 強制的な管理ボタン作成（緊急対応）
function forceCreateManagementButton() {
    console.log('🚨 強制管理ボタン作成開始');
    
    // 既存の全管理ボタンを削除
    const existingButtons = document.querySelectorAll('[id*="management"], [id*="emergency"], [id*="direct"], [id*="immediate"]');
    existingButtons.forEach(btn => btn.remove());
    console.log('既存ボタン削除数:', existingButtons.length);
    
    // 新しいボタンを作成
    const btn = document.createElement('div');
    btn.id = 'force-management-btn';
    btn.innerHTML = '🏆';
    btn.title = '管理センター（強制作成）';
    
    // 最強スタイル設定
    btn.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 70px !important;
        height: 70px !important;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
        color: white !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 28px !important;
        cursor: pointer !important;
        z-index: 999999999 !important;
        box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5) !important;
        border: 4px solid white !important;
        user-select: none !important;
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        transition: all 0.3s ease !important;
        animation: pulse 2s infinite !important;
    `;
    
    // CSS アニメーション追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // クリックイベント（複数方法で設定）
    btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        alert('🏆 管理センターボタンが動作しています！\n\n現在の状況：\n• ボタンは正常に表示されています\n• クリックイベントは機能しています\n• 次のステップで完全な管理パネルを実装します');
        console.log('管理センターボタンクリック成功！');
    };
    
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('addEventListener クリック成功！');
    });
    
    // ホバー効果
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
        this.style.boxShadow = '0 12px 35px rgba(255, 107, 107, 0.7)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.5)';
    });
    
    // bodyに追加
    document.body.appendChild(btn);
    
    console.log('✅ 強制管理ボタン作成完了:', btn.id);
    return btn;
}

// 6. 総合診断実行
function runFullDiagnosis() {
    console.log('🔍 総合診断開始');
    
    const domStatus = checkDOMStatus();
    const jsStatus = checkJavaScriptStatus();
    const styleStatus = checkStyleStatus();
    const errorStatus = checkErrorStatus();
    
    console.log('=== 診断結果サマリー ===');
    console.log('DOM準備完了:', domStatus.domReady);
    console.log('管理ボタン発見:', domStatus.buttonsFound);
    console.log('🏆アイコン発見:', domStatus.trophyFound);
    console.log('JS関数読み込み:', jsStatus.functionsLoaded + '/' + jsStatus.totalFunctions);
    console.log('fixed要素数:', styleStatus.fixedElementsFound);
    
    // 問題がある場合は強制修正
    if (domStatus.buttonsFound === 0 || domStatus.trophyFound === 0) {
        console.log('🚨 管理ボタンが見つからない - 強制作成実行');
        forceCreateManagementButton();
    }
    
    return {
        domStatus,
        jsStatus,
        styleStatus,
        errorStatus
    };
}

// 7. 実行開始
setTimeout(runFullDiagnosis, 100);
setTimeout(runFullDiagnosis, 1000);
setTimeout(runFullDiagnosis, 3000);

// 継続監視
setInterval(function() {
    const buttons = document.querySelectorAll('[id*="management"]');
    if (buttons.length === 0) {
        console.log('⚠️ 管理ボタン消失検出 - 再作成');
        forceCreateManagementButton();
    }
}, 5000);

console.log('✅ デバッグシステム初期化完了');