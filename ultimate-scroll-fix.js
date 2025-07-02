/**
 * 最終的なスクロール修復システム
 * すべてのスクロール問題を根本的に解決
 */
(function() {
  'use strict';
  
  console.log('🚀 最終スクロール修復開始');
  
  // 即座に実行する緊急修復
  function emergencyFix() {
    // 全ての既存のoverflow設定を削除
    document.body.removeAttribute('style');
    document.documentElement.removeAttribute('style');
    
    // 最高優先度のスタイルを直接適用
    const style = document.createElement('style');
    style.id = 'ultimate-scroll-fix';
    style.innerHTML = `
      html, body {
        overflow: auto !important;
        overflow-y: auto !important;
        height: auto !important;
        max-height: none !important;
        position: static !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      body {
        min-height: 100vh !important;
      }
      
      * {
        box-sizing: border-box !important;
      }
      
      /* すべてのモーダル関連スタイルを無効化 */
      .modal-open {
        overflow: auto !important;
        padding-right: 0 !important;
      }
      
      .modal-backdrop {
        display: none !important;
      }
      
      /* 固定要素による干渉を防止 */
      [style*="position: fixed"][style*="height: 100vh"] {
        position: relative !important;
        height: auto !important;
      }
    `;
    
    // head要素の最初に追加して最高優先度を確保
    document.head.insertBefore(style, document.head.firstChild);
    
    console.log('✅ 緊急修復完了');
  }
  
  // 継続監視システム
  function startMonitoring() {
    setInterval(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      
      // overflow:hiddenが設定されている場合は即座に修復
      if (bodyStyle.overflow === 'hidden' || bodyStyle.overflowY === 'hidden') {
        emergencyFix();
        console.log('🔧 overflow:hidden検出・修復');
      }
      
      // height:100vhによる問題も修復
      if (bodyStyle.height === '100vh' || document.body.style.height === '100vh') {
        document.body.style.height = 'auto';
        console.log('🔧 height:100vh修復');
      }
    }, 100);
  }
  
  // 初期化
  function initialize() {
    // 即座に修復実行
    emergencyFix();
    
    // 少し遅延して再実行
    setTimeout(emergencyFix, 100);
    setTimeout(emergencyFix, 300);
    setTimeout(emergencyFix, 500);
    
    // 継続監視開始
    startMonitoring();
    
    console.log('✅ 最終スクロール修復システム完全初期化');
  }
  
  // 即座に実行
  initialize();
  
  // DOMContentLoaded後にも実行
  document.addEventListener('DOMContentLoaded', initialize);
  
  // load後にも実行
  window.addEventListener('load', initialize);
  
  // グローバル関数として公開
  window.ultimateScrollFix = emergencyFix;
  
})();