/**
 * 統合ガイド詳細ページスクリプト
 * ガイドデータの取得と表示、予約、チャット機能を一元管理
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド詳細ページを初期化中...');
  
  // 前回のキャッシュをクリアしてデータの鮮度を確保
  clearStaleGuideCache();
  
  // URLからガイドIDを取得し、必要なら整形
  const urlParams = new URLSearchParams(window.location.search);
  let guideId = urlParams.get('id') || '1';
  
  // URLパラメータのIDをデコード（必要な場合）
  if (guideId && guideId.includes('%')) {
    try {
      guideId = decodeURIComponent(guideId);
      console.log(`デコードされたガイドID: ${guideId}`);
    } catch (e) {
      console.error('ガイドIDのデコードに失敗しました:', e);
    }
  }
  
  console.log(`表示中のガイドID: ${guideId}`);
  
  // メインページからガイドデータを取得して保存
  saveGlobalGuidesData();
  
  // ガイドデータ取得と表示
  fetchGuideDetails(guideId);
});

/**
 * 古いガイドキャッシュをクリアする
 * ページが読み込まれる度に古いキャッシュデータを削除して最新データを使用できるようにする
 */
function clearStaleGuideCache() {
  try {
    // URLからガイドIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const guideId = urlParams.get('id');
    
    if (guideId) {
      // 特定のガイドIDのキャッシュをクリア
      const specificGuideKey = `guide_${guideId}`;
      localStorage.removeItem(specificGuideKey);
      console.log(`ガイドID ${guideId} のキャッシュをクリアしました`);
    }
  } catch (e) {
    console.error('キャッシュクリアエラー:', e);
  }
}

/**
 * メインページからすべてのガイドデータを取得して保存
 * ページ間の一貫性を確保するため
 */
function saveGlobalGuidesData() {
  try {
    // インデックスページからすべてのガイドカードを取得
    const guideCards = document.querySelectorAll('.guide-card');
    console.log(`メインページから ${guideCards.length} 件のガイドカードを発見`);
    
    if (guideCards.length > 0) {
      const guidesData = [];
      
      // 各カードからガイドデータを抽出
      guideCards.forEach(card => {
        try {
          const guideId = card.getAttribute('data-guide-id');
          if (!guideId) return;
          
          const location = card.getAttribute('data-location');
          const languages = card.getAttribute('data-languages');
          const fee = card.getAttribute('data-fee');
          const keywords = card.getAttribute('data-keywords');
          
          // 画像URLとガイド名を取得
          let imageUrl = '';
          let name = '';
          
          const imageElement = card.querySelector('.guide-image');
          if (imageElement) {
            imageUrl = imageElement.getAttribute('src');
            name = imageElement.getAttribute('alt')?.replace('のガイド写真', '') || '';
          }
          
          // 名前が取得できなかった場合、カードタイトルから取得
          if (!name || name.trim() === '') {
            const titleElement = card.querySelector('.card-title');
            if (titleElement) {
              name = titleElement.textContent.trim();
            }
          }
          
          if (location && name) {
            // デコードしてデータを作成
            const guideData = {
              id: guideId,
              name: name,
              location: decodeURIComponent(location),
              languages: languages ? decodeURIComponent(languages).split(',') : ['日本語'],
              fee: parseInt(fee, 10) || 6000,
              keywords: keywords ? decodeURIComponent(keywords).split(',') : [],
              imageUrl: imageUrl
            };
            
            guidesData.push(guideData);
            
            // 個別ストレージにも保存
            localStorage.setItem(`guide_${guideId}`, JSON.stringify(guideData));
          }
        } catch (cardError) {
          console.error('カードデータ抽出エラー:', cardError);
        }
      });
      
      // ガイドデータをグローバルに保存
      if (guidesData.length > 0) {
        localStorage.setItem('guidesData', JSON.stringify(guidesData));
        console.log(`${guidesData.length} 件のガイドデータをグローバルストレージに保存しました`);
      }
    }
  } catch (e) {
    console.error('グローバルガイドデータ保存エラー:', e);
  }
}



/**
 * ガイド詳細データを取得して表示
 * @param {string} guideId ガイドID
 */
