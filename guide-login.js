/**
 * ガイドログイン機能
 * ガイド専用のログイン処理と認証後のリダイレクト処理を行う
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイドログイン機能を初期化しています...');
  console.log('ガイドログインデバッグツールを読み込みました');
  
  // アラートコンテナの確認と作成
  if (!document.getElementById('alert-container')) {
    console.log('アラートコンテナが見つからないため、作成します');
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.maxWidth = '400px';
    alertContainer.style.zIndex = '9999';
    document.body.appendChild(alertContainer);
  }
  
  // ガイドプロフィールページでは不要なログインボタンの検索をスキップ
  if (window.location.pathname.includes('guide-profile.html')) {
    console.log('ガイドプロフィールページでは不要なログインボタンの検索をスキップします');
  }

  // ログインフォームのハンドリング
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    // 注意: submitイベントはtourist-login.jsでも処理されています
    // このファイルではガイドの認証処理のみを行い、submitイベントは捕捉しない
    
    // 代わりに、ログインボタンのクリック時に手動で条件チェック
    const loginButton = document.getElementById('main-login-btn');
    
    if (loginButton) {
      loginButton.addEventListener('click', function(event) {
        // フォームの通常の送信は阻止しない（tourist-login.jsでイベントをキャプチャする）
        
        // ログイン試行のためのユーザーデータを取得
        const email = document.getElementById('login-email')?.value || '';
        const password = document.getElementById('login-password')?.value || '';
        const userType = document.querySelector('input[name="login-user-type"]:checked')?.value || 'tourist';
        
        // ガイドタイプが選択されている場合にのみ処理
        if (userType === 'guide') {
          console.log('ガイドタイプが選択されています - guide-login.jsで処理します');
          event.preventDefault(); // この場合のみイベントを阻止
          
          // 簡易的なバリデーション
          if (!email || !password) {
            showAlert('メールアドレスとパスワードを入力してください', 'danger');
            return;
          }
          
          // 開発用テストアカウント - すべてのメールアドレスでログイン可能
          const guideInfo = {
            id: 'G' + Date.now(),
            name: email.split('@')[0] || 'ガイド',
            email: email,
            type: 'guide',  // 重要: タイプを「ガイド」に設定
            phone: '03-1234-5678',
            city: '東京',
            languages: ['日本語', '英語'],
            bio: 'テスト用ガイドアカウントです'
          };
          
          // 既存のデータを削除してから保存（クリーンな状態で）
          localStorage.removeItem('touristData');
          sessionStorage.removeItem('touristData');
          
          console.log('ガイドログイン成功: ガイド情報をセッションに保存します', guideInfo);
          sessionStorage.setItem('currentUser', JSON.stringify(guideInfo));
          
          // ログイン後の処理
          showAlert('ガイドアカウントでのログインに成功しました。プロフィール編集ページに移動します...', 'success');
          
          // モーダルを閉じる
          const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
          if (loginModal) {
            loginModal.hide();
          }
          
          // ガイドプロフィールページにリダイレクト
          setTimeout(() => {
            window.location.href = 'guide-profile.html';
          }, 1500);
        }
        // 観光客モードはtourist-login.jsで処理するため、何もしない
      });
    }
  }
  
  // セッションからログイン状態を復元
  function restoreLoginState() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
      // ログイン済みの状態を反映
      const navbarUserArea = document.getElementById('navbar-user-area');
      
      if (navbarUserArea) {
        // ログインボタンとドロップダウンの非表示
        const loginButton = document.querySelector('button[data-bs-target="#loginModal"]');
        const registerDropdown = document.getElementById('registerDropdown')?.parentElement;
        
        if (loginButton) loginButton.style.display = 'none';
        if (registerDropdown) registerDropdown.style.display = 'none';
        
        // ユーザーメニューの表示
        const userMenuHTML = `
          <div class="dropdown">
            <button class="btn btn-outline-light dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown">
              ${currentUser.name} さん
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              ${currentUser.type === 'guide' ? 
                '<li><a class="dropdown-item" href="guide-profile.html">プロフィール編集</a></li>' : 
                '<li><a class="dropdown-item" href="tourist-profile.html">マイページ</a></li>'}
              <li><a class="dropdown-item" href="messages.html">メッセージ</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" id="logout-button">ログアウト</a></li>
            </ul>
          </div>
        `;
        
        navbarUserArea.innerHTML = userMenuHTML;
        
        // ログアウトボタンのイベント設定
        document.getElementById('logout-button')?.addEventListener('click', function(e) {
          e.preventDefault();
          sessionStorage.removeItem('currentUser');
          window.location.reload();
        });
      }
    }
  }
  
  // アラート表示の共通関数
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    
    if (!alertContainer) {
      // アラートコンテナがなければ作成
      const newAlertContainer = document.createElement('div');
      newAlertContainer.id = 'alert-container';
      newAlertContainer.style.position = 'fixed';
      newAlertContainer.style.top = '20px';
      newAlertContainer.style.right = '20px';
      newAlertContainer.style.maxWidth = '400px';
      newAlertContainer.style.zIndex = '9999';
      document.body.appendChild(newAlertContainer);
    }
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.getElementById('alert-container').appendChild(alertElement);
    
    // 5秒後に自動的に消える
    setTimeout(() => {
      alertElement.classList.remove('show');
      setTimeout(() => {
        alertElement.remove();
      }, 150);
    }, 5000);
  }
  
  // ログイン状態を確認して画面に反映
  restoreLoginState();
});