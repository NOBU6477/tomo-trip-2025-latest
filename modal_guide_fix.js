/**
 * モーダル閉じるボタンとガイド登録ボタンの修正（単純化版）
 * ガイド登録ボタン機能はdirect_guide_button_fix.jsに移動
 */
(function() {
  // DOMコンテンツロード後に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log("モーダル修正スクリプトを実行（単純化版）");
    
    // すべての閉じるボタン（×）にイベントリスナーを再設定
    document.querySelectorAll('.modal .btn-close').forEach(function(closeBtn) {
      // 既存のイベントをクリア
      const newCloseBtn = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
      
      // 新しいイベントを設定
      newCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 親のモーダルを特定
        const modal = this.closest('.modal');
        if (modal) {
          console.log("モーダルを閉じます:", modal.id);
          
          // モーダルを非表示に
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          
          // バックドロップを削除
          document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          });
          
          // bodyのスタイルをリセット
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
        
        return false;
      });
    });
  });
  
  // ページロード時にも実行（DOMContentLoadedイベントが既に発火している場合のため）
  window.addEventListener('load', function() {
    console.log("ページロード時にモーダル修正を再確認");
    
    // 閉じるボタンを再チェック
    document.querySelectorAll('.modal .btn-close').forEach(function(closeBtn) {
      if (!closeBtn._fixed) {
        // 既存のイベントをクリア
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        // 新しいイベントを設定
        newCloseBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 親のモーダルを特定
          const modal = this.closest('.modal');
          if (modal) {
            console.log("ロード後: モーダルを閉じます:", modal.id);
            
            // モーダルを非表示に
            modal.classList.remove('show');
            modal.style.display = 'none';
            
            // バックドロップを削除
            document.querySelectorAll('.modal-backdrop').forEach(function(el) {
              el.remove();
            });
            
            // bodyのスタイルをリセット
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
          }
          
          return false;
        });
        
        // 修正済みフラグを設定
        newCloseBtn._fixed = true;
      }
    });
  });
})();