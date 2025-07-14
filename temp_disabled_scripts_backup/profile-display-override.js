/**
 * プロフィール表示完全オーバーライドシステム
 * 既存のすべてのスクリプトを無効化し、セッションストレージから直接データを表示
 */

(function() {
  'use strict';

  // 既存の関数を無効化
  const problematicFunctions = [
    'fillBasicInfoForm',
    'updateProfileDisplay', 
    'populateFormDirectly',
    'setCurrentUser',
    'loadGuideProfile',
    'updateProfileFromSession',
    'getCurrentUser',
    'getRegistrationData',
    'getGuideData',
    'setDefaultValues'
  ];

  // グローバル関数を無効化
  problematicFunctions.forEach(funcName => {
    window[funcName] = function() {
      console.log(`Override: ${funcName}を無効化`);
      return null;
    };
  });

  /**
   * セッションストレージから実際のユーザーデータを取得
   */
  function getActualUserData() {
    const storageKeys = [
      'currentUser',
      'guideRegistrationData',
      'currentUser_backup',
      'guideRegistrationData_backup',
      'latestGuideRegistration'
    ];

    for (const key of storageKeys) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          console.log(`Override: ${key}からデータ取得:`, parsed);
          
          // 実際のデータかチェック（「優」ではない）
          if (parsed && 
              (parsed.firstName || parsed.name || parsed.username) &&
              (parsed.firstName !== '優' && parsed.name !== '優' && parsed.username !== '優')) {
            return parsed;
          }
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
    const userData = getActualUserData();
    
    if (!userData) {
      console.log('Override: 有効なユーザーデータが見つかりません');
      return;
    }

    console.log('Override: プロフィール表示を更新:', userData);

    // 表示名の決定
    const displayName = userData.name || 
                       (userData.firstName && userData.lastName ? 
                        `${userData.firstName} ${userData.lastName}` : 
                        userData.firstName) || 
                       userData.username || 
                       'ガイド';

    const username = userData.username || userData.firstName || userData.name || 'ガイド';
    const email = userData.email || 'test1500@gmail.com';
    const location = userData.location || userData.region || userData.area || userData.city || '千葉県';

    // DOM要素を直接更新
    const updates = [
      { id: 'display-name', value: displayName },
      { id: 'display-username', value: username },
      { id: 'user-name', value: displayName },
      { id: 'display-email', value: email },
      { id: 'display-location', value: location }
    ];

    updates.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        // 複数の方法で確実に設定
        element.textContent = value;
        element.innerHTML = value;
        
        // データ属性でマーク
        element.setAttribute('data-override-set', 'true');
        element.setAttribute('data-original-value', value);
        
        console.log(`Override: ${id} = "${value}"`);
      }
    });

    // フォーム入力欄も更新
    updateFormFields(userData);
  }

  /**
   * フォーム入力欄を更新
   */
  function updateFormFields(userData) {
    const formUpdates = [
      { id: 'guide-name', value: userData.name || userData.firstName || '' },
      { id: 'guide-username', value: userData.username || userData.firstName || '' },
      { id: 'guide-email', value: userData.email || '' },
      { id: 'guide-location', value: userData.location || userData.region || '' },
      { id: 'guide-description', value: userData.description || '' },
      { id: 'guide-session-fee', value: userData.sessionFee || '6000' }
    ];

    formUpdates.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element && value) {
        element.value = value;
        console.log(`Override: フォーム ${id} = "${value}"`);
      }
    });

    // 言語選択の更新
    if (userData.languages && Array.isArray(userData.languages)) {
      const languagesSelect = document.getElementById('guide-languages');
      if (languagesSelect) {
        Array.from(languagesSelect.options).forEach(option => {
          option.selected = userData.languages.includes(option.value);
        });
      }
    }
  }

  /**
   * MutationObserverで変更を監視し即座に復元
   */
  function setupChangeMonitoring() {
    const targetIds = ['display-name', 'display-username', 'user-name'];
    
    targetIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            const target = mutation.target;
            const originalValue = target.getAttribute('data-original-value');
            
            if (target.id === id && originalValue && target.textContent !== originalValue) {
              console.log(`Override: ${id}への不正変更を検出、復元: "${target.textContent}" -> "${originalValue}"`);
              target.textContent = originalValue;
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
   * DOM操作をブロック
   */
  function blockDOMManipulation() {
    const targetIds = ['display-name', 'display-username', 'user-name'];
    
    targetIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        // textContentプロパティをロック
        const originalValue = element.getAttribute('data-original-value');
        if (originalValue) {
          Object.defineProperty(element, 'textContent', {
            get: function() { return originalValue; },
            set: function(value) { 
              if (value !== originalValue) {
                console.log(`Override: ${id}への書き込み拒否: "${value}"`);
              }
            },
            configurable: false
          });
        }
      }
    });
  }

  /**
   * 初期化処理
   */
  function initialize() {
    console.log('🔄 プロフィール表示オーバーライドシステム開始');

    // 即座に実行
    setTimeout(forceUpdateProfileDisplay, 100);
    
    // 遅延実行で確実に
    setTimeout(forceUpdateProfileDisplay, 500);
    setTimeout(forceUpdateProfileDisplay, 1000);
    
    // 監視開始
    setTimeout(setupChangeMonitoring, 1500);
    
    // DOM操作ブロック
    setTimeout(blockDOMManipulation, 2000);

    // 定期的な監視
    setInterval(() => {
      const nameElement = document.getElementById('display-name');
      if (nameElement && nameElement.textContent === '優') {
        console.log('Override: 「優」を検出、強制修正');
        forceUpdateProfileDisplay();
      }
    }, 1000);

    // グローバル関数として公開
    window.forceProfileUpdate = forceUpdateProfileDisplay;
    
    console.log('🔄 プロフィール表示オーバーライドシステム初期化完了');
  }

  // 即座に実行
  initialize();

  // DOM準備後も実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }

  // ページ表示時も実行
  window.addEventListener('pageshow', initialize);

})();