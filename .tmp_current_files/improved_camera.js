/**
 * 証明写真および身分証明書のカメラ撮影機能を改善したスクリプト
 * モダンなデザインとUXを提供
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('改善されたカメラ機能を初期化します');
  
  // カメラボタン要素を取得
  const cameraButtons = document.querySelectorAll('.camera-btn, [id$="-camera-btn"]');
  
  // 各カメラボタンにイベントリスナーを設定
  cameraButtons.forEach(button => {
    button.addEventListener('click', handleCameraButtonClick);
  });
  
  // ファイル選択ボタンのイベントリスナーを設定
  const fileButtons = document.querySelectorAll('.file-btn, [id$="-file-btn"]');
  fileButtons.forEach(button => {
    button.addEventListener('click', handleFileButtonClick);
  });
  
  /**
   * カメラボタンのクリックハンドラ
   */
  function handleCameraButtonClick(e) {
    e.preventDefault();
    
    // 対象のファイル入力要素を特定
    let fileInput = null;
    const buttonId = this.id;
    
    if (buttonId === 'id-photo-camera-btn') {
      fileInput = document.getElementById('id-photo-input');
    } else if (buttonId.includes('passport')) {
      fileInput = document.querySelector('#passport-upload input[type="file"]');
    } else if (buttonId.includes('license')) {
      fileInput = document.querySelector('#license-upload input[type="file"]');
    } else if (buttonId.includes('idcard')) {
      fileInput = document.querySelector('#idcard-upload input[type="file"]');
    } else if (buttonId.includes('residencecard')) {
      fileInput = document.querySelector('#residencecard-upload input[type="file"]');
    } else {
      // 近くのinput[type="file"]を探す
      const parent = this.closest('.mb-3, .document-upload-section');
      if (parent) {
        fileInput = parent.querySelector('input[type="file"]');
      }
    }
    
    if (!fileInput) {
      console.error('対応するファイル入力要素が見つかりません:', buttonId);
      return;
    }
    
    console.log('カメラを起動します:', buttonId, fileInput);
    
    // 既存のカメラモーダルを削除
    removeExistingCameraModal();
    
    // 新しいカメラモーダルを作成
    createModernCameraModal(fileInput);
  }
  
  /**
   * ファイル選択ボタンのクリックハンドラ
   */
  function handleFileButtonClick(e) {
    e.preventDefault();
    
    // 対象のファイル入力要素を特定
    let fileInput = null;
    const buttonId = this.id;
    
    if (buttonId === 'id-photo-file-btn') {
      fileInput = document.getElementById('id-photo-input');
    } else if (buttonId.includes('passport')) {
      fileInput = document.querySelector('#passport-upload input[type="file"]');
    } else if (buttonId.includes('license')) {
      fileInput = document.querySelector('#license-upload input[type="file"]');
    } else if (buttonId.includes('idcard')) {
      fileInput = document.querySelector('#idcard-upload input[type="file"]');
    } else if (buttonId.includes('residencecard')) {
      fileInput = document.querySelector('#residencecard-upload input[type="file"]');
    } else {
      // 近くのinput[type="file"]を探す
      const parent = this.closest('.mb-3, .document-upload-section');
      if (parent) {
        fileInput = parent.querySelector('input[type="file"]');
      }
    }
    
    if (fileInput) {
      fileInput.click();
    }
  }
  
  /**
   * モダンなカメラモーダルを作成
   */
  function createModernCameraModal(fileInput) {
    const modal = document.createElement('div');
    modal.id = 'modern-camera-modal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    
    const labelText = fileInput.closest('.document-upload-section') ? 
      '書類を撮影' : '証明写真を撮影';
    
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-camera"></i> ${labelText}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div class="position-relative">
              <video id="camera-preview" class="w-100" autoplay playsinline></video>
              <canvas id="camera-canvas" class="d-none"></canvas>
              <div id="camera-overlay" class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                <div class="camera-guide">
                  <div class="camera-guide-inner"></div>
                </div>
                <p class="mt-2 text-white text-center px-3 py-1 rounded" style="background-color: rgba(0,0,0,0.5);">
                  枠内に${labelText.includes('書類') ? '書類' : '顔'}を合わせてください
                </p>
              </div>
              <div id="camera-controls" class="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center" style="background: rgba(0,0,0,0.5);">
                <button id="take-photo-btn" class="btn btn-light btn-lg rounded-circle mx-2">
                  <i class="bi bi-camera"></i>
                </button>
                <button id="switch-camera-btn" class="btn btn-outline-light rounded-circle mx-2">
                  <i class="bi bi-arrow-repeat"></i>
                </button>
              </div>
              <div id="capture-result" class="position-absolute top-0 start-0 w-100 h-100 bg-light d-none">
                <img id="captured-image" class="img-fluid w-100" src="" alt="撮影した画像">
              </div>
            </div>
          </div>
          <div class="modal-footer" id="camera-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary d-none" id="use-photo-btn">
              <i class="bi bi-check-lg"></i> この写真を使用
            </button>
            <button type="button" class="btn btn-outline-primary d-none" id="retake-photo-btn">
              <i class="bi bi-arrow-counterclockwise"></i> 撮り直す
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // カスタムスタイルを追加
    addCameraStyles();
    
    // モーダル表示後にカメラを初期化
    const modalElement = document.getElementById('modern-camera-modal');
    const bsModal = new bootstrap.Modal(modalElement);
    
    modalElement.addEventListener('shown.bs.modal', function() {
      initializeCamera(fileInput);
    });
    
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      modalElement.remove();
    });
    
    bsModal.show();
  }
  
  /**
   * カメラスタイルをページに追加
   */
  function addCameraStyles() {
    if (document.getElementById('modern-camera-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modern-camera-styles';
    style.textContent = `
      #camera-preview {
        max-height: 80vh;
        background-color: #000;
      }
      .camera-guide {
        border: 2px dashed rgba(255,255,255,0.8);
        border-radius: 8px;
        width: 80%;
        height: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .camera-guide-inner {
        border: 1px solid rgba(255,255,255,0.5);
        border-radius: 4px;
        width: 96%;
        height: 92%;
      }
      #take-photo-btn {
        width: 70px;
        height: 70px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #take-photo-btn i {
        font-size: 1.8rem;
      }
      #switch-camera-btn {
        width: 50px;
        height: 50px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      }
      #captured-image {
        object-fit: contain;
        max-height: 80vh;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * 既存のカメラモーダルを削除
   */
  function removeExistingCameraModal() {
    const existingModal = document.getElementById('modern-camera-modal');
    if (existingModal) {
      const bsModal = bootstrap.Modal.getInstance(existingModal);
      if (bsModal) {
        bsModal.hide();
      }
      existingModal.remove();
    }
    
    // 古いカメラモーダルも検索して削除
    const oldModals = document.querySelectorAll('.camera-modal');
    oldModals.forEach(modal => modal.remove());
  }
  
  /**
   * カメラストリームのグローバル変数
   */
  let mediaStream = null;
  let facingMode = 'environment'; // 'environment'(背面カメラ)または'user'(前面カメラ)
  
  /**
   * カメラを初期化
   */
  function initializeCamera(fileInput) {
    const constraints = {
      video: { 
        facingMode: facingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };
    
    const video = document.getElementById('camera-preview');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const switchCameraBtn = document.getElementById('switch-camera-btn');
    
    // カメラの起動
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        mediaStream = stream;
        video.srcObject = stream;
        
        // 撮影ボタンのイベントハンドラ
        takePhotoBtn.addEventListener('click', function() {
          capturePhoto(fileInput);
        });
        
        // カメラ切り替えボタンのイベントハンドラ
        switchCameraBtn.addEventListener('click', function() {
          facingMode = facingMode === 'environment' ? 'user' : 'environment';
          stopCamera();
          initializeCamera(fileInput);
        });
      })
      .catch(function(err) {
        console.error('カメラの起動に失敗しました:', err);
        
        const modalBody = document.querySelector('#modern-camera-modal .modal-body');
        modalBody.innerHTML = `
          <div class="alert alert-danger m-3">
            <p><strong>カメラが使用できません</strong></p>
            <p>${err.message || 'ブラウザの設定でカメラへのアクセスを許可してください。'}</p>
          </div>
        `;
      });
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto(fileInput) {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('camera-canvas');
    const captureResult = document.getElementById('capture-result');
    const capturedImage = document.getElementById('captured-image');
    const usePhotoBtn = document.getElementById('use-photo-btn');
    const retakePhotoBtn = document.getElementById('retake-photo-btn');
    
    // キャンバスのサイズをビデオに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 写真をキャンバスに描画
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 撮影した画像をimg要素に表示
    capturedImage.src = canvas.toDataURL('image/jpeg');
    
    // 結果表示を表示、コントロールを調整
    captureResult.classList.remove('d-none');
    document.getElementById('camera-controls').classList.add('d-none');
    document.getElementById('camera-overlay').classList.add('d-none');
    usePhotoBtn.classList.remove('d-none');
    retakePhotoBtn.classList.remove('d-none');
    
    // 写真を使用ボタンのイベントハンドラ
    usePhotoBtn.onclick = function() {
      // キャンバスの画像をBlobに変換
      canvas.toBlob(function(blob) {
        // File オブジェクトを作成
        const imageFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        
        // DataTransferオブジェクトを作成して、FileListを模倣
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFile);
        
        // FileInputのfiles属性を設定
        fileInput.files = dataTransfer.files;
        
        // changeイベントを発火させてファイル選択処理を起動
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        
        // モーダルを閉じる
        const modal = bootstrap.Modal.getInstance(document.getElementById('modern-camera-modal'));
        modal.hide();
      }, 'image/jpeg', 0.95);
    };
    
    // 撮り直しボタンのイベントハンドラ
    retakePhotoBtn.onclick = function() {
      captureResult.classList.add('d-none');
      document.getElementById('camera-controls').classList.remove('d-none');
      document.getElementById('camera-overlay').classList.remove('d-none');
      usePhotoBtn.classList.add('d-none');
      retakePhotoBtn.classList.add('d-none');
    };
  }
  
  /**
   * カメラストリームを停止
   */
  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  // ファイル入力要素のchangeイベントハンドラを設定
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', handleFileSelect);
  });
  
  /**
   * ファイル選択イベントのハンドラ
   */
  function handleFileSelect(e) {
    const fileInput = e.target;
    const file = fileInput.files[0];
    
    if (!file) return;
    
    // プレビューの種類を特定
    let previewId = '';
    let previewContainer = null;
    let imageElement = null;
    
    if (fileInput.id === 'id-photo-input') {
      // 証明写真の場合
      previewId = 'id-photo-preview';
      const placeholder = document.getElementById('id-photo-placeholder');
      if (placeholder) placeholder.classList.add('d-none');
      
      previewContainer = document.getElementById(previewId);
      if (previewContainer) {
        previewContainer.classList.remove('d-none');
        imageElement = previewContainer.querySelector('img');
      }
      
      // 削除ボタンを表示
      const removeBtn = document.getElementById('id-photo-remove-btn');
      if (removeBtn) removeBtn.classList.remove('d-none');
    } else {
      // 書類アップロードの場合
      const section = fileInput.closest('.document-upload-section');
      if (section) {
        previewContainer = section.querySelector('.preview-container');
        if (previewContainer) {
          previewContainer.classList.remove('d-none');
          imageElement = previewContainer.querySelector('img');
        }
        
        // プレースホルダを非表示
        const placeholder = section.querySelector('.placeholder-container');
        if (placeholder) placeholder.classList.add('d-none');
        
        // 削除ボタンを表示
        const removeBtn = section.querySelector('.remove-file-btn');
        if (removeBtn) removeBtn.classList.remove('d-none');
      }
    }
    
    // プレビュー画像を表示
    if (imageElement) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageElement.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // 削除ボタンのイベントハンドラを設定
  const removeButtons = document.querySelectorAll('.remove-file-btn, #id-photo-remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', handleRemoveFile);
  });
  
  /**
   * ファイル削除ボタンのイベントハンドラ
   */
  function handleRemoveFile(e) {
    const button = e.target.closest('button');
    
    if (button.id === 'id-photo-remove-btn') {
      // 証明写真の削除
      const fileInput = document.getElementById('id-photo-input');
      if (fileInput) fileInput.value = '';
      
      const preview = document.getElementById('id-photo-preview');
      if (preview) preview.classList.add('d-none');
      
      const placeholder = document.getElementById('id-photo-placeholder');
      if (placeholder) placeholder.classList.remove('d-none');
      
      button.classList.add('d-none');
    } else {
      // 書類ファイルの削除
      const section = button.closest('.document-upload-section');
      if (section) {
        const fileInput = section.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        const preview = section.querySelector('.preview-container');
        if (preview) preview.classList.add('d-none');
        
        const placeholder = section.querySelector('.placeholder-container');
        if (placeholder) placeholder.classList.remove('d-none');
        
        button.classList.add('d-none');
      }
    }
  }
});