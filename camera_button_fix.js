/**
 * カメラ機能ボタンの修正スクリプト
 * カメラモーダルの撮影ボタンを正しく機能させる
 */
(function() {
  'use strict';

  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', initCameraButtonFix);

  // MutationObserverでカメラモーダルの表示を監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // カメラモーダルが追加されたかチェック
            const cameraModal = node.id === 'cameraModal' ? node : node.querySelector('#cameraModal');
            if (cameraModal) {
              setupCaptureButton(cameraModal);
            }
          }
        });
      }
    });
  });

  /**
   * カメラボタン修正初期化
   */
  function initCameraButtonFix() {
    // モーダル追加の監視を開始
    observer.observe(document.body, { childList: true, subtree: true });

    // Bootstrapモーダル表示イベントのリスナーを追加
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      if (modal && modal.id === 'cameraModal') {
        setupCaptureButton(modal);
      }
    });

    // 既存のカメラモーダルがあれば初期化
    const existingModal = document.getElementById('cameraModal');
    if (existingModal) {
      setupCaptureButton(existingModal);
    }
  }

  /**
   * 撮影ボタンの設定と修正
   * @param {HTMLElement} modal カメラモーダル要素
   */
  function setupCaptureButton(modal) {
    // モーダル内の撮影ボタンを取得
    const captureButton = modal.querySelector('#captureButton');
    if (!captureButton) return;

    // すでに設定済みなら処理しない
    if (captureButton.hasAttribute('data-capture-handler-attached')) return;

    // 撮影ボタンのテキストとスタイルを変更
    captureButton.innerHTML = '<i class="bi bi-camera-fill"></i> 撮影する';
    captureButton.classList.add('btn-primary');
    captureButton.classList.remove('btn-secondary');

    // 撮影ボタンのクリックイベントが機能するか確認
    const originalClick = captureButton.onclick;
    captureButton.onclick = function(event) {
      console.log('撮影ボタンがクリックされました');
      
      // オリジナルのクリックハンドラーがあれば呼び出す
      if (typeof originalClick === 'function') {
        originalClick.call(this, event);
      } else {
        // オリジナルのハンドラーがなければ、手動で撮影処理を呼び出す
        const video = modal.querySelector('#cameraPreview');
        if (video && video.srcObject) {
          capturePhoto(video, modal);
        }
      }
    };

    // 設定済みマークを付ける
    captureButton.setAttribute('data-capture-handler-attached', 'true');
    console.log('撮影ボタンを設定しました');
  }

  /**
   * 写真を撮影する処理
   * @param {HTMLVideoElement} video ビデオ要素
   * @param {HTMLElement} modal モーダル要素
   */
  function capturePhoto(video, modal) {
    const canvas = modal.querySelector('#cameraCanvas') || document.createElement('canvas');
    
    // Canvasサイズをビデオサイズに設定
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 映像をCanvasに描画
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 画像データをBlobに変換
    canvas.toBlob(function(blob) {
      // FileオブジェクトにBlobを変換
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // 関連するファイル入力要素を探す
      const targetInputId = modal.getAttribute('data-target-input');
      const fileInput = document.getElementById(targetInputId);
      
      // ファイル入力要素があれば更新
      if (fileInput) {
        // FileListオブジェクトをシミュレート
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // ファイル変更イベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
      
      // モーダルを閉じる
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      // カメラを停止
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
    }, 'image/jpeg', 0.95);
  }
})();