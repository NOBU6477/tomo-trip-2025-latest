/**
 * HTMLの直接操作によるカメラ機能実装
 * 非常にシンプルかつ効果的なアプローチ
 */
console.log('直接HTMLカメラ: 初期化中...');

// ページ読み込み後に初期化
document.addEventListener('DOMContentLoaded', function() {
  // 初期化処理
  setTimeout(initCameraHandlers, 1000);
  
  // DOM変更を監視して新しいボタンにもハンドラを適用
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        initCameraHandlers();
      }
    }
  });
  
  // 全ドキュメントの変更を監視
  observer.observe(document.body, { childList: true, subtree: true });
});

// カメラハンドラを初期化
function initCameraHandlers() {
  console.log('直接HTMLカメラ: カメラハンドラを初期化');
  
  // すべてのカメラボタンを探して処理
  findAndProcessCameraButtons();
}

// カメラボタンを見つけて処理
function findAndProcessCameraButtons() {
  // 「カメラで撮影」テキストを含むすべての要素を探す
  const links = document.querySelectorAll('a, button, .btn');
  links.forEach(link => {
    if (link.textContent && link.textContent.trim().includes('カメラで撮影')) {
      // すでに処理済みかチェック
      if (link.getAttribute('data-camera-processed')) {
        return;
      }
      
      console.log('直接HTMLカメラ: カメラボタンを検出:', link.textContent.trim());
      
      // 処理済みとしてマーク
      link.setAttribute('data-camera-processed', 'true');
      
      // クリックイベントを上書き
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('直接HTMLカメラ: カメラボタンがクリックされました');
        
        // ファイル入力要素を探す
        const fileInput = findAssociatedFileInput(this);
        if (fileInput) {
          // カメラモーダルを開く
          openCameraModal(fileInput);
        } else {
          console.error('直接HTMLカメラ: 関連するファイル入力が見つかりません');
        }
      });
    }
  });
}

// 関連するファイル入力要素を探す
function findAssociatedFileInput(element) {
  console.log('直接HTMLカメラ: 関連するファイル入力を探しています');
  
  // 最も近い親コンテナを探す
  const container = element.closest('.form-group, .mb-3, .document-upload-section');
  if (container) {
    // コンテナ内のファイル入力を検索
    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      console.log('直接HTMLカメラ: コンテナ内でファイル入力を発見しました:', fileInput.id || '(id無し)');
      return fileInput;
    }
  }
  
  // 要素から上に辿る
  let current = element;
  let depth = 0;
  while (current && depth < 5) {
    // 兄弟要素や子要素を検索
    const siblings = Array.from(current.parentNode.children);
    for (const sibling of siblings) {
      if (sibling === current) continue;
      
      // 直接的なファイル入力かチェック
      if (sibling.tagName === 'INPUT' && sibling.type === 'file') {
        console.log('直接HTMLカメラ: 兄弟要素としてファイル入力を発見しました');
        return sibling;
      }
      
      // 子要素内のファイル入力を検索
      const fileInput = sibling.querySelector('input[type="file"]');
      if (fileInput) {
        console.log('直接HTMLカメラ: 兄弟要素内でファイル入力を発見しました');
        return fileInput;
      }
    }
    
    // 親要素に移動
    current = current.parentNode;
    depth++;
  }
  
  // ボタン内容から推測
  const buttonText = element.textContent.toLowerCase();
  console.log('直接HTMLカメラ: ボタンテキストから推測します:', buttonText);
  
  if (buttonText.includes('運転免許証')) {
    if (buttonText.includes('裏')) {
      const licenseBack = document.querySelector('input[id*="license"][id*="back"]');
      if (licenseBack) {
        console.log('直接HTMLカメラ: 運転免許証(裏)のファイル入力を発見しました');
        return licenseBack;
      }
    } else {
      const licenseFront = document.querySelector('input[id*="license"][id*="front"]');
      if (licenseFront) {
        console.log('直接HTMLカメラ: 運転免許証(表)のファイル入力を発見しました');
        return licenseFront;
      }
    }
    
    // 一般的な免許証入力
    const licenseInput = document.querySelector('input[id*="license"]');
    if (licenseInput) {
      console.log('直接HTMLカメラ: 運転免許証のファイル入力を発見しました');
      return licenseInput;
    }
  }
  
  if (buttonText.includes('パスポート')) {
    const passportInput = document.querySelector('input[id*="passport"]');
    if (passportInput) {
      console.log('直接HTMLカメラ: パスポートのファイル入力を発見しました');
      return passportInput;
    }
  }
  
  // いずれも見つからない場合は、最初のファイル入力を返す
  const anyInput = document.querySelector('input[type="file"]');
  if (anyInput) {
    console.log('直接HTMLカメラ: 汎用ファイル入力を使用します');
    return anyInput;
  }
  
  console.log('直接HTMLカメラ: ファイル入力が見つかりませんでした');
  return null;
}

