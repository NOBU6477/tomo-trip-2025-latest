// 実ガイドデータ表示システム
console.log('📋 実ガイドデータ表示システム開始');

class RealGuideDataSystem {
    constructor() {
        this.guideDatabase = this.createGuideDatabase();
        this.init();
    }
    
    init() {
        // 統一管理モーダルシステムの拡張
        this.enhanceUnifiedModal();
    }
    
    createGuideDatabase() {
        // 実際のガイドデータベース（サイトに表示されているガイド情報）
        return {
            1: {
                name: "田中 太郎",
                nameEn: "Tanaka Taro",
                location: "東京都",
                locationEn: "Tokyo",
                specialties: ["観光案内", "グルメ", "写真撮影"],
                specialtiesEn: ["Sightseeing", "Gourmet", "Photography"],
                rating: "4.8★",
                price: "¥6,000/session",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語"]
            },
            2: {
                name: "佐藤 花子",
                nameEn: "Sato Hanako",
                location: "京都府",
                locationEn: "Kyoto",
                specialties: ["歴史案内", "寺社仏閣", "茶道体験"],
                specialtiesEn: ["History", "Temples", "Tea Ceremony"],
                rating: "4.9★",
                price: "¥7,000/session",
                image: "https://images.unsplash.com/photo-1494790108755-2616b69215b1?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語", "中国語"]
            },
            3: {
                name: "山田 一郎",
                nameEn: "Yamada Ichiro",
                location: "大阪府",
                locationEn: "Osaka",
                specialties: ["ナイトツアー", "お好み焼き", "商店街案内"],
                specialtiesEn: ["Night Tour", "Okonomiyaki", "Shopping Streets"],
                rating: "4.7★",
                price: "¥6,500/session",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語"]
            },
            4: {
                name: "高橋 美咲",
                nameEn: "Takahashi Misaki",
                location: "神奈川県",
                locationEn: "Kanagawa",
                specialties: ["自然散策", "鎌倉案内", "アート巡り"],
                specialtiesEn: ["Nature Walking", "Kamakura Guide", "Art Tour"],
                rating: "4.6★",
                price: "¥6,200/session",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語", "フランス語"]
            },
            5: {
                name: "伊藤 健太",
                nameEn: "Ito Kenta",
                location: "愛知県",
                locationEn: "Aichi",
                specialties: ["産業観光", "味噌カツ", "名古屋城"],
                specialtiesEn: ["Industrial Tourism", "Miso Katsu", "Nagoya Castle"],
                rating: "4.5★",
                price: "¥5,800/session",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語"]
            },
            6: {
                name: "渡辺 雅子",
                nameEn: "Watanabe Masako",
                location: "北海道",
                locationEn: "Hokkaido",
                specialties: ["海鮮グルメ", "雪祭り", "温泉巡り"],
                specialtiesEn: ["Seafood Gourmet", "Snow Festival", "Hot Springs"],
                rating: "4.8★",
                price: "¥7,500/session",
                image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語", "韓国語"]
            },
            7: {
                name: "中村 拓也",
                nameEn: "Nakamura Takuya",
                location: "福岡県",
                locationEn: "Fukuoka",
                specialties: ["屋台文化", "ラーメン", "博多祇園山笠"],
                specialtiesEn: ["Street Food", "Ramen", "Hakata Festival"],
                rating: "4.7★",
                price: "¥6,300/session",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語"]
            },
            8: {
                name: "小林 真由美",
                nameEn: "Kobayashi Mayumi",
                location: "沖縄県",
                locationEn: "Okinawa",
                specialties: ["ビーチツアー", "沖縄料理", "三線体験"],
                specialtiesEn: ["Beach Tour", "Okinawan Cuisine", "Sanshin Experience"],
                rating: "4.9★",
                price: "¥8,000/session",
                image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語", "中国語"]
            },
            9: {
                name: "松本 和彦",
                nameEn: "Matsumoto Kazuhiko",
                location: "奈良県",
                locationEn: "Nara",
                specialties: ["古都散策", "鹿公園", "仏像鑑賞"],
                specialtiesEn: ["Ancient Capital", "Deer Park", "Buddha Statues"],
                rating: "4.6★",
                price: "¥6,800/session",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語", "ドイツ語"]
            },
            10: {
                name: "森田 知子",
                nameEn: "Morita Tomoko",
                location: "広島県",
                locationEn: "Hiroshima",
                specialties: ["平和記念公園", "お好み焼き", "宮島案内"],
                specialtiesEn: ["Peace Memorial", "Okonomiyaki", "Miyajima"],
                rating: "4.8★",
                price: "¥6,700/session",
                image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語"]
            },
            11: {
                name: "木村 大輔",
                nameEn: "Kimura Daisuke",
                location: "宮城県",
                locationEn: "Miyagi",
                specialties: ["牛タン", "松島", "震災復興ツアー"],
                specialtiesEn: ["Beef Tongue", "Matsushima", "Recovery Tour"],
                rating: "4.5★",
                price: "¥6,100/session",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語"]
            },
            12: {
                name: "井上 美香",
                nameEn: "Inoue Mika",
                location: "石川県",
                locationEn: "Ishikawa",
                specialties: ["金沢観光", "兼六園", "金箔体験"],
                specialtiesEn: ["Kanazawa Tour", "Kenrokuen", "Gold Leaf"],
                rating: "4.7★",
                price: "¥6,900/session",
                image: "https://images.unsplash.com/photo-1494790108755-2616b69215b1?w=60&h=60&fit=crop&crop=face",
                languages: ["日本語", "英語", "フランス語"]
            }
        };
    }
    
    getGuideData(guideId, language = 'ja') {
        const guide = this.guideDatabase[guideId];
        if (!guide) {
            return {
                name: language === 'ja' ? `ガイド ${guideId}` : `Guide ${guideId}`,
                location: language === 'ja' ? '未設定' : 'Not Set',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
                rating: '4.0★',
                price: '¥6,000/session',
                specialties: language === 'ja' ? ['一般案内'] : ['General Guide']
            };
        }
        
        return {
            name: language === 'ja' ? guide.name : guide.nameEn,
            location: language === 'ja' ? guide.location : guide.locationEn,
            image: guide.image,
            rating: guide.rating,
            price: guide.price,
            specialties: language === 'ja' ? guide.specialties : guide.specialtiesEn,
            languages: guide.languages
        };
    }
    
    enhanceUnifiedModal() {
        // 統一管理モーダルのcreatModalElement関数を拡張
        const originalCreateModalElement = window.unifiedManagementModal?.createModalElement;
        
        if (originalCreateModalElement) {
            window.unifiedManagementModal.createModalElement = (type, title, info, guides, emptyMessage, t) => {
                return this.createEnhancedModalElement(type, title, info, guides, emptyMessage, t);
            };
            console.log('✅ 統一管理モーダルを実ガイドデータ対応に拡張');
        }
        
        // 遅延実行でも試行
        setTimeout(() => {
            if (window.unifiedManagementModal && !window.unifiedManagementModal.enhanced) {
                const original = window.unifiedManagementModal.createModalElement;
                window.unifiedManagementModal.createModalElement = (type, title, info, guides, emptyMessage, t) => {
                    return this.createEnhancedModalElement(type, title, info, guides, emptyMessage, t);
                };
                window.unifiedManagementModal.enhanced = true;
                console.log('✅ 遅延実行で統一管理モーダルを拡張');
            }
        }, 1000);
    }
    
    createEnhancedModalElement(type, title, info, guides, emptyMessage, t) {
        const isBookmark = type === 'bookmark';
        const modalId = `unified-${type}-modal`;
        const isJapanese = window.unifiedManagementModal?.isJapanese ?? true;
        const language = isJapanese ? 'ja' : 'en';
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', `${modalId}-title`);
        modal.setAttribute('aria-hidden', 'true');
        modal.style.zIndex = '1055';
        
        let guideListHTML = '';
        guides.forEach(guideId => {
            const guideData = this.getGuideData(guideId, language);
            const specialtiesText = guideData.specialties.slice(0, 2).join(', ');
            
            guideListHTML += `
                <div class="d-flex align-items-center justify-content-between p-3 border-bottom guide-management-item" data-guide-id="${guideId}">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <img src="${guideData.image}" 
                                 class="rounded-circle border" width="50" height="50" alt="${guideData.name}">
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-bold">${guideData.name}</h6>
                            <div class="d-flex align-items-center mb-1">
                                <small class="text-muted me-2">
                                    <i class="bi bi-geo-alt me-1"></i>${guideData.location}
                                </small>
                                <small class="text-warning me-2">${guideData.rating}</small>
                                <small class="text-primary">${guideData.price}</small>
                            </div>
                            <div class="d-flex flex-wrap gap-1">
                                ${guideData.specialties.slice(0, 2).map(specialty => 
                                    `<span class="badge bg-light text-dark" style="font-size: 10px;">${specialty}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm remove-guide-btn" 
                            data-guide-id="${guideId}" data-type="${type}">
                        <i class="bi bi-x-circle me-1"></i>${t.removeBtn}
                    </button>
                </div>
            `;
        });
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content shadow-lg border-0">
                    <div class="modal-header bg-light border-bottom">
                        <h5 class="modal-title fw-bold" id="${modalId}-title">
                            <i class="bi bi-${isBookmark ? 'bookmark-star text-warning' : 'list-check text-primary'} me-2"></i>${title}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="alert alert-info border-0 bg-light">
                                <i class="bi bi-info-circle me-2"></i>${info}
                            </div>
                        </div>
                        <div id="${type}-guide-list" class="border rounded" style="max-height: 400px; overflow-y: auto;">
                            ${guides.length > 0 ? guideListHTML : `<div class="text-center py-4 text-muted">${emptyMessage}</div>`}
                        </div>
                        ${guides.length > 0 ? `
                            <div class="mt-3 text-center">
                                <small class="text-muted">
                                    ${isJapanese ? `選択中: ${guides.length}${isBookmark ? 'つのブックマーク' : '人の比較対象'}` : 
                                      `Selected: ${guides.length} ${isBookmark ? 'bookmarks' : 'guides for comparison'}`}
                                </small>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer bg-light border-top">
                        <button type="button" class="btn btn-outline-danger" id="clear-all-${type}">
                            <i class="bi bi-trash me-1"></i>${t.clearAllBtn}
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="bi bi-x-lg me-1"></i>${t.closeBtn}
                        </button>
                        ${!isBookmark ? `<button type="button" class="btn btn-primary" id="start-comparison">
                            <i class="bi bi-play-circle me-1"></i>${t.startComparisonBtn}
                        </button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
}

// グローバルインスタンス作成
window.realGuideDataSystem = new RealGuideDataSystem();

console.log('✅ Real Guide Data System Loaded - 実際のガイド情報が表示されます');