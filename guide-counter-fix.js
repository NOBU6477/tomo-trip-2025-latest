/**
 * ガイド数カウンター修正システム
 * 表示されているガイド数と実際のガイド数を正確に一致させる
 */

(function() {
  'use strict';
  
  console.log('📊 ガイド数カウンター修正開始');
  
  let updateInterval;
  
  function updateGuideCounter() {
    try {
      // すべて表示されているガイドカードを取得
      const visibleGuideCards = document.querySelectorAll('.guide-item:not(.d-none), .guide-card:not(.d-none)');
      const totalGuides = visibleGuideCards.length;
      
      // サイト言語を確認
      const isEnglishSite = window.location.href.includes('index-en.html');
      
      if (isEnglishSite) {
        // 英語サイトのカウンター更新
        const englishCounter = document.querySelector('#guide-counter, .guide-counter, [class*="found"]');
        if (englishCounter) {
          englishCounter.textContent = `Found ${totalGuides} guides`;
          englishCounter.style.display = totalGuides > 0 ? 'block' : 'none';
        }
      } else {
        // 日本語サイトのカウンター更新
        const japaneseCounter = document.querySelector('#search-results-counter');
        if (japaneseCounter) {
          japaneseCounter.textContent = `${totalGuides}人のガイドが見つかりました`;
          japaneseCounter.style.display = totalGuides > 0 ? 'block' : 'none';
        }
      }
      
      // 言語固有の他の要素も更新（混合を防ぐ）
      if (isEnglishSite) {
        // 英語サイト：日本語テキストを英語に修正
        const mixedElements = document.querySelectorAll('*');
        mixedElements.forEach(element => {
          if (element.textContent && element.textContent.includes('人のガイドが見つかりました')) {
            element.textContent = element.textContent.replace(/\d+人のガイドが見つかりました/, `Found ${totalGuides} guides`);
          }
        });
      } else {
        // 日本語サイト：英語テキストを日本語に修正
        const mixedElements = document.querySelectorAll('*');
        mixedElements.forEach(element => {
          if (element.textContent && element.textContent.includes('Found') && element.textContent.includes('guides')) {
            element.textContent = element.textContent.replace(/Found \d+ guides/, `${totalGuides}人のガイドが見つかりました`);
          }
        });
      }
      
      console.log(`✅ ガイド数更新: ${totalGuides}人`);
      
    } catch (error) {
      console.error('ガイド数カウンターエラー:', error);
    }
  }
  
  function showAllGuides() {
    try {
      // すべてのガイドカードを表示
      const allGuideCards = document.querySelectorAll('.guide-item, .guide-card');
      allGuideCards.forEach(card => {
        card.classList.remove('d-none');
        card.style.display = 'block';
      });
      
      // フィルターをリセット
      const filterInputs = document.querySelectorAll('input[type="checkbox"], input[type="text"], select');
      filterInputs.forEach(input => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
      
      console.log('✅ 全ガイド表示完了');
      updateGuideCounter();
      
    } catch (error) {
      console.error('全ガイド表示エラー:', error);
    }
  }
  
  function setupDynamicGuideSystem() {
    // 新規ガイド追加監視
    const observer = new MutationObserver((mutations) => {
      let guidesChanged = false;
      
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && 
              (node.classList?.contains('guide-item') || 
               node.classList?.contains('guide-card') ||
               node.querySelector?.('.guide-item, .guide-card'))) {
            guidesChanged = true;
          }
        });
      });
      
      if (guidesChanged) {
        console.log('🆕 新規ガイド検出');
        setTimeout(updateGuideCounter, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('🔄 動的ガイドシステム開始');
  }
  
  function initialize() {
    // 初期化時に全ガイド表示
    showAllGuides();
    
    // 動的監視システム開始
    setupDynamicGuideSystem();
    
    // 定期的な更新（5秒間隔）
    updateInterval = setInterval(updateGuideCounter, 5000);
    
    // フィルター変更時の監視
    document.addEventListener('change', function(e) {
      if (e.target.matches('input, select')) {
        setTimeout(updateGuideCounter, 200);
      }
    });
    
    // クリック時の監視
    document.addEventListener('click', function(e) {
      if (e.target.matches('button, .btn, [role="button"]')) {
        setTimeout(updateGuideCounter, 200);
      }
    });
    
    console.log('✅ ガイド数修正システム初期化完了');
  }
  
  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // ページ離脱時にクリーンアップ
  window.addEventListener('beforeunload', () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });
  
})();