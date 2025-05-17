/**
 * スマートフォン向けエラーハンドリング強化スクリプト
 * モバイル環境でのエラーをキャッチして詳細情報を表示
 */
(function() {
  // エラーキャッチの初期化
  window.addEventListener('DOMContentLoaded', setupErrorHandler);
  
  // エラーハンドラー設定
  function setupErrorHandler() {
    try {
      console.log('[モバイルエラーハンドラー] 初期化しています...');
      
      // オリジナルのエラーハンドラーを保存
      window.originalErrorHandler = window.onerror;
      
      // カスタムエラーハンドラー
      window.onerror = function(message, source, lineno, colno, error) {
        // コンソールにエラー詳細をログ
        console.error('[モバイルエラーハンドラー] エラーを検出:', {
          message: message,
          source: source,
          lineno: lineno,
          colno: colno,
          stack: error?.stack,
          userAgent: navigator.userAgent,
          isMobile: /Mobi|Android/i.test(navigator.userAgent),
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        });
        
        // スマホかどうかを判断
        const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
        
        // スマホのみでエラーメッセージを改善
        if (isMobile) {
          // 既知のエラーに対する解決策
          if (message.includes('Cannot read') && message.includes('null')) {
            console.info('[モバイルエラーハンドラー] 要素検出エラーを検出しました。修正を試みます...');
            tryToFixNullErrors();
          }
        }
        
        // 元のエラーハンドラーにも渡す
        if (window.originalErrorHandler) {
          return window.originalErrorHandler(message, source, lineno, colno, error);
        }
        
        // デフォルトの処理を継続
        return false;
      };
      
      // キャッチされなかったPromiseエラーのハンドラー
      window.addEventListener('unhandledrejection', function(event) {
        console.error('[モバイルエラーハンドラー] 未処理のPromiseエラー:', event.reason);
      });
      
      console.log('[モバイルエラーハンドラー] 設定完了');
    } catch (e) {
      console.error('[モバイルエラーハンドラー] 初期化エラー:', e);
    }
  }
  
  // null/undefinedエラーの修正を試みる
  function tryToFixNullErrors() {
    try {
      // タグコンテナの修復を試みる
      const allPreviewCards = document.querySelectorAll('.card');
      for (const card of allPreviewCards) {
        if (!card) continue;
        
        // プロフィールカードを探す手がかり
        const hasProfileHeader = card.querySelector('.card-header') && 
                               (card.querySelector('.card-header').textContent.includes('プロフィール') || 
                                card.querySelector('.card-header').textContent.includes('Profile'));
        
        // プロフィール写真またはガイド名を含むカード
        const hasProfileContent = card.querySelector('img.rounded-circle') || 
                                card.querySelector('.profile-name') || 
                                card.querySelector('.guide-name');
        
        if (hasProfileHeader || hasProfileContent) {
          console.info('[モバイルエラーハンドラー] プロフィールカードを検出:', card);
          
          // バッジタグコンテナがなければ作成
          if (!card.querySelector('.badge-tags-container')) {
            const container = document.createElement('div');
            container.className = 'badge-tags-container mobile-badge-container';
            
            // ラベルを追加
            const label = document.createElement('div');
            label.className = 'badge-tags-label';
            label.textContent = '専門分野・キーワード';
            container.appendChild(label);
            
            // カードボディに追加
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
              cardBody.appendChild(container);
              console.info('[モバイルエラーハンドラー] タグコンテナを作成しました');
            } else {
              card.appendChild(container);
              console.info('[モバイルエラーハンドラー] カード本体にタグコンテナを作成しました');
            }
          }
        }
      }
    } catch (e) {
      console.error('[モバイルエラーハンドラー] 修復処理エラー:', e);
    }
  }
})();