/**
 * ベネフィットカード表示デバッグスクリプト
 * 英語版でベネフィットカードが表示されない原因を特定
 */

console.log('=== ベネフィットカード表示デバッグ開始 ===');

document.addEventListener('DOMContentLoaded', function() {
  // 英語版ベネフィットセクションの検査
  const benefitsSection = document.getElementById('benefits');
  console.log('英語版ベネフィットセクション:', benefitsSection);
  
  if (benefitsSection) {
    console.log('ベネフィットセクション見つかりました');
    console.log('セクションのdisplayスタイル:', getComputedStyle(benefitsSection).display);
    console.log('セクションのvisibilityスタイル:', getComputedStyle(benefitsSection).visibility);
    console.log('セクションのopacityスタイル:', getComputedStyle(benefitsSection).opacity);
    
    // ベネフィットカードを検索
    const benefitCards = benefitsSection.querySelectorAll('.benefit-card');
    console.log(`ベネフィットカード数: ${benefitCards.length}`);
    
    benefitCards.forEach((card, index) => {
      console.log(`カード${index + 1}:`, card);
      console.log(`  display: ${getComputedStyle(card).display}`);
      console.log(`  visibility: ${getComputedStyle(card).visibility}`);
      console.log(`  opacity: ${getComputedStyle(card).opacity}`);
      console.log(`  height: ${getComputedStyle(card).height}`);
      console.log(`  親要素: ${card.parentElement.className}`);
    });
    
    // 列要素の検査
    const columns = benefitsSection.querySelectorAll('.col-lg-4, .col-md-6');
    console.log(`列要素数: ${columns.length}`);
    
    columns.forEach((col, index) => {
      console.log(`列${index + 1}:`, col);
      console.log(`  display: ${getComputedStyle(col).display}`);
      console.log(`  visibility: ${getComputedStyle(col).visibility}`);
    });
  } else {
    console.log('英語版ベネフィットセクションが見つかりません');
  }
  
  // 日本語版との比較
  const guideBenefitsSection = document.getElementById('guide-benefits');
  if (guideBenefitsSection) {
    console.log('日本語版ベネフィットセクション見つかりました');
    const guideCards = guideBenefitsSection.querySelectorAll('.guide-benefit-card');
    console.log(`日本語版ベネフィットカード数: ${guideCards.length}`);
  }
  
  // CSSルールの検査
  console.log('=== CSS ルール検査 ===');
  const styleSheets = document.styleSheets;
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        if (rule.selectorText && rule.selectorText.includes('benefit')) {
          console.log('ベネフィット関連CSSルール:', rule.selectorText, rule.style.cssText);
        }
      }
    } catch (e) {
      console.log('CSS検査エラー:', e.message);
    }
  }
});

// 強制表示テスト
setTimeout(() => {
  console.log('=== 強制表示テスト実行 ===');
  const benefitsSection = document.getElementById('benefits');
  if (benefitsSection) {
    // セクション自体を強制表示
    benefitsSection.style.display = 'block !important';
    benefitsSection.style.visibility = 'visible !important';
    benefitsSection.style.opacity = '1 !important';
    
    // 全ての子要素を強制表示
    const allElements = benefitsSection.querySelectorAll('*');
    allElements.forEach(element => {
      element.style.display = '';
      element.style.visibility = 'visible';
      element.style.opacity = '1';
    });
    
    console.log('強制表示スタイル適用完了');
  }
}, 2000);