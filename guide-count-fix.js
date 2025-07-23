// ガイドカード表示数と人数カウントの同期システム
(function() {
    'use strict';
    
    function updateGuideCount() {
        // 実際に表示されているガイドカードの数を数える
        const visibleGuideCards = document.querySelectorAll('.guide-card:not([style*="display: none"])');
        const actualCount = visibleGuideCards.length;
        
        // カウンター要素を更新
        const countElement = document.getElementById('guide-count-number');
        if (countElement && actualCount > 0) {
            countElement.textContent = actualCount;
            console.log(`ガイドカウンター更新: ${actualCount}人`);
        }
        
        // 複数のカウンター要素を更新
        const allCountElements = document.querySelectorAll('#guide-count-number');
        allCountElements.forEach(element => {
            if (element && actualCount > 0) {
                element.textContent = actualCount;
            }
        });
        
        return actualCount;
    }
    
    // フィルターボタンの機能を修正
    function setupFilterButton() {
        const filterBtn = document.getElementById('filterToggleBtn');
        const filterCard = document.getElementById('filter-card');
        
        if (filterBtn && filterCard) {
            // 既存のイベントリスナーを削除
            const newBtn = filterBtn.cloneNode(true);
            filterBtn.parentNode.replaceChild(newBtn, filterBtn);
            
            // 新しいイベントリスナーを追加
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('フィルターボタンクリック');
                
                if (filterCard.classList.contains('d-none')) {
                    filterCard.classList.remove('d-none');
                    newBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
                    console.log('フィルター表示');
                } else {
                    filterCard.classList.add('d-none');
                    newBtn.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込み';
                    console.log('フィルター非表示');
                }
            });
            
            console.log('フィルターボタン設定完了');
        }
    }
    
    // DOMが読み込まれた後に実行
    document.addEventListener('DOMContentLoaded', function() {
        console.log('ガイドカウント修正システム開始');
        
        // 初期カウント更新
        setTimeout(updateGuideCount, 100);
        
        // フィルターボタン設定
        setTimeout(setupFilterButton, 200);
        
        // 定期的なカウント更新（3秒間隔）
        setInterval(updateGuideCount, 3000);
    });
    
    // Window loadイベントでも実行
    window.addEventListener('load', function() {
        setTimeout(updateGuideCount, 300);
        setTimeout(setupFilterButton, 400);
    });
    
    // グローバル関数として公開
    window.updateGuideCount = updateGuideCount;
    window.setupFilterButton = setupFilterButton;
    
})();