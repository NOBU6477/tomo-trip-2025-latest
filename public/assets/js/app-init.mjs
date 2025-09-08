// TomoTrip Application Initialization - CSP Compliant
// Consolidated from inline scripts in index.html

import { setupEventListeners, wireSponsorButtons, wireLanguageSwitcher, loadAllGuides, initializeGuidePagination, displayGuides } from './events/event-handlers.mjs';
import './emergency-buttons.mjs';
import './auth-flow.mjs';
import { renderGuideCards, updateGuideCounters } from './ui/guide-renderer.mjs';
import { defaultGuideData } from './data/default-guides.mjs';
import AppState from './state/app-state.mjs';
import { setupLocationNames } from './locations/location-setup.mjs';
import { log, isIframe, shouldSuppressLogs } from './utils/logger.mjs';
import { APP_CONFIG } from '../../env/app-config.mjs';

// Early detection for Replit preview iframe to suppress footer emergency logs
const isReplitIframe = isIframe && !APP_CONFIG.ALLOW_IFRAME_LOG;

// Suppress footer emergency scripts in iframe context
if (isReplitIframe) {
    // Block any footer emergency script execution
    window.FOOTER_EMERGENCY_DISABLED = true;
    log.debug('🔇 Iframe context detected - footer emergency scripts disabled');
}

/** Main application initialization function - TDZ safe with AppState */
function appInit() {
    log.ok('🌴 TomoTrip Application Starting...');
    
    // Keep the existing counter text since we already set it in HTML
    const guideCounter = document.getElementById('guideCounter');
    const totalGuideCounter = document.getElementById('totalGuideCounter');
    // Don't change the text if it's already set to the final state
    if (guideCounter && guideCounter.textContent.includes('読み込み中')) {
        guideCounter.textContent = '初期化中...';
    }
    if (totalGuideCounter && totalGuideCounter.textContent.includes('読み込み中')) {
        totalGuideCounter.textContent = '合計: 初期化中...';
    }
    
    // 1) Force use default guide data for consistency across all environments
    // This eliminates localStorage differences between editor and separate tabs
    const guides = defaultGuideData;
    
    // Clear any localStorage differences that might affect guide count
    localStorage.removeItem('registeredGuides');
    localStorage.removeItem('guideFilters');
    
    console.log('🎯 Environment Data Sync:', {
        guides: guides.length,
        source: 'defaultGuideData (forced)',
        localStorage_cleared: true
    });

    // 2) Initialize centralized state BEFORE any function calls - prevents TDZ
    // Force clear localStorage/sessionStorage environment differences
    if (window.location.search.includes('clear-cache')) {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🧹 Storage cleared due to clear-cache parameter');
    }
    
    // CRITICAL FIX: Assign defaultGuides to window for guide details modal
    window.defaultGuides = guides;
    
    AppState.guides = guides;
    AppState.pageSize = 12; // Fixed pageSize for all environments
    AppState.currentPage = 1;
    AppState.filters = {}; // Reset filters to default
    const state = AppState;

    // 3) Setup location names in AppState
    setupLocationNames(state);

    // 4) Pass state to functions and display guides immediately
    loadAllGuides(state.guides);
    initializeGuidePagination(state);
    setupEventListeners(state);
    
    // Render initial guide cards and display guides
    try {
        renderGuideCards(guides);
        displayGuides(1, state);
        
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

// Call initialization when module loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appInit);
} else {
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