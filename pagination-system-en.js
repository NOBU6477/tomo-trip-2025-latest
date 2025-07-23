// English Pagination System (12 guides display with comparison)
console.log('English Pagination System initialization started');

class EnglishPaginationSystem {
    constructor() {
        this.currentPage = 1;
        this.guidesPerPage = 12;
        this.bookmarkedGuides = JSON.parse(localStorage.getItem('tomoTrip_bookmarks_en') || '[]');
        this.comparedGuides = JSON.parse(localStorage.getItem('tomoTrip_compared_en') || '[]');
        this.viewHistory = JSON.parse(localStorage.getItem('tomoTrip_history_en') || '[]');
        this.isMobile = window.innerWidth <= 768;
        
        this.initialize();
    }
    
    initialize() {
        console.log('English pagination initialization');
        this.createPaginationControls();
        this.setupEventListeners();
        this.loadDefaultGuides();
        this.renderCurrentPage();
        this.updateToolbar();
    }
    
    // Default 12 English guide data
    getDefaultGuides() {
        return [
            {
                id: 'en_default_1',
                name: 'John Smith',
                location: 'Tokyo',
                region: 'Tokyo',
                price: 8000,
                rating: 4.8,
                languages: ['English', 'Japanese'],
                keywords: ['Gourmet', 'Photo Spots', 'Culture'],
                description: 'Native English-speaking guide in Tokyo. I\'ll show you hidden gems and authentic Japanese culture.',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_2',
                name: 'Emily Johnson',
                location: 'Kyoto',
                region: 'Kyoto',
                price: 7500,
                rating: 4.9,
                languages: ['English', 'Japanese', 'Chinese'],
                keywords: ['Temples', 'Shrines', 'Traditional'],
                description: 'Kyoto specialist with deep knowledge of ancient temples and traditional Japanese culture.',
                photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_3',
                name: 'David Wilson',
                location: 'Osaka',
                region: 'Osaka',
                price: 6500,
                rating: 4.7,
                languages: ['English', 'Korean'],
                keywords: ['Food', 'Night Tours', 'Comedy'],
                description: 'Experience Osaka\'s famous "food paradise" culture. From takoyaki to hidden local restaurants.',
                photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_4',
                name: 'Sarah Davis',
                location: 'Hokkaido',
                region: 'Hokkaido',
                price: 9000,
                rating: 4.6,
                languages: ['English', 'Japanese'],
                keywords: ['Nature', 'Hot Springs', 'Seafood'],
                description: 'Explore Hokkaido\'s pristine nature and fresh seafood. Perfect for nature lovers.',
                photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_5',
                name: 'Michael Brown',
                location: 'Okinawa',
                region: 'Okinawa',
                price: 8500,
                rating: 4.8,
                languages: ['English', 'Japanese'],
                keywords: ['Beach', 'Diving', 'Island Culture'],
                description: 'Discover Okinawa\'s beautiful beaches and unique island culture. Snorkeling and cultural experiences.',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_6',
                name: 'Lisa Anderson',
                location: 'Kanagawa',
                region: 'Kanagawa',
                price: 7000,
                rating: 4.5,
                languages: ['English', 'Japanese'],
                keywords: ['Hot Springs', 'Mountains', 'Hiking'],
                description: 'Hakone and Kamakura specialist. Enjoy hot springs and Japanese history.',
                photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_7',
                name: 'Robert Taylor',
                location: 'Hiroshima',
                region: 'Hiroshima',
                price: 7200,
                rating: 4.7,
                languages: ['English', 'Japanese'],
                keywords: ['History', 'Peace', 'Food'],
                description: 'Learn about Hiroshima\'s history and enjoy local specialties like okonomiyaki and oysters.',
                photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_8',
                name: 'Jennifer White',
                location: 'Nara',
                region: 'Nara',
                price: 6800,
                rating: 4.6,
                languages: ['English', 'Chinese'],
                keywords: ['Temples', 'Deer', 'History'],
                description: 'Explore ancient Nara\'s historic temples and interact with friendly deer.',
                photo: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_9',
                name: 'Christopher Lee',
                location: 'Fukuoka',
                region: 'Fukuoka',
                price: 6900,
                rating: 4.4,
                languages: ['English', 'Korean'],
                keywords: ['Food', 'Night Tours', 'Street Food'],
                description: 'Experience Fukuoka\'s famous yatai (street food stalls) and Kyushu cuisine.',
                photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_10',
                name: 'Amanda Miller',
                location: 'Miyagi',
                region: 'Miyagi',
                price: 7400,
                rating: 4.5,
                languages: ['English', 'Japanese'],
                keywords: ['Nature', 'Hot Springs', 'Seafood'],
                description: 'Discover Sendai and Matsushima\'s beautiful scenery, hot springs, and fresh seafood.',
                photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_11',
                name: 'James Garcia',
                location: 'Nagano',
                region: 'Nagano',
                price: 8200,
                rating: 4.7,
                languages: ['English', 'German'],
                keywords: ['Mountains', 'Hiking', 'Hot Springs'],
                description: 'Experience the majestic Japanese Alps and relaxing hot springs in all seasons.',
                photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face'
            },
            {
                id: 'en_default_12',
                name: 'Rachel Martinez',
                location: 'Ishikawa',
                region: 'Ishikawa',
                price: 7800,
                rating: 4.8,
                languages: ['English', 'Japanese'],
                keywords: ['Traditional Crafts', 'Gold Leaf', 'Gardens'],
                description: 'Explore Kanazawa\'s traditional crafts and beautiful gardens. Gold leaf experience and Kenrokuen.',
                photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face'
            }
        ];
    }
    
