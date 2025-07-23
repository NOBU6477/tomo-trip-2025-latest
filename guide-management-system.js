// スケーラブルガイド管理システム
console.log('ガイド管理システム初期化開始');

// ガイドデータベース（LocalStorageベース）
class GuideDatabase {
    constructor() {
        this.storageKey = 'tomoTrip_guides';
        this.initialize();
    }
    
    initialize() {
        // 初期ガイドデータ（基本12人）
        if (!localStorage.getItem(this.storageKey)) {
            const initialGuides = [
                {
                    id: 1,
                    name: '田中太郎',
                    location: '東京',
                    region: 'Tokyo',
                    description: '東京生まれ東京育ちの地元ガイド。隠れた名店と文化スポットを案内いたします。',
                    languages: ['日本語', '英語'],
                    price: 6000,
                    rating: 4.5,
                    keywords: ['ナイトツアー', 'グルメ', '撮影スポット'],
                    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=250&fit=crop',
                    created: new Date().toISOString(),
                    active: true
                },
                {
                    id: 2,
                    name: '佐藤花子',
                    location: '大阪',
                    region: 'Osaka',
                    description: '大阪の食文化と歴史に詳しいガイドです。本格的なたこ焼きとお好み焼き体験をご案内します。',
                    languages: ['日本語', '英語', '中国語'],
                    price: 6000,
                    rating: 4.8,
                    keywords: ['グルメ', '料理', 'アクティビティ'],
                    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
                    created: new Date().toISOString(),
                    active: true
                },
                {
                    id: 3,
                    name: '山田一郎',
                    location: '京都',
                    region: 'Kyoto',
                    description: '京都の伝統文化と寺院巡りの専門ガイド。茶道体験と着物レンタルも手配いたします。',
                    languages: ['日本語', '英語'],
                    price: 7000,
                    rating: 4.7,
                    keywords: ['撮影スポット', '料理', 'アクティビティ'],
                    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=250&fit=crop',
                    created: new Date().toISOString(),
                    active: true
                }
                // 追加の基本ガイドデータ...
            ];
            
            // 12人分の基本データを生成
            const regions = ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Aichi', 'Kanagawa', 'Hyogo', 'Fukuoka', 'Hiroshima'];
            const locations = ['東京', '大阪', '京都', '北海道', '愛知', '神奈川', '兵庫', '福岡', '広島'];
            const names = ['鈴木次郎', '高橋美咲', '伊藤健太', '渡辺さくら', '中村拓海', '小林あゆみ', '加藤大輔', '吉田麻衣', '山本直樹'];
            
            for (let i = 3; i < 12; i++) {
                const regionIndex = i % regions.length;
                initialGuides.push({
                    id: i + 1,
                    name: names[i - 3] || `ガイド${i + 1}`,
                    location: locations[regionIndex],
                    region: regions[regionIndex],
                    description: `${locations[regionIndex]}エリアの地元ガイドです。観光地から穴場スポットまで幅広くご案内いたします。`,
                    languages: ['日本語', '英語'],
                    price: 6000 + (Math.floor(Math.random() * 3) * 1000),
                    rating: 4.0 + Math.random() * 1,
                    keywords: ['ナイトツアー', 'グルメ', '撮影スポット', '料理', 'アクティビティ'].slice(0, Math.floor(Math.random() * 3) + 2),
                    photo: `https://images.unsplash.com/photo-${1544005313 + i}?w=400&h=250&fit=crop`,
                    created: new Date().toISOString(),
                    active: true
                });
            }
            
            this.saveGuides(initialGuides);
        }
    }
    
    getAllGuides() {
        const guides = localStorage.getItem(this.storageKey);
        return guides ? JSON.parse(guides) : [];
    }
    
    getActiveGuides() {
        return this.getAllGuides().filter(guide => guide.active);
    }
    
    addGuide(guideData) {
        const guides = this.getAllGuides();
        const newId = Math.max(...guides.map(g => g.id), 0) + 1;
        const newGuide = {
            ...guideData,
            id: newId,
            created: new Date().toISOString(),
            active: true
        };
        guides.push(newGuide);
        this.saveGuides(guides);
        return newGuide;
    }
    
    updateGuide(id, guideData) {
        const guides = this.getAllGuides();
        const index = guides.findIndex(g => g.id === id);
        if (index !== -1) {
            guides[index] = { ...guides[index], ...guideData, updated: new Date().toISOString() };
            this.saveGuides(guides);
            return guides[index];
        }
        return null;
    }
    
    deleteGuide(id) {
        const guides = this.getAllGuides();
        const updatedGuides = guides.filter(g => g.id !== id);
        this.saveGuides(updatedGuides);
    }
    
    saveGuides(guides) {
        localStorage.setItem(this.storageKey, JSON.stringify(guides));
    }
    
    filterGuides(filters) {
        let guides = this.getActiveGuides();
        
        // 地域フィルター
        if (filters.location) {
            guides = guides.filter(guide => guide.region === filters.location);
        }
        
        // 言語フィルター
        if (filters.language) {
            const languageMapping = {
                'Japanese': '日本語',
                'English': '英語',
                'Chinese': '中国語',
                'Korean': '韓国語',
                'French': 'フランス語'
            };
            const targetLanguage = languageMapping[filters.language] || filters.language;
            guides = guides.filter(guide => guide.languages.includes(targetLanguage));
        }
        
        // 価格フィルター
        if (filters.price) {
            guides = guides.filter(guide => {
                if (filters.price === 'under-6000') return guide.price < 6000;
                if (filters.price === '6000-10000') return guide.price >= 6000 && guide.price <= 10000;
                if (filters.price === 'over-10000') return guide.price > 10000;
                return true;
            });
        }
        
        // キーワードフィルター
        if (filters.keywords && filters.keywords.length > 0) {
            guides = guides.filter(guide => {
                return filters.keywords.some(keyword => 
                    guide.keywords.includes(keyword) || 
                    guide.description.includes(keyword) ||
                    guide.name.includes(keyword)
                );
            });
        }
        
        return guides;
    }
}

// グローバルインスタンス
window.guideDB = new GuideDatabase();

console.log('ガイド管理システム初期化完了 - ガイド数:', window.guideDB.getActiveGuides().length);