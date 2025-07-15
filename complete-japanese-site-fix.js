/**
 * 日本語サイト完全修正システム
 * 新規登録ボタン、フィルター機能、ガイド表示の統合修正
 */

(function() {
  'use strict';
  
  console.log('🔧 日本語サイト完全修正システム開始');
  
  let isInitialized = false;
  let guideDatabase = [];
  let currentFilters = {
    location: 'all',
    language: 'all', 
    fee: 'all',
    keywords: []
  };
  
  function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    
    // 1. 新規登録ボタンの日本語修正
    fixRegistrationButtons();
    
    // 2. フィルター機能の修正
    setupFilterSystem();
    
    // 3. ガイドデータの初期化
    initializeGuideData();
    
    // 4. 継続監視の設定
    setupContinuousMonitoring();
    
    console.log('✅ 日本語サイト完全修正システム初期化完了');
  }
  
  function fixRegistrationButtons() {
    const fixes = [
      { selector: 'a[href="#registerModal"]', text: '新規登録' },
      { selector: '.nav-link[data-bs-toggle="dropdown"]:contains("Sign Up")', text: '新規登録' },
      { selector: 'button:contains("Sign Up")', text: '新規登録' },
      { selector: '.btn:contains("Register")', text: '新規登録' },
      { selector: '.dropdown-item[href="#registerModal"]', text: '新規登録' }
    ];
    
    fixes.forEach(fix => {
      const elements = document.querySelectorAll(fix.selector);
      elements.forEach(element => {
        if (element.textContent.includes('Sign Up') || 
            element.textContent.includes('Register') ||
            element.textContent.trim() === 'Sign Up' ||
            element.textContent.trim() === 'Register') {
          element.textContent = fix.text;
          console.log(`🔄 ボタン修正: ${element.textContent} → ${fix.text}`);
        }
      });
    });
    
    // 特定の問題のあるボタンを直接修正
    const problematicButtons = document.querySelectorAll('a.nav-link[data-bs-toggle="dropdown"]');
    problematicButtons.forEach(button => {
      if (button.textContent.includes('Sign Up') || button.textContent.trim() === 'Sign Up') {
        button.textContent = '新規登録';
        console.log('🎯 問題ボタン直接修正完了');
      }
    });
  }
  
  function setupFilterSystem() {
    // フィルター要素の取得
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCheckboxes = document.querySelectorAll('input[name="keywords"]');
    
    if (!locationFilter || !languageFilter || !feeFilter) {
      console.warn('⚠️ フィルター要素が見つかりません');
      return;
    }
    
    // フィルターイベントリスナーの設定
    locationFilter.addEventListener('change', handleFilterChange);
    languageFilter.addEventListener('change', handleFilterChange);
    feeFilter.addEventListener('change', handleFilterChange);
    
    keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleKeywordChange);
    });
    
    console.log('🔧 フィルターシステム設定完了');
  }
  
  function handleFilterChange(event) {
    const filterType = event.target.id.replace('-filter', '');
    currentFilters[filterType] = event.target.value;
    
    console.log(`🔄 フィルター変更: ${filterType} = ${event.target.value}`);
    
    // フィルター状態の保存
    saveFilterState();
    
    // ガイド表示の更新
    applyFiltersAndUpdateDisplay();
  }
  
  function handleKeywordChange(event) {
    const keyword = event.target.value;
    
    if (event.target.checked) {
      if (!currentFilters.keywords.includes(keyword)) {
        currentFilters.keywords.push(keyword);
      }
    } else {
      currentFilters.keywords = currentFilters.keywords.filter(k => k !== keyword);
    }
    
    console.log(`🏷️ キーワード変更: ${currentFilters.keywords.join(', ')}`);
    
    saveFilterState();
    applyFiltersAndUpdateDisplay();
  }
  
  function saveFilterState() {
    try {
      localStorage.setItem('currentFilters', JSON.stringify(currentFilters));
    } catch (error) {
      console.error('フィルター状態保存エラー:', error);
    }
  }
  
  function loadFilterState() {
    try {
      const saved = localStorage.getItem('currentFilters');
      if (saved) {
        currentFilters = { ...currentFilters, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('フィルター状態読み込みエラー:', error);
    }
  }
  
  function initializeGuideData() {
    // 基本ガイドデータの設定
    guideDatabase = [
      {
        id: 'guide_001',
        name: '田中 さくら',
        location: '東京',
        languages: ['日本語', '英語'],
        fee: 8000,
        specialty: ['グルメ', '夜景'],
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=300&h=300&fit=crop',
        rating: 4.8,
        reviews: 124,
        description: '東京の隠れた名店と絶景スポットをご案内します。'
      },
      {
        id: 'guide_002',
        name: '山田 健太',
        location: '大阪',
        languages: ['日本語', '英語', '中国語'],
        fee: 7500,
        specialty: ['歴史', '文化'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        rating: 4.9,
        reviews: 89,
        description: '大阪の歴史と文化を深く知るツアーをお届けします。'
      },
      {
        id: 'guide_003',
        name: '鈴木 美咲',
        location: '京都',
        languages: ['日本語', '英語'],
        fee: 9000,
        specialty: ['寺院', '伝統工芸'],
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
        rating: 4.7,
        reviews: 156,
        description: '古都京都の伝統と美しさをお伝えします。'
      },
      {
        id: 'guide_004',
        name: '佐藤 竜也',
        location: '福岡',
        languages: ['日本語', '韓国語'],
        fee: 6500,
        specialty: ['グルメ', '屋台'],
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
        rating: 4.6,
        reviews: 78,
        description: '博多の美味しいグルメスポットをご紹介します。'
      },
      {
        id: 'guide_005',
        name: '高橋 ゆき',
        location: '沖縄',
        languages: ['日本語', '英語'],
        fee: 8500,
        specialty: ['海', 'マリンスポーツ'],
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
        rating: 4.9,
        reviews: 203,
        description: '美しい沖縄の海と文化をご案内します。'
      }
    ];
    
    // ローカルストレージから追加ガイドを読み込み
    loadAdditionalGuides();
    
    // 初期表示
    updateGuideDisplay();
  }
  
  function loadAdditionalGuides() {
    try {
      const saved = localStorage.getItem('additionalGuides');
      if (saved) {
        const additional = JSON.parse(saved);
        guideDatabase = [...guideDatabase, ...additional];
      }
    } catch (error) {
      console.error('追加ガイド読み込みエラー:', error);
    }
  }
  
  function applyFiltersAndUpdateDisplay() {
    let filteredGuides = [...guideDatabase];
    
    // 地域フィルター
    if (currentFilters.location !== 'all') {
      filteredGuides = filteredGuides.filter(guide => 
        guide.location === currentFilters.location
      );
    }
    
    // 言語フィルター
    if (currentFilters.language !== 'all') {
      filteredGuides = filteredGuides.filter(guide =>
        guide.languages.includes(currentFilters.language)
      );
    }
    
    // 料金フィルター
    if (currentFilters.fee !== 'all') {
      const feeRange = currentFilters.fee;
      filteredGuides = filteredGuides.filter(guide => {
        switch (feeRange) {
          case 'low': return guide.fee < 7000;
          case 'medium': return guide.fee >= 7000 && guide.fee < 9000;
          case 'high': return guide.fee >= 9000;
          default: return true;
        }
      });
    }
    
    // キーワードフィルター
    if (currentFilters.keywords.length > 0) {
      filteredGuides = filteredGuides.filter(guide =>
        currentFilters.keywords.some(keyword =>
          guide.specialty.includes(keyword) ||
          guide.description.includes(keyword)
        )
      );
    }
    
    console.log(`🔍 フィルター適用結果: ${filteredGuides.length}件`);
    
    updateGuideDisplay(filteredGuides);
    updateGuideCounter(filteredGuides.length);
  }
  
  function updateGuideDisplay(guidesToShow = null) {
    const guides = guidesToShow || guideDatabase;
    const container = document.querySelector('#guides-section .row, .guides-container, .guide-cards-container');
    
    if (!container) {
      console.warn('⚠️ ガイド表示コンテナが見つかりません');
      return;
    }
    
    // コンテナをクリア
    container.innerHTML = '';
    
    // ガイドカードを生成
    guides.forEach(guide => {
      const card = createGuideCard(guide);
      container.appendChild(card);
    });
    
    console.log(`📊 ガイド表示更新: ${guides.length}件`);
  }
  
  function createGuideCard(guide) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-md-4 col-sm-6 mb-4';
    cardDiv.setAttribute('data-guide-id', guide.id);
    cardDiv.setAttribute('data-location', guide.location);
    cardDiv.setAttribute('data-languages', guide.languages.join(','));
    cardDiv.setAttribute('data-fee', guide.fee);
    
    cardDiv.innerHTML = `
      <div class="guide-card card h-100 shadow-sm">
        <img src="${guide.image}" class="guide-image card-img-top" alt="${guide.name}" style="height: 250px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${guide.name}</h5>
          <p class="text-muted mb-2">
            <i class="bi bi-geo-alt"></i> ${guide.location}
          </p>
          <p class="text-muted mb-2">
            <i class="bi bi-translate"></i> ${guide.languages.join(', ')}
          </p>
          <p class="card-text text-truncate">${guide.description}</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="rating">
              <span class="text-warning">★★★★★</span>
              <small class="text-muted">(${guide.reviews})</small>
            </div>
            <span class="badge bg-primary">¥${guide.fee.toLocaleString()}</span>
          </div>
          <div class="mb-2">
            ${guide.specialty.map(s => `<span class="badge bg-secondary me-1">${s}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary w-100" onclick="showGuideDetails('${guide.id}')">
            詳細を見る
          </button>
        </div>
      </div>
    `;
    
    return cardDiv;
  }
  
  function updateGuideCounter(count) {
    const counters = document.querySelectorAll('#search-results-counter, #guide-counter, .guide-counter, .results-counter');
    const counterText = `${count}人のガイドが見つかりました`;
    
    counters.forEach(counter => {
      counter.textContent = counterText;
    });
    
    // カウンター要素が見つからない場合は作成
    if (counters.length === 0) {
      createGuideCounter(count);
    }
    
    console.log(`📊 ガイドカウンター更新: ${counterText}`);
  }
  
  function createGuideCounter(count) {
    const counterDiv = document.createElement('div');
    counterDiv.id = 'guide-counter';
    counterDiv.className = 'alert alert-info mb-3';
    counterDiv.textContent = `${count}人のガイドが見つかりました`;
    
    const guidesSection = document.getElementById('guides-section');
    if (guidesSection) {
      guidesSection.insertBefore(counterDiv, guidesSection.firstChild);
    }
  }
  
  function setupContinuousMonitoring() {
    // DOM変更の監視
    const observer = new MutationObserver((mutations) => {
      let shouldFixButtons = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const signUpButtons = node.querySelectorAll('*:contains("Sign Up")');
              if (signUpButtons.length > 0) {
                shouldFixButtons = true;
              }
            }
          });
        }
      });
      
      if (shouldFixButtons) {
        setTimeout(fixRegistrationButtons, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 定期的なボタンチェック（フォールバック）
    setInterval(() => {
      const signUpButtons = document.querySelectorAll('*');
      let needsFix = false;
      
      signUpButtons.forEach(button => {
        if (button.textContent && button.textContent.includes('Sign Up')) {
          needsFix = true;
        }
      });
      
      if (needsFix) {
        fixRegistrationButtons();
      }
    }, 3000);
  }
  
  // 新規ガイド追加機能
  function addNewGuide(guideData) {
    const newGuide = {
      id: `guide_${Date.now()}`,
      name: guideData.name || '新規ガイド',
      location: guideData.location || '未設定',
      languages: guideData.languages || ['日本語'],
      fee: parseInt(guideData.fee) || 6000,
      specialty: guideData.specialty || ['観光'],
      image: guideData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      rating: 5.0,
      reviews: 0,
      description: guideData.description || '新しく登録されたガイドです。',
      registeredAt: new Date().toISOString()
    };
    
    guideDatabase.unshift(newGuide);
    
    // 追加ガイドをローカルストレージに保存
    try {
      const additionalGuides = guideDatabase.slice(5); // 基本の5件以降
      localStorage.setItem('additionalGuides', JSON.stringify(additionalGuides));
    } catch (error) {
      console.error('ガイド保存エラー:', error);
    }
    
    applyFiltersAndUpdateDisplay();
    
    console.log('✅ 新規ガイド追加:', newGuide.name);
    return newGuide;
  }
  
  // グローバル関数の公開
  window.showGuideDetails = function(guideId) {
    const guide = guideDatabase.find(g => g.id === guideId);
    if (guide) {
      console.log('ガイド詳細表示:', guide.name);
      // ここでガイド詳細モーダルを表示
    }
  };
  
  window.addGuide = addNewGuide;
  
  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // ページ表示時の初期化
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadFilterState();
      fixRegistrationButtons();
      applyFiltersAndUpdateDisplay();
    }, 500);
  });
  
})();