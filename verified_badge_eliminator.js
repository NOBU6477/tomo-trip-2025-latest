/**
 * 認証済みバッジ削除の最終決定版
 * ガイド登録モーダルに特化した最も徹底的な解決策
 */
(function() {
  console.log('VerifiedBadgeEliminator: 初期化');
  
  // 即時実行と定期実行の両方を設定
  executeNow();
  
  // モーダルが表示された時のイベントリスナー
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'guideRegistrationModal') {
      console.log('ガイド登録モーダル表示を検知');
      executeNow();
      
      // 確実に削除するために少し遅延実行も行う
      setTimeout(executeNow, 100);
      setTimeout(executeNow, 500);
    }
  });
  
  // クリックイベントを監視（操作時のDOM変更を検知）
  document.addEventListener('click', function(event) {
    const guideModal = document.getElementById('guideRegistrationModal');
    if (guideModal && isModalOpen(guideModal)) {
      // クリック後に実行
      setTimeout(executeNow, 50);
    }
  });
  
  // 定期的に実行して確認
  setInterval(executeNow, 1000);
  
  // モーダルのDOM変更を監視
  setupMutationObserver();
  
  /**
   * 最終解決策を即時実行する
   */
  function executeNow() {
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal || !isModalOpen(guideModal)) return;
    
    console.log('最終バッジ削除実行');
    
    // このスクリプトにおけるメイン処理
    fixVerificationSection(guideModal);
  }
  
  /**
   * DOM変更を監視
   */
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      const guideModal = document.getElementById('guideRegistrationModal');
      if (guideModal && isModalOpen(guideModal)) {
        executeNow();
      }
    });
    
    // document全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden']
    });
  }
  
  /**
   * 電話番号認証セクションを修正
   */
  function fixVerificationSection(modal) {
    // 電話番号認証セクションを探す
    const section = findPhoneVerificationSection(modal);
    if (!section) {
      console.log('電話番号認証セクションが見つかりません');
      return;
    }
    
    // 対策1: セクション自体を複製して置き換える（最も強力な方法）
    replaceEntireSection(section);
  }
  
  /**
   * セクション全体を置き換え
   */
  function replaceEntireSection(section) {
    // すでに置き換え済みなら何もしない
    if (section.hasAttribute('data-replaced-by-eliminator')) {
      return;
    }
    
    // 親要素を取得
    const parent = section.parentElement;
    if (!parent) return;
    
    // 元のラベルテキストを取得
    const label = section.querySelector('label');
    const labelText = label ? label.textContent : '電話番号認証';
    
    // 新しいセクションを作成
    const newSection = document.createElement('div');
    newSection.className = section.className || 'mb-3';
    newSection.setAttribute('data-replaced-by-eliminator', 'true');
    
    // 内部の要素をシンプルに
    newSection.innerHTML = `
      <label class="form-label">${labelText}</label>
      <span class="text-muted unverified-text" style="margin-left: 0.5rem; cursor: pointer;">未表示</span>
    `;
    
    // 必要なスタイルを設定
    newSection.style.cssText = section.style.cssText;
    
    // クリックイベントを設定
    const unverifiedText = newSection.querySelector('.unverified-text');
    if (unverifiedText) {
      unverifiedText.onclick = function() {
        const phoneModal = document.getElementById('phoneVerificationModal');
        if (phoneModal) {
          try {
            const modal = new bootstrap.Modal(phoneModal);
            modal.show();
          } catch (error) {
            console.error('電話認証モーダル表示エラー:', error);
            
            // 直接的なバックアップ方法
            phoneModal.classList.add('show');
            phoneModal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
          }
        } else {
          console.log('電話認証モーダルがありません。作成します。');
          createPhoneVerificationModal();
        }
      };
    }
    
    // 古いセクションを削除
    section.style.display = 'none';
    
    // 新しいセクションを挿入
    parent.insertBefore(newSection, section);
    
    console.log('電話番号認証セクションを完全に置き換えました');
  }
  
  /**
   * 電話番号認証セクションを見つける
   */
  function findPhoneVerificationSection(modal) {
    // ラベルベースで探す
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        return label.closest('.form-group, .mb-3, [class*="form"]') || label.parentElement;
      }
    }
    
    // テキストベースで探す
    const allElements = modal.querySelectorAll('*');
    for (const element of allElements) {
      if (element.textContent && element.textContent.includes('電話番号認証') && element.childNodes.length > 0) {
        return element.closest('.form-group, .mb-3, [class*="form"]') || element.parentElement;
      }
    }
    
    return null;
  }
  
  /**
   * モーダルが開いているかチェック
   */
  function isModalOpen(modal) {
    return modal.classList.contains('show') && window.getComputedStyle(modal).display !== 'none';
  }
  
  /**
   * 電話認証モーダルが存在しない場合に作成
   */
  function createPhoneVerificationModal() {
    if (document.getElementById('phoneVerificationModal')) return;
    
    const modalHTML = `
      <div class="modal fade" id="phoneVerificationModal" tabindex="-1" aria-labelledby="phoneVerificationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="phoneVerificationModalLabel">電話番号認証</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-4">
                <div class="phone-verification-icon mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>
                </div>
                <h4>電話番号を認証します</h4>
                <p class="text-muted">
                  あなたの電話番号を認証するためにSMSを送信します。<br>
                  電話番号を入力して「コードを送信」ボタンをクリックしてください。
                </p>
              </div>
              
              <div id="phone-step-1">
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
              
              <div id="phone-step-2" class="d-none">
                <div class="mb-3">
                  <label for="verification-code" class="form-label">認証コードを入力</label>
                  <input type="text" class="form-control" id="verification-code" placeholder="123456" maxlength="6">
                  <div class="mt-2 text-muted">
                    認証コードは <span id="countdown-timer">03:00</span> 以内に入力してください
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" id="back-to-phone-btn">戻る</button>
                  <button type="button" class="btn btn-primary" id="verify-code-btn">認証する</button>
                </div>
              </div>
              
              <div id="phone-step-3" class="d-none">
                <div class="text-center mb-4">
                  <div class="verification-success-icon mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
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
              
              <div id="verification-error" class="alert alert-danger d-none mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span id="error-message"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstChild);
    
    // イベントリスナーを設定
    setupPhoneVerificationEvents();
    
    console.log('電話認証モーダルを作成しました');
  }
  
  /**
   * 電話認証モーダルのイベントを設定
   */
  function setupPhoneVerificationEvents() {
    const phoneModal = document.getElementById('phoneVerificationModal');
    if (!phoneModal) return;
    
    // コード送信ボタン
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', function() {
        const phoneInput = document.getElementById('phone-number');
        if (!phoneInput || !phoneInput.value) {
          showVerificationError('電話番号を入力してください');
          return;
        }
        
        // ステップ2に進む
        hideElement('phone-step-1');
        showElement('phone-step-2');
        hideVerificationError();
        
        // カウントダウン開始
        startVerificationCountdown();
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
        
        // テスト用認証コード
        if (codeInput.value === '123456') {
          // ステップ3に進む
          hideElement('phone-step-2');
          showElement('phone-step-3');
          hideVerificationError();
          stopVerificationCountdown();
        } else {
          showVerificationError('認証コードが一致しません');
        }
      });
    }
    
    // 戻るボタン
    const backBtn = document.getElementById('back-to-phone-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        hideElement('phone-step-2');
        showElement('phone-step-1');
        hideVerificationError();
        stopVerificationCountdown();
      });
    }
    
    // 完了ボタン
    const completeBtn = document.getElementById('complete-verification-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', function() {
        // モーダルを閉じる
        try {
          const modal = bootstrap.Modal.getInstance(phoneModal);
          modal.hide();
        } catch (error) {
          // バックアップ方法
          phoneModal.classList.remove('show');
          phoneModal.style.display = 'none';
          document.body.classList.remove('modal-open');
          
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          }
        }
        
        // 認証完了状態をリセット
        setTimeout(function() {
          hideElement('phone-step-3');
          showElement('phone-step-1');
          
          const phoneInput = document.getElementById('phone-number');
          const codeInput = document.getElementById('verification-code');
          
          if (phoneInput) phoneInput.value = '';
          if (codeInput) codeInput.value = '';
        }, 500);
      });
    }
  }
  
  // 要素表示・非表示ヘルパー
  function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove('d-none');
    }
  }
  
  function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('d-none');
    }
  }
  
  // 認証エラー表示
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
  
  // 検証コードのカウントダウン
  let countdownInterval;
  let remainingSeconds = 180; // 3分
  
  function startVerificationCountdown() {
    stopVerificationCountdown(); // 既存のタイマーをクリア
    
    remainingSeconds = 180;
    updateCountdownDisplay();
    
    countdownInterval = setInterval(function() {
      remainingSeconds--;
      
      if (remainingSeconds <= 0) {
        stopVerificationCountdown();
        showVerificationError('認証コードの有効期限が切れました。もう一度送信してください。');
        
        // ステップ1に戻す
        hideElement('phone-step-2');
        showElement('phone-step-1');
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
})();