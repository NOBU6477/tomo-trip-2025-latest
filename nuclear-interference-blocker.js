// 核レベル干渉阻止システム
console.log('☢️ 核レベル干渉阻止開始');

(function nuclearInterferenceBlocker() {
    'use strict';
    
    // 他のスクリプトによる干渉を阻止
    function blockScriptInterference() {
        console.log('☢️ スクリプト干渉阻止');
        
        // setInterval/setTimeout の制限
        const originalSetInterval = window.setInterval;
        const originalSetTimeout = window.setTimeout;
        
        let intervalCount = 0;
        let timeoutCount = 0;
        
        window.setInterval = function(callback, delay) {
            intervalCount++;
            if (intervalCount > 50) {
                console.log('☢️ setInterval制限: 過多実行阻止');
                return null;
            }
            return originalSetInterval.call(this, callback, delay);
        };
        
        window.setTimeout = function(callback, delay) {
            timeoutCount++;
            if (timeoutCount > 100) {
                console.log('☢️ setTimeout制限: 過多実行阻止');
                return null;
            }
            return originalSetTimeout.call(this, callback, delay);
        };
        
        console.log('☢️ タイマー干渉阻止完了');
    }
    
    // DOM操作の監視と保護
    function protectDOMOperations() {
        console.log('☢️ DOM操作保護開始');
        
        // MutationObserver による監視
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // 緑パネルが削除された場合の復元
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach(function(node) {
                        if (node.id === 'direct-green-panel') {
                            console.log('☢️ 緑パネル削除検出 - 復元実行');
                            setTimeout(() => {
                                if (!document.getElementById('direct-green-panel')) {
                                    // 復元処理をトリガー
                                    const event = new Event('restoreGreenPanel');
                                    document.dispatchEvent(event);
                                }
                            }, 100);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('☢️ DOM操作保護完了');
    }
    
    // CSP違反の解決
    function resolveCSPViolations() {
        console.log('☢️ CSP違反解決');
        
        // eval の使用を阻止
        window.eval = function(code) {
            console.log('☢️ eval実行阻止:', code.substring(0, 50));
            return null;
        };
        
        // onclick属性の動的削除
        function removeOnclickAttributes() {
            const elementsWithOnclick = document.querySelectorAll('[onclick]');
            elementsWithOnclick.forEach(element => {
                const onclickCode = element.getAttribute('onclick');
                element.removeAttribute('onclick');
                
                // 代替イベントリスナー追加
                element.addEventListener('click', function(e) {
                    try {
                        // 安全な関数実行
                        if (onclickCode.includes('alert(')) {
                            const message = onclickCode.match(/alert\('([^']+)'\)/);
                            if (message) {
                                alert(message[1]);
                            }
                        }
                    } catch (error) {
                        console.log('☢️ onclick変換エラー:', error);
                    }
                });
            });
            
            console.log(`☢️ onclick属性削除: ${elementsWithOnclick.length}個`);
        }
        
        // 定期的にonclick削除
        setInterval(removeOnclickAttributes, 2000);
        
        console.log('☢️ CSP違反解決完了');
    }
    
    // 緑パネル復元イベントリスナー
    function setupRestoreListener() {
        document.addEventListener('restoreGreenPanel', function() {
            console.log('☢️ 緑パネル復元要求受信');
            
            // 既存パネル確認
            if (document.getElementById('direct-green-panel')) {
                return; // 既に存在する場合は何もしない
            }
            
            // 復元実行
            setTimeout(() => {
                if (window.createGreenPanelFunction) {
                    window.createGreenPanelFunction();
                    console.log('☢️ 緑パネル復元完了');
                }
            }, 500);
        });
    }
    
    // システム初期化
    function initializeBlocker() {
        console.log('☢️ 核レベル干渉阻止初期化');
        
        blockScriptInterference();
        protectDOMOperations();
        resolveCSPViolations();
        setupRestoreListener();
        
        console.log('☢️ 核レベル干渉阻止初期化完了');
    }
    
    // 即座実行
    initializeBlocker();
    
    // 定期監視
    setInterval(() => {
        // 緑パネルの存在確認
        const greenPanel = document.getElementById('direct-green-panel');
        if (!greenPanel) {
            console.log('☢️ 緑パネル消失検出');
            const event = new Event('restoreGreenPanel');
            document.dispatchEvent(event);
        }
    }, 3000);
    
    console.log('☢️ 核レベル干渉阻止システム完了');
})();