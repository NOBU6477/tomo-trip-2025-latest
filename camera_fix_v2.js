/**
 * カメラ修正スクリプト 2.0 - 最小限のUIへの干渉で表裏写真機能とカメラ機能を修復
 */
(function() {
  // DOMが読み込まれたら初期化
  document.addEventListener('DOMContentLoaded', init);
  
  // グローバル変数
  let targetInputId = null;  // カメラで撮影対象のファイル入力ID
  
  /**
   * 初期化
   */
  function init() {
    // モーダルが表示されたときのイベントを監視
    document.addEventListener('shown.bs.modal', handleModalShown);
    
    // 書類タイプが変更されたときのイベントを監視
    document.addEventListener('change', handleSelectChange);
    
    // 既に表示されているモーダルをチェック
    document.querySelectorAll('.modal.show').forEach(handleExistingModal);
    
    // ボタンクリックのイベント監視
    document.addEventListener('click', handleButtonClick, true);
  }
  
  /**
   * モーダル表示イベントのハンドラー
   */
  function handleModalShown(event) {
    const modal = event.target;
    handleExistingModal(modal);
  }
  
  /**
   * 既存モーダルのハンドラー
   */
  function handleExistingModal(modal) {
    // モーダルのタイプを判断
    if (isIdDocumentModal(modal)) {
      setupIdDocumentModal(modal);
    } else if (isCameraModal(modal)) {
      setupCameraModal(modal);
    }
  }
  
  /**
   * セレクト変更イベントのハンドラー
   */
  function handleSelectChange(event) {
    if (event.target.tagName === 'SELECT') {
      const select = event.target;
      
      // 書類タイプセレクトかどうかを判定
      if (isDocumentTypeSelect(select)) {
        handleDocumentTypeChange(select);
      }
    }
  }
  
  /**
   * ボタンクリックイベントのハンドラー
   */
  function handleButtonClick(event) {
    // 撮影ボタンクリック
    if (isCaptureButton(event.target)) {
      setTimeout(() => fixCameraPreview(), 200);
    }
    
    // 「この写真を使用」ボタンクリック
    if (isUsePhotoButton(event.target)) {
      const modal = event.target.closest('.modal');
      if (modal) {
        event.preventDefault();
        event.stopPropagation();
        
        setTimeout(() => handleUsePhoto(modal), 100);
        return false;
      }
    }
    
    // カメラボタンクリック
    if (isCameraButton(event.target)) {
      const button = event.target.closest('button, a');
      if (button) {
        // ターゲット入力IDを特定
        targetInputId = button.getAttribute('data-target-input') || 
                       findNearestFileInput(button)?.id || null;
      }
    }
  }
  
  /***********************************************
   * ユーティリティ関数
   ***********************************************/
  
  /**
   * ID書類モーダルかどうかを判定
   */
  function isIdDocumentModal(modal) {
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('身分証明書') || 
                  title.textContent.includes('書類'))) {
      return true;
    }
    
    // コンテンツでチェック
    const content = modal.innerHTML;
    return content.includes('書類の種類') || 
           modal.querySelector('select[name*="document"]') !== null;
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
    
    // コンテンツでチェック
    return modal.querySelector('video') !== null || 
           modal.innerHTML.includes('撮影');
  }
  
  /**
   * 書類タイプのセレクト要素かどうかを判定
   */
  function isDocumentTypeSelect(select) {
    return select.id.includes('document') || 
           select.name.includes('document') || 
           select.closest('[data-document-type]');
  }
  
  /**
   * 撮影ボタンかどうかを判定
   */
  function isCaptureButton(element) {
    if (!element) return false;
    
    const button = element.closest('button');
    if (!button) return false;
    
    return button.id === 'capture-photo' || 
           button.classList.contains('capture-btn') || 
           button.textContent.includes('撮影');
  }
  
  /**
   * 「この写真を使用」ボタンかどうかを判定
   */
  function isUsePhotoButton(element) {
    if (!element) return false;
    
    const button = element.closest('button');
    if (!button) return false;
    
    return button.id === 'use-photo' || 
           button.classList.contains('use-photo-btn') || 
           button.textContent.includes('この写真を使用');
  }
  
  /**
   * カメラボタンかどうかを判定
   */
  function isCameraButton(element) {
    if (!element) return false;
    
    const button = element.closest('button, a');
    if (!button) return false;
    
    return button.classList.contains('camera-btn') || 
           button.classList.contains('btn-camera') || 
           button.getAttribute('data-bs-target') === '#cameraModal' || 
           button.textContent.includes('カメラ');
  }
  
  /**
   * 最も近いファイル入力要素を見つける
   */
  function findNearestFileInput(element) {
    // 親要素をたどってファイル入力を探す
    const container = element.closest('.input-group, .form-group');
    if (container) {
      return container.querySelector('input[type="file"]');
    }
    
    return null;
  }
  
  /***********************************************
   * カメラモーダル関連
   ***********************************************/
  
  /**
   * カメラモーダルのセットアップ
   */
  function setupCameraModal(modal) {
    // カメラモーダルにデータ属性を追加
    if (!modal.hasAttribute('data-camera-fixed')) {
      modal.setAttribute('data-camera-fixed', 'true');
      
      // ボタンイベントを追加
      setupCameraButtons(modal);
    }
  }
  
  /**
   * カメラモーダルのボタンをセットアップ
   */
  function setupCameraButtons(modal) {
    // 撮影ボタン
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn');
    if (captureBtn && !captureBtn._fixed) {
      captureBtn._fixed = true;
      captureBtn.addEventListener('click', () => {
        setTimeout(() => fixCameraPreview(), 200);
      });
    }
    
    // 「この写真を使用」ボタン
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn');
    if (usePhotoBtn && !usePhotoBtn._fixed) {
      usePhotoBtn._fixed = true;
      usePhotoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleUsePhoto(modal);
        return false;
      });
    }
  }
  
  /**
   * カメラのプレビュー問題を修正
   */
  function fixCameraPreview() {
    // 表示中のモーダルを取得
    const modal = document.querySelector('.modal.show');
    if (!modal || !isCameraModal(modal)) return;
    
    // プレビュー要素を取得
    const previewImg = modal.querySelector('#preview-image, .preview-image');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    
    if (previewImg && previewContainer && 
        !previewContainer.classList.contains('d-none')) {
      
      // 画像が空かチェック
      if (!previewImg.src || 
          previewImg.src === 'data:,' || 
          previewImg.naturalWidth === 0) {
        
        console.log('空のプレビュー画像を検出 - 修正します');
        
        // ビデオからキャプチャ
        const video = modal.querySelector('video');
        if (video && video.videoWidth && video.videoHeight) {
          try {
            // キャンバスを作成
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // ビデオフレームを描画
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // データURLを取得
            const imageData = canvas.toDataURL('image/jpeg', 0.9);
            
            // プレビュー画像を更新
            previewImg.src = imageData;
            previewImg.style.display = 'block';
            
            // データ属性に保存
            modal.setAttribute('data-captured-image', imageData);
          } catch (error) {
            console.error('ビデオキャプチャエラー:', error);
          }
        }
      }
    }
  }
  
  /**
   * 「この写真を使用」ボタンのハンドラー
   */
  function handleUsePhoto(modal) {
    // キャプチャした画像を取得
    let imageData = modal.getAttribute('data-captured-image');
    
    // データ属性になければプレビュー画像から取得
    if (!imageData) {
      const previewImg = modal.querySelector('#preview-image, .preview-image');
      if (previewImg && previewImg.src) {
        imageData = previewImg.src;
      }
    }
    
    if (!imageData) {
      console.error('使用する画像データが見つかりません');
      return;
    }
    
    // 対象となる入力要素を特定
    let targetInput = null;
    
    // グローバル変数からIDを取得
    if (targetInputId) {
      targetInput = document.getElementById(targetInputId);
    }
    
    // IDから見つからない場合は属性から探す
    if (!targetInput) {
      const targetInputIdFromModal = modal.getAttribute('data-target-input');
      if (targetInputIdFromModal) {
        targetInput = document.getElementById(targetInputIdFromModal);
      }
    }
    
    // 属性からも見つからない場合はDOM内の最初のファイル入力を使用
    if (!targetInput) {
      const firstFileInput = document.querySelector('input[type="file"]');
      if (firstFileInput) {
        targetInput = firstFileInput;
      }
    }
    
    // 入力要素が特定できたら処理
    if (targetInput) {
      // プレビュー表示を更新
      updatePreview(targetInput, imageData);
      
      // モーダルを閉じる
      try {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        } else {
          // Bootstrapインスタンスがない場合は手動で閉じる
          modal.style.display = 'none';
          modal.classList.remove('show');
          document.body.classList.remove('modal-open');
          
          // モーダル背景も削除
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.parentNode.removeChild(backdrop);
        }
      } catch (error) {
        console.error('モーダルを閉じる際にエラー:', error);
      }
    } else {
      console.error('対象となるファイル入力要素が見つかりません');
    }
  }
  
  /**
   * プレビュー表示を更新
   */
  function updatePreview(fileInput, imageData) {
    // 親要素を取得
    const container = fileInput.closest('.form-group, .input-group');
    if (!container) return;
    
    // プレビュー要素を探す
    let previewImg = container.querySelector('.preview-image, img[id*="preview"]');
    
    // プレビュー要素がなければ作成
    if (!previewImg) {
      // プレビューコンテナを探す
      let previewContainer = container.querySelector('.preview-container, .photo-preview');
      
      // コンテナがなければ作成
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-2';
        container.appendChild(previewContainer);
      }
      
      // プレビュー画像を作成
      previewImg = document.createElement('img');
      previewImg.className = 'preview-image img-fluid rounded';
      previewImg.alt = 'プレビュー';
      previewContainer.appendChild(previewImg);
    }
    
    // プレビュー画像を更新
    previewImg.src = imageData;
    previewImg.style.display = 'block';
    
    // データURLから変換してファイル入力に設定
    try {
      const blob = dataURLToBlob(imageData);
      const file = new File([blob], 'camera_photo.jpg', { type: 'image/jpeg' });
      
      // DataTransferオブジェクトでFileListを模倣
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
    } catch (error) {
      console.error('ファイル入力設定エラー:', error);
    }
    
    // プレースホルダーを非表示
    const placeholder = container.querySelector('.placeholder, [id*="placeholder"]');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }
  
  /**
   * DataURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLをデコード
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
  
  /***********************************************
   * 書類タイプ関連
   ***********************************************/
  
  /**
   * 身分証明書モーダルのセットアップ
   */
  function setupIdDocumentModal(modal) {
    // 書類選択セレクトを探す
    const documentSelect = modal.querySelector('select[name*="document"], #document-type');
    
    if (documentSelect) {
      // 現在の選択をチェック
      handleDocumentTypeChange(documentSelect);
      
      // 変更イベントリスナーを追加
      if (!documentSelect._fixed) {
        documentSelect._fixed = true;
        documentSelect.addEventListener('change', function() {
          handleDocumentTypeChange(this);
        });
      }
    }
  }
  
  /**
   * 書類タイプ変更ハンドラー
   */
  function handleDocumentTypeChange(select) {
    // 運転免許証かどうかをチェック
    const isLicense = isDriverLicense(select);
    
    if (isLicense) {
      console.log('運転免許証が選択されました');
      
      // 表裏写真が必要な書類タイプを選択した場合の処理
      const form = select.closest('form, .modal-body');
      if (form) {
        // フォーム内のラジオボタンを検索して設定
        const dualRadio = form.querySelector('input[type="radio"][value="dual"], input[type="radio"][id*="dual"]');
        if (dualRadio) {
          dualRadio.checked = true;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          dualRadio.dispatchEvent(event);
        }
      }
    }
  }
  
  /**
   * 運転免許証が選択されているかチェック
   */
  function isDriverLicense(select) {
    // 値でチェック
    const value = select.value.toLowerCase();
    if (value.includes('license') || value.includes('driver')) {
      return true;
    }
    
    // 選択されたテキストでチェック
    const selectedText = select.options[select.selectedIndex].text.toLowerCase();
    return selectedText.includes('運転免許証') || 
           selectedText.includes('driver') || 
           selectedText.includes('license');
  }
  
})();