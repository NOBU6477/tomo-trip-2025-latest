// English Guide Card Converter - Convert all Japanese guide cards to English
console.log('🌏 English Guide Card Converter Loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('🌏 Starting English guide card conversion...');
  
  // Japanese to English translations mapping
  const translations = {
    // Names
    '山田 次郎': 'Jiro Yamada',
    '田中 太郎': 'Taro Tanaka',
    '佐藤 花子': 'Hanako Sato',
    '鈴木 一郎': 'Ichiro Suzuki',
    '高橋 美咲': 'Misaki Takahashi',
    '伊藤 健太': 'Kenta Ito',
    '渡辺 由美': 'Yumi Watanabe',
    '中村 大輔': 'Daisuke Nakamura',
    
    // Locations
    '京都府 京都市': 'Kyoto, Kyoto',
    '東京都 渋谷区': 'Tokyo, Shibuya',
    '大阪府 大阪市': 'Osaka, Osaka',
    '北海道 札幌市': 'Hokkaido, Sapporo',
    '愛知県 名古屋市': 'Aichi, Nagoya',
    '福岡県 福岡市': 'Fukuoka, Fukuoka',
    '広島県 広島市': 'Hiroshima, Hiroshima',
    '宮城県 仙台市': 'Miyagi, Sendai',
    '石川県 金沢市': 'Ishikawa, Kanazawa',
    '奈良県 奈良市': 'Nara, Nara',
    '沖縄県 那覇市': 'Okinawa, Naha',
    '神奈川県 横浜市': 'Kanagawa, Yokohama',
    
    // Languages
    '日本語': 'Japanese',
    '英語': 'English',
    '中国語': 'Chinese',
    '韓国語': 'Korean',
    'フランス語': 'French',
    'スペイン語': 'Spanish',
    
    // Price and buttons
    '¥6,000/回': '¥6,000/session',
    '¥7,000/回': '¥7,000/session',
    '¥8,000/回': '¥8,000/session',
    '¥9,000/回': '¥9,000/session',
    '¥10,000/回': '¥10,000/session',
    '詳細を見る': 'View Details',
    '予約する': 'Book Now',
    'お気に入り': 'Favorite',
    
    // Descriptions (common phrases)
    '京都の伝統文化と寺院巡りの専門ガイド。季節の美しさを感じる特別な場所へご案内。': 'Specialist guide for Kyoto\'s traditional culture and temple tours. I\'ll take you to special places where you can feel the beauty of the seasons.',
    '東京生まれ東京育ちの地元ガイド。隠れた名店や文化スポットをご案内します。': 'Born and raised in Tokyo local guide. I will guide you to hidden famous shops and cultural spots.',
    '大阪の食文化と歴史に詳しいガイド。本場のたこ焼きとお好み焼き体験をご案内。': 'Guide knowledgeable about Osaka\'s food culture and history. I guide you through authentic takoyaki and okonomiyaki experiences.',
    '北海道の雄大な自然と新鮮な海の幸を探検。息をのむような季節のスポットへご案内。': 'Explore Hokkaido\'s pristine nature and fresh seafood. I\'ll guide you to breathtaking seasonal spots.',
    '名古屋の産業文化と味噌カツなどの地元名物を知識豊富な地元ガイドがご案内。': 'Discover Nagoya\'s industrial culture and local specialties like miso katsu with a knowledgeable local guide.'
  };
  
  function convertGuideCards() {
    const guideCards = document.querySelectorAll('.guide-card');
    let convertedCount = 0;
    
    guideCards.forEach(card => {
      let wasConverted = false;
      
      // Convert name
      const nameElement = card.querySelector('.card-title');
      if (nameElement && translations[nameElement.textContent.trim()]) {
        nameElement.textContent = translations[nameElement.textContent.trim()];
        wasConverted = true;
      }
      
      // Convert location
      const locationElement = card.querySelector('.text-muted');
      if (locationElement) {
        let locationText = locationElement.textContent.replace(/\s*[\s\S]*?geo-alt[\s\S]*?\s*/, '').trim();
        if (translations[locationText]) {
          locationElement.innerHTML = `<i class="bi bi-geo-alt"></i> ${translations[locationText]}`;
          wasConverted = true;
        }
      }
      
      // Convert description
      const descElement = card.querySelector('.card-text');
      if (descElement && translations[descElement.textContent.trim()]) {
        descElement.textContent = translations[descElement.textContent.trim()];
        wasConverted = true;
      }
      
      // Convert language badges
      const badges = card.querySelectorAll('.badge.bg-light');
      badges.forEach(badge => {
        if (translations[badge.textContent.trim()]) {
          badge.textContent = translations[badge.textContent.trim()];
          wasConverted = true;
        }
      });
      
      // Convert price
      const priceElement = card.querySelector('.fw-bold');
      if (priceElement && translations[priceElement.textContent.trim()]) {
        priceElement.textContent = translations[priceElement.textContent.trim()];
        wasConverted = true;
      }
      
      // Convert button
      const buttonElement = card.querySelector('.btn');
      if (buttonElement && translations[buttonElement.textContent.trim()]) {
        buttonElement.textContent = translations[buttonElement.textContent.trim()];
        wasConverted = true;
      }
      
      if (wasConverted) {
        convertedCount++;
        card.classList.add('english-converted');
      }
    });
    
    console.log(`✅ Converted ${convertedCount} guide cards to English`);
    return convertedCount;
  }
  
  // Convert existing cards immediately
  setTimeout(() => {
    const converted = convertGuideCards();
    if (converted > 0) {
      console.log(`🌏 English conversion complete: ${converted} cards converted`);
    }
  }, 100);
  
  // Monitor for new cards added dynamically
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (node.classList.contains('guide-card') || node.querySelector('.guide-card'))) {
            setTimeout(() => {
              convertGuideCards();
            }, 50);
          }
        });
      }
    });
  });
  
  const container = document.getElementById('guide-cards-container');
  if (container) {
    observer.observe(container, {
      childList: true,
      subtree: true
    });
    console.log('🌏 Dynamic conversion monitor active');
  }
  
  // Expose function globally for manual conversion
  window.convertGuideCardsToEnglish = convertGuideCards;
});

console.log('🌏 English Guide Card Converter Loaded');