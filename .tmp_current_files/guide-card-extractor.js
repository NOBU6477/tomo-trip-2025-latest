/**
 * ガイドカードデータの正確な抽出を行うためのスクリプト
 * IDに基づいて正確なデータを保存することに特化
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイドカードデータ抽出機能を初期化...');
  
  // メインページであることを確認
  if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    // すべてのガイドカードを取得
    const guideCards = document.querySelectorAll('.guide-card');
    
    if (guideCards && guideCards.length > 0) {
      console.log(`${guideCards.length}件のガイドカードを検出しました`);
      
      // 各カードからデータを抽出して保存
      extractAndSaveAllGuideCards(guideCards);
      
      // 詳細ページへのリンクをセットアップ
      setupDetailLinks(guideCards);
    } else {
      console.warn('ガイドカードが見つかりません');
    }
  }
});

/**
 * すべてのガイドカードからデータを抽出して保存
 * @param {NodeList} guideCards ガイドカード要素のリスト
 */
function extractAndSaveAllGuideCards(guideCards) {
  const guidesList = [];
  
  guideCards.forEach((card, index) => {
    try {
      // ガイドIDを取得
      const guideId = card.getAttribute('data-guide-id');
      if (!guideId) {
        console.warn(`カード[${index}]にdata-guide-id属性がありません`);
        return;
      }
      
      // カードからデータを抽出
      const location = card.getAttribute('data-location') || '';
      const languages = card.getAttribute('data-languages') || '';
      const fee = card.getAttribute('data-fee') || '6000';
      const keywords = card.getAttribute('data-keywords') || '';
      
      // ガイド名を正確に取得
      let name = '';
      const titleElement = card.querySelector('.card-title');
      if (titleElement) {
        name = titleElement.textContent.trim();
        console.log(`カードID=${guideId}の名前="${name}"を取得しました`);
      } else {
        console.warn(`カードID=${guideId}にタイトル要素が見つかりません`);
      }
      
      // 画像URLを取得
      let imageUrl = '';
      const imageElement = card.querySelector('.guide-image');
      if (imageElement) {
        imageUrl = imageElement.getAttribute('src') || '';
      }
      
      // ガイドデータを構築
      if (name) {
        const guideData = {
          id: guideId,
          name: name,
          location: decodeURIComponent(location || ''),
          languages: languages ? decodeURIComponent(languages).split(',') : ['日本語'],
          fee: parseInt(fee, 10) || 6000,
          keywords: keywords ? decodeURIComponent(keywords).split(',') : [],
          imageUrl: imageUrl
        };
        
        // 安全に保存
        saveGuideData(guideId, guideData);
        guidesList.push(guideData);
      }
    } catch (e) {
      console.error('カードデータ抽出エラー:', e);
    }
  });
  
  // すべてのガイドデータを保存
  if (guidesList.length > 0) {
    localStorage.setItem('guidesData', JSON.stringify(guidesList));
    console.log(`${guidesList.length}件のガイドデータをメインリストに保存しました`);
  }
}

/**
 * ガイドデータを個別に保存
 * @param {string} guideId ガイドID
 * @param {Object} guideData ガイドデータ
 */
function saveGuideData(guideId, guideData) {
  try {
    const key = `guide_${guideId}`;
    
    // データをシリアライズ
    const serializedData = JSON.stringify(guideData);
    
    // データを安全に保存
    localStorage.setItem(key, serializedData);
    console.log(`ガイドID=${guideId}のデータを保存しました:`, guideData.name);
  } catch (e) {
    console.error(`ガイドID=${guideId}のデータ保存エラー:`, e);
  }
}

/**
 * 詳細ページへのリンクをセットアップ
 * @param {NodeList} guideCards ガイドカード要素のリスト
 */
function setupDetailLinks(guideCards) {
  guideCards.forEach(card => {
    const guideId = card.getAttribute('data-guide-id');
    if (!guideId) return;
    
    // 詳細リンクを取得
    const detailLink = card.querySelector('.guide-details-link');
    if (!detailLink) return;
    
    // クリックイベントを設定
    detailLink.addEventListener('click', function(e) {
      console.log(`ガイドID=${guideId}の詳細ページを表示します`);
      
      // ガイドデータを再確認
      const key = `guide_${guideId}`;
      const guideData = localStorage.getItem(key);
      
      if (!guideData) {
        console.warn(`ガイドID=${guideId}のデータがストレージにありません。再抽出します。`);
        
        // リンククリック時にカードからデータを再取得
        const cardData = extractGuideDataFromCard(card);
        if (cardData) {
          saveGuideData(guideId, cardData);
        }
      }
      
      // リンク先のURLを設定
      this.href = `guide-details.html?id=${guideId}`;
    });
  });
}

/**
 * カードからガイドデータを抽出
 * @param {Element} card ガイドカード要素
 * @returns {Object|null} ガイドデータまたはnull
 */
function extractGuideDataFromCard(card) {
  try {
    // ガイドIDを取得
    const guideId = card.getAttribute('data-guide-id');
    if (!guideId) return null;
    
    // カードからデータを抽出
    const location = card.getAttribute('data-location') || '';
    const languages = card.getAttribute('data-languages') || '';
    const fee = card.getAttribute('data-fee') || '6000';
    const keywords = card.getAttribute('data-keywords') || '';
    
    // ガイド名を正確に取得
    let name = '';
    const titleElement = card.querySelector('.card-title');
    if (titleElement) {
      name = titleElement.textContent.trim();
    } else {
      return null;
    }
    
    // 画像URLを取得
    let imageUrl = '';
    const imageElement = card.querySelector('.guide-image');
    if (imageElement) {
      imageUrl = imageElement.getAttribute('src') || '';
    }
    
    // データをデコード
    const locationDecoded = decodeURIComponent(location || '');
    const languagesDecoded = languages ? decodeURIComponent(languages).split(',') : ['日本語'];
    const keywordsDecoded = keywords ? decodeURIComponent(keywords).split(',') : [];
    
    // ガイドデータを構築
    return {
      id: guideId,
      name: name,
      location: locationDecoded,
      languages: languagesDecoded,
      fee: parseInt(fee, 10) || 6000,
      keywords: keywordsDecoded,
      imageUrl: imageUrl
    };
  } catch (e) {
    console.error('カードデータ抽出エラー:', e);
    return null;
  }
}