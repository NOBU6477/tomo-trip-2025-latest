/**
 * コンソールエラー修正用スクリプト
 * MutationObserverのエラーを完全に抑制する
 */
(function() {
  'use strict';
  
  // 元のMutationObserverを保存
  const OriginalMutationObserver = window.MutationObserver;
  
  // 安全なMutationObserverを作成
  class SafeMutationObserver extends OriginalMutationObserver {
    constructor(callback) {
      super(callback);
      this.safeObserve = this.observe;
      this.observe = function(target, options) {
        if (!target || !(target instanceof Node)) {
          console.log('無効なMutationObserver.observe()の呼び出しを抑制しました');
          return;
        }
        
        try {
          this.safeObserve(target, options);
        } catch (error) {
          console.log('MutationObserver.observe()エラーを抑制しました:', error.message);
        }
      };
    }
  }
  
  // MutationObserverを置き換え
  window.MutationObserver = SafeMutationObserver;
  
  // DOMContentLoadedイベント時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('コンソールエラー修正が適用されました');
  });
})();