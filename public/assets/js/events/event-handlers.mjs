// Event handlers - centralized setup with AppState support
import { showSponsorLoginModal, showSponsorRegistrationModal } from '../ui/modal.mjs';
import { createGuideCardHTML } from '../ui/guide-renderer.mjs';

// Global guide detail function - opens guide detail page with auth check
async function showGuideDetailModalById(guideId) {
    console.log('🔍 Opening guide detail for ID:', guideId);
    
    // Check tourist authentication status
    const touristAuth = sessionStorage.getItem('touristAuth');
    const touristAuthTimestamp = sessionStorage.getItem('touristAuthTimestamp');
    
    // Check if auth exists and is not too old (1 hour limit)
    const isAuthValid = touristAuth && touristAuthTimestamp && 
                       (Date.now() - parseInt(touristAuthTimestamp)) < (60 * 60 * 1000);
    
    if (!isAuthValid) {
        console.log('❌ Tourist not authenticated or auth expired - showing registration prompt');
        showTouristRegistrationPrompt(guideId);
        return;
    }
    
    console.log('✅ Tourist authenticated - proceeding to guide details');
    
    try {
        // Open guide detail page - it will load data from API
        const detailUrl = `guide-detail.html?id=${guideId}`;
        window.open(detailUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
    } catch (error) {
        console.error('❌ Error opening guide details:', error);
        alert('ガイド詳細を開けませんでした。もう一度お試しください。');
    }
}

// Show tourist registration prompt - redirect to new registration system
function showTouristRegistrationPrompt(guideId) {
    // Store guide ID for return after registration
    sessionStorage.setItem('returnToGuideId', guideId);
    
    // Show simple alert and redirect to complete registration system
    const shouldRedirect = confirm(
        'ガイド詳細をご覧いただくには観光客登録が必要です。\n\n' +
        '登録は無料で、安全にガイドとやり取りできます。\n' +
        '今すぐ登録ページに移動しますか？'
    );
    
    if (shouldRedirect) {
        // Redirect to the complete tourist registration page
        window.location.href = 'tourist-registration-simple.html';
    }
}

// Legacy redirect function for compatibility
window.redirectToRegistration = function(guideId) {
    sessionStorage.setItem('returnToGuideId', guideId);
    window.location.href = 'tourist-registration-simple.html';
};

// Make function globally available
window.showGuideDetailModalById = showGuideDetailModalById;

// Global filter functions for search functionality
window.filterGuides = function() {
    console.log('🔍 Running guide filters...');
    
    const state = window.AppState;
    if (!state || !state.guides) {
        console.warn('❌ No guides available for filtering');
        return;
    }
    
    // Get filter values - using correct element IDs
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    const selectedLocation = locationFilter?.value || '';
    const selectedLanguage = languageFilter?.value || '';
    const selectedPrice = priceFilter?.value || '';
    
    console.log('🎯 Filter criteria:', { selectedLocation, selectedLanguage, selectedPrice });
    
    // Start with all guides
    let filteredGuides = [...state.guides];
    
    // Location mapping for filter values to actual location strings (Prefecture System)
    const locationMapping = {
        'tokyo': ['東京都', '東京', 'tokyo'],
        'osaka': ['大阪府', '大阪市', '大阪', 'osaka'],
        'kyoto': ['京都府', '京都市', '京都', 'kyoto'],
        'kanagawa': ['神奈川県', '横浜市', '神奈川', 'kanagawa', 'yokohama'],
        'hyogo': ['兵庫県', '神戸市', '兵庫', 'hyogo', 'kobe'],
        'aichi': ['愛知県', '名古屋市', '愛知', 'aichi', 'nagoya'],
        'fukuoka': ['福岡県', '福岡市', '福岡', 'fukuoka'],
        'okinawa': ['沖縄県', '那覇市', '石垣市', '沖縄', 'okinawa', 'naha', 'ishigaki'],
        'hokkaido': ['北海道', '札幌市', 'hokkaido', 'sapporo'],
        'miyagi': ['宮城県', '仙台市', '宮城', 'miyagi', 'sendai'],
        'hiroshima': ['広島県', '広島市', '広島', 'hiroshima']
    };
    
    // Apply location filter
    if (selectedLocation && selectedLocation !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            const guideLocation = guide.location || '';
            
            // Enhanced location mapping for prefecture-based filtering
            const locationMapping = {
                'tokyo': ['東京都', '東京', 'tokyo'],
                'osaka': ['大阪府', '大阪市', '大阪', 'osaka'],
                'kyoto': ['京都府', '京都市', '京都', 'kyoto'],
                'kanagawa': ['神奈川県', '横浜市', '神奈川', 'kanagawa'],
                'hyogo': ['兵庫県', '神戸市', '兵庫', 'hyogo'],
                'aichi': ['愛知県', '名古屋市', '愛知', 'aichi'],
                'fukuoka': ['福岡県', '福岡市', '福岡', 'fukuoka'],
                'okinawa': ['沖縄県', '那覇市', '石垣市', '沖縄', 'okinawa'],
                'hokkaido': ['北海道', '札幌市', 'hokkaido'],
                'hiroshima': ['広島県', '広島市', '広島', 'hiroshima']
            };
            
            const mappedLocations = locationMapping[selectedLocation] || [selectedLocation];
            
            // Check if guide location contains any of the mapped location terms
            return mappedLocations.some(loc => 
                guideLocation.includes(loc) || 
                guideLocation.toLowerCase().includes(loc.toLowerCase())
            );
        });
        console.log(`📍 Location filter applied: ${filteredGuides.length} guides match "${selectedLocation}"`);
    }
    
    // Apply language filter
    if (selectedLanguage && selectedLanguage !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            const languages = guide.languages || [];
            
            // Enhanced language mapping for both English and Japanese forms
            const languageMapping = {
                'japanese': ['japanese', 'ja', '日本語', 'japan', 'jpn'],
                'english': ['english', 'en', '英語', 'eng'],
                'chinese': ['chinese', 'zh', '中国語', 'chinese', 'chn', '中国語（簡体）'],
                'chinese_traditional': ['chinese_traditional', 'zh-tw', '中国語（繁体）', 'traditional chinese'],
                'korean': ['korean', 'ko', '韓国語', 'korea', 'kor'],
                'thai': ['thai', 'th', 'タイ語', 'thailand'],
                'vietnamese': ['vietnamese', 'vi', 'ベトナム語', 'vietnam'],
                'indonesian': ['indonesian', 'id', 'インドネシア語', 'indonesia'],
                'spanish': ['spanish', 'es', 'スペイン語', 'spain'],
                'french': ['french', 'fr', 'フランス語', 'france'],
                'german': ['german', 'de', 'ドイツ語', 'germany'],
                'portuguese': ['portuguese', 'pt', 'ポルトガル語', 'portugal']
            };
            
            const mappedLanguages = languageMapping[selectedLanguage] || [selectedLanguage];
            
            // Handle both array and empty array cases
            if (Array.isArray(languages) && languages.length > 0) {
                return languages.some(lang => 
                    mappedLanguages.some(mapped => 
                        lang && lang.toLowerCase().includes(mapped.toLowerCase())
                    )
                );
            } else if (typeof languages === 'string' && languages.length > 0) {
                return mappedLanguages.some(mapped => 
                    languages.toLowerCase().includes(mapped.toLowerCase())
                );
            }
            
            return false;
        });
        console.log(`🗣️ Language filter applied: ${filteredGuides.length} guides match "${selectedLanguage}"`);
    }
    
    // Apply price filter
    if (selectedPrice && selectedPrice !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            // Use sessionRate field from API data
            const price = Number(guide.sessionRate || guide.price || 0);
            
            switch(selectedPrice) {
                case 'budget':  // ¥6,000～¥10,000
                    return price >= 6000 && price <= 10000;
                case 'premium': // ¥10,001～¥20,000  
                    return price >= 10001 && price <= 20000;
                case 'luxury':  // ¥20,001+
                    return price >= 20001;
                default:
                    return true;
            }
        });
        console.log(`💰 Price filter applied: ${filteredGuides.length} guides match "${selectedPrice}" (price range)`);
    }
    
    // Update state and display
    state.guides = filteredGuides;
    state.currentPage = 1; // Reset to first page
    
    // Render with new modular system
    if (window.renderGuideCards) {
        window.renderGuideCards(filteredGuides);
    }
    
    // Update counters
    if (window.updateGuideCounters) {
        window.updateGuideCounters(filteredGuides.length, state.originalGuides ? state.originalGuides.length : filteredGuides.length);
    }
    
    console.log(`✅ Filter complete: ${filteredGuides.length} guides found`);
};

