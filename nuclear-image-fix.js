/**
 * 核レベル画像修正システム
 * 100%確実な画像プレビュー表示とプロフィール写真クリック機能
 */

(function() {
  'use strict';
  
  console.log('☢️ 核レベル画像修正システム開始');
  
  function initialize() {
    // ページ完全読み込み後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startNuclearFix);
    } else {
      startNuclearFix();
    }
  }
  
  function startNuclearFix() {
    console.log('🔬 核レベル修正開始...');
    
    // 1. 全ファイル入力を完全置換
    replaceAllFileInputs();
    
    // 2. プロフィール写真をクリック可能にする
    makeProfilePhotosClickable();
    
    // 3. 強制画像表示システム
    setupForceImageDisplay();
    
    // 4. 継続監視システム
    setupContinuousMonitoring();
    
    console.log('☢️ 核レベル修正完了');
  }
  
  // 1. 全ファイル入力を完全置換
  function replaceAllFileInputs() {
    console.log('🔄 ファイル入力完全置換開始');
    
    const fileInputConfigs = [
      { inputId: 'guide-profile-photo', previewId: 'guide-profile-preview', type: 'profile' },
      { inputId: 'tourist-profile-photo', previewId: 'tourist-profile-preview', type: 'profile' },
      { inputId: 'guide-id-front', previewId: 'guide-id-front-preview', type: 'document' },
      { inputId: 'guide-id-back', previewId: 'guide-id-back-preview', type: 'document' },
      { inputId: 'tourist-id-front', previewId: 'tourist-id-front-preview', type: 'document' },
      { inputId: 'tourist-id-back', previewId: 'tourist-id-back-preview', type: 'document' }
    ];
    
    fileInputConfigs.forEach(config => {
      setupSingleFileInput(config);
    });
  }
  
  function setupSingleFileInput(config) {
    let fileInput = document.getElementById(config.inputId);
    
    // ファイル入力がない場合は作成
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = config.inputId;
      fileInput.name = config.inputId;
      fileInput.accept = 'image/jpeg,image/jpg,image/png';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      console.log(`📄 ファイル入力作成: ${config.inputId}`);
    }
    
    // 既存のイベントを削除して新しいイベントを設定
    const newInput = fileInput.cloneNode(true);
    if (fileInput.parentNode) {
      fileInput.parentNode.replaceChild(newInput, fileInput);
    }
    
    newInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        console.log(`📸 ファイル選択: ${file.name}`);
        displayImageNuclear(file, config);
      }
    });
    
    console.log(`✅ ファイル入力設定完了: ${config.inputId}`);
  }
  
  // 2. プロフィール写真をクリック可能にする
  function makeProfilePhotosClickable() {
    console.log('👆 プロフィール写真クリック機能設定開始');
    
    const profileConfigs = [
      { previewId: 'guide-profile-preview', inputId: 'guide-profile-photo', containerId: 'guide' },
      { previewId: 'tourist-profile-preview', inputId: 'tourist-profile-photo', containerId: 'tourist' }
    ];
    
    profileConfigs.forEach(config => {
      const preview = document.getElementById(config.previewId);
      const fileInput = document.getElementById(config.inputId);
      
      if (preview) {
        // プロフィール写真とcontainerの両方をクリック可能にする
        const container = preview.closest('.profile-photo-container');
        const overlay = container ? container.querySelector('.profile-photo-overlay') : null;
        
        // プレビュー画像をクリック可能にする
        preview.style.cursor = 'pointer';
        preview.title = 'クリックして写真を選択してください';
        
        // コンテナもクリック可能にする
        if (container) {
          container.style.cursor = 'pointer';
          container.title = 'クリックして写真を選択してください';
        }
        
        // オーバーレイもクリック可能にする
        if (overlay) {
          overlay.style.cursor = 'pointer';
          overlay.title = 'クリックして写真を選択してください';
        }
        
        // クリックイベント関数
        const handlePhotoClick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`📸 プロフィール写真クリック: ${config.previewId}`);
          const input = document.getElementById(config.inputId);
          if (input) {
            input.click();
          }
        };
        
        // 全ての要素にクリックイベントを設定
        preview.addEventListener('click', handlePhotoClick);
        if (container) {
          container.addEventListener('click', handlePhotoClick);
        }
        if (overlay) {
          overlay.addEventListener('click', handlePhotoClick);
        }
        
        console.log(`✅ プロフィール写真クリック設定完了: ${config.previewId}`);
      }
    });
  }
  
  // 3. 画像を核レベルで表示
  function displayImageNuclear(file, config) {
    console.log(`☢️ 核レベル画像表示開始: ${file.name}`);
    
    const preview = document.getElementById(config.previewId);
    if (!preview) {
      console.error(`❌ プレビュー要素が見つかりません: ${config.previewId}`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataURL = e.target.result;
      
      // 画像を設定
      preview.src = dataURL;
      
      // 核レベルスタイル適用
      if (config.type === 'profile') {
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
          box-shadow: 0 8px 20px rgba(0,123,255,0.4) !important;
          transition: all 0.3s ease !important;
          position: relative !important;
          z-index: 100 !important;
        `);
      } else {
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
          box-shadow: 0 8px 20px rgba(0,123,255,0.3) !important;
          position: relative !important;
          z-index: 100 !important;
        `);
      }
      
      // 全てのクラスを除去して再設定
      preview.className = '';
      preview.classList.add('nuclear-image-display');
      
      // 親要素も強制表示
      let parent = preview.parentElement;
      while (parent && parent !== document.body) {
        parent.style.display = 'block !important';
        parent.style.visibility = 'visible !important';
        parent.classList.remove('d-none');
        parent = parent.parentElement;
      }
      
      // 削除ボタンを表示
      const deleteBtn = document.getElementById(config.previewId.replace('preview', 'delete'));
      if (deleteBtn) {
        deleteBtn.style.display = 'inline-block !important';
        deleteBtn.style.visibility = 'visible !important';
        deleteBtn.classList.remove('d-none');
      }
      
      console.log(`✅ 核レベル画像表示完了: ${config.previewId}`);
      
      // 成功通知
      showNuclearNotification(`画像が正常に表示されました: ${file.name}`, 'success');
      
      // スクロールして表示
      setTimeout(() => {
        preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    };
    
    reader.onerror = function() {
      console.error('❌ ファイル読み込みエラー');
      showNuclearNotification('画像の読み込みに失敗しました', 'error');
    };
    
    reader.readAsDataURL(file);
  }
  
  // 4. 強制画像表示システム
  function setupForceImageDisplay() {
    console.log('💪 強制画像表示システム設定');
    
    // 核レベルCSS注入
    const nuclearCSS = document.createElement('style');
    nuclearCSS.textContent = `
      .nuclear-image-display {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .nuclear-image-display:hover {
        transform: scale(1.05) !important;
        box-shadow: 0 10px 25px rgba(0,123,255,0.5) !important;
      }
      
      /* 全ての隠しクラスをオーバーライド */
      .nuclear-image-display.d-none,
      .nuclear-image-display[style*="display: none"],
      .nuclear-image-display[style*="visibility: hidden"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(nuclearCSS);
  }
  
  // 5. 継続監視システム
  function setupContinuousMonitoring() {
    console.log('👁️ 継続監視システム開始');
    
    // 超高頻度監視（100ms間隔）
    setInterval(() => {
      const allImages = document.querySelectorAll('img[id*="preview"]');
      allImages.forEach(img => {
        if (img.src && !img.src.includes('placehold') && !img.classList.contains('nuclear-image-display')) {
          console.log(`🔄 画像復旧: ${img.id}`);
          img.classList.add('nuclear-image-display');
          
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
              box-shadow: 0 8px 20px rgba(0,123,255,0.4) !important;
              z-index: 100 !important;
            `);
          }
        }
      });
    }, 100);
    
    // DOM変更監視
    const nuclearObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.tagName === 'IMG' && target.id.includes('preview')) {
            if (target.src && !target.src.includes('placehold')) {
              target.classList.add('nuclear-image-display');
              console.log(`🛡️ 画像保護: ${target.id}`);
            }
          }
        }
      });
    });
    
    nuclearObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // 核レベル通知
  function showNuclearNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      padding: 15px 25px !important;
      border-radius: 10px !important;
      font-weight: bold !important;
      font-size: 14px !important;
      z-index: 999999 !important;
      box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important;
      max-width: 400px !important;
      animation: nuclearSlideIn 0.5s ease !important;
    `;
    
    if (type === 'success') {
      notification.style.background = '#28a745 !important';
      notification.style.color = 'white !important';
      notification.innerHTML = `☢️ ${message}`;
    } else if (type === 'error') {
      notification.style.background = '#dc3545 !important';
      notification.style.color = 'white !important';
      notification.innerHTML = `💥 ${message}`;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'nuclearSlideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
      }
    }, 5000);
  }
  
  // アニメーション追加
  const nuclearAnimations = document.createElement('style');
  nuclearAnimations.textContent = `
    @keyframes nuclearSlideIn {
      from { transform: translateX(100%) scale(0.8); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes nuclearSlideOut {
      from { transform: translateX(0) scale(1); opacity: 1; }
      to { transform: translateX(100%) scale(0.8); opacity: 0; }
    }
  `;
  document.head.appendChild(nuclearAnimations);
  
  // 初期化実行
  initialize();
  
})();