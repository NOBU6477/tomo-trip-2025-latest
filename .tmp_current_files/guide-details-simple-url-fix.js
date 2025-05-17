/**
 * ガイド詳細ページのURLパラメータを簡潔に修正するスクリプト
 * ページURLから必要のないパラメータを除去します
 */

(function() {
  // 既に実行済みかチェック
  if (window.simpleUrlFixApplied) {
    return;
  }
  
  // グローバルフラグを設定
  window.simpleUrlFixApplied = true;
  
  // 安全に処理を実行
  try {
    // 現在のURLを取得
    const url = new URL(window.location.href);
    
    // guide-details.htmlページかどうか確認
    if (url.pathname.includes('guide-details.html')) {
      // ガイドIDを取得
      const guideId = url.searchParams.get('id');
      
      // ガイドIDがあり、他のパラメータが存在する場合
      if (guideId && url.searchParams.toString() !== `id=${guideId}`) {
        // IDだけを残した新しいURLを作成
        const cleanUrl = `${url.pathname}?id=${guideId}`;
        
        // URLを変更（履歴は変更せず）
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('URLを整理しました:', cleanUrl);
      }
    }
  } catch (e) {
    console.error('URL修正中にエラーが発生しました:', e);
  }
})();