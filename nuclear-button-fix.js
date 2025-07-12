/**
 * 核レベル新規登録ボタン修正システム
 * 「投資営業」表示を完全に阻止し「新規登録」を強制表示
 */

(function() {
  'use strict';

  console.log('核レベル新規登録ボタン修正開始');

  // 核レベルボタン修正
  function nuclearButtonFix() {
    // 1. HTMLを直接書き換え
    const navbarUserArea = document.getElementById('navbar-user-area');
    if (navbarUserArea) {
      navbarUserArea.innerHTML = `
        <button class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">ログイン</button>
        <button class="btn btn-light" onclick="showRegisterOptions()" id="main-register-btn">新規登録</button>
      `;
    }

    // 2. 全てのボタンの文字列を強制変更
    const allButtons = document.querySelectorAll('button, .btn');
    allButtons.forEach(button => {
      const text = button.textContent.trim();
      
      // 問題のあるテキストを全て修正
      if (text === '投資営業' || 
          text.includes('投資営業') ||
          text === 'Sign Up' ||
          text.includes('Sign Up') ||
          text === 'Register' ||
          text.includes('Register')) {
        
        console.log('ボタンテキスト強制修正:', text, '→ 新規登録');
        button.textContent = '新規登録';
        button.innerHTML = '新規登録';
        
        // イベントも再設定
        button.onclick = function(e) {
          e.preventDefault();
          showRegisterOptions();
        };
      }

      // ナビゲーションエリアの2番目のボタンを特別処理
      if (button.closest('#navbar-user-area') && 
          button.classList.contains('btn-light') &&
          !button.textContent.includes('新規登録')) {
        
        console.log('ナビゲーション新規登録ボタン強制修正');
        button.textContent = '新規登録';
        button.innerHTML = '新規登録';
        button.onclick = function(e) {
          e.preventDefault();
          showRegisterOptions();
        };
      }
    });

    // 3. テキストノードも直接変更
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    const textNodesToChange = [];
    while (node = walker.nextNode()) {
      if (node.textContent.includes('投資営業')) {
        textNodesToChange.push(node);
      }
    }

    textNodesToChange.forEach(textNode => {
      textNode.textContent = textNode.textContent.replace(/投資営業/g, '新規登録');
    });

    // 4. 属性値も変更
    const elementsWithBadValues = document.querySelectorAll('[value*="投資営業"], [data-*="投資営業"], [title*="投資営業"]');
    elementsWithBadValues.forEach(element => {
      if (element.value && element.value.includes('投資営業')) {
        element.value = element.value.replace(/投資営業/g, '新規登録');
      }
      if (element.title && element.title.includes('投資営業')) {
        element.title = element.title.replace(/投資営業/g, '新規登録');
      }
    });

    console.log('核レベルボタン修正完了');
  }

  // DOM変更を強制監視
  function nuclearObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              setTimeout(nuclearButtonFix, 10);
            }
          });
        } else if (mutation.type === 'characterData') {
          if (mutation.target.textContent.includes('投資営業')) {
            mutation.target.textContent = mutation.target.textContent.replace(/投資営業/g, '新規登録');
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  }

  // 即座に実行
  nuclearButtonFix();
  nuclearObserver();

  // DOM読み込み後
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', nuclearButtonFix);
  }

  // 制御された監視（無限ループ防止）
  let fixCount = 0;
  const controlledInterval = setInterval(function() {
    fixCount++;
    nuclearButtonFix();
    if (fixCount > 20) { // 20回実行後に停止
      clearInterval(controlledInterval);
      console.log('核レベルボタン修正を停止（無限ループ防止）');
    }
  }, 1000); // 1秒間隔に変更

  // ウィンドウフォーカス時
  window.addEventListener('focus', nuclearButtonFix);

  // ページ表示時
  window.addEventListener('pageshow', nuclearButtonFix);

  console.log('核レベル新規登録ボタン修正システム完了');
})();