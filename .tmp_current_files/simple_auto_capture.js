/**
 * シンプルな自動撮影スクリプト
 * 標準DOMセレクターのみを使用し、自動撮影を実現
 */
(function() {
  console.log('[自動撮影] スクリプト初期化');
  
  // カメラボタンのクリックを監視
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // カメラボタンかどうか判定
    if (target && (
        (target.textContent && target.textContent.includes('カメラで撮影')) ||
        (target.closest('button') && target.closest('button').textContent && 
         target.closest('button').textContent.includes('カメラで撮影'))
      )) {
      console.log('[自動撮影] カメラボタンがクリックされました');
      
      // カメラモーダルが表示されるのを待つ
      setTimeout(monitorForCameraModal, 500);
    }
  }, true);
  
  // モーダルの追加を監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1 && node.classList && node.classList.contains('modal')) {
            console.log('[自動撮影] 新しいモーダルを検出');
            
            // モーダルが表示されるまで少し待つ
            setTimeout(function() {
              if (isCameraModal(node)) {
                console.log('[自動撮影] カメラモーダルを検出');
                handleCameraModal(node);
              }
            }, 500);
          }
        }
      }
    });
  });
  
  // 監視を開始
  observer.observe(document.body, { childList: true, subtree: true });
  
  /**
   * カメラモーダルを監視
   */
  function monitorForCameraModal() {
    const modals = document.querySelectorAll('.modal');
    
    // 表示中のモーダルを確認
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      if (isVisible(modal) && isCameraModal(modal) && !modal._handled) {
        console.log('[自動撮影] 表示中のカメラモーダルを検出');
        handleCameraModal(modal);
        return;
      }
    }
    
    // 見つからなければ再試行
    setTimeout(monitorForCameraModal, 300);
  }
  
  /**
   * 要素が表示されているかチェック
   */
  function isVisible(element) {
    return element.classList.contains('show') || 
           getComputedStyle(element).display !== 'none';
  }
  
  /**
   * カメラモーダルかどうか判定
   */
  function isCameraModal(modal) {
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('カメラ') || 
                 title.textContent.includes('撮影'))) {
      return true;
    }
    
    // ビデオ要素の有無でチェック
    if (modal.querySelector('video')) {
      return true;
    }
    
    // ボタンの内容でチェック
    const buttons = modal.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const text = buttons[i].textContent || '';
      if (text.includes('撮影') || text.includes('カメラ')) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * カメラモーダルを処理
   */
  function handleCameraModal(modal) {
    // 既に処理済みならスキップ
    if (modal._handled) return;
    modal._handled = true;
    
    console.log('[自動撮影] カメラモーダルの処理を開始');
    
    // ビデオ要素を確認
    const video = modal.querySelector('video');
    
    if (video) {
      // ビデオがある場合、ストリーム開始を少し待ってから撮影
      console.log('[自動撮影] ビデオ要素を検出、準備を待機');
      
      // ビデオの準備を待機
      waitForVideoReady(video, function() {
        // ビデオが準備できたら撮影
        simulateCapture(modal, video);
      });
    } else {
      // ビデオがない場合、撮影ボタンを探して押す
      console.log('[自動撮影] 撮影ボタンを探します');
      
      // 撮影ボタンを探す
      let captureButton = null;
      const buttons = modal.querySelectorAll('button');
      
      for (let i = 0; i < buttons.length; i++) {
        const text = buttons[i].textContent || '';
        if (text.includes('撮影')) {
          captureButton = buttons[i];
          break;
        }
      }
      
      if (captureButton) {
        console.log('[自動撮影] 撮影ボタンを検出、クリック');
        captureButton.click();
        
        // クリック後に確認画面が表示されるまで待つ
        setTimeout(function() {
          handleConfirmationScreen(modal);
        }, 1000);
      } else {
        console.log('[自動撮影] 撮影ボタンが見つからない');
      }
    }
  }
  
  /**
   * ビデオの準備ができるまで待機
   */
  function waitForVideoReady(video, callback) {
    if (video.readyState >= 2) {
      // 既に準備完了
      callback();
      return;
    }
    
    // 最大5秒間待機
    let waitTime = 0;
    const interval = setInterval(function() {
      waitTime += 100;
      
      if (video.readyState >= 2) {
        clearInterval(interval);
        callback();
        return;
      }
      
      if (waitTime >= 5000) {
        // タイムアウト
        clearInterval(interval);
        console.log('[自動撮影] ビデオ準備タイムアウト');
        callback(); // 準備ができていなくても進める
      }
    }, 100);
  }
  
  /**
   * 撮影をシミュレート
   */
  function simulateCapture(modal, video) {
    console.log('[自動撮影] 撮影を実行');
    
    try {
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // ビデオフレームを描画
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // データURLを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // プレビュー表示を更新
      updatePreview(modal, imageData);
      
      // 確認画面を処理
      handleConfirmationScreen(modal);
    } catch (error) {
      console.error('[自動撮影] 撮影エラー:', error);
      
      // 既存のボタンを使用して代替
      const captureButton = findCaptureButton(modal);
      if (captureButton) {
        captureButton.click();
        
        // 確認画面が表示されるのを待つ
        setTimeout(function() {
          handleConfirmationScreen(modal);
        }, 1000);
      }
    }
  }
  
  /**
   * 撮影ボタンを探す
   */
  function findCaptureButton(modal) {
    const buttons = modal.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      const text = buttons[i].textContent || '';
      if (text.includes('撮影')) {
        return buttons[i];
      }
    }
    
    return null;
  }
  
  /**
   * 「この写真を使用」ボタンを探す
   */
  function findUsePhotoButton(modal) {
    const buttons = modal.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      const text = buttons[i].textContent || '';
      if (text.includes('この写真を使用')) {
        return buttons[i];
      }
    }
    
    return null;
  }
  
  /**
   * プレビュー表示を更新
   */
  function updatePreview(modal, imageData) {
    console.log('[自動撮影] プレビュー表示を更新');
    
    try {
      // ビデオコンテナを非表示
      const videoContainer = modal.querySelector('#video-container, .video-container');
      if (videoContainer) {
        videoContainer.style.display = 'none';
        videoContainer.classList.add('d-none');
      }
      
      // プレビュー画像を探す
      let previewImg = modal.querySelector('#preview-image') || 
                       modal.querySelector('.preview-image') || 
                       modal.querySelector('img');
      
      // プレビュー画像がなければ作成
      if (!previewImg) {
        // プレビューコンテナを探す
        let previewContainer = modal.querySelector('#preview-container') || 
                              modal.querySelector('.preview-container');
        
        // プレビューコンテナがなければ作成
        if (!previewContainer) {
          previewContainer = document.createElement('div');
          previewContainer.id = 'preview-container';
          previewContainer.className = 'preview-container text-center mt-3';
          
          // モーダルボディに追加
          const modalBody = modal.querySelector('.modal-body');
          if (modalBody) {
            modalBody.appendChild(previewContainer);
          }
        }
        
        // 画像要素を作成
        previewImg = document.createElement('img');
        previewImg.id = 'preview-image';
        previewImg.className = 'preview-image img-fluid';
        previewImg.style.maxWidth = '100%';
        
        previewContainer.appendChild(previewImg);
      }
      
      // 画像データを更新
      if (previewImg) {
        previewImg.src = imageData;
        previewImg.style.display = 'block';
      }
      
      // データを保存
      modal._imageData = imageData;
    } catch (error) {
      console.error('[自動撮影] プレビュー更新エラー:', error);
    }
  }
  
  /**
   * 確認画面を処理
   */
  function handleConfirmationScreen(modal) {
    console.log('[自動撮影] 確認画面を処理');
    
    // 「この写真を使用」ボタンを探す
    const usePhotoButton = findUsePhotoButton(modal);
    
    if (usePhotoButton) {
      console.log('[自動撮影] 「この写真を使用」ボタンを検出');
      
      // ボタンを表示
      usePhotoButton.style.display = 'inline-block';
      usePhotoButton.classList.remove('d-none');
      
      // クリックイベントを設定
      if (!usePhotoButton._handled) {
        usePhotoButton._handled = true;
        
        usePhotoButton.addEventListener('click', function(e) {
          console.log('[自動撮影] 「この写真を使用」ボタンがクリックされました');
          
          e.preventDefault();
          e.stopPropagation();
          
          // 写真を保存
          savePhoto(modal);
          
          return false;
        }, true);
      }
    } else {
      console.log('[自動撮影] 「この写真を使用」ボタンが見つかりません');
    }
  }
  
  /**
   * 写真を保存
   */
  function savePhoto(modal) {
    console.log('[自動撮影] 写真を保存');
    
    try {
      // 画像データを取得
      const imageData = modal._imageData;
      
      if (!imageData) {
        // モーダル内のプレビュー画像から取得
        const previewImg = modal.querySelector('#preview-image') || 
                          modal.querySelector('.preview-image') || 
                          modal.querySelector('img');
        
        if (previewImg && previewImg.src) {
          saveImageFromModal(modal, previewImg.src);
        } else {
          console.error('[自動撮影] 画像データが見つかりません');
        }
      } else {
        saveImageFromModal(modal, imageData);
      }
    } catch (error) {
      console.error('[自動撮影] 写真保存エラー:', error);
    }
  }
  
  /**
   * モーダルから画像を保存
   */
  function saveImageFromModal(modal, imageData) {
    // 表面か裏面かを判定
    const title = modal.querySelector('.modal-title');
    const isBackSide = title && title.textContent.includes('裏面');
    const photoType = isBackSide ? 'back' : 'front';
    
    // グローバル変数に保存
    window._lastPhotoData = imageData;
    window._lastPhotoType = photoType;
    
    // カメラストリームを停止
    const video = modal.querySelector('video');
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // モーダルを閉じる
    closeModal(modal);
    
    // メインページの写真を更新
    setTimeout(function() {
      updateMainPhoto(imageData, photoType);
    }, 500);
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    console.log('[自動撮影] モーダルを閉じる');
    
    try {
      // 閉じるボタンを探す
      const closeButton = modal.querySelector('.btn-close') || 
                         modal.querySelector('[data-bs-dismiss="modal"]');
      
      if (closeButton) {
        closeButton.click();
        return;
      }
      
      // Bootstrap APIを使用
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        try {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
            return;
          }
        } catch (e) {
          console.error('[自動撮影] Bootstrap API エラー:', e);
        }
      }
      
      // 直接操作
      modal.style.display = 'none';
      modal.classList.remove('show');
      
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // 背景も削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } catch (error) {
      console.error('[自動撮影] モーダルを閉じるエラー:', error);
    }
  }
  
  /**
   * メインページの写真を更新
   */
  function updateMainPhoto(imageData, photoType) {
    console.log(`[自動撮影] メインページの写真を更新: ${photoType}`);
    
    try {
      // 写真要素IDの候補
      const imageIdCandidates = [
        `${photoType}-photo-image`,
        `photo-${photoType}-image`,
        'id-photo-image'
      ];
      
      // コンテナIDの候補
      const containerIdCandidates = [
        `${photoType}-photo-preview`,
        `photo-${photoType}-preview`,
        'id-photo-preview'
      ];
      
      // プレースホルダーIDの候補
      const placeholderIdCandidates = [
        `${photoType}-photo-placeholder`,
        `photo-${photoType}-placeholder`,
        'id-photo-placeholder'
      ];
      
      // 入力要素IDの候補
      const inputIdCandidates = [
        `${photoType}-photo-input`,
        `photo-${photoType}-input`,
        'id-photo-input'
      ];
      
      // 要素を探す
      let photoImg = null;
      
      // IDから写真を探す
      for (const id of imageIdCandidates) {
        const img = document.getElementById(id);
        if (img) {
          photoImg = img;
          break;
        }
      }
      
      // IDから見つからなければクラスや属性から探す
      if (!photoImg) {
        const images = document.querySelectorAll('img');
        for (const img of images) {
          if ((img.id && img.id.includes(photoType)) || 
              (img.className && img.className.includes(photoType))) {
            photoImg = img;
            break;
          }
        }
      }
      
      // 写真が見つかったら更新
      if (photoImg) {
        photoImg.src = imageData;
        photoImg.style.display = 'block';
        
        // 親要素も表示
        const parent = photoImg.parentElement;
        if (parent) {
          parent.style.display = 'block';
          parent.classList.remove('d-none');
        }
      }
      
      // コンテナを表示
      for (const id of containerIdCandidates) {
        const container = document.getElementById(id);
        if (container) {
          container.style.display = 'block';
          container.classList.remove('d-none');
        }
      }
      
      // プレースホルダーを非表示
      for (const id of placeholderIdCandidates) {
        const placeholder = document.getElementById(id);
        if (placeholder) {
          placeholder.style.display = 'none';
          placeholder.classList.add('d-none');
        }
      }
      
      // ファイル入力を更新
      for (const id of inputIdCandidates) {
        const input = document.getElementById(id);
        if (input && input.type === 'file') {
          updateFileInput(input, imageData);
          break;
        }
      }
    } catch (error) {
      console.error('[自動撮影] メインページ更新エラー:', error);
    }
  }
  
  /**
   * ファイル入力を更新
   */
  function updateFileInput(input, imageData) {
    try {
      // データURLをBlobに変換
      const blob = dataURLToBlob(imageData);
      
      // Fileオブジェクトを作成
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // DataTransferオブジェクトを使用
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      
      console.log('[自動撮影] ファイル入力を更新しました');
    } catch (error) {
      console.error('[自動撮影] ファイル入力更新エラー:', error);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const array = new Uint8Array(raw.length);
    
    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([array], { type: contentType });
  }
})();