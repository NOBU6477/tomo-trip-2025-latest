/**
 * シンプル画像システム
 * 確実に動作する最小限の画像アップロード機能
 */

(function() {
  'use strict';
  
  console.log('📸 シンプル画像システム開始');
  
  // 初期化を遅延実行
  setTimeout(function() {
    initializeImageSystem();
  }, 500);
  
  function initializeImageSystem() {
    console.log('🔧 画像システム初期化開始');
    
    // プロフィール写真の設定
    setupProfilePhoto('guide-profile-photo', 'guide-profile-preview');
    setupProfilePhoto('tourist-profile-photo', 'tourist-profile-preview');
    
    // 身分証明書の設定
    setupDocumentPhoto('guide-id-front', 'guide-id-front-preview');
    setupDocumentPhoto('guide-id-back', 'guide-id-back-preview');
    setupDocumentPhoto('tourist-id-front', 'tourist-id-front-preview');
    setupDocumentPhoto('tourist-id-back', 'tourist-id-back-preview');
    
    console.log('✅ 画像システム初期化完了');
  }
  
  function setupProfilePhoto(inputId, previewId) {
    const fileInput = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!fileInput || !preview) {
      console.log(`⚠️ 要素が見つかりません: ${inputId} または ${previewId}`);
      return;
    }
    
    // プレビュー画像をクリック可能にする
    preview.style.cursor = 'pointer';
    preview.title = 'クリックして写真を選択';
    
    // プレビュー画像のクリックイベント
    preview.onclick = function() {
      console.log(`📸 プロフィール写真クリック: ${inputId}`);
      fileInput.click();
    };
    
    // コンテナもクリック可能にする
    const container = preview.closest('.profile-photo-container');
    if (container) {
      container.style.cursor = 'pointer';
      container.onclick = function(e) {
        if (e.target !== fileInput) {
          fileInput.click();
        }
      };
    }
    
    // ファイル変更イベント
    fileInput.onchange = function(e) {
      const file = e.target.files[0];
      if (file) {
        console.log(`📄 ファイル選択: ${file.name}`);
        displayProfileImage(file, preview);
      }
    };
    
    console.log(`✅ プロフィール写真設定完了: ${inputId}`);
  }
  
  function setupDocumentPhoto(inputId, previewId) {
    const fileInput = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!fileInput || !preview) {
      console.log(`⚠️ 要素が見つかりません: ${inputId} または ${previewId}`);
      return;
    }
    
    // ファイル変更イベント
    fileInput.onchange = function(e) {
      const file = e.target.files[0];
      if (file) {
        console.log(`📄 ファイル選択: ${file.name}`);
        displayDocumentImage(file, preview);
      }
    };
    
    console.log(`✅ 身分証明書設定完了: ${inputId}`);
  }
  
  function displayProfileImage(file, preview) {
    // ファイルサイズチェック
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    // ファイル形式チェック
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('JPGまたはPNG形式のファイルを選択してください');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      console.log('📸 プロフィール画像読み込み完了');
      
      // 画像を設定
      preview.src = e.target.result;
      
      // スタイルを直接設定
      preview.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 150px !important;
        height: 150px !important;
        object-fit: cover !important;
        border: 4px solid #007bff !important;
        border-radius: 50% !important;
        margin: 15px auto !important;
        cursor: pointer !important;
        background: white !important;
        box-shadow: 0 4px 12px rgba(0,123,255,0.3) !important;
      `;
      
      // クラスをクリア
      preview.className = 'profile-image-loaded';
      
      console.log('✅ プロフィール画像表示完了');
      
      // 成功メッセージ
      showMessage('プロフィール写真が設定されました', 'success');
    };
    
    reader.onerror = function() {
      console.error('❌ ファイル読み込みエラー');
      showMessage('画像の読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
  }
  
  function displayDocumentImage(file, preview) {
    // ファイルサイズチェック
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }
    
    // ファイル形式チェック
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('JPGまたはPNG形式のファイルを選択してください');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      console.log('📄 身分証明書画像読み込み完了');
      
      // 画像を設定
      preview.src = e.target.result;
      
      // スタイルを直接設定
      preview.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        max-width: 300px !important;
        max-height: 200px !important;
        width: auto !important;
        height: auto !important;
        object-fit: cover !important;
        border: 3px solid #007bff !important;
        border-radius: 8px !important;
        margin: 10px auto !important;
        background: white !important;
        box-shadow: 0 4px 8px rgba(0,123,255,0.2) !important;
      `;
      
      // クラスをクリア
      preview.className = 'document-image-loaded';
      
      // 削除ボタンを表示
      const deleteBtn = document.getElementById(preview.id.replace('preview', 'delete'));
      if (deleteBtn) {
        deleteBtn.style.display = 'inline-block';
        deleteBtn.classList.remove('d-none');
      }
      
      console.log('✅ 身分証明書画像表示完了');
      
      // 成功メッセージ
      showMessage('身分証明書画像が設定されました', 'success');
    };
    
    reader.onerror = function() {
      console.error('❌ ファイル読み込みエラー');
      showMessage('画像の読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
  }
  
  function showMessage(message, type) {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.image-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'image-message';
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: 500;
      z-index: 9999;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
      messageDiv.style.backgroundColor = '#d4edda';
      messageDiv.style.color = '#155724';
      messageDiv.style.border = '1px solid #c3e6cb';
    } else {
      messageDiv.style.backgroundColor = '#f8d7da';
      messageDiv.style.color = '#721c24';
      messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // 3秒後に削除
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 3000);
  }
  
})();