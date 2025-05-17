/**
 * 電話認証セクションの特定のバッジを非表示にする特殊スクリプト
 * 最後の手段として、特定のバッジを直接削除
 * 
 * スクリーンショットの緑色ボタンを特定して削除
 */
(function() {
  console.log('特殊バッジ非表示スクリプト: 初期化');
  
  // DOMが読み込まれたらすぐに実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeSpecificBadges);
  } else {
    removeSpecificBadges();
  }
  
  // 読み込み完了時にも実行（レイアウト完了後）
  window.addEventListener('load', function() {
    removeSpecificBadges();
    // 少し遅延させて再実行（非同期処理による遅延対策）
    setTimeout(removeSpecificBadges, 500);
    setTimeout(removeSpecificBadges, 1000);
    setTimeout(removeSpecificBadges, 2000);
  });

  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function() {
    removeSpecificBadges();
    // 少し遅延させて再実行
    setTimeout(removeSpecificBadges, 200);
  });
  
  // バッジを直接削除する関数
  function removeSpecificBadges() {
    console.log('特定の認証バッジを検索中...');
    
    // 1. 特定の緑色ボタンを探す (スクリーンショットで表示されているバッジ)
    const greenButtons = document.querySelectorAll('.btn-success, button.bg-success, .badge.bg-success, .authentication-badge');
    greenButtons.forEach(btn => {
      if (btn.textContent && (btn.textContent.includes('認証済み') || btn.textContent.includes('確認'))) {
        console.log('緑色の認証ボタンを削除:', btn.textContent);
        removeElement(btn);
      } else if (btn.parentElement && btn.parentElement.id && btn.parentElement.id.includes('phone')) {
        console.log('電話関連の緑ボタンを削除:', btn.parentElement.id);
        removeElement(btn);
      }
    });
    
    // 2. 電話認証セクションを探す（特に guide-phone-verified）
    document.querySelectorAll('#guide-phone-verified, #tourist-phone-verified').forEach(badge => {
      console.log('Phone verified badge found, removing:', badge.id);
      removeElement(badge);
    });
    
    // 3. 電話認証セクションを広範囲で探す
    const phoneSections = document.querySelectorAll('[id*="phone"], .phone-verification, [class*="phone"]');
    phoneSections.forEach(section => {
      // 認証セクション内のすべての緑色要素を探す（バッジ、ボタン、アラートなど）
      const badges = section.querySelectorAll('.btn-success, .badge, .alert-success, .bg-success, [style*="green"]');
      badges.forEach(badge => {
        console.log('電話認証セクション内の緑色要素を削除:', badge.className || badge.tagName);
        removeElement(badge);
      });
    });
    
    // 4. 電話番号認証セクションのテキスト見出しを探す (h4, h5, ラベルなど)
    ['h4', 'h5', 'label', 'div.form-label'].forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.textContent && element.textContent.includes('電話番号認証')) {
          console.log('電話番号認証見出し発見:', element.textContent);
          
          // この見出しの下のすべての緑色要素（バッジ含む）を探す
          let sibling = element.nextElementSibling;
          while (sibling) {
            // 緑色の要素かどうか確認
            const style = window.getComputedStyle(sibling);
            if (sibling.classList.contains('btn-success') || 
                sibling.classList.contains('badge') || 
                sibling.classList.contains('alert-success') ||
                sibling.classList.contains('bg-success') ||
                style.backgroundColor.includes('rgb(') && style.backgroundColor.match(/\d+/g)?.[1] > 150) {
              console.log('電話番号認証セクション下の緑色要素を削除');
              removeElement(sibling);
            }
            sibling = sibling.nextElementSibling;
          }
          
          // 親要素内のバッジも確認（より広範囲に）
          let parent = element.parentElement;
          for (let i = 0; i < 3 && parent; i++) { // 3レベル上まで確認
            const badges = parent.querySelectorAll('.btn-success, .badge, .alert-success, .bg-success');
            badges.forEach(badge => {
              console.log(`電話番号認証セクションの親(${i}レベル)内のバッジを削除`);
              removeElement(badge);
            });
            parent = parent.parentElement;
          }
        }
      });
    });
    
    // 5. 特殊なケース: スタイルベースでの緑色ボタン特定（計算スタイルを使用）
    document.querySelectorAll('button, span, div, a').forEach(element => {
      // 計算スタイルを取得
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      const color = style.color;
      
      // 緑系の背景色かどうかをRGB値で判定
      if (backgroundColor.includes('rgb')) {
        const rgbBg = backgroundColor.match(/\d+/g);
        if (rgbBg && rgbBg.length >= 3) {
          const r = parseInt(rgbBg[0]);
          const g = parseInt(rgbBg[1]);
          const b = parseInt(rgbBg[2]);
          
          // 明らかに緑が強い色（緑成分が赤と青より50以上高い）
          if (g > r + 30 && g > b + 30 && g > 100) {
            // 電話関連のセクション内または認証関連のテキストを含む場合
            if (element.closest('[id*="phone"]') !== null || 
                (element.textContent && 
                 (element.textContent.includes('認証済') || 
                  element.textContent.includes('確認') || 
                  element.textContent.includes('verified')))) {
              console.log('緑色スタイルベースで検出された要素を削除:', element.tagName, element.className);
              removeElement(element);
            }
          }
        }
      }
      
      // テキストが緑色の場合も確認（特に認証済みテキスト）
      if (color.includes('rgb')) {
        const rgbColor = color.match(/\d+/g);
        if (rgbColor && rgbColor.length >= 3) {
          const r = parseInt(rgbColor[0]);
          const g = parseInt(rgbColor[1]);
          const b = parseInt(rgbColor[2]);
          
          // 緑色のテキストで認証関連の文字列を含む場合
          if (g > r + 30 && g > b + 30 && g > 100 && 
              element.textContent && 
              (element.textContent.includes('認証済') || 
               element.textContent.includes('確認'))) {
            console.log('緑色テキストの認証関連要素を削除:', element.textContent);
            removeElement(element);
          }
        }
      }
    });
  }
  
  // 要素を非表示にする関数
  function removeElement(element) {
    if (!element) return;
    
    // CSSで非表示にする
    element.style.setProperty('display', 'none', 'important');
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('height', '0', 'important');
    element.style.setProperty('width', '0', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');
    element.style.setProperty('padding', '0', 'important');
    element.style.setProperty('margin', '0', 'important');
    element.style.setProperty('border', 'none', 'important');
    element.classList.add('d-none');
    
    // 可能であれば要素を削除（表示を確実に防止）
    try {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (e) {
      console.log('要素の削除に失敗しました:', e);
    }
  }
})();