/**
 * 最もシンプルなボタン修正スクリプト
 * セレクターやロジックを最小限にして確実に動作するようにする
 */
(function() {
  // ページ読み込み完了後にスクリプトを実行
  window.addEventListener('load', function() {
    console.log('[シンプル修正] スクリプトを初期化しました');
    
    // 2秒ごとにモーダルをチェック
    setInterval(checkForActiveModals, 2000);
    
    // クリックイベントを監視
    document.addEventListener('click', handleButtonClick, true);
  });
  
  /**
   * 表示中のモーダルをチェックして改善
   */
  function checkForActiveModals() {
    // 表示中のすべてのモーダルを取得
    document.querySelectorAll('.modal').forEach(function(modal) {
      // 表示中のモーダルのみ処理
      if (isModalVisible(modal) && isCameraModal(modal)) {
        handleCameraModal(modal);
      }
    });
  }
  
  /**
   * モーダルが表示中かどうかを判定
   */
  function isModalVisible(modal) {
    return modal.classList.contains('show') || 
           modal.style.display === 'block' ||
           getComputedStyle(modal).display !== 'none';
  }
  
  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    // タイトルを取得
    const titleElement = modal.querySelector('.modal-title');
    if (titleElement) {
      const title = titleElement.textContent || '';
      if (title.includes('写真') || title.includes('カメラ') || title.includes('撮影')) {
        return true;
      }
    }
    
    // 内容で判定
    return !!modal.querySelector('video');
  }
  
  /**
   * カメラモーダルの処理
   */
  function handleCameraModal(modal) {
    // ボタンをすべて取得して処理
    const buttons = modal.querySelectorAll('button');
    buttons.forEach(function(button) {
      const text = button.textContent || '';
      
      // 「撮影する」ボタン
      if (text.includes('撮影') && !button._simpleFix) {
        button._simpleFix = true;
        console.log('[シンプル修正] 撮影ボタンを検出');
        
        // イベントリスナーを上書き
        button.addEventListener('click', function(e) {
          console.log('[シンプル修正] 撮影ボタンがクリックされました');
          setTimeout(function() {
            capturePhoto(modal);
          }, 100);
        }, true);
      }
      
      // 「この写真を使用」ボタン
      if (text.includes('この写真を使用') && !button._simpleFix) {
        button._simpleFix = true;
        console.log('[シンプル修正] 「この写真を使用」ボタンを検出');
        
        // イベントリスナーを上書き
        button.addEventListener('click', function(e) {
          console.log('[シンプル修正] 「この写真を使用」ボタンがクリックされました');
          e.preventDefault();
          e.stopPropagation();
          
          useCurrentPhoto(modal);
          
          return false;
        }, true);
      }
    });
  }
  
  /**
   * ボタンクリックイベントのハンドラー
   */
  function handleButtonClick(e) {
    const target = e.target;
    if (!target) return;
    
    // ボタン要素かどうか確認
    const button = target.closest('button');
    if (!button) return;
    
    const text = button.textContent || '';
    const modal = button.closest('.modal');
    
    // モーダル内の「撮影する」ボタン
    if (modal && text.includes('撮影')) {
      console.log('[シンプル修正] 撮影ボタンクリックを検出');
      setTimeout(function() {
        capturePhoto(modal);
      }, 100);
    }
    
    // モーダル内の「この写真を使用」ボタン
    if (modal && text.includes('この写真を使用')) {
      console.log('[シンプル修正] 「この写真を使用」ボタンクリックを検出');
      e.preventDefault();
      e.stopPropagation();
      
      useCurrentPhoto(modal);
      
      return false;
    }
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto(modal) {
    console.log('[シンプル修正] 写真撮影処理を実行');
    
    try {
      // ビデオ要素を取得
      const video = modal.querySelector('video');
      if (!video || !video.videoWidth) {
        console.log('[シンプル修正] 有効なビデオが見つからないため、スキップします');
        switchToPreviewMode(modal);
        return;
      }
      
      // プレビュー画像を取得または作成
      let previewImg = modal.querySelector('#preview-image');
      if (!previewImg) {
        previewImg = modal.querySelector('.preview-image');
      }
      if (!previewImg) {
        previewImg = modal.querySelector('img');
      }
      
      // プレビュー画像がなければ作成
      if (!previewImg) {
        // プレビューコンテナを探す
        let previewContainer = modal.querySelector('#preview-container');
        if (!previewContainer) {
          previewContainer = modal.querySelector('.preview-container');
        }
        if (!previewContainer) {
          previewContainer = modal.querySelector('.modal-body');
        }
        
        // 画像要素を作成
        if (previewContainer) {
          previewImg = document.createElement('img');
          previewImg.id = 'preview-image';
          previewImg.className = 'img-fluid preview-image';
          previewContainer.appendChild(previewImg);
        }
      }
      
      if (previewImg) {
        // キャンバスを使用して写真をキャプチャ
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // データURLを取得
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        
        // プレビュー画像を更新
        previewImg.src = imageData;
        
        // データを保存
        modal._capturedImage = imageData;
        
        console.log('[シンプル修正] 写真をキャプチャし、プレビューを更新しました');
      }
      
      // UI表示を切り替え
      switchToPreviewMode(modal);
      
    } catch (error) {
      console.error('[シンプル修正] 写真撮影エラー:', error);
      
      // エラーが発生した場合もプレビューモードに切り替え
      switchToPreviewMode(modal);
    }
  }
  
  /**
   * プレビューモードに切り替え
   */
  function switchToPreviewMode(modal) {
    console.log('[シンプル修正] プレビューモードに切り替えます');
    
    try {
      // 各要素を探す（IDとクラスの両方を試す）
      const videoContainer = modal.querySelector('#video-container') || 
                            modal.querySelector('.video-container');
      
      const previewContainer = modal.querySelector('#preview-container') || 
                              modal.querySelector('.preview-container');
      
      // 撮影ボタンを探す
      let captureBtn = null;
      const buttons = modal.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.includes('撮影')) {
          captureBtn = btn;
          break;
        }
      }
      
      // 「撮り直す」ボタンを探す
      let retakeBtn = null;
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.includes('撮り直')) {
          retakeBtn = btn;
          break;
        }
      }
      
      // 「この写真を使用」ボタンを探す
      let usePhotoBtn = null;
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.includes('この写真を使用')) {
          usePhotoBtn = btn;
          break;
        }
      }
      
      // 表示/非表示を切り替え
      if (videoContainer) {
        videoContainer.style.display = 'none';
        videoContainer.classList.add('d-none');
      }
      
      if (previewContainer) {
        previewContainer.style.display = 'block';
        previewContainer.classList.remove('d-none');
      }
      
      if (captureBtn) {
        captureBtn.style.display = 'none';
        captureBtn.classList.add('d-none');
      }
      
      if (retakeBtn) {
        retakeBtn.style.display = 'inline-block';
        retakeBtn.classList.remove('d-none');
      }
      
      if (usePhotoBtn) {
        usePhotoBtn.style.display = 'inline-block';
        usePhotoBtn.classList.remove('d-none');
      }
      
      console.log('[シンプル修正] UI要素の表示を切り替えました');
    } catch (error) {
      console.error('[シンプル修正] UI切り替えエラー:', error);
    }
  }
  
  /**
   * 現在の写真を使用
   */
  function useCurrentPhoto(modal) {
    console.log('[シンプル修正] 現在の写真を使用します');
    
    try {
      // 画像データを取得
      let imageData = modal._capturedImage;
      
      // データがなければプレビュー画像から取得
      if (!imageData) {
        const previewImg = modal.querySelector('#preview-image') || 
                          modal.querySelector('.preview-image') || 
                          modal.querySelector('img');
        
        if (previewImg && previewImg.src) {
          imageData = previewImg.src;
        }
      }
      
      // 画像データが取得できた場合
      if (imageData) {
        // 前後面の判定（モーダルタイトルから推測）
        const titleElement = modal.querySelector('.modal-title');
        const title = titleElement ? titleElement.textContent : '';
        const isBackSide = title.includes('裏');
        
        // 写真のタイプを特定
        const photoType = isBackSide ? 'back' : 'front';
        
        // 共通の変数に保存（モーダルが閉じた後に使用）
        window._lastPhotoData = imageData;
        window._lastPhotoType = photoType;
        
        console.log(`[シンプル修正] 写真データを保存: ${photoType}`);
      }
      
      // モーダルをゆっくり閉じる
      safelyCloseModal(modal);
      
      // 少し遅延してメインページの要素を更新
      setTimeout(function() {
        if (window._lastPhotoData) {
          updateMainPagePhoto(window._lastPhotoData, window._lastPhotoType);
        }
      }, 500);
      
    } catch (error) {
      console.error('[シンプル修正] 写真使用エラー:', error);
      
      // エラーが発生した場合もモーダルを閉じる
      safelyCloseModal(modal);
    }
  }
  
  /**
   * モーダルを安全に閉じる
   */
  function safelyCloseModal(modal) {
    console.log('[シンプル修正] モーダルを閉じます');
    
    try {
      // カメラストリームを停止
      const video = modal.querySelector('video');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
      
      // 閉じるボタンを探してクリック
      const closeBtn = modal.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // データ属性で閉じるボタンを探す
      const dismissBtn = modal.querySelector('[data-bs-dismiss="modal"]');
      if (dismissBtn) {
        dismissBtn.click();
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
          console.log('[シンプル修正] Bootstrap APIエラー:', e);
        }
      }
      
      // 最終手段：スタイルで非表示
      modal.style.display = 'none';
      modal.classList.remove('show');
      
      // 背景も削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
      // bodyのスタイルを戻す
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
    } catch (error) {
      console.error('[シンプル修正] モーダルを閉じる際のエラー:', error);
      
      // それでも失敗する場合は、最小限のスタイル変更だけ行う
      try {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      } catch (e) {
        // 何もしない
      }
    }
  }
  
  /**
   * メインページの写真を更新
   */
  function updateMainPagePhoto(imageData, photoType) {
    console.log(`[シンプル修正] メインページの写真を更新: ${photoType}`);
    
    try {
      // ID候補を定義
      const imageIdCandidates = [
        `${photoType}-photo-image`,
        `photo-${photoType}-image`,
        'id-photo-image',
        'profile-photo-image'
      ];
      
      // ID候補から画像要素を探す
      let photoImg = null;
      for (const id of imageIdCandidates) {
        const img = document.getElementById(id);
        if (img) {
          photoImg = img;
          console.log(`[シンプル修正] 画像要素を見つけました: #${id}`);
          break;
        }
      }
      
      // ID候補で見つからない場合、属性で探す
      if (!photoImg) {
        const allImages = document.querySelectorAll('img');
        for (const img of allImages) {
          if ((img.id && img.id.includes(photoType)) || 
              (img.alt && img.alt.includes(photoType)) || 
              (img.className && img.className.includes(photoType))) {
            photoImg = img;
            console.log(`[シンプル修正] 画像要素を属性から見つけました: ${img.id || img.className}`);
            break;
          }
        }
      }
      
      // それでも見つからない場合は、ページ内の最初の画像を使用
      if (!photoImg) {
        const firstImg = document.querySelector('img.preview-image') || 
                        document.querySelector('img[id*="preview"]') || 
                        document.querySelector('img[id*="photo"]');
        if (firstImg) {
          photoImg = firstImg;
          console.log('[シンプル修正] 最初の適切な画像要素を使用します');
        }
      }
      
      // 画像要素が見つかった場合、更新
      if (photoImg) {
        photoImg.src = imageData;
        photoImg.style.display = 'block';
        console.log('[シンプル修正] 画像を更新しました');
        
        // 親要素も表示
        if (photoImg.parentElement) {
          photoImg.parentElement.style.display = 'block';
          photoImg.parentElement.classList.remove('d-none');
        }
      }
      
      // プレースホルダーを非表示
      const placeholder = document.getElementById(`${photoType}-photo-placeholder`) || 
                         document.getElementById('id-photo-placeholder');
      if (placeholder) {
        placeholder.style.display = 'none';
        placeholder.classList.add('d-none');
      }
      
      // 入力要素にもデータを設定
      const fileInput = document.getElementById(`${photoType}-photo-input`) || 
                       document.getElementById('id-photo-input');
      if (fileInput && fileInput.type === 'file') {
        try {
          // 画像データをBlobに変換
          const blob = dataURLToBlob(imageData);
          
          // Fileオブジェクトを作成
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          // DataTransferオブジェクトを使用して入力要素に設定
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInput.files = dt.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          console.log('[シンプル修正] ファイル入力を更新しました');
        } catch (e) {
          console.error('[シンプル修正] ファイル入力更新エラー:', e);
        }
      }
      
    } catch (error) {
      console.error('[シンプル修正] メインページ更新エラー:', error);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLからバイナリに変換
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