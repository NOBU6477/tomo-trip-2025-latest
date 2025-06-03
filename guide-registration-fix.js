/**
 * ガイド登録機能修正スクリプト
 * ユーザータイプ選択ダイアログを回避して直接ガイド登録フォームを表示
 */

(function() {
  'use strict';

  // 初期化フラグ
  let isInitialized = false;

  document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('ガイド登録機能修正スクリプトを初期化中...');
    setupGuideRegistrationFix();
  });

  function setupGuideRegistrationFix() {
    // ガイド登録ボタンのイベントを修正
    fixGuideRegistrationButtons();
    
    // ユーザータイプ選択ダイアログの自動処理
    setupUserTypeModalFix();
    
    // 直接ガイド登録を有効化
    enableDirectGuideRegistration();
  }

  /**
   * ガイド登録ボタンの修正
   */
  function fixGuideRegistrationButtons() {
    // 「新規登録」ドロップダウンのガイド登録オプション
    const guideRegisterButtons = document.querySelectorAll('[onclick*="guide"], [href*="guide-profile"], [data-register-type="guide"]');
    
    guideRegisterButtons.forEach(button => {
      // 既存のイベントを削除
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // 新しいイベントを設定
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('ガイド登録ボタンがクリックされました');
        openGuideRegistrationDirectly();
      });
    });
    
    // ナビゲーションのガイド登録リンクも修正
    const navGuideLinks = document.querySelectorAll('a[href*="guide-profile"], a[href*="bootstrap_solution"]');
    navGuideLinks.forEach(link => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      newLink.addEventListener('click', function(e) {
        e.preventDefault();
        openGuideRegistrationDirectly();
      });
    });
  }

  /**
   * ユーザータイプ選択ダイアログの自動処理
   */
  function setupUserTypeModalFix() {
    // ユーザータイプ選択モーダルが表示された場合の自動処理
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // ユーザータイプ選択モーダルを検出
            const userTypeModal = node.querySelector ? 
              node.querySelector('#userTypeAccessModal, .modal[class*="user-type"]') : null;
            
            if (userTypeModal || (node.id && node.id.includes('userType'))) {
              console.log('ユーザータイプ選択ダイアログを検出、自動でガイド登録に進みます');
              setTimeout(() => {
                selectGuideTypeAutomatically();
              }, 500);
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * ガイドタイプを自動選択
   */
  function selectGuideTypeAutomatically() {
    // ガイド登録ボタンを探して自動クリック
    const guideRegisterButton = document.querySelector('#guide-register-btn, .guide-register, [data-register-type="guide"]');
    
    if (guideRegisterButton) {
      console.log('ガイド登録ボタンを自動クリック');
      guideRegisterButton.click();
      return;
    }
    
    // モーダル内のガイド登録ボタンを探す
    const modalGuideButtons = document.querySelectorAll('.modal button, .modal a');
    for (const button of modalGuideButtons) {
      const text = button.textContent.toLowerCase();
      if (text.includes('ガイド登録') || text.includes('guide') || text.includes('ガイドとして')) {
        console.log('モーダル内のガイド登録ボタンを自動クリック');
        button.click();
        return;
      }
    }
    
    // 直接ガイド登録フォームを開く
    openGuideRegistrationDirectly();
  }

  /**
   * 直接ガイド登録を有効化
   */
  function enableDirectGuideRegistration() {
    // セッションにガイドタイプを設定
    sessionStorage.setItem('selectedUserType', 'guide');
    sessionStorage.setItem('registrationMode', 'guide');
    
    console.log('ガイド登録モードを有効化しました');
  }

  /**
   * ガイド登録フォームを直接開く
   */
  function openGuideRegistrationDirectly() {
    console.log('ガイド登録フォームを直接開きます');
    
    // 現在開いているモーダルを閉じる
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    });
    
    // backdrop を削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // body クラスをリセット
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // ガイドタイプを設定
    enableDirectGuideRegistration();
    
    // ガイド登録ページに遷移
    setTimeout(() => {
      if (window.location.pathname.includes('guide-profile.html')) {
        // 既にガイドプロフィールページにいる場合は何もしない
        console.log('既にガイドプロフィールページにいます');
      } else {
        // ガイドプロフィールページに遷移
        console.log('ガイドプロフィールページに遷移します');
        window.location.href = 'guide-profile.html';
      }
    }, 200);
  }

  // グローバル関数として公開
  window.openGuideRegistrationDirectly = openGuideRegistrationDirectly;
  window.enableDirectGuideRegistration = enableDirectGuideRegistration;

  console.log('ガイド登録機能修正スクリプトがロードされました');

})();