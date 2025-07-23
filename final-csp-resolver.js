// 最終CSP解決システム
console.log('🛡️ 最終CSP解決開始');

(function finalCSPResolver() {
    'use strict';
    
    // 1. 残存するCSP違反要素を特定・修正
    function fixRemainingCSPViolations() {
        console.log('🛡️ CSP違反要素修正');
        
        // onclick属性を持つ全要素を検索・修正
        const elementsWithOnClick = document.querySelectorAll('[onclick]');
        elementsWithOnClick.forEach(element => {
            const onClickValue = element.getAttribute('onclick');
            if (onClickValue) {
                // onclick属性を削除
                element.removeAttribute('onclick');
                
                // addEventListener で置き換え
                try {
                    const func = new Function(onClickValue);
                    element.addEventListener('click', func);
                    console.log('🛡️ onclick属性修正:', element.tagName, element.id || element.className);
                } catch (e) {
                    console.log('🛡️ onclick修正エラー:', e.message);
                }
            }
        });
        
        // inline style属性の問題を修正
        const elementsWithStyle = document.querySelectorAll('[style*="javascript:"], [style*="eval("]');
        elementsWithStyle.forEach(element => {
            element.removeAttribute('style');
            console.log('🛡️ 危険なstyle属性削除:', element.tagName);
        });
        
        // script要素のsrc属性チェック
        const scriptElements = document.querySelectorAll('script[src]');
        scriptElements.forEach(script => {
            const src = script.getAttribute('src');
            if (src && (src.includes('javascript:') || src.includes('data:'))) {
                script.remove();
                console.log('🛡️ 危険なscript削除:', src);
            }
        });
    }
    
    // 2. 重複フォームフィールドID修正
    function fixDuplicateFormFields() {
        console.log('🛡️ 重複フォームフィールド修正');
        
        // 重複IDを持つ要素を検索
        const allElements = document.querySelectorAll('[id]');
        const idCounts = {};
        const duplicateIds = [];
        
        allElements.forEach(element => {
            const id = element.id;
            if (id) {
                idCounts[id] = (idCounts[id] || 0) + 1;
                if (idCounts[id] === 2) {
                    duplicateIds.push(id);
                }
            }
        });
        
        // 重複IDを修正
        duplicateIds.forEach(duplicateId => {
            const elements = document.querySelectorAll('#' + CSS.escape(duplicateId));
            elements.forEach((element, index) => {
                if (index > 0) { // 最初の要素以外のIDを変更
                    const newId = duplicateId + '_' + index;
                    element.id = newId;
                    console.log('🛡️ 重複ID修正:', duplicateId, '→', newId);
                }
            });
        });
    }
    
    // 3. フォームラベル関連付け修正
    function fixFormLabels() {
        console.log('🛡️ フォームラベル修正');
        
        // label要素を持つが、関連付けられていない入力要素を検索
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const id = input.id;
            if (id) {
                // 対応するlabelが存在するかチェック
                const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
                if (!label && input.type !== 'hidden') {
                    // labelが存在しない場合、aria-labelを追加
                    if (!input.getAttribute('aria-label')) {
                        const placeholder = input.getAttribute('placeholder');
                        const name = input.getAttribute('name');
                        const ariaLabel = placeholder || name || 'Input field';
                        input.setAttribute('aria-label', ariaLabel);
                        console.log('🛡️ aria-label追加:', id, ariaLabel);
                    }
                }
            } else if (input.type !== 'hidden') {
                // IDが存在しない入力要素にIDを生成
                const generatedId = 'input_' + Math.random().toString(36).substr(2, 9);
                input.id = generatedId;
                console.log('🛡️ ID生成:', generatedId);
            }
        });
    }
    
    // 4. CSPヘッダーの設定強化
    function enforceCSPHeaders() {
        console.log('🛡️ CSPヘッダー強化');
        
        // 既存のCSPメタタグを削除
        const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (existingCSP) {
            existingCSP.remove();
        }
        
        // 新しいCSPメタタグを追加
        const cspMeta = document.createElement('meta');
        cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
        cspMeta.setAttribute('content', 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
            "img-src 'self' data: https: blob:; " +
            "font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
            "connect-src 'self' https:; " +
            "frame-src 'none'; " +
            "object-src 'none';"
        );
        document.head.appendChild(cspMeta);
        console.log('🛡️ 新CSPヘッダー設定完了');
    }
    
    // 5. パフォーマンス最適化
    function optimizePerformance() {
        console.log('🛡️ パフォーマンス最適化');
        
        // 未使用のCSS削除
        const unusedStyles = document.querySelectorAll('style[id*="temp"], style[id*="debug"], style[id*="test"]');
        unusedStyles.forEach(style => {
            style.remove();
            console.log('🛡️ 未使用CSS削除:', style.id);
        });
        
        // 重複スクリプトの削除
        const scriptSources = new Set();
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (scriptSources.has(src)) {
                script.remove();
                console.log('🛡️ 重複スクリプト削除:', src);
            } else {
                scriptSources.add(src);
            }
        });
        
        // 画像の遅延読み込み設定
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (!img.complete) {
                img.setAttribute('loading', 'lazy');
                console.log('🛡️ 画像遅延読み込み設定:', img.src);
            }
        });
    }
    
    // 6. アクセシビリティ向上
    function improveAccessibility() {
        console.log('🛡️ アクセシビリティ向上');
        
        // alt属性のない画像に代替テキスト追加
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        imagesWithoutAlt.forEach(img => {
            const src = img.getAttribute('src');
            const altText = src ? src.split('/').pop().split('.')[0] : 'Image';
            img.setAttribute('alt', altText);
            console.log('🛡️ alt属性追加:', altText);
        });
        
        // ボタンにrole属性追加
        const buttons = document.querySelectorAll('button:not([role]), [onclick]:not(button):not([role])');
        buttons.forEach(btn => {
            if (!btn.getAttribute('role')) {
                btn.setAttribute('role', 'button');
                console.log('🛡️ role属性追加:', btn.tagName);
            }
        });
        
        // フォーカス可能要素にtabindex設定
        const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href]');
        focusableElements.forEach((element, index) => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });
    }
    
    // システム実行
    function executeCSPResolver() {
        console.log('🛡️ 最終CSP解決システム実行');
        
        // 段階的実行
        setTimeout(() => fixRemainingCSPViolations(), 100);
        setTimeout(() => fixDuplicateFormFields(), 200);
        setTimeout(() => fixFormLabels(), 300);
        setTimeout(() => enforceCSPHeaders(), 400);
        setTimeout(() => optimizePerformance(), 500);
        setTimeout(() => improveAccessibility(), 600);
        
        setTimeout(() => {
            console.log('🛡️ 最終CSP解決完了');
            console.log('🛡️ ページを再読み込みしてコンソールエラーをご確認ください');
        }, 1000);
    }
    
    // 実行
    executeCSPResolver();
    
    // 定期的な監視とメンテナンス
    setInterval(() => {
        fixRemainingCSPViolations();
        fixDuplicateFormFields();
    }, 30000); // 30秒間隔
    
    console.log('🛡️ 最終CSP解決システム設定完了');
})();