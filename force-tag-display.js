/**
 * 青いバッジ削除と共に専門分野・キーワードを強制表示するスクリプト
 * 最も優先度の高い処理として動作します
 */

(function() {
  // すぐに実行
  console.log('強制タグ表示スクリプトを初期化しています...');
  injectKeywordDisplay();
  
  // 短い間隔で繰り返し実行して確実に適用
  setInterval(injectKeywordDisplay, 1000);
  
  // さらにDOMの変更も監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        // 新しいノードが追加されたら再適用
        setTimeout(injectKeywordDisplay, 100);
      }
    });
  });
  
  // documentのDOM変更を監視開始
  observer.observe(document.body, { childList: true, subtree: true });
  
  /**
   * 青バッジを削除し、専門分野キーワードを強制的に表示
   */
  function injectKeywordDisplay() {
    // 青いバッジをすべて削除（緊急処置）
    const badges = document.querySelectorAll('.badge, .badge-primary, .bg-primary, [class*="badge"]');
    badges.forEach(badge => {
      try {
        const style = window.getComputedStyle(badge);
        const bgColor = style.backgroundColor;
        // 青い背景色か確認
        if (bgColor.includes('rgb(0, 123, 255)') || 
            bgColor.includes('rgb(13, 110, 253)') ||
            badge.classList.contains('badge-primary') ||
            badge.classList.contains('bg-primary')) {
          badge.style.display = 'none';
          badge.style.visibility = 'hidden';
        }
      } catch (e) {
        // エラー無視
      }
    });
    
    // カードを検索
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      // カード内にプレビューテキストが含まれているか確認
      if (card.textContent.includes('プレビュー') || 
          card.textContent.includes('Preview') ||
          card.textContent.includes('プロフィール') ||
          card.textContent.includes('Profile')) {
        
        // 青いバッジをこのカード内から完全に削除
        const cardBadges = card.querySelectorAll('.badge, .badge-primary, [class*="badge"]');
        cardBadges.forEach(badge => {
          badge.style.display = 'none';
          badge.style.visibility = 'hidden';
        });
        
        // すでに強制タグセクションがあるか確認
        if (!card.querySelector('.forced-tags-section')) {
          injectTagsIntoCard(card);
        }
      }
    });
  }
  
  /**
   * カードにキーワードタグセクションを強制挿入
   */
  function injectTagsIntoCard(card) {
    const keywords = getAvailableKeywords();
    
    if (keywords.length === 0) return;
    
    // タグ用セクションを作成
    const tagsSection = document.createElement('div');
    tagsSection.className = 'forced-tags-section';
    tagsSection.style.cssText = `
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.1);
      width: 100%;
    `;
    
    // タイトル部分
    const titleDiv = document.createElement('div');
    titleDiv.className = 'forced-tags-title';
    titleDiv.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #555;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    `;
    titleDiv.innerHTML = '<i class="bi bi-tags-fill" style="margin-right: 5px; color: #3a87ad;"></i> 専門分野・キーワード';
    tagsSection.appendChild(titleDiv);
    
    // タグを表示する部分
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'forced-tags-container';
    tagsContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    `;
    
    // 各キーワードをタグとして追加
    keywords.forEach(keyword => {
      const tag = document.createElement('div');
      tag.className = 'forced-tag';
      tag.style.cssText = `
        display: inline-flex;
        align-items: center;
        background-color: #f8f9fa;
        color: #495057;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 16px;
        margin-right: 4px;
        margin-bottom: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.05);
      `;
      
      // キーワードに応じた色とアイコンを設定
      let iconClass = 'tag-fill';
      let bgColor = '#f8f9fa';
      let textColor = '#495057';
      
      if (keyword.includes('ツアー') || keyword.includes('観光')) {
        iconClass = 'globe';
        bgColor = '#e3f2fd';
        textColor = '#0d47a1';
      } else if (keyword.includes('食') || keyword.includes('グルメ') || keyword.includes('料理')) {
        iconClass = 'cup-hot';
        bgColor = '#e8f5e9';
        textColor = '#1b5e20';
      } else if (keyword.includes('写真') || keyword.includes('カメラ')) {
        iconClass = 'camera';
        bgColor = '#e0f7fa';
        textColor = '#006064';
      } else if (keyword.includes('アート') || keyword.includes('文化')) {
        iconClass = 'palette';
        bgColor = '#fff3e0';
        textColor = '#e65100';
      }
      
      tag.style.backgroundColor = bgColor;
      tag.style.color = textColor;
      
      tag.innerHTML = `
        <i class="bi bi-${iconClass}" style="margin-right: 5px; font-size: 12px;"></i>
        <span>${keyword}</span>
      `;
      
      tagsContainer.appendChild(tag);
    });
    
    tagsSection.appendChild(tagsContainer);
    
    // カードの適切な位置に挿入
    // 料金表示の後に挿入するのが理想的
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      // 料金表示を探す
      const feeElement = cardBody.querySelector('[class*="fee"], [id*="fee"]');
      if (feeElement) {
        // 料金表示の後に挿入
        if (feeElement.nextSibling) {
          cardBody.insertBefore(tagsSection, feeElement.nextSibling);
        } else {
          cardBody.appendChild(tagsSection);
        }
      } else {
        // 料金表示がなければカードの最後に追加
        cardBody.appendChild(tagsSection);
      }
    } else {
      // カードボディがなければカード自体に追加
      card.appendChild(tagsSection);
    }
  }
  
  /**
   * 利用可能なキーワードを収集
   */
  function getAvailableKeywords() {
    let keywords = [];
    
    // 方法1: ページ内の選択されたタグを探す
    try {
      // チェックボックスから
      const checkedBoxes = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
      checkedBoxes.forEach(cb => {
        const label = cb.nextElementSibling?.textContent?.trim();
        if (label) keywords.push(label);
      });
      
      // 選択済みタグから
      const selectedTags = document.querySelectorAll('.selected-tag');
      selectedTags.forEach(tag => {
        const text = tag.textContent?.trim();
        if (text) keywords.push(text);
      });
    } catch (e) {
      // エラー無視
    }
    
    // 方法2: グローバル変数から
    if (window.selectedTags && window.selectedTags.length > 0) {
      keywords = keywords.concat(window.selectedTags);
    }
    
    // 方法3: 決め打ちの一般的なタグ（他の方法で見つからない場合）
    if (keywords.length === 0) {
      keywords = ["観光", "食べ歩き", "アート", "ナイトツアー", "グルメ", "写真スポット"];
    }
    
    // 重複を削除
    return [...new Set(keywords)];
  }
})();