/**
 * 多言語対応翻訳ファイル
 * 全ページで使用する統一的な翻訳システム
 */

const translations = {
  ja: {
    // ナビゲーション
    nav: {
      home: "ホーム",
      guides: "ガイドを探す", 
      sponsors: "協賛パートナー",
      login: "ログイン",
      register: "新規登録",
      profile: "プロフィール",
      dashboard: "ダッシュボード",
      logout: "ログアウト",
      admin: "管理者",
      messages: "メッセージ"
    },
    
    // ホームページ
    home: {
      title: "Local Guide - 特別な旅の体験を",
      hero_title: "地元の魅力を、あなただけの体験に",
      hero_subtitle: "経験豊富なローカルガイドと一緒に、観光地では味わえない特別な時間を過ごしませんか？",
      find_guide: "ガイドを探す",
      contact: "お問い合わせ",
      popular_guides: "人気のガイド",
      sponsor_partners: "協賛パートナー",
      guide_benefits_title: "ガイドとして活動するメリット",
      tourist_registration: "観光客として登録",
      guide_registration: "ガイドとして登録"
    },
    
    // ガイド関連
    guide: {
      search_placeholder: "ガイドを検索...",
      filter_by_region: "地域で絞り込み",
      filter_by_language: "言語で絞り込み", 
      filter_by_price: "料金で絞り込み",
      clear_filters: "フィルターをクリア",
      hourly_rate: "時間料金",
      languages: "対応言語",
      specialties: "専門分野",
      book_now: "予約する",
      view_profile: "プロフィールを見る",
      reviews: "レビュー",
      rating: "評価"
    },
    
    // プロフィール
    profile: {
      personal_info: "基本情報",
      name: "氏名",
      email: "メールアドレス",
      phone: "電話番号",
      address: "住所",
      profile_photo: "プロフィール写真",
      upload_photo: "写真をアップロード",
      save_changes: "変更を保存",
      account_settings: "アカウント設定",
      change_password: "パスワード変更",
      current_password: "現在のパスワード",
      new_password: "新しいパスワード",
      confirm_password: "パスワード確認"
    },
    
    // 予約関連
    booking: {
      booking_request: "予約リクエスト",
      select_date: "日程を選択",
      select_time: "時間を選択", 
      duration: "所要時間",
      participants: "参加人数",
      special_requests: "特別なリクエスト",
      total_cost: "合計料金",
      confirm_booking: "予約を確定",
      cancel_booking: "予約をキャンセル",
      booking_confirmed: "予約が確定しました",
      payment_required: "お支払いが必要です"
    },
    
    // フォーム
    form: {
      required: "必須",
      optional: "任意",
      submit: "送信",
      cancel: "キャンセル",
      edit: "編集",
      delete: "削除",
      confirm: "確認",
      back: "戻る",
      next: "次へ",
      finish: "完了",
      loading: "読み込み中...",
      error: "エラーが発生しました",
      success: "成功しました"
    },
    
    // 認証
    auth: {
      login_title: "ログイン",
      register_title: "新規登録",
      username: "ユーザー名",
      password: "パスワード",
      forgot_password: "パスワードを忘れた方",
      remember_me: "ログイン状態を保持",
      login_button: "ログイン",
      register_button: "新規登録",
      already_member: "既にアカウントをお持ちの方",
      not_member: "アカウントをお持ちでない方",
      phone_verification: "電話番号認証",
      send_code: "認証コードを送信",
      enter_code: "認証コードを入力",
      verify: "認証する"
    },
    
    // 協賛店
    sponsor: {
      sponsor_list: "協賛店一覧",
      benefits: "特典内容",
      location: "所在地",
      hours: "営業時間",
      contact_info: "連絡先",
      visit_store: "店舗を訪問",
      sponsor_dashboard: "協賛店ダッシュボード",
      manage_profile: "プロフィール管理",
      photo_gallery: "写真ギャラリー",
      upload_photos: "写真をアップロード"
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: "Home",
      guides: "Find Guides",
      sponsors: "Sponsor Partners", 
      login: "Login",
      register: "Sign Up",
      profile: "Profile",
      dashboard: "Dashboard",
      logout: "Logout",
      admin: "Admin",
      messages: "Messages"
    },
    
    // Homepage
    home: {
      title: "Local Guide - Experience Special Journeys",
      hero_title: "Turn Local Charm into Your Unique Experience",
      hero_subtitle: "Discover special moments that tourist spots can't offer, with experienced local guides.",
      find_guide: "Find a Guide",
      contact: "Contact Us",
      popular_guides: "Popular Guides",
      sponsor_partners: "Sponsor Partners",
      guide_benefits_title: "Benefits of Being a Guide",
      tourist_registration: "Register as Tourist",
      guide_registration: "Register as Guide"
    },
    
    // Guide related
    guide: {
      search_placeholder: "Search guides...",
      filter_by_region: "Filter by Region",
      filter_by_language: "Filter by Language",
      filter_by_price: "Filter by Price", 
      clear_filters: "Clear Filters",
      hourly_rate: "Hourly Rate",
      languages: "Languages",
      specialties: "Specialties",
      book_now: "Book Now",
      view_profile: "View Profile",
      reviews: "Reviews",
      rating: "Rating"
    },
    
    // Profile
    profile: {
      personal_info: "Personal Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      profile_photo: "Profile Photo",
      upload_photo: "Upload Photo",
      save_changes: "Save Changes",
      account_settings: "Account Settings",
      change_password: "Change Password",
      current_password: "Current Password",
      new_password: "New Password",
      confirm_password: "Confirm Password"
    },
    
    // Booking related
    booking: {
      booking_request: "Booking Request",
      select_date: "Select Date",
      select_time: "Select Time",
      duration: "Duration", 
      participants: "Participants",
      special_requests: "Special Requests",
      total_cost: "Total Cost",
      confirm_booking: "Confirm Booking",
      cancel_booking: "Cancel Booking", 
      booking_confirmed: "Booking Confirmed",
      payment_required: "Payment Required"
    },
    
    // Forms
    form: {
      required: "Required",
      optional: "Optional",
      submit: "Submit",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      finish: "Finish",
      loading: "Loading...",
      error: "An error occurred",
      success: "Success"
    },
    
    // Authentication
    auth: {
      login_title: "Login",
      register_title: "Sign Up",
      username: "Username",
      password: "Password",
      forgot_password: "Forgot Password?",
      remember_me: "Remember me",
      login_button: "Login",
      register_button: "Sign Up",
      already_member: "Already have an account?",
      not_member: "Don't have an account?",
      phone_verification: "Phone Verification",
      send_code: "Send Code",
      enter_code: "Enter Code",
      verify: "Verify"
    },
    
    // Sponsors
    sponsor: {
      sponsor_list: "Sponsor List",
      benefits: "Benefits",
      location: "Location",
      hours: "Hours",
      contact_info: "Contact Info",
      visit_store: "Visit Store",
      sponsor_dashboard: "Sponsor Dashboard",
      manage_profile: "Manage Profile",
      photo_gallery: "Photo Gallery",
      upload_photos: "Upload Photos"
    }
  }
};

