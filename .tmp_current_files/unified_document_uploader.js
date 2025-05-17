/**
 * 統合された書類アップロード機能
 * 書類タイプ変更時に古いセクションを削除し
 * 新しいセクションを単一の仕組みで提供
 */
(function() {
  console.log('統合書類アップロード: 初期化中...');
  
  // DOM完全ロード時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedUploader);
  } else {
    // すでにDOM読み込み完了している場合
    initUnifiedUploader();
  }
  
  // 定期的に初期化を実行して確実に適用
  const initInterval = setInterval(initUnifiedUploader, 2000);
  
  // DOM変更監視
  const observer = new MutationObserver(function(mutations) {
    let shouldInit = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // モーダルが追加されたかチェック
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && (
                node.classList.contains('modal') || 
                node.classList.contains('modal-dialog') ||
                node.classList.contains('modal-content')
            )) {
              shouldInit = true;
              break;
            }
            
            // セレクト要素が追加されたかチェック
            if (node.tagName === 'SELECT') {
              shouldInit = true;
              break;
            }
            
            // 子孫にモーダルやセレクト要素があるかチェック
            if (node.querySelectorAll) {
              const hasModal = node.querySelectorAll('.modal, .modal-dialog, select').length > 0;
              if (hasModal) {
                shouldInit = true;
                break;
              }
            }
          }
        }
      }
    });
    
    if (shouldInit) {
      console.log('統合書類アップロード: DOM変更を検出。初期化します。');
      setTimeout(initUnifiedUploader, 300);
    }
  });
  
  // document全体の変更を監視
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 書類アップロードの初期化
  function initUnifiedUploader() {
    console.log('統合書類アップロード: 初期化処理実行');
    
    // スタイルを追加
    addStyles();
    
    // すべての書類タイプセレクタを探して処理
    setupDocumentTypeSelectors();
    
    // カメラボタンを設定
    setupCameraButtons();
    
    // 画像プレビューの問題を修正
    fixImagePreview();
  }
  
  // スタイルを追加
  function addStyles() {
    if (document.getElementById('unified-uploader-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'unified-uploader-styles';
    style.textContent = `
      /* カメラモーダル用スタイル */
      .camera-container {
        position: relative;
        background: #000;
        min-height: 300px;
        max-height: 70vh;
        overflow: hidden;
      }
      
      .camera-video {
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
      
      /* モバイル用のスタイル調整 */
      @media (max-width: 768px) {
        .camera-controls {
          padding: 10px;
        }
        
        .camera-btn {
          width: 40px;
          height: 40px;
        }
        
        .capture-btn {
          width: 60px;
          height: 60px;
        }
        
        .capture-circle {
          width: 46px;
          height: 46px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // すべての書類タイプセレクタを設定
  function setupDocumentTypeSelectors() {
    // すべてのセレクト要素を探す
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
      // 身分証明書関連のセレクタかどうかをチェック
      const isIdDocSelector = Array.from(select.options || []).some(option => {
        const text = option.textContent.toLowerCase();
        const value = option.value.toLowerCase();
        
        return text.includes('マイナンバー') || 
               text.includes('運転免許') || 
               text.includes('運転経歴') ||
               text.includes('パスポート') ||
               value === 'idcard' || 
               value === 'license' || 
               value === 'passport';
      });
      
      if (!isIdDocSelector) return;
      
      // 既に処理済みかチェック
      if (select.getAttribute('data-unified-processed')) return;
      
      // 処理済みとしてマーク
      select.setAttribute('data-unified-processed', 'true');
      
      // 現在の選択値をチェック
      if (select.value) {
        handleDocumentTypeChange(select);
      }
      
      // 変更イベントリスナーを設定
      select.addEventListener('change', function() {
        handleDocumentTypeChange(this);
      });
    });
  }
  
  // 書類タイプ変更時の処理
  function handleDocumentTypeChange(select) {
    // 親コンテナを探す
    const container = findParentContainer(select);
    if (!container) return;
    
    // 既存の書類セクションをすべて削除
    const existingSections = container.querySelectorAll('.document-upload-section');
    existingSections.forEach(section => {
      section.remove();
    });
    
    console.log('統合書類アップロード: 書類タイプ変更', select.value);
    
    // 選択値に基づいて適切なアップロードエリアを作成
    const selectedValue = select.value.toLowerCase();
    const selectedText = select.selectedOptions[0]?.textContent.toLowerCase() || '';
    
    if (selectedValue === 'license' || selectedText.includes('運転免許')) {
      createDualUploadArea(container, 'license', '運転免許証');
    } else if (selectedValue === 'idcard' || selectedText.includes('マイナンバー') || selectedText.includes('運転経歴')) {
      createDualUploadArea(container, 'idcard', 'マイナンバーカード/運転経歴証明書');
    } else if (selectedValue === 'passport' || selectedText.includes('パスポート')) {
      createSingleUploadArea(container, 'passport', 'パスポート');
    }
  }
  
  // 親コンテナを探す
  function findParentContainer(element) {
    // モーダル本体を探す
    const modal = element.closest('.modal-body, .modal-content');
    if (modal) return modal;
    
    // フォームを探す
    const form = element.closest('form');
    if (form) return form;
    
    // 親要素を辿る
    let parent = element.parentElement;
    let depth = 0;
    
    while (parent && depth < 5) {
      // フォーム系コンテナを探す
      if (parent.classList.contains('form-group') || 
          parent.classList.contains('mb-3') ||
          parent.classList.contains('form-section') ||
          parent.classList.contains('card-body')) {
        return parent;
      }
      
      depth++;
      parent = parent.parentElement;
    }
    
    // 見つからなければ最も近いコンテナ系要素を返す
    return element.closest('.container, .container-fluid, .row, .card') || document.body;
  }
  
  // 裏表両面のアップロードエリアを作成
  function createDualUploadArea(container, type, title) {
    // 既に同じタイプの要素があれば作成しない
    if (container.querySelector(`.document-upload-section[data-type="${type}"]`)) {
      return;
    }
    
    console.log(`統合書類アップロード: ${title}のアップロードエリアを作成`);
    
    // アップロードエリア要素を作成
    const uploadArea = document.createElement('div');
    uploadArea.className = 'document-upload-section card mt-3 mb-3';
    uploadArea.dataset.type = type;
    
    // HTML構造作成
    uploadArea.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${title}アップロード</h5>
        <p class="text-muted small mb-3">両面をアップロードしてください</p>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">${title}（表面）</label>
            <div class="input-group mb-2">
              <input type="file" class="form-control" id="${type}-front" name="${type}-front" accept="image/*">
              <button type="button" class="btn btn-outline-primary document-camera" data-bs-original-title="カメラで撮影">
                <i class="bi bi-camera"></i>
              </button>
            </div>
            <div class="d-grid">
              <button type="button" class="btn btn-primary btn-sm camera-button" 
                    data-target="${type}-front" data-side="表面">
                <i class="bi bi-camera me-1"></i>表面を撮影
              </button>
            </div>
            <div class="preview-container mt-2"></div>
          </div>
          
          <div class="col-md-6 mb-3">
            <label class="form-label">${title}（裏面）</label>
            <div class="input-group mb-2">
              <input type="file" class="form-control" id="${type}-back" name="${type}-back" accept="image/*">
              <button type="button" class="btn btn-outline-primary document-camera" data-bs-original-title="カメラで撮影">
                <i class="bi bi-camera"></i>
              </button>
            </div>
            <div class="d-grid">
              <button type="button" class="btn btn-primary btn-sm camera-button" 
                    data-target="${type}-back" data-side="裏面">
                <i class="bi bi-camera me-1"></i>裏面を撮影
              </button>
            </div>
            <div class="preview-container mt-2"></div>
          </div>
        </div>
      </div>
    `;
    
    // セレクト要素の後に挿入
    const insertPoint = findInsertPoint(container);
    if (insertPoint) {
      insertPoint.parentNode.insertBefore(uploadArea, insertPoint.nextSibling);
    } else {
      container.appendChild(uploadArea);
    }
    
    // ファイル入力の変更イベント設定
    const fileInputs = uploadArea.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.addEventListener('change', function() {
        handleFileInputChange(this);
      });
    });
    
    // カメラボタンの設定
    setupButtonsInArea(uploadArea);
  }
  
  // 片面のアップロードエリアを作成
  function createSingleUploadArea(container, type, title) {
    // 既に同じタイプの要素があれば作成しない
    if (container.querySelector(`.document-upload-section[data-type="${type}"]`)) {
      return;
    }
    
    console.log(`統合書類アップロード: ${title}のアップロードエリアを作成`);
    
    // アップロードエリア要素を作成
    const uploadArea = document.createElement('div');
    uploadArea.className = 'document-upload-section card mt-3 mb-3';
    uploadArea.dataset.type = type;
    
    // HTML構造作成
    uploadArea.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${title}アップロード</h5>
        
        <div class="mb-3">
          <label class="form-label">${title}</label>
          <div class="input-group mb-2">
            <input type="file" class="form-control" id="${type}" name="${type}" accept="image/*">
            <button type="button" class="btn btn-outline-primary document-camera" data-bs-original-title="カメラで撮影">
              <i class="bi bi-camera"></i>
            </button>
          </div>
          <div class="d-grid">
            <button type="button" class="btn btn-primary btn-sm camera-button" data-target="${type}">
              <i class="bi bi-camera me-1"></i>${title}を撮影
            </button>
          </div>
          <div class="preview-container mt-2"></div>
        </div>
      </div>
    `;
    
    // セレクト要素の後に挿入
    const insertPoint = findInsertPoint(container);
    if (insertPoint) {
      insertPoint.parentNode.insertBefore(uploadArea, insertPoint.nextSibling);
    } else {
      container.appendChild(uploadArea);
    }
    
    // ファイル入力の変更イベント設定
    const fileInput = uploadArea.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', function() {
        handleFileInputChange(this);
      });
    }
    
    // カメラボタンの設定
    setupButtonsInArea(uploadArea);
  }
  
  // 挿入位置を特定
  function findInsertPoint(container) {
    // 書類タイプのセレクト要素を探す
    const selects = container.querySelectorAll('select');
    let targetSelect = null;
    
    for (const select of selects) {
      // 身分証明書関連のセレクタかチェック
      const isIdDocSelector = Array.from(select.options || []).some(option => {
        const text = option.textContent.toLowerCase();
        const value = option.value.toLowerCase();
        
        return text.includes('マイナンバー') || 
               text.includes('運転免許') || 
               text.includes('パスポート') ||
               value === 'idcard' || 
               value === 'license' || 
               value === 'passport';
      });
      
      if (isIdDocSelector) {
        targetSelect = select;
        break;
      }
    }
    
    if (!targetSelect) return null;
    
    // セレクト要素の親フォームグループを探す
    let parent = targetSelect.parentElement;
    while (parent && 
           !parent.classList.contains('form-group') && 
           !parent.classList.contains('mb-3') &&
           !parent.classList.contains('row') &&
           parent !== container) {
      parent = parent.parentElement;
    }
    
    return parent || targetSelect;
  }
  
  // 特定エリア内のボタンを設定
  function setupButtonsInArea(area) {
    // document-cameraクラスのボタン
    const cameraButtons = area.querySelectorAll('.document-camera');
    cameraButtons.forEach(button => {
      button.addEventListener('click', function() {
        const inputGroup = this.closest('.input-group');
        if (!inputGroup) return;
        
        const fileInput = inputGroup.querySelector('input[type="file"]');
        if (!fileInput) return;
        
        openCameraModal(fileInput.id);
      });
    });
    
    // camera-buttonクラスのボタン
    const cameraActionButtons = area.querySelectorAll('.camera-button');
    cameraActionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const side = this.getAttribute('data-side') || '';
        
        if (targetId) {
          openCameraModal(targetId, side);
        }
      });
    });
  }
  
  // すべてのカメラボタンを設定
  function setupCameraButtons() {
    // document-cameraクラスのボタン（新規追加分）
    const cameraButtons = document.querySelectorAll('.document-camera');
    
    cameraButtons.forEach(button => {
      // 既に処理済みの場合はスキップ
      if (button.getAttribute('data-unified-processed')) return;
      
      // 処理済みとしてマーク
      button.setAttribute('data-unified-processed', 'true');
      
      button.addEventListener('click', function() {
        const inputGroup = this.closest('.input-group');
        if (!inputGroup) return;
        
        const fileInput = inputGroup.querySelector('input[type="file"]');
        if (!fileInput) return;
        
        openCameraModal(fileInput.id);
      });
    });
    
    // カメラボタン（新規追加分）
    const actionButtons = document.querySelectorAll('.camera-button');
    
    actionButtons.forEach(button => {
      // 既に処理済みの場合はスキップ
      if (button.getAttribute('data-unified-processed')) return;
      
      // 処理済みとしてマーク
      button.setAttribute('data-unified-processed', 'true');
      
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const side = this.getAttribute('data-side') || '';
        
        if (targetId) {
          openCameraModal(targetId, side);
        }
      });
    });
    
    // テキストで「カメラで撮影」を含むボタン
    const textButtons = Array.from(document.querySelectorAll('button, a, .btn')).filter(el => 
      el.textContent && el.textContent.includes('カメラで撮影')
    );
    
    textButtons.forEach(button => {
      // 既に処理済みの場合はスキップ
      if (button.getAttribute('data-unified-processed')) return;
      
      // 処理済みとしてマーク
      button.setAttribute('data-unified-processed', 'true');
      
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 親要素のコンテキストからターゲットを特定
        const container = this.closest('.mb-3, .form-group');
        if (!container) return;
        
        const fileInput = container.querySelector('input[type="file"]');
        if (!fileInput) return;
        
        openCameraModal(fileInput.id);
      });
    });
  }
  
  // 画像プレビューの問題を修正
  function fixImagePreview() {
    // 画像要素を探す
    const previewImages = document.querySelectorAll('img.preview-img, .preview-container img');
    
    previewImages.forEach(img => {
      // 処理済みかチェック
      if (img.getAttribute('data-preview-fixed')) return;
      
      // 処理済みとしてマーク
      img.setAttribute('data-preview-fixed', 'true');
      
      // エラーイベントリスナーを設定
      img.addEventListener('error', function() {
        console.error('統合書類アップロード: 画像読み込みエラー', this.src.substring(0, 30) + '...');
        
        // デフォルト画像に置換
        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+';
        this.style.maxWidth = '100px';
        this.style.background = '#f8f9fa';
        this.style.padding = '10px';
        this.style.border = '1px solid #dee2e6';
        this.style.borderRadius = '4px';
      });
      
      // すでに読み込み済みでエラーになっていないかチェック
      if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        img.dispatchEvent(new Event('error'));
      }
    });
  }
  
  // ファイル入力変更イベントの処理
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
      previewImg.className = 'img-fluid preview-img';
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
  }
  
  // グローバル変数
  let mediaStream = null;
  
  // カメラモーダルを開く
  function openCameraModal(inputId, side = '') {
    console.log('統合書類アップロード: カメラモーダルを開きます', inputId, side);
    
    // 対象の入力要素を確認
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.error('統合書類アップロード: 対象の入力要素が見つかりません', inputId);
      return;
    }
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('unified-camera-modal');
    if (existingModal) {
      try {
        const bsModal = bootstrap.Modal.getInstance(existingModal);
        if (bsModal) bsModal.hide();
      } catch (e) {
        console.error('モーダルインスタンス取得エラー:', e);
      }
      
      existingModal.remove();
    }
    
    // モーダルのタイトルを決定
    let title = 'カメラで撮影';
    
    // 入力IDに基づいてタイトルをカスタマイズ
    if (inputId.includes('license')) {
      title = `運転免許証${side ? `(${side})` : ''}を撮影`;
    } else if (inputId.includes('idcard')) {
      title = `マイナンバーカード${side ? `(${side})` : ''}を撮影`;
    } else if (inputId.includes('passport')) {
      title = 'パスポートを撮影';
    }
    
    // モーダルHTMLを作成
    const modalHtml = `
      <div class="modal fade" id="unified-camera-modal" tabindex="-1" data-input-id="${inputId}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="bi bi-camera me-2"></i>${title}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <div class="camera-container">
                <video id="camera-video" class="camera-video" autoplay playsinline></video>
                <canvas id="camera-canvas" style="display:none;"></canvas>
                
                <div class="guide-frame">
                  <div class="guide-text">書類全体がフレーム内に収まるようにしてください</div>
                </div>
                
                <div class="camera-controls">
                  <div class="camera-btn" id="camera-switch-btn">
                    <i class="bi bi-arrow-repeat"></i>
                  </div>
                  <div class="camera-btn capture-btn" id="camera-capture-btn">
                    <div class="capture-circle"></div>
                  </div>
                  <div class="camera-btn" id="camera-close-btn" data-bs-dismiss="modal">
                    <i class="bi bi-x"></i>
                  </div>
                </div>
                
                <div id="camera-preview" style="display:none;">
                  <img id="preview-image" src="" alt="撮影画像" style="max-width:100%; max-height:100%; object-fit:contain;">
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
    
    // モーダルをDOMに追加
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // モーダルを表示
    const modalElement = document.getElementById('unified-camera-modal');
    
    try {
      const bootstrapModal = new bootstrap.Modal(modalElement);
      
      // モーダル表示イベント
      modalElement.addEventListener('shown.bs.modal', function() {
        startCamera('environment');
      });
      
      // モーダル非表示イベント
      modalElement.addEventListener('hidden.bs.modal', function() {
        stopCamera();
      });
      
      bootstrapModal.show();
    } catch (err) {
      console.error('モーダル初期化エラー:', err);
      
      // 手動でモーダルを表示
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
      
      // 背景オーバーレイを作成
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
      
      // bodyにクラスを追加
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '17px'; // スクロールバー分
      
      // 閉じるボタンイベント
      const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
      closeButtons.forEach(button => {
        button.addEventListener('click', function() {
          modalElement.style.display = 'none';
          modalElement.classList.remove('show');
          
          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          
          stopCamera();
        });
      });
      
      // カメラを起動
      startCamera('environment');
    }
    
    // カメラモーダルのボタンイベント設定
    setupCameraModalEvents(inputId);
  }
  
  // カメラモーダルのイベント設定
  function setupCameraModalEvents(inputId) {
    // 撮影ボタン
    const captureBtn = document.getElementById('camera-capture-btn');
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        capturePhoto();
      });
    }
    
    // カメラ切り替えボタン
    const switchBtn = document.getElementById('camera-switch-btn');
    if (switchBtn) {
      switchBtn.addEventListener('click', function() {
        switchCamera();
      });
    }
    
    // 撮り直しボタン
    const retakeBtn = document.getElementById('retake-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function() {
        retakePhoto();
      });
    }
    
    // 使用ボタン
    const usePhotoBtn = document.getElementById('use-photo-btn');
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function() {
        usePhoto(inputId);
      });
    }
  }
  
  // カメラを起動
  function startCamera(facingMode) {
    const videoElement = document.getElementById('camera-video');
    if (!videoElement) return;
    
    // Windowsのモバイル連携メッセージを非表示にする対策
    const windowsPopups = document.querySelectorAll('div[id^="Xiaomi"], div[class*="mobile-link"]');
    windowsPopups.forEach(popup => {
      if (popup && popup.style) {
        popup.style.display = 'none';
      }
    });
    
    // カメラ設定 - モバイル環境最適化
    let constraints;
    
    // モバイルかどうかを判定
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // モバイル向け設定（軽量化）
      constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };
    } else {
      // PC向け設定
      constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
    }
    
    // 既存のストリームを停止
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    
    console.log('カメラ起動: デバイス=' + (isMobile ? 'モバイル' : 'PC'), '向き=' + facingMode);
    
    // カメラアクセス
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        mediaStream = stream;
        videoElement.srcObject = stream;
        
        // モバイル連携メッセージを再度チェックして非表示
        setTimeout(() => {
          const windowsPopups = document.querySelectorAll('div[id^="Xiaomi"], div[class*="mobile-link"]');
          windowsPopups.forEach(popup => {
            if (popup && popup.style) {
              popup.style.display = 'none';
            }
          });
        }, 500);
      })
      .catch(function(err) {
        console.error('カメラ起動エラー:', err);
        showCameraError();
      });
  }
  
  // カメラを切り替え
  function switchCamera() {
    if (!mediaStream) return;
    
    // 現在のモードを取得
    const currentTrack = mediaStream.getVideoTracks()[0];
    const currentFacingMode = currentTrack.getSettings().facingMode;
    
    // モードを切り替え
    const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    
    // カメラを再起動
    startCamera(newFacingMode);
  }
  
  // カメラを停止
  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  // 写真を撮影
  function capturePhoto() {
    const videoElement = document.getElementById('camera-video');
    const canvasElement = document.getElementById('camera-canvas');
    const previewElement = document.getElementById('camera-preview');
    const previewImage = document.getElementById('preview-image');
    const previewFooter = document.getElementById('preview-footer');
    
    // Windowsのモバイル連携メッセージを再度チェックして非表示（撮影時に表示される場合がある）
    const windowsPopups = document.querySelectorAll('div[id^="Xiaomi"], div[class*="mobile-link"]');
    windowsPopups.forEach(popup => {
      if (popup && popup.style) {
        popup.style.display = 'none';
        popup.style.visibility = 'hidden';
      }
    });
    
    if (!videoElement || !canvasElement || !previewElement || !previewImage) {
      console.error('必要な要素が見つかりません');
      return;
    }
    
    try {
      // ビデオのサイズを取得
      let width = videoElement.videoWidth;
      let height = videoElement.videoHeight;
      
      // サイズが取得できない場合のフォールバック
      if (!width || !height) {
        console.warn('ビデオサイズが取得できません。デフォルト値を使用します。');
        width = 640;
        height = 480;
      }
      
      console.log(`撮影: 画像サイズ ${width}x${height}`);
      
      // キャンバスサイズを設定
      canvasElement.width = width;
      canvasElement.height = height;
      
      // 真っ黒画像問題対策として背景を白で塗りつぶし
      const context = canvasElement.getContext('2d');
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, width, height);
      
      // 映像をキャンバスに描画
      try {
        context.drawImage(videoElement, 0, 0, width, height);
      } catch (drawErr) {
        console.error('映像描画エラー:', drawErr);
        
        // 代替の方法でキャプチャ
        console.log('代替描画方法を試行...');
        
        // 映像が動作しているか確認
        if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
          try {
            // 別の描画方法を試す
            context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          } catch (alternativeErr) {
            console.error('代替描画も失敗:', alternativeErr);
            
            // ダミー画像を使用
            createDummyImage(canvasElement);
          }
        } else {
          // 映像が準備できていない場合はダミー画像を使用
          console.log('映像データが不十分です。ダミー画像を使用します。');
          createDummyImage(canvasElement);
        }
      }
      
      // 画像データを取得
      const imageData = canvasElement.toDataURL('image/jpeg', 0.9);
      
      // プレビュー表示
      previewImage.src = imageData;
      previewElement.style.display = 'flex';
      previewFooter.style.display = 'flex';
      
      // 撮影用UIを非表示
      videoElement.style.display = 'none';
      
      // guide-frameとcamera-controlsがある場合のみ非表示に
      const guideFrame = document.querySelector('.guide-frame');
      const cameraControls = document.querySelector('.camera-controls');
      
      if (guideFrame) guideFrame.style.display = 'none';
      if (cameraControls) cameraControls.style.display = 'none';
    } catch (err) {
      console.error('撮影エラー:', err);
      alert('写真の撮影に失敗しました。再試行してください。');
    }
  }
  
  // ダミー画像を作成（カメラ撮影が失敗した場合のフォールバック）
  function createDummyImage(canvas) {
    const ctx = canvas.getContext('2d');
    
    // 白背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 枠線
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // プレースホルダーテキスト
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('カメラ撮影に失敗しました', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('このままご使用いただけます', canvas.width / 2, canvas.height / 2 + 20);
  }
  
  // 写真を撮り直す
  function retakePhoto() {
    const videoElement = document.getElementById('camera-video');
    const previewElement = document.getElementById('camera-preview');
    const previewFooter = document.getElementById('preview-footer');
    
    // プレビューを非表示
    previewElement.style.display = 'none';
    previewFooter.style.display = 'none';
    
    // 撮影UIを表示
    videoElement.style.display = 'block';
    document.querySelector('.guide-frame').style.display = 'block';
    document.querySelector('.camera-controls').style.display = 'flex';
  }
  
  // 撮影した写真を使用
  function usePhoto(inputId) {
    const previewImage = document.getElementById('preview-image');
    if (!previewImage || !previewImage.src) {
      console.error('プレビュー画像が見つかりません');
      return;
    }
    
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.error('入力要素が見つかりません:', inputId);
      return;
    }
    
    try {
      // ブラウザごとの互換性問題対策
      const img = new Image();
      
      img.onload = function() {
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
          try {
            const fileName = 'camera_' + Date.now() + '.jpg';
            
            // DataTransferオブジェクトが使えるブラウザ向け
            if (window.DataTransfer) {
              try {
                const dataTransfer = new DataTransfer();
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                dataTransfer.items.add(file);
                inputElement.files = dataTransfer.files;
              } catch (err) {
                console.error('DataTransferエラー:', err);
                // フォールバック: FileReaderを使用
                createFallbackInput(inputElement, blob, fileName);
              }
            } else {
              // 古いブラウザ向けフォールバック
              createFallbackInput(inputElement, blob, fileName);
            }
            
            // 変更イベント発火
            const event = new Event('change', { bubbles: true });
            inputElement.dispatchEvent(event);
            
            // モーダルを閉じる
            closeModal();
            
            // プレビュー更新
            updatePreview(inputElement, canvas.toDataURL('image/jpeg', 0.9));
          } catch (err) {
            console.error('ファイル設定エラー:', err);
            alert('写真の設定に失敗しました。手動でファイルを選択してください。');
            closeModal();
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = function() {
        console.error('画像読み込みエラー');
        alert('画像の処理に失敗しました。別の方法で試してください。');
        closeModal();
      };
      
      img.src = previewImage.src;
    } catch (err) {
      console.error('写真使用エラー:', err);
      alert('エラーが発生しました。手動でファイルを選択してください。');
      closeModal();
    }
  }
  
  // フォールバック入力作成
  function createFallbackInput(originalInput, blob, fileName) {
    // シンプルなファイル入力に置き換え
    const parent = originalInput.parentElement;
    if (!parent) return;
    
    // 元の入力を非表示
    originalInput.style.display = 'none';
    
    // 新しい入力を作成
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.className = originalInput.className;
    newInput.name = originalInput.name;
    newInput.id = originalInput.id + '_fallback';
    newInput.accept = 'image/*';
    
    // 元の入力の後に挿入
    parent.insertBefore(newInput, originalInput.nextSibling);
    
    // ユーザーが手動でファイルを選択できるようにする
    newInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          updatePreview(newInput, e.target.result);
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
    
    // ファイルの代わりに元の画像データを使用
    if (blob) {
      const dataURL = URL.createObjectURL(blob);
      updatePreview(newInput, dataURL);
    }
  }
  
  // モーダルを閉じる
  function closeModal() {
    try {
      const modalElement = document.getElementById('unified-camera-modal');
      if (!modalElement) return;
      
      // Bootstrapモーダル
      try {
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        if (bsModal) {
          bsModal.hide();
          return;
        }
      } catch (err) {
        console.error('モーダルインスタンス取得エラー:', err);
      }
      
      // 手動でモーダルを閉じる
      modalElement.style.display = 'none';
      modalElement.classList.remove('show');
      
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // カメラを停止
      stopCamera();
    } catch (err) {
      console.error('モーダルクローズエラー:', err);
    }
  }
  
  // カメラエラー表示
  function showCameraError() {
    const cameraContainer = document.querySelector('.camera-container');
    if (!cameraContainer) return;
    
    cameraContainer.innerHTML = `
      <div class="p-4 text-center">
        <div class="alert alert-warning mb-3">
          <h5 class="mb-2"><i class="bi bi-exclamation-triangle me-2"></i>カメラにアクセスできません</h5>
          <p class="mb-2">以下の理由が考えられます：</p>
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
    
    // 手動アップロードボタン設定
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
            const modalElement = document.getElementById('unified-camera-modal');
            const inputId = modalElement ? modalElement.getAttribute('data-input-id') : null;
            
            if (inputId) {
              const inputElement = document.getElementById(inputId);
              if (inputElement) {
                try {
                  // ファイルをセット
                  const file = fileInput.files[0];
                  
                  if (window.DataTransfer) {
                    try {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);
                      inputElement.files = dataTransfer.files;
                    } catch (err) {
                      console.error('DataTransferエラー:', err);
                      createFallbackInput(inputElement, file, file.name);
                    }
                  } else {
                    createFallbackInput(inputElement, file, file.name);
                  }
                  
                  // 変更イベント発火
                  const event = new Event('change', { bubbles: true });
                  inputElement.dispatchEvent(event);
                  
                  // プレビュー更新
                  updatePreview(inputElement, e.target.result);
                  
                  // モーダルを閉じる
                  closeModal();
                } catch (err) {
                  console.error('ファイル設定エラー:', err);
                  alert('ファイルの設定に失敗しました。');
                  closeModal();
                }
              }
            }
          };
          
          reader.readAsDataURL(this.files[0]);
        }
      });
    }
  }
  
  // グローバル関数を公開
  window.unifiedDocumentUploader = {
    // ドキュメントセレクタの初期化
    initSelectors: function() {
      setupDocumentTypeSelectors();
    },
    
    // 特定のドキュメントタイプを作成
    createDocumentArea: function(containerId, type) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      if (type === 'license') {
        createDualUploadArea(container, 'license', '運転免許証');
      } else if (type === 'idcard') {
        createDualUploadArea(container, 'idcard', 'マイナンバーカード/運転経歴証明書');
      } else if (type === 'passport') {
        createSingleUploadArea(container, 'passport', 'パスポート');
      }
    },
    
    // カメラを開く
    openCamera: function(inputId, side) {
      openCameraModal(inputId, side);
    },
    
    // セクションをすべて削除
    removeAllSections: function(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const sections = container.querySelectorAll('.document-upload-section');
      sections.forEach(section => section.remove());
    }
  };
})();