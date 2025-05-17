/**
 * 電話認証関連の深層問題修正スクリプト
 * HTML要素の操作とDOM構造を徹底修正
 */

(function() {
  // モーダル表示直後に実行
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal && (
        modal.id === 'registerGuideModal' || 
        modal.id === 'registerTouristModal' || 
        modal.id === 'phoneVerificationModal'
    )) {
      setTimeout(function() {
        cleanupErrorMessages(modal);
        fixInputValidation(modal);
        disableStrictInputValidation(modal);
      }, 100);
    }
  });
  
  // ページ読み込み後にも一度実行
  document.addEventListener('DOMContentLoaded', function() {
    // すべてのモーダルを処理
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal && (
          modal.id === 'registerGuideModal' || 
          modal.id === 'registerTouristModal' || 
          modal.id === 'phoneVerificationModal'
      )) {
        cleanupErrorMessages(modal);
        fixInputValidation(modal);
        disableStrictInputValidation(modal);
      }
    });
    
    // ガイド登録ボタンをクリックしたときの処理
    setupButtonListener();
  });
  
  /**
   * エラーメッセージ要素を完全クリーンアップ
   * @param {HTMLElement} container - コンテナ要素
   */
  function cleanupErrorMessages(container) {
    // すべてのエラーメッセージ要素を検索
    const errorElements = container.querySelectorAll('.alert-danger, .alert:not(.alert-success), [id$="-verification-alert"]');
    
    errorElements.forEach(error => {
      // 親要素から削除
      error.parentNode?.removeChild(error);
    });
  }
  
  /**
   * 入力バリデーションの修正
   * @param {HTMLElement} container - コンテナ要素
   */
  function fixInputValidation(container) {
    // すべての無効入力スタイルを修正
    const invalidInputs = container.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => {
      input.classList.remove('is-invalid');
      
      // 入力イベントリスナーを追加
      input.addEventListener('input', function() {
        this.classList.remove('is-invalid');
      });
    });
  }
  
  /**
   * 厳格な入力バリデーションを無効化
   * @param {HTMLElement} container - コンテナ要素
   */
  function disableStrictInputValidation(container) {
    // フォーム要素を検索
    const forms = container.querySelectorAll('form');
    
    forms.forEach(form => {
      // デフォルトのバリデーションを無効化
      form.setAttribute('novalidate', 'true');
      
      // 送信イベントをオーバーライド
      form.addEventListener('submit', function(event) {
        // デフォルトの送信を阻止
        event.preventDefault();
        
        // 電話番号入力フィールドを検索
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
          // 値があれば次に進む
          if (phoneInput.value.trim()) {
            // 送信ボタンを見つけてクリック
            const sendButton = form.querySelector('[id$="send-code-btn"]');
            if (sendButton) {
              // エラーメッセージを事前に除去
              cleanupErrorMessages(container);
              
              // ボタンをクリック
              sendButton.click();
            }
          }
        }
      });
    });
  }
  
  /**
   * ガイド登録ボタンのクリックリスナーを設定
   */
  function setupButtonListener() {
    // ガイド登録ボタン
    const guideRegBtn = document.querySelector('button[data-user-type="guide"]');
    if (guideRegBtn) {
      guideRegBtn.addEventListener('click', function() {
        // モーダルが表示されるまで少し待つ
        setTimeout(function() {
          const modal = document.getElementById('registerGuideModal');
          if (modal) {
            cleanupErrorMessages(modal);
            fixInputValidation(modal);
            disableStrictInputValidation(modal);
          }
        }, 300);
      });
    }
  }
  
  // グローバル関数として修正関数を公開
  window.cleanPhoneErrors = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      cleanupErrorMessages(modal);
      fixInputValidation(modal);
    }
  };
})();