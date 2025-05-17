/**
 * 観光客登録ボタンの修正スクリプト
 * 登録ボタンが動作しない問題を修正
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("観光客登録ボタン修正スクリプトを読み込みました");
  setupTouristRegistrationButton();
});

/**
 * 観光客登録ボタンの設定
 */
function setupTouristRegistrationButton() {
  // 観光客として登録ボタンを取得
  const touristButton = document.getElementById('select-tourist-btn');
  if (!touristButton) {
    console.log("観光客登録ボタンが見つかりません");
    return;
  }
  
  console.log("観光客登録ボタンを発見");
  
  // イベントリスナーを追加
  touristButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log("観光客として登録ボタンがクリックされました");
    
    // ユーザータイプモーダルを閉じる
    const userTypeModal = document.getElementById('userTypeModal');
    const bsUserTypeModal = bootstrap.Modal.getInstance(userTypeModal);
    if (bsUserTypeModal) {
      bsUserTypeModal.hide();
    } else {
      userTypeModal.style.display = 'none';
      userTypeModal.classList.remove('show');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
    
    // 観光客登録モーダルを表示
    setTimeout(function() {
      const touristRegisterModal = document.getElementById('touristRegisterModal');
      if (touristRegisterModal) {
        console.log("観光客登録モーダルを表示します");
        const bsTouristRegisterModal = new bootstrap.Modal(touristRegisterModal);
        bsTouristRegisterModal.show();
      } else {
        console.error("観光客登録モーダルが見つかりません");
      }
    }, 300);
  });
  
  console.log("観光客登録ボタンを設定しました");
}

// 念のためwindow.onloadでも実行
window.addEventListener('load', function() {
  console.log("ウィンドウロード時に観光客登録ボタン修正を再確認");
  setupTouristRegistrationButton();
});