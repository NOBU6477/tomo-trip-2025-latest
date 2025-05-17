/**
 * 電話番号認証機能を提供するスクリプト
 */

(function() {
  console.log('電話番号認証スクリプト初期化');
  
  // 電話認証モーダルの設定
  function setupPhoneVerification() {
    console.log('電話認証モーダルの設定');
    
    // 送信ボタンのイベントリスナー設定
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', function() {
        const phoneNumber = document.getElementById('phone-number').value;
        sendVerificationCode(phoneNumber);
      });
    }
    
    // 認証ボタンのイベントリスナー設定
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    if (verifyCodeBtn) {
      verifyCodeBtn.addEventListener('click', function() {
        const code = document.getElementById('verification-code').value;
        verifyCode(code);
      });
    }
  }
  
  // 認証コードを送信する
  async function sendVerificationCode(phoneNumber) {
    console.log('認証コード送信開始:', phoneNumber);
    
    // 入力バリデーション
    if (!phoneNumber || phoneNumber.trim() === '') {
      showMessage('電話番号を入力してください', 'error');
      return;
    }
    
    // 電話番号の国際形式への変換
    if (!phoneNumber.startsWith('+')) {
      // 日本の場合は+81を追加
      phoneNumber = '+81' + phoneNumber.replace(/^0/, '');
    }
    
    // 送信ボタンを無効化して処理中表示
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.disabled = true;
      sendCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
    }
    
    try {
      // Firebase認証APIを使用（firebase-client.jsで定義）
      if (!window.firebaseAuth) {
        throw new Error('Firebase認証APIが利用できません');
      }
      
      const result = await window.firebaseAuth.signInWithPhone(phoneNumber);
      
      // 送信ボタンを元に戻す
      if (sendCodeBtn) {
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = '認証コード送信';
      }
      
      if (result.success) {
        // 認証コード入力欄を表示
        const codeContainer = document.getElementById('verification-code-container');
        if (codeContainer) {
          codeContainer.classList.remove('d-none');
        }
        
        // 成功メッセージを表示
        showMessage(result.message || 'SMSを送信しました。認証コードを入力してください', 'success');
        
        // テスト環境向けの注意書きを表示
        const testInfo = document.getElementById('test-code-info');
        if (testInfo) {
          testInfo.textContent = 'テスト環境では認証コード「123456」を使用できます';
          testInfo.classList.remove('d-none');
        }
      } else {
        showMessage(result.error || 'SMSの送信に失敗しました', 'error');
      }
    } catch (error) {
      console.error('認証コード送信エラー:', error);
      
      // 送信ボタンを元に戻す
      if (sendCodeBtn) {
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = '認証コード送信';
      }
      
      showMessage('エラー: ' + (error.message || '認証コードの送信に失敗しました'), 'error');
    }
  }
  
  // 認証コードを確認する
  async function verifyCode(code) {
    console.log('認証コード確認開始');
    
    // 入力バリデーション
    if (!code || code.trim() === '') {
      showMessage('認証コードを入力してください', 'error');
      return;
    }
    
    // 認証ボタンを無効化して処理中表示
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    if (verifyCodeBtn) {
      verifyCodeBtn.disabled = true;
      verifyCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 認証中...';
    }
    
    try {
      // Firebase認証APIを使用（firebase-client.jsで定義）
      if (!window.firebaseAuth) {
        throw new Error('Firebase認証APIが利用できません');
      }
      
      const result = await window.firebaseAuth.verifyPhoneCode(code);
      
      // 認証ボタンを元に戻す
      if (verifyCodeBtn) {
        verifyCodeBtn.disabled = false;
        verifyCodeBtn.textContent = '認証する';
      }
      
      if (result.success) {
        // 成功メッセージを表示
        showMessage(result.message || '電話番号認証が完了しました', 'success');
        
        // モーダルを閉じる
        setTimeout(function() {
          const phoneVerificationModal = document.getElementById('phoneVerificationModal');
          if (phoneVerificationModal) {
            const bsModal = bootstrap.Modal.getInstance(phoneVerificationModal);
            if (bsModal) {
              bsModal.hide();
            }
          }
          
          // 認証完了後のコールバックがあれば実行
          if (typeof window.onPhoneVerificationComplete === 'function') {
            window.onPhoneVerificationComplete(result.user);
          }
        }, 1500);
      } else {
        showMessage(result.error || '認証コードが無効です', 'error');
      }
    } catch (error) {
      console.error('認証コード確認エラー:', error);
      
      // 認証ボタンを元に戻す
      if (verifyCodeBtn) {
        verifyCodeBtn.disabled = false;
        verifyCodeBtn.textContent = '認証する';
      }
      
      showMessage('エラー: ' + (error.message || '認証に失敗しました'), 'error');
    }
  }
  
  // メッセージを表示する
  function showMessage(message, type = 'info') {
    console.log(`メッセージ (${type}):`, message);
    
    const alertContainer = document.getElementById('phone-verification-alert');
    if (!alertContainer) return;
    
    // アラートのタイプに応じたクラスを設定
    let alertClass = 'alert-info';
    if (type === 'error') alertClass = 'alert-danger';
    if (type === 'success') alertClass = 'alert-success';
    if (type === 'warning') alertClass = 'alert-warning';
    
    // アラート要素のクラスとテキストを設定
    alertContainer.className = `alert ${alertClass}`;
    alertContainer.textContent = message;
    alertContainer.classList.remove('d-none');
    
    // 一定時間後にアラートを自動的に非表示（エラー以外）
    if (type !== 'error') {
      setTimeout(function() {
        alertContainer.classList.add('d-none');
      }, 5000);
    }
  }
  
  // 電話番号認証モーダルを表示する
  function showPhoneVerificationModal() {
    const phoneVerificationModal = document.getElementById('phoneVerificationModal');
    if (phoneVerificationModal) {
      const bsModal = new bootstrap.Modal(phoneVerificationModal);
      bsModal.show();
    }
  }
  
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    setupPhoneVerification();
    
    // リンクに電話認証モーダル表示イベントを設定
    const phoneVerificationLinks = document.querySelectorAll('[data-target="#phoneVerificationModal"]');
    phoneVerificationLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        showPhoneVerificationModal();
      });
    });
  });
  
  // グローバル関数として公開
  window.showPhoneVerificationModal = showPhoneVerificationModal;
})();