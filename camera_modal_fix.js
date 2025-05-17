/**
 * カメラモーダル機能修正スクリプト（カメラボタンクリック時に独自モーダルを表示）
 */
(function() {
  console.log('カメラモーダル修正: 初期化中');

  // 初期化時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCameraFix);
  } else {
    initCameraFix();
  }

  // 定期的に実行
  setInterval(initCameraFix, 3000);

  // カメラ修正の初期化
  function initCameraFix() {
    // カメラボタンを探す
    const cameraButtons = document.querySelectorAll('button:has(.bi-camera), .camera-button, button.btn-outline-primary');
    
    cameraButtons.forEach(button => {
      const buttonText = button.textContent.trim().toLowerCase();
      
      // カメラ関連のボタンかどうか確認
      if (!buttonText.includes('カメラ') && !buttonText.includes('撮影')) {
        return;
      }
      
      // すでに処理済みならスキップ
      if (button.getAttribute('data-camera-modal-fixed') === 'true') {
        return;
      }
      
      // 処理済みフラグを設定
      button.setAttribute('data-camera-modal-fixed', 'true');

      console.log('カメラモーダル修正: カメラボタンを検出', buttonText);
      
      // オリジナルのクリックイベントを保存
      const originalClick = button.onclick;
      
      // クリックイベントを上書き
      button.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('カメラモーダル修正: カメラボタンがクリックされました');
        
        // 関連するファイル入力を探す
        const fileInput = findRelatedFileInput(button);
        
        if (fileInput) {
          console.log('カメラモーダル修正: 関連するファイル入力を検出', fileInput.id || fileInput.name);
          
          // 独自カメラモーダルを開く
          openCustomCameraModal(fileInput, buttonText);
        } else {
          console.log('カメラモーダル修正: 関連するファイル入力が見つかりません');
          
          // オリジナルのイベントハンドラを試行
          if (typeof originalClick === 'function') {
            try {
              originalClick.call(button, e);
            } catch (err) {
              console.error('カメラモーダル修正: オリジナルのクリックハンドラでエラー', err);
            }
          }
          
          // それでも動作しない場合は何もしない
        }
      };
    });
  }
  
  // 独自カメラモーダルを開く
  function openCustomCameraModal(fileInput, buttonText) {
    // 既存のモーダルを削除
    const existingModal = document.getElementById('custom-camera-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルのタイトルを設定（ボタンのテキストから）
    let modalTitle = 'カメラで撮影';
    if (buttonText.includes('表面')) {
      modalTitle = '運転免許証（表面）を撮影';
    } else if (buttonText.includes('裏面')) {
      modalTitle = '運転免許証（裏面）を撮影';
    }
    
    // カメラモーダルを作成
    const modalHtml = `
      <div class="modal fade" id="custom-camera-modal" tabindex="-1" aria-labelledby="cameraModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="cameraModalLabel">
                <i class="bi bi-camera me-2"></i>${modalTitle}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <div class="camera-container bg-dark position-relative" style="min-height: 300px;">
                <video id="camera-video" class="w-100 d-block" autoplay playsinline></video>
                <canvas id="camera-canvas" class="d-none"></canvas>
                
                <div id="camera-preview" class="position-absolute top-0 start-0 w-100 h-100 bg-dark d-none d-flex align-items-center justify-content-center">
                  <img id="preview-image" src="" alt="撮影画像" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                
                <div id="camera-guide" class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div class="guide-frame" style="border: 2px dashed white; width: 80%; height: 60%; opacity: 0.7; display: flex; align-items: center; justify-content: center;">
                    <div class="guide-text text-white bg-dark bg-opacity-50 p-2">書類全体がフレーム内に収まるようにしてください</div>
                  </div>
                </div>
                
                <div id="camera-error" class="position-absolute top-0 start-0 w-100 h-100 bg-dark p-4 d-none">
                  <div class="alert alert-warning text-center">
                    <h5>カメラにアクセスできません</h5>
                    <p class="mb-3">以下の理由が考えられます：</p>
                    <ul class="text-start small">
                      <li>ブラウザの設定でカメラへのアクセスが許可されていません</li>
                      <li>デバイスにカメラが接続されていません</li>
                      <li>別のアプリがカメラを使用しています</li>
                    </ul>
                  </div>
                  <div class="text-center mt-3">
                    <input type="file" id="fallback-file-input" accept="image/*" class="d-none">
                    <button type="button" id="manual-upload-btn" class="btn btn-primary">
                      <i class="bi bi-upload me-1"></i>画像を選択
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div id="camera-controls">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                <button type="button" id="capture-btn" class="btn btn-primary">
                  <i class="bi bi-camera me-1"></i>撮影
                </button>
              </div>
              <div id="preview-controls" style="display: none;">
                <button type="button" id="retake-btn" class="btn btn-secondary">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>撮り直す
                </button>
                <button type="button" id="use-photo-btn" class="btn btn-primary">
                  <i class="bi bi-check me-1"></i>この写真を使用
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // モーダル要素を取得
    const modal = document.getElementById('custom-camera-modal');
    
    // Bootstrap モーダルを初期化
    let modalInstance;
    try {
      modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    } catch (err) {
      console.error('カメラモーダル修正: Bootstrapモーダル初期化エラー', err);
      // 手動でモーダルを表示
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      
      // 背景を追加
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
    
    // 要素の参照を取得
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const preview = document.getElementById('camera-preview');
    const previewImage = document.getElementById('preview-image');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const usePhotoBtn = document.getElementById('use-photo-btn');
    const cameraControls = document.getElementById('camera-controls');
    const previewControls = document.getElementById('preview-controls');
    const cameraError = document.getElementById('camera-error');
    const manualUploadBtn = document.getElementById('manual-upload-btn');
    const fallbackFileInput = document.getElementById('fallback-file-input');
    
    // メディアストリーム
    let mediaStream = null;
    
    // カメラの開始
    startCamera();
    
    // カメラ開始
    function startCamera() {
      // 環境に応じて適切な設定を選択
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const constraints = {
        video: {
          facingMode: 'environment', // 背面カメラ優先
          width: isMobile ? { ideal: 1280 } : { ideal: 1920 },
          height: isMobile ? { ideal: 720 } : { ideal: 1080 }
        },
        audio: false
      };
      
      // カメラにアクセス
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          mediaStream = stream;
          video.srcObject = stream;
          video.style.display = 'block';
          cameraError.classList.add('d-none');
        })
        .catch(function(err) {
          console.error('カメラモーダル修正: カメラアクセスエラー', err);
          showCameraError();
        });
    }
    
    // カメラ停止
    function stopCamera() {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
    }
    
    // カメラエラー表示
    function showCameraError() {
      cameraError.classList.remove('d-none');
      video.style.display = 'none';
    }
    
    // 写真撮影
    function capturePhoto() {
      if (!mediaStream) return;
      
      try {
        // ビデオサイズを取得
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        if (!width || !height) {
          console.error('カメラモーダル修正: ビデオサイズが取得できません');
          return;
        }
        
        // キャンバスサイズを設定
        canvas.width = width;
        canvas.height = height;
        
        // 背景を白く塗る（透明部分対策）
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // ビデオをキャンバスに描画
        ctx.drawImage(video, 0, 0, width, height);
        
        // 画像データを取得
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        
        // プレビュー表示
        previewImage.src = imageData;
        preview.classList.remove('d-none');
        video.style.display = 'none';
        
        // コントロールを切り替え
        cameraControls.style.display = 'none';
        previewControls.style.display = 'block';
      } catch (err) {
        console.error('カメラモーダル修正: 写真撮影エラー', err);
      }
    }
    
    // 写真撮り直し
    function retakePhoto() {
      // ビデオ表示に戻す
      preview.classList.add('d-none');
      video.style.display = 'block';
      
      // コントロールを切り替え
      cameraControls.style.display = 'block';
      previewControls.style.display = 'none';
    }
    
    // 写真を使用
    function usePhoto() {
      const imageData = previewImage.src;
      
      // データURLをBlobに変換
      fetch(imageData)
        .then(res => res.blob())
        .then(blob => {
          // ファイル名を設定
          const filename = `camera_${Date.now()}.jpg`;
          
          try {
            // ファイルを作成
            const file = new File([blob], filename, { type: 'image/jpeg' });
            
            // データ転送オブジェクト
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            
            // ファイル入力に設定
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // プレビュー画像を更新
            updateFilePreview(fileInput, imageData);
            
            // モーダルを閉じる
            closeModal();
          } catch (err) {
            console.error('カメラモーダル修正: ファイル作成エラー', err);
            // 古い方法を試す
            setFileInputDirectly(fileInput, blob, filename);
          }
        })
        .catch(err => {
          console.error('カメラモーダル修正: 画像処理エラー', err);
          closeModal();
        });
    }
    
    // 古い方法でファイル入力に値を設定
    function setFileInputDirectly(input, blob, filename) {
      try {
        // もしDataTransferが利用できなければ別の方法で
        const file = new Blob([blob], { type: 'image/jpeg' });
        
        // データURLをファイル入力の値として使用（非推奨だが代替策として）
        fileInput.value = '';
        
        // モーダルを閉じる
        closeModal();
        
        // ファイル選択ダイアログを開く（ユーザーに選択させる）
        setTimeout(() => {
          fileInput.click();
        }, 500);
      } catch (err) {
        console.error('カメラモーダル修正: 代替ファイル設定エラー', err);
        closeModal();
      }
    }
    
    // ファイルプレビューを更新
    function updateFilePreview(input, dataURL) {
      // 親コンテナを探す
      const container = input.closest('.mb-3, .form-group, .card-body');
      if (!container) return;
      
      // プレビューコンテナを探す
      let previewContainer = container.querySelector('.preview-container');
      
      // プレビューコンテナがなければ作成
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-2';
        container.appendChild(previewContainer);
      }
      
      // プレビュー画像を探す
      let previewImg = previewContainer.querySelector('img');
      
      // プレビュー画像がなければ作成
      if (!previewImg) {
        previewImg = document.createElement('img');
        previewImg.className = 'preview-img img-fluid';
        previewImg.style.maxHeight = '150px';
        previewImg.style.border = '1px solid #dee2e6';
        previewContainer.appendChild(previewImg);
      }
      
      // 画像を設定
      previewImg.src = dataURL;
      
      // 削除ボタンを追加/更新
      let deleteBtn = previewContainer.querySelector('.btn-delete');
      
      if (!deleteBtn) {
        deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-sm btn-danger mt-1 btn-delete';
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i> 削除';
        
        deleteBtn.addEventListener('click', function() {
          // ファイル入力をリセット
          input.value = '';
          
          // プレビューを非表示
          previewImg.src = '';
          previewImg.style.display = 'none';
          
          // 削除ボタンを非表示
          this.style.display = 'none';
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
        });
        
        previewContainer.appendChild(deleteBtn);
      }
      
      // 削除ボタンを表示
      deleteBtn.style.display = 'inline-block';
      previewImg.style.display = 'block';
    }
    
    // モーダルを閉じる
    function closeModal() {
      // カメラを停止
      stopCamera();
      
      // モーダルを閉じる
      if (typeof modalInstance !== 'undefined' && modalInstance.hide) {
        modalInstance.hide();
      } else {
        // 手動で閉じる
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        // 背景を削除
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        
        // bodyのスタイルをリセット
        document.body.style.overflow = '';
      }
      
      // モーダル要素を削除
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    }
    
    // ボタンイベントの設定
    if (captureBtn) {
      captureBtn.addEventListener('click', capturePhoto);
    }
    
    if (retakeBtn) {
      retakeBtn.addEventListener('click', retakePhoto);
    }
    
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', usePhoto);
    }
    
    if (manualUploadBtn) {
      manualUploadBtn.addEventListener('click', function() {
        fallbackFileInput.click();
      });
    }
    
    if (fallbackFileInput) {
      fallbackFileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          const reader = new FileReader();
          
          reader.onload = function(e) {
            // ファイル入力に設定
            fileInput.files = fallbackFileInput.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // プレビュー画像を更新
            updateFilePreview(fileInput, e.target.result);
            
            // モーダルを閉じる
            closeModal();
          };
          
          reader.readAsDataURL(file);
        }
      });
    }
    
    // モーダルが閉じられたらカメラを停止
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // 閉じるボタンのイベント設定
    const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', closeModal);
    });
  }
  
  // 関連するファイル入力を探す
  function findRelatedFileInput(button) {
    // 1. 同じフォームグループ内を探す
    const formGroup = findParentElement(button, '.form-group, .mb-3, .mb-4, .card-body');
    
    if (formGroup) {
      const fileInput = formGroup.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 2. ボタンのテキストで判断
    const buttonText = button.textContent.trim().toLowerCase();
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    
    // 表面/裏面で判断
    if (buttonText.includes('表面')) {
      for (const input of allFileInputs) {
        const inputGroup = findParentElement(input, '.form-group, .mb-3, .mb-4, .card-body');
        if (inputGroup && inputGroup.textContent.toLowerCase().includes('表面')) {
          return input;
        }
      }
    } else if (buttonText.includes('裏面')) {
      for (const input of allFileInputs) {
        const inputGroup = findParentElement(input, '.form-group, .mb-3, .mb-4, .card-body');
        if (inputGroup && inputGroup.textContent.toLowerCase().includes('裏面')) {
          return input;
        }
      }
    }
    
    // 3. 近くの要素から探す（階層を上げながら）
    let parent = button.parentNode;
    let searchDepth = 0;
    
    while (parent && parent !== document.body && searchDepth < 5) {
      const fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      parent = parent.parentNode;
      searchDepth++;
    }
    
    // 4. ページ内のすべてのファイル入力から1つ選択
    if (allFileInputs.length === 1) {
      return allFileInputs[0];
    }
    
    return null;
  }
  
  // 指定したセレクターに一致する親要素を探す
  function findParentElement(element, selector) {
    while (element && element !== document.body) {
      if (element.matches && element.matches(selector)) {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }
})();