function fetchGuideDetails(guideId) {
  console.log(`fetchGuideDetails: ガイドID=${guideId}を取得します`);
  
  // 現在のユーザー情報を取得（ログイン状態確認用）
  const currentUserJson = sessionStorage.getItem('currentUser');
  let userData = null;
  
  if (currentUserJson) {
    try {
      userData = JSON.parse(currentUserJson);
      console.log('ユーザーデータ:', userData);
    } catch (e) {
      console.error('ユーザーデータの解析エラー:', e);
    }
  }
  
  // ガイドデータの取得を試みる
  let guideData = null;
  
  // ガイドIDが数値化できるか確認
  const numericGuideId = parseInt(guideId, 10);
  const isNumericId = !isNaN(numericGuideId);
  console.log(`ガイドID: ${guideId}, 数値変換: ${isNumericId ? numericGuideId : '変換できません'}`);
  
  // 1. DOM内の強化されたデータ属性を確認（最新のデータソース）
  const guideCardElements = document.querySelectorAll(`[data-guide-id="${guideId}"]`);
  if (guideCardElements.length > 0) {
    const cardElement = guideCardElements[0];
    console.log('DOM内のカード要素を発見:', cardElement);
    
    try {
      // カードからデータを抽出
      const location = cardElement.getAttribute('data-location');
      const languages = cardElement.getAttribute('data-languages');
      const fee = cardElement.getAttribute('data-fee');
      const keywords = cardElement.getAttribute('data-keywords');
      
      // 画像URLとガイド名を取得
      let imageUrl = '';
      let name = '';
      
      const imageElement = cardElement.querySelector('.guide-image');
      if (imageElement) {
        imageUrl = imageElement.getAttribute('src');
        name = imageElement.getAttribute('alt')?.replace('のガイド写真', '') || '';
      }
      
      // 名前が取得できなかった場合、カードタイトルから取得
      if (!name || name.trim() === '') {
        const titleElement = cardElement.querySelector('.card-title');
        if (titleElement) {
          name = titleElement.textContent.trim();
        }
      }
      
      if (location && name) {
        console.log(`DOM要素から抽出したデータ - 名前: ${name}, 地域: ${decodeURIComponent(location)}`);
        
        // データオブジェクトを構築
        guideData = {
          id: guideId,
          name: name,
          location: decodeURIComponent(location),
          languages: languages ? decodeURIComponent(languages).split(',') : ['日本語'],
          fee: parseInt(fee, 10) || 6000,
          keywords: keywords ? decodeURIComponent(keywords).split(',') : [],
          imageUrl: imageUrl,
          rating: 4.0 + (Math.random() * 1.0),
          reviewCount: 5 + Math.floor(Math.random() * 20),
          bio: `こんにちは！${decodeURIComponent(location)}在住の${name}です。地元の魅力をご案内いたします。`
        };
        
        // 新しいデータをローカルストレージに保存
        localStorage.setItem(`guide_${guideId}`, JSON.stringify(guideData));
        console.log(`DOM要素から抽出したガイドデータをローカルストレージに保存: ${name}`);
      }
    } catch (e) {
      console.error('DOM要素からのデータ抽出エラー:', e);
    }
  }
  
  // 2. まだデータがない場合、localStorage から対応するガイドデータを探す
  if (!guideData) {
    try {
      // 個別のguide_X データを最初に確認（優先度高）
      const specificGuideKey = `guide_${guideId}`;
      const specificGuideJson = localStorage.getItem(specificGuideKey);
      if (specificGuideJson) {
        try {
          console.log(`個別のキー[${specificGuideKey}]のデータを取得: ${specificGuideJson}`);
          const storedGuideData = JSON.parse(specificGuideJson);
          console.log(`個別のキー[${specificGuideKey}]からデータ解析: ${storedGuideData ? '成功' : '失敗'}`);
          
          // ストレージから取得したデータが十分であればそれを使用
          if (storedGuideData && storedGuideData.name && storedGuideData.name.trim() !== '') {
            console.log(`ローカルストレージのガイドデータを使用: ${storedGuideData.name}`);
            guideData = storedGuideData;
          } else {
            console.log('ローカルストレージのデータが不完全です');
          }
        } catch (parseError) {
          console.error(`個別ガイドデータの解析エラー[${specificGuideKey}]:`, parseError);
          console.log(`JSON解析に失敗したデータ: ${specificGuideJson}`);
        }
      }
      
      // 次にguidesData から検索（個別データがないか不完全な場合）
      if (!guideData) {
        const guidesListJson = localStorage.getItem('guidesData');
        if (guidesListJson) {
          const guidesList = JSON.parse(guidesListJson);
          if (Array.isArray(guidesList)) {
            // 配列の場合は検索
            const foundGuide = guidesList.find(g => g.id && g.id.toString() === guideId.toString());
            console.log(`guidesData から ID=${guideId} のデータを検索: ${foundGuide ? '見つかりました' : '見つかりません'}`);
            
            if (foundGuide && foundGuide.name && foundGuide.name.trim() !== '') {
              console.log(`guidesDataからのガイドデータを使用: ${foundGuide.name}`);
              guideData = foundGuide;
            }
          }
        }
      }
    } catch (e) {
      console.error('ガイドデータ取得エラー:', e);
    }
  }
  
  // 3. ガイドデータが見つからない場合、デフォルトデータを生成
  if (!guideData) {
    console.log(`ガイドID ${guideId} のデータが見つからないため、デフォルトデータを生成します`);
    
    // 特定のIDの場合の固定データ
    if (guideId === '5') {
      console.log(`ID=${guideId}のデータを静的定義から取得します`);
      guideData = {
        id: "5",
        name: "海",
        location: "沖縄県 那覇市",
        languages: ["日本語", "英語"],
        fee: 9500,
        specialties: ["ダイビング", "シュノーケリング"],
        rating: 4.6,
        reviewCount: 15,
        bio: "沖縄のダイビングインストラクター海です。透明度抜群の海で素晴らしい体験をお約束します。初心者の方も大歓迎です！"
      };
    } else {
      console.log(`ガイドID ${guideId} の一般デフォルトデータを生成します`);
      
      // ガイドIDに基づく地域情報の生成
      const regions = [
        { name: '東京都 渋谷区', fee: 6000 },
        { name: '大阪府 大阪市', fee: 7000 },
        { name: '京都府 京都市', fee: 8000 },
        { name: '北海道 札幌市', fee: 9000 },
        { name: '福岡県 福岡市', fee: 8000 },
        { name: '沖縄県 那覇市', fee: 10000 },
        { name: '神奈川県 横浜市', fee: 7000 },
        { name: '愛知県 名古屋市', fee: 7500 },
        { name: '広島県 広島市', fee: 8500 },
        { name: '宮城県 仙台市', fee: 9000 }
      ];
      
      // ガイド名の生成
      const lastNames = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤'];
      const firstNames = ['太郎', '花子', '一郎', '健太', '直子', '翔太', '美咲', '大輔', '香織', '拓也'];
      
      // IDに基づいて地域と名前を選択
      const idNum = isNumericId ? numericGuideId : 1;
      const regionIndex = (idNum - 1) % regions.length;
      const nameIndex = (idNum - 1) % lastNames.length;
      
      const region = regions[regionIndex];
      const name = `${lastNames[nameIndex]} ${firstNames[(nameIndex + 2) % firstNames.length]}`;
      
      guideData = {
        id: guideId,
        name: name,
        location: region.name,
        languages: ['日本語', '英語'],
        fee: region.fee,
        rating: 4.0 + (Math.random() * 1.0),
        reviewCount: 5 + Math.floor(Math.random() * 20),
        bio: `こんにちは！${region.name}在住の${name}です。地元の魅力をご案内いたします。`
      };
    }
    
    // 新しく生成したデータをローカルストレージに保存
    localStorage.setItem(`guide_${guideId}`, JSON.stringify(guideData));
    console.log(`生成したデフォルトガイドデータをローカルストレージに保存: ${guideData.name}`);
  }
  
  // 取得したガイドデータをページに表示
  displayGuideData(guideData);
  
  // 地域に応じたツアープランを表示
  generateTourPlans(guideData);
  
  // ギャラリーを生成
  generateGallery(guideData);
  
  // レビューを生成
  generateReviews(guideData);
  
  // 予約機能の有効化
  enableBookingFeatures(guideData);
  
  return guideData;
}

