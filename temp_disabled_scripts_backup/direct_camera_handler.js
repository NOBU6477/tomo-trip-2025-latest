/**
 * カメラボタンを直接ハンドリングするインラインスクリプト
 * 既存のシステムから独立して動作するようにモジュラー設計
 */
(function() {
  console.log('直接カメラハンドラーを初期化');
  
  // グローバル変数
  let currentStream = null;
  let activeFileInput = null;
  
  // DOMContentLoadedイベントが発火した時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // ページ内のすべてのカメラボタンを設定
    setupAllCameraButtons();
    
    // モーダル表示イベントをリッスン
    document.body.addEventListener('shown.bs.modal', function() {
      // モーダルが表示されたら、その中のカメラボタンを設定
      setTimeout(setupAllCameraButtons, 100);
    });
  });
  
  // ページ読み込み後にもう一度実行（非同期読み込みへの対応）
  window.addEventListener('load', function() {
    // 少し遅延させて実行
    setTimeout(setupAllCameraButtons, 500);
  });
  
  /**
   * すべてのカメラボタンを設定
   */
  function setupAllCameraButtons() {
    // カメラボタンを検索
    const cameraButtons = document.querySelectorAll('.camera-button, [data-role="camera-button"]');
    console.log(`カメラボタンを ${cameraButtons.length} 個検出`);
    
    cameraButtons.forEach(function(button) {
      // すでに初期化済みならスキップ
      if (button.hasAttribute('data-camera-initialized')) return;
      
      // ターゲットID属性を取得
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;
      
      // イベントリスナーを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`カメラボタンがクリックされました: ${targetId}`);
        
        // カメラモーダルを表示
        showCameraModal(targetId);
      });
      
      // 初期化済みとしてマーク
      button.setAttribute('data-camera-initialized', 'true');
      console.log(`カメラボタンを初期化: ${targetId}`);
      
      // スタイルを少し変更して初期化されたことを視覚的に示す
      button.style.opacity = '1';
    });
  }
  
  /**
   * カメラモーダルを表示
   * @param {string} targetId ターゲット入力要素のID
   */
  function showCameraModal(targetId) {
    // 対象のファイル入力要素を取得
    const fileInput = document.getElementById(targetId);
    if (!fileInput) {
      console.error(`ターゲット入力が見つかりません: ${targetId}`);
      return;
    }
    
    // 既存のカメラモーダルを削除
    const existingModal = document.getElementById('direct-camera-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // カメラストリームがあれば停止
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }
    
    // グローバル変数に現在のファイル入力を設定
    activeFileInput = fileInput;
    
    // モーダルHTMLを作成
    const modalHTML = `
      <div id="direct-camera-modal" class="modal d-block" style="background-color: rgba(0,0,0,0.9); z-index: 9999;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">カメラで撮影</h5>
              <button type="button" class="btn-close btn-close-white" id="direct-camera-close" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <div id="direct-camera-feedback" class="alert d-none mb-3"></div>
              
              <div id="direct-camera-capture-container">
                <video id="direct-camera-video" autoplay playsinline style="width: 100%; max-height: 50vh; background-color: #000;"></video>
                <div class="mt-3">
                  <button type="button" class="btn btn-success" id="direct-camera-capture">
                    <i class="fas fa-camera me-2"></i> 撮影する
                  </button>
                </div>
              </div>
              
              <div id="direct-camera-preview-container" class="d-none">
                <img id="direct-camera-preview" style="width: 100%; max-height: 50vh; object-fit: contain;" alt="撮影プレビュー">
                <div class="mt-3">
                  <button type="button" class="btn btn-primary me-2" id="direct-camera-use">
                    <i class="fas fa-check me-2"></i> この写真を使用
                  </button>
                  <button type="button" class="btn btn-secondary" id="direct-camera-retake">
                    <i class="fas fa-redo me-2"></i> 撮り直す
                  </button>
                </div>
              </div>
              
              <canvas id="direct-camera-canvas" style="display: none;"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 要素への参照を取得
    const modal = document.getElementById('direct-camera-modal');
    const video = document.getElementById('direct-camera-video');
    const canvas = document.getElementById('direct-camera-canvas');
    const captureBtn = document.getElementById('direct-camera-capture');
    const closeBtn = document.getElementById('direct-camera-close');
    const useBtn = document.getElementById('direct-camera-use');
    const retakeBtn = document.getElementById('direct-camera-retake');
    const captureContainer = document.getElementById('direct-camera-capture-container');
    const previewContainer = document.getElementById('direct-camera-preview-container');
    const previewImg = document.getElementById('direct-camera-preview');
    const feedbackEl = document.getElementById('direct-camera-feedback');
    
    // カメラを起動
    startCamera();
    
    // カメラを起動
    function startCamera() {
      // カメラ起動中のフィードバックを表示
      showFeedback('カメラを起動中...', 'info');
      
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      .then(function(stream) {
        // ストリームを設定
        currentStream = stream;
        video.srcObject = stream;
        
        // フィードバックを消去
        feedbackEl.classList.add('d-none');
        
        // キャプチャモードを表示
        showCaptureMode();
      })
      .catch(function(error) {
        console.error('カメラエラー:', error);
        showFeedback('カメラにアクセスできませんでした。ファイル選択に切り替えます...', 'warning');
        
        // カメラエラーイベントを発火
        const cameraErrorEvent = new CustomEvent('camera-error', {
          detail: { 
            error: error,
            targetId: targetId
          }
        });
        window.dispatchEvent(cameraErrorEvent);
        
        // フォールバック機能があれば利用
        if (typeof window.activateCameraFallback === 'function') {
          setTimeout(function() {
            window.activateCameraFallback(targetId);
          }, 1500);
        } else {
          // 標準のファイル選択UIを使用
          setTimeout(function() {
            // モーダルを閉じる
            closeModal();
            
            // フォールバック入力を作成して使用
            const fallbackInput = document.createElement('input');
            fallbackInput.type = 'file';
            fallbackInput.accept = 'image/*';
            
            // モバイルデバイスでは写真を直接撮影できるようにする
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
              fallbackInput.capture = 'environment';
            }
            
            fallbackInput.style.display = 'none';
            document.body.appendChild(fallbackInput);
            
            // ファイル選択時の処理
            fallbackInput.addEventListener('change', function() {
              if (this.files && this.files[0]) {
                // ファイル入力に設定
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(this.files[0]);
                activeFileInput.files = dataTransfer.files;
                
                // 変更イベントを発火
                const event = new Event('change', { bubbles: true });
                activeFileInput.dispatchEvent(event);
                
                // プレビュー表示を更新
                updatePreview(activeFileInput.id, this.files[0]);
              }
              
              // 使用後に削除
              document.body.removeChild(fallbackInput);
            });
            
            // クリックして開く
            fallbackInput.click();
          }, 1500);
        }
      });
    }
    
    // 撮影モードを表示
    function showCaptureMode() {
      captureContainer.classList.remove('d-none');
      previewContainer.classList.add('d-none');
    }
    
    // プレビューモードを表示
    function showPreviewMode() {
      captureContainer.classList.add('d-none');
      previewContainer.classList.remove('d-none');
    }
    
    // フィードバックメッセージを表示
    function showFeedback(message, type) {
      feedbackEl.textContent = message;
      feedbackEl.className = `alert alert-${type} mb-3`;
      feedbackEl.classList.remove('d-none');
    }
    
    // ボタンにイベントリスナーを設定
    captureBtn.addEventListener('click', capturePhoto);
    closeBtn.addEventListener('click', closeModal);
    useBtn.addEventListener('click', applyPhotoToInput);
    retakeBtn.addEventListener('click', showCaptureMode);
    
    // 写真を撮影
    function capturePhoto() {
      // キャンバスのサイズをビデオに合わせる
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // キャンバスから画像URLを取得
      const imageDataURL = canvas.toDataURL('image/jpeg');
      
      // プレビュー画像に表示
      previewImg.src = imageDataURL;
      
      // プレビューモードに切り替え
      showPreviewMode();
    }
    
    // 撮影した写真を入力に適用
    function applyPhotoToInput() {
      // フィードバックを表示
      showFeedback('写真を処理中...', 'info');
      
      // キャンバスから画像を取得
      canvas.toBlob(function(blob) {
        // ファイル名を生成
        const now = new Date();
        const fileName = `photo_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.jpg`;
        
        // ファイルオブジェクトを作成
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // FileListオブジェクトを作成してファイル入力に設定
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        activeFileInput.files = dataTransfer.files;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        activeFileInput.dispatchEvent(event);
        
        // アップロードされた写真のプレビューを更新
        updatePreview(activeFileInput.id, file);
        
        // モーダルを閉じる
        closeModal();
      }, 'image/jpeg', 0.9);
    }
    
    // モーダルを閉じる
    function closeModal() {
      // カメラストリームを停止
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
      }
      
      // モーダルを削除
      modal.remove();
    }
  }
  
  /**
   * ファイルのプレビューを更新
   */
  function updatePreview(fileId, file) {
    // 標準プレビュー
    const previewElement = document.getElementById(fileId + '_preview');
    const imageElement = document.getElementById(fileId + '_image');
    
    if (previewElement && imageElement) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageElement.src = e.target.result;
        imageElement.classList.add('show');
        previewElement.classList.add('has-file');
      };
      reader.readAsDataURL(file);
      return;
    }
    
    // 新しいUIプレビュー
    const previewContainer = document.querySelector(`.document-preview[data-input="${fileId}"]`);
    if (previewContainer) {
      const previewImage = previewContainer.querySelector('.document-preview-image');
      if (previewImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          previewContainer.classList.add('has-file');
          
          // 削除ボタンの表示
          const removeButton = previewContainer.querySelector('.remove-file');
          if (removeButton) {
            removeButton.classList.remove('d-none');
          }
          
          // アップロードボタンとカメラボタンを非表示
          const uploadBtn = document.getElementById(fileId + '-upload-btn');
          const cameraBtn = previewContainer.querySelector('.camera-button');
          
          if (uploadBtn) uploadBtn.classList.add('d-none');
          if (cameraBtn) cameraBtn.classList.add('d-none');
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  // 直接実行する
  setTimeout(setupAllCameraButtons, 0);
})();