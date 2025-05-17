/**
 * 証明写真アップロード機能を提供するスクリプト
 * カメラでの撮影機能、プレビュー機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {
  setupProfilePhotoUpload();
});

// 証明写真の現在のFileオブジェクト
let currentProfilePhotoFile = null;

/**
 * 証明写真アップロード機能を設定
 */
function setupProfilePhotoUpload() {
  // ガイド登録モーダルの表示を検知して設定
  const guideRegisterModal = document.getElementById('guideRegisterModal');
  if (guideRegisterModal) {
    guideRegisterModal.addEventListener('shown.bs.modal', () => {
      initProfilePhotoSection();
    });
  }

  // 既に表示されている場合にも対応
  if (guideRegisterModal && window.getComputedStyle(guideRegisterModal).display !== 'none') {
    initProfilePhotoSection();
  }
}

/**
 * 証明写真セクションの初期化
 */
function initProfilePhotoSection() {
  // 既存の証明写真セクションがあるか確認
  if (document.getElementById('id-photo-section')) {
    setupProfilePhotoListeners();
    return;
  }

  console.log('証明写真セクションを初期化します');
  
  // 証明写真セクションが存在しない場合、身分証明書セクションの下に追加
  const idDocumentSection = document.querySelector('#guideRegisterModal .card');
  if (!idDocumentSection) {
    console.error('身分証明書セクションが見つかりません');
    return;
  }

  const photoSectionHTML = `
    <div id="id-photo-section" class="row mt-4">
      <div class="col-12">
        <label class="form-label fw-bold">証明写真</label>
        <div class="card p-3">
          <div class="row">
            <div class="col-md-4">
              <div id="id-photo-preview" class="preview-container mb-2 d-none">
                <img id="id-photo-image" src="#" alt="証明写真" class="img-fluid rounded">
              </div>
              <div id="id-photo-placeholder" class="d-flex flex-column align-items-center justify-content-center bg-light rounded p-3 text-center" style="height: 150px;">
                <i class="bi bi-person-badge fs-1 mb-2 text-secondary"></i>
                <span data-i18n="profile.photo_placeholder">写真が未設定です</span>
              </div>
            </div>
            <div class="col-md-8">
              <h6 class="mb-3" data-i18n="profile.photo_upload">証明写真をアップロード</h6>
              <div class="mb-3">
                <div class="d-grid gap-2 d-md-flex">
                  <button type="button" id="id-photo-file-btn" class="btn btn-primary flex-grow-1">
                    <i class="bi bi-file-earmark-image"></i> ファイルの選択
                  </button>
                  <button type="button" id="id-photo-camera-btn" class="btn btn-outline-primary flex-grow-1">
                    <i class="bi bi-camera"></i> <span data-i18n="profile.camera">カメラ</span>
                  </button>
                  <input type="file" id="id-photo-input" class="d-none" accept="image/jpeg, image/png, image/jpg">
                </div>
                <button type="button" id="id-photo-remove-btn" class="btn btn-outline-secondary btn-sm mt-2 d-none">
                  <i class="bi bi-trash"></i> <span data-i18n="profile.remove_photo">削除</span>
                </button>
              </div>
              <div class="small text-muted" data-i18n="profile.photo_requirements">
                JPG、PNG形式の画像（推奨サイズ500x500px以上、最大5MB）。顔がはっきり見える正面向きの証明写真を使用してください。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 身分証明書セクションの後に挿入
  idDocumentSection.insertAdjacentHTML('afterend', photoSectionHTML);
  
  // イベントリスナーを設定
  setupProfilePhotoListeners();
  
  // 国際化があれば適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

/**
 * 証明写真関連のイベントリスナーを設定
 */
function setupProfilePhotoListeners() {
  console.log('証明写真のイベントリスナーを設定します');
  
  // ファイル選択ボタン
  const fileButton = document.getElementById('id-photo-file-btn');
  if (fileButton) {
    console.log('ファイル選択ボタンを検出しました');
    fileButton.addEventListener('click', function() {
      const input = document.getElementById('id-photo-input');
      if (input) {
        console.log('ファイル選択ボタンがクリックされました');
        input.click();
      }
    });
  } else {
    console.error('ファイル選択ボタンが見つかりません');
  }

  // ファイル入力の変更
  const fileInput = document.getElementById('id-photo-input');
  if (fileInput) {
    console.log('ファイル入力フィールドを検出しました');
    fileInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        console.log('ファイルが選択されました:', this.files[0].name);
        handleProfilePhotoChange(this.files[0]);
      }
    });
  } else {
    console.error('ファイル入力フィールドが見つかりません');
  }

  // カメラボタン
  const cameraButton = document.getElementById('id-photo-camera-btn');
  if (cameraButton) {
    console.log('カメラボタンを検出しました');
    cameraButton.addEventListener('click', function() {
      console.log('カメラボタンがクリックされました');
      showProfilePhotoCamera();
    });
  } else {
    console.error('カメラボタンが見つかりません');
  }

  // 削除ボタン
  const removeButton = document.getElementById('id-photo-remove-btn');
  if (removeButton) {
    console.log('削除ボタンを検出しました');
    removeButton.addEventListener('click', function() {
      console.log('削除ボタンがクリックされました');
      removeProfilePhoto();
    });
  } else {
    console.error('削除ボタンが見つかりません');
  }
}

/**
 * ファイル選択時の処理
 * @param {File} file 選択されたファイル
 */
function handleProfilePhotoChange(file) {
  console.log('証明写真ファイル処理開始:', file.name, file.type, `${Math.round(file.size / 1024)}KB`);
  
  // ファイルサイズのチェック（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    showProfilePhotoError('ファイルサイズが大きすぎます（最大5MB）');
    return;
  }

  // ファイル形式のチェック
  if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
    showProfilePhotoError('JPGまたはPNG形式の画像ファイルを選択してください');
    return;
  }

  // ファイルを保存
  currentProfilePhotoFile = file;
  console.log('証明写真を保存しました');

  // プレビュー表示
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewContainer = document.getElementById('id-photo-preview');
    const placeholder = document.getElementById('id-photo-placeholder');
    const previewImage = document.getElementById('id-photo-image');
    const removeButton = document.getElementById('id-photo-remove-btn');

    console.log('プレビュー要素を検出:', 
      previewContainer ? '✓' : '✗', 
      placeholder ? '✓' : '✗', 
      previewImage ? '✓' : '✗', 
      removeButton ? '✓' : '✗'
    );

    if (previewContainer && placeholder && previewImage && removeButton) {
      previewImage.src = e.target.result;
      previewContainer.classList.remove('d-none');
      placeholder.classList.add('d-none');
      removeButton.classList.remove('d-none');
      console.log('プレビューを表示しました');
    } else {
      console.error('プレビュー要素が見つかりません');
    }
  };
  reader.readAsDataURL(file);
}

/**
 * 証明写真用カメラモーダルを表示
 */
function showProfilePhotoCamera() {
  console.log('証明写真カメラモーダルを表示します');
  
  // 既存のモーダルを削除
  const existingModal = document.getElementById('idPhotoModal');
  if (existingModal) {
    existingModal.remove();
    console.log('既存のカメラモーダルを削除しました');
  }

  // カメラモーダル作成
  const modalHtml = `
    <div class="modal fade" id="idPhotoModal" tabindex="-1" aria-labelledby="idPhotoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="idPhotoModalLabel" data-i18n="camera.title">証明写真を撮影</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="id-photo-camera-feedback"></div>
            <div class="text-center mb-3">
              <div class="alert alert-info">カメラを起動しています。カメラへのアクセスを許可してください。</div>
            </div>
            <video id="idPhotoPreview" class="w-100 border rounded" autoplay></video>
            <canvas id="idPhotoCanvas" class="d-none"></canvas>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-i18n="camera.cancel">キャンセル</button>
            <button type="button" class="btn btn-primary" id="idPhotoCaptureButton" data-i18n="camera.capture">
              <i class="bi bi-camera-fill me-1"></i> 撮影する
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  console.log('カメラモーダルを作成しました');

  // モーダルを表示
  try {
    const cameraModal = new bootstrap.Modal(document.getElementById('idPhotoModal'));
    cameraModal.show();
    console.log('カメラモーダルを表示しました');
  } catch (error) {
    console.error('カメラモーダル表示エラー:', error);
  }

  // カメラアクセス開始
  startProfileCamera();

  // 国際化適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

/**
 * 証明写真用カメラを起動
 */
function startProfileCamera() {
  console.log('証明写真用カメラを起動します');
  
  const video = document.getElementById('idPhotoPreview');
  const captureButton = document.getElementById('idPhotoCaptureButton');
  const canvas = document.getElementById('idPhotoCanvas');
  const feedbackDiv = document.querySelector('.id-photo-camera-feedback');
  const infoAlert = document.querySelector('#idPhotoModal .alert-info');
  
  if (!video || !captureButton || !canvas) {
    console.error('必要なカメラ要素が見つかりません', {
      video: !!video,
      captureButton: !!captureButton,
      canvas: !!canvas
    });
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
      console.log('カメラへのアクセスに成功しました');
      video.srcObject = stream;
      
      // 情報アラートを非表示
      if (infoAlert) {
        infoAlert.style.display = 'none';
      }

      // 撮影ボタンのイベント設定
      captureButton.addEventListener('click', function() {
        console.log('撮影ボタンがクリックされました');
        
        try {
          // キャンバスの準備
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          console.log('カメラ画像をキャンバスに描画しました', canvas.width, canvas.height);

          // 画像データをBlobに変換
          canvas.toBlob(function(blob) {
            // ファイル名生成
            const fileName = `id_photo_${Date.now()}.png`;
            console.log('画像ファイルを作成します:', fileName);

            // Fileオブジェクトを作成
            const file = new File([blob], fileName, { type: 'image/png' });

            // 証明写真として設定
            handleProfilePhotoChange(file);

            // モーダルを閉じる
            try {
              const cameraModal = bootstrap.Modal.getInstance(document.getElementById('idPhotoModal'));
              if (cameraModal) {
                cameraModal.hide();
              } else {
                console.error('カメラモーダルのインスタンスが見つかりません');
                const modalElement = document.getElementById('idPhotoModal');
                if (modalElement) {
                  modalElement.classList.remove('show');
                  modalElement.style.display = 'none';
                  document.body.classList.remove('modal-open');
                  const backdrops = document.querySelectorAll('.modal-backdrop');
                  backdrops.forEach(backdrop => backdrop.remove());
                }
              }
            } catch (error) {
              console.error('モーダルを閉じる際にエラーが発生しました:', error);
            }

            // ストリームを停止
            stopProfileCamera();
          }, 'image/png');
        } catch (error) {
          console.error('写真撮影中にエラーが発生しました:', error);
        }
      });
    })
    .catch(error => {
      console.error('カメラアクセスエラー:', error);
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `<div class="alert alert-danger" data-i18n="camera.error">カメラにアクセスできません。デバイスのカメラ設定を確認してください。</div>`;
        if (typeof applyTranslations === 'function') {
          applyTranslations();
        }
      }
      
      // 情報アラートをエラーアラートに変更
      if (infoAlert) {
        infoAlert.className = 'alert alert-danger';
        infoAlert.textContent = 'カメラにアクセスできません。デバイスのカメラ設定を確認してください。';
      }
    });

  // モーダルが閉じられたときにカメラを停止
  const modal = document.getElementById('idPhotoModal');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', stopProfileCamera);
  }
}