    loadDefaultGuides() {
        this.allGuides = this.getDefaultGuides();
        console.log(`Total English guides: ${this.allGuides.length}`);
    }
    
    createPaginationControls() {
        const guidesSection = document.getElementById('guides');
        if (!guidesSection) return;
        
        const paginationHTML = `
            <div class="pagination-container mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="guide-counter-info">
                        <span id="current-page-info" class="text-primary fw-bold">
                            Page 1 (1-12 guides)
                        </span>
                    </div>
                    <div class="pagination-controls">
                        <button class="btn btn-outline-primary btn-sm me-2" id="prevPageBtn" disabled>
                            <i class="bi bi-chevron-left"></i> Previous
                        </button>
                        <span id="page-indicator" class="mx-3">1 / 1</span>
                        <button class="btn btn-outline-primary btn-sm ms-2" id="nextPageBtn" disabled>
                            Next <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="mobile-pagination-controls d-md-none mb-3">
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-primary w-100" id="mobilePrevBtn" disabled>
                                <i class="bi bi-chevron-left"></i> Previous
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-primary w-100" id="mobileNextBtn" disabled>
                                Next <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-center mt-2">
                        <span id="mobile-page-info" class="text-primary fw-bold">Page 1 / 1</span>
                    </div>
                </div>
            </div>
        `;
        
        const filterToggleBtn = document.getElementById('filterToggleBtn');
        if (filterToggleBtn && filterToggleBtn.parentNode) {
            filterToggleBtn.parentNode.insertAdjacentHTML('afterend', paginationHTML);
        }
    }
    
