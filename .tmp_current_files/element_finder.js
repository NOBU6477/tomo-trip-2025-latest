/**
 * DOM要素を精密に特定するためのスクリプト
 * スクリーンショットの要素を正確に見つけて処理するツール
 */
(function() {
  // グローバル変数
  let lastPhoneSection = null;
  let lastAuthButton = null;
  
  // 初期化
  function init() {
    console.log('精密要素特定: 初期化');
    
    // 初期処理
    analyzeDOM();
    
    // モーダル表示イベントの監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示: DOM解析を実行');
        
        // モーダル表示直後と遅延実行（レンダリングのタイミング差に対応）
        analyzeDOM();
        setTimeout(analyzeDOM, 100);
        setTimeout(analyzeDOM, 300);
        setTimeout(analyzeDOM, 500);
      }
    });
    
    // DOM変更の監視
    const observer = new MutationObserver(function(mutations) {
      let shouldAnalyze = false;
      
      for (const mutation of mutations) {
        // ガイド登録モーダル内の変更のみを対象
        const modal = document.getElementById('guideRegistrationModal');
        if (!modal || !isModalVisible(modal)) continue;
        
        // DOM要素の追加
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // 要素ノード
              // 電話番号認証、認証済み、緑色ボタン関連の要素
              if ((node.textContent && 
                   (node.textContent.includes('電話番号認証') || 
                    node.textContent.includes('認証済'))) ||
                  (node.classList && 
                   (node.classList.contains('btn-success') || 
                    node.classList.contains('bg-success')))) {
                shouldAnalyze = true;
                break;
              }
            }
          }
        }
        // 属性変更
        else if (mutation.type === 'attributes') {
          const target = mutation.target;
          // クラス変更
          if (mutation.attributeName === 'class' && 
              target.classList && 
              (target.classList.contains('btn-success') || 
               target.classList.contains('bg-success'))) {
            shouldAnalyze = true;
            break;
          }
          // スタイル変更
          else if (mutation.attributeName === 'style' && 
                   target.style.backgroundColor && 
                   (target.style.backgroundColor.includes('rgb(25, 135, 84)') || 
                    target.style.backgroundColor.includes('rgb(40, 167, 69)'))) {
            shouldAnalyze = true;
            break;
          }
          // 表示状態変更
          else if (mutation.attributeName === 'style' && 
                   (target.style.display !== undefined || 
                    target.style.visibility !== undefined)) {
            const parentSection = findPhoneVerificationSection();
            if (parentSection && parentSection.contains(target)) {
              shouldAnalyze = true;
              break;
            }
          }
        }
      }
      
      if (shouldAnalyze) {
        analyzeDOM();
      }
    });
    
    // 監視開始
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'display', 'visibility']
    });
    
    // 定期的に実行（最終手段として）
    setInterval(analyzeDOM, 2000);
  }
  
  // DOM解析実行
  function analyzeDOM() {
    // ガイド登録モーダルチェック
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal || !isModalVisible(modal)) return;
    
    console.log('ガイド登録モーダル発見: DOM解析を実行');
    
    // 電話番号認証セクションを特定
    const phoneSection = findPhoneVerificationSection();
    if (!phoneSection) {
      console.log('電話番号認証セクションが見つかりません');
      return;
    }
    
    // 前回と同じセクションなら一部処理をスキップ
    const isSameSection = (lastPhoneSection === phoneSection);
    lastPhoneSection = phoneSection;
    
    console.log('電話番号認証セクション発見:', phoneSection.tagName, phoneSection.className);
    
    // 認証済みボタンを特定
    const authButton = findAuthenticatedButton(phoneSection);
    
    // 前回と同じボタンでなければ処理
    if (authButton && (lastAuthButton !== authButton || !isSameSection)) {
      lastAuthButton = authButton;
      console.log('「認証済み」ボタン発見:', authButton.tagName, authButton.className);
      
      // 実際の要素情報をコンソールに詳細出力（デバッグ用）
      logElementDetails(authButton);
      
      // ボタンを置換
      replaceAuthButton(authButton);
    }
    else if (!authButton) {
      console.log('「認証済み」ボタンが見つかりません');
      
      // 前回特定したボタンが存在しなくなった場合
      if (lastAuthButton && !document.body.contains(lastAuthButton)) {
        lastAuthButton = null;
      }
    }
  }
  
  // 電話番号認証セクションを特定
  function findPhoneVerificationSection() {
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal) return null;
    
    // ラベルから探す（最も正確）
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // フォームグループを探す
        const formGroup = label.closest('.form-group, .row, .mb-3');
        if (formGroup) return formGroup;
        
        // 最も近い親DIVを段階的に探す
        let parent = label.parentElement;
        for (let i = 0; i < 5 && parent; i++) {
          if (parent.tagName === 'DIV') {
            return parent;
          }
          parent = parent.parentElement;
        }
        
        return label.parentElement;
      }
    }
    
    // テキストノードで探す
    return findElementContainingText(modal, '電話番号認証');
  }
  
  // 「認証済み」ボタンを特定
  function findAuthenticatedButton(section) {
    if (!section) return null;
    
    // 1. クラスとテキストで検索（最も確実な方法）
    const verifiedButtons = Array.from(section.querySelectorAll('.btn-success, .badge.bg-success'))
      .filter(el => el.textContent && el.textContent.trim() === '認証済み');
    
    if (verifiedButtons.length > 0) {
      return verifiedButtons[0];
    }
    
    // 2. テキスト内容だけで検索
    const textElements = Array.from(section.querySelectorAll('*'))
      .filter(el => el.textContent && el.textContent.trim() === '認証済み');
    
    if (textElements.length > 0) {
      return textElements[0];
    }
    
    // 3. 緑色ボタンのみで検索
    const greenButtons = section.querySelectorAll('.btn-success, .badge.bg-success, button[class*="success"]');
    
    if (greenButtons.length > 0) {
      return greenButtons[0];
    }
    
    // 4. 最終手段：スタイルで緑色の要素を検索
    const allElements = section.querySelectorAll('*');
    
    for (const el of allElements) {
      if (el.nodeType !== 1) continue; // 要素ノードのみ
      
      const style = window.getComputedStyle(el);
      if (style.backgroundColor === 'rgb(25, 135, 84)' || 
          style.backgroundColor === 'rgb(40, 167, 69)') {
        return el;
      }
    }
    
    return null;
  }
  
  // 「認証済み」ボタンを「未表示」に置換
  function replaceAuthButton(button) {
    if (!button || !button.parentElement) return;
    
    // 親要素取得
    const parent = button.parentElement;
    
    // ボタンの完全な非表示化（視覚的、構造的の両方）
    button.style.display = 'none';
    button.style.visibility = 'hidden';
    button.style.opacity = '0';
    button.style.position = 'absolute';
    button.style.width = '0';
    button.style.height = '0';
    button.style.overflow = 'hidden';
    button.style.clip = 'rect(0 0 0 0)';
    button.style.margin = '-1px';
    button.style.padding = '0';
    button.style.border = '0';
    button.classList.add('d-none');
    button.setAttribute('aria-hidden', 'true');
    button.setAttribute('tabindex', '-1');
    
    // 「未表示」テキストを作成または取得
    let unverifiedText = null;
    
    // すでに「未表示」テキストが存在するかチェック
    const children = parent.childNodes;
    for (const child of children) {
      if (child.nodeType === 1 && // 要素ノード
          child.textContent && 
          child.textContent.trim() === '未表示') {
        unverifiedText = child;
        break;
      }
    }
    
    // 未表示テキストがなければ新規作成
    if (!unverifiedText) {
      unverifiedText = document.createElement('span');
      unverifiedText.className = 'text-muted ms-2';
      unverifiedText.textContent = '未表示';
      unverifiedText.style.display = 'inline-block';
      
      // ボタンの後に挿入
      if (button.nextSibling) {
        parent.insertBefore(unverifiedText, button.nextSibling);
      } else {
        parent.appendChild(unverifiedText);
      }
      
      console.log('「未表示」テキストを追加しました');
    } else {
      // 既存の場合は表示設定
      unverifiedText.style.display = 'inline-block';
      unverifiedText.classList.remove('d-none');
      unverifiedText.style.visibility = 'visible';
      console.log('既存の「未表示」テキストを表示設定しました');
    }
    
    // ボタンをDOM上から削除（最も確実）
    try {
      parent.removeChild(button);
      console.log('「認証済み」ボタンをDOM上から完全に削除しました');
    } catch (e) {
      console.log('ボタン削除エラー:', e);
    }
  }
  
  // テキストを含む要素を探す
  function findElementContainingText(root, text) {
    if (!root) return null;
    
    // 自身のテキスト内容をチェック
    if (root.textContent && root.textContent.includes(text)) {
      // form-group などのコンテナを探す
      const container = root.closest('.form-group, .row, .mb-3');
      if (container) return container;
      
      return root;
    }
    
    // 子要素を再帰的に探索
    for (const child of root.children) {
      const result = findElementContainingText(child, text);
      if (result) return result;
    }
    
    return null;
  }
  
  // モーダルが表示されているかチェック
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
  
  // 要素の詳細情報をログ出力（デバッグ用）
  function logElementDetails(element) {
    if (!element) return;
    
    console.log('==== 要素詳細情報 ====');
    console.log('タグ名:', element.tagName);
    console.log('クラス名:', element.className);
    console.log('ID:', element.id);
    console.log('テキスト内容:', element.textContent?.trim());
    
    const style = window.getComputedStyle(element);
    console.log('背景色:', style.backgroundColor);
    console.log('文字色:', style.color);
    console.log('表示状態:', style.display);
    console.log('可視性:', style.visibility);
    console.log('位置情報:', element.getBoundingClientRect());
    console.log('=====================');
  }
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時に実行
  window.addEventListener('load', function() {
    init();
    setTimeout(analyzeDOM, 500);
  });
})();