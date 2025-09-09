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

/** Main application initialization function */
function appInit() {
    console.log('🌴 TomoTrip Application Starting...');
    
    // Initialize with default guide data
    const guides = defaultGuideData;
    window.defaultGuides = guides;
    
    console.log('🎯 Environment Data Sync:', {
        guides: guides.length,
        source: 'defaultGuideData (direct)',
    });
    setupEventListeners(state);
    
    // Render initial guide cards using single consistent system
    try {
        // Only use renderGuideCards - don't call displayGuides which conflicts
        renderGuideCards(guides);
        
        // Force update counters immediately
        setTimeout(() => {
            updateGuideCounters(guides.length, guides.length);
        }, 100);
        
        console.log('✅ Guide cards rendered successfully');
    } catch (error) {
        console.error('❌ Error rendering guide cards:', error);
        
        // Fallback: manually update counters even if rendering fails
        const guideCounter = document.getElementById('guideCounter');
        const totalGuideCounter = document.getElementById('totalGuideCounter');
        if (guideCounter) guideCounter.textContent = `${guides.length}人のガイドが見つかりました`;
        if (totalGuideCounter) totalGuideCounter.textContent = `総数: ${guides.length}人`;
    }
    
    // Setup login system
    if (window.updateLoginStatus) {
        window.updateLoginStatus();
        console.log('✅ Login status updated');
    }
    
    if (window.setupLoginDropdown) {
        window.setupLoginDropdown();
        console.log('✅ Login dropdown setup');
    }
    
    if (window.setupLoginForms) {
        window.setupLoginForms();
        console.log('✅ Login forms setup');
    }
    
    // Set up login dropdown button handlers
    setTimeout(() => {
        const touristLoginBtn = document.getElementById('directTouristLoginBtn');
        const guideLoginBtn = document.getElementById('directGuideLoginBtn');
        
        if (touristLoginBtn && window.handleTouristLogin) {
            touristLoginBtn.addEventListener('click', window.handleTouristLogin);
            console.log('✅ Tourist login button handler attached');
        }
        
        if (guideLoginBtn && window.handleGuideLogin) {
            guideLoginBtn.addEventListener('click', window.handleGuideLogin);
            console.log('✅ Guide login button handler attached');
        }
        
        // Set up main hero buttons
        const findGuideBtn = document.getElementById('findGuideBtn');
        const contactBtn = document.getElementById('contactBtn');
        
        if (findGuideBtn) {
            findGuideBtn.addEventListener('click', function() {
                // Scroll to guides section
                const guidesSection = document.getElementById('guides-section');
                if (guidesSection) {
                    guidesSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
            console.log('✅ Find Guide button handler attached');
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                // Show contact modal or information
                alert('お問い合わせいただきありがとうございます。\n\nメール: info@tomotrip.com\n電話: 03-1234-5678\n\nまたは、ご希望のガイドから直接お問い合わせいただけます。');
            });
            console.log('✅ Contact button handler attached');
        }
    }, 100);
    
    // Setup button handlers
    wireSponsorButtons();
    wireLanguageSwitcher();
    
    log.ok('✅ Application initialized successfully with AppState');
    
    // Make critical functions globally available
    window.renderGuideCards = renderGuideCards;
    window.updateGuideCounters = updateGuideCounters;
    window.displayGuides = displayGuides;
    
    // Direct function definitions - bypassing dynamic import to prevent loading issues
    console.log('🔧 Setting up global functions directly...');
    
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
                    (guide.specialty && guide.specialty.toLowerCase().includes(keyword)) ||
                    (guide.description && guide.description.toLowerCase().includes(keyword));
                
                return locationMatch && languageMatch && priceMatch && keywordMatch;
            });
            
            console.log(`✅ Filtered guides: ${filtered.length} out of ${allGuides.length}`);
            
            // Re-render guide cards
            if (window.renderGuideCards) {
                window.renderGuideCards(filtered);
            }
            
            // Update counters
            if (window.updateGuideCounters) {
                window.updateGuideCounters(filtered.length, allGuides.length);
            }
            
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
            
            if (window.renderGuideCards) {
                window.renderGuideCards(allGuides);
            }
            
            if (window.updateGuideCounters) {
                window.updateGuideCounters(allGuides.length, allGuides.length);
            }
            
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
    
    // Setup guide card click handlers with authentication
    setTimeout(() => {
        setupGuideCardClickHandlers();
        
        // Setup tourist registration system
        if (window.setupTouristRegistration) {
            window.setupTouristRegistration();
        }
    }, 200);
    
    console.log('🌍 Global functions exposed:', {
        renderGuideCards: typeof window.renderGuideCards,
        updateGuideCounters: typeof window.updateGuideCounters,
        displayGuides: typeof window.displayGuides
    });
    
    // Signal that the app is ready
    document.body.setAttribute('data-app-status', 'ready');
    document.dispatchEvent(new CustomEvent('appReady', { detail: { guides: guides.length } }));
    console.log('🎉 TomoTrip application is fully ready!');
}

