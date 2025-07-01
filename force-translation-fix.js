/**
 * 強制翻訳修正システム
 * HTMLに直接書かれているテキストも含めて完全翻訳を実行
 */

(function() {
  'use strict';

  console.log('🔧 強制翻訳修正システム開始');

  // 強制翻訳マッピング
  const forceTranslations = {
    // ガイドカウンター
    '70人のガイドが見つかりました': 'Found 70 guides',
    '人のガイドが見つかりました': ' guides found',
    'ガイドが見つかりました': 'guides found',
    
    // ガイドカード説明文
    'アートを基軸に古い石川県の魅力をお伝えします。現地の生活や文化も体験できます。': 'Experience the charm of old Ishikawa Prefecture through art. You can also experience local life and culture.',
    '鹿児島県の歴史と文化に精通したガイドです。歴史から寺院まで幅広くご案内します。': 'A guide well-versed in the history and culture of Kagoshima Prefecture. I provide comprehensive guidance from history to temples.',
    '広島県の魅力を知り尽くしたローカルガイドです。ショッピングやファッションのスポットをご案内します。': 'A local guide who knows all about the charm of Hiroshima Prefecture. I will guide you to shopping and fashion spots.',
    
    // ベネフィット説明文（完全一致）
    '地元の方だけが知る特別な場所や体験を共有することで、日常がかけがえのない旅の思い出に変わります。': 'Share special places and experiences that only locals know, transforming everyday moments into irreplaceable travel memories.',
    '形式ばったガイドツアーではなく、友人との交流のように自然な形で地元の魅力を伝えられます。': 'Rather than formal guided tours, you can naturally convey local attractions in a friendly, conversational way.',
    '自分の都合の良い時間にスケジュールを設定できるため、本業や学業と両立しながら収入を得られます。': 'Set your schedule at convenient times, earning income while balancing your main job or studies.',
    '様々な国や文化的な背景を持つ旅行者との交流を通じて、国際的な人脈を広げ、異文化理解を深められます。': 'Expand your international network and deepen cross-cultural understanding through interactions with travelers from various countries and backgrounds.',
    '外国語を使う実践的な機会が得られ、コミュニケーション能力が自然と高まります。': 'Gain practical opportunities to use foreign languages and naturally improve your communication skills.',
    '地元の魅力を発信することで、自分自身の住む地域の理解や愛着がより深くなります。': 'Promote local attractions to deepen your understanding and attachment to your own region.',
    '予約管理、決済、保険など、ガイド活動に必要な基盤をサポートするので安心して活動できます。': 'Reliable support for booking management, payments, insurance, and other infrastructure needed for guide activities.',
    '予約を受ける日時や頻度は完全に自分次第のため、ライフスタイルに合わせた働き方ができます。': 'Complete control over booking schedule and frequency allows you to work according to your lifestyle.',
    '観光客を地元のお店や施設に案内することで、地域経済の活性化とコミュニティの発展に貢献できます。': 'Contribute to local economic revitalization and community development by guiding tourists to local shops and facilities.',
    
    // その他の文言
    '詳細を見る': 'See Details',
    '円/セッション': ' yen/session',
    'セッション': 'session',
    '得意分野:': 'Specialties:',
    '日本語': 'Japanese',
    '英語': 'English',
    '中国語': 'Chinese',
    '韓国語': 'Korean',
    'フランス語': 'French',
    'スペイン語': 'Spanish',
    'ドイツ語': 'German',
    'イタリア語': 'Italian'
  };

  // 強制翻訳実行
  function executeForceTranslation() {
    const currentLang = localStorage.getItem('selectedLanguage') || localStorage.getItem('language') || 'ja';
    if (currentLang !== 'en') return;

    console.log('🔥 強制翻訳実行開始');
    let translationsApplied = 0;

    // 全てのテキストノードを検索して翻訳
    function walkTextNodes(node) {
      if (node.nodeType === 3) { // Text node
        let text = node.nodeValue;
        let originalText = text;
        
        // 完全一致翻訳
        for (const [japanese, english] of Object.entries(forceTranslations)) {
          if (text.includes(japanese)) {
            text = text.replace(japanese, english);
          }
        }
        
        // 数字パターン翻訳
        text = text.replace(/(\d+)人のガイドが見つかりました/g, 'Found $1 guides');
        text = text.replace(/(\d+)人のガイド/g, '$1 guides');
        
        if (text !== originalText) {
          node.nodeValue = text;
          translationsApplied++;
          console.log('強制翻訳適用:', originalText.trim(), '→', text.trim());
        }
      } else if (node.nodeType === 1) { // Element node
        for (let child of node.childNodes) {
          walkTextNodes(child);
        }
      }
    }

    // ページ全体を翻訳
    walkTextNodes(document.body);

    // 特定の要素も個別に処理
    processSpecificElements();

    console.log(`🔥 強制翻訳完了: ${translationsApplied}件の翻訳を適用`);
  }

  // 特定要素の個別処理
  function processSpecificElements() {
    // ガイドカウンター
    document.querySelectorAll('*').forEach(element => {
      if (element.children.length === 0) { // テキストのみの要素
        const text = element.textContent.trim();
        if (text.match(/\d+人のガイドが見つかりました/)) {
          const count = text.match(/\d+/)[0];
          element.textContent = `Found ${count} guides`;
          console.log('ガイドカウンター強制翻訳:', text, '→', element.textContent);
        }
      }
    });

    // ガイドカードの説明文
    document.querySelectorAll('.card-text, .card-text.small, p.small').forEach(element => {
      const text = element.textContent.trim();
      
      // 石川県のカード
      if (text.includes('アートを基軸に') && text.includes('石川県')) {
        element.textContent = 'Experience the charm of old Ishikawa Prefecture through art. You can also experience local life and culture.';
        console.log('石川県ガイド翻訳完了');
      }
      
      // 鹿児島県のカード
      if (text.includes('鹿児島県の歴史と文化') && text.includes('歴史から寺院まで')) {
        element.textContent = 'A guide well-versed in the history and culture of Kagoshima Prefecture. I provide comprehensive guidance from history to temples.';
        console.log('鹿児島県ガイド翻訳完了');
      }
      
      // 広島県のカード
      if (text.includes('広島県の魅力を知り尽くした') && text.includes('ショッピングやファッション')) {
        element.textContent = 'A local guide who knows all about the charm of Hiroshima Prefecture. I will guide you to shopping and fashion spots.';
        console.log('広島県ガイド翻訳完了');
      }
    });

    // ベネフィットカードの説明文
    document.querySelectorAll('.text-muted, p.text-muted').forEach(element => {
      const text = element.textContent.trim();
      
      if (text.includes('地元の方だけが知る特別な場所')) {
        element.textContent = 'Share special places and experiences that only locals know, transforming everyday moments into irreplaceable travel memories.';
        console.log('ベネフィット1翻訳完了');
      }
      
      if (text.includes('自分の都合の良い時間にスケジュール')) {
        element.textContent = 'Set your schedule at convenient times, earning income while balancing your main job or studies.';
        console.log('ベネフィット2翻訳完了');
      }
      
      if (text.includes('様々な国や文化的な背景を持つ旅行者')) {
        element.textContent = 'Expand your international network and deepen cross-cultural understanding through interactions with travelers from various countries and backgrounds.';
        console.log('ベネフィット3翻訳完了');
      }

      if (text.includes('外国語を使う実践的な機会')) {
        element.textContent = 'Gain practical opportunities to use foreign languages and naturally improve your communication skills.';
        console.log('ベネフィット4翻訳完了');
      }

      if (text.includes('地元の魅力を発信することで')) {
        element.textContent = 'Promote local attractions to deepen your understanding and attachment to your own region.';
        console.log('ベネフィット5翻訳完了');
      }

      if (text.includes('予約管理、決済、保険など')) {
        element.textContent = 'Reliable support for booking management, payments, insurance, and other infrastructure needed for guide activities.';
        console.log('ベネフィット6翻訳完了');
      }

      if (text.includes('予約を受ける日時や頻度は完全に自分次第')) {
        element.textContent = 'Complete control over booking schedule and frequency allows you to work according to your lifestyle.';
        console.log('ベネフィット7翻訳完了');
      }

      if (text.includes('観光客を地元のお店や施設に案内')) {
        element.textContent = 'Contribute to local economic revitalization and community development by guiding tourists to local shops and facilities.';
        console.log('ベネフィット8翻訳完了');
      }
    });
  }

  // 強制翻訳実行（複数回実行で確実性向上）
  function initializeForceTranslation() {
    // 即座に実行
    setTimeout(executeForceTranslation, 100);
    
    // 遅延実行（他のスクリプト完了後）
    setTimeout(executeForceTranslation, 500);
    setTimeout(executeForceTranslation, 1000);
    setTimeout(executeForceTranslation, 2000);
    
    // DOM変更監視
    const observer = new MutationObserver(() => {
      const currentLang = localStorage.getItem('selectedLanguage') || localStorage.getItem('language') || 'ja';
      if (currentLang === 'en') {
        setTimeout(executeForceTranslation, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForceTranslation);
  } else {
    initializeForceTranslation();
  }

  // グローバル関数として公開
  window.forceTranslation = {
    execute: executeForceTranslation
  };

})();