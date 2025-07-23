// 最終クリーンアップシステム - 白い四角形と重複アイコン除去

(function() {
    'use strict';
    
    console.log('最終クリーンアップシステム開始');
    
    function removeWhiteBoxes() {
        // 白い四角形を検索して削除
        const suspiciousElements = document.querySelectorAll('*');
        
        suspiciousElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // 白い背景の小さな要素をチェック
            if (computedStyle.backgroundColor === 'rgb(255, 255, 255)' || 
                computedStyle.backgroundColor === 'white' ||
                computedStyle.backgroundColor === '#ffffff' ||
                computedStyle.backgroundColor === '#fff') {
                
                // 小さくて空の要素は削除
                if (rect.width < 100 && rect.height < 100 && 
                    !element.textContent.trim() && 
                    !element.querySelector('img, button, input, select, textarea') &&
                    !element.id.includes('management') &&
                    !element.classList.contains('modal') &&
                    !element.classList.contains('card')) {
                    
                    console.log('白い四角形を削除:', element);
                    element.remove();
                }
            }
        });
        
        // 絶対位置指定の不明な白い要素を削除
        const absoluteElements = document.querySelectorAll('[style*="position:absolute"], [style*="position:fixed"]');
        absoluteElements.forEach(element => {
            const style = element.getAttribute('style') || '';
            const rect = element.getBoundingClientRect();
            
            if ((style.includes('background:white') || style.includes('background:#fff') || style.includes('background-color:white')) &&
                rect.width < 200 && rect.height < 200 &&
                !element.textContent.trim() &&
                !element.id &&
                !element.className.includes('management') &&
                !element.querySelector('img, button')) {
                
                console.log('不明な白い要素を削除:', element);
                element.remove();
            }
        });
    }
    
    function cleanupDuplicateIcons() {
        const cards = document.querySelectorAll('.guide-card, .card');
        
        cards.forEach(card => {
            // 重複するアイコンコンテナを削除
            const iconContainers = card.querySelectorAll('.guide-card-icons');
            if (iconContainers.length > 1) {
                for (let i = 1; i < iconContainers.length; i++) {
                    iconContainers[i].remove();
                }
                console.log('重複アイコンコンテナ削除:', iconContainers.length - 1);
            }
            
            // 直接的なボタン重複チェック
            const allButtons = card.querySelectorAll('button');
            const starButtons = [];
            const checkButtons = [];
            
            allButtons.forEach(btn => {
                if (btn.innerHTML.includes('⭐')) {
                    starButtons.push(btn);
                }
                if (btn.innerHTML.includes('✓')) {
                    checkButtons.push(btn);
                }
            });
            
            // ⭐ボタンが複数ある場合、2番目以降を削除
            if (starButtons.length > 1) {
                for (let i = 1; i < starButtons.length; i++) {
                    console.log('重複⭐ボタン削除');
                    starButtons[i].remove();
                }
            }
            
            // ✓ボタンが複数ある場合、2番目以降を削除
            if (checkButtons.length > 1) {
                for (let i = 1; i < checkButtons.length; i++) {
                    console.log('重複✓ボタン削除');
                    checkButtons[i].remove();
                }
            }
            
            // 丸い背景の不要なアイコンを削除
            const circularElements = card.querySelectorAll('*[style*="border-radius:50%"]');
            circularElements.forEach(element => {
                // 管理センターのトリガーボタンと新システムのボタン以外の丸い要素
                if (!element.closest('#management-trigger-btn') && 
                    !element.classList.contains('bookmark-btn') && 
                    !element.classList.contains('compare-btn') &&
                    (element.innerHTML.includes('⭐') || element.innerHTML.includes('✓'))) {
                    
                    console.log('不要な丸印削除:', element);
                    element.remove();
                }
            });
        });
    }
    
    // CSS による強制非表示
    function addCleanupCSS() {
        const style = document.createElement('style');
        style.id = 'cleanup-css';
        style.textContent = `
            /* 白い四角形オーバーレイを非表示 */
            .white-overlay,
            .white-box,
            .white-background-overlay {
                display: none !important;
            }
            
            /* 重複する丸印アイコンを非表示 */
            .guide-card *[style*="border-radius:50%"]:not(.bookmark-btn):not(.compare-btn):not(#management-trigger-btn *),
            .card *[style*="border-radius:50%"]:not(.bookmark-btn):not(.compare-btn):not(#management-trigger-btn *) {
                opacity: 0 !important;
                pointer-events: none !important;
                display: none !important;
            }
            
            /* 管理センターは新システムのみ表示 */
            #management-center-panel:not([data-new-system]) {
                display: none !important;
            }
        `;
        
        // 既存のクリーンアップCSSがあれば削除
        const existing = document.getElementById('cleanup-css');
        if (existing) existing.remove();
        
        document.head.appendChild(style);
    }
    
    // 定期クリーンアップ
    function periodicCleanup() {
        removeWhiteBoxes();
        cleanupDuplicateIcons();
        
        setTimeout(periodicCleanup, 4000);
    }
    
    // 初期化
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            addCleanupCSS();
            removeWhiteBoxes();
            cleanupDuplicateIcons();
            setTimeout(periodicCleanup, 2000);
        }, 1500);
    });
    
    // 即座に実行
    setTimeout(() => {
        addCleanupCSS();
        removeWhiteBoxes(); 
        cleanupDuplicateIcons();
    }, 800);
    
    console.log('最終クリーンアップシステム完成');
    
})();