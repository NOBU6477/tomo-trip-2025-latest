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