/**
 * バッジタグ表示の修正と青背景問題を解決する専用スクリプト
 * 既存のJSに依存せず完全に独立して動作します
 */
(function() {
  console.log('バッジタグ修正とプレビュー修正を開始します');
  
  // グローバル変数として関数を提供（エラー解決のため）
  window.updateBadgeTags = function() {
    console.log('updateBadgeTags関数が呼び出されました');
    findAndUpdatePreview();
  };
  
  // メイン処理関数
  function findAndUpdatePreview() {
    // プレビューカードを探す
    const previewCard = findProfilePreviewCard();
    if (!previewCard) {
      console.warn('プレビューカードが見つかりません');
      setTimeout(findAndUpdatePreview, 500);
      return;
    }
    
    console.log('プレビューカードを見つけました:', previewCard);
    
    // 青背景を消す
    removeBlueBg(previewCard);
    
    // キーワードセクションを追加
    addKeywordSection(previewCard);
  }
  
  // プレビューカードを見つける
  function findProfilePreviewCard() {
    // 可能性のある選択肢
    const selectors = [
      '.profile-preview',
      '.profile-preview-card',
      '.profile-preview-container',
      '.guide-profile-preview',
      '.preview-card',
      '.session-preview',
      '.col-lg-4 .card',
      '.col-md-4 .card',
      '.card.shadow-sm',
      '.card.mb-3',
      '.card.mb-4'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && isVisible(element)) {
        return element;
      }
    }
    
    // 料金表示を含むカードを探す
    const priceElements = document.querySelectorAll('.price-tag, .price-display, .session-price');
    for (const priceEl of priceElements) {
      const card = priceEl.closest('.card');
      if (card && isVisible(card)) {
        return card;
      }
    }
    
    // 最後の手段：右側にある小さなカード
    const cards = document.querySelectorAll('.card');
    for (const card of cards) {
      if (!isVisible(card)) continue;
      
      const rect = card.getBoundingClientRect();
      // 右側にあって小さめのカード
      if (rect.right > window.innerWidth / 2 && rect.width < 400) {
        return card;
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
    
    // 強制的なスタイルでリセット
    const style = document.createElement('style');
    style.textContent = `
      .profile-preview-card,
      .profile-preview-card *,
      .profile-preview,
      .profile-preview *,
      .profile-tags,
      .profile-tags *,
      div[class*="bg-"],
      [class*="bg-"] *,
      [class*="blue"],
      [class*="blue"] *,
      div[style*="background-color"],
      .tag-section,
      .tag-section * {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // 直接要素に設定
    const blueBgElements = [
      ...container.querySelectorAll('.bg-light-blue'),
      ...container.querySelectorAll('.bg-info'),
      ...container.querySelectorAll('.bg-primary'),
      ...container.querySelectorAll('.bg-info-light'),
      ...container.querySelectorAll('.tag-section'),
      ...container.querySelectorAll('.profile-tags'),
      ...container.querySelectorAll('.badge'),
      ...container.querySelectorAll('.tag')
    ];
    
    // スタイルを直接上書き
    blueBgElements.forEach(el => {
      el.style.backgroundColor = 'transparent';
      el.style.background = 'none';
      el.style.boxShadow = 'none';
    });
    
    // カードスタイルのリセット
    container.style.backgroundColor = 'white';
    container.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
    
    // 子要素のうち青背景に見えるものを検出して修正
    const elements = container.querySelectorAll('*');
    elements.forEach(el => {
      try {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        
        // 青色っぽい背景なら透明に
        if (bg.includes('rgb(') && 
           (bg.includes('200, 230, 255') || 
            bg.includes('230, 240, 255') || 
            bg.includes('240, 248, 255') || 
            bg.includes('220, 240, 255') ||
            bg.includes('230, 230, 250'))) {
          
          console.log('青背景要素を検出:', el);
          el.style.backgroundColor = 'transparent';
          el.style.background = 'none';
          
          // 親要素も修正
          let parent = el.parentElement;
          if (parent) {
            parent.style.backgroundColor = 'transparent';
            parent.style.background = 'none';
          }
        }
      } catch (e) {
        // 一部要素でエラーが発生する場合があるので無視
      }
    });
  }
  
  // キーワードセクションを追加
  function addKeywordSection(container) {
    if (!container) return;
    
    // すでに存在するなら削除
    const existingSection = document.getElementById('custom-keyword-section');
    if (existingSection) {
      existingSection.remove();
    }
    
    // 表示するタグを取得
    const tags = getSelectedTags();
    
    // セクション作成
    const section = document.createElement('div');
    section.id = 'custom-keyword-section';
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
    if (tags.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.style.cssText = `
        color: #999;
        font-size: 12px;
        font-style: italic;
      `;
      emptyMessage.textContent = '選択されたキーワードはありません';
      tagContainer.appendChild(emptyMessage);
    } else {
      tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'custom-tag-badge';
        tagElement.style.cssText = `
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
        const icon = document.createElement('i');
        icon.className = 'bi bi-tag';
        icon.style.cssText = `
          margin-right: 4px;
          font-size: 10px;
        `;
        
        // テキスト
        const text = document.createTextNode(tag);
        
        tagElement.appendChild(icon);
        tagElement.appendChild(text);
        tagContainer.appendChild(tagElement);
      });
    }
    
    section.appendChild(tagContainer);
    
    // 挿入位置を決定
    const priceElement = container.querySelector('.price-tag') || 
                         container.querySelector('.price-display') || 
                         container.querySelector('.session-price');
    
    if (priceElement) {
      // 料金表示の後に挿入
      const parent = priceElement.parentNode;
      
      if (priceElement.nextSibling) {
        parent.insertBefore(section, priceElement.nextSibling);
      } else {
        parent.appendChild(section);
      }
      
      console.log('料金表示の後にキーワードセクションを挿入しました');
    } else {
      // 料金表示がなければカード内の最後に追加
      const cardBody = container.querySelector('.card-body');
      if (cardBody) {
        cardBody.appendChild(section);
      } else {
        container.appendChild(section);
      }
      
      console.log('カード内の最後にキーワードセクションを追加しました');
    }
  }
  
  // 選択されているタグを取得
  function getSelectedTags() {
    const tags = [];
    
    try {
      // コンソールログから直接取得
      const logs = console.logs || [];
      for (const log of logs) {
        if (log && typeof log[0] === 'string' && log[0].includes('表示するタグリスト')) {
          if (log[1] && Array.isArray(log[1])) {
            return log[1];
          }
        }
      }
      
      // 選択済みタグを取得
      const selectedTags = document.querySelectorAll('.selected-tag-preview, .selected-tag');
      for (const tag of selectedTags) {
        const text = tag.textContent.trim();
        if (text) {
          tags.push(text.replace(/[×✕✖]/g, '').trim());
        }
      }
      
      // カスタムタグを取得
      const customTags = document.querySelectorAll('.custom-tag, .custom-chip');
      for (const tag of customTags) {
        const text = tag.textContent.trim();
        if (text) {
          tags.push(text.replace(/[×✕✖]/g, '').trim());
        }
      }
      
      // チェックボックスから取得
      if (tags.length === 0) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
        checkboxes.forEach(checkbox => {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            tags.push(label.textContent.trim());
          }
        });
      }
      
      // ページから直接全てのタグを取得（最終手段）
      if (tags.length === 0) {
        const allTags = document.querySelectorAll('.badge, .tag, .chip');
        for (const tag of allTags) {
          // プレビューエリア以外のタグのみ
          if (!tag.closest('.profile-preview') && !tag.closest('#custom-keyword-section')) {
            const text = tag.textContent.trim();
            if (text && !tags.includes(text)) {
              tags.push(text);
            }
          }
        }
      }
      
      // 固定タグリスト（最終手段）
      if (tags.length === 0) {
        return ['観光', '食べ歩き', 'アート'];
      }
    } catch (e) {
      console.error('タグの取得に失敗:', e);
    }
    
    // 重複を削除して返す
    return [...new Set(tags)];
  }
  
  // 変更を監視
  function setupChangeListeners() {
    // ドキュメント全体のクリック
    document.addEventListener('click', function(e) {
      // タグ系要素のクリック
      if (e.target.closest('.badge') || 
          e.target.closest('.tag') || 
          e.target.closest('.chip') ||
          e.target.closest('.selected-tag-remove') ||
          e.target.closest('.custom-chip-remove') ||
          e.target.closest('#add-custom-tag-btn')) {
        
        console.log('タグ関連の操作を検出');
        setTimeout(findAndUpdatePreview, 500);
      }
    });
    
    // フォーム要素の変更
    document.addEventListener('change', function(e) {
      console.log('フォーム要素の変更を検出');
      setTimeout(findAndUpdatePreview, 500);
    });
    
    // カスタムタグ入力
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.id === 'custom-keyword-input') {
        console.log('カスタムタグの追加を検出');
        setTimeout(findAndUpdatePreview, 500);
      }
    });
  }
  
  // 初期化処理
  function initialize() {
    console.log('バッジタグ修正を初期化');
    
    // 最初の修正実行
    setTimeout(findAndUpdatePreview, 100);
    
    // 監視設定
    setupChangeListeners();
    
    // 定期実行（バックアップとして）
    setInterval(findAndUpdatePreview, 2000);
  }
  
  // 実行開始
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initialize();
  } else {
    document.addEventListener('DOMContentLoaded', initialize);
  }
})();