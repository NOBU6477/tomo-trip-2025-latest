/**
 * 英語サイト ガイド表示修正システム
 * 12ガイド表示の保証と正確なカウンター表示
 */

console.log('🔧 English Guide Display Fix - Loading...');

// 12ガイド表示を強制的に保証
function ensure12GuidesDisplay() {
  console.log('🔧 Ensuring 12 guides display...');
  
  function forceDisplay12Guides() {
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.warn('Guide container not found');
      return;
    }
    
    // 全てのガイドカードを取得
    const allCards = container.querySelectorAll('.col-md-6');
    const visibleCards = container.querySelectorAll('.col-md-6:not([style*="display: none"])');
    
    console.log(`Total cards: ${allCards.length}, Visible cards: ${visibleCards.length}`);
    
    // 12枚未満の場合、隠されているカードを表示
    if (visibleCards.length < 12 && allCards.length >= 12) {
      for (let i = 0; i < Math.min(12, allCards.length); i++) {
        const card = allCards[i];
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.classList.remove('d-none', 'hidden-guide');
      }
      console.log(`✅ Forced display of 12 guides`);
    }
    
    // 12枚以上ある場合、追加カードを隠す
    if (allCards.length > 12) {
      for (let i = 12; i < allCards.length; i++) {
        allCards[i].style.display = 'none';
      }
    }
    
    updateGuideCounter();
  }
  
  // 即座に実行
  forceDisplay12Guides();
  
  // 遅延実行で確実に
  setTimeout(forceDisplay12Guides, 1000);
  setTimeout(forceDisplay12Guides, 3000);
  
  // 定期的にチェック
  setInterval(forceDisplay12Guides, 5000);
}

