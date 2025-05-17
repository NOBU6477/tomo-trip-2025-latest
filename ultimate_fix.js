/**
 * 最終的なWebアプリ修正スクリプト
 * 言語切り替えと新規登録ボタンの問題を解決
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('最終修正スクリプトを実行');
  setTimeout(initFixes, 300); // DOM完全ロード確保
});

// ページ読み込み完了後も実行
window.addEventListener('load', function() {
  console.log('ページ読み込み完了後に最終修正を実行');
  initFixes();
});

function initFixes() {
  console.log('修正機能を初期化');
  
  // 1. 言語切り替え機能
  setupLanguageSwitcher();
  
  // 2. 新規登録ボタン修正
  fixRegisterButton();
  
  // 3. URLパラメータによる言語切り替え
  checkLanguageParam();
}

/**
 * 言語切り替え機能
 */
function setupLanguageSwitcher() {
  console.log('言語切り替え機能をセットアップ');
  
  // 言語ボタン
  const jaButton = document.querySelector('#ja-button, [data-lang="ja"]');
  const enButton = document.querySelector('#en-button, [data-lang="en"]');
  
  if (jaButton) {
    console.log('日本語ボタンを設定');
    // 既存のイベントを除去するため複製
    const newJaButton = jaButton.cloneNode(true);
    jaButton.parentNode.replaceChild(newJaButton, jaButton);
    
    // クリックで日本語に切り替え
    newJaButton.addEventListener('click', function(e) {
      e.preventDefault();
      setLanguage('ja');
      return false;
    });
  }
  
  if (enButton) {
    console.log('英語ボタンを設定');
    // 既存のイベントを除去するため複製
    const newEnButton = enButton.cloneNode(true);
    enButton.parentNode.replaceChild(newEnButton, enButton);
    
    // クリックで英語に切り替え
    newEnButton.addEventListener('click', function(e) {
      e.preventDefault();
      setLanguage('en');
      return false;
    });
  }
}

/**
 * 言語を設定
 */
function setLanguage(lang) {
  if (lang === 'en') {
    window.location.href = window.location.pathname + '?lang=en';
  } else {
    window.location.href = window.location.pathname;
  }
}

/**
 * URLパラメータによる言語切り替え
 */
function checkLanguageParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  
  if (lang === 'en') {
    console.log('英語モードを適用');
    translateToEnglish();
  }
}

/**
 * 新規登録ボタン修正
 */
function fixRegisterButton() {
  console.log('新規登録ボタン機能を修正');
  
  // 最も確実な方法：完全なボタン置き換え
  const headerUserArea = document.querySelector('.navbar-nav');
  if (!headerUserArea) return;
  
  // 既存の新規登録ボタンを探す
  const existingRegister = document.querySelector('#registerDropdown, .dropdown-toggle:not(#themeToggleButton):not(#languageDropdown)');
  if (!existingRegister) return;
  
  // 既存のドロップダウン要素を取得
  const existingDropdown = existingRegister.closest('.dropdown, .dropdown-center');
  if (!existingDropdown) return;
  
  console.log('既存の新規登録ボタンを発見、置き換えます');
  
  // 完全に新しいボタンを作成
  const newDropdown = document.createElement('div');
  newDropdown.className = 'dropdown d-inline-block ms-2';
  newDropdown.innerHTML = `
    <button class="btn btn-light" type="button" id="newRegisterBtn">
      新規登録 <i class="bi bi-chevron-down"></i>
    </button>
    <div class="dropdown-menu shadow" id="newRegisterMenu" style="display: none; position: absolute; z-index: 1001;">
      <a class="dropdown-item" href="#" id="registerAsTourist">
        <div class="d-flex align-items-center">
          <div class="me-2"><i class="bi bi-person"></i></div>
          <div>
            <div class="fw-bold">旅行者として登録</div>
            <small class="text-muted">ローカルガイドと一緒に特別な旅を体験</small>
          </div>
        </div>
      </a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item" href="#" id="registerAsGuide">
        <div class="d-flex align-items-center">
          <div class="me-2"><i class="bi bi-map"></i></div>
          <div>
            <div class="fw-bold">ガイドとして登録</div>
            <small class="text-muted">あなたの知識と経験を共有しましょう</small>
          </div>
        </div>
      </a>
    </div>
  `;
  
  // 既存の要素を置き換え
  existingDropdown.parentNode.replaceChild(newDropdown, existingDropdown);
  
  // クリックイベントを設定
  const newButton = document.getElementById('newRegisterBtn');
  const newMenu = document.getElementById('newRegisterMenu');
  
  if (newButton && newMenu) {
    // ボタンクリックでメニュー表示
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (newMenu.style.display === 'none') {
        newMenu.style.display = 'block';
      } else {
        newMenu.style.display = 'none';
      }
    });
    
    // 旅行者登録リンク
    const touristLink = document.getElementById('registerAsTourist');
    if (touristLink) {
      touristLink.addEventListener('click', function(e) {
        e.preventDefault();
        newMenu.style.display = 'none';
        openModal('registerTouristModal');
      });
    }
    
    // ガイド登録リンク
    const guideLink = document.getElementById('registerAsGuide');
    if (guideLink) {
      guideLink.addEventListener('click', function(e) {
        e.preventDefault();
        newMenu.style.display = 'none';
        openModal('registerGuideModal');
      });
    }
    
    // 外部クリックでメニューを閉じる
    document.addEventListener('click', function(e) {
      if (!newButton.contains(e.target) && !newMenu.contains(e.target)) {
        newMenu.style.display = 'none';
      }
    });
  }
}

