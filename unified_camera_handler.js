/**
 * 統合カメラハンドラー
 * カメラ撮影とプレビュー表示に関する全機能を集約したスクリプト
 */
(function() {
  'use strict';

  // 既存のハンドラーとの競合を避けるためのフラグ
  window.unifiedCameraHandlerInitialized = false;

  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', initUnifiedCameraHandler);

  /**
   * 初期化
   */
  function initUnifiedCameraHandler() {
    if (window.unifiedCameraHandlerInitialized) return;
    window.unifiedCameraHandlerInitialized = true;

    console.log('統合カメラハンドラーを初期化しています...');

    // モーダル表示のイベントを監視
    setupModalObserver();

    // カメラボタンの設定
    document.querySelectorAll('.document-camera, .camera-btn').forEach(setupCameraButton);

    // DOMの変更を監視して動的に追加されたカメラボタンを設定
    const domObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 追加されたノード内のカメラボタンを設定
              node.querySelectorAll('.document-camera, .camera-btn').forEach(setupCameraButton);
            }
          });
        }
      });
    });

    // DOMの変更監視を開始
    domObserver.observe(document.body, { childList: true, subtree: true });

    console.log('統合カメラハンドラーの初期化が完了しました');
  }

  /**
   * モーダル表示のイベントを監視
   */
  function setupModalObserver() {
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // カメラモーダルが表示された場合
      if (modal.id === 'cameraModal') {
        setupCameraModalEvents(modal);
      }
      
      // 書類アップロードモーダルが表示された場合
      if (modal.id === 'idDocumentModal' || modal.id === 'touristRegisterModal') {
        modal.querySelectorAll('.document-camera, .camera-btn').forEach(setupCameraButton);
        setupPreviewHandlers(modal);
      }
    });
  }

  /**
   * カメラボタンの設定
   * @param {HTMLElement} button カメラボタン要素
   */
  function setupCameraButton(button) {
    if (!button || button.hasAttribute('data-camera-handler-attached')) return;
    
    button.setAttribute('data-camera-handler-attached', 'true');
    button.addEventListener('click', function(event) {
      event.preventDefault();
      
      // 関連するファイル入力要素を特定
      let targetInput = null;
      
      // 直接data属性で指定されている場合
      if (button.dataset.targetInput) {
        targetInput = document.getElementById(button.dataset.targetInput);
      } else {
        // ボタンの親要素から探す
        const parent = button.closest('.input-group, .document-upload-section, .form-group');
        if (parent) {
          targetInput = parent.querySelector('input[type="file"]');
        }
      }
      
      if (targetInput) {
        createAndShowCameraModal(targetInput);
      } else {
        console.error('関連するファイル入力要素が見つかりません');
      }
    });
    
    console.log('カメラボタンを設定しました:', button);
  }

  /**
   * カメラモーダルを作成して表示
   * @param {HTMLInputElement} fileInput 関連するファイル入力要素
   */
  function createAndShowCameraModal(fileInput) {
    // 既存のカメラモーダルを削除
    const existingModal = document.getElementById('cameraModal');
    if (existingModal) {
      const modalInstance = bootstrap.Modal.getInstance(existingModal);
      if (modalInstance) modalInstance.dispose();
      existingModal.remove();
    }
    
    // カメラストリームがあれば停止
    if (window.activeStream) {
      window.activeStream.getTracks().forEach(track => track.stop());
      window.activeStream = null;
    }
    
    // モーダルHTMLを作成
    const modalHTML = `
      <div class="modal fade" id="cameraModal" tabindex="-1" aria-labelledby="cameraModalLabel" aria-hidden="true" data-target-input="${fileInput.id}">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="cameraModalLabel"><i class="bi bi-camera"></i> 写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="ratio ratio-4x3 mb-3">
                <video id="cameraPreview" class="w-100 h-100" autoplay playsinline></video>
              </div>
              <div id="cameraFeedback" class="alert d-none"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" id="captureButton" disabled>
                <i class="bi bi-camera-fill"></i> 撮影
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 新しく作成したモーダル要素を取得
    const modalElement = document.getElementById('cameraModal');
    
    // Bootstrapモーダルを初期化
    const modal = new bootstrap.Modal(modalElement, {
      backdrop: 'static',
      keyboard: false
    });
    
    // モーダルが閉じられた時のイベント
    modalElement.addEventListener('hidden.bs.modal', function() {
      // カメラストリームを停止
      if (window.activeStream) {
        window.activeStream.getTracks().forEach(track => track.stop());
        window.activeStream = null;
      }
    });
    
    // モーダルが表示された時のイベント
    modalElement.addEventListener('shown.bs.modal', function() {
      // カメラを起動
      initializeCamera();
    });
    
    // モーダルを表示
    modal.show();
  }

  /**
   * カメラモーダルのイベントを設定
   * @param {HTMLElement} modal モーダル要素
   */
  function setupCameraModalEvents(modal) {
    console.log('カメラモーダルのイベントを設定しています');
    
    // カメラ要素の取得
    const video = document.getElementById('cameraPreview');
    const captureButton = document.getElementById('captureButton');
    
    if (!video || !captureButton) {
      console.error('カメラプレビューまたは撮影ボタンが見つかりません');
      return;
    }
    
    // 撮影ボタンのクリックイベント
    captureButton.onclick = function() {
      capturePhoto();
    };
    
    // iOSのSafariはautoplayに制限があるため、ユーザー操作を検出
    video.addEventListener('click', function() {
      if (video.paused) {
        video.play();
      }
    });
  }

  /**
   * カメラを初期化
   */
  function initializeCamera() {
    const video = document.getElementById('cameraPreview');
    const captureButton = document.getElementById('captureButton');
    const feedbackDiv = document.getElementById('cameraFeedback');
    
    if (!video || !captureButton || !feedbackDiv) {
      console.error('カメラ要素が見つかりません');
      return;
    }
    
    // フィードバックをリセット
    feedbackDiv.className = 'alert d-none';
    feedbackDiv.textContent = '';
    captureButton.disabled = true;
    
    // カメラにアクセス
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    })
    .then(function(stream) {
      // グローバル変数に保存してモーダルが閉じられた時に停止できるようにする
      window.activeStream = stream;
      
      // ビデオ要素にストリームを設定
      video.srcObject = stream;
      
      // ビデオが読み込まれたら撮影ボタンを有効化
      video.onloadedmetadata = function() {
        captureButton.disabled = false;
        console.log('カメラのセットアップが完了しました');
      };
    })
    .catch(function(error) {
      console.error('カメラへのアクセスに失敗しました:', error);
      feedbackDiv.className = 'alert alert-danger';
      
      switch (error.name) {
        case 'NotAllowedError':
          feedbackDiv.textContent = 'カメラへのアクセスが許可されていません。ブラウザの設定でカメラアクセスを許可してください。';
          break;
        case 'NotFoundError':
          feedbackDiv.textContent = 'カメラが見つかりません。デバイスにカメラが接続されているか確認してください。';
          break;
        case 'NotReadableError':
          feedbackDiv.textContent = 'カメラにアクセスできません。他のアプリケーションがカメラを使用している可能性があります。';
          break;
        default:
          feedbackDiv.textContent = `カメラエラー: ${error.message}`;
      }
    });
  }

  /**
   * 写真を撮影
   */
  function capturePhoto() {
    const modalElement = document.getElementById('cameraModal');
    const video = document.getElementById('cameraPreview');
    
    if (!modalElement || !video || !video.srcObject) {
      console.error('写真撮影に必要な要素が見つかりません');
      return;
    }
    
    // キャンバスを作成して写真を取得
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // JPEGとしてデータURLを取得
    canvas.toBlob(function(blob) {
      // ファイル名を生成（タイムスタンプを含める）
      const fileName = `photo_${Date.now()}.jpg`;
      
      // Fileオブジェクトを作成
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // 関連するファイル入力要素を取得
      const targetInputId = modalElement.getAttribute('data-target-input');
      const fileInput = document.getElementById(targetInputId);
      
      if (fileInput) {
        // DataTransferオブジェクトを使用してFileListを作成
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // 変更イベントを発火してプレビューを更新
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        
        console.log('写真を撮影し、入力に設定しました:', fileName);
      }
      
      // モーダルを閉じる
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      // カメラストリームを停止
      if (window.activeStream) {
        window.activeStream.getTracks().forEach(track => track.stop());
        window.activeStream = null;
      }
    }, 'image/jpeg', 0.95);
  }

  /**
   * プレビューハンドラーの設定
   * @param {HTMLElement} container プレビューコンテナ
   */
  function setupPreviewHandlers(container) {
    // プレビュー要素
    const previewElements = container.querySelectorAll('.preview-container img');
    
    previewElements.forEach(function(img) {
      img.onclick = function() {
        // 画像クリック時に大きいプレビューを表示
        showLargePreview(this.src);
      };
    });
    
    // ファイル入力要素
    container.querySelectorAll('input[type="file"]').forEach(function(input) {
      if (input.hasAttribute('data-preview-handler-attached')) return;
      
      input.setAttribute('data-preview-handler-attached', 'true');
      
      input.addEventListener('change', function(event) {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          const reader = new FileReader();
          
          reader.onload = function(e) {
            // プレビュー表示するDOMセレクターを特定
            let previewSelector = null;
            
            // data-preview属性が設定されている場合
            if (input.dataset.preview) {
              previewSelector = input.dataset.preview;
            } else {
              // ファイル入力要素のIDからプレビュー要素を推測
              const inputId = input.id;
              if (inputId) {
                previewSelector = `#${inputId}-preview`;
              }
            }
            
            if (previewSelector) {
              const previewContainer = document.querySelector(previewSelector);
              if (previewContainer) {
                updatePreview(previewContainer, e.target.result, file.name);
              }
            }
          };
          
          reader.readAsDataURL(file);
        }
      });
    });
  }

  /**
   * プレビュー表示を更新
   * @param {HTMLElement} container プレビューコンテナ
   * @param {string} imageUrl 画像URL
   * @param {string} fileName ファイル名
   */
  function updatePreview(container, imageUrl, fileName) {
    // 既存のプレビュー画像をチェック
    let imgElement = container.querySelector('img');
    
    if (!imgElement) {
      // 画像要素がなければ作成
      imgElement = document.createElement('img');
      container.appendChild(imgElement);
    }
    
    // 画像ソースを設定
    imgElement.src = imageUrl;
    imgElement.alt = fileName;
    imgElement.title = fileName;
    imgElement.className = 'preview-image';
    
    // クリックイベントを設定
    imgElement.onclick = function() {
      showLargePreview(imageUrl);
    };
    
    // コンテナの表示状態を更新
    container.style.display = 'block';
    
    // 削除ボタンが存在するか確認
    let removeButton = container.querySelector('.remove-btn');
    
    if (!removeButton) {
      // 削除ボタンを作成
      removeButton = document.createElement('button');
      removeButton.className = 'btn btn-sm btn-danger remove-btn';
      removeButton.innerHTML = '<i class="bi bi-trash"></i> 削除';
      container.appendChild(removeButton);
    }
    
    // 削除ボタンのクリックイベントを設定
    removeButton.onclick = function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // 関連するファイル入力要素を特定
      let fileInput = null;
      
      // data-input属性が設定されている場合
      if (container.dataset.input) {
        fileInput = document.getElementById(container.dataset.input);
      } else {
        // コンテナのIDからファイル入力要素を推測
        const containerId = container.id;
        if (containerId && containerId.endsWith('-preview')) {
          const inputId = containerId.replace('-preview', '');
          fileInput = document.getElementById(inputId);
        }
      }
      
      if (fileInput) {
        // ファイル入力をリセット
        fileInput.value = '';
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
      
      // プレビューをクリア
      imgElement.src = '';
      imgElement.style.display = 'none';
      removeButton.style.display = 'none';
    };
  }

  /**
   * 大きいプレビューを表示
   * @param {string} imageUrl 画像URL
   */
  function showLargePreview(imageUrl) {
    // 既存のプレビューモーダルを削除
    const existingModal = document.getElementById('previewModal');
    if (existingModal) {
      const modalInstance = bootstrap.Modal.getInstance(existingModal);
      if (modalInstance) modalInstance.dispose();
      existingModal.remove();
    }
    
    // プレビューモーダルHTMLを作成
    const modalHTML = `
      <div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="previewModalLabel"><i class="bi bi-image"></i> 画像プレビュー</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <img src="${imageUrl}" class="img-fluid" style="max-height: 70vh;">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 新しく作成したモーダル要素を取得
    const modalElement = document.getElementById('previewModal');
    
    // Bootstrapモーダルを初期化して表示
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  // パブリックAPIを設定
  window.unifiedCameraHandler = {
    setupCameraButton: setupCameraButton,
    createAndShowCameraModal: createAndShowCameraModal,
    setupPreviewHandlers: setupPreviewHandlers
  };
})();