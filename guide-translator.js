/**
 * ガイドプロフィールページ専用翻訳モジュール
 * 既存の言語切り替え機能を拡張するのではなく、完全に独立して動作する
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイドプロフィール翻訳モジュールを初期化中...');
  
  // 現在の言語を取得
  const currentLang = localStorage.getItem('localGuideLanguage') || 'ja';
  // 英語強制フラグもチェック
  const forcedEnglish = sessionStorage.getItem('forcedEnglish') === 'true';
  console.log('現在の言語設定:', currentLang, '英語強制フラグ:', forcedEnglish);
  
  // 初期状態で適用（言語設定が英語、または英語強制フラグがある場合）
  if (currentLang === 'en' || forcedEnglish) {
    console.log('初期状態で英語翻訳を適用します');
    translateToEnglish();
  }
  
  // タブ切り替え時にも翻訳を適用
  setupTabChangeListeners();
  
  // 言語切り替えボタンにイベントハンドラを設定
  setupLanguageButtons();
  
  /**
   * タブ切り替え時のリスナーを設定
   */
  function setupTabChangeListeners() {
    // サイドバーメニューのリンクに対して、クリックイベントを監視
    document.querySelectorAll('.list-group-item').forEach(item => {
      item.addEventListener('click', function() {
        // 少し遅延を入れて、DOM更新後に翻訳を適用
        setTimeout(() => {
          const currentLanguage = localStorage.getItem('localGuideLanguage') || 'ja';
          const forcedEnglish = sessionStorage.getItem('forcedEnglish') === 'true';
          if (currentLanguage === 'en' || forcedEnglish) {
            console.log('タブ切り替え後に翻訳を再適用します');
            translateToEnglish();
          }
        }, 100);
      });
    });
    
    // アカウント設定タブへのクリックを特別に監視
    const accountSettingsLink = document.querySelector('.list-group-item:nth-child(5), a[href="#accountSettingsTab"]');
    if (accountSettingsLink) {
      accountSettingsLink.addEventListener('click', function() {
        // アカウント設定タブが選択された場合は、少し長めの遅延を設定
        // これにより、DOM要素が完全に更新された後に翻訳が適用される
        setTimeout(() => {
          const forcedEnglish = sessionStorage.getItem('forcedEnglish') === 'true';
          const currentLanguage = localStorage.getItem('localGuideLanguage') || 'ja';
          if (currentLanguage === 'en' || forcedEnglish) {
            console.log('アカウント設定タブが選択されました - 特別な翻訳処理を適用します');
            // 特殊なアカウント設定用の翻訳を実行
            // アカウント設定の特別処理と標準の翻訳を適用
            translateToEnglish();
          }
        }, 300);
      });
    }
    
    // タブ内容が変更された時にMutationObserverで検知して翻訳適用
    const tabContent = document.querySelector('.tab-content');
    if (tabContent) {
      const observer = new MutationObserver(function(mutations) {
        // セッションストレージの強制英語フラグをチェック
        const forcedEnglish = sessionStorage.getItem('forcedEnglish') === 'true';
        const currentLanguage = localStorage.getItem('localGuideLanguage') || 'ja';
        
        if (currentLanguage === 'en' || forcedEnglish) {
          console.log('コンテンツ変更を検知、翻訳を再適用します');
          translateToEnglish();
        }
      });
      
      observer.observe(tabContent, { 
        childList: true, 
        subtree: true,
        characterData: true
      });
    }
    
    // コンテンツ読み込み完了時にも実行
    window.addEventListener('load', function() {
      const currentLanguage = localStorage.getItem('localGuideLanguage') || 'ja';
      const forcedEnglish = sessionStorage.getItem('forcedEnglish') === 'true';
      if (currentLanguage === 'en' || forcedEnglish) {
        console.log('ページ読み込み完了時に翻訳を再適用します');
        translateToEnglish();
      }
    });
    
    // サイドバータブのクリックを監視（追加のセレクタでも対応）
    document.querySelectorAll('.list-group-item, nav-link, .sidebar-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        // タブクリック時に100ms遅延で翻訳を適用
        setTimeout(() => {
          const forcedEnglish = sessionStorage.getItem('forcedEnglish') === 'true';
          const currentLanguage = localStorage.getItem('localGuideLanguage') || 'ja';
          
          if (currentLanguage === 'en' || forcedEnglish) {
            console.log('タブクリック後に翻訳を再適用します');
            translateToEnglish();
          }
        }, 100);
      });
    });
  }
  
  /**
   * 言語切り替えボタンの設定
   */
  function setupLanguageButtons() {
    // 言語ボタンを取得
    const engBtn = document.querySelector('.dropdown-item[data-lang="en"]');
    const jpnBtn = document.querySelector('.dropdown-item[data-lang="ja"]');
    
    if (engBtn) {
      console.log('英語ボタン見つかりました - イベントハンドラを設定します');
      engBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語ボタンがクリックされました');
        setLanguage('en');
      });
    } else {
      console.warn('英語ボタンが見つかりません');
    }
    
    if (jpnBtn) {
      console.log('日本語ボタン見つかりました - イベントハンドラを設定します');
      jpnBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('日本語ボタンがクリックされました');
        setLanguage('ja');
      });
    } else {
      console.warn('日本語ボタンが見つかりません');
    }
  }
  
  /**
   * 言語を設定
   */
  function setLanguage(lang) {
    console.log(`言語を ${lang} に設定します`);
    localStorage.setItem('localGuideLanguage', lang);
    
    if (lang === 'en') {
      // 一度英語に切り替えた状態を保持するためのフラグをセット
      sessionStorage.setItem('forcedEnglish', 'true');
      translateToEnglish();
    } else {
      // 英語強制フラグを削除
      sessionStorage.removeItem('forcedEnglish');
      // 日本語はデフォルトなのでページをリロード
      window.location.reload();
    }
    
    // 言語ドロップダウンボタンを更新
    updateLanguageDropdown(lang);
  }
  
  /**
   * 言語ドロップダウンのテキストを更新
   */
  function updateLanguageDropdown(lang) {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
      dropdown.textContent = lang === 'en' ? 'English' : '日本語';
    }
  }
  
  /**
   * 英語に翻訳する
   */
  function translateToEnglish() {
    // セッションストレージに英語強制フラグをセット（自動的な翻訳実行のため）
    sessionStorage.setItem('forcedEnglish', 'true');
    
    // ページタイトル
    document.title = 'Guide Profile Management | Local Guide';
    
    // ページ内のh1, h2を翻訳
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      pageTitle.textContent = 'Guide Profile Management';
    }
    
    // 現在のページのコンテンツの見出しも翻訳（h1, h2などが含まれている場合）
    const mainHeadings = document.querySelectorAll('.tab-content h1, .tab-content h2, .tab-content h3, .form-label');
    mainHeadings.forEach(heading => {
      if (heading.textContent.includes('アカウント設定')) heading.textContent = 'Account Settings';
      else if (heading.textContent.includes('ギャラリー写真')) heading.textContent = 'Gallery Photos';
      else if (heading.textContent.includes('メッセージ')) heading.textContent = 'Messages';
      else if (heading.textContent.includes('通知設定')) heading.textContent = 'Notification Settings';
      else if (heading.textContent.includes('パスワード確認')) heading.textContent = 'Confirm Password';
      else if (heading.textContent.includes('新しいパスワード')) heading.textContent = 'New Password';
      else if (heading.textContent.includes('現在のパスワード')) heading.textContent = 'Current Password';
      else if (heading.textContent.includes('アカウント削除')) heading.textContent = 'Delete Account';
    });
    
    // アカウント設定タブ内のタイトルも確実に翻訳
    document.querySelectorAll('#accountSettingsTab .form-label, #accountSettingsTab label').forEach(label => {
      if (label.textContent.includes('現在のパスワード')) label.textContent = 'Current Password';
      else if (label.textContent.includes('新しいパスワード')) label.textContent = 'New Password';
      else if (label.textContent.includes('パスワード確認')) label.textContent = 'Confirm Password';
    });
    
    // ユーザーメニューの翻訳（右上のユーザー名の「さん」部分を変更）
    const userMenu = document.querySelector('.dropdown-toggle.btn-secondary');
    if (userMenu) {
      let userMenuText = userMenu.textContent;
      userMenuText = userMenuText.replace(' さん', '');
      userMenu.textContent = userMenuText;
    }
    
    // ナビゲーションメニュー
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
      if (link.textContent.includes('ホーム')) link.textContent = 'Home';
      else if (link.textContent.includes('ガイドを探す')) link.textContent = 'Find Guides';
      else if (link.textContent.includes('使い方')) link.textContent = 'How to Use';
    });
    
    // サイドバーメニューアイテム（より幅広いセレクタでカバレッジを向上）
    document.querySelectorAll('.list-group-item, .list-group a, .nav-link, .sidebar-nav a, .nav-item a, .menu-item a').forEach(item => {
      if (item.textContent.includes('基本情報')) item.textContent = 'Basic Information';
      else if (item.textContent.includes('写真ギャラリー')) item.textContent = 'Photo Gallery';
      else if (item.textContent.includes('スケジュール')) item.textContent = 'Schedule';
      else if (item.textContent.includes('メッセージ')) item.textContent = 'Messages';
      else if (item.textContent.includes('アカウント設定')) item.textContent = 'Account Settings';
    });
    
    // サイドメニュー（より明確にターゲット）
    // プロフィール画像の下にあるユーザー名とサイドメニュー
    const sidebarLinks = document.querySelectorAll('.list-group .list-group-item');
    if (sidebarLinks && sidebarLinks.length > 0) {
      sidebarLinks.forEach(item => {
        if (item.textContent.includes('基本情報')) item.textContent = 'Basic Information';
        else if (item.textContent.includes('写真ギャラリー')) item.textContent = 'Photo Gallery';
        else if (item.textContent.includes('スケジュール')) item.textContent = 'Schedule';
        else if (item.textContent.includes('メッセージ')) item.textContent = 'Messages';
        else if (item.textContent.includes('アカウント設定')) item.textContent = 'Account Settings';
      });
    }
    
    // プロフィールの名前を英語形式に
    const profileName = document.querySelector('.profile-name');
    if (profileName && profileName.textContent.includes('テスト桃太郎')) {
      profileName.textContent = 'Momotaro Tester';
    }
    
    // フォームのラベル
    document.querySelectorAll('label').forEach(label => {
      if (label.textContent.includes('氏名')) label.textContent = 'Full Name';
      else if (label.textContent.includes('ユーザー名')) label.textContent = 'Username';
      else if (label.textContent.includes('メールアドレス')) label.textContent = 'Email Address';
      else if (label.textContent.includes('活動エリア')) label.textContent = 'Activity Area';
      else if (label.textContent.includes('対応言語')) label.textContent = 'Supported Languages';
      else if (label.textContent.includes('自己紹介')) label.textContent = 'Self Introduction';
      else if (label.textContent.includes('セッション料金')) label.textContent = 'Session Fee (per session)';
      else if (label.textContent.includes('得意分野・興味')) label.textContent = 'Specialties & Interests';
      else if (label.textContent.includes('この曜日は活動可能')) label.textContent = 'Available on this day';
      else if (label.textContent.includes('開始時間')) label.textContent = 'Start Time';
      else if (label.textContent.includes('終了時間')) label.textContent = 'End Time';
      else if (label.textContent.includes('現在のパスワード')) label.textContent = 'Current Password';
      else if (label.textContent.includes('新しいパスワード')) label.textContent = 'New Password';
      else if (label.textContent.includes('パスワード確認')) label.textContent = 'Confirm Password';
      else if (label.textContent.includes('通知設定')) label.textContent = 'Notification Settings';
    });
    
    // チェックボックスラベル
    document.querySelectorAll('.form-check-label').forEach(label => {
      if (label.textContent.includes('ナイトツアー')) label.textContent = 'Night Tours';
      else if (label.textContent.includes('グルメ')) label.textContent = 'Gourmet';
      else if (label.textContent.includes('写真スポット')) label.textContent = 'Photo Spots';
      else if (label.textContent.includes('料理')) label.textContent = 'Cooking';
      else if (label.textContent.includes('アクティビティ')) label.textContent = 'Activities';
    });
    
    // スケジュールタブ
    document.querySelectorAll('#scheduleTab .nav-link').forEach(tab => {
      if (tab.textContent.includes('月')) tab.textContent = tab.classList.contains('mobile-only') ? 'Mon' : 'Monday';
      else if (tab.textContent.includes('火')) tab.textContent = tab.classList.contains('mobile-only') ? 'Tue' : 'Tuesday';
      else if (tab.textContent.includes('水')) tab.textContent = tab.classList.contains('mobile-only') ? 'Wed' : 'Wednesday';
      else if (tab.textContent.includes('木')) tab.textContent = tab.classList.contains('mobile-only') ? 'Thu' : 'Thursday';
      else if (tab.textContent.includes('金')) tab.textContent = tab.classList.contains('mobile-only') ? 'Fri' : 'Friday';
      else if (tab.textContent.includes('土')) tab.textContent = tab.classList.contains('mobile-only') ? 'Sat' : 'Saturday';
      else if (tab.textContent.includes('日')) tab.textContent = tab.classList.contains('mobile-only') ? 'Sun' : 'Sunday';
    });
    
    // 見出し
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      if (heading.textContent.includes('基本情報')) heading.textContent = 'Basic Information';
      else if (heading.textContent.includes('写真ギャラリー')) heading.textContent = 'Photo Gallery';
      else if (heading.textContent.includes('予約状況サマリー')) heading.textContent = 'Booking Summary';
      else if (heading.textContent.includes('時間帯設定')) heading.textContent = 'Time Settings';
      else if (heading.textContent.includes('予約カレンダー')) heading.textContent = 'Reservation Calendar';
      else if (heading.textContent.includes('次回の予約')) heading.textContent = 'Next Reservation';
    });
    
    // 説明テキスト
    document.querySelectorAll('p, .form-text, small, .small').forEach(text => {
      if (text.textContent.includes('プロフィールURLに使用されます')) text.textContent = 'This will be used in your profile URL';
      else if (text.textContent.includes('標準料金は¥6,000/回です')) text.textContent = 'The standard fee is ¥6,000/session. Setting a higher fee may result in fewer bookings.';
      else if (text.textContent.includes('最大15枚まで設定')) text.textContent = 'You can set up to 15 photos.';
      else if (text.textContent.includes('緑色の日付は予約可能')) text.textContent = 'Green dates are available for booking, red dates are fully booked.';
      else if (text.textContent.includes('今月の予約数')) text.textContent = 'Reservations this month';
      else if (text.textContent.includes('来月の予約数')) text.textContent = 'Reservations next month';
      else if (text.textContent.includes('キャンセル数')) text.textContent = 'Cancellations';
      else if (text.textContent.includes('総予約日数')) text.textContent = 'Total booking days';
      else if (text.textContent.includes('8文字以上で、英数字を含めてください')) text.textContent = 'Please use at least 8 characters including letters and numbers';
      else if (text.textContent.includes('アカウントを削除すると、すべての情報が完全に削除されます。この操作は取り消せません。')) 
        text.textContent = 'Deleting your account will permanently remove all your information. This action cannot be undone.';
    });
    
    // ボタン
    document.querySelectorAll('button.btn, a.btn, input.btn, input[type="submit"], input[type="button"]').forEach(btn => {
      if (btn.textContent && btn.textContent.includes('保存する')) btn.textContent = 'Save';
      else if (btn.textContent && btn.textContent.includes('保存')) btn.textContent = 'Save';
      else if (btn.textContent && btn.textContent.includes('変更を保存')) btn.textContent = 'Save Changes';
      else if (btn.textContent && btn.textContent.includes('写真を追加')) btn.textContent = 'Add Photo';
      else if (btn.textContent && btn.textContent.includes('スケジュールを保存')) btn.textContent = 'Save Schedule';
      else if (btn.textContent && btn.textContent.includes('前月')) btn.textContent = 'Previous Month';
      else if (btn.textContent && btn.textContent.includes('翌月')) btn.textContent = 'Next Month';
      else if (btn.textContent && btn.textContent.includes('今月')) btn.textContent = 'Current Month';
      else if (btn.textContent && btn.textContent.includes('前年')) btn.textContent = 'Previous Year';
      else if (btn.textContent && btn.textContent.includes('翌年')) btn.textContent = 'Next Year';
      else if (btn.textContent && btn.textContent.includes('パスワードを変更')) btn.textContent = 'Change Password';
      else if (btn.textContent && btn.textContent.includes('アカウントを削除')) btn.textContent = 'Delete Account';
      
      // input要素の値を翻訳
      if (btn.value) {
        if (btn.value.includes('パスワードを変更')) btn.value = 'Change Password';
        else if (btn.value.includes('保存')) btn.value = 'Save';
        else if (btn.value.includes('変更を保存')) btn.value = 'Save Changes';
        else if (btn.value.includes('保存する')) btn.value = 'Save';
      }
    });
    
    // 言語選択オプション
    document.querySelectorAll('select[id="guide-languages"] option').forEach(option => {
      if (option.textContent === '日本語') option.textContent = 'Japanese';
      else if (option.textContent === '英語') option.textContent = 'English';
      else if (option.textContent === '中国語') option.textContent = 'Chinese';
      else if (option.textContent === '韓国語') option.textContent = 'Korean';
      else if (option.textContent === 'フランス語') option.textContent = 'French';
      else if (option.textContent === 'ドイツ語') option.textContent = 'German';
      else if (option.textContent === 'スペイン語') option.textContent = 'Spanish';
      else if (option.textContent === 'イタリア語') option.textContent = 'Italian';
      else if (option.textContent === 'ロシア語') option.textContent = 'Russian';
      else if (option.textContent === 'その他') option.textContent = 'Other';
    });
    
    // 入力フィールドのプレースホルダー
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
      if (input.placeholder.includes('例：東京都新宿区')) {
        input.placeholder = 'e.g., Shinjuku, Tokyo';
      } else if (input.placeholder.includes('キーワード')) {
        input.placeholder = 'Enter keywords (separate with commas)';
      }
    });
    
    // プロフィール写真のalt属性を翻訳
    document.querySelectorAll('img[alt]').forEach(img => {
      if (img.alt.includes('プロフィール写真')) {
        img.alt = 'Profile Photo';
      }
    });
    
    // プロフィール画像の下のテキスト翻訳
    document.querySelectorAll('.sidebar-user-info').forEach(element => {
      // ユーザー情報の表示を修正（名前を英語形式に）
      if (element.textContent.includes('テスト桃太郎')) {
        element.innerHTML = element.innerHTML.replace(/テスト桃太郎\d*@gmail\.com/, 'Momotaro Tester');
      }
    });
    
    // アカウント設定関連
    document.querySelectorAll('.form-check-input').forEach(input => {
      if (input.id && input.id.includes('notification')) {
        const label = input.nextElementSibling;
        if (label && label.tagName === 'LABEL') {
          if (label.textContent.includes('新しいメッセージがあった場合にメール通知を受け取る')) {
            label.textContent = 'Receive email notifications when there are new messages';
          } else if (label.textContent.includes('新しい予約があった場合にメール通知を受け取る')) {
            label.textContent = 'Receive email notifications when there are new bookings';
          }
        }
      }
    });
    
    // アカウント設定画面の特殊ケース
    // パスワード変更フォームとセキュリティ設定
    document.querySelectorAll('.tab-content h2, .tab-content h3').forEach(heading => {
      if (heading.textContent.includes('アカウント設定')) heading.textContent = 'Account Settings';
      else if (heading.textContent.includes('パスワード変更')) heading.textContent = 'Change Password';
      else if (heading.textContent.includes('通知設定')) heading.textContent = 'Notification Settings';
      else if (heading.textContent.includes('セキュリティ設定')) heading.textContent = 'Security Settings';
      else if (heading.textContent.includes('写真を追加')) heading.textContent = 'Add Photos';
      else if (heading.textContent.includes('ギャラリー写真')) heading.textContent = 'Gallery Photos';
    });
    
    // パスワード関連の説明テキスト
    document.querySelectorAll('.tab-content small, .tab-content .text-muted').forEach(element => {
      if (element.textContent.includes('8文字以上で、英数字を含めてください')) {
        element.textContent = 'Please use at least 8 characters including letters and numbers';
      }
    });
    
    // メッセージの受信箱・送信済み
    document.querySelectorAll('.nav-link, .nav-item').forEach(tab => {
      if (tab.textContent.includes('受信箱')) tab.textContent = 'Inbox';
      else if (tab.textContent.includes('送信済み')) tab.textContent = 'Sent';
    });
    
    console.log('英語翻訳が適用されました');
  }
});