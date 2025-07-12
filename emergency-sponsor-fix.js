/**
 * 緊急スポンサーバナー修正スクリプト
 * スポンサーバナーが表示されない問題を根本解決
 */
(function() {
    'use strict';
    
    console.log('🚨 緊急スポンサーバナー修正開始');
    
    function emergencySponsorFix() {
        console.log('🔧 スポンサーバナー緊急修正実行中...');
        
        // 1. スポンサーバナーの強制表示
        forceShowSponsorBanner();
        
        // 2. アニメーション強制実行
        forceAnimation();
        
        // 3. CSS強制注入
        injectForcedCSS();
    }
    
    function forceShowSponsorBanner() {
        console.log('📢 スポンサーバナー強制表示中...');
        
        const sponsorBanner = document.getElementById('main-sponsor-banner');
        const sponsorScroll = document.getElementById('main-sponsor-scroll');
        
        if (sponsorBanner && sponsorScroll) {
            console.log('✅ スポンサー要素発見');
            
            // 強制表示スタイル
            sponsorBanner.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                padding: 15px 0 !important;
                overflow: hidden !important;
                position: relative !important;
                white-space: nowrap !important;
                border-bottom: 3px solid #4f46e5 !important;
                display: block !important;
                width: 100% !important;
                height: 60px !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 10 !important;
            `;
            
            sponsorScroll.style.cssText = `
                display: inline-block !important;
                animation: scrollRight 30s linear infinite !important;
                white-space: nowrap !important;
                width: auto !important;
                height: 60px !important;
                line-height: 60px !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            
            console.log('✅ スポンサーバナー強制表示完了');
        } else {
            console.log('❌ スポンサー要素が見つかりません');
            createEmergencySponsorBanner();
        }
    }
    
    function createEmergencySponsorBanner() {
        console.log('🆘 緊急スポンサーバナー作成中...');
        
        // 既存のバナーを削除
        const existingBanner = document.querySelector('.sponsor-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        // 新しいバナーを作成
        const bannerHTML = `
            <div class="sponsor-banner emergency-sponsor-banner" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                padding: 15px 0 !important;
                overflow: hidden !important;
                position: relative !important;
                white-space: nowrap !important;
                border-bottom: 3px solid #4f46e5 !important;
                display: block !important;
                width: 100% !important;
                height: 60px !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 10 !important;
            ">
                <div class="sponsor-scroll" style="
                    display: inline-block !important;
                    animation: scrollRight 30s linear infinite !important;
                    white-space: nowrap !important;
                    width: auto !important;
                    height: 60px !important;
                    line-height: 60px !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                ">
                    <div class="sponsor-item" style="display: inline-block; margin: 0 30px; color: white; font-weight: bold;">
                        <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=60&fit=crop" alt="海の家レストラン" style="height: 30px; width: 50px; border-radius: 5px; margin-right: 10px;" onerror="this.style.display='none'">
                        <span style="font-size: 14px; margin-right: 15px;">海の家レストラン</span>
                        <span style="background: #ff6b6b; padding: 2px 8px; border-radius: 10px; font-size: 12px;">20%OFF</span>
                    </div>
                    <div class="sponsor-item" style="display: inline-block; margin: 0 30px; color: white; font-weight: bold;">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=60&fit=crop" alt="山田温泉ホテル" style="height: 30px; width: 50px; border-radius: 5px; margin-right: 10px;" onerror="this.style.display='none'">
                        <span style="font-size: 14px; margin-right: 15px;">山田温泉ホテル</span>
                        <span style="background: #4ecdc4; padding: 2px 8px; border-radius: 10px; font-size: 12px;">特別価格</span>
                    </div>
                    <div class="sponsor-item" style="display: inline-block; margin: 0 30px; color: white; font-weight: bold;">
                        <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=60&fit=crop" alt="サクラ観光バス" style="height: 30px; width: 50px; border-radius: 5px; margin-right: 10px;" onerror="this.style.display='none'">
                        <span style="font-size: 14px; margin-right: 15px;">サクラ観光バス</span>
                        <span style="background: #ffa726; padding: 2px 8px; border-radius: 10px; font-size: 12px;">送迎無料</span>
                    </div>
                    <div class="sponsor-item" style="display: inline-block; margin: 0 30px; color: white; font-weight: bold;">
                        <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=60&fit=crop" alt="伝統工芸体験館" style="height: 30px; width: 50px; border-radius: 5px; margin-right: 10px;" onerror="this.style.display='none'">
                        <span style="font-size: 14px; margin-right: 15px;">伝統工芸体験館</span>
                        <span style="background: #9c27b0; padding: 2px 8px; border-radius: 10px; font-size: 12px;">体験割引</span>
                    </div>
                    <div class="sponsor-item" style="display: inline-block; margin: 0 30px; color: white; font-weight: bold;">
                        <img src="https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=100&h=60&fit=crop" alt="地元特産品店" style="height: 30px; width: 50px; border-radius: 5px; margin-right: 10px;" onerror="this.style.display='none'">
                        <span style="font-size: 14px; margin-right: 15px;">地元特産品店</span>
                        <span style="background: #ff5722; padding: 2px 8px; border-radius: 10px; font-size: 12px;">お土産10%OFF</span>
                    </div>
                    <div class="sponsor-item" style="display: inline-block; margin: 0 30px; color: white; font-weight: bold;">
                        <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=60&fit=crop" alt="カフェ桜" style="height: 30px; width: 50px; border-radius: 5px; margin-right: 10px;" onerror="this.style.display='none'">
                        <span style="font-size: 14px; margin-right: 15px;">カフェ桜</span>
                        <span style="background: #e91e63; padding: 2px 8px; border-radius: 10px; font-size: 12px;">ドリンク1杯無料</span>
                    </div>
                </div>
            </div>
        `;
        
        // ヒーローセクションの後に挿入
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.insertAdjacentHTML('afterend', bannerHTML);
            console.log('✅ 緊急スポンサーバナー作成完了');
        }
    }
    
    function forceAnimation() {
        console.log('🎬 アニメーション強制実行中...');
        
        // キーフレームアニメーションを強制追加
        if (!document.getElementById('emergency-sponsor-animation')) {
            const style = document.createElement('style');
            style.id = 'emergency-sponsor-animation';
            style.textContent = `
                @keyframes scrollRight {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                .emergency-sponsor-banner .sponsor-scroll {
                    animation: scrollRight 30s linear infinite !important;
                }
            `;
            document.head.appendChild(style);
            console.log('✅ アニメーション強制追加完了');
        }
    }
    
    function injectForcedCSS() {
        console.log('💉 CSS強制注入中...');
        
        if (!document.getElementById('emergency-sponsor-css')) {
            const style = document.createElement('style');
            style.id = 'emergency-sponsor-css';
            style.textContent = `
                .sponsor-banner, .emergency-sponsor-banner {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    padding: 15px 0 !important;
                    overflow: hidden !important;
                    position: relative !important;
                    white-space: nowrap !important;
                    border-bottom: 3px solid #4f46e5 !important;
                    display: block !important;
                    width: 100% !important;
                    height: 60px !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    z-index: 10 !important;
                }
                
                .sponsor-scroll {
                    display: inline-block !important;
                    animation: scrollRight 30s linear infinite !important;
                    white-space: nowrap !important;
                    width: auto !important;
                    height: 60px !important;
                    line-height: 60px !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }
                
                .sponsor-item {
                    display: inline-block !important;
                    margin: 0 30px !important;
                    color: white !important;
                    font-weight: bold !important;
                    vertical-align: middle !important;
                }
            `;
            document.head.appendChild(style);
            console.log('✅ CSS強制注入完了');
        }
    }
    
    // 実行タイミング
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', emergencySponsorFix);
    } else {
        emergencySponsorFix();
    }
    
    // 追加の保険実行
    setTimeout(emergencySponsorFix, 1000);
    setTimeout(emergencySponsorFix, 3000);
    
    console.log('🚨 緊急スポンサーバナー修正設定完了');
})();