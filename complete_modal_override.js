/**
 * ガイド登録モーダルの完全オーバーライド
 * モーダルの内容を丸ごと作り直して置き換える根本的なアプローチ
 */
(function() {
  console.log('Complete Modal Override: 初期化');
  
  // 元のモーダル内容をバックアップする変数
  let originalModalContent = null;
  let isOverridden = false;
  
  // モーダル表示イベントをリッスン
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'guideRegistrationModal') {
      console.log('ガイド登録モーダルを検出: オーバーライド実行');
      overrideModal(event.target);
    }
  });
  
  // DOM変更の監視
  const observer = new MutationObserver(function(mutations) {
    const modal = document.getElementById('guideRegistrationModal');
    if (modal && isModalVisible(modal) && !isOverridden) {
      overrideModal(modal);
    }
  });
  
  // bodyを監視開始
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // ページ読み込み時にもチェック
  window.addEventListener('load', function() {
    const modal = document.getElementById('guideRegistrationModal');
    if (modal && isModalVisible(modal)) {
      overrideModal(modal);
    }
    
    // モーダル表示ボタンにイベントリスナーを追加
    setupModalTriggerListeners();
  });
  
  // モーダルトリガーにイベントリスナーを追加
  function setupModalTriggerListeners() {
    // ガイド登録ボタンなど、モーダルを開くボタンにリスナーを設定
    const modalTriggers = document.querySelectorAll('[data-bs-target="#guideRegistrationModal"], [data-toggle="modal"][data-target="#guideRegistrationModal"]');
    
    modalTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        // ボタンクリック時にすぐチェックするのではなく、少し待ってからチェック
        setTimeout(function() {
          const modal = document.getElementById('guideRegistrationModal');
          if (modal && isModalVisible(modal)) {
            overrideModal(modal);
          }
        }, 100);
      });
    });
  }
  
  // モーダルを完全にオーバーライドする関数
  function overrideModal(modal) {
    if (!modal || isOverridden) return;
    
    console.log('モーダル内容を完全にオーバーライド開始');
    
    // 元のコンテンツをバックアップ（まだされていない場合）
    if (!originalModalContent) {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        originalModalContent = modalBody.innerHTML;
      }
    }
    
    // モーダルボディを探す
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.error('モーダルボディが見つかりません');
      return;
    }
    
    // フォーム要素を抽出して保持
    const existingForm = modalBody.querySelector('form');
    const formAction = existingForm ? existingForm.getAttribute('action') : '';
    const formMethod = existingForm ? existingForm.getAttribute('method') : 'post';
    const formId = existingForm ? existingForm.id : 'guide-registration-form';
    
    // 既存の入力値をできるだけ保持
    const formValues = getFormValues(existingForm);
    
    // モーダルボディの内容を新しく作成したものに置き換え
    modalBody.innerHTML = createNewModalContent(formId, formAction, formMethod, formValues);
    
    // 新しいフォームにイベントリスナを設定
    setupNewFormListeners(modal);
    
    // オーバーライド完了フラグを設定
    isOverridden = true;
    
    console.log('モーダル内容のオーバーライド完了');
    
    // 設定完了後、電話認証セクションも確実に修正
    fixPhoneVerificationSection(modal);
  }
  
  // フォームの値を取得する関数
  function getFormValues(form) {
    if (!form) return {};
    
    const values = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(function(input) {
      if (input.name) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          if (input.checked) {
            values[input.name] = input.value;
          }
        } else {
          values[input.name] = input.value;
        }
      }
    });
    
    return values;
  }
  
  // 新しいモーダル内容を作成する関数
  function createNewModalContent(formId, formAction, formMethod, formValues) {
    return `
      <form id="${formId}" action="${formAction}" method="${formMethod}" class="needs-validation" novalidate>
        <!-- 基本情報セクション -->
        <div class="mb-4">
          <h5 class="border-bottom pb-2 mb-3">基本情報</h5>
          
          <!-- 書類種類選択 -->
          <div class="mb-3">
            <label for="document-type" class="form-label">書類の種類を選択してください</label>
            <select class="form-select" id="document-type" name="document_type" required>
              <option value="" selected disabled>書類の種類を選択してください</option>
              <option value="drivers_license" ${formValues.document_type === 'drivers_license' ? 'selected' : ''}>運転免許証</option>
              <option value="passport" ${formValues.document_type === 'passport' ? 'selected' : ''}>パスポート</option>
              <option value="residence_card" ${formValues.document_type === 'residence_card' ? 'selected' : ''}>在留カード</option>
              <option value="my_number" ${formValues.document_type === 'my_number' ? 'selected' : ''}>マイナンバーカード</option>
            </select>
            <div class="invalid-feedback">書類の種類を選択してください</div>
          </div>
          
          <!-- メールアドレス -->
          <div class="mb-3">
            <label for="email" class="form-label">メールアドレス</label>
            <input type="email" class="form-control" id="email" name="email" value="${formValues.email || ''}" required>
            <div class="invalid-feedback">有効なメールアドレスを入力してください</div>
          </div>
          
          <!-- 性別 -->
          <div class="mb-3">
            <label for="gender" class="form-label">性別</label>
            <select class="form-select" id="gender" name="gender" required>
              <option value="" selected disabled>選択してください</option>
              <option value="male" ${formValues.gender === 'male' ? 'selected' : ''}>男性</option>
              <option value="female" ${formValues.gender === 'female' ? 'selected' : ''}>女性</option>
              <option value="other" ${formValues.gender === 'other' ? 'selected' : ''}>その他</option>
              <option value="no_answer" ${formValues.gender === 'no_answer' ? 'selected' : ''}>回答しない</option>
            </select>
            <div class="invalid-feedback">性別を選択してください</div>
          </div>
          
          <!-- 年齢層 -->
          <div class="mb-3">
            <label for="age-group" class="form-label">年齢層</label>
            <select class="form-select" id="age-group" name="age_group" required>
              <option value="" selected disabled>選択してください</option>
              <option value="18-24" ${formValues.age_group === '18-24' ? 'selected' : ''}>18-24歳</option>
              <option value="25-34" ${formValues.age_group === '25-34' ? 'selected' : ''}>25-34歳</option>
              <option value="35-44" ${formValues.age_group === '35-44' ? 'selected' : ''}>35-44歳</option>
              <option value="45-54" ${formValues.age_group === '45-54' ? 'selected' : ''}>45-54歳</option>
              <option value="55-64" ${formValues.age_group === '55-64' ? 'selected' : ''}>55-64歳</option>
              <option value="65+" ${formValues.age_group === '65+' ? 'selected' : ''}>65歳以上</option>
            </select>
            <div class="invalid-feedback">年齢層を選択してください</div>
          </div>
          
          <!-- 電話番号認証 - ここが重要なセクション -->
          <div class="mb-3 phone-verification-section">
            <label for="phone" class="form-label">電話番号認証</label>
            <span class="text-muted ms-2 phone-verification-status" style="cursor: pointer;" id="phone-verification-trigger">未表示</span>
            <input type="hidden" id="phone-verified" name="phone_verified" value="0">
            <input type="hidden" id="verified-phone" name="verified_phone" value="">
          </div>
        </div>
        
        <!-- 自己紹介セクション -->
        <div class="mb-4">
          <h5 class="border-bottom pb-2 mb-3">自己紹介</h5>
          
          <!-- 自己紹介文 -->
          <div class="mb-3">
            <label for="bio" class="form-label">自己紹介 (300文字以内)</label>
            <textarea class="form-control" id="bio" name="bio" rows="5" maxlength="300" required>${formValues.bio || ''}</textarea>
            <div class="d-flex justify-content-end mt-1">
              <small class="text-muted" id="bio-counter">0/300文字</small>
            </div>
            <div class="invalid-feedback">自己紹介を入力してください</div>
          </div>
        </div>
        
        <!-- 提出ボタン -->
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary">登録する</button>
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">キャンセル</button>
        </div>
      </form>
    `;
  }
  
  // 新しいフォームにイベントリスナを設定
  function setupNewFormListeners(modal) {
    // 電話認証トリガー
    const verificationTrigger = modal.querySelector('#phone-verification-trigger');
    if (verificationTrigger) {
      verificationTrigger.addEventListener('click', function() {
        showPhoneVerificationModal();
      });
    }
    
    // 文字カウンター
    const bioTextarea = modal.querySelector('#bio');
    const bioCounter = modal.querySelector('#bio-counter');
    
    if (bioTextarea && bioCounter) {
      // 初期カウント表示
      updateCharCounter(bioTextarea, bioCounter);
      
      // 入力時にカウント更新
      bioTextarea.addEventListener('input', function() {
        updateCharCounter(this, bioCounter);
      });
    }
    
    // フォームのバリデーション
    const form = modal.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(event) {
        if (!this.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        this.classList.add('was-validated');
      });
    }
    
    // 書類タイプの選択変更時
    const documentSelect = modal.querySelector('#document-type');
    if (documentSelect) {
      documentSelect.addEventListener('change', function() {
        // ここに書類タイプに応じた処理（写真アップロードUIの変更など）
      });
    }
  }
  
  // 文字カウンター更新
  function updateCharCounter(textarea, counter) {
    const currentLength = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength');
    counter.textContent = `${currentLength}/${maxLength}文字`;
  }
  
  // 電話認証モーダルを表示
  function showPhoneVerificationModal() {
    // 既存の電話認証モーダルがあるか確認
    let phoneModal = document.getElementById('phoneVerificationModal');
    
    // なければ作成
    if (!phoneModal) {
      const modalHTML = createPhoneVerificationModal();
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      phoneModal = document.getElementById('phoneVerificationModal');
      
      // 電話認証モーダルのイベントリスナーを設定
      setupPhoneVerificationListeners();
    }
    
    // モーダルを表示
    try {
      const bsModal = new bootstrap.Modal(phoneModal);
      bsModal.show();
    } catch (error) {
      console.error('モーダル表示エラー:', error);
      
      // フォールバック方法
      phoneModal.classList.add('show');
      phoneModal.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // バックドロップを追加
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  }
  
  // 電話認証モーダルを作成
  function createPhoneVerificationModal() {
    return `
      <div class="modal fade" id="phoneVerificationModal" tabindex="-1" aria-labelledby="phoneVerificationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="phoneVerificationModalLabel">電話番号認証</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- ステップ1: 電話番号入力 -->
              <div id="phone-step-1">
                <div class="text-center mb-4">
                  <div class="phone-verification-icon mb-3">
                    <i class="bi bi-phone fs-1 text-primary"></i>
                  </div>
                  <h4>電話番号を認証します</h4>
                  <p class="text-muted">
                    あなたの電話番号を認証するためにSMSを送信します。<br>
                    電話番号を入力して「コードを送信」ボタンをクリックしてください。
                  </p>
                </div>
                
                <div class="mb-3">
                  <label for="phone-number" class="form-label">電話番号</label>
                  <div class="input-group">
                    <span class="input-group-text">+81</span>
                    <input type="tel" class="form-control" id="phone-number" placeholder="90-1234-5678" maxlength="13">
                    <button class="btn btn-primary" type="button" id="send-code-btn">コードを送信</button>
                  </div>
                  <div class="form-text">ハイフンなし、または「-」区切りで入力してください</div>
                </div>
              </div>
              
              <!-- ステップ2: 認証コード入力 -->
              <div id="phone-step-2" class="d-none">
                <div class="text-center mb-4">
                  <div class="verification-code-icon mb-3">
                    <i class="bi bi-shield-lock fs-1 text-primary"></i>
                  </div>
                  <h4>認証コードを入力</h4>
                  <p class="text-muted">
                    SMSで送信された6桁の認証コードを入力してください。
                  </p>
                </div>
                
                <div class="mb-3">
                  <label for="verification-code" class="form-label">認証コード</label>
                  <input type="text" class="form-control text-center fs-4 letter-spacing-1" id="verification-code" placeholder="123456" maxlength="6">
                  <div class="mt-2 text-muted">
                    認証コードは <span id="countdown-timer">03:00</span> 以内に入力してください
                  </div>
                </div>
                
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" id="back-to-phone-btn">戻る</button>
                  <button type="button" class="btn btn-primary" id="verify-code-btn">認証する</button>
                </div>
              </div>
              
              <!-- ステップ3: 認証完了 -->
              <div id="phone-step-3" class="d-none">
                <div class="text-center mb-4">
                  <div class="verification-success-icon mb-3">
                    <i class="bi bi-check-circle fs-1 text-success"></i>
                  </div>
                  <h4>認証完了</h4>
                  <p class="text-muted">
                    電話番号の認証が正常に完了しました。
                  </p>
                </div>
                
                <div class="d-grid">
                  <button type="button" class="btn btn-success" id="complete-verification-btn">完了</button>
                </div>
              </div>
              
              <!-- エラーメッセージ -->
              <div id="verification-error" class="alert alert-danger d-none mt-3">
                <i class="bi bi-exclamation-circle me-2"></i>
                <span id="error-message"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // 電話認証モーダルのイベントリスナー設定
  function setupPhoneVerificationListeners() {
    // コード送信ボタン
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', function() {
        const phoneInput = document.getElementById('phone-number');
        if (!phoneInput || !phoneInput.value) {
          showVerificationError('電話番号を入力してください');
          return;
        }
        
        // 電話番号のフォーマットチェック
        const phoneRegex = /^[0-9-]{10,13}$/;
        if (!phoneRegex.test(phoneInput.value)) {
          showVerificationError('有効な電話番号を入力してください');
          return;
        }
        
        // ステップ2に進む
        hideVerificationStep('phone-step-1');
        showVerificationStep('phone-step-2');
        hideVerificationError();
        
        // カウントダウン開始
        startVerificationCountdown();
        
        // 開発用：電話番号をコンソールに表示
        console.log('送信先電話番号:', phoneInput.value);
      });
    }
    
    // 認証コード確認ボタン
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    if (verifyCodeBtn) {
      verifyCodeBtn.addEventListener('click', function() {
        const codeInput = document.getElementById('verification-code');
        if (!codeInput || !codeInput.value) {
          showVerificationError('認証コードを入力してください');
          return;
        }
        
        // コード形式チェック
        const codeRegex = /^\d{6}$/;
        if (!codeRegex.test(codeInput.value)) {
          showVerificationError('認証コードは6桁の数字です');
          return;
        }
        
        // テスト用コード
        if (codeInput.value === '123456') {
          // 認証成功
          hideVerificationStep('phone-step-2');
          showVerificationStep('phone-step-3');
          hideVerificationError();
          stopVerificationCountdown();
          
          // 認証状態を更新
          updateVerificationStatus(true);
        } else {
          showVerificationError('認証コードが一致しません');
        }
      });
    }
    
    // 戻るボタン
    const backBtn = document.getElementById('back-to-phone-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        hideVerificationStep('phone-step-2');
        showVerificationStep('phone-step-1');
        hideVerificationError();
        stopVerificationCountdown();
      });
    }
    
    // 完了ボタン
    const completeBtn = document.getElementById('complete-verification-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', function() {
        // モーダルを閉じる
        closePhoneVerificationModal();
        
        // 認証状態の更新は認証成功時に既に行っているのでここでは不要
      });
    }
  }
  
  // 電話認証ステップの表示・非表示
  function showVerificationStep(stepId) {
    const step = document.getElementById(stepId);
    if (step) step.classList.remove('d-none');
  }
  
  function hideVerificationStep(stepId) {
    const step = document.getElementById(stepId);
    if (step) step.classList.add('d-none');
  }
  
  // 電話認証エラー表示・非表示
  function showVerificationError(message) {
    const errorContainer = document.getElementById('verification-error');
    const errorMessage = document.getElementById('error-message');
    
    if (errorContainer && errorMessage) {
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }
  }
  
  function hideVerificationError() {
    const errorContainer = document.getElementById('verification-error');
    if (errorContainer) {
      errorContainer.classList.add('d-none');
    }
  }
  
  // 電話認証モーダルを閉じる
  function closePhoneVerificationModal() {
    const phoneModal = document.getElementById('phoneVerificationModal');
    if (!phoneModal) return;
    
    try {
      const bsModal = bootstrap.Modal.getInstance(phoneModal);
      if (bsModal) {
        bsModal.hide();
      } else {
        throw new Error('Bootstrap Modal instance not found');
      }
    } catch (error) {
      console.error('モーダルを閉じる際のエラー:', error);
      
      // フォールバック方法
      phoneModal.classList.remove('show');
      phoneModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // バックドロップを削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
    
    // 状態をリセット（次回のため）
    setTimeout(function() {
      hideVerificationStep('phone-step-2');
      hideVerificationStep('phone-step-3');
      showVerificationStep('phone-step-1');
      
      const phoneInput = document.getElementById('phone-number');
      const codeInput = document.getElementById('verification-code');
      
      if (phoneInput) phoneInput.value = '';
      if (codeInput) codeInput.value = '';
    }, 300);
  }
  
  // 認証状態の更新
  function updateVerificationStatus(isVerified) {
    // ガイド登録モーダル内の要素を更新
    const statusText = document.getElementById('phone-verification-trigger');
    const verifiedInput = document.getElementById('phone-verified');
    const phoneInput = document.getElementById('verified-phone');
    const phoneNumber = document.getElementById('phone-number');
    
    if (statusText && isVerified) {
      statusText.textContent = '認証済み';
      statusText.classList.remove('text-muted');
      statusText.classList.add('text-success');
    } else if (statusText) {
      statusText.textContent = '未表示';
      statusText.classList.remove('text-success');
      statusText.classList.add('text-muted');
    }
    
    if (verifiedInput) {
      verifiedInput.value = isVerified ? '1' : '0';
    }
    
    if (phoneInput && phoneNumber && isVerified) {
      // 認証された電話番号を保存
      phoneInput.value = phoneNumber.value;
    }
  }
  
  // 認証コードのカウントダウン
  let countdownInterval;
  let remainingSeconds = 180; // 3分
  
  function startVerificationCountdown() {
    stopVerificationCountdown(); // 既存のインターバルをクリア
    
    remainingSeconds = 180;
    updateCountdownDisplay();
    
    countdownInterval = setInterval(function() {
      remainingSeconds--;
      
      if (remainingSeconds <= 0) {
        stopVerificationCountdown();
        showVerificationError('認証コードの有効期限が切れました。もう一度送信してください。');
        
        // ステップ1に戻す
        hideVerificationStep('phone-step-2');
        showVerificationStep('phone-step-1');
      } else {
        updateCountdownDisplay();
      }
    }, 1000);
  }
  
  function stopVerificationCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }
  
  function updateCountdownDisplay() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;
    
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // 電話認証セクションを確実に修正（モーダルオーバーライド後のバックアップ）
  function fixPhoneVerificationSection(modal) {
    const verificationSection = modal.querySelector('.phone-verification-section');
    if (!verificationSection) return;
    
    // 「認証済み」ボタンや緑色バッジが残っていたら削除
    const greenElements = verificationSection.querySelectorAll('.badge.bg-success, .btn-success, [class*="badge"][class*="success"], [class*="btn"][class*="success"]');
    greenElements.forEach(function(el) {
      el.parentNode.removeChild(el);
    });
    
    // 「認証済み」テキストを含む要素を検索して削除
    const allElements = verificationSection.querySelectorAll('*');
    allElements.forEach(function(el) {
      if (el.id === 'phone-verification-trigger') return; // トリガー要素は保持
      
      if (el.textContent && el.textContent.trim() === '認証済み' && el !== verificationSection.querySelector('#phone-verification-trigger')) {
        el.parentNode.removeChild(el);
      }
    });
  }
  
  // モーダルが表示されているかチェック
  function isModalVisible(modal) {
    return modal.classList.contains('show') && window.getComputedStyle(modal).display !== 'none';
  }
})();