/**
 * ガイド登録ボタン関連の問題を根本から解決するスクリプト
 * グローバルイベントハンドラーを使用して、あらゆるガイドボタンをキャプチャ
 */

(function() {
  console.log('最終ガイドボタン修正スクリプトを読み込みました');
  
  // 直ちに実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeGuideButtonFix();
  } else {
    document.addEventListener('DOMContentLoaded', initializeGuideButtonFix);
  }
  
  // 初期化関数
  function initializeGuideButtonFix() {
    console.log('ガイドボタン修正を初期化しました');
    
    // 1. ヘッダーのガイドボタン修正
    fixHeaderGuideButton();
    
    // 2. ヒーローセクションのガイドボタン修正
    fixHeroGuideButton();
    
    // 3. セクション内のガイドボタン修正
    fixSectionGuideButtons();
    
    // 4. モーダル内のガイド選択ボタン修正
    fixSelectGuideButton();
    
    // 5. モーダルのリンク構造を変更（安全に）
    // 実行をわずかに遅延させる（DOM反映のため）
    setTimeout(improveModalStructure, 500);
  }
  
  // ヘッダーのガイドボタン修正
  function fixHeaderGuideButton() {
    const headerNav = document.querySelector('header nav');
    if (!headerNav) return;
    
    // 既存のガイドボタンを削除
    const existingButtons = headerNav.querySelectorAll('[id*="guide"], [data-i18n*="guide"], a:contains("ガイド")');
    existingButtons.forEach(btn => {
      if (btn.textContent.includes('ガイド') || (btn.getAttribute('data-i18n') && btn.getAttribute('data-i18n').includes('guide'))) {
        btn.parentNode?.removeChild(btn);
      }
    });
    
    // 新しいガイドボタンを作成
    const newGuideBtn = document.createElement('a');
    newGuideBtn.href = '#';
    newGuideBtn.className = 'nav-link px-2 link-dark guide-button';
    newGuideBtn.setAttribute('data-i18n', 'nav.become_guide');
    newGuideBtn.textContent = 'ガイドになる';
    
    // イベントリスナーを設定
    newGuideBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('ヘッダーガイドボタンがクリックされました');
      showUserTypeModal();
    });
    
    // ナビゲーションバーに挿入
    const navItems = headerNav.querySelector('.navbar-nav, .nav');
    if (navItems) {
      navItems.appendChild(newGuideBtn);
      console.log('新しいヘッダーガイドボタンを追加しました');
    }
  }
  
  // ヒーローセクションのガイドボタン修正
  function fixHeroGuideButton() {
    const heroSection = document.querySelector('.hero, .jumbotron');
    if (!heroSection) return;
    
    // ヒーローセクション内のガイドボタンを検索
    const guideBtn = heroSection.querySelector('[id*="guide"], [data-i18n*="guide"], .btn:contains("ガイド")');
    
    if (guideBtn) {
      // 既存のボタンを非クローンボタンに置き換え
      const newBtn = document.createElement('a');
      newBtn.href = '#';
      newBtn.className = guideBtn.className;
      newBtn.setAttribute('data-i18n', 'hero.become_guide');
      newBtn.textContent = 'ガイドになる';
      
      // イベントリスナーを設定
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('ヒーローガイドボタンがクリックされました');
        showUserTypeModal();
      });
      
      // 元のボタンを置換
      guideBtn.parentNode?.replaceChild(newBtn, guideBtn);
      console.log('ヒーローガイドボタンを置き換えました');
    }
  }
  
  // セクション内のガイドボタン修正
  function fixSectionGuideButtons() {
    // ページ内の他のセクションのガイドボタンを検索
    const sectionButtons = document.querySelectorAll('.section .btn[id*="guide"], .section [data-i18n*="guide"], .section .btn:contains("ガイド")');
    
    sectionButtons.forEach(btn => {
      if (btn.textContent.includes('ガイド') || (btn.getAttribute('data-i18n') && btn.getAttribute('data-i18n').includes('guide'))) {
        // クローンではなく新しい要素を作成
        const newBtn = document.createElement('a');
        newBtn.href = '#';
        newBtn.className = btn.className;
        newBtn.setAttribute('data-i18n', btn.getAttribute('data-i18n') || 'section.become_guide');
        newBtn.textContent = btn.textContent;
        
        // イベントリスナーを設定
        newBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('セクションガイドボタンがクリックされました');
          showUserTypeModal();
        });
        
        // 元のボタンを置換
        btn.parentNode?.replaceChild(newBtn, btn);
        console.log('セクションガイドボタンを置き換えました');
      }
    });
  }
  
  // モーダル内のガイド選択ボタン修正
  function fixSelectGuideButton() {
    // モーダルが既にDOMにあるかもしれないのでチェック
    const selectGuideBtn = document.getElementById('select-guide-btn');
    if (selectGuideBtn) {
      configureSelectGuideButton(selectGuideBtn);
    }
    
    // モーダルが後からロードされる場合に備えてイベントリスナーを設定
    document.addEventListener('shown.bs.modal', function(e) {
      if (e.target.id === 'userTypeModal') {
        const btn = document.getElementById('select-guide-btn');
        if (btn) {
          configureSelectGuideButton(btn);
        }
      }
    });
  }
  
  // ガイド選択ボタンの設定
  function configureSelectGuideButton(button) {
    // 既存のイベントリスナーを削除
    const newBtn = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(newBtn, button);
    }
    
    // 新しいイベントリスナーを設定
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('ガイド選択ボタンがクリックされました');
      
      // ユーザータイプモーダルを閉じる
      closeModal('userTypeModal');
      
      // ガイド登録モーダルを表示
      setTimeout(function() {
        showModal('guideRegisterModal');
      }, 300);
    });
  }
  
  // モーダル構造の改善
  function improveModalStructure() {
    // ユーザータイプモーダル内のタイトルを更新
    const userTypeTitle = document.querySelector('#userTypeModal .modal-title');
    if (userTypeTitle) {
      userTypeTitle.textContent = 'アカウントタイプを選択';
    }
    
    // 緊急閉じるボタンをすべてのモーダルに追加
    document.querySelectorAll('.modal').forEach(modal => {
      if (!modal.querySelector('.emergency-close')) {
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'btn btn-sm btn-outline-secondary emergency-close';
        closeBtn.textContent = '閉じる';
        closeBtn.style.position = 'absolute';
        closeBtn.style.bottom = '10px';
        closeBtn.style.right = '10px';
        
        closeBtn.addEventListener('click', function() {
          closeModal(modal.id);
        });
        
        modal.querySelector('.modal-content').appendChild(closeBtn);
      }
    });
  }
  
  // モーダルを表示する関数
  function showModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) {
      console.error(`モーダル ${modalId} が見つかりません`);
      return;
    }
    
    // Bootstrap 5のモーダルAPIを使用
    try {
      const modalInstance = new bootstrap.Modal(modalEl);
      modalInstance.show();
      console.log(`モーダル ${modalId} を表示しました`);
    } catch (e) {
      console.error(`モーダル表示エラー: ${e.message}`);
      // フォールバック: 手動でモーダルを表示
      modalEl.classList.add('show');
      modalEl.style.display = 'block';
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.removeAttribute('aria-hidden');
      
      // バックドロップを作成
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
      
      document.body.classList.add('modal-open');
    }
  }
  
  // モーダルを閉じる関数
  function closeModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;
    
    // Bootstrap 5のモーダルAPIを使用
    try {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (e) {
      // フォールバック: 手動でモーダルを閉じる
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      modalEl.setAttribute('aria-hidden', 'true');
      modalEl.removeAttribute('aria-modal');
      
      // バックドロップを削除
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      
      document.body.classList.remove('modal-open');
    }
  }
  
  // すべてのモーダルを閉じる関数
  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      try {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      } catch (e) {
        // エラーは無視
      }
    });
    
    // バックドロップを削除
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    
    // bodyのスタイルをリセット
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
  // ユーザータイプモーダルを表示
  function showUserTypeModal() {
    // 現在開いているモーダルを閉じる
    closeAllModals();
    
    // 少し遅延してユーザータイプモーダルを表示
    setTimeout(function() {
      showModal('userTypeModal');
    }, 100);
  }
  
  // Element.prototypeに:containsセレクタ機能を追加（jQueryの機能をエミュレート）
  if (!Element.prototype.querySelectorAll.toString().includes(':contains')) {
    // 元のメソッドを保存
    const originalQuerySelectorAll = Element.prototype.querySelectorAll;
    
    // メソッドを上書き
    Element.prototype.querySelectorAll = function(selector) {
      if (selector.includes(':contains')) {
        // :containsセレクタを解析
        const parts = selector.split(':contains(');
        const baseSelector = parts[0];
        const searchText = parts[1].slice(0, -1); // 閉じ括弧を削除
        
        // 基本セレクタで要素を取得
        const elements = originalQuerySelectorAll.call(this, baseSelector);
        
        // テキストで絞り込み
        return Array.from(elements).filter(el => 
          el.textContent.includes(searchText)
        );
      }
      
      // 通常のセレクタはそのまま処理
      return originalQuerySelectorAll.call(this, selector);
    };
  }
})();