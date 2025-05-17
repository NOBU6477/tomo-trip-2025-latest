/**
 * 特定ボタンを直接置換するための最終手段スクリプト
 */
(function() {
  'use strict';

  // DOM読み込み完了後に実行
  window.addEventListener('DOMContentLoaded', init);
  
  // ページロード済みの場合は即時実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }

  /**
   * 初期化処理
   */
  function init() {
    console.log('特定ボタン直接置換スクリプト初期化');
    
    // 最初に一度実行
    replaceModalButtons();
    
    // モーダル表示を監視
    observeModalOpen();
    
    // ユーザータイプ選択モーダルのボタンクリックイベントを監視
    observeUserTypeClick();
    
    // 短い間隔で何度か実行して確実に置換
    for (let i = 1; i <= 5; i++) {
      setTimeout(replaceModalButtons, i * 500);
    }
  }
  
  /**
   * モーダルのオープンイベントを監視
   */
  function observeModalOpen() {
    // モーダル表示イベント
    document.addEventListener('shown.bs.modal', function(event) {
      console.log('モーダル表示イベント発生');
      
      // モーダル表示後に少し遅延してから置換実行
      setTimeout(function() {
        // 表示されたモーダル内のボタンを置換
        const modal = event.target;
        replaceButtonsInModal(modal);
      }, 200);
    });
    
    // 代替方法: クリックイベントの監視
    document.addEventListener('click', function(event) {
      if (event.target && (
          event.target.classList.contains('guide-register-btn') || 
          event.target.classList.contains('tourist-register-btn') ||
          event.target.hasAttribute('data-bs-toggle')
      )) {
        // モーダル表示ボタンがクリックされた可能性がある
        setTimeout(replaceModalButtons, 500);
      }
    });
  }
  
  /**
   * ユーザータイプ選択でのクリックを監視
   */
  function observeUserTypeClick() {
    document.addEventListener('click', function(event) {
      // ガイドまたは観光客選択ボタンのクリック
      if (event.target && (
          event.target.classList.contains('guide-select-btn') || 
          event.target.classList.contains('tourist-select-btn') ||
          event.target.id === 'guide-type-btn' ||
          event.target.id === 'tourist-type-btn'
      )) {
        console.log('ユーザータイプ選択ボタンがクリックされました');
        
        // 次のモーダルが表示されるまで少し待ってから置換実行
        setTimeout(replaceModalButtons, 500);
        setTimeout(replaceModalButtons, 1000);
      }
    });
  }
  
  /**
   * モーダル内のボタンを直接置換
   */
  function replaceModalButtons() {
    try {
      // 表示されているすべてのモーダル内のボタンに対して置換処理
      const openModals = document.querySelectorAll('.modal.show');
      openModals.forEach(modal => {
        replaceButtonsInModal(modal);
      });
      
      // クラス名を使って直接証明写真ボタンを取得して置換
      const photoButtons = document.querySelectorAll('.photo-upload-btn, .camera-btn');
      photoButtons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText.includes('SELECT') || buttonText.includes('Select')) {
          button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
        } else if (buttonText.includes('CAMERA') || buttonText.includes('Camera')) {
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
        }
      });
      
      // すべてのボタンに対して文字列置換を試みる
      document.querySelectorAll('button').forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText === 'PHOTO SELECT' || buttonText === 'Photo Select') {
          button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
        } else if (buttonText === 'PHOTO CAMERA' || buttonText === 'Photo Camera') {
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
        } else {
          // 部分一致で変換
          const html = button.innerHTML;
          if (html.includes('PHOTO SELECT') || html.includes('Photo Select')) {
            button.innerHTML = html
              .replace('PHOTO SELECT', 'ファイルを選択')
              .replace('Photo Select', 'ファイルを選択');
          }
          if (html.includes('PHOTO CAMERA') || html.includes('Photo Camera')) {
            button.innerHTML = html
              .replace('PHOTO CAMERA', 'カメラで撮影')
              .replace('Photo Camera', 'カメラで撮影');
          }
        }
      });
      
      console.log('ボタン直接置換処理を実行しました');
    } catch (error) {
      console.error('ボタン直接置換エラー:', error);
    }
  }
  
  /**
   * 特定のモーダル内のボタンを置換
   */
  function replaceButtonsInModal(modal) {
    // フォトセクション内のボタンに特化して置換
    const photoSections = modal.querySelectorAll('.photo-section, .document-photo-section');
    photoSections.forEach(section => {
      const buttons = section.querySelectorAll('button');
      buttons.forEach((button, index) => {
        // 通常、最初のボタンがファイル選択、2番目がカメラ
        if (index === 0 || button.textContent.includes('SELECT')) {
          button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
        } else if (index === 1 || button.textContent.includes('CAMERA')) {
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
        }
      });
    });
    
    // 複数のボタンがある場合、位置に基づいて特定
    const allButtons = modal.querySelectorAll('button.btn-primary, button.btn-secondary');
    allButtons.forEach(button => {
      const text = button.textContent.trim();
      if (text.includes('SELECT') || text.includes('Select')) {
        button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
      } else if (text.includes('CAMERA') || text.includes('Camera')) {
        button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
      }
    });
  }
})();