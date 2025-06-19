/**
 * ログインモーダルのユーザータイプボタン表示を修正するスクリプト
 * 既存のユーザータイプボタン操作に特化した最小限のコード
 */

document.addEventListener('DOMContentLoaded', function() {
  // Bootstrap モーダル表示イベントをリッスン
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (isLoginModal(modal)) {
      fixLoginModalButtons(modal);
      // モーダル表示時に一度言語確認も行う
      applyCurrentLanguage();
    }
  });
  
  // ログインボタンクリック時にもモーダルチェック
  const loginButtonSelectors = [
    '.login-btn', 
    '[data-bs-target="#loginModal"]', 
    'header .btn-primary', 
    'nav .btn-primary',
    '.nav-item .nav-link:last-child',
    '.btn.btn-primary',
    'a.login-link'
  ];
  // 標準セレクタでボタンを取得
  const loginButtons = Array.from(document.querySelectorAll(loginButtonSelectors.join(', ')));
  
  // テキスト内容でもボタンを検索（Loginを含むもの）
  const allButtons = document.querySelectorAll('button, a.btn, a.nav-link');
  const textBasedButtons = Array.from(allButtons).filter(btn => {
    if (!btn || !btn.textContent) return false;
    const text = btn.textContent.trim().toLowerCase();
    return text === 'login' || text === 'ログイン' || text.includes('login') || text.includes('ログイン');
  });
  
  // 2つの配列を結合し重複を排除
  const allLoginButtons = [...new Set([...loginButtons, ...textBasedButtons])];
  
  allLoginButtons.forEach(button => {
    // 既にイベントが設定されている場合はスキップ
    if (button._hasLoginFixEvent) return;
    button._hasLoginFixEvent = true;
    
    button.addEventListener('click', function() {
      setTimeout(function() {
        const modal = document.querySelector('.modal.show');
        if (modal && isLoginModal(modal)) {
          fixLoginModalButtons(modal);
          applyCurrentLanguage();
        }
      }, 300);
    });
  });
  
  // 初期表示時にも既存モーダルをチェック
  setTimeout(function() {
    const modal = document.querySelector('.modal.show');
    if (modal && isLoginModal(modal)) {
      fixLoginModalButtons(modal);
      applyCurrentLanguage();
    }
  }, 300);
  
  // 言語切り替えイベントリスナーを追加
  document.addEventListener('languageChanged', function(e) {
    applyCurrentLanguage();
  });
});

/**
 * ログインモーダルかどうかを判定
 */
function isLoginModal(modal) {
  if (!modal || !modal.classList) return false;
  
  try {
    // タイトルをチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.trim() === 'ログイン' || title.textContent.trim() === 'Login')) {
      return true;
    }
    
    // メールとパスワードフィールドをチェック
    const emailField = modal.querySelector('input[type="email"]');
    const passwordField = modal.querySelector('input[type="password"]');
    if (emailField && passwordField) {
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('モーダル判定エラー:', err);
    return false;
  }
}

/**
 * ログインモーダルのボタン表示を修正
 */
function fixLoginModalButtons(modal) {
  if (!modal) return;
  
  try {
    // すでに修正済みかチェック
    if (modal.dataset.buttonFixed === 'true') return;
    
    // 最初のユーザータイプボタンを取得
    const touristButton = modal.querySelector('button:nth-of-type(1).btn-primary, button.btn-outline-primary');
    const guideButton = modal.querySelector('button:nth-of-type(2).btn-primary, button:nth-of-type(2).btn-outline-primary');
    
    // ボタンが見つからない場合は終了
    if (!touristButton || !guideButton) {
      console.log('既存のユーザータイプボタンが見つかりませんでした');
      return;
    }
    
    // ボタンが非表示になっていないか確認
    ensureButtonsVisible(touristButton, guideButton);
    
    // アイコンが設定されているか確認
    ensureButtonIcons(touristButton, guideButton);
    
    // 言語設定に合わせてボタンテキストを更新
    updateButtonTexts(touristButton, guideButton);
    
    // 修正済みとしてマーク
    modal.dataset.buttonFixed = 'true';
    
    console.log('ログインモーダルのボタン表示を修正しました');
  } catch (err) {
    console.error('ボタン修正エラー:', err);
  }
}

