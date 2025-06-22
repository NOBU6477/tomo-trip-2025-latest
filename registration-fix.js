/**
 * 登録ボタンの修正スクリプト
 * ナビゲーションの競合を防ぎ、モーダルが正しく開くように修正
 */

(function() {
  'use strict';
  
  function initRegistrationFix() {
    console.log('登録ボタン修正スクリプトを初期化中...');
    
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupRegistrationButtons);
    } else {
      setupRegistrationButtons();
    }
  }
  
  function setupRegistrationButtons() {
    // 観光客登録ボタンの設定
    const touristButtons = document.querySelectorAll('[data-bs-target="#registerTouristModal"]');
    touristButtons.forEach(button => {
      button.addEventListener('click', handleTouristRegistration);
    });
    
    // ガイド登録ボタンの設定
    const guideButtons = document.querySelectorAll('[data-bs-target="#registerGuideModal"]');
    guideButtons.forEach(button => {
      button.addEventListener('click', handleGuideRegistration);
    });
    
    console.log(`観光客登録ボタン: ${touristButtons.length}個, ガイド登録ボタン: ${guideButtons.length}個を設定`);
  }
  
  function handleTouristRegistration(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('観光客登録ボタンがクリックされました');
    
    // ドロップダウンを閉じる
    const dropdown = event.target.closest('.dropdown');
    if (dropdown) {
      const dropdownButton = dropdown.querySelector('.dropdown-toggle');
      if (dropdownButton) {
        const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownButton);
        if (dropdownInstance) {
          dropdownInstance.hide();
        }
      }
    }
    
    // モーダルを開く
    setTimeout(() => {
      const modal = document.getElementById('registerTouristModal');
      if (modal) {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
      }
    }, 200);
  }
  
  function handleGuideRegistration(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('ガイド登録ボタンがクリックされました');
    
    // ドロップダウンを閉じる
    const dropdown = event.target.closest('.dropdown');
    if (dropdown) {
      const dropdownButton = dropdown.querySelector('.dropdown-toggle');
      if (dropdownButton) {
        const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownButton);
        if (dropdownInstance) {
          dropdownInstance.hide();
        }
      }
    }
    
    // モーダルを開く
    setTimeout(() => {
      const modal = document.getElementById('registerGuideModal');
      if (modal) {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
      }
    }, 200);
  }
  
  // 既存のBootstrapイベントを無効化
  function disableDefaultModalTriggers() {
    document.addEventListener('click', function(event) {
      if (event.target.matches('[data-bs-target="#registerTouristModal"], [data-bs-target="#registerGuideModal"]')) {
        event.stopImmediatePropagation();
      }
    }, true);
  }
  
  // 初期化実行
  initRegistrationFix();
  disableDefaultModalTriggers();
  
})();