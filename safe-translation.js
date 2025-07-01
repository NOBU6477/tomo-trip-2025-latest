/**
 * 安全な翻訳システム - CSPエラー回避版
 */

console.log('🔧 安全な翻訳システム開始');

// 言語設定
const LANG_KEY = 'selectedLanguage';

// 翻訳テーブル（静的定義でCSP安全）
const TRANSLATIONS = {
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
  '鹿児島県の歴史と文化に精通したガイドです。歴史から寺院まで幅広くご案内します。': 'A guide well-versed in the history and culture of Kagoshima Prefecture. I provide comprehensive guidance from history to temples.',
  '東京都のローカルフードとトレンドスポットを知り尽くしています。直筆好きの方にもおすすめです。': 'I know all about Tokyo\'s local food and trendy spots. Also recommended for those who love handwriting.',
  '日本語': 'Japanese',
  '英語': 'English', 
  '中国語': 'Chinese',
  '韓国語': 'Korean'
};

// 現在の言語取得
function getLang() {
  return localStorage.getItem(LANG_KEY) || 'ja';
}

// 言語保存
function saveLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

// 翻訳実行
function translate() {
  if (getLang() !== 'en') return;
  
  console.log('翻訳実行中...');
  let count = 0;
  
  // 全要素を処理
  const allElements = document.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    
    // テキストのみの要素
    if (element.children.length === 0) {
      const text = element.textContent.trim();
      if (TRANSLATIONS[text]) {
        element.textContent = TRANSLATIONS[text];
        count++;
        console.log('翻訳:', text, '→', TRANSLATIONS[text]);
      }
      
      // 数字パターン翻訳
      if (text.match(/\d+人のガイドが見つかりました/)) {
        const newText = text.replace(/(\d+)人のガイドが見つかりました/, 'Found $1 guides');
        element.textContent = newText;
        count++;
        console.log('パターン翻訳:', text, '→', newText);
      }
    }
  }
  
  console.log('翻訳完了:', count + '件');
}

// 新規登録ボタン修復
function fixRegisterBtn() {
  console.log('新規登録ボタン修復');
  
  const btn = document.querySelector('button[onclick="showRegisterOptions()"]');
  if (btn) {
    console.log('ボタン発見');
    
    // 言語対応
    if (getLang() === 'en') {
      btn.textContent = 'Sign Up';
    }
    
    // 機能確保
    btn.onclick = function() {
      console.log('新規登録クリック');
      const modal = document.getElementById('registerOptionsModal');
      if (modal) {
        if (window.bootstrap) {
          new bootstrap.Modal(modal).show();
        } else {
          modal.style.display = 'block';
          modal.classList.add('show');
        }
      }
    };
  }
}

// 言語切り替え
function setupLangSwitch() {
  const enBtn = document.getElementById('lang-en');
  const jaBtn = document.getElementById('lang-ja');
  
  if (enBtn) {
    enBtn.onclick = function() {
      console.log('英語に切り替え');
      saveLang('en');
      setTimeout(translate, 100);
      setTimeout(translate, 500);
      setTimeout(fixRegisterBtn, 200);
    };
  }
  
  if (jaBtn) {
    jaBtn.onclick = function() {
      console.log('日本語に切り替え');
      saveLang('ja');
      location.reload();
    };
  }
}

// 動的監視
function setupObserver() {
  const observer = new MutationObserver(function(mutations) {
    if (getLang() === 'en') {
      let shouldTranslate = false;
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) {
          shouldTranslate = true;
          break;
        }
      }
      if (shouldTranslate) {
        setTimeout(translate, 100);
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// グローバル関数として定義
window.showRegisterOptions = function() {
  console.log('showRegisterOptions 実行');
  const modal = document.getElementById('registerOptionsModal');
  if (modal) {
    if (window.bootstrap) {
      new bootstrap.Modal(modal).show();
      console.log('Bootstrap モーダル表示');
    } else {
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      console.log('代替モーダル表示');
    }
  } else {
    console.error('registerOptionsModal が見つかりません');
  }
};

// 初期化
function init() {
  console.log('初期化開始');
  translate();
  fixRegisterBtn();
  setupLangSwitch();
  setupObserver();
  
  // 遅延実行
  setTimeout(translate, 1000);
  setTimeout(translate, 3000);
  setTimeout(fixRegisterBtn, 2000);
}

// DOM準備完了後実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('safe-translation.js 読み込み完了');