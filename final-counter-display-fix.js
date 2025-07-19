/**
 * 最終カウンター表示修正システム
 * 「6人のガイドが見つかりました（全6人中）」→「24人のガイドが見つかりました」修正
 */

console.log('🎯 最終カウンター表示修正システム開始');

// 即座に実行
(function() {
  console.log('⚡ 即座修正開始');
  
  // DOM読み込み前でも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeFinalCounterFix);
  } else {
    executeFinalCounterFix();
  }
  
  // 追加の保険として遅延実行
  setTimeout(executeFinalCounterFix, 1000);
  setTimeout(executeFinalCounterFix, 3000);
  setTimeout(executeFinalCounterFix, 5000);
})();

function executeFinalCounterFix() {
  console.log('🎯 最終カウンター修正実行');
  
  try {
    // 1. 強制的にカウンターテキストを修正
    forceCounterTextFix();
    
    // 2. ガイドカードの表示確認
    const actualCards = document.querySelectorAll('#guide-cards-container .guide-item, #guide-cards-container .card, #guide-cards-container .col-md-4').length;
    console.log(`📊 実際のガイドカード数: ${actualCards}枚`);
    
    // 3. カウンターを正確に更新
    const properText = actualCards >= 24 ? '24人のガイドが見つかりました' : 
                      actualCards >= 12 ? `${actualCards}人のガイドを表示中（全24人中）` :
                      `${actualCards}人のガイドが見つかりました（全24人中）`;
    
    updateAllCounters(properText);
    
    // 4. 「もっと見る」ボタンの表示状態確認
    checkLoadMoreButtonVisibility(actualCards);
    
    console.log(`✅ 最終カウンター修正完了: "${properText}"`);
    
  } catch (error) {
    console.error('❌ 最終カウンター修正エラー:', error);
  }
}

function forceCounterTextFix() {
  console.log('🔧 強制カウンターテキスト修正');
  
  // 問題のあるテキストパターンを検索・置換
  const problematicPatterns = [
    /6人のガイドが見つかりました.*全6人中/g,
    /6人のガイドが見つかりました$/g,
    /Found 6 guides/g
  ];
  
  // DOM全体をスキャン
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  
  while (node = walker.nextNode()) {
    const text = node.textContent.trim();
    
    // 問題のあるパターンを検出
    const hasProblematicText = problematicPatterns.some(pattern => pattern.test(text));
    
    if (hasProblematicText) {
      textNodes.push(node);
      console.log(`🎯 問題テキスト検出: "${text}"`);
    }
  }
  
  // 問題のあるテキストノードを修正
  textNodes.forEach(textNode => {
    const parentElement = textNode.parentElement;
    if (parentElement) {
      let newText = '24人のガイドが見つかりました';
      
      // アイコンがある場合は保持
      if (parentElement.innerHTML.includes('bi-people-fill')) {
        parentElement.innerHTML = `<i class="bi bi-people-fill me-2"></i>${newText}`;
      } else {
        parentElement.textContent = newText;
      }
      
      console.log(`🔧 テキスト修正実行: "${newText}"`);
    }
  });
}

function updateAllCounters(counterText) {
  console.log(`📊 全カウンター更新: "${counterText}"`);
  
  // 複数のセレクターでカウンター要素を特定
  const counterSelectors = [
    '.text-primary.fw-bold.fs-5',
    '.counter-badge',
    '#guides-count',
    '.guide-counter',
    '#guide-counter',
    '[class*="guide"][class*="count"]',
    '[class*="counter"]'
  ];
  
  let updatedCount = 0;
  
  counterSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const currentText = element.textContent || element.innerHTML;
        
        // ガイド関連のカウンター要素のみ更新
        if (currentText.includes('ガイドが') || currentText.includes('人のガイド') || 
            currentText.includes('guides') || currentText.includes('Guide')) {
          
          // アイコン付きで更新
          element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
          updatedCount++;
          
          console.log(`📊 カウンター更新 (${selector}): "${counterText}"`);
        }
      });
    } catch (error) {
      console.log(`⚠️ セレクター ${selector} でエラー: ${error.message}`);
    }
  });
  
  // 特定の要素も直接更新
  const specificElements = [
    document.querySelector('h2 + .text-primary'),
    document.querySelector('.fs-5'),
    document.getElementById('guide-count-display')
  ];
  
  specificElements.forEach(element => {
    if (element && (element.textContent.includes('ガイド') || element.textContent.includes('guide'))) {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
      updatedCount++;
      console.log('📊 特定要素更新完了');
    }
  });
  
  console.log(`📊 カウンター更新完了: ${updatedCount}箇所更新`);
}

function checkLoadMoreButtonVisibility(cardCount) {
  console.log(`🔘 もっと見るボタン可視性チェック: ${cardCount}枚表示`);
  
  const loadMoreBtn = document.getElementById('load-more-btn');
  const oldLoadMoreBtn = document.getElementById('load-more-guides');
  
  if (cardCount >= 24) {
    // 全員表示済み - ボタンを非表示
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    if (oldLoadMoreBtn) oldLoadMoreBtn.style.display = 'none';
    console.log('🔘 全員表示済み - もっと見るボタン非表示');
    
  } else if (cardCount >= 12 && cardCount < 24) {
    // 部分表示 - ボタンを表示
    const remaining = 24 - cardCount;
    
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML = `
        <button class="btn btn-primary btn-lg load-more-button">
          もっと見る（残り${remaining}人）
        </button>
      `;
      loadMoreBtn.style.display = 'block';
      console.log(`🔘 もっと見るボタン表示: 残り${remaining}人`);
    }
    
  } else {
    // 12人未満 - システムの問題、強制修正が必要
    console.log(`⚠️ 表示ガイド数が少なすぎます: ${cardCount}人 - 緊急システム起動要`);
  }
}

// 継続的な監視システム
function startContinuousMonitoring() {
  console.log('👁️ 継続的カウンター監視開始');
  
  setInterval(() => {
    const counterElements = document.querySelectorAll('.text-primary.fw-bold.fs-5, .counter-badge, #guides-count');
    
    counterElements.forEach(element => {
      const text = element.textContent;
      
      // 問題のあるテキストを検出
      if (text.includes('6人のガイドが見つかりました') || text.includes('Found 6 guides')) {
        console.log('👁️ 問題テキスト再検出 - 自動修正実行');
        executeFinalCounterFix();
      }
    });
  }, 5000); // 5秒間隔で監視
}

// 5秒後に継続監視を開始
setTimeout(startContinuousMonitoring, 5000);

// デバッグ用関数
window.finalCounterDebug = function() {
  console.log('🎯 最終カウンター修正デバッグ情報');
  
  const cardCount = document.querySelectorAll('#guide-cards-container .guide-item, #guide-cards-container .card, #guide-cards-container .col-md-4').length;
  const counterElements = document.querySelectorAll('.text-primary.fw-bold.fs-5, .counter-badge');
  
  console.log('📊 現在の状態:', {
    cardCount: cardCount,
    counterElementsCount: counterElements.length,
    emergencySystemExists: !!window.emergencyPaginationSystem
  });
  
  counterElements.forEach((element, index) => {
    console.log(`📊 カウンター${index}: "${element.textContent.trim()}"`);
  });
  
  // 手動修正実行
  executeFinalCounterFix();
};

console.log('✅ 最終カウンター表示修正システム読み込み完了');
console.log('🔧 デバッグ用: window.finalCounterDebug() を実行してください');