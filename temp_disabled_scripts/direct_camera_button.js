/**
 * 観光客登録モーダル内のカメラボタンを直接HTMLに追加するスクリプト
 * 最もシンプルな方法でカメラ機能を実装
 */
(function() {
  console.log('直接カメラボタンを初期化');
  
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダル表示イベントを監視
    document.body.addEventListener('shown.bs.modal', function(e) {
      if (e.target.id === 'touristRegistrationModal' || e.target.id === 'guideRegistrationModal') {
        setTimeout(replacePhotoSection, 100);
      }
    });
  });
  
  /**
   * 写真セクションを完全に置き換える
   */
  function replacePhotoSection() {
    // 観光客と案内人の登録モーダル両方をチェック
    const modals = [
      document.getElementById('touristRegistrationModal'),
      document.getElementById('guideRegistrationModal')
    ];
    
    modals.forEach(function(modal) {
      if (!modal) return;
      
      // 証明写真セクションを探す
      const photoSection = modal.querySelector('.form-group.mb-4:has(label[for="profile_photo"]), .form-group:has(#guide_profile_photo)');
      if (!photoSection) return;
      
      // 既に置き換え済みかチェック
      if (photoSection.hasAttribute('data-replaced')) return;
      
      // ターゲットIDを決定
      let targetId = 'profile_photo';
      if (modal.id === 'guideRegistrationModal') {
        targetId = 'guide_profile_photo';
      }
      
      // 新しいHTML
      const newHTML = `
        <div class="form-group mb-4" data-replaced="true">
          <label for="${targetId}" class="form-label fw-bold">証明写真</label>
          <input type="file" id="${targetId}" name="${targetId}" class="d-none" accept="image/*">
          
          <div class="direct-photo-uploader mb-2">
            <div class="direct-preview-container" id="${targetId}_direct_preview">
              <img src="" class="direct-preview-image" id="${targetId}_direct_image" alt="プレビュー">
              <button type="button" class="btn btn-sm btn-danger direct-remove-photo" id="${targetId}_direct_remove" style="display: none;">
                <i class="fas fa-times"></i> 削除
              </button>
            </div>
            
            <div class="direct-buttons">
              <button type="button" class="btn btn-primary direct-camera-button" id="${targetId}_direct_camera">
                <i class="fas fa-camera me-2"></i> カメラで撮影
              </button>
              <label for="${targetId}_direct_upload" class="btn btn-outline-secondary mb-0">
                <i class="fas fa-upload me-2"></i> 画像をアップロード
              </label>
              <input type="file" id="${targetId}_direct_upload" class="d-none" accept="image/*">
            </div>
          </div>
          
          <small class="form-text text-muted">※証明写真は正面を向いた顔がはっきり見えるものを使用してください</small>
        </div>
      `;
      
      // 元のセクションを置き換え
      photoSection.outerHTML = newHTML;
      
      // イベント設定
      setupDirectPhoto(targetId);
    });
  }
  
  /**
   * 直接写真アップロード機能を設定
   */
  function setupDirectPhoto(targetId) {
    // 要素取得
    const originalInput = document.getElementById(targetId);
    const cameraButton = document.getElementById(`${targetId}_direct_camera`);
    const uploadInput = document.getElementById(`${targetId}_direct_upload`);
    const previewImage = document.getElementById(`${targetId}_direct_image`);
    const removeButton = document.getElementById(`${targetId}_direct_remove`);
    
    // カメラボタン
    cameraButton.addEventListener('click', function() {
      // シンプルカメラモーダルを表示
      showSimpleCameraModal(targetId);
    });
    
    // アップロードボタン
    uploadInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        // オリジナルの入力に転送
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(this.files[0]);
        originalInput.files = dataTransfer.files;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        originalInput.dispatchEvent(event);
        
        // プレビュー表示
        updateDirectPreview(targetId, this.files[0]);
      }
    });
    
    // 削除ボタン
    removeButton.addEventListener('click', function() {
      // 入力をリセット
      originalInput.value = '';
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      originalInput.dispatchEvent(event);
      
      // プレビューをクリア
      previewImage.src = '';
      previewImage.style.display = 'none';
      removeButton.style.display = 'none';
    });
  }
  
  /**
   * シンプルなカメラモーダルを表示
   */
  function showSimpleCameraModal(targetId) {
    const originalInput = document.getElementById(targetId);
    if (!originalInput) return;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('direct-simple-modal');
    if (existingModal) existingModal.remove();
    
    // モーダルHTML
    const modalHTML = `
      <div id="direct-simple-modal" class="modal d-block" style="background: rgba(0,0,0,0.8); z-index: 9999;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">写真を撮影</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <div id="direct-simple-camera-container">
                <video id="direct-simple-video" autoplay playsinline style="width: 100%; max-height: 60vh; background: #000;"></video>
                <button type="button" class="btn btn-success mt-3" id="direct-simple-capture">
                  <i class="fas fa-camera me-2"></i> 撮影する
                </button>
              </div>
              <div id="direct-simple-preview-container" style="display: none;">
                <img id="direct-simple-preview-image" style="width: 100%; max-height: 60vh; object-fit: contain;" alt="プレビュー">
                <div class="mt-3">
                  <button type="button" class="btn btn-primary me-2" id="direct-simple-use">
                    <i class="fas fa-check me-2"></i> この写真を使用
                  </button>
                  <button type="button" class="btn btn-secondary" id="direct-simple-retake">
                    <i class="fas fa-redo me-2"></i> 撮り直す
                  </button>
                </div>
              </div>
              <canvas id="direct-simple-canvas" style="display: none;"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // ドキュメントに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 要素取得
    const modal = document.getElementById('direct-simple-modal');
    const video = document.getElementById('direct-simple-video');
    const canvas = document.getElementById('direct-simple-canvas');
    const cameraContainer = document.getElementById('direct-simple-camera-container');
    const previewContainer = document.getElementById('direct-simple-preview-container');
    const previewImage = document.getElementById('direct-simple-preview-image');
    const captureButton = document.getElementById('direct-simple-capture');
    const useButton = document.getElementById('direct-simple-use');
    const retakeButton = document.getElementById('direct-simple-retake');
    const closeButton = modal.querySelector('.btn-close');
    
    // ストリーム保存用変数
    let stream = null;
    
    // カメラ起動
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    })
    .then(function(s) {
      stream = s;
      video.srcObject = stream;
    })
    .catch(function(error) {
      console.error('カメラエラー:', error);
      
      // 標準のファイル選択UIにフォールバック
      const fallbackInput = document.createElement('input');
      fallbackInput.type = 'file';
      fallbackInput.accept = 'image/*';
      fallbackInput.style.display = 'none';
      document.body.appendChild(fallbackInput);
      
      // ファイル選択時の処理
      fallbackInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          // オリジナルの入力に転送
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(this.files[0]);
          originalInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          originalInput.dispatchEvent(event);
          
          // プレビュー表示
          updateDirectPreview(targetId, this.files[0]);
          
          // モーダルを閉じる
          closeModal();
        }
        
        // 使用後に削除
        document.body.removeChild(fallbackInput);
      });
      
      // クリックして開く
      modal.remove();
      fallbackInput.click();
    });
    
    // 撮影ボタン
    captureButton.addEventListener('click', function() {
      // ビデオフレームをキャンバスに描画
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー表示
      previewImage.src = canvas.toDataURL('image/jpeg');
      cameraContainer.style.display = 'none';
      previewContainer.style.display = 'block';
    });
    
    // 使用ボタン
    useButton.addEventListener('click', function() {
      canvas.toBlob(function(blob) {
        // ファイル名を生成
        const now = new Date();
        const fileName = `photo_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}_${now.getSeconds().toString().padStart(2,'0')}.jpg`;
        
        // Fileオブジェクト作成
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // オリジナルの入力に設定
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        originalInput.files = dataTransfer.files;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        originalInput.dispatchEvent(event);
        
        // プレビュー表示
        updateDirectPreview(targetId, file);
        
        // モーダルを閉じる
        closeModal();
      }, 'image/jpeg', 0.9);
    });
    
    // 撮り直しボタン
    retakeButton.addEventListener('click', function() {
      cameraContainer.style.display = 'block';
      previewContainer.style.display = 'none';
    });
    
    // 閉じるボタン
    closeButton.addEventListener('click', closeModal);
    
    // モーダルを閉じる関数
    function closeModal() {
      // ストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // モーダルを削除
      modal.remove();
    }
  }
  
  /**
   * プレビュー表示を更新
   */
  function updateDirectPreview(targetId, file) {
    const previewImage = document.getElementById(`${targetId}_direct_image`);
    const removeButton = document.getElementById(`${targetId}_direct_remove`);
    
    if (previewImage && removeButton) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        removeButton.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }
})();