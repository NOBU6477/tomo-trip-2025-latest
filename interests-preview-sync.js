/**
 * キーワード・専門分野選択とプロフィールプレビューの同期
 * 選択したタグをプロフィールプレビューに反映させる
 */
(function() {
  // プロフィールプレビューとキーワード選択の同期を初期化
  document.addEventListener('DOMContentLoaded', function() {
    console.log('プロフィールプレビュー同期: 初期化を開始します');
    // 初期化処理は少し遅延させて他のスクリプトの後に実行
    setTimeout(initInterestsPreviewSync, 500);
    
    // 定期的に再確認（動的な変更に対応）
    setInterval(syncInterestsToPreview, 1000);
  });
  
  // タグ情報の同期を初期化
  function initInterestsPreviewSync() {
    console.log('専門分野・キーワード同期システム初期化...');
    
    // ページ上の変更を監視
    setupInterestsChangeListeners();
    
    // プレビューにイベントリスナーを追加
    setupPreviewListeners();
    
    // 初回の同期を実行
    syncInterestsToPreview();
    
    // 設定完了後も複数回実行（遅延ロードに対応）
    setTimeout(syncInterestsToPreview, 700);
    setTimeout(syncInterestsToPreview, 1500);
    setTimeout(syncInterestsToPreview, 3000);
  }
  
  // 興味・専門分野の変更を監視
  function setupInterestsChangeListeners() {
    // 選択中のタグのコンテナを監視
    const selectedTagsContainer = document.getElementById('selected-tags-preview');
    
    if (selectedTagsContainer) {
      // MutationObserverを使用して子要素の変更を検出
      const observer = new MutationObserver(function(mutations) {
        syncInterestsToPreview();
      });
      
      observer.observe(selectedTagsContainer, {
        childList: true,
        subtree: true
      });
    }
    
    // プリセットタグのクリックを監視
    const presetContainer = document.getElementById('preset-tags');
    if (presetContainer) {
      presetContainer.addEventListener('click', function(e) {
        setTimeout(syncInterestsToPreview, 100);
      });
    }
    
    // カスタムタグの追加ボタンにもリスナーを追加
    const addButton = document.getElementById('add-custom-tag-btn');
    if (addButton) {
      addButton.addEventListener('click', function() {
        setTimeout(syncInterestsToPreview, 100);
      });
    }
    
    // フォーム内の入力変更も監視
    const inputs = document.querySelectorAll('input, button');
    inputs.forEach(input => {
      input.addEventListener('click', function() {
        // クリック後少し遅延させて同期（DOM更新後）
        setTimeout(syncInterestsToPreview, 200);
      });
    });
  }
  
  // プレビュー更新リスナーを設定
  function setupPreviewListeners() {
    // プロフィール情報の変更を監視
    const profileInputs = document.querySelectorAll('input[id^="guide-"], textarea[id^="guide-"]');
    profileInputs.forEach(input => {
      ['input', 'change', 'blur'].forEach(event => {
        input.addEventListener(event, function() {
          syncInterestsToPreview();
        });
      });
    });
  }
  
  // すべてのプレビューカードを探す
  function findAllPreviewCards() {
    // より広範囲なセレクタでプレビューカードを検索
    const selectors = [
      '.profile-preview', 
      '[id^="profile-preview"]',
      '.card.profile-preview-card',
      '.card.mb-4',
      'div.card.h-100 > div.card-body',
      'div[style*="overflow-y"] > div.card',
      '.card:has(.card-footer:has(.btn-primary))',
      // 青いヘッダーを持つカードを直接ターゲット
      'div.card:has(div.card-header.bg-primary)',
      // 青いタイトル「プロフィールプレビュー」を含むカード
      '.card:has(h5.text-white), .card:has(div.text-white)',
      // 右側のプレビューエリアに特化
      '.col-md-4 .card, .col-lg-4 .card, .col-xl-4 .card',
      // 最後の手段 - すべてのカード（他の要素が見つからない場合）
      '.card'
    ];
    
    let cards = [];
    
    // 各セレクタで要素を探し、結果を蓄積
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(el => {
          // すでに追加済みの要素は重複して追加しない
          if (!cards.includes(el)) {
            cards.push(el);
          }
        });
      }
    });
    
    // カードが見つからない場合、特定の要素を直接探してみる
    if (cards.length === 0) {
      // タイトル「プロフィールプレビュー」を含む要素
      document.querySelectorAll('h5, h4, div').forEach(el => {
        if (el.textContent && el.textContent.includes('プロフィールプレビュー')) {
          // 親要素をカードとして扱う
          let parent = el.closest('.card') || el.parentElement?.closest('div');
          if (parent && !cards.includes(parent)) {
            cards.push(parent);
          }
        }
      });
    }
    
    // 青い背景を持つカードを探す
    if (cards.length === 0) {
      document.querySelectorAll('[style*="background"]').forEach(el => {
        if (getComputedStyle(el).backgroundColor.includes('rgb(0, 123, 255)') ||
            getComputedStyle(el).backgroundColor.includes('rgb(13, 110, 253)')) {
          let parent = el.closest('div');
          if (parent && !cards.includes(parent)) {
            cards.push(parent);
          }
        }
      });
    }
    
    console.log(`プレビューカード: ${cards.length}個検出`);
    return cards;
  }
  
  // プレビューカードのタグを更新
  function updatePreviewCardTags(preview, selectedTags) {
    if (!preview || !selectedTags || selectedTags.length === 0) return;
    
    // カードの構造を解析
    const cardHeader = preview.querySelector('.card-header');
    const cardBody = preview.querySelector('.card-body') || preview;
    const cardFooter = preview.querySelector('.card-footer');
    
    // タグコンテナを探すか作成
    let tagContainer = preview.querySelector('.preview-tags-container');
    
    if (!tagContainer) {
      // タグコンテナを新規作成
      tagContainer = document.createElement('div');
      tagContainer.className = 'preview-tags-container';
      
      // 料金セクションがある場合はその前に挿入
      const priceSection = cardBody.querySelector('[class*="price"], [class*="fee"], .price-badge, .fee-badge');
      
      if (cardFooter) {
        // タグを料金より上に表示（フッターがある場合）
        if (priceSection && priceSection.closest('.card-footer')) {
          cardFooter.insertBefore(tagContainer, priceSection);
        } else {
          cardFooter.prepend(tagContainer);
        }
      } else if (priceSection) {
        // 料金の前にタグを挿入
        priceSection.parentElement.insertBefore(tagContainer, priceSection);
      } else {
        // カードの最後にタグを追加
        cardBody.appendChild(tagContainer);
      }
    }
    
    // コンテナがあればタグを更新
    tagContainer.innerHTML = ''; // クリア
    
    // 一旦別の配列に格納してからHTML操作（DOMバッチ処理）
    const tagsHTML = [];
    
    selectedTags.forEach(tag => {
      tagsHTML.push(`<span class="preview-tag tag-${tag.category}">${tag.label}</span>`);
    });
    
    // 一度にHTMLを追加（パフォーマンス向上）
    tagContainer.innerHTML = tagsHTML.join('');
    
    // タグコンテナが空でない場合、スタイルを適用
    if (tagsHTML.length > 0) {
      tagContainer.style.display = 'flex';
      tagContainer.style.flexWrap = 'wrap';
      tagContainer.style.gap = '4px';
      tagContainer.style.marginTop = '8px';
      tagContainer.style.marginBottom = '8px';
    }
  }
  
  // プレビューにキーワードタグを反映
  function syncInterestsToPreview() {
    console.log('専門分野・キーワードをプレビューに同期...');
    
    // すべてのプレビューカードを探す
    const previewCards = findAllPreviewCards();
    if (!previewCards || previewCards.length === 0) {
      console.log('プレビューカードが見つかりません。再試行します...');
      return;
    }
    
    // 選択中のタグを取得
    const selectedTags = getSelectedInterestTags();
    
    // 直接タグを追加（カードの構造を無視）
    if (selectedTags && selectedTags.length > 0) {
      // まず右側のカラムを探す
      const rightColumn = document.querySelector('.col-md-4, .col-lg-4, .col-xl-4');
      if (rightColumn) {
        // 右側に「プロフィールプレビュー」ヘッダーがあるか探す
        const previewHeader = rightColumn.querySelector('h5, h4, div, .card-header');
        if (previewHeader && previewHeader.textContent && previewHeader.textContent.includes('プロフィール')) {
          // タグを挿入する最適な場所を探す
          const targetCard = previewHeader.closest('.card') || previewHeader.parentElement;
          
          if (targetCard) {
            // カード上のタグコンテナをチェック
            updatePreviewCardTags(targetCard, selectedTags);
          }
        }
      }
    }
    
    // すべてのプレビューカードに対してタグを更新
    previewCards.forEach(preview => {
      updatePreviewCardTags(preview, selectedTags);
    });
    
    // 最終手段：カードが見つからない場合は直接青いヘッダーの下にタグを挿入
    if (previewCards.length === 0) {
      const blueHeaders = Array.from(document.querySelectorAll('div[style*="background-color"]')).filter(el => {
        const bgColor = getComputedStyle(el).backgroundColor;
        return bgColor.includes('rgb(0, 123, 255)') || bgColor.includes('rgb(13, 110, 253)');
      });
      
      if (blueHeaders.length > 0) {
        blueHeaders.forEach(header => {
          const headerParent = header.parentElement;
          let tagContainer = headerParent.querySelector('.preview-tags-container');
          
          if (!tagContainer && headerParent) {
            tagContainer = document.createElement('div');
            tagContainer.className = 'preview-tags-container';
            // ヘッダーの後に挿入
            if (header.nextElementSibling) {
              headerParent.insertBefore(tagContainer, header.nextElementSibling);
            } else {
              headerParent.appendChild(tagContainer);
            }
            
            // タグを追加
            updatePreviewCardTags(headerParent, selectedTags);
          }
        });
      }
    }
  }
  
  // 選択中のタグを取得
  function getSelectedInterestTags() {
    const tags = [];
    
    // 選択中のタグコンテナを探す
    const selectedTagsContainer = document.getElementById('selected-tags-preview');
    if (!selectedTagsContainer) return tags;
    
    // 各タグ要素を取得
    const tagElements = selectedTagsContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
    
    tagElements.forEach(tagElement => {
      const tagValue = tagElement.dataset.value;
      const tagText = tagElement.querySelector('.selected-tag-text')?.textContent || '';
      
      // カテゴリを特定
      let category = '';
      if (tagValue.startsWith('custom:')) {
        category = 'custom';
      } else {
        // 主要カテゴリのマッピング
        const categoryMap = {
          'night': 'night',
          'food': 'food',
          'photo': 'photo',
          'cooking': 'cooking',
          'activity': 'activity'
        };
        category = categoryMap[tagValue] || 'general';
      }
      
      tags.push({
        value: tagValue,
        label: tagText,
        category: category
      });
    });
    
    // オリジナルのチェックボックスからも補完（UIで選択されていない場合のフォールバック）
    const originalCheckboxes = document.querySelectorAll('.form-check-input[id^="interest-"]:checked');
    originalCheckboxes.forEach(checkbox => {
      const value = checkbox.id.replace('interest-', '');
      
      // すでに追加済みのタグはスキップ
      const exists = tags.some(tag => tag.value === value);
      if (exists) return;
      
      const label = checkbox.nextElementSibling?.textContent || value;
      
      tags.push({
        value: value,
        label: label,
        category: value
      });
    });
    
    return tags;
  }
  
  // スタイルを挿入
  function injectPreviewTagStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* プレビュータグのスタイル */
      .preview-tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 8px;
        margin-bottom: 8px;
      }
      
      .preview-tag {
        display: inline-block;
        background-color: #007bff;
        color: white;
        font-size: 11px;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 12px;
        white-space: nowrap;
      }
      
      /* カテゴリ別のスタイル */
      .preview-tag.tag-night {
        background-color: #3f51b5;
      }
      
      .preview-tag.tag-food {
        background-color: #e65100;
      }
      
      .preview-tag.tag-photo {
        background-color: #00838f;
      }
      
      .preview-tag.tag-cooking {
        background-color: #e65100;
      }
      
      .preview-tag.tag-activity {
        background-color: #558b2f;
      }
      
      .preview-tag.tag-custom {
        background-color: #ff9800;
      }
      
      .preview-tag.tag-general {
        background-color: #6c757d;
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // 初期化時にスタイルを挿入
  injectPreviewTagStyles();
})();