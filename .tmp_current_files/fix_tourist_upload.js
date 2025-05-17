// 観光客の本人確認書類アップロードボタン修正スクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('観光客アップロードボタン修正スクリプト実行');
  
  // 観光客用ボタンの直接イベント設定（緊急対応）
  const touristUploadBtn = document.getElementById('tourist-upload-id');
  if (touristUploadBtn) {
    console.log('観光客アップロードボタンに直接イベントを設定します');
    
    // クリックイベントを直接設定
    touristUploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('観光客アップロードボタンがクリックされました（緊急修正）');
      
      // 身分証明書モーダルを表示
      const idDocumentModal = document.getElementById('idDocumentModal');
      if (idDocumentModal) {
        // ユーザータイプを設定
        const userTypeField = idDocumentModal.querySelector('input[name="user-type"]');
        if (userTypeField) {
          userTypeField.value = 'tourist';
          console.log('ユーザータイプを touristに設定しました');
        } else {
          console.warn('user-typeフィールドが見つかりません。新しく作成します。');
          const newField = document.createElement('input');
          newField.type = 'hidden';
          newField.name = 'user-type';
          newField.value = 'tourist';
          idDocumentModal.querySelector('form').appendChild(newField);
        }
        
        // 既存のモーダルがあれば閉じる
        const touristModal = bootstrap.Modal.getInstance(document.getElementById('touristRegisterModal'));
        if (touristModal) {
          touristModal.hide();
          // モーダルが完全に閉じた後に新しいモーダルを表示
          setTimeout(function() {
            new bootstrap.Modal(idDocumentModal).show();
          }, 300);
        } else {
          // 直接表示
          new bootstrap.Modal(idDocumentModal).show();
        }
      } else {
        console.error('idDocumentModalが見つかりません');
        alert('身分証明書モーダルが見つかりません');
      }
      
      return false;
    });
  } else {
    console.error('tourist-upload-id ボタンが見つかりません');
  }
});

// ページ読み込み完了または既に読み込まれている場合のフォールバック
(function() {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    const touristUploadBtn = document.getElementById('tourist-upload-id');
    if (touristUploadBtn) {
      console.log('即時実行: 観光客アップロードボタン設定');
      
      touristUploadBtn.onclick = function(e) {
        e.preventDefault();
        console.log('即時実行: 観光客アップロードボタンがクリックされました');
        
        // モーダル処理
        const idDocumentModal = document.getElementById('idDocumentModal');
        if (idDocumentModal) {
          // ユーザータイプ設定
          let userTypeField = idDocumentModal.querySelector('input[name="user-type"]');
          if (!userTypeField) {
            userTypeField = document.createElement('input');
            userTypeField.type = 'hidden';
            userTypeField.name = 'user-type';
            idDocumentModal.querySelector('form').appendChild(userTypeField);
          }
          userTypeField.value = 'tourist';
          
          // 観光客登録モーダルを一時的に閉じる
          const touristModal = bootstrap.Modal.getInstance(document.getElementById('touristRegisterModal'));
          if (touristModal) {
            touristModal.hide();
            // 少し待ってから表示
            setTimeout(function() {
              const idModal = new bootstrap.Modal(idDocumentModal);
              idModal.show();
            }, 300);
          } else {
            // 直接表示
            const idModal = new bootstrap.Modal(idDocumentModal);
            idModal.show();
          }
        } else {
          alert('身分証明書モーダルが見つかりません');
        }
        
        return false;
      };
    }
  }
})();
