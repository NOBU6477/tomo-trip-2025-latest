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
  
  // タイトルにかかっているロゴを削除（モバイルのみ）
  function removeOverlappingLogo() {
    if (!isMobile()) return;
    
    // ヒーローセクション内の特定のロゴを非表示
    const heroSection = document.querySelector('#top.hero-section, .hero-section');
    if (heroSection) {
      // ヒーローセクション内のTomoTripロゴを探す
      const heroLogos = heroSection.querySelectorAll('img[src*="TomoTrip"], img[src*="logo"]');
      heroLogos.forEach(logo => {
        logo.style.display = 'none';
        console.log('モバイルでヒーローロゴを非表示にしました');
      });
      
      // ヒーローセクション内の大きな画像要素も非表示
      const largeImages = heroSection.querySelectorAll('img');
      largeImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.width > 80 || rect.height > 80) {
          img.style.display = 'none';
          console.log('モバイルで大きな画像を非表示にしました');
        }
      });
    }
    
    // TomoTripロゴファイル名を直接指定して非表示
    const logoImages = document.querySelectorAll('img[src*="TomoTrip"]');
    logoImages.forEach(logo => {
      // 親要素がヒーローセクションの場合のみ非表示
      const isInHero = logo.closest('.hero-section, #top');
      if (isInHero) {
        logo.style.display = 'none';
        console.log('TomoTripロゴを非表示にしました');
      }
    });
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
        
        /* ヒーローセクション左上のTomoTripロゴを非表示 */
        #top.hero-section div[style*="position: absolute"][style*="top: 2%"],
        .hero-section img[src*="TomoTrip"],
        .hero-section img[alt="TomoTrip"] {
          display: none !important;
        }
        
        /* ヒーローセクション内の絶対配置要素を非表示 */
        .hero-section div[style*="position: absolute"]:first-child {
          display: none !important;
        }
        
        /* 協賛店の小さなボタンも非表示 */
        .sponsor-mini-btn,
        button[title*="協賛店"],
        button[id*="sponsor"] {
          display: none !important;
        }
        
        /* ナビゲーションロゴサイズ調整 */
        .navbar-brand img {
          height: 40px !important;
          width: auto !important;
        }
        
        /* ヒーローセクションのタイトル表示を改善 */
        .hero-section .container {
          padding-top: 2rem !important;
        }
        
        .hero-section h1,
        .hero-section .display-4 {
          margin-top: 0 !important;
          z-index: 100 !important;
          position: relative !important;
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