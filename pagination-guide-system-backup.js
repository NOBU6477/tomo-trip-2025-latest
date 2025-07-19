/**
 * ページング機能付きガイド表示システム
 * 仕様：12人ずつ表示、もっと見るボタンで次ページ、検索時はランダム表示
 */

class PaginationGuideSystem {
  constructor() {
    this.allGuides = [];
    this.currentPage = 0;
    this.guidesPerPage = 12;
    this.displayedGuides = [];
    this.filteredGuides = [];
    this.isFiltering = false;
    this.isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en';
    
    console.log(`🚀 ページング機能付きガイドシステム初期化 (${this.isEnglishSite ? '英語' : '日本語'}サイト)`);
  }

  init() {
    this.loadAllGuides();
    this.setupUI();
    this.setupFilters();
    this.displayGuidesPage();
    this.updateCounter();
    
    // グローバル関数として公開（リセット機能用）
    window.resetFilters = () => this.resetFilters();
    window.searchGuides = () => this.applyFilters();
    
    console.log(`✅ ページングシステム初期化完了: ${this.allGuides.length}人のガイドを読み込み`);
  }

  loadAllGuides() {
    // 基本12人のガイドデータを取得（制限を解除）
    const basicGuides = getDefaultGuides();
    
    // 新規登録されたガイドを追加
    const newGuides = localStorage.getItem('newRegisteredGuides');
    let additionalGuides = [];
    if (newGuides) {
      additionalGuides = JSON.parse(newGuides);
    }
    
    this.allGuides = [...basicGuides, ...additionalGuides];
    this.filteredGuides = [...this.allGuides];
    
    console.log(`📊 全ガイドデータ読み込み: ${this.allGuides.length}人`);
    console.log(`- 基本ガイド: ${basicGuides.length}人`);
    console.log(`- 新規登録ガイド: ${additionalGuides.length}人`);
  }

  setupUI() {
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.error('❌ ガイドカードコンテナが見つかりません');
      return;
    }

    // 既存の旧ボタンを無効化
    const oldButton = document.getElementById('load-more-guides');
    if (oldButton) {
      oldButton.style.display = 'none';
      console.log('🔄 旧もっと見るボタンを無効化');
    }
    
    // もっと見るボタンを作成または取得
    let loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement('div');
      loadMoreBtn.id = 'load-more-btn';
      loadMoreBtn.className = 'text-center mt-4';
      loadMoreBtn.innerHTML = `
        <button class="btn btn-primary btn-lg load-more-button">
          ${this.isEnglishSite ? 'Show More Guides' : 'もっと見る'}
        </button>
      `;
      
