/**
 * 登録モーダル専用翻訳修正スクリプト
 * モーダル表示時にリアルタイムで翻訳を適用します
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('登録モーダル翻訳修正スクリプトを読み込みました');
  
  // 即時実行
  setTimeout(initRegisterModalFix, 100);
  
  /**
   * 初期化（遅延実行）
   */
  function initRegisterModalFix() {
    // 観光客登録モーダル
    const registerTouristModal = document.getElementById('registerTouristModal');
    if (registerTouristModal) {
      // 既に表示されている場合はすぐに翻訳
      if (isModalVisible(registerTouristModal)) {
        console.log('観光客登録モーダルは既に表示されています');
        translateRegisterModal('tourist');
      }
      
      // モーダル表示イベント
      registerTouristModal.addEventListener('shown.bs.modal', function() {
        console.log('観光客登録モーダルが表示されました');
        translateRegisterModal('tourist');
      });
    }
    
    // ガイド登録モーダル
    const registerGuideModal = document.getElementById('registerGuideModal');
    if (registerGuideModal) {
      // 既に表示されている場合はすぐに翻訳
      if (isModalVisible(registerGuideModal)) {
        console.log('ガイド登録モーダルは既に表示されています');
        translateRegisterModal('guide');
      }
      
      // モーダル表示イベント
      registerGuideModal.addEventListener('shown.bs.modal', function() {
        console.log('ガイド登録モーダルが表示されました');
        translateRegisterModal('guide');
      });
    }
    
    // 登録ボタンクリックイベントのキャプチャ
    document.body.addEventListener('click', function(e) {
      if (e.target && (
          e.target.classList.contains('register-button') || 
          (e.target.tagName === 'A' && e.target.getAttribute('data-bs-target') === '#registerTouristModal') ||
          (e.target.tagName === 'A' && e.target.getAttribute('data-bs-target') === '#registerGuideModal')
      )) {
        console.log('登録ボタンがクリックされました');
        
        setTimeout(function() {
          const touristModal = document.getElementById('registerTouristModal');
          const guideModal = document.getElementById('registerGuideModal');
          
          if (isModalVisible(touristModal)) {
            translateRegisterModal('tourist');
          } else if (isModalVisible(guideModal)) {
            translateRegisterModal('guide');
          }
        }, 200);
      }
    });
    
    // 言語切り替えイベントをリッスン
    window.addEventListener('languageChanged', function(e) {
      // ページ上のすべてのモーダルをチェック
      const allModals = document.querySelectorAll('.modal');
      allModals.forEach(function(modal) {
        if (isModalVisible(modal)) {
          if (modal.id === 'registerTouristModal') {
            translateRegisterModal('tourist', e.detail.language);
          } else if (modal.id === 'registerGuideModal') {
            translateRegisterModal('guide', e.detail.language);
          }
        }
      });
    });
  }
  
  /**
   * モーダルが表示されているかをチェック
   */
  function isModalVisible(modal) {
    return modal && (modal.classList.contains('show') || 
                     window.getComputedStyle(modal).display !== 'none');
  }
  
  /**
   * 登録モーダルを翻訳する
   * @param {string} userType - 'tourist'または'guide'
   * @param {string} lang - 言語コード（未指定の場合はlocalStorageから取得）
   */
  function translateRegisterModal(userType, lang) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'ja';
    if (lang === 'ja') return; // 日本語の場合は何もしない
    
    console.log(`${userType}登録モーダルを英語に翻訳します`);
    
    const modalId = userType === 'tourist' ? 'registerTouristModal' : 'registerGuideModal';
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`${userType}登録モーダルが見つかりません`);
      return;
    }
    
    // モーダルタイトル
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.textContent = userType === 'tourist' ? 'Tourist Registration' : 'Guide Registration';
    }
    
    // 基本情報
    translateElementsByText(modal, 'h5', '基本情報', 'Basic Information');
    
    // メール、パスワード、名前などの各ラベル
    const labels = {
      'お名前': 'Full Name',
      'メールアドレス': 'Email Address',
      'パスワード': 'Password',
      '電話番号': 'Phone Number',
      '8文字以上で、英数字を含めてください': 'At least 8 characters including letters and numbers',
      '認証コード': 'Verification Code',
      '認証コードを送信': 'Send Verification Code',
      '認証コードを確認': 'Verify Code',
      '利用規約に同意する': 'I agree to the Terms of Service',
      '登録する': 'Register',
      'アカウントをお持ちでない方': 'Don\'t have an account?',
      '新規登録': 'Register',
      '登録': 'Register'
    };
    
    // ラベル要素の翻訳
    modal.querySelectorAll('label.form-label').forEach(function(label) {
      const original = label.textContent.trim();
      if (labels[original]) {
        label.textContent = labels[original];
      }
    });
    
    // ヘルプテキストの翻訳
    modal.querySelectorAll('small.form-text, .text-muted').forEach(function(element) {
      const original = element.textContent.trim();
      if (labels[original]) {
        element.textContent = labels[original];
      }
    });
    
    // 各種ボタンの翻訳
    modal.querySelectorAll('button').forEach(function(button) {
      const original = button.textContent.trim();
      if (labels[original]) {
        button.textContent = labels[original];
      }
      
      // 送信ボタン
      if (button.type === 'submit') {
        button.textContent = 'Register';
      }
    });
    
    // 全てのパスワードフィールドのプレースホルダー
    const passwordInputs = modal.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(function(input) {
      input.placeholder = 'Enter password';
    });
    
    // 利用規約チェックボックスラベル
    const termsLabels = modal.querySelectorAll('label[for^="agreeTerms"]');
    termsLabels.forEach(function(label) {
      label.textContent = 'I agree to the Terms of Service';
    });
    
    // 「既にアカウントをお持ちの方」
    const accountExistsText = modal.querySelector('.modal-footer div');
    if (accountExistsText) {
      accountExistsText.textContent = 'Already have an account?';
    }
    
    // ログインリンク
    const loginLinks = modal.querySelectorAll('a[data-bs-target="#loginModal"]');
    loginLinks.forEach(function(link) {
      link.textContent = 'Login';
    });
    
    // すべての入力フィールドのplaceholderを設定
    setPlaceholders(modal);
    
    // ガイド登録モーダル特有の翻訳
    if (userType === 'guide') {
      // その他のガイド登録特有のフィールド
      const guideLabels = {
        '活動エリア': 'Activity Area',
        '対応言語': 'Languages',
        '得意分野・テーマ': 'Specialties & Themes',
        '自己紹介文': 'Self Introduction',
        'ガイド料金': 'Guide Fee',
        '本人確認書類': 'Identity Verification Document',
        'ガイド情報': 'Guide Information',
        '身分証明書': 'Identification Document',
        '写真アップロード': 'Photo Upload',
        '表面': 'Front side',
        '裏面': 'Back side',
        '身分証明書の表と裏': 'Front and back of ID',
        '表面と裏面の写真を選択してください': 'Please select photos of the front and back sides'
      };
      
      modal.querySelectorAll('h5, label, legend, p, small').forEach(function(element) {
        const original = element.textContent.trim();
        if (guideLabels[original]) {
          element.textContent = guideLabels[original];
        }
      });
    }
  }
  
  /**
   * 特定のテキストを含む要素を翻訳する
   */
  function translateElementsByText(container, selector, originalText, translatedText) {
    if (!container) return;
    
    const elements = container.querySelectorAll(selector);
    elements.forEach(function(element) {
      if (element.textContent.trim() === originalText) {
        element.textContent = translatedText;
      }
    });
  }
  
  /**
   * プレースホルダーをすべて英語に
   */
  function setPlaceholders(container) {
    if (!container) return;
    
    const placeholderMap = {
      'お名前を入力': 'Enter your name',
      'メールアドレスを入力': 'Enter email address',
      'パスワードを入力': 'Enter password',
      '電話番号を入力': 'Enter phone number',
      '認証コードを入力': 'Enter verification code',
      '活動エリアを入力': 'Enter activity area',
      '自己紹介を入力': 'Enter self introduction',
      '料金を入力': 'Enter fee'
    };
    
    const inputs = container.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
      const placeholder = input.getAttribute('placeholder');
      if (placeholder && placeholderMap[placeholder]) {
        input.setAttribute('placeholder', placeholderMap[placeholder]);
      }
    });
  }
});