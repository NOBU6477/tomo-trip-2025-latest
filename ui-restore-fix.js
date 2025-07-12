/**
 * UI復元修正システム
 * 崩れたUIを安全に復元
 */

(function() {
  'use strict';
  
  console.log('UI復元修正開始');

  function restoreUI() {
    // 1. 基本的なCSS復元
    const style = document.createElement('style');
    style.id = 'ui-restore-fix';
    style.textContent = `
      /* 基本的なUI復元 */
      body {
        background-color: #f8f9fa !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        line-height: 1.6 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }
      
      /* ナビゲーション復元 */
      .navbar {
        background-color: #0d6efd !important;
        color: white !important;
        padding: 1rem 0 !important;
        position: relative !important;
        z-index: 1000 !important;
      }
      
      .navbar-brand {
        color: white !important;
        font-size: 1.25rem !important;
        font-weight: bold !important;
        text-decoration: none !important;
      }
      
      .navbar-nav .nav-link {
        color: rgba(255, 255, 255, 0.8) !important;
        padding: 0.5rem 1rem !important;
      }
      
      .navbar-nav .nav-link:hover {
        color: white !important;
      }
      
      /* ボタン復元 */
      .btn {
        display: inline-block !important;
        padding: 0.375rem 0.75rem !important;
        margin-bottom: 0 !important;
        font-size: 1rem !important;
        font-weight: 400 !important;
        line-height: 1.5 !important;
        text-align: center !important;
        text-decoration: none !important;
        vertical-align: middle !important;
        cursor: pointer !important;
        border: 1px solid transparent !important;
        border-radius: 0.375rem !important;
        transition: all 0.15s ease-in-out !important;
      }
      
      .btn-primary {
        background-color: #0d6efd !important;
        border-color: #0d6efd !important;
        color: white !important;
      }
      
      .btn-outline-light {
        border-color: rgba(255, 255, 255, 0.5) !important;
        color: white !important;
        background-color: transparent !important;
      }
      
      .btn-light {
        background-color: white !important;
        border-color: white !important;
        color: #212529 !important;
      }
      
      /* コンテナ復元 */
      .container {
        width: 100% !important;
        padding-right: 15px !important;
        padding-left: 15px !important;
        margin-right: auto !important;
        margin-left: auto !important;
        max-width: 1200px !important;
      }
      
      /* ヒーローセクション復元 */
      .hero-section {
        background: linear-gradient(rgba(66, 135, 245, 0.4), rgba(224, 79, 158, 0.4)), 
                    url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop') center/cover !important;
        min-height: 60vh !important;
        display: flex !important;
        align-items: center !important;
        color: white !important;
        text-align: center !important;
        padding: 4rem 0 !important;
        position: relative !important;
      }
      
      /* ヒーロータイトル */
      .display-4 {
        font-size: 3.5rem !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;
        margin-bottom: 1rem !important;
      }
      
      .lead {
        font-size: 1.25rem !important;
        font-weight: 300 !important;
        margin-bottom: 2rem !important;
      }
      
      /* カード復元 */
      .card {
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
        background-color: white !important;
        border: 1px solid rgba(0,0,0,.125) !important;
        border-radius: 0.375rem !important;
        margin-bottom: 1rem !important;
      }
      
      .card-body {
        flex: 1 1 auto !important;
        padding: 1rem !important;
      }
      
      /* 右上ボタンエリア */
      .top-right-buttons {
        position: fixed !important;
        top: 10px !important;
        right: 20px !important;
        z-index: 9999 !important;
        display: flex !important;
        gap: 10px !important;
        align-items: center !important;
      }
      
      /* スクロール設定 */
      html, body {
        height: auto !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
      }
    `;
    
    // 既存の問題のあるスタイルを削除
    const existingStyles = document.querySelectorAll('#complete-scroll-fix, #ui-restore-fix');
    existingStyles.forEach(style => style.remove());
    
    document.head.appendChild(style);

    // 2. 要素の可視性を確保
    const body = document.body;
    const html = document.documentElement;
    
    body.style.display = 'block';
    body.style.visibility = 'visible';
    body.style.opacity = '1';
    html.style.display = 'block';
    html.style.visibility = 'visible';

    // 3. ナビゲーションバーの確認と修正
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.display = 'block';
      navbar.style.visibility = 'visible';
      navbar.style.position = 'relative';
      navbar.style.zIndex = '1000';
    }

    // 4. ヒーローセクションの確認と修正
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.style.display = 'flex';
      heroSection.style.visibility = 'visible';
      heroSection.style.minHeight = '60vh';
      heroSection.style.alignItems = 'center';
      heroSection.style.justifyContent = 'center';
    }

    // 5. コンテンツの高さ確保
    const mainContent = document.querySelector('main') || body;
    if (mainContent) {
      mainContent.style.minHeight = '100vh';
      mainContent.style.height = 'auto';
    }

    console.log('UI復元修正完了');
  }

  // 即座に実行
  restoreUI();

  // DOM読み込み完了後にも実行
  document.addEventListener('DOMContentLoaded', restoreUI);
  window.addEventListener('load', restoreUI);

  console.log('UI復元修正システム完了');
})();