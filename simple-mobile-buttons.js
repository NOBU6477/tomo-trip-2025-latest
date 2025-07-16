/**
 * シンプルモバイルボタンシステム
 * モバイル専用の協賛店登録・ログインボタン
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 シンプルモバイルボタンシステム開始');
  
  // モバイル検出
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // 既存の固定ボタンを削除
  function removeOldButtons() {
    const oldButtons = document.querySelectorAll(
      '.mobile-sponsor-fix, .mobile-sponsor-buttons, .mobile-sponsor-container, ' +
      '.sponsor-btn-fixed, .fixed-sponsor-btn, .mobile-sponsor-header-buttons'
    );
    oldButtons.forEach(btn => btn.remove());
  }
  
  // CSS追加
  function addCSS() {
    const style = document.createElement('style');
    style.id = 'simple-mobile-buttons-css';
    style.textContent = `
      @media (max-width: 768px) {
        .simple-mobile-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 15px auto;
          padding: 0 20px;
        }
        
        .simple-mobile-btn {
          flex: 1;
          max-width: 150px;
          padding: 10px 15px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 25px;
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .simple-mobile-btn.register {
          background: linear-gradient(135deg, #007bff, #0056b3);
        }
        
        .simple-mobile-btn.login {
          background: linear-gradient(135deg, #28a745, #1e7e34);
        }
        
        .simple-mobile-btn:active {
          transform: scale(0.95);
        }
        
        /* 既存の固定ボタンを非表示 */
        .sponsor-btn-fixed,
        .fixed-sponsor-btn,
        [style*="position: fixed"] {
          display: none !important;
        }
      }
      
      @media (min-width: 769px) {
        .simple-mobile-buttons {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // ボタンを作成
  function createButtons() {
    if (!isMobile()) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'simple-mobile-buttons';
    buttonContainer.innerHTML = `
      <button class="simple-mobile-btn register" onclick="goToSponsorReg()">
        🏪 協賛店登録
      </button>
      <button class="simple-mobile-btn login" onclick="showSponsorLogin()">
        🔑 ログイン
      </button>
    `;
    
    return buttonContainer;
  }
  
  // ボタンを配置
  function placeButtons() {
    removeOldButtons();
    
    const guidesSection = document.getElementById('guides');
    if (guidesSection && isMobile()) {
      const buttons = createButtons();
      if (buttons) {
        guidesSection.insertBefore(buttons, guidesSection.firstElementChild);
        console.log('✅ モバイルボタンを配置完了');
      }
    }
  }
  
  // グローバル関数
  window.goToSponsorReg = function() {
    window.location.href = '/sponsor-registration.html';
  };
  
  window.showSponsorLogin = function() {
    alert('ログイン機能は開発中です');
  };
  
  // 継続的配置システム（mobile-cleanup-fix.jsとの競合回避）
  function continuouslyPlaceButtons() {
    if (!isMobile()) return;
    
    placeButtons();
    
    // 7秒ごとに再配置（競合回避のため頻度を下げる）
    setTimeout(continuouslyPlaceButtons, 7000);
  }
  
  // 初期化
  addCSS();
  placeButtons();
  continuouslyPlaceButtons(); // 継続的配置開始
  
  // リサイズ監視
  window.addEventListener('resize', function() {
    setTimeout(placeButtons, 100);
  });
  
  console.log('✅ シンプルモバイルボタンシステム完了');
});