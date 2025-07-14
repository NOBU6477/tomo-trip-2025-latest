/**
 * カメラボタンの直接制御スクリプト
 * document-cameraクラスを持つボタンに直接クリックイベントを設定する
 */
(function() {
  // 初期化関数
  function initCameraButtons() {
    console.log('カメラボタン直接制御: 初期化中...');
    
    // DOMが完全に読み込まれたら実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupCameraButtons);
    } else {
      // すぐに実行
      setupCameraButtons();
    }
    
    // DOM変更を監視
    setupMutationObserver();
    
    // 念のため定期的に実行
    setInterval(setupCameraButtons, 2000);
  }
  
  // カメラボタンのセットアップ
  function setupCameraButtons() {
    console.log('カメラボタン直接制御: ボタンを検索中...');
    
    // document-cameraクラスを持つすべてのボタンを検索
    const cameraButtons = document.querySelectorAll('.document-camera');
    console.log(`カメラボタン直接制御: ${cameraButtons.length}個のボタンを検出`);
    
    cameraButtons.forEach((button, index) => {
      // 処理済みかチェック
      if (button.getAttribute('data-camera-processed')) {
        return;
      }
      
      console.log(`カメラボタン直接制御: ボタン${index + 1}を処理中`);
      
      // 処理済みとしてマーク
      button.setAttribute('data-camera-processed', 'true');
      
      // 関連するファイル入力を探す
      const fileInput = findRelatedFileInput(button);
      
      if (!fileInput) {
        console.error('カメラボタン直接制御: 関連するファイル入力が見つかりません');
        return;
      }
      
      console.log(`カメラボタン直接制御: ファイル入力を検出: ${fileInput.id || 'ID無し'}`);
      
      // クリックイベントを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('カメラボタン直接制御: ボタンがクリックされました');
        
        openCameraModal(fileInput);
      });
    });
  }
  
  // DOM変更の監視設定
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // 新しい要素が追加された場合
          setupCameraButtons();
        }
      });
    });
    
    // document全体を監視
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  
  // ボタンに関連するファイル入力要素を見つける
  function findRelatedFileInput(button) {
    // 1. 入力グループ内のファイル入力を探す（最も一般的なパターン）
    const inputGroup = button.closest('.input-group');
    if (inputGroup) {
      const fileInput = inputGroup.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 2. 親要素内のファイル入力を探す
    const parentContainer = button.closest('.form-group, .mb-3, .document-upload-section');
    if (parentContainer) {
      const fileInput = parentContainer.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 3. 祖先要素を辿ってファイル入力を探す
    let currentElement = button.parentElement;
    let searchDepth = 0;
    
    while (currentElement && searchDepth < 5) {
      const fileInput = currentElement.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      
      currentElement = currentElement.parentElement;
      searchDepth++;
    }
    
    // 4. ページ内のすべてのファイル入力から最も近いものを探す
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    if (allFileInputs.length > 0) {
      return allFileInputs[0]; // 最初の入力を返す
    }
    
    return null;
  }
  
  // グローバル変数
  let mediaStream = null;
  let currentFileInput = null;
  
  // カメラモーダルを開く
  function openCameraModal(fileInput) {
    console.log('カメラボタン直接制御: カメラモーダルを開きます');
    currentFileInput = fileInput;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('camera-button-modal');
    if (existingModal) {
      // モーダルインスタンスがあれば閉じる
      try {
        const bsModal = bootstrap.Modal.getInstance(existingModal);
        if (bsModal) bsModal.hide();
      } catch (e) {
        console.error('モーダルインスタンス取得エラー:', e);
      }
      
      existingModal.remove();
    }
    
    // カメラスタイルを追加
    addCameraStyles();
    
    // モーダルのタイトルとガイドテキストを決定
    let title = 'カメラで撮影';
    let guideText = '書類全体がフレーム内に収まるようにしてください';
    
    // ファイル入力のIDから文書タイプを推測
    const inputId = fileInput.id || '';
    
    if (inputId.includes('license')) {
      if (inputId.includes('back')) {
        title = '運転免許証(裏面)を撮影';
      } else {
        title = '運転免許証(表面)を撮影';
      }
    } else if (inputId.includes('passport')) {
      title = 'パスポートを撮影';
    } else if (inputId.includes('idcard')) {
      if (inputId.includes('back')) {
        title = 'マイナンバーカード(裏面)を撮影';
      } else {
        title = 'マイナンバーカード(表面)を撮影';
      }
    } else if (inputId.includes('residence')) {
      if (inputId.includes('back')) {
        title = '在留カード(裏面)を撮影';
      } else {
        title = '在留カード(表面)を撮影';
      }
    } else if (inputId.includes('photo')) {
      title = '証明写真を撮影';
      guideText = 'あなたの顔がフレーム内に収まるようにしてください';
    }
    
    // モーダルHTML
    const modalHtml = `
      <div class="modal fade" id="camera-button-modal" tabindex="-1" aria-hidden="true">
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
      </div>
    `;
    
    // モーダルをDOMに追加
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // モーダルを初期化して表示
    try {
      const modal = new bootstrap.Modal(document.getElementById('camera-button-modal'));
      
      // モーダルイベント
      const modalElement = document.getElementById('camera-button-modal');
      
      modalElement.addEventListener('shown.bs.modal', function() {
        startCamera();
      });
      
      modalElement.addEventListener('hidden.bs.modal', function() {
        stopCamera();
      });
      
      // モーダル表示
      modal.show();
    } catch (err) {
      console.error('モーダル初期化エラー:', err);
      
      // エラー時はインラインJSでモーダルを制御
      injectInlineBootstrapCode();
    }
  }
  
  // インラインBootstrapコード注入
  function injectInlineBootstrapCode() {
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        // モーダルを手動で表示
        const modalElement = document.getElementById('camera-button-modal');
        if (modalElement) {
          modalElement.classList.add('show');
          modalElement.style.display = 'block';
          
          // 背景オーバーレイを追加
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
          
          // body要素にクラスを追加
          document.body.classList.add('modal-open');
          
          // カスタムイベント発火
          document.dispatchEvent(new CustomEvent('manual-modal-shown'));
          
          // 閉じるボタンをセットアップ
          const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
          closeButtons.forEach(button => {
            button.addEventListener('click', function() {
              modalElement.classList.remove('show');
              modalElement.style.display = 'none';
              
              // 背景を削除
              const backdrops = document.querySelectorAll('.modal-backdrop');
              backdrops.forEach(el => el.remove());
              
              // bodyクラスを削除
              document.body.classList.remove('modal-open');
              
              // カスタムイベント発火
              document.dispatchEvent(new CustomEvent('manual-modal-hidden'));
            });
          });
        }
      })();
    `;
    
    document.head.appendChild(script);
    
    // カスタムイベントリスナー
    document.addEventListener('manual-modal-shown', function() {
      startCamera();
    });
    
    document.addEventListener('manual-modal-hidden', function() {
      stopCamera();
    });
  }
  
  // カメラを起動
  function startCamera() {
    console.log('カメラボタン直接制御: カメラを起動します');
    
    const video = document.getElementById('camera-video');
    const captureBtn = document.getElementById('capture-btn');
    const switchBtn = document.getElementById('switch-camera-btn');
    
    if (!video || !captureBtn) {
      console.error('必要な要素が見つかりません');
      return;
    }
    
    // カメラ設定
    const constraints = {
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
        console.log('カメラストリームを取得しました');
        mediaStream = stream;
        video.srcObject = stream;
        
        // カメラ切り替えボタン
        if (switchBtn) {
          switchBtn.addEventListener('click', function() {
            const currentFacingMode = constraints.video.facingMode;
            const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
            
            // 現在のストリームを停止
            if (mediaStream) {
              mediaStream.getTracks().forEach(track => track.stop());
            }
            
            // 新しい設定でカメラを再起動
            const newConstraints = {
              video: {
                facingMode: newFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            };
            
            navigator.mediaDevices.getUserMedia(newConstraints)
              .then(function(newStream) {
                mediaStream = newStream;
                video.srcObject = newStream;
                constraints.video.facingMode = newFacingMode;
              })
              .catch(function(err) {
                console.error('カメラ切り替えエラー:', err);
              });
          });
        }
        
        // 撮影ボタン
        captureBtn.addEventListener('click', function() {
          capturePhoto();
        });
      })
      .catch(function(err) {
        console.error('カメラエラー:', err);
        showCameraError();
      });
  }
  
  // カメラを停止
  function stopCamera() {
    console.log('カメラボタン直接制御: カメラを停止します');
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  // 写真を撮影
  function capturePhoto() {
    console.log('カメラボタン直接制御: 写真を撮影します');
    
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const cameraGuide = document.getElementById('camera-guide');
    const cameraControls = document.getElementById('camera-controls');
    const previewFooter = document.getElementById('preview-footer');
    
    if (!video || !canvas || !previewContainer || !previewImage) {
      console.error('必要な要素が見つかりません');
      return;
    }
    
    // キャンバスサイズ設定
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
      retakeBtn.addEventListener('click', function() {
        // UIを撮影モードに戻す
        previewContainer.classList.add('d-none');
        if (cameraGuide) cameraGuide.classList.remove('d-none');
        if (cameraControls) cameraControls.classList.remove('d-none');
        if (previewFooter) previewFooter.classList.add('d-none');
      });
    }
    
    // 写真使用ボタン
    const usePhotoBtn = document.getElementById('use-photo-btn');
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function() {
        usePhoto(imageData);
      });
    }
  }
  
  // 撮影した写真を使用
  function usePhoto(dataURL) {
    console.log('カメラボタン直接制御: 写真を使用します');
    
    if (!currentFileInput) {
      console.error('ファイル入力が指定されていません');
      return;
    }
    
    // Blob変換
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => {
        // ファイル名生成
        const filename = 'camera_' + Date.now() + '.jpg';
        const file = new File([blob], filename, { type: 'image/jpeg' });
        
        try {
          // ファイル入力更新
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          currentFileInput.files = dataTransfer.files;
          
          // 変更イベント発火
          const event = new Event('change', { bubbles: true });
          currentFileInput.dispatchEvent(event);
          
          // モーダルを閉じる
          try {
            const modal = bootstrap.Modal.getInstance(document.getElementById('camera-button-modal'));
            if (modal) modal.hide();
          } catch (err) {
            console.log('モーダル取得エラー:', err);
            
            // 手動でモーダルを閉じる
            const modalElement = document.getElementById('camera-button-modal');
            if (modalElement) {
              modalElement.classList.remove('show');
              modalElement.style.display = 'none';
              
              // 背景を削除
              const backdrops = document.querySelectorAll('.modal-backdrop');
              backdrops.forEach(el => el.remove());
              
              // bodyクラスを削除
              document.body.classList.remove('modal-open');
            }
          }
          
          // プレビュー更新
          updatePreview(currentFileInput, dataURL);
        } catch (err) {
          console.error('ファイル設定エラー:', err);
          alert('写真の設定に失敗しました');
        }
      })
      .catch(err => {
        console.error('Blob変換エラー:', err);
      });
  }
  
  // カメラエラー表示
  function showCameraError() {
    console.log('カメラボタン直接制御: エラーを表示します');
    
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
    console.log('カメラボタン直接制御: プレビューを更新します');
    
    // 親コンテナを探す
    const container = fileInput.closest('.form-group, .mb-3, .document-upload-section, .card');
    if (!container) return;
    
    // プレビュー要素を探す
    let previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview-img');
    
    // プレビューがなければ作成
    if (!previewImg) {
      // プレビューコンテナを探す
      let previewContainer = container.querySelector('.preview-container');
      
      // コンテナがなければ作成
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-2';
        container.appendChild(previewContainer);
      }
      
      // 画像要素を作成
      previewImg = document.createElement('img');
      previewImg.className = 'preview-img img-fluid mt-2';
      previewImg.style.maxHeight = '200px';
      previewImg.alt = 'プレビュー';
      previewContainer.appendChild(previewImg);
    }
    
    // 画像を設定
    previewImg.src = dataURL;
    previewImg.classList.remove('d-none');
    previewImg.style.display = 'block';
    
    // プレースホルダを非表示
    const placeholder = container.querySelector('.placeholder, .upload-placeholder, [class*="placeholder"]');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    // 削除ボタン表示/作成
    let removeBtn = container.querySelector('.remove-btn, .delete-btn, button[id*="remove"], button[id*="delete"]');
    
    // 削除ボタンがなければ作成
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
        previewImg.style.display = 'none';
        
        // プレースホルダ表示
        if (placeholder) {
          placeholder.style.display = '';
        }
        
        // 削除ボタン非表示
        this.style.display = 'none';
      });
    }
    
    // 削除ボタン表示
    removeBtn.classList.remove('d-none');
    removeBtn.style.display = '';
    
    // 成功メッセージ
    const existingSuccess = container.querySelector('.alert-success');
    if (existingSuccess) existingSuccess.remove();
    
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success mt-2 small';
    successMsg.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
    container.appendChild(successMsg);
  }
  
  // カメラスタイル追加
  function addCameraStyles() {
    if (document.getElementById('camera-button-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'camera-button-styles';
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
  
  // インライン初期化コード注入
  function injectInlineInitCode() {
    // ブラウザ内で直接実行されるコード
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        console.log('インラインコード: 直接カメラボタンイベント設定開始');
        
        // カメラボタンを処理する関数
        function setupDirectCameraButtons() {
          const buttons = document.querySelectorAll('.document-camera');
          console.log('インラインコード: ' + buttons.length + '個のカメラボタンを検出');
          
          buttons.forEach(function(button) {
            if (button.getAttribute('data-inline-processed')) return;
            
            button.setAttribute('data-inline-processed', 'true');
            console.log('インラインコード: カメラボタンを処理:', button.innerHTML.substring(0, 50));
            
            // オリジナルの onClick を保存
            const originalOnClick = button.onclick;
            
            // クリックイベントを書き換え
            button.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log('インラインコード: カメラボタンがクリックされました');
              
              // カスタムイベントを発火
              document.dispatchEvent(new CustomEvent('camera-button-clicked', {
                detail: { button: this }
              }));
              
              // オリジナルのハンドラを呼ばないように
              return false;
            };
          });
        }
        
        // ページロード時に実行
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setupDirectCameraButtons, 500);
          });
        } else {
          setTimeout(setupDirectCameraButtons, 500);
        }
        
        // 定期的に実行して確実に適用
        setInterval(setupDirectCameraButtons, 2000);
      })();
    `;
    
    document.head.appendChild(script);
    
    // カスタムイベントをリッスン
    document.addEventListener('camera-button-clicked', function(e) {
      console.log('カメラボタン直接制御: カスタムイベントを受信');
      
      if (e.detail && e.detail.button) {
        const fileInput = findRelatedFileInput(e.detail.button);
        if (fileInput) {
          openCameraModal(fileInput);
        }
      }
    });
  }
  
  // 初期化を実行
  initCameraButtons();
  
  // インラインコードも注入して確実にカバー
  injectInlineInitCode();
})();