/**
 * 証明写真アップロード機能を提供するスクリプト
 * カメラでの撮影機能、プレビュー機能を実装
 */
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    setupIdPhotoUpload();
  });
  
  // 証明写真の現在のFileオブジェクト
  let currentIdPhotoFile = null;
  let currentIdPhotoFrontFile = null;
  let currentIdPhotoBackFile = null;
  
  // 写真タイプ（単一/表裏）
  let idPhotoType = 'single';

/**
 * 証明写真アップロード機能を設定
 */
function setupIdPhotoUpload() {
  console.log('証明写真アップロード機能を設定します');
  
  // ガイド登録モーダルの表示を検知して設定
  const registerGuideModal = document.getElementById('registerGuideModal');
  if (registerGuideModal) {
    console.log('ガイド登録モーダルを検出しました');
    registerGuideModal.addEventListener('shown.bs.modal', () => {
      console.log('ガイド登録モーダルが表示されました - 証明写真セクションを初期化します');
      initIdPhotoSection();
    });
  }

  // 既に表示されている場合にも対応
  if (registerGuideModal && window.getComputedStyle(registerGuideModal).display !== 'none') {
    console.log('モーダルが既に表示されています - 証明写真セクションを初期化します');
    initIdPhotoSection();
  }
  
  // 直接ボタンを設定する（モーダルによらず）
  setupIdPhotoListeners();
}

/**
 * 証明写真セクションの初期化
 */
