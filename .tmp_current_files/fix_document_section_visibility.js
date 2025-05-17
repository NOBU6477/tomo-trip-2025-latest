/**
 * 身分証明書書類セクションの可視性を制御するスクリプト
 * 選択肢が「日本」「海外」のセレクターも対応
 */
document.addEventListener('DOMContentLoaded', function() {
  // ID書類選択イベントの設定
  setupDocumentTypeEvents();

  function setupDocumentTypeEvents() {
    // 最初のドロップダウン（日本/海外）
    const countrySelectors = document.querySelectorAll('select[id*="country-selector"], select.country-selector');
    countrySelectors.forEach(selector => {
      selector.addEventListener('change', function() {
        const selectedValue = this.value;
        const modalBody = findModalBody(this);

        if (modalBody) {
          // 日本/海外に基づいて表示する書類タイプを変更
          toggleDocumentTypeOptions(selectedValue, modalBody);
        }
      });
    });

    // すべての書類タイプセレクター（パスポート、運転免許証など）
    const documentTypeSelects = document.querySelectorAll('select[id*="document-type"], select.document-type');
    documentTypeSelects.forEach(select => {
      select.addEventListener('change', function() {
        const selectedValue = this.value;
        const modalBody = findModalBody(this);

        if (modalBody) {
          // すべての書類アップロードセクションを非表示
          hideAllDocumentSections(modalBody);

          // 選択された書類タイプに合わせてアップロードセクションを表示
          showSelectedDocumentSection(selectedValue, modalBody);
        }
      });

      // 初期状態で選択されている場合は適切なセクションを表示
      if (select.value) {
        const modalBody = findModalBody(select);
        if (modalBody) {
          showSelectedDocumentSection(select.value, modalBody);
        }
      }
    });
  }

  function findModalBody(element) {
    let current = element;
    while (current && !current.classList.contains('modal-body') && !current.classList.contains('card')) {
      current = current.parentElement;
    }
    return current;
  }

  function toggleDocumentTypeOptions(countryType, modalBody) {
    const documentTypeSelect = modalBody.querySelector('select[id*="document-type"], select.document-type');
    if (!documentTypeSelect) return;

    // すべてのオプションをいったん有効化
    Array.from(documentTypeSelect.options).forEach(option => {
      option.disabled = false;
      option.style.display = '';
    });

    // オプショングループがある場合
    const optgroups = documentTypeSelect.querySelectorAll('optgroup');
    if (optgroups.length > 0) {
      optgroups.forEach(group => {
        const isJapan = group.label.includes('日本');
        if ((countryType === 'japan' && isJapan) || (countryType === 'international' && !isJapan)) {
          // 選択した国のグループを有効化
          Array.from(group.options).forEach(option => {
            option.disabled = false;
            option.style.display = '';
          });
        } else {
          // 選択していない国のグループを無効化
          Array.from(group.options).forEach(option => {
            option.disabled = true;
            option.style.display = 'none';
          });
        }
      });
    } else {
      // オプショングループがない場合は直接オプションを処理
      Array.from(documentTypeSelect.options).forEach(option => {
        const value = option.value;
        if (!value) return; // 空の選択肢は無視

        const isJapanDocument = value.includes('driverLicense') || value.includes('mynumber');
        const isIntlDocument = value.includes('passport') || value.includes('residenceCard');

        if ((countryType === 'japan' && !isJapanDocument && isIntlDocument) || 
            (countryType === 'international' && isJapanDocument && !isIntlDocument)) {
          option.disabled = true;
          option.style.display = 'none';
        }
      });
    }

    // 選択をリセット
    documentTypeSelect.selectedIndex = 0;
    
    // すべての書類アップロードセクションを非表示
    hideAllDocumentSections(modalBody);
  }

  function hideAllDocumentSections(modalBody) {
    const sections = modalBody.querySelectorAll('.document-upload-section');
    sections.forEach(section => {
      section.classList.add('d-none');
    });
  }

  function showSelectedDocumentSection(documentType, modalBody) {
    if (!documentType || documentType === '') return;

    // 選択されたセクションを表示
    let sectionId = '';
    
    if (documentType.includes('passport')) {
      sectionId = 'passport-upload';
    } else if (documentType.includes('driverLicense')) {
      sectionId = 'license-upload';
    } else if (documentType.includes('mynumber') || documentType.includes('idCard')) {
      sectionId = 'idcard-upload';
    } else if (documentType.includes('residenceCard')) {
      sectionId = 'residencecard-upload';
    }
    
    if (sectionId) {
      const section = modalBody.querySelector('#' + sectionId + ', .' + sectionId);
      if (section) {
        section.classList.remove('d-none');
      }
    }
  }

  // 直接処理を実行（DOMContentLoadedを待たずに）
  // すべてのドキュメントタイプセレクターの初期化
  const allDocumentTypeSelects = document.querySelectorAll('select[id*="document-type"], select.document-type');
  allDocumentTypeSelects.forEach(select => {
    if (select.value) {
      const modalBody = findModalBody(select);
      if (modalBody) {
        showSelectedDocumentSection(select.value, modalBody);
      }
    }
  });

  // モーダル表示時にトリガーを追加
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
      setupDocumentTypeEvents(); // モーダル表示時にイベントを再度設定
      
      const documentTypeSelects = this.querySelectorAll('select[id*="document-type"], select.document-type');
      documentTypeSelects.forEach(select => {
        if (select.value) {
          const modalBody = findModalBody(select);
          showSelectedDocumentSection(select.value, modalBody);
        }
      });
    });
  });
});