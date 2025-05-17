/**
 * ガイド詳細ページ拡張スクリプト
 * マップ、ギャラリー、レビューなどの追加情報を生成して表示
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド詳細拡張スクリプトを開始');
  
  // ページの読み込みを待ってから処理を開始
  setTimeout(enhanceGuidePage, 1200);
});

/**
 * ガイド詳細ページを拡張
 */
function enhanceGuidePage() {
  // ガイドID確認
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('id');
  
  if (!guideId) {
    console.warn('ガイドIDが見つかりませんでした');
    return;
  }
  
  console.log(`ガイドID=${guideId}の詳細ページを拡張します`);
  
  try {
    // ガイドデータを取得
    const guideData = getGuideData(guideId);
    if (!guideData) {
      console.warn('ガイドデータが見つかりません');
      return;
    }
    
    // 地域情報を取得
    const location = guideData.location || '';
    const locationParts = location.split(' ');
    const prefecture = locationParts[0] || '';
    const city = locationParts[1] || '';
    
    // 各セクションの拡張処理
    enhanceMapSection(prefecture, city);
    enhanceGallerySection(prefecture, city, guideData.name);
    enhanceReviewSection(guideData.name);
    
    console.log('ガイド詳細ページの拡張が完了しました');
  } catch (e) {
    console.error('ガイド詳細ページ拡張エラー:', e);
  }
}

/**
 * ガイドデータを取得
 * @param {string} guideId ガイドID
 * @returns {Object|null} ガイドデータ、取得失敗時はnull
 */
function getGuideData(guideId) {
  try {
    // localStorage から直接データを取得
    const guideKey = `guide_${guideId}`;
    const savedDataJson = localStorage.getItem(guideKey);
    
    if (savedDataJson) {
      try {
        return JSON.parse(savedDataJson);
      } catch (e) {
        console.error('ガイドデータのJSON解析に失敗:', e);
      }
    }
    
    // データが取得できない場合は表示中のHTMLから取得
    return extractGuideDataFromPage();
  } catch (e) {
    console.error('ガイドデータ取得エラー:', e);
    return null;
  }
}

/**
 * 表示されているページからガイド情報を抽出
 * @returns {Object} ガイドデータ
 */
function extractGuideDataFromPage() {
  const nameElement = document.getElementById('guide-name');
  const locationElement = document.getElementById('guide-location');
  const feeElement = document.getElementById('guide-fee');
  
  const name = nameElement ? nameElement.textContent.trim() : '';
  
  // 地域情報からアイコンを除去
  let locationText = '';
  if (locationElement) {
    // テキストコンテンツを取得し、アイコンや特殊文字を除去
    locationText = locationElement.textContent.trim();
    // アイコン（FontAwesomeやBootstrapアイコン）の部分を削除
    locationText = locationText.replace(/\s*[\uf041\uf3c5]|\s*[🏠🗺️📍]\s*|\s*geo-alt[^\s]*/gi, '').trim();
  }
  
  // 料金文字列から数値のみを抽出
  const feeText = feeElement ? feeElement.textContent : '';
  const feeMatch = feeText.match(/¥([\d,]+)/);
  const fee = feeMatch ? parseInt(feeMatch[1].replace(/,/g, ''), 10) : 6000;
  
  return {
    name: name,
    location: locationText,
    fee: fee
  };
}

/**
 * マップセクションを拡張
 * @param {string} prefecture 都道府県
 * @param {string} city 市区町村
 */
function enhanceMapSection(prefecture, city) {
  // マップコンテナを取得
  const mapContainer = document.getElementById('guide-map-container');
  if (!mapContainer) {
    console.warn('マップコンテナが見つかりません');
    return;
  }
  
  console.log('マップセクションを拡張中...');
  
  // 地名をURLエンコード
  const encodedLocation = encodeURIComponent(`${prefecture} ${city}`);
  
  // Google Mapsの埋め込みマップを作成
  const mapHTML = `
    <div class="ratio ratio-4x3 mb-3">
      <iframe
        src="https://maps.google.com/maps?q=${encodedLocation}&output=embed"
        width="100%"
        height="100%"
        frameborder="0"
        style="border:0"
        allowfullscreen
      ></iframe>
    </div>
    <div class="text-center mb-3">
      <a href="https://maps.google.com/maps?q=${encodedLocation}" 
         class="btn btn-outline-primary" 
         target="_blank">
        <i class="bi bi-box-arrow-up-right me-1"></i>
        Google Mapsで見る
      </a>
    </div>
  `;
  
  // マップをコンテナに追加
  mapContainer.innerHTML = mapHTML;
  console.log(`${prefecture} ${city}のマップを追加しました`);
}

