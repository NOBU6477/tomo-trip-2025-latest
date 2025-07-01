/**
 * 70人ガイド表示システム - 英語版
 * 英語サイト用のガイドデータを生成
 */

(function() {
  'use strict';

  console.log('英語版70人ガイドシステム開始');

  // 英語版ガイドデータ
  const englishGuides = [
    {
      id: 4,
      name: "Shota Yamashita",
      location: "Aomori Prefecture, Aomori City",
      price: "¥8,000/session",
      description: "As a local who grew up in Aomori Prefecture, I will guide you to photo and video shooting spots from a unique local perspective.",
      languages: ["Japanese", "Chinese"],
      rating: 3.5,
      image: "attached_assets/ChatGPT Image 2025年6月17日 21_34_27_1750163768295.png"
    },
    {
      id: 5,
      name: "Keiko Shimizu",
      location: "Tokyo, Ogasawara Islands",
      price: "¥10,000/session",
      description: "A guide well-versed in the history and culture of Tokyo. I provide comprehensive guidance from hot springs to relaxation.",
      languages: ["Japanese", "Korean"],
      rating: 3.5,
      image: "attached_assets/ChatGPT Image 2025年6月17日 21_34_27_1750163768295.png"
    },
    {
      id: 6,
      name: "Hiroshi Tanaka",
      location: "Osaka, Osaka City",
      price: "¥15,000/session", 
      description: "Experience Osaka's famous food culture and traditional comedy. I'll show you the real Osaka that tourists rarely see.",
      languages: ["Japanese", "English"],
      rating: 4.2,
      image: "attached_assets/ChatGPT Image 2025年6月17日 21_34_27_1750163768295.png"
    },
    {
      id: 7,
      name: "Michiko Sato",
      location: "Kyoto, Kyoto City", 
      price: "¥18,000/session",
      description: "Traditional Kyoto culture and temple exploration. Learn about tea ceremony, kimono culture, and hidden shrine experiences.",
      languages: ["Japanese", "French"],
      rating: 4.7,
      image: "attached_assets/ChatGPT Image 2025年6月17日 21_34_27_1750163768295.png"
    },
    {
      id: 8,
      name: "Takeshi Nakamura",
      location: "Hiroshima, Hiroshima City",
      price: "¥12,000/session",
      description: "Peace Memorial Park guide and local Hiroshima cuisine experience. Historical storytelling with personal family stories.",
      languages: ["Japanese", "English", "Korean"],
      rating: 4.5,
      image: "attached_assets/ChatGPT Image 2025年6月17日 21_34_27_1750163768295.png"
    }
  ];

  // ガイドカード生成
  function createGuideCard(guide) {
    const languageBadges = guide.languages.map(lang => 
      `<span class="badge ${lang === 'Japanese' ? 'bg-primary' : 'bg-secondary'} me-1">${lang}</span>`
    ).join('');

    const stars = Array.from({length: 5}, (_, i) => {
      const filled = i < Math.floor(guide.rating);
      const half = i === Math.floor(guide.rating) && guide.rating % 1 >= 0.5;
      if (filled) return '<i class="bi bi-star-fill"></i>';
      if (half) return '<i class="bi bi-star-half"></i>';
      return '<i class="bi bi-star"></i>';
    }).join('');

    return `
      <div class="col-lg-4 col-md-6">
        <div class="card guide-card">
          <div class="position-relative">
            <img src="${guide.image}" class="card-img-top" alt="${guide.name}">
            <div class="price-badge">${guide.price}</div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${guide.name}</h5>
            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt"></i> ${guide.location}
            </p>
            <p class="card-text small">${guide.description}</p>
            <div class="mb-3">
              ${languageBadges}
            </div>
            <div class="mb-3">
              <span class="text-warning">${stars}</span>
              <span class="text-muted ms-1">${guide.rating}</span>
            </div>
            <a href="#" class="btn btn-outline-primary w-100">See Details</a>
          </div>
        </div>
      </div>
    `;
  }

  // 追加ガイド生成
  function generateAdditionalGuides() {
    const additionalGuides = [];
    const prefectures = [
      "Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima",
      "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa",
      "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu",
      "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara",
      "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi",
      "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki",
      "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"
    ];

    const firstNames = [
      "Yuki", "Kenji", "Akiko", "Hiroshi", "Miho", "Daisuke", "Emi", "Takeshi",
      "Naoko", "Shinji", "Yuka", "Masaki", "Tomoko", "Ryo", "Sachiko"
    ];

    const lastNames = [
      "Suzuki", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Sato",
      "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Matsumoto", "Inoue"
    ];

    const specialties = [
      "traditional culture and temples", "local cuisine and food markets", "historical sites and museums",
      "nature hiking and outdoor activities", "art galleries and modern culture", "shopping and fashion districts",
      "nightlife and entertainment", "family-friendly activities", "photography spots", "traditional crafts",
      "hot springs and relaxation", "seasonal festivals", "hidden local gems", "business district tours"
    ];

    const languages = [
      ["Japanese", "English"], ["Japanese", "Chinese"], ["Japanese", "Korean"],
      ["Japanese", "English", "Spanish"], ["Japanese", "French"], ["Japanese", "German"],
      ["Japanese", "Italian"], ["Japanese", "English", "Chinese"]
    ];

    for (let i = 0; i < 65; i++) { // 65 more guides to reach 70 total
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const prefecture = prefectures[Math.floor(Math.random() * prefectures.length)];
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];
      const guideLangs = languages[Math.floor(Math.random() * languages.length)];
      const price = Math.floor(Math.random() * 20000) + 8000; // 8,000 to 28,000 yen
      const rating = Math.floor(Math.random() * 20 + 30) / 10; // 3.0 to 5.0

      additionalGuides.push({
        id: i + 6,
        name: `${firstName} ${lastName}`,
        location: `${prefecture}, ${prefecture} City`,
        price: `¥${price.toLocaleString()}/session`,
        description: `Expert guide specializing in ${specialty}. Experience authentic local culture with personalized tours.`,
        languages: guideLangs,
        rating: rating,
        image: "attached_assets/ChatGPT Image 2025年6月17日 21_34_27_1750163768295.png"
      });
    }

    return additionalGuides;
  }

  // ガイドカード表示
  function displayGuides() {
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.log('ガイドカードコンテナが見つかりません');
      return;
    }

    console.log('英語版ガイドカード表示開始');

    // 基本ガイド + 追加ガイド
    const allGuides = [...englishGuides, ...generateAdditionalGuides()];
    
    // 最初の3つは既に表示されているのでスキップ
    const additionalCards = allGuides.slice(0).map(guide => createGuideCard(guide)).join('');
    
    // 既存のカードの後に追加
    container.innerHTML += additionalCards;
    
    console.log(`英語版ガイドカード表示完了: ${allGuides.length}件`);
  }

  // カウンター更新
  function updateCounter() {
    const counterElements = document.querySelectorAll('.counter-badge, [class*="counter"]');
    counterElements.forEach(element => {
      if (element.textContent.includes('Found') || element.textContent.includes('guides')) {
        element.innerHTML = '<i class="bi bi-people-fill me-2"></i>Found 70 guides';
      }
    });
  }

  // 初期化
  function init() {
    console.log('英語版70人ガイドシステム初期化');
    
    // 遅延実行で確実に表示
    setTimeout(() => {
      displayGuides();
      updateCounter();
    }, 1000);
    
    setTimeout(() => {
      displayGuides();
      updateCounter();
    }, 2000);
  }

  // Filter functionality
  function setupFilters() {
    const locationFilter = document.getElementById('filter-location');
    const languageFilter = document.getElementById('filter-language');
    const specialtyFilter = document.getElementById('filter-specialties');
    const searchInput = document.getElementById('search-guides');

    function applyFilters() {
      const guidesContainer = document.getElementById('guide-cards-container');
      if (!guidesContainer) return;

      const cards = guidesContainer.querySelectorAll('.guide-item');
      let visibleCount = 0;

      cards.forEach(card => {
        const guideId = parseInt(card.dataset.guideId);
        const guide = englishGuides.find(g => g.id === guideId);
        
        if (!guide) {
          card.style.display = 'none';
          return;
        }

        let shouldShow = true;

        // Location filter
        if (locationFilter && locationFilter.value) {
          if (!guide.location.toLowerCase().includes(locationFilter.value.toLowerCase())) {
            shouldShow = false;
          }
        }

        // Language filter
        if (languageFilter && languageFilter.value) {
          if (!guide.languages.some(lang => lang.toLowerCase().includes(languageFilter.value.toLowerCase()))) {
            shouldShow = false;
          }
        }

        // Search filter
        if (searchInput && searchInput.value.trim()) {
          const searchTerm = searchInput.value.toLowerCase();
          if (!guide.name.toLowerCase().includes(searchTerm) && 
              !guide.description.toLowerCase().includes(searchTerm) &&
              !guide.location.toLowerCase().includes(searchTerm)) {
            shouldShow = false;
          }
        }

        if (shouldShow) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      updateCounter(visibleCount);
    }

    // Add event listeners to filters
    if (locationFilter) locationFilter.addEventListener('change', applyFilters);
    if (languageFilter) languageFilter.addEventListener('change', applyFilters);
    if (specialtyFilter) specialtyFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    console.log('English version filters setup complete');
  }

  function updateCounter(count = null) {
    const counter = document.querySelector('.text-muted');
    if (counter) {
      const totalCount = count !== null ? count : englishGuides.length;
      counter.textContent = `Found ${totalCount} guides`;
    }
  }

  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setTimeout(setupFilters, 1500);
    });
  } else {
    init();
    setTimeout(setupFilters, 1500);
  }

})();

console.log('load-70-guides-en.js 読み込み完了');