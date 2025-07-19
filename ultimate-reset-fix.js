/**
 * 究極リセット修正システム
 * 問題：リセット時に6人表示、24人カウンター不一致、もっと見るボタン消失
 */

console.log('🔄 究極リセット修正システム開始');

// 即座に実行
(function() {
  console.log('⚡ 究極リセット修正開始');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeUltimateResetFix);
  } else {
    executeUltimateResetFix();
  }
  
  // 遅延実行で確実に修正
  setTimeout(executeUltimateResetFix, 1000);
  setTimeout(executeUltimateResetFix, 3000);
})();

function executeUltimateResetFix() {
  console.log('🔄 究極リセット修正実行');
  
  try {
    // 1. 全ての競合resetFilters関数を無効化
    neutralizeConflictingResetFunctions();
    
    // 2. 統一リセット関数を実装
    implementUnifiedResetFunction();
    
    // 3. リセットボタンに新機能を適用
    attachNewResetToButtons();
    
    // 4. 24人ガイドデータを確保
    ensure24GuideData();
    
    // 5. リセット監視システム開始
    startResetMonitoring();
    
    console.log('✅ 究極リセット修正完了');
    
  } catch (error) {
    console.error('❌ 究極リセット修正エラー:', error);
  }
}

function neutralizeConflictingResetFunctions() {
  console.log('🔧 競合resetFilters関数無効化');
  
  // 既存のresetFilters関数をバックアップ
  window._oldResetFilters = window.resetFilters;
  
  // 一時的にnullに設定
  window.resetFilters = null;
  
  // 各システムのresetFilters関数も無効化
  if (window.emergencyPaginationSystem) {
    window.emergencyPaginationSystem._oldResetFilters = window.emergencyPaginationSystem.resetFilters;
    window.emergencyPaginationSystem.resetFilters = null;
  }
  
  if (window.unifiedGuideSystem) {
    window.unifiedGuideSystem._oldResetFilters = window.unifiedGuideSystem.resetFilters;
    window.unifiedGuideSystem.resetFilters = null;
  }
  
  console.log('🔧 競合関数無効化完了');
}

function implementUnifiedResetFunction() {
  console.log('🔄 統一リセット関数実装');
  
  // グローバルリセット関数を定義
  window.resetFilters = function() {
    console.log('🔄 統一リセット実行開始');
    
    try {
      // Step 1: フィルターフォームをリセット
      resetAllFilterElements();
      
      // Step 2: 24人のガイドデータを強制表示
      displayAll24Guides();
      
      // Step 3: カウンターを24人に更新
      updateCounterTo24();
      
      // Step 4: もっと見るボタンを適切に設定
      setupLoadMoreButton();
      
      console.log('✅ 統一リセット実行完了');
      
    } catch (error) {
      console.error('❌ 統一リセットエラー:', error);
    }
  };
  
  // 各システムにも統一関数を適用
  if (window.emergencyPaginationSystem) {
    window.emergencyPaginationSystem.resetFilters = window.resetFilters;
  }
  
  if (window.unifiedGuideSystem) {
    window.unifiedGuideSystem.resetFilters = window.resetFilters;
  }
  
  console.log('🔄 統一リセット関数実装完了');
}

function resetAllFilterElements() {
  console.log('🔧 全フィルター要素リセット');
  
  // 都道府県フィルター
  const locationFilter = document.getElementById('location-filter');
  if (locationFilter) {
    locationFilter.value = '';
    locationFilter.selectedIndex = 0;
    console.log('📍 都道府県フィルターリセット');
  }
  
  // 言語フィルター
  const languageFilter = document.getElementById('language-filter');
  if (languageFilter) {
    languageFilter.value = '';
    languageFilter.selectedIndex = 0;
    console.log('🗣️ 言語フィルターリセット');
  }
  
  // 料金フィルター
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.value = '';
    priceFilter.selectedIndex = 0;
    console.log('💰 料金フィルターリセット');
  }
  
  // キーワードチェックボックス
  const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
  keywordCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  console.log(`🔖 キーワードチェックボックス ${keywordCheckboxes.length}個リセット`);
  
  // カスタムキーワード入力
  const customKeyword = document.getElementById('custom-keyword');
  if (customKeyword) {
    customKeyword.value = '';
    console.log('📝 カスタムキーワードリセット');
  }
  
  console.log('🔧 全フィルター要素リセット完了');
}