/**
 * ギャラリーセクションを拡張
 * @param {string} prefecture 都道府県
 * @param {string} city 市区町村
 * @param {string} guideName ガイド名
 */
function enhanceGallerySection(prefecture, city, guideName) {
  // ギャラリーコンテナを取得
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) {
    console.warn('ギャラリーコンテナが見つかりません');
    return;
  }
  
  console.log('ギャラリーセクションを拡張中...');
  
  // ダミーのギャラリーを作成
  const placeText = city || prefecture || '日本の風景';
  const encodedPlace = encodeURIComponent(placeText);
  
  // ギャラリーアイテムを作成
  const galleryHTML = `
    <div class="row g-3">
      <div class="col-md-4">
        <div class="gallery-item">
          <img src="https://source.unsplash.com/random/300x200/?${encodedPlace},landmark" class="img-fluid rounded" alt="${placeText}の風景">
        </div>
      </div>
      <div class="col-md-4">
        <div class="gallery-item">
          <img src="https://source.unsplash.com/random/300x200/?${encodedPlace},nature" class="img-fluid rounded" alt="${placeText}の自然">
        </div>
      </div>
      <div class="col-md-4">
        <div class="gallery-item">
          <img src="https://source.unsplash.com/random/300x200/?${encodedPlace},food" class="img-fluid rounded" alt="${placeText}の食べ物">
        </div>
      </div>
      <div class="col-md-4">
        <div class="gallery-item">
          <img src="https://source.unsplash.com/random/300x200/?${encodedPlace},street" class="img-fluid rounded" alt="${placeText}の街並み">
        </div>
      </div>
      <div class="col-md-4">
        <div class="gallery-item">
          <img src="https://source.unsplash.com/random/300x200/?${encodedPlace},people" class="img-fluid rounded" alt="${placeText}の人々">
        </div>
      </div>
      <div class="col-md-4">
        <div class="gallery-item">
          <img src="https://source.unsplash.com/random/300x200/?${encodedPlace},culture" class="img-fluid rounded" alt="${placeText}の文化">
        </div>
      </div>
    </div>
  `;
  
  // ギャラリーをコンテナに追加
  galleryContainer.innerHTML = galleryHTML;
  console.log(`${placeText}のギャラリーを追加しました`);
}

/**
 * レビューセクションを拡張
 * @param {string} guideName ガイド名
 */
function enhanceReviewSection(guideName) {
  // レビューコンテナを取得
  const reviewContainer = document.getElementById('reviews-container');
  if (!reviewContainer) {
    console.warn('レビューコンテナが見つかりません');
    return;
  }
  
  console.log('レビューセクションを拡張中...');
  
  // レビューデータを作成
  const reviews = [
    {
      name: '田中 美咲',
      country: '日本',
      rating: 5,
      text: `${guideName}さんのガイドは素晴らしかったです！地元の人しか知らないような場所に連れて行ってもらえて、特別な体験ができました。丁寧な説明と親しみやすい人柄で、とても快適な時間を過ごせました。また機会があればぜひお願いしたいです。`,
      date: '2025年3月15日'
    },
    {
      name: 'John Smith',
      country: 'アメリカ合衆国',
      rating: 4,
      text: `I had a wonderful time with ${guideName}. They were very knowledgeable about the area and showed us some great local spots. The communication was smooth despite the language barrier. Would recommend to anyone visiting Japan!`,
      date: '2025年2月22日'
    },
    {
      name: '鈴木 健太',
      country: '日本',
      rating: 5,
      text: `初めての訪問でしたが、${guideName}さんのおかげで充実した時間を過ごすことができました。地元の歴史や文化について詳しく説明してくれて、観光だけでは得られない深い理解ができました。次回も是非お願いしたいと思います。`,
      date: '2025年1月5日'
    }
  ];
  
  // レビューHTMLを作成
  let reviewsHTML = '<div class="row">';
  
  reviews.forEach(review => {
    // 星評価のHTMLを生成
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= review.rating) {
        starsHTML += '<i class="bi bi-star-fill text-warning"></i>';
      } else {
        starsHTML += '<i class="bi bi-star text-warning"></i>';
      }
    }
    
    // レビューカードを作成
    reviewsHTML += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">${review.name}</h5>
              <span class="badge bg-light text-dark">${review.country}</span>
            </div>
            <div class="mb-2">
              ${starsHTML}
            </div>
            <p class="card-text">${review.text}</p>
            <p class="card-text"><small class="text-muted">${review.date}</small></p>
          </div>
        </div>
      </div>
    `;
  });
  
  reviewsHTML += '</div>';
  
  // レビューをコンテナに追加
  reviewContainer.innerHTML = reviewsHTML;
  console.log('レビューを追加しました');
}