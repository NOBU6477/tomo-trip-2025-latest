/**
 * モバイル専用ナビゲーション修正スクリプト
 * モバイル環境のスクロールやUI挙動を大幅に改善
 */
(function() {
  // モバイルデバイスかどうかを判定
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // モバイルデバイスでない場合は実行しない
  if (!isMobile) return;
  
  // DOMの準備ができたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // モバイル画面専用の調整
    initMobileUI();
    
    // 特定の問題に対処
    fixCommonMobileIssues();
    
    // ナビゲーションメニューの挙動を修正
    fixNavbarBehavior();
    
    // フォーカストラップ問題の修正（キーボードフォーカスが閉じたモーダル内に残る問題）
    fixFocusTrapIssues();
    
    // 一部のブラウザでボタンクリックが効かない問題を修正
    enhanceTouchActions();
  });

  /**
   * モバイルUI全般の調整
   */
  function initMobileUI() {
    // フォントサイズを少し大きく
    document.documentElement.style.fontSize = '16px';
    
    // タップターゲットを拡大
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    buttons.forEach(function(button) {
      button.style.minHeight = '44px';
      button.style.minWidth = '44px';
    });
    
    // 入力フィールドを拡大
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
      input.style.minHeight = '44px';
      input.style.fontSize = '16px'; // iOSでズームインを防止
    });
    
    // スクロール問題の修正
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // iOSのバウンススクロールを維持しつつ慣性スクロールを追加
    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
        overscroll-behavior-y: none;
      }
      
      .modal {
        -webkit-overflow-scrolling: touch;
      }
      
      /* タップハイライトの調整 */
      a, button, .btn, [role="button"] {
        -webkit-tap-highlight-color: rgba(0,0,0,0.1);
      }
      
      /* モバイルでのホバー効果を無効化 */
      @media (hover: none) {
        .btn:hover, a:hover, .nav-link:hover {
          opacity: 1 !important;
          transform: none !important;
          background: none !important;
          box-shadow: none !important;
        }
      }
      
      /* アクティブ状態の強調 */
      .btn:active, a:active, .nav-link:active {
        opacity: 0.8 !important;
        transform: scale(0.98) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 一般的なモバイル問題の修正
   */
  function fixCommonMobileIssues() {
    // iOSでのスクロール固定問題（モーダル開閉時）
    const scrollFixer = function() {
      // スクロール位置を記録
      const scrollY = window.scrollY;
      
      // モーダルが開いているかチェック
      const isModalOpen = document.body.classList.contains('modal-open');
      
      if (isModalOpen) {
        // モーダルが開いている場合、bodyを固定してスクロール位置を維持
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
      } else {
        // モーダルが閉じられた場合、元の位置にスクロール
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      }
    };
    
    // モーダルイベントを監視
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach(function(modal) {
      modal.addEventListener('shown.bs.modal', scrollFixer);
      modal.addEventListener('hidden.bs.modal', scrollFixer);
    });
    
    // 慣性スクロールの修正（特にiOS）
    const scrollableElements = document.querySelectorAll('.modal-body, .overflow-auto, [style*="overflow-y: auto"]');
    scrollableElements.forEach(function(element) {
      element.style.webkitOverflowScrolling = 'touch';
    });
  }

  /**
   * ナビゲーションメニューの挙動修正
   */
  function fixNavbarBehavior() {
    // ナビゲーションの高さを考慮したスクロール調整
    const navbar = document.querySelector('.navbar.fixed-top');
    if (navbar) {
      // ページコンテンツにパディングを追加
      document.body.style.paddingTop = (navbar.offsetHeight + 5) + 'px';
      
      // ナビゲーションの影を追加して視認性を向上
      navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    // ハンバーガーメニューの修正
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
      // ハンバーガーメニュークリック時の振る舞いを修正
      navbarToggler.addEventListener('click', function() {
        // 少し遅延させてアニメーションを滑らかに
        setTimeout(function() {
          // メニューが開いているか確認
          const isOpen = navbarCollapse.classList.contains('show');
          
          // 開いている場合は背景をスクロール不可に
          if (isOpen) {
            document.body.classList.add('overflow-hidden');
          } else {
            document.body.classList.remove('overflow-hidden');
          }
        }, 50);
      });
      
      // メニュー内のリンククリック時に自動的に閉じる
      const navLinks = navbarCollapse.querySelectorAll('.nav-link');
      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          // Bootstrapのコラプス機能を使用して閉じる
          if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
          }
        });
      });
    }
  }

  /**
   * フォーカストラップ問題の修正
   */
  function fixFocusTrapIssues() {
    // モーダルが閉じられたときのフォーカス問題を修正
    document.addEventListener('hidden.bs.modal', function() {
      // 次のフレームでbodyにフォーカスを移動して安全に解放
      setTimeout(function() {
        document.body.setAttribute('tabindex', '-1');
        document.body.focus();
        document.body.removeAttribute('tabindex');
      }, 50);
    }, true);
  }

  /**
   * タッチアクション強化
   */
  function enhanceTouchActions() {
    // クリックイベントが効かない要素にタッチイベントを追加
    const clickableElements = document.querySelectorAll('button, .btn, a, [role="button"], input[type="submit"]');
    
    clickableElements.forEach(function(element) {
      // タッチスタート時の処理
      element.addEventListener('touchstart', function(e) {
        element.classList.add('touch-active');
      }, { passive: true });
      
      // タッチ終了時の処理
      element.addEventListener('touchend', function(e) {
        element.classList.remove('touch-active');
        
        // Safari対策：遅延クリック
        setTimeout(function() {
          // クリックイベントを手動でディスパッチ
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          element.dispatchEvent(clickEvent);
        }, 10);
      }, { passive: false });
    });
    
    // CSSでタッチアクティブ状態のスタイルを定義
    const touchStyle = document.createElement('style');
    touchStyle.innerHTML = `
      .touch-active {
        opacity: 0.8 !important;
        transform: scale(0.98) !important;
      }
    `;
    document.head.appendChild(touchStyle);
  }
})();