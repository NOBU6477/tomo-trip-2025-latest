/**
 * 観光客登録用証明写真アップロード機能を提供するスクリプト
 * カメラでの撮影機能、プレビュー機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {
  setupTouristPhotoUpload();
});

// 証明写真の現在のFileオブジェクト
let currentTouristPhotoFile = null;

/**
 * 観光客証明写真アップロード機能を設定
 */
function setupTouristPhotoUpload() {
  console.log('観光客証明写真アップロード機能を設定します');
  
  // 観光客登録モーダルの表示を検知して設定
  const registerTouristModal = document.getElementById('registerTouristModal');
  if (registerTouristModal) {
    console.log('観光客登録モーダルを検出しました');
    registerTouristModal.addEventListener('shown.bs.modal', () => {
      console.log('観光客登録モーダルが表示されました - 証明写真セクションを初期化します');
      initTouristPhotoSection();
    });
  }

  // 既に表示されている場合にも対応
  if (registerTouristModal && window.getComputedStyle(registerTouristModal).display !== 'none') {
    console.log('モーダルが既に表示されています - 証明写真セクションを初期化します');
    initTouristPhotoSection();
  }
  
  // 直接ボタンを設定する（モーダルによらず）
  setupTouristPhotoListeners();
}

/**
 * 観光客証明写真セクションの初期化
 */
function initTouristPhotoSection() {
  console.log('観光客証明写真セクションを初期化します');
  
  // イベントリスナーを設定
  setupTouristPhotoListeners();
  
  // 国際化があれば適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

/**
 * 観光客証明写真関連のイベントリスナーを設定
 */
function setupTouristPhotoListeners() {
  console.log('観光客証明写真のイベントリスナーを設定します');
  
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
        handleTouristPhotoChange(this.files[0]);
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
      showTouristPhotoCamera();
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
      removeTouristPhoto();
    });
  } else {
    console.error('削除ボタンが見つかりません');
  }
}

/**
 * ファイル選択時の処理
 * @param {File} file 選択されたファイル
 */
function handleTouristPhotoChange(file) {
  console.log('観光客証明写真ファイル処理開始:', file.name, file.type, `${Math.round(file.size / 1024)}KB`);
  
  // ファイルサイズのチェック（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    showTouristPhotoError('ファイルサイズが大きすぎます（最大5MB）');
    return;
  }

  // ファイル形式のチェック
  if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/gif')) {
    showTouristPhotoError('JPGまたはPNG形式の画像ファイルを選択してください');
    return;
  }

  // ファイルを保存
  currentTouristPhotoFile = file;
  console.log('観光客証明写真を保存しました');

  // ファイル入力の値を更新
  const fileInput = document.getElementById('id-photo-input');
  if (fileInput) {
    try {
      // DataTransferオブジェクトを使用してファイル入力を更新
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    } catch (error) {
      console.error('ファイル入力の更新に失敗しました:', error);
    }
  }

  // プレビュー表示
  updateTouristPhotoPreview(file);
}

/**
 * 観光客証明写真のプレビュー表示を更新
 * @param {File} file 画像ファイル
 */
function updateTouristPhotoPreview(file) {
  if (!file) return;
  
  // プレビュー要素を取得
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
  
  if (!previewContainer || !placeholder || !previewImage) {
    console.error('必要なプレビュー要素が見つかりません');
    return;
  }
  
  // FileReaderでファイルを読み込み
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      // プレビュー画像を設定
      previewImage.src = e.target.result;
      
      // UI表示状態を更新
      previewContainer.classList.remove('d-none');
      placeholder.classList.add('d-none');
      
      // 削除ボタンを表示
      if (removeButton) {
        removeButton.classList.remove('d-none');
      }
      
      console.log('プレビューを表示しました');
      
    } catch (error) {
      console.error('プレビュー表示中にエラーが発生しました:', error);
    }
  };
  
  reader.onerror = function(error) {
    console.error('ファイル読み込みエラー:', error);
    showTouristPhotoError('ファイルの読み込みに失敗しました。別のファイルをお試しください。');
  };
  
  // ファイルを読み込み
  reader.readAsDataURL(file);
}

/**
 * 観光客証明写真用カメラモーダルを表示
 */
