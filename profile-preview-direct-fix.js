/**
 * プロフィールプレビューを直接操作して修正する最終対応
 * 青背景の除去と専用キーワードセクションの追加
 */
(function() {
  console.log('プロフィールプレビュー修正スクリプトを実行');
  
  // CSSを強制的に適用
  function injectStrongCSS() {
    const css = `
      /* 青背景を強制削除 */
      .profile-preview-card,
      .profile-preview-card *,
      .profile-preview,
      .profile-preview *,
      .profile-preview .card,
      .profile-preview .card *,
      .card-body,
      .card-body *,
      .profile-tags,
      .profile-tags *,
      .session-info,
      .session-info *,
      .tag-list,
      .tag-list *,
      div[class*="bg-"],
      div[class*="bg-"] *,
      [class*="blue"],
      [class*="blue"] *,
      div[style*="background"] {
        background-color: transparent !important;
        background-image: none !important;
        background: none !important;
        box-shadow: none !important;
      }
      
      /* 新スタイルのキーワードタグ */
      .preview-keyword-tag {
        display: inline-flex !important;
        align-items: center !important;
        background-color: #f8f9fa !important;
        border: 1px solid rgba(0,0,0,0.1) !important;
        border-radius: 50px !important;
        padding: 4px 10px !important;
        margin: 3px !important;
        font-size: 12px !important;
        color: #333 !important;
      }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'profile-preview-fix-style';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    console.log('強力なCSSスタイルを適用');
  }
  
  // プロフィールプレビューを探す
  function findProfilePreview() {
    // 可能性のある要素のリスト
    const possibleSelectors = [
      '.profile-preview',
      '.profile-preview-card',
      '.profile-preview-container',
      '.card-preview',
      '.session-preview',
      '.guide-preview',
      '.col-lg-4 .card',
      '.col-md-4 .card',
      '.preview-card'
    ];
    
    // セレクタを順番に試す
    for (const selector of possibleSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`プレビュー要素を発見: ${selector}`);
        return element;
      }
    }
    
    // 最後の手段としてカードを探す
    const cards = document.querySelectorAll('.card');
    for (const card of cards) {
      // サイズが小さめで、右側にあるカードを探す
      const rect = card.getBoundingClientRect();
      if (rect.width < 400 && rect.right > window.innerWidth/2) {
        console.log('位置からプレビューカードを特定');
        return card;
      }
    }
    
    console.log('プレビュー要素が見つかりません');
    return null;
  }
  
  // 青背景要素を直接削除
  function removeBlueBgElements(container) {
    if (!container) return;
    
    // 青背景要素を見つける
    const elements = container.querySelectorAll('*');
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      
      // 青または水色の背景を持つ要素を検出
      if (bg.includes('rgb(') && 
         (bg.includes('200, 230, 255') || 
          bg.includes('230, 240, 255') || 
          bg.includes('240, 248, 255') || 
          bg.includes('220, 240, 255'))) {
        
        console.log('青背景要素を発見:', el);
        // 背景色を透明に
        el.style.backgroundColor = 'transparent';
        el.style.background = 'none';
        
        // クラス名も修正
        if (el.className.includes('bg-')) {
          el.className = el.className.replace(/bg-[^\s]+/g, '');
        }
      }
    });
  }
  
  // キーワードセクションを作成
  function createKeywordSection(container) {
    if (!container) return;
    
    // 既存のセクションを削除
    const existingSection = document.getElementById('preview-keyword-section');
    if (existingSection) {
      existingSection.remove();
    }
    
    // 新しいセクションを作成
    const section = document.createElement('div');
    section.id = 'preview-keyword-section';
    section.style.cssText = `
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.1);
      width: 100%;
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
    
    // タグを取得
    const keywords = getSelectedKeywords();
    
    if (keywords.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.cssText = 'color: #999; font-size: 12px; font-style: italic;';
      emptyMsg.textContent = '選択されたキーワードはありません';
      section.appendChild(emptyMsg);
    } else {
      // タグを表示
      const tagContainer = document.createElement('div');
      tagContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';
      
      keywords.forEach(keyword => {
        const tag = document.createElement('div');
        tag.className = 'preview-keyword-tag';
        tag.innerHTML = `<i class="bi bi-tag" style="margin-right: 4px; font-size: 10px;"></i> ${keyword}`;
        tagContainer.appendChild(tag);
      });
      
      section.appendChild(tagContainer);
    }
    
    // 挿入位置を探す（料金表示の後）
    const priceEl = container.querySelector('.price-tag') || 
                   container.querySelector('.price-display') || 
                   container.querySelector('.session-price');
    
    if (priceEl) {
      // 料金表示の後に挿入
      if (priceEl.nextElementSibling) {
        priceEl.parentNode.insertBefore(section, priceEl.nextElementSibling);
      } else {
        priceEl.parentNode.appendChild(section);
      }
      console.log('料金表示の後にキーワードセクションを挿入');
    } else {
      // 料金表示がなければ最後に追加
      const cardBody = container.querySelector('.card-body');
      if (cardBody) {
        cardBody.appendChild(section);
      } else {
        container.appendChild(section);
      }
      console.log('カードの最後にキーワードセクションを挿入');
    }
  }
  
  // 選択されているキーワードを取得
  function getSelectedKeywords() {
    const keywords = [];
    
    try {
      // ログに表示されているタグリストを探す
      const logs = console.logs || [];
      for (const log of logs) {
        if (log && typeof log[0] === 'string' && log[0].includes('表示するタグリスト')) {
          if (log[1] && Array.isArray(log[1])) {
            return log[1].filter(tag => tag && typeof tag === 'string');
          }
        }
      }
      
      // 新UIの選択されたタグ
      const selectedTags = document.querySelectorAll('.selected-tag-preview');
      selectedTags.forEach(tag => {
        const text = tag.querySelector('.selected-tag-text')?.textContent?.trim();
        if (text) keywords.push(text);
      });
      
      // カスタムタグ
      const customTags = document.querySelectorAll('.custom-tag, .custom-chip');
      customTags.forEach(tag => {
        let text = tag.textContent?.trim();
        if (text) {
          // 「×」や「✕」を削除
          text = text.replace(/[×✕✖]/g, '').trim();
          keywords.push(text);
        }
      });
      
      // チェックボックス
      if (keywords.length === 0) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
        checkboxes.forEach(checkbox => {
          const label = document.querySelector(`label[for="${checkbox.id}"]`)?.textContent?.trim();
          if (label) keywords.push(label);
        });
      }
      
      // 直接ページからタグを探す
      if (keywords.length === 0) {
        const tagElements = document.querySelectorAll('.badge, .tag, .chip, [class*="tag"], [class*="chip"]');
        tagElements.forEach(el => {
          // プレビューエリア以外のタグを集める
          if (!el.closest('.profile-preview') && 
              !el.closest('.profile-preview-card') &&
              !el.closest('#preview-keyword-section')) {
            const text = el.textContent?.trim();
            if (text && !keywords.includes(text)) {
              keywords.push(text);
            }
          }
        });
      }
      
      console.log('キーワード検出:', keywords);
    } catch (e) {
      console.error('キーワード取得エラー:', e);
    }
    
    return [...new Set(keywords)]; // 重複を削除
  }
  
  // 変更を監視
  function setupListeners() {
    // フォーム要素の変更を監視
    document.addEventListener('change', function(e) {
      if (e.target.closest('form') || e.target.closest('.tag-selection')) {
        console.log('フォーム変更を検知');
        setTimeout(updatePreview, 500);
      }
    });
    
    // クリックイベント（特にタグ関連）を監視
    document.addEventListener('click', function(e) {
      if (e.target.closest('.tag') || 
          e.target.closest('.chip') || 
          e.target.closest('.badge') ||
          e.target.closest('.selected-tag-remove') ||
          e.target.closest('.custom-chip-remove') ||
          e.target.closest('#add-custom-tag-btn')) {
        console.log('タグ関連のクリックを検知');
        setTimeout(updatePreview, 500);
      }
    });
    
    // Enterキーでのカスタムタグ追加を監視
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.id === 'custom-keyword-input') {
        console.log('カスタムタグの追加を検知');
        setTimeout(updatePreview, 500);
      }
    });
    
    // 定期的に更新（バックアップ）
    setInterval(updatePreview, 2000);
  }
  
  // プレビューの更新
  function updatePreview() {
    const previewCard = findProfilePreview();
    if (previewCard) {
      removeBlueBgElements(previewCard);
      createKeywordSection(previewCard);
    }
  }
  
  // 初期化
  function initialize() {
    console.log('プロフィールプレビュー修正を初期化');
    injectStrongCSS();
    setupListeners();
    setTimeout(updatePreview, 1000);
  }
  
  // 実行開始
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initialize();
  } else {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  // グローバルに公開（他のスクリプトからも呼び出せるように）
  window.updatePreviewKeywords = updatePreview;
  
  // エラーになっている関数の代替版を提供（互換性のため）
  window.updateBadgeTags = function() {
    console.log('代替のupdateBadgeTags関数が呼び出されました');
    updatePreview();
  };
  
})();