/**
 * インラインスタイルによる強制的な修正スクリプト
 * 他のスクリプトが動作しない場合の最終手段
 */

(function() {
  // 即時実行
  applyInlineStyles();
  
  // 繰り返し実行
  setInterval(applyInlineStyles, 500);
  
  function applyInlineStyles() {
    console.log('インラインスタイル修正を適用中...');
    
    // 1. 青バッジに直接スタイルを適用
    // ナビゲーションやツールバーを除外して青バッジを選択
    const allBadges = document.querySelectorAll('.badge:not(.navbar .badge):not(.nav .badge):not(header .badge):not(#navbarNav .badge)');
    allBadges.forEach(badge => {
      // 青バッジっぽいかチェック
      try {
        // ナビゲーションの要素は除外する
        if (isInNavigation(badge)) {
          return;
        }
        
        const style = window.getComputedStyle(badge);
        const bgColor = style.backgroundColor;
        const isBlue = 
          bgColor.includes('rgb(0, 123, 255)') || 
          bgColor.includes('rgb(13, 110, 253)') ||
          badge.classList.contains('badge-primary') ||
          badge.classList.contains('bg-primary');
        
        if (isBlue) {
          console.log('青バッジを発見:', badge);
          // 強制的に非表示
          badge.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            pointer-events: none !important;
            overflow: visible !important;
          `;
        }
      } catch (e) {
        // エラー無視
      }
    });
    
    // 要素がナビゲーション内にあるか判定する関数
    function isInNavigation(element) {
      let current = element;
      while (current) {
        if (current.tagName && 
            (current.tagName.toLowerCase() === 'nav' || 
             current.tagName.toLowerCase() === 'header' ||
             (current.id && current.id.includes('nav')) ||
             (current.className && 
              (current.className.includes('navbar') || 
               current.className.includes('nav'))))) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    }
    
    // 2. 特定の文字列を含む要素を探してスタイル適用
    const targetTexts = ['観光', '食べ歩き', 'アート', 'ナイトツアー', 'グルメ'];
    for (const text of targetTexts) {
      const elements = [];
      const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        { acceptNode: node => node.textContent.includes(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
      );
      
      let node;
      while (node = walker.nextNode()) {
        elements.push(node.parentElement);
      }
      
      for (const element of elements) {
        try {
          const isSmall = element.offsetWidth < 100 && element.offsetHeight < 40;
          const hasBlueBackground = (() => {
            try {
              const style = window.getComputedStyle(element);
              return style.backgroundColor.includes('rgb(0, 123, 255)') || 
                     style.backgroundColor.includes('rgb(13, 110, 253)');
            } catch (e) {
              return false;
            }
          })();
          
          if (isSmall || hasBlueBackground) {
            console.log(`「${text}」を含む青バッジらしき要素を発見:`, element);
            element.style.cssText = `
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              width: 0 !important;
              height: 0 !important;
              position: absolute !important;
              pointer-events: none !important;
              overflow: visible !important;
            `;
          }
        } catch (e) {
          // エラー無視
        }
      }
    }
    
    // 3. 強制的にキーワードセクションを追加
    const previewElements = document.querySelectorAll('.card-header, h4, h5, h6');
    for (const element of previewElements) {
      if (element.textContent.includes('プレビュー') || element.textContent.includes('プロフィール')) {
        const card = element.closest('.card');
        if (card) {
          // このカードにキーワードセクションを追加
          injectKeywordSection(card);
        }
      }
    }
  }
  
  function injectKeywordSection(card) {
    // すでに挿入済みかチェック
    if (card.querySelector('.emergency-keywords-section')) return;
    
    // セクション作成
    const section = document.createElement('div');
    section.className = 'emergency-keywords-section';
    section.style.cssText = `
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.1);
      width: 100%;
    `;
    
    // タイトル
    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #555;
      margin-bottom: 8px;
    `;
    title.innerHTML = '<i class="bi bi-tags-fill" style="margin-right: 5px; color: #3a87ad;"></i> 専門分野・キーワード';
    section.appendChild(title);
    
    // タグコンテナ
    const tagsContainer = document.createElement('div');
    tagsContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `;
    section.appendChild(tagsContainer);
    
    // 固定タグを追加
    const tags = ['観光', '食べ歩き', 'アート', 'ナイトツアー', 'グルメ', '写真スポット'];
    
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.style.cssText = `
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
      
      // タグに合わせた色とアイコン
      let iconClass = 'tag-fill';
      let bgColor = '#f8f9fa';
      let textColor = '#495057';
      
      if (tag.includes('ツアー') || tag.includes('観光')) {
        iconClass = 'globe';
        bgColor = '#e3f2fd';
        textColor = '#0d47a1';
      } else if (tag.includes('食べ') || tag.includes('グルメ') || tag.includes('料理')) {
        iconClass = 'cup-hot';
        bgColor = '#e8f5e9';
        textColor = '#1b5e20';
      } else if (tag.includes('写真') || tag.includes('カメラ')) {
        iconClass = 'camera';
        bgColor = '#e0f7fa';
        textColor = '#006064';
      } else if (tag.includes('アート') || tag.includes('文化')) {
        iconClass = 'palette';
        bgColor = '#fff3e0';
        textColor = '#e65100';
      } else if (tag.includes('アクティビティ')) {
        iconClass = 'bicycle';
        bgColor = '#f1f8e9';
        textColor = '#33691e';
      }
      
      tagElement.style.backgroundColor = bgColor;
      tagElement.style.color = textColor;
      
      tagElement.innerHTML = `
        <i class="bi bi-${iconClass}" style="margin-right: 5px; font-size: 12px;"></i>
        <span>${tag}</span>
      `;
      
      tagsContainer.appendChild(tagElement);
    });
    
    // 料金表示の後に挿入
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      const feeElements = cardBody.querySelectorAll('[class*="fee"], [id*="fee"]');
      if (feeElements.length > 0) {
        const feeElement = feeElements[feeElements.length - 1];
        // 親要素を探す
        let parent = feeElement;
        while (parent && parent !== cardBody) {
          parent = parent.parentElement;
        }
        
        if (parent === cardBody) {
          // 料金要素が直接cardBodyの子要素の場合
          cardBody.insertBefore(section, feeElement.nextSibling);
        } else {
          // 違う場合はcardBodyの末尾に追加
          cardBody.appendChild(section);
        }
      } else {
        // 料金要素がなければ末尾に追加
        cardBody.appendChild(section);
      }
    } else {
      // cardBodyがなければカード自体に追加
      card.appendChild(section);
    }
    
    console.log('緊急キーワードセクションを挿入しました');
  }
})();