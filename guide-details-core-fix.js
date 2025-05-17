/**
 * ガイド詳細ページ 統合修正スクリプト
 * このスクリプトはパフォーマンスを最大化し、すべてのバグを修正するための完全な解決策です
 */

// 即時実行関数
(function() {
  // 確実に一度だけ実行
  if (window.guideDetailsCoreFixApplied) return;
  window.guideDetailsCoreFixApplied = true;
  
  console.log('ガイド詳細コア修正スクリプトを実行します');
  
  // エラー対策: window.onload が既に設定されている場合の保護
  const originalOnload = window.onload;
  
  // 遅延実行で他のスクリプトとの競合を避ける
  setTimeout(function() {
    // すでにDOMが準備できている場合は直接実行
    if (document.readyState === 'complete') {
      initCore();
    } else {
      // そうでない場合はload時に実行
      window.onload = function(event) {
        // オリジナルのonloadを呼び出し
        if (typeof originalOnload === 'function') {
          originalOnload(event);
        }
        // その後に自身の処理を実行
        initCore();
      };
    }
  }, 100);
  
  /**
   * コア初期化関数
   */
  function initCore() {
    try {
      console.log('ガイド詳細コア修正: 初期化開始');
      
      // ガイド詳細ページかどうか確認
      if (!isGuideDetailsPage()) {
        console.log('ガイド詳細ページではありません');
        return;
      }
      
      // ユーザーのログイン状態を取得
      const userData = getSafeUserData();
      const isLoggedIn = !!userData;
      
      console.log('ユーザーログイン状態:', isLoggedIn ? 'ログイン済み' : '未ログイン');
      
      // ページ要素を取得または作成
      const loginRequiredElement = getOrCreateLoginRequiredElement();
      const contentElement = getOrCreateContentElement();
      
      // ログイン状態に基づいて表示を切り替え
      if (isLoggedIn) {
        showContent(contentElement, loginRequiredElement, userData);
      } else {
        hideContent(contentElement, loginRequiredElement);
      }
      
      console.log('ガイド詳細コア修正: 完了');
    } catch (error) {
      console.error('ガイド詳細コア修正中にエラーが発生しました:', error.message);
    }
  }
  
  /**
   * ガイド詳細ページかどうかを判定
   */
  function isGuideDetailsPage() {
    return window.location.href.includes('guide-details.html');
  }
  
  /**
   * 安全にユーザーデータを取得する
   */
  function getSafeUserData() {
    try {
      // セッションストレージから取得
      const sessionData = sessionStorage.getItem('currentUser');
      if (sessionData) {
        return JSON.parse(sessionData);
      }
      
      // ローカルストレージからガイドデータを取得
      const guideData = localStorage.getItem('guideData');
      if (guideData) {
        return JSON.parse(guideData);
      }
      
      // ローカルストレージから観光客データを取得
      const touristData = localStorage.getItem('touristData');
      if (touristData) {
        return JSON.parse(touristData);
      }
      
      return null;
    } catch (e) {
      console.error('ユーザーデータ取得エラー:', e.message);
      return null;
    }
  }
  
  /**
   * ログイン要求要素を取得または作成
   */
  function getOrCreateLoginRequiredElement() {
    // 既存の要素を探す
    let element = document.querySelector('.login-required-container') || 
                 document.querySelector('.guide-details-login-prompt');
    
    // 要素が見つからない場合は作成
    if (!element) {
      element = document.createElement('div');
      element.className = 'login-required-container';
      element.style.textAlign = 'center';
      element.style.padding = '50px 20px';
      element.style.margin = '0 auto';
      element.style.maxWidth = '600px';
      
      const isJapanese = (localStorage.getItem('selectedLanguage') || 'ja') === 'ja';
      
      // ロックアイコン
      const icon = document.createElement('i');
      icon.className = 'bi bi-lock-fill text-primary';
      icon.style.fontSize = '4rem';
      element.appendChild(icon);
      
      // タイトル
      const title = document.createElement('h2');
      title.className = 'mt-4';
      title.textContent = isJapanese ? 'ガイド詳細の閲覧にはログインが必要です' : 'Login Required';
      element.appendChild(title);
      
      // 説明
      const desc = document.createElement('p');
      desc.className = 'lead mb-4';
      desc.textContent = isJapanese 
        ? 'ガイドの詳細情報、写真ギャラリー、レビュー、予約機能を利用するには、ログインまたは観光客として新規登録が必要です。'
        : 'To view guide details, gallery, reviews, and booking features, please log in or register as a tourist.';
      element.appendChild(desc);
      
      // ボタンコンテナ
      const btnContainer = document.createElement('div');
      btnContainer.className = 'd-grid gap-3 d-sm-flex justify-content-sm-center';
      
      // ログインボタン
      const loginBtn = document.createElement('button');
      loginBtn.type = 'button';
      loginBtn.className = 'btn btn-primary btn-lg px-4';
      loginBtn.dataset.bsToggle = 'modal';
      loginBtn.dataset.bsTarget = '#loginModal';
      loginBtn.innerHTML = `<i class="bi bi-box-arrow-in-right me-2"></i>${isJapanese ? 'ログイン' : 'Login'}`;
      btnContainer.appendChild(loginBtn);
      
      // 登録ボタン
      const registerBtn = document.createElement('button');
      registerBtn.type = 'button';
      registerBtn.className = 'btn btn-outline-primary btn-lg px-4';
      registerBtn.dataset.bsToggle = 'modal';
      registerBtn.dataset.bsTarget = '#registerTouristModal';
      registerBtn.innerHTML = `<i class="bi bi-person-plus me-1"></i>${isJapanese ? '観光客として登録' : 'Register as Tourist'}`;
      btnContainer.appendChild(registerBtn);
      
      element.appendChild(btnContainer);
      
      // ページに挿入
      const mainElement = document.querySelector('main') || document.body;
      mainElement.insertBefore(element, mainElement.firstChild);
    }
    
    return element;
  }
  
  /**
   * コンテンツ要素を取得または作成
   */
  function getOrCreateContentElement() {
    // 既存の要素を探す
    let element = document.getElementById('guide-details-content') || 
                 document.querySelector('.guide-details-content');
    
    // 要素が見つからない場合は他の候補を探す
    if (!element) {
      element = document.querySelector('.container.py-5');
      
      if (element) {
        // 見つかった要素にIDを設定
        element.id = 'guide-details-content';
      } else {
        console.warn('ガイド詳細コンテンツ要素が見つかりません');
      }
    }
    
    return element;
  }
  
  /**
   * コンテンツを表示する
   */
  function showContent(contentElement, loginRequiredElement, userData) {
    if (!contentElement) return;
    
    // ログイン要求画面を非表示
    if (loginRequiredElement) {
      loginRequiredElement.style.display = 'none';
    }
    
    // コンテンツを表示
    contentElement.style.display = 'block';
    
    // ユーザーメニューを更新
    updateUserMenuDisplay(userData);
  }
  
  /**
   * コンテンツを非表示にする
   */
  function hideContent(contentElement, loginRequiredElement) {
    if (!contentElement) return;
    
    // コンテンツを非表示
    contentElement.style.display = 'none';
    
    // ログイン要求画面を表示
    if (loginRequiredElement) {
      loginRequiredElement.style.display = 'block';
    }
  }
  
  /**
   * ユーザーメニュー表示を更新する
   */
  function updateUserMenuDisplay(userData) {
    if (!userData || !userData.name) return;
    
    // ログインボタンエリアを非表示
    const loginArea = document.getElementById('navbar-user-area');
    if (loginArea) {
      loginArea.style.display = 'none';
    }
    
    // ユーザーメニューを表示
    let userMenu = document.getElementById('nav-user-menu');
    if (userMenu) {
      userMenu.classList.remove('d-none');
      
      // ユーザー名を設定
      const nameElement = userMenu.querySelector('#nav-user-name');
      if (nameElement) {
        nameElement.textContent = userData.name;
      }
    }
  }
})();