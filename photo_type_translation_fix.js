/**
 * 証明写真セクションの英語テキストを日本語に置き換えるスクリプト
 */
(function() {
  'use strict';
  
  // DOMの読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // モーダル表示イベントにもリスナーを設定
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target && (
        event.target.id === 'touristRegisterModal' || 
        event.target.id === 'guideRegisterModal')) {
      setTimeout(translatePhotoLabels, 300);
    }
  });
  
  /**
   * 初期化処理
   */
  function init() {
    console.log('証明写真テキスト日本語化を初期化');
    
    // 初期実行
    translatePhotoLabels();
    
    // MutationObserverの代わりに一定間隔でチェック
    // これにより無限ループを防ぎます
    setTimeout(function() {
      // ページが安定した後に一度だけ実行
      translatePhotoLabels();
    }, 1000);
  }
  
  /**
   * 証明写真セクションのラベルを翻訳
   */
  function translatePhotoLabels() {
    // テキスト置換マップ
    const translations = {
      'photo title': '証明写真タイプ',
      'photo single': '証明写真（1枚）',
      'photo dual': '表裏写真（運転免許証等）',
      'photo description': '写真について',
      'PHOTO SELECT': 'ファイルを選択',
      'PHOTO CAMERA': 'カメラで撮影',
      'Photo title': '証明写真タイプ',
      'Photo single': '証明写真（1枚）',
      'Photo dual': '表裏写真（運転免許証等）',
      'Photo description': '写真について',
      'Photo Select': 'ファイルを選択',
      'Photo Camera': 'カメラで撮影'
    };
    
    // 対象を絞ったセレクタで要素を取得（パフォーマンス向上）
    const elements = document.querySelectorAll('.modal-body h1, .modal-body h2, .modal-body h3, .modal-body h4, .modal-body h5, .modal-body h6, .modal-body p, .modal-body label, .modal-body span, .modal-body button');
    
    elements.forEach(function(element) {
      // ボタン要素の特別処理
      if (element.tagName === 'BUTTON') {
        // ボタンテキストの翻訳
        if (translations[element.textContent.trim()]) {
          element.textContent = translations[element.textContent.trim()];
        }
        
        // ボタン内の子要素を調べる（アイコン+テキストの場合）
        const buttonText = Array.from(element.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent.trim())
          .join(' ');
        
        if (translations[buttonText]) {
          // テキストノードのみを更新
          Array.from(element.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
              node.textContent = ' ' + translations[buttonText];
            }
          });
        }
      } else {
        // テキストコンテンツの直接置換
        if (element.textContent && translations[element.textContent.trim()]) {
          element.textContent = translations[element.textContent.trim()];
        }
      }
    });
    
    // モーダル内の特定要素を直接更新
    try {
      // photo title → 証明写真タイプ
      const modalTitle = document.querySelector('.modal-body h5, .modal-body h6, .modal-body div');
      if (modalTitle && modalTitle.textContent.trim() === 'photo title') {
        modalTitle.textContent = '証明写真タイプ';
      }
      
      // PHOTO SELECT → ファイルを選択
      const selectButton = document.querySelector('.modal-body button:nth-child(1)');
      if (selectButton && selectButton.textContent.includes('SELECT')) {
        selectButton.textContent = selectButton.textContent.replace('PHOTO SELECT', 'ファイルを選択');
      }
      
      // PHOTO CAMERA → カメラで撮影
      const cameraButton = document.querySelector('.modal-body button:nth-child(2)');
      if (cameraButton && cameraButton.textContent.includes('CAMERA')) {
        cameraButton.textContent = cameraButton.textContent.replace('PHOTO CAMERA', 'カメラで撮影');
      }
    } catch (error) {
      console.error('特定要素の翻訳エラー:', error);
    }
    
    // ラジオボタンのラベルを特別に処理
    const singleRadio = document.getElementById('id-photo-type-single');
    const dualRadio = document.getElementById('id-photo-type-dual');
    
    if (singleRadio) {
      const singleLabel = document.querySelector('label[for="id-photo-type-single"]');
      if (singleLabel) singleLabel.textContent = '証明写真（1枚）';
    }
    
    if (dualRadio) {
      const dualLabel = document.querySelector('label[for="id-photo-type-dual"]');
      if (dualLabel) dualLabel.textContent = '表裏写真（運転免許証等）';
    }
    
    console.log('証明写真テキストの日本語化を実行しました');
  }
})();