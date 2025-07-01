/**
 * 即座修正システム - シンプルで確実な翻訳
 */

// 即座実行（DOMContentLoaded不要）
(function() {
  console.log('🚀 即座修正システム開始');

  // 翻訳マップ
  const translations = {
    '70人のガイドが見つかりました': 'Found 70 guides',
    '詳細を見る': 'See Details',
    '新規登録': 'Sign Up',
    'ログイン': 'Login',
    '登録方法を選択してください': 'Choose registration method',
    '旅行者として登録': 'Register as Tourist',
    'ガイドとして登録': 'Register as Guide',
    'ローカルガイドと一緒に特別な旅を体験': 'Experience special journeys with local guides',
    'あなたの知識と経験を共有しましょう': 'Share your knowledge and experience',
    '橋本 学': 'Manabu Hashimoto',
    '山本 和也': 'Kazuya Yamamoto',
    '高橋 洋子': 'Yoko Takahashi',
    'ナイトマーケットを中心に、北海道の魅力をお伝えします。写真や動画の生活や文化体験できます。': 'Focusing on night markets, I will share the charm of Hokkaido. You can experience photography, videos, local life and culture.',
    'アートを基軸に古い石川県の魅力をお伝えします。現地の生活や文化も体験できます。': 'Experience the charm of old Ishikawa Prefecture through art. You can also experience local life and culture.',
    '鹿児島県の歴史と文化に精通したガイドです。歴史から寺院まで幅広くご案内します。': 'A guide well-versed in the history and culture of Kagoshima Prefecture. I provide comprehensive guidance from history to temples.',
    '東京都のローカルフードとトレンドスポットを知り尽くしています。直筆好きの方にもおすすめです。': 'I know all about Tokyo\'s local food and trendy spots. Also recommended for those who love handwriting.',
    '青森県で育った地元民ならではの視点で、写真や動画撮影スポットを案内します。': 'As a local who grew up in Aomori Prefecture, I will guide you to photo and video shooting spots from a unique local perspective.',
    '北海道': 'Hokkaido',
    '札幌市': 'Sapporo',
    '青森県': 'Aomori',
    '東京都': 'Tokyo',
    '新宿区': 'Shinjuku',
    '小笠原島': 'Ogasawara Islands',
    '日本語': 'Japanese',
    '英語': 'English',
    '中国語': 'Chinese',
    '韓国語': 'Korean'
  };

  // 現在の言語を取得
  function getCurrentLang() {
    return localStorage.getItem('selectedLanguage') || localStorage.getItem('language') || 'ja';
  }

  // 即座翻訳実行
  function runTranslation() {
    if (getCurrentLang() !== 'en') return;

    console.log('翻訳実行中...');
    let count = 0;

    // 全要素を検索して翻訳
    document.querySelectorAll('*').forEach(element => {
      if (element.children.length === 0) { // テキストのみの要素
        const text = element.textContent.trim();
        if (translations[text]) {
          element.textContent = translations[text];
          count++;
          console.log('翻訳:', text, '→', translations[text]);
        }
      }
    });

    console.log(`翻訳完了: ${count}件`);
  }

  // 新規登録ボタン修復
  function fixRegisterButton() {
    console.log('新規登録ボタン修復中...');
    
    // シンプルな新規登録ボタンを確認
    const registerBtn = document.querySelector('button[onclick="showRegisterOptions()"]');
    if (registerBtn) {
      console.log('新規登録ボタン発見');
      
      // 言語に応じてテキスト変更
      if (getCurrentLang() === 'en') {
        registerBtn.textContent = 'Sign Up';
      }
      
      // 確実にクリック機能を設定
      registerBtn.onclick = function() {
        console.log('新規登録ボタンクリック');
        const modal = document.getElementById('registerOptionsModal');
        if (modal && typeof bootstrap !== 'undefined') {
          const modalInstance = new bootstrap.Modal(modal);
          modalInstance.show();
          console.log('登録オプションモーダル表示');
        }
      };
    }

    // モーダル内のボタンも確認
    const modalButtons = document.querySelectorAll('#registerOptionsModal button[data-bs-toggle="modal"]');
    modalButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        console.log('モーダルボタンクリック:', this.textContent);
      });
    });
  }

  // 言語切り替え処理
  function setupLanguageSwitch() {
    document.querySelectorAll('#lang-en, #lang-ja').forEach(btn => {
      btn.addEventListener('click', function() {
        const lang = this.id === 'lang-en' ? 'en' : 'ja';
        localStorage.setItem('selectedLanguage', lang);
        console.log('言語変更:', lang);
        
        if (lang === 'en') {
          setTimeout(runTranslation, 100);
          setTimeout(runTranslation, 500);
        } else {
          location.reload();
        }
      });
    });
  }

  // 即座実行
  runTranslation();
  fixRegisterButton();
  setupLanguageSwitch();

  // 遅延実行（確実性のため）
  setTimeout(runTranslation, 1000);
  setTimeout(runTranslation, 3000);
  setTimeout(fixRegisterButton, 2000);

})();

console.log('immediate-fix.js読み込み完了');