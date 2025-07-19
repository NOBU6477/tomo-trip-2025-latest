/**
 * 英語サイト完全修復システム
 * 日本語と英語の混在表示を完全に英語化
 */

console.log('🇺🇸 英語サイト完全修復システム開始');

// 完全英語化システム
function completeEnglishSiteFix() {
  console.log('🔧 英語サイト完全英語化実行中...');
  
  // 1. ガイドカウンターの英語化
  fixGuideCounter();
  
  // 2. ガイドカード内容の英語化
  fixGuideCards();
  
  // 3. フィルターボタンの英語化
  fixFilterButtons();
  
  // 4. 右側ボタンの表示確認
  fixSideButtons();
  
  // 5. 英語専用ガイドデータの注入
  injectEnglishGuideData();
  
  console.log('✅ 英語サイト完全英語化完了');
}

function fixGuideCounter() {
  console.log('🔧 ガイドカウンター英語化中...');
  
  // 日本語カウンターを検索して英語化
  const counterSelectors = [
    '.alert-info',
    '#search-results-counter',
    '[style*="background-color: rgb(102, 126, 234)"]'
  ];
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.textContent.includes('人のガイド') || element.textContent.includes('見つかりました')) {
        const count = element.textContent.match(/\d+/);
        if (count) {
          element.textContent = `Found ${count[0]} guides (${count[0]} displayed)`;
        }
      }
    });
  });
  
  // 動的に生成される要素の監視
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const textContent = node.textContent || '';
            if (textContent.includes('人のガイド') || textContent.includes('見つかりました')) {
              const count = textContent.match(/\d+/);
              if (count) {
                node.textContent = `Found ${count[0]} guides (${count[0]} displayed)`;
              }
            }
          }
        });
      }
      if (mutation.type === 'characterData') {
        const textContent = mutation.target.textContent || '';
        if (textContent.includes('人のガイド') || textContent.includes('見つかりました')) {
          const count = textContent.match(/\d+/);
          if (count) {
            mutation.target.textContent = `Found ${count[0]} guides (${count[0]} displayed)`;
          }
        }
      }
    });
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    characterData: true 
  });
  
  console.log('✅ ガイドカウンター英語化完了');
}

function fixGuideCards() {
  console.log('🔧 ガイドカード英語化中...');
  
  // 英語ガイドデータ
  const englishGuides = [
    {
      name: "Sarah Johnson",
      location: "Tokyo",
      description: "Expert guide specializing in Tokyo's traditional culture and modern attractions.",
      languages: ["English", "Japanese"],
      rating: 4.9,
      fee: 8000
    },
    {
      name: "Michael Chen",
      location: "Kyoto",
      description: "Specialist in Kyoto's temple culture and traditional gardens with 15 years of experience.",
      languages: ["English", "Chinese"],
      rating: 4.8,
      fee: 9000
    },
    {
      name: "Emma Williams",
      location: "Osaka",
      description: "Food culture expert offering authentic Osaka culinary experiences.",
      languages: ["English", "French"],
      rating: 4.7,
      fee: 7500
    },
    {
      name: "David Kim",
      location: "Hiroshima",
      description: "History specialist focusing on peace memorial sites and local culture.",
      languages: ["English", "Korean"],
      rating: 4.9,
      fee: 8500
    },
    {
      name: "Lisa Garcia",
      location: "Fukuoka",
      description: "Local lifestyle guide showcasing hidden gems and local experiences.",
      languages: ["English", "Spanish"],
      rating: 4.6,
      fee: 7000
    },
    {
      name: "Robert Taylor",
      location: "Nara",
      description: "Nature and wildlife guide specializing in deer park and temple visits.",
      languages: ["English", "German"],
      rating: 4.8,
      fee: 8000
    },
    {
      name: "Amanda Brown",
      location: "Yokohama",
      description: "Modern city culture and shopping district specialist.",
      languages: ["English", "Japanese"],
      rating: 4.7,
      fee: 7500
    },
    {
      name: "James Wilson",
      location: "Kobe",
      description: "Port city culture and beef cuisine specialist with local connections.",
      languages: ["English", "Italian"],
      rating: 4.9,
      fee: 9500
    },
    {
      name: "Sophie Martin",
      location: "Nagoya",
      description: "Traditional crafts and industrial heritage tour specialist.",
      languages: ["English", "French"],
      rating: 4.6,
      fee: 7000
    },
    {
      name: "Alex Thompson",
      location: "Sendai",
      description: "Nature and hot springs specialist in the Tohoku region.",
      languages: ["English", "Japanese"],
      rating: 4.8,
      fee: 8000
    },
    {
      name: "Maria Rodriguez",
      location: "Sapporo",
      description: "Winter sports and Hokkaido cuisine specialist.",
      languages: ["English", "Spanish"],
      rating: 4.7,
      fee: 8500
    },
    {
      name: "Daniel Lee",
      location: "Okinawa",
      description: "Beach culture and traditional Ryukyu heritage specialist.",
      languages: ["English", "Korean"],
      rating: 4.9,
      fee: 9000
    }
  ];
  
  // 既存のガイドカードを英語データで置換
  const guideCards = document.querySelectorAll('.guide-card');
  guideCards.forEach((card, index) => {
    if (englishGuides[index]) {
      const guide = englishGuides[index];
      
      // 名前の更新
      const nameElement = card.querySelector('h5, .card-title');
      if (nameElement) nameElement.textContent = guide.name;
      
      // 場所の更新
      const locationElement = card.querySelector('.text-muted');
      if (locationElement) locationElement.textContent = guide.location;
      
      // 説明の更新
      const descElement = card.querySelector('p');
      if (descElement && !descElement.classList.contains('text-muted')) {
        descElement.textContent = guide.description;
      }
      
      // 言語バッジの更新
      const badges = card.querySelectorAll('.badge');
      badges.forEach((badge, i) => {
        if (guide.languages[i]) {
          badge.textContent = guide.languages[i];
        }
      });
      
      // 料金の更新
      const feeElement = card.querySelector('.price-badge, [class*="price"]');
      if (feeElement) feeElement.textContent = `¥${guide.fee.toLocaleString()}`;
      
      // 評価の更新
      const ratingElement = card.querySelector('[class*="rating"], .badge-primary');
      if (ratingElement) ratingElement.textContent = `${guide.rating}★`;
      
      // 詳細ボタンの英語化
      const detailBtn = card.querySelector('.btn');
      if (detailBtn) detailBtn.textContent = 'View Details';
    }
  });
  
  console.log('✅ ガイドカード英語化完了');
}

