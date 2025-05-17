/**
 * プロフィールプレビューの表示改善スクリプト
 * プレビューカードの文字が切れる問題を解決し、全テキストが表示できるようにする
 * 複数のCSSセレクタに対応し、あらゆるプレビュー表示をサポート
 */
(function() {
  // CSSを強制的に読み込む
  function loadCSS() {
    // すでに読み込まれていたら追加しない
    if (document.querySelector('link[href="profile-preview-scroll.css"]')) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'profile-preview-scroll.css';
    link.id = 'profile-preview-scroll-css';
    document.head.appendChild(link);
    
    // 念のため既存のスタイルシートを上書きするためにインラインスタイルも追加
    const style = document.createElement('style');
    style.textContent = `
      /* 文字を切らないための緊急修正スタイル */
      .profile-preview-card, .profile-preview, [class*="profile-preview"], .card-body p, .card-text, p.card-text {
        white-space: normal !important;
        overflow-wrap: break-word !important;
        word-break: break-word !important;
        width: 100% !important;
        overflow: visible !important;
        text-overflow: unset !important;
      }
    `;
    document.head.appendChild(style);
  }

  // プロフィールプレビューカードを処理
  function processPreviewCards() {
    // より多くのセレクタをカバー
    const previewSelectors = [
      '.profile-preview', 
      '.profile-preview-card',
      '[id^="profile-preview"]',
      '.card.mb-4',
      '.card-body',
      'div.card[style*="width"]'
    ];
    
    const selector = previewSelectors.join(', ');
    const previewCards = document.querySelectorAll(selector);
    
    if (previewCards.length === 0) {
      // まだ要素がない場合は再試行
      setTimeout(processPreviewCards, 300);
      return;
    }
    
    previewCards.forEach(card => {
      // すでに処理済みならスキップ
      if (card.dataset.fixedText === 'true') return;
      
      // 改善フラグを設定
      card.dataset.fixedText = 'true';
      
      // スタイルを直接適用
      card.style.whiteSpace = 'normal';
      card.style.wordBreak = 'break-word';
      card.style.overflowX = 'visible';
      card.style.overflowY = 'auto';
      card.style.width = '100%';
      card.style.maxWidth = '300px';
      card.style.textOverflow = 'unset';
      
      // すべての子テキスト要素も修正
      const textElements = card.querySelectorAll('p, div, span, .card-text, h5, h4, h3');
      textElements.forEach(elem => {
        elem.style.whiteSpace = 'normal';
        elem.style.wordBreak = 'break-word';
        elem.style.overflow = 'visible';
        elem.style.width = '100%';
        elem.style.maxWidth = '100%';
        elem.style.textOverflow = 'unset';
      });
    });
  }

  // 初期化
  function init() {
    console.log("プロフィールプレビュー表示改善を開始します");
    loadCSS();
    
    // すぐに処理を実行
    processPreviewCards();
    
    // DOM変更を監視して動的に追加された要素も処理
    const observer = new MutationObserver(function(mutations) {
      processPreviewCards();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // フォーム入力に変更があった場合も再処理
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', processPreviewCards);
      input.addEventListener('change', processPreviewCards);
    });
    
    // 定期的にチェック（念のため）
    setInterval(processPreviewCards, 1000);
    
    // 最初のページ読み込み時に少し遅延させて実行
    setTimeout(processPreviewCards, 500);
    setTimeout(processPreviewCards, 1500);
    setTimeout(processPreviewCards, 3000);
  }

  // スクリプトの実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();