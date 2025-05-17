/**
 * ログインモーダルのユーザータイプボタンを確実に表示するための修正スクリプト
 * （直接DOM操作で追加するシンプルなアプローチ）
 */

// モーダルが表示されるのを待ってから処理を実行
document.addEventListener('DOMContentLoaded', function() {
  // ログインボタンがクリックされたときの処理
  setupLoginButtonListeners();
  
  // Bootstrap Modal表示イベントの監視
  setupModalDisplayListener();
  
  // 初期化時にも既に表示されているモーダルを確認
  checkVisibleModals();
});

/**
 * ページ上のログインボタンにイベントリスナーを追加
 */
function setupLoginButtonListeners() {
  const loginButtons = document.querySelectorAll('a.login-btn, button.login-btn, a[href="#loginModal"], button[data-bs-target="#loginModal"]');
  
  loginButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // モーダルが表示されるまで少し待機
      setTimeout(checkVisibleModals, 300);
    });
  });
}

/**
 * Bootstrap Modalの表示イベントを監視
 */
function setupModalDisplayListener() {
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (isLoginModal(modal)) {
      // ログインモーダルが表示されたらユーザータイプセクションを設定
      setupUserTypeSection(modal);
    }
  });
}

/**
 * 表示中のモーダルを確認
 */
function checkVisibleModals() {
  const visibleModals = document.querySelectorAll('.modal.show');
  visibleModals.forEach(function(modal) {
    if (isLoginModal(modal)) {
      setupUserTypeSection(modal);
    }
  });
}

/**
 * モーダルがログインモーダルかどうかを判定
 */
function isLoginModal(modal) {
  if (!modal) return false;
  
  try {
    // タイトルを確認
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.trim() === 'ログイン' || title.textContent.trim() === 'Login')) {
      return true;
    }
    
    // メールとパスワードの入力欄があるか確認
    const emailField = modal.querySelector('input[type="email"]');
    const passwordField = modal.querySelector('input[type="password"]');
    if (emailField && passwordField) {
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('ログインモーダル判定でエラー:', err);
    return false;
  }
}

/**
 * ユーザータイプセクションを設定
 */
function setupUserTypeSection(modal) {
  if (!modal) return;
  
  try {
    // すでにユーザータイプセクションがあるか確認
    const existingUserTypeSection = modal.querySelector('.user-type-section');
    if (existingUserTypeSection) return;
    
    // フォームを取得
    const form = modal.querySelector('form');
    if (!form) return;
    
    // 最初の入力欄の前に挿入するための参照要素を取得
    const firstInputGroup = form.querySelector('.form-group, .mb-3');
    if (!firstInputGroup) return;
    
    // ユーザータイプセクションを作成
    const userTypeSection = createUserTypeSection();
    if (!userTypeSection) return;
    
    // セクションを挿入
    firstInputGroup.parentNode.insertBefore(userTypeSection, firstInputGroup);
    
    // 言語に応じてテキストを設定
    updateUserTypeSectionText(userTypeSection);
    
    // ユーザータイプボタンのイベントリスナーを設定
    setupUserTypeButtons(userTypeSection);
    
    // デフォルトで観光客ボタンを選択
    const touristButton = userTypeSection.querySelector('[data-user-type="tourist"]');
    if (touristButton) {
      touristButton.click();
    }
  } catch (err) {
    console.error('ユーザータイプセクション設定中にエラー:', err);
  }
}

/**
 * ユーザータイプセクションのHTML要素を作成
 */
function createUserTypeSection() {
  const section = document.createElement('div');
  section.className = 'user-type-section mb-3';
  section.setAttribute('data-fixed', 'true');
  
  // ラベル
  const label = document.createElement('label');
  label.className = 'form-label';
  label.textContent = 'User Type';
  
  // ボタングループ
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'd-flex gap-2 mt-2';
  
  // 観光客ボタン
  const touristButton = document.createElement('button');
  touristButton.type = 'button';
  touristButton.className = 'btn btn-outline-primary flex-grow-1';
  touristButton.setAttribute('data-user-type', 'tourist');
  
  // 観光客アイコン
  const touristIcon = document.createElement('i');
  touristIcon.className = 'fas fa-user me-2';
  touristButton.appendChild(touristIcon);
  
  // 観光客テキスト
  const touristText = document.createTextNode('Tourist');
  touristButton.appendChild(touristText);
  
  // ガイドボタン
  const guideButton = document.createElement('button');
  guideButton.type = 'button';
  guideButton.className = 'btn btn-outline-primary flex-grow-1';
  guideButton.setAttribute('data-user-type', 'guide');
  
  // ガイドアイコン
  const guideIcon = document.createElement('i');
  guideIcon.className = 'fas fa-map-marked-alt me-2';
  guideButton.appendChild(guideIcon);
  
  // ガイドテキスト
  const guideText = document.createTextNode('Guide');
  guideButton.appendChild(guideText);
  
  // 説明テキスト
  const description = document.createElement('small');
  description.className = 'form-text text-muted d-block mt-1';
  description.setAttribute('data-description', 'true');
  
  // 要素を組み合わせる
  buttonGroup.appendChild(touristButton);
  buttonGroup.appendChild(guideButton);
  section.appendChild(label);
  section.appendChild(buttonGroup);
  section.appendChild(description);
  
  return section;
}

/**
 * ユーザータイプボタンのイベントリスナーを設定
 */
