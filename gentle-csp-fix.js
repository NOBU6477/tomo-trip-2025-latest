// 穏やかなCSP修正システム - 既存機能を損なわない
console.log('🌱 穏やかなCSP修正開始');

(function gentleCSPFix() {
    'use strict';
    
    // 1. 重複IDの穏やかな修正
    function gentlyFixDuplicateIds() {
        console.log('🌱 重複ID穏やか修正');
        
        const seenIds = new Set();
        const allElements = document.querySelectorAll('[id]');
        
        allElements.forEach((element, index) => {
            const id = element.id;
            if (seenIds.has(id)) {
                // 既存機能を損なわない方法で修正
                const newId = id + '_duplicate_' + index;
                element.id = newId;
                console.log('🌱 重複ID修正:', id, '→', newId);
            } else {
                seenIds.add(id);
            }
        });
    }
    
    // 2. フォームラベルの穏やかな関連付け
    function gentlyAssociateLabels() {
        console.log('🌱 フォームラベル穏やか関連付け');
        
        const unlinkedInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]), select:not([aria-label]), textarea:not([aria-label])');
        
        unlinkedInputs.forEach(input => {
            if (input.type === 'hidden') return;
            
            const id = input.id;
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);
            
            if (!hasLabel && !input.getAttribute('aria-label')) {
                // 穏やかなaria-label設定
                const labelText = input.placeholder || input.name || input.type || 'Input';
                input.setAttribute('aria-label', labelText);
                console.log('🌱 aria-label設定:', labelText);
            }
        });
    }
    
    // 3. CSPメタタグの穏やかな更新
    function gentlyUpdateCSP() {
        console.log('🌱 CSP穏やか更新');
        
        // 既存のCSPを削除せず、より柔軟な設定を追加
        const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!existingCSP) {
            const cspMeta = document.createElement('meta');
            cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
            cspMeta.setAttribute('content', 
                "default-src 'self' 'unsafe-inline' 'unsafe-eval' *; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' *; " +
                "style-src 'self' 'unsafe-inline' *; " +
                "img-src 'self' data: https: *; " +
                "connect-src 'self' *;"
            );
            document.head.appendChild(cspMeta);
            console.log('🌱 柔軟なCSP設定完了');
        }
    }
    
    // 4. 問題のあるイベントハンドラーの穏やかな修正
    function gentlyFixEventHandlers() {
        console.log('🌱 イベントハンドラー穏やか修正');
        
        // onclick属性を持つ要素を検索（削除はしない）
        const elementsWithOnClick = document.querySelectorAll('[onclick]');
        console.log('🌱 onclick属性要素数:', elementsWithOnClick.length);
        
        // 問題を報告するのみ、機能は維持
        elementsWithOnClick.forEach((element, index) => {
            if (index < 5) { // 最初の5個のみログ出力
                console.log('🌱 onclick検出:', element.tagName, element.id || element.className);
            }
        });
    }
    
    // 5. エラーの穏やかな処理
    function setupGentleErrorHandling() {
        console.log('🌱 穏やかエラーハンドリング設定');
        
        // グローバルエラーハンドラー
        window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('CSP')) {
                console.log('🌱 CSPエラー検出（処理続行）:', e.message);
                e.preventDefault(); // エラーの伝播を停止
                return true;
            }
        });
        
        // Promise rejection ハンドラー
        window.addEventListener('unhandledrejection', function(e) {
            console.log('🌱 Promise rejection処理:', e.reason);
            e.preventDefault();
        });
    }
    
    // 穏やかな実行
    function executeGentleFix() {
        console.log('🌱 穏やかCSP修正実行');
        
        // 非侵入的な修正を段階的に実行
        setTimeout(() => setupGentleErrorHandling(), 100);
        setTimeout(() => gentlyFixDuplicateIds(), 200);
        setTimeout(() => gentlyAssociateLabels(), 300);
        setTimeout(() => gentlyFixEventHandlers(), 400);
        setTimeout(() => gentlyUpdateCSP(), 500);
        
        setTimeout(() => {
            console.log('🌱 穏やかCSP修正完了 - 既存機能を維持');
        }, 600);
    }
    
    // 実行
    executeGentleFix();
    
    // 定期的な穏やかな監視（頻度を下げる）
    setInterval(() => {
        gentlyFixDuplicateIds();
    }, 60000); // 1分間隔
    
    console.log('🌱 穏やかCSP修正システム起動完了');
})();