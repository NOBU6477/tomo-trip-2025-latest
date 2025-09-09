// TomoTrip Application Initialization - Direct Implementation
// No imports - all functions defined directly to prevent loading issues

console.log('🚀 TomoTrip app-init.mjs loading...');

// Early detection for iframe
const isReplitIframe = window.self !== window.top;

if (isReplitIframe) {
    window.FOOTER_EMERGENCY_DISABLED = true;
    console.log('🔇 Iframe context detected');
}

// Default guide data - simplified
const defaultGuideData = [
    { id: 1, name: "田中健太", location: "tokyo", rating: 4.8, price: 8000, photo: "/assets/img/guides/default-1.svg", languages: ["ja", "en"], specialties: ["history", "culture"] },
    { id: 2, name: "佐藤美咲", location: "osaka", rating: 4.9, price: 7500, photo: "/assets/img/guides/default-2.svg", languages: ["ja", "en", "zh"], specialties: ["food", "local"] },
    { id: 3, name: "鈴木一郎", location: "kyoto", rating: 4.7, price: 9000, photo: "/assets/img/guides/default-3.svg", languages: ["ja", "en"], specialties: ["temples", "traditional"] },
    { id: 4, name: "山田花子", location: "osaka", rating: 4.6, price: 7000, photo: "/assets/img/guides/default-4.svg", languages: ["ja", "en"], specialties: ["shopping", "food"] },
    { id: 5, name: "Johnson Mike", location: "tokyo", rating: 4.8, price: 8500, photo: "/assets/img/guides/default-5.svg", languages: ["en", "ja"], specialties: ["business", "modern"] },
    { id: 6, name: "李美麗", location: "kyoto", rating: 4.9, price: 8800, photo: "attached_assets/image_1754399234136.png", languages: ["zh", "ja", "en"], specialties: ["culture", "temples"] },
    { id: 7, name: "高橋翔太", location: "hokkaido", rating: 4.7, price: 9500, photo: "attached_assets/image_1754399234136.png", languages: ["ja", "en"], specialties: ["nature", "skiing"] },
    { id: 8, name: "Anderson Sarah", location: "okinawa", rating: 4.8, price: 8200, photo: "attached_assets/image_1754399234136.png", languages: ["en", "ja"], specialties: ["beach", "diving"] },
    { id: 9, name: "金成民", location: "tokyo", rating: 4.6, price: 7800, photo: "attached_assets/image_1754399234136.png", languages: ["ko", "ja", "en"], specialties: ["kpop", "modern"] },
    { id: 10, name: "伊藤優子", location: "nara", rating: 4.9, price: 8600, photo: "attached_assets/image_1754399234136.png", languages: ["ja", "en"], specialties: ["deer", "temples"] },
    { id: 11, name: "Rodriguez Carlos", location: "hiroshima", rating: 4.7, price: 8300, photo: "attached_assets/image_1754399234136.png", languages: ["es", "ja", "en"], specialties: ["history", "peace"] },
    { id: 12, name: "中村孝", location: "fukuoka", rating: 4.8, price: 7900, photo: "attached_assets/image_1754399234136.png", languages: ["ja", "en"], specialties: ["ramen", "local"] }
];

