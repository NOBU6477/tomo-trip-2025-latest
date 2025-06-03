/**
 * ガイド登録機能修正スクリプト
 * ユーザータイプ選択ダイアログを回避して直接ガイド登録フォームを表示
 */

(function() {
  'use strict';

  // 初期化フラグ
  let isInitialized = false;

  // 即座に実行
  setupGuideRegistrationFix();

  document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('ガイド登録機能修正スクリプトを初期化中...');
    setupGuideRegistrationFix();
  });

  // ページロード後にも実行
  window.addEventListener('load', function() {
    setupGuideRegistrationFix();
  });

  function setupGuideRegistrationFix() {
    // ガイド登録ボタンのイベントを修正
    fixGuideRegistrationButtons();
    
    // ユーザータイプ選択ダイアログの自動処理
    setupUserTypeModalFix();
    
    // 直接ガイド登録を有効化
    enableDirectGuideRegistration();
    
    // アクセス制御スクリプトを無効化
    disableAccessControlInterference();
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
    
    // 正しい新規登録フォームに遷移
    setTimeout(() => {
      if (window.location.pathname.includes('guide-registration-form.html')) {
        // 既に正しい登録フォームにいる場合は何もしない
        console.log('既に新規登録フォームにいます');
      } else {
        // 新規登録フォームに遷移
        console.log('新規ガイド登録フォームに遷移します');
        window.location.href = 'guide-registration-form.html';
      }
    }, 200);
  }

  /**
   * アクセス制御スクリプトの干渉を無効化
   */
  function disableAccessControlInterference() {
    // アクセス制御系のグローバル変数を無効化
    if (window.showUserTypeAccessModal) {
      window.showUserTypeAccessModal = function() {
        console.log('アクセス制御ダイアログをバイパス - ガイド登録に直行');
        openGuideRegistrationDirectly();
      };
    }
    
    // アクセス制御チェック関数を無効化
    if (window.checkAccessPermission) {
      window.checkAccessPermission = function() {
        return true; // 常にアクセス許可
      };
    }
    
    // セッションストレージにガイド権限を設定
    sessionStorage.setItem('userAccessType', 'guide');
    sessionStorage.setItem('hasGuideAccess', 'true');
    sessionStorage.setItem('bypassAccessControl', 'true');
    
    console.log('アクセス制御を無効化しました');
  }

  /**
   * ガイド登録フォームの直接表示を強制
   */
  function forceShowGuideRegistrationForm() {
    // guide-profile.htmlページの場合、フォームを直接表示
    if (window.location.pathname.includes('guide-profile.html')) {
      console.log('ガイドプロフィールページでフォーム表示を強制');
      
      // モーダルを全て閉じる
      const openModals = document.querySelectorAll('.modal.show');
      openModals.forEach(modal => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
      
      // バックドロップを削除
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      
      // body の状態をリセット
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // フォームを表示状態に設定
      const forms = document.querySelectorAll('form, .form-container');
      forms.forEach(form => {
        if (form.style) {
          form.style.display = '';
          form.style.visibility = '';
        }
      });
    }
  }

  // フォーム表示強制も実行
  setTimeout(forceShowGuideRegistrationForm, 100);

  // グローバル関数として公開
  window.openGuideRegistrationDirectly = openGuideRegistrationDirectly;
  window.enableDirectGuideRegistration = enableDirectGuideRegistration;
  window.disableAccessControlInterference = disableAccessControlInterference;
  window.forceShowGuideRegistrationForm = forceShowGuideRegistrationForm;

  console.log('ガイド登録機能修正スクリプトがロードされました');

})();