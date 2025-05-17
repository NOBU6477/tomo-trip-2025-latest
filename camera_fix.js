/**
 * 証明写真カメラ機能の最終的な修正スクリプト
 * モーダル表示後に直接セクションを置き換えて確実にカメラ機能を実装
 * 身分証明書タイプに応じた必要書類アップロード機能も追加
 */
(function() {
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('カメラ修正スクリプトを初期化');
    
    // カメラボタンクリック監視
    document.addEventListener('click', function(event) {
      const target = event.target;
      
      // カメラボタンのクリックを処理
      if (isCameraButton(target)) {
        console.log('カメラボタンがクリックされました');
        
        // カメラモーダル表示を待つ
        setTimeout(function() {
          const modal = document.querySelector('.modal.show');
          
          if (modal && isCameraModal(modal)) {
            console.log('カメラモーダルを検出');
            setupCameraModal(modal);
          }
        }, 300);
      }
      
      // 「この写真を使用」ボタンのクリックを処理
      if (isUsePhotoButton(target)) {
        console.log('「この写真を使用」ボタンがクリックされました');
        event.preventDefault();
        
        const modal = target.closest('.modal');
        if (modal) {
          handleUsePhoto(modal);
        }
        
        return false;
      }
    });
    
    // モーダル追加を監視
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && 
                node.classList && 
                node.classList.contains('modal')) {
              
              if (isModalVisible(node) && isCameraModal(node)) {
                console.log('新しいカメラモーダルを検出');
                setupCameraModal(node);
              }
            }
          }
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 定期的に確認（モーダル表示を見逃さないため）
    setInterval(function() {
      const modal = document.querySelector('.modal.show');
      if (modal && isCameraModal(modal) && !modal._cameraSetup) {
        setupCameraModal(modal);
      }
    }, 500);
  });
  
  /**
   * カメラボタンかどうかを判定
   */
  function isCameraButton(element) {
    const button = element.closest('button');
    if (!button) return false;
    
    return button.textContent && 
           (button.textContent.includes('カメラ') || 
            button.textContent.includes('撮影'));
  }
  
  /**
   * 「この写真を使用」ボタンかどうかを判定
   */
  function isUsePhotoButton(element) {
    const button = element.closest('button');
    if (!button) return false;
    
    return button.textContent && 
           button.textContent.includes('この写真を使用');
  }
  
  /**
   * モーダルが表示中かどうかを判定
   */
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           getComputedStyle(modal).display !== 'none';
  }
  
  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('撮影') || 
                 title.textContent.includes('カメラ'))) {
      return true;
    }
    
    return modal.querySelector('video') !== null;
  }
  
  /**
   * カメラモーダルをセットアップ
   */
  function setupCameraModal(modal) {
    if (!modal || modal._cameraSetup) return;
    modal._cameraSetup = true;
    
    console.log('カメラモーダルをセットアップします');
    
    // ビデオ要素を確認
    let video = modal.querySelector('video');
    if (!video) {
      // ビデオ要素がなければ作成
      video = document.createElement('video');
      video.autoplay = true;
      video.className = 'w-100';
      
      const body = modal.querySelector('.modal-body');
      if (body) {
        body.prepend(video);
      }
    }
    
    // カメラを起動
    startCamera(video);
    
    // モーダルのタイトルを確認
    const title = modal.querySelector('.modal-title');
    const isBackPhoto = title && title.textContent.includes('裏面');
    
    // 撮影ボタンを確認・作成
    let captureButton = findCaptureButton(modal);
    if (!captureButton) {
      captureButton = document.createElement('button');
      captureButton.type = 'button';
      captureButton.className = 'btn btn-primary';
      captureButton.textContent = '撮影';
      
      const footer = modal.querySelector('.modal-footer');
      if (footer) {
        footer.appendChild(captureButton);
      }
    }
    
    // 「この写真を使用」ボタンを確認・作成
    let useButton = findUsePhotoButton(modal);
    if (!useButton) {
      useButton = document.createElement('button');
      useButton.type = 'button';
      useButton.className = 'btn btn-success';
      useButton.textContent = 'この写真を使用';
      useButton.style.display = 'none';
      
      const footer = modal.querySelector('.modal-footer');
      if (footer) {
        footer.appendChild(useButton);
      }
    }
    
    // 撮影ボタンのイベント
    captureButton.addEventListener('click', function() {
      capturePhoto(modal);
    });
    
    // 「この写真を使用」ボタンのイベント
    useButton.addEventListener('click', function() {
      handleUsePhoto(modal);
    });
  }
  
  /**
   * カメラを起動
   */
  function startCamera(video) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        video.srcObject = stream;
      })
      .catch(function(error) {
        console.error('カメラアクセスエラー:', error);
      });
  }
  
  /**
   * 撮影ボタンを探す
   */
  function findCaptureButton(modal) {
    const buttons = modal.querySelectorAll('button');
    for (const button of buttons) {
      if (button.textContent.includes('撮影') && 
          !button.textContent.includes('この写真') && 
          !button.textContent.includes('再撮影')) {
        return button;
      }
    }
    return null;
  }
  
  /**
   * 「この写真を使用」ボタンを探す
   */
  function findUsePhotoButton(modal) {
    const buttons = modal.querySelectorAll('button');
    for (const button of buttons) {
      if (button.textContent.includes('この写真を使用')) {
        return button;
      }
    }
    return null;
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto(modal) {
    console.log('写真を撮影します');
    
    // ビデオ要素を取得
    const video = modal.querySelector('video');
    if (!video || !video.srcObject) {
      console.error('ビデオが準備できていません');
      return;
    }
    
    // キャンバスを作成して写真を描画
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // データURLを取得
    const imageData = canvas.toDataURL('image/jpeg');
    
    // プレビュー表示
    showPreview(modal, imageData);
    
    // ビデオを非表示
    video.style.display = 'none';
    
    // 撮影ボタンを非表示
    const captureButton = findCaptureButton(modal);
    if (captureButton) {
      captureButton.style.display = 'none';
    }
    
    // 「この写真を使用」ボタンを表示
    const useButton = findUsePhotoButton(modal);
    if (useButton) {
      useButton.style.display = '';
    }
    
    // 確認メッセージを表示
    showConfirmationMessage(modal);
  }
  
  /**
   * プレビュー表示
   */
  function showPreview(modal, imageData) {
    // 既存のプレビュー画像を探す
    let img = modal.querySelector('img.preview-image');
    
    // なければ作成
    if (!img) {
      img = document.createElement('img');
      img.className = 'preview-image img-fluid';
      img.style.maxHeight = '250px';
      img.style.margin = '0 auto';
      img.style.display = 'block';
      
      const body = modal.querySelector('.modal-body');
      if (body) {
        body.appendChild(img);
      }
    }
    
    // 画像を表示
    img.src = imageData;
    img.style.display = 'block';
  }
  
  /**
   * 確認メッセージを表示
   */
  function showConfirmationMessage(modal) {
    let message = modal.querySelector('.confirmation-message');
    
    if (!message) {
      message = document.createElement('h6');
      message.className = 'text-center mt-3 confirmation-message';
      message.textContent = '撮影された写真の確認';
      
      const body = modal.querySelector('.modal-body');
      if (body) {
        body.appendChild(message);
      }
    }
    
    message.style.display = 'block';
  }
  
  /**
   * 「この写真を使用」ボタンの処理
   */
  function handleUsePhoto(modal) {
    console.log('写真を使用します');
    
    // 画像を取得
    const img = modal.querySelector('img.preview-image');
    if (!img || !img.src) {
      console.error('画像が見つかりません');
      closeModal(modal);
      return;
    }
    
    // 写真タイプを判定（表/裏）
    const title = modal.querySelector('.modal-title');
    const isBack = title && (title.textContent.includes('裏面') || 
                           title.textContent.includes('back'));
    
    const imageData = img.src;
    const photoType = isBack ? 'back' : 'front';
    
    // データを一時保存
    window._photoData = {
      url: imageData,
      type: photoType
    };
    
    // カメラを停止
    const video = modal.querySelector('video');
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    
    // モーダルを閉じる
    closeModal(modal);
    
    // メインページに写真を反映
    setTimeout(updateMainPage, 300);
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    // 閉じるボタンをクリック
    const closeButton = modal.querySelector('.btn-close');
    if (closeButton) {
      closeButton.click();
      return;
    }
    
    // または Bootstrap API を使用
    try {
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
          return;
        }
      }
    } catch (error) {
      console.error('Bootstrap API エラー:', error);
    }
    
    // 直接 DOM 操作（最終手段）
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    
    // 背景も削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }
  
  /**
   * メインページを更新
   */
  function updateMainPage() {
    if (!window._photoData) return;
    
    const photoType = window._photoData.type;
    const imageData = window._photoData.url;
    
    console.log('メインページを更新:', photoType);
    
    // 画像とファイル入力のIDを決定
    let imageId, inputId;
    
    if (photoType === 'back') {
      imageId = 'back-photo-preview';
      inputId = 'back-photo-input';
    } else {
      imageId = 'front-photo-preview';
      inputId = 'front-photo-input';
    }
    
    // 画像プレビューを更新
    updateImagePreview(imageId, imageData);
    
    // ファイル入力を更新
    updateFileInput(inputId, imageData);
  }
  
  /**
   * 画像プレビューを更新
   */
  function updateImagePreview(id, imageData) {
    // ID指定の画像を探す
    let img = document.getElementById(id);
    
    // なければ画像を探す
    if (!img) {
      const images = document.querySelectorAll('img');
      for (const image of images) {
        if ((image.id && image.id.includes('photo')) || 
            (image.className && image.className.includes('photo'))) {
          img = image;
          break;
        }
      }
    }
    
    // 画像が見つかれば更新
    if (img) {
      img.src = imageData;
      img.style.display = 'block';
      
      // 親要素も表示
      const parent = img.parentElement;
      if (parent) {
        parent.style.display = 'block';
        parent.classList.remove('d-none');
      }
    }
  }
  
  /**
   * ファイル入力を更新
   */
  function updateFileInput(id, dataURL) {
    // ID指定のファイル入力を探す
    let input = document.getElementById(id);
    
    // なければファイル入力を探す
    if (!input) {
      const inputs = document.querySelectorAll('input[type="file"]');
      for (const fileInput of inputs) {
        if (fileInput.id && fileInput.id.includes('photo')) {
          input = fileInput;
          break;
        }
      }
    }
    
    // 入力が見つかればファイルを設定
    if (input && input.type === 'file') {
      const blob = dataURLToBlob(dataURL);
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].replace('data:', '');
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  }
})();