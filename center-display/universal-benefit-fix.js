/**
 * 英語版ベネフィットカード完全修正スクリプト
 * 新しいタブとエディター間の表示差異を解決
 */

(function() {
  'use strict';
  
  console.log('🔧 英語版ベネフィットカード完全修正開始');
  
  // 最優先CSS注入
  function injectCriticalCSS() {
    // 既存のstyleタグを削除
    const existingStyles = document.querySelectorAll('style[data-benefit-fix]');
    existingStyles.forEach(style => style.remove());
    
    const criticalStyle = document.createElement('style');
    criticalStyle.setAttribute('data-benefit-fix', 'true');
    criticalStyle.textContent = `
      /* 英語版ベネフィット最優先スタイル */
      section#benefits {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        overflow: visible !important;
        background: #f8f9fa !important;
        padding: 3rem 0 !important;
      }
      
      #benefits .container {
        display: block !important;
        max-width: 1140px !important;
        margin: 0 auto !important;
        padding: 0 15px !important;
      }
      
      #benefits .row {
        display: flex !important;
        flex-wrap: wrap !important;
        margin-left: -15px !important;
        margin-right: -15px !important;
      }
      
      #benefits .col-lg-4 {
        display: block !important;
        flex: 0 0 33.333333% !important;
        max-width: 33.333333% !important;
        padding-left: 15px !important;
        padding-right: 15px !important;
        margin-bottom: 2rem !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      #benefits .col-md-6 {
        display: block !important;
        flex: 0 0 50% !important;
        max-width: 50% !important;
        padding-left: 15px !important;
        padding-right: 15px !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      #benefits .benefit-card {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        background: white !important;
        border-radius: 15px !important;
        padding: 2rem !important;
        height: auto !important;
        min-height: 250px !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08) !important;
        transition: all 0.3s ease !important;
        border: 1px solid #e9ecef !important;
      }
      
      #benefits .benefit-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
      }
      
      #benefits .benefit-icon {
        width: 60px !important;
        height: 60px !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-size: 1.5rem !important;
        margin-bottom: 1rem !important;
      }
      
      #benefits h5 {
        color: #333 !important;
        font-weight: 600 !important;
        margin-bottom: 1rem !important;
        font-size: 1.2rem !important;
      }
      
      #benefits p.text-muted {
        color: #6c757d !important;
        line-height: 1.6 !important;
        margin-bottom: 0 !important;
      }
      
      /* 強制表示クラス */
      .force-visible {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* 新しいタブ対応 */
      body #benefits,
      html #benefits {
        display: block !important;
      }
    `;
    
    // headの最初に挿入（最優先適用）
    document.head.insertBefore(criticalStyle, document.head.firstChild);
    console.log('✅ 最優先CSSを注入しました');
  }
  
  // DOM直接操作での強制表示
  function forceDisplayBenefits() {
    const benefitSection = document.getElementById('benefits');
    
    if (!benefitSection) {
      console.error('❌ ベネフィットセクションが見つかりません');
      return;
    }
    
    console.log('🎯 ベネフィットセクション発見、強制表示開始');
    
    // セクション自体の強制表示
    benefitSection.style.cssText = `
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      height: auto !important;
      overflow: visible !important;
      background: #f8f9fa !important;
      padding: 3rem 0 !important;
    `;
    
    benefitSection.classList.add('force-visible');
    benefitSection.removeAttribute('hidden');
    benefitSection.classList.remove('d-none', 'hidden', 'invisible');
    
    // 子要素を全て強制表示
    const allChildren = benefitSection.querySelectorAll('*');
    allChildren.forEach(child => {
      child.style.visibility = 'visible';
      child.style.opacity = '1';
      child.classList.remove('d-none', 'hidden', 'invisible');
    });
    
    // 列要素の強制表示
    const columns = benefitSection.querySelectorAll('.col-lg-4, .col-md-6');
    console.log(`📊 発見した列要素数: ${columns.length}`);
    
    columns.forEach((col, index) => {
      col.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        flex: 0 0 33.333333% !important;
        max-width: 33.333333% !important;
        padding: 0 15px !important;
        margin-bottom: 2rem !important;
      `;
      col.classList.add('force-visible');
      
      // ベネフィットカードの強制表示
      const benefitCard = col.querySelector('.benefit-card');
      if (benefitCard) {
        benefitCard.style.cssText = `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          background: white !important;
          border-radius: 15px !important;
          padding: 2rem !important;
          height: auto !important;
          min-height: 250px !important;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08) !important;
          border: 1px solid #e9ecef !important;
        `;
        benefitCard.classList.add('force-visible');
        console.log(`✅ ベネフィットカード${index + 1}を強制表示しました`);
      }
    });
    
    console.log(`🎉 ${columns.length}個のベネフィットカードを処理完了`);
  }
  
  // 継続監視システム
  function setupContinuousMonitoring() {
    // 定期チェック
    setInterval(() => {
      const benefitSection = document.getElementById('benefits');
      if (benefitSection) {
        const computedStyle = getComputedStyle(benefitSection);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
          console.log('🔄 ベネフィットセクションが非表示になりました、再表示します');
          forceDisplayBenefits();
        }
      }
    }, 1000);
    
    // MutationObserver
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          const target = mutation.target;
          if (target.id === 'benefits' || target.closest('#benefits')) {
            needsUpdate = true;
          }
        }
      });
      
      if (needsUpdate) {
        setTimeout(forceDisplayBenefits, 50);
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('🔍 継続監視システムを開始しました');
  }
  
  // メイン初期化
  function initialize() {
    console.log('🚀 初期化開始');
    
    // 即座に実行
    injectCriticalCSS();
    forceDisplayBenefits();
    
    // 遅延実行（他のスクリプトの干渉に対応）
    setTimeout(() => {
      injectCriticalCSS();
      forceDisplayBenefits();
    }, 100);
    
    setTimeout(() => {
      injectCriticalCSS();
      forceDisplayBenefits();
    }, 500);
    
    setTimeout(() => {
      injectCriticalCSS();
      forceDisplayBenefits();
      setupContinuousMonitoring();
    }, 1000);
    
    // さらに遅延実行（最終確認）
    setTimeout(() => {
      forceDisplayBenefits();
      console.log('🎯 最終確認実行完了');
    }, 3000);
  }
  
  // ページ読み込み状態に関係なく即座に実行
  initialize();
  
  // DOMContentLoadedでも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  // ページ完全読み込み後も実行
  window.addEventListener('load', () => {
    setTimeout(initialize, 100);
  });
  
  console.log('📝 英語版ベネフィットカード完全修正スクリプト設定完了');
  
})();