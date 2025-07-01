/**
 * 日本語版カウンター表示修正スクリプト
 * 英語版スクリプトの干渉を防ぎ、正しい日本語表示を維持
 */

(function() {
  'use strict';
  
  console.log('🇯🇵 日本語版カウンター修正開始');
  
  // 日本語表示を強制する関数
  function enforceJapaneseDisplay() {
    const currentURL = window.location.href;
    const isJapaneseSite = !currentURL.includes('index-en.html');
    
    if (!isJapaneseSite) {
      console.log('英語サイトのため処理をスキップ');
      return;
    }
    
    // 英語のガイドカウンターを日本語に変更
    const counterElements = [
      ...document.querySelectorAll('.counter-badge'),
      ...document.querySelectorAll('[class*="counter"]'),
      ...document.querySelectorAll('[class*="found"]'),
      ...document.querySelectorAll('.badge'),
      ...document.querySelectorAll('div, span, p')
    ];
    
    counterElements.forEach(element => {
      if (element.textContent) {
        const text = element.textContent;
        
        // "Found XX guides" を "XX人のガイドが見つかりました" に変更
        if (text.includes('Found') && text.includes('guides')) {
          const match = text.match(/(\d+)\s*guides/);
          if (match) {
            const count = match[1];
            element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}人のガイドが見つかりました`;
            console.log(`カウンター修正: ${text} → ${count}人のガイドが見つかりました`);
          }
        }
        
        // "XX guides found" を "XX人のガイドが見つかりました" に変更
        else if (text.includes('guides found')) {
          const match = text.match(/(\d+)\s*guides found/);
          if (match) {
            const count = match[1];
            element.textContent = `${count}人のガイドが見つかりました`;
            console.log(`カウンター修正: ${text} → ${count}人のガイドが見つかりました`);
          }
        }
        
        // 特定の要素での表示修正
        if (text === 'Found 70 guides' || text === '70 guides found') {
          element.innerHTML = '<i class="bi bi-people-fill me-2"></i>70人のガイドが見つかりました';
          console.log('70人ガイド表示を日本語に修正');
        }
      }
    });
    
    // 検索結果カウンターの特別処理
    const searchCounter = document.getElementById('search-results-counter');
    if (searchCounter) {
      const text = searchCounter.textContent;
      if (text.includes('Found') || text.includes('guides found')) {
        const match = text.match(/(\d+)/);
        if (match) {
          const count = match[1];
          searchCounter.textContent = `${count}人のガイドが見つかりました`;
          console.log('検索結果カウンター修正完了');
        }
      }
    }
    
    // Popular Guides セクションの副題修正
    const popularGuidesTitle = document.querySelector('h2');
    if (popularGuidesTitle && popularGuidesTitle.textContent.includes('人気のガイド')) {
      const subtitle = popularGuidesTitle.nextElementSibling;
      if (subtitle && subtitle.textContent.includes('guides found')) {
        const match = subtitle.textContent.match(/(\d+)/);
        if (match) {
          const count = match[1];
          subtitle.textContent = `${count}人のガイドが見つかりました`;
          console.log('人気のガイドセクション副題修正');
        }
      }
    }
  }
  
  // フィルター結果更新時の日本語表示
  function updateFilterResultsJapanese(count) {
    console.log(`フィルター結果更新: ${count}人`);
    
    // カウンターバッジ更新
    const counterElements = document.querySelectorAll('.counter-badge, [class*="counter"], .badge');
    counterElements.forEach(element => {
      if (element.textContent.includes('Found') || 
          element.textContent.includes('guides') || 
          element.textContent.includes('ガイド')) {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}人のガイドが見つかりました`;
      }
    });
    
    // 検索結果セクション更新
    const searchCounter = document.getElementById('search-results-counter');
    if (searchCounter) {
      searchCounter.textContent = `${count}人のガイドが見つかりました`;
    }
    
    // Popular Guides セクション更新
    const popularGuidesTitle = document.querySelector('h2');
    if (popularGuidesTitle && popularGuidesTitle.textContent.includes('人気のガイド')) {
      const subtitle = popularGuidesTitle.nextElementSibling;
      if (subtitle) {
        subtitle.textContent = `${count}人のガイドが見つかりました`;
      }
    }
    
    // "no results" メッセージ
    let noResultsMsg = document.getElementById('no-results-message');
    if (count === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'text-center py-5';
        noResultsMsg.innerHTML = `
          <div class="alert alert-info">
            <i class="bi bi-search me-2"></i>
            <strong>ガイドが見つかりませんでした</strong><br>
            検索条件を変更してお試しください。
          </div>
        `;
        
        const guidesContainer = document.querySelector('.container .row') || 
                              document.getElementById('guide-cards-container');
        if (guidesContainer) {
          guidesContainer.appendChild(noResultsMsg);
        }
      }
      noResultsMsg.style.display = 'block';
    } else {
      if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
      }
    }
  }
  
  // グローバル関数として登録（フィルター機能から呼び出し可能にする）
  window.updateFilterResultsJapanese = updateFilterResultsJapanese;
  
  // 定期的な監視と修正
  function startContinuousMonitoring() {
    // 即座に実行
    enforceJapaneseDisplay();
    
    // 定期的に実行（1秒間隔）
    setInterval(enforceJapaneseDisplay, 1000);
    
    // DOM変更を監視
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // 新しいノードが追加されたか、テキストが変更された場合
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
              shouldUpdate = true;
            }
          });
          
          if (mutation.target && mutation.target.textContent) {
            const text = mutation.target.textContent;
            if (text.includes('Found') && text.includes('guides')) {
              shouldUpdate = true;
            }
          }
        }
      });
      
      if (shouldUpdate) {
        setTimeout(enforceJapaneseDisplay, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('日本語表示監視システム開始');
  }
  
  // 初期化
  function initialize() {
    console.log('🚀 日本語版カウンター修正初期化');
    
    // 即座に実行
    enforceJapaneseDisplay();
    
    // 遅延実行
    setTimeout(enforceJapaneseDisplay, 100);
    setTimeout(enforceJapaneseDisplay, 500);
    setTimeout(enforceJapaneseDisplay, 1000);
    
    // 継続監視開始
    startContinuousMonitoring();
    
    console.log('✅ 日本語版カウンター修正完了');
  }
  
  // 様々なタイミングで初期化
  initialize();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  window.addEventListener('load', () => {
    setTimeout(initialize, 50);
  });
  
  // ページが表示されたときも実行
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(initialize, 10);
    }
  });
  
  console.log('📝 日本語版カウンター修正設定完了');
  
})();