/**
 * 証明写真用カメラを停止
 */
function stopProfileCamera() {
  console.log('証明写真用カメラを停止します');
  
  const video = document.getElementById('idPhotoPreview');
  if (video && video.srcObject) {
    try {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
      console.log('カメラを正常に停止しました');
    } catch (error) {
      console.error('カメラ停止中にエラーが発生しました:', error);
    }
  } else {
    console.log('停止するカメラがありません');
  }
}

/**
 * 証明写真を削除
 */
function removeProfilePhoto() {
  console.log('証明写真を削除します');
  
  // ファイルをクリア
  currentProfilePhotoFile = null;
  const fileInput = document.getElementById('id-photo-input');
  if (fileInput) {
    fileInput.value = '';
    console.log('ファイル入力フィールドをクリアしました');
  } else {
    console.error('ファイル入力フィールドが見つかりません');
  }

  // UI更新
  const previewContainer = document.getElementById('id-photo-preview');
  const placeholder = document.getElementById('id-photo-placeholder');
  const removeButton = document.getElementById('id-photo-remove-btn');

  console.log('証明写真UI要素を検出:', 
    previewContainer ? '✓' : '✗', 
    placeholder ? '✓' : '✗', 
    removeButton ? '✓' : '✗'
  );

  if (previewContainer && placeholder && removeButton) {
    previewContainer.classList.add('d-none');
    placeholder.classList.remove('d-none');
    removeButton.classList.add('d-none');
    console.log('証明写真のUI状態を更新しました');
  } else {
    console.error('証明写真のUI要素が見つかりません');
  }
}

/**
 * エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showProfilePhotoError(message) {
  console.error('証明写真エラー:', message);
  
  // エラー表示用の要素がなければ作成
  let errorElement = document.getElementById('id-photo-error');
  if (!errorElement) {
    const idPhotoSection = document.getElementById('id-photo-section');
    if (!idPhotoSection) {
      console.error('証明写真セクションが見つかりません');
      return;
    }

    errorElement = document.createElement('div');
    errorElement.id = 'id-photo-error';
    errorElement.className = 'alert alert-danger mt-2';
    idPhotoSection.appendChild(errorElement);
    console.log('エラー表示要素を作成しました');
  }

  // エラーメッセージを表示
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');
  console.log('エラーメッセージを表示しました:', message);

  // 3秒後に非表示
  setTimeout(() => {
    errorElement.classList.add('d-none');
    console.log('エラーメッセージを非表示にしました');
  }, 3000);
}

/**
 * 証明写真のFileオブジェクトを取得（他スクリプトから利用）
 * @returns {File|null} 証明写真のFileオブジェクト
 */
function getProfilePhotoFile() {
  return currentProfilePhotoFile;
}

// グローバルに公開
window.profilePhotoHandler = {
  getProfilePhotoFile: getProfilePhotoFile
};