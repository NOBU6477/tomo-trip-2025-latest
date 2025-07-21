// ガイドカードマッピングシステム - 実際のガイドカードと選択データの対応
console.log('🗺️ ガイドカードマッピングシステム開始');

class GuideCardMapper {
    constructor() {
        this.guideMapping = {};
        this.init();
    }
    
    init() {
        // DOMContentLoaded後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.scanGuideCards());
        } else {
            this.scanGuideCards();
        }
        
        // 定期的にスキャン（新しいカードが追加された場合）
        setInterval(() => this.scanGuideCards(), 3000);
    }
    
    scanGuideCards() {
        console.log('🔍 ガイドカードスキャン開始');
        
        const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
        const newMapping = {};
        
        guideCards.forEach((card, index) => {
            try {
                const img = card.querySelector('img');
                if (!img) return;
                
                // ガイド名を抽出
                let guideName = this.extractGuideName(card);
                
                // 場所を抽出
                let location = this.extractLocation(card);
                
                // 評価を抽出
                let rating = this.extractRating(card);
                
                // 料金を抽出
                let price = this.extractPrice(card);
                
                // 専門分野を抽出
                let specialties = this.extractSpecialties(card);
                
                // ガイドIDを設定（index + 1ベース）
                const guideId = index + 1;
                
                newMapping[guideId] = {
                    name: guideName,
                    location: location,
                    rating: rating,
                    price: price,
                    specialties: specialties,
                    image: img.src,
                    cardElement: card,
                    cardIndex: index
                };
                
                console.log(`📋 ガイド${guideId}: ${guideName} (${location})`);
                
            } catch (error) {
                console.error(`❌ カード${index + 1}解析エラー:`, error);
            }
        });
        
        // マッピングを更新
        this.guideMapping = newMapping;
        
        // 実ガイドデータシステムを更新
        if (window.realGuideDataSystem) {
            window.realGuideDataSystem.updateFromMapping(this.guideMapping);
        }
        
        console.log(`✅ ${Object.keys(newMapping).length}件のガイドカードをマッピング`);
    }
    
    extractGuideName(card) {
        // ガイド名を抽出する複数の方法を試行
        const selectors = [
            '.card-title',
            'h5',
            'h4',
            'h6',
            '.guide-name',
            '.name'
        ];
        
        for (const selector of selectors) {
            const element = card.querySelector(selector);
            if (element && element.textContent.trim()) {
                let name = element.textContent.trim();
                // 評価（★）を除去
                name = name.replace(/\d+\.?\d*★?/g, '').trim();
                if (name.length > 0) {
                    return name;
                }
            }
        }
        
        // フォールバック: カード内のテキストから推測
        const textContent = card.textContent;
        const japaneseNamePattern = /([一-龯ひらがなカタカナ]{2,10})\s*([一-龯ひらがなカタカナ]{1,10})/;
        const match = textContent.match(japaneseNamePattern);
        if (match) {
            return match[0].trim();
        }
        
        return 'ガイド名未取得';
    }
    
    extractLocation(card) {
        // 場所を抽出
        const selectors = [
            '.text-muted',
            '.location',
            '.area'
        ];
        
        for (const selector of selectors) {
            const elements = card.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent.trim();
                if (text.includes('都') || text.includes('府') || text.includes('県')) {
                    return text;
                }
            }
        }
        
        // アイコン付きテキストを探す
        const geoElements = card.querySelectorAll('[class*="geo"], [class*="location"]');
        for (const element of geoElements) {
            const text = element.textContent.trim();
            if (text.length > 0) {
                return text;
            }
        }
        
        return '場所未設定';
    }
    
    extractRating(card) {
        // 評価を抽出
        const ratingPatterns = [
            /(\d+\.?\d*)\s*★/,
            /★\s*(\d+\.?\d*)/,
            /(\d+\.?\d*)\s*星/
        ];
        
        const text = card.textContent;
        for (const pattern of ratingPatterns) {
            const match = text.match(pattern);
            if (match) {
                return `${match[1]}★`;
            }
        }
        
        return '4.5★';
    }
    
    extractPrice(card) {
        // 料金を抽出
        const pricePatterns = [
            /¥\s*(\d+,?\d*)/,
            /(\d+,?\d*)\s*円/,
            /(\d+,?\d*)\s*\/\s*session/
        ];
        
        const text = card.textContent;
        for (const pattern of pricePatterns) {
            const match = text.match(pattern);
            if (match) {
                if (pattern.source.includes('¥')) {
                    return `¥${match[1]}/session`;
                } else if (pattern.source.includes('円')) {
                    return `¥${match[1]}/session`;
                } else {
                    return `¥${match[1]}/session`;
                }
            }
        }
        
        return '¥6,000/session';
    }
    
    extractSpecialties(card) {
        // バッジや専門分野を抽出
        const badges = card.querySelectorAll('.badge, .tag, .specialty');
        const specialties = [];
        
        badges.forEach(badge => {
            const text = badge.textContent.trim();
            if (text && text.length > 0 && !text.includes('★') && !text.includes('¥')) {
                specialties.push(text);
            }
        });
        
        // デフォルト専門分野
        if (specialties.length === 0) {
            specialties.push('観光案内', 'グルメ');
        }
        
        return specialties;
    }
    
    getGuideData(guideId) {
        return this.guideMapping[guideId] || {
            name: `ガイド ${guideId}`,
            location: '未設定',
            rating: '4.0★',
            price: '¥6,000/session',
            specialties: ['一般案内'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
        };
    }
    
    getAllGuideIds() {
        return Object.keys(this.guideMapping).map(id => parseInt(id));
    }
    
    debugMapping() {
        console.log('🔍 現在のガイドマッピング:');
        console.table(this.guideMapping);
        return this.guideMapping;
    }
}

