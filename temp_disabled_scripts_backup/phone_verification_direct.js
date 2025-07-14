/**
 * 電話番号認証の直接実装
 * 「認証済み」を削除し、「未表示」を設置して認証モーダルを表示する
 */
(function() {
  // 初期化
  function init() {
    console.log('電話番号認証直接実装: 初期化');
    
    // モーダルHTMLを直接挿入
    insertPhoneVerificationModal();
    
    // イベントリスナーを設定
    setupEventListeners();
    
    // MutationObserverの設定
    setupMutationObserver();
    
    // ガイド登録モーダルの初期化
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示: 電話認証要素を初期化');
        setTimeout(setupPhoneVerificationSection, 100);
      }
    });
    
    // 初期実行
    setTimeout(setupPhoneVerificationSection, 500);
  }
  
  // 電話番号認証モーダルのHTMLを直接挿入
  function insertPhoneVerificationModal() {
    if (document.getElementById('phoneVerificationModal')) {
      console.log('電話番号認証モーダルは既に存在します');
      return;
    }
    
    const modalHTML = `
      <!-- 電話番号認証モーダル -->
      <div class="modal fade" id="phoneVerificationModal" tabindex="-1" aria-labelledby="phoneVerificationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="phoneVerificationModalLabel">電話番号認証</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-4">
                <div class="phone-verification-icon">
                  <i data-feather="smartphone"></i>
                </div>
                <h4 class="phone-verification-title">電話番号を認証します</h4>
                <p class="phone-verification-subtitle">
                  あなたの電話番号を認証するためにSMSを送信します。<br>
                  電話番号を入力して「コードを送信」ボタンをクリックしてください。
                </p>
              </div>
              
              <div id="phone-step-1" class="verification-step">
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
              
              <div id="phone-step-2" class="verification-step d-none">
                <div class="mb-3">
                  <label for="verification-code" class="form-label">認証コードを入力</label>
                  <input type="text" class="form-control" id="verification-code" placeholder="123456" maxlength="6" autocomplete="one-time-code">
                  <div id="verification-countdown" class="verification-info mt-2">
                    認証コードは <span id="countdown-timer">03:00</span> 以内に入力してください
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" id="back-to-phone-btn">戻る</button>
                  <button type="button" class="btn btn-primary verification-button" id="verify-code-btn">認証する</button>
                </div>
              </div>
              
              <div id="phone-step-3" class="verification-step d-none">
                <div class="text-center mb-4">
                  <div class="verification-success-icon">
                    <i data-feather="check-circle" class="text-success" style="width: 64px; height: 64px;"></i>
                  </div>
                  <h4 class="mt-3">認証完了</h4>
                  <p class="text-muted">
                    電話番号の認証が正常に完了しました。
                  </p>
                </div>
                <div class="d-grid">
                  <button type="button" class="btn btn-success" id="complete-verification-btn">完了</button>
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
    
    // Featherアイコンを初期化
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }
  
  // 電話番号認証セクションの設定
  function setupPhoneVerificationSection() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal || !isModalVisible(guideModal)) return;
    
    // 電話番号認証セクションを探す
    const phoneSection = findPhoneVerificationSection(guideModal);
    if (!phoneSection) {
      console.log('電話番号認証セクションが見つかりません');
      return;
    }
    
    console.log('電話番号認証セクション発見:', phoneSection);
    
    // 既存の認証済みバッジを削除
    removeVerifiedBadges(phoneSection);
    
    // 「未表示」テキストを設定
    setupUnverifiedText(phoneSection);
  }
  
  // 認証済みバッジを削除
  function removeVerifiedBadges(container) {
    // 緑色ボタンを探す
    const successButtons = container.querySelectorAll('.btn-success');
    for (const button of successButtons) {
      if (button.textContent && button.textContent.trim() === '認証済み') {
        button.style.display = 'none';
        button.style.visibility = 'hidden';
        button.style.opacity = '0';
        button.style.height = '0';
        button.style.width = '0';
        button.style.overflow = 'hidden';
        button.style.padding = '0';
        button.style.margin = '0';
        button.style.border = 'none';
        button.style.position = 'absolute';
        button.style.left = '-9999px';
        button.classList.add('d-none');
        console.log('認証済みボタンを非表示化:', button);
      }
    }
    
    // 緑色バッジを探す
    const successBadges = container.querySelectorAll('.badge.bg-success, .badge-success');
    for (const badge of successBadges) {
      if (badge.textContent && badge.textContent.trim() === '認証済み') {
        badge.style.display = 'none';
        badge.style.visibility = 'hidden';
        badge.style.opacity = '0';
        badge.style.height = '0';
        badge.style.width = '0';
        badge.style.overflow = 'hidden';
        badge.style.padding = '0';
        badge.style.margin = '0';
        badge.style.border = 'none';
        badge.style.position = 'absolute';
        badge.style.left = '-9999px';
        badge.classList.add('d-none');
        console.log('認証済みバッジを非表示化:', badge);
      }
    }
    
    // テキストで探す（クラスに関係なく）
    const allElements = container.querySelectorAll('*');
    for (const element of allElements) {
      if (element.nodeType === 1 && element.textContent && element.textContent.trim() === '認証済み') {
        // すでに処理済みでないか確認
        if (isVisible(element)) {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.position = 'absolute';
          element.style.left = '-9999px';
          element.classList.add('d-none');
          console.log('テキストで特定した認証済み要素を非表示化:', element);
        }
      }
    }
  }
  
  // 「未表示」テキストを設定
  function setupUnverifiedText(container) {
    // 既存の「未表示」テキストを探す
    let unverifiedText = null;
    const textElements = container.querySelectorAll('.text-muted, span, div');
    
    for (const element of textElements) {
      if (element.textContent && element.textContent.trim() === '未表示' && isVisible(element)) {
        unverifiedText = element;
        break;
      }
    }
    
    // 既存の「未表示」テキストがあればクリックイベントを設定
    if (unverifiedText) {
      console.log('既存の「未表示」テキストを発見:', unverifiedText);
      
      // スタイルを確保
      unverifiedText.style.display = 'inline-block';
      unverifiedText.style.visibility = 'visible';
      unverifiedText.style.opacity = '1';
      unverifiedText.style.cursor = 'pointer';
      unverifiedText.classList.remove('d-none');
      
      // クリックイベントがなければ追加
      if (!unverifiedText.onclick) {
        unverifiedText.onclick = function() {
          const phoneModal = document.getElementById('phoneVerificationModal');
          if (phoneModal) {
            const modal = new bootstrap.Modal(phoneModal);
            modal.show();
          }
        };
      }
      
      return;
    }
    
    // 「未表示」テキストがなければ新規作成
    console.log('「未表示」テキストを新規作成');
    
    const newUnverifiedText = document.createElement('span');
    newUnverifiedText.className = 'text-muted ms-2';
    newUnverifiedText.textContent = '未表示';
    newUnverifiedText.style.cursor = 'pointer';
    
    // クリックイベントを設定
    newUnverifiedText.onclick = function() {
      const phoneModal = document.getElementById('phoneVerificationModal');
      if (phoneModal) {
        const modal = new bootstrap.Modal(phoneModal);
        modal.show();
      }
    };
    
    // 適切な位置に挿入
    const label = container.querySelector('label');
    if (label) {
      // ラベルの後に挿入
      if (label.nextSibling) {
        label.parentNode.insertBefore(newUnverifiedText, label.nextSibling);
      } else {
        label.parentNode.appendChild(newUnverifiedText);
      }
    } else {
      // ラベルがない場合はコンテナの先頭に追加
      if (container.firstChild) {
        container.insertBefore(newUnverifiedText, container.firstChild);
      } else {
        container.appendChild(newUnverifiedText);
      }
    }
  }
  
  // 電話番号認証モーダルのイベントリスナー設定
  function setupEventListeners() {
    // 電話番号認証モーダルを取得
    const phoneModal = document.getElementById('phoneVerificationModal');
    if (!phoneModal) return;
    
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
    phoneModal.addEventListener('hidden.bs.modal', function() {
      resetVerificationUI();
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
  
  // DOM変更を監視するMutationObserverの設定
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      // ガイド登録モーダルが表示されている場合のみ処理
      const guideModal = document.getElementById('guideRegistrationModal');
      if (guideModal && isModalVisible(guideModal)) {
        setupPhoneVerificationSection();
      }
    });
    
    // body全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(container) {
    // ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        return label.closest('.form-group, .row, .mb-3') || label.parentElement;
      }
    }
    
    // テキストで探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === 1) {
        return el.closest('.form-group, .row, .mb-3') || el.parentElement;
      }
    }
    
    return null;
  }
  
  // 要素が表示されているかチェック
  function isVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           !element.classList.contains('d-none');
  }
  
  // モーダルが表示されているかチェック
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
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
    const phoneNumber = phone.replace(/-/g, '');
    
    // テスト環境ではモックとしてステップ2に進む
    console.log('認証コード送信処理: 電話番号', phoneNumber);
    showStep(2);
    startCountdown();
    hideError();
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
    } else {
      // 認証失敗
      showError('認証コードが一致しません。もう一度お試しください。');
    }
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
    updateVerificationStatus();
    
    // 状態をリセット
    resetVerificationUI();
  }
  
  // ガイド登録モーダルの認証状態を更新
  function updateVerificationStatus() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    // 電話番号認証セクションを探す
    const phoneSection = findPhoneVerificationSection(guideModal);
    if (!phoneSection) return;
    
    // 「未表示」テキストを探す
    let unverifiedText = null;
    const textElements = phoneSection.querySelectorAll('.text-muted, span, div');
    
    for (const element of textElements) {
      if (element.textContent && element.textContent.trim() === '未表示' && isVisible(element)) {
        unverifiedText = element;
        break;
      }
    }
    
    if (!unverifiedText) return;
    
    // 「未表示」テキストを「認証済み」テキストに変更
    unverifiedText.textContent = '認証済み（テキスト）';
    unverifiedText.className = 'text-muted ms-2';
    unverifiedText.style.cursor = 'default';
    unverifiedText.style.color = '#6c757d';
    
    // クリックイベントを削除
    unverifiedText.onclick = null;
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
  
  // グローバル変数
  let countdownInterval;
  let remainingTime = 180; // 3分間
  
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
  }
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時にも実行
  window.addEventListener('load', init);
})();