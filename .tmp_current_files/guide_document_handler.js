/**
 * ガイド登録用の身分証明書アップロードハンドラ - 完全に新しい実装
 * 書類タイプに応じてアップロードセクションをリアルタイムで生成します
 */
document.addEventListener('DOMContentLoaded', function() {
  // 身分証明書セクションが削除されたため、この部分は不要になりました
  console.log('ガイド書類セクションは削除されました');
  
  // 身分証明書モーダルは残っており、必要に応じて直接呼び出せるようにしておく
});

/**
 * ガイド書類タイプ変更時の処理
 * @param {string} documentType 選択された書類タイプ
 */
function handleGuideDocumentTypeChange(documentType) {
  console.log('ガイド書類タイプが変更されました:', documentType);
  
  // すべてのドキュメントセクションを一旦非表示
  hideAllGuideDocumentSections();
  
  // 選択されたタイプに応じた新しいセクションを生成
  createDocumentUploadSection(documentType);
}

/**
 * 身分証明書アップロードモーダルを表示
 * 注意: 関数名を変更してコンフリクトを防止
 */
function showGuideDocumentModal() {
  const idDocumentModal = document.getElementById('idDocumentModal');
  if (idDocumentModal) {
    const bsModal = new bootstrap.Modal(idDocumentModal);
    bsModal.show();
  } else {
    console.error('身分証明書モーダルが見つかりません');
    
    // 緊急対処として直接documentタブを表示
    const documentTab = document.querySelector('[href="#document"]');
    if (documentTab) {
      console.log('書類タブを強制的に表示します');
      documentTab.click();
    }
  }
}

/**
 * すべてのガイド書類セクションを非表示
 */
function hideAllGuideDocumentSections() {
  const sections = document.querySelectorAll('#passport-upload, #license-upload, #idcard-upload, #residencecard-upload');
  sections.forEach(section => {
    console.log('非表示:', section.id);
    section.classList.add('d-none');
  });
}

/**
 * 選択された書類タイプに応じたアップロードセクションを作成
 * @param {string} documentType 書類タイプ
 */
function createDocumentUploadSection(documentType) {
  // セクションの設定情報
  const documentConfig = getDocumentConfig(documentType);
  if (!documentConfig) return;
  
  // 対応するセクションを取得
  const sectionId = documentConfig.sectionId;
  const section = document.getElementById(sectionId);
  
  if (!section) {
    console.error('セクションが見つかりません:', sectionId);
    return;
  }
  
  // セクション内容を生成して表示
  section.innerHTML = generateDocumentUploadHTML(documentConfig);
  section.classList.remove('d-none');
  
  // カメラ撮影ボタンの設定
  setupDocumentCameraButtons(section, documentConfig);
  
  console.log('セクションを表示:', sectionId);
}

/**
 * 書類タイプに応じた設定を取得
 * @param {string} documentType 書類タイプ
 * @returns {Object} 設定オブジェクト
 */
function getDocumentConfig(documentType) {
  switch (documentType) {
    case 'passport':
      return {
        sectionId: 'passport-upload',
        title: 'パスポート',
        fileIdPrefix: 'guide-passport',
        instruction: 'パスポートの写真ページをアップロードしてください。',
        icon: 'passport',
        singleSide: true
      };
    case 'driverLicense':
      return {
        sectionId: 'license-upload',
        title: '運転免許証',
        fileIdPrefix: 'guide-license',
        instruction: '運転免許証の表面と裏面をアップロードしてください。',
        icon: 'id-card',
        doubleSide: true
      };
    case 'idCard':
      return {
        sectionId: 'idcard-upload',
        title: 'マイナンバーカード',
        fileIdPrefix: 'guide-idcard',
        instruction: 'マイナンバーカードの表面をアップロードしてください。（裏面は不要です）',
        icon: 'id-card',
        singleSide: true
      };
    case 'residenceCard':
      return {
        sectionId: 'residencecard-upload',
        title: '在留カード',
        fileIdPrefix: 'guide-residencecard',
        instruction: '在留カードの表面と裏面をアップロードしてください。',
        icon: 'id-card',
        doubleSide: true
      };
    default:
      console.error('不明な書類タイプ:', documentType);
      return null;
  }
}

