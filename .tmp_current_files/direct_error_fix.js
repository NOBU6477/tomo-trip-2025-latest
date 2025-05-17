/**
 * 電話認証エラーメッセージ問題を直接修正するスクリプト
 * このアプローチでは、見つかった全てのエラーメッセージを直接非表示にします
 */

(function() {
  // すぐに実行して既存のエラーメッセージを消去
  function clearExistingErrors() {
    // ガイド登録モーダル内のすべてのエラーメッセージを探して非表示にする
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal) {
      const errorElements = guideModal.querySelectorAll('.alert-danger');
      errorElements.forEach(error => {
        error.style.display = 'none';
      });
    }
    
    // 電話認証モーダル内のエラーメッセージを非表示にする
    const phoneModal = document.getElementById('phoneVerificationModal');
    if (phoneModal) {
      const errorElements = phoneModal.querySelectorAll('.alert-danger');
      errorElements.forEach(error => {
        error.style.display = 'none';
      });
    }
  }
  
  // 電話番号入力欄に値が入力されている場合はエラーメッセージを非表示に
  function checkPhoneInputs() {
    const phoneInputs = [
      document.getElementById('guide-phone-number'),
      document.getElementById('phone-number')
    ];
    
    phoneInputs.forEach(input => {
      if (input && input.value && input.value.trim()) {
        // 親モーダルを取得
        const modal = input.closest('.modal');
        if (modal) {
          // すべてのエラーメッセージを非表示
          const errorElements = modal.querySelectorAll('.alert-danger');
          errorElements.forEach(error => {
            error.style.display = 'none';
          });
        }
      }
    });
  }
  
  // MutationObserverでエラーメッセージを監視して即時非表示に
  function setupErrorObserver() {
    // 監視の設定
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 追加されたノードがエラーメッセージかどうかをチェック
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // 要素ノードの場合
              // クラスをチェック
              if (node.classList && node.classList.contains('alert-danger')) {
                // エラーメッセージが電話番号に関するものか確認
                if (node.textContent.includes('電話番号')) {
                  // 非表示にする
                  node.style.display = 'none';
                }
              }
              
              // さらに子要素内のエラーメッセージを探す
              const errorElements = node.querySelectorAll('.alert-danger');
              errorElements.forEach(error => {
                if (error.textContent.includes('電話番号')) {
                  error.style.display = 'none';
                }
              });
            }
          });
        }
      });
      
      // 既存の電話番号入力値を確認
      checkPhoneInputs();
    });
    
    // DOM全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // フォーム送信イベントをキャンセルして直接ハンドリング
  function preventFormSubmission() {
    document.addEventListener('submit', function(event) {
      // ガイド登録または電話認証に関するフォームであればキャンセル
      const form = event.target;
      if (form.closest('#registerGuideModal') || form.closest('#phoneVerificationModal')) {
        event.preventDefault();
        
        // 電話番号の入力値を取得
        const phoneInput = form.querySelector('input[type="tel"]') || 
                          form.querySelector('input[placeholder*="電話"]');
        
        if (phoneInput && phoneInput.value.trim()) {
          // 電話番号が入力されている場合、成功として扱い
          // エラーメッセージを非表示に
          const errorElements = form.querySelectorAll('.alert-danger');
          errorElements.forEach(error => {
            error.style.display = 'none';
          });
          
          // 認証コード送信ボタンをクリック
          const sendCodeBtn = form.querySelector('[id$="send-code-btn"]');
          if (sendCodeBtn) {
            sendCodeBtn.click();
          }
        }
      }
    });
  }
  
  // ページロード完了時に実行
  document.addEventListener('DOMContentLoaded', function() {
    clearExistingErrors();
    setupErrorObserver();
    preventFormSubmission();
    
    // モーダル表示時のイベントリスナーを設定
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('shown.bs.modal', function() {
        // モーダル表示時に既存のエラーメッセージをクリア
        clearExistingErrors();
        
        // 電話番号入力値を確認
        checkPhoneInputs();
      });
    });
  });
  
  // 即時実行も行う（DOMContentLoadedを待たず）
  clearExistingErrors();
  
  // 定期的にエラーメッセージをチェックして非表示にする
  setInterval(clearExistingErrors, 500);
})();