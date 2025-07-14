/**
 * 最終的なガイドボタン修正
 * このスクリプトは既存のものを全て上書きします
 * インラインJavaScriptで直接ボタンにイベントを割り当てるアプローチ
 */
(function() {
  // 非同期イベント処理関数
  function setupHeroButton() {
    console.log('【インライン修正】 ヒーローガイドボタン処理開始');
    
    // ヒーロー部分のガイドになるボタン
    var heroButton = document.getElementById('become-guide-btn');
    if (heroButton) {
      console.log('【インライン修正】 ヒーローボタン発見!');
      
      // hrefの削除 (リンク防止)
      if (heroButton.hasAttribute('href')) {
        heroButton.removeAttribute('href');
      }
      
      // 直接のonclick属性を付与 (最も優先度が高い)
      heroButton.setAttribute('onclick', 'event.preventDefault(); event.stopPropagation(); document.dispatchEvent(new CustomEvent("show-guide-modal")); return false;');
      
      // バックアップとしてイベントリスナーも設定
      heroButton.addEventListener('click', function(e) {
        console.log('【インライン修正】 ヒーローボタンがクリックされました!');
        e.preventDefault();
        e.stopPropagation();
        
        // モーダル表示イベントを発火
        document.dispatchEvent(new CustomEvent('show-guide-modal'));
        
        // A要素の場合はブラウザのデフォルト動作を完全に防止
        return false;
      }, true);
    } else {
      console.warn('【インライン修正】 ヒーローボタンが見つかりません!');
    }
    
    // 下部セクションのガイドになるボタン
    var sectionButton = document.getElementById('become-guide-btn-section');
    if (sectionButton) {
      console.log('【インライン修正】 セクションボタン発見!');
      
      // hrefの削除 (リンク防止)
      if (sectionButton.hasAttribute('href')) {
        sectionButton.removeAttribute('href');
      }
      
      // 直接のonclick属性を付与 (最も優先度が高い)
      sectionButton.setAttribute('onclick', 'event.preventDefault(); event.stopPropagation(); document.dispatchEvent(new CustomEvent("show-guide-modal")); return false;');
      
      // バックアップとしてイベントリスナーも設定
      sectionButton.addEventListener('click', function(e) {
        console.log('【インライン修正】 セクションボタンがクリックされました!');
        e.preventDefault();
        e.stopPropagation();
        
        // モーダル表示イベントを発火
        document.dispatchEvent(new CustomEvent('show-guide-modal'));
        
        // A要素の場合はブラウザのデフォルト動作を完全に防止
        return false;
      }, true);
    }
  }
  
  // モーダル表示処理をカスタムイベントで実装
  document.addEventListener('show-guide-modal', function() {
    console.log('【インライン修正】 ガイドモーダル表示イベント発火!');
    
    try {
      // 現在のモーダルをすべて閉じる
      var openModals = document.querySelectorAll('.modal.show');
      openModals.forEach(function(modal) {
        try {
          var modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        } catch(e) {
          console.warn('【インライン修正】 モーダル閉じる処理でエラー:', e);
        }
      });
      
      // 背景を削除 (念のため)
      document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });
      
      // 少し待ってからモーダルを表示
      setTimeout(function() {
        var targetModal = document.getElementById('userTypeModal');
        if (targetModal) {
          var modalObj = new bootstrap.Modal(targetModal);
          modalObj.show();
          console.log('【インライン修正】 ユーザータイプモーダルを表示しました');
        } else {
          console.error('【インライン修正】 ユーザータイプモーダルが存在しません');
        }
      }, 300);
    } catch(error) {
      console.error('【インライン修正】 モーダル表示中にエラー発生:', error);
    }
  });
  
  // ユーザータイプモーダル内のボタン（ガイド・観光客）設定
  function setupSelectGuideButton() {
    var selectGuideBtn = document.getElementById('select-guide-btn');
    if (selectGuideBtn) {
      console.log('【インライン修正】 選択ガイドボタン発見!');
      
      // hrefの削除 (リンク防止)
      if (selectGuideBtn.hasAttribute('href')) {
        selectGuideBtn.removeAttribute('href');
      }
      
      // 直接のonclick属性を付与 (最も優先度が高い)
      selectGuideBtn.setAttribute('onclick', 'event.preventDefault(); event.stopPropagation(); document.dispatchEvent(new CustomEvent("select-guide-type")); return false;');
      
      // バックアップとしてイベントリスナーも設定
      selectGuideBtn.addEventListener('click', function(e) {
        console.log('【インライン修正】 選択ガイドボタンがクリックされました!');
        e.preventDefault();
        e.stopPropagation();
        
        // ガイド選択イベントを発火
        document.dispatchEvent(new CustomEvent('select-guide-type'));
        
        return false;
      }, true);
    }
    
    // 観光客ボタンのイベントハンドラも設定
    var selectTouristBtn = document.getElementById('select-tourist-btn');
    if (selectTouristBtn) {
      console.log('【インライン修正】 選択観光客ボタン発見!');
      
      // イベントリスナーを設定
      selectTouristBtn.addEventListener('click', function(e) {
        console.log('【インライン修正】 選択観光客ボタンがクリックされました!');
        e.preventDefault();
        e.stopPropagation();
        
        // 観光客選択イベント処理
        try {
          // ユーザータイプモーダルを閉じる
          var userTypeModal = document.getElementById('userTypeModal');
          var userTypeInstance = bootstrap.Modal.getInstance(userTypeModal);
          if (userTypeInstance) {
            userTypeInstance.hide();
            console.log('【インライン修正】 ユーザータイプモーダルを閉じました');
          }
          
          // 背景を削除 (念のため)
          document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
            if (backdrop.parentNode) {
              backdrop.parentNode.removeChild(backdrop);
            }
          });
          
          // 少し待ってから観光客登録モーダルを表示
          setTimeout(function() {
            var touristRegisterModal = document.getElementById('registerTouristModal');
            if (touristRegisterModal) {
              var modalObj = new bootstrap.Modal(touristRegisterModal);
              modalObj.show();
              console.log('【インライン修正】 観光客登録モーダルを表示しました');
            } else {
              console.error('【インライン修正】 観光客登録モーダルが存在しません');
            }
          }, 500);
        } catch(error) {
          console.error('【インライン修正】 モーダル切替中にエラー発生:', error);
        }
        
        return false;
      }, true);
    }
  }
  
  // ガイド選択イベント処理
  document.addEventListener('select-guide-type', function() {
    console.log('【インライン修正】 ガイド選択イベント発火!');
    
    try {
      // ユーザータイプモーダルを閉じる
      var userTypeModal = document.getElementById('userTypeModal');
      var userTypeInstance = bootstrap.Modal.getInstance(userTypeModal);
      if (userTypeInstance) {
        userTypeInstance.hide();
        console.log('【インライン修正】 ユーザータイプモーダルを閉じました');
      }
      
      // 背景を削除 (念のため)
      document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });
      
      // 少し待ってからガイド登録モーダルを表示
      setTimeout(function() {
        // 両方のID形式を試みて問題を解決
        var guideRegisterModal = document.getElementById('guideRegisterModal') || document.getElementById('registerGuideModal');
        if (guideRegisterModal) {
          var modalObj = new bootstrap.Modal(guideRegisterModal);
          modalObj.show();
          console.log('【インライン修正】 ガイド登録モーダルを表示しました：', guideRegisterModal.id);
        } else {
          console.error('【インライン修正】 ガイド登録モーダルが存在しません。両方のID形式を確認しました。');
        }
      }, 500);
    } catch(error) {
      console.error('【インライン修正】 モーダル切替中にエラー発生:', error);
    }
  });
  
  // モーダル表示イベント検知
  document.addEventListener('shown.bs.modal', function(e) {
    if (e.target.id === 'userTypeModal') {
      console.log('【インライン修正】 ユーザータイプモーダルが表示されました - ガイドボタンを設定します');
      setupSelectGuideButton();
    }
  });
  
  // 新規登録ボタンのイベントハンドラを設定
  function setupRegisterButton() {
    var registerBtn = document.getElementById('show-user-type-modal');
    if (registerBtn) {
      console.log('【インライン修正】 新規登録ボタン発見!');
      
      // イベントリスナーを設定
      registerBtn.addEventListener('click', function(e) {
        console.log('【インライン修正】 新規登録ボタンがクリックされました!');
        e.preventDefault();
        
        // モーダル表示イベントを発火
        document.dispatchEvent(new CustomEvent('show-guide-modal'));
        return false;
      }, true);
    }
  }

  // 即時実行と遅延実行の両方を行う
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // 既にDOMが読み込み済みの場合はすぐに実行
    setupHeroButton();
    setupSelectGuideButton();
    setupRegisterButton();
  } else {
    // そうでなければDOMContentLoadedイベントを待つ
    document.addEventListener('DOMContentLoaded', function() {
      setupHeroButton();
      setupSelectGuideButton();
      setupRegisterButton();
    });
  }
  
  // ロード完了時にも実行 (最後の保険)
  window.addEventListener('load', function() {
    setupHeroButton();
    setupSelectGuideButton();
    setupRegisterButton();
    
    console.log('【インライン修正】 ロード完了時の最終確認');
  });
})();