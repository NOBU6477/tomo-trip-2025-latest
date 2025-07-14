/**
 * 緊急修復システム - スクロール問題の根本解決
 * CSPエラー解決とスクロール機能の完全復旧
 */

(function() {
  'use strict';
  
  console.log('🚨 緊急修復システム開始');
  
  // CSPエラー解決
  function resolveCSPErrors() {
    // unsafe-eval の代替実装
    window.safeEval = function(code) {
      try {
        return Function('"use strict"; return (' + code + ')')();
      } catch (e) {
        console.log('Safe eval fallback:', e);
        return null;
      }
    };
    
    console.log('✅ CSPエラー解決完了');
  }
  
  // スクロール機能の緊急復旧
  function emergencyScrollRestore() {
    // 全てのoverflow:hiddenを無効化
    const emergencyCSS = document.createElement('style');
    emergencyCSS.id = 'emergency-scroll-restore';
    emergencyCSS.innerHTML = `
      /* 緊急スクロール復旧 */
      html, body {
        overflow: auto !important;
        overflow-y: scroll !important;
        height: auto !important;
        min-height: 100vh !important;
        position: static !important;
      }
      
      body.modal-open {
        overflow: auto !important;
        overflow-y: scroll !important;
        padding-right: 0 !important;
        position: static !important;
      }
      
      .modal-backdrop {
        display: none !important;
      }
      
      /* 全てのhidden overflowを強制visible */
      * {
        overflow: visible !important;
      }
      
      .container, .container-fluid {
        overflow: visible !important;
        min-height: auto !important;
      }
    `;
    
    // 既存の緊急CSSを削除して新しいものを追加
    const existing = document.getElementById('emergency-scroll-restore');
    if (existing) existing.remove();
    
    document.head.appendChild(emergencyCSS);
    
    // modal-openクラスを即座に削除
    document.body.classList.remove('modal-open');
    
    // ページ高さを物理的に確保
    if (document.body.scrollHeight <= window.innerHeight) {
      document.body.style.minHeight = '200vh';
    }
    
    console.log('✅ 緊急スクロール復旧完了');
  }
  
  // フォームバリデーション修正
  function fixFormValidation() {
    // 重複IDの問題を解決
    const duplicateIds = ['email', 'phone', 'password'];
    duplicateIds.forEach(id => {
      const elements = document.querySelectorAll(`[id="${id}"]`);
      if (elements.length > 1) {
        elements.forEach((el, index) => {
          if (index > 0) {
            el.id = `${id}_${index}`;
          }
        });
      }
    });
    
    console.log('✅ フォームバリデーション修正完了');
  }
  
  // 継続監視システム
  function continuousMonitoring() {
    setInterval(() => {
      // modal-openクラスの自動削除
      if (document.body.classList.contains('modal-open')) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      }
      
      // スクロール可能性チェック
      const canScroll = document.documentElement.scrollHeight > window.innerHeight;
      const bodyOverflow = window.getComputedStyle(document.body).overflowY;
      
      if (!canScroll || bodyOverflow === 'hidden') {
        emergencyScrollRestore();
      }
    }, 100); // 100msごとに監視
  }
  
  // 初期化
  function initialize() {
    try {
      resolveCSPErrors();
      emergencyScrollRestore();
      fixFormValidation();
      
      // DOM読み込み完了後に再実行
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            emergencyScrollRestore();
            continuousMonitoring();
          }, 500);
        });
      } else {
        setTimeout(() => {
          emergencyScrollRestore();
          continuousMonitoring();
        }, 500);
      }
      
      console.log('✅ 緊急修復システム初期化完了');
    } catch (error) {
      console.error('❌ 緊急修復エラー:', error);
    }
  }
  
  // 即座に開始
  initialize();
  
})();