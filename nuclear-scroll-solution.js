/**
 * 核爆級スクロール解決システム
 * 全てのスクロール阻害要素を強制的に除去・修正
 */
(function() {
  'use strict';
  
  console.log('💥 核爆級スクロール解決開始');
  
  // 即座に実行する核攻撃レベルの修復
  function nuclearScrollFix() {
    console.log('🚀 核攻撃レベル修復実行');
    
    // 1. 全てのCSS設定をリセット
    document.body.style.cssText = '';
    document.documentElement.style.cssText = '';
    
    // 2. 問題のあるクラスを削除
    document.body.classList.remove('modal-open');
    document.body.className = document.body.className.replace(/modal-\w+/g, '');
    
    // 3. 核レベルのCSS強制適用
    const nuclearStyle = document.createElement('style');
    nuclearStyle.id = 'nuclear-scroll-fix';
    nuclearStyle.innerHTML = `
      html {
        overflow: auto !important;
        overflow-y: auto !important;
        height: auto !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      body {
        overflow: auto !important;
        overflow-y: auto !important;
        height: auto !important;
        min-height: 100vh !important;
        max-height: none !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        padding-right: 0 !important;
        transform: none !important;
      }
      
      /* 全てのモーダル関連設定を無力化 */
      .modal-open {
        overflow: auto !important;
        padding-right: 0 !important;
      }
      
      .modal-backdrop {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* 問題のある固定要素を修正 */
      [style*="overflow: hidden"] {
        overflow: auto !important;
      }
      
      [style*="height: 100vh"] {
        height: auto !important;
      }
      
      /* ページ全体のコンテナを修正 */
      .container, .container-fluid, main, #app {
        position: static !important;
        overflow: visible !important;
        height: auto !important;
      }
    `;
    
    // 既存の同IDスタイルを削除
    const existingStyle = document.getElementById('nuclear-scroll-fix');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // head要素の最初に挿入して最高優先度を確保
    document.head.insertBefore(nuclearStyle, document.head.firstChild);
    
    // 4. 直接的なスタイル適用
    setTimeout(() => {
      document.body.style.overflow = 'auto';
      document.body.style.overflowY = 'auto';
      document.body.style.height = 'auto';
      document.body.style.position = 'static';
      document.body.style.paddingRight = '0px';
      
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    }, 10);
    
    console.log('✅ 核攻撃レベル修復完了');
  }
  
  // 連続監視・修復システム
  function startNuclearMonitoring() {
    // 高頻度監視
    setInterval(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const htmlStyle = window.getComputedStyle(document.documentElement);
      
      // overflow:hiddenの強制修復
      if (bodyStyle.overflow === 'hidden' || bodyStyle.overflowY === 'hidden') {
        document.body.style.overflow = 'auto';
        document.body.style.overflowY = 'auto';
        console.log('🔧 body overflow修復');
      }
      
      if (htmlStyle.overflow === 'hidden' || htmlStyle.overflowY === 'hidden') {
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.overflowY = 'auto';
        console.log('🔧 html overflow修復');
      }
      
      // height:100vhの強制修復
      if (bodyStyle.height === '100vh' || document.body.style.height === '100vh') {
        document.body.style.height = 'auto';
        console.log('🔧 height修復');
      }
      
      // position:fixedの問題修復
      if (bodyStyle.position === 'fixed') {
        document.body.style.position = 'static';
        console.log('🔧 position修復');
      }
      
      // modal-openクラスの自動除去
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '0px';
        console.log('🔧 modal-open除去');
      }
      
    }, 50); // 50ms間隔の超高頻度監視
  }
  
  // DOM変更監視
  function startDOMMonitoring() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          
          if (mutation.target === document.body || mutation.target === document.documentElement) {
            // 重要な要素の変更時は即座に修復
            setTimeout(nuclearScrollFix, 10);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('✅ DOM監視開始');
  }
  
  // 初期化
  function initialize() {
    // 即座に修復
    nuclearScrollFix();
    
    // 複数回修復実行
    setTimeout(nuclearScrollFix, 100);
    setTimeout(nuclearScrollFix, 300);
    setTimeout(nuclearScrollFix, 500);
    setTimeout(nuclearScrollFix, 1000);
    
    // 監視システム開始
    startNuclearMonitoring();
    startDOMMonitoring();
    
    console.log('✅ 核爆級スクロール解決システム完全起動');
  }
  
  // 即座に実行
  initialize();
  
  // 各種イベントでも実行
  document.addEventListener('DOMContentLoaded', initialize);
  window.addEventListener('load', initialize);
  
  // グローバル関数として公開
  window.nuclearScrollFix = nuclearScrollFix;
  window.forceScrollRepair = function() {
    console.log('🚨 緊急スクロール修復実行');
    nuclearScrollFix();
    
    // スクロール可能性をテスト
    setTimeout(() => {
      const canScroll = document.body.scrollHeight > window.innerHeight;
      console.log('スクロール可能:', canScroll);
      console.log('body.scrollHeight:', document.body.scrollHeight);
      console.log('window.innerHeight:', window.innerHeight);
      
      if (canScroll) {
        console.log('✅ スクロール修復成功');
      } else {
        console.log('⚠️ コンテンツが不足している可能性');
      }
    }, 100);
  };
  
})();