/**
 * シンプルな書類アップロード水平レイアウト実装
 * - 直接DOMを操作するシンプルな実装です
 * - カメラボタンを削除し、横並びレイアウトを適用します
 */
(function() {
  console.log('書類水平レイアウト: 初期化');
  
  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // モーダル表示時のイベントリスナー
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal && modal.classList.contains('modal')) {
      console.log('書類水平レイアウト: モーダル表示イベント検出');
      setTimeout(function() {
        processModal(modal);
      }, 100);
    }
  });
  
  /**
   * 初期化処理
   */
  function init() {
    console.log('書類水平レイアウト: 初期化実行');
    
    // CSSスタイルの追加
    addStyles();
    
    // 既存モーダルの処理
    document.querySelectorAll('.modal.show').forEach(processModal);
    
    // MutationObserverでDOMの変更を監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.classList && node.classList.contains('modal')) {
              // 新しく追加されたモーダルを処理
              setTimeout(function() {
                processModal(node);
              }, 100);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  /**
   * スタイルの追加
   */
  function addStyles() {
    const style = document.createElement('style');
    style.id = 'horizontalLayoutStyles';
    style.textContent = `
      /* 書類アップロード水平レイアウト */
      .document-row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 15px;
        align-items: stretch;
      }
      
      .document-col {
        flex: 1 1 45%;
        min-width: 250px;
        position: relative;
        padding: 10px;
        border: 1px dashed #dee2e6;
        border-radius: 5px;
      }
      
      .document-label {
        font-weight: 600;
        margin-bottom: 10px;
        color: #495057;
        display: block;
      }
      
      .document-upload-container {
        text-align: center;
        padding: 10px;
      }
      
      .document-preview {
        margin-top: 10px;
        max-width: 100%;
        max-height: 150px;
        display: block;
        margin-left: auto;
        margin-right: auto;
        border: 1px solid #dee2e6;
        border-radius: 4px;
      }
      
      /* レスポンシブ対応 */
      @media (max-width: 768px) {
        .document-row {
          flex-direction: column;
        }
        
        .document-col {
          flex: 1 1 100%;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * モーダルの処理
   */
  function processModal(modal) {
    if (!modal || !modal.classList.contains('modal')) return;
    
    console.log('書類水平レイアウト: モーダル処理開始');
    
    // ドロップダウンセレクタの値を監視
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      select.addEventListener('change', function() {
        setTimeout(function() {
          applyHorizontalLayout(modal);
          removeAllCameraButtons(modal);
        }, 100);
      });
    });
    
    // 初期レイアウト適用
    applyHorizontalLayout(modal);
    
    // カメラボタンの削除
    removeAllCameraButtons(modal);
  }
  
  /**
   * 水平レイアウトの適用
   */
  function applyHorizontalLayout(modal) {
    console.log('書類水平レイアウト: 水平レイアウト適用');
    
    // 運転免許証のセクション（表面と裏面）を探す
    const allFormGroups = modal.querySelectorAll('.form-group, .mb-3');
    
    let frontSection = null;
    let backSection = null;
    
    // フォームグループから表面と裏面のセクションを特定
    allFormGroups.forEach(function(group) {
      const text = group.textContent.toLowerCase();
      if (text.includes('表面') || text.includes('front')) {
        frontSection = group;
      } else if (text.includes('裏面') || text.includes('back')) {
        backSection = group;
      }
    });
    
    // 表裏両方が見つかった場合のみ水平レイアウトを適用
    if (frontSection && backSection) {
      console.log('書類水平レイアウト: 表面と裏面のセクションを検出');
      
      // 既存のレイアウトがあれば削除
      const existingRow = modal.querySelector('.document-row');
      if (existingRow) {
        existingRow.remove();
      }
      
      // 水平レイアウト用の行コンテナを作成
      const rowElement = document.createElement('div');
      rowElement.className = 'document-row';
      
      // 表面カラム
      const frontCol = createDocumentColumn(frontSection, '表面');
      rowElement.appendChild(frontCol);
      
      // 裏面カラム
      const backCol = createDocumentColumn(backSection, '裏面');
      rowElement.appendChild(backCol);
      
      // 元のコンテナの前に挿入
      if (frontSection.parentNode) {
        frontSection.parentNode.insertBefore(rowElement, frontSection);
      }
      
      // 元のフォームグループを非表示に
      frontSection.style.display = 'none';
      backSection.style.display = 'none';
    } else {
      console.log('書類水平レイアウト: 表面と裏面のセクションを検出できませんでした');
    }
  }
  
  /**
   * 書類アップロードカラムの作成
   */
  function createDocumentColumn(originalSection, labelText) {
    const colElement = document.createElement('div');
    colElement.className = 'document-col';
    
    // ラベル
    const labelElement = document.createElement('div');
    labelElement.className = 'document-label';
    labelElement.textContent = `運転免許証（${labelText}）`;
    colElement.appendChild(labelElement);
    
    // アップロードコンテナ
    const uploadContainer = document.createElement('div');
    uploadContainer.className = 'document-upload-container';
    
    // ファイル入力要素をコピー
    const originalInput = originalSection.querySelector('input[type="file"]');
    if (originalInput) {
      const newInput = originalInput.cloneNode(true);
      
      // ファイル選択ボタン
      const fileButton = document.createElement('button');
      fileButton.type = 'button';
      fileButton.className = 'btn btn-outline-primary';
      fileButton.textContent = 'ファイルを選択';
      fileButton.onclick = function() {
        newInput.click();
      };
      uploadContainer.appendChild(fileButton);
      
      // ファイル名表示
      const fileNameDisplay = document.createElement('div');
      fileNameDisplay.className = 'file-name mt-2 text-muted';
      fileNameDisplay.textContent = 'ファイルが選択されていません';
      uploadContainer.appendChild(fileNameDisplay);
      
      // 隠しファイル入力
      newInput.style.display = 'none';
      newInput.addEventListener('change', function(e) {
        const fileName = e.target.files[0] ? e.target.files[0].name : 'ファイルが選択されていません';
        fileNameDisplay.textContent = fileName;
        
        // プレビュー表示
        if (e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = function(e) {
            let preview = uploadContainer.querySelector('.document-preview');
            if (!preview) {
              preview = document.createElement('img');
              preview.className = 'document-preview';
              uploadContainer.appendChild(preview);
            }
            preview.src = e.target.result;
            preview.style.display = 'block';
          };
          reader.readAsDataURL(e.target.files[0]);
          
          // 元のファイル入力にも設定
          originalInput.files = newInput.files;
          const changeEvent = new Event('change', { bubbles: true });
          originalInput.dispatchEvent(changeEvent);
        }
      });
      
      uploadContainer.appendChild(newInput);
    }
    
    colElement.appendChild(uploadContainer);
    
    return colElement;
  }
  
  /**
   * すべてのカメラボタンを削除
   */
  function removeAllCameraButtons(container) {
    // カメラテキストを含むボタンを探して削除
    container.querySelectorAll('button').forEach(function(button) {
      const text = button.textContent.trim().toLowerCase();
      if (text.includes('カメラ') || text.includes('撮影') || text.includes('camera')) {
        console.log('書類水平レイアウト: カメラボタンを削除:', text);
        button.remove();
      }
    });
    
    // カメラクラスを持つ要素を削除
    container.querySelectorAll('.camera-button, .btn-camera').forEach(function(el) {
      el.remove();
    });
    
    // カメラアイコンを持つボタンを削除
    container.querySelectorAll('button i.bi-camera, button i.fa-camera').forEach(function(icon) {
      const button = icon.closest('button');
      if (button) {
        button.remove();
      }
    });
  }
})();