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
  
  // 既存の固定ボタンと重複ボタンを削除
  function removeOldButtons() {
    const oldButtons = document.querySelectorAll(
      '.mobile-sponsor-fix, .mobile-sponsor-buttons, .mobile-sponsor-container, ' +
      '.sponsor-btn-fixed, .fixed-sponsor-btn, .mobile-sponsor-header-buttons, ' +
      '.simple-mobile-buttons'
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
  
  // ボタンを配置（人気ガイド一覧の上部）
  function placeButtons() {
    removeOldButtons();
    
    // 人気ガイドセクションを探す
    const guidesSection = document.getElementById('guides') || 
                         document.querySelector('.container h2') ||
                         document.querySelector('h2');
    
    if (guidesSection && isMobile()) {
      const buttons = createButtons();
      if (buttons) {
        // h2タイトルの直後に配置
        const guideTitle = document.querySelector('h2');
        if (guideTitle && guideTitle.textContent.includes('人気のガイド')) {
          guideTitle.parentNode.insertBefore(buttons, guideTitle.nextSibling);
        } else {
          // フォールバック：guidesセクションの最初に配置
          guidesSection.insertBefore(buttons, guidesSection.firstElementChild);
        }
        console.log('✅ モバイルボタンを人気ガイド上部に配置完了');
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
  
  // 初期化（1回のみ実行）
  addCSS();
  
  // DOM準備完了後に1回だけ実行
  setTimeout(() => {
    if (isMobile() && !document.querySelector('.simple-mobile-buttons')) {
      placeButtons();
      console.log('✅ モバイルボタンを1回のみ配置');
    }
  }, 2000);
  
  // リサイズ監視
  window.addEventListener('resize', function() {
    setTimeout(placeButtons, 100);
  });
  
  console.log('✅ シンプルモバイルボタンシステム完了');
});