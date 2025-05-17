/**
 * 観光客登録用の身分証明書と証明写真アップロードハンドラ
 * ガイド登録からコピーした機能を観光客向けに最適化
 */
document.addEventListener('DOMContentLoaded', function() {
  // グローバルオブジェクトとして公開
  window.touristDocumentHandler = {
    setupDocumentTypeChange: handleDocumentTypeChange,
    setupDocumentInputs: setupDocumentInputs,
    setupDocumentRemoveButtons: setupDocumentRemoveButtons,
    setupDocumentPreviews: setupDocumentPreviews,
    collectDocumentFiles: collectDocumentFiles,
    setupPhotoUpload: setupTouristPhotoUpload
  };
  
  // 観光客登録モーダル表示時の処理
  const touristModal = document.getElementById('registerTouristModal');
  if (touristModal) {
    touristModal.addEventListener('shown.bs.modal', function() {
      // 身分証明書セクションと証明写真セクションを設定
      setupTouristDocumentSection();
      setupTouristPhotoUpload();
    });
  }
});

/**
 * 観光客登録用の身分証明書セクションの設定
 */
function setupTouristDocumentSection() {
  // 既存の身分証明書セクションがある場合は初期化
  if (document.getElementById('tourist-document-section')) {
    // 書類タイプの変更検知
    const documentTypeSelect = document.getElementById('tourist-document-type');
    if (documentTypeSelect) {
      documentTypeSelect.addEventListener('change', handleDocumentTypeChange);
      
      // 初期表示の設定
      if (documentTypeSelect.value) {
        showActiveSection(documentTypeSelect.value);
      } else {
        // 全セクションを非表示に
        hideAllDocumentSections();
      }
    }
    
    // ファイル入力と削除ボタンの設定
    setupDocumentInputs();
    setupDocumentRemoveButtons();
    setupDocumentPreviews();
    return;
  }

  // 身分証明書セクションを作成
  const modalBody = document.querySelector('#registerTouristModal .modal-body');
  if (!modalBody) return;

  // 既存の証明写真と身分証明書セクションを削除
  const existingPhotoSections = modalBody.querySelectorAll('.tourist-photo-section, .certificate-photo, .photo-section');
  existingPhotoSections.forEach(section => section.remove());
  
  const existingDocSections = modalBody.querySelectorAll('#id-document-section, .document-section');
  existingDocSections.forEach(section => section.remove());

  // 新しい身分証明書セクションを追加
  const documentSectionHTML = `
    <div id="tourist-document-section" class="mb-4">
      <h5 class="mb-3">身分証明書の確認</h5>
      <div class="card p-3">
        <div class="form-group mb-3">
          <label for="tourist-document-type" class="form-label">書類の種類</label>
          <select id="tourist-document-type" class="form-select">
            <option value="" selected disabled>書類の種類を選択してください</option>
            <option value="license">運転免許証</option>
            <option value="passport">パスポート</option>
            <option value="idcard">マイナンバーカード</option>
            <option value="residence">在留カード</option>
          </select>
        </div>
        
        <!-- 運転免許証アップロード -->
        <div id="license-upload-section" class="document-upload-section d-none">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="tourist-license-front" class="form-label">運転免許証（表面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="tourist-license-front" accept="image/jpeg, image/png, image/jpg">
                <button type="button" class="btn btn-outline-secondary document-remove-btn" data-target="tourist-license-front">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div id="tourist-license-front-preview" class="mt-2 preview-container d-none">
                <img src="#" class="img-fluid rounded" alt="表面プレビュー">
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="tourist-license-back" class="form-label">運転免許証（裏面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="tourist-license-back" accept="image/jpeg, image/png, image/jpg">
                <button type="button" class="btn btn-outline-secondary document-remove-btn" data-target="tourist-license-back">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div id="tourist-license-back-preview" class="mt-2 preview-container d-none">
                <img src="#" class="img-fluid rounded" alt="裏面プレビュー">
              </div>
            </div>
          </div>
          <div class="small text-muted">
            ※ 運転免許証の表裏両面をアップロードしてください。情報が鮮明に写っていることをご確認ください。
          </div>
        </div>
        
        <!-- パスポートアップロード -->
        <div id="passport-upload-section" class="document-upload-section d-none">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="tourist-passport-main" class="form-label">パスポート（顔写真ページ）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="tourist-passport-main" accept="image/jpeg, image/png, image/jpg">
                <button type="button" class="btn btn-outline-secondary document-remove-btn" data-target="tourist-passport-main">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div id="tourist-passport-main-preview" class="mt-2 preview-container d-none">
                <img src="#" class="img-fluid rounded" alt="パスポートプレビュー">
              </div>
            </div>
          </div>
          <div class="small text-muted">
            ※ パスポートの顔写真・氏名・パスポート番号が記載されているページをアップロードしてください。
          </div>
        </div>
        
        <!-- マイナンバーカードアップロード -->
        <div id="idcard-upload-section" class="document-upload-section d-none">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="tourist-idcard-front" class="form-label">マイナンバーカード（表面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="tourist-idcard-front" accept="image/jpeg, image/png, image/jpg">
                <button type="button" class="btn btn-outline-secondary document-remove-btn" data-target="tourist-idcard-front">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div id="tourist-idcard-front-preview" class="mt-2 preview-container d-none">
                <img src="#" class="img-fluid rounded" alt="表面プレビュー">
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="tourist-idcard-back" class="form-label">マイナンバーカード（裏面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="tourist-idcard-back" accept="image/jpeg, image/png, image/jpg">
                <button type="button" class="btn btn-outline-secondary document-remove-btn" data-target="tourist-idcard-back">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div id="tourist-idcard-back-preview" class="mt-2 preview-container d-none">
                <img src="#" class="img-fluid rounded" alt="裏面プレビュー">
              </div>
            </div>
          </div>
          <div class="small text-muted">
            ※ マイナンバーカードの表裏両面をアップロードしてください。マイナンバー（個人番号）が記載されている面は、番号が見えないようにマスキングしても問題ありません。
          </div>
        </div>
        
        <!-- 在留カードアップロード -->
        <div id="residence-upload-section" class="document-upload-section d-none">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="tourist-residence-front" class="form-label">在留カード（表面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="tourist-residence-front" accept="image/jpeg, image/png, image/jpg">
                <button type="button" class="btn btn-outline-secondary document-remove-btn" data-target="tourist-residence-front">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div id="tourist-residence-front-preview" class="mt-2 preview-container d-none">
                <img src="#" class="img-fluid rounded" alt="表面プレビュー">
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="tourist-residence-back" class="form-label">在留カード（裏面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="tourist-residence-back" accept="image/jpeg, image/png, image/jpg">
                <button type="button" class="btn btn-outline-secondary document-remove-btn" data-target="tourist-residence-back">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div id="tourist-residence-back-preview" class="mt-2 preview-container d-none">
                <img src="#" class="img-fluid rounded" alt="裏面プレビュー">
              </div>
            </div>
          </div>
          <div class="small text-muted">
            ※ 在留カードの表裏両面をアップロードしてください。情報が鮮明に写っていることをご確認ください。
          </div>
        </div>
      </div>
    </div>
  `;

  // 証明写真セクションを作成
  const photoSectionHTML = `
    <div id="tourist-photo-section" class="mb-4">
      <h5 class="mb-3">証明写真</h5>
      <div class="card p-3">
        <div class="row">
          <div class="col-md-4">
            <div id="tourist-photo-preview" class="preview-container mb-2 d-none">
              <img id="tourist-photo-image" src="#" alt="証明写真" class="img-fluid rounded">
            </div>
            <div id="tourist-photo-placeholder" class="d-flex flex-column align-items-center justify-content-center bg-light rounded p-3 text-center" style="height: 150px;">
              <i class="bi bi-person-badge fs-1 mb-2 text-secondary"></i>
              <span>写真が未設定です</span>
              <span class="text-danger small mt-2">※ 必須項目です</span>
            </div>
          </div>
          <div class="col-md-8">
            <p class="small text-muted mb-3">
              正面から撮影した顔写真をアップロードしてください。身分証明書とは別に必要です。
            </p>
            <div class="mb-3">
              <div class="row justify-content-center">
                <div class="col-6 text-center">
                  <button type="button" id="tourist-photo-file-btn" class="btn btn-outline-primary btn-lg p-3">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwN2JmZiIgY2xhc3M9ImJpIGJpLWZpbGUtZWFybWFyay1pbWFnZSIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNOC4yNTIgOGEuNS41IDAgMCAxIC42MzYtLjQ4N2wxLjk0Ni0uODI5YS41LjUgMCAxIDEgLjM5NC45MjdsLTEuOTQ2LjgyOWEuNS41IDAgMCAxLS42My0uNDR6Ii8+CiAgPHBhdGggZD0iTTYuNSA2YS41LjUgMCAwIDAgMCAxaDNhLjUuNSAwIDAgMCAwLTFoLTN6Ii8+CiAgPHBhdGggZD0iTTIgMmEyIDIgMCAwIDEgMi0yaDhhMiAyIDAgMCAxIDIgMnYxMmEyIDIgMCAwIDEtMiAySDRhMiAyIDAgMCAxLTItMlYyem0xMCAxYUgzdjkuOTI3YzAgLjAxNSAwIC4wMyAwIC4wNDNoOS45MzZBMS4wNiAxLjA2IDAgMCAwIDEzIDE0LjY0M1YzYy0uMDM5LS4wMS0uMDc3LS4wMjMtLjExNS0uMDMzYS42Mi42MiAwIDAgMS0uMDI1LS4wMTZDMTIuNjggMi45ODMgMTIuNTQ4IDMgMTIgM2MtLjU0OCAwLS42OC0uMDE3LS44Ni0uMDVhLjYyLjYyIDAgMCAxLS4wMjUtLjAxNmMtLjAzOC4wMS0uMDc2LjAyMy0uMTE1LjAzM3ptLTlTNC43IDMgNSAzaDZjLjMgMCAuNS0uMjI0LjUtLjVWMWMwLS4yNzYtLjIyNC0uNS0uNS0uNUg1YS40OTYuNDk2IDAgMCAwLS41LjV2MS41YzAgLjI3Ni4yMjQuNS41LjV6Ii8+Cjwvc3ZnPg==" alt="File" style="width: 50px; height: 50px;"><br>
                    <span class="d-block mt-2">ファイルから選択</span>
                  </button>
                </div>
                <div class="col-6 text-center">
                  <button type="button" id="tourist-photo-camera-btn" class="btn btn-outline-secondary btn-lg p-3">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzZjNzU3ZCIgY2xhc3M9ImJpIGJpLWNhbWVyYSIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNMTUgMTJhMSAxIDAgMCAxLTEgMUgyYTEgMSAwIDAgMS0xLTFWNmExIDEgMCAwIDEgMS0xaDEuMTcyYS4zLjMgMCAwIDAgLjIyNC0uMTI1bC45LS45YS4zLjMgMCAwIDEgLjIyNC0uMTI1SDExLjE4YS4zLjMgMCAwIDEgLjIyNC4xMjVsLjkuOWEuMy4zIDAgMCAwIC4yMjQuMTI1SDEzYTEgMSAwIDAgMSAxIDF2NnpNMiA0YTIgMiAwIDAgMC0yIDJ2NmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNmEyIDIgMCAwIDAtMi0yaC0xLjE3MmEuMy4zIDAgMCAxLS4yMjQtLjEyNWwtLjktLjlBLjMuMyAwIDAgMCAxMS4xNzggMkg0LjgyMmEuMy4zIDAgMCAwLS4yMjQuMTI1bC0uOS45QS4zLjMgMCAwIDEgMy40MTQgNEgyeiIvPgogIDxwYXRoIGQ9Ik04IDdjMS42NTcgMCAzIDEuMzQzIDMgM1M5LjY1NyAxMyA4IDEzcTYtOCAxMyAxMC0zIDAtMy0zIDMtNyAwLTEwem0wIDFhMiAyIDAgMSAwIDAgNCAwMTQgMTUgMCAyIDAgMCAwLTQgMHoiLz4KPC9zdmc+" alt="Camera" style="width: 50px; height: 50px;"><br>
                    <span class="d-block mt-2">カメラで撮影</span>
                  </button>
                </div>
              </div>
              <input type="file" id="tourist-photo-input" class="d-none" accept="image/jpeg, image/png, image/jpg">
            </div>
            <div class="d-flex justify-content-center mt-2">
              <button type="button" id="tourist-photo-remove-btn" class="btn btn-outline-danger btn-sm d-none">
                <i class="bi bi-trash"></i> 削除
              </button>
            </div>
            <div class="small text-muted text-center mt-3">
              JPG、PNG形式の画像（推奨サイズ500x500px以上、最大5MB）。<br>顔がはっきり見える正面向きの証明写真を使用してください。
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // モーダルボディの先頭に挿入
  modalBody.innerHTML = photoSectionHTML + documentSectionHTML + modalBody.innerHTML;

  // イベントリスナーを設定
  setupDocumentInputs();
  setupDocumentRemoveButtons();
  setupDocumentPreviews();
  
  // 書類タイプ変更検知
  const documentTypeSelect = document.getElementById('tourist-document-type');
  if (documentTypeSelect) {
    documentTypeSelect.addEventListener('change', handleDocumentTypeChange);
  }
}

/**
 * 証明写真アップロード機能を設定
 */
function setupTouristPhotoUpload() {
  // 既存のイベントリスナーを設定
  setupPhotoEventListeners();
  
  // 現在の証明写真ファイル
  window.currentTouristPhotoFile = null;
}

/**
 * 証明写真関連のイベントリスナーを設定
 */
function setupPhotoEventListeners() {
  // ファイル選択ボタン
  const fileButton = document.getElementById('tourist-photo-file-btn');
  if (fileButton) {
    fileButton.removeEventListener('click', handlePhotoFileButtonClick);
    fileButton.addEventListener('click', handlePhotoFileButtonClick);
  }

  // ファイル入力の変更
  const fileInput = document.getElementById('tourist-photo-input');
  if (fileInput) {
    fileInput.removeEventListener('change', handlePhotoInputChange);
    fileInput.addEventListener('change', handlePhotoInputChange);
  }

  // カメラボタン
  const cameraButton = document.getElementById('tourist-photo-camera-btn');
  if (cameraButton) {
    cameraButton.removeEventListener('click', handlePhotoCameraButtonClick);
    cameraButton.addEventListener('click', handlePhotoCameraButtonClick);
  }

  // 削除ボタン
  const removeButton = document.getElementById('tourist-photo-remove-btn');
  if (removeButton) {
    removeButton.removeEventListener('click', handlePhotoRemoveButtonClick);
    removeButton.addEventListener('click', handlePhotoRemoveButtonClick);
  }
}

/**
 * ファイル選択ボタンのクリックイベントハンドラ
 */
function handlePhotoFileButtonClick() {
  const input = document.getElementById('tourist-photo-input');
  if (input) {
    input.click();
  }
}

/**
 * ファイル入力の変更イベントハンドラ
 * @param {Event} e イベントオブジェクト
 */
function handlePhotoInputChange(e) {
  if (this.files && this.files[0]) {
    handleTouristPhotoChange(this.files[0]);
  }
}

/**
 * カメラボタンのクリックイベントハンドラ
 */
function handlePhotoCameraButtonClick() {
  showTouristPhotoCamera();
}

/**
 * 削除ボタンのクリックイベントハンドラ
 */
function handlePhotoRemoveButtonClick() {
  removeTouristPhoto();
}

/**
 * ファイル選択時の処理
 * @param {File} file 選択されたファイル
 */
function handleTouristPhotoChange(file) {
  // ファイルサイズのチェック（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズが大きすぎます（最大5MB）');
    return;
  }

  // ファイル形式のチェック
  if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
    alert('JPGまたはPNG形式の画像ファイルを選択してください');
    return;
  }

  // ファイルを保存
  window.currentTouristPhotoFile = file;

  // プレビュー表示
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewContainer = document.getElementById('tourist-photo-preview');
    const placeholder = document.getElementById('tourist-photo-placeholder');
    const previewImage = document.getElementById('tourist-photo-image');
    const removeButton = document.getElementById('tourist-photo-remove-btn');

    if (previewImage) previewImage.src = e.target.result;
    
    if (previewContainer) previewContainer.classList.remove('d-none');
    if (placeholder) placeholder.classList.add('d-none');
    if (removeButton) removeButton.classList.remove('d-none');
  };
  reader.readAsDataURL(file);
}

/**
 * 証明写真用カメラモーダルを表示
 */
function showTouristPhotoCamera() {
  // 既存のモーダルを削除
  const existingModal = document.getElementById('touristPhotoModal');
  if (existingModal) {
    existingModal.remove();
  }

  // カメラモーダル作成
  const modalHtml = `
    <div class="modal fade" id="touristPhotoModal" tabindex="-1" aria-labelledby="touristPhotoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="touristPhotoModalLabel">証明写真を撮影</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="tourist-photo-camera-feedback"></div>
            <div class="text-center mb-3">
              <div class="alert alert-info">カメラを起動しています。カメラへのアクセスを許可してください。</div>
            </div>
            <video id="touristPhotoPreview" class="w-100 border rounded" autoplay></video>
            <canvas id="touristPhotoCanvas" class="d-none"></canvas>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary" id="touristPhotoCaptureButton">
              <i class="bi bi-camera-fill me-1"></i> 撮影する
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // モーダルを表示
  try {
    const cameraModal = new bootstrap.Modal(document.getElementById('touristPhotoModal'));
    cameraModal.show();
  } catch (error) {
    console.error('カメラモーダル表示エラー:', error);
  }

  // カメラアクセス開始
  startTouristCamera();
}

