/**
 * ベネフィットカード表示修正スクリプト - 完全版
 * 英語版でベネフィットカードが表示されない問題を根本解決
 */

(function() {
  'use strict';
  
  console.log('ベネフィットカード表示修正スクリプト開始');
  
  // CSS強制適用
  function injectBenefitCardCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* ベネフィットセクション強制表示 */
      #benefits,
      #guide-benefits {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        overflow: visible !important;
      }
      
      /* ベネフィットカード強制表示 */
      .benefit-card,
      .guide-benefit-card {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        min-height: 200px !important;
      }
      
      /* 列要素強制表示 */
      .col-lg-4, .col-md-6, .col-lg-6 {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Bootstrap Grid 強制適用 */
      .row {
        display: flex !important;
        flex-wrap: wrap !important;
      }
      
      .row .col-lg-4,
      .row .col-md-6,
      .row .col-lg-6 {
        flex: 0 0 auto !important;
      }
      
      /* 英語版ベネフィットカード専用スタイル */
      #benefits .col-lg-4 {
        width: 33.333333% !important;
        margin-bottom: 1.5rem !important;
      }
      
      #benefits .col-md-6 {
        width: 50% !important;
      }
      
      /* 日本語版ベネフィットカード専用スタイル */
      #guide-benefits .col-lg-6 {
        width: 50% !important;
        margin-bottom: 1.5rem !important;
      }
    `;
    document.head.appendChild(style);
    console.log('ベネフィットカード専用CSSを注入しました');
  }
  
  // ベネフィットカード表示処理
  function ensureBenefitCardsVisible() {
    // 英語版のベネフィットセクション
    const benefitSection = document.getElementById('benefits');
    if (benefitSection) {
      console.log('英語版ベネフィットセクション見つかりました');
      
      // セクション自体を強制表示
      benefitSection.style.setProperty('display', 'block', 'important');
      benefitSection.style.setProperty('visibility', 'visible', 'important');
      benefitSection.style.setProperty('opacity', '1', 'important');
      benefitSection.classList.remove('d-none', 'hidden');
      
      // 行要素を強制表示
      const rows = benefitSection.querySelectorAll('.row');
      rows.forEach(row => {
        row.style.setProperty('display', 'flex', 'important');
        row.style.setProperty('visibility', 'visible', 'important');
        row.style.setProperty('opacity', '1', 'important');
      });
      
      // 列要素とベネフィットカードを強制表示
      const columns = benefitSection.querySelectorAll('.col-lg-4, .col-md-6');
      console.log(`英語版列要素数: ${columns.length}`);
      
      columns.forEach((col, index) => {
        col.style.setProperty('display', 'block', 'important');
        col.style.setProperty('visibility', 'visible', 'important');
        col.style.setProperty('opacity', '1', 'important');
        col.classList.remove('d-none', 'hidden');
        
        const benefitCard = col.querySelector('.benefit-card');
        if (benefitCard) {
          benefitCard.style.setProperty('display', 'block', 'important');
          benefitCard.style.setProperty('visibility', 'visible', 'important');
          benefitCard.style.setProperty('opacity', '1', 'important');
          benefitCard.style.setProperty('height', 'auto', 'important');
          console.log(`英語版ベネフィットカード${index + 1}を表示しました`);
        }
      });
      
      console.log(`英語版: ${columns.length}個のベネフィットカードを処理完了`);
    } else {
      console.log('英語版ベネフィットセクションが見つかりません');
    }
    
    // 日本語版のベネフィットセクション
    const guideBenefitSection = document.getElementById('guide-benefits');
    if (guideBenefitSection) {
      console.log('日本語版ベネフィットセクション見つかりました');
      
      guideBenefitSection.style.setProperty('display', 'block', 'important');
      guideBenefitSection.style.setProperty('visibility', 'visible', 'important');
      guideBenefitSection.style.setProperty('opacity', '1', 'important');
      
      const guideColumns = guideBenefitSection.querySelectorAll('.col-lg-6');
      guideColumns.forEach(col => {
        col.style.setProperty('display', 'block', 'important');
        col.style.setProperty('visibility', 'visible', 'important');
        col.style.setProperty('opacity', '1', 'important');
      });
      
      console.log(`日本語版: ${guideColumns.length}個のベネフィットカードを処理完了`);
    }
  }
  
  // MutationObserver でDOM変更を監視
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // ベネフィットセクションに変更があった場合、再処理
          const benefitSection = document.getElementById('benefits');
          if (benefitSection && (mutation.target === benefitSection || benefitSection.contains(mutation.target))) {
            console.log('ベネフィットセクションに変更を検出、再処理します');
            setTimeout(ensureBenefitCardsVisible, 100);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('DOM変更監視を開始しました');
  }
  
  // 初期化
  function init() {
    injectBenefitCardCSS();
    ensureBenefitCardsVisible();
    setupMutationObserver();
    
    // 複数回実行で確実に表示
    setTimeout(ensureBenefitCardsVisible, 500);
    setTimeout(ensureBenefitCardsVisible, 1000);
    setTimeout(ensureBenefitCardsVisible, 2000);
  }
  
  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();