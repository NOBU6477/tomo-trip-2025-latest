/**
 * ログインモーダル内のユーザータイプボタン（観光客/ガイド）の選択機能
 */

document.addEventListener('DOMContentLoaded', function() {
  // 設定タイムアウト - モーダルが後から動的に追加される場合への対応
  setTimeout(setupUserTypeButtons, 500);
  
  // モーダル表示イベントも監視
  document.addEventListener('shown.bs.modal', function(e) {
    if (e.target.id === 'loginModal' || e.target.id === 'registerModal') {
      setupUserTypeButtons();
    }
  });
  
  /**
   * ユーザータイプボタンのセットアップ
   */
  function setupUserTypeButtons() {
    // ログインモーダル内のユーザータイプボタン
    const touristBtn = document.getElementById('touristBtn');
    const guideBtn = document.getElementById('guideBtn');
    const userTypeInput = document.getElementById('userType');
    
    // 新規登録モーダル内のユーザータイプボタン
    const registerTouristBtn = document.getElementById('registerTouristBtn');
    const registerGuideBtn = document.getElementById('registerGuideBtn');
    const registerUserTypeInput = document.getElementById('registerUserType');
    
    if (touristBtn && guideBtn) {
      // 観光客ボタンのクリックイベント
      touristBtn.addEventListener('click', function() {
        setActiveUserType('tourist', touristBtn, guideBtn, userTypeInput);
      });
      
      // ガイドボタンのクリックイベント
      guideBtn.addEventListener('click', function() {
        setActiveUserType('guide', guideBtn, touristBtn, userTypeInput);
      });
      
      // 初期状態で観光客を選択
      setActiveUserType('tourist', touristBtn, guideBtn, userTypeInput);
    }
    
    if (registerTouristBtn && registerGuideBtn) {
      // 新規登録モーダルの観光客ボタンのクリックイベント
      registerTouristBtn.addEventListener('click', function() {
        setActiveUserType('tourist', registerTouristBtn, registerGuideBtn, registerUserTypeInput);
      });
      
      // 新規登録モーダルのガイドボタンのクリックイベント
      registerGuideBtn.addEventListener('click', function() {
        setActiveUserType('guide', registerGuideBtn, registerTouristBtn, registerUserTypeInput);
      });
      
      // 初期状態で観光客を選択
      setActiveUserType('tourist', registerTouristBtn, registerGuideBtn, registerUserTypeInput);
    }
  }
  
  /**
   * アクティブなユーザータイプを設定
   */
  function setActiveUserType(type, activeBtn, inactiveBtn, inputField) {
    console.log('選択されたユーザータイプ:', type);
    // ボタンのスタイルを更新
    activeBtn.classList.add('btn-primary');
    activeBtn.classList.remove('btn-outline-primary');
    
    inactiveBtn.classList.remove('btn-primary');
    inactiveBtn.classList.add('btn-outline-primary');
    
    // 隠しフィールドを更新
    if (inputField) {
      inputField.value = type;
    }
  }
});