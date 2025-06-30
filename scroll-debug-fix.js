/**
 * スクロール問題デバッグ・修正スクリプト
 * 英語翻訳時のスクロール無効化問題を解決
 */
(function() {
  'use strict';
  
  console.log('🔍 スクロールデバッグ開始');
  
  // 翻訳前にスクロール状態を保存
  let originalOverflow = null;
  let originalHeight = null;
  let originalBodyStyle = null;
  
  // グローバル関数として公開してデバッグ用
  window.debugScrollIssue = function() {
    console.log('=== スクロール状態デバッグ ===');
    console.log('document.body.style.overflow:', document.body.style.overflow);
    console.log('document.documentElement.style.overflow:', document.documentElement.style.overflow);
    console.log('document.body.style.height:', document.body.style.height);
    console.log('document.body.scrollHeight:', document.body.scrollHeight);
    console.log('window.innerHeight:', window.innerHeight);
    console.log('document.body.style.position:', document.body.style.position);
    
    // 全てのoverfow hiddenを検索
    const elementsWithOverflowHidden = [];
    document.querySelectorAll('*').forEach(el => {
      const computed = window.getComputedStyle(el);
      if (computed.overflow === 'hidden' || computed.overflowY === 'hidden') {
        elementsWithOverflowHidden.push({
          element: el,
          tagName: el.tagName,
          className: el.className,
          overflow: computed.overflow,
          overflowY: computed.overflowY
        });
      }
    });
    
    console.log('overflow:hiddenの要素:', elementsWithOverflowHidden);
    console.log('=========================');
  };
  
  // スクロールを強制的に有効化する関数
  window.forceEnableScroll = function() {
    console.log('スクロールを強制有効化');
    
    // bodyとhtmlのoverflow設定をリセット
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
    
    // heightの制限を解除
    document.body.style.height = '';
    document.body.style.maxHeight = '';
    document.documentElement.style.height = '';
    document.documentElement.style.maxHeight = '';
    
    // positionの問題を解決
    document.body.style.position = '';
    
    // 追加のスクロール関連CSSプロパティをリセット
    document.body.style.touchAction = '';
    document.body.style.userSelect = '';
    
    console.log('✓ スクロール有効化完了');
  };
  
  // 言語切り替え時のスクロール保護
  function protectScrollDuringTranslation() {
    console.log('翻訳中のスクロール保護を設定');
    
    // 現在のスクロール設定を保存
    originalOverflow = document.body.style.overflow;
    originalHeight = document.body.style.height;
    originalBodyStyle = document.body.getAttribute('style');
    
    // 翻訳処理の監視
    const observer = new MutationObserver(function(mutations) {
      // DOM変更を監視して、スクロールが無効化されたら即座に修正
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      const bodyOverflowY = window.getComputedStyle(document.body).overflowY;
      
      if (bodyOverflow === 'hidden' || bodyOverflowY === 'hidden') {
        console.log('⚠️ スクロールが無効化されました - 修正中');
        window.forceEnableScroll();
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    });
    
    // 5秒後に監視を停止
    setTimeout(() => {
      observer.disconnect();
      console.log('スクロール監視を停止');
    }, 5000);
  }
  
  // 翻訳完了後のスクロール復元
  function restoreScrollAfterTranslation() {
    console.log('翻訳完了後のスクロール復元');
    
    // 強制的にスクロールを有効化
    window.forceEnableScroll();
    
    // 追加の安全策として、少し遅延してもう一度実行
    setTimeout(() => {
      window.forceEnableScroll();
      console.log('スクロール復元完了（遅延実行）');
    }, 1000);
  }
  
  // 既存の言語切り替え関数をオーバーライド
  const originalForceLanguageSwitch = window.forceLanguageSwitch;
  if (originalForceLanguageSwitch) {
    window.forceLanguageSwitch = function(lang) {
      console.log('言語切り替え開始 - スクロール保護有効');
      protectScrollDuringTranslation();
      
      // 元の言語切り替え処理を実行
      originalForceLanguageSwitch(lang);
      
      // 翻訳完了後にスクロールを復元
      setTimeout(restoreScrollAfterTranslation, 2000);
    };
  }
  
  // ページロード時の初期チェック
  document.addEventListener('DOMContentLoaded', function() {
    console.log('ページ読み込み完了 - スクロール状態チェック');
    window.debugScrollIssue();
    
    // スクロールが無効化されている場合は修正
    const bodyOverflow = window.getComputedStyle(document.body).overflow;
    if (bodyOverflow === 'hidden') {
      console.log('初期状態でスクロールが無効 - 修正します');
      window.forceEnableScroll();
    }
  });
  
  // リサイズ時にもスクロールを確認
  window.addEventListener('resize', function() {
    setTimeout(() => {
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      if (bodyOverflow === 'hidden') {
        console.log('リサイズ後スクロール無効を検出 - 修正');
        window.forceEnableScroll();
      }
    }, 100);
  });
  
  console.log('🔍 スクロールデバッグシステム準備完了');
  console.log('利用可能な関数:');
  console.log('- debugScrollIssue() : スクロール状態の詳細調査');
  console.log('- forceEnableScroll() : スクロール強制有効化');
  
})();