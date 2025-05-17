/**
 * 観光客・ガイド登録ボタン検出の問題を修正するスクリプト
 */
(function() {
  console.log('ボタン検出修正スクリプトを初期化');
  
  // モーダル内のHTML要素一覧をログに記録（デバッグ用）
  function logModalElements(modal) {
    if (!modal) return;
    
    console.log(`モーダル[${modal.id}]の内部構造:`);
    const elements = modal.querySelectorAll('*');
    let count = 0;
    elements.forEach(el => {
      // 表示に役立つ重要な要素のみログに記録
      if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.id || 
          el.tagName === 'DIV' && el.classList.length > 0) {
        console.log(`[${count}] ${el.tagName}#${el.id || 'no-id'}.${Array.from(el.classList).join('.')} - ${el.textContent.trim().substring(0, 30)}`);
        count++;
      }
    });
    
    console.log(`モーダル内の全ボタン:`);
    const buttons = modal.querySelectorAll('button, .btn, [class*="btn-"]');
    buttons.forEach((btn, idx) => {
      console.log(`ボタン[${idx}]: #${btn.id || 'no-id'} ${Array.from(btn.classList).join('.')} - 「${btn.textContent.trim()}」`);
    });
  }
  
  // すべてのモーダル内のボタンをスキャンし、観光客とガイド登録ボタンを検出する
  function findAndFixRegistrationButtons() {
    console.log('登録ボタン自動検出を開始');
    
    // モーダル内に適切なボタンが見つからない問題を修正する
    const userTypeModal = document.getElementById('userTypeModal');
    if (!userTypeModal) {
      console.error('ユーザータイプモーダルが見つかりません');
      console.log('利用可能なモーダル:');
      document.querySelectorAll('.modal').forEach(m => console.log(` - ${m.id}`));
      
      // 代替策: テキストコンテンツで探す
      const possibleModals = Array.from(document.querySelectorAll('.modal')).filter(m => 
        m.textContent.includes('観光客として登録') || m.textContent.includes('ガイドとして登録')
      );
      
      if (possibleModals.length > 0) {
        console.log('代替モーダルを検出:', possibleModals[0].id);
        logModalElements(possibleModals[0]);
        return;
      }
      
      return;
    }
    
    // モーダル内部構造の確認
    logModalElements(userTypeModal);
    
    // モーダル内のコンテナ要素を見つける
    const modalBody = userTypeModal.querySelector('.modal-body') || userTypeModal;
    const modalFooter = userTypeModal.querySelector('.modal-footer');
    
    // モーダル内の既存ボタンを探す (複数の方法で探索)
    const touristBtnSelectors = [
      '#select-tourist-btn', 
      '.tourist-btn', 
      'button[data-user-type="tourist"]',
      '[data-i18n="auth.select_tourist"]',
      'button:contains("観光客として登録")',
      'button:contains("Tourist")'
    ];
    
    const guideBtnSelectors = [
      '#select-guide-btn', 
      '.guide-btn', 
      'button[data-user-type="guide"]',
      '[data-i18n="auth.select_guide"]',
      'button:contains("ガイドとして登録")',
      'button:contains("Guide")'
    ];
    
    // jQuery風のcontainsセレクタの実装
    const getButtonByText = (container, text) => {
      return Array.from(container.querySelectorAll('button, .btn')).find(el => 
        el.textContent.trim().includes(text)
      );
    };
    
    // 複数の方法でボタンを探す
    let touristButton = userTypeModal.querySelector(touristBtnSelectors[0]) || 
                       userTypeModal.querySelector(touristBtnSelectors[1]) || 
                       userTypeModal.querySelector(touristBtnSelectors[2]) ||
                       userTypeModal.querySelector(touristBtnSelectors[3]) ||
                       getButtonByText(userTypeModal, '観光客として登録') ||
                       getButtonByText(userTypeModal, 'Tourist');
    
    let guideButton = userTypeModal.querySelector(guideBtnSelectors[0]) || 
                     userTypeModal.querySelector(guideBtnSelectors[1]) || 
                     userTypeModal.querySelector(guideBtnSelectors[2]) ||
                     userTypeModal.querySelector(guideBtnSelectors[3]) ||
                     getButtonByText(userTypeModal, 'ガイドとして登録') ||
                     getButtonByText(userTypeModal, 'Guide');
    
    // 探索結果をログに出力
    console.log('ボタン探索結果:', {
      '観光客ボタン': touristButton ? '見つかりました' : '見つかりません',
      'ガイドボタン': guideButton ? '見つかりました' : '見つかりません'
    });
    
    // モーダル内の全ボタンを調査
    const allModalButtons = userTypeModal.querySelectorAll('button, .btn');
    console.log(`モーダル内に${allModalButtons.length}個のボタンが存在`);
    
    // テキストからボタンを探す最終手段
    if (!touristButton) {
      allModalButtons.forEach((btn, idx) => {
        const text = btn.textContent.trim().toLowerCase();
        if ((text.includes('観光客') || text.includes('tourist')) && 
            (text.includes('登録') || text.includes('register'))) {
          console.log(`インデックス${idx}のボタンを観光客ボタンとして採用:`, text);
          touristButton = btn;
        }
      });
    }
    
    if (!guideButton) {
      allModalButtons.forEach((btn, idx) => {
        const text = btn.textContent.trim().toLowerCase();
        if ((text.includes('ガイド') || text.includes('guide')) && 
            (text.includes('登録') || text.includes('register'))) {
          console.log(`インデックス${idx}のボタンをガイドボタンとして採用:`, text);
          guideButton = btn;
        }
      });
    }
    
    // ボタンが見つからない場合は、新たに作成して追加
    if (!touristButton) {
      console.warn('観光客として登録ボタンが見つかりません。新しいボタンを作成します。');
      
      // 新しいボタンを作成
      const newTouristButton = document.createElement('button');
      newTouristButton.id = 'select-tourist-btn';
      newTouristButton.className = 'btn btn-primary btn-lg mt-3 w-100 tourist-btn';
      newTouristButton.setAttribute('data-user-type', 'tourist');
      newTouristButton.setAttribute('data-i18n', 'auth.select_tourist');
      newTouristButton.innerHTML = '<i class="bi bi-person-fill me-2"></i>観光客として登録';
      
      // ボタンの親コンテナを見つける
      let buttonContainer;
      if (modalFooter) {
        buttonContainer = modalFooter;
      } else if (modalBody) {
        // 新しいボタンコンテナをモーダルボディ内に作成
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container mt-4 d-grid gap-2';
        modalBody.appendChild(buttonContainer);
      } else {
        buttonContainer = userTypeModal;
      }
      
      // 新しいボタンを追加
      buttonContainer.appendChild(newTouristButton);
      touristButton = newTouristButton;
      console.log('新しい観光客ボタンを追加しました');
    }
    
    if (!guideButton) {
      console.warn('ガイドとして登録ボタンが見つかりません。新しいボタンを作成します。');
      
      // 新しいボタンを作成
      const newGuideButton = document.createElement('button');
      newGuideButton.id = 'select-guide-btn';
      newGuideButton.className = 'btn btn-success btn-lg mt-3 w-100 guide-btn';
      newGuideButton.setAttribute('data-user-type', 'guide');
      newGuideButton.setAttribute('data-i18n', 'auth.select_guide');
      newGuideButton.innerHTML = '<i class="bi bi-compass-fill me-2"></i>ガイドとして登録';
      
      // ボタンの親コンテナを見つける
      let buttonContainer;
      if (modalFooter) {
        buttonContainer = modalFooter;
      } else if (modalBody) {
        // 既存のボタンコンテナを探す
        buttonContainer = modalBody.querySelector('.button-container');
        if (!buttonContainer) {
          // なければ新しく作成
          buttonContainer = document.createElement('div');
          buttonContainer.className = 'button-container mt-4 d-grid gap-2';
          modalBody.appendChild(buttonContainer);
        }
      } else {
        buttonContainer = userTypeModal;
      }
      
      // 新しいボタンを追加
      buttonContainer.appendChild(newGuideButton);
      guideButton = newGuideButton;
      console.log('新しいガイドボタンを追加しました');
    }
    
    // ボタンが正しく検出されたか再確認
    if (touristButton && guideButton) {
      console.log('両方のボタンが正しく設定されました');
      
      // IDを強制設定
      if (!touristButton.id) {
        touristButton.id = 'select-tourist-btn';
        console.log('観光客ボタンにIDを設定しました');
      }
      
      if (!guideButton.id) {
        guideButton.id = 'select-guide-btn';
        console.log('ガイドボタンにIDを設定しました');
      }
      
      // イベントリスナーを設定
      setupUserTypeButtonListeners(touristButton, guideButton);
    }
    
    console.log('登録ボタン検出が完了しました');
    return {
      touristButton,
      guideButton
    };
  }
  
  // ユーザータイプボタンにイベントリスナーを設定
  function setupUserTypeButtonListeners(touristButton, guideButton) {
    console.log('ユーザータイプボタンのイベントリスナーを設定');
    
    // 観光客ボタンのイベントリスナー
    touristButton.addEventListener('click', function() {
      console.log('観光客ボタンがクリックされました');
      
      // 現在のモーダルを閉じる
      const userTypeModal = document.getElementById('userTypeModal');
      if (userTypeModal) {
        const bsUserTypeModal = bootstrap.Modal.getInstance(userTypeModal);
        if (bsUserTypeModal) {
          bsUserTypeModal.hide();
        }
      }
      
      // 観光客登録モーダルを開く
      setTimeout(function() {
        const registerTouristModal = document.getElementById('registerTouristModal');
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
        }
      }, 500);
    });
    
    // ガイドボタンのイベントリスナー
    guideButton.addEventListener('click', function() {
      console.log('ガイドボタンがクリックされました');
      
      // 現在のモーダルを閉じる
      const userTypeModal = document.getElementById('userTypeModal');
      if (userTypeModal) {
        const bsUserTypeModal = bootstrap.Modal.getInstance(userTypeModal);
        if (bsUserTypeModal) {
          bsUserTypeModal.hide();
        }
      }
      
      // ガイド登録モーダルを開く
      setTimeout(function() {
        const registerGuideModal = document.getElementById('registerGuideModal');
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
        }
      }, 500);
    });
  }
  
  // Bootstrapのモーダルイベントを安全に使用するためのヘルパー
  function setupModalEventHandlers() {
    // モーダル表示完了時
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'userTypeModal') {
        console.log('ユーザータイプモーダルが表示されました - ボタンを確認します');
        findAndFixRegistrationButtons();
      }
    });
    
    // モーダル要素にミュテーション監視を設定
    try {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // クラスが変更されたとき
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const modal = mutation.target;
            if (modal.classList.contains('show') && modal.id === 'userTypeModal') {
              console.log('Mutation: ユーザータイプモーダルが表示されました');
              findAndFixRegistrationButtons();
            }
          }
        });
      });
      
      // すべてのモーダルを監視
      document.querySelectorAll('.modal').forEach(function(modal) {
        observer.observe(modal, { attributes: true });
      });
      
      console.log('モーダル監視設定が完了しました');
    } catch (err) {
      console.warn('MutationObserver設定エラー:', err);
    }
  }
  
  // 初期化処理
  function init() {
    console.log('ボタン検出修正の初期化');
    setupModalEventHandlers();
    
    // 最初の実行
    setTimeout(findAndFixRegistrationButtons, 1000);
  }
  
  // ページ読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 遅延実行でも実行（念のため）
  setTimeout(findAndFixRegistrationButtons, 2000);
  setTimeout(findAndFixRegistrationButtons, 5000);
  
  // グローバル関数として公開
  window.findAndFixRegistrationButtons = findAndFixRegistrationButtons;
})();