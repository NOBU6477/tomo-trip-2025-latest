/**
 * 観光客向け証明写真アップロード機能を提供するスクリプト
 * カメラでの撮影機能、プレビュー機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {
  setupTouristProfilePhotoUpload();
});

// 証明写真の現在のFileオブジェクト
let currentTouristPhotoFile = null;

/**
 * 証明写真アップロード機能を設定
 */
function setupTouristProfilePhotoUpload() {
  // 観光客登録モーダルの表示を検知して設定
  const touristRegisterModal = document.getElementById('registerTouristModal');
  if (touristRegisterModal) {
    touristRegisterModal.addEventListener('shown.bs.modal', () => {
      setTimeout(initTouristPhotoSection, 300);
    });
  }

  // 既に表示されている場合にも対応
  if (touristRegisterModal && window.getComputedStyle(touristRegisterModal).display !== 'none') {
    setTimeout(initTouristPhotoSection, 300);
  }
}

/**
 * 証明写真セクションの初期化
 */
function initTouristPhotoSection() {
  // 既存の証明写真セクションがあるか確認
  const existingSection = document.querySelector('#registerTouristModal .tourist-photo-section');
  if (existingSection) {
    setupTouristPhotoListeners();
    return;
  }

  console.log('観光客証明写真セクションを初期化します');
  
  // 証明写真セクションを探す
  const photoSectionContainer = document.querySelector('#registerTouristModal .modal-body');
  if (!photoSectionContainer) {
    console.error('観光客登録モーダルが見つかりません');
    return;
  }

  // 既存の証明写真セクションがあれば削除（重複防止）
  const oldPhotoSections = photoSectionContainer.querySelectorAll('.certificate-photo, .photo-section');
  if (oldPhotoSections.length > 0) {
    console.log('既存の証明写真セクションを削除します:', oldPhotoSections.length);
    oldPhotoSections.forEach(section => section.remove());
  }

  const photoSectionHTML = `
    <div class="tourist-photo-section mt-4">
      <div class="col-12">
        <label class="form-label fw-bold">証明写真</label>
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
                <p class="text-center mb-2"><strong>アップロード方法を選択:</strong></p>
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
    </div>
  `;

  // 最初の身分証明書セクションの前に挿入
  const idDocSection = photoSectionContainer.querySelector('#id-document-section');
  if (idDocSection) {
    idDocSection.insertAdjacentHTML('beforebegin', photoSectionHTML);
  } else {
    // 身分証明書セクションがなければ、モーダルボディの最初に挿入
    photoSectionContainer.insertAdjacentHTML('afterbegin', photoSectionHTML);
  }
  
  // イベントリスナーを設定
  setupTouristPhotoListeners();
  
  // 国際化があれば適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

/**
 * 証明写真関連のイベントリスナーを設定
 */
function setupTouristPhotoListeners() {
  console.log('観光客証明写真のイベントリスナーを設定します');
  
  // ファイル選択ボタン
  const fileButton = document.getElementById('tourist-photo-file-btn');
  if (fileButton) {
    fileButton.addEventListener('click', function() {
      const input = document.getElementById('tourist-photo-input');
      if (input) {
        input.click();
      }
    });
  }

  // ファイル入力の変更
  const fileInput = document.getElementById('tourist-photo-input');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        handleTouristPhotoChange(this.files[0]);
      }
    });
  }

  // カメラボタン
  const cameraButton = document.getElementById('tourist-photo-camera-btn');
  if (cameraButton) {
    cameraButton.addEventListener('click', function() {
      showTouristPhotoCamera();
    });
  }

  // 削除ボタン
  const removeButton = document.getElementById('tourist-photo-remove-btn');
  if (removeButton) {
    removeButton.addEventListener('click', function() {
      removeTouristPhoto();
    });
  }
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
  currentTouristPhotoFile = file;

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
  currentTouristPhotoFile = null;
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
 * 証明写真のFileオブジェクトを取得（他スクリプトから利用）
 * @returns {File|null} 証明写真のFileオブジェクト
 */
function getTouristPhotoFile() {
  return currentTouristPhotoFile;
}

// グローバルに公開
window.touristPhotoHandler = {
  getTouristPhotoFile: getTouristPhotoFile
};