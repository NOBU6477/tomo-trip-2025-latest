/**
 * 緊急カメラ修正スクリプト
 * 直接DOMを書き換えてカメラ撮影ボタンを強制的に修正
 */
(function() {
  console.log('緊急カメラ修正を初期化');
  
  // 監視対象のセレクタ
  const CAMERA_SELECTOR = '#camera-modal, div[role="dialog"]:has(.fa-camera), div[class*="modal"]:has(video)';
  const CAPTURE_SELECTOR = '.btn-danger, button:contains("撮影する"), button:has(.fa-camera)';
  
  // DOM変更の監視を開始
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // カメラモーダルが表示されたかチェック
      if (document.querySelector(CAMERA_SELECTOR)) {
        fixCameraCapture();
      }
    });
  });
  
  // 監視オプション
  const observerOptions = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  };
  
  // 監視開始
  observer.observe(document.body, observerOptions);
  
  // ページロード時にもチェック
  document.addEventListener('DOMContentLoaded', function() {
    // カメラモーダルが既に表示されているかチェック
    if (document.querySelector(CAMERA_SELECTOR)) {
      fixCameraCapture();
    }
  });
  
  // インターバルでも定期的にチェック
  setInterval(function() {
    if (document.querySelector(CAMERA_SELECTOR)) {
      fixCameraCapture();
    }
  }, 1000);
  
  /**
   * カメラ撮影ボタンを修正
   */
  function fixCameraCapture() {
    // 既存の撮影ボタンをすべて検索
    const cameraModal = document.querySelector(CAMERA_SELECTOR);
    if (!cameraModal) return;
    
    // 既に処理済みならスキップ
    if (cameraModal.hasAttribute('data-emergency-fixed')) return;
    
    console.log('カメラモーダルを検出:', cameraModal);
    
    // ビデオ要素を探す
    const video = cameraModal.querySelector('video');
    if (!video) {
      console.warn('カメラモーダル内にビデオ要素が見つかりません');
      return;
    }
    
    // 既存の撮影ボタン
    const captureButton = cameraModal.querySelector(CAPTURE_SELECTOR);
    if (!captureButton) {
      console.warn('撮影ボタンが見つかりません。新しいボタンを作成します');
      
      // 撮影ボタンが見つからない場合は新規作成
      createNewCaptureButton(cameraModal, video);
    } else {
      console.log('既存の撮影ボタンを置き換えます:', captureButton);
      
      // 既存ボタンを新しいものに置き換え
      replaceCaptureButton(captureButton, video, cameraModal);
    }
    
    // 処理済みとしてマーク
    cameraModal.setAttribute('data-emergency-fixed', 'true');
  }
  
  /**
   * 撮影ボタンを新しく作成して追加
   */
  function createNewCaptureButton(modal, video) {
    // ボタンの配置場所を見つける
    let container = modal.querySelector('.modal-body') || 
                    modal.querySelector('.modal-content') || 
                    modal;
    
    // 新しい撮影ボタン要素を作成
    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'btn btn-danger btn-lg rounded-pill emergency-capture-btn';
    newButton.style.cssText = 'position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; padding: 10px 30px; font-size: 1.25rem; font-weight: bold;';
    newButton.innerHTML = '<i class="fas fa-camera"></i> 撮影する';
    
    // ボタンの挙動を設定
    newButton.onclick = function() {
      captureImageFromVideo(video, modal);
      return false;
    };
    
    // ボタンをコンテナに追加
    container.appendChild(newButton);
    console.log('新しい撮影ボタンを追加しました');
  }
  
  /**
   * 既存の撮影ボタンを置き換え
   */
  function replaceCaptureButton(button, video, modal) {
    // 新しいボタンを作成（元のスタイルと属性を維持）
    const newButton = document.createElement('button');
    newButton.type = 'button';
    
    // 元のボタンのクラスとスタイルをコピー
    newButton.className = button.className;
    newButton.id = button.id || '';
    newButton.style.cssText = button.style.cssText;
    newButton.innerHTML = button.innerHTML;
    
    // 目立つようにスタイル強化
    newButton.classList.add('emergency-capture-btn');
    
    // 独自のクリックイベントを設定
    newButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      captureImageFromVideo(video, modal);
      return false;
    };
    
    // 元のボタンを置き換え
    if (button.parentNode) {
      button.parentNode.replaceChild(newButton, button);
      console.log('撮影ボタンを置き換えました');
    }
  }
  
  /**
   * ビデオから画像をキャプチャ
   */
  function captureImageFromVideo(video, modal) {
    console.log('ビデオからキャプチャを試みます');
    
    try {
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (canvas.width === 0 || canvas.height === 0) {
        console.warn('ビデオサイズが無効です。応急処置として推定サイズを使用します');
        canvas.width = video.clientWidth || 640;
        canvas.height = video.clientHeight || 480;
      }
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // キャプチャしたデータを取得
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // ストリームの取得を試みる（停止のため）
      let stream = null;
      if (video.srcObject) {
        stream = video.srcObject;
      }
      
      // モーダルを閉じる前にファイルを作成
      processAndApplyCapture(imageDataUrl, modal);
      
      // ストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // 成功メッセージを表示
      showFeedbackMessage('写真を撮影しました', 'success');
      
    } catch (error) {
      console.error('キャプチャ中にエラーが発生しました:', error);
      showFeedbackMessage('写真の撮影に失敗しました。ファイルをアップロードしてください', 'danger');
    }
  }
  
  /**
   * フィードバックメッセージを表示
   */
  function showFeedbackMessage(message, type) {
    // 既存のアラートを削除
    const existingAlert = document.getElementById('emergency-feedback');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // アラート要素を作成
    const alertElement = document.createElement('div');
    alertElement.id = 'emergency-feedback';
    alertElement.className = `alert alert-${type || 'info'} alert-dismissible fade show`;
    alertElement.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; min-width: 300px;';
    
    alertElement.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // ボディに追加
    document.body.appendChild(alertElement);
    
    // 数秒後に自動的に消去
    setTimeout(function() {
      if (alertElement.parentNode) {
        alertElement.remove();
      }
    }, 5000);
  }
  
  /**
   * キャプチャした画像を処理して適用
   */
  function processAndApplyCapture(imageDataUrl, modal) {
    // 関連するファイル入力を見つける
    const fileInput = findRelatedFileInput(modal);
    if (!fileInput) {
      console.warn('関連するファイル入力が見つかりません');
      return;
    }
    
    // ファイル入力に画像を設定
    try {
      // Base64データをBlobに変換
      const base64Data = imageDataUrl.split(',')[1];
      const byteString = atob(base64Data);
      
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      // Blobを作成
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      
      // ファイル名を生成
      const now = new Date();
      const fileName = `camera_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.jpg`;
      
      // FileオブジェクトとしてBlobをラップ
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // ファイル入力に設定
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
      
      console.log('キャプチャした画像をファイル入力に設定しました:', fileInput.id);
      
      // モーダルを閉じる
      closeModal(modal);
      
    } catch (error) {
      console.error('画像処理中にエラーが発生しました:', error);
    }
  }
  
  /**
   * 関連するファイル入力要素を見つける
   */
  function findRelatedFileInput(modal) {
    let fileInput = null;
    
    // 1. モーダルに関連付けられたファイル入力IDを探す
    if (modal.hasAttribute('data-target-input')) {
      const targetId = modal.getAttribute('data-target-input');
      fileInput = document.getElementById(targetId);
      if (fileInput) return fileInput;
    }
    
    // 2. モーダル開閉前に保存されたアクティブな入力要素をチェック
    if (window.lastActiveFileInput && document.getElementById(window.lastActiveFileInput)) {
      return document.getElementById(window.lastActiveFileInput);
    }
    
    // 3. 表示中のモーダルに最も近いファイル入力要素を探す
    const visibleModalInputs = document.querySelectorAll('div.modal.show input[type="file"]');
    if (visibleModalInputs.length > 0) {
      return visibleModalInputs[0];
    }
    
    // 4. 直前にクリックされたカメラボタンから関連する入力を特定
    if (window.lastClickedCameraButton) {
      const btn = window.lastClickedCameraButton;
      if (btn.hasAttribute('data-target')) {
        const targetId = btn.getAttribute('data-target');
        fileInput = document.getElementById(targetId);
        if (fileInput) return fileInput;
      }
    }
    
    // 5. ドキュメント内のすべてのファイル入力をチェック
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    if (allFileInputs.length > 0) {
      // 写真関連のIDを持つ入力を優先
      for (let input of allFileInputs) {
        if (input.id && (input.id.includes('photo') || input.id.includes('picture'))) {
          return input;
        }
      }
      // 最初のファイル入力を使用
      return allFileInputs[0];
    }
    
    return null;
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    // 1. Bootstrap 5のAPIを使用して閉じる
    try {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
        return;
      }
    } catch (e) {
      console.log('Bootstrap APIでのモーダル閉じに失敗しました');
    }
    
    // 2. 閉じるボタンをクリック
    const closeButton = modal.querySelector('.btn-close, [data-bs-dismiss="modal"], .close');
    if (closeButton) {
      closeButton.click();
      return;
    }
    
    // 3. モーダルを非表示にする
    modal.style.display = 'none';
    
    // 4. モーダルのバックドロップも削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    
    // 5. bodyのスタイルを修正
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
  
  // カメラボタンのクリックを監視して最後にクリックされたボタンを記録
  document.body.addEventListener('click', function(e) {
    // カメラボタンかどうか判定
    if (e.target.classList.contains('camera-button') || 
        e.target.closest('.camera-button') ||
        (e.target.tagName === 'A' && e.target.querySelector('.fa-camera')) ||
        (e.target.closest('a') && e.target.closest('a').querySelector('.fa-camera'))) {
      
      // 最後にクリックされたカメラボタンを記録
      window.lastClickedCameraButton = e.target.classList.contains('camera-button') ? 
                                      e.target : 
                                      (e.target.closest('.camera-button') || e.target.closest('a'));
    }
  }, true);
  
  // ファイル入力のフォーカスを監視して最後にアクティブな入力を記録
  document.body.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT' && e.target.type === 'file' && e.target.id) {
      window.lastActiveFileInput = e.target.id;
    }
  }, true);
  
  // 初期チェック
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.querySelector(CAMERA_SELECTOR)) {
        fixCameraCapture();
      }
    });
  } else {
    if (document.querySelector(CAMERA_SELECTOR)) {
      fixCameraCapture();
    }
  }
})();