// グローバル変数
let mediaStream = null;
let currentFileInput = null;

// カメラモーダルを開く
function openCameraModal(fileInput) {
  console.log('直接HTMLカメラ: カメラモーダルを開きます');
  currentFileInput = fileInput;
  
  // 既存のモーダルを削除
  const existingModal = document.getElementById('direct-camera-modal');
  if (existingModal) {
    try {
      const bsModal = bootstrap.Modal.getInstance(existingModal);
      if (bsModal) bsModal.hide();
    } catch (e) {
      console.log('モーダルインスタンス取得エラー:', e);
    }
    existingModal.remove();
  }
  
  // カメラスタイルを追加
  addCameraStyles();
  
  // タイトルを決定
  let title = 'カメラで撮影';
  let guideText = '書類全体がフレーム内に収まるようにしてください';
  
  // 入力IDからコンテキストを推測
  if (fileInput.id) {
    const id = fileInput.id.toLowerCase();
    if (id.includes('license') || id.includes('driver')) {
      if (id.includes('back')) {
        title = '運転免許証(裏面)を撮影';
      } else {
        title = '運転免許証(表面)を撮影';
      }
    } else if (id.includes('passport')) {
      title = 'パスポートを撮影';
    } else if (id.includes('photo')) {
      title = '証明写真を撮影';
      guideText = 'あなたの顔がフレーム内に収まるようにしてください';
    }
  }
  
  // モーダルHTML作成
  const modalHtml = `
    <div class="modal fade" id="direct-camera-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title"><i class="bi bi-camera me-2"></i>${title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="閉じる"></button>
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
    </div>
  `;
  
  // モーダルをDOMに追加
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer.firstElementChild);
  
  try {
    // Bootstrapモーダルを初期化
    const modal = new bootstrap.Modal(document.getElementById('direct-camera-modal'));
    
    // モーダルイベント設定
    const modalElement = document.getElementById('direct-camera-modal');
    modalElement.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // モーダルを表示
    modal.show();
  } catch (err) {
    console.error('直接HTMLカメラ: モーダル初期化エラー:', err);
    
    // エラー時はインラインJSでモーダルを制御
    const script = document.createElement('script');
    script.textContent = `
      document.addEventListener('DOMContentLoaded', function() {
        try {
          const modal = new bootstrap.Modal(document.getElementById('direct-camera-modal'));
          modal.show();
        } catch(e) {
          console.error('Modal initialization error:', e);
        }
      });
    `;
    document.head.appendChild(script);
  }
}

// カメラ起動
function startCamera() {
  console.log('直接HTMLカメラ: カメラを起動します');
  
  const video = document.getElementById('camera-video');
  const captureBtn = document.getElementById('capture-btn');
  const switchBtn = document.getElementById('switch-camera-btn');
  
  if (!video || !captureBtn) {
    console.error('直接HTMLカメラ: ビデオ/ボタン要素が見つかりません');
    return;
  }
  
  // カメラアクセス設定
  const constraints = {
    video: { 
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };
  
  // カメラ起動試行
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      console.log('直接HTMLカメラ: カメラストリームを取得しました');
      mediaStream = stream;
      video.srcObject = stream;
      
      // カメラ切り替えボタン
      if (switchBtn) {
        switchBtn.addEventListener('click', function() {
          switchCamera();
        });
      }
      
      // 撮影ボタン
      captureBtn.addEventListener('click', function() {
        capturePhoto();
      });
    })
    .catch(function(err) {
      console.error('直接HTMLカメラ: カメラエラー:', err);
      showCameraError();
    });
}