function fixFilterButtons() {
  console.log('🔧 フィルターボタン英語化中...');
  
  // フィルターボタンの英語化
  const filterGuideBtn = document.querySelector('#filterToggleBtn, [id*="filter"]');
  if (filterGuideBtn) {
    filterGuideBtn.innerHTML = '<i class="bi bi-funnel"></i> Filter Guide';
  }
  
  const applyFiltersBtn = document.querySelector('#apply-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.innerHTML = '<i class="bi bi-search"></i> Search';
  }
  
  const resetFiltersBtn = document.querySelector('#reset-filters');
  if (resetFiltersBtn) {
    resetFiltersBtn.textContent = 'Reset';
  }
  
  console.log('✅ フィルターボタン英語化完了');
}

function fixSideButtons() {
  console.log('🔧 サイドボタン表示確認中...');
  
  // 協賛店ボタンの確認と調整
  const sponsorButtons = document.querySelector('.sponsor-mini-buttons');
  if (sponsorButtons) {
    sponsorButtons.style.display = 'flex';
    sponsorButtons.style.position = 'fixed';
    sponsorButtons.style.top = '100px';
    sponsorButtons.style.right = '20px';
    sponsorButtons.style.zIndex = '1050';
  }
  
  // 右側ガイドボタンの確認と調整
  const guideButton = document.querySelector('.fixed-guide-button');
  if (guideButton) {
    guideButton.style.display = 'block';
    guideButton.style.position = 'fixed';
    guideButton.style.right = '20px';
    guideButton.style.top = '50%';
    guideButton.style.transform = 'translateY(-50%)';
    guideButton.style.zIndex = '1040';
  }
  
  console.log('✅ サイドボタン表示確認完了');
}

