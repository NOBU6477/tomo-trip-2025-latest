/**
 * 書類アップロード画面の水平レイアウト適用と「カメラで撮影」ボタン削除スクリプト
 */
(function() {
  console.log('書類水平レイアウト適用: 初期化');
  
  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHorizontalLayout);
  } else {
    initHorizontalLayout();
  }
  
  // 新しいモーダルが開かれたときにも適用
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (isDocumentModal(modal)) {
      applyHorizontalLayout(modal);
      removeAllCameraButtons(modal);
    }
  });
  
  /**
   * 水平レイアウトの初期化
   */
  function initHorizontalLayout() {
    // 既存のモーダルをチェック
    document.querySelectorAll('.modal').forEach(modal => {
      if (isDocumentModal(modal) && isModalVisible(modal)) {
        console.log('書類水平レイアウト適用: 既存のモーダルを検出');
        applyHorizontalLayout(modal);
        removeAllCameraButtons(modal);
      }
    });
    
    // カメラ関連のスクリプト機能を無効化
    disableCameraFunctions();
  }
  
  /**
   * モーダルが書類関連かどうかを判定
   */
  function isDocumentModal(modal) {
    if (!modal) return false;
    
    // タイトルをチェック
    const title = modal.querySelector('.modal-title');
    if (title && (
        title.textContent.includes('書類') || 
        title.textContent.includes('アップロード') ||
        title.textContent.includes('証明') ||
        title.textContent.includes('ガイド登録')
    )) {
      return true;
    }
    
    // 書類セレクタがあるか確認
    const docSelector = modal.querySelector('select[name="document_type"], select[id="document-type"]');
    if (docSelector) {
      return true;
    }
    
    // アップロード関連のフィールドがあるか確認
    const uploadFields = modal.querySelectorAll('input[type="file"]');
    if (uploadFields.length > 0) {
      return true;
    }
    
    return false;
  }
  
  /**
   * モーダルが表示されているかどうかを判定
   */
  function isModalVisible(modal) {
    return modal.classList.contains('show') && modal.style.display !== 'none';
  }
  
  /**
   * 水平レイアウトを適用
   */
  function applyHorizontalLayout(modal) {
    // ドキュメントタイプセレクタのイベントリスナーを設定
    const docSelector = modal.querySelector('select[name="document_type"], select[id="document-type"]');
    if (docSelector) {
      docSelector.removeEventListener('change', handleDocumentTypeChange);
      docSelector.addEventListener('change', handleDocumentTypeChange);
      
      // 初期状態も適用
      handleDocumentTypeChange.call(docSelector);
    }
    
    // 既存のプレビュー表示を水平レイアウトに変更
    updatePreviewLayout(modal);
  }
  
  /**
   * ドキュメントタイプ変更時の処理
   */
  function handleDocumentTypeChange() {
    const modal = this.closest('.modal');
    if (!modal) return;
    
    const selectedValue = this.value.toLowerCase();
    
    // 運転免許証の場合に特別な処理
    if (selectedValue.includes('運転') || selectedValue.includes('license')) {
      setDualPhotoLayout(modal);
    }
    
    // すべてのカメラボタンを削除
    removeAllCameraButtons(modal);
    
    // 水平レイアウトを適用
    updatePreviewLayout(modal);
  }
  
  /**
   * プレビュー表示のレイアウトを水平に更新
   */
  function updatePreviewLayout(modal) {
    // プレビュー画像を含むコンテナを探す
    const previewContainers = modal.querySelectorAll('.preview-container');
    if (previewContainers.length === 0) return;
    
    // 水平表示用のスタイルを追加
    const horizontalStyle = document.createElement('style');
    horizontalStyle.textContent = `
      .horizontal-preview-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 15px;
        justify-content: space-between;
      }
      
      .horizontal-preview-col {
        flex: 0 0 48%;  /* 少し余白を残す */
        position: relative;
      }
      
      .horizontal-preview-col img {
        width: 100%;
        height: auto;
        border-radius: 4px;
        border: 1px solid #dee2e6;
        object-fit: contain;
      }
      
      .horizontal-preview-col .file-label {
        font-size: 0.85rem;
        margin-bottom: 5px;
        color: #495057;
      }
      
      .horizontal-preview-col .btn-remove {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 10;
      }
      
      .document-upload-row {
        display: flex;
        gap: 15px;
      }
      
      .document-upload-col {
        flex: 1;
      }
      
      @media (max-width: 768px) {
        .horizontal-preview-row {
          flex-direction: column;
        }
        
        .horizontal-preview-col {
          flex: 0 0 100%;
          margin-bottom: 10px;
        }
        
        .document-upload-row {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(horizontalStyle);
    
    // 画像が2つ以上ある場合は水平レイアウトに変更
    if (previewContainers.length >= 2) {
      // 親コンテナを見つける
      const parentContainer = previewContainers[0].parentElement;
      if (!parentContainer) return;
      
      // 新しい行コンテナを作成（既存の場合は再利用）
      let rowContainer = parentContainer.querySelector('.horizontal-preview-row');
      if (!rowContainer) {
        rowContainer = document.createElement('div');
        rowContainer.className = 'horizontal-preview-row';
        parentContainer.appendChild(rowContainer);
      } else {
        rowContainer.innerHTML = '';
      }
      
      // 各プレビューを水平に配置
      Array.from(previewContainers).forEach((container, index) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'horizontal-preview-col';
        
        // ラベルを追加
        const label = document.createElement('div');
        label.className = 'file-label';
        label.textContent = index === 0 ? '表面' : '裏面';
        colDiv.appendChild(label);
        
        // 画像を移動
        const img = container.querySelector('img');
        if (img) {
          colDiv.appendChild(img.cloneNode(true));
        }
        
        // 削除ボタンを追加
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-sm btn-danger btn-remove';
        removeBtn.innerHTML = '<i class="bi bi-x"></i>';
        removeBtn.onclick = function() {
          // 削除機能を実装
          const relatedInput = findRelatedFileInput(container);
          if (relatedInput) {
            relatedInput.value = '';
          }
          colDiv.querySelector('img').src = '';
          colDiv.querySelector('img').style.display = 'none';
        };
        colDiv.appendChild(removeBtn);
        
        rowContainer.appendChild(colDiv);
        
        // 元のコンテナは非表示に
        container.style.display = 'none';
      });
    } else {
      // 1つだけの場合は単独で表示
      previewContainers.forEach(container => {
        container.style.display = 'block';
      });
    }
  }
  
  /**
   * 関連するファイル入力を見つける
   */
  function findRelatedFileInput(previewContainer) {
    const formGroup = previewContainer.closest('.form-group, .mb-3');
    if (formGroup) {
      return formGroup.querySelector('input[type="file"]');
    }
    return null;
  }
  
  /**
   * デュアル写真レイアウトをセット
   */
  function setDualPhotoLayout(modal) {
    // 表面と裏面のアップロードセクションを横に並べる
    const uploadSections = modal.querySelectorAll('.form-group, .mb-3');
    const frontSection = Array.from(uploadSections).find(section => 
      section.textContent.includes('表面') || section.textContent.includes('front')
    );
    
    const backSection = Array.from(uploadSections).find(section => 
      section.textContent.includes('裏面') || section.textContent.includes('back')
    );
    
    if (frontSection && backSection && frontSection.parentElement) {
      // 横並び用のコンテナがなければ作成
      let rowContainer = frontSection.parentElement.querySelector('.document-upload-row');
      if (!rowContainer) {
        rowContainer = document.createElement('div');
        rowContainer.className = 'document-upload-row';
        frontSection.parentElement.insertBefore(rowContainer, frontSection);
      } else {
        rowContainer.innerHTML = '';
      }
      
      // 表裏のセクションを横並びコンテナに移動
      const frontCol = document.createElement('div');
      frontCol.className = 'document-upload-col';
      frontCol.appendChild(frontSection.cloneNode(true));
      
      const backCol = document.createElement('div');
      backCol.className = 'document-upload-col';
      backCol.appendChild(backSection.cloneNode(true));
      
      rowContainer.appendChild(frontCol);
      rowContainer.appendChild(backCol);
      
      // 元のセクションを非表示
      frontSection.style.display = 'none';
      backSection.style.display = 'none';
      
      // 新しいセクションのカメラボタンも削除
      removeAllCameraButtons(rowContainer);
    }
  }
  
  /**
   * すべてのカメラボタンを削除
   */
  function removeAllCameraButtons(container) {
    // カメラボタンを特定して削除
    const cameraButtons = container.querySelectorAll('.camera-button');
    cameraButtons.forEach(button => {
      button.remove();
    });
    
    // テキストでカメラボタンを特定して削除
    container.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim().toLowerCase();
      if (text.includes('カメラ') || text.includes('撮影') || text.includes('camera')) {
        button.remove();
      }
    });
    
    // クラス名による特定と削除
    container.querySelectorAll('.btn-camera, [data-target*="camera"], [data-bs-target*="camera"]').forEach(elem => {
      elem.remove();
    });
  }
  
  /**
   * カメラ関連の機能を無効化
   */
  function disableCameraFunctions() {
    // グローバルオブジェクトにダミー関数を設定
    window.openCameraModal = function() { 
      console.log('カメラ機能は無効化されています');
      return false;
    };
    
    window.startCamera = function() { 
      console.log('カメラ機能は無効化されています');
      return false;
    };
    
    // カメラモーダル関連のイベントリスナーを削除
    document.removeEventListener('camera-access-success', () => {});
    document.removeEventListener('camera-access-error', () => {});
  }
})();