/**
 * 証明写真用カメラを起動
 */
function startTouristCamera() {
  const video = document.getElementById('touristPhotoPreview');
  const captureButton = document.getElementById('touristPhotoCaptureButton');
  const canvas = document.getElementById('touristPhotoCanvas');
  const feedbackDiv = document.querySelector('.tourist-photo-camera-feedback');
  const infoAlert = document.querySelector('#touristPhotoModal .alert-info');
  
  if (!video || !captureButton || !canvas) {
    return;
  }

  // カメラへのアクセス
  navigator.mediaDevices.getUserMedia({ 
    video: { 
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'user'
    }, 
    audio: false 
  })
    .then(stream => {
      video.srcObject = stream;
      
      // 情報アラートを非表示
      if (infoAlert) {
        infoAlert.style.display = 'none';
      }

      // 撮影ボタンのイベント設定
      captureButton.addEventListener('click', function() {
        try {
          // キャンバスの準備
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // 画像データをBlobに変換
          canvas.toBlob(function(blob) {
            // ファイル名生成
            const fileName = `tourist_photo_${Date.now()}.png`;

            // Fileオブジェクトを作成
            const file = new File([blob], fileName, { type: 'image/png' });

            // 証明写真として設定
            handleTouristPhotoChange(file);

            // モーダルを閉じる
            try {
              const cameraModal = bootstrap.Modal.getInstance(document.getElementById('touristPhotoModal'));
              if (cameraModal) {
                cameraModal.hide();
              }
            } catch (error) {
              console.error('モーダルを閉じる際にエラーが発生しました:', error);
            }

            // ストリームを停止
            stopTouristCamera();
          }, 'image/png');
        } catch (error) {
          console.error('写真撮影中にエラーが発生しました:', error);
        }
      });
    })
    .catch(error => {
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `<div class="alert alert-danger">カメラにアクセスできません。デバイスのカメラ設定を確認してください。</div>`;
      }
      
      // 情報アラートをエラーアラートに変更
      if (infoAlert) {
        infoAlert.className = 'alert alert-danger';
        infoAlert.textContent = 'カメラにアクセスできません。デバイスのカメラ設定を確認してください。';
      }
    });

  // モーダルが閉じられたときにカメラを停止
  const modal = document.getElementById('touristPhotoModal');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', stopTouristCamera);
  }
}

