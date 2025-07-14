/**
 * 日本語サイト専用修正システム
 * デフォルト全ガイド表示と言語表示を完全に修正
 */

(function() {
  'use strict';
  
  console.log('🇯🇵 日本語サイト修正開始');
  
  function forceJapaneseDisplay() {
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
      
      // 2. 検索結果カウンターを日本語で強制設定
      const counter = document.getElementById('search-results-counter');
      if (counter) {
        counter.textContent = `${visibleCount}人のガイドが見つかりました`;
        counter.style.display = 'block';
      }
      
      // 3. 新規登録ボタンを日本語で強制設定
      const registerButtons = document.querySelectorAll('button[onclick*="showRegisterOptions"], .btn:contains("Sign Up")');
      registerButtons.forEach(btn => {
        if (btn.textContent.includes('Sign Up') || btn.textContent.includes('Register')) {
          btn.textContent = '新規登録';
        }
      });
      
      // 4. 英語テキストを日本語に変換
      document.querySelectorAll('*').forEach(element => {
        if (element.children.length === 0 && element.textContent) {
          let text = element.textContent;
          
          // 一般的な英語→日本語変換
          const translations = {
            'Found': '見つかりました',
            'guides': 'ガイド',
            'Sign Up': '新規登録',
            'Register': '新規登録',
            'Login': 'ログイン',
            'Filter': 'フィルター',
            'Search': '検索',
            'Reset': 'リセット',
            'More': 'もっと見る',
            'Details': '詳細を見る'
          };
          
          // Found X guides パターン
          const foundMatch = text.match(/Found (\d+) guides/);
          if (foundMatch) {
            element.textContent = `${foundMatch[1]}人のガイドが見つかりました`;
            return;
          }
          
          // 個別の英語テキスト修正
          Object.keys(translations).forEach(english => {
            if (text.includes(english)) {
              element.textContent = text.replace(new RegExp(english, 'g'), translations[english]);
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
      
      console.log(`✅ 日本語サイト修正完了: ${visibleCount}ガイド表示`);
      
    } catch (error) {
      console.error('日本語サイト修正エラー:', error);
    }
  }
  
  function setupContinuousJapaneseMonitoring() {
    // 継続的な日本語表示監視（1.5秒間隔）
    setInterval(() => {
      forceJapaneseDisplay();
    }, 1500);
    
    // DOM変更監視
    const observer = new MutationObserver(() => {
      setTimeout(forceJapaneseDisplay, 50);
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
    forceJapaneseDisplay();
    
    // 0.5秒後に再実行
    setTimeout(forceJapaneseDisplay, 500);
    
    // 2秒後に継続監視開始
    setTimeout(setupContinuousJapaneseMonitoring, 2000);
    
    console.log('✅ 日本語サイト修正システム初期化完了');
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