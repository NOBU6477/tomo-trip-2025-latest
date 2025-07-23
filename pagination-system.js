// ページネーションシステム（12人表示・比較機能付き）
console.log('ページネーションシステム初期化開始');

class PaginationSystem {
    constructor() {
        this.currentPage = 1;
        this.guidesPerPage = 12;
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('tomoTrip_bookmarks') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('tomoTrip_compared') || '[]');
        this.viewHistory = JSON.parse(localStorage.getItem('tomoTrip_history') || '[]');
        this.isMobile = window.innerWidth <= 768;
        
        this.initialize();
    }
    
    initialize() {
        console.log('ページネーション初期化');
        this.createPaginationControls();
        this.setupEventListeners();
        this.loadDefaultGuides();
        this.renderCurrentPage();
        this.updateToolbar();
    }
    
    // デフォルト12人のガイドデータ
    getDefaultGuides() {
        return [
            {
                id: 'default_1',
                name: '田中 健一',
                location: '東京都',
                region: 'Tokyo',
                price: 8000,
                rating: 4.8,
                languages: ['日本語', '英語'],
                keywords: ['グルメ', '撮影スポット', '文化体験'],
                description: '東京の隠れた名所をご案内します。地元民だけが知るグルメスポットから、インスタ映えする撮影スポットまで幅広くご紹介。',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_2',
                name: '佐藤 美咲',
                location: '京都府',
                region: 'Kyoto',
                price: 7500,
                rating: 4.9,
                languages: ['日本語', '英語', '中国語'],
                keywords: ['寺院', '神社', '伝統文化'],
                description: '古都京都の魅力をお伝えします。有名な観光地だけでなく、地元の人しか知らない静寂な寺院もご案内。',
                photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_3',
                name: '山田 隆',
                location: '大阪府',
                region: 'Osaka',
                price: 6500,
                rating: 4.7,
                languages: ['日本語', '韓国語'],
                keywords: ['グルメ', 'ナイトツアー', 'お笑い'],
                description: '大阪の「食い倒れ」文化をご体験ください。本場のたこ焼き、お好み焼きから隠れた名店まで。',
                photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_4',
                name: '鈴木 花子',
                location: '北海道',
                region: 'Hokkaido',
                price: 9000,
                rating: 4.6,
                languages: ['日本語', '英語'],
                keywords: ['自然', '温泉', '海鮮'],
                description: '北海道の大自然と新鮮な海の幸をご案内。四季折々の美しい景色と温泉でリラックス。',
                photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_5',
                name: '高橋 誠',
                location: '沖縄県',
                region: 'Okinawa',
                price: 8500,
                rating: 4.8,
                languages: ['日本語', '英語'],
                keywords: ['海', 'ダイビング', '島文化'],
                description: '美しい沖縄の海と独特な文化をご紹介。シュノーケリングから伝統工芸体験まで。',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_6',
                name: '伊藤 あゆみ',
                location: '神奈川県',
                region: 'Kanagawa',
                price: 7000,
                rating: 4.5,
                languages: ['日本語', '英語'],
                keywords: ['温泉', '山', 'ハイキング'],
                description: '箱根・鎌倉エリアの自然と歴史をご案内。温泉でのんびりと日本文化を体験。',
                photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_7',
                name: '渡辺 大輔',
                location: '広島県',
                region: 'Hiroshima',
                price: 7200,
                rating: 4.7,
                languages: ['日本語', '英語'],
                keywords: ['歴史', '平和', 'グルメ'],
                description: '広島の歴史と平和の大切さを学びながら、名物のお好み焼きや牡蠣もお楽しみください。',
                photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_8',
                name: '中村 麻衣',
                location: '奈良県',
                region: 'Nara',
                price: 6800,
                rating: 4.6,
                languages: ['日本語', '中国語'],
                keywords: ['寺院', '鹿', '歴史'],
                description: '古都奈良の歴史ある寺院と愛らしい鹿たちとのふれあいをお楽しみください。',
                photo: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_9',
                name: '小林 健太',
                location: '福岡県',
                region: 'Fukuoka',
                price: 6900,
                rating: 4.4,
                languages: ['日本語', '韓国語'],
                keywords: ['グルメ', 'ナイトツアー', '屋台'],
                description: '博多の屋台文化と九州グルメをご堪能ください。夜の中洲で本場の味を。',
                photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_10',
                name: '加藤 さくら',
                location: '宮城県',
                region: 'Miyagi',
                price: 7400,
                rating: 4.5,
                languages: ['日本語', '英語'],
                keywords: ['自然', '温泉', '海鮮'],
                description: '仙台と松島の美しい景色、温泉、新鮮な海の幸をお楽しみください。',
                photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_11',
                name: '松本 浩二',
                location: '長野県',
                region: 'Nagano',
                price: 8200,
                rating: 4.7,
                languages: ['日本語', 'ドイツ語'],
                keywords: ['山', 'ハイキング', '温泉'],
                description: '日本アルプスの雄大な景色と温泉をお楽しみください。四季の美しさを体験。',
                photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'default_12',
                name: '林 美和',
                location: '石川県',
                region: 'Ishikawa',
                price: 7800,
                rating: 4.8,
                languages: ['日本語', '英語'],
                keywords: ['伝統工芸', '金箔', '庭園'],
                description: '金沢の伝統工芸と美しい庭園をご案内。金箔体験や兼六園での四季の移ろいを。',
                photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face'
            }
        ];
    }
    
    loadDefaultGuides() {
        // デフォルトガイドとスケーラブルシステムのガイドを統合
        const defaultGuides = this.getDefaultGuides();
        const scalableGuides = window.guideDB ? window.guideDB.getAllGuides() : [];
        
        // デフォルトガイドにスケーラブルガイドを追加
        this.allGuides = [...defaultGuides, ...scalableGuides];
        
        console.log(`総ガイド数: ${this.allGuides.length}人`);
    }
    
    createPaginationControls() {
        const guidesSection = document.getElementById('guides');
        if (!guidesSection) return;
        
        // ページネーションコントロールHTML
        const paginationHTML = `
            <div class="pagination-container mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="guide-counter-info">
                        <span id="current-page-info" class="text-primary fw-bold">
                            ページ1 (1-12人)
                        </span>
                    </div>
                    <div class="pagination-controls">
                        <button class="btn btn-outline-primary btn-sm me-2" id="prevPageBtn" disabled>
                            <i class="bi bi-chevron-left"></i> 前へ
                        </button>
                        <span id="page-indicator" class="mx-3">1 / 1</span>
                        <button class="btn btn-outline-primary btn-sm ms-2" id="nextPageBtn" disabled>
                            次へ <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="mobile-pagination-controls d-md-none mb-3">
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-primary w-100" id="mobilePrevBtn" disabled>
                                <i class="bi bi-chevron-left"></i> 前のページ
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-primary w-100" id="mobileNextBtn" disabled>
                                次のページ <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-center mt-2">
                        <span id="mobile-page-info" class="text-primary fw-bold">ページ 1 / 1</span>
                    </div>
                </div>
            </div>
        `;
        
        // フィルターボタンの後に挿入
        const filterToggleBtn = document.getElementById('filterToggleBtn');
        if (filterToggleBtn && filterToggleBtn.parentNode) {
            filterToggleBtn.parentNode.insertAdjacentHTML('afterend', paginationHTML);
        }
    }
    
    setupEventListeners() {
        // ページネーションボタン
        document.getElementById('prevPageBtn')?.addEventListener('click', () => this.goToPreviousPage());
        document.getElementById('nextPageBtn')?.addEventListener('click', () => this.goToNextPage());
        document.getElementById('mobilePrevBtn')?.addEventListener('click', () => this.goToPreviousPage());
        document.getElementById('mobileNextBtn')?.addEventListener('click', () => this.goToNextPage());
        
        // リセットボタンのイベント上書き
        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.removeEventListener('click', window.resetFilters);
            resetBtn.addEventListener('click', () => this.resetToDefault());
        }
        
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && this.currentPage > 1) {
                this.goToPreviousPage();
            } else if (e.key === 'ArrowRight' && this.currentPage < this.getTotalPages()) {
                this.goToNextPage();
            }
        });
    }
    
    renderCurrentPage() {
        const startIndex = (this.currentPage - 1) * this.guidesPerPage;
        const endIndex = Math.min(startIndex + this.guidesPerPage, this.allGuides.length);
        const currentGuides = this.allGuides.slice(startIndex, endIndex);
        
        // ガイドカード表示
        this.renderGuideCards(currentGuides);
        
        // ページネーション情報更新
        this.updatePaginationInfo();
        
        // ガイド数表示更新
        this.updateGuideCounter();
    }
    
    renderGuideCards(guides) {
        const guidesContainer = document.getElementById('guides-container');
        if (!guidesContainer) return;
        
        guidesContainer.innerHTML = '';
        
        guides.forEach(guide => {
            const isBookmarked = this.bookmarkedGuides.includes(guide.id);
            const isCompared = this.comparedGuides.includes(guide.id);
            
            const cardHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card guide-card h-100 position-relative" data-guide-id="${guide.id}">
                        <!-- ブックマーク・比較アイコン -->
                        <div class="guide-actions position-absolute" style="top: 10px; right: 10px; z-index: 10;">
                            <button class="btn btn-sm ${isBookmarked ? 'btn-warning' : 'btn-outline-warning'} me-1 bookmark-btn" 
                                    onclick="paginationSystem.toggleBookmark('${guide.id}')" 
                                    title="ブックマーク">
                                <i class="bi ${isBookmarked ? 'bi-star-fill' : 'bi-star'}"></i>
                            </button>
                            <button class="btn btn-sm ${isCompared ? 'btn-success' : 'btn-outline-success'} compare-btn" 
                                    onclick="paginationSystem.toggleCompare('${guide.id}')" 
                                    title="比較に追加">
                                <i class="bi ${isCompared ? 'bi-check-circle-fill' : 'bi-check-circle'}"></i>
                            </button>
                        </div>
                        
                        <img src="${guide.photo}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${guide.name}">
                        <div class="card-body">
                            <h5 class="card-title">${guide.name}</h5>
                            <p class="card-text">
                                <i class="bi bi-geo-alt text-primary"></i> ${guide.location}<br>
                                <i class="bi bi-chat-dots text-info"></i> ${guide.languages.join(', ')}<br>
                                <i class="bi bi-tags text-success"></i> ${guide.keywords.join(', ')}
                            </p>
                            <p class="card-text">${guide.description}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <div class="guide-price">
                                <span class="fw-bold text-primary fs-5">¥${guide.price.toLocaleString()}</span>
                                <small class="text-muted">/日</small>
                            </div>
                            <div class="guide-rating">
                                <i class="bi bi-star-fill text-warning"></i>
                                <span>${guide.rating}</span>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="paginationSystem.viewGuideDetails('${guide.id}')">
                                詳細を見る
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            guidesContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
    
    updatePaginationInfo() {
        const totalPages = this.getTotalPages();
        const startGuide = (this.currentPage - 1) * this.guidesPerPage + 1;
        const endGuide = Math.min(this.currentPage * this.guidesPerPage, this.allGuides.length);
        
        // デスクトップ用
        document.getElementById('current-page-info').textContent = 
            `ページ${this.currentPage} (${startGuide}-${endGuide}人)`;
        document.getElementById('page-indicator').textContent = 
            `${this.currentPage} / ${totalPages}`;
        
        // モバイル用
        document.getElementById('mobile-page-info').textContent = 
            `ページ ${this.currentPage} / ${totalPages}`;
        
        // ボタン状態更新
        const prevBtns = [document.getElementById('prevPageBtn'), document.getElementById('mobilePrevBtn')];
        const nextBtns = [document.getElementById('nextPageBtn'), document.getElementById('mobileNextBtn')];
        
        prevBtns.forEach(btn => {
            if (btn) btn.disabled = this.currentPage <= 1;
        });
        
        nextBtns.forEach(btn => {
            if (btn) btn.disabled = this.currentPage >= totalPages;
        });
    }
    
    updateGuideCounter() {
        const counterElement = document.getElementById('guide-count-number');
        if (counterElement) {
            counterElement.textContent = this.allGuides.length;
        }
    }
    
    updateToolbar() {
        // フローティングツールバー更新
        const bookmarkCount = document.querySelector('.floating-toolbar .bookmark-count');
        const compareCount = document.querySelector('.floating-toolbar .compare-count');
        
        if (bookmarkCount) {
            bookmarkCount.textContent = this.bookmarkedGuides.length;
        }
        
        if (compareCount) {
            compareCount.textContent = this.comparedGuides.length;
        }
    }
    
    getTotalPages() {
        return Math.ceil(this.allGuides.length / this.guidesPerPage);
    }
    
    goToNextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
            this.renderCurrentPage();
        }
    }
    
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderCurrentPage();
        }
    }
    
    resetToDefault() {
        console.log('デフォルト状態にリセット');
        
        // フィルターリセット
        const locationFilter = document.getElementById('location-filter');
        const languageFilter = document.getElementById('language-filter');
        const priceFilter = document.getElementById('price-filter');
        
        if (locationFilter) locationFilter.value = '';
        if (languageFilter) languageFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        
        // キーワードチェックボックスリセット
        document.querySelectorAll('.keyword-checkbox').forEach(cb => cb.checked = false);
        
        // カスタムキーワードリセット
        const customKeywords = document.getElementById('custom-keywords');
        if (customKeywords) customKeywords.value = '';
        
        // 全ガイド表示に戻す
        this.loadDefaultGuides();
        this.currentPage = 1;
        this.renderCurrentPage();
        
        // フィルターパネルを閉じる
        const filterCard = document.getElementById('filter-card');
        if (filterCard) {
            filterCard.classList.add('d-none');
        }
    }
    
    toggleBookmark(guideId) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        if (index === -1) {
            this.bookmarkedGuides.push(guideId);
        } else {
            this.bookmarkedGuides.splice(index, 1);
        }
        
        localStorage.setItem('tomoTrip_bookmarks', JSON.stringify(this.bookmarkedGuides));
        this.renderCurrentPage();
        this.updateToolbar();
        
        // 履歴に追加
        this.addToHistory(guideId, 'bookmark');
    }
    
    toggleCompare(guideId) {
        const index = this.comparedGuides.indexOf(guideId);
        if (index === -1) {
            if (this.comparedGuides.length >= 3) {
                alert('比較できるガイドは最大3人までです。');
                return;
            }
            this.comparedGuides.push(guideId);
        } else {
            this.comparedGuides.splice(index, 1);
        }
        
        localStorage.setItem('tomoTrip_compared', JSON.stringify(this.comparedGuides));
        this.renderCurrentPage();
        this.updateToolbar();
        
        // 履歴に追加
        this.addToHistory(guideId, 'compare');
    }
    
    viewGuideDetails(guideId) {
        const guide = this.allGuides.find(g => g.id === guideId);
        if (guide) {
            alert(`ガイド詳細\n\n名前: ${guide.name}\n地域: ${guide.location}\n料金: ¥${guide.price.toLocaleString()}\n言語: ${guide.languages.join(', ')}\nキーワード: ${guide.keywords.join(', ')}\n評価: ${guide.rating}/5\n\n${guide.description}`);
            
            // 履歴に追加
            this.addToHistory(guideId, 'view');
        }
    }
    
    addToHistory(guideId, action) {
        const historyItem = {
            guideId,
            action,
            timestamp: new Date().toISOString()
        };
        
        this.viewHistory.unshift(historyItem);
        this.viewHistory = this.viewHistory.slice(0, 50); // 最新50件まで
        
        localStorage.setItem('tomoTrip_history', JSON.stringify(this.viewHistory));
    }
    
    showBookmarks() {
        const bookmarkedGuides = this.allGuides.filter(g => this.bookmarkedGuides.includes(g.id));
        if (bookmarkedGuides.length === 0) {
            alert('ブックマークされたガイドはありません。');
            return;
        }
        
        let message = 'ブックマークしたガイド:\n\n';
        bookmarkedGuides.forEach(guide => {
            message += `• ${guide.name} (${guide.location}) - ¥${guide.price.toLocaleString()}\n`;
        });
        
        alert(message);
    }
    
    showComparison() {
        const comparedGuides = this.allGuides.filter(g => this.comparedGuides.includes(g.id));
        if (comparedGuides.length === 0) {
            alert('比較対象のガイドはありません。');
            return;
        }
        
        let message = 'ガイド比較:\n\n';
        comparedGuides.forEach(guide => {
            message += `${guide.name}\n`;
            message += `地域: ${guide.location}\n`;
            message += `料金: ¥${guide.price.toLocaleString()}\n`;
            message += `評価: ${guide.rating}/5\n`;
            message += `言語: ${guide.languages.join(', ')}\n\n`;
        });
        
        alert(message);
    }
    
    showHistory() {
        if (this.viewHistory.length === 0) {
            alert('閲覧履歴はありません。');
            return;
        }
        
        let message = '閲覧履歴:\n\n';
        this.viewHistory.slice(0, 10).forEach(item => {
            const guide = this.allGuides.find(g => g.id === item.guideId);
            if (guide) {
                const actionText = {
                    'view': '詳細閲覧',
                    'bookmark': 'ブックマーク',
                    'compare': '比較追加'
                };
                message += `• ${guide.name} - ${actionText[item.action]}\n`;
            }
        });
        
        alert(message);
    }
}

// グローバル初期化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.paginationSystem = new PaginationSystem();
        
        // 従来システムの無効化
        if (window.guideRenderer) {
            window.guideRenderer.renderAllGuides = () => console.log('従来システム無効化済み');
        }
        
        console.log('ページネーションシステム初期化完了');
    }, 1000);
});

console.log('ページネーションシステム読み込み完了');