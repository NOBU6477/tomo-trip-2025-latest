/**
 * 最終手段: 電話認証バッジを強制的にハードコード修正
 * スクリーンショットで見える緑色の「認証済み」ボタンを正確に特定して強制削除
 */
(function() {
  // 初期化
  function init() {
    // すぐに実行
    removeAuthBadge();
    
    // モーダル表示時にも実行
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイドモーダル表示を検出、緊急修正を実行');
        // 少し遅延させて複数回実行することで確実に対応
        removeAuthBadge();
        setTimeout(removeAuthBadge, 100);
        setTimeout(removeAuthBadge, 300);
        setTimeout(removeAuthBadge, 500);
      }
    });
    
    // 定期的に監視
    setInterval(removeAuthBadge, 1000);
  }

  // 緑色の認証済みバッジを削除
  function removeAuthBadge() {
    // ガイド登録モーダルを探す
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal) return;
    
    // モーダル内の電話番号認証セクションを特定
    const phoneLabels = modal.querySelectorAll('label');
    let phoneSection = null;
    
    // 電話番号認証ラベルを探す
    phoneLabels.forEach(function(label) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // ラベルが見つかった場合、親要素を保存
        phoneSection = findParentSection(label);
      }
    });
    
    if (phoneSection) {
      // スクリーンショットの緑色ボタンと一致する要素を探す
      const authButtons = phoneSection.querySelectorAll('button.btn.btn-success, .btn-success, .badge.bg-success, .alert-success');
      
      authButtons.forEach(function(button) {
        // テキストで「認証済み」ボタンを特定
        if (button.textContent && button.textContent.includes('認証済')) {
          console.log('認証済みボタンを特定:', button.tagName, button.className);
          
          // 強制削除
          hardRemove(button);
          
          // 代わりに「未表示」表示があれば表示
          const siblingElements = phoneSection.querySelectorAll('.d-none');
          siblingElements.forEach(function(element) {
            if (element.textContent && element.textContent.includes('未表示')) {
              element.classList.remove('d-none');
              element.style.removeProperty('display');
            }
          });
        }
      });
      
      // 特定のIDを持つ要素も確認
      const verifiedElem = modal.querySelector('#guide-phone-verified');
      if (verifiedElem) {
        hardRemove(verifiedElem);
      }
      
      // 直接コンテナもチェック
      const containers = phoneSection.querySelectorAll('.row, .col-md-6, .col-12, .form-group');
      containers.forEach(function(container) {
        const greenButtons = container.querySelectorAll('.btn-success, .badge.bg-success');
        greenButtons.forEach(function(btn) {
          hardRemove(btn);
        });
      });
    }
    
    // もっと広く探索：スタイルで緑色の要素を特定
    const allElements = modal.querySelectorAll('*');
    allElements.forEach(function(element) {
      if (element.nodeType === 1) {
        try {
          const style = window.getComputedStyle(element);
          const bgColor = style.backgroundColor;
          
          // 緑っぽい背景色を検出
          if (bgColor && bgColor.includes('rgb')) {
            const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
              const r = parseInt(match[1], 10);
              const g = parseInt(match[2], 10);
              const b = parseInt(match[3], 10);
              
              // 緑が支配的な色かチェック
              if (g > r * 1.5 && g > b * 1.5) {
                console.log('緑色要素を検出:', element.tagName, element.className);
                
                // ボタンや認証バッジらしき要素か確認
                if (element.tagName === 'BUTTON' || 
                    element.classList.contains('badge') || 
                    element.classList.contains('btn') || 
                    element.classList.contains('alert')) {
                  hardRemove(element);
                }
              }
            }
          }
        } catch (e) {
          // スタイル計算エラーは無視
        }
      }
    });
    
    // 最終手段: テキストで「認証済み」を含む要素を探して削除
    const textNodes = [];
    findTextNodes(modal, "認証済", textNodes);
    
    textNodes.forEach(function(node) {
      if (node.nodeType === 3) { // テキストノード
        const parent = node.parentElement;
        if (parent) {
          console.log('「認証済み」テキストを持つ要素を検出:', parent.tagName, parent.className);
          hardRemove(parent);
        }
      } else if (node.nodeType === 1) { // 要素ノード
        console.log('「認証済み」テキストを持つ要素を検出:', node.tagName, node.className);
        hardRemove(node);
      }
    });
  }
  
  // 電話番号認証セクションの親要素を見つける
  function findParentSection(label) {
    // 最初に試すのは一般的なBootstrapの行/列構造
    let parent = label.closest('.row') || label.closest('.form-group') || label.closest('.mb-3');
    
    // 見つからない場合は親要素を返す
    if (!parent) {
      parent = label.parentElement;
      if (parent.classList.contains('form-label')) {
        parent = parent.parentElement;
      }
    }
    
    return parent;
  }
  
  // 要素を完全に削除する
  function hardRemove(element) {
    if (!element) return;
    
    // まず非表示
    element.style.setProperty('display', 'none', 'important');
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('height', '0', 'important');
    element.style.setProperty('width', '0', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');
    element.style.setProperty('position', 'absolute', 'important');
    element.style.setProperty('pointer-events', 'none', 'important');
    element.classList.add('d-none');
    
    // 内容も空に
    element.textContent = '';
    element.innerHTML = '';
    
    // 完全削除を試みる
    try {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (e) {
      console.log('要素削除エラー:', e);
    }
  }
  
  // テキストノードを再帰的に探索
  function findTextNodes(element, searchText, result) {
    if (!element) return;
    
    // 子ノードを走査
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      
      // テキストノードの場合
      if (node.nodeType === 3) {
        if (node.textContent && node.textContent.includes(searchText)) {
          result.push(node);
        }
      }
      // 要素ノードの場合は再帰
      else if (node.nodeType === 1) {
        // テキストコンテンツとして含むかチェック
        if (node.textContent && node.textContent.includes(searchText)) {
          // 直接のテキストコンテンツとして含むかチェック
          let hasDirectText = false;
          for (let j = 0; j < node.childNodes.length; j++) {
            if (node.childNodes[j].nodeType === 3 && 
                node.childNodes[j].textContent && 
                node.childNodes[j].textContent.includes(searchText)) {
              hasDirectText = true;
              break;
            }
          }
          
          if (hasDirectText) {
            result.push(node);
          } else {
            // 子要素を探索
            findTextNodes(node, searchText, result);
          }
        }
      }
    }
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
    setTimeout(removeAuthBadge, 1000);
  });
})();