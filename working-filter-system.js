/**
 * 動作するフィルターシステム - 24人のガイドに対する実際のフィルター機能
 * 目標：登録済み全ガイド（24人）を対象に動的フィルターを実装
 */

console.log('🔍 動作するフィルターシステム開始');

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', function() {
  initializeWorkingFilterSystem();
});

// より確実な初期化
window.addEventListener('load', function() {
  setTimeout(() => {
    initializeWorkingFilterSystem();
  }, 1000);
});

function initializeWorkingFilterSystem() {
  console.log('🚀 動作するフィルターシステム初期化開始');
  
  // searchGuides関数を確実に実装
  window.searchGuides = function() {
    console.log('🔍 検索実行開始');
    applyWorkingFilters();
  };
  
  // resetFilters関数も実装（既存を上書き）
  window.resetFilters = function() {
    console.log('🔄 フィルターリセット実行');
    resetAllWorkingFilters();
  };
  
  // フォールバック関数も設置
  window.applyFilters = function() {
    console.log('🔍 applyFilters実行');
    applyWorkingFilters();
  };
  
  console.log('✅ 動作するフィルターシステム初期化完了');
  
  // デバッグ情報を表示
  setTimeout(() => {
    displayFilterSystemDebugInfo();
  }, 2000);
}

function applyWorkingFilters() {
  console.log('🔍 動作するフィルター適用開始');
  
  try {
    // 現在のフィルター値を取得
    const filters = getCurrentFilterValues();
    console.log('📊 現在のフィルター値:', filters);
    
    // 全ガイドデータを取得
    const allGuides = getAllRegisteredGuides();
    console.log(`📊 対象ガイド総数: ${allGuides.length}人`);
    
    // フィルター適用
    let filteredGuides = allGuides;
    
    // 地域フィルター
    if (filters.location && filters.location !== 'すべて' && filters.location !== '') {
      filteredGuides = filteredGuides.filter(guide => 
        guide.location && guide.location.includes(filters.location)
      );
      console.log(`📍 地域フィルター適用後: ${filteredGuides.length}人`);
    }
    
    // 言語フィルター
    if (filters.language && filters.language !== 'すべて' && filters.language !== '') {
      filteredGuides = filteredGuides.filter(guide => 
        guide.languages && guide.languages.includes(filters.language)
      );
      console.log(`🗣️ 言語フィルター適用後: ${filteredGuides.length}人`);
    }
    
    // 料金フィルター
    if (filters.price && filters.price !== 'すべて' && filters.price !== '') {
      filteredGuides = filterByPrice(filteredGuides, filters.price);
      console.log(`💰 料金フィルター適用後: ${filteredGuides.length}人`);
    }
    
    // キーワードフィルター
    if (filters.keywords.length > 0) {
      filteredGuides = filterByKeywords(filteredGuides, filters.keywords);
      console.log(`🏷️ キーワードフィルター適用後: ${filteredGuides.length}人`);
    }
    
    // 結果を表示
    displayFilteredGuides(filteredGuides);
    updateGuideCounter(filteredGuides.length, allGuides.length);
    
    console.log(`✅ フィルター適用完了: ${allGuides.length}人 → ${filteredGuides.length}人`);
    
  } catch (error) {
    console.error('❌ フィルター適用エラー:', error);
  }
}

function getCurrentFilterValues() {
  const locationFilter = document.getElementById('location-filter');
  const languageFilter = document.getElementById('language-filter');
  const priceFilter = document.getElementById('price-filter');
  const customKeywords = document.getElementById('custom-keywords');
  
  // チェックボックスから選択されたキーワードを取得
  const checkboxKeywords = [];
  const checkboxes = document.querySelectorAll('.keyword-checkbox:checked');
  checkboxes.forEach(cb => checkboxKeywords.push(cb.value));
  
  // カスタムキーワードをパース
  const customKeywordList = customKeywords && customKeywords.value
    ? customKeywords.value.split(',').map(k => k.trim()).filter(k => k)
    : [];
  
  const allKeywords = [...checkboxKeywords, ...customKeywordList];
  
  return {
    location: locationFilter ? locationFilter.value : '',
    language: languageFilter ? languageFilter.value : '',
    price: priceFilter ? priceFilter.value : '',
    keywords: allKeywords
  };
}

function getAllRegisteredGuides() {
  // 複数のソースからガイドデータを統合取得
  let allGuides = [];
  
  // 1. pagination-guide-systemから取得
  if (window.paginationGuideSystem && window.paginationGuideSystem.allGuides) {
    allGuides = [...window.paginationGuideSystem.allGuides];
    console.log(`📊 pagination-guide-systemから${allGuides.length}人取得`);
  }
  
  // 2. unified-guide-systemから取得（バックアップ）
  if (allGuides.length === 0 && window.unifiedGuideSystem && window.unifiedGuideSystem.guides) {
    allGuides = [...window.unifiedGuideSystem.guides];
    console.log(`📊 unified-guide-systemから${allGuides.length}人取得`);
  }
  
  // 3. getDefaultGuides関数から取得（最終フォールバック）
  if (allGuides.length === 0 && typeof getDefaultGuides === 'function') {
    allGuides = getDefaultGuides();
    console.log(`📊 getDefaultGuidesから${allGuides.length}人取得`);
  }
  
  // 4. localStorageから新規登録ガイドも追加
  const newGuides = localStorage.getItem('newRegisteredGuides');
  if (newGuides) {
    const additional = JSON.parse(newGuides);
    additional.forEach(guide => {
      if (!allGuides.find(g => g.id === guide.id)) {
        allGuides.push(guide);
      }
    });
    console.log(`📊 新規登録ガイド${additional.length}人を追加`);
  }
  
  console.log(`📊 最終ガイド総数: ${allGuides.length}人`);
  return allGuides;
}

