/**
 * 核レベルのスクロール解決策
 * 横スクロール完全阻止、上下スクロール完全有効化
 * 協賛店の右から左へのアニメーション完全維持
 */

(function() {
  'use strict';

  console.log('核レベルスクロール解決システム開始');

  // 核レベルCSS注入
  function injectNuclearCSS() {
    const style = document.createElement('style');
    style.id = 'nuclear-scroll-fix';
    style.textContent = `
      /* 核レベル横スクロール完全阻止 */
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        max-width: 100vw !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      
      /* 全要素の横幅制限 */
      * {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      
      /* 協賛店バナーのみ例外 */
      .sponsor-banner {
        overflow: hidden !important;
        position: relative !important;
        white-space: nowrap !important;
      }
      
      .sponsor-scroll {
        display: inline-block !important;
        white-space: nowrap !important;
        animation: scrollRight 30s linear infinite !important;
      }
      
      .sponsor-item {
        display: inline-block !important;
        white-space: nowrap !important;
      }
      
      /* その他要素は横スクロール完全阻止 */
      .container, .container-fluid, .row, [class*="col-"] {
        max-width: 100% !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
      }
      
      /* モーダル時も横スクロール阻止 */
      .modal-open {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        padding-right: 0 !important;
      }
      
      /* Bootstrap関連 */
      .modal-backdrop {
        display: none !important;
      }
      
      /* 画像要素の制限 */
      img, video, iframe {
        max-width: 100% !important;
        height: auto !important;
      }
    `;
    
    // 既存のstyleがあれば削除
    const existingStyle = document.getElementById('nuclear-scroll-fix');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    console.log('核レベルCSS注入完了');
  }

  // 核レベルDOM修正
  function nuclearDOMFix() {
    // HTML要素の直接修正
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.maxWidth = '100vw';
    document.documentElement.style.width = '100%';
    
    // Body要素の直接修正
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.body.style.maxWidth = '100%';
    document.body.style.width = '100%';
    document.body.style.minHeight = '100vh';
    
    // 全要素の強制修正
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      // 協賛店関連要素は除外
      if (element.classList.contains('sponsor-banner') || 
          element.classList.contains('sponsor-scroll') ||
          element.classList.contains('sponsor-item') ||
          element.closest('.sponsor-banner')) {
        return;
      }
      
      // 横幅制限を強制適用
      if (element.getBoundingClientRect().width > window.innerWidth) {
        element.style.maxWidth = '100%';
        element.style.overflowX = 'hidden';
        element.style.boxSizing = 'border-box';
      }
    });
    
    console.log('核レベルDOM修正完了');
  }

  // 核レベルイベント除去
  function removeScrollEvents() {
    // 横スクロールイベントを無効化
    document.addEventListener('wheel', function(e) {
      if (e.deltaX !== 0 && !e.target.closest('.sponsor-banner')) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // タッチスクロールの横方向を無効化
    document.addEventListener('touchmove', function(e) {
      if (!e.target.closest('.sponsor-banner')) {
        // 横スクロールを防ぐ
        const touch = e.touches[0];
        if (touch && Math.abs(touch.clientX - (touch.startX || 0)) > Math.abs(touch.clientY - (touch.startY || 0))) {
          e.preventDefault();
        }
      }
    }, { passive: false });
    
    console.log('核レベルイベント制御完了');
  }

  // 核レベル継続監視
  function nuclearMonitoring() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          setTimeout(() => {
            nuclearDOMFix();
          }, 50);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // 高頻度監視
    setInterval(() => {
      nuclearDOMFix();
    }, 50);

    console.log('核レベル監視システム開始');
  }

  // 核レベル初期化
  function nuclearInit() {
    injectNuclearCSS();
    nuclearDOMFix();
    removeScrollEvents();
    nuclearMonitoring();
    
    console.log('核レベルスクロール解決システム完了');
  }

  // 即座に実行
  nuclearInit();

  // DOM読み込み後にも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', nuclearInit);
  }

  // ウィンドウリサイズ時
  window.addEventListener('resize', nuclearDOMFix);

  // モーダルイベント
  document.addEventListener('show.bs.modal', function() {
    setTimeout(nuclearDOMFix, 100);
  });

  document.addEventListener('hidden.bs.modal', function() {
    setTimeout(nuclearDOMFix, 100);
  });

})();