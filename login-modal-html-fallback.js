// ログインモーダルHTMLフォールバック
// スクリプトやCSSで修正できない場合にHTMLごと置き換える最終手段

// 即時実行関数内で実行
(function() {
  console.log('ログインモーダルHTMLフォールバックを初期化します...');
  
  // DOMの読み込みを待つ
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(checkAndReplaceLoginModal, 500);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      checkAndReplaceLoginModal();
    });
  }
  
  // モーダル表示イベントをリッスン
  document.addEventListener('shown.bs.modal', function(e) {
    if (e.target && e.target.id === 'loginModal') {
      setTimeout(fixLoginModalContent, 100);
    }
  });
  
  // モーダルのチェックと置き換え
  function checkAndReplaceLoginModal() {
    // 既存のモーダルを取得
    var loginModal = document.getElementById('loginModal');
    if (!loginModal) {
      console.log('ログインモーダルが見つかりません。後で再試行します。');
      setTimeout(checkAndReplaceLoginModal, 1000);
      return;
    }
    
    // モーダルの表示が一度でも試行されたら内容を修正
    loginModal.addEventListener('show.bs.modal', function() {
      setTimeout(fixLoginModalContent, 100);
    });
    
    // 即時実行も行う
    fixLoginModalContent();
  }
  
  // モーダル内容の修正
  function fixLoginModalContent() {
    var loginModal = document.getElementById('loginModal');
    if (!loginModal) return;
    
    var userTypeSelector = loginModal.querySelector('.user-type-selector');
    if (!userTypeSelector) {
      console.log('ユーザータイプセレクターが見つかりません');
      return;
    }
    
    // 修復済みかチェック
    if (userTypeSelector.dataset && userTypeSelector.dataset.fixed === 'true') {
      return;
    }
    
    try {
      // モーダル内のユーザータイプセレクション部分を丸ごと置き換え
      userTypeSelector.innerHTML = '<div class="text-center mb-3">' +
        '<h6 class="user-type-heading">ユーザータイプ</h6>' +
        '<div class="btn-group w-100" role="group" aria-label="ユーザータイプ選択">' +
          '<input type="radio" class="btn-check" name="login-user-type" id="login-user-tourist" value="tourist" autocomplete="off" checked>' +
          '<label class="btn btn-outline-primary" for="login-user-tourist">' +
            '<i class="bi bi-person me-1"></i> 観光客' +
          '</label>' +
          '<input type="radio" class="btn-check" name="login-user-type" id="login-user-guide" value="guide" autocomplete="off">' +
          '<label class="btn btn-outline-primary" for="login-user-guide">' +
            '<i class="bi bi-map me-1"></i> ガイド' +
          '</label>' +
        '</div>' +
        '<small id="user-type-description" class="text-muted user-type-helper mt-2">' +
          '観光客としてログインすると、ガイドを探したり予約できます' +
        '</small>' +
      '</div>';
      
      // ラジオボタンイベントを設定
      var touristRadio = loginModal.querySelector('#login-user-tourist');
      var guideRadio = loginModal.querySelector('#login-user-guide');
      var descriptionText = loginModal.querySelector('#user-type-description');
      
      if (touristRadio && guideRadio && descriptionText) {
        touristRadio.addEventListener('change', function() {
          if (this.checked) {
            descriptionText.textContent = '観光客としてログインすると、ガイドを探したり予約できます';
          }
        });
        
        guideRadio.addEventListener('change', function() {
          if (this.checked) {
            descriptionText.textContent = 'ガイドとしてログインすると、プロフィールの編集や予約の管理ができます';
          }
        });
      }
      
      // 修復済みとマーク
      if (userTypeSelector.dataset) {
        userTypeSelector.dataset.fixed = 'true';
      }
      
      // スタイル調整
      var styleElement = document.createElement('style');
      styleElement.textContent = '' +
        '#loginModal .user-type-selector {' +
          'display: block !important;' +
          'visibility: visible !important;' +
          'opacity: 1 !important;' +
        '}' +
        '#loginModal .btn-group {' +
          'display: flex !important;' +
          'visibility: visible !important;' +
          'opacity: 1 !important;' +
        '}' +
        '#loginModal label[for="login-user-tourist"],' +
        '#loginModal label[for="login-user-guide"] {' +
          'display: inline-flex !important;' +
          'visibility: visible !important;' +
          'opacity: 1 !important;' +
          'width: 50% !important;' +
          'position: relative !important;' +
          'z-index: 10 !important;' +
        '}';
      document.head.appendChild(styleElement);
      
      console.log('ログインモーダルのHTMLを直接置き換えました');
    } catch (error) {
      console.error('ログインモーダルの修復中にエラーが発生しました:', error);
    }
  }
})();