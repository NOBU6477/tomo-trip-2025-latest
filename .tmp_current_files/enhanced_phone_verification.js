/**
 * 電話番号認証の強化バージョン
 * テスト用の認証コード: 123456
 */
(function() {
  // グローバル変数
  let countdownInterval;
  let remainingTime = 180; // 3分間
  let phoneNumber = '';
  let verificationInProgress = false;
  let verificationTarget = null; // ガイド登録モーダルの認証ボタン要素

  // 初期化
  function init() {
    console.log('電話番号認証機能: 初期化');
    
    // モーダルがまだ存在しない場合、HTML文字列を直接挿入
    if (!document.getElementById('phoneVerificationModal')) {
      const modalHTML = `
        <!-- 電話番号認証モーダル -->
        <div class="modal fade" id="phoneVerificationModal" tabindex="-1" aria-labelledby="phoneVerificationModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="phoneVerificationModalLabel" data-i18n="phoneVerification.title">電話番号認証</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="text-center mb-4">
                  <div class="phone-verification-icon">
                    <i data-feather="smartphone"></i>
                  </div>
                  <h4 class="phone-verification-title" data-i18n="phoneVerification.subtitle">電話番号を認証します</h4>
                  <p class="phone-verification-subtitle" data-i18n="phoneVerification.description">
                    あなたの電話番号を認証するためにSMSを送信します。<br>
                    電話番号を入力して「コードを送信」ボタンをクリックしてください。
                  </p>
                </div>
                
                <div id="phone-step-1" class="verification-step">
                  <div class="mb-3">
                    <label for="phone-number" class="form-label" data-i18n="phoneVerification.phoneNumber">電話番号</label>
                    <div class="input-group">
                      <span class="input-group-text">+81</span>
                      <input type="tel" class="form-control" id="phone-number" placeholder="90-1234-5678" maxlength="13">
                      <button class="btn btn-primary" type="button" id="send-code-btn" data-i18n="phoneVerification.sendCode">コードを送信</button>
                    </div>
                    <div class="form-text" data-i18n="phoneVerification.phoneFormat">ハイフンなし、または「-」区切りで入力してください</div>
                  </div>
                </div>
                
                <div id="phone-step-2" class="verification-step d-none">
                  <div class="mb-3">
                    <label for="verification-code" class="form-label" data-i18n="phoneVerification.enterCode">認証コードを入力</label>
                    <input type="text" class="form-control" id="verification-code" placeholder="123456" maxlength="6" autocomplete="one-time-code">
                    <div id="verification-countdown" class="verification-info mt-2">
                      認証コードは <span id="countdown-timer">03:00</span> 以内に入力してください
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button type="button" class="btn btn-outline-secondary" id="back-to-phone-btn" data-i18n="phoneVerification.back">戻る</button>
                    <button type="button" class="btn btn-primary verification-button" id="verify-code-btn" data-i18n="phoneVerification.verify">認証する</button>
                  </div>
                </div>
                
                <div id="phone-step-3" class="verification-step d-none">
                  <div class="text-center mb-4">
                    <div class="verification-success-icon">
                      <i data-feather="check-circle" class="text-success" style="width: 64px; height: 64px;"></i>
                    </div>
                    <h4 class="mt-3" data-i18n="phoneVerification.success">認証完了</h4>
                    <p class="text-muted" data-i18n="phoneVerification.successDesc">
                      電話番号の認証が正常に完了しました。
                    </p>
                  </div>
                  <div class="d-grid">
                    <button type="button" class="btn btn-success" id="complete-verification-btn" data-i18n="phoneVerification.complete">完了</button>
                  </div>
                </div>
                
                <div id="verification-error" class="alert alert-danger d-none mt-3">
                  <i data-feather="alert-circle" class="me-2"></i>
                  <span id="error-message"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // DOMに挿入
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = modalHTML.trim();
      document.body.appendChild(tempDiv.firstChild);
      
      // アイコンを初期化（Featherアイコン）
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
      
      // イベントリスナーを設定
      setupEventListeners();
    } else {
      setupEventListeners();
    }
    
    // ガイド登録モーダル内の電話番号認証ボタンのイベント設定
    document.addEventListener('click', function(event) {
      if (event.target.closest('.btn') && 
          event.target.textContent && 
          event.target.textContent.includes('未表示')) {
        const guideModal = document.getElementById('guideRegistrationModal');
        if (guideModal && guideModal.classList.contains('show')) {
          console.log('電話番号認証ボタンが押されました');
          
          // 現在のターゲットを記録
          verificationTarget = event.target;
          
          // 電話番号認証モーダルを表示
          const phoneModal = document.getElementById('phoneVerificationModal');
          if (phoneModal) {
            const modal = new bootstrap.Modal(phoneModal);
            resetVerificationUI();
            modal.show();
          }
        }
      }
    });
  }
  
  // イベントリスナーの設定
  function setupEventListeners() {
    const phoneVerificationModal = document.getElementById('phoneVerificationModal');
    if (!phoneVerificationModal) return;
    
    // コード送信ボタン
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', sendVerificationCode);
    }
    
    // 認証コード確認ボタン
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    if (verifyCodeBtn) {
      verifyCodeBtn.addEventListener('click', verifyCode);
    }
    
    // 戻るボタン
    const backToPhoneBtn = document.getElementById('back-to-phone-btn');
    if (backToPhoneBtn) {
      backToPhoneBtn.addEventListener('click', function() {
        showStep(1);
        stopCountdown();
      });
    }
    
    // 完了ボタン
    const completeBtn = document.getElementById('complete-verification-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', completeVerification);
    }
    
    // モーダルが閉じられたときの処理
    phoneVerificationModal.addEventListener('hidden.bs.modal', function() {
      if (!verificationInProgress) {
        resetVerificationUI();
      }
    });
    
    // 電話番号入力フィールドの変更監視
    const phoneInput = document.getElementById('phone-number');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        const value = e.target.value;
        
        // 自動で整形（ハイフン付け）
        if (value) {
          let formatted = value.replace(/[^\d]/g, '');
          if (formatted.length > 3 && formatted.length <= 7) {
            formatted = formatted.replace(/(\d{3})(\d+)/, '$1-$2');
          } else if (formatted.length > 7) {
            formatted = formatted.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
          }
          
          // フォーマットされた値と入力値が違う場合のみ設定
          if (formatted !== value) {
            e.target.value = formatted;
          }
        }
      });
    }
  }
  
  // 認証コードの送信処理
  function sendVerificationCode() {
    const phoneInput = document.getElementById('phone-number');
    if (!phoneInput) return;
    
    let phone = phoneInput.value.trim();
    
    // 電話番号のバリデーション
    if (!validatePhoneNumber(phone)) {
      showError('有効な電話番号を入力してください');
      return;
    }
    
    // ハイフンを除去して標準形式に
    phoneNumber = phone.replace(/-/g, '');
    
    // ここでは実際のSMS送信の代わりにモックとしてステップ2に進む
    console.log('認証コード送信処理: 電話番号', phoneNumber);
    showStep(2);
    startCountdown();
    hideError();
    
    // 実運用時は以下のようなAPIコールを実装
    // fetchAPI('/api/send-verification-code', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone: phoneNumber })
    // })
    // .then(response => {
    //   if (response.ok) {
    //     showStep(2);
    //     startCountdown();
    //     hideError();
    //   } else {
    //     showError('認証コードの送信に失敗しました。もう一度お試しください。');
    //   }
    // })
    // .catch(error => {
    //   showError('エラーが発生しました: ' + error.message);
    // });
  }
  
  // 認証コードの確認処理
  function verifyCode() {
    const codeInput = document.getElementById('verification-code');
    if (!codeInput) return;
    
    const code = codeInput.value.trim();
    
    // 認証コードのバリデーション
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      showError('6桁の認証コードを入力してください');
      return;
    }
    
    // テスト環境ではハードコードされた認証コード「123456」を使用
    console.log('認証コード確認処理: コード', code);
    
    if (code === '123456') {
      // 認証成功
      stopCountdown();
      showStep(3);
      hideError();
      verificationInProgress = true;
    } else {
      // 認証失敗
      showError('認証コードが一致しません。もう一度お試しください。');
    }
    
    // 実運用時は以下のようなAPIコールを実装
    // fetchAPI('/api/verify-code', {
    //   method: 'POST',
    //   body: JSON.stringify({ 
    //     phone: phoneNumber, 
    //     code: code 
    //   })
    // })
    // .then(response => {
    //   if (response.ok) {
    //     stopCountdown();
    //     showStep(3);
    //     hideError();
    //     verificationInProgress = true;
    //   } else {
    //     showError('認証コードが一致しません。もう一度お試しください。');
    //   }
    // })
    // .catch(error => {
    //   showError('エラーが発生しました: ' + error.message);
    // });
  }
  
  // 認証完了処理
  function completeVerification() {
    // モーダルを閉じる
    const phoneModal = document.getElementById('phoneVerificationModal');
    const modal = bootstrap.Modal.getInstance(phoneModal);
    if (modal) {
      modal.hide();
    }
    
    // ガイド登録モーダルの認証状態を更新
    updateGuideModalVerificationStatus();
    
    // 状態をリセット
    resetVerificationUI();
    verificationInProgress = false;
    verificationTarget = null;
  }
  
  // ガイド登録モーダルの認証状態を更新
  function updateGuideModalVerificationStatus() {
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    // 電話番号認証セクションを探す
    const labels = guideModal.querySelectorAll('label');
    let phoneLabel = null;
    
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        phoneLabel = label;
        break;
      }
    }
    
    if (!phoneLabel) return;
    
    // 親コンテナを取得
    const phoneSection = phoneLabel.closest('.form-group, .row, .mb-3') || phoneLabel.parentElement;
    if (!phoneSection) return;
    
    // 「電話認証」テキストや「未表示」テキストを探す
    let verificationTrigger = null;
    
    // 様々なセレクタで探す
    const possibleTriggers = [
      ...phoneSection.querySelectorAll('.text-verification-status'), 
      ...phoneSection.querySelectorAll('.text-muted'),
      ...phoneSection.querySelectorAll('[data-verification-trigger]')
    ];
    
    for (const el of possibleTriggers) {
      if (el.textContent && 
          (el.textContent.trim() === '電話認証' || 
           el.textContent.trim() === '未表示')) {
        verificationTrigger = el;
        break;
      }
    }
    
    // テキストコンテンツで最終チェック
    if (!verificationTrigger) {
      const allElements = phoneSection.querySelectorAll('*');
      for (const el of allElements) {
        if (el.textContent && 
            (el.textContent.trim() === '電話認証' || 
             el.textContent.trim() === '未表示') && 
            el.nodeType === 1) {  // 要素ノードのみ
          verificationTrigger = el;
          break;
        }
      }
    }
    
    // 直接のターゲット要素があれば、それを優先
    if (!verificationTrigger && verificationTarget) {
      verificationTrigger = verificationTarget;
    }
    
    // 認証済みステータスを作成
    const verifiedStatus = document.createElement('span');
    verifiedStatus.className = 'text-verification-status ms-2';
    verifiedStatus.textContent = '認証済み';
    verifiedStatus.style.color = '#198754';
    verifiedStatus.style.fontWeight = 'bold';
    verifiedStatus.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
    
    // 対象要素を認証済みステータスに置き換え
    if (verificationTrigger && verificationTrigger.parentElement) {
      verificationTrigger.parentElement.replaceChild(verifiedStatus, verificationTrigger);
      console.log('認証ステータスを「認証済み」に更新しました');
    } else {
      // 対象が見つからない場合は、セクションに直接追加
      console.log('認証トリガーが見つからないため、セクションに直接追加します');
      
      // ラベルの後ろに追加
      if (phoneLabel && phoneLabel.parentElement) {
        if (phoneLabel.nextSibling) {
          phoneLabel.parentElement.insertBefore(verifiedStatus, phoneLabel.nextSibling);
        } else {
          phoneLabel.parentElement.appendChild(verifiedStatus);
        }
      } else {
        // 最終手段としてセクションに追加
        phoneSection.appendChild(verifiedStatus);
      }
    }
  }
  
  // 電話番号のバリデーション
  function validatePhoneNumber(phone) {
    // ハイフンを消去
    const cleanPhone = phone.replace(/-/g, '');
    
    // 桁数と数字のみかを確認
    return cleanPhone.length >= 10 && /^\d+$/.test(cleanPhone);
  }
  
  // 特定のステップを表示
  function showStep(step) {
    const steps = [
      document.getElementById('phone-step-1'),
      document.getElementById('phone-step-2'),
      document.getElementById('phone-step-3')
    ];
    
    steps.forEach((stepEl, index) => {
      if (stepEl) {
        if (index + 1 === step) {
          stepEl.classList.remove('d-none');
        } else {
          stepEl.classList.add('d-none');
        }
      }
    });
  }
  
  // カウントダウンの開始
  function startCountdown() {
    const countdownEl = document.getElementById('countdown-timer');
    if (!countdownEl) return;
    
    remainingTime = 180; // 3分間
    updateCountdownDisplay();
    
    // 既存のインターバルをクリア
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    
    // 新しいカウントダウンを開始
    countdownInterval = setInterval(function() {
      remainingTime--;
      
      if (remainingTime <= 0) {
        stopCountdown();
        showError('認証コードの有効期限が切れました。もう一度コードを送信してください。');
        showStep(1);
      } else {
        updateCountdownDisplay();
      }
    }, 1000);
  }
  
  // カウントダウンの停止
  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }
  
  // カウントダウン表示の更新
  function updateCountdownDisplay() {
    const countdownEl = document.getElementById('countdown-timer');
    if (!countdownEl) return;
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    
    countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // エラーメッセージの表示
  function showError(message) {
    const errorContainer = document.getElementById('verification-error');
    const errorMessage = document.getElementById('error-message');
    
    if (errorContainer && errorMessage) {
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }
  }
  
  // エラーメッセージを非表示
  function hideError() {
    const errorContainer = document.getElementById('verification-error');
    
    if (errorContainer) {
      errorContainer.classList.add('d-none');
    }
  }
  
  // 認証UIのリセット
  function resetVerificationUI() {
    showStep(1);
    stopCountdown();
    hideError();
    
    // 入力フィールドをクリア
    const phoneInput = document.getElementById('phone-number');
    const codeInput = document.getElementById('verification-code');
    
    if (phoneInput) phoneInput.value = '';
    if (codeInput) codeInput.value = '';
    
    phoneNumber = '';
    verificationInProgress = false;
  }
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時に実行
  window.addEventListener('load', init);
})();