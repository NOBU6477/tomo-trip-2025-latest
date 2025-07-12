/**
 * 絶対確実ボタン修正システム - 最終手段
 */
(function() {
  'use strict';
  
  console.log('🛡️ 絶対確実ボタン修正システム起動');
  
  // 元のボタンを完全に置き換える
  function replaceSignUpButton() {
    const signupBtn = document.getElementById('signup-button-fixed');
    if (signupBtn) {
      // 新しいボタン要素を作成
      const newBtn = document.createElement('button');
      newBtn.className = 'btn btn-light';
      newBtn.id = 'signup-button-fixed';
      newBtn.setAttribute('onclick', 'showRegisterOptions()');
      newBtn.textContent = '新規登録';
      newBtn.innerHTML = '新規登録';
      
      // 元のボタンと置き換え
      signupBtn.parentNode.replaceChild(newBtn, signupBtn);
      console.log('✅ ボタン完全置換完了');
    }
  }
  
  // 強制的にテキストを書き換える
  function forceJapaneseText() {
    // セレクタを使って特定
    const buttons = document.querySelectorAll('#navbar-user-area button, button[onclick*="showRegisterOptions"]');
    buttons.forEach(btn => {
      if (btn.textContent.includes('Sign Up') || btn.textContent.trim() === 'Sign Up') {
        // 複数の方法で強制変更
        btn.textContent = '新規登録';
        btn.innerHTML = '新規登録';
        btn.innerText = '新規登録';
        
        // 属性も設定
        btn.setAttribute('data-original-text', '新規登録');
        
        console.log('🔥 強制テキスト変更実行');
      }
    });
  }
  
  // 連続実行
  function continuousExecution() {
    replaceSignUpButton();
    forceJapaneseText();
    
    // 即座に次回実行をスケジュール
    setTimeout(continuousExecution, 1);
    requestAnimationFrame(continuousExecution);
  }
  
  // 即座に開始
  continuousExecution();
  
  // MutationObserver
  const observer = new MutationObserver(() => {
    replaceSignUpButton();
    forceJapaneseText();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  });
  
  console.log('✅ 絶対確実システム完了');
})();