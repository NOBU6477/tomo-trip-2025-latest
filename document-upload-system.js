/**
 * 身分証明書アップロードシステム
 * ファイル選択、プレビュー、カメラ撮影機能を実装
 */

(function() {
  'use strict';
  
  console.log('📄 身分証明書アップロードシステム開始');
  
  // 初期化
  function initialize() {
    setupDocumentUpload();
    setupIdTypeSelector();
  }
  
  // 身分証明書アップロードの設定
  function setupDocumentUpload() {
    // 観光客用
    setupFileUpload('tourist-id-front', 'tourist-id-front-preview');
    setupFileUpload('tourist-id-back', 'tourist-id-back-preview');
    
    // ガイド用
    setupFileUpload('guide-id-front', 'guide-id-front-preview');
    setupFileUpload('guide-id-back', 'guide-id-back-preview');
    
    // プロフィール写真
    setupFileUpload('guide-profile-photo', 'guide-profile-preview');
    setupFileUpload('tourist-profile-photo', 'tourist-profile-preview');
  }
  
  // ファイルアップロードの設定
  function setupFileUpload(inputId, previewId) {
    const fileInput = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!fileInput) return;
    
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file, inputId, previewId);
      }
    });
    
    // ドラッグ&ドロップ対応
    const container = fileInput.closest('.input-group') || fileInput.parentElement;
    if (container) {
      setupDragDrop(container, fileInput);
    }
  }
  
  // ファイルアップロード処理
  function handleFileUpload(file, inputId, previewId) {
    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      showAlert('ファイルサイズは5MB以下にしてください', 'danger');
      return;
    }
    
    // ファイル形式チェック
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      showAlert('JPGまたはPNG形式のファイルを選択してください', 'danger');
      return;
    }
    
    // プレビュー表示
    const reader = new FileReader();
    reader.onload = function(e) {
      displayPreview(e.target.result, inputId, previewId);
    };
    reader.readAsDataURL(file);
    
    console.log(`📄 ファイルアップロード完了: ${file.name}`);
  }
  
  // プレビュー表示
  function displayPreview(dataURL, inputId, previewId) {
    const preview = document.getElementById(previewId);
    const deleteBtn = document.getElementById(previewId.replace('preview', 'delete'));
    
    if (preview) {
      // 強制的にプレビュー表示
      preview.src = dataURL;
      preview.classList.remove('d-none');
      preview.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        max-width: 300px !important;
        max-height: 200px !important;
        object-fit: cover !important;
        border: 2px solid #dee2e6 !important;
        border-radius: 8px !important;
        margin: 10px 0 !important;
      `;
      
      // プロフィール写真の場合は円形に
      if (previewId.includes('profile')) {
        preview.style.cssText += `
          width: 150px !important;
          height: 150px !important;
          border-radius: 50% !important;
          border: 3px solid #dee2e6 !important;
        `;
      }
      
      // 削除ボタンを表示
      if (deleteBtn) {
        deleteBtn.classList.remove('d-none');
        deleteBtn.style.display = 'inline-block';
        setupDeleteButton(deleteBtn, inputId, previewId);
      }
      
      // 成功フィードバック
      const fileInput = document.getElementById(inputId);
      if (fileInput) {
        fileInput.classList.add('is-valid');
      }
      
      console.log(`📸 プレビュー表示完了: ${previewId}`);
      
      // 強制的にプレビューを可視化
      setTimeout(() => {
        preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
  
  // 削除ボタンの設定
  function setupDeleteButton(deleteBtn, inputId, previewId) {
    deleteBtn.onclick = function() {
      // ファイル入力をクリア
      const fileInput = document.getElementById(inputId);
      if (fileInput) {
        fileInput.value = '';
        fileInput.classList.remove('is-valid');
      }
      
      // プレビューを非表示
      const preview = document.getElementById(previewId);
      if (preview) {
        preview.src = '';
        preview.classList.add('d-none');
        preview.style.display = 'none';
      }
      
      // 削除ボタンを非表示
      deleteBtn.classList.add('d-none');
      deleteBtn.style.display = 'none';
    };
  }
  
  // 身分証明書種類選択の設定
  function setupIdTypeSelector() {
    // 観光客用
    setupIdTypeChange('tourist-id-type', 'tourist-id-back-container');
    
    // ガイド用
    setupIdTypeChange('guide-id-type', 'guide-id-back-container');
  }
  
  // 身分証明書種類変更時の処理
  function setupIdTypeChange(selectId, backContainerId) {
    const select = document.getElementById(selectId);
    const backContainer = document.getElementById(backContainerId);
    
    if (!select || !backContainer) return;
    
    select.addEventListener('change', function() {
      const selectedType = this.value;
      
      // 運転免許証の場合は裏面も必要
      if (selectedType === 'drivers_license') {
        backContainer.classList.remove('d-none');
        const backInput = backContainer.querySelector('input[type="file"]');
        if (backInput) {
          backInput.required = true;
        }
      } else {
        backContainer.classList.add('d-none');
        const backInput = backContainer.querySelector('input[type="file"]');
        if (backInput) {
          backInput.required = false;
          // 既存ファイルをクリア
          backInput.value = '';
          backInput.classList.remove('is-valid');
        }
        
        // プレビューもクリア
        const preview = backContainer.querySelector('img');
        const deleteBtn = backContainer.querySelector('button[id$="-delete"]');
        if (preview) {
          preview.src = '';
          preview.classList.add('d-none');
        }
        if (deleteBtn) {
          deleteBtn.classList.add('d-none');
        }
      }
    });
  }
  
  // ドラッグ&ドロップの設定
  function setupDragDrop(container, fileInput) {
    container.addEventListener('dragover', function(e) {
      e.preventDefault();
      container.classList.add('border-primary', 'bg-light');
    });
    
    container.addEventListener('dragleave', function(e) {
      e.preventDefault();
      container.classList.remove('border-primary', 'bg-light');
    });
    
    container.addEventListener('drop', function(e) {
      e.preventDefault();
      container.classList.remove('border-primary', 'bg-light');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        // ファイル入力に設定
        fileInput.files = files;
        
        // changeイベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    });
  }
  
  // カメラボタンの設定
  function setupCameraButtons() {
    const cameraButtons = document.querySelectorAll('.document-camera');
    cameraButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        openCameraModal(targetId);
      });
    });
  }
  
  // カメラモーダルを開く
  function openCameraModal(targetId) {
    // 既存のカメラモーダルがあるか確認
    let modal = document.getElementById('camera-modal');
    if (!modal) {
      modal = createCameraModal();
    }
    
    // モーダルにターゲットIDを設定
    modal.setAttribute('data-target', targetId);
    
    // モーダルを表示
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // カメラを開始
    startCamera(modal);
  }
  
  // カメラモーダル作成
  function createCameraModal() {
    const modal = document.createElement('div');
    modal.id = 'camera-modal';
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">写真撮影</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <video id="camera-video" autoplay playsinline style="width: 100%; max-width: 500px; border-radius: 10px;"></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div id="camera-preview" class="mt-3" style="display: none;">
              <img id="captured-image" class="img-fluid" style="max-width: 300px; border-radius: 10px;">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary" id="capture-btn">撮影</button>
            <button type="button" class="btn btn-success d-none" id="use-photo-btn">この写真を使う</button>
            <button type="button" class="btn btn-outline-primary d-none" id="retake-btn">撮り直し</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // ボタンイベントを設定
    modal.querySelector('#capture-btn').onclick = () => capturePhoto(modal);
    modal.querySelector('#use-photo-btn').onclick = () => usePhoto(modal);
    modal.querySelector('#retake-btn').onclick = () => retakePhoto(modal);
    
    // モーダル閉じる時にカメラを停止
    modal.addEventListener('hidden.bs.modal', () => stopCamera(modal));
    
    return modal;
  }
  
  // カメラ開始
  async function startCamera(modal) {
    const video = modal.querySelector('#camera-video');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // 背面カメラを優先
      });
      video.srcObject = stream;
    } catch (error) {
      console.error('カメラアクセスエラー:', error);
      showAlert('カメラにアクセスできませんでした。ファイル選択をご利用ください。', 'warning');
    }
  }
  
  // 写真撮影
  function capturePhoto(modal) {
    const video = modal.querySelector('#camera-video');
    const canvas = modal.querySelector('#camera-canvas');
    const preview = modal.querySelector('#camera-preview');
    const capturedImage = modal.querySelector('#captured-image');
    
    // キャンバスに動画フレームを描画
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // プレビュー表示
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    capturedImage.src = dataURL;
    preview.style.display = 'block';
    video.style.display = 'none';
    
    // ボタンを切り替え
    modal.querySelector('#capture-btn').classList.add('d-none');
    modal.querySelector('#use-photo-btn').classList.remove('d-none');
    modal.querySelector('#retake-btn').classList.remove('d-none');
  }
  
  // 撮り直し
  function retakePhoto(modal) {
    const video = modal.querySelector('#camera-video');
    const preview = modal.querySelector('#camera-preview');
    
    // 表示を元に戻す
    video.style.display = 'block';
    preview.style.display = 'none';
    
    // ボタンを切り替え
    modal.querySelector('#capture-btn').classList.remove('d-none');
    modal.querySelector('#use-photo-btn').classList.add('d-none');
    modal.querySelector('#retake-btn').classList.add('d-none');
  }
  
  // 写真を使用
  function usePhoto(modal) {
    const canvas = modal.querySelector('#camera-canvas');
    const targetId = modal.getAttribute('data-target');
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    
    // ファイル入力に設定
    const fileInput = document.getElementById(targetId);
    if (fileInput) {
      // DataURLをFileオブジェクトに変換
      const file = dataURLToFile(dataURL, 'camera_photo.jpg');
      
      // ファイル入力に設定
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      
      // プレビュー表示
      const previewId = targetId.replace(/-(front|back|photo)$/, '-$1-preview');
      displayPreview(dataURL, targetId, previewId);
    }
    
    // モーダルを閉じる
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();
  }
  
  // カメラ停止
  function stopCamera(modal) {
    const video = modal.querySelector('#camera-video');
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  }
  
  // DataURLをFileオブジェクトに変換
  function dataURLToFile(dataURL, filename) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  
  // アラート表示
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // 自動削除
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }
  
  // アラートコンテナ作成
  function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; max-width: 400px; z-index: 9999;';
    document.body.appendChild(container);
    return container;
  }
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();