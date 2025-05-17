/**
 * ボタンのテキストを直接DOMに挿入するスクリプト
 * HTMLを直接書き換えることで確実に日本語化します
 */
(function() {
  'use strict';
  
  // スクリプト実行開始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
  
  /**
   * スタイルシートとオーバーライドスクリプトを挿入
   */
  function injectStyles() {
    // スタイルシートの挿入
    const style = document.createElement('style');
    style.textContent = `
      /* PHOTOボタン用カスタムCSSセレクタ */
      .modal button.btn-primary:first-of-type::after {
        content: "ファイルを選択" !important;
        display: inline !important;
      }
      
      .modal button.btn-secondary:nth-of-type(2)::after {
        content: "カメラで撮影" !important;
        display: inline !important;
      }
      
      /* 元のテキストを非表示 */
      .modal button.btn-primary:first-of-type span,
      .modal button.btn-secondary:nth-of-type(2) span {
        font-size: 0 !important;
      }
      
      /* ボタンアイコンは表示 */
      .modal button.btn-primary:first-of-type i,
      .modal button.btn-secondary:nth-of-type(2) i {
        display: inline-block !important;
        margin-right: 5px !important;
      }
    `;
    document.head.appendChild(style);
    
    // ツーリスト/ガイド登録ボタンのクリックイベント
    document.querySelectorAll('.tourist-register-btn, .guide-register-btn').forEach(button => {
      button.addEventListener('click', function() {
        setTimeout(directReplaceButtons, 500);
      });
    });
    
    // すぐに一度実行
    directReplaceButtons();
    
    // モーダル表示時に実行
    document.addEventListener('shown.bs.modal', function() {
      setTimeout(directReplaceButtons, 200);
    });
    
    // 一定間隔で複数回実行して確実に適用
    [500, 1000, 2000, 3000].forEach(delay => {
      setTimeout(directReplaceButtons, delay);
    });
  }
  
  /**
   * ボタンのテキストを直接置換
   */
  function directReplaceButtons() {
    try {
      // 表示中のモーダルを検出
      const modals = document.querySelectorAll('.modal.show');
      
      modals.forEach(modal => {
        // ファイル選択ボタン
        const selectButtons = modal.querySelectorAll('button');
        selectButtons.forEach(button => {
          const text = button.textContent.trim();
          
          if (text.includes('PHOTO SELECT') || text.includes('Photo Select')) {
            // ボタンのHTMLを完全に置き換え
            button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
          }
          
          if (text.includes('PHOTO CAMERA') || text.includes('Photo Camera')) {
            // ボタンのHTMLを完全に置き換え
            button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          }
        });
      });
      
      console.log('ボタン直接挿入完了');
    } catch (error) {
      console.error('ボタン直接挿入エラー:', error);
    }
  }
})();