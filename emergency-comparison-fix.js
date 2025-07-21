// 緊急比較機能修復システム
console.log('🚨 緊急比較機能修復開始');

// 比較ボタンを強制的に修復する関数
function emergencyFixComparisonButton() {
    console.log('🔧 緊急比較ボタン修復実行中...');
    
    // 複数のセレクターで比較ボタンを探索
    const possibleSelectors = [
        '#showComparison',
        '[onclick*="showComparison"]',
        '.floating-toolbar button:contains("比較")',
        '.floating-toolbar [class*="compare"]',
        '.floating-toolbar button[data-action="compare"]',
        'button:contains("比較する")',
        '.floating-toolbar button:nth-child(2)',
        '.comparison-btn',
        '.compare-button'
    ];
    
    let buttonFound = false;
    
    possibleSelectors.forEach(selector => {
        try {
            let buttons;
            
            // :contains() セレクターは使えないので、テキストで検索
            if (selector.includes(':contains')) {
                const text = selector.match(/:contains\("(.+?)"\)/)[1];
                buttons = Array.from(document.querySelectorAll('.floating-toolbar button')).filter(btn => 
                    btn.textContent.includes(text)
                );
            } else {
                buttons = document.querySelectorAll(selector);
            }
            
            buttons.forEach(button => {
                if (button && !button.hasAttribute('data-emergency-fixed')) {
                    console.log('🎯 比較ボタン発見:', button, 'セレクター:', selector);
                    
                    // 既存のイベントを全て削除
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    
                    // 新しいイベントリスナーを追加
                    newButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        
                        console.log('🔘 緊急比較ボタンクリック検出!');
                        
                        // 比較機能を実行
                        executeComparisonFunction();
                    });
                    
                    // 修復済みマークを追加
                    newButton.setAttribute('data-emergency-fixed', 'true');
                    buttonFound = true;
                    
                    console.log('✅ 比較ボタン緊急修復完了');
                }
            });
        } catch (error) {
            console.log('⚠️ セレクター検索エラー:', selector, error);
        }
    });
    
    if (!buttonFound) {
        console.warn('❌ 比較ボタンが見つかりませんでした');
        
        // フローティングツールバー全体をスキャン
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) {
            console.log('🔍 フローティングツールバー発見、全ボタンをスキャン');
            const allButtons = toolbar.querySelectorAll('button');
            
            allButtons.forEach((btn, index) => {
                console.log(`ボタン${index + 1}:`, btn.textContent, btn.className, btn.id);
                
                // "比較" という文字が含まれているボタンを修復
                if (btn.textContent.includes('比較') && !btn.hasAttribute('data-emergency-fixed')) {
                    const newButton = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newButton, btn);
                    
                    newButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        
                        console.log('🔘 スキャンで発見した比較ボタンクリック!');
                        executeComparisonFunction();
                    });
                    
                    newButton.setAttribute('data-emergency-fixed', 'true');
                    console.log('✅ スキャンで比較ボタン修復完了');
                }
            });
        }
    }
}

// 比較機能を実行する関数
function executeComparisonFunction() {
    console.log('🚀 比較機能実行開始');
    
    try {
        // 比較されたガイドを取得
        const comparedGuides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        console.log('📊 比較対象ガイド:', comparedGuides);
        
        if (comparedGuides.length === 0) {
            alert('比較するガイドが選択されていません\n\nガイドカードの✓ボタンをクリックして比較対象を選択してください。');
            return;
        }
        
        // UltimateJapaneseIconsが利用可能な場合
        if (window.ultimateJapaneseIcons && typeof window.ultimateJapaneseIcons.showComparison === 'function') {
            console.log('🎯 UltimateJapaneseIcons.showComparison() 実行');
            window.ultimateJapaneseIcons.showComparison();
            return;
        }
        
        // フォールバック: シンプルな比較表示
        showFallbackComparison(comparedGuides);
        
    } catch (error) {
        console.error('❌ 比較機能実行エラー:', error);
        alert('比較機能でエラーが発生しました。\nページを再読み込みしてからもう一度お試しください。');
    }
}

// フォールバック比較表示
function showFallbackComparison(comparedGuides) {
    console.log('🔄 フォールバック比較表示実行');
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.cssText = 'display: block; z-index: 1060; background: rgba(0,0,0,0.5);';
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">ガイド比較</h5>
                    <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                </div>
                <div class="modal-body">
                    <p><strong>選択されたガイド: ${comparedGuides.length}人</strong></p>
                    <div class="row">
                        ${comparedGuides.map(guideId => `
                            <div class="col-md-4 mb-3">
                                <div class="card">
                                    <div class="card-body text-center">
                                        <h6>ガイド ${guideId}</h6>
                                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromComparison(${guideId})">
                                            削除
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-warning" onclick="clearAllComparisons()">全て削除</button>
                        <button class="btn btn-primary" onclick="startDetailedComparison()">詳細比較開始</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // グローバル関数を定義
    window.removeFromComparison = function(guideId) {
        let guides = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        guides = guides.filter(id => id !== guideId);
        localStorage.setItem('comparedGuides', JSON.stringify(guides));
        modal.remove();
        
        // アイコン状態を更新
        if (window.ultimateJapaneseIcons) {
            window.ultimateJapaneseIcons.updateToolbarCounts();
        }
        
        alert(`ガイド ${guideId} を比較から削除しました`);
    };
    
    window.clearAllComparisons = function() {
        if (confirm('比較リストを全てクリアしますか？')) {
            localStorage.setItem('comparedGuides', '[]');
            modal.remove();
            
            // アイコン状態を更新
            if (window.ultimateJapaneseIcons) {
                window.ultimateJapaneseIcons.updateToolbarCounts();
            }
            
            alert('比較リストをクリアしました');
        }
    };
    
    window.startDetailedComparison = function() {
        alert('詳細比較機能は今後実装予定です\n\n現在選択中のガイドで価格・専門分野・言語などの比較表示を追加します。');
    };
}

// DOM読み込み完了時に実行
document.addEventListener('DOMContentLoaded', emergencyFixComparisonButton);

// ページ読み込み完了後にも実行
window.addEventListener('load', emergencyFixComparisonButton);

// 即座に実行
setTimeout(emergencyFixComparisonButton, 500);

// 定期的にチェック
setInterval(() => {
    const unfixedButtons = document.querySelectorAll('.floating-toolbar button:not([data-emergency-fixed])');
    if (unfixedButtons.length > 0) {
        console.log('🔧 未修復ボタン検出、緊急修復実行');
        emergencyFixComparisonButton();
    }
}, 3000);

console.log('🚨 Emergency Comparison Fix System Loaded');