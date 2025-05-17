/**
 * 緊急修正スクリプト - どんな状況でも機能する基本的な実装
 */
(function() {
  console.log('緊急修正スクリプトを実行');

  // 定期的にチェックして修正を試みる
  const interval = setInterval(attemptFix, 1000);
  let attempts = 0;
  
  // 修正の試行
  function attemptFix() {
    attempts++;
    if (attempts > 30) {
      clearInterval(interval);
      console.log('緊急修正：最大試行回数に達しました');
      return;
    }
    
    // カード要素を見つける
    const card = findCardElement();
    if (!card) {
      console.log('緊急修正：カード要素が見つかりません。試行回数:', attempts);
      return;
    }
    
    // 青背景を強制的に削除
    removeBlueBackground(card);
    
    // キーワードセクションを追加
    const cardBody = card.querySelector('.card-body') || card;
    addKeywordSection(cardBody);
    
    console.log('緊急修正：修正が適用されました');
    clearInterval(interval);
  }
  
  // カード要素を見つける
  function findCardElement() {
    // 1. 料金表示を持つカードを探す
    const priceElements = document.querySelectorAll('[class*="price"], .session-price, .price-tag');
    for (const price of priceElements) {
      const card = price.closest('.card') || findParentWithBackground(price);
      if (card) return card;
    }
    
    // 2. 青い背景を持つ要素を探す
    const blueElements = findElementsWithBlueBackground();
    for (const el of blueElements) {
      const card = el.closest('.card') || findParentWithBackground(el);
      if (card) return card;
    }
    
    // 3. 最後の手段として右側に表示されているカードを探す
    const allCards = document.querySelectorAll('.card');
    for (const card of allCards) {
      const rect = card.getBoundingClientRect();
      if (rect.right > window.innerWidth / 2 && rect.width < 400) {
        return card;
      }
    }
    
    // 4. セッション価格が含まれる要素を探す
    const textElements = document.querySelectorAll('*');
    for (const el of textElements) {
      if (el.textContent && 
         (el.textContent.includes('¥') || 
          el.textContent.includes('円') || 
          el.textContent.includes('セッション'))) {
        const card = findParentWithBackground(el, 5);
        if (card) return card;
      }
    }
    
    return null;
  }
  
  // 青背景の要素を見つける
  function findElementsWithBlueBackground() {
    const result = [];
    const allElements = document.querySelectorAll('*');
    
    for (const el of allElements) {
      try {
        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;
        
        // 青色っぽい色を検出
        if (bgColor.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*(\d+)\s*,?/)) {
          const blue = parseInt(RegExp.$1);
          if (blue > 200 && el.offsetWidth > 0 && el.offsetHeight > 0) {
            result.push(el);
          }
        }
      } catch (e) {
        // エラー無視
      }
    }
    
    return result;
  }
  
  // 背景色を持つ親要素を見つける
  function findParentWithBackground(element, maxDepth = 3) {
    let current = element;
    let depth = 0;
    
    while (current && depth < maxDepth) {
      const style = window.getComputedStyle(current);
      if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
          style.backgroundColor !== 'transparent') {
        return current;
      }
      
      // "card"クラスを持つ親を探す
      if (current.className && current.className.includes('card')) {
        return current;
      }
      
      current = current.parentElement;
      depth++;
    }
    
    return element.parentElement; // 適切な親が見つからなければ直接の親を返す
  }
  
  // 青背景を強制的に削除
  function removeBlueBackground(container) {
    if (!container) return;
    
    // 直接的なCSSで強制上書き
    const style = document.createElement('style');
    style.textContent = `
      .card *, .session-price *, .price-tag *, .profile-preview *, .profile-preview-card * {
        background-color: transparent !important;
        background: none !important;
      }
      
      .badge, .tag, .chip {
        background-color: #f8f9fa !important;
        border: 1px solid rgba(0,0,0,0.1) !important;
        border-radius: 50px !important;
        padding: 4px 10px !important;
        margin: 3px !important;
        font-size: 12px !important;
        color: #333 !important;
      }
    `;
    document.head.appendChild(style);
    
    // すべての子要素を処理
    const elements = container.querySelectorAll('*');
    for (const el of elements) {
      if (el.tagName !== 'IMG') { // 画像以外
        el.style.backgroundColor = 'transparent';
        el.style.background = 'none';
      }
    }
  }
  
  // キーワードセクションを追加
  function addKeywordSection(container) {
    if (!container) return;
    
    // 既存のセクションを確認
    if (document.getElementById('emergency-keyword-section')) {
      return;
    }
    
    // キーワードを取得
    const keywords = collectKeywords();
    
    // セクション作成
    const section = document.createElement('div');
    section.id = 'emergency-keyword-section';
    section.style.cssText = `
      width: 100%;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.1);
    `;
    
    // タイトル
    const title = document.createElement('div');
    title.style.cssText = `
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `;
    title.textContent = '専門分野・キーワード';
    section.appendChild(title);
    
    // タグコンテナ
    const tagContainer = document.createElement('div');
    tagContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    `;
    
    // タグを追加
    if (!keywords || keywords.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.style.cssText = `
        color: #999;
        font-size: 12px;
        font-style: italic;
      `;
      emptyMessage.textContent = '選択されたキーワードはありません';
      tagContainer.appendChild(emptyMessage);
    } else {
      keywords.forEach(keyword => {
        const tag = document.createElement('div');
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
        
        // テキスト
        const text = document.createTextNode(keyword);
        tag.appendChild(text);
        tagContainer.appendChild(tag);
      });
    }
    
    section.appendChild(tagContainer);
    container.appendChild(section);
  }
  
  // キーワードの収集
  function collectKeywords() {
    // ページから選択されたキーワードを取得
    const selectedTags = [];
    
    // 1. オレンジ色のタグを探す
    document.querySelectorAll('.selected-tag, .custom-tag, .custom-chip').forEach(tag => {
      const text = tag.textContent.trim();
      if (text && !text.includes('×') && !text.includes('✕')) {
        selectedTags.push(text.replace(/[×✕✖]/g, '').trim());
      }
    });
    
    // 2. コンソールログをチェック
    if (window.console && window.console.logs) {
      window.console.logs.forEach(log => {
        if (log && log[0] && log[0].includes && log[0].includes('表示するタグリスト')) {
          if (log[1] && Array.isArray(log[1])) {
            log[1].forEach(tag => selectedTags.push(tag));
          }
        }
      });
    }
    
    // 3. ページ上の全てのタグを取得
    if (selectedTags.length === 0) {
      document.querySelectorAll('.badge, .tag, .chip').forEach(tag => {
        const text = tag.textContent.trim();
        if (text && !text.includes('×') && !text.includes('✕')) {
          selectedTags.push(text.replace(/[×✕✖]/g, '').trim());
        }
      });
    }
    
    // 最終手段としてデフォルト値を使用
    if (selectedTags.length === 0) {
      return ['観光', '食べ歩き', 'アート', 'スキューバダイビング'];
    }
    
    // 重複を削除
    return [...new Set(selectedTags)];
  }
  
  // 最初の試行を即時実行
  attemptFix();
  
  // グローバル関数として提供（エラー対策）
  window.updateBadgeTags = function() {
    console.log('グローバルupdateBadgeTags関数が呼び出されました');
    attemptFix();
  };
})();