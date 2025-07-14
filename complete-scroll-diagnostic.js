/**
 * 完全スクロール診断システム - 根本原因特定
 */

(function() {
  'use strict';
  
  console.log('🔍 完全スクロール診断システム開始');
  
  function diagnoseCSSBlocking() {
    console.log('\n📋 CSS診断結果:');
    
    // CSSプロパティをチェック
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    
    console.log('Body overflow:', bodyStyle.overflow);
    console.log('Body overflow-y:', bodyStyle.overflowY);
    console.log('Body height:', bodyStyle.height);
    console.log('Body position:', bodyStyle.position);
    
    console.log('HTML overflow:', htmlStyle.overflow);
    console.log('HTML overflow-y:', htmlStyle.overflowY);
    console.log('HTML height:', htmlStyle.height);
    
    // modal-openクラスの有無をチェック
    console.log('Body has modal-open class:', document.body.classList.contains('modal-open'));
    
    // ページ全体のスクロール可能高さ
    console.log('Document height:', document.documentElement.scrollHeight);
    console.log('Window height:', window.innerHeight);
    console.log('Can scroll:', document.documentElement.scrollHeight > window.innerHeight);
  }
  
  function diagnoseJavaScriptInterference() {
    console.log('\n🔧 JavaScript干渉診断:');
    
    // スクロールイベントリスナーの数
    const scrollListeners = getEventListeners(window)?.scroll?.length || 0;
    console.log('Scroll listeners count:', scrollListeners);
    
    // overflow を変更するスクリプトを検出
    const originalStyle = Element.prototype.style;
    let overflowChanges = 0;
    
    Object.defineProperty(Element.prototype, 'style', {
      get: function() {
        return originalStyle;
      },
      set: function(value) {
        if (typeof value === 'string' && value.includes('overflow')) {
          overflowChanges++;
          console.log('⚠️ Overflow style change detected:', value);
        }
        originalStyle = value;
      }
    });
    
    console.log('Overflow changes detected:', overflowChanges);
  }
  
  function checkElementBlocking() {
    console.log('\n🎯 要素別ブロッキング診断:');
    
    // フルスクリーン要素をチェック
    const fullScreenElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.position === 'fixed' && 
             parseInt(style.width) >= window.innerWidth * 0.9 &&
             parseInt(style.height) >= window.innerHeight * 0.9;
    });
    
    console.log('Full screen elements:', fullScreenElements.length);
    fullScreenElements.forEach(el => {
      console.log('- Element:', el.tagName, el.className);
    });
    
    // オーバーレイ要素をチェック
    const overlayElements = Array.from(document.querySelectorAll('.modal, .overlay, [style*="z-index"]')).filter(el => {
      return window.getComputedStyle(el).display !== 'none';
    });
    
    console.log('Visible overlay elements:', overlayElements.length);
    overlayElements.forEach(el => {
      console.log('- Overlay:', el.tagName, el.className);
    });
  }
  
  function forceScrollEnable() {
    console.log('\n🚀 緊急スクロール有効化実行:');
    
    // すべてのoverflow:hiddenを無効化
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        overflow: visible !important;
      }
      html, body {
        overflow-y: auto !important;
        height: auto !important;
        position: static !important;
      }
      .modal-open {
        overflow-y: auto !important;
        padding-right: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    // modal-openクラスを強制削除
    document.body.classList.remove('modal-open');
    
    // ページ高さを強制確保
    if (document.body.scrollHeight <= window.innerHeight) {
      const spacer = document.createElement('div');
      spacer.style.height = '200vh';
      spacer.style.width = '1px';
      spacer.style.opacity = '0';
      document.body.appendChild(spacer);
      console.log('✅ スペーサー要素を追加しました');
    }
    
    console.log('✅ 緊急スクロール有効化完了');
  }
  
  // 診断実行
  setTimeout(() => {
    diagnoseCSSBlocking();
    diagnoseJavaScriptInterference();
    checkElementBlocking();
    forceScrollEnable();
    
    // 5秒後に再チェック
    setTimeout(() => {
      console.log('\n🔄 5秒後の再診断:');
      diagnoseCSSBlocking();
    }, 5000);
  }, 1000);
  
})();