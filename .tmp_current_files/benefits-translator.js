/**
 * ガイド特典セクション専用翻訳スクリプト
 * メリットカードの詳細テキストを翻訳する
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ベネフィットセクション翻訳機能をロード');
  
  // 言語切り替えの状態を監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        // 英語モードかどうかを確認
        const langBtn = document.getElementById('languageDropdown');
        if (langBtn && langBtn.textContent.includes('English')) {
          console.log('英語モードを検出、ベネフィットカードを翻訳');
          translateAllBenefitCards();
        }
      }
    });
  });
  
  // 監視対象の設定
  const config = { 
    attributes: true, 
    childList: true, 
    characterData: true,
    subtree: true
  };
  
  // 監視開始
  const targetNode = document.body;
  observer.observe(targetNode, config);
  
  // 最初の翻訳を試行
  setTimeout(checkAndTranslate, 1000);
  
  /**
   * 英語モードなら翻訳を実行
   */
  function checkAndTranslate() {
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn && langBtn.textContent.includes('English')) {
      console.log('英語モードを検出、初期翻訳を実行');
      translateAllBenefitCards();
    }
  }
  
  /**
   * すべてのベネフィットカードを翻訳
   */
  function translateAllBenefitCards() {
    // セクションのタイトルを翻訳
    const title = document.querySelector('#benefits-section h2, .benefit-section h2, .guide-benefits h2');
    if (title && title.textContent.includes('ガイドとして活躍')) {
      title.textContent = 'Benefits of Being a Guide';
    }
    
    // セクションのサブタイトルを翻訳
    const subtitle = document.querySelector('#benefits-section > p, .guide-benefit-section > p, .benefits-subtitle');
    if (subtitle && subtitle.textContent.includes('あなたの知識と経験を活かして')) {
      subtitle.textContent = 'Share your knowledge and experience to provide special experiences for travelers from around the world';
    }
    
    // ベネフィットカードのタイトル部分を直接翻訳
    translateCardTitle('あなたの日常が観光資源になる', 'Your Daily Life Becomes a Tourist Attraction');
    translateCardTitle('観光客の方を友達としてお迎えするだけです', 'Welcome Tourists as Friends');
    translateCardTitle('隙間時間を使って効率よくお仕事をする', 'Work Efficiently in Your Free Time');
    translateCardTitle('自分の好きなことを仕事にできる', 'Do What You Love');
    translateCardTitle('世界中の人と新しい出会いが生まれる', 'Meet People from Around the World');
    translateCardTitle('語学力を活かし、さらに向上させられる', 'Improve Your Language Skills');
    translateCardTitle('地元への愛着と誇りが深まる', 'Deepen Your Love for Your Hometown');
    translateCardTitle('安心のサポート体制', 'Reliable Support System');
    translateCardTitle('自分のペースで活動可能', 'Work at Your Own Pace');
    translateCardTitle('地域活性化に貢献できる', 'Contribute to Local Economy');
    
    // 各カードの説明文を翻訳
    translateBenefitCard('形式ばったガイドツアーではなく', 'Rather than a formal guided tour, you can naturally convey the charm of your local area as if spending time with friends.');
    translateBenefitCard('地元の方だけが知る特別な場所', 'By sharing special places that only locals know about, your everyday surroundings become valuable tourism resources.');
    translateBenefitCard('自分の都合の良い時間にスケジュール', 'You can set your schedule according to your convenience, allowing you to earn income while balancing with your main job or studies.');
    translateBenefitCard('趣味や特技、専門知識を活かした', 'By providing unique guided experiences that utilize your hobbies, skills, and specialized knowledge, you can turn your passion into income.');
    translateBenefitCard('様々な国や文化から来た旅行者', 'Interact with travelers from different countries and cultures, expanding your international network and deepening cross-cultural understanding.');
    translateBenefitCard('地元の魅力を発信することで', 'By promoting the attractions of your local area, you will develop a deeper appreciation and attachment to your hometown.');
    translateBenefitCard('外国語を使う実践的な機会', 'Gain practical opportunities to use foreign languages, naturally improving your communication skills.');
    translateBenefitCard('予約を受ける日時や頻度は完全に自分', 'When and how often you accept bookings is completely up to you, allowing for a lifestyle that suits your needs.');
    translateBenefitCard('予約管理、決済、保険など', 'We provide the essential support for guide activities such as reservation management, payment, and insurance, so you can work with peace of mind.');
    translateBenefitCard('観光客を地元のお店や施設', 'By introducing tourists to local shops and facilities, you contribute to the revitalization of the local economy and community development.');
  }
  
  /**
   * カードタイトルを翻訳
   */
  function translateCardTitle(japaneseText, englishText) {
    document.querySelectorAll('.card-title, .card-header, .benefit-title, .card h5').forEach(title => {
      if (title.textContent.includes(japaneseText)) {
        title.textContent = englishText;
      }
    });
  }
  
  /**
   * 特定のテキストを含むカード説明文を翻訳
   */
  function translateBenefitCard(japaneseText, englishText) {
    document.querySelectorAll('.card p, .card-body p, p, .benefit-description').forEach(p => {
      if (p.textContent.includes(japaneseText)) {
        p.textContent = englishText;
      }
    });
  }
});