/**
 * ボタンの表示を確保
 */
function ensureButtonsVisible(touristButton, guideButton) {
  if (!touristButton || !guideButton) return;
  
  try {
    // 表示スタイルを確保
    touristButton.style.display = 'block';
    guideButton.style.display = 'block';
    
    // 親要素もチェック
    const parentContainer = touristButton.parentElement;
    if (parentContainer) {
      parentContainer.style.display = 'flex';
      parentContainer.style.gap = '10px';
      parentContainer.style.marginBottom = '15px';
    }
  } catch (err) {
    console.error('ボタン表示スタイル適用エラー:', err);
  }
}

/**
 * ボタンにアイコンを設定
 */
function ensureButtonIcons(touristButton, guideButton) {
  if (!touristButton || !guideButton) return;
  
  try {
    // 観光客ボタンのアイコン
    if (!touristButton.querySelector || !touristButton.querySelector('i.fas.fa-user')) {
      const touristIcon = document.createElement('i');
      touristIcon.className = 'fas fa-user me-2';
      if (touristButton.insertBefore && touristButton.firstChild) {
        touristButton.insertBefore(touristIcon, touristButton.firstChild);
      } else if (touristButton.appendChild) {
        touristButton.appendChild(touristIcon);
      }
    }
    
    // ガイドボタンのアイコン
    if (!guideButton.querySelector || !guideButton.querySelector('i.fas.fa-map-marked-alt')) {
      const guideIcon = document.createElement('i');
      guideIcon.className = 'fas fa-map-marked-alt me-2';
      if (guideButton.insertBefore && guideButton.firstChild) {
        guideButton.insertBefore(guideIcon, guideButton.firstChild);
      } else if (guideButton.appendChild) {
        guideButton.appendChild(guideIcon);
      }
    }
  } catch (err) {
    console.error('ボタンアイコン設定エラー:', err);
  }
}

/**
 * 言語設定に合わせてボタンテキストを更新
 */
function updateButtonTexts(touristButton, guideButton) {
  if (!touristButton || !guideButton) return;
  
  try {
    const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
    
    // テキストノードのみを取得して更新
    const updateButtonText = (button, englishText, japaneseText) => {
      if (!button || !button.childNodes) return;
      
      try {
        // アイコン要素を保持するため、テキストノードのみを対象に
        let textNode;
        for (const node of button.childNodes) {
          if (node && node.nodeType === Node.TEXT_NODE) {
            textNode = node;
            break;
          }
        }
        
        // テキストノードがなければ新しく作成
        if (!textNode) {
          textNode = document.createTextNode('');
          if (button.appendChild) {
            button.appendChild(textNode);
          }
        }
        
        // 言語に応じてテキストを設定
        if (textNode && textNode.nodeValue !== undefined) {
          textNode.nodeValue = isEnglish ? englishText : japaneseText;
        }
      } catch (btnErr) {
        console.error('ボタンテキスト更新エラー:', btnErr);
      }
    };
    
    updateButtonText(touristButton, 'Tourist', '観光客');
    updateButtonText(guideButton, 'Guide', 'ガイド');
    
    // 説明テキストも更新
    if (touristButton.parentElement) {
      const descriptionElement = touristButton.parentElement.nextElementSibling;
      if (descriptionElement && descriptionElement.tagName && descriptionElement.tagName.toLowerCase() === 'small') {
        // アクティブなボタンを確認
        const isTouristActive = touristButton.classList && touristButton.classList.contains('btn-primary');
        
        if (isTouristActive) {
          descriptionElement.textContent = isEnglish 
            ? 'Login as a tourist to book guides and explore tours' 
            : '観光客としてログインすると、ガイドを探したり予約できます';
        } else {
          descriptionElement.textContent = isEnglish 
            ? 'Login as a guide to manage your profile and bookings' 
            : 'ガイドとしてログインすると、プロフィールの編集や予約の管理ができます';
        }
      }
    }
  } catch (err) {
    console.error('ボタンテキスト設定エラー:', err);
  }
}

