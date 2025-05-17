/**
 * ガイドログイン機能のデバッグ支援スクリプト
 * ログイン処理で問題が発生した場合のトラブルシューティングを行う
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイドログインデバッグツールを読み込みました');
  
  // セッションストレージの内容をチェック
  checkSessionStorage();
  
  // ログインボタンにデバッグイベントを追加
  setupDebugListeners();
});

/**
 * セッションストレージの内容を確認して問題があれば修正
 */
function checkSessionStorage() {
  try {
    // ガイド登録データの確認
    const guideData = JSON.parse(sessionStorage.getItem('guideRegistrationData') || '{}');
    console.log('セッションストレージ内のガイド登録データ:', guideData);
    
    // 現在のユーザーデータの確認
    const userData = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    console.log('セッションストレージ内の現在のユーザーデータ:', userData);
    
    // データの整合性チェック
    if (guideData.email && !userData.email) {
      console.warn('ガイド登録データは存在しますが、ユーザーとしてログインしていません');
    } else if (userData.email && userData.type === 'guide') {
      console.log('ガイドとしてログイン中です:', userData.email);
    }
  } catch (error) {
    console.error('セッションストレージの確認中にエラーが発生しました:', error);
  }
}

/**
 * デバッグ用のイベントリスナーを設定
 */
function setupDebugListeners() {
  // ログインフォームの送信イベントをキャプチャ
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      // イベントはキャプチャのみ（メインのログイン処理は阻害しない）
      
      // 入力内容をコンソールに記録
      const email = document.getElementById('login-email')?.value;
      const userType = document.querySelector('input[name="login-user-type"]:checked')?.value || 'tourist';
      
      console.log('ログイン試行:', {
        email: email,
        userType: userType
      });
      
      if (userType === 'guide') {
        // セッションストレージのガイド登録データとの照合
        try {
          const registeredData = JSON.parse(sessionStorage.getItem('guideRegistrationData') || '{}');
          if (registeredData.email) {
            console.log('登録済みガイドメール:', registeredData.email);
            console.log('入力メールとのマッチング:', email === registeredData.email);
          } else {
            console.warn('ガイド登録データにメールアドレスが見つかりません');
          }
        } catch (error) {
          console.error('ガイド登録データの検証中にエラーが発生しました:', error);
        }
      }
    });
  } else {
    console.warn('ログインフォームが見つかりません');
  }
}

/**
 * デバッグ情報をUI上に表示
 */
function showDebugInfo() {
  try {
    const guideData = JSON.parse(sessionStorage.getItem('guideRegistrationData') || '{}');
    const userData = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    const debugInfo = document.createElement('div');
    debugInfo.style.position = 'fixed';
    debugInfo.style.bottom = '10px';
    debugInfo.style.right = '10px';
    debugInfo.style.padding = '10px';
    debugInfo.style.background = 'rgba(0,0,0,0.7)';
    debugInfo.style.color = 'white';
    debugInfo.style.fontSize = '12px';
    debugInfo.style.borderRadius = '4px';
    debugInfo.style.zIndex = '9999';
    debugInfo.style.maxWidth = '300px';
    
    debugInfo.innerHTML = `
      <div><strong>デバッグ情報</strong></div>
      <div>ガイド登録: ${guideData.email ? '✓' : '✗'}</div>
      <div>ログイン状態: ${userData.email ? '✓' : '✗'}</div>
      ${guideData.email ? `<div>登録済メール: ${guideData.email}</div>` : ''}
    `;
    
    // すでに存在する場合は更新、なければ追加
    const existingDebug = document.getElementById('login-debug-info');
    if (existingDebug) {
      existingDebug.innerHTML = debugInfo.innerHTML;
    } else {
      debugInfo.id = 'login-debug-info';
      document.body.appendChild(debugInfo);
    }
  } catch (error) {
    console.error('デバッグ情報の表示中にエラーが発生しました:', error);
  }
}

// デバッグ情報を定期的に更新
setInterval(showDebugInfo, 3000);