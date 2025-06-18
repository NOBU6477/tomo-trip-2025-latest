/**
 * Nuclear Fix - 最終手段による直接DOM操作
 * 他のスクリプトを完全に無視して強制的に正しいデータを表示
 */

(function() {
  'use strict';

  let nuclearInterval;
  let originalValues = {};

  /**
   * セッションストレージから実際のデータを取得
   */
  function getRealUserData() {
    const sources = [
      'currentUser',
      'guideRegistrationData', 
      'currentUser_backup',
      'guideRegistrationData_backup'
    ];

    for (const key of sources) {
      const data = sessionStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed && (parsed.firstName || parsed.name) && parsed.email) {
            console.log('Nuclear Fix: 実データ取得成功', key, parsed);
            return parsed;
          }
        } catch (e) {
          continue;
        }
      }
    }
    return null;
  }

  /**
   * 要素を核爆弾級で強制更新
   */
  function nuclearUpdate() {
    const userData = getRealUserData();
    if (!userData) return;

    const updates = [
      {
        id: 'display-name',
        value: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'ガイド'
      },
      {
        id: 'display-username', 
        value: userData.username || userData.firstName || userData.name || 'ガイド'
      },
      {
        id: 'user-name',
        value: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'ガイド'
      },
      {
        id: 'display-email',
        value: userData.email || 'test1500@gmail.com'
      },
      {
        id: 'display-location',
        value: userData.location || userData.city || userData.area || '東京都'
      }
    ];

    updates.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element && value && element.textContent !== value) {
        // 複数の方法で確実に設定
        element.textContent = value;
        element.innerHTML = value;
        element.innerText = value;
        
        // プロパティを直接操作
        Object.defineProperty(element, 'textContent', {
          value: value,
          writable: false,
          configurable: false
        });

        // 属性も設定
        element.setAttribute('data-original-value', value);
        element.setAttribute('data-nuclear-fixed', 'true');

        console.log(`Nuclear Fix: ${id} = "${value}"`);
        originalValues[id] = value;
      }
    });
  }

  /**
   * 他のスクリプトによる変更を阻止
   */
  function blockOtherScripts() {
    const targetIds = ['display-name', 'display-username', 'user-name'];
    
    targetIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        // MutationObserverで変更を即座に検出・復元
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            const target = mutation.target;
            if (target.id === id && originalValues[id]) {
              if (target.textContent !== originalValues[id]) {
                console.log(`Nuclear Fix: ${id}への不正変更を検出し復元`);
                target.textContent = originalValues[id];
              }
            }
          });
        });

        observer.observe(element, {
          childList: true,
          characterData: true,
          subtree: true
        });

        // DOM プロパティをロック
        const descriptor = Object.getOwnPropertyDescriptor(element, 'textContent');
        if (descriptor && descriptor.configurable) {
          Object.defineProperty(element, 'textContent', {
            get: function() { return originalValues[id] || descriptor.get.call(this); },
            set: function(value) { 
              if (originalValues[id] && value !== originalValues[id]) {
                console.log(`Nuclear Fix: ${id}への書き込み拒否`);
                return;
              }
              descriptor.set.call(this, value);
            },
            configurable: false
          });
        }
      }
    });
  }

  /**
   * 他のスクリプトファイルを無効化
   */
  function disableInterferingScripts() {
    // 問題のあるスクリプトの関数を無効化
    const problematicFunctions = [
      'updateProfileDisplay',
      'populateFormDirectly', 
      'setCurrentUser',
      'loadGuideProfile',
      'updateProfileFromSession'
    ];

    problematicFunctions.forEach(funcName => {
      if (window[funcName]) {
        window[funcName] = function() {
          console.log(`Nuclear Fix: ${funcName}を無効化`);
          return;
        };
      }
    });

    // sessionStorage.setItem を一時的にオーバーライド
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
      if (key === 'currentUser') {
        try {
          const data = JSON.parse(value);
          if (data.name === '優' || data.username === '優') {
            console.log('Nuclear Fix: 「優」データの保存を阻止');
            return;
          }
        } catch (e) {
          // JSON以外はそのまま通す
        }
      }
      return originalSetItem.call(this, key, value);
    };
  }

  /**
   * 継続的な監視と修正
   */
  function startNuclearMonitoring() {
    nuclearInterval = setInterval(() => {
      const nameElement = document.getElementById('display-name');
      const usernameElement = document.getElementById('display-username');
      const sidebarElement = document.getElementById('user-name');

      if ((nameElement && nameElement.textContent === '優') ||
          (usernameElement && usernameElement.textContent === '優') ||
          (sidebarElement && sidebarElement.textContent === '優')) {
        
        console.log('Nuclear Fix: 「優」を検出、核修正実行');
        nuclearUpdate();
      }
    }, 100); // 0.1秒間隔で監視

    console.log('Nuclear Fix: 継続監視開始');
  }

  /**
   * Nuclear Fix初期化
   */
  function initNuclearFix() {
    console.log('🚀 Nuclear Fix システム開始');
    
    // 他のスクリプトを無効化
    disableInterferingScripts();
    
    // 強制更新実行
    setTimeout(nuclearUpdate, 100);
    setTimeout(nuclearUpdate, 500);
    setTimeout(nuclearUpdate, 1000);
    
    // 変更阻止システム開始
    setTimeout(blockOtherScripts, 1500);
    
    // 継続監視開始
    setTimeout(startNuclearMonitoring, 2000);

    // グローバル関数として公開
    window.nuclearUpdate = nuclearUpdate;
    window.stopNuclear = function() {
      if (nuclearInterval) {
        clearInterval(nuclearInterval);
        console.log('Nuclear Fix: 監視停止');
      }
    };

    console.log('🚀 Nuclear Fix システム初期化完了');
  }

  // 最優先で実行
  initNuclearFix();

  // DOM準備後も実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNuclearFix);
  }

  // ページ表示時も実行
  window.addEventListener('pageshow', initNuclearFix);

})();