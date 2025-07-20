/**
 * 英語サイト専用ガイドシステム - 完全版
 */

console.log('🔧 English Guide System (Fixed) Loading...');

// 英語ガイド専用データ（12人）
const englishGuides = [
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    location: 'Tokyo',
    languages: ['English', 'Japanese'],
    rating: 4.9,
    fee: 8000,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b6d7fb94?w=300&h=300&fit=crop',
    specialties: ['Culture', 'History', 'Food'],
    description: 'Tokyo native guide specializing in hidden local spots and cultural experiences. Join me for an authentic journey through Japan\'s capital.',
    verified: true
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    location: 'Kyoto',
    languages: ['English', 'Chinese', 'Japanese'],
    rating: 4.8,
    fee: 7500,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    specialties: ['Temples', 'Gardens', 'Traditional Arts'],
    description: 'Kyoto temple expert with deep knowledge of traditional Japanese culture and garden design.',
    verified: true
  },
  {
    id: 'emma-williams',
    name: 'Emma Williams',
    location: 'Osaka',
    languages: ['English', 'Japanese'],
    rating: 4.7,
    fee: 9000,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    specialties: ['Food', 'Night Life', 'Local Markets'],
    description: 'Osaka food culture specialist. Discover the best street food and hidden gems in Japan\'s kitchen.',
    verified: true
  },
  {
    id: 'david-martinez',
    name: 'David Martinez',
    location: 'Hiroshima',
    languages: ['English', 'Spanish', 'Japanese'],
    rating: 4.6,
    fee: 6500,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    specialties: ['History', 'Peace Memorial', 'Island Tours'],
    description: 'Hiroshima history guide specializing in peace education and Miyajima island experiences.',
    verified: true
  },
  {
    id: 'lisa-brown',
    name: 'Lisa Brown',
    location: 'Yokohama',
    languages: ['English', 'Japanese'],
    rating: 4.8,
    fee: 7200,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    specialties: ['Modern Architecture', 'Harbor Views', 'Shopping'],
    description: 'Yokohama waterfront expert. Experience the perfect blend of modern Japan and historic charm.',
    verified: true
  },
  {
    id: 'james-wilson',
    name: 'James Wilson',
    location: 'Nara',
    languages: ['English', 'Japanese'],
    rating: 4.9,
    fee: 6800,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    specialties: ['Ancient Temples', 'Deer Park', 'Traditional Crafts'],
    description: 'Nara ancient capital specialist. Meet the famous deer and explore Japan\'s first permanent capital.',
    verified: true
  },
  {
    id: 'anna-garcia',
    name: 'Anna Garcia',
    location: 'Fukuoka',
    languages: ['English', 'Spanish', 'Japanese'],
    rating: 4.7,
    fee: 7800,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop',
    specialties: ['Local Cuisine', 'Beach Activities', 'Hot Springs'],
    description: 'Kyushu region expert specializing in local cuisine and natural hot springs experiences.',
    verified: true
  },
  {
    id: 'robert-thompson',
    name: 'Robert Thompson',
    location: 'Sendai',
    languages: ['English', 'Japanese'],
    rating: 4.5,
    fee: 6200,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f95?w=300&h=300&fit=crop',
    specialties: ['Nature Tours', 'Hiking', 'Seasonal Activities'],
    description: 'Tohoku nature guide. Experience authentic Japanese countryside and seasonal beauty.',
    verified: true
  },
  {
    id: 'maria-rodriguez',
    name: 'Maria Rodriguez',
    location: 'Sapporo',
    languages: ['English', 'Spanish', 'Japanese'],
    rating: 4.8,
    fee: 8500,
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop',
    specialties: ['Winter Sports', 'Local Beer', 'Snow Festival'],
    description: 'Hokkaido winter specialist. Enjoy snow activities, local brewery tours, and seasonal festivals.',
    verified: true
  },
  {
    id: 'kevin-lee',
    name: 'Kevin Lee',
    location: 'Nagoya',
    languages: ['English', 'Korean', 'Japanese'],
    rating: 4.6,
    fee: 7000,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop',
    specialties: ['Technology', 'Modern Industry', 'Traditional Crafts'],
    description: 'Central Japan specialist focusing on the blend of traditional crafts and modern technology.',
    verified: true
  },
  {
    id: 'sophie-martin',
    name: 'Sophie Martin',
    location: 'Kanazawa',
    languages: ['English', 'French', 'Japanese'],
    rating: 4.9,
    fee: 8200,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    specialties: ['Traditional Gardens', 'Gold Leaf', 'Cultural Heritage'],
    description: 'Kanazawa cultural heritage expert. Explore traditional gardens, gold leaf crafts, and historic districts.',
    verified: true
  },
  {
    id: 'daniel-anderson',
    name: 'Daniel Anderson',
    location: 'Okinawa',
    languages: ['English', 'Japanese'],
    rating: 4.7,
    fee: 9500,
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop',
    specialties: ['Beach Activities', 'Marine Sports', 'Island Culture'],
    description: 'Okinawa island specialist. Experience tropical paradise with unique Ryukyu culture and pristine beaches.',
    verified: true
  }
];

class EnglishGuideSystemFixed {
  constructor() {
    this.guides = englishGuides;
    this.filteredGuides = englishGuides;
    this.displayedGuides = [];
    console.log(`✅ English Guide System initialized with ${this.guides.length} guides`);
  }

