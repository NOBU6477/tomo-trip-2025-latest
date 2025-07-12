/**
 * 究極の修正システム - すべての問題を一括解決
 * 1. ボタンテキスト修正
 * 2. スクロール修正
 * 3. 英語翻訳完全無効化
 */
(function() {
  'use strict';
  
  console.log('🚀 究極の修正システム起動中...');
  
  // 1. スクロール問題の完全解決
  function fixScrolling() {
    // body と html の overflow を強制的にクリア
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
    
    // modal-open クラスを削除
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    
    // 固定位置指定を削除
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    
    // 高さ制限を削除
    document.body.style.height = '';
    document.body.style.maxHeight = '';
    
    console.log('✅ スクロール修正完了');
  }
  
  // 2. ボタンテキストの完全修正
  function fixButtonText() {
    const signupButton = document.getElementById('signup-button-fixed');
    if (signupButton) {
      signupButton.textContent = '新規登録';
      signupButton.innerHTML = '新規登録';
      signupButton.innerText = '新規登録';
    }
    
    // 全てのボタンをチェック
    document.querySelectorAll('button, .btn').forEach(btn => {
      if (btn.textContent.includes('Sign Up')) {
        btn.textContent = '新規登録';
        btn.innerHTML = '新規登録';
        btn.innerText = '新規登録';
      }
      if (btn.textContent.includes('Login') && !btn.textContent.includes('ログイン')) {
        btn.textContent = 'ログイン';
        btn.innerHTML = 'ログイン';
        btn.innerText = 'ログイン';
      }
    });
    
    console.log('✅ ボタンテキスト修正完了');
  }
  
  // 3. 英語翻訳の完全無効化
  function disableEnglishTranslation() {
    // 全ての翻訳関数を無効化
    window.switchToEnglish = function() {
      console.log('🚫 英語翻訳は無効化されています');
      ultimateFix();
      return false;
    };
    
    window.translateToEnglish = function() {
      console.log('🚫 英語翻訳は無効化されています');
      ultimateFix();
      return false;
    };
    
    window.applyLanguage = function(lang) {
      if (lang === 'en') {
        console.log('🚫 英語適用は無効化されています');
        ultimateFix();
        return false;
      }
      return true;
    };
    
    // LocalStorageから英語設定を削除
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('language');
    localStorage.removeItem('lang');
    
    console.log('✅ 英語翻訳無効化完了');
  }
  
  // 4. 包括的な修正実行
  function ultimateFix() {
    fixScrolling();
    fixButtonText();
    disableEnglishTranslation();
  }
  
  // 5. 継続的な監視と修正
  function continuousMonitoring() {
    ultimateFix();
    
    // 高頻度で修正を実行
    setTimeout(continuousMonitoring, 100);
  }
  
  // 6. DOM監視
  const observer = new MutationObserver(() => {
    ultimateFix();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });
  
  // 7. 即座に実行
  ultimateFix();
  
  // 8. 継続監視開始
  continuousMonitoring();
  
  // 9. 全イベントでの修正
  ['DOMContentLoaded', 'load', 'resize', 'scroll', 'focus', 'blur'].forEach(event => {
    document.addEventListener(event, ultimateFix);
    window.addEventListener(event, ultimateFix);
  });
  
  console.log('🎯 究極の修正システム完全起動');
  
  // デバッグ用のグローバル関数
  window.ultimateFix = ultimateFix;
  window.debugUltimate = function() {
    console.log('=== 究極システムデバッグ ===');
    console.log('Body overflow:', document.body.style.overflow);
    console.log('HTML overflow:', document.documentElement.style.overflow);
    console.log('Sign up button text:', document.getElementById('signup-button-fixed')?.textContent);
    console.log('========================');
  };
  
})();