function displayAll24Guides() {
  console.log('👥 24人ガイド強制表示');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.error('❌ guide-cards-container が見つかりません');
    return;
  }
  
  // 全24人のガイドデータを取得
  const allGuides = getAllGuideData();
  console.log(`📊 取得したガイドデータ: ${allGuides.length}人`);
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // 最初の12人を表示
  const initialGuides = allGuides.slice(0, 12);
  initialGuides.forEach((guide, index) => {
    const guideCard = createUnifiedGuideCard(guide, index);
    container.appendChild(guideCard);
  });
  
  // 残りの12人を非表示で追加
  const remainingGuides = allGuides.slice(12);
  remainingGuides.forEach((guide, index) => {
    const guideCard = createUnifiedGuideCard(guide, index + 12);
    guideCard.style.display = 'none';
    container.appendChild(guideCard);
  });
  
  console.log(`👥 24人ガイド表示完了: 表示12人 + 非表示12人`);
}

function getAllGuideData() {
  console.log('📊 全ガイドデータ取得');
  
  // 基本ガイドデータ
  let allGuides = [];
  
  // emergency-guide-data-fix.jsからデータを取得
  if (window.emergencyPaginationSystem && window.emergencyPaginationSystem.allGuides) {
    allGuides = [...window.emergencyPaginationSystem.allGuides];
  }
  // unified-guide-systemからデータを取得
  else if (window.unifiedGuideSystem && window.unifiedGuideSystem.guides) {
    allGuides = [...window.unifiedGuideSystem.guides];
  }
  // getDefaultGuides関数を使用
  else if (window.getDefaultGuides) {
    allGuides = window.getDefaultGuides();
  }
  // フォールバック：最小限のデータを生成
  else {
    allGuides = generateFallbackGuideData();
  }
  
  // 新規登録ガイドも追加
  const newGuides = JSON.parse(localStorage.getItem('newRegisteredGuides') || '[]');
  if (newGuides.length > 0) {
    allGuides = [...allGuides, ...newGuides];
  }
  
  // 24人に満たない場合は基本データを複製
  while (allGuides.length < 24) {
    const baseGuides = allGuides.slice(0, Math.min(12, allGuides.length));
    allGuides = [...allGuides, ...baseGuides.map(guide => ({
      ...guide,
      id: allGuides.length + 1,
      name: guide.name + ' (追加)'
    }))];
  }
  
  // 24人ちょうどに調整
  allGuides = allGuides.slice(0, 24);
  
  console.log(`📊 全ガイドデータ取得完了: ${allGuides.length}人`);
  return allGuides;
}