// 言語切り替え時にもテキストを更新
/**
 * 現在の言語設定に基づいてUIを更新
 */
function applyCurrentLanguage() {
  const modal = document.querySelector('.modal.show');
  if (!modal || !isLoginModal(modal)) return;
  
  try {
    // モーダルタイトルの更新
    const title = modal.querySelector('.modal-title');
    if (title) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      title.textContent = isEnglish ? 'Login' : 'ログイン';
    }
    
    // ユーザータイプセクションの更新
    const userTypeLabel = modal.querySelector('.form-label:first-of-type, label:first-of-type');
    if (userTypeLabel) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      if (userTypeLabel.textContent.includes('User Type') || userTypeLabel.textContent.includes('ユーザータイプ')) {
        userTypeLabel.textContent = isEnglish ? 'User Type' : 'ユーザータイプ';
      }
    }
    
    // ユーザータイプボタンの更新
    const touristButton = modal.querySelector('button.btn-primary, button.btn-outline-primary');
    if (touristButton) {
      const nextButton = touristButton.nextElementSibling;
      if (nextButton && nextButton.tagName && nextButton.tagName.toLowerCase() === 'button') {
        updateButtonTexts(touristButton, nextButton);
      }
    }
    
    // メールアドレスラベルの更新
    const emailLabel = modal.querySelector('label[for*="email"], .form-label:nth-of-type(2)');
    if (emailLabel) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      emailLabel.textContent = isEnglish ? 'Email Address *' : 'メールアドレス';
    }
    
    // パスワードラベルの更新
    const passwordLabel = modal.querySelector('label[for*="password"], .form-label:nth-of-type(3)');
    if (passwordLabel) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      passwordLabel.textContent = isEnglish ? 'Password *' : 'パスワード';
    }
    
    // パスワード入力フィールドのプレースホルダー更新
    const passwordInput = modal.querySelector('input[type="password"]');
    if (passwordInput) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      passwordInput.placeholder = isEnglish ? 'Enter password' : 'パスワードを入力';
    }
    
    // パスワード忘れリンクの更新
    const allLinks = modal.querySelectorAll('a');
    const forgotLinks = Array.from(allLinks).filter(link => 
      link.textContent.includes('パスワードをお忘れですか') || 
      link.textContent.includes('Forgot password')
    );
    
    if (forgotLinks.length > 0) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      forgotLinks[0].textContent = isEnglish ? 'Forgot password?' : 'パスワードをお忘れですか？';
    }
    
    // ログイン情報を保存するのチェックボックスラベル更新
    const checkboxLabel = modal.querySelector('label.form-check-label, span.form-check-label');
    if (checkboxLabel) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      checkboxLabel.textContent = isEnglish ? 'Remember login information' : 'Login情報を保存する';
    }
    
    // ログインボタンの更新
    const loginButton = modal.querySelector('button[type="submit"], button.btn.btn-primary:last-of-type');
    if (loginButton) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      loginButton.textContent = isEnglish ? 'Login' : 'ログイン';
    }
    
    // アカウントをお持ちでない方テキストの更新
    const noAccountText = modal.querySelector('.modal-body > div:last-of-type, .modal-footer > div:first-of-type');
    const allDivs = modal.querySelectorAll('div');
    const noAccountDivs = Array.from(allDivs).filter(div => 
      div.textContent.includes('アカウントをお持ちでない方') || 
      div.textContent.includes('Don\'t have an account')
    );
    
    if (noAccountDivs.length > 0) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      noAccountDivs[0].textContent = isEnglish ? 'Don\'t have an account?' : 'アカウントをお持ちでない方';
    }
    
    // 登録ボタンの更新
    const registerButton = modal.querySelector('a.btn-outline-primary, a.btn-secondary');
    if (registerButton) {
      const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
      registerButton.textContent = isEnglish ? 'Register' : '新規登録';
    }
    
    console.log('言語設定に基づいてログインモーダルを更新しました:', localStorage.getItem('selectedLanguage'));
  } catch (err) {
    console.error('言語適用エラー:', err);
  }
}

// 言語切り替え時にもテキストを更新
document.addEventListener('languageChanged', function(event) {
  applyCurrentLanguage();
});