/**
 * 身分証明書カメラ機能の改良版
 * 即時実行関数でスコープを分離して変数競合を防止
 */
(function() {
  'use strict';
  
  // DOMの読み込みが完了したら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 現在のカメラストリームを保存する変数
  let cameraStream = null;
  
  /**
   * 初期化処理
   */
  function init() {
    // モーダルが表示されたときにカメラボタンを設定
    document.addEventListener('shown.bs.modal', function(event) {
      if (!event.target || !event.target.id) return;
      
      if (event.target.id.includes('RegisterModal') || 
          event.target.id.includes('DocumentModal')) {
        setupCameraButtons();
      }
    });
    
    // 初期実行
    setupCameraButtons();
  }
  
  /**
   * カメラボタンのセットアップ
   */
  function setupCameraButtons() {
    const singleCameraBtn = document.getElementById('id-photo-camera-btn');
    const frontCameraBtn = document.getElementById('id-photo-front-camera-btn');
    const backCameraBtn = document.getElementById('id-photo-back-camera-btn');
    
    if (singleCameraBtn && !singleCameraBtn.hasAttribute('data-fixed')) {
      singleCameraBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showCamera('single');
      });
      singleCameraBtn.setAttribute('data-fixed', 'true');
    }
    
    if (frontCameraBtn && !frontCameraBtn.hasAttribute('data-fixed')) {
      frontCameraBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showCamera('front');
      });
      frontCameraBtn.setAttribute('data-fixed', 'true');
    }
    
    if (backCameraBtn && !backCameraBtn.hasAttribute('data-fixed')) {
      backCameraBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showCamera('back');
      });
      backCameraBtn.setAttribute('data-fixed', 'true');
    }
  }
  
  /**
   * カメラモーダルを表示
   */
  function showCamera(photoType) {
    console.log(`カメラモーダルを表示: ${photoType}`);
    
    // 既存のモーダルをクリーンアップ
    const existingModal = document.getElementById('documentCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルを作成
    const modalHtml = `
      <div class="modal fade" id="documentCameraModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <div class="video-container">
                  <video id="document-camera-video" class="w-100" playsinline autoplay></video>
                  <canvas id="document-camera-canvas" class="d-none"></canvas>
                </div>
                <div id="document-camera-preview" class="preview-container mt-3 text-center d-none">
                  <img id="document-preview-image" class="img-fluid rounded" alt="プレビュー">
                </div>
                <div id="document-camera-error" class="alert alert-danger d-none" role="alert">
                  カメラにアクセスできません。デバイスのカメラ設定を確認してください。
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="document-capture-btn" class="btn btn-primary">撮影する</button>
              <button type="button" id="document-retake-btn" class="btn btn-outline-primary d-none">撮り直す</button>
              <button type="button" id="document-use-btn" class="btn btn-success d-none">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // モーダルを表示
    const modalElement = document.getElementById('documentCameraModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // 要素取得
    const video = document.getElementById('document-camera-video');
    const canvas = document.getElementById('document-camera-canvas');
    const captureBtn = document.getElementById('document-capture-btn');
    const retakeBtn = document.getElementById('document-retake-btn');
    const useBtn = document.getElementById('document-use-btn');
    const previewContainer = document.getElementById('document-camera-preview');
    const previewImage = document.getElementById('document-preview-image');
    const errorAlert = document.getElementById('document-camera-error');
    
    // モーダルが閉じられたときにカメラを停止
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // カメラ起動
    startCamera();
    
    // ボタンイベント設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    useBtn.addEventListener('click', function() {
      usePhoto(photoType);
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
        .then(function(stream) {
          cameraStream = stream;
          video.srcObject = stream;
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
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
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
    function usePhoto(type) {
      canvas.toBlob(function(blob) {
        if (!blob) {
          console.error('画像の変換に失敗しました');
          return;
        }
        
        // 写真タイプに応じたファイル入力IDを決定
        let inputId;
        if (type === 'single') {
          inputId = 'id-photo-input';
        } else if (type === 'front') {
          inputId = 'id-photo-front-input';
        } else if (type === 'back') {
          inputId = 'id-photo-back-input';
        } else {
          console.error('不明な写真タイプ:', type);
          return;
        }
        
        // ファイル入力を取得
        const fileInput = document.getElementById(inputId);
        if (!fileInput) {
          console.error('ファイル入力要素が見つかりません:', inputId);
          return;
        }
        
        // ファイル名を設定
        const fileName = `photo_${type}_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        try {
          // DataTransferオブジェクトを使用してファイル入力を更新
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // changeイベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          console.log(`${type}写真が正常に設定されました`);
        } catch (error) {
          console.error('ファイル入力の更新に失敗しました:', error);
        }
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/jpeg', 0.95);
    }
  }
})();