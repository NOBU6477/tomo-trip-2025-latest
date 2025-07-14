/**
 * 完全スクロール診断システム - 多角的問題分析
 * あらゆる角度からスクロール阻害要因を特定
 */

(function() {
  'use strict';
  
  console.log('🔍 完全スクロール診断開始');
  
  // 1. CSS overflow 検出
  function detectCSSOverflowIssues() {
    console.log('📊 CSS overflow 分析中...');
    
    const problematicElements = [];
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const overflow = computedStyle.overflow;
      const overflowY = computedStyle.overflowY;
      
      if (overflow === 'hidden' || overflowY === 'hidden') {
        problematicElements.push({
          element: el,
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          overflow: overflow,
          overflowY: overflowY
        });
      }
    });
    
    console.log('⚠️ overflow:hidden 要素検出:', problematicElements.length);
    problematicElements.forEach(item => {
      console.log(`  - ${item.tagName}${item.id ? '#' + item.id : ''}${item.className ? '.' + item.className : ''}: overflow=${item.overflow}, overflowY=${item.overflowY}`);
    });
    
    return problematicElements;
  }
  
  // 2. JavaScript干渉検出
  function detectJavaScriptInterference() {
    console.log('🔧 JavaScript干渉分析中...');
    
    // setInterval/setTimeout の検出
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    
    let intervalCount = 0;
    let timeoutCount = 0;
    
    window.setInterval = function(...args) {
      intervalCount++;
      console.log(`🔄 setInterval #${intervalCount} 検出:`, args[0].toString().substring(0, 100));
      return originalSetInterval.apply(this, args);
    };
    
    window.setTimeout = function(...args) {
      timeoutCount++;
      console.log(`⏰ setTimeout #${timeoutCount} 検出:`, args[0].toString().substring(0, 100));
      return originalSetTimeout.apply(this, args);
    };
    
    // modal-open クラス監視
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (document.body.classList.contains('modal-open')) {
            console.log('🚨 modal-open クラス検出! 追加された場所を調査中...');
            console.trace('modal-open クラス追加スタックトレース');
          }
        }
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const newStyle = document.body.style.cssText;
          if (newStyle.includes('overflow') && newStyle.includes('hidden')) {
            console.log('🚨 body に overflow:hidden スタイル検出!', newStyle);
            console.trace('overflow:hidden 設定スタックトレース');
          }
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    console.log(`📊 Timer統計: setInterval=${intervalCount}, setTimeout=${timeoutCount}`);
  }
  
  // 3. 要素レベル阻害検出
  function detectElementLevelBlocking() {
    console.log('🎯 要素レベル阻害分析中...');
    
    // スクロール可能性チェック
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const bodyScrollHeight = document.body.scrollHeight;
    const bodyClientHeight = document.body.clientHeight;
    
    console.log('📏 スクロール寸法分析:');
    console.log(`  - document.scrollHeight: ${scrollHeight}`);
    console.log(`  - document.clientHeight: ${clientHeight}`);
    console.log(`  - body.scrollHeight: ${bodyScrollHeight}`);
    console.log(`  - body.clientHeight: ${bodyClientHeight}`);
    console.log(`  - window.innerHeight: ${window.innerHeight}`);
    
    const canScrollDocument = scrollHeight > clientHeight;
    const canScrollBody = bodyScrollHeight > bodyClientHeight;
    
    console.log(`📊 スクロール可能性: document=${canScrollDocument}, body=${canScrollBody}`);
    
    // 固定位置要素検出
    const fixedElements = [];
    document.querySelectorAll('*').forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
        fixedElements.push({
          element: el,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex,
          top: computedStyle.top,
          left: computedStyle.left,
          width: computedStyle.width,
          height: computedStyle.height
        });
      }
    });
    
    console.log('📌 固定位置要素検出:', fixedElements.length);
    fixedElements.forEach(item => {
      console.log(`  - ${item.element.tagName}: position=${item.position}, z-index=${item.zIndex}`);
    });
  }
  
  // 4. リアルタイム監視
  function setupRealTimeMonitoring() {
    console.log('👀 リアルタイム監視開始');
    
    let lastScrollY = window.scrollY;
    let scrollAttempts = 0;
    
    const monitoringInterval = setInterval(() => {
      // スクロール試行テスト
      const currentScrollY = window.scrollY;
      if (currentScrollY === lastScrollY && scrollAttempts < 3) {
        window.scrollTo(0, currentScrollY + 1);
        scrollAttempts++;
        
        setTimeout(() => {
          if (window.scrollY === currentScrollY) {
            console.log('🚨 スクロール阻害検出! 詳細分析実行中...');
            
            // 即座に詳細分析実行
            detectCSSOverflowIssues();
            detectElementLevelBlocking();
            
            // 強制修復試行
            attemptEmergencyFix();
          }
        }, 50);
      } else {
        scrollAttempts = 0;
      }
      
      lastScrollY = currentScrollY;
    }, 200);
    
    // 5秒後に一度停止
    setTimeout(() => {
      clearInterval(monitoringInterval);
      console.log('✅ リアルタイム監視完了');
    }, 5000);
  }
  
  // 5. 緊急修復試行
  function attemptEmergencyFix() {
    console.log('🛠️ 緊急修復試行中...');
    
    // 全てのoverflow:hiddenを強制解除
    document.querySelectorAll('*').forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.overflow === 'hidden' || computedStyle.overflowY === 'hidden') {
        el.style.overflow = 'visible !important';
        el.style.overflowY = 'auto !important';
        console.log(`🔧 修復: ${el.tagName}${el.id ? '#' + el.id : ''} overflow を visible に変更`);
      }
    });
    
    // body と html の強制設定
    document.body.style.cssText = 'overflow: auto !important; overflow-y: scroll !important; height: auto !important; min-height: 200vh !important;';
    document.documentElement.style.cssText = 'overflow: auto !important; overflow-y: scroll !important;';
    
    // modal-open クラス削除
    document.body.classList.remove('modal-open');
    
    // バックドロップ削除
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.style.display = 'none';
    });
    
    console.log('✅ 緊急修復完了');
  }
  
  // 初期化と実行
  function initialize() {
    console.log('🚀 完全スクロール診断システム初期化');
    
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runDiagnostics, 100);
      });
    } else {
      setTimeout(runDiagnostics, 100);
    }
  }
  
  function runDiagnostics() {
    console.log('📋 診断開始');
    
    detectCSSOverflowIssues();
    detectJavaScriptInterference();
    detectElementLevelBlocking();
    setupRealTimeMonitoring();
    
    console.log('📋 初期診断完了');
  }
  
  // 即座に開始
  initialize();
  
})();