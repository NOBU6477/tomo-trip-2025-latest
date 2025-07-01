/**
 * ベネフィットカード表示修正スクリプト
 * ベネフィットカードが正常に表示されるよう強制修正
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ベネフィットカード表示修正スクリプト開始');
  
  // ベネフィットセクションの表示を強制
  function ensureBenefitCardsVisible() {
    const benefitSection = document.getElementById('benefits');
    const guideBenefitSection = document.getElementById('guide-benefits');
    
    // 英語版のベネフィットセクション
    if (benefitSection) {
      benefitSection.style.display = 'block';
      benefitSection.style.visibility = 'visible';
      benefitSection.style.opacity = '1';
      
      // ベネフィットカードを強制表示
      const benefitCards = benefitSection.querySelectorAll('.benefit-card, .col-lg-4, .col-md-6');
      benefitCards.forEach(card => {
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
      });
      
      console.log(`英語版: ${benefitCards.length}個のベネフィットカードを表示`);
    }
    
    // 日本語版のベネフィットセクション
    if (guideBenefitSection) {
      guideBenefitSection.style.display = 'block';
      guideBenefitSection.style.visibility = 'visible';
      guideBenefitSection.style.opacity = '1';
      
      // ベネフィットカードを強制表示
      const guideBenefitCards = guideBenefitSection.querySelectorAll('.guide-benefit-card, .col-lg-6');
      guideBenefitCards.forEach(card => {
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
      });
      
      console.log(`日本語版: ${guideBenefitCards.length}個のベネフィットカードを表示`);
    }
  }
  
  // セクション表示の確保（複数回実行で確実に）
  function forceDisplaySections() {
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
      if (section.id === 'benefits' || section.id === 'guide-benefits') {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
        section.classList.remove('d-none', 'hidden');
      }
    });
  }
  
  // 即座に実行
  ensureBenefitCardsVisible();
  forceDisplaySections();
  
  // 少し遅延させて再実行（他のスクリプトとの競合を避ける）
  setTimeout(() => {
    ensureBenefitCardsVisible();
    forceDisplaySections();
  }, 500);
  
  // さらに遅延させて最終確認
  setTimeout(() => {
    ensureBenefitCardsVisible();
    forceDisplaySections();
    console.log('ベネフィットカード表示修正完了');
  }, 1000);
});