/**
 * 「優」問題の即座修正システム
 * セッションストレージから実データを取得し、「優」を即座に置き換え
 */

(function() {
  'use strict';

  /**
   * セッションストレージから有効なユーザーデータを取得
   */
  function getValidUserData() {
    const keys = ['currentUser', 'guideRegistrationData', 'latestGuideRegistration'];
    
    for (const key of keys) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          
          // 有効なデータの条件をチェック
          if (parsed && 
              (parsed.firstName || parsed.name || parsed.username) &&
              parsed.firstName !== '優' && 
              parsed.name !== '優' && 
              parsed.username !== '優' &&
              parsed.email) {
            
            console.log('即座修正: 有効データ取得:', {
              source: key,
              name: parsed.name || parsed.firstName,
              username: parsed.username,
              email: parsed.email
            });
            
            return parsed;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    return null;
  }

  /**
   * 「優」を即座に修正
   */
  function fixYuuImmediately() {
    const userData = getValidUserData();
    
    if (!userData) {
      console.log('即座修正: 有効なユーザーデータが見つかりません');
      return false;
    }

    // 正しい値を計算
    const correctName = userData.name || 
                       (userData.firstName && userData.lastName ? 
                        `${userData.firstName} ${userData.lastName}` : 
                        userData.firstName) || 
                       userData.username || 
                       'ガイド';

    const correctUsername = userData.username || userData.firstName || userData.name || 'ガイド';

    // 「優」が表示されている要素を探して修正
    const fixes = [
      { id: 'display-name', correctValue: correctName },
      { id: 'display-username', correctValue: correctUsername },
      { id: 'user-name', correctValue: correctName }
    ];

    let fixedCount = 0;

    fixes.forEach(({ id, correctValue }) => {
      const element = document.getElementById(id);
      if (element && element.textContent === '優') {
        // 複数の方法で確実に設定
        element.textContent = correctValue;
        element.innerHTML = correctValue;
        
        // カスタム属性でマーク
        element.setAttribute('data-yuu-fixed', 'true');
        element.setAttribute('data-correct-value', correctValue);
        
        console.log(`即座修正: ${id} 「優」→「${correctValue}」`);
        fixedCount++;
      }
    });

    return fixedCount > 0;
  }

  /**
   * 定期的な「優」チェックと修正
   */
  function startYuuMonitoring() {
    const checkInterval = setInterval(() => {
      const yuuElements = [];
      
      ['display-name', 'display-username', 'user-name'].forEach(id => {
        const element = document.getElementById(id);
        if (element && element.textContent === '優') {
          yuuElements.push(id);
        }
      });

      if (yuuElements.length > 0) {
        console.log('定期チェック: 「優」を検出:', yuuElements);
        const fixed = fixYuuImmediately();
        if (fixed) {
          console.log('定期チェック: 修正完了');
        }
      }
    }, 500); // 0.5秒間隔でチェック

    // 10分後に停止
    setTimeout(() => {
      clearInterval(checkInterval);
      console.log('定期チェック: 監視終了');
    }, 600000);

    return checkInterval;
  }

  /**
   * DOM要素の変更を監視して即座に修正
   */
  function setupMutationObserver() {
    const targetIds = ['display-name', 'display-username', 'user-name'];
    
    targetIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.target.textContent === '優') {
              console.log(`変更監視: ${id}で「優」を検出、即座に修正`);
              
              setTimeout(() => {
                fixYuuImmediately();
              }, 10);
            }
          });
        });

        observer.observe(element, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    });
  }

  /**
   * sessionStorage の変更も監視
   */
  function setupStorageMonitoring() {
    const originalSetItem = sessionStorage.setItem;
    
    sessionStorage.setItem = function(key, value) {
      // 「優」を含むデータの保存を検出
      if (value && value.includes('優')) {
        console.log('ストレージ監視: 「優」を含むデータの保存を検出:', key, value);
        
        try {
          const parsed = JSON.parse(value);
          if (parsed.name === '優' || parsed.username === '優' || parsed.firstName === '優') {
            console.log('ストレージ監視: 「優」データの保存を阻止');
            return; // 保存を阻止
          }
        } catch (e) {
          // JSON以外の場合はそのまま通す
        }
      }
      
      return originalSetItem.call(this, key, value);
    };
  }

  /**
   * 初期化処理
   */
  function initialize() {
    console.log('「優」即座修正システム開始');

    // ストレージ監視を設定
    setupStorageMonitoring();
    
    // 即座に修正実行
    setTimeout(fixYuuImmediately, 100);
    setTimeout(fixYuuImmediately, 300);
    setTimeout(fixYuuImmediately, 600);
    setTimeout(fixYuuImmediately, 1000);
    
    // 変更監視を設定
    setTimeout(setupMutationObserver, 1500);
    
    // 定期監視を開始
    setTimeout(startYuuMonitoring, 2000);

    // グローバル関数として公開
    window.fixYuuNow = fixYuuImmediately;
    window.checkYuuStatus = function() {
      ['display-name', 'display-username', 'user-name'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`${id}: "${element.textContent}"`);
        }
      });
    };

    console.log('「優」即座修正システム初期化完了');
  }

  // 最優先で実行
  initialize();

  // DOM準備後も実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }

})();