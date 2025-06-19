/**
 * 電話番号認証セクションを直接操作してポジショニングするスクリプト
 * セクション間の配置を確実に調整する
 */
(function() {
  console.log('直接電話認証位置調整: 実行開始');
  
  // DOMが完全に読み込まれた後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // モーダル表示時に実行
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal.id === 'registerTouristModal' || modal.id === 'registerGuideModal') {
      console.log('直接電話認証位置調整: モーダル表示を検出');
      setTimeout(function() {
        adjustPhonePosition(modal);
      }, 200);
    }
  });
  
  // 初期化
  function init() {
    // 現在開いているモーダルがあれば調整
    adjustAllModals();
    
    // DOM変更を監視
    observeDOM();
  }
  
  // DOM監視設定
  function observeDOM() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 新しいノードが追加されたら、モーダルを探して調整
          const touristModal = document.getElementById('registerTouristModal');
          const guideModal = document.getElementById('registerGuideModal');
          
          if (touristModal && isModalVisible(touristModal)) {
            adjustPhonePosition(touristModal);
          }
          
          if (guideModal && isModalVisible(guideModal)) {
            adjustPhonePosition(guideModal);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 全モーダルの調整
  function adjustAllModals() {
    const touristModal = document.getElementById('registerTouristModal');
    const guideModal = document.getElementById('registerGuideModal');
    
    if (touristModal && isModalVisible(touristModal)) {
      adjustPhonePosition(touristModal);
    }
    
    if (guideModal && isModalVisible(guideModal)) {
      adjustPhonePosition(guideModal);
    }
  }
  
  // 電話認証セクションの位置調整
  function adjustPhonePosition(modal) {
    console.log('直接電話認証位置調整: ' + modal.id + ' の調整を開始');
    
    // モーダルのセクションを全て特定
    const allSections = Array.from(modal.querySelectorAll('.modal-body > .border-bottom'));
    if (allSections.length < 3) {
      console.log('直接電話認証位置調整: セクション数が不足しています', allSections.length);
      return;
    }
    
    // セクションを特定
    let basicSection = null;
    let phoneSection = null;
    let idSection = null;
    
    for (const section of allSections) {
      const sectionText = section.textContent.toLowerCase();
      
      if (sectionText.includes('基本情報')) {
        basicSection = section;
      } else if (sectionText.includes('電話番号')) {
        phoneSection = section;
      } else if (sectionText.includes('身分証明書') || sectionText.includes('証明書') || sectionText.includes('確認')) {
        idSection = section;
      }
    }
    
    // ログ
    console.log('直接電話認証位置調整: 基本情報セクション:', basicSection ? '発見' : '未発見');
    console.log('直接電話認証位置調整: 電話番号セクション:', phoneSection ? '発見' : '未発見');
    console.log('直接電話認証位置調整: 身分証明書セクション:', idSection ? '発見' : '未発見');
    
    // すべてのセクションが見つかった場合、順序を調整
    if (basicSection && phoneSection && idSection) {
      console.log('直接電話認証位置調整: すべてのセクションを発見、配置調整を開始');
      
      const container = modal.querySelector('.modal-body');
      if (!container) {
        console.log('直接電話認証位置調整: モーダルボディが見つかりません');
        return;
      }
      
      // セクションの順序を調整
      reorderSections(container, [basicSection, phoneSection, idSection]);
      
      console.log('直接電話認証位置調整: セクション配置の調整が完了しました');
    } else {
      console.log('直接電話認証位置調整: 一部セクションが見つからないため、配置調整をスキップします');
    }
  }
  
  // セクションの順序を再配置する
  function reorderSections(container, sections) {
    // 各セクションが現在のDOMツリーに存在するかをまず確認
    const existingSections = sections.filter(section => container.contains(section));
    
    // 存在しないセクションがある場合
    if (existingSections.length !== sections.length) {
      console.log('直接電話認証位置調整: 一部セクションがDOMに存在しません');
      return;
    }
    
    // 一度すべて取り外す
    existingSections.forEach(section => {
      container.removeChild(section);
    });
    
    // 指定された順序で追加し直す
    existingSections.forEach(section => {
      container.appendChild(section);
    });
  }
  
  // モーダルが表示されているかを確認
  function isModalVisible(modal) {
    return modal && window.getComputedStyle(modal).display !== 'none';
  }
})();