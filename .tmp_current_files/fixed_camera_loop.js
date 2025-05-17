/**
 * 表裏カメラの無限ループ問題を解決するスクリプト
 * PC環境で表裏写真撮影機能が繰り返し表示される問題を修正
 */
(function() {
  'use strict';

  // PC環境のみ実行 - スマートフォンには影響を与えない
  if (isMobileDevice()) {
    console.log('モバイルデバイスを検出: PC用カメラ修正をスキップします');
    return;
  }

  // グローバル変数
  const state = {
    // 現在開いているモーダル
    currentCameraModal: null,
    // 表面写真のデータURL
    frontPhoto: null,
    // 裏面写真のデータURL
    backPhoto: null,
    // 裏面の撮影中かどうか
    isBackSide: false,
    // ストリーム参照
    stream: null,
    // 写真保存先の要素ID
    targetInputId: null,
    // 写真タイプ (front/back)
    photoType: null
  };

  // 初期化
  function init() {
    console.log('カメラループ修正スクリプトを初期化中...');
    
    // DOMの読み込みが完了したら実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
      setupEventListeners();
    }
  }

  // モバイルデバイスかどうかを判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // イベントリスナーの設定
  function setupEventListeners() {
    // カメラモーダルを捕捉するためのイベントリスナー
    document.addEventListener('show.bs.modal', function(event) {
      const modal = event.target;
      
      // カメラモーダルかどうかを確認
      if (isCameraModal(modal)) {
        state.currentCameraModal = modal;
        handleCameraModal(modal);
      }
    });

    // 既存の撮影ボタンを上書き
    interceptCaptureButtons();
    
    // 身分証明書タイプの選択変更を監視
    monitorIdDocumentTypeChange();
  }

  // 身分証明書タイプの選択変更を監視
  function monitorIdDocumentTypeChange() {
    document.addEventListener('change', function(event) {
      if (event.target.tagName === 'SELECT') {
        const select = event.target;
        const options = select.options;
        const selectedText = options[select.selectedIndex] ? options[select.selectedIndex].textContent : '';
        
        if (selectedText.includes('運転免許証') || selectedText.includes('Driver')) {
          console.log('運転免許証が選択されました: 表裏写真モードを有効化');
          notifyDualPhotoMode(select);
        }
      }
    });
  }

  // 表裏写真モードであることを通知
  function notifyDualPhotoMode(selectElement) {
    // 既存の通知を確認
    const container = findParentContainer(selectElement);
    if (!container) return;
    
    let notificationElement = container.querySelector('.dual-photo-notice');
    
    // 通知要素がなければ作成
    if (!notificationElement) {
      notificationElement = document.createElement('div');
      notificationElement.className = 'dual-photo-notice alert alert-info mt-2';
      notificationElement.style.fontSize = '14px';
      notificationElement.style.padding = '8px 12px';
      
      // フォームグループの後に挿入
      const formGroups = container.querySelectorAll('.form-group, .mb-3');
      if (formGroups.length > 0) {
        formGroups[formGroups.length - 1].after(notificationElement);
      } else {
        container.appendChild(notificationElement);
      }
    }
    
    // 通知テキスト設定
    notificationElement.textContent = '運転免許証は表と裏の両方の写真が必要です。表面撮影後に裏面も撮影してください。';
    notificationElement.style.display = 'block';
  }

  // 親コンテナを探す
  function findParentContainer(element) {
    let current = element;
    
    // 最大10階層まで上に探索
    for (let i = 0; i < 10; i++) {
      if (!current) return null;
      
      // .card, .modal-body などの主要コンテナを探す
      if (current.classList && (
          current.classList.contains('card') || 
          current.classList.contains('modal-body') || 
          current.classList.contains('container') ||
          current.classList.contains('form')
      )) {
        return current;
      }
      
      current = current.parentElement;
    }
    
    return null;
  }

  // カメラモーダルかどうかを判定
  function isCameraModal(modal) {
    if (!modal) return false;
    
    // モーダルタイトルでカメラモーダルかを判断
    const title = modal.querySelector('.modal-title');
    if (title && title.textContent) {
      const titleText = title.textContent.toLowerCase();
      return (
        titleText.includes('写真') || 
        titleText.includes('撮影') || 
        titleText.includes('photo') || 
        titleText.includes('camera')
      );
    }
    
    // モーダル内にビデオ要素があるかで判断
    const hasVideo = modal.querySelector('video');
    return !!hasVideo;
  }

  // カメラモーダルのハンドリング
  function handleCameraModal(modal) {
    console.log('カメラモーダルを検出しました');
    
    // モーダルタイトルを確認して表面か裏面かを判定
    const title = modal.querySelector('.modal-title');
    if (title && title.textContent) {
      const titleText = title.textContent;
      
      // タイトルに「表面」または「裏面」の文字があるか確認
      if (titleText.includes('表面')) {
        state.photoType = 'front';
        state.isBackSide = false;
        console.log('表面の撮影モードを検出しました');
      } else if (titleText.includes('裏面')) {
        state.photoType = 'back';
        state.isBackSide = true;
        console.log('裏面の撮影モードを検出しました');
      } else {
        // 汎用ケース
        if (state.frontPhoto && !state.backPhoto) {
          // 表面の写真が既にあれば裏面と判断
          state.photoType = 'back';
          state.isBackSide = true;
          console.log('表面写真が既に存在: 裏面撮影と判断');
          
          // タイトルを裏面用に更新
          title.textContent = '裏面の写真を撮影';
        } else {
          state.photoType = 'front';
          state.isBackSide = false;
          console.log('通常撮影: 表面と判断');
        }
      }
    }
    
    // 撮影ボタンを設定
    setupModalButton(modal);
  }

  // 撮影ボタンを設定
  function setupModalButton(modal) {
    if (!modal) return;
    
    // 標準的なセレクタで撮影ボタンを探す
    const captureButton = modal.querySelector('button.capture-btn') || 
                          findButtonByText(modal, '撮影');
    
    if (captureButton) {
      console.log('撮影ボタンを検出、クリックイベントを設定します');
      
      // 既存のイベントハンドラを保持
      const originalClick = captureButton.onclick;
      
      // 新しいイベントハンドラ
      captureButton.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log(`写真撮影: ${state.isBackSide ? '裏面' : '表面'}`);
        
        // カスタム撮影処理
        capturePhoto(modal);
        
        return false;
      };
    }
  }
  
  // テキスト内容でボタンを探す汎用関数
  function findButtonByText(container, text) {
    if (!container) return null;
    
    const buttons = container.querySelectorAll('button');
    for (const button of buttons) {
      if (button.textContent && button.textContent.includes(text)) {
        return button;
      }
    }
    return null;
  }

  // 撮影ボタンのインターセプト
  function interceptCaptureButtons() {
    // クリックイベントをグローバルでインターセプト
    document.addEventListener('click', function(event) {
      const target = event.target;
      
      // 撮影ボタンかどうかを判定
      if (target.tagName === 'BUTTON' && 
          state.currentCameraModal && 
          (target.textContent.includes('撮影') || 
           target.classList.contains('capture-btn'))) {
        
        // カメラモーダル内のボタンかどうか確認
        if (isElementInModal(target, state.currentCameraModal)) {
          event.preventDefault();
          event.stopPropagation();
          
          console.log('撮影ボタンのクリックをインターセプトしました');
          capturePhoto(state.currentCameraModal);
          
          return false;
        }
      }
    }, true);  // キャプチャフェーズでイベントをインターセプト
  }

  // 要素がモーダル内にあるかどうかをチェック
  function isElementInModal(element, modal) {
    if (!element || !modal) return false;
    
    let current = element;
    while (current) {
      if (current === modal) return true;
      current = current.parentElement;
    }
    
    return false;
  }

  // 写真撮影処理
  function capturePhoto(modal) {
    if (!modal) return;
    
    try {
      // ビデオ要素の取得
      const video = modal.querySelector('video');
      if (!video) {
        console.error('ビデオ要素が見つかりません');
        return;
      }
      
      // キャンバス要素の取得または作成
      let canvas = modal.querySelector('canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        video.parentElement.appendChild(canvas);
        canvas.style.display = 'none';
      }
      
      // ビデオのサイズをキャンバスに設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // キャンバスにビデオフレームを描画
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      const dataURL = canvas.toDataURL('image/png');
      
      if (state.isBackSide) {
        // 裏面写真を保存
        state.backPhoto = dataURL;
        console.log('裏面写真を保存しました');
        
        // 裏面プレビュー画像を更新
        updateBackPreview(dataURL);
        
        // 両方の写真がそろったので保存
        saveDualPhotos(modal);
      } else {
        // 表面写真を保存
        state.frontPhoto = dataURL;
        console.log('表面写真を保存しました');
        
        // 一旦モーダルを閉じる
        closeModal(modal);
        
        // 裏面撮影へ進む
        setTimeout(function() {
          openBackSideCamera(modal);
        }, 500);
      }
    } catch (error) {
      console.error('写真撮影エラー:', error);
    }
  }
  
  // 裏面プレビュー画像を更新
  function updateBackPreview(dataURL) {
    try {
      // すべての裏面プレビュー画像を探す
      const backPreviewImages = document.querySelectorAll('.back-preview-image');
      for (const img of backPreviewImages) {
        img.src = dataURL;
        img.style.display = 'block';
        
        // プレースホルダーを非表示
        const placeholder = img.parentElement?.querySelector('.back-placeholder');
        if (placeholder) {
          placeholder.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('裏面プレビュー更新エラー:', error);
    }
  }

  // 両方の写真を保存
  function saveDualPhotos(modal) {
    console.log('表裏両方の写真を保存します');
    
    try {
      // 表面写真を元のフィールドに保存
      savePhotoToField();
      
      // 裏面写真用の隠しフィールドを追加または更新
      const backPhotoField = ensureBackPhotoField();
      if (backPhotoField) {
        backPhotoField.value = state.backPhoto;
      }
      
      // 写真モード状態を保存
      const photoModeField = ensurePhotoModeField();
      if (photoModeField) {
        photoModeField.value = 'dual';
      }
      
      // モーダルを閉じる
      closeModal(modal);
      
      // 完了メッセージを表示
      showCompletionNotice();
      
      // 状態をリセット
      resetState();
    } catch (error) {
      console.error('写真保存エラー:', error);
    }
  }

  // 表面写真をフィールドに保存
  function savePhotoToField() {
    if (!state.frontPhoto) return;
    
    try {
      // フォーム内のファイル入力を探す
      const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
      if (fileInputs.length === 0) {
        console.warn('写真用のファイル入力が見つかりません');
        return;
      }
      
      // DataURLからBlobを作成
      const byteString = atob(state.frontPhoto.split(',')[1]);
      const mimeType = state.frontPhoto.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeType });
      const file = new File([blob], 'front-photo.png', { type: mimeType });
      
      // プレビュー画像を更新
      updatePhotoPreview(file);
      
      // ファイル入力を更新（可能な場合）
      // DataTransferを使用してFileListを作成
      if (window.DataTransfer) {
        for (const fileInput of fileInputs) {
          try {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            
            // 変更イベント発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            console.log('ファイル入力を更新しました');
          } catch (e) {
            console.warn('ファイル入力更新エラー:', e);
          }
        }
      }
    } catch (error) {
      console.error('表面写真保存エラー:', error);
    }
  }

  // プレビュー画像を更新
  function updatePhotoPreview(file) {
    try {
      // プレビュー画像を探す
      const previewImages = document.querySelectorAll('img.preview-image, img[alt="写真プレビュー"], img[alt="Photo Preview"]');
      
      if (previewImages.length === 0) {
        console.warn('プレビュー画像が見つかりません');
        return;
      }
      
      // FileReaderを使ってファイルを読み込む
      const reader = new FileReader();
      reader.onload = function(e) {
        // すべてのプレビュー画像を更新
        for (const img of previewImages) {
          img.src = e.target.result;
          img.style.display = 'block';
        }
        console.log('プレビュー画像を更新しました');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('プレビュー画像更新エラー:', error);
    }
  }

  // 裏面写真用の隠しフィールドを確保
  function ensureBackPhotoField() {
    // 既存のフィールドを確認
    let backField = document.getElementById('back-photo-data');
    
    if (!backField) {
      // 新しいフィールドを作成
      backField = document.createElement('input');
      backField.type = 'hidden';
      backField.id = 'back-photo-data';
      backField.name = 'backPhotoData';
      
      // フォームまたはボディに追加
      const form = document.querySelector('form');
      if (form) {
        form.appendChild(backField);
      } else {
        document.body.appendChild(backField);
      }
      
      console.log('裏面写真用フィールドを作成しました');
    }
    
    return backField;
  }

  // 写真モードフィールドを確保
  function ensurePhotoModeField() {
    // 既存のフィールドを確認
    let modeField = document.getElementById('photo-mode-field');
    
    if (!modeField) {
      // 新しいフィールドを作成
      modeField = document.createElement('input');
      modeField.type = 'hidden';
      modeField.id = 'photo-mode-field';
      modeField.name = 'photoMode';
      
      // フォームまたはボディに追加
      const form = document.querySelector('form');
      if (form) {
        form.appendChild(modeField);
      } else {
        document.body.appendChild(modeField);
      }
      
      console.log('写真モード用フィールドを作成しました');
    }
    
    return modeField;
  }

  // 完了通知を表示
  function showCompletionNotice() {
    // ページ内の既存の通知を探す
    const existingNotices = document.querySelectorAll('.dual-photo-notice');
    
    if (existingNotices.length > 0) {
      // 既存の通知を更新
      for (const notice of existingNotices) {
        notice.textContent = '運転免許証の表裏両方の写真が正常に保存されました。';
        notice.className = 'dual-photo-notice alert alert-success mt-2';
      }
    } else {
      // 新しい通知を作成
      const notice = document.createElement('div');
      notice.className = 'dual-photo-notice alert alert-success mt-2';
      notice.textContent = '運転免許証の表裏両方の写真が正常に保存されました。';
      
      // フォームの後に挿入
      const form = document.querySelector('form');
      if (form) {
        form.after(notice);
      } else {
        document.body.appendChild(notice);
      }
    }
    
    console.log('完了通知を表示しました');
  }

  // 裏面カメラを開く
  function openBackSideCamera() {
    console.log('裏面撮影カメラを開きます');
    
    try {
      // 既存のカメラモーダルがあれば閉じる
      const existingModals = document.querySelectorAll('.modal.show');
      for (const modal of existingModals) {
        if (isCameraModal(modal)) {
          closeModal(modal);
        }
      }
      
      // モーダルID生成
      const modalId = 'backside-camera-' + Date.now();
      
      // 裏面カメラモーダルHTML
      const html = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">裏面の写真を撮影</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="camera-wrapper">
                  <video id="video-${modalId}" autoplay playsinline style="width: 100%; background-color: #000;"></video>
                  <canvas id="canvas-${modalId}" style="display: none;"></canvas>
                  <div class="alert alert-info mt-2">運転免許証の裏面を撮影してください</div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary capture-btn">撮影</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // DOMに追加
      document.body.insertAdjacentHTML('beforeend', html);
      
      // モーダル要素の取得
      const modalEl = document.getElementById(modalId);
      
      // 裏面モードを設定
      state.isBackSide = true;
      state.photoType = 'back';
      state.currentCameraModal = modalEl;
      
      // カメラを開始
      const video = modalEl.querySelector('video');
      if (video) {
        startCamera(video, modalEl);
      }
      
      // モーダル表示
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      
      console.log('裏面撮影モーダルを表示しました');
    } catch (error) {
      console.error('裏面カメラオープンエラー:', error);
    }
  }

  // カメラを開始
  function startCamera(video, modal) {
    const constraints = { 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio: false
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        // ストリーム保存
        state.stream = stream;
        
        // ビデオにストリームを設定
        video.srcObject = stream;
        video.onloadedmetadata = function() {
          video.play();
        };
        
        console.log('カメラストリームを開始しました');
      })
      .catch(function(err) {
        console.error('カメラアクセスエラー:', err);
        
        // エラーメッセージ表示
        const alertEl = modal.querySelector('.alert');
        if (alertEl) {
          alertEl.textContent = 'カメラにアクセスできません: ' + err.message;
          alertEl.className = 'alert alert-danger mt-2';
        }
      });
  }

  // カメラを停止
  function stopCamera() {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
      state.stream = null;
      console.log('カメラストリームを停止しました');
    }
  }

  // モーダルを閉じる
  function closeModal(modal) {
    if (!modal) return;
    
    try {
      // bootstrapのモーダルクラスからインスタンスを取得
      const modalInstance = bootstrap.Modal.getInstance(modal);
      
      if (modalInstance) {
        // カメラを停止
        stopCamera();
        
        // モーダルを閉じる
        modalInstance.hide();
        console.log('モーダルを閉じました');
      } else {
        // データ属性で閉じる
        modal.setAttribute('data-bs-dismiss', 'modal');
        modal.click();
      }
    } catch (error) {
      console.error('モーダルクローズエラー:', error);
    }
  }

  // 状態をリセット
  function resetState() {
    state.currentCameraModal = null;
    state.frontPhoto = null;
    state.backPhoto = null;
    state.isBackSide = false;
    state.stream = null;
    state.targetInputId = null;
    state.photoType = null;
    
    console.log('状態をリセットしました');
  }

  // 初期化実行
  init();
})();