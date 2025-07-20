/**
 * 英語サイト専用ガイドシステム
 * 日本語サイトから完全に独立した英語専用ガイド管理
 */

console.log('🇺🇸 英語サイト専用ガイドシステム開始');

// 英語サイト専用ガイドデータ
const englishGuides = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Tokyo",
    prefecture: "Tokyo",
    languages: ["English", "Japanese"],
    specialties: ["Cultural Experience", "Food Tours"],
    fee: 8000,
    description: "Tokyo native guide specializing in hidden local spots and cultural experiences. Join me for an authentic journey through Japan's capital.",
    rating: 4.9,
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Kyoto",
    prefecture: "Kyoto",
    languages: ["English", "Chinese"],
    specialties: ["Temple Tours", "Traditional Gardens"],
    fee: 9000,
    description: "15 years of experience guiding visitors through Kyoto's spiritual heritage. Discover the heart of ancient Japan.",
    rating: 4.8,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "Osaka",
    prefecture: "Osaka",
    languages: ["English", "French"],
    specialties: ["Culinary Tours", "Street Food"],
    fee: 7500,
    description: "Food culture expert offering authentic Osaka culinary experiences. Taste the real flavors of Japan's kitchen.",
    rating: 4.7,
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Kim",
    location: "Hiroshima",
    prefecture: "Hiroshima",
    languages: ["English", "Korean"],
    specialties: ["Historical Tours", "Peace Education"],
    fee: 8500,
    description: "History specialist focusing on peace memorial sites and local culture. Experience meaningful historical narratives.",
    rating: 4.9,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Garcia",
    location: "Fukuoka",
    prefecture: "Fukuoka",
    languages: ["English", "Spanish"],
    specialties: ["Local Lifestyle", "Hidden Gems"],
    fee: 7000,
    description: "Local lifestyle guide showcasing hidden gems and authentic experiences. Discover the real side of Kyushu.",
    rating: 4.6,
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Robert Taylor",
    location: "Nara",
    prefecture: "Nara",
    languages: ["English", "German"],
    specialties: ["Nature Tours", "Wildlife"],
    fee: 8000,
    description: "Nature and wildlife guide specializing in deer park and temple visits. Connect with Japan's natural heritage.",
    rating: 4.8,
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 7,
    name: "Amanda Brown",
    location: "Yokohama",
    prefecture: "Kanagawa",
    languages: ["English", "Japanese"],
    specialties: ["Modern Culture", "Shopping"],
    fee: 7500,
    description: "Modern city culture and shopping district specialist. Experience contemporary Japan at its finest.",
    rating: 4.7,
    profileImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 8,
    name: "James Wilson",
    location: "Kobe",
    prefecture: "Hyogo",
    languages: ["English", "Italian"],
    specialties: ["Cuisine", "Port Culture"],
    fee: 9500,
    description: "Port city culture and world-famous Kobe beef specialist. Taste premium cuisine and explore maritime heritage.",
    rating: 4.9,
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 9,
    name: "Sophie Martin",
    location: "Nagoya",
    prefecture: "Aichi",
    languages: ["English", "French"],
    specialties: ["Traditional Crafts", "Industrial Heritage"],
    fee: 7000,
    description: "Traditional crafts and industrial heritage specialist. Discover Japan's manufacturing heart and artisan traditions.",
    rating: 4.6,
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 10,
    name: "Alex Thompson",
    location: "Sendai",
    prefecture: "Miyagi",
    languages: ["English", "Japanese"],
    specialties: ["Nature", "Hot Springs"],
    fee: 8000,
    description: "Nature and hot springs specialist in the Tohoku region. Relax in natural thermal springs and explore scenic landscapes.",
    rating: 4.8,
    profileImage: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 11,
    name: "Maria Rodriguez",
    location: "Sapporo",
    prefecture: "Hokkaido",
    languages: ["English", "Spanish"],
    specialties: ["Winter Sports", "Hokkaido Cuisine"],
    fee: 8500,
    description: "Winter sports and Hokkaido cuisine specialist. Experience snow festivals and premium seafood in northern Japan.",
    rating: 4.7,
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 12,
    name: "Daniel Lee",
    location: "Okinawa",
    prefecture: "Okinawa",
    languages: ["English", "Korean"],
    specialties: ["Beach Culture", "Ryukyu Heritage"],
    fee: 9000,
    description: "Beach culture and traditional Ryukyu heritage specialist. Explore tropical paradise and unique island culture.",
    rating: 4.9,
    profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face"
  }
];

