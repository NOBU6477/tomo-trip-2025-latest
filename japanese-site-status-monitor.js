/**
 * 日本語サイト状態監視システム
 * 問題の早期発見と自動修正
 */

(function() {
  'use strict';
  
  let monitoringActive = false;
  
  function startMonitoring() {
    if (monitoringActive) return;
    monitoringActive = true;
    
    console.log('🔍 日本語サイト状態監視開始');
    
    // 定期チェック実行
    setInterval(performStatusCheck, 5000); // 5秒間隔
    
    // DOM変更監視
    const observer = new MutationObserver(handleDOMChanges);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  function performStatusCheck() {
    checkRegistrationButtons();
    checkFilterStates();
    checkGuideCountAccuracy();
  }
  
  function checkRegistrationButtons() {
    // Sign Up系テキストの監視
    const problematicTexts = ['Sign Up', 'Register'];
    const elements = document.querySelectorAll('button, a, .btn');
    
    elements.forEach(element => {
      const text = element.textContent.trim();
      if (problematicTexts.some(problem => text.includes(problem))) {
        console.log('🚨 英語ボタン検出 - 修正実行:', text);
        element.textContent = element.textContent
          .replace(/Sign Up/g, '新規登録')
          .replace(/Register/g, '新規登録');
      }
    });
  }
  
  function checkFilterStates() {
    const filters = [
      { id: 'location-filter', name: 'location' },
      { id: 'language-filter', name: 'language' },
      { id: 'fee-filter', name: 'fee' }
    ];
    
    filters.forEach(filter => {
      const element = document.getElementById(filter.id) || 
                     document.querySelector(`[name="${filter.name}"]`);
      
      if (element && element.value === '') {
        // フィルターが意図せずリセットされた場合
        const savedState = localStorage.getItem('currentFilters');
        if (savedState) {
          try {
            const saved = JSON.parse(savedState);
            if (saved[filter.name] && saved[filter.name] !== 'all') {
              console.log(`🔧 フィルター復元: ${filter.name} = ${saved[filter.name]}`);
              element.value = saved[filter.name];
            }
          } catch (e) {
            // ignore
          }
        }
      }
    });
  }
  
  function checkGuideCountAccuracy() {
    const counters = document.querySelectorAll('[id*="counter"], [class*="counter"]');
    const visibleCards = document.querySelectorAll('.guide-card:not(.d-none), .guide-item:not(.d-none)');
    
    if (counters.length > 0 && visibleCards.length > 0) {
      const actualCount = visibleCards.length;
      
      counters.forEach(counter => {
        const counterText = counter.textContent;
        const match = counterText.match(/(\d+)人のガイド/);
        
        if (match) {
          const displayedCount = parseInt(match[1]);
          if (displayedCount !== actualCount) {
            console.log(`🔧 カウンター修正: ${displayedCount} → ${actualCount}`);
            counter.textContent = `${actualCount}人のガイドが見つかりました`;
          }
        }
      });
    }
  }
  
  function handleDOMChanges(mutations) {
    let needsCheck = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 新しく追加された要素をチェック
            if (node.textContent && 
                (node.textContent.includes('Sign Up') || 
                 node.textContent.includes('Register'))) {
              needsCheck = true;
            }
          }
        });
      }
      
      if (mutation.type === 'characterData') {
        if (mutation.target.nodeValue && 
            (mutation.target.nodeValue.includes('Sign Up') || 
             mutation.target.nodeValue.includes('Register'))) {
          needsCheck = true;
        }
      }
    });
    
    if (needsCheck) {
      setTimeout(performStatusCheck, 100);
    }
  }
  
  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMonitoring);
  } else {
    startMonitoring();
  }
  
})();