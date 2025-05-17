/**
 * カメラ機能の総合的な修正スクリプト
 * カメラの撮影から写真使用まで一貫した修正
 * スマホ対応も含めたUI崩れを防止
 */
(function() {
  console.log('高度なカメラ修正スクリプトを初期化');
  
  // DOMが完全に読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了、カメラ修正を開始');
    
    // 1. すべてのクリックイベントを監視
    document.addEventListener('click', function(event) {
      const target = event.target;
      
      // カメラボタンクリック時
      if (isCameraButton(target)) {
        console.log('カメラボタンがクリックされました');
        
        // カメラモーダルが表示されるのを待つ
        setTimeout(setupCameraModal, 500);
      }
      
      // 撮影ボタンクリック時
      if (isCaptureButton(target)) {
        console.log('撮影ボタンがクリックされました');
        handleCapture(target);
      }
      
      // 「この写真を使用」ボタンクリック時
      if (isUsePhotoButton(target)) {
        console.log('「この写真を使用」ボタンがクリックされました');
        event.preventDefault();
        event.stopPropagation();
        
        const modal = target.closest('.modal');
        if (modal) {
          savePhotoAndCloseModal(modal);
        }
        
        return false;
      }
    }, true);
    
    // 2. モーダル表示を監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && 
                node.classList && 
                node.classList.contains('modal') && 
                isVisible(node)) {
              // カメラモーダルをセットアップ
              if (isCameraModal(node)) {
                console.log('カメラモーダルが追加されました');
                setupCameraModal(node);
              }
              
              // 運転免許証選択時のラジオボタン自動選択
              checkForDriverLicense();
            }
          }
        }
        
        // 属性変更を監視（モーダル表示時）
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' && 
            mutation.target.classList && 
            mutation.target.classList.contains('modal') && 
            mutation.target.classList.contains('show')) {
          
          if (isCameraModal(mutation.target)) {
            console.log('カメラモーダルが表示されました');
            setupCameraModal(mutation.target);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
    
    // 3. 表裏写真機能のラジオボタンを監視
    document.addEventListener('change', function(event) {
      if (event.target.type === 'radio' && 
          event.target.name === 'photoType') {
        console.log('写真タイプが変更されました:', event.target.value);
      }
      
      // 身分証明書タイプ選択時
      if (event.target.tagName === 'SELECT' && 
          (event.target.id.includes('document') || 
           event.target.id.includes('idType'))) {
        checkForDriverLicense();
      }
    });
    
    // 既存カメラモーダルをチェック
    setTimeout(function() {
      const modal = document.querySelector('.modal.show');
      if (modal && isCameraModal(modal)) {
        setupCameraModal(modal);
      }
    }, 1000);
  });
  
  /**
   * カメラボタンかどうかを判定
   */
  function isCameraButton(element) {
    // ボタン要素を取得
    const button = element.closest('button');
    if (!button) return false;
    
    // テキスト内容で判定
    return button.textContent && 
           (button.textContent.includes('カメラ') || 
            button.textContent.includes('撮影'));
  }
  
  /**
   * 撮影ボタンかどうかを判定
   */
  function isCaptureButton(element) {
    // ボタン要素を取得
    const button = element.closest('button');
    if (!button) return false;
    
    // テキスト内容で判定
    return button.textContent && 
           button.textContent.includes('撮影') && 
           !button.textContent.includes('再撮影') && 
           !button.textContent.includes('カメラで');
  }
  
  /**
   * 「この写真を使用」ボタンかどうかを判定
   */
  function isUsePhotoButton(element) {
    // ボタン要素を取得
    const button = element.closest('button');
    if (!button) return false;
    
    // テキスト内容で判定
    return button.textContent && 
           button.textContent.includes('この写真を使用');
  }
  
  /**
   * 要素が表示されているかどうかを判定
   */
  function isVisible(element) {
    if (!element) return false;
    
    return element.classList.contains('show') || 
           getComputedStyle(element).display !== 'none';
  }
  
  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    if (!modal) return false;
    
    // タイトルで判定
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('カメラ') || 
                 title.textContent.includes('撮影'))) {
      return true;
    }
    
    // ビデオ要素の存在で判定
    return modal.querySelector('video') !== null;
  }
  
  /**
   * カメラモーダルをセットアップ
   */
  function setupCameraModal(modal) {
    if (!modal) {
      modal = document.querySelector('.modal.show');
      if (!modal || !isCameraModal(modal)) return;
    }
    
    // すでに設定済みならスキップ
    if (modal._cameraSetup) return;
    modal._cameraSetup = true;
    
    console.log('カメラモーダルをセットアップ');
    
    // 1. ビデオ要素を確認
    const video = modal.querySelector('video');
    if (!video) {
      console.log('ビデオ要素がありません');
      return;
    }
    
    // 2. 「この写真を使用」ボタンが存在するか確認
    ensureUsePhotoButton(modal);
    
    // 3. 撮影ボタンを拡張
    const captureButton = modal.querySelector('button:not(.btn-close)');
    if (captureButton && captureButton.textContent.includes('撮影')) {
      // 既存のイベント削除のため、クローンして置き換え
      const newCaptureButton = captureButton.cloneNode(true);
      captureButton.parentNode.replaceChild(newCaptureButton, captureButton);
      
      // 新しいイベントリスナーを設定
      newCaptureButton.addEventListener('click', function() {
        console.log('拡張された撮影ボタンがクリックされました');
        handleCapture(modal);
      });
    }
  }
  
  /**
   * 「この写真を使用」ボタンを確保
   */
  function ensureUsePhotoButton(modal) {
    // すでに存在するか確認
    let useButton = null;
    const buttons = modal.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent && 
          buttons[i].textContent.includes('この写真を使用')) {
        useButton = buttons[i];
        break;
      }
    }
    
    // なければ作成
    if (!useButton) {
      const footer = modal.querySelector('.modal-footer');
      if (footer) {
        useButton = document.createElement('button');
        useButton.type = 'button';
        useButton.className = 'btn btn-success';
        useButton.textContent = 'この写真を使用';
        
        // イベントリスナーを設定
        useButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          savePhotoAndCloseModal(modal);
          
          return false;
        });
        
        footer.appendChild(useButton);
        console.log('「この写真を使用」ボタンを追加しました');
      }
    }
    
    // 初期状態では非表示
    if (useButton) {
      useButton.style.display = 'none';
    }
    
    return useButton;
  }
  
  /**
   * 撮影処理
   */
  function handleCapture(target) {
    // モーダルを取得
    const modal = target.closest('.modal') || 
                 document.querySelector('.modal.show');
    
    if (!modal) {
      console.log('モーダルが見つかりません');
      return;
    }
    
    // ビデオ要素を取得
    const video = modal.querySelector('video');
    if (!video) {
      console.log('ビデオ要素が見つかりません');
      return;
    }
    
    // キャンバスを作成
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // ビデオフレームをキャンバスに描画
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 画像データを取得
    const imageData = canvas.toDataURL('image/jpeg');
    
    // プレビュー表示を更新
    showPreview(modal, imageData);
    
    // 撮影ボタンを非表示
    const captureButton = modal.querySelector('button');
    if (captureButton && captureButton.textContent.includes('撮影')) {
      captureButton.style.display = 'none';
    }
    
    // ビデオを非表示
    if (video) {
      video.style.display = 'none';
      
      // ビデオストリームを停止
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    
    // 使用ボタンを表示
    const useButton = getUsePhotoButton(modal);
    if (useButton) {
      useButton.style.display = 'inline-block';
    }
    
    // 「撮影された写真の確認」メッセージを表示
    let confirmMessage = modal.querySelector('h6.confirmation-message');
    if (!confirmMessage) {
      confirmMessage = document.createElement('h6');
      confirmMessage.className = 'text-center mt-3 confirmation-message';
      confirmMessage.textContent = '撮影された写真の確認';
      
      const body = modal.querySelector('.modal-body');
      if (body) {
        body.appendChild(confirmMessage);
      }
    } else {
      confirmMessage.style.display = 'block';
    }
  }
  
  /**
   * プレビュー表示
   */
  function showPreview(modal, imageData) {
    // 既存の画像要素を探す
    let img = modal.querySelector('img');
    
    // なければ作成
    if (!img) {
      img = document.createElement('img');
      img.className = 'img-fluid preview-image mt-3';
      img.style.maxHeight = '300px';
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
   * 「この写真を使用」ボタンを取得
   */
  function getUsePhotoButton(modal) {
    // クラスで探す
    let useButton = modal.querySelector('.btn-success');
    
    // テキストで探す
    if (!useButton) {
      const buttons = modal.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent && 
            buttons[i].textContent.includes('この写真を使用')) {
          useButton = buttons[i];
          break;
        }
      }
    }
    
    return useButton;
  }
  
  /**
   * 写真を保存してモーダルを閉じる
   */
  function savePhotoAndCloseModal(modal) {
    console.log('写真を保存します');
    
    // 画像データを取得
    const img = modal.querySelector('img');
    if (!img || !img.src) {
      console.log('画像が見つかりません');
      closeModal(modal);
      return;
    }
    
    // 写真タイプを判定（表/裏）
    const title = modal.querySelector('.modal-title');
    const isBack = title && title.textContent.includes('裏面');
    const photoType = isBack ? 'back' : 'front';
    
    // 画像データを保存
    const imageData = img.src;
    window._tempImageData = {
      data: imageData,
      type: photoType
    };
    
    // カメラを停止
    const video = modal.querySelector('video');
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // モーダルを閉じる
    closeModal(modal);
    
    // メインページを更新
    setTimeout(updateMainPage, 300);
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    // 閉じるボタンをクリック
    const closeBtn = modal.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.click();
      return;
    }
    
    // Bootstrap APIを使用
    try {
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
          return;
        }
      }
    } catch (e) {
      console.error('Bootstrap API エラー:', e);
    }
    
    // 直接DOMを操作
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    // 背景を削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }
  
  /**
   * メインページを更新
   */
  function updateMainPage() {
    // 保存したデータを取得
    const tempData = window._tempImageData;
    if (!tempData || !tempData.data) return;
    
    const imageData = tempData.data;
    const photoType = tempData.type;
    
    console.log('メインページを更新:', photoType);
    
    // IDを決定
    let imgId, previewId, placeholderId, inputId;
    
    if (photoType === 'back') {
      imgId = 'back-photo-image';
      previewId = 'back-photo-preview';
      placeholderId = 'back-photo-placeholder';
      inputId = 'back-photo-input';
    } else {
      imgId = 'id-photo-image';
      previewId = 'id-photo-preview';
      placeholderId = 'id-photo-placeholder';
      inputId = 'id-photo-input';
    }
    
    // 画像を更新
    const img = document.getElementById(imgId);
    if (img) {
      img.src = imageData;
      img.style.display = 'block';
      
      // 親要素も表示
      const parent = img.parentElement;
      if (parent) {
        parent.style.display = 'block';
        parent.classList.remove('d-none');
      }
    } else {
      console.log(`画像要素が見つかりません: ${imgId}`);
      
      // 別の方法で画像要素を探す
      const allImages = document.querySelectorAll('img');
      for (let i = 0; i < allImages.length; i++) {
        if (allImages[i].id.includes('photo') || 
            allImages[i].className.includes('photo')) {
          console.log('代替画像要素を更新:', allImages[i].id);
          allImages[i].src = imageData;
          allImages[i].style.display = 'block';
        }
      }
    }
    
    // プレビューを表示
    const preview = document.getElementById(previewId);
    if (preview) {
      preview.style.display = 'block';
      preview.classList.remove('d-none');
    }
    
    // プレースホルダーを非表示
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.style.display = 'none';
      placeholder.classList.add('d-none');
    }
    
    // ファイル入力を更新
    const input = document.getElementById(inputId);
    if (input && input.type === 'file') {
      updateFileInput(input, imageData);
    } else {
      console.log(`ファイル入力が見つかりません: ${inputId}`);
      
      // 別の方法でファイル入力を探す
      const allInputs = document.querySelectorAll('input[type="file"]');
      
      // 入力要素を特定
      let fileInput = null;
      
      // ID名に基づいて検索
      for (let i = 0; i < allInputs.length; i++) {
        if (photoType === 'back' && allInputs[i].id.includes('back')) {
          fileInput = allInputs[i];
          break;
        } else if (photoType === 'front' && 
                  (allInputs[i].id.includes('photo') || 
                   allInputs[i].id.includes('id'))) {
          fileInput = allInputs[i];
          break;
        }
      }
      
      // 見つからない場合、位置に基づいて推測
      if (!fileInput && allInputs.length > 0) {
        if (photoType === 'front') {
          fileInput = allInputs[0]; // 最初の入力を前面と仮定
        } else if (photoType === 'back' && allInputs.length > 1) {
          fileInput = allInputs[1]; // 2番目の入力を裏面と仮定
        }
      }
      
      if (fileInput) {
        console.log('代替ファイル入力を更新:', fileInput.id);
        updateFileInput(fileInput, imageData);
      }
    }
  }
  
  /**
   * ファイル入力を更新
   */
  function updateFileInput(input, dataURL) {
    try {
      // データURLをBlobに変換
      const blob = dataURLToBlob(dataURL);
      
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
    } catch (e) {
      console.error('ファイル入力更新エラー:', e);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLの形式をチェック
    const match = dataURL.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      console.error('無効なデータURL形式');
      return new Blob([''], { type: 'image/jpeg' });
    }
    
    const contentType = match[1];
    const base64 = match[2];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    return new Blob([array], { type: contentType });
  }
  
  /**
   * 運転免許証選択時の表裏写真選択
   */
  function checkForDriverLicense() {
    // すべてのセレクト要素を確認
    const selects = document.querySelectorAll('select');
    
    selects.forEach(function(select) {
      // 証明書タイプのセレクトかどうかを確認
      if (select.id.includes('document') || 
          select.id.includes('idType')) {
        
        // 運転免許証が選択されているかチェック
        const isLicense = Array.from(select.options).some(function(option) {
          return option.selected && 
                 (option.textContent.includes('運転免許証') || 
                  option.value.includes('license'));
        });
        
        if (isLicense) {
          console.log('運転免許証が選択されました');
          
          // 表裏写真のラジオボタンを自動選択
          const radioInputs = document.querySelectorAll('input[type="radio"][name="photoType"]');
          
          for (let i = 0; i < radioInputs.length; i++) {
            if (radioInputs[i].value === 'dual' || 
                radioInputs[i].id.includes('dual') || 
                radioInputs[i].nextElementSibling && 
                radioInputs[i].nextElementSibling.textContent.includes('表裏')) {
              
              radioInputs[i].checked = true;
              
              // 変更イベントを発火
              const event = new Event('change', { bubbles: true });
              radioInputs[i].dispatchEvent(event);
              
              console.log('表裏写真ラジオボタンを自動選択しました');
              break;
            }
          }
        }
      }
    });
  }
})();