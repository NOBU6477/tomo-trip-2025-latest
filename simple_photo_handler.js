/**
 * 証明写真ファイル選択・削除機能の直接実装
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('シンプル写真ハンドラーが読み込まれました');
  setTimeout(setupPhotoHandlers, 2000); // モーダルが表示された後に実行
});

function setupPhotoHandlers() {
  // ファイル選択ボタン
  const fileBtn = document.getElementById('id-photo-file-btn');
  if (fileBtn) {
    fileBtn.addEventListener('click', function() {
      const input = document.getElementById('id-photo-input');
      if (input) {
        input.click();
      }
    });
  }
  
  // ファイル入力変更
  const fileInput = document.getElementById('id-photo-input');
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        handlePhotoFile(file);
      }
    });
  }
  
  // 削除ボタン
  const removeBtn = document.getElementById('id-photo-remove-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      clearPhoto();
    });
  }
  
  // 登録モーダルの表示イベント
  document.body.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal.id === 'registerTouristModal') {
      setTimeout(setupPhotoHandlers, 500); // モーダル表示後に再設定
    }
  });
}

// 写真ファイルの処理
function handlePhotoFile(file) {
  console.log('ファイル処理:', file.name, file.type);
  
  // ファイル検証
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズが大きすぎます（最大5MB）');
    return;
  }
  
  if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
    alert('JPGまたはPNG形式の画像ファイルを選択してください');
    return;
  }
  
  // プレビュー表示
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const previewContainer = document.getElementById('id-photo-preview');
    const placeholder = document.getElementById('id-photo-placeholder');
    const previewImage = document.getElementById('id-photo-image');
    const removeButton = document.getElementById('id-photo-remove-btn');
    
    if (previewContainer && placeholder && previewImage) {
      previewImage.src = e.target.result;
      previewContainer.classList.remove('d-none');
      placeholder.classList.add('d-none');
      
      if (removeButton) {
        removeButton.classList.remove('d-none');
      }
    }
  };
  
  reader.readAsDataURL(file);
}

// 写真をクリア
function clearPhoto() {
  const previewContainer = document.getElementById('id-photo-preview');
  const placeholder = document.getElementById('id-photo-placeholder');
  const previewImage = document.getElementById('id-photo-image');
  const removeButton = document.getElementById('id-photo-remove-btn');
  const fileInput = document.getElementById('id-photo-input');
  
  if (previewContainer && placeholder && previewImage) {
    previewImage.src = '';
    previewContainer.classList.add('d-none');
    placeholder.classList.remove('d-none');
    
    if (removeButton) {
      removeButton.classList.add('d-none');
    }
    
    if (fileInput) {
      fileInput.value = '';
    }
  }
}