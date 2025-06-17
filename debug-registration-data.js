/**
 * 登録データのデバッグとトラブルシューティング
 * セッションストレージとローカルストレージの内容を詳細に調査
 */

(function() {
  'use strict';

  /**
   * ストレージ内容を全て調査
   */
  function debugStorageContents() {
    console.log('=== ストレージ内容デバッグ開始 ===');
    
    // セッションストレージ全体を調査
    console.log('--- セッションストレージ ---');
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      console.log(`${key}:`, value);
      
      try {
        const parsed = JSON.parse(value);
        console.log(`${key} (parsed):`, parsed);
      } catch (e) {
        // JSONでない場合はそのまま
      }
    }

    // ローカルストレージ全体を調査
    console.log('--- ローカルストレージ ---');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value);
      
      try {
        const parsed = JSON.parse(value);
        console.log(`${key} (parsed):`, parsed);
      } catch (e) {
        // JSONでない場合はそのまま
      }
    }

    console.log('=== ストレージ内容デバッグ終了 ===');
  }

  /**
   * ページ内の表示要素をチェック
   */
  function debugDisplayElements() {
    console.log('=== 表示要素デバッグ開始 ===');
    
    const elements = [
      'display-name',
      'display-username', 
      'display-email',
      'display-location',
      'display-languages'
    ];

    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`${id}:`, element.textContent || element.innerHTML);
      } else {
        console.log(`${id}: 要素が見つかりません`);
      }
    });

    console.log('=== 表示要素デバッグ終了 ===');
  }

  /**
   * 手動でデータを設定して表示をテスト
   */
  function testManualDataSet() {
    console.log('=== 手動データ設定テスト開始 ===');
    
    // テスト用データを作成
    const testData = {
      name: '山田太郎',
      username: 'yamada_taro',
      email: 'yamada@example.com',
      location: '東京都',
      languages: ['ja', 'en']
    };

    console.log('テストデータ:', testData);

    // セッションストレージに保存
    sessionStorage.setItem('currentUser', JSON.stringify(testData));
    console.log('テストデータをセッションストレージに保存');

    // 表示を更新
    updateDisplayWithData(testData);

    console.log('=== 手動データ設定テスト終了 ===');
  }

  /**
   * データで表示を更新
   */
  function updateDisplayWithData(data) {
    console.log('表示更新開始:', data);

    // 氏名
    const displayName = document.getElementById('display-name');
    if (displayName) {
      displayName.textContent = data.name || '未設定';
      console.log('氏名更新:', data.name);
    }

    // ユーザー名
    const displayUsername = document.getElementById('display-username');
    if (displayUsername) {
      displayUsername.textContent = data.username || '未設定';
      console.log('ユーザー名更新:', data.username);
    }

    // メールアドレス
    const displayEmail = document.getElementById('display-email');
    if (displayEmail) {
      displayEmail.textContent = data.email || '未設定';
      console.log('メールアドレス更新:', data.email);
    }

    // 活動エリア
    const displayLocation = document.getElementById('display-location');
    if (displayLocation) {
      displayLocation.textContent = data.location || '未設定';
      console.log('活動エリア更新:', data.location);
    }

    // 対応言語
    const displayLanguages = document.getElementById('display-languages');
    if (displayLanguages && data.languages) {
      const languageLabels = {
        'ja': '日本語', 'en': '英語', 'zh': '中国語', 'ko': '韓国語'
      };
      
      const badges = data.languages.map(lang => 
        `<span class="badge bg-primary me-1">${languageLabels[lang] || lang}</span>`
      ).join('');
      
      displayLanguages.innerHTML = badges;
      console.log('対応言語更新:', data.languages);
    }

    // サイドバーの名前も更新
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      sidebarName.textContent = data.name || data.username || '未設定';
      console.log('サイドバー名更新:', data.name);
    }
  }

  /**
   * URL パラメータから新規登録状態をチェック
   */
  function checkRegistrationMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const step = urlParams.get('step');
    
    console.log('URLパラメータ:', { mode, step });
    
    if (mode === 'registration' && step === '2') {
      console.log('新規登録からの遷移を検出');
      return true;
    }
    
    return false;
  }

  /**
   * 他のスクリプトが実行される前にデータを確保
   */
  function preserveRegistrationData() {
    const currentUser = sessionStorage.getItem('currentUser');
    const regData = sessionStorage.getItem('guideRegistrationData');
    
    console.log('データ保護開始');
    console.log('currentUser:', currentUser);
    console.log('guideRegistrationData:', regData);
    
    if (currentUser) {
      // バックアップを作成
      sessionStorage.setItem('currentUser_backup', currentUser);
      console.log('currentUserのバックアップを作成');
    }
    
    if (regData) {
      // バックアップを作成
      sessionStorage.setItem('guideRegistrationData_backup', regData);
      console.log('guideRegistrationDataのバックアップを作成');
    }
  }

  /**
   * デバッグ情報をページに表示
   */
  function showDebugInfo() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: #000;
      color: #00ff00;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
    `;

    const currentUser = sessionStorage.getItem('currentUser');
    const regData = sessionStorage.getItem('guideRegistrationData');
    
    debugPanel.innerHTML = `
      <div><strong>DEBUG INFO</strong></div>
      <div>currentUser: ${currentUser ? 'あり' : 'なし'}</div>
      <div>regData: ${regData ? 'あり' : 'なし'}</div>
      <div>URL: ${window.location.search}</div>
      <button onclick="this.parentNode.remove()">閉じる</button>
    `;

    document.body.appendChild(debugPanel);
  }

  /**
   * 初期化とデバッグ実行
   */
  function initialize() {
    console.log('登録データデバッグシステム開始');
    
    // URLパラメータチェック
    const isRegistration = checkRegistrationMode();
    
    // データ保護
    preserveRegistrationData();
    
    // ストレージ内容デバッグ
    debugStorageContents();
    
    // 表示要素デバッグ
    setTimeout(debugDisplayElements, 1000);
    
    // デバッグ情報表示
    showDebugInfo();
    
    // 新規登録の場合はテストデータで確認
    if (isRegistration) {
      setTimeout(testManualDataSet, 2000);
    }

    // グローバル関数として公開
    window.debugStorage = debugStorageContents;
    window.debugDisplay = debugDisplayElements;
    window.testData = testManualDataSet;

    console.log('デバッグシステム初期化完了');
    console.log('利用可能な関数: debugStorage(), debugDisplay(), testData()');
  }

  // 即座に実行
  initialize();

})();