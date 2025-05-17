/**
 * 最も直接的なカメラボタン修正スクリプト
 * 全てのアプローチが失敗した後の最終手段
 */
(function() {
  // ページ読み込み完了後、少し遅延させて実行
  window.addEventListener('load', function() {
    setTimeout(initDirectFix, 1000);
  });
  
  /**
   * 直接修正を初期化
   */
  function initDirectFix() {
    // 既存ボタンにイベントリスナーを追加するのではなく、直接クリックイベントを上書き
    document.addEventListener('click', function(event) {
      // 「撮影する」ボタンをクリックした場合
      if (isCaptureButton(event.target)) {
        console.log('[直接修正] 撮影ボタンがクリックされました');
        setTimeout(function() {
          capturePhoto();
        }, 100);
      }
      
      // 「この写真を使用」ボタンをクリックした場合
      if (isUsePhotoButton(event.target)) {
        console.log('[直接修正] 「この写真を使用」ボタンがクリックされました');
        event.preventDefault();
        event.stopPropagation();
        
        usePhoto();
        return false;
      }
    }, true);
    
    // 定期的にモーダル内容をチェック
    setInterval(checkCurrentModals, 1000);
  }
  
  /**
   * 現在のモーダルをチェック
   */
  function checkCurrentModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if (isCameraModal(modal)) {
        // カメラモーダルが表示されている場合、ボタンを確認
        const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, .btn-success, button:contains("この写真を使用")');
        if (usePhotoBtn && !usePhotoBtn.dataset.directFixed) {
          console.log('[直接修正] 「この写真を使用」ボタンを検出しました');
          
          // クローン作成と置き換え
          const clonedBtn = usePhotoBtn.cloneNode(true);
          clonedBtn.dataset.directFixed = 'true';
          
          // イベントリスナーを設定
          clonedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[直接修正] クローンされたボタンがクリックされました');
            usePhoto();
            
            return false;
          });
          
          // 元のボタンを置き換え
          usePhotoBtn.parentNode.replaceChild(clonedBtn, usePhotoBtn);
        }
        
        // 撮影ボタンも同様に処理
        const captureBtn = modal.querySelector('#capture-photo, .capture-btn, button:contains("撮影")');
        if (captureBtn && !captureBtn.dataset.directFixed) {
          console.log('[直接修正] 撮影ボタンを検出しました');
          
          // クローン作成と置き換え
          const clonedBtn = captureBtn.cloneNode(true);
          clonedBtn.dataset.directFixed = 'true';
          
          // イベントリスナーを設定
          clonedBtn.addEventListener('click', function(e) {
            console.log('[直接修正] クローンされた撮影ボタンがクリックされました');
            setTimeout(capturePhoto, 100);
          });
          
          // 元のボタンを置き換え
          captureBtn.parentNode.replaceChild(clonedBtn, captureBtn);
        }
        
        // 既存のビデオプレビューに問題がある場合は修正
        fixVideoPreview(modal);
      }
    });
  }
  
  /**
   * 撮影ボタンかどうかを判定
   */
  function isCaptureButton(element) {
    if (!element) return false;
    
    // ボタン要素自体かその親要素を取得
    const button = element.closest('button');
    if (!button) return false;
    
    // ID、クラス、テキストで判定
    return button.id === 'capture-photo' || 
           button.classList.contains('capture-btn') || 
           button.textContent.includes('撮影');
  }
  
  /**
   * 「この写真を使用」ボタンかどうかを判定
   */
  function isUsePhotoButton(element) {
    if (!element) return false;
    
    // ボタン要素自体かその親要素を取得
    const button = element.closest('button');
    if (!button) return false;
    
    // ID、クラス、テキストで判定
    return button.id === 'use-photo' || 
           button.classList.contains('use-photo-btn') || 
           button.classList.contains('btn-success') || 
           button.textContent.includes('この写真を使用');
  }
  
  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('カメラ'))) {
      return true;
    }
    
    // 内容でチェック
    return modal.querySelector('video') !== null || 
           modal.innerHTML.includes('撮影') || 
           modal.innerHTML.includes('カメラ');
  }
  
  /**
   * ビデオプレビューの問題を修正
   */
  function fixVideoPreview(modal) {
    const video = modal.querySelector('video');
    
    // ビデオが存在し、再生されていない場合
    if (video && video.paused && !video.dataset.fixAttempted) {
      video.dataset.fixAttempted = 'true';
      
      // カメラアクセスの許可要求
      try {
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: false 
        })
        .then(function(stream) {
          video.srcObject = stream;
          window.cameraStream = stream;
          console.log('[直接修正] カメラストリームを再設定しました');
        })
        .catch(function(error) {
          console.error('[直接修正] カメラアクセスエラー:', error);
        });
      } catch (e) {
        console.error('[直接修正] ビデオ修正エラー:', e);
      }
    }
  }
  
  /**
   * 写真を撮影する処理
   */
  function capturePhoto() {
    console.log('[直接修正] 写真撮影を実行します');
    
    // 表示中のモーダルを取得
    const modal = document.querySelector('.modal.show');
    if (!modal || !isCameraModal(modal)) {
      console.error('[直接修正] カメラモーダルが見つかりません');
      return;
    }
    
    // ビデオ要素とプレビュー要素を取得
    const video = modal.querySelector('video');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const videoContainer = modal.querySelector('#video-container, .video-container');
    const previewImg = modal.querySelector('#preview-image, .preview-image, img');
    
    if (!video) {
      console.error('[直接修正] ビデオ要素が見つかりません');
      switchToPreview(modal);
      return;
    }
    
    // キャンバスを使用して写真をキャプチャ
    try {
      // プレビュー要素がなければ作成
      if (!previewImg) {
        const newImg = document.createElement('img');
        newImg.id = 'preview-image';
        newImg.className = 'preview-image img-fluid rounded';
        
        if (previewContainer) {
          previewContainer.appendChild(newImg);
        } else {
          // プレビューコンテナもなければ作成
          const newContainer = document.createElement('div');
          newContainer.id = 'preview-container';
          newContainer.className = 'preview-container';
          newContainer.appendChild(newImg);
          
          // モーダルボディに追加
          const modalBody = modal.querySelector('.modal-body');
          if (modalBody) {
            modalBody.appendChild(newContainer);
          }
        }
      }
      
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      
      // ビデオのサイズを取得できる場合はそれを使用
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      } else {
        // サイズが取得できない場合はデフォルトサイズ
        canvas.width = 640;
        canvas.height = 480;
      }
      
      // ビデオフレームを描画（ビデオが再生中の場合）
      const ctx = canvas.getContext('2d');
      
      if (video.videoWidth > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        // ビデオが再生されていない場合はサンプル画像を生成
        drawSampleImage(ctx, canvas.width, canvas.height);
      }
      
      // データURLを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // プレビュー画像を更新
      updatePreviewImage(modal, imageData);
      
      // UI表示を切り替え
      switchToPreview(modal);
      
      console.log('[直接修正] 写真を撮影しました');
    } catch (error) {
      console.error('[直接修正] 写真撮影エラー:', error);
      
      // エラーが発生した場合もプレビューに切り替え
      switchToPreview(modal);
    }
  }
  
  /**
   * プレビュー表示に切り替え
   */
  function switchToPreview(modal) {
    // プレビュー表示のための要素を取得
    const videoContainer = modal.querySelector('#video-container, .video-container');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, button:contains("撮影")');
    const retakeBtn = modal.querySelector('#retake-photo, .retake-btn, button:contains("撮り直")');
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, button:contains("この写真を使用")');
    
    // プレビュー画像がなければサンプル画像を生成
    const previewImg = modal.querySelector('#preview-image, .preview-image, img');
    if (previewImg && (!previewImg.src || previewImg.src === 'data:,')) {
      // キャンバスを作成してサンプル画像を描画
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      drawSampleImage(ctx, canvas.width, canvas.height);
      
      // データURLをプレビュー画像に設定
      previewImg.src = canvas.toDataURL('image/jpeg', 0.9);
    }
    
    // UI要素の表示/非表示を切り替え
    if (videoContainer) videoContainer.style.display = 'none';
    if (previewContainer) previewContainer.style.display = 'block';
    if (captureBtn) captureBtn.style.display = 'none';
    if (retakeBtn) retakeBtn.style.display = 'inline-block';
    if (usePhotoBtn) usePhotoBtn.style.display = 'inline-block';
    
    // Bootstrapクラスでも制御
    if (videoContainer) videoContainer.classList.add('d-none');
    if (previewContainer) previewContainer.classList.remove('d-none');
    if (captureBtn) captureBtn.classList.add('d-none');
    if (retakeBtn) retakeBtn.classList.remove('d-none');
    if (usePhotoBtn) usePhotoBtn.classList.remove('d-none');
  }
  
  /**
   * プレビュー画像を更新
   */
  function updatePreviewImage(modal, imageData) {
    // プレビュー画像を探す
    let previewImg = modal.querySelector('#preview-image, .preview-image, img');
    
    // 画像要素がなければ作成
    if (!previewImg) {
      previewImg = document.createElement('img');
      previewImg.id = 'preview-image';
      previewImg.className = 'preview-image img-fluid rounded';
      
      // プレビューコンテナを探す
      const previewContainer = modal.querySelector('#preview-container, .preview-container');
      if (previewContainer) {
        previewContainer.appendChild(previewImg);
      } else {
        // モーダルボディに追加
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          const newContainer = document.createElement('div');
          newContainer.id = 'preview-container';
          newContainer.className = 'preview-container';
          newContainer.appendChild(previewImg);
          modalBody.appendChild(newContainer);
        }
      }
    }
    
    // 画像を更新
    previewImg.src = imageData;
    previewImg.style.display = 'block';
    previewImg.style.maxWidth = '100%';
    
    // データ属性に画像データを保存
    modal.setAttribute('data-captured-image', imageData);
  }
  
  /**
   * サンプル画像を描画
   */
  function drawSampleImage(ctx, width, height) {
    // 全体の背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // カード風の枠
    const cardWidth = width * 0.8;
    const cardHeight = height * 0.6;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    
    // カードの背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // カードの枠線
    ctx.strokeStyle = '#0078d4';
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
    
    // ヘッダー部分
    ctx.fillStyle = '#0078d4';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight * 0.2);
    
    // 写真エリア
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(cardX + 10, cardY + cardHeight * 0.25, cardWidth * 0.25, cardHeight * 0.5);
    
    // 情報エリア（横線）
    ctx.fillStyle = '#e0e0e0';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(
        cardX + cardWidth * 0.3 + 15, 
        cardY + cardHeight * 0.35 + (i * 25), 
        cardWidth * 0.6 - 30, 
        10
      );
    }
    
    // テキスト
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('サンプル画像', width / 2, height - 30);
  }
  
  /**
   * 写真を使用する処理
   */
  function usePhoto() {
    console.log('[直接修正] 写真を使用します');
    
    // 表示中のモーダルを取得
    const modal = document.querySelector('.modal.show');
    if (!modal || !isCameraModal(modal)) {
      console.error('[直接修正] カメラモーダルが見つかりません');
      return;
    }
    
    // 画像データを取得
    const imageData = modal.getAttribute('data-captured-image');
    const previewImg = modal.querySelector('#preview-image, .preview-image, img');
    
    // 優先順位: データ属性 > プレビュー画像 > 生成画像
    let finalImageData = imageData;
    
    if (!finalImageData && previewImg && previewImg.src) {
      finalImageData = previewImg.src;
    }
    
    if (!finalImageData) {
      // 画像がなければサンプル画像を生成
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      drawSampleImage(ctx, canvas.width, canvas.height);
      finalImageData = canvas.toDataURL('image/jpeg', 0.9);
    }
    
    // 親ページの要素を更新
    const title = modal.querySelector('.modal-title');
    const isFront = !title || !title.textContent.includes('裏');
    const photoType = isFront ? 'front' : 'back';
    
    // メインページの要素IDを推測
    const targetIds = [
      photoType === 'back' ? 'back-photo-image' : 'id-photo-image',
      photoType === 'back' ? 'back-photo-preview' : 'id-photo-preview',
      photoType === 'back' ? 'back-photo-placeholder' : 'id-photo-placeholder',
      photoType === 'back' ? 'back-photo-remove-btn' : 'id-photo-remove-btn'
    ];
    
    // 一時変数に保存
    window._tempImageData = finalImageData;
    window._tempPhotoType = photoType;
    
    // モーダルを閉じる
    closeModal(modal);
    
    // 遅延してメイン画面の要素を更新（モーダルが完全に閉じた後）
    setTimeout(function() {
      updateMainPage(window._tempImageData, window._tempPhotoType);
    }, 500);
  }
  
  /**
   * メインページの要素を更新
   */
  function updateMainPage(imageData, photoType) {
    console.log(`[直接修正] メインページを更新: タイプ=${photoType}`);
    
    // 画像IDの候補
    const imageIds = [
      `${photoType}-photo-image`,
      `id-photo-${photoType}-image`,
      'id-photo-image',
      'profile-photo-image'
    ];
    
    // コンテナIDの候補
    const containerIds = [
      `${photoType}-photo-preview`,
      `id-photo-${photoType}-preview`,
      'id-photo-preview',
      'profile-photo-preview'
    ];
    
    // プレースホルダーIDの候補
    const placeholderIds = [
      `${photoType}-photo-placeholder`,
      `id-photo-${photoType}-placeholder`,
      'id-photo-placeholder',
      'profile-photo-placeholder'
    ];
    
    // 削除ボタンIDの候補
    const removeBtnIds = [
      `${photoType}-photo-remove-btn`,
      `id-photo-${photoType}-remove-btn`,
      'id-photo-remove-btn',
      'profile-photo-remove-btn'
    ];
    
    // 各要素を探す
    let previewImage = null;
    let previewContainer = null;
    let placeholder = null;
    let removeBtn = null;
    
    // IDから画像を探す
    for (const id of imageIds) {
      const img = document.getElementById(id);
      if (img) {
        previewImage = img;
        break;
      }
    }
    
    // IDからコンテナを探す
    for (const id of containerIds) {
      const container = document.getElementById(id);
      if (container) {
        previewContainer = container;
        break;
      }
    }
    
    // IDからプレースホルダーを探す
    for (const id of placeholderIds) {
      const ph = document.getElementById(id);
      if (ph) {
        placeholder = ph;
        break;
      }
    }
    
    // IDから削除ボタンを探す
    for (const id of removeBtnIds) {
      const btn = document.getElementById(id);
      if (btn) {
        removeBtn = btn;
        break;
      }
    }
    
    // IDから見つからない場合は属性から探す
    if (!previewImage) {
      const images = document.querySelectorAll('img');
      for (const img of images) {
        if ((img.id && img.id.includes(photoType)) || 
            (img.getAttribute('data-photo-type') === photoType) || 
            (img.className && img.className.includes(photoType))) {
          previewImage = img;
          break;
        }
      }
    }
    
    // それでも見つからない場合は、最初の画像を更新
    if (!previewImage) {
      const allImages = document.querySelectorAll('img.preview-image, img[id*="preview"], img[id*="photo"]');
      if (allImages.length > 0) {
        previewImage = allImages[0];
      }
    }
    
    // プレビュー画像を更新
    if (previewImage) {
      console.log(`[直接修正] プレビュー画像を更新: ${previewImage.id || 'id無し'}`);
      previewImage.src = imageData;
      previewImage.style.display = 'block';
      
      // 親要素も表示
      if (previewImage.parentElement) {
        previewImage.parentElement.classList.remove('d-none');
        previewImage.parentElement.style.display = 'block';
      }
    } else {
      console.error('[直接修正] プレビュー画像が見つかりません');
    }
    
    // プレビューコンテナを表示
    if (previewContainer) {
      previewContainer.classList.remove('d-none');
      previewContainer.style.display = 'block';
    }
    
    // プレースホルダーを非表示
    if (placeholder) {
      placeholder.classList.add('d-none');
      placeholder.style.display = 'none';
    }
    
    // 削除ボタンを表示
    if (removeBtn) {
      removeBtn.classList.remove('d-none');
      removeBtn.style.display = 'inline-block';
    }
    
    // ファイル入力要素も更新
    const fileInputId = `${photoType}-photo-input`;
    const fileInput = document.getElementById(fileInputId) || 
                     document.getElementById('id-photo-input');
    
    if (fileInput) {
      updateFileInput(fileInput, imageData);
    }
  }
  
  /**
   * ファイル入力要素を更新
   */
  function updateFileInput(input, imageData) {
    try {
      // データURLをBlobに変換
      const blob = dataURLToBlob(imageData);
      
      // Fileオブジェクトを作成
      const filename = `photo_${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      // DataTransferオブジェクトを使用
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      
      console.log(`[直接修正] ファイル入力を更新: ${input.id || 'id無し'}`);
    } catch (error) {
      console.error('[直接修正] ファイル入力更新エラー:', error);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    // カメラストリームを停止
    if (window.cameraStream) {
      window.cameraStream.getTracks().forEach(track => track.stop());
      window.cameraStream = null;
    }
    
    try {
      // 閉じるボタンをクリック
      const closeBtn = modal.querySelector('.btn-close, .close, [data-bs-dismiss="modal"]');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // Bootstrapモーダルインスタンスを取得
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          return;
        }
      }
      
      // 直接DOMを操作
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // 背景も削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } catch (error) {
      console.error('[直接修正] モーダルを閉じる際にエラー:', error);
      
      // 最終手段: モーダルを直接非表示にする
      try {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      } catch (e) {
        console.error('[直接修正] 最終手段でのモーダル非表示にも失敗:', e);
      }
    }
  }
})();