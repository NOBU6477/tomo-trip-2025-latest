// フィルター機能の修正スクリプト
console.log('フィルター機能修正スクリプト読み込み');

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('フィルター機能初期化開始');
    
    // フィルターボタンの機能修正
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterCard = document.getElementById('filter-card');
    
    if (filterToggleBtn && filterCard) {
        // 既存のイベントリスナーを削除
        filterToggleBtn.replaceWith(filterToggleBtn.cloneNode(true));
        const newFilterToggleBtn = document.getElementById('filterToggleBtn');
        
        newFilterToggleBtn.addEventListener('click', function() {
            console.log('フィルターボタンクリック');
            if (filterCard.classList.contains('d-none')) {
                filterCard.classList.remove('d-none');
                console.log('フィルターカード表示');
            } else {
                filterCard.classList.add('d-none');
                console.log('フィルターカード非表示');
            }
        });
    }
    
    // 地域フィルターの修正
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) {
        locationFilter.addEventListener('change', function() {
            console.log('地域フィルター変更:', this.value);
            filterGuides();
        });
    }
    
    // 言語フィルターの修正
    const languageFilter = document.getElementById('language-filter');
    if (languageFilter) {
        languageFilter.addEventListener('change', function() {
            console.log('言語フィルター変更:', this.value);
            filterGuides();
        });
    }
    
    // 価格フィルターの修正
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            console.log('価格フィルター変更:', this.value);
            filterGuides();
        });
    }
    
    // キーワードフィルターの修正
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    keywordCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log('キーワードフィルター変更:', this.value, this.checked);
            filterGuides();
        });
    });
    
    // カスタムキーワード入力の修正
    const customKeywords = document.getElementById('custom-keywords');
    if (customKeywords) {
        customKeywords.addEventListener('input', function() {
            console.log('カスタムキーワード変更:', this.value);
            // 1秒後にフィルタリング実行（入力中の負荷軽減）
            clearTimeout(window.filterTimeout);
            window.filterTimeout = setTimeout(filterGuides, 1000);
        });
    }
    
    // フィルタリング関数
    function filterGuides() {
        console.log('フィルタリング実行開始');
        
        const locationValue = locationFilter ? locationFilter.value : '';
        const languageValue = languageFilter ? languageFilter.value : '';
        const priceValue = priceFilter ? priceFilter.value : '';
        
        // チェックされたキーワードを取得
        const checkedKeywords = [];
        keywordCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedKeywords.push(checkbox.value);
            }
        });
        
        // カスタムキーワードを取得
        const customKeywordValue = customKeywords ? customKeywords.value.trim() : '';
        const customKeywordList = customKeywordValue ? customKeywordValue.split(',').map(k => k.trim()) : [];
        
        // 全てのキーワードを結合
        const allKeywords = [...checkedKeywords, ...customKeywordList];
        
        console.log('フィルター条件:', {
            location: locationValue,
            language: languageValue,
            price: priceValue,
            keywords: allKeywords
        });
        
        // デバッグ情報追加
        console.log('フィルタリング開始 - 対象カード数:', guideCards.length);
        
        // ガイドカードを取得
        const guideCards = document.querySelectorAll('.guide-card');
        let visibleCount = 0;
        
        guideCards.forEach(card => {
            const cardContainer = card.closest('.col-md-4');
            if (!cardContainer) return;
            
            let isVisible = true;
            
            // 地域フィルター
            if (locationValue) {
                const locationText = card.querySelector('.text-muted')?.textContent || '';
                console.log('Location filter check:', locationValue, 'vs', locationText);
                // locationValueは英語のvalue（例：Tokyo）、locationTextは日本語（例：東京, 渋谷）
                // 地域マッピングを使用
                const locationMapping = {
                    'Tokyo': '東京',
                    'Osaka': '大阪', 
                    'Kyoto': '京都',
                    'Hokkaido': '北海道',
                    'Aichi': '愛知',
                    'Kanagawa': '神奈川',
                    'Hyogo': '兵庫'
                };
                const japaneseLocation = locationMapping[locationValue] || locationValue;
                if (!locationText.includes(japaneseLocation)) {
                    isVisible = false;
                }
            }
            
            // 言語フィルター
            if (languageValue) {
                const languageBadges = card.querySelectorAll('.badge');
                let hasLanguage = false;
                // 言語マッピング
                const languageMapping = {
                    'Japanese': '日本語',
                    'English': '英語',
                    'Chinese': '中国語',
                    'Korean': '韓国語',
                    'French': 'フランス語'
                };
                const japaneseLanguage = languageMapping[languageValue] || languageValue;
                console.log('Language filter check:', languageValue, '->', japaneseLanguage);
                
                languageBadges.forEach(badge => {
                    if (badge.textContent.includes(japaneseLanguage)) {
                        hasLanguage = true;
                    }
                });
                if (!hasLanguage) {
                    isVisible = false;
                }
            }
            
            // 価格フィルター
            if (priceValue) {
                const priceElement = card.querySelector('.fw-bold.text-primary');
                const priceText = priceElement ? priceElement.textContent : '';
                console.log('Price filter check:', priceValue, 'vs', priceText);
                const priceMatch = priceText.match(/¥([\d,]+)/);
                if (priceMatch) {
                    const price = parseInt(priceMatch[1].replace(',', ''));
                    console.log('Extracted price:', price);
                    if (priceValue === 'under-6000' && price >= 6000) {
                        isVisible = false;
                    } else if (priceValue === '6000-10000' && (price < 6000 || price > 10000)) {
                        isVisible = false;
                    } else if (priceValue === 'over-10000' && price <= 10000) {
                        isVisible = false;
                    }
                } else {
                    console.log('Price not found in text:', priceText);
                }
            }
            
            // キーワードフィルター
            if (allKeywords.length > 0) {
                const cardText = card.textContent.toLowerCase();
                let hasKeyword = false;
                allKeywords.forEach(keyword => {
                    if (cardText.includes(keyword.toLowerCase())) {
                        hasKeyword = true;
                    }
                });
                if (!hasKeyword) {
                    isVisible = false;
                }
            }
            
            // 表示/非表示を設定
            if (isVisible) {
                cardContainer.style.display = '';
                visibleCount++;
            } else {
                cardContainer.style.display = 'none';
            }
        });
        
        // カウンター更新
        updateGuideCounter(visibleCount);
        
        console.log(`フィルタリング完了: ${visibleCount}枚のカード表示中`);
    }
    
    // ガイドカウンター更新関数
    function updateGuideCounter(count) {
        const countElement = document.getElementById('guide-count-number');
        if (countElement) {
            countElement.textContent = count;
        }
        
        const guideCountText = document.querySelector('.guide-counter');
        if (guideCountText) {
            const peopleIcon = '<i class="bi bi-people-fill me-2"></i>';
            guideCountText.innerHTML = `${peopleIcon}<span id="guide-count-number">${count}</span>人のガイドが見つかりました`;
        }
    }
    
    // リセット機能
    window.resetFilters = function() {
        console.log('フィルターリセット');
        
        if (locationFilter) locationFilter.value = '';
        if (languageFilter) languageFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (customKeywords) customKeywords.value = '';
        
        keywordCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // 全てのカードを表示
        const guideCards = document.querySelectorAll('.guide-card');
        guideCards.forEach(card => {
            const cardContainer = card.closest('.col-md-4');
            if (cardContainer) {
                cardContainer.style.display = '';
            }
        });
        
        // カウンター更新
        updateGuideCounter(guideCards.length);
    };
    
    // 検索機能
    window.searchGuides = function() {
        console.log('検索実行');
        filterGuides();
    };
    
    console.log('フィルター機能初期化完了');
});