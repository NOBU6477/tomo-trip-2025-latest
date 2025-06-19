/**
 * 最も強力な直接DOM操作による認証バッジ排除
 * 一切の例外なく電話認証の緑色ボタンと認証済みバッジを消去する
 */
(function() {
  // 初期化関数
  function init() {
    console.log('Direct DOM Manipulator: 初期化');
    
    // 初期チェック
    setTimeout(purgeAuthBadges, 500);
    
    // イベントリスナー登録
    setupEventListeners();
    
    // DOM変更の監視
    observeDOMChanges();
  }
  
  // イベントリスナーの設定
  function setupEventListeners() {
    // モーダル表示時
    document.addEventListener('shown.bs.modal', function(event) {
      console.log('モーダル表示:', event.target.id);
      setTimeout(purgeAuthBadges, 100);
    });
    
    // クリックイベント
    document.addEventListener('click', function() {
      setTimeout(purgeAuthBadges, 100);
    });
    
    // 定期的なクリーンアップ
    setInterval(purgeAuthBadges, 1000);
  }
  
  // DOM変更の監視設定
  function observeDOMChanges() {
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // DOMが変更されたら認証バッジをチェック
          purgeAuthBadges();
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
  
  // 認証バッジを排除する主要関数
  function purgeAuthBadges() {
    // ガイド登録モーダルを特定
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    // 電話番号認証セクションを特定
    const phoneSection = findPhoneVerificationSection(guideModal);
    if (!phoneSection) return;
    
    console.log('電話番号認証セクション発見:', phoneSection);
    
    // すべての認証済みバッジを排除（クラスを問わない）
    purgeVerifiedElements(phoneSection);
    
    // 「認証済み」テキストを含む全ての要素を排除
    purgeElementsWithVerifiedText(phoneSection);
    
    // グリーンボタンを排除
    purgeGreenButtons(phoneSection);
    
    // 「未表示」テキストが確実に表示されるようにする
    ensureUnverifiedText(phoneSection);
  }
  
  // 電話番号認証セクションを特定する関数
  function findPhoneVerificationSection(container) {
    // 「電話番号認証」というテキストを含むラベルを探す
    const phoneLabels = Array.from(container.querySelectorAll('label')).filter(label => 
      label.textContent && label.textContent.includes('電話番号認証')
    );
    
    if (phoneLabels.length > 0) {
      const label = phoneLabels[0];
      // ラベルの親要素を返す（フォームグループなど）
      return label.closest('.form-group, .mb-3, .row, div[class*="form"], div[class*="group"]') || label.parentElement;
    }
    
    // ラベルが見つからない場合、テキストで検索
    const allElements = container.querySelectorAll('*');
    for (const element of allElements) {
      if (element.textContent && element.textContent.includes('電話番号認証') && element.nodeType === 1) {
        // テキストを含む要素の親要素を返す
        return element.closest('.form-group, .mb-3, .row, div[class*="form"], div[class*="group"]') || element.parentElement;
      }
    }
    
    return null;
  }
  
  // 認証済み要素を排除
  function purgeVerifiedElements(container) {
    // 緑色のバッジ
    const badges = container.querySelectorAll('.badge.bg-success, .badge-success, [class*="badge"][class*="success"]');
    for (const badge of badges) {
      if (!isElement(badge)) continue;
      
      // バッジのテキストチェック
      if (!badge.textContent || !badge.textContent.includes('認証済み')) continue;
      
      // 徹底的に非表示化
      forceHideElement(badge);
      console.log('認証済みバッジを排除:', badge);
    }
  }
  
  // 「認証済み」テキストを含む要素を排除
  function purgeElementsWithVerifiedText(container) {
    // すべての要素を取得
    const allElements = container.querySelectorAll('*');
    
    for (const element of allElements) {
      if (!isElement(element)) continue;
      
      // テキストノードだけを取得して「認証済み」を含むか確認
      const textContent = getDirectTextContent(element);
      
      if (textContent && textContent.includes('認証済み')) {
        // 「認証済み」を含む場合、その要素を非表示
        forceHideElement(element);
        console.log('認証済みテキスト要素を排除:', element);
      }
    }
  }
  
  // グリーンボタンを排除
  function purgeGreenButtons(container) {
    // 緑色ボタンを探す（クラスベース）
    const greenButtons = container.querySelectorAll('.btn-success, .btn.bg-success, [class*="btn"][class*="success"]');
    
    for (const button of greenButtons) {
      if (!isElement(button)) continue;
      
      // バッジのテキストチェック
      if (button.textContent && button.textContent.includes('認証済み')) {
        // 徹底的に非表示化
        forceHideElement(button);
        console.log('緑色ボタンを排除:', button);
      }
    }
    
    // スタイルで緑色背景のボタンを探す
    const allButtons = container.querySelectorAll('button, .btn, [class*="btn"]');
    for (const button of allButtons) {
      if (!isElement(button)) continue;
      
      const style = window.getComputedStyle(button);
      const backgroundColor = style.backgroundColor;
      
      // 緑色系の背景色かチェック
      if (isGreenColor(backgroundColor) && button.textContent && button.textContent.includes('認証済み')) {
        forceHideElement(button);
        console.log('緑色背景ボタンを排除:', button, backgroundColor);
      }
    }
  }
  
  // 「未表示」テキストを確実に表示する
  function ensureUnverifiedText(container) {
    // 既存の「未表示」テキストを探す
    let unverifiedText = null;
    const textElements = container.querySelectorAll('.text-muted, span, div, button, a, p, small');
    
    for (const element of textElements) {
      if (!isElement(element)) continue;
      
      const directText = getDirectTextContent(element);
      if (directText && directText.trim() === '未表示' && isVisible(element)) {
        unverifiedText = element;
        break;
      }
    }
    
    // 既存の「未表示」テキストがある場合
    if (unverifiedText) {
      console.log('既存の「未表示」テキストを発見:', unverifiedText);
      
      // 確実に表示されるようにスタイル設定
      unverifiedText.style.display = 'inline-block';
      unverifiedText.style.visibility = 'visible';
      unverifiedText.style.opacity = '1';
      unverifiedText.style.position = 'static';
      unverifiedText.style.height = 'auto';
      unverifiedText.style.width = 'auto';
      unverifiedText.style.overflow = 'visible';
      unverifiedText.style.pointerEvents = 'auto';
      unverifiedText.style.cursor = 'pointer';
      unverifiedText.style.margin = '0 0 0 0.5rem';
      
      // クラスの調整
      unverifiedText.classList.remove('d-none', 'invisible', 'hidden');
      
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
    
    // 「未表示」テキストがない場合は新規作成
    console.log('「未表示」テキストを新規作成');
    
    const newUnverifiedText = document.createElement('span');
    newUnverifiedText.className = 'text-muted unverified-text';
    newUnverifiedText.textContent = '未表示';
    newUnverifiedText.style.cursor = 'pointer';
    newUnverifiedText.style.marginLeft = '0.5rem';
    newUnverifiedText.style.display = 'inline-block';
    
    // クリックイベントを設定
    newUnverifiedText.onclick = function() {
      const phoneModal = document.getElementById('phoneVerificationModal');
      if (phoneModal) {
        const modal = new bootstrap.Modal(phoneModal);
        modal.show();
      }
    };
    
    // 適切な位置に挿入
    const label = container.querySelector('label');
    if (label) {
      // ラベルの後に挿入
      label.parentNode.insertBefore(newUnverifiedText, label.nextSibling);
    } else {
      // ラベルがない場合は先頭に追加
      container.insertBefore(newUnverifiedText, container.firstChild);
    }
  }
  
  // 要素を完全に非表示にする
  function forceHideElement(element) {
    if (!element || !isElement(element)) return;
    
    // インラインスタイルで非表示
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.height = '0';
    element.style.width = '0';
    element.style.overflow = 'hidden';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.pointerEvents = 'none';
    
    // クラスを追加
    element.classList.add('d-none', 'invisible', 'visually-hidden');
    
    // データ属性でマーク
    element.setAttribute('data-hidden-by-script', 'true');
    
    // 子要素も非表示化
    const children = element.querySelectorAll('*');
    for (const child of children) {
      if (isElement(child)) {
        forceHideElement(child);
      }
    }
    
    // 別の要素で上書き（最後の手段）
    if (element.parentNode) {
      const placeholder = document.createElement('span');
      placeholder.style.display = 'none';
      element.parentNode.insertBefore(placeholder, element);
      element.parentNode.removeChild(element);
      
      // プレースホルダーに元の要素への参照を保持
      placeholder.originalElement = element;
    }
  }
  
  // 要素が表示されているかどうかをチェック
  function isVisible(element) {
    if (!element || !isElement(element)) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' &&
           style.opacity !== '0' &&
           !element.classList.contains('d-none') &&
           !element.classList.contains('invisible') &&
           !element.classList.contains('hidden');
  }
  
  // 要素から直接のテキストコンテンツを取得（子要素のテキストは含まない）
  function getDirectTextContent(element) {
    if (!element || !isElement(element)) return '';
    
    let text = '';
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    }
    return text.trim();
  }
  
  // 有効なDOM要素かどうかをチェック
  function isElement(obj) {
    return obj instanceof Element || obj instanceof HTMLElement;
  }
  
  // 色が緑系かどうかをチェック
  function isGreenColor(color) {
    // RGBやrgba形式の色から値を抽出
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      
      // 緑が最も強く、赤と青が低い場合は緑色と判断
      return g > 100 && g > r * 1.5 && g > b * 1.5;
    }
    
    // カラーコードの場合
    const hexMatch = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (hexMatch) {
      const r = parseInt(hexMatch[1], 16);
      const g = parseInt(hexMatch[2], 16);
      const b = parseInt(hexMatch[3], 16);
      
      // 緑が最も強く、赤と青が低い場合は緑色と判断
      return g > 100 && g > r * 1.5 && g > b * 1.5;
    }
    
    // 色名
    return color.includes('green') || color.includes('success');
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