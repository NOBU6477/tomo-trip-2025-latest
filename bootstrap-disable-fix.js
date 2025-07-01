/**
 * Bootstrap一時無効化によるスクロール修正
 * 言語切り替え時にBootstrapを無効化してスクロール問題を解決
 */
(function() {
  'use strict';
  
  console.log('🚫 Bootstrap無効化スクロール修正開始');
  
  // Bootstrap Modal機能を完全に無効化
  function disableBootstrapModal() {
    console.log('🚫 Bootstrap Modal無効化中...');
    
    // Bootstrap Modal関連のイベントリスナーを削除
    if (window.bootstrap && window.bootstrap.Modal) {
      const originalModal = window.bootstrap.Modal;
      
      // Modal.show を無効化
      window.bootstrap.Modal.prototype.show = function() {
        console.log('Modal.show() 呼び出しをブロック');
        return this;
      };
      
      // Modal.hide を無効化
      window.bootstrap.Modal.prototype.hide = function() {
        console.log('Modal.hide() 呼び出しをブロック');
        return this;
      };
      
      // 既存のModalインスタンスを削除
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      });
    }
    
    // jQuery Modal機能も無効化
    if (window.$ && window.$.fn && window.$.fn.modal) {
      window.$.fn.modal = function() {
        console.log('jQuery modal() 呼び出しをブロック');
        return this;
      };
    }
    
    console.log('✅ Bootstrap Modal無効化完了');
  }
  
  // body要素のクラスとスタイルを強制的にクリア
  function forceClearBodyState() {
    console.log('🧹 body状態強制クリア中...');
    
    const body = document.body;
    const html = document.documentElement;
    
    // クラス完全削除
    body.className = body.className.replace(/modal-open|no-scroll|overflow-hidden/g, '').trim();
    html.className = html.className.replace(/modal-open|no-scroll|overflow-hidden/g, '').trim();
    
    // style属性を強制リセット
    body.removeAttribute('style');
    html.removeAttribute('style');
    
    // 必要最小限のスタイルのみ設定
    body.style.cssText = 'overflow: visible !important; padding-right: 0px !important; height: auto !important;';
    html.style.cssText = 'overflow: visible !important; height: auto !important;';
    
    // modal-backdrop削除
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.parentNode.removeChild(backdrop);
    });
    
    console.log('✅ body状態クリア完了');
  }
  
  // 言語切り替え時の特別処理
  function setupLanguageSwitchInterception() {
    // 既存の関数をバックアップ
    const originalForceLanguageSwitch = window.forceLanguageSwitch;
    
    window.forceLanguageSwitch = function(lang) {
      console.log('🌐 Bootstrap無効化付き言語切り替え:', lang);
      
      // 1. Bootstrap Modal機能を無効化
      disableBootstrapModal();
      
      // 2. body状態を強制クリア
      forceClearBodyState();
      
      // 3. 元の処理実行
      let result;
      if (originalForceLanguageSwitch) {
        try {
          result = originalForceLanguageSwitch.call(this, lang);
        } catch(error) {
          console.log('言語切り替えエラー:', error);
        }
      }
      
      // 4. 処理後の継続修正
      const fixDelays = [10, 50, 100, 200, 500, 1000, 2000];
      fixDelays.forEach(delay => {
        setTimeout(() => {
          forceClearBodyState();
          
          // スクロール位置を保持
          const currentScroll = window.pageYOffset;
          window.scrollTo(0, currentScroll);
        }, delay);
      });
      
      return result;
    };
    
    console.log('✅ 言語切り替えインターセプション設定完了');
  }
  
  // ページの全てのイベントリスナーをクリーンアップ
  function cleanupEventListeners() {
    console.log('🧹 イベントリスナークリーンアップ中...');
    
    // body要素のイベントリスナーを削除
    const newBody = document.body.cloneNode(true);
    document.body.parentNode.replaceChild(newBody, document.body);
    
    // スクロール関連イベントを再有効化
    document.body.addEventListener('wheel', function(e) {
      // ホイールイベントのデフォルト動作を確保
      e.stopPropagation();
    }, { passive: true });
    
    console.log('✅ イベントリスナークリーンアップ完了');
  }
  
  // グローバル修復関数
  window.bootstrapDisableFix = function() {
    console.log('🚫 Bootstrap無効化修復実行');
    disableBootstrapModal();
    forceClearBodyState();
    cleanupEventListeners();
    console.log('✅ Bootstrap無効化修復完了');
  };
  
  // 初期化
  function initialize() {
    console.log('🚫 Bootstrap無効化システム初期化');
    
    // 即座に修正実行
    disableBootstrapModal();
    forceClearBodyState();
    
    // 言語切り替えインターセプション設定
    setupLanguageSwitchInterception();
    
    // 定期的な修正
    setInterval(() => {
      const bodyOverflow = window.getComputedStyle(document.body).overflow;
      if (bodyOverflow === 'hidden' || document.body.classList.contains('modal-open')) {
        console.log('⏰ 定期Bootstrap修正実行');
        forceClearBodyState();
      }
    }, 500);
    
    console.log('✅ Bootstrap無効化システム準備完了');
    console.log('修復用: bootstrapDisableFix() を実行してください');
  }
  
  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();