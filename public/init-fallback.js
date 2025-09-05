// TomoTrip Fallback Initialization - Non-module version
// This runs if ES modules fail to load

console.log('🔧 Fallback initialization starting...');

// Immediate DOM content population
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM ready - applying fallback initialization');
    
    // Update counters immediately
    const guideCounter = document.getElementById('guideCounter');
    const totalGuideCounter = document.getElementById('totalGuideCounter');
    
    if (guideCounter) {
        guideCounter.textContent = '24人のガイドが見つかりました';
    }
    if (totalGuideCounter) {
        totalGuideCounter.textContent = '総数: 24人';
    }
    
    // Add basic guide cards
    const container = document.getElementById('guideCardsContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card guide-card h-100">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face" 
                         class="card-img-top" alt="田中健太" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">田中健太</h5>
                        <p class="card-text"><small class="text-muted">東京 • 英語, 中国語</small></p>
                        <p class="card-text">東京の隠れた名所をご案内します。</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-success fw-bold">¥5,000/日</span>
                            <small class="text-warning">★ 4.8</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card guide-card h-100">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop&crop=face" 
                         class="card-img-top" alt="佐藤美香" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">佐藤美香</h5>
                        <p class="card-text"><small class="text-muted">京都 • 英語, フランス語</small></p>
                        <p class="card-text">伝統的な京都文化をお伝えします。</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-success fw-bold">¥4,500/日</span>
                            <small class="text-warning">★ 4.9</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card guide-card h-100">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop&crop=face" 
                         class="card-img-top" alt="山田太郎" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">山田太郎</h5>
                        <p class="card-text"><small class="text-muted">大阪 • 英語, 韓国語</small></p>
                        <p class="card-text">大阪の食文化をご紹介します。</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-success fw-bold">¥4,000/日</span>
                            <small class="text-warning">★ 4.7</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Force hide any loading spinners and show content
    document.body.style.opacity = '1';
    document.body.classList.add('fallback-ready');
    
    // Signal complete readiness
    setTimeout(function() {
        document.body.setAttribute('data-fallback-ready', 'true');
        console.log('✅ Fallback initialization complete');
    }, 100);
});