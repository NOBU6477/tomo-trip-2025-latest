/**
 * ドロップダウンメニュー専用翻訳スクリプト
 * 登録ドロップダウンの内容を英語に翻訳する
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ドロップダウン翻訳機能をロード');
  
  // 言語切り替えの状態を監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        // 英語モードかどうかを確認
        const langBtn = document.getElementById('languageDropdown');
        if (langBtn && langBtn.textContent.includes('English')) {
          console.log('英語モードを検出、ドロップダウンを翻訳');
          translateDropdownMenus();
        }
      }
    });
  });
  
  // 監視対象の設定
  const config = { 
    attributes: true, 
    childList: true, 
    characterData: true,
    subtree: true
  };
  
  // 監視開始
  const targetNode = document.body;
  observer.observe(targetNode, config);
  
  // 最初の翻訳を試行
  setTimeout(checkAndTranslate, 1000);
  
  /**
   * 英語モードなら翻訳を実行
   */
  function checkAndTranslate() {
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn && langBtn.textContent.includes('English')) {
      console.log('英語モードを検出、初期翻訳を実行');
      translateDropdownMenus();
    }
  }
  
  /**
   * ドロップダウンメニューの翻訳
   */
  function translateDropdownMenus() {
    // 登録ドロップダウンメニュー
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
      // 旅行者として登録
      if (item.textContent.includes('旅行者として登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = 'Register as Tourist';
        if (desc) desc.textContent = 'Experience unique trips with local guides';
      }
      // ガイドとして登録
      else if (item.textContent.includes('ガイドとして登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = 'Register as Guide';
        if (desc) desc.textContent = 'Share your knowledge and experience';
      }
    });
  }
});