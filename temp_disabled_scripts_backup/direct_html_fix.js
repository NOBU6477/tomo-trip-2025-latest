/**
 * HTML直接修正スクリプト
 * 「証明写真タイプ」テキストを「観光客」に変更
 * UIデザインを崩さずに必要最小限の修正を行う
 */
(function() {
  console.log('HTML直接修正スクリプトを初期化');
  
  // DOMが完全に読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了、HTML修正を開始');
    
    // 初回実行
    fixHtmlLabels();
    
    // 定期的に再確認（頻度を下げて負荷を軽減）
    setInterval(fixHtmlLabels, 1000);
    
    // DOMの変更を監視（特にモーダル関連）
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        // モーダル関連の変更のみ処理
        if (mutation.target.classList && 
            (mutation.target.classList.contains('modal') || 
             mutation.target.closest('.modal'))) {
          fixHtmlLabels();
          break;
        }
        
        // 新しく追加されたノードをチェック
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && 
                (node.classList && node.classList.contains('modal') || 
                 node.querySelector && node.querySelector('.modal'))) {
              fixHtmlLabels();
              break;
            }
          }
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  });
  
  /**
   * HTML要素のラベルを修正
   */
  function fixHtmlLabels() {
    // モバイルフレンドリーに修正（パフォーマンス最適化）
    
    // 1. 特定の要素を直接ターゲット
    fixSpecificElements();
    
    // 2. テキストノードを効率的に処理（限定的なスコープで）
    fixTextNodes();
    
    // 3. 翻訳データを修正
    fixTranslations();
  }
  
  /**
   * 特定の要素を直接ターゲットに修正
   */
  function fixSpecificElements() {
    // アカウントタイプの選択モーダル内の修正（contains問題を回避するため直接検索）
    const modalTitles = document.querySelectorAll('.modal .modal-title');
    for (let i = 0; i < modalTitles.length; i++) {
      if (modalTitles[i].textContent && modalTitles[i].textContent.includes('アカウントタイプ')) {
        const modal = modalTitles[i].closest('.modal');
        if (modal) {
          // カードタイトルを修正
          const cardTitles = modal.querySelectorAll('.card-title');
          for (let j = 0; j < cardTitles.length; j++) {
            if (cardTitles[j].textContent === '証明写真タイプ') {
              cardTitles[j].textContent = '観光客';
            }
          }
        }
        break;
      }
    }
    
    // カメラモーダル内の「この写真を使用」ボタンの確保
    const cameraModals = document.querySelectorAll('.modal');
    for (let i = 0; i < cameraModals.length; i++) {
      const modal = cameraModals[i];
      
      // カメラ関連のモーダルかどうか確認
      const title = modal.querySelector('.modal-title');
      if (title && (title.textContent.includes('写真') || 
                   title.textContent.includes('撮影'))) {
        
        // 「この写真を使用」ボタンの確認
        let useButton = null;
        const buttons = modal.querySelectorAll('button');
        
        for (let j = 0; j < buttons.length; j++) {
          if (buttons[j].textContent && 
              buttons[j].textContent.includes('この写真を使用')) {
            useButton = buttons[j];
            break;
          }
        }
        
        // ボタンがなく、かつプレビュー画像があれば追加
        if (!useButton) {
          const img = modal.querySelector('img:not([src=""])');
          if (img) {
            const footer = modal.querySelector('.modal-footer');
            if (footer) {
              // スタイルをBootstrapに合わせる
              const newButton = document.createElement('button');
              newButton.type = 'button';
              newButton.className = 'btn btn-success';
              newButton.innerHTML = 'この写真を使用';
              
              // 既存UIのスタイルを崩さないように配置
              footer.appendChild(newButton);
            }
          }
        }
      }
    }
  }
  
  /**
   * テキストノードを効率的に処理（限定的なスコープで）
   */
  function fixTextNodes() {
    // モーダル内のテキストノードのみを処理
    const modals = document.querySelectorAll('.modal');
    
    for (let i = 0; i < modals.length; i++) {
      const walker = document.createTreeWalker(
        modals[i],
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      const textsToReplace = [
        { from: '証明写真タイプ', to: '観光客' }
      ];
      
      let node;
      while (node = walker.nextNode()) {
        for (const replacement of textsToReplace) {
          if (node.nodeValue.includes(replacement.from)) {
            node.nodeValue = node.nodeValue.replace(
              replacement.from, 
              replacement.to
            );
          }
        }
      }
    }
  }
  
  /**
   * 翻訳データを修正
   */
  function fixTranslations() {
    if (window.i18n && window.i18n.dictionary) {
      // 日本語の翻訳を修正
      if (window.i18n.dictionary.ja) {
        window.i18n.dictionary.ja['auth.tourist'] = '観光客';
        window.i18n.dictionary.ja['auth.document_type'] = '観光客';
      }
      
      // 英語の翻訳を修正
      if (window.i18n.dictionary.en) {
        window.i18n.dictionary.en['auth.tourist'] = 'Tourist';
        window.i18n.dictionary.en['auth.document_type'] = 'Tourist';
      }
    }
  }
  
  /**
   * ポリフィルは使用しない - むしろ純粋なJavaScriptで処理する
   * 問題が発生していたcontains擬似セレクタは完全に削除
   */
})();