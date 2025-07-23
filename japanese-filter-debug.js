// 日本語版フィルター診断・修正システム
console.log('日本語版フィルター診断システム開始');

document.addEventListener('DOMContentLoaded', function() {
    // フィルター要素の存在確認
    const filterElements = {
        locationFilter: document.getElementById('location-filter'),
        languageFilter: document.getElementById('language-filter'),
        priceFilter: document.getElementById('price-filter'),
        customKeywords: document.getElementById('custom-keywords'),
        keywordCheckboxes: document.querySelectorAll('.keyword-checkbox')
    };
    
    console.log('フィルター要素チェック:', filterElements);
    
    // 各フィルター要素にイベントリスナーを追加
    Object.keys(filterElements).forEach(key => {
        const element = filterElements[key];
        if (element) {
            if (key === 'keywordCheckboxes') {
                element.forEach((checkbox, index) => {
                    checkbox.addEventListener('change', function() {
                        console.log(`キーワードチェックボックス${index}変更:`, this.value, this.checked);
                        debugFilterGuides();
                    });
                });
            } else {
                element.addEventListener('change', function() {
                    console.log(`${key}変更:`, this.value);
                    debugFilterGuides();
                });
            }
        } else {
            console.error(`${key}が見つかりません`);
        }
    });
    
    // デバッグ版フィルタリング関数
    function debugFilterGuides() {
        console.log('=== デバッグフィルタリング開始 ===');
        
        const locationValue = filterElements.locationFilter ? filterElements.locationFilter.value : '';
        const languageValue = filterElements.languageFilter ? filterElements.languageFilter.value : '';
        const priceValue = filterElements.priceFilter ? filterElements.priceFilter.value : '';
        
        console.log('選択された値:', {
            location: locationValue,
            language: languageValue,
            price: priceValue
        });
        
        const guideCards = document.querySelectorAll('.guide-card');
        console.log('ガイドカード総数:', guideCards.length);
        
        let visibleCount = 0;
        
        guideCards.forEach((card, index) => {
            const cardContainer = card.closest('.col-md-4');
            if (!cardContainer) {
                console.warn(`カード${index}: 親コンテナが見つかりません`);
                return;
            }
            
            let isVisible = true;
            const reasons = [];
            
            // 地域チェック
            if (locationValue) {
                const locationElement = card.querySelector('.text-muted');
                const locationText = locationElement ? locationElement.textContent : '';
                console.log(`カード${index} 地域情報:`, locationText);
                
                // 地域マッピング
                const locationMapping = {
                    'Tokyo': '東京',
                    'Osaka': '大阪',
                    'Kyoto': '京都',
                    'Hokkaido': '北海道',
                    'Aichi': '愛知',
                    'Kanagawa': '神奈川',
                    'Hyogo': '兵庫',
                    'Fukuoka': '福岡'
                };
                
                const japaneseLocation = locationMapping[locationValue] || locationValue;
                if (!locationText.includes(japaneseLocation)) {
                    isVisible = false;
                    reasons.push(`地域不一致: ${locationValue}(${japaneseLocation}) vs ${locationText}`);
                }
            }
            
            // 言語チェック
            if (languageValue) {
                const languageBadges = card.querySelectorAll('.badge');
                console.log(`カード${index} 言語バッジ数:`, languageBadges.length);
                
                let hasLanguage = false;
                const languageMapping = {
                    'Japanese': '日本語',
                    'English': '英語', 
                    'Chinese': '中国語',
                    'Korean': '韓国語',
                    'French': 'フランス語'
                };
                
                const japaneseLanguage = languageMapping[languageValue] || languageValue;
                
                languageBadges.forEach(badge => {
                    console.log(`  バッジテキスト: "${badge.textContent}"`);
                    if (badge.textContent.includes(japaneseLanguage)) {
                        hasLanguage = true;
                    }
                });
                
                if (!hasLanguage) {
                    isVisible = false;
                    reasons.push(`言語不一致: ${languageValue}(${japaneseLanguage})`);
                }
            }
            
            // 価格チェック
            if (priceValue) {
                const priceElement = card.querySelector('.fw-bold.text-primary');
                const priceText = priceElement ? priceElement.textContent : '';
                console.log(`カード${index} 価格情報:`, priceText);
                
                const priceMatch = priceText.match(/¥([\d,]+)/);
                if (priceMatch) {
                    const price = parseInt(priceMatch[1].replace(',', ''));
                    console.log(`  抽出価格: ${price}`);
                    
                    if (priceValue === 'under-6000' && price >= 6000) {
                        isVisible = false;
                        reasons.push(`価格範囲外: ${price} >= 6000`);
                    } else if (priceValue === '6000-10000' && (price < 6000 || price > 10000)) {
                        isVisible = false;
                        reasons.push(`価格範囲外: ${price} not in 6000-10000`);
                    } else if (priceValue === 'over-10000' && price <= 10000) {
                        isVisible = false;
                        reasons.push(`価格範囲外: ${price} <= 10000`);
                    }
                }
            }
            
            // 表示/非表示設定
            if (isVisible) {
                cardContainer.style.display = '';
                visibleCount++;
                console.log(`カード${index}: 表示`);
            } else {
                cardContainer.style.display = 'none';
                console.log(`カード${index}: 非表示 - 理由: ${reasons.join(', ')}`);
            }
        });
        
        // カウンター更新
        const countElement = document.getElementById('guide-count-number');
        if (countElement) {
            countElement.textContent = visibleCount;
            console.log('カウンター更新:', visibleCount);
        }
        
        console.log(`=== フィルタリング完了: ${visibleCount}/${guideCards.length}枚表示 ===`);
    }
    
    console.log('日本語版フィルター診断システム初期化完了');
});