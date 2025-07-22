// ブックマークボタンデバッグシステム
console.log('🔍 ブックマークボタンデバッグシステム開始');

class BookmarkButtonDebug {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🎯 ブックマークボタンデバッグ初期化');
        
        // 5秒後にデバッグ開始
        setTimeout(() => {
            this.debugBookmarkButtons();
        }, 5000);
        
        // 定期的にボタンの状態をチェック
        setInterval(() => {
            this.monitorButtonState();
        }, 10000);
    }
    
    debugBookmarkButtons() {
        console.log('🔍 === ブックマークボタンデバッグ開始 ===');
        
        // フローティングツールバーの調査
        const toolbar = document.querySelector('.floating-toolbar');
        console.log('🔧 フローティングツールバー:', toolbar);
        
        if (toolbar) {
            const buttons = toolbar.querySelectorAll('button, .btn');
            console.log(`📊 ツールバー内ボタン数: ${buttons.length}`);
            
            buttons.forEach((btn, index) => {
                console.log(`🔘 ボタン[${index}]:`, {
                    text: btn.textContent.trim(),
                    className: btn.className,
                    onclick: btn.getAttribute('onclick'),
                    hasEventListeners: btn._eventListeners ? 'あり' : 'なし'
                });
            });
        }
        
        // ブックマーク関連ボタンの検索
        const bookmarkSelectors = [
            'button:contains("ブックマーク")',
            'button[onclick*="bookmark"]',
            '.btn:contains("ブックマーク")',
            '[class*="bookmark"]',
            '.floating-toolbar .btn:nth-child(3)',
            '.floating-toolbar button:nth-of-type(3)'
        ];
        
        console.log('🔍 ブックマークボタン検索:');
        bookmarkSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                console.log(`   ${selector}: ${elements.length}個`);
                elements.forEach((el, i) => {
                    console.log(`     [${i}] "${el.textContent.trim()}"`);
                });
            } catch (e) {
                console.log(`   ${selector}: エラー (${e.message})`);
            }
        });
        
        // テキスト内容でボタンを検索
        const allButtons = document.querySelectorAll('button, .btn');
        const bookmarkButtons = Array.from(allButtons).filter(btn => {
            const text = btn.textContent.toLowerCase();
            return text.includes('ブックマーク') || text.includes('bookmark');
        });
        
        console.log(`📚 テキスト検索結果: ${bookmarkButtons.length}個のブックマークボタン`);
        bookmarkButtons.forEach((btn, index) => {
            console.log(`   [${index}] "${btn.textContent.trim()}" (${btn.className})`);
        });
        
        // 日本語ガイド管理システムの状態確認
        if (window.japaneseGuideManager) {
            console.log('✅ 日本語ガイド管理システム: 有効');
            
            // ブックマーク管理モーダルの確認
            const modal = document.getElementById('japanese-bookmark-modal');
            console.log('🪟 ブックマーク管理モーダル:', modal ? '存在' : '不存在');
        } else {
            console.log('❌ 日本語ガイド管理システム: 無効');
        }
        
        console.log('🔍 === ブックマークボタンデバッグ終了 ===');
    }
    
    monitorButtonState() {
        // ブックマークボタンの状態監視
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) {
            const buttons = toolbar.querySelectorAll('button, .btn');
            let bookmarkButton = null;
            
            // ブックマークボタンを特定
            buttons.forEach((btn, index) => {
                const text = btn.textContent.toLowerCase().trim();
                if (text.includes('ブックマーク') || text.includes('bookmark') || index === 2) {
                    bookmarkButton = btn;
                }
            });
            
            if (bookmarkButton) {
                // クリックイベントテスト
                const hasEventListener = bookmarkButton._eventListeners || 
                                       bookmarkButton.onclick || 
                                       bookmarkButton.getAttribute('onclick');
                
                console.log('📊 ブックマークボタン状態:', {
                    text: bookmarkButton.textContent.trim(),
                    hasEvents: hasEventListener ? 'あり' : 'なし',
                    clickable: bookmarkButton.disabled ? 'いいえ' : 'はい'
                });
                
                // イベントが無い場合は手動で追加
                if (!hasEventListener) {
                    console.log('🔧 ブックマークボタンにイベントリスナーを手動追加');
                    this.addEmergencyBookmarkHandler(bookmarkButton);
                }
            } else {
                console.log('⚠️ ブックマークボタンが見つかりません');
            }
        }
    }
    
    addEmergencyBookmarkHandler(button) {
        // 緊急用ブックマークハンドラー
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🚨 緊急ブックマークハンドラー実行');
            
            if (window.japaneseGuideManager) {
                window.japaneseGuideManager.showBookmarkManagement();
            } else {
                console.error('❌ 日本語ガイド管理システムが利用できません');
                alert('ブックマーク管理システムの初期化に問題があります。ページを再読み込みしてください。');
            }
        });
        
        console.log('✅ 緊急ブックマークハンドラー追加完了');
    }
    
    // デバッグ情報を表示する公開メソッド
    showDebugInfo() {
        this.debugBookmarkButtons();
    }
}

// インスタンス作成
window.bookmarkButtonDebug = new BookmarkButtonDebug();

// グローバルデバッグ関数
window.debugBookmarkButtons = () => {
    if (window.bookmarkButtonDebug) {
        window.bookmarkButtonDebug.showDebugInfo();
    }
};

console.log('✅ ブックマークボタンデバッグシステム準備完了');
console.log('💡 デバッグ実行: debugBookmarkButtons() をコンソールで実行してください');