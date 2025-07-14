/**
 * インラインでカメラボタンを直接操作するスクリプト
 * カメラで撮影ボタンに直接イベントハンドラーを設定する最も単純なアプローチ
 */

// 即時実行関数で開始
(function() {
  console.log('インラインカメラ: 初期化中...');
  
  // ページロード時に実行
  window.addEventListener('load', function() {
    console.log('インラインカメラ: ページロード完了');
    setTimeout(setupCameraButtons, 500);
  });
  
  // 指定の間隔で実行して確実に適用
  setInterval(setupCameraButtons, 2000);
  
  // カメラボタンのセットアップ
  function setupCameraButtons() {
    console.log('インラインカメラ: カメラボタンをセットアップ');
    
    // 1. アンカータグを検索 (最も一般的)
    var cameraLinks = document.querySelectorAll('a');
    cameraLinks.forEach(function(link) {
      if (link.textContent.includes('カメラで撮影')) {
        console.log('インラインカメラ: アンカータグでカメラリンクを検出:', link.textContent);
        replaceWithInlineFunctionality(link);
      }
    });
    
    // 2. ボタンを検索
    var cameraButtons = document.querySelectorAll('button, .btn');
    cameraButtons.forEach(function(button) {
      if (button.textContent.includes('カメラで撮影')) {
        console.log('インラインカメラ: ボタンでカメラリンクを検出:', button.textContent);
        replaceWithInlineFunctionality(button);
      }
    });
    
    // 3. カメラアイコンを含む要素を検索
    var cameraIcons = document.querySelectorAll('.bi-camera, .fa-camera, [class*="camera"]');
    cameraIcons.forEach(function(icon) {
      var parent = icon.closest('a, button, .btn');
      if (parent) {
        console.log('インラインカメラ: アイコンからカメラボタンを検出:', parent.textContent);
        replaceWithInlineFunctionality(parent);
      }
    });
    
    // 4. HTML直接挿入 - 全てのカメラリンクを置換
    injectHtmlUpdate();
  }
  
  // インライン機能へ置換
  function replaceWithInlineFunctionality(element) {
    // すでに処理済みかチェック
    if (element.dataset.cameraHandled) {
      return;
    }
    
    // ハンドル済みとしてマーク
    element.dataset.cameraHandled = 'true';
    
    // クリックイベントを直接オーバーライド
    element.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('インラインカメラ: カメラボタンがクリックされました');
      
      // 関連するファイル入力を探す
      var fileInput = findAssociatedFileInput(this);
      if (fileInput) {
        showCameraModal(fileInput);
      } else {
        console.error('インラインカメラ: ファイル入力が見つかりません');
      }
      
      return false;
    };
  }
  
  // 関連するファイル入力を探す
  function findAssociatedFileInput(element) {
    // 1. 親要素から探す
    var container = element.closest('.form-group, .mb-3, .document-upload-section, .card');
    if (container) {
      var fileInput = container.querySelector('input[type="file"]');
      if (fileInput) {
        console.log('インラインカメラ: コンテナ内でファイル入力を発見:', fileInput.id);
        return fileInput;
      }
    }
    
    // 2. 隣接要素から探す
    var current = element;
    while (current) {
      var next = current.nextElementSibling;
      if (next) {
        var fileInput = next.querySelector('input[type="file"]');
        if (fileInput) {
          console.log('インラインカメラ: 隣接要素でファイル入力を発見:', fileInput.id);
          return fileInput;
        }
      }
      
      // 親要素に移動
      if (current.parentElement) {
        current = current.parentElement;
      } else {
        break;
      }
    }
    
    // 3. ボタンコンテキストから推測
    var buttonText = element.textContent.toLowerCase();
    if (buttonText.includes('運転免許証')) {
      if (buttonText.includes('裏面')) {
        var licenseBack = document.querySelector('input[id*="license"][id*="back"]');
        if (licenseBack) {
          console.log('インラインカメラ: 運転免許証(裏)のファイル入力を発見:', licenseBack.id);
          return licenseBack;
        }
      } else {
        var licenseFront = document.querySelector('input[id*="license"][id*="front"]');
        if (licenseFront) {
          console.log('インラインカメラ: 運転免許証(表)のファイル入力を発見:', licenseFront.id);
          return licenseFront;
        }
      }
      
      var license = document.querySelector('input[id*="license"]');
      if (license) {
        console.log('インラインカメラ: 運転免許証のファイル入力を発見:', license.id);
        return license;
      }
    }
    
    if (buttonText.includes('パスポート')) {
      var passport = document.querySelector('input[id*="passport"]');
      if (passport) {
        console.log('インラインカメラ: パスポートのファイル入力を発見:', passport.id);
        return passport;
      }
    }
    
    // 4. フォームから探す
    var form = element.closest('form');
    if (form) {
      var fileInputs = form.querySelectorAll('input[type="file"]');
      if (fileInputs.length > 0) {
        console.log('インラインカメラ: フォーム内でファイル入力を発見:', fileInputs[0].id);
        return fileInputs[0];
      }
    }
    
    // 5. 最終手段
    var allInputs = document.querySelectorAll('input[type="file"]');
    if (allInputs.length > 0) {
      console.log('インラインカメラ: 最初のファイル入力を使用:', allInputs[0].id);
      return allInputs[0];
    }
    
    return null;
  }
  
  // インラインHTMLアップデート
  function injectHtmlUpdate() {
    // リンクを直接検索して置換する関数
    var script = document.createElement('script');
    script.textContent = `
      (function() {
        function findAndReplaceCameraLinks() {
          console.log("インラインスクリプト: カメラリンクを検索中...");
          
          // カメラリンクを検索
          document.querySelectorAll('a, button, .btn').forEach(function(element) {
            if (element.innerText && element.innerText.includes("カメラで撮影")) {
              console.log("インラインスクリプト: カメラリンクを検出:", element.innerText);
              
              // クリックイベント上書き
              element.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("インラインスクリプト: カメラボタンがクリックされました");
                
                // カスタムイベント発火
                document.dispatchEvent(new CustomEvent('inline-camera-clicked', { 
                  detail: { source: this }
                }));
                
                return false;
              };
            }
          });
        }
        
        // ページロード直後に実行
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(findAndReplaceCameraLinks, 500);
          });
        } else {
          setTimeout(findAndReplaceCameraLinks, 500);
        }
        
        // 定期的に実行
        setInterval(findAndReplaceCameraLinks, 3000);
      })();
    `;
    
    document.head.appendChild(script);
    
    // カスタムイベントをリッスン
    document.addEventListener('inline-camera-clicked', function(e) {
      console.log('インラインカメラ: カスタムイベントを受信しました');
      if (e.detail && e.detail.source) {
        var fileInput = findAssociatedFileInput(e.detail.source);
        if (fileInput) {
          showCameraModal(fileInput);
        }
      }
    });
  }
  
  // グローバル変数
  var mediaStream = null;
  var currentFileInput = null;
  
  // カメラモーダルを表示
  function showCameraModal(fileInput) {
    console.log('インラインカメラ: カメラモーダルを表示');
    currentFileInput = fileInput;
    
    // 既存のモーダルを削除
    var existingModal = document.getElementById('inline-camera-modal');
    if (existingModal) {
      var bsModal = bootstrap.Modal.getInstance(existingModal);
      if (bsModal) bsModal.hide();
      existingModal.remove();
    }
    
    // スタイル追加
    addCameraStyles();
    
    // モーダルタイトル設定
    var title = 'カメラで撮影';
    var guideText = '書類全体がフレーム内に収まるようにしてください';
    var isIdPhoto = false;
    
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
        guideText = 'あなたの顔がフレーム内に収まるようにしてください';
        isIdPhoto = true;
      }
    }
    
    // モーダル作成
    var modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'inline-camera-modal';
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
    
    try {
      // Bootstrapモーダル初期化
      var bsModal = new bootstrap.Modal(modal);
      
      // モーダルイベント設定
      modal.addEventListener('shown.bs.modal', function() {
        startCamera();
      });
      
      modal.addEventListener('hidden.bs.modal', function() {
        stopCamera();
      });
      
      // モーダル表示
      bsModal.show();
    } catch (err) {
      console.error('インラインカメラ: モーダル初期化エラー:', err);
      loadBootstrapJS(function() {
        try {
          var bsModal = new bootstrap.Modal(modal);
          bsModal.show();
          
          modal.addEventListener('shown.bs.modal', function() {
            startCamera();
          });
          
          modal.addEventListener('hidden.bs.modal', function() {
            stopCamera();
          });
        } catch (err2) {
          console.error('インラインカメラ: 2次モーダル初期化エラー:', err2);
        }
      });
    }
  }
  
  // カメラ起動
  function startCamera() {
    console.log('インラインカメラ: カメラを起動');
    
    var video = document.getElementById('camera-video');
    var captureBtn = document.getElementById('capture-btn');
    var switchBtn = document.getElementById('switch-camera-btn');
    
    if (!video || !captureBtn) {
      console.error('インラインカメラ: 必要な要素が見つかりません');
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
        console.log('インラインカメラ: カメラストリーム取得');
        mediaStream = stream;
        video.srcObject = stream;
        
        // カメラ切り替えボタン
        if (switchBtn) {
          switchBtn.addEventListener('click', function() {
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
                console.error('インラインカメラ: カメラ切り替えエラー:', err);
              });
          });
        }
        
        // 撮影ボタン
        captureBtn.addEventListener('click', function() {
          capturePhoto();
        });
      })
      .catch(function(err) {
        console.error('インラインカメラ: カメラエラー:', err);
        showCameraError();
      });
  }
  
  // カメラ停止
  function stopCamera() {
    console.log('インラインカメラ: カメラ停止');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  // 写真撮影
  function capturePhoto() {
    console.log('インラインカメラ: 写真撮影');
    
    var video = document.getElementById('camera-video');
    var canvas = document.getElementById('camera-canvas');
    var previewContainer = document.getElementById('preview-container');
    var previewImage = document.getElementById('preview-image');
    var cameraGuide = document.getElementById('camera-guide');
    var cameraControls = document.getElementById('camera-controls');
    var previewFooter = document.getElementById('preview-footer');
    
    if (!video || !canvas || !previewContainer || !previewImage) {
      console.error('インラインカメラ: 必要な要素が見つかりません');
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
    
    // UI要素切り替え
    previewContainer.classList.remove('d-none');
    if (cameraGuide) cameraGuide.classList.add('d-none');
    if (cameraControls) cameraControls.classList.add('d-none');
    if (previewFooter) previewFooter.classList.remove('d-none');
    
    // 撮り直しボタン
    var retakeBtn = document.getElementById('retake-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function() {
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
        usePhoto(imageData);
      });
    }
  }
  
  // 写真使用
  function usePhoto(dataURL) {
    console.log('インラインカメラ: 写真使用');
    
    if (!currentFileInput) {
      console.error('インラインカメラ: ファイル入力がセットされていません');
      return;
    }
    
    // Blob変換
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => {
        // ファイル作成
        var filename = 'camera_' + Date.now() + '.jpg';
        var file = new File([blob], filename, { type: 'image/jpeg' });
        
        // ファイル入力更新
        var dt = new DataTransfer();
        dt.items.add(file);
        currentFileInput.files = dt.files;
        
        // 変更イベント発火
        var event = new Event('change', { bubbles: true });
        currentFileInput.dispatchEvent(event);
        
        // モーダル閉じる
        var modal = bootstrap.Modal.getInstance(document.getElementById('inline-camera-modal'));
        if (modal) {
          modal.hide();
        }
        
        // プレビュー更新
        updatePreview(currentFileInput, dataURL);
      })
      .catch(err => {
        console.error('インラインカメラ: 写真処理エラー:', err);
      });
  }
  
  // プレビュー更新
  function updatePreview(fileInput, dataURL) {
    console.log('インラインカメラ: プレビュー更新');
    
    var container = fileInput.closest('.form-group, .mb-3, .document-upload-section, .card');
    if (!container) return;
    
    // プレビュー要素を探す
    var previewImg = container.querySelector('img.preview-img, img[id$="-preview"]');
    
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
    
    // 画像を設定
    previewImg.src = dataURL;
    previewImg.classList.remove('d-none');
    
    // プレースホルダを非表示
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
        removeBtn.classList.add('d-none');
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
    console.log('インラインカメラ: エラー表示');
    
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
    if (document.getElementById('inline-camera-styles')) {
      return;
    }
    
    var style = document.createElement('style');
    style.id = 'inline-camera-styles';
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
  function loadBootstrapJS(callback) {
    console.log('インラインカメラ: Bootstrap JSをロード');
    
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
    
    script.onload = function() {
      console.log('インラインカメラ: Bootstrap JSのロード完了');
      if (callback) callback();
    };
    
    document.head.appendChild(script);
  }
})();