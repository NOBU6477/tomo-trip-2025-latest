/**
 * 即座実行修正スクリプト - スポンサーバナー完全除去
 */

(function() {
  'use strict';
  
  console.log('=== 即座修正システム開始 ===');
  
  function immediateFix() {
    // 1. スポンサーバナーを完全に除去
    const sponsorBanners = document.querySelectorAll('.sponsor-banner');
    sponsorBanners.forEach(banner => {
      banner.style.display = 'none';
      banner.style.visibility = 'hidden';
      banner.style.height = '0px';
      banner.style.maxHeight = '0px';
      banner.style.overflow = 'hidden';
      banner.style.position = 'absolute';
      banner.style.top = '-9999px';
      console.log('スポンサーバナー完全除去');
    });
    
    // 2. ガイドカウンターを70人に強制設定
    const counter = document.getElementById('search-results-counter');
    if (counter) {
      counter.textContent = '70人のガイドが見つかりました';
      counter.style.display = 'block';
      counter.style.visibility = 'visible';
      counter.style.color = '#28a745';
      counter.style.fontWeight = 'bold';
      counter.style.fontSize = '1.1rem';
      counter.style.padding = '10px 0';
      console.log('ガイドカウンター70人に設定');
    }
    
    // 3. メインコンテンツエリアの強制表示
    const container = document.querySelector('.container.py-5');
    if (container) {
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
      container.style.zIndex = '9999';
      container.style.position = 'relative';
      container.style.backgroundColor = 'white';
      container.style.minHeight = '800px';
      console.log('メインコンテンツ強制表示');
    }
    
    // 4. ガイドカードコンテナの強制表示
    const cardContainer = document.getElementById('guide-cards-container');
    if (cardContainer) {
      cardContainer.style.display = 'flex';
      cardContainer.style.flexWrap = 'wrap';
      cardContainer.style.visibility = 'visible';
      cardContainer.style.opacity = '1';
      cardContainer.style.zIndex = '10000';
      cardContainer.style.position = 'relative';
      cardContainer.style.backgroundColor = 'white';
      cardContainer.style.minHeight = '600px';
      console.log('ガイドカードコンテナ強制表示');
    }
    
    // 5. 全ガイドカードの強制表示
    const guideCards = document.querySelectorAll('.guide-item, .guide-card');
    guideCards.forEach(card => {
      card.style.display = 'block';
      card.style.visibility = 'visible';
      card.style.opacity = '1';
    });
    
    console.log('即座修正完了');
  }
  
  // 即座に実行
  immediateFix();
  
  // DOM読み込み後にも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', immediateFix);
  }
  
  // 0.5秒後にも実行（安全のため）
  setTimeout(immediateFix, 500);
  
})();