/**
 * 緊急ページ修正スクリプト
 * デバッグ情報の完全除去とガイドカード強制表示
 */

(function() {
  'use strict';

  console.log('緊急ページ修正を開始');

  // 即座に実行
  executeEmergencyFix();

  // DOM読み込み後にも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeEmergencyFix);
  }

  // ページロード後にも実行
  window.addEventListener('load', executeEmergencyFix);

  // 定期実行で確実に修正
  const fixInterval = setInterval(executeEmergencyFix, 2000);

  // 10秒後に定期実行を停止
  setTimeout(() => {
    clearInterval(fixInterval);
    console.log('緊急修正完了');
  }, 10000);

  function executeEmergencyFix() {
    removeDebugInfo();
    forceShowGuideCards();
    resetFilters();
    fixNavigation();
  }

  /**
   * デバッグ情報を完全除去
   */
  function removeDebugInfo() {
    // 画面に表示されているデバッグテキストを除去
    const textNodes = document.evaluate(
      "//text()[contains(., 'text.replace') or contains(., 'function') or contains(., 'console.log')]",
      document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    for (let i = 0; i < textNodes.snapshotLength; i++) {
      const node = textNodes.snapshotItem(i);
      if (node.textContent.length > 100) {
        node.parentNode.removeChild(node);
      }
    }

    // デバッグ情報を含む要素を非表示
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const text = element.textContent;
      if (text && text.includes('text.replace') && text.length > 200) {
        element.style.display = 'none';
      }
    });

    // 特定の問題のある要素を除去
    const problemElements = document.querySelectorAll('script:not([src])');
    problemElements.forEach(script => {
      if (script.textContent.includes('text.replace')) {
        script.remove();
      }
    });
  }

  /**
   * ガイドカードを強制表示
   */
  function forceShowGuideCards() {
    // すべてのガイドカードコンテナを表示
    const containers = [
      '.col',
      '.col-md-4', 
      '.col-lg-4',
      '.guide-item',
      '.card-container'
    ];

    containers.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // ガイドカードを含む要素を判定
        const hasGuideContent = element.textContent.includes('ガイド') ||
                               element.textContent.includes('円/') ||
                               element.textContent.includes('詳細を見る') ||
                               element.querySelector('.card, .guide-card');

        if (hasGuideContent) {
          // 強制表示
          element.style.display = '';
          element.style.visibility = 'visible';
          element.classList.remove('d-none', 'hidden');
          
          // 内部のカードも表示
          const cards = element.querySelectorAll('.card, .guide-card');
          cards.forEach(card => {
            card.style.display = '';
            card.style.visibility = 'visible';
            card.classList.remove('d-none', 'hidden');
          });
        }
      });
    });

    // 直接的にすべてのカードを表示
    const allCards = document.querySelectorAll('.card, .guide-card, [data-guide-id]');
    allCards.forEach(card => {
      card.style.display = '';
      card.style.visibility = 'visible';
      card.classList.remove('d-none', 'hidden');
      
      // 親要素チェーンも表示
      let parent = card.parentElement;
      while (parent && parent !== document.body) {
        parent.style.display = '';
        parent.style.visibility = 'visible';
        parent.classList.remove('d-none', 'hidden');
        parent = parent.parentElement;
      }
    });

    console.log('ガイドカード強制表示完了');
  }

  /**
   * フィルターをリセット
   */
  function resetFilters() {
    // フィルター関数を無効化
    if (window.executeUnifiedFilter) {
      window.executeUnifiedFilter = function() {
        console.log('フィルター無効化 - 全カード表示');
        forceShowGuideCards();
      };
    }

    // フィルター要素をリセット
    const filterElements = document.querySelectorAll('select, input[type="text"], input[type="checkbox"]');
    filterElements.forEach(element => {
      if (element.closest('.filter-container, .search-container')) {
        if (element.tagName === 'SELECT') {
          element.value = element.querySelector('option') ? element.querySelector('option').value : '';
        } else if (element.type === 'checkbox') {
          element.checked = false;
        } else {
          element.value = '';
        }
      }
    });

    console.log('フィルターリセット完了');
  }

  /**
   * ナビゲーション修正
   */
  function fixNavigation() {
    // ガイド登録ボタンのみ修正（観光客登録ボタンは除外）
    const registrationButtons = document.querySelectorAll('button, a');
    registrationButtons.forEach(button => {
      const text = button.textContent;
      // ガイド登録のみ対象とし、観光客登録は除外
      if (text.includes('ガイドとして登録') && !text.includes('旅行者')) {
        button.onclick = function(e) {
          e.preventDefault();
          window.location.href = 'guide-registration-form.html';
        };
      }
    });

    // プロフィール詳細リンク修正
    const detailButtons = document.querySelectorAll('button, a');
    detailButtons.forEach(button => {
      const text = button.textContent;
      if (text.includes('詳細を見る') || text.includes('詳細')) {
        button.onclick = function(e) {
          e.preventDefault();
          const card = button.closest('.card, .guide-card');
          if (card) {
            const guideId = card.dataset.guideId || Math.floor(Math.random() * 1000);
            window.location.href = `guide-profile.html?id=${guideId}`;
          }
        };
      }
    });

    console.log('ナビゲーション修正完了');
  }

  // グローバル関数として公開
  window.executeEmergencyFix = executeEmergencyFix;
  window.forceShowGuideCards = forceShowGuideCards;

})();