/**
 * 証明写真用カメラを停止
 */
function stopTouristCamera() {
  const video = document.getElementById('touristPhotoPreview');
  if (video && video.srcObject) {
    try {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    } catch (error) {
      console.error('カメラ停止中にエラーが発生しました:', error);
    }
  }
}

/**
 * 証明写真を削除
 */
function removeTouristPhoto() {
  // ファイルをクリア
  window.currentTouristPhotoFile = null;
  const fileInput = document.getElementById('tourist-photo-input');
  if (fileInput) {
    fileInput.value = '';
  }

  // UI更新
  const previewContainer = document.getElementById('tourist-photo-preview');
  const placeholder = document.getElementById('tourist-photo-placeholder');
  const previewImage = document.getElementById('tourist-photo-image');
  const removeButton = document.getElementById('tourist-photo-remove-btn');

  if (previewContainer) previewContainer.classList.add('d-none');
  if (placeholder) placeholder.classList.remove('d-none');
  if (removeButton) removeButton.classList.add('d-none');
}

/**
 * 書類タイプ変更時のハンドラ
 */
function handleDocumentTypeChange() {
  const documentType = document.getElementById('tourist-document-type').value;
  showActiveSection(documentType);
}

/**
 * 選択された書類タイプに基づいて適切なセクションを表示
 * @param {string} documentType 書類タイプ
 */
