/**
 * 翻訳データ一元管理ファイル - エラー修正版
 * サイト全体で使用する翻訳テキストを一か所で管理します
 */

// 翻訳データオブジェクトをグローバルに定義（重複宣言を防止）
window.translationData = window.translationData || {
  // 英語翻訳データ
  en: {
    // ナビゲーション要素
    'navigation': {
      'ホーム': 'Home',
      'ガイドを探す': 'Find Guides',
      '使い方': 'How It Works',
      'ログイン': 'Login',
      '新規登録': 'Sign Up',
      'マイページ': 'My Page',
      'ログアウト': 'Logout',
      'お問い合わせ': 'Contact Us'
    },
    
    // ヒーローセクション
    'hero': {
      'あなただけの特別な旅を': 'Your Special Journey Awaits',
      '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours'
    },
    
    // ボタンとアクション
    'buttons': {
      'ガイドを探す': 'Find Guides',
      'もっと見る': 'See More',
      '詳細を見る': 'See Details',
      '予約する': 'Book Now',
      'メッセージを送る': 'Send Message',
      '検索': 'Search',
      'リセット': 'Reset',
      '登録する': 'Register',
      '送信': 'Submit',
      '更新': 'Update',
      '削除': 'Delete',
      '保存': 'Save',
      'キャンセル': 'Cancel'
    },
    
    // セクションタイトル
    'sections': {
      '人気のガイド': 'Popular Guides',
      '使い方': 'How It Works',
      'ガイドとして活躍': 'Benefits of Being a Guide',
      'ガイドになる': 'Become a Guide',
      'プロフィール': 'Profile',
      '写真ギャラリー': 'Photo Gallery',
      'レビュー': 'Reviews',
      '予約': 'Bookings',
      'メッセージ': 'Messages',
      '設定': 'Settings'
    },
    
    // 使い方セクション
    'howToUse': {
      'ガイドを探す': 'Find a Guide',
      'メッセージで問い合わせ': 'Send a Message',
      '予約を確定': 'Confirm Booking',
      '現地で会う': 'Meet in Person',
      'ガイドを探して、あなたの希望に合った人を見つけましょう': 'Search for guides and find someone who matches your preferences',
      'ガイドに質問や希望を直接メッセージで伝えましょう': 'Send direct messages to ask questions or communicate your wishes',
      '日程と内容を決めて、予約を確定させましょう': 'Decide on the date and plan, then confirm your booking',
      '当日は指定された場所で会って、特別な時間を過ごしましょう': 'On the day, meet at the designated place and enjoy a special experience'
    },
    
    // ガイドになる利点
    'benefits': {
      '追加の収入源': 'Additional Income',
      '柔軟なスケジュール': 'Flexible Schedule',
      '新しい出会い': 'New Connections',
      'あなたの専門知識を活かして、追加の収入を得ることができます': 'Earn extra income by utilizing your expertise',
      '自分の都合に合わせて活動時間を設定できます': 'Set your activity hours according to your convenience',
      '世界中からの訪問者と出会い、文化交流ができます': 'Meet visitors from around the world and engage in cultural exchange',
      'ガイドになって地元の魅力を伝えませんか？': 'Would you like to become a guide and share the charm of your local area?'
    },
    
    // フォーム関連
    'forms': {
      'ユーザー名': 'Username',
      'メールアドレス': 'Email Address',
      'パスワード': 'Password',
      '確認用パスワード': 'Confirm Password',
      '電話番号': 'Phone Number',
      '生年月日': 'Date of Birth',
      '名前': 'Name',
      '姓': 'Last Name',
      '名': 'First Name',
      '住所': 'Address',
      '都道府県': 'Prefecture',
      '市区町村': 'City/Ward',
      '番地・建物名': 'Street Address/Building',
      '郵便番号': 'Postal Code',
      '自己紹介': 'Self Introduction',
      '対応可能言語': 'Languages Spoken',
      'ガイド可能地域': 'Guide Areas',
      'カテゴリー': 'Categories',
      '予約可能日': 'Available Dates',
      '1時間あたりの料金': 'Hourly Rate',
      '写真': 'Photo',
      '性別': 'Gender',
      '男性': 'Male',
      '女性': 'Female',
      'その他': 'Other',
      '回答しない': 'Prefer not to say',
      '利用規約に同意する': 'I agree to the Terms of Service',
      'プライバシーポリシーに同意する': 'I agree to the Privacy Policy'
    },
    
    // 検索フィルター関連
    'filters': {
      'エリアを選択': 'Select Area',
      '言語を選択': 'Select Language',
      'カテゴリーを選択': 'Select Category',
      '料金': 'Price',
      '以下': 'or less',
      '以上': 'or more',
      '〜': 'to',
      '円/時間': 'JPY/hour',
      '評価': 'Rating',
      '星以上': 'stars or more',
      '日本語': 'Japanese',
      '英語': 'English',
      '中国語': 'Chinese',
      '韓国語': 'Korean',
      'フランス語': 'French',
      'ドイツ語': 'German',
      'スペイン語': 'Spanish',
      'ロシア語': 'Russian',
      'キーワードを入力（コンマ区切り）': 'Enter keywords (separate with commas)'
    },
    
    // ガイドプロフィール関連
    'guide': {
      '自己紹介': 'About Me',
      '得意分野': 'Specialties',
      'ガイドするエリア': 'Guide Area',
      'ツアープラン例': 'Sample Tour Plans',
      '料金': 'Fee',
      'セッション料金': 'Session Fee',
      '件のレビュー': 'reviews',
      '認証済みガイド': 'Verified Guide',
      '1セッション = 2時間の基本ガイドサービス': '1 Session = 2 hours of basic guide service',
      '通常24時間以内に返信': 'Usually replies within 24 hours',
      '所要時間': 'Duration',
      '対応人数': 'Group Size',
      '料金:': 'Price:',
      '人': 'person',
      '交通費・食事代別': 'Transportation and meals not included',
      '食事代3店舗分込み': 'Meals at 3 restaurants included'
    },
    
    // 専門分野
    'specialties': {
      'グルメ': 'Cuisine',
      '写真スポット': 'Photo Spots',
      'ナイトツアー': 'Night Tour',
      'ローカル体験': 'Local Experience',
      '歴史': 'History',
      '文化': 'Culture',
      '寺院': 'Temples',
      '建築': 'Architecture',
      '街歩き': 'City Walk',
      'ダイビング': 'Diving',
      'シュノーケリング': 'Snorkeling',
      '自然': 'Nature',
      'アウトドア': 'Outdoor',
      '観光': 'Sightseeing',
      'アート': 'Art'
    },
    
    // 地域名
    'areas': {
      '北海道': 'Hokkaido',
      '東北': 'Tohoku',
      '関東': 'Kanto',
      '中部': 'Chubu',
      '関西': 'Kansai',
      '中国': 'Chugoku',
      '四国': 'Shikoku',
      '九州': 'Kyushu',
      '沖縄': 'Okinawa',
      '東京': 'Tokyo',
      '京都': 'Kyoto',
      '大阪': 'Osaka',
      '名古屋': 'Nagoya',
      '札幌': 'Sapporo',
      '福岡': 'Fukuoka',
      '神戸': 'Kobe',
      '広島': 'Hiroshima',
      '横浜': 'Yokohama',
      '金沢': 'Kanazawa',
      '那覇': 'Naha',
      '浅草': 'Asakusa',
      '渋谷': 'Shibuya',
      '原宿': 'Harajuku',
      '銀座': 'Ginza',
      '秋葉原': 'Akihabara',
      '新宿': 'Shinjuku',
      '六本木': 'Roppongi',
      '表参道': 'Omotesando',
      '日本橋': 'Nihonbashi',
      '清水寺': 'Kiyomizu-dera',
      '伏見稲荷': 'Fushimi Inari',
      '嵐山': 'Arashiyama',
      '祇園': 'Gion',
      '道頓堀': 'Dotonbori',
      'ユニバーサルスタジオジャパン': 'Universal Studios Japan',
      '美ら海水族館': 'Churaumi Aquarium',
      '宮島': 'Miyajima',
      '箱根': 'Hakone',
      '富士山': 'Mt. Fuji',
      '日光': 'Nikko'
    },
    
    // エラーメッセージ
    'errors': {
      '必須項目です': 'This field is required',
      '正しいメールアドレスを入力してください': 'Please enter a valid email address',
      'パスワードは8文字以上で入力してください': 'Password must be at least 8 characters',
      'パスワードが一致しません': 'Passwords do not match',
      '正しい電話番号を入力してください': 'Please enter a valid phone number',
      'ファイルサイズが大きすぎます': 'File size is too large',
      'サポートされていないファイル形式です': 'Unsupported file format',
      'ログインに失敗しました': 'Login failed',
      'ネットワークエラーが発生しました': 'A network error occurred',
      'アカウントが見つかりません': 'Account not found',
      'パスワードが正しくありません': 'Incorrect password',
      'アクセス権がありません': 'You do not have permission to access this',
      'このユーザー名は既に使用されています': 'This username is already taken',
      'このメールアドレスは既に登録されています': 'This email address is already registered',
      '認証コードが正しくありません': 'Incorrect verification code',
      '認証コードの有効期限が切れています': 'Verification code has expired',
      'しばらく経ってからもう一度お試しください': 'Please try again later',
      '予期せぬエラーが発生しました': 'An unexpected error occurred'
    },
    
    // 成功メッセージ
    'success': {
      '登録が完了しました': 'Registration completed successfully',
      '更新が完了しました': 'Update completed successfully',
      'メッセージを送信しました': 'Message sent successfully',
      '予約が確定しました': 'Booking confirmed successfully',
      '認証コードを送信しました': 'Verification code sent successfully',
      '電話番号認証が完了しました': 'Phone number verification completed',
      'パスワードをリセットしました': 'Password has been reset',
      'ログアウトしました': 'You have been logged out'
    },
    
    // 確認メッセージ
    'confirm': {
      'この操作を行いますか？': 'Are you sure you want to proceed?',
      '削除してもよろしいですか？': 'Are you sure you want to delete this?',
      'キャンセルしてもよろしいですか？': 'Are you sure you want to cancel?',
      '変更を保存しますか？': 'Do you want to save changes?',
      'ログアウトしますか？': 'Do you want to log out?'
    },
    
    // 通知メッセージ
    'notification': {
      '新しいメッセージがあります': 'You have a new message',
      '新しい予約リクエストがあります': 'You have a new booking request',
      '予約が確定しました': 'Your booking has been confirmed',
      'ガイドがメッセージを送信しました': 'The guide has sent you a message',
      'お客様がメッセージを送信しました': 'The customer has sent you a message',
      'レビューが投稿されました': 'A review has been posted',
      'システムメンテナンスのお知らせ': 'System maintenance notice'
    },
    
    // 日付と時間
    'datetime': {
      '年': 'Year',
      '月': 'Month',
      '日': 'Day',
      '時': 'Hour',
      '分': 'Minute',
      '秒': 'Second',
      '今日': 'Today',
      '明日': 'Tomorrow',
      '昨日': 'Yesterday',
      '週間': 'Week(s)',
      '時間': 'Hour(s)',
      '分前': 'minute(s) ago',
      '時間前': 'hour(s) ago',
      '日前': 'day(s) ago',
      '週間前': 'week(s) ago',
      '年前': 'year(s) ago'
    },
    
    // レビュー関連
    'reviews': {
      'レビューを書く': 'Write a Review',
      '評価': 'Rating',
      'コメント': 'Comment',
      '投稿する': 'Post',
      'レビューがありません': 'No reviews yet',
      '件のレビュー': 'reviews',
      '星': 'stars',
      '最高でした！': 'It was great!',
      'とても良い体験でした': 'It was a very good experience',
      '普通でした': 'It was okay',
      'あまり良くなかった': 'Not so good',
      '最悪でした': 'Terrible experience'
    },
    
    // 予約関連
    'booking': {
      '予約リクエスト': 'Booking Request',
      '日付を選択': 'Select Date',
      '時間を選択': 'Select Time',
      '人数': 'Number of People',
      '場所': 'Location',
      '希望事項': 'Requests',
      '確認画面へ': 'Proceed to Confirmation',
      '予約内容の確認': 'Booking Confirmation',
      '予約を確定する': 'Confirm Booking',
      '予約をキャンセルする': 'Cancel Booking',
      '予約状況': 'Booking Status',
      '予約済み': 'Booked',
      'リクエスト中': 'Requested',
      'キャンセル済み': 'Cancelled',
      '完了': 'Completed',
      '予約番号': 'Booking Number',
      '予約日時': 'Booking Date and Time',
      '予約の詳細': 'Booking Details',
      '集合場所': 'Meeting Point',
      '支払い方法': 'Payment Method',
      '合計金額': 'Total Amount',
      '現地払い（現金）': 'Pay on Site (Cash)',
      'クレジットカード払い': 'Credit Card Payment',
      '予約リクエストを送信しました。ガイドからの返答をお待ちください。': 'Your booking request has been sent. Please wait for the guide\'s response.',
      '予約が確定しました。当日をお楽しみに！': 'Your booking is confirmed. We look forward to seeing you!',
      '予約がキャンセルされました。': 'Your booking has been cancelled.'
    },
    
    // メッセージ関連
    'messages': {
      'メッセージを送る': 'Send Message',
      'メッセージを入力': 'Enter Message',
      '送信': 'Send',
      'メッセージがありません': 'No messages',
      '新規メッセージ': 'New Message',
      '返信': 'Reply',
      'メッセージ履歴': 'Message History',
      '最新のメッセージ': 'Latest Message',
      'さんとのメッセージ': 'Messages with'
    },
    
    // 設定関連
    'settings': {
      'アカウント設定': 'Account Settings',
      'プロフィール設定': 'Profile Settings',
      '通知設定': 'Notification Settings',
      'プライバシー設定': 'Privacy Settings',
      '言語設定': 'Language Settings',
      'パスワード変更': 'Change Password',
      '現在のパスワード': 'Current Password',
      '新しいパスワード': 'New Password',
      '新しいパスワード（確認）': 'New Password (Confirm)',
      'メール通知を受け取る': 'Receive Email Notifications',
      'アカウントを削除': 'Delete Account',
      'アカウントを削除すると、すべてのデータが永久に削除されます。この操作は元に戻せません。': 'Deleting your account will permanently remove all your data. This action cannot be undone.'
    },
    
    // 法的文書関連
    'legal': {
      '利用規約': 'Terms of Service',
      'プライバシーポリシー': 'Privacy Policy',
      '特定商取引法に基づく表記': 'Legal Information',
      'クッキーポリシー': 'Cookie Policy',
      '運営会社': 'Operating Company',
      'お問い合わせ': 'Contact Us'
    },
    
    // モバイルアプリ関連
    'app': {
      'アプリをダウンロード': 'Download the App',
      'iOS版をダウンロード': 'Download for iOS',
      'Android版をダウンロード': 'Download for Android',
      'モバイルでもっと便利に': 'More Convenient on Mobile',
      'QRコードを読み取ってください': 'Please scan the QR code'
    }
  }
};

