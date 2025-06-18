/**
 * 最終解決システム - 「優」問題の完全撲滅
 * 全ての「優」を検出し実データで置き換える最終兵器
 */

(function() {
  'use strict';

  let monitoringActive = true;
  let fixAttempts = 0;

  /**
   * セッションストレージから最新の実データを取得
   */
  function getFreshUserData() {
    const sources = [
      'currentUser',
      'guideRegistrationData', 
      'latestGuideRegistration',
      'currentUser_backup',
      'guideRegistrationData_backup'
    ];

    for (const key of sources) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          
          // より厳密な実データ判定
          if (parsed && 
              parsed.email && 
              parsed.email.includes('@') &&
              (parsed.firstName || parsed.name || parsed.username) &&
              parsed.firstName !== '優' && 
              parsed.name !== '優' && 
              parsed.username !== '優') {
            
            console.log(`最終システム: 実データ取得成功 [${key}]:`, {
              name: parsed.name || parsed.firstName,
              username: parsed.username,
              email: parsed.email,
              location: parsed.location || parsed.region
            });
            
            return parsed;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    console.log('最終システム: 実データが見つかりません');
    return null;
  }

  /**
   * 「優」の完全撲滅実行
   */
  function executeUltimateFix() {
    const userData = getFreshUserData();
    
    if (!userData) {
      console.log('最終システム: データなしのため修正不可');
      return false;
    }

    fixAttempts++;
    console.log(`最終システム: 修正実行 #${fixAttempts}`);

    // 正しい値を計算
    const realName = userData.name || 
                    (userData.firstName && userData.lastName ? 
                     `${userData.firstName} ${userData.lastName}` : 
                     userData.firstName) || 
                    userData.username || 
                    'ガイド';

    const realUsername = userData.username || userData.firstName || userData.name || 'ガイド';
    const realEmail = userData.email || 'test1500@gmail.com';
    const realLocation = userData.location || userData.region || userData.area || '東京都';

    // 修正対象リスト
    const targets = [
      { id: 'display-name', value: realName, label: '氏名' },
      { id: 'display-username', value: realUsername, label: 'ユーザー名' },
      { id: 'user-name', value: realName, label: 'サイドバー名' },
      { id: 'display-email', value: realEmail, label: 'メール' },
      { id: 'display-location', value: realLocation, label: '活動エリア' }
    ];

    let fixedElements = 0;

    targets.forEach(({ id, value, label }) => {
      const element = document.getElementById(id);
      if (element) {
        const currentValue = element.textContent;
        
        // 「優」または空値の場合に修正
        if (currentValue === '優' || currentValue === '未設定' || currentValue.trim() === '') {
          // 強制的に値を設定
          element.textContent = value;
          element.innerHTML = value;
          
          // 複数の方法で値をロック
          Object.defineProperty(element, 'textContent', {
            value: value,
            writable: false,
            configurable: true
          });
          
          // 属性でマーク
          element.setAttribute('data-ultimate-fixed', 'true');
          element.setAttribute('data-real-value', value);
          element.setAttribute('data-fix-timestamp', Date.now());
          
          console.log(`最終システム: ${label}(${id}) 修正完了: "${currentValue}" → "${value}"`);
          fixedElements++;
        } else if (currentValue === value) {
          console.log(`最終システム: ${label}(${id}) 既に正しい値: "${value}"`);
        } else {
          console.log(`最終システム: ${label}(${id}) 不明な値: "${currentValue}"`);
        }
      } else {
        console.log(`最終システム: 要素 ${id} が見つかりません`);
      }
    });

    // フォーム要素も修正
    updateFormElements(userData);

    console.log(`最終システム: ${fixedElements}個の要素を修正完了`);
    return fixedElements > 0;
  }

  /**
   * フォーム要素の修正
   */
  function updateFormElements(userData) {
    const formTargets = [
      { id: 'guide-name', value: userData.name || userData.firstName || '' },
      { id: 'guide-username', value: userData.username || userData.firstName || '' },
      { id: 'guide-email', value: userData.email || '' },
      { id: 'guide-location', value: userData.location || userData.region || '' }
    ];

    formTargets.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element && value && (element.value === '優' || element.value === '')) {
        element.value = value;
        console.log(`最終システム: フォーム ${id} = "${value}"`);
      }
    });
  }

  /**
   * DOM変更の即座検出・修正
   */
  function setupDOMWatcher() {
    const watchTargets = ['display-name', 'display-username', 'user-name'];
    
    watchTargets.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.target.textContent === '優') {
              console.log(`最終システム: ${id}で「優」検出、即座修正`);
              setTimeout(executeUltimateFix, 50);
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
   * 高頻度監視システム
   */
  function startHighFrequencyMonitoring() {
    const interval = setInterval(() => {
      if (!monitoringActive) {
        clearInterval(interval);
        return;
      }

      // 「優」の存在チェック
      const yuuDetected = ['display-name', 'display-username', 'user-name'].some(id => {
        const element = document.getElementById(id);
        return element && element.textContent === '優';
      });

      if (yuuDetected) {
        console.log('最終システム: 高頻度監視で「優」検出');
        executeUltimateFix();
      }
    }, 200); // 0.2秒間隔の高頻度監視

    // 5分後に停止
    setTimeout(() => {
      clearInterval(interval);
      monitoringActive = false;
      console.log('最終システム: 高頻度監視終了');
    }, 300000);
  }

  /**
   * ページ可視性変更時の修正
   */
  function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        console.log('最終システム: ページ表示時の修正実行');
        setTimeout(executeUltimateFix, 100);
      }
    });
  }

  /**
   * ストレージ変更の監視
   */
  function setupStorageWatcher() {
    window.addEventListener('storage', function(e) {
      if (e.key && (e.key.includes('User') || e.key.includes('guide'))) {
        console.log('最終システム: ストレージ変更検出、修正実行');
        setTimeout(executeUltimateFix, 100);
      }
    });
  }

  /**
   * 強制修正コマンドの定期実行
   */
  function schedulePeriodicFix() {
    const intervals = [500, 1000, 2000, 3000, 5000, 10000];
    
    intervals.forEach(delay => {
      setTimeout(() => {
        if (monitoringActive) {
          console.log(`最終システム: 定期修正実行 (${delay}ms後)`);
          executeUltimateFix();
        }
      }, delay);
    });
  }

  /**
   * システム初期化
   */
  function initializeUltimateSystem() {
    console.log('🚀 最終解決システム起動');

    // 即座に修正実行
    executeUltimateFix();
    
    // 各種監視システムを設定
    setupDOMWatcher();
    setupVisibilityHandler();
    setupStorageWatcher();
    
    // 高頻度監視開始
    setTimeout(startHighFrequencyMonitoring, 1000);
    
    // 定期修正スケジュール
    schedulePeriodicFix();

    // グローバル関数として公開
    window.executeUltimateFix = executeUltimateFix;
    window.stopUltimateSystem = function() {
      monitoringActive = false;
      console.log('最終システム: 手動停止');
    };
    window.checkAllElements = function() {
      console.log('=== 全要素チェック ===');
      ['display-name', 'display-username', 'user-name', 'display-email', 'display-location'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`${id}: "${element.textContent}"`);
        }
      });
    };

    console.log('🚀 最終解決システム初期化完了');
  }

  // 最優先で実行
  initializeUltimateSystem();

  // DOM準備後も実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUltimateSystem);
  }

})();