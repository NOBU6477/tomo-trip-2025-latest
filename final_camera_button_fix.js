/**
 * カメラボタン英語テキストの最終修正スクリプト
 * あらゆる状況で確実に日本語化します
 */
(function() {
  'use strict';

  // 即時実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * 初期化処理
   */
  function init() {
    console.log('カメラボタン最終修正を初期化');
    
    // すぐに一度実行
    fixCameraButton();
    
    // クリックイベントと表示イベントの両方を監視
    document.addEventListener('click', function() {
      setTimeout(fixCameraButton, 200);
    });
    
    document.addEventListener('shown.bs.modal', function() {
      setTimeout(fixCameraButton, 100);
    });
    
    // モーダル表示後に複数回実行して確実に適用
    [500, 1000, 1500, 2000, 3000].forEach(delay => {
      setTimeout(fixCameraButton, delay);
    });
    
    // MutationObserverを設定（ボタン追加を検出するため）
    setupObserver();
  }
  
  /**
   * モーダル内の変更を監視
   */
  function setupObserver() {
    try {
      const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            shouldFix = true;
          }
        });
        
        if (shouldFix) {
          fixCameraButton();
        }
      });
      
      // ボディ全体を監視
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (error) {
      console.error('監視エラー:', error);
    }
  }
  
  /**
   * カメラボタンの英語テキストを日本語に変換
   */
  function fixCameraButton() {
    try {
      // 1. カメラアイコン付きのボタンを検索
      document.querySelectorAll('button').forEach(button => {
        const hasIcon = button.querySelector('.bi-camera, [class*="camera"]') !== null;
        const hasCameraText = button.textContent.includes('CAMERA') || 
                             button.textContent.includes('Camera') || 
                             button.textContent.includes('camera');
        
        if (hasIcon || hasCameraText) {
          // ボタンの内容を完全に置き換え
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
        }
      });
      
      // 2. セレクタを使用して特定
      document.querySelectorAll('button.btn-secondary, button.camera-btn, button.photo-camera-btn').forEach(button => {
        if (button.textContent.includes('PHOTO') || button.textContent.includes('Camera')) {
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
        }
      });
      
      // 3. 特定の親要素内のカメラボタンを検索
      document.querySelectorAll('.photo-section, .document-photo-section').forEach(section => {
        const buttons = section.querySelectorAll('button');
        buttons.forEach(button => {
          if (button.textContent.includes('CAMERA') || button.textContent.includes('Camera')) {
            button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          }
        });
      });
      
      // 4. モーダル内の特定位置のボタン
      document.querySelectorAll('.modal.show').forEach(modal => {
        const buttons = modal.querySelectorAll('button');
        if (buttons.length >= 2) {
          // 通常、2番目のボタンがカメラ
          if (buttons[1].textContent.includes('CAMERA') || buttons[1].textContent.includes('Camera')) {
            buttons[1].innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          }
        }
      });
      
      // 5. innerHTML直接置換による最終手段
      document.querySelectorAll('button').forEach(button => {
        if (button.innerHTML.includes('PHOTO CAMERA')) {
          button.innerHTML = button.innerHTML.replace('PHOTO CAMERA', 'カメラで撮影');
        }
      });
      
      console.log('カメラボタン修正完了');
    } catch (error) {
      console.error('カメラボタン修正エラー:', error);
    }
  }
})();