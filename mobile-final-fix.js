/**
 * モバイル最終修正スクリプト
 * 左上ロゴのみを削除し、他の要素は完全に保護
 */

(function() {
  'use strict';
  
  console.log('🎯 モバイル最終修正開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // 左上ロゴのみを削除する最終処理
  function finalLogoRemoval() {
    if (!isMobile()) return;
    
    // 非常に特定的なセレクターで左上ロゴのみをターゲット
    const heroSection = document.querySelector('#top.hero-section');
    if (heroSection) {
      // 左上の140x140pxロゴコンテナを探す
      const logoDiv = heroSection.querySelector('div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"]');
      if (logoDiv && logoDiv.querySelector('img[alt="TomoTrip"]')) {
        logoDiv.style.display = 'none';
        console.log('🎯 左上TomoTripロゴを非表示にしました');
      }
    }
    
    // ヒーローセクション本体を確実に表示
    const heroSectionEl = document.querySelector('.hero-section');
    if (heroSectionEl) {
      heroSectionEl.style.display = 'block';
      heroSectionEl.style.visibility = 'visible';
      heroSectionEl.style.opacity = '1';
    }
    
    // 重要なコンテンツ要素を保護
    const protectedElements = document.querySelectorAll(
      '.hero-section .container, .hero-section h1, .hero-section p, .hero-section .btn'
    );
    protectedElements.forEach(el => {
      el.style.display = 'block';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
  }
  
  // 重複ボタンを削除
  function removeDuplicateButtons() {
    if (!isMobile()) return;
    
    const buttonContainers = document.querySelectorAll('.simple-mobile-buttons');
    if (buttonContainers.length > 1) {
      // 最初の1つ以外を削除
      for (let i = 1; i < buttonContainers.length; i++) {
        buttonContainers[i].remove();
        console.log('🎯 重複ボタンを削除しました');
      }
    }
  }
  
  // CSS強制適用
  function applyFinalCSS() {
    const style = document.createElement('style');
    style.id = 'mobile-final-fix-css';
    style.textContent = `
      @media (max-width: 768px) {
        /* 左上ロゴコンテナのみ非表示 */
        #top.hero-section > div[style*="position: absolute"][style*="top: 2%"][style*="left: 2%"] {
          display: none !important;
        }
        
        /* ヒーローセクション全体を強制表示 */
        .hero-section {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          min-height: 60vh !important;
        }
        
        /* コンテンツ要素を強制表示 */
        .hero-section .container,
        .hero-section h1,
        .hero-section p.lead,
        .hero-section .btn {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* ボタンは inline-block で表示 */
        .hero-section .btn {
          display: inline-block !important;
        }
        
        /* 重複ボタン防止 */
        .simple-mobile-buttons:nth-of-type(n+2) {
          display: none !important;
        }
      }
    `;
    
    // 既存のスタイルを削除してから追加
    const existingStyle = document.getElementById('mobile-final-fix-css');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);
  }
  
  // 初期化（1回のみ実行）
  function initialize() {
    applyFinalCSS();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
          finalLogoRemoval();
          removeDuplicateButtons();
          
          // ヒーローセクションの強制復元
          const heroSection = document.querySelector('.hero-section');
          if (heroSection) {
            heroSection.style.display = 'block';
            heroSection.style.visibility = 'visible';
            heroSection.style.opacity = '1';
            console.log('🎯 ヒーローセクションを復元しました');
          }
        }, 500); // 0.5秒後に実行
      });
    } else {
      setTimeout(() => {
        finalLogoRemoval();
        removeDuplicateButtons();
        
        // ヒーローセクションの強制復元
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
          heroSection.style.display = 'block';
          heroSection.style.visibility = 'visible';
          heroSection.style.opacity = '1';
          console.log('🎯 ヒーローセクションを復元しました');
        }
      }, 500);
    }
    
    console.log('✅ モバイル最終修正完了');
  }
  
  // 実行
  initialize();
  
})();