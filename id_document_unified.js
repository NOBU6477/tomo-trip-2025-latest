/**
 * 統一された書類アップロードUIと機能を提供するスクリプト
 * 観光客とガイド両方に同一のUIを提供し、プレビュー機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('統一化されたID書類アップロード処理を初期化');
  
  // モーダルが表示された時
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal.id === 'touristRegisterModal' || modal.id === 'guideRegisterModal') {
      setupDocumentUploadUI(modal);
    }
  });
  
  // 初期化実行
  setTimeout(function() {
    initializeAllDocumentUploads();
  }, 500);
});

/**
 * すべてのモーダルでID書類アップロードUIを初期化
 */
function initializeAllDocumentUploads() {
  // 観光客登録モーダルを初期化
  const touristModal = document.getElementById('touristRegisterModal');
  if (touristModal) {
    // 既存の要素をクリーンアップ
    cleanUpExistingDocumentElements(touristModal);
    setupDocumentUploadUI(touristModal, 'tourist');
  }
  
  // ガイド登録モーダルを初期化
  const guideModal = document.getElementById('guideRegisterModal');
  if (guideModal) {
    // 既存の要素をクリーンアップ
    cleanUpExistingDocumentElements(guideModal);
    setupDocumentUploadUI(guideModal, 'guide');
  }
}

/**
 * モーダル内の既存のID書類要素をクリーンアップ
 * @param {HTMLElement} modal モーダル要素
 */
function cleanUpExistingDocumentElements(modal) {
  // ガイド登録モーダル内の「証明写真」セクションを徹底的に削除
  if (modal.id === 'guideRegisterModal') {
    // 方法1: ラベルテキストで検索
    const photoLabels = Array.from(modal.querySelectorAll('label')).filter(label => 
      label.textContent.includes('証明写真') || 
      (label.getAttribute('data-i18n') === 'profile.photo'));
      
    photoLabels.forEach(photoLabel => {
      const parent = photoLabel.closest('.mb-3');
      if (parent) {
        console.log('証明写真セクションを削除: ラベルで検出');
        parent.remove();
      }
    });
    
    // 方法2: すべての写真関連要素を検索して削除
    const photoElements = modal.querySelectorAll('.profile-photo-upload, #guide-select-photo, #guide-take-photo');
    photoElements.forEach(element => {
      const parent = element.closest('.mb-3') || element.parentNode;
      if (parent) {
        console.log('証明写真セクションを削除: 直接要素で検出');
        parent.remove();
      }
    });
    
    // 方法3: クラス名で検索
    const photoContainers = modal.querySelectorAll('.profile-photo-container, .photo-upload-container');
    photoContainers.forEach(container => {
      console.log('証明写真コンテナを削除');
      container.remove();
    });
    
    // 方法4: 証明写真という文字列を含む要素を探して削除
    const allElements = modal.querySelectorAll('*');
    allElements.forEach(element => {
      if (element.textContent && element.textContent.includes('証明写真') && element.tagName !== 'FORM') {
        const parent = element.closest('.mb-3') || element.parentNode;
        if (parent && parent.tagName !== 'FORM') {
          console.log('証明写真文字列を含む要素を削除');
          parent.style.display = 'none';
        }
      }
    });
  }
  
  // 観光客の本人確認書類セクションをすべて削除して新しく追加しなおす
  if (modal.id === 'touristRegisterModal') {
    try {
      // ID書類ボタンを非表示に (これが最も安全な操作)
      const uploadBtn = modal.querySelector('#tourist-upload-id');
      if (uploadBtn) {
        console.log('本人確認書類ボタンを非表示に設定');
        uploadBtn.style.display = 'none';
        
        // ボタンの親要素も非表示に
        let parent = uploadBtn.parentElement;
        if (parent && parent.tagName !== 'FORM') {
          parent.style.display = 'none';
        }
      }
      
      // 安全な方法で、既存の本人確認書類セクションを検索して非表示に
      const idDocLabels = Array.from(modal.querySelectorAll('label')).filter(
        label => label.textContent && (
          label.textContent.includes('本人確認書類') || 
          label.getAttribute('data-i18n') === 'auth.id_document'
        )
      );
      
      // ラベルを見つけたら親セクションを非表示に (削除ではなく)
      idDocLabels.forEach(label => {
        try {
          const parent = label.closest('.mb-3');
          if (parent) {
            console.log('本人確認書類セクションを非表示に設定');
            parent.style.display = 'none';
          }
        } catch (err) {
          console.error('ラベル処理中のエラー:', err);
        }
      });
    } catch (err) {
      console.error('観光客モーダル処理中のエラー:', err);
    }
  }
  
  // 既存のID書類セクションを削除
  const existingSections = modal.querySelectorAll('.document-verification-section');
  existingSections.forEach(section => {
    section.remove();
  });
  
  // ID書類選択要素を削除
  const existingSelections = modal.querySelectorAll('.id-document-selection');
  existingSelections.forEach(selection => {
    selection.remove();
  });
  
  console.log(`${modal.id}内の既存ID書類要素をクリーンアップしました`);
}

