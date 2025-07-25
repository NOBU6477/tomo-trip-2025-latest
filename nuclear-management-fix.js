// 核レベル管理システム修正 - 全競合を排除

(function() {
    'use strict';
    
    console.log('🚀 核レベル管理システム修正開始');
    
    // 1. 全競合要素の完全削除
    function destroyCompetingElements() {
        console.log('競合要素削除開始');
        
        // 既存の管理要素をすべて削除
        const existingManagement = document.querySelectorAll('[id*="management"], [class*="management"], [id*="trigger"], [class*="trigger"]');
        existingManagement.forEach(el => {
            if (!el.closest('script')) {
                el.remove();
                console.log('競合管理要素削除:', el.id || el.className);
            }
        });
        
        // 白い要素の強制削除
        const whiteElements = document.querySelectorAll('*');
        let removedCount = 0;
        whiteElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
                 styles.backgroundColor === 'white' ||
                 styles.backgroundColor === '#ffffff') &&
                rect.width > 0 && rect.width < 200 && 
                rect.height > 0 && rect.height < 200 &&
                !element.textContent.trim() &&
                !element.querySelector('img, button, input, select, textarea, canvas, svg') &&
                !element.closest('.modal') &&
                !element.closest('.navbar') &&
                !element.closest('.card') &&
                !element.closest('.hero-section') &&
                element.tagName !== 'HTML' &&
                element.tagName !== 'BODY' &&
                element.tagName !== 'HEAD') {
                
                element.remove();
                removedCount++;
            }
        });
        
        // 円形スタンプの削除
        const circularElements = document.querySelectorAll('*');
        circularElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            
            if ((styles.borderRadius === '50%' || 
                 styles.borderRadius.includes('50%') ||
                 (element.style.borderRadius && element.style.borderRadius.includes('50%'))) &&
                element.getBoundingClientRect().width < 60 &&
                element.getBoundingClientRect().height < 60 &&
                !element.textContent.includes('🏆') &&
                !element.querySelector('img') &&
                element.closest('#filter-card, .filter-container, .filter-area')) {
                
                element.remove();
                removedCount++;
                console.log('円形スタンプ削除');
            }
        });
        
        console.log(`✅ 競合要素削除完了: ${removedCount}個削除`);
    }
    
    // 2. 核レベル管理ボタン作成
    function createNuclearManagementButton() {
        console.log('核レベル管理ボタン作成開始');
        
        // 既存削除
        const existing = document.getElementById('nuclear-management-trigger');
        if (existing) existing.remove();
        
        // コンテナ作成
        const container = document.createElement('div');
        container.id = 'nuclear-management-trigger';
        container.style.cssText = `
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 999999 !important;
            width: 70px !important;
            height: 70px !important;
        `;
        
        // ボタン作成
        const button = document.createElement('button');
        button.textContent = '🏆';
        button.id = 'nuclear-trigger-btn';
        button.style.cssText = `
            width: 100% !important;
            height: 100% !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #4CAF50, #45a049) !important;
            border: 3px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            font-size: 28px !important;
            cursor: pointer !important;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4) !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            outline: none !important;
        `;
        
        // イベントリスナー
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleNuclearPanel();
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15)';
            this.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.6)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
        });
        
        container.appendChild(button);
        document.body.appendChild(container);
        
        console.log('✅ 核レベル管理ボタン作成完了');
        return container;
    }
    
    // 3. 核レベル管理パネル作成
    function createNuclearManagementPanel() {
        console.log('核レベル管理パネル作成開始');
        
        const existing = document.getElementById('nuclear-management-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'nuclear-management-panel';
        panel.style.cssText = `
            display: none !important;
            position: fixed !important;
            bottom: 120px !important;
            right: 20px !important;
            background: linear-gradient(135deg, #4CAF50, #45a049) !important;
            color: white !important;
            padding: 25px !important;
            border-radius: 20px !important;
            z-index: 999998 !important;
            min-width: 320px !important;
            text-align: center !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.4) !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
        `;
        
        // ヘッダー
        const header = document.createElement('h5');
        header.textContent = '📋 管理センター';
        header.style.cssText = 'margin: 0 0 20px 0 !important; font-size: 18px !important;';
        panel.appendChild(header);
        
        // カウンター表示エリア
        const counterArea = document.createElement('div');
        counterArea.style.cssText = 'margin: 15px 0 20px 0 !important; padding: 15px !important; background: rgba(255,255,255,0.1) !important; border-radius: 10px !important;';
        
        const comparisonInfo = document.createElement('div');
        comparisonInfo.style.cssText = 'margin-bottom: 8px !important; font-size: 14px !important;';
        comparisonInfo.innerHTML = '比較中: <span id="nuclear-comparison-count" style="font-weight: bold; color: #ffeb3b;">0</span>/3人';
        
        const bookmarkInfo = document.createElement('div');
        bookmarkInfo.style.cssText = 'font-size: 14px !important;';
        bookmarkInfo.innerHTML = 'ブックマーク: <span id="nuclear-bookmark-count" style="font-weight: bold; color: #ffeb3b;">0</span>人';
        
        counterArea.appendChild(comparisonInfo);
        counterArea.appendChild(bookmarkInfo);
        panel.appendChild(counterArea);
        
        // ボタンエリア
        const buttonArea = document.createElement('div');
        buttonArea.style.cssText = 'display: flex !important; flex-direction: column !important; gap: 12px !important;';
        
        const createActionButton = (text, action, bgColor = 'rgba(255,255,255,0.2)') => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                background: ${bgColor} !important;
                border: none !important;
                color: white !important;
                padding: 12px 20px !important;
                border-radius: 10px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                transition: all 0.3s ease !important;
            `;
            btn.addEventListener('click', action);
            btn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255,255,255,0.3)';
                this.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.background = bgColor;
                this.style.transform = 'translateY(0)';
            });
            return btn;
        };
        
        buttonArea.appendChild(createActionButton('比較表示', showNuclearComparison));
        buttonArea.appendChild(createActionButton('ブックマーク表示', showNuclearBookmarks));
        buttonArea.appendChild(createActionButton('全て削除', clearNuclearAll, 'rgba(255,0,0,0.4)'));
        
        panel.appendChild(buttonArea);
        
        // 閉じるボタン
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute !important;
            top: 8px !important;
            right: 12px !important;
            background: none !important;
            border: none !important;
            color: white !important;
            font-size: 20px !important;
            cursor: pointer !important;
            width: 30px !important;
            height: 30px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        `;
        closeBtn.addEventListener('click', toggleNuclearPanel);
        panel.appendChild(closeBtn);
        
        document.body.appendChild(panel);
        console.log('✅ 核レベル管理パネル作成完了');
        return panel;
    }
    
    // 4. フィルター機能の核レベル修復
    function fixNuclearFilter() {
        console.log('核レベルフィルター修復開始');
        
        const filterBtn = document.getElementById('filterToggleBtn');
        if (filterBtn) {
            // 全イベントを削除して新しく設定
            const newBtn = filterBtn.cloneNode(true);
            filterBtn.parentNode.replaceChild(newBtn, filterBtn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const filterCard = document.getElementById('filter-card');
                if (filterCard) {
                    const isHidden = filterCard.style.display === 'none' || filterCard.classList.contains('d-none');
                    
                    if (isHidden) {
                        filterCard.style.display = 'block';
                        filterCard.classList.remove('d-none');
                        newBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
                        console.log('フィルター表示');
                    } else {
                        filterCard.style.display = 'none';
                        filterCard.classList.add('d-none');
                        newBtn.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込む';
                        console.log('フィルター非表示');
                    }
                }
            });
            
            console.log('✅ 核レベルフィルター修復完了');
        }
    }
    
    // 5. グローバル関数定義
    function defineNuclearFunctions() {
        window.toggleNuclearPanel = function() {
            const panel = document.getElementById('nuclear-management-panel');
            if (panel) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    updateNuclearCounters();
                } else {
                    panel.style.display = 'none';
                }
            }
        };
        
        window.showNuclearComparison = function() {
            const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
            if (comparisonList.length === 0) {
                alert('比較するガイドが選択されていません。\n\nガイドカードの✓アイコンをクリックして比較対象を選択してください。');
                return;
            }
            
            let message = '【比較中のガイド】\n\n';
            comparisonList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name}\n`;
                message += `   📍 ${guide.location}\n`;
                message += `   💰 ¥${guide.price}/セッション\n`;
                message += `   ⭐ ${guide.rating || '4.5'}★\n\n`;
            });
            alert(message);
        };
        
        window.showNuclearBookmarks = function() {
            const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
            if (bookmarkList.length === 0) {
                alert('ブックマークされたガイドはありません。\n\nガイドカードの⭐アイコンをクリックしてブックマークに追加してください。');
                return;
            }
            
            let message = '【ブックマーク済みガイド】\n\n';
            bookmarkList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name}\n`;
                message += `   📍 ${guide.location}\n`;
                message += `   💰 ¥${guide.price}/セッション\n`;
                message += `   ⭐ ${guide.rating || '4.5'}★\n\n`;
            });
            alert(message);
        };
        
        window.clearNuclearAll = function() {
            if (confirm('全ての選択（ブックマーク・比較）を削除しますか？\n\nこの操作は取り消せません。')) {
                localStorage.removeItem('bookmarkList');
                localStorage.removeItem('comparisonList');
                updateNuclearCounters();
                
                // ガイドカードの状態をリセット
                const allButtons = document.querySelectorAll('.bookmark-btn, .compare-btn');
                allButtons.forEach(btn => {
                    btn.style.background = 'rgba(255, 255, 255, 0.9)';
                    btn.style.color = '#666';
                });
                
                alert('✅ 全ての選択を削除しました');
            }
        };
        
        console.log('✅ 核レベルグローバル関数定義完了');
    }
    
    function updateNuclearCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('nuclear-bookmark-count');
        const comparisonCounter = document.getElementById('nuclear-comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
    }
    
    // 6. 初期化システム
    function nuclearInitialize() {
        console.log('🚀 核レベル初期化開始');
        
        // 順次実行
        setTimeout(() => {
            destroyCompetingElements();
        }, 100);
        
        setTimeout(() => {
            createNuclearManagementButton();
        }, 200);
        
        setTimeout(() => {
            createNuclearManagementPanel();
        }, 300);
        
        setTimeout(() => {
            fixNuclearFilter();
        }, 400);
        
        setTimeout(() => {
            defineNuclearFunctions();
        }, 500);
        
        setTimeout(() => {
            updateNuclearCounters();
            console.log('✅ 核レベル初期化完了');
        }, 600);
        
        // 継続監視システム（10秒間隔）
        setInterval(() => {
            if (!document.getElementById('nuclear-management-trigger')) {
                console.log('管理ボタン再作成');
                createNuclearManagementButton();
            }
            
            if (!document.getElementById('nuclear-management-panel')) {
                console.log('管理パネル再作成');
                createNuclearManagementPanel();
            }
            
            destroyCompetingElements();
        }, 10000);
    }
    
    // 実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', nuclearInitialize);
    } else {
        nuclearInitialize();
    }
    
    // 即座にも実行
    setTimeout(nuclearInitialize, 50);
    
})();