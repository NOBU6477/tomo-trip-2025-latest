/**
 * ガイド詳細ページのデータファイル - 安定バージョン
 * このファイルはガイド詳細ページで使用される高品質なデータ提供を行います
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
  try {
    console.log(`loadGuideData: ID=${guideId}のデータを読み込み中...`);
    
    // ガイドデータを取得
    const guideData = getGuideData(guideId);
    
    if (guideData) {
      console.log('ガイドデータを取得しました:', guideData);
      
      // 基本情報表示
      displayGuideInfo(guideData);
      
      // パンくずリストを更新
      updateBreadcrumb(guideData);
      
      // マップを更新
      if (guideData.mapEmbedUrl) {
        updateMap(guideData);
      } else {
        console.warn('マップURLが見つかりません');
      }
      
      // ツアープランの表示
      if (guideData.tourPlans && guideData.tourPlans.length > 0) {
        displayTourPlans(guideData.tourPlans);
      } else {
        console.warn('ツアープランが見つかりません。デフォルトデータを使用します。');
        const defaultPlans = generateDefaultTourPlans(guideData);
        displayTourPlans(defaultPlans);
      }
      
      // ギャラリーの表示
      if (guideData.gallery && guideData.gallery.length > 0) {
        displayGallery(guideData.gallery);
      } else {
        console.warn('ギャラリーデータが見つかりません。デフォルトデータを使用します。');
        const defaultGallery = generateDefaultGallery(guideData);
        displayGallery(defaultGallery);
      }
      
      // レビューの表示
      if (guideData.reviews) {
        displayReviews(guideData.reviews);
      } else {
        console.warn('レビューデータが見つかりません。デフォルトデータを使用します。');
        const defaultReviews = generateDefaultReviews(guideData);
        displayReviews(defaultReviews);
      }
      
      return true;
    } else {
      console.error(`ガイドID=${guideId}のデータ取得に失敗しました`);
      return false;
    }
  } catch (e) {
    console.error('ガイドデータ読み込みエラー:', e);
    return false;
  }
}

/**
 * ガイドデータを取得する
 * @param {string} guideId ガイドID
 * @returns {Object} ガイドデータ
 */
function getGuideData(guideId) {
  console.log(`getGuideData関数を呼び出し: ID=${guideId}`);
  
  // 個別のガイドデータをローカルストレージから取得
  const specificGuideKey = `guide_${guideId}`;
  const guideJson = localStorage.getItem(specificGuideKey);
  
  if (guideJson) {
    try {
      console.log(`個別のガイドデータ[${specificGuideKey}]を見つけました`);
      return JSON.parse(guideJson);
    } catch (e) {
      console.error(`個別のガイドデータ[${specificGuideKey}]の解析エラー:`, e);
    }
  }
  
  // 個別データがない場合はリストから探す
  const guidesListJson = localStorage.getItem('guidesData');
  if (guidesListJson) {
    try {
      console.log('guidesDataを確認中');
      const guidesList = JSON.parse(guidesListJson);
      // guideIdに一致するガイドを探す
      const matchedGuide = guidesList.find(g => g.id.toString() === guideId.toString());
      if (matchedGuide) {
        console.log('ローカルストレージのguidesDataから一致するガイドを見つけました:', matchedGuide.name);
        return matchedGuide;
      }
    } catch (e) {
      console.error('guidesDataの解析エラー:', e);
    }
  }
  
  // どちらも見つからなかった場合
  console.log('ガイドデータが見つかりません。ID=5のテストデータを使用します。');
  if (guideId === '5') {
    return {
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
  }
  
  // それ以外の場合は空のオブジェクトを返す
  return null;
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
    if (guideData.specialties && guideData.specialties.length > 0) {
      guideData.specialties.forEach(specialty => {
        const span = document.createElement('span');
        span.className = 'guide-badge';
        span.textContent = specialty;
        specialtiesContainer.appendChild(span);
      });
    } else {
      const defaultSpecialties = ['観光', 'グルメ'];
      defaultSpecialties.forEach(specialty => {
        const span = document.createElement('span');
        span.className = 'guide-badge';
        span.textContent = specialty;
        specialtiesContainer.appendChild(span);
      });
    }
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
  
  // デフォルトの地図埋め込みURL
  const defaultMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.077075076452!2d139.7054226!3d35.6618627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b40bad52785%3A0x58da34a43f765ac9!2z5riL6LC36aeF!5e0!3m2!1sja!2sjp!4v1682512389263!5m2!1sja!2sjp';
  
  // 地図埋め込みコードを生成
  const iframe = document.createElement('iframe');
  iframe.src = guideData.mapEmbedUrl || defaultMapUrl;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  
  // プレースホルダーと置き換え
  mapContainer.innerHTML = '';
  mapContainer.appendChild(iframe);
}

/**
 * デフォルトのツアープランを生成
 * @param {Object} guideData ガイドデータ
 * @returns {Array} ツアープラン配列
 */
function generateDefaultTourPlans(guideData) {
  // 地域名から都市名を抽出
  const location = guideData.location || '東京都 渋谷区';
  const locationParts = location.split(' ');
  const prefecture = locationParts[0] || '東京都';
  const city = locationParts[1] || '渋谷区';
  
  // 基本料金
  const baseFee = guideData.fee || 6000;
  
  return [
    {
      title: `${prefecture}${city}ハイライトツアー`,
      description: `${prefecture}の魅力が詰まった${city}を巡る特別なツアーです。地元の人だけが知る隠れた名所や、観光客に人気のスポットをバランスよくご案内します。`,
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
 * デフォルトのギャラリーを生成
 * @param {Object} guideData ガイドデータ
 * @returns {Array} ギャラリー配列
 */
function generateDefaultGallery(guideData) {
  const location = guideData.location || '東京都 渋谷区';
  const locationParts = location.split(' ');
  const city = locationParts[0] || '東京都';
  
  return [
    {
      url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(city)}+1`,
      alt: `${city}の風景1`
    },
    {
      url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(city)}+2`,
      alt: `${city}の風景2`
    },
    {
      url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(city)}+3`,
      alt: `${city}の風景3`
    }
  ];
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
 * デフォルトのレビューを生成
 * @param {Object} guideData ガイドデータ
 * @returns {Object} レビュー情報
 */
function generateDefaultReviews(guideData) {
  return {
    average: guideData.rating || 4.5,
    count: guideData.reviewCount || 10,
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
        authorPhoto: 'https://via.placeholder.com/50',
        rating: 5,
        date: '2023-03-15',
        content: '素晴らしいガイドでした！地元ならではの視点で案内してくれて、とても楽しい時間を過ごせました。'
      },
      {
        authorName: '佐藤 美咲',
        authorPhoto: 'https://via.placeholder.com/50',
        rating: 4,
        date: '2023-02-28',
        content: 'とても親切に案内していただきました。英語も流暢で、海外からの友人も大満足でした。'
      }
    ]
  };
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