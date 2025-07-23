// 管理センターの位置とサイズを動的に調整し、重複を防ぐシステム

(function() {
    'use strict';
    
    console.log('管理センター位置調整システム開始');
    
    function adjustManagementCenter() {
        const managementPanel = document.getElementById('management-center-panel');
        if (!managementPanel) return;
        
        const toolbar = managementPanel.querySelector('.floating-toolbar');
        if (!toolbar) return;
        
        // 画面サイズに応じた調整
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // スマートフォン対応
        if (screenWidth <= 768) {
            toolbar.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 10px;
                left: 10px;
                transform: none;
                background: #4CAF50;
                color: white;
                padding: 15px;
                border-radius: 12px;
                z-index: 99999;
                font-size: 13px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.4);
                border: 2px solid rgba(255,255,255,0.2);
                max-width: none;
            `;
        } else {
            // デスクトップサイズでの右側中央配置
            toolbar.style.cssText = `
                position: fixed;
                top: 50%;
                right: 15px;
                transform: translateY(-50%);
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 18px;
                border-radius: 16px;
                z-index: 99999;
                font-size: 14px;
                min-width: 220px;
                text-align: center;
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                border: 3px solid rgba(255,255,255,0.25);
                backdrop-filter: blur(10px);
            `;
        }
        
        // モーダルやその他の要素との重複チェック
        checkOverlap();
    }
    
    function checkOverlap() {
        const managementPanel = document.getElementById('management-center-panel');
        if (!managementPanel) return;
        
        // アクティブなモーダルがある場合は一時的に隠す
        const activeModals = document.querySelectorAll('.modal.show');
        if (activeModals.length > 0) {
            managementPanel.style.display = 'none';
            
            // モーダルが閉じられたら再表示
            activeModals.forEach(modal => {
                modal.addEventListener('hidden.bs.modal', function() {
                    setTimeout(() => {
                        if (managementPanel) {
                            managementPanel.style.display = 'block';
                        }
                    }, 300);
                });
            });
        } else {
            managementPanel.style.display = 'block';
        }
        
        // フィルターパネルとの重複回避
        const filterPanel = document.querySelector('#filter-panel, .filter-section');
        if (filterPanel && filterPanel.style.display !== 'none') {
            const toolbar = managementPanel.querySelector('.floating-toolbar');
            if (toolbar && window.innerWidth > 768) {
                toolbar.style.right = '280px'; // フィルターパネル分ずらす
            }
        } else {
            const toolbar = managementPanel.querySelector('.floating-toolbar');
            if (toolbar && window.innerWidth > 768) {
                toolbar.style.right = '15px'; // 元の位置に戻す
            }
        }
    }
    
    // リサイズイベント対応
    window.addEventListener('resize', function() {
        setTimeout(adjustManagementCenter, 100);
    });
    
    // スクロールイベント対応（モバイルでの表示調整）
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768) {
            const managementPanel = document.getElementById('management-center-panel');
            if (managementPanel) {
                const scrollY = window.scrollY;
                if (scrollY > 100) {
                    managementPanel.style.opacity = '0.9';
                } else {
                    managementPanel.style.opacity = '1';
                }
            }
        }
    });
    
    // DOM変更監視
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                setTimeout(checkOverlap, 100);
            }
        });
    });
    
    // 監視開始
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
    
    // 定期調整
    function periodicAdjustment() {
        adjustManagementCenter();
        setTimeout(periodicAdjustment, 3000);
    }
    
    // 初期化
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(adjustManagementCenter, 1000);
        setTimeout(periodicAdjustment, 2000);
    });
    
    // 即座に実行
    setTimeout(adjustManagementCenter, 500);
    
    console.log('管理センター位置調整システム完了');
    
})();