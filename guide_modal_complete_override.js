/**
 * ガイド登録モーダルのHTMLを完全に置き換える最終手段
 */
(function() {
  // テスト用認証コード
  const TEST_CODE = '123456';
  
  // 完全なモーダルの内容（既存のモーダルに置き換えるもの）
  const completeModalHTML = `
    <!-- ガイド登録モーダル（上書き版） -->
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">ガイド登録</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="guide-registration-form">
            <!-- 書類種類 -->
            <div class="mb-3">
              <label for="id-document-type" class="form-label">身分証明書の種類</label>
              <select class="form-select" id="id-document-type" required>
                <option value="" selected disabled>書類の種類を選択してください</option>
                <option value="drivers_license">運転免許証</option>
                <option value="passport">パスポート</option>
                <option value="residence_card">在留カード</option>
                <option value="my_number">マイナンバーカード</option>
              </select>
            </div>
            
            <!-- メールアドレス -->
            <div class="mb-3">
              <label for="guide-email" class="form-label">メールアドレス</label>
              <input type="email" class="form-control" id="guide-email" placeholder="example@mail.com" required>
            </div>
            
            <!-- 性別 -->
            <div class="mb-3">
              <label for="guide-gender" class="form-label">性別</label>
              <select class="form-select" id="guide-gender" required>
                <option value="" selected disabled>選択してください</option>
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
                <option value="no_answer">回答しない</option>
              </select>
            </div>
            
            <!-- 年齢層 -->
            <div class="mb-3">
              <label for="guide-age-group" class="form-label">年齢層</label>
              <select class="form-select" id="guide-age-group" required>
                <option value="" selected disabled>選択してください</option>
                <option value="18-24">18-24歳</option>
                <option value="25-34">25-34歳</option>
                <option value="35-44">35-44歳</option>
                <option value="45-54">45-54歳</option>
                <option value="55-64">55-64歳</option>
                <option value="65+">65歳以上</option>
              </select>
            </div>
            
            <!-- 電話番号認証セクション（追加部分） -->
            <div class="mb-4 p-3 bg-light border rounded" id="gmco-phone-section">
              <h5 class="fw-bold mb-3">電話番号認証</h5>
              <p class="text-muted mb-3">セキュリティのため、電話番号の認証を行ってください。</p>
              <div class="mb-3">
                <label for="guide-phone-number" class="form-label">電話番号</label>
                <div class="input-group">
                  <span class="input-group-text">+81</span>
                  <input type="tel" class="form-control" id="guide-phone-number" placeholder="9012345678（先頭の0は除く）" required>
                  <button class="btn btn-primary" type="button" id="guide-send-code-btn">認証コード送信</button>
                </div>
                <small class="form-text text-muted">ハイフンなしの電話番号を入力してください</small>
                <span class="unverified-text badge bg-secondary mt-2">未認証</span>
              </div>
              <div class="verification-code-container d-none">
                <div class="mb-3 bg-white p-3 border rounded">
                  <label for="guide-verification-code" class="form-label">認証コード</label>
                  <input type="text" class="form-control text-center fs-5" id="guide-verification-code" placeholder="6桁のコード">
                  <div class="text-center text-muted mt-2">SMSで送信された6桁のコードを入力してください</div>
                  <button type="button" class="btn btn-primary w-100 mt-3" id="guide-verify-code-btn">認証する</button>
                </div>
                <div id="guide-verification-alert" class="alert mt-3 d-none"></div>
              </div>
            </div>
            
            <!-- 自己紹介 -->
            <div class="mb-3">
              <label for="guide-bio" class="form-label">自己紹介（300文字以内）</label>
              <textarea class="form-control" id="guide-bio" rows="4" maxlength="300" placeholder="あなたの特技、趣味、提供できるサービスなどを紹介してください"></textarea>
              <div class="text-muted text-end mt-1"><span id="bio-char-count">0</span>/300文字</div>
            </div>
            
            <!-- 提供可能な言語 -->
            <div class="mb-3">
              <label class="form-label">対応可能な言語</label>
              <div class="language-options">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="lang-japanese" value="japanese" checked disabled>
                  <label class="form-check-label" for="lang-japanese">日本語</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="lang-english" value="english">
                  <label class="form-check-label" for="lang-english">英語</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="lang-chinese" value="chinese">
                  <label class="form-check-label" for="lang-chinese">中国語</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="lang-korean" value="korean">
                  <label class="form-check-label" for="lang-korean">韓国語</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="lang-spanish" value="spanish">
                  <label class="form-check-label" for="lang-spanish">スペイン語</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" id="lang-french" value="french">
                  <label class="form-check-label" for="lang-french">フランス語</label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
          <button type="button" class="btn btn-primary" id="submit-guide-registration">登録する</button>
        </div>
      </div>
    </div>
  `;
  
  // ページロード時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // 新規登録ボタンにイベントリスナーを追加
    const registerBtn = document.getElementById('show-user-type-modal');
    if (registerBtn) {
      registerBtn.addEventListener('click', function() {
        console.log('[GMCO] 新規登録ボタンがクリックされました');
        
        // ユーザータイプモーダルが開いたら、ガイドボタンにイベントリスナーを追加
        setTimeout(function() {
          const guideTypeBtn = document.getElementById('guide-type-btn');
          if (guideTypeBtn) {
            guideTypeBtn.addEventListener('click', waitForGuideModal);
          }
        }, 500);
      });
    }
    
    // 直接ガイド登録ボタンがあれば、それにもイベントリスナーを追加
    const directGuideButtons = document.querySelectorAll('.guide-register-button, #guide-registration-btn');
    directGuideButtons.forEach(function(button) {
      button.addEventListener('click', waitForGuideModal);
    });
    
    // モーダル表示イベントをリッスン
    document.body.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      if (modal.id === 'registerGuideModal' || 
          modal.querySelector('.modal-title')?.textContent.includes('ガイド登録')) {
        console.log('[GMCO] ガイド登録モーダルが表示されました');
        replaceModalContent(modal);
      }
    });
    
    // 既に表示されているモーダルをチェック
    checkExistingModal();
  });
  
  // 既に表示されているモーダルをチェック
  function checkExistingModal() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if (modal.id === 'registerGuideModal' || 
          modal.querySelector('.modal-title')?.textContent.includes('ガイド登録')) {
        console.log('[GMCO] 既に表示されているガイド登録モーダルを検出');
        replaceModalContent(modal);
      }
    });
  }
  
  // ガイド登録モーダルを待機
  function waitForGuideModal() {
    console.log('[GMCO] ガイド登録モーダルを待機中...');
    
    // モーダルが開くまで少し待つ
    setTimeout(function() {
      let guideModal = document.getElementById('registerGuideModal');
      
      // IDで見つからない場合、タイトルで検索
      if (!guideModal) {
        const modals = document.querySelectorAll('.modal.show');
        for (let modal of modals) {
          const title = modal.querySelector('.modal-title');
          if (title && title.textContent.includes('ガイド登録')) {
            guideModal = modal;
            break;
          }
        }
      }
      
      if (guideModal) {
        console.log('[GMCO] ガイド登録モーダルを検出');
        replaceModalContent(guideModal);
      } else {
        console.log('[GMCO] ガイド登録モーダルが見つかりません');
      }
    }, 500);
  }
  
  // モーダルの内容を置き換える
  function replaceModalContent(modal) {
    if (!modal) return;
    
    // 既に上書き済みか確認
    if (modal.querySelector('#gmco-phone-section')) {
      console.log('[GMCO] モーダルは既に上書き済みです');
      return;
    }
    
    console.log('[GMCO] モーダルの内容を完全に置き換えます');
    
    // 既存のモーダルの入力値を保持
    const existingValues = getExistingValues(modal);
    
    // モーダルの内容を置き換え
    modal.innerHTML = completeModalHTML;
    
    // 保持した入力値を新しいモーダルに反映
    restoreValues(modal, existingValues);
    
    // 文字数カウンター
    const bioTextarea = modal.querySelector('#guide-bio');
    const charCount = modal.querySelector('#bio-char-count');
    
    if (bioTextarea && charCount) {
      bioTextarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
      });
    }
    
    // 電話認証機能のイベントリスナーを設定
    setupVerificationListeners(modal);
    
    // 登録ボタンのイベントリスナー
    const submitBtn = modal.querySelector('#submit-guide-registration');
    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        const isVerified = sessionStorage.getItem('phone-verified') === 'true';
        if (!isVerified) {
          // 未認証の場合は警告を表示
          alert('電話番号認証を完了してください');
          // 電話番号入力欄にフォーカス
          const phoneInput = modal.querySelector('#guide-phone-number');
          if (phoneInput) phoneInput.focus();
          return;
        }
        
        // フォームバリデーション
        const form = modal.querySelector('#guide-registration-form');
        if (form && !form.checkValidity()) {
          // デフォルトのブラウザバリデーションを表示
          form.reportValidity();
          return;
        }
        
        // ここに登録処理を追加（実際の登録APIを呼び出すなど）
        // 今回はモックとして、成功メッセージを表示してモーダルを閉じる
        alert('ガイド登録が完了しました！');
        
        // モーダルを閉じる
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
      });
    }
  }
  
  // 既存のモーダルから入力値を取得
  function getExistingValues(modal) {
    return {
      documentType: modal.querySelector('select[id$="document-type"]')?.value,
      email: modal.querySelector('input[type="email"]')?.value,
      gender: modal.querySelector('select[id$="gender"]')?.value,
      ageGroup: modal.querySelector('select[id$="age-group"]')?.value,
      bio: modal.querySelector('textarea')?.value
    };
  }
  
  // 保持した入力値を新しいモーダルに反映
  function restoreValues(modal, values) {
    if (values.documentType)
      modal.querySelector('#id-document-type').value = values.documentType;
    
    if (values.email)
      modal.querySelector('#guide-email').value = values.email;
    
    if (values.gender)
      modal.querySelector('#guide-gender').value = values.gender;
    
    if (values.ageGroup)
      modal.querySelector('#guide-age-group').value = values.ageGroup;
    
    if (values.bio) {
      modal.querySelector('#guide-bio').value = values.bio;
      modal.querySelector('#bio-char-count').textContent = values.bio.length;
    }
  }
  
  // 電話認証のイベントリスナー設定
  function setupVerificationListeners(modal) {
    const phoneInput = modal.querySelector('#guide-phone-number');
    const sendCodeBtn = modal.querySelector('#guide-send-code-btn');
    const codeContainer = modal.querySelector('.verification-code-container');
    const codeInput = modal.querySelector('#guide-verification-code');
    const verifyBtn = modal.querySelector('#guide-verify-code-btn');
    const alertDiv = modal.querySelector('#guide-verification-alert');
    const unverifiedText = modal.querySelector('.unverified-text');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn) {
      console.error('[GMCO] 電話認証に必要な要素が見つかりません');
      return;
    }
    
    // 認証状態を確認
    const isVerified = sessionStorage.getItem('phone-verified') === 'true';
    if (isVerified) {
      // 既に認証済みの場合はUIを更新
      updateToVerifiedUI();
      return;
    }
    
    // コード送信ボタンのクリックイベント
    sendCodeBtn.addEventListener('click', function() {
      const phoneNumber = phoneInput.value.trim();
      
      if (!phoneNumber) {
        showAlert('電話番号を入力してください', 'danger');
        return;
      }
      
      // 電話番号の簡易バリデーション
      const phonePattern = /^\+?[0-9\s\-()]{6,20}$/;
      if (!phonePattern.test(phoneNumber)) {
        showAlert('有効な電話番号を入力してください', 'danger');
        return;
      }
      
      // 送信中表示
      showAlert('認証コードを送信しています...', 'info');
      
      // 送信シミュレーション
      setTimeout(function() {
        codeContainer.classList.remove('d-none');
        showAlert('認証コードを送信しました。SMSをご確認ください。', 'success');
        codeInput.focus();
        console.log('[GMCO] テスト用認証コード: ' + TEST_CODE);
      }, 1500);
    });
    
    // 認証ボタンのクリックイベント
    verifyBtn.addEventListener('click', function() {
      const code = codeInput.value.trim();
      
      if (!code) {
        showAlert('認証コードを入力してください', 'danger');
        return;
      }
      
      // 認証中表示
      showAlert('認証コードを確認しています...', 'info');
      
      // 認証シミュレーション
      setTimeout(function() {
        if (code === TEST_CODE) {
          // 認証成功
          updateToVerifiedUI();
          showAlert('電話番号認証が完了しました！', 'success');
          
          // 認証状態を保存
          sessionStorage.setItem('phone-verified', 'true');
        } else {
          // 認証失敗
          showAlert('認証コードが正しくありません。再度お試しください。', 'danger');
        }
      }, 1000);
    });
    
    // Enterキーのイベント処理
    phoneInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendCodeBtn.click();
      }
    });
    
    codeInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyBtn.click();
      }
    });
    
    // 認証済みUIに更新する関数
    function updateToVerifiedUI() {
      // 未認証テキストを非表示
      if (unverifiedText) {
        unverifiedText.style.display = 'none';
        
        // 認証済みバッジを追加
        const verifiedBadge = document.createElement('span');
        verifiedBadge.className = 'badge bg-success verification-badge ms-2';
        verifiedBadge.textContent = '認証済み';
        unverifiedText.parentNode.insertBefore(verifiedBadge, unverifiedText.nextSibling);
      }
      
      // 入力フィールドを読み取り専用に
      if (phoneInput) {
        phoneInput.readOnly = true;
      }
      
      // 送信ボタンを無効化
      if (sendCodeBtn) {
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = '認証済み';
      }
      
      // 認証コード入力セクションを非表示
      if (codeContainer) {
        codeContainer.classList.add('d-none');
      }
    }
    
    // アラートを表示する関数
    function showAlert(message, type) {
      if (!alertDiv) return;
      
      alertDiv.textContent = message;
      alertDiv.className = `alert alert-${type} mt-3`;
      alertDiv.classList.remove('d-none');
      
      // 成功メッセージは5秒後に消す
      if (type === 'success') {
        setTimeout(function() {
          alertDiv.classList.add('d-none');
        }, 5000);
      }
    }
  }
  
  // モーダル表示を定期的にチェック（フォールバックとして）
  setInterval(function() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if ((modal.id === 'registerGuideModal' || 
          modal.querySelector('.modal-title')?.textContent.includes('ガイド登録')) && 
          !modal.querySelector('#gmco-phone-section')) {
        console.log('[GMCO] 表示中ガイド登録モーダルを検出（定期チェック）');
        replaceModalContent(modal);
      }
    });
  }, 1000);
})();