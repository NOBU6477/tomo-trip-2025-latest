/**
 * 核心的スクロール問題解決
 * 全てのスクリプトとCSSを無効化してスクロールを確実に有効化
 */
(function() {
  'use strict';
  
  console.log('💥 核心的スクロール修正開始');
  
  // 全てのスタイルシートとスクリプトを調査・無効化
  function nuclearScrollFix() {
    console.log('💥 核心修正実行中...');
    
    // 1. 全てのCSSルールを調査してoverflow:hiddenを削除
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        if (sheet.cssRules) {
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            if (rule.style) {
              if (rule.style.overflow === 'hidden') {
                rule.style.overflow = 'visible';
                console.log('CSS overflow修正:', rule.selectorText);
              }
              if (rule.style.overflowY === 'hidden') {
                rule.style.overflowY = 'auto';
                console.log('CSS overflowY修正:', rule.selectorText);
              }
            }
          }
        }
      } catch(e) {
        // CORS制限などで読めないスタイルシートは無視
      }
    }
    
    // 2. DOM要素の直接修正
    const elementsToFix = [document.body, document.documentElement];
    elementsToFix.forEach(element => {
      // 全ての関連属性を削除
      element.style.overflow = '';
      element.style.overflowY = '';
      element.style.overflowX = '';
      element.style.height = '';
      element.style.maxHeight = '';
      element.style.minHeight = '';
      element.style.position = '';
      element.style.paddingRight = '';
      
      // クラスを削除
      element.classList.remove('modal-open', 'no-scroll', 'overflow-hidden');
      
      // 新しいスタイルを強制適用
      element.setAttribute('style', 'overflow: visible !important; overflow-y: auto !important; height: auto !important;');
    });
    
    // 3. Modal関連要素の完全削除
    document.querySelectorAll('.modal-backdrop, .modal-open').forEach(el => {
      el.remove();
    });
    
    // 4. すべてのモーダルを強制的に閉じる
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    });
    
    console.log('✅ 核心修正完了');
  }
  
  // 言語切り替え関数を完全に置き換え
  function replaceLanguageFunction() {
    // 既存の関数を保存
    const originalSwitch = window.forceLanguageSwitch;
    
    window.forceLanguageSwitch = function(lang) {
      console.log('🌐 スクロール保護付き言語切り替え:', lang);
      
      // 事前修正
      nuclearScrollFix();
      
      // 元の処理があれば実行
      if (originalSwitch) {
        try {
          originalSwitch.call(this, lang);
        } catch(e) {
          console.log('元の言語切り替えでエラー:', e);
        }
      }
      
      // 処理後の継続修正
      [10, 50, 100, 200, 500, 1000, 2000, 3000].forEach(delay => {
        setTimeout(nuclearScrollFix, delay);
      });
      
      return true;
    };
    
    console.log('✅ 言語切り替え関数置き換え完了');
  }
  
  // MutationObserverでリアルタイム監視
  function setupRealTimeMonitoring() {
    const observer = new MutationObserver(function(mutations) {
      let needsFix = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (target === document.body || target === document.documentElement) {
            const overflow = window.getComputedStyle(target).overflow;
            const overflowY = window.getComputedStyle(target).overflowY;
            
            if (overflow === 'hidden' || overflowY === 'hidden') {
              needsFix = true;
            }
            
            if (target.classList.contains('modal-open')) {
              needsFix = true;
            }
          }
        }
      });
      
      if (needsFix) {
        console.log('🚨 リアルタイム修正実行');
        nuclearScrollFix();
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false
    });
    
    console.log('📡 リアルタイム監視開始');
  }
  
  // 定期的な強制修正
  function setupPeriodicFix() {
    setInterval(() => {
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const bodyOverflowY = window.getComputedStyle(document.body).overflowY;
      
      if (bodyOverflow === 'hidden' || bodyOverflowY === 'hidden' || document.body.classList.contains('modal-open')) {
        console.log('⏰ 定期修正実行');
        nuclearScrollFix();
      }
    }, 1000); // 1秒ごとにチェック
  }
  
  // グローバル関数として公開
  window.nuclearScrollFix = nuclearScrollFix;
  window.forceScrollDebug = function() {
    console.log('=== スクロール状態詳細 ===');
    console.log('body overflow:', window.getComputedStyle(document.body).overflow);
    console.log('body overflowY:', window.getComputedStyle(document.body).overflowY);
    console.log('body height:', window.getComputedStyle(document.body).height);
    console.log('body classes:', document.body.className);
    console.log('html overflow:', window.getComputedStyle(document.documentElement).overflow);
    console.log('modal-backdrop数:', document.querySelectorAll('.modal-backdrop').length);
    console.log('========================');
    
    // 即座に修正実行
    nuclearScrollFix();
  };
  
  // 初期化
  function initialize() {
    console.log('💥 核心的スクロール修正システム初期化');
    
    // 即座に修正実行
    nuclearScrollFix();
    
    // 言語切り替え関数置き換え
    replaceLanguageFunction();
    
    // リアルタイム監視開始
    setupRealTimeMonitoring();
    
    // 定期修正開始
    setupPeriodicFix();
    
    // 遅延修正も実行
    setTimeout(nuclearScrollFix, 100);
    setTimeout(nuclearScrollFix, 500);
    
    console.log('✅ 核心的修正システム準備完了');
    console.log('デバッグ用: forceScrollDebug() を実行してください');
  }
  
  // 即座に初期化
  initialize();
  
})();