// Simple debug script to test guide rendering
console.log('🔍 DEBUG: Starting guide rendering test');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DEBUG: DOM Content Loaded');
    
    const container = document.getElementById('guideCardsContainer');
    console.log('🔍 DEBUG: Container found:', !!container);
    
    if (container) {
        console.log('🔍 DEBUG: Container innerHTML before:', container.innerHTML);
        
        // Simple test render
        container.innerHTML = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">テストガイド</h5>
                        <p class="card-text">これはテスト用のガイドカードです</p>
                        <button class="btn btn-primary">詳細を見る</button>
                    </div>
                </div>
            </div>
        `;
        
        console.log('🔍 DEBUG: Test card added to container');
    }
});

// Test module loading
setTimeout(() => {
    console.log('🔍 DEBUG: Window object check:', {
        AppState: typeof window.AppState,
        defaultGuides: typeof window.defaultGuides,
        renderGuideCards: typeof window.renderGuideCards
    });
}, 1000);