// ブックマークシステムテスト用デバッグ関数
console.log('🔍 ブックマークシステムテスト開始');

window.debugBookmarkSystem = function() {
    console.log('=== ブックマークシステムデバッグ ===');
    
    // LocalStorage確認
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
    console.log('📚 現在のブックマーク:', bookmarks);
    
    // ボタンの存在確認
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn, .square-bookmark-btn');
    console.log(`🔘 ブックマークボタン数: ${bookmarkButtons.length}`);
    
    bookmarkButtons.forEach((btn, index) => {
        const guideId = btn.getAttribute('data-guide-id');
        const isActive = bookmarks.includes(parseInt(guideId));
        console.log(`  ボタン${index + 1}: ガイドID=${guideId}, アクティブ=${isActive}`);
        
        // ボタンの状態確認
        const style = window.getComputedStyle(btn);
        console.log(`    背景色: ${style.backgroundColor}`);
        console.log(`    表示: ${style.display}`);
        console.log(`    位置: ${style.position}`);
    });
    
    // イベントリスナーの確認
    console.log('🎯 イベントリスナーテスト...');
    bookmarkButtons.forEach((btn, index) => {
        const hasClickEvent = btn.onclick || btn.addEventListener;
        console.log(`  ボタン${index + 1}: クリックイベント=${!!hasClickEvent}`);
    });
    
    // ツールバーの確認
    const toolbarBtns = document.querySelectorAll('button');
    toolbarBtns.forEach(btn => {
        const text = btn.textContent;
        if (text.includes('ブックマーク') || text.includes('Bookmark')) {
            console.log(`📊 ツールバーボタン: "${text}"`);
        }
    });
    
    console.log('=== デバッグ終了 ===');
};

// ページ読み込み後に自動実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.debugBookmarkSystem, 2000);
    });
} else {
    setTimeout(window.debugBookmarkSystem, 2000);
}

console.log('✅ ブックマークシステムテスト準備完了 - debugBookmarkSystem()で実行可能');