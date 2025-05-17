/**
 * 絶対に最小限の修正だけを行うスクリプト
 * 余計な機能は一切追加せず、既存の流れを尊重
 */
(function() {
  // ページが完全に読み込まれたら実行
  window.addEventListener('load', function() {
    console.log('最小限修正スクリプトを開始');
    
    // 1. タイプ選択UIの修正
    fixTypeSelection();
    
    // 2. 写真撮影ボタンの修正
    document.addEventListener('click', function(event) {
      // 「この写真を使用」ボタンのクリックを処理
      if (isUsePhotoButton(event.target)) {
        // デフォルトの動作を防止
        event.preventDefault();
        event.stopPropagation();
        
        // モーダルを閉じて写真を保存
        const modal = event.target.closest('.modal');
        if (modal) {
          savePhotoAndCloseModal(modal);
        }
        
        return false;
      }
    }, true);
  });
  
  /**
   * タイプ選択UIを修正
   */
  function fixTypeSelection() {
    // 証明写真タイプのボタンを修正
    const touristButton = document.querySelector('button:contains("観光客として登録"), button:contains("観光客")');
    if (touristButton) {
      // テキストを確認して修正
      if (touristButton.textContent.trim() === '観光客' || 
          !touristButton.textContent.includes('登録')) {
        touristButton.textContent = '観光客として登録';
      }
      
      // スタイルを確保
      touristButton.classList.add('btn', 'btn-primary', 'btn-lg', 'w-100');
      
      // クリックイベントを確認
      if (!touristButton._fixed) {
        const originalClick = touristButton.onclick;
        touristButton.onclick = function(e) {
          console.log('観光客として登録ボタンがクリックされました');
          if (typeof originalClick === 'function') {
            return originalClick.call(this, e);
          }
        };
        touristButton._fixed = true;
      }
    }
    
    // ガイドタイプのボタンを修正
    const guideButton = document.querySelector('button:contains("ガイドとして登録"), button:contains("ガイド")');
    if (guideButton) {
      // テキストを確認して修正
      if (guideButton.textContent.trim() === 'ガイド' || 
          !guideButton.textContent.includes('登録')) {
        guideButton.textContent = 'ガイドとして登録';
      }
      
      // スタイルを確保
      guideButton.classList.add('btn', 'btn-primary', 'btn-lg', 'w-100');
      
      // クリックイベントを確認
      if (!guideButton._fixed) {
        const originalClick = guideButton.onclick;
        guideButton.onclick = function(e) {
          console.log('ガイドとして登録ボタンがクリックされました');
          if (typeof originalClick === 'function') {
            return originalClick.call(this, e);
          }
        };
        guideButton._fixed = true;
      }
    }
  }
  
  /**
   * 「この写真を使用」ボタンかどうかを判定
   */
  function isUsePhotoButton(element) {
    const button = element.closest('button');
    if (!button) return false;
    
    return button.textContent && button.textContent.includes('この写真を使用');
  }
  
  /**
   * 写真を保存してモーダルを閉じる
   */
  function savePhotoAndCloseModal(modal) {
    // 1. 画像データを取得
    const img = modal.querySelector('img');
    if (!img || !img.src) {
      closeModal(modal);
      return;
    }
    
    // 2. 写真タイプを判定（表/裏）
    const title = modal.querySelector('.modal-title');
    const isBack = title && title.textContent.includes('裏面');
    const photoType = isBack ? 'back' : 'front';
    
    // 3. 一時データを保存
    const imageData = img.src;
    window._tempImageData = {
      data: imageData,
      type: photoType
    };
    
    // 4. カメラを停止
    const video = modal.querySelector('video');
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // 5. モーダルを閉じる
    closeModal(modal);
    
    // 6. メインページの要素を更新
    setTimeout(updateMainPage, 300);
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    // 1. 閉じるボタンをクリック
    const closeBtn = modal.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.click();
      return;
    }
    
    // 2. Bootstrap APIを使用
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
    
    // 3. 直接DOMを操作
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    // 4. 背景を削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }
  
  /**
   * メインページの要素を更新
   */
  function updateMainPage() {
    // 保存したデータを取得
    const tempData = window._tempImageData;
    if (!tempData || !tempData.data) return;
    
    const imageData = tempData.data;
    const photoType = tempData.type;
    
    // IDを決定
    const imgId = photoType === 'back' ? 'back-photo-image' : 'id-photo-image';
    const previewId = photoType === 'back' ? 'back-photo-preview' : 'id-photo-preview';
    const placeholderId = photoType === 'back' ? 'back-photo-placeholder' : 'id-photo-placeholder';
    const inputId = photoType === 'back' ? 'back-photo-input' : 'id-photo-input';
    
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
    } catch (e) {
      console.error('ファイル入力更新エラー:', e);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    try {
      // データURLのパターンをチェック
      const match = dataURL.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        throw new Error('Invalid dataURL format');
      }
      
      const contentType = match[1];
      const b64Data = match[2];
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      return new Blob(byteArrays, { type: contentType });
    } catch (e) {
      console.error('Blob変換エラー:', e);
      return new Blob([''], { type: 'image/jpeg' });
    }
  }
  
  // ユーティリティ：要素にcontains擬似セレクターを追加（修正のためだけに使用）
  if (!Element.prototype.querySelectorAll._extendedForContains) {
    const originalQuerySelectorAll = Element.prototype.querySelectorAll;
    Element.prototype.querySelectorAll = function(selector) {
      if (selector.includes(':contains(')) {
        // :contains()を含むセレクターを処理
        const parts = selector.split(':contains(');
        const baseSelector = parts[0];
        const searchText = parts[1].split(')')[0].replace(/['"]/g, '');
        
        // ベースセレクターで要素を取得
        const elements = originalQuerySelectorAll.call(this, baseSelector || '*');
        const result = [];
        
        // テキスト内容でフィルタリング
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].textContent && elements[i].textContent.includes(searchText)) {
            result.push(elements[i]);
          }
        }
        
        return result;
      }
      
      // 通常のセレクターの場合はオリジナルを使用
      return originalQuerySelectorAll.call(this, selector);
    };
    
    Element.prototype.querySelectorAll._extendedForContains = true;
  }
  
  if (!document.querySelectorAll._extendedForContains) {
    const originalDocQuerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = function(selector) {
      if (selector.includes(':contains(')) {
        // :contains()を含むセレクターを処理
        const parts = selector.split(':contains(');
        const baseSelector = parts[0];
        const searchText = parts[1].split(')')[0].replace(/['"]/g, '');
        
        // ベースセレクターで要素を取得
        const elements = originalDocQuerySelectorAll.call(this, baseSelector || '*');
        const result = [];
        
        // テキスト内容でフィルタリング
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].textContent && elements[i].textContent.includes(searchText)) {
            result.push(elements[i]);
          }
        }
        
        return result;
      }
      
      // 通常のセレクターの場合はオリジナルを使用
      return originalDocQuerySelectorAll.call(this, selector);
    };
    
    document.querySelectorAll._extendedForContains = true;
  }
})();