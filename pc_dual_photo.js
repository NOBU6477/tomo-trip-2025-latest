/**
 * PC向け表裏写真機能
 * PCブラウザでの表裏写真（運転免許証等）の撮影を可能にする
 * スマートフォン版には影響を与えない
 */
(function() {
  'use strict';

  // PC環境のみ実行
  if (isMobileDevice()) {
    console.log('モバイルデバイスを検出したため、PC用表裏写真機能をスキップします');
    return;
  }
  
  console.log('PC用表裏写真機能を初期化中...');
  
  // グローバル状態
  const state = {
    frontPhoto: null,
    backPhoto: null,
    dualModeActive: false,
    currentForm: null
  };
  
  // 初期化
  function init() {
    // DOMロード完了後に初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupEventHandlers);
    } else {
      setupEventHandlers();
    }
  }
  
  // モバイルデバイスかどうかを検出
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // イベントハンドラのセットアップ
  function setupEventHandlers() {
    // モーダル表示イベント
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // 登録フォーム内のモーダルかどうかをチェック
      if (isRegistrationModal(modal)) {
        setupDualPhotoInModal(modal);
      }
    });
    
    // 既存モーダルのチェック
    checkExistingModals();
  }
  
  // 既存のモーダルをチェック
  function checkExistingModals() {
    setTimeout(function() {
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        if (isRegistrationModal(modal)) {
          setupDualPhotoInModal(modal);
        }
      });
    }, 500);
  }
  
  // 登録モーダルかどうかを判定
  function isRegistrationModal(modal) {
    if (!modal) return false;
    
    // モーダルID、タイトル、内容から判断
    if (modal.id && (modal.id.includes('tourist') || modal.id.includes('guide'))) {
      return true;
    }
    
    const title = modal.querySelector('.modal-title');
    if (title && title.textContent && 
        (title.textContent.includes('登録') || 
         title.textContent.includes('サインアップ'))) {
      return true;
    }
    
    return false;
  }
  
  // モーダル内に表裏写真機能をセットアップ
  function setupDualPhotoInModal(modal) {
    console.log('モーダル内の表裏写真機能をセットアップ');
    
    // セレクトボックスの処理
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      // 既存選択のチェック
      checkForDriverLicense(select);
      
      // 変更イベントの監視
      select.addEventListener('change', function() {
        checkForDriverLicense(this);
      });
    });
    
    // カメラボタンの処理
    setupCameraButtonCapture(modal);
  }
  
  // カメラボタンのキャプチャを設定
  function setupCameraButtonCapture(modal) {
    const cameraButtons = modal.querySelectorAll('button');
    
    cameraButtons.forEach(function(button) {
      if (button.textContent && 
          (button.textContent.includes('カメラ') || 
           button.textContent.includes('撮影'))) {
        
        // 元のクリックハンドラを保存
        const originalClick = button.onclick;
        
        // 新しいクリックハンドラ
        button.onclick = function(event) {
          if (state.dualModeActive) {
            event.preventDefault();
            event.stopPropagation();
            
            // 現在のフォームを保存
            state.currentForm = findParentForm(button);
            
            // 表面か裏面の撮影
            if (!state.frontPhoto) {
              openCamera('front');
            } else if (!state.backPhoto) {
              openCamera('back');
            }
            
            return false;
          } else if (originalClick) {
            // 元のハンドラを実行
            return originalClick.call(this, event);
          }
        };
      }
    });
  }
  
  // 親のフォームを探す
  function findParentForm(element) {
    if (!element) return null;
    
    // フォーム要素を上に辿る
    let current = element;
    while (current) {
      if (current.tagName === 'FORM') {
        return current;
      }
      if (current.classList && current.classList.contains('modal')) {
        return current;
      }
      current = current.parentElement;
    }
    
    return null;
  }
  
  // 運転免許証が選択されているかチェック
  function checkForDriverLicense(select) {
    if (!select || !select.options || select.selectedIndex < 0) return;
    
    try {
      const selectedOption = select.options[select.selectedIndex];
      if (!selectedOption) return;
      
      const text = selectedOption.textContent || '';
      if (text.toLowerCase().includes('運転') && 
          text.toLowerCase().includes('免許')) {
        // 運転免許証検出
        console.log('運転免許証選択を検出');
        
        const form = findParentForm(select);
        if (form) {
          activateDualMode(form);
        }
      }
    } catch (e) {
      console.error('運転免許証チェックエラー:', e);
    }
  }
  
  // 表裏モード有効化
  function activateDualMode(form) {
    if (!form) return;
    
    state.dualModeActive = true;
    state.frontPhoto = null;
    state.backPhoto = null;
    state.currentForm = form;
    
    // 写真エリアを探す
    const photoArea = findPhotoArea(form);
    if (!photoArea) {
      console.warn('写真エリアが見つかりません');
      return;
    }
    
    // ステータス表示を追加
    let statusElement = form.querySelector('.dual-photo-status');
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.className = 'dual-photo-status alert alert-info mt-2';
      statusElement.style.fontSize = '0.9rem';
      statusElement.style.padding = '0.5rem';
      statusElement.style.borderRadius = '4px';
      photoArea.appendChild(statusElement);
    }
    
    statusElement.textContent = '表裏写真モード: 表面から撮影してください';
    statusElement.style.display = 'block';
    
    // 裏面用の隠しフィールドを追加
    addHiddenFields(form);
    
    console.log('表裏写真モードを有効化しました');
  }
  
  // 写真エリアを探す
  function findPhotoArea(container) {
    const selectors = [
      '.photo-preview',
      '.photo-container',
      '.form-group',
      '.mb-3'
    ];
    
    // 指定セレクタに一致する要素を探す
    for (const selector of selectors) {
      const elements = container.querySelectorAll(selector);
      for (const el of elements) {
        // 画像またはファイル入力を含む要素を探す
        if (el.querySelector('img') || 
            el.querySelector('input[type="file"]')) {
          return el;
        }
      }
    }
    
    // 代替方法: ファイル入力を持つ要素を直接探す
    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      return fileInput.parentElement;
    }
    
    return null;
  }
  
  // 隠しフィールドを追加
  function addHiddenFields(container) {
    if (!container) return;
    
    // すでに存在するかチェック
    if (container.querySelector('#back-photo-data')) return;
    
    try {
      // フォームを探す
      const form = container.querySelector('form') || container;
      
      // 裏面写真用フィールド
      const backPhotoField = document.createElement('input');
      backPhotoField.type = 'hidden';
      backPhotoField.id = 'back-photo-data';
      backPhotoField.name = 'backPhotoData';
      form.appendChild(backPhotoField);
      
      // 写真モード用フィールド
      const photoModeField = document.createElement('input');
      photoModeField.type = 'hidden';
      photoModeField.id = 'photo-mode-field';
      photoModeField.name = 'photoMode';
      photoModeField.value = 'dual';
      form.appendChild(photoModeField);
      
      console.log('隠しフィールドを追加しました');
    } catch (e) {
      console.error('隠しフィールド追加エラー:', e);
    }
  }
  
  // カメラを開く
  function openCamera(side) {
    console.log(side + '面のカメラを開きます');
    
    const modalId = 'pc-camera-' + Date.now();
    
    // モーダルHTML
    const html = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header" style="background-color: #3984ff; color: white;">
              <h5 class="modal-title">${side === 'front' ? '表面' : '裏面'}の写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-wrapper">
                <video id="video-${modalId}" autoplay playsinline style="width: 100%; background-color: #000;"></video>
                <canvas id="canvas-${modalId}" style="display: none;"></canvas>
                <div id="result-${modalId}" style="display: none;">
                  <img id="preview-${modalId}" style="width: 100%;" />
                </div>
                <div class="alert alert-info mt-2 py-2">カメラを起動しています...</div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary capture-btn" style="background-color: #3984ff;">撮影</button>
              <button type="button" class="btn btn-secondary retake-btn" style="display: none;">撮り直す</button>
              <button type="button" class="btn btn-success use-btn" style="display: none; background-color: #43a047;">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    document.body.insertAdjacentHTML('beforeend', html);
    
    // 要素取得
    const modalEl = document.getElementById(modalId);
    const videoEl = document.getElementById('video-' + modalId);
    const canvasEl = document.getElementById('canvas-' + modalId);
    const resultEl = document.getElementById('result-' + modalId);
    const previewEl = document.getElementById('preview-' + modalId);
    const feedbackEl = modalEl.querySelector('.alert');
    const captureBtn = modalEl.querySelector('.capture-btn');
    const retakeBtn = modalEl.querySelector('.retake-btn');
    const useBtn = modalEl.querySelector('.use-btn');
    
    // モーダル初期化
    const modal = new bootstrap.Modal(modalEl);
    
    // ストリーム参照
    let stream = null;
    
    // カメラ起動
    function startCamera() {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      })
      .then(function(mediaStream) {
        stream = mediaStream;
        videoEl.srcObject = mediaStream;
        videoEl.onloadedmetadata = function() {
          videoEl.play();
          feedbackEl.textContent = 'カメラの準備ができました。撮影ボタンを押してください';
          feedbackEl.className = 'alert alert-success mt-2 py-2';
        };
      })
      .catch(function(err) {
        console.error('カメラアクセスエラー:', err);
        feedbackEl.textContent = 'カメラにアクセスできません: ' + err.message;
        feedbackEl.className = 'alert alert-danger mt-2 py-2';
      });
    }
    
    // 写真撮影
    function capture() {
      if (!stream) {
        feedbackEl.textContent = 'カメラが利用できません';
        feedbackEl.className = 'alert alert-danger mt-2 py-2';
        return;
      }
      
      try {
        // キャンバスにビデオフレームを描画
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        const ctx = canvasEl.getContext('2d');
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        
        // プレビュー表示
        previewEl.src = canvasEl.toDataURL('image/png');
        
        // 表示切替
        videoEl.style.display = 'none';
        resultEl.style.display = 'block';
        captureBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-block';
        useBtn.style.display = 'inline-block';
        
        // フィードバック
        feedbackEl.textContent = '写真を確認してください';
        feedbackEl.className = 'alert alert-success mt-2 py-2';
      } catch (e) {
        console.error('撮影エラー:', e);
        feedbackEl.textContent = '撮影中にエラーが発生しました: ' + e.message;
        feedbackEl.className = 'alert alert-danger mt-2 py-2';
      }
    }
    
    // 撮り直し
    function retake() {
      videoEl.style.display = 'block';
      resultEl.style.display = 'none';
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      useBtn.style.display = 'none';
      
      feedbackEl.textContent = 'もう一度撮影してください';
      feedbackEl.className = 'alert alert-info mt-2 py-2';
    }
    
    // 写真を使用
    function usePhoto() {
      try {
        // データURL取得
        const dataURL = canvasEl.toDataURL('image/png');
        
        if (side === 'front') {
          // 表面写真を保存
          state.frontPhoto = dataURL;
          updatePreviewImage(dataURL);
          
          // メインのファイル入力を更新
          updateFileInput(dataURL);
          
          // 次は裏面撮影
          modal.hide();
          setTimeout(function() {
            openCamera('back');
          }, 500);
        } else {
          // 裏面写真を保存
          state.backPhoto = dataURL;
          updateBackPhotoField(dataURL);
          modal.hide();
        }
        
        // ステータス更新
        updateStatus();
      } catch (e) {
        console.error('写真使用エラー:', e);
        feedbackEl.textContent = '写真の処理中にエラーが発生しました: ' + e.message;
        feedbackEl.className = 'alert alert-danger mt-2 py-2';
      }
    }
    
    // プレビュー画像を更新
    function updatePreviewImage(dataURL) {
      if (!state.currentForm) return;
      
      const previewImg = state.currentForm.querySelector('.photo-preview img') || 
                         state.currentForm.querySelector('img[alt="写真プレビュー"]') || 
                         state.currentForm.querySelector('img[alt="Photo Preview"]');
      
      if (previewImg) {
        previewImg.src = dataURL;
        previewImg.style.display = 'block';
      }
    }
    
    // ファイル入力を更新
    function updateFileInput(dataURL) {
      if (!state.currentForm) return;
      
      try {
        const fileInput = state.currentForm.querySelector('input[type="file"][accept*="image"]');
        if (!fileInput) return;
        
        // DataURLからBlobを作成
        const byteString = atob(dataURL.split(',')[1]);
        const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeType });
        const file = new File([blob], 'front-photo.png', { type: mimeType });
        
        // DataTransferを使用してFileListを作成（可能な場合）
        if (window.DataTransfer) {
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInput.files = dt.files;
          
          // 変更イベント発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
        }
      } catch (e) {
        console.error('ファイル入力更新エラー:', e);
      }
    }
    
    // 裏面写真フィールドを更新
    function updateBackPhotoField(dataURL) {
      if (!state.currentForm) return;
      
      const backField = state.currentForm.querySelector('#back-photo-data');
      if (backField) {
        backField.value = dataURL;
      }
    }
    
    // ステータス表示を更新
    function updateStatus() {
      if (!state.currentForm) return;
      
      const statusEl = state.currentForm.querySelector('.dual-photo-status');
      if (!statusEl) return;
      
      if (state.frontPhoto && state.backPhoto) {
        statusEl.textContent = '表裏写真モード: 表面と裏面の両方の写真が設定されました';
        statusEl.className = 'dual-photo-status alert alert-success mt-2';
      } else if (state.frontPhoto) {
        statusEl.textContent = '表裏写真モード: 表面の写真が設定されました。次に裏面を撮影してください。';
        statusEl.className = 'dual-photo-status alert alert-warning mt-2';
      } else if (state.backPhoto) {
        statusEl.textContent = '表裏写真モード: 裏面の写真が設定されました。表面も撮影してください。';
        statusEl.className = 'dual-photo-status alert alert-warning mt-2';
      } else {
        statusEl.textContent = '表裏写真モード: 表面から撮影してください';
        statusEl.className = 'dual-photo-status alert alert-info mt-2';
      }
    }
    
    // カメラストリームの停止
    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    }
    
    // イベントリスナーの設定
    captureBtn.addEventListener('click', capture);
    retakeBtn.addEventListener('click', retake);
    useBtn.addEventListener('click', usePhoto);
    
    // モーダル開始時にカメラ起動
    modalEl.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダル終了時にカメラ停止
    modalEl.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      
      // DOMから削除
      setTimeout(function() {
        if (document.body.contains(modalEl)) {
          document.body.removeChild(modalEl);
        }
      }, 300);
    });
    
    // モーダル表示
    modal.show();
  }
  
  // 初期化実行
  init();
})();