/**
 * 指定されたモーダルのID書類アップロードUIをセットアップ
 * @param {HTMLElement} modal モーダル要素
 * @param {string} userType ユーザータイプ (省略時はモーダルIDから判定)
 */
function setupDocumentUploadUI(modal, userType) {
  // ユーザータイプの判定
  if (!userType) {
    if (modal.id === 'touristRegisterModal') {
      userType = 'tourist';
    } else if (modal.id === 'guideRegisterModal') {
      userType = 'guide';
    } else {
      console.warn('未対応のモーダル:', modal.id);
      return;
    }
  }
  
  console.log(`${userType}用ID書類アップロードUIをセットアップします`);
  
  // すでにクリーンアップ処理を実行済みなので、既存の確認は不要
  
  // フォームを取得
  const form = modal.querySelector('form');
  if (!form) {
    console.warn(`${userType}登録フォームが見つかりません`);
    return;
  }
  
  // 書類選択フィールドのHTML
  const documentSelectionHTML = `
    <div class="mb-3 id-document-selection">
      <label for="${userType}-document-type" class="form-label" data-i18n="verification.document_type">証明書の種類</label>
      <select class="form-select" id="${userType}-document-type" name="document-type" required>
        <option value="" data-i18n="verification.select_document">選択してください</option>
        <option value="passport" data-i18n="verification.passport">パスポート</option>
        <option value="driverLicense" data-i18n="verification.drivers_license">運転免許証</option>
        <option value="idCard" data-i18n="verification.id_card">マイナンバーカード</option>
        <option value="residentCard" data-i18n="verification.resident_card">在留カード</option>
        <option value="nationalId" data-i18n="verification.national_id">各国ID（National ID）</option>
        <option value="govId" data-i18n="verification.gov_id">政府発行ID</option>
      </select>
    </div>
  `;
  
  // 書類アップロードセクションを作成
  const documentSection = document.createElement('div');
  documentSection.className = 'mb-4 document-verification-section';
  documentSection.style.clear = 'both'; // フロート解除（レイアウト崩れ防止）
  
  if (userType === 'tourist') {
    // 観光客用には既存のフィールドの規定に合わせたシンプルなデザイン
    documentSection.innerHTML = `
      <div class="mb-3">
        <h5 class="mb-3" data-i18n="verification.id_document_title">本人確認書類</h5>
        <div class="alert alert-info mb-3" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          <span data-i18n="verification.id_info">アップロードされた書類は厳重に管理され、確認後に承認されます</span>
        </div>
        ${documentSelectionHTML}
        <div class="mb-3 document-upload-container p-3 border rounded text-center">
          <div id="${userType}-document-upload-prompt">
            <p class="mb-2" data-i18n="verification.upload_document">証明書のアップロード</p>
            <button type="button" class="btn btn-outline-primary" id="${userType}-select-document">
              <i class="bi bi-file-earmark-arrow-up me-1"></i>
              <span data-i18n="verification.select_file">ファイルの選択</span>
            </button>
            <input type="file" class="d-none" id="${userType}-document-file" accept="image/jpeg,image/png,application/pdf">
            <p class="form-text mt-2" data-i18n="verification.document_requirements">JPEG、PNG、PDFのみ。5MB以下。</p>
          </div>
          <div id="${userType}-document-preview" class="d-none">
            <img id="${userType}-document-image" class="img-fluid mb-2" style="max-height: 200px;" alt="プレビュー">
            <div class="mt-2">
              <button type="button" class="btn btn-sm btn-outline-danger" id="${userType}-remove-document">
                <i class="bi bi-trash me-1"></i>
                <span data-i18n="verification.remove">削除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // ガイド用には標準スタイル（証明写真セクションなし）
    documentSection.innerHTML = `
      <h5 class="mb-3" data-i18n="verification.id_document_title">本人確認書類</h5>
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        <span data-i18n="verification.id_info">アップロードされた書類は厳重に管理され、確認後に承認されます</span>
      </div>
      ${documentSelectionHTML}
      <div class="mb-3 document-upload-container p-3 border rounded text-center">
        <div id="${userType}-document-upload-prompt">
          <p class="mb-2" data-i18n="verification.upload_document">証明書のアップロード</p>
          <button type="button" class="btn btn-outline-primary" id="${userType}-select-document">
            <i class="bi bi-file-earmark-arrow-up me-1"></i>
            <span data-i18n="verification.select_file">ファイルの選択</span>
          </button>
          <input type="file" class="d-none" id="${userType}-document-file" accept="image/jpeg,image/png,application/pdf">
          <p class="form-text mt-2" data-i18n="verification.document_requirements">JPEG、PNG、PDFのみ。5MB以下。</p>
        </div>
        <div id="${userType}-document-preview" class="d-none">
          <img id="${userType}-document-image" class="img-fluid mb-2" style="max-height: 200px;" alt="プレビュー">
          <div class="mt-2">
            <button type="button" class="btn btn-sm btn-outline-danger" id="${userType}-remove-document">
              <i class="bi bi-trash me-1"></i>
              <span data-i18n="verification.remove">削除</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  // 観光客と​​ガイドでの挿入位置が異なるため、分岐
  if (userType === 'tourist') {
    try {
      // 既存のID書類アップロードボタンを探す
      const existingUploadBtn = form.querySelector('#tourist-upload-id');
      if (existingUploadBtn) {
        // 既存のボタン要素を非表示にし、その場所に配置
        const btnParent = existingUploadBtn.parentNode;
        if (btnParent) {
          existingUploadBtn.style.display = 'none'; // 既存ボタンを非表示に
          btnParent.insertBefore(documentSection, existingUploadBtn);
          console.log('既存のID書類アップロードボタンの位置に配置しました');
          return; // 成功したので終了
        }
      }
      
      // 代替方法：本人確認書類ラベルを探して配置
      const idDocumentLabel = Array.from(form.querySelectorAll('label')).find(label => 
        label.textContent.includes('本人確認書類') || 
        (label.getAttribute('data-i18n') === 'auth.id_document'));
      
      if (idDocumentLabel) {
        const labelParent = idDocumentLabel.parentNode;
        if (labelParent) {
          // ラベルがある要素の中にフォームを配置
          labelParent.appendChild(documentSection);
          console.log('本人確認書類ラベルの場所に配置しました');
          return; // 成功したので終了
        }
      }
      
      // それでも見つからない場合：規約または送信ボタンの前に
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const submitParent = submitBtn.parentNode;
        // 規約チェックボックスがあれば、その直前に
        const termsCheckbox = form.querySelector('.form-check');
        if (termsCheckbox) {
          // 規約同意チェックボックスの前に配置
          submitParent.insertBefore(documentSection, termsCheckbox);
        } else {
          // 規約がなければ送信ボタンの前に
          submitParent.insertBefore(documentSection, submitBtn);
        }
      } else {
        // フォームの最後に追加
        form.appendChild(documentSection);
      }
    } catch (e) {
      console.error('観光客書類セクション配置エラー:', e);
      // フォームの最後に追加（エラー時のフォールバック）
      form.appendChild(documentSection);
    }
  } else if (userType === 'guide') {
    try {
      // 言語選択の後に挿入
      const languageField = form.querySelector('#guide-languages');
      if (languageField) {
        const parentGroup = languageField.closest('.mb-3') || languageField.parentNode;
        if (parentGroup.nextSibling) {
          parentGroup.parentNode.insertBefore(documentSection, parentGroup.nextSibling);
        } else {
          parentGroup.parentNode.appendChild(documentSection);
        }
      } else {
        // 電話番号認証または住所の後に挿入
        const phoneVerification = form.querySelector('#guide-phone');
        const addressField = form.querySelector('#guide-address');
        const targetField = phoneVerification || addressField;
        
        if (targetField) {
          const parentGroup = targetField.closest('.mb-3') || targetField.parentNode;
          if (parentGroup.nextSibling) {
            parentGroup.parentNode.insertBefore(documentSection, parentGroup.nextSibling);
          } else {
            parentGroup.parentNode.appendChild(documentSection);
          }
        } else {
          // 送信ボタンの前に
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton) {
            submitButton.parentNode.insertBefore(documentSection, submitButton);
          } else {
            form.appendChild(documentSection);
          }
        }
      }
    } catch (e) {
      console.error('ガイド書類セクション配置エラー:', e);
      // フォームの最後に追加（エラー時のフォールバック）
      form.appendChild(documentSection);
    }
  }
  
  console.log(`${userType}用ID書類セクションを追加しました`);
  
  // イベントハンドラを設定
  setupEventHandlers(modal, userType);
}

