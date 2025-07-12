/**
 * スポンサーバナーアニメーション強制修正
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('スポンサーアニメーション修正開始');
    
    function forceAnimationStart() {
        const sponsorBanner = document.querySelector('.sponsor-banner');
        const sponsorScroll = document.querySelector('.sponsor-scroll');
        
        if (sponsorBanner && sponsorScroll) {
            console.log('スポンサーバナー要素を発見');
            
            // 強制的にCSSを適用
            sponsorBanner.style.overflow = 'hidden';
            sponsorBanner.style.whiteSpace = 'nowrap';
            
            sponsorScroll.style.display = 'inline-block';
            sponsorScroll.style.animation = 'scrollRight 30s linear infinite';
            sponsorScroll.style.whiteSpace = 'nowrap';
            
            console.log('アニメーション強制適用完了');
        } else {
            console.log('スポンサーバナー要素が見つかりません');
        }
    }
    
    // 即座に実行
    forceAnimationStart();
    
    // 1秒後にも実行（保険）
    setTimeout(forceAnimationStart, 1000);
    
    // 3秒後にも実行（さらなる保険）
    setTimeout(forceAnimationStart, 3000);
    
    console.log('スポンサーアニメーション修正完了');
});