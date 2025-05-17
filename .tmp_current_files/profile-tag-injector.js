/**
 * プロフィールプレビューにタグを強制的に挿入するスクリプト
 * 他の方法が失敗した場合の最終手段として使用
 */
(function() {
  // ページ読み込み完了時に初期化
  window.addEventListener('DOMContentLoaded', function() {
    console.log('プロフィールタグ直接挿入を初期化しています...');
    
    // タグのスタイルを追加
    injectTagStyles();
    
    // 初期処理はDOMが完全にロードされた後に実行
    setTimeout(initTagInjector, 500);
    
    // 定期的に更新（DOM変更に対応）
    setInterval(injectTagsToPreview, 1500);
  });
  
  // 初期化処理
  function initTagInjector() {
    console.log('タグ挿入処理を初期化');
    
    // プレビューにイベントリスナーを設定
    const profileForm = document.getElementById('profile-basic-form');
    if (profileForm) {
      profileForm.addEventListener('change', function() {
        setTimeout(injectTagsToPreview, 300);
      });
    }
    
    // 選択されたタグの変更を監視
    setupTagSelectionListener();
    
    // 最初の挿入を実行
    injectTagsToPreview();
  }
  
  // タグの選択変更を監視
  function setupTagSelectionListener() {
    // 選択タグコンテナを監視
    const selectedTagsContainer = document.getElementById('selected-tags-preview');
    if (selectedTagsContainer) {
      // 変更を監視するMutationObserver
      const observer = new MutationObserver(function() {
        setTimeout(injectTagsToPreview, 300);
      });
      
      observer.observe(selectedTagsContainer, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
    
    // 各タグチェックボックスにもリスナーを追加
    const tagCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]');
    tagCheckboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        setTimeout(injectTagsToPreview, 300);
      });
    });
    
    // プリセットタグにクリックイベントを追加
    const presetContainer = document.getElementById('preset-tags');
    if (presetContainer) {
      presetContainer.addEventListener('click', function() {
        setTimeout(injectTagsToPreview, 300);
      });
    }
  }
  
  // プロフィールプレビューにタグを注入
  function injectTagsToPreview() {
    console.log('プロフィールプレビューにタグを挿入中...');
    
    // 選択されたタグを取得
    const tags = getSelectedTags();
    if (!tags || tags.length === 0) {
      console.log('選択されたタグがありません');
      return;
    }
    
    console.log(`挿入するタグ: ${tags.length}個`);
    
    // 青いヘッダーを探す - これが最も確実なプレビューカードの特定方法
    const blueHeaderElements = Array.from(document.querySelectorAll('.card-header, div[class*="bg-"], div[style*="background"]'));
    
    // 青い背景を持つ要素をフィルタリング
    const blueHeaders = blueHeaderElements.filter(el => {
      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;
      return (
        bgColor.includes('rgb(0, 123, 255)') || 
        bgColor.includes('rgb(13, 110, 253)') ||
        bgColor.includes('rgb(0, 0, 255)')
      );
    });
    
    let tagsInserted = false;
    
    if (blueHeaders.length > 0) {
      console.log(`青いヘッダーを ${blueHeaders.length}個 検出しました`);
      
      // 青いヘッダーごとに処理
      blueHeaders.forEach(header => {
        if (header.textContent && header.textContent.includes('プロフィール')) {
          // プロフィールプレビューの親要素を見つける
          const previewCard = header.closest('.card') || header.parentElement;
          
          if (previewCard) {
            console.log('プロフィールプレビューカードを発見');
            
            // カード内のコンテンツ部分を探す
            const cardBody = previewCard.querySelector('.card-body') || previewCard;
            
            // タグコンテナを追加またはアップデート
            createOrUpdateTagContainer(cardBody, tags);
            tagsInserted = true;
          }
        }
      });
    }
    
    // 青いヘッダーが見つからなかった場合は別の方法で探す
    if (!tagsInserted) {
      // 右カラムを探す
      const rightColumns = document.querySelectorAll('.col-md-4, .col-lg-4, .col-xl-4');
      
      rightColumns.forEach(column => {
        // プロフィールプレビューっぽい要素があるか確認
        const headings = column.querySelectorAll('h5, h4, .card-header, div');
        
        for (const heading of headings) {
          if (heading.textContent && heading.textContent.includes('プロフィール')) {
            // カードまたはプレビュー領域を見つける
            const card = heading.closest('.card') || heading.parentElement;
            
            if (card) {
              const cardBody = card.querySelector('.card-body') || card;
              createOrUpdateTagContainer(cardBody, tags);
              tagsInserted = true;
              break;
            }
          }
        }
      });
    }
    
    // それでも見つからなかった場合はカードをすべて調べる
    if (!tagsInserted) {
      const allCards = document.querySelectorAll('.card');
      
      allCards.forEach(card => {
        // プレビューっぽいカードか確認
        if (card.querySelector('[class*="price"], [class*="fee"]')) {
          const cardBody = card.querySelector('.card-body') || card;
          createOrUpdateTagContainer(cardBody, tags);
        }
      });
    }
  }
  
  // タグコンテナを作成するか更新する
  function createOrUpdateTagContainer(parent, tags) {
    if (!parent || !tags || tags.length === 0) return;
    
    // すでにタグコンテナがあるか確認
    let tagContainer = parent.querySelector('.profile-preview-tags');
    
    // なければ新しく作成
    if (!tagContainer) {
      tagContainer = document.createElement('div');
      tagContainer.className = 'profile-preview-tags';
      
      // スタイルを直接適用
      tagContainer.style.display = 'flex';
      tagContainer.style.flexWrap = 'wrap';
      tagContainer.style.gap = '4px';
      tagContainer.style.margin = '8px 0';
      
      // 料金情報の前に挿入
      const priceElement = parent.querySelector('[class*="price"], [class*="fee"], .price-badge');
      
      if (priceElement) {
        parent.insertBefore(tagContainer, priceElement);
      } else {
        // 適切な位置を探す
        const cardTexts = parent.querySelectorAll('p, div:not(.card-header)');
        
        if (cardTexts.length > 0) {
          // 最初のテキストの後に挿入
          if (cardTexts[0].nextSibling) {
            parent.insertBefore(tagContainer, cardTexts[0].nextSibling);
          } else {
            parent.appendChild(tagContainer);
          }
        } else {
          // 何もなければ最後に追加
          parent.appendChild(tagContainer);
        }
      }
    }
    
    // タグコンテナの内容をクリア
    tagContainer.innerHTML = '';
    
    // タグを追加
    tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = `profile-tag tag-${tag.category}`;
      tagElement.textContent = tag.label;
      
      // インラインスタイルも直接適用（確実性のため）
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
  
  // タグスタイルを挿入
  function injectTagStyles() {
    if (document.getElementById('profile-tag-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'profile-tag-styles';
    styleElement.textContent = `
      .profile-preview-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin: 8px 0;
      }
      
      .profile-tag {
        display: inline-block;
        background-color: #007bff;
        color: white;
        font-size: 11px;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 12px;
        margin-right: 4px;
        margin-bottom: 4px;
      }
      
      .profile-tag.tag-night { background-color: #3f51b5; }
      .profile-tag.tag-food { background-color: #e65100; }
      .profile-tag.tag-photo { background-color: #00838f; }
      .profile-tag.tag-cooking { background-color: #e65100; }
      .profile-tag.tag-activity { background-color: #558b2f; }
      .profile-tag.tag-custom { background-color: #ff9800; }
      .profile-tag.tag-general { background-color: #6c757d; }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  // 選択されたタグの情報を取得
  function getSelectedTags() {
    const tags = [];
    
    // 新UIの選択済みタグコンテナから取得
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
    
    // 従来のチェックボックスからも取得（UIで選択されていない場合）
    if (tags.length === 0) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
      
      checkboxes.forEach(checkbox => {
        const value = checkbox.value;
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
  
  // カテゴリ別の色を取得
  function getCategoryColor(category) {
    const colors = {
      'night': '#3f51b5',
      'food': '#e65100',
      'photo': '#00838f',
      'cooking': '#e65100',
      'activity': '#558b2f',
      'custom': '#ff9800',
      'general': '#6c757d'
    };
    
    return colors[category] || '#007bff';
  }
})();