/**
 * ガイドデータをページに表示
 * @param {Object} guideData ガイドデータ
 */
function displayGuideData(guideData) {
  console.log('表示中のガイド名:', guideData.name);
  console.log('表示中の地域:', guideData.location);
  
  // localStorage のデータと比較（デバッグ用）
  const specificGuideKey = `guide_${guideData.id}`;
  const storedGuideJson = localStorage.getItem(specificGuideKey);
  if (storedGuideJson) {
    try {
      console.log('ローカルストレージのガイドデータ:', storedGuideJson);
      const storedGuide = JSON.parse(storedGuideJson);
      
      // 名前と場所を安全に比較
      const storedName = storedGuide.name || '';
      const storedLocation = storedGuide.location || '';
      const currentName = guideData.name || '';
      const currentLocation = guideData.location || '';
      
      if (storedName !== currentName) {
        console.warn('警告: ガイド名が一致しません');
        console.warn(`ストレージ: ${storedName} vs 表示: ${currentName}`);
      }
      
      if (storedLocation !== currentLocation) {
        console.warn('警告: 地域が一致しません');
        console.warn(`ストレージ: ${storedLocation} vs 表示: ${currentLocation}`);
      }
    } catch (e) {
      console.error(`保存されたガイドデータの解析エラー[${specificGuideKey}]:`, e);
      console.log(`問題のあるJSONデータ: ${storedGuideJson}`);
    }
  } else {
    console.log(`ローカルストレージにガイドデータ[${specificGuideKey}]が見つかりません`);
  }
  
  // 基本情報の表示
  const nameElem = document.getElementById('guide-name');
  const locationElem = document.getElementById('guide-location');
  const bioElem = document.getElementById('guide-bio');
  const feeElem = document.getElementById('guide-fee');
  
  if (nameElem) nameElem.textContent = guideData.name;
  if (locationElem) locationElem.textContent = guideData.location;
  if (bioElem && guideData.bio) bioElem.textContent = guideData.bio;
  if (feeElem && guideData.fee) feeElem.textContent = `¥${guideData.fee.toLocaleString()}`;
  
  // 言語バッジの表示
  const langJpElem = document.getElementById('guide-language-jp');
  const langEnElem = document.getElementById('guide-language-en');
  
  if (langJpElem && guideData.languages && guideData.languages.length > 0) {
    langJpElem.textContent = guideData.languages[0] || '日本語';
  }
  
  if (langEnElem && guideData.languages && guideData.languages.length > 1) {
    langEnElem.textContent = guideData.languages[1] || '英語';
  }
  
  // 評価の表示
  const ratingElem = document.getElementById('guide-rating');
  const reviewCountElem = document.getElementById('guide-review-count');
  
  if (ratingElem && guideData.rating) {
    ratingElem.textContent = guideData.rating.toFixed(1);
  }
  
  if (reviewCountElem && guideData.reviewCount) {
    reviewCountElem.textContent = `(${guideData.reviewCount}件)`;
  }
  
  // 星評価の表示
  const starsElem = document.getElementById('guide-stars');
  if (starsElem && guideData.rating) {
    starsElem.innerHTML = generateStarRating(guideData.rating);
  }
}

