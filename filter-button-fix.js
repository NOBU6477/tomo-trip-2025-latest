/**
 * フィルターボタンの修正スクリプト
 * 両サイトでフィルター機能を正常に動作させる
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 フィルターボタン修正開始');
  
  // フィルターボタンを強制的に設定
  setupFilterButton();
  
  // 統一ガイドシステムの読み込み完了を待つ
  const checkSystems = () => {
    if (window.unifiedGuideSystem && window.unifiedFilterSystem) {
      console.log('✅ 統一システム準備完了 - フィルター修正実行');
      fixFilterFunctionality();
    } else {
      console.log('⏳ 統一システム読み込み待機中...');
      setTimeout(checkSystems, 200);
    }
  };
  
  setTimeout(checkSystems, 500);
});

function setupFilterButton() {
  // 複数のIDを試行
  const filterBtn = document.getElementById('filterToggleBtn') || 
                    document.getElementById('toggle-filter-button') ||
                    document.querySelector('[id*="filter"]');
  
  if (!filterBtn) {
    console.warn('⚠️ フィルターボタンが見つかりません');
    return;
  }
  
  console.log(`✅ フィルターボタン見つかりました: ${filterBtn.id}`);
  
  // 既存のイベントリスナーを削除
  const newBtn = filterBtn.cloneNode(true);
  filterBtn.parentNode.replaceChild(newBtn, filterBtn);
  
  // 新しいイベントリスナーを設定
  newBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔄 フィルターボタンクリック検出');
    
    const filterCard = document.getElementById('filter-card');
    if (!filterCard) {
      console.error('❌ フィルターカードが見つかりません');
      return;
    }
    
    // フィルターの表示/非表示を切り替え
    if (filterCard.classList.contains('d-none')) {
      filterCard.classList.remove('d-none');
      newBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
      newBtn.classList.remove('btn-outline-primary');
      newBtn.classList.add('btn-primary');
      console.log('✅ フィルター表示');
    } else {
      filterCard.classList.add('d-none');
      newBtn.innerHTML = '<i class="bi bi-funnel"></i> フィルターを開く';
      newBtn.classList.remove('btn-primary');
      newBtn.classList.add('btn-outline-primary');
      console.log('✅ フィルター非表示');
    }
  });
  
  console.log('✅ フィルターボタン設定完了');
}

function fixFilterFunctionality() {
  // カウント表示を修正
  fixGuideCount();
  
  // フィルター要素が正常に動作するよう修正
  if (window.unifiedFilterSystem) {
    window.unifiedFilterSystem.setupFilterHandlers();
  }
}

function fixGuideCount() {
  // 統一ガイドシステムが準備完了まで待機
  if (!window.unifiedGuideSystem || !window.unifiedGuideSystem.guides) {
    console.warn('⚠️ 統一ガイドシステムまたはガイドデータが準備できていません');
    setTimeout(fixGuideCount, 100);
    return;
  }
  
  const actualCount = window.unifiedGuideSystem.guides.length;
  const isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en' ||
                       document.title.includes('English');
  
  console.log(`📊 実際のガイド数: ${actualCount} (${isEnglishSite ? '英語' : '日本語'}サイト)`);
  
  // 日本語サイトのカウンター（複数ID対応）
  const japaneseCounters = [
    document.querySelector('#guides-count'),
    document.querySelector('#guide-counter'),
    document.querySelector('.guide-counter')
  ].filter(el => el !== null);
  
  if (!isEnglishSite && japaneseCounters.length > 0) {
    japaneseCounters.forEach((counter, index) => {
      counter.innerHTML = `<i class="bi bi-people-fill me-2"></i>${actualCount}人のガイドが見つかりました`;
      console.log(`📊 日本語カウンター${index + 1}修正: ${actualCount}人`);
    });
  }
  
  // 英語サイトのカウンター（複数ID対応）
  const englishCounters = [
    document.querySelector('#guide-counter'),
    document.querySelector('#guides-count'),
    document.querySelector('.guide-counter')
  ].filter(el => el !== null);
  
  if (isEnglishSite && englishCounters.length > 0) {
    englishCounters.forEach((counter, index) => {
      counter.textContent = `Found ${actualCount} guides`;
      console.log(`📊 英語カウンター${index + 1}修正: ${actualCount} guides`);
    });
  }
  
  // 検索カウンターも修正
  const searchCounter = document.querySelector('#search-results-counter');
  if (searchCounter) {
    if (isEnglishSite) {
      searchCounter.textContent = `Found ${actualCount} guides`;
    } else {
      searchCounter.innerHTML = `<i class="bi bi-people-fill me-2"></i>${actualCount}人のガイドが見つかりました`;
    }
    console.log(`📊 検索カウンター修正: ${actualCount}`);
  }
}

// グローバル関数として公開
window.toggleFilter = function() {
  const filterBtn = document.getElementById('filterToggleBtn');
  if (filterBtn) {
    filterBtn.click();
  }
};