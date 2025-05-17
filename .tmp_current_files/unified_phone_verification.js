/**
 * 統合された電話番号認証システム
 * ガイド登録およびツーリスト登録の両方で使用可能な共通のシステム
 */

(function() {
  // SMSコード確認のためのテスト用コード（本番環境では実際のSMS APIと連携）
  const TEST_VERIFICATION_CODE = '123456';
  
  // モーダル表示時のイベントリスナー
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    
    // ガイド登録モーダルか確認
    if (modal && modal.id === 'registerGuideModal') {
      setupPhoneVerification(modal, 'guide');
    }
    
    // ツーリスト登録モーダルか確認
    if (modal && modal.id === 'registerTouristModal') {
      setupPhoneVerification(modal, 'tourist');
    }
  });
  
  // 電話番号認証セクションをセットアップ
  function setupPhoneVerification(modal, userType) {
    // 電話認証セクションを探す
    let phoneSection = modal.querySelector(`#${userType}-phone-verification-section`);
    
    // セクションがなければ作成
    if (!phoneSection) {
      phoneSection = createPhoneVerificationSection(userType);
      
      // モーダルボディに挿入する位置
      const modalBody = modal.querySelector('.modal-body');
      if (!modalBody) {
        console.error('モーダルボディが見つかりません');
        return;
      }
      
      // 挿入位置を決定（ガイド登録モーダルの場合は特別処理）
      if (userType === 'guide') {
        // 自己紹介フィールドを探す
        const bioField = modalBody.querySelector('textarea');
        const emailField = modalBody.querySelector('input[type="email"]');
        const genderField = modalBody.querySelector('select');
        
        if (bioField && bioField.closest('.form-group')) {
          // 自己紹介の前に挿入
          const bioGroup = bioField.closest('.form-group');
          modalBody.insertBefore(phoneSection, bioGroup);
        } else if (genderField && genderField.closest('.form-group')) {
          // 性別フィールドの後に挿入
          const genderGroup = genderField.closest('.form-group');
          if (genderGroup.nextSibling) {
            modalBody.insertBefore(phoneSection, genderGroup.nextSibling);
          } else {
            modalBody.appendChild(phoneSection);
          }
        } else if (emailField && emailField.closest('.form-group')) {
          // メールアドレスフィールドの後に挿入
          const emailGroup = emailField.closest('.form-group');
          if (emailGroup.nextSibling) {
            modalBody.insertBefore(phoneSection, emailGroup.nextSibling);
          } else {
            modalBody.appendChild(phoneSection);
          }
        } else {
          // 適切な位置が見つからない場合は電話番号フィールドを探す
          const phoneField = modalBody.querySelector('input[type="tel"]');
          if (phoneField && phoneField.closest('.form-group')) {
            // 既存の電話番号フィールドを置き換え
            const phoneGroup = phoneField.closest('.form-group');
            phoneGroup.parentNode.replaceChild(phoneSection, phoneGroup);
          } else {
            // 最後に追加
            modalBody.appendChild(phoneSection);
          }
        }
      } else {
        // ツーリスト用または他のモーダルの場合
        const introTextarea = modalBody.querySelector('textarea[id$="bio"]') || 
                              modalBody.querySelector('textarea[id$="introduction"]');
        
        if (introTextarea && introTextarea.closest('.form-group')) {
          const introFormGroup = introTextarea.closest('.form-group');
          modalBody.insertBefore(phoneSection, introFormGroup.nextSibling);
        } else {
          // 適切な位置が見つからない場合は最後に追加
          modalBody.appendChild(phoneSection);
        }
      }
    }
    
    // 電話番号入力フィールド
    const phoneNumberInput = modal.querySelector(`#${userType}-phone-number`) || 
                             modal.querySelector(`#phone-number`);
    
    // コード送信ボタン
    const sendCodeBtn = modal.querySelector(`#${userType}-send-code-btn`) || 
                         modal.querySelector(`#send-code-btn`);
    
    // 電話番号入力欄があるか確認
    if (!phoneNumberInput || !sendCodeBtn) {
      console.error('電話番号入力欄またはボタンが見つかりません');
      return;
    }
    
    // 「未表示」テキスト
    let unverifiedText = modal.querySelector('.unverified-text') || 
                         modal.querySelector('#unverified-text');
    
    // 未認証テキストがない場合は作成
    if (!unverifiedText) {
      unverifiedText = document.createElement('span');
      unverifiedText.id = 'unverified-text';
      unverifiedText.className = 'unverified-text';
      unverifiedText.textContent = '未表示';
      
      if (phoneNumberInput.parentNode) {
        phoneNumberInput.parentNode.appendChild(unverifiedText);
      }
    }
    
    // 認証コード入力欄とボタンのコンテナ
    let verificationContainer = modal.querySelector('.verification-code-container');
    
    // 認証コード入力欄がなければ作成
    if (!verificationContainer) {
      verificationContainer = document.createElement('div');
      verificationContainer.className = 'verification-code-container mt-3 d-none';
      
      // コンテナ内のHTML構造
      verificationContainer.innerHTML = `
        <div class="form-group mb-3">
          <label for="${userType}-verification-code">認証コード</label>
          <input type="text" class="form-control" id="${userType}-verification-code" placeholder="SMSで送信された6桁のコードを入力してください">
          <div class="verification-info mt-2">SMSで送信された6桁のコードを入力してください</div>
        </div>
        <button type="button" class="btn btn-primary w-100" id="${userType}-verify-code-btn">認証する</button>
        <div id="${userType}-verification-alert" class="alert mt-3 d-none"></div>
      `;
      
      phoneSection.appendChild(verificationContainer);
    }
    
    // 認証入力欄
    const codeInput = modal.querySelector(`#${userType}-verification-code`);
    // 認証ボタン
    const verifyButton = modal.querySelector(`#${userType}-verify-code-btn`);
    // アラート表示領域
    const alertDiv = modal.querySelector(`#${userType}-verification-alert`);
    
    // イベントリスナー設定：コード送信
    sendCodeBtn.addEventListener('click', function() {
      handleSendCode(phoneNumberInput, verificationContainer, alertDiv, userType);
    });
    
    // イベントリスナー設定：認証
    if (verifyButton) {
      verifyButton.addEventListener('click', function() {
        if (codeInput) {
          handleVerifyCode(codeInput.value, unverifiedText, alertDiv, userType);
        }
      });
    }
    
    // 電話番号入力のEnterキーでもコード送信
    phoneNumberInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendCode(phoneNumberInput, verificationContainer, alertDiv, userType);
      }
    });
    
    // 認証コード入力のEnterキーでも認証
    if (codeInput) {
      codeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleVerifyCode(codeInput.value, unverifiedText, alertDiv, userType);
        }
      });
    }
  }
  
  // 認証コード送信の処理
  function handleSendCode(phoneInput, codeContainer, alertDiv, userType) {
    const phoneNumber = phoneInput.value.trim();
    
    // 電話番号の簡易バリデーション
    if (!phoneNumber) {
      showAlert(alertDiv, '電話番号を入力してください', 'danger');
      return;
    }
    
    // 電話番号の形式チェック - より緩やかなチェックに
    const phonePattern = /^\+?[0-9\s\-()]{6,20}$/;
    if (!phonePattern.test(phoneNumber)) {
      showAlert(alertDiv, '有効な電話番号を入力してください', 'danger');
      return;
    }
    
    // コード送信中の表示
    showAlert(alertDiv, '認証コードを送信しています...', 'info');
    
    // 実際のSMS送信の代わりにタイマーでシミュレーション
    setTimeout(function() {
      // 認証コード入力欄を表示
      codeContainer.classList.remove('d-none');
      
      // 成功メッセージ
      showAlert(alertDiv, '認証コードを送信しました。SMSをご確認ください。', 'success');
      
      // 認証コード入力欄にフォーカス
      const codeInput = document.getElementById(`${userType}-verification-code`);
      if (codeInput) {
        codeInput.focus();
      }
      
      // 確認用のログ（本番では削除）
      console.log('テスト用認証コード: ' + TEST_VERIFICATION_CODE);
    }, 1500);
  }
  
  // 認証コード確認の処理
  function handleVerifyCode(code, unverifiedText, alertDiv, userType) {
    code = code.trim();
    
    // コードの簡易バリデーション
    if (!code) {
      showAlert(alertDiv, '認証コードを入力してください', 'danger');
      return;
    }
    
    // 認証処理中の表示
    showAlert(alertDiv, '認証コードを確認しています...', 'info');
    
    // 実際の認証の代わりにタイマーでシミュレーション
    setTimeout(function() {
      // テスト用コードと比較（本番環境では実際の検証ロジックに置き換え）
      if (code === TEST_VERIFICATION_CODE) {
        // 認証成功
        verificationSuccess(unverifiedText, alertDiv, userType);
      } else {
        // 認証失敗
        showAlert(alertDiv, '認証コードが正しくありません。再度お試しください。', 'danger');
      }
    }, 1000);
  }
  
  // 認証成功時の処理
  function verificationSuccess(unverifiedText, alertDiv, userType) {
    // 「未表示」テキストを「認証済み」バッジに置き換え
    if (unverifiedText) {
      // 新しいバッジを作成
      const verifiedBadge = document.createElement('span');
      verifiedBadge.className = 'badge bg-success verification-badge verified';
      verifiedBadge.textContent = '認証済み';
      
      // 未表示テキストを非表示にして、認証済みバッジを挿入
      unverifiedText.style.display = 'none';
      unverifiedText.parentNode.insertBefore(verifiedBadge, unverifiedText.nextSibling);
    }
    
    // 成功メッセージ
    showAlert(alertDiv, '電話番号認証が完了しました！', 'success');
    
    // 認証入力欄を非表示にする
    hideVerificationInputs(userType);
    
    // 認証状態を保存（セッションストレージ）
    sessionStorage.setItem(`${userType}-phone-verified`, 'true');
    
    // カスタムイベントを発生させて、他のスクリプトに通知
    document.dispatchEvent(new CustomEvent('phoneVerified', {
      detail: { userType: userType }
    }));
  }
  
  // 認証入力欄を非表示にする
  function hideVerificationInputs(userType) {
    const container = document.querySelector(`#${userType}-phone-verification-section .verification-code-container`);
    if (container) {
      container.classList.add('d-none');
    }
  }
  
  // 電話認証セクションを作成
  function createPhoneVerificationSection(userType) {
    const section = document.createElement('div');
    section.id = `${userType}-phone-verification-section`;
    section.className = 'phone-verification-section mb-4 p-3 bg-light rounded border';
    
    section.innerHTML = `
      <h5 class="section-title mb-3">電話番号認証</h5>
      <p class="text-muted mb-3">セキュリティのため、電話番号の認証を行ってください。</p>
      <div class="form-group mb-3">
        <label for="${userType}-phone-number">電話番号</label>
        <div class="input-group">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="${userType}-phone-number" placeholder="9012345678（先頭の0は除く）">
          <button class="btn btn-primary" type="button" id="${userType}-send-code-btn">認証コード送信</button>
        </div>
        <small class="form-text text-muted">ハイフンなしの電話番号を入力してください</small>
        <span class="unverified-text d-inline-block mt-2">未表示</span>
      </div>
    `;
    
    return section;
  }
  
  // アラートメッセージを表示
  function showAlert(alertDiv, message, type) {
    if (!alertDiv) return;
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.classList.remove('d-none');
    
    // 成功メッセージは5秒後に非表示
    if (type === 'success') {
      setTimeout(function() {
        alertDiv.classList.add('d-none');
      }, 5000);
    }
  }
  
  // DOMロード時の初期化
  document.addEventListener('DOMContentLoaded', function() {
    // 既に表示されているモーダルがあれば処理
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal) {
      setupPhoneVerification(guideModal, 'guide');
    }
    
    const touristModal = document.getElementById('registerTouristModal');
    if (touristModal) {
      setupPhoneVerification(touristModal, 'tourist');
    }
    
    // モーダル開閉のイベントリスナーをセットアップ（開く前にセットアップする）
    document.body.addEventListener('click', function(e) {
      // ガイド登録に関連するボタンクリック
      if (e.target && (
          e.target.id === 'guide-registration-btn' || 
          e.target.classList.contains('guide-register-button') ||
          e.target.closest('#guide-registration-btn') ||
          e.target.closest('.guide-register-button')
      )) {
        // モーダルが開くまで少し待つ
        setTimeout(function() {
          const guideModal = document.getElementById('registerGuideModal');
          if (guideModal) {
            setupPhoneVerification(guideModal, 'guide');
          }
        }, 300);
      }
      
      // ユーザータイプ選択モーダルの「ガイドになる」ボタン
      if (e.target && (
          e.target.id === 'guide-type-btn' ||
          e.target.closest('#guide-type-btn')
      )) {
        // モーダルが開くまで少し待つ
        setTimeout(function() {
          const guideModal = document.getElementById('registerGuideModal');
          if (guideModal) {
            setupPhoneVerification(guideModal, 'guide');
          }
        }, 300);
      }
    });
  });
  
  // 追加の初期化タイマー - モーダルが後から追加される場合のため
  setTimeout(function checkForModals() {
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal && !guideModal.querySelector('#guide-phone-verification-section')) {
      setupPhoneVerification(guideModal, 'guide');
    }
    
    const touristModal = document.getElementById('registerTouristModal');
    if (touristModal && !touristModal.querySelector('#tourist-phone-verification-section')) {
      setupPhoneVerification(touristModal, 'tourist');
    }
    
    // 定期的に確認
    setTimeout(checkForModals, 2000);
  }, 1000);
})();