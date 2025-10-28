// Event handlers - centralized setup with AppState support
import { showSponsorLoginModal, showSponsorRegistrationModal } from '../ui/modal.mjs';
import { createGuideCardHTML } from '../ui/guide-renderer.mjs';
import { getText } from '../utils/language-utils.mjs';

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
        // Detect current page language and use appropriate detail page
        const isEnglish = window.location.pathname.includes('-en.html');
        const detailPage = isEnglish ? 'guide-detail-en.html' : 'guide-detail.html';
        const detailUrl = `${detailPage}?id=${guideId}`;
        
        console.log(`🌐 Detected language: ${isEnglish ? 'English' : 'Japanese'}, opening ${detailPage}`);
        window.open(detailUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
    } catch (error) {
        console.error('❌ Error opening guide details:', error);
        const errorMsg = getText('ガイド詳細を開けませんでした。もう一度お試しください。', 'Could not open guide details. Please try again.');
        alert(errorMsg);
    }
}

// Show tourist registration prompt - redirect to new registration system
function showTouristRegistrationPrompt(guideId) {
    // Store guide ID for return after registration
    sessionStorage.setItem('returnToGuideId', guideId);
    
    // Show simple alert and redirect to complete registration system
    const msg = getText(
        'ガイド詳細をご覧いただくには観光客登録が必要です。\n\n登録は無料で、安全にガイドとやり取りできます。\n今すぐ登録ページに移動しますか？',
        'Tourist registration is required to view guide details.\n\nRegistration is free and allows you to safely communicate with guides.\nWould you like to go to the registration page now?'
    );
    const shouldRedirect = confirm(msg
    );
    
    if (shouldRedirect) {
        // Detect current page language and redirect to appropriate registration page
        const isEnglish = window.location.pathname.includes('-en.html');
        const registrationPage = isEnglish ? 'tourist-registration-simple-en.html' : 'tourist-registration-simple.html';
        
        console.log(`🌐 Redirecting to ${registrationPage}`);
        window.location.href = registrationPage;
    }
}

// Legacy redirect function for compatibility
window.redirectToRegistration = function(guideId) {
    sessionStorage.setItem('returnToGuideId', guideId);
    
    // Detect current page language and redirect to appropriate registration page
    const isEnglish = window.location.pathname.includes('-en.html');
    const registrationPage = isEnglish ? 'tourist-registration-simple-en.html' : 'tourist-registration-simple.html';
    
    window.location.href = registrationPage;
};

// Make function globally available
window.showGuideDetailModalById = showGuideDetailModalById;

// Import unified location utilities
import { normalizeLocationToCode, compareLocations, convertPrefectureNameToCode } from '../utils/location-utils.mjs';

// 統一APIを使用した地域正規化（重複コード削除済み）
// 以前のnormalizeLocation関数は統一のlocation-utils.mjsに移行

function normalizeLanguage(selectedValue) {
    const languageMapping = {
        // UI option values (these come from HTML select)
        'japanese': ['japanese', 'ja', '日本語', 'japan'],
        'english': ['english', 'en', '英語', 'eng'],
        'chinese': ['chinese', 'zh', '中国語', 'chn'],
        'chinese_traditional': ['chinese', 'zh-tw', '中国語（繁体）', '繁体中文'],
        'korean': ['korean', 'ko', '韓国語', 'kor'],
        'thai': ['thai', 'th', 'タイ語'],
        'vietnamese': ['vietnamese', 'vi', 'ベトナム語'],
        'indonesian': ['indonesian', 'id', 'インドネシア語'],
        'tagalog': ['tagalog', 'tl', 'タガログ語'],
        'hindi': ['hindi', 'hi', 'ヒンディー語'],
        'spanish': ['spanish', 'es', 'スペイン語'],
        'french': ['french', 'fr', 'フランス語'],
        'german': ['german', 'de', 'ドイツ語'],
        'italian': ['italian', 'it', 'イタリア語'],
        'portuguese': ['portuguese', 'pt', 'ポルトガル語'],
        'russian': ['russian', 'ru', 'ロシア語'],
        'arabic': ['arabic', 'ar', 'アラビア語'],
        // Direct API values (fallback mapping)
        '日本語': ['japanese', 'ja', '日本語', 'japan'],
        '英語': ['english', 'en', '英語', 'eng'],
        '中国語': ['chinese', 'zh', '中国語', 'chn'],
        '韓国語': ['korean', 'ko', '韓国語', 'kor']
    };
    
    return languageMapping[selectedValue] || [selectedValue];
}


