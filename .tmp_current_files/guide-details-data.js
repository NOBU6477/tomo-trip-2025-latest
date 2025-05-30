/**
 * ガイド詳細ページのデータ読み込みと表示を管理する
 */
document.addEventListener('DOMContentLoaded', function() {
  // URLからガイドIDを取得
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('id') || '1'; // デフォルトは1

  // ガイド情報をAPIから取得（現段階ではモックデータ）
  loadGuideData(guideId);
});

/**
 * ガイド情報を読み込む
 * @param {string} guideId ガイドID
 */
function loadGuideData(guideId) {
  // 実際の実装ではAPIからデータを取得
  // 現時点ではモックデータを使用
  const guideData = getGuideData(guideId);
  
  // ガイド情報を表示
  displayGuideInfo(guideData);
  
  // パンくずリストを更新
  updateBreadcrumb(guideData);
  
  // マップを更新
  updateMap(guideData);
  
  // ツアープラン例を表示
  displayTourPlans(guideData.tourPlans);
  
  // 写真ギャラリーを表示
  displayGallery(guideData.gallery);
  
  // レビューを表示
  displayReviews(guideData.reviews);
}

/**
 * ガイド基本情報を表示
 * @param {Object} guideData ガイドデータ
 */
function displayGuideInfo(guideData) {
  // 基本情報
  const nameElement = document.getElementById('guide-name');
  if (nameElement) {
    nameElement.textContent = guideData.name;
  } else {
    console.warn('guide-name要素が見つかりません');
  }

  const locationElement = document.getElementById('guide-location');
  if (locationElement) {
    locationElement.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${guideData.location}`;
  } else {
    console.warn('guide-location要素が見つかりません');
  }
  
  // 言語
  const langContainer = document.getElementById('guide-languages');
  if (langContainer) {
    langContainer.innerHTML = '';
    guideData.languages.forEach(lang => {
      const badge = document.createElement('span');
      badge.className = 'badge bg-white text-dark me-1';
      badge.textContent = lang;
      langContainer.appendChild(badge);
    });
  } else {
    console.warn('guide-languages要素が見つかりません');
  }
  
  // 評価
  const ratingText = `${guideData.rating} (${guideData.reviewCount}件のレビュー)`;
  const ratingElement = document.getElementById('guide-rating');
  if (ratingElement) {
    ratingElement.textContent = ratingText;
  } else {
    console.warn('guide-rating要素が見つかりません');
  }
  
  // 自己紹介
  const bioElement = document.getElementById('guide-bio');
  if (bioElement) {
    bioElement.textContent = guideData.bio;
  } else {
    console.warn('guide-bio要素が見つかりません');
  }
  
  // 得意分野
  const specialtiesContainer = document.getElementById('guide-specialties');
  if (specialtiesContainer) {
    specialtiesContainer.innerHTML = '';
    guideData.specialties.forEach(specialty => {
      const span = document.createElement('span');
      span.className = 'guide-badge';
      span.textContent = specialty;
      specialtiesContainer.appendChild(span);
    });
  } else {
    console.warn('guide-specialties要素が見つかりません');
  }
  
  // 料金
  const feeElement = document.getElementById('guide-fee');
  if (feeElement) {
    feeElement.textContent = `¥${guideData.fee.toLocaleString()} / セッション`;
  } else {
    console.warn('guide-fee要素が見つかりません');
  }
  
  // 予約リンク
  const bookingLink = document.querySelector('.btn-primary.btn-lg');
  if (bookingLink) {
    bookingLink.href = `booking-payment.html?guide_id=${guideData.id}`;
  }
}

/**
 * パンくずリストを更新
 * @param {Object} guideData ガイドデータ
 */
function updateBreadcrumb(guideData) {
  const breadcrumb = document.getElementById('guide-breadcrumb');
  if (!breadcrumb) {
    console.warn('guide-breadcrumb要素が見つかりません');
    return;
  }
  
  const locationParts = guideData.location.split(' ');
  
  // リセット
  breadcrumb.innerHTML = '<a href="index.html" class="text-white-50">ホーム</a> &gt; ';
  
  // 都道府県
  if (locationParts.length > 0) {
    breadcrumb.innerHTML += `<a href="#" class="text-white-50">${locationParts[0]}</a> &gt; `;
  }
  
  // 市町村など
  if (locationParts.length > 1) {
    breadcrumb.innerHTML += `<a href="#" class="text-white-50">${locationParts[1]}</a> &gt; `;
  }
  
  // ガイド名
  breadcrumb.innerHTML += `<span class="text-white">${guideData.name} ガイド</span>`;
}

/**
 * 地図を更新
 * @param {Object} guideData ガイドデータ
 */
function updateMap(guideData) {
  const mapContainer = document.getElementById('guide-map-container');
  if (!mapContainer) {
    console.warn('guide-map-container要素が見つかりません');
    return;
  }
  
  // 地図埋め込みコードを生成
  const iframe = document.createElement('iframe');
  iframe.src = guideData.mapEmbedUrl;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  
  // プレースホルダーと置き換え
  mapContainer.innerHTML = '';
  mapContainer.appendChild(iframe);
}

/**
 * ツアープラン例を表示
 * @param {Array} tourPlans ツアープラン情報
 */
function displayTourPlans(tourPlans) {
  const container = document.getElementById('tour-plans-container');
  if (!container) {
    console.warn('tour-plans-container要素が見つかりません');
    return;
  }
  
  container.innerHTML = '';
  
  tourPlans.forEach(plan => {
    const card = document.createElement('div');
    card.className = 'card mb-4';
    
    card.innerHTML = `
      <div class="card-body">
        <h4 class="card-title">${plan.title}</h4>
        <p class="card-text">${plan.description}</p>
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item"><i class="bi bi-clock me-2"></i>所要時間: ${plan.duration}</li>
          <li class="list-group-item"><i class="bi bi-people me-2"></i>対応人数: ${plan.capacity}</li>
          <li class="list-group-item"><i class="bi bi-currency-yen me-2"></i>料金: ¥${plan.price.toLocaleString()}/${plan.priceUnit} ${plan.priceNote ? `(${plan.priceNote})` : ''}</li>
        </ul>
      </div>
    `;
    
    container.appendChild(card);
  });
}

/**
 * ギャラリーを表示
 * @param {Array} gallery ギャラリー写真情報
 */
function displayGallery(gallery) {
  const container = document.getElementById('guide-gallery-container');
  if (!container) {
    console.warn('guide-gallery-container要素が見つかりません');
    return;
  }
  
  // ギャラリーコンテナ作成
  const galleryRow = document.createElement('div');
  galleryRow.className = 'row g-3';
  
  // 画像を追加
  gallery.forEach(image => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4';
    
    const img = document.createElement('img');
    img.src = image.url;
    img.className = 'img-fluid gallery-image';
    img.alt = image.alt;
    
    col.appendChild(img);
    galleryRow.appendChild(col);
  });
  
  // コンテナに追加
  container.innerHTML = '';
  container.appendChild(galleryRow);
  
  // クリックで拡大表示
  setupGalleryZoom();
}

/**
 * ギャラリー画像クリックで拡大表示
 */
function setupGalleryZoom() {
  const galleryImages = document.querySelectorAll('.gallery-image');
  
  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      // モーダルの作成
      const modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'galleryModal';
      modal.setAttribute('tabindex', '-1');
      modal.setAttribute('aria-hidden', 'true');
      
      // モーダルの中身
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <img src="${this.src}" class="img-fluid" alt="${this.alt}">
            </div>
          </div>
        </div>
      `;
      
      // ページに追加して表示
      document.body.appendChild(modal);
      const modalObj = new bootstrap.Modal(modal);
      modalObj.show();
      
      // モーダルが非表示になったら削除
      modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
      });
    });
  });
}

