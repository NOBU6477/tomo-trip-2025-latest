// 核レベル修正システム - 根本原因の完全排除

(function() {
    'use strict';
    
    console.log('💥 核レベル修正システム開始');
    
    // 1. 競合スクリプトの完全無効化
    function disableCompetingScripts() {
        console.log('競合スクリプト無効化開始');
        
        // guide-card-icons.jsの無効化
        window.guideCardIconsActive = true;
        
        // final-integrated-fix.jsの無効化
        window.finalIntegratedActive = true;
        
        // clean-fix-systemの重複実行防止
        window.cleanFixActive = true;
        
        console.log('✅ 競合スクリプト無効化完了');
    }
    
    // 2. すべての既存要素の強制削除
    function nuclearCleanup() {
        console.log('核レベルクリーンアップ開始');
        
        // 管理関連要素の完全削除
        const managementElements = document.querySelectorAll(
            '[id*="management"], [id*="nuclear"], [id*="trigger"], [id*="final"], [id*="emergency"]'
        );
        
        managementElements.forEach(el => {
            if (!el.closest('script')) {
                el.remove();
                console.log('管理要素削除:', el.id);
            }
        });
        
        // 丸いアイコンの完全削除
        const circularElements = document.querySelectorAll('*');
        let removedCircular = 0;
        
        circularElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            if ((styles.borderRadius === '50%' || 
                 styles.borderRadius.includes('50%') ||
                 el.style.borderRadius?.includes('50%')) &&
                rect.width > 0 && rect.width < 80 &&
                rect.height > 0 && rect.height < 80 &&
                (el.textContent.includes('⭐') || 
                 el.textContent.includes('✓') ||
                 el.className.includes('bookmark') ||
                 el.className.includes('compare'))) {
                
                el.remove();
                removedCircular++;
            }
        });
        
        // 白い要素の完全削除
        const whiteElements = document.querySelectorAll('*');
        let removedWhite = 0;
        
        whiteElements.forEach(el => {
            const styles = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
                 styles.backgroundColor === 'white') &&
                rect.width > 0 && rect.width < 300 &&
                rect.height > 0 && rect.height < 300 &&
                !el.textContent.trim() &&
                !el.querySelector('img, button, input, select') &&
                !el.closest('.modal, .navbar, .hero-section, .card')) {
                
                el.remove();
                removedWhite++;
            }
        });
        
        console.log(`✅ 核レベルクリーンアップ完了: 丸要素${removedCircular}個, 白要素${removedWhite}個削除`);
    }
    
    // 3. 管理ボタンの強制作成
    function createNuclearManagementButton() {
        console.log('核レベル管理ボタン作成開始');
        
        // 確実に削除
        const existing = document.getElementById('nuclear-management-btn');
        if (existing) existing.remove();
        
        // ボタン作成
        const button = document.createElement('div');
        button.id = 'nuclear-management-btn';
        button.innerHTML = '🏆';
        button.title = '管理センター';
        
        // 最強のスタイル
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.width = '60px';
        button.style.height = '60px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.borderRadius = '50%';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.fontSize = '24px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '2147483647';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        button.style.border = '2px solid white';
        button.style.userSelect = 'none';
        button.style.pointerEvents = 'auto';
        button.style.visibility = 'visible';
        button.style.opacity = '1';
        
        // イベント
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('核レベル管理ボタンクリック');
            showNuclearPanel();
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = '#45a049';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '#4CAF50';
        });
        
        // bodyに強制追加
        document.body.appendChild(button);
        
        console.log('✅ 核レベル管理ボタン作成完了');
        return button;
    }
    
    // 4. 管理パネルの作成
    function createNuclearPanel() {
        console.log('核レベル管理パネル作成開始');
        
        const existing = document.getElementById('nuclear-management-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'nuclear-management-panel';
        panel.style.display = 'none';
        panel.style.position = 'fixed';
        panel.style.bottom = '90px';
        panel.style.right = '20px';
        panel.style.backgroundColor = '#4CAF50';
        panel.style.color = 'white';
        panel.style.padding = '20px';
        panel.style.borderRadius = '15px';
        panel.style.zIndex = '2147483646';
        panel.style.minWidth = '280px';
        panel.style.textAlign = 'center';
        panel.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        panel.style.border = '2px solid white';
        
        panel.innerHTML = `
            <h6 style="margin: 0 0 15px 0; font-weight: bold;">📋 管理センター</h6>
            <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <div style="margin-bottom: 5px; font-size: 13px;">比較中: <span id="nuclear-comparison-count">0</span>/3人</div>
                <div style="font-size: 13px;">ブックマーク: <span id="nuclear-bookmark-count">0</span>人</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="showNuclearComparison()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">比較表示</button>
                <button onclick="showNuclearBookmarks()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">ブックマーク表示</button>
                <button onclick="clearNuclearAll()" style="background: rgba(220,53,69,0.6); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px;">全て削除</button>
            </div>
            <button onclick="hideNuclearPanel()" style="position: absolute; top: 5px; right: 8px; background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
        `;
        
        document.body.appendChild(panel);
        console.log('✅ 核レベル管理パネル作成完了');
        return panel;
    }
    
    // 5. フィルター機能の完全修復
    function nuclearFilterFix() {
        console.log('核レベルフィルター修復開始');
        
        const filterBtn = document.getElementById('filterToggleBtn');
        const filterCard = document.getElementById('filter-card');
        
        if (!filterBtn || !filterCard) {
            console.log('フィルター要素が見つかりません');
            return;
        }
        
        // イベントリスナーを完全にリセット
        const newBtn = filterBtn.cloneNode(true);
        filterBtn.parentNode.replaceChild(newBtn, filterBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (filterCard.classList.contains('d-none')) {
                filterCard.classList.remove('d-none');
                filterCard.style.display = 'block';
                newBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
            } else {
                filterCard.classList.add('d-none');
                filterCard.style.display = 'none';
                newBtn.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込み';
            }
        });
        
        console.log('✅ 核レベルフィルター修復完了');
    }
    
    // 6. グローバル関数定義
    window.showNuclearPanel = function() {
        const panel = document.getElementById('nuclear-management-panel');
        if (panel) {
            panel.style.display = 'block';
            updateNuclearCounters();
        }
    };
    
    window.hideNuclearPanel = function() {
        const panel = document.getElementById('nuclear-management-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    };
    
    window.showNuclearComparison = function() {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        if (comparisonList.length === 0) {
            alert('比較するガイドが選択されていません。');
            return;
        }
        
        let message = '【比較中のガイド】\n\n';
        comparisonList.forEach((guide, index) => {
            message += `${index + 1}. ${guide.name || '名前不明'}\n`;
            message += `   📍 ${guide.location || '場所不明'}\n`;
            message += `   💰 ¥${guide.price || '6000'}/セッション\n\n`;
        });
        alert(message);
    };
    
    window.showNuclearBookmarks = function() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        if (bookmarkList.length === 0) {
            alert('ブックマークされたガイドはありません。');
            return;
        }
        
        let message = '【ブックマーク済みガイド】\n\n';
        bookmarkList.forEach((guide, index) => {
            message += `${index + 1}. ${guide.name || '名前不明'}\n`;
            message += `   📍 ${guide.location || '場所不明'}\n`;
            message += `   💰 ¥${guide.price || '6000'}/セッション\n\n`;
        });
        alert(message);
    };
    
    window.clearNuclearAll = function() {
        if (confirm('全ての選択を削除しますか？')) {
            localStorage.removeItem('bookmarkList');
            localStorage.removeItem('comparisonList');
            updateNuclearCounters();
            alert('全ての選択を削除しました');
        }
    };
    
    function updateNuclearCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('nuclear-bookmark-count');
        const comparisonCounter = document.getElementById('nuclear-comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
    }
    
    // 7. 核レベル初期化システム
    function nuclearInitialize() {
        console.log('💥 核レベル初期化開始');
        
        // 段階的実行
        disableCompetingScripts();
        
        setTimeout(() => {
            nuclearCleanup();
        }, 50);
        
        setTimeout(() => {
            createNuclearManagementButton();
        }, 100);
        
        setTimeout(() => {
            createNuclearPanel();
        }, 150);
        
        setTimeout(() => {
            nuclearFilterFix();
        }, 200);
        
        setTimeout(() => {
            updateNuclearCounters();
            console.log('✅ 核レベル初期化完了');
        }, 250);
        
        // 継続監視（5秒間隔）
        setInterval(() => {
            if (!document.getElementById('nuclear-management-btn')) {
                console.log('管理ボタン消失 - 再作成');
                createNuclearManagementButton();
            }
            
            if (!document.getElementById('nuclear-management-panel')) {
                console.log('管理パネル消失 - 再作成');
                createNuclearPanel();
            }
            
            // 丸いスタンプの継続削除
            nuclearCleanup();
        }, 5000);
    }
    
    // 8. 複数実行システム
    nuclearInitialize();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded - 核レベル実行');
            nuclearInitialize();
        });
    }
    
    setTimeout(() => {
        console.log('100ms後 - 核レベル実行');
        nuclearInitialize();
    }, 100);
    
    setTimeout(() => {
        console.log('500ms後 - 核レベル実行');
        nuclearInitialize();
    }, 500);
    
    setTimeout(() => {
        console.log('1000ms後 - 核レベル実行');
        nuclearInitialize();
    }, 1000);
    
    setTimeout(() => {
        console.log('2000ms後 - 核レベル実行');
        nuclearInitialize();
    }, 2000);
    
})();