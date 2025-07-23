// 白い四角形要素の除去システム

(function() {
    'use strict';
    
    console.log('白い四角形除去システム開始');
    
    function removeWhiteBoxes() {
        // 様々な白い背景要素を検索
        const whiteElements = document.querySelectorAll(`
            div[style*="background:white"],
            div[style*="background:#fff"],
            div[style*="background:#ffffff"],
            div[style*="background-color:white"],
            div[style*="background-color:#fff"],
            div[style*="background-color:#ffffff"],
            .white-box,
            .white-background,
            .bg-white
        `);
        
        whiteElements.forEach(element => {
            // サイズが小さく、空のdivまたは不要な白い要素を削除
            const rect = element.getBoundingClientRect();
            const hasContent = element.textContent.trim().length > 0;
            const hasImportantChildren = element.querySelector('img, button, input, select, textarea, canvas, video');
            
            // 小さな白い四角形で重要なコンテンツがない場合は削除
            if (rect.width < 200 && rect.height < 200 && !hasContent && !hasImportantChildren) {
                console.log('不要な白い要素を削除:', element);
                element.remove();
            }
            
            // 完全に透明または見えない要素も削除
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden' || computedStyle.display === 'none') {
                element.remove();
            }
        });
        
        // モーダル背景の白い要素も除去
        const modalBackdrops = document.querySelectorAll('.modal-backdrop, .modal-background');
        modalBackdrops.forEach(backdrop => {
            if (!document.querySelector('.modal.show')) {
                backdrop.remove();
            }
        });
        
        // 絶対位置指定の小さな白い要素を除去
        const absoluteElements = document.querySelectorAll('div[style*="position:absolute"], div[style*="position:fixed"]');
        absoluteElements.forEach(element => {
            const style = element.getAttribute('style') || '';
            const rect = element.getBoundingClientRect();
            
            if (style.includes('background') && 
                (style.includes('white') || style.includes('#fff')) &&
                rect.width < 100 && rect.height < 100 &&
                !element.textContent.trim() &&
                !element.querySelector('img, button, input, select')) {
                
                console.log('絶対位置指定の白い要素を削除:', element);
                element.remove();
            }
        });
    }
    
    // ガイドカードの重複アイコンを除去
    function removeDuplicateCardIcons() {
        const guideCards = document.querySelectorAll('.guide-card, .card');
        
        guideCards.forEach(card => {
            // 各カードの⭐と✓ボタンを調査
            const bookmarkBtns = card.querySelectorAll('button:contains("⭐"), .bookmark-btn, button[innerHTML*="⭐"]');
            const compareBtns = card.querySelectorAll('button:contains("✓"), .compare-btn, button[innerHTML*="✓"]');
            
            // ⭐ボタンが複数ある場合、最初のもの以外を削除
            if (bookmarkBtns.length > 1) {
                for (let i = 1; i < bookmarkBtns.length; i++) {
                    console.log('重複ブックマークボタンを削除');
                    bookmarkBtns[i].remove();
                }
            }
            
            // ✓ボタンが複数ある場合、最初のもの以外を削除
            if (compareBtns.length > 1) {
                for (let i = 1; i < compareBtns.length; i++) {
                    console.log('重複比較ボタンを削除');
                    compareBtns[i].remove();
                }
            }
            
            // 重複するアイコンコンテナを除去
            const iconContainers = card.querySelectorAll('.guide-card-icons');
            if (iconContainers.length > 1) {
                for (let i = 1; i < iconContainers.length; i++) {
                    console.log('重複アイコンコンテナを削除');
                    iconContainers[i].remove();
                }
            }
            
            // 丸印（円形背景）のアイコンを探して削除
            const circularIcons = card.querySelectorAll('*[style*="border-radius:50%"], *[style*="border-radius: 50%"]');
            circularIcons.forEach(icon => {
                const style = icon.getAttribute('style') || '';
                const innerHTML = icon.innerHTML || '';
                
                // ⭐や✓を含む丸印を削除（ただし、新システムのボタンは保持）
                if ((innerHTML.includes('⭐') || innerHTML.includes('✓')) && 
                    !icon.classList.contains('bookmark-btn') && 
                    !icon.classList.contains('compare-btn') &&
                    style.includes('border-radius:50%')) {
                    
                    console.log('不要な丸印アイコンを削除:', icon);
                    icon.remove();
                }
            });
        });
    }
    
    // CSS経由で追加された丸印を無効化
    function disableCircularIcons() {
        const style = document.createElement('style');
        style.textContent = `
            /* 不要な丸印スタイルを無効化 */
            .guide-card .circular-icon:not(.bookmark-btn):not(.compare-btn),
            .card .circular-icon:not(.bookmark-btn):not(.compare-btn) {
                display: none !important;
            }
            
            /* 重複する位置のアイコンを隠す */
            .guide-card *[style*="border-radius:50%"]:not(.bookmark-btn):not(.compare-btn):not(#management-trigger-btn *),
            .card *[style*="border-radius:50%"]:not(.bookmark-btn):not(.compare-btn):not(#management-trigger-btn *) {
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            /* 白い四角形の除去 */
            .white-overlay,
            .white-box-overlay {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 定期クリーンアップ
    function periodicCleanup() {
        removeWhiteBoxes();
        removeDuplicateCardIcons();
        
        setTimeout(periodicCleanup, 3000);
    }
    
    // 初期化
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            disableCircularIcons();
            removeWhiteBoxes();
            removeDuplicateCardIcons();
            setTimeout(periodicCleanup, 2000);
        }, 1000);
    });
    
    // 即座に実行
    setTimeout(() => {
        disableCircularIcons();
        removeWhiteBoxes();
        removeDuplicateCardIcons();
    }, 500);
    
    console.log('白い四角形除去システム完了');
    
})();