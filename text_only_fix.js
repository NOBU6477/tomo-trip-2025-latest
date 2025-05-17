/**
 * テキストのみを変更する最小限のスクリプト
 * UIの構造は一切変更せず、テキストだけを置き換えます
 */
(function() {
  'use strict';
  
  // DOMが読み込まれた時に実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダル表示イベントをリッスン
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      setTimeout(function() {
        translateTextsOnly(modal);
      }, 200);
    });
    
    // 登録ボタンクリック時の処理
    document.addEventListener('click', function(event) {
      if (event.target && 
         (event.target.classList.contains('guide-register-btn') || 
          event.target.classList.contains('tourist-register-btn') ||
          (event.target.closest && (
            event.target.closest('.guide-register-btn') || 
            event.target.closest('.tourist-register-btn')
          ))
         )) {
        setTimeout(function() {
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            translateTextsOnly(modal);
          });
        }, 300);
      }
    });
  });
  
  // テキストのみを翻訳する関数
  function translateTextsOnly(container) {
    if (!container) return;
    
    try {
      // テキスト置換マップ
      const replacements = [
        { selector: 'h5', sourceText: 'photo title', targetText: '証明写真タイプ' },
        { selector: 'div, span', sourceText: 'photo description', targetText: '写真について' },
        { selector: 'label', sourceText: 'photo single', targetText: '証明写真（1枚）' },
        { selector: 'label', sourceText: 'photo dual', targetText: '表裏写真（運転免許証等）' },
        { selector: 'button', sourceText: 'PHOTO SELECT', targetText: 'ファイルを選択' },
        { selector: 'button', sourceText: 'PHOTO CAMERA', targetText: 'カメラで撮影' }
      ];
      
      // 各置換定義に対して処理
      replacements.forEach(function(replacement) {
        const elements = container.querySelectorAll(replacement.selector);
        
        elements.forEach(function(element) {
          // 完全一致のテキスト置換
          if (element.textContent.trim() === replacement.sourceText) {
            translateElementText(element, replacement.targetText);
          }
          // 部分一致のテキスト置換
          else if (element.textContent.includes(replacement.sourceText)) {
            // ボタン要素の場合はアイコンを保持
            if (element.tagName.toLowerCase() === 'button') {
              translateButtonWithIcon(element, replacement.sourceText, replacement.targetText);
            }
          }
        });
      });
      
      console.log('テキスト翻訳が完了しました');
    } catch (error) {
      console.error('翻訳処理中にエラーが発生しました:', error);
    }
  }
  
  // 要素のテキストを変更（子要素を保持）
  function translateElementText(element, newText) {
    // input要素がある場合は保持
    const inputs = Array.from(element.querySelectorAll('input'));
    
    if (inputs.length > 0) {
      // inputを一時保存
      const inputsHTML = inputs.map(input => input.outerHTML);
      
      // テキストノードのみ置換
      const textNodes = Array.from(element.childNodes).filter(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
      );
      
      if (textNodes.length > 0) {
        textNodes.forEach(node => node.textContent = newText);
      } else {
        // テキストノードがない場合は全体を置換し、inputを再追加
        element.textContent = newText;
        inputsHTML.forEach(html => {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          element.insertBefore(temp.firstChild, element.firstChild);
        });
      }
    } else {
      // input要素がない場合は単純にテキストを置換
      element.textContent = newText;
    }
  }
  
  // ボタン要素のテキストを変更（アイコンを保持）
  function translateButtonWithIcon(button, sourceText, targetText) {
    // アイコン要素を保持
    const icon = button.querySelector('i, .bi');
    
    if (icon) {
      // アイコンのHTML取得
      const iconHTML = icon.outerHTML;
      
      // テキスト部分だけを置換
      const buttonText = button.textContent;
      const newButtonText = buttonText.replace(sourceText, targetText);
      
      // アイコンを保持しつつテキストを置換
      button.innerHTML = iconHTML + ' ' + targetText;
    } else {
      // アイコンがない場合はテキストのみ置換
      const buttonText = button.textContent;
      button.textContent = buttonText.replace(sourceText, targetText);
    }
  }
})();