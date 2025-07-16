/**
 * 英語サイト専用カウンター修正スクリプト
 * Found 70 guides → Found 6 guides に修正
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 英語カウンター修正開始');
  
  // 英語サイトかどうかの判定
  const isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en';
  
  if (!isEnglishSite) {
    console.log('日本語サイトなので英語カウンター修正をスキップ');
    return;
  }
  
  // 即座に修正を実行
  setTimeout(() => {
    fixEnglishCounters();
    
    // 定期的な監視と修正（3秒間隔）
    setInterval(fixEnglishCounters, 3000);
  }, 500);
});

function fixEnglishCounters() {
  console.log('📊 英語カウンター修正実行');
  
  // 実際のガイドカード数を取得
  const guideContainer = document.getElementById('guide-cards-container');
  const actualCards = guideContainer ? guideContainer.querySelectorAll('.guide-card, .card').length : 6;
  
  console.log(`🎯 実際のガイドカード数: ${actualCards}`);
  
  // すべての「70」を実際の数に置換
  const elementsToFix = [
    // Found 70 guides
    ...document.querySelectorAll('*'),
  ];
  
  elementsToFix.forEach(element => {
    if (element.textContent && element.textContent.includes('Found 70 guides')) {
      element.textContent = element.textContent.replace(/Found 70 guides/g, `Found ${actualCards} guides`);
      console.log(`✅ 修正: Found 70 guides → Found ${actualCards} guides`);
    }
    
    if (element.textContent && element.textContent.includes('Showing 70 guides')) {
      element.textContent = element.textContent.replace(/Showing 70 guides/g, `Showing ${actualCards} guides`);
      console.log(`✅ 修正: Showing 70 guides → Showing ${actualCards} guides`);
    }
    
    if (element.textContent && element.textContent.includes('70 guides found')) {
      element.textContent = element.textContent.replace(/70 guides found/g, `${actualCards} guides found`);
      console.log(`✅ 修正: 70 guides found → ${actualCards} guides found`);
    }
  });
  
  // 特定のID要素のカウンター修正
  const specificCounters = [
    '#guide-counter',
    '#guide-count-number-en',
    '#search-results-counter'
  ];
  
  specificCounters.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      if (element.id === 'guide-count-number-en') {
        element.textContent = actualCards;
      } else if (element.textContent.includes('70')) {
        element.textContent = element.textContent.replace(/70/g, actualCards);
      } else if (!element.textContent.includes(actualCards.toString())) {
        element.textContent = `Found ${actualCards} guides`;
      }
    }
  });
  
  // HTMLの直接置換（最終手段）
  if (document.body.innerHTML.includes('Found 70 guides') || 
      document.body.innerHTML.includes('Showing 70 guides')) {
    
    let bodyHTML = document.body.innerHTML;
    bodyHTML = bodyHTML.replace(/Found 70 guides/g, `Found ${actualCards} guides`);
    bodyHTML = bodyHTML.replace(/Showing 70 guides/g, `Showing ${actualCards} guides`);
    bodyHTML = bodyHTML.replace(/70 guides found/g, `${actualCards} guides found`);
    
    // 安全性のため、変更があった場合のみ適用
    if (bodyHTML !== document.body.innerHTML) {
      document.body.innerHTML = bodyHTML;
      console.log('🔄 HTML直接修正を実行しました');
    }
  }
  
  console.log(`✅ 英語カウンター修正完了: ${actualCards} guides`);
}

// 他のスクリプトとの競合を避けるための緊急修正
window.addEventListener('load', function() {
  setTimeout(fixEnglishCounters, 1000);
});

// グローバル関数として公開
window.fixEnglishCounters = fixEnglishCounters;