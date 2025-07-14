/**
 * 強制デフォルト表示システム
 * 全ガイドを確実に表示し、言語混合を完全に修正
 */

(function() {
  'use strict';
  
  console.log('🔥 強制デフォルト表示開始');
  
  let isProcessing = false;
  
  function forceShowAllGuides() {
    if (isProcessing) return;
    isProcessing = true;
    
    try {
      // 1. 全ガイドカードを強制表示
      const allCards = document.querySelectorAll('.guide-item, .guide-card, [class*="guide"]');
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
      
      // 2. 言語別カウンター強制修正
      const isEnglishSite = window.location.href.includes('index-en.html');
      
      if (isEnglishSite) {
        // 英語サイト
        const counters = document.querySelectorAll('#guide-counter, .guide-counter, [class*="counter"]');
        counters.forEach(counter => {
          if (counter.textContent) {
            counter.textContent = `Found ${visibleCount} guides`;
          }
        });
        
        // 日本語テキストを英語に強制変換
        document.querySelectorAll('*').forEach(el => {
          if (el.children.length === 0 && el.textContent) {
            const text = el.textContent;
            if (text.includes('人のガイドが見つかりました')) {
              el.textContent = `Found ${visibleCount} guides`;
            }
          }
        });
        
      } else {
        // 日本語サイト
        const counters = document.querySelectorAll('#search-results-counter, [class*="counter"]');
        counters.forEach(counter => {
          if (counter.textContent) {
            counter.textContent = `${visibleCount}人のガイドが見つかりました`;
          }
        });
        
        // 英語テキストを日本語に強制変換
        document.querySelectorAll('*').forEach(el => {
          if (el.children.length === 0 && el.textContent) {
            const text = el.textContent;
            if (text.includes('Found') && text.includes('guides')) {
              el.textContent = `${visibleCount}人のガイドが見つかりました`;
            }
          }
        });
      }
      
      // 3. フィルターリセット
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
      
      console.log(`✅ 強制表示完了: ${visibleCount}ガイド (${isEnglishSite ? '英語' : '日本語'}サイト)`);
      
    } catch (error) {
      console.error('強制表示エラー:', error);
    } finally {
      isProcessing = false;
    }
  }
  
  function setupContinuousMonitoring() {
    // 継続的な監視（2秒間隔）
    setInterval(() => {
      forceShowAllGuides();
    }, 2000);
    
    // DOM変更監視
    const observer = new MutationObserver(() => {
      setTimeout(forceShowAllGuides, 100);
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
    forceShowAllGuides();
    
    // 1秒後に再実行
    setTimeout(forceShowAllGuides, 1000);
    
    // 3秒後に継続監視開始
    setTimeout(setupContinuousMonitoring, 3000);
    
    console.log('✅ 強制デフォルト表示システム初期化完了');
  }
  
  // 複数のタイミングで実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  window.addEventListener('load', () => {
    setTimeout(initialize, 500);
  });
  
})();