// Simplified guide rendering - bypassing complex module system
function renderGuidesDirectly() {
    console.log('🎯 Rendering guides directly...');
    
    const container = document.getElementById('guideCardsContainer');
    if (!container) {
        console.error('Guide container not found');
        return;
    }
    
    // Full guide dataset - expanded from original defaultGuideData
    const guides = [
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
    
    // Set global reference for modal system
    window.defaultGuides = guides;
    
    // Location mapping for display
    window.locationNames = {
        hokkaido: "北海道", tokyo: "東京都", osaka: "大阪府", kyoto: "京都府", 
        nara: "奈良県", hiroshima: "広島県", fukuoka: "福岡県", okinawa: "沖縄県"
    };
    
    // Render cards
    const cardsHTML = guides.map(guide => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="guide-card h-100" style="border: none; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease; background: white;">
                <div class="position-relative">
                    <img src="${guide.photo || '/assets/img/guides/default-1.svg'}" 
                         class="card-img-top" alt="${guide.name}" 
                         style="height: 250px; object-fit: cover;">
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 12px; padding: 5px 10px; border-radius: 15px;">
                            評価 ${guide.rating} ⭐
                        </span>
                    </div>
                </div>
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-2" style="color: #2c3e50;">${guide.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${window.locationNames[guide.location] || guide.location}
                    </p>
                    <p class="card-text text-muted mb-3" style="font-size: 14px; line-height: 1.4;">
                        地域の魅力をご案内します
                    </p>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted">対応言語</small>
                            <small class="fw-semibold">${Array.isArray(guide.languages) ? guide.languages.map(lang => {
                                const langMap = {
                                    'ja': '日本語', 'japanese': '日本語',
                                    'en': '英語', 'english': '英語', 
                                    'zh': '中国語', 'chinese': '中国語',
                                    'ko': '韓国語', 'korean': '韓国語',
                                    'es': 'スペイン語', 'spanish': 'スペイン語',
                                    'fr': 'フランス語', 'french': 'フランス語',
                                    'de': 'ドイツ語', 'german': 'ドイツ語',
                                    'it': 'イタリア語', 'italian': 'イタリア語'
                                };
                                return langMap[lang.toLowerCase()] || lang;
                            }).join(', ') : guide.languages}</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted">料金</small>
                            <small class="fw-bold text-primary">¥${Number(guide.price).toLocaleString()}</small>
                        </div>
                    </div>
                    
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" 
                                data-action="view-details" 
                                data-guide-id="${guide.id}"
                                style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 10px; padding: 10px;">
                            詳しく見る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = cardsHTML;
    
    // Update counters
    const guideCounter = document.getElementById('guideCounter');
    const totalGuideCounter = document.getElementById('totalGuideCounter');
    if (guideCounter) guideCounter.textContent = `${guides.length}人のガイドが見つかりました（全${guides.length}人中）`;
    if (totalGuideCounter) totalGuideCounter.textContent = `総数: ${guides.length}人`;
    
    console.log(`✅ Rendered ${guides.length} guide cards successfully`);
}

// Initialize application with direct rendering
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        renderGuidesDirectly();
        appInit();
    });
} else {
    renderGuidesDirectly();
    appInit();
}

// Location mapping for display - unified to prevent conflicts
if (!window.locationNames) {
    window.locationNames = {
        hokkaido: "北海道", aomori: "青森県", iwate: "岩手県", miyagi: "宮城県", akita: "秋田県", yamagata: "山形県", fukushima: "福島県",
        ibaraki: "茨城県", tochigi: "栃木県", gunma: "群馬県", saitama: "埼玉県", chiba: "千葉県", tokyo: "東京都", kanagawa: "神奈川県",
        niigata: "新潟県", toyama: "富山県", ishikawa: "石川県", fukui: "福井県", yamanashi: "山梨県", nagano: "長野県", gifu: "岐阜県", shizuoka: "静岡県", aichi: "愛知県",
        mie: "三重県", shiga: "滋賀県", kyoto: "京都府", osaka: "大阪府", hyogo: "兵庫県", nara: "奈良県", wakayama: "和歌山県",
        tottori: "鳥取県", shimane: "島根県", okayama: "岡山県", hiroshima: "広島県", yamaguchi: "山口県", tokushima: "徳島県", kagawa: "香川県", ehime: "愛媛県", kochi: "高知県",
        fukuoka: "福岡県", saga: "佐賀県", nagasaki: "長崎県", kumamoto: "熊本県", oita: "大分県", miyazaki: "宮崎県", kagoshima: "鹿児島県", okinawa: "沖縄県",
        ogasawara: "小笠原諸島", izu: "伊豆諸島", sado: "佐渡島", awaji: "淡路島", yakushima: "屋久島", amami: "奄美大島", ishigaki: "石垣島", miyako: "宮古島"
    };
    console.log('%cLocationNames Object Initialized:', 'color: #28a745;', Object.keys(window.locationNames).length, 'locations');
}

// Remove all global state variables - managed by AppState now
// All display functions moved to event-handlers.mjs to prevent conflicts