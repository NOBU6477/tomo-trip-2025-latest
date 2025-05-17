/**
 * 証明写真カメラ機能の決定版
 * 一回で確実に写真が反映される実装
 */
(function() {
  'use strict';
  
  // 現在のカメラストリーム
  let currentStream = null;
  
  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * 初期化
   */
  function init() {
    console.log('証明写真カメラ直接修正を初期化');
    
    // モーダルが表示されたときにボタンを設定
    document.body.addEventListener('shown.bs.modal', function(event) {
      if (!event.target || !event.target.id) return;
      
      console.log('モーダルが表示されました:', event.target.id);
      setupModalButtons(event.target);
    });
    
    // 既存のボタンを設定
    setupExistingButtons();
  }
  
  /**
   * モーダル内のボタンを設定
   */
  function setupModalButtons(modal) {
    // カメラボタン
    const cameraButtons = modal.querySelectorAll('button[id*="camera-btn"], button[id*="camera_btn"]');
    cameraButtons.forEach(button => {
      if (button.hasAttribute('data-final-fix')) return;
      
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ボタンのIDからターゲットを決定
        let targetType = 'generic';
        if (button.id.includes('id-photo-camera-btn')) {
          targetType = 'single';
        } else if (button.id.includes('front-camera')) {
          targetType = 'front';
        } else if (button.id.includes('back-camera')) {
          targetType = 'back';
        }
        
        console.log('カメラボタンがクリックされました:', targetType);
        showDirectCamera(targetType);
      });
      
      button.setAttribute('data-final-fix', 'true');
    });
    
    // ファイル選択ボタン
    const fileButtons = modal.querySelectorAll('button[id*="file-btn"], button[id*="select"]');
    fileButtons.forEach(button => {
      if (button.hasAttribute('data-final-fix')) return;
      
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ボタンのIDからターゲットを決定
        let targetInputId = null;
        if (button.id.includes('id-photo-file-btn')) {
          targetInputId = 'id-photo-input';
        } else if (button.id.includes('front-file')) {
          targetInputId = 'id-photo-front-input';
        } else if (button.id.includes('back-file')) {
          targetInputId = 'id-photo-back-input';
        } else {
          // 親要素からファイル入力を探す
          const parent = button.closest('.form-group, .mb-3');
          if (parent) {
            const fileInput = parent.querySelector('input[type="file"]');
            if (fileInput) targetInputId = fileInput.id;
          }
        }
        
        if (targetInputId) {
          console.log('ファイル選択ボタンがクリックされました:', targetInputId);
          const fileInput = document.getElementById(targetInputId);
          if (fileInput) fileInput.click();
        }
      });
      
      button.setAttribute('data-final-fix', 'true');
    });
    
    // ファイル入力
    const fileInputs = modal.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      if (input.hasAttribute('data-final-fix')) return;
      
      input.addEventListener('change', function(e) {
        if (!this.files || !this.files[0]) return;
        
        const file = this.files[0];
        const inputId = this.id;
        
        console.log('ファイルが選択されました:', inputId, file.name);
        updatePhotoPreview(inputId, file);
      });
      
      input.setAttribute('data-final-fix', 'true');
    });
    
    // ラジオボタン
    setupPhotoTypeRadios(modal);
  }
  
  /**
   * 既存のボタンを設定
   */
  function setupExistingButtons() {
    // カメラボタン
    document.querySelectorAll('button[id*="camera-btn"], button[id*="camera_btn"]').forEach(button => {
      if (button.hasAttribute('data-final-fix')) return;
      
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ボタンのIDからターゲットを決定
        let targetType = 'generic';
        if (button.id.includes('id-photo-camera-btn')) {
          targetType = 'single';
        } else if (button.id.includes('front-camera')) {
          targetType = 'front';
        } else if (button.id.includes('back-camera')) {
          targetType = 'back';
        }
        
        console.log('カメラボタンがクリックされました:', targetType);
        showDirectCamera(targetType);
      });
      
      button.setAttribute('data-final-fix', 'true');
    });
    
    // ファイル選択ボタン
    document.querySelectorAll('button[id*="file-btn"], button[id*="select"]').forEach(button => {
      if (button.hasAttribute('data-final-fix')) return;
      
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ボタンのIDからターゲットを決定
        let targetInputId = null;
        if (button.id.includes('id-photo-file-btn')) {
          targetInputId = 'id-photo-input';
        } else if (button.id.includes('front-file')) {
          targetInputId = 'id-photo-front-input';
        } else if (button.id.includes('back-file')) {
          targetInputId = 'id-photo-back-input';
        } else {
          // 親要素からファイル入力を探す
          const parent = button.closest('.form-group, .mb-3');
          if (parent) {
            const fileInput = parent.querySelector('input[type="file"]');
            if (fileInput) targetInputId = fileInput.id;
          }
        }
        
        if (targetInputId) {
          console.log('ファイル選択ボタンがクリックされました:', targetInputId);
          const fileInput = document.getElementById(targetInputId);
          if (fileInput) fileInput.click();
        }
      });
      
      button.setAttribute('data-final-fix', 'true');
    });
    
    // ファイル入力
    document.querySelectorAll('input[type="file"]').forEach(input => {
      if (input.hasAttribute('data-final-fix')) return;
      
      input.addEventListener('change', function(e) {
        if (!this.files || !this.files[0]) return;
        
        const file = this.files[0];
        const inputId = this.id;
        
        console.log('ファイルが選択されました:', inputId, file.name);
        updatePhotoPreview(inputId, file);
      });
      
      input.setAttribute('data-final-fix', 'true');
    });
  }
  
  /**
   * 写真タイプラジオボタンの設定
   */
  function setupPhotoTypeRadios(container) {
    const singleRadio = container.querySelector('#id-photo-type-single');
    const dualRadio = container.querySelector('#id-photo-type-dual');
    
    if (!singleRadio || !dualRadio) return;
    if (singleRadio.hasAttribute('data-final-fix')) return;
    
    const singleSection = document.getElementById('single-photo-section');
    const dualSection = document.getElementById('dual-photo-section');
    
    if (!singleSection || !dualSection) return;
    
    // イベントリスナーを設定
    singleRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('単一写真モードが選択されました');
        singleSection.style.display = 'block';
        singleSection.classList.remove('d-none');
        dualSection.style.display = 'none';
        dualSection.classList.add('d-none');
      }
    });
    
    dualRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('表裏写真モードが選択されました');
        singleSection.style.display = 'none';
        singleSection.classList.add('d-none');
        dualSection.style.display = 'block';
        dualSection.classList.remove('d-none');
      }
    });
    
    // クリックイベントも追加
    singleRadio.addEventListener('click', function() {
      console.log('単一写真モードがクリックされました');
      singleSection.style.display = 'block';
      singleSection.classList.remove('d-none');
      dualSection.style.display = 'none';
      dualSection.classList.add('d-none');
    });
    
    dualRadio.addEventListener('click', function() {
      console.log('表裏写真モードがクリックされました');
      singleSection.style.display = 'none';
      singleSection.classList.add('d-none');
      dualSection.style.display = 'block';
      dualSection.classList.remove('d-none');
    });
    
    // 処理済みフラグ
    singleRadio.setAttribute('data-final-fix', 'true');
    dualRadio.setAttribute('data-final-fix', 'true');
    
    // 初期状態を設定
    if (singleRadio.checked) {
      singleSection.style.display = 'block';
      singleSection.classList.remove('d-none');
      dualSection.style.display = 'none';
      dualSection.classList.add('d-none');
    } else if (dualRadio.checked) {
      singleSection.style.display = 'none';
      singleSection.classList.add('d-none');
      dualSection.style.display = 'block';
      dualSection.classList.remove('d-none');
    }
  }
  
  /**
   * 写真プレビューの更新
   */
  function updatePhotoPreview(inputId, file) {
    console.log('プレビュー更新:', inputId);
    
    // プレビュー要素のIDを決定
    let previewId, placeholderId, removeButtonId;
    if (inputId === 'id-photo-input') {
      previewId = 'id-photo-preview';
      placeholderId = 'id-photo-placeholder';
      removeButtonId = 'id-photo-remove-btn';
    } else if (inputId === 'id-photo-front-input') {
      previewId = 'id-photo-front-preview';
      placeholderId = 'id-photo-front-placeholder';
      removeButtonId = 'id-photo-front-remove-btn';
    } else if (inputId === 'id-photo-back-input') {
      previewId = 'id-photo-back-preview';
      placeholderId = 'id-photo-back-placeholder';
      removeButtonId = 'id-photo-back-remove-btn';
    } else {
      // 汎用的な処理
      const baseId = inputId.replace('-input', '');
      previewId = baseId + '-preview';
      placeholderId = baseId + '-placeholder';
      removeButtonId = baseId + '-remove-btn';
    }
    
    const previewContainer = document.getElementById(previewId);
    const placeholder = document.getElementById(placeholderId);
    const removeButton = document.getElementById(removeButtonId);
    
    // プレビュー画像要素を取得
    let previewImage;
    if (previewContainer) {
      previewImage = previewContainer.querySelector('img');
      if (!previewImage) {
        previewImage = document.getElementById(previewId.replace('preview', 'image'));
      }
    }
    
    if (!previewContainer || !previewImage) {
      console.error('プレビュー要素が見つかりません:', previewId);
      return;
    }
    
    // FileReaderでファイルを読み込み
    const reader = new FileReader();
    reader.onload = function(e) {
      // プレビュー画像を設定
      previewImage.src = e.target.result;
      
      // 表示状態を更新
      if (previewContainer) previewContainer.classList.remove('d-none');
      if (placeholder) placeholder.classList.add('d-none');
      if (removeButton) removeButton.classList.remove('d-none');
      
      console.log('プレビュー表示完了:', previewId);
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * カメラモーダルを表示
   */
  function showDirectCamera(targetType) {
    console.log('カメラモーダルを表示:', targetType);
    
    // 既存のモーダルをクリーンアップ
    const existingModal = document.getElementById('directCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // タイトルの設定
    let title;
    switch (targetType) {
      case 'single':
        title = '証明写真を撮影';
        break;
      case 'front':
        title = '表面写真を撮影';
        break;
      case 'back':
        title = '裏面写真を撮影';
        break;
      default:
        title = '写真を撮影';
    }
    
    // モーダルHTMLの生成
    const modalHTML = `
      <div class="modal fade" id="directCameraModal" tabindex="-1" aria-labelledby="directCameraModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="directCameraModalLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <div id="video-container" class="video-container">
                  <video id="direct-camera-video" class="w-100" playsinline autoplay></video>
                  <canvas id="direct-camera-canvas" class="d-none"></canvas>
                </div>
                <div id="direct-camera-preview" class="preview-container mt-3 text-center d-none">
                  <img id="direct-camera-image" class="img-fluid rounded" alt="プレビュー">
                </div>
                <div id="direct-camera-error" class="alert alert-danger d-none" role="alert">
                  カメラにアクセスできません。ブラウザの設定を確認してください。
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="direct-capture-btn" class="btn btn-primary">撮影する</button>
              <button type="button" id="direct-retake-btn" class="btn btn-outline-primary d-none">撮り直す</button>
              <button type="button" id="direct-use-btn" class="btn btn-success d-none">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // モーダル要素とBootstrapモーダルインスタンスを取得
    const modalElement = document.getElementById('directCameraModal');
    const modal = new bootstrap.Modal(modalElement);
    
    // モーダルを表示
    modal.show();
    
    // カメラ関連の要素を取得
    const video = document.getElementById('direct-camera-video');
    const canvas = document.getElementById('direct-camera-canvas');
    const captureBtn = document.getElementById('direct-capture-btn');
    const retakeBtn = document.getElementById('direct-retake-btn');
    const useBtn = document.getElementById('direct-use-btn');
    const previewContainer = document.getElementById('direct-camera-preview');
    const previewImage = document.getElementById('direct-camera-image');
    const errorAlert = document.getElementById('direct-camera-error');
    
    // モーダルが表示されたときにカメラを起動
    modalElement.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダルが閉じられたときにカメラを停止
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // 撮影ボタンのイベント
    captureBtn.addEventListener('click', function() {
      capturePhoto();
    });
    
    // 撮り直しボタンのイベント
    retakeBtn.addEventListener('click', function() {
      retakePhoto();
    });
    
    // 写真使用ボタンのイベント
    useBtn.addEventListener('click', function() {
      usePhoto();
    });
    
    /**
     * カメラを起動
     */
    function startCamera() {
      // モバイルデバイスの場合は背面カメラを優先
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile ? 'environment' : 'user'
        }
      };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(mediaStream) {
          currentStream = mediaStream;
          video.srcObject = currentStream;
          errorAlert.classList.add('d-none');
        })
        .catch(function(err) {
          console.error('カメラアクセスエラー:', err);
          errorAlert.classList.remove('d-none');
          errorAlert.textContent = 'カメラエラー: ' + err.message;
        });
    }
    
    /**
     * カメラを停止
     */
    function stopCamera() {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
      }
    }
    
    /**
     * 写真を撮影
     */
    function capturePhoto() {
      // ビデオの内容をキャンバスに描画
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー画像の表示
      const imageDataURL = canvas.toDataURL('image/jpeg');
      previewImage.src = imageDataURL;
      
      // UI表示の切り替え
      video.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      useBtn.classList.remove('d-none');
    }
    
    /**
     * 写真を撮り直す
     */
    function retakePhoto() {
      // UI表示を元に戻す
      video.classList.remove('d-none');
      previewContainer.classList.add('d-none');
      captureBtn.classList.remove('d-none');
      retakeBtn.classList.add('d-none');
      useBtn.classList.add('d-none');
    }
    
    /**
     * 撮影した写真を使用
     */
    function usePhoto() {
      canvas.toBlob(function(blob) {
        if (!blob) {
          console.error('画像の変換に失敗しました');
          return;
        }
        
        // ファイル名を設定
        const fileName = `photo_${targetType}_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // 写真タイプに応じた入力IDを決定
        let targetInputId;
        switch (targetType) {
          case 'single':
            targetInputId = 'id-photo-input';
            break;
          case 'front':
            targetInputId = 'id-photo-front-input';
            break;
          case 'back':
            targetInputId = 'id-photo-back-input';
            break;
          default:
            console.error('不明な写真タイプ:', targetType);
            return;
        }
        
        // ファイル入力要素を取得
        const fileInput = document.getElementById(targetInputId);
        if (!fileInput) {
          console.error('ファイル入力要素が見つかりません:', targetInputId);
          return;
        }
        
        // 直接プレビューを更新
        directUpdatePreview(targetInputId, file);
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/jpeg', 0.95);
    }
  }
  
  /**
   * プレビューを直接更新（確実に反映されるよう特別な処理）
   */
  function directUpdatePreview(inputId, file) {
    console.log('直接プレビュー更新:', inputId);
    
    // 入力要素を取得
    const fileInput = document.getElementById(inputId);
    if (!fileInput) {
      console.error('ファイル入力要素が見つかりません:', inputId);
      return;
    }
    
    try {
      // DataTransferでファイルをセット
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // changeイベントを発火
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
      
      // プレビュー要素のIDを決定
      let previewId, placeholderId, removeButtonId, imageId;
      if (inputId === 'id-photo-input') {
        previewId = 'id-photo-preview';
        placeholderId = 'id-photo-placeholder';
        removeButtonId = 'id-photo-remove-btn';
        imageId = 'id-photo-image';
      } else if (inputId === 'id-photo-front-input') {
        previewId = 'id-photo-front-preview';
        placeholderId = 'id-photo-front-placeholder';
        removeButtonId = 'id-photo-front-remove-btn';
        imageId = 'id-photo-front-image';
      } else if (inputId === 'id-photo-back-input') {
        previewId = 'id-photo-back-preview';
        placeholderId = 'id-photo-back-placeholder';
        removeButtonId = 'id-photo-back-remove-btn';
        imageId = 'id-photo-back-image';
      } else {
        const baseId = inputId.replace('-input', '');
        previewId = baseId + '-preview';
        placeholderId = baseId + '-placeholder';
        removeButtonId = baseId + '-remove-btn';
        imageId = baseId + '-image';
      }
      
      // 要素を取得
      const previewContainer = document.getElementById(previewId);
      const placeholder = document.getElementById(placeholderId);
      const removeButton = document.getElementById(removeButtonId);
      const previewImage = document.getElementById(imageId);
      
      if (!previewContainer || !previewImage) {
        console.error('プレビュー要素が見つかりません');
        return;
      }
      
      // FileReaderでプレビュー表示を更新
      const reader = new FileReader();
      reader.onload = function(e) {
        // プレビュー画像を設定
        previewImage.src = e.target.result;
        
        // UI状態の更新
        previewContainer.classList.remove('d-none');
        if (placeholder) placeholder.classList.add('d-none');
        if (removeButton) removeButton.classList.remove('d-none');
        
        console.log('プレビュー表示を更新しました:', previewId);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('ファイル処理エラー:', error);
    }
  }
})();