window.resetFilters = function() {
    console.log('🔄 Resetting all filters...');
    
    // Clear filter selections - using correct element IDs
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    
    // Reload all guides
    if (window.AppState && window.AppState.originalGuides) {
        window.AppState.guides = [...window.AppState.originalGuides];
        window.AppState.currentPage = 1;
        
        // Render with new modular system
        if (window.renderGuideCards) {
            window.renderGuideCards(window.AppState.guides);
        }
        
        // Update counters
        if (window.updateGuideCounters) {
            window.updateGuideCounters(window.AppState.guides.length, window.AppState.guides.length);
        }
    } else {
        location.reload();
    }
    
    console.log('✅ Filters reset');
};

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
                showTouristRegistrationPrompt(guideId);
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

// CSP compliant header button event setup
function setupSponsorButtonEvents() {
    // Header buttons (use correct IDs from HTML)
    const registerBtn = document.getElementById('registerBtn');
    const loginDropdown = document.getElementById('loginDropdown');
    
    // Original sponsor buttons (if they exist)
    const regBtn = document.getElementById('sponsorRegBtn');
    const loginBtn = document.getElementById('sponsorLoginBtn');
    const regBtnMobile = document.getElementById('sponsorRegBtnMobile');
    const loginBtnMobile = document.getElementById('sponsorLoginBtnMobile');
    
    // Header register button - show registration choice modal
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎯 Header register button clicked - showing registration choices');
            showRegistrationChoiceModal();
        });
    }
    
    // Header login dropdown - setup toggle functionality
    if (loginDropdown) {
        loginDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎯 Header login dropdown clicked');
            toggleLoginDropdown();
        });
    }
    
    // Original sponsor buttons (if they exist)
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
    
    // Setup login dropdown button events
    const directTouristLoginBtn = document.getElementById('directTouristLoginBtn');
    const directGuideLoginBtn = document.getElementById('directGuideLoginBtn');
    const sponsorLoginBtn = document.getElementById('sponsorLoginBtn');
    
    if (directTouristLoginBtn) {
        directTouristLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔑 Tourist login clicked');
            // Show tourist login modal that should exist in HTML
            const touristLoginModal = document.getElementById('touristLoginModal');
            if (touristLoginModal) {
                const modal = new bootstrap.Modal(touristLoginModal);
                modal.show();
            } else {
                console.warn('Tourist login modal not found');
                alert('観光客ログイン機能を準備中です。');
            }
        });
    }
    
    if (directGuideLoginBtn) {
        directGuideLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔑 Guide login clicked');
            // Show guide login modal that should exist in HTML
            const guideLoginModal = document.getElementById('guideLoginModal');
            if (guideLoginModal) {
                const modal = new bootstrap.Modal(guideLoginModal);
                modal.show();
            } else {
                console.warn('Guide login modal not found');
                alert('ガイドログイン機能を準備中です。');
            }
        });
    }
    
    if (sponsorLoginBtn) {
        sponsorLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔑 Sponsor login clicked');
            showSponsorLoginModal();
        });
    }
    
    console.log('%cSponsor button events setup complete', 'color: #28a745;');
}

