/**
 * 緊急モバイル修復システム
 * UIクラッシュを解決し、モバイル用の協賛店登録・ログインボタンを実装
 */

(function() {
  'use strict';
  
  console.log('🚨 緊急モバイル修復システム開始');
  
  // 無限ループの停止
  function stopInfiniteLoops() {
    // すべてのsetIntervalとsetTimeoutを制限
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    
    let intervalCount = 0;
    let timeoutCount = 0;
    
    window.setInterval = function(fn, delay) {
      intervalCount++;
      if (intervalCount > 10) {
        console.warn('⚠️ 過度なsetInterval呼び出しを阻止');
        return null;
      }
      return originalSetInterval.call(this, fn, delay);
    };
    
    window.setTimeout = function(fn, delay) {
      timeoutCount++;
      if (timeoutCount > 50) {
        console.warn('⚠️ 過度なsetTimeout呼び出しを阻止');
        return null;
      }
      return originalSetTimeout.call(this, fn, delay);
    };
  }
  
  // モバイル検出
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  }
  
  // モバイル用協賛店ボタンシステム
  function setupMobileSponsorButtons() {
    if (!isMobileDevice()) return;
    
    console.log('📱 モバイル用協賛店ボタン設定開始');
    
    // 既存の固定ボタンを無効化
    const existingFixedButtons = document.querySelectorAll('.fixed-sponsor-btn, .sponsor-btn-fixed');
    existingFixedButtons.forEach(btn => {
      btn.style.display = 'none';
    });
    
    // モバイル用のフローティングボタンエリアを作成
    const mobileButtonContainer = document.createElement('div');
    mobileButtonContainer.id = 'mobile-sponsor-container';
    mobileButtonContainer.className = 'mobile-sponsor-container';
    mobileButtonContainer.innerHTML = `
      <style>
        .mobile-sponsor-container {
          position: fixed;
          bottom: 20px;
          right: 15px;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .mobile-sponsor-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          min-width: 120px;
          text-align: center;
          cursor: pointer;
        }
        
        .mobile-sponsor-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .mobile-sponsor-btn.login {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        @media (min-width: 769px) {
          .mobile-sponsor-container {
            display: none;
          }
        }
      </style>
      
      <button class="mobile-sponsor-btn" onclick="showSponsorRegistration()">
        🏪 協賛店登録
      </button>
      <button class="mobile-sponsor-btn login" onclick="showSponsorLogin()">
        🔑 ログイン
      </button>
    `;
    
    document.body.appendChild(mobileButtonContainer);
    console.log('✅ モバイル用協賛店ボタン設置完了');
  }
  
  // デスクトップ用ボタンの保護
  function protectDesktopButtons() {
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    
    function handleDesktopView(e) {
      if (e.matches) {
        // デスクトップ表示
        const mobileContainer = document.getElementById('mobile-sponsor-container');
        if (mobileContainer) {
          mobileContainer.style.display = 'none';
        }
        
        // デスクトップ用の既存ボタンを表示
        const desktopButtons = document.querySelectorAll('.sponsor-btn-fixed');
        desktopButtons.forEach(btn => {
          btn.style.display = 'block';
        });
      } else {
        // モバイル表示
        const mobileContainer = document.getElementById('mobile-sponsor-container');
        if (mobileContainer) {
          mobileContainer.style.display = 'flex';
        }
        
        // デスクトップ用ボタンを非表示
        const desktopButtons = document.querySelectorAll('.sponsor-btn-fixed');
        desktopButtons.forEach(btn => {
          btn.style.display = 'none';
        });
      }
    }
    
    mediaQuery.addListener(handleDesktopView);
    handleDesktopView(mediaQuery);
  }
  
  // CSS衝突の解決
  function fixCSSConflicts() {
    const emergencyCSS = document.createElement('style');
    emergencyCSS.innerHTML = `
      /* モバイル用の基本修正 */
      @media (max-width: 768px) {
        body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        
        .container, .container-fluid {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }
        
        /* 固定ボタンの非表示 */
        .fixed-sponsor-btn,
        .sponsor-btn-fixed {
          display: none !important;
        }
        
        /* ナビゲーションの調整 */
        .navbar-brand img {
          height: 30px !important;
        }
        
        /* フィルターセクションの調整 */
        .filter-section {
          padding: 10px !important;
        }
        
        /* ガイドカードの調整 */
        .guide-card {
          margin-bottom: 15px !important;
        }
      }
      
      /* デスクトップでは通常通り */
      @media (min-width: 769px) {
        .mobile-sponsor-container {
          display: none !important;
        }
      }
    `;
    
    document.head.appendChild(emergencyCSS);
  }
  
  // グローバル関数の定義
  window.showSponsorRegistration = function() {
    alert('協賛店登録ページに移動します');
    window.location.href = '/sponsor-registration.html';
  };
  
  window.showSponsorLogin = function() {
    alert('協賛店ログインページに移動します');
    // ログインモーダルを表示またはページに移動
    const loginModal = document.getElementById('sponsorLoginModal');
    if (loginModal && window.bootstrap) {
      new bootstrap.Modal(loginModal).show();
    }
  };
  
  // 初期化
  function initialize() {
    stopInfiniteLoops();
    fixCSSConflicts();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setupMobileSponsorButtons();
        protectDesktopButtons();
      });
    } else {
      setupMobileSponsorButtons();
      protectDesktopButtons();
    }
  }
  
  initialize();
  console.log('✅ 緊急モバイル修復システム完了');
  
})();