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
                            <small class="fw-semibold">${Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages}</small>
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