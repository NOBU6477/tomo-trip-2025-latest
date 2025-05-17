/**
 * 最小限の修正だけを行う軽量カメラ修正スクリプト
 * UIを崩さず、Windowsメッセージだけを非表示にする
 */
(function() {
  console.log('最小限カメラ修正: 初期化中');
  
  // DOM変更の監視
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // 新しく追加された要素をチェック
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Windows連携メッセージかチェック
            if (node.id && node.id.includes('Xiaomi')) {
              console.log('Windowsリンクメッセージを検出、非表示化');
              node.style.display = 'none';
            }
          }
        }
      }
    }
  });
  
  // document全体の変更を監視
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 定期的にWindowsメッセージをチェック
  setInterval(function() {
    // Xiaomi関連のポップアップを非表示
    const popups = document.querySelectorAll('div[id^="Xiaomi"]');
    
    if (popups.length > 0) {
      console.log('最小限カメラ修正: Windowsメッセージを非表示', popups.length);
      
      popups.forEach(popup => {
        popup.style.display = 'none';
      });
    }
    
    // 「Windowsにリンク」テキストを含む要素を探す
    const windowsLinkElements = Array.from(document.querySelectorAll('div, p, span')).filter(
      el => el.textContent && el.textContent.includes('Windows にリンク')
    );
    
    if (windowsLinkElements.length > 0) {
      console.log('最小限カメラ修正: Windowsリンクテキストを非表示', windowsLinkElements.length);
      
      windowsLinkElements.forEach(element => {
        element.style.display = 'none';
      });
    }
  }, 1000);
})();