/**
 * ID書類アップロード関連のイベントハンドラをセットアップ
 * @param {HTMLElement} modal モーダル要素
 * @param {string} userType ユーザータイプ
 */
function setupEventHandlers(modal, userType) {
  // ファイル選択ボタンのハンドラ
  const selectButton = modal.querySelector(`#${userType}-select-document`);
  if (selectButton) {
    // イベントリスナーが既に設定されているか確認
    const clonedButton = selectButton.cloneNode(true);
    selectButton.parentNode.replaceChild(clonedButton, selectButton);
    
    clonedButton.addEventListener('click', function() {
      const fileInput = modal.querySelector(`#${userType}-document-file`);
      if (fileInput) {
        fileInput.click();
      }
    });
  }
  
  // ファイル入力の変更ハンドラ
  const fileInput = modal.querySelector(`#${userType}-document-file`);
  if (fileInput) {
    // イベントリスナーが既に設定されているか確認
    const clonedInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(clonedInput, fileInput);
    
    clonedInput.addEventListener('change', function(e) {
      handleFileSelected(e, userType, modal);
    });
  }
  
  // 削除ボタンのハンドラ
  const removeButton = modal.querySelector(`#${userType}-remove-document`);
  if (removeButton) {
    // イベントリスナーが既に設定されているか確認
    const clonedButton = removeButton.cloneNode(true);
    removeButton.parentNode.replaceChild(clonedButton, removeButton);
    
    clonedButton.addEventListener('click', function() {
      removeSelectedFile(userType, modal);
    });
  }
  
  console.log(`${userType}用ID書類イベントハンドラを設定しました`);
}

