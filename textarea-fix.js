/**
 * テキストエリア機能修正スクリプト
 * 自己紹介と追加情報フィールドの入力可能状態を確保
 */
(function() {
  'use strict';

  function initializeTextareas() {
    // 自己紹介フィールドの初期化
    setupDescriptionTextarea();
    
    // 追加情報フィールドの初期化
    setupAdditionalInfoTextarea();
    
    console.log('Textarea functionality initialized');
  }

  /**
   * 自己紹介テキストエリアの設定
   */
  function setupDescriptionTextarea() {
    const textarea = document.getElementById('guide-description');
    const counter = document.getElementById('description-count');
    
    if (!textarea) {
      console.log('Description textarea not found');
      return;
    }

    // 基本属性を確実に設定
    textarea.removeAttribute('readonly');
    textarea.removeAttribute('disabled');
    textarea.style.backgroundColor = '#ffffff';
    textarea.style.color = '#212529';
    textarea.style.cursor = 'text';
    textarea.style.fontSize = '14px';
    textarea.style.lineHeight = '1.5';
    
    // 文字カウンター機能
    if (counter) {
      textarea.addEventListener('input', function() {
        const count = this.value.length;
        counter.textContent = count;
        
        // 文字数に応じた色変更
        if (count > 800) {
          counter.style.color = '#dc3545';
        } else if (count > 600) {
          counter.style.color = '#fd7e14';
        } else {
          counter.style.color = '#6c757d';
        }
      });
      
      // 初期値を設定
      counter.textContent = textarea.value.length;
    }

    // フォーカス時の処理
    textarea.addEventListener('focus', function() {
      this.style.borderColor = '#86b7fe';
      this.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
    });

    textarea.addEventListener('blur', function() {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });

    console.log('Description textarea initialized');
  }

  /**
   * 追加情報テキストエリアの設定
   */
  function setupAdditionalInfoTextarea() {
    const textarea = document.getElementById('interest-custom');
    const counter = document.getElementById('additional-info-count');
    
    if (!textarea) {
      console.log('Additional info textarea not found');
      return;
    }

    // 基本属性を確実に設定
    textarea.removeAttribute('readonly');
    textarea.removeAttribute('disabled');
    textarea.style.backgroundColor = '#ffffff';
    textarea.style.color = '#212529';
    textarea.style.cursor = 'text';
    textarea.style.fontSize = '14px';
    textarea.style.lineHeight = '1.5';
    
    // 文字カウンター機能
    if (counter) {
      textarea.addEventListener('input', function() {
        const count = this.value.length;
        counter.textContent = count;
        
        // 文字数に応じた色変更
        if (count > 400) {
          counter.style.color = '#dc3545';
        } else if (count > 300) {
          counter.style.color = '#fd7e14';
        } else {
          counter.style.color = '#6c757d';
        }
      });
      
      // 初期値を設定
      counter.textContent = textarea.value.length;
    }

    // フォーカス時の処理
    textarea.addEventListener('focus', function() {
      this.style.borderColor = '#86b7fe';
      this.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
    });

    textarea.addEventListener('blur', function() {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });

    console.log('Additional info textarea initialized');
  }

  /**
   * テキストエリアの問題を強制修正
   */
  function forceTextareaFix() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
      // 読み取り専用属性を削除
      textarea.removeAttribute('readonly');
      textarea.removeAttribute('disabled');
      
      // スタイルをリセット
      textarea.style.backgroundColor = '#ffffff';
      textarea.style.color = '#212529';
      textarea.style.cursor = 'text';
      textarea.style.pointerEvents = 'auto';
      textarea.style.fontSize = '14px';
      textarea.style.lineHeight = '1.5';
      
      // tabindex を設定して確実にフォーカス可能にする
      textarea.setAttribute('tabindex', '0');
    });
    
    console.log('Force fixed', textareas.length, 'textareas');
  }

  /**
   * DOM監視による継続的な修正
   */
  function setupContinuousMonitoring() {
    // MutationObserverで動的変更を監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (target.tagName === 'TEXTAREA') {
            // テキストエリアの属性が変更された場合、再度修正
            target.removeAttribute('readonly');
            target.removeAttribute('disabled');
          }
        }
      });
    });

    // 全体を監視
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['readonly', 'disabled', 'style']
    });
  }

  // 初期化を複数回実行して確実性を高める
  function multipleInit() {
    initializeTextareas();
    
    setTimeout(() => {
      forceTextareaFix();
      initializeTextareas();
    }, 100);
    
    setTimeout(() => {
      forceTextareaFix();
      initializeTextareas();
    }, 500);
    
    setTimeout(() => {
      forceTextareaFix();
      initializeTextareas();
    }, 1000);
  }

  // DOMの準備完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', multipleInit);
  } else {
    multipleInit();
  }

  // 継続的な監視を開始
  setupContinuousMonitoring();

})();