function injectEnglishGuideData() {
  console.log('🔧 英語専用ガイドデータ注入中...');
  
  // グローバルな英語ガイドデータを設定
  window.englishGuideData = {
    guides: [
      {
        id: 1,
        name: "Sarah Johnson",
        location: "Tokyo",
        description: "Expert guide specializing in Tokyo's traditional culture and modern attractions. Join me for an unforgettable journey through the heart of Japan's capital.",
        languages: ["English", "Japanese"],
        rating: 4.9,
        fee: 8000,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 2,
        name: "Michael Chen",
        location: "Kyoto",
        description: "Specialist in Kyoto's temple culture and traditional gardens with 15 years of experience. Discover the spiritual heart of ancient Japan.",
        languages: ["English", "Chinese"],
        rating: 4.8,
        fee: 9000,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 3,
        name: "Emma Williams",
        location: "Osaka",
        description: "Food culture expert offering authentic Osaka culinary experiences. Taste the real flavors of Japan's kitchen.",
        languages: ["English", "French"],
        rating: 4.7,
        fee: 7500,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 4,
        name: "David Kim",
        location: "Hiroshima",
        description: "History specialist focusing on peace memorial sites and local culture. Experience meaningful historical narratives.",
        languages: ["English", "Korean"],
        rating: 4.9,
        fee: 8500,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 5,
        name: "Lisa Garcia",
        location: "Fukuoka",
        description: "Local lifestyle guide showcasing hidden gems and local experiences. Discover the authentic side of Kyushu.",
        languages: ["English", "Spanish"],
        rating: 4.6,
        fee: 7000,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 6,
        name: "Robert Taylor",
        location: "Nara",
        description: "Nature and wildlife guide specializing in deer park and temple visits. Connect with Japan's natural heritage.",
        languages: ["English", "German"],
        rating: 4.8,
        fee: 8000,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 7,
        name: "Amanda Brown",
        location: "Yokohama",
        description: "Modern city culture and shopping district specialist. Experience contemporary Japan at its finest.",
        languages: ["English", "Japanese"],
        rating: 4.7,
        fee: 7500,
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 8,
        name: "James Wilson",
        location: "Kobe",
        description: "Port city culture and beef cuisine specialist with local connections. Taste world-famous Kobe beef and explore maritime heritage.",
        languages: ["English", "Italian"],
        rating: 4.9,
        fee: 9500,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 9,
        name: "Sophie Martin",
        location: "Nagoya",
        description: "Traditional crafts and industrial heritage tour specialist. Discover Japan's manufacturing heart and artisan traditions.",
        languages: ["English", "French"],
        rating: 4.6,
        fee: 7000,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 10,
        name: "Alex Thompson",
        location: "Sendai",
        description: "Nature and hot springs specialist in the Tohoku region. Relax in natural thermal springs and explore scenic landscapes.",
        languages: ["English", "Japanese"],
        rating: 4.8,
        fee: 8000,
        image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 11,
        name: "Maria Rodriguez",
        location: "Sapporo",
        description: "Winter sports and Hokkaido cuisine specialist. Experience snow festivals and premium seafood in Japan's northern paradise.",
        languages: ["English", "Spanish"],
        rating: 4.7,
        fee: 8500,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
      },
      {
        id: 12,
        name: "Daniel Lee",
        location: "Okinawa",
        description: "Beach culture and traditional Ryukyu heritage specialist. Explore tropical paradise and unique island culture.",
        languages: ["English", "Korean"],
        rating: 4.9,
        fee: 9000,
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face"
      }
    ]
  };
  
  console.log('✅ 英語専用ガイドデータ注入完了');
}

// 継続的な監視システム
function setupContinuousMonitoring() {
  console.log('🔧 継続監視システム開始');
  
  // 5秒ごとの日本語テキスト検出と修正
  setInterval(() => {
    // 日本語カウンターの検出と修正
    const bodyText = document.body.textContent;
    if (bodyText.includes('人のガイド') || bodyText.includes('見つかりました')) {
      console.log('⚠️ 日本語テキスト検出 - 再修正実行');
      fixGuideCounter();
      fixGuideCards();
    }
  }, 5000);
  
  // DOM変更の監視
  const observer = new MutationObserver((mutations) => {
    let needsFix = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const text = mutation.target.textContent || '';
        if (text.includes('人のガイド') || text.includes('見つかりました')) {
          needsFix = true;
        }
      }
    });
    
    if (needsFix) {
      setTimeout(() => {
        fixGuideCounter();
        fixGuideCards();
      }, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  
  console.log('✅ 継続監視システム開始完了');
}

// 初期化と実行
document.addEventListener('DOMContentLoaded', function() {
  console.log('🇺🇸 英語サイト完全修復システム初期化');
  
  // 初期修復実行
  setTimeout(completeEnglishSiteFix, 1000);
  setTimeout(completeEnglishSiteFix, 3000);
  setTimeout(completeEnglishSiteFix, 5000);
  
  // 継続監視開始
  setupContinuousMonitoring();
});

// 即座に実行
completeEnglishSiteFix();

console.log('✅ 英語サイト完全修復システム読み込み完了');

// グローバル関数として公開
window.englishSiteCompleteFix = {
  fix: completeEnglishSiteFix,
  fixGuideCounter: fixGuideCounter,
  fixGuideCards: fixGuideCards,
  fixFilterButtons: fixFilterButtons,
  fixSideButtons: fixSideButtons,
  injectEnglishGuideData: injectEnglishGuideData
};