/**
 * モーダルを開く
 */
function openModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

/**
 * 日本語から英語への翻訳
 */
function translateToEnglish() {
  // 翻訳データ
  const translations = {
    // ヘッダー
    'ホーム': 'Home',
    'ガイドを探す': 'Find Guides',
    'ガイドとして登録': 'Register as Guide',
    '旅行者として登録': 'Register as Tourist',
    'ログイン': 'Login',
    '新規登録': 'Register',
    '予約管理': 'Bookings',
    'ガイドプロフィール': 'Guide Profile',
    '旅行者プロフィール': 'Tourist Profile',
    'メッセージ': 'Messages',
    'ログアウト': 'Logout',
    'テーマ': 'Theme',
    'ライトモード': 'Light Mode',
    'ダークモード': 'Dark Mode',
    '自動（システム設定）': 'Auto (System)',
    '詳細を見る': 'View Details',
    
    // ヒーローセクション
    'あなただけの特別な旅を': 'Your Special Journey',
    '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden attractions with local guides that you won\'t find in regular tourism',
    'お問い合わせ': 'Contact Us',
    
    // フィルターセクション
    '人気のガイド': 'Popular Guides',
    'ガイドを絞り込む': 'Filter Guides',
    '地域': 'Location',
    'すべて': 'All',
    '言語': 'Language',
    '料金': 'Price',
    'キーワード': 'Keywords',
    'ナイトツアー': 'Night Tour',
    'グルメ': 'Food Tour',
    '写真スポット': 'Photo Spot',
    '料理': 'Cooking',
    'アクティビティ': 'Activity',
    'その他のキーワードを入力（コンマ区切りで複数入力可）': 'Enter other keywords (comma separated)',
    '検索': 'Search',
    'リセット': 'Reset',
    
    // 使い方セクション
    '使い方': 'How to Use',
    'アカウント登録': 'Create Account',
    '簡単な情報入力と電話番号認証で登録完了': 'Simple signup with phone verification',
    'ガイドを見つける': 'Find Guides',
    '場所、言語、専門性などで理想のガイドを検索': 'Search by location, language, and expertise',
    '予約して楽しむ': 'Book and Enjoy',
    '希望の日時で予約し、特別な体験を楽しむ': 'Book at your preferred time and enjoy a special experience',
    
    // ガイドメリットセクション
    'ガイドとして活躍するメリット': 'Benefits of Being a Guide',
    'あなたの知識と経験を活かして、世界中の旅行者に特別な体験を提供しましょう': 'Share your knowledge and experience to provide special experiences to travelers from around the world',
    '柔軟な働き方': 'Flexible Work Style',
    '自分のスケジュールに合わせて活動できます。空き時間を有効活用しましょう。': 'Work according to your own schedule. Make effective use of your free time.',
    '追加収入': 'Additional Income',
    'あなたの専門知識や特技を収入に変えることができます。': 'Turn your expertise and skills into income.',
    '国際交流': 'International Exchange',
    '世界中の人々と交流し、異文化理解を深めることができます。': 'Interact with people from around the world and deepen cross-cultural understanding.',
    '自己成長': 'Personal Growth',
    'ガイド活動を通じて、コミュニケーション能力や知識が向上します。': 'Improve your communication skills and knowledge through guiding activities.',
    '予約を受ける日時や頻度は完全に自分で決められるため、ライフスタイルに合わせた働き方ができます。': 'You can work according to your lifestyle as you can decide the days, times, and frequency of accepting reservations.',
    '観光客を地元のお店や施設に案内することで、地域経済の活性化とコミュニティの発展に貢献できます。': 'You can contribute to revitalizing the local economy and developing the community by guiding tourists to local stores and facilities.',
    'ガイドとして登録する': 'Register as Guide',
    
    // フッターセクション
    'プライバシーポリシー': 'Privacy Policy',
    '利用規約': 'Terms of Service',
    'よくある質問': 'FAQ',
    'お問い合わせ': 'Contact Us',
    'ガイドとして登録': 'Register as Guide',
    '旅行者として登録': 'Register as Tourist',
    '© 2025 Local Guide. All rights reserved.': '© 2025 Local Guide. All rights reserved.',
    'ローカルガイドと一緒に特別な旅を体験': 'Experience special journeys with local guides',
    'あなたの知識と経験を共有しましょう': 'Share your knowledge and experience',
    
    // モーダルタイトル
    'ログイン': 'Login',
    '新規登録 - 旅行者': 'Register - Tourist',
    '新規登録 - ガイド': 'Register - Guide',
    'お問い合わせ': 'Contact Us',
    
    // ボタン
    'キャンセル': 'Cancel',
    '閉じる': 'Close',
    '送信': 'Submit',
    '登録': 'Register',
    'ログイン': 'Login',
    '認証コードを送信': 'Send Code',
    '認証': 'Verify',
    'もっと見る': 'Show More',
    'すべて表示しました': 'All Shown'
  };
  
  // 要素ごとに翻訳
  document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, label, option, div, li').forEach(function(el) {
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      const text = el.textContent.trim();
      if (translations[text]) {
        el.textContent = translations[text];
      }
    }
  });
  
  // プレースホルダーも翻訳
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(input) {
    const placeholder = input.getAttribute('placeholder');
    if (translations[placeholder]) {
      input.setAttribute('placeholder', translations[placeholder]);
    }
  });
  
  // 特定の要素を直接翻訳
  translateSpecificElements();
}

/**
 * 特定の要素を直接翻訳
 */
function translateSpecificElements() {
  // 登録ボタンテキスト
  const registerBtn = document.getElementById('newRegisterBtn');
  if (registerBtn) {
    registerBtn.innerHTML = 'Register <i class="bi bi-chevron-down"></i>';
  }
  
  // ドロップダウンメニュー内テキスト
  const touristText = document.querySelector('#registerAsTourist .fw-bold');
  const touristDesc = document.querySelector('#registerAsTourist small');
  const guideText = document.querySelector('#registerAsGuide .fw-bold');
  const guideDesc = document.querySelector('#registerAsGuide small');
  
  if (touristText) touristText.textContent = 'Register as Tourist';
  if (touristDesc) touristDesc.textContent = 'Experience special journeys with local guides';
  if (guideText) guideText.textContent = 'Register as Guide';
  if (guideDesc) guideDesc.textContent = 'Share your knowledge and experience';
  
  // 青いボタンも翻訳
  document.querySelectorAll('.btn-primary').forEach(function(btn) {
    if (btn.textContent.includes('ガイドとして登録')) {
      btn.textContent = 'Register as Guide';
    }
  });
}