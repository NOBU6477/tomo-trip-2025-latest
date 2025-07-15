/**
 * 究極の画像プレビュー修正システム
 * 100%確実な画像プレビュー表示を実現
 */

(function() {
  'use strict';
  
  console.log('🔧 究極の画像プレビュー修正システム開始');
  
  // 初期化
  function initialize() {
    overrideFileInputs();
    forcePreviewDisplay();
    setupContinuousMonitoring();
  }
  
  // ファイル入力を完全にオーバーライド
  function overrideFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    fileInputs.forEach(input => {
      // 既存のイベントリスナーを削除
      const newInput = input.cloneNode(true);
      input.parentNode.replaceChild(newInput, input);
      
      // 新しいイベントリスナーを設定
      newInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          handleImageUploadDirect(file, newInput.id);
        }
      });
      
      console.log(`📎 ファイル入力オーバーライド完了: ${newInput.id}`);
    });
  }
  
  // 直接的な画像アップロード処理
  function handleImageUploadDirect(file, inputId) {
    console.log(`📸 直接画像処理開始: ${file.name}`);
    
    const previewId = getPreviewId(inputId);
    const preview = document.getElementById(previewId);
    
    if (!preview) {
      console.error(`プレビュー要素が見つかりません: ${previewId}`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataURL = e.target.result;
      
      // プレビュー画像を強制表示
      preview.src = dataURL;
      
      // すべてのCSS制約を無視して強制表示
      preview.setAttribute('style', `
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
      `);
      
      // プロフィール写真の場合は円形に
      if (previewId.includes('profile')) {
        preview.setAttribute('style', `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 150px !important;
          height: 150px !important;
          object-fit: cover !important;
          border: 3px solid #007bff !important;
          border-radius: 50% !important;
          margin: 10px auto !important;
          background: white !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
        `);
      }
      
      // d-noneクラスを完全に削除
      preview.classList.remove('d-none');
      preview.className = preview.className.replace(/d-none/g, '');
      
      // 親コンテナも表示
      const container = preview.closest('.document-preview-container');
      if (container) {
        container.style.display = 'block';
        container.style.visibility = 'visible';
      }
      
      // 削除ボタンを表示
      const deleteBtn = document.getElementById(previewId.replace('preview', 'delete'));
      if (deleteBtn) {
        deleteBtn.classList.remove('d-none');
        deleteBtn.style.display = 'inline-block';
        deleteBtn.style.marginTop = '10px';
      }
      
      // スクロールして見せる
      preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      console.log(`✅ 画像プレビュー強制表示完了: ${previewId}`);
      
      // 成功通知
      showSuccessNotification('画像のプレビューが表示されました');
    };
    
    reader.onerror = function() {
      console.error('ファイル読み込みエラー');
      showErrorNotification('画像の読み込みに失敗しました');
    };
    
    reader.readAsDataURL(file);
  }
  
  // プレビューIDを取得
  function getPreviewId(inputId) {
    const idMap = {
      'guide-profile-photo': 'guide-profile-preview',
      'tourist-profile-photo': 'tourist-profile-preview',
      'guide-id-front': 'guide-id-front-preview',
      'guide-id-back': 'guide-id-back-preview',
      'tourist-id-front': 'tourist-id-front-preview',
      'tourist-id-back': 'tourist-id-back-preview'
    };
    
    return idMap[inputId] || inputId + '-preview';
  }
  
  // プレビュー表示を強制
  function forcePreviewDisplay() {
    const previews = document.querySelectorAll('img[id*="preview"]');
    
    previews.forEach(preview => {
      if (preview.src && !preview.src.includes('placehold')) {
        preview.setAttribute('style', `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          max-width: 300px !important;
          max-height: 200px !important;
          object-fit: cover !important;
          border: 3px solid #007bff !important;
          border-radius: 8px !important;
          margin: 10px auto !important;
        `);
        
        preview.classList.remove('d-none');
      }
    });
  }
  
  // 継続的な監視システム
  function setupContinuousMonitoring() {
    // 50ms間隔でプレビューをチェック
    setInterval(() => {
      const hiddenPreviews = document.querySelectorAll('img[id*="preview"].d-none');
      hiddenPreviews.forEach(preview => {
        if (preview.src && !preview.src.includes('placehold')) {
          preview.classList.remove('d-none');
          preview.style.display = 'block';
          preview.style.visibility = 'visible';
          preview.style.opacity = '1';
        }
      });
    }, 50);
    
    // DOM変更の監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.tagName === 'IMG' && target.id.includes('preview')) {
            if (target.classList.contains('d-none') && target.src && !target.src.includes('placehold')) {
              target.classList.remove('d-none');
              target.style.display = 'block';
              console.log(`🔄 プレビュー表示を復元: ${target.id}`);
            }
          }
        }
      });
    });
    
    // 全ドキュメントを監視
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // 成功通知
  function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
  
  // エラー通知
  function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
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