function initIdPhotoSection() {
  // 既存の証明写真セクションがあるか確認
  if (document.getElementById('id-photo-section')) {
    setupIdPhotoListeners();
    return;
  }

  console.log('証明写真セクションを初期化します');
  
  // 証明写真セクションが存在しない場合、身分証明書セクションの下に追加
  const idDocumentSection = document.querySelector('#guideRegisterModal .card');
  if (!idDocumentSection) {
    console.error('身分証明書セクションが見つかりません');
    return;
  }

  const photoSectionHTML = `
    <div id="id-photo-section" class="row mt-4">
      <div class="col-12">
        <label class="form-label fw-bold">証明写真</label>
        <div class="card p-3">
          <div class="id-photo-type-selector mb-3">
            <h6 class="mb-2">証明写真タイプ</h6>
            <div class="form-check form-check-inline">
              <input class="form-check-input photo-type-radio" type="radio" name="id-photo-type" id="id-photo-type-single" value="single" checked>
              <label class="form-check-label" for="id-photo-type-single">証明写真（1枚）</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input photo-type-radio" type="radio" name="id-photo-type" id="id-photo-type-dual" value="dual">
              <label class="form-check-label" for="id-photo-type-dual">表裏写真（運転免許証等）</label>
            </div>
          </div>
          
          <!-- 単一写真モード -->
          <div id="single-photo-section">
            <div class="row">
              <div class="col-md-4">
                <div id="id-photo-preview" class="preview-container mb-2 d-none">
                  <img id="id-photo-image" src="#" alt="証明写真" class="img-fluid rounded">
                </div>
                <div id="id-photo-placeholder" class="d-flex flex-column align-items-center justify-content-center bg-light rounded p-3 text-center" style="height: 150px;">
                  <i class="bi bi-person-badge fs-1 mb-2 text-secondary"></i>
                  <span>証明写真が未設定です</span>
                </div>
              </div>
              <div class="col-md-8">
                <h6 class="mb-3 fw-bold">証明写真をアップロード</h6>
                <p class="small text-muted mb-3">
                  正面から撮影した顔写真をアップロードしてください。身分証明書とは別に必要です。
                </p>
                <div class="mb-3">
                  <div class="d-grid gap-2">
                    <button type="button" id="id-photo-file-btn" class="btn btn-primary d-flex align-items-center justify-content-center">
                      <i class="bi bi-file-earmark-image me-2"></i> 証明写真ファイルを選択
                    </button>
                    <button type="button" id="id-photo-camera-btn" class="btn btn-outline-primary d-flex align-items-center justify-content-center">
                      <i class="bi bi-camera me-2"></i> カメラで撮影する
                    </button>
                    <input type="file" id="id-photo-input" class="d-none" accept="image/jpeg, image/png, image/jpg">
                  </div>
                  <button type="button" id="id-photo-remove-btn" class="btn btn-outline-secondary btn-sm mt-2 d-none">
                    <i class="bi bi-trash"></i> 削除
                  </button>
                </div>
                <div class="small text-muted">
                  JPG、PNG形式の画像（推奨サイズ500x500px以上、最大5MB）。顔がはっきり見える正面向きの証明写真を使用してください。
                </div>
              </div>
            </div>
          </div>
          
          <!-- 表裏写真モード -->
          <div id="dual-photo-section" class="d-none">
            <div class="row mb-4">
              <div class="col-md-4">
                <div id="id-photo-front-preview" class="preview-container mb-2 d-none">
                  <img id="id-photo-front-image" src="#" alt="表面写真" class="img-fluid rounded">
                </div>
                <div id="id-photo-front-placeholder" class="d-flex flex-column align-items-center justify-content-center bg-light rounded p-3 text-center" style="height: 150px;">
                  <i class="bi bi-credit-card-front fs-1 mb-2 text-secondary"></i>
                  <span>表面が未設定です</span>
                </div>
              </div>
              <div class="col-md-8">
                <h6 class="mb-3 fw-bold">表面写真をアップロード</h6>
                <div class="mb-3">
                  <div class="d-grid gap-2">
                    <button type="button" id="id-photo-front-file-btn" class="btn btn-primary d-flex align-items-center justify-content-center">
                      <i class="bi bi-file-earmark-image me-2"></i> 表面写真を選択
                    </button>
                    <button type="button" id="id-photo-front-camera-btn" class="btn btn-outline-primary d-flex align-items-center justify-content-center">
                      <i class="bi bi-camera me-2"></i> 表面を撮影
                    </button>
                    <input type="file" id="id-photo-front-input" class="d-none" accept="image/jpeg, image/png, image/jpg">
                  </div>
                  <button type="button" id="id-photo-front-remove-btn" class="btn btn-outline-secondary btn-sm mt-2 d-none">
                    <i class="bi bi-trash"></i> 削除
                  </button>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-4">
                <div id="id-photo-back-preview" class="preview-container mb-2 d-none">
                  <img id="id-photo-back-image" src="#" alt="裏面写真" class="img-fluid rounded">
                </div>
                <div id="id-photo-back-placeholder" class="d-flex flex-column align-items-center justify-content-center bg-light rounded p-3 text-center" style="height: 150px;">
                  <i class="bi bi-credit-card-back fs-1 mb-2 text-secondary"></i>
                  <span>裏面が未設定です</span>
                </div>
              </div>
              <div class="col-md-8">
                <h6 class="mb-3 fw-bold">裏面写真をアップロード</h6>
                <div class="mb-3">
                  <div class="d-grid gap-2">
                    <button type="button" id="id-photo-back-file-btn" class="btn btn-primary d-flex align-items-center justify-content-center">
                      <i class="bi bi-file-earmark-image me-2"></i> 裏面写真を選択
                    </button>
                    <button type="button" id="id-photo-back-camera-btn" class="btn btn-outline-primary d-flex align-items-center justify-content-center">
                      <i class="bi bi-camera me-2"></i> 裏面を撮影
                    </button>
                    <input type="file" id="id-photo-back-input" class="d-none" accept="image/jpeg, image/png, image/jpg">
                  </div>
                  <button type="button" id="id-photo-back-remove-btn" class="btn btn-outline-secondary btn-sm mt-2 d-none">
                    <i class="bi bi-trash"></i> 削除
                  </button>
                </div>
              </div>
            </div>
            
            <div class="mt-3 small text-muted">
              運転免許証などの表裏両面をアップロードしてください。JPG、PNG形式の画像（最大5MB）。情報がはっきり見えるように撮影してください。
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 身分証明書セクションの後に挿入
  idDocumentSection.insertAdjacentHTML('afterend', photoSectionHTML);
  
  // イベントリスナーを設定
  setupIdPhotoListeners();
  
  // 国際化があれば適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

/**
 * 証明写真関連のイベントリスナーを設定
 */
function setupIdPhotoListeners() {
  console.log('証明写真のイベントリスナーを設定します');
  
  // ラジオボタンのイベントを委譲する方式に変更（より安定した実装）
  const photoTypeSelector = document.querySelector('.id-photo-type-selector');
  if (photoTypeSelector) {
    console.log('写真タイプセレクターを検出しました');
    
    // セクション要素を事前に取得しておく
    const singlePhotoSection = document.getElementById('single-photo-section');
    const dualPhotoSection = document.getElementById('dual-photo-section');
    
    if (!singlePhotoSection || !dualPhotoSection) {
      console.error('写真セクションが見つかりません', {
        single: !!singlePhotoSection,
        dual: !!dualPhotoSection
      });
      return;
    }
    
    // イベント委譲でラジオボタン変更を検知
    photoTypeSelector.addEventListener('change', function(event) {
      if (event.target && event.target.classList.contains('photo-type-radio')) {
        const photoType = event.target.value;
        console.log('写真タイプが変更されました:', photoType);
        
        // グローバル変数に保存
        idPhotoType = photoType;
        
        // セクション表示切り替え
        if (photoType === 'single') {
          console.log('単一写真モードに切り替え');
          singlePhotoSection.classList.remove('d-none');
          dualPhotoSection.classList.add('d-none');
        } else if (photoType === 'dual') {
          console.log('表裏写真モードに切り替え');
          singlePhotoSection.classList.add('d-none');
          dualPhotoSection.classList.remove('d-none');
        }
      }
    });
    
    // 初期状態を設定
    const initialRadio = document.getElementById('id-photo-type-single');
    if (initialRadio && initialRadio.checked) {
      idPhotoType = 'single';
      singlePhotoSection.classList.remove('d-none');
      dualPhotoSection.classList.add('d-none');
    }
  } else {
    console.error('写真タイプセレクターが見つかりません');
  }
  
  // 単一写真モードのイベントリスナー
  setupSinglePhotoListeners();
  
  // 表裏写真モードのイベントリスナー
  setupDualPhotoListeners();
}

/**
 * 単一写真モードのイベントリスナーを設定
 */
function setupSinglePhotoListeners() {
  // ファイル選択ボタン
  const fileButton = document.getElementById('id-photo-file-btn');
  if (fileButton) {
    console.log('ファイル選択ボタンを検出しました');
    fileButton.addEventListener('click', function() {
      const input = document.getElementById('id-photo-input');
      if (input) {
        console.log('ファイル選択ボタンがクリックされました');
        input.click();
      }
    });
  } else {
    console.error('ファイル選択ボタンが見つかりません');
  }

  // ファイル入力の変更
  const fileInput = document.getElementById('id-photo-input');
  if (fileInput) {
    console.log('ファイル入力フィールドを検出しました');
    fileInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        console.log('ファイルが選択されました:', this.files[0].name);
        handleIdPhotoChange(this.files[0]);
      }
    });
  } else {
    console.error('ファイル入力フィールドが見つかりません');
  }

  // カメラボタン
  const cameraButton = document.getElementById('id-photo-camera-btn');
  if (cameraButton) {
    console.log('カメラボタンを検出しました');
    cameraButton.addEventListener('click', function() {
      console.log('カメラボタンがクリックされました');
      showIdPhotoCamera('single');
    });
  } else {
    console.error('カメラボタンが見つかりません');
  }

  // 削除ボタン
  const removeButton = document.getElementById('id-photo-remove-btn');
  if (removeButton) {
    console.log('削除ボタンを検出しました');
    removeButton.addEventListener('click', function() {
      console.log('削除ボタンがクリックされました');
      removeIdPhoto();
    });
  } else {
    console.error('削除ボタンが見つかりません');
  }
}

/**
 * 表裏写真モードのイベントリスナーを設定
 */
function setupDualPhotoListeners() {
  // 表面ファイル選択ボタン
  const frontFileButton = document.getElementById('id-photo-front-file-btn');
  if (frontFileButton) {
    frontFileButton.addEventListener('click', function() {
      const input = document.getElementById('id-photo-front-input');
      if (input) input.click();
    });
  }

  // 裏面ファイル選択ボタン
  const backFileButton = document.getElementById('id-photo-back-file-btn');
  if (backFileButton) {
    backFileButton.addEventListener('click', function() {
      const input = document.getElementById('id-photo-back-input');
      if (input) input.click();
    });
  }

  // 表面カメラボタン
  const frontCameraButton = document.getElementById('id-photo-front-camera-btn');
  if (frontCameraButton) {
    frontCameraButton.addEventListener('click', function() {
      showIdPhotoCamera('front');
    });
  }

  // 裏面カメラボタン
  const backCameraButton = document.getElementById('id-photo-back-camera-btn');
  if (backCameraButton) {
    backCameraButton.addEventListener('click', function() {
      showIdPhotoCamera('back');
    });
  }

  // 表面ファイル入力の変更
  const frontFileInput = document.getElementById('id-photo-front-input');
  if (frontFileInput) {
    frontFileInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        handleIdPhotoFrontChange(this.files[0]);
      }
    });
  }

  // 裏面ファイル入力の変更
  const backFileInput = document.getElementById('id-photo-back-input');
  if (backFileInput) {
    backFileInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        handleIdPhotoBackChange(this.files[0]);
      }
    });
  }

  // 表面削除ボタン
  const frontRemoveButton = document.getElementById('id-photo-front-remove-btn');
  if (frontRemoveButton) {
    frontRemoveButton.addEventListener('click', function() {
      removeIdPhotoFront();
    });
  }

  // 裏面削除ボタン
  const backRemoveButton = document.getElementById('id-photo-back-remove-btn');
  if (backRemoveButton) {
    backRemoveButton.addEventListener('click', function() {
      removeIdPhotoBack();
    });
  }
}

/**
 * ファイル選択時の処理
 * @param {File} file 選択されたファイル
 */
function handleIdPhotoChange(file) {
  console.log('証明写真ファイル処理開始:', file.name, file.type, `${Math.round(file.size / 1024)}KB`);
  
  // ファイルサイズのチェック（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    showIdPhotoError('ファイルサイズが大きすぎます（最大5MB）');
    return;
  }

  // ファイル形式のチェック
  if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/gif')) {
    showIdPhotoError('JPGまたはPNG形式の画像ファイルを選択してください');
    return;
  }

  // ファイルを保存
  currentIdPhotoFile = file;
  console.log('証明写真を保存しました');

  // ファイル入力の値を更新
  const fileInput = document.getElementById('id-photo-input');
  if (fileInput) {
    try {
      // DataTransferオブジェクトを使用してファイル入力を更新
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    } catch (error) {
      console.error('ファイル入力の更新に失敗しました:', error);
    }
  }

  // プレビュー表示
  updateIdPhotoPreview(file);
}

/**
 * 証明写真のプレビュー表示を更新
 * @param {File} file 画像ファイル
 */
function updateIdPhotoPreview(file) {
  if (!file) return;
  
  // プレビュー要素を取得
  const previewContainer = document.getElementById('id-photo-preview');
  const placeholder = document.getElementById('id-photo-placeholder');
  const previewImage = document.getElementById('id-photo-image');
  const removeButton = document.getElementById('id-photo-remove-btn');
  
  console.log('プレビュー要素を検出:', 
    previewContainer ? '✓' : '✗', 
    placeholder ? '✓' : '✗', 
    previewImage ? '✓' : '✗', 
    removeButton ? '✓' : '✗'
  );
  
  if (!previewContainer || !placeholder || !previewImage) {
    console.error('必要なプレビュー要素が見つかりません');
    return;
  }
  
  // FileReaderでファイルを読み込み
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      // プレビュー画像を設定
      previewImage.src = e.target.result;
      
      // UI表示状態を更新
      previewContainer.classList.remove('d-none');
      placeholder.classList.add('d-none');
      
      // 削除ボタンを表示
      if (removeButton) {
        removeButton.classList.remove('d-none');
      }
      
      console.log('プレビューを表示しました');
      
      // アップロードステータスの表示（オプション）
      const successMessage = document.createElement('div');
      successMessage.className = 'text-success mt-2';
      successMessage.innerHTML = '<i class="bi bi-check-circle"></i> 証明写真がアップロードされました';
      
      const existingSuccess = previewContainer.querySelector('.text-success');
      if (existingSuccess) {
        existingSuccess.remove();
      }
      
      previewContainer.appendChild(successMessage);
      
      // 3秒後にメッセージを非表示
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
      
    } catch (error) {
      console.error('プレビュー表示中にエラーが発生しました:', error);
    }
  };
  
  reader.onerror = function(error) {
    console.error('ファイル読み込みエラー:', error);
    showIdPhotoError('ファイルの読み込みに失敗しました。別のファイルをお試しください。');
  };
  
  // ファイルを読み込み
  reader.readAsDataURL(file);
}

/**
 * 表面写真のファイル処理
 * @param {File} file 選択されたファイル
 */
function handleIdPhotoFrontChange(file) {
  console.log('表面写真ファイル処理開始:', file.name, file.type, `${Math.round(file.size / 1024)}KB`);
  
  // ファイルサイズのチェック（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    showIdPhotoError('ファイルサイズが大きすぎます（最大5MB）');
    return;
  }

  // ファイル形式のチェック
  if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/gif')) {
    showIdPhotoError('JPGまたはPNG形式の画像ファイルを選択してください');
    return;
  }

  // ファイルを保存
  currentIdPhotoFrontFile = file;
  console.log('表面写真を保存しました');

  // ファイル入力の値を更新
  const fileInput = document.getElementById('id-photo-front-input');
  if (fileInput) {
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    } catch (error) {
      console.error('ファイル入力の更新に失敗しました:', error);
    }
  }

  // プレビュー表示
  updateIdPhotoFrontPreview(file);
}

/**
 * 裏面写真のファイル処理
 * @param {File} file 選択されたファイル
 */
function handleIdPhotoBackChange(file) {
  console.log('裏面写真ファイル処理開始:', file.name, file.type, `${Math.round(file.size / 1024)}KB`);
  
  // ファイルサイズのチェック（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    showIdPhotoError('ファイルサイズが大きすぎます（最大5MB）');
    return;
  }

  // ファイル形式のチェック
  if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/gif')) {
    showIdPhotoError('JPGまたはPNG形式の画像ファイルを選択してください');
    return;
  }

  // ファイルを保存
  currentIdPhotoBackFile = file;
  console.log('裏面写真を保存しました');

  // ファイル入力の値を更新
  const fileInput = document.getElementById('id-photo-back-input');
  if (fileInput) {
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    } catch (error) {
      console.error('ファイル入力の更新に失敗しました:', error);
    }
  }

  // プレビュー表示
  updateIdPhotoBackPreview(file);
}

/**
 * 表面写真のプレビュー表示を更新
 * @param {File} file 画像ファイル
 */
function updateIdPhotoFrontPreview(file) {
  if (!file) return;
  
  const previewContainer = document.getElementById('id-photo-front-preview');
  const placeholder = document.getElementById('id-photo-front-placeholder');
  const previewImage = document.getElementById('id-photo-front-image');
  const removeButton = document.getElementById('id-photo-front-remove-btn');
  
  if (!previewContainer || !placeholder || !previewImage) {
    console.error('必要なプレビュー要素が見つかりません');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      previewImage.src = e.target.result;
      previewContainer.classList.remove('d-none');
      placeholder.classList.add('d-none');
      
      if (removeButton) {
        removeButton.classList.remove('d-none');
      }
      
      console.log('表面プレビューを表示しました');
      
      // アップロードステータスの表示
      const successMessage = document.createElement('div');
      successMessage.className = 'text-success mt-2';
      successMessage.innerHTML = '<i class="bi bi-check-circle"></i> 表面写真がアップロードされました';
      
      const existingSuccess = previewContainer.querySelector('.text-success');
      if (existingSuccess) {
        existingSuccess.remove();
      }
      
      previewContainer.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    } catch (error) {
      console.error('プレビュー表示中にエラーが発生しました:', error);
    }
  };
  
  reader.onerror = function(error) {
    console.error('ファイル読み込みエラー:', error);
    showIdPhotoError('ファイルの読み込みに失敗しました。別のファイルをお試しください。');
  };
  
  reader.readAsDataURL(file);
}

/**
 * 裏面写真のプレビュー表示を更新
 * @param {File} file 画像ファイル
 */
function updateIdPhotoBackPreview(file) {
  if (!file) return;
  
  const previewContainer = document.getElementById('id-photo-back-preview');
  const placeholder = document.getElementById('id-photo-back-placeholder');
  const previewImage = document.getElementById('id-photo-back-image');
  const removeButton = document.getElementById('id-photo-back-remove-btn');
  
  if (!previewContainer || !placeholder || !previewImage) {
    console.error('必要なプレビュー要素が見つかりません');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      previewImage.src = e.target.result;
      previewContainer.classList.remove('d-none');
      placeholder.classList.add('d-none');
      
      if (removeButton) {
        removeButton.classList.remove('d-none');
      }
      
      console.log('裏面プレビューを表示しました');
      
      // アップロードステータスの表示
      const successMessage = document.createElement('div');
      successMessage.className = 'text-success mt-2';
      successMessage.innerHTML = '<i class="bi bi-check-circle"></i> 裏面写真がアップロードされました';
      
      const existingSuccess = previewContainer.querySelector('.text-success');
      if (existingSuccess) {
        existingSuccess.remove();
      }
      
      previewContainer.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    } catch (error) {
      console.error('プレビュー表示中にエラーが発生しました:', error);
    }
  };
  
  reader.onerror = function(error) {
    console.error('ファイル読み込みエラー:', error);
    showIdPhotoError('ファイルの読み込みに失敗しました。別のファイルをお試しください。');
  };
  
  reader.readAsDataURL(file);
}

/**
 * 表面写真を削除
 */
function removeIdPhotoFront() {
  console.log('表面写真を削除します');
  
  // ファイルをクリア
  currentIdPhotoFrontFile = null;
  const fileInput = document.getElementById('id-photo-front-input');
  if (fileInput) {
    fileInput.value = '';
  }

  // UI更新
  const previewContainer = document.getElementById('id-photo-front-preview');
  const placeholder = document.getElementById('id-photo-front-placeholder');
  const removeButton = document.getElementById('id-photo-front-remove-btn');

  if (previewContainer && placeholder && removeButton) {
    previewContainer.classList.add('d-none');
    placeholder.classList.remove('d-none');
    removeButton.classList.add('d-none');
  }
}

/**
 * 裏面写真を削除
 */
function removeIdPhotoBack() {
  console.log('裏面写真を削除します');
  
  // ファイルをクリア
  currentIdPhotoBackFile = null;
  const fileInput = document.getElementById('id-photo-back-input');
  if (fileInput) {
    fileInput.value = '';
  }

  // UI更新
  const previewContainer = document.getElementById('id-photo-back-preview');
  const placeholder = document.getElementById('id-photo-back-placeholder');
  const removeButton = document.getElementById('id-photo-back-remove-btn');

  if (previewContainer && placeholder && removeButton) {
    previewContainer.classList.add('d-none');
    placeholder.classList.remove('d-none');
    removeButton.classList.add('d-none');
  }
}

/**
 * 証明写真用カメラモーダルを表示
 * @param {string} mode 撮影モード('single'/'front'/'back')
 */
function showIdPhotoCamera(mode = 'single') {
  console.log('証明写真カメラモーダルを表示します, モード: ' + mode);
  
  // 既存のモーダルを削除
  const existingModal = document.getElementById('idPhotoModal');
  if (existingModal) {
    existingModal.remove();
    console.log('既存のカメラモーダルを削除しました');
  }

  // モーダルタイトルの設定（モードに応じて変更）
  let modalTitle = '証明写真を撮影';
  
  switch (mode) {
    case 'front':
      modalTitle = '表面写真を撮影';
      break;
    case 'back':
      modalTitle = '裏面写真を撮影';
      break;
  }
  
  // カメラモーダル作成
  const modalHtml = `
    <div class="modal fade" id="idPhotoModal" tabindex="-1" aria-labelledby="idPhotoModalLabel" aria-hidden="true" data-mode="${mode}">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="idPhotoModalLabel">${modalTitle}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="id-photo-camera-feedback"></div>
            <div class="text-center mb-3">
              <div class="alert alert-info">カメラを起動しています。カメラへのアクセスを許可してください。</div>
            </div>
            <video id="idPhotoPreview" class="w-100 border rounded" autoplay></video>
            <canvas id="idPhotoCanvas" class="d-none"></canvas>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
            <button type="button" class="btn btn-primary" id="idPhotoCaptureButton">
              <i class="bi bi-camera-fill me-1"></i> 撮影する
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  console.log('カメラモーダルを作成しました');

  // モーダルを表示
  try {
    const cameraModal = new bootstrap.Modal(document.getElementById('idPhotoModal'));
    cameraModal.show();
    console.log('カメラモーダルを表示しました');
  } catch (error) {
    console.error('カメラモーダル表示エラー:', error);
  }

  // カメラアクセス開始
  startIdCamera();

  // 国際化適用
  if (typeof applyTranslations === 'function') {
    applyTranslations();
  }
}

