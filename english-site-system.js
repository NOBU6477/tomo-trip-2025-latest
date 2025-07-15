/**
 * 英語サイト専用システム
 * index-en.html でのみ使用される英語関連機能
 */

(function() {
  'use strict';
  
  // 英語サイトでのみ実行
  if (document.documentElement.lang !== 'en' && 
      !window.location.pathname.includes('index-en.html')) {
    return;
  }
  
  console.log('🇺🇸 英語サイト専用システム開始');
  
  // 英語サイト専用の翻訳システム
  function setupEnglishTranslations() {
    // メインコンテンツ
    const mainTitle = document.querySelector('h1');
    if (mainTitle) mainTitle.textContent = 'Your Special Journey Awaits';
    
    const subtitle = document.querySelector('.hero-section p');
    if (subtitle) subtitle.textContent = 'Discover hidden gems with local guides that tourism can\'t reveal';
    
    // ヒーローセクションのボタン
    const heroGuideBtn = document.querySelector('.btn-light.btn-lg');
    if (heroGuideBtn) heroGuideBtn.textContent = 'Find Guides';
    
    const heroContactBtn = document.querySelector('.btn-outline-light.btn-lg');
    if (heroContactBtn) heroContactBtn.textContent = 'Contact Us';
    
    // 右下のボタン
    const sponsorRegBtn = document.querySelector('#sponsorRegisterBtn span');
    if (sponsorRegBtn) sponsorRegBtn.textContent = 'Sponsor Registration 🚀';
    
    const sponsorLoginBtn = document.querySelector('#sponsorLoginBtn span');
    if (sponsorLoginBtn) sponsorLoginBtn.textContent = 'Login ✨';
    
    // 使い方セクション
    const howItWorksH4s = document.querySelectorAll('#how-it-works h4');
    if (howItWorksH4s.length >= 3) {
      howItWorksH4s[0].textContent = 'Register';
      howItWorksH4s[1].textContent = 'Find Guides';
      howItWorksH4s[2].textContent = 'Experience Special Journey';
    }
    
    // 人気のガイドセクション
    const popularGuidesTitle = document.querySelector('#guides h2');
    if (popularGuidesTitle) popularGuidesTitle.textContent = 'Popular Guides';
    
    // ガイド一覧の要素
    const filterButton = document.querySelector('#toggle-filter-button');
    if (filterButton) filterButton.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
    
    const moreButton = document.querySelector('#load-more-guides');
    if (moreButton) moreButton.textContent = 'Show More';
    
    // 検索結果カウンター
    const searchCounter = document.querySelector('#search-results-counter');
    if (searchCounter) {
      searchCounter.textContent = 'Showing 70 guides found';
    }
    
    console.log('✅ 英語サイト翻訳完了');
  }
  
  // 英語サイト専用のガイドカード翻訳
  function translateGuideCardsToEnglish() {
    const guideCards = document.querySelectorAll('.guide-card');
    
    guideCards.forEach((card, index) => {
      // 詳細ボタン
      const detailBtn = card.querySelector('.btn');
      if (detailBtn && detailBtn.textContent.includes('詳細')) {
        detailBtn.textContent = 'See Details';
      }
      
      // 言語バッジ
      const badges = card.querySelectorAll('.badge');
      badges.forEach(badge => {
        const text = badge.textContent.trim();
        if (text === '日本語') badge.textContent = 'Japanese';
        else if (text === '英語') badge.textContent = 'English';
        else if (text === '中国語') badge.textContent = 'Chinese';
        else if (text === '韓国語') badge.textContent = 'Korean';
        else if (text === 'フランス語') badge.textContent = 'French';
      });
      
      // 場所の翻訳
      const location = card.querySelector('.text-muted');
      if (location) {
        let text = location.textContent;
        text = text.replace('東京都', 'Tokyo');
        text = text.replace('京都府', 'Kyoto');
        text = text.replace('大阪府', 'Osaka');
        text = text.replace('渋谷区', 'Shibuya');
        text = text.replace('京都市', 'Kyoto City');
        text = text.replace('大阪市', 'Osaka City');
        location.textContent = text;
      }
    });
    
    console.log('✅ 英語ガイドカード翻訳完了');
  }
  
  // 英語サイト専用のベネフィットカード翻訳
  function translateBenefitCardsToEnglish() {
    const englishTitles = [
      'Your daily life becomes a tourism resource',
      'Welcome tourists as friends', 
      'Efficient work using spare time',
      'Turn your passion into work',
      'Meet people from around the world',
      'Improve and utilize language skills',
      'Deepen your love and pride for your hometown',
      'Reliable support system',
      'Work at your own pace',
      'Contribute to local revitalization'
    ];
    
    const titles = document.querySelectorAll('#guide-benefits h5');
    titles.forEach((title, index) => {
      if (englishTitles[index]) {
        title.textContent = englishTitles[index];
      }
    });
    
    console.log('✅ 英語ベネフィットカード翻訳完了');
  }
  
  // 初期化
  function initialize() {
    setupEnglishTranslations();
    translateGuideCardsToEnglish();
    translateBenefitCardsToEnglish();
    
    // 動的コンテンツの監視
    setTimeout(() => {
      translateGuideCardsToEnglish();
      translateBenefitCardsToEnglish();
    }, 1000);
  }
  
  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();