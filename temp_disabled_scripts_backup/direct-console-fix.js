(function() {
  console.log('プロフィールプレビュー直接修正を開始');
  
  // 1. 青背景を強制的に削除
  const style = document.createElement('style');
  style.textContent = `
    .card *, .profile-preview *, .profile-preview-card *, [class*="card"] * {
      background-color: transparent !important;
      background: none !important;
    }
    .tag, .badge, .chip, .keyword, .keyword-tag {
      background-color: #f8f9fa !important;
      border: 1px solid rgba(0,0,0,0.1) !important;
      border-radius: 50px !important;
      padding: 4px 10px !important;
      margin: 3px !important;
      font-size: 12px !important;
      color: #333 !important;
      display: inline-block !important;
    }
  `;
  document.head.appendChild(style);
  
  // 2. プレビューカードを見つける
  let previewCard = null;
  
  // 料金表示を含むカードを探す
  const priceElements = document.querySelectorAll('.price-tag, .session-price, [class*="price"]');
  for (const el of priceElements) {
    if (el.textContent && (el.textContent.includes('¥') || el.textContent.includes('円') || el.textContent.includes('セッション'))) {
      previewCard = el.closest('.card') || el.parentElement;
      if (previewCard) break;
    }
  }
  
  // プロフィール説明を含む要素を探す
  if (!previewCard) {
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('写真好きの方には特におすすめのスポット')) {
        previewCard = el.closest('.card');
        if (previewCard) break;
      }
    }
  }
  
  if (!previewCard) {
    console.error('プレビューカードが見つかりませんでした');
    return;
  }
  
  console.log('プレビューカードを見つけました');
  
  // 3. キーワードを収集
  const keywords = ['観光', '食べ歩き', 'アート', 'スキューバダイビング'];
  
  // 4. 既存のキーワードセクションを削除（重複防止）
  const existingSection = document.getElementById('direct-keyword-section');
  if (existingSection) {
    existingSection.remove();
  }
  
  // 5. 新しいキーワードセクションを作成
  const keywordSection = document.createElement('div');
  keywordSection.id = 'direct-keyword-section';
  keywordSection.style.cssText = `
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid rgba(0,0,0,0.1);
    width: 100%;
  `;
  
  const title = document.createElement('div');
  title.textContent = '専門分野・キーワード';
  title.style.cssText = `
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
  `;
  keywordSection.appendChild(title);
  
  const tagContainer = document.createElement('div');
  tagContainer.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  `;
  keywordSection.appendChild(tagContainer);
  
  // タグを追加
  keywords.forEach(keyword => {
    const tag = document.createElement('div');
    tag.textContent = keyword;
    tag.style.cssText = `
      display: inline-flex;
      align-items: center;
      background-color: #f8f9fa;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 50px;
      padding: 4px 10px;
      margin: 3px;
      font-size: 12px;
      color: #333;
    `;
    tagContainer.appendChild(tag);
  });
  
  // 6. キーワードセクションを追加
  const priceTag = previewCard.querySelector('.price-tag, .session-price, [class*="price"]');
  if (priceTag) {
    priceTag.parentNode.insertBefore(keywordSection, priceTag.nextSibling);
  } else {
    previewCard.appendChild(keywordSection);
  }
  
  console.log('専門分野・キーワードセクションを追加しました');
  console.log('修正完了!');
})();