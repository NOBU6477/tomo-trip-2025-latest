// 日本語版完全修復システム

(function() {
    'use strict';
    
    console.log('日本語版完全修復システム開始');
    
    // 1. 管理センターボタンの強制作成
    function createManagementButton() {
        // 既存のボタンを削除
        const existing = document.getElementById('management-trigger-btn');
        if (existing) existing.remove();
        
        // トリガーボタンを作成
        const triggerBtn = document.createElement('div');
        triggerBtn.id = 'management-trigger-btn';
        triggerBtn.innerHTML = `
            <button onclick="window.toggleManagementPanel()" style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
                z-index: 99998;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid rgba(255, 255, 255, 0.2);
            " onmouseover="this.style.transform='scale(1.1)'" 
               onmouseout="this.style.transform='scale(1)'"
               title="管理センターを開く">
                🏆
            </button>
        `;
        
        document.body.appendChild(triggerBtn);
        console.log('✅ 管理センターボタン作成完了');
        
        // 管理パネルも作成
        createManagementPanel();
    }
    
    function createManagementPanel() {
        // 既存のパネルを削除
        const existing = document.getElementById('management-center-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'management-center-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div style="
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
            ">
                <h5>📋 管理センター</h5>
                <div style="margin: 15px 0;">
                    <div>比較中: <span id="comparison-count">0</span>/3人</div>
                    <div>ブックマーク: <span id="bookmark-count">0</span>人</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="window.showComparison()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer;">比較表示</button>
                    <button onclick="window.showBookmarks()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer;">ブックマーク表示</button>
                    <button onclick="window.clearAll()" style="background: rgba(255,0,0,0.3); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer;">全て削除</button>
                </div>
                <button onclick="window.toggleManagementPanel()" style="position: absolute; top: 5px; right: 10px; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        console.log('✅ 管理パネル作成完了');
    }
    
    // 2. フィルター機能の修復
    function fixFilterSystem() {
        console.log('🔧 フィルターシステム修復開始');
        
        // フィルタートグルボタンの修復
        const filterBtn = document.getElementById('filterToggleBtn');
        if (filterBtn) {
            filterBtn.onclick = function(e) {
                e.preventDefault();
                const filterCard = document.getElementById('filter-card');
                if (filterCard) {
                    if (filterCard.style.display === 'none' || filterCard.classList.contains('d-none')) {
                        filterCard.style.display = 'block';
                        filterCard.classList.remove('d-none');
                        filterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
                        console.log('✅ フィルター表示');
                    } else {
                        filterCard.style.display = 'none';
                        filterCard.classList.add('d-none');
                        filterBtn.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込む';
                        console.log('✅ フィルター非表示');
                    }
                }
            };
            console.log('✅ フィルタートグル修復完了');
        }
        
        // フィルター適用機能
        window.applyFilters = function() {
            console.log('🔍 フィルター適用開始');
            
            const locationSelect = document.getElementById('location-filter');
            const languageSelect = document.getElementById('language-filter');
            const priceSelect = document.getElementById('price-filter');
            const keywordInput = document.getElementById('keyword-search');
            
            const selectedLocation = locationSelect ? locationSelect.value : '';
            const selectedLanguage = languageSelect ? languageSelect.value : '';
            const selectedPrice = priceSelect ? priceSelect.value : '';
            const keyword = keywordInput ? keywordInput.value.toLowerCase() : '';
            
            console.log('フィルター条件:', {
                location: selectedLocation,
                language: selectedLanguage, 
                price: selectedPrice,
                keyword: keyword
            });
            
            const guideCards = document.querySelectorAll('.guide-card');
            let visibleCount = 0;
            
            guideCards.forEach(card => {
                let shouldShow = true;
                
                // 場所フィルター
                if (selectedLocation && selectedLocation !== '') {
                    const locationText = card.querySelector('.text-muted')?.textContent || '';
                    if (!locationText.includes(selectedLocation)) {
                        shouldShow = false;
                    }
                }
                
                // 言語フィルター
                if (selectedLanguage && selectedLanguage !== '') {
                    const cardText = card.textContent.toLowerCase();
                    if (!cardText.includes(selectedLanguage.toLowerCase())) {
                        shouldShow = false;
                    }
                }
                
                // 価格フィルター
                if (selectedPrice && selectedPrice !== '') {
                    const priceText = card.querySelector('.text-primary')?.textContent || '';
                    const price = parseInt(priceText.replace(/[^\d]/g, ''));
                    
                    if (selectedPrice === 'low' && price > 8000) shouldShow = false;
                    if (selectedPrice === 'medium' && (price < 8000 || price > 15000)) shouldShow = false;
                    if (selectedPrice === 'high' && price < 15000) shouldShow = false;
                }
                
                // キーワード検索
                if (keyword) {
                    const cardText = card.textContent.toLowerCase();
                    if (!cardText.includes(keyword)) {
                        shouldShow = false;
                    }
                }
                
                if (shouldShow) {
                    card.style.display = 'block';
                    card.classList.remove('d-none');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.add('d-none');
                }
            });
            
            // カウンター更新
            updateGuideCount(visibleCount);
            console.log(`✅ フィルター適用完了: ${visibleCount}人表示`);
        };
        
        // リセット機能
        window.resetFilters = function() {
            console.log('🔄 フィルターリセット開始');
            
            // フィルター要素をリセット
            const locationSelect = document.getElementById('location-filter');
            const languageSelect = document.getElementById('language-filter');
            const priceSelect = document.getElementById('price-filter');
            const keywordInput = document.getElementById('keyword-search');
            
            if (locationSelect) locationSelect.value = '';
            if (languageSelect) languageSelect.value = '';
            if (priceSelect) priceSelect.value = '';
            if (keywordInput) keywordInput.value = '';
            
            // 全ガイドカードを表示
            const guideCards = document.querySelectorAll('.guide-card');
            guideCards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('d-none');
            });
            
            updateGuideCount(guideCards.length);
            console.log(`✅ フィルターリセット完了: ${guideCards.length}人表示`);
        };
    }
    
    // 3. 白い枠の除去
    function removeWhiteBoxes() {
        console.log('🗑️ 白い枠除去開始');
        
        // 様々な白い要素を検索
        const allElements = document.querySelectorAll('*');
        let removedCount = 0;
        
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // 白い背景で小さい要素
            if (computedStyle.backgroundColor === 'rgb(255, 255, 255)' ||
                computedStyle.backgroundColor === 'white' ||
                computedStyle.backgroundColor === '#ffffff') {
                
                // 空で小さい要素を削除
                if (rect.width < 50 && rect.height < 50 && 
                    !element.textContent.trim() &&
                    !element.querySelector('img, button, input, select') &&
                    !element.id.includes('management') &&
                    !element.closest('.modal') &&
                    !element.closest('.navbar') &&
                    !element.closest('.card')) {
                    
                    element.remove();
                    removedCount++;
                }
            }
        });
        
        console.log(`✅ 白い枠除去完了: ${removedCount}個削除`);
    }
    
    // 4. ガイドカウンター更新
    function updateGuideCount(count) {
        const counter = document.querySelector('.text-primary.mb-3');
        if (counter) {
            counter.innerHTML = `<i class="bi bi-people-fill"></i> ${count}人のガイドが見つかりました`;
        }
        
        // 管理センターのカウンター更新
        updateManagementCounters();
    }
    
    function updateManagementCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('bookmark-count');
        const comparisonCounter = document.getElementById('comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
    }
    
    // 5. グローバル関数の定義
    function defineGlobalFunctions() {
        window.toggleManagementPanel = function() {
            const panel = document.getElementById('management-center-panel');
            if (panel) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    updateManagementCounters();
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
                updateManagementCounters();
                
                // ガイドカードの状態をリセット
                const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
                const compareBtns = document.querySelectorAll('.compare-btn');
                
                bookmarkBtns.forEach(btn => {
                    btn.style.background = 'rgba(255, 255, 255, 0.9)';
                });
                
                compareBtns.forEach(btn => {
                    btn.style.background = 'rgba(255, 255, 255, 0.9)';
                });
                
                alert('全ての選択を削除しました');
            }
        };
        
        console.log('✅ グローバル関数定義完了');
    }
    
    // 初期化
    function initialize() {
        setTimeout(() => {
            createManagementButton();
            fixFilterSystem();
            removeWhiteBoxes();
            defineGlobalFunctions();
            
            // カウンター初期化
            const guideCards = document.querySelectorAll('.guide-card');
            updateGuideCount(guideCards.length);
            
            console.log('✅ 日本語版完全修復完了');
        }, 1000);
    }
    
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // 即座に実行も行う
    setTimeout(initialize, 500);
    
})();