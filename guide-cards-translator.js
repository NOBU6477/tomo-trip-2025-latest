/**
 * ガイドカード専用翻訳スクリプト
 * ガイドカードの自己紹介文を英語に翻訳する機能
 */

(function() {
  'use strict';

  // 翻訳辞書 - ガイドカードの説明文
  const guideDescriptions = {
    // 既存の初期ガイド
    "東京の隠れた名所を案内します。グルメや写真スポットが得意です。": "I'll guide you to Tokyo's hidden gems. I specialize in gourmet spots and photo locations.",
    "京都の伝統文化を体験できるツアーを提供します。寺院や庭園の解説が得意です。": "I provide tours to experience Kyoto's traditional culture. I excel at explaining temples and gardens.",
    "大阪の美味しい食べ物を知り尽くしたガイドです。夜の街歩きも案内します。": "I'm a guide who knows all the delicious food in Osaka. I also guide evening city walks.",
    
    // 生成されるガイドの説明文パターン
    "北海道の魅力を知り尽くしたローカルガイドです。ナイトツアーとグルメが得意分野です。": "I'm a local guide who knows all about Hokkaido's charms. Night tours and gourmet are my specialties.",
    "青森県の魅力を知り尽くしたローカルガイドです。写真スポットと観光が得意分野です。": "I'm a local guide who knows all about Aomori's charms. Photo spots and sightseeing are my specialties.",
    "岩手県の魅力を知り尽くしたローカルガイドです。料理と文化体験が得意分野です。": "I'm a local guide who knows all about Iwate's charms. Cuisine and cultural experiences are my specialties.",
    "宮城県の魅力を知り尽くしたローカルガイドです。歴史散策とアウトドアが得意分野です。": "I'm a local guide who knows all about Miyagi's charms. Historical walks and outdoor activities are my specialties.",
    "秋田県の魅力を知り尽くしたローカルガイドです。ローカル体験と自然が得意分野です。": "I'm a local guide who knows all about Akita's charms. Local experiences and nature are my specialties.",
    "山形県の魅力を知り尽くしたローカルガイドです。季節体験と温泉が得意分野です。": "I'm a local guide who knows all about Yamagata's charms. Seasonal experiences and hot springs are my specialties.",
    "福島県の魅力を知り尽くしたローカルガイドです。グルメと写真スポットが得意分野です。": "I'm a local guide who knows all about Fukushima's charms. Gourmet and photo spots are my specialties.",
    "茨城県の魅力を知り尽くしたローカルガイドです。ナイトツアーとグルメが得意分野です。": "I'm a local guide who knows all about Ibaraki's charms. Night tours and gourmet are my specialties.",
    "栃木県の魅力を知り尽くしたローカルガイドです。写真スポットと観光が得意分野です。": "I'm a local guide who knows all about Tochigi's charms. Photo spots and sightseeing are my specialties.",
    "群馬県の魅力を知り尽くしたローカルガイドです。料理と文化体験が得意分野です。": "I'm a local guide who knows all about Gunma's charms. Cuisine and cultural experiences are my specialties.",
    "埼玉県の魅力を知り尽くしたローカルガイドです。歴史散策とアウトドアが得意分野です。": "I'm a local guide who knows all about Saitama's charms. Historical walks and outdoor activities are my specialties.",
    "千葉県の魅力を知り尽くしたローカルガイドです。ローカル体験と自然が得意分野です。": "I'm a local guide who knows all about Chiba's charms. Local experiences and nature are my specialties.",
    "東京都の魅力を知り尽くしたローカルガイドです。季節体験と温泉が得意分野です。": "I'm a local guide who knows all about Tokyo's charms. Seasonal experiences and hot springs are my specialties.",
    "神奈川県の魅力を知り尽くしたローカルガイドです。グルメと写真スポットが得意分野です。": "I'm a local guide who knows all about Kanagawa's charms. Gourmet and photo spots are my specialties.",
    "新潟県の魅力を知り尽くしたローカルガイドです。ナイトツアーとグルメが得意分野です。": "I'm a local guide who knows all about Niigata's charms. Night tours and gourmet are my specialties.",
    "富山県の魅力を知り尽くしたローカルガイドです。写真スポットと観光が得意分野です。": "I'm a local guide who knows all about Toyama's charms. Photo spots and sightseeing are my specialties.",
    "石川県の魅力を知り尽くしたローカルガイドです。料理と文化体験が得意分野です。": "I'm a local guide who knows all about Ishikawa's charms. Cuisine and cultural experiences are my specialties.",
    "福井県の魅力を知り尽くしたローカルガイドです。歴史散策とアウトドアが得意分野です。": "I'm a local guide who knows all about Fukui's charms. Historical walks and outdoor activities are my specialties.",
    "山梨県の魅力を知り尽くしたローカルガイドです。ローカル体験と自然が得意分野です。": "I'm a local guide who knows all about Yamanashi's charms. Local experiences and nature are my specialties.",
    "長野県の魅力を知り尽くしたローカルガイドです。季節体験と温泉が得意分野です。": "I'm a local guide who knows all about Nagano's charms. Seasonal experiences and hot springs are my specialties.",
    "岐阜県の魅力を知り尽くしたローカルガイドです。グルメと写真スポットが得意分野です。": "I'm a local guide who knows all about Gifu's charms. Gourmet and photo spots are my specialties.",
    "静岡県の魅力を知り尽くしたローカルガイドです。ナイトツアーとグルメが得意分野です。": "I'm a local guide who knows all about Shizuoka's charms. Night tours and gourmet are my specialties.",
    "愛知県の魅力を知り尽くしたローカルガイドです。写真スポットと観光が得意分野です。": "I'm a local guide who knows all about Aichi's charms. Photo spots and sightseeing are my specialties.",
    "三重県の魅力を知り尽くしたローカルガイドです。料理と文化体験が得意分野です。": "I'm a local guide who knows all about Mie's charms. Cuisine and cultural experiences are my specialties.",
    "滋賀県の魅力を知り尽くしたローカルガイドです。歴史散策とアウトドアが得意分野です。": "I'm a local guide who knows all about Shiga's charms. Historical walks and outdoor activities are my specialties.",
    "京都府の魅力を知り尽くしたローカルガイドです。ローカル体験と自然が得意分野です。": "I'm a local guide who knows all about Kyoto's charms. Local experiences and nature are my specialties.",
    "大阪府の魅力を知り尽くしたローカルガイドです。季節体験と温泉が得意分野です。": "I'm a local guide who knows all about Osaka's charms. Seasonal experiences and hot springs are my specialties.",
    "兵庫県の魅力を知り尽くしたローカルガイドです。グルメと写真スポットが得意分野です。": "I'm a local guide who knows all about Hyogo's charms. Gourmet and photo spots are my specialties.",
    "奈良県の魅力を知り尽くしたローカルガイドです。ナイトツアーとグルメが得意分野です。": "I'm a local guide who knows all about Nara's charms. Night tours and gourmet are my specialties.",
    "和歌山県の魅力を知り尽くしたローカルガイドです。写真スポットと観光が得意分野です。": "I'm a local guide who knows all about Wakayama's charms. Photo spots and sightseeing are my specialties.",
    "鳥取県の魅力を知り尽くしたローカルガイドです。料理と文化体験が得意分野です。": "I'm a local guide who knows all about Tottori's charms. Cuisine and cultural experiences are my specialties.",
    "島根県の魅力を知り尽くしたローカルガイドです。歴史散策とアウトドアが得意分野です。": "I'm a local guide who knows all about Shimane's charms. Historical walks and outdoor activities are my specialties.",
    "岡山県の魅力を知り尽くしたローカルガイドです。ローカル体験と自然が得意分野です。": "I'm a local guide who knows all about Okayama's charms. Local experiences and nature are my specialties.",
    "広島県の魅力を知り尽くしたローカルガイドです。季節体験と温泉が得意分野です。": "I'm a local guide who knows all about Hiroshima's charms. Seasonal experiences and hot springs are my specialties.",
    "山口県の魅力を知り尽くしたローカルガイドです。グルメと写真スポットが得意分野です。": "I'm a local guide who knows all about Yamaguchi's charms. Gourmet and photo spots are my specialties.",
    "徳島県の魅力を知り尽くしたローカルガイドです。ナイトツアーとグルメが得意分野です。": "I'm a local guide who knows all about Tokushima's charms. Night tours and gourmet are my specialties.",
    "香川県の魅力を知り尽くしたローカルガイドです。写真スポットと観光が得意分野です。": "I'm a local guide who knows all about Kagawa's charms. Photo spots and sightseeing are my specialties.",
    "愛媛県の魅力を知り尽くしたローカルガイドです。料理と文化体験が得意分野です。": "I'm a local guide who knows all about Ehime's charms. Cuisine and cultural experiences are my specialties.",
    "高知県の魅力を知り尽くしたローカルガイドです。歴史散策とアウトドアが得意分野です。": "I'm a local guide who knows all about Kochi's charms. Historical walks and outdoor activities are my specialties.",
    "福岡県の魅力を知り尽くしたローカルガイドです。ローカル体験と自然が得意分野です。": "I'm a local guide who knows all about Fukuoka's charms. Local experiences and nature are my specialties.",
    "佐賀県の魅力を知り尽くしたローカルガイドです。季節体験と温泉が得意分野です。": "I'm a local guide who knows all about Saga's charms. Seasonal experiences and hot springs are my specialties.",
    "長崎県の魅力を知り尽くしたローカルガイドです。グルメと写真スポットが得意分野です。": "I'm a local guide who knows all about Nagasaki's charms. Gourmet and photo spots are my specialties.",
    "熊本県の魅力を知り尽くしたローカルガイドです。ナイトツアーとグルメが得意分野です。": "I'm a local guide who knows all about Kumamoto's charms. Night tours and gourmet are my specialties.",
    "大分県の魅力を知り尽くしたローカルガイドです。写真スポットと観光が得意分野です。": "I'm a local guide who knows all about Oita's charms. Photo spots and sightseeing are my specialties.",
    "宮崎県の魅力を知り尽くしたローカルガイドです。料理と文化体験が得意分野です。": "I'm a local guide who knows all about Miyazaki's charms. Cuisine and cultural experiences are my specialties.",
    "鹿児島県の魅力を知り尽くしたローカルガイドです。歴史散策とアウトドアが得意分野です。": "I'm a local guide who knows all about Kagoshima's charms. Historical walks and outdoor activities are my specialties.",
    "沖縄県の魅力を知り尽くしたローカルガイドです。ローカル体験と自然が得意分野です。": "I'm a local guide who knows all about Okinawa's charms. Local experiences and nature are my specialties."
  };

  // ボタンテキスト翻訳
  const buttonTexts = {
    "詳細を見る": "See Details",
    "See Details": "詳細を見る"
  };

  /**
   * 現在の言語を取得
   */
  function getCurrentLanguage() {
    return localStorage.getItem('selectedLanguage') || 'ja';
  }

  /**
   * ガイドカードの説明文を翻訳
   */
  function translateGuideDescriptions() {
    const currentLang = getCurrentLanguage();
    
    // すべてのガイドカードを取得
    const guideCards = document.querySelectorAll('.guide-card, .card');
    
    guideCards.forEach(card => {
      // カード内の説明文を探す
      const descriptions = card.querySelectorAll('.card-text');
      
      descriptions.forEach(desc => {
        // 場所情報（アイコン付き）ではない説明文のみを対象
        if (!desc.querySelector('i.bi-geo-alt-fill') && 
            !desc.classList.contains('guide-location') &&
            desc.textContent.trim().length > 10) {
          
          const currentText = desc.textContent.trim();
          
          if (currentLang === 'en') {
            // 日本語から英語へ翻訳
            if (guideDescriptions[currentText]) {
              desc.textContent = guideDescriptions[currentText];
            }
          } else {
            // 英語から日本語へ戻す
            const japaneseText = Object.keys(guideDescriptions).find(key => 
              guideDescriptions[key] === currentText
            );
            if (japaneseText) {
              desc.textContent = japaneseText;
            }
          }
        }
      });
      
      // ボタンテキストも翻訳
      const buttons = card.querySelectorAll('.btn');
      buttons.forEach(btn => {
        const currentText = btn.textContent.trim();
        if (buttonTexts[currentText]) {
          btn.textContent = buttonTexts[currentText];
        }
      });
    });
  }

  /**
   * 動的に追加されるガイドカードの監視
   */
  function observeGuideCards() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && 
                (node.classList.contains('guide-item') || 
                 node.classList.contains('guide-card') ||
                 node.querySelector('.guide-card'))) {
              // 新しいガイドカードが追加された場合、翻訳を適用
              setTimeout(translateGuideDescriptions, 100);
            }
          });
        }
      });
    });

    // ガイドコンテナを監視
    const containers = document.querySelectorAll('#guide-cards-container, .guides-container, .row');
    containers.forEach(container => {
      if (container) {
        observer.observe(container, {
          childList: true,
          subtree: true
        });
      }
    });
  }

  /**
   * 言語変更イベントをリッスン
   */
  function setupLanguageChangeListener() {
    // 言語ドロップダウンのイベントリスナー
    document.addEventListener('click', function(e) {
      if (e.target.hasAttribute('data-lang')) {
        setTimeout(translateGuideDescriptions, 200);
      }
    });

    // ストレージ変更の監視
    window.addEventListener('storage', function(e) {
      if (e.key === 'selectedLanguage') {
        translateGuideDescriptions();
      }
    });
  }

  /**
   * 初期化
   */
  function init() {
    // ページ読み込み時に現在の言語に合わせて翻訳
    setTimeout(translateGuideDescriptions, 500);
    
    // 動的コンテンツの監視開始
    observeGuideCards();
    
    // 言語変更イベントの設定
    setupLanguageChangeListener();
  }

  // DOMが読み込まれたら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();