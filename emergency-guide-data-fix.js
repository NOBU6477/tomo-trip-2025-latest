/**
 * 緊急ガイドデータ修正システム
 * 破損したpagination-guide-system.jsの代替として動作
 */

console.log('🚨 緊急ガイドデータ修正システム開始');

// 完全な24人ガイドデータを定義
const COMPLETE_GUIDE_DATA = [
  {
    id: 1,
    name: "田中 美咲",
    location: "東京",
    languages: ["日本語", "英語"],
    specialties: ["都市観光", "グルメツアー"],
    fee: 8000,
    rating: 4.5,
    description: "東京の隠れた名所と美味しいグルメスポットをご案内します。",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "山田 健太郎",
    location: "京都",
    languages: ["日本語", "英語", "中国語"],
    specialties: ["歴史散策", "寺院巡り"],
    fee: 7500,
    rating: 4.8,
    description: "古都京都の歴史と文化を深く学べる特別なツアーを提供します。",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "佐藤 花子",
    location: "大阪",
    languages: ["日本語", "英語"],
    specialties: ["グルメツアー", "エンターテイメント"],
    fee: 6500,
    rating: 4.6,
    description: "大阪のソウルフードと笑いの文化をお楽しみください。",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "鈴木 太郎",
    location: "神戸",
    languages: ["日本語", "英語", "フランス語"],
    specialties: ["港町散策", "洋菓子巡り"],
    fee: 7800,
    rating: 4.4,
    description: "神戸の異国情緒あふれる街並みと美味しい洋菓子を楽しめます。",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "高橋 恵美",
    location: "名古屋",
    languages: ["日本語", "英語"],
    specialties: ["名古屋飯", "歴史散策"],
    fee: 7000,
    rating: 4.3,
    description: "名古屋の独特なグルメ文化と歴史をご紹介します。",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "渡辺 麻衣",
    location: "福岡",
    languages: ["日本語", "英語"],
    specialties: ["グルメツアー", "文化体験"],
    fee: 7500,
    rating: 4.8,
    description: "福岡の屋台文化と美味しいものをご紹介します。",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 7,
    name: "中村 雄一",
    location: "広島",
    languages: ["日本語", "英語"],
    specialties: ["歴史散策", "平和学習"],
    fee: 8500,
    rating: 4.7,
    description: "広島の歴史と平和について深く学べるツアーをご提供します。",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 8,
    name: "小林 桜",
    location: "仙台",
    languages: ["日本語", "英語", "中国語"],
    specialties: ["自然体験", "温泉"],
    fee: 9500,
    rating: 4.9,
    description: "東北の美しい自然と温泉文化をご案内します。",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 9,
    name: "石井 健太",
    location: "札幌",
    languages: ["日本語", "英語"],
    specialties: ["グルメツアー", "スキー"],
    fee: 10000,
    rating: 4.6,
    description: "北海道の新鮮な海産物とウィンタースポーツをご紹介します。",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 10,
    name: "森田 愛子",
    location: "沖縄",
    languages: ["日本語", "英語"],
    specialties: ["マリンスポーツ", "文化体験"],
    fee: 8800,
    rating: 4.8,
    description: "沖縄の美しい海と独特の文化をお楽しみいただけます。",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 11,
    name: "橋本 直樹",
    location: "金沢",
    languages: ["日本語", "英語"],
    specialties: ["工芸体験", "歴史散策"],
    fee: 9200,
    rating: 4.7,
    description: "金沢の伝統工芸と美しい街並みをご案内します。",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 12,
    name: "松本 香織",
    location: "奈良",
    languages: ["日本語", "英語", "韓国語"],
    specialties: ["歴史散策", "寺院巡り"],
    fee: 7800,
    rating: 4.5,
    description: "古都奈良の歴史ある寺院と文化遺産をご紹介します。",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 13,
    name: "井上 孝志",
    location: "北海道",
    languages: ["日本語", "英語"],
    specialties: ["自然体験", "アドベンチャー"],
    fee: 11000,
    rating: 4.8,
    description: "北海道の雄大な自然でアウトドア体験をご提供します。",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 14,
    name: "加藤 美咲",
    location: "横浜",
    languages: ["日本語", "英語", "フランス語"],
    specialties: ["アート", "建築"],
    fee: 9800,
    rating: 4.6,
    description: "横浜のモダン建築とアートシーンをご案内します。",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 15,
    name: "藤田 健二",
    location: "長崎",
    languages: ["日本語", "英語"],
    specialties: ["歴史散策", "文化体験"],
    fee: 7200,
    rating: 4.4,
    description: "長崎の異国情緒溢れる街並みと歴史をご紹介します。",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 16,
    name: "西田 綾香",
    location: "熊本",
    languages: ["日本語", "英語", "韓国語"],
    specialties: ["温泉", "自然体験"],
    fee: 8300,
    rating: 4.7,
    description: "熊本の美しい自然と温泉をご案内します。",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 17,
    name: "村上 裕介",
    location: "静岡",
    languages: ["日本語", "英語"],
    specialties: ["富士山", "茶文化"],
    fee: 9500,
    rating: 4.5,
    description: "富士山の絶景と静岡の茶文化を体験できます。",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 18,
    name: "長谷川 由紀",
    location: "新潟",
    languages: ["日本語", "英語"],
    specialties: ["日本酒", "郷土料理"],
    fee: 8100,
    rating: 4.6,
    description: "新潟の美味しい日本酒と郷土料理をご紹介します。",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 19,
    name: "岡田 真一",
    location: "岡山",
    languages: ["日本語", "英語"],
    specialties: ["果物狩り", "庭園"],
    fee: 7700,
    rating: 4.4,
    description: "岡山の美しい庭園と美味しい果物をお楽しみください。",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 20,
    name: "林 千恵",
    location: "和歌山",
    languages: ["日本語", "英語"],
    specialties: ["温泉", "世界遺産"],
    fee: 8900,
    rating: 4.7,
    description: "和歌山の温泉と世界遺産を巡る特別なツアーです。",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 21,
    name: "青木 大輔",
    location: "青森",
    languages: ["日本語", "英語"],
    specialties: ["りんご狩り", "祭り"],
    fee: 7600,
    rating: 4.3,
    description: "青森のりんご園と伝統的な祭りをご案内します。",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 22,
    name: "吉田 里奈",
    location: "山梨",
    languages: ["日本語", "英語"],
    specialties: ["ワイナリー", "果物狩り"],
    fee: 10200,
    rating: 4.7,
    description: "山梨のワイナリーと果物狩りをご案内します。",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 23,
    name: "今井 慎一郎",
    location: "香川",
    languages: ["日本語", "英語"],
    specialties: ["うどん巡り", "アート"],
    fee: 7400,
    rating: 4.5,
    description: "香川の本場讃岐うどんとアートをご案内します。",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 24,
    name: "清水 雅人",
    location: "宮城",
    languages: ["日本語", "英語"],
    specialties: ["海鮮グルメ", "温泉"],
    fee: 8600,
    rating: 4.6,
    description: "宮城の新鮮な海の幸と温泉をご案内します。",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  }
];

