/**
 * 全ページ対応統一多言語システム
 * 既存の翻訳データと連携して全HTMLページで動作する
 */

(function() {
  'use strict';

  // 翻訳データが読み込まれるまで待機
  function waitForTranslationData(callback) {
    const checkInterval = setInterval(() => {
      if (window.translationData && window.translateText) {
        clearInterval(checkInterval);
        callback();
      }
    }, 100);
    
    // 10秒後にタイムアウト
    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('翻訳データの読み込みに時間がかかっています');
      callback();
    }, 10000);
  }

  // 言語切り替えUI要素を探す
  function findLanguageElements() {
    return {
      englishBtn: document.querySelector('.dropdown-item[data-lang="en"], [data-lang="en"], #language-en, .lang-en'),
      japaneseBtn: document.querySelector('.dropdown-item[data-lang="ja"], [data-lang="ja"], #language-ja, .lang-ja'),
      languageDropdown: document.querySelector('#languageDropdown, .language-dropdown, .lang-dropdown')
    };
  }

  // 現在の言語を取得
  function getCurrentLanguage() {
    return localStorage.getItem('selectedLanguage') || 'ja';
  }

  // 言語を設定
  function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    updatePageLanguage(lang);
    updateLanguageUI(lang);
  }

  // 言語UIの更新
  function updateLanguageUI(lang) {
    const { languageDropdown } = findLanguageElements();
    if (languageDropdown) {
      languageDropdown.textContent = lang === 'en' ? 'English' : '日本語';
    }
  }

  // ページ全体の言語を更新
  function updatePageLanguage(lang) {
    if (lang === 'ja') {
      // 日本語の場合はページをリロード
      if (getCurrentLanguage() !== 'ja') {
        location.reload();
      }
      return;
    }

    // 英語翻訳を実行
    translatePageToEnglish();
  }

  // 英語翻訳を実行
  function translatePageToEnglish() {
    // ページタイトルの翻訳
    translatePageTitle();
    
    // ナビゲーションの翻訳
    translateNavigation();
    
    // ボタンとリンクの翻訳
    translateButtons();
    
    // セクションタイトルの翻訳
    translateSectionTitles();
    
    // フォーム要素の翻訳
    translateFormElements();
    
    // カード要素の翻訳
    translateCards();
    
    // テーブルの翻訳
    translateTables();
    
    // その他のテキスト要素
    translateMiscellaneous();
  }

  // ページタイトルの翻訳
  function translatePageTitle() {
    const title = document.title;
    if (window.translateText) {
      document.title = window.translateText('en', title);
    } else {
      // フォールバック翻訳
      if (title.includes('Local Guide')) {
        document.title = 'Local Guide - Experience Special Journeys';
      }
    }
  }

  // ナビゲーションの翻訳
  function translateNavigation() {
    // ナビゲーションリンク
    document.querySelectorAll('.navbar-nav .nav-link, .nav-link').forEach((link, index) => {
      const text = link.textContent.trim();
      if (window.translateText) {
        link.textContent = window.translateText('en', text);
      } else {
        // フォールバック翻訳
        if (text === 'ホーム') link.textContent = 'Home';
        else if (text === 'ガイドを探す') link.textContent = 'Find Guides';
        else if (text === '使い方') link.textContent = 'How to Use';
        else if (text === 'お問い合わせ') link.textContent = 'Contact';
      }
    });

    // ドロップダウンメニュー項目
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
      const title = item.querySelector('.fw-bold');
      const desc = item.querySelector('.small, .text-muted');
      
      if (title && title.textContent.includes('旅行者として登録')) {
        title.textContent = 'Register as Tourist';
        if (desc) desc.textContent = 'Experience unique trips with local guides';
      } else if (title && title.textContent.includes('ガイドとして登録')) {
        title.textContent = 'Register as Guide';
        if (desc) desc.textContent = 'Share your knowledge and experience';
      }
    });
  }

  // ボタンとリンクの翻訳
  function translateButtons() {
    document.querySelectorAll('button, .btn, a.btn').forEach(btn => {
      const text = btn.textContent.trim();
      if (window.translateText) {
        btn.textContent = window.translateText('en', text);
      } else {
        // フォールバック翻訳
        if (text === 'ログイン') btn.textContent = 'Login';
        else if (text === '新規登録') btn.textContent = 'Register';
        else if (text === 'ガイドを探す') btn.textContent = 'Find Guides';
        else if (text === 'お問い合わせ') btn.textContent = 'Contact Us';
        else if (text === '詳細を見る') btn.textContent = 'See Details';
        else if (text === 'もっと見る') btn.textContent = 'See More';
        else if (text === 'リセット') btn.textContent = 'Reset';
        else if (text === '検索') btn.textContent = 'Search';
        else if (text === '送信') btn.textContent = 'Submit';
        else if (text === '保存') btn.textContent = 'Save';
        else if (text === 'キャンセル') btn.textContent = 'Cancel';
        else if (text === '削除') btn.textContent = 'Delete';
        else if (text === '編集') btn.textContent = 'Edit';
        else if (text === '予約する') btn.textContent = 'Book Now';
      }
    });
  }

  // セクションタイトルの翻訳
  function translateSectionTitles() {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, .section-title').forEach(title => {
      const text = title.textContent.trim();
      if (window.translateText) {
        title.textContent = window.translateText('en', text);
      } else {
        // フォールバック翻訳
        if (text === '人気のガイド') title.textContent = 'Popular Guides';
        else if (text === '使い方') title.textContent = 'How It Works';
        else if (text === 'ガイドとして活躍') title.textContent = 'Benefits of Being a Guide';
        else if (text === '協賛パートナー') title.textContent = 'Sponsor Partners';
        else if (text === 'プロフィール') title.textContent = 'Profile';
        else if (text === 'アカウント設定') title.textContent = 'Account Settings';
        else if (text === 'ダッシュボード') title.textContent = 'Dashboard';
        else if (text === '管理者') title.textContent = 'Administrator';
      }
    });
  }

  // フォーム要素の翻訳
  function translateFormElements() {
    // ラベル
    document.querySelectorAll('label, .form-label').forEach(label => {
      const text = label.textContent.trim();
      if (window.translateText) {
        label.textContent = window.translateText('en', text);
      } else {
        // フォールバック翻訳
        if (text === '地域') label.textContent = 'Region';
        else if (text === '言語') label.textContent = 'Language';
        else if (text === '料金') label.textContent = 'Fee';
        else if (text === 'キーワード') label.textContent = 'Keywords';
        else if (text === '名前') label.textContent = 'Name';
        else if (text === 'メールアドレス') label.textContent = 'Email';
        else if (text === 'パスワード') label.textContent = 'Password';
        else if (text === '電話番号') label.textContent = 'Phone Number';
      }
    });

    // プレースホルダー
    document.querySelectorAll('input, textarea, select').forEach(input => {
      if (input.placeholder) {
        const placeholder = input.placeholder;
        if (window.translateText) {
          input.placeholder = window.translateText('en', placeholder);
        } else {
          // フォールバック翻訳
          if (placeholder.includes('キーワードを入力')) {
            input.placeholder = 'Enter keywords (separate with commas)';
          } else if (placeholder.includes('検索')) {
            input.placeholder = 'Search...';
          }
        }
      }
    });

    // セレクトオプション
    document.querySelectorAll('select option').forEach(option => {
      const text = option.textContent.trim();
      if (text === 'すべて') option.textContent = 'All';
      else if (window.translateText) {
        option.textContent = window.translateText('en', text);
      }
    });
  }

  // カード要素の翻訳
  function translateCards() {
    document.querySelectorAll('.card').forEach(card => {
      // カードタイトル
      const titles = card.querySelectorAll('.card-title, .card-header h5, h5, h4');
      titles.forEach(title => {
        const text = title.textContent.trim();
        if (window.translateText) {
          title.textContent = window.translateText('en', text);
        }
      });

      // カード内の段落
      const paragraphs = card.querySelectorAll('p');
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (window.translateText) {
          p.textContent = window.translateText('en', text);
        }
      });

      // 言語表示の翻訳
      const langTexts = card.querySelectorAll('.small, small');
      langTexts.forEach(text => {
        if (text.textContent.includes('言語:')) {
          text.textContent = text.textContent
            .replace('言語:', 'Languages:')
            .replace('日本語', 'Japanese')
            .replace('英語', 'English')
            .replace('中国語', 'Chinese');
        }
      });
    });
  }

  // テーブルの翻訳
  function translateTables() {
    document.querySelectorAll('table th, table td').forEach(cell => {
      const text = cell.textContent.trim();
      if (window.translateText) {
        cell.textContent = window.translateText('en', text);
      }
    });
  }

  // その他のテキスト要素の翻訳
  function translateMiscellaneous() {
    // バッジ
    document.querySelectorAll('.badge').forEach(badge => {
      const text = badge.textContent.trim();
      if (text === '認証済み') badge.textContent = 'Verified';
      else if (window.translateText) {
        badge.textContent = window.translateText('en', text);
      }
    });

    // フッター
    document.querySelectorAll('footer p, .footer p').forEach(p => {
      const text = p.textContent.trim();
      if (window.translateText) {
        p.textContent = window.translateText('en', text);
      }
    });
  }

  // イベントリスナーの設定
  function setupEventListeners() {
    const { englishBtn, japaneseBtn } = findLanguageElements();

    if (englishBtn) {
      englishBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語に切り替え');
        setLanguage('en');
      });
    }

    if (japaneseBtn) {
      japaneseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('日本語に切り替え');
        setLanguage('ja');
      });
    }
  }

  // 初期化
  function init() {
    console.log('統一多言語システムを初期化');
    
    waitForTranslationData(() => {
      setupEventListeners();
      
      // 保存された言語設定を復元
      const savedLanguage = getCurrentLanguage();
      if (savedLanguage === 'en') {
        console.log('英語モードを復元');
        updatePageLanguage('en');
        updateLanguageUI('en');
      }
    });
  }

  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // グローバル関数として公開
  window.setUniversalLanguage = setLanguage;
  window.getCurrentUniversalLanguage = getCurrentLanguage;

})();