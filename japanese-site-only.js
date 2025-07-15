/**
 * 日本語サイト専用スクリプト
 * 英語サイトとの完全分離により干渉を防止
 */

(function() {
  'use strict';
  
  // 日本語サイトのみで実行されることを確認
  if (document.documentElement.lang !== 'ja' && 
      !window.location.pathname.includes('index.html') &&
      window.location.pathname !== '/') {
    console.log('🚫 日本語サイト以外では実行しません');
    return;
  }
  
  console.log('🇯🇵 日本語サイト専用スクリプト開始');
  
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
    
    // 日本語サイト専用の初期化
    initializeJapaneseSite();
    
    // フィルター機能の設定
    setupJapaneseFilters();
    
    // ガイドデータの読み込み
    loadJapaneseGuideData();
    
    // 継続監視
    startJapaneseMonitoring();
    
    console.log('✅ 日本語サイト初期化完了');
  }
  
  function initializeJapaneseSite() {
    // 新規登録ボタンの日本語確保
    fixRegistrationButtonsJapanese();
    
    // ナビゲーションの日本語確保
    ensureJapaneseNavigation();
    
    // 英語サイトへのリンクのみ保持
    maintainLanguageSwitcher();
  }
  
  function fixRegistrationButtonsJapanese() {
    // 日本語サイト内の英語テキストを修正
    const textReplacements = [
      { search: /Sign Up/g, replace: '新規登録' },
      { search: /Register/g, replace: '新規登録' },
      { search: /Login/g, replace: 'ログイン' },
      { search: /Home/g, replace: 'ホーム' }
    ];
    
    const elements = document.querySelectorAll('button, a, .btn, .nav-link');
    elements.forEach(element => {
      let originalText = element.textContent;
      textReplacements.forEach(replacement => {
        if (replacement.search.test(originalText)) {
          element.textContent = originalText.replace(replacement.search, replacement.replace);
          console.log(`🔄 日本語修正: ${originalText} → ${element.textContent}`);
        }
      });
    });
  }
  
  function ensureJapaneseNavigation() {
    // ナビゲーション要素の日本語確保
    const navItems = {
      'Home': 'ホーム',
      'Find Guides': 'ガイドを探す', 
      'How it Works': '使い方',
      'Contact': 'お問い合わせ'
    };
    
    document.querySelectorAll('.nav-link').forEach(link => {
      Object.keys(navItems).forEach(english => {
        if (link.textContent.trim() === english) {
          link.textContent = navItems[english];
        }
      });
    });
  }
  
  function maintainLanguageSwitcher() {
    // 言語切り替えボタンは機能を保持
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
      languageDropdown.textContent = '日本語';
    }
    
    // English リンクは保持（切り替え用）
    const englishLink = document.querySelector('a[href="index-en.html"]');
    if (englishLink) {
      englishLink.textContent = 'English';
    }
  }
  
  function setupJapaneseFilters() {
    // 日本語サイト専用のフィルター設定
    const filterElements = {
      location: document.querySelector('#location-filter, [name="location"]'),
      language: document.querySelector('#language-filter, [name="language"]'),
      fee: document.querySelector('#fee-filter, [name="fee"]')
    };
    
    Object.keys(filterElements).forEach(type => {
      const element = filterElements[type];
      if (element) {
        element.addEventListener('change', function(event) {
          handleJapaneseFilterChange(type, event.target.value);
        });
        console.log(`🔧 日本語フィルター設定: ${type}`);
      }
    });
  }
  
  function handleJapaneseFilterChange(filterType, value) {
    currentFilters[filterType] = value;
    console.log(`🔄 日本語フィルター変更: ${filterType} = ${value}`);
    
    // フィルター適用
    applyJapaneseFilters();
    
    // 状態保存
    localStorage.setItem('japaneseFilters', JSON.stringify(currentFilters));
  }
  
  function applyJapaneseFilters() {
    const filteredGuides = guideDatabase.filter(guide => {
      // 場所フィルター
      if (currentFilters.location !== 'all' && 
          guide.location !== currentFilters.location) {
        return false;
      }
      
      // 言語フィルター  
      if (currentFilters.language !== 'all' && 
          !guide.languages.includes(currentFilters.language)) {
        return false;
      }
      
      // 料金フィルター
      if (currentFilters.fee !== 'all') {
        const feeValue = parseInt(guide.fee);
        if (currentFilters.fee === 'low' && feeValue > 8000) return false;
        if (currentFilters.fee === 'medium' && (feeValue < 8000 || feeValue > 15000)) return false;
        if (currentFilters.fee === 'high' && feeValue < 15000) return false;
      }
      
      return true;
    });
    
    updateJapaneseGuideDisplay(filteredGuides);
    updateJapaneseCounter(filteredGuides.length);
  }
  
  function loadJapaneseGuideData() {
    // 日本語サイト用のガイドデータ読み込み
    const savedGuides = localStorage.getItem('allGuides');
    if (savedGuides) {
      try {
        guideDatabase = JSON.parse(savedGuides);
        console.log(`📊 日本語ガイドデータ読み込み: ${guideDatabase.length}件`);
      } catch (e) {
        console.error('ガイドデータ読み込みエラー:', e);
        initializeDefaultGuides();
      }
    } else {
      initializeDefaultGuides();
    }
    
    // 初期表示
    applyJapaneseFilters();
  }
  
  function initializeDefaultGuides() {
    // デフォルトガイドデータの設定
    guideDatabase = [
      {
        id: 1,
        name: '田中 博',
        location: '東京',
        languages: ['日本語', '英語'],
        fee: 8000,
        specialty: '歴史ガイド',
        rating: 4.8
      },
      {
        id: 2, 
        name: '佐藤 美香',
        location: '京都',
        languages: ['日本語', '英語', '中国語'],
        fee: 12000,
        specialty: '文化体験',
        rating: 4.9
      },
      {
        id: 3,
        name: '鈴木 健太',
        location: '大阪',
        languages: ['日本語', '英語'],
        fee: 10000,
        specialty: 'グルメツアー',
        rating: 4.7
      },
      {
        id: 4,
        name: '高橋 さくら',
        location: '広島',
        languages: ['日本語', '英語'],
        fee: 9000,
        specialty: '平和学習',
        rating: 4.8
      },
      {
        id: 5,
        name: '渡辺 雄一',
        location: '沖縄',
        languages: ['日本語', '英語'],
        fee: 11000,
        specialty: '自然ガイド',
        rating: 4.9
      }
    ];
    
    localStorage.setItem('allGuides', JSON.stringify(guideDatabase));
    console.log('📊 デフォルトガイドデータ初期化完了');
  }
  
  function updateJapaneseGuideDisplay(guides) {
    const container = document.querySelector('#guides-section .row, .guides-container, .guide-cards-container');
    if (!container) {
      console.warn('⚠️ ガイド表示コンテナが見つかりません');
      return;
    }
    
    // 既存のガイドカードをクリア
    const existingCards = container.querySelectorAll('.guide-card, .col-md-4');
    existingCards.forEach(card => card.remove());
    
    // ガイドカードを作成
    guides.forEach(guide => {
      const card = createJapaneseGuideCard(guide);
      container.appendChild(card);
    });
    
    console.log(`📊 日本語ガイド表示更新: ${guides.length}件`);
  }
  
  function createJapaneseGuideCard(guide) {
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-4 mb-4';
    
    cardCol.innerHTML = `
      <div class="card guide-card h-100" data-guide-id="${guide.id}">
        <div class="card-body">
          <h5 class="card-title">${guide.name}</h5>
          <p class="card-text">
            <small class="text-muted">📍 ${guide.location}</small><br>
            <small class="text-muted">💬 ${guide.languages.join(', ')}</small><br>
            <small class="text-muted">⭐ ${guide.rating}/5.0</small>
          </p>
          <p class="card-text">${guide.specialty}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-primary fw-bold">¥${guide.fee.toLocaleString()}/回</span>
            <button class="btn btn-primary btn-sm" onclick="viewGuideDetails(${guide.id})">
              詳細を見る
            </button>
          </div>
        </div>
      </div>
    `;
    
    return cardCol;
  }
  
  function updateJapaneseCounter(count) {
    const counterElements = document.querySelectorAll('#search-results-counter, .guide-counter, [id*="counter"]');
    const counterText = `${count}人のガイドが見つかりました`;
    
    counterElements.forEach(counter => {
      counter.textContent = counterText;
    });
    
    console.log(`📊 日本語カウンター更新: ${counterText}`);
  }
  
  function startJapaneseMonitoring() {
    // 日本語サイト専用の監視システム
    setInterval(() => {
      // 英語テキストの混入をチェック
      fixRegistrationButtonsJapanese();
      
      // フィルター状態の保護
      const savedFilters = localStorage.getItem('japaneseFilters');
      if (savedFilters) {
        try {
          const filters = JSON.parse(savedFilters);
          Object.keys(filters).forEach(type => {
            const element = document.querySelector(`#${type}-filter, [name="${type}"]`);
            if (element && element.value !== filters[type]) {
              element.value = filters[type];
              currentFilters[type] = filters[type];
            }
          });
        } catch (e) {
          // ignore
        }
      }
    }, 3000); // 3秒間隔
    
    console.log('🔍 日本語サイト監視開始');
  }
  
  // グローバル関数の露出（日本語サイト専用）
  window.viewGuideDetails = function(guideId) {
    console.log(`🔍 ガイド詳細表示: ${guideId}`);
    // 詳細表示ロジック
  };
  
  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();