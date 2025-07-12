/**
 * 緊急ボタン修正システム
 * 右上の「Sign Up」ボタンを「新規登録」に強制変更
 */

(function() {
  'use strict';

  console.log('緊急ボタン修正開始');

  function emergencyButtonFix() {
    // 1. 全てのSign Upテキストを新規登録に変更
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      // テキストコンテンツをチェック
      if (element.textContent && element.textContent.trim() === 'Sign Up') {
        console.log('Sign Upボタンを発見:', element);
        element.textContent = '新規登録';
        element.innerHTML = '新規登録';
        
        // クリックイベントも設定
        if (element.tagName === 'BUTTON' || element.tagName === 'A') {
          element.onclick = function(e) {
            e.preventDefault();
            if (typeof showRegisterOptions === 'function') {
              showRegisterOptions();
            }
          };
        }
      }
      
      // 子要素のテキストノードもチェック
      if (element.childNodes) {
        element.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Sign Up') {
            console.log('Sign Upテキストノードを修正:', node);
            node.textContent = '新規登録';
          }
        });
      }
    });

    // 2. 右上エリアの強制作成
    const existingTopButtons = document.querySelector('.top-right-buttons');
    if (!existingTopButtons) {
      const topButtons = document.createElement('div');
      topButtons.className = 'top-right-buttons';
      topButtons.style.cssText = `
        position: fixed;
        top: 10px;
        right: 20px;
        z-index: 9999;
        display: flex;
        gap: 10px;
        align-items: center;
      `;
      
      topButtons.innerHTML = `
        <a href="#" class="top-login-btn" data-bs-toggle="modal" data-bs-target="#loginModal" style="
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          text-decoration: none;
          font-size: 14px;
        ">ログイン</a>
        <button class="top-signup-btn" onclick="showRegisterOptions()" style="
          background: #4287f5;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        ">新規登録</button>
      `;
      
      document.body.appendChild(topButtons);
      console.log('右上ボタンエリアを強制作成');
    }

    // 3. 特定の問題のある要素を直接修正
    const problemButtons = document.querySelectorAll('button, a, .btn');
    problemButtons.forEach(btn => {
      const text = btn.textContent.trim();
      if (text === 'Sign Up' || text.includes('Sign Up')) {
        btn.textContent = '新規登録';
        btn.innerHTML = '新規登録';
        console.log('問題ボタンを修正:', btn);
      }
    });

    // 4. CSSで隠れているSign Upを強制表示変更
    const style = document.createElement('style');
    style.textContent = `
      /* Sign Upテキストを持つ要素を強制的に新規登録に変更 */
      *[data-original-text="Sign Up"]::after,
      *:contains("Sign Up")::after {
        content: "新規登録" !important;
      }
      
      /* 既存のSign Upボタンを隠して新しいボタンを表示 */
      button:contains("Sign Up"),
      a:contains("Sign Up"),
      .btn:contains("Sign Up") {
        display: none !important;
      }
      
      /* 右上ボタンエリアの強制表示 */
      .top-right-buttons {
        display: flex !important;
        position: fixed !important;
        top: 10px !important;
        right: 20px !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 即座に実行
  emergencyButtonFix();

  // DOM変更監視
  const observer = new MutationObserver(function(mutations) {
    let hasSignUp = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.textContent && node.textContent.includes('Sign Up')) {
              hasSignUp = true;
            }
          }
        });
      } else if (mutation.type === 'characterData') {
        if (mutation.target.textContent.includes('Sign Up')) {
          hasSignUp = true;
        }
      }
    });
    
    if (hasSignUp) {
      console.log('Sign Up要素を検出、修正実行');
      emergencyButtonFix();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 定期実行
  setInterval(emergencyButtonFix, 2000);

  // ページ読み込み完了後
  document.addEventListener('DOMContentLoaded', emergencyButtonFix);
  window.addEventListener('load', emergencyButtonFix);

  console.log('緊急ボタン修正システム完了');
})();