// TomoTrip Application Initialization - CSP Compliant
// Consolidated from inline scripts in index.html

import { setupEventListeners, wireSponsorButtons, wireLanguageSwitcher, loadAllGuides, initializeGuidePagination, displayGuides } from './events/event-handlers.mjs';
import './emergency-buttons.mjs';
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

// Dynamic guide data loading from API
async function loadGuidesFromAPI() {
    try {
        const response = await fetch('/api/guides');
        const result = await response.json();
        
        if (result.success && result.guides) {
            // Convert server format to frontend format
            const apiGuides = result.guides.map(guide => ({
                id: guide.id,
                name: guide.name || guide.guideName,
                location: guide.location || 'tokyo',
                rating: guide.averageRating ? parseFloat(guide.averageRating) : 4.5,
                price: guide.sessionRate || guide.guideSessionRate || 0,
                image: guide.profilePhoto || '/assets/img/guides/default-1.svg',
                languages: Array.isArray(guide.languages) ? guide.languages : (guide.guideLanguages || ['日本語']),
                specialties: guide.specialties ? guide.specialties.split(',').map(s => s.trim()) : (guide.guideSpecialties ? guide.guideSpecialties.split(',').map(s => s.trim()) : []),
                photo: guide.profilePhoto || '/assets/img/guides/default-1.svg',
                tags: guide.specialties ? guide.specialties.split(',').map(s => s.trim()) : [],
                availability: guide.availability || guide.guideAvailability || 'weekdays',
                experience: guide.experience || guide.guideExperience || 'intermediate',
                introduction: guide.introduction || guide.guideIntroduction || '',
                email: guide.email || guide.guideEmail,
                phone: guide.phoneNumber,
                status: guide.status || 'approved'
            }));
            
            console.log(`✅ Loaded ${apiGuides.length} guides from API`);
            return [...defaultGuideData, ...apiGuides.filter(guide => guide.status === 'approved')];
        }
        
        console.log('📋 Using default guide data - API returned no results');
        return defaultGuideData;
        
    } catch (error) {
        console.error('❌ Error loading guides from API:', error);
        console.log('📋 Falling back to default guide data');
        return defaultGuideData;
    }
}

/** Main application initialization function - TDZ safe with AppState */
async function appInit() {
    log.ok('🌴 TomoTrip Application Starting...');
    
    // 1) Load guides dynamically from API + default data
    const guides = await loadGuidesFromAPI();
    
    // Clear any localStorage differences that might affect guide count
    localStorage.removeItem('registeredGuides');
    localStorage.removeItem('guideFilters');
    
    console.log('🎯 Environment Data Sync:', {
        guides: guides.length,
        source: 'API + defaultGuideData (dynamic)',
        localStorage_cleared: true
    });

    // 2) Initialize centralized state BEFORE any function calls - prevents TDZ
    // Force clear localStorage/sessionStorage environment differences
    if (window.location.search.includes('clear-cache')) {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🧹 Storage cleared due to clear-cache parameter');
    }
    
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
    renderGuideCards(guides);
    displayGuides(1, state);
    
    // Setup button handlers
    wireSponsorButtons();
    wireLanguageSwitcher();
    
    // 5) Setup automatic refresh for new guides every 30 seconds
    setInterval(async () => {
        await refreshGuideData();
    }, 30000);
    
    log.ok('✅ Application initialized successfully with dynamic guide data');
}

// Refresh guide data and update display
async function refreshGuideData() {
    try {
        const newGuides = await loadGuidesFromAPI();
        const currentCount = AppState.guides.length;
        const newCount = newGuides.length;
        
        if (newCount !== currentCount) {
            console.log(`🔄 Guide data updated: ${currentCount} → ${newCount} guides`);
            AppState.guides = newGuides;
            renderGuideCards(newGuides);
            displayGuides(AppState.currentPage, AppState);
            
            // Show notification for new guides
            if (newCount > currentCount) {
                showNewGuideNotification(newCount - currentCount);
            }
        }
    } catch (error) {
        console.error('❌ Error refreshing guide data:', error);
    }
}

// Show notification for newly added guides
function showNewGuideNotification(count) {
    const notification = document.createElement('div');
    notification.className = 'toast-container position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header">
                <i class="bi bi-person-plus-fill text-success me-2"></i>
                <strong class="me-auto">TomoTrip</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${count}名の新しいガイドが追加されました！
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Make refresh function globally available for guide edit page
window.refreshGuideData = refreshGuideData;

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