/**
 * 証明写真用カメラを起動
 */
function startIdCamera() {
  console.log('証明写真用カメラを起動します');
  
  const video = document.getElementById('idPhotoPreview');
  const captureButton = document.getElementById('idPhotoCaptureButton');
  const canvas = document.getElementById('idPhotoCanvas');
  const feedbackDiv = document.querySelector('.id-photo-camera-feedback');
  const infoAlert = document.querySelector('#idPhotoModal .alert-info');
  
  if (!video || !captureButton || !canvas) {
    console.error('必要なカメラ要素が見つかりません', {
      video: !!video,
      captureButton: !!captureButton,
      canvas: !!canvas
    });
    return;
  }

  // モードに応じて適切なカメラを選択
  const photoMode = document.getElementById('idPhotoModal').getAttribute('data-mode') || 'single';
  
  // 携帯端末かどうか判定
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log('デバイス判定:', isMobile ? 'モバイル' : 'デスクトップ');
  
  // カメラ設定
  const constraints = { 
    video: { 
      width: { ideal: 1280 },
      height: { ideal: 720 },
      // 表・裏写真の場合、モバイルデバイスなら背面カメラを優先
      facingMode: (photoMode === 'front' || photoMode === 'back') && isMobile ? 'environment' : 'user'
    }, 
    audio: false 
  };
  
  console.log('カメラ設定:', JSON.stringify(constraints.video));
  
  // カメラへのアクセス
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      console.log('カメラへのアクセスに成功しました');
      video.srcObject = stream;
      
      // 情報アラートを非表示
      if (infoAlert) {
        infoAlert.style.display = 'none';
      }

      // 撮影ボタンのイベント設定
      captureButton.addEventListener('click', function() {
        console.log('撮影ボタンがクリックされました');
        
        try {
          // キャンバスの準備
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          console.log('カメラ画像をキャンバスに描画しました', canvas.width, canvas.height);

          // 画像データをBlobに変換
          canvas.toBlob(function(blob) {
            // ファイル名生成
            const fileName = `id_photo_${Date.now()}.png`;
            console.log('画像ファイルを作成します:', fileName);

            // Fileオブジェクトを作成
            const file = new File([blob], fileName, { type: 'image/png' });

            // 撮影モードに応じて適切なハンドラーを呼び出す
            const photoMode = document.getElementById('idPhotoModal').getAttribute('data-mode') || 'single';
            console.log('写真モード:', photoMode);
            
            switch (photoMode) {
              case 'single':
                handleIdPhotoChange(file);
                break;
              case 'front':
                handleIdPhotoFrontChange(file);
                break;
              case 'back':
                handleIdPhotoBackChange(file);
                break;
              default:
                handleIdPhotoChange(file);
            }

            // モーダルを閉じる
            try {
              const cameraModal = bootstrap.Modal.getInstance(document.getElementById('idPhotoModal'));
              if (cameraModal) {
                cameraModal.hide();
              } else {
                console.error('カメラモーダルのインスタンスが見つかりません');
                const modalElement = document.getElementById('idPhotoModal');
                if (modalElement) {
                  modalElement.classList.remove('show');
                  modalElement.style.display = 'none';
                  document.body.classList.remove('modal-open');
                  const backdrops = document.querySelectorAll('.modal-backdrop');
                  backdrops.forEach(backdrop => backdrop.remove());
                }
              }
            } catch (error) {
              console.error('モーダルを閉じる際にエラーが発生しました:', error);
            }

            // ストリームを停止
            stopIdCamera();
          }, 'image/png');
        } catch (error) {
          console.error('写真撮影中にエラーが発生しました:', error);
        }
      });
    })
    .catch(error => {
      console.error('カメラアクセスエラー:', error);
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `<div class="alert alert-danger">カメラにアクセスできません。デバイスのカメラ設定を確認してください。</div>`;
        if (typeof applyTranslations === 'function') {
          applyTranslations();
        }
      }
      
      // 情報アラートをエラーアラートに変更
      if (infoAlert) {
        infoAlert.className = 'alert alert-danger';
        infoAlert.textContent = 'カメラにアクセスできません。デバイスのカメラ設定を確認してください。';
      }
    });

  // モーダルが閉じられたときにカメラを停止
  const modal = document.getElementById('idPhotoModal');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', stopIdCamera);
  }
}

