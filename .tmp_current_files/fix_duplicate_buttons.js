/**
 * 重複したナビゲーションボタンと電話認証コードの表示を修正
 */
(function() {
  // DOMコンテンツ読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('重複ボタン修正スクリプトを実行');
    
    // 1. ナビバーに追加された新規登録ボタンを削除
    const navbarRegisterBtns = document.querySelectorAll('.navbar-nav .btn-warning');
    if (navbarRegisterBtns.length > 0) {
      console.log('ナビバーの新規登録ボタンを削除:', navbarRegisterBtns.length + '個');
      navbarRegisterBtns.forEach(function(btn) {
        if (btn.closest('.nav-item')) {
          btn.closest('.nav-item').remove();
        } else {
          btn.remove();
        }
      });
    }
    
    // 2. 右下の認証コード表示を削除
    const removeMockDisplay = function() {
      const mockCodeElements = document.querySelectorAll('body > div:not(.modal):not(.toast-container)');
      mockCodeElements.forEach(function(el) {
        if (el.textContent && el.textContent.includes('テスト用認証コード')) {
          console.log('テスト用認証コード表示を削除します');
          el.remove();
        }
      });
    };
    
    // すぐに実行して、少し待ってからも実行（非同期で追加される場合に対応）
    removeMockDisplay();
    setTimeout(removeMockDisplay, 500);
    setTimeout(removeMockDisplay, 1500);
    
    // モーダル表示時にも認証コード表示をチェック
    document.addEventListener('shown.bs.modal', function() {
      setTimeout(removeMockDisplay, 100);
    });
  });
  
  // ウィンドウロード時にも実行
  window.addEventListener('load', function() {
    const navbarRegisterBtns = document.querySelectorAll('.navbar-nav .btn-warning');
    if (navbarRegisterBtns.length > 0) {
      console.log('ウィンドウロード後: ナビバーの新規登録ボタンを削除:', navbarRegisterBtns.length + '個');
      navbarRegisterBtns.forEach(function(btn) {
        if (btn.closest('.nav-item')) {
          btn.closest('.nav-item').remove();
        } else {
          btn.remove();
        }
      });
    }
    
    // 認証コード表示の削除
    const mockCodeElements = document.querySelectorAll('body > div:not(.modal):not(.toast-container)');
    mockCodeElements.forEach(function(el) {
      if (el.textContent && el.textContent.includes('テスト用認証コード')) {
        console.log('ウィンドウロード後: テスト用認証コード表示を削除します');
        el.remove();
      }
    });
  });
  
  // MutationObserverを使って動的に追加される要素もチェック
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1) { // 要素ノードの場合のみチェック
            if (node.textContent && node.textContent.includes('テスト用認証コード')) {
              console.log('動的に追加された認証コード表示を削除します');
              node.remove();
            }
          }
        }
      }
    });
  });
  
  // bodyの変更を監視
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();