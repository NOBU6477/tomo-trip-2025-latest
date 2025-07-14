/**
 * スクロール問題の包括的診断スクリプト
 * 多角的な原因分析とリアルタイム修正システム
 */
(function() {
    'use strict';
    
    console.log('🔍 スクロール診断システム開始');
    
    // 診断結果を保存する変数
    let diagnosticResults = {
        cssIssues: [],
        jsInterference: [],
        elementBlocking: [],
        scrollProperties: {},
        recommendations: []
    };
    
    // 1. CSS関連の問題を診断
    function diagnoseCSSIssues() {
        console.log('🎯 CSS問題診断開始');
        
        // body要素のスタイルをチェック
        const body = document.body;
        const html = document.documentElement;
        const computedBody = window.getComputedStyle(body);
        const computedHtml = window.getComputedStyle(html);
        
        // 問題のあるCSSプロパティを検出
        const problematicProperties = [
            'overflow', 'overflow-y', 'overflow-x', 'height', 'max-height', 
            'position', 'top', 'left', 'transform'
        ];
        
        problematicProperties.forEach(prop => {
            const bodyValue = computedBody[prop];
            const htmlValue = computedHtml[prop];
            
            if (bodyValue === 'hidden' || htmlValue === 'hidden') {
                diagnosticResults.cssIssues.push({
                    element: prop.includes('body') ? 'body' : 'html',
                    property: prop,
                    value: bodyValue === 'hidden' ? bodyValue : htmlValue,
                    severity: 'high'
                });
            }
        });
        
        // modal-openクラスの存在チェック
        if (body.classList.contains('modal-open')) {
            diagnosticResults.cssIssues.push({
                element: 'body',
                property: 'class',
                value: 'modal-open',
                severity: 'high'
            });
        }
        
        console.log('CSS問題:', diagnosticResults.cssIssues);
    }
    
    // 2. JavaScript干渉の診断
    function diagnoseJSInterference() {
        console.log('🎯 JavaScript干渉診断開始');
        
        // setIntervalの検出
        const originalSetInterval = window.setInterval;
        let intervalCount = 0;
        
        window.setInterval = function(...args) {
            intervalCount++;
            console.log(`🔄 setInterval検出 #${intervalCount}:`, args[0].toString().substring(0, 100));
            
            if (intervalCount > 10) {
                diagnosticResults.jsInterference.push({
                    type: 'excessive_intervals',
                    count: intervalCount,
                    severity: 'high'
                });
            }
            
            return originalSetInterval.apply(this, args);
        };
        
        // イベントリスナーの検出
        const originalAddEventListener = document.addEventListener;
        let eventListenerCount = 0;
        
        document.addEventListener = function(type, listener, options) {
            eventListenerCount++;
            if (type === 'scroll' || type === 'wheel' || type === 'touchmove') {
                diagnosticResults.jsInterference.push({
                    type: 'scroll_listener',
                    eventType: type,
                    severity: 'medium'
                });
            }
            return originalAddEventListener.apply(this, arguments);
        };
    }
    
    // 3. 要素レベルでのブロッキング要因を検出
    function diagnoseElementBlocking() {
        console.log('🎯 要素ブロッキング診断開始');
        
        // 全要素のoverflow設定をチェック
        const allElements = document.querySelectorAll('*');
        let blockingElements = [];
        
        allElements.forEach(element => {
            const computed = window.getComputedStyle(element);
            
            if (computed.overflow === 'hidden' || computed.overflowY === 'hidden') {
                blockingElements.push({
                    element: element.tagName,
                    class: element.className,
                    id: element.id,
                    overflow: computed.overflow,
                    overflowY: computed.overflowY
                });
            }
        });
        
        diagnosticResults.elementBlocking = blockingElements.slice(0, 10); // 最初の10個のみ
        console.log('ブロッキング要素:', diagnosticResults.elementBlocking);
    }
    
    // 4. 現在のスクロール状態を取得
    function getCurrentScrollProperties() {
        console.log('🎯 スクロール状態診断開始');
        
        diagnosticResults.scrollProperties = {
            canScroll: document.body.scrollHeight > window.innerHeight,
            scrollHeight: document.body.scrollHeight,
            windowHeight: window.innerHeight,
            scrollTop: window.pageYOffset || document.documentElement.scrollTop,
            scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
            bodyOverflow: window.getComputedStyle(document.body).overflow,
            htmlOverflow: window.getComputedStyle(document.documentElement).overflow
        };
        
        console.log('スクロール状態:', diagnosticResults.scrollProperties);
    }
    
    // 5. 修正推奨事項を生成
    function generateRecommendations() {
        console.log('🎯 修正推奨事項生成開始');
        
        if (diagnosticResults.cssIssues.length > 0) {
            diagnosticResults.recommendations.push('CSS overflow:hidden を修正する必要があります');
        }
        
        if (diagnosticResults.jsInterference.length > 0) {
            diagnosticResults.recommendations.push('JavaScript干渉を停止する必要があります');
        }
        
        if (!diagnosticResults.scrollProperties.canScroll) {
            diagnosticResults.recommendations.push('コンテンツの高さが不十分です');
        }
        
        console.log('修正推奨事項:', diagnosticResults.recommendations);
    }
    
    // 6. 緊急修正を実行
    function executeEmergencyFixes() {
        console.log('🚨 緊急修正実行開始');
        
        // CSS強制修正
        const emergencyCSS = document.createElement('style');
        emergencyCSS.id = 'emergency-scroll-fix';
        emergencyCSS.textContent = `
            /* 緊急スクロール修正 */
            html, body {
                overflow: auto !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                height: auto !important;
                max-height: none !important;
                position: static !important;
            }
            
            /* modal-openクラス無効化 */
            body.modal-open {
                overflow: auto !important;
                padding-right: 0 !important;
            }
            
            /* スポンサーバナー以外の要素の強制修正 */
            *:not(.sponsor-banner):not(.sponsor-scroll):not(.swiper-container):not(.swiper-wrapper) {
                overflow: visible !important;
            }
            
            /* 最小限のコンテンツ高さ確保 */
            main, .container {
                min-height: 200vh !important;
            }
        `;
        
        document.head.appendChild(emergencyCSS);
        
        // modal-openクラスの削除
        document.body.classList.remove('modal-open');
        
        // 固定ポジションの要素を修正
        const fixedElements = document.querySelectorAll('[style*="position: fixed"]');
        fixedElements.forEach(element => {
            if (!element.classList.contains('language-switcher')) {
                element.style.position = 'absolute';
            }
        });
        
        console.log('✅ 緊急修正完了');
    }
    
    // 7. 連続監視システム
    function startContinuousMonitoring() {
        console.log('🔄 連続監視システム開始');
        
        const monitoringInterval = setInterval(() => {
            const currentOverflow = window.getComputedStyle(document.body).overflow;
            const currentOverflowY = window.getComputedStyle(document.body).overflowY;
            
            if (currentOverflow === 'hidden' || currentOverflowY === 'hidden') {
                console.log('⚠️ スクロールブロック再発生 - 自動修正実行');
                executeEmergencyFixes();
            }
            
            // modal-openクラスの自動削除
            if (document.body.classList.contains('modal-open')) {
                document.body.classList.remove('modal-open');
                console.log('🔧 modal-openクラス自動削除');
            }
            
        }, 100); // 100ms間隔で監視
        
        // 10秒後に監視を停止
        setTimeout(() => {
            clearInterval(monitoringInterval);
            console.log('🛑 連続監視システム停止');
        }, 10000);
    }
    
    // メイン実行関数
    function runFullDiagnostic() {
        console.log('🚀 完全診断開始');
        
        // 段階的に診断を実行
        setTimeout(() => diagnoseCSSIssues(), 100);
        setTimeout(() => diagnoseJSInterference(), 200);
        setTimeout(() => diagnoseElementBlocking(), 300);
        setTimeout(() => getCurrentScrollProperties(), 400);
        setTimeout(() => generateRecommendations(), 500);
        setTimeout(() => executeEmergencyFixes(), 600);
        setTimeout(() => startContinuousMonitoring(), 700);
        
        // 最終レポートを5秒後に出力
        setTimeout(() => {
            console.log('📊 最終診断レポート:');
            console.log('CSS問題:', diagnosticResults.cssIssues.length);
            console.log('JS干渉:', diagnosticResults.jsInterference.length);
            console.log('ブロッキング要素:', diagnosticResults.elementBlocking.length);
            console.log('スクロール可能:', diagnosticResults.scrollProperties.canScroll);
            console.log('推奨事項:', diagnosticResults.recommendations);
        }, 5000);
    }
    
    // DOMの準備ができたら実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFullDiagnostic);
    } else {
        runFullDiagnostic();
    }
    
    // グローバルアクセス用
    window.scrollDiagnostic = {
        results: diagnosticResults,
        runDiagnostic: runFullDiagnostic,
        emergencyFix: executeEmergencyFixes
    };
    
})();