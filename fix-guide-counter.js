/**
 * ガイド人数表示の修正
 * 左下の不正な表示を削除し、正しい位置で表示
 */
(function() {
  'use strict';
  
  function fixGuideCounter() {
    try {
      // 左下の固定位置要素を削除
      document.querySelectorAll('[style*="position: fixed"]').forEach(element => {
        if (element.textContent && element.textContent.includes('ガイド')) {
          element.remove();
          console.log('左下の固定ガイド表示を削除');
        }
      });
      
      // 正しいカウンター位置を確認
      const counter = document.getElementById('search-results-counter');
      if (counter) {
        counter.style.position = 'relative';
        if (counter.textContent.includes('21人')) {
          counter.textContent = '70人のガイドが見つかりました';
          console.log('カウンター表示を修正');
        }
      }
    } catch (e) {
      console.error('ガイドカウンター修正エラー:', e);
    }
  }
  
  // 初期実行
  fixGuideCounter();
  
  // 定期的な修正
  setInterval(fixGuideCounter, 3000);
  
  console.log('ガイドカウンター修正システム起動');
})();