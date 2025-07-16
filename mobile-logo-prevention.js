/**
 * モバイルロゴ表示防止システム
 * 他のスクリプトによる左上ロゴの復元を完全に阻止
 */

(function() {
  'use strict';
  
  console.log('🚫 モバイルロゴ防止システム開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // ロゴ要素を強制削除
  function preventLogoDisplay() {
    if (!isMobile()) return;
    
    // 左上ロゴコンテナを探して削除
    const heroSection = document.querySelector('#top.hero-section');
    if (heroSection) {
      const logoSelectors = [
        'div[style*="position: absolute"][style*="top: 2%"]',
        'div[style*="width: 140px"]',
        'div[style*="height: 140px"]',
        'div[style*="z-index: 20"]'
      ];
      
      logoSelectors.forEach(selector => {
        const logos = heroSection.querySelectorAll(selector);
        logos.forEach(logo => {
          if (logo.style.position === 'absolute' && 
              (logo.style.top.includes('2%') || logo.style.left.includes('2%'))) {
            logo.style.display = 'none';
            logo.style.visibility = 'hidden';
            logo.style.opacity = '0';
            console.log('🚫 ロゴコンテナを強制非表示');
          }
        });
      });
    }
  }
  
  // スタイル監視とオーバーライド
  function overrideLogoStyles() {
    if (!isMobile()) return;
    
    const style = document.createElement('style');
    style.id = 'logo-prevention-style';
    style.textContent = `
      @media (max-width: 768px) {
        /* 左上ロゴコンテナの完全非表示 */
        #top.hero-section > div[style*="position: absolute"][style*="top: 2%"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        /* 140x140px要素の非表示 */
        #top.hero-section div[style*="width: 140px"],
        #top.hero-section div[style*="height: 140px"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* z-index: 20要素の非表示 */
        #top.hero-section div[style*="z-index: 20"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      }
    `;
    
    // 既存のスタイルを削除してから追加
    const existingStyle = document.getElementById('logo-prevention-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);
  }
  
  // 継続的監視システム
  function continuousPreventLogo() {
    if (!isMobile()) return;
    
    preventLogoDisplay();
    overrideLogoStyles();
    
    // 1秒ごとに再実行
    setTimeout(continuousPreventLogo, 1000);
  }
  
  // 初期化
  function initialize() {
    overrideLogoStyles();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        preventLogoDisplay();
        continuousPreventLogo();
      });
    } else {
      preventLogoDisplay();
      continuousPreventLogo();
    }
    
    console.log('✅ モバイルロゴ防止システム完了');
  }
  
  // 実行
  initialize();
  
})();