/**
 * ファイル選択時の処理
 * @param {Event} e 変更イベント
 * @param {string} userType ユーザータイプ
 * @param {HTMLElement} modal モーダル要素
 */
function handleFileSelected(e, userType, modal) {
  const file = e.target.files[0];
  if (!file) return;
  
  // ファイルサイズチェック (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズが大きすぎます（最大5MB）');
    e.target.value = '';
    return;
  }
  
  // プレビュー要素の取得
  const promptElement = modal.querySelector(`#${userType}-document-upload-prompt`);
  const previewElement = modal.querySelector(`#${userType}-document-preview`);
  const previewImage = modal.querySelector(`#${userType}-document-image`);
  
  if (!promptElement || !previewElement || !previewImage) {
    console.warn('プレビュー要素が見つかりません');
    return;
  }
  
  // ファイルリーダーでプレビュー表示
  const reader = new FileReader();
  reader.onload = function(readerEvent) {
    if (file.type.startsWith('image/')) {
      // 画像の場合は直接表示
      previewImage.src = readerEvent.target.result;
    } else {
      // PDFなどの場合はアイコン表示
      previewImage.src = 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
    }
    
    // 表示切り替え
    promptElement.classList.add('d-none');
    previewElement.classList.remove('d-none');
  };
  
  reader.readAsDataURL(file);
  console.log(`${userType}用：ファイル "${file.name}" が選択されました`);
}

