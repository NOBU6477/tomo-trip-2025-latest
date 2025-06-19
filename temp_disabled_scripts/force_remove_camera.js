/**
 * カメラボタンを強制的に削除するスクリプト
 */
(function() {
  console.log('カメラボタン強制削除: 実行開始');
  
  // すぐに実行
  removeAllCameraButtons();
  
  // 定期的に実行
  setInterval(removeAllCameraButtons, 500);
  
  // DOMの変更を監視
  const observer = new MutationObserver(function(mutations) {
    removeAllCameraButtons();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
  
  // すべてのカメラボタンを確実に削除
  function removeAllCameraButtons() {
    // クエリセレクタでカメラテキストを含むボタンを削除
    document.querySelectorAll('button').forEach(function(button) {
      const text = button.textContent.trim().toLowerCase();
      if (text.includes('カメラ') || text.includes('撮影') || text.includes('camera')) {
        console.log('カメラボタン強制削除: テキスト一致ボタン削除', text);
        button.remove();
      }
    });
    
    // カメラクラスを持つボタンを削除
    document.querySelectorAll('.camera-button, .btn-camera').forEach(function(button) {
      console.log('カメラボタン強制削除: クラス一致ボタン削除');
      button.remove();
    });
    
    // カメラアイコンを持つボタンを削除
    document.querySelectorAll('button i.bi-camera, button i.fa-camera').forEach(function(icon) {
      const button = icon.closest('button');
      if (button) {
        console.log('カメラボタン強制削除: アイコン一致ボタン削除');
        button.remove();
      }
    });
    
    // 属性でカメラに関連するボタンを削除
    document.querySelectorAll('[data-target*="camera"], [data-bs-target*="camera"]').forEach(function(el) {
      console.log('カメラボタン強制削除: 属性一致ボタン削除');
      el.remove();
    });
  }
})();