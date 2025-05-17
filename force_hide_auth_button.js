/**
 * 認証ボタン強制非表示スクリプト
 * 緑色の「認証済み」ボタンをコンテンツ変更も含めて強制非表示
 */
(function() {
  // スクリプト初期化
  function init() {
    console.log('認証ボタン強制非表示スクリプト初期化');
    
    // すぐに実行
    forceHideAuthButtons();
    
    // モーダル表示時も実行
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示、認証ボタン強制非表示実行');
        setTimeout(forceHideAuthButtons, 0);
        setTimeout(forceHideAuthButtons, 100);
        setTimeout(forceHideAuthButtons, 300);
      }
    });
    
    // DOM変更の監視
    observeDOM();
    
    // 定期的に実行
    setInterval(forceHideAuthButtons, 1000);
  }
  
  // 認証ボタンを強制非表示
  function forceHideAuthButtons() {
    // ガイド登録モーダル内の緑色ボタンを検索
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    console.log('認証ボタン強制非表示処理実行');
    
    // すべての緑色ボタンとバッジを検索
    const buttons = guideModal.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"], .authentication-badge');
    
    buttons.forEach(function(button) {
      // ボタンのコンテンツ確認
      if (button.textContent && (button.textContent.includes('認証済') || button.textContent.includes('済み'))) {
        console.log('認証済みボタンを検出:', button.tagName, button.className);
        forceHideElement(button);
      } else {
        // 一般的な緑色要素も非表示
        forceHideElement(button);
      }
    });
    
    // 電話番号認証セクションも探す
    guideModal.querySelectorAll('label').forEach(function(label) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // 親セクションを取得
        const section = label.closest('.row, .form-group') || label.parentElement;
        if (section) {
          // セクション内の緑色要素を全て隠す
          const sectionButtons = section.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"]');
          sectionButtons.forEach(forceHideElement);
          
          // 未認証表示があれば表示
          const hiddenElements = section.querySelectorAll('.d-none');
          hiddenElements.forEach(function(element) {
            if (element.textContent && (element.textContent.includes('未表示') || element.textContent.includes('未認証'))) {
              element.classList.remove('d-none');
              element.style.display = 'block';
            }
          });
        }
      }
    });
    
    // 最終手段: 文字列で直接検索して非表示
    const allElements = guideModal.querySelectorAll('*');
    allElements.forEach(function(element) {
      if (element.childNodes.length > 0) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const node = element.childNodes[i];
          if (node.nodeType === 3 && node.textContent && node.textContent.includes('認証済')) {
            console.log('認証済みテキストを持つ要素を検出:', element.tagName, element.className);
            forceHideElement(element);
            break;
          }
        }
      }
    });
  }
  
  // 要素を強制的に非表示
  function forceHideElement(element) {
    if (!element) return;
    
    // インラインスタイルで強制非表示
    element.style.setProperty('display', 'none', 'important');
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('height', '0', 'important');
    element.style.setProperty('width', '0', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');
    element.style.setProperty('position', 'absolute', 'important');
    element.style.setProperty('pointer-events', 'none', 'important');
    element.classList.add('d-none');
    
    // テキストコンテンツも削除
    try {
      element.textContent = '';
      element.innerHTML = '';
    } catch (e) {
      console.error('要素コンテンツ削除エラー:', e);
    }
    
    // 可能であれば要素も削除
    try {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (e) {
      console.error('要素削除エラー:', e);
    }
  }
  
  // DOM変更の監視
  function observeDOM() {
    const observer = new MutationObserver(function(mutations) {
      let shouldProcess = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 新しいノードが追加されたか確認
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // 要素ノード
              // 緑色系クラスかID、またはテキストに「認証済」を含むかチェック
              if ((node.classList && 
                   (node.classList.contains('btn-success') || 
                    node.classList.contains('badge') || 
                    node.classList.contains('bg-success') || 
                    node.classList.contains('alert-success'))) || 
                  (node.id && node.id.includes('verified')) || 
                  (node.textContent && node.textContent.includes('認証済'))) {
                shouldProcess = true;
                break;
              }
            }
          }
        } 
        else if (mutation.type === 'attributes') {
          // 属性変更の場合はガイドモーダル内の要素かチェック
          const guideModal = document.getElementById('guideRegistrationModal');
          if (guideModal && guideModal.contains(mutation.target)) {
            // クラス属性が変更された場合
            if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
              shouldProcess = true;
              break;
            }
          }
        }
      }
      
      if (shouldProcess) {
        forceHideAuthButtons();
      }
    });
    
    // document全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'id']
    });
  }
  
  // DOMの準備ができたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時にも実行
  window.addEventListener('load', function() {
    init();
    setTimeout(forceHideAuthButtons, 500);
  });
})();