// Show registration choice modal for header register button
function showRegistrationChoiceModal() {
    const modalHTML = `
        <div class="modal fade" id="registrationChoiceModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
                    <div class="modal-header border-0" style="background: linear-gradient(135deg, #4ecdc4, #44a08d); color: white; border-radius: 15px 15px 0 0;">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-person-plus me-2"></i>新規登録
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="閉じる"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="alert alert-info d-flex align-items-center mb-4" role="alert">
                            <i class="bi bi-info-circle me-2"></i>
                            <div>
                                <strong>ご登録の種類をお選びください</strong><br>
                                <small>それぞれ異なるサービスをご利用いただけます</small>
                            </div>
                        </div>
                        
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="card h-100 border-primary choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="selectRegistrationType('tourist')">
                                    <div class="card-body text-center p-4">
                                        <i class="bi bi-person-circle text-primary mb-3" style="font-size: 3rem;"></i>
                                        <h6 class="fw-bold text-primary mb-2">観光客登録</h6>
                                        <p class="text-muted small mb-3">ガイドを探して旅行を楽しみます</p>
                                        <div class="mt-3">
                                            <span class="badge bg-primary">無料</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4">
                                <div class="card h-100 border-success choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="selectRegistrationType('guide')">
                                    <div class="card-body text-center p-4">
                                        <i class="bi bi-person-badge text-success mb-3" style="font-size: 3rem;"></i>
                                        <h6 class="fw-bold text-success mb-2">ガイド登録</h6>
                                        <p class="text-muted small mb-3">地元ガイドとして観光客にサービスを提供します</p>
                                        <div class="mt-3">
                                            <span class="badge bg-success">収入機会</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4">
                                <div class="card h-100 border-warning choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="selectRegistrationType('sponsor')">
                                    <div class="card-body text-center p-4">
                                        <i class="bi bi-shop text-warning mb-3" style="font-size: 3rem;"></i>
                                        <h6 class="fw-bold text-warning mb-2">スポンサー登録</h6>
                                        <p class="text-muted small mb-3">店舗・施設として観光客を集客します</p>
                                        <div class="mt-3">
                                            <span class="badge bg-warning text-dark">ビジネス</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4 pt-0">
                        <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal" style="border-radius: 25px;">
                            <i class="bi bi-x-circle me-1"></i>キャンセル
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if it exists and add new one
    const existingModal = document.getElementById('registrationChoiceModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('registrationChoiceModal'));
    modal.show();
}

// Handle registration type selection
window.selectRegistrationType = function(type) {
    const modal = bootstrap.Modal.getInstance(document.getElementById('registrationChoiceModal'));
    if (modal) {
        modal.hide();
    }
    
    console.log('🎯 Registration type selected:', type);
    
    setTimeout(() => {
        switch(type) {
            case 'tourist':
                showTouristRegistrationPrompt(null); // Show tourist registration modal
                break;
            case 'guide':
                // Redirect to PERFECT 3-step guide registration file
                console.log('🚀 Redirecting to PERFECT guide registration (guide-registration-perfect.html)');
                window.location.href = 'guide-registration-perfect.html';
                break;
            case 'sponsor':
                window.location.href = 'sponsor-registration.html';
                break;
            default:
                console.error('Unknown registration type:', type);
        }
    }, 300);
};

// Toggle login dropdown
function toggleLoginDropdown() {
    const dropdown = document.getElementById('customLoginDropdown');
    if (!dropdown) {
        console.warn('Login dropdown not found');
        return;
    }
    
    const isVisible = dropdown.style.display === 'block';
    
    if (isVisible) {
        dropdown.style.display = 'none';
        console.log('🔽 Login dropdown hidden');
    } else {
        dropdown.style.display = 'block';
        console.log('🔼 Login dropdown shown');
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && !document.getElementById('loginDropdown').contains(e.target)) {
                    dropdown.style.display = 'none';
                    document.removeEventListener('click', closeDropdown);
                    console.log('🔽 Login dropdown auto-closed');
                }
            });
        }, 100);
    }
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
    
    // Display initial page with pagination
    if (window.renderGuideCards) {
        window.renderGuideCards(state.guides);
    }
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
    
    // Use properly imported createGuideCardHTML function for consistent detailed display
    const cardsHTML = guidesForPage.map(guide => createGuideCardHTML(guide)).join('');
    
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
                if (window.renderGuideCards) {
                    window.renderGuideCards(currentState.guides);
                }
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = page === totalPages;
        nextBtn.onclick = () => {
            if (page < totalPages) {
                currentState.currentPage = page + 1;
                if (window.renderGuideCards) {
                    window.renderGuideCards(currentState.guides);
                }
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
    console.log('🎯 Applying current filters with keyword:', keyword);
    
    // Get current filter values
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter'); 
    const priceFilter = document.getElementById('priceFilter');
    
    const locationValue = locationFilter?.value || '';
    const languageValue = languageFilter?.value || '';
    const priceValue = priceFilter?.value || '';
    
    console.log('📊 Filter values:', { locationValue, languageValue, priceValue, keyword });
    
    // Apply filters if AppState is available
    if (window.AppState && window.AppState.guides) {
        let filteredGuides = [...window.AppState.guides];
        
        // Apply location filter
        if (locationValue) {
            filteredGuides = filteredGuides.filter(guide => {
                const guideLoc = (guide.location || guide.prefecture || guide.city || '').toLowerCase();
                return guideLoc === locationValue.toLowerCase() || 
                       guideLoc.includes(locationValue.toLowerCase());
            });
        }
        
        // Apply language filter 
        if (languageValue) {
            filteredGuides = filteredGuides.filter(guide => {
                if (Array.isArray(guide.languages)) {
                    return guide.languages.some(lang => 
                        lang.toLowerCase().includes(languageValue.toLowerCase())
                    );
                } else if (Array.isArray(guide.guideLanguages)) {
                    return guide.guideLanguages.some(lang => 
                        lang.toLowerCase().includes(languageValue.toLowerCase())
                    );
                }
                return false;
            });
        }
        // Apply price filter
        if (priceValue) {
            filteredGuides = filteredGuides.filter(guide => {
                const price = Number(guide.price || guide.sessionRate || guide.guideSessionRate || 0);
                switch(priceValue) {
                    case 'budget': return price >= 6000 && price <= 10000;
                    case 'premium': return price >= 10001 && price <= 20000; 
                    case 'luxury': return price >= 20001;
                    default: return true;
                }
            });
        }
        
        // Apply keyword search
        if (keyword) {
            filteredGuides = filteredGuides.filter(guide => {
                const searchText = (guide.name || guide.guideName || '').toLowerCase();
                return searchText.includes(keyword);
            });
        }
        
        console.log(`✅ Filtered: ${filteredGuides.length}/${window.AppState.guides.length} guides`);
        
        // Re-render guide cards
        if (window.renderGuideCards) {
            window.renderGuideCards(filteredGuides);
        }
        
        // Update counters
        if (window.updateGuideCounters) {
            window.updateGuideCounters(filteredGuides.length, window.AppState.guides.length);
        }
        
        // Scroll to results
        const guideSection = document.getElementById('guideSection') || 
                             document.getElementById('guidesContainer') ||
                             document.querySelector('.guide-cards-container');
        if (guideSection) {
            guideSection.scrollIntoView({ behavior: 'smooth' });
        }
        
    } else {
        console.warn('⚠️ AppState or guides not available for filtering');
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