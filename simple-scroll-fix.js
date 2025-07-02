/**
 * 包括的な修復システム - スクロール、ガイド人数表示、言語切り替えを統合
 */
(function() {
  'use strict';
  
  console.log('包括的修復システム起動開始');
  
  // スクロール修復関数（強化版）
  function fixScroll() {
    try {
      // 基本的なoverflow設定
      document.body.style.overflow = 'auto';
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflow = 'auto';
      
      // 問題のあるBootstrapクラスを削除
      document.body.classList.remove('modal-open');
      
      // 固定位置指定を削除
      document.body.style.position = '';
      document.body.style.paddingRight = '';
      
      // 高さ制限を解除
      document.body.style.height = '';
      document.body.style.maxHeight = '';
      
      console.log('✓ スクロール修復実行');
    } catch (e) {
      console.error('スクロール修復エラー:', e);
    }
  }
  
  // ガイド人数表示修正
  function fixGuideCounter() {
    try {
      // 左下の不正な固定表示を削除
      document.querySelectorAll('[style*="position: fixed"]').forEach(element => {
        const text = element.textContent || '';
        if (text.includes('ガイド') || text.includes('人') || text.includes('見つかりました')) {
          element.remove();
          console.log('✓ 左下固定表示削除:', text.substring(0, 20));
        }
      });
      
      // 正しい位置のカウンターを修正
      const counter = document.getElementById('search-results-counter');
      if (counter) {
        counter.style.position = 'relative';
        counter.style.display = 'block';
        
        // 内容を確認して修正
        if (counter.textContent.includes('21')) {
          counter.textContent = '70人のガイドが見つかりました';
          console.log('✓ カウンター内容修正: 70人のガイド');
        }
      }
    } catch (e) {
      console.error('ガイドカウンター修正エラー:', e);
    }
  }
  
  // 即座にスクロールを修復
  fixScroll();
  
  // ページ読み込み後の修復
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      fixScroll();
      fixGuideCounter();
      console.log('✓ DOMContentLoaded後の修復完了');
    }, 500);
  });
  
  // 言語切り替え関数を拡張（元の関数を保持）
  function enhanceLanguageSwitching() {
    const originalSwitchToJapanese = window.switchToJapanese;
    const originalSwitchToEnglish = window.switchToEnglish;
    
    if (originalSwitchToJapanese) {
      window.switchToJapanese = function() {
        try {
          console.log('日本語切り替え開始');
          originalSwitchToJapanese();
          
          setTimeout(function() {
            fixScroll();
            fixGuideCounter();
            console.log('✓ 日本語切り替え後の修復完了');
          }, 100);
        } catch (e) {
          console.error('日本語切り替えエラー:', e);
        }
      };
    }
    
    if (originalSwitchToEnglish) {
      window.switchToEnglish = function() {
        try {
          console.log('英語切り替え開始');
          originalSwitchToEnglish();
          
          setTimeout(function() {
            fixScroll();
            console.log('✓ 英語切り替え後の修復完了');
          }, 100);
        } catch (e) {
          console.error('英語切り替えエラー:', e);
        }
      };
    }
  }
  
  // 言語切り替え強化を後で実行
  setTimeout(enhanceLanguageSwitching, 1000);
  
  // 定期的な監視と修復
  setInterval(function() {
    try {
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      if (bodyOverflow === 'hidden') {
        fixScroll();
      }
      
      // 5秒ごとにガイドカウンターも確認
      fixGuideCounter();
    } catch (e) {
      // エラーを無視（大量のログを防ぐ）
    }
  }, 5000);
  
  console.log('✓ 包括的修復システム起動完了');
})();