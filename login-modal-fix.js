/**
 * ログインモーダル専用翻訳修正スクリプト
 * モーダル表示時にリアルタイムで翻訳を適用します
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ログインモーダル翻訳修正スクリプトを読み込みました');
  
  // 即時実行
  setTimeout(initLoginModalFix, 100);
  
  /**
   * 初期化（遅延実行）
   */
  function initLoginModalFix() {
    // モーダル表示イベントをリッスン
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
      // 既に表示されている場合はすぐに翻訳
      if (isModalVisible(loginModal)) {
        console.log('ログインモーダルは既に表示されています');
        translateLoginModal();
      }
      
      // モーダル表示イベント
      loginModal.addEventListener('shown.bs.modal', function() {
        console.log('ログインモーダルが表示されました');
        translateLoginModal();
      });
      
      // クリックイベントのキャプチャ
      document.body.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'loginButton' || e.target.classList.contains('login-button') || 
            (e.target.tagName === 'A' && e.target.getAttribute('data-bs-target') === '#loginModal'))) {
          console.log('ログインボタンがクリックされました');
          setTimeout(function() {
            translateLoginModal();
          }, 200);
        }
      });
    }
    
    // 言語切り替えイベントをリッスン
    window.addEventListener('languageChanged', function(e) {
      console.log('言語が変更されました:', e.detail.language);
      
      // ページ上のすべてのモーダルをチェック
      const allModals = document.querySelectorAll('.modal');
      allModals.forEach(function(modal) {
        if (isModalVisible(modal)) {
          if (modal.id === 'loginModal') {
            translateLoginModal(e.detail.language);
          }
        }
      });
    });
  }
  
  /**
   * モーダルが表示されているかをチェック
   */
  function isModalVisible(modal) {
    return modal && (modal.classList.contains('show') || 
                     window.getComputedStyle(modal).display !== 'none');
  }
  
  /**
   * ログインモーダルを翻訳する
   * @param {string} lang - 言語コード（未指定の場合はlocalStorageから取得）
   */
  function translateLoginModal(lang) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'ja';
    if (lang === 'ja') return; // 日本語の場合は何もしない
    
    console.log('ログインモーダルを英語に翻訳します');
    
    const loginModal = document.getElementById('loginModal');
    if (!loginModal) {
      console.error('ログインモーダルが見つかりません');
      return;
    }
    
    // モーダルタイトル
    const modalTitle = loginModal.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.textContent = 'Login';
    }
    
    // ユーザータイプラベル
    const userTypeLabel = loginModal.querySelector('label.form-label');
    if (userTypeLabel) {
      userTypeLabel.textContent = 'User Type';
    }
    
    // 観光客ボタン
    const touristBtn = loginModal.querySelector('#touristBtn');
    if (touristBtn) {
      const iconElement = touristBtn.querySelector('i');
      touristBtn.innerHTML = '';
      if (iconElement) touristBtn.appendChild(iconElement);
      touristBtn.appendChild(document.createTextNode(' Tourist'));
    }
    
    // ガイドボタン
    const guideBtn = loginModal.querySelector('#guideBtn');
    if (guideBtn) {
      const iconElement = guideBtn.querySelector('i');
      guideBtn.innerHTML = '';
      if (iconElement) guideBtn.appendChild(iconElement);
      guideBtn.appendChild(document.createTextNode(' Guide'));
    }
    
    // ヘルプテキスト
    const helpText = loginModal.querySelector('small.form-text');
    if (helpText) {
      helpText.textContent = 'When logging in as a tourist, you can search and book guides.';
    }
    
    // メールアドレスラベル
    const emailLabel = loginModal.querySelector('label[for="loginEmail"]');
    if (emailLabel) {
      emailLabel.textContent = 'Email Address';
    }
    
    // パスワードラベル
    const passwordLabel = loginModal.querySelector('label[for="loginPassword"]');
    if (passwordLabel) {
      passwordLabel.textContent = 'Password';
    }
    
    // パスワード入力プレースホルダー
    const passwordInput = loginModal.querySelector('#loginPassword');
    if (passwordInput) {
      passwordInput.placeholder = 'Enter password';
    }
    
    // パスワードを忘れた場合
    const forgotPasswordLink = loginModal.querySelector('a.text-decoration-none');
    if (forgotPasswordLink) {
      forgotPasswordLink.textContent = 'Forgot password?';
    }
    
    // ログイン情報を記憶する
    const rememberLabel = loginModal.querySelector('label[for="rememberMe"]');
    if (rememberLabel) {
      rememberLabel.textContent = 'Remember login information';
    }
    
    // ログインボタン
    const loginBtn = loginModal.querySelector('button[type="submit"]');
    if (loginBtn) {
      loginBtn.textContent = 'Login';
    }
    
    // アカウントをお持ちでないなら
    const noAccountText = loginModal.querySelector('.modal-footer div');
    if (noAccountText) {
      noAccountText.textContent = 'Don\'t have an account?';
    }
    
    // 登録リンク
    const registerLink = loginModal.querySelector('#switchToRegister');
    if (registerLink) {
      registerLink.textContent = 'Register';
    }
    
    // パスワード入力フィールドのプレースホルダーテキスト
    const passwordInputs = loginModal.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(function(input) {
      input.placeholder = 'Enter password';
    });
  }
});