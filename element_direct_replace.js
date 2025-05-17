/**
 * DOMの特定要素を直接置換する最終手段スクリプト
 * 最も確実に英語テキストを日本語に変換します
 */
(function() {
  'use strict';

  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * 初期化処理
   */
  function init() {
    console.log('要素直接置換スクリプト初期化');
    
    // 各要素を直接置換する関数を実行
    directReplace();
    
    // モーダル表示時に再度実行
    document.addEventListener('shown.bs.modal', function() {
      setTimeout(directReplace, 100);
    });
    
    // 一定間隔で再実行
    const intervals = [500, 1000, 2000];
    intervals.forEach(interval => {
      setTimeout(directReplace, interval);
    });
  }
  
  /**
   * DOM要素を直接日本語に置換
   */
  function directReplace() {
    try {
      console.log('要素直接置換開始');
      
      // 特定のquerySelectorと新しいテキストの組み合わせ
      const directReplacements = [
        // 写真関連
        {
          selector: '.modal-body button:contains("PHOTO SELECT"), .modal-body button:contains("Photo Select")',
          text: 'ファイルを選択'
        },
        {
          selector: '.modal-body button:contains("PHOTO CAMERA"), .modal-body button:contains("Photo Camera")',
          text: 'カメラで撮影'
        },
        
        // その他のモーダル内要素
        {
          selector: '.modal-body label:contains("photo single")',
          text: '証明写真（1枚）'
        },
        {
          selector: '.modal-body label:contains("photo dual")',
          text: '表裏写真（運転免許証等）'
        }
      ];
      
      // 代替方法: すべてのボタン要素を検索して、innerHTMLに特定の英語文字列が含まれていれば置換
      document.querySelectorAll('button').forEach(button => {
        let innerHTML = button.innerHTML;
        
        // 写真ボタン
        if (innerHTML.includes('PHOTO SELECT') || innerHTML.includes('Photo Select')) {
          button.innerHTML = innerHTML
            .replace('PHOTO SELECT', 'ファイルを選択')
            .replace('Photo Select', 'ファイルを選択');
        }
        
        if (innerHTML.includes('PHOTO CAMERA') || innerHTML.includes('Photo Camera')) {
          button.innerHTML = innerHTML
            .replace('PHOTO CAMERA', 'カメラで撮影')
            .replace('Photo Camera', 'カメラで撮影');
        }
      });
      
      // 要素内のテキストノードを直接置換
      const textReplacements = {
        'PHOTO SELECT': 'ファイルを選択',
        'PHOTO CAMERA': 'カメラで撮影',
        'Photo Select': 'ファイルを選択',
        'Photo Camera': 'カメラで撮影'
      };
      
      // 写真モーダルに関連するすべての要素をチェック
      document.querySelectorAll('.modal *').forEach(element => {
        // テキストノードだけをチェックして置換
        Array.from(element.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .forEach(textNode => {
            const oldText = textNode.textContent;
            
            // 各置換パターンでチェック
            Object.entries(textReplacements).forEach(([eng, jpn]) => {
              if (oldText.includes(eng)) {
                textNode.textContent = oldText.replace(eng, jpn);
              }
            });
          });
      });
      
      console.log('要素直接置換完了');
    } catch (error) {
      console.error('要素直接置換エラー:', error);
    }
  }
  
  /**
   * カスタム :contains セレクタ (対象要素を含む要素を手動検索)
   */
  document.querySelectorAll = (function(originalQuerySelectorAll) {
    return function(selector) {
      if (selector.includes(':contains(')) {
        try {
          const match = selector.match(/:contains\("([^"]*)"\)/);
          if (match && match[1]) {
            const searchText = match[1];
            const baseSelector = selector.replace(/:contains\("([^"]*)"\)/, '');
            const elements = Array.from(originalQuerySelectorAll.call(this, baseSelector));
            
            return elements.filter(el => el.textContent.includes(searchText));
          }
        } catch (error) {
          console.error('カスタムセレクタエラー:', error);
        }
      }
      
      return originalQuerySelectorAll.call(this, selector);
    };
  })(document.querySelectorAll);
})();