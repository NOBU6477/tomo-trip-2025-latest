// Event handlers - centralized setup with AppState support
import { showSponsorLoginModal, showSponsorRegistrationModal } from '../ui/modal.mjs';

// Global guide detail function - opens guide detail page
async function showGuideDetailModalById(guideId) {
    console.log('🔍 Opening guide detail for ID:', guideId);
    
    try {
        // Open guide detail page - it will load data from API
        const detailUrl = `guide-detail.html?id=${guideId}`;
        window.open(detailUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
    } catch (error) {
        console.error('❌ Error opening guide details:', error);
        alert('ガイド詳細を開けませんでした。もう一度お試しください。');
    }
}

// Make function globally available
window.showGuideDetailModalById = showGuideDetailModalById;

export function setupEventListeners(state) {
    console.log('%cSetting up event listeners...', 'color: #007bff;');
    
    // Setup data-action based event handlers (CSP compliant)
    setupDataActionHandlers();
    
    // Setup sponsor button events (CSP compliant)
    setupSponsorButtonEvents();
    
    // Setup language switch buttons
    setupLanguageSwitchEvents();
    
    // Pass state to sub-functions
    setupGuideCardEvents();
    setupModalEvents();
    setupFilterEvents();
    setupPaginationEvents(state);
    
    console.log('%cEvent listeners setup complete', 'color: #28a745;');
}

// CSP compliant data-action event delegation system
function setupDataActionHandlers() {
    // Prevent double initialization
    if (window.__dataActionHandlersSetup) return;
    window.__dataActionHandlersSetup = true;
    
    // Unified event delegation for all data-action attributes
    document.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.getAttribute('data-action');
        if (!action) return;
        
        e.preventDefault();
        
        const element = e.target.closest('[data-action]');
        const guideId = element?.getAttribute('data-guide-id');
        const bookingId = element?.getAttribute('data-booking-id');
        const target = element?.getAttribute('data-target');
        const email = element?.getAttribute('data-email');
        
        // Handle all data-action events
        switch(action) {
            // Filter & Search Actions
            case 'search':
                handleSearchAction();
                break;
            case 'reset':
                handleResetFilters();
                break;
            
            // Pagination Actions 
            case 'next-page':
                handleNextPage();
                break;
            case 'prev-page':
                handlePrevPage();
                break;
            case 'goto-page':
                const page = parseInt(element?.getAttribute('data-page'));
                if (page && !isNaN(page)) handleGotoPage(page);
                break;
                
            // Sponsor Actions
            case 'open-sponsor-registration':
                handleSponsorRegistration();
                break;
            case 'open-sponsor-login':
                handleSponsorLogin();
                break;
            case 'open-management':
                handleManagementCenter();
                break;
                
            // Authentication & Registration
            case 'toggle-login-dropdown':
                toggleLoginDropdown();
                break;
            case 'open-tourist-registration':
                openTouristRegistration();
                break;
            case 'open-guide-registration':
                openGuideRegistration();
                break;
            case 'process-sponsor-login':
                processSponsorLogin();
                break;
            case 'redirect-sponsor-dashboard':
                redirectToSponsorDashboard();
                break;
                
            // Guide Actions
            case 'book-guide':
                if (guideId) bookGuide(guideId);
                break;
            case 'contact-guide':
                if (guideId) contactGuide(guideId);
                break;
            case 'show-guide-detail':
            case 'view-details':
                if (guideId) showGuideDetailModalById(guideId);
                break;
                
            // Bookmark & Comparison
            case 'remove-bookmark':
                if (guideId) removeBookmark(guideId);
                break;
            case 'remove-from-comparison':
                if (guideId) removeFromComparison(guideId);
                break;
            case 'view-booking-details':
                if (bookingId) viewBookingDetails(bookingId);
                break;
                
            // Utility Actions
            case 'trigger-photo-upload':
                document.getElementById('guideProfilePhoto')?.click();
                break;
            case 'open-chat':
                if (target) window.open(target, '_blank');
                break;
            case 'send-email':
                if (email) window.location.href = `mailto:${email}`;
                break;
                
            // Footer & Information Modals
            case 'show-faq':
                showFAQ();
                break;
            case 'show-cancellation':
                showCancellation();
                break;
            case 'show-safety':
                showSafety();
                break;
            case 'show-payment-help':
                alert('Payment help coming soon');
                break;
            case 'show-guide-registration-help':
                alert('Guide registration help coming soon');
                break;
            case 'show-profile-optimization':
                alert('Profile optimization tips coming soon');
                break;
            case 'show-earnings-dashboard':
                alert('Earnings dashboard coming soon');
                break;
            case 'show-guide-resources':
                alert('Guide resources coming soon');
                break;
            case 'show-cookie-settings':
                alert('Cookie settings panel under development');
                break;
            case 'clear-all-cookies':
                alert('Cookie deletion feature under development');
                break;
            case 'scroll-to-guides':
                scrollToGuides();
                break;
            case 'show-guide-registration-modal':
                showGuideRegistrationModal();
                break;
            case 'show-tourist-registration-modal':
                showTouristRegistrationModal();
                break;
            case 'show-management-center':
                showManagementCenter();
                break;
            case 'show-help':
                showHelp();
                break;
            case 'show-about':
                showAbout();
                break;
            case 'show-terms':
                showTerms();
                break;
            case 'show-privacy':
                showPrivacy();
                break;
            case 'show-cookies':
                showCookies();
                break;
            case 'show-compliance':
                showCompliance();
                break;
                
            default:
                console.log('Unknown data-action:', action);
        }
    });
    
    // Change delegation for filter elements
    document.addEventListener('change', (e) => {
        const element = e.target.closest('[data-action="filter-change"]');
        if (!element) return;
        handleFilterChange();
    });
    
    console.log('%cData-action handlers setup complete', 'color: #28a745;');
}

