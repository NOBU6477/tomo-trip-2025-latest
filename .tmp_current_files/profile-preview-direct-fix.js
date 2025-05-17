/**
 * プロフィールプレビューのタグ表示を直接修正する最終手段のスクリプト
 * document.readyの段階でDOM要素を先読みして直接タグを挿入
 */
(function() {
  // DOM読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('プロフィールプレビュー直接修正を開始します...');
    // 少し遅延させて実行（他のスクリプトが完了した後）
    setTimeout(directProfilePreviewFix, 1000);
    // 定期的にチェック（動的なDOM変更に対応）
    setInterval(directProfilePreviewFix, 2000);
  });
  
  // プレビューを直接修正する
  function directProfilePreviewFix() {
    console.log('プレビュー直接修正を実行中...');
    
    // 右サイドバーの青いヘッダー要素を探す
    const blueHeaders = Array.from(document.querySelectorAll('.card-header, [style*="background"], [class*="bg-"]')).filter(el => {
      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;
      // 青系の色を検出
      return bgColor.includes('rgb(0, 123, 255)') || 
             bgColor.includes('rgb(13, 110, 253)') ||
             bgColor.includes('rgb(0, 0, 255)') || 
             bgColor.includes('blue');
    });
    
    if (blueHeaders.length > 0) {
      console.log(`青いヘッダーを ${blueHeaders.length} 個検出しました`);
      
      blueHeaders.forEach(header => {
        // ヘッダー内に「プロフィール」というテキストがあるか確認
        if (header.textContent && header.textContent.includes('プロフィール')) {
          console.log('プロフィールプレビューヘッダーを検出しました');
          
          // 親カードを探す
          const parentCard = header.closest('.card') || header.parentElement;
          
          if (parentCard) {
            // カード内のコンテンツ部分を探す
            const cardBody = parentCard.querySelector('.card-body') || 
                             parentCard.querySelector('div:not(.card-header)') || 
                             parentCard;
            
            // すでにタグコンテナがあるか確認
            let tagContainer = cardBody.querySelector('.preview-tags-container, .tag-container');
            
            // なければ作成
            if (!tagContainer) {
              tagContainer = document.createElement('div');
              tagContainer.className = 'preview-tags-container';
              tagContainer.style.display = 'flex';
              tagContainer.style.flexWrap = 'wrap';
              tagContainer.style.gap = '4px';
              tagContainer.style.marginTop = '8px';
              tagContainer.style.marginBottom = '8px';
              
              // 料金表示の前に挿入
              const priceElement = cardBody.querySelector('[class*="price"], [class*="fee"], .price-badge');
              if (priceElement) {
                cardBody.insertBefore(tagContainer, priceElement);
              } else {
                // 最後に挿入
                cardBody.appendChild(tagContainer);
              }
            }
            
            // タグコンテナが確保できたら内容を更新
            updateTagsFromInterests(tagContainer);
          }
        }
      });
    } else {
      console.log('青いヘッダーが見つかりませんでした');
      
      // 別の方法でプレビューカードを探す
      const previewElements = document.querySelectorAll(
        '.profile-preview, [id*="profile-preview"], .card.mb-4, .col-md-4 > .card, .col-lg-4 > .card'
      );
      
      if (previewElements.length > 0) {
        console.log(`別の方法でプレビューカードを ${previewElements.length} 個検出しました`);
        
        previewElements.forEach(preview => {
          const cardBody = preview.querySelector('.card-body') || preview;
          
          // すでにタグコンテナがあるか確認
          let tagContainer = cardBody.querySelector('.preview-tags-container, .tag-container');
          
          // なければ作成
          if (!tagContainer) {
            tagContainer = document.createElement('div');
            tagContainer.className = 'preview-tags-container';
            tagContainer.style.display = 'flex';
            tagContainer.style.flexWrap = 'wrap';
            tagContainer.style.gap = '4px';
            tagContainer.style.marginTop = '8px';
            tagContainer.style.marginBottom = '8px';
            
            // 料金表示の前に挿入
            const priceElement = cardBody.querySelector('[class*="price"], [class*="fee"], .price-badge');
            if (priceElement) {
              cardBody.insertBefore(tagContainer, priceElement);
            } else {
              // 適切な位置に挿入
              const textElement = cardBody.querySelector('p');
              if (textElement && textElement.nextSibling) {
                cardBody.insertBefore(tagContainer, textElement.nextSibling);
              } else {
                cardBody.appendChild(tagContainer);
              }
            }
          }
          
          // タグコンテナが確保できたら内容を更新
          updateTagsFromInterests(tagContainer);
        });
      }
    }
  }
  
  // 選択されたキーワードからタグコンテナを更新
  function updateTagsFromInterests(tagContainer) {
    if (!tagContainer) return;
    
    // 選択されたタグを取得
    const selectedTags = getSelectedInterests();
    
    if (selectedTags && selectedTags.length > 0) {
      // 既存のタグをクリア
      tagContainer.innerHTML = '';
      
      // 新しいタグを追加
      selectedTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = `preview-tag tag-${tag.category}`;
        tagElement.textContent = tag.label;
        tagElement.style.display = 'inline-block';
        tagElement.style.backgroundColor = getCategoryColor(tag.category);
        tagElement.style.color = 'white';
        tagElement.style.fontSize = '11px';
        tagElement.style.fontWeight = '500';
        tagElement.style.padding = '2px 8px';
        tagElement.style.borderRadius = '12px';
        tagElement.style.marginRight = '4px';
        tagElement.style.marginBottom = '4px';
        
        tagContainer.appendChild(tagElement);
      });
    }
  }
  
  // 選択された興味・専門分野のタグを取得
  function getSelectedInterests() {
    const tags = [];
    
    // 新UIのタグ選択要素から取得
    const selectedContainer = document.getElementById('selected-tags-preview');
    if (selectedContainer) {
      const selectedTags = selectedContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
      
      selectedTags.forEach(tag => {
        const value = tag.dataset.value;
        const label = tag.querySelector('.selected-tag-text')?.textContent || '';
        
        if (label) {
          // カテゴリを特定
          let category = 'general';
          if (value) {
            if (value.startsWith('custom:')) {
              category = 'custom';
            } else {
              category = value;
            }
          }
          
          tags.push({
            value: value || label,
            label: label,
            category: category
          });
        }
      });
    }
    
    // 従来のチェックボックスからも取得
    if (tags.length === 0) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
      checkboxes.forEach(checkbox => {
        const value = checkbox.value;
        const label = checkbox.nextElementSibling?.textContent || value;
        
        tags.push({
          value: value,
          label: label,
          category: value
        });
      });
    }
    
    return tags;
  }
  
  // カテゴリ別の色を取得
  function getCategoryColor(category) {
    const colorMap = {
      'night': '#3f51b5',
      'food': '#e65100',
      'photo': '#00838f',
      'cooking': '#e65100',
      'activity': '#558b2f',
      'custom': '#ff9800',
      'general': '#6c757d'
    };
    
    return colorMap[category] || '#007bff';
  }
  
  // スタイルを注入
  function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
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
        margin-right: 4px;
        margin-bottom: 4px;
      }
      
      .preview-tag.tag-night { background-color: #3f51b5; }
      .preview-tag.tag-food { background-color: #e65100; }
      .preview-tag.tag-photo { background-color: #00838f; }
      .preview-tag.tag-cooking { background-color: #e65100; }
      .preview-tag.tag-activity { background-color: #558b2f; }
      .preview-tag.tag-custom { background-color: #ff9800; }
      .preview-tag.tag-general { background-color: #6c757d; }
    `;
    document.head.appendChild(styleElement);
  }
  
  // スタイルを先に注入しておく
  injectStyles();
})();