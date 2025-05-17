/**
 * プロフィールプレビューに専門分野タグを表示する最終解決策
 * 完全に要素を特定し、プレビュー内に埋め込む方法
 */
(function() {
  console.log('プロフィールタグ最終ソリューションを実行します');
  
  // スタイルシート追加
  const styleSheet = document.createElement('style');
  styleSheet.id = 'profile-tag-solution-styles';
  styleSheet.textContent = `
    /* サイドバッジタグ */
    .side-badge-tags {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    /* 個別バッジ */
    .side-badge {
      display: flex;
      align-items: center;
      background: #007bff;
      color: white;
      font-size: 10px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    
    /* カテゴリ別の色 */
    .side-badge.tag-night { background: #3f51b5; }
    .side-badge.tag-photo { background: #00838f; }
    .side-badge.tag-activity { background: #2e7d32; }
    .side-badge.tag-food, .side-badge.tag-cooking { background: #e65100; }
    .side-badge.tag-custom { background: #ff9800; }
  `;
  document.head.appendChild(styleSheet);
  
  // ページロード完了後に実行
  window.addEventListener('load', function() {
    setTimeout(function() {
      initializeSolution();
      
      // タグの変更を監視
      listenForTagChanges();
      
      // 念のため定期的に更新
      setInterval(updateProfileTags, 2000);
    }, 1000);
  });
  
  // 初期化
  function initializeSolution() {
    updateProfileTags();
  }
  
  // タグの変更を監視
  function listenForTagChanges() {
    document.addEventListener('click', function(e) {
      if (
        e.target.closest('.interests-preset-chip') || 
        e.target.closest('.selected-tag-preview') ||
        e.target.closest('.custom-chip-remove') ||
        e.target.closest('#add-custom-tag-btn')
      ) {
        setTimeout(updateProfileTags, 300);
      }
    });
    
    // タグ入力
    const tagInput = document.getElementById('new-custom-tag');
    if (tagInput) {
      tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateProfileTags, 300);
        }
      });
    }
  }
  
  // プロフィールタグの更新
  function updateProfileTags() {
    const tags = getSelectedTags();
    
    if (tags.length > 0) {
      // プロフィールプレビュー領域を探す - 複数の方法で特定
      const previewAreas = findAllPossiblePreviewAreas();
      
      if (previewAreas.length > 0) {
        // 各エリアにタグを適用
        previewAreas.forEach(area => {
          applyTagsToPreviewArea(area, tags);
        });
        console.log(`${previewAreas.length}個のプレビューエリアにタグを適用しました`);
      } else {
        console.log('プレビューエリアが見つかりませんでした');
      }
    }
  }
  
  // プレビューエリアを特定する複数の方法
  function findAllPossiblePreviewAreas() {
    const areas = [];
    
    // 方法1: プロフィール画像から特定
    const profileImg = document.getElementById('main-profile-preview');
    if (profileImg) {
      // 画像の親要素またはその近くの要素
      const imgContainer = profileImg.parentElement;
      if (imgContainer) {
        areas.push(imgContainer);
      }
    }
    
    // 方法2: プロフィールプレビューヘッダーから特定
    const headers = document.querySelectorAll('.card-header');
    headers.forEach(header => {
      const text = header.textContent || '';
      if (text.includes('プロフィール') || text.includes('Profile')) {
        const parentCard = header.closest('.card');
        if (parentCard) {
          const imgContainer = parentCard.querySelector('.card-img-top')?.parentElement;
          if (imgContainer) {
            areas.push(imgContainer);
          } else {
            // カードボディも候補に
            const cardBody = parentCard.querySelector('.card-body');
            if (cardBody) {
              areas.push(cardBody);
            }
          }
        }
      }
    });
    
    // 方法3: 右カラムのカード内の画像
    const rightCols = document.querySelectorAll('.col-md-4, .col-lg-4');
    rightCols.forEach(col => {
      const cards = col.querySelectorAll('.card');
      cards.forEach(card => {
        const imgContainer = card.querySelector('.card-img-top, img')?.parentElement;
        if (imgContainer) {
          areas.push(imgContainer);
        }
      });
    });
    
    // 重複を除去
    return [...new Set(areas)];
  }
  
  // プレビューエリアにタグを適用
  function applyTagsToPreviewArea(area, tags) {
    // すでにあるタグを削除
    const existingTags = area.querySelector('.side-badge-tags');
    if (existingTags) {
      existingTags.remove();
    }
    
    // 新しいタグコンテナを作成
    const tagContainer = document.createElement('div');
    tagContainer.className = 'side-badge-tags';
    
    // タグを追加
    tags.forEach(tag => {
      const badge = document.createElement('div');
      badge.className = `side-badge tag-${tag.category}`;
      badge.textContent = tag.label;
      tagContainer.appendChild(badge);
    });
    
    // エリアに追加
    // エリアの相対位置を設定
    if (getComputedStyle(area).position === 'static') {
      area.style.position = 'relative';
    }
    
    area.appendChild(tagContainer);
  }
  
  // 選択されたタグを取得
  function getSelectedTags() {
    const tags = [];
    
    // UI上で選択されたタグを取得
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
    
    // 古いUIからのフォールバック
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