// カメラ切り替え
function switchCamera() {
  console.log('直接HTMLカメラ: カメラを切り替えます');
  
  // 現在のストリームを停止
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
  
  // カメラ向きを反転
  const video = document.getElementById('camera-video');
  if (!video) return;
  
  // 新しい設定
  const newFacingMode = mediaStream.getVideoTracks()[0].getSettings().facingMode === 'environment' ? 'user' : 'environment';
  
  const constraints = {
    video: { 
      facingMode: newFacingMode,
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };
  
  // 新しいカメラで再起動
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      mediaStream = stream;
      video.srcObject = stream;
    })
    .catch(function(err) {
      console.error('直接HTMLカメラ: カメラ切り替えエラー:', err);
    });
}

// 写真撮影
function capturePhoto() {
  console.log('直接HTMLカメラ: 写真を撮影します');
  
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  const previewContainer = document.getElementById('preview-container');
  const previewImage = document.getElementById('preview-image');
  const cameraGuide = document.getElementById('camera-guide');
  const cameraControls = document.getElementById('camera-controls');
  const previewFooter = document.getElementById('preview-footer');
  
  if (!video || !canvas || !previewContainer || !previewImage) {
    console.error('直接HTMLカメラ: 必要な要素が見つかりません');
    return;
  }
  
  // キャンバスのサイズを設定
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  
  // 映像をキャンバスに描画
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // 画像データを取得
  const imageData = canvas.toDataURL('image/jpeg');
  
  // プレビュー表示
  previewImage.src = imageData;
  
  // UI切り替え
  previewContainer.classList.remove('d-none');
  if (cameraGuide) cameraGuide.classList.add('d-none');
  if (cameraControls) cameraControls.classList.add('d-none');
  if (previewFooter) previewFooter.classList.remove('d-none');
  
  // 撮り直しボタン
  const retakeBtn = document.getElementById('retake-btn');
  if (retakeBtn) {
    retakeBtn.onclick = function() {
      previewContainer.classList.add('d-none');
      if (cameraGuide) cameraGuide.classList.remove('d-none');
      if (cameraControls) cameraControls.classList.remove('d-none');
      if (previewFooter) previewFooter.classList.add('d-none');
    };
  }
  
  // 写真使用ボタン
  const usePhotoBtn = document.getElementById('use-photo-btn');
  if (usePhotoBtn) {
    usePhotoBtn.onclick = function() {
      usePhoto(imageData);
    };
  }
}

// 撮影した写真を使用
function usePhoto(dataURL) {
  console.log('直接HTMLカメラ: 写真を使用します');
  
  if (!currentFileInput) {
    console.error('直接HTMLカメラ: ファイル入力が指定されていません');
    return;
  }
  
  // データURLをBlobに変換
  fetch(dataURL)
    .then(res => res.blob())
    .then(blob => {
      // ファイル名を生成
      const filename = 'camera_' + Date.now() + '.jpg';
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      try {
        // ファイル入力を更新
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        currentFileInput.files = dataTransfer.files;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        currentFileInput.dispatchEvent(event);
        
        // モーダルを閉じる
        try {
          const modal = bootstrap.Modal.getInstance(document.getElementById('direct-camera-modal'));
          if (modal) modal.hide();
        } catch (e) {
          console.log('モーダル取得エラー:', e);
          const modalElement = document.getElementById('direct-camera-modal');
          if (modalElement) modalElement.classList.remove('show');
        }
        
        // プレビューを更新
        updatePreview(currentFileInput, dataURL);
        
      } catch (err) {
        console.error('直接HTMLカメラ: ファイル適用エラー:', err);
        alert('写真の適用に失敗しました');
      }
    })
    .catch(err => {
      console.error('直接HTMLカメラ: Blob変換エラー:', err);
    });
}

