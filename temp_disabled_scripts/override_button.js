// 使用ボタンのクリックイベントを完全に上書きする最も単純な方法
window.addEventListener('load', function() {
  console.log('override_button.js: 初期化しました');
  
  // クリックイベントを監視
  document.addEventListener('click', function(event) {
    console.log('クリックイベントを検出');
    
    // クリックされた要素を取得
    const elem = event.target;
    
    // この写真を使用ボタンかチェック
    if (elem.textContent && elem.textContent.includes('この写真を使用') || 
        (elem.parentElement && 
         elem.parentElement.textContent && 
         elem.parentElement.textContent.includes('この写真を使用'))) {
      
      console.log('「この写真を使用」ボタンがクリックされました');
      
      // イベント伝播を停止
      event.preventDefault();
      event.stopPropagation();
      
      // 開いているモーダルを取得
      const modal = document.querySelector('.modal.show');
      if (!modal) {
        console.log('表示中のモーダルが見つかりません');
        return;
      }
      
      console.log('モーダルを見つけました');
      
      // 表裏写真の判定（タイトルから）
      const title = modal.querySelector('.modal-title');
      const isBack = title && title.textContent.includes('裏面');
      
      // プレビュー画像を取得
      const img = modal.querySelector('img');
      if (!img || !img.src) {
        console.log('プレビュー画像が見つかりません');
        forceCloseModal();
        return;
      }
      
      console.log('プレビュー画像を見つけました');
      
      // 画像データとタイプを保存
      window._savedImage = {
        data: img.src,
        type: isBack ? 'back' : 'front'
      };
      
      // モーダルを閉じる
      forceCloseModal();
      
      // メインページの画像を更新
      setTimeout(updateMainPage, 500);
      
      return false;
    }
  }, true);
  
  // モーダルを強制的に閉じる
  function forceCloseModal() {
    console.log('モーダルを強制的に閉じています...');
    
    // モーダルを取得
    const modal = document.querySelector('.modal.show');
    if (!modal) return;
    
    // ビデオストリームを停止
    try {
      const video = document.querySelector('video');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    } catch (e) {
      console.error('ビデオストリーム停止エラー:', e);
    }
    
    // 1. クローズボタンをクリック
    try {
      const closeBtn = document.querySelector('.modal.show .btn-close');
      if (closeBtn) {
        closeBtn.click();
      }
    } catch (e) {
      console.error('クローズボタンクリックエラー:', e);
    }
    
    // 2. Bootstrap APIを使用
    try {
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        }
      }
    } catch (e) {
      console.error('Bootstrap APIエラー:', e);
    }
    
    // 3. DOMを直接操作
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // 4. モーダル背景を削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    for (let i = 0; i < backdrops.length; i++) {
      const backdrop = backdrops[i];
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
    
    console.log('モーダルを閉じました');
  }
  
  // メインページの画像を更新
  function updateMainPage() {
    console.log('メインページの画像を更新しています...');
    
    // 保存したデータを取得
    const data = window._savedImage;
    if (!data || !data.data) {
      console.log('保存された画像データがありません');
      return;
    }
    
    const imageData = data.data;
    const photoType = data.type;
    
    // IDに基づいて画像要素を探す
    const imgId = photoType === 'back' ? 'back-photo-image' : 'id-photo-image';
    const img = document.getElementById(imgId);
    
    if (img) {
      console.log(`画像要素 ${imgId} を見つけました`);
      img.src = imageData;
      img.style.display = 'block';
      
      // 親要素も表示
      const parent = img.parentElement;
      if (parent) {
        parent.style.display = 'block';
        parent.classList.remove('d-none');
      }
    } else {
      console.log(`画像要素 ${imgId} が見つかりません`);
    }
    
    // プレビューコンテナを表示
    const previewId = photoType === 'back' ? 'back-photo-preview' : 'id-photo-preview';
    const preview = document.getElementById(previewId);
    if (preview) {
      preview.style.display = 'block';
      preview.classList.remove('d-none');
    }
    
    // プレースホルダーを非表示
    const placeholderId = photoType === 'back' ? 'back-photo-placeholder' : 'id-photo-placeholder';
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.style.display = 'none';
      placeholder.classList.add('d-none');
    }
    
    // ファイル入力を更新
    const inputId = photoType === 'back' ? 'back-photo-input' : 'id-photo-input';
    const input = document.getElementById(inputId);
    if (input && input.type === 'file') {
      try {
        updateFileInput(input, imageData);
      } catch (e) {
        console.error('ファイル入力更新エラー:', e);
      }
    }
    
    console.log('メインページの画像を更新しました');
  }
  
  // ファイル入力要素を更新
  function updateFileInput(input, dataURL) {
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
  }
  
  // データURLをBlobに変換
  function dataURLToBlob(dataURL) {
    try {
      // データURLをデコード
      const parts = dataURL.split(';base64,');
      if (parts.length !== 2) {
        console.error('無効なデータURL形式');
        return new Blob([''], { type: 'image/jpeg' });
      }
      
      const contentType = parts[0].split(':')[1];
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      return new Blob([arrayBuffer], { type: contentType });
    } catch (e) {
      console.error('Blob変換エラー:', e);
      return new Blob([''], { type: 'image/jpeg' });
    }
  }
});