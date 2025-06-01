/**
 * 生成したガイドデータをページに動的に追加するスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  // ガイドデータコンテナを取得
  const guideContainer = document.getElementById('guide-cards-container');
  
  // ガイドコンテナが存在する場合のみ処理
  if (guideContainer) {
    // 既存のガイドカードが表示されているかチェック
    const existingGuides = guideContainer.querySelectorAll('.guide-card');
    
    // 新規登録されたガイドをローカルストレージから読み込み
    loadUserAddedGuides();
    
    // 追加のガイドカードを生成して追加
    if (window.generateAdditionalGuideCards) {
      // 生成したHTML
      const additionalGuidesHTML = window.generateAdditionalGuideCards();
      
      // 一時的なコンテナを作成してHTMLをパース
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = additionalGuidesHTML;
      
      // 各ガイドカードを取り出して追加
      const guideItems = tempContainer.querySelectorAll('.guide-item');
      guideItems.forEach(item => {
        guideContainer.appendChild(item);
      });
      
      console.log(`${guideItems.length}件の追加ガイドデータを読み込みました`);
      
      // 遅延実行してフィルター機能を適用（DOMに新しい要素が追加された後）
      setTimeout(() => {
        updateAttributesForNewCards();
        
        // 追加した要素のキーワードとガイド説明文を検証
        console.log('=================== ガイドカード属性の検証 ===================');
        const allCards = document.querySelectorAll('.guide-card');
        allCards.forEach((card, index) => {
          // 最初の5枚のカードだけログ出力（多すぎると煩雑になるため）
          if (index < 5) {
            const id = card.getAttribute('data-guide-id');
            const keywords = card.getAttribute('data-keywords');
            const location = card.getAttribute('data-location');
            const languages = card.getAttribute('data-languages');
            const fee = card.getAttribute('data-fee');
            console.log(`カードID: ${id}, キーワード: ${keywords}, 地域: ${location}, 言語: ${languages}, 料金: ${fee}`);
          }
        });
        console.log('=============================================================');
        
        // フィルター機能の再適用
        if (typeof applyFilters === 'function') {
          applyFilters();
        } else if (window.applyFilters) {
          window.applyFilters();
        } else {
          // フィルター機能が直接アクセスできない場合はイベントを発火
          const event = new Event('guide-data-loaded');
          document.dispatchEvent(event);
        }
      }, 200);
    }
  }
});

/**
 * ユーザーが追加したガイドをローカルストレージから読み込み
 */
function loadUserAddedGuides() {
  const guideContainer = document.getElementById('guide-cards-container');
  if (!guideContainer) return;
  
  // ローカルストレージから新規追加されたガイドを取得
  const additionalGuides = JSON.parse(localStorage.getItem('additionalGuides') || '[]');
  
  // セッションストレージから新規登録ガイド情報を取得
  const sessionGuides = getSessionGuides();
  
  // 両方のソースを結合
  const allGuides = [...additionalGuides, ...sessionGuides];
  
  if (allGuides.length > 0) {
    console.log(`${allGuides.length}件の新規登録ガイドを読み込み中...`);
    
    allGuides.forEach(guide => {
      // 言語バッジHTML
      const languageBadgesHTML = ['日本語', '英語'].map(lang => 
        `<span class="badge bg-light text-dark guide-lang me-1">${lang}</span>`
      ).join('');
      
      // 評価星HTML
      const starsHTML = guide.rating === '新規' ? 
        '<span class="badge bg-success">新規</span>' : 
        '<i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>';
      
      const guideHTML = `
        <div class="col-md-4 guide-item">
          <div class="card guide-card shadow-sm" 
               data-guide-id="${guide.id}"
               data-location="${encodeURIComponent(guide.location)}"
               data-languages="日本語,英語"
               data-fee="${guide.fee}"
               data-keywords="${encodeURIComponent(guide.specialties ? guide.specialties.join(',') : '')}">
            <img src="${guide.image}" class="card-img-top guide-image" alt="${guide.name}のガイド写真">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">${guide.name}</h5>
                <span class="badge bg-primary guide-fee">¥${parseInt(guide.fee).toLocaleString()}/セッション</span>
              </div>
              <p class="card-text text-muted mb-2 guide-location">
                <i class="bi bi-geo-alt-fill me-1"></i>${guide.location}
              </p>
              <p class="card-text mb-3">${guide.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="guide-languages">
                  ${languageBadgesHTML}
                </div>
                <div class="text-warning">
                  ${starsHTML}
                  ${guide.rating !== '新規' ? `<span class="text-dark ms-1">${guide.rating}</span>` : ''}
                </div>
              </div>
            </div>
            <div class="card-footer bg-white border-0 pt-0">
              <a href="#" class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${guide.id}">詳細を見る</a>
            </div>
          </div>
        </div>
      `;
      
      // 新規ガイドを最初に表示（先頭に挿入）
      guideContainer.insertAdjacentHTML('afterbegin', guideHTML);
    });
    
    console.log('新規登録ガイドの読み込みが完了しました');
  }
}

