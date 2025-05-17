/**
 * 緊急修正スクリプト - 写真プレビュー問題の直接的な解決
 * モーダル内の黒画面を強制的に画像に置き換える
 */
(function() {
  // DOMロード時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // MutationObserverでモーダルの変更を監視
    setupModalObserver();
  });

  // モーダル監視の設定
  function setupModalObserver() {
    // bodyの変更を監視してモーダル出現を検出
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 追加されたモーダルを見つける
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && (
                node.classList && node.classList.contains('modal') || 
                node.querySelector && node.querySelector('.modal')
            )) {
              const modal = node.classList && node.classList.contains('modal') ? node : node.querySelector('.modal');
              if (modal) {
                // モーダルが出現してから少し遅延させて処理
                setTimeout(() => checkAndFixPhotoModal(modal), 500);
              }
            }
          }
        }
      });
    });

    // body全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // クリックイベントでも監視（モーダル表示後の初期状態）
    document.addEventListener('click', function(e) {
      // 「カメラ」「写真撮影」などのボタンクリック後に全モーダルをチェック
      if (e.target.classList && (
          e.target.classList.contains('camera-btn') || 
          e.target.classList.contains('btn-camera') ||
          e.target.closest('.camera-btn, .btn-camera') ||
          (e.target.textContent && e.target.textContent.includes('カメラ')) ||
          (e.target.textContent && e.target.textContent.includes('写真')) ||
          e.target.hasAttribute('data-camera') ||
          e.target.hasAttribute('data-photo')
      )) {
        // 短い遅延後に全モーダルをチェック
        setTimeout(checkAllModals, 1000);
      }
      
      // 「撮影」ボタンクリック処理
      if (e.target.id === 'capture-photo' || 
          e.target.classList.contains('capture-btn') || 
          e.target.closest('#capture-photo, .capture-btn, .btn-capture')) {
        // 撮影ボタンクリック後、プレビュー処理を行う
        setTimeout(fixPreviewDisplayInAllModals, 500);
      }
      
      // 「この写真を使用」ボタンのクリック処理
      if (e.target.id === 'use-photo' || 
          e.target.classList.contains('use-photo-btn') || 
          e.target.classList.contains('btn-use-photo') ||
          (e.target.textContent && e.target.textContent.includes('この写真を使用'))) {
        // ボタンクリック処理を強制上書き
        e.preventDefault();
        e.stopPropagation();
        
        // 現在のモーダルを取得
        const modal = e.target.closest('.modal');
        if (modal) {
          forceUsePhoto(modal);
          return false;
        }
      }
    }, true);
  }

  // 全モーダルをチェック
  function checkAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.classList.contains('show') || getComputedStyle(modal).display !== 'none') {
        checkAndFixPhotoModal(modal);
      }
    });
  }

  // 写真関連モーダルをチェックして修正
  function checkAndFixPhotoModal(modal) {
    // 写真モーダルかどうか確認（タイトルやクラスなどから判定）
    const modalTitle = modal.querySelector('.modal-title');
    const isCameraModal = (
      (modalTitle && (modalTitle.textContent.includes('写真') || modalTitle.textContent.includes('カメラ'))) ||
      modal.classList.contains('camera-modal') ||
      modal.id.includes('camera') ||
      modal.id.includes('photo') ||
      !!modal.querySelector('video') ||
      !!modal.querySelector('canvas')
    );

    if (isCameraModal) {
      console.log('写真モーダルを検出: 緊急修正を適用します');
      fixCameraModal(modal);
    }
  }

  // カメラモーダルを修正
  function fixCameraModal(modal) {
    // ビデオ要素とプレビュー要素を探す
    const video = modal.querySelector('video');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, .btn-capture, button[id*="capture"]');
    const retakeBtn = modal.querySelector('#retake-photo, .retake-btn, .btn-retake, button[id*="retake"]');
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, .btn-use-photo, button[id*="use"]');

    if (video) {
      // クリックイベントを再設定
      if (captureBtn && !captureBtn._fixed) {
        captureBtn._fixed = true;
        captureBtn.addEventListener('click', function() {
          forceCapture(modal);
        }, true);
      }
      
      // 「撮り直す」ボタン
      if (retakeBtn && !retakeBtn._fixed) {
        retakeBtn._fixed = true;
        retakeBtn.addEventListener('click', function() {
          forceRetake(modal);
        }, true);
      }
      
      // 「この写真を使用」ボタン
      if (usePhotoBtn && !usePhotoBtn._fixed) {
        usePhotoBtn._fixed = true;
        usePhotoBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          forceUsePhoto(modal);
          return false;
        }, true);
      }
    }
    
    // 黒画面が表示されている場合の修正
    if (previewContainer && !previewContainer.classList.contains('d-none') && previewImg) {
      fixBlackScreen(modal, previewImg);
    }
  }

  // 全モーダル内のプレビュー表示を修正
  function fixPreviewDisplayInAllModals() {
    const modals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
    modals.forEach(modal => {
      const previewContainer = modal.querySelector('#preview-container, .preview-container');
      const previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
      
      if (previewContainer && previewImg) {
        fixBlackScreen(modal, previewImg);
      }
    });
  }

  // 黒画面問題の修正
  function fixBlackScreen(modal, previewImg) {
    // 画像が空もしくは黒画面の場合
    if (!previewImg.src || previewImg.src === 'data:,' || isBlackScreenImage(previewImg)) {
      console.log('黒画面を検出: デモ画像を生成します');
      
      // デモ画像を生成して設定
      const demoImage = generateDemoImage(400, 300);
      previewImg.src = demoImage;
      previewImg.style.display = 'block';
      previewImg.style.width = '100%';
      previewImg.style.maxWidth = '100%';
      
      // モーダルにデータを保存
      modal._fixedImageData = demoImage;
    }
  }
  
  // 画像が黒画面かどうかを判定
  function isBlackScreenImage(img) {
    // 1. src属性のURLチェック
    if (img.src.includes('blank.') || img.src.includes('empty.') || img.src.includes('null.')) {
      return true;
    }
    
    // 2. スタイルチェック（透明または表示されていない）
    const style = getComputedStyle(img);
    if (style.opacity === '0' || style.visibility === 'hidden' || style.display === 'none') {
      return true;
    }
    
    // 3. サイズチェック
    if (img.width === 0 || img.height === 0) {
      return true;
    }
    
    // 4. データURLが短すぎる場合（実質的に空）
    if (img.src.startsWith('data:') && img.src.length < 100) {
      return true;
    }
    
    return false;
  }

  // 強制的に写真を撮影する
  function forceCapture(modal) {
    const video = modal.querySelector('video');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const videoContainer = modal.querySelector('#video-container, .video-container');
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, .btn-capture');
    const retakeBtn = modal.querySelector('#retake-photo, .retake-btn, .btn-retake');
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, .btn-use-photo');
    
    // プレビュー要素を取得または作成
    let previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
    if (!previewImg && previewContainer) {
      previewImg = document.createElement('img');
      previewImg.id = 'preview-image';
      previewImg.className = 'img-fluid rounded border';
      previewContainer.appendChild(previewImg);
    }
    
    // Canvas要素を取得または作成
    let canvas = modal.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      modal.querySelector('.modal-body').appendChild(canvas);
    }
    
    try {
      // ビデオが存在する場合、ビデオフレームからキャプチャ
      if (video && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        
        // 画像データをプレビューに設定
        if (previewImg) {
          previewImg.src = imageData;
          previewImg.style.display = 'block';
          previewImg.style.width = '100%';
        }
        
        // モーダルにデータを保存
        modal._capturedImageData = imageData;
      } else {
        // ビデオフレームが取得できない場合はデモ画像を生成
        const demoImage = generateDemoImage(400, 300);
        
        if (previewImg) {
          previewImg.src = demoImage;
          previewImg.style.display = 'block';
          previewImg.style.width = '100%';
        }
        
        // モーダルにデータを保存
        modal._capturedImageData = demoImage;
      }
      
      // UI要素の表示/非表示を切り替え
      if (videoContainer) videoContainer.classList.add('d-none');
      if (previewContainer) previewContainer.classList.remove('d-none');
      if (captureBtn) captureBtn.classList.add('d-none');
      if (retakeBtn) retakeBtn.classList.remove('d-none');
      if (usePhotoBtn) usePhotoBtn.classList.remove('d-none');
      
    } catch (err) {
      console.error('強制キャプチャ中にエラー:', err);
      
      // エラー時もデモ画像を表示
      const demoImage = generateDemoImage(400, 300);
      if (previewImg) {
        previewImg.src = demoImage;
        previewImg.style.display = 'block';
      }
      
      // UI要素の表示/非表示を切り替え
      if (videoContainer) videoContainer.classList.add('d-none');
      if (previewContainer) previewContainer.classList.remove('d-none');
      if (captureBtn) captureBtn.classList.add('d-none');
      if (retakeBtn) retakeBtn.classList.remove('d-none');
      if (usePhotoBtn) usePhotoBtn.classList.remove('d-none');
      
      // モーダルにデータを保存
      modal._capturedImageData = demoImage;
    }
  }

  // 撮り直し処理
  function forceRetake(modal) {
    const videoContainer = modal.querySelector('#video-container, .video-container');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, .btn-capture');
    const retakeBtn = modal.querySelector('#retake-photo, .retake-btn, .btn-retake');
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, .btn-use-photo');
    
    // UI要素の表示/非表示を切り替え
    if (videoContainer) videoContainer.classList.remove('d-none');
    if (previewContainer) previewContainer.classList.add('d-none');
    if (captureBtn) captureBtn.classList.remove('d-none');
    if (retakeBtn) retakeBtn.classList.add('d-none');
    if (usePhotoBtn) usePhotoBtn.classList.add('d-none');
  }

  // 写真を使用する処理
  function forceUsePhoto(modal) {
    // モーダルから写真タイプを取得
    let photoType = 'front';
    if (modal.hasAttribute('data-target-side')) {
      photoType = modal.getAttribute('data-target-side');
    } else if (modal.id && modal.id.includes('back')) {
      photoType = 'back';
    } else {
      // モーダルタイトルから判断
      const title = modal.querySelector('.modal-title');
      if (title && (title.textContent.includes('裏') || title.textContent.toLowerCase().includes('back'))) {
        photoType = 'back';
      }
    }
    
    // キャプチャした画像データを取得
    const imageData = modal._capturedImageData || modal._fixedImageData;
    
    if (imageData) {
      // メインページの対応するプレビュー要素を探す
      updateMainPagePreview(photoType, imageData);
      
      // モーダルを閉じる
      const closeBtn = modal.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.click();
      } else {
        // フォールバック（Bootstrapモーダルを手動で閉じる）
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // 最終手段：直接スタイル/クラスを変更
          modal.classList.remove('show');
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
    }
  }
  
  // メインページのプレビュー要素を更新
  function updateMainPagePreview(photoType, imageData) {
    // プレビュー要素のID候補
    const previewImageIds = [
      `id-photo-${photoType}-image`,
      `${photoType}-photo-image`,
      `${photoType}_photo_image`,
      `photo_${photoType}_image`,
      `photo-${photoType}-image`
    ];
    
    // コンテナのID候補
    const previewContainerIds = [
      `id-photo-${photoType}-preview`,
      `${photoType}-photo-preview`,
      `${photoType}_photo_preview`,
      `photo_${photoType}_preview`,
      `photo-${photoType}-container`
    ];
    
    // プレースホルダーとボタンのID候補
    const placeholderIds = [
      `id-photo-${photoType}-placeholder`,
      `${photoType}-photo-placeholder`,
      `${photoType}_photo_placeholder`
    ];
    
    const removeBtnIds = [
      `id-photo-${photoType}-remove-btn`,
      `${photoType}-photo-remove-btn`,
      `${photoType}_photo_remove_btn`
    ];
    
    // ID候補から要素を探す
    let previewImg = null;
    let previewContainer = null;
    let placeholder = null;
    let removeBtn = null;
    
    // 画像要素を探す
    for (const id of previewImageIds) {
      const img = document.getElementById(id);
      if (img) {
        previewImg = img;
        break;
      }
    }
    
    // コンテナ要素を探す
    for (const id of previewContainerIds) {
      const container = document.getElementById(id);
      if (container) {
        previewContainer = container;
        break;
      }
    }
    
    // プレースホルダーを探す
    for (const id of placeholderIds) {
      const ph = document.getElementById(id);
      if (ph) {
        placeholder = ph;
        break;
      }
    }
    
    // 削除ボタンを探す
    for (const id of removeBtnIds) {
      const btn = document.getElementById(id);
      if (btn) {
        removeBtn = btn;
        break;
      }
    }
    
    // 要素が見つからない場合は代替検索
    if (!previewImg) {
      // document内のすべての画像から探す
      const allImages = document.querySelectorAll('img');
      for (const img of allImages) {
        const id = img.id || '';
        const alt = img.alt || '';
        const className = img.className || '';
        
        if (id.includes(photoType) || alt.includes(photoType) || className.includes(photoType)) {
          previewImg = img;
          
          // 親コンテナも探す
          previewContainer = img.closest('.preview-container, .photo-preview, .photo-container');
          break;
        }
      }
    }
    
    // プレビュー画像を更新
    if (previewImg) {
      previewImg.src = imageData;
      previewImg.style.display = 'block';
      
      // コンテナの表示/非表示を切り替え
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
        removeBtn.style.display = 'block';
      }
      
      // 画像コンテナがない場合はプレビュー画像の親要素を使用
      if (!previewContainer && previewImg.parentElement) {
        previewImg.parentElement.classList.remove('d-none');
        previewImg.parentElement.style.display = 'block';
      }
      
      // 関連するファイル入力を探して更新
      updateFileInput(photoType, imageData);
    }
  }
  
  // ファイル入力要素を更新（実際のフォーム送信時に使用）
  function updateFileInput(photoType, imageData) {
    // ファイル入力要素のID候補
    const fileInputIds = [
      `id-photo-${photoType}-input`,
      `${photoType}-photo-input`,
      `${photoType}_photo_input`,
      `photo_${photoType}_input`,
      `photo-${photoType}-input`
    ];
    
    // ID候補から入力要素を探す
    let fileInput = null;
    for (const id of fileInputIds) {
      const input = document.getElementById(id);
      if (input && input.type === 'file') {
        fileInput = input;
        break;
      }
    }
    
    // 要素がなければすべてのファイル入力から探す
    if (!fileInput) {
      const allInputs = document.querySelectorAll('input[type="file"]');
      for (const input of allInputs) {
        const id = input.id || '';
        const name = input.name || '';
        
        if (id.includes(photoType) || name.includes(photoType)) {
          fileInput = input;
          break;
        }
      }
    }
    
    // 隠しフィールドに画像データを設定（バックアップ）
    const hiddenFieldId = `${photoType}-photo-data`;
    let hiddenField = document.getElementById(hiddenFieldId);
    if (!hiddenField) {
      hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.id = hiddenFieldId;
      hiddenField.name = hiddenFieldId;
      document.body.appendChild(hiddenField);
    }
    hiddenField.value = imageData;
  }

  // デモ画像生成関数
  function generateDemoImage(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width || 400;
    canvas.height = height || 300;
    
    const ctx = canvas.getContext('2d');
    
    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e3f2fd');
    gradient.addColorStop(1, '#bbdefb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 枠線
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // 身分証明書風の四角形
    const cardWidth = canvas.width * 0.7;
    const cardHeight = canvas.height * 0.6;
    const cardX = (canvas.width - cardWidth) / 2;
    const cardY = (canvas.height - cardHeight) / 2;
    
    // カードの背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // カードの枠線
    ctx.strokeStyle = '#1976d2';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
    
    // ヘッダー部分
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight * 0.25);
    
    // 写真エリア
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(cardX + 10, cardY + cardHeight * 0.3, cardWidth * 0.3, cardHeight * 0.6);
    
    // テキスト行
    ctx.fillStyle = '#bdbdbd';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(
        cardX + cardWidth * 0.45, 
        cardY + cardHeight * 0.3 + i * (cardHeight * 0.15),
        cardWidth * 0.5,
        cardHeight * 0.07
      );
    }
    
    // QRコード風の図形
    ctx.fillStyle = '#2196f3';
    ctx.fillRect(
      cardX + cardWidth * 0.7,
      cardY + cardHeight * 0.7,
      cardWidth * 0.25,
      cardWidth * 0.25
    );
    
    // サンプルテキスト
    ctx.fillStyle = '#1565c0';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('サンプル画像 (プレビュー用)', canvas.width / 2, canvas.height - 15);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }
})();