  // 初期化
  init() {
    this.displayAllGuides();
    this.setupEventListeners();
    this.updateCounter();
    console.log('✅ English Guide System fully initialized');
  }

  // 全ガイド表示
  displayAllGuides() {
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.error('❌ Guide container not found');
      return;
    }

    this.displayedGuides = this.guides;
    container.innerHTML = this.guides.map(guide => this.generateGuideCard(guide)).join('');
    this.updateCounter();
    
    console.log(`✅ Displayed ${this.guides.length} English guides`);
  }

  // ガイドカード生成
  generateGuideCard(guide) {
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card guide-card h-100">
          <img src="${guide.image}" class="card-img-top" alt="${guide.name}" style="height: 250px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-primary">¥${guide.fee.toLocaleString()}/session</span>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${guide.name}</h5>
            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt-fill me-1"></i>${guide.location}
            </p>
            <p class="card-text flex-grow-1">${guide.description}</p>
            <div class="mb-2">
              <div class="d-flex align-items-center mb-2">
                <div class="text-warning me-2">
                  ${'★'.repeat(Math.floor(guide.rating))}${'☆'.repeat(5-Math.floor(guide.rating))}
                </div>
                <span class="text-muted">${guide.rating}</span>
              </div>
              <div class="mb-2">
                <small class="text-muted">Languages: ${guide.languages.join(', ')}</small>
              </div>
              <div class="mb-2">
                ${guide.specialties.map(specialty => 
                  `<span class="badge bg-light text-dark me-1">${specialty}</span>`
                ).join('')}
              </div>
            </div>
            <button class="btn btn-primary w-100" onclick="showGuideDetails('${guide.id}')">
              <i class="bi bi-eye me-1"></i>View Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // カウンター更新
  updateCounter() {
    const counter = document.getElementById('guide-count-number');
    const guideCountText = document.getElementById('guides-count');
    
    const displayedCount = this.displayedGuides.length;
    
    if (counter) {
      counter.textContent = displayedCount;
    }
    
    if (guideCountText) {
      guideCountText.innerHTML = `<i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${displayedCount}</span> guides found`;
    }
    
    console.log(`✅ Counter updated: ${displayedCount} guides displayed`);
  }

  // フィルター適用
  applyFilters() {
    const location = document.getElementById('prefecture-filter')?.value || '';
    const language = document.getElementById('language-filter')?.value || '';
    const priceRange = document.getElementById('price-filter')?.value || '';
    
    let filtered = [...this.guides];
    
    // 地域フィルター
    if (location) {
      filtered = filtered.filter(guide => 
        guide.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // 言語フィルター
    if (language) {
      filtered = filtered.filter(guide => 
        guide.languages.some(lang => lang.toLowerCase().includes(language.toLowerCase()))
      );
    }
    
    // 価格フィルター
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(guide => guide.fee >= min && guide.fee <= max);
      } else {
        filtered = filtered.filter(guide => guide.fee >= min);
      }
    }
    
    this.filteredGuides = filtered;
    this.displayedGuides = filtered;
    
    // 表示更新
    const container = document.getElementById('guide-cards-container');
    if (container) {
      container.innerHTML = filtered.map(guide => this.generateGuideCard(guide)).join('');
    }
    
    this.updateCounter();
    
    // 結果メッセージ
    const noResults = document.getElementById('no-results-message');
    if (noResults) {
      if (filtered.length === 0) {
        noResults.classList.remove('d-none');
      } else {
        noResults.classList.add('d-none');
      }
    }
    
    console.log(`✅ Filtered to ${filtered.length} guides`);
  }

  // フィルターリセット
  resetFilters() {
    // フォーム要素をリセット
    const form = document.getElementById('guide-filter-form');
    if (form) {
      form.reset();
    }
    
    // 全ガイド表示
    this.displayAllGuides();
    
    // 結果メッセージを隠す
    const noResults = document.getElementById('no-results-message');
    if (noResults) {
      noResults.classList.add('d-none');
    }
    
    console.log('✅ Filters reset, showing all guides');
  }

  // イベントリスナー設定
  setupEventListeners() {
    // フィルター変更イベント
    const filterInputs = [
      'prefecture-filter',
      'language-filter', 
      'price-filter'
    ];
    
    filterInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => this.applyFilters());
      }
    });
    
    // リセットボタン
    const resetBtn = document.querySelector('button[type="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }
    
    console.log('✅ Event listeners setup complete');
  }
}

// グローバル関数
function showGuideDetails(guideId) {
  const guide = englishGuides.find(g => g.id === guideId);
  if (guide) {
    alert(`Guide Details:\n\nName: ${guide.name}\nLocation: ${guide.location}\nRating: ${guide.rating}\nFee: ¥${guide.fee.toLocaleString()}/session\n\nDescription: ${guide.description}`);
  }
}

// システム初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Initializing English Guide System...');
  
  // 既存のシステムを無効化
  if (window.englishGuideSystem) {
    console.log('🔧 Disabling existing English guide system...');
  }
  
  // 新しいシステムを初期化
  window.englishGuideSystemFixed = new EnglishGuideSystemFixed();
  window.englishGuideSystemFixed.init();
  
  console.log('✅ English Guide System (Fixed) fully loaded and initialized');
});

console.log('✅ English Guide System (Fixed) Script Loaded');