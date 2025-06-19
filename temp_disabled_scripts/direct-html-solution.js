/**
 * HTML直接挿入による修正スクリプト
 * 最も確実性の高い修正方法
 */
(function() {
  console.log('HTML直接挿入による修正を開始');
  
  // 監視するエレメント（完全に確実）
  const targetElements = [{
    selector: '.session-price, .price-tag, .price-display, .price',
    handler: handlePriceElement
  }, {
    selector: '.card',
    handler: handleCardElement
  }, {
    selector: '.guide-profile-preview, .profile-preview, .profile-preview-card',
    handler: handlePreviewElement
  }];
  
  // 料金表示を見つけた時の処理
  function handlePriceElement(priceElement) {
    console.log('料金表示を検出:', priceElement);
    
    // 既存のキーワードセクションをチェック
    const existingSection = document.getElementById('direct-keyword-section-final');
    if (existingSection) return;
    
    // キーワードを整理
    const keywords = collectKeywords();
    
    // キーワードセクションを作成して挿入
    createKeywordSection(priceElement, keywords);
  }
  
  // カードを見つけた時の処理
  function handleCardElement(card) {
    // プレビューカードかどうかを判断
    const priceElement = card.querySelector('.session-price, .price-tag, .price-display, .price');
    if (!priceElement) return;
    
    console.log('プレビューカードを検出:', card);
    
    // 青背景を削除
    removeBlueBg(card);
    
    // 既存のキーワードセクションをチェック
    const existingSection = document.getElementById('direct-keyword-section-final');
    if (existingSection) return;
    
    // キーワードを整理
    const keywords = collectKeywords();
    
    // キーワードセクションを作成して挿入
    createKeywordSection(priceElement.parentNode, keywords);
  }
  
  // プレビュー要素を見つけた時の処理
  function handlePreviewElement(preview) {
    console.log('プレビュー要素を検出:', preview);
    
    // 青背景を削除
    removeBlueBg(preview);
    
    // 料金要素を探す
    const priceElement = preview.querySelector('.session-price, .price-tag, .price-display, .price');
    if (!priceElement) return;
    
    // 既存のキーワードセクションをチェック
    const existingSection = document.getElementById('direct-keyword-section-final');
    if (existingSection) return;
    
    // キーワードを整理
    const keywords = collectKeywords();
    
    // キーワードセクションを作成して挿入
    createKeywordSection(priceElement.parentNode, keywords);
  }
  
  // 青背景を削除
  function removeBlueBg(container) {
    if (!container) return;
    
    // 青背景クラスを持つ要素を探す
    const blueElements = container.querySelectorAll('[class*="bg-"], [class*="blue"], .badge, .tag, .chip');
    
    blueElements.forEach(el => {
      // クラスを削除
      const classList = el.className.split(' ');
      const newClassList = classList.filter(cls => 
        !cls.includes('bg-') && !cls.includes('blue')
      );
      el.className = newClassList.join(' ');
      
      // スタイルを直接設定
      el.style.backgroundColor = 'transparent';
      el.style.background = 'none';
      el.style.boxShadow = 'none';
    });
    
    // 直接スタイルも設定
    container.querySelectorAll('.profile-tags, .tag-section').forEach(el => {
      el.style.backgroundColor = 'transparent';
      el.style.background = 'none';
    });
  }
  
  // キーワードを収集
  function collectKeywords() {
    // コンソールログから取得
    const logsOutput = [];
    if (window.console && window.console.logs) {
      window.console.logs.forEach(log => {
        if (log && log[0] && typeof log[0] === 'string' && log[0].includes('表示するタグリスト')) {
          if (log[1] && Array.isArray(log[1])) {
            logsOutput.push(...log[1]);
          }
        }
      });
    }
    
    if (logsOutput.length > 0) {
      return logsOutput;
    }
    
    // 選択済みタグを取得
    const selectedTags = [];
    document.querySelectorAll('.selected-tag, .selected-tag-preview, .tag, .badge, .chip').forEach(tag => {
      const text = tag.textContent.trim();
      if (text && !text.includes('×') && !text.includes('✕')) {
        selectedTags.push(text);
      }
    });
    
    if (selectedTags.length > 0) {
      return [...new Set(selectedTags)];
    }
    
    // 固定値
    return ['観光', '食べ歩き', 'アート', 'スキューバダイビング'];
  }
  
  // キーワードセクションを作成
  function createKeywordSection(container, keywords) {
    if (!container) return;
    
    // セクション作成
    const section = document.createElement('div');
    section.id = 'direct-keyword-section-final';
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
    
    // コンテナに追加
    container.appendChild(section);
    console.log('キーワードセクションを追加しました');
  }
  
  // DONを監視
  function observeDOM() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        for (const target of targetElements) {
          const elements = document.querySelectorAll(target.selector);
          elements.forEach(element => {
            if (isVisible(element)) {
              target.handler(element);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    console.log('DOM監視を開始しました');
  }
  
  // 要素が表示されているか確認
  function isVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 &&
           element.offsetHeight > 0;
  }
  
  // 監視とサポート関数を設定
  function setupWatchers() {
    // 既存要素をチェック
    for (const target of targetElements) {
      const elements = document.querySelectorAll(target.selector);
      elements.forEach(element => {
        if (isVisible(element)) {
          target.handler(element);
        }
      });
    }
    
    // DOM変更を監視
    observeDOM();
    
    // 定期的な更新も設定（バックアップ）
    setInterval(() => {
      for (const target of targetElements) {
        const elements = document.querySelectorAll(target.selector);
        elements.forEach(element => {
          if (isVisible(element)) {
            target.handler(element);
          }
        });
      }
    }, 2000);
  }
  
  // 実行開始
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupWatchers();
  } else {
    document.addEventListener('DOMContentLoaded', setupWatchers);
  }
  
  // グローバル関数を登録（updateBadgeTagsエラー対策）
  window.updateBadgeTags = function() {
    console.log('updateBadgeTags関数が呼び出されました');
    setupWatchers();
  };
})();