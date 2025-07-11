/**
 * ロゴとスクロールの緊急修正システム
 * 問題を根本から解決
 */

(function() {
  'use strict';
  
  console.log('🚨 緊急修正システム開始');
  
  // ロゴを強制表示する関数
  function forceDisplayLogo() {
    // 既存のロゴ要素を探す
    let logo = document.getElementById('tomotrip-logo-fixed');
    
    if (!logo) {
      // ロゴが存在しない場合は作成
      logo = document.createElement('div');
      logo.id = 'tomotrip-logo-fixed';
      logo.innerHTML = '🌴 TomoTrip';
      document.body.appendChild(logo);
    }
    
    // ロゴのスタイルを強制設定
    const logoStyles = {
      position: 'fixed',
      top: '30px',
      left: '30px',
      zIndex: '9999',
      background: 'rgba(255,255,255,0.98)',
      padding: '20px 30px',
      borderRadius: '50px',
      fontWeight: 'bold',
      color: '#2c3e50',
      fontSize: '32px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(15px)',
      border: '3px solid rgba(255,255,255,0.5)',
      fontFamily: 'Arial, sans-serif',
      display: 'block',
      visibility: 'visible',
      opacity: '1',
      transform: 'none',
      transition: 'none'
    };
    
    // スタイルを一つずつ適用
    Object.keys(logoStyles).forEach(key => {
      logo.style[key] = logoStyles[key];
    });
    
    // !important を追加
    logo.style.cssText = `
      position: fixed !important;
      top: 30px !important;
      left: 30px !important;
      z-index: 9999 !important;
      background: rgba(255,255,255,0.98) !important;
      padding: 20px 30px !important;
      border-radius: 50px !important;
      font-weight: bold !important;
      color: #2c3e50 !important;
      font-size: 32px !important;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4) !important;
      backdrop-filter: blur(15px) !important;
      border: 3px solid rgba(255,255,255,0.5) !important;
      font-family: Arial, sans-serif !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      transform: none !important;
    `;
    
    console.log('✅ ロゴ強制表示完了');
  }
  
  // スクロールを完全に有効化する関数
  function forceEnableScroll() {
    // 問題のあるクラスとスタイルを削除
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    
    // スクロール可能にする
    document.body.style.cssText = `
      overflow: auto !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      height: auto !important;
      position: static !important;
      padding-right: 0 !important;
      margin-right: 0 !important;
    `;
    
    document.documentElement.style.cssText = `
      overflow: auto !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      height: auto !important;
      position: static !important;
    `;
    
    // すべての要素のoverflow:hiddenを強制削除
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.style.overflow === 'hidden') {
        el.style.overflow = 'visible';
      }
    });
    
    console.log('✅ スクロール強制有効化完了');
  }
  
  // CSS強制注入
  function injectEmergencyCSS() {
    const style = document.createElement('style');
    style.id = 'emergency-logo-scroll-fix';
    style.textContent = `
      /* ロゴ強制表示 */
      #tomotrip-logo-fixed {
        position: fixed !important;
        top: 30px !important;
        left: 30px !important;
        z-index: 9999 !important;
        background: rgba(255,255,255,0.98) !important;
        padding: 20px 30px !important;
        border-radius: 50px !important;
        font-weight: bold !important;
        color: #2c3e50 !important;
        font-size: 32px !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4) !important;
        backdrop-filter: blur(15px) !important;
        border: 3px solid rgba(255,255,255,0.5) !important;
        font-family: Arial, sans-serif !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
      }
      
      /* スクロール強制有効化 */
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        height: auto !important;
        position: static !important;
        padding-right: 0 !important;
        margin-right: 0 !important;
      }
      
      body.modal-open {
        overflow: auto !important;
        padding-right: 0 !important;
      }
      
      .modal-open {
        overflow: auto !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ 緊急CSS注入完了');
  }
  
  // 継続的監視システム
  function setupEmergencyMonitoring() {
    // 50ms間隔で強制修正（10msは重すぎるため調整）
    setInterval(() => {
      forceDisplayLogo();
      forceEnableScroll();
    }, 50);
    
    // MutationObserver
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        forceDisplayLogo();
        forceEnableScroll();
      }, 10);
    });
    
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });
    
    // ページの可視性変更時にも実行
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        forceDisplayLogo();
        forceEnableScroll();
      }
    });
    
    console.log('✅ 緊急監視システム開始');
  }
  
  // 初期化
  function initialize() {
    injectEmergencyCSS();
    forceDisplayLogo();
    forceEnableScroll();
    setupEmergencyMonitoring();
    
    console.log('🎯 緊急修正システム完了');
  }
  
  // 即座に実行
  initialize();
  
  // DOM読み込み後にも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  // ページ表示時にも実行
  window.addEventListener('load', initialize);
  
})();