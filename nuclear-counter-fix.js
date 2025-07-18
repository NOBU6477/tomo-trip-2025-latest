/**
 * 核レベルカウンター修正スクリプト
 * 全ての「70人」表記を実際のガイドカード数に強制修正
 */

(function() {
  console.log('💥 核レベルカウンター修正システム開始');
  
  let fixInterval;
  let domObserver;
  
  function getActualGuideCount() {
    const containers = [
      '#guide-cards-container',
      '.guide-cards-container',
      '[id*="guide"]'
    ];
    
    let maxCount = 0;
    containers.forEach(selector => {
      const container = document.querySelector(selector);
      if (container) {
        const cards = container.querySelectorAll('.guide-card, .col-lg-4, .col-md-4, .card');
        if (cards.length > maxCount) {
          maxCount = cards.length;
        }
      }
    });
    
    console.log(`🎯 実際のガイドカード数検出: ${maxCount}`);
    return maxCount;
  }
  
  function nuclearCounterFix() {
    const actualCount = getActualGuideCount();
    
    if (actualCount === 0) {
      console.log('⚠️ ガイドカードが検出されません。修正をスキップ');
      return;
    }
    
    console.log(`💥 核修正実行: ${actualCount}人のガイド`);
    
    // 1. 全てのテキストノードを検索・修正
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent && (
        node.textContent.includes('70人のガイド') ||
        node.textContent.includes('70名のガイド') ||
        node.textContent.includes('70人が見つかり')
      )) {
        textNodes.push(node);
      }
    }
    
    textNodes.forEach(textNode => {
      if (textNode.parentNode && textNode.parentNode.tagName !== 'SCRIPT') {
        let newText = textNode.textContent;
        newText = newText.replace(/70人のガイドが見つかりました/g, `${actualCount}人のガイドが見つかりました`);
        newText = newText.replace(/70名のガイドが見つかりました/g, `${actualCount}名のガイドが見つかりました`);
        newText = newText.replace(/70人のガイド/g, `${actualCount}人のガイド`);
        newText = newText.replace(/70名のガイド/g, `${actualCount}名のガイド`);
        newText = newText.replace(/70人が見つかり/g, `${actualCount}人が見つかり`);
        
        if (newText !== textNode.textContent) {
          textNode.textContent = newText;
          console.log(`✅ テキストノード修正: ${textNode.textContent.substring(0, 50)}...`);
        }
      }
    });
    
    // 2. HTML要素の直接修正
    const elementsToFix = document.querySelectorAll('*');
    elementsToFix.forEach(element => {
      if (element.textContent && element.tagName !== 'SCRIPT') {
        if (element.textContent.includes('70人のガイド') || 
            element.textContent.includes('70名のガイド')) {
          
          let newHTML = element.innerHTML;
          newHTML = newHTML.replace(/70人のガイドが見つかりました/g, `${actualCount}人のガイドが見つかりました`);
          newHTML = newHTML.replace(/70名のガイドが見つかりました/g, `${actualCount}名のガイドが見つかりました`);
          newHTML = newHTML.replace(/70人のガイド/g, `${actualCount}人のガイド`);
          newHTML = newHTML.replace(/70名のガイド/g, `${actualCount}名のガイド`);
          
          if (newHTML !== element.innerHTML) {
            element.innerHTML = newHTML;
            console.log(`✅ 要素修正: ${element.tagName} - ${element.textContent.substring(0, 30)}...`);
          }
        }
      }
    });
    
    // 3. 特定要素の強制修正
    const specificSelectors = [
      '.counter-badge',
      '#guide-counter',
      '#guides-count',
      '[class*="counter"]',
      '[id*="counter"]',
      '.guide-count'
    ];
    
    specificSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.textContent && element.textContent.includes('70')) {
          element.innerHTML = element.innerHTML.replace(/70/g, actualCount);
          console.log(`✅ カウンター要素修正: ${selector}`);
        }
      });
    });
    
    // 4. 最終手段：body全体のHTML置換
    if (document.body.innerHTML.includes('70人のガイド') || 
        document.body.innerHTML.includes('70名のガイド')) {
      
      let bodyHTML = document.body.innerHTML;
      const originalLength = bodyHTML.length;
      
      bodyHTML = bodyHTML.replace(/70人のガイドが見つかりました/g, `${actualCount}人のガイドが見つかりました`);
      bodyHTML = bodyHTML.replace(/70名のガイドが見つかりました/g, `${actualCount}名のガイドが見つかりました`);
      bodyHTML = bodyHTML.replace(/70人のガイド/g, `${actualCount}人のガイド`);
      bodyHTML = bodyHTML.replace(/70名のガイド/g, `${actualCount}名のガイド`);
      
      if (bodyHTML.length !== originalLength) {
        document.body.innerHTML = bodyHTML;
        console.log('💥 BODY全体のHTML置換を実行');
      }
    }
    
    console.log(`✅ 核修正完了: ${actualCount}人のガイド表示`);
  }
  
  // 即座実行
  setTimeout(nuclearCounterFix, 100);
  
  // 継続監視（3秒間隔で60秒間、より強力に）
  let executionCount = 0;
  fixInterval = setInterval(() => {
    executionCount++;
    nuclearCounterFix();
    
    if (executionCount >= 20) {
      clearInterval(fixInterval);
      console.log('💥 核修正監視を60秒で終了');
    }
  }, 3000);
  
  // DOM変更監視
  domObserver = new MutationObserver((mutations) => {
    let shouldFix = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        if (mutation.target.textContent && mutation.target.textContent.includes('70人')) {
          shouldFix = true;
        }
      }
    });
    
    if (shouldFix) {
      setTimeout(nuclearCounterFix, 50);
    }
  });
  
  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  
  // 30秒後に監視停止
  setTimeout(() => {
    if (domObserver) {
      domObserver.disconnect();
      console.log('💥 DOM監視を30秒で終了');
    }
  }, 30000);
  
  // ページ読み込み完了時にも実行
  window.addEventListener('load', () => {
    setTimeout(nuclearCounterFix, 500);
  });
  
  // グローバル関数として公開
  window.nuclearCounterFix = nuclearCounterFix;
  
})();