function filterByPrice(guides, priceValue) {
  console.log(`💰 料金フィルター適用: "${priceValue}"`);
  
  switch (priceValue) {
    case '6000円以下':
    case '¥6,000以下/時間':
      return guides.filter(guide => (guide.fee || 6000) <= 6000);
    
    case '6000-10000円':
    case '¥6,000-10,000/時間':
      return guides.filter(guide => {
        const fee = guide.fee || 6000;
        return fee > 6000 && fee <= 10000;
      });
    
    case '10000円以上':
    case '¥10,000以上/時間':
      return guides.filter(guide => (guide.fee || 6000) > 10000);
    
    default:
      return guides;
  }
}

function filterByKeywords(guides, keywords) {
  if (!keywords || keywords.length === 0) return guides;
  
  console.log(`🏷️ キーワードフィルター適用: [${keywords.join(', ')}]`);
  
  return guides.filter(guide => {
    return keywords.some(keyword => {
      // specialties配列内を検索
      if (guide.specialties && guide.specialties.some(specialty => 
          specialty.includes(keyword) || keyword.includes(specialty))) {
        return true;
      }
      
      // description内を検索
      if (guide.description && guide.description.includes(keyword)) {
        return true;
      }
      
      // name内を検索
      if (guide.name && guide.name.includes(keyword)) {
        return true;
      }
      
      return false;
    });
  });
}

function displayFilteredGuides(filteredGuides) {
  console.log(`🖼️ ガイド表示開始: ${filteredGuides.length}人`);
  
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.error('❌ guide-cards-container が見つかりません');
    return;
  }
  
  // コンテナをクリア
  container.innerHTML = '';
  
  // フィルター結果を表示
  if (filteredGuides.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          <strong>該当するガイドが見つかりませんでした</strong>
          <p class="mb-0 mt-2">フィルター条件を変更して再度検索してください。</p>
        </div>
      </div>
    `;
    return;
  }
  
  // ガイドカードを生成・表示
  filteredGuides.forEach((guide, index) => {
    const guideCard = createWorkingGuideCard(guide, index);
    container.appendChild(guideCard);
  });
  
  console.log(`✅ ガイド表示完了: ${filteredGuides.length}枚のカード表示`);
}

function createWorkingGuideCard(guide, index) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-md-4 mb-4 guide-item';
  colDiv.setAttribute('data-guide-id', guide.id);
  colDiv.setAttribute('data-fee', guide.fee || 6000);
  colDiv.id = `working-guide-card-${guide.id}`;
  
  colDiv.innerHTML = `
    <div class="card guide-card h-100">
      <div class="position-relative">
        <img src="${guide.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}" 
             class="card-img-top" alt="${guide.name}" 
             style="height: 200px; object-fit: cover;">
        <div class="position-absolute top-0 end-0 m-2">
          <span class="badge bg-primary">${guide.rating || 4.0}★</span>
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

function updateGuideCounter(filteredCount, totalCount) {
  const counterText = `${filteredCount}人のガイドが見つかりました（全${totalCount}人中）`;
  
  const counterSelectors = [
    '.text-primary.fw-bold.fs-5',
    '.counter-badge',
    '#guides-count',
    '.guide-counter',
    '#guide-counter'
  ];
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
      console.log(`📊 カウンター更新: ${counterText}`);
    });
  });
  
  console.log(`📊 動作するフィルターカウンター更新: ${counterText}`);
}

function resetAllWorkingFilters() {
  console.log('🔄 全フィルターリセット開始');
  
  try {
    // selectフィルターをリセット
    const selectFilters = ['location-filter', 'language-filter', 'price-filter'];
    selectFilters.forEach(filterId => {
      const element = document.getElementById(filterId);
      if (element) {
        element.selectedIndex = 0;
        element.value = '';
        if (element.options.length > 0) {
          element.options[0].selected = true;
        }
        console.log(`✅ ${filterId} リセット完了`);
      }
    });
    
    // テキスト入力をリセット
    const textFilter = document.getElementById('custom-keywords');
    if (textFilter) {
      textFilter.value = '';
      console.log('✅ custom-keywords リセット完了');
    }
    
    // チェックボックスをリセット
    const checkboxes = document.querySelectorAll('.keyword-checkbox');
    checkboxes.forEach((cb, index) => {
      cb.checked = false;
      console.log(`✅ キーワード${index}チェックボックスリセット`);
    });
    
    // 全ガイドを再表示
    setTimeout(() => {
      const allGuides = getAllRegisteredGuides();
      displayFilteredGuides(allGuides);
      updateGuideCounter(allGuides.length, allGuides.length);
    }, 200);
    
    console.log('✅ 全フィルターリセット完了');
    
  } catch (error) {
    console.error('❌ フィルターリセットエラー:', error);
  }
}

function displayFilterSystemDebugInfo() {
  console.log('🔍 動作するフィルターシステム デバッグ情報');
  
  const allGuides = getAllRegisteredGuides();
  const filters = getCurrentFilterValues();
  
  console.log('📊 システム状態:', {
    totalGuides: allGuides.length,
    currentFilters: filters,
    searchGuidesExists: typeof window.searchGuides,
    resetFiltersExists: typeof window.resetFilters,
    applyFiltersExists: typeof window.applyFilters
  });
  
  console.log('📊 ガイドデータサンプル:', allGuides.slice(0, 3));
}

// デバッグ用関数をグローバルに公開
window.workingFilterDebug = function() {
  displayFilterSystemDebugInfo();
};

console.log('✅ 動作するフィルターシステム読み込み完了');
console.log('🔧 デバッグ用: window.workingFilterDebug() を実行してください');