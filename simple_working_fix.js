/**
 * 最もシンプルな修正 - querySelector(':contains')問題の解決
 */
(function() {
  console.log('シンプル修正スクリプトを開始');
  
  // DOMが完全に読み込まれた後に実行
  window.addEventListener('load', function() {
    console.log('DOM読み込み完了');
    
    // ボタンクリックイベントを監視
    document.addEventListener('click', function(event) {
      const target = event.target;
      const button = target.closest('button');
      
      if (!button) return;
      
      // 「この写真を使用」ボタンを検出
      if (button.textContent && button.textContent.includes('この写真を使用')) {
        console.log('「この写真を使用」ボタンがクリックされました');
        
        event.preventDefault();
        event.stopPropagation();
        
        const modal = button.closest('.modal');
        if (modal) {
          savePhotoAndCloseModal(modal);
        }
        
        return false;
      }
    }, true);
    
    // ラジオボタンイベントを監視
    document.addEventListener('change', function(event) {
      const target = event.target;
      
      // 写真タイプのラジオボタン変更を検出
      if (target.type === 'radio' && target.name === 'photoType') {
        console.log('写真タイプが変更されました:', target.value);
        
        // 必要に応じた追加処理
      }
    });
    
    // カメラボタンの監視（テキスト検索による）
    setInterval(function() {
      // アカウントタイプモーダル内のボタンテキスト修正
      fixAccountTypeButtons();
      
      // カメラモーダル内のボタン修正
      fixCameraButtons();
    }, 1000);
  });
  
  /**
   * アカウントタイプボタンを修正
   */
  function fixAccountTypeButtons() {
    // すべてのボタンを取得
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(function(button) {
      if (!button.textContent) return;
      
      // 観光客ボタンの修正
      if (button.textContent.includes('観光客') && !button.textContent.includes('登録')) {
        button.textContent = '観光客として登録';
        console.log('観光客ボタンテキストを修正しました');
      }
      
      // ガイドボタンの修正
      if (button.textContent.includes('ガイド') && !button.textContent.includes('登録') && 
          !button.textContent.includes('探') && !button.textContent.includes('へ')) {
        button.textContent = 'ガイドとして登録';
        console.log('ガイドボタンテキストを修正しました');
      }
    });
  }
  
  /**
   * カメラボタンを修正
   */
  function fixCameraButtons() {
    // カメラモーダルを探す
    const modals = document.querySelectorAll('.modal.show');
    
    modals.forEach(function(modal) {
      if (!isCameraModal(modal)) return;
      
      // このモーダルがカメラモーダルの場合、確認ボタンを検証
      ensureUsePhotoButton(modal);
    });
  }
  
  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
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
   * 「この写真を使用」ボタンを確保
   */
  function ensureUsePhotoButton(modal) {
    // フッターを取得
    let footer = modal.querySelector('.modal-footer');
    if (!footer) {
      const content = modal.querySelector('.modal-content');
      if (!content) return;
      
      // フッターがなければ作成
      footer = document.createElement('div');
      footer.className = 'modal-footer';
      content.appendChild(footer);
    }
    
    // 既に「この写真を使用」ボタンがあるか確認
    let useButton = null;
    const buttons = modal.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent && buttons[i].textContent.includes('この写真を使用')) {
        useButton = buttons[i];
        break;
      }
    }
    
    // ボタンがなければ作成
    if (!useButton) {
      useButton = document.createElement('button');
      useButton.type = 'button';
      useButton.className = 'btn btn-success';
      useButton.textContent = 'この写真を使用';
      
      useButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        savePhotoAndCloseModal(modal);
        
        return false;
      };
      
      footer.appendChild(useButton);
      console.log('「この写真を使用」ボタンを追加しました');
    }
    
    // プレビュー画像があれば、ボタンを表示
    const img = modal.querySelector('img:not([src=""])');
    if (img) {
      useButton.style.display = 'inline-block';
    }
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
    
    // 直接スタイルを変更
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    
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
      console.log(`ページ内の画像数: ${allImages.length}`);
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
      console.log(`ページ内のファイル入力数: ${allInputs.length}`);
      
      if (allInputs.length > 0) {
        // 最も近いファイル入力を選択
        let fileInput = null;
        
        // 前面写真の場合は最初のファイル入力
        if (photoType === 'front') {
          fileInput = allInputs[0];
        } 
        // 裏面写真の場合は2番目のファイル入力（存在する場合）
        else if (photoType === 'back' && allInputs.length > 1) {
          fileInput = allInputs[1];
        }
        
        if (fileInput) {
          console.log('代替ファイル入力を使用');
          updateFileInput(fileInput, imageData);
        }
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
})();