/**
 * 評価に応じた星アイコンHTMLを生成
 * @param {number} rating 評価（5段階）
 * @returns {string} 星アイコンのHTML
 */
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // 満星
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
  }
  
  // 半星
  if (halfStar) {
    starsHtml += '<i class="bi bi-star-half text-warning"></i>';
  }
  
  // 空星
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="bi bi-star text-warning"></i>';
  }
  
  return starsHtml;
}

/**
 * ガイドデータに基づいてツアープランを生成して表示
 * @param {Object} guideData ガイドデータ
 */
function generateTourPlans(guideData) {
  const tourPlansContainer = document.getElementById('tour-plans-container');
  if (!tourPlansContainer) return;
  
  // 既存のツアープランがあれば使用
  if (guideData.tourPlans && guideData.tourPlans.length > 0) {
    displayTourPlans(guideData.tourPlans);
    return;
  }
  
  // 地域名から都市名を抽出
  const location = guideData.location || '東京都 渋谷区';
  const locationParts = location.split(' ');
  const prefecture = locationParts[0] || '東京都';
  const city = locationParts[1] || '渋谷区';
  
  // 基本料金
  const baseFee = guideData.fee || 6000;
  
  // ツアープランを生成
  const tourPlans = [
    {
      title: `${prefecture}${city}ハイライトツアー`,
      description: `${prefecture}の魅力が詰まった${city}を巡る特別なツアーです。地元の人だけが知る隠れた名所や、観光客に人気のスポットをバランスよくご案内します。食事やショッピングなど、あなたの興味に合わせてカスタマイズも可能です。`,
      duration: '約3時間',
      capacity: '1〜4人',
      price: baseFee,
      priceUnit: '人',
      priceNote: '交通費・食事代別'
    },
    {
      title: `${prefecture}グルメ満喫ツアー`,
      description: `${prefecture}${city}の美味しいグルメスポットを巡るフードツアーです。地元の人だけが知る名店や、最新のトレンド店など、様々な食べ物を楽しむことができます。`,
      duration: '約4時間',
      capacity: '1〜3人',
      price: Math.round(baseFee * 1.2),
      priceUnit: '人',
      priceNote: '食事代3店舗分込み'
    }
  ];
  
  // 3つ目のプランをランダムに追加
  const thirdPlanTypes = [
    {
      title: `${prefecture}文化体験ツアー`,
      description: `${prefecture}の伝統文化を体験できるツアーです。伝統工芸の制作体験や、歴史的な建物の見学など、${prefecture}の文化的な側面を深く知ることができます。`,
      duration: '約5時間',
      price: Math.round(baseFee * 1.5)
    },
    {
      title: `${prefecture}自然探索ツアー`,
      description: `${prefecture}の美しい自然を探索するツアーです。地元の人しか知らない絶景スポットや、季節の花々が楽しめる場所などをご案内します。`,
      duration: '約6時間',
      price: Math.round(baseFee * 1.4)
    },
    {
      title: `${prefecture}夜景・ナイトライフツアー`,
      description: `${prefecture}の夜の魅力を体験するツアーです。美しい夜景スポットや地元の人に人気の飲食店など、夜ならではの${prefecture}を楽しめます。`,
      duration: '約4時間',
      price: Math.round(baseFee * 1.3)
    }
  ];
  
  const randomIndex = Math.floor(Math.random() * thirdPlanTypes.length);
  const thirdPlan = thirdPlanTypes[randomIndex];
  
  tourPlans.push({
    title: thirdPlan.title,
    description: thirdPlan.description,
    duration: thirdPlan.duration,
    capacity: '1〜2人',
    price: thirdPlan.price,
    priceUnit: '人',
    priceNote: '交通費・体験料込み'
  });
  
  // ツアープランを表示
  displayTourPlans(tourPlans);
}

