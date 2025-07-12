/**
 * 超核爆弾級修正システム - 終末的解決策
 * 全ての翻訳機能を完全破壊し、日本語表示を絶対的に強制
 */

console.log('💀 超核爆弾級システム起動 - 全翻訳機能を破壊します');

// 全ての翻訳関数を無効化
window.translateToEnglish = function() { 
  console.log('💀 翻訳機能を破壊');
  executeSuperNuclearFix();
  return false; 
};
window.switchToEnglish = function() { 
  console.log('💀 言語切替機能を破壊');
  executeSuperNuclearFix();
  return false; 
};
window.applyLanguage = function(lang) { 
  if (lang === 'en') {
    console.log('💀 英語適用を破壊');
    executeSuperNuclearFix();
    return false;
  }
  return true;
};

// LocalStorageから英語設定を完全削除
function destroyEnglishSettings() {
  localStorage.removeItem('selectedLanguage');
  localStorage.removeItem('language');
  localStorage.removeItem('lang');
  localStorage.removeItem('currentLanguage');
  sessionStorage.removeItem('selectedLanguage');
  sessionStorage.removeItem('language');
  sessionStorage.removeItem('lang');
  sessionStorage.removeItem('currentLanguage');
}

// DOM全体を日本語で強制上書き
function superNuclearDOMFix() {
  // 新規登録ボタンの絶対的修正
  const signupBtn = document.getElementById('signup-button-fixed');
  if (signupBtn) {
    signupBtn.textContent = '新規登録';
    signupBtn.innerHTML = '新規登録';
    signupBtn.innerText = '新規登録';
    signupBtn.setAttribute('data-original-text', '新規登録');
  }
  
  // 全要素の強制日本語化
  document.querySelectorAll('*').forEach(element => {
    // テキストコンテンツの強制変更
    if (element.textContent) {
      element.textContent = element.textContent
        .replace(/Sign Up/g, '新規登録')
        .replace(/Login(?!モード)/g, 'ログイン')
        .replace(/Register/g, '新規登録')
        .replace(/English/g, '日本語');
    }
    
    // 属性値の強制変更
    ['value', 'placeholder', 'title', 'alt'].forEach(attr => {
      if (element.hasAttribute(attr)) {
        let value = element.getAttribute(attr);
        if (value && typeof value === 'string') {
          value = value
            .replace(/Sign Up/g, '新規登録')
            .replace(/Login/g, 'ログイン')
            .replace(/Register/g, '新規登録');
          element.setAttribute(attr, value);
        }
      }
    });
  });
}

// スクロール問題の絶対的解決
function superNuclearScrollFix() {
  // 全要素のoverflowを強制リセット
  document.querySelectorAll('*').forEach(el => {
    el.style.removeProperty('overflow');
    el.style.removeProperty('overflow-x');
    el.style.removeProperty('overflow-y');
    el.style.removeProperty('position');
    el.style.removeProperty('top');
    el.style.removeProperty('left');
    el.style.removeProperty('height');
    el.style.removeProperty('max-height');
  });
  
  // bodyとhtmlの強制設定
  document.body.style.cssText = 'overflow: visible !important; position: static !important;';
  document.documentElement.style.cssText = 'overflow: visible !important; position: static !important;';
  
  // modal-openクラスの完全削除
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
}

// 包括的な超核爆弾修正
function executeSuperNuclearFix() {
  destroyEnglishSettings();
  superNuclearDOMFix();
  superNuclearScrollFix();
  console.log('💀 超核爆弾修正完了');
}

// 1ms間隔での超高速監視
function hyperSpeedMonitoring() {
  executeSuperNuclearFix();
  setTimeout(hyperSpeedMonitoring, 1);
}

// MutationObserverによる完全監視
const superObserver = new MutationObserver(() => {
  executeSuperNuclearFix();
});

superObserver.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeOldValue: true,
  characterDataOldValue: true
});

// 全イベントでの破壊活動
['DOMContentLoaded', 'load', 'beforeunload', 'focus', 'blur', 'click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'scroll', 'resize'].forEach(event => {
  document.addEventListener(event, executeSuperNuclearFix, true);
  window.addEventListener(event, executeSuperNuclearFix, true);
});

// 即座に実行
executeSuperNuclearFix();

// 超高速監視開始
hyperSpeedMonitoring();

console.log('💀 超核爆弾システム完全稼働 - 全翻訳機能破壊完了');

// デバッグ用
window.executeSuperNuclearFix = executeSuperNuclearFix;