/**
 * 証明写真用カメラを停止
 */
function stopIdCamera() {
  console.log('証明写真用カメラを停止します');
  
  const video = document.getElementById('idPhotoPreview');
  if (video && video.srcObject) {
    try {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
      console.log('カメラを正常に停止しました');
    } catch (error) {
      console.error('カメラ停止中にエラーが発生しました:', error);
    }
  } else {
    console.log('停止するカメラがありません');
  }
}

/**
 * 証明写真を削除
 */
function removeIdPhoto() {
  console.log('証明写真を削除します');
  
  // ファイルをクリア
  currentIdPhotoFile = null;
  const fileInput = document.getElementById('id-photo-input');
  if (fileInput) {
    fileInput.value = '';
    console.log('ファイル入力フィールドをクリアしました');
  } else {
    console.error('ファイル入力フィールドが見つかりません');
  }

  // UI更新
  const previewContainer = document.getElementById('id-photo-preview');
  const placeholder = document.getElementById('id-photo-placeholder');
  const removeButton = document.getElementById('id-photo-remove-btn');

  console.log('証明写真UI要素を検出:', 
    previewContainer ? '✓' : '✗', 
    placeholder ? '✓' : '✗', 
    removeButton ? '✓' : '✗'
  );

  if (previewContainer && placeholder && removeButton) {
    previewContainer.classList.add('d-none');
    placeholder.classList.remove('d-none');
    removeButton.classList.add('d-none');
    console.log('証明写真のUI状態を更新しました');
  } else {
    console.error('証明写真のUI要素が見つかりません');
  }
}