function showActiveSection(documentType) {
  // すべてのセクションを一旦非表示に
  hideAllDocumentSections();
  
  // 選択されたタイプのセクションを表示
  const targetSection = document.getElementById(`${documentType}-upload-section`);
  if (targetSection) {
    targetSection.classList.remove('d-none');
  }
}

/**
 * すべての書類アップロードセクションを非表示にする
 */
function hideAllDocumentSections() {
  const sections = document.querySelectorAll('.document-upload-section');
  sections.forEach(section => {
    section.classList.add('d-none');
  });
}

/**
 * ファイル入力イベントリスナーの設定
 */
function setupDocumentInputs() {
  const fileInputs = document.querySelectorAll('#tourist-document-section input[type="file"]');
  fileInputs.forEach(input => {
    // 既存のイベントリスナーを削除してから新しいものを追加（重複防止）
    input.removeEventListener('change', handleFileInputChange);
    input.addEventListener('change', handleFileInputChange);
  });
}

/**
 * ファイル入力変更時のハンドラ
 * @param {Event} e イベントオブジェクト
 */
function handleFileInputChange(e) {
  const input = e.target;
  const file = input.files[0];
  
  if (!file) return;
  
  // ファイルサイズのチェック（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズが大きすぎます（最大5MB）');
    input.value = '';
    return;
  }
  
  // ファイル形式のチェック
  if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
    alert('JPGまたはPNG形式の画像ファイルを選択してください');
    input.value = '';
    return;
  }
  
  // プレビュー表示
  showFilePreview(input.id, file);
}

