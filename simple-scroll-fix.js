/**
 * シンプルなスクロール修復システム
 * ページが真っ白にならない安全な実装
 */
(function() {
  'use strict';
  
  // スクロール修復関数
  function fixScroll() {
    try {
      document.body.style.overflow = 'auto';
      document.body.style.overflowY = 'auto';
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = 'auto';
      console.log('スクロール修復実行');
    } catch (e) {
      console.error('スクロール修復エラー:', e);
    }
  }
  
  // 言語切り替え時のスクロール修復を追加
  const originalSwitchToJapanese = window.switchToJapanese;
  const originalSwitchToEnglish = window.switchToEnglish;
  
  if (originalSwitchToJapanese) {
    window.switchToJapanese = function() {
      try {
        originalSwitchToJapanese();
        setTimeout(fixScroll, 100);
      } catch (e) {
        console.error('日本語切り替えエラー:', e);
      }
    };
  }
  
  if (originalSwitchToEnglish) {
    window.switchToEnglish = function() {
      try {
        originalSwitchToEnglish();
        setTimeout(fixScroll, 100);
      } catch (e) {
        console.error('英語切り替えエラー:', e);
      }
    };
  }
  
  // 定期的なスクロール修復
  setInterval(function() {
    try {
      if (window.getComputedStyle(document.body).overflow === 'hidden') {
        fixScroll();
      }
    } catch (e) {
      // エラーを無視
    }
  }, 2000);
  
  console.log('シンプルスクロール修復システム起動');
})();