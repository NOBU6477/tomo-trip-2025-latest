/**
 * 最もシンプルなフィルター実装
 * guide-filter.jsのバックアップとして機能します
 */

document.addEventListener('DOMContentLoaded', function() {
  // ソースが存在するプロジェクトでのいずれかのフィルター機能を利用するため、
  // 特別な操作は行いません。このファイルは依存関係を満たすための空のコンテナです。
  
  // guide-filter.jsが読み込まれなかった場合にバックアップとして
  // 基本的なapplyFilters関数を提供します
  if (typeof window.applyFilters !== 'function') {
    window.applyFilters = function() {
      console.log('ガイドフィルター機能: guide-filter.jsが読み込まれていないため、ultra-simple-filter.jsのバックアップ機能を使用します');
      
      // ガイドカードコンテナを取得
      const guidesContainer = document.getElementById('guides-container');
      const noGuidesMessage = document.getElementById('no-guides-message');
      
      if (guidesContainer) {
        // すべてのカードを表示
        const guideCards = guidesContainer.querySelectorAll('.guide-item, .guide-card');
        let visibleCount = 0;
        
        guideCards.forEach(card => {
          card.style.display = '';
          visibleCount++;
        });
        
        // 「検索結果なし」メッセージの表示/非表示
        if (noGuidesMessage) {
          if (visibleCount > 0) {
            noGuidesMessage.style.display = 'none';
          } else {
            noGuidesMessage.style.display = 'block';
          }
        }
        
        console.log(`簡易フィルター結果: ${visibleCount}件のガイドを表示しています`);
      }
    };
  }
});