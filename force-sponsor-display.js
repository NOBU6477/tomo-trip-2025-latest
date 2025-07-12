/**
 * スポンサーバナー強制表示スクリプト
 * CSSの競合を完全に回避してスポンサーバナーを確実に表示
 */
(function() {
    'use strict';
    
    console.log('🚀 スポンサーバナー強制表示開始');
    
    function forceDisplaySponsorBanner() {
        console.log('💪 スポンサーバナー強制表示実行中...');
        
        // 現在のスポンサーバナーを探す
        const existingBanner = document.querySelector('.sponsor-banner');
        
        if (existingBanner) {
            console.log('✅ 既存のスポンサーバナーを発見、強制表示適用');
            
            // インラインスタイルで強制表示
            existingBanner.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                padding: 15px 0 !important;
                overflow: hidden !important;
                position: relative !important;
                white-space: nowrap !important;
                border-bottom: 3px solid #4f46e5 !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                height: 60px !important;
                width: 100% !important;
                z-index: 1000 !important;
                margin: 0 !important;
            `;
            
            // スクロール要素も強制表示
            const scrollElement = existingBanner.querySelector('.sponsor-scroll');
            if (scrollElement) {
                scrollElement.style.cssText = `
                    display: inline-block !important;
                    animation: scrollRight 30s linear infinite !important;
                    white-space: nowrap !important;
                    height: 60px !important;
                    line-height: 60px !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
                
                // 各アイテムも強制表示
                const items = scrollElement.querySelectorAll('.sponsor-item');
                items.forEach(item => {
                    item.style.cssText = `
                        display: inline-block !important;
                        background: rgba(255, 255, 255, 0.95) !important;
                        margin: 0 20px !important;
                        padding: 8px 20px !important;
                        border-radius: 25px !important;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
                        vertical-align: middle !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    `;
                });
            }
            
            console.log('✅ スポンサーバナー強制表示完了');
        } else {
            console.log('❌ スポンサーバナーが見つかりません、新規作成');
            createNewSponsorBanner();
        }
    }
    
    function createNewSponsorBanner() {
        console.log('🆕 新規スポンサーバナー作成中...');
        
        // ヒーローセクションの後に挿入
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const sponsorBannerHTML = `
                <div class="sponsor-banner force-display-banner" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    padding: 15px 0 !important;
                    overflow: hidden !important;
                    position: relative !important;
                    white-space: nowrap !important;
                    border-bottom: 3px solid #4f46e5 !important;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    height: 60px !important;
                    width: 100% !important;
                    z-index: 1000 !important;
                    margin: 0 !important;
                ">
                    <div class="sponsor-scroll" style="
                        display: inline-block !important;
                        animation: scrollRight 30s linear infinite !important;
                        white-space: nowrap !important;
                        height: 60px !important;
                        line-height: 60px !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    ">
                        <div class="sponsor-item" style="
                            display: inline-block !important;
                            background: rgba(255, 255, 255, 0.95) !important;
                            margin: 0 20px !important;
                            padding: 8px 20px !important;
                            border-radius: 25px !important;
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
                            vertical-align: middle !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        ">
                            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=60&fit=crop" alt="海の家レストラン" style="height: 30px; width: auto; margin-right: 10px; vertical-align: middle;" onerror="this.style.display='none'">
                            <span style="color: #333; font-weight: 600; font-size: 14px; vertical-align: middle;">海の家レストラン</span>
                            <span style="background: #ff6b6b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px; font-weight: bold;">20%OFF</span>
                        </div>
                        <div class="sponsor-item" style="
                            display: inline-block !important;
                            background: rgba(255, 255, 255, 0.95) !important;
                            margin: 0 20px !important;
                            padding: 8px 20px !important;
                            border-radius: 25px !important;
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
                            vertical-align: middle !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        ">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=60&fit=crop" alt="山田温泉ホテル" style="height: 30px; width: auto; margin-right: 10px; vertical-align: middle;" onerror="this.style.display='none'">
                            <span style="color: #333; font-weight: 600; font-size: 14px; vertical-align: middle;">山田温泉ホテル</span>
                            <span style="background: #4ecdc4; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px; font-weight: bold;">特別価格</span>
                        </div>
                        <div class="sponsor-item" style="
                            display: inline-block !important;
                            background: rgba(255, 255, 255, 0.95) !important;
                            margin: 0 20px !important;
                            padding: 8px 20px !important;
                            border-radius: 25px !important;
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
                            vertical-align: middle !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        ">
                            <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=60&fit=crop" alt="サクラ観光バス" style="height: 30px; width: auto; margin-right: 10px; vertical-align: middle;" onerror="this.style.display='none'">
                            <span style="color: #333; font-weight: 600; font-size: 14px; vertical-align: middle;">サクラ観光バス</span>
                            <span style="background: #ffa726; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px; font-weight: bold;">送迎無料</span>
                        </div>
                    </div>
                </div>
            `;
            
            heroSection.insertAdjacentHTML('afterend', sponsorBannerHTML);
            console.log('✅ 新規スポンサーバナー作成完了');
        }
    }
    
    function addKeyframeAnimation() {
        console.log('🎬 キーフレームアニメーション追加中...');
        
        if (!document.getElementById('force-sponsor-keyframes')) {
            const style = document.createElement('style');
            style.id = 'force-sponsor-keyframes';
            style.textContent = `
                @keyframes scrollRight {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `;
            document.head.appendChild(style);
            console.log('✅ キーフレームアニメーション追加完了');
        }
    }
    
    function init() {
        console.log('🎯 スポンサーバナー強制表示初期化');
        
        // キーフレームアニメーションを追加
        addKeyframeAnimation();
        
        // スポンサーバナーを強制表示
        forceDisplaySponsorBanner();
        
        // 定期的に再実行（保険）
        setInterval(forceDisplaySponsorBanner, 5000);
        
        console.log('✅ スポンサーバナー強制表示初期化完了');
    }
    
    // 実行タイミング
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 即座にも実行
    setTimeout(init, 100);
    setTimeout(init, 500);
    setTimeout(init, 1000);
    
    console.log('🚀 スポンサーバナー強制表示スクリプト設定完了');
})();