// CSP compliant sponsor button event setup
function setupSponsorButtonEvents() {
    const regBtn = document.getElementById('sponsorRegBtn');
    const loginBtn = document.getElementById('sponsorLoginBtn');
    const regBtnMobile = document.getElementById('sponsorRegBtnMobile');
    const loginBtnMobile = document.getElementById('sponsorLoginBtnMobile');
    
    // Desktop buttons
    if (regBtn) {
        regBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Sponsor registration clicked - redirecting to registration page');
            window.location.href = 'sponsor-registration.html';
        });
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Sponsor login clicked - showing modal');
            showSponsorLoginModal();
        });
    }
    
    // Mobile buttons
    if (regBtnMobile) {
        regBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Mobile sponsor registration clicked - redirecting to registration page');
            window.location.href = 'sponsor-registration.html';
        });
    }
    
    if (loginBtnMobile) {
        loginBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Mobile sponsor login clicked - showing modal');
            showSponsorLoginModal();
        });
    }
    
    console.log('%cSponsor button events setup complete', 'color: #28a745;');
}

// Language switch button events - delegated to emergency-buttons.mjs to prevent conflicts
function setupLanguageSwitchEvents() {
    // Language switch is now handled by emergency-buttons.mjs to prevent duplicate declarations
    // This avoids CSP violations and function redefinition errors
    console.log('%cLanguage switch events delegated to emergency handlers', 'color: #6c757d;');
}

// Utility function for AppState-based guide loading
export function loadAllGuides(guides) {
    const state = window.AppState;
    const safeGuides = Array.isArray(guides) ? guides : (state ? state.guides : []);
    
    console.log('%cGuides loaded:', 'color: #28a745;', safeGuides.length, 'guides');
    return safeGuides;
}

// Initialize pagination with AppState
export function initializeGuidePagination(state) {
    if (!state) {
        console.warn('initializeGuidePagination: No state provided');
        return;
    }
    
    // Ensure currentPage is valid
    state.currentPage = Math.max(1, Math.min(state.currentPage, state.totalPages));
    
    console.log('%cPagination initialized:', 'color: #28a745;', {
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        guides: state.guides.length
    });
    
    // Display initial page
    displayGuides(state.currentPage, state);
}

