/**
 * 最終的な修正スクリプト - すべての問題を解決します
 */
(function() {
  console.log('最終的な修正スクリプトを実行');
  
  // DOMが読み込まれた時点で実行
  document.addEventListener('DOMContentLoaded', function() {
    init();
  });
  
  // ページが完全に読み込まれた時点でも実行
  window.addEventListener('load', function() {
    init();
    // 少し遅延させて確実に実行
    setTimeout(init, 500);
  });
  
  function init() {
    console.log('最終修正を初期化');
    
    // 1. 言語切替処理
    setupLanguageButtons();
    
    // 2. 新規登録ボタン修正
    fixRegisterButton();
    
    // 3. URLパラメータに基づく言語切り替え
    translateBasedOnUrl();
  }
  
  /**
   * 言語切替ボタンを設定
   */
  function setupLanguageButtons() {
    console.log('言語切替ボタンをセットアップ');
    
    // ヘッダーとフッターの両方の言語ボタンに対応
    const jaButtons = document.querySelectorAll('#ja-button, #ja-button-footer, [data-lang="ja"]');
    const enButtons = document.querySelectorAll('#en-button, #en-button-footer, [data-lang="en"]');
    
    // 日本語ボタンのイベント設定
    jaButtons.forEach(button => {
      if (button) {
        // 既存のイベントリスナーを全て除去するためclone
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
          
          // 直接URLを遷移させる方式
          newButton.onclick = function(e) {
            e.preventDefault();
            window.location.href = window.location.pathname;
            return false;
          };
        }
      }
    });
    
    // 英語ボタンのイベント設定
    enButtons.forEach(button => {
      if (button) {
        // 既存のイベントリスナーを全て除去するためclone
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
          
          // 直接URLを遷移させる方式
          newButton.onclick = function(e) {
            e.preventDefault();
            window.location.href = window.location.pathname + '?lang=en';
            return false;
          };
        }
      }
    });
  }
  
  /**
   * 新規登録ボタンを修正
   */
  function fixRegisterButton() {
    console.log('新規登録ボタンを修正');
    
    // ボタンを完全に置換する強制的なアプローチ
    const navbarUserArea = document.getElementById('navbar-user-area');
    if (navbarUserArea) {
      // 既存の新規登録関連の要素を削除
      const existingRegisterButton = document.querySelector('#registerDropdown, #register-button, .dropdown-toggle:not(#themeToggleButton):not(#languageDropdown)');
      const existingRegisterContainer = existingRegisterButton ? existingRegisterButton.closest('.dropdown') : null;
      
      if (existingRegisterContainer) {
        // 完全に新しいHTML要素を作成
        const newRegisterHTML = `
          <div class="dropdown d-inline-block" id="completely-new-register">
            <button class="btn btn-light" type="button" id="completely-new-register-btn">
              新規登録 <i class="bi bi-chevron-down"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end" id="completely-new-register-menu" style="position: absolute; z-index: 1000;">
              <a class="dropdown-item" href="#" data-modal-id="registerTouristModal">
                <div class="d-flex align-items-center">
                  <div class="me-2"><i class="bi bi-person"></i></div>
                  <div>
                    <div class="fw-bold">旅行者として登録</div>
                    <small class="text-muted">ローカルガイドと一緒に特別な旅を体験</small>
                  </div>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" data-modal-id="registerGuideModal">
                <div class="d-flex align-items-center">
                  <div class="me-2"><i class="bi bi-map"></i></div>
                  <div>
                    <div class="fw-bold">ガイドとして登録</div>
                    <small class="text-muted">あなたの知識と経験を共有しましょう</small>
                  </div>
                </div>
              </a>
            </div>
          </div>
        `;
        
        // 一時的な要素に HTML を挿入して DOM ノードを作成
        const temp = document.createElement('div');
        temp.innerHTML = newRegisterHTML;
        const newRegisterContainer = temp.firstElementChild;
        
        // 既存の要素を置き換え
        existingRegisterContainer.parentNode.replaceChild(newRegisterContainer, existingRegisterContainer);
        
        // 新しいドロップダウン機能をセットアップ
        const newButton = document.getElementById('completely-new-register-btn');
        const newMenu = document.getElementById('completely-new-register-menu');
        
        // ボタンクリックでメニュー表示切替
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle menu display
          if (newMenu.classList.contains('show')) {
            newMenu.classList.remove('show');
          } else {
            newMenu.classList.add('show');
            // 位置調整はしない（すでにスタイルで指定済み）
          }
        });
        
        // ドロップダウンアイテムのクリックイベント
        const dropdownItems = newMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // メニューを閉じる
            newMenu.classList.remove('show');
            
            // モーダルを表示
            const modalId = this.getAttribute('data-modal-id');
            // Bootstrap 5のモーダルを直接操作
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
              const bsModal = new bootstrap.Modal(modalElement);
              bsModal.show();
            }
          });
        });
        
        // ドキュメントのクリックでメニューを閉じる
        document.addEventListener('click', function(e) {
          if (!newButton.contains(e.target) && !newMenu.contains(e.target)) {
            newMenu.classList.remove('show');
          }
        });
        
        console.log('新規登録ボタンを完全に置換しました');
      } else {
      console.log('新規登録ドロップダウンが見つかりません - 手動で作成します');
      
      // ログインボタンを基準に場所を特定
      const loginButton = document.querySelector('button[data-bs-target="#loginModal"]');
      if (loginButton && loginButton.parentNode) {
        
        // ログインボタンの隣に新規登録ボタンを作成
        const registerContainer = document.createElement('div');
        registerContainer.className = 'dropdown d-inline-block ms-2';
        registerContainer.innerHTML = `
          <button class="btn btn-light dropdown-toggle" type="button" id="manual-register-dropdown" 
                  aria-expanded="false">
            新規登録
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="manual-register-dropdown">
            <li>
              <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#registerTouristModal">
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
              <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#registerGuideModal">
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
        `;
        
        // ログインボタンの後に挿入
        loginButton.parentNode.appendChild(registerContainer);
        
        // 手動でドロップダウン機能を追加
        const manualDropdown = document.getElementById('manual-register-dropdown');
        const dropdownMenu = manualDropdown.nextElementSibling;
        
        manualDropdown.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
          } else {
            dropdownMenu.classList.add('show');
          }
        });
        
        // ドキュメントクリックでメニューを閉じる
        document.addEventListener('click', function(e) {
          if (!manualDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
          }
        });
      }
    }
  }
  
  /**
   * URLパラメータに基づいて言語切り替え
   */
  function translateBasedOnUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    
    if (lang === 'en') {
      console.log('英語モードを適用します');
      translatePage();
    }
  }
  
  /**
   * ページを英語に翻訳
   */
  function translatePage() {
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
    
    // テキストを含む要素をすべて取得
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, label, option, div, li');
    
    elements.forEach(function(element) {
      // 子要素が少ない場合のみ処理（複雑な要素は対象外）
      if (element.children.length <= 2) {
        const text = element.textContent.trim();
        if (translations[text]) {
          element.textContent = translations[text];
        }
      }
    });
    
    // 特別な要素（入力フィールドのプレースホルダーなど）
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(function(input) {
      const placeholder = input.getAttribute('placeholder');
      if (placeholder && translations[placeholder]) {
        input.setAttribute('placeholder', translations[placeholder]);
      }
    });
    
    // 言語ボタンの状態を更新
    updateLanguageButtonsState('en');
  }
  
  /**
   * 言語ボタンの状態を更新
   */
  function updateLanguageButtonsState(lang) {
    // ヘッダーとフッターの両方の言語ボタンに対応
    const jaButtons = document.querySelectorAll('#ja-button, #ja-button-footer, [data-lang="ja"]');
    const enButtons = document.querySelectorAll('#en-button, #en-button-footer, [data-lang="en"]');
    
    if (lang === 'en') {
      // 英語ボタンをアクティブに
      jaButtons.forEach(btn => {
        if (btn) btn.classList.remove('active');
      });
      enButtons.forEach(btn => {
        if (btn) btn.classList.add('active');
      });
    } else {
      // 日本語ボタンをアクティブに
      jaButtons.forEach(btn => {
        if (btn) btn.classList.add('active');
      });
      enButtons.forEach(btn => {
        if (btn) btn.classList.remove('active');
      });
    }
  }
})();