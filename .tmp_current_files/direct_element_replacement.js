/**
 * 電話認証バッジを直接置換する最終決定版スクリプト
 * スクリーンショットの画像と完全に一致する要素に特化
 */
(function() {
  // 初期化
  function init() {
    console.log("認証済みボタン直接置換スクリプト: 初期化");
    
    // すぐに実行
    executeFixes();
    
    // モーダルが表示されたときにも実行
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        setTimeout(executeFixes, 0);
        setTimeout(executeFixes, 200);
        setTimeout(executeFixes, 500);
      }
    });
    
    // 定期的に実行することで確実に修正を適用
    setInterval(executeFixes, 1000);
  }
  
  // 修正を実行
  function executeFixes() {
    // ガイド登録モーダルが存在するか確認
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal) return;
    
    // スクリーンショットと完全一致するケース: 電話番号認証セクションの緑色ボタン
    replacePhoneVerificationButtons(modal);
  }
  
  // 電話番号認証セクションの緑色ボタンを置換
  function replacePhoneVerificationButtons(modal) {
    // 「電話番号認証」ラベルを探す
    const labels = Array.from(modal.querySelectorAll('label, div'));
    let phoneSection = null;
    
    // 電話番号認証セクションを見つける
    for (const element of labels) {
      if (element.textContent && element.textContent.includes('電話番号認証')) {
        // 親コンテナーを取得
        phoneSection = getParentContainer(element);
        break;
      }
    }
    
    if (!phoneSection) {
      console.log("電話番号認証セクションが見つかりません");
      return;
    }
    
    console.log("電話番号認証セクション発見:", phoneSection.tagName);
    
    // 緑色の認証済みボタンを探す (スクリーンショットと一致する要素)
    const authenticatedButtons = phoneSection.querySelectorAll('.btn-success, button.btn-success, .badge.bg-success');
    
    // ボタンを見つけた場合、未表示テキストに置き換える
    authenticatedButtons.forEach(button => {
      if (button.textContent && (button.textContent.includes('認証済') || button.textContent.trim() === '認証済み')) {
        console.log('認証済みボタンを発見:', button.tagName, button.className);
        replaceWithUnverifiedText(button);
      } else {
        // 緑色ボタン全般も処理
        replaceWithUnverifiedText(button);
      }
    });
    
    // 未表示テキストを探し、非表示になっていたら表示
    const hiddenTexts = phoneSection.querySelectorAll('.d-none, [style*="display: none"]');
    hiddenTexts.forEach(element => {
      if (element.textContent && element.textContent.includes('未表示')) {
        console.log('未表示テキストを発見、表示します');
        element.classList.remove('d-none');
        element.style.removeProperty('display');
        element.style.display = 'inline-block';
      }
    });
  }
  
  // 親コンテナーを取得
  function getParentContainer(element) {
    // フォーム要素を探す
    let container = element.closest('.form-group, .row, .mb-3, form');
    if (container) return container;
    
    // 親要素をたどる
    let parent = element.parentElement;
    for (let i = 0; i < 5 && parent; i++) { // 最大5階層まで遡る
      if (parent.tagName === 'DIV' || parent.tagName === 'FORM') {
        return parent;
      }
      parent = parent.parentElement;
    }
    
    // 見つからない場合は一番近い親DIVを返す
    return element.closest('div') || element.parentElement;
  }
  
  // 認証済みボタンを未表示テキストに置き換える
  function replaceWithUnverifiedText(button) {
    // 親要素を取得
    const parent = button.parentElement;
    if (!parent) return;
    
    // ボタンを非表示
    button.style.display = 'none';
    button.style.visibility = 'hidden';
    button.style.position = 'absolute';
    button.style.pointerEvents = 'none';
    button.classList.add('d-none');
    
    // 未表示テキストがすでに存在するか確認
    let unverifiedText = parent.querySelector('.unverified-text');
    if (!unverifiedText) {
      // 未表示テキストを作成
      unverifiedText = document.createElement('span');
      unverifiedText.className = 'text-muted unverified-text';
      unverifiedText.style.marginLeft = '10px';
      unverifiedText.textContent = '未表示';
      
      // ボタンの後に挿入
      parent.insertBefore(unverifiedText, button.nextSibling);
    } else {
      // すでに存在する場合は表示状態にする
      unverifiedText.style.display = 'inline-block';
      unverifiedText.classList.remove('d-none');
    }
    
    // ボタンを完全に削除
    try {
      parent.removeChild(button);
    } catch (e) {
      console.log('ボタン削除エラー:', e);
    }
  }
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時に実行
  window.addEventListener('load', function() {
    init();
    setTimeout(executeFixes, 500);
  });
})();