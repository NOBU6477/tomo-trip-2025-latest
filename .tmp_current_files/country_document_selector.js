/**
 * 国籍と身分証明書タイプの選択を直接制御するシンプルなスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('国籍・書類選択処理を初期化します');
  
  // モーダルが表示されたときにセレクターを設定
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
      setupCountryDocumentSelectors(this);
    });
  });
  
  // ページ読み込み時に初期化
  document.querySelectorAll('.modal').forEach(modal => {
    setupCountryDocumentSelectors(modal);
  });
  
  /**
   * モーダル内の国籍・書類選択セレクターを設定
   */
  function setupCountryDocumentSelectors(modal) {
    // 国籍セレクタを取得
    const countrySelector = modal.querySelector('#guide-country-selector, .country-selector');
    const documentTypeSelector = modal.querySelector('#guide-document-type, .document-type');
    
    if (!countrySelector || !documentTypeSelector) {
      return;
    }
    
    console.log('国籍・書類セレクターを設定します');
    
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
        
        const isJapaneseDocument = option.value === 'driverLicense' || option.value === 'idCard';
        const isIntlDocument = option.value === 'passport' || option.value === 'residenceCard';
        
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
      hideAllDocumentSections(modal);
    });
    
    // 書類タイプ選択の変更イベント
    documentTypeSelector.addEventListener('change', function() {
      const selectedType = this.value;
      console.log('書類タイプ選択:', selectedType);
      
      // 全ての書類アップロードセクションを非表示
      hideAllDocumentSections(modal);
      
      // 選択された書類タイプに対応するセクションを表示
      showDocumentSection(modal, selectedType);
    });
    
    // 初期値が選択されている場合は処理を実行
    if (documentTypeSelector.value) {
      showDocumentSection(modal, documentTypeSelector.value);
    }
  }
  
  /**
   * 全ての書類アップロードセクションを非表示
   */
  function hideAllDocumentSections(modal) {
    const sections = modal.querySelectorAll('.document-upload-section');
    sections.forEach(section => {
      section.classList.add('d-none');
    });
  }
  
  /**
   * 指定した書類タイプのアップロードセクションを表示
   */
  function showDocumentSection(modal, documentType) {
    if (!documentType) return;
    
    let sectionId = '';
    
    // 観光客モーダルかガイドモーダルかを判断
    const isTouristModal = modal.id === 'registerTouristModal' || modal.querySelector('#tourist-country-selector');
    const prefix = isTouristModal ? 'tourist-' : '';
    
    if (documentType.includes('passport')) {
      sectionId = prefix + 'passport-upload';
    } else if (documentType.includes('driverLicense')) {
      sectionId = prefix + 'driverLicense-upload';
    } else if (documentType.includes('idCard') || documentType.includes('mynumber')) {
      sectionId = prefix + 'idCard-upload';
    } else if (documentType.includes('residenceCard')) {
      sectionId = prefix + 'residenceCard-upload';
    }
    
    console.log('表示する書類セクション:', sectionId);
    
    if (sectionId) {
      const section = modal.querySelector('#' + sectionId);
      if (section) {
        section.classList.remove('d-none');
      } else {
        console.log('セクションが見つかりませんでした:', sectionId);
      }
    }
  }
});