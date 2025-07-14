/**
 * 認証バッジクリーン置換スクリプト
 * 緑色の認証済みボタンを空白テキストに置き換える
 */
(function() {
  // ボタン要素が存在してから実行する
  document.addEventListener('DOMContentLoaded', function() {
    // 初期実行
    replaceBadges();
    
    // 読み込み完了時にも実行
    window.addEventListener('load', function() {
      replaceBadges();
      // 少し遅延させて再実行
      setTimeout(replaceBadges, 500);
      setTimeout(replaceBadges, 1000);
    });
    
    // モーダル表示時にも実行
    document.addEventListener('shown.bs.modal', function(event) {
      replaceBadges();
      setTimeout(replaceBadges, 200);
    });
    
    // DOM変更を監視
    const observer = new MutationObserver(function(mutations) {
      replaceBadges();
    });
    
    // document.body全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  });
  
  // バッジを置換する関数
  function replaceBadges() {
    console.log('認証バッジ置換: 実行');
    
    // 「認証済み」テキストを含むボタンを探す
    document.querySelectorAll('button, .btn, .badge, .alert-success, [id*="verified"]').forEach(function(element) {
      // テキストコンテンツを確認
      const text = element.textContent || '';
      if (text.includes('認証済み') || text.includes('済み') || text.includes('確認')) {
        console.log('認証バッジ発見:', element.tagName, element.className || element.id);
        
        // 電話認証に関連するボタンか確認
        if (element.closest('[id*="phone"]') || 
            element.id && element.id.includes('phone') || 
            element.className && element.className.includes('phone')) {
          
          // クラスとスタイル属性を変更して非表示
          element.classList.add('d-none');
          element.style.setProperty('display', 'none', 'important');
          element.style.setProperty('visibility', 'hidden', 'important');
          
          // 内容を空にする
          element.textContent = '';
          element.innerHTML = '';
          
          console.log('電話認証バッジを置換しました');
        }
      }
    });
    
    // 電話認証セクション全体からガイド用認証バッジを探す
    document.querySelectorAll('#guideRegistrationModal .btn-success, #guideRegistrationModal .badge.bg-success, #guideRegistrationModal .alert-success, #guide-phone-verified').forEach(function(element) {
      // 既にクラスが付与されていなければ処理
      if (!element.classList.contains('d-none')) {
        element.classList.add('d-none');
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.textContent = '';
        element.innerHTML = '';
        console.log('ガイド登録モーダル内の認証バッジを非表示化:', element.className || element.id);
      }
    });
    
    // 特定のID要素を直接ターゲット
    const guideVerified = document.getElementById('guide-phone-verified');
    if (guideVerified) {
      guideVerified.classList.add('d-none');
      guideVerified.style.setProperty('display', 'none', 'important');
      guideVerified.style.setProperty('visibility', 'hidden', 'important');
      guideVerified.textContent = '';
      guideVerified.innerHTML = '';
      console.log('guide-phone-verified 要素を非表示化');
    }
    
    // 電話番号認証ラベルをターゲット
    document.querySelectorAll('label').forEach(function(label) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // ラベルが存在する場合、その親要素内の緑色ボタンを探す
        const parent = label.closest('.row, .form-group, div');
        if (parent) {
          parent.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"]').forEach(function(element) {
            element.classList.add('d-none');
            element.style.setProperty('display', 'none', 'important');
            element.style.setProperty('visibility', 'hidden', 'important');
            element.textContent = '';
            element.innerHTML = '';
            console.log('電話認証ラベル付近の認証バッジを非表示化:', element.className || element.id);
          });
        }
      }
    });
    
    // 計算スタイルで緑色を探す
    document.querySelectorAll('button, .badge, .alert').forEach(function(element) {
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      if (backgroundColor.includes('rgb')) {
        const rgb = backgroundColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0]);
          const g = parseInt(rgb[1]);
          const b = parseInt(rgb[2]);
          
          // 緑が強いカラー (緑成分が他より1.5倍以上高い)
          if (g > r * 1.5 && g > b * 1.5) {
            if (element.closest('[id*="phone"]') || 
                element.closest('#guideRegistrationModal') ||
                (element.textContent && element.textContent.includes('認証'))) {
              element.classList.add('d-none');
              element.style.setProperty('display', 'none', 'important');
              element.style.setProperty('visibility', 'hidden', 'important');
              element.textContent = '';
              element.innerHTML = '';
              console.log('緑色要素を検出して非表示化:', element.tagName, element.className || element.id);
            }
          }
        }
      }
    });
  }
})();