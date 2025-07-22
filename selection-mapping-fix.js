// 選択マッピング修正システム - 実際の選択とガイドIDの正確な対応
console.log('🎯 選択マッピング修正システム開始');

class SelectionMappingFix {
    constructor() {
        this.actualSelections = new Set(); // 実際に選択されたガイドID
        this.guideNameToId = new Map(); // ガイド名からIDのマッピング
        this.idToGuideName = new Map(); // IDからガイド名のマッピング
        this.init();
    }
    
    init() {
        // 比較・ブックマークシステムの選択を監視
        this.interceptSelectionEvents();
        
        // 既存の選択状態を調査
        this.analyzeCurrentSelections();
        
        // 定期的にマッピングを更新
        setInterval(() => this.updateMapping(), 2000);
    }
    
    interceptSelectionEvents() {
        // ボタンクリックイベントを監視
        document.addEventListener('click', (event) => {
            const target = event.target.closest('.compare-btn, .bookmark-btn');
            if (!target) return;
            
            const guideId = target.getAttribute('data-guide-id');
            const isCompareBtn = target.classList.contains('compare-btn');
            const isBookmarkBtn = target.classList.contains('bookmark-btn');
            
            console.log(`📋 選択イベント検出: ガイドID ${guideId} (${isCompareBtn ? '比較' : 'ブックマーク'})`);
            
            // 実際のガイド情報を取得
            const guideCard = this.findGuideCardByButton(target);
            if (guideCard) {
                const realGuideName = this.extractRealGuideName(guideCard);
                console.log(`✅ 実際のガイド名: ${realGuideName}`);
                
                // マッピングを更新
                this.guideNameToId.set(realGuideName, guideId);
                this.idToGuideName.set(guideId, realGuideName);
                
                // 選択状態を記録
                if (target.classList.contains('active') || target.style.backgroundColor.includes('28a745')) {
                    this.actualSelections.add(guideId);
                    console.log(`➕ ガイド${guideId}(${realGuideName})を選択に追加`);
                } else {
                    this.actualSelections.delete(guideId);
                    console.log(`➖ ガイド${guideId}(${realGuideName})を選択から削除`);
                }
            }
        });
    }
    
