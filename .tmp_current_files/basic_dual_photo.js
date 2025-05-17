/**
 * 表裏写真機能の基本実装 - 全体のUIに影響を与えずに動作する最小限のコード
 */
(function() {
  // グローバル状態
  let frontPhoto = null;  // 表面写真
  let backPhoto = null;   // 裏面写真
  let dualModeEnabled = false; // 表裏モード有効フラグ
  let currentForm = null; // 現在操作中のフォーム要素
  
  // DOMが完全に読み込まれた後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDualPhotoFeature);
  } else {
    initDualPhotoFeature();
  }
  
  /**
   * 表裏写真機能の初期化
   */
  function initDualPhotoFeature() {
    console.log('表裏写真機能: 初期化中...');
    
    // モーダル表示イベントを監視
    document.addEventListener('show.bs.modal', function(event) {
      const modal = event.target;
      // 登録モーダルかどうかをチェック（観光客・ガイドの登録モーダル）
      if (modal && (
          modal.id && (modal.id.includes('tourist') || modal.id.includes('guide')) ||
          modal.querySelector('.modal-title') && 
          modal.querySelector('.modal-title').textContent && 
          modal.querySelector('.modal-title').textContent.includes('登録')
        )) {
        console.log('表裏写真機能: 登録モーダルを検出しました');
        setupDualPhotoInModal(modal);
      }
    });
    
    // 既に表示されているモーダルもチェック
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      if (modal && (
          modal.id && (modal.id.includes('tourist') || modal.id.includes('guide')) ||
          modal.querySelector('.modal-title') && 
          modal.querySelector('.modal-title').textContent && 
          modal.querySelector('.modal-title').textContent.includes('登録')
        )) {
        console.log('表裏写真機能: 既に表示されている登録モーダルを検出しました');
        setupDualPhotoInModal(modal);
      }
    });
  }
  
  /**
   * モーダル内に表裏写真機能をセットアップ
   */
  function setupDualPhotoInModal(modal) {
    if (!modal) return;
    
    // 証明書タイプのセレクトボックスを探す
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      // 運転免許証が既に選択されているかチェック
      checkForDriverLicense(select);
      
      // 変更イベントを監視
      select.addEventListener('change', function() {
        checkForDriverLicense(this);
      });
    });
    
    // カメラボタンを探す
    const cameraButtons = findCameraButtons(modal);
    cameraButtons.forEach(function(button) {
      // 元のイベントハンドラを保存
      const originalClickHandler = button.onclick;
      
      // 新しいイベントハンドラを設定
      button.onclick = function(event) {
        if (dualModeEnabled) {
          // 表裏モードが有効ならカスタム処理
          event.preventDefault();
          event.stopPropagation();
          
          // 現在のフォームを保存
          currentForm = findParentForm(button);
          
          // 撮影がまだの場合は表面、表面済みなら裏面を撮影
          if (!frontPhoto) {
            openCameraModal('front');
          } else {
            openCameraModal('back');
          }
          
          return false;
        } else if (originalClickHandler) {
          // 元のハンドラを実行
          return originalClickHandler.call(this, event);
        }
      };
    });
  }
  
  /**
   * カメラボタンを探す
   */
  function findCameraButtons(container) {
    if (!container) return [];
    
    const buttons = [];
    const allButtons = container.querySelectorAll('button');
    
    allButtons.forEach(function(button) {
      if (button.textContent && (
          button.textContent.includes('カメラ') || 
          button.textContent.includes('撮影') ||
          button.innerHTML.includes('camera')
        )) {
        buttons.push(button);
      }
    });
    
    return buttons;
  }
  
  /**
   * ボタンの親フォームを探す
   */
  function findParentForm(button) {
    if (!button) return null;
    
    // フォーム要素を探す
    let parent = button.parentElement;
    while (parent) {
      if (parent.tagName === 'FORM') {
        return parent;
      }
      parent = parent.parentElement;
    }
    
    // フォームが見つからない場合はモーダル本体
    parent = button.parentElement;
    while (parent) {
      if (parent.classList && parent.classList.contains('modal')) {
        return parent;
      }
      parent = parent.parentElement;
    }
    
    return null;
  }
  
  /**
   * 運転免許証が選択されているかチェック
   */
  function checkForDriverLicense(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.textContent) {
      const text = selectedOption.textContent.toLowerCase();
      if (text.includes('運転') && text.includes('免許')) {
        // 運転免許証が選択された
        console.log('表裏写真機能: 運転免許証が選択されました');
        enableDualMode(findParentForm(select));
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * 表裏モードを有効化
   */
  function enableDualMode(container) {
    if (!container) return;
    
    dualModeEnabled = true;
    frontPhoto = null;
    backPhoto = null;
    
    // 写真プレビュー領域を探す
    const photoContainer = findPhotoContainer(container);
    if (!photoContainer) {
      console.log('表裏写真機能: 写真コンテナが見つかりません');
      return;
    }
    
    // ステータス表示要素があるか確認
    let statusElement = container.querySelector('.dual-photo-status');
    if (!statusElement) {
      // なければ作成
      statusElement = document.createElement('div');
      statusElement.className = 'dual-photo-status mt-2 alert alert-info py-2';
      statusElement.style.fontSize = '0.9rem';
      photoContainer.appendChild(statusElement);
    }
    
    // ステータスメッセージを更新
    statusElement.textContent = '表裏写真モード: 表面から撮影してください';
    statusElement.style.display = 'block';
    
    // 裏面写真用の隠しフィールドを追加
    addHiddenFields(container);
    
    console.log('表裏写真機能: 表裏モードを有効化しました');
  }
  
  /**
   * 写真コンテナを探す
   */
  function findPhotoContainer(container) {
    if (!container) return null;
    
    // よくある候補をチェック
    const candidates = [
      container.querySelector('.photo-preview'),
      container.querySelector('.photo-container'),
      container.querySelector('.photo-upload-container')
    ];
    
    for (const candidate of candidates) {
      if (candidate) return candidate;
    }
    
    // プレビュー画像から探す
    const previewImg = 
      container.querySelector('img[alt="写真プレビュー"]') || 
      container.querySelector('img[alt="Photo Preview"]') ||
      container.querySelector('.photo-preview img');
    
    if (previewImg) {
      return previewImg.parentElement;
    }
    
    // ファイル入力から探す
    const fileInput = container.querySelector('input[type="file"][accept*="image"]');
    if (fileInput) {
      return fileInput.closest('.form-group') || 
             fileInput.closest('.mb-3') ||
             fileInput.parentElement;
    }
    
    return null;
  }
  
  /**
   * 裏面写真用の隠しフィールドを追加
   */
  function addHiddenFields(container) {
    if (!container) return;
    
    // 既に存在するかチェック
    if (container.querySelector('#back-photo-data')) return;
    
    // フォームを探す
    const form = container.querySelector('form') || container;
    
    // 裏面写真データ用
    const backPhotoField = document.createElement('input');
    backPhotoField.type = 'hidden';
    backPhotoField.id = 'back-photo-data';
    backPhotoField.name = 'backPhotoData';
    form.appendChild(backPhotoField);
    
    // 写真モード用
    const photoModeField = document.createElement('input');
    photoModeField.type = 'hidden';
    photoModeField.id = 'photo-mode';
    photoModeField.name = 'photoMode';
    photoModeField.value = 'dual';
    form.appendChild(photoModeField);
    
    console.log('表裏写真機能: 隠しフィールドを追加しました');
  }
  
  /**
   * カメラモーダルを開く
   */
  function openCameraModal(side) {
    console.log(`表裏写真機能: ${side}面カメラを開きます`);
    
    // モーダルID
    const modalId = 'camera-modal-' + Date.now();
    
    // モーダルHTML
    const html = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${side === 'front' ? '表面' : '裏面'}の写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <video id="video-${modalId}" autoplay playsinline style="width: 100%; display: block;"></video>
                <canvas id="canvas-${modalId}" style="display: none;"></canvas>
                <div id="preview-container-${modalId}" style="display: none; width: 100%;">
                  <img id="preview-${modalId}" style="width: 100%;" />
                </div>
                <div id="feedback-${modalId}" class="mt-2 alert alert-info py-1">カメラを起動しています...</div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" id="capture-${modalId}" class="btn btn-primary">撮影</button>
              <button type="button" id="retake-${modalId}" class="btn btn-secondary" style="display: none;">撮り直す</button>
              <button type="button" id="use-${modalId}" class="btn btn-success" style="display: none;">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv.firstChild);
    
    // 要素参照
    const modal = document.getElementById(modalId);
    const video = document.getElementById(`video-${modalId}`);
    const canvas = document.getElementById(`canvas-${modalId}`);
    const previewContainer = document.getElementById(`preview-container-${modalId}`);
    const preview = document.getElementById(`preview-${modalId}`);
    const captureBtn = document.getElementById(`capture-${modalId}`);
    const retakeBtn = document.getElementById(`retake-${modalId}`);
    const useBtn = document.getElementById(`use-${modalId}`);
    const feedback = document.getElementById(`feedback-${modalId}`);
    
    // Bootstrapモーダル初期化
    const bsModal = new bootstrap.Modal(modal);
    
    // ストリーム保持用
    let stream = null;
    
    // カメラ起動
    function startCamera() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(mediaStream) {
          stream = mediaStream;
          video.srcObject = mediaStream;
          
          // ビデオメタデータ読み込み後に再生
          video.onloadedmetadata = function() {
            video.play();
            updateFeedback('カメラの準備ができました。撮影ボタンを押してください', 'success');
          };
        })
        .catch(function(err) {
          console.error('カメラアクセスエラー:', err);
          updateFeedback('カメラにアクセスできません: ' + err.message, 'danger');
        });
    }
    
    // フィードバック更新
    function updateFeedback(message, type) {
      feedback.textContent = message;
      feedback.className = `mt-2 alert alert-${type} py-1`;
    }
    
    // 写真撮影
    function capturePhoto() {
      if (!stream) {
        updateFeedback('カメラが利用できません', 'danger');
        return;
      }
      
      // キャンバスサイズをビデオに合わせる
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー表示
      preview.src = canvas.toDataURL('image/png');
      
      // UI更新
      video.style.display = 'none';
      previewContainer.style.display = 'block';
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      useBtn.style.display = 'inline-block';
      
      updateFeedback('写真を撮影しました。確認してください', 'success');
    }
    
    // 撮り直し
    function retakePhoto() {
      // UI更新
      video.style.display = 'block';
      previewContainer.style.display = 'none';
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      useBtn.style.display = 'none';
      
      updateFeedback('もう一度撮影してください', 'info');
    }
    
    // 写真を使用
    function usePhoto() {
      // データURLを取得
      const dataURL = canvas.toDataURL('image/png');
      
      // 写真を保存
      if (side === 'front') {
        frontPhoto = dataURL;
        updateMainPhoto(dataURL);
        
        // ステータス更新
        updateStatusDisplay();
        
        // 裏面撮影へ自動進行
        modal.addEventListener('hidden.bs.modal', function onHidden() {
          modal.removeEventListener('hidden.bs.modal', onHidden);
          setTimeout(function() {
            if (!backPhoto) {
              openCameraModal('back');
            }
          }, 500);
        });
      } else {
        backPhoto = dataURL;
        updateBackPhotoData(dataURL);
        
        // ステータス更新
        updateStatusDisplay();
      }
      
      // モーダルを閉じる
      bsModal.hide();
    }
    
    // 通常写真を更新
    function updateMainPhoto(dataURL) {
      if (!currentForm) return;
      
      // プレビュー画像を更新
      const previewImg = 
        currentForm.querySelector('.photo-preview img') || 
        currentForm.querySelector('img[alt="写真プレビュー"]') || 
        currentForm.querySelector('img[alt="Photo Preview"]');
      
      if (previewImg) {
        previewImg.src = dataURL;
        previewImg.style.display = 'block';
      }
      
      // ファイル入力を更新
      try {
        const fileInput = currentForm.querySelector('input[type="file"][accept*="image"]');
        if (fileInput) {
          // データURLをBlobに変換
          const byteString = atob(dataURL.split(',')[1]);
          const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          
          for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
          }
          
          const blob = new Blob([arrayBuffer], { type: mimeType });
          const file = new File([blob], 'front-photo.png', { type: mimeType });
          
          // ファイルリストを更新（サポートされる場合）
          if (window.DataTransfer) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
          }
        }
      } catch (err) {
        console.error('ファイル入力更新エラー:', err);
      }
    }
    
    // 裏面写真データを更新
    function updateBackPhotoData(dataURL) {
      if (!currentForm) return;
      
      const backPhotoField = currentForm.querySelector('#back-photo-data');
      if (backPhotoField) {
        backPhotoField.value = dataURL;
      }
    }
    
    // ステータス表示を更新
    function updateStatusDisplay() {
      if (!currentForm) return;
      
      const statusElement = currentForm.querySelector('.dual-photo-status');
      if (!statusElement) return;
      
      if (frontPhoto && backPhoto) {
        statusElement.textContent = '表裏写真モード: 表面と裏面の両方の写真が設定されました';
        statusElement.className = 'dual-photo-status mt-2 alert alert-success py-2';
      } else if (frontPhoto) {
        statusElement.textContent = '表裏写真モード: 表面の写真が設定されました。次に裏面を撮影してください。';
        statusElement.className = 'dual-photo-status mt-2 alert alert-warning py-2';
      } else if (backPhoto) {
        statusElement.textContent = '表裏写真モード: 裏面の写真が設定されました。表面も撮影してください。';
        statusElement.className = 'dual-photo-status mt-2 alert alert-warning py-2';
      } else {
        statusElement.textContent = '表裏写真モード: 表面から撮影してください';
        statusElement.className = 'dual-photo-status mt-2 alert alert-info py-2';
      }
    }
    
    // カメラクリーンアップ
    function cleanupCamera() {
      if (stream) {
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    }
    
    // イベントリスナー登録
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    useBtn.addEventListener('click', usePhoto);
    
    // モーダルが閉じられたときのクリーンアップ
    modal.addEventListener('hidden.bs.modal', function() {
      cleanupCamera();
      
      // DOMから削除
      setTimeout(function() {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 300);
    });
    
    // モーダルが表示されたときのカメラ起動
    modal.addEventListener('shown.bs.modal', startCamera);
    
    // モーダル表示
    bsModal.show();
  }
})();