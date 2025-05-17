// 言語選択ドロップダウンの修正
document.addEventListener('DOMContentLoaded', function() {
  console.log('言語ドロップダウン修正スクリプトを実行します');
  
  // 言語選択ボタンを取得
  const langBtn = document.querySelector('.dropdown-toggle[aria-label="言語選択"]');
  if (langBtn) {
    console.log('言語選択ボタンを見つけました');
    
    // 既存のイベントを削除
    const newBtn = langBtn.cloneNode(true);
    if (langBtn.parentNode) {
      langBtn.parentNode.replaceChild(newBtn, langBtn);
    }
    
    // 新しいイベントを設定
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('言語選択ボタンがクリックされました');
      
      // ドロップダウンメニューを表示
      const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="languageDropdown"]');
      if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
      }
    });
  }
});