/**
 * 書類アップロードHTMLを生成
 * @param {Object} config 設定オブジェクト
 * @returns {string} HTML文字列
 */
function generateDocumentUploadHTML(config) {
  const frontFileId = config.doubleSide ? `${config.fileIdPrefix}-front` : config.fileIdPrefix;
  const backFileId = `${config.fileIdPrefix}-back`;
  
  const frontSideHTML = `
    <div class="card mb-3">
      <div class="card-header">
        ${config.doubleSide ? '表面' : ''}
      </div>
      <div class="card-body text-center">
        <div id="${frontFileId}-preview" class="preview-container mb-2 d-none">
          <img id="${frontFileId}-image" src="#" alt="プレビュー" class="img-fluid rounded">
        </div>
        <div id="${frontFileId}-prompt" class="upload-prompt">
          <i class="fas fa-file-upload fa-3x mb-2"></i>
          <p>ファイルを選択またはカメラで撮影</p>
        </div>
        <div class="mt-3">
          <label class="btn btn-outline-primary me-2" for="${frontFileId}">
            <i class="fas fa-file-upload"></i> ファイルを選択
          </label>
          <button type="button" class="btn btn-outline-secondary camera-button" data-target="${frontFileId}">
            <i class="fas fa-camera"></i> 写真を撮影
          </button>
          <input type="file" id="${frontFileId}" class="d-none" accept="image/*">
        </div>
      </div>
    </div>
  `;
  
  const backSideHTML = config.doubleSide ? `
    <div class="card mb-3">
      <div class="card-header">
        裏面
      </div>
      <div class="card-body text-center">
        <div id="${backFileId}-preview" class="preview-container mb-2 d-none">
          <img id="${backFileId}-image" src="#" alt="プレビュー" class="img-fluid rounded">
        </div>
        <div id="${backFileId}-prompt" class="upload-prompt">
          <i class="fas fa-file-upload fa-3x mb-2"></i>
          <p>ファイルを選択またはカメラで撮影</p>
        </div>
        <div class="mt-3">
          <label class="btn btn-outline-primary me-2" for="${backFileId}">
            <i class="fas fa-file-upload"></i> ファイルを選択
          </label>
          <button type="button" class="btn btn-outline-secondary camera-button" data-target="${backFileId}">
            <i class="fas fa-camera"></i> 写真を撮影
          </button>
          <input type="file" id="${backFileId}" class="d-none" accept="image/*">
        </div>
      </div>
    </div>
  ` : '';
  
  return `
    <div class="document-upload-container mb-4">
      <h5 class="mb-3">
        <i class="fas fa-${config.icon} me-2"></i>${config.title}
      </h5>
      <p class="mb-3">${config.instruction}</p>
      <div class="row">
        <div class="${config.doubleSide ? 'col-md-6' : 'col-md-8 mx-auto'}">
          ${frontSideHTML}
        </div>
        ${config.doubleSide ? `
        <div class="col-md-6">
          ${backSideHTML}
        </div>` : ''}
      </div>
      <div class="small text-muted mt-2">
        <i class="fas fa-info-circle me-1"></i>
        鮮明な写真をアップロードしてください。有効期限内の書類が必要です。
      </div>
    </div>
  `;
}

/**
 * カメラボタンのイベントリスナーを設定
 * @param {HTMLElement} section セクション要素
 * @param {Object} config 設定オブジェクト
 */
function setupDocumentCameraButtons(section, config) {
  const frontFileId = config.doubleSide ? `${config.fileIdPrefix}-front` : config.fileIdPrefix;
  const backFileId = `${config.fileIdPrefix}-back`;
  
  // 表面カメラボタン
  const frontCameraButton = section.querySelector(`.camera-button[data-target="${frontFileId}"]`);
  if (frontCameraButton) {
    frontCameraButton.addEventListener('click', function() {
      openCamera(frontFileId);
    });
  }
  
  // 裏面カメラボタン（両面の場合）
  if (config.doubleSide) {
    const backCameraButton = section.querySelector(`.camera-button[data-target="${backFileId}"]`);
    if (backCameraButton) {
      backCameraButton.addEventListener('click', function() {
        openCamera(backFileId);
      });
    }
  }
  
  // ファイル入力のイベントリスナー
  const fileInputs = section.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        handleFileSelection(this.id, this.files[0]);
      }
    });
  });
}

