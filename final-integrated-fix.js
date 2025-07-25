// 最終統合修正システム - 全問題を解決

(function() {
    'use strict';
    
    console.log('🚀 最終統合修正システム開始');
    
    let isInitialized = false;
    
    // 1. フィルター機能の確実な修復（競合を回避）
    function ensureFilterFunctionality() {
        console.log('フィルター機能確実修復開始');
        
        const filterBtn = document.getElementById('filterToggleBtn');
        const filterCard = document.getElementById('filter-card');
        
        if (!filterBtn || !filterCard) {
            console.log('フィルター要素が見つかりません');
            return false;
        }
        
        // 既存のイベントリスナーを完全に削除
        const newFilterBtn = filterBtn.cloneNode(true);
        filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);
        
        // 新しいイベントリスナーを追加
        newFilterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('フィルターボタンクリック検出');
            
            if (filterCard.classList.contains('d-none')) {
                filterCard.classList.remove('d-none');
                filterCard.style.display = 'block';
                newFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
                console.log('✅ フィルター表示');
            } else {
                filterCard.classList.add('d-none'); 
                filterCard.style.display = 'none';
                newFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込み';
                console.log('✅ フィルター非表示');
            }
        });
        
        console.log('✅ フィルター機能修復完了');
        return true;
    }
    
    // 2. 管理センターボタンの確実な作成
    function createReliableManagementButton() {
        console.log('管理センターボタン確実作成開始');
        
        // 既存の要素をすべて削除
        const existingButtons = document.querySelectorAll('[id*="management"], [id*="nuclear"], [id*="trigger"]');
        existingButtons.forEach(el => {
            if (!el.closest('script')) {
                el.remove();
            }
        });
        
        // 新しいコンテナ作成
        const container = document.createElement('div');
        container.id = 'final-management-container';
        container.style.cssText = `
            position: fixed !important;
            bottom: 80px !important;
            right: 80px !important;
            z-index: 999999999 !important;
            width: 80px !important;
            height: 80px !important;
            pointer-events: auto !important;
            display: block !important;
            visibility: visible !important;
        `;
        
        // ボタン作成
        const button = document.createElement('button');
        button.id = 'final-management-btn';
        button.textContent = '🏆';
        button.title = '管理センターを開く';
        button.style.cssText = `
            width: 100% !important;
            height: 100% !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #4CAF50, #45a049) !important;
            border: 3px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
            font-size: 32px !important;
            cursor: pointer !important;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4) !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            outline: none !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            pointer-events: auto !important;
        `;
        
        // クリックイベント
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('管理センターボタンクリック');
            toggleFinalManagementPanel();
        });
        
        // ホバー効果
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
        
        console.log('✅ 管理センターボタン確実作成完了');
        return container;
    }
    
    // 3. 管理パネルの作成
    function createFinalManagementPanel() {
        console.log('最終管理パネル作成開始');
        
        const existing = document.getElementById('final-management-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'final-management-panel';
        panel.style.cssText = `
            display: none !important;
            position: fixed !important;
            bottom: 120px !important;
            right: 20px !important;
            background: linear-gradient(135deg, #4CAF50, #45a049) !important;
            color: white !important;
            padding: 25px !important;
            border-radius: 20px !important;
            z-index: 2147483646 !important;
            min-width: 320px !important;
            max-width: 400px !important;
            text-align: center !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.4) !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            pointer-events: auto !important;
        `;
        
        // ヘッダー
        const header = document.createElement('h5');
        header.textContent = '📋 管理センター';
        header.style.cssText = 'margin: 0 0 20px 0 !important; font-size: 18px !important; font-weight: bold !important;';
        panel.appendChild(header);
        
        // カウンター表示
        const counterArea = document.createElement('div');
        counterArea.style.cssText = `
            margin: 15px 0 20px 0 !important;
            padding: 15px !important;
            background: rgba(255,255,255,0.1) !important;
            border-radius: 10px !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
        `;
        
        const comparisonInfo = document.createElement('div');
        comparisonInfo.style.cssText = 'margin-bottom: 8px !important; font-size: 14px !important;';
        comparisonInfo.innerHTML = '比較中: <span id="final-comparison-count" style="font-weight: bold !important; color: #ffeb3b !important;">0</span>/3人';
        
        const bookmarkInfo = document.createElement('div');
        bookmarkInfo.style.cssText = 'font-size: 14px !important;';
        bookmarkInfo.innerHTML = 'ブックマーク: <span id="final-bookmark-count" style="font-weight: bold !important; color: #ffeb3b !important;">0</span>人';
        
        counterArea.appendChild(comparisonInfo);
        counterArea.appendChild(bookmarkInfo);
        panel.appendChild(counterArea);
        
        // ボタン群
        const buttonArea = document.createElement('div');
        buttonArea.style.cssText = 'display: flex !important; flex-direction: column !important; gap: 12px !important;';
        
        const createBtn = (text, action, bgColor = 'rgba(255,255,255,0.2)') => {
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
                width: 100% !important;
            `;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                action();
            });
            btn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255,255,255,0.3) !important';
                this.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.background = bgColor + ' !important';
                this.style.transform = 'translateY(0)';
            });
            return btn;
        };
        
        buttonArea.appendChild(createBtn('比較表示', showFinalComparison));
        buttonArea.appendChild(createBtn('ブックマーク表示', showFinalBookmarks));
        buttonArea.appendChild(createBtn('全て削除', clearFinalAll, 'rgba(220,53,69,0.6)'));
        
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
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFinalManagementPanel();
        });
        panel.appendChild(closeBtn);
        
        document.body.appendChild(panel);
        console.log('✅ 最終管理パネル作成完了');
        return panel;
    }
    
    // 4. 白い要素の完全除去
    function removeAllWhiteElements() {
        console.log('白い要素完全除去開始');
        
        let removedCount = 0;
        
        // すべての要素をチェック
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // 白い背景で空の要素を削除
            if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
                 styles.backgroundColor === 'white' ||
                 styles.backgroundColor === '#ffffff' ||
                 styles.backgroundColor === '#fff') &&
                rect.width > 0 && rect.width < 300 && 
                rect.height > 0 && rect.height < 300 &&
                !element.textContent.trim() &&
                !element.querySelector('img, button, input, select, textarea, canvas, svg, iframe') &&
                !element.closest('.modal') &&
                !element.closest('.navbar') &&
                !element.closest('.card') &&
                !element.closest('.hero-section') &&
                !element.closest('.sponsor-banner') &&
                !element.id.includes('management') &&
                !element.id.includes('final') &&
                element.tagName !== 'HTML' &&
                element.tagName !== 'BODY' &&
                element.tagName !== 'HEAD') {
                
                element.remove();
                removedCount++;
            }
            
            // 円形の不要な要素を削除
            if ((styles.borderRadius === '50%' || 
                 styles.borderRadius.includes('50%') ||
                 (element.style.borderRadius && element.style.borderRadius.includes('50%'))) &&
                rect.width < 60 && rect.height < 60 &&
                !element.textContent.includes('🏆') &&
                !element.querySelector('img') &&
                !element.id.includes('management') &&
                !element.id.includes('final') &&
                (element.closest('.filter-container') || 
                 element.closest('#filter-card') ||
                 (rect.width < 40 && rect.height < 40 && !element.textContent.trim()))) {
                
                element.remove();
                removedCount++;
            }
        });
        
        console.log(`✅ 白い要素除去完了: ${removedCount}個削除`);
    }
    
    // 5. グローバル関数定義
    function defineFinalFunctions() {
        // 管理パネルトグル
        window.toggleFinalManagementPanel = function() {
            const panel = document.getElementById('final-management-panel');
            if (panel) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    updateFinalCounters();
                    console.log('管理パネル表示');
                } else {
                    panel.style.display = 'none';
                    console.log('管理パネル非表示');
                }
            }
        };
        
        // 比較表示
        window.showFinalComparison = function() {
            const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
            if (comparisonList.length === 0) {
                alert('比較するガイドが選択されていません。\n\nガイドカードの✓アイコンをクリックして比較対象を選択してください。');
                return;
            }
            
            let message = '【比較中のガイド】\n\n';
            comparisonList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name || '名前不明'}\n`;
                message += `   📍 ${guide.location || '場所不明'}\n`;
                message += `   💰 ¥${guide.price || '6000'}/セッション\n`;
                message += `   ⭐ ${guide.rating || '4.5'}★\n\n`;
            });
            alert(message);
        };
        
        // ブックマーク表示
        window.showFinalBookmarks = function() {
            const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
            if (bookmarkList.length === 0) {
                alert('ブックマークされたガイドはありません。\n\nガイドカードの⭐アイコンをクリックしてブックマークに追加してください。');
                return;
            }
            
            let message = '【ブックマーク済みガイド】\n\n';
            bookmarkList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name || '名前不明'}\n`;
                message += `   📍 ${guide.location || '場所不明'}\n`;
                message += `   💰 ¥${guide.price || '6000'}/セッション\n`;
                message += `   ⭐ ${guide.rating || '4.5'}★\n\n`;
            });
            alert(message);
        };
        
        // 全削除
        window.clearFinalAll = function() {
            if (confirm('全ての選択（ブックマーク・比較）を削除しますか？\n\nこの操作は取り消せません。')) {
                localStorage.removeItem('bookmarkList');
                localStorage.removeItem('comparisonList');
                updateFinalCounters();
                
                // ガイドカードの状態をリセット
                const allButtons = document.querySelectorAll('.bookmark-btn, .compare-btn');
                allButtons.forEach(btn => {
                    btn.style.background = 'rgba(255, 255, 255, 0.9)';
                    btn.style.color = '#666';
                });
                
                alert('✅ 全ての選択を削除しました');
                console.log('全選択削除完了');
            }
        };
        
        console.log('✅ 最終グローバル関数定義完了');
    }
    
    function updateFinalCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('final-bookmark-count');
        const comparisonCounter = document.getElementById('final-comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
        
        console.log(`カウンター更新: ブックマーク${bookmarkList.length}件, 比較${comparisonList.length}件`);
    }
    
    // 6. 最終初期化システム
    function finalInitialize() {
        if (isInitialized) {
            console.log('既に初期化済み、スキップ');
            return;
        }
        
        console.log('🚀 最終初期化開始');
        
        // 段階的に実行
        setTimeout(() => {
            removeAllWhiteElements();
        }, 100);
        
        setTimeout(() => {
            if (ensureFilterFunctionality()) {
                console.log('✅ フィルター機能初期化完了');
            }
        }, 200);
        
        setTimeout(() => {
            createReliableManagementButton();
        }, 300);
        
        setTimeout(() => {
            createFinalManagementPanel();
        }, 400);
        
        setTimeout(() => {
            defineFinalFunctions();
        }, 500);
        
        setTimeout(() => {
            updateFinalCounters();
            isInitialized = true;
            console.log('✅ 最終初期化完了');
        }, 600);
        
        // 継続監視（15秒間隔）
        setInterval(() => {
            if (!document.getElementById('final-management-container')) {
                console.log('管理ボタン再作成必要');
                createReliableManagementButton();
            }
            
            if (!document.getElementById('final-management-panel')) {
                console.log('管理パネル再作成必要');
                createFinalManagementPanel();
            }
            
            // フィルター機能チェック
            const filterBtn = document.getElementById('filterToggleBtn');
            if (filterBtn && !filterBtn.onclick && filterBtn.addEventListener) {
                console.log('フィルター機能再修復必要');
                ensureFilterFunctionality();
            }
            
            removeAllWhiteElements();
        }, 15000);
    }
    
    // 7. 強制実行システム
    console.log('🚀 強制実行システム開始');
    
    // 即座に実行
    finalInitialize();
    
    // DOM準備後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded実行');
            finalInitialize();
        });
    }
    
    // 複数回実行
    setTimeout(() => {
        console.log('100ms後実行');
        finalInitialize();
    }, 100);
    
    setTimeout(() => {
        console.log('500ms後実行');
        finalInitialize();
    }, 500);
    
    setTimeout(() => {
        console.log('1000ms後実行');
        finalInitialize();
    }, 1000);
    
    setTimeout(() => {
        console.log('2000ms後実行');
        finalInitialize();
    }, 2000);
    
    // 緊急デバッグシステム
    setTimeout(() => {
        const btn = document.getElementById('final-management-container');
        if (!btn) {
            console.error('❌ 管理ボタンが見つかりません - 緊急作成開始');
            createReliableManagementButton();
        } else {
            console.log('✅ 管理ボタン確認完了');
        }
    }, 3000);
    
})();