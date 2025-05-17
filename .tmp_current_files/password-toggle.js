/**
 * パスワード表示/非表示を切り替える機能
 */
document.addEventListener('DOMContentLoaded', function() {
  // ログインモーダルが開かれたときにパスワードトグルを初期化
  document.body.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'loginModal') {
      initPasswordToggle();
      initUserTypeHighlight();
    }
  });

  // パスワード表示切り替え機能の初期化
  function initPasswordToggle() {
    const passwordInput = document.getElementById('login-password');
    const passwordWrapper = passwordInput.parentElement;
    
    // すでにボタンが存在する場合は作成しない
    if (passwordWrapper.querySelector('.password-toggle-btn')) {
      return;
    }
    
    // パスワード入力のラッパーにクラスを追加
    passwordWrapper.classList.add('password-input-wrapper');
    
    // トグルボタンを作成
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'password-toggle-btn';
    toggleButton.innerHTML = '<i class="bi bi-eye"></i>';
    toggleButton.setAttribute('aria-label', 'パスワードを表示');
    
    // ボタンをラッパーに追加
    passwordWrapper.appendChild(toggleButton);
    
    // クリックイベントの設定
    toggleButton.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // アイコンを切り替え
      if (type === 'text') {
        this.innerHTML = '<i class="bi bi-eye-slash"></i>';
        this.setAttribute('aria-label', 'パスワードを隠す');
      } else {
        this.innerHTML = '<i class="bi bi-eye"></i>';
        this.setAttribute('aria-label', 'パスワードを表示');
      }
    });
  }
  
  // ユーザータイプの選択によるハイライト効果
  function initUserTypeHighlight() {
    const radioInputs = document.querySelectorAll('input[name="login-user-type"]');
    const userTypeSelector = radioInputs[0].closest('.d-flex');
    
    // すでにハイライト要素がある場合は作成しない
    if (userTypeSelector.querySelector('.user-type-highlight')) {
      return;
    }
    
    // セレクタにクラスを追加
    userTypeSelector.classList.add('user-type-selector');
    
    // ハイライト要素を作成
    const highlight = document.createElement('div');
    highlight.className = 'user-type-highlight';
    userTypeSelector.appendChild(highlight);
    
    // ラジオボタンの状態変化を監視
    radioInputs.forEach(input => {
      input.addEventListener('change', function() {
        // 変更時にログ出力（デバッグ用）
        console.log('ユーザータイプが変更されました:', this.value);
      });
    });
  }
});