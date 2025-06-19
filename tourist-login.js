/**
 * 観光客（ツーリスト）ログイン機能
 * Firebaseを使った観光客の認証と状態管理を行います
 */

// 観光客ログイン状態 - グローバル変数として既に存在する場合は再宣言しない
// eslint-disable-next-line no-var
var touristLoggedIn = typeof touristLoggedIn !== 'undefined' ? touristLoggedIn : false;
// eslint-disable-next-line no-var
var currentTouristData = typeof currentTouristData !== 'undefined' ? currentTouristData : null;

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
  console.log('観光客ログイン機能を初期化しています...');
  
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
  
  // 保存されたログイン状態を確認
  restoreTouristLoginState();
  
  // ログインフォームの処理
  setupTouristLoginForm();
  
  // 登録フォームの処理
  setupTouristRegisterForm();

  // ガイド詳細リンクのクリックイベント処理
  setupGuideDetailLinks();
});

/**
 * 保存されたログイン状態を復元
 */
function restoreTouristLoginState() {
  const savedTouristData = localStorage.getItem('touristData');
  if (savedTouristData) {
    try {
      currentTouristData = JSON.parse(savedTouristData);
      touristLoggedIn = true;
      updateTouristUI(true);
    } catch (e) {
      console.error('保存されたツーリストデータの解析に失敗しました', e);
      localStorage.removeItem('touristData');
    }
  }
}

/**
 * 観光客としてのログイン状態に応じたUI更新
 */
function updateTouristUI(isLoggedIn) {
  // ナビゲーションの更新
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navUserMenu = document.getElementById('nav-user-menu');
  const navUserName = document.getElementById('nav-user-name');
  
  if (navLoginBtn && navUserMenu) {
    if (isLoggedIn && currentTouristData) {
      navLoginBtn.classList.add('d-none');
      navUserMenu.classList.remove('d-none');
      
      if (navUserName) {
        navUserName.textContent = currentTouristData.name;
      }
      
      // ユーザータイプを観光客に設定
      document.body.setAttribute('data-user-type', 'tourist');
    } else {
      navLoginBtn.classList.remove('d-none');
      navUserMenu.classList.add('d-none');
      document.body.removeAttribute('data-user-type');
    }
  }
  
  // アクセス制御を適用
  if (window.applyAccessControls) {
    window.applyAccessControls(isLoggedIn, 'tourist');
  }
}

/**
 * 観光客のログインフォーム処理
 */
