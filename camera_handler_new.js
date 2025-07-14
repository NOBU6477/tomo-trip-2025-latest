/**
 * 証明写真と身分証明書のカメラ撮影機能を完全に刷新したスクリプト
 * シンプルで確実な実装
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ストリームラインカメラを初期化しています');
  
  // グローバル変数の定義
  var mediaStream = null;        // カメラストリーム
  var facingMode = 'environment'; // 初期カメラ向き (environment=背面, user=前面)
  
  /**
   * すべてのドキュメント関連コントロールを設定
   */
  function setupAllDocumentControls() {
    console.log('すべてのドキュメントコントロールを設定...');
    setupMobileFileInputs();
    setupCameraButtons();
    setupFileSelectors();
    setupRemoveButtons();
  }
  
  /**
   * スマホカメラ用のファイル入力を設定
   */
  function setupMobileFileInputs() {
    const mobileInputs = document.querySelectorAll('input[type="file"][capture]');
    console.log(`${mobileInputs.length}個のモバイルカメラ入力を設定`);
    
    mobileInputs.forEach(input => {
      input.addEventListener('change', handleMobileFileChange);
    });
  }
  
  /**
   * スマホカメラからのファイル変更イベントハンドラ
   */
  function handleMobileFileChange(e) {
    console.log('モバイルカメラファイル変更を処理...');
    if (this.files && this.files.length > 0) {
      const relatedInput = findRelatedFileInput(this);
      if (relatedInput) {
        transferFileToInput(relatedInput, this.files[0]);
      }
    }
  }
  
  /**
   * モバイルファイル入力に関連する通常のファイル入力を探す
   */
  function findRelatedFileInput(mobileInput) {
    // 同じコンテナ内の通常のファイル入力を探す
    const container = mobileInput.closest('.form-group, .mb-3, .document-upload-section');
    if (container) {
      const regularInput = container.querySelector('input[type="file"]:not([capture])');
      if (regularInput) return regularInput;
    }
    
    // IDベースで探す
    if (mobileInput.id) {
      const baseId = mobileInput.id.replace('-mobile', '').replace('-camera', '');
      const regularInput = document.getElementById(baseId);
      if (regularInput && regularInput !== mobileInput) return regularInput;
    }
    
    return null;
  }
  
  /**
   * ファイルをあるInputから別のInputに転送
   */
  function transferFileToInput(targetInput, file) {
    if (!targetInput || !file) return;
    
    // DataTransferオブジェクトを使用してファイルリストを生成
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    targetInput.files = dataTransfer.files;
    
    // changeイベントを手動で発火
    const event = new Event('change', { bubbles: true });
    targetInput.dispatchEvent(event);
  }
  
  /**
   * カメラボタンを設定
   */
  function setupCameraButtons() {
    // カメラボタンを収集
    const cameraButtons = Array.from(document.querySelectorAll('.camera-btn, [id$="-camera-btn"], button[id*="camera"]'));
    
    // クラスとテキスト内容でもボタンを検索
    document.querySelectorAll('button, .btn').forEach(btn => {
      if (cameraButtons.includes(btn)) return;
      
      const btnText = btn.textContent.trim().toLowerCase();
      const hasCamera = btnText.includes('カメラ') || 
                       btnText.includes('撮影') ||
                       btn.innerHTML.includes('camera') ||
                       btn.querySelector('.bi-camera, .fa-camera');
      
      if (hasCamera) {
        cameraButtons.push(btn);
      }
    });
    
    console.log(`${cameraButtons.length}個のカメラボタンを検出しました`);
    
    // カメラボタンにイベントリスナーを設定
    cameraButtons.forEach(button => {
      // 既存のイベントを削除するためにクローン
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      // 対応するファイル入力を見つける
      const targetInput = findAssociatedFileInput(newButton);
      
      if (targetInput) {
        console.log('関連付けられたファイル入力を見つけました:', targetInput.id || 'ID無し');
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          openCameraInterface(targetInput);
        });
      } else {
        console.log('このボタンの関連ファイル入力が見つかりませんでした。一般的なカメラモーダルを開きます');
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          // ファイル入力がない場合は、最も近いファイル入力を探す
          const anyFileInput = document.querySelector('input[type="file"]');
          if (anyFileInput) {
            openCameraInterface(anyFileInput);
          } else {
            openCameraInterface(null, this);
          }
        });
      }
    });
  }
  
  /**
   * ファイル選択ボタン・ラベルを設定
   */
  function setupFileSelectors() {
    // 直接のファイル入力
    const fileInputs = document.querySelectorAll('input[type="file"]:not([capture])');
    fileInputs.forEach(input => {
      input.addEventListener('change', handleFileChange);
    });
    
    // ファイル選択ラベル
    const fileLabels = document.querySelectorAll('label.file-label, label[for$="-input"], label.custom-file-label');
    fileLabels.forEach(label => {
      const inputId = label.getAttribute('for');
      if (inputId) {
        const targetInput = document.getElementById(inputId);
        if (targetInput && targetInput.type === 'file') {
          label.addEventListener('click', function(e) {
            e.preventDefault();
            targetInput.click();
          });
        }
      }
    });
    
    // ファイル選択ボタン
    const fileButtons = document.querySelectorAll('.file-btn, [id$="-file-btn"], button.select-file-btn');
    fileButtons.forEach(button => {
      // 対応するファイル入力を見つける
      const targetInput = findAssociatedFileInput(button);
      if (targetInput) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          targetInput.click();
        });
      }
    });
  }
  
  /**
   * ファイル変更イベントハンドラ
   */
  function handleFileChange(e) {
    if (this.files && this.files.length > 0) {
      handleFileSelection(this);
    }
  }
  
  /**
   * 削除ボタンを設定
   */
  function setupRemoveButtons() {
    // 削除ボタンを収集
    const removeButtonsList = [];
    
    // 標準クラスとIDでボタンを検索
    const standardRemoveButtons = document.querySelectorAll('.remove-btn, [id$="-remove-btn"], button.delete-btn, .btn-trash, .trash-btn');
    standardRemoveButtons.forEach(button => removeButtonsList.push(button));
    
    // その他のボタンをテキストとアイコンに基づいて検索
    document.querySelectorAll('button, .btn').forEach(button => {
      if (removeButtonsList.includes(button)) return;
      
      const buttonText = button.textContent.trim().toLowerCase();
      const hasTrashIcon = button.querySelector('.bi-trash, .fa-trash, .trash-icon');
      const isTrashButton = button.classList.contains('delete') || 
                          button.classList.contains('trash') || 
                          button.classList.contains('remove');
      
      const hasTrashText = buttonText.includes('削除') || 
                           buttonText.includes('消去') ||
                           buttonText.includes('クリア');
      
      if (isTrashButton || hasTrashIcon || hasTrashText) {
        removeButtonsList.push(button);
      }
    });
    
    console.log(`${removeButtonsList.length}個の削除ボタンを検出しました`);
    
    removeButtonsList.forEach(button => {
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('削除ボタンがクリックされました:', this.textContent.trim());
        removeUploadedFile(findAssociatedFileInput(this));
      });
    });
  }
  
  /**
   * ボタンに関連するファイル入力要素を特定
   */
  function findAssociatedFileInput(button) {
    console.log('関連するファイル入力要素を検索中...');
    
    // ボタンが無い場合
    if (!button) {
      console.error('ボタンが提供されていません');
      return document.querySelector('input[type="file"]');
    }
    
    // ボタンIDに基づく特定
    if (button.id) {
      // IDパターン: "xxx-camera-btn" → "xxx-input"
      const baseId = button.id.replace('-camera-btn', '').replace('-file-btn', '').replace('-btn', '');
      const potentialIds = [
        `${baseId}-input`,
        `${baseId}_input`,
        baseId + 'Input',
        baseId
      ];
      
      for (const id of potentialIds) {
        const input = document.getElementById(id);
        if (input && input.type === 'file') {
          console.log(`ボタンID ${button.id} から入力 ${id} を見つけました`);
          return input;
        }
      }
    }
    
    // ボタンのテキスト内容に基づく特定
    const buttonText = button.textContent.trim().toLowerCase();
    const documentTypeMatches = buttonText.match(/(運転免許証|パスポート|マイナンバー|在留カード|証明写真)/);
    
    if (documentTypeMatches) {
      const documentType = documentTypeMatches[1];
      const documentMap = {
        '運転免許証': ['license', 'driver'],
        'パスポート': ['passport'],
        'マイナンバー': ['idcard', 'mynumber'],
        '在留カード': ['residence', 'zairyu'],
        '証明写真': ['photo', 'idphoto', 'id-photo']
      };
      
      const potentialIds = documentMap[documentType] || [];
      
      // 裏面かどうかも判定
      const isFront = !buttonText.includes('裏');
      const isBack = buttonText.includes('裏');
      
      for (const baseId of potentialIds) {
        const frontSuffix = isFront ? ['-front', '_front', 'Front', ''] : [];
        const backSuffix = isBack ? ['-back', '_back', 'Back'] : [];
        const suffixes = isBack ? backSuffix : frontSuffix;
        
        for (const suffix of suffixes) {
          const testIds = [
            `${baseId}${suffix}-input`,
            `${baseId}${suffix}_input`,
            `${baseId}${suffix}Input`,
            `${baseId}-input${suffix}`,
            `${baseId}_input${suffix}`,
            `${baseId}Input${suffix}`,
            `${baseId}${suffix}`
          ];
          
          for (const id of testIds) {
            const input = document.getElementById(id);
            if (input && input.type === 'file') {
              console.log(`テキスト "${documentType}" からファイル入力 ${id} を見つけました`);
              return input;
            }
          }
        }
      }
    }
    
    // 親要素内で探す
    const section = button.closest('.document-upload-section, .mb-3, .form-group, .card');
    if (section) {
      const fileInput = section.querySelector('input[type="file"]');
      if (fileInput) {
        console.log('同じセクション内のファイル入力を見つけました');
        return fileInput;
      }
    }
    
    // フォーム内で探す
    const form = button.closest('form');
    if (form) {
      const fileInputs = form.querySelectorAll('input[type="file"]');
      if (fileInputs.length === 1) {
        console.log('フォーム内の唯一のファイル入力を見つけました');
        return fileInputs[0];
      }
    }
    
    console.log('関連するファイル入力が見つかりませんでした。最初のファイル入力を返します。');
    return document.querySelector('input[type="file"]');
  }
  
  /**
   * カメラインターフェースを開く
   */
  function openCameraInterface(fileInput, sourceButton) {
    console.log('カメラインターフェースを開始...');
    
    // カメラ機能が初期化されているか確認
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('このブラウザではカメラがサポートされていません');
      alert('お使いのブラウザではカメラ機能がサポートされていません。\n別のブラウザでお試しいただくか、ファイルをアップロードしてください。');
      return;
    }
    
    // 既存のモーダルを削除
    removeExistingCameraModals();
    
    // fileInputがない場合は一時的なものを作成
    let tempFileInput = false;
    if (!fileInput) {
      console.log('ファイル入力が提供されていないため、一時的なものを作成します');
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.id = 'temp-file-input-' + Date.now();
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      tempFileInput = true;
    }
    
    // 新しいカメラモーダルを作成
    const modal = document.createElement('div');
    modal.className = 'modal fade camera-modal';
    modal.id = 'streamlined-camera-modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    
    // ラベルテキストを決定
    let captureText = '写真を撮影';
    let guideText = '書類全体がフレーム内に収まるようにしてください';
    let documentType = '';
    
    // ファイル入力または元のボタンからテキストを推測
    if (fileInput) {
      const sectionId = fileInput.closest('.document-upload-section')?.id || '';
      const isBackSide = fileInput.name?.includes('back') || sectionId.includes('back');
      const isFrontSide = fileInput.name?.includes('front') || sectionId.includes('front');
      
      if (fileInput.id === 'id-photo-input') {
        captureText = '証明写真を撮影';
        guideText = 'あなたの顔がフレーム内に収まるようにしてください';
        documentType = 'id-photo';
      } else if (sectionId.includes('passport') || (sourceButton && sourceButton.textContent.includes('パスポート'))) {
        captureText = 'パスポートを撮影';
        documentType = 'passport';
      } else if (sectionId.includes('license') || (sourceButton && sourceButton.textContent.includes('運転免許証'))) {
        if (isBackSide || (sourceButton && sourceButton.textContent.includes('裏面'))) {
          captureText = '運転免許証(裏面)を撮影';
          documentType = 'license-back';
        } else {
          captureText = '運転免許証(表面)を撮影';
          documentType = 'license-front';
        }
      } else if (sectionId.includes('idcard') || (sourceButton && sourceButton.textContent.includes('マイナンバー'))) {
        if (isBackSide || (sourceButton && sourceButton.textContent.includes('裏面'))) {
          captureText = 'マイナンバーカード(裏面)を撮影';
          documentType = 'idcard-back';
        } else {
          captureText = 'マイナンバーカード(表面)を撮影';
          documentType = 'idcard-front';
        }
      } else if (sectionId.includes('residencecard') || (sourceButton && sourceButton.textContent.includes('在留'))) {
        if (isBackSide || (sourceButton && sourceButton.textContent.includes('裏面'))) {
          captureText = '在留カード(裏面)を撮影';
          documentType = 'residencecard-back';
        } else {
          captureText = '在留カード(表面)を撮影';
          documentType = 'residencecard-front';
        }
      } else if (sourceButton) {
        // ボタンのテキストから文脈を推測
        const btnText = sourceButton.textContent.trim().toLowerCase();
        if (btnText.includes('運転免許証') || btnText.includes('免許証')) {
          if (btnText.includes('裏面')) {
            captureText = '運転免許証(裏面)を撮影';
            documentType = 'license-back';
          } else {
            captureText = '運転免許証(表面)を撮影';
            documentType = 'license-front';
          }
        } else if (btnText.includes('パスポート')) {
          captureText = 'パスポートを撮影';
          documentType = 'passport';
        }
      }
    }
    
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gradient-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-camera-fill me-2"></i>${captureText}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0 position-relative">
            <!-- カメラプレビュー -->
            <div class="camera-container">
              <video id="camera-video" autoplay playsinline class="w-100"></video>
              <canvas id="camera-canvas" class="d-none"></canvas>
              
              <!-- キャプチャオーバーレイ -->
              <div id="capture-overlay" class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                <div class="capture-guide">
                  <div class="guide-text">
                    ${fileInput.id === 'id-photo-input' ? 
                      'あなたの顔がフレーム内に収まるようにしてください' : 
                      '書類全体がフレーム内に収まるようにしてください'}
                  </div>
                </div>
              </div>
              
              <!-- 撮影コントロール -->
              <div id="camera-controls" class="position-absolute bottom-0 start-0 w-100 py-3 px-4">
                <div class="d-flex justify-content-between align-items-center">
                  <button id="switch-camera-btn" class="btn btn-light rounded-circle">
                    <i class="bi bi-arrow-repeat"></i>
                  </button>
                  <button id="capture-btn" class="btn btn-light rounded-circle capture-button">
                    <span class="capture-icon"></span>
                  </button>
                  <button id="camera-cancel-btn" class="btn btn-light rounded-circle" data-bs-dismiss="modal">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              
              <!-- 撮影結果表示 -->
              <div id="capture-result" class="position-absolute top-0 start-0 w-100 h-100 bg-light d-none">
                <img id="captured-image" class="img-fluid capture-preview" src="" alt="撮影画像">
              </div>
            </div>
          </div>
          <div class="modal-footer d-none" id="capture-footer">
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
    
    document.body.appendChild(modal);
    
    // スタイルを追加
    addCameraStyles();
    
    // モーダルを表示してカメラを起動
    const bsModal = new bootstrap.Modal(document.getElementById('streamlined-camera-modal'));
    
    modal.addEventListener('shown.bs.modal', function() {
      startCamera(fileInput);
    });
    
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      setTimeout(() => {
        modal.remove();
      }, 300);
    });
    
    bsModal.show();
  }
  
  /**
   * カメラスタイルをページに追加
   */
  function addCameraStyles() {
    if (document.getElementById('streamlined-camera-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'streamlined-camera-styles';
    style.textContent = `
      .camera-container {
        position: relative;
        background-color: #000;
        overflow: visible;
        max-height: 70vh;
      }
      
      #camera-video {
        width: 100%;
        max-height: 70vh;
        object-fit: cover;
        background-color: #000;
      }
      
      .capture-guide {
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 12px;
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
      
      #camera-controls {
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      }
      
      .capture-button {
        width: 70px;
        height: 70px;
        padding: 0;
        border: 3px solid white;
        background-color: rgba(255, 255, 255, 0.3);
        position: relative;
      }
      
      .capture-button:hover {
        background-color: rgba(255, 255, 255, 0.5);
      }
      
      .capture-icon {
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
      
      #capture-result {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .capture-preview {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
      }
      
      .modal-header.bg-gradient-primary {
        background: linear-gradient(135deg, #0d6efd, #0a58ca);
      }
      
      .preview-success {
        color: #198754;
        background-color: rgba(25, 135, 84, 0.1);
        border-radius: 4px;
        padding: 5px 10px;
        margin-top: 8px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.875rem;
      }
      
      .document-preview-img {
        max-height: 200px;
        object-fit: contain;
        border-radius: 4px;
        border: 1px solid #dee2e6;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * カメラを起動
   */
  function startCamera(fileInput) {
    console.log('カメラを起動しています...');
    const video = document.getElementById('camera-video');
    const captureBtn = document.getElementById('capture-btn');
    const switchBtn = document.getElementById('switch-camera-btn');
    
    if (!video) {
      console.error('カメラビデオ要素が見つかりません');
      return;
    }
    
    // カメラ向きの切り替えボタンのイベント設定
    if (switchBtn) {
      switchBtn.addEventListener('click', function() {
        // カメラストリームを停止
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
        
        // カメラ向きを切り替え
        facingMode = facingMode === 'user' ? 'environment' : 'user';
        console.log('カメラ向きを切り替えました:', facingMode);
        
        // 再度カメラを起動
        startCamera(fileInput);
      });
    }
    
    // 撮影ボタンの設定
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        console.log('撮影ボタンがクリックされました');
        capturePhoto(fileInput);
      });
    }
    
    // カメラ設定（より柔軟な設定に変更）
    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },  // 解像度を下げて互換性を向上
        height: { ideal: 720 }
      },
      audio: false
    };
    
    // エラーハンドリングを強化
    try {
      // カメラが利用可能かどうかをまず確認
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // フォールバックとしてデモモードを提供
        console.error('このブラウザではカメラAPIがサポートされていません');
        showCameraFallback(fileInput);
        return;
      }
      
      // カメラを起動
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          mediaStream = stream;
          video.srcObject = stream;
          
          // ビデオが正常に読み込まれたことを確認
          video.onloadedmetadata = function() {
            video.play().catch(e => {
              console.error('ビデオ再生エラー:', e);
              showCameraFallback(fileInput);
            });
          };
          
          // エラーハンドリング
          video.onerror = function() {
            console.error('ビデオ要素エラー');
            showCameraFallback(fileInput);
          };
          
          // 撮影ボタンのイベントリスナー - 既存のハンドラを削除して再設定
          const newCaptureBtn = captureBtn.cloneNode(true);
          captureBtn.parentNode.replaceChild(newCaptureBtn, captureBtn);
          newCaptureBtn.addEventListener('click', function() {
            capturePhoto(fileInput);
          });
          
          // カメラ切り替えボタンのイベントリスナー
          const newSwitchBtn = switchBtn.cloneNode(true);
          switchBtn.parentNode.replaceChild(newSwitchBtn, switchBtn);
          newSwitchBtn.addEventListener('click', function() {
            facingMode = facingMode === 'environment' ? 'user' : 'environment';
            stopCamera();
            startCamera(fileInput);
          });
        })
        .catch(function(err) {
          console.error('カメラの起動に失敗しました:', err);
          showCameraFallback(fileInput);
        });
    } catch (e) {
      console.error('カメラの初期化中にエラーが発生しました:', e);
      showCameraFallback(fileInput);
    }
  }

  /**
   * カメラが利用できない場合のフォールバック表示
   */
  function showCameraFallback(fileInput) {
    const container = document.querySelector('.camera-container');
    if (!container) return;
    
    // デモモードのUIを表示
    container.innerHTML = `
      <div class="camera-fallback p-4 text-center">
        <div class="alert alert-warning mb-3">
          <h5><i class="bi bi-camera-video-off me-2"></i>カメラにアクセスできません</h5>
          <p class="mb-1">以下の理由が考えられます：</p>
          <ul class="text-start small mb-0">
            <li>カメラへのアクセス許可が拒否されています</li>
            <li>デバイスにカメラが接続されていません</li>
            <li>別のアプリがカメラを使用しています</li>
          </ul>
        </div>
        <div class="mb-3">
          <p>代わりにファイルをアップロードできます：</p>
          <label class="btn btn-primary">
            <i class="bi bi-file-earmark-image me-2"></i>ファイルを選択
            <input type="file" class="d-none" accept="image/*" id="fallback-file-input">
          </label>
        </div>
      </div>
    `;
    
    // ファイル選択のイベントリスナー
    const fallbackInput = document.getElementById('fallback-file-input');
    if (fallbackInput) {
      fallbackInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
          // ファイルを元のinputに転送
          transferFileToInput(fileInput, this.files[0]);
          
          // モーダルを閉じる
          const modal = bootstrap.Modal.getInstance(document.getElementById('streamlined-camera-modal'));
          if (modal) {
            modal.hide();
          }
        }
      });
    }
  }

  /**
   * カメラの写真を撮影
   */
  function capturePhoto(fileInput) {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const captureBtn = document.getElementById('capture-btn');
    
    if (!video || !canvas) {
      console.error('必要な要素が見つかりません。video:', !!video, 'canvas:', !!canvas);
      return;
    }
    
    // キャンバスの設定
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // 映像をキャンバスに描画
    try {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.error('画像キャプチャ中にエラーが発生しました:', err);
      alert('カメラ画像のキャプチャに失敗しました。もう一度お試しください。');
      return;
    }
    
    // 撮影結果を表示
    const captureResult = document.getElementById('capture-result');
    const capturedImage = document.getElementById('captured-image');
    const captureOverlay = document.getElementById('capture-overlay');
    const cameraControls = document.getElementById('camera-controls');
    const captureFooter = document.getElementById('capture-footer');
    
    if (!capturedImage) {
      console.error('撮影画像表示要素が見つかりません');
      return;
    }
    
    // 画像をセット
    try {
      capturedImage.src = canvas.toDataURL('image/jpeg');
    } catch (err) {
      console.error('画像の変換中にエラーが発生しました:', err);
      return;
    }
    
    // 表示を切り替え
    if (captureResult) captureResult.classList.remove('d-none');
    if (captureOverlay) captureOverlay.classList.add('d-none');
    if (cameraControls) cameraControls.classList.add('d-none');
    if (captureFooter) captureFooter.classList.remove('d-none');
    
    // 撮り直しボタンのイベントリスナー
    const retakeBtn = document.getElementById('retake-btn');
    if (retakeBtn) {
      retakeBtn.onclick = function() {
        if (captureResult) captureResult.classList.add('d-none');
        if (captureOverlay) captureOverlay.classList.remove('d-none');
        if (cameraControls) cameraControls.classList.remove('d-none');
        if (captureFooter) captureFooter.classList.add('d-none');
      };
    }
    
    // 写真を使用ボタンのイベントリスナー
    const usePhotoBtn = document.getElementById('use-photo-btn');
    if (usePhotoBtn) {
      usePhotoBtn.onclick = function() {
        // キャンバスから画像ファイルを生成
        canvas.toBlob(function(blob) {
          try {
            // DataTransferを使ってFileListを生成
            const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            
            if (fileInput && fileInput instanceof HTMLInputElement) {
              fileInput.files = dataTransfer.files;
              
              // 変更イベントを発火
              const event = new Event('change', { bubbles: true });
              fileInput.dispatchEvent(event);
            } else {
              console.error('有効なファイル入力が見つかりません');
            }
            
            // モーダルを閉じる
            const modal = bootstrap.Modal.getInstance(document.getElementById('streamlined-camera-modal'));
            if (modal) {
              modal.hide();
            } else {
              removeExistingCameraModals();
            }
          } catch (err) {
            console.error('写真の適用中にエラーが発生しました:', err);
            alert('写真の適用中にエラーが発生しました。もう一度お試しください。');
            removeExistingCameraModals();
          }
        }, 'image/jpeg', 0.92);
      };
    }
  }

  /**
   * カメラを停止
   */
  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
      });
      mediaStream = null;
    }
  }

  /**
   * 既存のカメラモーダルを削除
   */
  function removeExistingCameraModals() {
    const existingModals = document.querySelectorAll('.camera-modal, #modern-camera-modal, #streamlined-camera-modal');
    existingModals.forEach(modal => {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    });
  }

  /**
   * ファイル選択時の処理
   */
  function handleFileSelection(fileInput) {
    console.log('ファイル選択処理を開始...');
    
    if (!fileInput) {
      console.error('fileInputが提供されていません');
      return;
    }
    
    if (!fileInput.files || fileInput.files.length === 0) {
      console.log('ファイルが選択されていません');
      return;
    }
    
    const file = fileInput.files[0];
    console.log('選択されたファイル:', file.name, 'サイズ:', Math.round(file.size / 1024), 'KB');
    
    // セクションを探す（より広範囲に検索）
    const section = fileInput.closest('.document-upload-section, .mb-3, .form-group, .card, .document-upload');
    if (!section) {
      console.error('関連するセクションが見つかりません');
      return;
    }
    
    // ファイル情報の表示
    console.log('ファイル選択処理:', fileInput.id || 'ID無し', file.name);
    
    // プレビュー要素を特定 - より広範囲のセレクタと多段階検索
    let previewImg = section.querySelector('img.preview-img, img.document-preview-img, img[id$="-preview"], img.preview, img.img-preview');
    let previewContainer = section.querySelector('.preview-container, .document-preview, [id$="-preview-container"], .preview, .img-preview-container');
    let placeholder = section.querySelector('.placeholder-container, .upload-prompt, .document-prompt, .no-file-selected');
    
    // セクションID/クラスから特定の要素を検索
    const sectionId = section.id || '';
    if (sectionId) {
      console.log('セクションID:', sectionId);
      // IDベースの特別な処理
      if (sectionId.includes('license')) {
        const isBackSide = fileInput.name?.includes('back');
        if (isBackSide) {
          previewImg = document.querySelector('#license-back-preview, #license-back-img');
        } else {
          previewImg = document.querySelector('#license-front-preview, #license-front-img');
        }
      } else if (sectionId.includes('passport')) {
        previewImg = document.querySelector('#passport-preview, #passport-img');
      } else if (sectionId.includes('idcard')) {
        previewImg = document.querySelector('#idcard-preview, #idcard-img');
      } else if (sectionId.includes('id-photo')) {
        previewImg = document.querySelector('#id-photo-preview, #photo-preview');
      }
    }
    
    // まだプレビュー画像が見つからなければ、より広範囲に検索
    if (!previewImg) {
      console.log('通常の検索でプレビューが見つかりません、より広範囲に検索します');
      previewImg = section.querySelector('img:not(.icon):not(.logo)');
      
      // セクション外にも検索を広げる（特定のケース）
      if (!previewImg && fileInput.id) {
        const relatedId = fileInput.id.replace('input', 'preview').replace('file', 'preview');
        previewImg = document.getElementById(relatedId);
      }
    }
    
    // さらに検索範囲を広げる
    if (!previewImg) {
      previewImg = section.querySelector('img');
    }
    
    // 要素が見つからない場合は作成
    if (!previewImg) {
      console.log('プレビュー画像が見つからないため作成します');
      previewImg = document.createElement('img');
      previewImg.className = 'document-preview-img img-fluid';
      previewImg.alt = 'プレビュー';
      previewImg.style.maxHeight = '200px';
      previewImg.style.objectFit = 'contain';
      
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-3';
        section.appendChild(previewContainer);
      }
      
      previewContainer.appendChild(previewImg);
    }
    
    // プレビューコンテナがまだ見つからない場合は作成
    if (!previewContainer) {
      console.log('プレビューコンテナが見つからないため作成します');
      previewContainer = document.createElement('div');
      previewContainer.className = 'preview-container mt-3';
      
      // プレビュー画像を新しいコンテナに移動
      if (previewImg.parentNode) {
        previewImg.parentNode.removeChild(previewImg);
      }
      
      previewContainer.appendChild(previewImg);
      section.appendChild(previewContainer);
    }
    
    // 画像プレビューを表示
    const reader = new FileReader();
    reader.onload = function(e) {
      console.log('ファイル読み込み完了');
      
      if (previewImg) {
        previewImg.src = e.target.result;
        console.log('プレビュー画像を更新しました');
        
        // 画像が表示されていることを確認
        previewImg.style.display = 'block';
        previewImg.style.visibility = 'visible';
      }
      
      if (previewContainer) {
        previewContainer.classList.remove('d-none');
        previewContainer.style.display = 'block';
      }
      
      if (placeholder) {
        placeholder.classList.add('d-none');
        placeholder.style.display = 'none';
      }
      
      // 関連する削除ボタンを表示（標準セレクタのみ使用）
      let removeBtn = section.querySelector('.remove-btn, [id$="-remove-btn"], button.trash-btn, button.delete-btn');
      
      // ボタン内にアイコンがあるかチェック
      if (!removeBtn) {
        const buttons = section.querySelectorAll('button, .btn');
        for (const btn of buttons) {
          if (btn.querySelector('.bi-trash, .fa-trash')) {
            removeBtn = btn;
            break;
          }
        }
      }
      
      // テキスト内容で探す
      if (!removeBtn) {
        const buttons = section.querySelectorAll('button, .btn');
        for (const btn of buttons) {
          const text = btn.textContent.trim().toLowerCase();
          if (text.includes('削除') || text.includes('消去') || text.includes('クリア')) {
            removeBtn = btn;
            break;
          }
        }
      }
      
      // 削除ボタンが見つからない場合は作成
      if (!removeBtn) {
        removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-danger btn-sm ms-2 remove-btn';
        removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>削除';
        
        // ボタンを適切な場所に配置
        if (previewContainer.parentNode) {
          previewContainer.parentNode.insertBefore(removeBtn, previewContainer.nextSibling);
        } else {
          if (previewImg.parentNode) {
            previewImg.parentNode.insertBefore(removeBtn, previewImg.nextSibling);
          } else {
            section.appendChild(removeBtn);
          }
        }
        
        // 削除ボタンのクリックイベント
        removeBtn.addEventListener('click', function() {
          removeUploadedFile(fileInput);
        });
      }
      
      if (removeBtn) {
        removeBtn.classList.remove('d-none');
        removeBtn.style.display = '';
      }
      
      // 成功メッセージを表示
      const successMsg = document.createElement('div');
      successMsg.className = 'alert alert-success mt-2 small';
      successMsg.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
      
      // 既存のメッセージを削除して新しいメッセージを追加
      const existingMsg = section.querySelector('.alert-success');
      if (existingMsg) {
        existingMsg.remove();
      }
      
      // メッセージを追加
      section.appendChild(successMsg);
    };
    
    reader.readAsDataURL(file);
  }

  /**
   * アップロードしたファイルを削除
   */
  function removeUploadedFile(fileInput) {
    console.log('ファイル削除処理を開始:', fileInput ? fileInput.id || fileInput.className : 'fileInput不明');
    
    // fileInputがHTML要素でない場合（例：削除ボタンが渡された場合）
    if (fileInput && !(fileInput instanceof HTMLInputElement)) {
      console.log('入力が入力要素ではありません。削除ボタンである可能性があります。');
      const deleteBtn = fileInput;
      
      // 削除ボタンのクラスやIDから関連する写真セクションを特定
      const section = deleteBtn.closest('.document-upload-section, .mb-3, .form-group, .card, .document-preview, .preview-container, [id$="-container"]');
      
      if (!section) {
        console.error('セクションが見つかりませんでした。より広範囲に検索します。');
        // 削除ボタンの親要素をたどる
        let currentElement = deleteBtn.parentElement;
        while (currentElement) {
          // 親要素の中にファイル入力があるか探す
          const fileInputInParent = currentElement.querySelector('input[type="file"]');
          if (fileInputInParent) {
            fileInput = fileInputInParent;
            break;
          }
          
          // 上の階層へ
          currentElement = currentElement.parentElement;
          if (!currentElement) break;
        }
        
        // どこにも見つからなければ全体から探す
        if (!fileInput) {
          fileInput = document.querySelector('input[type="file"]');
        }
        
        if (!fileInput) {
          console.error('関連するファイル入力が見つかりませんでした');
          return;
        }
      } else {
        // 関連するファイル入力要素を見つける
        fileInput = section.querySelector('input[type="file"]');
        
        if (!fileInput) {
          // 親要素に遡って検索
          let parentEl = section.parentElement;
          while (parentEl && !fileInput) {
            fileInput = parentEl.querySelector('input[type="file"]');
            parentEl = parentEl.parentElement;
            if (!parentEl) break;
          }
        }
      }
    }
    
    // fileInputがある場合はリセット
    if (fileInput && fileInput instanceof HTMLInputElement) {
      fileInput.value = '';
    } else {
      console.error('有効なファイル入力が見つかりませんでした');
      return;
    }
    
    // セクションを特定
    const section = fileInput.closest('.document-upload-section, .mb-3, .form-group, .card');
    if (!section) {
      console.error('セクションが見つかりませんでした');
      return;
    }
    
    // プレビュー要素を非表示
    const previewElements = section.querySelectorAll('.preview-container, .document-preview, [id$="-preview-container"], img.preview-img, img.document-preview-img, img[id$="-preview"]');
    previewElements.forEach(el => {
      el.classList.add('d-none');
      el.style.display = 'none';
    });
    
    // プレースホルダを表示
    const placeholders = section.querySelectorAll('.placeholder-container, .upload-prompt, .document-prompt, .no-file-selected');
    placeholders.forEach(el => {
      el.classList.remove('d-none');
      el.style.display = '';
    });
    
    // 削除ボタンを非表示
    const removeButtons = section.querySelectorAll('.remove-btn, [id$="-remove-btn"], button.trash-btn, button.delete-btn');
    removeButtons.forEach(btn => {
      btn.classList.add('d-none');
      btn.style.display = 'none';
    });
    
    // 成功メッセージを削除
    const successMessages = section.querySelectorAll('.alert-success, .preview-success');
    successMessages.forEach(msg => msg.remove());
    
    console.log('ファイル削除処理が完了しました');
  }

  // 即時実行関数でページロード時に各種コントロールを設定
  (function init() {
    // DOMが完全に読み込まれた後に実行
    setupAllDocumentControls();
    
    // 動的に追加された要素に対応するためのMutationObserver
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // 新しいモーダルや要素が追加された場合にハンドラを再設定
          const modalAdded = Array.from(mutation.addedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && (
              node.classList?.contains('modal') || 
              node.querySelector?.('.modal')
            )
          );
          
          if (modalAdded) {
            console.log('新しいモーダルが検出されました。コントロールを再設定します。');
            setupAllDocumentControls();
          }
        }
      });
    });
    
    // 全体のDOM変更を監視
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('カメラと写真アップロード機能の初期化が完了しました');
  })();
});