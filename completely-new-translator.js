/**
 * 完全に新しい翻訳システム
 * エラーを起こさない安全な実装
 */

(function() {
  // グローバル実行フラグ
  if (window.newTranslatorLoaded) {
    console.log('新しい翻訳システムは既に読み込まれています');
    return;
  }
  
  // グローバルフラグを設定
  window.newTranslatorLoaded = true;
  
  console.log('完全に新しい翻訳システムを初期化します');
  
  // 翻訳データをハードコード - 最低限の必須項目のみ
  const fallbackTranslations = {
    en: {
      // ナビゲーション
      'ホーム': 'Home',
      'ガイドを探す': 'Find Guides',
      '使い方': 'How It Works',
      'ログイン': 'Login',
      '新規登録': 'Sign Up',
      'マイページ': 'My Page',
      'ログアウト': 'Logout',
      '観光客として登録': 'Register as Tourist',
      'ガイドとして登録': 'Register as Guide',
      'お問い合わせ': 'Contact Us',
      '日本語': 'Japanese',
      'English': 'English',
      
      // フォーム関連
      'ユーザー名': 'Username',
      'メールアドレス': 'Email',
      'パスワード': 'Password',
      'パスワード確認': 'Confirm Password',
      '次へ': 'Next',
      '戻る': 'Back',
      '送信': 'Submit',
      '登録': 'Register',
      '写真をアップロード': 'Upload Photo',
      '電話番号': 'Phone Number',
      '認証': 'Verify',
      '認証済み': 'Verified',
      '未認証': 'Unverified',
      'コードを送信': 'Send Code',
      '確認コードを入力': 'Enter Verification Code',
      'コードを確認': 'Verify Code',
      
      // ガイド関連
      'ガイド': 'Guide',
      'ガイドプロフィール': 'Guide Profile',
      '得意分野': 'Specialties',
      'ガイドエリア': 'Guide Area',
      '言語': 'Languages',
      '料金': 'Price',
      'レビュー': 'Reviews',
      '予約可能日': 'Available Dates',
      '写真ギャラリー': 'Photo Gallery',
      '自己紹介': 'About Me',
      'あなただけの特別な旅を': 'Your Special Journey',
      '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you won\'t find in regular tours',
      
      // フィルター関連
      'フィルター': 'Filter',
      '地域': 'Region',
      'キーワード': 'Keywords',
      '検索': 'Search',
      'クリア': 'Clear',
      '適用': 'Apply',
      '並び替え': 'Sort',
      '人気順': 'Popularity',
      '料金安い順': 'Price Low to High',
      '料金高い順': 'Price High to Low',
      'レビュー高評価順': 'Highest Rated',
      
      // エラーメッセージ
      'ログインに失敗しました': 'Login failed',
      '登録に失敗しました': 'Registration failed',
      '必須項目を入力してください': 'Please fill in all required fields',
      'パスワードが一致しません': 'Passwords do not match',
      '電話番号の形式が正しくありません': 'Invalid phone number format',
      
      // 成功メッセージ
      '登録が完了しました': 'Registration complete',
      'ログインしました': 'Logged in successfully',
      'コードを送信しました': 'Code sent',
      '認証が完了しました': 'Verification complete'
    }
  };
  
  /**
   * 現在の言語を取得
   */
  function getCurrentLanguage() {
    try {
      return localStorage.getItem('selectedLanguage') || 'ja';
    } catch (e) {
      console.error('言語設定の取得に失敗:', e);
      return 'ja';
    }
  }
  
  /**
   * 言語を変更
   */
  function setLanguage(lang) {
    try {
      localStorage.setItem('selectedLanguage', lang);
      console.log(`言語を${lang}に設定しました`);
      return true;
    } catch (e) {
      console.error('言語設定の保存に失敗:', e);
      return false;
    }
  }
  
  /**
   * テキストを翻訳
   */
  function translate(text, lang) {
    // パラメータが無効な場合は元のテキストを返す
    if (!text) return '';
    if (!lang) lang = getCurrentLanguage();
    
    // 日本語の場合は翻訳しない
    if (lang === 'ja') return text;
    
    // 翻訳データソースを選択
    let translationSource = null;
    
    // 優先順位1: window.translationData (重大エラー修正スクリプトにより安全に初期化されたもの)
    if (window.translationData && window.translationData.en) {
      translationSource = window.translationData.en;
    } 
    // 優先順位2: fallbackTranslations (ハードコードされた最小限のデータセット)
    else {
      translationSource = fallbackTranslations.en;
    }
    
    // 対応する翻訳を検索
    try {
      // カテゴリ別に検索する場合
      if (typeof translationSource === 'object' && !Array.isArray(translationSource)) {
        // モダンなネストされたオブジェクト形式の場合
        if (Object.keys(translationSource).some(key => typeof translationSource[key] === 'object')) {
          for (const category in translationSource) {
            if (translationSource[category] && translationSource[category][text]) {
              return translationSource[category][text];
            }
          }
        } 
        // フラットなキー/バリュー形式の場合
        else if (translationSource[text]) {
          return translationSource[text];
        }
      }
      
      // 翻訳がどこにも見つからなかった場合
      return text;
    } catch (e) {
      console.error('翻訳検索中にエラーが発生:', e);
      return text;
    }
  }
  
  /**
   * ページ全体を翻訳
   */
  function translatePage(lang) {
    try {
      // パラメータチェック
      if (!lang) lang = getCurrentLanguage();
      
      // 日本語の場合は処理不要
      if (lang === 'ja') return;
      
      console.log(`ページを${lang}に翻訳します`);
      
      // 言語設定を保存
      setLanguage(lang);
      
      // ページ内のすべてのテキストノードを処理
      translateAllTextNodes(document.body, lang);
      
      // 特定の属性を持つ要素を処理
      translateSpecialElements(lang);
      
      // 言語ドロップダウンの表示を更新
      updateLanguageDropdown(lang);
      
      console.log('ページの翻訳が完了しました');
    } catch (e) {
      console.error('ページ翻訳中にエラーが発生:', e);
    }
  }
  
  /**
   * すべてのテキストノードを翻訳
   */
  function translateAllTextNodes(element, lang) {
    if (!element) return;
    
    try {
      // 要素内のすべてのテキストノードを取得
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        { acceptNode: node => node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT },
        false
      );
      
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      
      // 各テキストノードを翻訳
      textNodes.forEach(node => {
        const originalText = node.nodeValue.trim();
        if (originalText) {
          const translated = translate(originalText, lang);
          if (translated !== originalText) {
            node.nodeValue = node.nodeValue.replace(originalText, translated);
          }
        }
      });
    } catch (e) {
      console.error('テキストノード翻訳中にエラーが発生:', e);
    }
  }
  
  /**
   * 特殊な要素（属性ベースなど）を翻訳
   */
  function translateSpecialElements(lang) {
    try {
      // data-translate 属性を持つ要素
      const elementsWithTranslateAttr = document.querySelectorAll('[data-translate]');
      elementsWithTranslateAttr.forEach(el => {
        const key = el.getAttribute('data-translate');
        const translated = translate(key, lang);
        if (translated) el.textContent = translated;
      });
      
      // プレースホルダ属性の翻訳
      const inputsWithPlaceholder = document.querySelectorAll('input[placeholder], textarea[placeholder]');
      inputsWithPlaceholder.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) {
          const translatedPlaceholder = translate(placeholder, lang);
          input.setAttribute('placeholder', translatedPlaceholder);
        }
      });
      
      // ボタンテキストの翻訳
      const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
      buttons.forEach(button => {
        if (button.value) {
          const translatedValue = translate(button.value, lang);
          button.value = translatedValue;
        }
        if (button.textContent && button.textContent.trim()) {
          const originalText = button.textContent.trim();
          const translatedText = translate(originalText, lang);
          if (translatedText !== originalText) {
            button.textContent = button.textContent.replace(originalText, translatedText);
          }
        }
      });
    } catch (e) {
      console.error('特殊要素の翻訳中にエラーが発生:', e);
    }
  }
  
  /**
   * 言語ドロップダウンの表示を更新
   */
  function updateLanguageDropdown(lang) {
    try {
      const dropdown = document.getElementById('languageDropdown');
      if (dropdown) {
        dropdown.textContent = lang === 'ja' ? '日本語' : 'English';
      }
    } catch (e) {
      console.error('言語ドロップダウン更新中にエラーが発生:', e);
    }
  }
  
  /**
   * 言語変更イベントを処理
   */
  function setupLanguageSwitcher() {
    try {
      // 言語切り替えリンクを見つける
      const languageLinks = document.querySelectorAll('[data-lang]');
      
      languageLinks.forEach(link => {
        // 既存のイベントリスナーを削除（重複防止）
        link.removeEventListener('click', handleLanguageChange);
        // 新しいイベントリスナーを追加
        link.addEventListener('click', handleLanguageChange);
      });
      
      console.log('言語切り替えリンクを設定しました:', languageLinks.length);
    } catch (e) {
      console.error('言語切り替え設定中にエラーが発生:', e);
    }
  }
  
  /**
   * 言語変更クリックイベントのハンドラ
   */
  function handleLanguageChange(event) {
    try {
      event.preventDefault();
      
      const lang = this.getAttribute('data-lang');
      if (!lang) return;
      
      console.log('言語を変更します:', lang);
      
      // 現在と同じ言語が選択された場合は何もしない
      if (lang === getCurrentLanguage()) return;
      
      // ページ全体を翻訳
      translatePage(lang);
      
      // 言語変更イベントを発行（他のスクリプト用）
      const languageEvent = new CustomEvent('languageChanged', { detail: { language: lang } });
      document.dispatchEvent(languageEvent);
    } catch (e) {
      console.error('言語変更処理中にエラーが発生:', e);
    }
  }
  
  // 初期化処理を実行
  function init() {
    // すぐに実行する処理
    setupLanguageSwitcher();
    
    // 現在の言語を取得
    const currentLang = getCurrentLanguage();
    
    // 日本語以外の場合はページを翻訳
    if (currentLang !== 'ja') {
      // 少し遅延してDOMがロードされたことを確認
      setTimeout(() => {
        translatePage(currentLang);
      }, 100);
    }
    
    console.log('新しい翻訳システムの初期化が完了しました');
  }
  
  // DOMの準備ができたら初期化を実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // すでにDOMが読み込まれている場合は直接実行
    init();
  }
  
  // グローバル関数としてエクスポート
  window.translator = {
    translate: translate,
    translatePage: translatePage,
    getCurrentLanguage: getCurrentLanguage,
    setLanguage: setLanguage
  };
})();