/**
 * 書類プレビューとファイル操作を強化する機能を提供するスクリプト
 */
(function() {
  'use strict';

  /**
   * ページ読み込み完了時に初期化
   */
  document.addEventListener('DOMContentLoaded', initDocumentHandlers);

  /**
   * Modal表示の監視
   */
  const modalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE && 
              (node.classList.contains('modal') || node.querySelector('.modal'))) {
            setupPreviewHandlers();
            setupInputFileListeners();
          }
        });
      }
    });
  });

  /**
   * 初期化
   */
  function initDocumentHandlers() {
    modalObserver.observe(document.body, { childList: true, subtree: true });
    setupPreviewHandlers();
    setupInputFileListeners();
  }

  /**
   * ファイル選択時の処理を設定
   */
  function setupInputFileListeners() {
    // 通常のファイル入力要素
    document.querySelectorAll('input[type="file"]').forEach(input => {
      if (!input.hasAttribute('data-preview-handler-attached')) {
        input.setAttribute('data-preview-handler-attached', 'true');
        input.addEventListener('change', handleFileSelection);
      }
    });
  }

  /**
   * プレビュー関連の処理を設定
   */
  function setupPreviewHandlers() {
    // 削除ボタンを持つプレビューコンテナを設定
    document.querySelectorAll('.preview-container button').forEach(button => {
      if (!button.hasAttribute('data-handler-attached')) {
        button.setAttribute('data-handler-attached', 'true');
        // dataset.targetから対象IDを取得する方法に変更
        const targetId = button.closest('.preview-container').id.replace('-preview', '');
        button.addEventListener('click', function() {
          removeDocumentFile(targetId);
        });
      }
    });
  }

  /**
   * ファイル選択時の処理
   */
  function handleFileSelection(event) {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;

    // 入力IDからターゲットIDを抽出 (例: 'tourist-passport-input' → 'tourist-passport')
    const targetId = input.id.replace('-input', '');
    updateDocumentPreview(targetId, file);
  }

  /**
   * ドキュメントプレビューを更新
   * @param {string} targetId ターゲット要素のID
   * @param {File} file アップロードされたファイル
   */
  function updateDocumentPreview(targetId, file) {
    const previewContainer = document.getElementById(`${targetId}-preview`);
    const previewImage = document.getElementById(`${targetId}-image`);
    const promptContainer = document.getElementById(`${targetId}-prompt`);
    
    if (!previewContainer || !previewImage || !promptContainer) {
      console.error(`ターゲット要素 ${targetId} が見つかりません`);
      return;
    }

    // FileReaderでファイルを読み込む
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewContainer.classList.remove('d-none');
      promptContainer.classList.add('d-none');

      // 削除ボタンがなければ追加（動的に生成された場合）
      if (!previewContainer.querySelector('button')) {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 mt-1 me-1 rounded-circle p-1';
        deleteButton.innerHTML = '<i class="bi bi-x"></i>';
        deleteButton.setAttribute('data-target', targetId);
        deleteButton.addEventListener('click', function() {
          removeDocumentFile(targetId);
        });
        previewContainer.appendChild(deleteButton);
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * ファイルの削除とプレビューのクリア
   * @param {string} targetId ターゲット要素のID
   */
  window.removeDocumentFile = function(targetId) {
    const inputElement = document.getElementById(`${targetId}-input`);
    const previewContainer = document.getElementById(`${targetId}-preview`);
    const promptContainer = document.getElementById(`${targetId}-prompt`);
    
    if (inputElement) {
      // ファイル入力をリセット
      inputElement.value = '';
      
      // カスタムイベントを発火してファイル削除を通知
      const event = new CustomEvent('documentFileRemoved', {
        detail: { targetId: targetId }
      });
      document.dispatchEvent(event);
    }
    
    if (previewContainer && promptContainer) {
      // プレビューを非表示、プロンプトを表示
      previewContainer.classList.add('d-none');
      promptContainer.classList.remove('d-none');
    }
  };

  /**
   * 外部から呼び出せるようにグローバルに公開
   */
  window.updateDocumentPreview = updateDocumentPreview;
})();