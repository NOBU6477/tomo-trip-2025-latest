/**
 * オリジナルカメラ UI を尊重した修正スクリプト
 * シンプルかつ効果的に問題を解決します
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('オリジナルカメラ修正を初期化しています');
  
  // グローバル変数
  let mediaStream = null;
  let currentFileInput = null;
  
  // 初期化関数
  function init() {
    setupCameraButtons();
    setupRemoveButtons();
    setupDocumentTypeListener();
  }
  
  // カメラボタンを設定
  function setupCameraButtons() {
    // カメラボタンを見つける（クラスと内容に基づいて）
    const cameraButtons = document.querySelectorAll('button:has(.bi-camera), button.camera-btn, button[id*="camera"], button:contains("カメラ"), button:contains("撮影")');
    
    if (cameraButtons.length === 0) {
      // より広範囲な検索（アイコンまたはテキスト内容）
      document.querySelectorAll('button, .btn').forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('カメラ') || text.includes('撮影') || 
            button.innerHTML.includes('camera') || 
            button.querySelector('.fa-camera, .bi-camera')) {
          button.classList.add('camera-btn');
        }
      });
    }
    
    // イベントリスナーを設定
    document.addEventListener('click', function(e) {
      // カメラボタンをクリックしたかどうかを判断
      if (isOrContainsCameraButton(e.target)) {
        e.preventDefault();
        
        // 関連するファイル入力を見つける
        const fileInput = findRelatedFileInput(e.target);
        if (!fileInput) {
          console.error('カメラボタンに関連するファイル入力が見つかりません');
          return;
        }
        
        // カメラを開く
        openCamera(fileInput);
      }
    });
  }
  
  // カメラボタンかどうかを判断
  function isOrContainsCameraButton(element) {
    if (!element || !element.tagName) return false;
    
    // 要素自体がボタンかどうか
    if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
      const text = element.textContent.toLowerCase();
      if (text.includes('カメラ') || text.includes('撮影') || 
          element.innerHTML.includes('camera') || 
          element.classList.contains('camera-btn') || 
          element.id && element.id.includes('camera')) {
        return true;
      }
      
      // カメラアイコンを含むか
      if (element.querySelector('.fa-camera, .bi-camera')) {
        return true;
      }
    }
    
    // 親要素がカメラボタンかどうか（アイコンをクリックした場合）
    const parent = element.parentElement;
    if (parent && (parent.tagName === 'BUTTON' || parent.classList.contains('btn'))) {
      return isOrContainsCameraButton(parent);
    }
    
    return false;
  }
  
  // ボタンに関連するファイル入力を見つける
  function findRelatedFileInput(button) {
    // ボタン自体がinput要素の場合
    if (button.tagName === 'INPUT' && button.type === 'file') {
      return button;
    }
    
    // 親要素を探す
    const targetButton = button.closest('button, .btn');
    if (!targetButton) return null;
    
    // ファイル入力のIDパターン
    let possibleIds = [];
    
    // IDからパターンを生成
    if (targetButton.id) {
      const baseId = targetButton.id.replace('-camera-btn', '').replace('-camera', '').replace('-btn', '');
      possibleIds = [
        `${baseId}-input`,
        `${baseId}_input`,
        baseId + 'Input',
        baseId
      ];
    }
    
    // テキスト内容からIDパターンを追加
    const text = targetButton.textContent.toLowerCase().trim();
    if (text.includes('運転免許証')) {
      if (text.includes('裏面')) {
        possibleIds.push('license-back-input', 'driver-license-back', 'license-back');
      } else {
        possibleIds.push('license-front-input', 'driver-license-front', 'license-front');
      }
    } else if (text.includes('パスポート')) {
      possibleIds.push('passport-input', 'passport');
    } else if (text.includes('証明写真')) {
      possibleIds.push('id-photo-input', 'photo-id', 'id-photo');
    }
    
    // 生成したIDでファイル入力を検索
    for (const id of possibleIds) {
      const input = document.getElementById(id);
      if (input && input.type === 'file') {
        return input;
      }
    }
    
    // 親要素内のファイル入力を検索
    const section = targetButton.closest('.form-group, .mb-3, .document-upload-section');
    if (section) {
      const fileInput = section.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    // 最後の手段：ドキュメント内の最初のファイル入力
    return document.querySelector('input[type="file"]');
  }
  
  // カメラを開く
  function openCamera(fileInput) {
    console.log('カメラを開きます');
    currentFileInput = fileInput;
    
    // カメラボタンの親要素を取得（モーダルタイトルの決定に使用）
    const buttonContainer = fileInput.closest('.form-group, .mb-3, .document-upload-section');
    
    // ドキュメントタイプを特定
    let documentType = 'document';
    let title = '書類を撮影';
    let isIdPhoto = false;
    
    if (fileInput.id) {
      if (fileInput.id.includes('license')) {
        if (fileInput.id.includes('back')) {
          documentType = 'license-back';
          title = '運転免許証(裏面)を撮影';
        } else {
          documentType = 'license-front';
          title = '運転免許証(表面)を撮影';
        }
      } else if (fileInput.id.includes('passport')) {
        documentType = 'passport';
        title = 'パスポートを撮影';
      } else if (fileInput.id.includes('photo')) {
        documentType = 'id-photo';
        title = '証明写真を撮影';
        isIdPhoto = true;
      }
    }
    
    // セレクタから推測
    if (buttonContainer) {
      const label = buttonContainer.querySelector('label');
      if (label) {
        const labelText = label.textContent.toLowerCase();
        if (labelText.includes('運転免許証')) {
          if (labelText.includes('裏面')) {
            documentType = 'license-back';
            title = '運転免許証(裏面)を撮影';
          } else {
            documentType = 'license-front';
            title = '運転免許証(表面)を撮影';
          }
        } else if (labelText.includes('パスポート')) {
          documentType = 'passport';
          title = 'パスポートを撮影';
        } else if (labelText.includes('写真')) {
          documentType = 'id-photo';
          title = '証明写真を撮影';
          isIdPhoto = true;
        }
      }
    }
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'camera-modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
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
              <canvas id="camera-canvas" style="display:none;"></canvas>
              
              <div id="capture-guide" class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                <div class="capture-frame">
                  <div class="guide-text">
                    ${isIdPhoto ? 'あなたの顔がフレーム内に収まるようにしてください' : '書類全体がフレーム内に収まるようにしてください'}
                  </div>
                </div>
              </div>
              
              <div id="capture-result" class="position-absolute top-0 start-0 w-100 h-100 bg-dark d-none">
                <img id="captured-image" class="w-100 h-100 object-fit-contain" src="" alt="撮影画像">
              </div>
              
              <div id="camera-controls" class="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark d-flex justify-content-between align-items-center">
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
            </div>
          </div>
          <div class="modal-footer d-none" id="result-footer">
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
    
    // モーダルが表示されたときの処理
    modal.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダルが閉じられたときの処理
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      modal.remove();
    });
    
    // モーダルを表示
    bsModal.show();
    
    // カメラ起動
    function startCamera() {
      const video = document.getElementById('camera-video');
      const switchBtn = document.getElementById('switch-camera-btn');
      const captureBtn = document.getElementById('capture-btn');
      
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
      
      // カメラを要求
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          mediaStream = stream;
          video.srcObject = stream;
          
          // カメラ切り替えボタンの処理
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
                  console.error('カメラの切り替えに失敗しました:', err);
                });
            });
          }
          
          // 撮影ボタンの処理
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
          <div class="alert alert-warning">
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
      const captureResult = document.getElementById('capture-result');
      const capturedImage = document.getElementById('captured-image');
      const captureGuide = document.getElementById('capture-guide');
      const cameraControls = document.getElementById('camera-controls');
      const resultFooter = document.getElementById('result-footer');
      
      if (!video || !canvas || !captureResult || !capturedImage) return;
      
      // キャンバスのサイズを設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 映像をキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像を表示
      capturedImage.src = canvas.toDataURL('image/jpeg');
      
      // UIを切り替え
      captureResult.classList.remove('d-none');
      if (captureGuide) captureGuide.classList.add('d-none');
      if (cameraControls) cameraControls.classList.add('d-none');
      if (resultFooter) resultFooter.classList.remove('d-none');
      
      // 撮り直しボタンの処理
      const retakeBtn = document.getElementById('retake-btn');
      if (retakeBtn) {
        retakeBtn.onclick = function() {
          captureResult.classList.add('d-none');
          if (captureGuide) captureGuide.classList.remove('d-none');
          if (cameraControls) cameraControls.classList.remove('d-none');
          if (resultFooter) resultFooter.classList.add('d-none');
        };
      }
      
      // 写真を使用ボタンの処理
      const usePhotoBtn = document.getElementById('use-photo-btn');
      if (usePhotoBtn) {
        usePhotoBtn.onclick = function() {
          usePhoto(capturedImage.src);
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
          
          // DataTransferオブジェクトを使用してファイルリストを作成
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
    
    // カメラを停止
    function stopCamera() {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
    }
  }
  
  // 削除ボタンを設定
  function setupRemoveButtons() {
    // 既存の処理を解除するため、クリックイベントを一度解除
    document.removeEventListener('click', handleRemoveButtonClick);
    
    // 新しいイベントリスナーを追加
    document.addEventListener('click', handleRemoveButtonClick);
  }
  
  // 削除ボタンのクリックを処理
  function handleRemoveButtonClick(e) {
    // 削除ボタンかどうかを判断
    if (isOrContainsRemoveButton(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      
      // 関連するファイル入力を見つける
      const section = e.target.closest('.form-group, .mb-3, .document-upload-section');
      if (!section) return;
      
      const fileInput = section.querySelector('input[type="file"]');
      if (!fileInput) return;
      
      // ファイル入力をリセット
      fileInput.value = '';
      
      // 画像プレビューを削除
      const previewImg = section.querySelector('img.preview-img, img[id$="-preview"], img.document-preview');
      if (previewImg) {
        previewImg.src = '';
        const previewContainer = previewImg.closest('.preview-container, [id$="-preview-container"]');
        if (previewContainer) {
          previewContainer.classList.add('d-none');
        } else {
          previewImg.classList.add('d-none');
        }
      }
      
      // プレースホルダを表示
      const placeholder = section.querySelector('.placeholder, .upload-placeholder, .upload-prompt');
      if (placeholder) {
        placeholder.classList.remove('d-none');
      }
      
      // 削除ボタンを非表示
      e.target.classList.add('d-none');
      
      // 成功メッセージを削除
      const successMessage = section.querySelector('.alert-success, .success-message');
      if (successMessage) {
        successMessage.remove();
      }
    }
  }
  
  // 削除ボタンかどうかを判断
  function isOrContainsRemoveButton(element) {
    if (!element || !element.tagName) return false;
    
    // 要素自体がボタンかどうか
    if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
      const text = element.textContent.toLowerCase();
      if (text.includes('削除') || text.includes('クリア') || text.includes('消去') || 
          element.classList.contains('delete-btn') || element.classList.contains('remove-btn') || 
          element.id && (element.id.includes('delete') || element.id.includes('remove'))) {
        return true;
      }
      
      // ゴミ箱アイコンを含むか
      if (element.querySelector('.fa-trash, .bi-trash')) {
        return true;
      }
    }
    
    // ゴミ箱アイコン自体
    if (element.classList && (element.classList.contains('fa-trash') || element.classList.contains('bi-trash'))) {
      return true;
    }
    
    // 親要素が削除ボタンかどうか
    const parent = element.parentElement;
    if (parent && (parent.tagName === 'BUTTON' || parent.classList.contains('btn'))) {
      return isOrContainsRemoveButton(parent);
    }
    
    return false;
  }
  
  // 書類タイプの選択を監視
  function setupDocumentTypeListener() {
    document.addEventListener('change', function(e) {
      // セレクト要素の変更を監視
      if (e.target.tagName === 'SELECT') {
        const select = e.target;
        const value = select.value;
        
        // 運転免許証が選択された場合
        if (value === '運転免許証' || value.includes('license')) {
          handleDriverLicenseSelection(select);
        }
      }
    });
    
    // 既存の選択肢をチェック
    document.querySelectorAll('select').forEach(select => {
      const value = select.value;
      if (value === '運転免許証' || value.includes('license')) {
        handleDriverLicenseSelection(select);
      }
    });
  }
  
  // 運転免許証選択時の処理
  function handleDriverLicenseSelection(select) {
    // セクションを見つける
    const section = select.closest('.document-section, .card, form');
    if (!section) return;
    
    // 裏面のセクションがあるか確認
    const hasDualSection = section.querySelector('.back-side, [id*="back"], [id*="dual"]');
    if (hasDualSection) return; // 既に裏面セクションがある場合は何もしない
    
    // 表面のファイル入力を見つける
    const frontFileInput = section.querySelector('input[type="file"]');
    if (!frontFileInput) return;
    
    // 表面セクションのコンテナを見つける
    const frontContainer = frontFileInput.closest('.form-group, .mb-3, .document-upload-section');
    if (!frontContainer) return;
    
    // 裏面セクションを作成
    const backContainer = frontContainer.cloneNode(true);
    
    // IDと名前を更新
    const backFileInput = backContainer.querySelector('input[type="file"]');
    if (backFileInput) {
      const oldId = backFileInput.id;
      const newId = oldId.replace('front', 'back').replace('input', 'back-input');
      backFileInput.id = newId;
      backFileInput.name = newId;
      backFileInput.value = ''; // 値をクリア
      
      // ラベルも更新
      const label = backContainer.querySelector('label');
      if (label) {
        label.textContent = label.textContent.replace('表面', '裏面');
        if (label.getAttribute('for')) {
          label.setAttribute('for', newId);
        }
      }
      
      // その他のテキストも更新
      backContainer.innerHTML = backContainer.innerHTML.replace('表面', '裏面');
      
      // プレビュー要素も更新
      const previewImg = backContainer.querySelector('img');
      if (previewImg) {
        const oldPreviewId = previewImg.id;
        previewImg.id = oldPreviewId.replace('front', 'back');
        previewImg.src = '';
      }
    }
    
    // 必要なテキスト要素を追加
    const dualPhotoText = document.createElement('div');
    dualPhotoText.className = 'mt-3 mb-2 text-center';
    dualPhotoText.innerHTML = '両面をアップロードしてください';
    
    // 親要素に挿入
    const parent = frontContainer.parentNode;
    parent.insertBefore(dualPhotoText, frontContainer.nextSibling);
    parent.insertBefore(backContainer, dualPhotoText.nextSibling);
  }
  
  // カメラスタイルを追加
  function addCameraStyles() {
    // 既存のスタイルが存在する場合は追加しない
    if (document.getElementById('camera-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'camera-styles';
    style.textContent = `
      .camera-container {
        position: relative;
        background-color: #000;
        max-height: calc(100vh - 200px);
        min-height: 300px;
        overflow: visible;
      }
      
      #camera-video {
        width: 100%;
        max-height: calc(100vh - 200px);
        min-height: 300px;
        object-fit: cover;
      }
      
      .capture-frame {
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
      }
      
      #camera-controls {
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
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
      
      #capture-result {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #switch-camera-btn, #close-camera-btn {
        width: 50px;
        height: 50px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .bg-gradient-dark {
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // ファイル変更時のプレビュー処理
  function handleFileInputChange(e) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
      // セクションを見つける
      const section = e.target.closest('.form-group, .mb-3, .document-upload-section');
      if (!section) return;
      
      // プレビュー要素を見つける
      let previewImg = section.querySelector('img.preview-img, img[id$="-preview"], img.document-preview');
      
      // プレビュー要素がない場合は作成
      if (!previewImg) {
        previewImg = document.createElement('img');
        previewImg.className = 'preview-img img-fluid mt-2 border rounded';
        previewImg.style.maxHeight = '200px';
        previewImg.alt = 'プレビュー';
        
        // 配置する場所を見つける
        const container = section.querySelector('.preview-container, [id$="-preview-container"]');
        if (container) {
          container.appendChild(previewImg);
          container.classList.remove('d-none');
        } else {
          // コンテナがない場合は作成
          const newContainer = document.createElement('div');
          newContainer.className = 'preview-container mt-2';
          newContainer.appendChild(previewImg);
          
          // ファイル入力の後に配置
          e.target.parentNode.insertBefore(newContainer, e.target.nextSibling);
        }
      }
      
      // 画像を設定
      previewImg.src = event.target.result;
      previewImg.classList.remove('d-none');
      
      // プレースホルダを非表示
      const placeholder = section.querySelector('.placeholder, .upload-placeholder, .upload-prompt');
      if (placeholder) {
        placeholder.classList.add('d-none');
      }
      
      // 成功メッセージを表示
      const existingSuccess = section.querySelector('.alert-success, .success-message');
      if (existingSuccess) {
        existingSuccess.remove();
      }
      
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success mt-2 small';
      successMessage.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
      section.appendChild(successMessage);
      
      // 削除ボタンを表示
      let removeBtn = section.querySelector('.remove-btn, .delete-btn, button[id*="remove"], button[id*="delete"]');
      
      // 削除ボタンがない場合は作成
      if (!removeBtn) {
        removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-danger btn-sm mt-2 remove-btn';
        removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>削除';
        
        // 配置する場所を見つける
        const previewContainer = previewImg.closest('.preview-container');
        if (previewContainer) {
          previewContainer.appendChild(removeBtn);
        } else {
          section.appendChild(removeBtn);
        }
      }
      
      removeBtn.classList.remove('d-none');
    };
    
    reader.readAsDataURL(file);
  }
  
  // ファイル入力の変更イベントを監視
  function setupFileInputListeners() {
    document.addEventListener('change', function(e) {
      if (e.target.tagName === 'INPUT' && e.target.type === 'file') {
        handleFileInputChange(e);
      }
    });
  }
  
  // 初期化
  init();
  setupFileInputListeners();
});