/**
 * クリック可能なプロフィール写真システム
 * 円形プレビューエリアをクリックしてファイル選択可能にする
 */

(function() {
  'use strict';
  
  console.log('📸 クリック可能プロフィール写真システム開始');
  
  function initialize() {
    setupClickableProfilePhotos();
    setupDirectImageDisplay();
  }
  
  // クリック可能なプロフィール写真の設定
  function setupClickableProfilePhotos() {
    // ガイド登録のプロフィール写真
    setupClickablePhoto('guide-profile-preview', 'guide-profile-photo');
    
    // 観光客登録のプロフィール写真
    setupClickablePhoto('tourist-profile-preview', 'tourist-profile-photo');
    
    // 編集ページのプロフィール写真
    setupClickablePhoto('profile-preview', 'profile-photo');
  }
  
  // 特定のプロフィール写真をクリック可能にする
  function setupClickablePhoto(previewId, inputId) {
    const preview = document.getElementById(previewId);
    const fileInput = document.getElementById(inputId);
    
    if (!preview) return;
    
    // プレビュー画像をクリック可能にする
    preview.style.cursor = 'pointer';
    preview.title = 'クリックして写真を選択';
    
    // クリックイベントを設定
    preview.addEventListener('click', function() {
      if (fileInput) {
        fileInput.click();
      } else {
        // ファイル入力が見つからない場合は作成
        createHiddenFileInput(inputId, previewId);
      }
    });
    
    // ファイル入力の変更を監視
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          displayImageImmediately(file, previewId);
        }
      });
    }
    
    console.log(`📸 クリック可能プロフィール写真設定完了: ${previewId} → ${inputId}`);
  }
  
  // 隠しファイル入力を作成
  function createHiddenFileInput(inputId, previewId) {
    let fileInput = document.getElementById(inputId);
    
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = inputId;
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      
      document.body.appendChild(fileInput);
      
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          displayImageImmediately(file, previewId);
        }
      });
    }
    
    fileInput.click();
  }
  
  // 画像を即座に表示
  function displayImageImmediately(file, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      // 画像を即座に設定
      preview.src = e.target.result;
      
      // 強制的にスタイルを適用
      preview.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 150px !important;
        height: 150px !important;
        object-fit: cover !important;
        border: 3px solid #007bff !important;
        border-radius: 50% !important;
        margin: 10px auto !important;
        cursor: pointer !important;
        background: white !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        transition: transform 0.2s ease !important;
      `;
      
      // ホバー効果を追加
      preview.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      preview.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
      
      // d-noneクラスを削除
      preview.classList.remove('d-none');
      
      // 親コンテナも表示
      const container = preview.parentElement;
      if (container) {
        container.style.display = 'block';
        container.style.visibility = 'visible';
      }
      
      console.log(`✅ プロフィール写真表示完了: ${previewId}`);
      
      // 成功通知
      showNotification('プロフィール写真が設定されました', 'success');
    };
    
    reader.onerror = function() {
      console.error('ファイル読み込みエラー');
      showNotification('画像の読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
  }
  
  // 直接的な画像表示システム
  function setupDirectImageDisplay() {
    // 全ての画像プレビューを監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'IMG') {
            if (node.id && node.id.includes('preview')) {
              enforceImageDisplay(node);
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 既存の画像も処理
    const existingPreviews = document.querySelectorAll('img[id*="preview"]');
    existingPreviews.forEach(enforceImageDisplay);
  }
  
  // 画像表示を強制
  function enforceImageDisplay(img) {
    if (!img.src || img.src.includes('placehold')) return;
    
    // プロフィール写真の場合
    if (img.id.includes('profile')) {
      img.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 150px !important;
        height: 150px !important;
        object-fit: cover !important;
        border: 3px solid #007bff !important;
        border-radius: 50% !important;
        margin: 10px auto !important;
        cursor: pointer !important;
        background: white !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      `;
    } else {
      // その他の身分証明書等
      img.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        max-width: 300px !important;
        max-height: 200px !important;
        object-fit: cover !important;
        border: 3px solid #007bff !important;
        border-radius: 8px !important;
        margin: 10px auto !important;
        background: white !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
      `;
    }
    
    img.classList.remove('d-none');
  }
  
  // 通知表示
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      max-width: 300px;
      animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
      notification.style.background = '#28a745';
      notification.style.color = 'white';
    } else if (type === 'error') {
      notification.style.background = '#dc3545';
      notification.style.color = 'white';
    } else {
      notification.style.background = '#17a2b8';
      notification.style.color = 'white';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();