/**
 * 指定されたキーに対応する翻訳テキストを取得
 * @param {string} lang - 言語コード（'en'または'ja'）
 * @param {string} category - カテゴリ（'navigation', 'buttons'など）
 * @param {string} key - 翻訳キー
 * @returns {string} 翻訳されたテキスト、または元のテキスト（翻訳が見つからない場合）
 */
window.getTranslatedText = function(lang, category, key) {
  if (lang === 'ja') return key; // 日本語の場合はそのまま返す
  
  try {
    if (window.translationData && 
        window.translationData[lang] && 
        window.translationData[lang][category] && 
        window.translationData[lang][category][key]) {
      return window.translationData[lang][category][key];
    }
    return key;
  } catch (e) {
    console.warn(`Translation not found for: ${lang}.${category}.${key}`);
    return key;
  }
};

/**
 * テキストを翻訳する独立した関数
 * @param {string} lang - 言語コード ('en'など)
 * @param {string} text - 翻訳するテキスト
 * @returns {string} 翻訳されたテキスト
 */
window.translateText = function(lang, text) {
  if (lang === 'ja') return text; // 日本語の場合はそのまま返す
  
  if (!window.translationData || !window.translationData[lang]) {
    console.warn(`翻訳データが見つかりません: ${lang}`);
    return text;
  }
  
  try {
    // カテゴリを順番に検索
    for (const category in window.translationData[lang]) {
      if (window.translationData[lang][category] && window.translationData[lang][category][text]) {
        return window.translationData[lang][category][text];
      }
    }
    
    // 地域名などの部分一致翻訳
    for (const category in window.translationData[lang]) {
      if (!window.translationData[lang][category]) continue;
      
      for (const key in window.translationData[lang][category]) {
        try {
          // 全体を囲むパターン（例：「北海道のガイド」→「Hokkaido guide」）
          const pattern = new RegExp(`(^|\\s)${key}($|\\s|の|、|。|に|へ|から|で|と|や|な)`, 'g');
          if (pattern.test(text)) {
            const translation = window.translationData[lang][category][key];
            return text.replace(pattern, (match, p1, p2) => {
              return `${p1}${translation}${p2 === 'の' ? ' ' : p2}`;
            });
          }
        } catch (e) {
          console.error(`正規表現エラー: ${key}`, e);
        }
      }
    }
  } catch (e) {
    console.error('翻訳処理中にエラーが発生:', e);
  }
  
  return text;
};

/**
 * 翻訳を取得する便利関数
 * @param {string} lang - 言語コード
 * @param {string} text - 翻訳するテキスト
 * @returns {string} 翻訳されたテキスト
 */
window.getTranslation = function(lang, text) {
  return window.translateText(lang, text);
};

// エラー検出用のスクリプト挿入を試みる
try {
  console.log("翻訳データモジュールを正常に読み込みました");
} catch (e) {
  console.error("翻訳データモジュールの読み込み中にエラーが発生しました:", e);
}