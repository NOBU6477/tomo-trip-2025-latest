// 身分証明書アップロード処理の更新 - ユーザータイプ対応版
document.addEventListener('DOMContentLoaded', function() {
  console.log('身分証明書アップロード処理の更新 - ユーザータイプ対応版');
  
  // モーダル表示イベントのリスナー
  document.addEventListener('shown.bs.modal', function(e) {
    if (e.target.id === 'idDocumentModal') {
      // 呼び出し元のデータを取得
      let userType = 'guide'; // デフォルト値
      
      // 隠しフィールドからユーザータイプを取得
      const userTypeField = e.target.querySelector('input[name="user-type"]');
      if (userTypeField) {
        userType = userTypeField.value;
      }
      
      console.log(`身分証明書モーダルが表示されました - ユーザータイプ: ${userType}`);
      
      // アップロードボタンイベントの更新
      const uploadBtn = document.getElementById('document-upload-btn');
      if (uploadBtn) {
        uploadBtn.onclick = function(e) {
          e.preventDefault();
          
          const documentType = document.getElementById('document-type')?.value;
          if (!documentType) {
            alert('書類の種類を選択してください');
            return false;
          }
          
          const consentCheckbox = document.getElementById('document-consent');
          if (consentCheckbox && !consentCheckbox.checked) {
            alert('同意にチェックを入れてください');
            return false;
          }
          
          let fileInfo = '';
          let file = null;
          
          if (documentType === 'driverLicense') {
            const frontFile = document.getElementById('document-file-front')?.files?.[0];
            const backFile = document.getElementById('document-file-back')?.files?.[0];
            
            if (!frontFile || !backFile) {
              alert('表面と裏面の両方のファイルを選択してください');
              return false;
            }
            
            fileInfo = `表面: ${frontFile.name} / 裏面: ${backFile.name}`;
            file = frontFile; // 表面ファイルを使用
          } else {
            file = document.getElementById('document-file')?.files?.[0];
            
            if (!file) {
              alert('ファイルを選択してください');
              return false;
            }
            
            fileInfo = file.name;
          }
          
          console.log(`書類アップロード処理: ${documentType}, ${fileInfo}, ユーザータイプ: ${userType}`);
          alert(`書類アップロード成功（モック）\n種類: ${documentType}\nファイル: ${fileInfo}`);
          
          // 成功コールバックを呼び出し
          if (typeof window.onDocumentUploadSuccess === 'function') {
            window.onDocumentUploadSuccess(documentType, file.name, userType);
          }
          
          // モーダルを閉じる
          const modal = bootstrap.Modal.getInstance(document.getElementById('idDocumentModal'));
          if (modal) modal.hide();
          
          return false;
        };
      }
    }
  });
});

// IDドキュメントモーダルにユーザータイプフィールドを追加する処理
function ensureUserTypeField(modalElement, userType) {
  // 既存のフィールドを確認
  let userTypeField = modalElement.querySelector('input[name="user-type"]');
  
  if (!userTypeField) {
    userTypeField = document.createElement('input');
    userTypeField.type = 'hidden';
    userTypeField.name = 'user-type';
    
    const form = modalElement.querySelector('form');
    if (form) {
      form.appendChild(userTypeField);
    } else {
      modalElement.querySelector('.modal-body').appendChild(userTypeField);
    }
  }
  
  userTypeField.value = userType || 'guide';
}

// 観光客とガイドのボタンを設定する処理
function setupDocumentUploadButtons() {
  // 観光客の書類アップロードボタン
  const touristUploadBtn = document.getElementById('tourist-upload-id');
  if (touristUploadBtn) {
    touristUploadBtn.onclick = function() {
      const idModal = document.getElementById('idDocumentModal');
      if (idModal) {
        ensureUserTypeField(idModal, 'tourist');
        
        const modal = new bootstrap.Modal(idModal);
        modal.show();
      }
    };
  }
  
  // ガイドの書類アップロードボタン
  const guideUploadBtn = document.getElementById('guide-upload-id');
  if (guideUploadBtn) {
    guideUploadBtn.onclick = function() {
      const idModal = document.getElementById('idDocumentModal');
      if (idModal) {
        ensureUserTypeField(idModal, 'guide');
        
        const modal = new bootstrap.Modal(idModal);
        modal.show();
      }
    };
  }
}

// ページ読み込み後に実行
document.addEventListener('DOMContentLoaded', setupDocumentUploadButtons);

// 既に読み込まれている場合のフォールバック
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(setupDocumentUploadButtons, 1);
}
