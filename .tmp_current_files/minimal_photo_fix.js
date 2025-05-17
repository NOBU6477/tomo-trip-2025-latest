/**
 * シンプルな写真処理スクリプト
 * 最小限の機能だけを実装し、標準DOMメソッドのみを使用
 */
(function() {
  // カメラ関連のグローバル変数
  let videoStream = null;
  let activeModal = null;
  
  // ページロード完了時に実行
  window.addEventListener('load', function() {
    // 1. カメラボタンのクリックを監視
    document.addEventListener('click', function(event) {
      // カメラボタンのクリック
      if (isButton(event.target, 'カメラで撮影')) {
        console.log('カメラボタンがクリックされました');
        // ボタンがクリックされた後、モーダルが開くのを待つ
        setTimeout(checkCameraModal, 500);
      }
      
      // 「撮影する」ボタンのクリック
      if (isButton(event.target, '撮影')) {
        console.log('撮影ボタンがクリックされました');
        capturePhoto();
      }
      
      // 「この写真を使用」ボタンのクリック
      if (isButton(event.target, 'この写真を使用')) {
        console.log('この写真を使用ボタンがクリックされました');
        useCurrentPhoto();
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, true);
    
    // 2. モーダルの変化を監視
    setInterval(function() {
      const modal = findVisibleModalWithCamera();
      if (modal && !modal.dataset.processed) {
        console.log('カメラモーダルを検出しました');
        modal.dataset.processed = 'true';
        activeModal = modal;
        
        // 0.5秒後に自動撮影
        setTimeout(function() {
          simulateCaptureButton();
        }, 500);
      }
    }, 300);
  });
  
  /**
   * カメラモーダルをチェック
   */
  function checkCameraModal() {
    const modal = findVisibleModalWithCamera();
    if (modal) {
      console.log('カメラモーダルを検出しました');
      activeModal = modal;
      
      // 少し待ってから自動撮影
      setTimeout(function() {
        simulateCaptureButton();
      }, 500);
    } else {
      // モーダルがまだ開いていない場合、再試行
      setTimeout(checkCameraModal, 300);
    }
  }
  
  /**
   * 指定したテキストを含むボタンかどうかを判定
   */
  function isButton(element, text) {
    // 要素またはその親がボタン
    const button = element.tagName === 'BUTTON' ? 
                  element : element.closest('button');
    
    if (!button) return false;
    
    // テキストを含むか確認
    return button.textContent && button.textContent.includes(text);
  }
  
  /**
   * 表示中のカメラモーダルを探す
   */
  function findVisibleModalWithCamera() {
    const modals = document.querySelectorAll('.modal');
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      if (isModalVisible(modal) && (
          hasTitle(modal, '写真') || 
          hasTitle(modal, 'カメラ') || 
          hasTitle(modal, '撮影') ||
          modal.querySelector('video')
      )) {
        return modal;
      }
    }
    return null;
  }
  
  /**
   * モーダルが表示されているかどうかを判定
   */
  function isModalVisible(modal) {
    return modal.classList.contains('show') || 
           getComputedStyle(modal).display !== 'none';
  }
  
  /**
   * 指定したテキストを含むタイトルがあるかどうかを判定
   */
  function hasTitle(modal, text) {
    const title = modal.querySelector('.modal-title');
    return title && title.textContent && title.textContent.includes(text);
  }
  
  /**
   * 撮影ボタンを模擬的に押す
   */
  function simulateCaptureButton() {
    if (!activeModal) return;
    
    // 撮影ボタンを探す
    let captureButton = null;
    const buttons = activeModal.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      const text = buttons[i].textContent || '';
      if (text.includes('撮影')) {
        captureButton = buttons[i];
        break;
      }
    }
    
    if (captureButton) {
      console.log('撮影ボタンを押します');
      captureButton.click();
    } else {
      console.log('撮影ボタンが見つかりません');
      // ボタンが見つからない場合は自分で撮影
      capturePhoto();
    }
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto() {
    if (!activeModal) return;
    
    console.log('写真を撮影します');
    
    // ビデオ要素を取得
    const video = activeModal.querySelector('video');
    if (!video) {
      console.log('ビデオ要素が見つかりません');
      return;
    }
    
    try {
      // ビデオからキャンバスに描画
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // プレビュー表示を更新
      updatePreview(imageData);
      
      console.log('写真撮影完了');
    } catch (error) {
      console.error('写真撮影エラー:', error);
    }
  }
  
  /**
   * プレビュー表示を更新
   */
  function updatePreview(imageData) {
    if (!activeModal) return;
    
    console.log('プレビュー表示を更新');
    
    try {
      // 画像データを保存
      activeModal.dataset.imageData = imageData;
      
      // ビデオコンテナを非表示にする
      const videoContainer = activeModal.querySelector('.video-container');
      if (videoContainer) {
        videoContainer.style.display = 'none';
      }
      
      // プレビュー画像を探す
      let previewImg = activeModal.querySelector('#preview-image') || 
                       activeModal.querySelector('.preview-image') || 
                       activeModal.querySelector('img.preview');
      
      // なければ作成
      if (!previewImg) {
        // プレビューコンテナを探す
        let previewContainer = activeModal.querySelector('.preview-container');
        
        // なければ作成
        if (!previewContainer) {
          previewContainer = document.createElement('div');
          previewContainer.className = 'preview-container text-center mt-3';
          
          // モーダルボディに追加
          const modalBody = activeModal.querySelector('.modal-body');
          if (modalBody) {
            modalBody.appendChild(previewContainer);
          }
        }
        
        // 画像要素を作成
        previewImg = document.createElement('img');
        previewImg.id = 'preview-image';
        previewImg.className = 'preview-image img-fluid';
        previewImg.alt = '撮影された写真';
        previewContainer.appendChild(previewImg);
      }
      
      // 画像を更新
      previewImg.src = imageData;
      previewImg.style.display = 'block';
      previewImg.style.maxWidth = '100%';
      
      // UIを撮影確認モードに切り替え
      updateUIForConfirmation();
    } catch (error) {
      console.error('プレビュー更新エラー:', error);
    }
  }
  
  /**
   * UI表示を確認モードに切り替え
   */
  function updateUIForConfirmation() {
    if (!activeModal) return;
    
    console.log('UI表示を確認モードに切り替え');
    
    try {
      // 撮影ボタンを非表示
      const captureButton = findButtonByText(activeModal, '撮影');
      if (captureButton) {
        captureButton.style.display = 'none';
      }
      
      // 「この写真を使用」ボタンを表示
      let usePhotoButton = findButtonByText(activeModal, 'この写真を使用');
      
      // なければ作成
      if (!usePhotoButton) {
        // モーダルフッターを取得
        let footer = activeModal.querySelector('.modal-footer');
        
        // なければ作成
        if (!footer) {
          footer = document.createElement('div');
          footer.className = 'modal-footer';
          
          // モーダルコンテンツに追加
          const modalContent = activeModal.querySelector('.modal-content');
          if (modalContent) {
            modalContent.appendChild(footer);
          }
        }
        
        // ボタンを作成
        usePhotoButton = document.createElement('button');
        usePhotoButton.type = 'button';
        usePhotoButton.className = 'btn btn-success';
        usePhotoButton.textContent = 'この写真を使用';
        
        footer.appendChild(usePhotoButton);
      }
      
      // ボタンを表示
      usePhotoButton.style.display = 'inline-block';
      
      // クリックイベントを設定
      usePhotoButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        useCurrentPhoto();
        
        return false;
      };
    } catch (error) {
      console.error('UI更新エラー:', error);
    }
  }
  
  /**
   * テキストを含むボタンを探す
   */
  function findButtonByText(container, text) {
    const buttons = container.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent && buttons[i].textContent.includes(text)) {
        return buttons[i];
      }
    }
    
    return null;
  }
  
  /**
   * 現在の写真を使用
   */
  function useCurrentPhoto() {
    if (!activeModal) return;
    
    console.log('現在の写真を使用');
    
    try {
      // 画像データを取得
      const imageData = activeModal.dataset.imageData;
      if (!imageData) {
        console.error('画像データがありません');
        return;
      }
      
      // 裏面かどうかを判定
      const title = activeModal.querySelector('.modal-title');
      const isBackSide = title && title.textContent.includes('裏面');
      
      // 写真タイプを設定
      const photoType = isBackSide ? 'back' : 'front';
      
      // カメラストリームを停止
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
      }
      
      // データを一時的に保存
      window._photoData = {
        imageData: imageData,
        photoType: photoType
      };
      
      // モーダルを閉じる
      closeModal();
      
      // メイン画面の画像を更新
      setTimeout(function() {
        updateMainImage(imageData, photoType);
      }, 500);
    } catch (error) {
      console.error('写真使用エラー:', error);
      closeModal();
    }
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal() {
    if (!activeModal) return;
    
    console.log('モーダルを閉じる');
    
    try {
      // 閉じるボタンをクリック
      const closeButton = activeModal.querySelector('.btn-close');
      if (closeButton) {
        closeButton.click();
        return;
      }
      
      // Bootstrap APIを使用
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        try {
          const modalInstance = bootstrap.Modal.getInstance(activeModal);
          if (modalInstance) {
            modalInstance.hide();
            return;
          }
        } catch (e) {
          console.log('Bootstrap API エラー');
        }
      }
      
      // 直接操作
      activeModal.style.display = 'none';
      activeModal.classList.remove('show');
      
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      
      // 背景も削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } catch (error) {
      console.error('モーダルを閉じるエラー:', error);
    } finally {
      activeModal = null;
    }
  }
  
  /**
   * メイン画面の画像を更新
   */
  function updateMainImage(imageData, photoType) {
    console.log(`メイン画面の画像を更新: ${photoType}`);
    
    try {
      // ID候補リスト
      const imageIdCandidates = [
        `${photoType}-photo-image`,
        `photo-${photoType}-image`,
        'id-photo-image'
      ];
      
      const containerIdCandidates = [
        `${photoType}-photo-preview`,
        `photo-${photoType}-preview`,
        'id-photo-preview'
      ];
      
      const placeholderIdCandidates = [
        `${photoType}-photo-placeholder`,
        `photo-${photoType}-placeholder`,
        'id-photo-placeholder'
      ];
      
      const inputIdCandidates = [
        `${photoType}-photo-input`,
        `photo-${photoType}-input`,
        'id-photo-input'
      ];
      
      // 画像要素を探す
      let imageElement = null;
      
      // IDで検索
      for (const id of imageIdCandidates) {
        const img = document.getElementById(id);
        if (img) {
          imageElement = img;
          break;
        }
      }
      
      // 画像が見つからなければ属性で検索
      if (!imageElement) {
        const images = document.querySelectorAll('img');
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if ((img.id && img.id.includes(photoType)) || 
              (img.className && img.className.includes(photoType))) {
            imageElement = img;
            break;
          }
        }
      }
      
      // 画像を更新
      if (imageElement) {
        imageElement.src = imageData;
        imageElement.style.display = 'block';
        
        // 親要素も表示
        const parent = imageElement.parentElement;
        if (parent) {
          parent.style.display = 'block';
          parent.classList.remove('d-none');
        }
      } else {
        console.log('画像要素が見つかりません');
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
      console.error('メイン画像更新エラー:', error);
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
      
      console.log('ファイル入力を更新しました');
    } catch (error) {
      console.error('ファイル入力更新エラー:', error);
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
})();