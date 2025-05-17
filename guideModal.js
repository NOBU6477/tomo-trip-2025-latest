/**
 * ガイド登録モーダルの完全な再実装
 * ゼロからすべての機能を再実装し、既存のコードに干渉されないようにする
 */
(function() {
  console.log('Guide Modal Reimplementation: 初期化');
  
  // DOM読み込み完了時
  document.addEventListener('DOMContentLoaded', init);
  
  // ウィンドウ読み込み完了時
  window.addEventListener('load', init);
  
  // 初期化関数
  function init() {
    // ガイド登録ボタンのイベントリスナーを置き換える
    replaceGuideButtonListener();
    
    // カスタムモーダルがまだ作成されていなければ作成
    if (!document.getElementById('customGuideRegistrationModal')) {
      createCustomModals();
    }
  }
  
  // ガイド登録ボタンのクリックイベントを置き換え
  function replaceGuideButtonListener() {
    // ガイド登録ボタンを探す
    // 通常、ユーザータイプの選択モーダルのボタンである
    const userTypeModal = document.getElementById('userTypeModal');
    if (userTypeModal) {
      const guideButton = userTypeModal.querySelector('button[data-user-type="guide"]');
      if (guideButton) {
        // 既存のイベントリスナーを削除
        const clone = guideButton.cloneNode(true);
        guideButton.parentNode.replaceChild(clone, guideButton);
        
        // 新しいイベントリスナーを設定
        clone.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // ユーザータイプモーダルを閉じる
          try {
            const bsModal = bootstrap.Modal.getInstance(userTypeModal);
            if (bsModal) bsModal.hide();
          } catch (error) {
            console.error('ユーザータイプモーダルを閉じる際のエラー:', error);
            userTypeModal.classList.remove('show');
            userTypeModal.style.display = 'none';
            
            // バックドロップを削除
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.parentNode.removeChild(backdrop);
          }
          
          // カスタムモーダルを表示
          setTimeout(function() {
            showCustomGuideModal();
          }, 300);
        });
        
        console.log('ガイド登録ボタンのイベントリスナーを置き換えました');
      }
    }
    
    // ヘッダーや他の場所にあるガイド登録ボタンも探す
    const otherGuideButtons = document.querySelectorAll('[data-bs-target="#guideRegistrationModal"], [data-toggle="modal"][data-target="#guideRegistrationModal"]');
    
    otherGuideButtons.forEach(function(button) {
      if (button.getAttribute('data-custom-listener') === 'true') return;
      
      // 既存のリスナーを削除して新しいリスナーを設定
      const clone = button.cloneNode(true);
      button.parentNode.replaceChild(clone, button);
      
      // 属性を変更
      clone.removeAttribute('data-bs-target');
      clone.removeAttribute('data-target');
      clone.setAttribute('data-custom-listener', 'true');
      
      // 新しいイベントリスナー
      clone.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // カスタムモーダルを表示
        showCustomGuideModal();
      });
    });
  }
  
  // カスタムモーダルを作成
  function createCustomModals() {
    // カスタムガイド登録モーダル
    const guideModalHTML = `
      <div class="modal fade" id="customGuideRegistrationModal" tabindex="-1" aria-labelledby="customGuideRegistrationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="customGuideRegistrationModalLabel">ガイド登録</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="custom-guide-registration-form" class="needs-validation" novalidate>
                <!-- 基本情報セクション -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2 mb-3">基本情報</h5>
                  
                  <!-- 書類種類選択 -->
                  <div class="mb-3">
                    <label for="custom-document-type" class="form-label">書類の種類を選択してください</label>
                    <select class="form-select" id="custom-document-type" name="document_type" required>
                      <option value="" selected disabled>書類の種類を選択してください</option>
                      <option value="drivers_license">運転免許証</option>
                      <option value="passport">パスポート</option>
                      <option value="residence_card">在留カード</option>
                      <option value="my_number">マイナンバーカード</option>
                    </select>
                    <div class="invalid-feedback">書類の種類を選択してください</div>
                  </div>
                  
                  <!-- メールアドレス -->
                  <div class="mb-3">
                    <label for="custom-email" class="form-label">メールアドレス</label>
                    <input type="email" class="form-control" id="custom-email" name="email" required>
                    <div class="invalid-feedback">有効なメールアドレスを入力してください</div>
                  </div>
                  
                  <!-- 性別 -->
                  <div class="mb-3">
                    <label for="custom-gender" class="form-label">性別</label>
                    <select class="form-select" id="custom-gender" name="gender" required>
                      <option value="" selected disabled>選択してください</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                      <option value="other">その他</option>
                      <option value="no_answer">回答しない</option>
                    </select>
                    <div class="invalid-feedback">性別を選択してください</div>
                  </div>
                  
                  <!-- 年齢層 -->
                  <div class="mb-3">
                    <label for="custom-age-group" class="form-label">年齢層</label>
                    <select class="form-select" id="custom-age-group" name="age_group" required>
                      <option value="" selected disabled>選択してください</option>
                      <option value="18-24">18-24歳</option>
                      <option value="25-34">25-34歳</option>
                      <option value="35-44">35-44歳</option>
                      <option value="45-54">45-54歳</option>
                      <option value="55-64">55-64歳</option>
                      <option value="65+">65歳以上</option>
                    </select>
                    <div class="invalid-feedback">年齢層を選択してください</div>
                  </div>
                  
                  <!-- 電話番号認証 - ここが重要なセクション -->
                  <div class="mb-3 custom-phone-verification-section">
                    <label for="custom-phone" class="form-label">電話番号認証</label>
                    <span class="text-muted ms-2 custom-phone-verification-status" style="cursor: pointer;" id="custom-phone-verification-trigger">未表示</span>
                    <input type="hidden" id="custom-phone-verified" name="phone_verified" value="0">
                    <input type="hidden" id="custom-verified-phone" name="verified_phone" value="">
                  </div>
                </div>
                
                <!-- 自己紹介セクション -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2 mb-3">自己紹介</h5>
                  
                  <!-- 自己紹介文 -->
                  <div class="mb-3">
                    <label for="custom-bio" class="form-label">自己紹介 (300文字以内)</label>
                    <textarea class="form-control" id="custom-bio" name="bio" rows="5" maxlength="300" required></textarea>
                    <div class="d-flex justify-content-end mt-1">
                      <small class="text-muted" id="custom-bio-counter">0/300文字</small>
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
            </div>
          </div>
        </div>
      </div>
    `;
    
    // カスタム電話認証モーダル
    const phoneModalHTML = `
      <div class="modal fade" id="customPhoneVerificationModal" tabindex="-1" aria-labelledby="customPhoneVerificationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="customPhoneVerificationModalLabel">電話番号認証</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- ステップ1: 電話番号入力 -->
              <div id="custom-phone-step-1">
                <div class="text-center mb-4">
                  <div class="phone-verification-icon mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-phone text-primary" viewBox="0 0 16 16">
                      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                    </svg>
                  </div>
                  <h4>電話番号を認証します</h4>
                  <p class="text-muted">
                    あなたの電話番号を認証するためにSMSを送信します。<br>
                    電話番号を入力して「コードを送信」ボタンをクリックしてください。
                  </p>
                </div>
                
                <div class="mb-3">
                  <label for="custom-phone-number" class="form-label">電話番号</label>
                  <div class="input-group">
                    <span class="input-group-text">+81</span>
                    <input type="tel" class="form-control" id="custom-phone-number" placeholder="90-1234-5678" maxlength="13">
                    <button class="btn btn-primary" type="button" id="custom-send-code-btn">コードを送信</button>
                  </div>
                  <div class="form-text">ハイフンなし、または「-」区切りで入力してください</div>
                </div>
              </div>
              
              <!-- ステップ2: 認証コード入力 -->
              <div id="custom-phone-step-2" class="d-none">
                <div class="text-center mb-4">
                  <div class="verification-code-icon mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-shield-lock text-primary" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.6.6 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.856C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.299 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56z"/>
                      <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>
                    </svg>
                  </div>
                  <h4>認証コードを入力</h4>
                  <p class="text-muted">
                    SMSで送信された6桁の認証コードを入力してください。
                  </p>
                </div>
                
                <div class="mb-3">
                  <label for="custom-verification-code" class="form-label">認証コード</label>
                  <input type="text" class="form-control text-center fs-4 letter-spacing-1" id="custom-verification-code" placeholder="123456" maxlength="6">
                  <div class="mt-2 text-muted">
                    認証コードは <span id="custom-countdown-timer">03:00</span> 以内に入力してください
                  </div>
                </div>
                
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" id="custom-back-to-phone-btn">戻る</button>
                  <button type="button" class="btn btn-primary" id="custom-verify-code-btn">認証する</button>
                </div>
              </div>
              
              <!-- ステップ3: 認証完了 -->
              <div id="custom-phone-step-3" class="d-none">
                <div class="text-center mb-4">
                  <div class="verification-success-icon mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" fill="currentColor" class="bi bi-check-circle text-success" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                  </div>
                  <h4>認証完了</h4>
                  <p class="text-muted">
                    電話番号の認証が正常に完了しました。
                  </p>
                </div>
                
                <div class="d-grid">
                  <button type="button" class="btn btn-success" id="custom-complete-verification-btn">完了</button>
                </div>
              </div>
              
              <!-- エラーメッセージ -->
              <div id="custom-verification-error" class="alert alert-danger d-none mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-circle me-2" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                </svg>
                <span id="custom-error-message"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    document.body.insertAdjacentHTML('beforeend', guideModalHTML);
    document.body.insertAdjacentHTML('beforeend', phoneModalHTML);
    
    // イベントリスナーを設定
    setupCustomFormListeners();
    setupCustomPhoneVerificationListeners();
    
    console.log('カスタムモーダルが作成されました');
  }
  
  // カスタムガイド登録フォームのイベントリスナー設定
  function setupCustomFormListeners() {
    // 電話認証トリガー
    const verificationTrigger = document.getElementById('custom-phone-verification-trigger');
    if (verificationTrigger) {
      verificationTrigger.addEventListener('click', function() {
        showCustomPhoneVerificationModal();
      });
    }
    
    // 文字カウンター
    const bioTextarea = document.getElementById('custom-bio');
    const bioCounter = document.getElementById('custom-bio-counter');
    
    if (bioTextarea && bioCounter) {
      // 初期カウント表示
      updateCharCounter(bioTextarea, bioCounter);
      
      // 入力時にカウント更新
      bioTextarea.addEventListener('input', function() {
        updateCharCounter(this, bioCounter);
      });
    }
    
    // フォームのバリデーション
    const form = document.getElementById('custom-guide-registration-form');
    if (form) {
      form.addEventListener('submit', function(event) {
        if (!this.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          
          // フォーム送信の処理
          console.log('ガイド登録フォームが送信されました');
          alert('ガイド登録が完了しました。\n※実際のAPIリクエストは行われていません。');
          
          // モーダルを閉じる
          closeCustomGuideModal();
        }
        
        this.classList.add('was-validated');
      });
    }
  }
  
  // カスタム電話認証モーダルのイベントリスナー設定
  function setupCustomPhoneVerificationListeners() {
    // コード送信ボタン
    const sendCodeBtn = document.getElementById('custom-send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', function() {
        const phoneInput = document.getElementById('custom-phone-number');
        if (!phoneInput || !phoneInput.value) {
          showCustomVerificationError('電話番号を入力してください');
          return;
        }
        
        // 電話番号のフォーマットチェック
        const phoneRegex = /^[0-9-]{10,13}$/;
        if (!phoneRegex.test(phoneInput.value)) {
          showCustomVerificationError('有効な電話番号を入力してください');
          return;
        }
        
        // ステップ2に進む
        hideCustomVerificationStep('custom-phone-step-1');
        showCustomVerificationStep('custom-phone-step-2');
        hideCustomVerificationError();
        
        // カウントダウン開始
        startCustomVerificationCountdown();
        
        // 開発用：電話番号をコンソールに表示
        console.log('送信先電話番号:', phoneInput.value);
      });
    }
    
    // 認証コード確認ボタン
    const verifyCodeBtn = document.getElementById('custom-verify-code-btn');
    if (verifyCodeBtn) {
      verifyCodeBtn.addEventListener('click', function() {
        const codeInput = document.getElementById('custom-verification-code');
        if (!codeInput || !codeInput.value) {
          showCustomVerificationError('認証コードを入力してください');
          return;
        }
        
        // コード形式チェック
        const codeRegex = /^\d{6}$/;
        if (!codeRegex.test(codeInput.value)) {
          showCustomVerificationError('認証コードは6桁の数字です');
          return;
        }
        
        // テスト用コード
        if (codeInput.value === '123456') {
          // 認証成功
          hideCustomVerificationStep('custom-phone-step-2');
          showCustomVerificationStep('custom-phone-step-3');
          hideCustomVerificationError();
          stopCustomVerificationCountdown();
          
          // 認証状態を更新
          updateCustomVerificationStatus(true);
        } else {
          showCustomVerificationError('認証コードが一致しません');
        }
      });
    }
    
    // 戻るボタン
    const backBtn = document.getElementById('custom-back-to-phone-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        hideCustomVerificationStep('custom-phone-step-2');
        showCustomVerificationStep('custom-phone-step-1');
        hideCustomVerificationError();
        stopCustomVerificationCountdown();
      });
    }
    
    // 完了ボタン
    const completeBtn = document.getElementById('custom-complete-verification-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', function() {
        // モーダルを閉じる
        closeCustomPhoneVerificationModal();
      });
    }
  }
  
  // 文字カウンター更新
  function updateCharCounter(textarea, counter) {
    const currentLength = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength');
    counter.textContent = `${currentLength}/${maxLength}文字`;
  }
  
  // カスタムガイドモーダルを表示
  function showCustomGuideModal() {
    const modal = document.getElementById('customGuideRegistrationModal');
    if (!modal) {
      console.error('カスタムガイド登録モーダルが見つかりません');
      return;
    }
    
    try {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    } catch (error) {
      console.error('モーダル表示エラー:', error);
      
      // フォールバック方法
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // バックドロップを追加
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  }
  
  // カスタムガイドモーダルを閉じる
  function closeCustomGuideModal() {
    const modal = document.getElementById('customGuideRegistrationModal');
    if (!modal) return;
    
    try {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      } else {
        throw new Error('Bootstrap Modal instance not found');
      }
    } catch (error) {
      console.error('モーダルを閉じる際のエラー:', error);
      
      // フォールバック方法
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // バックドロップを削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  }
  
  // カスタム電話認証モーダルを表示
  function showCustomPhoneVerificationModal() {
    const modal = document.getElementById('customPhoneVerificationModal');
    if (!modal) {
      console.error('カスタム電話認証モーダルが見つかりません');
      return;
    }
    
    try {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    } catch (error) {
      console.error('モーダル表示エラー:', error);
      
      // フォールバック方法
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // バックドロップを追加
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  }
  
  // カスタム電話認証モーダルを閉じる
  function closeCustomPhoneVerificationModal() {
    const modal = document.getElementById('customPhoneVerificationModal');
    if (!modal) return;
    
    try {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      } else {
        throw new Error('Bootstrap Modal instance not found');
      }
    } catch (error) {
      console.error('モーダルを閉じる際のエラー:', error);
      
      // フォールバック方法
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // バックドロップを削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
    
    // 状態をリセット（次回のため）
    setTimeout(function() {
      hideCustomVerificationStep('custom-phone-step-2');
      hideCustomVerificationStep('custom-phone-step-3');
      showCustomVerificationStep('custom-phone-step-1');
      
      const phoneInput = document.getElementById('custom-phone-number');
      const codeInput = document.getElementById('custom-verification-code');
      
      if (phoneInput) phoneInput.value = '';
      if (codeInput) codeInput.value = '';
    }, 300);
  }
  
  // カスタム電話認証ステップの表示・非表示
  function showCustomVerificationStep(stepId) {
    const step = document.getElementById(stepId);
    if (step) step.classList.remove('d-none');
  }
  
  function hideCustomVerificationStep(stepId) {
    const step = document.getElementById(stepId);
    if (step) step.classList.add('d-none');
  }
  
  // カスタム電話認証エラー表示・非表示
  function showCustomVerificationError(message) {
    const errorContainer = document.getElementById('custom-verification-error');
    const errorMessage = document.getElementById('custom-error-message');
    
    if (errorContainer && errorMessage) {
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }
  }
  
  function hideCustomVerificationError() {
    const errorContainer = document.getElementById('custom-verification-error');
    if (errorContainer) {
      errorContainer.classList.add('d-none');
    }
  }
  
  // 認証状態の更新
  function updateCustomVerificationStatus(isVerified) {
    // ガイド登録モーダル内の要素を更新
    const statusText = document.getElementById('custom-phone-verification-trigger');
    const verifiedInput = document.getElementById('custom-phone-verified');
    const phoneInput = document.getElementById('custom-verified-phone');
    const phoneNumber = document.getElementById('custom-phone-number');
    
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
  
  // カスタム認証コードのカウントダウン
  let customCountdownInterval;
  let customRemainingSeconds = 180; // 3分
  
  function startCustomVerificationCountdown() {
    stopCustomVerificationCountdown(); // 既存のインターバルをクリア
    
    customRemainingSeconds = 180;
    updateCustomCountdownDisplay();
    
    customCountdownInterval = setInterval(function() {
      customRemainingSeconds--;
      
      if (customRemainingSeconds <= 0) {
        stopCustomVerificationCountdown();
        showCustomVerificationError('認証コードの有効期限が切れました。もう一度送信してください。');
        
        // ステップ1に戻す
        hideCustomVerificationStep('custom-phone-step-2');
        showCustomVerificationStep('custom-phone-step-1');
      } else {
        updateCustomCountdownDisplay();
      }
    }, 1000);
  }
  
  function stopCustomVerificationCountdown() {
    if (customCountdownInterval) {
      clearInterval(customCountdownInterval);
      customCountdownInterval = null;
    }
  }
  
  function updateCustomCountdownDisplay() {
    const timerElement = document.getElementById('custom-countdown-timer');
    if (!timerElement) return;
    
    const minutes = Math.floor(customRemainingSeconds / 60);
    const seconds = customRemainingSeconds % 60;
    
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
})();