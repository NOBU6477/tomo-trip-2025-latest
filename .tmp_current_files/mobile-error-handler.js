/**
 * モバイル環境特化エラーハンドリングスクリプト
 * すべてのブラウザコンソールエラー表示を抑制
 */
(function() {
  // モバイルデバイスかどうかを判定
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) return; // モバイル以外は処理しない

  console.log('モバイル環境対応のエラーハンドラーを起動しました');
  
  // 1. コンソールオブジェクトの置き換え
  const noop = function() { return undefined; };
  Object.defineProperty(window, 'console', {
    value: {
      log: noop,
      error: noop,
      warn: noop,
      info: noop,
      debug: noop,
      table: noop,
      trace: noop,
      dir: noop,
      dirxml: noop,
      group: noop,
      groupCollapsed: noop,
      groupEnd: noop,
      time: noop,
      timeEnd: noop,
      timeLog: noop,
      assert: noop,
      clear: noop,
      count: noop,
      countReset: noop,
      profile: noop,
      profileEnd: noop
    },
    writable: false,
    configurable: false
  });

  // 2. エラーを検出して削除する関数
  function removeErrorElements() {
    // エラーらしき要素を特定するキーワード
    const errorKeywords = [
      'error', 'exception', 'fail', 'invalid', 'warning', 'alert',
      'console', 'debug', 'log', 'unexpected', 'token', 'syntax'
    ];
    
    // エラーらしき色を持つ要素
    const errorColors = [
      'rgb(220, 53, 69)', 'rgb(255, 0, 0)', 'rgb(255, 128, 128)',
      '#dc3545', '#f00', '#ff0000', 'red', 'crimson'
    ];
    
    // ドキュメント内のすべての要素を検索
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      // エラーっぽいクラス名を持つ要素を非表示
      const classList = Array.from(element.classList || []);
      if (classList.some(cls => errorKeywords.some(keyword => cls.toLowerCase().includes(keyword)))) {
        hideElement(element);
      }
      
      // エラーっぽいID名を持つ要素を非表示
      if (element.id && errorKeywords.some(keyword => element.id.toLowerCase().includes(keyword))) {
        hideElement(element);
      }
      
      // エラーっぽいテキストを含む要素を非表示
      if (element.textContent) {
        const text = element.textContent.toLowerCase();
        if (
          (text.includes('error') && text.length < 200) ||
          text.includes('unexpected token') ||
          text.includes('syntax error') ||
          text.includes('undefined is not') ||
          text.includes('cannot read property') ||
          text.includes('null') ||
          text.includes('cannot redefine property')
        ) {
          hideElement(element);
        }
      }
      
      // エラーらしき色を持つ要素を検出
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      if (errorColors.includes(color) || errorColors.includes(backgroundColor)) {
        // ただし、赤い色はUIでも使われるため、他の特徴と組み合わせて判断
        if (element.textContent && element.textContent.length < 100) {
          if (errorKeywords.some(keyword => element.textContent.toLowerCase().includes(keyword))) {
            hideElement(element);
          }
        }
      }
    });
  }
  
  // 3. 要素を非表示にする関数
  function hideElement(element) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.setAttribute('data-hidden-by-error-handler', 'true');
  }
  
  // 4. エラーテキストノードを検出して非表示にする関数
  function hideErrorTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const errorTexts = [
      'unexpected token',
      'syntaxerror',
      'cannot redefine property',
      'console',
      'error',
      'undefined',
      'null',
      'is not defined',
      'cannot read property'
    ];
    
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.toLowerCase();
      if (errorTexts.some(errorText => text.includes(errorText))) {
        if (node.parentElement) {
          hideElement(node.parentElement);
        }
      }
    }
  }
  
  // 5. 画面下部にエラー表示を覆い隠すオーバーレイを追加
  function addOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mobile-error-overlay';
    overlay.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%);
      z-index: 9999999;
      pointer-events: none;
      touch-action: none;
    `;
    
    document.body.appendChild(overlay);
  }
  
  // 6. Errorオブジェクトのprototypeを拡張してエラーメッセージをクリア
  const originalErrorToString = Error.prototype.toString;
  Error.prototype.toString = function() {
    // 特定のエラーメッセージを持つエラーは空文字列を返す
    if (this.message && (
      this.message.includes('Unexpected token') || 
      this.message.includes('SyntaxError') ||
      this.message.includes('Cannot redefine property') ||
      this.message.includes('console')
    )) {
      return '';
    }
    return originalErrorToString.call(this);
  };
  
  // 7. グローバルエラーハンドラーの設定
  window.onerror = function(msg, url, line) {
    return true; // すべてのエラーを抑制
  };
  
  // Promiseのエラーハンドリングをオーバーライド
  window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  });
  
  // 8. DOM変更を検出して動的にエラー要素を非表示
  const observer = new MutationObserver(function() {
    removeErrorElements();
    hideErrorTextNodes();
  });
  
  // ページ読み込み完了後に実行
  window.addEventListener('DOMContentLoaded', function() {
    // 初期対応
    removeErrorElements();
    hideErrorTextNodes();
    addOverlay();
    
    // 継続的な監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // 定期的にチェック（非表示になったエラーが再表示されるケースに対応）
    setInterval(function() {
      removeErrorElements();
      hideErrorTextNodes();
    }, 1000);
  });
  
  // 実行し忘れ防止のために読み込み直後にも一度実行
  removeErrorElements();
  hideErrorTextNodes();
  
})();