// Display guides for current page using AppState
export function displayGuides(page, state) {
    const currentState = state || window.AppState;
    if (!currentState) return;
    
    const container = document.getElementById('guidesContainer');
    if (!container) {
        console.error('❌ displayGuides: guidesContainer not found');
        return;
    }
    
    // Force pageSize to 12 for consistency across all environments
    currentState.pageSize = 12;
    
    const startIndex = (page - 1) * currentState.pageSize;
    const endIndex = startIndex + currentState.pageSize;
    const guidesForPage = currentState.guides.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    
    // Use guide-renderer.mjs function for consistent detailed display
    const cardsHTML = guidesForPage.map(guide => {
        // Import and use createGuideCardHTML from guide-renderer.mjs
        if (window.createGuideCardHTML) {
            return window.createGuideCardHTML(guide);
        }
        // Fallback: create inline HTML
        return createGuideCardInline(guide);
    }).join('');
    
    container.innerHTML = cardsHTML;
    
    // Update guide count displays with actual rendered card count
    if (window.updateGuideCounters) {
        window.updateGuideCounters(guidesForPage.length, currentState.guides.length);
    }
    
    // Environment debug log table
    console.table({
        build: window.BUILD_ID || 'TomoTrip-v2025.08.09-UNIFIED-BUILD',
        total: currentState.guides.length,
        filtered: currentState.guides.length, // Currently no filtering applied
        page: page,
        pageSize: currentState.pageSize,
        rendered: guidesForPage.length,
        origin: location.origin,
        timestamp: new Date().toISOString()
    });
    
    updatePaginationInfo(page, currentState);
}

