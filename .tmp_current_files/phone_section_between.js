/**
 * 電話番号認証セクションを基本情報と身分証明書の間に配置するスクリプト
 * 既存のモーダル構造を保持しつつ、適切な位置に電話認証セクションを挿入
 */
(function() {
  console.log('電話番号セクション位置調整: 実行開始');
  
  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPositioning);
  } else {
    initPositioning();
  }
  
  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'registerTouristModal' || event.target.id === 'registerGuideModal') {
      console.log('電話番号セクション位置調整: モーダル表示イベント');
      setTimeout(initPositioning, 100);
    }
  });
  
  // DOM変更監視
  const observer = new MutationObserver(function(mutations) {
    // セクションがすでに移動済みかどうかを追跡するフラグ
    let phoneMovedFlag = false;
    
    mutations.forEach(function(mutation) {
      // モーダルが開いたときのみ処理
      const touristModal = document.getElementById('registerTouristModal');
      const guideModal = document.getElementById('registerGuideModal');
      const activeModal = touristModal && window.getComputedStyle(touristModal).display !== 'none' ? touristModal :
                          guideModal && window.getComputedStyle(guideModal).display !== 'none' ? guideModal : null;
      
      if (activeModal && !phoneMovedFlag) {
        rearrangeSections(activeModal);
        // 一度移動したらフラグを立てる
        phoneMovedFlag = true;
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 初期化
  function initPositioning() {
    console.log('電話番号セクション位置調整: 初期化');
    
    // 各モーダルでのセクション配置を調整
    const touristModal = document.getElementById('registerTouristModal');
    const guideModal = document.getElementById('registerGuideModal');
    
    if (touristModal) {
      rearrangeSections(touristModal);
    }
    
    if (guideModal) {
      rearrangeSections(guideModal);
    }
  }
  
  // セクション配置調整
  function rearrangeSections(modal) {
    console.log('電話番号セクション位置調整: セクション調整開始');
    
    // 各セクションを特定
    const sections = modal.querySelectorAll('.modal-body > .border-bottom');
    if (sections.length < 3) {
      console.log('電話番号セクション位置調整: セクションが不足しています', sections.length);
      return;
    }
    
    // セクションのテキストコンテンツから種別を特定
    let basicSection = null;
    let phoneSection = null;
    let idSection = null;
    
    sections.forEach(section => {
      const sectionText = section.textContent.toLowerCase();
      if (sectionText.includes('基本情報')) {
        basicSection = section;
      } else if (sectionText.includes('電話番号')) {
        phoneSection = section;
      } else if (sectionText.includes('身分証明書') || sectionText.includes('id確認')) {
        idSection = section;
      }
    });
    
    // セクションが見つからない場合のログ
    if (!basicSection) console.log('電話番号セクション位置調整: 基本情報セクションが見つかりません');
    if (!phoneSection) console.log('電話番号セクション位置調整: 電話番号セクションが見つかりません');
    if (!idSection) console.log('電話番号セクション位置調整: 身分証明書セクションが見つかりません');
    
    // すべてのセクションが見つかった場合に並び替え
    if (basicSection && phoneSection && idSection) {
      console.log('電話番号セクション位置調整: すべてのセクションを発見、並び替えを実行');
      
      // 親コンテナ
      const container = modal.querySelector('.modal-body');
      
      // 一旦すべて取り除く
      if (container.contains(basicSection)) {
        container.removeChild(basicSection);
      }
      
      if (container.contains(phoneSection)) {
        container.removeChild(phoneSection);
      }
      
      if (container.contains(idSection)) {
        container.removeChild(idSection);
      }
      
      // 順番に追加
      container.appendChild(basicSection);
      container.appendChild(phoneSection);
      container.appendChild(idSection);
      
      console.log('電話番号セクション位置調整: 並び替え完了');
    } else {
      console.log('電話番号セクション位置調整: 一部セクションが見つからないため並び替えを中止');
    }
  }
})();