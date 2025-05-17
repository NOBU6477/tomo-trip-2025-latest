/**
 * よりシンプルで明瞭なタグデザイン
 * 専門分野・興味タグを確実に表示
 */
(function() {
  // デバッグログ出力
  console.log('クリーンタグデザインを初期化中...');
  
  // スタイルの追加
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* タグコンテナ */
    .clean-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }
    
    /* タグ共通スタイル */
    .clean-tag {
      font-size: 13px;
      padding: 5px 12px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      display: inline-flex;
      align-items: center;
      margin-bottom: 0;
    }

    /* タグアイコン */
    .clean-tag i {
      margin-right: 6px;
      font-size: 14px;
    }

    /* カテゴリー別の色 */
    .clean-tag.tag-activity {
      background: #2e7d32;
    }
    
    .clean-tag.tag-night {
      background: #3f51b5; 
    }
    
    .clean-tag.tag-food, .clean-tag.tag-cooking {
      background: #e65100;
    }
    
    .clean-tag.tag-photo {
      background: #00838f;
    }
    
    .clean-tag.tag-custom {
      background: #ff9800;
    }
    
    .clean-tag.tag-general {
      background: #5f6368;
    }
  `;
  document.head.appendChild(styleEl);
  
  // カテゴリーごとのアイコン
  const CATEGORY_ICONS = {
    activity: 'bicycle',
    night: 'moon-stars-fill',
    food: 'cup-hot-fill',
    cooking: 'egg-fried',
    photo: 'camera-fill',
    custom: 'bookmark-fill',
    general: 'tag-fill'
  };
  
  // DOM完全読み込み後に実行
  window.addEventListener('load', function() {
    // 遅延実行（他のスクリプトの後）
    setTimeout(function() {
      console.log('プロフィールプレビューにタグを追加します...');
      initializeCleanTags();
    }, 1000);
  });
  
  // タグ機能の初期化
  function initializeCleanTags() {
    // プロフィールプレビューを直接ターゲット
    injectTagsToPreview();
    
    // ユーザーのタグ選択を監視
    monitorTagChanges();
    
    // 定期的に更新
    setInterval(injectTagsToPreview, 2000);
  }
  
  // プレビューにタグを挿入
  function injectTagsToPreview() {
    // 選択されたタグを取得
    const selectedTags = getSelectedTags();
    
    if (!selectedTags || selectedTags.length === 0) {
      console.log('表示するタグがありません');
      return;
    }
    
    console.log(`${selectedTags.length}個のタグを表示します`);
    
    // タグの挿入位置をピンポイントで特定する
    // 画像のDOM位置から確認して表示
    const profileImage = document.getElementById('main-profile-preview');
    
    // その他のターゲット要素を探す
    if (profileImage) {
      // 画像の親要素を取得（通常はプロフィールカード）
      const profileCard = findParentCard(profileImage);
      
      if (profileCard) {
        console.log('プロフィール画像から親カードを特定しました');
        insertCleanTags(profileCard, selectedTags);
      } else {
        // 代替手段：画像の兄弟要素にタグを追加
        console.log('画像の兄弟要素にタグを追加します');
        const container = profileImage.parentElement;
        if (container) {
          insertTagsNearImage(container, selectedTags);
        }
      }
    } else {
      // プロフィール画像が見つからない場合は右カラムを探す
      console.log('プロフィール画像が見つからないため右カラムを探します');
      findRightColumnAndInsertTags(selectedTags);
    }
  }
  
  // 親カードを探す（再帰的に）
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
  
  // 画像の近くにタグを挿入
  function insertTagsNearImage(container, tags) {
    // すでにタグコンテナがあるか確認
    let tagContainer = container.querySelector('.clean-tags');
    
    if (!tagContainer) {
      tagContainer = document.createElement('div');
      tagContainer.className = 'clean-tags';
      
      // コンテナに追加（画像の後に）
      if (container.lastChild) {
        container.appendChild(tagContainer);
      } else {
        container.appendChild(tagContainer);
      }
    }
    
    // 内容をクリア
    tagContainer.innerHTML = '';
    
    // タグを追加
    addTagsToContainer(tagContainer, tags);
  }
  
  // カードにタグを挿入
  function insertCleanTags(card, tags) {
    // カードボディを探す
    const cardBody = card.querySelector('.card-body') || card;
    
    // すでにタグコンテナがあるか確認
    let tagContainer = cardBody.querySelector('.clean-tags');
    
    if (!tagContainer) {
      tagContainer = document.createElement('div');
      tagContainer.className = 'clean-tags';
      
      // 料金表示があればその前に挿入
      const priceElement = cardBody.querySelector('[class*="price"], [class*="fee"]');
      
      if (priceElement) {
        priceElement.parentNode.insertBefore(tagContainer, priceElement);
      } else {
        // テキスト要素の後に挿入
        const textElements = cardBody.querySelectorAll('p');
        
        if (textElements.length > 0) {
          const firstText = textElements[0];
          
          if (firstText.nextSibling) {
            firstText.parentNode.insertBefore(tagContainer, firstText.nextSibling);
          } else {
            firstText.parentNode.appendChild(tagContainer);
          }
        } else {
          // 何もなければ先頭に挿入
          if (cardBody.firstChild) {
            cardBody.insertBefore(tagContainer, cardBody.firstChild);
          } else {
            cardBody.appendChild(tagContainer);
          }
        }
      }
    }
    
    // 内容をクリア
    tagContainer.innerHTML = '';
    
    // タグを追加
    addTagsToContainer(tagContainer, tags);
  }
  
  // 右カラムを探してタグを挿入
  function findRightColumnAndInsertTags(tags) {
    // 右側のカラムを探す
    const columns = document.querySelectorAll('.col-md-4, .col-lg-4, .col-sm-4');
    
    if (columns.length === 0) {
      console.log('適切なカラムが見つかりません');
      return;
    }
    
    // 最後のカラムがプレビューである可能性が高い
    const targetColumn = columns[columns.length - 1];
    
    // カードを探す
    const cards = targetColumn.querySelectorAll('.card');
    
    if (cards.length > 0) {
      // 最初のカードにタグを挿入
      insertCleanTags(cards[0], tags);
    } else {
      // カードがなければカラム自体にタグを挿入
      let tagContainer = targetColumn.querySelector('.clean-tags');
      
      if (!tagContainer) {
        tagContainer = document.createElement('div');
        tagContainer.className = 'clean-tags';
        
        // カラムの先頭に挿入
        if (targetColumn.firstChild) {
          targetColumn.insertBefore(tagContainer, targetColumn.firstChild);
        } else {
          targetColumn.appendChild(tagContainer);
        }
      }
      
      // 内容をクリア
      tagContainer.innerHTML = '';
      
      // タグを追加
      addTagsToContainer(tagContainer, tags);
    }
  }
  
  // タグコンテナにタグを追加
  function addTagsToContainer(container, tags) {
    tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = `clean-tag tag-${tag.category}`;
      
      // アイコンを追加
      const icon = CATEGORY_ICONS[tag.category] || CATEGORY_ICONS.general;
      tagElement.innerHTML = `<i class="bi bi-${icon}"></i>${tag.label}`;
      
      container.appendChild(tagElement);
    });
  }
  
  // タグ選択の変更を監視
  function monitorTagChanges() {
    // クリックイベントを監視（タグの追加・削除時）
    document.addEventListener('click', function(e) {
      if (
        e.target.closest('.interests-preset-chip') || 
        e.target.closest('.selected-tag-preview') ||
        e.target.closest('.custom-chip-remove') ||
        e.target.closest('#add-custom-tag-btn')
      ) {
        setTimeout(injectTagsToPreview, 300);
      }
    });
    
    // カスタムタグの入力を監視
    const tagInput = document.getElementById('new-custom-tag');
    if (tagInput) {
      tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(injectTagsToPreview, 300);
        }
      });
    }
  }
  
  // 選択されたタグを取得する
  function getSelectedTags() {
    const tags = [];
    
    // モダンUIの選択済みタグコンテナから取得
    const selectedContainer = document.getElementById('selected-tags-preview');
    if (selectedContainer) {
      const selectedTags = selectedContainer.querySelectorAll('.selected-tag-preview:not(.removing)');
      
      selectedTags.forEach(tag => {
        const value = tag.dataset.value || '';
        const label = tag.querySelector('.selected-tag-text')?.textContent || '';
        
        if (label) {
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
    
    // 従来のチェックボックスからも取得（モダンUIが機能していない場合のフォールバック）
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