/**
 * エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showIdPhotoError(message) {
  console.error('証明写真エラー:', message);
  
  // エラー表示用の要素がなければ作成
  let errorElement = document.getElementById('id-photo-error');
  if (!errorElement) {
    const idPhotoSection = document.getElementById('id-photo-section');
    if (!idPhotoSection) {
      console.error('証明写真セクションが見つかりません');
      return;
    }

    errorElement = document.createElement('div');
    errorElement.id = 'id-photo-error';
    errorElement.className = 'alert alert-danger mt-2';
    idPhotoSection.appendChild(errorElement);
    console.log('エラー表示要素を作成しました');
  }

  // エラーメッセージを表示
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');
  console.log('エラーメッセージを表示しました:', message);

  // 3秒後に非表示
  setTimeout(() => {
    errorElement.classList.add('d-none');
    console.log('エラーメッセージを非表示にしました');
  }, 3000);
}

/**
 * 証明写真のFileオブジェクトを取得（他スクリプトから利用）
 * @returns {File|null} 証明写真のFileオブジェクト
 */
function getIdPhotoFile() {
  return currentIdPhotoFile;
}

/**
 * 表面写真のFileオブジェクトを取得（他スクリプトから利用）
 * @returns {File|null} 表面写真のFileオブジェクト
 */
function getIdPhotoFrontFile() {
  return currentIdPhotoFrontFile;
}

/**
 * 裏面写真のFileオブジェクトを取得（他スクリプトから利用）
 * @returns {File|null} 裏面写真のFileオブジェクト
 */
function getIdPhotoBackFile() {
  return currentIdPhotoBackFile;
}

/**
 * 現在の写真モードを取得（他スクリプトから利用）
 * @returns {string} 'single' または 'dual'
 */
function getIdPhotoMode() {
  return idPhotoType;
}

/**
 * すべての証明写真ファイルを取得（他スクリプトから利用）
 * @returns {Object} 証明写真ファイルのオブジェクト
 */
function getAllIdPhotoFiles() {
  return {
    mode: idPhotoType,
    single: currentIdPhotoFile,
    front: currentIdPhotoFrontFile,
    back: currentIdPhotoBackFile
  };
}

// グローバルに公開
window.idPhotoHandler = {
  getIdPhotoFile: getIdPhotoFile,
  getIdPhotoFrontFile: getIdPhotoFrontFile,
  getIdPhotoBackFile: getIdPhotoBackFile,
  getIdPhotoMode: getIdPhotoMode,
  getAllIdPhotoFiles: getAllIdPhotoFiles
};

})();