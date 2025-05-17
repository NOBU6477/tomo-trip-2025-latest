/**
 * ID書類アップロードフォームの選択肢を修正する
 * すべての登録フォームに書類タイプ選択肢を一貫して提供
 */
document.addEventListener('DOMContentLoaded', function() {
  // モーダルの監視設定
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('shown.bs.modal', function() {
      checkAndFixDocumentForms(modal);
    });
  });

  // 最初の実行（ページロード時）
  document.querySelectorAll('.modal').forEach(modal => {
    checkAndFixDocumentForms(modal);
  });
  
  function checkAndFixDocumentForms(modal) {
    // 観光客モーダルかガイドモーダルか判定
    const isTouristModal = modal.id.includes('tourist');
    const isGuideModal = modal.id.includes('guide');
    
    if (isTouristModal) {
      addDocumentSelectionToTouristModal(modal);
    } else if (isGuideModal) {
      addDocumentSelectionToGuideModal(modal);
    }
    
    // 書類タイプセレクトの選択リスナーを設定
    const documentTypeSelects = modal.querySelectorAll('select[id*="document-type"], select.document-type');
    documentTypeSelects.forEach(select => {
      // 既存のイベントを削除して再設定（重複回避）
      const newSelect = select.cloneNode(true);
      select.parentNode.replaceChild(newSelect, select);
      
      newSelect.addEventListener('change', function() {
        updateIdDocumentSections(this);
      });
      
      // 初期選択状態を反映
      if (newSelect.value) {
        updateIdDocumentSections(newSelect);
      }
    });
  }
  
  function addDocumentSelectionToTouristModal(modal) {
    // 書類選択セクションがすでに存在するか確認
    const existingSelect = modal.querySelector('select[id*="document-type"], select.document-type');
    if (existingSelect) return;
    
    // 身分証明書セクションを探す
    const idDocumentSection = modal.querySelector('.id-document-section');
    if (!idDocumentSection) return;
    
    // 書類タイプセレクトがなければ追加
    const documentTypeFormGroup = document.createElement('div');
    documentTypeFormGroup.className = 'mb-3';
    documentTypeFormGroup.innerHTML = `
      <label for="tourist-document-type" class="form-label">書類の種類</label>
      <select class="form-select document-type" id="tourist-document-type">
        <option value="" selected>書類の種類を選択してください</option>
        <option value="passport">パスポート</option>
        <option value="driverLicense">運転免許証</option>
        <option value="idCard">マイナンバーカード</option>
        <option value="residenceCard">在留カード</option>
      </select>
    `;
    
    // 最初の子要素として挿入
    if (idDocumentSection.firstChild) {
      idDocumentSection.insertBefore(documentTypeFormGroup, idDocumentSection.firstChild);
    } else {
      idDocumentSection.appendChild(documentTypeFormGroup);
    }
  }
  
  function addDocumentSelectionToGuideModal(modal) {
    // 書類選択セクションがすでに存在するか確認
    const existingSelect = modal.querySelector('select[id*="document-type"], select.document-type');
    if (existingSelect) return;
    
    // 身分証明書セクションを探す
    const idDocumentSection = modal.querySelector('.id-document-section');
    if (!idDocumentSection) return;
    
    // 書類タイプセレクトがなければ追加
    const documentTypeFormGroup = document.createElement('div');
    documentTypeFormGroup.className = 'mb-3';
    documentTypeFormGroup.innerHTML = `
      <label for="guide-document-type" class="form-label">書類の種類</label>
      <select class="form-select document-type" id="guide-document-type">
        <option value="" selected>書類の種類を選択してください</option>
        <option value="passport">パスポート</option>
        <option value="driverLicense">運転免許証</option>
        <option value="idCard">マイナンバーカード</option>
        <option value="residenceCard">在留カード</option>
      </select>
    `;
    
    // 最初の子要素として挿入
    if (idDocumentSection.firstChild) {
      idDocumentSection.insertBefore(documentTypeFormGroup, idDocumentSection.firstChild);
    } else {
      idDocumentSection.appendChild(documentTypeFormGroup);
    }
  }
  
  function updateIdDocumentSections(selectElement) {
    const selectedValue = selectElement.value;
    if (!selectedValue) return;
    
    // 親モーダルを探す
    let modal = selectElement.closest('.modal');
    if (!modal) return;
    
    // すべての書類アップロードセクションを非表示
    const sections = modal.querySelectorAll('.document-upload-section');
    sections.forEach(section => {
      section.classList.add('d-none');
    });
    
    // 選択された書類タイプに対応するセクションを表示
    let sectionId = '';
    
    if (selectedValue.includes('passport')) {
      sectionId = 'passport-upload';
    } else if (selectedValue.includes('driverLicense')) {
      sectionId = 'license-upload';
    } else if (selectedValue.includes('mynumber') || selectedValue.includes('idCard')) {
      sectionId = 'idcard-upload';
    } else if (selectedValue.includes('residenceCard')) {
      sectionId = 'residencecard-upload';
    }
    
    if (sectionId) {
      const section = modal.querySelector('#' + sectionId + ', .' + sectionId);
      if (section) {
        section.classList.remove('d-none');
      }
    }
  }
});