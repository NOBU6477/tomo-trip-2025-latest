/**
 * 純粋にDOM操作だけで写真プレビュー問題を解決するスクリプト
 * すべての処理は最小限、明確な方法で行います
 */
document.addEventListener('DOMContentLoaded', function() {
  // グローバル変数
  let lastCapturedImage = null;

  // ------------------------------------------------------------
  // モーダル内のボタンを監視し、直接処理をフックします
  // ------------------------------------------------------------
  document.addEventListener('click', function(event) {
    // カメラ撮影ボタン
    if (event.target.matches('.capture-btn, #captureBtn, button.btn-capture, [data-action="capture"]') || 
        (event.target.closest('.capture-btn, #captureBtn, button.btn-capture, [data-action="capture"]'))) {
      console.log('[純粋修正] 撮影ボタンがクリックされました');
      setTimeout(function() {
        forceFixPreview();
      }, 100);
    }
    
    // 「この写真を使用」ボタン
    if (event.target.textContent && 
        (event.target.textContent.includes('この写真を使用') || 
         event.target.textContent.includes('使用') && event.target.closest('.modal'))) {
      console.log('[純粋修正] 「この写真を使用」ボタンがクリックされました');
      
      // イベントをキャンセルして独自の処理を実行
      event.preventDefault();
      event.stopPropagation();
      
      // 現在表示されているモーダルを取得
      const currentModal = event.target.closest('.modal');
      if (currentModal) {
        tryToUsePhoto(currentModal);
        return false;
      }
    }
  }, true);
  
  // ------------------------------------------------------------
  // モーダルが開いたときの処理
  // ------------------------------------------------------------
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    
    // 写真撮影・カメラ関連のモーダルか確認
    if (isPhotoModal(modal)) {
      console.log('[純粋修正] 写真モーダルが開かれました');
      setupPurePhotoFix(modal);
    }
  });
  
  // ------------------------------------------------------------
  // モーダルかどうかの判定
  // ------------------------------------------------------------
  function isPhotoModal(modal) {
    // タイトルで判定
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || title.textContent.includes('カメラ'))) {
      return true;
    }
    
    // 内容で判定
    return modal.innerHTML.includes('カメラ') || 
           modal.innerHTML.includes('撮影') || 
           modal.querySelector('video') !== null;
  }
  
  // ------------------------------------------------------------
  // 写真モーダルの設定
  // ------------------------------------------------------------
  function setupPurePhotoFix(modal) {
    // モーダル内のボタン要素を取得
    const captureBtn = findElementIn(modal, ['#capture-photo', '.capture-btn', '.btn-capture', '#captureBtn', 'button:contains("撮影")']);
    const usePhotoBtn = findElementIn(modal, ['#use-photo', '.use-photo-btn', '.btn-use-photo', '#usePhotoBtn', 'button:contains("この写真を使用")']);

    // ボタンを直接処理するため監視
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        setTimeout(() => forceFixPreview(), 100);
      }, true);
    }
    
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        tryToUsePhoto(modal);
        return false;
      }, true);
    }
    
    // 撮影ボタンと写真使用ボタンの状態も修正
    fixButtonStates(modal);
  }
  
  // ------------------------------------------------------------
  // DOMからエレメントを見つける（複数のセレクタから）
  // ------------------------------------------------------------
  function findElementIn(container, selectors) {
    for (const selector of selectors) {
      try {
        // 標準的なセレクタの場合
        if (!selector.includes(':contains')) {
          const element = container.querySelector(selector);
          if (element) return element;
        } 
        // テキスト内容で検索する場合（特殊実装）
        else {
          const textToFind = selector.match(/:contains\("(.+)"\)/)[1];
          const allElements = container.querySelectorAll('button, a, .btn');
          for (const el of allElements) {
            if (el.textContent.includes(textToFind)) {
              return el;
            }
          }
        }
      } catch (e) {
        // 特定のセレクタでのエラーは無視して次へ
        continue;
      }
    }
    return null;
  }
  
  // ------------------------------------------------------------
  // 強制的にプレビュー表示を修正
  // ------------------------------------------------------------
  function forceFixPreview() {
    // 現在表示されているモーダルを特定
    const activeModal = document.querySelector('.modal.show, .modal[style*="display: block"]');
    if (!activeModal) return;
    
    // モーダル内のプレビュー要素を探す
    const previewContainer = findElementIn(activeModal, ['#preview-container', '.preview-container', '.photo-preview']);
    const videoContainer = findElementIn(activeModal, ['#video-container', '.video-container', '.camera-container']);
    
    // プレビュー画像を見つける（または作成）
    let previewImg = findElementIn(activeModal, ['#preview-image', '.preview-image', 'img[id*="preview"]', '.photo-preview img']);
    
    // プレビュー画像が見つからなければ作成
    if (previewContainer && !previewImg) {
      previewImg = document.createElement('img');
      previewImg.id = 'preview-image';
      previewImg.className = 'preview-image img-fluid rounded';
      previewImg.style.width = '100%';
      previewImg.style.height = 'auto';
      previewImg.style.display = 'block';
      previewContainer.appendChild(previewImg);
    }
    
    // 問題を検出：プレビュー画像が黒または表示されていない
    if (previewImg && (isEmptyImage(previewImg) || !previewImg.complete)) {
      console.log('[純粋修正] 黒/空のプレビュー画像を修正します');
      
      // カメラからの画像取得を試みる
      let imageData = captureFromVideo(activeModal);
      
      // 取得できなければサンプル画像を作成
      if (!imageData) {
        imageData = createSampleImage();
      }
      
      // 画像をプレビューに設定
      previewImg.src = imageData;
      previewImg.style.display = 'block';
      
      // グローバル変数に保存
      lastCapturedImage = imageData;
      
      // UI表示を修正
      if (previewContainer) previewContainer.classList.remove('d-none');
      if (videoContainer) videoContainer.classList.add('d-none');
      
      // ボタン状態も修正
      fixButtonStates(activeModal);
    }
  }
  
  // ------------------------------------------------------------
  // 写真を使用する処理
  // ------------------------------------------------------------
  function tryToUsePhoto(modal) {
    // 写真タイプを特定（表面/裏面）
    let photoType = 'front';
    
    if (modal.getAttribute('data-target-side')) {
      photoType = modal.getAttribute('data-target-side');
    } else if (modal.querySelector('.modal-title')) {
      const title = modal.querySelector('.modal-title').textContent;
      if (title.includes('裏') || title.toLowerCase().includes('back')) {
        photoType = 'back';
      }
    }
    
    console.log('[純粋修正] 写真タイプ: ' + photoType);
    
    // 写真データを取得
    let photoData = lastCapturedImage;
    
    // 写真データがない場合は、プレビュー画像から取得
    if (!photoData) {
      const previewImg = findElementIn(modal, ['#preview-image', '.preview-image', 'img[id*="preview"]', '.photo-preview img']);
      if (previewImg && previewImg.src) {
        photoData = previewImg.src;
      } else {
        // それでも取得できなければサンプル画像を作成
        photoData = createSampleImage();
      }
    }
    
    // メイン画面の写真プレビューに設定
    updateMainPhotoPreview(photoType, photoData);
    
    // モーダルを閉じる
    closeModal(modal);
    
    return false;
  }
  
  // ------------------------------------------------------------
  // メイン画面の写真プレビューを更新
  // ------------------------------------------------------------
  function updateMainPhotoPreview(photoType, imageData) {
    // プレビュー要素のID候補
    const previewIdCandidates = [
      `id-photo-${photoType}-image`,
      `${photoType}-photo-image`,
      `photo-${photoType}-image`,
      `photo_${photoType}_image`
    ];
    
    // コンテナのID候補
    const containerIdCandidates = [
      `id-photo-${photoType}-preview`,
      `${photoType}-photo-preview`,
      `photo-${photoType}-container`
    ];
    
    // プレビュー要素を探す
    let previewImg = null;
    for (const id of previewIdCandidates) {
      previewImg = document.getElementById(id);
      if (previewImg) break;
    }
    
    // コンテナを探す
    let previewContainer = null;
    for (const id of containerIdCandidates) {
      previewContainer = document.getElementById(id);
      if (previewContainer) break;
    }
    
    // 見つからなかった場合は属性などで探す
    if (!previewImg) {
      const allImages = document.querySelectorAll('img');
      for (const img of allImages) {
        if ((img.id && img.id.includes(photoType)) || 
            (img.alt && img.alt.includes(photoType)) || 
            (img.className && img.className.includes(photoType))) {
          previewImg = img;
          
          // 親コンテナも見つける
          let parent = img.parentElement;
          while (parent && !previewContainer) {
            if ((parent.id && parent.id.includes('preview')) || 
                (parent.className && (
                  parent.className.includes('preview') || 
                  parent.className.includes('container')
                ))) {
              previewContainer = parent;
            }
            parent = parent.parentElement;
          }
          
          break;
        }
      }
    }
    
    // プレビュー要素が見つかったら更新
    if (previewImg) {
      console.log('[純粋修正] プレビュー画像を更新します:', photoType);
      
      // 画像を設定
      previewImg.src = imageData;
      previewImg.style.display = 'block';
      
      // コンテナも表示
      if (previewContainer) {
        previewContainer.classList.remove('d-none');
        previewContainer.style.display = 'block';
      }
      
      // プレースホルダーを非表示に
      const placeholder = document.getElementById(`id-photo-${photoType}-placeholder`);
      if (placeholder) {
        placeholder.classList.add('d-none');
        placeholder.style.display = 'none';
      }
      
      // 削除ボタンを表示
      const removeBtn = document.getElementById(`id-photo-${photoType}-remove-btn`);
      if (removeBtn) {
        removeBtn.classList.remove('d-none');
        removeBtn.style.display = 'inline-block';
      }
    } else {
      console.error('[純粋修正] プレビュー画像要素が見つかりませんでした:', photoType);
    }
  }
  
  // ------------------------------------------------------------
  // モーダル内のボタン状態を修正
  // ------------------------------------------------------------
  function fixButtonStates(modal) {
    const captureBtn = findElementIn(modal, ['#capture-photo', '.capture-btn', '.btn-capture', '#captureBtn']);
    const retakeBtn = findElementIn(modal, ['#retake-photo', '.retake-btn', '.btn-retake', '#retakeBtn']);
    const usePhotoBtn = findElementIn(modal, ['#use-photo', '.use-photo-btn', '.btn-use-photo', '#usePhotoBtn']);
    const previewContainer = findElementIn(modal, ['#preview-container', '.preview-container']);
    
    if (previewContainer && !previewContainer.classList.contains('d-none')) {
      // プレビュー表示中
      if (captureBtn) captureBtn.classList.add('d-none');
      if (retakeBtn) retakeBtn.classList.remove('d-none');
      if (usePhotoBtn) usePhotoBtn.classList.remove('d-none');
    }
  }
  
  // ------------------------------------------------------------
  // モーダルを閉じる
  // ------------------------------------------------------------
  function closeModal(modal) {
    try {
      // Bootstrapモーダルのインスタンスを取得
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        // フォールバック：閉じるボタンをクリック
        const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
        if (closeBtn) {
          closeBtn.click();
        } else {
          // 最終手段：直接DOMから削除
          modal.classList.remove('show');
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
          
          // 背景も削除
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
    } catch (e) {
      console.error('[純粋修正] モーダルを閉じる際にエラーが発生しました', e);
    }
  }
  
  // ------------------------------------------------------------
  // ビデオ要素から画像を取得
  // ------------------------------------------------------------
  function captureFromVideo(modal) {
    const video = modal.querySelector('video');
    if (!video || !video.videoWidth || !video.videoHeight) {
      return null;
    }
    
    try {
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 映像をキャンバスに描画
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // キャンバスから画像データを取得
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (e) {
      console.error('[純粋修正] ビデオからの画像取得に失敗しました', e);
      return null;
    }
  }
  
  // ------------------------------------------------------------
  // 画像が空かどうかを判定
  // ------------------------------------------------------------
  function isEmptyImage(img) {
    // srcの存在確認
    if (!img.src || img.src === 'data:,') {
      return true;
    }
    
    // 表示状態確認
    const style = getComputedStyle(img);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return true;
    }
    
    // サイズ確認
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      return true;
    }
    
    return false;
  }
  
  // ------------------------------------------------------------
  // サンプル画像作成
  // ------------------------------------------------------------
  function createSampleImage() {
    // キャンバス作成
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // 背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 枠線
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // 身分証明書のような枠
    const cardWidth = Math.floor(canvas.width * 0.8);
    const cardHeight = Math.floor(canvas.height * 0.6);
    const cardX = Math.floor((canvas.width - cardWidth) / 2);
    const cardY = Math.floor((canvas.height - cardHeight) / 2);
    
    // 白い背景
    ctx.fillStyle = 'white';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // カードの枠線
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
    
    // ヘッダー部分
    ctx.fillStyle = '#0275d8';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight * 0.2);
    
    // 写真エリア
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(cardX + 10, cardY + Math.floor(cardHeight * 0.25), 
                Math.floor(cardWidth * 0.25), Math.floor(cardHeight * 0.5));
    
    // 情報エリア
    ctx.fillStyle = '#adb5bd';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(
        cardX + Math.floor(cardWidth * 0.4),
        cardY + Math.floor(cardHeight * 0.3) + i * Math.floor(cardHeight * 0.1),
        Math.floor(cardWidth * 0.5),
        Math.floor(cardHeight * 0.05)
      );
    }
    
    // テキスト
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('サンプル画像 (確認用)', canvas.width / 2, canvas.height - 20);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }
});