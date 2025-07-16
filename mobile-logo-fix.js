/**
 * モバイルロゴ修正システム - 左上の大きなロゴのみを確実に削除
 */

(function() {
  'use strict';
  
  console.log('📱 モバイルロゴ修正開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // 左上の大きなTomoTripロゴのみを削除
  function removeLargeLogo() {
    if (!isMobile()) return;
    
    // 左上のロゴコンテナを特定
    const logoContainer = document.querySelector('#top.hero-section div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"]');
    if (logoContainer) {
      logoContainer.style.display = 'none';
      logoContainer.style.visibility = 'hidden';
      logoContainer.style.opacity = '0';
      console.log('📱 左上の大きなTomoTripロゴを削除しました');
      return true;
    }
    
    // より広範囲の検索
    const heroSection = document.querySelector('#top.hero-section');
    if (heroSection) {
      const logoElements = heroSection.querySelectorAll('div[style*="width: 140px"], div[style*="height: 140px"]');
      logoElements.forEach(el => {
        if (el.style.position === 'absolute' && el.style.top.includes('2%')) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          console.log('📱 140x140pxロゴを削除しました');
        }
      });
    }
    
    return false;
  }
  
  // CSS強制適用
  function applyLogoCSS() {
    const style = document.createElement('style');
    style.id = 'mobile-logo-fix-css';
    style.textContent = `
      @media (max-width: 768px) {
        /* 左上の大きなTomoTripロゴのみ非表示 */
        #top.hero-section > div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* 140x140pxの要素を非表示（ロゴのみ） */
        #top.hero-section div[style*="width: 140px"][style*="height: 140px"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* ヒーローセクション全体は表示を保持 */
        #top.hero-section {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* コンテンツ要素を強制表示 */
        #top.hero-section .container,
        #top.hero-section h1,
        #top.hero-section p,
        #top.hero-section .btn {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        #top.hero-section .btn {
          display: inline-block !important;
        }
      }
    `;
    
    const existingStyle = document.getElementById('mobile-logo-fix-css');
    if (existingStyle) existingStyle.remove();
    document.head.appendChild(style);
  }
  
  // 実行
  function execute() {
    if (!isMobile()) return;
    
    applyLogoCSS();
    
    // DOMContentLoaded後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
          removeLargeLogo();
          console.log('✅ モバイルロゴ修正完了');
        }, 500);
      });
    } else {
      setTimeout(() => {
        removeLargeLogo();
        console.log('✅ モバイルロゴ修正完了');
      }, 500);
    }
  }
  
  execute();
  
})();