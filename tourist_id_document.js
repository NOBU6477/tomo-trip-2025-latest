// 観光客の身分証明書アップロード機能を実装
document.addEventListener('DOMContentLoaded', function() {
  console.log('観光客の身分証明書アップロード機能を初期化します');
  
  // 観光客の身分証明書アップロードボタン
  const touristUploadIdBtn = document.getElementById('tourist-upload-id');
  if (touristUploadIdBtn) {
    console.log('観光客アップロードボタンを設定します');
    
    // すべてのイベントリスナーを削除するためクローンして置き換え
    const newBtn = touristUploadIdBtn.cloneNode(true);
    touristUploadIdBtn.parentNode.replaceChild(newBtn, touristUploadIdBtn);
    
    // 新しいイベントリスナーを設定
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('観光客の身分証明書アップロードボタンがクリックされました - 最終修正版');
      
      // 直接モーダルを表示する（Bootstrap APIを使わずに）
      const touristModal = document.getElementById('touristRegisterModal');
      const idDocumentModal = document.getElementById('idDocumentModal');
      
      // 現在のモーダルを閉じる
      if (touristModal) {
        touristModal.classList.remove('show');
        touristModal.style.display = 'none';
        touristModal.setAttribute('aria-hidden', 'true');
        touristModal.removeAttribute('aria-modal');
      }
      
      // バックドロップをクリア
      document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      });
      
      // bodyのスタイルをリセット
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      if (idDocumentModal) {
        // ユーザータイプを設定
        let userTypeField = idDocumentModal.querySelector('input[name="user-type"]');
        if (!userTypeField) {
          userTypeField = document.createElement('input');
          userTypeField.type = 'hidden';
          userTypeField.name = 'user-type';
          userTypeField.value = 'tourist';
          const form = idDocumentModal.querySelector('form');
          if (form) form.appendChild(userTypeField);
        } else {
          userTypeField.value = 'tourist';
        }
        
        // 少し待ってから新しいモーダルを表示
        setTimeout(function() {
          // バックドロップを追加
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
          
          // モーダルを表示
          idDocumentModal.classList.add('show');
          idDocumentModal.style.display = 'block';
          idDocumentModal.setAttribute('aria-modal', 'true');
          idDocumentModal.removeAttribute('aria-hidden');
          
          // bodyのスタイルを設定
          document.body.classList.add('modal-open');
          
          // イベントを手動で発火させてハンドラーを呼び出す
          const event = new CustomEvent('shown.bs.modal');
          idDocumentModal.dispatchEvent(event);
          
          console.log('身分証明書モーダルを手動で表示しました');
        }, 300);
      } else {
        console.error('身分証明書モーダルが見つかりません');
        alert('身分証明書モーダルが見つかりません');
      }
      
      return false;
    });
  }
  
  // モーダル内で送信が成功した時のコールバック
  window.onDocumentUploadSuccess = function(documentType, fileName, userType) {
    console.log(`書類アップロード成功: ${documentType}, ${fileName}, ユーザータイプ: ${userType}`);
    
    // ユーザータイプに基づいてUIを更新
    if (userType === 'tourist') {
      const idPending = document.getElementById('tourist-id-pending');
      const idVerified = document.getElementById('tourist-id-verified');
      
      if (idPending) idPending.classList.remove('d-none');
      if (idVerified) idVerified.classList.add('d-none');
    } else if (userType === 'guide') {
      const idPending = document.getElementById('guide-id-pending');
      const idVerified = document.getElementById('guide-id-verified');
      
      if (idPending) idPending.classList.remove('d-none');
      if (idVerified) idVerified.classList.add('d-none');
    }
  };
});
