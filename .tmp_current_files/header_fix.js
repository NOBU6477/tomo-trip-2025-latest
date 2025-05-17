// ヘッダーとナビゲーションを修正
document.addEventListener('DOMContentLoaded', function() {
  console.log('ヘッダー修正スクリプト実行');
  
  // 既存の新規登録ボタンを削除（位置が間違っている可能性があるため）
  document.querySelectorAll('.btn-warning').forEach(function(btn) {
    if (btn.textContent.includes('新規登録') && btn.classList.contains('nav-link')) {
      btn.remove();
    }
  });
  
  // ナビゲーションバーを探索
  const navLinks = document.querySelector('.navbar-nav');
  if (navLinks) {
    // 言語切替ボタンより前に新規登録ボタンを配置
    const langSelector = document.querySelector('.dropdown-language');
    
    // 新規登録ボタンを作成
    const registerLink = document.createElement('li');
    registerLink.className = 'nav-item';
    
    const registerBtn = document.createElement('a');
    registerBtn.href = '#';
    registerBtn.className = 'nav-link btn btn-warning text-white';
    registerBtn.textContent = '新規登録';
    registerBtn.onclick = function(e) {
      e.preventDefault();
      
      // 既存モーダルをクリア
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      });
      
      document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      });
      
      // ユーザータイプモーダルを表示
      const userTypeModal = document.getElementById('userTypeModal');
      if (userTypeModal) {
        // バックドロップを設定
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.style.opacity = '0.25';
        document.body.appendChild(backdrop);
        
        // モーダル表示
        userTypeModal.classList.add('show');
        userTypeModal.style.display = 'block';
        userTypeModal.setAttribute('aria-modal', 'true');
        userTypeModal.removeAttribute('aria-hidden');
        
        document.body.classList.add('modal-open');
      }
      
      return false;
    };
    
    registerLink.appendChild(registerBtn);
    
    if (langSelector) {
      // 言語切替の前に挿入
      navLinks.insertBefore(registerLink, langSelector);
    } else {
      // 言語切替が見つからない場合は最後に追加
      navLinks.appendChild(registerLink);
    }
    
    console.log('新規登録ボタンをナビゲーションに配置しました');
  }
});
