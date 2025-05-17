/**
 * ガイド詳細ページ用セッション管理スクリプト
 * ログイン状態の維持とページコンテンツの表示を管理
 */

(function() {
  // グローバルフラグを確認して重複実行を防止
  if (window.guideDetailsSessionHandlerLoaded) {
    console.log('ガイド詳細セッションハンドラは既に実行済みです');
    return;
  }
  
  // グローバルフラグを設定
  window.guideDetailsSessionHandlerLoaded = true;
  
  console.log('ガイド詳細セッションハンドラを初期化しています');
  
  // 即時実行
  initSessionHandler();
  
  /**
   * セッションハンドラの初期化
   */
  function initSessionHandler() {
    // ガイド詳細ページか確認
    if (!window.location.href.includes('guide-details.html')) return;
    
    console.log('ガイド詳細ページでセッション処理を実行');
    
    // セッション確認を定期的に実行（冗長性のために）
    checkAndApplySession();
    
    // DOMに変更があった場合も再確認（ただしスロットリングで頻度を制限）
    let throttleTimer = null;
    const observer = new MutationObserver(function(mutations) {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          checkAndApplySession();
          throttleTimer = null;
        }, 300); // 300ms間隔でのみ実行
      }
    });
    
    // 限定的なDOM監視のみを行う
    observer.observe(document.body, { 
      childList: true, 
      subtree: false  // サブツリーまで監視するとスタックオーバーフローの原因になる
    });
  }
  
  /**
   * セッション状態を確認して適用
   */
  function checkAndApplySession() {
    try {
      // ユーザーセッションを確認
      const sessionData = getUserSessionData();
      const isLoggedIn = !!sessionData;
      
      console.log('セッション状態を確認:', isLoggedIn ? 'ログイン済み' : '未ログイン');
      
      // ログイン要求コンテナとメインコンテンツを取得
      const loginRequiredContainer = document.querySelector('.login-required-container');
      let guideDetailsContent = document.getElementById('guide-details-content');
      
      // メインコンテンツが見つからない場合は検索
      if (!guideDetailsContent) {
        const mainContent = document.querySelector('.container.py-5');
        if (mainContent) {
          mainContent.id = 'guide-details-content';
          guideDetailsContent = mainContent;
        }
      }
      
      // ログイン状態に応じてコンテンツ表示を切り替え
      if (isLoggedIn) {
        // ログイン済み：詳細コンテンツを表示
        if (loginRequiredContainer) {
          loginRequiredContainer.style.display = 'none';
        }
        
        if (guideDetailsContent) {
          guideDetailsContent.style.display = 'block';
        }
        
        // ヘッダーのユーザーメニューを更新
        updateHeaderUserInfo(sessionData);
      } else {
        // 未ログイン：ログイン要求画面を表示
        if (loginRequiredContainer) {
          loginRequiredContainer.style.display = 'block';
        }
        
        if (guideDetailsContent) {
          guideDetailsContent.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('セッション処理中にエラーが発生しました:', error.message);
    }
  }
  
  /**
   * ユーザーセッションデータを取得
   */
  function getUserSessionData() {
    try {
      // セッションストレージを確認
      const sessionStr = sessionStorage.getItem('currentUser');
      if (sessionStr) {
        return JSON.parse(sessionStr);
      }
      
      // ローカルストレージを確認（観光客・ガイド）
      const touristDataStr = localStorage.getItem('touristData');
      if (touristDataStr) {
        const data = JSON.parse(touristDataStr);
        // セッションストレージにも保存して同期
        sessionStorage.setItem('currentUser', touristDataStr);
        return data;
      }
      
      const guideDataStr = localStorage.getItem('guideData');
      if (guideDataStr) {
        const data = JSON.parse(guideDataStr);
        // セッションストレージにも保存して同期
        sessionStorage.setItem('currentUser', guideDataStr);
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('ユーザーセッションデータの取得中にエラーが発生しました:', error.message);
      return null;
    }
  }
  
  /**
   * ヘッダーのユーザー情報を更新
   */
  function updateHeaderUserInfo(userData) {
    if (!userData || !userData.name) return;
    
    // 既存のユーザーメニューを確認
    let userMenu = document.getElementById('nav-user-menu');
    if (userMenu) {
      // 既存のユーザーメニューがある場合は表示
      userMenu.classList.remove('d-none');
      
      // ユーザー名を更新
      const userName = userMenu.querySelector('#nav-user-name');
      if (userName) {
        userName.textContent = userData.name;
      }
      
      // ログインボタンエリアを非表示
      const loginBtnArea = document.getElementById('navbar-user-area');
      if (loginBtnArea) {
        loginBtnArea.style.display = 'none';
      }
    } else {
      // ユーザーメニューがない場合は新規作成
      createUserMenu(userData);
    }
  }
  
  /**
   * ユーザーメニューを作成
   */
  function createUserMenu(userData) {
    // ナビゲーションバーを探す
    const navbar = document.querySelector('.navbar-nav');
    if (!navbar) return;
    
    // 言語ドロップダウンを探す
    const langDropdown = document.querySelector('.navbar .dropdown');
    if (!langDropdown) return;
    
    // ログインボタンエリアを非表示
    const loginBtnArea = document.getElementById('navbar-user-area');
    if (loginBtnArea) {
      loginBtnArea.style.display = 'none';
    }
    
    // 現在の言語を取得
    const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
    
    // ユーザーメニュー要素を作成
    const menuDiv = document.createElement('div');
    menuDiv.id = 'nav-user-menu';
    menuDiv.className = 'dropdown';
    menuDiv.style.marginLeft = '10px';
    
    // ドロップダウンボタン
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-light dropdown-toggle';
    btn.id = 'userDropdown';
    btn.setAttribute('data-bs-toggle', 'dropdown');
    btn.setAttribute('aria-expanded', 'false');
    
    // アイコンとユーザー名
    const icon = document.createElement('i');
    icon.className = 'bi bi-person-circle me-1';
    btn.appendChild(icon);
    
    const userNameSpan = document.createElement('span');
    userNameSpan.id = 'nav-user-name';
    userNameSpan.textContent = userData.name;
    btn.appendChild(userNameSpan);
    
    // ドロップダウンメニュー
    const menu = document.createElement('ul');
    menu.className = 'dropdown-menu dropdown-menu-end';
    
    // メニュー項目
    const menuItems = [
      { text: currentLang === 'ja' ? 'マイページ' : 'My Page', href: 'tourist-profile.html' },
      { text: currentLang === 'ja' ? '予約履歴' : 'Bookings', href: '#' },
      { text: currentLang === 'ja' ? 'ログアウト' : 'Logout', href: '#', class: 'logout-button' }
    ];
    
    menuItems.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      if (item.class) a.classList.add(item.class);
      a.href = item.href;
      a.textContent = item.text;
      
      // ログアウトボタンにイベントリスナーを追加
      if (item.class === 'logout-button') {
        a.addEventListener('click', function(e) {
          e.preventDefault();
          
          // セッションをクリア
          sessionStorage.removeItem('currentUser');
          localStorage.removeItem('touristData');
          localStorage.removeItem('guideData');
          
          // ページをリロード
          window.location.reload();
        });
      }
      
      li.appendChild(a);
      menu.appendChild(li);
    });
    
    // 要素を組み立て
    menuDiv.appendChild(btn);
    menuDiv.appendChild(menu);
    
    // 言語ドロップダウンの前に挿入
    langDropdown.parentNode.insertBefore(menuDiv, langDropdown);
  }
})();