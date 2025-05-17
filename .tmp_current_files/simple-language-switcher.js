/**
 * シンプルな言語切り替え機能
 * 翻訳の即時反映と安定性を重視した実装
 */

// 言語切り替え機能の初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('シンプル言語切り替え機能を初期化します');
  
  // 言語データの定義
  const translations = {
    'ja': {
      // ナビゲーション
      'nav-home': 'ホーム',
      'nav-find-guides': 'ガイドを探す',
      'nav-how-it-works': '使い方',
      'login-btn': 'ログイン',
      'register-btn': '新規登録',
      'language-name': '日本語',
      
      // 基本情報タブ
      'basic-info': '基本情報',
      'fullname': '氏名',
      'username': 'ユーザー名',
      'profile-url-note': 'プロフィールURLに使用されます',
      'email-address': 'メールアドレス',
      'activity-area': '活動エリア',
      'activity-area-placeholder': '例：東京都新宿区',
      'supported-languages': '対応言語',
      'self-introduction': '自己紹介',
      'self-introduction-placeholder': 'あなた自身やガイドとしての特徴などを記入してください',
      'session-fee': 'セッション料金（1回あたり）',
      'fee-description': '標準料金は¥6,000/回です。料金を高く設定すると予約が少なくなる可能性があります。',
      'specialties': '得意分野・興味',
      'other-keywords': 'その他のキーワードを入力（コンマ区切りで複数入力可）',
      'save-changes': '保存する',

      // キーワード
      'keyword-night': 'ナイトツアー',
      'keyword-food': 'グルメ',
      'keyword-photo': '写真スポット',
      'keyword-cooking': '料理',
      'keyword-activity': 'アクティビティ',
      
      // プロフィール管理
      'profile-management': 'ガイドプロフィール管理',
      'photo-gallery': '写真ギャラリー',
      'schedule': 'スケジュール',
      'messages': 'メッセージ',
      'account-settings': 'アカウント設定',
      
      // ギャラリー
      'gallery-description': 'あなたの活動や案内できる場所の写真をアップロードしてください。最大15枚まで設定可能です。',
      'add-photo': '写真を追加',
      
      // スケジュール
      'schedule-settings': '活動可能時間設定',
      'schedule-description': '各曜日に活動可能な時間帯を設定してください。',
      'day-available': 'この曜日は活動可能',
      'start-time': '開始時間',
      'end-time': '終了時間',
      'save-schedule': 'スケジュールを保存',
      
      // メッセージ
      'inbox': '受信箱',
      'sent': '送信済み',
      'no-messages': 'メッセージはありません',
      'no-sent-messages': '送信済みメッセージはありません',
      
      // アカウント設定
      'current-password': '現在のパスワード',
      'new-password': '新しいパスワード',
      'confirm-password': 'パスワード確認',
      'password-requirements': '8文字以上で、英数字を含めてください',
      'change-password': 'パスワードを変更',
      'notification-settings': '通知設定',
      'email-notifications': '新しいメッセージがあった場合にメール通知を受け取る',
      'booking-notifications': '新しい予約があった場合にメール通知を受け取る',
      'account-deletion': 'アカウント削除',
      'delete-account-warning': 'アカウントを削除すると、すべての情報が完全に削除されます。この操作は取り消せません。',
      'delete-account': 'アカウントを削除する'
    },
    'en': {
      // Navigation
      'nav-home': 'Home',
      'nav-find-guides': 'Find Guides',
      'nav-how-it-works': 'How it Works',
      'login-btn': 'Login',
      'register-btn': 'Register',
      'language-name': 'English',
      
      // Basic Info
      'basic-info': 'Basic Information',
      'fullname': 'Full Name',
      'username': 'Username',
      'profile-url-note': 'This will be used in your profile URL',
      'email-address': 'Email Address',
      'activity-area': 'Activity Area',
      'activity-area-placeholder': 'e.g., Shinjuku, Tokyo',
      'supported-languages': 'Supported Languages',
      'self-introduction': 'Self Introduction',
      'self-introduction-placeholder': 'Please describe yourself and your characteristics as a guide',
      'session-fee': 'Session Fee (per session)',
      'fee-description': 'The standard fee is ¥6,000/session. Setting a higher fee may result in fewer bookings.',
      'specialties': 'Specialties & Interests',
      'other-keywords': 'Enter other keywords (separate multiple with commas)',
      'save-changes': 'Save Changes',

      // Keywords
      'keyword-night': 'Night Tours',
      'keyword-food': 'Gourmet',
      'keyword-photo': 'Photo Spots',
      'keyword-cooking': 'Cooking',
      'keyword-activity': 'Activities',
      
      // Profile Management
      'profile-management': 'Guide Profile Management',
      'photo-gallery': 'Photo Gallery',
      'schedule': 'Schedule',
      'messages': 'Messages',
      'account-settings': 'Account Settings',
      
      // Gallery
      'gallery-description': 'Upload photos of your activities and places you can guide. You can set up to 15 photos.',
      'add-photo': 'Add Photo',
      
      // Schedule
      'schedule-settings': 'Available Time Settings',
      'schedule-description': 'Set your available times for each day of the week.',
      'day-available': 'Available on this day',
      'start-time': 'Start Time',
      'end-time': 'End Time',
      'save-schedule': 'Save Schedule',
      
      // Messages
      'inbox': 'Inbox',
      'sent': 'Sent',
      'no-messages': 'No messages',
      'no-sent-messages': 'No sent messages',
      
      // Account Settings
      'current-password': 'Current Password',
      'new-password': 'New Password',
      'confirm-password': 'Confirm Password',
      'password-requirements': 'Must be at least 8 characters with letters and numbers',
      'change-password': 'Change Password',
      'notification-settings': 'Notification Settings',
      'email-notifications': 'Receive email notifications for new messages',
      'booking-notifications': 'Receive email notifications for new bookings',
      'account-deletion': 'Account Deletion',
      'delete-account-warning': 'Deleting your account will permanently remove all of your information. This action cannot be undone.',
      'delete-account': 'Delete Account'
    }
  };

  // 現在選択されている言語
  let currentLanguage = localStorage.getItem('user_language') || 'ja';
  
  // 言語ドロップダウンのセットアップ
  const languageLinks = document.querySelectorAll('.dropdown-item[data-lang]');
  if (languageLinks.length > 0) {
    console.log(`${languageLinks.length}個の言語リンクを設定します`);
    
    // クリックイベントハンドラを設定
    languageLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.getAttribute('data-lang');
        console.log(`言語切り替えクリック: ${lang}に切り替えます`);
        changeLanguage(lang);
      });
    });
  }
  
  // 言語を変更する関数
  function changeLanguage(lang) {
    console.log(`言語を${lang}に変更します`);
    
    if (lang === currentLanguage) {
      console.log('既に同じ言語です、何もしません');
      return;
    }
    
    // 言語を更新
    currentLanguage = lang;
    localStorage.setItem('user_language', lang);
    
    // 言語ドロップダウンを更新
    const dropdownButton = document.getElementById('languageDropdown');
    if (dropdownButton) {
      dropdownButton.textContent = translations[lang]['language-name'];
    }
    
    // すべてのdata-key要素を翻訳
    const elementsWithDataKey = document.querySelectorAll('[data-key]');
    console.log(`${elementsWithDataKey.length}個のdata-key要素を翻訳します`);
    
    elementsWithDataKey.forEach(element => {
      const key = element.getAttribute('data-key');
      if (translations[lang][key]) {
        element.textContent = translations[lang][key];
      } else {
        console.warn(`警告: 「${key}」の翻訳が見つかりません`);
      }
    });
    
    // プレースホルダーの翻訳
    document.querySelectorAll('[placeholder]').forEach(element => {
      const key = element.getAttribute('data-key');
      if (key && translations[lang][key]) {
        element.placeholder = translations[lang][key];
      }
    });
    
    console.log('言語の切り替えが完了しました');
  }

  // ページ読み込み時に自動的に適用
  changeLanguage(currentLanguage);
});