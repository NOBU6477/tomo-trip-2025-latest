/**
 * 最終修正スクリプト - 3つの問題を確実に解決
 * 英語版混入阻止 + スポンサーアニメーション + ボタン配置
 */
(function() {
    'use strict';
    
    console.log('🎯 FINAL FIX 開始 - 最終解決スクリプト');
    
    // ページの言語を確認
    const currentLang = document.documentElement.lang || 'ja';
    console.log('現在のページ言語:', currentLang);
    
    function finalFix() {
        console.log('🚀 最終修正実行中...');
        
        // 1. 英語版コンテンツの混入を阻止
        blockEnglishContent();
        
        // 2. スポンサーバナーアニメーション確実実行
        ensureSponsorAnimation();
        
        // 3. 右側ボタンの確実配置
        ensureRightButtons();
    }
    
    function blockEnglishContent() {
        console.log('🚫 英語版コンテンツ混入阻止中...');
        
        // Sign Up を完全に日本語に置換
        const allTextNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('Sign Up')) {
                allTextNodes.push(node);
            }
        }
        
        allTextNodes.forEach((textNode) => {
            console.log('✅ Sign Up テキストを修正:', textNode.textContent);
            textNode.textContent = textNode.textContent.replace(/Sign Up/g, '新規登録');
        });
        
        // すべての要素をスキャン
        document.querySelectorAll('*').forEach((element) => {
            if (element.innerHTML && element.innerHTML.includes('Sign Up')) {
                element.innerHTML = element.innerHTML.replace(/Sign Up/g, '新規登録');
            }
            
            if (element.textContent && element.textContent.trim() === 'Sign Up') {
                element.textContent = '新規登録';
            }
            
            if (element.value && element.value === 'Sign Up') {
                element.value = '新規登録';
            }
        });
        
        console.log('✅ 英語版コンテンツ混入阻止完了');
    }
    
    function ensureSponsorAnimation() {
        console.log('🎬 スポンサーアニメーション確実実行中...');
        
        const sponsorBanner = document.getElementById('main-sponsor-banner');
        const sponsorScroll = document.getElementById('main-sponsor-scroll');
        
        if (sponsorBanner && sponsorScroll) {
            console.log('✅ メインスポンサー要素発見');
            
            // 動的CSSキーフレーム追加
            if (!document.getElementById('sponsor-animation-css')) {
                const style = document.createElement('style');
                style.id = 'sponsor-animation-css';
                style.textContent = `
                    @keyframes scrollRight {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                    }
                    
                    #main-sponsor-banner {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        padding: 15px 0 !important;
                        overflow: hidden !important;
                        position: relative !important;
                        white-space: nowrap !important;
                        border-bottom: 3px solid #4f46e5 !important;
                        display: block !important;
                        width: 100% !important;
                    }
                    
                    #main-sponsor-scroll {
                        display: inline-block !important;
                        animation: scrollRight 30s linear infinite !important;
                        white-space: nowrap !important;
                        width: auto !important;
                    }
                `;
                document.head.appendChild(style);
                console.log('✅ スポンサーアニメーションCSS追加完了');
            }
            
            // フォールバック：インラインスタイルでも強制適用
            sponsorBanner.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                padding: 15px 0 !important;
                overflow: hidden !important;
                position: relative !important;
                white-space: nowrap !important;
                border-bottom: 3px solid #4f46e5 !important;
                display: block !important;
                width: 100% !important;
            `;
            
            sponsorScroll.style.cssText = `
                display: inline-block !important;
                animation: scrollRight 30s linear infinite !important;
                white-space: nowrap !important;
                width: auto !important;
            `;
            
            console.log('✅ スポンサーアニメーション強制適用完了');
            
        } else {
            console.log('❌ メインスポンサー要素が見つかりません');
        }
    }
    
    function ensureRightButtons() {
        console.log('🔘 右側ボタン確実配置中...');
        
        // 既存のボタンエリアをチェック
        const existingButtons = document.querySelector('.nuclear-right-buttons, .fixed-right-buttons');
        
        if (!existingButtons) {
            console.log('🆕 右側ボタンが未配置、新規作成中...');
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'final-right-buttons';
            buttonContainer.style.cssText = `
                position: fixed !important;
                top: 50% !important;
                right: 20px !important;
                transform: translateY(-50%) !important;
                z-index: 99999 !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 15px !important;
                pointer-events: auto !important;
            `;
            
            // 協賛店登録ボタン
            const registerBtn = document.createElement('button');
            registerBtn.innerHTML = `
                <i class="bi bi-shop" style="margin-right: 8px;"></i>
                <span>協賛店登録</span>
            `;
            registerBtn.style.cssText = `
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%) !important;
                border: none !important;
                color: white !important;
                padding: 12px 18px !important;
                border-radius: 25px !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3) !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                white-space: nowrap !important;
            `;
            
            // ログインボタン
            const loginBtn = document.createElement('button');
            loginBtn.innerHTML = `
                <i class="bi bi-box-arrow-in-right" style="margin-right: 8px;"></i>
                <span>ログイン</span>
            `;
            loginBtn.style.cssText = `
                background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%) !important;
                border: none !important;
                color: white !important;
                padding: 12px 18px !important;
                border-radius: 25px !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3) !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                white-space: nowrap !important;
            `;
            
            // イベントリスナー
            registerBtn.addEventListener('click', () => {
                alert('協賛店登録機能は開発中です。');
            });
            
            loginBtn.addEventListener('click', () => {
                alert('協賛店ログイン機能は開発中です。');
            });
            
            buttonContainer.appendChild(registerBtn);
            buttonContainer.appendChild(loginBtn);
            document.body.appendChild(buttonContainer);
            
            console.log('✅ 右側ボタン新規配置完了');
        } else {
            console.log('✅ 右側ボタンは既に配置済み');
        }
    }
    
    // 実行タイミング
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', finalFix);
    } else {
        finalFix();
    }
    
    // 英語版混入を継続監視
    const observer = new MutationObserver((mutations) => {
        let needsFixing = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                if (mutation.target.textContent && mutation.target.textContent.includes('Sign Up')) {
                    needsFixing = true;
                }
                mutation.addedNodes.forEach((node) => {
                    if (node.textContent && node.textContent.includes('Sign Up')) {
                        needsFixing = true;
                    }
                });
            }
        });
        
        if (needsFixing) {
            console.log('🚨 英語版混入検出、緊急修正実行');
            setTimeout(blockEnglishContent, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    // 定期的な保険実行
    setInterval(() => {
        const signUpElements = document.body.innerHTML.match(/Sign Up/g);
        if (signUpElements && signUpElements.length > 0) {
            console.log(`🚨 ${signUpElements.length}個のSign Up混入を検出、修正実行`);
            blockEnglishContent();
        }
    }, 3000);
    
    // 追加の保険実行
    setTimeout(finalFix, 1000);
    setTimeout(finalFix, 3000);
    setTimeout(finalFix, 5000);
    
    console.log('🎯 FINAL FIX 設定完了 - 継続監視開始');
})();