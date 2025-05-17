/**
 * 完全修正版 電話認証スクリプト
 * ガイド登録時の認証バッジ問題を解決
 * 
 * 既存の認証ロジックは変更せず、UIの表示部分のみ制御
 */
(function() {
  // 初期化関数
  function initFixedPhoneAuth() {
    console.log('電話認証UI修正スクリプト: 初期化');
    
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupPhoneAuth);
    } else {
      setupPhoneAuth();
    }
    
    // ウィンドウ読み込み完了時と少し遅延させても実行
    window.addEventListener('load', function() {
      setupPhoneAuth();
      setTimeout(setupPhoneAuth, 500);
      setTimeout(setupPhoneAuth, 1000);
    });
    
    // モーダル表示時も実行
    document.addEventListener('shown.bs.modal', function() {
      setupPhoneAuth();
    });
  }
  
  // 電話認証UI設定
  function setupPhoneAuth() {
    console.log('電話認証UI修正: セットアップ開始');
    
    // ガイド用とツーリスト用で別々に処理
    setupGuidePhoneAuth();
    setupTouristPhoneAuth();
    
    // 認証状態表示を監視
    monitorVerificationState();
  }
  
  // ガイド用電話認証設定
  function setupGuidePhoneAuth() {
    console.log('ガイド用電話認証UI: セットアップ');
    
    // ガイド用認証フォーム要素
    const guidePhoneAuthForm = document.getElementById('guide-phone-auth-form');
    const guideVerifiedAlert = document.getElementById('guide-phone-verified');
    
    if (guidePhoneAuthForm) {
      // 常に認証バッジを非表示
      if (guideVerifiedAlert) {
        guideVerifiedAlert.style.setProperty('display', 'none', 'important');
        guideVerifiedAlert.classList.add('d-none');
      }
      
      // 送信コードボタン
      const guideSendCodeBtn = document.getElementById('guide-send-code-btn');
      // 検証コード入力欄
      const guideVerificationCode = document.getElementById('guide-verification-code');
      
      // コード送信ボタンのクリックイベント
      if (guideSendCodeBtn) {
        guideSendCodeBtn.addEventListener('click', function() {
          // 既存の処理を妨げないようにするため、イベントをバブルアップ
          console.log('ガイド: コード送信ボタンがクリックされました');
        });
      }
      
      // 認証コード入力イベント
      if (guideVerificationCode) {
        guideVerificationCode.addEventListener('input', function() {
          if (this.value.length >= 6) {
            console.log('ガイド: 6桁のコードが入力されました');
          }
        });
      }
    }
  }
  
  // ツーリスト用電話認証設定
  function setupTouristPhoneAuth() {
    console.log('ツーリスト用電話認証UI: セットアップ');
    
    // ツーリスト用認証フォーム要素
    const touristPhoneAuthForm = document.getElementById('tourist-phone-auth-form');
    const touristVerifiedAlert = document.getElementById('tourist-phone-verified');
    
    if (touristPhoneAuthForm) {
      // 認証バッジの表示制御
      if (touristVerifiedAlert) {
        // Firebase認証状態に基づいて表示するため、強制非表示はしない
        console.log('ツーリスト認証バッジ: 正常処理');
      }
      
      // 送信コードボタン
      const touristSendCodeBtn = document.getElementById('tourist-send-code-btn');
      // 検証コード入力欄
      const touristVerificationCode = document.getElementById('tourist-verification-code');
      
      // コード送信ボタンのクリックイベント
      if (touristSendCodeBtn) {
        touristSendCodeBtn.addEventListener('click', function() {
          console.log('ツーリスト: コード送信ボタンがクリックされました');
        });
      }
      
      // 認証コード入力イベント
      if (touristVerificationCode) {
        touristVerificationCode.addEventListener('input', function() {
          if (this.value.length >= 6) {
            console.log('ツーリスト: 6桁のコードが入力されました');
          }
        });
      }
    }
  }
  
  // 認証状態表示の監視
  function monitorVerificationState() {
    console.log('認証状態表示監視: 開始');
    
    // 対象要素を監視
    const targetNode = document.body;
    
    // 監視オプション
    const config = { 
      attributes: true, 
      childList: true, 
      subtree: true 
    };
    
    // コールバック関数
    const callback = function(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 新しく追加された要素を処理
          mutation.addedNodes.forEach(node => {
            // 要素ノードのみ処理
            if (node.nodeType === 1) {
              // ガイド認証バッジ関連要素を処理
              if (node.id === 'guide-phone-verified' || 
                  (node.classList && 
                   node.classList.contains('alert-success') && 
                   node.closest('[id*="guide"]'))) {
                console.log('動的に追加されたガイド認証バッジを非表示化:', node.id || node.className);
                node.style.setProperty('display', 'none', 'important');
                node.classList.add('d-none');
              }
            }
          });
        }
        else if (mutation.type === 'attributes') {
          // 属性変更を監視（表示/非表示の切り替えなど）
          const target = mutation.target;
          if (target.id === 'guide-phone-verified') {
            // ガイド認証バッジは常に非表示
            target.style.setProperty('display', 'none', 'important');
            target.classList.add('d-none');
            console.log('ガイド認証バッジの表示変更を検出、強制非表示化');
          }
        }
      }
    };
    
    // オブザーバーを作成して監視開始
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
  
  // スクリプト初期化
  initFixedPhoneAuth();
})();