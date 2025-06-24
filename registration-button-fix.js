/**
 * 新規登録ボタン修正スクリプト
 * 認証保護システムと競合しない直接的な解決策
 */

(function() {
  'use strict';
  
  console.log('新規登録ボタン修正開始');
  
  function fixRegistrationButton() {
    // 新規登録ドロップダウンボタンを取得
    const registerDropdown = document.getElementById('registerDropdown');
    if (!registerDropdown) {
      console.warn('registerDropdown要素が見つかりません');
      return;
    }
    
    // Bootstrap のイベントを完全に除去して直接制御
    registerDropdown.removeAttribute('data-bs-toggle');
    registerDropdown.removeAttribute('data-bs-target');
    
    // 新しいクリックイベントを設定
    registerDropdown.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('新規登録ボタンクリック - 直接制御');
      
      // ドロップダウンメニューを取得
      const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="registerDropdown"]');
      if (dropdownMenu) {
        // 表示/非表示を切り替え
        if (dropdownMenu.classList.contains('show')) {
          dropdownMenu.classList.remove('show');
          registerDropdown.setAttribute('aria-expanded', 'false');
        } else {
          // 他のドロップダウンを閉じる
          document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
          });
          
          // このドロップダウンを開く
          dropdownMenu.classList.add('show');
          registerDropdown.setAttribute('aria-expanded', 'true');
        }
      }
    });
    
    // ドロップダウンメニュー内の観光客登録ボタンを設定
    const touristRegisterBtn = document.querySelector('[data-bs-target="#registerTouristModal"]');
    if (touristRegisterBtn) {
      touristRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('観光客登録ボタンクリック');
        
        // 登録フラグを設定
        window.isRegistering = true;
        
        // ドロップダウンを閉じる
        const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="registerDropdown"]');
        if (dropdownMenu) {
          dropdownMenu.classList.remove('show');
          registerDropdown.setAttribute('aria-expanded', 'false');
        }
        
        // モーダルを表示
        const modal = document.getElementById('registerTouristModal');
        if (modal) {
          const bsModal = new bootstrap.Modal(modal);
          bsModal.show();
        }
      });
    }
    
    console.log('新規登録ボタン修正完了');
  }
  
  // ページ読み込み時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixRegistrationButton);
  } else {
    fixRegistrationButton();
  }
  
  // 遅延実行で確実に修正
  setTimeout(fixRegistrationButton, 1000);
  
})();