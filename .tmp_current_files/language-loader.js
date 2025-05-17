/**
 * 言語読み込み時の自動適用
 * 他のすべてのJSファイルが読み込まれた後に実行される保証を持つスクリプト
 */
window.addEventListener('load', function() {
  console.log('言語ローダー: ページ完全ロード後の翻訳実行');
  
  // 保存されている言語設定があれば適用
  const savedLang = localStorage.getItem('preferred_language');
  if (savedLang) {
    console.log('言語ローダー: 保存された言語設定を適用します:', savedLang);
    
    // 言語切り替えリンクをクリックする
    setTimeout(function() {
      const langLink = document.querySelector(`.dropdown-item[data-lang="${savedLang}"]`);
      if (langLink) {
        console.log('言語ローダー: 言語リンクを見つけました、クリック実行');
        langLink.click();
      } else {
        console.log('言語ローダー: 対象の言語リンクが見つかりません');
        
        // 直接翻訳実行
        if (typeof translateAllDataKeyElements === 'function') {
          console.log('言語ローダー: 直接翻訳関数を実行します');
          translateAllDataKeyElements();
        } else {
          console.log('言語ローダー: 翻訳関数が見つかりません');
        }
      }
    }, 100); // 100ms遅延させて他のスクリプトの初期化完了を保証
  }
});