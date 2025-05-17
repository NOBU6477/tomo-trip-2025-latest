/**
 * ガイド登録モーダル内の「認証済み」バッジをピンポイントで削除するための最終手段
 */
(function() {
  function init() {
    console.log('Badge Direct Remover: 初期化');
    
    // バッジ削除の初期実行
    setTimeout(executeDirectRemoval, 500);
    
    // DOM変更を監視
    observeDOMChanges();
    
    // モーダル表示時のイベント監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示: バッジ削除実行');
        setTimeout(executeDirectRemoval, 100);
      }
    });
    
    // クリックイベントも監視（モーダル内の操作を検知）
    document.addEventListener('click', function() {
      const guideModal = document.getElementById('guideRegistrationModal');
      if (guideModal && isModalVisible(guideModal)) {
        executeDirectRemoval();
      }
    });
    
    // 定期的にバッジをチェック
    setInterval(executeDirectRemoval, 1000);
  }
  
  // DOM変更を監視するMutationObserver
  function observeDOMChanges() {
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        // モーダル内部の変更を検出
        const guideModal = document.getElementById('guideRegistrationModal');
        if (guideModal && isModalVisible(guideModal)) {
          executeDirectRemoval();
        }
      }
    });
    
    // document全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // バッジを直接削除する主要関数
  function executeDirectRemoval() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal || !isModalVisible(guideModal)) return;
    
    console.log('バッジ削除処理を実行中...');
    
    // モーダル内のすべての緑色バッジを探す
    const successBadges = guideModal.querySelectorAll('.badge.bg-success, .badge-success, [class*="badge"][class*="success"]');
    for (const badge of successBadges) {
      if (badge.textContent && badge.textContent.trim() === '認証済み') {
        forceHideElement(badge);
        console.log('緑色バッジを排除:', badge);
      }
    }
    
    // 緑色ボタンを探す
    const successButtons = guideModal.querySelectorAll('.btn-success, .btn.bg-success, [class*="btn"][class*="success"]');
    for (const button of successButtons) {
      if (button.textContent && button.textContent.trim() === '認証済み') {
        forceHideElement(button);
        console.log('緑色ボタンを排除:', button);
      }
    }
    
    // 電話番号認証セクションを探す
    const phoneVerificationSection = findPhoneVerificationSection(guideModal);
    if (phoneVerificationSection) {
      // セクション内のすべての緑色要素（背景色・テキスト）
      removeSuccessBadges(phoneVerificationSection);
      
      // 「未表示」テキストが表示されているか確認
      ensureUnverifiedText(phoneVerificationSection);
    }
    
    // 「認証済み」テキストを含む要素を探す（クラスに関係なく）
    const allElements = guideModal.querySelectorAll('*');
    for (const element of allElements) {
      if (element.textContent && element.textContent.trim() === '認証済み') {
        forceHideElement(element);
        console.log('認証済みテキスト要素を排除:', element);
      }
    }
    
    // 緑色背景のボタン（コンピュートされたスタイルを確認）
    const allButtons = guideModal.querySelectorAll('button, .btn, [role="button"]');
    for (const button of allButtons) {
      const computedStyle = window.getComputedStyle(button);
      const backgroundColor = computedStyle.backgroundColor;
      
      // 緑色系かどうかチェック (rgb値で緑色が強い場合)
      if (isGreenRGB(backgroundColor) && button.textContent && button.textContent.includes('認証済み')) {
        forceHideElement(button);
        console.log('緑色背景ボタンを排除:', button);
      }
    }
  }
  
  // 電話認証セクション内のサクセスバッジを削除
  function removeSuccessBadges(container) {
    // 緑色バッジを探す
    const badges = container.querySelectorAll('.badge, span, div, button');
    for (const badge of badges) {
      // テキストが「認証済み」を含む、または緑色クラスを持つ
      if ((badge.textContent && badge.textContent.includes('認証済み')) || 
          badge.classList.contains('bg-success') || 
          badge.classList.contains('btn-success') ||
          badge.classList.contains('badge-success')) {
        
        forceHideElement(badge);
        console.log('電話認証セクション内のバッジを排除:', badge);
      }
    }
  }
  
  // 「未表示」テキストを確保
  function ensureUnverifiedText(container) {
    const unverifiedText = findUnverifiedText(container);
    
    // 「未表示」テキストがすでに存在する場合
    if (unverifiedText) {
      // 表示されていることを確認
      unverifiedText.style.display = 'inline-block';
      unverifiedText.style.visibility = 'visible';
      unverifiedText.style.opacity = '1';
      unverifiedText.style.cursor = 'pointer';
      
      // クリックイベントを設定（もしなければ）
      if (!unverifiedText.onclick) {
        unverifiedText.onclick = function() {
          const phoneModal = document.getElementById('phoneVerificationModal');
          if (phoneModal) {
            const modal = new bootstrap.Modal(phoneModal);
            modal.show();
          }
        };
      }
      
      return;
    }
    
    // 「未表示」テキストが見つからない場合は新規作成
    const phoneSection = findPhoneVerificationSection(container);
    if (phoneSection) {
      const label = phoneSection.querySelector('label');
      
      const newUnverifiedText = document.createElement('span');
      newUnverifiedText.className = 'text-muted unverified-text';
      newUnverifiedText.textContent = '未表示';
      newUnverifiedText.style.cursor = 'pointer';
      newUnverifiedText.style.marginLeft = '0.5rem';
      newUnverifiedText.style.display = 'inline-block';
      
      newUnverifiedText.onclick = function() {
        const phoneModal = document.getElementById('phoneVerificationModal');
        if (phoneModal) {
          const modal = new bootstrap.Modal(phoneModal);
          modal.show();
        }
      };
      
      // ラベルがあれば、その後に挿入
      if (label) {
        if (label.nextSibling) {
          label.parentNode.insertBefore(newUnverifiedText, label.nextSibling);
        } else {
          label.parentNode.appendChild(newUnverifiedText);
        }
      } else {
        // ラベルがなければ先頭に追加
        if (phoneSection.firstChild) {
          phoneSection.insertBefore(newUnverifiedText, phoneSection.firstChild);
        } else {
          phoneSection.appendChild(newUnverifiedText);
        }
      }
      
      console.log('新しい「未表示」テキストを作成');
    }
  }
  
  // 「未表示」テキストを探す
  function findUnverifiedText(container) {
    // 特定のクラスを持つ要素
    const elements = container.querySelectorAll('.text-muted, span, small, div');
    
    for (const element of elements) {
      const text = element.textContent;
      if (text && text.trim() === '未表示' && isVisible(element)) {
        return element;
      }
    }
    
    return null;
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(container) {
    // ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        return label.closest('.form-group, .mb-3, .row, div[class*="form"]') || label.parentElement;
      }
    }
    
    // テキストから探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === 1) {
        return el.closest('.form-group, .mb-3, .row, div[class*="form"]') || el.parentElement;
      }
    }
    
    return null;
  }
  
  // 要素を徹底的に非表示化
  function forceHideElement(element) {
    if (!element) return;
    
    // インラインスタイルで強制非表示
    element.style.display = 'none !important';
    element.style.visibility = 'hidden !important';
    element.style.opacity = '0 !important';
    element.style.height = '0 !important';
    element.style.width = '0 !important';
    element.style.position = 'absolute !important';
    element.style.left = '-9999px !important';
    element.style.overflow = 'hidden !important';
    element.style.pointerEvents = 'none !important';
    element.style.zIndex = '-9999 !important';
    
    // 重要フラグ付きでインラインスタイルを設定
    element.setAttribute('style', 'display:none !important; visibility:hidden !important; opacity:0 !important; height:0 !important; width:0 !important; position:absolute !important; left:-9999px !important; overflow:hidden !important; pointer-events:none !important; z-index:-9999 !important;');
    
    // クラスも追加
    element.classList.add('d-none', 'invisible', 'visually-hidden');
    
    // 排除済みマーク
    element.setAttribute('data-removed-badge', 'true');
    
    // 極端な方法: 要素の内容を消去
    element.textContent = '';
    element.innerHTML = '';
  }
  
  // 要素が表示されているかどうかチェック
  function isVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           !element.classList.contains('d-none') &&
           !element.classList.contains('invisible') &&
           !element.classList.contains('visually-hidden');
  }
  
  // モーダルが表示されているかどうかをチェック
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
  
  // RGB値が緑色系かどうかをチェック
  function isGreenRGB(color) {
    // rgb(25, 135, 84) または rgba(25, 135, 84, 1) 形式を想定
    const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
    
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      
      // 緑色が主要な色かどうか (緑 > 赤・青)
      return g > 100 && g > r * 1.5 && g > b * 1.5;
    }
    
    return false;
  }
  
  // ドキュメント読み込み完了時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時にも初期化
  window.addEventListener('load', init);
})();