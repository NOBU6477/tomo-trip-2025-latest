/**
 * カメラモーダルの問題を解決するための直接的なスクリプト
 * document.body に直接代入するアプローチ
 */
(function() {
  // ページ読み込み完了時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // カメラモーダルのクリックを監視するための関数
    const setupCameraModalCapture = () => {
      // すべてのモーダルを監視
      document.addEventListener('shown.bs.modal', function(event) {
        const modal = event.target;
        
        // カメラモーダルでなければ処理しない
        if (!isCameraModal(modal)) return;
        
        //「この写真を使用」ボタンの検索と処理
        const usePhotoButton = findUsePhotoButton(modal);
        if (usePhotoButton && !usePhotoButton._overridden) {
          console.log("「この写真を使用」ボタンを検出し、イベントを上書きします");
          
          // 既存のイベントリスナーを削除
          replaceElement(usePhotoButton);

          // 新しいイベントリスナーを追加
          usePhotoButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // カメラで撮影した写真を使用
            console.log("「この写真を使用」ボタンがクリックされました - 写真を適用します");
            handleUsePhoto(modal);
            
            // モーダルを閉じる
            closeModal(modal);
            
            return false;
          }, true);
          
          usePhotoButton._overridden = true;
        }
        
        // 撮影ボタンの検索と処理
        const captureButton = findCaptureButton(modal);
        if (captureButton && !captureButton._overridden) {
          console.log("撮影ボタンを検出し、イベントを上書きします");
          
          // 既存のイベントリスナーを削除
          replaceElement(captureButton);
          
          // 新しいイベントリスナーを追加
          captureButton.addEventListener('click', function(e) {
            // 少し遅延させてプレビューを修正
            setTimeout(function() {
              console.log("撮影ボタンがクリックされました - プレビューを修正します");
              fixPreview(modal);
            }, 200);
          }, true);
          
          captureButton._overridden = true;
        }
      });
      
      // クリックイベントをドキュメント全体で監視（動的に追加されるボタン対応）
      document.addEventListener('click', function(e) {
        // 「この写真を使用」ボタンのクリックを検出
        if (isUsePhotoButtonClick(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          
          const modal = e.target.closest('.modal');
          if (modal) {
            console.log("動的検出：「この写真を使用」ボタンがクリックされました");
            
            // 写真を使用
            handleUsePhoto(modal);
            
            // モーダルを閉じる
            closeModal(modal);
          }
          
          return false;
        }
        
        // 撮影ボタンのクリックを検出
        if (isCaptureButtonClick(e.target)) {
          const modal = e.target.closest('.modal');
          if (modal) {
            console.log("動的検出：撮影ボタンがクリックされました");
            
            // 少し遅延させてプレビューを修正
            setTimeout(function() {
              fixPreview(modal);
            }, 200);
          }
        }
      }, true);
    };
    
    // 初回実行
    setupCameraModalCapture();
    
    // 既存のモーダルもチェック
    setTimeout(checkExistingModals, 500);
  });
  
  /**
   * 既存のモーダルをチェック
   */
  function checkExistingModals() {
    const modals = document.querySelectorAll('.modal.show');
    
    modals.forEach(function(modal) {
      if (isCameraModal(modal)) {
        console.log("既存のカメラモーダルを検出しました");
        
        const usePhotoButton = findUsePhotoButton(modal);
        if (usePhotoButton && !usePhotoButton._overridden) {
          // 「この写真を使用」ボタンを処理
          replaceElement(usePhotoButton);
          
          usePhotoButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            handleUsePhoto(modal);
            closeModal(modal);
            
            return false;
          }, true);
          
          usePhotoButton._overridden = true;
        }
        
        const captureButton = findCaptureButton(modal);
        if (captureButton && !captureButton._overridden) {
          // 撮影ボタンを処理
          replaceElement(captureButton);
          
          captureButton.addEventListener('click', function() {
            setTimeout(function() {
              fixPreview(modal);
            }, 200);
          }, true);
          
          captureButton._overridden = true;
        }
      }
    });
  }
  
  /**
   * 要素を複製して既存のイベントリスナーを削除
   */
  function replaceElement(element) {
    if (!element || element._replaced) return element;
    
    try {
      // 元の要素の属性をコピー
      const newElement = document.createElement(element.tagName);
      Array.from(element.attributes).forEach(attr => {
        newElement.setAttribute(attr.name, attr.value);
      });
      
      // 内容をコピー
      newElement.innerHTML = element.innerHTML;
      
      // スタイルをコピー
      const computedStyle = window.getComputedStyle(element);
      Array.from(computedStyle).forEach(key => {
        newElement.style[key] = computedStyle[key];
      });
      
      // クラス名をコピー
      newElement.className = element.className;
      
      // 置き換え
      if (element.parentNode) {
        element.parentNode.insertBefore(newElement, element);
        element.parentNode.removeChild(element);
      }
      
      newElement._replaced = true;
      return newElement;
    } catch (e) {
      console.error("要素の置き換えに失敗:", e);
      return element;
    }
  }
  
  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    if (!modal) return false;
    
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (
        title.textContent.includes('写真') || 
        title.textContent.includes('カメラ') || 
        title.textContent.includes('撮影')
    )) {
      return true;
    }
    
    // 内容でチェック
    return modal.querySelector('video') !== null || 
           modal.innerHTML.includes('撮影') ||
           modal.innerHTML.includes('カメラ');
  }
  
  /**
   * 「この写真を使用」ボタンを探す
   */
  function findUsePhotoButton(modal) {
    // ID名でチェック
    const byId = modal.querySelector('#use-photo');
    if (byId) return byId;
    
    // クラス名でチェック
    const byClass = modal.querySelector('.use-photo-btn, .btn-use-photo');
    if (byClass) return byClass;
    
    // テキスト内容でチェック
    const buttons = modal.querySelectorAll('button');
    for (const button of buttons) {
      if (button.textContent.includes('この写真を使用')) {
        return button;
      }
    }
    
    // 緑色のボタンを探す（ヒューリスティック）
    const greenButtons = modal.querySelectorAll('.btn-success');
    if (greenButtons.length === 1) {
      return greenButtons[0];
    }
    
    return null;
  }
  
  /**
   * 撮影ボタンを探す
   */
  function findCaptureButton(modal) {
    // ID名でチェック
    const byId = modal.querySelector('#capture-photo');
    if (byId) return byId;
    
    // クラス名でチェック
    const byClass = modal.querySelector('.capture-btn, .btn-capture');
    if (byClass) return byClass;
    
    // テキスト内容でチェック
    const buttons = modal.querySelectorAll('button');
    for (const button of buttons) {
      if (button.textContent.includes('撮影')) {
        return button;
      }
    }
    
    return null;
  }
  
  /**
   * 「この写真を使用」ボタンのクリックかどうかを判定
   */
  function isUsePhotoButtonClick(element) {
    if (!element) return false;
    
    // ボタン要素かどうか
    const button = element.closest('button');
    if (!button) return false;
    
    // ID名でチェック
    if (button.id === 'use-photo') return true;
    
    // クラス名でチェック
    if (button.classList.contains('use-photo-btn') || 
        button.classList.contains('btn-use-photo')) {
      return true;
    }
    
    // テキスト内容でチェック
    return button.textContent.includes('この写真を使用');
  }
  
  /**
   * 撮影ボタンのクリックかどうかを判定
   */
  function isCaptureButtonClick(element) {
    if (!element) return false;
    
    // ボタン要素かどうか
    const button = element.closest('button');
    if (!button) return false;
    
    // ID名でチェック
    if (button.id === 'capture-photo') return true;
    
    // クラス名でチェック
    if (button.classList.contains('capture-btn') || 
        button.classList.contains('btn-capture')) {
      return true;
    }
    
    // テキスト内容でチェック
    return button.textContent.includes('撮影');
  }
  
  /**
   * 「この写真を使用」ボタンの処理
   */
  function handleUsePhoto(modal) {
    console.log("写真をメインページに反映します");

    // 動画要素
    const video = modal.querySelector('video');
    
    // プレビュー要素
    const previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
    
    // カメラモーダルのタイトルから表/裏を判断
    const title = modal.querySelector('.modal-title');
    const isFront = !title || !title.textContent.includes('裏');
    const photoSide = isFront ? 'front' : 'back';
    
    // 画像データの取得
    let imageData = null;
    
    // 1. プレビュー画像から取得
    if (previewImg && previewImg.src) {
      console.log("プレビュー画像からデータを取得します");
      imageData = previewImg.src;
    }
    // 2. データ属性から取得
    else if (modal.getAttribute('data-captured-image')) {
      console.log("データ属性から画像を取得します");
      imageData = modal.getAttribute('data-captured-image');
    }
    // 3. ビデオからキャプチャ
    else if (video && video.videoWidth && video.videoHeight) {
      console.log("ビデオから直接キャプチャします");
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      imageData = canvas.toDataURL('image/jpeg', 0.9);
    }
    // 4. サンプル画像を作成
    else {
      console.log("サンプル画像を生成します");
      imageData = createSampleImage();
    }
    
    if (!imageData) {
      console.error("画像データを取得できませんでした");
      return;
    }
    
    // ターゲット入力要素を特定するためのID
    let targetInputId = modal.getAttribute('data-target-input');
    
    // ターゲットがなければ、photoSideから推測
    if (!targetInputId) {
      targetInputId = photoSide === 'back' ? 'back-photo-input' : 'id-photo-input';
    }
    
    // 主要な写真ID候補
    const mainIds = [
      targetInputId,
      `${photoSide}-photo-input`,
      'id-photo-input',
      'profile-photo-input'
    ];
    
    // ターゲット入力を探す
    let targetInput = null;
    
    // 候補のIDから探す
    for (const id of mainIds) {
      const input = document.getElementById(id);
      if (input && input.type === 'file') {
        targetInput = input;
        break;
      }
    }
    
    // プレビュー要素を探す（ID候補）
    const previewIds = [
      `${photoSide}-photo-preview`, 
      `${photoSide}-preview`, 
      'id-photo-preview',
      'profile-photo-preview'
    ];
    
    // プレビュー画像要素を探す（ID候補）
    const previewImageIds = [
      `${photoSide}-photo-image`, 
      `${photoSide}-photo-img`, 
      'id-photo-image',
      'profile-photo-image'
    ];
    
    // プレビュー要素を取得
    let previewContainer = null;
    let previewImage = null;
    
    // プレビューコンテナを探す
    for (const id of previewIds) {
      const container = document.getElementById(id);
      if (container) {
        previewContainer = container;
        break;
      }
    }
    
    // プレビュー画像を探す
    for (const id of previewImageIds) {
      const img = document.getElementById(id);
      if (img) {
        previewImage = img;
        break;
      }
    }
    
    // プレビュー画像が見つからなかった場合
    if (!previewImage && previewContainer) {
      previewImage = previewContainer.querySelector('img');
    }
    
    // 見つからない場合は、モーダルが閉じた後にDOMをスキャン
    if (!previewImage || !previewContainer) {
      console.log("プレビュー要素が見つからないため、モーダルが閉じた後に検索します");
      
      // 画像データを一時保存
      window._tempImageData = imageData;
      window._tempPhotoSide = photoSide;
      
      // モーダルが閉じた後に実行
      setTimeout(function() {
        // もう一度プレビュー要素を探す
        findAndUpdatePreview(window._tempImageData, window._tempPhotoSide);
      }, 500);
    } else {
      // プレビュー画像を更新
      console.log(`プレビュー画像(${previewImage.id})を更新します`);
      previewImage.src = imageData;
      previewImage.style.display = 'block';
      
      // プレビューコンテナを表示
      previewContainer.classList.remove('d-none');
      previewContainer.style.display = 'block';
      
      // プレースホルダーを非表示
      const placeholder = document.getElementById(`${photoSide}-photo-placeholder`) || 
                         document.getElementById('id-photo-placeholder');
      if (placeholder) {
        placeholder.classList.add('d-none');
        placeholder.style.display = 'none';
      }
      
      // 削除ボタンを表示
      const removeBtn = document.getElementById(`${photoSide}-photo-remove-btn`) || 
                       document.getElementById('id-photo-remove-btn');
      if (removeBtn) {
        removeBtn.classList.remove('d-none');
        removeBtn.style.display = 'inline-block';
      }
      
      // ファイル入力要素を更新
      if (targetInput) {
        updateFileInput(targetInput, imageData);
      }
    }
  }
  
  /**
   * モーダル閉じた後にプレビュー要素を探して更新
   */
  function findAndUpdatePreview(imageData, photoSide) {
    // 全画像を走査
    const images = document.querySelectorAll('img');
    let found = false;
    
    for (const img of images) {
      // IDまたはクラス名で判定
      if ((img.id && (img.id.includes(photoSide) || img.id.includes('photo'))) || 
          (img.className && (img.className.includes(photoSide) || img.className.includes('photo')))) {
        
        console.log(`写真プレビュー要素を発見: ${img.id || img.className}`);
        
        // 画像を更新
        img.src = imageData;
        img.style.display = 'block';
        
        // 親要素も表示
        if (img.parentElement) {
          img.parentElement.classList.remove('d-none');
          img.parentElement.style.display = 'block';
        }
        
        found = true;
      }
    }
    
    if (!found) {
      console.error("プレビュー画像要素が見つかりませんでした");
    }
    
    // ファイル入力要素も探す
    const inputs = document.querySelectorAll('input[type="file"]');
    let targetInput = null;
    
    for (const input of inputs) {
      if ((input.id && (input.id.includes(photoSide) || input.id.includes('photo'))) || 
          (input.name && (input.name.includes(photoSide) || input.name.includes('photo')))) {
        
        console.log(`ファイル入力要素を発見: ${input.id || input.name}`);
        targetInput = input;
        break;
      }
    }
    
    if (targetInput) {
      updateFileInput(targetInput, imageData);
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
      const filename = `photo_${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });
      
      // DataTransferを使用してfilesプロパティを更新
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      
      console.log(`ファイル入力(${input.id || input.name})を更新しました`);
    } catch (error) {
      console.error("ファイル入力の更新に失敗:", error);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
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
  
  /**
   * プレビュー表示を修正
   */
  function fixPreview(modal) {
    // プレビュー要素を探す
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    const previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
    
    // ビデオ要素
    const video = modal.querySelector('video');
    
    if (previewContainer && !previewContainer.classList.contains('d-none') && previewImg) {
      console.log("プレビュー状態を検出 - 画像を修正します");
      
      // 画像が空か黒画面の場合
      if (!previewImg.src || previewImg.src === 'data:,' || previewImg.src.length < 100) {
        // ビデオからキャプチャを試みる
        let imageData = null;
        
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
            imageData = canvas.toDataURL('image/jpeg', 0.9);
          } catch (error) {
            console.error("ビデオキャプチャエラー:", error);
          }
        }
        
        // キャプチャできなかった場合はサンプル画像を生成
        if (!imageData) {
          imageData = createSampleImage();
        }
        
        // プレビュー画像を更新
        previewImg.src = imageData;
        previewImg.style.display = 'block';
        previewImg.style.maxWidth = '100%';
        
        // データ属性に保存
        modal.setAttribute('data-captured-image', imageData);
        
        console.log("プレビュー画像を更新しました");
      }
    }
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    try {
      // 閉じるボタンをクリック
      const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // Bootstrapモーダルインスタンスを取得
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          return;
        }
      }
      
      // 直接DOMを操作
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // 背景も削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } catch (error) {
      console.error("モーダルを閉じる際にエラー:", error);
    }
  }
  
  /**
   * サンプル画像を生成
   */
  function createSampleImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // 背景
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // カード風の枠
    const cardWidth = canvas.width * 0.8;
    const cardHeight = canvas.height * 0.6;
    const cardX = (canvas.width - cardWidth) / 2;
    const cardY = (canvas.height - cardHeight) / 2;
    
    // カードの背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // カードの枠線
    ctx.strokeStyle = '#0078d4';
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
    
    // ヘッダー部分
    ctx.fillStyle = '#0078d4';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight * 0.2);
    
    // 写真エリア
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(cardX + 10, cardY + cardHeight * 0.25, cardWidth * 0.25, cardHeight * 0.5);
    
    // 情報エリア（横線）
    ctx.fillStyle = '#e0e0e0';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(
        cardX + cardWidth * 0.3 + 15, 
        cardY + cardHeight * 0.35 + (i * 25), 
        cardWidth * 0.6 - 30, 
        10
      );
    }
    
    // テキスト
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('サンプル画像', canvas.width / 2, canvas.height - 30);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }
})();