/**
 * 最も直接的なDOM操作による修正スクリプト - 最終手段
 * コンソールから直接実行できるように設計されています
 */
(function() {
  console.log('最終手段の直接修正を実行します...');
  
  // プレビューカードを見つける
  function findPreviewCard() {
    // 方法1: セッション価格を含むカードを探す
    const priceElements = document.querySelectorAll('[class*="price"], .session-price, .price-tag');
    for (const priceEl of priceElements) {
      if (priceEl.textContent.includes('¥') || priceEl.textContent.includes('円') || 
          priceEl.textContent.includes('セッション')) {
        return priceEl.closest('.card') || findNearestContainer(priceEl);
      }
    }
    
    // 方法2: プロフィール説明を含むカードを探す
    const allDivs = document.querySelectorAll('div');
    for (const div of allDivs) {
      if (div.textContent && div.textContent.includes('写真好きの方には特におすすめのスポット')) {
        return div.closest('.card') || findNearestContainer(div);
      }
    }
    
    // 方法3: 右サイドバーにあるカードを探す
    const allCards = document.querySelectorAll('.card');
    for (const card of allCards) {
      const rect = card.getBoundingClientRect();
      if (rect.right > window.innerWidth / 2 && rect.width < 400) {
        return card;
      }
    }
    
    // 見つからなかった場合、近い要素を作成
    return null;
  }
  
  function findNearestContainer(element) {
    let current = element;
    let limit = 5; // 上向きに5階層まで探索
    
    while (current && limit > 0) {
      current = current.parentElement;
      limit--;
      
      if (!current) break;
      
      // 有効なコンテナかどうかをチェック
      const style = window.getComputedStyle(current);
      const hasBorder = style.border !== 'none' && style.border !== '';
      const hasBackground = style.backgroundColor !== 'transparent' && style.backgroundColor !== 'rgba(0, 0, 0, 0)';
      const hasMargin = parseInt(style.marginTop) > 0 || parseInt(style.marginBottom) > 0;
      
      if ((hasBorder || hasBackground || hasMargin) && current.offsetWidth > 50 && current.offsetHeight > 50) {
        return current;
      }
    }
    
    return element.parentElement; // 適切なコンテナが見つからなければ直近の親を返す
  }
  
  // 青背景を強制的に削除するスタイルを適用
  function removeBlueBackground() {
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
    
    // 念のため直接スタイル適用も行う
    document.querySelectorAll('.card *, .profile-preview *, .profile-preview-card *').forEach(el => {
      if (el.tagName !== 'IMG') {
        el.style.backgroundColor = 'transparent';
        el.style.background = 'none';
      }
    });
  }
  
  // キーワードタグを収集
  function collectKeywords() {
    const keywords = [];
    
    // 特定のクラスを持つ要素からキーワードを収集
    document.querySelectorAll('.selected-tag, .badge, .tag, .chip, .keyword, .keyword-tag').forEach(tag => {
      const text = tag.textContent.trim();
      if (text && !text.includes('×') && !text.includes('✕') && !text.includes('✖')) {
        keywords.push(text.replace(/[×✕✖]/g, '').trim());
      }
    });
    
    // コンソールログをチェック
    if (window.console && window.console.logs) {
      window.console.logs.forEach(log => {
        if (log && log[0] && typeof log[0] === 'string' && log[0].includes('タグリスト')) {
          if (log[1] && Array.isArray(log[1])) {
            log[1].forEach(tag => keywords.push(tag));
          }
        }
      });
    }
    
    // デフォルト値
    if (keywords.length === 0) {
      keywords.push('観光', '食べ歩き', 'アート', 'スキューバダイビング');
    }
    
    // 重複を削除して返す
    return [...new Set(keywords)];
  }
  
  // 専用キーワードセクションを作成
  function createKeywordSection(keywords) {
    const section = document.createElement('div');
    section.id = 'custom-keyword-section';
    section.style.cssText = `
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
    
    const tagContainer = document.createElement('div');
    tagContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    `;
    
    keywords.forEach(keyword => {
      const tag = document.createElement('div');
      tag.textContent = keyword;
      tag.className = 'custom-keyword-tag';
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
    
    section.appendChild(title);
    section.appendChild(tagContainer);
    
    return section;
  }
  
  // メイン処理
  function main() {
    // 青背景を強制的に削除
    removeBlueBackground();
    
    // プレビューカードを見つける
    const card = findPreviewCard();
    if (!card) {
      console.error('プレビューカード要素が見つかりませんでした');
      return false;
    }
    
    // 既存のキーワードセクションを削除（重複を避けるため）
    const existingSection = document.getElementById('custom-keyword-section');
    if (existingSection) {
      existingSection.remove();
    }
    
    // キーワードを収集
    const keywords = collectKeywords();
    
    // キーワードセクションを作成
    const keywordSection = createKeywordSection(keywords);
    
    // カード内の適切な位置にキーワードセクションを挿入
    const priceTag = card.querySelector('.price-tag, .session-price, [class*="price"]');
    if (priceTag) {
      // 価格タグの後に挿入
      priceTag.parentNode.insertBefore(keywordSection, priceTag.nextSibling);
    } else {
      // 価格タグがない場合はカードの最後に追加
      card.appendChild(keywordSection);
    }
    
    console.log('直接修正が完了しました!');
    return true;
  }
  
  // 実行して結果を返す
  return main();
})();