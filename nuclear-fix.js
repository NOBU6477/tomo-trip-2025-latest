/**
 * 核レベルの修正スクリプト - ブラウザレベルでの強制修正
 */
(function() {
    'use strict';
    
    console.log('💥 NUCLEAR FIX 開始 - ブラウザレベル強制修正');
    
    function nuclearFix() {
        console.log('🚀 核レベル修正実行中...');
        
        // 1. 全画面の「Sign Up」を徹底的に検索・破壊
        destroyAllSignUp();
        
        // 2. スポンサーバナーを核レベルで修復
        nuclearAnimationFix();
        
        // 3. 右側ボタンを確実に配置
        forceRightButtons();
    }
    
    function destroyAllSignUp() {
        console.log('🔍 全DOM要素で Sign Up を核レベル検索中...');
        
        // すべてのテキストノードを検索
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            if (node.textContent.includes('Sign Up')) {
                textNodes.push(node);
            }
        }
        
        console.log(`🎯 ${textNodes.length}個の Sign Up テキストノードを発見`);
        
        textNodes.forEach((textNode, index) => {
            console.log(`✅ Sign Up #${index + 1} を修正:`, textNode.textContent);
            textNode.textContent = textNode.textContent.replace(/Sign Up/g, '新規登録');
        });
        
        // すべての要素のinnerHTMLもチェック
        const allElements = document.querySelectorAll('*');
        allElements.forEach((element, index) => {
            if (element.innerHTML && element.innerHTML.includes('Sign Up')) {
                console.log(`🔧 要素 #${index} の innerHTML で Sign Up を発見、修正中:`, element.tagName);
                element.innerHTML = element.innerHTML.replace(/Sign Up/g, '新規登録');
            }
            
            if (element.textContent && element.textContent.trim() === 'Sign Up') {
                console.log(`🔧 要素 #${index} の textContent で Sign Up を発見、修正中:`, element.tagName);
                element.textContent = '新規登録';
            }
            
            // 属性値もチェック
            if (element.value && element.value === 'Sign Up') {
                console.log(`🔧 要素 #${index} の value で Sign Up を発見、修正中:`, element.tagName);
                element.value = '新規登録';
            }
        });
    }
    
    function nuclearAnimationFix() {
        console.log('💣 スポンサーバナー核レベル修正開始...');
        
        const sponsorBanner = document.querySelector('.sponsor-banner');
        const sponsorScroll = document.querySelector('.sponsor-scroll');
        
        if (sponsorBanner && sponsorScroll) {
            console.log('✅ スポンサー要素発見、核レベル修正適用中');
            
            // 既存の全スタイルを完全消去
            sponsorBanner.removeAttribute('style');
            sponsorScroll.removeAttribute('style');
            
            // CSSクラスも一旦クリア
            const originalBannerClass = sponsorBanner.className;
            const originalScrollClass = sponsorScroll.className;
            
            // 核レベルでのインラインスタイル強制適用
            sponsorBanner.setAttribute('style', `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                padding: 15px 0 !important;
                overflow: hidden !important;
                position: relative !important;
                white-space: nowrap !important;
                border-bottom: 3px solid #4f46e5 !important;
                display: block !important;
                width: 100% !important;
            `);
            
            sponsorScroll.setAttribute('style', `
                display: inline-block !important;
                animation: scrollRight 30s linear infinite !important;
                white-space: nowrap !important;
                width: auto !important;
            `);
            
            // CSSクラスを復元
            sponsorBanner.className = originalBannerClass;
            sponsorScroll.className = originalScrollClass;
            
            // アニメーションキーフレームを動的に追加
            if (!document.querySelector('#nuclear-animation-keyframes')) {
                const style = document.createElement('style');
                style.id = 'nuclear-animation-keyframes';
                style.textContent = `
                    @keyframes scrollRight {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            console.log('💥 核レベルアニメーション適用完了');
            
            // 5秒後に再確認・再適用
            setTimeout(() => {
                console.log('🔄 アニメーション状態再確認中...');
                const computedStyle = window.getComputedStyle(sponsorScroll);
                console.log('現在のアニメーション状態:', computedStyle.animation);
                
                if (!computedStyle.animation || computedStyle.animation === 'none') {
                    console.log('⚠️ アニメーションが無効、再適用中...');
                    sponsorScroll.style.animation = 'scrollRight 30s linear infinite !important';
                }
            }, 5000);
            
        } else {
            console.log('❌ スポンサー要素が見つかりません');
        }
    }
    
    function forceRightButtons() {
        console.log('🔘 右側ボタン核レベル配置中...');
        
        // 既存のボタンを全て削除
        const existingButtons = document.querySelectorAll('.fixed-right-buttons, .nuclear-right-buttons');
        existingButtons.forEach(btn => {
            console.log('🗑️ 既存ボタンを削除:', btn.className);
            btn.remove();
        });
        
        // 核レベルボタンコンテナ作成
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'nuclear-right-buttons';
        buttonContainer.setAttribute('style', `
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            z-index: 99999 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 15px !important;
            pointer-events: auto !important;
        `);
        
        // 協賛店登録ボタン
        const registerBtn = document.createElement('button');
        registerBtn.innerHTML = `
            <i class="bi bi-shop" style="margin-right: 8px;"></i>
            <span>協賛店登録</span>
        `;
        registerBtn.setAttribute('style', `
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
            pointer-events: auto !important;
        `);
        
        // ログインボタン
        const loginBtn = document.createElement('button');
        loginBtn.innerHTML = `
            <i class="bi bi-box-arrow-in-right" style="margin-right: 8px;"></i>
            <span>ログイン</span>
        `;
        loginBtn.setAttribute('style', `
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
            pointer-events: auto !important;
        `);
        
        // イベントリスナー
        registerBtn.addEventListener('click', () => {
            alert('協賛店登録機能は開発中です。');
        });
        
        loginBtn.addEventListener('click', () => {
            alert('協賛店ログイン機能は開発中です。');
        });
        
        // DOM追加
        buttonContainer.appendChild(registerBtn);
        buttonContainer.appendChild(loginBtn);
        document.body.appendChild(buttonContainer);
        
        console.log('💥 核レベル右側ボタン配置完了');
    }
    
    // 即座実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', nuclearFix);
    } else {
        nuclearFix();
    }
    
    // MutationObserver で動的変更を監視
    const observer = new MutationObserver((mutations) => {
        let shouldFix = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                // 新しいSign Upが追加されたかチェック
                if (mutation.target.textContent && mutation.target.textContent.includes('Sign Up')) {
                    shouldFix = true;
                }
                mutation.addedNodes.forEach((node) => {
                    if (node.textContent && node.textContent.includes('Sign Up')) {
                        shouldFix = true;
                    }
                });
            }
        });
        
        if (shouldFix) {
            console.log('🔄 動的に Sign Up が追加されました、再修正実行...');
            setTimeout(destroyAllSignUp, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    // 定期実行（保険）
    setInterval(() => {
        const signUpCount = document.body.innerHTML.match(/Sign Up/g);
        if (signUpCount && signUpCount.length > 0) {
            console.log(`🚨 ${signUpCount.length}個の Sign Up を検出、緊急修正実行`);
            destroyAllSignUp();
        }
    }, 5000);
    
    console.log('💥 NUCLEAR FIX 設定完了 - 継続監視開始');
})();