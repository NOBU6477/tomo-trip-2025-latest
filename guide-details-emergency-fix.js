/**
 * ガイド詳細ページ - 緊急修正版スクリプト
 * JSONパースエラーを徹底的に対策
 */

// デバッグモード
const DEBUG_MODE = true;

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド詳細ページを初期化中...');
  
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
  
  // ガイドデータを取得して表示
  displayGuideDetails(guideId);
});

/**
 * ガイド詳細情報を表示
 * @param {string} guideId ガイドID
 */
function displayGuideDetails(guideId) {
  // オブジェクトの場合は文字列に変換して処理
  const displayId = (guideId && typeof guideId === 'object' && guideId.id) ? guideId.id : guideId;
  console.log(`ガイドID=${displayId}の詳細を表示しています...`);
  
  // 複数のデータ取得方法を試行
  let guideData = null;
  
  // 1. デバッグAPIから取得を試みる
  if (window.GuideDataDebugAPI) {
    console.log('デバッグAPIを使用してデータを取得します...');
    guideData = window.GuideDataDebugAPI.getGuideData(guideId);
  }
  
  // 2. 通常APIから取得を試みる
  if (!guideData && window.GuideDataAPI) {
    console.log('通常APIを使用してデータを取得します...');
    guideData = window.GuideDataAPI.getGuideData(guideId);
  }
  
  // 3. 直接ストレージから取得を試みる
  if (!guideData) {
    console.log('直接ストレージからデータを取得します...');
    guideData = getGuideDataDirectly(guideId);
  }
  
  // 4. どうしても取得できない場合は最小限のデータを生成
  if (!guideData) {
    console.warn('データを取得できませんでした。最小限のデータを生成します...');
    guideData = {
      id: guideId,
      name: `ガイド ${guideId}`,
      location: '東京都',
      languages: ['日本語'],
      fee: 6000
    };
  }
  
  console.log('表示するガイドデータ:', guideData);
  
  // 基本情報を表示
  updateGuideBasicInfo(guideData);
  
  // コンテンツ領域を表示
  updateGuideContentAreas(guideData);
  
  // デバッグ用
  if (DEBUG_MODE) {
    console.log('ガイド詳細ページの表示が完了しました');
  }
}

/**
 * ガイド基本情報を更新
 * @param {Object} guideData ガイドデータ
 */