/**
 * ツアープランを表示する
 * @param {Array} tourPlans ツアープラン配列
 */
function displayTourPlans(tourPlans) {
  const container = document.getElementById('tour-plans-container');
  if (!container) return;
  
  // 既存のコンテンツをクリア
  container.innerHTML = '';
  
  // 各ツアープランを表示
  tourPlans.forEach(plan => {
    const planCard = document.createElement('div');
    planCard.className = 'tour-plan-card mb-4 p-4 border rounded';
    planCard.innerHTML = `
      <h4 class="mb-2">${plan.title}</h4>
      <p>${plan.description}</p>
      <div class="tour-plan-details">
        <div class="detail-item">
          <i class="bi bi-clock me-2"></i> 所要時間: ${plan.duration}
        </div>
        <div class="detail-item">
          <i class="bi bi-people me-2"></i> 対応人数: ${plan.capacity}
        </div>
        <div class="detail-item price-item">
          <i class="bi bi-cash me-2"></i> 料金: ¥${plan.price.toLocaleString()}/人 (${plan.priceNote})
        </div>
      </div>
    `;
    container.appendChild(planCard);
  });
}

/**
 * ギャラリーを生成して表示
 * @param {Object} guideData ガイドデータ
 */
function generateGallery(guideData) {
  const galleryContainer = document.getElementById('guide-gallery-container');
  if (!galleryContainer) return;
  
  // 既存のギャラリーがあれば使用
  if (guideData.gallery && guideData.gallery.length > 0) {
    // ギャラリーの形式を確認
    if (typeof guideData.gallery[0] === 'string') {
      // 文字列配列の場合は変換
      const galleryData = guideData.gallery.map((url, index) => ({
        url: url,
        alt: `${guideData.location || '観光'} 画像 ${index + 1}`
      }));
      displayGallery(galleryData);
    } else {
      // オブジェクト配列の場合はそのまま表示
      displayGallery(guideData.gallery);
    }
    return;
  }
  
  // 地域名からプレースホルダー画像を生成
  const location = guideData.location || '東京';
  const encodedLocation = encodeURIComponent(location.split(' ')[0]);
  
  // ギャラリー画像を生成
  const gallery = [
    {
      url: `https://via.placeholder.com/800x600?text=${encodedLocation}+1`,
      alt: `${location} 風景1`
    },
    {
      url: `https://via.placeholder.com/800x600?text=${encodedLocation}+2`,
      alt: `${location} 風景2`
    },
    {
      url: `https://via.placeholder.com/800x600?text=${encodedLocation}+3`,
      alt: `${location} 風景3`
    },
    {
      url: `https://via.placeholder.com/800x600?text=${encodedLocation}+4`,
      alt: `${location} 風景4`
    }
  ];
  
  // ギャラリーを表示
  displayGallery(gallery);
}