    setupEventListeners() {
        document.getElementById('prevPageBtn')?.addEventListener('click', () => this.goToPreviousPage());
        document.getElementById('nextPageBtn')?.addEventListener('click', () => this.goToNextPage());
        document.getElementById('mobilePrevBtn')?.addEventListener('click', () => this.goToPreviousPage());
        document.getElementById('mobileNextBtn')?.addEventListener('click', () => this.goToNextPage());
        
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
        
        this.renderGuideCards(currentGuides);
        this.updatePaginationInfo();
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
                        <div class="guide-actions position-absolute" style="top: 10px; right: 10px; z-index: 10;">
                            <button class="btn btn-sm ${isBookmarked ? 'btn-warning' : 'btn-outline-warning'} me-1 bookmark-btn" 
                                    onclick="englishPaginationSystem.toggleBookmark('${guide.id}')" 
                                    title="Bookmark">
                                <i class="bi ${isBookmarked ? 'bi-star-fill' : 'bi-star'}"></i>
                            </button>
                            <button class="btn btn-sm ${isCompared ? 'btn-success' : 'btn-outline-success'} compare-btn" 
                                    onclick="englishPaginationSystem.toggleCompare('${guide.id}')" 
                                    title="Add to Compare">
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
                                <small class="text-muted">/day</small>
                            </div>
                            <div class="guide-rating">
                                <i class="bi bi-star-fill text-warning"></i>
                                <span>${guide.rating}</span>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="englishPaginationSystem.viewGuideDetails('${guide.id}')">
                                View Details
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
        
        document.getElementById('current-page-info').textContent = 
            `Page ${this.currentPage} (${startGuide}-${endGuide} guides)`;
        document.getElementById('page-indicator').textContent = 
            `${this.currentPage} / ${totalPages}`;
        document.getElementById('mobile-page-info').textContent = 
            `Page ${this.currentPage} / ${totalPages}`;
        
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
    
    toggleBookmark(guideId) {
        const index = this.bookmarkedGuides.indexOf(guideId);
        if (index === -1) {
            this.bookmarkedGuides.push(guideId);
        } else {
            this.bookmarkedGuides.splice(index, 1);
        }
        
        localStorage.setItem('tomoTrip_bookmarks_en', JSON.stringify(this.bookmarkedGuides));
        this.renderCurrentPage();
        this.updateToolbar();
        this.addToHistory(guideId, 'bookmark');
    }
    
    toggleCompare(guideId) {
        const index = this.comparedGuides.indexOf(guideId);
        if (index === -1) {
            if (this.comparedGuides.length >= 3) {
                alert('You can compare up to 3 guides maximum.');
                return;
            }
            this.comparedGuides.push(guideId);
        } else {
            this.comparedGuides.splice(index, 1);
        }
        
        localStorage.setItem('tomoTrip_compared_en', JSON.stringify(this.comparedGuides));
        this.renderCurrentPage();
        this.updateToolbar();
        this.addToHistory(guideId, 'compare');
    }
    
    viewGuideDetails(guideId) {
        const guide = this.allGuides.find(g => g.id === guideId);
        if (guide) {
            alert(`Guide Details\n\nName: ${guide.name}\nLocation: ${guide.location}\nPrice: ¥${guide.price.toLocaleString()}\nLanguages: ${guide.languages.join(', ')}\nKeywords: ${guide.keywords.join(', ')}\nRating: ${guide.rating}/5\n\n${guide.description}`);
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
        this.viewHistory = this.viewHistory.slice(0, 50);
        
        localStorage.setItem('tomoTrip_history_en', JSON.stringify(this.viewHistory));
    }
    
    showBookmarks() {
        const bookmarkedGuides = this.allGuides.filter(g => this.bookmarkedGuides.includes(g.id));
        if (bookmarkedGuides.length === 0) {
            alert('No bookmarked guides.');
            return;
        }
        
        let message = 'Bookmarked Guides:\n\n';
        bookmarkedGuides.forEach(guide => {
            message += `• ${guide.name} (${guide.location}) - ¥${guide.price.toLocaleString()}\n`;
        });
        
        alert(message);
    }
    
    showComparison() {
        const comparedGuides = this.allGuides.filter(g => this.comparedGuides.includes(g.id));
        if (comparedGuides.length === 0) {
            alert('No guides selected for comparison.');
            return;
        }
        
        let message = 'Guide Comparison:\n\n';
        comparedGuides.forEach(guide => {
            message += `${guide.name}\n`;
            message += `Location: ${guide.location}\n`;
            message += `Price: ¥${guide.price.toLocaleString()}\n`;
            message += `Rating: ${guide.rating}/5\n`;
            message += `Languages: ${guide.languages.join(', ')}\n\n`;
        });
        
        alert(message);
    }
    
    showHistory() {
        if (this.viewHistory.length === 0) {
            alert('No viewing history.');
            return;
        }
        
        let message = 'Viewing History:\n\n';
        this.viewHistory.slice(0, 10).forEach(item => {
            const guide = this.allGuides.find(g => g.id === item.guideId);
            if (guide) {
                const actionText = {
                    'view': 'Viewed Details',
                    'bookmark': 'Bookmarked',
                    'compare': 'Added to Compare'
                };
                message += `• ${guide.name} - ${actionText[item.action]}\n`;
            }
        });
        
        alert(message);
    }
}

// Global initialization for English site
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.englishPaginationSystem = new EnglishPaginationSystem();
        console.log('English Pagination System initialization completed');
    }, 1000);
});

console.log('English Pagination System loaded');