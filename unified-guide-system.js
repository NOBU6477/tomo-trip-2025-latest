/**
 * 統一ガイド管理システム
 * 日本語・英語サイト共通のガイド登録・表示・フィルター機能
 */

// 初期70人ガイドデータ（日本語・英語統一）
const initialGuides = [
  {
    id: 1, name: '田中 太郎', location: '東京都 渋谷区', prefecture: '東京都',
    languages: ['日本語', '英語'], specialties: ['文化体験', '食べ歩き'], fee: 8000,
    description: '東京生まれ東京育ちのローカルガイド。隠れた名店や文化スポットをご案内します。',
    rating: 4.5, profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2, name: '佐藤 花子', location: '大阪府 大阪市', prefecture: '大阪府',
    languages: ['日本語', '英語', '中国語'], specialties: ['グルメツアー', '歴史探訪'], fee: 7500,
    description: '大阪の食文化と歴史に詳しいガイド。本場のたこ焼きから古い神社まで案内します。',
    rating: 4.8, profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b587?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3, name: '山田 次郎', location: '京都府 京都市', prefecture: '京都府',
    languages: ['日本語', '英語'], specialties: ['歴史ツアー', '寺院巡り'], fee: 9000,
    description: '京都在住20年の歴史研究家。古都の隠された歴史と美しい庭園をご紹介します。',
    rating: 4.7, profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4, name: '鈴木 美咲', location: '北海道 札幌市', prefecture: '北海道',
    languages: ['日本語', '英語', 'ロシア語'], specialties: ['自然体験', 'アクティビティ'], fee: 8000,
    description: '北海道・札幌のローカルガイド。四季折々の自然と新鮮な海の幸、絶景スポットをご案内します。',
    rating: 4.6, profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 5, name: '高橋 健', location: '沖縄県 那覇市', prefecture: '沖縄県',
    languages: ['日本語', '英語'], specialties: ['マリンスポーツ', '自然体験'], fee: 12000,
    description: '沖縄在住15年のダイビングインストラクター。美しい海と独自の文化が残る島々を案内します。',
    rating: 4.5, profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 6, name: '伊藤 平和', location: '広島県 広島市', prefecture: '広島県',
    languages: ['日本語', '英語', 'フランス語'], specialties: ['歴史ツアー', '文化体験'], fee: 6500,
    description: '広島の歴史と文化に精通したガイド。平和記念公園から宮島まで、心に残る旅をご提供します。',
    rating: 4.0, profileImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face'
  }
];

