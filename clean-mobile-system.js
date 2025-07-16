/**
 * クリーンモバイルシステム
 * 1回のみの実行で安定したモバイル表示を実現
 */

(function() {
  'use strict';
  
  console.log('🧹 クリーンモバイルシステム開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // 左上ロゴのみを削除
  function removeOnlyLogo() {
    if (!isMobile()) return;
    
    const logoSelector = '#top.hero-section > div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"]';
    const logoElement = document.querySelector(logoSelector);
    
    if (logoElement) {
      logoElement.style.display = 'none';
      console.log('🧹 左上ロゴを削除しました');
    }
  }
  
  // ヒーローセクションの内容を保護・復元
  function protectHeroContent() {
    const heroSection = document.querySelector('.hero-section, #top.hero-section');
    if (heroSection) {
      // ヒーローセクション全体を表示
      heroSection.style.display = 'block';
      heroSection.style.visibility = 'visible';
      heroSection.style.opacity = '1';
      
      // 内部の重要要素を保護
      const importantElements = heroSection.querySelectorAll('h1, p, .btn, .container');
      importantElements.forEach(el => {
        el.style.display = el.tagName === 'BUTTON' || el.classList.contains('btn') ? 'inline-block' : 'block';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
      });
      
      console.log('🧹 ヒーローセクションの内容を保護しました');
    }
  }
  
  // 重複ボタンを削除
  function removeDuplicateButtons() {
    if (!isMobile()) return;
    
    const mobileButtonContainers = document.querySelectorAll('.simple-mobile-buttons');
    if (mobileButtonContainers.length > 1) {
      // 最初の1つ以外削除
      for (let i = 1; i < mobileButtonContainers.length; i++) {
        mobileButtonContainers[i].remove();
        console.log('🧹 重複モバイルボタンを削除しました');
      }
    }
  }
  
  // 固定ボタンを削除
  function removeFixedButtons() {
    if (!isMobile()) return;
    
    const fixedButtons = document.querySelectorAll('[style*="position: fixed"]');
    fixedButtons.forEach(btn => {
      if (btn.textContent.includes('協賛店') || btn.textContent.includes('ログイン')) {
        btn.remove();
        console.log('🧹 固定ボタンを削除しました');
      }
    });
  }
  
  // CSS適用
  function applyCleanCSS() {
    const style = document.createElement('style');
    style.id = 'clean-mobile-system-css';
    style.textContent = `
      @media (max-width: 768px) {
        /* 左上ロゴのみ非表示 */
        #top.hero-section > div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"] {
          display: none !important;
        }
        
        /* ヒーローセクション保護 */
        .hero-section,
        #top.hero-section {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          min-height: 50vh !important;
        }
        
        /* ヒーローセクション内容保護 */
        .hero-section h1,
        .hero-section p,
        .hero-section .container {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .hero-section .btn {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* 固定ボタン無効化 */
        [style*="position: fixed"] {
          display: none !important;
        }
        
        /* 重複ボタン防止 */
        .simple-mobile-buttons:not(:first-of-type) {
          display: none !important;
        }
      }
    `;
    
    const existingStyle = document.getElementById('clean-mobile-system-css');
    if (existingStyle) existingStyle.remove();
    document.head.appendChild(style);
  }
  
  // 1回のみ実行
  function executeOnce() {
    if (!isMobile()) return;
    
    applyCleanCSS();
    removeOnlyLogo();
    protectHeroContent();
    removeDuplicateButtons();
    removeFixedButtons();
    
    console.log('✅ クリーンモバイルシステム完了');
  }
  
  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(executeOnce, 1000);
    });
  } else {
    setTimeout(executeOnce, 1000);
  }
  
})();