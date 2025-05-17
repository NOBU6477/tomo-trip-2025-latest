/**
 * カメラが使用できない環境に対応するシンプルなファイルアップロード実装
 * どのような環境でも確実に動作することを目的としています
 */
(function() {
  console.log('手動ファイルアップロード機能を初期化');
  
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // すべてのカメラボタンを標準のファイルアップロードに置き換え
    replaceAllCameraButtons();
    
    // モーダルが表示されたときにもカメラボタンを置き換え
    document.body.addEventListener('shown.bs.modal', function() {
      setTimeout(replaceAllCameraButtons, 100);
    });
  });
  
  /**
   * すべてのカメラボタンを置き換え
   */
  function replaceAllCameraButtons() {
    // カメラボタンを検索
    const cameraButtons = document.querySelectorAll('.camera-button, button[data-role="camera-button"]');
    console.log(`カメラボタンを ${cameraButtons.length} 個検出`);
    
    cameraButtons.forEach(function(button) {
      // すでに置き換え済みならスキップ
      if (button.hasAttribute('data-replaced')) return;
      
      // ターゲットID属性を取得
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;
      
      // ターゲットファイル入力要素を取得
      const fileInput = document.getElementById(targetId);
      if (!fileInput) {
        console.error(`ターゲット入力が見つかりません: ${targetId}`);
        return;
      }
      
      // 元のボタン位置を保存
      const parentElement = button.parentElement;
      const nextElement = button.nextElementSibling;
      
      // ファイル選択ボタンを作成
      const fileUploadBtn = document.createElement('button');
      fileUploadBtn.type = 'button';
      fileUploadBtn.className = button.className.replace('camera-button', 'file-upload-button');
      fileUploadBtn.innerHTML = '<i class="fas fa-image me-2"></i> 画像を選択';
      fileUploadBtn.setAttribute('data-replaced', 'true');
      fileUploadBtn.style.backgroundColor = '#6c757d';
      fileUploadBtn.style.color = 'white';
      fileUploadBtn.style.border = 'none';
      fileUploadBtn.style.padding = '0.5rem 1rem';
      fileUploadBtn.style.borderRadius = '0.25rem';
      fileUploadBtn.style.cursor = 'pointer';
      
      // クリックイベントハンドラを設定
      fileUploadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 隠しファイル入力を作成して使用
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'file';
        hiddenInput.accept = 'image/*';
        hiddenInput.style.display = 'none';
        document.body.appendChild(hiddenInput);
        
        // ファイル選択時の処理
        hiddenInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            // オリジナルのファイル入力にコピー
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(this.files[0]);
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // プレビュー更新
            updateFilePreview(targetId, this.files[0]);
          }
          
          // 使用後に隠しファイル入力を削除
          document.body.removeChild(hiddenInput);
        });
        
        // ファイル選択ダイアログを開く
        hiddenInput.click();
      });
      
      // カメラボタンを置き換え
      if (parentElement) {
        if (nextElement) {
          parentElement.insertBefore(fileUploadBtn, nextElement);
        } else {
          parentElement.appendChild(fileUploadBtn);
        }
        parentElement.removeChild(button);
      }
      
      console.log(`カメラボタンを置き換えました: ${targetId}`);
    });
    
    // デバッグ用赤いボタンを削除
    const debugButton = document.getElementById('camera-test-button');
    if (debugButton) {
      debugButton.remove();
    }
  }
  
  /**
   * ファイルプレビューを更新
   */
  function updateFilePreview(fileId, file) {
    console.log(`ファイルプレビューを更新: ${fileId}`);
    
    // 標準プレビュー
    const previewElement = document.getElementById(fileId + '_preview');
    const imageElement = document.getElementById(fileId + '_image');
    
    if (previewElement && imageElement) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageElement.src = e.target.result;
        imageElement.classList.add('show');
        previewElement.classList.add('has-file');
      };
      reader.readAsDataURL(file);
      return;
    }
    
    // 新しいUIプレビュー
    const previewContainer = document.querySelector(`.document-preview[data-input="${fileId}"]`);
    if (previewContainer) {
      const previewImage = previewContainer.querySelector('.document-preview-image');
      if (previewImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          previewContainer.classList.add('has-file');
          
          // 削除ボタンの表示
          const removeButton = previewContainer.querySelector('.remove-file');
          if (removeButton) {
            removeButton.classList.remove('d-none');
          }
          
          // アップロードボタンとカメラボタンを非表示
          const uploadBtn = document.getElementById(fileId + '-upload-btn');
          const cameraBtn = previewContainer.querySelector('.camera-button');
          
          if (uploadBtn) uploadBtn.classList.add('d-none');
          if (cameraBtn) cameraBtn.classList.add('d-none');
        };
        reader.readAsDataURL(file);
      }
    }
    
    // 直接カメラ用プレビュー
    const directPreviewImage = document.getElementById(`${fileId}_direct_image`);
    const directRemoveButton = document.getElementById(`${fileId}_direct_remove`);
    
    if (directPreviewImage && directRemoveButton) {
      const reader = new FileReader();
      reader.onload = function(e) {
        directPreviewImage.src = e.target.result;
        directPreviewImage.style.display = 'block';
        directRemoveButton.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }
  
  // 直接実行
  setTimeout(replaceAllCameraButtons, 500);
})();