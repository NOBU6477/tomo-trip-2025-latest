/**
 * ガイドデータ操作の一元化APIスクリプト
 * データの保存と取得を一貫した方法で行い、エンコード/デコードの問題を防止
 */

// ガイドデータ保存・取得API
const GuideDataAPI = {
  /**
   * 文字列のエンコード
   * @param {string} str エンコードする文字列
   * @returns {string} エンコード済み文字列
   */
  safeEncode: function(str) {
    if (typeof str !== 'string') return '';
    return encodeURIComponent(str);
  },
  
  /**
   * 文字列のデコード
   * @param {string} str デコードする文字列
   * @returns {string} デコード済み文字列
   */
  safeDecode: function(str) {
    if (typeof str !== 'string') return '';
    
    // 既にデコードされている場合は再デコードしない
    try {
      if (!str.includes('%')) return str;
      return decodeURIComponent(str);
    } catch (e) {
      console.error('デコードエラー:', e, '対象文字列:', str);
      return str; // エラー時は元の文字列を返す
    }
  },
  
  /**
   * ガイドリストの保存
   * @param {Array} guidesList ガイドデータのリスト
   */
  saveGuidesList: function(guidesList) {
    if (!Array.isArray(guidesList)) {
      console.error('無効なガイドリスト:', guidesList);
      return;
    }
    
    try {
      // 安全にJSONシリアライズ
      localStorage.setItem('guidesData', JSON.stringify(guidesList));
      console.log(`${guidesList.length}件のガイドデータを保存しました`);
    } catch (e) {
      console.error('ガイドリスト保存エラー:', e);
    }
  },
  
  /**
   * 個別ガイドデータの保存
   * @param {string} guideId ガイドID
   * @param {Object} guideData ガイドデータ
   */
  saveGuideData: function(guideId, guideData) {
    if (!guideId || !guideData) {
      console.error('無効なガイドデータ:', guideId, guideData);
      return;
    }
    
    try {
      // 安全にJSONシリアライズ
      localStorage.setItem(`guide_${guideId}`, JSON.stringify(guideData));
      console.log(`ガイドID=${guideId}のデータを保存しました:`, guideData.name || 'Unknown');
    } catch (e) {
      console.error('ガイドデータ保存エラー:', e);
    }
  },
  
  /**
   * ガイドリストの取得
   * @returns {Array|null} ガイドデータのリスト、取得失敗時はnull
   */
  getGuidesList: function() {
    try {
      const guidesListJson = localStorage.getItem('guidesData');
      if (!guidesListJson) return null;
      
      const guidesList = JSON.parse(guidesListJson);
      if (!Array.isArray(guidesList)) {
        console.error('ガイドリストが配列ではありません:', guidesList);
        return null;
      }
      
      console.log(`${guidesList.length}件のガイドデータを取得しました`);
      return guidesList;
    } catch (e) {
      console.error('ガイドリスト取得エラー:', e);
      // エラー時は安全にストレージをクリア
      localStorage.removeItem('guidesData');
      return null;
    }
  },
  
  /**
   * 個別ガイドデータの取得
   * @param {string} guideId ガイドID
   * @returns {Object|null} ガイドデータ、取得失敗時はnull
   */
  getGuideData: function(guideId) {
    if (!guideId) {
      console.error('無効なガイドID:', guideId);
      return null;
    }
    
    try {
      // まず個別保存されたデータを確認
      const specificGuideJson = localStorage.getItem(`guide_${guideId}`);
      if (specificGuideJson) {
        const guideData = JSON.parse(specificGuideJson);
        console.log(`ガイドID=${guideId}の個別データを取得:`, guideData.name || 'Unknown');
        return guideData;
      }
      
      // 個別データがなければリストから検索
      const guidesList = this.getGuidesList();
      if (guidesList) {
        const matchedGuide = guidesList.find(g => g.id && g.id.toString() === guideId.toString());
        if (matchedGuide) {
          console.log(`ガイドID=${guideId}のデータをリストから取得:`, matchedGuide.name || 'Unknown');
          return matchedGuide;
        }
      }
      
      console.warn(`ガイドID=${guideId}のデータが見つかりませんでした`);
      return null;
    } catch (e) {
      console.error('ガイドデータ取得エラー:', e);
      // エラー時は安全にストレージをクリア
      localStorage.removeItem(`guide_${guideId}`);
      return null;
    }
  },
  
  /**
   * ガイドリストからDOMにカード要素を生成
   * @param {Array} guidesList ガイドデータのリスト
   * @param {HTMLElement} container カードを追加するコンテナ
   */
  createGuideCards: function(guidesList, container) {
    if (!Array.isArray(guidesList) || !container) {
      console.error('無効なパラメータ:', guidesList, container);
      return;
    }
    
    guidesList.forEach(guide => {
      // 言語バッジHTML
      const languageBadgesHTML = (guide.languages || []).map(lang => 
        `<span class="badge bg-light text-dark guide-lang me-1">${lang}</span>`
      ).join('');
      
      // キーワードバッジHTML
      const keywordBadgesHTML = (guide.keywords || []).map(keyword => 
        `<span class="badge bg-info text-dark me-1">${keyword}</span>`
      ).join('');
      
      // 評価星HTML
      const rating = guide.rating || 4.0;
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      
      let starsHTML = '';
      for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="bi bi-star-fill"></i>';
      }
      if (halfStar) {
        starsHTML += '<i class="bi bi-star-half"></i>';
      }
      for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="bi bi-star"></i>';
      }
      
      // カードHTML生成
      const itemDiv = document.createElement('div');
      itemDiv.className = 'col-md-4 guide-item';
      
      // 安全なデータ属性のためのエンコード
      const locationEncoded = this.safeEncode(guide.location || '');
      const languagesEncoded = this.safeEncode((guide.languages || []).join(','));
      const keywordsEncoded = this.safeEncode((guide.keywords || []).join(','));
      
      itemDiv.innerHTML = `
        <div class="card guide-card shadow-sm" 
             data-guide-id="${guide.id}"
             data-location="${locationEncoded}"
             data-languages="${languagesEncoded}"
             data-fee="${guide.fee || 6000}"
             data-keywords="${keywordsEncoded}">
          <img src="${guide.imageUrl || 'https://placehold.co/400x300'}" class="card-img-top guide-image" alt="${guide.name || ''}のガイド写真">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${guide.name || 'ガイド'}</h5>
              <span class="badge bg-primary guide-fee">¥${(guide.fee || 6000).toLocaleString()}/セッション</span>
            </div>
            <p class="card-text text-muted mb-2 guide-location">
              <i class="bi bi-geo-alt-fill me-1"></i>${guide.location || '不明'}
            </p>
            <p class="card-text mb-3">${guide.description || guide.bio || '地元の魅力をご案内します。'}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="guide-languages">
                ${languageBadgesHTML}
              </div>
              <div class="text-warning">
                ${starsHTML}
                <span class="text-dark ms-1">${rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-0 pt-0">
            <button class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${guide.id}" onclick="showLoginRequirement(${guide.id})">
              <i class="bi bi-lock me-1"></i>ログインして詳細を見る
            </button>
          </div>
        </div>
      `;
      
      container.appendChild(itemDiv);
    });
  },
  
  /**
   * ガイドデータをカードからDOM要素に保存された属性から抽出
   * @param {HTMLElement} card ガイドカード要素
   * @returns {Object|null} ガイドデータ、抽出失敗時はnull
   */
  extractGuideDataFromCard: function(card) {
    if (!card) {
      console.error('無効なカード要素:', card);
      return null;
    }
    
    try {
      const guideId = card.getAttribute('data-guide-id');
      if (!guideId) {
        console.warn('カード要素にガイドIDがありません');
        return null;
      }
      
      // 属性からデータを抽出
      const location = this.safeDecode(card.getAttribute('data-location') || '');
      const languagesStr = this.safeDecode(card.getAttribute('data-languages') || '');
      const languages = languagesStr ? languagesStr.split(',') : ['日本語'];
      
      const keywordsStr = this.safeDecode(card.getAttribute('data-keywords') || '');
      const keywords = keywordsStr ? keywordsStr.split(',') : [];
      
      const feeStr = card.getAttribute('data-fee');
      const fee = parseInt(feeStr, 10) || 6000;
      
      // 画像URLとガイド名を取得
      let imageUrl = '';
      let name = '';
      
      const imageElement = card.querySelector('.guide-image');
      if (imageElement) {
        imageUrl = imageElement.getAttribute('src') || '';
        name = (imageElement.getAttribute('alt') || '').replace('のガイド写真', '');
      }
      
      // 名前が取得できなかった場合、カードタイトルから取得
      if (!name || name.trim() === '') {
        const titleElement = card.querySelector('.card-title');
        if (titleElement) {
          name = titleElement.textContent.trim();
        }
      }
      
      // ガイドデータを生成
      const guideData = {
        id: guideId,
        name: name || 'ガイド',
        location: location || '不明',
        languages: languages,
        fee: fee,
        keywords: keywords,
        imageUrl: imageUrl
      };
      
      console.log(`カード要素からガイドデータを抽出: ID=${guideId}, 名前=${name}`);
      return guideData;
    } catch (e) {
      console.error('カードからのデータ抽出エラー:', e);
      return null;
    }
  },
  
  /**
   * DOM内のすべてのガイドカードからデータを抽出してストレージに保存
   */
  extractAndSaveAllGuideData: function() {
    try {
      const cards = document.querySelectorAll('.guide-card');
      if (!cards || cards.length === 0) {
        console.warn('ガイドカードが見つかりません');
        return;
      }
      
      const guidesList = [];
      
      cards.forEach(card => {
        const guideData = this.extractGuideDataFromCard(card);
        if (guideData) {
          guidesList.push(guideData);
          
          // 個別保存も行う
          this.saveGuideData(guideData.id, guideData);
        }
      });
      
      // リストとして保存
      if (guidesList.length > 0) {
        this.saveGuidesList(guidesList);
        console.log(`${guidesList.length}件のガイドデータを抽出・保存しました`);
      }
    } catch (e) {
      console.error('ガイドデータ抽出・保存エラー:', e);
    }
  }
};

// グローバルに公開
window.GuideDataAPI = GuideDataAPI;