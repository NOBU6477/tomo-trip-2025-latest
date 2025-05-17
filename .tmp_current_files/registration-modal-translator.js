/**
 * 登録モーダル用翻訳スクリプト
 * ガイド登録と旅行者登録のモーダルに対して翻訳機能を提供します
 */

document.addEventListener('DOMContentLoaded', function() {
  // モーダルの監視を開始
  observeModalChanges();
  
  // 言語切り替え時に翻訳処理を再実行するためのイベントリスナーを追加
  document.addEventListener('languageChanged', function(e) {
    const lang = e.detail.language || 'ja';
    translateAllModals(lang);
  });
});

/**
 * DOM変更を監視してモーダルを検知
 */
function observeModalChanges() {
  // MutationObserverの設定
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // 追加されたノードが要素の場合
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            // モーダルの検出
            if (node.classList && node.classList.contains('modal')) {
              handleModalDetected(node);
            } else {
              // モーダルを含む場合があるので子ノードも探索
              const modals = node.querySelectorAll('.modal');
              modals.forEach(handleModalDetected);
            }
          }
        }
      }
    });
  });

  // 監視の開始
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('モーダル監視を開始しました');
}

/**
 * モーダルを検知した際の処理
 * @param {HTMLElement} modal - 検出されたモーダル要素
 */
function handleModalDetected(modal) {
  // 既に処理済みのモーダルはスキップ
  if (modal.dataset.translationInitialized) return;
  
  // モーダルのタイプを判別
  const isTouristModal = isModalType(modal, 'tourist');
  const isGuideModal = isModalType(modal, 'guide');
  
  if (isTouristModal || isGuideModal) {
    console.log(`登録モーダルを検出: ${isTouristModal ? '旅行者' : 'ガイド'}`);
    
    // 処理済みフラグをセット
    modal.dataset.translationInitialized = 'true';
    
    // 現在の言語設定を適用
    const currentLang = getCurrentLanguage();
    if (currentLang === 'en') {
      translateModal(modal, currentLang);
    }
    
    // モーダルが表示された時に翻訳を適用
    modal.addEventListener('shown.bs.modal', function() {
      const lang = getCurrentLanguage();
      if (lang === 'en') {
        translateModal(modal, lang);
      }
    });
  }
}

/**
 * モーダルのタイプをチェック
 * @param {HTMLElement} modal - モーダル要素
 * @param {string} type - チェックするタイプ ('tourist'または'guide')
 * @returns {boolean} タイプが一致すればtrue
 */
function isModalType(modal, type) {
  if (!modal) return false;
  
  // モーダルのタイトルまたはコンテンツの内容からタイプを判定
  const title = modal.querySelector('.modal-title');
  const content = modal.querySelector('.modal-body');
  
  if (type === 'tourist') {
    // 旅行者登録モーダルの特徴
    return (title && title.textContent.includes('旅行者として登録')) ||
           (content && content.textContent.includes('旅行者として登録'));
  } else if (type === 'guide') {
    // ガイド登録モーダルの特徴
    return (title && title.textContent.includes('ガイドとして登録')) ||
           (content && content.textContent.includes('ガイドとして登録'));
  }
  
  return false;
}

/**
 * 全てのモーダルを翻訳
 * @param {string} lang - 言語コード ('en'または'ja')
 */
function translateAllModals(lang) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(function(modal) {
    translateModal(modal, lang);
  });
}

/**
 * モーダルの内容を翻訳
 * @param {HTMLElement} modal - 対象のモーダル要素
 * @param {string} lang - 言語コード ('en'または'ja')
 */
