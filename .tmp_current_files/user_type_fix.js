/**
 * ユーザータイプの選択とモーダル処理を行うスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  // ユーザータイプカード
  const touristCard = document.getElementById('touristCard');
  const guideCard = document.getElementById('guideCard');
  
  if (touristCard && guideCard) {
    // 観光客カードがクリックされたとき
    touristCard.addEventListener('click', function() {
      selectUserType('tourist');
    });
    
    // ガイドカードがクリックされたとき
    guideCard.addEventListener('click', function() {
      selectUserType('guide');
    });
  }
  
  /**
   * ユーザータイプを選択
   */
  function selectUserType(type) {
    // ユーザータイプに基づいてモーダルを表示
    if (type === 'tourist') {
      showTouristModal();
    } else if (type === 'guide') {
      showGuideModal();
    }
  }
  
  /**
   * 観光客登録モーダルを表示
   */
  function showTouristModal() {
    showModal('tourist');
  }
  
  /**
   * ガイド登録モーダルを表示
   */
  function showGuideModal() {
    showModal('guide');
  }
  
  /**
   * モーダルを表示
   */
  function showModal(userType) {
    // モーダル要素を作成
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = userType + 'Modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    
    // タイトルを設定
    const title = userType === 'tourist' ? '観光客登録' : 'ガイド登録';
    
    // モーダルコンテンツを設定
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${userType === 'guide' ? getGuideModalContent() : getTouristModalContent()}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary">登録</button>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをドキュメントに追加
    document.body.appendChild(modal);
    
    // Bootstrapモーダルを初期化して表示
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // クリーンアップ: モーダルが閉じられたら要素を削除
    modal.addEventListener('hidden.bs.modal', function() {
      document.body.removeChild(modal);
    });
    
    // ガイドの場合、書類アップロードのイベントリスナーを設定
    if (userType === 'guide') {
      setupDocumentUploadListeners(modal);
    }
  }
  
  /**
   * 観光客モーダルのコンテンツを取得
   */
  function getTouristModalContent() {
    return `
      <div class="mb-3">
        <label for="tourist-name" class="form-label">氏名</label>
        <input type="text" class="form-control" id="tourist-name">
      </div>
      <div class="mb-3">
        <label for="tourist-email" class="form-label">メールアドレス</label>
        <input type="email" class="form-control" id="tourist-email">
      </div>
      <div class="mb-3">
        <label for="tourist-password" class="form-label">パスワード</label>
        <input type="password" class="form-control" id="tourist-password">
      </div>
      <div class="mb-3">
        <label for="tourist-phone" class="form-label">電話番号</label>
        <input type="tel" class="form-control" id="tourist-phone">
      </div>
    `;
  }
  
  /**
   * ガイドモーダルのコンテンツを取得
   */
  function getGuideModalContent() {
    return `
      <div class="mb-3">
        <label for="guide-name" class="form-label">氏名</label>
        <input type="text" class="form-control" id="guide-name">
      </div>
      <div class="mb-3">
        <label for="guide-email" class="form-label">メールアドレス</label>
        <input type="email" class="form-control" id="guide-email">
      </div>
      <div class="mb-3">
        <label for="guide-password" class="form-label">パスワード</label>
        <input type="password" class="form-control" id="guide-password">
      </div>
      <div class="mb-3">
        <label for="guide-phone" class="form-label">電話番号</label>
        <input type="tel" class="form-control" id="guide-phone">
      </div>
      
      <h6 class="mt-4 mb-3">身分証明書</h6>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label>photo front</label>
          <div class="card mb-2">
            <div class="card-body p-2 text-center">
              <img id="front-photo-preview" class="img-fluid" style="max-height: 150px; display: none;">
              <div id="front-photo-placeholder" class="border rounded p-3 text-center bg-light">
                <div class="text-muted">ダミーイメージ (前面)</div>
              </div>
            </div>
          </div>
          <div class="d-grid gap-2">
            <button class="btn btn-primary photo-select-btn" type="button" data-side="front">PHOTO FRONT SELECT</button>
            <button class="btn btn-primary camera-btn" type="button" data-side="front">
              <i class="bi bi-camera"></i> カメラで撮影する
            </button>
            <input type="file" id="front-photo-input" class="photo-input" data-side="front" style="display: none;">
          </div>
        </div>
        
        <div class="col-md-6 mb-3">
          <label>photo back</label>
          <div class="card mb-2">
            <div class="card-body p-2 text-center">
              <img id="back-photo-preview" class="img-fluid" style="max-height: 150px; display: none;">
              <div id="back-photo-placeholder" class="border rounded p-3 text-center bg-light">
                <div class="text-muted">ダミーイメージ (裏面)</div>
              </div>
            </div>
          </div>
          <div class="d-grid gap-2">
            <button class="btn btn-primary photo-select-btn" type="button" data-side="back">PHOTO BACK SELECT</button>
            <button class="btn btn-primary camera-btn" type="button" data-side="back">
              <i class="bi bi-camera"></i> カメラで撮影する
            </button>
            <input type="file" id="back-photo-input" class="photo-input" data-side="back" style="display: none;">
          </div>
        </div>
      </div>
      
      <div class="mb-3">
        <label>photo dual requirements</label>
        <div class="alert alert-warning">
          <small>身分証明書の表面と裏面の両方をアップロードしてください。</small>
        </div>
      </div>
    `;
  }
  
  /**
   * 書類アップロードのイベントリスナーを設定
   */
  function setupDocumentUploadListeners(modal) {
    // 写真選択ボタン
    const photoSelectButtons = modal.querySelectorAll('.photo-select-btn');
    photoSelectButtons.forEach(button => {
      button.addEventListener('click', function() {
        const side = button.getAttribute('data-side');
        const input = modal.querySelector(`#${side}-photo-input`);
        if (input) {
          input.click();
        }
      });
    });
    
    // 写真入力
    const photoInputs = modal.querySelectorAll('.photo-input');
    photoInputs.forEach(input => {
      input.addEventListener('change', function() {
        const side = input.getAttribute('data-side');
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const preview = modal.querySelector(`#${side}-photo-preview`);
            const placeholder = modal.querySelector(`#${side}-photo-placeholder`);
            if (preview && placeholder) {
              preview.src = e.target.result;
              preview.style.display = 'block';
              placeholder.style.display = 'none';
            }
          };
          reader.readAsDataURL(input.files[0]);
        }
      });
    });
    
    // カメラボタン
    const cameraButtons = modal.querySelectorAll('.camera-btn');
    cameraButtons.forEach(button => {
      button.addEventListener('click', function() {
        const side = button.getAttribute('data-side');
        showCameraModal(side === 'back');
      });
    });
  }
  
  /**
   * カメラモーダル表示
   */
  function showCameraModal(isBack) {
    // モーダル要素を作成
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'cameraModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'cameraModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    // タイトルを設定
    const titleText = isBack ? '身分証明書裏面の撮影' : '身分証明書表面の撮影';
    
    // モーダルコンテンツを設定
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cameraModalLabel">${titleText}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <video autoplay style="width: 100%;"></video>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary capture-btn">撮影</button>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをドキュメントに追加
    document.body.appendChild(modal);
    
    // Bootstrapモーダルを初期化して表示
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // ビデオ要素を取得
    const video = modal.querySelector('video');
    
    // カメラを起動
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          video.srcObject = stream;
        })
        .catch(function(error) {
          console.error('カメラエラー:', error);
        });
    }
    
    // 撮影ボタンのイベントリスナー
    const captureButton = modal.querySelector('.capture-btn');
    if (captureButton) {
      captureButton.addEventListener('click', function() {
        capture();
      });
    }
    
    // クリーンアップ: モーダルが閉じられたら要素を削除
    modal.addEventListener('hidden.bs.modal', function() {
      // カメラストリームを停止
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      document.body.removeChild(modal);
    });
    
    /**
     * 写真を撮影
     */
    function capture() {
      if (!video.srcObject) return;
      
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // キャンバスに映像をキャプチャ
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // データURLを取得
      const dataURL = canvas.toDataURL('image/jpeg');
      
      // 撮影ボタンを非表示
      captureButton.style.display = 'none';
      
      // ビデオを非表示
      video.style.display = 'none';
      
      // 画像を表示
      const img = document.createElement('img');
      img.src = dataURL;
      img.className = 'img-fluid';
      img.style.maxHeight = '300px';
      
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        modalBody.appendChild(img);
      }
      
      // 使用ボタンを追加
      const useButton = document.createElement('button');
      useButton.type = 'button';
      useButton.className = 'btn btn-success';
      useButton.textContent = 'この写真を使用';
      
      const modalFooter = modal.querySelector('.modal-footer');
      if (modalFooter) {
        modalFooter.appendChild(useButton);
      }
      
      // 使用ボタンのイベントリスナー
      useButton.addEventListener('click', function() {
        // ビデオストリームを停止
        if (video.srcObject) {
          const tracks = video.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
        
        // モーダルを非表示
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        }
        
        // 親モーダルの画像を更新
        const parentModal = document.querySelector('#guideModal');
        if (parentModal) {
          const side = isBack ? 'back' : 'front';
          const preview = parentModal.querySelector(`#${side}-photo-preview`);
          const placeholder = parentModal.querySelector(`#${side}-photo-placeholder`);
          
          if (preview && placeholder) {
            preview.src = dataURL;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
          }
        }
      });
    }
  }
});