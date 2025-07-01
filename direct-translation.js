// 直接翻訳 - 最もシンプルで確実な方法
(function() {
  console.log('直接翻訳システム開始');
  
  function directTranslate() {
    const lang = localStorage.getItem('selectedLanguage') || localStorage.getItem('language');
    if (lang !== 'en') return;
    
    console.log('英語翻訳実行');
    
    // 「詳細を見る」ボタンを翻訳
    const detailButtons = document.querySelectorAll('a, button');
    detailButtons.forEach(btn => {
      if (btn.textContent.trim() === '詳細を見る') {
        btn.textContent = 'See Details';
        console.log('詳細を見るボタン翻訳');
      }
    });
    
    // 「70人のガイド」を翻訳
    const allTexts = document.querySelectorAll('*');
    allTexts.forEach(el => {
      if (el.children.length === 0) {
        const text = el.textContent.trim();
        if (text === '70人のガイドが見つかりました') {
          el.textContent = 'Found 70 guides';
          console.log('ガイドカウンター翻訳');
        }
        if (text.includes('人のガイドが見つかりました')) {
          el.textContent = text.replace(/(\d+)人のガイドが見つかりました/, 'Found $1 guides');
          console.log('動的ガイドカウンター翻訳');
        }
      }
    });
    
    // 新規登録ボタン翻訳
    const registerBtn = document.querySelector('button[onclick="showRegisterOptions()"]');
    if (registerBtn && registerBtn.textContent.includes('新規登録')) {
      registerBtn.textContent = 'Sign Up';
      console.log('新規登録ボタン翻訳');
    }
  }
  
  // 新規登録ボタン機能修復
  function fixRegister() {
    const btn = document.querySelector('button[onclick="showRegisterOptions()"]');
    if (btn) {
      btn.onclick = function() {
        console.log('新規登録クリック');
        const modal = document.getElementById('registerOptionsModal');
        if (modal && window.bootstrap) {
          new bootstrap.Modal(modal).show();
        }
      };
    }
  }
  
  // 言語切り替え
  function setupLanguage() {
    const enBtn = document.getElementById('lang-en');
    const jaBtn = document.getElementById('lang-ja');
    
    if (enBtn) {
      enBtn.addEventListener('click', function() {
        localStorage.setItem('selectedLanguage', 'en');
        setTimeout(directTranslate, 100);
        setTimeout(directTranslate, 500);
        setTimeout(directTranslate, 1000);
      });
    }
    
    if (jaBtn) {
      jaBtn.addEventListener('click', function() {
        localStorage.setItem('selectedLanguage', 'ja');
        location.reload();
      });
    }
  }
  
  // 即座実行
  directTranslate();
  fixRegister();
  setupLanguage();
  
  // 確実に実行するため複数回実行
  setTimeout(directTranslate, 500);
  setTimeout(directTranslate, 1500);
  setTimeout(directTranslate, 3000);
  setTimeout(fixRegister, 1000);
  
  // 動的監視
  const observer = new MutationObserver(function() {
    if ((localStorage.getItem('selectedLanguage') || localStorage.getItem('language')) === 'en') {
      setTimeout(directTranslate, 100);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  
})();

// グローバル関数
window.showRegisterOptions = function() {
  const modal = document.getElementById('registerOptionsModal');
  if (modal && window.bootstrap) {
    new bootstrap.Modal(modal).show();
  }
};

console.log('direct-translation.js 読み込み完了');