function translateModal(modal, lang) {
  if (lang === 'ja') return; // 日本語はデフォルトなので何もしない
  
  // モーダルのタイプを判別
  const isTouristModal = isModalType(modal, 'tourist');
  const isGuideModal = isModalType(modal, 'guide');
  
  // モーダルタイトルの翻訳
  const title = modal.querySelector('.modal-title');
  if (title) {
    if (isTouristModal) {
      title.textContent = 'Register as Tourist';
    } else if (isGuideModal) {
      title.textContent = 'Register as Guide';
    }
  }
  
  // セクションタイトルの翻訳
  const sectionTitles = modal.querySelectorAll('h4, h5, .section-title');
  sectionTitles.forEach(function(element) {
    const text = element.textContent.trim();
    if (text === '基本情報') {
      element.textContent = 'Basic Information';
    } else if (text === '電話番号認証') {
      element.textContent = 'Phone Verification';
    } else if (text === '身分証明書の確認') {
      element.textContent = 'Identity Verification';
    }
  });
  
  // ラベルの翻訳
  const labels = modal.querySelectorAll('label, .form-label');
  labels.forEach(function(label) {
    const text = label.textContent.trim();
    // 基本情報
    if (text.includes('氏名')) {
      label.textContent = 'Full Name *';
    } else if (text.includes('ユーザー名')) {
      label.textContent = 'Username *';
    } else if (text.includes('メールアドレス')) {
      label.textContent = 'Email Address *';
    } else if (text.includes('パスワード')) {
      label.textContent = 'Password *';
    } else if (text.includes('活動エリア')) {
      label.textContent = 'Activity Area *';
    } else if (text.includes('対応言語')) {
      label.textContent = 'Languages *';
    } else if (text.includes('得意分野・テーマ')) {
      label.textContent = 'Specialties & Themes *';
    } else if (text.includes('自己紹介文')) {
      label.textContent = 'Self Introduction *';
    } else if (text.includes('自己紹介（英語）')) {
      label.textContent = 'Self Introduction (English) *';
    } else if (text.includes('ガイド料金')) {
      label.textContent = 'Guide Fee *';
    } else if (text.includes('プロフィール写真')) {
      label.textContent = 'Profile Photo *';
    } else if (text.includes('電話番号')) {
      label.textContent = 'Phone Number *';
    } else if (text.includes('認証コード')) {
      label.textContent = 'Verification Code *';
    } else if (text.includes('身分証明書の種類')) {
      label.textContent = 'Identity Document Type *';
    } else if (text.includes('身分証明書（表面）')) {
      label.textContent = 'Identity Document (Front) *';
    } else if (text.includes('身分証明書（裏面）')) {
      label.textContent = 'Identity Document (Back) *';
    }
  });
  
  // 説明文の翻訳
  const helperTexts = modal.querySelectorAll('.form-text, small, .text-muted, .helper-text');
  helperTexts.forEach(function(element) {
    const text = element.textContent.trim();
    if (text.includes('プロフィールURLに使用')) {
      element.textContent = 'Used for your profile URL';
    } else if (text.includes('8文字以上で、英数字')) {
      element.textContent = 'At least 8 characters including letters and numbers';
    } else if (text.includes('Ctrlキーを押しながら')) {
      element.textContent = 'Hold Ctrl key to select multiple options';
    } else if (text.includes('最低でも6,000円以上')) {
      element.textContent = 'Set at least 6,000 yen or more';
    } else if (text.includes('JPG, PNG形式のみ')) {
      element.textContent = 'JPG, PNG format only, under 5MB';
    } else if (text.includes('先頭の0は除く')) {
      element.textContent = 'Exclude leading 0';
    } else if (text.includes('ハイフンなしで入力')) {
      element.textContent = 'Enter without hyphens';
    } else if (text.includes('SMSに送信された6桁のコード')) {
      element.textContent = '6-digit code sent to your SMS';
    } else if (text.includes('例：東京都新宿区')) {
      element.textContent = 'Example: Shinjuku, Tokyo';
    }
  });
  
  // ボタンの翻訳
  const buttons = modal.querySelectorAll('button, .btn');
  buttons.forEach(function(button) {
    const text = button.textContent.trim();
    if (text === '認証コード送信') {
      button.textContent = 'Send Code';
    } else if (text === '認証する') {
      button.textContent = 'Verify';
    } else if (text === 'ファイルの選択') {
      button.textContent = 'Choose File';
    } else if (text === 'プロフィール写真') {
      button.textContent = 'Profile Photo';
    } else if (text === 'カメラで撮影') {
      button.textContent = 'Take Photo';
    } else if (text === '登録する') {
      button.textContent = 'Register';
    }
  });
  
  // 選択肢オプションの翻訳
  const options = modal.querySelectorAll('select option');
  options.forEach(function(option) {
    const text = option.textContent.trim();
    if (text === '選択してください') {
      option.textContent = 'Please select';
    } else if (text === '運転免許証') {
      option.textContent = 'Driver\'s License';
    } else if (text === 'パスポート') {
      option.textContent = 'Passport';
    } else if (text === 'マイナンバーカード') {
      option.textContent = 'My Number Card';
    } else if (text === '健康保険証') {
      option.textContent = 'Health Insurance Card';
    } else if (text === '日本語') {
      option.textContent = 'Japanese';
    } else if (text === '英語') {
      option.textContent = 'English';
    } else if (text === '中国語') {
      option.textContent = 'Chinese';
    } else if (text === '韓国語') {
      option.textContent = 'Korean';
    } else if (text === 'フランス語') {
      option.textContent = 'French';
    } else if (text === 'ドイツ語') {
      option.textContent = 'German';
    } else if (text === 'スペイン語') {
      option.textContent = 'Spanish';
    }
  });
  
  // チェックボックスラベルの翻訳
  const checkboxLabels = modal.querySelectorAll('.form-check-label');
  checkboxLabels.forEach(function(label) {
    const text = label.textContent.trim();
    if (text.includes('利用規約') && text.includes('プライバシーポリシー')) {
      label.innerHTML = label.innerHTML
        .replace('利用規約', 'Terms of Service')
        .replace('プライバシーポリシー', 'Privacy Policy')
        .replace('ガイドラインポリシー', 'Guideline Policy')
        .replace('に同意します', 'I agree to the');
    }
  });
  
  // プレースホルダーの翻訳
  const inputs = modal.querySelectorAll('input, textarea');
  inputs.forEach(function(input) {
    if (input.placeholder) {
      if (input.placeholder.includes('SMSに送信された6桁のコード')) {
        input.placeholder = '6-digit code sent to your SMS';
      } else if (input.placeholder.includes('先頭の0は除く')) {
        input.placeholder = 'Exclude leading 0';
      } else if (input.placeholder.includes('例：東京都新宿区')) {
        input.placeholder = 'Example: Shinjuku, Tokyo';
      } else if (input.placeholder === 'ファイルが選択されていません') {
        input.placeholder = 'No file selected';
      }
    }
  });
}

