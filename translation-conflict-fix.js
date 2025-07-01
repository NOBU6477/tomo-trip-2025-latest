/**
 * 翻訳競合修正システム
 * 複数の翻訳システム間の競合を解決し、点滅問題を修正
 */

(function() {
  'use strict';

  console.log('🔧 翻訳競合修正システム開始');

  // 翻訳状態管理
  let translationInProgress = false;
  let translatedElements = new Set();

  // 統一翻訳マッピング
  const unifiedTranslations = {
    // ボタン類
    '詳細を見る': 'See Details',
    'ガイド登録': 'Register as Guide', 
    '新規登録': 'Sign Up',
    'ログイン': 'Login',
    
    // ガイドカウンター
    '70人のガイドが見つかりました': 'Found 70 guides',
    
    // ベネフィット説明文（完全版）
    '観光客の方を友達としてお迎えするだけです': 'Simply welcome tourists as friends',
    '趣味や特技、専門知識を活かしたオリジナルのガイド体験を提供することで、情熱を収入に変えられます。': 'Turn your passion into income by providing original guide experiences using your hobbies, skills, and expertise.',
    '様々な国や文化からきた旅行者との交流を通じて、国際的な人脈を広げ、異文化理解を深められます。': 'Expand your international network and deepen cross-cultural understanding through interactions with travelers from various countries and cultures.',
    '外国語を使う実践的な機会が得られ、コミュニケーション能力が自然と高まります。': 'Gain practical opportunities to use foreign languages and naturally improve your communication skills.',
    
    // ガイドカード説明文
    '青森県で育った地元民ならではの視点で、写真や動画撮影スポットを案内します。': 'As a local who grew up in Aomori Prefecture, I will guide you to photo and video shooting spots from a unique local perspective.',
    '東京都の歴史と文化に精通したガイドです。温泉からリラクゼーションまで幅広くご案内します。': 'A guide well-versed in the history and culture of Tokyo. I provide comprehensive guidance from hot springs to relaxation.',
    '東京都のローカルフードとトレンドスポットを知り尽くしています。直筆好きの方にもおすすめです。': 'I know all about Tokyo\'s local food and trendy spots. Also recommended for those who love handwriting.',
    
    // How to Use セクション
    '簡単な情報入力と電話番号認証で登録完了': 'Complete registration with simple information entry and phone number verification',
    
    // 地域・言語タグ
    '青森県': 'Aomori',
    '東京都': 'Tokyo', 
    '新宿区': 'Shinjuku',
    '小笠原島': 'Ogasawara Islands',
    '日本語': 'Japanese',
    '中国語': 'Chinese',
    '韓国語': 'Korean',
    '英語': 'English'
  };

  // 一回だけ翻訳する関数
  function translateOnce(element, japaneseText, englishText) {
    const elementId = element.getAttribute('data-translated-id') || Math.random().toString(36);
    element.setAttribute('data-translated-id', elementId);
    
    if (!translatedElements.has(elementId) && element.textContent.trim() === japaneseText) {
      element.textContent = englishText;
      translatedElements.add(elementId);
      element.setAttribute('data-translation-fixed', 'true');
      console.log('一回翻訳完了:', japaneseText, '→', englishText);
      return true;
    }
    return false;
  }

  // 統一翻訳実行
  function executeUnifiedTranslation() {
    if (translationInProgress) return;
    
    const currentLang = localStorage.getItem('selectedLanguage') || localStorage.getItem('language') || 'ja';
    if (currentLang !== 'en') return;

    translationInProgress = true;
    console.log('🔄 統一翻訳実行開始');

    let translationsApplied = 0;

    // 全ての要素を検索して一回だけ翻訳
    document.querySelectorAll('*').forEach(element => {
      // 既に翻訳済みの要素はスキップ
      if (element.getAttribute('data-translation-fixed') === 'true') return;
      
      const text = element.textContent.trim();
      
      // 完全一致翻訳
      for (const [japanese, english] of Object.entries(unifiedTranslations)) {
        if (text === japanese) {
          if (translateOnce(element, japanese, english)) {
            translationsApplied++;
          }
          break;
        }
      }

      // 部分一致翻訳（ボタンなど）
      if (text.includes('詳細を見る') && element.tagName === 'BUTTON') {
        if (translateOnce(element, text, 'See Details')) {
          translationsApplied++;
        }
      }
    });

    console.log(`🔄 統一翻訳完了: ${translationsApplied}件の翻訳を適用`);
    translationInProgress = false;
  }

  // 他の翻訳システムを無効化
  function disableOtherTranslationSystems() {
    // MutationObserverを停止
    if (window.dynamicTranslationObserver) {
      window.dynamicTranslationObserver.disconnect();
      console.log('動的翻訳オブザーバー停止');
    }
    
    // 他の翻訳関数を無効化
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
      if (callback.toString().includes('translate') || 
          callback.toString().includes('Translation') ||
          callback.toString().includes('詳細を見る')) {
        console.log('翻訳関連setTimeout無効化');
        return;
      }
      return originalSetTimeout.call(this, callback, delay);
    };
  }

  // ヘッダーボタン修正
  function fixHeaderButtons() {
    console.log('🔧 ヘッダーボタン修正開始');
    
    // 新規登録ドロップダウンボタンを確認
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown) {
      console.log('新規登録ドロップダウンボタン発見');
      
      // Bootstrapドロップダウンが正常に機能するか確認
      if (typeof bootstrap !== 'undefined') {
        // ドロップダウン機能を再初期化
        const dropdown = new bootstrap.Dropdown(registerDropdown);
        console.log('Bootstrapドロップダウン再初期化完了');
        
        // ドロップダウン内のボタンも確認
        const touristRegisterBtn = document.querySelector('[data-bs-target="#registerTouristModal"]');
        const guideRegisterBtn = document.querySelector('[data-bs-target="#registerGuideModal"]');
        
        if (touristRegisterBtn) {
          touristRegisterBtn.addEventListener('click', function() {
            console.log('ツーリスト登録ボタンクリック');
          });
        }
        
        if (guideRegisterBtn) {
          guideRegisterBtn.addEventListener('click', function() {
            console.log('ガイド登録ボタンクリック');
          });
        }
      } else {
        console.error('Bootstrap未定義: ドロップダウン機能を使用できません');
      }
      
      // テキスト翻訳
      const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
      if (currentLang === 'en') {
        registerDropdown.textContent = 'Sign Up';
        
        // ドロップダウン項目も翻訳
        const touristOption = document.querySelector('.dropdown-item .fw-bold');
        if (touristOption && touristOption.textContent.includes('旅行者として登録')) {
          touristOption.textContent = 'Register as Tourist';
          const touristDesc = touristOption.nextElementSibling;
          if (touristDesc) {
            touristDesc.textContent = 'Experience special journeys with local guides';
          }
        }
        
        const guideOption = document.querySelectorAll('.dropdown-item .fw-bold')[1];
        if (guideOption && guideOption.textContent.includes('ガイドとして登録')) {
          guideOption.textContent = 'Register as Guide';
          const guideDesc = guideOption.nextElementSibling;
          if (guideDesc) {
            guideDesc.textContent = 'Share your knowledge and experience';
          }
        }
      }
    }
    
    // ログインボタンも翻訳
    const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
    if (loginBtn) {
      const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
      loginBtn.textContent = currentLang === 'en' ? 'Login' : 'ログイン';
    }
  }

  // 初期化
  function initialize() {
    // 他の翻訳システムを無効化
    disableOtherTranslationSystems();
    
    // 統一翻訳実行
    setTimeout(executeUnifiedTranslation, 100);
    setTimeout(executeUnifiedTranslation, 500);
    setTimeout(executeUnifiedTranslation, 1000);
    
    // ヘッダーボタン修正
    setTimeout(fixHeaderButtons, 200);
    
    // 言語切り替え時の処理
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('language-option') || 
          e.target.closest('.language-option')) {
        setTimeout(() => {
          translatedElements.clear();
          executeUnifiedTranslation();
          fixHeaderButtons();
        }, 100);
      }
    });
  }

  // DOM準備完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // グローバル公開
  window.translationConflictFix = {
    execute: executeUnifiedTranslation,
    fixButtons: fixHeaderButtons
  };

})();