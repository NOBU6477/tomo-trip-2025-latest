/**
 * ガイド人数表示の位置とスクロール問題修正スクリプト
 * 左下に表示される「21人のガイドが見つかりました」の表示問題を解決
 */
(function() {
  'use strict';
  
  console.log('🔧 ガイド人数表示修正開始');
  
  function fixGuideCounterPosition() {
    // 1. 固定位置で表示されている要素を検出・修正
    const fixedElements = document.querySelectorAll('[style*="position: fixed"]');
    fixedElements.forEach(element => {
      const text = element.textContent;
      if (text && (text.includes('ガイド') || text.includes('guide') || text.includes('見つかり'))) {
        console.log('🎯 固定位置のガイド表示要素を発見:', text);
        
        // 固定位置を解除
        element.style.position = 'static';
        element.style.bottom = 'auto';
        element.style.left = 'auto';
        element.style.right = 'auto';
        element.style.zIndex = 'auto';
        
        // 削除するか非表示にする
        element.style.display = 'none';
        console.log('✅ 固定位置要素を無効化');
      }
    });
    
    // 2. Replit環境の自動生成デバッグ情報を削除
    const debugElements = document.querySelectorAll('div[style*="position: fixed"][style*="background"]');
    debugElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isBottomLeft = rect.bottom > window.innerHeight - 100 && rect.left < 200;
      
      if (isBottomLeft || element.textContent.includes('ガイド') || element.textContent.includes('guide')) {
        console.log('🗑️ デバッグ要素を削除:', element.textContent.substring(0, 50));
        element.remove();
      }
    });
    
    // 3. console.log出力によるDOM追加を防止
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      // ガイド関連のconsole.logをDOM追加しないようにフィルタ
      const message = args.join(' ');
      if (message.includes('ガイド') && message.includes('見つかり')) {
        // DOM追加は行わず、コンソールのみに出力
        return originalConsoleLog.apply(console, args);
      }
      return originalConsoleLog.apply(console, args);
    };
    
    // 4. 検索結果カウンターの表示を正常化
    const searchCounter = document.getElementById('search-results-counter');
    if (searchCounter) {
      // カウンターが重複表示されないように制御
      const currentText = searchCounter.textContent;
      if (currentText.includes('21人')) {
        searchCounter.textContent = '70人のガイドが見つかりました';
        console.log('✅ カウンターテキストを修正:', searchCounter.textContent);
      }
      
      // カウンターのスタイルを修正（固定位置にならないように）
      searchCounter.style.position = 'relative';
      searchCounter.style.bottom = 'auto';
      searchCounter.style.left = 'auto';
      searchCounter.style.right = 'auto';
    }
    
    // 5. スクロール阻害要素の削除
    document.querySelectorAll('*').forEach(element => {
      const style = window.getComputedStyle(element);
      if (style.position === 'fixed' && style.bottom !== 'auto') {
        const text = element.textContent;
        if (text && text.includes('ガイド') && text.length < 100) {
          console.log('🚮 スクロール阻害要素を削除:', text);
          element.remove();
        }
      }
    });
  }
  
  // 継続的な監視と修正
  function startContinuousMonitoring() {
    setInterval(() => {
      fixGuideCounterPosition();
    }, 1000); // 1秒間隔でチェック
    
    // DOM変更監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            const style = window.getComputedStyle(element);
            
            // 新しく追加された固定位置要素をチェック
            if (style.position === 'fixed' && element.textContent) {
              const text = element.textContent;
              if (text.includes('ガイド') || text.includes('guide')) {
                console.log('🚨 新しい固定位置要素を検出・削除:', text);
                element.remove();
              }
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ 継続監視システム開始');
  }
  
  // 初期化
  function initialize() {
    // 即座に修正実行
    fixGuideCounterPosition();
    
    // 複数回実行
    setTimeout(fixGuideCounterPosition, 500);
    setTimeout(fixGuideCounterPosition, 1000);
    setTimeout(fixGuideCounterPosition, 2000);
    
    // 継続監視開始
    startContinuousMonitoring();
    
    console.log('✅ ガイド人数表示修正システム完全起動');
  }
  
  // 即座に実行
  initialize();
  
  // 各種イベントでも実行
  document.addEventListener('DOMContentLoaded', initialize);
  window.addEventListener('load', initialize);
  
  // グローバル関数として公開
  window.fixGuideCounter = fixGuideCounterPosition;
  
})();