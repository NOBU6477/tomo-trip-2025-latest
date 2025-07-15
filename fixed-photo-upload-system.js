/**
 * 修正済み写真アップロードシステム
 * ガイド登録ページの写真表示機能を完全修復
 */

(function() {
  'use strict';
  
  console.log('📸 修正済み写真アップロードシステム開始');
  
  // 初期化
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupPhotoUpload);
    } else {
      setupPhotoUpload();
    }
  }
  
  // 写真アップロード機能の設定
  function setupPhotoUpload() {
    console.log('📸 写真アップロード機能設定開始');
    
    // プロフィール写真
    setupProfilePhoto();
    
    // ID文書写真（表面・裏面）
    setupIdDocumentPhotos();
    
    console.log('✅ 写真アップロード機能設定完了');
  }
  
  // プロフィール写真の設定
  function setupProfilePhoto() {
    const profileInput = document.getElementById('profile-photo');
    const profilePreview = document.getElementById('profile-preview');
    
    if (profileInput && profilePreview) {
      console.log('📸 プロフィール写真設定');
      
      // ファイル選択時の処理
      profileInput.addEventListener('change', function(e) {
        handlePhotoUpload(e.target, profilePreview, 'プロフィール写真');
      });
      
      // プレビュー画像クリックでファイル選択
      profilePreview.addEventListener('click', function() {
        profileInput.click();
      });
      
      // プレビュー画像のスタイル調整
      profilePreview.style.cursor = 'pointer';
    }
  }
  
  // ID文書写真の設定
  function setupIdDocumentPhotos() {
    // 表面
    const frontInput = document.getElementById('tourist-id-front') || document.getElementById('guide-id-front');
    const frontPreview = document.getElementById('tourist-id-front-preview') || document.getElementById('guide-id-front-preview');
    
    if (frontInput && frontPreview) {
      console.log('📸 ID文書（表面）設定');
      frontInput.addEventListener('change', function(e) {
        handlePhotoUpload(e.target, frontPreview, 'ID文書（表面）');
      });
    }
    
    // 裏面
    const backInput = document.getElementById('tourist-id-back') || document.getElementById('guide-id-back');
    const backPreview = document.getElementById('tourist-id-back-preview') || document.getElementById('guide-id-back-preview');
    
    if (backInput && backPreview) {
      console.log('📸 ID文書（裏面）設定');
      backInput.addEventListener('change', function(e) {
        handlePhotoUpload(e.target, backPreview, 'ID文書（裏面）');
      });
    }
  }
  
  // 写真アップロード処理
  function handlePhotoUpload(input, previewElement, photoType = '写真') {
    if (!input.files || !input.files[0]) {
      console.log('❌ ファイルが選択されていません');
      return;
    }
    
    const file = input.files[0];
    console.log(`📸 ${photoType}アップロード開始:`, file.name);
    
    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      showNotification('画像ファイルを選択してください', 'error');
      return;
    }
    
    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      showNotification('ファイルサイズは5MB以下にしてください', 'error');
      return;
    }
    
    // FileReaderでプレビュー表示
    const reader = new FileReader();
    reader.onload = function(e) {
      previewElement.src = e.target.result;
      previewElement.classList.remove('d-none');
      previewElement.style.display = 'block';
      
      console.log(`✅ ${photoType}アップロード成功`);
      showNotification(`${photoType}をアップロードしました`, 'success');
      
      // 削除ボタンの表示
      showDeleteButton(previewElement, input);
    };
    
    reader.onerror = function() {
      console.log(`❌ ${photoType}読み込みエラー`);
      showNotification('ファイルの読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
  }
  
  // 削除ボタンの表示
  function showDeleteButton(previewElement, inputElement) {
    const deleteButtonId = previewElement.id + '-delete';
    let deleteButton = document.getElementById(deleteButtonId);
    
    if (deleteButton) {
      deleteButton.classList.remove('d-none');
      deleteButton.style.display = 'block';
    } else {
      // 削除ボタンが存在しない場合は作成
      deleteButton = document.createElement('button');
      deleteButton.id = deleteButtonId;
      deleteButton.type = 'button';
      deleteButton.className = 'btn btn-danger btn-sm mt-2';
      deleteButton.innerHTML = '<i class="bi bi-trash"></i> 削除';
      
      deleteButton.addEventListener('click', function() {
        resetPhoto(previewElement, inputElement, deleteButton);
      });
      
      previewElement.parentNode.appendChild(deleteButton);
    }
  }
  
  // 写真リセット
  function resetPhoto(previewElement, inputElement, deleteButton) {
    previewElement.src = previewElement.src.includes('placeholder') ? 
      previewElement.src : 'https://via.placeholder.com/200x200?text=写真をアップロード';
    previewElement.classList.add('d-none');
    inputElement.value = '';
    deleteButton.classList.add('d-none');
    
    console.log('🗑️ 写真削除完了');
    showNotification('写真を削除しました', 'info');
  }
  
  // 通知表示
  function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotifications = document.querySelectorAll('.photo-upload-notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `alert alert-${getAlertClass(type)} alert-dismissible fade show position-fixed photo-upload-notification`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-${getIconClass(type)} me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // 自動削除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
  
  // アラートクラス取得
  function getAlertClass(type) {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
  
  // アイコンクラス取得
  function getIconClass(type) {
    switch (type) {
      case 'success': return 'check-circle-fill';
      case 'error': return 'exclamation-triangle-fill';
      case 'warning': return 'exclamation-circle-fill';
      default: return 'info-circle-fill';
    }
  }
  
  // グローバル関数として公開
  window.handlePhotoUpload = handlePhotoUpload;
  window.resetPhoto = resetPhoto;
  window.showPhotoNotification = showNotification;
  
  // 初期化実行
  initialize();
  
})();