/**
 * セッションストレージから新規登録ガイドを取得
 */
function getSessionGuides() {
  const sessionGuides = [];
  
  // 現在のユーザー情報をチェック
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      if (user.userType === 'guide' || user.type === 'guide') {
        // ガイド情報をガイドカード形式に変換
        const guideCard = {
          id: user.id || Date.now(),
          name: user.name || user.username || 'ガイド',
          location: user.city || '東京',
          description: user.bio || '新規登録ガイドです。よろしくお願いします。',
          image: user.profileImage || 'https://via.placeholder.com/300x200?text=New+Guide',
          fee: user.price ? user.price.replace(/[^\d]/g, '') : '5000',
          rating: '新規',
          reviews: '0',
          specialties: user.specialties || ['観光案内', '文化紹介'],
          phone: user.phone,
          email: user.email,
          isNewGuide: true
        };
        sessionGuides.push(guideCard);
        console.log('セッションからガイド情報を取得:', guideCard);
      }
    } catch (e) {
      console.error('セッションガイド情報の解析エラー:', e);
    }
  }
  
  // URLパラメータからの情報もチェック（新規登録完了時）
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('new') === 'true' && urlParams.get('name')) {
    const urlGuide = {
      id: Date.now(),
      name: urlParams.get('name'),
      location: '東京',
      description: '新規登録ガイドです。よろしくお願いします。',
      image: 'https://via.placeholder.com/300x200?text=New+Guide',
      fee: '5000',
      rating: '新規',
      reviews: '0',
      specialties: ['観光案内'],
      phone: urlParams.get('phone'),
      isNewGuide: true
    };
    sessionGuides.push(urlGuide);
    console.log('URLパラメータからガイド情報を取得:', urlGuide);
  }
  
  return sessionGuides;
}

/**
 * 新しく追加されたカードの属性を設定
 */
function updateAttributesForNewCards() {
  // すべてのガイドカードを取得
  const allCards = document.querySelectorAll('.guide-card');
  
  allCards.forEach(card => {
    // データ属性がまだ設定されていないか確認
    if (!card.hasAttribute('data-keywords') || !card.hasAttribute('data-languages') || 
        !card.hasAttribute('data-fee') || !card.hasAttribute('data-location')) {
      
      // キーワード情報を設定
      if (!card.hasAttribute('data-keywords')) {
        const cardKeywordElements = card.querySelectorAll('.badge');
        const keywords = Array.from(cardKeywordElements)
          .filter(badge => !badge.classList.contains('bg-primary'))
          .map(badge => badge.textContent.trim());
        card.setAttribute('data-keywords', keywords.join(',').toLowerCase());
      }
      
      // 言語情報を設定
      if (!card.hasAttribute('data-languages')) {
        const languageElements = card.querySelectorAll('.guide-languages .badge');
        const languages = Array.from(languageElements).map(badge => badge.textContent.trim());
        card.setAttribute('data-languages', languages.join(',').toLowerCase());
      }
      
      // 料金情報を設定
      if (!card.hasAttribute('data-fee')) {
        const feeElement = card.querySelector('.guide-fee');
        if (feeElement) {
          const feeText = feeElement.textContent;
          const feeMatch = feeText.match(/¥([0-9,]+)/);
          if (feeMatch) {
            const fee = parseInt(feeMatch[1].replace(/,/g, ''));
            card.setAttribute('data-fee', fee);
          }
        }
      }
      
      // 地域情報を設定
      if (!card.hasAttribute('data-location')) {
        const locationElement = card.querySelector('.guide-location');
        if (locationElement) {
          card.setAttribute('data-location', locationElement.textContent.trim().toLowerCase());
        }
      }
    }
  });
}