function setupTouristLoginForm() {
  // ログインフォームのsubmitイベントを監視する（ボタンのイベントハンドラ設定不要）
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    console.log('ログインフォームを発見しました (tourist-login.js)');
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // ユーザータイプをチェック
      const userType = document.querySelector('input[name="login-user-type"]:checked')?.value || 'tourist';
      console.log('選択されたユーザータイプ:', userType);
      
      // 観光客モードの場合のみここで処理
      if (userType === 'tourist') {
        console.log('観光客ログイン処理を実行: tourist-login.js');
        console.log('ログイン試行:', {
          email: document.getElementById('login-email').value,
          userType: userType
        });
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // 簡易的なバリデーション
        if (!email || !password) {
          showAlert('メールアドレスとパスワードを入力してください', 'danger');
          return;
        }
        
        // 既存のガイドデータを削除して競合を防止
        sessionStorage.removeItem('currentUser');
        
        // TODO: 本番環境では Firebase Authentication などを使用します
        // ここではデモのため簡易的な認証を行います
        // 仮の認証処理 (実際のアプリではFirebaseなどの認証を使用)
        const demoTouristData = {
          id: 'tourist_' + Date.now(),
          name: email.split('@')[0], // メールアドレスの@前をユーザー名とする
          email: email,
          type: 'tourist'
        };
        
        // ログイン状態を保存（localStorage と sessionStorage 両方に保存）
        localStorage.setItem('touristData', JSON.stringify(demoTouristData));
        sessionStorage.setItem('currentUser', JSON.stringify(demoTouristData)); // 共通認証のために追加
        currentTouristData = demoTouristData;
        touristLoggedIn = true;
        
        // 観光客としてログインしたことをログに記録
        console.log('観光客としてログイン成功:', demoTouristData);
        console.log('現在のページ:', window.location.pathname);
        
        // UIを更新
        updateTouristUI(true);
        
        // モーダルを閉じる
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) {
          loginModal.hide();
        }
        
        // ペンディング中のガイドIDがあるかチェック
        const pendingGuideId = sessionStorage.getItem('pendingGuideId');
        if (pendingGuideId) {
          // ガイド詳細ページに遷移
          sessionStorage.removeItem('pendingGuideId');
          showAlert('ログインが完了しました。ガイドの詳細ページに移動します。', 'success');
          setTimeout(() => {
            window.location.href = `guide-details.html?id=${pendingGuideId}`;
          }, 1000);
          return;
        }
        
        // 成功メッセージを表示 - ガイド詳細ページでなければ表示
        if (!window.location.pathname.includes('guide-details.html')) {
          showAlert('観光客としてログインしました。サイト内のサービスをご利用いただけます。', 'success');
        }
        
        // 観光客モードなので、現在のページにとどまるか観光客のマイページへ遷移
        if (window.location.pathname.includes('guide-profile.html')) {
          // ガイドのプロフィールページにいる場合はホームに戻す
          showAlert('観光客アカウントではガイドプロフィールページは利用できません。トップページに移動します。', 'info');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }
      }
    });
  }
  
  // 以前のコードを残しておく（観光客専用ログインフォーム用）
  const touristLoginForm = document.getElementById('tourist-login-form');
  if (touristLoginForm) {
    touristLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('tourist-login-email').value;
      const password = document.getElementById('tourist-login-password').value;
      
      // TODO: 本番環境では Firebase Authentication などを使用します
      // ここではデモのため簡易的な認証を行います
      if (email && password) {
        // 仮の認証処理 (実際のアプリではFirebaseなどの認証を使用)
        const demoTouristData = {
          id: 'tourist_' + Date.now(),
          name: email.split('@')[0], // メールアドレスの@前をユーザー名とする
          email: email,
          type: 'tourist'
        };
        
        // 既存のガイドデータを削除して競合を防止
        sessionStorage.removeItem('currentUser');
        
        // ログイン状態を保存
        localStorage.setItem('touristData', JSON.stringify(demoTouristData));
        sessionStorage.setItem('currentUser', JSON.stringify(demoTouristData)); // 共通認証のために追加
        currentTouristData = demoTouristData;
        touristLoggedIn = true;
        
        // UIを更新
        updateTouristUI(true);
        
        // モーダルを閉じる
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginTouristModal'));
        if (loginModal) {
          loginModal.hide();
        }
        
        // 成功メッセージを表示（ガイド詳細ページでなければ表示）
        if (!window.location.pathname.includes('guide-details.html')) {
          showAlert('ログインしました。ガイドの詳細情報が閲覧できるようになりました。', 'success');
        }
      } else {
        showAlert('メールアドレスとパスワードを入力してください', 'danger');
      }
    });
  }
}

/**
 * 観光客登録フォーム処理
 */