// 緊急ページングシステムクラス
class EmergencyPaginationSystem {
  constructor() {
    this.allGuides = COMPLETE_GUIDE_DATA;
    this.currentPage = 0;
    this.guidesPerPage = 12;
    this.displayedGuides = [];
    this.filteredGuides = [...this.allGuides];
    this.isFiltering = false;
    
    console.log(`🚨 緊急ページングシステム初期化: ${this.allGuides.length}人のガイド`);
  }

  init() {
    this.displayGuidesPage();
    this.updateCounter();
    this.setupLoadMoreButton();
    
    // グローバル関数として公開
    window.resetFilters = () => this.resetFilters();
    window.searchGuides = () => this.applyFilters();
    
    console.log('✅ 緊急システム初期化完了');
  }

  displayGuidesPage() {
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.error('❌ guide-cards-container が見つかりません');
      return;
    }

    // 初期ページの場合はクリア、追加の場合はそのまま
    if (this.currentPage === 0) {
      container.innerHTML = '';
    }

    // 現在のページで表示するガイドを計算
    const startIndex = this.currentPage * this.guidesPerPage;
    const endIndex = startIndex + this.guidesPerPage;
    const guidesToShow = this.filteredGuides.slice(startIndex, endIndex);

    console.log(`📄 ページ${this.currentPage + 1}表示: ${startIndex + 1}-${Math.min(endIndex, this.filteredGuides.length)}/${this.filteredGuides.length}`);

    // ガイドカードを生成・表示
    guidesToShow.forEach((guide, index) => {
      const guideCard = this.createGuideCard(guide, startIndex + index);
      container.appendChild(guideCard);
    });

    this.displayedGuides = this.filteredGuides.slice(0, endIndex);
    
