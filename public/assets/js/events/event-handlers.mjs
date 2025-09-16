// Event handlers - centralized setup with AppState support
import { showSponsorLoginModal, showSponsorRegistrationModal } from '../ui/modal.mjs';
import { createGuideCardHTML } from '../ui/guide-renderer.mjs';

// Global guide detail function - opens guide detail page with auth check
async function showGuideDetailModalById(guideId) {
    console.log('🔍 Opening guide detail for ID:', guideId);
    
    // Check tourist authentication status
    const touristAuth = localStorage.getItem('touristAuth') || sessionStorage.getItem('touristAuth');
    const touristData = localStorage.getItem('touristRegistrationData') || sessionStorage.getItem('touristRegistrationData');
    
    if (!touristAuth && !touristData) {
        console.log('⚠️ Tourist not authenticated, showing registration prompt');
        showTouristRegistrationPrompt(guideId);
        return;
    }
    
    try {
        // Open guide detail page - it will load data from API
        const detailUrl = `guide-detail.html?id=${guideId}`;
        window.open(detailUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
    } catch (error) {
        console.error('❌ Error opening guide details:', error);
        alert('ガイド詳細を開けませんでした。もう一度お試しください。');
    }
}

// Show tourist registration prompt modal
function showTouristRegistrationPrompt(guideId) {
    // Create and show Bootstrap modal
    const modalHTML = `
        <div class="modal fade" id="touristAuthModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">観光客登録が必要です</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>ガイドの詳細情報をご覧いただくには、観光客としての登録が必要です。</p>
                        <p>登録は無料で、数分で完了します。</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" onclick="redirectToRegistration('${guideId}')">登録する</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page if not exists
    if (!document.getElementById('touristAuthModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('touristAuthModal'));
    modal.show();
}

// Make redirect function globally available
window.redirectToRegistration = function(guideId) {
    sessionStorage.setItem('pendingGuideId', guideId);
    window.location.href = '/tourist-registration-simple.html';
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
    
    // Get filter values
    const regionSelect = document.getElementById('regionSelect');
    const languageSelect = document.getElementById('languageSelect');
    const priceSelect = document.getElementById('priceSelect');
    
    const selectedRegion = regionSelect?.value || '';
    const selectedLanguage = languageSelect?.value || '';
    const selectedPrice = priceSelect?.value || '';
    
    console.log('🎯 Filter criteria:', { selectedRegion, selectedLanguage, selectedPrice });
    
    // Start with all guides
    let filteredGuides = [...state.guides];
    
    // Apply region filter
    if (selectedRegion && selectedRegion !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            const guideLocation = guide.location || guide.guideLocation || '';
            return guideLocation.toLowerCase() === selectedRegion.toLowerCase();
        });
        console.log(`📍 Region filter applied: ${filteredGuides.length} guides match "${selectedRegion}"`);
    }
    
    // Apply language filter
    if (selectedLanguage && selectedLanguage !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            const languages = guide.languages || guide.guideLanguages || [];
            if (Array.isArray(languages)) {
                return languages.some(lang => lang.toLowerCase().includes(selectedLanguage.toLowerCase()));
            } else if (typeof languages === 'string') {
                return languages.toLowerCase().includes(selectedLanguage.toLowerCase());
            }
            return false;
        });
        console.log(`🗣️ Language filter applied: ${filteredGuides.length} guides match "${selectedLanguage}"`);
    }
    
    // Apply price filter
    if (selectedPrice && selectedPrice !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            const price = Number(guide.price || guide.sessionRate || guide.guideSessionRate || 0);
            const priceRange = selectedPrice.split('-');
            
            if (priceRange.length === 2) {
                const minPrice = Number(priceRange[0]);
                const maxPrice = Number(priceRange[1]);
                return price >= minPrice && price <= maxPrice;
            } else if (selectedPrice.includes('+')) {
                const minPrice = Number(selectedPrice.replace('+', ''));
                return price >= minPrice;
            }
            return true;
        });
        console.log(`💰 Price filter applied: ${filteredGuides.length} guides match "${selectedPrice}"`);
    }
    
    // Update state and display
    state.guides = filteredGuides;
    state.currentPage = 1; // Reset to first page
    displayGuides(1, state);
    
    console.log(`✅ Filter complete: ${filteredGuides.length} guides found`);
};

window.resetFilters = function() {
    console.log('🔄 Resetting all filters...');
    
    // Clear filter selections
    const regionSelect = document.getElementById('regionSelect');
    const languageSelect = document.getElementById('languageSelect');
    const priceSelect = document.getElementById('priceSelect');
    
    if (regionSelect) regionSelect.value = '';
    if (languageSelect) languageSelect.value = '';
    if (priceSelect) priceSelect.value = '';
    
    // Reload all guides
    if (window.AppState && window.AppState.originalGuides) {
        window.AppState.guides = [...window.AppState.originalGuides];
        displayGuides(1, window.AppState);
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
                const searchText = [
                    guide.name, guide.guideName,
                    guide.description, guide.bio, guide.introduction,
                    guide.specialty, guide.specialties
                ].join(' ').toLowerCase();
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