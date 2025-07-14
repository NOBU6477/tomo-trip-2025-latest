/**
 * デスクトップ環境専用の修正スクリプト
 * スマホには影響を与えません
 */

(function() {
  "use strict";
  
  // デスクトップ環境かどうかを判定
  const isDesktop = window.innerWidth >= 768 && 
    (!('ontouchstart' in window) || navigator.maxTouchPoints === 0);
  
  // デスクトップ環境でない場合は実行しない
  if (!isDesktop) {
    console.log('デスクトップ以外の環境を検出しました。デスクトップ修正は適用しません。');
    return;
  }
  
  console.log('デスクトップPC環境を検出しました。デスクトップ向け最適化を適用します。');
  
  // DOMコンテンツ読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', initDesktopFixes);
  
  /**
   * デスクトップ向け修正の初期化
   */
  function initDesktopFixes() {
    // デスクトップ専用のスタイルシートを読み込み
    loadDesktopStylesheet();
    
    // 新規登録ボタンのドロップダウン修正
    fixRegistrationDropdowns();
    
    // その他のPC専用修正
    applyOtherDesktopFixes();
  }
  
  /**
   * デスクトップ専用スタイルシートの読み込み
   */
  function loadDesktopStylesheet() {
    const desktopStyles = document.createElement('link');
    desktopStyles.rel = 'stylesheet';
    // desktopStyles.href = 'desktop-fixes.css'; // 無効化 - ファイル存在しない
    document.head.appendChild(desktopStyles);
  }
  
  /**
   * 新規登録ボタンのドロップダウンメニュー修正
   */
  function fixRegistrationDropdowns() {
    // 新規登録ボタンを取得
    const registerButton = document.querySelector('.dropdown-toggle[data-bs-toggle="dropdown"]');
    
    if (registerButton) {
      // ドロップダウンイベントをリッスン
      registerButton.addEventListener('shown.bs.dropdown', function() {
        const menu = document.querySelector('.dropdown-menu.show');
        
        if (menu) {
          // 特殊クラスを追加
          menu.classList.add('registration-types');
          
          // 各アイテムの幅を自動調整
          const items = menu.querySelectorAll('.dropdown-item');
          let maxWidth = 0;
          
          items.forEach(function(item) {
            const itemWidth = getTextWidth(item.textContent, getComputedStyle(item).font);
            maxWidth = Math.max(maxWidth, itemWidth);
          });
          
          // 余裕を持たせて設定
          if (maxWidth > 0) {
            menu.style.width = (maxWidth + 40) + 'px';
          }
        }
      });
    }
    
    // すでに開いているドロップダウンにも適用
    document.querySelectorAll('.dropdown-menu.show').forEach(function(menu) {
      menu.classList.add('registration-types');
      
      const items = menu.querySelectorAll('.dropdown-item');
      let maxWidth = 0;
      
      items.forEach(function(item) {
        const itemWidth = getTextWidth(item.textContent, getComputedStyle(item).font);
        maxWidth = Math.max(maxWidth, itemWidth);
      });
      
      if (maxWidth > 0) {
        menu.style.width = (maxWidth + 40) + 'px';
      }
    });
  }
  
  /**
   * テキストの描画幅を計算するヘルパー関数
   */
  function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  
  /**
   * その他のPC環境向け修正
   */
  function applyOtherDesktopFixes() {
    // Bootstrapドロップダウンイベントをリッスン
    document.addEventListener('shown.bs.dropdown', function(event) {
      const dropdown = event.target;
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (menu && !menu.classList.contains('registration-types')) {
        // 任意のドロップダウンメニュー調整
        const items = menu.querySelectorAll('.dropdown-item');
        let maxWidth = 0;
        
        items.forEach(function(item) {
          const itemWidth = getTextWidth(item.textContent, getComputedStyle(item).font);
          maxWidth = Math.max(maxWidth, itemWidth);
        });
        
        if (maxWidth > 0) {
          menu.style.minWidth = (maxWidth + 30) + 'px';
        }
      }
    });
  }
})();