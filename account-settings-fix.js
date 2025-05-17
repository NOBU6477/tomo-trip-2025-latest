/**
 * アカウント設定画面の入力欄を視認しやすく修正するスクリプト
 * モダンなスタイルに変更し、パスワード表示/非表示切り替え機能を追加します
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('アカウント設定ページのスタイル修正と機能拡張を実行します');
  
  // スタイルシートを動的に追加
  addModernStyles();
  
  // ページ読み込み後に初期化（十分な余裕を持つ）
  setTimeout(initAccountSettings, 1000);
});

/**
 * モダンなスタイルを動的にページに追加
 */
function addModernStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* モダンな入力欄スタイル */
    .password-field-container {
      position: relative;
      transition: all 0.3s ease;
      margin-bottom: 20px;
    }
    
    .modern-label {
      color: #005b96;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
      display: block;
      transition: all 0.3s ease;
    }
    
    .modern-input-group {
      display: flex;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .modern-input {
      flex: 1;
      border: 2px solid #e0e0e0;
      border-right: none;
      padding: 12px 16px;
      font-size: 16px;
      color: #333;
      background-color: #fff;
      border-radius: 8px 0 0 8px;
      transition: all 0.3s ease;
      width: 100%;
      outline: none;
      caret-color: #3498db;
    }
    
    .modern-input:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
    
    .modern-btn {
      background-color: #f8f9fa;
      border: 2px solid #e0e0e0;
      border-left: none;
      padding: 0 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      transition: all 0.3s ease;
      border-radius: 0 8px 8px 0;
    }
    
    .modern-btn:hover {
      background-color: #e9ecef;
      color: #333;
    }
    
    .modern-form-text {
      color: #005b96;
      font-size: 13px;
      margin-top: 8px;
      padding: 8px 12px;
      background-color: #e8f4fd;
      border-radius: 6px;
      border-left: 3px solid #3498db;
    }
    
    .modern-submit-btn {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modern-submit-btn:hover {
      background: linear-gradient(135deg, #2980b9, #1c6ea4);
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    
    .modern-submit-btn:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    /* 通知設定のモダンスタイル */
    .form-check {
      padding-left: 2rem;
      margin-bottom: 1rem;
      position: relative;
    }
    
    .form-check-input {
      position: absolute;
      left: 0;
      top: 0.25rem;
      width: 1.25rem;
      height: 1.25rem;
      accent-color: #3498db;
      cursor: pointer;
    }
    
    .form-check-label {
      cursor: pointer;
      user-select: none;
      color: #444;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .form-check-input:checked ~ .form-check-label {
      color: #333;
    }
    
    hr {
      height: 2px;
      opacity: 0.1;
      background-color: #000;
      margin: 2rem 0;
    }
    
    /* アカウント削除セクション */
    .text-danger {
      color: #e74c3c !important;
    }
    
    #delete-account-btn {
      border: 2px solid #e74c3c;
      color: #e74c3c;
      background-color: transparent;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    #delete-account-btn:hover {
      background-color: #e74c3c;
      color: white;
    }
    
    /* 検証メッセージ */
    #validation-message {
      background-color: #ffe6e6;
      color: #cc0000;
      padding: 10px 15px;
      border-radius: 6px;
      margin: 15px 0;
      border-left: 4px solid #cc0000;
      font-weight: 500;
    }
    
    /* 成功メッセージ */
    #success-message {
      background-color: #e6ffe6;
      color: #007700;
      padding: 10px 15px;
      border-radius: 6px;
      margin: 15px 0;
      border-left: 4px solid #007700;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;
  
  document.head.appendChild(styleElement);
  console.log('モダンなスタイルをページに追加しました');
}

/**
 * アカウント設定ページの初期化を一度だけ実行する関数
 */
function initAccountSettings() {
  console.log('アカウント設定ページの初期化を実行します');
  
  // パスワード表示/非表示トグルボタンのイベント設定
  setupToggleButtons();
  
  // フォーム送信処理の設定
  setupPasswordForm();
  
  console.log('アカウント設定ページの初期化が完了しました');
}

/**
 * パスワード表示/非表示切り替え機能の設定 - シンプルな実装
 */
function setupToggleButtons() {
  // すべてのトグルボタンを取得
  const toggleButtons = document.querySelectorAll('.password-toggle');
  console.log(`パスワードトグルボタン: ${toggleButtons.length}個見つかりました`);
  
  // 各ボタンにクリックイベントを追加
  toggleButtons.forEach(button => {
    // まず既存のイベントリスナーを削除（安全のため）
    button.removeEventListener('click', togglePasswordVisibility);
    
    // 新しいイベントリスナーを追加
    button.addEventListener('click', togglePasswordVisibility);
    
    // ツールチップ設定
    button.setAttribute('title', 'パスワードを表示');
  });
}

/**
 * パスワード表示/非表示を切り替える関数
 */
function togglePasswordVisibility(event) {
  event.preventDefault();
  
  const button = event.currentTarget;
  const targetId = button.getAttribute('data-target');
  const passwordInput = document.getElementById(targetId);
  
  console.log(`トグルボタンがクリックされました: 対象=${targetId}`);
  
  if (!passwordInput) {
    console.error(`ID=${targetId}の入力欄が見つかりませんでした`);
    return;
  }
  
  // 現在のタイプを取得
  const currentType = passwordInput.getAttribute('type');
  
  // タイプを切り替え
  const newType = currentType === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', newType);
  
  // アイコンを切り替え
  const icon = button.querySelector('i');
  if (icon) {
    if (newType === 'text') {
      icon.className = 'bi bi-eye-slash';
      button.setAttribute('title', 'パスワードを隠す');
    } else {
      icon.className = 'bi bi-eye';
      button.setAttribute('title', 'パスワードを表示');
    }
  }
  
  console.log(`パスワード表示タイプを変更: ${targetId} -> ${newType}`);
}

/**
 * パスワード変更フォームの送信処理設定
 */
function setupPasswordForm() {
  const form = document.getElementById('profile-settings-form');
  
  if (!form) {
    console.error('フォームが見つかりませんでした');
    return;
  }
  
  // 既存のイベントリスナーを削除
  form.removeEventListener('submit', handleFormSubmit);
  
  // 新しいイベントリスナーを追加
  form.addEventListener('submit', handleFormSubmit);
  
  console.log('パスワード変更フォームの設定が完了しました');
}

/**
 * フォーム送信処理
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  // 入力値の取得
  const currentPassword = document.getElementById('current-password')?.value || '';
  const newPassword = document.getElementById('new-password')?.value || '';
  const confirmPassword = document.getElementById('confirm-password')?.value || '';
  
  console.log('フォーム検証を実行します');
  console.log(`現在のパスワード: ${currentPassword.length}文字`);
  console.log(`新しいパスワード: ${newPassword.length}文字`);
  console.log(`確認パスワード: ${confirmPassword.length}文字`);
  
  // 入力チェック
  if (!currentPassword) {
    showValidationMessage('現在のパスワードを入力してください');
    return;
  }
  
  if (!newPassword) {
    showValidationMessage('新しいパスワードを入力してください');
    return;
  }
  
  if (newPassword.length < 8) {
    showValidationMessage('新しいパスワードは8文字以上で入力してください');
    return;
  }
  
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
    showValidationMessage('新しいパスワードは英文字と数字を含める必要があります');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showValidationMessage('新しいパスワードと確認用パスワードが一致しません');
    return;
  }
  
  // 成功メッセージを表示
  showSuccessMessage('パスワードを変更しています...');
  
  // バックエンドに実際に送信する場合はここでAPIを呼び出す
  // ここではモック処理
  setTimeout(() => {
    showSuccessMessage('パスワードが正常に変更されました');
    // フォームをリセット
    event.target.reset();
  }, 1500);
  
  console.log('パスワード変更フォームが送信されました');
}

/**
 * バリデーションメッセージを表示
 */
function showValidationMessage(message) {
  console.log(`バリデーションエラー: ${message}`);
  
  // 既存のメッセージを削除
  const existingMessage = document.getElementById('validation-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // 新しいメッセージ要素を作成
  const messageElement = document.createElement('div');
  messageElement.id = 'validation-message';
  messageElement.textContent = message;
  
  // フォーム内に追加
  const form = document.getElementById('profile-settings-form');
  const submitButton = form.querySelector('.modern-submit-btn');
  
  if (submitButton) {
    submitButton.before(messageElement);
  } else {
    form.appendChild(messageElement);
  }
  
  // 数秒後にメッセージを削除
  setTimeout(() => {
    if (document.getElementById('validation-message')) {
      document.getElementById('validation-message').remove();
    }
  }, 5000);
}

/**
 * 成功メッセージを表示
 */
function showSuccessMessage(message) {
  console.log(`成功メッセージ: ${message}`);
  
  // 既存のメッセージを削除
  const existingMessage = document.getElementById('success-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // 新しいメッセージ要素を作成
  const messageElement = document.createElement('div');
  messageElement.id = 'success-message';
  
  // メッセージテキスト
  const messageText = document.createElement('span');
  messageText.textContent = message;
  messageElement.appendChild(messageText);
  
  // 閉じるボタン
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.color = '#007700';
  
  closeButton.addEventListener('click', () => {
    document.getElementById('success-message')?.remove();
  });
  
  messageElement.appendChild(closeButton);
  
  // フォーム内に追加
  const form = document.getElementById('profile-settings-form');
  const submitButton = form.querySelector('.modern-submit-btn');
  
  if (submitButton) {
    submitButton.before(messageElement);
  } else {
    form.appendChild(messageElement);
  }
  
  // 数秒後にメッセージを削除
  setTimeout(() => {
    if (document.getElementById('success-message')) {
      document.getElementById('success-message').remove();
    }
  }, 5000);
}