/**
 * ファイルプレビューの表示
 * @param {string} inputId 入力要素のID
 * @param {File} file ファイルオブジェクト
 */
function showFilePreview(inputId, file) {
  const previewId = `${inputId}-preview`;
  const previewContainer = document.getElementById(previewId);
  
  if (!previewContainer) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = previewContainer.querySelector('img');
    if (img) {
      img.src = e.target.result;
      previewContainer.classList.remove('d-none');
    }
  };
  reader.readAsDataURL(file);
}

/**
 * ファイル削除ボタンの設定
 */
function setupDocumentRemoveButtons() {
  const removeButtons = document.querySelectorAll('#tourist-document-section .document-remove-btn');
  removeButtons.forEach(button => {
    // 既存のイベントリスナーを削除してから新しいものを追加（重複防止）
    button.removeEventListener('click', handleRemoveButtonClick);
    button.addEventListener('click', handleRemoveButtonClick);
  });
}

/**
 * 削除ボタンクリック時のハンドラ
 * @param {Event} e イベントオブジェクト
 */
function handleRemoveButtonClick(e) {
  const button = e.currentTarget;
  const targetId = button.dataset.target;
  
  if (!targetId) return;
  
  // ファイル入力をクリア
  const input = document.getElementById(targetId);
  if (input) {
    input.value = '';
  }
  
  // プレビューを非表示
  const previewId = `${targetId}-preview`;
  const preview = document.getElementById(previewId);
  if (preview) {
    preview.classList.add('d-none');
  }
}

