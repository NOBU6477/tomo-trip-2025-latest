// 検索・フィルター機能モジュール
import { matchLocationToCode, getPrefectureName } from '../ui/prefecture-selector.mjs';

// 改良された検索フィルター関数
export function applyAdvancedFilters(guides, filters) {
    let filteredGuides = [...guides];
    
    // 地域フィルター（改良版）
    if (filters.location) {
        filteredGuides = filteredGuides.filter(guide => {
            // 1. 直接コードマッチ
            const guideLocationCode = matchLocationToCode(guide.location);
            if (guideLocationCode === filters.location) {
                return true;
            }
            
            // 2. 都道府県名での部分マッチ
            const prefectureName = getPrefectureName(filters.location);
            if (guide.location && guide.location.includes(prefectureName)) {
                return true;
            }
            
            // 3. レガシーサポート
            return guide.location === filters.location || 
                   guide.prefecture === filters.location;
        });
    }
    
    // 言語フィルター（改良版）
    if (filters.language) {
        filteredGuides = filteredGuides.filter(guide => {
            if (!guide.languages) return false;
            
            // 配列の場合とそうでない場合を考慮
            if (Array.isArray(guide.languages)) {
                return guide.languages.includes(filters.language);
            } else {
                return guide.languages === filters.language;
            }
        });
    }
    
    // 価格フィルター
    if (filters.price) {
        filteredGuides = filteredGuides.filter(guide => {
            const price = parseInt(guide.sessionRate) || parseInt(guide.price) || 0;
            
            switch(filters.price) {
                case 'budget': 
                    return price >= 6000 && price <= 10000;
                case 'premium': 
                    return price >= 10001 && price <= 20000;
                case 'luxury': 
                    return price >= 20001;
                default: 
                    return true;
            }
        });
    }
    
    // キーワード検索
    if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredGuides = filteredGuides.filter(guide => {
            return (guide.name && guide.name.toLowerCase().includes(keyword)) ||
                   (guide.guideName && guide.guideName.toLowerCase().includes(keyword)) ||
                   (guide.specialties && guide.specialties.toLowerCase().includes(keyword)) ||
                   (guide.introduction && guide.introduction.toLowerCase().includes(keyword)) ||
                   (guide.location && guide.location.toLowerCase().includes(keyword));
        });
    }
    
    return filteredGuides;
}

// フィルター値を取得
export function getCurrentFilterValues() {
    return {
        location: document.getElementById('locationFilter')?.value || '',
        language: document.getElementById('languageFilter')?.value || '',
        price: document.getElementById('priceFilter')?.value || '',
        keyword: document.getElementById('keywordInput')?.value || ''
    };
}

// 検索実行
export function executeSearch() {
    if (!window.AppState || !window.AppState.guides) {
        console.warn('❌ AppState or guides not available for search');
        return;
    }
    
    const filters = getCurrentFilterValues();
    console.log('🔍 Applying filters:', filters);
    
    const filteredGuides = applyAdvancedFilters(window.AppState.guides, filters);
    
    console.log(`✅ Search completed: ${filteredGuides.length}/${window.AppState.guides.length} guides found`);
    
    // ガイドカードを再描画
    if (window.renderGuideCards) {
        window.renderGuideCards(filteredGuides);
    }
    
    // カウンターを更新
    if (window.updateGuideCounters) {
        window.updateGuideCounters(filteredGuides.length, window.AppState.guides.length);
    }
    
    // 結果セクションにスクロール
    const guideSection = document.getElementById('guideSection') || document.querySelector('.guide-cards-container');
    if (guideSection) {
        guideSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    return filteredGuides;
}

// フィルターリセット  
export function resetFilters() {
    document.getElementById('locationFilter').value = '';
    document.getElementById('languageFilter').value = '';
    document.getElementById('priceFilter').value = '';
    const keywordInput = document.getElementById('keywordInput');
    if (keywordInput) keywordInput.value = '';
    
    // 全ガイドを再表示
    if (window.AppState && window.AppState.guides && window.renderGuideCards) {
        window.renderGuideCards(window.AppState.guides);
        if (window.updateGuideCounters) {
            window.updateGuideCounters(window.AppState.guides.length, window.AppState.guides.length);
        }
    }
}