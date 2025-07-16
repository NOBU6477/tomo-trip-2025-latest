/**
 * モバイル協賛店ボタン修正システム
 * 既存のグラデーションボタンを削除し、「人気のガイド」上に横並びボタンを配置
 */

(function() {
  'use strict';
  
  console.log('📱 モバイル協賛店ボタン修正開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // 既存のグラデーションボタンを削除
  function removeOldButtons() {
    const selectors = [
      '.mobile-sponsor-fix',
      '.mobile-sponsor-buttons',
      '.mobile-sponsor-container',
      '.sponsor-btn-fixed',
      '.fixed-sponsor-btn'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (window.getComputedStyle(el).position === 'fixed') {
          el.remove();
          console.log('削除:', selector);
        }
      });
    });
  }
  
  // 「人気のガイド」セクションを探す
  function findPopularGuidesSection() {
    // 具体的なセレクターで検索
    let popularSection = document.querySelector('h2[class*="mb-0"][class*="flex-grow-1"]');
    if (popularSection && popularSection.textContent.includes('人気のガイド')) {
      return popularSection;
    }
    
    // より一般的な検索
    const headings = document.querySelectorAll('h2, h3, h4');
    for (let heading of headings) {
      if (heading.textContent.includes('人気のガイド')) {
        return heading;
      }
    }
    
    return null;
  }
  
  // モバイル用CSS
  function addMobileCSS() {
    const style = document.createElement('style');
    style.id = 'mobile-sponsor-buttons-css';
    style.textContent = `
      /* モバイル専用協賛店ボタン */
      @media (max-width: 768px) {
        .mobile-sponsor-header-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 15px;
          padding: 0 15px;
        }
        
        .mobile-sponsor-btn {
          flex: 1;
          max-width: 140px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .mobile-sponsor-btn.register {
          background: linear-gradient(135deg, #4A90E2, #357ABD);
        }
        
        .mobile-sponsor-btn.login {
          background: linear-gradient(135deg, #50E3C2, #4ECDC4);
        }
        
        .mobile-sponsor-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        /* 既存の固定ボタンを非表示 */
        .sponsor-btn-fixed,
        .fixed-sponsor-btn,
        .mobile-sponsor-fix,
        .mobile-sponsor-buttons,
        .mobile-sponsor-container {
          display: none !important;
        }
      }
      
      /* デスクトップでは非表示 */
      @media (min-width: 769px) {
        .mobile-sponsor-header-buttons {
          display: none !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // 新しいボタンを作成
  function createNewButtons() {
    if (!isMobile()) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mobile-sponsor-header-buttons';
    buttonContainer.innerHTML = `
      <button class="mobile-sponsor-btn register" onclick="openSponsorRegistration()">
        🏪 協賛店登録
      </button>
      <button class="mobile-sponsor-btn login" onclick="openSponsorLogin()">
        🔑 ログイン
      </button>
    `;
    
    return buttonContainer;
  }
  
  // ボタンを配置
  function placeButtons() {
    // 既存のボタンを削除
    const existingButtons = document.querySelector('.mobile-sponsor-header-buttons');
    if (existingButtons) {
      existingButtons.remove();
    }
    
    // 「人気のガイド」セクション全体（section#guides）を見つける
    const guidesSection = document.getElementById('guides');
    if (guidesSection) {
      const newButtons = createNewButtons();
      if (newButtons) {
        // セクションの最初の子要素の前に挿入
        const firstChild = guidesSection.firstElementChild;
        if (firstChild) {
          guidesSection.insertBefore(newButtons, firstChild);
          console.log('✅ ボタンを「人気のガイド」セクション最上部に配置完了');
        }
      }
    } else {
      console.log('⚠️ guidesセクションが見つかりません');
      
      // フォールバック: containerの中の最初の要素の前
      const container = document.querySelector('.container.py-5');
      if (container) {
        const newButtons = createNewButtons();
        if (newButtons) {
          container.insertBefore(newButtons, container.firstElementChild);
          console.log('✅ フォールバック: コンテナ最上部に配置完了');
        }
      }
    }
  }
  
  // グローバル関数
  window.openSponsorRegistration = function() {
    if (confirm('協賛店登録ページに移動しますか？')) {
      window.location.href = '/sponsor-registration.html';
    }
  };
  
  window.openSponsorLogin = function() {
    const loginModal = document.getElementById('sponsorLoginModal');
    if (loginModal && window.bootstrap) {
      try {
        new bootstrap.Modal(loginModal).show();
      } catch (e) {
        alert('ログイン機能は開発中です');
      }
    } else {
      alert('ログイン機能は開発中です');
    }
  };
  
  // レスポンシブ対応
  function setupResponsive() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleResize(e) {
      if (e.matches) {
        // モバイル表示
        removeOldButtons();
        
        // 既存のボタンがない場合のみ追加
        if (!document.querySelector('.mobile-sponsor-header-buttons')) {
          placeButtons();
        }
      } else {
        // デスクトップ表示
        const mobileButtons = document.querySelector('.mobile-sponsor-header-buttons');
        if (mobileButtons) {
          mobileButtons.style.display = 'none';
        }
      }
    }
    
    handleResize(mediaQuery);
    mediaQuery.addListener(handleResize);
  }
  
  // 初期化
  function initialize() {
    try {
      addMobileCSS();
      removeOldButtons();
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          placeButtons();
          setupResponsive();
        });
      } else {
        placeButtons();
        setupResponsive();
      }
      
      console.log('✅ モバイル協賛店ボタン修正完了');
    } catch (error) {
      console.error('❌ モバイルボタン修正エラー:', error);
    }
  }
  
  initialize();
  
})();