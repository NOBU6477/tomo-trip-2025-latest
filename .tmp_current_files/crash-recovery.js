/**
 * クラッシュリカバリースクリプト
 * ページのリロードやクラッシュ後の状態復元を管理
 */

(function() {
  console.log('クラッシュリカバリー: 初期化');
  
  // 既に実行中かチェック
  if (window.__crashRecoveryInitialized) {
    console.log('クラッシュリカバリー: 既に初期化済み');
    return;
  }
  
  window.__crashRecoveryInitialized = true;
  
  // セッションストレージキー
  const STORAGE_KEY = 'local_guide_crash_recovery';
  const TIMESTAMP_KEY = 'local_guide_last_active';
  const MAX_AGE = 30 * 60 * 1000; // 30分
  
  // 状態保存の実行間隔
  const SAVE_INTERVAL = 10 * 1000; // 10秒
  
  // フォーム要素の選択器
  const FORM_ELEMENTS = 'input, select, textarea';
  const IGNORE_TYPES = ['submit', 'button', 'reset', 'hidden', 'password'];
  
  // ページロード時に実行
  document.addEventListener('DOMContentLoaded', () => {
    console.log('クラッシュリカバリー: DOMContentLoaded');
    restoreState();
    startAutosave();
    
    // クラッシュ検出機能
    setupCrashDetection();
  });
  
  // ページが閉じられる前に状態を保存
  window.addEventListener('beforeunload', saveState);
  
  /**
   * フォーム状態を保存
   */
  function saveState() {
    try {
      // 定期的にページの状態を保存
      const elements = document.querySelectorAll(FORM_ELEMENTS);
      const state = {};
      
      // フォーム要素を走査
      elements.forEach(element => {
        if (IGNORE_TYPES.includes(element.type)) return;
        
        // ID、name、またはカスタム識別子に基づいて要素を識別
        const id = getElementIdentifier(element);
        if (!id) return;
        
        // 値を保存
        if (element.type === 'checkbox' || element.type === 'radio') {
          state[id] = element.checked;
        } else {
          state[id] = element.value;
        }
      });
      
      // スクロール位置を保存
      state['__scrollX'] = window.scrollX;
      state['__scrollY'] = window.scrollY;
      
      // 現在のURLを保存
      state['__url'] = window.location.href;
      
      // タイムスタンプを保存
      const timestamp = Date.now();
      sessionStorage.setItem(TIMESTAMP_KEY, timestamp.toString());
      
      // ステートを保存
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('クラッシュリカバリー: 状態を保存しました', Object.keys(state).length);
    } catch (e) {
      console.error('クラッシュリカバリー: 状態保存エラー', e);
    }
  }
  
  /**
   * 状態を復元
   */
  function restoreState() {
    try {
      // 保存された状態があるか確認
      const savedStateJson = sessionStorage.getItem(STORAGE_KEY);
      const lastActive = parseInt(sessionStorage.getItem(TIMESTAMP_KEY) || '0');
      
      // 保存データがない、または古すぎる場合はスキップ
      if (!savedStateJson || Date.now() - lastActive > MAX_AGE) {
        console.log('クラッシュリカバリー: 復元するデータがありません');
        return;
      }
      
      const state = JSON.parse(savedStateJson);
      
      // URLが異なる場合は復元をスキップ
      if (state['__url'] && state['__url'] !== window.location.href) {
        console.log('クラッシュリカバリー: URLが異なるため復元をスキップ', state['__url']);
        return;
      }
      
      // フォーム要素を走査
      const elements = document.querySelectorAll(FORM_ELEMENTS);
      let restoredCount = 0;
      
      elements.forEach(element => {
        if (IGNORE_TYPES.includes(element.type)) return;
        
        // ID、name、またはカスタム識別子に基づいて要素を識別
        const id = getElementIdentifier(element);
        if (!id || !(id in state)) return;
        
        // 値を復元
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = state[id];
        } else {
          element.value = state[id];
        }
        
        restoredCount++;
      });
      
      // スクロール位置を復元
      if ('__scrollX' in state && '__scrollY' in state) {
        window.scrollTo(state['__scrollX'], state['__scrollY']);
      }
      
      console.log(`クラッシュリカバリー: ${restoredCount}個の要素を復元しました`);
      
      // 復元が完了したことをユーザーに通知
      if (restoredCount > 0) {
        showRestoredNotification();
      }
    } catch (e) {
      console.error('クラッシュリカバリー: 状態復元エラー', e);
    }
  }
  
  /**
   * 要素の識別子を取得
   */
  function getElementIdentifier(element) {
    // ID、name、またはカスタムデータ属性を使用
    if (element.id) return `id:${element.id}`;
    if (element.name) return `name:${element.name}`;
    
    // カスタムデータ属性の確認
    if (element.dataset.id) return `data-id:${element.dataset.id}`;
    
    // 親フォームとインデックスからの識別子生成
    const form = element.closest('form');
    if (form && form.id) {
      const inputs = Array.from(form.querySelectorAll(element.tagName));
      const index = inputs.indexOf(element);
      if (index !== -1) return `form:${form.id}:${element.tagName}:${index}`;
    }
    
    return null;
  }
  
  /**
   * 自動保存を開始
   */
  function startAutosave() {
    // 定期的に状態を保存
    setInterval(saveState, SAVE_INTERVAL);
    
    // 主要なユーザーアクションで状態を保存
    document.addEventListener('input', debounce(saveState, 2000));
    document.addEventListener('change', saveState);
    document.addEventListener('submit', saveState);
  }
  
  /**
   * クラッシュ検出
   */
  function setupCrashDetection() {
    // エラーイベント監視
    window.addEventListener('error', (event) => {
      console.error('クラッシュリカバリー: エラーを検出', event.message);
      saveState(); // エラー発生時に状態を保存
    });
    
    // プロミスの拒否を監視
    window.addEventListener('unhandledrejection', (event) => {
      console.error('クラッシュリカバリー: 未処理の拒否を検出', event.reason);
      saveState(); // 未処理の拒否発生時に状態を保存
    });
    
    // ネットワークエラーを監視
    window.addEventListener('offline', saveState);
  }
  
  /**
   * 復元通知を表示
   */
  function showRestoredNotification() {
    try {
      // 通知がすでに表示されているか確認
      if (document.getElementById('crash-recovery-notification')) return;
      
      // 通知要素を作成
      const notification = document.createElement('div');
      notification.id = 'crash-recovery-notification';
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: #4CAF50;
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 9999;
        font-family: sans-serif;
        font-size: 14px;
        transition: opacity 0.3s ease-in-out;
      `;
      
      notification.innerHTML = `
        入力内容が復元されました
        <span style="margin-left: 10px; cursor: pointer; font-weight: bold;">&times;</span>
      `;
      
      // 閉じるボタンの処理
      notification.querySelector('span').addEventListener('click', () => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
      
      // 通知を追加
      document.body.appendChild(notification);
      
      // 5秒後に自動的に消える
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 5000);
    } catch (e) {
      console.error('クラッシュリカバリー: 通知表示エラー', e);
    }
  }
  
  /**
   * デバウンス関数
   */
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // 初期化完了メッセージ
  console.log('クラッシュリカバリー: 初期化完了');
})();