/**
 * ギャラリーを表示
 * @param {Array} gallery ギャラリー配列
 */
function displayGallery(gallery) {
  const container = document.getElementById('guide-gallery-container');
  if (!container) return;
  
  // 既存のコンテンツをクリア
  container.innerHTML = '';
  
  // ギャラリーグリッドを作成
  const galleryGrid = document.createElement('div');
  galleryGrid.className = 'gallery-grid';
  
  // 写真を追加
  gallery.forEach((item, index) => {
    const imgCol = document.createElement('div');
    imgCol.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.alt;
    img.className = 'gallery-image';
    img.loading = 'lazy';
    
    imgCol.appendChild(img);
    galleryGrid.appendChild(imgCol);
  });
  
  container.appendChild(galleryGrid);
}

/**
 * レビューを生成して表示
 * @param {Object} guideData ガイドデータ
 */
function generateReviews(guideData) {
  const reviewsContainer = document.getElementById('reviews-container');
  const reviewSummaryContainer = document.getElementById('review-summary-container');
  
  if (!reviewsContainer && !reviewSummaryContainer) return;
  
  // 既存のレビューがある場合は使用
  if (guideData.reviews) {
    // レビューの形式を確認
    if (Array.isArray(guideData.reviews)) {
      // 配列の場合は概要情報に変換
      const reviewSummary = {
        average: guideData.rating || 4.0,
        count: guideData.reviews.length,
        distribution: {
          5: 50,
          4: 30,
          3: 15,
          2: 5,
          1: 0
        },
        items: guideData.reviews.map(review => ({
          authorName: review.user || review.authorName,
          authorPhoto: 'https://via.placeholder.com/50',
          rating: review.rating,
          date: review.date,
          content: review.comment || review.content
        }))
      };
      
      displayReviews(reviewSummary);
    } else {
      // オブジェクトの場合はそのまま表示
      displayReviews(guideData.reviews);
    }
    return;
  }
  
  // ガイドの基本情報からレビューを生成
  const reviewSummary = {
    average: guideData.rating || 4.0,
    count: guideData.reviewCount || 5,
    distribution: {
      5: 60,
      4: 30,
      3: 10,
      2: 0,
      1: 0
    },
    items: [
      {
        authorName: '山田 健太',
        authorPhoto: 'https://via.placeholder.com/50',
        rating: 4.5,
        date: '2023-03-15',
        content: `${guideData.name}さんのガイドは素晴らしかったです！地元の隠れた名所を案内してくれて、素敵な旅行になりました。`
      }
    ]
  };
  
  // 2つ目のレビューをランダムに追加
  const secondReviewers = [
    { name: '鈴木 美咲', rating: 5.0 },
    { name: '田中 大輔', rating: 4.0 },
    { name: '佐藤 愛', rating: 4.5 }
  ];
  
  const randomReviewer = secondReviewers[Math.floor(Math.random() * secondReviewers.length)];
  
  reviewSummary.items.push({
    authorName: randomReviewer.name,
    authorPhoto: 'https://via.placeholder.com/50',
    rating: randomReviewer.rating,
    date: '2023-02-20',
    content: `${guideData.location}の魅力を存分に教えてもらいました。${guideData.name}さんの知識が豊富で、質問にも丁寧に答えてくれました。`
  });
  
  // レビューを表示
  displayReviews(reviewSummary);
}

