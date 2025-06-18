/**
 * 超優先修正システム - ページ読み込み最初期に実行
 * 他のスクリプトより先に実行して「優」問題を根本から阻止
 */

(function() {
  'use strict';

  console.log('超優先システム: 開始');

  /**
   * セッションストレージから実データを即座取得
   */
  function getImmediateUserData() {
    const keys = ['currentUser', 'guideRegistrationData', 'latestGuideRegistration'];
    
    for (const key of keys) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && parsed.email && (parsed.name || parsed.firstName) && parsed.name !== '優') {
            console.log('超優先システム: 実データ発見:', key);
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
   * DOM要素が作成される前にデータを準備
   */
  function prepareCorrectData() {
    const userData = getImmediateUserData();
    if (!userData) return null;

    return {
      name: userData.name || userData.firstName || 'ガイド',
      username: userData.username || userData.firstName || 'ガイド',
      email: userData.email || 'test1500@gmail.com',
      location: userData.location || userData.region || '東京都'
    };
  }

  /**
   * MutationObserverで要素作成を監視
   */
  function setupElementWatcher() {
    const correctData = prepareCorrectData();
    if (!correctData) return;

    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 対象要素をチェック
            const targets = ['display-name', 'display-username', 'user-name'];
            targets.forEach(id => {
              let element = node.id === id ? node : node.querySelector ? node.querySelector(`#${id}`) : null;
              if (element) {
                console.log(`超優先システム: ${id}要素を検出、即座設定`);
                setElementValue(element, id, correctData);
              }
            });
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    console.log('超優先システム: 要素監視開始');
  }

  /**
   * 要素に正しい値を設定
   */
  function setElementValue(element, id, correctData) {
    let value;
    switch(id) {
      case 'display-name':
      case 'user-name':
        value = correctData.name;
        break;
      case 'display-username':
        value = correctData.username;
        break;
      default:
        return;
    }

    element.textContent = value;
    element.setAttribute('data-super-priority-set', 'true');
    console.log(`超優先システム: ${id} = "${value}"`);
  }

  /**
   * 既存要素の即座修正
   */
  function fixExistingElements() {
    const correctData = prepareCorrectData();
    if (!correctData) return;

    const targets = ['display-name', 'display-username', 'user-name'];
    targets.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        setElementValue(element, id, correctData);
      }
    });
  }

  /**
   * 定期的な修正実行
   */
  function startContinuousMonitoring() {
    const correctData = prepareCorrectData();
    if (!correctData) return;

    const interval = setInterval(() => {
      const targets = ['display-name', 'display-username', 'user-name'];
      targets.forEach(id => {
        const element = document.getElementById(id);
        if (element && element.textContent === '優') {
          console.log(`超優先システム: 定期チェックで${id}の「優」を検出、修正`);
          setElementValue(element, id, correctData);
        }
      });
    }, 100);

    // 1分後に停止
    setTimeout(() => {
      clearInterval(interval);
      console.log('超優先システム: 定期監視終了');
    }, 60000);
  }

  // 他のスクリプトより先に実行される関数をオーバーライド
  const originalSetItem = sessionStorage.setItem;
  sessionStorage.setItem = function(key, value) {
    if (value && typeof value === 'string' && value.includes('優')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed.name === '優' || parsed.username === '優') {
          console.log('超優先システム: 「優」データの保存を阻止');
          return;
        }
      } catch (e) {
        // JSON以外はそのまま
      }
    }
    return originalSetItem.call(this, key, value);
  };

  // 即座に実行
  setupElementWatcher();
  
  // DOM準備後も実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(fixExistingElements, 0);
      setTimeout(startContinuousMonitoring, 100);
    });
  } else {
    fixExistingElements();
    startContinuousMonitoring();
  }

  console.log('超優先システム: 初期化完了');

})();