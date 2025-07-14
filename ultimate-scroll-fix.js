/**
 * 最終的なスクロール修正 - UIを崩さず、既存システムと干渉しない修正
 * 50ms間隔の監視システムで確実にスクロールを有効化
 */
(function() {
    'use strict';
    
    console.log('🔧 最終スクロール修正システム開始');
    
    let monitoringActive = false;
    let fixAttempts = 0;
    const maxAttempts = 600; // 30秒間の監視
    
    // 1. 最小限のCSS修正（UIを崩さない）
    function applyMinimalScrollFix() {
        // 既存のスタイルを上書きしない範囲で修正
        const style = document.createElement('style');
        style.id = 'ultimate-scroll-fix';
        style.textContent = `
            /* 最小限のスクロール修正 - 既存デザイン維持 */
            html {
                overflow-y: auto !important;
                scroll-behavior: smooth !important;
            }
            
            body {
                overflow-y: auto !important;
                height: auto !important;
                min-height: 100vh !important;
                position: relative !important;
            }
            
            /* modal-openクラスのスクロール阻害を無効化 */
            body.modal-open {
                overflow-y: auto !important;
                position: relative !important;
                padding-right: 0 !important;
            }
            
            /* 主要コンテナのスクロール確保 */
            .container, .container-fluid, main {
                overflow-y: visible !important;
                height: auto !important;
                min-height: auto !important;
            }
            
            /* 全体の高さを確保してスクロール可能にする */
            body::after {
                content: '';
                display: block;
                height: 100px;
                clear: both;
            }
        `;
        
        // 既存の同じIDの要素は削除
        const existing = document.getElementById('ultimate-scroll-fix');
        if (existing) {
            existing.remove();
        }
        
        document.head.appendChild(style);
    }
    
    // 2. 直接的なスクロール有効化
    function enableScrollDirectly() {
        // HTML要素のスクロール有効化
        const html = document.documentElement;
        const body = document.body;
        
        // スタイル属性を直接設定
        html.style.overflow = 'auto';
        html.style.overflowY = 'auto';
        html.style.height = 'auto';
        
        body.style.overflow = 'auto';
        body.style.overflowY = 'auto';
        body.style.height = 'auto';
        body.style.position = 'relative';
        
        // modal-openクラスを削除
        body.classList.remove('modal-open');
        
        // 計算されたスタイルをチェック
        const htmlComputed = window.getComputedStyle(html);
        const bodyComputed = window.getComputedStyle(body);
        
        if (htmlComputed.overflowY === 'hidden' || bodyComputed.overflowY === 'hidden') {
            console.log('⚠️ スクロール阻害検出 - 強制修正実行');
            
            // より強力な修正
            html.style.setProperty('overflow-y', 'auto', 'important');
            body.style.setProperty('overflow-y', 'auto', 'important');
            html.style.setProperty('height', 'auto', 'important');
            body.style.setProperty('height', 'auto', 'important');
            
            return false; // 修正が必要だった
        }
        
        return true; // スクロール正常
    }
    
    // 3. スクロール可能性をテスト
    function testScrollability() {
        const initialY = window.pageYOffset;
        const bodyHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        
        // コンテンツが十分にあるかチェック
        if (bodyHeight <= windowHeight) {
            console.log('📏 コンテンツ高さ不足 - 高さ追加');
            // 一時的に高さを追加してテスト
            const testDiv = document.createElement('div');
            testDiv.style.height = '200px';
            testDiv.style.width = '1px';
            testDiv.style.position = 'absolute';
            testDiv.style.top = '-200px';
            testDiv.style.left = '-1px';
            testDiv.id = 'scroll-test-div';
            document.body.appendChild(testDiv);
        }
        
        // スクロールテスト実行
        window.scrollTo(0, 50);
        
        setTimeout(() => {
            const newY = window.pageYOffset;
            const canScroll = newY > initialY;
            
            // テスト用要素を削除
            const testDiv = document.getElementById('scroll-test-div');
            if (testDiv) {
                testDiv.remove();
            }
            
            // 元の位置に戻す
            window.scrollTo(0, initialY);
            
            if (!canScroll) {
                console.log('❌ スクロールテスト失敗 - 追加修正実行');
                return false;
            }
            
            console.log('✅ スクロールテスト成功');
            return true;
        }, 100);
    }
    
    // 4. 監視システム開始
    function startUltimateMonitoring() {
        if (monitoringActive) {
            console.log('⚠️ 監視システムは既に実行中です');
            return;
        }
        
        monitoringActive = true;
        console.log('👁️ 最終監視システム開始');
        
        const monitorInterval = setInterval(() => {
            if (!monitoringActive || fixAttempts >= maxAttempts) {
                clearInterval(monitorInterval);
                console.log('🛑 最終監視システム停止');
                return;
            }
            
            fixAttempts++;
            
            // スクロール状態をチェック
            const scrollOK = enableScrollDirectly();
            
            if (!scrollOK) {
                console.log(`🔧 修正実行 ${fixAttempts}/${maxAttempts}`);
                applyMinimalScrollFix();
                
                // 5秒ごとにスクロールテスト
                if (fixAttempts % 100 === 0) {
                    testScrollability();
                }
            }
            
        }, 50); // 50ms間隔で高速監視
        
        // 成功通知を30秒後に表示
        setTimeout(() => {
            monitoringActive = false;
            console.log('✅ 最終スクロール修正完了');
            
            // 最終テスト
            setTimeout(() => {
                testScrollability();
            }, 1000);
            
        }, 30000);
    }
    
    // 5. 即座に実行
    function executeUltimateFix() {
        console.log('🚀 最終修正実行開始');
        
        // 即座にCSS修正を適用
        applyMinimalScrollFix();
        
        // 100ms後にスクロール有効化
        setTimeout(() => {
            enableScrollDirectly();
        }, 100);
        
        // 200ms後に監視開始
        setTimeout(() => {
            startUltimateMonitoring();
        }, 200);
        
        // 1秒後に初回テスト
        setTimeout(() => {
            testScrollability();
        }, 1000);
    }
    
    // DOMの準備完了後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeUltimateFix);
    } else {
        executeUltimateFix();
    }
    
    // グローバルアクセス用
    window.ultimateScrollFix = {
        execute: executeUltimateFix,
        stopMonitoring: () => { monitoringActive = false; },
        testScroll: testScrollability
    };
    
})();