/**
 * プレビュー要素の設定
 */
function setupDocumentPreviews() {
  // 初期表示時のプレビュー設定
  const inputs = document.querySelectorAll('#tourist-document-section input[type="file"]');
  inputs.forEach(input => {
    if (input.files && input.files[0]) {
      showFilePreview(input.id, input.files[0]);
    }
  });
}

/**
 * アップロードされたファイルの収集
 * @returns {Object} ファイルオブジェクトのマップ
 */
function collectDocumentFiles() {
  const documentType = document.getElementById('tourist-document-type')?.value;
  if (!documentType) {
    return { valid: false, message: '身分証明書の種類を選択してください。' };
  }
  
  const files = {};
  
  // 書類タイプに応じたファイル入力を確認
  switch (documentType) {
    case 'license':
      const licenseFront = document.getElementById('tourist-license-front')?.files[0];
      const licenseBack = document.getElementById('tourist-license-back')?.files[0];
      
      if (!licenseFront || !licenseBack) {
        return { valid: false, message: '運転免許証の表面と裏面の両方をアップロードしてください。' };
      }
      
      files.type = 'license';
      files.front = licenseFront;
      files.back = licenseBack;
      break;
      
    case 'passport':
      const passportMain = document.getElementById('tourist-passport-main')?.files[0];
      
      if (!passportMain) {
        return { valid: false, message: 'パスポートの顔写真ページをアップロードしてください。' };
      }
      
      files.type = 'passport';
      files.main = passportMain;
      break;
      
    case 'idcard':
      const idcardFront = document.getElementById('tourist-idcard-front')?.files[0];
      const idcardBack = document.getElementById('tourist-idcard-back')?.files[0];
      
      if (!idcardFront || !idcardBack) {
        return { valid: false, message: 'マイナンバーカードの表面と裏面の両方をアップロードしてください。' };
      }
      
      files.type = 'idcard';
      files.front = idcardFront;
      files.back = idcardBack;
      break;
      
    case 'residence':
      const residenceFront = document.getElementById('tourist-residence-front')?.files[0];
      const residenceBack = document.getElementById('tourist-residence-back')?.files[0];
      
      if (!residenceFront || !residenceBack) {
        return { valid: false, message: '在留カードの表面と裏面の両方をアップロードしてください。' };
      }
      
      files.type = 'residence';
      files.front = residenceFront;
      files.back = residenceBack;
      break;
      
    default:
      return { valid: false, message: '身分証明書の種類が正しくありません。' };
  }
  
  // 証明写真のチェック
  const profilePhoto = window.currentTouristPhotoFile;
  if (!profilePhoto) {
    return { valid: false, message: '証明写真をアップロードしてください。' };
  }
  
  files.profilePhoto = profilePhoto;
  
  return { valid: true, files: files };
}

/**
 * 証明写真のFileオブジェクトを取得（他スクリプトから利用）
 * @returns {File|null} 証明写真のFileオブジェクト
 */
function getTouristPhotoFile() {
  return window.currentTouristPhotoFile;
}