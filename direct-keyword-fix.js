/**
 * プロフィールプレビューの青背景削除と専用キーワードセクション追加
 * より直接的なDOM操作でキーワードを表示
 */
(function() {
  console.log("キーワード表示修正スクリプトを開始");
  
  // スタイルを適用するだけの簡易関数
  function applyStyles() {
    // カスタムCSSをページに挿入
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* 背景色を強制的に透明化 */
      .profile-preview-container,
      .profile-preview-container *,
      .card,
      .card *,
      .card-body,
      .card-body *,
      .profile-tags,
      .profile-tags *,
      .profile-tags-section,
      .profile-tags-section *,
      [class*="bg-"],
      [class*="bg-"] *,
      [class*="blue"],
      [class*="blue"] *,
      div[style*="background"],
      .session-info,
      .session-info *,
      .session-details,
      .session-details * {
        background-color: transparent !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // キーワードセクションを追加する関数
  function addKeywordSection() {
    // プレビューカードを探す - 優先順位順
    const previewElements = [
      document.querySelector('.profile-preview-container'),
      document.querySelector('.card-body'),
      document.querySelector('.card'),
      document.querySelector('.preview-card'),
      document.querySelector('[id*="preview"]'),
      document.querySelector('.col-lg-4 .card')
    ];
    
    let previewCard = null;
    for (const el of previewElements) {
      if (el) {
        previewCard = el;
        break;
      }
    }
    
    if (!previewCard) {
      console.warn('プレビューカードが見つかりませんでした');
      return;
    }
    
    // 既存のキーワードセクションがあれば削除
    const existingSection = document.querySelector('.direct-keyword-section');
    if (existingSection) {
      existingSection.parentNode.removeChild(existingSection);
    }
    
    // キーワードセクションを新規作成
    const keywordSection = document.createElement('div');
    keywordSection.className = 'direct-keyword-section';
    keywordSection.style.cssText = 'margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0,0,0,0.1); width: 100%; display: block;';
    
    // タイトル
    const title = document.createElement('div');
    title.className = 'direct-keyword-title';
    title.style.cssText = 'font-weight: 600; margin-bottom: 8px; font-size: 14px; color: #333;';
    title.textContent = '専門分野・キーワード';
    keywordSection.appendChild(title);
    
    // 選択されているキーワードを取得して表示
    const keywords = getSelectedKeywords();
    
    if (keywords.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = 'color: #6c757d; font-size: 12px; font-style: italic;';
      emptyMsg.textContent = '選択されたキーワードはありません';
      keywordSection.appendChild(emptyMsg);
    } else {
      // タグを表示
      keywords.forEach(keyword => {
        const tag = document.createElement('div');
        tag.className = 'direct-keyword-tag';
        tag.style.cssText = 'display: inline-flex; align-items: center; background-color: #f8f9fa; border: 1px solid rgba(0,0,0,0.08); border-radius: 50px; padding: 4px 10px; margin-right: 5px; margin-bottom: 5px; font-size: 12px; color: #333;';
        
        // アイコン
        const icon = document.createElement('span');
        icon.style.cssText = 'margin-right: 5px; font-size: 10px;';
        icon.innerHTML = '<i class="bi bi-tag"></i>';
        
        // テキスト
        const text = document.createElement('span');
        text.textContent = keyword;
        
        tag.appendChild(icon);
        tag.appendChild(text);
        keywordSection.appendChild(tag);
      });
    }
    
    // カードの内部 - 料金表示の後に挿入
    const priceDisplay = previewCard.querySelector('.price-display') || 
                         previewCard.querySelector('.price-tag') || 
                         previewCard.querySelector('.session-price');
                          
    if (priceDisplay) {
      // 料金表示の後ろに挿入
      if (priceDisplay.nextSibling) {
        priceDisplay.parentNode.insertBefore(keywordSection, priceDisplay.nextSibling);
      } else {
        priceDisplay.parentNode.appendChild(keywordSection);
      }
      console.log('料金表示の後にキーワードセクションを追加しました');
    } else {
      // 料金表示がなければカード最下部に追加
      const cardBody = previewCard.querySelector('.card-body');
      if (cardBody) {
        cardBody.appendChild(keywordSection);
      } else {
        previewCard.appendChild(keywordSection);
      }
      console.log('カード最下部にキーワードセクションを追加しました');
    }
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
          const text = tag.querySelector('.selected-tag-text')?.textContent?.trim();
          if (text) keywords.push(text);
        });
      }
      
      // カスタムキーワード
      const customTags = document.querySelectorAll('.custom-tag');
      customTags.forEach(tag => {
        const text = tag.textContent?.replace('×', '').trim();
        if (text) keywords.push(text);
      });
      
      // そのほかのチェックボックス
      if (keywords.length === 0) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
        checkboxes.forEach(checkbox => {
          const label = checkbox.nextElementSibling?.textContent?.trim();
          if (label) keywords.push(label);
        });
      }
    } catch (e) {
      console.error('キーワード取得中にエラーが発生しました:', e);
    }
    
    console.log('選択されているキーワード:', keywords);
    return keywords;
  }
  
  // キーワード選択の変更を監視
  function watchKeywordChanges() {
    // カスタムキーワード追加を監視
    document.addEventListener('click', function(e) {
      if (e.target.closest('.interests-preset-chip') || 
          e.target.closest('.selected-tag-remove') || 
          e.target.closest('.custom-chip-remove') ||
          e.target.closest('#add-custom-tag-btn')) {
        console.log('キーワード関連のクリックを検出: セクションを更新します');
        setTimeout(addKeywordSection, 100);
      }
    });
    
    // 入力フィールドでのEnterキー対応
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.closest('#custom-keyword-input')) {
        console.log('カスタムキーワードでEnterを検出: セクションを更新します');
        setTimeout(addKeywordSection, 100);
      }
    });
    
    // チェックボックス変更を監視
    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('チェックボックス変更を検出: セクションを更新します');
        setTimeout(addKeywordSection, 100);
      });
    });
  }
  
  // 初期化
  function initialize() {
    // 背景色を透明化
    applyStyles();
    
    // キーワードセクションを追加
    addKeywordSection();
    
    // 変更監視を開始
    watchKeywordChanges();
    
    // 定期的に更新（バックアップとして）
    setInterval(addKeywordSection, 2000);
  }
  
  // DOMの準備ができたら実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initialize, 500);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initialize, 500);
    });
  }
  
  // 複数回の初期化でカバレッジを確保
  setTimeout(initialize, 1000);
  setTimeout(initialize, 2000);

})();