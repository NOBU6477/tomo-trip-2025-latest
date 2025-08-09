// TomoTrip Application Initialization - CSP Compliant
// Consolidated from inline scripts in index.html

import { setupEventListeners, wireSponsorButtons, wireLanguageSwitcher, loadAllGuides, initializeGuidePagination } from './events/event-handlers.mjs';
import { defaultGuideData } from './data/default-guides.mjs';
import { initAppState } from './state/app-state.mjs';
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
    
    // 1) First determine final guide data (localStorage priority, then default)
    const storedGuides = JSON.parse(localStorage.getItem('registeredGuides') || '[]');
    const guides = (Array.isArray(storedGuides) && storedGuides.length) ? storedGuides : defaultGuideData;

    // 2) Initialize centralized state BEFORE any function calls - prevents TDZ
    const state = initAppState({ guides, pageSize: 12, currentPage: 1 });

    // 3) Setup location names in AppState
    setupLocationNames(state);

    // 4) Pass state to functions to prevent global variable TDZ issues
    loadAllGuides(state.guides);
    initializeGuidePagination(state);
    setupEventListeners(state);
    wireSponsorButtons();
    wireLanguageSwitcher();
    
    log.ok('✅ Application initialized successfully with AppState');
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

// Remove all top-level initialization - move to function

// Functions moved to event-handlers.mjs - no global state here

// Display guides for current page
function displayGuides(page) {
    const container = document.getElementById('guideCardsContainer');
    if (!container) return;
    
    const startIndex = (page - 1) * globalGuidesPerPage;
    const endIndex = startIndex + globalGuidesPerPage;
    const guidesForPage = globalAllGuides.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    
    guidesForPage.forEach(guide => {
        const guideCard = createGuideCard(guide);
        container.appendChild(guideCard);
    });
    
    updatePaginationInfo(page);
}

// Create guide card element
function createGuideCard(guide) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    col.innerHTML = `
        <div class="card guide-card h-100 shadow-sm">
            <img src="${guide.image || 'assets/images/default-guide.jpg'}" class="card-img-top" alt="${guide.name}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${guide.name}</h5>
                <p class="card-text text-muted small">${window.locationNames[guide.location] || guide.location}</p>
                <div class="mb-2">
                    <span class="badge bg-primary me-1">⭐ ${guide.rating}</span>
                    <span class="text-success fw-bold">¥${guide.price?.toLocaleString() || 'N/A'}/時間</span>
                </div>
                <div class="mb-2">
                    ${(guide.languages || []).map(lang => `<span class="badge bg-secondary me-1">${lang === 'ja' ? '日本語' : lang === 'en' ? 'English' : lang}</span>`).join('')}
                </div>
                <div class="mt-auto">
                    <button class="btn btn-outline-primary btn-sm w-100" data-guide-id="${guide.id}" class="view-guide-details">詳細を見る</button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Update pagination controls
function updatePaginationInfo(page) {
    const totalPages = Math.ceil(globalAllGuides.length / globalGuidesPerPage);
    const startIndex = (page - 1) * globalGuidesPerPage + 1;
    const endIndex = Math.min(page * globalGuidesPerPage, globalAllGuides.length);
    
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
                globalCurrentPage = page - 1;
                displayGuides(globalCurrentPage);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = page === totalPages;
        nextBtn.onclick = () => {
            if (page < totalPages) {
                globalCurrentPage = page + 1;
                displayGuides(globalCurrentPage);
            }
        };
    }
}

// View guide details function - moved to global scope for onclick compatibility
window.viewGuideDetails = function(guideId) {
    alert(`ガイド詳細表示機能は開発中です。ガイドID: ${guideId}`);
};

// Safe initialization - no early calls to prevent TDZ
function startApp() {
    appInit();
}

// Boot guard to prevent double initialization
if (!window.__APP_BOOTED__) {
    window.__APP_BOOTED__ = true;
    
    // Initialize after DOM load - with environment safety
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp, { once: true });
    } else {
        startApp();
    }
}