/**
 * システム全体のデバッグ用スクリプト
 * ガイド数の不一致とフィルター問題を解決する
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 システムデバッガー開始');
  
  // 初期化の遅延実行
  setTimeout(() => {
    debugGuideCounts();
    debugFilterSystem();
    fixGuideCounts();
  }, 1000);
  
  // 定期的なチェック
  setInterval(() => {
    fixGuideCounts();
  }, 5000);
});

function debugGuideCounts() {
  console.log('📊 ガイドカウント デバッグ開始');
  
  const isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en' ||
                       document.title.includes('English');
  
  console.log(`🌐 サイト判定: ${isEnglishSite ? '英語' : '日本語'}`);
  
  // ガイドシステムの状態確認
  if (window.unifiedGuideSystem) {
    console.log(`✅ 統一ガイドシステム利用可能 - ガイド数: ${window.unifiedGuideSystem.guides.length}`);
  } else {
    console.warn('⚠️ 統一ガイドシステムが利用できません');
  }
  
  // DOM要素の確認
  const jpCounter = document.querySelector('#guides-count');
  const enCounter = document.querySelector('#guide-counter');
  
  console.log('📋 DOM要素確認:');
  console.log('- 日本語カウンター:', jpCounter ? jpCounter.textContent : 'なし');
  console.log('- 英語カウンター:', enCounter ? enCounter.textContent : 'なし');
}

function debugFilterSystem() {
  console.log('🔧 フィルターシステム デバッグ開始');
  
  const filterBtn = document.getElementById('filterToggleBtn') || 
                   document.getElementById('toggle-filter-button');
  const filterCard = document.getElementById('filter-card');
  
  console.log('🎛️ フィルター要素確認:');
  console.log('- フィルターボタン:', filterBtn ? 'あり' : 'なし');
  console.log('- フィルターカード:', filterCard ? 'あり' : 'なし');
  
  if (window.unifiedFilterSystem) {
    console.log('✅ 統一フィルターシステム利用可能');
  } else {
    console.warn('⚠️ 統一フィルターシステムが利用できません');
  }
}

function fixGuideCounts() {
  if (!window.unifiedGuideSystem || !window.unifiedGuideSystem.guides) {
    return;
  }
  
  const actualCount = window.unifiedGuideSystem.guides.length;
  const isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en' ||
                       document.title.includes('English');
  
  // 日本語サイトのカウンター修正
  if (!isEnglishSite) {
    const jpCounterSpan = document.querySelector('#guide-count-number');
    const jpCounterFull = document.querySelector('#guides-count');
    
    if (jpCounterSpan) {
      jpCounterSpan.textContent = actualCount;
    }
    
    if (jpCounterFull) {
      jpCounterFull.innerHTML = `<i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${actualCount}</span>人のガイドが見つかりました`;
    }
  }
  
  // 英語サイトのカウンター修正
  if (isEnglishSite) {
    const enCounterSpan = document.querySelector('#guide-count-number-en');
    const enCounterFull = document.querySelector('#guide-counter');
    
    if (enCounterSpan) {
      enCounterSpan.textContent = actualCount;
    }
    
    if (enCounterFull) {
      enCounterFull.innerHTML = `Found <span id="guide-count-number-en">${actualCount}</span> guides`;
    }
  }
  
  console.log(`📊 カウンター修正完了: ${actualCount}${isEnglishSite ? ' guides' : '人のガイド'}`);
}

// グローバル関数として公開
window.debugSystem = {
  debugGuideCounts,
  debugFilterSystem,
  fixGuideCounts
};