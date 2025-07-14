/**
 * モダンなタグデザインの実装
 * プロフィールプレビューにスタイリッシュなタグを表示
 */
(function() {
  console.log('モダンタグデザインを初期化中...');
  
  // スタイルシートを追加
  const styleEl = document.createElement('style');
  styleEl.id = 'modern-tag-styles';
  styleEl.textContent = `
    /* モダンなタグのコンテナスタイル */
    .modern-tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 12px 0;
      padding: 3px 0;
    }
    
    /* タグの基本スタイル */
    .modern-tag {
      display: inline-flex;
      align-items: center;
      height: 26px;
      padding: 0 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      color: white;
      background-color: #4a6da7;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      margin-bottom: 6px;
      transition: all 0.2s ease;
      position: relative;
      overflow: visible;
    }
    
    /* タグのホバー効果 */
    .modern-tag:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    /* タグにアイコンを追加 */
    .modern-tag:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: rgba(255,255,255,0.3);
    }
    
    /* カテゴリ別のスタイル */
    .modern-tag.tag-night {
      background-color: #3f51b5;
    }
    
    .modern-tag.tag-food {
      background-color: #e65100;
    }
    
    .modern-tag.tag-photo {
      background-color: #00838f;
    }
    
    .modern-tag.tag-cooking {
      background-color: #d84315;
    }
    
    .modern-tag.tag-activity {
      background-color: #2e7d32;
    }
    
    .modern-tag.tag-custom {
      background-color: #ff8f00;
    }
    
    .modern-tag.tag-general {
      background-color: #5f6368;
    }
    
    /* モバイルでのスタイル調整 */
    @media (max-width: 768px) {
      .modern-tag {
        height: 24px;
        font-size: 11px;
        padding: 0 10px;
      }
      
      .modern-tag-container {
        gap: 4px;
      }
    }
  `;
  document.head.appendChild(styleEl);
  
  // タグを表示するための処理
  function initModernTagDesign() {
    // ページ読み込み後に少し待ってから実行
    setTimeout(findAndUpdateTags, 800);
    
    // タグの選択変更を監視
    setupTagChangeListeners();
    
    // 定期的な更新
    setInterval(findAndUpdateTags, 2000);
  }
  
  // タグ選択変更の監視
  function setupTagChangeListeners() {
    // クリックイベントを監視（タグの追加・削除時）
    document.addEventListener('click', function(e) {
      if (
        e.target.closest('.interests-preset-chip') || 
        e.target.closest('.selected-tag-preview') ||
        e.target.closest('.custom-chip-remove') ||
        e.target.closest('#add-custom-tag-btn')
      ) {
        setTimeout(findAndUpdateTags, 300);
      }
    });
    
    // タグ入力フィールドのEnterキー押下を監視
    const tagInput = document.getElementById('new-custom-tag');
    if (tagInput) {
      tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(findAndUpdateTags, 300);
        }
      });
    }
  }
  
  // タグを検索して更新
  function findAndUpdateTags() {
    // 選択されたタグを取得
    const tags = getSelectedTags();
    
    if (tags.length === 0) {
      console.log('選択されたタグはありません');
      return;
    }
    
    console.log(`モダンUIに表示するタグ: ${tags.length}個`);
    
    // プロフィールプレビューを探す
    const previewCard = findProfilePreviewCard();
    
    if (previewCard) {
      updateTagsInCard(previewCard, tags);
    } else {
      console.log('プロフィールプレビューカードが見つかりません');
    }
  }
  
  // プロフィールプレビューカードを見つける
  function findProfilePreviewCard() {
    // 右側カラムにあるカードを探す
    const rightColumns = document.querySelectorAll('.col-md-4, .col-lg-4, .col-xl-4');
    
    if (rightColumns.length === 0) return null;
    
    // 最も可能性の高い最後の右カラムから探す
    const targetCol = rightColumns[rightColumns.length - 1];
    
    // カードを検索
    const cards = targetCol.querySelectorAll('.card');
    
    if (cards.length === 0) return null;
    
    // プロフィールプレビューと思われるカードを探す
    
    // 1. まず「プロフィール」という文字を含むヘッダーを持つカードを探す
    for (const card of cards) {
      const headers = card.querySelectorAll('.card-header, h5, h4, h3');
      
      for (const header of headers) {
        if (header.textContent && header.textContent.includes('プロフィール')) {
          return card;
        }
      }
    }
    
    // 2. 青いヘッダーを持つカードを探す
    for (const card of cards) {
      const headers = card.querySelectorAll('.card-header, [style*="background"], [class*="bg-"]');
      
      for (const header of headers) {
        const style = window.getComputedStyle(header);
        const bgcolor = style.backgroundColor;
        
        if (
          bgcolor.includes('rgb(0, 123, 255)') || 
          bgcolor.includes('rgb(13, 110, 253)') ||
          bgcolor.includes('blue')
        ) {
          return card;
        }
      }
    }
    
    // 3. 料金表示があるカードを探す
    for (const card of cards) {
      if (card.querySelector('[class*="price"], [class*="fee"]')) {
        return card;
      }
    }
    
    // 4. 最後の手段：最初のカードを返す
    return cards[0];
  }
  
  // カード内のタグを更新
  function updateTagsInCard(card, tags) {
    // カードボディを取得
    const cardBody = card.querySelector('.card-body') || card;
    
    // すでにあるモダンタグコンテナを検索
    let tagContainer = cardBody.querySelector('.modern-tag-container');
    
    // なければ新しく作成
    if (!tagContainer) {
      tagContainer = document.createElement('div');
      tagContainer.className = 'modern-tag-container';
      
      // 適切な位置に挿入
      const priceElement = cardBody.querySelector('[class*="price"], [class*="fee"]');
      
      if (priceElement) {
        // 料金表示の前に挿入
        priceElement.parentNode.insertBefore(tagContainer, priceElement);
      } else {
        // 最初の段落の後に挿入
        const paragraphs = cardBody.querySelectorAll('p');
        
        if (paragraphs.length > 0) {
          const targetParagraph = paragraphs[0];
          
          if (targetParagraph.nextSibling) {
            targetParagraph.parentNode.insertBefore(tagContainer, targetParagraph.nextSibling);
          } else {
            targetParagraph.parentNode.appendChild(tagContainer);
          }
        } else {
          // カードボディの先頭に挿入
          if (cardBody.firstChild) {
            cardBody.insertBefore(tagContainer, cardBody.firstChild);
          } else {
            cardBody.appendChild(tagContainer);
          }
        }
      }
    }
    
    // タグコンテナの内容をクリア
    tagContainer.innerHTML = '';
    
    // タグを追加
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = `modern-tag tag-${tag.category}`;
      tagElement.textContent = tag.label;
      tagContainer.appendChild(tagElement);
    });
    
    console.log('モダンタグの表示を更新しました');
  }
  
  // 選択されたタグを取得
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
    
    // 従来のチェックボックスからも取得（UIで選択されていない場合のフォールバック）
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
  
  // ページロード時に実行
  window.addEventListener('DOMContentLoaded', function() {
    console.log('モダンタグデザインが初期化されました');
    
    // 少し遅延して実行（他のスクリプトの後）
    setTimeout(initModernTagDesign, 500);
  });
})();