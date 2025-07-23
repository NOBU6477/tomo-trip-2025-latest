// システムクリーンアップ - 旧システム無効化と新システム保護

(function() {
    'use strict';
    
    console.log('システムクリーンアップ開始');
    
    // 旧システムの管理センターパネルを完全に無効化
    function disableOldManagementSystem() {
        const oldPanels = document.querySelectorAll('#management-center-panel:not([data-new-system])');
        oldPanels.forEach(panel => {
            panel.style.display = 'none';
            panel.remove();
        });
        
        // simple-management-panel.jsの関数を無効化
        if (window.createManagementPanel) {
            window.createManagementPanel = function() {
                console.log('旧管理システム無効化済み');
                return;
            };
        }
    }
    
    // 重複するガイドカードアイコンを除去
    function removeDuplicateIcons() {
        const allCards = document.querySelectorAll('.guide-card, .card');
        
        allCards.forEach(card => {
            const iconContainers = card.querySelectorAll('.guide-card-icons');
            
            // 2つ以上のアイコンコンテナがある場合、最初のもの以外を削除
            if (iconContainers.length > 1) {
                for (let i = 1; i < iconContainers.length; i++) {
                    iconContainers[i].remove();
                }
                console.log('重複アイコンを削除:', iconContainers.length - 1, '個');
            }
            
            // 丸印のアイコンを個別にチェック（⭐と✓）
            const starButtons = card.querySelectorAll('button:contains("⭐"), [innerHTML*="⭐"]');
            const checkButtons = card.querySelectorAll('button:contains("✓"), [innerHTML*="✓"]');
            
            // ⭐ボタンが複数の場合
            if (starButtons.length > 1) {
                for (let i = 1; i < starButtons.length; i++) {
                    console.log('重複⭐ボタン削除');
                    starButtons[i].remove();
                }
            }
            
            // ✓ボタンが複数の場合  
            if (checkButtons.length > 1) {
                for (let i = 1; i < checkButtons.length; i++) {
                    console.log('重複✓ボタン削除');
                    checkButtons[i].remove();
                }
            }
            
            // 丸い背景のアイコンを探して削除（新システム以外）
            const circularElements = card.querySelectorAll('*[style*="border-radius:50%"]:not(.bookmark-btn):not(.compare-btn)');
            circularElements.forEach(element => {
                if (element.innerHTML.includes('⭐') || element.innerHTML.includes('✓')) {
                    console.log('不要な丸印削除:', element);
                    element.remove();
                }
            });
        });
    }
    
    // 新システムのトリガーボタンが正しく表示されているかチェック
    function ensureNewSystemActive() {
        const triggerBtn = document.getElementById('management-trigger-btn');
        const managementPanel = document.getElementById('management-center-panel');
        
        if (!triggerBtn) {
            console.log('トリガーボタンが見つかりません - 新システムを再初期化');
            // 新システムを強制的に再作成
            if (window.toggleManagementPanel) {
                // 既に関数が存在する場合は新システムが動作中
                return;
            }
        }
        
        // 管理センターパネルは初期状態では非表示であるべき
        if (managementPanel && managementPanel.style.display !== 'none') {
            managementPanel.style.display = 'none';
            console.log('管理センターパネルを非表示に設定');
        }
    }
    
    // 定期的なクリーンアップ
    function periodicCleanup() {
        disableOldManagementSystem();
        removeDuplicateIcons();
        ensureNewSystemActive();
        
        setTimeout(periodicCleanup, 5000);
    }
    
    // 初期化
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            disableOldManagementSystem();
            removeDuplicateIcons();
            ensureNewSystemActive();
            setTimeout(periodicCleanup, 3000);
        }, 1000);
    });
    
    // 即座に実行
    setTimeout(() => {
        disableOldManagementSystem();
        removeDuplicateIcons();
        ensureNewSystemActive();
    }, 500);
    
    console.log('システムクリーンアップ完了');
    
})();