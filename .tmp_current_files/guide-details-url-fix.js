/**
 * ガイド詳細ページのURLパラメータを修正するスクリプト
 * guide-details.htmlへのリンクパラメータを修正し、login=requiredなど不要な部分を取り除きます
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド詳細URLパラメータ修正スクリプトを読み込みました');
  
  // ガイド詳細ページへのリンクを修正
  fixGuideDetailsLinks();
  
  // ガイドカードの詳細ボタンを修正
  setupCardDetailsButtons();
  
  /**
   * ガイド詳細ページへのリンクを修正
   */
  function fixGuideDetailsLinks() {
    const allLinks = document.querySelectorAll('a[href*="guide-details.html"]');
    
    allLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      
      // URLパラメータを分解
      const [base, params] = href.split('?');
      if (!params) return; // パラメータがなければ処理不要
      
      // パラメータを分解して必要なものだけを保持
      const urlParams = new URLSearchParams(params);
      const id = urlParams.get('id');
      
      // idだけを保持した新しいURL
      if (id) {
        const newHref = `${base}?id=${id}`;
        link.setAttribute('href', newHref);
        console.log(`リンクを修正: ${href} → ${newHref}`);
      }
    });
  }
  
  /**
   * ガイドカードの詳細ボタンをセットアップ
   */
  function setupCardDetailsButtons() {
    // カード内の「詳細を見る」ボタンを取得
    const detailsButtons = document.querySelectorAll('.guide-card .btn-outline-primary');
    
    detailsButtons.forEach(function(button) {
      // クリックイベントリスナーを追加（既存のものがあれば上書き）
      button.addEventListener('click', function(e) {
        // すでにhref属性を持つaタグならそのまま遷移させる
        if (this.tagName === 'A' && this.hasAttribute('href')) {
          return; // デフォルト動作を許可
        }
        
        // ボタンがある親カードを見つける
        const card = findParentWithClass(this, 'guide-card');
        if (!card) {
          console.error('親カードが見つかりません');
          return;
        }
        
        // カードからガイドIDを取得
        const guideId = card.getAttribute('data-guide-id');
        if (!guideId) {
          console.error('ガイドIDが見つかりません');
          return;
        }
        
        // 詳細ページに遷移
        window.location.href = `guide-details.html?id=${guideId}`;
        
        // イベントをキャンセル
        e.preventDefault();
      });
    });
  }
  
  /**
   * 特定のクラスを持つ親要素を探す
   */
  function findParentWithClass(element, className) {
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains(className)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }
});