      // コンテナの親要素にボタンを追加
      const parentSection = container.parentElement;
      if (parentSection) {
        parentSection.appendChild(loadMoreBtn);
      }
    }
    
    // 表示状態にする
    loadMoreBtn.style.display = 'block';

    // ボタンクリックイベント
    const button = loadMoreBtn.querySelector('.load-more-button');
    if (button) {
      button.addEventListener('click', () => {
        this.loadMoreGuides();
      });
    }

    console.log('🔘 もっと見るボタン設定完了');
  }

  displayGuidesPage() {
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.error('❌ guide-cards-container が見つかりません');
      return;
    }

    // 現在のページで表示するガイドを計算
    const startIndex = this.currentPage * this.guidesPerPage;
    const endIndex = startIndex + this.guidesPerPage;
    const guidesToShow = this.filteredGuides.slice(startIndex, endIndex);

    console.log(`📄 ページ${this.currentPage + 1}表示: ${startIndex + 1}-${Math.min(endIndex, this.filteredGuides.length)}/${this.filteredGuides.length}`);
    console.log(`📊 表示予定ガイド数: ${guidesToShow.length}`);

    // 初回表示時はクリア、追加表示時は追記
    if (this.currentPage === 0) {
      container.innerHTML = '';
      this.displayedGuides = [];
      console.log('🗑️ コンテナをクリア');
    }

    // ガイドカードを生成して表示
    if (guidesToShow.length === 0) {
      console.warn('⚠️ 表示するガイドがありません');
      container.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted">該当するガイドが見つかりませんでした</h4></div>';
    } else {
      guidesToShow.forEach((guide, index) => {
        if (!this.displayedGuides.find(g => g.id === guide.id)) {
          const guideCard = this.createGuideCard(guide);
          container.appendChild(guideCard);
          this.displayedGuides.push(guide);
          console.log(`✅ ガイドカード追加: ${guide.name}`);
        }
      });
    }

    // もっと見るボタンの表示/非表示
    this.updateLoadMoreButton();
    
    // カウンター更新
    this.updateCounter();
    
    console.log(`📈 最終表示状態: ${this.displayedGuides.length}枚のカード表示中`);
  }

  createGuideCard(guide) {
    const colDiv = document.createElement('div');
    colDiv.className = this.isEnglishSite ? 'col-lg-4 col-md-6 mb-4' : 'col-md-4 mb-4 guide-item';
    colDiv.setAttribute('data-guide-id', guide.id);
    colDiv.setAttribute('data-location', guide.location || '');
    colDiv.setAttribute('data-languages', (guide.languages || []).join(','));
    colDiv.setAttribute('data-fee', guide.fee || 6000);
    colDiv.setAttribute('data-keywords', (guide.specialties || []).join(','));

    const translatedGuide = this.isEnglishSite ? this.translateGuideToEnglish(guide) : guide;
    const detailButtonText = this.isEnglishSite ? 'See Details' : '詳細を見る';
    const sessionText = this.isEnglishSite ? '/session' : '/セッション';

    colDiv.innerHTML = `
      <div class="card guide-card h-100">
        <div class="position-relative">
          <img src="${translatedGuide.profileImage}" class="card-img-top" alt="${translatedGuide.name}" 
               style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-primary">${translatedGuide.rating}★</span>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${translatedGuide.name}</h5>
          <p class="text-muted small mb-2">
            <i class="bi bi-geo-alt-fill"></i> ${translatedGuide.location}
          </p>
          <p class="card-text flex-grow-1">${translatedGuide.description}</p>
          
          <div class="mb-3">
            <div class="d-flex flex-wrap gap-1 mb-2">
              ${(translatedGuide.languages || []).map(lang => 
                `<span class="badge bg-info">${lang}</span>`
              ).join('')}
            </div>
            <div class="d-flex flex-wrap gap-1">
              ${(translatedGuide.specialties || []).map(specialty => 
                `<span class="badge bg-secondary">${specialty}</span>`
              ).join('')}
            </div>
          </div>
          
          <div class="d-flex justify-content-between align-items-center">
            <span class="price-badge fw-bold text-primary">¥${(translatedGuide.fee || 6000).toLocaleString()}${sessionText}</span>
            <button class="btn btn-outline-primary btn-sm">${detailButtonText}</button>
          </div>
        </div>
      </div>
    `;

    return colDiv;
  }

  translateGuideToEnglish(guide) {
    // 英語サイト用の翻訳マップ
    const locationMap = {
      '東京': 'Tokyo', '大阪': 'Osaka', '京都': 'Kyoto', '神戸': 'Kobe',
      '名古屋': 'Nagoya', '福岡': 'Fukuoka', '札幌': 'Sapporo', '仙台': 'Sendai'
    };

    const specialtyMap = {
      'グルメツアー': 'Gourmet Tours', '歴史散策': 'Historical Walks',
      '写真スポット': 'Photo Spots', '文化体験': 'Cultural Experience',
      'ナイトライフ': 'Nightlife', 'アート': 'Art Tours'
    };

    return {
      ...guide,
      location: locationMap[guide.location] || guide.location,
      specialties: (guide.specialties || []).map(s => specialtyMap[s] || s),
      description: this.translateDescription(guide.description)
    };
  }

  translateDescription(description) {
    // 簡単な説明文翻訳
    const translations = {
      'こんにちは': 'Hello', '案内': 'guide', 'ツアー': 'tour',
      '歴史': 'history', '文化': 'culture', 'グルメ': 'gourmet',
      '美味しい': 'delicious', '楽しい': 'fun', '素晴らしい': 'wonderful'
    };

    let translated = description;
    Object.entries(translations).forEach(([jp, en]) => {
      translated = translated.replace(new RegExp(jp, 'g'), en);
    });

    return translated.length > 100 ? translated.substring(0, 100) + '...' : translated;
  }

  loadMoreGuides() {
    if (this.hasMoreGuides()) {
      this.currentPage++;
      this.displayGuidesPage();
      
      console.log(`📄 次ページ読み込み: ページ${this.currentPage + 1}`);
      
      // 新しいガイドが読み込まれた位置にスムーズスクロール
      setTimeout(() => {
        const lastCard = document.querySelector('#guide-cards-container .guide-card:last-child');
        if (lastCard) {
          lastCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  hasMoreGuides() {
    const totalDisplayed = (this.currentPage + 1) * this.guidesPerPage;
    return totalDisplayed < this.filteredGuides.length;
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const button = loadMoreBtn?.querySelector('.load-more-button');
    
    if (button) {
      if (this.hasMoreGuides()) {
        button.style.display = 'block';
        const remaining = this.filteredGuides.length - this.displayedGuides.length;
        const nextBatch = Math.min(remaining, this.guidesPerPage);
        button.textContent = this.isEnglishSite ? 
          `Show ${nextBatch} More Guides` : 
          `もっと見る（残り${remaining}人）`;
      } else {
        button.style.display = 'none';
      }
    }
  }

  setupFilters() {
    // フィルター要素を取得
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const priceFilter = document.getElementById('price-filter');
    const customKeywords = document.getElementById('custom-keywords');
    const keywordCheckboxes = document.querySelectorAll('input[name="keywords"]');

    // フィルターイベントリスナー
    [locationFilter, languageFilter, priceFilter, customKeywords].forEach(filter => {
      if (filter) {
        filter.addEventListener('change', () => this.applyFilters());
      }
    });

    keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });

    console.log('🔍 フィルター設定完了');
  }

  applyFilters() {
    console.log('🔍 フィルター適用開始');
    this.isFiltering = true;

    // フィルター条件を取得
    const filters = this.getFilterCriteria();
    
    // フィルター適用前に全ガイドをランダムシャッフル（検索時のランダム表示）
    const shuffledGuides = [...this.allGuides].sort(() => Math.random() - 0.5);
    
    // フィルタリング実行
    this.filteredGuides = shuffledGuides.filter(guide => this.matchesFilters(guide, filters));
    
    // ページをリセットして再表示
    this.currentPage = 0;
    this.displayedGuides = [];
    this.displayGuidesPage();
    
    console.log(`🎯 フィルター結果: ${this.filteredGuides.length}/${this.allGuides.length}人`);
  }

  getFilterCriteria() {
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const priceFilter = document.getElementById('price-filter');
    const customKeywords = document.getElementById('custom-keywords');
    const keywordCheckboxes = document.querySelectorAll('input[name="keywords"]:checked');

    const selectedKeywords = [];
    keywordCheckboxes.forEach(cb => selectedKeywords.push(cb.value));
    
    if (customKeywords?.value) {
      const customKeys = customKeywords.value.split(',').map(k => k.trim()).filter(k => k);
      selectedKeywords.push(...customKeys);
    }

    let minFee = 0, maxFee = Infinity;
    if (priceFilter?.value) {
      switch(priceFilter.value) {
        case '6000円以下': maxFee = 6000; break;
        case '6000-10000円': minFee = 6000; maxFee = 10000; break;
        case '10000円以上': minFee = 10000; break;
      }
    }

    return {
      location: locationFilter?.value || '',
      language: languageFilter?.value || '',
      minFee, maxFee,
      keywords: selectedKeywords
    };
  }

  matchesFilters(guide, filters) {
    // 地域フィルター
    if (filters.location && guide.location && !guide.location.includes(filters.location)) {
      return false;
    }

    // 言語フィルター
    if (filters.language && guide.languages && !guide.languages.includes(filters.language)) {
      return false;
    }

    // 料金フィルター
    const fee = guide.fee || 6000;
    if (fee < filters.minFee || fee > filters.maxFee) {
      return false;
    }

    // キーワードフィルター
    if (filters.keywords.length > 0) {
      const guideText = `${guide.name} ${guide.description} ${(guide.specialties || []).join(' ')}`.toLowerCase();
      const hasKeyword = filters.keywords.some(keyword => 
        guideText.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) return false;
    }

    return true;
  }

  resetFilters() {
    console.log('🔄 フィルターリセット開始');
    
    // すべてのフィルターを個別に詳細リセット
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const priceFilter = document.getElementById('price-filter');
    const customKeywords = document.getElementById('custom-keywords');
    
    if (locationFilter) {
      locationFilter.selectedIndex = 0;
      locationFilter.value = '';
      console.log('📍 地域フィルターリセット');
    }
    
    if (languageFilter) {
      languageFilter.selectedIndex = 0;
      languageFilter.value = '';
      console.log('🌐 言語フィルターリセット');
    }
    
    if (priceFilter) {
      priceFilter.selectedIndex = 0;
      priceFilter.value = '';
      console.log('💰 料金フィルターリセット:', priceFilter.value);
    }
    
    if (customKeywords) {
      customKeywords.value = '';
      console.log('🔤 カスタムキーワードリセット');
    }

    // キーワードチェックボックスをリセット
    const keywordCheckboxes = document.querySelectorAll('input[name="keywords"]');
    keywordCheckboxes.forEach((cb, index) => {
      cb.checked = false;
      console.log(`☑️ キーワードチェックボックス ${index} リセット`);
    });

    // フィルターリセット後は元の順序で表示
    this.isFiltering = false;
    this.filteredGuides = [...this.allGuides];
    this.currentPage = 0;
    this.displayedGuides = [];
    this.displayGuidesPage();
    this.updateCounter();

    // リセット完了確認
    setTimeout(() => {
      const priceFilterCheck = document.getElementById('price-filter');
      if (priceFilterCheck) {
        console.log('🔍 リセット後の料金フィルター値:', priceFilterCheck.value);
        console.log('🔍 リセット後の料金フィルター選択インデックス:', priceFilterCheck.selectedIndex);
      }
    }, 100);

    console.log('🔄 フィルターリセット完了');
  }

  updateCounter() {
    const totalGuides = this.filteredGuides.length;
    const displayedCount = this.displayedGuides.length;
    
    // カウンター要素を更新（より多くのセレクターを試行）
    const counterSelectors = [
      '.counter-badge', 
      '#guides-count', 
      '#guide-counter',
      '.guide-counter',
      '.text-primary.fw-bold.fs-5',
      '#guides .text-primary.fw-bold.fs-5'
    ];
    
    let counterUpdated = false;
    counterSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (this.isEnglishSite) {
          element.innerHTML = `<i class="bi bi-people-fill me-2"></i>Found ${totalGuides} guides (showing ${displayedCount})`;
        } else {
          element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${totalGuides}人のガイドが見つかりました（${displayedCount}人表示中）`;
        }
        counterUpdated = true;
      });
    });

    // 核修正システムも呼び出し
    if (window.nuclearCounterFix) {
      setTimeout(() => {
        window.nuclearCounterFix();
      }, 100);
    }

    console.log(`📊 カウンター更新: ${totalGuides}人中${displayedCount}人表示 (更新${counterUpdated ? '成功' : '失敗'})`);
  }

  // 新しいガイドを登録する
  addNewGuide(guideData) {
    const newGuide = {
      id: Math.max(...this.allGuides.map(g => g.id), 0) + 1,
      ...guideData,
      rating: 4.0,
      profileImage: guideData.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    };

    this.allGuides.push(newGuide);
    
    // ローカルストレージに保存
    const existingNewGuides = JSON.parse(localStorage.getItem('newRegisteredGuides') || '[]');
    existingNewGuides.push(newGuide);
    localStorage.setItem('newRegisteredGuides', JSON.stringify(existingNewGuides));

    // フィルターが適用されていない場合は新しいガイドを表示に追加
    if (!this.isFiltering) {
      this.filteredGuides.push(newGuide);
    }

    this.updateCounter();
    console.log(`✅ 新しいガイドを追加: ${newGuide.name} (ID: ${newGuide.id})`);
    
    return newGuide;
  }
}

// グローバル変数として初期化
let paginationGuideSystem;

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
  // 既存のunified-guide-systemを無効化
  if (window.unifiedGuideSystem) {
    console.log('⚠️ 既存の統一ガイドシステムを新しいページングシステムに移行');
  }
  
  // より早く初期化して確実に動作させる
  setTimeout(() => {
    paginationGuideSystem = new PaginationGuideSystem();
    paginationGuideSystem.init();
    
    // グローバルアクセス用
    window.paginationGuideSystem = paginationGuideSystem;
    
    // 初期表示の強制実行
    setTimeout(() => {
      if (paginationGuideSystem.allGuides.length === 0) {
        console.error('❌ ガイドデータが読み込まれていません - 再読み込み実行');
        paginationGuideSystem.loadAllGuides();
        paginationGuideSystem.displayGuidesPage();
        paginationGuideSystem.updateCounter();
      }
    }, 500);
  }, 500);
});

// より確実な初期化のため、window.onloadでも実行
window.addEventListener('load', function() {
  setTimeout(() => {
    if (!window.paginationGuideSystem || !window.paginationGuideSystem.allGuides || window.paginationGuideSystem.allGuides.length === 0) {
      console.log('🔄 window.onload でページングシステムを再初期化');
      paginationGuideSystem = new PaginationGuideSystem();
      paginationGuideSystem.init();
      window.paginationGuideSystem = paginationGuideSystem;
    }
  }, 1000);
});

// getDefaultGuides関数（基本ガイドデータ）
function getDefaultGuides() {
  return [
    {
      id: 1,
      name: "田中 太郎",
      location: "東京",
      languages: ["日本語", "英語"],
      specialties: ["歴史散策", "グルメツアー"],
      fee: 8000,
      rating: 4.8,
      description: "東京の歴史ある下町エリアを中心に、隠れた名店をご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "佐藤 花子",
      location: "京都", 
      languages: ["日本語", "英語", "中国語"],
      specialties: ["文化体験", "写真スポット"],
      fee: 12000,
      rating: 4.9,
      description: "京都の伝統文化を体験できる特別なツアーをご提供します。",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "山田 次郎", 
      location: "大阪",
      languages: ["日本語", "英語"],
      specialties: ["グルメツアー", "ナイトライフ"],
      fee: 7000,
      rating: 4.6,
      description: "大阪の美味しいものを知り尽くした地元ガイドです。",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "鈴木 美香",
      location: "神戸",
      languages: ["日本語", "英語", "韓国語"], 
      specialties: ["アート", "写真スポット"],
      fee: 9000,
      rating: 4.7,
      description: "神戸のおしゃれスポットとアートシーンをご案内します。",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "高橋 健一",
      location: "名古屋",
      languages: ["日本語", "英語"],
      specialties: ["歴史散策", "文化体験"],
      fee: 6500,
      rating: 4.5,
      description: "名古屋城周辺の歴史スポットを詳しくご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
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
      name: "大野 隆一",
      location: "静岡",
      languages: ["日本語", "英語"],
      specialties: ["富士山", "自然体験"],
      fee: 10500,
      rating: 4.9,
      description: "富士山周辺の絶景スポットをご案内します。",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 18,
      name: "野村 里奈",
      location: "新潟",
      languages: ["日本語", "英語", "中国語"],
      specialties: ["スキー", "温泉"],
      fee: 9000,
      rating: 4.5,
      description: "新潟の雪国文化とスキーリゾートをご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 19,
      name: "岡田 真吾",
      location: "岡山",
      languages: ["日本語", "英語"],
      specialties: ["歴史散策", "グルメツアー"],
      fee: 7600,
      rating: 4.6,
      description: "岡山の歴史ある街並みと郷土料理をご案内します。",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 20,
      name: "平田 美恵子",
      location: "和歌山",
      languages: ["日本語", "英語"],
      specialties: ["温泉", "自然体験"],
      fee: 8100,
      rating: 4.8,
      description: "和歌山の温泉と美しい自然をご案内します。",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 21,
      name: "村上 拓也",
      location: "青森",
      languages: ["日本語", "英語"],
      specialties: ["自然体験", "りんご農園"],
      fee: 7800,
      rating: 4.4,
      description: "青森の豊かな自然とりんご文化をご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 22,
      name: "吉田 真由美",
      location: "山梨",
      languages: ["日本語", "英語", "フランス語"],
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
}
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
      name: "大野 隆一",
      location: "静岡",
      languages: ["日本語", "英語"],
      specialties: ["富士山", "自然体験"],
      fee: 10500,
      rating: 4.9,
      description: "富士山周辺の絶景スポットをご案内します。",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 18,
      name: "野村 里奈",
      location: "新潟",
      languages: ["日本語", "英語", "中国語"],
      specialties: ["スキー", "温泉"],
      fee: 9000,
      rating: 4.5,
      description: "新潟の雪国文化とスキーリゾートをご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 19,
      name: "岡田 真吾",
      location: "岡山",
      languages: ["日本語", "英語"],
      specialties: ["歴史散策", "グルメツアー"],
      fee: 7600,
      rating: 4.6,
      description: "岡山の歴史ある街並みと郷土料理をご案内します。",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 20,
      name: "平田 美恵子",
      location: "和歌山",
      languages: ["日本語", "英語"],
      specialties: ["温泉", "自然体験"],
      fee: 8100,
      rating: 4.8,
      description: "和歌山の温泉と美しい自然をご案内します。",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 21,
      name: "村上 拓也",
      location: "青森",
      languages: ["日本語", "英語"],
      specialties: ["自然体験", "りんご農園"],
      fee: 7800,
      rating: 4.4,
      description: "青森の豊かな自然とりんご文化をご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 22,
      name: "吉田 真由美",
      location: "山梨",
      languages: ["日本語", "英語", "フランス語"],
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
    }
  ];
}