/**
 * ユーザータイプ選択と登録モーダルを統合するスクリプト
 * 既存のモーダル関連スクリプトを補完する最終的な修正
 */
(function() {
  console.log('ユーザータイプハンドラー初期化開始');
  
  // DOM要素確認用ヘルパー関数
  function checkElement(id) {
    const element = document.getElementById(id);
    console.log(`DOM要素確認: ${id} = ${element ? '存在します' : '見つかりません'}`);
    return element;
  }
  
  // 起動時に重要なDOM要素の存在確認
  function checkInitialElements() {
    console.log('--- 重要DOM要素確認 ---');
    const userTypeModal = checkElement('userTypeModal');
    checkElement('registerGuideModal');
    checkElement('registerTouristModal');
    
    // モーダル内の要素を直接探す
    if (userTypeModal) {
      console.log('ユーザータイプモーダル内要素を確認:');
      const touristBtn = userTypeModal.querySelector('#select-tourist-btn');
      const guideBtn = userTypeModal.querySelector('#select-guide-btn');
      console.log('モーダル内 tourist-btn:', !!touristBtn);
      console.log('モーダル内 guide-btn:', !!guideBtn);
      
      // モーダル内のすべてのボタンを列挙
      console.log('モーダル内のすべてのボタン:');
      userTypeModal.querySelectorAll('button').forEach((btn, i) => {
        console.log(`ボタン ${i}:`, btn.id, btn.textContent.trim());
      });
    }
    
    checkElement('select-tourist-btn');
    checkElement('select-guide-btn');
    checkElement('show-user-type-modal');
    console.log('------------------------');
  }
  
  // メイン初期化関数
  function initUserTypeHandler() {
    console.log('最終統合スクリプトを実行');
    checkInitialElements();
    
    // 新規登録ボタンを処理
    setupNewRegisterButton();
    
    // ユーザータイプモーダルのボタン設定
    setupUserTypeModalButtons();
    
    // すべてのモーダルIDを確認
    console.log('利用可能なすべてのモーダル:');
    document.querySelectorAll('.modal').forEach(modal => {
      console.log(' - モーダルID:', modal.id);
    });
  }
  
  // HTMLが完全に読み込まれたときに実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserTypeHandler);
  } else {
    // DOMがすでに読み込まれている場合は直接実行
    initUserTypeHandler();
  }
  
  /**
   * 新規登録ボタンの設定
   */
  function setupNewRegisterButton() {
    // 新規登録ボタンの取得
    const registerButton = document.getElementById('show-user-type-modal');
    if (registerButton) {
      console.log('統合: 新規登録ボタンを発見');
      
      // クリックイベントリスナー設定
      registerButton.addEventListener('click', function(e) {
        e.preventDefault();
        showUserTypeModal();
      });
    }
  }
  
  /**
   * ユーザータイプモーダルのボタン設定
   */
  function setupUserTypeModalButtons() {
    console.log('モーダルボタン設定を開始');
    
    // モーダル要素を取得
    const userTypeModal = document.getElementById('userTypeModal');
    if (!userTypeModal) {
      console.error('userTypeModalが見つかりません');
      return;
    }
    
    // ここでモーダル内のボタンを直接検索
    const selectTouristBtn = userTypeModal.querySelector('#select-tourist-btn');
    const selectGuideBtn = userTypeModal.querySelector('#select-guide-btn');
    
    console.log('モーダル内でボタンを検索:', {
      touristBtn: !!selectTouristBtn,
      guideBtn: !!selectGuideBtn
    });
    
    // userTypeModal内のすべてのボタンを検索して表示
    const allButtons = userTypeModal.querySelectorAll('button');
    console.log(`モーダル内に${allButtons.length}個のボタンが見つかりました`);
    allButtons.forEach((btn, idx) => {
      console.log(`Button ${idx}: id=${btn.id}, class=${btn.className}, text=${btn.textContent.trim()}`);
    });
    
    // 観光客選択ボタン（ID属性で見つからない場合はテキストで探す）
    let touristButton = selectTouristBtn;
    if (!touristButton) {
      touristButton = Array.from(allButtons).find(btn => 
        btn.textContent.trim().includes('観光客として登録') || 
        btn.textContent.trim().includes('Tourist')
      );
      console.log('テキストで観光客ボタンを探索:', !!touristButton);
    }
    
    if (touristButton) {
      console.log('観光客選択ボタンを検出しました');
      touristButton.addEventListener('click', function() {
        console.log('観光客選択ボタンがクリックされました');
        const bsUserTypeModal = bootstrap.Modal.getInstance(userTypeModal);
        if (bsUserTypeModal) {
          bsUserTypeModal.hide();
          
          // 少し遅延して観光客登録モーダルを表示
          setTimeout(function() {
            const registerTouristModal = document.getElementById('registerTouristModal');
            console.log('観光客登録モーダルを探索:', !!registerTouristModal);
            if (registerTouristModal) {
              try {
                const bsRegisterTouristModal = new bootstrap.Modal(registerTouristModal);
                bsRegisterTouristModal.show();
                console.log('観光客登録モーダルを表示しました');
              } catch (err) {
                console.error('観光客登録モーダル表示エラー:', err);
              }
            } else {
              console.error('観光客登録モーダルが見つかりません');
              // すべてのモーダルIDをログに記録
              document.querySelectorAll('.modal').forEach(modal => {
                console.log('利用可能なモーダル:', modal.id);
              });
            }
          }, 500);
        }
      });
    } else {
      console.error('観光客選択ボタンが見つかりません');
    }
    
    // ガイド選択ボタン（ID属性で見つからない場合はテキストで探す）
    let guideButton = selectGuideBtn;
    if (!guideButton) {
      guideButton = Array.from(allButtons).find(btn => 
        btn.textContent.trim().includes('ガイドとして登録') || 
        btn.textContent.trim().includes('Guide')
      );
      console.log('テキストでガイドボタンを探索:', !!guideButton);
    }
    
    if (guideButton) {
      console.log('ガイド選択ボタンを検出しました');
      guideButton.addEventListener('click', function() {
        console.log('ガイド選択ボタンがクリックされました');
        const bsUserTypeModal = bootstrap.Modal.getInstance(userTypeModal);
        if (bsUserTypeModal) {
          bsUserTypeModal.hide();
          
          // 少し遅延してガイド登録モーダルを表示
          setTimeout(function() {
            const registerGuideModal = document.getElementById('registerGuideModal');
            console.log('ガイド登録モーダルを探索:', !!registerGuideModal);
            if (registerGuideModal) {
              try {
                const bsRegisterGuideModal = new bootstrap.Modal(registerGuideModal);
                bsRegisterGuideModal.show();
                console.log('ガイド登録モーダルを表示しました');
              } catch (err) {
                console.error('ガイド登録モーダル表示エラー:', err);
              }
            } else {
              console.error('ガイド登録モーダルが見つかりません');
              // すべてのモーダルIDをログに記録
              document.querySelectorAll('.modal').forEach(modal => {
                console.log('利用可能なモーダル:', modal.id);
              });
            }
          }, 500);
        }
      });
    } else {
      console.error('ガイド選択ボタンが見つかりません');
    }
    
    // ログインリンク
    const showLoginLink = document.getElementById('show-login-from-type');
    if (showLoginLink) {
      showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        const userTypeModal = document.getElementById('userTypeModal');
        const bsUserTypeModal = bootstrap.Modal.getInstance(userTypeModal);
        if (bsUserTypeModal) {
          bsUserTypeModal.hide();
          
          // 少し遅延してログインモーダルを表示
          setTimeout(function() {
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
              const bsLoginModal = new bootstrap.Modal(loginModal);
              bsLoginModal.show();
            }
          }, 500);
        }
      });
    }
  }
  
  /**
   * ユーザータイプ選択モーダルを表示
   */
  function showUserTypeModal() {
    const userTypeModal = document.getElementById('userTypeModal');
    if (userTypeModal) {
      const bsUserTypeModal = new bootstrap.Modal(userTypeModal);
      bsUserTypeModal.show();
    } else {
      console.error('ユーザータイプモーダルが見つかりません');
    }
  }
  
  // ウィンドウロード時にも実行
  window.addEventListener('load', function() {
    // 新規登録ボタンを処理
    setupNewRegisterButton();
    
    // モーダルが隠れるときに背景とbody修正を実行
    document.querySelectorAll('.modal').forEach(function(modal) {
      modal.addEventListener('hidden.bs.modal', function() {
        // 残った背景を削除
        document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
          if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        });
        
        // bodyのスタイルをリセット
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      });
    });
  });
})();