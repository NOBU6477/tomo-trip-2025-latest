/**
 * カメラを起動してすぐに撮影するスクリプト
 * ユーザーの操作ステップを減らすための最適化
 */
(function() {
  // ページ読み込み完了後に実行
  window.addEventListener('load', function() {
    console.log('[ダイレクト撮影] スクリプトを初期化しました');
    
    // カメラボタンのクリックイベントをリッスン
    document.addEventListener('click', handleCameraButtonClick, true);
  });
  
  /**
   * カメラボタンのクリックを処理
   */
  function handleCameraButtonClick(event) {
    // クリックされた要素とその親要素を確認
    const target = event.target;
    if (!target) return;
    
    // ボタン要素を取得
    const button = target.closest('button');
    if (!button) return;
    
    // カメラボタンかどうか確認
    const buttonText = button.textContent || '';
    const isCameraButton = buttonText.includes('カメラで撮影') || 
                          button.querySelector('img[src*="camera"]') !== null ||
                          button.className.includes('camera-btn');
    
    if (isCameraButton) {
      console.log('[ダイレクト撮影] カメラボタンがクリックされました');
      
      // モーダルが開く前にフラグをセット
      window._waitForCameraModal = true;
      window._cameraButtonData = {
        targetId: button.getAttribute('data-target') || '',
        photoType: button.getAttribute('data-photo-type') || 
                   (button.closest('[data-photo-type]') ? 
                     button.closest('[data-photo-type]').getAttribute('data-photo-type') : ''),
        isBack: buttonText.includes('裏面') || 
                (button.closest('.form-group') && 
                 button.closest('.form-group').textContent.includes('裏面'))
      };
      
      // モーダルを監視
      setTimeout(watchForCameraModal, 300);
    }
  }
  
  /**
   * カメラモーダルが表示されるのを監視
   */
  function watchForCameraModal() {
    if (!window._waitForCameraModal) return;
    
    // 表示中のモーダルを探す
    const modals = document.querySelectorAll('.modal.show');
    let cameraModal = null;
    
    for (const modal of modals) {
      if (isCameraModal(modal)) {
        cameraModal = modal;
        break;
      }
    }
    
    if (cameraModal) {
      console.log('[ダイレクト撮影] カメラモーダルを検出');
      window._waitForCameraModal = false;
      
      // 少し遅延してからカメラを直接撮影
      setTimeout(function() {
        directCapturePhoto(cameraModal);
      }, 500);
    } else {
      // まだモーダルが見つからない場合は再試行
      setTimeout(watchForCameraModal, 300);
    }
  }
  
  /**
   * モーダルがカメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('カメラ') || 
                 title.textContent.includes('撮影'))) {
      return true;
    }
    
    // 撮影ボタンの有無でも判定
    const captureButton = modal.querySelector('button');
    if (captureButton && (captureButton.textContent.includes('撮影') || 
                         captureButton.className.includes('capture'))) {
      return true;
    }
    
    // ビデオ要素の有無でも判定
    return modal.querySelector('video') !== null;
  }
  
  /**
   * 直接写真を撮影する処理
   */
  function directCapturePhoto(modal) {
    console.log('[ダイレクト撮影] 直接撮影を実行');
    
    // ビデオ要素を確認
    const video = modal.querySelector('video');
    if (!video) {
      console.log('[ダイレクト撮影] ビデオ要素がないため待機');
      
      // ビデオ要素がまだない場合は少し待ってから再試行
      setTimeout(function() {
        directCapturePhoto(modal);
      }, 500);
      return;
    }
    
    // ビデオがロードされてストリームが開始されるまで待機
    if (!video.srcObject || video.readyState < 2) {
      console.log('[ダイレクト撮影] ビデオストリームが準備できていません');
      
      // 最大5秒間待機
      let waitTime = 0;
      const checkInterval = setInterval(function() {
        waitTime += 500;
        
        // ビデオがロードされた、または最大待機時間を超えた場合
        if (video.readyState >= 2 || waitTime >= 5000) {
          clearInterval(checkInterval);
          takePhotoFromVideo(modal, video);
        }
      }, 500);
    } else {
      // すでにビデオが準備できている場合は直接撮影
      takePhotoFromVideo(modal, video);
    }
  }
  
  /**
   * ビデオから写真を撮影
   */
  function takePhotoFromVideo(modal, video) {
    try {
      console.log('[ダイレクト撮影] ビデオから写真を撮影');
      
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      
      canvas.width = width;
      canvas.height = height;
      
      // ビデオフレームを描画
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      
      // データURLを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // プレビュー表示を更新
      updatePreviewAndShowButtons(modal, imageData);
    } catch (error) {
      console.error('[ダイレクト撮影] 撮影エラー:', error);
      
      // エラーが発生した場合もプレビューモードに移行
      showConfirmButtons(modal);
    }
  }
  
  /**
   * プレビュー表示を更新し、確認ボタンを表示
   */
  function updatePreviewAndShowButtons(modal, imageData) {
    console.log('[ダイレクト撮影] プレビュー表示を更新');
    
    try {
      // ビデオコンテナを非表示
      const videoContainer = modal.querySelector('#video-container, .video-container');
      if (videoContainer) {
        videoContainer.style.display = 'none';
        videoContainer.classList.add('d-none');
      }
      
      // プレビュー画像を取得または作成
      let previewImg = modal.querySelector('#preview-image, .preview-image, img.preview');
      let previewContainer = modal.querySelector('#preview-container, .preview-container');
      
      // プレビュー画像が見つからない場合は作成
      if (!previewImg) {
        if (!previewContainer) {
          // プレビューコンテナがなければ作成
          previewContainer = document.createElement('div');
          previewContainer.id = 'preview-container';
          previewContainer.className = 'preview-container';
          
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
      
      // プレビュー画像を更新
      if (previewImg) {
        previewImg.src = imageData;
        previewImg.style.display = 'block';
        
        // プレビューコンテナを表示
        if (previewContainer) {
          previewContainer.style.display = 'block';
          previewContainer.classList.remove('d-none');
        }
      }
      
      // データを保存
      modal._capturedImage = imageData;
      
      // 確認ボタンを表示
      showConfirmButtons(modal);
      
      // 写真の確認メッセージがなければ追加
      if (!modal.querySelector('h6, h5, h4').textContent.includes('確認')) {
        const confirmHeading = document.createElement('h6');
        confirmHeading.textContent = '撮影された写真の確認';
        confirmHeading.className = 'mt-3 mb-2 text-center';
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody && previewContainer) {
          modalBody.insertBefore(confirmHeading, previewContainer);
        }
      }
    } catch (error) {
      console.error('[ダイレクト撮影] プレビュー更新エラー:', error);
      
      // エラーが発生した場合も確認ボタンは表示
      showConfirmButtons(modal);
    }
  }
  
  /**
   * 確認ボタンを表示
   */
  function showConfirmButtons(modal) {
    console.log('[ダイレクト撮影] 確認ボタンを表示');
    
    try {
      // 各ボタンを探す
      const captureBtn = modal.querySelector('button:has(i.fa-camera), button:contains("撮影")');
      let usePhotoBtn = modal.querySelector('button.btn-success, button.use-photo-btn, button:contains("この写真を使用")');
      let retakeBtn = modal.querySelector('button.btn-outline-primary, button.retake-btn, button:contains("撮り直")');
      
      // 撮影ボタンを非表示
      if (captureBtn) {
        captureBtn.style.display = 'none';
        captureBtn.classList.add('d-none');
      }
      
      // 「この写真を使用」ボタンがなければ作成
      if (!usePhotoBtn) {
        usePhotoBtn = document.createElement('button');
        usePhotoBtn.type = 'button';
        usePhotoBtn.className = 'btn btn-success use-photo-btn';
        usePhotoBtn.innerHTML = '<i class="fa fa-check"></i> この写真を使用';
        
        // モーダルフッターに追加
        const modalFooter = modal.querySelector('.modal-footer');
        if (modalFooter) {
          modalFooter.appendChild(usePhotoBtn);
        }
      }
      
      // 「撮り直す」ボタンがなければ作成
      if (!retakeBtn) {
        retakeBtn = document.createElement('button');
        retakeBtn.type = 'button';
        retakeBtn.className = 'btn btn-outline-primary retake-btn';
        retakeBtn.innerHTML = '<i class="fa fa-redo"></i> 撮り直す';
        
        // モーダルフッターに追加
        const modalFooter = modal.querySelector('.modal-footer');
        if (modalFooter && usePhotoBtn) {
          modalFooter.insertBefore(retakeBtn, usePhotoBtn);
        }
      }
      
      // ボタンを表示
      usePhotoBtn.style.display = 'inline-block';
      usePhotoBtn.classList.remove('d-none');
      
      retakeBtn.style.display = 'inline-block';
      retakeBtn.classList.remove('d-none');
      
      // 「この写真を使用」ボタンのイベントハンドラ
      usePhotoBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        useCurrentPhoto(modal);
        return false;
      };
      
      // 「撮り直す」ボタンのイベントハンドラ
      retakeBtn.onclick = function() {
        retakePhoto(modal);
      };
    } catch (error) {
      console.error('[ダイレクト撮影] ボタン表示エラー:', error);
    }
  }
  
  /**
   * 写真を撮り直す
   */
  function retakePhoto(modal) {
    console.log('[ダイレクト撮影] 写真を撮り直します');
    
    try {
      // プレビューコンテナを非表示
      const previewContainer = modal.querySelector('#preview-container, .preview-container');
      if (previewContainer) {
        previewContainer.style.display = 'none';
        previewContainer.classList.add('d-none');
      }
      
      // ビデオコンテナを表示
      const videoContainer = modal.querySelector('#video-container, .video-container');
      if (videoContainer) {
        videoContainer.style.display = 'block';
        videoContainer.classList.remove('d-none');
      }
      
      // ビデオ要素を取得
      const video = modal.querySelector('video');
      if (video && (!video.srcObject || video.paused)) {
        // カメラを再起動
        navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        })
        .then(function(stream) {
          video.srcObject = stream;
          video.play();
        })
        .catch(function(error) {
          console.error('[ダイレクト撮影] カメラ再起動エラー:', error);
        });
      }
      
      // 撮影ボタンを表示
      const captureBtn = modal.querySelector('button:has(i.fa-camera), button:contains("撮影")');
      if (captureBtn) {
        captureBtn.style.display = 'inline-block';
        captureBtn.classList.remove('d-none');
      }
      
      // 確認ボタンを非表示
      const usePhotoBtn = modal.querySelector('button.btn-success, button.use-photo-btn, button:contains("この写真を使用")');
      const retakeBtn = modal.querySelector('button.btn-outline-primary, button.retake-btn, button:contains("撮り直")');
      
      if (usePhotoBtn) {
        usePhotoBtn.style.display = 'none';
        usePhotoBtn.classList.add('d-none');
      }
      
      if (retakeBtn) {
        retakeBtn.style.display = 'none';
        retakeBtn.classList.add('d-none');
      }
      
      // 1秒後に再度撮影
      setTimeout(function() {
        directCapturePhoto(modal);
      }, 1000);
    } catch (error) {
      console.error('[ダイレクト撮影] 撮り直しエラー:', error);
    }
  }
  
  /**
   * 現在の写真を使用
   */
  function useCurrentPhoto(modal) {
    console.log('[ダイレクト撮影] 写真を使用します');
    
    try {
      // 画像データを取得
      const imageData = modal._capturedImage;
      if (!imageData) {
        console.error('[ダイレクト撮影] 画像データがありません');
        return;
      }
      
      // 写真タイプ（表/裏）を判定
      const titleElement = modal.querySelector('.modal-title');
      const title = titleElement ? titleElement.textContent : '';
      const isBackSide = title.includes('裏面');
      
      // 写真タイプを決定
      const photoType = isBackSide ? 'back' : 'front';
      
      // グローバル変数に保存
      window._lastPhotoData = imageData;
      window._lastPhotoType = photoType;
      
      // モーダルを閉じる
      closeModal(modal);
      
      // メインページの要素を更新
      setTimeout(function() {
        updateMainPagePhoto(imageData, photoType);
      }, 300);
    } catch (error) {
      console.error('[ダイレクト撮影] 写真使用エラー:', error);
      
      // エラーが発生した場合もモーダルは閉じる
      closeModal(modal);
    }
  }
  
  /**
   * モーダルを安全に閉じる
   */
  function closeModal(modal) {
    console.log('[ダイレクト撮影] モーダルを閉じます');
    
    try {
      // カメラストリームを停止
      const video = modal.querySelector('video');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
      
      // 標準的な方法でモーダルを閉じる
      const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // Bootstrap APIでモーダルを閉じる
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        try {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
            return;
          }
        } catch (e) {
          console.error('[ダイレクト撮影] Bootstrap API エラー:', e);
        }
      }
      
      // 最後の手段として直接CSSを変更
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      
      // 背景も削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } catch (error) {
      console.error('[ダイレクト撮影] モーダルを閉じる際のエラー:', error);
    }
  }
  
  /**
   * メインページの写真を更新
   */
  function updateMainPagePhoto(imageData, photoType) {
    console.log(`[ダイレクト撮影] メインページの写真を更新: ${photoType}`);
    
    try {
      // まず対応するID要素を探す
      const imageIdCandidates = [
        `${photoType}-photo-image`,
        `photo-${photoType}-image`,
        'id-photo-image',
        `${photoType}_photo_image`
      ];
      
      // コンテナIDの候補
      const containerIdCandidates = [
        `${photoType}-photo-preview`,
        `photo-${photoType}-preview`,
        'id-photo-preview',
        `${photoType}_photo_preview`
      ];
      
      // プレースホルダーIDの候補
      const placeholderIdCandidates = [
        `${photoType}-photo-placeholder`,
        `photo-${photoType}-placeholder`,
        'id-photo-placeholder',
        `${photoType}_photo_placeholder`
      ];
      
      // 入力IDの候補
      const inputIdCandidates = [
        `${photoType}-photo-input`,
        `photo-${photoType}-input`,
        'id-photo-input',
        `${photoType}_photo_input`
      ];
      
      // 要素を探す
      let photoImg = null;
      let previewContainer = null;
      let placeholder = null;
      let fileInput = null;
      
      // IDから画像を探す
      for (const id of imageIdCandidates) {
        const img = document.getElementById(id);
        if (img) {
          photoImg = img;
          break;
        }
      }
      
      // IDからコンテナを探す
      for (const id of containerIdCandidates) {
        const container = document.getElementById(id);
        if (container) {
          previewContainer = container;
          break;
        }
      }
      
      // IDからプレースホルダーを探す
      for (const id of placeholderIdCandidates) {
        const ph = document.getElementById(id);
        if (ph) {
          placeholder = ph;
          break;
        }
      }
      
      // IDから入力要素を探す
      for (const id of inputIdCandidates) {
        const input = document.getElementById(id);
        if (input && input.type === 'file') {
          fileInput = input;
          break;
        }
      }
      
      // 画像要素が見つからない場合は属性から探す
      if (!photoImg) {
        const allImages = document.querySelectorAll('img');
        for (const img of allImages) {
          if ((img.id && img.id.includes(photoType)) || 
              (img.className && img.className.includes(photoType)) ||
              (img.getAttribute('data-photo-type') === photoType)) {
            photoImg = img;
            break;
          }
        }
      }
      
      // ファイル入力が見つからない場合は属性から探す
      if (!fileInput) {
        const allInputs = document.querySelectorAll('input[type="file"]');
        for (const input of allInputs) {
          if ((input.id && input.id.includes(photoType)) || 
              (input.className && input.className.includes(photoType)) ||
              (input.getAttribute('data-photo-type') === photoType)) {
            fileInput = input;
            break;
          }
        }
      }
      
      // プレビュー画像を更新
      if (photoImg) {
        photoImg.src = imageData;
        photoImg.style.display = 'block';
        
        // 親要素も表示
        if (photoImg.parentElement) {
          photoImg.parentElement.classList.remove('d-none');
          photoImg.parentElement.style.display = 'block';
        }
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
      
      // ファイル入力を更新
      if (fileInput) {
        updateFileInput(fileInput, imageData);
      }
      
      // ファイル入力を探して更新
      if (!fileInput) {
        const containers = document.querySelectorAll(`.form-group:contains(${photoType}), .mb-3:contains(${photoType})`);
        for (const container of containers) {
          const input = container.querySelector('input[type="file"]');
          if (input) {
            updateFileInput(input, imageData);
            break;
          }
        }
      }
      
      // ステータスメッセージの更新
      const statusContainer = document.querySelector(`.${photoType}-photo-status, .photo-${photoType}-status`);
      if (statusContainer) {
        statusContainer.innerHTML = '<i class="fa fa-check-circle text-success"></i> アップロードされました';
        statusContainer.classList.remove('d-none');
        statusContainer.style.display = 'block';
      }
      
      // 成功メッセージを表示
      showSuccessMessage(`${photoType === 'front' ? '表面' : '裏面'}写真がアップロードされました`);
      
    } catch (error) {
      console.error('[ダイレクト撮影] メインページ更新エラー:', error);
    }
  }
  
  /**
   * ファイル入力要素を更新
   */
  function updateFileInput(input, imageData) {
    try {
      // データURLをBlobに変換
      const blob = dataURLToBlob(imageData);
      
      // ファイル名を生成
      const fileName = `photo_${Date.now()}.jpg`;
      
      // Fileオブジェクトを作成
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // DataTransferオブジェクトを使用
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      
      console.log('[ダイレクト撮影] ファイル入力を更新しました');
    } catch (error) {
      console.error('[ダイレクト撮影] ファイル入力更新エラー:', error);
    }
  }
  
  /**
   * 成功メッセージを表示
   */
  function showSuccessMessage(message) {
    try {
      // 既存のトースト要素があれば削除
      const existingToast = document.getElementById('success-toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      // トースト要素を作成
      const toast = document.createElement('div');
      toast.id = 'success-toast';
      toast.className = 'toast show position-fixed';
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.right = '20px';
      toast.style.zIndex = '9999';
      toast.style.backgroundColor = '#d4edda';
      toast.style.color = '#155724';
      toast.style.border = '1px solid #c3e6cb';
      toast.style.borderRadius = '4px';
      toast.style.padding = '10px 20px';
      toast.style.boxShadow = '0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)';
      toast.innerHTML = `<i class="fa fa-check-circle"></i> ${message}`;
      
      // ボディに追加
      document.body.appendChild(toast);
      
      // 3秒後に削除
      setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 500);
      }, 3000);
    } catch (error) {
      console.error('[ダイレクト撮影] メッセージ表示エラー:', error);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLをバイナリに変換
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const array = new Uint8Array(raw.length);
    
    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([array], { type: contentType });
  }
  
  // ":contains" セレクターに依存しない実装に変更
})();