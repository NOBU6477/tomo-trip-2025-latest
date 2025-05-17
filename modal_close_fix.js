/**
 * モーダル閉じるボタン修正スクリプト
 * Bootstrapのモーダル閉じるボタンが機能しない問題を修正
 */
(function() {
  // 即時実行関数

  // モーダル閉じるボタン修正関数
  function fixModalCloseButtons() {
    console.log("モーダル閉じるボタン修正を実行");
    
    // すべての閉じるボタンを処理
    const closeButtons = document.querySelectorAll('.modal .btn-close, [data-bs-dismiss="modal"]');
    closeButtons.forEach(function(button) {
      // 既存のイベントをクリア
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // 独自のクリックイベント
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 対象のモーダルを取得
        const modal = this.closest('.modal');
        if (modal) {
          console.log(`閉じるボタンがクリックされました: ${modal.id}`);
          
          // モーダルを手動で非表示
          modal.style.display = 'none';
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
          
          // バックドロップを削除
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(function(backdrop) {
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
  }
  
  // DOMContentLoadedイベント
  document.addEventListener('DOMContentLoaded', function() {
    fixModalCloseButtons();
    
    // MutationObserverを使用して新しく追加されるモーダルボタンも監視
    const observer = new MutationObserver(function(mutations) {
      let shouldFix = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && (
                node.classList && node.classList.contains('modal') || 
                node.querySelector && node.querySelector('.modal, .btn-close, [data-bs-dismiss="modal"]')
            )) {
              shouldFix = true;
              break;
            }
          }
        }
      });
      
      if (shouldFix) {
        console.log("DOM変更を検出: モーダル閉じるボタンを修正します");
        fixModalCloseButtons();
      }
    });
    
    // 監視設定
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
  
  // loadイベント (DOMContentLoadedが既に発火している場合に備えて)
  window.addEventListener('load', function() {
    console.log("ページロード完了: モーダル閉じるボタン修正をチェック");
    fixModalCloseButtons();
    
    // 直接イベントをオーバーライド
    const bootstrapModal = window.bootstrap && window.bootstrap.Modal;
    if (bootstrapModal) {
      const originalHide = bootstrapModal.prototype.hide;
      
      bootstrapModal.prototype.hide = function() {
        try {
          return originalHide.apply(this, arguments);
        } catch (err) {
          console.log("Bootstrapモーダル閉じる処理エラーを回避:", err);
          
          // 手動で閉じる処理を実行
          if (this._element) {
            this._element.style.display = 'none';
            this._element.classList.remove('show');
            this._element.setAttribute('aria-hidden', 'true');
            this._element.removeAttribute('aria-modal');
            
            // バックドロップを削除
            document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
              backdrop.parentNode.removeChild(backdrop);
            });
            
            // bodyのスタイルをリセット
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
        }
      };
    }
  });
})();