/**
 * 身分証明書選択ドロップダウンの動作を直接修正するスクリプト
 * モーダル内の選択インターフェースを確実に機能させる
 */
document.addEventListener('DOMContentLoaded', function() {
  // ページ読み込み時に実行
  console.log('ID書類モーダル修正スクリプト初期化...');
  
  // モーダル表示イベントの監視（すべてのモーダルで実行）
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
      setupDocumentSelectors(this);
    });
  });
  
  // 最初の実行
  document.querySelectorAll('.modal').forEach(modal => {
    setupDocumentSelectors(modal);
  });
  
  // 定期的にドキュメントセレクタを確認（動的生成要素対応）
  setInterval(() => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (modal.classList.contains('show')) {
        setupDocumentSelectors(modal);
      }
    });
  }, 1000);
  
  /**
   * モーダル内のすべての書類選択セレクターを設定
   * @param {HTMLElement} modal モーダル要素
   */
  function setupDocumentSelectors(modal) {
    // 1. 国籍選択（日本/海外）
    const countrySelectors = modal.querySelectorAll('select.country-selector, select[id*="country-selector"]');
    countrySelectors.forEach(selector => {
      // すでにイベントが設定されている場合は重複登録を避ける
      if (!selector.dataset.initialized) {
        selector.dataset.initialized = "true";
        
        // イベントリスナを設定
        selector.addEventListener('change', function() {
          handleCountrySelection(this);
        });
        
        // 初期値がある場合は処理を実行
        if (selector.value) {
          handleCountrySelection(selector);
        }
      }
    });
    
    // 2. 書類タイプ選択（パスポート、運転免許証など）
    const documentTypeSelectors = modal.querySelectorAll('select.document-type, select[id*="document-type"]');
    documentTypeSelectors.forEach(selector => {
      if (!selector.dataset.initialized) {
        selector.dataset.initialized = "true";
        
        // イベントリスナを設定
        selector.addEventListener('change', function() {
          handleDocumentTypeSelection(this);
        });
        
        // 初期値がある場合は処理を実行
        if (selector.value) {
          handleDocumentTypeSelection(selector);
        }
      }
    });
  }
  
  /**
   * 国籍選択の処理
   * @param {HTMLSelectElement} selector 国籍選択セレクタ
   */
  function handleCountrySelection(selector) {
    const selectedValue = selector.value;
    const modal = findClosestModal(selector);
    
    if (!modal) return;
    
    // 対応する書類タイプセレクタを探す
    const documentTypeSelector = modal.querySelector('select.document-type, select[id*="document-type"]');
    if (!documentTypeSelector) return;
    
    console.log('国籍選択変更:', selectedValue);
    
    // ドキュメントタイプの選択肢をフィルタリング
    const options = documentTypeSelector.querySelectorAll('option');
    options.forEach(option => {
      const value = option.value;
      if (!value) return; // 空の選択肢（「選択してください」など）は無視
      
      const isJapaneseDocument = value === 'driverLicense' || value === 'mynumber' || value === 'idCard';
      const isInternationalDocument = value === 'passport' || value === 'residenceCard';
      
      if (selectedValue === 'japan') {
        // 日本の場合、国際的な書類を非表示
        option.disabled = !isJapaneseDocument && isInternationalDocument;
        option.style.display = option.disabled ? 'none' : '';
      } else if (selectedValue === 'international') {
        // 海外の場合、日本の書類を非表示
        option.disabled = isJapaneseDocument && !isInternationalDocument;
        option.style.display = option.disabled ? 'none' : '';
      } else {
        // それ以外の場合はすべて表示
        option.disabled = false;
        option.style.display = '';
      }
    });
    
    // 選択をリセット
    documentTypeSelector.selectedIndex = 0;
    
    // すべての書類アップロードセクションを非表示
    hideAllDocumentSections(modal);
  }
  
  /**
   * 書類タイプ選択の処理
   * @param {HTMLSelectElement} selector 書類タイプ選択セレクタ
   */
  function handleDocumentTypeSelection(selector) {
    const selectedValue = selector.value;
    if (!selectedValue) return;
    
    const modal = findClosestModal(selector);
    if (!modal) return;
    
    console.log('書類タイプ選択変更:', selectedValue);
    
    // すべての書類アップロードセクションを非表示
    hideAllDocumentSections(modal);
    
    // 選択された書類タイプに対応するセクションを表示
    let sectionSelector = '';
    
    if (selectedValue === 'passport') {
      sectionSelector = '#passport-upload, .passport-upload';
    } else if (selectedValue === 'driverLicense') {
      sectionSelector = '#license-upload, .license-upload';
    } else if (selectedValue === 'idCard' || selectedValue === 'mynumber') {
      sectionSelector = '#idcard-upload, .idcard-upload';
    } else if (selectedValue === 'residenceCard') {
      sectionSelector = '#residencecard-upload, .residencecard-upload';
    }
    
    if (sectionSelector) {
      const sections = modal.querySelectorAll(sectionSelector);
      sections.forEach(section => {
        section.classList.remove('d-none');
      });
    }
  }
  
  /**
   * すべての書類アップロードセクションを非表示にする
   * @param {HTMLElement} modal モーダル要素
   */
  function hideAllDocumentSections(modal) {
    const sections = modal.querySelectorAll('.document-upload-section');
    sections.forEach(section => {
      section.classList.add('d-none');
    });
  }
  
  /**
   * 最も近いモーダル要素を見つける
   * @param {HTMLElement} element 基点となる要素
   * @returns {HTMLElement|null} モーダル要素
   */
  function findClosestModal(element) {
    let current = element;
    while (current && !current.classList.contains('modal')) {
      current = current.parentElement;
    }
    return current;
  }
});