/**
 * レビュー概要とレビュー一覧を表示
 * @param {Object} reviews レビュー情報
 */
function displayReviews(reviews) {
  // レビュー概要を表示
  displayReviewSummary(reviews);
  
  // レビュー一覧を表示
  if (reviews.items && reviews.items.length > 0) {
    displayReviewList(reviews.items);
  }
}

/**
 * レビュー概要を表示
 * @param {Object} reviews レビュー情報
 */
function displayReviewSummary(reviews) {
  const container = document.getElementById('review-summary-container');
  if (!container) return;
  
  // 既存のコンテンツをクリア
  container.innerHTML = '';
  
  // レビュー概要情報を生成
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'review-summary row align-items-center';
  summaryDiv.innerHTML = `
    <div class="col-md-4 text-center">
      <div class="average-rating">${reviews.average.toFixed(1)}</div>
      <div>${generateStarRating(reviews.average)}</div>
      <div class="reviews-count">${reviews.count}件のレビュー</div>
    </div>
    <div class="col-md-8">
      ${generateRatingBars(reviews.distribution)}
    </div>
  `;
  
  container.appendChild(summaryDiv);
}

/**
 * 評価バーを生成
 * @param {Object} distribution 評価の分布
 * @returns {string} HTML文字列
 */
function generateRatingBars(distribution) {
  let barsHtml = '';
  
  for (let i = 5; i >= 1; i--) {
    const percentage = distribution[i] || 0;
    barsHtml += `
      <div class="rating-bar-row">
        <div class="rating-label">${i}</div>
        <div class="rating-bar-container">
          <div class="rating-bar" style="width: ${percentage}%"></div>
        </div>
        <div class="rating-percentage">${percentage}%</div>
      </div>
    `;
  }
  
  return barsHtml;
}

/**
 * レビュー一覧を表示
 * @param {Array} reviewItems レビュー一覧
 */
