/**
 * 表裏写真機能の最もシンプルな実装
 * 以前の複雑な実装を排除し、確実に動作するコードのみを提供
 */
(function() {
  // グローバル設定
  window.dualPhotoConfig = {
    frontPhoto: null,
    backPhoto: null,
    currentModal: null
  };

  // DOMの読み込み完了時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    setupUserTypeModalHandlers();
    setupDocumentTypeChangeHandler();
  });

  // ユーザータイプ選択モーダルのハンドラ
  function setupUserTypeModalHandlers() {
    // モーダルが表示されたときのイベント
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // ユーザータイプモーダルかチェック
      if (isUserTypeModal(modal)) {
        setupRegistrationModals(modal);
      }
    });
  }

  // ユーザータイプモーダルか判定
  function isUserTypeModal(modal) {
    if (!modal) return false;
    
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('登録') || title.textContent.includes('Register'))) {
      return true;
    }
    
    return false;
  }

  // 登録モーダルのセットアップ
  function setupRegistrationModals(modal) {
    window.dualPhotoConfig.currentModal = modal;
    
    // セレクトボックスに変更リスナーを追加
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      select.addEventListener('change', function() {
        checkForDriverLicense(this);
      });
      
      // 初期値もチェック
      checkForDriverLicense(select);
    });
    
    // 既存のカメラボタンを書き換え
    const cameraButtons = modal.querySelectorAll('button');
    cameraButtons.forEach(function(button) {
      if (button.textContent.includes('カメラ') || button.textContent.includes('撮影')) {
        // 元のクリックハンドラを保存
        const originalClick = button.onclick;
        
        button.onclick = function(event) {
          // 表裏モードがアクティブなら処理
          if (isDualModeActive()) {
            event.preventDefault();
            event.stopPropagation();
            handleDualModeCamera();
            return false;
          } else if (originalClick) {
            // 元のハンドラを実行
            return originalClick.call(this, event);
          }
        };
      }
    });
  }

  // 運転免許証が選択されているかチェック
  function checkForDriverLicense(select) {
    if (!select || !select.options || select.selectedIndex < 0) return;
    
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.textContent) {
      const text = selectedOption.textContent.toLowerCase();
      
      if (text.includes('運転') && text.includes('免許')) {
        // 運転免許証選択を検出
        activateDualMode();
      }
    }
  }

  // 書類タイプの変更ハンドラ
  function setupDocumentTypeChangeHandler() {
    document.addEventListener('change', function(event) {
      if (event.target.tagName === 'SELECT') {
        checkForDriverLicense(event.target);
      }
    });
  }

  // 表裏モードを有効化
  function activateDualMode() {
    // 状態をリセット
    window.dualPhotoConfig.frontPhoto = null;
    window.dualPhotoConfig.backPhoto = null;
    
    // ステータス表示を追加
    const modal = window.dualPhotoConfig.currentModal;
    if (!modal) return;
    
    // 写真プレビューエリアを探す
    const photoArea = findPhotoArea(modal);
    if (!photoArea) return;
    
    // 既存の状態表示を確認
    let statusElement = modal.querySelector('.dual-photo-status');
    if (!statusElement) {
      // なければ作成
      statusElement = document.createElement('div');
      statusElement.className = 'dual-photo-status mt-2 alert alert-info';
      statusElement.style.fontSize = '0.9rem';
      statusElement.style.padding = '0.5rem';
      photoArea.appendChild(statusElement);
    }
    
    // 状態メッセージを更新
    statusElement.textContent = '表裏写真モード: 表面から撮影してください';
    statusElement.style.display = 'block';
    
    // 裏面写真用の隠しフィールドを作成
    addHiddenFields(modal);
    
    console.log('表裏写真モードを有効化しました');
  }

  // 写真エリアを探す
  function findPhotoArea(modal) {
    const candidates = [
      modal.querySelector('.photo-preview'),
      modal.querySelector('.photo-container'),
      modal.querySelector('.form-group:has(input[type="file"][accept*="image"])'),
      modal.querySelector('.mb-3:has(input[type="file"][accept*="image"])')
    ];
    
    // 有効な候補を返す
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i]) return candidates[i];
    }
    
    // 代替手法: 画像要素から探す
    const img = modal.querySelector('img[alt="写真プレビュー"]') || 
                modal.querySelector('img[alt="Photo Preview"]');
    if (img) {
      return img.parentElement;
    }
    
    // ファイル入力から探す
    const fileInput = modal.querySelector('input[type="file"][accept*="image"]');
    if (fileInput) {
      return fileInput.parentElement;
    }
    
    return null;
  }

  // 隠しフィールドを追加
  function addHiddenFields(modal) {
    // 既存フィールドをチェック
    if (modal.querySelector('#back-photo-data')) return;
    
    const form = modal.querySelector('form') || modal;
    
    // 裏面写真データ用
    const backPhotoField = document.createElement('input');
    backPhotoField.type = 'hidden';
    backPhotoField.id = 'back-photo-data';
    backPhotoField.name = 'backPhotoData';
    form.appendChild(backPhotoField);
    
    // 写真タイプ用
    const photoTypeField = document.createElement('input');
    photoTypeField.type = 'hidden';
    photoTypeField.id = 'photo-type';
    photoTypeField.name = 'photoMode';
    photoTypeField.value = 'dual';
    form.appendChild(photoTypeField);
  }

  // 表裏モードがアクティブか確認
  function isDualModeActive() {
    const modal = window.dualPhotoConfig.currentModal;
    if (!modal) return false;
    
    // 状態表示要素の存在で判定
    const statusElement = modal.querySelector('.dual-photo-status');
    return (statusElement && statusElement.style.display !== 'none');
  }

  // 表裏モードのカメラ処理
  function handleDualModeCamera() {
    // 表面が未設定なら表面、設定済みなら裏面を撮影
    if (!window.dualPhotoConfig.frontPhoto) {
      showCameraModal('front');
    } else {
      showCameraModal('back');
    }
  }

  // カメラモーダルを表示
  function showCameraModal(side) {
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
                <div id="result-${modalId}" style="display: none; width: 100%;">
                  <img id="preview-${modalId}" style="width: 100%;" />
                </div>
                <div class="feedback-container mt-2 alert alert-info py-1">カメラを起動しています...</div>
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
    const result = document.getElementById(`result-${modalId}`);
    const preview = document.getElementById(`preview-${modalId}`);
    const captureBtn = document.getElementById(`capture-${modalId}`);
    const retakeBtn = document.getElementById(`retake-${modalId}`);
    const useBtn = document.getElementById(`use-${modalId}`);
    const feedbackContainer = modal.querySelector('.feedback-container');
    
    // モーダルインスタンス
    const bsModal = new bootstrap.Modal(modal);
    
    // フィードバック表示関数
    function showFeedback(message, type = 'info') {
      feedbackContainer.className = `mt-2 alert alert-${type} py-1`;
      feedbackContainer.textContent = message;
    }
    
    // カメラストリーム
    let stream = null;
    
    // カメラ起動
    function startCamera() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(mediaStream) {
          stream = mediaStream;
          video.srcObject = mediaStream;
          video.onloadedmetadata = function() {
            video.play();
            showFeedback('カメラの準備ができました。撮影ボタンを押してください', 'success');
          };
        })
        .catch(function(err) {
          console.error('カメラアクセスエラー:', err);
          showFeedback('カメラにアクセスできません: ' + err.message, 'danger');
        });
    }
    
    // 写真撮影
    function capturePhoto() {
      if (!stream) {
        showFeedback('カメラが利用できません', 'danger');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      preview.src = canvas.toDataURL('image/png');
      
      // UI更新
      video.style.display = 'none';
      result.style.display = 'block';
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      useBtn.style.display = 'inline-block';
      
      showFeedback('写真を撮影しました。確認してください', 'success');
    }
    
    // 撮り直し
    function retakePhoto() {
      video.style.display = 'block';
      result.style.display = 'none';
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      useBtn.style.display = 'none';
      
      showFeedback('もう一度撮影してください', 'info');
    }
    
    // 写真を使用
    function usePhoto() {
      // 写真データを取得
      const dataURL = canvas.toDataURL('image/png');
      
      if (side === 'front') {
        // 表面写真の処理
        window.dualPhotoConfig.frontPhoto = dataURL;
        updateMainPhotoInput(dataURL);
        
        // 状態表示を更新
        updateStatusDisplay();
        
        // 裏面撮影へ自動進行
        setTimeout(function() {
          if (!window.dualPhotoConfig.backPhoto) {
            showCameraModal('back');
          }
        }, 500);
      } else {
        // 裏面写真の処理
        window.dualPhotoConfig.backPhoto = dataURL;
        updateBackPhotoField(dataURL);
        
        // 状態表示を更新
        updateStatusDisplay();
      }
      
      // モーダルを閉じる
      bsModal.hide();
    }
    
    // メイン写真入力を更新
    function updateMainPhotoInput(dataURL) {
      const modal = window.dualPhotoConfig.currentModal;
      if (!modal) return;
      
      // プレビュー画像を更新
      const previewImg = modal.querySelector('.photo-preview img') || 
                         modal.querySelector('img[alt="写真プレビュー"]') || 
                         modal.querySelector('img[alt="Photo Preview"]');
      
      if (previewImg) {
        previewImg.src = dataURL;
        previewImg.style.display = 'block';
      }
      
      // データURLからBlobを作成
      const byteString = atob(dataURL.split(',')[1]);
      const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const byteArray = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: mimeType });
      const file = new File([blob], 'front-photo.png', { type: mimeType });
      
      // ファイル入力を更新
      const fileInput = modal.querySelector('input[type="file"][accept*="image"]');
      if (fileInput) {
        try {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
        } catch (err) {
          console.error('ファイル入力の更新エラー:', err);
        }
      }
    }
    
    // 裏面写真フィールドを更新
    function updateBackPhotoField(dataURL) {
      const backPhotoField = document.getElementById('back-photo-data');
      if (backPhotoField) {
        backPhotoField.value = dataURL;
      }
    }
    
    // 状態表示を更新
    function updateStatusDisplay() {
      const modal = window.dualPhotoConfig.currentModal;
      if (!modal) return;
      
      const statusElement = modal.querySelector('.dual-photo-status');
      if (!statusElement) return;
      
      // 表面と裏面の状態に応じてメッセージを更新
      if (window.dualPhotoConfig.frontPhoto && window.dualPhotoConfig.backPhoto) {
        statusElement.textContent = '表裏写真モード: 表面と裏面の両方の写真が設定されました';
        statusElement.className = 'dual-photo-status mt-2 alert alert-success';
      } else if (window.dualPhotoConfig.frontPhoto) {
        statusElement.textContent = '表裏写真モード: 表面の写真が設定されました。次に裏面を撮影してください。';
        statusElement.className = 'dual-photo-status mt-2 alert alert-warning';
      } else if (window.dualPhotoConfig.backPhoto) {
        statusElement.textContent = '表裏写真モード: 裏面の写真が設定されました。表面も撮影してください。';
        statusElement.className = 'dual-photo-status mt-2 alert alert-warning';
      } else {
        statusElement.textContent = '表裏写真モード: 表面から撮影してください';
        statusElement.className = 'dual-photo-status mt-2 alert alert-info';
      }
    }
    
    // イベントリスナー設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    useBtn.addEventListener('click', usePhoto);
    
    // モーダルが閉じられたときのクリーンアップ
    modal.addEventListener('hidden.bs.modal', function() {
      // カメラストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // DOMから削除
      setTimeout(function() {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 300);
    });
    
    // モーダルが表示されたときのセットアップ
    modal.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダルを表示
    bsModal.show();
  }
})();