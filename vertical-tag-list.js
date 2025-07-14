/**
 * 縦型タグリスト - 完全に別のUI提案
 * シンプルで明確、視認性の高いタグリストを実装
 */
(function() {
  console.log('縦型タグリスト初期化中...');
  
  // CSSスタイル
  const style = document.createElement('style');
  style.textContent = `
    /* 縦型タグコンテナ */
    .vertical-tag-container {
      margin: 12px 0;
      padding: 10px;
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      overflow: visible;
    }
    
    /* タグリストのタイトル */
    .vertical-tag-title {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* タグリスト */
    .vertical-tag-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    /* 個別タグ */
    .vertical-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      padding: 6px 10px;
      border-radius: 4px;
      color: #212529;
      background-color: #ffffff;
      border-left: 4px solid #6c757d;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: transform 0.15s ease;
    }
    
    .vertical-tag:hover {
      transform: translateX(3px);
    }
    
    /* タグアイコン */
    .vertical-tag-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background-color: #6c757d;
      color: white;
      border-radius: 50%;
      font-size: 11px;
    }
    
    /* カテゴリ別色 */
    .vertical-tag.tag-activity {
      border-left-color: #2e7d32;
    }
    .vertical-tag.tag-activity .vertical-tag-icon {
      background-color: #2e7d32;
    }
    
    .vertical-tag.tag-night {
      border-left-color: #3f51b5;
    }
    .vertical-tag.tag-night .vertical-tag-icon {
      background-color: #3f51b5;
    }
    
    .vertical-tag.tag-food, .vertical-tag.tag-cooking {
      border-left-color: #e65100;
    }
    .vertical-tag.tag-food .vertical-tag-icon,
    .vertical-tag.tag-cooking .vertical-tag-icon {
      background-color: #e65100;
    }
    
    .vertical-tag.tag-photo {
      border-left-color: #00838f;
    }
    .vertical-tag.tag-photo .vertical-tag-icon {
      background-color: #00838f;
    }
    
    .vertical-tag.tag-custom {
      border-left-color: #ff9800;
    }
    .vertical-tag.tag-custom .vertical-tag-icon {
      background-color: #ff9800;
    }
    
    /* 空の場合のメッセージ */
    .vertical-tag-empty {
      color: #6c757d;
      font-size: 13px;
      padding: 10px;
      text-align: center;
      font-style: italic;
      background-color: #f1f3f5;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
  
  // カテゴリアイコンマッピング
  const CATEGORY_ICONS = {
    activity: 'bicycle',
    night: 'moon-stars-fill',
    food: 'cup-hot-fill',
    cooking: 'egg-fried',
    photo: 'camera-fill',
    custom: 'bookmark-fill',
    general: 'tag-fill'
  };
  
  // ページ読み込み完了時に実行
  window.addEventListener('load', function() {
    setTimeout(function() {
      console.log('縦型タグリストを初期化');
      initializeVerticalTagList();
      
      // 定期的に更新
      setInterval(updateVerticalTagList, 2000);
    }, 1000);
  });
  
  // 初期化
  function initializeVerticalTagList() {
    // HTMLの挿入とイベント監視を設定
    injectVerticalTagList();
    setupTagSelectionListeners();
  }
  
  // 縦型タグリストを挿入
  function injectVerticalTagList() {
    // 挿入場所を特定（プロフィールプレビュー）
    const profilePreview = findProfilePreviewElement();
    
    if (!profilePreview) {
      console.log('プロフィールプレビューが見つかりません');
      return;
    }
    
    // すでに挿入済みのタグコンテナをチェック
    let tagContainer = profilePreview.querySelector('.vertical-tag-container');
    
    if (!tagContainer) {
      // コンテナがなければ新規作成
      tagContainer = document.createElement('div');
      tagContainer.className = 'vertical-tag-container';
      
      // タイトル部分
      const titleElement = document.createElement('div');
      titleElement.className = 'vertical-tag-title';
      titleElement.innerHTML = '<i class="bi bi-tags"></i>専門分野・キーワード';
      tagContainer.appendChild(titleElement);
      
      // タグリスト
      const tagList = document.createElement('div');
      tagList.className = 'vertical-tag-list';
      tagContainer.appendChild(tagList);
      
      // プロフィールプレビューの適切な位置に挿入
      const targetLocation = findInsertionPoint(profilePreview);
      
      if (targetLocation.parent && targetLocation.reference) {
        targetLocation.parent.insertBefore(tagContainer, targetLocation.reference);
      } else if (targetLocation.parent) {
        targetLocation.parent.appendChild(tagContainer);
      }
    }
    
    // 選択されたタグでタグリストを更新
    updateTagListContent(tagContainer);
  }
  
  // プロフィールプレビュー要素を探す
  function findProfilePreviewElement() {
    // ID付きの要素を探す（最も確実な方法）
    const profileImage = document.getElementById('main-profile-preview');
    if (profileImage) {
      // 画像の親カード要素を探す
      return findParentCard(profileImage);
    }
    
    // 代替手段：右側カラムを探す
    const rightColumns = document.querySelectorAll('.col-md-4, .col-lg-4, .col-xl-4');
    if (rightColumns.length > 0) {
      // 最後のカラムを使用（通常プレビューはそこにある）
      const targetColumn = rightColumns[rightColumns.length - 1];
      
      // カラム内のカードを探す
      const cards = targetColumn.querySelectorAll('.card');
      if (cards.length > 0) {
        // 最初のカードを使用
        return cards[0];
      }
      
      // カードがなければカラム自体を返す
      return targetColumn;
    }
    
    return null;
  }
  
  // 親カードを探す
  function findParentCard(element) {
    if (!element) return null;
    
    if (element.classList && element.classList.contains('card')) {
      return element;
    }
    
    if (element.parentElement) {
      return findParentCard(element.parentElement);
    }
    
    return null;
  }
  
  // タグを挿入する場所を特定
  function findInsertionPoint(container) {
    // カードボディを探す
    const cardBody = container.querySelector('.card-body') || container;
    
    // 料金要素の前に挿入
    const priceElement = cardBody.querySelector('[class*="price"], [class*="fee"]');
    if (priceElement) {
      return {
        parent: priceElement.parentNode,
        reference: priceElement
      };
    }
    
    // 最初の段落の後に挿入
    const paragraphs = cardBody.querySelectorAll('p');
    if (paragraphs.length > 0) {
      return {
        parent: paragraphs[0].parentNode,
        reference: paragraphs[0].nextSibling
      };
    }
    
    // 何もなければカードボディの先頭に挿入
    return {
      parent: cardBody,
      reference: cardBody.firstChild
    };
  }
  
  // タグリストの内容を更新
  function updateTagListContent(container) {
    // 選択されたタグを取得
    const tags = getSelectedTags();
    
    // タグリスト要素を取得
    const tagList = container.querySelector('.vertical-tag-list');
    if (!tagList) return;
    
    // 内容をクリア
    tagList.innerHTML = '';
    
    // タグがなければ空メッセージを表示
    if (tags.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'vertical-tag-empty';
      emptyMessage.textContent = '専門分野・キーワードが選択されていません';
      tagList.appendChild(emptyMessage);
      return;
    }
    
    // 各タグを追加
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = `vertical-tag tag-${tag.category}`;
      
      // アイコン
      const iconName = CATEGORY_ICONS[tag.category] || CATEGORY_ICONS.general;
      const iconElement = document.createElement('span');
      iconElement.className = 'vertical-tag-icon';
      iconElement.innerHTML = `<i class="bi bi-${iconName}"></i>`;
      
      // タグ本文
      const textElement = document.createElement('span');
      textElement.className = 'vertical-tag-text';
      textElement.textContent = tag.label;
      
      tagElement.appendChild(iconElement);
      tagElement.appendChild(textElement);
      tagList.appendChild(tagElement);
    });
  }
  
  // 縦型タグリストの更新
  function updateVerticalTagList() {
    const profilePreview = findProfilePreviewElement();
    if (!profilePreview) return;
    
    const tagContainer = profilePreview.querySelector('.vertical-tag-container');
    if (tagContainer) {
      updateTagListContent(tagContainer);
    } else {
      injectVerticalTagList();
    }
  }
  
  // タグ選択変更の監視
  function setupTagSelectionListeners() {
    // クリックイベント（タグの追加・削除）
    document.addEventListener('click', function(e) {
      if (
        e.target.closest('.interests-preset-chip') || 
        e.target.closest('.selected-tag-preview') ||
        e.target.closest('.custom-chip-remove') ||
        e.target.closest('#add-custom-tag-btn')
      ) {
        setTimeout(updateVerticalTagList, 300);
      }
    });
    
    // タグ入力フィールドのEnterキー押下
    const tagInput = document.getElementById('new-custom-tag');
    if (tagInput) {
      tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateVerticalTagList, 300);
        }
      });
    }
  }
  
  // 選択されたタグを取得
  function getSelectedTags() {
    const tags = [];
    
    // UIの選択済みタグコンテナから取得
    const selectedContainer = document.getElementById('selected-tags-preview');
    if (selectedContainer) {
      const selectedTags = selectedContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
      
      selectedTags.forEach(tag => {
        const value = tag.dataset.value || '';
        const label = tag.querySelector('.selected-tag-text')?.textContent || '';
        
        if (label) {
          // カテゴリを特定
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
    
    // 従来のチェックボックスからも取得（フォールバック）
    if (tags.length === 0) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
      
      checkboxes.forEach(checkbox => {
        const value = checkbox.id.replace('interest-', '');
        const label = checkbox.nextElementSibling?.textContent.trim() || value;
        
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