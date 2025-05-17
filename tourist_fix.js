// 観光客ボタン修正単体スクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('観光客ボタン修正スクリプト実行');
  
  // 観光客ボタンをセットアップ
  function setupTouristButton() {
    const touristBtn = document.getElementById('tourist-upload-id');
    if (touristBtn) {
      console.log('観光客ボタンを発見しました');
      
      // 既存のイベントをクリア
      const newBtn = touristBtn.cloneNode(true);
      if (touristBtn.parentNode) {
        touristBtn.parentNode.replaceChild(newBtn, touristBtn);
      }
      
      // 新しいイベントを設定
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('観光客ボタンがクリックされました');
        
        // 現在のモーダルを閉じる
        const currentModal = document.getElementById('touristRegisterModal');
        if (currentModal) {
          currentModal.classList.remove('show');
          currentModal.style.display = 'none';
          currentModal.setAttribute('aria-hidden', 'true');
          currentModal.removeAttribute('aria-modal');
        }
        
        // バックドロップを削除
        document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
          if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        });
        
        // bodyのスタイルをリセット
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // 少し待ってから新しいモーダルを表示
        setTimeout(function() {
          // 新しいバックドロップを作成
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          backdrop.style.opacity = '0.25';
          document.body.appendChild(backdrop);
          
          // IDドキュメントモーダルを表示
          const idDocModal = document.getElementById('idDocumentModal');
          if (idDocModal) {
            // ユーザータイプを設定
            let typeField = idDocModal.querySelector('input[name="user-type"]');
            if (!typeField) {
              typeField = document.createElement('input');
              typeField.type = 'hidden';
              typeField.name = 'user-type';
              typeField.value = 'tourist';
              const form = idDocModal.querySelector('form');
              if (form) {
                form.appendChild(typeField);
              }
            } else {
              typeField.value = 'tourist';
            }
            
            // モーダルを表示
            idDocModal.classList.add('show');
            idDocModal.style.display = 'block';
            idDocModal.setAttribute('aria-modal', 'true');
            idDocModal.removeAttribute('aria-hidden');
            
            document.body.classList.add('modal-open');
            
            console.log('ID書類モーダルを表示しました');
          }
        }, 300);
        
        return false;
      });
    }
  }
  
  // 初期実行
  setupTouristButton();
  
  // モーダルが表示されたときの処理
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'touristRegisterModal') {
      console.log('観光客登録モーダルが表示されたのでボタンを設定します');
      setupTouristButton();
    }
  });
});
