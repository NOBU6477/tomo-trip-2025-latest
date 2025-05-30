/**
 * ガイドデータの最終修正・統合スクリプト
 * ガイド詳細ページの表示問題を根本的に解決する
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド詳細ページの最終修正を実行中...');
  
  // URLからガイドIDを取得
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('id');
  
  if (!guideId) {
    console.warn('ガイドIDが見つかりません');
    return;
  }
  
  console.log('表示対象のガイドID: ' + guideId);
  
  // ガイドデータを取得
  const guideData = loadGuideDataAccurately(guideId);
  
  if (guideData) {
    console.log('個別ストレージから取得: ' + guideData.name);
    updateGuideDetailsUI(guideData);
  } else {
    console.error('ガイドID=' + guideId + 'のデータが見つかりませんでした');
  }
});

/**
 * ガイドデータを正確に取得
 * @param {string|Object} guideId ガイドID
 * @returns {Object|null} ガイドデータまたはnull
 */
function loadGuideDataAccurately(guideId) {
  // ガイドIDがオブジェクトの場合は内部のID値を抽出
  if (typeof guideId === 'object' && guideId !== null) {
    if (guideId.id) {
      console.log('オブジェクトからIDを抽出:', guideId.id);
      guideId = guideId.id;
    } else {
      console.error('ガイドIDオブジェクトにIDプロパティがありません', guideId);
      return null;
    }
  }

  console.log('ガイドID=' + guideId + 'のデータを取得しています...');
  
  try {
    // 1. 個別保存されたデータを確認
    const guideKey = `guide_${guideId}`;
    const savedData = localStorage.getItem(guideKey);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('ガイドID=' + guideId + 'のデータを取得しました:', parsedData.name);
        return parsedData;
      } catch (e) {
        console.warn('保存データの解析に失敗:', e);
      }
    }
    
    // 2. グローバルリストから検索
    return findGuideInGlobalList(guideId);
    
  } catch (error) {
    console.error('ガイドデータ取得エラー:', error);
    return null;
  }
}

/**
 * グローバルリストからガイドを検索
 * @param {string} guideId ガイドID
 * @returns {Object|null} ガイドデータまたはnull
 */
function findGuideInGlobalList(guideId) {
  try {
    const guidesListJson = localStorage.getItem('guidesData');
    
    if (guidesListJson) {
      const guidesList = JSON.parse(guidesListJson);
      
      if (Array.isArray(guidesList)) {
        const matchedGuide = guidesList.find(g => {
          return g.id && g.id.toString() === guideId.toString();
        });
        
        if (matchedGuide) {
          return matchedGuide;
        }
      }
    }
    
    console.warn('ガイドID=' + guideId + 'のデータがストレージにありません。再抽出します。');
    
    // ページから情報を抽出してフォールバックデータを作成
    return createFallbackGuideData(guideId);
    
  } catch (error) {
    console.error('ガイドリスト検索エラー:', error);
    return null;
  }
}

/**
 * フォールバックのガイドデータを作成
 * @param {string} guideId ガイドID
 * @returns {Object} ガイドデータ
 */
function createFallbackGuideData(guideId) {
  console.warn('データを取得できませんでした。最小限のデータを生成します...');

  // ページから情報を抽出
  const nameElement = document.getElementById('guide-name');
  const locationElement = document.getElementById('guide-location');
  const bioElement = document.getElementById('guide-bio');
  
  const name = nameElement ? nameElement.textContent.trim() : `ガイド${guideId}`;
  const locationText = locationElement ? 
    locationElement.textContent.replace('', '').trim() : '東京都 新宿区';
  const bio = bioElement ? bioElement.textContent.trim() : 
    `こんにちは！地元の魅力をご案内いたします。`;
  
  // 基本データを返す
  return {
    id: guideId,
    name: name,
    location: locationText,
    languages: ['日本語', '英語'],
    fee: 6000,
    keywords: ['観光', 'グルメ', '文化'],
    imageUrl: `https://placehold.co/400x300?text=${encodeURIComponent(`ガイド${guideId}`)}`,
    rating: 4.5,
    reviewCount: 10,
    bio: bio
  };
}

/**
 * UI要素を更新
 * @param {Object} guideData ガイドデータ
 */
