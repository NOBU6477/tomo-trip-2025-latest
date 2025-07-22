// コンソールデバッグシステム
console.log('🔍 === コンソールデバッグシステム開始 ===');

// 基本動作確認
console.log('🔍 JavaScript動作確認: OK');
console.log('🔍 現在時刻:', new Date().toLocaleString());
console.log('🔍 URL:', window.location.href);
console.log('🔍 ユーザーエージェント:', navigator.userAgent);

// DOM状態確認
console.log('🔍 document.readyState:', document.readyState);
console.log('🔍 document.body存在:', !!document.body);

// LocalStorage確認
try {
    const bookmarks = localStorage.getItem('bookmarkedGuides');
    const compares = localStorage.getItem('comparedGuides');
    console.log('🔍 ブックマーク:', bookmarks);
    console.log('🔍 比較対象:', compares);
} catch (e) {
    console.log('🔍 LocalStorageエラー:', e);
}

// 既存パネル確認
function checkExistingPanels() {
    const panels = [
        'guidance-panel',
        'debug-guidance-panel', 
        'emergency-guidance-panel',
        'nuclear-panel',
        'immediate-test-panel'
    ];
    
    panels.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const styles = window.getComputedStyle(element);
            console.log(`🔍 パネル ${id}:`, {
                exists: true,
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                position: styles.position,
                zIndex: styles.zIndex
            });
        } else {
            console.log(`🔍 パネル ${id}: 存在しない`);
        }
    });
}

// スクリプト読み込み確認
function checkScriptLoading() {
    const scripts = document.querySelectorAll('script[src]');
    const managementScripts = [];
    
    scripts.forEach(script => {
        const src = script.src;
        if (src.includes('enhanced-management') || 
            src.includes('debug-enhanced') || 
            src.includes('emergency-csp') ||
            src.includes('nuclear-visibility') ||
            src.includes('immediate-test')) {
            managementScripts.push({
                src: src.split('/').pop(),
                loaded: script.readyState !== 'loading'
            });
        }
    });
    
    console.log('🔍 管理システムスクリプト:', managementScripts);
}

// エラー監視
window.addEventListener('error', function(e) {
    console.log('🔍 JavaScript エラー検出:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
});

// CSP エラー監視
window.addEventListener('securitypolicyviolation', function(e) {
    console.log('🔍 CSP違反検出:', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        lineNumber: e.lineNumber,
        sourceFile: e.sourceFile
    });
});

// 初期化関数
function initDebugSystem() {
    console.log('🔍 === デバッグシステム初期化 ===');
    
    checkExistingPanels();
    checkScriptLoading();
    
    // 5秒ごとに状態確認
    setInterval(() => {
        console.log('🔍 === 定期チェック ===');
        checkExistingPanels();
    }, 5000);
    
    console.log('🔍 === デバッグシステム初期化完了 ===');
}

// DOMロード待ち
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebugSystem);
} else {
    initDebugSystem();
}

console.log('🔍 === コンソールデバッグシステム設定完了 ===');