/**
 * 文書アップロード部分のカメラボタン削除に特化したスクリプト
 * 明示的な削除処理を行う
 */
(function() {
  // DOM読み込み完了時とその後の処理
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    console.log('文書カメラボタン削除: 初期化');
    
    // すぐに実行
    removeDocumentCameraButtons();
    
    // 定期的に実行
    setInterval(removeDocumentCameraButtons, 500);
    
    // モーダル表示時にも実行
    document.addEventListener('shown.bs.modal', function(e) {
      setTimeout(removeDocumentCameraButtons, 100);
    });
    
    // DOMの変更を監視
    const observer = new MutationObserver(function() {
      removeDocumentCameraButtons();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 文書アップロード関連のカメラボタンを削除
  function removeDocumentCameraButtons() {
    // カメラアイコンと文字列を含むボタンを明示的に削除
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = button.textContent.trim().toLowerCase();
      
      // カメラ関連のテキストを含むボタンを削除
      if (text.includes('カメラ') || text.includes('撮影') || text.includes('camera')) {
        console.log('文書カメラボタン削除: カメラボタンを削除', text);
        button.parentNode.removeChild(button);
      }
    }
    
    // クラス名でカメラボタンを削除
    document.querySelectorAll('.camera-button, .btn-camera').forEach(function(btn) {
      if (btn.parentNode) {
        btn.parentNode.removeChild(btn);
      }
    });
    
    // data属性でカメラモーダルを呼び出すボタンを削除
    document.querySelectorAll('[data-target*="camera"], [data-bs-target*="camera"]').forEach(function(btn) {
      if (btn.parentNode) {
        btn.parentNode.removeChild(btn);
      }
    });
    
    // カメラアイコンを含むボタンを削除
    document.querySelectorAll('i.bi-camera, i.fa-camera').forEach(function(icon) {
      const btn = icon.closest('button');
      if (btn && btn.parentNode) {
        btn.parentNode.removeChild(btn);
      }
    });
  }
})();