/**
 * レビュー概要とレビュー一覧を表示
 * @param {Object} reviews レビュー情報
 */
function displayReviews(reviews) {
  // レビュー概要
  displayReviewSummary(reviews);
  
  // レビュー一覧
  displayReviewList(reviews.items);
}

/**
 * レビュー概要を表示
 * @param {Object} reviews レビュー情報
 */
function displayReviewSummary(reviews) {
  const container = document.getElementById('review-summary-container');
  if (!container) {
    console.warn('review-summary-container要素が見つかりません');
    return;
  }
  
  const summary = document.createElement('div');
  summary.className = 'card mb-4';
  
  summary.innerHTML = `
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-md-4 text-center text-md-start">
          <h4 class="mb-0">${reviews.average}</h4>
          <div class="text-warning">
            ${getStarIcons(reviews.average)}
          </div>
          <p class="text-muted">${reviews.count}件のレビュー</p>
        </div>
        <div class="col-md-8">
          ${generateRatingBars(reviews.distribution)}
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = '';
  container.appendChild(summary);
}

/**
 * 評価バーを生成
 * @param {Object} distribution 評価の分布
 * @returns {string} HTML文字列
 */
function generateRatingBars(distribution) {
  let html = '';
  
  // 5→1の順に評価バーを生成
  for (let i = 5; i >= 1; i--) {
    const percent = distribution[i] || 0;
    
    html += `
      <div class="mb-2">
        <div class="d-flex align-items-center">
          <div class="text-warning me-2">
            ${getStarIcons(i)}
          </div>
          <div class="progress flex-grow-1" style="height: 5px;">
            <div class="progress-bar bg-primary" style="width: ${percent}%;"></div>
          </div>
          <span class="ms-2">${percent}%</span>
        </div>
      </div>
    `;
  }
  
  return html;
}

/**
 * レビュー一覧を表示
 * @param {Array} reviewItems レビュー一覧
 */
function displayReviewList(reviewItems) {
  const container = document.getElementById('reviews-container');
  if (!container) {
    console.warn('reviews-container要素が見つかりません');
    return;
  }
  
  const reviewList = document.createElement('div');
  reviewList.className = 'review-list';
  
  // レビューがない場合
  if (!reviewItems || reviewItems.length === 0) {
    reviewList.innerHTML = '<p class="text-muted text-center">まだレビューがありません。</p>';
    container.innerHTML = '';
    container.appendChild(reviewList);
    return;
  }
  
  // レビュー項目を追加
  reviewItems.forEach(review => {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    reviewCard.innerHTML = `
      <div class="d-flex">
        <img src="${review.authorPhoto}" class="rounded-circle me-3" alt="レビュアーのアバター" style="width: 50px; height: 50px; object-fit: cover;">
        <div>
          <h5 class="mb-1">${review.authorName}</h5>
          <div class="text-warning mb-2">
            ${getStarIcons(review.rating)}
          </div>
          <p class="text-muted small mb-2">${formatDate(review.date)}</p>
          <p>${review.content}</p>
        </div>
      </div>
    `;
    
    reviewList.appendChild(reviewCard);
  });
  
  container.innerHTML = '';
  container.appendChild(reviewList);
}

/**
 * 日付をフォーマット
 * @param {string} dateStr 日付文字列
 * @returns {string} フォーマット済み日付
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}

/**
 * 評価に応じた星アイコンを生成
 * @param {number} rating 評価
 * @returns {string} 星アイコンのHTML
 */
function getStarIcons(rating) {
  let stars = '';
  
  // 整数部分
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="bi bi-star-fill"></i>';
  }
  
  // 半分星
  if (rating % 1 >= 0.5) {
    stars += '<i class="bi bi-star-half"></i>';
  }
  
  // 空の星
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="bi bi-star"></i>';
  }
  
  return stars;
}

/**
 * ガイド詳細ページ読み込み時にデータを取得して表示
 * @param {string} guideId ガイドID
 */
function loadGuideData(guideId) {
  console.log(`loadGuideData: ID=${guideId}のデータを読み込み中...`);
  
  // ガイドデータを取得
  const guideData = getGuideData(guideId);
  
  if (guideData) {
    console.log('ガイドデータを取得しました:', guideData);
    
    // ツアープランの表示
    if (guideData.tourPlans) {
      displayTourPlans(guideData.tourPlans);
    } else {
      console.warn('ツアープランが見つかりません');
    }
    
    // ギャラリーの表示
    if (guideData.gallery) {
      displayGallery(guideData.gallery);
    } else {
      console.warn('ギャラリーデータが見つかりません');
    }
    
    // レビューの表示
    if (guideData.reviews) {
      displayReviews(guideData.reviews);
    } else {
      console.warn('レビューデータが見つかりません');
    }
    
    // マップの表示
    if (guideData.mapEmbedUrl) {
      updateMap({ mapEmbedUrl: guideData.mapEmbedUrl });
    } else {
      console.warn('マップURLが見つかりません');
    }
    
    // パンくずリストの更新
    updateBreadcrumb(guideData);
    
    return true;
  } else {
    console.error(`ガイドID=${guideId}のデータ取得に失敗しました`);
    return false;
  }
}

/**
 * ガイドデータを取得する（モックデータ）
 * 実際の実装ではAPIからデータを取得
 * @param {string} guideId ガイドID
 * @returns {Object} ガイドデータ
 */
function getGuideData(guideId) {
  console.log(`getGuideData関数を呼び出し: ID=${guideId}`);
  
  // まずローカルストレージからガイド一覧を取得
  const guidesListJson = localStorage.getItem('guidesData');
  if (guidesListJson) {
    try {
      console.log('guidesDataを確認中');
      const guidesList = JSON.parse(guidesListJson);
      // guideIdに一致するガイドを探す
      const matchedGuide = guidesList.find(g => g.id.toString() === guideId.toString());
      if (matchedGuide) {
        console.log('ローカルストレージのguidesDataから一致するガイドを見つけました:', matchedGuide);
        
        // 地域に応じたマップURLを生成
        let mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.077075076452!2d139.7054226!3d35.6618627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b40bad52785%3A0x58da34a43f765ac9!2z5riL6LC36aeF!5e0!3m2!1sja!2sjp!4v1682512389263!5m2!1sja!2sjp';
        
        // 地域に基づいたツアープランを作成
        const locationText = matchedGuide.location || '東京都 渋谷区';
        const isShinjuku = locationText.includes('新宿');
        const isYokohama = locationText.includes('横浜');
        const isTokyo = locationText.includes('東京');
        
        const cityName = isTokyo ? '東京' : (isYokohama ? '横浜' : locationText.split(' ')[0]);
        const areaName = locationText.split(' ')[1] || '中心部';
        
        const tourPlans = [
          {
            title: `${cityName}${areaName}文化体験ツアー`,
            description: `${cityName}の魅力発信地である${areaName}を巡るツアーです。最新のファッション、カフェ、アート、そして地元の文化の中心地を体験できます。インスタ映えするスポットも多数ご案内します。`,
            duration: '約3時間',
            capacity: '1〜4人',
            price: matchedGuide.fee || 6000,
            priceUnit: '人',
            priceNote: '交通費・食事代別'
          },
          {
            title: `${cityName}グルメ満喫ツアー`,
            description: `${cityName}${areaName}の人気グルメスポットを巡るフードツアーです。地元の人だけが知る名店や、最新のトレンド店など、様々な食べ物を楽しむことができます。`,
            duration: '約4時間',
            capacity: '1〜3人',
            price: (matchedGuide.fee || 6000) * 1.25, // 少し高めの料金設定
            priceUnit: '人',
            priceNote: '食事代込み'
          }
        ];
        
        // 拡張されたデータを作成
        const enhancedGuide = {
          ...matchedGuide,
          mapEmbedUrl: mapUrl,
          feeType: 'session',
          tourPlans: tourPlans,
          gallery: [
            {
              url: `https://placehold.co/800x600?text=${encodeURIComponent(cityName)}+1`,
              alt: `${cityName}の風景1`
            },
            {
              url: `https://placehold.co/800x600?text=${encodeURIComponent(cityName)}+2`,
              alt: `${cityName}の風景2`
            },
            {
              url: `https://placehold.co/800x600?text=${encodeURIComponent(cityName)}+3`,
              alt: `${cityName}の風景3`
            }
          ],
          reviews: {
            average: matchedGuide.rating || 4.0,
            count: matchedGuide.reviewCount || 5,
            distribution: {
              5: 60,
              4: 30,
              3: 10,
              2: 0,
              1: 0
            },
            items: [
              {
                authorName: 'ジョン・スミス',
                authorPhoto: 'https://placehold.co/50',
                rating: 5,
                date: '2023-03-15',
                content: `${matchedGuide.name}さんのガイドツアーは素晴らしかったです！${cityName}の隠れた名所を案内してくれて、とても思い出深い旅行になりました。`
              }
            ]
          }
        };
        
        console.log('拡張されたガイドデータを返します:', enhancedGuide);
        return enhancedGuide;
      }
    } catch (e) {
      console.error('guidesDataの解析に失敗しました:', e);
    }
  }
  
  // 個別のガイドデータをチェック（id=10などの直接アクセス用）
  const specificGuideData = localStorage.getItem(`guide_${guideId}`);
  if (specificGuideData) {
    try {
      const parsedData = JSON.parse(specificGuideData);
      console.log(`guide_${guideId}から読み込みました:`, parsedData);
      
      // 他の必要な情報を追加
      const enhancedGuide = {
        ...parsedData,
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.077075076452!2d139.7054226!3d35.6618627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b40bad52785%3A0x58da34a43f765ac9!2z5riL6LC36aeF!5e0!3m2!1sja!2sjp!4v1682512389263!5m2!1sja!2sjp',
        feeType: 'session',
        // 地域に基づいたツアープランを作成
        tourPlans: [
          {
            title: '地域カスタムツアー',
            description: '訪問者のリクエストに合わせたカスタムツアーです。',
            duration: '約3時間',
            capacity: '1〜4人',
            price: parsedData.fee || 6000,
            priceUnit: '人',
            priceNote: '交通費・食事代別'
          }
        ],
        gallery: [
          {
            url: 'https://placehold.co/800x600?text=Custom+Tour+1',
            alt: 'カスタムツアー画像1'
          },
          {
            url: 'https://placehold.co/800x600?text=Custom+Tour+2',
            alt: 'カスタムツアー画像2'
          },
          {
            url: 'https://placehold.co/800x600?text=Custom+Tour+3',
            alt: 'カスタムツアー画像3'
          }
        ],
        reviews: {
          average: parsedData.rating || 4.0,
          count: parsedData.reviewCount || 0,
          distribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          },
          items: []
        }
      };
      
      return enhancedGuide;
    } catch (e) {
      console.error(`guide_${guideId}の解析に失敗しました:`, e);
    }
  }
  
  // モックデータを使用（最終手段）
  console.log(`getGuideDataでモックデータを使用します。リクエストID=${guideId}`);
  
  // ガイドIDに応じた適切なモックデータを生成
  const guideIdNum = parseInt(guideId, 10) || 1; // 数値変換できない場合は1をデフォルトとする
  const locationData = [
    { city: '東京都', area: '渋谷区' },
    { city: '大阪府', area: '大阪市' },
    { city: '京都府', area: '京都市' },
    { city: '北海道', area: '札幌市' },
    { city: '福岡県', area: '福岡市' },
    { city: '沖縄県', area: '那覇市' },
    { city: '神奈川県', area: '横浜市' },
    { city: '愛知県', area: '名古屋市' },
    { city: '広島県', area: '広島市' },
    { city: '宮城県', area: '仙台市' }
  ];
  
  // IDに基づいて場所を選択
  const locationIndex = (guideIdNum - 1) % locationData.length;
  const location = locationData[locationIndex];
  const fullLocation = `${location.city} ${location.area}`;
  
  // ガイド名を生成（IDごとに変化）
  const firstNames = ['太郎', '花子', '一郎', '健太', '直子', '翔', '美咲', '大輔', '香織', '拓也'];
  const lastNames = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '山本', '渡辺', '中村', '小林', '加藤'];
  const nameIndex = (guideIdNum - 1) % firstNames.length;
  const lastName = lastNames[nameIndex];
  const firstName = firstNames[(nameIndex + 3) % firstNames.length];
  const fullName = `${lastName} ${firstName}`;
  
  // IDごとに異なる手数料を設定
  const fees = [6000, 8000, 10000, 12000, 7000, 9000, 11000, 15000, 18000, 20000];
  const fee = fees[(guideIdNum - 1) % fees.length];
  
  // 専門分野のリスト
  const allSpecialties = [
    'グルメ', '写真スポット', 'ナイトツアー', 'ローカル体験', 
    'アート', '博物館', '伝統文化', 'ショッピング',
    '建築', '自然', 'アクティビティ', '歴史', '音楽'
  ];
  
  // IDに基づいて専門分野を3-4つ選択
  const specialtyCount = 3 + (guideIdNum % 2); // 3か4
  const specialties = [];
  for (let i = 0; i < specialtyCount; i++) {
    const index = (guideIdNum + i) % allSpecialties.length;
    specialties.push(allSpecialties[index]);
  }
  
  // 言語
  const allLanguages = ['日本語', '英語', '中国語', '韓国語', 'フランス語', 'スペイン語', 'ドイツ語', 'イタリア語'];
  const languageCount = 1 + (guideIdNum % 3); // 1-3言語
  const languages = ['日本語']; // 必ず日本語は含む
  for (let i = 1; i < languageCount; i++) {
    const index = (guideIdNum + i) % (allLanguages.length - 1) + 1; // 日本語を除く
    languages.push(allLanguages[index]);
  }
  
  // ランダムな評価を生成
  const randomRating = 3.5 + (guideIdNum % 5) * 0.3;
  const rating = Math.round(randomRating * 10) / 10; // 小数点第1位までの評価
  const reviewCount = 5 + (guideIdNum * 3) % 15;
  
  // 自己紹介文を生成
  const bio = `こんにちは！私は${location.city}${location.area}在住の${fullName}です。${3 + (guideIdNum % 8)}年間にわたり、様々な観光客の方々をご案内してきました。${location.area}の魅力を存分に味わっていただくため、地元ならではの視点でツアーをご提供します。${languages.join('と')}でのガイドが可能ですので、お気軽にご連絡ください。`;
  
  // 地域に基づいたツアープランを生成
  const tourPlans = [
    {
      title: `${location.city}${location.area}探索ツアー`,
      description: `${location.city}の魅力が詰まった${location.area}を巡る特別プランです。地元の人だけが知る隠れた名所や、観光客にも人気のスポットをバランスよくご案内します。食事やショッピングなど、あなたの興味に合わせてカスタマイズも可能です。`,
      duration: '約4時間',
      capacity: '1〜4人',
      price: fee,
      priceUnit: '人',
      priceNote: '交通費・食事代別'
    },
    {
      title: `${location.city}グルメ探訪ツアー`,
      description: `${location.city}${location.area}の美味しいグルメを巡るフードツアーです。地元の名店や人気店を訪れ、${location.city}ならではの味を堪能できます。お客様の好みや予算に合わせて、様々な飲食店をご紹介します。`,
      duration: '約3時間',
      capacity: '1〜3人',
      price: Math.round(fee * 1.2),
      priceUnit: '人',
      priceNote: '食事代込み'
    }
  ];
  
  // ギャラリー画像を生成
  const gallery = [
    {
      url: `https://placehold.co/800x600?text=${encodeURIComponent(location.city)}+1`,
      alt: `${location.city}の風景1`
    },
    {
      url: `https://placehold.co/800x600?text=${encodeURIComponent(location.city)}+2`,
      alt: `${location.city}の風景2`
    },
    {
      url: `https://placehold.co/800x600?text=${encodeURIComponent(location.city)}+3`,
      alt: `${location.city}の風景3`
    },
    {
      url: `https://placehold.co/800x600?text=${encodeURIComponent(location.city)}+4`,
      alt: `${location.city}の風景4`
    }
  ];
  
  // レビューを生成
  const reviewNames = ['佐々木', '小野', '藤田', '安田', '木村', '林', '清水', '石田', '川口', '橋本'];
  const reviewerName = reviewNames[(guideIdNum + 3) % reviewNames.length];
  
  const reviews = {
    average: rating,
    count: reviewCount,
    distribution: {
      5: 50,
      4: 30,
      3: 15,
      2: 5,
      1: 0
    },
    items: [
      {
        authorName: `${reviewerName}様`,
        authorPhoto: 'https://placehold.co/50',
        rating: 5,
        date: '2023-03-15',
        content: `${fullName}さんのガイドは素晴らしかったです！${location.city}の隠れた名所を案内してくれて、現地の魅力を十分に堪能できました。また機会があればお願いしたいと思います。`
      }
    ]
  };
  
  // 完成したガイドデータを作成
  const mockGuideData = {
    id: guideId,
    name: fullName,
    location: fullLocation,
    languages: languages,
    rating: rating,
    reviewCount: reviewCount,
    bio: bio,
    specialties: specialties,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.077075076452!2d139.7054226!3d35.6618627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b40bad52785%3A0x58da34a43f765ac9!2z5riL6LC36aeF!5e0!3m2!1sja!2sjp!4v1682512389263!5m2!1sja!2sjp',
    fee: fee,
    feeType: 'session',
    tourPlans: tourPlans,
    gallery: gallery,
    reviews: reviews
  };
  
  console.log('モックガイドデータを生成しました:', mockGuideData);
  return mockGuideData;
      reviews: {
        average: 4.5,
        count: 12,
        distribution: {
          5: 70,
          4: 20,
          3: 10,
          2: 0,
          1: 0
        },
        items: [
          {
            authorName: 'John Doe',
            authorPhoto: 'https://placehold.co/50',
            rating: 5,
            date: '2023-03-15',
            content: '加藤さんは素晴らしいガイドでした！与那国島の隠れた名所を案内してくれて、とても思い出深い旅行になりました。特に海中遺跡の案内が素晴らしく、SNSにアップしたら多くの人に好評でした。次回も必ずお願いしたいと思います！'
          },
          {
            authorName: 'Jane Smith',
            authorPhoto: 'https://placehold.co/50',
            rating: 4,
            date: '2023-02-20',
            content: 'とても親切で知識豊富なガイドさんでした。私が興味を持った与那国島の歴史や文化について時間をかけて丁寧に説明してくれ、柔軟に対応してくれました。観光客があまり行かない地元の美味しい海鮮料理店にも連れて行ってくれて、沖縄の食文化を深く体験できました。星4つの理由は、当日少し遅れてしまったことだけです。それ以外は完璧でした！'
          },
          {
            authorName: 'Carlos Rodriguez',
            authorPhoto: 'https://placehold.co/50',
            rating: 4.5,
            date: '2023-01-05',
            content: '家族で与那国島を訪れた際にお世話になりました。子供連れに配慮したプランを提案してくれて、子供たちも飽きることなく一日中楽しめました。与那国島の自然体験アクティビティが特に良かったです。また、地元の食べ歩きスポット選びや、海中遺跡の見学の仕方なども丁寧に教えていただきました！'
          }
        ]
      }
    },
    // ガイドID=2の場合のデータ
    '2': {
      id: '2',
      name: '山田 太郎',
      location: '北海道 札幌市',
      languages: ['日本語', '英語', '中国語'],
      rating: 4.8,
      reviewCount: 24,
      bio: '北海道札幌市を中心に活動している山田太郎です。北海道の四季折々の自然や食の魅力をお伝えすることが私の喜びです。特に冬の雪景色やウィンタースポーツ、夏の涼しい気候と美しい自然、そして一年中楽しめる新鮮な海の幸と大地の恵みを活かした料理の数々をご案内します。英語と中国語も話せるので、海外からのお客様も安心してご利用いただけます。',
      specialties: ['北海道グルメツアー', 'ウィンタースポーツ', '温泉巡り', '自然体験', '市場散策'],
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92894.37397916365!2d141.26075565!3d43.05783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f0ad4755a973f27%3A0x33937e9d4bb30c24!2z5YyX5rW36YGT5pyt5bmM5biC!5e0!3m2!1sja!2sjp!4v1682512752357!5m2!1sja!2sjp',
      fee: 7000,
      feeType: 'session',
      tourPlans: [
        {
          title: '札幌市内グルメ探訪ツアー',
          description: '札幌の街を歩きながら、地元で人気の名店を巡るグルメツアーです。新鮮な海鮮丼、ジンギスカン、スープカレー、味噌ラーメンなど、北海道ならではの名物料理を楽しみます。また、札幌市中央卸売市場では市場の活気ある雰囲気を感じながら、季節の食材や珍しい海産物も見ることができます。',
          duration: '約5時間',
          capacity: '1〜4人',
          price: 12000,
          priceUnit: '人',
          priceNote: '食事代別'
        },
        {
          title: '札幌冬の絶景スノーアクティビティ',
          description: '冬の札幌を満喫するスノーアクティビティツアーです。札幌市内から車で約40分の場所にあるスキー場で、スキーやスノーボードを楽しめます。初心者には基本的な滑り方も指導します。また、雪まつり期間中は大通公園の氷像鑑賞も組み込み、夜は雪景色をバックに綺麗なイルミネーションを観賞します。',
          duration: '約8時間',
          capacity: '1〜3人',
          price: 15000,
          priceUnit: '人',
          priceNote: 'リフト券・機材レンタル料別'
        }
      ],
      gallery: [
        {
          url: 'https://placehold.co/800x600?text=Sapporo+1',
          alt: '札幌の風景1'
        },
        {
          url: 'https://placehold.co/800x600?text=Sapporo+2',
          alt: '札幌の風景2'
        },
        {
          url: 'https://placehold.co/800x600?text=Sapporo+3',
          alt: '札幌の風景3'
        },
        {
          url: 'https://placehold.co/800x600?text=Sapporo+4',
          alt: '札幌の風景4'
        },
        {
          url: 'https://placehold.co/800x600?text=Sapporo+5',
          alt: '札幌の風景5'
        },
        {
          url: 'https://placehold.co/800x600?text=Sapporo+6',
          alt: '札幌の風景6'
        }
      ],
      reviews: {
        average: 4.8,
        count: 24,
        distribution: {
          5: 80,
          4: 15,
          3: 5,
          2: 0,
          1: 0
        },
        items: [
          {
            authorName: 'David Wilson',
            authorPhoto: 'https://placehold.co/50',
            rating: 5,
            date: '2023-02-12',
            content: '山田さんのガイドで札幌を訪れたのは正解でした！冬の札幌の美しさを存分に体験できただけでなく、地元の方しか知らないような美味しいレストランや素晴らしい景色のスポットに連れて行ってもらいました。特に夜の雪景色とイルミネーションの組み合わせは感動的でした。'
          },
          {
            authorName: 'Emily Chen',
            authorPhoto: 'https://placehold.co/50',
            rating: 5,
            date: '2023-01-28',
            content: '山田さんは素晴らしいガイドです！流暢な中国語で案内してくれただけでなく、私たちの好みに合わせた柔軟なプランを提案してくれました。特に市場での海鮮丼の体験は忘れられない思い出です。次回は夏に北海道を訪れる予定ですので、またお願いしたいと思います。'
          },
          {
            authorName: 'Michael Brown',
            authorPhoto: 'https://placehold.co/50',
            rating: 4,
            date: '2022-12-15',
            content: '北海道の冬を体験するには最高のガイドでした。スキーのレッスンも丁寧で、初めてでも楽しく滑ることができました。ただ、予定していた雪祭りのイベントが天候の影響で一部中止になったのは残念でした（もちろんガイドさんのせいではありません）。代わりの観光地を素早く提案してくれて臨機応変な対応に感謝しています。'
          }
        ]
      }
    }
  };
  
  // ガイドIDに該当するデータを返す、なければデフォルト値
  return guides[guideId] || guides['1'];
}