/**
 * 現在の言語設定を取得
 * @returns {string} 言語コード('en'または'ja')
 */
function getCurrentLanguage() {
  // 新翻訳システムの関数がある場合はそれを使用
  if (typeof window.getCurrentLanguage === 'function') {
    return window.getCurrentLanguage();
  }
  // なければローカルストレージから直接取得
  return localStorage.getItem('selectedLanguage') || 'ja';
}

// 言語切り替えイベントを送信する関数（既存の言語スイッチャーと連携するため）
function dispatchLanguageChangeEvent(lang) {
  const event = new CustomEvent('languageChanged', {
    detail: { language: lang }
  });
  document.dispatchEvent(event);
}

// 既存の言語切り替え機能を拡張
(function extendExistingLanguageSwitcher() {
  // translatePage関数の拡張（新翻訳システム）
  if (typeof window.translatePage === 'function') {
    const originalTranslatePage = window.translatePage;
    window.translatePage = function(lang) {
      originalTranslatePage(lang);
      dispatchLanguageChangeEvent(lang);
    };
  }
  
  // applyLanguage関数の拡張（共有言語ユーティリティ）
  if (typeof window.applyLanguage === 'function') {
    const originalApplyLanguage = window.applyLanguage;
    window.applyLanguage = function(lang) {
      originalApplyLanguage(lang);
      dispatchLanguageChangeEvent(lang);
    };
  }
})();