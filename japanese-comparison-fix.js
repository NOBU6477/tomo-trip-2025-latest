// 日本語版比較機能修復システム
console.log('🇯🇵 日本語版比較機能修復開始');

// グローバル比較機能修復関数
function fixJapaneseComparison() {
    console.log('🔧 日本語版比較機能修復実行');
    
    // フローティングツールバーの比較ボタンにイベントリスナーを追加
    setTimeout(() => {
        const compareBtn = document.querySelector('#showComparison, [onclick*="showComparison"], .floating-toolbar button[id*="comparison"], .floating-toolbar button[id*="compare"]');
        
        if (compareBtn) {
            console.log('✅ 比較ボタン発見:', compareBtn);
            
            // 既存のクリックイベントを削除
            compareBtn.removeAttribute('onclick');
            
            // 新しいイベントリスナーを追加
            compareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🔘 比較ボタンクリックされました');
                
                // UltimateJapaneseIconsのインスタンスを取得
                if (window.ultimateJapaneseIcons) {
                    window.ultimateJapaneseIcons.showComparison();
                } else {
                    // フォールバック比較表示
                    const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
                    
                    if (comparedGuides.length === 0) {
                        alert('比較するガイドが選択されていません\n\nガイドカードの比較ボタン（✓）をクリックして比較対象を選択してください。');
                    } else {
                        alert(`比較機能\n\n選択されたガイド: ${comparedGuides.length}人\n\n詳細な比較画面は今後実装予定です。\n現在の選択: ${comparedGuides.join(', ')}`);
                    }
                }
            });
            
            console.log('✅ 比較ボタンイベントリスナー設定完了');
        } else {
            console.warn('⚠️ 比較ボタンが見つかりません');
        }
        
        // ブックマークボタンも同様に修復
        const bookmarkBtn = document.querySelector('#showBookmarks, [onclick*="showBookmarks"], .floating-toolbar button[id*="bookmark"]');
        
        if (bookmarkBtn) {
            console.log('✅ ブックマークボタン発見:', bookmarkBtn);
            
            // 既存のクリックイベントを削除
            bookmarkBtn.removeAttribute('onclick');
            
            // 新しいイベントリスナーを追加
            bookmarkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🔘 ブックマークボタンクリックされました');
                
                // UltimateJapaneseIconsのインスタンスを取得
                if (window.ultimateJapaneseIcons) {
                    window.ultimateJapaneseIcons.showBookmarks();
                } else {
                    // フォールバック表示
                    const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
                    
                    if (bookmarkedGuides.length === 0) {
                        alert('ブックマークされたガイドはありません\n\nガイドカードの星ボタン（★）をクリックしてブックマークを追加してください。');
                    } else {
                        alert(`ブックマーク済みガイド: ${bookmarkedGuides.length}人\n\n興味深いガイドを保存できる機能です。\n\n詳細表示は今後実装予定です。`);
                    }
                }
            });
            
            console.log('✅ ブックマークボタンイベントリスナー設定完了');
        }
        
    }, 2000); // 2秒後に実行して、他のスクリプトの読み込みを待つ
}

// DOMContentLoaded時に実行
document.addEventListener('DOMContentLoaded', fixJapaneseComparison);

// ページ読み込み完了後にも実行
window.addEventListener('load', fixJapaneseComparison);

// 即座に実行も試行
setTimeout(fixJapaneseComparison, 1000);

// 定期的に比較機能をチェックして修復
setInterval(() => {
    const compareBtn = document.querySelector('#showComparison, [onclick*="showComparison"]');
    if (compareBtn && !compareBtn.hasAttribute('data-fixed')) {
        console.log('🔧 比較機能の再修復が必要です');
        fixJapaneseComparison();
        compareBtn.setAttribute('data-fixed', 'true');
    }
}, 5000);

console.log('📱 Japanese Comparison Fix System Loaded');