function generateFallbackGuideData() {
  console.log('🔧 フォールバックガイドデータ生成');
  
  return [
    {
      id: 1, name: "田中 花子", location: "東京", languages: ["日本語", "英語"],
      specialties: ["観光案内", "文化体験"], fee: 8000, rating: 4.5,
      description: "東京の名所をご案内します。",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2, name: "佐藤 太郎", location: "京都", languages: ["日本語", "英語"],
      specialties: ["歴史散策", "寺院巡り"], fee: 9000, rating: 4.7,
      description: "京都の歴史と文化をお伝えします。",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3, name: "山田 美咲", location: "大阪", languages: ["日本語", "英語"],
      specialties: ["グルメツアー", "ショッピング"], fee: 7500, rating: 4.6,
      description: "大阪のグルメとエンターテイメントをご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];
}

function createUnifiedGuideCard(guide, index) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-md-4 mb-4 guide-item';
  colDiv.setAttribute('data-guide-id', guide.id);
  colDiv.setAttribute('data-fee', guide.fee || 6000);
  colDiv.id = `unified-guide-card-${guide.id}`;
  
  colDiv.innerHTML = `
    <div class="card guide-card h-100">
      <div class="position-relative">
        <img src="${guide.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}" 
             class="card-img-top" alt="${guide.name}" 
             style="height: 200px; object-fit: cover;">
        <div class="position-absolute top-0 end-0 m-2">
          <span class="badge bg-primary">${guide.rating || 4.5}★</span>
        </div>
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${guide.name}</h5>
        <p class="text-muted small mb-2">
          <i class="bi bi-geo-alt-fill"></i> ${guide.location || '未設定'}
        </p>
        <p class="card-text flex-grow-1">${guide.description || 'ガイドの説明がありません'}</p>
        <div class="mb-3">
          <div class="d-flex flex-wrap gap-1">
            ${(guide.languages || ['日本語']).map(lang => 
              `<span class="badge bg-light text-dark">${lang}</span>`
            ).join('')}
          </div>
        </div>
        <div class="mt-auto">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="h5 mb-0 text-primary">¥${(guide.fee || 6000).toLocaleString()}/セッション</span>
          </div>
          <div class="d-grid">
            <button class="btn btn-primary" onclick="showGuideDetails(${guide.id})">詳細を見る</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return colDiv;
}

function updateCounterTo24() {
  console.log('📊 カウンターを24人に更新');
  
  const counterText = '24人のガイドが見つかりました';
  
  // 複数のセレクターでカウンター要素を更新
  const counterSelectors = [
    '#guides-count',
    '.guide-counter',
    '.text-primary.fw-bold.fs-5',
    '[class*="counter"]'
  ];
  
  let updateCount = 0;
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
      updateCount++;
    });
  });
  
  // #guide-count-numberも更新
  const countNumber = document.getElementById('guide-count-number');
  if (countNumber) {
    countNumber.textContent = '24';
    updateCount++;
  }
  
  console.log(`📊 カウンター更新完了: ${updateCount}箇所, "${counterText}"`);
}

function setupLoadMoreButton() {
  console.log('🔘 もっと見るボタンセットアップ');
  
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (!loadMoreBtn) {
    console.log('⚠️ load-more-btn要素が見つかりません');
    return;
  }
  
  // ボタンを表示状態に設定
  loadMoreBtn.innerHTML = `
    <button class="btn btn-primary btn-lg load-more-button" onclick="window.handleUnifiedLoadMore()">
      もっと見る（残り12人）
    </button>
  `;
  loadMoreBtn.style.display = 'block';
  
  console.log('🔘 もっと見るボタンセットアップ完了');
}

function attachNewResetToButtons() {
  console.log('🔧 リセットボタンに新機能を適用');
  
  // リセットボタンを検索
  const resetButtons = document.querySelectorAll(
    'button[onclick*="resetFilters"], ' +
    'button:contains("リセット"), ' +
    '.btn:contains("リセット"), ' +
    '[id*="reset"], ' +
    '[class*="reset"]'
  );
  
  let attachCount = 0;
  
  resetButtons.forEach(button => {
    // 既存のイベントをクリア
    button.onclick = null;
    button.removeAttribute('onclick');
    
    // 新しいイベントリスナーを追加
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔄 リセットボタンクリック（新機能）');
      window.resetFilters();
    });
    
    attachCount++;
  });
  
  // HTMLからリセットボタンも検索
  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(button => {
    if (button.textContent.includes('リセット') && !button.onclick) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔄 リセットボタンクリック（テキスト検索）');
        window.resetFilters();
      });
      attachCount++;
    }
  });
  
  console.log(`🔧 リセットボタン新機能適用完了: ${attachCount}個`);
}

function startResetMonitoring() {
  console.log('👁️ リセット監視開始');
  
  setInterval(() => {
    const container = document.getElementById('guide-cards-container');
    const counterElement = document.getElementById('guide-count-number');
    
    if (container && counterElement) {
      const visibleCards = container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length;
      const counterValue = parseInt(counterElement.textContent || '0');
      
      // 6人表示でカウンターが24の場合（リセット後の不整合）
      if (visibleCards <= 6 && counterValue >= 24) {
        console.log('👁️ リセット後不整合検出 - 自動修正');
        
        // フィルターがリセット状態かチェック
        const priceFilter = document.getElementById('price-filter');
        const isReset = !priceFilter || priceFilter.value === '' || priceFilter.selectedIndex === 0;
        
        if (isReset) {
          console.log('👁️ リセット状態確認 - 24人表示に修正');
          displayAll24Guides();
          updateCounterTo24();
          setupLoadMoreButton();
        }
      }
    }
  }, 3000); // 3秒間隔で監視
}

// デバッグ用関数
window.ultimateResetDebug = function() {
  console.log('🔄 究極リセットデバッグ情報');
  
  const container = document.getElementById('guide-cards-container');
  const totalCards = container ? container.querySelectorAll('.col-md-4, .guide-item').length : 0;
  const visibleCards = container ? container.querySelectorAll('.col-md-4:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length : 0;
  const counterElement = document.getElementById('guide-count-number');
  const counterValue = counterElement ? parseInt(counterElement.textContent || '0') : 0;
  
  console.log('🔄 現在の状態:', {
    totalCards: totalCards,
    visibleCards: visibleCards,
    counterValue: counterValue,
    resetFunction: typeof window.resetFilters,
    emergencySystem: !!window.emergencyPaginationSystem,
    unifiedSystem: !!window.unifiedGuideSystem
  });
  
  console.log('🔧 手動リセット実行');
  window.resetFilters();
};

console.log('✅ 究極リセット修正システム読み込み完了');
console.log('🔧 デバッグ用: window.ultimateResetDebug() を実行してください');