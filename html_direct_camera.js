/**
 * HTML直接操作による超簡易カメラ実装
 * 元のHTMLの「カメラで撮影」リンクを直接監視して機能させる
 */

// ページロード完了時に実行
window.addEventListener('load', function() {
  console.log('[HTML直接カメラ] 初期化中...');
  
  // 最初の実行
  setTimeout(addCameraFunctionality, 500);
  
  // 定期的に実行して確実に適用
  setInterval(addCameraFunctionality, 2000);
});

// カメラ機能を追加
function addCameraFunctionality() {
  console.log('[HTML直接カメラ] カメラ機能を追加します');
  
  // 「カメラで撮影」リンクを探す
  var cameraLinks = [];
  
  // テキスト「カメラで撮影」を含む要素を探す
  document.querySelectorAll('*').forEach(function(el) {
    if (el.textContent && el.textContent.includes('カメラで撮影')) {
      // クリック可能な要素かどうかをチェック
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || 
          el.classList.contains('btn') || el.getAttribute('role') === 'button') {
        cameraLinks.push(el);
      } else {
        // 内部のクリック可能な要素をチェック
        el.querySelectorAll('a, button, .btn, [role="button"]').forEach(function(child) {
          cameraLinks.push(child);
        });
      }
    }
  });
  
  console.log('[HTML直接カメラ] 検出したカメラリンク数: ' + cameraLinks.length);
  
  // 全てのカメラリンクにイベントハンドラを設定
  cameraLinks.forEach(function(link, index) {
    console.log('[HTML直接カメラ] リンク ' + index + ': ' + link.outerHTML.substring(0, 50));
    
    // 既存のイベントリスナーを削除するためにクローン
    var clone = link.cloneNode(true);
    if (link.parentNode) {
      link.parentNode.replaceChild(clone, link);
      
      // クリックイベントを追加
      clone.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[HTML直接カメラ] カメラリンクがクリックされました:', this.textContent);
        
        // ファイル入力を探す
        var fileInput = findRelatedFileInput(this);
        if (fileInput) {
          openCameraModal(fileInput);
        } else {
          console.error('[HTML直接カメラ] 関連するファイル入力が見つかりません');
        }
        
        return false;
      });
    }
  });
  
  // Bootstrap機能が利用可能かチェック
  if (typeof bootstrap === 'undefined') {
    loadBootstrapJS();
  }
}

// 関連するファイル入力を見つける
function findRelatedFileInput(element) {
  console.log('[HTML直接カメラ] 関連ファイル入力を探します');
  
  // まず要素の周囲を探す
  var container = findParentContainer(element);
  if (container) {
    var fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      console.log('[HTML直接カメラ] コンテナ内でファイル入力を見つけました:', fileInput.id);
      return fileInput;
    }
  }
  
  // 要素の親を辿る
  var current = element.parentElement;
  var depth = 0;
  while (current && depth < 5) {
    var fileInput = current.querySelector('input[type="file"]');
    if (fileInput) {
      console.log('[HTML直接カメラ] 親要素内でファイル入力を見つけました:', fileInput.id);
      return fileInput;
    }
    current = current.parentElement;
    depth++;
  }
  
  // リンクテキストから推測
  var linkText = element.textContent.toLowerCase();
  if (linkText.includes('運転免許証')) {
    if (linkText.includes('裏')) {
      var backLicense = document.querySelector('input[id*="license"][id*="back"]');
      if (backLicense) return backLicense;
    } else {
      var frontLicense = document.querySelector('input[id*="license"][id*="front"]');
      if (frontLicense) return frontLicense;
    }
    // 一般的な免許証
    var license = document.querySelector('input[id*="license"]');
    if (license) return license;
  }
  
  if (linkText.includes('パスポート')) {
    var passport = document.querySelector('input[id*="passport"]');
    if (passport) return passport;
  }
  
  // 最初のファイル入力を返す
  return document.querySelector('input[type="file"]');
}

// 親コンテナを見つける
function findParentContainer(element) {
  return element.closest('.form-group, .mb-3, .document-upload-section, .card');
}

// カメラモーダルを開く
var mediaStream = null;

