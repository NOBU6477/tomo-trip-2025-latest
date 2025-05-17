/**
 * 「この写真を使用」ボタンの最終修正
 * モーダル閉じる問題を完全に解決
 */
(function() {
  // メインボタン処理
  document.addEventListener('click', function(event) {
    // 「この写真を使用」ボタンの場合
    if (isUsePhotoButton(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      
      const modal = getCurrentModal();
      if (!modal) return;
      
      // 画像データとタイプを取得
      const data = getPhotoData(modal);
      if (!data) {
        forceCloseModal(modal);
        return;
      }
      
      // グローバル変数に保存
      window._savedPhotoData = data;
      
      // カメラ停止
      stopCamera(modal);
      
      // モーダルを完全に閉じる
      forceCloseModal(modal);
      
      // 少し遅延してメインページ更新
      setTimeout(updateMainPage, 200);
      
      return false;
    }
  }, true);
  
  /**
   * 「この写真を使用」ボタンかどうか判定
   */
  function isUsePhotoButton(element) {
    const button = element.closest('button');
    if (!button) return false;
    
    return (button.textContent && button.textContent.includes('この写真を使用')) ||
           button.classList.contains('btn-success');
  }
  
  /**
   * 現在表示中のモーダルを取得
   */
  function getCurrentModal() {
    const modals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
    return modals.length > 0 ? modals[0] : null;
  }
  
  /**
   * 写真データとタイプを取得
   */
  function getPhotoData(modal) {
    // タイトルから表/裏を判定
    const title = modal.querySelector('.modal-title');
    const isBack = title && title.textContent.includes('裏面');
    
    // 画像を探す
    const img = modal.querySelector('#preview-image') || 
                modal.querySelector('.preview-image') || 
                modal.querySelector('img');
    
    if (!img || !img.src) return null;
    
    return {
      src: img.src,
      type: isBack ? 'back' : 'front'
    };
  }
  
  /**
   * カメラを停止
   */
  function stopCamera(modal) {
    const video = modal.querySelector('video');
    if (video && video.srcObject) {
      try {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      } catch (e) {
        console.error('カメラ停止エラー:', e);
      }
    }
  }
  
  /**
   * モーダルを完全に閉じる
   */
  function forceCloseModal(modal) {
    // 方法1: 閉じるボタンクリック
    const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
    if (closeBtn) {
      closeBtn.click();
    }
    
    // 方法2: BootstrapのAPI使用
    try {
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
      }
    } catch (e) { 
      console.error('Bootstrap API エラー:', e);
    }
    
    // 方法3: モーダル表示制御を直接変更
    modal.style.display = 'none';
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    
    // 方法4: bodyのモーダル関連クラスとスタイルを削除
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // 方法5: モーダル背景を削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    });
    
    // 方法6: 他の開いているモーダルを強制的に閉じる
    document.querySelectorAll('.modal').forEach(m => {
      if (m !== modal) {
        m.style.display = 'none';
        m.classList.remove('show');
      }
    });
  }
  
  /**
   * メインページを更新
   */
  function updateMainPage() {
    const data = window._savedPhotoData;
    if (!data || !data.src) return;
    
    const imageData = data.src;
    const photoType = data.type;
    
    // 1. プレビュー画像を更新
    const previewIds = [
      `${photoType}-photo-image`,
      `photo-${photoType}-image`,
      'id-photo-image'
    ];
    
    let updated = false;
    
    // IDで画像を探す
    for (const id of previewIds) {
      const img = document.getElementById(id);
      if (img) {
        img.src = imageData;
        img.style.display = 'block';
        
        if (img.parentElement) {
          img.parentElement.style.display = 'block';
          img.parentElement.classList.remove('d-none');
        }
        
        updated = true;
        break;
      }
    }
    
    // 見つからなければ属性で探す
    if (!updated) {
      document.querySelectorAll('img').forEach(img => {
        if ((img.id && img.id.includes(photoType)) || 
            (img.className && img.className.includes(photoType))) {
          img.src = imageData;
          img.style.display = 'block';
          
          if (img.parentElement) {
            img.parentElement.style.display = 'block';
            img.parentElement.classList.remove('d-none');
          }
          
          updated = true;
        }
      });
    }
    
    // 2. コンテナ表示
    const containerIds = [
      `${photoType}-photo-preview`,
      `photo-${photoType}-preview`,
      'id-photo-preview'
    ];
    
    for (const id of containerIds) {
      const container = document.getElementById(id);
      if (container) {
        container.style.display = 'block';
        container.classList.remove('d-none');
      }
    }
    
    // 3. プレースホルダー非表示
    const placeholderIds = [
      `${photoType}-photo-placeholder`,
      `photo-${photoType}-placeholder`,
      'id-photo-placeholder'
    ];
    
    for (const id of placeholderIds) {
      const placeholder = document.getElementById(id);
      if (placeholder) {
        placeholder.style.display = 'none';
        placeholder.classList.add('d-none');
      }
    }
    
    // 4. ファイル入力を更新
    const inputIds = [
      `${photoType}-photo-input`,
      `photo-${photoType}-input`,
      'id-photo-input'
    ];
    
    for (const id of inputIds) {
      const input = document.getElementById(id);
      if (input && input.type === 'file') {
        updateFileInput(input, imageData);
        break;
      }
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
    } catch (e) {
      console.error('ファイル入力更新エラー:', e);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLのパターンチェック
    const match = dataURL.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return new Blob([''], { type: 'image/jpeg' });
    
    const contentType = match[1];
    const base64 = match[2];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    return new Blob([array], { type: contentType });
  }
})();