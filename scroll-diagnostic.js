/**
 * スクロール問題診断ツール
 * 現在のスクロール設定と問題を詳細に調査
 */
(function() {
  'use strict';
  
  console.log('🔍 スクロール診断開始');
  
  function runDiagnostics() {
    console.log('=== スクロール状態診断レポート ===');
    
    // 基本的なスクロール情報
    console.log('-- 基本情報 --');
    console.log('document.body.scrollHeight:', document.body.scrollHeight);
    console.log('document.body.clientHeight:', document.body.clientHeight);
    console.log('window.innerHeight:', window.innerHeight);
    console.log('document.documentElement.scrollHeight:', document.documentElement.scrollHeight);
    
    // CSSスタイル情報
    console.log('-- CSS状態 --');
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    
    console.log('body.overflow:', bodyStyle.overflow);
    console.log('body.overflowY:', bodyStyle.overflowY);
    console.log('body.height:', bodyStyle.height);
    console.log('body.position:', bodyStyle.position);
    console.log('html.overflow:', htmlStyle.overflow);
    console.log('html.overflowY:', htmlStyle.overflowY);
    console.log('html.height:', htmlStyle.height);
    
    // インラインスタイル情報
    console.log('-- インラインスタイル --');
    console.log('body.style.overflow:', document.body.style.overflow);
    console.log('body.style.overflowY:', document.body.style.overflowY);
    console.log('body.style.height:', document.body.style.height);
    console.log('body.style.position:', document.body.style.position);
    
    // スクロール可能性テスト
    console.log('-- スクロール可能性 --');
    const canScroll = document.body.scrollHeight > window.innerHeight;
    console.log('スクロール可能なコンテンツサイズ:', canScroll);
    
    // 問題のある要素を検索
    console.log('-- 問題要素検索 --');
    const problematicElements = [];
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.overflow === 'hidden' && el.scrollHeight > el.clientHeight) {
        problematicElements.push({
          element: el,
          tagName: el.tagName,
          className: el.className,
          id: el.id
        });
      }
    });
    
    console.log('overflow:hiddenで問題の可能性がある要素:', problematicElements);
    
    // 固定要素の検索
    console.log('-- 固定要素検索 --');
    const fixedElements = [];
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' && style.height === '100vh') {
        fixedElements.push({
          element: el,
          tagName: el.tagName,
          className: el.className,
          id: el.id
        });
      }
    });
    
    console.log('position:fixed + height:100vhの要素:', fixedElements);
    
    console.log('=== 診断完了 ===');
    
    return {
      canScroll,
      bodyOverflow: bodyStyle.overflow,
      problematicElements,
      fixedElements
    };
  }
  
  // 診断実行
  const diagnostics = runDiagnostics();
  
  // グローバル関数として公開
  window.runScrollDiagnostics = runDiagnostics;
  
  // 自動修復試行
  function attemptAutoFix() {
    console.log('🔧 自動修復を試行');
    
    // 基本的なスクロール設定を強制
    document.body.style.overflow = 'visible';
    document.body.style.overflowY = 'scroll';
    document.documentElement.style.overflow = 'visible';
    document.documentElement.style.overflowY = 'scroll';
    
    // heightの問題を修正
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    
    // positionの問題を修正
    document.body.style.position = 'static';
    
    console.log('✅ 基本修復完了');
    
    // 修復後の状態を再確認
    setTimeout(() => {
      console.log('-- 修復後の状態 --');
      runDiagnostics();
    }, 100);
  }
  
  // 自動修復を実行
  attemptAutoFix();
  
  // グローバル修復関数
  window.fixScrollNow = attemptAutoFix;
  
})();