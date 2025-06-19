/**
 * 緊急対応用のカメラ撮影スクリプト
 * 従来の複雑なスクリプトを完全に置き換え、シンプルで確実に動作するように設計
 */
(function() {
  // ページロード後に初期化
  document.addEventListener('DOMContentLoaded', function() {
    setupCameraHandling();
  });

  // カメラ処理の設定
  function setupCameraHandling() {
    // モーダルオープンイベントの監視
    const modalOpenHandler = function(event) {
      const modal = event.target;
      if (modal.classList.contains('modal') && modal.getAttribute('id') && 
          (modal.getAttribute('id').includes('camera') || modal.getAttribute('id').includes('photo'))) {
        setupCameraModal(modal);
      }
    };

    // すべてのモーダルにイベント設定
    document.addEventListener('shown.bs.modal', modalOpenHandler);
    
    // 既存のカメラボタンを監視してクリックイベントを変更
    document.addEventListener('click', function(event) {
      // カメラボタンをクリックした場合
      if (event.target.matches('.camera-btn, .btn-camera, [data-camera="true"], .btn-photo, .use-camera') || 
          (event.target.closest('.camera-btn, .btn-camera, [data-camera="true"], .btn-photo, .use-camera'))) {
        
        const button = event.target.matches('.camera-btn, .btn-camera, [data-camera="true"], .btn-photo, .use-camera') ? 
                      event.target : event.target.closest('.camera-btn, .btn-camera, [data-camera="true"], .btn-photo, .use-camera');
        
        // ターゲットの写真タイプを特定
        let photoType = 'front';
        if (button.hasAttribute('data-photo-type')) {
          photoType = button.getAttribute('data-photo-type');
        } else if (button.id && button.id.includes('back')) {
          photoType = 'back';
        } else if (button.classList.contains('back-photo') || button.textContent.includes('裏')) {
          photoType = 'back';
        }
        
        // カメラモーダルを表示
        event.preventDefault();
        showCameraModal(photoType);
        
        return false;
      }
    }, true);
  }

  // カメラモーダルのセットアップ
  function setupCameraModal(modal) {
    // カメラモーダル内の要素を設定
    const captureBtn = modal.querySelector('.capture-btn, .btn-capture, #captureBtn');
    const retakeBtn = modal.querySelector('.retake-btn, .btn-retake, #retakeBtn');
    const usePhotoBtn = modal.querySelector('.use-photo-btn, .btn-use-photo, #usePhotoBtn');
    
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        capturePhoto(modal);
      });
    }
    
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function() {
        startCamera(modal);
      });
    }
    
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function() {
        usePhoto(modal);
      });
    }
    
    // モーダル表示時にカメラ起動
    startCamera(modal);
  }

  // カメラモーダルを表示
  function showCameraModal(photoType) {
    // 既存のモーダルを削除（重複防止）
    const existingModal = document.getElementById('directCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // 新しいモーダルを作成
    const modalHTML = `
      <div class="modal fade" id="directCameraModal" tabindex="-1" aria-labelledby="cameraModalLabel" aria-hidden="true" data-target-side="${photoType}">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="cameraModalLabel">${photoType === 'front' ? '表面' : '裏面'}の写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-instructions alert alert-info mb-3">
                <ol class="mb-0">
                  <li>書類全体が画面に収まるようにしてください</li>
                  <li>明るい場所で撮影してください</li>
                  <li>撮影ボタンをクリックして写真を撮ります</li>
                  <li>やり直す場合は「撮り直す」をクリック</li>
                </ol>
              </div>
              
              <div class="camera-container">
                <div id="video-container" class="text-center mb-3">
                  <video id="camera-video" class="w-100 border rounded" autoplay playsinline></video>
                </div>
                <div id="preview-container" class="text-center mb-3 d-none">
                  <h6 class="mb-2">撮影された写真の確認</h6>
                  <img id="preview-image" src="" alt="撮影写真" class="img-fluid rounded border">
                </div>
                <canvas id="photo-canvas" class="d-none"></canvas>
                <div id="camera-feedback" class="alert d-none mt-2"></div>
              </div>
              
              <div class="camera-controls d-flex justify-content-center mt-3">
                <button id="capture-photo" class="btn btn-primary btn-lg me-2">
                  <i class="fas fa-camera me-1"></i> 撮影する
                </button>
                <button id="retake-photo" class="btn btn-secondary btn-lg me-2 d-none">
                  <i class="fas fa-redo me-1"></i> 撮り直す
                </button>
                <button id="use-photo" class="btn btn-success btn-lg d-none">
                  <i class="fas fa-check me-1"></i> この写真を使用
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Bootstrapモーダルを初期化して表示
    const modalElement = document.getElementById('directCameraModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
    
    // モーダル表示後にカメラ処理を設定
    modalElement.addEventListener('shown.bs.modal', function() {
      setupCameraModal(modalElement);
    });
  }

  // カメラを開始
  function startCamera(modal) {
    const videoElement = modal.querySelector('video');
    const videoContainer = modal.querySelector('#video-container, .video-container');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, #captureBtn');
    const retakeBtn = modal.querySelector('#retake-photo, .retake-btn, #retakeBtn');
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, #usePhotoBtn');
    const feedbackElement = modal.querySelector('#camera-feedback, .camera-feedback');
    
    // UI更新
    if (videoContainer) videoContainer.classList.remove('d-none');
    if (previewContainer) previewContainer.classList.add('d-none');
    if (captureBtn) captureBtn.classList.remove('d-none');
    if (retakeBtn) retakeBtn.classList.add('d-none');
    if (usePhotoBtn) usePhotoBtn.classList.add('d-none');
    if (feedbackElement) {
      feedbackElement.textContent = '';
      feedbackElement.classList.add('d-none');
    }
    
    // カメラストリームを取得
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
        audio: false 
      })
      .then(function(stream) {
        // グローバル変数にストリームを保存
        window.cameraStream = stream;
        
        // ビデオ要素にストリームを設定
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.onloadedmetadata = function() {
            videoElement.play();
          };
        }
      })
      .catch(function(error) {
        console.error('カメラアクセスエラー:', error);
        showFeedback(modal, 'カメラにアクセスできませんでした。カメラへのアクセスを許可してください。', 'danger');
      });
    } else {
      showFeedback(modal, 'お使いのブラウザはカメラ機能をサポートしていません。', 'danger');
    }
  }
  
  // カメラ停止
  function stopCamera() {
    if (window.cameraStream) {
      const tracks = window.cameraStream.getTracks();
      tracks.forEach(function(track) {
        track.stop();
      });
      window.cameraStream = null;
    }
  }
  
  // 写真撮影
  function capturePhoto(modal) {
    const videoElement = modal.querySelector('video');
    const canvasElement = modal.querySelector('canvas');
    const previewElement = modal.querySelector('#preview-image, .preview-image');
    const videoContainer = modal.querySelector('#video-container, .video-container');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, #captureBtn');
    const retakeBtn = modal.querySelector('#retake-photo, .retake-btn, #retakeBtn');
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, #usePhotoBtn');
    
    if (videoElement && canvasElement) {
      try {
        // ビデオのサイズを取得
        const width = videoElement.videoWidth || videoElement.clientWidth || 640;
        const height = videoElement.videoHeight || videoElement.clientHeight || 480;
        
        // キャンバスサイズを設定
        canvasElement.width = width;
        canvasElement.height = height;
        
        // ビデオフレームをキャンバスに描画
        const ctx = canvasElement.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, width, height);
        
        // Blob形式で保存（より互換性が高い）
        canvasElement.toBlob(function(blob) {
          // 写真をモーダルに表示
          const imageUrl = URL.createObjectURL(blob);
          
          // 画像表示を設定
          if (previewElement) {
            previewElement.src = imageUrl;
            previewElement.style.display = 'block';
          }
          
          // UI更新
          if (videoContainer) videoContainer.classList.add('d-none');
          if (previewContainer) previewContainer.classList.remove('d-none');
          if (captureBtn) captureBtn.classList.add('d-none');
          if (retakeBtn) retakeBtn.classList.remove('d-none');
          if (usePhotoBtn) usePhotoBtn.classList.remove('d-none');
          
          // 画像データをモーダルに保存
          modal.imageBlob = blob;
          modal.imageUrl = imageUrl;
        }, 'image/jpeg', 0.95);
      } catch (error) {
        console.error('撮影エラー:', error);
        showFeedback(modal, '写真の撮影中にエラーが発生しました。', 'danger');
      }
    }
  }
  
  // 撮影した写真を使用
  function usePhoto(modal) {
    const photoType = modal.getAttribute('data-target-side') || 'front';
    const imageUrl = modal.imageUrl;
    const imageBlob = modal.imageBlob;
    
    if (imageUrl && imageBlob) {
      // 写真プレビュー要素のIDを生成
      const previewImgId = `id-photo-${photoType}-image`;
      const previewContainerId = `id-photo-${photoType}-preview`;
      const placeholderId = `id-photo-${photoType}-placeholder`;
      const removeBtnId = `id-photo-${photoType}-remove-btn`;
      
      // プレビュー要素を検索
      let previewImg = document.getElementById(previewImgId);
      let previewContainer = document.getElementById(previewContainerId);
      let placeholder = document.getElementById(placeholderId);
      let removeBtn = document.getElementById(removeBtnId);
      
      // 代替ID形式を確認
      if (!previewImg) {
        const altImgId = photoType === 'front' ? 'front-photo-image' : 'back-photo-image';
        previewImg = document.getElementById(altImgId);
      }
      
      if (!previewContainer) {
        const altContainerId = photoType === 'front' ? 'front-photo-preview' : 'back-photo-preview';
        previewContainer = document.getElementById(altContainerId);
      }
      
      // 要素が見つからない場合はページ内の写真要素を検索
      if (!previewImg) {
        const allImages = document.querySelectorAll('img');
        for (let img of allImages) {
          const imgId = img.id || '';
          const imgAlt = img.alt || '';
          const imgClass = img.className || '';
          
          if (imgId.includes(photoType) || imgAlt.includes(photoType) || imgClass.includes(photoType)) {
            previewImg = img;
            
            // 親コンテナも探す
            previewContainer = img.closest('.preview-container, .photo-preview');
            placeholder = previewContainer?.querySelector('.placeholder');
            removeBtn = previewContainer?.querySelector('.btn-danger, .remove-btn');
            break;
          }
        }
      }
      
      // 写真プレビューを更新
      if (previewImg) {
        // 画像URLを設定
        previewImg.src = imageUrl;
        previewImg.style.display = 'block';
        
        // コンテナの表示状態を更新
        if (previewContainer) {
          previewContainer.classList.remove('d-none');
          previewContainer.style.display = 'block';
        }
        
        // プレースホルダーを非表示
        if (placeholder) {
          placeholder.classList.add('d-none');
          placeholder.style.display = 'none';
        }
        
        // 削除ボタンを表示
        if (removeBtn) {
          removeBtn.classList.remove('d-none');
          removeBtn.style.display = 'block';
        }
        
        // 写真データをFormDataに追加するためのFile作成
        const fileName = `id_photo_${photoType}.jpg`;
        const file = new File([imageBlob], fileName, { type: 'image/jpeg' });
        
        // 対応するinput[type=file]を探してファイルを設定
        const fileInputs = document.querySelectorAll('input[type="file"]');
        for (let input of fileInputs) {
          const inputId = input.id || '';
          const inputName = input.name || '';
          
          if (inputId.includes(photoType) || inputName.includes(photoType)) {
            // ファイルをDataTransferに追加してChangeイベントを発火
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            
            // Changeイベントを発火
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
            break;
          }
        }
      } else {
        console.error(`写真プレビュー要素 (${photoType}) が見つかりませんでした`);
      }
    }
    
    // モーダルを閉じる
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
    
    // カメラを停止
    stopCamera();
  }
  
  // フィードバック表示
  function showFeedback(modal, message, type) {
    const feedbackElement = modal.querySelector('#camera-feedback, .camera-feedback');
    if (feedbackElement) {
      feedbackElement.textContent = message;
      feedbackElement.className = `alert alert-${type} mt-2`;
      feedbackElement.classList.remove('d-none');
    }
  }
})();