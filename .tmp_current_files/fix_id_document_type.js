/**
 * 身分証明書の種類選択時の処理を改善するスクリプト
 * ドロップダウン選択後に適切な書類アップロードセクションを表示
 */
document.addEventListener('DOMContentLoaded', function() {
  // 身分証明書タイプ選択ドロップダウン
  const documentTypeSelectors = document.querySelectorAll('select[id*="document-type"]');
  
  documentTypeSelectors.forEach(selector => {
    // 変更イベントの監視
    selector.addEventListener('change', function() {
      showDocumentUploadSection(this.value, this);
    });
  });
  
  /**
   * 選択された身分証明書タイプに基づいて適切なアップロードセクションを表示
   * @param {string} docType 選択された身分証明書タイプ
   * @param {HTMLElement} selector セレクト要素
   */
  function showDocumentUploadSection(docType, selector) {
    if (!docType) return;
    
    // 親コンテナを探す
    let container = selector.closest('.modal-body') || selector.closest('.card');
    if (!container) return;
    
    // すべてのアップロードセクションを非表示
    const allSections = container.querySelectorAll('.document-upload-section');
    allSections.forEach(section => {
      section.classList.add('d-none');
    });
    
    // 選択されたタイプに対応するセクションを表示
    let sectionId = '';
    
    if (docType.includes('passport')) {
      sectionId = 'passport-upload';
    } else if (docType.includes('driverLicense')) {
      sectionId = 'license-upload';
    } else if (docType.includes('mynumber') || docType.includes('idCard')) {
      sectionId = 'idcard-upload';
    } else if (docType.includes('residenceCard')) {
      sectionId = 'residencecard-upload';
    }
    
    if (sectionId) {
      const targetSection = container.querySelector(`#${sectionId}`);
      if (targetSection) {
        targetSection.classList.remove('d-none');
      }
    }
  }
  
  // 初期化時にすでに値が選択されている場合の処理
  documentTypeSelectors.forEach(selector => {
    if (selector.value) {
      showDocumentUploadSection(selector.value, selector);
    }
  });
});