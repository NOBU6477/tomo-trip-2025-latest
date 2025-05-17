/**
 * シンプルな翻訳データファイル
 * 他のファイルとの依存関係を持たない独立したモジュール
 */

(function() {
  // グローバル翻訳データオブジェクト
  window.translationData = {
    // 英語翻訳データ
    en: {
      // ナビゲーション要素
      navigation: {
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
      hero: {
        'あなただけの特別な旅を': 'Your Special Journey Awaits',
        '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours'
      },
      
      // ボタンとアクション
      buttons: {
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
      sections: {
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
      howToUse: {
        'アカウント登録': 'Create Account',
        'ガイドを探す': 'Find Guides',
        '予約して楽しむ': 'Book and Enjoy',
        '簡単な情報入力と電話番号認証': 'Simple information input and phone number verification',
        '場所、言語、専門性などで理想のガイド': 'Search for ideal guides by location, language, and specialties',
        '希望の日時で予約し、特別な体験': 'Book on your preferred date and enjoy a special experience',
        '観光客向け': 'For Tourists',
        'ガイド向け': 'For Guides'
      },
      
      // ログイン・登録関連
      auth: {
        'メールアドレス': 'Email Address',
        'パスワード': 'Password',
        'パスワードを忘れた': 'Forgot Password',
        'アカウント登録はこちら': 'Register Here',
        'すでにアカウントをお持ちの方': 'Already have an account',
        'ガイドとして登録': 'Register as Guide',
        '観光客として登録': 'Register as Tourist',
        '電話番号': 'Phone Number',
        '認証コード': 'Verification Code',
        '認証コードを送信': 'Send Verification Code',
        '認証コードを確認': 'Verify Code',
        'ログインに成功しました': 'Login successful',
        '登録が完了しました': 'Registration completed',
        'ログアウトしました': 'You have been logged out',
        'ガイド詳細の閲覧にはログインが必要です': 'Login Required to View Guide Details',
        'ガイドの詳細情報、写真ギャラリー、レビュー、予約機能を利用するには、ログインまたは新規登録が必要です。': 'To access guide details, photo gallery, reviews, and booking features, please login or sign up.'
      },
      
      // 検索フィルター関連
      filter: {
        'ガイドを絞り込む': 'Filter Guides',
        '地域': 'Region',
        '言語': 'Language',
        '料金': 'Fee',
        'キーワード': 'Keywords',
        'すべて': 'All',
        '以下': 'Under',
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
      guide: {
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
      specialties: {
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
      regions: {
        '東京都': 'Tokyo',
        '大阪府': 'Osaka',
        '京都府': 'Kyoto',
        '北海道': 'Hokkaido',
        '沖縄県': 'Okinawa',
        '福岡県': 'Fukuoka',
        '神奈川県': 'Kanagawa',
        '愛知県': 'Aichi',
        '広島県': 'Hiroshima',
        '山口県': 'Yamaguchi',
        '新宿区': 'Shinjuku',
        '渋谷区': 'Shibuya',
        '港区': 'Minato',
        '那覇市': 'Naha',
        '札幌市': 'Sapporo',
        '函館市': 'Hakodate',
        '小樽市': 'Otaru'
      },
      
      // ガイド登録フォーム
      guideRegistration: {
        '基本情報': 'Basic Information',
        'プロフィール写真': 'Profile Photo',
        'カメラで撮影': 'Take Photo',
        '氏名': 'Full Name',
        'ユーザー名': 'Username',
        'プロフィールURLに使用されます': 'Used for your profile URL',
        'メールアドレス': 'Email Address',
        'パスワード': 'Password',
        '8文字以上で、英数字を含めてください': 'At least 8 characters including letters and numbers',
        '活動エリア': 'Activity Area',
        '対応言語': 'Languages',
        'Ctrlキーを押しながら複数選択できます': 'Hold Ctrl key to select multiple options',
        '得意分野・テーマ': 'Specialties & Themes',
        '自己紹介文': 'Self Introduction',
        '自己紹介（英語）': 'Self Introduction (English)',
        'ガイド料金': 'Guide Fee',
        '最低でも6,000円以上に設定してください': 'Set at least 6,000 yen or more',
        '本人確認書類': 'Identity Verification Document',
        '運転免許証': 'Driver\'s License',
        'パスポート': 'Passport',
        'マイナンバーカード': 'My Number Card',
        '健康保険証': 'Health Insurance Card',
        '表面': 'Front Side',
        '裏面': 'Back Side',
        '規約に同意する': 'Agree to Terms',
        '登録して始める': 'Register and Start'
      },
      
      // ベネフィットセクション
      benefits: {
        'あなたの知識と経験を活かして、世界中からの旅行者に特別な体験を提供しましょう': 'Share your knowledge and experience to provide special experiences for travelers from around the world',
        'あなたの日常が観光資源': 'Your Daily Life Becomes a Tourist Attraction',
        '観光客の方を友達のようにおもてなし': 'Welcome Tourists as Friends',
        '隙間時間を使って収入': 'Income in Your Spare Time',
        '自分の好きなことを仕事に': 'Do What You Love',
        '世界中の人と出会える': 'Meet People from Around the World',
        '語学力を活かして上達': 'Improve Your Language Skills',
        '地元への愛着が深まる': 'Deepen Your Love for Your Hometown',
        '安心のサポート体制': 'Reliable Support System',
        '自分のペースで活動': 'Work at Your Own Pace',
        '地域活性化に貢献': 'Contribute to Local Economy',
        '地元の方だけが知る特別な場所や店を紹介することで、あなたの日常が貴重な観光資源になります。': 'By sharing special places that only locals know about, your everyday surroundings become valuable tourism resources.',
        '形式ばったガイドツアーではなく、友人と過ごすように自然に地元の魅力を伝えることができます。': 'Rather than a formal guided tour, you can naturally convey the charm of your local area as if spending time with friends.',
        '自分の都合の良い時間にスケジュールを設定でき、本業や学業と両立しながら収入を得られます。': 'You can set your schedule according to your convenience, allowing you to earn income while balancing with your main job or studies.',
        '趣味や特技、専門知識を活かしたユニークなガイド体験を提供することで、好きなことを仕事にできます。': 'By providing unique guided experiences that utilize your hobbies, skills, and specialized knowledge, you can turn your passion into income.',
        '様々な国や文化から来た旅行者との交流を通じて、国際的なネットワークを広げ、異文化理解を深められます。': 'Interact with travelers from different countries and cultures, expanding your international network and deepening cross-cultural understanding.',
        '外国語を使う実践的な機会を得られ、自然とコミュニケーション能力が向上します。': 'Gain practical opportunities to use foreign languages, naturally improving your communication skills.',
        '地元の魅力を発信することで、自分の住む地域への愛着や理解がさらに深まります。': 'By promoting the attractions of your local area, you will develop a deeper appreciation and attachment to your hometown.',
        '予約管理、決済、保険など、ガイド活動に必要なサポートを提供しているので安心して活動できます。': 'We provide the essential support for guide activities such as reservation management, payment, and insurance, so you can work with peace of mind.',
        '予約を受ける日時や頻度は完全に自分で決められるので、ライフスタイルに合わせた活動が可能です。': 'When and how often you accept bookings is completely up to you, allowing for a lifestyle that suits your needs.',
        '観光客を地元のお店や施設に案内することで、地域経済の活性化やコミュニティ発展に貢献できます。': 'By introducing tourists to local shops and facilities, you contribute to the revitalization of the local economy and community development.'
      },
      
      // 予約関連
      booking: {
        '予約リクエスト': 'Booking Request',
        '予約確認': 'Booking Confirmation',
        '日付': 'Date',
        '時間': 'Time',
        '場所': 'Location',
        '人数': 'Number of People',
        'メッセージ': 'Message',
        '確認画面へ': 'Proceed to Confirmation',
        '予約を確定する': 'Confirm Booking',
        '予約をキャンセル': 'Cancel Booking',
        '予約状況': 'Booking Status',
        '確定済み': 'Confirmed',
        'リクエスト中': 'Requested',
        'キャンセル済み': 'Canceled',
        '完了': 'Completed',
        '予約番号': 'Booking Number',
        '予約日時': 'Booking Date/Time'
      },
      
      // その他
      misc: {
        '準備中': 'Coming Soon',
        '読み込み中': 'Loading',
        'エラーが発生しました': 'An error occurred',
        '再試行': 'Try Again',
        '続きを読む': 'Read More',
        '戻る': 'Back',
        '次へ': 'Next',
        'よくある質問': 'Frequently Asked Questions',
        'プライバシーポリシー': 'Privacy Policy',
        '利用規約': 'Terms of Service',
        'お問い合わせ': 'Contact Us',
        '著作権': 'Copyright'
      }
    }
  };

  console.log("シンプルな翻訳データが読み込まれました");
})();