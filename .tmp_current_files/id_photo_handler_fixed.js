/**
 * 証明写真アップロード機能を提供するスクリプト
 * カメラでの撮影機能、プレビュー機能を実装
 * 変数競合を避けるため即時実行関数でスコープ化
 */
(function() {
  'use strict';
  
  // DOMの読み込みが完了したら初期化
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
        
        console.log('証明写真プレビューを表示しました');
      } catch (error) {
        console.error('プレビュー表示エラー:', error);
      }
    };
    
    reader.onerror = function() {
      console.error('ファイル読み込みエラー');
      showIdPhotoError('画像ファイルの読み込みに失敗しました');
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * 証明写真の削除
   */
  function removeIdPhoto() {
    console.log('証明写真を削除します');
    
    // ファイル参照をクリア
    currentIdPhotoFile = null;
    
    // プレビュー要素を取得
    const previewContainer = document.getElementById('id-photo-preview');
    const placeholder = document.getElementById('id-photo-placeholder');
    const previewImage = document.getElementById('id-photo-image');
    const removeButton = document.getElementById('id-photo-remove-btn');
    const fileInput = document.getElementById('id-photo-input');
    
    if (previewContainer) previewContainer.classList.add('d-none');
    if (placeholder) placeholder.classList.remove('d-none');
    if (previewImage) previewImage.src = '';
    if (removeButton) removeButton.classList.add('d-none');
    
    // ファイル入力をリセット
    if (fileInput) {
      try {
        fileInput.value = '';
      } catch (error) {
        console.error('ファイル入力のリセットに失敗しました:', error);
      }
    }
    
    console.log('証明写真削除完了');
  }
  
  /**
   * 表面写真ファイル処理
   * @param {File} file 選択されたファイル
   */
  function handleIdPhotoFrontChange(file) {
    console.log('表面写真ファイル処理:', file.name);
    
    // ファイルサイズのチェック（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      showIdPhotoError('ファイルサイズが大きすぎます（最大5MB）');
      return;
    }
    
    // ファイル形式のチェック
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      showIdPhotoError('JPGまたはPNG形式の画像ファイルを選択してください');
      return;
    }
    
    // ファイルを保存
    currentIdPhotoFrontFile = file;
    
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
   * 裏面写真ファイル処理
   * @param {File} file 選択されたファイル
   */
  function handleIdPhotoBackChange(file) {
    console.log('裏面写真ファイル処理:', file.name);
    
    // ファイルサイズのチェック（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      showIdPhotoError('ファイルサイズが大きすぎます（最大5MB）');
      return;
    }
    
    // ファイル形式のチェック
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      showIdPhotoError('JPGまたはPNG形式の画像ファイルを選択してください');
      return;
    }
    
    // ファイルを保存
    currentIdPhotoBackFile = file;
    
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
   * 表面写真プレビュー更新
   * @param {File} file ファイル
   */
  function updateIdPhotoFrontPreview(file) {
    if (!file) return;
    
    // プレビュー要素を取得
    const previewContainer = document.getElementById('id-photo-front-preview');
    const placeholder = document.getElementById('id-photo-front-placeholder');
    const previewImage = document.getElementById('id-photo-front-image');
    const removeButton = document.getElementById('id-photo-front-remove-btn');
    
    if (!previewContainer || !placeholder || !previewImage) {
      console.error('表面写真プレビュー要素が見つかりません');
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
      } catch (error) {
        console.error('表面写真プレビュー表示エラー:', error);
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * 裏面写真プレビュー更新
   * @param {File} file ファイル
   */
  function updateIdPhotoBackPreview(file) {
    if (!file) return;
    
    // プレビュー要素を取得
    const previewContainer = document.getElementById('id-photo-back-preview');
    const placeholder = document.getElementById('id-photo-back-placeholder');
    const previewImage = document.getElementById('id-photo-back-image');
    const removeButton = document.getElementById('id-photo-back-remove-btn');
    
    if (!previewContainer || !placeholder || !previewImage) {
      console.error('裏面写真プレビュー要素が見つかりません');
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
      } catch (error) {
        console.error('裏面写真プレビュー表示エラー:', error);
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * 表面写真削除
   */
  function removeIdPhotoFront() {
    // ファイル参照をクリア
    currentIdPhotoFrontFile = null;
    
    // プレビュー要素を取得
    const previewContainer = document.getElementById('id-photo-front-preview');
    const placeholder = document.getElementById('id-photo-front-placeholder');
    const previewImage = document.getElementById('id-photo-front-image');
    const removeButton = document.getElementById('id-photo-front-remove-btn');
    const fileInput = document.getElementById('id-photo-front-input');
    
    if (previewContainer) previewContainer.classList.add('d-none');
    if (placeholder) placeholder.classList.remove('d-none');
    if (previewImage) previewImage.src = '';
    if (removeButton) removeButton.classList.add('d-none');
    
    // ファイル入力をリセット
    if (fileInput) {
      try {
        fileInput.value = '';
      } catch (error) {
        console.error('ファイル入力のリセットに失敗しました:', error);
      }
    }
  }
  
  /**
   * 裏面写真削除
   */
  function removeIdPhotoBack() {
    // ファイル参照をクリア
    currentIdPhotoBackFile = null;
    
    // プレビュー要素を取得
    const previewContainer = document.getElementById('id-photo-back-preview');
    const placeholder = document.getElementById('id-photo-back-placeholder');
    const previewImage = document.getElementById('id-photo-back-image');
    const removeButton = document.getElementById('id-photo-back-remove-btn');
    const fileInput = document.getElementById('id-photo-back-input');
    
    if (previewContainer) previewContainer.classList.add('d-none');
    if (placeholder) placeholder.classList.remove('d-none');
    if (previewImage) previewImage.src = '';
    if (removeButton) removeButton.classList.add('d-none');
    
    // ファイル入力をリセット
    if (fileInput) {
      try {
        fileInput.value = '';
      } catch (error) {
        console.error('ファイル入力のリセットに失敗しました:', error);
      }
    }
  }
  
  /**
   * カメラモーダルを表示
   * @param {string} type 写真タイプ ('single', 'front', 'back')
   */
  function showIdPhotoCamera(type) {
    console.log(`カメラモーダルを表示: ${type}`);
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('idPhotoCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // タイトルの設定
    let title;
    switch (type) {
      case 'single':
        title = '証明写真を撮影';
        break;
      case 'front':
        title = '表面写真を撮影';
        break;
      case 'back':
        title = '裏面写真を撮影';
        break;
      default:
        title = '写真を撮影';
    }
    
    // モーダルHTMLの生成
    const modalHTML = `
      <div class="modal fade" id="idPhotoCameraModal" tabindex="-1" aria-labelledby="idPhotoCameraModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="idPhotoCameraModalLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <div id="video-container" class="video-container">
                  <video id="id-photo-camera-video" class="w-100" playsinline autoplay></video>
                  <canvas id="id-photo-camera-canvas" class="d-none"></canvas>
                </div>
                <div id="id-photo-camera-preview" class="preview-container mt-3 text-center d-none">
                  <img id="id-photo-camera-image" class="img-fluid rounded" alt="プレビュー">
                </div>
                <div id="id-photo-camera-error" class="alert alert-danger d-none" role="alert">
                  カメラにアクセスできません。ブラウザの設定を確認してください。
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="id-photo-capture-btn" class="btn btn-primary">撮影する</button>
              <button type="button" id="id-photo-retake-btn" class="btn btn-outline-primary d-none">撮り直す</button>
              <button type="button" id="id-photo-use-btn" class="btn btn-success d-none">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // モーダル要素とBootstrapモーダルインスタンスを取得
    const modalElement = document.getElementById('idPhotoCameraModal');
    const modal = new bootstrap.Modal(modalElement);
    
    // モーダルを表示
    modal.show();
    
    // カメラ関連の要素を取得
    const video = document.getElementById('id-photo-camera-video');
    const canvas = document.getElementById('id-photo-camera-canvas');
    const captureBtn = document.getElementById('id-photo-capture-btn');
    const retakeBtn = document.getElementById('id-photo-retake-btn');
    const useBtn = document.getElementById('id-photo-use-btn');
    const previewContainer = document.getElementById('id-photo-camera-preview');
    const previewImage = document.getElementById('id-photo-camera-image');
    const errorAlert = document.getElementById('id-photo-camera-error');
    
    // カメラストリーム
    let stream = null;
    
    // モーダルが表示されたときにカメラを起動
    modalElement.addEventListener('shown.bs.modal', function() {
      startCamera();
    });
    
    // モーダルが閉じられたときにカメラを停止
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // 撮影ボタンのイベント
    captureBtn.addEventListener('click', function() {
      capturePhoto();
    });
    
    // 撮り直しボタンのイベント
    retakeBtn.addEventListener('click', function() {
      retakePhoto();
    });
    
    // 写真使用ボタンのイベント
    useBtn.addEventListener('click', function() {
      usePhoto();
    });
    
    /**
     * カメラを起動
     */
    function startCamera() {
      // モバイルデバイスの場合は背面カメラを優先
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile ? 'environment' : 'user'
        }
      };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(mediaStream) {
          stream = mediaStream;
          video.srcObject = stream;
          errorAlert.classList.add('d-none');
        })
        .catch(function(err) {
          console.error('カメラアクセスエラー:', err);
          errorAlert.classList.remove('d-none');
          errorAlert.textContent = 'カメラエラー: ' + err.message;
        });
    }
    
    /**
     * カメラを停止
     */
    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    }
    
    /**
     * 写真を撮影
     */
    function capturePhoto() {
      // ビデオの内容をキャンバスに描画
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー画像の表示
      const imageDataURL = canvas.toDataURL('image/jpeg');
      previewImage.src = imageDataURL;
      
      // UI表示の切り替え
      video.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      useBtn.classList.remove('d-none');
    }
    
    /**
     * 写真を撮り直す
     */
    function retakePhoto() {
      // UI表示を元に戻す
      video.classList.remove('d-none');
      previewContainer.classList.add('d-none');
      captureBtn.classList.remove('d-none');
      retakeBtn.classList.add('d-none');
      useBtn.classList.add('d-none');
    }
    
    /**
     * 撮影した写真を使用
     */
    function usePhoto() {
      canvas.toBlob(function(blob) {
        if (!blob) {
          console.error('画像の変換に失敗しました');
          return;
        }
        
        // ファイル名を設定
        const fileName = `photo_${type}_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // 写真タイプに応じた処理
        switch (type) {
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
            console.error('不明な写真タイプ:', type);
        }
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/jpeg', 0.95);
    }
  }
  
  /**
   * エラーメッセージを表示
   * @param {string} message エラーメッセージ
   */
  function showIdPhotoError(message) {
    console.error('証明写真エラー:', message);
    
    // エラーメッセージをアラートで表示
    alert(message);
  }
})();