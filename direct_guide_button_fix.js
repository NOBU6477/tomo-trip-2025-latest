/**
 * ガイド登録ボタンの重大な問題を緊急修正するスクリプト
 * ガイドとして登録ボタンとガイドになるボタンのイベント競合の問題を解決
 */
(function() {
  // ページ読み込み時に実行
  window.addEventListener('load', function() {
    console.log("緊急ガイドボタン修正を適用");
    
    // ユーザータイプモーダル内のガイド選択ボタン修正
    const selectGuideBtn = document.getElementById('select-guide-btn');
    if (selectGuideBtn) {
      console.log("ガイド選択ボタンを発見 - 緊急修正を適用");
      
      // 既存のイベントリスナーをクリア
      const newSelectGuideBtn = selectGuideBtn.cloneNode(true);
      selectGuideBtn.parentNode.replaceChild(newSelectGuideBtn, selectGuideBtn);
      
      // 新しいイベントリスナーを設定
      newSelectGuideBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("緊急修正: ガイドとして登録ボタンがクリックされました");
        
        try {
          // 全てのモーダルを閉じる
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
          });
          
          // 全てのバックドロップを削除
          document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          });
          
          // bodyスタイルをリセット
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          
          // 少し待ってからガイド登録モーダルを表示
          setTimeout(function() {
            // バックドロップを作成
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.style.opacity = '0.25';
            document.body.appendChild(backdrop);
            
            // ガイド登録モーダルを表示
            const guideModal = document.getElementById('guideRegisterModal');
            if (guideModal) {
              guideModal.classList.add('show');
              guideModal.style.display = 'block';
              guideModal.style.background = 'none';
              guideModal.setAttribute('aria-modal', 'true');
              guideModal.removeAttribute('aria-hidden');
              
              // bodyスタイルを設定
              document.body.classList.add('modal-open');
              
              console.log("緊急修正: ガイド登録モーダルを表示しました");
            } else {
              console.error("緊急修正: ガイド登録モーダルが見つかりません");
            }
          }, 300);
        } catch (err) {
          console.error("緊急修正: エラーが発生しました", err);
        }
        
        return false;
      });
    }
    
    // ヒーローセクションのガイドになるボタン修正
    const becomeGuideBtn = document.getElementById('become-guide-btn');
    if (becomeGuideBtn) {
      console.log("ガイドになるボタンを発見 - 緊急修正を適用");
      
      // 既存のイベントリスナーをクリア
      const newBecomeGuideBtn = becomeGuideBtn.cloneNode(true);
      becomeGuideBtn.parentNode.replaceChild(newBecomeGuideBtn, becomeGuideBtn);
      
      // 新しいイベントリスナーを設定
      newBecomeGuideBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("緊急修正: ガイドになるボタンがクリックされました");
        
        try {
          // 全てのモーダルを閉じる
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
          });
          
          // 全てのバックドロップを削除
          document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          });
          
          // bodyスタイルをリセット
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          
          // 少し待ってから適切なモーダルを表示
          setTimeout(function() {
            // ログイン状態を確認
            const isLoggedIn = false; // 現状ではログインなしを仮定
            const targetModalId = isLoggedIn ? 'guideRegisterModal' : 'userTypeModal';
            
            // バックドロップを作成
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.style.opacity = '0.25';
            document.body.appendChild(backdrop);
            
            // モーダルを表示
            const modal = document.getElementById(targetModalId);
            if (modal) {
              modal.classList.add('show');
              modal.style.display = 'block';
              modal.style.background = 'none';
              modal.setAttribute('aria-modal', 'true');
              modal.removeAttribute('aria-hidden');
              
              // bodyスタイルを設定
              document.body.classList.add('modal-open');
              
              // ユーザータイプモーダルの場合、ガイドボタンにフォーカス
              if (targetModalId === 'userTypeModal') {
                setTimeout(function() {
                  const guideBtn = document.getElementById('select-guide-btn');
                  if (guideBtn) guideBtn.focus();
                }, 500);
              }
              
              console.log("緊急修正: モーダルを表示しました", targetModalId);
            } else {
              console.error("緊急修正: モーダルが見つかりません", targetModalId);
            }
          }, 300);
        } catch (err) {
          console.error("緊急修正: エラーが発生しました", err);
        }
        
        return false;
      });
    }
    
    // ナビゲーション内の新規登録ボタンを修正
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
      // 既存のイベントリスナーをクリア
      const newRegisterBtn = registerBtn.cloneNode(true);
      registerBtn.parentNode.replaceChild(newRegisterBtn, registerBtn);
      
      // 新しいイベントリスナーを設定
      newRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("緊急修正: 新規登録ボタンがクリックされました");
        
        try {
          // 全てのモーダルを閉じる
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          });
          
          // 全てのバックドロップを削除
          document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
            if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
          });
          
          // 少し待ってからユーザータイプモーダルを表示
          setTimeout(function() {
            // バックドロップを作成
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.style.opacity = '0.25';
            document.body.appendChild(backdrop);
            
            // ユーザータイプモーダルを表示
            const userTypeModal = document.getElementById('userTypeModal');
            if (userTypeModal) {
              userTypeModal.classList.add('show');
              userTypeModal.style.display = 'block';
              userTypeModal.style.background = 'none';
              userTypeModal.setAttribute('aria-modal', 'true');
              userTypeModal.removeAttribute('aria-hidden');
              
              // bodyスタイルを設定
              document.body.classList.add('modal-open');
              
              console.log("緊急修正: ユーザータイプモーダルを表示しました");
            }
          }, 300);
        } catch (err) {
          console.error("緊急修正: エラーが発生しました", err);
        }
        
        return false;
      });
    }
  });
})();