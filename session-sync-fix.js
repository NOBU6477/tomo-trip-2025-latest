/**
 * セッション同期修正スクリプト
 * ページ間でのユーザーログイン状態を同期します
 */

(function() {
  // グローバルフラグを確認してスクリプトの重複実行を防止
  if (window.sessionSyncLoaded || window.sessionSyncFixApplied) {
    console.log('セッション同期スクリプトは既に実行済みです');
    return;
  }
  
  // 安全なストレージヘルパーを取得
  const safeStorage = window.safeStorageOps;
  
  // グローバルフラグを設定
  window.sessionSyncLoaded = true;
  
  console.log('セッション同期修正スクリプトを読み込みました');
  
  // DOMの準備ができたら実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSessionSync();
  } else {
    document.addEventListener('DOMContentLoaded', initSessionSync, { once: true });
  }
  
  // セッション同期の初期化
  function initSessionSync() {
    console.log('セッション同期の初期化を開始します');
    
    // 現在のページURLを取得
    const currentUrl = window.location.href;
    const isGuideDetailsPage = currentUrl.includes('guide-details.html');
    
    // セッションストレージからユーザー情報を取得
    let userSessionStr = sessionStorage.getItem('currentUser');
    let localUserDataStr = localStorage.getItem('touristData') || localStorage.getItem('guideData');
    
    // セッションとローカルストレージの同期をチェック
    let isSynced = false;
    try {
      // 文字列そのものではなく、中身のデータを比較する
      if (userSessionStr && localUserDataStr) {
        const sessionData = JSON.parse(userSessionStr);
        const localData = JSON.parse(localUserDataStr);
        
        // IDで比較
        if (sessionData.id === localData.id) {
          isSynced = true;
        } else {
          console.warn('⚠️ セッションとローカルストレージが同期されていません');
        }
      }
    } catch (e) {
      console.error('セッション同期チェックエラー:', e);
    }
    
    // 同期していない場合、セッションを優先してローカルストレージを更新
    if (userSessionStr) {
      try {
        const userData = JSON.parse(userSessionStr);
        
        // ユーザータイプを判定（ユーザーIDの接頭辞またはtype属性から確認）
        let userType = userData.type || 'unknown';
        if (userType === 'unknown' && userData.id) {
          // IDの接頭辞からユーザータイプを推測
          if (userData.id.startsWith('tourist_')) {
            userType = 'tourist';
          } else if (userData.id.startsWith('guide_')) {
            userType = 'guide';
          }
        }
        
        // ユーザータイプに基づいてローカルストレージを更新
        if (userType === 'tourist') {
          localStorage.setItem('touristData', userSessionStr);
          console.log('ローカルストレージを観光客データで同期しました');
        } else if (userType === 'guide') {
          localStorage.setItem('guideData', userSessionStr);
          console.log('ローカルストレージをガイドデータで同期しました');
        } else {
          // ユーザータイプが不明な場合、両方に保存して確実に同期
          console.log('ユーザータイプが不明です。両方のストレージに保存します');
          if (userData.id && userData.id.includes('tourist')) {
            localStorage.setItem('touristData', userSessionStr);
          } else {
            localStorage.setItem('guideData', userSessionStr);
          }
        }
        
        // 最新のローカルデータを取得
        localUserDataStr = localStorage.getItem('touristData') || localStorage.getItem('guideData');
      } catch (e) {
        console.error('ローカルストレージ更新エラー:', e);
      }
    }
    
    console.log('セッション同期: SessionStorage=', userSessionStr ? '存在します' : 'なし');
    console.log('セッション同期: LocalStorage=', localUserDataStr ? '存在します' : 'なし');
    
    // ユーザーデータを解析 - 安全なヘルパー関数を使用
    let userData = null;
    try {
      // 安全な取得関数が利用可能かチェック
      if (window.safeSessionGet && window.safeLocalGet) {
        // セッションストレージを優先
        userData = window.safeSessionGet('currentUser');
        
        if (!userData) {
          // ローカルストレージから取得
          const touristData = window.safeLocalGet('touristData');
          const guideData = window.safeLocalGet('guideData');
          
          // 存在するデータを優先
          userData = touristData || guideData;
          
          // データがあればセッションに同期
          if (userData && window.safeSessionSet) {
            window.safeSessionSet('currentUser', userData);
            console.log('ユーザーデータをローカルストレージからセッションに同期しました');
          }
        }
      } else {
        // 従来のメソッドでフォールバック
        if (userSessionStr) {
          userData = JSON.parse(userSessionStr);
        } else if (localUserDataStr) {
          userData = JSON.parse(localUserDataStr);
          // セッションストレージにも保存
          sessionStorage.setItem('currentUser', localUserDataStr);
          console.log('ユーザーデータをローカルストレージからセッションに同期しました');
        }
      }
    } catch (e) {
      console.error('ユーザーデータの解析に失敗しました:', e.message);
    }
    
    // ユーザーがログインしているか確認
    const isLoggedIn = !!userData;
    console.log('ユーザーログイン状態:', isLoggedIn ? 'ログイン済み' : '未ログイン');
    
    // ユーザータイプを検出して表示
    if (isLoggedIn && userData) {
      // IDまたはtype属性からユーザータイプを確定
      let userType = 'なし';
      if (userData.type && ['tourist', 'guide'].includes(userData.type)) {
        userType = userData.type;
      } else if (userData.id) {
        if (userData.id.indexOf('tourist') >= 0) {
          userType = 'tourist';
          // ユーザーデータにtype属性がなければ追加する
          if (!userData.type) {
            userData.type = 'tourist';
            // セッションストレージを更新
            if (window.safeSessionSet) {
              window.safeSessionSet('currentUser', userData);
            } else {
              sessionStorage.setItem('currentUser', JSON.stringify(userData));
            }
            // ローカルストレージを更新
            if (window.safeLocalSet) {
              window.safeLocalSet('touristData', userData);
            } else {
              localStorage.setItem('touristData', JSON.stringify(userData));
            }
          }
        } else if (userData.id.indexOf('guide') >= 0) {
          userType = 'guide';
          // ユーザーデータにtype属性がなければ追加する
          if (!userData.type) {
            userData.type = 'guide';
            // セッションストレージを更新
            if (window.safeSessionSet) {
              window.safeSessionSet('currentUser', userData);
            } else {
              sessionStorage.setItem('currentUser', JSON.stringify(userData));
            }
            // ローカルストレージを更新
            if (window.safeLocalSet) {
              window.safeLocalSet('guideData', userData);
            } else {
              localStorage.setItem('guideData', JSON.stringify(userData));
            }
          }
        }
      }
      
      console.log('ユーザータイプ:', userType);
    } else {
      console.log('ユーザータイプ:', 'なし');
    }
    
    try {
      if (isGuideDetailsPage) {
        // ガイド詳細ページでの処理
        handleGuideDetailsPage(isLoggedIn, userData);
      } else {
        // トップページなどでの処理
        handleMainPage(isLoggedIn, userData);
      }
    } catch (error) {
      console.error('セッション同期処理中にエラーが発生しました:', error.message);
    }
    
    // ログアウトボタンにイベントハンドラを登録（一度だけ）
    setupLogoutHandlers();
  }
  
  /**
   * ガイド詳細ページでのセッション処理
   */
  function handleGuideDetailsPage(isLoggedIn, userData) {
    if (!isLoggedIn) {
      console.log('ガイド詳細ページ: 未ログイン状態です');
      return;
    }
    
    console.log('ガイド詳細ページ: ログイン済み - ログイン要求画面を非表示にします');
    
    // ログイン要求画面を非表示
    const loginRequiredContainer = document.querySelector('.login-required-container');
    if (loginRequiredContainer) {
      loginRequiredContainer.style.display = 'none';
      console.log('ログイン要求画面を非表示にしました');
    }
    
    // ガイド詳細コンテンツを表示
    const guideDetailsContent = document.getElementById('guide-details-content');
    if (guideDetailsContent) {
      guideDetailsContent.style.display = 'block';
      console.log('ガイド詳細コンテンツを表示しました');
    } else {
      // メインコンテンツを探す
      const mainContent = document.querySelector('.container.py-5');
      if (mainContent) {
        mainContent.id = 'guide-details-content';
        mainContent.style.display = 'block';
        console.log('メインコンテンツをガイド詳細コンテンツとして設定しました');
      } else {
        console.log('ガイド詳細コンテンツが見つかりません');
      }
    }
    
    // ヘッダーのログインボタンを非表示にし、ユーザーメニューを表示
    updateHeaderUserMenu(userData);
  }
  
  /**
   * メインページ（トップページなど）でのセッション処理
   */
  function handleMainPage(isLoggedIn, userData) {
    if (!isLoggedIn) {
      console.log('メインページ: 未ログイン状態です');
      return;
    }
    
    console.log('メインページ: ログイン済み - ユーザー表示を更新します');
    updateHeaderUserMenu(userData);
  }
  
  /**
   * ヘッダーのユーザーメニューを更新
   */
  function updateHeaderUserMenu(userData) {
    if (!userData) return;
    
    // 未ログイン時のUI要素
    const navLoginBtn = document.getElementById('nav-login-btn');
    const registerDropdown = document.getElementById('registerDropdown');
    const navUserArea = document.getElementById('navbar-user-area');
    
    // ログイン済みのUI要素
    const navUserMenu = document.getElementById('nav-user-menu');
    const navUserName = document.getElementById('nav-user-name');
    
    if (navUserMenu) {
      // 既存のユーザーメニューがある場合は表示
      navUserMenu.classList.remove('d-none');
      if (navUserName) navUserName.textContent = userData.name || 'ユーザー';
      
      // 未ログイン時のUIを非表示
      if (navUserArea) navUserArea.classList.add('d-none');
      
      console.log('既存のユーザーメニューを表示しました');
    } else if (navUserArea) {
      // ユーザーメニューがなく、未ログイン時のUIがある場合は非表示
      navUserArea.classList.add('d-none');
      console.log('ログインボタンエリアを非表示にしました');
      
      // 代わりのユーザーメニューをヘッダーに追加
      addUserMenuToHeader(userData);
    }
  }
  
  /**
   * ヘッダーにユーザーメニューを追加
   */
  function addUserMenuToHeader(userData) {
    if (!userData || !userData.name) return;
    
    const navbar = document.querySelector('.navbar-nav');
    if (!navbar) return;
    
    // 現在の言語
    const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
    
    // ユーザーメニュー要素を作成
    const menuDiv = document.createElement('div');
    menuDiv.id = 'nav-user-menu';
    menuDiv.className = 'dropdown';
    
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
      li.appendChild(a);
      menu.appendChild(li);
    });
    
    // 要素を組み立て
    menuDiv.appendChild(btn);
    menuDiv.appendChild(menu);
    
    // ナビゲーションバーに追加
    const navbarEnd = document.querySelector('.navbar .dropdown');
    if (navbarEnd && navbarEnd.parentNode) {
      navbarEnd.parentNode.insertBefore(menuDiv, navbarEnd);
    } else {
      navbar.appendChild(menuDiv);
    }
    
    console.log('ユーザーメニューをヘッダーに追加しました');
  }
  
  /**
   * ログアウトボタンのイベントハンドラを設定
   */
  function setupLogoutHandlers() {
    // ':contains' セレクタはjQueryのみで使用可能なため標準的な方法に変更
    const logoutButtons = Array.from(document.querySelectorAll('.logout-button, a.dropdown-item'));
    const filteredButtons = logoutButtons.filter(btn => {
      const text = btn.textContent.trim().toLowerCase();
      return text === 'ログアウト' || text === 'logout';
    });
    
    // 見つかったボタンにイベントリスナーを追加
    filteredButtons.forEach(btn => {
      // 既存のイベントリスナーを削除して重複を防止（完全な削除は難しいがこの方法でも十分）
      btn.removeEventListener('click', handleLogout);
      btn.addEventListener('click', handleLogout);
    });
    
    console.log('ログアウトボタンハンドラを設定:', filteredButtons.length, '個のボタンを検出');
  }
  
  /**
   * ログアウト処理
   */
  function handleLogout(e) {
    if (e) e.preventDefault();
    
    console.log('ログアウト処理を実行します');
    
    // セッションをクリア
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('touristData');
    localStorage.removeItem('guideData');
    
    console.log('セッションデータをクリアしました');
    
    // ページをリロード
    window.location.reload();
  }
})();