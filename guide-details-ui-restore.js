/**
 * ガイド詳細ページのUI修復スクリプト
 * 直接ガイド詳細ページにリンクするためのスクリプト
 */

(function() {
  try {
    // 既に実行済みかチェック
    if (window.guideDetailsUIRestoreApplied) {
      return;
    }
    window.guideDetailsUIRestoreApplied = true;
    
    console.log('ガイド詳細UI修復スクリプトを実行します');
    
    // DOMが準備できたら実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initUIRestore);
    } else {
      // 遅延実行してDOM要素が確実に読み込まれるようにする
      setTimeout(initUIRestore, 100);
    }
  } catch (e) {
    console.error('ガイド詳細UI修復の初期化エラー:', e);
  }
  
  /**
   * UI修復の初期化
   */
  function initUIRestore() {
    try {
      console.log('ガイド詳細UI修復: 初期化');
      
      // メインページの「詳細を見る」ボタンの修正
      fixAllDetailButtons();
      
      // 現在ガイド詳細ページにいる場合の修正
      if (isGuideDetailsPage()) {
        // 遅延実行してDOM要素が確実に読み込まれるようにする
        setTimeout(fixGuideDetailsPage, 200);
      }
    } catch (e) {
      console.error('ガイド詳細UI修復の初期化エラー:', e);
    }
  }
  
  /**
   * ガイド詳細ページかどうかを判定
   */
  function isGuideDetailsPage() {
    try {
      return window.location.href.includes('guide-details.html');
    } catch (e) {
      console.error('ページ判定エラー:', e);
      return false;
    }
  }
  
  /**
   * すべての詳細ボタンを修正
   */
  function fixAllDetailButtons() {
    try {
      const allDetailButtons = document.querySelectorAll('.guide-card .card-body a.btn, .guide-card .card-body button.btn');
      
      if (!allDetailButtons || allDetailButtons.length === 0) {
        console.log('詳細ボタンが見つかりません - 処理をスキップします');
        return;
      }
      
      allDetailButtons.forEach(button => {
        if (button) {
          // 既存のイベントリスナーを維持しつつ、新しいイベントリスナーを追加
          button.addEventListener('click', handleDetailButtonClick);
        }
      });
      
      console.log(`${allDetailButtons.length}個の詳細ボタンを修正しました`);
    } catch (e) {
      console.error('詳細ボタン修正エラー:', e);
    }
  }
  
  /**
   * 詳細ボタンのクリックハンドラ
   */
  function handleDetailButtonClick(event) {
    try {
      if (!event || !event.currentTarget) return;
      
      // イベントの発生元を取得
      const button = event.currentTarget;
      
      // ボタンからガイドIDを取得する試み
      let guideId = null;
      
      // 1. hrefからID取得を試みる
      if (button.hasAttribute('href')) {
        const href = button.getAttribute('href');
        if (href && href.includes('guide-details.html')) {
          const parts = href.split('?');
          if (parts.length > 1) {
            const urlParams = new URLSearchParams(parts[1]);
            guideId = urlParams.get('id');
          }
        }
      }
      
      // 2. data属性からID取得を試みる
      if (!guideId && button.hasAttribute('data-guide-id')) {
        guideId = button.getAttribute('data-guide-id');
      }
      
      // 3. 親カードからID取得を試みる
      if (!guideId) {
        const card = findParentWithClass(button, 'guide-card');
        if (card && card.hasAttribute('data-guide-id')) {
          guideId = card.getAttribute('data-guide-id');
        }
      }
      
      // 4. フォールバック: カード番号の生成
      if (!guideId) {
        const cards = document.querySelectorAll('.guide-card');
        for (let i = 0; i < cards.length; i++) {
          if (cards[i].contains(button)) {
            guideId = (i + 1).toString();
            break;
          }
        }
      }
      
      // IDが取得できた場合、詳細ページに遷移
      if (guideId) {
        const detailsUrl = `guide-details.html?id=${guideId}`;
        console.log(`ガイド詳細ページに遷移: ${detailsUrl}`);
        window.location.href = detailsUrl;
        
        // イベントをキャンセルして独自の遷移処理を優先
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    } catch (e) {
      console.error('詳細ボタンクリックハンドラエラー:', e);
    }
  }
  
  /**
   * ガイド詳細ページの修正
   */
  function fixGuideDetailsPage() {
    try {
      console.log('ガイド詳細ページを修正しています');
      
      // URLからガイドIDを取得
      const urlParams = new URLSearchParams(window.location.search);
      const guideId = urlParams.get('id');
      
      if (!guideId) {
        console.log('ガイドIDが見つかりません - デフォルトIDを使用します');
        // デフォルトIDを使用してコンテンツを表示
        showDetailsContent('1');
        return;
      }
      
      console.log(`ガイドID: ${guideId} の詳細ページを修正します`);
      showDetailsContent(guideId);
    } catch (e) {
      console.error('ガイド詳細ページ修正エラー:', e);
    }
  }
  
  /**
   * 詳細コンテンツを表示
   */
  function showDetailsContent(guideId) {
    try {
      // ログイン要求メッセージを非表示にする
      const loginPrompt = document.querySelector('.guide-details-login-prompt');
      if (loginPrompt) {
        loginPrompt.classList.add('d-none');
        console.log('ログイン要求メッセージを非表示にしました');
      }
      
      // ガイド詳細コンテンツを表示する
      const detailsContent = document.querySelector('.guide-details-content');
      if (detailsContent) {
        detailsContent.style.display = 'block';
        console.log('ガイド詳細コンテンツを表示しました');
      }
      
      // ガイド詳細データを設定
      setGuideDetailsData(guideId);
    } catch (e) {
      console.error('詳細コンテンツ表示エラー:', e);
    }
  }
  
  /**
   * ガイド詳細データを設定
   */
  function setGuideDetailsData(guideId) {
    try {
      if (!guideId) return;
      
      // ガイド名
      const nameElement = document.getElementById('guide-name');
      if (nameElement) {
        // 既存のテキストを保持
        if (nameElement.textContent === 'ガイド名') {
          nameElement.textContent = `ガイド ${guideId}`;
        }
      }
      
      // パンくずリストのガイド名
      const breadcrumbName = document.getElementById('guide-breadcrumb-name');
      if (breadcrumbName) {
        if (breadcrumbName.textContent === 'ガイド詳細') {
          breadcrumbName.textContent = `ガイド ${guideId} の詳細`;
        }
      }
      
      console.log('ガイド詳細データの設定を完了しました');
    } catch (e) {
      console.error('ガイド詳細データ設定エラー:', e);
    }
  }
  
  /**
   * 特定のクラスを持つ親要素を探す
   */
  function findParentWithClass(element, className) {
    try {
      if (!element || !className) return null;
      
      let parent = element.parentElement;
      while (parent) {
        if (parent.classList && parent.classList.contains(className)) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    } catch (e) {
      console.error('親要素検索エラー:', e);
      return null;
    }
  }
})();