// シンプルな修正スクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('シンプルボタン修正スクリプトを実行');
  
  // 新規登録ボタン
  const registerBtn = document.querySelector('.btn.btn-warning');
  if (registerBtn) {
    console.log('新規登録ボタンを発見');
    
    // クローンしてイベントをすべて削除
    const newBtn = registerBtn.cloneNode(true);
    registerBtn.parentNode.replaceChild(newBtn, registerBtn);
    
    // 新しいイベントを追加
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('新規登録ボタンがクリックされました');
      
      // ユーザータイプモーダルを表示
      showUserTypeModal();
      
      return false;
    });
  } else {
    console.warn('新規登録ボタンが見つかりません');
  }
  
  // 観光客ボタン (新規作成後に動的に追加される可能性あり)
  function setupTouristButton() {
    const touristBtn = document.getElementById('tourist-upload-id');
    if (touristBtn) {
      console.log('観光客ボタンを発見');
      
      // クローンしてイベントをすべて削除
      const newBtn = touristBtn.cloneNode(true);
      touristBtn.parentNode.replaceChild(newBtn, touristBtn);
      
      // 新しいイベントを追加
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('観光客ボタンがクリックされました');
        
        // 観光客登録モーダルを直接表示（ID書類モーダルをスキップ）
        const touristModal = new bootstrap.Modal(document.getElementById('touristRegisterModal'));
        touristModal.show();
        
        return false;
      });
    }
  }
  
  // ユーザータイプモーダルの表示
  function showUserTypeModal() {
    // 既存のモーダルを閉じる
    clearModals();
    
    const userTypeModal = document.getElementById('userTypeModal');
    if (userTypeModal) {
      console.log('ユーザータイプモーダルを表示');
      
      // バックドロップを追加
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.opacity = '0.25';
      document.body.appendChild(backdrop);
      
      // モーダルを表示
      userTypeModal.classList.add('show');
      userTypeModal.style.display = 'block';
      userTypeModal.setAttribute('aria-modal', 'true');
      userTypeModal.removeAttribute('aria-hidden');
      
      // ボディスタイルを設定
      document.body.classList.add('modal-open');
    }
  }
  
  // ID書類モーダルの表示
  function showIdDocumentModal(userType) {
    // 既存のモーダルを閉じる
    clearModals();
    
    const idDocumentModal = document.getElementById('idDocumentModal');
    if (idDocumentModal) {
      console.log('ID書類モーダルを表示');
      
      // ユーザータイプを設定
      let typeField = idDocumentModal.querySelector('input[name="user-type"]');
      if (!typeField) {
        typeField = document.createElement('input');
        typeField.type = 'hidden';
        typeField.name = 'user-type';
        const form = idDocumentModal.querySelector('form');
        if (form) {
          form.appendChild(typeField);
        }
      }
      typeField.value = userType;
      
      // バックドロップを追加
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.opacity = '0.25';
      document.body.appendChild(backdrop);
      
      // モーダルを表示
      idDocumentModal.classList.add('show');
      idDocumentModal.style.display = 'block';
      idDocumentModal.setAttribute('aria-modal', 'true');
      idDocumentModal.removeAttribute('aria-hidden');
      
      // ボディスタイルを設定
      document.body.classList.add('modal-open');
    }
  }
  
  // モーダルをすべて閉じる
  function clearModals() {
    // 表示中のモーダルを閉じる
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    });
    
    // バックドロップを削除
    document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    });
    
    // ボディスタイルをリセット
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
  // 観光客ボタンのセットアップ（イベント時にも呼ばれる）
  setupTouristButton();
  
  // モーダル表示時にボタンをセットアップ
  document.addEventListener('shown.bs.modal', function(e) {
    if (e.target.id === 'touristRegisterModal') {
      console.log('観光客登録モーダルが表示されたので、ボタンをセットアップ');
      setTimeout(setupTouristButton, 100);
    }
  });
});
