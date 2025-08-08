// TomoTrip Application Initialization - CSP Compliant
// Consolidated from inline scripts in index.html

/** Main application initialization function */
function appInit() {
    console.log('🌴 TomoTrip Application Starting...');
    setupEventListeners();
    initializeGuidePagination();
    console.log('✅ Application initialized successfully');
}

// Location mapping for display (prevent duplicate declaration)
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
}
const locationNames = window.locationNames;

// Global guide data
let globalCurrentPage = 1;
let globalGuidesPerPage = 12;
let globalAllGuides = [];

// Initialize default guide data
function loadDefaultGuides() {
    console.log('🔧 Loading default guide dataset...');
    const existingGuides = JSON.parse(localStorage.getItem('registeredGuides')) || [];
    if (existingGuides.length === 0) {
        localStorage.setItem('registeredGuides', JSON.stringify([]));
        console.log('✅ Default guides storage initialized');
    }
}

// Load all guides and populate display
function loadAllGuides() {
    const registeredGuides = JSON.parse(localStorage.getItem('registeredGuides')) || [];
    console.log('Loading registered guides:', registeredGuides.length);
    if (registeredGuides.length === 0) {
        console.log('⚠️ No registered guides found - initializing default dataset');
        loadDefaultGuides();
    }
    
    // Merge registered guides with default guides (from main.js)
    return [...window.defaultGuideData || [], ...registeredGuides];
}

// Initialize pagination and guide display
function initializeGuidePagination() {
    globalAllGuides = loadAllGuides();
    if (globalAllGuides.length === 0) {
        console.warn('No guides available for display');
        return;
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
                <p class="card-text text-muted small">${locationNames[guide.location] || guide.location}</p>
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