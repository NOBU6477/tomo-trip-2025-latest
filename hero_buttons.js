/**
 * ヒーローセクションのボタン動作を設定（単純化版）
 * 純粋なガイド検索機能のみを提供し、登録機能はdirect_guide_button_fix.jsに委任
 */
(function() {
  // DOMコンテンツ読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('ヒーローボタン初期化（単純化版）');
    
    // ガイドを探すボタン
    const findGuideBtn = document.getElementById('find-guide-btn');
    if (findGuideBtn) {
      findGuideBtn.addEventListener('click', function() {
        // ガイド検索セクションへスクロール
        const guidesSection = document.getElementById('guides');
        if (guidesSection) {
          guidesSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // 注：ガイドになる機能はdirect_guide_button_fix.jsに移動
  });
})();