/**
 * 特定のセレクターエラーを回避した専門分野・キーワードタグ表示修正
 */
(function() {
  console.log('直接タグ修正を実行します');
  
  // スタイルの追加
  const style = document.createElement('style');
  style.textContent = `
    .direct-tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 10px 0;
      padding: 6px;
    }
    
    .direct-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 500;
      color: white;
      background: #007bff;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .direct-tag.tag-activity { background: #2e7d32; }
    .direct-tag.tag-night { background: #3f51b5; }
    .direct-tag.tag-food, .direct-tag.tag-cooking { background: #e65100; }
    .direct-tag.tag-photo { background: #00838f; }
    .direct-tag.tag-custom { background: #ff9800; }
    .direct-tag.tag-general { background: #6c757d; }
  `;
  document.head.appendChild(style);
  
  // ページロード完了を待つ
  window.addEventListener('load', function() {
    // ロード後に少し遅らせて実行
    setTimeout(function() {
      initializeDirectTagFix();
      
      // タグ変更時に更新
      setupChangeListeners();
      
      // 念のため定期的に更新
      setInterval(updateTags, 2000);
    }, 1200);
  });
  
  // 変更監視
  function setupChangeListeners() {
    document.addEventListener('click', function(e) {
      // タグ追加・削除に関連する要素のクリックを監視
      if (
        e.target.closest('.interests-preset-chip') || 
        e.target.closest('.selected-tag-preview') ||
        e.target.closest('.custom-chip-remove') ||
        e.target.closest('#add-custom-tag-btn')
      ) {
        setTimeout(updateTags, 300);
      }
    });
    
    // カスタムタグの入力も監視
    const tagInput = document.getElementById('new-custom-tag');
    if (tagInput) {
      tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateTags, 300);
        }
      });
    }
  }
  
  // 初期化
  function initializeDirectTagFix() {
    // 現在選択中のタグを取得
    const tags = getSelectedTags();
    
    if (tags.length > 0) {
      console.log(`選択タグを表示します: ${tags.length}個`);
      displayTagsInPreview(tags);
    } else {
      console.log('表示するタグがありません');
    }
  }
  
  // タグ更新
  function updateTags() {
    const tags = getSelectedTags();
    
    if (tags.length > 0) {
      displayTagsInPreview(tags);
    }
  }
  
  // プレビューにタグを表示
  function displayTagsInPreview(tags) {
    // プレビューエリアを見つける
    const previewArea = findPreviewArea();
    
    if (!previewArea) {
      console.log('プレビューエリアが見つかりません');
      return;
    }
    
    // カードボディ（コンテンツエリア）を見つける
    const contentArea = previewArea.querySelector('.card-body') || previewArea;
    
    // すでにタグコンテナがあるかチェック
    let tagContainer = previewArea.querySelector('.direct-tag-container');
    
    if (!tagContainer) {
      // 新しいタグコンテナを作成
      tagContainer = document.createElement('div');
      tagContainer.className = 'direct-tag-container';
      
      // 適切な位置に挿入
      insertAtStrategicPosition(contentArea, tagContainer);
    }
    
    // コンテナの内容をクリア
    tagContainer.innerHTML = '';
    
    // タグ要素を追加
    tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = `direct-tag tag-${tag.category}`;
      tagElement.textContent = tag.label;
      tagContainer.appendChild(tagElement);
    });
  }
  
  // 最適な位置にタグコンテナを挿入
  function insertAtStrategicPosition(container, tagContainer) {
    // 1. 料金要素の前がベスト
    const priceElement = container.querySelector('[class*="price"], [class*="fee"]');
    if (priceElement) {
      priceElement.parentNode.insertBefore(tagContainer, priceElement);
      return;
    }
    
    // 2. 最初の段落の後が次点
    const paragraphs = container.querySelectorAll('p');
    if (paragraphs.length > 0) {
      const targetParagraph = paragraphs[0];
      
      // 次の要素があればその前に、なければ親の最後に追加
      if (targetParagraph.nextSibling) {
        targetParagraph.parentNode.insertBefore(tagContainer, targetParagraph.nextSibling);
      } else {
        targetParagraph.parentNode.appendChild(tagContainer);
      }
      return;
    }
    
    // 3. カードタイトルの後
    const title = container.querySelector('.card-title, h5, h4, h3');
    if (title) {
      if (title.nextSibling) {
        title.parentNode.insertBefore(tagContainer, title.nextSibling);
      } else {
        title.parentNode.appendChild(tagContainer);
      }
      return;
    }
    
    // 4. どこにも見つからない場合はコンテナの先頭
    if (container.firstChild) {
      container.insertBefore(tagContainer, container.firstChild);
    } else {
      container.appendChild(tagContainer);
    }
  }
  
  // プレビューエリアを見つける
  function findPreviewArea() {
    // 方法1: プロフィール画像から探す
    const profileImage = document.getElementById('main-profile-preview');
    if (profileImage) {
      const card = findParentCard(profileImage);
      if (card) return card;
    }
    
    // 方法2: 青いヘッダーがあるカードを探す
    const blueHeaders = document.querySelectorAll('.card-header.bg-primary, .card-header[style*="background-color: rgb(0, 123, 255)"]');
    for (const header of blueHeaders) {
      const text = header.textContent || '';
      if (text.includes('プロフィール') || text.includes('Profile')) {
        return header.closest('.card');
      }
    }
    
    // 方法3: 右側カラムにあるカードを順に確認
    const rightColumns = document.querySelectorAll('.col-md-4, .col-lg-4');
    if (rightColumns.length > 0) {
      // 最後の右カラムが通常プレビュー
      const lastColumn = rightColumns[rightColumns.length - 1];
      const cards = lastColumn.querySelectorAll('.card');
      
      if (cards.length > 0) {
        // ヘッダーにプロフィールという文字があるカードを探す
        for (const card of cards) {
          const headers = card.querySelectorAll('.card-header, h5, h4, h3');
          for (const header of headers) {
            if (header.textContent && (
                header.textContent.includes('プロフィール') || 
                header.textContent.includes('Profile')
            )) {
              return card;
            }
          }
        }
        
        // 見つからなければ最初のカードを返す
        return cards[0];
      }
    }
    
    return null;
  }
  
  // 親カードを探す
  function findParentCard(element) {
    if (!element) return null;
    
    // 要素自身がカードならそれを返す
    if (element.classList && element.classList.contains('card')) {
      return element;
    }
    
    // 親要素をさかのぼってカードを探す
    let current = element.parentElement;
    while (current) {
      if (current.classList && current.classList.contains('card')) {
        return current;
      }
      current = current.parentElement;
    }
    
    return null;
  }
  
  // 選択中のタグを取得
  function getSelectedTags() {
    const tags = [];
    
    // 新UIで選択中のタグを取得
    const selectedContainer = document.getElementById('selected-tags-preview');
    if (selectedContainer) {
      const selectedTags = selectedContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
      
      selectedTags.forEach(tag => {
        const value = tag.dataset.value || '';
        const label = tag.querySelector('.selected-tag-text')?.textContent || '';
        
        if (label) {
          // カテゴリの特定
          let category = 'general';
          
          if (value.startsWith('custom:')) {
            category = 'custom';
          } else if (value) {
            category = value;
          }
          
          tags.push({
            value: value,
            label: label,
            category: category
          });
        }
      });
    }
    
    // 従来のチェックボックスからのフォールバック
    if (tags.length === 0) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
      
      checkboxes.forEach(checkbox => {
        const value = checkbox.id.replace('interest-', '');
        const label = checkbox.nextElementSibling?.textContent?.trim() || value;
        
        tags.push({
          value: value,
          label: label,
          category: value
        });
      });
    }
    
    return tags;
  }
})();