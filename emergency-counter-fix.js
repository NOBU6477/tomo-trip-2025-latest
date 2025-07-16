/**
 * 緊急カウンター修正スクリプト
 * 英語サイトと日本語サイトの「70人」表示問題を完全解決
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚨 緊急カウンター修正開始');
  
  // 1秒後に実行（他のスクリプトロード後）
  setTimeout(() => {
    forceFixCounters();
    
    // 定期的な監視と修正
    setInterval(forceFixCounters, 3000);
  }, 1000);
});

function forceFixCounters() {
  const isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en' ||
                       document.title.includes('English');
  
  if (!window.unifiedGuideSystem) {
    console.warn('⚠️ 統一ガイドシステムがまだロードされていません');
    return;
  }
  
  const actualCount = window.unifiedGuideSystem.guides.length;
  console.log(`📊 実際のガイド数: ${actualCount}`);
  
  if (isEnglishSite) {
    // 英語サイトのカウンター修正
    fixEnglishCounters(actualCount);
  } else {
    // 日本語サイトのカウンター修正
    fixJapaneseCounters(actualCount);
  }
}

function fixEnglishCounters(count) {
  const selectors = [
    '#guide-counter',
    '#guide-count-number-en', 
    '#search-results-counter',
    '.guide-counter',
    '.counter-badge span'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.id === 'guide-count-number-en') {
        element.textContent = count;
      } else if (element.id === 'guide-counter') {
        element.innerHTML = `Found <span id="guide-count-number-en">${count}</span> guides`;
      } else if (element.id === 'search-results-counter') {
        element.textContent = `Showing ${count} guides found`;
      } else if (element.textContent.includes('70') || element.textContent.includes('Found')) {
        element.textContent = `Found ${count} guides`;
      }
    });
  });
  
  // すべての「70」を実際の数字に置換
  document.body.innerHTML = document.body.innerHTML
    .replace(/Found 70 guides/g, `Found ${count} guides`)
    .replace(/Showing 70 guides/g, `Showing ${count} guides`)
    .replace(/70 guides found/g, `${count} guides found`);
    
  console.log(`✅ 英語サイトカウンター修正完了: ${count}`);
}

function fixJapaneseCounters(count) {
  const selectors = [
    '#guides-count',
    '#guide-count-number',
    '.guide-counter'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.id === 'guide-count-number') {
        element.textContent = count;
      } else if (element.id === 'guides-count') {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${count}</span>人のガイドが見つかりました`;
      } else if (element.textContent.includes('70人') || element.textContent.includes('人のガイド')) {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}人のガイドが見つかりました`;
      }
    });
  });
  
  // すべての「70人」を実際の数字に置換
  document.body.innerHTML = document.body.innerHTML
    .replace(/70人のガイドが見つかりました/g, `${count}人のガイドが見つかりました`)
    .replace(/70人のガイド/g, `${count}人のガイド`);
    
  console.log(`✅ 日本語サイトカウンター修正完了: ${count}人`);
}

// グローバル関数として公開
window.forceFixCounters = forceFixCounters;