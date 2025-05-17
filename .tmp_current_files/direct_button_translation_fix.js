/**
 * ボタンテキストを直接置換するスクリプト
 * 英語ボタンをすべて確実に日本語化します
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
    console.log('ボタン日本語化スクリプト初期化');
    
    // 即時実行
    translateButtons();
    
    // モーダル表示時に再度実行
    document.addEventListener('click', function(e) {
      if (e.target && (e.target.classList.contains('guide-register-btn') || e.target.classList.contains('tourist-register-btn'))) {
        setTimeout(function() {
          translateButtons();
          setupMutationObserver();
        }, 500);
      }
    });
    
    // モーダル表示イベント
    document.addEventListener('shown.bs.modal', function() {
      setTimeout(translateButtons, 100);
    });
    
    // モーダル内のボタンクリック時にも翻訳を実行
    document.addEventListener('click', function(e) {
      if (e.target && e.target.tagName === 'BUTTON') {
        setTimeout(translateButtons, 200);
      }
    });
    
    // 一定間隔で実行
    const intervals = [500, 1000, 2000, 3000];
    intervals.forEach(interval => {
      setTimeout(translateButtons, interval);
    });
    
    // MutationObserverの設定
    setupMutationObserver();
  }
  
  /**
   * DOMの変更を監視して翻訳を実行
   */
  function setupMutationObserver() {
    try {
      // すでにモーダルが表示されている場合は、そのボタンを対象に
      const modals = document.querySelectorAll('.modal.show');
      
      modals.forEach(modal => {
        const observer = new MutationObserver(function(mutations) {
          let shouldTranslate = false;
          
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              for (let i = 0; i < mutation.addedNodes.length; i++) {
                const node = mutation.addedNodes[i];
                if (node.nodeType === Node.ELEMENT_NODE && 
                    (node.tagName === 'BUTTON' || node.querySelector('button'))) {
                  shouldTranslate = true;
                  break;
                }
              }
            }
          });
          
          if (shouldTranslate) {
            translateButtons();
          }
        });
        
        observer.observe(modal, {
          childList: true,
          subtree: true
        });
      });
    } catch (error) {
      console.error('MutationObserver設定エラー:', error);
    }
  }
  
  /**
   * ボタンの英語テキストを日本語に変換
   */
  function translateButtons() {
    try {
      // ボタン要素を取得して内容を置換
      document.querySelectorAll('button').forEach(function(button) {
        // ボタン内のテキストを直接置換（アイコン付きの場合も考慮）
        replaceButtonText(button);
        
        // innerHTML内の英語テキストも置換
        replaceInnerHTML(button);
      });
      
      // 特に重要なボタンは属性を使って直接指定
      const photoSelectButtons = document.querySelectorAll('[data-photo-select], [data-action="select-photo"]');
      photoSelectButtons.forEach(button => {
        button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
      });
      
      const photoCameraButtons = document.querySelectorAll('[data-photo-camera], [data-action="capture-photo"]');
      photoCameraButtons.forEach(button => {
        button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
      });
      
      // 最後の手段：セレクタと内容で特定
      const buttonSelectors = [
        {selector: 'button.btn-primary', english: 'PHOTO SELECT', japanese: 'ファイルを選択'},
        {selector: 'button.btn-secondary', english: 'PHOTO CAMERA', japanese: 'カメラで撮影'}
      ];
      
      buttonSelectors.forEach(({selector, english, japanese}) => {
        document.querySelectorAll(selector).forEach(button => {
          if (button.textContent.includes(english)) {
            button.innerHTML = button.innerHTML.replace(english, japanese);
          }
        });
      });
      
      // モーダル内のボタンを直接特定して置換
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach(modal => {
        const buttons = modal.querySelectorAll('button');
        buttons.forEach((button, index) => {
          if (index === 0 && button.textContent.includes('SELECT')) {
            button.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
          }
          if (index === 1 && button.textContent.includes('CAMERA')) {
            button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          }
        });
      });
      
      console.log('ボタンの日本語化処理を実行しました');
    } catch (error) {
      console.error('ボタン翻訳エラー:', error);
    }
  }
  
  /**
   * ボタン内のテキストを置換
   */
  function replaceButtonText(button) {
    // 翻訳マップ
    const translations = {
      'PHOTO SELECT': 'ファイルを選択',
      'PHOTO CAMERA': 'カメラで撮影',
      'Photo Select': 'ファイルを選択',
      'Photo Camera': 'カメラで撮影'
    };
    
    // テキストノードを検索して置換
    Array.from(button.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        for (const [eng, jpn] of Object.entries(translations)) {
          if (text.includes(eng)) {
            node.textContent = node.textContent.replace(eng, jpn);
          }
        }
      }
    });
    
    // ボタンのテキスト全体をチェック
    const buttonText = button.textContent.trim();
    if (translations[buttonText]) {
      button.textContent = translations[buttonText];
    }
  }
  
  /**
   * innerHTML内の英語テキストを置換
   */
  function replaceInnerHTML(element) {
    let html = element.innerHTML;
    const replacements = [
      {from: 'PHOTO SELECT', to: 'ファイルを選択'},
      {from: 'PHOTO CAMERA', to: 'カメラで撮影'},
      {from: 'Photo Select', to: 'ファイルを選択'},
      {from: 'Photo Camera', to: 'カメラで撮影'}
    ];
    
    let changed = false;
    replacements.forEach(({from, to}) => {
      if (html.includes(from)) {
        html = html.replace(from, to);
        changed = true;
      }
    });
    
    if (changed) {
      element.innerHTML = html;
    }
  }
})();