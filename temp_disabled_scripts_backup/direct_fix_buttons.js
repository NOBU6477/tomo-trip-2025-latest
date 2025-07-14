/**
 * ボタン関連の問題を修正する最終的なスクリプト
 * ヘッダーとヒーローセクションの「ガイドになる」ボタンがモーダルを正しく表示できない問題を解決
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM完全読み込み後に実行

  // 1. ヘッダーセクションに「ガイドになる」リンクを追加
  setupHeaderGuideLink();
  
  // 2. ヒーローセクションの「ガイドになる」ボタンを修正
  fixHeroGuideButton();
  
  // 3. セクション内の「ガイドとして登録する」ボタンを修正
  fixSectionGuideButton();
  
  // 4. 既存のイベントリスナーを削除してガイド関連のクリックイベントを統一管理
  unifyGuideButtonEvents();
});

/**
 * ヘッダーに「ガイドになる」リンクを追加
 */
function setupHeaderGuideLink() {
  try {
    // ヘッダーナビゲーションを取得
    const navItems = document.querySelector('.navbar-nav');
    if (!navItems) return;
    
    // 「サービスについて」のリストアイテムを探す
    const aboutNav = Array.from(navItems.querySelectorAll('.nav-item')).find(item => {
      return item.querySelector('.nav-link[data-i18n="nav.about"]');
    });
    
    if (!aboutNav) return;
    
    // 新しいリストアイテムを作成
    const newNavItem = document.createElement('li');
    newNavItem.className = 'nav-item';
    
    // リンクを作成
    const guideLink = document.createElement('a');
    guideLink.className = 'nav-link';
    guideLink.href = '#';
    guideLink.setAttribute('data-i18n', 'nav.become_guide');
    guideLink.textContent = 'ガイドになる';
    guideLink.id = 'nav-become-guide';
    
    // クリックイベントを設定
    guideLink.addEventListener('click', function(e) {
      e.preventDefault();
      showUserTypeModal();
    });
    
    // 要素を追加
    newNavItem.appendChild(guideLink);
    aboutNav.insertAdjacentElement('afterend', newNavItem);
    
    console.log('ヘッダーガイドリンクを設定しました');
  } catch (error) {
    console.error('ヘッダーガイドリンク設定中にエラー:', error);
  }
}

/**
 * ヒーローセクションの「ガイドになる」ボタンの修正
 */
function fixHeroGuideButton() {
  try {
    // ヒーローセクションの「ガイドになる」ボタンを取得
    const heroGuideBtn = document.getElementById('become-guide-btn');
    if (!heroGuideBtn) return;
    
    // 既存のイベントリスナーをクリア
    const newBtn = heroGuideBtn.cloneNode(true);
    newBtn.id = 'hero-become-guide-btn';
    
    // 新しいイベントリスナーを設定
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showUserTypeModal();
    });
    
    // 元のボタンを置き換え
    if (heroGuideBtn.parentNode) {
      heroGuideBtn.parentNode.replaceChild(newBtn, heroGuideBtn);
    }
    
    console.log('ヒーローガイドボタンを修正しました');
  } catch (error) {
    console.error('ヒーローガイドボタン修正中にエラー:', error);
  }
}

/**
 * セクション内の「ガイドとして登録する」ボタンの修正
 */
function fixSectionGuideButton() {
  try {
    // セクション内の「ガイドになる」ボタンを取得
    const sectionGuideBtn = document.getElementById('become-guide-btn-section');
    if (!sectionGuideBtn) return;
    
    // 既存のイベントリスナーをクリア
    const newBtn = sectionGuideBtn.cloneNode(true);
    newBtn.id = 'section-become-guide-btn';
    
    // 新しいイベントリスナーを設定
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showUserTypeModal();
    });
    
    // 元のボタンを置き換え
    if (sectionGuideBtn.parentNode) {
      sectionGuideBtn.parentNode.replaceChild(newBtn, sectionGuideBtn);
    }
    
    console.log('セクションガイドボタンを修正しました');
  } catch (error) {
    console.error('セクションガイドボタン修正中にエラー:', error);
  }
}

/**
 * ユーザータイプモーダル内のガイドボタンに競合しないイベントリスナーを設定
 */
function unifyGuideButtonEvents() {
  try {
    // モーダル内の「ガイドとして登録」ボタンを取得
    const modalGuideBtn = document.getElementById('select-guide-btn');
    if (!modalGuideBtn) return;
    
    // 既存のイベントリスナーをクリア
    const newBtn = modalGuideBtn.cloneNode(true);
    
    // 新しいイベントリスナーを設定
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // ユーザータイプモーダルを閉じる
      const userTypeModal = document.getElementById('userTypeModal');
      if (userTypeModal) {
        const bsUserTypeModal = bootstrap.Modal.getInstance(userTypeModal);
        if (bsUserTypeModal) {
          bsUserTypeModal.hide();
        }
      }
      
      // ガイド登録モーダルを表示する前に少し遅延する
      setTimeout(function() {
        // ガイド登録モーダルを表示
        const guideRegisterModal = document.getElementById('guideRegisterModal');
        if (guideRegisterModal) {
          const bsGuideRegisterModal = new bootstrap.Modal(guideRegisterModal);
          bsGuideRegisterModal.show();
        }
      }, 300);
    });
    
    // 元のボタンを置き換え
    if (modalGuideBtn.parentNode) {
      modalGuideBtn.parentNode.replaceChild(newBtn, modalGuideBtn);
    }
    
    console.log('モーダルガイドボタンを修正しました');
  } catch (error) {
    console.error('モーダルガイドボタン修正中にエラー:', error);
  }
}

/**
 * ユーザータイプモーダルを表示
 */
function showUserTypeModal() {
  // 登録ボタンクリック時の処理をシミュレート
  const userTypeModal = document.getElementById('userTypeModal');
  if (userTypeModal) {
    const modal = new bootstrap.Modal(userTypeModal);
    modal.show();
  }
}