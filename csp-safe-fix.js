// CSP安全対応修正システム - eval使用禁止対応

(function() {
    'use strict';
    
    console.log('CSP安全対応修正システム開始');
    
    // 1. 管理センターボタンの直接DOM操作による作成
    function createSafeManagementButton() {
        console.log('管理センターボタン安全作成開始');
        
        // 既存要素を削除
        const existing = document.getElementById('management-trigger-btn');
        if (existing) {
            existing.remove();
            console.log('既存管理ボタン削除');
        }
        
        // 安全なDOM作成（innerHTML使用せず）
        const triggerContainer = document.createElement('div');
        triggerContainer.id = 'management-trigger-btn';
        triggerContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99998;
        `;
        
        const triggerButton = document.createElement('button');
        triggerButton.textContent = '🏆';
        triggerButton.title = '管理センターを開く';
        triggerButton.style.cssText = `
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid rgba(255, 255, 255, 0.2);
        `;
        
        // 安全なイベントリスナー追加
        triggerButton.addEventListener('click', function() {
            toggleManagementPanel();
        });
        
        triggerButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.6)';
        });
        
        triggerButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
        });
        
        triggerContainer.appendChild(triggerButton);
        document.body.appendChild(triggerContainer);
        
        console.log('✅ 管理センターボタン安全作成完了');
        return triggerContainer;
    }
    
    // 2. 管理パネルの安全な作成
    function createSafeManagementPanel() {
        console.log('管理パネル安全作成開始');
        
        const existing = document.getElementById('management-center-panel');
        if (existing) {
            existing.remove();
        }
        
        const panel = document.createElement('div');
        panel.id = 'management-center-panel';
        panel.style.cssText = `
            display: none;
            position: fixed;
            bottom: 120px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 22px;
            border-radius: 20px;
            z-index: 99999;
            min-width: 300px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        `;
        
        // パネルヘッダー
        const header = document.createElement('h5');
        header.textContent = '📋 管理センター';
        header.style.margin = '0 0 15px 0';
        panel.appendChild(header);
        
        // カウンター表示
        const counterDiv = document.createElement('div');
        counterDiv.style.margin = '15px 0';
        
        const comparisonDiv = document.createElement('div');
        comparisonDiv.textContent = '比較中: ';
        const comparisonCount = document.createElement('span');
        comparisonCount.id = 'comparison-count';
        comparisonCount.textContent = '0';
        comparisonDiv.appendChild(comparisonCount);
        comparisonDiv.appendChild(document.createTextNode('/3人'));
        
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.textContent = 'ブックマーク: ';
        const bookmarkCount = document.createElement('span');
        bookmarkCount.id = 'bookmark-count';
        bookmarkCount.textContent = '0';
        bookmarkDiv.appendChild(bookmarkCount);
        bookmarkDiv.appendChild(document.createTextNode('人'));
        
        counterDiv.appendChild(comparisonDiv);
        counterDiv.appendChild(bookmarkDiv);
        panel.appendChild(counterDiv);
        
        // ボタン群
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        const createButton = (text, onclick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
            `;
            btn.addEventListener('click', onclick);
            return btn;
        };
        
        buttonContainer.appendChild(createButton('比較表示', showComparison));
        buttonContainer.appendChild(createButton('ブックマーク表示', showBookmarks));
        buttonContainer.appendChild(createButton('全て削除', clearAll));
        
        panel.appendChild(buttonContainer);
        
        // 閉じるボタン
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', toggleManagementPanel);
        panel.appendChild(closeBtn);
        
        document.body.appendChild(panel);
        console.log('✅ 管理パネル安全作成完了');
        return panel;
    }
    
    // 3. 白い枠とスタンプの強制除去
    function removeWhiteElementsAndStamps() {
        console.log('🗑️ 白い要素とスタンプ除去開始');
        
        let removedCount = 0;
        
        // 白い枠の除去
        const whiteElements = document.querySelectorAll('*');
        whiteElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // 白い背景の空要素を削除
            if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
                 styles.backgroundColor === 'white' ||
                 styles.backgroundColor === '#ffffff') &&
                rect.width < 100 && rect.height < 100 &&
                !element.textContent.trim() &&
                !element.querySelector('img, button, input, select, textarea') &&
                !element.closest('.modal') &&
                !element.closest('.navbar') &&
                !element.closest('.card') &&
                !element.id.includes('management') &&
                element.tagName !== 'HTML' &&
                element.tagName !== 'BODY') {
                
                element.remove();
                removedCount++;
            }
        });
        
        // 丸いスタンプ（円形オーバーレイ）の除去
        const circularElements = document.querySelectorAll('*');
        circularElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            
            // 円形要素を特定
            if (styles.borderRadius === '50%' || 
                styles.borderRadius.includes('50%') ||
                (element.style.borderRadius && element.style.borderRadius.includes('50%'))) {
                
                // フィルター領域内の不要な円形要素を削除
                if (element.closest('#filter-card') || 
                    element.closest('.filter-container') ||
                    (element.getBoundingClientRect().width < 50 && 
                     element.getBoundingClientRect().height < 50 &&
                     !element.textContent.trim() &&
                     !element.querySelector('img, button') &&
                     !element.id.includes('management'))) {
                    
                    element.remove();
                    removedCount++;
                    console.log('円形スタンプ削除:', element);
                }
            }
        });
        
        // 特定の問題要素をクラス名で削除
        const problematicClasses = [
            '.circular-overlay',
            '.stamp-overlay', 
            '.round-badge',
            '.circular-icon'
        ];
        
        problematicClasses.forEach(className => {
            const elements = document.querySelectorAll(className);
            elements.forEach(el => {
                if (!el.closest('#management-trigger-btn') && !el.closest('#management-center-panel')) {
                    el.remove();
                    removedCount++;
                }
            });
        });
        
        console.log(`✅ 白い要素とスタンプ除去完了: ${removedCount}個削除`);
    }
    
    // 4. フィルター機能の修復
    function fixFilterFunctionality() {
        console.log('🔧 フィルター機能修復開始');
        
        const filterBtn = document.getElementById('filterToggleBtn');
        if (filterBtn) {
            // 既存のイベントを削除
            const newFilterBtn = filterBtn.cloneNode(true);
            filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);
            
            newFilterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const filterCard = document.getElementById('filter-card');
                if (filterCard) {
                    if (filterCard.style.display === 'none' || filterCard.classList.contains('d-none')) {
                        filterCard.style.display = 'block';
                        filterCard.classList.remove('d-none');
                        newFilterBtn.textContent = 'フィルターを閉じる';
                        console.log('フィルター表示');
                    } else {
                        filterCard.style.display = 'none';
                        filterCard.classList.add('d-none'); 
                        newFilterBtn.textContent = 'ガイドを絞り込む';
                        console.log('フィルター非表示');
                    }
                }
            });
            console.log('✅ フィルタートグル修復完了');
        }
    }
    
    // 5. グローバル関数の安全な定義
    function defineSafeFunctions() {
        window.toggleManagementPanel = function() {
            const panel = document.getElementById('management-center-panel');
            if (panel) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    updateCounters();
                } else {
                    panel.style.display = 'none';
                }
            }
        };
        
        window.showComparison = function() {
            const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
            if (comparisonList.length === 0) {
                alert('比較するガイドが選択されていません');
                return;
            }
            
            let message = '比較中のガイド:\n';
            comparisonList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name} (${guide.location}) - ¥${guide.price}\n`;
            });
            alert(message);
        };
        
        window.showBookmarks = function() {
            const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
            if (bookmarkList.length === 0) {
                alert('ブックマークされたガイドはありません');
                return;
            }
            
            let message = 'ブックマーク済みガイド:\n';
            bookmarkList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name} (${guide.location}) - ¥${guide.price}\n`;
            });
            alert(message);
        };
        
        window.clearAll = function() {
            if (confirm('全ての選択を削除しますか？')) {
                localStorage.removeItem('bookmarkList');
                localStorage.removeItem('comparisonList');
                updateCounters();
                alert('全ての選択を削除しました');
            }
        };
        
        console.log('✅ 安全なグローバル関数定義完了');
    }
    
    function updateCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('bookmark-count');
        const comparisonCounter = document.getElementById('comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
    }
    
    // 初期化関数
    function initialize() {
        setTimeout(() => {
            console.log('🚀 CSP安全対応初期化開始');
            
            removeWhiteElementsAndStamps();
            createSafeManagementButton();
            createSafeManagementPanel();
            fixFilterFunctionality();
            defineSafeFunctions();
            
            // 継続的な監視（5秒間隔）
            setInterval(() => {
                removeWhiteElementsAndStamps();
                
                // 管理ボタンが消えていないかチェック
                if (!document.getElementById('management-trigger-btn')) {
                    console.log('管理ボタン再作成');
                    createSafeManagementButton();
                }
            }, 5000);
            
            console.log('✅ CSP安全対応初期化完了');
        }, 1000);
    }
    
    // 実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // 即座にも実行
    setTimeout(initialize, 100);
    
})();