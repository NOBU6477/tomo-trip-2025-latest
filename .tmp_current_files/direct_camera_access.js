/**
 * カメラ直接アクセススクリプト
 * ファイル選択コントロールではなく実際のカメラを使用するよう強制
 */
(function() {
  console.log('カメラ直接アクセス: 初期化');
  
  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDirectCamera);
  } else {
    initDirectCamera();
  }
  
  // カメラモーダルを監視
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (isModalCamera(modal)) {
      fixCameraModal(modal);
    }
  });
  
  // モーダルがカメラに関連しているか確認
  function isModalCamera(modal) {
    if (!modal) return false;
    
    // モーダルにカメラ関連クラスまたはIDがあるか確認
    if (modal.id === 'custom-camera-modal' || 
        modal.classList.contains('camera-modal') ||
        modal.querySelector('.modal-title')?.textContent.includes('カメラ')) {
      return true;
    }
    
    // モーダル内にビデオ要素があるか確認
    if (modal.querySelector('video')) {
      return true;
    }
    
    return false;
  }
  
  // カメラ直接アクセスの初期化
  function initDirectCamera() {
    // カメラボタンを探す
    const cameraButtons = findCameraButtons();
    
    cameraButtons.forEach(button => {
      // 既に処理済みならスキップ
      if (button.getAttribute('data-direct-camera-fixed') === 'true') {
        return;
      }
      
      // 処理済みフラグを設定
      button.setAttribute('data-direct-camera-fixed', 'true');
      
      console.log('カメラ直接アクセス: ボタンにイベント設定', button.textContent.trim());
      
      // オリジナルのクリックイベントを保存
      const originalClick = button.onclick;
      
      // 新しいクリックハンドラ
      button.onclick = function(e) {
        e.preventDefault();
        
        // 関連ファイル入力を探す
        const fileInput = findFileInputForButton(button);
        if (fileInput) {
          // 既存のファイル選択イベントを防止
          fileInput.onclick = function(e) {
            e.preventDefault();
            return false;
          };
          
          // 代わりにカメラモーダルを直接開く
          openDirectCameraModal(fileInput);
        } else {
          // ファイル入力が見つからない場合はオリジナルの処理を実行
          if (typeof originalClick === 'function') {
            originalClick.call(this, e);
          }
        }
        
        return false;
      };
    });
  }
  
  // カメラ関連のボタンを見つける
  function findCameraButtons() {
    const result = [];
    
    // クラスで探す
    document.querySelectorAll('.camera-button, .btn-camera').forEach(btn => result.push(btn));
    
    // アイコンで探す
    document.querySelectorAll('button .bi-camera, button .fa-camera').forEach(icon => {
      const btn = icon.closest('button');
      if (btn) result.push(btn);
    });
    
    // テキストで探す
    document.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      if (text.includes('カメラ') || text.includes('撮影')) {
        result.push(btn);
      }
    });
    
    // 重複を削除
    return [...new Set(result)];
  }
  
  // ボタンに関連するファイル入力を見つける
  function findFileInputForButton(button) {
    // 1. 親フォームグループ内を探す
    const formGroup = button.closest('.form-group, .mb-3');
    if (formGroup) {
      const fileInput = formGroup.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    // 2. data属性を確認
    if (button.dataset.target) {
      const target = document.querySelector(button.dataset.target);
      if (target && target.type === 'file') return target;
    }
    
    // 3. ボタンのテキストを使って推測
    const buttonText = button.textContent.trim().toLowerCase();
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    
    if (buttonText.includes('表面')) {
      // 表面関連のファイル入力を探す
      for (const input of allFileInputs) {
        const container = input.closest('.form-group, .mb-3');
        if (container && container.textContent.toLowerCase().includes('表面')) {
          return input;
        }
      }
    } else if (buttonText.includes('裏面')) {
      // 裏面関連のファイル入力を探す
      for (const input of allFileInputs) {
        const container = input.closest('.form-group, .mb-3');
        if (container && container.textContent.toLowerCase().includes('裏面')) {
          return input;
        }
      }
    }
    
    // 4. 親要素を上にたどって探す
    let parent = button.parentElement;
    let depth = 0;
    while (parent && depth < 5) {
      const fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
      parent = parent.parentElement;
      depth++;
    }
    
    return null;
  }
  
  // 直接カメラモーダルを開く
  function openDirectCameraModal(fileInput) {
    console.log('カメラ直接アクセス: カスタムモーダルを開きます');
    
    // すでに存在するモーダルを削除
    const existingModal = document.getElementById('direct-camera-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルタイトルを決定
    let modalTitle = 'カメラで撮影';
    const container = fileInput.closest('.form-group, .mb-3');
    if (container) {
      if (container.textContent.includes('表面')) {
        modalTitle = '運転免許証（表面）の撮影';
      } else if (container.textContent.includes('裏面')) {
        modalTitle = '運転免許証（裏面）の撮影';
      }
    }
    
    // モーダルHTML
    const modalHtml = `
      <div class="modal fade" id="direct-camera-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-camera me-2"></i>${modalTitle}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <div class="camera-container">
                <video class="w-100" autoplay playsinline></video>
                <div class="preview d-none">
                  <img class="w-100" src="" alt="撮影プレビュー" />
                </div>
                <div class="camera-error d-none alert alert-danger m-3">
                  カメラにアクセスできません。ブラウザの設定でカメラへのアクセスを許可してください。
                </div>
                <div class="text-overlay">
                  書類全体がフレーム内に収まるようにしてください
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between p-2">
              <div class="camera-controls">
                <button type="button" class="btn btn-secondary capture-btn">
                  <i class="bi bi-camera me-1"></i>撮影
                </button>
              </div>
              <div class="preview-controls" style="display: none;">
                <button type="button" class="btn btn-secondary retake-btn">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>撮り直す
                </button>
                <button type="button" class="btn btn-primary use-photo-btn">
                  <i class="bi bi-check me-1"></i>この写真を使用
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // モーダル要素を取得
    const modal = document.getElementById('direct-camera-modal');
    
    // モーダルを表示
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // カメラを設定
    setupCamera(modal, fileInput);
  }
  
  // カメラモーダルを修正
  function fixCameraModal(modal) {
    console.log('カメラ直接アクセス: 既存のモーダルを修正');
    
    // モーダル内のビデオ要素を取得
    const video = modal.querySelector('video');
    if (!video) return;
    
    // ビデオが起動していない場合は開始
    if (!video.srcObject) {
      forceStartCamera(video);
    }
  }
  
  // カメラを設定
  function setupCamera(modal, fileInput) {
    const video = modal.querySelector('video');
    const preview = modal.querySelector('.preview');
    const previewImage = preview.querySelector('img');
    const cameraControls = modal.querySelector('.camera-controls');
    const previewControls = modal.querySelector('.preview-controls');
    const captureBtn = modal.querySelector('.capture-btn');
    const retakeBtn = modal.querySelector('.retake-btn');
    const usePhotoBtn = modal.querySelector('.use-photo-btn');
    const cameraError = modal.querySelector('.camera-error');
    
    let mediaStream = null;
    
    // モーダルが表示されたらカメラを起動
    forceStartCamera(video);
    
    // カメラを起動
    function forceStartCamera(videoElement) {
      // モバイル判定
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // 最適なカメラ設定
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // 背面カメラ優先
          width: { ideal: isMobile ? 1280 : 1920 },
          height: { ideal: isMobile ? 720 : 1080 }
        },
        audio: false
      };
      
      console.log('カメラ直接アクセス: カメラ起動試行');
      
      // カメラアクセス
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          console.log('カメラ直接アクセス: カメラ起動成功', stream);
          
          // ストリームを保存
          mediaStream = stream;
          
          // ビデオソースに設定
          videoElement.srcObject = stream;
          
          // ビデオを表示
          videoElement.style.display = 'block';
          cameraError.classList.add('d-none');
          
          // ビデオ再生を保証
          videoElement.onloadedmetadata = function() {
            videoElement.play()
              .then(() => console.log('カメラ直接アクセス: ビデオ再生開始'))
              .catch(e => console.error('カメラ直接アクセス: ビデオ再生エラー', e));
          };
        })
        .catch(function(err) {
          console.error('カメラ直接アクセス: カメラアクセスエラー', err);
          cameraError.classList.remove('d-none');
          videoElement.style.display = 'none';
        });
    }
    
    // カメラを停止
    function stopCamera() {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
    }
    
    // 写真撮影
    function capturePhoto() {
      if (!mediaStream) return;
      
      try {
        // 一時キャンバスを作成
        const canvas = document.createElement('canvas');
        
        // ビデオサイズを取得
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        if (!width || !height) {
          console.error('カメラ直接アクセス: ビデオサイズが取得できません');
          return;
        }
        
        // キャンバスサイズを設定
        canvas.width = width;
        canvas.height = height;
        
        // 白い背景を描画
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
        console.error('カメラ直接アクセス: 写真撮影エラー', err);
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
          const filename = `camera_${Date.now()}.jpg`;
          
          // ファイルを作成
          try {
            const file = new File([blob], filename, { type: 'image/jpeg' });
            
            // DataTransferオブジェクトを使用してファイル入力に設定
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // プレビュー更新
            updatePreview(fileInput, imageData);
            
            // モーダルを閉じる
            closeModal();
          } catch (err) {
            console.error('カメラ直接アクセス: ファイル設定エラー', err);
          }
        })
        .catch(err => {
          console.error('カメラ直接アクセス: 画像処理エラー', err);
          closeModal();
        });
    }
    
    // プレビュー更新
    function updatePreview(input, dataURL) {
      const container = input.closest('.form-group, .mb-3');
      if (!container) return;
      
      // プレビューコンテナを探す
      let previewContainer = container.querySelector('.preview-container');
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-2';
        container.appendChild(previewContainer);
      }
      
      // プレビュー画像を探す
      let previewImg = previewContainer.querySelector('img');
      if (!previewImg) {
        previewImg = document.createElement('img');
        previewImg.className = 'img-fluid';
        previewImg.style.maxHeight = '150px';
        previewImg.style.border = '1px solid #dee2e6';
        previewContainer.appendChild(previewImg);
      }
      
      // 画像を設定
      previewImg.src = dataURL;
      previewImg.style.display = 'block';
    }
    
    // モーダルを閉じる
    function closeModal() {
      stopCamera();
      
      try {
        // Bootstrapのモーダルを閉じる
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        } else {
          // 手動で閉じる
          modal.style.display = 'none';
          modal.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        }
      } catch (e) {
        console.error('カメラ直接アクセス: モーダル終了エラー', e);
      }
    }
    
    // ボタンにイベントリスナーを設定
    if (captureBtn) captureBtn.addEventListener('click', capturePhoto);
    if (retakeBtn) retakeBtn.addEventListener('click', retakePhoto);
    if (usePhotoBtn) usePhotoBtn.addEventListener('click', usePhoto);
    
    // モーダルが閉じられたらカメラを停止
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // 閉じるボタン
    const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
  }
})();