function openCameraModal(fileInput) {
  console.log('[HTML直接カメラ] カメラモーダルを開きます');
  
  // 既存のモーダルを削除
  var existingModal = document.getElementById('html-camera-modal');
  if (existingModal) {
    var bsModal = bootstrap.Modal.getInstance(existingModal);
    if (bsModal) bsModal.hide();
    existingModal.remove();
  }
  
  // スタイルを追加
  addCameraStyles();
  
  // モーダルタイトルを決定
  var title = 'カメラで撮影';
  var guideText = '書類全体がフレーム内に収まるようにしてください';
  
  // モーダル要素を作成
  var modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'html-camera-modal';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('aria-hidden', 'true');
  
  // モーダルHTML
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title"><i class="bi bi-camera me-2"></i>${title}</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
          <div class="camera-container bg-dark">
            <video id="camera-video" autoplay playsinline class="w-100"></video>
            <canvas id="camera-canvas" class="d-none"></canvas>
            
            <div id="camera-guide" class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
              <div class="guide-frame">
                <div class="guide-text">${guideText}</div>
              </div>
            </div>
            
            <div id="camera-controls" class="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center camera-controls-bg">
              <button id="switch-camera-btn" class="btn btn-light rounded-circle" type="button">
                <i class="bi bi-arrow-repeat"></i>
              </button>
              <button id="capture-btn" class="btn btn-light rounded-circle capture-button" type="button">
                <span class="capture-circle"></span>
              </button>
              <button id="close-camera-btn" class="btn btn-light rounded-circle" data-bs-dismiss="modal" type="button">
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
  
  // Bootstrapモーダルを初期化
  var bsModal = new bootstrap.Modal(document.getElementById('html-camera-modal'));
  
  // モーダルイベント設定
  modal.addEventListener('shown.bs.modal', function() {
    startCamera(fileInput);
  });
  
  modal.addEventListener('hidden.bs.modal', function() {
    stopCamera();
  });
  
  // モーダルを表示
  bsModal.show();
}

// カメラを起動
function startCamera(fileInput) {
  console.log('[HTML直接カメラ] カメラを起動します');
  
  var video = document.getElementById('camera-video');
  var captureBtn = document.getElementById('capture-btn');
  var switchBtn = document.getElementById('switch-camera-btn');
  
  if (!video) {
    console.error('[HTML直接カメラ] ビデオ要素が見つかりません');
    return;
  }
  
  // カメラ設定
  var constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };
  
  // カメラアクセス
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      console.log('[HTML直接カメラ] カメラストリームを取得しました');
      mediaStream = stream;
      video.srcObject = stream;
      
      // カメラ切り替えボタン
      if (switchBtn) {
        switchBtn.addEventListener('click', function() {
          console.log('[HTML直接カメラ] カメラ切り替え');
          var currentFacingMode = constraints.video.facingMode;
          constraints.video.facingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
          
          if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
          }
          
          navigator.mediaDevices.getUserMedia(constraints)
            .then(function(newStream) {
              mediaStream = newStream;
              video.srcObject = newStream;
            })
            .catch(function(err) {
              console.error('[HTML直接カメラ] カメラ切り替えエラー:', err);
            });
        });
      }
      
      // 撮影ボタン
      if (captureBtn) {
        captureBtn.addEventListener('click', function() {
          console.log('[HTML直接カメラ] 撮影ボタンクリック');
          capturePhoto(fileInput);
        });
      }
    })
    .catch(function(err) {
      console.error('[HTML直接カメラ] カメラエラー:', err);
      showCameraError();
    });
}

// カメラを停止
function stopCamera() {
  console.log('[HTML直接カメラ] カメラを停止します');
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
}

// 写真を撮影
function capturePhoto(fileInput) {
  console.log('[HTML直接カメラ] 写真を撮影します');
  
  var video = document.getElementById('camera-video');
  var canvas = document.getElementById('camera-canvas');
  var previewContainer = document.getElementById('preview-container');
  var previewImage = document.getElementById('preview-image');
  var cameraGuide = document.getElementById('camera-guide');
  var cameraControls = document.getElementById('camera-controls');
  var previewFooter = document.getElementById('preview-footer');
  
  if (!video || !canvas || !previewContainer || !previewImage) {
    console.error('[HTML直接カメラ] 必要な要素が見つかりません');
    return;
  }
  
  // キャンバスサイズ設定
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  
  // 映像をキャンバスに描画
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // 画像データを取得
  var imageData = canvas.toDataURL('image/jpeg');
  
  // プレビュー表示
  previewImage.src = imageData;
  
  // UI切り替え
  previewContainer.classList.remove('d-none');
  if (cameraGuide) cameraGuide.classList.add('d-none');
  if (cameraControls) cameraControls.classList.add('d-none');
  if (previewFooter) previewFooter.classList.remove('d-none');
  
  // 撮り直しボタン
  var retakeBtn = document.getElementById('retake-btn');
  if (retakeBtn) {
    retakeBtn.addEventListener('click', function() {
      console.log('[HTML直接カメラ] 撮り直し');
      
      // UI元に戻す
      previewContainer.classList.add('d-none');
      if (cameraGuide) cameraGuide.classList.remove('d-none');
      if (cameraControls) cameraControls.classList.remove('d-none');
      if (previewFooter) previewFooter.classList.add('d-none');
    });
  }
  
  // 写真使用ボタン
  var usePhotoBtn = document.getElementById('use-photo-btn');
  if (usePhotoBtn) {
    usePhotoBtn.addEventListener('click', function() {
      console.log('[HTML直接カメラ] 写真を使用');
      usePhoto(imageData, fileInput);
    });
  }
}