function showTouristPhotoCamera() {
  console.log('観光客証明写真カメラモーダルを表示します');
  
  // 既存のモーダルを削除
  const existingModal = document.getElementById('touristPhotoModal');
  if (existingModal) {
    existingModal.remove();
    console.log('既存のカメラモーダルを削除しました');
  }

  // カメラモーダル作成
  const modalHtml = `
    <div class="modal fade" id="touristPhotoModal" tabindex="-1" aria-labelledby="touristPhotoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="touristPhotoModalLabel" data-i18n="camera.title">証明写真を撮影</h5>
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-i18n="camera.cancel">キャンセル</button>
            <button type="button" class="btn btn-primary" id="touristPhotoCaptureButton" data-i18n="camera.capture">
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
    const cameraModal = new bootstrap.Modal(document.getElementById('touristPhotoModal'));
    cameraModal.show();
    console.log('カメラモーダルを表示しました');
  } catch (error) {
    console.error('カメラモーダル表示エラー:', error);
  }

  // カメラアクセス開始
  startTouristCamera();

  // 国際化適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

/**
 * 観光客証明写真用カメラを起動
 */
function startTouristCamera() {
  console.log('観光客証明写真用カメラを起動します');
  
  const video = document.getElementById('touristPhotoPreview');
  const captureButton = document.getElementById('touristPhotoCaptureButton');
  const canvas = document.getElementById('touristPhotoCanvas');
  const feedbackDiv = document.querySelector('.tourist-photo-camera-feedback');
  const infoAlert = document.querySelector('#touristPhotoModal .alert-info');
  
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
            const fileName = `tourist_photo_${Date.now()}.png`;
            console.log('画像ファイルを作成します:', fileName);

            // Fileオブジェクトを作成
            const file = new File([blob], fileName, { type: 'image/png' });

            // 証明写真として設定
            handleTouristPhotoChange(file);

            // モーダルを閉じる
            try {
              const cameraModal = bootstrap.Modal.getInstance(document.getElementById('touristPhotoModal'));
              if (cameraModal) {
                cameraModal.hide();
              } else {
                console.error('カメラモーダルのインスタンスが見つかりません');
                const modalElement = document.getElementById('touristPhotoModal');
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
            stopTouristCamera();
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
  const modal = document.getElementById('touristPhotoModal');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', stopTouristCamera);
  }
}

/**
 * 観光客証明写真用カメラを停止
 */
function stopTouristCamera() {
  console.log('観光客証明写真用カメラを停止します');
  
  const video = document.getElementById('touristPhotoPreview');
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
 * 観光客証明写真を削除
 */
function removeTouristPhoto() {
  console.log('観光客証明写真を削除します');
  
  // ファイルをクリア
  currentTouristPhotoFile = null;
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

  console.log('観光客証明写真UI要素を検出:', 
    previewContainer ? '✓' : '✗', 
    placeholder ? '✓' : '✗', 
    removeButton ? '✓' : '✗'
  );

  if (previewContainer && placeholder && removeButton) {
    previewContainer.classList.add('d-none');
    placeholder.classList.remove('d-none');
    removeButton.classList.add('d-none');
    console.log('観光客証明写真のUI状態を更新しました');
  } else {
    console.error('観光客証明写真のUI要素が見つかりません');
  }
}

/**
 * エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showTouristPhotoError(message) {
  console.error('観光客証明写真エラー:', message);
  
  // エラー表示用の要素がなければ作成
  let errorElement = document.getElementById('tourist-photo-error');
  if (!errorElement) {
    const photoSection = document.querySelector('#registerTouristModal .border-bottom:nth-child(2)');
    if (!photoSection) {
      console.error('観光客証明写真セクションが見つかりません');
      return;
    }

    errorElement = document.createElement('div');
    errorElement.id = 'tourist-photo-error';
    errorElement.className = 'alert alert-danger mt-2';
    photoSection.appendChild(errorElement);
    console.log('エラー表示要素を作成しました');
  }

  // エラーメッセージを設定
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');

  // 3秒後にエラーメッセージを非表示
  setTimeout(() => {
    errorElement.classList.add('d-none');
  }, 3000);
}

/**
 * 観光客証明写真ファイルを取得する（他のJSで使用）
 * @returns {File|null} 観光客証明写真のFileオブジェクト
 */
function getTouristPhotoFile() {
  return currentTouristPhotoFile;
}