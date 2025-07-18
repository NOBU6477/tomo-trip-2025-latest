/**
 * 日本語サイト専用カウンター修正スクリプト
 * 実際のガイドカード数に合わせてカウンター表示を修正
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🇯🇵 日本語サイトカウンター修正開始');
  
  // 日本語サイトかどうかの判定
  const isJapaneseSite = !window.location.pathname.includes('index-en.html') && 
                        document.documentElement.lang !== 'en';
  
  if (!isJapaneseSite) {
    console.log('英語サイトなので日本語カウンター修正をスキップ');
    return;
  }
  
  // 即座に修正を実行
  setTimeout(() => {
    fixJapaneseCounters();
    
    // 定期的な監視と修正（3秒間隔）
    setInterval(fixJapaneseCounters, 3000);
  }, 500);
});

function fixJapaneseCounters() {
  console.log('📊 日本語カウンター修正実行');
  
  // 実際のガイドカード数を取得
  const guideContainer = document.getElementById('guide-cards-container');
  const actualCards = guideContainer ? guideContainer.querySelectorAll('.guide-card, .col-lg-4, .col-md-4').length : 0;
  
  console.log(`🎯 実際のガイドカード数: ${actualCards}`);
  
  // 70人表記を実際の数に修正
  const elementsToFix = document.querySelectorAll('*');
  
  elementsToFix.forEach(element => {
    if (element.textContent && element.textContent.includes('70人のガイドが見つかりました')) {
      element.textContent = element.textContent.replace(/70人のガイドが見つかりました/g, `${actualCards}人のガイドが見つかりました`);
      console.log(`✅ 修正: 70人のガイドが見つかりました → ${actualCards}人のガイドが見つかりました`);
    }
    
    if (element.textContent && element.textContent.includes('70人のガイド')) {
      element.textContent = element.textContent.replace(/70人のガイド/g, `${actualCards}人のガイド`);
      console.log(`✅ 修正: 70人のガイド → ${actualCards}人のガイド`);
    }
  });
  
  // 特定のID要素のカウンター修正
  const specificCounters = [
    '#guides-count',
    '#guide-count-number',
    '#counter-badge'
  ];
  
  specificCounters.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      if (element.id === 'guide-count-number') {
        element.textContent = actualCards;
      } else if (element.textContent.includes('70')) {
        element.textContent = element.textContent.replace(/70/g, actualCards);
      } else if (!element.textContent.includes(actualCards.toString())) {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${actualCards}人のガイドが見つかりました`;
      }
    }
  });
  
  // HTMLの直接置換（最終手段）
  if (document.body.innerHTML.includes('70人のガイドが見つかりました')) {
    let bodyHTML = document.body.innerHTML;
    bodyHTML = bodyHTML.replace(/70人のガイドが見つかりました/g, `${actualCards}人のガイドが見つかりました`);
    bodyHTML = bodyHTML.replace(/70人のガイド/g, `${actualCards}人のガイド`);
    
    // 安全性のため、変更があった場合のみ適用
    if (bodyHTML !== document.body.innerHTML) {
      document.body.innerHTML = bodyHTML;
      console.log('🔄 日本語HTML直接修正を実行しました');
    }
  }
  
  console.log(`✅ 日本語カウンター修正完了: ${actualCards}人のガイド`);
}

// 他のスクリプトとの競合を避けるための緊急修正
window.addEventListener('load', function() {
  setTimeout(fixJapaneseCounters, 1000);
});

// load-70-guides-en.jsの影響を無効化
if (window.updateCounter) {
  window.updateCounter = function() {
    console.log('⚠️ load-70-guides-en.jsのupdateCounterを無効化');
    fixJapaneseCounters();
  };
}

// グローバル関数として公開
window.fixJapaneseCounters = fixJapaneseCounters;