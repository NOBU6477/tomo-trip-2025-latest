/**
 * ファイル削除ハンドラー
 * 写真や書類がアップロードされた後に削除できる機能を提供
 */
(function() {
  console.log('ファイル削除ハンドラーを初期化');
  
  // ページ読み込み完了時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    setupRemoveButtons();
    
    // モーダル表示イベントをリッスン
    document.body.addEventListener('shown.bs.modal', function() {
      setTimeout(setupRemoveButtons, 100);
    });
  });
  
  // ページ読み込み後にも実行
  window.addEventListener('load', function() {
    setTimeout(setupRemoveButtons, 500);
  });
  
  /**
   * すべての削除ボタンを設定
   */
  function setupRemoveButtons() {
    // すべての削除ボタンにイベントリスナーを設定
    document.querySelectorAll('.remove-file, [data-role="remove-file"]').forEach(function(button) {
      // すでに初期化済みならスキップ
      if (button.hasAttribute('data-remove-initialized')) return;
      
      // ターゲットID属性を取得
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;
      
      // クリックイベントリスナーを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`削除ボタンがクリックされました: ${targetId}`);
        
        // ファイルを削除
        removeFile(targetId);
      });
      
      // 初期化済みとしてマーク
      button.setAttribute('data-remove-initialized', 'true');
      console.log(`削除ボタンを初期化: ${targetId}`);
    });
    
    // 新しいプレビューにも対応
    document.querySelectorAll('.document-preview .remove-file').forEach(function(button) {
      // すでに初期化済みならスキップ
      if (button.hasAttribute('data-remove-initialized')) return;
      
      // 親のプレビューコンテナからターゲットIDを取得
      const previewContainer = button.closest('.document-preview');
      if (!previewContainer) return;
      
      const targetId = previewContainer.getAttribute('data-input');
      if (!targetId) return;
      
      // クリックイベントリスナーを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`プレビュー削除ボタンがクリックされました: ${targetId}`);
        
        // ファイルを削除
        removeFile(targetId);
      });
      
      // 初期化済みとしてマーク
      button.setAttribute('data-remove-initialized', 'true');
      console.log(`プレビュー削除ボタンを初期化: ${targetId}`);
    });
  }
  
  /**
   * ファイルを削除
   * @param {string} targetId ターゲット入力要素のID
   */
  function removeFile(targetId) {
    // ターゲット入力要素を取得
    const fileInput = document.getElementById(targetId);
    if (!fileInput) {
      console.error(`ターゲット入力が見つかりません: ${targetId}`);
      return;
    }
    
    // ファイル入力をリセット
    fileInput.value = '';
    
    // 変更イベントを発火
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
    
    // 標準プレビューの更新
    const previewElement = document.getElementById(targetId + '_preview');
    const imageElement = document.getElementById(targetId + '_image');
    
    if (previewElement && imageElement) {
      imageElement.src = '';
      imageElement.classList.remove('show');
      previewElement.classList.remove('has-file');
    }
    
    // 新しいUIプレビューの更新
    const previewContainer = document.querySelector(`.document-preview[data-input="${targetId}"]`);
    if (previewContainer) {
      const previewImage = previewContainer.querySelector('.document-preview-image');
      if (previewImage) {
        previewImage.src = '';
        previewContainer.classList.remove('has-file');
        
        // 削除ボタンを非表示
        const removeButton = previewContainer.querySelector('.remove-file');
        if (removeButton) {
          removeButton.classList.add('d-none');
        }
        
        // アップロードボタンとカメラボタンを表示
        const uploadBtn = document.getElementById(targetId + '-upload-btn');
        const cameraBtn = previewContainer.querySelector('.camera-button');
        
        if (uploadBtn) uploadBtn.classList.remove('d-none');
        if (cameraBtn) cameraBtn.classList.remove('d-none');
      }
    }
  }
  
  // 直接実行する
  setTimeout(setupRemoveButtons, 0);
})();