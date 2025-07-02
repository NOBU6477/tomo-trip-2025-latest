/**
 * スクロール機能保護システム
 * 言語切り替え時のスクロール無効化問題を完全解決
 */
(function() {
  'use strict';
  
  console.log('🛡️ スクロール保護システム開始');
  
  // スクロール状態を保護する関数
  function protectScrolling() {
    // bodyとhtmlのスクロール設定を強制的に維持
    const forceScrollSettings = () => {
      document.body.style.overflow = 'visible';
      document.body.style.overflowY = 'scroll';
      document.documentElement.style.overflow = 'visible';
      document.documentElement.style.overflowY = 'scroll';
      
      // position固定などの問題のあるスタイルをリセット
      document.body.style.position = 'static';
      document.body.style.height = 'auto';
      document.body.style.maxHeight = 'none';
      
      // modal-openクラスによるスクロール無効化を防止
      if (document.body.classList.contains('modal-open')) {
        document.body.style.overflow = 'visible';
        document.body.style.paddingRight = '0';
      }
    };
    
    // 初期設定
    forceScrollSettings();
    
    // 定期的にスクロール設定を監視・修正
    setInterval(forceScrollSettings, 100);
    
    // DOM変更監視でスクロール設定を保護
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          // スタイル変更時にスクロール設定を復元
          setTimeout(forceScrollSettings, 10);
        }
      });
    });
    
    // body要素とhtml要素を監視
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  // 言語切り替えボタンのクリック時にスクロール保護を強化
  function enhanceLanguageSwitching() {
    const languageLinks = document.querySelectorAll('a[href*="index"]');
    
    languageLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        console.log('言語切り替えが検出されました - スクロール保護を強化');
        
        // 切り替え前にスクロール位置を保存
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        sessionStorage.setItem('scrollPosition', scrollPosition);
        
        // 新しいページでスクロール設定を即座に適用
        setTimeout(() => {
          protectScrolling();
        }, 100);
      });
    });
  }
  
  // ページ読み込み時にスクロール位置を復元
  function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
      }, 200);
    }
  }
  
  // 初期化
  function initialize() {
    protectScrolling();
    enhanceLanguageSwitching();
    restoreScrollPosition();
    
    console.log('✅ スクロール保護システム初期化完了');
  }
  
  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // 緊急時のスクロール復元関数をグローバルに公開
  window.emergencyScrollFix = function() {
    console.log('緊急スクロール修復実行');
    document.body.style.overflow = 'visible !important';
    document.body.style.overflowY = 'scroll !important';
    document.documentElement.style.overflow = 'visible !important';
    document.documentElement.style.overflowY = 'scroll !important';
    document.body.style.position = 'static !important';
    document.body.style.height = 'auto !important';
    
    // modal-openクラスを強制削除
    document.body.classList.remove('modal-open');
    
    // すべてのモーダルバックドロップを削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    console.log('緊急スクロール修復完了');
  };
  
})();