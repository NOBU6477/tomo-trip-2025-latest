/**
 * 超シンプルな表裏写真機能の実装
 * 基本的なDOM操作のみを使用し、エラーを極力回避
 */
(function() {
  // グローバル変数
  let hasFrontPhoto = false;
  let hasBackPhoto = false;
  let dualModeActive = false;
  let currentContainer = null;
  
  // 初期化関数
  function init() {
    console.log('表裏写真機能: 初期化中...');
    
    // DOMコンテンツロード後に適用
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
      setupEventListeners();
    }
  }
  
  // イベントリスナーのセットアップ
  function setupEventListeners() {
    // モーダル表示時
    window.addEventListener('click', function(event) {
      // 登録ボタンのクリック検出
      if (event.target && event.target.tagName === 'BUTTON') {
        const text = event.target.textContent || '';
        if (text.includes('登録') || text.includes('サインアップ') || text.includes('Sign up')) {
          setTimeout(checkForRegistrationModals, 500);
        }
      }
      
      // カメラボタンのクリック
      if (dualModeActive && event.target && event.target.tagName === 'BUTTON') {
        const text = event.target.textContent || '';
        if (text.includes('カメラ') || text.includes('撮影') || text.includes('Camera')) {
          const modalParent = findParentModal(event.target);
          if (modalParent) {
            event.preventDefault();
            event.stopPropagation();
            
            currentContainer = modalParent;
            
            if (!hasFrontPhoto) {
              openSimpleCamera('front');
            } else if (!hasBackPhoto) {
              openSimpleCamera('back');
            }
            
            return false;
          }
        }
      }
    });
    
    // セレクトボックスの変更検出
    document.addEventListener('change', function(event) {
      if (event.target && event.target.tagName === 'SELECT') {
        const select = event.target;
        checkForDriverLicense(select);
      }
    });
    
    // 既存のモーダルをチェック
    setTimeout(checkForRegistrationModals, 1000);
  }
  
  // 登録モーダルのチェック
  function checkForRegistrationModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if (modal) {
        // モーダル内のセレクトボックスを処理
        const selects = modal.querySelectorAll('select');
        selects.forEach(checkForDriverLicense);
      }
    });
  }
  
  // 親モーダルを探す
  function findParentModal(element) {
    if (!element) return null;
    
    let current = element;
    while (current) {
      if (current.classList && current.classList.contains('modal')) {
        return current;
      }
      current = current.parentElement;
    }
    
    return null;
  }
  
  // 運転免許証が選択されたかチェック
  function checkForDriverLicense(select) {
    if (!select || !select.options) return;
    
    try {
      const selectedOption = select.options[select.selectedIndex];
      if (!selectedOption) return;
      
      const text = selectedOption.textContent || '';
      if (text.includes('運転') && text.includes('免許')) {
        // 運転免許証が選択された
        const modal = findParentModal(select);
        if (modal) {
          activateDualPhotoMode(modal);
        }
      }
    } catch (e) {
      console.error('運転免許証チェックエラー:', e);
    }
  }
  
  // 表裏写真モードを有効化
  function activateDualPhotoMode(modal) {
    if (!modal) return;
    
    dualModeActive = true;
    hasFrontPhoto = false;
    hasBackPhoto = false;
    currentContainer = modal;
    
    // 写真エリアを探す
    const photoArea = findPhotoArea(modal);
    if (!photoArea) return;
    
    // ステータス表示を追加/更新
    let statusEl = modal.querySelector('.dual-photo-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'dual-photo-status alert alert-info mt-2';
      statusEl.style.fontSize = '0.9rem';
      statusEl.style.padding = '0.5rem';
      photoArea.appendChild(statusEl);
    }
    
    statusEl.textContent = '表裏写真モード: 表面から撮影してください';
    
    // 裏面写真用のフィールドを追加
    addHiddenFields(modal);
    
    console.log('表裏写真モード有効化');
  }
  
  // 写真エリアを探す
  function findPhotoArea(modal) {
    if (!modal) return null;
    
    // 候補を確認
    const candidates = [
      '.photo-preview',
      '.photo-container',
      '.form-group:has(input[type="file"])',
      '.mb-3:has(input[type="file"])'
    ];
    
    for (const selector of candidates) {
      try {
        const element = modal.querySelector(selector);
        if (element) return element;
      } catch (e) {
        // サポートされていないセレクタの場合はスキップ
      }
    }
    
    // プレビュー画像から探す
    const img = modal.querySelector('img[alt="写真プレビュー"]') || 
                modal.querySelector('img[alt="Photo Preview"]');
    if (img && img.parentElement) {
      return img.parentElement;
    }
    
    // ファイル入力から探す
    const fileInput = modal.querySelector('input[type="file"][accept*="image"]');
    if (fileInput && fileInput.parentElement) {
      return fileInput.parentElement;
    }
    
    return null;
  }
  
  // 隠しフィールドを追加
  function addHiddenFields(modal) {
    if (!modal) return;
    
    // すでに存在するかチェック
    if (modal.querySelector('#back-photo-field')) return;
    
    try {
      // フォームを探す
      const form = modal.querySelector('form') || modal;
      
      // 裏面写真用フィールド
      const backField = document.createElement('input');
      backField.type = 'hidden';
      backField.id = 'back-photo-field';
      backField.name = 'backPhotoData';
      form.appendChild(backField);
      
      // モード用フィールド
      const modeField = document.createElement('input');
      modeField.type = 'hidden';
      modeField.id = 'photo-mode-field';
      modeField.name = 'photoMode';
      modeField.value = 'dual';
      form.appendChild(modeField);
    } catch (e) {
      console.error('隠しフィールド追加エラー:', e);
    }
  }
  
  // シンプルなカメラを開く
  function openSimpleCamera(side) {
    console.log(side + 'カメラを開きます');
    
    // ID生成
    const uniqueId = 'camera-' + Date.now();
    
    // HTMLを作成 - サイトの既存スタイルに合わせる
    const html = `
      <div class="modal fade" id="${uniqueId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header" style="background-color: #3984ff; color: white;">
              <h5 class="modal-title">${side === 'front' ? '表面' : '裏面'}の写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="color: white;"></button>
            </div>
            <div class="modal-body">
              <div class="camera-wrapper">
                <video id="video-${uniqueId}" autoplay playsinline style="width: 100%; background-color: #000;"></video>
                <canvas id="canvas-${uniqueId}" style="display: none;"></canvas>
                <div id="result-${uniqueId}" style="display: none;">
                  <img id="preview-${uniqueId}" style="width: 100%;" />
                </div>
                <div class="alert alert-success mt-2 py-2" style="background-color: #e8f5e9; border-color: #c8e6c9; color: #2e7d32;">カメラを起動しています...</div>
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
    
    // 要素参照
    const modalEl = document.getElementById(uniqueId);
    const videoEl = document.getElementById('video-' + uniqueId);
    const canvasEl = document.getElementById('canvas-' + uniqueId);
    const resultEl = document.getElementById('result-' + uniqueId);
    const previewEl = document.getElementById('preview-' + uniqueId);
    const alertEl = modalEl.querySelector('.alert');
    const captureBtn = modalEl.querySelector('.capture-btn');
    const retakeBtn = modalEl.querySelector('.retake-btn');
    const useBtn = modalEl.querySelector('.use-btn');
    
    // モーダル初期化
    const modal = new bootstrap.Modal(modalEl);
    
    // メディアストリーム
    let stream = null;
    
    // カメラ起動
    function startCamera() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(mediaStream) {
          stream = mediaStream;
          videoEl.srcObject = mediaStream;
          videoEl.play();
          alertEl.textContent = 'カメラの準備ができました。撮影ボタンを押してください';
          alertEl.className = 'alert alert-success mt-2';
        })
        .catch(function(error) {
          console.error('カメラエラー:', error);
          alertEl.textContent = 'カメラにアクセスできません: ' + error.message;
          alertEl.className = 'alert alert-danger mt-2';
        });
    }
    
    // 撮影処理
    function capturePhoto() {
      if (!stream) {
        alertEl.textContent = 'カメラが利用できません';
        alertEl.className = 'alert alert-danger mt-2';
        return;
      }
      
      try {
        // キャンバスサイズ設定
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
        
        // ビデオフレームをキャンバスに描画
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
        
        alertEl.textContent = '写真を確認してください';
        alertEl.className = 'alert alert-success mt-2';
      } catch (e) {
        console.error('撮影エラー:', e);
        alertEl.textContent = '撮影中にエラーが発生しました';
        alertEl.className = 'alert alert-danger mt-2';
      }
    }
    
    // 撮り直し
    function retakePhoto() {
      videoEl.style.display = 'block';
      resultEl.style.display = 'none';
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      useBtn.style.display = 'none';
      
      alertEl.textContent = 'もう一度撮影してください';
      alertEl.className = 'alert alert-info mt-2';
    }
    
    // 写真を使用
    function usePhoto() {
      try {
        // データURL取得
        const dataURL = canvasEl.toDataURL('image/png');
        
        if (side === 'front') {
          // 表面写真の処理
          hasFrontPhoto = true;
          updateFrontPhoto(dataURL);
          
          // モーダルを閉じた後に裏面の撮影へ
          modal.hide();
          setTimeout(function() {
            if (!hasBackPhoto) {
              openSimpleCamera('back');
            }
          }, 500);
        } else {
          // 裏面写真の処理
          hasBackPhoto = true;
          updateBackPhoto(dataURL);
          modal.hide();
        }
        
        // ステータス更新
        updateStatusDisplay();
      } catch (e) {
        console.error('写真使用エラー:', e);
        alertEl.textContent = '写真の処理中にエラーが発生しました';
        alertEl.className = 'alert alert-danger mt-2';
      }
    }
    
    // 表面写真を更新
    function updateFrontPhoto(dataURL) {
      if (!currentContainer) return;
      
      // プレビュー画像を更新
      const previewImg = currentContainer.querySelector('.photo-preview img') || 
                         currentContainer.querySelector('img[alt="写真プレビュー"]') || 
                         currentContainer.querySelector('img[alt="Photo Preview"]');
      
      if (previewImg) {
        previewImg.src = dataURL;
        previewImg.style.display = 'block';
      }
      
      // ファイル入力も更新
      try {
        const fileInput = currentContainer.querySelector('input[type="file"][accept*="image"]');
        if (fileInput) {
          // Blobに変換
          const byteString = atob(dataURL.split(',')[1]);
          const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          
          const blob = new Blob([ab], { type: mimeType });
          const file = new File([blob], 'front.png', { type: mimeType });
          
          // DataTransferが利用可能ならそれを使用
          if (window.DataTransfer) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
          }
        }
      } catch (e) {
        console.error('ファイル入力更新エラー:', e);
      }
    }
    
    // 裏面写真を更新
    function updateBackPhoto(dataURL) {
      if (!currentContainer) return;
      
      const backField = currentContainer.querySelector('#back-photo-field');
      if (backField) {
        backField.value = dataURL;
      }
    }
    
    // ステータス表示を更新
    function updateStatusDisplay() {
      if (!currentContainer) return;
      
      const statusEl = currentContainer.querySelector('.dual-photo-status');
      if (!statusEl) return;
      
      if (hasFrontPhoto && hasBackPhoto) {
        statusEl.textContent = '表裏写真モード: 表面と裏面の両方の写真が設定されました';
        statusEl.className = 'dual-photo-status alert alert-success mt-2';
      } else if (hasFrontPhoto) {
        statusEl.textContent = '表裏写真モード: 表面の写真が設定されました。次に裏面を撮影してください。';
        statusEl.className = 'dual-photo-status alert alert-warning mt-2';
      } else if (hasBackPhoto) {
        statusEl.textContent = '表裏写真モード: 裏面の写真が設定されました。表面も撮影してください。';
        statusEl.className = 'dual-photo-status alert alert-warning mt-2';
      } else {
        statusEl.textContent = '表裏写真モード: 表面から撮影してください';
        statusEl.className = 'dual-photo-status alert alert-info mt-2';
      }
    }
    
    // カメラの停止とクリーンアップ
    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    }
    
    // イベントリスナー設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    useBtn.addEventListener('click', usePhoto);
    
    // モーダルを開いたときのイベント
    modalEl.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダルを閉じたときのイベント
    modalEl.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      
      // DOMから削除
      setTimeout(function() {
        if (document.body.contains(modalEl)) {
          document.body.removeChild(modalEl);
        }
      }, 300);
    });
    
    // モーダルを表示
    modal.show();
  }
  
  // 初期化実行
  init();
})();