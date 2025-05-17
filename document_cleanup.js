/**
 * 書類セクションクリーンアップスクリプト
 * 既存の書類表示セクションを削除し、二重表示を防止する
 */
(function() {
  console.log('書類クリーンアップ: 初期化中...');
  
  // DOMContentLoadedイベントで実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupDocumentSections);
  } else {
    cleanupDocumentSections();
  }
  
  // DOM変更監視
  const observer = new MutationObserver(function(mutations) {
    let shouldCleanup = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // モーダルが追加されたかチェック
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList && (
                node.classList.contains('modal') || 
                node.classList.contains('modal-dialog') ||
                node.classList.contains('modal-content')
            )) {
              shouldCleanup = true;
              break;
            }
          }
        }
      }
    });
    
    if (shouldCleanup) {
      console.log('書類クリーンアップ: 新しいモーダルを検出。クリーンアップを実行します。');
      setTimeout(cleanupDocumentSections, 300);
    }
  });
  
  // ドキュメント全体を監視
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 定期的に実行
  setInterval(cleanupDocumentSections, 3000);
  
  // 書類セクションのクリーンアップ
  function cleanupDocumentSections() {
    console.log('書類クリーンアップ: 不要なセクションを探しています...');
    
    // 1. 古い形式のマイナンバーカード・運転免許証セクションを削除
    const oldSections = document.querySelectorAll(
      '#idcard-section, .idcard-section, #license-section, .license-section, ' +
      '#passport-section, .passport-section, #manual-mynumber-section, #manual-license-section, ' +
      '[id$="-section"]:not(.document-upload-section)'
    );
    
    if (oldSections.length > 0) {
      console.log(`書類クリーンアップ: ${oldSections.length}個の古いセクションを削除します`);
      
      oldSections.forEach(section => {
        // 統合アップローダーのセクションは削除しない
        if (!section.classList.contains('document-upload-section')) {
          section.remove();
        }
      });
    }
    
    // 2. 二重に表示されている場合は古いほうを削除
    const documentContainers = document.querySelectorAll('.modal-body, .modal-content, form');
    
    documentContainers.forEach(container => {
      const idcardSections = container.querySelectorAll('[data-type="idcard"]');
      const licenseSections = container.querySelectorAll('[data-type="license"]');
      const passportSections = container.querySelectorAll('[data-type="passport"]');
      
      // マイナンバーカードセクションが複数ある場合
      if (idcardSections.length > 1) {
        console.log(`書類クリーンアップ: マイナンバーカードセクションが${idcardSections.length}個あります。古いものを削除します。`);
        
        // 最新のもの以外を削除
        for (let i = 0; i < idcardSections.length - 1; i++) {
          idcardSections[i].remove();
        }
      }
      
      // 運転免許証セクションが複数ある場合
      if (licenseSections.length > 1) {
        console.log(`書類クリーンアップ: 運転免許証セクションが${licenseSections.length}個あります。古いものを削除します。`);
        
        // 最新のもの以外を削除
        for (let i = 0; i < licenseSections.length - 1; i++) {
          licenseSections[i].remove();
        }
      }
      
      // パスポートセクションが複数ある場合
      if (passportSections.length > 1) {
        console.log(`書類クリーンアップ: パスポートセクションが${passportSections.length}個あります。古いものを削除します。`);
        
        // 最新のもの以外を削除
        for (let i = 0; i < passportSections.length - 1; i++) {
          passportSections[i].remove();
        }
      }
    });
    
    // 3. 手動追加部分を削除
    cleanupManualElements();
  }
  
  // 手動追加された要素のクリーンアップ
  function cleanupManualElements() {
    // ファイル選択UIの下にある直接追加されたボタンなど
    const manualButtons = document.querySelectorAll('.my-card-buttons:not(.document-upload-section *)');
    if (manualButtons.length > 0) {
      console.log(`書類クリーンアップ: ${manualButtons.length}個の余分なボタン領域を削除します`);
      manualButtons.forEach(button => button.remove());
    }
    
    // フォールバック入力
    const fallbackInputs = document.querySelectorAll('input[id$="_fallback"]');
    fallbackInputs.forEach(input => {
      // 対応する元の入力があれば表示
      const originalId = input.id.replace('_fallback', '');
      const originalInput = document.getElementById(originalId);
      if (originalInput) {
        originalInput.style.display = '';
      }
    });
  }
})();