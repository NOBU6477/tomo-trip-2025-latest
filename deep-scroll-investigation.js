/**
 * 深層スクロール問題調査スクリプト
 * 英語翻訳時のスクロール無効化の根本原因を特定
 */
(function() {
  'use strict';
  
  console.log('🔬 深層スクロール調査開始');
  
  // 全てのCSSルールを調査
  function investigateAllCSSRules() {
    console.log('=== CSS調査開始 ===');
    
    const problematicRules = [];
    
    // 全てのスタイルシートを調査
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        if (sheet.cssRules) {
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            if (rule.style && rule.style.overflow === 'hidden') {
              problematicRules.push({
                selector: rule.selectorText,
                overflow: rule.style.overflow,
                sheet: sheet.href || 'inline'
              });
            }
          }
        }
      } catch(e) {
        console.log('CSS調査エラー:', e);
      }
    }
    
    console.log('overflow:hiddenルール:', problematicRules);
    return problematicRules;
  }
  
  // 言語切り替え前後のDOM状態を比較
  function comparePrePostTranslation() {
    console.log('=== 翻訳前後比較 ===');
    
    const beforeState = {
      bodyOverflow: window.getComputedStyle(document.body).overflow,
      bodyHeight: window.getComputedStyle(document.body).height,
      bodyPosition: window.getComputedStyle(document.body).position,
      scrollHeight: document.body.scrollHeight,
      clientHeight: document.body.clientHeight,
      windowHeight: window.innerHeight
    };
    
    console.log('翻訳前の状態:', beforeState);
    
    // 翻訳実行
    if (typeof window.forceLanguageSwitch === 'function') {
      window.forceLanguageSwitch('en');
      
      setTimeout(() => {
        const afterState = {
          bodyOverflow: window.getComputedStyle(document.body).overflow,
          bodyHeight: window.getComputedStyle(document.body).height,
          bodyPosition: window.getComputedStyle(document.body).position,
          scrollHeight: document.body.scrollHeight,
          clientHeight: document.body.clientHeight,
          windowHeight: window.innerHeight
        };
        
        console.log('翻訳後の状態:', afterState);
        
        // 変更点を特定
        const changes = {};
        Object.keys(beforeState).forEach(key => {
          if (beforeState[key] !== afterState[key]) {
            changes[key] = {
              before: beforeState[key],
              after: afterState[key]
            };
          }
        });
        
        console.log('変更された項目:', changes);
        
        // 問題を修正
        if (afterState.bodyOverflow === 'hidden') {
          console.log('🚨 overflow:hidden検出 - 強制修正');
          document.body.style.overflow = 'visible';
        }
        
      }, 2000);
    }
  }
  
  // イベントリスナーの競合調査
  function investigateEventListeners() {
    console.log('=== イベントリスナー調査 ===');
    
    const listeners = [];
    
    // bodyのイベントリスナーを調査
    const bodyEvents = ['scroll', 'wheel', 'touchmove', 'touchstart', 'touchend'];
    bodyEvents.forEach(eventType => {
      const hasListener = document.body.addEventListener ? true : false;
      listeners.push({
        element: 'body',
        eventType: eventType,
        hasListener: hasListener
      });
    });
    
    console.log('イベントリスナー状況:', listeners);
    
    // preventDefaultが呼ばれているかチェック
    const originalPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function() {
      console.log('preventDefault呼び出し:', this.type, this.target);
      originalPreventDefault.call(this);
    };
  }
  
  // モーダルやオーバーレイの影響調査
  function investigateModalInterference() {
    console.log('=== モーダル・オーバーレイ調査 ===');
    
    // 見えないモーダルや背景要素を調査
    const overlays = document.querySelectorAll('.modal, .overlay, [style*="position: fixed"], [style*="position: absolute"]');
    
    overlays.forEach((overlay, index) => {
      const computed = window.getComputedStyle(overlay);
      console.log(`オーバーレイ ${index}:`, {
        element: overlay,
        display: computed.display,
        visibility: computed.visibility,
        position: computed.position,
        zIndex: computed.zIndex,
        overflow: computed.overflow
      });
    });
    
    // Bootstrap modal backdrop の確認
    const backdrops = document.querySelectorAll('.modal-backdrop');
    console.log('Bootstrap modal backdrop:', backdrops.length);
    
    backdrops.forEach((backdrop, index) => {
      console.log(`Backdrop ${index}:`, {
        display: window.getComputedStyle(backdrop).display,
        position: window.getComputedStyle(backdrop).position
      });
    });
  }
  
  // 全調査を実行
  window.runDeepScrollInvestigation = function() {
    console.log('🔬 深層調査開始');
    investigateAllCSSRules();
    investigateEventListeners();
    investigateModalInterference();
    console.log('🔬 深層調査完了');
  };
  
  // 比較調査を実行
  window.runTranslationComparison = function() {
    console.log('📊 翻訳前後比較開始');
    comparePrePostTranslation();
  };
  
  // 緊急修復機能
  window.emergencyScrollFix = function() {
    console.log('🚨 緊急スクロール修復実行');
    
    // 全ての可能性のある問題を修正
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
    
    // 高さ制限解除
    document.body.style.height = '';
    document.body.style.maxHeight = '';
    document.body.style.minHeight = '';
    
    // position問題解決
    document.body.style.position = '';
    
    // touch-action問題解決
    document.body.style.touchAction = '';
    
    // Bootstrap modal body class を削除
    document.body.classList.remove('modal-open');
    
    // 見えないbackdropを削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // 強制的にスクロールイベントを再有効化
    document.body.style.pointerEvents = '';
    
    console.log('✅ 緊急修復完了');
  };
  
  console.log('🔬 深層調査システム準備完了');
  console.log('利用可能な関数:');
  console.log('- runDeepScrollInvestigation() : 包括的調査');
  console.log('- runTranslationComparison() : 翻訳前後比較');
  console.log('- emergencyScrollFix() : 緊急修復');
  
  // 自動的に初期調査実行
  setTimeout(() => {
    window.runDeepScrollInvestigation();
  }, 1000);
  
})();