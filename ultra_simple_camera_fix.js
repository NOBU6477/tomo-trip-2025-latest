/**
 * 超シンプルなカメラ修正スクリプト
 * すべての「カメラで撮影」ボタンに直接イベントハンドラを設定します
 */
(function() {
  // ログ関数
  function log(message) {
    console.log('[UltraSimpleCamera] ' + message);
  }

  log('初期化中...');

  // DOMがロードされた後に実行
  document.addEventListener('DOMContentLoaded', function() {
    // すぐには実行せず、少し待機
    setTimeout(setupCameraButtons, 1000);
  });

  // ページロード時とDOM変更時に実行
  window.addEventListener('load', function() {
    log('ページロード完了');
    setTimeout(setupCameraButtons, 1000);
    
    // DOM変更を監視
    const observer = new MutationObserver(function(mutations) {
      log('DOM変更を検出');
      setupCameraButtons();
    });
    
    // body全体の変更を監視
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  });

  // カメラボタンのセットアップ
  function setupCameraButtons() {
    log('カメラボタンのセットアップ開始');
    
    // カメラ関連のテキストを持つすべての要素を検索
    const elementsWithCameraText = [];
    
    // テキストノードを検索するヘルパー関数
    function searchTextNodes(element, searchText) {
      if (element.nodeType === Node.TEXT_NODE) {
        if (element.textContent.includes(searchText)) {
          return true;
        }
      } else {
        for (let i = 0; i < element.childNodes.length; i++) {
          if (searchTextNodes(element.childNodes[i], searchText)) {
            return true;
          }
        }
      }
      return false;
    }
    
    // ドキュメント内のすべての要素をチェック
    const allElements = document.querySelectorAll('*');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      
      // 直接テキストコンテンツをチェック
      if (element.textContent.includes('カメラで撮影')) {
        if (element.tagName === 'BUTTON' || 
            element.tagName === 'A' || 
            element.classList.contains('btn') ||
            element.getAttribute('role') === 'button') {
          elementsWithCameraText.push(element);
          continue;
        }
        
        // 直接のクリック可能要素でない場合は、内部のボタン要素を検索
        const childButtons = element.querySelectorAll('button, a, [role="button"], .btn');
        if (childButtons.length > 0) {
          for (let j = 0; j < childButtons.length; j++) {
            elementsWithCameraText.push(childButtons[j]);
          }
        } else if (searchTextNodes(element, 'カメラで撮影')) {
          // テキストノードを含む要素も追加
          elementsWithCameraText.push(element);
        }
      }
    }
    
    log('検出されたカメラ関連要素: ' + elementsWithCameraText.length);
    
    // 検出されたすべての要素にクリックハンドラを追加
    elementsWithCameraText.forEach(function(element, index) {
      log('カメラ要素 ' + index + ': ' + element.outerHTML.substring(0, 50) + '...');
      
      // 既存のハンドラを削除するため、クローンを作成
      const clone = element.cloneNode(true);
      if (element.parentNode) {
        element.parentNode.replaceChild(clone, element);
        
        // 新しい要素にクリックハンドラを設定
        clone.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          log('カメラボタンがクリックされました: ' + this.textContent);
          
          // 関連するファイル入力を見つけてカメラを開く
          const fileInput = findNearestFileInput(this);
          if (fileInput) {
            openCamera(fileInput);
          } else {
            log('警告: 関連するファイル入力が見つかりません');
          }
        });
      }
    });
    
    // 特定のセレクタを使用して直接カメラボタンを検索
    const cameraButtons = document.querySelectorAll('a[href="#camera"], button.camera-btn, .btn-camera');
    cameraButtons.forEach(function(button) {
      if (!elementsWithCameraText.includes(button)) {
        log('セレクタでカメラボタンを検出: ' + button.outerHTML.substring(0, 50));
        
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          log('セレクタで検出したカメラボタンがクリックされました');
          
          const fileInput = findNearestFileInput(this);
          if (fileInput) {
            openCamera(fileInput);
          } else {
            log('警告: 関連するファイル入力が見つかりません');
          }
        });
      }
    });
    
    // インラインJavaScriptを追加して直接アクセス
    injectDirectAccess();
  }

  // 最も近いファイル入力要素を見つける
  function findNearestFileInput(element) {
    log('ファイル入力検索開始: ' + element.outerHTML.substring(0, 50));
    
    // 1. 親要素のコンテナを探す
    const container = element.closest('.form-group, .mb-3, .document-upload-section, .card');
    if (container) {
      // コンテナ内のファイル入力を検索
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput) {
        log('コンテナ内でファイル入力を発見: ' + fileInput.id);
        return fileInput;
      }
    }
    
    // 2. 要素から上に辿る
    let current = element;
    let searchDepth = 0;
    while (current && searchDepth < 5) {
      // 兄弟要素を検索
      let sibling = current.nextElementSibling;
      while (sibling) {
        if (sibling.querySelector('input[type="file"]')) {
          const fileInput = sibling.querySelector('input[type="file"]');
          log('兄弟要素内でファイル入力を発見: ' + fileInput.id);
          return fileInput;
        }
        sibling = sibling.nextElementSibling;
      }
      
      // 親要素に移動
      current = current.parentElement;
      if (current) {
        const fileInput = current.querySelector('input[type="file"]');
        if (fileInput) {
          log('親要素内でファイル入力を発見: ' + fileInput.id);
          return fileInput;
        }
      }
      searchDepth++;
    }
    
    // 3. ドキュメント内のすべてのファイル入力を取得し、ID名から関連性を推測
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    log('ドキュメント内のファイル入力数: ' + allFileInputs.length);
    
    // ボタンテキストから推測
    const buttonText = element.textContent.toLowerCase();
    
    if (buttonText.includes('運転免許証')) {
      if (buttonText.includes('裏面')) {
        for (let i = 0; i < allFileInputs.length; i++) {
          const input = allFileInputs[i];
          if (input.id && (input.id.includes('license-back') || input.id.includes('back-license'))) {
            log('ID名から運転免許証(裏)のファイル入力を発見: ' + input.id);
            return input;
          }
        }
      } else {
        for (let i = 0; i < allFileInputs.length; i++) {
          const input = allFileInputs[i];
          if (input.id && (input.id.includes('license-front') || input.id.includes('front-license'))) {
            log('ID名から運転免許証(表)のファイル入力を発見: ' + input.id);
            return input;
          }
        }
      }
      
      // 一般的な免許証入力
      for (let i = 0; i < allFileInputs.length; i++) {
        const input = allFileInputs[i];
        if (input.id && input.id.includes('license')) {
          log('ID名から運転免許証のファイル入力を発見: ' + input.id);
          return input;
        }
      }
    }
    
    if (buttonText.includes('パスポート')) {
      for (let i = 0; i < allFileInputs.length; i++) {
        const input = allFileInputs[i];
        if (input.id && input.id.includes('passport')) {
          log('ID名からパスポートのファイル入力を発見: ' + input.id);
          return input;
        }
      }
    }
    
    // 最初のファイル入力を返す
    if (allFileInputs.length > 0) {
      log('最初のファイル入力を使用: ' + allFileInputs[0].id);
      return allFileInputs[0];
    }
    
    log('ファイル入力が見つかりませんでした');
    return null;
  }

  // カメラモーダルを開く
  function openCamera(fileInput) {
    log('カメラモーダルを開きます');
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('ultra-camera-modal');
    if (existingModal) {
      const bsModal = bootstrap.Modal.getInstance(existingModal);
      if (bsModal) bsModal.hide();
      existingModal.remove();
    }
    
    // スタイルを追加
    addCameraStyles();
    
    // モーダルのタイトルを決定
    let title = 'カメラで撮影';
    let guideText = '書類全体がフレーム内に収まるようにしてください';
    
    // 入力IDからタイトルを推測
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
      }
    }
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'ultra-camera-modal';
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
    
    // モーダルを表示
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // モーダル表示後にカメラを起動
    modal.addEventListener('shown.bs.modal', function() {
      startCamera(fileInput);
    });
    
    // モーダルが閉じられたらカメラを停止
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
  }

  // カメラを起動
  let mediaStream = null;
  let facingMode = 'environment'; // 初期値を背面カメラに設定
  
  function startCamera(fileInput) {
    log('カメラを起動します');
    
    const video = document.getElementById('camera-video');
    const captureBtn = document.getElementById('capture-btn');
    const switchBtn = document.getElementById('switch-camera-btn');
    
    if (!video) {
      log('エラー: ビデオ要素が見つかりません');
      return;
    }
    
    // カメラの設定
    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    
    // カメラ起動試行
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        log('カメラストリームを取得しました');
        mediaStream = stream;
        video.srcObject = stream;
        
        // カメラ切り替えボタンのイベント設定
        if (switchBtn) {
          switchBtn.addEventListener('click', function() {
            log('カメラ切り替えボタンがクリックされました');
            facingMode = facingMode === 'environment' ? 'user' : 'environment';
            
            // 現在のストリームを停止
            if (mediaStream) {
              mediaStream.getTracks().forEach(track => track.stop());
            }
            
            // 新しい設定でカメラを再起動
            startCamera(fileInput);
          });
        }
        
        // 撮影ボタンのイベント設定
        if (captureBtn) {
          captureBtn.addEventListener('click', function() {
            log('撮影ボタンがクリックされました');
            capturePhoto(fileInput);
          });
        }
      })
      .catch(function(err) {
        log('カメラエラー: ' + err.message);
        showCameraError();
      });
  }

  // カメラを停止
  function stopCamera() {
    log('カメラを停止します');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }

  // 写真を撮影
  function capturePhoto(fileInput) {
    log('写真を撮影します');
    
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const cameraGuide = document.getElementById('camera-guide');
    const cameraControls = document.getElementById('camera-controls');
    const previewFooter = document.getElementById('preview-footer');
    
    if (!video || !canvas || !previewContainer || !previewImage) {
      log('エラー: 必要な要素が見つかりません');
      return;
    }
    
    try {
      // キャンバスのサイズを設定
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // 映像をキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      const imageData = canvas.toDataURL('image/jpeg');
      
      // プレビュー画像を設定
      previewImage.src = imageData;
      
      // UI要素を切り替え
      previewContainer.classList.remove('d-none');
      if (cameraGuide) cameraGuide.classList.add('d-none');
      if (cameraControls) cameraControls.classList.add('d-none');
      if (previewFooter) previewFooter.classList.remove('d-none');
      
      // 撮り直しボタンのイベント設定
      const retakeBtn = document.getElementById('retake-btn');
      if (retakeBtn) {
        retakeBtn.addEventListener('click', function() {
          log('撮り直しボタンがクリックされました');
          
          // UI要素を元に戻す
          previewContainer.classList.add('d-none');
          if (cameraGuide) cameraGuide.classList.remove('d-none');
          if (cameraControls) cameraControls.classList.remove('d-none');
          if (previewFooter) previewFooter.classList.add('d-none');
        });
      }
      
      // 写真を使用ボタンのイベント設定
      const usePhotoBtn = document.getElementById('use-photo-btn');
      if (usePhotoBtn) {
        usePhotoBtn.addEventListener('click', function() {
          log('写真を使用ボタンがクリックされました');
          usePhoto(imageData, fileInput);
        });
      }
    } catch (err) {
      log('撮影エラー: ' + err.message);
    }
  }

  // 撮影した写真を使用
  function usePhoto(dataURL, fileInput) {
    log('撮影した写真を使用します');
    
    if (!fileInput) {
      log('エラー: ファイル入力が指定されていません');
      return;
    }
    
    // データURLをBlobに変換
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => {
        // ファイルオブジェクトを作成
        const filename = 'camera_photo_' + Date.now() + '.jpg';
        const file = new File([blob], filename, { type: 'image/jpeg' });
        
        // ファイル入力を更新
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        
        log('ファイル入力を更新しました: ' + fileInput.id);
        
        // モーダルを閉じる
        const modal = bootstrap.Modal.getInstance(document.getElementById('ultra-camera-modal'));
        if (modal) {
          modal.hide();
        }
      })
      .catch(err => {
        log('写真処理エラー: ' + err.message);
      });
  }

  // カメラエラー表示
  function showCameraError() {
    log('カメラエラーを表示します');
    
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
          <div class="text-center">
            <button class="btn btn-primary mx-auto" data-bs-dismiss="modal">
              閉じる
            </button>
          </div>
        </div>
      `;
    }
  }

  // カメラ用スタイルを追加
  function addCameraStyles() {
    if (document.getElementById('ultra-camera-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'ultra-camera-styles';
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
    log('カメラスタイルを追加しました');
  }
  
  // 直接アクセスするためのスクリプトを注入
  function injectDirectAccess() {
    log('直接アクセスコードを注入します');
    
    // インラインスクリプトを作成
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        console.log('直接カメラボタンアクセスコードを実行中...');
        
        // ページロード時の処理
        function setupDirectButtons() {
          // テキストを含むボタンを検索
          document.querySelectorAll('button, a, [role="button"], .btn').forEach(function(button) {
            if (button.innerText && button.innerText.includes('カメラで撮影')) {
              console.log('直接コード: カメラボタンを検出 - ' + button.innerText);
              
              // 既存のイベントを無効化してから新しいイベントを追加
              button.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('直接コード: カメラボタンがクリックされました');
                
                // カスタムイベントを発火して外部スクリプトに通知
                document.dispatchEvent(new CustomEvent('ultra-camera-click', { 
                  detail: { sourceElement: this }
                }));
                
                return false;
              };
            }
          });
        }
        
        // DOMロード時とロード後に実行
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setupDirectButtons, 500);
          });
        } else {
          setTimeout(setupDirectButtons, 500);
        }
        
        // 一定間隔でも実行（DOM操作が非同期で行われる場合に対応）
        setInterval(setupDirectButtons, 3000);
      })();
    `;
    
    document.head.appendChild(script);
    
    // カスタムイベントをリッスン
    document.addEventListener('ultra-camera-click', function(e) {
      log('カスタムイベント「ultra-camera-click」を受信しました');
      if (e.detail && e.detail.sourceElement) {
        const fileInput = findNearestFileInput(e.detail.sourceElement);
        if (fileInput) {
          openCamera(fileInput);
        } else {
          log('警告: カスタムイベント用のファイル入力が見つかりません');
        }
      }
    });
  }

})();