// カメラ停止
function stopCamera() {
  console.log('直接HTMLカメラ: カメラを停止します');
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => {
      track.stop();
    });
    mediaStream = null;
  }
}

// カメラエラー表示
function showCameraError() {
  console.log('直接HTMLカメラ: カメラエラーを表示します');
  
  const container = document.querySelector('.camera-container');
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

// プレビュー更新
function updatePreview(fileInput, dataURL) {
  console.log('直接HTMLカメラ: プレビューを更新します');
  
  const container = fileInput.closest('.form-group, .mb-3, .document-upload-section, .card');
  if (!container) return;
  
  // プレビュー要素を探す
  let previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview-img');
  
  // なければ作成
  if (!previewImg) {
    let previewContainer = container.querySelector('.preview-container');
    
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
  const placeholder = container.querySelector('.placeholder, .upload-placeholder, [class*="placeholder"]');
  if (placeholder) {
    placeholder.style.display = 'none';
  }
  
  // 削除ボタン表示/作成
  let removeBtn = container.querySelector('.remove-btn, .delete-btn, button[id*="remove"], button[id*="delete"]');
  
  if (!removeBtn) {
    removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-danger btn-sm mt-2 remove-btn';
    removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>削除';
    container.appendChild(removeBtn);
    
    // 削除ボタンイベント
    removeBtn.onclick = function() {
      // ファイル入力リセット
      fileInput.value = '';
      
      // プレビュー非表示
      previewImg.src = '';
      previewImg.classList.add('d-none');
      
      // プレースホルダ表示
      if (placeholder) {
        placeholder.style.display = '';
      }
      
      // 削除ボタン非表示
      this.style.display = 'none';
    };
  }
  
  removeBtn.style.display = '';
  
  // 成功メッセージ
  const oldSuccess = container.querySelector('.alert-success');
  if (oldSuccess) oldSuccess.remove();
  
  const successMsg = document.createElement('div');
  successMsg.className = 'alert alert-success mt-2 small';
  successMsg.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
  container.appendChild(successMsg);
}

// カメラスタイル追加
function addCameraStyles() {
  if (document.getElementById('direct-camera-styles')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'direct-camera-styles';
  style.textContent = `
    .camera-container {
      position: relative;
      overflow: hidden;
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

// インラインスクリプトを注入して確実な初期化
const initScript = document.createElement('script');
initScript.textContent = `
  // 直接カメラボタンハンドラの注入
  (function() {
    console.log('インラインスクリプト: カメラボタン検索中...');
    
    // ページロード後に実行
    function setupCameraButtons() {
      document.querySelectorAll('a, button, .btn').forEach(function(element) {
        if (element.textContent && element.textContent.includes('カメラで撮影')) {
          console.log('インラインスクリプト: カメラボタン検出:', element.textContent);
          
          // 既存のクリックハンドラを無効化
          element.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('インラインスクリプト: カメラボタンがクリックされました');
            
            // カスタムイベントを発火
            document.dispatchEvent(new CustomEvent('direct-camera-click', {
              detail: { button: this }
            }));
            
            return false;
          };
        }
      });
    }
    
    // ページロード時に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(setupCameraButtons, 500);
      });
    } else {
      setTimeout(setupCameraButtons, 500);
    }
    
    // 一定間隔で実行
    setInterval(setupCameraButtons, 3000);
  })();
`;

document.head.appendChild(initScript);

// カスタムイベントをリッスン
document.addEventListener('direct-camera-click', function(e) {
  console.log('直接HTMLカメラ: カスタムイベントを受信しました');
  if (e.detail && e.detail.button) {
    const fileInput = findAssociatedFileInput(e.detail.button);
    if (fileInput) {
      openCameraModal(fileInput);
    } else {
      console.error('直接HTMLカメラ: ファイル入力が見つかりません');
    }
  }
});