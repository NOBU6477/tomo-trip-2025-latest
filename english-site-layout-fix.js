/**
 * 英語サイト専用レイアウト修正スクリプト
 * 右側パネル表示問題とoverflow設定を修正
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 英語サイトレイアウト修正開始');
  
  // 英語サイトかどうかの判定
  const isEnglishSite = window.location.pathname.includes('index-en.html') || 
                       document.documentElement.lang === 'en';
  
  if (!isEnglishSite) {
    console.log('日本語サイトなので英語レイアウト修正をスキップ');
    return;
  }
  
  // CSS修正を即座に適用
  applyLayoutFixes();
  
  // DOM変更監視
  const observer = new MutationObserver(() => {
    applyLayoutFixes();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  // 5秒後に監視を停止
  setTimeout(() => {
    observer.disconnect();
  }, 5000);
});

function applyLayoutFixes() {
  console.log('🎨 英語サイトレイアウト修正適用');
  
  // CSS修正をheadに追加
  if (!document.getElementById('english-layout-fix-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'english-layout-fix-styles';
    styleElement.textContent = `
      /* 英語サイト専用レイアウト修正 */
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        width: 100vw !important;
        max-width: 100vw !important;
        position: relative !important;
      }
      
      .container, .container-fluid {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      
      /* 右側パネル修正 */
      body::after,
      body::before {
        display: none !important;
      }
      
      /* TomoTrip Local Guide Platform overflow修正 */
      .overflow-debug {
        display: none !important;
      }
      
      /* 横スクロール防止 */
      * {
        box-sizing: border-box !important;
      }
      
      .row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      
      .col, .col-* {
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
      }
      
      /* ナビゲーション修正 */
      .navbar {
        width: 100% !important;
        max-width: 100vw !important;
      }
      
      /* コンテンツ幅制限 */
      main, section {
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      
      /* モバイル対応 */
      @media (max-width: 768px) {
        .container {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // TomoTrip Local Guide Platformテキストを削除
  removeDebugText();
  
  // コンテナ幅修正
  fixContainerWidths();
}

function removeDebugText() {
  // デバッグテキストを検索して削除
  const debugTexts = [
    'TomoTrip Local Guide Platform',
    'overflow:hidden',
    '全画面のoverflow',
    'html, body { overflow'
  ];
  
  debugTexts.forEach(text => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.includes(text)) {
        textNodes.push(node);
      }
    }
    
    textNodes.forEach(textNode => {
      if (textNode.parentNode && textNode.parentNode.tagName !== 'SCRIPT') {
        textNode.textContent = textNode.textContent.replace(new RegExp(text, 'g'), '');
        if (textNode.textContent.trim() === '') {
          textNode.remove();
        }
      }
    });
  });
}

function fixContainerWidths() {
  // コンテナ要素の幅を修正
  const containers = document.querySelectorAll('.container, .container-fluid, .row');
  containers.forEach(container => {
    container.style.maxWidth = '100%';
    container.style.overflowX = 'hidden';
  });
  
  // 右側にはみ出る要素を修正
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      element.style.maxWidth = '100%';
      element.style.overflowX = 'hidden';
    }
  });
}

// グローバル関数として公開
window.fixEnglishLayout = {
  applyLayoutFixes,
  removeDebugText,
  fixContainerWidths
};