// 24人のガイドデータを確保（基本6人+拡張18人）
const getDefaultGuides = () => {
  const extendedGuides = [...initialGuides];
  
  // 追加18人のガイドデータ
  const additionalGuides = [
    {
      id: 7, name: '渡辺 麻衣', location: '福岡県 福岡市', prefecture: '福岡県',
      languages: ['日本語', '英語'], specialties: ['グルメツアー', '文化体験'], fee: 7500,
      description: '福岡の屋台文化と美味しいものをご紹介します。',
      rating: 4.8, profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 8, name: '中村 雄一', location: '広島県 広島市', prefecture: '広島県',
      languages: ['日本語', '英語'], specialties: ['歴史散策', '平和学習'], fee: 8500,
      description: '広島の歴史と平和について深く学べるツアーをご提供します。',
      rating: 4.7, profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 9, name: '小林 桜', location: '宮城県 仙台市', prefecture: '宮城県',
      languages: ['日本語', '英語', '中国語'], specialties: ['自然体験', '温泉'], fee: 9500,
      description: '東北の美しい自然と温泉文化をご案内します。',
      rating: 4.9, profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 10, name: '石井 健太', location: '北海道 札幌市', prefecture: '北海道',
      languages: ['日本語', '英語'], specialties: ['グルメツアー', 'スキー'], fee: 10000,
      description: '札幌の新鮮な海の幸とウィンタースポーツをお楽しみください。',
      rating: 4.6, profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 11, name: '森田 智子', location: '沖縄県 那覇市', prefecture: '沖縄県',
      languages: ['日本語', '英語'], specialties: ['マリンスポーツ', '文化体験'], fee: 11000,
      description: '沖縄の美しい海と伝統文化をご案内します。',
      rating: 4.8, profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 12, name: '長谷川 修', location: '愛知県 名古屋市', prefecture: '愛知県',
      languages: ['日本語', '英語'], specialties: ['歴史散策', 'グルメツアー'], fee: 7800,
      description: '名古屋の歴史と独特なグルメ文化をご紹介します。',
      rating: 4.4, profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 13, name: '井上 美香', location: '神奈川県 横浜市', prefecture: '神奈川県',
      languages: ['日本語', '英語', '中国語'], specialties: ['港町散策', 'アート'], fee: 8200,
      description: '横浜の国際的な魅力とアートシーンをご案内します。',
      rating: 4.5, profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 14, name: '木村 大輔', location: '石川県 金沢市', prefecture: '石川県',
      languages: ['日本語', '英語'], specialties: ['文化体験', '工芸'], fee: 9200,
      description: '金沢の伝統工芸と美しい庭園をご紹介します。',
      rating: 4.7, profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 15, name: '斎藤 恵', location: '奈良県 奈良市', prefecture: '奈良県',
      languages: ['日本語', '英語'], specialties: ['歴史ツアー', '自然体験'], fee: 8800,
      description: '古都奈良の歴史と鹿公園をご案内します。',
      rating: 4.6, profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 16, name: '松本 裕也', location: '長野県 松本市', prefecture: '長野県',
      languages: ['日本語', '英語'], specialties: ['自然体験', 'アクティビティ'], fee: 9800,
      description: '信州の美しい山々とアウトドア体験をご提供します。',
      rating: 4.8, profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 17, name: '野村 翔太', location: '熊本県 熊本市', prefecture: '熊本県',
      languages: ['日本語', '英語'], specialties: ['自然体験', '温泉'], fee: 8600,
      description: '阿蘇の雄大な自然と熊本の魅力をご案内します。',
      rating: 4.5, profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 18, name: '藤田 由美', location: '静岡県 静岡市', prefecture: '静岡県',
      languages: ['日本語', '英語'], specialties: ['自然体験', 'グルメツアー'], fee: 7900,
      description: '富士山の絶景と静岡の美味しいお茶をお楽しみください。',
      rating: 4.4, profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 19, name: '大島 健吾', location: '新潟県 新潟市', prefecture: '新潟県',
      languages: ['日本語', '英語'], specialties: ['グルメツアー', '文化体験'], fee: 8300,
      description: '新潟の美味しいお米と日本酒文化をご紹介します。',
      rating: 4.6, profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 20, name: '橋本 舞', location: '岡山県 岡山市', prefecture: '岡山県',
      languages: ['日本語', '英語'], specialties: ['歴史散策', 'フルーツ狩り'], fee: 7700,
      description: '晴れの国岡山の歴史と美味しいフルーツをお楽しみください。',
      rating: 4.3, profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 21, name: '内田 慎一', location: '和歌山県 和歌山市', prefecture: '和歌山県',
      languages: ['日本語', '英語'], specialties: ['自然体験', '温泉'], fee: 8700,
      description: '熊野古道と白浜温泉の神秘的な魅力をご案内します。',
      rating: 4.7, profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 22, name: '三浦 愛子', location: '青森県 青森市', prefecture: '青森県',
      languages: ['日本語', '英語'], specialties: ['自然体験', 'グルメツアー'], fee: 9100,
      description: '青森の美しい自然と美味しいりんご、海の幸をご紹介します。',
      rating: 4.5, profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 23, name: '村上 拓海', location: '山梨県 甲府市', prefecture: '山梨県',
      languages: ['日本語', '英語'], specialties: ['自然体験', 'ワイナリー'], fee: 9300,
      description: '富士五湖の絶景と山梨のワイナリーをご案内します。',
      rating: 4.8, profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 24, name: '西川 美穂', location: '香川県 高松市', prefecture: '香川県',
      languages: ['日本語', '英語'], specialties: ['グルメツアー', '文化体験'], fee: 7600,
      description: '讃岐うどんと瀬戸内海の美しい島々をご案内します。',
      rating: 4.4, profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];
  
  return [...extendedGuides, ...additionalGuides];
};

const generateExtendedGuides_DISABLED = () => {
  const prefectures = ['東京都', '大阪府', '京都府', '北海道', '沖縄県', '広島県', '神奈川県', '愛知県', '福岡県', '宮城県'];
  const cities = {
    '東京都': ['渋谷区', '新宿区', '港区', '中央区'],
    '大阪府': ['大阪市', '堺市', '豊中市'],
    '京都府': ['京都市', '宇治市'],
    '北海道': ['札幌市', '函館市', '旭川市'],
    '沖縄県': ['那覇市', '沖縄市', '浦添市'],
    '広島県': ['広島市', '福山市'],
    '神奈川県': ['横浜市', '川崎市', '相模原市'],
    '愛知県': ['名古屋市', '豊田市'],
    '福岡県': ['福岡市', '北九州市'],
    '宮城県': ['仙台市', '石巻市']
  };
  const specialties = ['文化体験', '食べ歩き', 'グルメツアー', '歴史探訪', '自然体験', 'アクティビティ', '寺院巡り', 'マリンスポーツ'];
  const names = ['田中', '佐藤', '山田', '鈴木', '高橋', '伊藤', '渡辺', '中村', '小林', '加藤'];
  const firstNames = ['太郎', '花子', '次郎', '美咲', '健', '平和', '美香', '勇', '愛', '翔'];

  const extendedGuides = [...initialGuides];
  
  for (let i = 7; i <= 70; i++) {
    const prefecture = prefectures[Math.floor(Math.random() * prefectures.length)];
    const city = cities[prefecture][Math.floor(Math.random() * cities[prefecture].length)];
    const lastName = names[Math.floor(Math.random() * names.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    
    extendedGuides.push({
      id: i,
      name: `${lastName} ${firstName}`,
      location: `${prefecture} ${city}`,
      prefecture: prefecture,
      languages: ['日本語', '英語'],
      specialties: [
        specialties[Math.floor(Math.random() * specialties.length)],
        specialties[Math.floor(Math.random() * specialties.length)]
      ],
      fee: Math.floor(Math.random() * 10000) + 6000,
      description: `${prefecture}の魅力を知り尽くしたローカルガイド。地元ならではの特別な体験をご提供します。`,
      rating: Math.floor(Math.random() * 5 * 10) / 10 + 4.0,
      profileImage: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`
    });
  }
  
  return extendedGuides;
};

class UnifiedGuideSystem {
  constructor() {
    this.guides = [];
    this.filteredGuides = [];
    this.currentLanguage = this.detectLanguage();
    this.isEnglishSite = this.currentLanguage === 'en';
    this.init();
  }

  detectLanguage() {
    // 英語サイトかどうかを判定
    const isEnglishSite = window.location.pathname.includes('index-en') || 
                         document.documentElement.lang === 'en' ||
                         document.querySelector('#guide-counter') ||
                         document.title.includes('English');
    return isEnglishSite ? 'en' : 'ja';
  }

  init() {
    console.log(`🌐 統一ガイドシステム初期化 - ${this.isEnglishSite ? '英語' : '日本語'}サイト`);
    
    this.loadGuides();
    this.setupEventListeners();
    this.displayGuides();
    this.setupFilters();
  }

  loadGuides() {
    // 🔧 全24人のガイドを確保（6人制限を除去）
    this.guides = getDefaultGuides();
    console.log(`📊 基本ガイドを読み込みました: ${this.guides.length}人`);
    
    // 24人に満たない場合は拡張
    while (this.guides.length < 24) {
      const baseGuides = this.guides.slice(0, Math.min(12, this.guides.length));
      const additionalGuides = baseGuides.map(guide => ({
        ...guide,
        id: this.guides.length + 1,
        name: guide.name + ' (拡張' + (Math.floor(this.guides.length / 12) + 1) + ')'
      }));
      this.guides = [...this.guides, ...additionalGuides];
    }
    
    // 24人ちょうどに調整
    this.guides = this.guides.slice(0, 24);
    
    // 新規登録されたガイドも追加
    const newGuides = localStorage.getItem('newRegisteredGuides');
    if (newGuides) {
      const additional = JSON.parse(newGuides);
      additional.forEach(guide => {
        if (!this.guides.find(g => g.id === guide.id)) {
          this.guides.push(guide);
        }
      });
      console.log(`📊 新規登録ガイド ${additional.length}人を追加`);
    }
    
    this.filteredGuides = [...this.guides];
    this.saveGuides();
    console.log(`✅ 合計${this.guides.length}人のガイドを読み込み完了（24人基本+新規）`);
  }

  saveGuides() {
    localStorage.setItem('allGuides', JSON.stringify(this.guides));
  }

  addNewGuide(guideData) {
    const newId = Math.max(...this.guides.map(g => g.id)) + 1;
    const newGuide = {
      id: newId,
      ...guideData,
      rating: 4.0,
      profileImage: guideData.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    };
    
    this.guides.push(newGuide);
    this.saveGuides();
    this.displayGuides();
    
    console.log(`✅ 新しいガイドを追加: ${newGuide.name}`);
    return newGuide;
  }

  displayGuides() {
    let container = document.getElementById('guide-cards-container');
    
    // コンテナが見つからない場合、動的に作成
    if (!container) {
      console.warn('⚠️ ガイドカードコンテナが見つかりません。動的に作成します');
      
      // 既存のガイドセクションを探す
      const guidesSection = document.getElementById('guides') || document.querySelector('[id*="guides"]');
      if (guidesSection) {
        // コンテナを動的作成
        container = document.createElement('div');
        container.id = 'guide-cards-container';
        container.className = 'row';
        guidesSection.appendChild(container);
        console.log('📦 ガイドカードコンテナを動的作成しました');
      } else {
        console.error('❌ ガイドセクションが見つかりません');
        return;
      }
    }

    container.innerHTML = '';
    
    console.log(`📋 表示予定ガイド数: ${this.filteredGuides.length}`);
    console.log(`📍 コンテナID: ${container.id}`);
    
    this.filteredGuides.forEach((guide, index) => {
      console.log(`🎯 ガイド${index + 1}: ${guide.name} (ID: ${guide.id})`);
      try {
        const guideCard = this.createGuideCard(guide, index);
        container.appendChild(guideCard);
      } catch (error) {
        console.error(`❌ ガイドカード作成エラー (${guide.name}):`, error);
      }
    });

    this.updateCounter();
    
    // ブックマーク・比較システムにガイド表示を通知
    document.dispatchEvent(new CustomEvent('guidesDisplayed'));
    
    console.log(`🎨 ${container.children.length}/${this.filteredGuides.length}人のガイドカードを表示しました (${this.isEnglishSite ? '英語' : '日本語'}サイト)`);
  }

  createGuideCard(guide, index) {
    const colDiv = document.createElement('div');
    colDiv.className = this.isEnglishSite ? 'col-lg-4 col-md-6 mb-4' : 'col-md-4 mb-4 guide-item';
    colDiv.setAttribute('data-guide-id', guide.id);

    const detailButtonText = this.isEnglishSite ? 'See Details' : '詳細を見る';
    const sessionText = this.isEnglishSite ? '/session' : '/セッション';
    
    // 英語サイト用の翻訳データ
    const translatedGuide = this.isEnglishSite ? this.translateGuideToEnglish(guide) : guide;

    if (this.isEnglishSite) {
      // 英語サイト用のカードレイアウト
      colDiv.innerHTML = `
        <div class="card guide-card h-100">
          <div class="position-relative">
            <img src="${translatedGuide.profileImage}" class="card-img-top" alt="${translatedGuide.name}" 
                 style="height: 250px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=250&fit=crop&crop=face'">
            <div class="price-badge">¥${translatedGuide.fee.toLocaleString()}${sessionText}</div>
            <!-- Bookmark and Comparison Icons (Always Visible) -->
            <div class="position-absolute top-0 start-0 m-2">
              <button class="btn btn-sm btn-light bookmark-btn me-1" data-guide-id="${guide.id}" title="Bookmark this guide" style="border-radius: 50%; width: 35px; height: 35px; padding: 0;">
                <i class="bi bi-star" style="color: #ffc107;"></i>
              </button>
              <button class="btn btn-sm btn-light compare-btn" data-guide-id="${guide.id}" title="Add to comparison" style="border-radius: 50%; width: 35px; height: 35px; padding: 0;">
                <i class="bi bi-check-circle" style="color: #28a745;"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${translatedGuide.name}</h5>
            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt"></i> ${translatedGuide.location}
            </p>
            <p class="card-text small">${translatedGuide.description}</p>
            <div class="mb-3">
              ${translatedGuide.languages.map(lang => `<span class="badge bg-primary me-1">${lang}</span>`).join('')}
            </div>
            <div class="mb-3">
              <span class="text-warning">
                ${this.renderStarsEnglish(translatedGuide.rating)}
              </span>
              <span class="text-muted ms-1">${translatedGuide.rating}</span>
            </div>
            <button class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${guide.id}">
              ${detailButtonText}
            </button>
          </div>
        </div>
      `;
    } else {
      // 日本語サイト用のカードレイアウト
      colDiv.innerHTML = `
        <div class="card guide-card h-100 shadow-sm">
          <div class="position-relative">
            <img src="${guide.profileImage}" class="card-img-top guide-image" alt="${guide.name}" 
                 style="height: 200px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face'">
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-primary">¥${guide.fee.toLocaleString()}${sessionText}</span>
            </div>
            <!-- ブックマークと比較アイコン（常時表示） -->
            <div class="position-absolute top-0 start-0 m-2">
              <button class="btn btn-sm btn-light bookmark-btn me-1" data-guide-id="${guide.id}" title="このガイドをブックマーク" style="border-radius: 50%; width: 35px; height: 35px; padding: 0;">
                <i class="bi bi-star" style="color: #ffc107;"></i>
              </button>
              <button class="btn btn-sm btn-light compare-btn" data-guide-id="${guide.id}" title="比較に追加" style="border-radius: 50%; width: 35px; height: 35px; padding: 0;">
                <i class="bi bi-check-circle" style="color: #28a745;"></i>
              </button>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${guide.name}</h5>
            </div>
            <p class="card-text text-muted mb-2 guide-location">
              <i class="bi bi-geo-alt-fill me-1"></i>${guide.location}
            </p>
            <p class="card-text mb-3 guide-description">${guide.description}</p>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="guide-languages">
                ${guide.languages.map(lang => `<span class="badge bg-light text-dark guide-lang me-1">${lang}</span>`).join('')}
              </div>
              <div class="text-warning guide-rating">
                ${this.renderStars(guide.rating)}
                <span class="text-dark ms-1">${guide.rating}</span>
              </div>
            </div>
            <div class="mt-auto">
              <button class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${guide.id}">
                ${detailButtonText}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return colDiv;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  renderStarsEnglish(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '<i class="bi bi-star-fill"></i>'.repeat(fullStars) + 
           (hasHalfStar ? '<i class="bi bi-star-half"></i>' : '') + 
           '<i class="bi bi-star"></i>'.repeat(emptyStars);
  }

  translateGuideToEnglish(guide) {
    // 英語サイト用の翻訳マッピング
    const nameTranslations = {
      '田中 太郎': 'Taro Tanaka',
      '佐藤 花子': 'Hanako Sato',
      '山田 次郎': 'Jiro Yamada',
      '鈴木 美咲': 'Misaki Suzuki',
      '高橋 健': 'Ken Takahashi',
      '伊藤 平和': 'Heiwa Ito'
    };

    const locationTranslations = {
      '東京都 渋谷区': 'Tokyo, Shibuya',
      '大阪府 大阪市': 'Osaka, Osaka City',
      '京都府 京都市': 'Kyoto, Kyoto City',
      '北海道 札幌市': 'Hokkaido, Sapporo',
      '沖縄県 那覇市': 'Okinawa, Naha',
      '広島県 広島市': 'Hiroshima, Hiroshima City'
    };

    const languageTranslations = {
      '日本語': 'Japanese',
      '英語': 'English',
      '中国語': 'Chinese',
      'ロシア語': 'Russian',
      'フランス語': 'French'
    };

    return {
      ...guide,
      name: nameTranslations[guide.name] || guide.name,
      location: locationTranslations[guide.location] || guide.location,
      languages: guide.languages.map(lang => languageTranslations[lang] || lang),
      description: this.translateDescription(guide.description)
    };
  }

  translateDescription(description) {
    const translations = {
      '東京生まれ東京育ちのローカルガイド。隠れた名店や文化スポットをご案内します。': 'A local guide born and raised in Tokyo. I will guide you to hidden famous stores and cultural spots.',
      '大阪の食文化と歴史に詳しいガイド。本場のたこ焼きから古い神社まで案内します。': 'A guide well-versed in Osaka\'s food culture and history. I guide from authentic takoyaki to old shrines.',
      '京都在住20年の歴史研究家。古都の隠された歴史と美しい庭園をご紹介します。': 'A history researcher who has lived in Kyoto for 20 years. I introduce the hidden history and beautiful gardens of the ancient capital.',
      '北海道・札幌のローカルガイド。四季折々の自然と新鮮な海の幸、絶景スポットをご案内します。': 'Local guide from Hokkaido and Sapporo. I guide you through nature in all four seasons, fresh seafood, and scenic spots.',
      '沖縄在住15年のダイビングインストラクター。美しい海と独自の文化が残る島々を案内します。': 'Diving instructor living in Okinawa for 15 years. I guide you through the beautiful seas and islands where unique culture remains.',
      '広島の歴史と文化に精通したガイド。平和記念公園から宮島まで、心に残る旅をご提供します。': 'A guide well-versed in the history and culture of Hiroshima. I provide memorable trips from Peace Memorial Park to Miyajima.'
    };

    return translations[description] || 'A knowledgeable local guide who knows all the charms of the area. I provide special experiences unique to the local area.';
  }

  setupFilters() {
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordFilter = document.getElementById('keyword-filter');

    [locationFilter, languageFilter, feeFilter, keywordFilter].forEach(filter => {
      if (filter) {
        filter.addEventListener('change', () => this.applyFilters());
        filter.addEventListener('input', () => this.applyFilters());
      }
    });

    console.log('🔧 フィルターイベントリスナーを設定しました');
  }

  applyFilters(filterCriteria = null) {
    console.log('🔄 統一ガイドシステム: フィルター適用開始');
    
    let criteria;
    
    if (filterCriteria) {
      // 統一フィルターシステムからの呼び出し
      criteria = filterCriteria;
      console.log('📊 フィルター条件 (統一システム経由):', criteria);
    } else {
      // 直接フィルター
      const locationFilter = document.getElementById('location-filter');
      const languageFilter = document.getElementById('language-filter');
      const priceFilter = document.getElementById('price-filter');
      const keywordFilter = document.getElementById('keyword-filter');

      criteria = {
        location: locationFilter?.value || '',
        language: languageFilter?.value || '',
        minFee: 0,
        maxFee: Infinity,
        keywords: keywordFilter?.value ? keywordFilter.value.split(',').map(k => k.trim()) : []
      };
      
      // 価格フィルター処理
      if (priceFilter && priceFilter.value) {
        const priceValue = priceFilter.value;
        if (priceValue === '6000円以下') {
          criteria.maxFee = 6000;
        } else if (priceValue === '6000-10000円') {
          criteria.minFee = 6000;
          criteria.maxFee = 10000;
        } else if (priceValue === '10000円以上') {
          criteria.minFee = 10000;
        }
      }
      
      console.log('📊 フィルター条件 (直接):', criteria);
    }

    this.filteredGuides = this.guides.filter(guide => {
      console.log(`🎯 ガイドチェック: ${guide.name} (料金: ¥${guide.fee})`);
      
      // 地域フィルター
      if (criteria.location && criteria.location !== '' && criteria.location !== 'すべて') {
        const locationMatches = guide.location.toLowerCase().includes(criteria.location.toLowerCase()) || 
                               guide.prefecture.toLowerCase().includes(criteria.location.toLowerCase());
        if (!locationMatches) {
          console.log(`❌ 地域フィルターで除外: ${guide.name}`);
          return false;
        }
      }

      // 言語フィルター
      if (criteria.language && criteria.language !== '' && criteria.language !== 'すべて') {
        const languageMatches = guide.languages.some(lang => 
          lang.toLowerCase().includes(criteria.language.toLowerCase()));
        if (!languageMatches) {
          console.log(`❌ 言語フィルターで除外: ${guide.name}`);
          return false;
        }
      }

      // 料金フィルター（新しい形式）
      if (criteria.minFee !== undefined && guide.fee < criteria.minFee) {
        console.log(`❌ 最小料金フィルターで除外: ${guide.name} (¥${guide.fee} < ¥${criteria.minFee})`);
        return false;
      }
      
      if (criteria.maxFee !== undefined && criteria.maxFee !== Infinity && guide.fee > criteria.maxFee) {
        console.log(`❌ 最大料金フィルターで除外: ${guide.name} (¥${guide.fee} > ¥${criteria.maxFee})`);
        return false;
      }

      // キーワードフィルター
      if (criteria.keywords && criteria.keywords.length > 0) {
        const keywordMatches = criteria.keywords.some(keyword => 
          guide.specialties.some(specialty => 
            specialty.toLowerCase().includes(keyword.toLowerCase())) ||
          guide.description.toLowerCase().includes(keyword.toLowerCase()) ||
          guide.name.toLowerCase().includes(keyword.toLowerCase())
        );
        if (!keywordMatches) {
          console.log(`❌ キーワードフィルターで除外: ${guide.name}`);
          return false;
        }
      }

      // キーワードフィルター
      if (criteria.keyword) {
        const searchText = `${guide.name} ${guide.description} ${guide.specialties.join(' ')} ${guide.location}`.toLowerCase();
        if (!searchText.includes(criteria.keyword)) {
          return false;
        }
      }

      return true;
    });

    this.displayGuides();
    console.log(`🔍 フィルター適用: ${this.filteredGuides.length}/${this.guides.length}人のガイドを表示`);
  }

  updateCounter() {
    const count = this.filteredGuides.length;
    
    // 日本語サイトのカウンター更新
    const japaneseCounter = document.querySelector('#guides-count');
    if (japaneseCounter && !this.isEnglishSite) {
      japaneseCounter.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}人のガイドが見つかりました`;
    }
    
    // 英語サイトのカウンター更新
    const englishCounter = document.querySelector('#guide-counter');
    if (englishCounter && this.isEnglishSite) {
      englishCounter.textContent = `Found ${count} guides`;
    }
    
    // 検索結果カウンターも更新
    const searchCounter = document.querySelector('#search-results-counter');
    if (searchCounter) {
      if (this.isEnglishSite) {
        searchCounter.textContent = `Found ${count} guides`;
      } else {
        searchCounter.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}人のガイドが見つかりました`;
      }
      searchCounter.classList.remove('d-none');
    }
    
    console.log(`📊 カウンター更新: ${count}人 (${this.isEnglishSite ? '英語' : '日本語'}サイト)`);
  }

  setupEventListeners() {
    // 新規ガイド登録フォームの処理
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'guideRegistrationForm' || e.target.id === 'guide-registration-form') {
        e.preventDefault();
        this.handleGuideRegistration(e.target);
      }
    });

    // 言語切り替え
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('lang-btn-jp')) {
        this.currentLanguage = 'ja';
        this.displayGuides();
      } else if (e.target.classList.contains('lang-btn-en')) {
        this.currentLanguage = 'en';
        this.displayGuides();
      }
    });
  }

  handleGuideRegistration(form) {
    const formData = new FormData(form);
    
    const guideData = {
      name: formData.get('guide-name') || formData.get('name'),
      location: `${formData.get('prefecture') || '東京都'} ${formData.get('city') || '渋谷区'}`,
      prefecture: formData.get('prefecture') || '東京都',
      languages: ['日本語', '英語'], // デフォルト
      specialties: ['文化体験'], // デフォルト
      fee: parseInt(formData.get('fee')) || 8000,
      description: formData.get('description') || '地元の魅力をお伝えします。',
      profileImage: formData.get('profile-image') || null
    };

    // 言語とスペシャリティを動的に取得
    const languageCheckboxes = form.querySelectorAll('input[name="languages"]:checked');
    if (languageCheckboxes.length > 0) {
      guideData.languages = Array.from(languageCheckboxes).map(cb => cb.value);
    }

    const specialtyCheckboxes = form.querySelectorAll('input[name="specialties"]:checked');
    if (specialtyCheckboxes.length > 0) {
      guideData.specialties = Array.from(specialtyCheckboxes).map(cb => cb.value);
    }

    const newGuide = this.addNewGuide(guideData);
    
    // モーダルを閉じる
    const modal = form.closest('.modal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
    }

    // 成功メッセージ
    alert(`ガイド登録が完了しました！\n${newGuide.name}さんのプロフィールが追加されました。`);
    
    // フォームをリセット
    form.reset();
  }
}

// グローバル初期化
let unifiedGuideSystem;

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚠️ 統一ガイドシステムは無効化されました（ページングシステムに移行）');
  console.log('📄 新しいページング機能付きガイドシステムが使用されます');
  
  // ページングシステムが利用できない場合のフォールバック
  setTimeout(() => {
    if (!window.paginationGuideSystem) {
      console.log('⚠️ ページングシステムが初期化されていません');
    } else {
      console.log('✅ ページングガイドシステムが正常に動作中');
    }
  }, 2000);
});

// グローバル関数として公開
window.addNewGuide = (guideData) => {
  if (unifiedGuideSystem) {
    return unifiedGuideSystem.addNewGuide(guideData);
  }
};

window.refreshGuides = () => {
  if (unifiedGuideSystem) {
    unifiedGuideSystem.displayGuides();
  }
};