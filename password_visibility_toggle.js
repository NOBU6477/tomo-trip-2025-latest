/**
 * パスワード表示切替機能の実装
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('パスワード可視化トグルを初期化します');
  
  // すべてのパスワード入力欄にトグルボタンを追加
  setupPasswordVisibilityToggles();
  
  // モーダル表示時にもパスワード入力欄を検索
  document.addEventListener('shown.bs.modal', function() {
    console.log('モーダルが表示されました - パスワードフィールドを確認します');
    setupPasswordVisibilityToggles();
  });

  /**
   * パスワード表示切替ボタンのセットアップ
   */
  function setupPasswordVisibilityToggles() {
    // すべてのパスワード入力欄を取得
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    console.log('パスワード入力欄を検出:', passwordInputs.length, '個');
    
    passwordInputs.forEach(input => {
      // 既にトグルボタンが設定されている場合はスキップ
      if (input.dataset.hasToggle === 'true') {
        return;
      }
      
      // 親要素のdivを取得
      const parentDiv = input.parentElement;
      if (!parentDiv) return;
      
      // 親要素にposition: relativeを設定
      if (window.getComputedStyle(parentDiv).position === 'static') {
        parentDiv.style.position = 'relative';
      }
      
      // トグルボタンを作成
      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'btn btn-sm position-absolute password-toggle-btn';
      toggleButton.style.right = '10px';
      toggleButton.style.top = '50%';
      toggleButton.style.transform = 'translateY(-50%)';
      toggleButton.style.backgroundColor = 'transparent';
      toggleButton.style.border = 'none';
      toggleButton.style.padding = '0.25rem';
      toggleButton.style.zIndex = '5';
      
      // Bootstrap Iconsを優先的に使用
      toggleButton.innerHTML = '<i class="bi bi-eye"></i>';
      toggleButton.style.fontSize = '16px';
      
      // トグルボタンをパスワード入力欄の親要素に追加
      parentDiv.appendChild(toggleButton);
      
      // パスワード表示の切り替えイベント
      toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (input.type === 'password') {
          input.type = 'text';
          toggleButton.innerHTML = '<i class="bi bi-eye-slash"></i>';
        } else {
          input.type = 'password';
          toggleButton.innerHTML = '<i class="bi bi-eye"></i>';
        }
      });
      
      // 入力欄のスタイルを調整して右側にスペースを確保
      input.style.paddingRight = '40px';
      
      // このパスワード入力欄にはトグルボタンが設定済み
      input.dataset.hasToggle = 'true';
      
      console.log('パスワードトグルボタンを追加:', input.id || 'ID未設定');
    });
  }
});