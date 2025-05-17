/**
 * ログインモーダルのユーザータイプ選択問題を修正するスクリプト
 * 観光客オプションが表示されない問題を解決します
 */

(function() {
  console.log('ログインモーダル修正スクリプトを実行します...');
  
  // DOMが完全に読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', fixLoginModal);
  
  // モーダルが開かれるたびに実行
  document.body.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'loginModal') {
      console.log('ログインモーダルが開かれました - 修正を適用します');
      fixLoginModal();
    }
  });
  
  // 即時実行（既にDOMが読み込まれている場合）
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    fixLoginModal();
  }
  
  // 定期的なチェック（念のため）
  setInterval(fixLoginModal, 1000);
  
  // ログインモーダルを修正する関数
  function fixLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    
    console.log('ログインモーダルを修正しています...');
    
    // 1. ユーザータイプのラジオボタンを確認・修正
    const touristRadio = document.getElementById('login-user-tourist');
    const guideRadio = document.getElementById('login-user-guide');
    
    if (touristRadio && guideRadio) {
      console.log('ユーザータイプのラジオボタンを発見しました');
      
      // ラジオボタンのラベル要素を取得
      const touristLabel = document.querySelector('label[for="login-user-tourist"]');
      const guideLabel = document.querySelector('label[for="login-user-guide"]');
      
      if (touristLabel && guideLabel) {
        console.log('ラジオボタンのラベルを発見しました');
        
        // 表示スタイルを強制的に修正
        touristLabel.style.display = 'inline-flex';
        touristLabel.style.visibility = 'visible';
        touristLabel.style.opacity = '1';
        touristLabel.style.width = '50%';
        touristLabel.style.height = 'auto';
        touristLabel.style.position = 'relative';
        touristLabel.style.pointerEvents = 'auto';
        
        guideLabel.style.display = 'inline-flex';
        guideLabel.style.visibility = 'visible';
        guideLabel.style.opacity = '1';
        guideLabel.style.width = '50%';
        guideLabel.style.height = 'auto';
        guideLabel.style.position = 'relative';
        guideLabel.style.pointerEvents = 'auto';
        
        // ボタングループのスタイルも修正
        const btnGroup = touristLabel.closest('.btn-group');
        if (btnGroup) {
          btnGroup.style.display = 'flex';
          btnGroup.style.flexDirection = 'row';
          btnGroup.style.width = '100%';
        }
        
        console.log('ユーザータイプセレクターのスタイルを修正しました');
      }
      
      // チェック状態と説明テキストの更新
      const updateDescription = function() {
        const description = document.getElementById('user-type-description');
        if (description) {
          if (touristRadio.checked) {
            description.textContent = '観光客としてログインすると、ガイドを探したり予約できます';
          } else if (guideRadio.checked) {
            description.textContent = 'ガイドとしてログインすると、プロフィールの編集や予約の管理ができます';
          }
        }
      };
      
      // 観光客をデフォルトで選択
      if (!touristRadio.checked && !guideRadio.checked) {
        touristRadio.checked = true;
      }
      
      // 説明テキストを更新
      updateDescription();
      
      // イベントリスナーを追加
      touristRadio.addEventListener('change', updateDescription);
      guideRadio.addEventListener('change', updateDescription);
      
      console.log('ユーザータイプ選択の処理を完了しました');
    } else {
      console.log('ユーザータイプのラジオボタンが見つかりません');
    }
  }
})();