/**
 * プロフィールデータ同期システム
 * 新規登録データをプロフィールページに確実に反映
 */

(function() {
  'use strict';

  /**
   * 登録データを完全に取得
   */
  function getCompleteRegistrationData() {
    const sources = [
      () => sessionStorage.getItem('currentUser'),
      () => sessionStorage.getItem('guideRegistrationData'),
      () => sessionStorage.getItem('guideBasicData'),
      () => localStorage.getItem('currentUser'),
      () => localStorage.getItem('guideData')
    ];

    for (const source of sources) {
      try {
        const data = source();
        if (data) {
          const parsed = JSON.parse(data);
          console.log('データソースから取得:', parsed);
          return parsed;
        }
      } catch (e) {
        continue;
      }
    }

    return null;
  }

  /**
   * プロフィール表示を強制更新
   */
  function forceUpdateProfileDisplay() {
    const userData = getCompleteRegistrationData();
    
    if (!userData) {
      console.log('表示可能なユーザーデータが見つかりません');
      return;
    }

    console.log('プロフィール表示を更新:', userData);

    // 氏名の更新
    const displayName = document.getElementById('display-name');
    if (displayName) {
      const fullName = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      displayName.textContent = fullName || userData.username || '未設定';
      console.log('氏名を更新:', fullName);
    }

    // ユーザー名の更新
    const displayUsername = document.getElementById('display-username');
    if (displayUsername) {
      const username = userData.username || userData.firstName || userData.name || '未設定';
      displayUsername.textContent = username;
      console.log('ユーザー名を更新:', username);
    }

    // メールアドレスの更新
    const displayEmail = document.getElementById('display-email');
    if (displayEmail) {
      displayEmail.textContent = userData.email || '未設定';
      console.log('メールアドレスを更新:', userData.email);
    }

    // 活動エリアの更新
    const displayLocation = document.getElementById('display-location');
    if (displayLocation) {
      const location = userData.location || userData.city || userData.area || '未設定';
      displayLocation.textContent = location;
      console.log('活動エリアを更新:', location);
    }

    // 対応言語の更新
    const displayLanguages = document.getElementById('display-languages'); 
    if (displayLanguages && userData.languages) {
      const languageLabels = {
        'ja': '日本語', 'en': '英語', 'zh': '中国語', 'ko': '韓国語',
        'fr': 'フランス語', 'de': 'ドイツ語', 'es': 'スペイン語',
        'it': 'イタリア語', 'ru': 'ロシア語'
      };
      
      const languages = Array.isArray(userData.languages) ? 
        userData.languages : 
        userData.languages.split(',').map(lang => lang.trim());
      
      displayLanguages.innerHTML = languages.map(lang => 
        `<span class="badge bg-primary me-1">${languageLabels[lang] || lang}</span>`
      ).join('');
      console.log('対応言語を更新:', languages);
    }

    // サイドバーのユーザー名も更新
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      const name = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username;
      sidebarName.textContent = name || '優';
      console.log('サイドバー名を更新:', name);
    }

    // 入力フォームも同期
    updateFormFields(userData);
  }

  /**
   * フォーム入力欄を更新
   */
  function updateFormFields(userData) {
    const fieldMappings = [
      ['guide-name', userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()],
      ['guide-username', userData.username || userData.firstName || userData.name],
      ['guide-email', userData.email],
      ['guide-location', userData.location || userData.city || userData.area],
      ['guide-description', userData.bio || userData.description]
    ];

    fieldMappings.forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId);
      if (field && value) {
        field.value = value;
        console.log(`${fieldId}フィールドを更新:`, value);
      }
    });

    // 言語選択の更新
    const languageField = document.getElementById('guide-languages');
    if (languageField && userData.languages) {
      const languages = Array.isArray(userData.languages) ? 
        userData.languages : 
        userData.languages.split(',').map(lang => lang.trim());
      
      Array.from(languageField.options).forEach(option => {
        option.selected = languages.includes(option.value);
      });
      console.log('言語選択を更新:', languages);
    }
  }

  /**
   * リアルタイム同期設定
   */
  function setupRealtimeSync() {
    // フォーム変更時にリアルタイムで表示を更新
    const formFields = [
      'guide-name', 'guide-username', 'guide-email', 
      'guide-location', 'guide-description'
    ];

    formFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', function() {
          updateDisplayFromForm();
        });
      }
    });

    // 言語選択の変更監視
    const languageField = document.getElementById('guide-languages');
    if (languageField) {
      languageField.addEventListener('change', function() {
        updateDisplayFromForm();
      });
    }
  }

  /**
   * フォームから表示を更新
   */
  function updateDisplayFromForm() {
    const formData = {
      name: document.getElementById('guide-name')?.value,
      username: document.getElementById('guide-username')?.value,
      email: document.getElementById('guide-email')?.value,
      location: document.getElementById('guide-location')?.value,
      languages: Array.from(document.getElementById('guide-languages')?.selectedOptions || [])
        .map(option => option.value)
    };

    // 表示を即座に更新
    const displayName = document.getElementById('display-name');
    if (displayName && formData.name) {
      displayName.textContent = formData.name;
    }

    const displayUsername = document.getElementById('display-username');
    if (displayUsername && formData.username) {
      displayUsername.textContent = formData.username;
    }

    const displayEmail = document.getElementById('display-email');
    if (displayEmail && formData.email) {
      displayEmail.textContent = formData.email;
    }

    const displayLocation = document.getElementById('display-location');
    if (displayLocation && formData.location) {
      displayLocation.textContent = formData.location;
    }

    const displayLanguages = document.getElementById('display-languages');
    if (displayLanguages && formData.languages.length > 0) {
      const languageLabels = {
        'ja': '日本語', 'en': '英語', 'zh': '中国語', 'ko': '韓国語',
        'fr': 'フランス語', 'de': 'ドイツ語', 'es': 'スペイン語',
        'it': 'イタリア語', 'ru': 'ロシア語'
      };
      
      displayLanguages.innerHTML = formData.languages.map(lang => 
        `<span class="badge bg-primary me-1">${languageLabels[lang] || lang}</span>`
      ).join('');
    }

    // セッションストレージも更新
    const currentUser = getCompleteRegistrationData() || {};
    const updatedUser = { ...currentUser, ...formData };
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  /**
   * 初期化処理
   */
  function initialize() {
    console.log('プロフィールデータ同期システム開始');
    
    // 即座に実行
    forceUpdateProfileDisplay();
    
    // リアルタイム同期設定
    setupRealtimeSync();

    // 定期的に同期（他のスクリプトによる変更を検出）
    setInterval(forceUpdateProfileDisplay, 2000);

    console.log('プロフィールデータ同期システム初期化完了');
  }

  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // 少し遅延して再実行
  setTimeout(initialize, 500);
  setTimeout(forceUpdateProfileDisplay, 1500);
  setTimeout(forceUpdateProfileDisplay, 3000);

})();