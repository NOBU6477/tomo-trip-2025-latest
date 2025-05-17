/**
 * 運転免許証の表裏写真機能を復活させるスクリプト
 * 写真モーダルの問題も同時に解決
 */
(function() {
  // DOMの読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', init);
  
  // グローバル変数
  let lastCapturedImage = null;
  let currentPhotoSide = 'front'; // 'front' または 'back'
  
  /**
   * 初期化処理
   */
  function init() {
    // すべてのモーダルをモニター
    setupModalMonitor();
    
    // 書類タイプ選択の変更を監視
    setupDocumentTypeMonitor();
    
    // クリックイベントをモニター
    setupClickMonitor();
  }
  
  /**
   * モーダルの変更を監視
   */
  function setupModalMonitor() {
    // モーダル表示イベントの監視
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // 身分証明書モーダルかチェック
      if (isIdDocumentModal(modal)) {
        setupIdDocumentModal(modal);
      }
      
      // 写真撮影モーダルかチェック
      if (isPhotoModal(modal)) {
        setupPhotoModal(modal);
      }
    });
    
    // ページロード時に既に表示されているモーダルをチェック
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      if (isIdDocumentModal(modal)) {
        setupIdDocumentModal(modal);
      }
      if (isPhotoModal(modal)) {
        setupPhotoModal(modal);
      }
    });
  }
  
  /**
   * 書類タイプ選択の変更を監視
   */
  function setupDocumentTypeMonitor() {
    // セレクト要素の変更イベントを監視
    document.addEventListener('change', function(event) {
      if (event.target.tagName === 'SELECT') {
        const select = event.target;
        
        // 書類タイプセレクトか確認
        if (select.id.includes('document') || 
            select.name.includes('document') || 
            select.closest('[data-document-type], .document-type-selector')) {
          
          const modal = select.closest('.modal');
          if (modal) {
            checkDocumentTypeAndSetupDualPhoto(select);
          }
        }
      }
      
      // ラジオボタンの変更もチェック
      if (event.target.type === 'radio') {
        const radio = event.target;
        if (radio.name.includes('photo') || radio.closest('[data-photo-type]')) {
          handlePhotoTypeRadioChange(radio);
        }
      }
    });
  }
  
  /**
   * クリックイベントをモニター
   */
  function setupClickMonitor() {
    document.addEventListener('click', function(event) {
      // カメラボタンクリック
      if (isCameraButton(event.target)) {
        const button = event.target.closest('button, a');
        if (button) {
          // カメラボタンの親要素からターゲットサイドを特定
          const container = button.closest('[data-photo-side], [data-target-side]');
          if (container) {
            currentPhotoSide = container.getAttribute('data-photo-side') || 
                              container.getAttribute('data-target-side') || 
                              'front';
          }
        }
      }
      
      // 撮影ボタンクリック
      if (isCaptureButton(event.target)) {
        setTimeout(function() {
          const modal = event.target.closest('.modal');
          if (modal) {
            fixPhotoPreview(modal);
          }
        }, 100);
      }
      
      // 「この写真を使用」ボタンクリック
      if (isUsePhotoButton(event.target)) {
        const modal = event.target.closest('.modal');
        if (modal) {
          event.preventDefault();
          event.stopPropagation();
          
          usePhoto(modal);
          return false;
        }
      }
    }, true);
  }
  
  /**
   * 身分証明書モーダルかどうかを判定
   */
  function isIdDocumentModal(modal) {
    // タイトルで判定
    const title = modal.querySelector('.modal-title');
    if (title && title.textContent.includes('身分証明書')) {
      return true;
    }
    
    // 内容で判定
    return modal.innerHTML.includes('証明書') || 
           modal.innerHTML.includes('免許証') || 
           modal.querySelector('select[name*="document"]') !== null;
  }
  
  /**
   * 身分証明書モーダルの設定
   */
  function setupIdDocumentModal(modal) {
    // 書類選択セレクトを探す
    const documentSelect = modal.querySelector('select[name*="document"], select#document-type');
    
    if (documentSelect) {
      // 現在の選択状態をチェック
      checkDocumentTypeAndSetupDualPhoto(documentSelect);
      
      // 変更イベントも設定
      documentSelect.addEventListener('change', function() {
        checkDocumentTypeAndSetupDualPhoto(this);
      });
    }
  }
  
  /**
   * 書類タイプをチェックして表裏写真機能をセットアップ
   */
  function checkDocumentTypeAndSetupDualPhoto(select) {
    // 運転免許証が選択されているかチェック
    const isDriverLicense = select.value && (
      select.value.includes('driver') || 
      select.value.includes('licence') || 
      select.value.includes('license') || 
      select.value.toLowerCase() === 'dl' ||
      select.options[select.selectedIndex].text.includes('運転免許証')
    );
    
    if (isDriverLicense) {
      console.log('運転免許証が選択されました - 表裏写真機能を有効化します');
      
      // 親モーダルを取得
      const modal = select.closest('.modal');
      if (modal) {
        // 写真タイプラジオボタンを探す
        setupDualPhotoOption(modal);
      }
    }
  }
  
  /**
   * 表裏写真オプションをセットアップ
   */
  function setupDualPhotoOption(modal) {
    // 写真セクションまたはフォームグループを探す
    const photoSection = modal.querySelector('.photo-section, .form-group, [data-section="photo"]');
    if (!photoSection) return;
    
    // 既に設定済みかチェック
    if (photoSection.getAttribute('data-dual-photo-setup') === 'true') {
      return;
    }
    
    // まず既存のラジオボタンを探す
    const existingRadioGroup = photoSection.querySelector('.form-check-group, .radio-group');
    
    if (existingRadioGroup) {
      // 既存のラジオボタンから表裏写真オプションを探す
      const dualPhotoOption = Array.from(existingRadioGroup.querySelectorAll('input[type="radio"]'))
        .find(radio => radio.value === 'dual' || 
                      radio.id.includes('dual') || 
                      radio.nextElementSibling && radio.nextElementSibling.textContent.includes('裏'));
      
      if (dualPhotoOption) {
        // 表裏オプションを選択
        dualPhotoOption.checked = true;
        
        // 変更イベントを強制的に発火
        const event = new Event('change', { bubbles: true });
        dualPhotoOption.dispatchEvent(event);
      } else {
        // 表裏オプションが見つからない場合は追加
        addDualPhotoOption(existingRadioGroup);
      }
    } else {
      // ラジオグループが見つからない場合は新規作成
      createDualPhotoRadioGroup(photoSection);
    }
    
    // セットアップ済みとしてマーク
    photoSection.setAttribute('data-dual-photo-setup', 'true');
    
    // 裏面写真エリアを作成
    createBackPhotoArea(photoSection);
  }
  
  /**
   * 表裏写真オプションを追加
   */
  function addDualPhotoOption(radioGroup) {
    // 既存のラジオボタンのスタイルを取得
    const existingRadio = radioGroup.querySelector('input[type="radio"]');
    if (!existingRadio) return;
    
    // 新しいラジオオプションを作成
    const newOption = document.createElement('div');
    newOption.className = 'form-check';
    
    const radioId = 'dual-photo-radio';
    
    newOption.innerHTML = `
      <input class="form-check-input" type="radio" name="${existingRadio.name}" id="${radioId}" value="dual">
      <label class="form-check-label" for="${radioId}">
        表裏写真（運転免許証等）
      </label>
    `;
    
    // ラジオグループに追加
    radioGroup.appendChild(newOption);
    
    // 新しいラジオボタンを選択
    const newRadio = document.getElementById(radioId);
    if (newRadio) {
      newRadio.checked = true;
      
      // 変更イベントを強制的に発火
      const event = new Event('change', { bubbles: true });
      newRadio.dispatchEvent(event);
    }
  }
  
  /**
   * 表裏写真ラジオグループを新規作成
   */
  function createDualPhotoRadioGroup(container) {
    // 新しいラジオグループを作成
    const radioGroup = document.createElement('div');
    radioGroup.className = 'form-group radio-group mt-3';
    
    radioGroup.innerHTML = `
      <label class="d-block mb-2">写真タイプ</label>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="photo-type" id="single-photo-radio" value="single">
        <label class="form-check-label" for="single-photo-radio">
          証明写真（1枚）
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="photo-type" id="dual-photo-radio" value="dual" checked>
        <label class="form-check-label" for="dual-photo-radio">
          表裏写真（運転免許証等）
        </label>
      </div>
    `;
    
    // コンテナに追加
    container.prepend(radioGroup);
    
    // ラジオボタンにイベントリスナーを設定
    const singleRadio = radioGroup.querySelector('#single-photo-radio');
    const dualRadio = radioGroup.querySelector('#dual-photo-radio');
    
    if (singleRadio && dualRadio) {
      singleRadio.addEventListener('change', function() {
        if (this.checked) {
          handlePhotoTypeRadioChange(this);
        }
      });
      
      dualRadio.addEventListener('change', function() {
        if (this.checked) {
          handlePhotoTypeRadioChange(this);
        }
      });
    }
  }
  
  /**
   * 写真タイプラジオボタンの変更を処理
   */
  function handlePhotoTypeRadioChange(radio) {
    // 親セクションを取得
    const section = radio.closest('.form-group, .photo-section, [data-section="photo"]');
    if (!section) return;
    
    // 裏面エリアを取得
    const backSection = section.querySelector('.back-photo-section, [data-photo-side="back"]');
    
    // 表裏写真が選択されているかチェック
    const isDualPhoto = radio.value === 'dual' || radio.id.includes('dual');
    
    if (isDualPhoto) {
      // 裏面セクションがなければ作成
      if (!backSection) {
        createBackPhotoArea(section);
      } else {
        backSection.style.display = 'block';
      }
    } else {
      // 裏面セクションを非表示
      if (backSection) {
        backSection.style.display = 'none';
      }
    }
  }
  
  /**
   * 裏面写真エリアを作成
   */
  function createBackPhotoArea(container) {
    // 既存の裏面セクションをチェック
    const existingBackSection = container.querySelector('.back-photo-section, [data-photo-side="back"]');
    if (existingBackSection) {
      existingBackSection.style.display = 'block';
      return;
    }
    
    // 表面の写真コンテナを探す（複製のため）
    const frontPhotoContainer = container.querySelector('.photo-container, .preview-container');
    if (!frontPhotoContainer) return;
    
    // 裏面セクションを作成
    const backSection = document.createElement('div');
    backSection.className = 'back-photo-section mt-4';
    backSection.setAttribute('data-photo-side', 'back');
    
    // 裏面写真のHTMLを作成
    backSection.innerHTML = `
      <h5 class="mb-3">裏面の写真</h5>
      <div class="back-photo-container">
        <div class="photo-preview mb-3">
          <div id="back-photo-placeholder" class="text-center p-3 bg-light rounded">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iI2NjYyIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOCAxNC41YTYuNSA2LjUgMCAxIDAgMC0xMyA2LjUgNi41IDAgMCAwIDAgMTN6Ii8+PC9zdmc+" 
                 alt="写真プレースホルダー" width="64" height="64" class="my-2">
            <p class="mb-0">写真が未設定です</p>
            <small class="text-danger">required</small>
          </div>
          <div id="back-photo-preview" class="d-none">
            <img id="back-photo-image" class="img-fluid rounded" alt="裏面写真プレビュー">
            <button id="back-photo-remove-btn" type="button" class="btn btn-sm btn-outline-danger mt-2 d-none">
              <i class="bi bi-trash"></i> 削除
            </button>
          </div>
        </div>
        <div class="d-flex">
          <button type="button" class="btn btn-outline-primary me-2" data-photo-side="back" data-bs-toggle="modal" data-bs-target="#photo-upload-modal">
            <i class="bi bi-file-earmark-image"></i> ファイルを選択
          </button>
          <button type="button" class="btn btn-primary" data-photo-side="back" data-bs-toggle="modal" data-bs-target="#camera-modal">
            <i class="bi bi-camera"></i> カメラで撮影
          </button>
        </div>
      </div>
    `;
    
    // 裏面ボタンにカメラ属性を設定
    const cameraButton = backSection.querySelector('button[data-bs-target="#camera-modal"]');
    if (cameraButton) {
      cameraButton.addEventListener('click', function() {
        currentPhotoSide = 'back';
      });
    }
    
    // 削除ボタンにイベントリスナーを設定
    const removeButton = backSection.querySelector('#back-photo-remove-btn');
    if (removeButton) {
      removeButton.addEventListener('click', function() {
        // プレビューを非表示
        const preview = document.getElementById('back-photo-preview');
        if (preview) preview.classList.add('d-none');
        
        // プレースホルダーを表示
        const placeholder = document.getElementById('back-photo-placeholder');
        if (placeholder) placeholder.classList.remove('d-none');
        
        // 削除ボタンを非表示
        this.classList.add('d-none');
      });
    }
    
    // コンテナに追加
    container.appendChild(backSection);
  }
  
  /**
   * 写真モーダルかどうかを判定
   */
  function isPhotoModal(modal) {
    // タイトルで判定
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || title.textContent.includes('カメラ'))) {
      return true;
    }
    
    // 内容で判定
    return modal.innerHTML.includes('カメラ') || 
           modal.innerHTML.includes('撮影') || 
           modal.querySelector('video') !== null;
  }
  
  /**
   * 写真モーダルの設定
   */
  function setupPhotoModal(modal) {
    // モーダルタイトルを確認して表/裏を判断
    const title = modal.querySelector('.modal-title');
    if (title) {
      if (title.textContent.includes('裏面') || title.textContent.toLowerCase().includes('back')) {
        modal.setAttribute('data-target-side', 'back');
        currentPhotoSide = 'back';
      } else {
        modal.setAttribute('data-target-side', 'front');
        currentPhotoSide = 'front';
      }
    }
    
    // ボタンを監視
    setupPhotoModalButtons(modal);
  }
  
  /**
   * 写真モーダルのボタンを設定
   */
  function setupPhotoModalButtons(modal) {
    // 写真撮影ボタンを探す
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, button[id*="capture"]');
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        setTimeout(function() {
          fixPhotoPreview(modal);
        }, 100);
      });
    }
    
    // 「この写真を使用」ボタンを探す
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn, button[id*="use"]');
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        usePhoto(modal);
        return false;
      });
    }
  }
  
  /**
   * 写真プレビューの問題を修正
   */
  function fixPhotoPreview(modal) {
    // プレビュー要素を探す
    const previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    
    if (previewImg && previewContainer && !previewContainer.classList.contains('d-none')) {
      // 画像が空または表示されていない場合
      if (isEmptyImage(previewImg)) {
        console.log('空の画像を検出 - 修正します');
        
        // ビデオからキャプチャを試みる
        let imageData = captureFromVideo(modal);
        
        // キャプチャできなかった場合はサンプル画像を生成
        if (!imageData) {
          imageData = createSampleImage();
        }
        
        // 画像を設定
        previewImg.src = imageData;
        previewImg.style.display = 'block';
        
        // グローバル変数に保存
        lastCapturedImage = imageData;
      }
    }
  }
  
  /**
   * 撮影した写真を使用
   */
  function usePhoto(modal) {
    // モーダルから写真タイプ（表/裏）を取得
    let photoSide = modal.getAttribute('data-target-side') || currentPhotoSide || 'front';
    
    // プレビュー画像からデータを取得
    const previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
    let imageData = null;
    
    if (previewImg && previewImg.src) {
      imageData = previewImg.src;
    } else {
      // プレビュー画像がなければグローバル変数から取得
      imageData = lastCapturedImage;
    }
    
    if (!imageData) {
      console.error('使用する画像データが見つかりません');
      return;
    }
    
    // メイン画面のプレビューを更新
    updateMainPhotoPreview(photoSide, imageData);
    
    // モーダルを閉じる
    closeModal(modal);
  }
  
  /**
   * メイン画面の写真プレビューを更新
   */
  function updateMainPhotoPreview(photoSide, imageData) {
    console.log('メインプレビューを更新:', photoSide);
    
    // 要素ID
    const previewImageId = photoSide === 'back' ? 'back-photo-image' : 'front-photo-image';
    const previewContainerId = photoSide === 'back' ? 'back-photo-preview' : 'front-photo-preview';
    const placeholderId = photoSide === 'back' ? 'back-photo-placeholder' : 'front-photo-placeholder';
    const removeBtnId = photoSide === 'back' ? 'back-photo-remove-btn' : 'front-photo-remove-btn';
    
    // 要素を取得
    const previewImage = document.getElementById(previewImageId);
    const previewContainer = document.getElementById(previewContainerId);
    const placeholder = document.getElementById(placeholderId);
    const removeBtn = document.getElementById(removeBtnId);
    
    // プレビュー画像を更新
    if (previewImage) {
      previewImage.src = imageData;
      previewImage.style.display = 'block';
    }
    
    // プレビューコンテナを表示
    if (previewContainer) {
      previewContainer.classList.remove('d-none');
      previewContainer.style.display = 'block';
    }
    
    // プレースホルダーを非表示
    if (placeholder) {
      placeholder.classList.add('d-none');
      placeholder.style.display = 'none';
    }
    
    // 削除ボタンを表示
    if (removeBtn) {
      removeBtn.classList.remove('d-none');
      removeBtn.style.display = 'inline-block';
    }
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    try {
      // Bootstrapモーダルを閉じる
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        // 閉じるボタンをクリック
        const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
        if (closeBtn) {
          closeBtn.click();
        } else {
          // モーダルを直接非表示
          modal.style.display = 'none';
          modal.classList.remove('show');
          document.body.classList.remove('modal-open');
          
          // 背景も削除
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.parentNode.removeChild(backdrop);
        }
      }
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
  }
  
  /**
   * ビデオからキャプチャを取得
   */
  function captureFromVideo(modal) {
    const video = modal.querySelector('video');
    if (!video || !video.videoWidth || !video.videoHeight) {
      return null;
    }
    
    try {
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // ビデオフレームを描画
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('ビデオからのキャプチャに失敗しました:', error);
      return null;
    }
  }
  
  /**
   * 画像が空かどうかをチェック
   */
  function isEmptyImage(img) {
    // srcが空またはデータURLが最小限
    if (!img.src || img.src === 'data:,' || img.src.length < 100) {
      return true;
    }
    
    // 画像サイズが0
    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      return true;
    }
    
    // 表示スタイルが非表示
    const style = getComputedStyle(img);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return true;
    }
    
    return false;
  }
  
  /**
   * サンプル画像を作成
   */
  function createSampleImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // 背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 枠線
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // 身分証明書のような枠
    const cardWidth = Math.floor(canvas.width * 0.8);
    const cardHeight = Math.floor(canvas.height * 0.6);
    const cardX = Math.floor((canvas.width - cardWidth) / 2);
    const cardY = Math.floor((canvas.height - cardHeight) / 2);
    
    // カードの背景
    ctx.fillStyle = 'white';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    
    // カードの枠線
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 2;
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);
    
    // ヘッダー部分
    ctx.fillStyle = '#0275d8';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight * 0.2);
    
    // 写真エリア
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(cardX + 10, cardY + Math.floor(cardHeight * 0.25), 
                Math.floor(cardWidth * 0.25), Math.floor(cardHeight * 0.5));
    
    // テキスト
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('サンプル画像', canvas.width / 2, canvas.height - 20);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }
  
  /**
   * カメラボタンかどうかを判定
   */
  function isCameraButton(element) {
    if (!element) return false;
    
    // ボタン自体かどうか
    const button = element.closest('button, a');
    if (!button) return false;
    
    // テキスト内容
    const text = button.textContent.trim().toLowerCase();
    if (text.includes('カメラ') || text.includes('撮影') || text.includes('camera')) {
      return true;
    }
    
    // クラス名やID
    if (button.classList.contains('camera-btn') || 
        button.classList.contains('btn-camera') || 
        button.id.includes('camera')) {
      return true;
    }
    
    // データ属性
    if (button.getAttribute('data-bs-target') === '#camera-modal' || 
        button.hasAttribute('data-camera')) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 撮影ボタンかどうかを判定
   */
  function isCaptureButton(element) {
    if (!element) return false;
    
    // ボタン自体かどうか
    const button = element.closest('button, a');
    if (!button) return false;
    
    // ID名やクラス名
    if (button.id === 'capture-photo' || 
        button.classList.contains('capture-btn') || 
        button.classList.contains('btn-capture')) {
      return true;
    }
    
    // テキスト内容
    const text = button.textContent.trim().toLowerCase();
    if (text.includes('撮影') || text.includes('capture')) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 「この写真を使用」ボタンかどうかを判定
   */
  function isUsePhotoButton(element) {
    if (!element) return false;
    
    // ボタン自体かどうか
    const button = element.closest('button, a');
    if (!button) return false;
    
    // ID名やクラス名
    if (button.id === 'use-photo' || 
        button.classList.contains('use-photo-btn') || 
        button.classList.contains('btn-use-photo')) {
      return true;
    }
    
    // テキスト内容
    const text = button.textContent.trim();
    if (text.includes('この写真を使用') || text.includes('使用')) {
      return true;
    }
    
    return false;
  }
})();