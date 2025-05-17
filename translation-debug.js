/**
 * 言語翻訳のデバッグツール
 * これにより翻訳の問題が視覚的に把握できます
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('翻訳デバッグツールを初期化します');
  
  // デバッグモード - trueにするとデバッグ表示が有効になります
  const DEBUG_MODE = true;
  
  // ページ読み込み完了後、すべてのdata-key要素をチェック
  window.addEventListener('load', function() {
    if (!DEBUG_MODE) return;
    
    console.log('翻訳デバッグを開始します');
    
    // data-key属性を持つすべての要素をハイライト
    const elementsWithDataKey = document.querySelectorAll('[data-key]');
    console.log(`${elementsWithDataKey.length}個のdata-key要素が見つかりました`);
    
    // 現在の言語を取得
    const currentLang = localStorage.getItem('user_language') || 'ja';
    console.log(`現在の言語: ${currentLang}`);
    
    // 各要素の翻訳状態を確認
    elementsWithDataKey.forEach(element => {
      const key = element.getAttribute('data-key');
      
      // 実際のテキストと翻訳キーを比較
      console.log(`要素 [${key}]: "${element.textContent}"`);
      
      // 「右表示」のようなデバッグテキストが含まれているかチェック
      if (element.textContent.includes('右表示')) {
        console.error(`エラー: 要素 [${key}] に「右表示」が含まれています`);
        
        // 視覚的にマーク
        element.style.outline = '2px solid red';
        element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      }
    });
  });
});