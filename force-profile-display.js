/**
 * 強制プロフィール表示システム
 * 他のスクリプトによる上書きを防ぎ、確実に登録データを表示
 */

(function() {
  'use strict';

  let forceUpdateInterval;
  let protectedElements = new Set();

  /**
   * 登録データを強制的に取得
   */
  function forceGetUserData() {
    // すべてのストレージから最新データを取得
    const sources = [
      sessionStorage.getItem('currentUser'),
      sessionStorage.getItem('guideRegistrationData'),
      sessionStorage.getItem('currentUser_backup'),
      sessionStorage.getItem('guideRegistrationData_backup'),
      localStorage.getItem('currentUser'),
      localStorage.getItem('guideData')
    ];

    for (const source of sources) {
      if (source) {
        try {
          const data = JSON.parse(source);
          console.log('強制取得したデータ:', data);
          
          // 有効なデータかチェック
          if (data && (data.name || data.firstName || data.username) && data.email) {
            return data;
          }
        } catch (e) {
          continue;
        }
      }
    }

    return null;
  }

  /**
   * 表示要素を強制的に保護
   */
  function protectDisplayElements() {
    const elements = [
      'display-name',
      'display-username', 
      'display-email',
      'display-location',
      'display-languages'
    ];

    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        protectedElements.add(element);
        
        // MutationObserverで変更を監視
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              // 不正な変更を検出したら即座に復元
              if (element.textContent === '優' || element.textContent === '読み込み中...') {
                console.log(`${id}の不正な変更を検出、復元します`);
                forceUpdateElement(element, id);
              }
            }
          });
        });

        observer.observe(element, { 
          childList: true, 
          characterData: true, 
          subtree: true 
        });
      }
    });
  }

  /**
   * 個別要素を強制更新
   */
  function forceUpdateElement(element, elementId) {
    const userData = forceGetUserData();
    if (!userData) return;

    let newValue = '';

    switch (elementId) {
      case 'display-name':
        newValue = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || '新規ガイド';
        break;
      case 'display-username':
        newValue = userData.username || userData.firstName || userData.name || '新規ガイド';
        break;
      case 'display-email':
        newValue = userData.email || '未設定';
        break;
      case 'display-location':
        newValue = userData.location || userData.city || userData.area || '未設定';
        break;
      case 'display-languages':
        if (userData.languages) {
          const languageLabels = {
            'ja': '日本語', 'en': '英語', 'zh': '中国語', 'ko': '韓国語',
            'fr': 'フランス語', 'de': 'ドイツ語', 'es': 'スペイン語',
            'it': 'イタリア語', 'ru': 'ロシア語'
          };
          
          const languages = Array.isArray(userData.languages) ? 
            userData.languages : 
            userData.languages.split(',').map(lang => lang.trim());
          
          newValue = languages.map(lang => 
            `<span class="badge bg-primary me-1">${languageLabels[lang] || lang}</span>`
          ).join('');
          element.innerHTML = newValue;
          return;
        }
        break;
    }

    if (newValue && element.textContent !== newValue) {
      element.textContent = newValue;
      console.log(`${elementId}を強制更新:`, newValue);
    }
  }

  /**
   * すべての表示を強制更新
   */
  function forceUpdateAllDisplays() {
    const userData = forceGetUserData();
    if (!userData) {
      console.log('強制更新: ユーザーデータが見つかりません');
      return;
    }

    console.log('強制表示更新を実行:', userData);

    // 各要素を個別に更新
    const updates = [
      ['display-name', userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || '新規ガイド'],
      ['display-username', userData.username || userData.firstName || userData.name || '新規ガイド'],
      ['display-email', userData.email || '未設定'],
      ['display-location', userData.location || userData.city || userData.area || '未設定']
    ];

    updates.forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element && value) {
        // 現在の値をチェック
        if (element.textContent === '優' || element.textContent === '読み込み中...' || element.textContent === '未設定') {
          element.textContent = value;
          console.log(`強制更新 ${id}:`, value);
        }
      }
    });

    // 言語表示の更新
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
      console.log('強制更新 言語:', languages);
    }

    // サイドバーの名前も更新
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      const name = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || '新規ガイド';
      if (sidebarName.textContent === '優') {
        sidebarName.textContent = name;
        console.log('強制更新 サイドバー名:', name);
      }
    }
  }

  /**
   * 他のスクリプトによる上書きを阻止
   */
  function blockOverwrites() {
    // DOMの変更を監視して「優」に戻されるのを防ぐ
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const target = mutation.target;
          
          // 保護対象の要素が「優」に変更された場合は即座に復元
          if (protectedElements.has(target) || protectedElements.has(target.parentElement)) {
            if (target.textContent === '優' || target.textContent === '読み込み中...') {
              setTimeout(() => {
                forceUpdateAllDisplays();
              }, 10);
            }
          }
        }
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      characterData: true, 
      subtree: true 
    });
  }

  /**
   * 継続的な強制更新を開始
   */
  function startForceUpdate() {
    // 最初に即座に実行
    forceUpdateAllDisplays();

    // 短い間隔で継続的に監視・更新
    forceUpdateInterval = setInterval(() => {
      const displayName = document.getElementById('display-name');
      const displayUsername = document.getElementById('display-username');
      
      if ((displayName && displayName.textContent === '優') || 
          (displayUsername && displayUsername.textContent === '優')) {
        console.log('「優」表示を検出、強制修正実行');
        forceUpdateAllDisplays();
      }
    }, 500);

    console.log('継続的な強制更新を開始');
  }

  /**
   * 初期化処理
   */
  function initialize() {
    console.log('強制プロフィール表示システム開始');

    // 表示要素を保護
    protectDisplayElements();

    // 上書きを阻止
    blockOverwrites();

    // 強制更新開始
    startForceUpdate();

    // グローバル関数として公開
    window.forceUpdateProfile = forceUpdateAllDisplays;

    console.log('強制プロフィール表示システム初期化完了');
  }

  // 即座に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // 少し遅延して確実に実行
  setTimeout(initialize, 100);
  setTimeout(forceUpdateAllDisplays, 500);
  setTimeout(forceUpdateAllDisplays, 1500);

})();