/**
 * ガイド電話認証処理の修正スクリプト
 * 認証コード確認プロセス後の表示を修正
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // 認証コード確認ボタンイベントの修正
    setupVerificationButtonsListeners();
    // ガイド登録モーダルの表示時にステータスを確認
    setupModalListeners();
  });

  /**
   * モーダル表示時のイベントリスナー設定
   */
  function setupModalListeners() {
    const registerGuideModal = document.getElementById('registerGuideModal');
    if (registerGuideModal) {
      registerGuideModal.addEventListener('shown.bs.modal', function() {
        // 電話番号が既に認証済みかチェック
        const verifiedPhone = localStorage.getItem('verifiedPhoneNumber');
        if (verifiedPhone) {
          updateVerifiedStatus('guide', verifiedPhone);
        }
      });
    }

    const registerTouristModal = document.getElementById('registerTouristModal');
    if (registerTouristModal) {
      registerTouristModal.addEventListener('shown.bs.modal', function() {
        // 電話番号が既に認証済みかチェック
        const verifiedPhone = localStorage.getItem('verifiedPhoneNumber');
        if (verifiedPhone) {
          updateVerifiedStatus('tourist', verifiedPhone);
        }
      });
    }
  }

  /**
   * 認証コード確認ボタンのイベント修正
   */
  function setupVerificationButtonsListeners() {
    // 既存のイベントリスナーがあればそれを活用し、拡張する
    // 検証コード送信が成功したときにバッジを適切に表示/非表示に切り替える
    document.addEventListener('click', function(event) {
      // ガイド登録モーダルのコード確認ボタンか
      if (event.target && event.target.id === 'guide-verify-code-btn') {
        handleVerifyButtonClick('guide');
      }
      // 観光客登録モーダルのコード確認ボタンか
      else if (event.target && event.target.id === 'tourist-verify-code-btn') {
        handleVerifyButtonClick('tourist');
      }
      // モーダルのコード確認ボタンか
      else if (event.target && event.target.id === 'verify-code-btn') {
        handleModalVerifyButtonClick();
      }
    });
  }

  /**
   * モーダル内の認証ボタンクリック処理
   */
  function handleModalVerifyButtonClick() {
    console.log('共通モーダルの認証ボタンがクリックされました');
    
    const codeInput = document.getElementById('verification-code');
    const phoneInput = document.getElementById('phone-number');
    
    // 検証コードと電話番号をチェック
    if (!codeInput || !codeInput.value.trim()) {
      showModalError('認証コードを入力してください');
      return;
    }
    
    if (!phoneInput || !phoneInput.value.trim()) {
      showModalError('電話番号を入力してください');
      return;
    }
    
    // テスト用認証コードをチェック
    if (codeInput.value.trim() === '123456') {
      // 電話番号を保存
      const phoneNumber = phoneInput.value.trim();
      localStorage.setItem('verifiedPhoneNumber', phoneNumber);
      window.verifiedPhoneNumber = phoneNumber;
      
      // 現在のユーザータイプを取得（存在する場合）
      const userType = window.currentUserRegistrationType || 'tourist';
      
      // 成功メッセージを表示
      showModalSuccess('電話番号認証が完了しました');
      console.log('電話番号認証が完了しました:', phoneNumber);
      
      // ユーザータイプに応じた認証状態を更新
      if (window.phoneAuth && typeof window.phoneAuth.setPhoneVerified === 'function') {
        window.phoneAuth.setPhoneVerified(userType, phoneNumber, true);
        console.log(`${userType}の認証状態を更新しました`);
      }
      
      // モーダルを閉じる
      setTimeout(function() {
        const modal = document.getElementById('phoneVerificationModal');
        if (modal) {
          const bsModal = bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
        
        // コールバック関数があれば実行
        if (typeof window.onPhoneVerificationComplete === 'function') {
          window.onPhoneVerificationComplete({
            phoneNumber: phoneNumber,
            success: true
          });
        }
      }, 1500);
    } else {
      // 無効なコードの場合
      showModalError('認証コードが無効です。テスト環境では「123456」を使用してください');
    }
  }
  
  /**
   * モーダルでエラーメッセージを表示
   */
  function showModalError(message) {
    const alertContainer = document.getElementById('verification-error');
    if (alertContainer) {
      alertContainer.textContent = message;
      alertContainer.classList.remove('d-none');
      
      // 成功メッセージを非表示
      const successAlert = document.getElementById('verification-success');
      if (successAlert) {
        successAlert.classList.add('d-none');
      }
    } else {
      // アラート要素が見つからない場合はモーダルに直接表示
      const modal = document.getElementById('phoneVerificationModal');
      if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'alert alert-danger mt-3';
          errorDiv.innerHTML = `<i class="bi bi-exclamation-circle me-2"></i>${message}`;
          
          // 既存のアラートがあれば削除
          const existingAlert = modalBody.querySelector('.alert-danger');
          if (existingAlert) {
            existingAlert.remove();
          }
          
          modalBody.appendChild(errorDiv);
        }
      }
    }
  }
  
  /**
   * モーダルで成功メッセージを表示
   */
  function showModalSuccess(message) {
    const successAlert = document.getElementById('verification-success');
    if (successAlert) {
      successAlert.textContent = message;
      successAlert.classList.remove('d-none');
      
      // エラーメッセージを非表示
      const errorAlert = document.getElementById('verification-error');
      if (errorAlert) {
        errorAlert.classList.add('d-none');
      }
    } else {
      // アラート要素が見つからない場合はモーダルに直接表示
      const modal = document.getElementById('phoneVerificationModal');
      if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          const successDiv = document.createElement('div');
          successDiv.className = 'alert alert-success mt-3';
          successDiv.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
          
          // 既存のアラートがあれば削除
          const existingAlert = modalBody.querySelector('.alert-success');
          if (existingAlert) {
            existingAlert.remove();
          }
          
          modalBody.appendChild(successDiv);
        }
      }
    }
  }

  /**
   * 認証コード確認ボタンクリック処理
   */
  function handleVerifyButtonClick(userType) {
    console.log(`${userType}の認証コード確認ボタンがクリックされました`);
    
    // 認証プロセスが成功した後にバッジを修正
    setTimeout(() => {
      // Firebase認証のモックモードで即時成功させる（開発・テスト用）
      // コード "123456" で自動認証
      const codeInput = document.getElementById(`${userType}-verification-code`);
      if (codeInput && codeInput.value.trim() === '123456') {
        const phoneInput = document.getElementById(`${userType}-phone-number`);
        if (phoneInput && phoneInput.value && phoneInput.value.trim()) {
          // 電話番号を保存
          const phoneNumber = phoneInput.value.trim();
          localStorage.setItem('verifiedPhoneNumber', phoneNumber);
          window.verifiedPhoneNumber = phoneNumber;
          
          // 認証成功メッセージを表示
          updateVerificationStatus(userType);
          
          // バッジを更新
          updateVerifiedStatus(userType, phoneNumber);
          
          console.log(`${userType}の電話番号認証が完了しました:`, phoneNumber);
          
          // 認証フィードバックを消す
          const verificationAlert = document.getElementById(`${userType}-verification-alert`);
          if (verificationAlert) {
            verificationAlert.classList.add('d-none');
          }
        } else {
          // 電話番号が無効な場合のエラーメッセージ
          showVerificationError(userType, '電話番号を入力してください');
        }
      } else if (codeInput) {
        // 認証コードが無効な場合のエラーメッセージ
        showVerificationError(userType, '認証コードが無効です。テスト環境では「123456」を使用してください');
      }
    }, 500); // 既存の処理が完了するのを待つ
  }
  
  /**
   * 検証エラーメッセージを表示
   */
  function showVerificationError(userType, message) {
    console.log(`${userType}の検証エラー:`, message);
    
    const modalId = `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
      // アラート要素を取得または作成
      let alertEl = document.getElementById(`${userType}-verification-alert`);
      
      if (!alertEl) {
        // アラート要素がなければ作成
        alertEl = document.createElement('div');
        alertEl.id = `${userType}-verification-alert`;
        alertEl.className = 'alert alert-danger mt-3';
        
        // 挿入場所を探す
        const verificationSection = modal.querySelector(`#${userType}-phone-verification-section`);
        if (verificationSection) {
          const codeInput = verificationSection.querySelector('input[type="text"]');
          if (codeInput) {
            const codeGroup = codeInput.closest('.mb-4');
            if (codeGroup && codeGroup.nextSibling) {
              codeGroup.parentNode.insertBefore(alertEl, codeGroup.nextSibling);
            } else {
              verificationSection.appendChild(alertEl);
            }
          } else {
            verificationSection.appendChild(alertEl);
          }
        }
      }
      
      // メッセージを設定
      alertEl.innerHTML = `<i class="bi bi-exclamation-circle me-2"></i>${message}`;
      alertEl.className = 'alert alert-danger mt-3';
      alertEl.classList.remove('d-none');
    }
  }

  /**
   * 認証ステータスの更新
   */
  function updateVerificationStatus(userType) {
    const modalId = `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
      // 認証成功メッセージを表示
      const successMessage = document.createElement('div');
      successMessage.className = 'alert alert-success phone-verification-success';
      successMessage.innerHTML = '電話番号認証が完了しました';
      
      // 認証フォームの前に成功メッセージを挿入
      const verificationSection = modal.querySelector(`#${userType}-phone-verification-section`) || 
                                 modal.querySelector('.mb-4');
      if (verificationSection) {
        // 既存のメッセージがあれば削除
        const existingMessage = verificationSection.querySelector('.phone-verification-success');
        if (existingMessage) {
          existingMessage.remove();
        }
        
        verificationSection.prepend(successMessage);
      }
      
      // 電話番号を取得
      const phoneNumber = localStorage.getItem('verifiedPhoneNumber') || window.verifiedPhoneNumber;
      if (phoneNumber) {
        updateVerifiedStatus(userType, phoneNumber);
      }
    }
  }

  /**
   * 認証済み状態に更新
   */
  function updateVerifiedStatus(userType, phoneNumber) {
    const modalId = `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
      // ステータス表示部分を取得
      const statusContainer = modal.querySelector('.phone-verification-status');
      if (statusContainer) {
        // 認証済みクラスを追加
        statusContainer.classList.add('verified');
        
        // 認証済み電話番号を表示
        const verifiedPhoneEl = statusContainer.querySelector(`#${userType}-verified-phone`);
        if (verifiedPhoneEl) {
          // 電話番号を整形して表示（例: +81 90-1234-5678）
          let formattedPhone = phoneNumber;
          if (phoneNumber.startsWith('0')) {
            formattedPhone = '+81 ' + phoneNumber.substring(1);
          } else if (!phoneNumber.startsWith('+')) {
            formattedPhone = '+81 ' + phoneNumber;
          }
          
          // 電話番号にハイフンを入れる整形
          formattedPhone = formattedPhone.replace(/(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
          verifiedPhoneEl.textContent = formattedPhone;
        }
      }
    }
  }
})();