/**
 * カメラモーダルを開く
 * @param {string} targetId ターゲットのファイル入力ID
 */
function openCamera(targetId) {
  console.log('カメラを開く:', targetId);
  
  // カメラモーダルの作成
  const modalId = 'camera-modal';
  let modal = document.getElementById(modalId);
  
  // 既存のモーダルがあれば削除
  if (modal) {
    modal.remove();
  }
  
  // カメラモーダルを作成
  modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal fade';
  modal.setAttribute('tabindex', '-1');
  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">写真を撮影</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <div id="camera-container" class="mb-3">
            <video id="camera-preview" class="w-100 rounded" autoplay playsinline></video>
          </div>
          <button id="capture-button" class="btn btn-primary">
            <i class="fas fa-camera me-2"></i>撮影する
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Bootstrapモーダルの初期化
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  
  // カメラのセットアップ
  const video = document.getElementById('camera-preview');
  let stream = null;
  
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    .then(function(cameraStream) {
      stream = cameraStream;
      video.srcObject = stream;
    })
    .catch(function(err) {
      console.error('カメラのアクセスに失敗しました:', err);
      alert('カメラを利用できません。デバイスのカメラへのアクセスを許可してください。');
      modalInstance.hide();
    });
  
  // 撮影ボタンのイベントリスナー
  const captureButton = document.getElementById('capture-button');
  if (captureButton) {
    captureButton.addEventListener('click', function() {
      if (!stream) return;
      
      // 画像のキャプチャ
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // ビデオサイズに合わせてキャンバスを設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // キャンバスに描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      canvas.toBlob(function(blob) {
        // Fileオブジェクトに変換
        const fileName = `${targetId}_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // ファイル入力を更新
        handleFileSelection(targetId, file);
        
        // モーダルを閉じる
        modalInstance.hide();
      }, 'image/jpeg', 0.95);
    });
  }
  
  // モーダルが閉じられたときのイベント
  modal.addEventListener('hidden.bs.modal', function() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  });
}

/**
 * ファイル選択の処理
 * @param {string} targetId ターゲットの入力ID
 * @param {File} file 選択されたファイル
 */
function handleFileSelection(targetId, file) {
  console.log('ファイル選択:', targetId, file.name);
  
  // fileInputを取得
  const fileInput = document.getElementById(targetId);
  if (!fileInput) return;
  
  // DataTransferオブジェクトを使用してファイルを設定
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;
  
  // プレビュー更新
  updatePreview(targetId, file);
}

/**
 * プレビューの更新
 * @param {string} targetId ターゲットID
 * @param {File} file ファイル
 */
function updatePreview(targetId, file) {
  // プレビュー要素の取得
  const previewContainer = document.getElementById(`${targetId}-preview`);
  const previewImage = document.getElementById(`${targetId}-image`);
  const promptDiv = document.getElementById(`${targetId}-prompt`);
  
  if (!previewContainer || !previewImage || !promptDiv) return;
  
  // ファイルの読み込み
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImage.src = e.target.result;
    previewContainer.classList.remove('d-none');
    promptDiv.classList.add('d-none');
  };
  reader.readAsDataURL(file);
}

/**
 * ファイル入力フィールドのイベントセットアップ
 */
function setupDocumentInputs() {
  const fileInputs = document.querySelectorAll('.document-upload input[type="file"]');
  
  fileInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      handleFileChange(e.target);
    });
  });
}

/**
 * ファイル変更時の処理
 * @param {HTMLInputElement} input ファイル入力要素
 */
function handleFileChange(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // ファイルサイズ検証（最大10MB）
    if (file.size > 10 * 1024 * 1024) {
      showError('ファイルサイズが大きすぎます（最大10MB）');
      input.value = '';
      return;
    }
    
    // 親のアップロードコンテナを特定
    const uploadContainer = input.closest('.document-file-container');
    if (!uploadContainer) return;
    
    // プレビューエリアを特定または作成
    let previewContainer = uploadContainer.querySelector('.document-preview-container');
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.className = 'document-preview-container mt-2';
      uploadContainer.appendChild(previewContainer);
    }
    
    // アップロードプロンプトを非表示
    const uploadPrompt = uploadContainer.querySelector('.upload-prompt');
    if (uploadPrompt) {
      uploadPrompt.classList.add('d-none');
    }
    
    // 削除ボタンを表示
    const removeBtn = uploadContainer.querySelector('.btn-remove-file');
    if (removeBtn) {
      removeBtn.classList.remove('d-none');
    }
    
    // ファイル名表示とプレビュー
    const reader = new FileReader();
    reader.onload = function(e) {
      previewContainer.innerHTML = '';
      
      if (file.type.startsWith('image/')) {
        // 画像ファイルの場合
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'img-preview img-fluid';
        img.alt = 'Document Preview';
        previewContainer.appendChild(img);
      } else {
        // PDFなどの場合
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        fileInfo.innerHTML = `<i class="fas fa-file-alt me-2"></i>${file.name}`;
        previewContainer.appendChild(fileInfo);
      }
    };
    
    reader.readAsDataURL(file);
  }
}

/**
 * 削除ボタンのイベントセットアップ
 */
function setupDocumentRemoveButtons() {
  const removeButtons = document.querySelectorAll('.btn-remove-file');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const container = this.closest('.document-file-container');
      if (!container) return;
      
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
      
      const previewContainer = container.querySelector('.document-preview-container');
      if (previewContainer) {
        previewContainer.innerHTML = '';
      }
      
      // アップロードプロンプトを再表示
      const uploadPrompt = container.querySelector('.upload-prompt');
      if (uploadPrompt) {
        uploadPrompt.classList.remove('d-none');
      }
      
      // 削除ボタンを非表示
      this.classList.add('d-none');
    });
  });
}

/**
 * ドロップ＆ドラッグ機能のセットアップ
 */
function setupDocumentPreviews() {
  const dropAreas = document.querySelectorAll('.document-file-container');
  
  dropAreas.forEach(area => {
    area.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add('drag-over');
    });
    
    area.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('drag-over');
    });
    
    area.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('drag-over');
      
      const fileInput = this.querySelector('input[type="file"]');
      if (fileInput && e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        handleFileChange(fileInput);
      }
    });
  });
}

/**
 * フォーム送信時にファイルデータを収集
 * @returns {Object} 収集したファイルデータ
 */
function collectDocumentFiles() {
  const documentType = document.getElementById('guide-document-type').value;
  const result = {
    type: documentType,
    files: {}
  };
  
  // 選択された書類タイプに応じたセクションからファイルを収集
  if (documentType.includes('passport')) {
    const passportFile = document.getElementById('guide-passport-file');
    if (passportFile && passportFile.files[0]) {
      result.files.passport = passportFile.files[0];
    }
  } else if (documentType.includes('driverLicense')) {
    const frontFile = document.getElementById('guide-license-front');
    const backFile = document.getElementById('guide-license-back');
    
    if (frontFile && frontFile.files[0]) {
      result.files.licenseFront = frontFile.files[0];
    }
    
    if (backFile && backFile.files[0]) {
      result.files.licenseBack = backFile.files[0];
    }
  } else if (documentType.includes('mynumber') || documentType.includes('idCard')) {
    const frontFile = document.getElementById('guide-idcard-front');
    const backFile = document.getElementById('guide-idcard-back');
    
    if (frontFile && frontFile.files[0]) {
      result.files.idCardFront = frontFile.files[0];
    }
    
    if (backFile && backFile.files[0]) {
      result.files.idCardBack = backFile.files[0];
    }
  } else if (documentType.includes('residenceCard')) {
    const frontFile = document.getElementById('guide-residencecard-front');
    const backFile = document.getElementById('guide-residencecard-back');
    
    if (frontFile && frontFile.files[0]) {
      result.files.residenceCardFront = frontFile.files[0];
    }
    
    if (backFile && backFile.files[0]) {
      result.files.residenceCardBack = backFile.files[0];
    }
  }
  
  return result;
}

/**
 * エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showError(message) {
  const errorContainer = document.getElementById('document-error');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove('d-none');
    
    // 3秒後に非表示
    setTimeout(() => {
      errorContainer.classList.add('d-none');
    }, 3000);
  }
}