/**
 * 新規登録データ修正システム
 * ガイド登録時のデータがプロフィールページに正しく反映されるように修正
 */

(function() {
  'use strict';

  /**
   * 最新の登録データを取得
   */
  function getLatestRegistrationData() {
    try {
      // セッションストレージから直接取得
      const currentUser = sessionStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        console.log('セッションストレージから取得したユーザーデータ:', userData);
        return userData;
      }

      // ガイド登録データから取得
      const regData = sessionStorage.getItem('guideRegistrationData');
      if (regData) {
        const data = JSON.parse(regData);
        console.log('登録データから構築:', data);
        return {
          name: `${data.firstName} ${data.lastName}`,
          username: data.firstName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          languages: data.languages,
          userType: 'guide'
        };
      }

      // 基本データから取得
      const basicData = sessionStorage.getItem('guideBasicData');
      if (basicData) {
        const data = JSON.parse(basicData);
        console.log('基本データから構築:', data);
        return {
          name: `${data.firstName} ${data.lastName}`,
          username: data.firstName,
          location: data.location,
          languages: data.languages,
          userType: 'guide'
        };
      }

      return null;
    } catch (error) {
      console.error('登録データ取得エラー:', error);
      return null;
    }
  }

  /**
   * プロフィール表示を更新
   */
  function updateProfileDisplay(userData) {
    if (!userData) return;

    console.log('プロフィール表示を更新:', userData);

    // 表示エリアを更新
    const displayName = document.getElementById('display-name');
    if (displayName) {
      displayName.textContent = userData.name || '未設定';
    }

    const displayUsername = document.getElementById('display-username');
    if (displayUsername) {
      displayUsername.textContent = userData.username || userData.name || '未設定';
    }

    const displayEmail = document.getElementById('display-email');
    if (displayEmail) {
      displayEmail.textContent = userData.email || '未設定';
    }

    const displayLocation = document.getElementById('display-location');
    if (displayLocation) {
      displayLocation.textContent = userData.location || '未設定';
    }

    const displayLanguages = document.getElementById('display-languages');
    if (displayLanguages && userData.languages) {
      const languageLabels = {
        'ja': '日本語',
        'en': '英語',
        'zh': '中国語',
        'ko': '韓国語',
        'fr': 'フランス語',
        'de': 'ドイツ語',
        'es': 'スペイン語',
        'it': 'イタリア語',
        'ru': 'ロシア語'
      };
      
      const languages = Array.isArray(userData.languages) ? userData.languages : [userData.languages];
      displayLanguages.innerHTML = languages.map(lang => 
        `<span class="badge bg-primary me-1">${languageLabels[lang] || lang}</span>`
      ).join('');
    }

    // サイドバーの名前も更新
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      sidebarName.textContent = userData.name || '未設定';
    }

    // フォーム入力欄も更新
    const nameField = document.getElementById('guide-name');
    if (nameField) {
      nameField.value = userData.name || '';
    }

    const usernameField = document.getElementById('guide-username');
    if (usernameField) {
      usernameField.value = userData.username || userData.name || '';
    }

    const emailField = document.getElementById('guide-email');
    if (emailField) {
      emailField.value = userData.email || '';
    }

    const locationField = document.getElementById('guide-location');
    if (locationField) {
      locationField.value = userData.location || '';
    }

    console.log('プロフィール表示の更新完了');
  }

  /**
   * データ同期実行
   */
  function syncRegistrationData() {
    const userData = getLatestRegistrationData();
    if (userData) {
      updateProfileDisplay(userData);
      
      // currentUserを最新データで更新
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('登録データ同期完了:', userData.name);
    } else {
      console.log('同期可能な登録データが見つかりません');
    }
  }

  // ページ読み込み時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncRegistrationData);
  } else {
    syncRegistrationData();
  }

  // 少し遅延して再実行（他のスクリプトの影響を避ける）
  setTimeout(syncRegistrationData, 500);
  setTimeout(syncRegistrationData, 1500);

  console.log('登録データ修正システム初期化完了');
})();