/**
 * 選択されたファイルを削除
 * @param {string} userType ユーザータイプ
 * @param {HTMLElement} modal モーダル要素
 */
function removeSelectedFile(userType, modal) {
  // 要素の取得
  const fileInput = modal.querySelector(`#${userType}-document-file`);
  const promptElement = modal.querySelector(`#${userType}-document-upload-prompt`);
  const previewElement = modal.querySelector(`#${userType}-document-preview`);
  
  // ファイル入力をクリア
  if (fileInput) fileInput.value = '';
  
  // 表示を戻す
  if (promptElement) promptElement.classList.remove('d-none');
  if (previewElement) previewElement.classList.add('d-none');
  
  console.log(`${userType}用：選択されたファイルを削除しました`);
}

// ウィンドウロード完了時にも実行
window.addEventListener('load', function() {
  console.log('ウィンドウロード完了: 統一化されたID書類アップロード処理を初期化');
  initializeAllDocumentUploads();
  
  // 翻訳を追加
  if (window.translations) {
    // 必要な翻訳キーが存在しない場合は追加
    const requiredTranslations = {
      'verification.document_type': {
        ja: '証明書の種類',
        en: 'Document Type'
      },
      'verification.select_document': {
        ja: '選択してください',
        en: 'Select document type'
      },
      'verification.passport': {
        ja: 'パスポート',
        en: 'Passport'
      },
      'verification.drivers_license': {
        ja: '運転免許証',
        en: 'Driver\'s License'
      },
      'verification.id_card': {
        ja: 'マイナンバーカード',
        en: 'ID Card'
      },
      'verification.resident_card': {
        ja: '在留カード',
        en: 'Residence Card'
      },
      'verification.national_id': {
        ja: '各国ID（National ID）',
        en: 'National ID Card'
      },
      'verification.gov_id': {
        ja: '政府発行ID',
        en: 'Government-issued ID'
      },
      'verification.upload_document': {
        ja: '証明書のアップロード',
        en: 'Upload Document'
      },
      'verification.select_file': {
        ja: 'ファイルの選択',
        en: 'Select File'
      },
      'verification.document_requirements': {
        ja: 'JPEG、PNG、PDFのみ。5MB以下。',
        en: 'JPEG, PNG, or PDF only. Max 5MB.'
      },
      'verification.remove': {
        ja: '削除',
        en: 'Remove'
      }
    };
    
    // 現在の言語を取得
    const currentLang = window.currentLanguage || 'ja';
    
    // 不足している翻訳を追加
    for (const key in requiredTranslations) {
      if (!window.translations[key]) {
        window.translations[key] = requiredTranslations[key][currentLang];
      }
    }
  }
});