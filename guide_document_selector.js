/**
 * ガイド登録フォーム用の国籍と書類タイプ選択スクリプト
 * シンプルなバージョンで、既存の身分証明書セクションに統合
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド登録フォーム用書類選択処理を初期化します');
  
  // ガイド登録フォームの要素を取得
  const guideRegisterForm = document.getElementById('register-guide-form');
  if (!guideRegisterForm) return;

  // 国籍セレクタと書類タイプセレクタを取得
  const countrySelector = guideRegisterForm.querySelector('#guide-country-selector, .country-selector');
  const documentTypeSelector = guideRegisterForm.querySelector('#guide-document-type, .document-type');
  
  if (!countrySelector || !documentTypeSelector) {
    console.log('ガイド登録フォームの国籍・書類セレクタが見つかりません');
    return;
  }
  
  console.log('ガイド登録フォームの国籍・書類セレクタを設定します');
  
  // 国籍選択の変更イベント
  countrySelector.addEventListener('change', function() {
    const selectedCountry = this.value;
    console.log('国籍選択:', selectedCountry);
    
    // 全ての書類種類オプションを一度表示
    const options = documentTypeSelector.querySelectorAll('option');
    options.forEach(option => {
      option.style.display = '';
    });
    
    // 表示する書類タイプをフィルタリング
    options.forEach(option => {
      if (!option.value) return; // 「選択してください」はスキップ
      
      const isJapaneseDocument = option.classList.contains('japan-doc');
      const isIntlDocument = option.classList.contains('intl-doc');
      
      if (selectedCountry === 'japan') {
        // 日本の場合、日本の書類と国際パスポートを表示
        if (!isJapaneseDocument && option.value !== 'passport') {
          option.style.display = 'none';
        }
      } else if (selectedCountry === 'international') {
        // 海外の場合、パスポートと在留カードのみ表示
        if (!isIntlDocument) {
          option.style.display = 'none';
        }
      }
    });
    
    // 選択をリセット
    documentTypeSelector.selectedIndex = 0;
    
    // 書類アップロードセクションを全て非表示
    hideAllDocumentSections();
  });
  
  // 書類タイプ選択の変更イベント
  documentTypeSelector.addEventListener('change', function() {
    const selectedType = this.value;
    console.log('書類タイプ選択:', selectedType);
    
    // 全ての書類アップロードセクションを非表示
    hideAllDocumentSections();
    
    // 選択された書類タイプに対応するセクションを表示
    showDocumentSection(selectedType);
  });
  
  // 初期値が選択されている場合は処理を実行
  if (documentTypeSelector.value) {
    showDocumentSection(documentTypeSelector.value);
  }
  
  /**
   * 全ての書類アップロードセクションを非表示
   */
  function hideAllDocumentSections() {
    const sections = guideRegisterForm.querySelectorAll('.document-upload-section');
    sections.forEach(section => {
      section.classList.add('d-none');
    });
  }
  
  /**
   * 指定した書類タイプのアップロードセクションを表示
   */
  function showDocumentSection(documentType) {
    if (!documentType) return;
    
    let sectionId = '';
    
    if (documentType === 'passport') {
      sectionId = 'passport-upload';
    } else if (documentType === 'driverLicense') {
      sectionId = 'license-upload';
    } else if (documentType === 'idCard') {
      sectionId = 'idCard-upload';
    } else if (documentType === 'residenceCard') {
      sectionId = 'residenceCard-upload';
    }
    
    console.log('表示する書類セクション:', sectionId);
    
    if (sectionId) {
      const section = guideRegisterForm.querySelector('#' + sectionId);
      if (section) {
        section.classList.remove('d-none');
      } else {
        console.log('セクションが見つかりませんでした:', sectionId);
      }
    }
  }
  
  // ファイル入力の処理
  guideRegisterForm.querySelectorAll('input[type="file"]').forEach(fileInput => {
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const fileId = this.id;
        let previewId = fileId.replace('-input', '-preview');
        let previewImageId = fileId.replace('-input', '-image');
        let promptId = fileId.replace('-input', '-prompt');
        let removeBtn = this.closest('.col-md-8').querySelector('.document-remove');
        
        console.log('ファイル選択:', fileId, this.files[0].name);
        
        // プレビュー表示
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.getElementById(previewId);
          const previewImage = document.getElementById(previewImageId);
          const prompt = document.getElementById(promptId);
          
          if (preview && previewImage && prompt) {
            previewImage.src = e.target.result;
            preview.classList.remove('d-none');
            prompt.classList.add('d-none');
            
            if (removeBtn) {
              removeBtn.classList.remove('d-none');
            }
          }
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  });
  
  // 削除ボタンの処理
  guideRegisterForm.querySelectorAll('.document-remove').forEach(removeBtn => {
    removeBtn.addEventListener('click', function() {
      const container = this.closest('.row');
      if (!container) return;
      
      const fileInput = container.querySelector('input[type="file"]');
      if (!fileInput) return;
      
      fileInput.value = '';
      
      const fileId = fileInput.id;
      let previewId = fileId.replace('-input', '-preview');
      let promptId = fileId.replace('-input', '-prompt');
      
      const preview = document.getElementById(previewId);
      const prompt = document.getElementById(promptId);
      
      if (preview && prompt) {
        preview.classList.add('d-none');
        prompt.classList.remove('d-none');
      }
      
      this.classList.add('d-none');
    });
  });
  
  console.log('ガイド登録フォーム書類選択処理の初期化が完了しました');
});