    console.log(`🖼️ 緊急システム: ${guidesToShow.length}枚カード追加、合計${this.displayedGuides.length}枚表示`);
  }

  createGuideCard(guide, index) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-4 mb-4 guide-item';
    colDiv.setAttribute('data-guide-id', guide.id);
    colDiv.setAttribute('data-fee', guide.fee);
    colDiv.id = `emergency-guide-card-${guide.id}`;
    
    colDiv.innerHTML = `
      <div class="card guide-card h-100">
        <div class="position-relative">
          <img src="${guide.profileImage}" 
               class="card-img-top" alt="${guide.name}" 
               style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-primary">${guide.rating}★</span>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${guide.name}</h5>
          <p class="text-muted small mb-2">
            <i class="bi bi-geo-alt-fill"></i> ${guide.location}
          </p>
          <p class="card-text flex-grow-1">${guide.description}</p>
          <div class="mb-3">
            <div class="d-flex flex-wrap gap-1">
              ${guide.languages.map(lang => 
                `<span class="badge bg-light text-dark">${lang}</span>`
              ).join('')}
            </div>
          </div>
          <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="h5 mb-0 text-primary">¥${guide.fee.toLocaleString()}/セッション</span>
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

  updateCounter() {
    const displayedCount = this.displayedGuides.length;
    const totalCount = this.filteredGuides.length;
    
    let counterText;
    if (this.isFiltering) {
      counterText = `${displayedCount}人のガイドが見つかりました（全${this.allGuides.length}人中）`;
    } else {
      if (displayedCount === totalCount) {
        counterText = `${totalCount}人のガイドが見つかりました`;
      } else {
        counterText = `${displayedCount}人のガイドを表示中（全${totalCount}人中）`;
      }
    }

    console.log(`📊 緊急カウンター更新: "${counterText}"`);

    // カウンター要素を更新
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
      });
    });
  }

  setupLoadMoreButton() {
    let loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement('div');
      loadMoreBtn.id = 'load-more-btn';
      loadMoreBtn.className = 'text-center mt-4';
      
      const container = document.getElementById('guide-cards-container');
      if (container && container.parentNode) {
        container.parentNode.insertBefore(loadMoreBtn, container.nextSibling);
      }
    }

    this.updateLoadMoreButton();
    
    // クリックイベントの設定
    loadMoreBtn.addEventListener('click', () => {
      this.loadMoreGuides();
    });

    console.log('🔘 緊急もっと見るボタン設定完了');
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    if (this.hasMoreGuides()) {
      const remaining = this.filteredGuides.length - this.displayedGuides.length;
      const nextBatch = Math.min(remaining, this.guidesPerPage);
      
      loadMoreBtn.innerHTML = `
        <button class="btn btn-primary btn-lg load-more-button">
          もっと見る（残り${remaining}人）
        </button>
      `;
      loadMoreBtn.style.display = 'block';
      
      console.log(`🔘 もっと見るボタン表示: 残り${remaining}人`);
    } else {
      loadMoreBtn.style.display = 'none';
      console.log('🔘 もっと見るボタン非表示（全員表示済み）');
    }
  }

  hasMoreGuides() {
    const totalDisplayed = (this.currentPage + 1) * this.guidesPerPage;
    return totalDisplayed < this.filteredGuides.length;
  }

  loadMoreGuides() {
    console.log('🔘 緊急もっと見るボタンクリック');
    
    if (this.hasMoreGuides()) {
      this.currentPage++;
      this.displayGuidesPage();
      this.updateCounter();
      this.updateLoadMoreButton();
      
      // スムーズスクロール
      setTimeout(() => {
        const newCards = document.querySelectorAll(`#emergency-guide-card-${this.filteredGuides[this.currentPage * this.guidesPerPage].id}`);
        if (newCards.length > 0) {
          newCards[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  resetFilters() {
    console.log('🔄 緊急システム: フィルターリセット');
    
    // フィルター状態をリセット
    this.filteredGuides = [...this.allGuides];
    this.currentPage = 0;
    this.displayedGuides = [];
    this.isFiltering = false;
    
    // UI要素をリセット
    const filters = [
      document.getElementById('location-filter'),
      document.getElementById('language-filter'),
      document.getElementById('price-filter'),
      document.getElementById('custom-keywords')
    ];
    
    filters.forEach(filter => {
      if (filter) {
        if (filter.tagName === 'SELECT') {
          filter.selectedIndex = 0;
          filter.value = '';
        } else if (filter.tagName === 'INPUT') {
          filter.value = '';
        }
      }
    });
    
    // チェックボックスもリセット
    const checkboxes = document.querySelectorAll('.keyword-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // 表示を更新
    this.displayGuidesPage();
    this.updateCounter();
    this.updateLoadMoreButton();
    
    console.log(`✅ 緊急システム: リセット完了 - ${this.allGuides.length}人全員表示`);
  }

  applyFilters() {
    console.log('🔍 緊急システム: フィルター適用');
    
    // フィルター条件を取得
    const locationFilter = document.getElementById('location-filter')?.value || '';
    const languageFilter = document.getElementById('language-filter')?.value || '';
    const priceFilter = document.getElementById('price-filter')?.value || '';
    const customKeywords = document.getElementById('custom-keywords')?.value || '';
    
    // チェックボックスのキーワードを取得
    const checkedKeywords = Array.from(document.querySelectorAll('.keyword-checkbox:checked'))
      .map(checkbox => checkbox.value);
    
    // フィルタリング実行
    this.filteredGuides = this.allGuides.filter(guide => {
      // 地域フィルター
      if (locationFilter && locationFilter !== 'すべて' && guide.location !== locationFilter) {
        return false;
      }
      
      // 言語フィルター
      if (languageFilter && languageFilter !== 'すべて' && !guide.languages.includes(languageFilter)) {
        return false;
      }
      
      // 価格フィルター
      if (priceFilter && priceFilter !== 'すべて') {
        const [min, max] = priceFilter.split('-').map(p => parseInt(p));
        if (max && (guide.fee < min || guide.fee > max)) {
          return false;
        }
        if (!max && guide.fee < min) {
          return false;
        }
      }
      
      // キーワードフィルター
      if (checkedKeywords.length > 0) {
        const hasMatchingKeyword = checkedKeywords.some(keyword => 
          guide.specialties.some(specialty => specialty.includes(keyword))
        );
        if (!hasMatchingKeyword) {
          return false;
        }
      }
      
      // カスタムキーワード
      if (customKeywords.trim()) {
        const keywords = customKeywords.split(',').map(k => k.trim());
        const hasCustomKeyword = keywords.some(keyword => 
          guide.name.includes(keyword) || 
          guide.location.includes(keyword) || 
          guide.description.includes(keyword) ||
          guide.specialties.some(specialty => specialty.includes(keyword))
        );
        if (!hasCustomKeyword) {
          return false;
        }
      }
      
      return true;
    });
    
    // フィルタリング状態を更新
    this.isFiltering = locationFilter !== '' || languageFilter !== '' || 
                      priceFilter !== '' || customKeywords.trim() !== '' || 
                      checkedKeywords.length > 0;
    
    this.currentPage = 0;
    this.displayedGuides = [];
    
    // 表示を更新
    this.displayGuidesPage();
    this.updateCounter();
    this.updateLoadMoreButton();
    
    console.log(`🔍 緊急システム: フィルター完了 - ${this.filteredGuides.length}人マッチ`);
  }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚨 緊急システム: DOM読み込み完了');
  
  // 既存のpagination-guide-systemを無効化
  if (window.paginationGuideSystem) {
    console.log('🔄 既存pagination-guide-systemを無効化');
    window.paginationGuideSystem = null;
  }
  
  // 緊急システムを初期化
  const emergencySystem = new EmergencyPaginationSystem();
  emergencySystem.init();
  
  // グローバルに公開
  window.emergencyPaginationSystem = emergencySystem;
  
  console.log('✅ 緊急ガイドデータシステム完全初期化完了');
});

// getDefaultGuides関数をオーバーライド
window.getDefaultGuides = function() {
  console.log('📊 緊急システム: getDefaultGuides呼び出し - 24人データ返却');
  return COMPLETE_GUIDE_DATA;
};

// デバッグ用関数
window.emergencyDebug = function() {
  console.log('🚨 緊急システムデバッグ情報');
  if (window.emergencyPaginationSystem) {
    console.log('📊 システム状態:', {
      totalGuides: window.emergencyPaginationSystem.allGuides.length,
      filteredGuides: window.emergencyPaginationSystem.filteredGuides.length,
      displayedGuides: window.emergencyPaginationSystem.displayedGuides.length,
      currentPage: window.emergencyPaginationSystem.currentPage,
      isFiltering: window.emergencyPaginationSystem.isFiltering
    });
  } else {
    console.log('❌ 緊急システムが初期化されていません');
  }
};

console.log('✅ 緊急ガイドデータ修正システム読み込み完了');
console.log('🔧 デバッグ用: window.emergencyDebug() を実行してください');