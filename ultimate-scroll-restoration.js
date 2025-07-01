/**
 * 究極のスクロール復元システム
 * あらゆる原因による スクロール無効化を検出・修正
 */
(function() {
  'use strict';
  
  console.log('⚡ 究極スクロール復元システム開始');
  
  // 定期的なスクロール状態監視
  let scrollMonitorInterval;
  
  function startScrollMonitoring() {
    console.log('📡 スクロール監視開始');
    
    scrollMonitorInterval = setInterval(() => {
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const bodyOverflowY = window.getComputedStyle(document.body).overflowY;
      const hasModalOpen = document.body.classList.contains('modal-open');
      
      if (bodyOverflow === 'hidden' || bodyOverflowY === 'hidden' || hasModalOpen) {
        console.log('🚨 スクロール問題検出 - 即座に修正');
        executeUltimateScrollFix();
      }
    }, 200); // 0.2秒ごとにチェック
  }
  
  function stopScrollMonitoring() {
    if (scrollMonitorInterval) {
      clearInterval(scrollMonitorInterval);
      scrollMonitorInterval = null;
      console.log('📡 スクロール監視停止');
    }
  }
  
  // 究極のスクロール修正処理
  function executeUltimateScrollFix() {
    console.log('⚡ 究極修正実行中...');
    
    // 1. Bootstrap Modal関連の強制削除
    document.body.classList.remove('modal-open');
    
    // 2. 全てのoverflow設定を強制リセット
    const elementsToFix = [document.body, document.documentElement];
    elementsToFix.forEach(element => {
      element.style.overflow = '';
      element.style.overflowY = '';
      element.style.overflowX = '';
      element.style.height = '';
      element.style.maxHeight = '';
      element.style.paddingRight = '';
      element.style.position = '';
      element.style.touchAction = '';
    });
    
    // 3. modal-backdrop の完全削除
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.remove();
    });
    
    // 4. CSSで強制的にスクロール有効化
    let fixStyle = document.getElementById('ultimate-scroll-fix');
    if (!fixStyle) {
      fixStyle = document.createElement('style');
      fixStyle.id = 'ultimate-scroll-fix';
      document.head.appendChild(fixStyle);
    }
    
    fixStyle.textContent = `
      body, html {
        overflow: visible !important;
        overflow-y: auto !important;
        height: auto !important;
        max-height: none !important;
        position: static !important;
        padding-right: 0 !important;
      }
      
      body.modal-open {
        overflow: visible !important;
        overflow-y: auto !important;
        padding-right: 0 !important;
      }
      
      .modal-backdrop {
        display: none !important;
      }
    `;
    
    // 5. JavaScript での強制スクロール有効化
    setTimeout(() => {
      window.scrollTo(0, window.pageYOffset);
    }, 10);
    
    console.log('✅ 究極修正完了');
  }
  
  // 言語切り替え時の特別処理
  function setupLanguageSpecificFix() {
    // グローバル関数をオーバーライド
    const originalForceLanguageSwitch = window.forceLanguageSwitch;
    
    if (originalForceLanguageSwitch) {
      window.forceLanguageSwitch = function(lang) {
        console.log('🌐 言語切り替え開始:', lang);
        
        // 監視を一時停止
        stopScrollMonitoring();
        
        // 元の処理実行前に修正
        executeUltimateScrollFix();
        
        // 元の処理実行
        const result = originalForceLanguageSwitch(lang);
        
        // 処理完了後に複数回修正実行
        const fixIntervals = [100, 300, 500, 1000, 2000];
        fixIntervals.forEach(delay => {
          setTimeout(() => {
            executeUltimateScrollFix();
          }, delay);
        });
        
        // 監視再開
        setTimeout(() => {
          startScrollMonitoring();
        }, 3000);
        
        return result;
      };
    }
  }
  
  // イベントハンドラーの設定
  function setupEventHandlers() {
    // ページ読み込み完了時
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(executeUltimateScrollFix, 100);
    });
    
    // ウィンドウリサイズ時
    window.addEventListener('resize', () => {
      setTimeout(executeUltimateScrollFix, 100);
    });
    
    // フォーカス時（他のタブから戻った時）
    window.addEventListener('focus', () => {
      setTimeout(executeUltimateScrollFix, 100);
    });
    
    console.log('✅ イベントハンドラー設定完了');
  }
  
  // グローバル関数として公開
  window.executeUltimateScrollFix = executeUltimateScrollFix;
  window.startScrollMonitoring = startScrollMonitoring;
  window.stopScrollMonitoring = stopScrollMonitoring;
  
  // 初期化
  function initialize() {
    // 即座に修正実行
    executeUltimateScrollFix();
    
    // イベントハンドラー設定
    setupEventHandlers();
    
    // 言語切り替え処理設定
    setupLanguageSpecificFix();
    
    // 監視開始
    setTimeout(startScrollMonitoring, 1000);
    
    console.log('⚡ 究極スクロール復元システム初期化完了');
    console.log('利用可能な関数:');
    console.log('- executeUltimateScrollFix() : 究極修正実行');
    console.log('- startScrollMonitoring() : 監視開始');
    console.log('- stopScrollMonitoring() : 監視停止');
  }
  
  // 即座に初期化実行
  initialize();
  
})();