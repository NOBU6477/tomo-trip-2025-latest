/**
 * ベネフィットカードのHTML構造を詳細に解析するデバッグ用スクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ベネフィットカードHTML構造解析ツールを読み込み');
  
  // 英語ボタンのクリックを監視
  document.addEventListener('click', function(e) {
    if (e.target && e.target.closest('#englishBtn')) {
      setTimeout(analyzeStructure, 500);
    }
  });
  
  // 初期ロード時
  setTimeout(function() {
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn && langBtn.textContent.includes('English')) {
      analyzeStructure();
    }
  }, 1000);
  
  function analyzeStructure() {
    console.log('===== ベネフィットカード構造解析開始 =====');
    
    // 青いチェックマークを検索
    const checkmarks = document.querySelectorAll('.text-primary, svg.text-primary, .bi-check-circle-fill, .bi-check, .bi.bi-check-circle');
    console.log(`青いチェックマーク要素数: ${checkmarks.length}`);
    
    if (checkmarks.length > 0) {
      // 最初のチェックマークの構造を詳しく調査
      const firstCheck = checkmarks[0];
      console.log('最初のチェックマーク:');
      console.log('- タグ名:', firstCheck.tagName);
      console.log('- クラス:', firstCheck.className);
      console.log('- 親要素タグ:', firstCheck.parentElement.tagName);
      console.log('- 親要素クラス:', firstCheck.parentElement.className);
      
      // 親の親要素もチェック
      const grandParent = firstCheck.parentElement.parentElement;
      if (grandParent) {
        console.log('- 親の親要素タグ:', grandParent.tagName);
        console.log('- 親の親要素クラス:', grandParent.className);
        
        // 親の親要素内の全テキストを表示
        const grandParentText = Array.from(grandParent.childNodes)
          .filter(node => node.nodeType === 3)
          .map(node => node.textContent.trim())
          .join(' | ');
        
        console.log('- 親の親要素内のテキスト:', grandParentText);
      }
      
      // 兄弟要素を探す
      let sibling = firstCheck.nextElementSibling;
      if (sibling) {
        console.log('- 次の兄弟要素タグ:', sibling.tagName);
        console.log('- 次の兄弟要素クラス:', sibling.className);
        console.log('- 次の兄弟要素テキスト:', sibling.textContent.trim());
      } else {
        console.log('- 直接の兄弟要素なし');
      }
      
      // 親の兄弟要素をチェック
      sibling = firstCheck.parentElement.nextElementSibling;
      if (sibling) {
        console.log('- 親の次の兄弟要素タグ:', sibling.tagName);
        console.log('- 親の次の兄弟要素クラス:', sibling.className);
        console.log('- 親の次の兄弟要素テキスト:', sibling.textContent.trim());
      }
      
      // カード要素を探す
      const card = firstCheck.closest('.card, .benefit-card, .col-md-6');
      if (card) {
        console.log('- カード要素タグ:', card.tagName);
        console.log('- カード要素クラス:', card.className);
        
        // カード内のタイトル的な要素を探す
        const possibleTitles = card.querySelectorAll('h3, h4, h5, h6, strong, b, .fw-bold');
        console.log(`- カード内のタイトル的要素数: ${possibleTitles.length}`);
        
        possibleTitles.forEach((title, i) => {
          console.log(`  タイトル要素 ${i+1}:`, title.tagName, '-', title.textContent.trim());
        });
      }
    }
    
    // 翻訳用のマーカーとして、特定のカードを見つける
    findSpecificCard('あなたの日常が観光資源');
    findSpecificCard('観光客の方を友達');
    findSpecificCard('隙間時間を使って');
    
    console.log('===== ベネフィットカード構造解析終了 =====');
  }
  
  function findSpecificCard(searchText) {
    console.log(`\n"${searchText}" を含む要素を検索:`);
    
    // このテキストを含む要素を見つける
    const elements = [];
    document.querySelectorAll('*').forEach(elem => {
      if (elem.textContent.includes(searchText) && 
          elem.children.length <= 3 && // 子要素が少ない、つまりテキストに近い要素
          !elements.includes(elem)) {
        elements.push(elem);
      }
    });
    
    elements.forEach((elem, i) => {
      console.log(`${i+1}. タグ: ${elem.tagName}, クラス: ${elem.className}`);
      console.log(`   テキスト: ${elem.textContent.trim().substring(0, 40)}...`);
      console.log(`   親タグ: ${elem.parentElement.tagName}, 親クラス: ${elem.parentElement.className}`);
    });
  }
});