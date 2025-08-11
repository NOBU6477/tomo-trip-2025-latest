// Guide rendering module - CSP compliant
import { defaultGuideData } from '../data/default-guides.mjs';

// Global guide rendering function
export function renderGuideCards(guidesToRender = null) {
    const guides = guidesToRender || (window.AppState?.guides || defaultGuideData);
    const container = document.getElementById('guideCardsContainer');
    
    if (!container) {
        console.error('Guide cards container not found');
        return;
    }
    
    console.log(`🎨 Rendering ${guides.length} guide cards`);
    
    // Generate HTML for all guide cards
    const cardsHTML = guides.map(guide => createGuideCardHTML(guide)).join('');
    
    // Update container with new cards
    container.innerHTML = cardsHTML;
    
    // Update counters
    updateGuideCounters(guides.length, window.AppState?.guides?.length || defaultGuideData.length);
    
    console.log(`✅ Rendered ${guides.length} guide cards successfully`);
}

// Create HTML for individual guide card
function createGuideCardHTML(guide) {
    const price = Number(guide.price);
    const formattedPrice = isNaN(price) ? '料金応相談' : `¥${price.toLocaleString()}`;
    const languages = guide.languages?.join(', ') || '日本語';
    const tags = guide.tags?.slice(0, 3).join(', ') || '';
    
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

// Make functions globally available for filter system
if (typeof window !== 'undefined') {
    window.renderGuideCards = renderGuideCards;
    window.updateGuideCounters = updateGuideCounters;
}