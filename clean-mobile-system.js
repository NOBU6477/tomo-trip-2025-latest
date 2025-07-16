/**
 * クリーンなモバイルシステム
 * シンプルで安全なモバイル対応とスタックオーバーフロー問題の解決
 */

// 即座に実行してスタックオーバーフローを停止
if (typeof window !== 'undefined') {
  // 無限ループの即座停止
  let intervalId = setInterval(() => {}, 1);
  for (let i = 1; i < intervalId + 1000; i++) {
    clearInterval(i);
    clearTimeout(i);
  }
  
  console.log('🛑 すべてのタイマー停止完了');
}

(function() {
  'use strict';
  
  // 初期化フラグ
  if (window.cleanMobileSystemInitialized) {
    return; // 重複実行を防止
  }
  window.cleanMobileSystemInitialized = true;
  
  console.log('📱 クリーンモバイルシステム開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // モバイル用CSS適用
  function applyMobileCSS() {
    const style = document.createElement('style');
    style.id = 'clean-mobile-css';
    style.textContent = `
      /* モバイル基本修正 */
      @media (max-width: 768px) {
        body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          padding-right: 0 !important;
        }
        
        .modal-open {
          overflow: auto !important;
          padding-right: 0 !important;
        }
        
        /* 固定ボタンの非表示 */
        .sponsor-btn-fixed,
        .fixed-sponsor-btn,
        [class*="fixed-buttons"] {
          display: none !important;
        }
        
        /* モバイル協賛店ボタン */
        .mobile-sponsor-buttons {
          position: fixed;
          bottom: 15px;
          right: 15px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .mobile-sponsor-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          min-width: 100px;
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .mobile-sponsor-btn:hover {
          transform: scale(1.05);
        }
        
        .mobile-sponsor-btn.login {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }
        
        /* ナビゲーション調整 */
        .navbar-brand img {
          height: 35px !important;
        }
        
        .navbar-nav {
          text-align: center;
        }
        
        /* コンテナ調整 */
        .container {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        
        /* ガイドカード調整 */
        .guide-card {
          margin-bottom: 15px !important;
        }
        
        .card-body {
          padding: 1rem !important;
        }
      }
      
      /* デスクトップでは非表示 */
      @media (min-width: 769px) {
        .mobile-sponsor-buttons {
          display: none !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // モバイル協賛店ボタンの作成
  function createMobileButtons() {
    if (!isMobile()) return;
    
    // 既存のモバイルボタンをチェック
    if (document.getElementById('mobile-sponsor-buttons')) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'mobile-sponsor-buttons';
    buttonContainer.className = 'mobile-sponsor-buttons';
    buttonContainer.innerHTML = `
      <button class="mobile-sponsor-btn" onclick="goToSponsorRegister()">
        🏪 協賛店登録
      </button>
      <button class="mobile-sponsor-btn login" onclick="goToSponsorLogin()">
        🔑 ログイン
      </button>
    `;
    
    document.body.appendChild(buttonContainer);
    console.log('📱 モバイルボタン作成完了');
  }
  
  // グローバル関数
  window.goToSponsorRegister = function() {
    if (confirm('協賛店登録ページに移動しますか？')) {
      window.location.href = '/sponsor-registration.html';
    }
  };
  
  window.goToSponsorLogin = function() {
    // ログインモーダルがあれば表示、なければアラート
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
  
  // レスポンシブ監視
  function setupResponsiveMonitoring() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleResize(e) {
      const mobileButtons = document.getElementById('mobile-sponsor-buttons');
      if (e.matches) {
        // モバイル表示
        if (!mobileButtons) {
          createMobileButtons();
        }
      } else {
        // デスクトップ表示
        if (mobileButtons) {
          mobileButtons.style.display = 'none';
        }
      }
    }
    
    // 初回チェック
    handleResize(mediaQuery);
    
    // リサイズ監視
    mediaQuery.addListener(handleResize);
  }
  
  // 初期化実行
  function initialize() {
    try {
      applyMobileCSS();
      createMobileButtons();
      setupResponsiveMonitoring();
      
      console.log('✅ クリーンモバイルシステム完了');
    } catch (error) {
      console.error('❌ モバイルシステムエラー:', error);
    }
  }
  
  // DOM準備完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();