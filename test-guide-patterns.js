/**
 * テスト用ガイドカードパターン
 * 様々なバリエーションのガイドプロフィールを生成
 */

(function() {
  'use strict';
  
  console.log('🎯 テスト用ガイドパターン生成');
  
  // テスト用ガイドデータパターン
  const testGuidePatterns = [
    {
      name: '田中 太郎',
      location: '大阪府大阪市',
      languages: ['日本語', '英語'],
      specialties: ['ナイトツアー', '写真スポット', 'グルメ'],
      fee: 8000,
      rating: 4.8,
      reviews: 156,
      description: '大阪の夜景と隠れた名店を知り尽くしたベテランガイド。15年の経験で安心してお任せください。',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '佐藤 花子',
      location: '東京都渋谷区',
      languages: ['日本語', '英語', '中国語'],
      specialties: ['料理体験', '文化体験', '写真スポット'],
      fee: 12000,
      rating: 4.9,
      reviews: 203,
      description: '東京の現代カルチャーと伝統文化を融合したユニークなツアーをご提供。SNS映え間違いなし！',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '山田 一郎',
      location: '京都府京都市',
      languages: ['日本語', '英語'],
      specialties: ['歴史ツアー', '寺社巡り', '文化体験'],
      fee: 6000,
      rating: 4.7,
      reviews: 89,
      description: '京都の歴史と文化を深く学べるガイドツアー。古都の魅力を心ゆくまでお楽しみください。',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '鈴木 美咲',
      location: '神奈川県鎌倉市',
      languages: ['日本語', '英語', '韓国語'],
      specialties: ['アクティビティ', '自然体験', '写真スポット'],
      fee: 9000,
      rating: 4.6,
      reviews: 124,
      description: '鎌倉の自然と歴史を満喫できるアクティブなツアー。海と山の両方を楽しめます。',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '高橋 健太',
      location: '大阪府大阪市',
      languages: ['日本語', '英語'],
      specialties: ['ナイトツアー', 'グルメ', 'アクティビティ'],
      fee: 10000,
      rating: 4.5,
      reviews: 67,
      description: '大阪の夜を知り尽くしたナイトライフ専門ガイド。地元民だけが知るスポットをご案内。',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '中村 愛',
      location: '東京都新宿区',
      languages: ['日本語', '英語', 'スペイン語'],
      specialties: ['料理体験', 'グルメ', '写真スポット'],
      fee: 11000,
      rating: 4.8,
      reviews: 178,
      description: '東京の多様な食文化を体験できるグルメツアー。本格的な日本料理から最新トレンドまで。',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '伊藤 誠',
      location: '広島県広島市',
      languages: ['日本語', '英語'],
      specialties: ['歴史ツアー', '文化体験', 'グルメ'],
      fee: 7000,
      rating: 4.9,
      reviews: 134,
      description: '広島の歴史と平和について深く学べるツアー。地元の美味しいグルメもご紹介します。',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '松本 真理',
      location: '北海道札幌市',
      languages: ['日本語', '英語', '中国語'],
      specialties: ['自然体験', 'アクティビティ', 'グルメ'],
      fee: 8500,
      rating: 4.7,
      reviews: 98,
      description: '北海道の大自然と新鮮な海の幸を満喫できるツアー。四季折々の美しい景色をお楽しみください。',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '加藤 大輔',
      location: '沖縄県那覇市',
      languages: ['日本語', '英語', '韓国語'],
      specialties: ['アクティビティ', '自然体験', 'ナイトツアー'],
      fee: 9500,
      rating: 4.6,
      reviews: 112,
      description: '沖縄の美しい海と独特な文化を体験できるツアー。マリンスポーツから伝統文化まで幅広く対応。',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: '渡辺 由香',
      location: '奈良県奈良市',
      languages: ['日本語', '英語', 'フランス語'],
      specialties: ['歴史ツアー', '文化体験', '写真スポット'],
      fee: 6500,
      rating: 4.8,
      reviews: 87,
      description: '奈良の古代歴史と可愛い鹿たちとの触れ合いを楽しめるツアー。古都の魅力を存分に味わってください。',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face'
    }
  ];
  
  // 初期化
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', generateTestGuides);
    } else {
      generateTestGuides();
    }
  }
  
  function generateTestGuides() {
    console.log('🎯 テストガイドカード生成開始');
    
    // 既存のガイドカードを削除
    const existingCards = document.querySelectorAll('.guide-card');
    existingCards.forEach(card => card.remove());
    
    // ガイドコンテナを検索
    const guidesContainer = document.getElementById('guides-container') || 
                           document.querySelector('.row') || 
                           document.querySelector('#guides .row');
    
    if (!guidesContainer) {
      console.error('ガイドコンテナが見つかりません');
      return;
    }
    
    // テストガイドカードを生成
    testGuidePatterns.forEach(guide => {
      const guideCard = createTestGuideCard(guide);
      guidesContainer.appendChild(guideCard);
    });
    
    // カウンターを更新
    const counter = document.getElementById('guides-count');
    if (counter) {
      counter.textContent = `${testGuidePatterns.length}人のガイドが見つかりました`;
    }
    
    console.log(`✅ ${testGuidePatterns.length}件のテストガイドカードを生成完了`);
  }
  
  function createTestGuideCard(guide) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const specialtyTags = guide.specialties.map(specialty => 
      `<span class="badge bg-light text-dark me-1">${specialty}</span>`
    ).join('');
    
    col.innerHTML = `
      <div class="card guide-card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center mb-3">
            <img src="${guide.image}" 
                 class="rounded-circle me-3" 
                 alt="${guide.name}"
                 style="width: 60px; height: 60px; object-fit: cover;">
            <div>
              <h5 class="card-title mb-1">${guide.name}</h5>
              <p class="text-muted mb-0">
                <i class="bi bi-geo-alt me-1"></i>${guide.location}
              </p>
            </div>
          </div>
          
          <div class="mb-3">
            <p class="card-text">${guide.description}</p>
          </div>
          
          <div class="mb-3">
            <small class="text-muted">
              <i class="bi bi-translate me-1"></i>対応言語: ${guide.languages.join(', ')}
            </small>
          </div>
          
          <div class="mb-3">
            <div class="d-flex flex-wrap">
              ${specialtyTags}
            </div>
          </div>
          
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <strong class="text-primary">¥${guide.fee.toLocaleString()}</strong>
              <small class="text-muted">/時間</small>
            </div>
            <div>
              <span class="badge bg-warning text-dark">
                <i class="bi bi-star-fill me-1"></i>${guide.rating}
              </span>
              <small class="text-muted ms-1">(${guide.reviews}件)</small>
            </div>
          </div>
          
          <div class="d-grid">
            <button class="btn btn-primary" onclick="viewGuideDetails('${guide.name}')">
              詳細を見る
            </button>
          </div>
        </div>
      </div>
    `;
    
    return col;
  }
  
  // グローバル関数として公開
  window.generateTestGuides = generateTestGuides;
  window.viewGuideDetails = function(guideName) {
    console.log(`ガイド詳細表示: ${guideName}`);
    alert(`${guideName}さんの詳細ページを表示します（テスト用）`);
  };
  
  // 初期化実行
  initialize();
  
})();