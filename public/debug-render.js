// Simple debug script to test guide rendering
console.log('🔍 DEBUG: Starting guide rendering test');

// Test guide data directly
const testGuides = [
    {
        id: 1,
        name: "田中健太",
        location: "tokyo", 
        rating: 4.8,
        price: 8000,
        photo: "/assets/img/guides/default-1.svg",
        languages: ["ja", "en"]
    },
    {
        id: 2,
        name: "佐藤美咲",
        location: "osaka",
        rating: 4.9, 
        price: 7500,
        photo: "/assets/img/guides/default-2.svg",
        languages: ["ja", "en", "zh"]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DEBUG: DOM Content Loaded');
    
    const container = document.getElementById('guideCardsContainer');
    console.log('🔍 DEBUG: Container found:', !!container);
    console.log('🔍 DEBUG: Container element:', container);
    
    if (container) {
        console.log('🔍 DEBUG: Container innerHTML before:', container.innerHTML.trim());
        
        // Direct rendering test with actual guide data
        const cardsHTML = testGuides.map(guide => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="guide-card h-100" style="border: none; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: all 0.3s ease; background: white;">
                    <div class="position-relative">
                        <img src="${guide.photo || '/assets/img/guides/default-1.svg'}" 
                             class="card-img-top" 
                             alt="${guide.name}" 
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
                            <i class="bi bi-geo-alt"></i> ${guide.location}
                        </p>
                        <p class="card-text text-muted mb-3" style="font-size: 14px; line-height: 1.4;">
                            地域の魅力をご案内します
                        </p>
                        
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-muted">対応言語</small>
                                <small class="fw-semibold">${guide.languages.join(', ')}</small>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-muted">料金</small>
                                <small class="fw-bold text-primary">¥${guide.price.toLocaleString()}</small>
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
        console.log('🔍 DEBUG: Guide cards rendered directly, HTML length:', cardsHTML.length);
        console.log('🔍 DEBUG: Container innerHTML after:', container.innerHTML.length);
        
        // Update counters
        const guideCounter = document.getElementById('guideCounter');
        const totalGuideCounter = document.getElementById('totalGuideCounter');
        if (guideCounter) {
            guideCounter.textContent = `${testGuides.length}人のガイドが見つかりました（全${testGuides.length}人中）`;
            console.log('🔍 DEBUG: Guide counter updated');
        }
        if (totalGuideCounter) {
            totalGuideCounter.textContent = `総数: ${testGuides.length}人`;
            console.log('🔍 DEBUG: Total guide counter updated');
        }
    }
});

// Test module loading after delay
setTimeout(() => {
    console.log('🔍 DEBUG: Window object check:', {
        AppState: typeof window.AppState,
        defaultGuides: typeof window.defaultGuides,
        renderGuideCards: typeof window.renderGuideCards,
        location: window.location.href
    });
}, 2000);