function displayReviewList(reviewItems) {
  const container = document.getElementById('reviews-container');
  if (!container) return;
  
  // 既存のコンテンツをクリア
  container.innerHTML = '';
  
  // レビュー一覧を生成
  reviewItems.forEach(item => {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="review-author">
          <img src="${item.authorPhoto}" alt="${item.authorName}" class="author-photo">
          <div class="author-info">
            <div class="author-name">${item.authorName}</div>
            <div class="review-date">${formatDate(item.date)}</div>
          </div>
        </div>
        <div class="review-rating">
          ${generateStarRating(item.rating)}
        </div>
      </div>
      <div class="review-content">${item.content}</div>
    `;
    container.appendChild(reviewCard);
  });
}

/**
 * 予約機能を有効化
 * @param {Object} guideData ガイドデータ
 */
function enableBookingFeatures(guideData) {
  // 料金表示の更新
  const feeDisplay = document.getElementById('guide-fee');
  if (feeDisplay && guideData.fee) {
    feeDisplay.textContent = `¥${guideData.fee.toLocaleString()}`;
  }
  
  // 予約ボタンにガイドIDを設定
  const bookingBtn = document.getElementById('booking-btn');
  if (bookingBtn) {
    bookingBtn.setAttribute('data-guide-id', guideData.id);
    
    // 予約ボタンのクリックイベント
    bookingBtn.addEventListener('click', function() {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      if (!currentUser.id) {
        // 未ログインの場合はログインモーダルを表示
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
      } else {
        // ログイン済みの場合は日付選択セクションに移動
        const dateSection = document.getElementById('date-selection-section');
        if (dateSection) {
          dateSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}

/**
 * 予約日選択のセットアップ
 */
function setupDateSelection() {
  // 予約日の選択処理
  document.querySelectorAll('.availability-date').forEach(date => {
    date.addEventListener('click', function() {
      document.querySelectorAll('.availability-date').forEach(d => {
        d.classList.remove('selected');
      });
      this.classList.add('selected');
      
      // 選択された日付に応じて時間枠を表示
      document.getElementById('time-slot-section').classList.remove('d-none');
      
      // 時間枠選択のセットアップ
      setupTimeSlotSelection();
    });
  });
}

/**
 * 時間枠選択のセットアップ
 */
function setupTimeSlotSelection() {
  document.querySelectorAll('.time-slot').forEach(timeSlot => {
    timeSlot.addEventListener('click', function() {
      // 以前に選択された時間枠があれば選択解除
      document.querySelectorAll('.time-slot').forEach(elem => {
        elem.classList.remove('selected');
      });
      
      // この時間枠を選択済みにする
      this.classList.add('selected');
      
      // 予約フォームを表示
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        bookingForm.classList.remove('d-none');
        
        // スクロール
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

/**
 * チャットフォームのセットアップ
 */
function setupChatForm() {
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const messageInput = this.querySelector('input[type="text"]');
      const messageText = messageInput.value.trim();
      
      if (messageText) {
        // 新しいメッセージを追加
        const chatBox = document.querySelector('.chat-box');
        const messageHtml = `
          <div class="clearfix mb-4">
            <div class="message-bubble sent">
              ${messageText}
            </div>
            <div class="message-time text-end">${getCurrentTime()}</div>
          </div>
        `;
        
        chatBox.insertAdjacentHTML('beforeend', messageHtml);
        
        // 入力欄をクリア
        messageInput.value = '';
        
        // 最下部にスクロール
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // 自動返信（デモ用）
        setTimeout(() => {
          const replyHtml = `
            <div class="clearfix mb-4">
              <div class="message-bubble received">
                ありがとうございます！メッセージを確認しました。できるだけ早くご返信いたします。
              </div>
              <div class="message-time">${getCurrentTime()}</div>
            </div>
          `;
          
          chatBox.insertAdjacentHTML('beforeend', replyHtml);
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
      }
    });
  }
}

/**
 * 予約フォームのセットアップ
 */
function setupBookingForm() {
  const bookingForm = document.querySelector('#booking-form form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const participants = document.getElementById('booking-participants').value;
      const request = document.getElementById('booking-request').value;
      
      // 予約データの取得（実際はAPIに送信）
      const bookingData = {
        guideId: new URLSearchParams(window.location.search).get('id') || '1',
        date: document.querySelector('.availability-date.selected strong')?.textContent || '選択された日付なし',
        time: document.querySelector('.time-slot.selected')?.textContent || '選択された時間なし',
        participants: participants,
        request: request,
        userId: JSON.parse(sessionStorage.getItem('currentUser') || '{}').id
      };
      
      console.log('予約データ:', bookingData);
      
      // 成功メッセージを表示
      alert('予約リクエストが送信されました。ガイドからの確認をお待ちください。');
      
      // 予約後はチャットタブに移動して詳細を相談できるようにする
      const chatTab = document.getElementById('chat-tab');
      if (chatTab) chatTab.click();
    });
  }
}

/**
 * ギャラリー画像モーダルの設定
 */
function setupGalleryModals() {
  // ギャラリー画像クリックでモーダル表示
  document.querySelectorAll('.gallery-image').forEach(img => {
    img.addEventListener('click', function() {
      const imgSrc = this.src;
      const imgAlt = this.alt;
      
      // モーダルがなければ作成
      let galleryModal = document.getElementById('galleryModal');
      if (!galleryModal) {
        const modalHtml = `
          <div class="modal fade" id="galleryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">ギャラリー</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                  <img id="galleryModalImage" class="img-fluid rounded" alt="">
                </div>
              </div>
            </div>
          </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        galleryModal = document.getElementById('galleryModal');
      }
      
      // モーダル内の画像を更新
      const modalImg = document.getElementById('galleryModalImage');
      if (modalImg) {
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;
      }
      
      // モーダルを表示
      const bsModal = new bootstrap.Modal(galleryModal);
      bsModal.show();
    });
  });
}

/**
 * ページ内のアラート要素をチェックする
 */
function checkAlertElements() {
  // アラートコンテナがなければ作成
  if (!document.getElementById('alert-container')) {
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.className = 'alert-container';
    const container = document.querySelector('.container');
    if (container) {
      container.prepend(alertContainer);
    }
  }
}

/**
 * 日付をフォーマット
 * @param {string} dateStr 日付文字列
 * @returns {string} フォーマット済み日付
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr; // 変換できない場合はそのまま返す
  }
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * 現在時刻を取得（HH:MM形式）
 */
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}