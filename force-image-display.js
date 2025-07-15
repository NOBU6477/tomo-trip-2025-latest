/**
 * 強制画像表示システム
 * 画像プレビューが確実に表示されるようにする最終手段
 */

(function() {
  'use strict';
  
  console.log('🖼️ 強制画像表示システム開始');
  
  function initialize() {
    overrideAllFileInputs();
    setupContinuousForceDisplay();
    addImageDisplayStyles();
  }
  
  // 全てのファイル入力をオーバーライド
  function overrideAllFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    fileInputs.forEach(input => {
      // 既存のイベントを全て削除
      const newInput = input.cloneNode(true);
      input.parentNode.replaceChild(newInput, input);
      
      newInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          forceDisplayImage(file, newInput.id);
        }
      });
      
      console.log(`🔧 ファイル入力オーバーライド: ${newInput.id}`);
    });
  }
  
  // 画像を強制表示
  function forceDisplayImage(file, inputId) {
    const previewId = getPreviewIdFromInput(inputId);
    const preview = document.getElementById(previewId);
    
    if (!preview) {
      console.error(`プレビュー要素が見つかりません: ${previewId}`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataURL = e.target.result;
      
      // 画像を設定
      preview.src = dataURL;
      
      // 強制的にスタイルを適用
      if (previewId.includes('profile')) {
        // プロフィール写真の場合
        preview.setAttribute('style', `
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
          box-shadow: 0 6px 16px rgba(0,123,255,0.3) !important;
          transition: all 0.3s ease !important;
          position: relative !important;
          z-index: 10 !important;
        `);
      } else {
        // 身分証明書等の場合
        preview.setAttribute('style', `
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          max-width: 320px !important;
          max-height: 220px !important;
          width: auto !important;
          height: auto !important;
          object-fit: cover !important;
          border: 4px solid #007bff !important;
          border-radius: 12px !important;
          margin: 15px auto !important;
          background: white !important;
          box-shadow: 0 6px 16px rgba(0,123,255,0.25) !important;
          position: relative !important;
          z-index: 10 !important;
        `);
      }
      
      // クラス操作
      preview.classList.remove('d-none', 'invisible', 'opacity-0');
      preview.classList.add('force-visible');
      
      // 親要素も表示
      let parent = preview.parentElement;
      while (parent && parent !== document.body) {
        parent.style.display = 'block';
        parent.style.visibility = 'visible';
        parent.classList.remove('d-none');
        parent = parent.parentElement;
      }
      
      // 削除ボタンを表示
      const deleteBtn = document.getElementById(previewId.replace('preview', 'delete'));
      if (deleteBtn) {
        deleteBtn.style.display = 'inline-block';
        deleteBtn.style.visibility = 'visible';
        deleteBtn.classList.remove('d-none');
      }
      
      // スクロールして表示
      setTimeout(() => {
        preview.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      
      console.log(`✅ 画像強制表示完了: ${previewId}`);
      
      // 成功アニメーション
      preview.style.animation = 'bounceIn 0.6s ease';
      
      showForceNotification('画像が正常に表示されました', 'success');
    };
    
    reader.onerror = function() {
      console.error('ファイル読み込みエラー');
      showForceNotification('画像の読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
  }
  
  // 入力IDからプレビューIDを取得
  function getPreviewIdFromInput(inputId) {
    const mapping = {
      'guide-profile-photo': 'guide-profile-preview',
      'tourist-profile-photo': 'tourist-profile-preview',
      'guide-id-front': 'guide-id-front-preview',
      'guide-id-back': 'guide-id-back-preview',
      'tourist-id-front': 'tourist-id-front-preview',
      'tourist-id-back': 'tourist-id-back-preview',
      'profile-photo': 'profile-preview'
    };
    
    return mapping[inputId] || inputId.replace('photo', 'preview').replace('id-', 'id-').replace('-', '-') + '-preview';
  }
  
  // 継続的な強制表示
  function setupContinuousForceDisplay() {
    // 高频度での監視
    setInterval(() => {
      const hiddenImages = document.querySelectorAll('img[id*="preview"]:not(.force-visible)');
      hiddenImages.forEach(img => {
        if (img.src && !img.src.includes('placehold') && !img.src.includes('data:image/gif')) {
          enforceVisibility(img);
        }
      });
    }, 100);
    
    // DOM変更監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (target.tagName === 'IMG' && target.id.includes('preview')) {
            if (target.src && !target.src.includes('placehold')) {
              enforceVisibility(target);
            }
          }
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style', 'src']
    });
  }
  
  // 可視性を強制
  function enforceVisibility(img) {
    if (img.classList.contains('force-visible')) return;
    
    if (img.id.includes('profile')) {
      img.setAttribute('style', `
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
        box-shadow: 0 6px 16px rgba(0,123,255,0.3) !important;
        position: relative !important;
        z-index: 10 !important;
      `);
    } else {
      img.setAttribute('style', `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        max-width: 320px !important;
        max-height: 220px !important;
        object-fit: cover !important;
        border: 4px solid #007bff !important;
        border-radius: 12px !important;
        margin: 15px auto !important;
        background: white !important;
        box-shadow: 0 6px 16px rgba(0,123,255,0.25) !important;
        position: relative !important;
        z-index: 10 !important;
      `);
    }
    
    img.classList.remove('d-none', 'invisible');
    img.classList.add('force-visible');
  }
  
  // 画像表示用スタイルを追加
  function addImageDisplayStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .force-visible {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); opacity: 0.8; }
        70% { transform: scale(0.9); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      img[id*="preview"].force-visible:hover {
        transform: scale(1.02) !important;
        box-shadow: 0 8px 20px rgba(0,123,255,0.4) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // 強制通知
  function showForceNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      padding: 15px 25px !important;
      border-radius: 10px !important;
      font-weight: bold !important;
      font-size: 14px !important;
      z-index: 99999 !important;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
      max-width: 350px !important;
      animation: slideInRight 0.4s ease !important;
    `;
    
    if (type === 'success') {
      notification.style.background = '#28a745 !important';
      notification.style.color = 'white !important';
      notification.innerHTML = `✅ ${message}`;
    } else if (type === 'error') {
      notification.style.background = '#dc3545 !important';
      notification.style.color = 'white !important';
      notification.innerHTML = `❌ ${message}`;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
      }
    }, 4000);
  }
  
  // アニメーション用CSS
  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(animationStyle);
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();