// キーワードフィルター強化システム
console.log('キーワードフィルター強化システム初期化');

document.addEventListener('DOMContentLoaded', function() {
    // キーワードフィルター機能を強化
    function enhanceKeywordFiltering() {
        console.log('キーワードフィルタリング強化開始');
        
        // 既存のsearchGuides関数を強化
        const originalSearchGuides = window.searchGuides;
        
        window.searchGuides = function() {
            console.log('強化されたキーワード検索実行');
            
            // スケーラブルシステムが利用可能な場合
            if (window.guideRenderer && window.guideDB) {
                const locationValue = document.getElementById('location-filter')?.value || '';
                const languageValue = document.getElementById('language-filter')?.value || '';
                const priceValue = document.getElementById('price-filter')?.value || '';
                
                // キーワード収集
                const checkedKeywords = [];
                document.querySelectorAll('.keyword-checkbox:checked').forEach(checkbox => {
                    checkedKeywords.push(checkbox.value);
                });
                
                // カスタムキーワード
                const customKeywords = document.getElementById('custom-keywords')?.value || '';
                const customKeywordList = customKeywords.split(',').map(k => k.trim()).filter(k => k);
                
                // 全てのキーワードを結合
                const allKeywords = [...checkedKeywords, ...customKeywordList];
                
                console.log('キーワードフィルター条件:', {
                    location: locationValue,
                    language: languageValue,
                    price: priceValue,
                    keywords: allKeywords
                });
                
                const filters = {
                    location: locationValue,
                    language: languageValue,
                    price: priceValue,
                    keywords: allKeywords
                };
                
                window.guideRenderer.renderFilteredGuides(filters);
                return;
            }
            
            // フォールバック：従来の方式
            if (originalSearchGuides) {
                originalSearchGuides();
            }
        };
        
        // キーワードチェックボックスの変更を監視
        document.querySelectorAll('.keyword-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log('キーワードチェックボックス変更:', this.value, this.checked);
                // リアルタイムフィルタリング
                setTimeout(() => {
                    window.searchGuides();
                }, 100);
            });
        });
        
        // カスタムキーワード入力の変更を監視
        const customKeywordInput = document.getElementById('custom-keywords');
        if (customKeywordInput) {
            customKeywordInput.addEventListener('input', function() {
                console.log('カスタムキーワード入力変更:', this.value);
                // デバウンス処理でリアルタイムフィルタリング
                clearTimeout(this.filterTimeout);
                this.filterTimeout = setTimeout(() => {
                    window.searchGuides();
                }, 500);
            });
        }
        
        console.log('キーワードフィルタリング強化完了');
    }
    
    // 初期化遅延実行
    setTimeout(enhanceKeywordFiltering, 1000);
});

// キーワード候補提案システム
class KeywordSuggestionSystem {
    constructor() {
        this.commonKeywords = [
            'ナイトツアー', 'グルメ', '撮影スポット', '料理', 'アクティビティ',
            '温泉', 'ハイキング', '寺院', '神社', '城', '博物館', '美術館',
            '桜', '紅葉', '雪景色', '海', '山', '川', '湖', '島',
            '買い物', 'ショッピング', 'お土産', '工芸', '体験', '文化',
            '歴史', '伝統', '現代', '都市', '田舎', '自然', '動物',
            '子供', '家族', 'カップル', '一人旅', 'グループ', '高齢者',
            '初心者', '上級者', '写真', '動画', 'SNS', 'インスタ映え'
        ];
        this.initialize();
    }
    
    initialize() {
        const customKeywordInput = document.getElementById('custom-keywords');
        if (customKeywordInput) {
            this.setupAutoComplete(customKeywordInput);
        }
    }
    
    setupAutoComplete(input) {
        // オートコンプリート機能の実装
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            const lastKeyword = value.split(',').pop().trim();
            
            if (lastKeyword.length >= 2) {
                const suggestions = this.getSuggestions(lastKeyword);
                this.showSuggestions(suggestions, input);
            } else {
                this.hideSuggestions();
            }
        });
    }
    
    getSuggestions(keyword) {
        return this.commonKeywords.filter(k => 
            k.toLowerCase().includes(keyword.toLowerCase())
        ).slice(0, 5);
    }
    
    showSuggestions(suggestions, input) {
        this.hideSuggestions();
        
        if (suggestions.length === 0) return;
        
        const suggestionList = document.createElement('div');
        suggestionList.className = 'keyword-suggestions';
        suggestionList.style.cssText = `
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            width: ${input.offsetWidth}px;
        `;
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.textContent = suggestion;
            item.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f5f5f5';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion, input);
            });
            suggestionList.appendChild(item);
        });
        
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(suggestionList);
    }
    
    selectSuggestion(suggestion, input) {
        const currentValue = input.value;
        const keywords = currentValue.split(',');
        keywords[keywords.length - 1] = suggestion;
        input.value = keywords.join(', ');
        this.hideSuggestions();
        
        // フィルタリング実行
        setTimeout(() => {
            if (window.searchGuides) {
                window.searchGuides();
            }
        }, 100);
    }
    
    hideSuggestions() {
        const existing = document.querySelector('.keyword-suggestions');
        if (existing) {
            existing.remove();
        }
    }
}

// キーワード候補システム初期化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.keywordSuggestionSystem = new KeywordSuggestionSystem();
    }, 1500);
});

console.log('キーワードフィルター強化システム初期化完了');