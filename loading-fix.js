/**
 * ローディング問題修正スクリプト
 * 無限ローディングスピナーを停止し、正常表示を復旧
 */

(function() {
  'use strict';

  console.log('ローディング問題修正開始');

  function stopLoadingSpinners() {
    // 1. 全てのローディングスピナーを削除
    const loadingElements = document.querySelectorAll(
      '.loading, .spinner, .spinner-border, .spinner-grow, [class*="loading"], [class*="spinner"]'
    );
    
    loadingElements.forEach(element => {
      console.log('ローディング要素を削除:', element.className);
      element.remove();
    });

    // 2. ローディング状態のクラスを削除
    const elementsWithLoadingClass = document.querySelectorAll('[class*="loading"]');
    elementsWithLoadingClass.forEach(element => {
      element.classList.forEach(className => {
        if (className.includes('loading')) {
          element.classList.remove(className);
        }
      });
    });

    // 3. 無限ループの可能性があるsetIntervalを停止
    for (let i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }

    // 4. 無限ループの可能性があるsetTimeoutを停止
    for (let i = 1; i < 99999; i++) {
      window.clearTimeout(i);
    }

    // 5. body要素のスタイルをリセット
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.classList.remove('loading', 'modal-open');

    // 6. HTMLを強制表示
    document.documentElement.style.visibility = 'visible';
    document.body.style.visibility = 'visible';
    document.body.style.display = 'block';

    console.log('ローディング要素の削除完了');
  }

  function fixButtonLoops() {
    // ボタン修正の無限ループを制御
    const fixedButtons = new Set();
    
    function controlledButtonFix() {
      const registerBtn = document.getElementById('main-register-btn');
      if (registerBtn && !fixedButtons.has(registerBtn)) {
        registerBtn.textContent = '新規登録';
        registerBtn.onclick = function() { showRegisterOptions(); };
        fixedButtons.add(registerBtn);
        console.log('ボタン修正完了（制御版）');
      }
    }

    // 制御された間隔で実行
    const buttonFixInterval = setInterval(controlledButtonFix, 5000);
    
    // 30秒後に停止
    setTimeout(() => {
      clearInterval(buttonFixInterval);
      console.log('ボタン修正監視を停止');
    }, 30000);
  }

  function optimizePerformance() {
    // パフォーマンスを最適化
    
    // 1. 不要なイベントリスナーを削除
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      // クローンして新しい要素として置き換え（イベントリスナーを削除）
      if (element.getAttribute('data-heavy-listeners')) {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
      }
    });

    // 2. MutationObserverの数を制限
    let observerCount = 0;
    const originalObserve = MutationObserver.prototype.observe;
    MutationObserver.prototype.observe = function(...args) {
      observerCount++;
      if (observerCount > 5) {
        console.log('MutationObserver制限: 追加の監視を阻止');
        return;
      }
      return originalObserve.apply(this, args);
    };

    // 3. setIntervalの頻度を制限
    let intervalCount = 0;
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
      intervalCount++;
      if (intervalCount > 10) {
        console.log('setInterval制限: 追加のタイマーを阻止');
        return null;
      }
      if (delay < 1000) {
        delay = 1000; // 最小1秒間隔に制限
      }
      return originalSetInterval.call(this, callback, delay, ...args);
    };

    console.log('パフォーマンス最適化完了');
  }

  function emergencyReset() {
    // 緊急リセット
    console.log('緊急リセット実行');
    
    // すべてのタイマーを停止
    for (let i = 1; i < 99999; i++) {
      clearInterval(i);
      clearTimeout(i);
    }

    // ページ状態をリセット
    document.body.className = '';
    document.documentElement.className = '';
    
    // 強制的に表示状態にする
    const style = document.createElement('style');
    style.textContent = `
      * { 
        animation: none !important; 
        transition: none !important; 
      }
      body { 
        overflow: auto !important; 
        position: static !important; 
        visibility: visible !important; 
        display: block !important; 
      }
      .loading, .spinner, .spinner-border, .spinner-grow { 
        display: none !important; 
      }
    `;
    document.head.appendChild(style);

    console.log('緊急リセット完了');
  }

  // 即座に実行
  stopLoadingSpinners();
  optimizePerformance();
  fixButtonLoops();

  // 5秒後に緊急リセット
  setTimeout(emergencyReset, 5000);

  // DOM読み込み後にも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', stopLoadingSpinners);
  }

  console.log('ローディング問題修正システム完了');
})();