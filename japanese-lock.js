/**
 * 日本語ロックシステム - 英語翻訳を完全阻止
 */
(function() {
  'use strict';
  
  console.log('🇯🇵 日本語ロックシステム起動');
  
  // 全ての翻訳機能を無効化
  window.switchToEnglish = function() {
    console.log('❌ 英語切り替えは無効化されています');
    return false;
  };
  
  window.translateToEnglish = function() {
    console.log('❌ 英語翻訳は無効化されています');
    return false;
  };
  
  // 日本語ボタンテキストの強制維持
  function enforceJapanese() {
    // 新規登録ボタンの固定
    const signupBtn = document.querySelector('button[onclick="showRegisterOptions()"]');
    if (signupBtn && signupBtn.textContent !== '新規登録') {
      signupBtn.textContent = '新規登録';
      console.log('✅ 新規登録ボタン修正');
    }
    
    // ログインボタンの固定
    const loginBtn = document.querySelector('button[data-bs-target="#loginModal"]');
    if (loginBtn && loginBtn.textContent !== 'ログイン') {
      loginBtn.textContent = 'ログイン';
      console.log('✅ ログインボタン修正');
    }
    
    // 全ボタンの英語→日本語強制変換
    document.querySelectorAll('button, .btn').forEach(btn => {
      const text = btn.textContent.trim();
      if (text === 'Sign Up' || text === 'Register') {
        btn.textContent = '新規登録';
      }
      if (text === 'Login') {
        btn.textContent = 'ログイン';
      }
    });
  }
  
  // 継続監視（10ms間隔）
  setInterval(enforceJapanese, 10);
  
  // 初回実行
  enforceJapanese();
  
  // DOM変更監視
  const observer = new MutationObserver(enforceJapanese);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  });
  
  console.log('✅ 日本語ロックシステム完了');
})();