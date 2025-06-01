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
  
  if (additionalGuides.length > 0) {
    console.log(`${additionalGuides.length}件の新規登録ガイドを読み込み中...`);
    
    additionalGuides.forEach(guide => {
      const guideHTML = `
        <div class="col-lg-4 col-md-6 mb-4 guide-item">
          <div class="card guide-card h-100" 
               data-guide-id="${guide.id}"
               data-keywords="${guide.specialties ? guide.specialties.join(' ') : ''}"
               data-location="${guide.location}"
               data-languages="ja en"
               data-fee="${guide.fee}">
            <img src="${guide.image}" class="card-img-top" alt="${guide.name}のプロフィール写真" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${guide.name}</h5>
              <p class="text-muted mb-2">
                <i class="fas fa-map-marker-alt"></i> ${guide.location}
              </p>
              <p class="card-text flex-grow-1">${guide.description}</p>
              <div class="d-flex justify-content-between align-items-center mt-auto">
                <div class="rating">
                  <span class="text-warning">
                    ${guide.rating === '新規' ? '<span class="badge bg-success">新規</span>' : '★★★★★'}
                  </span>
                  <small class="text-muted">(${guide.reviews}件)</small>
                </div>
                <div class="price">
                  <strong class="text-primary">¥${guide.fee}/時</strong>
                </div>
              </div>
              <div class="mt-2">
                <small class="text-muted">
                  専門分野: ${guide.specialties ? guide.specialties.slice(0, 3).join(', ') : '一般'}
                </small>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-primary w-100" onclick="viewGuideDetails('${guide.id}')">
                詳細を見る
              </button>
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