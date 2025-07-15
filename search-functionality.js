/**
 * 検索機能の実装
 * ガイドの検索とフィルタリング機能
 */

(function() {
  'use strict';
  
  console.log('🔍 検索機能開始');
  
  // 検索データ（実際の実装では外部APIから取得）
  const allGuides = [
    {
      id: 1,
      name: '田中 太郎',
      location: '大阪府',
      languages: ['ja', 'en'],
      specialties: ['ナイトツアー', '写真スポット'],
      fee: 8000,
      rating: 4.8,
      description: '大阪の夜景を知り尽くしたガイド'
    },
    {
      id: 2,
      name: '佐藤 花子',
      location: '大阪府',
      languages: ['ja', 'en', 'zh'],
      specialties: ['グルメ', '料理'],
      fee: 6000,
      rating: 4.9,
      description: '大阪グルメの専門家'
    },
    {
      id: 3,
      name: '山田 一郎',
      location: '東京都',
      languages: ['ja', 'en'],
      specialties: ['アクティビティ', '写真スポット'],
      fee: 12000,
      rating: 4.7,
      description: '東京の隠れた観光スポット案内'
    },
    {
      id: 4,
      name: '鈴木 美咲',
      location: '京都府',
      languages: ['ja', 'en', 'ko'],
      specialties: ['料理', '写真スポット'],
      fee: 9000,
      rating: 4.6,
      description: '京都の伝統文化案内'
    },
    {
      id: 5,
      name: '高橋 健太',
      location: '東京都',
      languages: ['ja', 'en'],
      specialties: ['ナイトツアー', 'アクティビティ'],
      fee: 10000,
      rating: 4.5,
      description: '東京のナイトライフ案内'
    }
  ];
  
  let currentGuides = [...allGuides];
  
  // 初期化
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupSearchSystem);
    } else {
      setupSearchSystem();
    }
  }
  
  function setupSearchSystem() {
    console.log('🔧 検索システム初期化');
    
    // 検索ボタンのイベント設定
    const searchButton = document.querySelector('button[onclick="searchGuides()"]');
    if (searchButton) {
      searchButton.removeAttribute('onclick');
      searchButton.addEventListener('click', performSearch);
    }
    
    // リセットボタンのイベント設定
    const resetButton = document.querySelector('button[onclick="resetFilters()"]');
    if (resetButton) {
      resetButton.removeAttribute('onclick');
      resetButton.addEventListener('click', resetFilters);
    }
    
    // 初期表示
    displayGuides(currentGuides);
    
    console.log('✅ 検索システム初期化完了');
  }
  
  function performSearch() {
    console.log('🔍 検索実行');
    
    // フィルター値を取得
    const location = document.getElementById('location-filter')?.value || '';
    const language = document.getElementById('language-filter')?.value || '';
    const priceRange = document.getElementById('price-filter')?.value || '';
    
    // チェックボックスの値を取得
    const checkedKeywords = [];
    const keywordCheckboxes = document.querySelectorAll('input[name="keyword"]:checked');
    keywordCheckboxes.forEach(cb => checkedKeywords.push(cb.value));
    
    // カスタムキーワードを取得
    const customKeywords = document.getElementById('custom-keywords')?.value || '';
    const customKeywordList = customKeywords.split(',').map(k => k.trim()).filter(k => k);
    
    // 全キーワードを結合
    const allKeywords = [...checkedKeywords, ...customKeywordList];
    
    console.log('検索条件:', { location, language, priceRange, allKeywords });
    
    // フィルタリング実行
    let filteredGuides = [...allGuides];
    
    // 地域フィルター
    if (location && location !== 'すべて') {
      filteredGuides = filteredGuides.filter(guide => guide.location.includes(location));
    }
    
    // 言語フィルター
    if (language && language !== 'すべて') {
      const langMap = {
        '日本語': 'ja',
        '英語': 'en',
        '中国語': 'zh',
        '韓国語': 'ko'
      };
      const langCode = langMap[language];
      if (langCode) {
        filteredGuides = filteredGuides.filter(guide => guide.languages.includes(langCode));
      }
    }
    
    // 料金フィルター
    if (priceRange && priceRange !== 'すべて') {
      filteredGuides = filteredGuides.filter(guide => {
        const fee = guide.fee;
        switch (priceRange) {
          case '6000円以下':
            return fee <= 6000;
          case '6000-10000円':
            return fee > 6000 && fee <= 10000;
          case '10000円以上':
            return fee > 10000;
          default:
            return true;
        }
      });
    }
    
    // キーワードフィルター
    if (allKeywords.length > 0) {
      filteredGuides = filteredGuides.filter(guide => {
        return allKeywords.some(keyword => 
          guide.specialties.some(specialty => specialty.includes(keyword)) ||
          guide.description.includes(keyword)
        );
      });
    }
    
    currentGuides = filteredGuides;
    displayGuides(currentGuides);
    
    console.log(`検索結果: ${currentGuides.length}件`);
  }
  
  function resetFilters() {
    console.log('🔄 フィルターリセット');
    
    // フォームをリセット
    document.getElementById('location-filter').value = '';
    document.getElementById('language-filter').value = '';
    document.getElementById('price-filter').value = '';
    
    // チェックボックスをリセット
    const keywordCheckboxes = document.querySelectorAll('input[name="keyword"]');
    keywordCheckboxes.forEach(cb => cb.checked = false);
    
    // カスタムキーワードをリセット
    document.getElementById('custom-keywords').value = '';
    
    // 全ガイドを表示
    currentGuides = [...allGuides];
    displayGuides(currentGuides);
  }
  
  function displayGuides(guides) {
    console.log(`📋 ${guides.length}件のガイドを表示`);
    
    // 結果カウンターを更新
    const counter = document.getElementById('guides-count');
    if (counter) {
      counter.textContent = `${guides.length}人のガイドが見つかりました`;
    }
    
    // 既存のガイドカードを削除
    const existingCards = document.querySelectorAll('.guide-card');
    existingCards.forEach(card => card.remove());
    
    // 新しいガイドカードを生成
    const guidesContainer = document.getElementById('guides-container') || document.querySelector('.row');
    if (!guidesContainer) {
      console.error('ガイドコンテナが見つかりません');
      return;
    }
    
    if (guides.length === 0) {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.className = 'col-12 text-center py-5';
      noResultsDiv.innerHTML = `
        <div class="alert alert-info">
          <h5>検索結果がありません</h5>
          <p>検索条件を変更してお試しください</p>
        </div>
      `;
      guidesContainer.appendChild(noResultsDiv);
      return;
    }
    
    guides.forEach(guide => {
      const guideCard = createGuideCard(guide);
      guidesContainer.appendChild(guideCard);
    });
  }
  
  function createGuideCard(guide) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const languageNames = {
      ja: '日本語',
      en: '英語',
      zh: '中国語',
      ko: '韓国語'
    };
    
    const languageList = guide.languages.map(lang => languageNames[lang] || lang).join(', ');
    const specialtyList = guide.specialties.join(', ');
    
    col.innerHTML = `
      <div class="card guide-card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center mb-3">
            <img src="https://placehold.co/60x60?text=${guide.name[0]}" 
                 class="rounded-circle me-3" 
                 alt="${guide.name}">
            <div>
              <h5 class="card-title mb-1">${guide.name}</h5>
              <p class="text-muted mb-0">
                <i class="bi bi-geo-alt me-1"></i>${guide.location}
              </p>
            </div>
          </div>
          
          <div class="mb-3">
            <p class="card-text">${guide.description}</p>
          </div>
          
          <div class="mb-3">
            <small class="text-muted">
              <i class="bi bi-translate me-1"></i>対応言語: ${languageList}
            </small>
          </div>
          
          <div class="mb-3">
            <small class="text-muted">
              <i class="bi bi-star-fill me-1"></i>専門分野: ${specialtyList}
            </small>
          </div>
          
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong class="text-primary">¥${guide.fee.toLocaleString()}</strong>
              <small class="text-muted">/時間</small>
            </div>
            <div>
              <span class="badge bg-warning text-dark">
                <i class="bi bi-star-fill me-1"></i>${guide.rating}
              </span>
            </div>
          </div>
          
          <div class="mt-3">
            <button class="btn btn-primary w-100" onclick="viewGuideDetails(${guide.id})">
              詳細を見る
            </button>
          </div>
        </div>
      </div>
    `;
    
    return col;
  }
  
  // グローバル関数として公開
  window.searchGuides = performSearch;
  window.resetFilters = resetFilters;
  window.viewGuideDetails = function(guideId) {
    console.log(`ガイド詳細表示: ${guideId}`);
    alert(`ガイドID ${guideId} の詳細ページを表示します`);
  };
  
  // 初期化実行
  initialize();
  
})();