/**
 * 英語サイト専用修正システム
 * 日本語サイトの修正コードをベースに英語版を作成
 */

(function() {
  'use strict';
  
  console.log('🇺🇸 英語サイト修正開始');
  
  function forceEnglishDisplay() {
    try {
      // 1. 全ガイドカードを強制表示
      const allCards = document.querySelectorAll('.guide-item, .guide-card');
      let visibleCount = 0;
      
      allCards.forEach(card => {
        if (card.classList.contains('guide-item') || card.classList.contains('guide-card')) {
          card.classList.remove('d-none', 'hidden');
          card.style.display = 'block';
          card.style.visibility = 'visible';
          card.style.opacity = '1';
          visibleCount++;
        }
      });
      
      // 2. 検索結果カウンターを英語で強制設定
      const counter = document.querySelector('#guide-counter, .guide-counter, #search-results-counter');
      if (counter) {
        counter.textContent = `Found ${visibleCount} guides`;
        counter.style.display = 'block';
      }
      
      // 3. 新規登録ボタンを英語で強制設定
      const registerButtons = document.querySelectorAll('button[onclick*="showRegisterOptions"], .btn');
      registerButtons.forEach(btn => {
        if (btn.textContent.includes('新規登録') || btn.textContent.includes('登録')) {
          btn.textContent = 'Sign Up';
        }
      });
      
      // 4. 日本語テキストを英語に変換
      document.querySelectorAll('*').forEach(element => {
        if (element.children.length === 0 && element.textContent) {
          let text = element.textContent;
          
          // 一般的な日本語→英語変換
          const translations = {
            '人のガイドが見つかりました': 'guides found',
            'ガイドを絞り込み': 'Filter Guides',
            'フィルター': 'Filter',
            '検索': 'Search',
            'リセット': 'Reset',
            'もっと見る': 'Load More',
            '詳細を見る': 'See Details',
            '新規登録': 'Sign Up',
            'ログイン': 'Login'
          };
          
          // X人のガイドが見つかりました パターン
          const foundMatch = text.match(/(\d+)人のガイドが見つかりました/);
          if (foundMatch) {
            element.textContent = `Found ${foundMatch[1]} guides`;
            return;
          }
          
          // 個別の日本語テキスト修正
          Object.keys(translations).forEach(japanese => {
            if (text.includes(japanese)) {
              element.textContent = text.replace(new RegExp(japanese, 'g'), translations[japanese]);
            }
          });
        }
      });
      
      // 5. フィルターリセット
      const inputs = document.querySelectorAll('input[type="checkbox"], input[type="text"], select');
      inputs.forEach(input => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else if (input.type === 'text') {
          input.value = '';
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0;
        }
      });
      
      console.log(`✅ 英語サイト修正完了: ${visibleCount}ガイド表示`);
      
    } catch (error) {
      console.error('英語サイト修正エラー:', error);
    }
  }
  
  function setupContinuousEnglishMonitoring() {
    // 継続的な英語表示監視（1.5秒間隔）
    setInterval(() => {
      forceEnglishDisplay();
    }, 1500);
    
    // DOM変更監視
    const observer = new MutationObserver(() => {
      setTimeout(forceEnglishDisplay, 50);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  function initialize() {
    // 即座に実行
    forceEnglishDisplay();
    
    // 0.5秒後に再実行
    setTimeout(forceEnglishDisplay, 500);
    
    // 2秒後に継続監視開始
    setTimeout(setupContinuousEnglishMonitoring, 2000);
    
    console.log('✅ 英語サイト修正システム初期化完了');
  }
  
  // 複数のタイミングで実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  window.addEventListener('load', () => {
    setTimeout(initialize, 300);
  });
  
})();