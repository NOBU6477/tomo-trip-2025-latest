/**
 * 画像プレビュー強制修正システム
 * すべての画像プレビューを確実に表示させる
 */

(function() {
  'use strict';
  
  console.log('🖼️ 画像プレビュー強制修正システム開始');
  
  // 初期化
  function initialize() {
    enhanceImagePreview();
    setupImageUploadMonitoring();
  }
  
  // 画像プレビュー強化
  function enhanceImagePreview() {
    // 全ての画像プレビュー要素を取得
    const previewImages = document.querySelectorAll([
      '#guide-profile-preview',
      '#tourist-profile-preview', 
      '#guide-id-front-preview',
      '#guide-id-back-preview',
      '#tourist-id-front-preview',
      '#tourist-id-back-preview'
    ].join(','));
    
    previewImages.forEach(img => {
      // プレビュー表示の強制スタイル適用
      applyPreviewStyles(img);
      
      // 画像読み込み完了時の処理
      img.addEventListener('load', function() {
        forceShowPreview(this);
      });
      
      // エラー時の処理
      img.addEventListener('error', function() {
        console.error('画像読み込みエラー:', this.id);
      });
    });
  }
  
  // プレビュースタイル適用
  function applyPreviewStyles(img) {
    if (img.id.includes('profile')) {
      // プロフィール写真用
      img.style.cssText += `
        width: 150px !important;
        height: 150px !important;
        object-fit: cover !important;
        border: 3px solid #dee2e6 !important;
        border-radius: 50% !important;
        display: block !important;
        margin: 0 auto !important;
      `;
    } else {
      // 身分証明書用
      img.style.cssText += `
        max-width: 300px !important;
        max-height: 200px !important;
        object-fit: cover !important;
        border: 2px solid #dee2e6 !important;
        border-radius: 8px !important;
        display: block !important;
        margin: 10px 0 !important;
      `;
    }
  }
  
  // プレビュー強制表示
  function forceShowPreview(img) {
    img.classList.remove('d-none');
    img.style.display = 'block';
    img.style.visibility = 'visible';
    img.style.opacity = '1';
    
    console.log(`✅ プレビュー表示完了: ${img.id}`);
  }
  
  // ファイルアップロード監視
  function setupImageUploadMonitoring() {
    // 全てのファイル入力を監視
    const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    fileInputs.forEach(input => {
      input.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          handleImageUpload(e.target.files[0], e.target.id);
        }
      });
    });
  }
  
  // 画像アップロード処理
  function handleImageUpload(file, inputId) {
    const previewId = getPreviewId(inputId);
    const preview = document.getElementById(previewId);
    
    if (!preview) {
      console.error(`プレビュー要素が見つかりません: ${previewId}`);
      return;
    }
    
    // FileReaderで画像を読み込み
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      forceShowPreview(preview);
      
      // 削除ボタンも表示
      const deleteBtn = document.getElementById(previewId.replace('preview', 'delete'));
      if (deleteBtn) {
        deleteBtn.classList.remove('d-none');
        deleteBtn.style.display = 'inline-block';
      }
    };
    reader.readAsDataURL(file);
    
    console.log(`📸 画像アップロード処理: ${file.name}`);
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
  
  // DOM変更監視
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          const img = mutation.target;
          if (img.tagName === 'IMG' && img.id.includes('preview')) {
            forceShowPreview(img);
          }
        }
      });
    });
    
    // 全プレビュー画像を監視
    const previewImages = document.querySelectorAll('img[id*="preview"]');
    previewImages.forEach(img => {
      observer.observe(img, { attributes: true, attributeFilter: ['src'] });
    });
  }
  
  // 定期的なプレビューチェック
  function startPeriodicCheck() {
    setInterval(function() {
      const hiddenPreviews = document.querySelectorAll('img[id*="preview"].d-none');
      hiddenPreviews.forEach(img => {
        if (img.src && img.src !== 'https://placehold.co/150?text=写真' && !img.src.includes('placehold')) {
          forceShowPreview(img);
        }
      });
    }, 1000);
  }
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initialize();
      setupMutationObserver();
      startPeriodicCheck();
    });
  } else {
    initialize();
    setupMutationObserver();
    startPeriodicCheck();
  }
  
})();