    findGuideCardByButton(button) {
        // ボタンから親のガイドカードを見つける
        let current = button;
        while (current && current !== document.body) {
            if (current.classList.contains('guide-card') || 
                current.classList.contains('card') || 
                current.querySelector('img')) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }
    
    extractRealGuideName(card) {
        // カードから実際のガイド名を抽出
        const nameSelectors = [
            '.card-title',
            'h5',
            'h4',
            'h6',
            '.guide-name',
            '.name',
            '.fw-bold'
        ];
        
        for (const selector of nameSelectors) {
            const element = card.querySelector(selector);
            if (element && element.textContent.trim()) {
                let name = element.textContent.trim();
                // 評価やその他の不要なテキストを除去
                name = name.replace(/\d+\.?\d*★?/g, '').trim();
                name = name.replace(/¥\d+/g, '').trim();
                name = name.replace(/\//g, '').trim();
                name = name.replace(/session/g, '').trim();
                
                if (name.length > 0 && name.length < 20) {
                    return name;
                }
            }
        }
        
        // フォールバック: すべてのテキストから日本語名を抽出
        const allText = card.textContent;
        const japaneseNamePattern = /([一-龯]{1,3}[\s]*[一-龯]{1,3})/g;
        const matches = allText.match(japaneseNamePattern);
        
        if (matches) {
            for (const match of matches) {
                const cleanName = match.trim();
                if (cleanName.length >= 2 && cleanName.length <= 8) {
                    return cleanName;
                }
            }
        }
        
        return 'ガイド名未取得';
    }
    
    trackSelection(guideId, type, isSelected) {
        console.log(`🎯 選択追跡: ガイド${guideId}, タイプ=${type}, 選択=${isSelected}`);
        
        // 実際のガイドデータを取得
        const guideData = this.extractGuideDataFromCard(guideId);
        
        // 選択情報をマッピングテーブルに保存
        if (!this.selectionMapping[guideId]) {
            this.selectionMapping[guideId] = {
                realData: guideData
            };
        }
        
        this.selectionMapping[guideId][type] = isSelected;
        this.selectionMapping[guideId].realData = guideData; // 最新データで更新
        
        // LocalStorageにも保存
        localStorage.setItem('selectionMapping', JSON.stringify(this.selectionMapping));
        
        console.log(`📝 選択データ保存: ${guideData.name} (${guideData.location})`);
    }
    
    extractGuideDataFromCard(guideId) {
        // 実際のガイドカードからデータを抽出
        const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
        const targetCard = Array.from(guideCards).find((card, index) => {
            return (index + 1) === parseInt(guideId);
        });
        
        if (targetCard) {
            const img = targetCard.querySelector('img');
            const nameElement = targetCard.querySelector('h5, h6, .card-title, [class*="name"], strong');
            const locationElement = targetCard.querySelector('[class*="location"], .text-muted, small');
            const priceElement = targetCard.querySelector('[class*="price"], .text-success, .fw-bold, .text-primary');
            const ratingElement = targetCard.querySelector('.badge, [class*="rating"], .text-warning');
            
            // より精密な名前抽出
            let name = 'Unknown Guide';
            if (nameElement) {
                name = nameElement.textContent.trim();
                // 余分な文字を除去
                name = name.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ');
            }
            
            // より精密な場所抽出
            let location = '東京都';
            if (locationElement) {
                location = locationElement.textContent.trim();
                // 都道府県名を抽出
                const locationMatch = location.match(/(東京都|[一-龯]+(県|府|道))/);
                if (locationMatch) {
                    location = locationMatch[0];
                }
            }
            
            // 価格抽出
            let price = 8000;
            if (priceElement) {
                const priceText = priceElement.textContent;
                const priceMatch = priceText.match(/¥?(\d{1,3}(?:,\d{3})*)/);
                if (priceMatch) {
                    price = parseInt(priceMatch[1].replace(',', ''));
                }
            }
            
            // 評価抽出
            let rating = 4.5;
            if (ratingElement) {
                const ratingText = ratingElement.textContent;
                const ratingMatch = ratingText.match(/(\d+\.?\d*)★?/);
                if (ratingMatch) {
                    rating = parseFloat(ratingMatch[1]);
                }
            }
            
            const extractedData = {
                id: guideId,
                name: name,
                location: location,
                image: img ? img.src : 'https://via.placeholder.com/150x150',
                price: price,
                rating: rating,
                extractedAt: new Date().toISOString()
            };
            
            console.log(`📊 抽出データ[ガイド${guideId}]:`, extractedData);
            return extractedData;
        }
        
        // フォールバックデータ
        return {
            id: guideId,
            name: `ガイド${guideId}`,
            location: '東京都',
            image: 'https://via.placeholder.com/150x150',
            price: 8000,
            rating: 4.5,
            extractedAt: new Date().toISOString()
        };
    }
    
    analyzeCurrentSelections() {
        // 現在の選択状態を分析
        console.log('🔍 現在の選択状態を分析中...');
        
        // アクティブなボタンを探す
        const activeButtons = document.querySelectorAll('.compare-btn.active, .bookmark-btn.active, [style*="rgb(40, 167, 69)"]');
        
        activeButtons.forEach(button => {
            const guideId = button.getAttribute('data-guide-id');
            const guideCard = this.findGuideCardByButton(button);
            
            if (guideCard && guideId) {
                const realName = this.extractRealGuideName(guideCard);
                this.actualSelections.add(guideId);
                this.guideNameToId.set(realName, guideId);
                this.idToGuideName.set(guideId, realName);
                
                console.log(`🎯 発見: ガイド${guideId} = ${realName} (選択中)`);
            }
        });
        
        // LocalStorageの状態も確認
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        const comparisons = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        console.log('📚 LocalStorage状態:', { bookmarks, comparisons });
    }
    
    updateMapping() {
        // 全てのガイドカードを再スキャンしてマッピングを更新
        const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
        
        guideCards.forEach((card, index) => {
            const img = card.querySelector('img');
            if (!img) return;
            
            const guideId = (index + 1).toString();
            const realName = this.extractRealGuideName(card);
            
            if (realName !== 'ガイド名未取得') {
                this.guideNameToId.set(realName, guideId);
                this.idToGuideName.set(guideId, realName);
            }
        });
    }
    
    getRealGuideData(guideId) {
        const realName = this.idToGuideName.get(guideId.toString());
        
        if (realName) {
            // 実際のガイドカードから詳細情報を取得
            const guideCards = document.querySelectorAll('.guide-card, .card, [class*="card"]');
            
            for (const card of guideCards) {
                const cardName = this.extractRealGuideName(card);
                if (cardName === realName) {
                    return this.extractCompleteGuideData(card, guideId);
                }
            }
        }
        
        return {
            name: `ガイド ${guideId}`,
            location: '場所未設定',
            rating: '4.0★',
            price: '¥6,000/session',
            specialties: ['一般案内'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
        };
    }
    
    extractCompleteGuideData(card, guideId) {
        const name = this.extractRealGuideName(card);
        const img = card.querySelector('img');
        
        // 場所を抽出
        let location = '場所未設定';
        const locationElements = card.querySelectorAll('.text-muted, small');
        for (const el of locationElements) {
            const text = el.textContent.trim();
            if (text.includes('都') || text.includes('府') || text.includes('県')) {
                location = text;
                break;
            }
        }
        
        // 評価を抽出
        let rating = '4.0★';
        const ratingMatch = card.textContent.match(/(\d+\.?\d*)\s*★/);
        if (ratingMatch) {
            rating = `${ratingMatch[1]}★`;
        }
        
        // 料金を抽出
        let price = '¥6,000/session';
        const priceMatch = card.textContent.match(/¥\s*(\d+,?\d*)/);
        if (priceMatch) {
            price = `¥${priceMatch[1]}/session`;
        }
        
        // 専門分野を抽出
        const badges = card.querySelectorAll('.badge, .tag');
        const specialties = [];
        badges.forEach(badge => {
            const text = badge.textContent.trim();
            if (text && !text.includes('★') && !text.includes('¥')) {
                specialties.push(text);
            }
        });
        
        if (specialties.length === 0) {
            specialties.push('観光案内', 'グルメ');
        }
        
        return {
            name,
            location,
            rating,
            price,
            specialties,
            image: img ? img.src : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
        };
    }
    
    getSelectedGuideIds() {
        return Array.from(this.actualSelections);
    }
    
    debugMappingInfo() {
        console.log('🔍 マッピング情報:');
        console.log('📋 実際の選択:', Array.from(this.actualSelections));
        console.log('🏷️ 名前→ID:', Object.fromEntries(this.guideNameToId));
        console.log('🆔 ID→名前:', Object.fromEntries(this.idToGuideName));
        
        return {
            selections: Array.from(this.actualSelections),
            nameToId: Object.fromEntries(this.guideNameToId),
            idToName: Object.fromEntries(this.idToGuideName)
        };
    }
}

// グローバルインスタンス
window.selectionMappingFix = new SelectionMappingFix();

// 統一管理モーダルシステムと連携
if (window.unifiedManagementModal) {
    const originalCreateModalElement = window.unifiedManagementModal.createModalElement;
    
    window.unifiedManagementModal.createModalElement = function(type, title, info, guides, emptyMessage, t) {
        console.log(`🔄 モーダル作成: ${type}, ガイド数: ${guides.length}`);
        console.log('📋 選択されたガイドIDs:', guides);
        
        const isBookmark = type === 'bookmark';
        const modalId = `unified-${type}-modal`;
        const isJapanese = this.isJapanese ?? true;
        
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', `${modalId}-title`);
        modal.setAttribute('aria-hidden', 'true');
        modal.style.zIndex = '1055';
        
        let guideListHTML = '';
        guides.forEach(guideId => {
            // 実際の選択マッピングデータを使用
            const realGuideData = window.selectionMappingFix.getRealGuideData(guideId);
            
            console.log(`📋 ガイド${guideId}の実データ:`, realGuideData);
            
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
    };
}

// デバッグ用関数
window.debugSelectionMapping = () => window.selectionMappingFix.debugMappingInfo();

console.log('✅ Selection Mapping Fix Loaded - 実際の選択状況を正確に反映します');