// モーダルの表示スタイルを修正するスクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('モーダルスタイルの修正スクリプトを実行します');
  
  // z-indexの問題を修正するためのスタイル追加
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      z-index: 1050 !important;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .modal-backdrop {
      z-index: 1040 !important;
    }
    body.modal-open {
      overflow: visible;
      padding-right: 0 !important;
    }
    .modal-content {
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-dialog-centered {
      display: flex;
      align-items: center;
      min-height: calc(100% - 1rem);
    }
    
    /* モーダル内のスクロール改善 */
    #idDocumentModal .modal-body {
      max-height: 60vh;
      overflow-y: auto;
    }
    
    /* チェックボックスのスタイル修正 */
    #id-document-form .form-check {
      margin-bottom: 15px;
    }
    
    /* アップロードボタンのスタイル改善 */
    .document-upload-container {
      border: 2px dashed #dee2e6;
      border-radius: 6px;
      transition: border-color 0.2s;
    }
    .document-upload-container:hover {
      border-color: #007bff;
    }
    
    /* 選択ボタンのデザイン改善 */
    #select-document, #select-document-front, #select-document-back {
      margin-top: 8px;
    }
  `;
  document.head.appendChild(style);
  
  // モーダルイベントの補正関数
  function fixModalBehavior() {
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach(modal => {
      modal.addEventListener('shown.bs.modal', function() {
        console.log('モーダルが表示されました:', this.id);
        // Bootstrapのバグ修正: モーダル表示時にスクロールバーが消える問題
        document.body.classList.add('modal-open');
        
        // Featherアイコンを再描画
        if (window.feather) {
          window.feather.replace();
        }
      });
      
      modal.addEventListener('hidden.bs.modal', function() {
        // 他のモーダルが開いていない場合のみbody classを削除
        if (document.querySelector('.modal.show') === null) {
          document.body.classList.remove('modal-open');
        }
      });
    });
  }
  
  // DOMの変更を検知してモーダルイベントを修正
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        fixModalBehavior();
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 初期化時に一度実行
  fixModalBehavior();
});
