/**
 * Bootstrap Modal によるスクロール無効化問題の根本修正
 * modal-open クラスの自動削除とoverflow設定の強制リセット
 */
(function() {
  'use strict';
  
  console.log('🛠️ Bootstrap Modal スクロール修正システム開始');
  
  // modal-open クラスの監視と自動削除
  function setupModalOpenWatcher() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (document.body.classList.contains('modal-open')) {
            console.log('⚠️ modal-open クラス検出 - 削除中');
            document.body.classList.remove('modal-open');
            
            // overflow設定も強制リセット
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            console.log('✅ modal-open クラス削除完了');
          }
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    console.log('modal-open 監視開始');
  }
  
  // Bootstrap Modal 関連のCSS上書き
  function overrideBootstrapModalCSS() {
    const style = document.createElement('style');
    style.id = 'modal-scroll-fix';
    style.textContent = `
      /* Bootstrap Modal のスクロール無効化を強制的に解除 */
      body.modal-open {
        overflow: visible !important;
        padding-right: 0 !important;
      }
      
      /* 全ての要素のoverflow:hiddenを防止 */
      body {
        overflow-y: auto !important;
      }
      
      html {
        overflow-y: auto !important;
      }
      
      /* modal-backdrop の干渉を防止 */
      .modal-backdrop {
        display: none !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Modal CSS上書き完了');
  }
  
  // 言語切り替え後の強制修正
  function setupLanguageSwitchFix() {
    // 既存の言語切り替え関数をフック
    const originalForceLanguageSwitch = window.forceLanguageSwitch;
    
    if (originalForceLanguageSwitch) {
      window.forceLanguageSwitch = function(lang) {
        console.log('言語切り替え検出:', lang);
        
        // 元の処理実行
        originalForceLanguageSwitch(lang);
        
        // 言語切り替え完了後に修正実行
        setTimeout(() => {
          console.log('言語切り替え完了 - スクロール修正実行');
          forceRemoveModalRestrictions();
        }, 500);
        
        // 追加の安全策として複数回実行
        setTimeout(() => {
          forceRemoveModalRestrictions();
        }, 1000);
        
        setTimeout(() => {
          forceRemoveModalRestrictions();
        }, 2000);
      };
    }
  }
  
  // Modal制限の強制削除
  function forceRemoveModalRestrictions() {
    console.log('Modal制限強制削除実行');
    
    // modal-open クラス削除
    document.body.classList.remove('modal-open');
    
    // overflow設定リセット
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
    
    // modal-backdrop削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      backdrop.remove();
      console.log('backdrop削除:', backdrop);
    });
    
    // 高さ制限解除
    document.body.style.height = '';
    document.body.style.maxHeight = '';
    
    // position問題解決
    document.body.style.position = '';
    
    console.log('✅ Modal制限削除完了');
  }
  
  // グローバル関数として公開
  window.forceRemoveModalRestrictions = forceRemoveModalRestrictions;
  
  // 初期化
  function initialize() {
    // CSS上書きを最初に実行
    overrideBootstrapModalCSS();
    
    // modal-open監視開始
    setupModalOpenWatcher();
    
    // 言語切り替えフック設定
    setupLanguageSwitchFix();
    
    // 初期状態でも修正実行
    setTimeout(forceRemoveModalRestrictions, 100);
    
    console.log('✅ Bootstrap Modal スクロール修正システム初期化完了');
  }
  
  // DOM準備完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();