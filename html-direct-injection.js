/**
 * モーダルのユーザータイプセレクターにHTMLを直接インジェクトするスクリプト
 * 最後の手段として、完全に新しいHTMLコードを注入する
 */

(function() {
  console.log('HTML直接インジェクトスクリプトを実行します...');
  
  // DOMが完全に読み込まれるまで待機
  document.addEventListener('DOMContentLoaded', injectHTML);
  
  // 即時実行（既にDOMが読み込まれている場合）
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(injectHTML, 500);
  }
  
  // モーダルイベントをリッスン
  document.body.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'loginModal') {
      setTimeout(injectHTML, 10);
    }
  });
  
  // クリックイベントをキャプチャ
  document.addEventListener('click', function(event) {
    // 少し遅延させて実行
    setTimeout(injectHTML, 300);
  }, true);
  
  // 定期的な確認
  setInterval(injectHTML, 1000);
  
  // HTML直接インジェクト関数
  function injectHTML() {
    const loginModal = document.getElementById('loginModal');
    if (!loginModal) return;
    
    try {
      // ユーザータイプセレクター領域を探す
      const userTypeSection = loginModal.querySelector('.user-type-selector');
      if (!userTypeSection) {
        console.log('ユーザータイプセレクターが見つかりません');
        return;
      }
      
      // すでに修正されているか確認
      if (userTypeSection.dataset.fixed === 'true') {
        console.log('すでに修正されています');
        return;
      }
      
      console.log('HTMLを直接インジェクトします');
      
      // 置き換えるHTML
      const newHTML = `
        <div class="btn-group w-100" role="group" aria-label="ユーザータイプ選択">
          <input type="radio" class="btn-check" name="login-user-type" id="login-user-tourist" value="tourist" autocomplete="off" checked>
          <label class="btn btn-outline-primary" for="login-user-tourist" style="display: inline-flex !important; visibility: visible !important; opacity: 1 !important; width: 50% !important; position: relative !important; z-index: 10 !important;">
            <i class="bi bi-person me-1"></i> 観光客
          </label>
          
          <input type="radio" class="btn-check" name="login-user-type" id="login-user-guide" value="guide" autocomplete="off">
          <label class="btn btn-outline-primary" for="login-user-guide" style="display: inline-flex !important; visibility: visible !important; opacity: 1 !important; width: 50% !important; position: relative !important; z-index: 10 !important;">
            <i class="bi bi-map me-1"></i> ガイド
          </label>
        </div>
      `;
      
      // 内容を置き換え
      userTypeSection.innerHTML = newHTML;
      
      // 説明文の更新用
      const updateDescription = function() {
        const descriptionEl = loginModal.querySelector('#user-type-description');
        if (!descriptionEl) return;
        
        const touristRadio = loginModal.querySelector('#login-user-tourist');
        const guideRadio = loginModal.querySelector('#login-user-guide');
        
        if (touristRadio && touristRadio.checked) {
          descriptionEl.textContent = '観光客としてログインすると、ガイドを探したり予約できます';
        } else if (guideRadio && guideRadio.checked) {
          descriptionEl.textContent = 'ガイドとしてログインすると、プロフィールの編集や予約の管理ができます';
        }
      };
      
      // ラジオボタンのイベントリスナーを設定
      const touristRadio = loginModal.querySelector('#login-user-tourist');
      const guideRadio = loginModal.querySelector('#login-user-guide');
      
      if (touristRadio) {
        touristRadio.addEventListener('change', updateDescription);
      }
      
      if (guideRadio) {
        guideRadio.addEventListener('change', updateDescription);
      }
      
      // 初期説明を設定
      updateDescription();
      
      // 修正済みとマーク
      userTypeSection.dataset.fixed = 'true';
      
      console.log('HTML直接インジェクトが完了しました');
    } catch (error) {
      console.error('HTML直接インジェクト中にエラーが発生しました:', error);
    }
  }
})();