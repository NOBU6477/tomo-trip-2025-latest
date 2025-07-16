/**
 * モバイルクリーンアップ修正
 * 1. グラデーション協賛店ボタンを削除
 * 2. タイトルにかかっているロゴを削除（モバイルのみ）
 */

(function() {
  'use strict';
  
  console.log('📱 モバイルクリーンアップ開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // グラデーション協賛店ボタンを削除
  function removeGradientButtons() {
    if (!isMobile()) return;
    
    // 様々なセレクターで協賛店ボタンを探して削除
    const selectors = [
      '[style*="position: fixed"]',
      '[style*="gradient"]',
      '.sponsor-btn-fixed',
      '.fixed-sponsor-btn',
      '.mobile-sponsor-fix',
      '.mobile-sponsor-buttons',
      '.mobile-sponsor-container',
      '.sponsor-mini-buttons',
      '.sponsor-mini-wrapper',
      '.sponsor-mini-btn'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.remove();
        console.log('削除したボタン/要素:', selector);
      });
    });
    
    // IDやタイトルで協賛店ボタンを探して削除
    const sponsorButtons = document.querySelectorAll(
      '[id*="sponsor"], [title*="協賛店"], button[onclick*="sponsor"]'
    );
    sponsorButtons.forEach(btn => {
      // ヒーローセクション内の協賛店ボタンのみ削除
      if (btn.closest('.hero-section')) {
        btn.remove();
        console.log('ヒーロー内の協賛店ボタンを削除');
      }
    });
  }
  
  // 中央と左上の大きなロゴを削除（モバイル専用）
  function removeOverlappingLogo() {
    if (!isMobile()) return;
    
    // 左上の特定ロゴコンテナのみを削除（140x140px白背景）
    const heroSection = document.querySelector('#top.hero-section');
    if (heroSection) {
      // より特定的なセレクターで左上ロゴのみをターゲット
      const logoContainer = heroSection.querySelector('div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"][style*="z-index: 20"]');
      if (logoContainer) {
        logoContainer.style.display = 'none';
        console.log('モバイルで左上ロゴコンテナを非表示にしました');
      }
    }
    
    // ヒーローセクション全体の表示を確保
    const heroSectionEl = document.querySelector('.hero-section');
    if (heroSectionEl) {
      heroSectionEl.style.display = 'block';
      heroSectionEl.style.visibility = 'visible';
    }
    
    // タイトル、説明文、ボタンを確実に表示
    const contentElements = document.querySelectorAll(
      '.hero-section .container, .hero-section h1, .hero-section .display-4, ' +
      '.hero-section p.lead, .hero-section .btn'
    );
    contentElements.forEach(el => {
      el.style.display = 'block';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
    
    // ヘッダーの小さなロゴは維持
    const navLogo = document.querySelector('.navbar-brand img');
    if (navLogo) {
      navLogo.style.display = 'block';
      navLogo.style.visibility = 'visible';
    }
    
    console.log('モバイルで背景・タイトル・説明文の表示を確保、左上ロゴのみ削除しました');
  }
  
  // CSS追加でモバイル専用の修正
  function addMobileCSS() {
    const style = document.createElement('style');
    style.id = 'mobile-cleanup-css';
    style.textContent = `
      /* モバイル専用修正 */
      @media (max-width: 768px) {
        /* グラデーション固定ボタンを強制非表示 */
        [style*="position: fixed"][style*="gradient"],
        .sponsor-btn-fixed,
        .fixed-sponsor-btn,
        .mobile-sponsor-fix,
        .sponsor-mini-buttons,
        .sponsor-mini-wrapper {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* 左上の大きなTomoTripロゴのみを非表示（140x140px） */
        #top.hero-section > div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"][style*="z-index: 20"] {
          display: none !important;
        }
        
        /* 協賛店の小さなボタンも非表示 */
        .sponsor-mini-btn,
        button[title*="協賛店"],
        button[id*="sponsor"] {
          display: none !important;
        }
        
        /* ナビゲーションの小さなロゴは維持（40px） */
        .navbar-brand img {
          height: 40px !important;
          width: auto !important;
          display: block !important;
        }
        
        /* ヒーローセクション全体の表示を強制確保 */
        .hero-section,
        #top.hero-section {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          min-height: 60vh !important;
        }
        
        /* コンテナとタイトル要素を強制表示 */
        .hero-section .container {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: relative !important;
        }
        
        /* タイトル、説明文、ボタンを個別に強制表示 */
        .hero-section h1,
        .hero-section .display-4 {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          color: white !important;
        }
        
        .hero-section p.lead {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          color: white !important;
        }
        
        .hero-section .btn {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      }
      
      /* デスクトップでは影響なし */
      @media (min-width: 769px) {
        .mobile-cleanup-target {
          display: block !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // MutationObserverで動的に追加される要素を監視
  function setupObserver() {
    if (!isMobile()) return;
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // 要素ノード
            // 新しく追加されたグラデーションボタンをチェック
            const style = window.getComputedStyle(node);
            if (style.position === 'fixed' && 
                style.backgroundImage.includes('gradient')) {
              node.remove();
              console.log('動的に追加されたグラデーションボタンを削除');
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 5秒後に監視停止
    setTimeout(() => observer.disconnect(), 5000);
  }
  
  // レスポンシブ対応
  function setupResponsive() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleResize(e) {
      if (e.matches) {
        // モバイル表示
        removeGradientButtons();
        removeOverlappingLogo();
      }
      // デスクトップでは何もしない
    }
    
    handleResize(mediaQuery);
    mediaQuery.addListener(handleResize);
  }
  
  // 初期化
  function initialize() {
    try {
      addMobileCSS();
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          removeGradientButtons();
          removeOverlappingLogo();
          setupObserver();
          setupResponsive();
        });
      } else {
        removeGradientButtons();
        removeOverlappingLogo();
        setupObserver();
        setupResponsive();
      }
      
      console.log('✅ モバイルクリーンアップ完了');
    } catch (error) {
      console.error('❌ モバイルクリーンアップエラー:', error);
    }
  }
  
  initialize();
  
})();