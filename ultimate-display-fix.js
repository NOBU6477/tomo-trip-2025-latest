/**
 * 究極表示修正システム
 * 右上ボタンと全ての表示を強制的に日本語に修正
 */

(function() {
  'use strict';
  
  console.log('究極表示修正システム開始');

  function ultimateDisplayFix() {
    // 1. 右上エリアの強制作成と表示
    let topButtons = document.querySelector('.top-right-buttons');
    if (!topButtons) {
      topButtons = document.createElement('div');
      topButtons.className = 'top-right-buttons';
      document.body.appendChild(topButtons);
    }
    
    // 強制スタイル適用
    topButtons.style.cssText = `
      position: fixed !important;
      top: 10px !important;
      right: 20px !important;
      z-index: 99999 !important;
      display: flex !important;
      gap: 10px !important;
      align-items: center !important;
      background: rgba(0, 0, 0, 0.1) !important;
      padding: 5px !important;
      border-radius: 25px !important;
      backdrop-filter: blur(10px) !important;
    `;
    
    // 強制的に日本語ボタンを挿入
    topButtons.innerHTML = `
      <a href="#" style="
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: white !important;
        padding: 8px 16px !important;
        border-radius: 20px !important;
        text-decoration: none !important;
        font-size: 14px !important;
      " data-bs-toggle="modal" data-bs-target="#loginModal">ログイン</a>
      <button style="
        background: #4287f5 !important;
        border: none !important;
        color: white !important;
        padding: 8px 16px !important;
        border-radius: 20px !important;
        font-size: 14px !important;
        cursor: pointer !important;
        font-weight: 500 !important;
      " onclick="showRegisterOptions()">新規登録</button>
    `;

    // 2. 全ページのSign Upテキストを検索・変更
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    const nodesToChange = [];
    while (node = walker.nextNode()) {
      if (node.textContent.includes('Sign Up')) {
        nodesToChange.push(node);
      }
    }

    nodesToChange.forEach(textNode => {
      textNode.textContent = textNode.textContent.replace(/Sign Up/g, '新規登録');
      console.log('テキストノード修正:', textNode.textContent);
    });

    // 3. 全ボタン要素の強制修正
    const allButtons = document.querySelectorAll('button, a, .btn, input[type="button"], input[type="submit"]');
    allButtons.forEach(btn => {
      const text = btn.textContent.trim();
      if (text === 'Sign Up' || text.includes('Sign Up')) {
        btn.textContent = '新規登録';
        btn.innerHTML = '新規登録';
        console.log('ボタン要素修正:', btn);
        
        // クリックイベント設定
        btn.onclick = function(e) {
          e.preventDefault();
          if (typeof showRegisterOptions === 'function') {
            showRegisterOptions();
          }
        };
      }
    });

    // 4. value属性も修正
    const elementsWithValue = document.querySelectorAll('[value*="Sign Up"]');
    elementsWithValue.forEach(element => {
      element.value = element.value.replace(/Sign Up/g, '新規登録');
    });

    // 5. data属性も修正
    const elementsWithDataAttrs = document.querySelectorAll('[data-*]');
    elementsWithDataAttrs.forEach(element => {
      Array.from(element.attributes).forEach(attr => {
        if (attr.value.includes('Sign Up')) {
          attr.value = attr.value.replace(/Sign Up/g, '新規登録');
        }
      });
    });

    // 6. CSSコンテンツも修正
    const style = document.createElement('style');
    style.textContent = `
      /* 右上ボタンの強制表示 */
      .top-right-buttons {
        position: fixed !important;
        top: 10px !important;
        right: 20px !important;
        z-index: 99999 !important;
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Sign Upを含む要素を隠して新規登録を表示 */
      *:contains("Sign Up") {
        color: transparent !important;
      }
      
      *:contains("Sign Up")::after {
        content: "新規登録" !important;
        color: white !important;
        position: absolute;
      }
      
      /* Replitエディタ上部のSign Upボタンも隠す */
      button[data-testid*="sign"], 
      a[href*="sign"], 
      .auth-button,
      [class*="sign-up"],
      [id*="sign-up"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    console.log('究極表示修正完了');
  }

  // 即座に実行
  ultimateDisplayFix();

  // 継続監視
  const observer = new MutationObserver(function(mutations) {
    let needsFix = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.textContent && node.textContent.includes('Sign Up')) {
              needsFix = true;
            }
          }
        });
      }
    });
    
    if (needsFix) {
      setTimeout(ultimateDisplayFix, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 定期実行
  setInterval(ultimateDisplayFix, 3000);

  // イベント監視
  document.addEventListener('DOMContentLoaded', ultimateDisplayFix);
  window.addEventListener('load', ultimateDisplayFix);
  window.addEventListener('focus', ultimateDisplayFix);

  console.log('究極表示修正システム完了');
})();