// Inline guide card creator for fallback (detailed version like guide-renderer.mjs)
function createGuideCardInline(guide) {
    // Use API response field names
    const price = Number(guide.sessionRate || guide.guideSessionRate || guide.price || 0);
    const formattedPrice = isNaN(price) || price === 0 ? '料金応相談' : `¥${price.toLocaleString()}/時間`;
    
    // Language mapping for Japanese display  
    const languageMap = {
        'japanese': '日本語', 'english': '英語', 'chinese': '中国語', 'korean': '韓国語',
        'spanish': 'スペイン語', 'french': 'フランス語', 'german': 'ドイツ語'
    };
    
    let languages = '日本語'; // Default
    // API returns languages field (already mapped from guideLanguages)
    if (Array.isArray(guide.guideLanguages) && guide.guideLanguages.length > 0) {
        languages = guide.guideLanguages.map(lang => languageMap[lang.toLowerCase()] || lang).join(', ');
    } else if (Array.isArray(guide.languages) && guide.languages.length > 0) {
        languages = guide.languages.map(lang => languageMap[lang.toLowerCase()] || lang).join(', ');
    } else if (guide.languages && typeof guide.languages === 'string') {
        languages = languageMap[guide.languages.toLowerCase()] || guide.languages;
    }
    
    // Handle specialties from API response
    const specialties = guide.guideSpecialties || guide.specialties || '';
    const tags = typeof specialties === 'string' ? 
        specialties.split(/[,・・]/).map(s => s.trim()).filter(s => s).slice(0, 3).join(', ') :
        Array.isArray(specialties) ? specialties.slice(0, 3).join(', ') : '';
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="guide-card h-100" style="border: none; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease; background: white;">
                <div class="position-relative">
                    <img src="${guide.photo || guide.profilePhoto || guide.image || '/assets/img/guides/default-1.svg'}" 
                         class="card-img-top" 
                         alt="${guide.guideName || guide.name}" 
                         style="height: 250px; object-fit: cover;"
                         onerror="this.src='/assets/img/guides/default-1.svg';">
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 12px; padding: 5px 10px; border-radius: 15px;">
                            評価 ${guide.rating || '4.8'} ⭐
                        </span>
                    </div>
                </div>
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-2" style="color: #2c3e50;">${guide.guideName || guide.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${guide.location || guide.city || '東京'}
                    </p>
                    <p class="card-text text-muted mb-3" style="font-size: 14px; line-height: 1.4;">
                        ${guide.guideIntroduction || guide.introduction || guide.description || '地域の魅力をご案内します'}
                    </p>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted">対応言語</small>
                            <small class="fw-semibold">${languages}</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted">料金</small>
                            <small class="fw-bold text-primary">${formattedPrice}</small>
                        </div>
                        ${tags ? `
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">特徴</small>
                            <small class="text-info">${tags}</small>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary view-details-btn" 
                                data-action="view-details" 
                                data-guide-id="${guide.id}"
                                style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 10px; padding: 10px;">
                            詳しく見る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Counter displays handled by guide-renderer.mjs to avoid duplication

// Update pagination info with AppState
function updatePaginationInfo(page, state) {
    const currentState = state || window.AppState;
    if (!currentState) return;
    
    const totalPages = currentState.totalPages;
    const startIndex = (page - 1) * currentState.pageSize + 1;
    const endIndex = Math.min(page * currentState.pageSize, currentState.guides.length);
    
    const pageInfo = document.getElementById('pageInfo');
    const displayRange = document.getElementById('displayRange');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (pageInfo) pageInfo.textContent = `ページ ${page}`;
    if (displayRange) displayRange.textContent = `${startIndex}-${endIndex}`;
    
    if (prevBtn) {
        prevBtn.disabled = page === 1;
        prevBtn.onclick = () => {
            if (page > 1) {
                currentState.currentPage = page - 1;
                displayGuides(currentState.currentPage, currentState);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = page === totalPages;
        nextBtn.onclick = () => {
            if (page < totalPages) {
                currentState.currentPage = page + 1;
                displayGuides(currentState.currentPage, currentState);
            }
        };
    }
}

function setupGuideCardEvents() {
    // Guide card click handlers will be set up when cards are rendered
    document.addEventListener('click', function(e) {
        const guideCard = e.target.closest('.guide-card, .card[data-guide-id]');
        if (guideCard) {
            const guideId = guideCard.dataset.guideId;
            if (guideId) {
                console.log('Guide card clicked:', guideId);
                // Guide detail logic would go here
            }
        }
    });
}

function setupModalEvents() {
    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-bs-dismiss="modal"]')) {
            console.log('Modal dismiss clicked');
        }
    });
}

function setupFilterEvents() {
    // Filter button handlers
    const filterButtons = document.querySelectorAll('.filter-btn, .btn-filter');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filter clicked:', this.textContent);
        });
    });
}

function setupPaginationEvents(state) {
    // Pagination handlers will be set up by updatePaginationInfo
    console.log('Pagination events ready for AppState');
}

// Sponsor button event handlers - CSP compliant
export function wireSponsorButtons() {
    const regBtn = document.getElementById('sponsorRegBtn');
    const loginBtn = document.getElementById('sponsorLoginBtn');
    
    if (regBtn) {
        regBtn.addEventListener('click', handleSponsorRegistration);
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleSponsorLogin);
    }
}

// Sponsor handler functions
function handleSponsorRegistration() {
    console.log('Sponsor registration clicked');
    console.log('🚀 DIRECT ACTION: Redirecting to sponsor-registration.html');
    try {
        window.location.href = 'sponsor-registration.html';
    } catch (error) {
        console.error('Redirect failed:', error);
        alert('リダイレクトに失敗しました');
    }
}

function handleSponsorLogin() {
    console.log('Sponsor login clicked');
    console.log('🔐 DIRECT ACTION: Showing sponsor login modal');
    try {
        showSponsorLoginModal();
    } catch (error) {
        console.error('Modal failed:', error);
        alert('モーダル表示に失敗しました');
    }
}

// Language switcher handlers - CSP compliant
export function wireLanguageSwitcher() {
    const jpBtn = document.getElementById('jpBtn');
    const enBtn = document.getElementById('enBtn');
    
    if (jpBtn) {
        jpBtn.addEventListener('click', switchToJapanese);
    }
    
    if (enBtn) {
        enBtn.addEventListener('click', switchToEnglish);
    }
}

function switchToJapanese() {
    console.log('Switching to Japanese');
    window.location.href = 'index.html';
}

function switchToEnglish() {
    console.log('Switching to English');
    window.location.href = 'index-en.html';
}

// CSP-compliant filter and search handlers
function handleSearchAction() {
    console.log('🔍 Search action triggered');
    
    // Get search keyword
    const keywordInput = document.getElementById('keywordInput');
    const keyword = keywordInput?.value?.trim().toLowerCase() || '';
    
    if (keyword) {
        console.log(`🔍 Searching for keyword: "${keyword}"`);
    }
    
    applyCurrentFilters(keyword);
}

function handleResetFilters() {
    console.log('🔄 Reset filters triggered');
    
    // Reset all filter selects
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter');  
    const priceFilter = document.getElementById('priceFilter');
    const keywordInput = document.getElementById('keywordInput');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (keywordInput) keywordInput.value = '';
    
    console.log('✅ All filters reset');
    
    // Show all guides (reset to original state)
    if (window.AppState && window.AppState.guides) {
        console.log(`🔄 Displaying all ${window.AppState.guides.length} guides`);
        
        // Re-render all guide cards 
        if (window.renderGuideCards) {
            window.renderGuideCards(window.AppState.guides);
        }
        
        // Update counters
        if (window.updateGuideCounters) {
            window.updateGuideCounters(window.AppState.guides.length, window.AppState.guides.length);
        }
    } else {
        console.warn('⚠️ AppState or guides not available for reset');
    }
}

function handleFilterChange() {
    console.log('📊 Filter changed');
    applyCurrentFilters();
}

function applyCurrentFilters(keyword = '') {
    // Get current filter values
    const locationValue = document.getElementById('locationFilter')?.value || '';
    const languageValue = document.getElementById('languageFilter')?.value || '';
    const priceValue = document.getElementById('priceFilter')?.value || '';
    const searchKeyword = keyword || document.getElementById('keywordInput')?.value?.trim().toLowerCase() || '';
    
    console.log('🎯 Applying filters:', { locationValue, languageValue, priceValue, searchKeyword });
    
    // Get current guides from AppState
    if (window.AppState && window.AppState.guides) {
        let filteredGuides = [...window.AppState.guides];
        
        // Apply location filter with flexible matching
        if (locationValue) {
            filteredGuides = filteredGuides.filter(guide => {
                const guideLocation = guide.location || guide.city || '';
                
                // Location mapping for filter compatibility
                const locationMap = {
                    'hokkaido': ['北海道', 'hokkaido'],
                    'aomori': ['青森県', 'aomori'],
                    'iwate': ['岩手県', 'iwate'], 
                    'miyagi': ['宮城県', 'miyagi'],
                    'akita': ['秋田県', 'akita'],
                    'yamagata': ['山形県', 'yamagata'],
                    'fukushima': ['福島県', 'fukushima'],
                    'ibaraki': ['茨城県', 'ibaraki'],
                    'tochigi': ['栃木県', 'tochigi'],
                    'gunma': ['群馬県', 'gunma'],
                    'saitama': ['埼玉県', 'saitama'],
                    'chiba': ['千葉県', 'chiba'],
                    'tokyo': ['東京都', 'tokyo', '東京', '渋谷', '新宿', '池袋'],
                    'kanagawa': ['神奈川県', 'kanagawa', '横浜', '川崎'],
                    'niigata': ['新潟県', 'niigata'],
                    'toyama': ['富山県', 'toyama'],
                    'ishikawa': ['石川県', 'ishikawa'],
                    'fukui': ['福井県', 'fukui'],
                    'yamanashi': ['山梨県', 'yamanashi'],
                    'nagano': ['長野県', 'nagano'],
                    'gifu': ['岐阜県', 'gifu'],
                    'shizuoka': ['静岡県', 'shizuoka'],
                    'aichi': ['愛知県', 'aichi', '名古屋'],
                    'mie': ['三重県', 'mie'],
                    'shiga': ['滋賀県', 'shiga'],
                    'kyoto': ['京都府', 'kyoto', '京都'],
                    'osaka': ['大阪府', 'osaka', '大阪'],
                    'hyogo': ['兵庫県', 'hyogo', '神戸'],
                    'nara': ['奈良県', 'nara'],
                    'wakayama': ['和歌山県', 'wakayama'],
                    'tottori': ['鳥取県', 'tottori'],
                    'shimane': ['島根県', 'shimane'],
                    'okayama': ['岡山県', 'okayama'],
                    'hiroshima': ['広島県', 'hiroshima'],
                    'yamaguchi': ['山口県', 'yamaguchi'],
                    'tokushima': ['徳島県', 'tokushima'],
                    'kagawa': ['香川県', 'kagawa'],
                    'ehime': ['愛媛県', 'ehime'],
                    'kochi': ['高知県', 'kochi'],
                    'fukuoka': ['福岡県', 'fukuoka'],
                    'saga': ['佐賀県', 'saga'],
                    'nagasaki': ['長崎県', 'nagasaki'],
                    'kumamoto': ['熊本県', 'kumamoto'],
                    'oita': ['大分県', 'oita'],
                    'miyazaki': ['宮崎県', 'miyazaki'],
                    'kagoshima': ['鹿児島県', 'kagoshima'],
                    'okinawa': ['沖縄県', 'okinawa', '石垣', '那覇']
                };
                
                // Check if location matches any of the mapped values
                if (locationMap[locationValue]) {
                    return locationMap[locationValue].some(loc => 
                        guideLocation.toLowerCase().includes(loc.toLowerCase()) ||
                        loc.toLowerCase().includes(guideLocation.toLowerCase())
                    );
                }
                
                // Fallback: direct string matching
                return guideLocation.includes(locationValue) || 
                       locationValue.includes(guideLocation.split(' ')[0]);
            });
        }
        
        // Apply language filter  
        if (languageValue) {
            filteredGuides = filteredGuides.filter(guide => {
                // Use guides.json field names - check both possibilities
                const guideLangs = guide.guideLanguages || guide.languages || [];
                
                console.log('🔍 Language filter checking:', { 
                    filterValue: languageValue, 
                    guideLangs: guideLangs,
                    guideName: guide.guideName || guide.name 
                });
                
                if (Array.isArray(guideLangs)) {
                    return guideLangs.some(lang => {
                        // Direct match for English keys (japanese, english, chinese, etc.)
                        if (lang.toLowerCase() === languageValue.toLowerCase()) {
                            return true;
                        }
                        
                        // Match Japanese values (日本語, 英語, etc.)
                        const languageMap = {
                            'japanese': ['日本語', 'japanese'],
                            'english': ['英語', 'english'], 
                            'chinese': ['中国語', 'chinese'],
                            'korean': ['韓国語', 'korean'],
                            'spanish': ['スペイン語', 'spanish'],
                            'french': ['フランス語', 'french'],
                            'german': ['ドイツ語', 'german']
                        };
                        
                        // Check if the language value matches any mapped language
                        for (const [key, values] of Object.entries(languageMap)) {
                            if (languageValue === key && values.includes(lang)) {
                                return true;
                            }
                        }
                        
                        return false;
                    });
                }
                return false;
            });
        }
        
        // Apply keyword search
        if (searchKeyword) {
            filteredGuides = filteredGuides.filter(guide => {
                const name = (guide.guideName || guide.name || '').toLowerCase();
                const description = (guide.guideIntroduction || guide.description || '').toLowerCase();
                const location = (guide.location || '').toLowerCase();
                const city = (guide.city || '').toLowerCase();
                const specialties = (guide.guideSpecialties || guide.specialties || '').toLowerCase();
                const tags = Array.isArray(guide.tags) ? guide.tags.join(' ').toLowerCase() : (guide.tags || '').toLowerCase();
                
                console.log('🔍 Keyword search checking:', { 
                    keyword: searchKeyword, 
                    guideName: name,
                    location: location
                });
                
                return name.includes(searchKeyword) || 
                       description.includes(searchKeyword) || 
                       location.includes(searchKeyword) ||
                       city.includes(searchKeyword) ||
                       specialties.includes(searchKeyword) ||
                       tags.includes(searchKeyword);
            });
        }
        
        // Apply price filter
        if (priceValue) {
            filteredGuides = filteredGuides.filter(guide => {
                // Use consistent field names (sessionRate from API response)
                const price = parseInt(guide.sessionRate || guide.guideSessionRate || guide.price || 0);
                switch(priceValue) {
                    case 'budget': return price >= 5000 && price <= 10000;
                    case 'premium': return price >= 10001 && price <= 15000;
                    case 'luxury': return price >= 15001;
                    default: return true;
                }
            });
        }
        
        console.log(`✅ Filtered: ${filteredGuides.length}/${window.AppState.guides.length} guides`);
        
        // Re-render guide cards with filtered results
        if (window.renderGuideCards) {
            window.renderGuideCards(filteredGuides);
        }
        
        // Update counters using guide-renderer function
        if (window.updateGuideCounters) {
            window.updateGuideCounters(filteredGuides.length, window.AppState.guides.length);
        }
    }
}

// Global function exports for HTML compatibility (backwards compatibility)
window.resetFilters = function() {
    console.log('🔄 Global resetFilters called');
    handleResetFilters();
};

window.viewGuideDetails = function(guideId) {
    console.log('🔍 Global viewGuideDetails called for ID:', guideId);
    showGuideDetailModalById(guideId);
};

// Management center handler
function handleManagementCenter() {
    console.log('🏆 Management center clicked');
    if (window.showManagementCenter) {
        window.showManagementCenter();
    } else {
        alert('管理センターは開発中です');
    }
}