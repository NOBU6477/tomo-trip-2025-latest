/**
 * 最もシンプルな解決策
 * 複雑なDOM操作を避け、最小限のJavaScriptで実装
 */

// ドキュメント読み込み完了時に実行
document.addEventListener('DOMContentLoaded', function() {
  console.log('シンプル解決策を実行します');
  setTimeout(initSimpleSolution, 500);
});

// ウィンドウ読み込み完了時にも実行
window.addEventListener('load', function() {
  console.log('ウィンドウ読み込み完了後に実行');
  initSimpleSolution();
});

// メイン初期化関数
function initSimpleSolution() {
  // 言語切替ボタン設定
  setupLanguageButtons();
  
  // 新規登録ボタン修正
  fixRegisterDropdown();
  
  // URLパラメータ確認
  checkUrlLanguage();
}

// 言語切替ボタン設定
function setupLanguageButtons() {
  // 日本語ボタン
  const jaButton = document.querySelector('[data-lang="ja"], #ja-button');
  if (jaButton) {
    jaButton.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = window.location.pathname;
    });
  }
  
  // 英語ボタン
  const enButton = document.querySelector('[data-lang="en"], #en-button');
  if (enButton) {
    enButton.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = window.location.pathname + '?lang=en';
    });
  }
}

// 新規登録ドロップダウン修正
function fixRegisterDropdown() {
  // 登録関連の要素を追加
  const navbarNav = document.querySelector('.navbar-nav');
  if (!navbarNav) return;
  
  // 既存の登録ボタンを検索して削除
  const existingRegister = document.querySelector('.dropdown:has(#registerDropdown), .dropdown-center:has(button[data-bs-toggle="dropdown"]):not(:has(#themeToggleButton))');
  if (existingRegister) {
    existingRegister.remove();
  }
  
  // 手動でボタンとドロップダウンを作成
  const registerHTML = `
    <li class="nav-item dropdown">
      <a href="#" class="nav-link" role="button" id="simpleRegisterBtn">
        新規登録 <i class="bi bi-chevron-down"></i>
      </a>
      <ul class="dropdown-menu" id="simpleRegisterMenu" style="display: none;">
        <li>
          <a class="dropdown-item" href="#" id="simpleTouristRegister">
            <div class="d-flex align-items-center">
              <div class="me-2"><i class="bi bi-person"></i></div>
              <div>
                <div class="fw-bold">旅行者として登録</div>
                <small class="text-muted">ローカルガイドと一緒に特別な旅を体験</small>
              </div>
            </div>
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" href="#" id="simpleGuideRegister">
            <div class="d-flex align-items-center">
              <div class="me-2"><i class="bi bi-map"></i></div>
              <div>
                <div class="fw-bold">ガイドとして登録</div>
                <small class="text-muted">あなたの知識と経験を共有しましょう</small>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </li>
  `;
  
  // HTMLをDOMに挿入
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = registerHTML;
  const registerElement = tempDiv.firstElementChild;
  
  // ログインボタンの前に挿入
  const loginButton = document.querySelector('button[data-bs-target="#loginModal"]');
  if (loginButton && loginButton.parentElement) {
    loginButton.parentElement.parentElement.insertBefore(registerElement, loginButton.parentElement);
  } else {
    navbarNav.appendChild(registerElement);
  }
  
  // クリックイベント設定
  const registerBtn = document.getElementById('simpleRegisterBtn');
  const registerMenu = document.getElementById('simpleRegisterMenu');
  
  if (registerBtn && registerMenu) {
    registerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (registerMenu.style.display === 'none') {
        registerMenu.style.display = 'block';
      } else {
        registerMenu.style.display = 'none';
      }
    });
    
    // ドロップダウン項目をクリックしたときの処理
    document.getElementById('simpleTouristRegister').addEventListener('click', function(e) {
      e.preventDefault();
      registerMenu.style.display = 'none';
      openModalById('registerTouristModal');
    });
    
    document.getElementById('simpleGuideRegister').addEventListener('click', function(e) {
      e.preventDefault();
      registerMenu.style.display = 'none';
      openModalById('registerGuideModal');
    });
    
    // ドキュメント上の他の場所をクリックした時にメニューを閉じる
    document.addEventListener('click', function(e) {
      if (registerBtn && !registerBtn.contains(e.target) && 
          registerMenu && !registerMenu.contains(e.target)) {
        registerMenu.style.display = 'none';
      }
    });
  }
}