function setupUserTypeButtons(section) {
  if (!section) return;
  
  const touristButton = section.querySelector('[data-user-type="tourist"]');
  const guideButton = section.querySelector('[data-user-type="guide"]');
  const description = section.querySelector('[data-description]');
  
  if (!touristButton || !guideButton || !description) return;
  
  // 観光客ボタンのクリックイベント
  touristButton.addEventListener('click', function() {
    // アクティブクラスを切り替え
    touristButton.classList.remove('btn-outline-primary');
    touristButton.classList.add('btn-primary');
    guideButton.classList.remove('btn-primary');
    guideButton.classList.add('btn-outline-primary');
    
    // ユーザータイプのhidden入力を設定
    setUserTypeInput(section, 'tourist');
    
    // 説明テキストを更新
    const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
    description.textContent = isEnglish 
      ? 'Login as a tourist to book guides and explore tours' 
      : '観光客としてログインすると、ガイドを探したり予約できます';
  });
  
  // ガイドボタンのクリックイベント
  guideButton.addEventListener('click', function() {
    // アクティブクラスを切り替え
    guideButton.classList.remove('btn-outline-primary');
    guideButton.classList.add('btn-primary');
    touristButton.classList.remove('btn-primary');
    touristButton.classList.add('btn-outline-primary');
    
    // ユーザータイプのhidden入力を設定
    setUserTypeInput(section, 'guide');
    
    // 説明テキストを更新
    const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
    description.textContent = isEnglish 
      ? 'Login as a guide to manage your profile and bookings' 
      : 'ガイドとしてログインすると、プロフィールの編集や予約の管理ができます';
  });
}

/**
 * hidden入力フィールドにユーザータイプを設定
 */
function setUserTypeInput(section, userType) {
  if (!section) return;
  
  // フォームを取得
  const form = section.closest('form');
  if (!form) return;
  
  // 既存のhidden入力を確認
  let hiddenInput = form.querySelector('input[name="userType"]');
  
  // なければ新しく作成
  if (!hiddenInput) {
    hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'userType';
    form.appendChild(hiddenInput);
  }
  
  // 値を設定
  hiddenInput.value = userType;
  
  // セッションストレージにも保存（他のスクリプトとの互換性のため）
  try {
    sessionStorage.setItem('userType', userType);
  } catch (err) {
    console.error('セッションストレージへの保存でエラー:', err);
  }
}

/**
 * 言語に応じてユーザータイプセクションのテキストを更新
 */
function updateUserTypeSectionText(section) {
  if (!section) return;
  
  const isEnglish = localStorage.getItem('selectedLanguage') === 'en';
  
  // ラベルを更新
  const label = section.querySelector('label');
  if (label) {
    label.textContent = isEnglish ? 'User Type' : 'ユーザータイプ';
  }
  
  // 観光客ボタンを更新
  const touristButton = section.querySelector('[data-user-type="tourist"]');
  if (touristButton) {
    // テキストノードのみを更新（アイコンは保持）
    const textNodes = Array.from(touristButton.childNodes).filter(node => 
      node.nodeType === Node.TEXT_NODE
    );
    
    if (textNodes.length > 0) {
      textNodes[0].textContent = isEnglish ? 'Tourist' : '観光客';
    } else {
      // テキストノードがなければ追加
      const text = document.createTextNode(isEnglish ? 'Tourist' : '観光客');
      touristButton.appendChild(text);
    }
  }
  
  // ガイドボタンを更新
  const guideButton = section.querySelector('[data-user-type="guide"]');
  if (guideButton) {
    // テキストノードのみを更新（アイコンは保持）
    const textNodes = Array.from(guideButton.childNodes).filter(node => 
      node.nodeType === Node.TEXT_NODE
    );
    
    if (textNodes.length > 0) {
      textNodes[0].textContent = isEnglish ? 'Guide' : 'ガイド';
    } else {
      // テキストノードがなければ追加
      const text = document.createTextNode(isEnglish ? 'Guide' : 'ガイド');
      guideButton.appendChild(text);
    }
  }
}

// 言語切り替え時にテキストを更新するイベントリスナー
document.addEventListener('languageChanged', function(e) {
  // 表示中のログインモーダルを探す
  const visibleLoginModals = Array.from(document.querySelectorAll('.modal.show')).filter(isLoginModal);
  
  // ユーザータイプセクションのテキストを更新
  visibleLoginModals.forEach(function(modal) {
    const userTypeSection = modal.querySelector('.user-type-section');
    if (userTypeSection) {
      updateUserTypeSectionText(userTypeSection);
      
      // 選択中のボタンに応じて説明テキストも更新
      const activeButton = userTypeSection.querySelector('.btn-primary');
      if (activeButton) {
        const userType = activeButton.getAttribute('data-user-type');
        const description = userTypeSection.querySelector('[data-description]');
        
        if (description && userType) {
          const isEnglish = e.detail.language === 'en';
          
          if (userType === 'tourist') {
            description.textContent = isEnglish 
              ? 'Login as a tourist to book guides and explore tours' 
              : '観光客としてログインすると、ガイドを探したり予約できます';
          } else {
            description.textContent = isEnglish 
              ? 'Login as a guide to manage your profile and bookings' 
              : 'ガイドとしてログインすると、プロフィールの編集や予約の管理ができます';
          }
        }
      }
    }
  });
});