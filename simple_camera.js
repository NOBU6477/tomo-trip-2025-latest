/**
 * 非常にシンプルなカメラ実装
 * 最小限の機能だけを実装して、確実に動作するようにします
 */
(function() {
  // DOMContentLoadedイベントが発火した時に初期化
  function init() {
    try {
      console.log('シンプルカメラ: 初期化開始');
      setupAllCameraButtons();
    } catch (error) {
      console.error('シンプルカメラ: 初期化エラー', error);
    }
  }

  // ドキュメントの読み込み状態をチェックして適切なタイミングで初期化
  if (document && document.readyState) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // すでにDOMが読み込まれている場合は直ちに実行
      console.log('シンプルカメラ: ドキュメント既に読み込み済み - 即時実行');
      setTimeout(init, 10);
    } else {
      // そうでなければイベントをセット
      console.log('シンプルカメラ: DOMContentLoaded待機');
      window.addEventListener('DOMContentLoaded', init);
    }
  } else {
    // フォールバック - 少し遅延させて実行
    console.log('シンプルカメラ: フォールバック初期化');
    setTimeout(init, 500);
  }

  // すべてのカメラボタンを設定
  function setupAllCameraButtons() {
    console.log('シンプルカメラ: カメラボタンをセットアップします');
    
    // カメラ撮影ボタンのフォールバック検索
    var allButtons = document.querySelectorAll('button, a');
    var filteredButtons = [];
    
    for (var i = 0; i < allButtons.length; i++) {
      var button = allButtons[i];
      // カメラ関連ボタンを検出
      if (button.querySelector('.fa-camera')) {
        filteredButtons.push(button);
        continue;
      }
      
      // data属性をチェック
      if (button.hasAttribute('data-bs-target') && 
          button.getAttribute('data-bs-target').includes('camera')) {
        filteredButtons.push(button);
        continue;
      }
      
      // テキスト内容をチェック
      var buttonText = button.textContent || button.innerText;
      if (buttonText.includes('カメラ') || buttonText.includes('撮影')) {
        filteredButtons.push(button);
        continue;
      }
      
      // HTMLをチェック
      if (button.innerHTML.includes('fa-camera') || 
          button.innerHTML.includes('カメラ') || 
          button.innerHTML.includes('撮影')) {
        filteredButtons.push(button);
      }
    }
    
    var cameraButtons = filteredButtons;
    
    console.log('シンプルカメラ: ' + cameraButtons.length + '個のカメラボタンを検出しました');
    
    // 各ボタンにイベントリスナーを設定
    for (var i = 0; i < cameraButtons.length; i++) {
      var button = cameraButtons[i];
      
      // すでに処理済みならスキップ
      if (button.getAttribute('data-simple-camera') === 'true') {
        continue;
      }
      
      // 元のイベントリスナーを削除するために新しいボタンに置き換え
      var newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      // 新しいイベントリスナーを設定
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ターゲットIDを特定
        var targetId = null;
        
        // data-target属性をチェック
        if (this.hasAttribute('data-target')) {
          targetId = this.getAttribute('data-target').replace('#', '');
        } else if (this.hasAttribute('data-bs-target')) {
          targetId = this.getAttribute('data-bs-target').replace('#', '');
        }
        
        // ボタンの近くのファイル入力を探す
        if (!targetId) {
          var fileInput = findNearestFileInput(this);
          if (fileInput) {
            targetId = fileInput.id;
          }
        }
        
        // カメラモーダルを開く
        openSimpleCameraModal(targetId);
      });
      
      // 処理済みとしてマーク
      newButton.setAttribute('data-simple-camera', 'true');
    }
  }
  
  // 最も近いファイル入力要素を取得
  function findNearestFileInput(element) {
    // 親要素をさかのぼってファイル入力を探す
    var parent = element.parentNode;
    
    // 5階層までさかのぼる
    for (var i = 0; i < 5 && parent; i++) {
      var fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      parent = parent.parentNode;
    }
    
    // ドキュメント内のすべてのファイル入力を探す
    var allInputs = document.querySelectorAll('input[type="file"]');
    return allInputs.length > 0 ? allInputs[0] : null;
  }
  
  // シンプルなカメラモーダルを開く
  function openSimpleCameraModal(targetId) {
    console.log('シンプルカメラ: モーダルを開きます（ターゲットID: ' + (targetId || 'なし') + '）');
    
    // 既存のモーダルをクリーンアップ
    var existingModal = document.getElementById('simple-camera-modal');
    if (existingModal && existingModal.parentNode) {
      existingModal.parentNode.removeChild(existingModal);
    }
    
    // バックドロップも削除
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    
    // アクティブなカメラストリームを停止
    if (window.simpleCameraStream) {
      var tracks = window.simpleCameraStream.getTracks();
      for (var i = 0; i < tracks.length; i++) {
        tracks[i].stop();
      }
      window.simpleCameraStream = null;
    }
    
    // モーダル要素を作成
    var modal = document.createElement('div');
    modal.id = 'simple-camera-modal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.style.display = 'none';
    
    if (targetId) {
      modal.setAttribute('data-target-input', targetId);
    }
    
    // モーダルHTML
    modal.innerHTML = '<div class="modal-dialog modal-dialog-centered">' +
      '<div class="modal-content">' +
        '<div class="modal-header bg-primary text-white">' +
          '<h5 class="modal-title">カメラで撮影</h5>' +
          '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '</div>' +
        '<div class="modal-body text-center p-0">' +
          '<div style="position: relative; max-height: 80vh; overflow: visible;">' +
            '<video id="simple-camera-video" autoplay playsinline style="width: 100%; max-height: 70vh; background: #000;"></video>' +
            '<canvas id="simple-camera-canvas" style="display: none;"></canvas>' +
            '<div class="p-3 mt-3 mb-3">' +
              '<button id="simple-capture-btn" type="button" class="btn btn-danger btn-lg rounded-pill" ' +
                'style="min-width: 200px; font-size: 1.2rem; padding: 12px 30px; box-shadow: 0 0 15px rgba(220, 53, 69, 0.5); position: relative;">' +
                '<i class="fas fa-camera"></i> 撮影する' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    
    // bodyに追加
    document.body.appendChild(modal);
    
    // モーダルを表示
    if (typeof bootstrap !== 'undefined') {
      var bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    } else {
      modal.style.display = 'block';
      modal.classList.add('show');
      
      // バックドロップを追加
      var modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(modalBackdrop);
      
      // body要素にモーダルオープンクラスを追加
      // modal-open クラス追加を無効化 - スクロール阻害防止
      // document.body.classList.add('modal-open');
    }
    
    // 撮影ボタンのイベントリスナーを設定
    var captureBtn = document.getElementById('simple-capture-btn');
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        captureSimplePhoto(targetId);
      });
    }
    
    // カメラ初期化
    initSimpleCamera();
  }
  
  // カメラを初期化
  function initSimpleCamera() {
    var video = document.getElementById('simple-camera-video');
    if (!video) {
      console.error('シンプルカメラ: ビデオ要素が見つかりません');
      return;
    }
    
    // カメラ設定
    var constraints = {
      video: { facingMode: 'user' },
      audio: false
    };
    
    // カメラへアクセス
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          console.log('シンプルカメラ: カメラストリームを取得しました');
          
          // グローバル変数にストリームを保存
          window.simpleCameraStream = stream;
          
          // ビデオにストリームを設定
          video.srcObject = stream;
          
        })
        .catch(function(error) {
          console.error('シンプルカメラ: カメラアクセスに失敗しました: ', error);
          showCameraError(error.message);
        });
    } else {
      console.error('シンプルカメラ: getUserMediaがサポートされていません');
      showCameraError('お使いのブラウザはカメラをサポートしていません');
    }
  }
  
  // 写真を撮影
  function captureSimplePhoto(targetId) {
    console.log('シンプルカメラ: 写真を撮影します');
    
    var video = document.getElementById('simple-camera-video');
    var canvas = document.getElementById('simple-camera-canvas');
    
    if (!video || !canvas) {
      console.error('シンプルカメラ: ビデオまたはキャンバス要素が見つかりません');
      return;
    }
    
    try {
      // キャンバスのサイズをビデオに合わせる
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // ビデオフレームをキャンバスに描画
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像をBlobに変換
      canvas.toBlob(function(blob) {
        // ファイル入力を探す
        var fileInput = null;
        
        if (targetId) {
          fileInput = document.getElementById(targetId);
        }
        
        if (!fileInput || fileInput.type !== 'file') {
          // すべてのファイル入力を探す
          var allInputs = document.querySelectorAll('input[type="file"]');
          if (allInputs.length > 0) {
            fileInput = allInputs[0];
          }
        }
        
        if (fileInput) {
          // ファイル名を生成
          var now = new Date();
          var fileName = 'photo_' + now.getFullYear() + 
                        (now.getMonth() + 1).toString().padStart(2, '0') + 
                        now.getDate().toString().padStart(2, '0') + '_' +
                        now.getHours().toString().padStart(2, '0') + 
                        now.getMinutes().toString().padStart(2, '0') + '.jpg';
          
          // FileオブジェクトをBlobから作成
          var file = new File([blob], fileName, { type: 'image/jpeg' });
          
          // ファイル入力要素にFileオブジェクトを設定
          var dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          var event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          console.log('シンプルカメラ: ファイルを設定しました: ' + fileInput.id);
          
          // 成功メッセージ
          showMessage('写真を撮影しました', 'success');
        } else {
          console.error('シンプルカメラ: ファイル入力が見つかりません');
          showMessage('ファイル入力が見つかりません', 'danger');
        }
        
        // モーダルを閉じる
        closeSimpleModal();
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('シンプルカメラ: 写真撮影中にエラーが発生しました: ', error);
      showMessage('写真の撮影に失敗しました', 'danger');
    }
  }
  
  // カメラエラーメッセージを表示
  function showCameraError(errorMessage) {
    var modal = document.getElementById('simple-camera-modal');
    if (!modal) return;
    
    var videoContainer = modal.querySelector('.modal-body > div');
    if (!videoContainer) return;
    
    // エラーメッセージを表示
    var errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger m-3';
    errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> カメラエラー: ' + 
                         (errorMessage || 'カメラが見つからないか、アクセスが拒否されました。');
    
    // ビデオの下に追加
    videoContainer.insertBefore(errorDiv, videoContainer.querySelector('.p-3'));
    
    // 撮影ボタンをファイル選択ボタンに変更
    var btnContainer = videoContainer.querySelector('.p-3');
    if (btnContainer) {
      btnContainer.innerHTML = '<button id="fallback-file-btn" type="button" class="btn btn-primary btn-lg rounded-pill" ' +
                             'style="min-width: 200px; font-size: 1.1rem; padding: 10px 25px;">' +
                             '<i class="fas fa-upload"></i> 画像をアップロード' +
                             '</button>';
      
      // ファイル選択ボタンのイベントリスナー
      var fallbackBtn = document.getElementById('fallback-file-btn');
      if (fallbackBtn) {
        fallbackBtn.addEventListener('click', function() {
          var modal = document.getElementById('simple-camera-modal');
          var targetId = modal ? modal.getAttribute('data-target-input') : null;
          var fileInput = null;
          
          if (targetId) {
            fileInput = document.getElementById(targetId);
          }
          
          if (!fileInput || fileInput.type !== 'file') {
            var allInputs = document.querySelectorAll('input[type="file"]');
            if (allInputs.length > 0) {
              fileInput = allInputs[0];
            }
          }
          
          if (fileInput) {
            closeSimpleModal();
            fileInput.click();
          } else {
            showMessage('ファイル入力が見つかりません', 'danger');
          }
        });
      }
    }
  }
  
  // モーダルを閉じる
  function closeSimpleModal() {
    var modal = document.getElementById('simple-camera-modal');
    if (!modal) return;
    
    // 1. Bootstrap APIを使用
    if (typeof bootstrap !== 'undefined') {
      var bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
        return;
      }
    }
    
    // 2. 閉じるボタンをクリック
    var closeBtn = modal.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.click();
      return;
    }
    
    // 3. 手動で閉じる
    modal.style.display = 'none';
    modal.classList.remove('show');
    
    // バックドロップを削除
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    
    // bodyのスタイルをリセット
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    // ストリームを停止
    if (window.simpleCameraStream) {
      var tracks = window.simpleCameraStream.getTracks();
      for (var i = 0; i < tracks.length; i++) {
        tracks[i].stop();
      }
      window.simpleCameraStream = null;
    }
  }
  
  // メッセージを表示
  function showMessage(message, type) {
    // 既存のメッセージを削除
    var existingMessage = document.getElementById('simple-camera-message');
    if (existingMessage && existingMessage.parentNode) {
      existingMessage.parentNode.removeChild(existingMessage);
    }
    
    // 新しいメッセージを作成
    var messageElement = document.createElement('div');
    messageElement.id = 'simple-camera-message';
    messageElement.className = 'alert alert-' + (type || 'info');
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.zIndex = '9999';
    messageElement.style.minWidth = '300px';
    messageElement.style.textAlign = 'center';
    messageElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    // 適切なアイコンを追加
    var icon = '';
    if (type === 'success') {
      icon = '<i class="fas fa-check-circle me-2"></i>';
    } else if (type === 'danger') {
      icon = '<i class="fas fa-exclamation-circle me-2"></i>';
    } else if (type === 'warning') {
      icon = '<i class="fas fa-exclamation-triangle me-2"></i>';
    } else {
      icon = '<i class="fas fa-info-circle me-2"></i>';
    }
    
    messageElement.innerHTML = icon + message;
    
    // bodyに追加
    document.body.appendChild(messageElement);
    
    // 3秒後に削除
    setTimeout(function() {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement);
      }
    }, 3000);
  }
  
  // ファイル末尾のコードを削除
})();