/**
 * 「この写真を使用」ボタンだけに焦点を当てた修正スクリプト
 * モーダルの閉じる処理だけを完全に修正
 */
(function() {
  console.log('シングルボタン修正スクリプトを初期化');
  
  // ボタンクリックを監視
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // 「この写真を使用」ボタンかどうかをチェック
    if (isUsePhotoButton(target)) {
      console.log('「この写真を使用」ボタンがクリックされました！');
      
      // デフォルトの挙動を停止
      event.preventDefault();
      event.stopPropagation();
      
      // プレビュー画像を取得
      const modal = findParentModal(target);
      if (!modal) {
        console.log('親モーダルが見つかりません');
        return;
      }
      
      // プレビュー画像を取得
      const previewImg = findPreviewImage(modal);
      if (!previewImg) {
        console.log('プレビュー画像が見つかりません');
        closeModalForcefully(modal);
        return;
      }
      
      console.log('プレビュー画像を見つけました！');
      
      // 画像データを取得
      const imageData = previewImg.src;
      if (!imageData) {
        console.log('画像データが取得できません');
        closeModalForcefully(modal);
        return;
      }
      
      // 表/裏を判断
      const isBackSide = isBackPhoto(modal);
      const photoType = isBackSide ? 'back' : 'front';
      
      console.log(`写真タイプ: ${photoType}`);
      
      // 画像データを一時保存
      window._photoSaveData = {
        src: imageData,
        type: photoType
      };
      
      // ビデオストリームを停止
      stopVideoStream(modal);
      
      // モーダルを強制的に閉じる
      closeModalForcefully(modal);
      
      // メインページの画像を更新
      setTimeout(updateMainPageImage, 300);
      
      return false;
    }
  }, true);
  
  /**
   * 「この写真を使用」ボタンかどうか判定
   */
  function isUsePhotoButton(element) {
    // ボタン要素自体かその親を取得
    const button = element.tagName === 'BUTTON' ? element : element.closest('button');
    if (!button) return false;
    
    // テキスト内容で判定
    return button.textContent && button.textContent.includes('この写真を使用');
  }
  
  /**
   * 親モーダルを探す
   */
  function findParentModal(element) {
    return element.closest('.modal');
  }
  
  /**
   * プレビュー画像を探す
   */
  function findPreviewImage(modal) {
    // ID属性で検索
    let img = modal.querySelector('#preview-image');
    if (img) return img;
    
    // クラス属性で検索
    img = modal.querySelector('.preview-image');
    if (img) return img;
    
    // モーダル内の全画像要素を検索
    const images = modal.querySelectorAll('img');
    if (images.length > 0) {
      return images[0];
    }
    
    return null;
  }
  
  /**
   * 裏面写真かどうかを判定
   */
  function isBackPhoto(modal) {
    const title = modal.querySelector('.modal-title');
    return title && title.textContent && title.textContent.includes('裏面');
  }
  
  /**
   * ビデオストリームを停止
   */
  function stopVideoStream(modal) {
    const video = modal.querySelector('video');
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  }
  
  /**
   * モーダルを強制的に閉じる
   */
  function closeModalForcefully(modal) {
    console.log('モーダルを強制的に閉じます');
    
    try {
      // 方法1: 閉じるボタンをクリック
      const closeButton = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
      if (closeButton) {
        console.log('閉じるボタンを見つけました！クリックします');
        closeButton.click();
      }
      
      // 方法2: Bootstrap APIを使用
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        try {
          console.log('Bootstrap APIを使用してモーダルを閉じます');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        } catch (e) {
          console.log('Bootstrap API エラー:', e);
        }
      }
      
      // 方法3: 直接DOMを操作
      console.log('直接DOMを操作してモーダルを閉じます');
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
      
      // body要素のスタイルをリセット
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // バックドロップを削除
      removeBackdrop();
      
      console.log('モーダルを閉じました！');
    } catch (error) {
      console.error('モーダルを閉じる処理でエラー:', error);
      
      // 最終手段: タイマーで遅延してから再度クローズ処理
      setTimeout(function() {
        try {
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          removeBackdrop();
        } catch (e) {
          console.error('最終手段でもエラー:', e);
        }
      }, 100);
    }
  }
  
  /**
   * モーダル背景を削除
   */
  function removeBackdrop() {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(function(backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    });
  }
  
  /**
   * メインページの画像を更新
   */
  function updateMainPageImage() {
    console.log('メインページの画像を更新');
    
    // 保存したデータを取得
    const savedData = window._photoSaveData;
    if (!savedData || !savedData.src) {
      console.log('保存されたデータがありません');
      return;
    }
    
    const imageData = savedData.src;
    const photoType = savedData.type;
    
    console.log(`画像タイプ: ${photoType}`);
    
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
      let photoImg = null;
      
      // IDで探す
      for (const id of imageIdCandidates) {
        const img = document.getElementById(id);
        if (img) {
          photoImg = img;
          console.log(`ID '${id}' で画像要素を見つけました`);
          break;
        }
      }
      
      // 属性で探す
      if (!photoImg) {
        const allImages = document.querySelectorAll('img');
        for (const img of allImages) {
          if ((img.id && img.id.includes(photoType)) || 
              (img.className && img.className.includes(photoType))) {
            photoImg = img;
            console.log(`属性で画像要素を見つけました: ${img.id || img.className}`);
            break;
          }
        }
      }
      
      // 画像要素を更新
      if (photoImg) {
        photoImg.src = imageData;
        photoImg.style.display = 'block';
        
        // 親要素も表示
        const parent = photoImg.parentElement;
        if (parent) {
          parent.classList.remove('d-none');
          parent.style.display = 'block';
        }
        
        console.log('画像要素を更新しました');
      } else {
        console.log('画像要素が見つかりませんでした');
      }
      
      // コンテナを表示
      for (const id of containerIdCandidates) {
        const container = document.getElementById(id);
        if (container) {
          container.classList.remove('d-none');
          container.style.display = 'block';
          console.log(`コンテナ '${id}' を表示`);
        }
      }
      
      // プレースホルダーを非表示
      for (const id of placeholderIdCandidates) {
        const placeholder = document.getElementById(id);
        if (placeholder) {
          placeholder.classList.add('d-none');
          placeholder.style.display = 'none';
          console.log(`プレースホルダー '${id}' を非表示`);
        }
      }
      
      // ファイル入力を更新
      for (const id of inputIdCandidates) {
        const input = document.getElementById(id);
        if (input && input.type === 'file') {
          updateFileInput(input, imageData);
          console.log(`ファイル入力 '${id}' を更新`);
          break;
        }
      }
      
      console.log('メインページの画像更新が完了しました');
    } catch (error) {
      console.error('メインページの画像更新でエラー:', error);
    }
  }
  
  /**
   * ファイル入力要素を更新
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
    try {
      // データURLからパーツを分割
      const parts = dataURL.split(';base64,');
      if (parts.length !== 2) {
        throw new Error('無効なデータURL形式');
      }
      
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const array = new Uint8Array(raw.length);
      
      for (let i = 0; i < raw.length; i++) {
        array[i] = raw.charCodeAt(i);
      }
      
      return new Blob([array], { type: contentType });
    } catch (error) {
      console.error('Blob変換エラー:', error);
      
      // エラー時のフォールバック: 空のJPEGを返す
      return new Blob([''], { type: 'image/jpeg' });
    }
  }
})();