// RealGuideDataSystemを拡張
if (window.realGuideDataSystem) {
    window.realGuideDataSystem.updateFromMapping = function(mapping) {
        console.log('🔄 ガイドデータベースを実際のカード情報で更新');
        
        // createEnhancedModalElement を更新
        this.createEnhancedModalElement = (type, title, info, guides, emptyMessage, t) => {
            const isBookmark = type === 'bookmark';
            const modalId = `unified-${type}-modal`;
            const isJapanese = window.unifiedManagementModal?.isJapanese ?? true;
            
            const modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal fade';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-labelledby', `${modalId}-title`);
            modal.setAttribute('aria-hidden', 'true');
            modal.style.zIndex = '1055';
            
            let guideListHTML = '';
            guides.forEach(guideId => {
                // 実際のカード情報を使用
                const realGuideData = window.guideCardMapper.getGuideData(guideId);
                
                guideListHTML += `
                    <div class="d-flex align-items-center justify-content-between p-3 border-bottom guide-management-item" data-guide-id="${guideId}">
                        <div class="d-flex align-items-center">
                            <div class="me-3">
                                <img src="${realGuideData.image}" 
                                     class="rounded-circle border" width="50" height="50" alt="${realGuideData.name}">
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-1 fw-bold">${realGuideData.name}</h6>
                                <div class="d-flex align-items-center mb-1">
                                    <small class="text-muted me-2">
                                        <i class="bi bi-geo-alt me-1"></i>${realGuideData.location}
                                    </small>
                                    <small class="text-warning me-2">${realGuideData.rating}</small>
                                    <small class="text-primary">${realGuideData.price}</small>
                                </div>
                                <div class="d-flex flex-wrap gap-1">
                                    ${realGuideData.specialties.slice(0, 2).map(specialty => 
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
                                        選択中: ${guides.length}${isBookmark ? 'つのブックマーク' : '人の比較対象'}
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
        };
    };
}

// グローバルインスタンス作成
window.guideCardMapper = new GuideCardMapper();

// デバッグ用関数
window.debugGuideMapping = () => window.guideCardMapper.debugMapping();

console.log('✅ Guide Card Mapper Loaded - 実際のガイドカード情報と連動します');