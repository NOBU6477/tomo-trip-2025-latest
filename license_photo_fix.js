/**
 * 運転免許証の表裏写真機能を強制的に修正するスクリプト
 * - 特定のコンテンツにのみ焦点を当てた高度に特化した修正
 * - 既存のHTMLに最小限の変更で表裏写真を実現
 */
(function() {
  // DOM読み込み完了時に初期化
  document.addEventListener('DOMContentLoaded', initLicensePhotoFix);
  
  // 免許証関連のグローバル状態
  let isLicenseFrontPhotoSet = false;
  let isLicenseBackPhotoSet = false;
  const photoData = {
    front: null,
    back: null
  };
  
  /**
   * 初期化処理
   */
  function initLicensePhotoFix() {
    console.log('[免許証写真修正] 初期化');
    
    // 表裏写真オプションのハードコード設定
    createPhotoTypeRadioSection();
    
    // セレクトボックスの変更を監視
    setupDocumentTypeObserver();
    
    // モーダルの変更を監視
    setupModalObserver();
    
    // ページ読み込み時に既に表示されているモーダルをチェック
    checkExistingModals();
  }
  
  /**
   * すでに表示されているモーダルをチェック
   */
  function checkExistingModals() {
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      if (isIdDocumentModal(modal)) {
        setupIdDocumentModal(modal);
      }
    });
  }
  
  /**
   * 写真タイプラジオボタンセクションを作成・追加
   */
  function createPhotoTypeRadioSection() {
    // 既存のphoto titleセクションを探す
    const photoTitles = document.querySelectorAll('h3, h4, h5, .form-label, label, .section-title')
      .forEach(element => {
        if (element.textContent.includes('photo') || 
            element.textContent.includes('証明写真')) {
          const photoSection = element.closest('.form-group, section, div');
          if (photoSection && !photoSection.querySelector('.photo-type-radio-group')) {
            injectRadioButtonsToSection(photoSection);
          }
        }
      });
  }
  
  /**
   * 指定したセクションにラジオボタンを注入
   */
  function injectRadioButtonsToSection(section) {
    // 写真タイプ選択用のラジオボタンセクション
    const radioHTML = `
      <div class="form-group photo-type-radio-group mt-3 mb-3">
        <label class="d-block mb-2">写真タイプ:</label>
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
      </div>
    `;
    
    // セクションの先頭に追加
    const firstChild = section.firstChild;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = radioHTML;
    
    // 最初の子要素の前に挿入（最初に表示されるようにする）
    if (firstChild) {
      section.insertBefore(tempDiv.firstElementChild, firstChild);
    } else {
      section.appendChild(tempDiv.firstElementChild);
    }
    
    // 裏面用の写真セクションも追加
    addBackPhotoSection(section);
    
    // ラジオボタンの変更イベントを設定
    const singleRadio = section.querySelector('#single-photo-radio');
    const dualRadio = section.querySelector('#dual-photo-radio');
    
    if (singleRadio && dualRadio) {
      singleRadio.addEventListener('change', function() {
        if (this.checked) {
          toggleBackPhotoSection(false);
        }
      });
      
      dualRadio.addEventListener('change', function() {
        if (this.checked) {
          toggleBackPhotoSection(true);
        }
      });
      
      // 初期状態を設定（dual = true をデフォルトに）
      dualRadio.checked = true;
      toggleBackPhotoSection(true);
    }
  }
  
  /**
   * 裏面写真セクションを追加
   */
  function addBackPhotoSection(container) {
    // 既存の裏面セクションをチェック
    if (container.querySelector('.back-photo-section')) {
      return;
    }
    
    // 表面写真セクション（複製のため）
    const frontSection = container.querySelector('.photo-upload, .photo-section');
    
    // 裏面写真セクションのHTML
    const backSectionHTML = `
      <div class="back-photo-section mt-4">
        <h5 class="mb-3">免許証裏面の写真</h5>
        <div class="photo-upload">
          <div id="back-photo-preview" class="photo-preview mb-3 d-none">
            <img id="back-photo-image" class="img-fluid rounded" alt="裏面写真プレビュー">
            <button id="back-photo-remove-btn" type="button" class="btn btn-sm btn-outline-danger mt-2 d-none">
              <i class="bi bi-trash"></i> 削除
            </button>
          </div>
          <div id="back-photo-placeholder" class="text-center p-3 bg-light rounded mb-3">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iI2NjYyIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOCAxNC41YTYuNSA2LjUgMCAxIDAgMC0xMyA2LjUgNi41IDAgMCAwIDAgMTN6Ii8+PC9zdmc+" 
                 alt="裏面写真プレースホルダー" width="64" height="64" class="my-2">
            <p class="mb-0">写真が未設定です</p>
            <small class="text-danger">required</small>
          </div>
          <div class="d-flex">
            <button type="button" class="btn btn-primary me-2 back-camera-btn" data-photo-side="back">
              <i class="bi bi-camera"></i> カメラで撮影
            </button>
            <button type="button" class="btn btn-outline-primary back-file-btn" data-photo-side="back">
              <i class="bi bi-file-earmark-image"></i> ファイルを選択
            </button>
          </div>
          <input type="file" id="back-photo-input" name="back_photo" class="d-none" accept="image/*">
        </div>
      </div>
    `;
    
    // HTMLを挿入
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = backSectionHTML;
    container.appendChild(tempDiv.firstElementChild);
    
    // ボタンのイベントを設定
    setupBackPhotoButtons(container);
  }
  
  /**
   * 裏面写真ボタンの設定
   */
  function setupBackPhotoButtons(container) {
    // カメラボタン
    const cameraBtn = container.querySelector('.back-camera-btn');
    if (cameraBtn) {
      cameraBtn.addEventListener('click', function() {
        showCameraModal('back');
      });
    }
    
    // ファイル選択ボタン
    const fileBtn = container.querySelector('.back-file-btn');
    const fileInput = container.querySelector('#back-photo-input');
    
    if (fileBtn && fileInput) {
      fileBtn.addEventListener('click', function() {
        fileInput.click();
      });
      
      fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
          handlePhotoFile(this.files[0], 'back');
        }
      });
    }
    
    // 削除ボタン
    const removeBtn = container.querySelector('#back-photo-remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        clearPhotoPreview('back');
      });
    }
  }
  
  /**
   * 裏面写真セクションの表示/非表示を切り替え
   */
  function toggleBackPhotoSection(show) {
    const backSection = document.querySelector('.back-photo-section');
    if (backSection) {
      if (show) {
        backSection.style.display = 'block';
      } else {
        backSection.style.display = 'none';
      }
    }
  }
  
  /**
   * 書類タイプセレクトの変更を監視
   */
  function setupDocumentTypeObserver() {
    // すべてのセレクト要素の変更を監視
    document.addEventListener('change', function(event) {
      const target = event.target;
      
      // セレクト要素のみ処理
      if (target.tagName === 'SELECT') {
        // 書類タイプセレクトかどうか判定
        if (target.id.includes('document') || 
            target.name.includes('document') || 
            target.closest('[data-document-type]')) {
          
          checkDocumentType(target);
        }
      }
    });
    
    // 既存のセレクト要素をチェック
    document.querySelectorAll('select').forEach(function(select) {
      if (select.id.includes('document') || 
          select.name.includes('document') || 
          select.closest('[data-document-type]')) {
        
        checkDocumentType(select);
      }
    });
  }
  
  /**
   * 書類タイプをチェックして対応する機能を有効化
   */
  function checkDocumentType(select) {
    // 運転免許証が選択されているかチェック
    const isDriverLicense = select.value.toLowerCase().includes('license') || 
                           select.value.toLowerCase().includes('driver') ||
                           select.options[select.selectedIndex].text.includes('運転免許証');
    
    if (isDriverLicense) {
      console.log('[免許証写真修正] 運転免許証が選択されました');
      
      // 対応するラジオボタンを選択
      const dualRadio = document.getElementById('dual-photo-radio');
      if (dualRadio) {
        dualRadio.checked = true;
        toggleBackPhotoSection(true);
      } else {
        // ラジオボタンがなければ作成
        const photoSection = select.closest('form, .modal-body')
          .querySelector('.form-group, .photo-section');
        
        if (photoSection) {
          injectRadioButtonsToSection(photoSection);
        }
      }
    }
  }
  
  /**
   * モーダルの変更を監視
   */
  function setupModalObserver() {
    // Bootstrap 5のモーダル表示イベント
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // 身分証明書モーダルかどうかチェック
      if (isIdDocumentModal(modal)) {
        setupIdDocumentModal(modal);
      }
      
      // 写真撮影モーダルかどうかチェック
      if (isCameraModal(modal)) {
        setupCameraModal(modal);
      }
    });
    
    // クリックイベントでもモーダル内のカメラボタンを監視
    document.addEventListener('click', function(e) {
      // カメラボタンのクリック
      if (e.target.classList && 
          (e.target.classList.contains('back-camera-btn') || 
           e.target.closest('.back-camera-btn'))) {
        // クリックされた要素またはその親要素から写真サイドを取得
        const targetElement = e.target.classList.contains('back-camera-btn') ? 
                             e.target : e.target.closest('.back-camera-btn');
        
        const photoSide = targetElement.getAttribute('data-photo-side') || 'back';
        e.preventDefault();
        showCameraModal(photoSide);
      }
      
      // カメラモーダル内の「この写真を使用」ボタン
      if (e.target.id === 'use-photo' || 
          e.target.classList.contains('use-photo-btn') || 
          (e.target.textContent && e.target.textContent.includes('この写真を使用'))) {
        
        const modal = e.target.closest('.modal');
        if (modal) {
          e.preventDefault();
          const photoSide = modal.getAttribute('data-photo-side') || 
                          modal.getAttribute('data-target-side') || 'front';
          usePhotoFromModal(modal, photoSide);
        }
      }
    });
  }
  
  /**
   * IDカードモーダルかどうかをチェック
   */
  function isIdDocumentModal(modal) {
    // クラスでチェック
    if (modal.classList.contains('id-document-modal') || 
        modal.id.includes('document')) {
      return true;
    }
    
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('身分証明書') || 
                 title.textContent.includes('証明書') || 
                 title.textContent.includes('ID'))) {
      return true;
    }
    
    // 内容でチェック
    return modal.innerHTML.includes('身分証明書') || 
           modal.innerHTML.includes('書類の種類') || 
           modal.querySelector('select[name*="document"]') !== null;
  }
  
  /**
   * 身分証明書モーダルのセットアップ
   */
  function setupIdDocumentModal(modal) {
    // 書類選択セレクトを探す
    const documentSelect = modal.querySelector('select[name*="document"], select#document-type');
    
    if (documentSelect) {
      // 現在の選択をチェック
      checkDocumentType(documentSelect);
      
      // 変更イベントも設定
      documentSelect.addEventListener('change', function() {
        checkDocumentType(this);
      });
    }
  }
  
  /**
   * カメラモーダルかどうかをチェック
   */
  function isCameraModal(modal) {
    // ID/クラスでチェック
    if (modal.id.includes('camera') || 
        modal.classList.contains('camera-modal')) {
      return true;
    }
    
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('カメラ') || 
                 title.textContent.includes('撮影'))) {
      return true;
    }
    
    // 内容でチェック
    return modal.querySelector('video') !== null || 
           modal.innerHTML.includes('カメラ') || 
           modal.innerHTML.includes('撮影');
  }
  
  /**
   * カメラモーダルをセットアップ
   */
  function setupCameraModal(modal) {
    // カメラモーダルのボタンをセットアップ
    const captureBtn = modal.querySelector('#capture-photo, .capture-btn, [data-action="capture"]');
    const usePhotoBtn = modal.querySelector('#use-photo, .use-photo-btn');
    
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        setTimeout(function() {
          fixCameraPreview(modal);
        }, 100);
      });
    }
    
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const photoSide = modal.getAttribute('data-photo-side') || 
                        modal.getAttribute('data-target-side') || 'front';
        usePhotoFromModal(modal, photoSide);
      });
    }
  }
  
  /**
   * カメラプレビューの問題を修正
   */
  function fixCameraPreview(modal) {
    // プレビュー要素を取得
    const previewImg = modal.querySelector('#preview-image, .preview-image, img[id*="preview"]');
    const previewContainer = modal.querySelector('#preview-container, .preview-container');
    
    if (previewImg && previewContainer && !previewContainer.classList.contains('d-none')) {
      // 画像が空かどうかをチェック
      if (isEmptyImage(previewImg)) {
        console.log('[免許証写真修正] 空のプレビュー画像を検出しました');
        
        // カメラからキャプチャを試みる
        const video = modal.querySelector('video');
        let imageData = null;
        
        if (video && video.videoWidth && video.videoHeight) {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            imageData = canvas.toDataURL('image/jpeg');
          } catch (error) {
            console.error('[免許証写真修正] ビデオキャプチャエラー:', error);
          }
        }
        
        // キャプチャできなかった場合のフォールバック
        if (!imageData) {
          imageData = createSampleImage();
        }
        
        // プレビュー画像を更新
        previewImg.src = imageData;
        previewImg.style.display = 'block';
        
        // 状態を記録
        const photoSide = modal.getAttribute('data-photo-side') || 
                        modal.getAttribute('data-target-side') || 'front';
        photoData[photoSide] = imageData;
      }
    }
  }
  
  /**
   * カメラモーダルを表示
   */
  function showCameraModal(photoSide) {
    // 既存のモーダルを閉じる
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      try {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      } catch (error) {
        console.log('モーダルを閉じる際にエラー:', error);
      }
    });
    
    // カメラモーダルを作成
    const modalId = 'cameraModal';
    let modal = document.getElementById(modalId);
    
    // モーダルがなければ作成
    if (!modal) {
      const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true" data-photo-side="${photoSide}">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="${modalId}Label">${photoSide === 'back' ? '裏面' : '表面'}の写真を撮影</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="camera-instructions alert alert-info">
                  <ol class="mb-0">
                    <li>カメラへのアクセスを許可してください</li>
                    <li>書類全体が画面内に収まるようにしてください</li>
                    <li>明るい場所で撮影してください</li>
                    <li>やり直す場合は「撮り直す」をクリック</li>
                  </ol>
                </div>
                <div id="video-container" class="mb-3">
                  <div class="ratio ratio-4x3 bg-dark rounded">
                    <video id="camera-video" autoplay playsinline></video>
                  </div>
                </div>
                <div id="preview-container" class="d-none mb-3">
                  <div class="text-center">
                    <h6 class="mb-2">撮影された写真の確認</h6>
                    <img id="preview-image" class="img-fluid rounded border" alt="プレビュー">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                <button id="retake-photo" type="button" class="btn btn-outline-primary d-none">撮り直す</button>
                <button id="capture-photo" type="button" class="btn btn-primary">
                  <i class="bi bi-camera"></i> 撮影する
                </button>
                <button id="use-photo" type="button" class="btn btn-success d-none">
                  <i class="bi bi-check-lg"></i> この写真を使用
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // モーダルをDOMに追加
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = modalHTML;
      document.body.appendChild(tempDiv.firstElementChild);
      
      modal = document.getElementById(modalId);
      
      // ボタンにイベントリスナーを設定
      setupCameraModalButtons(modal);
    } else {
      // 既存のモーダルを再利用する場合は写真サイドを更新
      modal.setAttribute('data-photo-side', photoSide);
      const title = modal.querySelector('.modal-title');
      if (title) {
        title.textContent = `${photoSide === 'back' ? '裏面' : '表面'}の写真を撮影`;
      }
    }
    
    // モーダルを表示
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // カメラを起動
    startCamera(modal);
  }
  
  /**
   * カメラモーダルのボタンをセットアップ
   */
  function setupCameraModalButtons(modal) {
    const captureBtn = modal.querySelector('#capture-photo');
    const retakeBtn = modal.querySelector('#retake-photo');
    const usePhotoBtn = modal.querySelector('#use-photo');
    
    // 撮影ボタン
    if (captureBtn) {
      captureBtn.addEventListener('click', function() {
        capturePhoto(modal);
      });
    }
    
    // 撮り直しボタン
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function() {
        retakePhoto(modal);
      });
    }
    
    // 写真を使用ボタン
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function() {
        const photoSide = modal.getAttribute('data-photo-side') || 'front';
        usePhotoFromModal(modal, photoSide);
      });
    }
    
    // モーダルが閉じられたときのイベント
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
  }
  
  /**
   * カメラを起動
   */
  function startCamera(modal) {
    const video = modal.querySelector('video');
    if (!video) {
      console.error('[免許証写真修正] ビデオ要素が見つかりません');
      return;
    }
    
    // カメラを停止（既に起動している場合）
    stopCamera();
    
    // カメラアクセスを要求
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }, 
      audio: false 
    })
    .then(function(stream) {
      video.srcObject = stream;
      window.cameraStream = stream;
    })
    .catch(function(error) {
      console.error('[免許証写真修正] カメラアクセスエラー:', error);
      showCameraError(modal, error);
    });
  }
  
  /**
   * カメラを停止
   */
  function stopCamera() {
    if (window.cameraStream) {
      const tracks = window.cameraStream.getTracks();
      tracks.forEach(track => track.stop());
      window.cameraStream = null;
    }
  }
  
  /**
   * カメラエラーを表示
   */
  function showCameraError(modal, error) {
    const instructions = modal.querySelector('.camera-instructions');
    if (instructions) {
      instructions.className = 'alert alert-danger';
      instructions.innerHTML = `
        <p><strong>カメラを起動できませんでした</strong></p>
        <p>${error.message || 'ブラウザの設定でカメラへのアクセスを許可してください'}</p>
        <p>または、「ファイルを選択」ボタンでアップロードしてください</p>
      `;
    }
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto(modal) {
    const video = modal.querySelector('video');
    const previewImg = modal.querySelector('#preview-image');
    const videoContainer = modal.querySelector('#video-container');
    const previewContainer = modal.querySelector('#preview-container');
    const captureBtn = modal.querySelector('#capture-photo');
    const retakeBtn = modal.querySelector('#retake-photo');
    const usePhotoBtn = modal.querySelector('#use-photo');
    
    if (!video || !previewImg) {
      console.error('[免許証写真修正] 必要な要素が見つかりません');
      return;
    }
    
    try {
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // プレビュー画像を更新
      previewImg.src = imageData;
      
      // 画像データを保存
      const photoSide = modal.getAttribute('data-photo-side') || 'front';
      photoData[photoSide] = imageData;
      
      // UI要素の表示/非表示を切り替え
      videoContainer.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      usePhotoBtn.classList.remove('d-none');
      
    } catch (error) {
      console.error('[免許証写真修正] 写真キャプチャエラー:', error);
      
      // エラー発生時はサンプル画像を使用
      const sampleImage = createSampleImage();
      previewImg.src = sampleImage;
      
      // UI要素の表示/非表示を切り替え
      videoContainer.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      usePhotoBtn.classList.remove('d-none');
      
      // 画像データを保存
      const photoSide = modal.getAttribute('data-photo-side') || 'front';
      photoData[photoSide] = sampleImage;
    }
  }
  
  /**
   * 写真を撮り直す
   */
  function retakePhoto(modal) {
    const videoContainer = modal.querySelector('#video-container');
    const previewContainer = modal.querySelector('#preview-container');
    const captureBtn = modal.querySelector('#capture-photo');
    const retakeBtn = modal.querySelector('#retake-photo');
    const usePhotoBtn = modal.querySelector('#use-photo');
    
    // UI要素の表示/非表示を切り替え
    videoContainer.classList.remove('d-none');
    previewContainer.classList.add('d-none');
    captureBtn.classList.remove('d-none');
    retakeBtn.classList.add('d-none');
    usePhotoBtn.classList.add('d-none');
  }
  
  /**
   * モーダルから写真を使用
   */
  function usePhotoFromModal(modal, photoSide) {
    // プレビュー画像からデータを取得
    const previewImg = modal.querySelector('#preview-image');
    let imageData = null;
    
    if (previewImg && previewImg.src) {
      imageData = previewImg.src;
    } else {
      // 保存したデータから取得
      imageData = photoData[photoSide];
    }
    
    if (!imageData) {
      console.error('[免許証写真修正] 画像データが見つかりません');
      return;
    }
    
    // メイン画面のプレビューを更新
    updatePhotoPreview(photoSide, imageData);
    
    // モーダルを閉じる
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  
  /**
   * 写真プレビューを更新
   */
  function updatePhotoPreview(photoSide, imageData) {
    console.log(`[免許証写真修正] ${photoSide}のプレビューを更新`);
    
    // 要素ID
    const previewId = photoSide === 'back' ? 'back-photo-preview' : 'front-photo-preview';
    const imageId = photoSide === 'back' ? 'back-photo-image' : 'front-photo-image';
    const placeholderId = photoSide === 'back' ? 'back-photo-placeholder' : 'front-photo-placeholder';
    const removeBtnId = photoSide === 'back' ? 'back-photo-remove-btn' : 'front-photo-remove-btn';
    const inputId = photoSide === 'back' ? 'back-photo-input' : 'front-photo-input';
    
    // 要素を取得
    const preview = document.getElementById(previewId);
    const image = document.getElementById(imageId);
    const placeholder = document.getElementById(placeholderId);
    const removeBtn = document.getElementById(removeBtnId);
    const input = document.getElementById(inputId);
    
    // プレビュー画像を更新
    if (image) {
      image.src = imageData;
    }
    
    // プレビューを表示
    if (preview) {
      preview.classList.remove('d-none');
      preview.style.display = 'block';
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
    
    // 写真の設定状態を更新
    if (photoSide === 'front') {
      isLicenseFrontPhotoSet = true;
    } else {
      isLicenseBackPhotoSet = true;
    }
    
    // Blobに変換してファイル入力に設定
    if (input) {
      setFileInputFromDataURL(input, imageData);
    }
  }
  
  /**
   * ファイルを選択した際の処理
   */
  function handlePhotoFile(file, photoSide) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      updatePhotoPreview(photoSide, e.target.result);
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * プレビューをクリア
   */
  function clearPhotoPreview(photoSide) {
    const previewId = photoSide === 'back' ? 'back-photo-preview' : 'front-photo-preview';
    const placeholderId = photoSide === 'back' ? 'back-photo-placeholder' : 'front-photo-placeholder';
    const removeBtnId = photoSide === 'back' ? 'back-photo-remove-btn' : 'front-photo-remove-btn';
    const inputId = photoSide === 'back' ? 'back-photo-input' : 'front-photo-input';
    
    // 要素を取得
    const preview = document.getElementById(previewId);
    const placeholder = document.getElementById(placeholderId);
    const removeBtn = document.getElementById(removeBtnId);
    const input = document.getElementById(inputId);
    
    // プレビューを非表示
    if (preview) {
      preview.classList.add('d-none');
    }
    
    // プレースホルダーを表示
    if (placeholder) {
      placeholder.classList.remove('d-none');
      placeholder.style.display = 'block';
    }
    
    // 削除ボタンを非表示
    if (removeBtn) {
      removeBtn.classList.add('d-none');
    }
    
    // 入力をクリア
    if (input) {
      input.value = '';
    }
    
    // 写真の設定状態を更新
    if (photoSide === 'front') {
      isLicenseFrontPhotoSet = false;
    } else {
      isLicenseBackPhotoSet = false;
    }
  }
  
  /**
   * Base64データURLからBlobを作成してファイル入力に設定
   */
  function setFileInputFromDataURL(fileInput, dataURL) {
    try {
      // Base64からBlobに変換
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      // Blobからファイルを作成
      const filename = `photo_${Date.now()}.jpg`;
      const file = new File([u8arr], filename, { type: mime });
      
      // DataTransferオブジェクトを作成（FileListを模倣）
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // ファイル入力にファイルを設定
      fileInput.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
      
    } catch (error) {
      console.error('[免許証写真修正] ファイル入力設定エラー:', error);
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
   * サンプル画像を生成
   */
  function createSampleImage() {
    // キャンバスを作成
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
    
    // テキスト
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('サンプル画像', canvas.width / 2, canvas.height - 20);
    
    return canvas.toDataURL('image/jpeg', 0.9);
  }
})();