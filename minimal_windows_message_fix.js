/**
 * 最小限のWindows連携メッセージ非表示スクリプト
 * UIに一切干渉せず、メッセージだけを非表示にする
 */
(function() {
  console.log('Windows連携メッセージ対策: 初期化中');
  
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
              console.log('Windows連携メッセージを検出、非表示化');
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
      console.log('Windows連携メッセージを非表示', popups.length);
      
      popups.forEach(popup => {
        popup.style.display = 'none';
      });
    }
    
    // 「Windowsにリンク」テキストを含む要素を探す
    const windowsLinkElements = Array.from(document.querySelectorAll('div, p, span')).filter(
      el => el.textContent && el.textContent.includes('Windows にリンク')
    );
    
    if (windowsLinkElements.length > 0) {
      console.log('Windowsリンクテキストを非表示', windowsLinkElements.length);
      
      windowsLinkElements.forEach(element => {
        element.style.display = 'none';
      });
    }
  }, 1000);
  
  // カメラボタンのクリックイベントを監視（モーダル表示時に備える）
  document.addEventListener('click', function(e) {
    // カメラボタンかどうかを判定
    if (
      e.target.classList.contains('camera-button') || 
      e.target.closest('.camera-button') ||
      (e.target.textContent && e.target.textContent.includes('カメラ')) ||
      (e.target.innerHTML && e.target.innerHTML.includes('camera'))
    ) {
      // カメラボタンがクリックされたら、少し待ってからポップアップを確認
      setTimeout(function() {
        const popups = document.querySelectorAll('div[id^="Xiaomi"]');
        popups.forEach(popup => {
          popup.style.display = 'none';
        });
      }, 500);
      
      // 3秒後に再度チェック（遅延表示対策）
      setTimeout(function() {
        const popups = document.querySelectorAll('div[id^="Xiaomi"]');
        popups.forEach(popup => {
          popup.style.display = 'none';
        });
      }, 3000);
    }
  });
})();