// Simple guide card renderer
function renderGuideCards(guides) {
    const container = document.getElementById('guideCardsContainer');
    if (!container) return;
    
    const html = guides.map(guide => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 guide-card" style="border-radius: 15px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                <img src="${guide.photo}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${guide.name}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-1">${guide.name}</h5>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-warning bookmark-btn" data-guide-id="${guide.id}" title="Bookmark">⭐</button>
                            <button class="btn btn-sm btn-outline-success compare-btn" data-guide-id="${guide.id}" title="Add to compare">✓</button>
                        </div>
                    </div>
                    <div class="mb-2">
                        <span class="badge bg-primary me-1">${guide.location}</span>
                        <span class="badge bg-secondary">${guide.specialties?.[0] || 'ガイド'}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                            <span class="text-warning">★</span>
                            <span class="fw-bold">${guide.rating}</span>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold text-primary">¥${Number(guide?.price || 0).toLocaleString()}</div>
                            <small class="text-muted">1日あたり</small>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary w-100 view-detail-btn" data-guide-id="${guide.id}" style="border-radius: 25px;">
                            詳細を見る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
    console.log(`✅ Rendered ${guides.length} guide cards`);
}

// Update guide counters
function updateGuideCounters(displayed, total) {
    const guideCounter = document.getElementById('guideCounter');
    const totalGuideCounter = document.getElementById('totalGuideCounter');
    
    if (guideCounter) {
        guideCounter.textContent = `${displayed}件のガイドが見つかりました`;
    }
    if (totalGuideCounter) {
        totalGuideCounter.textContent = `合計: ${total}件`;
    }
    
    console.log(`📊 Guide counters updated: ${displayed}/${total}`);
}

// Language mapping
const languageMapping = {
    'ja': '日本語',
    'en': '英語', 
    'zh': '中国語',
    'ko': '韓国語',
    'es': 'スペイン語',
    'fr': 'フランス語',
    'de': 'ドイツ語',
    'ru': 'ロシア語',
    'thai': 'タイ語',
    'vietnamese': 'ベトナム語'
};

// Convert guide languages for display
function convertGuideLanguages(guides) {
    return guides.map(guide => ({
        ...guide,
        languages: guide.languages.map(lang => languageMapping[lang] || lang)
    }));
}

// Main application initialization function
function appInit() {
    console.log('🌴 TomoTrip Application Starting...');
    
    // Initialize with default guide data
    const guides = defaultGuideData;
    window.defaultGuides = convertGuideLanguages(guides);
    
    console.log('🎯 Environment Data Sync:', {
        guides: guides.length,
        source: 'defaultGuideData (direct)',
    });

    // Render initial guide cards
    renderGuideCards(window.defaultGuides);
    updateGuideCounters(guides.length, guides.length);

    // Setup global functions for window object
    setupGlobalFunctions();
    
    console.log('✅ TomoTrip Application Ready!');
}

// Setup all global functions
function setupGlobalFunctions() {
    console.log('🔧 Setting up global functions...');
    
    // Make renderer functions globally available
    window.renderGuideCards = renderGuideCards;
    window.updateGuideCounters = updateGuideCounters;
    
    // Filter functions with full implementation
    window.filterGuides = function() {
        console.log('🔍 filterGuides called');
        try {
            const location = document.getElementById('locationFilter')?.value || '';
            const language = document.getElementById('languageFilter')?.value || '';
            const price = document.getElementById('priceFilter')?.value || '';
            const keyword = document.getElementById('keywordInput')?.value?.toLowerCase() || '';
            
            console.log('🔍 Filter values:', { location, language, price, keyword });
            
            // Get all guides
            const allGuides = window.defaultGuides || [];
            
            // Apply filters
            let filtered = allGuides.filter(guide => {
                const locationMatch = !location || guide.location === location;
                const languageMatch = !language || (Array.isArray(guide.languages) ? guide.languages.includes(language) : guide.languages === language);
                const priceMatch = !price || (
                    price === 'low' && guide.price <= 8000 ||
                    price === 'medium' && guide.price > 8000 && guide.price <= 10000 ||
                    price === 'high' && guide.price > 10000
                );
                const keywordMatch = !keyword || 
                    guide.name.toLowerCase().includes(keyword) ||
                    (guide.specialties && guide.specialties.some(s => s.toLowerCase().includes(keyword)));
                
                return locationMatch && languageMatch && priceMatch && keywordMatch;
            });
            
            console.log(`✅ Filtered guides: ${filtered.length} out of ${allGuides.length}`);
            
            // Re-render guide cards
            renderGuideCards(filtered);
            updateGuideCounters(filtered.length, allGuides.length);
            
        } catch (error) {
            console.error('❌ Filter error:', error);
            alert('検索中にエラーが発生しました');
        }
    };
    
    window.resetFilters = function() {
        console.log('🔄 resetFilters called');
        try {
            // Clear all filter inputs
            const locationFilter = document.getElementById('locationFilter');
            const languageFilter = document.getElementById('languageFilter');
            const priceFilter = document.getElementById('priceFilter');
            const keywordInput = document.getElementById('keywordInput');
            
            if (locationFilter) locationFilter.value = '';
            if (languageFilter) languageFilter.value = '';
            if (priceFilter) priceFilter.value = '';
            if (keywordInput) keywordInput.value = '';
            
            // Reset to show all guides
            const allGuides = window.defaultGuides || [];
            
            renderGuideCards(allGuides);
            updateGuideCounters(allGuides.length, allGuides.length);
            
            console.log('✅ Filters reset successfully');
            
        } catch (error) {
            console.error('❌ Reset error:', error);
            location.reload();
        }
    };
    
    window.handleSponsorRegistration = function() {
        console.log('🏪 handleSponsorRegistration called');
        window.location.href = 'sponsor-registration.html';
    };
    
    // Tourist registration modal functions
    window.goToStep2Modal = function() {
        console.log('🎯 goToStep2Modal called');
        
        const phoneInput = document.getElementById('touristPhone');
        const firstNameInput = document.getElementById('touristFirstName');
        const lastNameInput = document.getElementById('touristLastName');
        const emailInput = document.getElementById('touristEmail');
        
        // Basic validation
        if (!firstNameInput?.value?.trim()) {
            alert('名前を入力してください');
            return;
        }
        if (!lastNameInput?.value?.trim()) {
            alert('姓を入力してください');
            return;
        }
        if (!emailInput?.value?.trim()) {
            alert('メールアドレスを入力してください');
            return;
        }
        if (!phoneInput?.value?.trim()) {
            alert('電話番号を入力してください');
            return;
        }
        
        // Hide step 1, show step 2
        const step1 = document.getElementById('step1Content');
        const step2 = document.getElementById('step2Content');
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
        
        // Update step indicators
        const step1Indicator = document.getElementById('step1-indicator');
        const step2Indicator = document.getElementById('step2-indicator');
        if (step1Indicator?.querySelector('.badge')) {
            step1Indicator.querySelector('.badge').className = 'badge bg-success rounded-circle me-2';
        }
        if (step2Indicator?.querySelector('.badge')) {
            step2Indicator.querySelector('.badge').className = 'badge bg-primary rounded-circle me-2';
        }
        
        // Update phone display
        const phoneDisplay = document.getElementById('phoneDisplayModal');
        if (phoneDisplay) {
            phoneDisplay.textContent = '電話番号: ' + phoneInput.value;
        }
        
        console.log('✅ Successfully moved to step 2');
    };
    
    window.clearRegistrationModal = function() {
        console.log('🧹 Clearing registration modal data');
        
        // Clear all form inputs
        const inputs = ['touristFirstName', 'touristLastName', 'touristEmail', 'touristPhone', 'touristCountry', 
                       'touristVisitDuration', 'touristPreferredLanguage', 'touristSpecialRequests'];
        
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });
        
        // Clear checkboxes
        const checkboxes = document.querySelectorAll('#registrationModal input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        // Reset to step 1
        const step1 = document.getElementById('step1Content');
        const step2 = document.getElementById('step2Content');
        const step3 = document.getElementById('step3Content');
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
        
        // Reset indicators
        const step1Indicator = document.getElementById('step1-indicator');
        const step2Indicator = document.getElementById('step2-indicator');
        const step3Indicator = document.getElementById('step3-indicator');
        
        if (step1Indicator?.querySelector('.badge')) {
            step1Indicator.querySelector('.badge').className = 'badge bg-primary rounded-circle me-2';
        }
        if (step2Indicator?.querySelector('.badge')) {
            step2Indicator.querySelector('.badge').className = 'badge bg-secondary rounded-circle me-2';
        }
        if (step3Indicator?.querySelector('.badge')) {
            step3Indicator.querySelector('.badge').className = 'badge bg-secondary rounded-circle me-2';
        }
        
        console.log('✅ Registration modal cleared');
    };
    
    // Additional tourist registration functions
    window.goToStep1Modal = function() {
        const step1 = document.getElementById('step1Content');
        const step2 = document.getElementById('step2Content');
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        
        const step1Indicator = document.getElementById('step1-indicator');
        const step2Indicator = document.getElementById('step2-indicator');
        if (step1Indicator?.querySelector('.badge')) {
            step1Indicator.querySelector('.badge').className = 'badge bg-primary rounded-circle me-2';
        }
        if (step2Indicator?.querySelector('.badge')) {
            step2Indicator.querySelector('.badge').className = 'badge bg-secondary rounded-circle me-2';
        }
        console.log('✅ Returned to step 1');
    };
    
    window.goToStep3Modal = function() {
        const step2 = document.getElementById('step2Content');
        const step3 = document.getElementById('step3Content');
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'block';
        
        const step2Indicator = document.getElementById('step2-indicator');
        const step3Indicator = document.getElementById('step3-indicator');
        if (step2Indicator?.querySelector('.badge')) {
            step2Indicator.querySelector('.badge').className = 'badge bg-success rounded-circle me-2';
        }
        if (step3Indicator?.querySelector('.badge')) {
            step3Indicator.querySelector('.badge').className = 'badge bg-primary rounded-circle me-2';
        }
        console.log('✅ Moved to step 3');
    };
    
    console.log('✅ All global functions set up successfully:', {
        filterGuides: typeof window.filterGuides,
        resetFilters: typeof window.resetFilters,
        goToStep2Modal: typeof window.goToStep2Modal,
        clearRegistrationModal: typeof window.clearRegistrationModal,
        handleSponsorRegistration: typeof window.handleSponsorRegistration
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appInit);
} else {
    appInit();
}

console.log('🎉 TomoTrip app-init.mjs loaded successfully');