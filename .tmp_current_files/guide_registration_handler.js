/**
 * ガイド登録処理の専用スクリプト
 * ガイド登録フォームのデータをセッションストレージに保存し、ログイン機能との連携を実現
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド登録ハンドラーを初期化');
  
  // ガイド登録フォームの処理
  setupGuideRegistrationForm();
  
  // デバッグ用：登録データの確認
  checkStoredRegistrationData();
});

/**
 * ガイド登録フォームのセットアップ
 */
function setupGuideRegistrationForm() {
  const guideForm = document.getElementById('guide-register-form');
  
  if (guideForm) {
    console.log('ガイド登録フォームを検出');
    
    guideForm.addEventListener('submit', function(e) {
      // フォーム送信のデフォルト動作はキャンセルしない
      // e.preventDefault(); は呼び出さない（index.htmlのメイン処理で行う）
      
      // ガイド登録情報をセッションストレージに保存
      saveGuideRegistrationData();
    });
  }
}

/**
 * ガイド登録データをセッションストレージに保存
 */
function saveGuideRegistrationData() {
  try {
    const guideData = {
      email: document.getElementById('guide-email')?.value,
      fullname: document.getElementById('guide-name')?.value,
      phone: document.getElementById('guide-phone-number')?.value,
      city: document.getElementById('guide-city')?.value,
      languages: Array.from(document.querySelectorAll('input[name="guide-languages"]:checked')).map(el => el.value),
      bio: document.getElementById('guide-bio')?.value,
      timestamp: new Date().toISOString()
    };
    
    // 必須フィールドの確認
    if (!guideData.email || !guideData.fullname) {
      console.warn('必須フィールドが入力されていません');
      return;
    }
    
    // プロフィール画像の処理はメインスクリプトで行うので、ここでは省略
    
    console.log('ガイド登録データをセッションストレージに保存:', guideData);
    sessionStorage.setItem('guideRegistrationData', JSON.stringify(guideData));
  } catch (err) {
    console.error('ガイド登録データの保存中にエラーが発生しました:', err);
  }
}

/**
 * 保存されている登録データの確認（デバッグ用）
 */
function checkStoredRegistrationData() {
  try {
    const storedData = sessionStorage.getItem('guideRegistrationData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('保存されているガイド登録データ:', parsedData);
    } else {
      console.log('ガイド登録データはまだ保存されていません');
    }
  } catch (err) {
    console.error('保存データの確認中にエラーが発生しました:', err);
  }
}