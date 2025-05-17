/**
 * ガイド詳細ページのログイン要求画面を修正するスクリプト
 * URLパラメータを整理し、ログイン要求画面のUIを修正します
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド詳細認証修正スクリプトを読み込みました');
  
  // URLパラメータを確認
  const urlParams = new URLSearchParams(window.location.search);
  const loginRequired = urlParams.get('login') === 'required';
  
  if (loginRequired) {
    // URLからlogin=requiredパラメータを削除し、idだけを保持
    const id = urlParams.get('id');
    if (id) {
      // 履歴を変更せずにURLを更新
      const newUrl = `${window.location.pathname}?id=${id}`;
      window.history.replaceState({}, '', newUrl);
      console.log('URLパラメータを整理しました:', newUrl);
    }
  }
  
  // ログイン要求画面を整えるための修正
  fixLoginRequiredUI();
  
  /**
   * ログイン要求画面のUI修正
   */
  function fixLoginRequiredUI() {
    // ログインコンテナを探す
    const loginContainer = document.querySelector('.login-required-container');
    if (!loginContainer) return;
    
    console.log('ログイン要求画面を修正します');
    
    // 全体のスタイル調整
    loginContainer.style.textAlign = 'center';
    loginContainer.style.padding = '50px 20px';
    loginContainer.style.maxWidth = '600px';
    loginContainer.style.margin = '0 auto';
    
    // 言語設定に応じたテキスト表示
    const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
    updateTexts(currentLang);
    
    // 言語切替イベントをリッスン
    window.addEventListener('languageChanged', function(e) {
      updateTexts(e.detail.language);
    });
    
    // ログインボタンとツーリスト登録ボタンのスタイル調整
    const buttons = loginContainer.querySelectorAll('.btn');
    buttons.forEach(function(btn) {
      btn.style.margin = '10px';
      btn.style.minWidth = '200px';
    });
    
    /**
     * 言語に応じたテキスト更新
     */
    function updateTexts(lang) {
      // タイトル
      const title = loginContainer.querySelector('h2');
      if (title) {
        title.textContent = lang === 'en' ? 'Login Required' : 'ガイド詳細の閲覧にはログインが必要です';
      }
      
      // 説明文
      const description = loginContainer.querySelector('p');
      if (description) {
        description.textContent = lang === 'en' 
          ? 'To view guide details, photos, gallery, reviews, and booking features, please login or register as a tourist.' 
          : 'ガイドの詳細情報、写真ギャラリー、レビュー、予約機能を利用するには、ログインまたは観光客として新規登録が必要です。';
      }
      
      // ログインボタン
      const loginButton = loginContainer.querySelector('.btn-primary');
      if (loginButton) {
        loginButton.textContent = lang === 'en' ? 'Login' : 'ログイン';
      }
      
      // 登録ボタン
      const registerButton = loginContainer.querySelector('.btn-outline-primary');
      if (registerButton) {
        registerButton.textContent = lang === 'en' ? 'Register as Tourist' : '観光客として登録';
      }
    }
  }
});