// 検索・フィルター機能モジュール
import { normalizeLocationToCode } from '../utils/location-utils.mjs';

// 改良された検索フィルター関数
export function applyAdvancedFilters(guides, filters) {
    let filteredGuides = [...guides];
    
    // ✅ 地域フィルター（高速化版: O(N)計算量）
    if (filters.location) {
        // フィルタ値を事前に正規化（1回のみ）
        const filterLocationCode = normalizeLocationToCode(filters.location);
        
        filteredGuides = filteredGuides.filter(guide => {
            // ガイドの位置情報をキャッシュ付きで正規化
            if (!guide._locCode) {
                guide._locCode = normalizeLocationToCode(guide.location || guide.prefecture || '');
            }
            
            // 正規化コードで高速比較
            if (guide._locCode === filterLocationCode) {
                return true;
            }
            
            // レガシーサポート（直接マッチ）
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