// ✅ 修正: executeSearchを使用するfilterGuides関数
async function filterGuides() {
    console.log('🔍 Running guide filters via executeSearch...');
    
    // executeSearchが利用可能な場合はそれを使用
    if (window.executeSearch && typeof window.executeSearch === 'function') {
        try {
            await window.executeSearch();
            return;
        } catch (error) {
            console.error('❌ executeSearch failed, falling back to legacy filter:', error);
        }
    }
    
    // フォールバック: 古いロジック（executeSearchが利用できない場合のみ）
    const state = window.AppState;
    if (!state || !state.guides || state.guides.length === 0) {
        console.warn('❌ No guides available for filtering. Current state:', {
            stateExists: !!state,
            guidesExists: !!(state && state.guides),
            guideCount: state && state.guides ? state.guides.length : 0
        });
        return;
    }
    
    // 🔧 Fix: Reset currentPage before filtering to prevent empty results
    if (state.currentPage && state.currentPage > 1) {
        console.log(`🔄 Resetting currentPage from ${state.currentPage} to 1 before filtering`);
        state.currentPage = 1;
    }
    
    console.log('📊 Starting with guides:', state.guides.length, 'guides');
    
    // Get filter values - using correct element IDs
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const priceFilter = document.getElementById('priceFilter');
    const keywordInput = document.getElementById('keywordInput');
    
    const selectedLocation = locationFilter?.value || '';
    const selectedLanguage = languageFilter?.value || '';
    const selectedPrice = priceFilter?.value || '';
    const keyword = keywordInput?.value?.trim().toLowerCase() || '';
    
    console.log('🎯 Filter criteria:', { selectedLocation, selectedLanguage, selectedPrice, keyword });
    
    // Start with all guides
    let filteredGuides = [...state.guides];
    
    // Apply location filter using normalization
    if (selectedLocation && selectedLocation !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            const guideLocation = guide.location || '';
            
            console.log(`📍 Checking guide location "${guideLocation}" against filter "${selectedLocation}"`);
            
            // Check if guide location matches the selected filter
            const matches = (() => {
                // 1. Direct code match (e.g., "okinawa" matches "okinawa")
                if (guideLocation === selectedLocation) {
                    console.log(`✅ Direct code match: "${guideLocation}" === "${selectedLocation}"`);
                    return true;
                }
                
                // 2. Prefecture name to code conversion
                const convertedLocation = convertPrefectureNameToCode(selectedLocation);
                if (guideLocation === convertedLocation) {
                    console.log(`✅ Prefecture name converted: "${selectedLocation}" -> "${convertedLocation}" matches "${guideLocation}"`);
                    return true;
                }
                
                // 3. Case insensitive match
                if (guideLocation.toLowerCase().includes(selectedLocation.toLowerCase())) {
                    console.log(`✅ Case insensitive match: "${guideLocation}" includes "${selectedLocation}"`);
                    return true;
                }
                
                // 4. Use unified location comparison API
                if (compareLocations(guideLocation, selectedLocation)) {
                    console.log(`✅ Unified API match: "${guideLocation}" matches "${selectedLocation}"`);
                    return true;
                }
                
                return false;
            })();
            
            return matches;
        });
        console.log(`📍 Location filter applied: ${filteredGuides.length} guides match "${selectedLocation}"`);
    }
    
    // Apply language filter using normalization  
    if (selectedLanguage && selectedLanguage !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            const languages = guide.languages || [];
            const normalizedLanguages = normalizeLanguage(selectedLanguage);
            
            console.log(`🗣️ Checking guide languages:`, languages, `against filter:`, selectedLanguage, `normalized:`, normalizedLanguages);
            
            // Handle array of languages (e.g., ["日本語", "English"])
            if (Array.isArray(languages) && languages.length > 0) {
                const matches = languages.some(lang => {
                    if (!lang) return false;
                    
                    // Direct match
                    if (lang === selectedLanguage) {
                        console.log(`✅ Direct language match: "${lang}" === "${selectedLanguage}"`);
                        return true;
                    }
                    
                    // Normalized match
                    return normalizedLanguages.some(mapped => {
                        const match = lang.toLowerCase() === mapped.toLowerCase() ||
                                     lang.toLowerCase().includes(mapped.toLowerCase()) ||
                                     mapped.toLowerCase().includes(lang.toLowerCase());
                        if (match) {
                            console.log(`✅ Normalized language match: "${lang}" <-> "${mapped}"`);
                        }
                        return match;
                    });
                });
                return matches;
            }
            
            // Handle string languages (fallback)
            if (typeof languages === 'string') {
                return normalizedLanguages.some(mapped => 
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
            // Parse sessionRate from API (comes as string)
            const priceString = guide.sessionRate || guide.price || '0';
            const price = parseInt(priceString, 10) || 0;
            
            console.log(`💰 Checking guide ${guide.name}: sessionRate=${guide.sessionRate}, parsed=${price}`);
            
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
    
    // Apply keyword search (enhanced for array fields)
    if (keyword && keyword !== '') {
        filteredGuides = filteredGuides.filter(guide => {
            // Search in multiple fields, handling arrays properly
            const searchFields = [
                guide.name || '',
                guide.guideName || '',
                guide.guideIntroduction || '',
                guide.introduction || '',
                guide.location || ''
            ];
            
            // Handle array fields like specialties
            if (Array.isArray(guide.specialties)) {
                searchFields.push(...guide.specialties);
            } else if (guide.specialties) {
                searchFields.push(guide.specialties);
            }
            
            // Handle array fields like languages  
            if (Array.isArray(guide.languages)) {
                searchFields.push(...guide.languages);
            } else if (guide.languages) {
                searchFields.push(guide.languages);
            }
            
            const searchText = searchFields.join(' ').toLowerCase();
            const matches = searchText.includes(keyword);
            
            console.log(`🔍 Keyword "${keyword}" check for ${guide.name}:`, {
                searchFields: searchFields.slice(0, 5), // Show first 5 fields for debugging
                matches
            });
            
            return matches;
        });
        console.log(`🔍 Keyword filter applied: ${filteredGuides.length} guides match "${keyword}"`);
    }
    
    // Store original guides if not already stored
    if (!state.originalGuides) {
        state.originalGuides = [...state.guides];
    }
    
    // Update state with filtered results and persistence
    state.filteredGuides = filteredGuides;
    state.isFiltered = filteredGuides.length !== state.guides.length; // より正確な判定
    state.currentPage = 1; // Reset to first page
    
    console.log('📊 Filter state updated:', {
        totalGuides: state.guides.length,
        filteredGuides: filteredGuides.length,
        isFiltered: state.isFiltered
    });
    
    // Render with new modular system
    if (window.renderGuideCards) {
        window.renderGuideCards(filteredGuides, true, true);
    }
    
    // Update counters
    if (window.updateGuideCounters) {
        window.updateGuideCounters(filteredGuides.length, state.originalGuides.length);
    }
    
    console.log(`✅ Filter complete: ${filteredGuides.length} guides found`);
};

window.resetFilters = function() {
    console.log('🔄 Resetting all filters...');
    
    // Clear filter selections - using correct element IDs
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const priceFilter = document.getElementById('priceFilter');
    const keywordInput = document.getElementById('keywordInput');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (keywordInput) keywordInput.value = '';
    
    // Clear filter state and reload all guides
    if (window.AppState && window.AppState.originalGuides) {
        window.AppState.guides = [...window.AppState.originalGuides];
        window.AppState.isFiltered = false;
        window.AppState.filteredGuides = [];
        console.log('✅ Filter state cleared and original guides restored');
        window.AppState.filteredGuides = null;
        window.AppState.isFiltered = false;
        window.AppState.currentPage = 1;
        
        console.log('🔄 Reset to original guides:', window.AppState.guides.length);
        
        // Render with new modular system
        if (window.renderGuideCards) {
            window.renderGuideCards(window.AppState.guides, true, true);
        }
        
        // Update counters
        if (window.updateGuideCounters) {
            window.updateGuideCounters(window.AppState.guides.length, window.AppState.guides.length);
        }
    } else {
        console.warn('❌ No original guides found - forcing page reload');
        location.reload();
    }
    
    console.log('✅ Filters reset');
};

// Bookmark functionality
function toggleBookmark(guideId) {
    console.log('🔖 Toggle bookmark for guide:', guideId);
    
    // Get current bookmarks from localStorage
    let bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
    
    if (bookmarks.includes(guideId)) {
        // Remove from bookmarks
        bookmarks = bookmarks.filter(id => id !== guideId);
        showToast('ブックマークから削除しました', 'info');
        console.log('📌 Removed from bookmarks');
    } else {
        // Add to bookmarks
        bookmarks.push(guideId);
        showToast('ブックマークに追加しました', 'success');
        console.log('📌 Added to bookmarks');
    }
    
    // Save to localStorage
    localStorage.setItem('bookmarkedGuides', JSON.stringify(bookmarks));
    
    // Update button state
    updateBookmarkButtonState(guideId, bookmarks.includes(guideId));
}

// ⚠️ DEPRECATED: Comparison functionality (moved to button-setup.js)
// This function is kept for backward compatibility but is no longer used
// All comparison logic is now handled by button-setup.js > handleCompareClick()
function toggleComparison(guideId) {
    console.warn('⚠️ toggleComparison called from event-handlers.mjs (deprecated). Use button-setup.js handleCompareClick instead.');
    // No-op to prevent duplicate toast messages and conflicting state changes
    // The actual functionality is in button-setup.js > handleCompareClick()
}

// Update bookmark button visual state
function updateBookmarkButtonState(guideId, isBookmarked) {
    const bookmarkBtn = document.querySelector(`.bookmark-btn[data-guide-id="${guideId}"]`);
    if (bookmarkBtn) {
        if (isBookmarked) {
            bookmarkBtn.classList.remove('btn-outline-warning');
            bookmarkBtn.classList.add('btn-warning');
            bookmarkBtn.innerHTML = '<i class="bi bi-bookmark-fill"></i> <span class="ms-1">保存済み</span>';
        } else {
            bookmarkBtn.classList.remove('btn-warning');
            bookmarkBtn.classList.add('btn-outline-warning');
            bookmarkBtn.innerHTML = '<i class="bi bi-bookmark"></i> <span class="ms-1">ブックマーク</span>';
        }
    }
}

// Update compare button visual state
function updateCompareButtonState(guideId, isCompared) {
    const compareBtn = document.querySelector(`.compare-btn[data-guide-id="${guideId}"]`);
    if (compareBtn) {
        if (isCompared) {
            compareBtn.classList.remove('btn-outline-success');
            compareBtn.classList.add('btn-success');
            compareBtn.innerHTML = '<i class="bi bi-check2-square-fill"></i> <span class="ms-1">比較中</span>';
        } else {
            compareBtn.classList.remove('btn-success');
            compareBtn.classList.add('btn-outline-success');
            compareBtn.innerHTML = '<i class="bi bi-check2-square"></i> <span class="ms-1">比較</span>';
        }
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast show';
    toastElement.setAttribute('role', 'alert');
    
    const bgColorClass = {
        'success': 'bg-success',
        'info': 'bg-info', 
        'warning': 'bg-warning',
        'error': 'bg-danger'
    }[type] || 'bg-info';
    
    toastElement.innerHTML = `
        <div class="toast-header ${bgColorClass} text-white">
            <strong class="me-auto">TomoTrip</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
        }
    }, 3000);
    
    console.log(`📱 Toast: ${message}`);
}

// Export bookmark and comparison functions globally
window.toggleBookmark = toggleBookmark;
if (!window.toggleComparison) {
    window.toggleComparison = toggleComparison;
}
window.updateBookmarkButtonState = updateBookmarkButtonState;
window.updateCompareButtonState = updateCompareButtonState;
window.showToast = showToast;

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
            case 'toggle-bookmark':
                if (guideId) toggleBookmark(guideId);
                break;
            case 'remove-bookmark':
                if (guideId) removeBookmark(guideId);
                break;
            case 'toggle-comparison':
                if (guideId) toggleComparison(guideId);
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
            // Use global registration function from button-setup.js
            if (typeof window.showRegistrationChoice === 'function') {
                window.showRegistrationChoice();
            } else {
                console.warn('Registration choice function not available');
            }
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
    // REMOVED: Moved to button-setup.js to avoid conflicts
    // All tourist/guide login button handlers are now in button-setup.js
    
    const sponsorLoginBtn = document.getElementById('sponsorLoginBtn');
    
    if (sponsorLoginBtn) {
        sponsorLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔑 Sponsor login clicked');
            showSponsorLoginModal();
        });
    }
    
    console.log('%cSponsor button events setup complete', 'color: #28a745;');
}

// 🔧 FIX: 重複したshowRegistrationChoiceModal関数を削除
// button-setup.jsの関数を使用して重複を避ける

// 🔧 FIX: 重複したselectRegistrationType関数を削除
// button-setup.jsの関数を使用

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
        const msg = getText('リダイレクトに失敗しました', 'Redirect failed');
        alert(msg);
    }
}

function handleSponsorLogin() {
    console.log('Sponsor login clicked');
    console.log('🔐 DIRECT ACTION: Showing sponsor login modal');
    try {
        showSponsorLoginModal();
    } catch (error) {
        console.error('Modal failed:', error);
        const msg = getText('モーダル表示に失敗しました', 'Failed to display modal');
        alert(msg);
    }
}

// Language switcher handlers - CSP compliant
export function wireLanguageSwitcher() {
    const jpBtn = document.getElementById('jpBtn');
    const enBtn = document.getElementById('enBtn');
    
    // Detect current page language
    const isEnglishPage = window.location.pathname.includes('index-en.html');
    const isJapanesePage = !isEnglishPage; // Default to Japanese
    
    console.log(`🌐 Language switcher setup: ${isEnglishPage ? 'English' : 'Japanese'} page`);
    
    if (jpBtn) {
        if (isJapanesePage) {
            // Already on Japanese page - do nothing
            jpBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🇯🇵 Already on Japanese page - no action');
            });
        } else {
            // On English page - switch to Japanese
            jpBtn.addEventListener('click', switchToJapanese);
        }
    }
    
    if (enBtn) {
        if (isEnglishPage) {
            // Already on English page - do nothing
            enBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🇺🇸 Already on English page - no action');
            });
        } else {
            // On Japanese page - switch to English
            enBtn.addEventListener('click', switchToEnglish);
        }
    }
}

function switchToJapanese() {
    console.log('🇯🇵 Switching to Japanese');
    window.location.href = 'index.html';
}

function switchToEnglish() {
    console.log('🇺🇸 Switching to English');
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
        const msg = getText('管理センターは開発中です', 'Management center is under development');
        alert(msg);
    }
}

// ✅ Export the updated filterGuides function globally - ensure it's always available
window.filterGuides = filterGuides;

// 確実にグローバル関数として登録されることを保証
if (typeof window !== 'undefined') {
    window.filterGuides = filterGuides;
    console.log('✅ window.filterGuides function registered globally');
}