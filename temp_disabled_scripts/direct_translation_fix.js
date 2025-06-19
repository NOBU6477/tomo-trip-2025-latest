/**
 * 証明写真セクション英語テキストの日本語化（直接置換方式）
 * 最もシンプルな方法で確実に日本語化します
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
    console.log('証明写真日本語化を初期化');
    
    // すぐに一度実行
    translateLabels();
    
    // モーダル表示時にも実行するためのイベントリスナー
    document.addEventListener('shown.bs.modal', function(event) {
      setTimeout(translateLabels, 200);
    });
    
    // ID付きの要素を直接書き換えるため、少し遅延して再実行
    setTimeout(translateLabels, 500);
    setTimeout(translateLabels, 1000);
  }
  
  /**
   * 証明写真セクションのラベルを日本語に変換
   */
  function translateLabels() {
    console.log('証明写真ラベル日本語化を実行');
    
    // 1. 通常の方法で直接IDやクラスで要素を特定して置き換え
    changeTextById('id-photo-type-label', '証明写真タイプ');
    
    // h5要素をチェックして"photo title"を含むものを置換
    document.querySelectorAll('h5').forEach(function(element) {
      if (element.textContent.includes('photo title')) {
        element.textContent = '証明写真タイプ';
      }
    });
    
    changeTextBySelector('label[for="id-photo-type-single"]', '証明写真（1枚）');
    changeTextBySelector('label[for="id-photo-type-dual"]', '表裏写真（運転免許証等）');
    
    // 2. モーダル内の要素を探して置き換え
    document.querySelectorAll('.modal-body h3, .modal-body h4, .modal-body h5, .modal-body h6, .modal-body div').forEach(function(element) {
      if (element.textContent.trim() === 'photo title') {
        element.textContent = '証明写真タイプ';
      }
      if (element.textContent.trim() === 'photo description') {
        element.textContent = '写真について';
      }
    });
    
    // 3. ラジオボタンのラベル
    document.querySelectorAll('.modal-body label').forEach(function(element) {
      if (element.textContent.trim() === 'photo single') {
        element.textContent = '証明写真（1枚）';
      }
      if (element.textContent.trim() === 'photo dual') {
        element.textContent = '表裏写真（運転免許証等）';
      }
    });
    
    // 4. ボタンのテキスト
    document.querySelectorAll('.modal-body button').forEach(function(element) {
      const buttonText = element.textContent.trim();
      if (buttonText === 'PHOTO SELECT') {
        element.textContent = 'ファイルを選択';
      } else if (buttonText.includes('SELECT')) {
        element.innerHTML = element.innerHTML.replace('PHOTO SELECT', 'ファイルを選択');
      }
      
      if (buttonText === 'PHOTO CAMERA') {
        element.textContent = 'カメラで撮影';
      } else if (buttonText.includes('CAMERA')) {
        element.innerHTML = element.innerHTML.replace('PHOTO CAMERA', 'カメラで撮影');
      }
    });
    
    // 5. その他のテキスト
    document.querySelectorAll('.modal-body span, .modal-body p, .modal-body div').forEach(function(element) {
      const text = element.textContent.trim();
      
      // required → 必須
      if (text === 'required') {
        element.textContent = '必須';
      }
    });
    
    // 6. すべての写真関連テキストを最後に再チェック
    document.querySelectorAll('*').forEach(function(element) {
      // テキスト置換マップ (扱いやすいようにケースごとに分ける)
      const wordMap = {
        'photo title': '証明写真タイプ',
        'Photo title': '証明写真タイプ',
        'PHOTO TITLE': '証明写真タイプ',
        'photo single': '証明写真（1枚）',
        'Photo single': '証明写真（1枚）', 
        'photo dual': '表裏写真（運転免許証等）',
        'Photo dual': '表裏写真（運転免許証等）',
        'photo description': '写真について',
        'Photo description': '写真について',
        'PHOTO SELECT': 'ファイルを選択',
        'Photo Select': 'ファイルを選択',
        'PHOTO CAMERA': 'カメラで撮影',
        'Photo Camera': 'カメラで撮影',
        'required': '必須'
      };
      
      const childNodes = element.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (wordMap[text]) {
            node.textContent = node.textContent.replace(text, wordMap[text]);
          }
        }
      }
    });
  }
  
  /**
   * IDで要素を特定してテキストを置き換え
   */
  function changeTextById(id, newText) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = newText;
    }
  }
  
  /**
   * セレクタで要素を特定してテキストを置き換え
   */
  function changeTextBySelector(selector, newText) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function(element) {
      element.textContent = newText;
    });
  }
  
  // jQuery風のcontainsセレクタは使用せず、標準のquerySelectorAllのみ使用
})();