// 写真を使用
function usePhoto(dataURL, fileInput) {
  console.log('[HTML直接カメラ] 写真を使用します');
  
  if (!fileInput) {
    console.error('[HTML直接カメラ] ファイル入力がありません');
    return;
  }
  
  // Blob変換
  fetch(dataURL)
    .then(res => res.blob())
    .then(blob => {
      console.log('[HTML直接カメラ] Blobに変換しました');
      
      // ファイル作成
      var filename = 'camera_' + Date.now() + '.jpg';
      var file = new File([blob], filename, { type: 'image/jpeg' });
      
      // DataTransferで更新
      var dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      
      // 変更イベント発火
      var event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
      
      console.log('[HTML直接カメラ] ファイル入力を更新しました');
      
      // モーダルを閉じる
      var modal = bootstrap.Modal.getInstance(document.getElementById('html-camera-modal'));
      if (modal) {
        modal.hide();
      }
      
      // プレビューを更新
      updatePreview(fileInput, dataURL);
    })
    .catch(err => {
      console.error('[HTML直接カメラ] 写真処理エラー:', err);
    });
}

// プレビュー更新
function updatePreview(fileInput, dataURL) {
  console.log('[HTML直接カメラ] プレビューを更新');
  
  var container = findParentContainer(fileInput);
  if (!container) return;
  
  // プレビュー要素を探す
  var previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview');
  
  // なければ作成
  if (!previewImg) {
    var previewContainer = container.querySelector('.preview-container');
    
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.className = 'preview-container mt-2';
      container.appendChild(previewContainer);
    }
    
    previewImg = document.createElement('img');
    previewImg.className = 'preview-img img-fluid mt-2';
    previewImg.style.maxHeight = '200px';
    previewImg.alt = 'プレビュー';
    previewContainer.appendChild(previewImg);
  }
  
  // 画像設定
  previewImg.src = dataURL;
  previewImg.classList.remove('d-none');
  
  // プレースホルダ非表示
  var placeholder = container.querySelector('.placeholder, .upload-placeholder');
  if (placeholder) {
    placeholder.classList.add('d-none');
  }
  
  // 削除ボタン表示/作成
  var removeBtn = container.querySelector('.remove-btn, .delete-btn');
  
  if (!removeBtn) {
    removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-danger btn-sm mt-2 remove-btn';
    removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>削除';
    container.appendChild(removeBtn);
    
    // 削除ボタンイベント
    removeBtn.addEventListener('click', function() {
      console.log('[HTML直接カメラ] 削除ボタンクリック');
      
      // ファイル入力リセット
      fileInput.value = '';
      
      // プレビュー非表示
      previewImg.src = '';
      previewImg.classList.add('d-none');
      
      // プレースホルダ表示
      if (placeholder) {
        placeholder.classList.remove('d-none');
      }
      
      // 削除ボタン非表示
      this.classList.add('d-none');
    });
  }
  
  removeBtn.classList.remove('d-none');
  
  // 成功メッセージ
  var successMsg = document.createElement('div');
  successMsg.className = 'alert alert-success mt-2 small';
  successMsg.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
  container.appendChild(successMsg);
}

// カメラエラー表示
function showCameraError() {
  console.log('[HTML直接カメラ] エラー表示');
  
  var container = document.querySelector('.camera-container');
  if (container) {
    container.innerHTML = `
      <div class="p-4 text-center">
        <div class="alert alert-warning mb-3">
          <h5><i class="bi bi-exclamation-triangle me-2"></i>カメラにアクセスできません</h5>
          <p class="mb-1">以下の理由が考えられます：</p>
          <ul class="text-start small">
            <li>ブラウザの設定でカメラへのアクセスが許可されていません</li>
            <li>デバイスにカメラが接続されていません</li>
            <li>別のアプリがカメラを使用しています</li>
          </ul>
        </div>
        <button class="btn btn-primary" data-bs-dismiss="modal">
          閉じる
        </button>
      </div>
    `;
  }
}

// カメラスタイル追加
function addCameraStyles() {
  if (document.getElementById('html-camera-styles')) {
    return;
  }
  
  var style = document.createElement('style');
  style.id = 'html-camera-styles';
  style.textContent = `
    .camera-container {
      position: relative;
      overflow: visible;
      background-color: #000;
      min-height: 300px;
      max-height: 70vh;
    }
    
    #camera-video {
      width: 100%;
      max-height: 70vh;
      min-height: 300px;
      object-fit: cover;
    }
    
    .guide-frame {
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
      background-color: rgba(0, 0, 0, 0.5);
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    
    .camera-controls-bg {
      background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
    }
    
    .capture-button {
      width: 70px;
      height: 70px;
      padding: 0;
      border: 3px solid white;
    }
    
    .capture-circle {
      width: 54px;
      height: 54px;
      background-color: white;
      border-radius: 50%;
      display: block;
    }
    
    #switch-camera-btn, #close-camera-btn {
      width: 50px;
      height: 50px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    #switch-camera-btn i, #close-camera-btn i {
      font-size: 1.5rem;
    }
    
    #preview-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-header.bg-primary {
      background-color: #0d6efd !important;
    }
  `;
  
  document.head.appendChild(style);
}

// Bootstrap JSをロード
function loadBootstrapJS() {
  console.log('[HTML直接カメラ] Bootstrap JSをロード');
  
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
  document.head.appendChild(script);
}