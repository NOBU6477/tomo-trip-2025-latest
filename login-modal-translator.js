/**
 * ログインモーダル専用翻訳スクリプト
 * モーダル内のテキストを現在の言語設定に基づいて書き換える
 */

(function() {
  // スクリプトが既に実行されているかチェック
  if (window.loginModalTranslatorApplied) {
    return;
  }
  window.loginModalTranslatorApplied = true;
  
  // 安全にイベントリスナーを追加
  function addSafeEventListener() {
    try {
      // 言語切り替えイベントを監視
      window.addEventListener('languageChanged', function(e) {
        updateLoginModalText();
      });
      
      // ログインモーダルを監視し、表示時に翻訳を適用
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.addEventListener('shown.bs.modal', function() {
          updateLoginModalText();
          console.log('ログインモーダルが表示されました');
        });
      }
    } catch (e) {
      console.error('ログインモーダル翻訳の初期化エラー:', e);
    }
  }
  
  // ログインモーダルのテキストを更新
  function updateLoginModalText() {
    try {
      const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
      const loginModal = document.getElementById('loginModal');
      if (!loginModal) {
        console.log('ログインモーダルが見つかりません');
        return;
      }
      
      // 翻訳オブジェクトを安全に取得
      const translator = window.translator;
      if (!translator || typeof translator.translate !== 'function') {
        console.log('セーフティトランスレーターのtranslateが呼び出されました');
        return;
      }
      
      // モーダルタイトル
      safeUpdateElement(loginModal, '.modal-title', 'login_title');
      
      // ユーザータイプラベル
      safeUpdateElement(loginModal, 'label.form-label', 'user_type_label');
      
      // 旅行者ボタン
      const touristBtn = loginModal.querySelector('#touristBtn');
      if (touristBtn) {
        const icon = touristBtn.querySelector('i');
        const iconHTML = icon ? icon.outerHTML : '';
        const translation = translator.translate('tourist');
        touristBtn.innerHTML = iconHTML + ' ' + translation;
      }
      
      // ガイドボタン
      const guideBtn = loginModal.querySelector('#guideBtn');
      if (guideBtn) {
        const icon = guideBtn.querySelector('i');
        const iconHTML = icon ? icon.outerHTML : '';
        const translation = translator.translate('guide');
        guideBtn.innerHTML = iconHTML + ' ' + translation;
      }
      
      // その他の要素
      safeUpdateElement(loginModal, 'small.form-text', 'login_help_text');
      safeUpdateElement(loginModal, 'label[for="loginEmail"]', 'email_address');
      safeUpdateElement(loginModal, 'label[for="loginPassword"]', 'password');
      
      // パスワード入力プレースホルダー
      const passwordInput = loginModal.querySelector('#loginPassword');
      if (passwordInput) {
        passwordInput.placeholder = translator.translate('password_placeholder');
      }
      
      safeUpdateElement(loginModal, 'label[for="rememberMe"]', 'remember_me');
      safeUpdateElement(loginModal, '.text-decoration-none', 'forgot_password');
      safeUpdateElement(loginModal, 'button[type="submit"]', 'login_button');
      safeUpdateElement(loginModal, '.modal-footer div', 'no_account');
      safeUpdateElement(loginModal, '#switchToRegister', 'register');
      
    } catch (e) {
      console.error('ログインモーダル翻訳エラー:', e);
    }
  }
  
  // 要素を安全に更新するヘルパー関数
  function safeUpdateElement(parent, selector, translationKey) {
    try {
      if (!parent) return;
      const element = parent.querySelector(selector);
      if (element && window.translator) {
        element.textContent = window.translator.translate(translationKey);
      }
    } catch (e) {
      console.warn(`要素更新エラー (${selector}):`, e);
    }
  }
  
  // DOMが準備できたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSafeEventListener);
  } else {
    addSafeEventListener();
  }
})();