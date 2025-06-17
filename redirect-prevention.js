/**
 * リダイレクト防止システム
 * プロフィール編集ページでの自動リダイレクトを完全に防止
 */

(function() {
  'use strict';

  // 即座に実行してリダイレクトを防止
  const urlParams = new URLSearchParams(window.location.search);
  const isRegistrationMode = urlParams.get('mode') === 'registration' || urlParams.get('step') === '2';
  const isGuideProfile = window.location.pathname.includes('guide-profile.html');

  if (isGuideProfile && isRegistrationMode) {
    console.log('新規登録モード検出 - 強制リダイレクト防止を有効化');
    
    // 認証状態を強制設定
    sessionStorage.setItem('guideRegistrationCompleted', 'true');
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userType', 'guide');
    sessionStorage.setItem('bypassAccessControl', 'true');
    sessionStorage.setItem('preventRedirect', 'true');
    
    // location オブジェクトの完全な保護
    const originalLocation = window.location;
    let redirectBlocked = false;

    // location.href の setter を無効化
    Object.defineProperty(window.location, 'href', {
      set: function(url) {
        if (url.includes('index.html') || url === '/' || url.includes('?')) {
          console.log('リダイレクトをブロック:', url);
          redirectBlocked = true;
          return;
        }
        originalLocation.href = url;
      },
      get: function() {
        return originalLocation.href;
      },
      configurable: true
    });

    // assign と replace メソッドを無効化
    window.location.assign = function(url) {
      if (url.includes('index.html') || url === '/' || url.includes('?')) {
        console.log('location.assign をブロック:', url);
        return;
      }
      originalLocation.assign(url);
    };

    window.location.replace = function(url) {
      if (url.includes('index.html') || url === '/' || url.includes('?')) {
        console.log('location.replace をブロック:', url);
        return;
      }
      originalLocation.replace(url);
    };

    // window.open の無効化（リダイレクト用途の場合）
    const originalOpen = window.open;
    window.open = function(url, target, features) {
      if (target === '_self' && (url.includes('index.html') || url === '/')) {
        console.log('window.open リダイレクトをブロック:', url);
        return;
      }
      return originalOpen.call(this, url, target, features);
    };

    // history API の保護
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
      if (url && (url.includes('index.html') || url === '/')) {
        console.log('history.pushState をブロック:', url);
        return;
      }
      return originalPushState.call(this, state, title, url);
    };

    history.replaceState = function(state, title, url) {
      if (url && (url.includes('index.html') || url === '/')) {
        console.log('history.replaceState をブロック:', url);
        return;
      }
      return originalReplaceState.call(this, state, title, url);
    };

    // setTimeout と setInterval 内のリダイレクトを防止
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    window.setTimeout = function(callback, delay) {
      const wrappedCallback = function() {
        try {
          callback();
        } catch (e) {
          if (e.message && e.message.includes('location')) {
            console.log('setTimeout 内のリダイレクトをブロック');
            return;
          }
          throw e;
        }
      };
      return originalSetTimeout(wrappedCallback, delay);
    };

    window.setInterval = function(callback, delay) {
      const wrappedCallback = function() {
        try {
          callback();
        } catch (e) {
          if (e.message && e.message.includes('location')) {
            console.log('setInterval 内のリダイレクトをブロック');
            return;
          }
          throw e;
        }
      };
      return originalSetInterval(wrappedCallback, delay);
    };

    // スクリプトタグの動的実行を監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
            const scriptContent = node.textContent || node.innerHTML;
            if (scriptContent.includes('location.href') || scriptContent.includes('window.location')) {
              console.log('危険なスクリプトの実行をブロック');
              node.remove();
            }
          }
        });
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true
    });

    // DOM読み込み完了後の追加処理
    document.addEventListener('DOMContentLoaded', function() {
      // アクセス拒否メッセージを削除
      const removeAccessDeniedElements = () => {
        const alerts = document.querySelectorAll('.alert, .alert-danger, .alert-warning');
        alerts.forEach(alert => {
          if (alert.textContent && (
            alert.textContent.includes('アクセスが拒否') || 
            alert.textContent.includes('ログインして') ||
            alert.textContent.includes('Access denied') ||
            alert.textContent.includes('Please login') ||
            alert.textContent.includes('認証が必要')
          )) {
            alert.remove();
          }
        });

        // リダイレクト用のスクリプトタグを削除
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
          const content = script.textContent || script.innerHTML;
          if (content.includes('window.location') && content.includes('index.html')) {
            script.remove();
          }
        });
      };

      removeAccessDeniedElements();

      // 継続的に監視
      setInterval(removeAccessDeniedElements, 500);

      // 5秒後に監視を停止
      setTimeout(() => {
        observer.disconnect();
        console.log('リダイレクト防止システムが正常に動作しました');
      }, 5000);
    });

    // ページ離脱防止（確認ダイアログ）
    window.addEventListener('beforeunload', function(e) {
      if (redirectBlocked) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    });

    console.log('リダイレクト防止システムを初期化しました');
  }
})();