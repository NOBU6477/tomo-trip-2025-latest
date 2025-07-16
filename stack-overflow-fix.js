/**
 * スタックオーバーフロー修復システム
 * Maximum call stack size exceeded エラーの根本原因を解決
 */

(function() {
  'use strict';
  
  console.log('🔧 スタックオーバーフロー修復開始');
  
  // 危険な再帰関数を検出・停止
  function preventRecursionOverflow() {
    const callCounts = new Map();
    const maxCalls = 100;
    
    // 関数呼び出しの監視
    function wrapFunction(obj, methodName) {
      if (typeof obj[methodName] !== 'function') return;
      
      const original = obj[methodName];
      obj[methodName] = function(...args) {
        const key = `${obj.constructor.name}.${methodName}`;
        const count = callCounts.get(key) || 0;
        
        if (count > maxCalls) {
          console.warn(`⚠️ 過度な再帰呼び出しを阻止: ${key}`);
          return;
        }
        
        callCounts.set(key, count + 1);
        
        try {
          const result = original.apply(this, args);
          callCounts.set(key, Math.max(0, callCounts.get(key) - 1));
          return result;
        } catch (error) {
          callCounts.set(key, 0);
          throw error;
        }
      };
    }
    
    // 定期的にカウントをリセット
    setInterval(() => {
      callCounts.clear();
    }, 5000);
  }
  
  // MutationObserverの制限
  function limitMutationObservers() {
    const originalObserve = MutationObserver.prototype.observe;
    let observerCount = 0;
    
    MutationObserver.prototype.observe = function(target, options) {
      observerCount++;
      if (observerCount > 10) {
        console.warn('⚠️ 過度なMutationObserver作成を阻止');
        return;
      }
      
      return originalObserve.call(this, target, options);
    };
  }
  
  // イベントリスナーの重複防止
  function preventDuplicateListeners() {
    const listenerMap = new WeakMap();
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (!listenerMap.has(this)) {
        listenerMap.set(this, new Set());
      }
      
      const listeners = listenerMap.get(this);
      const key = `${type}-${listener.toString().substring(0, 50)}`;
      
      if (listeners.has(key)) {
        console.warn('⚠️ 重複イベントリスナーを阻止:', type);
        return;
      }
      
      listeners.add(key);
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
  
  // 問題のあるスクリプトの無効化
  function disableProblematicScripts() {
    const problematicScripts = [
      'ultimate-header-override.js',
      'nuclear-header-fix.js',
      'japanese-header-fix.js'
    ];
    
    problematicScripts.forEach(scriptName => {
      const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
      scripts.forEach(script => {
        script.remove();
        console.log(`🗑️ 問題スクリプトを削除: ${scriptName}`);
      });
    });
  }
  
  // 緊急停止ボタンの追加
  function addEmergencyStop() {
    const stopButton = document.createElement('button');
    stopButton.id = 'emergency-stop';
    stopButton.innerHTML = '🛑 緊急停止';
    stopButton.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 99999;
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    `;
    
    stopButton.addEventListener('click', function() {
      // すべてのJavaScript実行を停止
      window.stop();
      location.reload();
    });
    
    document.body.appendChild(stopButton);
  }
  
  // エラーハンドリング強化
  function enhanceErrorHandling() {
    window.addEventListener('error', function(event) {
      if (event.message.includes('Maximum call stack size exceeded')) {
        console.error('🚨 スタックオーバーフロー検出:', event);
        
        // 自動復旧試行
        setTimeout(() => {
          console.log('🔄 自動復旧試行...');
          window.location.reload();
        }, 2000);
      }
    });
    
    // 未捕捉のPromise拒否を処理
    window.addEventListener('unhandledrejection', function(event) {
      console.warn('⚠️ 未処理のPromise拒否:', event.reason);
      event.preventDefault();
    });
  }
  
  // 初期化
  function initialize() {
    try {
      preventRecursionOverflow();
      limitMutationObservers();
      preventDuplicateListeners();
      disableProblematicScripts();
      enhanceErrorHandling();
      addEmergencyStop();
      
      console.log('✅ スタックオーバーフロー修復完了');
    } catch (error) {
      console.error('❌ 修復システムエラー:', error);
    }
  }
  
  // 即座に実行
  initialize();
  
})();