function updateGuideBasicInfo(guideData) {
  // ガイド名
  const nameElement = document.getElementById('guide-name');
  if (nameElement) {
    nameElement.textContent = guideData.name || '不明なガイド';
  }
  
  // 地域情報
  const locationElement = document.getElementById('guide-location');
  if (locationElement) {
    locationElement.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${guideData.location || '不明な地域'}`;
  }
  
  // 言語情報
  const langContainer = document.getElementById('guide-languages');
  if (langContainer) {
    langContainer.innerHTML = '';
    const languages = guideData.languages || ['日本語'];
    
    languages.forEach(lang => {
      const badge = document.createElement('span');
      badge.className = 'badge bg-white text-dark me-1';
      badge.textContent = lang;
      langContainer.appendChild(badge);
    });
  }
  
  // 評価情報
  const rating = guideData.rating || 4.0;
  const reviewCount = guideData.reviewCount || 5;
  const ratingText = `${rating.toFixed(1)} (${reviewCount}件のレビュー)`;
  
  const ratingElement = document.getElementById('guide-rating');
  if (ratingElement) {
    ratingElement.textContent = ratingText;
  }
  
  // 自己紹介
  const bioElement = document.getElementById('guide-bio');
  if (bioElement) {
    bioElement.textContent = guideData.bio || `こんにちは！${guideData.location || '地元'}在住の${guideData.name || 'ガイド'}です。地元の魅力をご案内いたします。`;
  }
  
  // 得意分野
  const specialtiesContainer = document.getElementById('guide-specialties');
  if (specialtiesContainer) {
    specialtiesContainer.innerHTML = '';
    const specialties = guideData.specialties || guideData.keywords || ['観光', '文化', 'グルメ'];
    
    specialties.forEach(specialty => {
      const span = document.createElement('span');
      span.className = 'guide-badge';
      span.textContent = specialty;
      specialtiesContainer.appendChild(span);
    });
  }
  
  // 料金
  const feeElement = document.getElementById('guide-fee');
  if (feeElement) {
    feeElement.textContent = `¥${(guideData.fee || 6000).toLocaleString()} / セッション`;
  }
  
  // 予約ボタン
  const bookingBtn = document.querySelector('.btn-primary.btn-lg');
  if (bookingBtn && guideData.id) {
    bookingBtn.href = `booking-payment.html?guide_id=${guideData.id}`;
  }
  
  // パンくずリスト
  updateBreadcrumb(guideData);
}

/**
 * ガイドページのコンテンツ領域を更新
 * @param {Object} guideData ガイドデータ
 */
function updateGuideContentAreas(guideData) {
  // 地域に応じたマップURLを生成
  const mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.077075076452!2d139.7054226!3d35.6618627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b40bad52785%3A0x58da34a43f765ac9!2z5riL6LC36aeF!5e0!3m2!1sja!2sjp!4v1682512389263!5m2!1sja!2sjp';
  
  // 地域に基づいたツアープランを作成
  const locationText = guideData.location || '東京都 渋谷区';
  const isShinjuku = locationText.includes('新宿');
  const isYokohama = locationText.includes('横浜');
  const isTokyo = locationText.includes('東京');
  
  const cityName = isTokyo ? '東京' : (isYokohama ? '横浜' : locationText.split(' ')[0]);
  const areaName = locationText.split(' ')[1] || '中心部';
  
  // ツアープラン
  const tourPlans = [
    {
      title: `${cityName}${areaName}文化体験ツアー`,
      description: `${cityName}の魅力発信地である${areaName}を巡るツアーです。最新のファッション、カフェ、アート、そして地元の文化の中心地を体験できます。インスタ映えするスポットも多数ご案内します。`,
      duration: '約3時間',
      capacity: '1〜4人',
      price: guideData.fee || 6000,
      priceUnit: '人',
      priceNote: '交通費・食事代別'
    },
    {
      title: `${cityName}グルメ満喫ツアー`,
      description: `${cityName}${areaName}の人気グルメスポットを巡るフードツアーです。地元の人だけが知る名店や、最新のトレンド店など、様々な食べ物を楽しむことができます。`,
      duration: '約4時間',
      capacity: '1〜3人',
      price: (guideData.fee || 6000) * 1.25,
      priceUnit: '人',
      priceNote: '食事代込み'
    }
  ];
  
  // マップを更新
  updateMap(mapUrl);
  
  // ツアープランを表示
  displayTourPlans(tourPlans);
  
  // ギャラリーを表示
  const gallery = [
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
  ];
  displayGallery(gallery);
  
  // レビューを表示
  const reviews = {
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
        authorName: 'ジョン・スミス',
        authorPhoto: 'https://placehold.co/50',
        rating: 5,
        date: '2024-02-15',
        content: `${guideData.name}さんのガイドツアーは素晴らしかったです！${cityName}の魅力をたっぷり教えてもらい、大満足の旅行になりました。`
      },
      {
        authorName: '山田花子',
        authorPhoto: 'https://placehold.co/50',
        rating: 4,
        date: '2024-01-20',
        content: `地元民ならではの視点で${cityName}を案内してもらえて良かったです。時間がもう少し長ければもっと楽しめたと思います。`
      }
    ]
  };
  displayReviews(reviews);
}

/**
 * パンくずリストを更新
 * @param {Object} guideData ガイドデータ
 */
function updateBreadcrumb(guideData) {
  const breadcrumb = document.getElementById('guide-breadcrumb');
  if (!breadcrumb) return;
  
  const locationParts = (guideData.location || '東京都 渋谷区').split(' ');
  
  breadcrumb.innerHTML = '<a href="index.html" class="text-white-50">ホーム</a> &gt; ';
  
  if (locationParts.length > 0) {
    breadcrumb.innerHTML += `<a href="#" class="text-white-50">${locationParts[0]}</a> &gt; `;
  }
  
  if (locationParts.length > 1) {
    breadcrumb.innerHTML += `<a href="#" class="text-white-50">${locationParts[1]}</a> &gt; `;
  }
  
  breadcrumb.innerHTML += `<span class="text-white">${guideData.name || 'ガイド'} ガイド</span>`;
}

/**
 * マップを更新
 * @param {string} mapUrl マップURL
 */
function updateMap(mapUrl) {
  const mapContainer = document.getElementById('guide-map-container');
  if (!mapContainer) return;
  
  const iframe = document.createElement('iframe');
  iframe.src = mapUrl;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  
  mapContainer.innerHTML = '';
  mapContainer.appendChild(iframe);
}

/**
 * ツアープランを表示
 * @param {Array} tourPlans ツアープラン配列
 */
function displayTourPlans(tourPlans) {
  const container = document.getElementById('tour-plans-container');
  if (!container) return;
  
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
 * @param {Array} gallery ギャラリー配列
 */
function displayGallery(gallery) {
  const container = document.getElementById('guide-gallery-container');
  if (!container) return;
  
  const galleryRow = document.createElement('div');
  galleryRow.className = 'row g-3';
  
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
  
  container.innerHTML = '';
  container.appendChild(galleryRow);
  
  setupGalleryZoom();
}

/**
 * ギャラリー画像クリックで拡大表示
 */
function setupGalleryZoom() {
  const galleryImages = document.querySelectorAll('.gallery-image');
  
  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      const modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = 'galleryModal';
      modal.setAttribute('tabindex', '-1');
      modal.setAttribute('aria-hidden', 'true');
      
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
      
      document.body.appendChild(modal);
      const modalObj = new bootstrap.Modal(modal);
      modalObj.show();
      
      modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
      });
    });
  });
}

/**
 * レビュー情報を表示
 * @param {Object} reviews レビュー情報
 */
function displayReviews(reviews) {
  displayReviewSummary(reviews);
  displayReviewList(reviews.items);
}

/**
 * レビュー概要を表示
 * @param {Object} reviews レビュー情報
 */
function displayReviewSummary(reviews) {
  const container = document.getElementById('review-summary-container');
  if (!container) return;
  
  const summary = document.createElement('div');
  summary.className = 'card mb-4';
  
  summary.innerHTML = `
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-md-4 text-center text-md-start">
          <h4 class="mb-0">${reviews.average.toFixed(1)}</h4>
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
 * @param {Object} distribution 評価分布
 * @returns {string} HTML文字列
 */
function generateRatingBars(distribution) {
  let html = '';
  
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
 * @param {Array} reviewItems レビュー項目配列
 */
function displayReviewList(reviewItems) {
  const container = document.getElementById('reviews-container');
  if (!container) return;
  
  const reviewList = document.createElement('div');
  reviewList.className = 'review-list';
  
  if (!reviewItems || reviewItems.length === 0) {
    reviewList.innerHTML = '<p class="text-muted text-center">まだレビューがありません。</p>';
    container.innerHTML = '';
    container.appendChild(reviewList);
    return;
  }
  
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
  
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="bi bi-star-fill"></i>';
  }
  
  if (rating % 1 >= 0.5) {
    stars += '<i class="bi bi-star-half"></i>';
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="bi bi-star"></i>';
  }
  
  return stars;
}

/**
 * ストレージから直接ガイドデータを取得
 * JSONパースエラーを完全に回避する実装
 * @param {string} guideId ガイドID
 * @returns {Object|null} ガイドデータ
 */
function getGuideDataDirectly(guideId) {
  try {
    // 個別データを取得
    const specificGuideKey = `guide_${guideId}`;
    let specificGuideJson = localStorage.getItem(specificGuideKey);
    
    if (specificGuideJson) {
      try {
        // 不正なJSONを修正
        specificGuideJson = fixJsonString(specificGuideJson);
        const guideData = JSON.parse(specificGuideJson);
        console.log('個別ガイドデータを取得しました', guideData);
        return guideData;
      } catch (e) {
        console.error('個別ガイドデータのJSON解析に失敗:', e);
      }
    }
    
    // ガイドリストから取得
    let guidesListJson = localStorage.getItem('guidesData');
    
    if (guidesListJson) {
      try {
        // 不正なJSONを修正
        guidesListJson = fixJsonString(guidesListJson);
        const guidesList = JSON.parse(guidesListJson);
        
        if (Array.isArray(guidesList)) {
          const matchedGuide = guidesList.find(g => g.id && g.id.toString() === guideId.toString());
          
          if (matchedGuide) {
            console.log('ガイドリストからデータを取得しました', matchedGuide);
            return matchedGuide;
          }
        }
      } catch (e) {
        console.error('ガイドリストのJSON解析に失敗:', e);
      }
    }
    
    return null;
  } catch (e) {
    console.error('ガイドデータ直接取得エラー:', e);
    return null;
  }
}

/**
 * 不正なJSON文字列を修正
 * @param {string} jsonStr JSON文字列
 * @returns {string} 修正されたJSON文字列
 */
function fixJsonString(jsonStr) {
  if (!jsonStr) return '';
  
  // 特殊なエスケープ問題を修正
  let cleanedStr = jsonStr;
  
  // 余分なエスケープを削除
  cleanedStr = cleanedStr.replace(/\\"/g, '"');
  cleanedStr = cleanedStr.replace(/\\\\/g, '\\');
  
  // ダブルエンコードされたUnicode文字を修正
  cleanedStr = cleanedStr.replace(/%25u([0-9A-F]{4})/gi, '%u$1');
  
  // エンコードされたURLをデコード
  try {
    if (cleanedStr.includes('%')) {
      cleanedStr = decodeURIComponent(cleanedStr);
    }
  } catch (e) {
    console.warn('URLデコードエラー:', e);
  }
  
  return cleanedStr;
}