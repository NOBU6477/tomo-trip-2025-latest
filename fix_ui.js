/**
 * モーダル関連のUI修正スクリプト
 * Bootstrap 5のモーダルが正しく表示されない問題を修正します
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('UI修正スクリプトを実行します');
  
  // モーダルの表示に関する修正
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(function(element) {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('data-bs-target') || this.getAttribute('href');
      const modal = document.querySelector(target);
      
      if (modal) {
        // モーダルを表示
        document.body.classList.add('modal-open');
        modal.classList.add('show');
        modal.style.display = 'block';
        
        // 背景オーバーレイ作成
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        
        // 閉じるボタンのイベントリスナー
        modal.querySelectorAll('[data-bs-dismiss="modal"]').forEach(function(closeBtn) {
          closeBtn.addEventListener('click', function() {
            closeModal(modal);
          });
        });
        
        // 背景クリックで閉じる
        modal.addEventListener('click', function(event) {
          if (event.target === modal) {
            closeModal(modal);
          }
        });
      }
    });
  });
  
  // モーダルを閉じる関数
  function closeModal(modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }
  
  // ESCキーでモーダルを閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.querySelector('.modal.show')) {
      closeModal(document.querySelector('.modal.show'));
    }
  });
});
