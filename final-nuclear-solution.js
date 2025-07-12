/**
 * 最終核爆弾解決策 - 全翻訳システムの完全破壊
 * 481個のJSファイルによる翻訳干渉を完全阻止
 */

console.log('☢️ 最終核爆弾システム起動 - 全翻訳干渉を根絶します');

// 即座に全翻訳関数を破壊
(function immediateDestruction() {
  // 全ての翻訳関数を無力化
  const functionsToDestroy = [
    'translateToEnglish', 'switchToEnglish', 'applyLanguage',
    'translatePage', 'switchLanguage', 'changeLanguage',
    'setLanguage', 'updateLanguage', 'languageSwitch',
    'englishMode', 'translateContent', 'languageTranslate'
  ];
  
  functionsToDestroy.forEach(funcName => {
    window[funcName] = function() {
      console.log(`☢️ ${funcName} 関数を破壊`);
      enforceJapanese();
      return false;
    };
    
    // プロトタイプからも削除
    try {
      delete window[funcName];
      Object.defineProperty(window, funcName, {
        value: function() { enforceJapanese(); return false; },
        writable: false,
        configurable: false
      });
    } catch(e) {}
  });
})();

// 日本語強制実行
function enforceJapanese() {
  // LocalStorage完全クリア
  try {
    ['selectedLanguage', 'language', 'lang', 'currentLanguage', 'site-language'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch(e) {}
  
  // DOM強制修正
  const signupBtn = document.getElementById('signup-button-fixed');
  if (signupBtn) {
    signupBtn.textContent = '新規登録';
    signupBtn.innerHTML = '新規登録';
    signupBtn.innerText = '新規登録';
    signupBtn.value = '新規登録';
  }
  
  // 全ボタンの緊急修正
  document.querySelectorAll('button, .btn, a').forEach(element => {
    if (element.textContent) {
      let text = element.textContent;
      if (text.includes('Sign Up') || text.trim() === 'Sign Up') {
        element.textContent = '新規登録';
        element.innerHTML = '新規登録';
        element.innerText = '新規登録';
      }
      if (text.includes('Login') && !text.includes('ログイン')) {
        element.textContent = 'ログイン';
        element.innerHTML = 'ログイン';
      }
      if (text.includes('English')) {
        element.textContent = '日本語';
        element.innerHTML = '日本語';
      }
    }
  });
  
  // 属性値も修正
  document.querySelectorAll('*[value], *[placeholder], *[title]').forEach(el => {
    ['value', 'placeholder', 'title'].forEach(attr => {
      if (el.hasAttribute(attr)) {
        let value = el.getAttribute(attr);
        if (value) {
          value = value.replace(/Sign Up/g, '新規登録').replace(/Login/g, 'ログイン');
          el.setAttribute(attr, value);
        }
      }
    });
  });
}

// 0.5ms間隔の超高速監視
function hyperSpeedEnforcement() {
  enforceJapanese();
  setTimeout(hyperSpeedEnforcement, 0.5);
}

// MutationObserver - 最高感度
const finalObserver = new MutationObserver(() => {
  enforceJapanese();
});

finalObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeOldValue: true,
  characterDataOldValue: true,
  attributeFilter: ['textContent', 'innerHTML', 'value', 'placeholder']
});

// 全イベントリスナーでの強制実行
const allEvents = [
  'DOMContentLoaded', 'load', 'beforeunload', 'unload',
  'focus', 'blur', 'click', 'mousedown', 'mouseup', 'mouseover',
  'keydown', 'keyup', 'keypress', 'input', 'change',
  'scroll', 'resize', 'orientationchange', 'hashchange',
  'popstate', 'storage', 'online', 'offline'
];

allEvents.forEach(event => {
  document.addEventListener(event, enforceJapanese, true);
  window.addEventListener(event, enforceJapanese, true);
  document.body.addEventListener(event, enforceJapanese, true);
});

// setInterval, setTimeout, requestAnimationFrameの監視
const originalSetTimeout = window.setTimeout;
const originalSetInterval = window.setInterval;
const originalRequestAnimationFrame = window.requestAnimationFrame;

window.setTimeout = function(func, delay, ...args) {
  return originalSetTimeout(() => {
    enforceJapanese();
    if (typeof func === 'function') func.apply(this, args);
  }, delay);
};

window.setInterval = function(func, delay, ...args) {
  return originalSetInterval(() => {
    enforceJapanese();
    if (typeof func === 'function') func.apply(this, args);
  }, delay);
};

window.requestAnimationFrame = function(func) {
  return originalRequestAnimationFrame(() => {
    enforceJapanese();
    if (typeof func === 'function') func();
  });
};

// 即座に実行
enforceJapanese();

// 超高速監視開始
hyperSpeedEnforcement();

// デバッグ情報
console.log('☢️ 最終核爆弾システム完全稼働');
console.log('☢️ 0.5ms間隔監視システム起動');
console.log('☢️ 全翻訳関数を完全破壊');
console.log('☢️ MutationObserver最高感度で監視中');

// グローバル公開
window.enforceJapanese = enforceJapanese;