function setupTouristRegisterForm() {
  const touristRegisterForm = document.getElementById('tourist-register-form');
  if (touristRegisterForm) {
    touristRegisterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // フォームデータの取得
      const name = document.getElementById('tourist-name').value;
      const email = document.getElementById('tourist-email').value;
      const password = document.getElementById('tourist-password').value;
      const passwordConfirm = document.getElementById('tourist-password-confirm').value;
      
      // 入力チェック
      if (!name || !email || !password) {
        showAlert('必須項目を入力してください', 'danger');
        return;
      }
      
      if (password !== passwordConfirm) {
        showAlert('パスワードと確認用パスワードが一致しません', 'danger');
        return;
      }
      
      // TODO: 本番環境では Firebase Authentication などを使用します
      // ここではデモのため簡易的な登録処理を行います
      const newTouristData = {
        id: 'tourist_' + Date.now(),
        name: name,
        email: email,
        type: 'tourist'
      };
      
      // 既存のガイドデータを削除して競合を防止
      sessionStorage.removeItem('currentUser');
      
      // ログイン状態を保存
      localStorage.setItem('touristData', JSON.stringify(newTouristData));
      sessionStorage.setItem('currentUser', JSON.stringify(newTouristData)); // 共通認証のために追加
      currentTouristData = newTouristData;
      touristLoggedIn = true;
      
      // UIを更新
      updateTouristUI(true);
      
      // モーダルを閉じる
      const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerTouristModal'));
      if (registerModal) {
        registerModal.hide();
      }
      
      // ペンディング中のガイドIDがあるかチェック
      const pendingGuideId = sessionStorage.getItem('pendingGuideId');
      if (pendingGuideId) {
        // ガイド詳細ページに遷移
        sessionStorage.removeItem('pendingGuideId');
        showAlert('登録が完了しました。ガイドの詳細ページに移動します。', 'success');
        setTimeout(() => {
          window.location.href = `guide-details.html?id=${pendingGuideId}`;
        }, 1000);
        return;
      }
      
      // 成功メッセージを表示（ガイド詳細ページでなければ表示）
      if (!window.location.pathname.includes('guide-details.html')) {
        showAlert('ご登録ありがとうございます。ガイドの詳細情報が閲覧できるようになりました。', 'success');
      }
    });
  }
}

/**
 * ガイド詳細へのリンクのクリックイベント処理
 */
function setupGuideDetailLinks() {
  const guideLinks = document.querySelectorAll('.guide-details-link');
  
  guideLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('TOURIST-LOGIN.JS: ガイド詳細ボタンがクリックされました');
      
      let guideId = this.getAttribute('data-guide-id');
      console.log('TOURIST-LOGIN.JS: ガイドID:', guideId);
      console.log('TOURIST-LOGIN.JS: touristLoggedIn:', touristLoggedIn);
      
      // ガイドIDのエンコードを確認し、必要であればデコード
      if (guideId && guideId.includes('%')) {
        try {
          guideId = decodeURIComponent(guideId);
          console.log(`TOURIST-LOGIN.JS: デコードされたガイドID: ${guideId}`);
        } catch (e) {
          console.error('TOURIST-LOGIN.JS: ガイドIDのデコードに失敗しました:', e);
        }
      }
      
      // ローカルストレージをクリアして、ガイド詳細ページが新しいデータを読み込むようにする
      localStorage.removeItem(`guide_${guideId}`);
      
      if (!touristLoggedIn) {
        // 未ログインの場合はlogin-requiredページに遷移
        console.log('TOURIST-LOGIN.JS: 未ログイン - login-requiredページに遷移');
        sessionStorage.setItem('pendingGuideId', guideId);
        window.location.href = 'login-required.html';
      } else {
        // ログイン済みの場合、ガイド詳細ページへ移動
        console.log('TOURIST-LOGIN.JS: ログイン済み - ガイド詳細ページに遷移');
        window.location.href = `guide-details.html?id=${guideId}`;
      }
    });
  });
}

/**
 * ログアウト処理
 */
function touristLogout() {
  // ローカルストレージとセッションストレージからユーザー情報を削除
  localStorage.removeItem('touristData');
  sessionStorage.removeItem('currentUser');
  
  // 状態を更新
  touristLoggedIn = false;
  currentTouristData = null;
  
  // UIを更新
  updateTouristUI(false);
  
  // 成功メッセージを表示
  showAlert('ログアウトしました', 'info');
  
  // URLに応じたリダイレクト処理
  if (window.location.pathname.includes('guide-details.html') || 
      window.location.pathname.includes('guide-profile.html')) {
    window.location.href = 'index.html';
  } else {
    // 他のページではリロードして最新状態を表示
    window.location.reload();
  }
}

/**
 * アラートメッセージを表示
 */
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) {
    console.error('アラートコンテナが見つかりません');
    return;
  }
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  alertContainer.appendChild(alert);
  
  // 5秒後に自動で消える
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 5000);
}