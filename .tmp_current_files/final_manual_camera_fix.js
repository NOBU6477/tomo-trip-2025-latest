/**
 * 完全手動のカメラ機能修正スクリプト
 * 既存のコードを全く使わず、直接HTMLを操作して確実に動作させる
 */
(function() {
  console.log('手動カメラ修正: 初期化中...');
  
  // ページ読み込み直後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManualFix);
  } else {
    initManualFix();
  }
  
  // 定期的に実行して確実に適用
  setInterval(initManualFix, 2000);
  
  // DOM変更監視
  const observer = new MutationObserver(function(mutations) {
    let shouldInit = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // セレクト要素が追加されたかチェック
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'SELECT' || 
                node.classList && (node.classList.contains('modal') || node.classList.contains('modal-content'))) {
              shouldInit = true;
              break;
            }
            
            // 子孫にセレクト要素があるかチェック
            if (node.querySelectorAll) {
              const selects = node.querySelectorAll('select');
              if (selects.length > 0) {
                shouldInit = true;
                break;
              }
            }
          }
        }
      }
    });
    
    if (shouldInit) {
      console.log('手動カメラ修正: DOM変更を検出。再初期化します。');
      setTimeout(initManualFix, 300);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 手動修正の初期化
  function initManualFix() {
    console.log('手動カメラ修正: 初期化処理実行');
    
    // スタイルを追加
    addStyles();
    
    // 書類タイプセレクタを探して処理
    handleDocumentSelectors();
    
    // カメラボタンを探して処理
    handleCameraButtons();
    
    // 画像プレビューの修正
    fixBlackImages();
  }
  
  // スタイルを追加
  function addStyles() {
    if (document.getElementById('manual-camera-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'manual-camera-styles';
    style.textContent = `
      /* カメラモーダル用スタイル */
      .manual-camera-container {
        position: relative;
        background: #000;
        min-height: 300px;
        max-height: 70vh;
        overflow: hidden;
      }
      
      .manual-camera-video {
        width: 100%;
        height: auto;
        min-height: 300px;
        max-height: 70vh;
        object-fit: cover;
      }
      
      .guide-frame {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 70%;
        border: 2px solid rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        pointer-events: none;
      }
      
      .guide-text {
        position: absolute;
        bottom: -30px;
        left: 0;
        width: 100%;
        color: white;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        padding: 5px;
        border-radius: 15px;
      }
      
      .camera-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
      }
      
      .camera-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
      }
      
      .capture-btn {
        width: 70px;
        height: 70px;
        border: 3px solid white;
      }
      
      .capture-circle {
        width: 54px;
        height: 54px;
        background: white;
        border-radius: 50%;
      }
      
      #preview-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #preview-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      
      /* カスタムアップロードエリア */
      .custom-upload-area {
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: #f8f9fa;
      }
      
      .preview-container img {
        max-height: 200px;
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        margin-top: 0.5rem;
      }
      
      /* カスタムボタンスタイル */
      .custom-camera-btn {
        display: inline-block;
        color: #fff;
        background-color: #0d6efd;
        border: 1px solid #0d6efd;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        transition: all 0.15s ease-in-out;
      }
      
      .custom-camera-btn:hover {
        background-color: #0b5ed7;
        border-color: #0a58ca;
      }
      
      .custom-camera-btn i {
        margin-right: 0.25rem;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // 書類タイプセレクタの処理
  function handleDocumentSelectors() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
      // マイナンバーカードのオプションがあるかチェック
      const hasMyNumberOption = Array.from(select.options || []).some(option => 
        option.textContent.includes('マイナンバー') || option.value === 'idCard'
      );
      
      if (!hasMyNumberOption) return;
      
      // すでに処理済みかチェック
      if (select.getAttribute('data-manual-processed')) return;
      
      // 処理済みとしてマーク
      select.setAttribute('data-manual-processed', 'true');
      
      // 現在の選択がマイナンバーカードかチェック
      if ((select.value === 'idCard' || 
           (select.selectedOptions && select.selectedOptions[0] && 
            select.selectedOptions[0].textContent.includes('マイナンバー')))) {
        // マイナンバーカードのアップロードエリアを追加
        setTimeout(() => {
          createMyNumberCardUploadArea(select);
        }, 100);
      }
      
      // 変更イベントリスナーを追加
      select.addEventListener('change', function() {
        if (this.value === 'idCard' || 
            (this.selectedOptions && this.selectedOptions[0] && 
             this.selectedOptions[0].textContent.includes('マイナンバー'))) {
          createMyNumberCardUploadArea(this);
        }
      });
    });
  }
  
  // マイナンバーカードのアップロードエリアを作成
  function createMyNumberCardUploadArea(select) {
    console.log('手動カメラ修正: マイナンバーカードのアップロードエリアを作成');
    
    // 親コンテナを探す
    const container = select.closest('.modal-body, .modal-content, form, .container');
    if (!container) return;
    
    // すでに作成済みかチェック
    if (container.querySelector('#manual-mynumber-section')) return;
    
    // 挿入位置を決定（セレクト要素の後）
    let insertPoint = select.parentElement;
    while (insertPoint && 
           !insertPoint.classList.contains('form-group') && 
           !insertPoint.classList.contains('mb-3') &&
           !insertPoint.classList.contains('row')) {
      insertPoint = insertPoint.parentElement;
    }
    
    if (!insertPoint) {
      // 挿入位置が見つからなければセレクト直後
      insertPoint = select;
    }
    
    // カスタムアップロードエリアのHTML
    const customAreaHTML = `
      <div id="manual-mynumber-section" class="custom-upload-area mt-4">
        <h5 class="mb-3">マイナンバーカード/運転経歴証明書アップロード</h5>
        <p class="text-muted small mb-3">両面をアップロードしてください</p>
        
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="manual-mynumber-front" class="form-label">マイナンバーカード（表面）</label>
              <input type="file" class="form-control" id="manual-mynumber-front" accept="image/*">
              <div class="d-grid gap-2 mt-2">
                <button type="button" class="custom-camera-btn" onclick="window.manualCameraFunctions.openCamera('manual-mynumber-front', '表面')">
                  <i class="bi bi-camera"></i>カメラで撮影
                </button>
              </div>
              <div class="preview-container mt-2"></div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="manual-mynumber-back" class="form-label">マイナンバーカード（裏面）</label>
              <input type="file" class="form-control" id="manual-mynumber-back" accept="image/*">
              <div class="d-grid gap-2 mt-2">
                <button type="button" class="custom-camera-btn" onclick="window.manualCameraFunctions.openCamera('manual-mynumber-back', '裏面')">
                  <i class="bi bi-camera"></i>カメラで撮影
                </button>
              </div>
              <div class="preview-container mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに挿入
    const customAreaElement = document.createElement('div');
    customAreaElement.innerHTML = customAreaHTML;
    
    // 要素を挿入
    insertPoint.parentNode.insertBefore(customAreaElement, insertPoint.nextSibling);
    
    // ファイル入力にイベントリスナーを設定
    const frontInput = document.getElementById('manual-mynumber-front');
    const backInput = document.getElementById('manual-mynumber-back');
    
    if (frontInput) {
      frontInput.addEventListener('change', function() {
        handleFileInputChange(this);
      });
    }
    
    if (backInput) {
      backInput.addEventListener('change', function() {
        handleFileInputChange(this);
      });
    }
  }
  
  // 運転免許証のアップロードエリアを作成
  function createDriverLicenseUploadArea(select) {
    console.log('手動カメラ修正: 運転免許証のアップロードエリアを作成');
    
    // 親コンテナを探す
    const container = select.closest('.modal-body, .modal-content, form, .container');
    if (!container) return;
    
    // すでに作成済みかチェック
    if (container.querySelector('#manual-license-section')) return;
    
    // 挿入位置を決定（セレクト要素の後）
    let insertPoint = select.parentElement;
    while (insertPoint && 
           !insertPoint.classList.contains('form-group') && 
           !insertPoint.classList.contains('mb-3') &&
           !insertPoint.classList.contains('row')) {
      insertPoint = insertPoint.parentElement;
    }
    
    if (!insertPoint) {
      // 挿入位置が見つからなければセレクト直後
      insertPoint = select;
    }
    
    // カスタムアップロードエリアのHTML
    const customAreaHTML = `
      <div id="manual-license-section" class="custom-upload-area mt-4">
        <h5 class="mb-3">運転免許証アップロード</h5>
        <p class="text-muted small mb-3">両面をアップロードしてください</p>
        
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="manual-license-front" class="form-label">運転免許証（表面）</label>
              <input type="file" class="form-control" id="manual-license-front" accept="image/*">
              <div class="d-grid gap-2 mt-2">
                <button type="button" class="custom-camera-btn" onclick="window.manualCameraFunctions.openCamera('manual-license-front', '表面')">
                  <i class="bi bi-camera"></i>カメラで撮影
                </button>
              </div>
              <div class="preview-container mt-2"></div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="manual-license-back" class="form-label">運転免許証（裏面）</label>
              <input type="file" class="form-control" id="manual-license-back" accept="image/*">
              <div class="d-grid gap-2 mt-2">
                <button type="button" class="custom-camera-btn" onclick="window.manualCameraFunctions.openCamera('manual-license-back', '裏面')">
                  <i class="bi bi-camera"></i>カメラで撮影
                </button>
              </div>
              <div class="preview-container mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに挿入
    const customAreaElement = document.createElement('div');
    customAreaElement.innerHTML = customAreaHTML;
    
    // 要素を挿入
    insertPoint.parentNode.insertBefore(customAreaElement, insertPoint.nextSibling);
    
    // ファイル入力にイベントリスナーを設定
    const frontInput = document.getElementById('manual-license-front');
    const backInput = document.getElementById('manual-license-back');
    
    if (frontInput) {
      frontInput.addEventListener('change', function() {
        handleFileInputChange(this);
      });
    }
    
    if (backInput) {
      backInput.addEventListener('change', function() {
        handleFileInputChange(this);
      });
    }
  }
  
  // カメラボタンを処理
  function handleCameraButtons() {
    // カメラで撮影ボタン
    const cameraButtons = Array.from(document.querySelectorAll('button, a, .btn')).filter(el => 
      el.textContent && el.textContent.includes('カメラで撮影')
    );
    
    cameraButtons.forEach(button => {
      // 処理済みかチェック
      if (button.getAttribute('data-manual-camera-processed')) return;
      
      // 処理済みとしてマーク
      button.setAttribute('data-manual-camera-processed', 'true');
      
      // クリックイベント設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 親要素から種類を判断
        const parentText = this.parentElement.textContent || '';
        let targetId;
        
        if (parentText.includes('運転免許証')) {
          if (parentText.includes('表面') || parentText.includes('表')) {
            targetId = 'manual-license-front';
          } else if (parentText.includes('裏面') || parentText.includes('裏')) {
            targetId = 'manual-license-back';
          } else {
            targetId = 'manual-license-front';
          }
        } else if (parentText.includes('マイナンバー')) {
          if (parentText.includes('表面') || parentText.includes('表')) {
            targetId = 'manual-mynumber-front';
          } else if (parentText.includes('裏面') || parentText.includes('裏')) {
            targetId = 'manual-mynumber-back';
          } else {
            targetId = 'manual-mynumber-front';
          }
        } else {
          // 明確に判断できない場合は、コンテナ内の最初のfile入力を使用
          const container = this.closest('.modal-body, .card-body, form');
          if (container) {
            const fileInput = container.querySelector('input[type="file"]');
            if (fileInput) {
              targetId = fileInput.id;
            }
          }
        }
        
        if (targetId) {
          // 対応するカスタム入力がなければ作成
          if (!document.getElementById(targetId)) {
            // ここで動的に作成...（省略）
          }
          
          // カメラモーダルを開く
          openCameraModal(targetId);
        }
      });
    });
    
    // document-cameraクラスのボタン
    const documentCameraButtons = document.querySelectorAll('.document-camera');
    
    documentCameraButtons.forEach(button => {
      // 処理済みかチェック
      if (button.getAttribute('data-manual-camera-processed')) return;
      
      // 処理済みとしてマーク
      button.setAttribute('data-manual-camera-processed', 'true');
      
      // クリックイベント設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 関連するファイル入力を探す
        const inputGroup = this.closest('.input-group');
        if (inputGroup) {
          const fileInput = inputGroup.querySelector('input[type="file"]');
          if (fileInput) {
            const targetId = fileInput.id;
            
            // カメラモーダルを開く
            openCameraModal(targetId);
          }
        }
      });
    });
    
    // カスタムカメラボタン
    const customCameraButtons = document.querySelectorAll('.custom-camera-btn');
    
    customCameraButtons.forEach(button => {
      // すでにonclickが設定されている場合はスキップ
      if (button.getAttribute('onclick')) return;
      
      // クリックイベント設定
      button.addEventListener('click', function() {
        // 関連するファイル入力を探す
        const container = this.closest('.mb-3');
        if (container) {
          const fileInput = container.querySelector('input[type="file"]');
          if (fileInput) {
            const targetId = fileInput.id;
            
            // カメラモーダルを開く
            openCameraModal(targetId);
          }
        }
      });
    });
  }
  
  // 真っ黒画像の修正
  function fixBlackImages() {
    // プレビュー画像を全て確認
    const previewImages = document.querySelectorAll('img.preview-img, .preview-container img');
    
    previewImages.forEach(img => {
      // 画像読み込みエラーが発生したらデフォルト画像に置き換え
      if (!img.getAttribute('data-error-listener')) {
        img.setAttribute('data-error-listener', 'true');
        
        img.addEventListener('error', function() {
          console.error('手動カメラ修正: 画像読み込みエラー', this.src.slice(0, 30) + '...');
          this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDEzLjUgMTcuNSAxMSAxMSAxIDIxIj48L3BvbHlsaW5lPjwvc3ZnPg==';
          this.style.maxWidth = '100px';
          this.style.border = '1px solid #dc3545';
          this.style.borderRadius = '4px';
          this.style.padding = '10px';
          this.style.background = '#f8d7da';
        });
      }
      
      // 既にSRCが設定されていて、base64データを含む場合はチェック
      if (img.src && img.src.startsWith('data:image/') && img.complete) {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          console.log('手動カメラ修正: 無効な画像を検出');
          img.dispatchEvent(new Event('error'));
        }
      }
    });
  }
  
  // ファイル入力変更イベントのハンドラ
  function handleFileInputChange(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    
    // FileReaderでプレビュー表示
    const reader = new FileReader();
    
    reader.onload = function(e) {
      updatePreview(input, e.target.result);
    };
    
    reader.readAsDataURL(file);
  }
  
  // プレビュー更新
  function updatePreview(input, dataURL) {
    // 親コンテナを探す
    const container = input.closest('.mb-3, .form-group');
    if (!container) return;
    
    // プレビューコンテナを探す
    let previewContainer = container.querySelector('.preview-container');
    
    // プレビュー要素を探す
    let previewImg = previewContainer ? previewContainer.querySelector('img') : null;
    
    // プレビュー要素がなければ作成
    if (!previewImg) {
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-2';
        container.appendChild(previewContainer);
      }
      
      previewImg = document.createElement('img');
      previewImg.className = 'img-fluid';
      previewImg.style.maxHeight = '200px';
      previewContainer.appendChild(previewImg);
    }
    
    // 画像を設定
    previewImg.src = dataURL;
    previewImg.style.display = 'block';
    
    // 削除ボタンがあれば表示、なければ作成
    let deleteBtn = previewContainer.querySelector('.btn-danger');
    
    if (!deleteBtn) {
      deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-danger btn-sm mt-2';
      deleteBtn.innerHTML = '<i class="bi bi-trash"></i> 削除';
      
      deleteBtn.addEventListener('click', function() {
        // ファイル入力をリセット
        input.value = '';
        
        // プレビューを非表示
        previewImg.src = '';
        previewImg.style.display = 'none';
        
        // 削除ボタンを非表示
        this.style.display = 'none';
      });
      
      previewContainer.appendChild(deleteBtn);
    }
    
    deleteBtn.style.display = 'inline-block';
    
    // 成功メッセージ
    if (!previewContainer.querySelector('.alert-success')) {
      const successMsg = document.createElement('div');
      successMsg.className = 'alert alert-success mt-2 small';
      successMsg.innerHTML = '<i class="bi bi-check-circle"></i> 正常にアップロードされました';
      previewContainer.appendChild(successMsg);
      
      // 数秒後に非表示
      setTimeout(() => {
        if (successMsg.parentNode) {
          successMsg.parentNode.removeChild(successMsg);
        }
      }, 3000);
    }
  }
  
  // グローバル変数
  let currentStreamActive = false;
  let currentStreamFacingMode = 'environment';
  
  // カメラモーダルを開く
  function openCameraModal(inputId, side = '') {
    console.log('手動カメラ修正: カメラモーダルを開きます', inputId);
    
    // 対象の入力要素を取得
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.error('手動カメラ修正: ターゲット入力が見つかりません', inputId);
      return;
    }
    
    // 既存のモーダルを削除
    removeExistingModal();
    
    // タイトルを決定
    let title = 'カメラで撮影';
    
    // 入力IDに基づいてカスタマイズ
    if (inputId.includes('license')) {
      title = `運転免許証${side ? `(${side})` : ''}を撮影`;
    } else if (inputId.includes('mynumber')) {
      title = `マイナンバーカード${side ? `(${side})` : ''}を撮影`;
    } else if (inputId.includes('passport')) {
      title = 'パスポートを撮影';
    }
    
    // モーダルHTML
    const modalHTML = `
      <div class="modal fade" id="manual-camera-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="bi bi-camera me-2"></i>${title}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-0">
              <div class="manual-camera-container">
                <video id="manual-camera-video" class="manual-camera-video" autoplay playsinline></video>
                <canvas id="manual-camera-canvas" style="display:none;"></canvas>
                
                <div class="guide-frame">
                  <div class="guide-text">書類全体がフレーム内に収まるようにしてください</div>
                </div>
                
                <div class="camera-controls">
                  <div class="camera-btn" id="manual-switch-camera">
                    <i class="bi bi-arrow-repeat"></i>
                  </div>
                  <div class="camera-btn capture-btn" id="manual-capture-btn">
                    <div class="capture-circle"></div>
                  </div>
                  <div class="camera-btn" id="manual-close-camera" data-bs-dismiss="modal">
                    <i class="bi bi-x"></i>
                  </div>
                </div>
                
                <div id="preview-container" style="display:none;">
                  <img id="preview-image" src="" alt="撮影画像">
                </div>
              </div>
            </div>
            <div class="modal-footer" id="preview-footer" style="display:none;">
              <button type="button" class="btn btn-secondary" id="retake-btn">
                <i class="bi bi-arrow-counterclockwise me-1"></i>撮り直す
              </button>
              <button type="button" class="btn btn-primary" id="use-photo-btn">
                <i class="bi bi-check me-1"></i>この写真を使用
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルを挿入
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // モーダルを表示
    const modalElement = document.getElementById('manual-camera-modal');
    let bootstrapModal;
    
    try {
      bootstrapModal = new bootstrap.Modal(modalElement);
      
      // モーダル表示・終了イベント
      modalElement.addEventListener('shown.bs.modal', function() {
        startCamera(inputId);
      });
      
      modalElement.addEventListener('hidden.bs.modal', function() {
        stopCamera();
      });
      
      bootstrapModal.show();
    } catch (err) {
      console.error('手動カメラ修正: モーダル初期化エラー', err);
      
      // Bootstrapが使えない場合は手動で表示
      showModalManually(modalElement, inputId);
    }
    
    // ボタンイベントを設定
    setupCameraModalEvents(inputId);
  }
  
  // 既存のモーダルを削除
  function removeExistingModal() {
    const existingModal = document.getElementById('manual-camera-modal');
    if (existingModal) {
      try {
        const bootstrapModal = bootstrap.Modal.getInstance(existingModal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      } catch (err) {
        console.error('手動カメラ修正: モーダルインスタンス取得エラー', err);
      }
      
      // モーダル要素の削除
      existingModal.remove();
      
      // モーダル背景の削除
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }
    
    // モーダル関連のクラスを削除
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
  // 手動でモーダルを表示
  function showModalManually(modalElement, inputId) {
    if (!modalElement) return;
    
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
    
    // 背景を追加
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    
    // bodyにクラスを追加
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
    
    // 閉じるボタンのイベント
    const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        modalElement.style.display = 'none';
        modalElement.classList.remove('show');
        
        // 背景を削除
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        
        // bodyからクラスを削除
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // カメラ停止
        stopCamera();
      });
    });
    
    // カメラを起動
    startCamera(inputId);
  }
  
  // カメラモーダルのイベント設定
  function setupCameraModalEvents(inputId) {
    // 撮影ボタン
    const captureBtn = document.getElementById('manual-capture-btn');
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        capturePhoto(inputId);
      });
    }
    
    // カメラ切り替えボタン
    const switchBtn = document.getElementById('manual-switch-camera');
    if (switchBtn) {
      switchBtn.addEventListener('click', function() {
        switchCamera();
      });
    }
    
    // 撮り直しボタン
    const retakeBtn = document.getElementById('retake-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function() {
        // プレビューを非表示
        const previewContainer = document.getElementById('preview-container');
        const previewFooter = document.getElementById('preview-footer');
        
        if (previewContainer) previewContainer.style.display = 'none';
        if (previewFooter) previewFooter.style.display = 'none';
        
        // カメラコントロールを表示
        const videoElement = document.getElementById('manual-camera-video');
        const cameraControls = document.querySelector('.camera-controls');
        const guideFrame = document.querySelector('.guide-frame');
        
        if (videoElement) videoElement.style.display = 'block';
        if (cameraControls) cameraControls.style.display = 'flex';
        if (guideFrame) guideFrame.style.display = 'block';
      });
    }
    
    // 写真使用ボタン
    const usePhotoBtn = document.getElementById('use-photo-btn');
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function() {
        usePhoto(inputId);
      });
    }
  }
  
  // カメラを起動
  function startCamera(inputId) {
    console.log('手動カメラ修正: カメラを起動します');
    
    const videoElement = document.getElementById('manual-camera-video');
    if (!videoElement) return;
    
    // カメラ設定
    const constraints = {
      video: {
        facingMode: currentStreamFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    
    // すでにストリームがアクティブなら停止
    if (currentStreamActive) {
      stopCamera();
    }
    
    // カメラアクセス
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        videoElement.srcObject = stream;
        currentStreamActive = true;
        
        // 少し時間をおいてボタンを再設定
        setTimeout(() => {
          setupCameraModalEvents(inputId);
        }, 100);
      })
      .catch(err => {
        console.error('手動カメラ修正: カメラアクセスエラー', err);
        showCameraError();
      });
  }
  
  // カメラを切り替え
  function switchCamera() {
    console.log('手動カメラ修正: カメラを切り替えます');
    
    // 現在のモードを反転
    currentStreamFacingMode = currentStreamFacingMode === 'environment' ? 'user' : 'environment';
    
    const videoElement = document.getElementById('manual-camera-video');
    if (!videoElement) return;
    
    // 現在のストリームを停止
    if (videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // 新しい設定でカメラを再起動
    const constraints = {
      video: {
        facingMode: currentStreamFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        videoElement.srcObject = stream;
      })
      .catch(err => {
        console.error('手動カメラ修正: カメラ切り替えエラー', err);
      });
  }
  
  // カメラを停止
  function stopCamera() {
    console.log('手動カメラ修正: カメラを停止します');
    
    const videoElement = document.getElementById('manual-camera-video');
    if (videoElement && videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
    }
    
    currentStreamActive = false;
  }
  
  // 写真を撮影
  function capturePhoto(inputId) {
    console.log('手動カメラ修正: 写真を撮影します');
    
    const videoElement = document.getElementById('manual-camera-video');
    const canvasElement = document.getElementById('manual-camera-canvas');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const previewFooter = document.getElementById('preview-footer');
    
    if (!videoElement || !canvasElement || !previewContainer || !previewImage) {
      console.error('手動カメラ修正: 必要な要素が見つかりません');
      return;
    }
    
    try {
      // ビデオからサイズを取得
      const videoWidth = videoElement.videoWidth || 640;
      const videoHeight = videoElement.videoHeight || 480;
      
      // キャンバスサイズを設定
      canvasElement.width = videoWidth;
      canvasElement.height = videoHeight;
      
      // 真っ黒画像問題対策として背景を白で塗りつぶし
      const context = canvasElement.getContext('2d');
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvasElement.width, canvasElement.height);
      
      // 映像を描画
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      
      // プレビュー表示
      previewImage.src = canvasElement.toDataURL('image/jpeg', 0.9);
      previewContainer.style.display = 'block';
      previewFooter.style.display = 'flex';
      
      // カメラコントロールを非表示
      videoElement.style.display = 'none';
      document.querySelector('.camera-controls').style.display = 'none';
      document.querySelector('.guide-frame').style.display = 'none';
    } catch (err) {
      console.error('手動カメラ修正: 写真撮影エラー', err);
      alert('写真の撮影に失敗しました。再試行してください。');
    }
  }
  
  // 写真を使用
  function usePhoto(inputId) {
    console.log('手動カメラ修正: 写真を使用します');
    
    const previewImage = document.getElementById('preview-image');
    if (!previewImage || !previewImage.src) {
      console.error('手動カメラ修正: プレビュー画像が見つかりません');
      return;
    }
    
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.error('手動カメラ修正: 入力要素が見つかりません', inputId);
      return;
    }
    
    try {
      // プレビュー画像をBlobに変換（真っ黒画像問題対策）
      const img = new Image();
      
      img.onload = function() {
        // キャンバスで処理
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        
        // 白背景を描画
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 画像を描画
        ctx.drawImage(img, 0, 0);
        
        // BlobとFileオブジェクトを作成
        canvas.toBlob(function(blob) {
          const fileName = 'camera_' + Date.now() + '.jpg';
          
          try {
            // データ転送オブジェクトを作成
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File([blob], fileName, { type: 'image/jpeg' }));
            
            // 入力要素にファイルを設定
            inputElement.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            inputElement.dispatchEvent(event);
            
            // モーダルを閉じる
            try {
              const modalElement = document.getElementById('manual-camera-modal');
              const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
              
              if (bootstrapModal) {
                bootstrapModal.hide();
              } else {
                // 手動でモーダルを閉じる
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
              }
            } catch (err) {
              console.error('手動カメラ修正: モーダル閉じるエラー', err);
              removeExistingModal();
            }
            
            // カメラを停止
            stopCamera();
            
            // プレビューを更新
            updatePreview(inputElement, canvas.toDataURL('image/jpeg', 0.9));
          } catch (err) {
            console.error('手動カメラ修正: ファイル設定エラー', err);
            alert('写真の設定に失敗しました。ブラウザが対応していない可能性があります。');
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = function() {
        console.error('手動カメラ修正: 画像読み込みエラー');
        alert('画像の処理に失敗しました。別の方法で試してください。');
      };
      
      img.src = previewImage.src;
    } catch (err) {
      console.error('手動カメラ修正: 写真使用エラー', err);
      alert('写真の保存に失敗しました。アップロードボタンから画像を選択してください。');
    }
  }
  
  // カメラエラー表示
  function showCameraError() {
    console.log('手動カメラ修正: カメラエラーを表示');
    
    const cameraContainer = document.querySelector('.manual-camera-container');
    if (!cameraContainer) return;
    
    cameraContainer.innerHTML = `
      <div class="p-4 text-center">
        <div class="alert alert-warning mb-3">
          <h5 class="mb-2"><i class="bi bi-exclamation-triangle me-2"></i>カメラにアクセスできません</h5>
          <p class="mb-1">以下の理由が考えられます：</p>
          <ul class="text-start small">
            <li>ブラウザの設定でカメラへのアクセスが許可されていません</li>
            <li>デバイスにカメラが接続されていません</li>
            <li>別のアプリがカメラを使用しています</li>
          </ul>
        </div>
        <div class="mt-3">
          <button class="btn btn-secondary me-2" data-bs-dismiss="modal">
            キャンセル
          </button>
          <input type="file" id="fallback-file-input" accept="image/*" style="display:none">
          <button class="btn btn-primary" id="manual-upload-btn">
            <i class="bi bi-upload me-1"></i>画像を選択
          </button>
        </div>
      </div>
    `;
    
    // ファイル選択ボタンのイベント
    const uploadBtn = document.getElementById('manual-upload-btn');
    const fileInput = document.getElementById('fallback-file-input');
    
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', function() {
        fileInput.click();
      });
      
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            // プレビュー画像を作成
            const previewImage = document.getElementById('preview-image') || 
                               document.createElement('img');
            
            if (!previewImage.id) {
              previewImage.id = 'preview-image';
              document.body.appendChild(previewImage);
            }
            
            previewImage.src = e.target.result;
            
            // 少し時間をおいてから写真を使用
            setTimeout(() => {
              usePhoto(fileInput.getAttribute('data-target-input'));
            }, 300);
          };
          
          reader.readAsDataURL(this.files[0]);
        }
      });
      
      // ターゲット入力IDを保存
      const modalElement = document.getElementById('manual-camera-modal');
      if (modalElement) {
        const inputId = modalElement.getAttribute('data-input-id');
        if (inputId) {
          fileInput.setAttribute('data-target-input', inputId);
        }
      }
    }
  }
  
  // グローバル関数を公開
  window.manualCameraFunctions = {
    // カメラを開く
    openCamera: function(inputId, side) {
      openCameraModal(inputId, side);
    },
    
    // マイナンバーセクションを作成
    createMyNumberSection: function() {
      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
        if (select.value === 'idCard' || 
            (select.selectedOptions && select.selectedOptions[0] && 
             select.selectedOptions[0].textContent.includes('マイナンバー'))) {
          createMyNumberCardUploadArea(select);
        }
      });
    },
    
    // 運転免許証セクションを作成
    createLicenseSection: function() {
      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
        if (select.value === 'license' || 
            (select.selectedOptions && select.selectedOptions[0] && 
             select.selectedOptions[0].textContent.includes('運転免許'))) {
          createDriverLicenseUploadArea(select);
        }
      });
    }
  };
  
  // 初期処理の実行
  console.log('手動カメラ修正: スクリプトロード完了');
})();

// 即時実行関数を実行
(function() {
  // インラインスクリプトを注入
  const script = document.createElement('script');
  script.textContent = `
    // ページ読み込み後に実行
    document.addEventListener('DOMContentLoaded', function() {
      console.log('インラインスクリプト: 実行');
      
      // マイナンバーカードセクションを作成
      setTimeout(function() {
        if (window.manualCameraFunctions) {
          window.manualCameraFunctions.createMyNumberSection();
        }
      }, 1000);
      
      // セレクト要素の変更を監視
      document.querySelectorAll('select').forEach(function(select) {
        select.addEventListener('change', function() {
          if (this.value === 'idCard' || this.selectedOptions[0].textContent.includes('マイナンバー')) {
            console.log('インラインスクリプト: マイナンバーカード選択を検出');
            
            if (window.manualCameraFunctions) {
              window.manualCameraFunctions.createMyNumberSection();
            }
          } else if (this.value === 'license' || this.selectedOptions[0].textContent.includes('運転免許')) {
            console.log('インラインスクリプト: 運転免許証選択を検出');
            
            if (window.manualCameraFunctions) {
              window.manualCameraFunctions.createLicenseSection();
            }
          }
        });
      });
    });
  `;
  
  document.head.appendChild(script);
})();