// 英語サイト専用ガイド管理クラス
class EnglishGuideSystem {
  constructor() {
    this.guides = [...englishGuides];
    this.filteredGuides = [...englishGuides];
    this.currentPage = 1;
    this.guidesPerPage = 12;
    this.displayedGuides = [];
    
    console.log('✅ English Guide System initialized with', this.guides.length, 'guides');
  }

  // ガイドカード生成（英語専用）
  generateGuideCard(guide) {
    return `
      <div class="col-lg-4 col-md-6 mb-4 guide-card" data-guide-id="${guide.id}">
        <div class="card h-100 shadow-sm border-0">
          <div class="position-relative">
            <img src="${guide.profileImage}" class="card-img-top" alt="${guide.name}" style="height: 250px; object-fit: cover;">
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-primary fs-6">${guide.rating}★</span>
            </div>
            <div class="position-absolute bottom-0 end-0 m-2">
              <span class="badge bg-success fs-6">¥${guide.fee.toLocaleString()}</span>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">${guide.name}</h5>
            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt-fill"></i> ${guide.location}
            </p>
            <p class="card-text flex-grow-1">${guide.description}</p>
            <div class="mb-3">
              ${guide.languages.map(lang => `<span class="badge bg-secondary me-1">${lang}</span>`).join('')}
            </div>
            <div class="mb-3">
              ${guide.specialties.map(spec => `<span class="badge bg-outline-primary me-1">${spec}</span>`).join('')}
            </div>
            <button class="btn btn-primary mt-auto" onclick="viewGuideDetails(${guide.id})">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ガイド表示
  displayGuides(guidesToShow = null) {
    const container = document.getElementById('guide-cards-container');
    if (!container) return;

    const guides = guidesToShow || this.guides;
    this.displayedGuides = guides;
    
    container.innerHTML = guides.map(guide => this.generateGuideCard(guide)).join('');
    
    // カウンター更新
    this.updateCounter();
    
    console.log(`✅ Displayed ${guides.length} English guides`);
  }

  // カウンター更新（英語専用）
  updateCounter() {
    const counter = document.getElementById('guide-count-number');
    const guideCountText = document.getElementById('guides-count');
    
    if (counter) {
      const displayedCount = this.displayedGuides.length;
      counter.textContent = displayedCount;
    }
    
    if (guideCountText) {
      const displayedCount = this.displayedGuides.length;
      guideCountText.innerHTML = `<i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${displayedCount}</span> guides found`;
    }
    
    console.log(`✅ Counter updated: ${this.displayedGuides.length} guides`);
  }

  // フィルタリング機能
  filterGuides(filters) {
    console.log('🔍 Filtering English guides:', filters);
    
    let filtered = [...this.guides];

    // 都道府県フィルター
    if (filters.prefecture) {
      filtered = filtered.filter(guide => 
        guide.prefecture.toLowerCase().includes(filters.prefecture.toLowerCase()) ||
        guide.location.toLowerCase().includes(filters.prefecture.toLowerCase())
      );
    }

    // 言語フィルター
    if (filters.language) {
      filtered = filtered.filter(guide => 
        guide.languages.some(lang => lang.toLowerCase().includes(filters.language.toLowerCase()))
      );
    }

    // 料金フィルター
    if (filters.fee) {
      filtered = filtered.filter(guide => {
        const fee = guide.fee;
        switch (filters.fee) {
          case '6000-10000': return fee >= 6000 && fee <= 10000;
          case '10000-15000': return fee > 10000 && fee <= 15000;
          case '15000-20000': return fee > 15000 && fee <= 20000;
          case '20000+': return fee > 20000;
          default: return true;
        }
      });
    }

    // キーワードフィルター
    if (filters.keywords && filters.keywords.length > 0) {
      filtered = filtered.filter(guide => {
        const searchText = `${guide.name} ${guide.description} ${guide.specialties.join(' ')}`.toLowerCase();
        return filters.keywords.some(keyword => 
          searchText.includes(keyword.toLowerCase())
        );
      });
    }

    this.filteredGuides = filtered;
    this.displayGuides(filtered);
    
    console.log(`✅ Filtered to ${filtered.length} guides`);
  }

  // リセット機能
  resetFilters() {
    console.log('🔄 Resetting English guide filters');
    
    this.filteredGuides = [...this.guides];
    this.currentPage = 1;
    this.displayGuides();
    
    // フィルターフォームのリセット
    const filterForm = document.querySelector('#filter-card form');
    if (filterForm) {
      filterForm.reset();
    }
    
    console.log('✅ English guide filters reset');
  }

  // もっと見るボタン機能
  loadMore() {
    const startIndex = this.displayedGuides.length;
    const endIndex = startIndex + this.guidesPerPage;
    const nextGuides = this.filteredGuides.slice(startIndex, endIndex);
    
    if (nextGuides.length > 0) {
      const container = document.getElementById('guide-cards-container');
      if (container) {
        nextGuides.forEach(guide => {
          container.innerHTML += this.generateGuideCard(guide);
        });
        this.displayedGuides = [...this.displayedGuides, ...nextGuides];
        this.updateCounter();
      }
    }
    
    console.log(`✅ Loaded ${nextGuides.length} more English guides`);
  }
}

// グローバルインスタンス作成
let englishGuideSystem;

// 初期化関数
function initializeEnglishGuideSystem() {
  console.log('🔧 Initializing English Guide System...');
  
  englishGuideSystem = new EnglishGuideSystem();
  
  // 初期表示
  englishGuideSystem.displayGuides();
  
  // フィルターイベントの設定
  setupEnglishFilters();
  
  console.log('✅ English Guide System initialized successfully');
}

// フィルター設定
function setupEnglishFilters() {
  console.log('🔧 Setting up English filters...');
  
  const applyButton = document.getElementById('apply-filters');
  const resetButton = document.getElementById('reset-filters');
  
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      const filters = {
        prefecture: document.getElementById('prefecture-filter')?.value || '',
        language: document.getElementById('language-filter')?.value || '',
        fee: document.getElementById('fee-filter')?.value || '',
        keywords: getSelectedKeywords()
      };
      
      englishGuideSystem.filterGuides(filters);
    });
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      englishGuideSystem.resetFilters();
    });
  }
  
  console.log('✅ English filters setup complete');
}

// キーワード取得
function getSelectedKeywords() {
  const keywords = [];
  
  // チェックボックスから
  document.querySelectorAll('.keyword-checkbox:checked').forEach(checkbox => {
    keywords.push(checkbox.value);
  });
  
  // カスタム入力から
  const customInput = document.getElementById('keyword-filter-custom');
  if (customInput && customInput.value.trim()) {
    const customKeywords = customInput.value.split(',').map(k => k.trim()).filter(k => k);
    keywords.push(...customKeywords);
  }
  
  return keywords;
}

// ガイド詳細表示（グローバル関数）
function viewGuideDetails(guideId) {
  const guide = englishGuideSystem.guides.find(g => g.id === guideId);
  if (guide) {
    alert(`Guide Details:\n\nName: ${guide.name}\nLocation: ${guide.location}\nSpecialties: ${guide.specialties.join(', ')}\nLanguages: ${guide.languages.join(', ')}\nFee: ¥${guide.fee.toLocaleString()}\nRating: ${guide.rating}★\n\nDescription: ${guide.description}`);
  }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
  // 英語サイトでのみ実行
  if (document.documentElement.lang === 'en' || window.location.pathname.includes('index-en.html')) {
    console.log('🇺🇸 English site detected - initializing English Guide System');
    setTimeout(initializeEnglishGuideSystem, 1000);
    
    // 日本語システムの無効化
    if (window.unifiedGuideSystem) {
      console.log('🚫 Disabling Japanese unified guide system');
      window.unifiedGuideSystem = null;
    }
  }
});

// グローバル公開
window.englishGuideSystem = englishGuideSystem;
window.initializeEnglishGuideSystem = initializeEnglishGuideSystem;
window.viewGuideDetails = viewGuideDetails;

console.log('✅ English Guide System loaded successfully');