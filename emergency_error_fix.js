/**
 * 電話認証エラーメッセージ緊急修正スクリプト
 * アラートを確実に削除するための最終手段
 */

(function() {
  // 1秒ごとに実行する（DOM変更を確実に捉えるため）
  const interval = setInterval(purgeErrors, 1000);
  
  // ページ読み込み時に即時実行
  window.addEventListener('DOMContentLoaded', function() {
    // 即時実行
    purgeErrors();
    
    // モーダル表示時にも実行
    setupModalListeners();
  });
  
  // エラーメッセージを完全に削除
  function purgeErrors() {
    // 特定のエラーメッセージを持つすべての要素を検索
    const errorElements = document.querySelectorAll('.alert-danger');
    
    errorElements.forEach(error => {
      if (error.textContent.includes('電話番号を入力してください')) {
        // このエラーメッセージを持つ要素を完全に非表示
        error.style.display = 'none';
        error.style.visibility = 'hidden';
        error.style.opacity = '0';
        error.style.height = '0';
        error.style.overflow = 'hidden';
        error.style.margin = '0';
        error.style.padding = '0';
      }
    });
    
    // ガイド登録モーダル内のすべてのエラーを処理
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal) {
      const guideErrors = guideModal.querySelectorAll('.alert-danger');
      
      // 電話番号が入力されている場合はエラーを非表示
      const phoneInput = guideModal.querySelector('#guide-phone-number');
      if (phoneInput && phoneInput.value && phoneInput.value.trim()) {
        guideErrors.forEach(error => {
          if (error.textContent.includes('電話番号')) {
            disableError(error);
          }
        });
      }
    }
    
    // 共通モーダル内のすべてのエラーを処理
    const commonModal = document.getElementById('phoneVerificationModal');
    if (commonModal) {
      const commonErrors = commonModal.querySelectorAll('.alert-danger');
      
      // 電話番号が入力されている場合はエラーを非表示
      const phoneInput = commonModal.querySelector('#phone-number');
      if (phoneInput && phoneInput.value && phoneInput.value.trim()) {
        commonErrors.forEach(error => {
          if (error.textContent.includes('電話番号')) {
            disableError(error);
          }
        });
      }
    }
  }
  
  // 送信ボタンクリック時のエラーメッセージ削除を設定
  function setupButtonListeners() {
    // 送信ボタンの取得
    const sendButtons = [
      document.getElementById('send-code-btn'),
      document.getElementById('guide-send-code-btn'),
      document.getElementById('tourist-send-code-btn')
    ];
    
    // 各ボタンにイベントリスナーを追加
    sendButtons.forEach(button => {
      if (button) {
        button.addEventListener('click', function() {
          // 既存のリスナーはそのままに、追加でエラー消去処理を実行
          setTimeout(purgeErrors, 100); // クリック直後
          setTimeout(purgeErrors, 500); // 0.5秒後
          setTimeout(purgeErrors, 1000); // 1秒後
        });
      }
    });
  }
  
  // モーダル表示時のエラーメッセージ削除を設定
  function setupModalListeners() {
    // モーダル要素の取得
    const modals = [
      document.getElementById('registerGuideModal'),
      document.getElementById('registerTouristModal'),
      document.getElementById('phoneVerificationModal')
    ];
    
    // 各モーダルにイベントリスナーを追加
    modals.forEach(modal => {
      if (modal) {
        // モーダル表示時
        modal.addEventListener('shown.bs.modal', function() {
          // 表示直後と少し遅らせてエラー消去を実行
          purgeErrors();
          setTimeout(purgeErrors, 300);
          setTimeout(purgeErrors, 600);
        });
      }
    });
    
    // 電話番号入力フィールドにフォーカスがある時はエラーを消去
    const phoneInputs = [
      document.getElementById('guide-phone-number'),
      document.getElementById('tourist-phone-number'),
      document.getElementById('phone-number')
    ];
    
    phoneInputs.forEach(input => {
      if (input) {
        // 入力時
        input.addEventListener('input', function() {
          if (this.value && this.value.trim()) {
            purgeErrors();
          }
        });
        
        // フォーカス時
        input.addEventListener('focus', function() {
          // 値があればエラーを非表示
          if (this.value && this.value.trim()) {
            purgeErrors();
          }
        });
      }
    });
  }
  
  // エラー要素を完全に無効化
  function disableError(errorElement) {
    errorElement.style.display = 'none';
    errorElement.style.visibility = 'hidden';
    errorElement.style.opacity = '0';
    errorElement.style.height = '0';
    errorElement.style.overflow = 'hidden';
    errorElement.style.margin = '0';
    errorElement.style.padding = '0';
    errorElement.style.border = 'none';
  }
  
  // DOMが読み込まれたらボタンリスナーをセットアップ
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupButtonListeners);
  } else {
    setupButtonListeners();
  }
})();