// 身分証明書アップロード処理の修正版
document.addEventListener('DOMContentLoaded', function() {
  console.log('身分証明書ハンドラーを初期化します - 修正版');
  
  // 直接DOM参照より安全なセレクタ関数
  function $(selector) {
    return document.querySelector(selector);
  }
  
  function $$(selector) {
    return document.querySelectorAll(selector);
  }
  
  // ファイル選択ボタンのイベント設定
  function setupFileButtons() {
    console.log('ファイル選択ボタンを設定します');
    
    // 通常のファイル選択ボタン
    const selectBtn = $('#select-document');
    if (selectBtn) {
      selectBtn.onclick = function(e) {
        e.preventDefault();
        console.log('ファイル選択ボタンがクリックされました');
        const fileInput = $('#document-file');
        if (fileInput) fileInput.click();
      };
    }
    
    // 表面ファイル選択ボタン
    const selectFrontBtn = $('#select-document-front');
    if (selectFrontBtn) {
      selectFrontBtn.onclick = function(e) {
        e.preventDefault();
        console.log('表面ファイル選択ボタンがクリックされました');
        const fileInput = $('#document-file-front');
        if (fileInput) fileInput.click();
      };
    }
    
    // 裏面ファイル選択ボタン
    const selectBackBtn = $('#select-document-back');
    if (selectBackBtn) {
      selectBackBtn.onclick = function(e) {
        e.preventDefault();
        console.log('裏面ファイル選択ボタンがクリックされました');
        const fileInput = $('#document-file-back');
        if (fileInput) fileInput.click();
      };
    }
  }
  
  // ファイル入力の変更イベント設定
  function setupFileInputs() {
    console.log('ファイル入力を設定します');
    
    // 通常のファイル入力
    const fileInput = $('#document-file');
    if (fileInput) {
      fileInput.onchange = function() {
        if (this.files && this.files[0]) {
          handleFilePreview(this.files[0], '#document-preview', '#document-image-preview', '#document-upload-prompt');
        }
      };
    }
    
    // 表面ファイル入力
    const frontFileInput = $('#document-file-front');
    if (frontFileInput) {
      frontFileInput.onchange = function() {
        if (this.files && this.files[0]) {
          handleFilePreview(this.files[0], '#document-preview-front', '#document-image-preview-front', '#document-upload-prompt-front');
        }
      };
    }
    
    // 裏面ファイル入力
    const backFileInput = $('#document-file-back');
    if (backFileInput) {
      backFileInput.onchange = function() {
        if (this.files && this.files[0]) {
          handleFilePreview(this.files[0], '#document-preview-back', '#document-image-preview-back', '#document-upload-prompt-back');
        }
      };
    }
  }
  
  // 削除ボタンの設定
  function setupRemoveButtons() {
    console.log('削除ボタンを設定します');
    
    // 通常の削除ボタン
    const removeBtn = $('#remove-document');
    if (removeBtn) {
      removeBtn.onclick = function(e) {
        e.preventDefault();
        removeFile('#document-file', '#document-preview', '#document-upload-prompt');
      };
    }
    
    // 表面の削除ボタン
    const removeFrontBtn = $('#remove-document-front');
    if (removeFrontBtn) {
      removeFrontBtn.onclick = function(e) {
        e.preventDefault();
        removeFile('#document-file-front', '#document-preview-front', '#document-upload-prompt-front');
      };
    }
    
    // 裏面の削除ボタン
    const removeBackBtn = $('#remove-document-back');
    if (removeBackBtn) {
      removeBackBtn.onclick = function(e) {
        e.preventDefault();
        removeFile('#document-file-back', '#document-preview-back', '#document-upload-prompt-back');
      };
    }
  }
  
  // ファイルプレビュー処理
  function handleFilePreview(file, previewSelector, imageSelector, promptSelector) {
    console.log('ファイルプレビュー:', file.name);
    
    // ファイルサイズチェック
    if (file.size > 5 * 1024 * 1024) {
      showDocumentError('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewElement = $(previewSelector);
      const imageElement = $(imageSelector);
      const promptElement = $(promptSelector);
      
      if (previewElement && imageElement && promptElement) {
        imageElement.src = e.target.result;
        previewElement.classList.remove('d-none');
        promptElement.classList.add('d-none');
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  // ファイル削除処理
  function removeFile(inputSelector, previewSelector, promptSelector) {
    console.log('ファイル削除:', inputSelector);
    
    const inputElement = $(inputSelector);
    const previewElement = $(previewSelector);
    const promptElement = $(promptSelector);
    
    if (inputElement) inputElement.value = '';
    if (previewElement) previewElement.classList.add('d-none');
    if (promptElement) promptElement.classList.remove('d-none');
  }
  
  // ドキュメントタイプの変更イベント設定
  function setupDocumentTypeChange() {
    const typeSelect = $('#document-type');
    if (typeSelect) {
      typeSelect.onchange = function() {
        const selectedType = this.value;
        console.log('証明書タイプが変更されました:', selectedType);
        
        const frontContainer = $('#driver-license-front-container');
        const backContainer = $('#driver-license-back-container');
        const otherContainer = $('#other-document-container');
        
        if (selectedType === 'driverLicense') {
          if (frontContainer) frontContainer.classList.remove('d-none');
          if (backContainer) backContainer.classList.remove('d-none');
          if (otherContainer) otherContainer.classList.add('d-none');
        } else {
          if (frontContainer) frontContainer.classList.add('d-none');
          if (backContainer) backContainer.classList.add('d-none');
          if (otherContainer) otherContainer.classList.remove('d-none');
        }
      };
    }
  }
  
  // フォーム送信イベントの設定
  function setupFormSubmit() {
    const form = $('#id-document-form');
    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        console.log('フォームが送信されました');
        
        const documentType = $('#document-type')?.value;
        
        if (!documentType) {
          showDocumentError('書類の種類を選択してください');
          return;
        }
        
        // 運転免許証の場合
        if (documentType === 'driverLicense') {
          const frontFile = $('#document-file-front')?.files?.[0];
          const backFile = $('#document-file-back')?.files?.[0];
          
          if (!frontFile || !backFile) {
            showDocumentError('表面と裏面の両方のファイルを選択してください');
            return;
          }
          
          // フロントエンドでの開発のためフロントファイルのみ送信
          uploadIdDocument(documentType, frontFile);
        } 
        // その他の書類タイプの場合
        else {
          const file = $('#document-file')?.files?.[0];
          
          if (!file) {
            showDocumentError('ファイルを選択してください');
            return;
          }
          
          uploadIdDocument(documentType, file);
        }
      };
    }
  }
  
  // エラー表示
  function showDocumentError(message) {
    const errorElement = $('#document-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('d-none');
    } else {
      console.error('エラー表示エレメントが見つかりません');
      alert('エラー: ' + message);
    }
  }
  
  // 全ての設定を一度に行う初期化関数
  function initDocumentHandler() {
    console.log('身分証明書ハンドラーを初期化しています...');
    setupFileButtons();
    setupFileInputs();
    setupRemoveButtons();
    setupDocumentTypeChange();
    setupFormSubmit();
    
    // 初期表示状態の設定
    const typeSelect = $('#document-type');
    if (typeSelect && typeSelect.value) {
      // 初期値があれば変更イベントを発火
      const event = new Event('change');
      typeSelect.dispatchEvent(event);
    }
  }
  
  // モーダル表示時の初期化
  function handleModalShow(modalId) {
    console.log(`モーダル表示: ${modalId}`);
    if (modalId === 'idDocumentModal') {
      console.log('身分証明書モーダルが表示されました - 初期化実行');
      setTimeout(initDocumentHandler, 100);
    }
  }
  
  // モーダル表示イベントのリスニング
  document.addEventListener('shown.bs.modal', function(e) {
    handleModalShow(e.target.id);
  });
  
  // モーダルを直接開くためのイベント設定
  const uploadIdBtn = $('#guide-upload-id');
  if (uploadIdBtn) {
    uploadIdBtn.addEventListener('click', function() {
      console.log('身分証明書アップロードボタンがクリックされました');
    });
  }
  
  // 現在表示中のモーダルがあれば初期化
  const activeModal = $('.modal.show');
  if (activeModal && activeModal.id === 'idDocumentModal') {
    console.log('アクティブな身分証明書モーダルを検出');
    initDocumentHandler();
  }
});

// 直接実行文も追加（DOMContentLoadedが発火しない場合に備えて）
(function() {
  // モーダルが既に表示されているか確認
  const idModal = document.getElementById('idDocumentModal');
  if (idModal && idModal.classList.contains('show')) {
    console.log('既に表示されているモーダルを検出 - 緊急初期化を実行');
    
    // 100ms待機後に初期化（モーダルの完全な描画を待つ）
    setTimeout(function() {
      // ファイル選択ボタンに直接イベントを設定
      const buttons = {
        'select-document': 'document-file',
        'select-document-front': 'document-file-front',
        'select-document-back': 'document-file-back'
      };
      
      for (const [btnId, inputId] of Object.entries(buttons)) {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        
        if (btn && input) {
          btn.onclick = function(e) {
            e.preventDefault();
            console.log(`ボタン ${btnId} がクリックされました - 緊急初期化`);
            input.click();
          };
        }
      }
    }, 200);
  }
})();
