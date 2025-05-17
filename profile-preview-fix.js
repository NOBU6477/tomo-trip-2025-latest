/**
 * プロフィールプレビュー専用修正スクリプト
 * 料金表示の下にキーワードセクションを強制的に追加
 */
(function() {
  console.log('プロフィールプレビュー修正スクリプトを初期化');
  
  // スタイルを直接追加
  const style = document.createElement('style');
  style.textContent = `
    /* キーワードセクション用スタイル */
    .keyword-section {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.1);
      width: 100%;
    }
    
    /* セクションタイトル */
    .keyword-section-title {
      font-weight: 600;
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
    }
    
    /* タグスタイル */
    .keyword-tag {
      display: inline-flex;
      align-items: center;
      background-color: #f8f9fa;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 50px;
      padding: 4px 10px;
      font-size: 12px;
      color: #333;
      margin-right: 5px;
      margin-bottom: 5px;
    }
    
    /* タグアイコン */
    .keyword-tag-icon {
      margin-right: 5px;
      font-size: 10px;
    }
    
    /* 青背景を確実に削除 */
    .profile-preview-container,
    .card-body,
    .profile-preview-container div,
    .card,
    .session-info,
    .price-display,
    [class*="blue-bg"],
    [class*="bg-"],
    .profile-tags-section,
    [class*="tag-section"] {
      background-color: transparent !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);

  // 初期化
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  setTimeout(init, 500);
  setTimeout(init, 1000);
  setTimeout(init, 2000);
  
  // 定期的に実行
  setInterval(init, 2000);
  
  // 初期化処理
  function init() {
    try {
      // プロフィールプレビューカードを見つける
      const previewCard = findProfilePreviewCard();
      if (!previewCard) {
        console.warn('プロフィールプレビューカードが見つかりません');
        return;
      }
      
      // 料金表示を探す
      const priceSection = findPriceSection(previewCard);
      if (!priceSection) {
        console.warn('料金表示が見つかりません');
        
        // 料金表示がなければカードボディの最後に追加
        const cardBody = previewCard.querySelector('.card-body');
        if (cardBody) {
          addKeywordSection(cardBody, 'append');
        } else {
          addKeywordSection(previewCard, 'append');
        }
        return;
      }
      
      // 既存のキーワードセクションがあるか確認
      const existingSection = previewCard.querySelector('.keyword-section');
      if (existingSection) {
        // すでに存在する場合は更新のみ
        updateKeywords(existingSection);
        return;
      }
      
      // 料金表示の後にキーワードセクションを追加
      addKeywordSection(priceSection, 'after');
      
    } catch (e) {
      console.error('プロフィールプレビュー修正中にエラーが発生しました:', e);
    }
  }
  
  // プロフィールプレビューカードを見つける
  function findProfilePreviewCard() {
    // プレビューカードの候補
    const candidates = [
      document.querySelector('.profile-preview-container'),
      document.querySelector('.card'),
      document.querySelector('[id*="preview"]'),
      document.querySelector('[class*="preview"]'),
      document.querySelector('.col-lg-4 .card'),
      document.querySelector('.col-md-6 .card')
    ];
    
    // 見つかった最初の要素を返す
    for (const candidate of candidates) {
      if (candidate) return candidate;
    }
    
    return null;
  }
  
  // 料金表示を見つける
  function findPriceSection(container) {
    // 料金表示の候補
    const candidates = [
      container.querySelector('.price-display'),
      container.querySelector('.session-price'),
      container.querySelector('.price-tag'),
      container.querySelector('.card-body [class*="price"]'),
      container.querySelector('.card-body .price'),
      container.querySelector('.card-body .session-info')
    ];
    
    // 見つかった最初の要素を返す
    for (const candidate of candidates) {
      if (candidate) return candidate;
    }
    
    return null;
  }
  
  // キーワードセクションを追加
  function addKeywordSection(element, position) {
    // 新しいセクションを作成
    const section = document.createElement('div');
    section.className = 'keyword-section';
    
    // セクションタイトル
    const title = document.createElement('div');
    title.className = 'keyword-section-title';
    title.textContent = '専門分野・キーワード';
    section.appendChild(title);
    
    // キーワードを追加
    updateKeywords(section);
    
    // 指定された位置に挿入
    if (position === 'after' && element.parentNode) {
      // 要素の後に挿入
      if (element.nextSibling) {
        element.parentNode.insertBefore(section, element.nextSibling);
      } else {
        element.parentNode.appendChild(section);
      }
    } else {
      // 要素の中に追加
      element.appendChild(section);
    }
    
    console.log('キーワードセクションを追加しました');
  }
  
  // キーワードを更新
  function updateKeywords(section) {
    // 現在選択されているキーワードを取得
    const keywords = getSelectedKeywords();
    
    // セクションタイトル以外をクリア
    const title = section.querySelector('.keyword-section-title');
    section.innerHTML = '';
    
    // タイトルを再挿入
    if (title) {
      section.appendChild(title);
    } else {
      const newTitle = document.createElement('div');
      newTitle.className = 'keyword-section-title';
      newTitle.textContent = '専門分野・キーワード';
      section.appendChild(newTitle);
    }
    
    // キーワードがなければメッセージを表示
    if (keywords.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'keyword-empty-message';
      emptyMessage.textContent = '選択されたキーワードはありません';
      emptyMessage.style.color = '#6c757d';
      emptyMessage.style.fontSize = '12px';
      emptyMessage.style.fontStyle = 'italic';
      section.appendChild(emptyMessage);
      return;
    }
    
    // キーワードを追加
    keywords.forEach(keyword => {
      const tag = document.createElement('div');
      tag.className = 'keyword-tag';
      
      // アイコン
      const icon = document.createElement('span');
      icon.className = 'keyword-tag-icon';
      icon.innerHTML = '<i class="bi bi-tag"></i>';
      
      // テキスト
      const text = document.createElement('span');
      text.textContent = keyword;
      
      tag.appendChild(icon);
      tag.appendChild(text);
      section.appendChild(tag);
    });
  }
  
  // 選択されているキーワードを取得
  function getSelectedKeywords() {
    const keywords = [];
    
    try {
      // 新UIの選択されたタグを取得
      const selectedContainer = document.getElementById('selected-tags-preview');
      if (selectedContainer) {
        const selectedTags = selectedContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
        selectedTags.forEach(tag => {
          const text = tag.querySelector('.selected-tag-text')?.textContent;
          if (text) keywords.push(text);
        });
      }
      
      // そのほかのチェックボックス
      const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
      checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling?.textContent?.trim();
        if (label) keywords.push(label);
      });
      
      // カスタムキーワード
      const customTagContainer = document.querySelector('.custom-tags-container');
      if (customTagContainer) {
        const customTags = customTagContainer.querySelectorAll('.custom-tag');
        customTags.forEach(tag => {
          const text = tag.textContent?.replace('×', '').trim();
          if (text) keywords.push(text);
        });
      }
      
    } catch (e) {
      console.error('キーワード取得中にエラーが発生しました:', e);
    }
    
    return keywords;
  }
  
  // キーワード選択変更を監視
  function watchKeywordChanges() {
    // キーワード入力エリアを監視
    const keywordInput = document.getElementById('custom-keyword-input');
    const addButton = document.getElementById('add-custom-tag-btn');
    
    if (keywordInput) {
      keywordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
          setTimeout(init, 100);
        }
      });
    }
    
    if (addButton) {
      addButton.addEventListener('click', function() {
        setTimeout(init, 100);
      });
    }
    
    // チェックボックス変更を監視
    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        setTimeout(init, 100);
      });
    });
    
    // クリックイベントも監視（タグの選択/削除ボタンなど）
    document.addEventListener('click', function(e) {
      if (e.target.closest('.interests-preset-chip') || 
          e.target.closest('.selected-tag-remove') || 
          e.target.closest('.custom-chip-remove') ||
          e.target.closest('#add-custom-tag-btn')) {
        setTimeout(init, 100);
      }
    });
  }
  
  // 変更監視を開始
  setTimeout(watchKeywordChanges, 1000);
  
})();