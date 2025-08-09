// TomoTrip Application Initialization - CSP Compliant
// Consolidated from inline scripts in index.html

import { setupEventListeners } from './events/event-handlers.js';
import { defaultGuideData } from './data/default-guides.js';

/** Main application initialization function */
function appInit() {
    console.log('🌴 TomoTrip Application Starting...');
    setupEventListeners();
    initializeGuidePagination();
    console.log('✅ Application initialized successfully');
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

// Default guide data imported from centralized module

// Global guide data
let globalCurrentPage = 1;
let globalGuidesPerPage = 12;
let globalAllGuides = [];

// Make defaultGuideData available globally from import
window.defaultGuideData = defaultGuideData;

// Load all guides and populate display with robust fallback
function loadAllGuides() {
    const registeredGuides = JSON.parse(localStorage.getItem('registeredGuides') || '[]');
    
    // Ensure guides with robust fallback system
    const ensureGuides = (guides) => {
        if (Array.isArray(guides) && guides.length > 0) return guides;
        
        // Emergency placeholder data to prevent UI breakage
        return [{
            id: 'placeholder-1',
            name: '準備中のガイド',
            location: 'tokyo',
            languages: ['ja'],
            price: 8000,
            rating: 4.5,
            image: 'attached_assets/image_1754399234136.png',
            specialties: ['preparation'],
            isPlaceholder: true
        }];
    };
    
    // Combine default data with registered guides
    const allGuides = [...defaultGuideData, ...registeredGuides];
    const safeGuides = ensureGuides(allGuides);
    
    console.log('Total guides loaded:', safeGuides.length, '| Placeholders:', safeGuides.filter(g => g.isPlaceholder).length);
    
    return safeGuides;
}

// Initialize pagination and guide display with comprehensive fallback
function initializeGuidePagination() {
    globalAllGuides = loadAllGuides();
    
    // Final safety check - should not be needed due to loadAllGuides() fallback
    if (!globalAllGuides || globalAllGuides.length === 0) {
        console.warn('Emergency: Using hard-coded fallback data');
        globalAllGuides = defaultGuideData;
    }
    displayGuides(globalCurrentPage);
}

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
                    <button class="btn btn-outline-primary btn-sm w-100" onclick="viewGuideDetails(${guide.id})">詳細を見る</button>
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

// View guide details function
function viewGuideDetails(guideId) {
    alert(`ガイド詳細表示機能は開発中です。ガイドID: ${guideId}`);
}