// Guide rendering module - CSP compliant
import { defaultGuideData } from '../data/default-guides.mjs';

// Global guide rendering function with performance optimization
export function renderGuideCards(guidesToRender = null) {
    const guides = guidesToRender || (window.AppState?.guides || defaultGuideData);
    const container = document.getElementById('guidesContainer');
    
    if (!container) {
        console.error('Guide cards container not found');
        return;
    }
    
    console.log(`🎨 Rendering ${guides.length} guide cards`);
    
    // Performance optimization for large guide lists
    if (guides.length > 50) {
        console.log('📊 Large guide list detected, using optimized rendering');
        renderGuideCardsOptimized(guides, container);
    } else {
        // Standard rendering for smaller lists
        const cardsHTML = guides.map(guide => createGuideCardHTML(guide)).join('');
        container.innerHTML = cardsHTML;
    }
    
    // Update counters
    updateGuideCounters(guides.length, window.AppState?.guides?.length || defaultGuideData.length);
    
    // Setup view details event listeners
    setupViewDetailsEventListeners();
    
    console.log(`✅ Rendered ${guides.length} guide cards successfully`);
}

// Optimized rendering for large guide lists (50+ guides)
function renderGuideCardsOptimized(guides, container) {
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Batch process in chunks to avoid blocking UI
    const CHUNK_SIZE = 10;
    let index = 0;
    
    function renderChunk() {
        const endIndex = Math.min(index + CHUNK_SIZE, guides.length);
        
        for (let i = index; i < endIndex; i++) {
            const cardHTML = createGuideCardHTML(guides[i]);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHTML;
            fragment.appendChild(tempDiv.firstElementChild);
        }
        
        index = endIndex;
        
        if (index < guides.length) {
            // Schedule next chunk
            requestAnimationFrame(renderChunk);
        } else {
            // All chunks processed, update container
            container.innerHTML = '';
            container.appendChild(fragment);
            
            // Setup event listeners after all cards are rendered
            setupViewDetailsEventListeners();
        }
    }
    
    renderChunk();
}

// Create HTML for individual guide card  
function createGuideCardHTML(guide) {
    const price = Number(guide.price);
    const formattedPrice = isNaN(price) || price === 0 ? '料金応相談' : `¥${price.toLocaleString()}/時間`;
    const languages = Array.isArray(guide.languages) ? guide.languages.join(', ') : (guide.languages || '日本語');
    const tags = Array.isArray(guide.tags) ? guide.tags.slice(0, 3).join(', ') : (guide.specialties || '');
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="guide-card h-100" style="border: none; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease; background: white;">
                <div class="position-relative">
                    <img src="${guide.photo || '/assets/img/guides/default-1.svg'}" 
                         class="card-img-top" 
                         alt="${guide.name}" 
                         style="height: 250px; object-fit: cover;">
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 12px; padding: 5px 10px; border-radius: 15px;">
                            評価 ${guide.rating || '4.8'} ⭐
                        </span>
                    </div>
                </div>
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-2" style="color: #2c3e50;">${guide.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt"></i> ${guide.city || guide.location}
                    </p>
                    <p class="card-text text-muted mb-3" style="font-size: 14px; line-height: 1.4;">
                        ${guide.description || '地域の魅力をご案内します'}
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

// Update guide counters - SINGLE DEFINITION
export function updateGuideCounters(filtered, total) {
    const guideCounter = document.getElementById('guideCounter');
    const totalGuideCounter = document.getElementById('totalGuideCounter');
    
    if (guideCounter) {
        guideCounter.textContent = `${filtered}人のガイドが見つかりました（全${total}人中）`;
    }
    
    if (totalGuideCounter) {
        totalGuideCounter.textContent = `総数: ${total}人`;
    }
}

// Setup event listeners for view details buttons
function setupViewDetailsEventListeners() {
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    
    viewDetailsButtons.forEach(button => {
        // Remove any existing listeners
        button.removeEventListener('click', handleViewDetailsClick);
        
        // Add click listener
        button.addEventListener('click', handleViewDetailsClick);
    });
    
    console.log(`🔗 Setup ${viewDetailsButtons.length} view details event listeners`);
}

// Handle view details button click
function handleViewDetailsClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const guideId = event.currentTarget.getAttribute('data-guide-id');
    
    if (!guideId) {
        console.error('❌ No guide ID found on clicked button');
        return;
    }
    
    console.log('🔍 View details clicked for guide:', guideId);
    
    // Call the authentication flow from window scope
    if (window.viewGuideDetail) {
        window.viewGuideDetail(guideId);
    } else if (window.handleGuideDetailAccess) {
        window.handleGuideDetailAccess(guideId);
    } else {
        console.error('❌ No guide detail handler found');
        // Fallback - direct redirect without auth check
        window.location.href = `/guide-detail.html?id=${guideId}`;
    }
}

// Make functions globally available for filter system
if (typeof window !== 'undefined') {
    window.renderGuideCards = renderGuideCards;
    window.updateGuideCounters = updateGuideCounters;
    window.setupViewDetailsEventListeners = setupViewDetailsEventListeners;
}