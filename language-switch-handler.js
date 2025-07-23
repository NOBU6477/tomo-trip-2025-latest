// 言語切り替えハンドラー - 管理パネル持続システム
console.log('🌐 言語切り替えハンドラー開始');

(function languageSwitchHandler() {
    'use strict';
    
    // 現在の管理パネル状態を保存
    function savePanelState() {
        const ultimatePanel = document.getElementById('ultimate-management-panel-final');
        if (ultimatePanel) {
            localStorage.setItem('panelWasVisible', 'true');
            console.log('🌐 パネル状態保存: 表示中');
        } else {
            localStorage.setItem('panelWasVisible', 'false');
            console.log('🌐 パネル状態保存: 非表示');
        }
    }
    
    // 言語切り替え関数を拡張
    function enhanceSwitchToEnglish() {
        if (window.switchToEnglish) {
            const originalSwitchToEnglish = window.switchToEnglish;
            window.switchToEnglish = function() {
                console.log('🌐 英語切り替え前処理');
                savePanelState();
                
                // 遅延実行で確実に保存
                setTimeout(() => {
                    originalSwitchToEnglish.call(this);
                }, 100);
            };
            console.log('🌐 switchToEnglish拡張完了');
        }
    }
    
    function enhanceSwitchToJapanese() {
        if (window.switchToJapanese) {
            const originalSwitchToJapanese = window.switchToJapanese;
            window.switchToJapanese = function() {
                console.log('🌐 日本語切り替え前処理');
                savePanelState();
                
                // 遅延実行で確実に保存
                setTimeout(() => {
                    originalSwitchToJapanese.call(this);
                }, 100);
            };
            console.log('🌐 switchToJapanese拡張完了');
        }
    }
    
    // ページ読み込み時に管理パネル復元チェック
    function checkPanelRestoration() {
        const wasVisible = localStorage.getItem('panelWasVisible');
        console.log('🌐 パネル復元チェック:', wasVisible);
        
        if (wasVisible === 'true') {
            console.log('🌐 管理パネル復元実行');
            
            // 既存のultimate-management-panel.js実行を確認
            const existingPanel = document.getElementById('ultimate-management-panel-final');
            if (!existingPanel) {
                // パネルが存在しない場合、強制再実行
                setTimeout(() => {
                    if (window.ultimateManagementPanel) {
                        window.ultimateManagementPanel();
                        console.log('🌐 管理パネル強制復元完了');
                    } else {
                        // ultimate-management-panel.jsを再実行
                        const script = document.createElement('script');
                        script.src = 'ultimate-management-panel.js';
                        script.onload = function() {
                            console.log('🌐 管理パネルスクリプト再読み込み完了');
                        };
                        document.head.appendChild(script);
                    }
                }, 2500);
            } else {
                console.log('🌐 管理パネル既に存在');
            }
        }
        
        // フラグをクリア
        localStorage.removeItem('panelWasVisible');
    }
    
    // 言語切り替えボタンにイベントリスナー追加
    function attachLanguageButtonListeners() {
        // 英語切り替えボタン
        const englishBtns = document.querySelectorAll('[onclick*="switchToEnglish"], .lang-btn-en, [href*="index-en.html"]');
        englishBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                console.log('🌐 英語ボタンクリック検知');
                savePanelState();
            }, true); // capture phase で確実に実行
        });
        
        // 日本語切り替えボタン
        const japaneseBtns = document.querySelectorAll('[onclick*="switchToJapanese"], .lang-btn-jp, [href*="index.html"]');
        japaneseBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                console.log('🌐 日本語ボタンクリック検知');
                savePanelState();
            }, true);
        });
        
        console.log('🌐 言語ボタンリスナー設定:', englishBtns.length + japaneseBtns.length, '個');
    }
    
    // ページ離脱前に状態保存
    function attachBeforeUnloadHandler() {
        window.addEventListener('beforeunload', function() {
            console.log('🌐 ページ離脱前保存');
            savePanelState();
        });
    }
    
    // システム初期化
    function initializeLanguageSwitchHandler() {
        console.log('🌐 言語切り替えハンドラー初期化');
        
        // 1. 既存関数拡張
        enhanceSwitchToEnglish();
        enhanceSwitchToJapanese();
        
        // 2. ボタンリスナー設定
        attachLanguageButtonListeners();
        
        // 3. ページ離脱ハンドラー
        attachBeforeUnloadHandler();
        
        // 4. 復元チェック（ページ読み込み時）
        setTimeout(checkPanelRestoration, 1000);
        
        // 5. 定期的な状態確認（10秒間隔）
        setInterval(() => {
            const panel = document.getElementById('ultimate-management-panel-final');
            if (panel) {
                localStorage.setItem('panelLastSeen', Date.now().toString());
            }
        }, 10000);
        
        console.log('🌐 言語切り替えハンドラー初期化完了');
    }
    
    // DOM読み込み完了後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLanguageSwitchHandler);
    } else {
        initializeLanguageSwitchHandler();
    }
    
    // グローバル関数として公開
    window.languageSwitchHandler = {
        savePanelState: savePanelState,
        checkPanelRestoration: checkPanelRestoration
    };
    
    console.log('🌐 言語切り替えハンドラーシステム準備完了');
})();