/**
 * 電話認証バッジ最終対策スクリプト
 * 特定の要素にインラインスタイルを直接挿入し、要素を消す
 * 
 * ガイド登録モーダルの認証済みバッジのみに対応
 */
(function() {
  // DOMが読み込まれたらすぐに実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }
  
  // ロード時と少し遅延させて実行
  window.addEventListener('load', function() {
    injectStyles();
    setTimeout(injectStyles, 500);
    setTimeout(injectStyles, 1000);
  });
  
  // モーダルが表示されたら実行
  document.addEventListener('shown.bs.modal', function() {
    injectStyles();
    setTimeout(injectStyles, 100);
  });
  
  // スタイルを直接注入
  function injectStyles() {
    console.log('インラインスタイル注入: 実行開始');
    
    // スタイルタグを作成
    let style = document.createElement('style');
    style.id = 'emergency-auth-badge-eraser';
    style.textContent = `
      /* 認証バッジ消去用スタイル */
      .btn-success.authentication-badge,
      .badge.bg-success,
      button.btn-success,
      .alert-success:not(#verification-success),
      #guide-phone-verified {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        overflow: hidden !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        position: absolute !important;
        pointer-events: none !important;
        clip: rect(0,0,0,0) !important;
      }
      
      /* 特に認証済みボタンに合わせたセレクタ */
      button.btn.btn-success.authentication-badge,
      button.btn.auth-badge,
      #guideRegistrationModal .btn-success {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* スクリーンショットで見えているバッジ */
      button[class*="btn"][class*="success"],
      [id*="verified"], 
      [class*="auth"][class*="badge"],
      .authentication-badge {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* 電話認証セクション内の緑色要素 */
      [id*="phone"] .btn-success,
      [id*="phone"] .badge.bg-success,
      [id*="phone"] .alert-success,
      [class*="phone"] .btn-success,
      [class*="phone"] .badge.bg-success,
      [class*="phone"] .alert-success {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    
    // 既存のスタイルタグがあれば削除
    const existingStyle = document.getElementById('emergency-auth-badge-eraser');
    if (existingStyle) {
      existingStyle.parentNode.removeChild(existingStyle);
    }
    
    // 新しいスタイルタグを追加
    document.head.appendChild(style);
    
    // インラインスタイルも直接適用
    applyInlineStyles();
  }
  
  // インラインスタイルを直接適用
  function applyInlineStyles() {
    // 認証バッジを含むセレクタのリスト
    const selectors = [
      '.btn-success', '.badge.bg-success', '[id*="verified"]', '.authentication-badge',
      '.alert-success:not(#verification-success)', 'button.auth-badge', '.btn.btn-success'
    ];
    
    // セレクタを結合して一括検索
    const elements = document.querySelectorAll(selectors.join(','));
    
    // 見つかった要素に直接スタイルを適用
    elements.forEach(element => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('height', '0', 'important');
      element.style.setProperty('width', '0', 'important');
      element.style.setProperty('overflow', 'hidden', 'important');
      element.style.setProperty('padding', '0', 'important');
      element.style.setProperty('margin', '0', 'important');
      element.style.setProperty('border', 'none', 'important');
      element.style.setProperty('position', 'absolute', 'important');
      element.style.setProperty('pointer-events', 'none', 'important');
      element.style.setProperty('clip', 'rect(0,0,0,0)', 'important');
      
      // d-noneクラスも追加
      element.classList.add('d-none');
      
      // テキストも消去
      if (element.textContent.includes('認証済') || element.textContent.includes('済み')) {
        element.textContent = '';
        element.innerHTML = '';
      }
      
      console.log('インラインスタイル適用:', element.tagName, element.className || element.id);
    });
    
    // スクリーンショットに表示されている特定の緑色ボタンをターゲットにした特別対応
    // ガイド登録モーダル内
    const guideModal = document.getElementById('guideRegistrationModal');
    if (guideModal) {
      // 電話番号認証セクションを探す
      const labels = guideModal.querySelectorAll('label');
      labels.forEach(label => {
        if (label.textContent && label.textContent.includes('電話番号認証')) {
          console.log('電話番号認証ラベルを発見');
          
          // このラベルの親要素を取得
          const parentDiv = label.closest('.col-md-6') || label.parentElement;
          if (parentDiv) {
            // 親要素内のボタンや緑色要素を探す
            const buttons = parentDiv.querySelectorAll('button, .btn, .badge, .alert');
            buttons.forEach(btn => {
              if (btn.classList.contains('btn-success') || 
                  btn.classList.contains('bg-success') || 
                  btn.classList.contains('authentication-badge') ||
                  btn.classList.contains('alert-success')) {
                console.log('電話認証セクション内の緑色要素を直接スタイル適用:', btn.className);
                btn.style.setProperty('display', 'none', 'important');
                btn.style.setProperty('visibility', 'hidden', 'important');
                btn.classList.add('d-none');
                
                // テキストも消去
                btn.textContent = '';
                btn.innerHTML = '';
                
                // 可能であれば削除
                try {
                  if (btn.parentNode) {
                    btn.parentNode.removeChild(btn);
                  }
                } catch (e) {
                  console.log('要素の削除に失敗:', e);
                }
              }
            });
          }
        }
      });
    }
  }
})();