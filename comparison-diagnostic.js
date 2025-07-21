// 比較機能診断システム
console.log('🔍 比較機能診断開始');

function runComparisonDiagnostic() {
    console.log('\n=== 比較機能診断レポート ===');
    
    // 1. フローティングツールバーの状態確認
    const toolbar = document.querySelector('.floating-toolbar');
    console.log('1. フローティングツールバー:', toolbar ? '発見' : '未発見');
    
    if (toolbar) {
        const buttons = toolbar.querySelectorAll('button');
        console.log('   ボタン数:', buttons.length);
        
        buttons.forEach((btn, index) => {
            console.log(`   ボタン${index + 1}:`, {
                text: btn.textContent.trim(),
                id: btn.id,
                className: btn.className,
                onclick: btn.getAttribute('onclick'),
                hasEventListeners: btn.hasAttribute('data-emergency-fixed') || btn.hasAttribute('data-fixed')
            });
            
            // 比較ボタンの詳細分析
            if (btn.textContent.includes('比較')) {
                console.log('   🎯 比較ボタン詳細分析:');
                console.log('   - innerHTML:', btn.innerHTML);
                console.log('   - パレント:', btn.parentElement?.className);
                console.log('   - disabled:', btn.disabled);
                console.log('   - style.display:', btn.style.display);
                console.log('   - style.pointerEvents:', btn.style.pointerEvents);
                
                // クリックテスト
                console.log('   - クリックテスト実行...');
                try {
                    btn.click();
                    console.log('   ✅ クリック成功');
                } catch (error) {
                    console.log('   ❌ クリックエラー:', error);
                }
            }
        });
    }
    
    // 2. UltimateJapaneseIconsインスタンス確認
    console.log('\n2. UltimateJapaneseIcons インスタンス:');
    if (window.ultimateJapaneseIcons) {
        console.log('   ✅ インスタンス存在');
        console.log('   - 比較対象数:', window.ultimateJapaneseIcons.comparedGuides?.length || 0);
        console.log('   - 比較対象:', window.ultimateJapaneseIcons.comparedGuides);
        console.log('   - showComparison関数:', typeof window.ultimateJapaneseIcons.showComparison);
        
        // showComparison関数をテスト
        if (typeof window.ultimateJapaneseIcons.showComparison === 'function') {
            console.log('   🧪 showComparison関数テスト実行...');
            try {
                window.ultimateJapaneseIcons.showComparison();
                console.log('   ✅ showComparison実行成功');
            } catch (error) {
                console.log('   ❌ showComparison実行エラー:', error);
            }
        }
    } else {
        console.log('   ❌ インスタンス未存在');
    }
    
    // 3. ローカルストレージ確認
    console.log('\n3. ローカルストレージ:');
    const comparedGuides = localStorage.getItem('comparedGuides');
    console.log('   - comparedGuides:', comparedGuides);
    if (comparedGuides) {
        try {
            const parsed = JSON.parse(comparedGuides);
            console.log('   - パース結果:', parsed);
            console.log('   - 配列長:', parsed.length);
        } catch (error) {
            console.log('   - パースエラー:', error);
        }
    }
    
    // 4. Bootstrap確認
    console.log('\n4. Bootstrap:');
    console.log('   - bootstrap:', typeof window.bootstrap);
    console.log('   - Bootstrap.Modal:', typeof window.bootstrap?.Modal);
    
    // 5. DOM状態確認
    console.log('\n5. DOM状態:');
    const modals = document.querySelectorAll('.modal');
    console.log('   - 既存モーダル数:', modals.length);
    
    // 6. イベントリスナー確認
    console.log('\n6. イベントリスナー確認:');
    const compareButtons = document.querySelectorAll('[onclick*="showComparison"], #showComparison, button:contains("比較")');
    console.log('   - 比較関連ボタン数:', compareButtons.length);
    
    // 7. エラーログ確認
    console.log('\n7. コンソールエラー:');
    
    // 8. 強制実行テスト
    console.log('\n8. 強制実行テスト:');
    console.log('   比較機能を強制実行します...');
    
    try {
        // 比較ガイドを仮想的に追加
        const testGuides = [1, 2];
        localStorage.setItem('comparedGuides', JSON.stringify(testGuides));
        
        if (window.ultimateJapaneseIcons) {
            window.ultimateJapaneseIcons.comparedGuides = testGuides;
            window.ultimateJapaneseIcons.showComparison();
        }
        
        console.log('   ✅ 強制実行完了');
    } catch (error) {
        console.log('   ❌ 強制実行エラー:', error);
    }
    
    console.log('\n=== 診断完了 ===\n');
}

// 診断実行
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runComparisonDiagnostic, 3000);
});

// 手動実行用
window.runComparisonDiagnostic = runComparisonDiagnostic;

console.log('🔍 Comparison Diagnostic System Loaded - コンソールでrunComparisonDiagnostic()を実行してください');