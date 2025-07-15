/**
 * DOM ハイジャック防止システム
 * 他のスクリプトによる動的要素生成を完全に阻止
 */

(function() {
  'use strict';
  
  console.log('🛡️ DOM ハイジャック防止システム開始');
  
  // getElementById の完全ハイジャック
  const originalGetElementById = document.getElementById;
  document.getElementById = function(id) {
    // 問題のあるID要求をブロック
    if (id === 'languageDropdown' || id === 'registerDropdown') {
      console.log(`🚫 問題のある要素ID "${id}" の取得をブロック`);
      return null; // 要素が存在しないとして返す
    }
    return originalGetElementById.call(document, id);
  };
  
  // querySelector/querySelectorAll の部分的ハイジャック
  const originalQuerySelector = document.querySelector;
  const originalQuerySelectorAll = document.querySelectorAll;
  
  document.querySelector = function(selector) {
    if (selector.includes('dropdown-toggle') || selector.includes('#languageDropdown') || selector.includes('#registerDropdown')) {
      console.log(`🚫 問題のあるセレクター "${selector}" の取得をブロック`);
      return null;
    }
    return originalQuerySelector.call(document, selector);
  };
  
  document.querySelectorAll = function(selector) {
    if (selector.includes('dropdown-toggle') || selector.includes('#languageDropdown') || selector.includes('#registerDropdown')) {
      console.log(`🚫 問題のあるセレクター "${selector}" の取得をブロック`);
      return [];
    }
    return originalQuerySelectorAll.call(document, selector);
  };
  
  // createElement のハイジャック（ドロップダウン要素の生成を阻止）
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    // 新しく作成された要素を監視
    const originalSetAttribute = element.setAttribute;
    element.setAttribute = function(name, value) {
      if (name === 'id' && (value === 'languageDropdown' || value === 'registerDropdown')) {
        console.log(`🚫 問題のあるID "${value}" の設定をブロック`);
        return; // 設定をブロック
      }
      if (name === 'class' && value.includes('dropdown-toggle')) {
        console.log(`🚫 dropdown-toggle クラスの設定をブロック`);
        return; // 設定をブロック
      }
      return originalSetAttribute.call(this, name, value);
    };
    
    return element;
  };
  
  // appendChild/insertBefore のハイジャック（問題要素の挿入を阻止）
  const originalAppendChild = Element.prototype.appendChild;
  const originalInsertBefore = Element.prototype.insertBefore;
  
  Element.prototype.appendChild = function(child) {
    if (child && child.nodeType === Node.ELEMENT_NODE) {
      // ドロップダウン関連要素の挿入をブロック
      if (child.classList && (child.classList.contains('dropdown-toggle') || child.classList.contains('dropdown-menu'))) {
        console.log('🚫 ドロップダウン要素の挿入をブロック');
        return child; // 挿入せずに要素を返す
      }
      if (child.id === 'languageDropdown' || child.id === 'registerDropdown') {
        console.log('🚫 問題のあるID要素の挿入をブロック');
        return child;
      }
    }
    return originalAppendChild.call(this, child);
  };
  
  Element.prototype.insertBefore = function(newNode, referenceNode) {
    if (newNode && newNode.nodeType === Node.ELEMENT_NODE) {
      if (newNode.classList && (newNode.classList.contains('dropdown-toggle') || newNode.classList.contains('dropdown-menu'))) {
        console.log('🚫 ドロップダウン要素の挿入をブロック');
        return newNode;
      }
      if (newNode.id === 'languageDropdown' || newNode.id === 'registerDropdown') {
        console.log('🚫 問題のあるID要素の挿入をブロック');
        return newNode;
      }
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
  
  // innerHTML の監視（動的HTML挿入を監視）
  const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
  Object.defineProperty(Element.prototype, 'innerHTML', {
    set: function(value) {
      if (typeof value === 'string') {
        // 問題のあるHTML挿入をブロック
        if (value.includes('dropdown-toggle') || value.includes('languageDropdown') || value.includes('registerDropdown')) {
          console.log('🚫 問題のあるHTML挿入をブロック');
          return; // 設定をブロック
        }
      }
      return originalInnerHTMLSetter.call(this, value);
    },
    get: function() {
      return Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').get.call(this);
    }
  });
  
  // ボタンテキストの変更を監視・阻止
  const originalTextContentSetter = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').set;
  Object.defineProperty(Node.prototype, 'textContent', {
    set: function(value) {
      // 新規登録ボタンのテキストを英語に変更しようとする試みをブロック
      if (this.parentElement && this.parentElement.tagName === 'BUTTON') {
        if (value === 'Sign Up' || value === 'Register') {
          console.log('🚫 ボタンテキストの英語変更をブロック:', value);
          return originalTextContentSetter.call(this, '新規登録');
        }
        if (value === 'Login' || value === 'Sign In') {
          console.log('🚫 ボタンテキストの英語変更をブロック:', value);
          return originalTextContentSetter.call(this, 'ログイン');
        }
      }
      return originalTextContentSetter.call(this, value);
    },
    get: function() {
      return Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').get.call(this);
    }
  });
  
  console.log('🛡️ DOM ハイジャック防止システム完全起動');
  
})();