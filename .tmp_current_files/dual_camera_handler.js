/**
 * 表裏写真用のカメラハンドラー
 * 既存のIDプレフィックスに合わせて適切に動作
 */
(function() {
  // モバイルデバイスではスキップ
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイル環境では実行しません');
    return;
  }
  
  console.log('表裏モード対応カメラハンドラーを初期化');

  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCameraHandler);
  } else {
    initCameraHandler();
  }
  
  // カメラハンドラーの初期化
  function initCameraHandler() {
    // 定期的にカメラボタンを監視
    setInterval(function() {
      // 表面カメラボタン
      document.querySelectorAll('#id-photo-front-camera-btn, #back-photo-camera-btn').forEach(function(btn) {
        if (!btn.hasAttribute('data-camera-handler')) {
          btn.setAttribute('data-camera-handler', 'true');
          btn.addEventListener('click', function() {
            // IDから対象を判断
            const targetId = this.id.includes('front') ? 'front' : 'back';
            openDualCamera(targetId);
          });
        }
      });
      
      // 裏面カメラボタン
      document.querySelectorAll('#id-photo-back-camera-btn').forEach(function(btn) {
        if (!btn.hasAttribute('data-camera-handler')) {
          btn.setAttribute('data-camera-handler', 'true');
          btn.addEventListener('click', function() {
            openDualCamera('back');
          });
        }
      });
    }, 1000);
  }
  
  // カメラモーダルを開く
  function openDualCamera(targetId) {
    console.log(`${targetId}面のカメラモーダルを開きます`);
    
    // 既存のカメラモーダルがあれば削除
    let existingModal = document.getElementById('dualCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // カメラモーダルのHTMLを作成
    const modalHTML = `
      <div class="modal fade" id="dualCameraModal" tabindex="-1" aria-labelledby="dualCameraModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="dualCameraModalLabel">${targetId === 'front' ? '表' : '裏'}面の写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div id="dualCameraContainer" class="text-center">
                <div id="dualVideoContainer" class="mb-3">
                  <video id="dualVideo" class="w-100 rounded border" autoplay playsinline></video>
                </div>
                <div id="dualPreviewContainer" class="mb-3 d-none">
                  <canvas id="dualCanvas" class="w-100 rounded border"></canvas>
                </div>
                <div id="dualFeedbackContainer" class="alert alert-info d-none mb-3" role="alert">
                  カメラへのアクセス許可を確認してください
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="dualCaptureBtn" class="btn btn-primary">
                <i class="bi bi-camera"></i> 撮影する
              </button>
              <button type="button" id="dualRetakeBtn" class="btn btn-outline-primary d-none">
                <i class="bi bi-arrow-repeat"></i> 撮り直す
              </button>
              <button type="button" id="dualUsePhotoBtn" class="btn btn-success d-none">
                <i class="bi bi-check-lg"></i> この写真を使用
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // モーダル要素を取得
    const modal = document.getElementById('dualCameraModal');
    
    // Bootstrap Modalインスタンスを作成
    const bsModal = new window.bootstrap.Modal(modal);
    
    // ビデオ要素とボタンを取得
    const video = document.getElementById('dualVideo');
    const canvas = document.getElementById('dualCanvas');
    const captureBtn = document.getElementById('dualCaptureBtn');
    const retakeBtn = document.getElementById('dualRetakeBtn');
    const usePhotoBtn = document.getElementById('dualUsePhotoBtn');
    const videoContainer = document.getElementById('dualVideoContainer');
    const previewContainer = document.getElementById('dualPreviewContainer');
    const feedbackContainer = document.getElementById('dualFeedbackContainer');
    
    // ストリームを格納する変数
    let stream = null;
    
    // カメラの起動
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        video.srcObject = stream;
        videoContainer.classList.remove('d-none');
        previewContainer.classList.add('d-none');
        captureBtn.classList.remove('d-none');
        retakeBtn.classList.add('d-none');
        usePhotoBtn.classList.add('d-none');
        feedbackContainer.classList.add('d-none');
      } catch (err) {
        console.error('カメラアクセスエラー:', err);
        feedbackContainer.textContent = 'カメラへのアクセスが拒否されました。設定を確認してください。';
        feedbackContainer.classList.remove('d-none');
        feedbackContainer.classList.remove('alert-info');
        feedbackContainer.classList.add('alert-danger');
      }
    }
    
    // カメラの停止
    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    }
    
    // 写真の撮影
    function capturePhoto() {
      const ctx = canvas.getContext('2d');
      
      // ビデオの縦横比を保持するためのサイズ計算
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      // キャンバスのサイズをビデオに合わせる
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      // ビデオフレームをキャンバスに描画
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // UIの更新
      videoContainer.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      usePhotoBtn.classList.remove('d-none');
    }
    
    // 写真を使用
    function usePhoto() {
      // キャンバスの画像データを取得
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      
      // プレビュー要素と入力要素のIDを生成（表面または裏面に基づく）
      const previewId = `id-photo-${targetId}-preview`;
      const imageId = `id-photo-${targetId}-image`;
      const placeholderId = `id-photo-${targetId}-placeholder`;
      const removeId = `id-photo-${targetId}-remove-btn`;
      
      // 要素を取得
      const previewContainer = document.getElementById(previewId);
      const previewImg = document.getElementById(imageId);
      const placeholder = document.getElementById(placeholderId);
      const removeBtn = document.getElementById(removeId);
      
      // DOM要素が見つかった場合に更新
      if (previewContainer && previewImg && placeholder) {
        previewImg.src = photoData;
        previewContainer.classList.remove('d-none');
        placeholder.classList.add('d-none');
        
        if (removeBtn) {
          removeBtn.classList.remove('d-none');
        }
        
        console.log(`${targetId}面の写真を更新しました`);
      } else {
        console.warn(`${targetId}面のDOM要素が見つかりません`);
      }
      
      // モーダルを閉じる
      bsModal.hide();
    }
    
    // イベントリスナーの設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', startCamera);
    usePhotoBtn.addEventListener('click', usePhoto);
    
    // モーダルが閉じられたときのハンドラー
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      setTimeout(() => modal.remove(), 200);
    });
    
    // モーダルが表示されたときのハンドラー
    modal.addEventListener('shown.bs.modal', startCamera);
    
    // モーダルを表示
    bsModal.show();
  }
})();