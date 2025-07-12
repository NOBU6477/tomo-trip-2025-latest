/**
 * 安定版ヘッダー修正スクリプト
 * ヘッダーボタンの点滅問題を完全解決
 */
(function() {
    'use strict';
    
    console.log('🔧 安定版ヘッダー修正開始');
    
    let headerFixed = false;
    let fixAttempts = 0;
    const maxAttempts = 3;
    
    function stableHeaderFix() {
        if (headerFixed || fixAttempts >= maxAttempts) {
            console.log('ヘッダー修正完了またはmax試行数到達');
            return;
        }
        
        fixAttempts++;
        console.log(`🎯 ヘッダー安定化修正 (試行 ${fixAttempts}/${maxAttempts})`);
        
        try {
            // 1. 新規登録ボタンの安定化
            fixSignUpButton();
            
            // 2. ログインボタンの安定化
            fixLoginButton();
            
            // 3. 言語ドロップダウンの安定化
            fixLanguageDropdown();
            
            // 4. 他のsetIntervalを停止
            stopConflictingScripts();
            
            headerFixed = true;
            console.log('✅ ヘッダー安定化完了');
            
        } catch (error) {
            console.error('❌ ヘッダー修正エラー:', error);
        }
    }
    
    function fixSignUpButton() {
        const signUpButtons = document.querySelectorAll('button[onclick*="showRegisterOptions"], .btn-light');
        
        signUpButtons.forEach(button => {
            if (button.textContent.includes('Sign Up') || button.textContent.includes('新規登録')) {
                // 固定テキストを設定
                button.textContent = '新規登録';
                
                // イベントハンドラーを一度だけ設定
                if (!button.dataset.stableFixed) {
                    button.dataset.stableFixed = 'true';
                    
                    // 元のonclickを削除して新しいハンドラーを設定
                    button.removeAttribute('onclick');
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (typeof showRegisterOptions === 'function') {
                            showRegisterOptions();
                        }
                    });
                }
                
                console.log('✅ 新規登録ボタン安定化完了');
            }
        });
    }
    
    function fixLoginButton() {
        const loginButtons = document.querySelectorAll('button[data-bs-target="#loginModal"], .btn-outline-light');
        
        loginButtons.forEach(button => {
            if (button.textContent.includes('ログイン') && !button.classList.contains('dropdown-toggle')) {
                // 固定テキストとクラスを設定
                button.textContent = 'ログイン';
                button.className = 'btn btn-outline-light me-2';
                
                if (!button.dataset.stableFixed) {
                    button.dataset.stableFixed = 'true';
                }
                
                console.log('✅ ログインボタン安定化完了');
            }
        });
    }
    
    function fixLanguageDropdown() {
        const langButton = document.getElementById('languageDropdown');
        
        if (langButton) {
            // 固定テキストを設定
            langButton.textContent = '日本語';
            langButton.className = 'btn btn-outline-light dropdown-toggle';
            
            if (!langButton.dataset.stableFixed) {
                langButton.dataset.stableFixed = 'true';
            }
            
            console.log('✅ 言語ドロップダウン安定化完了');
        }
    }
    
    function stopConflictingScripts() {
        // 他のスクリプトのsetIntervalを無効化（このスクリプトのものは除く）
        const originalSetInterval = window.setInterval;
        let ourIntervalId = null;
        
        window.setInterval = function(callback, delay) {
            // この関数の呼び出し元がstable-header-fixかチェック
            const stack = new Error().stack;
            if (stack && stack.includes('stable-header-fix')) {
                return originalSetInterval.call(this, callback, delay);
            }
            
            // 他のスクリプトのsetIntervalは無効化
            console.log('⚠️ 他のsetInterval無効化:', delay);
            return -1; // ダミーID
        };
        
        console.log('✅ 競合スクリプト停止完了');
    }
    
    function createStableCSS() {
        if (!document.getElementById('stable-header-css')) {
            const style = document.createElement('style');
            style.id = 'stable-header-css';
            style.textContent = `
                /* ヘッダーボタンの安定化 */
                #navbar-user-area .btn {
                    transition: none !important;
                    animation: none !important;
                }
                
                #navbar-user-area .btn-outline-light {
                    color: #fff !important;
                    border-color: #fff !important;
                }
                
                #navbar-user-area .btn-light {
                    color: #000 !important;
                    background-color: #f8f9fa !important;
                    border-color: #f8f9fa !important;
                }
                
                #languageDropdown {
                    color: #fff !important;
                    border-color: #fff !important;
                }
                
                /* アニメーション無効化 */
                .btn[data-stable-fixed="true"] {
                    animation: none !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
            console.log('✅ 安定化CSS追加完了');
        }
    }
    
    function init() {
        console.log('🚀 安定版ヘッダー修正初期化');
        
        // 安定化CSS追加
        createStableCSS();
        
        // 初回実行
        stableHeaderFix();
        
        // DOMの変更を監視（一度だけ）
        const observer = new MutationObserver((mutations) => {
            if (!headerFixed) {
                console.log('DOM変更検出、ヘッダー再修正');
                stableHeaderFix();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // 5秒後にobserverを停止（安定化後）
        setTimeout(() => {
            observer.disconnect();
            console.log('✅ ヘッダー監視停止（安定化済み）');
        }, 5000);
        
        console.log('✅ 安定版ヘッダー修正初期化完了');
    }
    
    // 実行タイミング
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('🔧 安定版ヘッダー修正スクリプト設定完了');
})();