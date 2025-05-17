/**
 * プロフィールプレビュー修正用のボタンを追加する直接的修正
 * このスクリプトは他のどのファイルにも依存せず単独で動作する
 */
(function() {
  console.log('プロフィールプレビュー修正ボタンを配置します');
  
  // コントロールパネルを追加
  function addControlPanel() {
    // 既存のパネルを削除
    const existingPanel = document.getElementById('preview-fix-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
    
    // 新しいパネルの作成
    const panel = document.createElement('div');
    panel.id = 'preview-fix-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;
    
    // タイトル
    const title = document.createElement('div');
    title.textContent = 'プレビュー修正';
    title.style.cssText = `
      font-weight: bold;
      margin-bottom: 8px;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
    `;
    panel.appendChild(title);
    
    // 修正ボタン
    const fixButton = document.createElement('button');
    fixButton.textContent = 'プレビューを修正';
    fixButton.style.cssText = `
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      margin-right: 5px;
      font-size: 12px;
    `;
    fixButton.onclick = fixPreview;
    panel.appendChild(fixButton);
    
    // 閉じるボタン
    const closeButton = document.createElement('button');
    closeButton.textContent = '閉じる';
    closeButton.style.cssText = `
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
    `;
    closeButton.onclick = function() {
      panel.remove();
    };
    panel.appendChild(closeButton);
    
    // ステータス表示
    const status = document.createElement('div');
    status.id = 'preview-fix-status';
    status.style.cssText = `
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    `;
    status.textContent = '準備完了';
    panel.appendChild(status);
    
    // ドキュメントに追加
    document.body.appendChild(panel);
    
    return panel;
  }
  
  // プレビューの修正
  function fixPreview() {
    const status = document.getElementById('preview-fix-status');
    status.textContent = '修正を実行中...';
    
    // プレビューカードを探す
    const previewCard = findPreviewCard();
    if (!previewCard) {
      status.textContent = 'プレビューカードが見つかりません';
      return;
    }
    
    // 青背景を消す
    removeBlueBg(previewCard);
    
    // キーワードセクションを追加
    const keywords = ['観光', '食べ歩き', 'アート', 'スキューバダイビング'];
    addKeywordSection(previewCard, keywords);
    
    status.textContent = '修正完了！';
  }
  
  // プレビューカードを見つける
  function findPreviewCard() {
    // カードの候補をチェック
    const candidates = [
      document.querySelector('.profile-preview'),
      document.querySelector('.profile-preview-card'),
      document.querySelector('.col-lg-4 .card'),
      document.querySelector('.card.shadow-sm'),
      document.querySelector('.card.mb-3'),
      document.querySelector('.card.mb-4'),
      document.querySelector('.session-info'),
      document.querySelector('.guide-preview')
    ];
    
    for (const candidate of candidates) {
      if (candidate && isVisible(candidate)) {
        return candidate;
      }
    }
    
    // 料金表示を探して、その近くのカードを見つける
    const priceElements = document.querySelectorAll('.price-tag, .price-display, .session-price, .price');
    for (const priceEl of priceElements) {
      if (isVisible(priceEl)) {
        const card = priceEl.closest('.card');
        if (card) return card;
        
        // 親要素をさかのぼる
        let parent = priceEl.parentElement;
        for (let i = 0; i < 5 && parent; i++) {
          if (parent.classList.contains('card')) {
            return parent;
          }
          parent = parent.parentElement;
        }
        
        // 最終手段：この要素自体を使う
        return priceEl.parentElement;
      }
    }
    
    return null;
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
  
  // 青背景を消す
  function removeBlueBg(container) {
    if (!container) return;
    
    // 青背景クラスを持つ要素を探す
    const blueElements = container.querySelectorAll('[class*="bg-"], [class*="blue"], .badge, .tag, .chip');
    
    blueElements.forEach(el => {
      // クラスを削除
      const classList = el.className.split(' ');
      const newClassList = classList.filter(cls => 
        !cls.includes('bg-') && !cls.includes('blue') && cls !== 'badge' && cls !== 'tag'
      );
      el.className = newClassList.join(' ');
      
      // スタイルを直接設定
      el.style.backgroundColor = 'transparent';
      el.style.background = 'none';
      el.style.boxShadow = 'none';
    });
    
    // インラインスタイルで緊急適用
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      #${container.id} .bg-light-blue,
      #${container.id} .bg-info,
      #${container.id} .bg-primary,
      #${container.id} .tag-section,
      #${container.id} .profile-tags,
      #${container.id} .badge,
      #${container.id} .tag,
      #${container.id} [class*="bg-"],
      #${container.id} [class*="blue"] {
        background: transparent !important;
        background-color: transparent !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // キーワードセクションを追加
  function addKeywordSection(container, keywords) {
    if (!container) return;
    
    // 既存のセクションを削除
    const existingSection = document.getElementById('direct-keyword-section');
    if (existingSection) {
      existingSection.remove();
    }
    
    // 新しいセクションを作成
    const section = document.createElement('div');
    section.id = 'direct-keyword-section';
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
    
    // キーワードがなければ固定値を使用
    if (!keywords || keywords.length === 0) {
      keywords = ['観光', '食べ歩き', 'アート'];
    }
    
    // タグを追加
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
      
      // アイコン
      const icon = document.createElement('span');
      icon.innerHTML = '<i class="bi bi-tag"></i>';
      icon.style.cssText = `
        margin-right: 4px;
        font-size: 10px;
      `;
      
      // テキスト
      const text = document.createTextNode(keyword);
      
      tag.appendChild(icon);
      tag.appendChild(text);
      tagContainer.appendChild(tag);
    });
    
    section.appendChild(tagContainer);
    
    // 挿入位置を決定
    const priceElement = container.querySelector('.price-tag') || 
                         container.querySelector('.price-display') || 
                         container.querySelector('.session-price') ||
                         container.querySelector('.price');
                         
    if (priceElement) {
      // 料金表示の後に挿入
      const parent = priceElement.parentNode;
      
      if (priceElement.nextSibling) {
        parent.insertBefore(section, priceElement.nextSibling);
      } else {
        parent.appendChild(section);
      }
    } else {
      // 料金表示がなければカード内の最後に追加
      const cardBody = container.querySelector('.card-body');
      if (cardBody) {
        cardBody.appendChild(section);
      } else {
        container.appendChild(section);
      }
    }
  }
  
  // 初期化
  function initialize() {
    // コントロールパネルを追加
    addControlPanel();
    
    // 自動修正を試みる（オプション）
    setTimeout(fixPreview, 2000);
  }
  
  // 実行開始
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initialize, 500);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initialize, 500);
    });
  }
})();