// ガイドカウンター更新
function updateGuideCounter() {
  const container = document.getElementById('guide-cards-container');
  if (!container) return;
  
  const visibleCards = container.querySelectorAll('.col-md-6:not([style*="display: none"])');
  const actualCount = visibleCards.length;
  
  // カウンター要素を更新
  const counterElements = [
    document.getElementById('guide-count-number'),
    document.querySelector('#guides-count'),
    document.querySelector('.guide-counter span'),
    document.querySelector('#search-results-counter span')
  ];
  
  counterElements.forEach(element => {
    if (element) {
      element.textContent = actualCount;
    }
  });
  
  // カウンターテキスト全体を更新
  const fullCounterElements = [
    document.getElementById('guides-count'),
    document.querySelector('.guide-counter'),
    document.getElementById('search-results-counter')
  ];
  
  fullCounterElements.forEach(element => {
    if (element && element.innerHTML.includes('guides found')) {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${actualCount}</span> guides found`;
    }
  });
  
  console.log(`✅ Updated guide counter to: ${actualCount}`);
}

// 英語ガイドデータの生成
function generateEnglishGuides() {
  console.log('🔧 Generating English guide data...');
  
  const englishGuides = [
    {
      name: "Sarah Johnson",
      location: "Tokyo",
      rating: 4.9,
      price: "¥8,000",
      languages: ["English", "Japanese"],
      specialty: "Cultural Tours",
      description: "Experience authentic Tokyo culture with a local expert. Specializing in hidden temples, traditional districts, and local cuisine discoveries.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b94c?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      location: "Kyoto",
      rating: 4.8,
      price: "¥7,500",
      languages: ["English", "Chinese", "Japanese"],
      specialty: "Historical Sites",
      description: "Discover Kyoto's ancient heritage through centuries-old temples, traditional gardens, and samurai districts with historical insights.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Emma Williams",
      location: "Osaka",
      rating: 4.7,
      price: "¥6,500",
      languages: ["English", "Japanese"],
      specialty: "Food Tours",
      description: "Taste authentic Osaka street food and local specialties. From takoyaki to okonomiyaki, experience the real flavors of Japan's kitchen.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "David Rodriguez",
      location: "Hiroshima",
      rating: 4.9,
      price: "¥9,000",
      languages: ["English", "Spanish", "Japanese"],
      specialty: "Historical Tours",
      description: "Learn about Hiroshima's powerful history and peaceful present. Includes Peace Memorial Park and local cultural experiences.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Lisa Thompson",
      location: "Hokkaido",
      rating: 4.8,
      price: "¥8,500",
      languages: ["English", "Japanese"],
      specialty: "Nature Tours",
      description: "Explore Hokkaido's stunning natural beauty including hot springs, wildlife, and seasonal attractions like snow festivals.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "James Park",
      location: "Okinawa",
      rating: 4.6,
      price: "¥7,000",
      languages: ["English", "Korean", "Japanese"],
      specialty: "Beach & Culture",
      description: "Experience Okinawa's unique Ryukyu culture, pristine beaches, and traditional crafts with a local cultural expert.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Maria Garcia",
      location: "Nagoya",
      rating: 4.7,
      price: "¥7,200",
      languages: ["English", "Spanish", "Japanese"],
      specialty: "Modern Culture",
      description: "Discover modern Japan through technology museums, anime culture, and contemporary architecture in central Japan.",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Robert Kim",
      location: "Fukuoka",
      rating: 4.5,
      price: "¥6,800",
      languages: ["English", "Korean", "Japanese"],
      specialty: "Local Life",
      description: "Experience daily life in Fukuoka with visits to local markets, traditional crafts workshops, and community experiences.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Sophie Martin",
      location: "Kanazawa",
      rating: 4.8,
      price: "¥8,200",
      languages: ["English", "French", "Japanese"],
      specialty: "Arts & Crafts",
      description: "Explore traditional Japanese arts including gold leaf production, samurai districts, and beautiful Kenroku-en Garden.",
      image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Thomas Anderson",
      location: "Sendai",
      rating: 4.6,
      price: "¥7,800",
      languages: ["English", "Japanese"],
      specialty: "Nature & History",
      description: "Combine natural beauty with historical significance through Tohoku region's castles, temples, and scenic landscapes.",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Anna Petrov",
      location: "Nara",
      rating: 4.9,
      price: "¥7,500",
      languages: ["English", "Russian", "Japanese"],
      specialty: "Wildlife & Temples",
      description: "Meet the famous deer of Nara Park and explore ancient temples including the magnificent Todaiji Temple.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Kevin O'Connor",
      location: "Kobe",
      rating: 4.7,
      price: "¥8,800",
      languages: ["English", "Japanese"],
      specialty: "Cuisine & Views",
      description: "Experience world-famous Kobe beef and stunning harbor views from Mount Rokko with a local food and culture expert.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face"
    }
  ];
  
  return englishGuides;
}

// ガイドカードHTML生成
function createGuideCardHTML(guide, index) {
  return `
    <div class="col-md-6 mb-4">
      <div class="card h-100 shadow-sm guide-card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div class="guide-actions">
            <button class="btn btn-sm btn-outline-warning bookmark-btn" title="Bookmark this guide">
              <i class="bi bi-star"></i>
            </button>
            <button class="btn btn-sm btn-outline-success compare-btn ms-1" title="Add to comparison">
              <i class="bi bi-check-square"></i>
            </button>
          </div>
          <span class="badge bg-primary">${guide.rating} ★</span>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center mb-3">
            <img src="${guide.image}" alt="${guide.name}" class="rounded-circle me-3" style="width: 60px; height: 60px; object-fit: cover;">
            <div>
              <h5 class="card-title mb-1">${guide.name}</h5>
              <p class="text-muted mb-0">
                <i class="bi bi-geo-alt-fill me-1"></i>${guide.location}
              </p>
            </div>
          </div>
          <p class="card-text mb-3">${guide.description}</p>
          <div class="mb-3">
            <small class="text-muted">Languages:</small><br>
            ${guide.languages.map(lang => `<span class="badge bg-light text-dark me-1">${lang}</span>`).join('')}
          </div>
          <div class="mb-3">
            <small class="text-muted">Specialty:</small><br>
            <span class="badge bg-info">${guide.specialty}</span>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <span class="h5 mb-0 text-primary">${guide.price}/day</span>
          <button class="btn btn-primary" onclick="showGuideDetails(${index})">See Details</button>
        </div>
      </div>
    </div>
  `;
}

// ガイドコンテナにカードを挿入
function insertGuideCards() {
  console.log('🔧 Inserting guide cards...');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.warn('Guide container not found');
    return;
  }
  
  const guides = generateEnglishGuides();
  const cardsHTML = guides.map((guide, index) => createGuideCardHTML(guide, index)).join('');
  
  container.innerHTML = cardsHTML;
  
  console.log(`✅ Inserted ${guides.length} guide cards`);
  updateGuideCounter();
}

// フィルター機能の修正
function fixFilterFunctionality() {
  console.log('🔧 Fixing filter functionality...');
  
  // フィルターリセット関数
  function resetFilters() {
    // フィルター要素をリセット
    const filterElements = [
      document.getElementById('prefecture-filter'),
      document.getElementById('language-filter'),
      document.getElementById('price-filter'),
      document.getElementById('custom-keywords')
    ];
    
    filterElements.forEach(element => {
      if (element) {
        if (element.tagName === 'SELECT') {
          element.selectedIndex = 0;
          element.value = '';
        } else if (element.tagName === 'INPUT') {
          element.value = '';
        }
      }
    });
    
    // チェックボックスをリセット
    const checkboxes = document.querySelectorAll('.keyword-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // 全てのガイドを表示
    ensure12GuidesDisplay();
    
    console.log('✅ Filters reset successfully');
  }
  
  // グローバルに公開
  window.resetFilters = resetFilters;
  
  // フィルターボタンの動作
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', function() {
      const filterCard = document.getElementById('filter-card');
      if (filterCard) {
        filterCard.classList.toggle('d-none');
      }
    });
  }
}

// スクロール機能修正
function fixScrollFunctionality() {
  console.log('🔧 Fixing scroll functionality...');
  
  // ボディとHTMLのスクロール設定
  document.body.style.overflow = 'auto';
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflow = 'auto';
  document.documentElement.style.overflowY = 'auto';
  
  // modal-openクラスを除去
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
  
  // 固定ポジションの解除
  document.body.style.position = '';
  document.body.style.top = '';
  
  console.log('✅ Scroll functionality restored');
}

// メイン初期化関数
function initializeEnglishGuideDisplay() {
  console.log('🔧 Initializing English Guide Display Fix...');
  
  // 順次実行
  setTimeout(() => {
    insertGuideCards();
    fixFilterFunctionality();
    fixScrollFunctionality();
    ensure12GuidesDisplay();
  }, 500);
  
  console.log('✅ English Guide Display Fix initialized');
}

// DOM読み込み完了時に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnglishGuideDisplay);
} else {
  initializeEnglishGuideDisplay();
}

// 外部から呼び出し可能な関数をグローバルに公開
window.englishGuideDisplayFix = {
  ensure12GuidesDisplay,
  updateGuideCounter,
  generateEnglishGuides,
  insertGuideCards,
  fixFilterFunctionality,
  fixScrollFunctionality,
  initializeEnglishGuideDisplay
};

console.log('✅ English Guide Display Fix Script Loaded');