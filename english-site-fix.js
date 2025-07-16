/**
 * 英語サイト修正スクリプト
 * ガイドカード表示とフィルターボタン機能の修正
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 英語サイト修正開始');
  
  // 英語サイトかどうかの判定
  const isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en';
  
  if (!isEnglishSite) {
    console.log('日本語サイトなので英語サイト修正をスキップ');
    return;
  }
  
  // 1秒後に修正を実行（他のスクリプトロード後）
  setTimeout(() => {
    fixGuideCards();
    fixFilterButton();
    fixCounterDisplay();
    
    // 定期的な監視と修正
    setInterval(() => {
      fixCounterDisplay();
      ensureGuideCardsVisible();
    }, 3000);
  }, 1000);
});

function fixGuideCards() {
  console.log('📋 ガイドカード修正開始');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.error('ガイドカードコンテナが見つかりません');
    return;
  }
  
  // 常にフォールバックガイドカードを使用（英語サイト専用データ）
  console.log('🌐 英語サイト専用ガイドカードを生成');
  container.innerHTML = '';
  generateFallbackGuideCards(container);
}

function createEnglishGuideCard(guide) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-lg-4 col-md-6';
  
  const cardHTML = `
    <div class="card guide-card h-100" data-fee="${guide.fee}" data-location="${guide.prefecture || guide.location}" data-languages="${guide.languages.join(',')}" data-keywords="${guide.specialties.join(',')}">
      <div class="position-relative">
        <img src="${guide.profileImage || guide.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=250&fit=crop'}" 
             class="card-img-top" alt="${guide.name}" 
             style="height: 250px; object-fit: cover;" 
             onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=250&fit=crop'">
        <div class="price-badge">¥${guide.fee.toLocaleString()}/session</div>
      </div>
      <div class="card-body">
        <h5 class="card-title">${guide.name}</h5>
        <p class="text-muted mb-2">
          <i class="bi bi-geo-alt"></i> ${guide.location}
        </p>
        <p class="card-text small">${getEnglishDescription(guide.description)}</p>
        <div class="mb-3">
          ${guide.languages.map(lang => `<span class="badge bg-primary me-1">${lang}</span>`).join('')}
        </div>
        <div class="mb-3">
          ${guide.specialties.map(specialty => `<span class="badge bg-secondary me-1">${specialty}</span>`).join('')}
        </div>
        <div class="mb-3">
          <span class="text-warning">
            ${'★'.repeat(Math.floor(guide.rating || 4.5))}${'☆'.repeat(5 - Math.floor(guide.rating || 4.5))}
          </span>
          <span class="text-muted ms-1">${(guide.rating || 4.5).toFixed(1)}</span>
        </div>
        <button class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${guide.id}">
          View Details
        </button>
      </div>
    </div>
  `;
  
  colDiv.innerHTML = cardHTML;
  return colDiv;
}

function getEnglishDescription(description) {
  // 既に英語の場合はそのまま返す
  if (typeof description === 'string' && description.length > 0) {
    return description;
  }
  
  const translations = {
    '東京の隠れた名所と美食スポットを案内します。': 'I guide you to Tokyo\'s hidden gems and gourmet spots.',
    '京都の伝統文化と美しい庭園をご紹介します。': 'I introduce Kyoto\'s traditional culture and beautiful gardens.',
    '大阪のグルメと歴史的名所を案内します。': 'I guide you through Osaka\'s gourmet food and historical sites.',
    '沖縄の美しい海と独特の文化を体験できます。': 'Experience Okinawa\'s beautiful seas and unique culture.',
    '北海道の大自然と新鮮な海の幸を楽しめます。': 'Enjoy Hokkaido\'s great nature and fresh seafood.',
    '福岡の食文化と歴史を深く知ることができます。': 'Learn deeply about Fukuoka\'s food culture and history.'
  };
  
  return translations[description] || description || 'A knowledgeable local guide who knows all the charms of the area.';
}

function generateFallbackGuideCards(container) {
  console.log('📦 フォールバック: 基本ガイドカードを生成');
  
  const fallbackGuides = [
    {
      id: 1,
      name: 'Takeshi Yamada',
      location: 'Shibuya, Tokyo',
      prefecture: 'Tokyo',
      languages: ['Japanese', 'English'],
      description: 'Expert Tokyo guide specializing in hidden local gems, authentic cuisine, and vibrant nightlife districts.',
      specialties: ['Gourmet', 'Photo Spots', 'Night Tours'],
      fee: 8000,
      rating: 4.8,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=250&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Hanako Sato',
      location: 'Kyoto City, Kyoto',
      prefecture: 'Kyoto',
      languages: ['Japanese', 'English', 'Chinese'],
      description: 'Traditional culture enthusiast offering authentic temple visits, tea ceremonies, and historical insights.',
      specialties: ['Cultural Sites', 'Traditional Crafts', 'History'],
      fee: 7500,
      rating: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=250&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Hiroshi Tanaka',
      location: 'Namba, Osaka',
      prefecture: 'Osaka',
      languages: ['Japanese', 'English'],
      description: 'Osaka foodie guide with deep knowledge of local street food, markets, and culinary traditions.',
      specialties: ['Gourmet', 'Night Tour', 'Markets'],
      fee: 9000,
      rating: 4.7,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=250&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Yuki Nakamura',
      location: 'Naha, Okinawa',
      prefecture: 'Okinawa',
      languages: ['Japanese', 'English'],
      description: 'Marine life specialist offering snorkeling, diving tours, and unique Okinawan cultural experiences.',
      specialties: ['Marine Activities', 'Cultural Exchange', 'Nature'],
      fee: 12000,
      rating: 4.6,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=250&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Kenji Suzuki',
      location: 'Sapporo, Hokkaido',
      prefecture: 'Hokkaido',
      languages: ['Japanese', 'English'],
      description: 'Outdoor enthusiast showcasing Hokkaido\'s pristine nature, seasonal festivals, and premium seafood.',
      specialties: ['Nature', 'Gourmet', 'Seasonal Tours'],
      fee: 10000,
      rating: 4.8,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=250&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'Akiko Watanabe',
      location: 'Hakata, Fukuoka',
      prefecture: 'Fukuoka',
      languages: ['Japanese', 'English', 'Korean'],
      description: 'Cultural bridge specialist connecting Korean and Japanese traditions through food, festivals, and history.',
      specialties: ['Gourmet', 'History', 'Cultural Exchange'],
      fee: 8500,
      rating: 4.5,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=250&fit=crop&crop=face'
    }
  ];
  
  fallbackGuides.forEach(guide => {
    const guideCard = createEnglishGuideCard(guide);
    container.appendChild(guideCard);
  });
  
  console.log(`✅ ${fallbackGuides.length}枚のフォールバックガイドカードを生成`);
  
  // カウンター即座修正
  setTimeout(() => {
    fixCounterDisplay();
  }, 100);
}

function fixFilterButton() {
  console.log('🔘 フィルターボタン修正開始');
  
  const filterButton = document.getElementById('filterToggleBtn');
  const filterCard = document.getElementById('filter-card');
  
  if (!filterButton || !filterCard) {
    console.error('フィルター要素が見つかりません');
    return;
  }
  
  // 既存のイベントリスナーを削除
  const newButton = filterButton.cloneNode(true);
  filterButton.parentNode.replaceChild(newButton, filterButton);
  
  // 新しいイベントリスナーを追加
  newButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('フィルターボタンがクリックされました');
    
    if (filterCard.classList.contains('d-none')) {
      // フィルターを表示
      filterCard.classList.remove('d-none');
      newButton.innerHTML = '<i class="bi bi-funnel-fill"></i> Hide Filters';
      newButton.classList.remove('btn-outline-primary');
      newButton.classList.add('btn-primary');
      console.log('フィルター表示');
    } else {
      // フィルターを隠す
      filterCard.classList.add('d-none');
      newButton.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
      newButton.classList.remove('btn-primary');
      newButton.classList.add('btn-outline-primary');
      console.log('フィルター非表示');
    }
  });
  
  console.log('✅ フィルターボタン修正完了');
}

function fixCounterDisplay() {
  const container = document.getElementById('guide-cards-container');
  if (!container) return;
  
  const visibleCards = container.querySelectorAll('.guide-card');
  const actualCount = visibleCards.length;
  
  // カウンター要素を更新
  const counters = [
    document.querySelector('#guide-counter'),
    document.querySelector('#guide-count-number-en'),
    document.querySelector('#search-results-counter')
  ];
  
  counters.forEach(counter => {
    if (counter) {
      if (counter.id === 'guide-count-number-en') {
        counter.textContent = actualCount;
      } else if (counter.id === 'guide-counter') {
        counter.innerHTML = `Found <span id="guide-count-number-en">${actualCount}</span> guides`;
      } else {
        counter.textContent = `Found ${actualCount} guides`;
      }
    }
  });
  
  console.log(`📊 カウンター更新: ${actualCount} guides`);
}

function ensureGuideCardsVisible() {
  const container = document.getElementById('guide-cards-container');
  if (!container) return;
  
  const cards = container.querySelectorAll('.guide-card');
  if (cards.length === 0) {
    console.warn('ガイドカードが見つからないため再生成します');
    fixGuideCards();
  }
}

// グローバル関数として公開
window.fixEnglishSite = {
  fixGuideCards,
  fixFilterButton,
  fixCounterDisplay
};