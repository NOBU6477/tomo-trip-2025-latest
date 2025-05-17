/**
 * 最もシンプルなカメラ修正スクリプト - 基本バージョン
 * デバッグログを追加し、問題を特定しやすくしています
 */
(function() {
  console.log('基本カメラ修正スクリプトを初期化');
  
  // カメラボタンのクリックを検出
  document.addEventListener('click', function(event) {
    // クリックされた要素を取得
    const target = event.target;
    
    // クリックされた要素がカメラボタンかどうかを確認
    if (target && isCameraButton(target)) {
      console.log('カメラボタンがクリックされました！');
      
      // カメラモーダルが表示されるまで待機
      setTimeout(waitForCameraModal, 500);
    }
    
    // クリックされた要素が「この写真を使用」ボタンかどうかを確認
    if (target && isUsePhotoButton(target)) {
      console.log('「この写真を使用」ボタンがクリックされました！');
      
      // 現在開いているモーダルを取得
      const modal = findOpenedModal();
      if (modal) {
        // モーダル内のプレビュー画像を取得
        const previewImg = findPreviewImage(modal);
        
        if (previewImg) {
          console.log('プレビュー画像を見つけました！');
          
          // 画像データを取得
          const imageData = previewImg.src;
          
          // 表裏を判定
          const isBackSide = modal.querySelector('.modal-title') && 
                            modal.querySelector('.modal-title').textContent.includes('裏面');
          
          // 画像データを一時保存
          window._tempImageData = {
            src: imageData,
            isBack: isBackSide
          };
          
          // モーダルを閉じる
          closeCurrentModal();
          
          // メインページの画像を更新
          setTimeout(function() {
            updateMainImage();
          }, 500);
          
          // デフォルトの動作を中止
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      }
    }
  }, true);
  
  // カメラモーダルを待機
  function waitForCameraModal() {
    console.log('カメラモーダルを探しています...');
    
    // 開いているモーダルを探す
    const modal = findOpenedModal();
    
    if (modal) {
      console.log('開いているモーダルを見つけました！');
      
      // カメラモーダルかどうかを確認
      if (isCameraModal(modal)) {
        console.log('カメラモーダルを見つけました！');
        
        // 自動撮影を実行
        setTimeout(function() {
          capturePhoto(modal);
        }, 500);
        
        return;
      }
    }
    
    // モーダルが見つからなければ再試行
    setTimeout(waitForCameraModal, 300);
  }
  
  // カメラボタンかどうかを判定
  function isCameraButton(element) {
    // ボタン要素を取得
    const button = element.tagName === 'BUTTON' ? element : element.closest('button');
    
    if (!button) return false;
    
    // テキスト内容でチェック
    return button.textContent && button.textContent.includes('カメラで撮影');
  }
  
  // 「この写真を使用」ボタンかどうかを判定
  function isUsePhotoButton(element) {
    // ボタン要素を取得
    const button = element.tagName === 'BUTTON' ? element : element.closest('button');
    
    if (!button) return false;
    
    // テキスト内容でチェック
    return button.textContent && button.textContent.includes('この写真を使用');
  }
  
  // 開いているモーダルを探す
  function findOpenedModal() {
    const modals = document.querySelectorAll('.modal');
    
    for (let i = 0; i < modals.length; i++) {
      if (isModalVisible(modals[i])) {
        return modals[i];
      }
    }
    
    return null;
  }
  
  // モーダルが表示されているかを判定
  function isModalVisible(modal) {
    return modal.classList.contains('show') || 
           modal.style.display === 'block' || 
           getComputedStyle(modal).display === 'block';
  }
  
  // カメラモーダルかどうかを判定
  function isCameraModal(modal) {
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                title.textContent.includes('カメラ') || 
                title.textContent.includes('撮影'))) {
      return true;
    }
    
    // ビデオ要素の有無でチェック
    if (modal.querySelector('video')) {
      return true;
    }
    
    return false;
  }
  
  // 撮影ボタンを探す
  function findCaptureButton(modal) {
    const buttons = modal.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button.textContent && button.textContent.includes('撮影')) {
        return button;
      }
    }
    
    return null;
  }
  
  // プレビュー画像を探す
  function findPreviewImage(modal) {
    // ID属性でプレビュー画像を探す
    let img = modal.querySelector('#preview-image');
    if (img) return img;
    
    // クラス属性でプレビュー画像を探す
    img = modal.querySelector('.preview-image');
    if (img) return img;
    
    // モーダル内のすべての画像を探す
    const images = modal.querySelectorAll('img');
    if (images.length > 0) {
      return images[0]; // 最初の画像を返す
    }
    
    return null;
  }
  
  // 写真を撮影
  function capturePhoto(modal) {
    console.log('写真を撮影しようとしています...');
    
    // 撮影ボタンを探す
    const captureButton = findCaptureButton(modal);
    
    if (captureButton) {
      console.log('撮影ボタンを見つけました！クリックします！');
      
      // ボタンをクリック
      captureButton.click();
      
      // 撮影後、少し待ってから確認
      setTimeout(function() {
        checkPhotoTaken(modal);
      }, 1000);
    } else {
      console.log('撮影ボタンが見つかりませんでした');
    }
  }
  
  // 写真が撮影されたかを確認
  function checkPhotoTaken(modal) {
    console.log('写真が撮影されたか確認しています...');
    
    // プレビュー画像を探す
    const previewImg = findPreviewImage(modal);
    
    if (previewImg) {
      console.log('プレビュー画像を見つけました！');
      
      // 「この写真を使用」ボタンを探す
      const usePhotoButton = findUsePhotoButton(modal);
      
      if (usePhotoButton) {
        console.log('「この写真を使用」ボタンを見つけました！');
        
        // ボタンをクリック
        usePhotoButton.click();
      } else {
        console.log('「この写真を使用」ボタンが見つかりませんでした');
        
        // ボタンが見つからない場合は、手動でデータを処理
        const imageData = previewImg.src;
        
        // 表裏を判定
        const isBackSide = modal.querySelector('.modal-title') && 
                          modal.querySelector('.modal-title').textContent.includes('裏面');
        
        // 画像データを一時保存
        window._tempImageData = {
          src: imageData,
          isBack: isBackSide
        };
        
        // モーダルを閉じる
        closeCurrentModal();
        
        // メインページの画像を更新
        setTimeout(function() {
          updateMainImage();
        }, 500);
      }
    } else {
      console.log('プレビュー画像が見つかりませんでした。まだ写真が撮られていない可能性があります');
      
      // まだ撮影中かもしれないので、再確認
      setTimeout(function() {
        checkPhotoTaken(modal);
      }, 1000);
    }
  }
  
  // 「この写真を使用」ボタンを探す
  function findUsePhotoButton(modal) {
    const buttons = modal.querySelectorAll('button');
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button.textContent && button.textContent.includes('この写真を使用')) {
        return button;
      }
    }
    
    return null;
  }
  
  // 現在のモーダルを閉じる
  function closeCurrentModal() {
    console.log('モーダルを閉じようとしています...');
    
    // 開いているモーダルを探す
    const modal = findOpenedModal();
    
    if (!modal) {
      console.log('開いているモーダルが見つかりません');
      return;
    }
    
    console.log('開いているモーダルを見つけました！閉じます...');
    
    try {
      // カメラのストリームを停止
      const video = modal.querySelector('video');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // 閉じるボタンを探してクリック
      const closeButton = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
        return;
      }
      
      // Bootstrap APIを使用して閉じる
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        try {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
            return;
          }
        } catch (e) {
          console.log('Bootstrap API でのモーダル閉じるエラー:', e);
        }
      }
      
      // それでも閉じられない場合は、直接CSSで非表示にする
      modal.style.display = 'none';
      modal.classList.remove('show');
      
      // bodyのスタイルを戻す
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // バックドロップも削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
      console.log('モーダルを閉じました！');
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
  }
  
  // メインページの画像を更新
  function updateMainImage() {
    console.log('メインページの画像を更新しようとしています...');
    
    // 一時保存したデータを取得
    const tempData = window._tempImageData;
    
    if (!tempData || !tempData.src) {
      console.log('画像データが見つかりません');
      return;
    }
    
    console.log('一時保存された画像データを見つけました！');
    
    // 画像データとタイプを取得
    const imageData = tempData.src;
    const photoType = tempData.isBack ? 'back' : 'front';
    
    console.log(`画像タイプ: ${photoType}`);
    
    try {
      // 画像ID候補リスト
      const imageIdCandidates = [
        `${photoType}-photo-image`,
        `photo-${photoType}-image`,
        'id-photo-image'
      ];
      
      // コンテナID候補リスト
      const containerIdCandidates = [
        `${photoType}-photo-preview`,
        `photo-${photoType}-preview`,
        'id-photo-preview'
      ];
      
      // プレースホルダーID候補リスト
      const placeholderIdCandidates = [
        `${photoType}-photo-placeholder`,
        `photo-${photoType}-placeholder`,
        'id-photo-placeholder'
      ];
      
      // ファイル入力ID候補リスト
      const inputIdCandidates = [
        `${photoType}-photo-input`,
        `photo-${photoType}-input`,
        'id-photo-input'
      ];
      
      // 画像要素を探す
      let photoImg = null;
      
      // IDで検索
      for (const id of imageIdCandidates) {
        const img = document.getElementById(id);
        if (img) {
          photoImg = img;
          console.log(`ID '${id}' で画像要素を見つけました！`);
          break;
        }
      }
      
      // 画像が見つからない場合は、クラスや属性で検索
      if (!photoImg) {
        const allImages = document.querySelectorAll('img');
        for (const img of allImages) {
          if ((img.id && img.id.includes(photoType)) || 
              (img.className && img.className.includes(photoType))) {
            photoImg = img;
            console.log(`属性で画像要素を見つけました！ID: ${img.id}, Class: ${img.className}`);
            break;
          }
        }
      }
      
      // 画像要素が見つかった場合、更新
      if (photoImg) {
        photoImg.src = imageData;
        photoImg.style.display = 'block';
        
        const parent = photoImg.parentElement;
        if (parent) {
          parent.classList.remove('d-none');
          parent.style.display = 'block';
        }
        
        console.log('画像要素を更新しました！');
      } else {
        console.log('画像要素が見つかりませんでした');
      }
      
      // コンテナ要素を探して表示
      for (const id of containerIdCandidates) {
        const container = document.getElementById(id);
        if (container) {
          container.classList.remove('d-none');
          container.style.display = 'block';
          console.log(`コンテナ '${id}' を表示します`);
        }
      }
      
      // プレースホルダー要素を探して非表示
      for (const id of placeholderIdCandidates) {
        const placeholder = document.getElementById(id);
        if (placeholder) {
          placeholder.classList.add('d-none');
          placeholder.style.display = 'none';
          console.log(`プレースホルダー '${id}' を非表示にします`);
        }
      }
      
      // ファイル入力を更新
      for (const id of inputIdCandidates) {
        const input = document.getElementById(id);
        if (input && input.type === 'file') {
          try {
            updateFileInput(input, imageData);
            console.log(`ファイル入力 '${id}' を更新しました！`);
            break;
          } catch (e) {
            console.error(`ファイル入力 '${id}' の更新に失敗しました:`, e);
          }
        }
      }
      
      console.log('メインページの画像更新が完了しました！');
    } catch (error) {
      console.error('メインページの画像更新中にエラーが発生しました:', error);
    }
  }
  
  // ファイル入力要素を更新
  function updateFileInput(input, imageData) {
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
  }
  
  // データURLをBlobに変換
  function dataURLToBlob(dataURL) {
    try {
      // 入力が既にBlobなら、そのまま返す
      if (dataURL instanceof Blob) {
        return dataURL;
      }
      
      // 入力がBlobのURLなら、フェッチして返す
      if (dataURL.startsWith('blob:')) {
        return fetch(dataURL).then(r => r.blob());
      }
      
      // データURLをバイナリに変換
      const parts = dataURL.split(';base64,');
      if (parts.length !== 2) {
        throw new Error('Invalid dataURL format');
      }
      
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const array = new Uint8Array(raw.length);
      
      for (let i = 0; i < raw.length; i++) {
        array[i] = raw.charCodeAt(i);
      }
      
      return new Blob([array], { type: contentType });
    } catch (e) {
      console.error('Blob変換エラー:', e);
      
      // エラー時のフォールバック: 空のJPEGを作成
      return new Blob([''], { type: 'image/jpeg' });
    }
  }
})();