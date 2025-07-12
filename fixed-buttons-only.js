/**
 * 右固定ボタン専用修正システム
 * 投資店登録とログインボタンのみに特化
 */

(function() {
  'use strict';
  
  console.log('右固定ボタン修正開始');

  function createFixedButtons() {
    // 既存の右固定ボタンエリアを削除
    const existingButtons = document.querySelector('.top-right-buttons');
    if (existingButtons) {
      existingButtons.remove();
    }

    // 新しい右固定ボタンエリアを作成
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'fixed-right-buttons';
    buttonContainer.style.cssText = `
      position: fixed !important;
      top: 50% !important;
      right: 20px !important;
      transform: translateY(-50%) !important;
      z-index: 9999 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 15px !important;
      pointer-events: auto !important;
    `;

    // 投資店登録ボタン
    const sponsorButton = document.createElement('button');
    sponsorButton.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="bi bi-shop" style="font-size: 18px;"></i>
        <span>投資店登録</span>
        <span style="font-size: 12px;">✨</span>
      </div>
    `;
    sponsorButton.style.cssText = `
      background: linear-gradient(135deg, #ff6b6b, #feca57) !important;
      border: none !important;
      color: white !important;
      padding: 12px 20px !important;
      border-radius: 25px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
      transition: all 0.3s ease !important;
      min-width: 140px !important;
      white-space: nowrap !important;
    `;
    
    sponsorButton.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    sponsorButton.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
    
    sponsorButton.addEventListener('click', function() {
      alert('投資店登録機能は準備中です');
    });

    // ログインボタン
    const loginButton = document.createElement('button');
    loginButton.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="bi bi-box-arrow-in-right" style="font-size: 18px;"></i>
        <span>ログイン</span>
        <span style="font-size: 12px;">✨</span>
      </div>
    `;
    loginButton.style.cssText = `
      background: linear-gradient(135deg, #4ecdc4, #44a08d) !important;
      border: none !important;
      color: white !important;
      padding: 12px 20px !important;
      border-radius: 25px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      cursor: pointer !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
      transition: all 0.3s ease !important;
      min-width: 140px !important;
      white-space: nowrap !important;
    `;
    
    loginButton.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    loginButton.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
    
    loginButton.addEventListener('click', function() {
      // ログインモーダルを開く
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const modal = new bootstrap.Modal(loginModal);
          modal.show();
        } else {
          // Bootstrap未読み込みの場合の代替
          loginModal.style.display = 'block';
          loginModal.classList.add('show');
          document.body.classList.add('modal-open');
        }
      } else {
        alert('ログイン機能は準備中です');
      }
    });

    // ボタンをコンテナに追加
    buttonContainer.appendChild(sponsorButton);
    buttonContainer.appendChild(loginButton);

    // ページに追加
    document.body.appendChild(buttonContainer);

    console.log('右固定ボタン作成完了');
  }

  // CSS追加
  function addButtonStyles() {
    const style = document.createElement('style');
    style.id = 'fixed-buttons-styles';
    style.textContent = `
      /* 右固定ボタン専用スタイル */
      .fixed-right-buttons {
        position: fixed !important;
        top: 50% !important;
        right: 20px !important;
        transform: translateY(-50%) !important;
        z-index: 9999 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 15px !important;
        pointer-events: auto !important;
      }
      
      .fixed-right-buttons button {
        border: none !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }
      
      .fixed-right-buttons button:hover {
        transform: scale(1.05) !important;
      }
      
      .fixed-right-buttons button:active {
        transform: scale(0.98) !important;
      }
      
      /* モバイル対応 */
      @media (max-width: 768px) {
        .fixed-right-buttons {
          right: 10px !important;
          gap: 10px !important;
        }
        
        .fixed-right-buttons button {
          padding: 10px 16px !important;
          font-size: 13px !important;
          min-width: 120px !important;
        }
      }
    `;
    
    // 既存のスタイルを削除
    const existingStyle = document.getElementById('fixed-buttons-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  }

  // 実行
  function init() {
    addButtonStyles();
    createFixedButtons();
  }

  // 即座に実行
  init();

  // DOM読み込み完了後にも実行
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);

  console.log('右固定ボタンシステム完了');
})();