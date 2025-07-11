/**
 * 完全スクロール修正システム
 * すべてのスクロール問題を解決する統合ソリューション
 */

(function() {
  'use strict';

  // 1. 即座にスクロールを有効化
  function enableScrollImmediately() {
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        overflow: auto !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        height: auto !important;
        max-height: none !important;
        position: static !important;
      }
      
      .modal-open {
        overflow: auto !important;
        padding-right: 0 !important;
      }
      
      .modal-backdrop {
        position: fixed !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Bootstrap modal の干渉を防止
  function preventModalInterference() {
    // Bootstrapのモーダル関連のクラス変更を監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const body = document.body;
          if (body.classList.contains('modal-open')) {
            body.style.overflow = 'auto';
            body.style.paddingRight = '0';
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  // 3. 連続監視システム
  function startContinuousMonitoring() {
    setInterval(function() {
      // body要素のスクロール状態を監視
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'auto';
      }
      
      // html要素のスクロール状態を監視
      if (document.documentElement.style.overflow === 'hidden') {
        document.documentElement.style.overflow = 'auto';
      }
      
      // position: fixedを解除
      if (document.body.style.position === 'fixed') {
        document.body.style.position = 'static';
      }
    }, 50); // 50ミリ秒間隔で監視
  }

  // 4. イベントリスナーでの修正
  function setupEventListeners() {
    // すべてのモーダル関連イベントを監視
    document.addEventListener('show.bs.modal', function() {
      setTimeout(function() {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      }, 10);
    });

    document.addEventListener('shown.bs.modal', function() {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    });

    document.addEventListener('hide.bs.modal', function() {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    });

    document.addEventListener('hidden.bs.modal', function() {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    });
  }

  // 5. 強制スクロール復元関数
  window.forceEnableScroll = function() {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.classList.remove('modal-open');
    console.log('スクロールを強制的に有効化しました');
  };

  // 6. 初期化
  function initialize() {
    enableScrollImmediately();
    preventModalInterference();
    startContinuousMonitoring();
    setupEventListeners();
    
    console.log('✅ 完全スクロール修正システム初期化完了');
  }

  // ページ読み込み状態に関係なく即座に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // さらに安全のため、少し遅れて再実行
  setTimeout(initialize, 100);
  setTimeout(initialize, 500);

})();