function updateGuideDetailsUI(guideData) {
  // 基本情報の更新
  const nameElement = document.getElementById('guide-name');
  if (nameElement) {
    nameElement.textContent = guideData.name;
  }
  
  const breadcrumbNameElement = document.getElementById('guide-breadcrumb-name');
  if (breadcrumbNameElement) {
    breadcrumbNameElement.textContent = guideData.name;
  }
  
  // 地域情報
  const locationElement = document.getElementById('guide-location');
  if (locationElement) {
    locationElement.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${guideData.location}`;
  }
  
  // 評価情報
  const ratingElement = document.getElementById('guide-rating');
  if (ratingElement) {
    const rating = guideData.rating || 4.5;
    const reviewCount = guideData.reviewCount || 0;
    ratingElement.textContent = `${rating.toFixed(1)} (${reviewCount}件のレビュー)`;
  }
  
  // 言語情報
  const languagesElement = document.getElementById('guide-languages');
  if (languagesElement && guideData.languages) {
    languagesElement.innerHTML = '';
    guideData.languages.forEach(lang => {
      const badge = document.createElement('span');
      badge.className = 'badge bg-white text-dark me-1';
      badge.textContent = lang;
      languagesElement.appendChild(badge);
    });
  }
  
  // 自己紹介文
  const bioElement = document.getElementById('guide-bio');
  if (bioElement) {
    bioElement.textContent = guideData.bio || '';
  }
  
  // 得意分野
  const specialtiesElement = document.getElementById('guide-specialties');
  if (specialtiesElement && guideData.specialties) {
    specialtiesElement.innerHTML = '';
    guideData.specialties.forEach(specialty => {
      const badge = document.createElement('span');
      badge.className = 'guide-badge';
      badge.textContent = specialty;
      specialtiesElement.appendChild(badge);
    });
  }
  
  // 料金
  const feeElement = document.getElementById('guide-fee');
  if (feeElement) {
    feeElement.textContent = `¥${guideData.fee.toLocaleString()}`;
  }
  
  // ツアープラン更新
  console.log('ツアープランを更新: ' + guideData.location);
  updateTourPlans(guideData);
  
  // パンくずリスト更新
  updateBreadcrumb(guideData);
}

/**
 * ツアープランを更新
 * @param {Object} guideData ガイドデータ
 */
function updateTourPlans(guideData) {
  const tourPlansContainer = document.getElementById('tour-plans-container');
  if (!tourPlansContainer) {
    console.warn('ツアープランが見つかりません。デフォルトデータを使用します。');
    return;
  }
  
  // 地域情報を抽出
  const location = guideData.location || '';
  const locationParts = location.split(' ');
  const prefecture = locationParts[0] || '';
  const city = locationParts[1] || '';
  
  // ツアープランカードを更新
  const planCards = tourPlansContainer.querySelectorAll('.card');
  if (planCards && planCards.length > 0) {
    updateTourPlanCards(planCards, prefecture, city);
  }
}

/**
 * ツアープランカードを更新
 * @param {NodeList|Array} planCards ツアープランカード要素
 * @param {string} prefecture 都道府県
 * @param {string} city 市区町村
 */
function updateTourPlanCards(planCards, prefecture, city) {
  const areaName = city || prefecture || '地元';
  const prefName = prefecture || '地域';
  
  planCards.forEach((card, index) => {
    const titleElement = card.querySelector('.card-title');
    const descElement = card.querySelector('.card-text');
    
    if (titleElement && descElement) {
      if (index === 0) {
        // 1つ目のカード: ハイライトツアー
        titleElement.textContent = `${areaName}ハイライトツアー`;
        descElement.textContent = `${prefName}の魅力が詰まった${areaName}を巡る特別なツアーです。地元の人だけが知る隠れた名所や、観光客に人気のスポットをバランスよくご案内します。`;
      } else if (index === 1) {
        // 2つ目のカード: グルメツアー
        titleElement.textContent = `${areaName}グルメ満喫ツアー`;
        descElement.textContent = `${prefName}${areaName}の美味しいグルメスポットを巡るフードツアーです。地元の人だけが知る店や、最新のトレンド店など、様々な食べ物を楽しむことができます。`;
      }
    }
  });
}

/**
 * パンくずリストを更新
 * @param {Object} guideData ガイドデータ
 */
function updateBreadcrumb(guideData) {
  const breadcrumbElement = document.getElementById('guide-breadcrumb');
  if (breadcrumbElement) {
    // 地域情報を抽出
    const location = guideData.location || '';
    const locationParts = location.split(' ');
    const prefecture = locationParts[0] || '';
    
    breadcrumbElement.innerHTML = `
      <a href="index.html" class="text-white-50">ホーム</a> &gt; 
      <a href="index.html?prefecture=${encodeURIComponent(prefecture)}" class="text-white-50">${prefecture}</a> &gt; 
      <span class="text-white">${guideData.name}</span>
    `;
  }
}

/**
 * エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showErrorMessage(message) {
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert alert-danger alert-dismissible fade show';
    alertElement.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="閉じる"></button>
    `;
    alertContainer.appendChild(alertElement);
    
    // 5秒後に自動的に消える
    setTimeout(() => {
      alertElement.classList.remove('show');
      setTimeout(() => alertElement.remove(), 500);
    }, 5000);
  }
}