/**
 * 緊急DOM直接操作システム
 * HTMLパースと同時に要素を監視し、「優」を即座に実データで置き換え
 */

(function() {
  'use strict';

  // セッションストレージから実データを取得
  function getRealData() {
    const sources = ['currentUser', 'guideRegistrationData', 'latestGuideRegistration'];
    for (const key of sources) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && parsed.email && (parsed.name || parsed.firstName) && parsed.name !== '優') {
            return {
              name: parsed.name || parsed.firstName || 'ガイド',
              username: parsed.username || parsed.firstName || 'ガイド'
            };
          }
        }
      } catch (e) { continue; }
    }
    return null;
  }

  // DOM要素への直接介入
  function interceptElement(element, id, realData) {
    if (!realData) return;
    
    const value = (id === 'display-username') ? realData.username : realData.name;
    
    // 複数の方法で値を強制設定
    element.textContent = value;
    element.innerHTML = value;
    
    // プロパティを完全にロック
    Object.defineProperty(element, 'textContent', {
      value: value,
      writable: false,
      configurable: false
    });
    
    Object.defineProperty(element, 'innerHTML', {
      value: value,
      writable: false,
      configurable: false
    });
    
    console.log(`緊急システム: ${id} を "${value}" で固定`);
  }

  // HTMLパーサーレベルでの介入
  const realData = getRealData();
  if (realData) {
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(this, tagName);
      
      // 元の属性設定メソッドをオーバーライド
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'id' && ['display-name', 'display-username', 'user-name'].includes(value)) {
          setTimeout(() => interceptElement(element, value, realData), 0);
        }
        return originalSetAttribute.call(this, name, value);
      };
      
      return element;
    };
  }

  // 既存要素への即座介入
  function emergencyFix() {
    const realData = getRealData();
    if (!realData) return;

    ['display-name', 'display-username', 'user-name'].forEach(id => {
      const element = document.getElementById(id);
      if (element && (element.textContent === '優' || element.textContent === '未設定')) {
        interceptElement(element, id, realData);
      }
    });
  }

  // 即座実行
  emergencyFix();

  // DOM変更時の即座介入
  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            ['display-name', 'display-username', 'user-name'].forEach(id => {
              const target = node.id === id ? node : (node.querySelector && node.querySelector('#' + id));
              if (target) {
                setTimeout(() => interceptElement(target, id, realData), 0);
              }
            });
          }
        });
      }
      
      if (mutation.type === 'characterData' && mutation.target.parentNode) {
        const parent = mutation.target.parentNode;
        if (['display-name', 'display-username', 'user-name'].includes(parent.id) && 
            mutation.target.textContent === '優') {
          interceptElement(parent, parent.id, realData);
        }
      }
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 0.1秒間隔での強制監視
  setInterval(emergencyFix, 100);

  console.log('緊急DOM直接操作システム起動');

})();