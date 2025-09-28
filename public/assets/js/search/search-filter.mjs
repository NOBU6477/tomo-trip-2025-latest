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

// ✅ 修正版: ガイドデータ準備完了を待つ非同期検索実行
export async function executeSearch() {
    console.log('🔍 Executing search with data readiness check...');
    
    try {
        // ✅ AppState.isFiltering フラグを設定
        if (window.AppState) {
            window.AppState.isFiltering = true;
            window.AppState.isFiltered = false;
        }
        
        // ✅ ガイドデータの読み込み完了を待機
        let guides = [];
        if (window.waitForGuideData) {
            guides = await window.waitForGuideData(5000); // 5秒待機
        } else {
            // フォールバック: 従来の方法
            guides = window.AppState?.originalGuides || window.AppState?.guides || window.guidesData || [];
        }
        
        console.log('📋 Available guides for search:', guides.length);
        
        if (guides.length === 0) {
            console.warn('⚠️ No guides available for search');
            
            // ✅ AppState更新
            if (window.AppState) {
                window.AppState.isFiltering = false;
                window.AppState.isFiltered = true;
                window.AppState.filteredGuides = [];
                window.AppState.guides = [];
            }
            
            if (window.renderGuideCards) {
                window.renderGuideCards([]);
            }
            return [];
        }
        
        const filters = getCurrentFilterValues();
        console.log('🔍 Applying filters:', filters);
        
        const filteredGuides = applyAdvancedFilters(guides, filters);
        
        console.log(`✅ Search completed: ${filteredGuides.length}/${guides.length} guides found`);
        
        // ✅ AppState with filtered results を適切に設定
        if (window.AppState) {
            window.AppState.isFiltering = false;
            window.AppState.isFiltered = true;
            window.AppState.filteredGuides = filteredGuides;
            window.AppState.guides = filteredGuides;
            window.AppState.currentPage = 1; // Reset to first page
        }
        
        // ガイドカードを再描画
        if (window.renderGuideCards) {
            window.renderGuideCards(filteredGuides);
        }
        
        // 結果セクションにスクロール
        const guideSection = document.getElementById('guideSection') || document.querySelector('.guide-cards-container');
        if (guideSection) {
            guideSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        return filteredGuides;
        
    } catch (error) {
        console.error('❌ Search execution error:', error);
        
        // ✅ エラー時のAppState更新
        if (window.AppState) {
            window.AppState.isFiltering = false;
            window.AppState.isFiltered = true;
            window.AppState.filteredGuides = [];
            window.AppState.guides = [];
        }
        
        // Show error state
        if (window.renderGuideCards) {
            window.renderGuideCards([]);
        }
        
        return [];
    }
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