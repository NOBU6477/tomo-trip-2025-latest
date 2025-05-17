// 直接埋め込み用のアップロードスクリプト
console.log('直接埋め込みスクリプトが実行されました');

// ページ読み込み後に実行されるコード
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: 直接埋め込みスクリプト');
  setupDirectUploadButton();
});

// ボタン設定関数
function setupDirectUploadButton() {
  // アップロードボタンの取得
  const uploadBtn = document.getElementById('document-upload-btn');
  
  if (uploadBtn) {
    console.log('アップロードボタンを検出しました(埋め込みスクリプト)');
    
    // クリックイベントを設定
    uploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('アップロードボタンがクリックされました(埋め込みスクリプト)');
      
      // ファイルアップロード処理
      handleDocumentUpload();
    });
  } else {
    console.warn('アップロードボタンが見つかりません(埋め込みスクリプト)');
    
    // ボタンが見つからない場合は少し待ってから再試行
    setTimeout(function() {
      const retryUploadBtn = document.getElementById('document-upload-btn');
      if (retryUploadBtn) {
        console.log('再試行: アップロードボタンを検出しました');
        
        retryUploadBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('再試行: アップロードボタンがクリックされました');
          
          handleDocumentUpload();
        });
      }
    }, 1000);
  }
}

// ファイルアップロード処理
function handleDocumentUpload() {
  const documentType = document.getElementById('document-type')?.value;
  
  if (!documentType) {
    showUploadError('書類の種類を選択してください');
    return;
  }
  
  // 同意チェック
  const consentCheckbox = document.getElementById('document-consent');
  if (consentCheckbox && !consentCheckbox.checked) {
    showUploadError('同意にチェックを入れてください');
    return;
  }
  
  let file;
  
  // 運転免許証の場合
  if (documentType === 'driverLicense') {
    const frontFile = document.getElementById('document-file-front')?.files?.[0];
    const backFile = document.getElementById('document-file-back')?.files?.[0];
    
    if (!frontFile || !backFile) {
      showUploadError('表面と裏面の両方のファイルを選択してください');
      return;
    }
    
    file = frontFile;
  } 
  // その他の書類
  else {
    file = document.getElementById('document-file')?.files?.[0];
    
    if (!file) {
      showUploadError('ファイルを選択してください');
      return;
    }
  }
  
  // ファイルアップロード実行（モック）
  console.log(`書類アップロード: ${documentType}, ファイル=${file.name}`);
  alert(`書類アップロード（モック）:\n種類: ${documentType}\nファイル: ${file.name}`);
  
  // モーダルを閉じる
  const modal = document.getElementById('idDocumentModal');
  if (modal) {
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) bsModal.hide();
  }
}

// エラー表示
function showUploadError(message) {
  const errorElem = document.getElementById('document-error');
  if (errorElem) {
    errorElem.textContent = message;
    errorElem.classList.remove('d-none');
  } else {
    alert('エラー: ' + message);
  }
}

// モーダル表示イベントを監視
document.addEventListener('shown.bs.modal', function(e) {
  if (e.target.id === 'idDocumentModal') {
    console.log('モーダル表示イベント検出(埋め込みスクリプト)');
    setupDirectUploadButton();
  }
});

// 即時実行関数
(function() {
  // DOM読み込み完了を待たずに実行
  console.log('即時実行関数(埋め込みスクリプト)');
  
  // すでにモーダルが表示されている場合
  setTimeout(function() {
    const idModal = document.getElementById('idDocumentModal');
    if (idModal && idModal.classList.contains('show')) {
      console.log('表示中のモーダルを検出(埋め込みスクリプト)');
      setupDirectUploadButton();
    }
  }, 500);
})();
