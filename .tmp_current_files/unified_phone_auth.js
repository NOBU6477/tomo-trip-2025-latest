/**
 * 統合電話認証モジュール
 * ガイドと観光客の両方に統一された認証体験を提供
 */

(function() {
  // 認証状態
  let verifiedPhoneNumbers = {};

  // DOMが完全に読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('統合電話認証モジュール: 初期化開始');
    
    // DOM要素の存在確認（デバッグ用）
    const guideSection = document.getElementById('guide-phone-verification-section');
    const touristSection = document.getElementById('tourist-phone-verification-section');
    console.log('初期状態 - ガイド電話認証セクション:', guideSection);
    console.log('初期状態 - 観光客電話認証セクション:', touristSection);
    
    // 認証状態の復元
    restoreVerificationState();
    
    // 送信ボタンのイベントリスナーを設定
    setupSendCodeButtons();
    
    // 確認ボタンのイベントリスナーを設定
    setupVerifyCodeButtons();
    
    // モーダル表示時の処理を設定
    setupModalEventListeners();
    
    // 初期化完了後の状態確認（デバッグ用）
    setTimeout(function() {
      console.log('初期化後 - ガイド電話認証セクション:', document.getElementById('guide-phone-verification-section'));
      console.log('初期化後 - ガイド電話認証状態表示:', document.querySelector('#guide-verification-badge-section'));
      console.log('初期化後 - 観光客電話認証セクション:', document.getElementById('tourist-phone-verification-section'));
    }, 500);
  });

  /**
   * 認証状態を復元
   */
  function restoreVerificationState() {
    try {
      const savedState = localStorage.getItem('verifiedPhoneNumbers');
      if (savedState) {
        verifiedPhoneNumbers = JSON.parse(savedState);
        console.log('認証状態を復元しました:', verifiedPhoneNumbers);
      }
    } catch (error) {
      console.error('認証状態の復元に失敗しました:', error);
      verifiedPhoneNumbers = {};
    }
  }

  /**
   * 認証状態を保存
   */
  function saveVerificationState() {
    try {
      localStorage.setItem('verifiedPhoneNumbers', JSON.stringify(verifiedPhoneNumbers));
      console.log('認証状態を保存しました:', verifiedPhoneNumbers);
    } catch (error) {
      console.error('認証状態の保存に失敗しました:', error);
    }
  }

  /**
   * 電話番号の認証状態を設定
   * @param {string} userType - ユーザータイプ ('guide' または 'tourist')
   * @param {string} phoneNumber - 電話番号
   * @param {boolean} isVerified - 認証状態
   */
  function setPhoneVerified(userType, phoneNumber, isVerified) {
    if (!phoneNumber) return;
    
    // 国際形式に変換
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    // 状態を保存
    verifiedPhoneNumbers[userType] = {
      number: formattedNumber,
      verified: isVerified,
      timestamp: Date.now()
    };
    
    // ストレージに保存
    saveVerificationState();
    
    // グローバル変数にも保存（他のスクリプトとの互換性のため）
    window.verifiedPhoneNumber = formattedNumber;
    
    // UI更新
    updateVerificationUI(userType);
  }

  /**
   * 電話番号が認証済みかチェック
   * @param {string} userType - ユーザータイプ
   * @returns {boolean} 認証済みかどうか
   */
  function isPhoneVerified(userType) {
    return verifiedPhoneNumbers[userType]?.verified || false;
  }

  /**
   * 認証済みの電話番号を取得
   * @param {string} userType - ユーザータイプ
   * @returns {string|null} 認証済み電話番号
   */
  function getVerifiedPhone(userType) {
    return verifiedPhoneNumbers[userType]?.number || null;
  }

  /**
   * 電話番号を国際形式に変換
   * @param {string} phoneNumber - 電話番号
   * @returns {string} 国際形式の電話番号
   */
  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    
    // 先頭の0を削除し、+81を追加
    if (phoneNumber.startsWith('0')) {
      return '+81' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+')) {
      return '+81' + phoneNumber;
    }
    
    return phoneNumber;
  }

  /**
   * 表示用に電話番号をフォーマット
   * @param {string} phoneNumber - 電話番号
   * @returns {string} 表示用の電話番号
   */
  function formatPhoneNumberForDisplay(phoneNumber) {
    if (!phoneNumber) return '';
    
    // +81 90-1234-5678 形式に整形
    if (phoneNumber.startsWith('+81')) {
      const stripped = phoneNumber.replace('+81', '');
      if (stripped.length === 9) { // モバイル番号
        return '+81 ' + stripped.replace(/(\d{2})(\d{4})(\d{3})/, '$1-$2-$3');
      } else if (stripped.length === 8) { // 固定電話
        return '+81 ' + stripped.replace(/(\d{1})(\d{4})(\d{3})/, '$1-$2-$3');
      }
    }
    
    return phoneNumber;
  }

  /**
   * 認証UIを更新
   * @param {string} userType - ユーザータイプ
   */
  function updateVerificationUI(userType) {
    console.log(`${userType}の認証UI更新`);
    
    const isVerified = isPhoneVerified(userType);
    const phoneNumber = getVerifiedPhone(userType);
    
    // モーダルを取得
    const modalId = `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
    const modal = document.getElementById(modalId);
    
    if (!modal) {
      console.log(`${modalId}が見つかりません`);
      return;
    }
    
    // 認証状態表示コンテナを取得
    const statusContainer = modal.querySelector('.phone-verification-status');
    if (statusContainer) {
      if (isVerified) {
        // 認証済み状態にする
        statusContainer.classList.add('verified');
        
        // 認証済み電話番号を表示
        const verifiedPhoneEl = statusContainer.querySelector(`#${userType}-verified-phone`);
        if (verifiedPhoneEl) {
          verifiedPhoneEl.textContent = formatPhoneNumberForDisplay(phoneNumber);
        }
      } else {
        // 未認証状態にする
        statusContainer.classList.remove('verified');
      }
    }
    
    // 認証完了メッセージを表示/非表示
    const verificationSection = modal.querySelector(`#${userType}-phone-verification-section`);
    if (verificationSection) {
      let successMessage = verificationSection.querySelector('.phone-verification-success');
      
      if (isVerified) {
        // 認証完了メッセージがなければ作成
        if (!successMessage) {
          successMessage = document.createElement('div');
          successMessage.className = 'alert alert-success phone-verification-success';
          successMessage.innerHTML = '電話番号認証が完了しました';
          verificationSection.prepend(successMessage);
        } else {
          successMessage.classList.remove('d-none');
        }
        
        // 入力欄を無効化
        const phoneInput = verificationSection.querySelector(`#${userType}-phone-number`);
        const sendButton = verificationSection.querySelector(`#${userType}-send-code-btn`);
        const codeInput = verificationSection.querySelector(`#${userType}-verification-code`);
        const verifyButton = verificationSection.querySelector(`#${userType}-verify-code-btn`);
        
        if (phoneInput) phoneInput.disabled = true;
        if (sendButton) sendButton.disabled = true;
        if (codeInput) codeInput.closest('.mb-4')?.classList.add('d-none');
        if (verifyButton) verifyButton.closest('.mb-4')?.classList.add('d-none');
      } else {
        // 認証完了メッセージを非表示
        if (successMessage) {
          successMessage.classList.add('d-none');
        }
        
        // 入力欄を有効化
        const phoneInput = verificationSection.querySelector(`#${userType}-phone-number`);
        const sendButton = verificationSection.querySelector(`#${userType}-send-code-btn`);
        const codeInput = verificationSection.querySelector(`#${userType}-verification-code`);
        const verifyButton = verificationSection.querySelector(`#${userType}-verify-code-btn`);
        
        if (phoneInput) phoneInput.disabled = false;
        if (sendButton) sendButton.disabled = false;
        if (codeInput) codeInput.closest('.mb-4')?.classList.remove('d-none');
        if (verifyButton) verifyButton.closest('.mb-4')?.classList.remove('d-none');
      }
    }
  }

  /**
   * 送信ボタンのイベントリスナーを設定
   */
  function setupSendCodeButtons() {
    // 観光客用送信ボタン
    const touristSendBtn = document.getElementById('tourist-send-code-btn');
    if (touristSendBtn) {
      touristSendBtn.addEventListener('click', function() {
        const phoneNumber = document.getElementById('tourist-phone-number')?.value || '';
        // より緩やかな検証（空でなければOK）
        if (phoneNumber.trim()) {
          handleSendCode('tourist', phoneNumber);
        } else {
          showFeedback('tourist', '電話番号を入力してください', 'error');
        }
      });
    }
    
    // ガイド用送信ボタン
    const guideSendBtn = document.getElementById('guide-send-code-btn');
    if (guideSendBtn) {
      guideSendBtn.addEventListener('click', function() {
        const phoneNumber = document.getElementById('guide-phone-number')?.value || '';
        // より緩やかな検証（空でなければOK）
        if (phoneNumber.trim()) {
          handleSendCode('guide', phoneNumber);
        } else {
          showFeedback('guide', '電話番号を入力してください', 'error');
        }
      });
    }
    
    // 共通送信ボタン
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', function() {
        const phoneNumber = document.getElementById('phone-number')?.value || '';
        // より緩やかな検証（空でなければOK）
        if (phoneNumber.trim()) {
          // 現在のユーザータイプを取得
          const userType = window.currentUserRegistrationType || 'tourist';
          handleSendCode(userType, phoneNumber);
          
          // エラーメッセージがあれば非表示にする
          const errorMessage = document.querySelector('.alert-danger');
          if (errorMessage) {
            errorMessage.classList.add('d-none');
          }
        } else {
          showFeedback('common', '電話番号を入力してください', 'error');
        }
      });
    }
    
    // 電話番号入力フィールドでのEnterキー押下対応
    const phoneInputs = [
      document.getElementById('tourist-phone-number'),
      document.getElementById('guide-phone-number'),
      document.getElementById('phone-number')
    ];
    
    phoneInputs.forEach(input => {
      if (input) {
        input.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            event.preventDefault(); // Enterキーのデフォルト動作（フォーム送信）を阻止
            
            const userType = input.id.includes('tourist') ? 'tourist' : 
                           input.id.includes('guide') ? 'guide' : 'common';
            
            const sendBtn = document.getElementById(
              userType === 'common' ? 'send-code-btn' : `${userType}-send-code-btn`
            );
            
            if (sendBtn) {
              sendBtn.click();
            }
            
            return false; // イベント伝播を停止
          }
        });
      }
    });
  }

  /**
   * 認証コード送信処理
   * @param {string} userType - ユーザータイプ
   * @param {string} phoneNumber - 電話番号
   */
  function handleSendCode(userType, phoneNumber) {
    console.log(`${userType} - 認証コード送信:`, phoneNumber);
    
    // 送信ボタンを処理中状態に
    const buttonId = userType === 'common' ? 'send-code-btn' : `${userType}-send-code-btn`;
    const sendButton = document.getElementById(buttonId);
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
    }
    
    // モーダルを特定
    const modalId = userType === 'common' 
      ? 'phoneVerificationModal' 
      : `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
    
    const modal = document.getElementById(modalId);
    if (modal) {
      // すべてのエラーメッセージを非表示にする
      const errorElements = modal.querySelectorAll('.alert-danger');
      errorElements.forEach(error => {
        error.classList.add('d-none');
      });
    }
    
    // Firebase認証APIを使用（または専用モック機能）
    if (window.firebaseAuth && typeof window.firebaseAuth.signInWithPhone === 'function') {
      // 国際形式に変換
      const formattedNumber = formatPhoneNumber(phoneNumber);
      
      window.firebaseAuth.signInWithPhone(formattedNumber)
        .then(result => {
          // 送信ボタンを元に戻す
          if (sendButton) {
            sendButton.disabled = false;
            sendButton.textContent = '認証コード送信';
          }
          
          if (result.success) {
            // 認証コード送信成功
            showFeedback(userType, 'SMSを送信しました。テスト環境では「123456」を使用できます', 'success');
            
            // 認証コード入力欄を表示
            showCodeInputField(userType);
          } else {
            // 認証コード送信失敗
            showFeedback(userType, result.error || 'SMSの送信に失敗しました', 'error');
          }
        })
        .catch(error => {
          console.error('認証コード送信エラー:', error);
          
          // 送信ボタンを元に戻す
          if (sendButton) {
            sendButton.disabled = false;
            sendButton.textContent = '認証コード送信';
          }
          
          showFeedback(userType, error.message || 'SMSの送信に失敗しました', 'error');
        });
    } else {
      // Firebase APIがない場合はモック処理
      setTimeout(() => {
        // 送信ボタンを元に戻す
        if (sendButton) {
          sendButton.disabled = false;
          sendButton.textContent = '認証コード送信';
        }
        
        // 認証コード送信成功
        showFeedback(userType, 'テスト環境では認証コード「123456」を使用できます', 'success');
        
        // 認証コード入力欄を表示
        showCodeInputField(userType);
      }, 1000);
    }
  }

  /**
   * 認証コード入力欄を表示
   * @param {string} userType - ユーザータイプ
   */
  function showCodeInputField(userType) {
    const modalId = userType === 'common' 
      ? 'phoneVerificationModal' 
      : `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
    
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // 入力欄を表示
    const codeInputId = userType === 'common' ? 'verification-code' : `${userType}-verification-code`;
    const codeInput = modal.querySelector(`#${codeInputId}`);
    if (codeInput) {
      const codeSection = codeInput.closest('.mb-4');
      if (codeSection) {
        codeSection.classList.remove('d-none');
        // 入力フォーカス
        setTimeout(() => codeInput.focus(), 100);
      }
    }
    
    // 確認ボタンを表示
    const verifyBtnId = userType === 'common' ? 'verify-code-btn' : `${userType}-verify-code-btn`;
    const verifyBtn = modal.querySelector(`#${verifyBtnId}`);
    if (verifyBtn) {
      const verifySection = verifyBtn.closest('.mb-4');
      if (verifySection) {
        verifySection.classList.remove('d-none');
      }
    }
  }

  /**
   * 確認ボタンのイベントリスナーを設定
   */
  function setupVerifyCodeButtons() {
    // 観光客用確認ボタン
    const touristVerifyBtn = document.getElementById('tourist-verify-code-btn');
    if (touristVerifyBtn) {
      touristVerifyBtn.addEventListener('click', function() {
        const code = document.getElementById('tourist-verification-code')?.value || '';
        const phoneNumber = document.getElementById('tourist-phone-number')?.value || '';
        if (code.trim().length > 0) {
          handleVerifyCode('tourist', code, phoneNumber);
        } else {
          showFeedback('tourist', '認証コードを入力してください', 'error');
        }
      });
    }
    
    // ガイド用確認ボタン
    const guideVerifyBtn = document.getElementById('guide-verify-code-btn');
    if (guideVerifyBtn) {
      guideVerifyBtn.addEventListener('click', function() {
        const code = document.getElementById('guide-verification-code')?.value || '';
        const phoneNumber = document.getElementById('guide-phone-number')?.value || '';
        if (code.trim().length > 0) {
          handleVerifyCode('guide', code, phoneNumber);
        } else {
          showFeedback('guide', '認証コードを入力してください', 'error');
        }
      });
    }
    
    // 共通確認ボタン
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    if (verifyCodeBtn) {
      verifyCodeBtn.addEventListener('click', function() {
        const code = document.getElementById('verification-code')?.value || '';
        const phoneNumber = document.getElementById('phone-number')?.value || '';
        if (code.trim().length > 0) {
          // 現在のユーザータイプを取得
          const userType = window.currentUserRegistrationType || 'tourist';
          handleVerifyCode('common', code, phoneNumber, userType);
        } else {
          showFeedback('common', '認証コードを入力してください', 'error');
        }
      });
    }
    
    // Enter キー押下でコード送信
    const codeInputs = [
      document.getElementById('tourist-verification-code'),
      document.getElementById('guide-verification-code'),
      document.getElementById('verification-code')
    ];
    
    codeInputs.forEach(input => {
      if (input) {
        input.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            event.preventDefault(); // Enterキーのデフォルト動作（フォーム送信）を阻止
            
            const userType = input.id.includes('tourist') ? 'tourist' : 
                            input.id.includes('guide') ? 'guide' : 'common';
            
            const verifyBtn = document.getElementById(
              userType === 'common' ? 'verify-code-btn' : `${userType}-verify-code-btn`
            );
            
            if (verifyBtn) {
              verifyBtn.click();
            }
            
            return false; // イベント伝播を停止
          }
        });
      }
    });
  }

  /**
   * 認証コード確認処理
   * @param {string} userType - ユーザータイプ (common の場合は共通モーダル)
   * @param {string} code - 認証コード
   * @param {string} phoneNumber - 電話番号
   * @param {string} targetType - common の場合の実際のターゲットタイプ
   */
  function handleVerifyCode(userType, code, phoneNumber, targetType = null) {
    console.log(`${userType} - 認証コード確認:`, code);
    
    // 確認ボタンを処理中状態に
    const buttonId = userType === 'common' ? 'verify-code-btn' : `${userType}-verify-code-btn`;
    const verifyButton = document.getElementById(buttonId);
    if (verifyButton) {
      verifyButton.disabled = true;
      verifyButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 認証中...';
    }
    
    // 実際のユーザータイプを決定
    const actualUserType = userType === 'common' ? targetType : userType;
    
    // Firebase認証APIを使用（または専用モック機能）
    if (window.firebaseAuth && typeof window.firebaseAuth.verifyPhoneCode === 'function') {
      window.firebaseAuth.verifyPhoneCode(code)
        .then(result => {
          // 確認ボタンを元に戻す
          if (verifyButton) {
            verifyButton.disabled = false;
            verifyButton.textContent = '認証する';
          }
          
          if (result.success) {
            // 認証コード確認成功
            showFeedback(userType, '電話番号認証が完了しました', 'success');
            
            // 認証状態を保存
            setPhoneVerified(actualUserType, phoneNumber, true);
            
            // 共通モーダルの場合は閉じる
            if (userType === 'common') {
              const modal = document.getElementById('phoneVerificationModal');
              if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                  setTimeout(() => bsModal.hide(), 1500);
                }
                
                // 認証完了後のコールバックを実行
                if (typeof window.onPhoneVerificationComplete === 'function') {
                  setTimeout(() => window.onPhoneVerificationComplete(result.user), 1600);
                }
              }
            }
          } else {
            // 認証コード確認失敗
            showFeedback(userType, result.error || '認証コードが無効です', 'error');
          }
        })
        .catch(error => {
          console.error('認証コード確認エラー:', error);
          
          // 確認ボタンを元に戻す
          if (verifyButton) {
            verifyButton.disabled = false;
            verifyButton.textContent = '認証する';
          }
          
          showFeedback(userType, error.message || '認証に失敗しました', 'error');
        });
    } else {
      // Firebase APIがない場合はモック処理
      setTimeout(() => {
        // 確認ボタンを元に戻す
        if (verifyButton) {
          verifyButton.disabled = false;
          verifyButton.textContent = '認証する';
        }
        
        // テスト用コードのチェック
        if (code === '123456') {
          // 認証コード確認成功
          showFeedback(userType, '電話番号認証が完了しました', 'success');
          
          // 認証状態を保存
          setPhoneVerified(actualUserType, phoneNumber, true);
          
          // 共通モーダルの場合は閉じる
          if (userType === 'common') {
            const modal = document.getElementById('phoneVerificationModal');
            if (modal) {
              const bsModal = bootstrap.Modal.getInstance(modal);
              if (bsModal) {
                setTimeout(() => bsModal.hide(), 1500);
              }
              
              // 認証完了後のコールバックを実行
              if (typeof window.onPhoneVerificationComplete === 'function') {
                setTimeout(() => window.onPhoneVerificationComplete({ phoneNumber }), 1600);
              }
            }
          }
        } else {
          // 認証コード確認失敗
          showFeedback(userType, '認証コードが無効です。テスト環境では「123456」を使用してください', 'error');
        }
      }, 1000);
    }
  }

  /**
   * フィードバックメッセージを表示
   * @param {string} userType - ユーザータイプ
   * @param {string} message - メッセージ
   * @param {string} type - メッセージタイプ ('success', 'error', 'info', 'warning')
   */
  function showFeedback(userType, message, type = 'info') {
    console.log(`${userType} - フィードバック (${type}):`, message);
    
    // モーダルを特定
    let modalId;
    let alertContainerId;
    
    if (userType === 'common') {
      modalId = 'phoneVerificationModal';
      alertContainerId = 'verification-alert';
    } else {
      modalId = `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
      alertContainerId = `${userType}-verification-alert`;
    }
    
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`モーダル ${modalId} が見つかりません`);
      return;
    }
    
    // アラートコンテナを取得または作成
    let alertContainer = modal.querySelector(`#${alertContainerId}`);
    if (!alertContainer) {
      // アラートコンテナが見つからない場合は検索範囲を広げる
      alertContainer = modal.querySelector('.alert:not(.alert-success)');
    }
    
    // それでも見つからない場合は新規作成
    if (!alertContainer) {
      console.log('新しいアラートコンテナを作成します');
      
      let targetSection;
      
      if (userType === 'guide' || userType === 'tourist') {
        targetSection = modal.querySelector(`#${userType}-phone-verification-section`);
      }
      
      if (!targetSection) {
        targetSection = modal.querySelector('.modal-body') || modal;
      }
      
      if (targetSection) {
        // 既存のコード入力セクションの後に挿入
        const codeInputSection = targetSection.querySelector('.mb-4:has(input[type="text"])');
        
        alertContainer = document.createElement('div');
        alertContainer.id = alertContainerId;
        alertContainer.className = 'alert mt-3';
        
        if (codeInputSection) {
          codeInputSection.parentNode.insertBefore(alertContainer, codeInputSection.nextSibling);
        } else {
          targetSection.appendChild(alertContainer);
        }
      } else {
        console.error('フィードバック表示に必要なセクションが見つかりません');
        return;
      }
    }
    
    // アラートのタイプに応じたクラスとアイコンを設定
    let alertClass = 'alert-info';
    let icon = '<i class="bi bi-info-circle me-2"></i>';
    
    if (type === 'error') {
      alertClass = 'alert-danger';
      icon = '<i class="bi bi-exclamation-circle me-2"></i>';
    } else if (type === 'success') {
      alertClass = 'alert-success';
      icon = '<i class="bi bi-check-circle me-2"></i>';
    } else if (type === 'warning') {
      alertClass = 'alert-warning';
      icon = '<i class="bi bi-exclamation-triangle me-2"></i>';
    }
    
    // アラート要素のクラスとテキストを設定
    alertContainer.className = `alert ${alertClass}`;
    alertContainer.innerHTML = `${icon}${message}`;
    alertContainer.classList.remove('d-none');
    
    // 一定時間後に自動的に非表示（エラー以外）
    if (type !== 'error') {
      setTimeout(function() {
        if (alertContainer && alertContainer.parentNode) {
          alertContainer.classList.add('d-none');
        }
      }, 5000);
    }
    
    // エラーの場合、入力フィールドにフォーカス
    if (type === 'error') {
      if (message.includes('電話番号')) {
        const phoneInput = modal.querySelector(`#${userType === 'common' ? 'phone-number' : `${userType}-phone-number`}`);
        if (phoneInput) {
          setTimeout(() => phoneInput.focus(), 100);
        }
      } else if (message.includes('認証コード')) {
        const codeInput = modal.querySelector(`#${userType === 'common' ? 'verification-code' : `${userType}-verification-code`}`);
        if (codeInput) {
          setTimeout(() => codeInput.focus(), 100);
        }
      }
    }
  }

  /**
   * モーダル表示時のイベントリスナーを設定
   */
  function setupModalEventListeners() {
    // ガイド登録モーダル
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal) {
      guideModal.addEventListener('shown.bs.modal', function() {
        updateVerificationUI('guide');
        
        // エラーメッセージがあれば非表示にする
        const errorElements = guideModal.querySelectorAll('.alert-danger');
        errorElements.forEach(error => {
          error.classList.add('d-none');
        });
      });
    }
    
    // 観光客登録モーダル
    const touristModal = document.getElementById('registerTouristModal');
    if (touristModal) {
      touristModal.addEventListener('shown.bs.modal', function() {
        updateVerificationUI('tourist');
        
        // エラーメッセージがあれば非表示にする
        const errorElements = touristModal.querySelectorAll('.alert-danger');
        errorElements.forEach(error => {
          error.classList.add('d-none');
        });
      });
    }
    
    // 電話認証モーダル
    const phoneModal = document.getElementById('phoneVerificationModal');
    if (phoneModal) {
      phoneModal.addEventListener('shown.bs.modal', function() {
        // 現在のユーザータイプを取得
        const userType = window.currentUserRegistrationType || 'tourist';
        
        // エラーメッセージがあれば非表示にする
        const errorElements = phoneModal.querySelectorAll('.alert-danger');
        errorElements.forEach(error => {
          error.classList.add('d-none');
        });
        
        // 電話番号入力フィールドにフォーカス
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput) {
          setTimeout(() => phoneInput.focus(), 300);
        }
        
        // 以前の認証状態を反映
        const isVerified = isPhoneVerified(userType);
        const verifiedPhone = getVerifiedPhone(userType);
        
        if (isVerified && verifiedPhone) {
          // 既に認証済みの場合は電話番号を表示
          if (phoneInput) {
            phoneInput.value = verifiedPhone.replace(/^\+81/, '0');
            phoneInput.disabled = true;
          }
          
          // 送信ボタンを無効化
          const sendCodeBtn = document.getElementById('send-code-btn');
          if (sendCodeBtn) {
            sendCodeBtn.disabled = true;
          }
          
          // メッセージを表示
          showFeedback('common', '既に認証済みの電話番号です', 'success');
        }
      });
    }
  }

  /**
   * 電話番号入力のイベントリスナーを設定
   */
  function setupPhoneInputListeners() {
    // 入力フィールドを取得
    const phoneInputs = [
      document.getElementById('tourist-phone-number'),
      document.getElementById('guide-phone-number'),
      document.getElementById('phone-number')
    ];
    
    // 各入力フィールドにイベントリスナーを設定
    phoneInputs.forEach(input => {
      if (input) {
        // 即時実行: 既存の入力があれば、エラーメッセージを非表示にする
        if (input.value && input.value.trim()) {
          const userType = input.id.includes('tourist') ? 'tourist' : 
                        input.id.includes('guide') ? 'guide' : 'common';
          
          // 親モーダルを取得
          const modalId = userType === 'common' 
            ? 'phoneVerificationModal' 
            : `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
          
          const modal = document.getElementById(modalId);
          if (modal) {
            // すべてのエラーメッセージを探して非表示
            const errorElements = modal.querySelectorAll('.alert-danger');
            errorElements.forEach(error => {
              error.classList.add('d-none');
            });
          }
        }
        
        // 入力イベントリスナー
        input.addEventListener('input', function() {
          // 入力があればエラーメッセージを非表示にする
          if (this.value.trim()) {
            const userType = input.id.includes('tourist') ? 'tourist' : 
                          input.id.includes('guide') ? 'guide' : 'common';
            
            // 親モーダルを取得
            const modalId = userType === 'common' 
              ? 'phoneVerificationModal' 
              : `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
            
            const modal = document.getElementById(modalId);
            if (modal) {
              // エラーメッセージを探す
              const errorElements = modal.querySelectorAll('.alert-danger');
              errorElements.forEach(error => {
                error.classList.add('d-none');
              });
            }
          }
        });
        
        // フォーカスイベントリスナー (フォーカス時にもエラーを消す)
        input.addEventListener('focus', function() {
          if (this.value.trim()) {
            const userType = input.id.includes('tourist') ? 'tourist' : 
                          input.id.includes('guide') ? 'guide' : 'common';
            
            // 親モーダルを取得
            const modalId = userType === 'common' 
              ? 'phoneVerificationModal' 
              : `register${userType.charAt(0).toUpperCase() + userType.slice(1)}Modal`;
            
            const modal = document.getElementById(modalId);
            if (modal) {
              // エラーメッセージを探す
              const errorElements = modal.querySelectorAll('.alert-danger');
              errorElements.forEach(error => {
                error.classList.add('d-none');
              });
            }
          }
        });
      }
    });
  }

  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    // 認証状態を復元
    restoreVerificationState();
    
    // 送信ボタンのイベントリスナーを設定
    setupSendCodeButtons();
    
    // 確認ボタンのイベントリスナーを設定
    setupVerifyCodeButtons();
    
    // モーダル表示時のイベントリスナーを設定
    setupModalEventListeners();
    
    // 電話番号入力のイベントリスナーを設定
    setupPhoneInputListeners();
    
    console.log('電話認証モジュールが初期化されました');
  });

  // グローバル関数として公開
  window.phoneAuth = {
    isPhoneVerified,
    getVerifiedPhone,
    setPhoneVerified,
    updateVerificationUI
  };
})();