/**
 * 書類プレビュー機能の修正と削除ボタンの実装
 */
(function() {
  'use strict';

  // 初期化
  document.addEventListener('DOMContentLoaded', initPreviewHandler);

  /**
   * プレビュー機能の初期化
   */
  function initPreviewHandler() {
    // モーダルの表示を監視
    document.addEventListener('shown.bs.modal', function(event) {
      setTimeout(() => {
        setupDocumentPreviewHandlers();
      }, 300);
    });

    // 既存のページ内の要素にもハンドラーを設定
    setupDocumentPreviewHandlers();
  }

  /**
   * 書類プレビュー表示機能の設定
   */
  function setupDocumentPreviewHandlers() {
    // ファイル入力要素
    document.querySelectorAll('input[type="file"]').forEach(fileInput => {
      if (!fileInput.hasAttribute('data-preview-handler')) {
        fileInput.setAttribute('data-preview-handler', 'true');
        fileInput.addEventListener('change', handleFileSelection);
      }
    });

    // 削除ボタン
    document.querySelectorAll('.preview-container .remove-btn, .preview-container button').forEach(button => {
      if (!button.hasAttribute('data-remove-handler')) {
        button.setAttribute('data-remove-handler', 'true');
        button.addEventListener('click', handleRemoveButtonClick);
      }
    });
  }

  /**
   * ファイル選択時の処理
   */
  function handleFileSelection(event) {
    const fileInput = event.target;
    if (!fileInput.files || !fileInput.files[0]) return;

    const file = fileInput.files[0];
    // ファイルのパスからIDを特定
    let targetId = '';
    const container = fileInput.closest('.document-upload-card');
    if (container && container.id) {
      targetId = container.id;
    } else {
      // 入力ID自体から生成（例: license-photo-front → license-front）
      targetId = fileInput.name ? fileInput.name.replace('-photo', '') : '';
      if (!targetId) {
        targetId = fileInput.id ? fileInput.id.replace('-input', '') : '';
      }
    }

    if (!targetId) {
      console.error('プレビュー対象のIDを特定できません', fileInput);
      return;
    }

    updateDocumentPreview(targetId, file);
  }

  /**
   * 削除ボタンのクリックハンドラー
   */
  function handleRemoveButtonClick(event) {
    const button = event.currentTarget;
    const container = button.closest('.document-upload-card');
    let targetId = '';

    if (container && container.id) {
      targetId = container.id;
    } else {
      // ボタンの属性から取得を試みる
      targetId = button.getAttribute('data-target') || '';
      // 親要素のIDから取得を試みる
      if (!targetId) {
        const previewContainer = button.closest('.preview-container');
        if (previewContainer && previewContainer.id) {
          targetId = previewContainer.id.replace('-preview', '');
        }
      }
    }

    if (!targetId) {
      console.error('削除対象のIDを特定できません', button);
      return;
    }

    removeDocumentFile(targetId);
  }

  /**
   * ドキュメントプレビューの更新
   * 各種書類のアップロード状態を視覚的に表示
   */
  function updateDocumentPreview(targetId, file) {
    console.log(`プレビュー更新: ${targetId}`, file);

    // 対象要素の特定
    let previewContainer, previewImg, placeholderContainer;
    
    // カード内の要素を探す
    const card = document.getElementById(targetId);
    if (card) {
      previewContainer = card.querySelector('.preview-container');
      previewImg = card.querySelector('.document-preview-img');
      placeholderContainer = card.querySelector('.placeholder-container');
    }
    
    // ID命名規則に基づく要素特定
    if (!previewContainer || !previewImg) {
      previewContainer = document.getElementById(`${targetId}-preview`);
      previewImg = document.getElementById(`${targetId}-image`);
      placeholderContainer = document.getElementById(`${targetId}-prompt`);
    }

    if (!previewContainer || !previewImg) {
      console.error(`ターゲット要素 ${targetId} が見つかりません`);
      return;
    }

    // ファイルをプレビュー表示
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      previewContainer.classList.remove('d-none');
      
      // プレースホルダーがあれば非表示
      if (placeholderContainer) {
        placeholderContainer.classList.add('d-none');
      }

      // 削除ボタンがなければ追加
      if (!previewContainer.querySelector('button[data-remove-handler]')) {
        const removeBtn = previewContainer.querySelector('.remove-btn, button');
        if (removeBtn) {
          removeBtn.setAttribute('data-remove-handler', 'true');
          removeBtn.setAttribute('data-target', targetId);
          removeBtn.addEventListener('click', handleRemoveButtonClick);
        } else {
          // 動的に削除ボタンを追加
          const deleteButton = document.createElement('button');
          deleteButton.type = 'button';
          deleteButton.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1';
          deleteButton.innerHTML = '<i class="bi bi-x"></i>';
          deleteButton.setAttribute('data-remove-handler', 'true');
          deleteButton.setAttribute('data-target', targetId);
          deleteButton.addEventListener('click', handleRemoveButtonClick);
          previewContainer.appendChild(deleteButton);
        }
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * ファイルの削除とプレビューのクリア
   */
  function removeDocumentFile(targetId) {
    console.log(`ファイル削除: ${targetId}`);
    
    // ファイル入力要素とプレビュー要素の取得
    let fileInput, previewContainer, placeholderContainer;
    
    // カード内の要素を探す
    const card = document.getElementById(targetId);
    if (card) {
      fileInput = card.querySelector('input[type="file"]');
      previewContainer = card.querySelector('.preview-container');
      placeholderContainer = card.querySelector('.placeholder-container');
    }
    
    // ID命名規則に基づく要素特定
    if (!fileInput || !previewContainer) {
      fileInput = document.getElementById(`${targetId}-input`);
      if (!fileInput) {
        // 代替方法: name属性で特定を試みる
        document.querySelectorAll('input[type="file"]').forEach(input => {
          if (input.name && input.name.includes(targetId)) {
            fileInput = input;
          }
        });
      }
      
      previewContainer = document.getElementById(`${targetId}-preview`);
      placeholderContainer = document.getElementById(`${targetId}-prompt`);
    }
    
    if (fileInput) {
      // ファイル入力をリセット
      fileInput.value = '';
      
      // カスタムイベントを発火
      const event = new CustomEvent('documentFileRemoved', {
        detail: { targetId: targetId }
      });
      document.dispatchEvent(event);
    }
    
    if (previewContainer) {
      // プレビューを非表示
      previewContainer.classList.add('d-none');
      
      // プレースホルダーがあれば表示
      if (placeholderContainer) {
        placeholderContainer.classList.remove('d-none');
      }
    }
  }

  // グローバル関数として公開
  window.updateDocumentPreview = updateDocumentPreview;
  window.removeDocumentFile = removeDocumentFile;
})();