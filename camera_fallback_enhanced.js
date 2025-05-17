/**
 * カメラアクセスがブロックされた場合のエンハンスドフォールバック機能
 * カメラが使用できない場合に、標準ファイル選択UIを使用する
 */
(function() {
  console.log('エンハンスドカメラフォールバックを初期化');
  
  // グローバル変数
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // DOMが読み込まれたら初期化
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * 初期化
   */
  function init() {
    console.log('カメラフォールバック初期化');
    
    // すべてのカメラボタンに直接フォールバックイベントを設定
    setupAllCameraButtonsFallback();
    
    // モーダル表示イベントを監視
    document.body.addEventListener('shown.bs.modal', function() {
      setTimeout(setupAllCameraButtonsFallback, 100);
    });
    
    // カメラエラーイベントを監視
    window.addEventListener('camera-error', handleCameraError);
  }
  
  /**
   * すべてのカメラボタンにフォールバック処理を設定
   */
  function setupAllCameraButtonsFallback() {
    document.querySelectorAll('.camera-button, [data-role="camera-button"]').forEach(function(button) {
      // すでに初期化済みならスキップ
      if (button.hasAttribute('data-fallback-initialized')) return;
      
      // ターゲットID属性を取得
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;
      
      // フォールバック用のファイル入力要素を作成
      const fallbackInput = createFallbackFileInput(targetId);
      document.body.appendChild(fallbackInput);
      
      // 既存のイベントをキャプチャしつつフォールバックも準備
      const originalClickHandler = button.onclick;
      button.onclick = function(e) {
        // 既存のハンドラがある場合は実行を試みる
        if (typeof originalClickHandler === 'function') {
          try {
            originalClickHandler.call(this, e);
          } catch (error) {
            console.error('カメラボタンの元のハンドラでエラー:', error);
            activateFallback(targetId);
          }
        }
        
        // 5秒後にカメラが起動していなければフォールバックを表示するタイマーをセット
        setTimeout(function() {
          const cameraModal = document.querySelector('.camera-modal, #direct-camera-modal, #simple-camera-modal');
          const video = document.querySelector('#direct-camera-video, #simple-video, .camera-feed');
          
          // カメラモーダルが表示されていて、ビデオが再生されていない場合
          if (cameraModal && video && (!video.srcObject || video.videoWidth === 0)) {
            console.log('カメラが起動していないためフォールバックを表示');
            activateFallback(targetId);
          }
        }, 5000);
      };
      
      // 初期化済みとしてマーク
      button.setAttribute('data-fallback-initialized', 'true');
      console.log(`カメラフォールバックを設定: ${targetId}`);
    });
  }
  
  /**
   * フォールバック用のファイル入力要素を作成
   */
  function createFallbackFileInput(targetId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.id = `fallback_${targetId}`;
    input.className = 'fallback-file-input';
    input.style.display = 'none';
    
    // モバイルデバイスでは写真を直接撮影できるようにする
    if (isMobileDevice) {
      input.capture = 'environment';
    }
    
    // ファイル選択時の処理
    input.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        const targetInput = document.getElementById(targetId);
        
        if (targetInput) {
          // FileListオブジェクトを作成してターゲット入力に設定
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          targetInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          targetInput.dispatchEvent(event);
          
          // プレビュー表示を更新
          updatePreview(targetId, file);
        }
      }
    });
    
    return input;
  }
  
  /**
   * フォールバックを有効化する
   */
  function activateFallback(targetId) {
    // 既存のモーダルを閉じる
    const modals = document.querySelectorAll('.camera-modal, #direct-camera-modal, #simple-camera-modal');
    modals.forEach(function(modal) {
      // モーダル内のビデオストリームを停止
      const video = modal.querySelector('video');
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      
      // モーダルを削除
      modal.remove();
    });
    
    // フォールバック入力を起動
    const fallbackInput = document.getElementById(`fallback_${targetId}`);
    if (fallbackInput) {
      fallbackInput.click();
    } else {
      console.error(`フォールバック入力が見つかりません: fallback_${targetId}`);
    }
  }
  
  /**
   * カメラエラーを処理
   */
  function handleCameraError(event) {
    console.log('カメラエラーイベントを受信:', event.detail);
    
    if (event.detail && event.detail.targetId) {
      activateFallback(event.detail.targetId);
    }
  }
  
  /**
   * プレビュー表示を更新
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
  
  // グローバルに公開
  window.activateCameraFallback = activateFallback;
  
  // 直接実行する
  setTimeout(init, 0);
})();