/**
 * 翻訳関数
 * @param {string} key - 翻訳キー（例: "nav.home"）
 * @param {string} lang - 言語コード（ja/en）
 * @returns {string} - 翻訳されたテキスト
 */
function t(key, lang = getCurrentLanguage()) {
  const keys = key.split('.');
  let translation = translations[lang];
  
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // フォールバック：日本語を返す
      translation = translations.ja;
      for (const k of keys) {
        if (translation && translation[k]) {
          translation = translation[k];
        } else {
          return key; // キーが見つからない場合はキー自体を返す
        }
      }
      break;
    }
  }
  
  return translation || key;
}

/**
 * 現在の言語を取得
 */
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'ja';
}

/**
 * 言語を設定
 * @param {string} lang - 言語コード
 */
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  updatePageLanguage();
}

/**
 * ページの言語を更新
 */
function updatePageLanguage() {
  const lang = getCurrentLanguage();
  
  // data-translate属性を持つ要素を翻訳
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    element.textContent = t(key, lang);
  });
  
  // data-translate-placeholder属性を持つ要素のプレースホルダーを翻訳
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    element.setAttribute('placeholder', t(key, lang));
  });
  
  // data-translate-title属性を持つ要素のタイトルを翻訳
  document.querySelectorAll('[data-translate-title]').forEach(element => {
    const key = element.getAttribute('data-translate-title');
    element.setAttribute('title', t(key, lang));
  });
  
  // ページタイトルを更新
  const titleElement = document.querySelector('[data-translate-page-title]');
  if (titleElement) {
    const key = titleElement.getAttribute('data-translate-page-title');
    document.title = t(key, lang);
  }
  
  // 言語切り替えボタンの状態を更新
  updateLanguageButtons();
}

/**
 * 言語切り替えボタンの状態を更新
 */
function updateLanguageButtons() {
  const currentLang = getCurrentLanguage();
  const buttons = document.querySelectorAll('.language-btn');
  
  buttons.forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    if (lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * 言語切り替えUIを初期化
 */
function initLanguageSwitcher() {
  // 言語切り替えボタンのイベントリスナーを設定
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
  
  // 初期化時に現在の言語でページを更新
  updatePageLanguage();
}

// ページ読み込み時に言語システムを初期化
document.addEventListener('DOMContentLoaded', function() {
  initLanguageSwitcher();
});

// 翻訳システムをグローバルに公開
window.t = t;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.updatePageLanguage = updatePageLanguage;