// モーダルを開く
function openModalById(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
  }
}

// URLパラメータで言語確認
function checkUrlLanguage() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  
  if (lang === 'en') {
    // 英語翻訳を強制的に適用
    forceTranslateToEnglish();
  }
}

// 英語に翻訳
function forceTranslateToEnglish() {
  // 翻訳マップ
  const translations = {
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
    
    // ボタン
    'お問い合わせ': 'Contact Us',
    'もっと見る': 'Show More',
    '閉じる': 'Close',
    '送信': 'Submit',
    '登録': 'Register',
    '日本語': 'Japanese',
    '英語': 'English',
    '英語(流暢)': 'English (Fluent)'
  };
  
  // スタイル付きのテキスト要素を置換する正規表現
  const translateTextContent = function(node) {
    if (node.nodeType === 3) { // テキストノード
      const text = node.nodeValue.trim();
      if (text.length > 0 && translations[text]) {
        node.nodeValue = node.nodeValue.replace(text, translations[text]);
      }
    } else if (node.nodeType === 1) { // 要素ノード
      // 属性を翻訳
      if (node.hasAttribute('placeholder')) {
        const placeholder = node.getAttribute('placeholder');
        if (translations[placeholder]) {
          node.setAttribute('placeholder', translations[placeholder]);
        }
      }
      
      // データ属性を翻訳
      if (node.dataset && node.dataset.originalTitle && translations[node.dataset.originalTitle]) {
        node.dataset.originalTitle = translations[node.dataset.originalTitle];
      }
      
      // すべての子ノードを再帰的に処理
      const childNodes = node.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        translateTextContent(childNodes[i]);
      }
    }
  };
  
  // ドキュメント全体を翻訳
  translateTextContent(document.body);
  
  // 特定の要素を直接翻訳（ドロップダウンやボタンなど）
  const registerBtn = document.getElementById('simpleRegisterBtn');
  if (registerBtn) {
    registerBtn.innerHTML = 'Register <i class="bi bi-chevron-down"></i>';
  }
  
  // 旅行者として登録メニュー項目
  const touristRegisterItem = document.getElementById('simpleTouristRegister');
  if (touristRegisterItem) {
    const title = touristRegisterItem.querySelector('.fw-bold');
    const desc = touristRegisterItem.querySelector('small');
    if (title) title.textContent = 'Register as Tourist';
    if (desc) desc.textContent = 'Experience special journeys with local guides';
  }
  
  // ガイドとして登録メニュー項目
  const guideRegisterItem = document.getElementById('simpleGuideRegister');
  if (guideRegisterItem) {
    const title = guideRegisterItem.querySelector('.fw-bold');
    const desc = guideRegisterItem.querySelector('small');
    if (title) title.textContent = 'Register as Guide';
    if (desc) desc.textContent = 'Share your knowledge and experience';
  }
  
  // 青いボタンの翻訳
  document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.trim() === 'ガイドとして登録する') {
      btn.textContent = 'Register as Guide';
    }
  });
  
  // ガイド写真
  document.querySelectorAll('small:contains("ガイド写真")').forEach(el => {
    el.textContent = 'Guide Photo';
  });
  
  // 検索ボタン
  document.querySelectorAll('button:contains("検索")').forEach(btn => {
    btn.textContent = 'Search';
  });
}