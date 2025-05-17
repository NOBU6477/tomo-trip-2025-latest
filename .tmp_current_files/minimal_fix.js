/**
 * 最小限のシンプルな修正スクリプト
 * パフォーマンスを最優先し、シンプルに実装
 */
(function() {
  'use strict';

  // 英語→日本語の変換マップ
  const translationMap = {
    'photo title': '証明写真タイプ',
    'photo description': '写真について',
    'PHOTO SELECT': 'ファイルを選択',
    'PHOTO CAMERA': 'カメラで撮影',
    'Photo Camera': 'カメラで撮影',
    'photo camera': 'カメラで撮影',
    'Camera': 'カメラで撮影',
    'photo single': '証明写真（1枚）',
    'photo dual': '表裏写真（運転免許証等）',
    'Select': 'ファイルを選択',
    'SELECT': 'ファイルを選択'
  };
  
  // これらの要素は直接変更する（部分一致）
  const directReplacements = [
    { contains: 'PHOTO SELECT', replace: 'ファイルを選択' },
    { contains: 'PHOTO CAMERA', replace: 'カメラで撮影' },
    { contains: 'photo title', replace: '証明写真タイプ' },
    { contains: 'photo description', replace: '写真について' }
  ];

  // 変更済み要素を追跡（WeakSetには.clearがないので、新しいWeakSetを作成する方法で初期化）
  let processedElements = new WeakSet();

  // DOMロード時またはロード済みの場合は即実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('シンプル翻訳スクリプト初期化');
    
    // モーダル表示時のイベントを監視（直接翻訳実行）
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      if (modal && modal.classList.contains('modal')) {
        // 処理前にすべての修正履歴をクリア（新しいWeakSetを作成）
        processedElements = new WeakSet();
        
        // モーダル内の要素を翻訳
        translateElements(modal);
        
        // 少し遅延して再度実行（動的に追加された要素のため）
        setTimeout(() => translateElements(modal), 100);
      }
    });
    
    // 登録ボタン押下時にも翻訳実行（代替手段）
    document.addEventListener('click', function(e) {
      if (e.target && 
         (e.target.classList.contains('guide-register-btn') || 
          e.target.classList.contains('tourist-register-btn') ||
          (e.target.closest && (
            e.target.closest('.guide-register-btn') || 
            e.target.closest('.tourist-register-btn')
          ))
         )) {
        // 少し遅延してモーダルが表示された時に翻訳
        setTimeout(() => {
          document.querySelectorAll('.modal.show').forEach(modal => {
            // 処理前にすべての修正履歴をクリア（新しいWeakSetを作成）
            processedElements = new WeakSet();
            translateElements(modal);
          });
        }, 300);
      }
    });
    
    // 最初に一度実行（ページ読み込み時の翻訳）
    processedElements = new WeakSet();
    translateElements(document);
  }
  
  // 要素内のテキストを翻訳
  function translateElements(container) {
    if (!container) return;
    
    try {
      // 1. テキストコンテンツを持つ要素の翻訳
      translateTextElements(container);
      
      // 2. ボタン要素の翻訳
      translateButtons(container);
      
      // 3. 特殊要素（h5, ラベルなど）の翻訳
      translateSpecialElements(container);
      
      // 処理完了をログ出力
      console.log('翻訳処理完了');
    } catch (error) {
      // エラーがあっても続行
      console.error('翻訳処理中にエラー:', error);
    }
  }
  
  // テキスト要素の翻訳
  function translateTextElements(container) {
    // h5, div, span, pなどのテキスト要素を取得
    const textElements = container.querySelectorAll('h5, div:not(.modal), span, p, label');
    
    textElements.forEach(element => {
      // すでに処理済みならスキップ
      if (processedElements.has(element)) return;
      
      const text = element.textContent.trim();
      
      // 完全一致の場合
      if (translationMap[text]) {
        element.textContent = translationMap[text];
        processedElements.add(element);
        return;
      }
      
      // 部分一致の場合
      for (const item of directReplacements) {
        if (text.toLowerCase().includes(item.contains.toLowerCase())) {
          // タグを含まない単純なテキストなら直接置換
          if (element.childElementCount === 0) {
            element.textContent = item.replace;
            processedElements.add(element);
            return;
          }
        }
      }
    });
  }
  
  // ボタン要素の翻訳
  function translateButtons(container) {
    // すべてのボタン要素を取得
    const buttons = container.querySelectorAll('button');
    
    buttons.forEach(button => {
      // すでに処理済みならスキップ
      if (processedElements.has(button)) return;
      
      const buttonText = button.textContent.trim();
      
      // カメラボタンの判定
      if (buttonText.includes('PHOTO CAMERA') || 
          buttonText.includes('Camera') || 
          buttonText.toUpperCase().includes('CAMERA')) {
        
        // アイコンを保持しつつテキストを置換
        const hasIcon = button.querySelector('i, .bi');
        
        if (hasIcon) {
          // アイコンがある場合はアイコンを保持
          const iconHTML = hasIcon.outerHTML;
          button.innerHTML = iconHTML + ' カメラで撮影';
        } else {
          // アイコンがない場合は新たに追加
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
        }
        
        // スタイル調整
        button.style.color = 'white';
        processedElements.add(button);
      }
      // ファイル選択ボタンの判定
      else if (buttonText.includes('SELECT') || 
               buttonText.includes('Select')) {
        
        // アイコンを保持しつつテキストを置換
        const hasIcon = button.querySelector('i, .bi');
        
        if (hasIcon) {
          // アイコンがある場合はアイコンを保持
          const iconHTML = hasIcon.outerHTML;
          button.innerHTML = iconHTML + ' ファイルを選択';
        } else {
          // アイコンがない場合は新たに追加
          button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
        }
        
        processedElements.add(button);
      }
      // 部分一致で探す（上記に該当しないケース）
      else {
        for (const item of directReplacements) {
          if (buttonText.toLowerCase().includes(item.contains.toLowerCase())) {
            // アイコンを保持するケース
            const hasIcon = button.querySelector('i, .bi');
            
            if (hasIcon) {
              const iconHTML = hasIcon.outerHTML;
              button.innerHTML = iconHTML + ' ' + item.replace;
            } else {
              button.textContent = item.replace;
            }
            
            processedElements.add(button);
            break;
          }
        }
      }
    });
  }
  
  // 特殊要素の翻訳（特定の要素に対する特別な処理）
  function translateSpecialElements(container) {
    // 証明写真タイトル要素（h5タグなど）
    const allHeadings = container.querySelectorAll('h5');
    allHeadings.forEach(element => {
      const text = element.textContent.trim();
      // 完全一致
      if (text === 'photo title') {
        element.textContent = '証明写真タイプ';
        processedElements.add(element);
      }
      // 部分一致
      else if (text.includes('photo') && text.includes('title')) {
        element.textContent = '証明写真タイプ';
        processedElements.add(element);
      }
    });
    
    // SELECTボタン（特別対応）
    const photoSelectButtons = container.querySelectorAll('button');
    photoSelectButtons.forEach(button => {
      if (!processedElements.has(button)) {
        const text = button.textContent.trim();
        if (text.includes('PHOTO SELECT') || text.includes('SELECT')) {
          // アイコンがあれば保持
          const iconElement = button.querySelector('i');
          if (iconElement) {
            const iconHtml = iconElement.outerHTML;
            button.innerHTML = iconHtml + ' ファイルを選択';
          } else {
            button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
          }
          button.style.color = '';  // スタイルをリセット
          processedElements.add(button);
        }
      }
    });
    
    // 写真の説明部分
    const allDivs = container.querySelectorAll('div');
    allDivs.forEach(div => {
      if (!processedElements.has(div)) {
        const text = div.textContent.trim();
        if (text === 'photo description') {
          div.textContent = '写真について';
          processedElements.add(div);
        }
      }
    });
    
    // ラジオボタンとラベル
    const allRadioLabels = container.querySelectorAll('label');
    allRadioLabels.forEach(label => {
      if (!processedElements.has(label)) {
        const text = label.textContent.trim();
        if (text === 'photo single') {
          // ラベルだけ変更してラジオボタンの機能は維持
          const radio = label.querySelector('input[type="radio"]');
          if (radio) {
            const radioClone = radio.cloneNode(true);
            label.textContent = '証明写真（1枚）';
            label.insertBefore(radioClone, label.firstChild);
          } else {
            label.textContent = '証明写真（1枚）';
          }
          processedElements.add(label);
        } 
        else if (text === 'photo dual') {
          // ラベルだけ変更してラジオボタンの機能は維持
          const radio = label.querySelector('input[type="radio"]');
          if (radio) {
            const radioClone = radio.cloneNode(true);
            label.textContent = '表裏写真（運転免許証等）';
            label.insertBefore(radioClone, label.firstChild);
          } else {
            label.textContent = '表裏写真（運転免許証等）';
          }
          processedElements.add(label);
        }
      }
    });
    
    // 直接selector指定で要素を見つけて変更（最も確実な方法）
    try {
      const photoTitleEl = container.querySelector('.modal-body h5:first-of-type');
      if (photoTitleEl && !processedElements.has(photoTitleEl)) {
        photoTitleEl.textContent = '証明写真タイプ';
        processedElements.add(photoTitleEl);
      }
      
      const photoSelBtn = container.querySelector('.modal-body button.btn-primary');
      if (photoSelBtn && !processedElements.has(photoSelBtn)) {
        const hasIcon = photoSelBtn.querySelector('i');
        if (hasIcon) {
          photoSelBtn.innerHTML = hasIcon.outerHTML + ' ファイルを選択';
        } else {
          photoSelBtn.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
        }
        processedElements.add(photoSelBtn);
      }
    } catch (e) {
      console.error('直接セレクタ指定エラー:', e);
    }
  }
})();