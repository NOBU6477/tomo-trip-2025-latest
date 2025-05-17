/**
 * 表裏写真機能のシンプル実装
 * ブラウザ互換性のために単純化したアプローチ
 */
(function() {
  'use strict';
  
  // グローバル状態
  window.dualPhotoState = {
    dualMode: false,
    currentModal: null,
    frontPhoto: null,
    backPhoto: null,
    isTakingBack: false,
    lastInputId: null
  };
  
  // 初期化関数
  function initDualPhotoHandler() {
    console.log('表裏写真機能を初期化します');
    
    // 既存のボタンを監視
    observeExistingButtons();
    
    // モーダル表示時の処理
    document.addEventListener('show.bs.modal', function(event) {
      setTimeout(function() {
        handleModalShown(event.target);
      }, 300);
    });
  }
  
  // 既存のボタンを監視
  function observeExistingButtons() {
    document.addEventListener('click', function(event) {
      // カメラボタンのクリック
      if (event.target && event.target.tagName === 'BUTTON') {
        if (event.target.textContent && 
            (event.target.textContent.includes('カメラ') || 
             event.target.textContent.includes('撮影'))) {
          
          // 表裏モードでかつ登録モーダル内の場合
          if (window.dualPhotoState.dualMode && 
              isInsideRegistrationModal(event.target)) {
            
            event.preventDefault();
            event.stopPropagation();
            
            if (window.dualPhotoState.isTakingBack) {
              showPhotoCameraModal('back');
            } else {
              showPhotoCameraModal('front');
            }
            
            return false;
          }
        }
      }
    });
    
    // セレクトボックスの変更を監視
    document.addEventListener('change', function(event) {
      if (event.target && event.target.tagName === 'SELECT') {
        checkForDriverLicense(event.target);
      }
      
      // ラジオボタンの変更も監視
      if (event.target && event.target.type === 'radio' && 
          event.target.name === 'photoType') {
        checkForDualPhotoRadio(event.target);
      }
    });
  }
  
  // 登録モーダル内部かチェック
  function isInsideRegistrationModal(element) {
    if (!element) return false;
    
    // 親要素を探索
    let parent = element.parentElement;
    while (parent) {
      // モーダルクラスを持つ要素
      if (parent.classList && parent.classList.contains('modal')) {
        // ツーリストかガイド登録モーダルかチェック
        if (parent.id && 
            (parent.id.includes('tourist') || 
             parent.id.includes('guide') || 
             parent.id.includes('register') || 
             parent.id.includes('signup'))) {
          return true;
        }
        
        // モーダルタイトルのテキストを確認
        const titleEl = parent.querySelector('.modal-title');
        if (titleEl && titleEl.textContent && 
            (titleEl.textContent.includes('登録') || 
             titleEl.textContent.includes('Register'))) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    
    return false;
  }
  
  // モーダル表示時の処理
  function handleModalShown(modal) {
    if (!modal || !modal.classList.contains('modal')) return;
    
    // 現在のモーダルを保存
    window.dualPhotoState.currentModal = modal;
    
    // モーダル内のセレクトボックスをチェック
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      checkForDriverLicense(select);
    });
    
    // 既存のラジオボタンもチェック
    const radios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    radios.forEach(function(radio) {
      checkForDualPhotoRadio(radio);
    });
  }
  
  // 運転免許証が選択されているかチェック
  function checkForDriverLicense(selectElement) {
    if (!selectElement || selectElement.tagName !== 'SELECT') return;
    
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (selectedOption && selectedOption.textContent) {
      const text = selectedOption.textContent.toLowerCase();
      if (text.includes('運転') && text.includes('免許')) {
        // 表裏モードを有効化
        enableDualPhotoMode();
        
        // ラジオボタンも更新
        updateRadioButtons();
        
        return true;
      }
    }
    
    return false;
  }
  
  // 表裏写真ラジオボタンがチェックされているか
  function checkForDualPhotoRadio(radioElement) {
    if (!radioElement || radioElement.type !== 'radio') return;
    
    // ラジオボタンのラベルテキストを取得
    let labelText = '';
    
    // 隣接するラベル要素
    const nextLabel = radioElement.nextElementSibling;
    if (nextLabel && nextLabel.tagName === 'LABEL') {
      labelText = nextLabel.textContent;
    }
    
    // ラベルのfor属性
    if (!labelText) {
      const associatedLabel = document.querySelector(`label[for="${radioElement.id}"]`);
      if (associatedLabel) {
        labelText = associatedLabel.textContent;
      }
    }
    
    // 関連テキストノード
    if (!labelText) {
      const nextNode = radioElement.nextSibling;
      if (nextNode && nextNode.nodeType === 3) {
        labelText = nextNode.textContent;
      }
    }
    
    // テキストが表裏写真を示すかチェック
    if (labelText && (labelText.includes('表裏') || labelText.includes('両面'))) {
      if (radioElement.checked) {
        enableDualPhotoMode();
        return true;
      }
    }
    
    return false;
  }
  
  // 表裏モードを有効化
  function enableDualPhotoMode() {
    window.dualPhotoState.dualMode = true;
    window.dualPhotoState.isTakingBack = false;
    
    const modal = window.dualPhotoState.currentModal;
    if (!modal) return;
    
    // ステータス表示要素を追加
    let statusEl = modal.querySelector('.dual-photo-status');
    if (!statusEl) {
      // 写真プレビュー領域を探す
      const previewArea = findPhotoPreviewArea(modal);
      if (previewArea) {
        statusEl = document.createElement('div');
        statusEl.className = 'dual-photo-status mt-2 alert alert-info py-1';
        statusEl.style.fontSize = '0.9rem';
        statusEl.textContent = '表裏写真モード: 表面から撮影してください';
        previewArea.appendChild(statusEl);
      }
    } else {
      statusEl.textContent = '表裏写真モード: 表面から撮影してください';
      statusEl.style.display = 'block';
    }
    
    // 裏面写真用の隠しフィールドを追加
    addHiddenFields(modal);
    
    console.log('表裏写真モードを有効化しました');
  }
  
  // 写真プレビュー領域を探す
  function findPhotoPreviewArea(modal) {
    // よくある候補をチェック
    const candidates = [
      modal.querySelector('.photo-preview'),
      modal.querySelector('.photo-container'),
      modal.querySelector('.photo-upload-container')
    ];
    
    for (const candidate of candidates) {
      if (candidate) return candidate;
    }
    
    // プレビュー画像を探して親要素を返す
    const previewImg = 
      modal.querySelector('img[alt="写真プレビュー"]') || 
      modal.querySelector('img[alt="Photo Preview"]') ||
      modal.querySelector('.photo-preview img');
    
    if (previewImg) {
      return previewImg.parentElement;
    }
    
    // ファイル入力要素の親を探す
    const fileInput = modal.querySelector('input[type="file"][accept*="image"]');
    if (fileInput) {
      return fileInput.closest('.form-group') || 
             fileInput.closest('.mb-3') ||
             fileInput.parentElement;
    }
    
    return null;
  }
  
  // 隠しフィールドを追加
  function addHiddenFields(modal) {
    // 既存のフィールドがあれば何もしない
    if (modal.querySelector('#back-photo-data')) return;
    
    // フォームを探す
    const form = modal.querySelector('form') || modal;
    
    // 裏面写真用
    const backPhotoField = document.createElement('input');
    backPhotoField.type = 'hidden';
    backPhotoField.id = 'back-photo-data';
    backPhotoField.name = 'backPhotoData';
    form.appendChild(backPhotoField);
    
    // 写真タイプ用
    const photoTypeField = document.createElement('input');
    photoTypeField.type = 'hidden';
    photoTypeField.id = 'photo-type-field';
    photoTypeField.name = 'photoType';
    photoTypeField.value = 'dual';
    form.appendChild(photoTypeField);
  }
  
  // ラジオボタンを更新
  function updateRadioButtons() {
    const modal = window.dualPhotoState.currentModal;
    if (!modal) return;
    
    // 表裏写真ラジオボタンを探す
    const dualRadios = Array.from(modal.querySelectorAll('input[type="radio"][name="photoType"]'))
      .filter(function(radio) {
        // ラジオボタンのラベルかテキストをチェック
        const nextLabel = radio.nextElementSibling;
        if (nextLabel && nextLabel.tagName === 'LABEL') {
          return nextLabel.textContent.includes('表裏') || nextLabel.textContent.includes('両面');
        }
        
        // 隣接テキストノード
        const nextNode = radio.nextSibling;
        if (nextNode && nextNode.nodeType === 3) {
          return nextNode.textContent.includes('表裏') || nextNode.textContent.includes('両面');
        }
        
        return false;
      });
    
    // 見つかったらチェック状態に
    if (dualRadios.length > 0) {
      dualRadios[0].checked = true;
      
      // イベントを発火
      try {
        const event = new Event('change', { bubbles: true });
        dualRadios[0].dispatchEvent(event);
      } catch (e) {
        console.log('ラジオボタンイベント発火エラー:', e);
      }
    }
  }
  
  // カメラモーダルを表示
  function showPhotoCameraModal(side) {
    console.log(`${side}写真用カメラを表示します`);
    
    // モーダルID
    const modalId = 'camera-modal-' + Date.now();
    
    // モーダルHTML
    const modalHTML = `
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
    tempDiv.innerHTML = modalHTML;
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
    const feedback = document.getElementById(`feedback-${modalId}`);
    
    // モーダルを初期化
    const bsModal = new bootstrap.Modal(modal);
    
    // ストリーム参照
    let stream = null;
    
    // カメラを起動
    function startCamera() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(mediaStream) {
          stream = mediaStream;
          video.srcObject = mediaStream;
          
          // メタデータ読み込み後に再生
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
      
      // ビデオフレームをキャンバスに描画
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー表示
      preview.src = canvas.toDataURL('image/png');
      
      // UI更新
      video.style.display = 'none';
      result.style.display = 'block';
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      useBtn.style.display = 'inline-block';
      
      updateFeedback('写真を撮影しました。確認してください', 'success');
    }
    
    // 撮り直し
    function retakePhoto() {
      video.style.display = 'block';
      result.style.display = 'none';
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      useBtn.style.display = 'none';
      
      updateFeedback('もう一度撮影してください', 'info');
    }
    
    // 写真を使用
    function usePhoto() {
      // Base64データを取得
      const dataURL = canvas.toDataURL('image/png');
      
      // 適切な状態を更新
      if (side === 'front') {
        // Base64文字列からBlobを作成
        const byteString = atob(dataURL.split(',')[1]);
        const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const byteArray = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([arrayBuffer], { type: mimeType });
        
        // Fileオブジェクトに変換
        const file = new File([blob], 'front-photo.png', { type: mimeType });
        
        // フロント写真を保存
        window.dualPhotoState.frontPhoto = file;
        window.dualPhotoState.isTakingBack = true;
        
        // 通常の入力に反映
        updatePhotoInput(file);
        
        // 次は裏面
        setTimeout(function() {
          showPhotoCameraModal('back');
        }, 500);
      } else {
        // 裏面の写真
        const backPhotoField = document.getElementById('back-photo-data');
        if (backPhotoField) {
          backPhotoField.value = dataURL;
        }
        
        window.dualPhotoState.backPhoto = dataURL;
        window.dualPhotoState.isTakingBack = false;
      }
      
      // 状態表示を更新
      updateStatusDisplay();
      
      // モーダルを閉じる
      bsModal.hide();
    }
    
    // 通常の写真入力を更新
    function updatePhotoInput(file) {
      const modal = window.dualPhotoState.currentModal;
      if (!modal) return;
      
      // ファイル入力を探す
      const fileInput = modal.querySelector('input[type="file"][accept*="image"]');
      if (!fileInput) return;
      
      try {
        // 新しいFileList作成（サポートされる場合）
        if (window.DataTransfer) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
        }
        
        // 変更イベント発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      } catch (e) {
        console.error('ファイル入力更新エラー:', e);
      }
      
      // プレビュー画像も更新
      const previewImg = 
        modal.querySelector('.photo-preview img') || 
        modal.querySelector('img[alt="写真プレビュー"]') || 
        modal.querySelector('img[alt="Photo Preview"]');
      
      if (previewImg) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    }
    
    // 状態表示を更新
    function updateStatusDisplay() {
      const modal = window.dualPhotoState.currentModal;
      if (!modal) return;
      
      const statusEl = modal.querySelector('.dual-photo-status');
      if (!statusEl) return;
      
      if (window.dualPhotoState.frontPhoto && window.dualPhotoState.backPhoto) {
        statusEl.textContent = '表裏写真モード: 表面と裏面の両方の写真が設定されました';
        statusEl.className = 'dual-photo-status mt-2 alert alert-success py-1';
      } else if (window.dualPhotoState.frontPhoto) {
        statusEl.textContent = '表裏写真モード: 表面の写真が設定されました。次に裏面を撮影してください。';
        statusEl.className = 'dual-photo-status mt-2 alert alert-warning py-1';
      } else if (window.dualPhotoState.backPhoto) {
        statusEl.textContent = '表裏写真モード: 裏面の写真が設定されました。表面も撮影してください。';
        statusEl.className = 'dual-photo-status mt-2 alert alert-warning py-1';
      } else {
        statusEl.textContent = '表裏写真モード: 表面から撮影してください';
        statusEl.className = 'dual-photo-status mt-2 alert alert-info py-1';
      }
    }
    
    // クリーンアップ
    function cleanupCamera() {
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
    
    // モーダルクローズ時のクリーンアップ
    modal.addEventListener('hidden.bs.modal', function() {
      cleanupCamera();
      
      // DOMから削除
      setTimeout(function() {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 300);
    });
    
    // モーダル表示直後にカメラ起動
    modal.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダルを表示
    bsModal.show();
  }
  
  // DOMが読み込まれたら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDualPhotoHandler);
  } else {
    initDualPhotoHandler();
  }
})();