/**
 * Shadow DOM分離技術による完全解決
 * Shadow DOMを利用して既存の認証表示と完全に分離した新しいUIを提供
 */
(function() {
  // 初期化
  function init() {
    console.log('Shadow DOM Isolator: 初期化');
    
    // モーダル表示イベント監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示を検知');
        setTimeout(isolateVerificationSection, 100);
      }
    });
    
    // 初期実行
    setTimeout(function() {
      const guideModal = document.getElementById('guideRegistrationModal');
      if (guideModal && isModalVisible(guideModal)) {
        isolateVerificationSection();
      }
    }, 500);
    
    // 定期的に確認
    setInterval(function() {
      const guideModal = document.getElementById('guideRegistrationModal');
      if (guideModal && isModalVisible(guideModal)) {
        isolateVerificationSection();
      }
    }, 1000);
  }
  
  // 電話認証セクションを分離
  function isolateVerificationSection() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal || !isModalVisible(guideModal)) return;
    
    // 電話番号認証セクションを探す
    const phoneSection = findPhoneVerificationSection(guideModal);
    if (!phoneSection) {
      console.log('電話番号認証セクションが見つかりません');
      return;
    }
    
    // 既に処理済みかどうかチェック
    if (phoneSection.hasAttribute('data-shadow-isolated')) {
      console.log('既に Shadow DOM で分離済み');
      return;
    }
    
    console.log('電話番号認証セクション発見:', phoneSection);
    
    // セクションに目印を付ける
    phoneSection.setAttribute('data-shadow-isolated', 'true');
    
    // ラベルテキストを取得
    const label = phoneSection.querySelector('label');
    const labelText = label ? label.textContent : '電話番号認証';
    
    // カスタム要素を作成
    const customElement = document.createElement('phone-verification-section');
    
    // 元のセクションのクラスを引き継ぐ
    customElement.className = phoneSection.className;
    customElement.style.cssText = phoneSection.style.cssText;
    
    // Shadow DOM を作成
    const shadow = customElement.attachShadow({ mode: 'closed' });
    
    // スタイルとコンテンツを設定
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1rem;
          font-family: inherit;
        }
        .verification-section {
          width: 100%;
        }
        .form-label {
          display: inline-block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .unverified-text {
          display: inline-block;
          margin-left: 0.5rem;
          color: #6c757d;
          cursor: pointer;
        }
        .unverified-text:hover {
          text-decoration: underline;
        }
      </style>
      <div class="verification-section">
        <label class="form-label">${labelText}</label>
        <span class="unverified-text">未表示</span>
      </div>
    `;
    
    // クリックイベントを追加
    const unverifiedText = shadow.querySelector('.unverified-text');
    unverifiedText.addEventListener('click', function() {
      const phoneModal = document.getElementById('phoneVerificationModal');
      if (phoneModal) {
        try {
          const modal = new bootstrap.Modal(phoneModal);
          modal.show();
        } catch (e) {
          console.error('モーダル表示エラー:', e);
          // フォールバック: 直接表示
          phoneModal.classList.add('show');
          phoneModal.style.display = 'block';
          document.body.classList.add('modal-open');
          
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      }
    });
    
    // 元のセクションを置き換え
    phoneSection.parentNode.replaceChild(customElement, phoneSection);
    console.log('Shadow DOM によるセクション分離完了');
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(container) {
    // ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        return label.closest('.form-group, .mb-3, .row, div[class*="form"], div[class*="group"]') || label.parentElement;
      }
    }
    
    // テキストで探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === 1) {
        return el.closest('.form-group, .mb-3, .row, div[class*="form"], div[class*="group"]') || el.parentElement;
      }
    }
    
    // 最後の手段: 特定のクラスを持つがラベルがない要素を探す
    const formGroups = container.querySelectorAll('.form-group, .mb-3, .row, div[class*="form"], div[class*="group"]');
    for (const group of formGroups) {
      // 隠しフィールドやエラーメッセージなどをスキップ
      if (group.offsetHeight > 20 && group.querySelectorAll('input').length === 0) {
        return group;
      }
    }
    
    return null;
  }
  
  // モーダルが表示されているかをチェック
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
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