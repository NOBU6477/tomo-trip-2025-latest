/**
 * 最もシンプルかつ直接的なカメラ機能修正
 * カメラボタンに直接イベントハンドラを設定し、確実に機能させる
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('直接的なカメラ機能修正を初期化しています');

  // カメラ関連のグローバル変数
  let mediaStream = null;
  let currentFileInput = null;
  
  // 初期化関数
  function init() {
    console.log('カメラ機能初期化開始');
    
    // ボタンのセットアップを少し遅らせて実行（DOMが完全にロードされた後）
    setTimeout(setupCameraButtons, 500);
    
    // ファイル入力変更の検出
    document.addEventListener('change', function(e) {
      if (e.target.tagName === 'INPUT' && e.target.type === 'file') {
        handleFileChange(e.target);
      }
    });
    
    // 削除ボタンの検出
    document.addEventListener('click', handleDeleteButtonClick);
  }
  
  // カメラボタンのセットアップ
  function setupCameraButtons() {
    console.log('カメラボタンのセットアップを開始');
    
    // すべてのカメラボタンを探す
    const cameraButtons = [];
    
    // "カメラで撮影"を含む要素を検索
    document.querySelectorAll('button, a, .btn').forEach(element => {
      if (element.textContent.includes('カメラで撮影')) {
        cameraButtons.push(element);
      }
    });
    
    // カメラアイコンを含む要素を検索
    document.querySelectorAll('button, a, .btn').forEach(element => {
      if (element.querySelector('.bi-camera, .fa-camera') || 
          element.innerHTML.includes('camera') ||
          element.classList.contains('camera-btn')) {
        if (!cameraButtons.includes(element)) {
          cameraButtons.push(element);
        }
      }
    });
    
    // ID名でカメラ関連ボタンを検索
    document.querySelectorAll('[id*="camera"], [id*="Camera"]').forEach(element => {
      if (!cameraButtons.includes(element)) {
        cameraButtons.push(element);
      }
    });
    
    console.log(`${cameraButtons.length}個のカメラボタンを検出しました`);
    
    // 各ボタンにイベントハンドラを設定
    cameraButtons.forEach((button, index) => {
      console.log(`ボタン ${index + 1}: ${button.outerHTML.substring(0, 50)}...`);
      
      // 古いイベントを削除するためにクローン
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // 新しいボタンにイベントリスナーを追加
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('カメラボタンがクリックされました');
        
        // 関連するファイル入力を見つける
        const fileInput = findAssociatedFileInput(this);
        if (fileInput) {
          openCamera(fileInput);
        } else {
          console.error('関連するファイル入力が見つかりません');
        }
      });
    });
    
    // ダイレクト対応: 直接セレクタでカメラボタンを指定
    const directCameraButtons = document.querySelectorAll('.camera-btn, [id*="camera-btn"], a.camera-link');
    directCameraButtons.forEach(button => {
      if (!cameraButtons.includes(button)) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('直接セレクタでのカメラボタンがクリックされました');
          
          const fileInput = findAssociatedFileInput(this);
          if (fileInput) {
            openCamera(fileInput);
          } else {
            console.error('関連するファイル入力が見つかりません');
          }
        });
      }
    });
  }
  
  // ボタンに関連するファイル入力を見つける
  function findAssociatedFileInput(button) {
    console.log('関連ファイル入力の検索開始: ', button.outerHTML.substring(0, 50));
    
    // 1. 親要素内を検索
    const container = button.closest('.form-group, .mb-3, .document-upload-section, [id*="upload"]');
    if (container) {
      console.log('コンテナが見つかりました');
      
      // 同じコンテナ内のファイル入力を検索
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput) {
        console.log('コンテナ内でファイル入力が見つかりました: ' + fileInput.id);
        return fileInput;
      }
    }
    
    // 2. 近接するファイル入力を検索
    let currentEl = button.parentElement;
    let searchDepth = 0;
    
    while (currentEl && searchDepth < 5) {
      const fileInput = currentEl.querySelector('input[type="file"]');
      if (fileInput) {
        console.log('近接するファイル入力が見つかりました: ' + fileInput.id);
        return fileInput;
      }
      
      currentEl = currentEl.parentElement;
      searchDepth++;
    }
    
    // 3. ボタンの兄弟要素を検索
    const siblings = Array.from(button.parentElement.children);
    for (const sibling of siblings) {
      if (sibling.tagName === 'INPUT' && sibling.type === 'file') {
        console.log('兄弟要素としてファイル入力が見つかりました: ' + sibling.id);
        return sibling;
      }
      
      const fileInput = sibling.querySelector('input[type="file"]');
      if (fileInput) {
        console.log('兄弟要素内でファイル入力が見つかりました: ' + fileInput.id);
        return fileInput;
      }
    }
    
    // 4. テキストコンテンツからファイル入力を推測
    const buttonText = button.textContent.trim().toLowerCase();
    
    if (buttonText.includes('運転免許証')) {
      if (buttonText.includes('裏')) {
        const licenseBack = document.getElementById('license-back-input') ||
                           document.querySelector('input[id*="license"][id*="back"]');
        if (licenseBack) {
          console.log('運転免許証(裏)のファイル入力が見つかりました: ' + licenseBack.id);
          return licenseBack;
        }
      } else {
        const licenseFront = document.getElementById('license-front-input') ||
                            document.querySelector('input[id*="license"][id*="front"]');
        if (licenseFront) {
          console.log('運転免許証(表)のファイル入力が見つかりました: ' + licenseFront.id);
          return licenseFront;
        }
      }
    }
    
    if (buttonText.includes('パスポート')) {
      const passport = document.getElementById('passport-input') ||
                      document.querySelector('input[id*="passport"]');
      if (passport) {
        console.log('パスポートのファイル入力が見つかりました: ' + passport.id);
        return passport;
      }
    }
    
    // 5. 最初に見つかったファイル入力を返す
    const anyFileInput = document.querySelector('input[type="file"]');
    if (anyFileInput) {
      console.log('ファイル入力が見つかりました（最終手段）: ' + anyFileInput.id);
      return anyFileInput;
    }
    
    console.log('関連するファイル入力が見つかりませんでした');
    return null;
  }
  
  // カメラを開く
  function openCamera(fileInput) {
    console.log('カメラを開始します');
    currentFileInput = fileInput;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('camera-modal');
    if (existingModal) {
      const bsModal = bootstrap.Modal.getInstance(existingModal);
      if (bsModal) bsModal.hide();
      existingModal.remove();
    }
    
    // モーダルのタイトルを決定
    let title = 'カメラで撮影';
    let guideText = '書類全体がフレーム内に収まるようにしてください';
    let isIdPhoto = false;
    
    // 入力IDからタイトルを推測
    if (fileInput.id) {
      if (fileInput.id.includes('license') || fileInput.id.includes('driver')) {
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
    
    // モーダルを作成
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
            <div class="camera-container">
              <video id="camera-video" autoplay playsinline class="w-100"></video>
              <canvas id="camera-canvas" class="d-none"></canvas>
              
              <div id="camera-guide" class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <div class="guide-frame">
                  <div class="guide-text">${guideText}</div>
                </div>
              </div>
              
              <div id="camera-controls" class="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center bg-gradient-dark">
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
    
    // スタイルを追加
    addCameraStyles();
    
    // モーダルをDOMに追加
    document.body.appendChild(modal);
    
    // Bootstrapモーダルを初期化
    const bsModal = new bootstrap.Modal(modal);
    
    // モーダルが表示されたときにカメラを起動
    modal.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダルが閉じられたときにカメラを停止
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // モーダルを表示
    bsModal.show();
    
    // カメラを起動
    function startCamera() {
      const video = document.getElementById('camera-video');
      const captureBtn = document.getElementById('capture-btn');
      const switchBtn = document.getElementById('switch-camera-btn');
      
      if (!video) return;
      
      // カメラの設定
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      // カメラを起動
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          mediaStream = stream;
          video.srcObject = stream;
          
          // カメラ切り替えボタンのイベント設定
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
          
          // 撮影ボタンのイベント設定
          if (captureBtn) {
            captureBtn.addEventListener('click', function() {
              capturePhoto();
            });
          }
        })
        .catch(function(err) {
          console.error('カメラの起動に失敗しました:', err);
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
              <li>別のアプリがカメラを使用しています</li>
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
        retakeBtn.addEventListener('click', function() {
          previewContainer.classList.add('d-none');
          if (cameraGuide) cameraGuide.classList.remove('d-none');
          if (cameraControls) cameraControls.classList.remove('d-none');
          if (previewFooter) previewFooter.classList.add('d-none');
        });
      }
      
      // 写真を使用ボタンのイベント
      const usePhotoBtn = document.getElementById('use-photo-btn');
      if (usePhotoBtn) {
        usePhotoBtn.addEventListener('click', function() {
          usePhoto(previewImage.src);
        });
      }
    }
    
    // 写真を使用
    function usePhoto(dataURL) {
      if (!currentFileInput) return;
      
      // データURLをBlobに変換
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          // ファイル名を生成
          const filename = `photo_${Date.now()}.jpg`;
          const file = new File([blob], filename, { type: 'image/jpeg' });
          
          // DataTransferオブジェクトを使用してファイル入力を更新
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
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
  
  // ファイル変更を処理
  function handleFileChange(fileInput) {
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      updatePreview(fileInput, e.target.result);
    };
    
    reader.readAsDataURL(file);
  }
  
  // プレビューを更新
  function updatePreview(fileInput, dataURL) {
    // コンテナを探す
    const container = fileInput.closest('.form-group, .mb-3, .document-upload-section');
    if (!container) return;
    
    // プレビュー要素を探す
    let previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview');
    
    // プレビュー要素がない場合は作成
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
    const placeholder = container.querySelector('.placeholder, .upload-placeholder');
    if (placeholder) {
      placeholder.classList.add('d-none');
    }
    
    // 削除ボタンを表示または作成
    let removeBtn = container.querySelector('.remove-btn, .delete-btn');
    
    if (!removeBtn) {
      removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-sm mt-2 remove-btn';
      removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>削除';
      container.appendChild(removeBtn);
    }
    
    removeBtn.classList.remove('d-none');
    
    // 成功メッセージを表示
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-2 small';
    successMessage.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
    container.appendChild(successMessage);
  }
  
  // 削除ボタンのクリックを処理
  function handleDeleteButtonClick(e) {
    const button = e.target.closest('button, .btn');
    if (!button) return;
    
    // 削除ボタンかどうかを判断
    if (button.classList.contains('remove-btn') || 
        button.classList.contains('delete-btn') || 
        button.querySelector('.bi-trash, .fa-trash') || 
        button.textContent.trim().includes('削除')) {
      
      e.preventDefault();
      
      // ファイル入力を探す
      const container = button.closest('.form-group, .mb-3, .document-upload-section');
      if (!container) return;
      
      const fileInput = container.querySelector('input[type="file"]');
      if (!fileInput) return;
      
      // ファイル入力をリセット
      fileInput.value = '';
      
      // プレビュー要素を非表示
      const previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview');
      if (previewImg) {
        previewImg.src = '';
        previewImg.classList.add('d-none');
      }
      
      // プレースホルダを表示
      const placeholder = container.querySelector('.placeholder, .upload-placeholder');
      if (placeholder) {
        placeholder.classList.remove('d-none');
      }
      
      // 削除ボタンを非表示
      button.classList.add('d-none');
      
      // 成功メッセージを削除
      const successMessage = container.querySelector('.alert-success');
      if (successMessage) {
        successMessage.remove();
      }
    }
  }
  
  // カメラスタイルを追加
  function addCameraStyles() {
    if (document.getElementById('camera-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'camera-styles';
    style.textContent = `
      .camera-container {
        position: relative;
        background-color: #000;
        min-height: 300px;
        max-height: 70vh;
        overflow: hidden;
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
        width: 80%;
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
      
      .bg-gradient-dark {
        background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
      }
      
      #preview-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // 直接カメラボタンイベントの追加
  function addDirectCameraButtonEvents() {
    // 0.5秒後に実行（完全にDOMがロードされた後）
    setTimeout(() => {
      console.log('直接的なカメラボタンイベントを追加します');
      
      // "カメラで撮影" テキストを含むすべての要素を検索
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        if (el.textContent.trim().includes('カメラで撮影')) {
          console.log('カメラボタン検出: ' + el.outerHTML.substring(0, 50));
          
          // クリックイベントを設定
          el.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('カメラボタンが直接クリックされました');
            
            // 関連するファイル入力を探す
            const fileInput = findAssociatedFileInput(this);
            if (fileInput) {
              openCamera(fileInput);
            } else {
              console.error('関連するファイル入力が見つかりません');
            }
          });
        }
      });
    }, 500);
  }
  
  // HTML要素に直接イベントを設定するための関数
  function injectDirectEventHandlers() {
    // 極めて直接的なイベントハンドラのセットアップ
    const script = document.createElement('script');
    script.textContent = `
      // HTML内の要素に直接イベントを設定
      document.addEventListener('DOMContentLoaded', function() {
        // 「カメラで撮影」ボタンへの直接イベント設定
        setTimeout(function() {
          var cameraButtons = document.querySelectorAll('a, button');
          cameraButtons.forEach(function(btn) {
            if (btn.textContent.includes('カメラで撮影')) {
              console.log('直接ハンドラを設定: ' + btn.textContent);
              btn.onclick = function(e) {
                e.preventDefault();
                console.log('カメラボタンクリック: ' + this.textContent);
                document.dispatchEvent(new CustomEvent('camera-button-clicked', {
                  detail: { button: this }
                }));
                return false;
              };
            }
          });
        }, 1000);
      });
    `;
    
    document.head.appendChild(script);
    
    // カスタムイベントをリッスン
    document.addEventListener('camera-button-clicked', function(e) {
      console.log('カメラボタンクリックイベントを受信:', e.detail.button);
      const fileInput = findAssociatedFileInput(e.detail.button);
      if (fileInput) {
        openCamera(fileInput);
      }
    });
  }
  
  // 初期化を実行
  init();
  addDirectCameraButtonEvents();
  injectDirectEventHandlers();
});