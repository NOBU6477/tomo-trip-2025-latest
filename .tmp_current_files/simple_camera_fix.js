/**
 * シンプルな修正アプローチ - 標準セレクタのみを使用
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('シンプルカメラ修正を初期化しています');
  
  // グローバル変数
  let mediaStream = null;
  let currentFileInput = null;
  
  // カメラ関連の初期化
  function init() {
    setupCameraButtonListener();
    setupFileChangeListener();
    setupRemoveButtonListener();
    setupDriverLicenseListener();
  }
  
  // カメラボタンのクリックリスナー設定
  function setupCameraButtonListener() {
    // クリックイベントの委任を使用
    document.addEventListener('click', function(e) {
      // ボタン要素を見つける
      const button = e.target.closest('button');
      if (!button) return;
      
      // カメラボタンかどうかを判断
      if (isCameraButton(button)) {
        e.preventDefault();
        console.log('カメラボタンがクリックされました:', button.textContent);
        
        // 関連するファイル入力を探す
        const fileInput = findAssociatedFileInput(button);
        if (fileInput) {
          openCamera(fileInput, button);
        } else {
          console.error('関連するファイル入力が見つかりません');
        }
      }
    });
  }
  
  // カメラボタンかどうかを判断
  function isCameraButton(button) {
    if (!button) return false;
    
    // クラスで判断
    if (button.classList.contains('camera-btn')) return true;
    
    // IDで判断
    if (button.id && (button.id.includes('camera') || button.id.includes('Camera'))) return true;
    
    // テキスト内容で判断
    const buttonText = button.textContent.trim().toLowerCase();
    if (buttonText.includes('カメラ') || buttonText.includes('撮影')) return true;
    
    // 内部にカメラアイコンがあるかで判断
    if (button.querySelector('.bi-camera, .fa-camera')) return true;
    
    // data属性で判断
    if (button.dataset.role === 'camera') return true;
    
    return false;
  }
  
  // ボタンに関連するファイル入力を見つける
  function findAssociatedFileInput(button) {
    // ボタンの親要素を検索
    const container = button.closest('.form-group, .mb-3, .document-upload-section, .card');
    if (container) {
      // コンテナ内のファイル入力を検索
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    // ボタンのIDからファイル入力のIDを推測
    if (button.id) {
      const baseId = button.id.replace('-camera-btn', '').replace('-camera', '').replace('-btn', '');
      const potentialIds = [
        baseId + '-input',
        baseId + '_input',
        baseId + 'Input',
        baseId
      ];
      
      for (const id of potentialIds) {
        const input = document.getElementById(id);
        if (input && input.type === 'file') return input;
      }
    }
    
    // ボタンの近くの要素から探す
    let current = button.parentElement;
    let depth = 0;
    while (current && depth < 5) {
      const fileInput = current.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
      
      current = current.parentElement;
      depth++;
    }
    
    // ボタンコンテキスト（テキスト内容）からファイル入力を推測
    const buttonText = button.textContent.trim().toLowerCase();
    if (buttonText.includes('運転免許証')) {
      if (buttonText.includes('裏面')) {
        const licenseBack = document.getElementById('license-back-input') || 
                           document.querySelector('input[id*="license"][id*="back"]');
        if (licenseBack) return licenseBack;
      } else {
        const licenseFront = document.getElementById('license-front-input') || 
                            document.querySelector('input[id*="license"][id*="front"]');
        if (licenseFront) return licenseFront;
      }
    } else if (buttonText.includes('パスポート')) {
      const passport = document.getElementById('passport-input') || 
                      document.querySelector('input[id*="passport"]');
      if (passport) return passport;
    } else if (buttonText.includes('証明写真')) {
      const photo = document.getElementById('id-photo-input') || 
                   document.querySelector('input[id*="photo"]');
      if (photo) return photo;
    }
    
    // フォーム内の最初のファイル入力を返す
    const form = button.closest('form');
    if (form) {
      const fileInput = form.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    // 最後の手段：ページ内の最初のファイル入力
    return document.querySelector('input[type="file"]');
  }
  
  // カメラを開く
  function openCamera(fileInput, sourceButton) {
    currentFileInput = fileInput;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('camera-modal');
    if (existingModal) {
      const bsModal = bootstrap.Modal.getInstance(existingModal);
      if (bsModal) bsModal.hide();
      existingModal.remove();
    }
    
    // モーダルタイトルを決定
    let title = 'カメラで撮影';
    let isIdPhoto = false;
    
    // ファイル入力のIDや親要素から文脈を取得
    if (fileInput.id) {
      if (fileInput.id.includes('license')) {
        if (fileInput.id.includes('back')) {
          title = '運転免許証(裏面)を撮影';
        } else {
          title = '運転免許証(表面)を撮影';
        }
      } else if (fileInput.id.includes('passport')) {
        title = 'パスポートを撮影';
      } else if (fileInput.id.includes('photo')) {
        title = '証明写真を撮影';
        isIdPhoto = true;
      }
    }
    
    // ボタンの内容からタイトルを推測
    if (sourceButton) {
      const buttonText = sourceButton.textContent.trim().toLowerCase();
      if (buttonText.includes('運転免許証')) {
        if (buttonText.includes('裏面')) {
          title = '運転免許証(裏面)を撮影';
        } else {
          title = '運転免許証(表面)を撮影';
        }
      } else if (buttonText.includes('パスポート')) {
        title = 'パスポートを撮影';
      } else if (buttonText.includes('証明写真')) {
        title = '証明写真を撮影';
        isIdPhoto = true;
      }
    }
    
    // カメラモーダルを作成
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'camera-modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title"><i class="bi bi-camera me-2"></i>${title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div class="camera-container bg-dark">
              <video id="camera-video" autoplay playsinline class="w-100 h-100 d-block"></video>
              <canvas id="camera-canvas" class="d-none"></canvas>
              
              <div id="camera-guide" class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <div class="camera-frame">
                  <div class="guide-text">
                    ${isIdPhoto ? 'あなたの顔がフレーム内に収まるようにしてください' : '書類全体がフレーム内に収まるようにしてください'}
                  </div>
                </div>
              </div>
              
              <div id="camera-controls" class="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center bg-black bg-opacity-50">
                <button id="switch-camera-btn" class="btn btn-light rounded-circle" type="button">
                  <i class="bi bi-arrow-repeat"></i>
                </button>
                <button id="capture-btn" class="btn btn-light rounded-circle capture-button" type="button">
                  <span class="capture-circle"></span>
                </button>
                <button id="camera-cancel-btn" class="btn btn-light rounded-circle" data-bs-dismiss="modal" type="button">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
              
              <div id="preview-container" class="position-absolute top-0 start-0 w-100 h-100 bg-dark d-none">
                <img id="preview-image" class="w-100 h-100 object-fit-contain" src="" alt="撮影画像">
              </div>
            </div>
          </div>
          <div class="modal-footer d-none" id="preview-footer">
            <button type="button" class="btn btn-secondary" id="retake-btn">
              <i class="bi bi-arrow-counterclockwise me-1"></i>撮り直す
            </button>
            <button type="button" class="btn btn-primary" id="use-photo-btn">
              <i class="bi bi-check-lg me-1"></i>この写真を使用
            </button>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.appendChild(modal);
    
    // カメラスタイルを追加
    addCameraStyles();
    
    // Bootstrapモーダルを初期化
    const bsModal = new bootstrap.Modal(modal);
    
    // モーダルイベントのセットアップ
    modal.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // モーダルを表示
    bsModal.show();
    
    // カメラを起動
    function startCamera() {
      const video = document.getElementById('camera-video');
      if (!video) return;
      
      // カメラ設定
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      // カメラを要求
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          mediaStream = stream;
          video.srcObject = stream;
          
          // カメラ切り替えボタンのイベント
          const switchBtn = document.getElementById('switch-camera-btn');
          if (switchBtn) {
            switchBtn.addEventListener('click', function() {
              const currentFacingMode = constraints.video.facingMode;
              constraints.video.facingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
              
              // 現在のストリームを停止
              if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
              }
              
              // 新しい設定でカメラを再起動
              navigator.mediaDevices.getUserMedia(constraints)
                .then(function(newStream) {
                  mediaStream = newStream;
                  video.srcObject = newStream;
                })
                .catch(function(err) {
                  console.error('カメラ切り替えエラー:', err);
                });
            });
          }
          
          // 撮影ボタンのイベント
          const captureBtn = document.getElementById('capture-btn');
          if (captureBtn) {
            captureBtn.addEventListener('click', function() {
              capturePhoto();
            });
          }
        })
        .catch(function(err) {
          console.error('カメラ起動エラー:', err);
          showCameraError();
        });
    }
    
    // カメラエラー表示
    function showCameraError() {
      const container = document.querySelector('.camera-container');
      if (!container) return;
      
      container.innerHTML = `
        <div class="p-4 text-center">
          <div class="alert alert-warning mb-3">
            <h5><i class="bi bi-exclamation-triangle me-2"></i>カメラにアクセスできません</h5>
            <p>以下の理由が考えられます：</p>
            <ul class="text-start small">
              <li>ブラウザの設定でカメラへのアクセスが許可されていません</li>
              <li>デバイスにカメラが接続されていません</li>
              <li>他のアプリがカメラを使用中です</li>
            </ul>
          </div>
          <button class="btn btn-primary" data-bs-dismiss="modal">
            <i class="bi bi-x me-1"></i>閉じる
          </button>
        </div>
      `;
    }
    
    // 写真を撮影
    function capturePhoto() {
      const video = document.getElementById('camera-video');
      const canvas = document.getElementById('camera-canvas');
      const previewContainer = document.getElementById('preview-container');
      const previewImage = document.getElementById('preview-image');
      const cameraGuide = document.getElementById('camera-guide');
      const cameraControls = document.getElementById('camera-controls');
      const previewFooter = document.getElementById('preview-footer');
      
      if (!video || !canvas || !previewContainer || !previewImage) return;
      
      // キャンバスのサイズを設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 映像をキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像を表示
      previewImage.src = canvas.toDataURL('image/jpeg');
      
      // UIを切り替え
      previewContainer.classList.remove('d-none');
      if (cameraGuide) cameraGuide.classList.add('d-none');
      if (cameraControls) cameraControls.classList.add('d-none');
      if (previewFooter) previewFooter.classList.remove('d-none');
      
      // 撮り直しボタンのイベント
      const retakeBtn = document.getElementById('retake-btn');
      if (retakeBtn) {
        retakeBtn.onclick = function() {
          previewContainer.classList.add('d-none');
          if (cameraGuide) cameraGuide.classList.remove('d-none');
          if (cameraControls) cameraControls.classList.remove('d-none');
          if (previewFooter) previewFooter.classList.add('d-none');
        };
      }
      
      // 写真を使用ボタンのイベント
      const usePhotoBtn = document.getElementById('use-photo-btn');
      if (usePhotoBtn) {
        usePhotoBtn.onclick = function() {
          usePhoto(previewImage.src);
        };
      }
    }
    
    // 写真を使用
    function usePhoto(dataURL) {
      if (!currentFileInput) return;
      
      // ファイルをBlobに変換
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          // ファイル名を生成
          const filename = `photo_${Date.now()}.jpg`;
          const file = new File([blob], filename, { type: 'image/jpeg' });
          
          // DataTransferオブジェクトを使用
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          
          // ファイル入力を更新
          currentFileInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          currentFileInput.dispatchEvent(event);
          
          // モーダルを閉じる
          const modal = bootstrap.Modal.getInstance(document.getElementById('camera-modal'));
          if (modal) modal.hide();
        });
    }
  }
  
  // カメラを停止
  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  // ファイル入力の変更リスナー
  function setupFileChangeListener() {
    document.addEventListener('change', function(e) {
      if (e.target.tagName === 'INPUT' && e.target.type === 'file') {
        handleFileChange(e.target);
      }
    });
  }
  
  // ファイル変更を処理
  function handleFileChange(fileInput) {
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // アップロード成功後の処理
      updatePreview(fileInput, e.target.result);
    };
    
    reader.readAsDataURL(file);
  }
  
  // プレビューを更新
  function updatePreview(fileInput, dataURL) {
    // ファイル入力の親要素を探す
    const container = fileInput.closest('.form-group, .mb-3, .document-upload-section, .card');
    if (!container) return;
    
    // プレビュー要素を探す
    let previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview-img');
    
    // プレビュー要素がない場合は作成
    if (!previewImg) {
      // プレビューコンテナを探す
      let previewContainer = container.querySelector('.preview-container, .document-preview-container');
      
      // コンテナがない場合は作成
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-2';
        container.appendChild(previewContainer);
      }
      
      // プレビュー画像を作成
      previewImg = document.createElement('img');
      previewImg.className = 'preview-img img-fluid mt-2';
      previewImg.alt = 'プレビュー';
      previewImg.style.maxHeight = '200px';
      previewContainer.appendChild(previewImg);
    }
    
    // 画像を設定
    previewImg.src = dataURL;
    previewImg.classList.remove('d-none');
    
    // プレースホルダを非表示
    const placeholder = container.querySelector('.placeholder, .upload-placeholder, .document-prompt');
    if (placeholder) {
      placeholder.classList.add('d-none');
    }
    
    // 削除ボタンを表示・作成
    let removeBtn = container.querySelector('.remove-btn, .delete-btn, button[id*="remove"], button[id*="delete"]');
    
    // 削除ボタンがない場合は作成
    if (!removeBtn) {
      removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-sm mt-2 remove-btn';
      removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>削除';
      container.appendChild(removeBtn);
    }
    
    removeBtn.classList.remove('d-none');
    
    // 成功メッセージを表示
    const existingSuccess = container.querySelector('.alert-success, .upload-success');
    if (existingSuccess) {
      existingSuccess.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-2 small';
    successMessage.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
    container.appendChild(successMessage);
  }
  
  // 削除ボタンのリスナー
  function setupRemoveButtonListener() {
    document.addEventListener('click', function(e) {
      // 削除ボタンかどうかを判断
      const button = e.target.closest('button');
      if (!button) return;
      
      if (isRemoveButton(button)) {
        e.preventDefault();
        
        // 関連するファイル入力を探す
        const container = button.closest('.form-group, .mb-3, .document-upload-section, .card');
        if (!container) return;
        
        const fileInput = container.querySelector('input[type="file"]');
        if (!fileInput) return;
        
        // ファイル入力をリセット
        fileInput.value = '';
        
        // プレビュー要素を非表示
        const previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview-img');
        if (previewImg) {
          previewImg.src = '';
          previewImg.classList.add('d-none');
        }
        
        // プレースホルダを表示
        const placeholder = container.querySelector('.placeholder, .upload-placeholder, .document-prompt');
        if (placeholder) {
          placeholder.classList.remove('d-none');
        }
        
        // 削除ボタンを非表示
        button.classList.add('d-none');
        
        // 成功メッセージを削除
        const successMessage = container.querySelector('.alert-success, .upload-success');
        if (successMessage) {
          successMessage.remove();
        }
      }
    });
  }
  
  // 削除ボタンかどうかを判断
  function isRemoveButton(button) {
    if (!button) return false;
    
    // クラスで判断
    if (button.classList.contains('remove-btn') || button.classList.contains('delete-btn')) return true;
    
    // IDで判断
    if (button.id && (button.id.includes('remove') || button.id.includes('delete'))) return true;
    
    // テキスト内容で判断
    const buttonText = button.textContent.trim().toLowerCase();
    if (buttonText.includes('削除') || buttonText.includes('クリア') || buttonText.includes('消去')) return true;
    
    // 内部にゴミ箱アイコンがあるかで判断
    if (button.querySelector('.bi-trash, .fa-trash')) return true;
    
    return false;
  }
  
  // 運転免許証選択時のリスナー
  function setupDriverLicenseListener() {
    document.addEventListener('change', function(e) {
      // セレクト要素かどうか
      if (e.target.tagName === 'SELECT') {
        checkForDriverLicense(e.target);
      }
    });
    
    // 既存のセレクト要素を確認
    document.querySelectorAll('select').forEach(function(select) {
      checkForDriverLicense(select);
    });
  }
  
  // 運転免許証選択時の処理
  function checkForDriverLicense(select) {
    const value = select.value.toLowerCase();
    
    // 運転免許証が選択されているか
    if (value === '運転免許証' || value.includes('license') || value.includes('driver')) {
      // セクションを探す
      const container = select.closest('form, .card, .document-section');
      if (!container) return;
      
      // 既に裏面セクションがあるか確認
      const existingBackSection = container.querySelector('[id*="back"], [id*="dual"], .dual-photo-section');
      if (existingBackSection) return;
      
      // 表面のセクションを探す
      const frontSection = container.querySelector('.document-upload-section, .form-group, .mb-3');
      if (!frontSection) return;
      
      // 裏面セクションを作成
      const backSection = frontSection.cloneNode(true);
      
      // 裏面セクションを更新
      const backInputs = backSection.querySelectorAll('input');
      backInputs.forEach(function(input) {
        if (input.id) {
          input.id = input.id.replace('front', 'back');
        }
        if (input.name) {
          input.name = input.name.replace('front', 'back');
        }
        if (input.type === 'file') {
          input.value = '';
        }
      });
      
      // テキストを更新
      const labels = backSection.querySelectorAll('label, p, span');
      labels.forEach(function(element) {
        element.textContent = element.textContent.replace('表面', '裏面');
      });
      
      // 画像プレビューをリセット
      const previewImgs = backSection.querySelectorAll('img');
      previewImgs.forEach(function(img) {
        img.src = '';
        img.classList.add('d-none');
        if (img.id) {
          img.id = img.id.replace('front', 'back');
        }
      });
      
      // 裏面セクションを追加
      const parent = frontSection.parentNode;
      
      // 表面と裏面の間に説明を追加
      const dualPhotoText = document.createElement('div');
      dualPhotoText.className = 'alert alert-light mt-3 text-center';
      dualPhotoText.textContent = '運転免許証は表面と裏面の両方をアップロードしてください';
      
      // DOMに挿入
      parent.insertBefore(dualPhotoText, frontSection.nextSibling);
      parent.insertBefore(backSection, dualPhotoText.nextSibling);
    }
  }
  
  // カメラスタイルを追加
  function addCameraStyles() {
    // 既存のスタイルがあれば何もしない
    if (document.getElementById('camera-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'camera-styles';
    
    style.textContent = `
      .camera-container {
        position: relative;
        overflow: hidden;
        min-height: 300px;
        max-height: 70vh;
      }
      
      #camera-video {
        width: 100%;
        max-height: 70vh;
        min-height: 300px;
        object-fit: cover;
      }
      
      .camera-frame {
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        width: 85%;
        height: 70%;
        position: relative;
      }
      
      .guide-text {
        position: absolute;
        bottom: -40px;
        left: 0;
        right: 0;
        text-align: center;
        color: white;
        text-shadow: 0 0 2px #000;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 20px;
      }
      
      .capture-button {
        width: 70px;
        height: 70px;
        border: 3px solid white;
        position: relative;
      }
      
      .capture-circle {
        width: 54px;
        height: 54px;
        background-color: white;
        border-radius: 50%;
        display: block;
      }
      
      #switch-camera-btn, #camera-cancel-btn {
        width: 50px;
        height: 50px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #switch-camera-btn i, #camera-cancel-btn i {
        font-size: 1.5rem;
      }
      
      .modal-header.bg-primary {
        background-color: #0d6efd;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // 初期化実行
  init();
});