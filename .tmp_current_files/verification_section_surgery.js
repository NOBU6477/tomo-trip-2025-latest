/**
 * 電話認証セクションに特化した外科手術的アプローチ
 * 電話認証関連の要素だけを徹底的に修正し、他の部分には一切手を付けない
 */
(function() {
  console.log('Verification Section Surgery: 初期化');
  
  // DOM読み込み完了時
  document.addEventListener('DOMContentLoaded', init);
  
  // ウィンドウ読み込み完了時
  window.addEventListener('load', init);
  
  // 初期化関数
  function init() {
    console.log('Verification Section Surgery: DOM準備完了');
    
    // モーダル表示イベントを監視
    document.addEventListener('shown.bs.modal', handleModalShown);
    
    // DOM変更の監視を開始
    setupMutationObserver();
    
    // 初期実行（既に表示されている場合に対応）
    setTimeout(analyzeDocument, 500);
    
    // 定期チェック
    setInterval(analyzeDocument, 1000);
  }
  
  // モーダル表示イベントハンドラ
  function handleModalShown(event) {
    if (event.target.id === 'guideRegistrationModal') {
      console.log('ガイド登録モーダルが表示されました');
      
      // モーダル表示時に実行
      setTimeout(performSurgery, 100);
      setTimeout(performSurgery, 300);
      setTimeout(performSurgery, 500);
    }
  }
  
  // DOM変更監視の設定
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      let shouldCheck = false;
      
      // ガイド登録モーダルへの変更があるかチェック
      for (const mutation of mutations) {
        if (mutation.target) {
          const modalElement = findAncestorWithId(mutation.target, 'guideRegistrationModal');
          if (modalElement) {
            shouldCheck = true;
            break;
          }
        }
      }
      
      if (shouldCheck) {
        performSurgery();
      }
    });
    
    // body全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden']
    });
  }
  
  // 先祖要素からIDで検索
  function findAncestorWithId(element, id) {
    let current = element;
    while (current) {
      if (current.id === id) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
  
  // ドキュメント全体を分析
  function analyzeDocument() {
    const guideModal = document.getElementById('guideRegistrationModal');
    if (guideModal && isElementVisible(guideModal)) {
      performSurgery();
    }
  }
  
  // 電話認証セクションの外科手術的アプローチ
  function performSurgery() {
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal || !isElementVisible(guideModal)) return;
    
    // 電話認証セクションを見つける
    const verificationSections = findAllPhoneVerificationSections(guideModal);
    
    if (verificationSections.length === 0) {
      console.log('電話認証セクションが見つかりません');
      return;
    }
    
    console.log(`${verificationSections.length}個の電話認証セクションを発見`);
    
    // すべての認証セクションに対して処理
    for (const section of verificationSections) {
      // 処理済みマークの確認
      if (!section.hasAttribute('data-surgery-completed')) {
        performVerificationSectionSurgery(section);
      }
    }
  }
  
  // 電話認証セクションを見つける（複数の可能性を考慮）
  function findAllPhoneVerificationSections(container) {
    const sections = [];
    
    // ラベルから探す方法
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        const section = label.closest('.form-group, .mb-3, .row, div[class*="form"]') || label.parentElement;
        if (section && !sections.includes(section)) {
          sections.push(section);
        }
      }
    }
    
    // テキストから探す方法
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === Node.ELEMENT_NODE) {
        // ラベル以外のテキストノードから探す
        if (el.tagName !== 'LABEL') {
          const section = el.closest('.form-group, .mb-3, .row, div[class*="form"]') || el.parentElement;
          if (section && !sections.includes(section)) {
            sections.push(section);
          }
        }
      }
    }
    
    return sections;
  }
  
  // 電話認証セクションの外科手術的修正
  function performVerificationSectionSurgery(section) {
    console.log('電話認証セクションの外科手術を実行:', section);
    
    // 手順1: すべての緑色バッジと認証済みボタンを探して削除
    removeVerifiedElements(section);
    
    // 手順2: 「未表示」テキストの状態を確認・修正
    ensureUnverifiedText(section);
    
    // 処理済みマークを付ける
    section.setAttribute('data-surgery-completed', 'true');
    
    console.log('電話認証セクションの外科手術が完了しました');
  }
  
  // 認証済み要素を削除
  function removeVerifiedElements(section) {
    // 緑色バッジを検出
    const greenBadges = section.querySelectorAll('.badge.bg-success, .badge-success, [class*="badge"][class*="success"]');
    for (const badge of greenBadges) {
      const text = badge.textContent && badge.textContent.trim();
      if (text === '認証済み') {
        console.log('緑色バッジを除去:', badge);
        forceRemoveElement(badge);
      }
    }
    
    // 緑色ボタンを検出
    const greenButtons = section.querySelectorAll('.btn-success, .btn.bg-success, [class*="btn"][class*="success"]');
    for (const button of greenButtons) {
      const text = button.textContent && button.textContent.trim();
      if (text === '認証済み') {
        console.log('緑色ボタンを除去:', button);
        forceRemoveElement(button);
      }
    }
    
    // テキストで検索
    const allElements = section.querySelectorAll('*');
    for (const el of allElements) {
      // テキストノードのみをチェック
      const hasVerifiedText = Array.from(el.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .some(node => node.textContent && node.textContent.trim() === '認証済み');
      
      if (hasVerifiedText) {
        console.log('認証済みテキストを含む要素を除去:', el);
        
        // テキストノードだけを削除（要素自体は残す）
        for (const node of Array.from(el.childNodes)) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim() === '認証済み') {
            el.removeChild(node);
          }
        }
      }
    }
    
    // 緑色背景の要素を検出
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;
      
      // 緑色系の背景色をチェック
      if (isGreenColor(bgColor) && el.textContent && el.textContent.includes('認証済み')) {
        console.log('緑色背景要素を除去:', el);
        forceRemoveElement(el);
      }
    });
  }
  
  // 「未表示」テキストを確保する
  function ensureUnverifiedText(section) {
    // 既存の「未表示」テキストを探す
    let unverifiedText = findUnverifiedTextElement(section);
    
    // 「未表示」テキストが見つかった場合
    if (unverifiedText) {
      console.log('既存の「未表示」テキストを発見:', unverifiedText);
      
      // 表示状態を確保
      unverifiedText.style.display = 'inline-block';
      unverifiedText.style.visibility = 'visible';
      unverifiedText.style.opacity = '1';
      unverifiedText.style.height = 'auto';
      unverifiedText.style.width = 'auto';
      unverifiedText.style.position = 'static';
      unverifiedText.style.pointerEvents = 'auto';
      unverifiedText.style.cursor = 'pointer';
      
      // クラスを整える
      unverifiedText.classList.remove('d-none', 'invisible', 'visually-hidden');
      if (!unverifiedText.classList.contains('text-muted')) {
        unverifiedText.classList.add('text-muted');
      }
      
      // クリックイベントを設定（もしなければ）
      if (!unverifiedText.onclick) {
        unverifiedText.onclick = showPhoneVerificationModal;
      }
    } else {
      // 「未表示」テキストがない場合は新規作成
      console.log('「未表示」テキストを新規作成');
      
      // ラベルを取得
      const label = section.querySelector('label');
      
      // 新しいテキスト要素を作成
      unverifiedText = document.createElement('span');
      unverifiedText.className = 'text-muted unverified-text';
      unverifiedText.textContent = '未表示';
      unverifiedText.style.marginLeft = '0.5rem';
      unverifiedText.style.cursor = 'pointer';
      unverifiedText.onclick = showPhoneVerificationModal;
      
      // ラベルがある場合はその横に配置
      if (label) {
        label.parentNode.insertBefore(unverifiedText, label.nextSibling);
      } else {
        // ラベルがない場合はセクションの先頭に追加
        section.prepend(unverifiedText);
      }
    }
  }
  
  // 「未表示」テキスト要素を探す
  function findUnverifiedTextElement(container) {
    // テキストコンテンツで探す
    const elements = container.querySelectorAll('span, div, small, p, a, button');
    
    for (const el of elements) {
      // テキストノードのみをチェック
      const directTextContent = Array.from(el.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join('');
      
      if (directTextContent === '未表示' && isElementVisible(el)) {
        return el;
      }
    }
    
    return null;
  }
  
  // 電話認証モーダルを表示
  function showPhoneVerificationModal() {
    const phoneModal = document.getElementById('phoneVerificationModal');
    
    if (phoneModal) {
      try {
        const modal = new bootstrap.Modal(phoneModal);
        modal.show();
      } catch (error) {
        console.error('モーダル表示エラー:', error);
        
        // バックアップメソッド
        phoneModal.classList.add('show');
        phoneModal.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // バックドロップを追加
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    } else {
      console.log('電話認証モーダルが存在しないため作成します');
      createPhoneVerificationModal();
    }
  }
  
  // 要素を強制的に削除
  function forceRemoveElement(element) {
    if (!element || !element.parentNode) return;
    
    try {
      // 単純な削除を試みる
      element.parentNode.removeChild(element);
    } catch (error) {
      console.error('要素削除エラー:', error);
      
      // 代替手段: 非表示化
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.height = '0';
      element.style.width = '0';
      element.style.overflow = 'hidden';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      
      // クラスで非表示
      element.classList.add('d-none', 'invisible', 'visually-hidden');
      
      // 内容を空にする
      element.innerHTML = '';
      element.textContent = '';
    }
  }
  
  // 要素が表示されているかをチェック
  function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           !element.classList.contains('d-none') &&
           !element.classList.contains('invisible') &&
           !element.classList.contains('visually-hidden');
  }
  
  // RGB色が緑色系かをチェック
  function isGreenColor(color) {
    // rgb, rgba形式の色をパース
    const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
    
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      
      // 緑が主要な色で、赤と青より顕著に高い場合
      return g > 100 && g > r * 1.5 && g > b * 1.5;
    }
    
    return false;
  }
  
  // 電話認証モーダルを作成
  function createPhoneVerificationModal() {
    // 既存のモーダルを確認
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
                <div class="phone-verification-icon">
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
                  <div class="verification-success-icon">
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
    
    // モーダルをDOMに追加
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstChild);
    
    // モーダル用のイベントリスナーを設定
    setupPhoneModalListeners();
    
    console.log('電話認証モーダルを作成しました');
  }
  
  // 電話認証モーダルのイベントリスナーを設定
  function setupPhoneModalListeners() {
    // コード送信ボタン
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', function() {
        const phoneInput = document.getElementById('phone-number');
        if (!phoneInput || !phoneInput.value) {
          showPhoneError('電話番号を入力してください');
          return;
        }
        
        // ステップ2に進む
        hidePhoneElement('phone-step-1');
        showPhoneElement('phone-step-2');
        hidePhoneError();
        
        // カウントダウン開始
        startPhoneCountdown();
      });
    }
    
    // 認証コード確認ボタン
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    if (verifyCodeBtn) {
      verifyCodeBtn.addEventListener('click', function() {
        const codeInput = document.getElementById('verification-code');
        if (!codeInput || !codeInput.value) {
          showPhoneError('認証コードを入力してください');
          return;
        }
        
        // テスト用認証コード「123456」
        if (codeInput.value === '123456') {
          // ステップ3に進む
          hidePhoneElement('phone-step-2');
          showPhoneElement('phone-step-3');
          hidePhoneError();
          stopPhoneCountdown();
        } else {
          showPhoneError('認証コードが一致しません');
        }
      });
    }
    
    // 戻るボタン
    const backBtn = document.getElementById('back-to-phone-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        hidePhoneElement('phone-step-2');
        showPhoneElement('phone-step-1');
        hidePhoneError();
        stopPhoneCountdown();
      });
    }
    
    // 完了ボタン
    const completeBtn = document.getElementById('complete-verification-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', function() {
        const phoneModal = document.getElementById('phoneVerificationModal');
        
        // モーダルを閉じる
        try {
          const modal = bootstrap.Modal.getInstance(phoneModal);
          modal.hide();
        } catch (error) {
          // 直接DOMを操作して閉じる
          phoneModal.classList.remove('show');
          phoneModal.style.display = 'none';
          document.body.classList.remove('modal-open');
          
          // バックドロップを削除
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        }
        
        // 状態をリセット
        setTimeout(function() {
          hidePhoneElement('phone-step-3');
          showPhoneElement('phone-step-1');
          
          // 入力フィールドをクリア
          const phoneInput = document.getElementById('phone-number');
          const codeInput = document.getElementById('verification-code');
          
          if (phoneInput) phoneInput.value = '';
          if (codeInput) codeInput.value = '';
        }, 300);
      });
    }
  }
  
  // 電話認証モーダル用のヘルパー関数
  function showPhoneElement(id) {
    const element = document.getElementById(id);
    if (element) element.classList.remove('d-none');
  }
  
  function hidePhoneElement(id) {
    const element = document.getElementById(id);
    if (element) element.classList.add('d-none');
  }
  
  function showPhoneError(message) {
    const errorContainer = document.getElementById('verification-error');
    const errorMessage = document.getElementById('error-message');
    
    if (errorContainer && errorMessage) {
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }
  }
  
  function hidePhoneError() {
    const errorContainer = document.getElementById('verification-error');
    if (errorContainer) errorContainer.classList.add('d-none');
  }
  
  // カウントダウン関連
  let phoneCountdownInterval;
  let phoneRemainingSeconds = 180; // 3分
  
  function startPhoneCountdown() {
    stopPhoneCountdown(); // 既存のインターバルをクリア
    
    phoneRemainingSeconds = 180;
    updatePhoneCountdown();
    
    phoneCountdownInterval = setInterval(function() {
      phoneRemainingSeconds--;
      
      if (phoneRemainingSeconds <= 0) {
        stopPhoneCountdown();
        showPhoneError('認証コードの有効期限が切れました。もう一度送信してください。');
        
        // ステップ1に戻る
        hidePhoneElement('phone-step-2');
        showPhoneElement('phone-step-1');
      } else {
        updatePhoneCountdown();
      }
    }, 1000);
  }
  
  function stopPhoneCountdown() {
    if (phoneCountdownInterval) {
      clearInterval(phoneCountdownInterval);
      phoneCountdownInterval = null;
    }
  }
  
  function updatePhoneCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;
    
    const minutes = Math.floor(phoneRemainingSeconds / 60);
    const seconds = phoneRemainingSeconds % 60;
    
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
})();