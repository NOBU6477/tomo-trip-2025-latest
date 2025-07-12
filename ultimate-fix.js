/**
 * 究極の修正スクリプト - 3つの問題を確実に解決
 */
(function() {
    'use strict';
    
    console.log('🚀 究極修正スクリプト開始');
    
    function ultimateFix() {
        console.log('🔧 修正処理実行中...');
        
        // 1. 言語切り替えエリアの「Sign Up」を修正
        fixLanguageSwitcher();
        
        // 2. スポンサーバナーアニメーション強制開始
        forceAnimationStart();
        
        // 3. 右側ボタンエリア追加
        addRightSideButtons();
    }
    
    function fixLanguageSwitcher() {
        console.log('🌐 言語切り替えエリアをチェック中...');
        
        // Language Switcherエリアを探す
        const languageSwitcher = document.querySelector('.language-switcher');
        if (languageSwitcher) {
            const buttons = languageSwitcher.querySelectorAll('button, a');
            buttons.forEach(btn => {
                if (btn.textContent && btn.textContent.trim() === 'Sign Up') {
                    console.log('✅ Sign Upボタンを発見、修正中:', btn);
                    btn.textContent = '新規登録';
                }
            });
        }
        
        // すべての要素を検索
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            // テキストノードのみをチェック
            if (element.children.length === 0 && element.textContent) {
                const text = element.textContent.trim();
                if (text === 'Sign Up') {
                    console.log('✅ Sign Up要素を発見、修正中:', element);
                    element.textContent = '新規登録';
                }
            }
        });
    }
    
    function forceAnimationStart() {
        console.log('🎬 スポンサーアニメーション強制開始...');
        
        const sponsorBanner = document.querySelector('.sponsor-banner');
        const sponsorScroll = document.querySelector('.sponsor-scroll');
        
        if (sponsorBanner && sponsorScroll) {
            console.log('✅ スポンサー要素発見、アニメーション適用中');
            
            // 既存のスタイルをクリア
            sponsorBanner.style.cssText = '';
            sponsorScroll.style.cssText = '';
            
            // 強制的にスタイル適用
            sponsorBanner.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 15px 0;
                overflow: hidden !important;
                position: relative;
                white-space: nowrap !important;
                border-bottom: 3px solid #4f46e5;
            `;
            
            sponsorScroll.style.cssText = `
                display: inline-block !important;
                animation: scrollRight 30s linear infinite !important;
                white-space: nowrap !important;
            `;
            
            console.log('✅ アニメーション強制適用完了');
        } else {
            console.log('❌ スポンサー要素が見つかりません');
        }
    }
    
    function addRightSideButtons() {
        console.log('🔘 右側ボタンエリア追加中...');
        
        // 既存のボタンエリアを削除
        const existingButtons = document.querySelectorAll('.fixed-right-buttons');
        existingButtons.forEach(btn => btn.remove());
        
        // 新しいボタンエリアを作成
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'fixed-right-buttons';
        buttonContainer.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        
        // 協賛店登録ボタン
        const registerBtn = document.createElement('button');
        registerBtn.innerHTML = `
            <i class="bi bi-shop" style="margin-right: 8px;"></i>
            <span>協賛店登録</span>
        `;
        registerBtn.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
            border: none;
            color: white;
            padding: 12px 18px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            white-space: nowrap;
        `;
        
        // ログインボタン
        const loginBtn = document.createElement('button');
        loginBtn.innerHTML = `
            <i class="bi bi-box-arrow-in-right" style="margin-right: 8px;"></i>
            <span>ログイン</span>
        `;
        loginBtn.style.cssText = `
            background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
            border: none;
            color: white;
            padding: 12px 18px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            white-space: nowrap;
        `;
        
        // ホバー効果
        registerBtn.addEventListener('mouseenter', () => {
            registerBtn.style.transform = 'translateY(-2px)';
            registerBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
        });
        
        registerBtn.addEventListener('mouseleave', () => {
            registerBtn.style.transform = 'translateY(0)';
            registerBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
        });
        
        loginBtn.addEventListener('mouseenter', () => {
            loginBtn.style.transform = 'translateY(-2px)';
            loginBtn.style.boxShadow = '0 6px 20px rgba(78, 205, 196, 0.4)';
        });
        
        loginBtn.addEventListener('mouseleave', () => {
            loginBtn.style.transform = 'translateY(0)';
            loginBtn.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.3)';
        });
        
        // クリックイベント
        registerBtn.addEventListener('click', () => {
            alert('協賛店登録機能は開発中です。');
        });
        
        loginBtn.addEventListener('click', () => {
            alert('協賛店ログイン機能は開発中です。');
        });
        
        // ボタンを追加
        buttonContainer.appendChild(registerBtn);
        buttonContainer.appendChild(loginBtn);
        document.body.appendChild(buttonContainer);
        
        console.log('✅ 右側ボタンエリア追加完了');
    }
    
    // 即座に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ultimateFix);
    } else {
        ultimateFix();
    }
    
    // 追加の保険実行
    setTimeout(ultimateFix, 1000);
    setTimeout(ultimateFix, 3000);
    setTimeout(ultimateFix, 5000);
    
    console.log('🎯 究極修正スクリプト設定完了');
})();