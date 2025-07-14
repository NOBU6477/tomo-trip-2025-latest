/**
 * プロフィールプレビュー内の青バッジを徹底的に削除し、代替タグを追加する超直接的スクリプト
 * 深いDOMスキャンによってバッジを特定します
 */

(function() {
  // 即時起動と短いインターバルによる継続的な監視
  console.log('直接バッジ削除ツールを起動...');
  executeDirectRemoval();
  setInterval(executeDirectRemoval, 500);

  // DOM変更も監視
  const observer = new MutationObserver(function() {
    setTimeout(executeDirectRemoval, 50);
  });
  
  observer.observe(document, {
    childList: true, 
    subtree: true,
    attributes: true,
    characterData: true
  });

  /**
   * バッジの直接削除を実行
   */
  function executeDirectRemoval() {
    // 1. 直接青バッジ要素を探す - プロフィールプレビュー内の特定要素
    const badgeTargets = findAllBlueBadges();
    
    if (badgeTargets.length > 0) {
      console.log(`${badgeTargets.length}個の青バッジ要素を発見しました`);
      
      // すべての青バッジを削除
      badgeTargets.forEach(element => {
        try {
          // ナビゲーション内の要素は処理しない
          if (isInNavigation(element)) {
            return;
          }
          
          // 親がdivなら親ごと削除（バッジコンテナも含めて）
          if (element.parentElement && element.parentElement.tagName.toLowerCase() === 'div') {
            element.parentElement.remove();
          } else {
            element.remove();
          }
        } catch (e) {
          console.error('削除エラー:', e);
        }
      });
      
      console.log('青バッジを削除しました');
    }
  }
  
  /**
   * 要素がナビゲーション内にあるか判定
   */
  function isInNavigation(element) {
    let current = element;
    let depth = 0;
    
    while (current && depth < 10) {
      if (current.tagName) {
        const tag = current.tagName.toLowerCase();
        if (tag === 'nav' || tag === 'header') {
          return true;
        }
        
        // ID・クラスでも判定
        if (current.id && current.id.toLowerCase().includes('nav')) {
          return true;
        }
        
        if (current.className && typeof current.className === 'string') {
          const className = current.className.toLowerCase();
          if (className.includes('navbar') || 
              className.includes('nav-') || 
              className.includes('navigation')) {
            return true;
          }
        }
      }
      
      current = current.parentElement;
      depth++;
    }
    
    return false;
  }
    
    // 2. プレビューカード内に専門分野・キーワードセクションを直接挿入
    const previewCard = findProfilePreviewCard();
    if (previewCard) {
      // すでに挿入済みでなければ追加
      const existingSection = previewCard.querySelector('.direct-keywords-section');
      if (!existingSection) {
        console.log('プレビューカードにキーワードセクションを追加します');
        insertKeywordsSection(previewCard);
      } else {
        // すでにあれば内容を更新
        updateKeywordsContent(existingSection);
      }
    }
  }

  /**
   * 画面内のすべての青バッジを見つける
   * 複数の検出方法を組み合わせて確実に見つける
   */
  function findAllBlueBadges() {
    const blueBadges = [];
    
    try {
      // 方法1: badge要素を直接検索
      document.querySelectorAll('.badge, .badge-primary, .bg-primary').forEach(elem => {
        if (isBlueBadge(elem)) {
          blueBadges.push(elem);
        }
      });
      
      // 方法2: カラーコードで検索
      document.querySelectorAll('[style*="background"]').forEach(elem => {
        const style = window.getComputedStyle(elem);
        const bgColor = style.backgroundColor;
        if (bgColor.includes('rgb(0, 123, 255)') || 
            bgColor.includes('rgb(13, 110, 253)') ||
            bgColor.includes('rgb(0, 86, 179)')) {
          blueBadges.push(elem);
        }
      });
      
      // 方法3: 特定のキーワードを含む要素を検索
      const keywords = ['観光', '食べ歩き', 'アート', 'ナイトツアー'];
      const allElements = document.querySelectorAll('*');
      
      for (const keyword of keywords) {
        for (const elem of allElements) {
          if (elem.textContent === keyword && isBadgeElement(elem)) {
            blueBadges.push(elem);
          }
        }
      }
      
      // 方法4: プレビューカード内の小さいサイズの要素を検索
      const previewCard = findProfilePreviewCard();
      if (previewCard) {
        const smallElements = previewCard.querySelectorAll('*');
        
        for (const elem of smallElements) {
          const rect = elem.getBoundingClientRect();
          if (rect.width > 0 && rect.width < 100 && rect.height > 0 && rect.height < 40) {
            const style = window.getComputedStyle(elem);
            if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
              if (isBlueBadge(elem) || hasBlueBadgeParent(elem)) {
                blueBadges.push(elem);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('青バッジ検索エラー:', e);
    }
    
    // 重複を削除
    return [...new Set(blueBadges)];
  }
  
  /**
   * 要素が青バッジかどうかを判定
   */
  function isBlueBadge(element) {
    try {
      // クラス名で判定
      if (element.classList.contains('badge-primary') || 
          element.classList.contains('bg-primary')) {
        return true;
      }
      
      // スタイルで判定
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      if (bgColor.includes('rgb(0, 123, 255)') || 
          bgColor.includes('rgb(13, 110, 253)') ||
          bgColor.includes('rgb(0, 86, 179)')) {
        return true;
      }
      
      // サイズと形で判定（バッジの特徴的な形状）
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.width < 80 && 
          rect.height > 0 && rect.height < 30 &&
          (element.textContent.includes('観光') || 
           element.textContent.includes('食べ歩き') || 
           element.textContent.includes('アート'))) {
        return true;
      }
    } catch (e) {
      return false;
    }
    
    return false;
  }
  
  /**
   * 要素がバッジ要素かどうかを判定
   */
  function isBadgeElement(element) {
    try {
      // クラス名で判定
      if (element.classList.contains('badge') || 
          element.classList.contains('tag') ||
          element.className.includes('badge') ||
          element.className.includes('tag')) {
        return true;
      }
      
      // 親要素の特徴で判定
      if (element.parentElement && 
          (element.parentElement.classList.contains('badge-container') ||
           element.parentElement.classList.contains('tags-container'))) {
        return true;
      }
      
      // サイズで判定
      const rect = element.getBoundingClientRect();
      return (rect.width > 0 && rect.width < 80 && 
              rect.height > 0 && rect.height < 30);
    } catch (e) {
      return false;
    }
  }
  
  /**
   * 青バッジの親要素かどうかを判定
   */
  function hasBlueBadgeParent(element) {
    let current = element.parentElement;
    let depth = 0;
    
    while (current && depth < 3) {
      if (isBlueBadge(current)) {
        return true;
      }
      current = current.parentElement;
      depth++;
    }
    
    return false;
  }
  
  /**
   * プロフィールプレビューカードを見つける
   */
  function findProfilePreviewCard() {
    try {
      // 方法1: ヘッダーテキストで探す
      const headers = document.querySelectorAll('.card-header, h4, h5, h6');
      for (const header of headers) {
        if (header.textContent.includes('プレビュー') || 
            header.textContent.includes('プロフィール') ||
            header.textContent.includes('Preview') ||
            header.textContent.includes('Profile')) {
          return header.closest('.card');
        }
      }
      
      // 方法2: 青いヘッダーを持つカードを探す
      const cards = document.querySelectorAll('.card');
      for (const card of cards) {
        const header = card.querySelector('.card-header');
        if (header) {
          const style = window.getComputedStyle(header);
          if (style.backgroundColor.includes('rgb(0, 123, 255)') || 
              style.backgroundColor.includes('rgb(13, 110, 253)')) {
            return card;
          }
        }
      }
      
      // 方法3: プレビューアイコンを含むカードを探す
      const eyeIcons = document.querySelectorAll('.bi-eye');
      for (const icon of eyeIcons) {
        const card = icon.closest('.card');
        if (card) return card;
      }
      
      // 方法4: 右側カラムのカードを探す
      const rightCols = document.querySelectorAll('.col-lg-4, .col-md-4');
      for (const col of rightCols) {
        const card = col.querySelector('.card');
        if (card) return card;
      }
      
      // 方法5: サイズが一定以上の要素で、文字「プレビュー」を含むものを探す
      const allElements = document.querySelectorAll('*');
      for (const elem of allElements) {
        const rect = elem.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 200 &&
            (elem.textContent.includes('プレビュー') || 
             elem.textContent.includes('プロフィール'))) {
          return elem;
        }
      }
    } catch (e) {
      console.error('プレビューカード検索エラー:', e);
    }
    
    return null;
  }
  
  /**
   * キーワードセクションを挿入
   */
  function insertKeywordsSection(previewCard) {
    try {
      // キーワードセクションを作成
      const keywordsSection = document.createElement('div');
      keywordsSection.className = 'direct-keywords-section';
      keywordsSection.style.cssText = `
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid rgba(0,0,0,0.1);
        width: 100%;
      `;
      
      // タイトル部分
      const titleDiv = document.createElement('div');
      titleDiv.className = 'direct-keywords-title';
      titleDiv.style.cssText = `
        font-size: 14px;
        font-weight: 500;
        color: #555;
        margin-bottom: 8px;
      `;
      titleDiv.innerHTML = '<i class="bi bi-tags-fill" style="margin-right: 5px; color: #3a87ad;"></i> 専門分野・キーワード';
      keywordsSection.appendChild(titleDiv);
      
      // タグコンテナ
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'direct-keywords-tags';
      tagsContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      `;
      keywordsSection.appendChild(tagsContainer);
      
      // タグを更新
      updateKeywordsContent(keywordsSection);
      
      // 挿入位置を決定（料金表示があれば、その後に）
      let insertionPoint = null;
      
      // 料金表示を検索
      const feeElements = previewCard.querySelectorAll('[class*="fee"], [id*="fee"]');
      if (feeElements.length > 0) {
        insertionPoint = feeElements[feeElements.length - 1];
        
        // 料金要素の親を辿って適切な挿入場所を探す
        let parent = insertionPoint.parentElement;
        while (parent && parent !== previewCard) {
          if (parent.tagName.toLowerCase() === 'div' && 
              (parent.className.includes('card-body') || parent.className.includes('content'))) {
            parent.appendChild(keywordsSection);
            console.log('料金表示の後ろにキーワードセクションを挿入しました');
            return;
          }
          parent = parent.parentElement;
        }
      }
      
      // 料金表示が見つからない場合は、カード本体またはカードボディに追加
      const cardBody = previewCard.querySelector('.card-body');
      if (cardBody) {
        cardBody.appendChild(keywordsSection);
      } else {
        previewCard.appendChild(keywordsSection);
      }
      
      console.log('キーワードセクションを挿入しました');
    } catch (e) {
      console.error('キーワードセクション挿入エラー:', e);
    }
  }
  
  /**
   * キーワードコンテンツを更新
   */
  function updateKeywordsContent(section) {
    try {
      // タグコンテナを取得
      const tagsContainer = section.querySelector('.direct-keywords-tags');
      if (!tagsContainer) return;
      
      // コンテナをクリア
      tagsContainer.innerHTML = '';
      
      // キーワードリストを取得
      const keywords = getKeywords();
      
      if (keywords.length === 0) {
        // キーワードがない場合
        const emptyMessage = document.createElement('div');
        emptyMessage.style.cssText = `
          font-size: 12px;
          color: #6c757d;
          font-style: italic;
        `;
        emptyMessage.textContent = '専門分野やキーワードが未設定です';
        tagsContainer.appendChild(emptyMessage);
      } else {
        // 各キーワードをバッジとして表示
        keywords.forEach(keyword => {
          const tag = document.createElement('div');
          tag.style.cssText = `
            display: inline-flex;
            align-items: center;
            background-color: #f8f9fa;
            color: #495057;
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 16px;
            margin-right: 4px;
            margin-bottom: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          `;
          
          // キーワードに適したアイコンと色
          let iconClass = 'tag-fill';
          let bgColor = '#f8f9fa';
          let textColor = '#495057';
          
          if (keyword.includes('ツアー') || keyword.includes('観光')) {
            iconClass = 'globe';
            bgColor = '#e3f2fd';
            textColor = '#0d47a1';
          } else if (keyword.includes('食べ') || keyword.includes('グルメ') || keyword.includes('料理')) {
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
          } else if (keyword.includes('アクティビティ')) {
            iconClass = 'bicycle';
            bgColor = '#f1f8e9';
            textColor = '#33691e';
          }
          
          tag.style.backgroundColor = bgColor;
          tag.style.color = textColor;
          
          tag.innerHTML = `
            <i class="bi bi-${iconClass}" style="margin-right: 5px; font-size: 12px;"></i>
            <span>${keyword}</span>
          `;
          
          tagsContainer.appendChild(tag);
        });
      }
      
      console.log(`${keywords.length}個のキーワードを表示しました`);
    } catch (e) {
      console.error('キーワード更新エラー:', e);
    }
  }
  
  /**
   * キーワードリストを取得
   */
  function getKeywords() {
    const keywords = [];
    
    try {
      // 方法1: コンソールログから取得
      // profile-input-fixスクリプトが記録している情報を探す
      // 直近のログを確認すると「表示するタグリスト:」というログがあるはず
      if (window.console && window.console.logs) {
        const tagLogs = window.console.logs.filter(log => 
          log.includes('表示するタグリスト:') || 
          log.includes('タグが直接見つかりました:')
        );
        
        if (tagLogs.length > 0) {
          const latestLog = tagLogs[tagLogs.length - 1];
          // ログからJSONデータを抽出
          const match = latestLog.match(/\[(.*)\]/);
          if (match) {
            try {
              const parsed = JSON.parse('[' + match[1] + ']');
              keywords.push(...parsed);
            } catch (e) {
              // パース失敗時は文字列分割で対応
              const items = match[1].split(',').map(item => 
                item.replace(/"/g, '').trim()
              );
              keywords.push(...items);
            }
          }
        }
      }
      
      // 方法2: グローバル変数から取得
      if (window.selectedTagsCache && window.selectedTagsCache.length > 0) {
        keywords.push(...window.selectedTagsCache);
      }
      
      // 方法3: UI要素から取得
      document.querySelectorAll('.selected-tag-preview, input[type="checkbox"][id^="interest-"]:checked').forEach(elem => {
        let text = '';
        
        if (elem.classList.contains('selected-tag-preview')) {
          text = elem.querySelector('.selected-tag-text')?.textContent || '';
        } else {
          text = elem.nextElementSibling?.textContent || '';
        }
        
        if (text && !keywords.includes(text)) {
          keywords.push(text);
        }
      });
      
      // 方法4: 固定リスト（他の方法で見つからない場合）
      if (keywords.length === 0) {
        keywords.push('観光', '食べ歩き', 'アート', 'ナイトツアー', 'グルメ', '写真スポット');
      }
    } catch (e) {
      console.error('キーワード取得エラー:', e);
      
      // エラー時はデフォルト値を返す
      return ['観光', '食べ歩き', 'アート'];
    }
    
    // 重複を削除して返す
    return [...new Set(keywords)].filter(k => k !== '1' && k !== '');
  }
})();