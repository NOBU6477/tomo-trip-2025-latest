/**
 * 70人のガイドデータを生成してページに表示するスクリプト
 */

(function() {
  'use strict';

  // 日本の地域データ（47都道府県）
  const regions = [
    "北海道 札幌市", "北海道 函館市", "青森県 青森市", "岩手県 盛岡市", "宮城県 仙台市", "秋田県 秋田市",
    "山形県 山形市", "福島県 会津若松市", "茨城県 水戸市", "栃木県 日光市", "群馬県 前橋市",
    "埼玉県 川越市", "千葉県 千葉市", "東京都 新宿区", "東京都 渋谷区", "東京都 台東区",
    "神奈川県 横浜市", "神奈川県 鎌倉市", "新潟県 新潟市", "富山県 富山市", "石川県 金沢市",
    "福井県 福井市", "山梨県 甲府市", "長野県 松本市", "岐阜県 高山市", "静岡県 静岡市",
    "愛知県 名古屋市", "三重県 伊勢市", "滋賀県 大津市", "京都府 京都市", "大阪府 大阪市",
    "兵庫県 神戸市", "奈良県 奈良市", "和歌山県 和歌山市", "鳥取県 鳥取市", "島根県 松江市",
    "岡山県 岡山市", "広島県 広島市", "山口県 下関市", "徳島県 徳島市", "香川県 高松市",
    "愛媛県 松山市", "高知県 高知市", "福岡県 福岡市", "佐賀県 佐賀市", "長崎県 長崎市",
    "熊本県 熊本市", "大分県 別府市", "宮崎県 宮崎市", "鹿児島県 鹿児島市", "沖縄県 那覇市",
    "沖縄県 石垣島", "沖縄県 宮古島", "鹿児島県 屋久島", "鹿児島県 奄美大島", "長崎県 壱岐",
    "新潟県 佐渡島", "東京都 小笠原諸島", "沖縄県 竹富島", "沖縄県 西表島", "沖縄県 与那国島"
  ];

  // 名前データ
  const firstNames = [
    "太郎", "花子", "一郎", "美咲", "健太", "麻衣", "大輔", "愛", "翔太", "美穂",
    "和也", "さくら", "拓也", "恵美", "雄大", "由美", "慎一", "裕子", "博文", "香織",
    "智也", "真理", "康雄", "美奈", "浩二", "綾子", "英樹", "千佳", "修", "明美",
    "孝", "典子", "隆", "桂子", "勇", "清美", "学", "洋子", "正", "幸子",
    "誠", "直美", "薫", "文子", "治", "悦子", "豊", "恵子", "進", "久美子"
  ];

  const lastNames = [
    "田中", "佐藤", "鈴木", "高橋", "伊藤", "渡辺", "山本", "中村", "小林", "加藤",
    "吉田", "山田", "佐々木", "山口", "松本", "井上", "木村", "林", "斎藤", "清水",
    "山崎", "森", "池田", "橋本", "阿部", "石川", "山下", "中島", "石井", "小川",
    "長谷川", "近藤", "後藤", "坂本", "遠藤", "青木", "藤井", "西村", "福田", "太田",
    "三浦", "岡田", "前田", "増田", "村上", "原田", "浜田", "竹内", "中川", "小野"
  ];

  // 言語組み合わせ
  const languageSets = [
    ["日本語"], ["日本語", "英語"], ["日本語", "中国語"], ["日本語", "韓国語"],
    ["日本語", "英語", "中国語"], ["日本語", "英語", "フランス語"], ["日本語", "英語", "スペイン語"],
    ["日本語", "韓国語", "中国語"], ["日本語", "英語", "ドイツ語"], ["日本語", "英語", "イタリア語"]
  ];

  // キーワード組み合わせ
  const keywordSets = [
    ["ナイトツアー", "グルメ"], ["写真スポット", "観光"], ["料理", "文化体験"],
    ["アクティビティ", "自然"], ["歴史", "寺院"], ["ショッピング", "ファッション"],
    ["温泉", "リラクゼーション"], ["登山", "ハイキング"], ["海", "マリンスポーツ"],
    ["アート", "美術館"], ["音楽", "ライブ"], ["祭り", "イベント"],
    ["桜", "花見"], ["紅葉", "季節"], ["雪", "ウィンタースポーツ"]
  ];

  // 料金データ
  const fees = [6000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000];

  // 評価データ
  const ratings = [3.5, 3.8, 4.0, 4.2, 4.5, 4.7, 4.8, 4.9, 5.0];

  // 説明文テンプレート
  const descriptionTemplates = [
    "{region}の魅力を知り尽くしたローカルガイドです。{keyword1}や{keyword2}のスポットをご案内します。",
    "{region}出身のガイドが地元の隠れた名所をご紹介。特に{keyword1}スポットが充実しています。",
    "{region}在住10年以上のガイドが、観光客だけでは見つけられない{keyword1}や{keyword2}の場所にご案内します。",
    "{region}のローカルフードやトレンドスポットを知り尽くしています。{keyword1}好きの方におすすめです。",
    "{keyword1}と{keyword2}を中心に、{region}の魅力をお伝えします。現地の生活や文化も体験できます。",
    "{region}の歴史と文化に精通したガイドです。{keyword1}から{keyword2}まで幅広くご案内します。",
    "{region}で育った地元民ならではの視点で、{keyword1}の名所や{keyword2}スポットを案内します。",
    "{region}の{keyword1}に特化したツアーを提供しています。{keyword2}も併せてお楽しみいただけます。"
  ];

  // ランダム関数
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 70人のガイドデータを生成
  function generateGuides() {
    const guides = [];
    
    for (let i = 1; i <= 70; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const name = lastName + " " + firstName;
      const region = getRandomElement(regions);
      const languages = getRandomElement(languageSets);
      const keywords = getRandomElement(keywordSets);
      const fee = getRandomElement(fees);
      const rating = getRandomElement(ratings);
      const reviewCount = getRandomInt(5, 50);
      
      // 地域名を短縮（都道府県名のみ）
      const regionShort = region.split(" ")[0];
      
      // 説明文を生成
      const description = getRandomElement(descriptionTemplates)
        .replace("{region}", regionShort)
        .replace("{keyword1}", keywords[0])
        .replace("{keyword2}", keywords[1]);

      // 統一された海岸風景写真を使用
      const imageUrls = [
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg", // 海岸風景写真
        "attached_assets/IMG20221024140826_1750355257888.jpg"  // 海岸風景写真
      ];
      
      guides.push({
        id: i,
        name: name,
        region: region,
        languages: languages,
        keywords: keywords,
        fee: fee,
        rating: rating,
        reviewCount: reviewCount,
        description: description,
        imageUrl: getRandomElement(imageUrls)
      });
    }
    
    return guides;
  }

  // ガイドカードHTMLを生成
  function createGuideCardHTML(guide) {
    const languageBadges = guide.languages.map(lang => 
      `<span class="badge bg-light text-dark me-1">${lang}</span>`
    ).join('');

    const stars = Math.floor(guide.rating);
    const halfStar = guide.rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < stars; i++) {
      starsHTML += '<i class="bi bi-star-fill"></i>';
    }
    if (halfStar) {
      starsHTML += '<i class="bi bi-star-half"></i>';
    }
    for (let i = stars + (halfStar ? 1 : 0); i < 5; i++) {
      starsHTML += '<i class="bi bi-star"></i>';
    }

    return `
      <div class="col-md-4 guide-item mb-4" data-location="${guide.region}" data-languages="${guide.languages.join(',')}" data-fee="${guide.fee}" data-keywords="${guide.keywords.join(',')}">
        <div class="card guide-card shadow-sm h-100" data-guide-id="${guide.id}">
          <img src="${guide.imageUrl}" class="card-img-top guide-image" alt="${guide.name}のガイド写真" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${guide.name}</h5>
              <span class="badge bg-primary">¥${guide.fee.toLocaleString()}/セッション</span>
            </div>
            <p class="card-text text-muted mb-2">
              <i class="bi bi-geo-alt-fill me-1"></i>${guide.region}
            </p>
            <p class="card-text mb-3">${guide.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="guide-languages">
                ${languageBadges}
              </div>
              <div class="text-warning">
                ${starsHTML}
                <span class="text-dark ms-1">${guide.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-0 pt-0">
            <button class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${guide.id}" onclick="handleGuideDetailsClick(${guide.id})">
              <i class="bi bi-lock me-1"></i>ログインして詳細を見る
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ページにガイドを表示
  function displayGuides() {
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.error('ガイドコンテナが見つかりません');
      return;
    }

    const guides = generateGuides();
    const guidesHTML = guides.map(guide => createGuideCardHTML(guide)).join('');
    
    container.innerHTML = guidesHTML;
    
    // 検索結果カウンターを更新
    const counter = document.getElementById('search-results-counter');
    if (counter) {
      counter.textContent = `${guides.length}人のガイドが見つかりました`;
    }

    console.log(`${guides.length}人のガイドを表示しました`);
    
    // ガイドデータをローカルストレージに保存
    guides.forEach(guide => {
      localStorage.setItem(`guide_${guide.id}`, JSON.stringify(guide));
    });
    
    // ガイド詳細リンクのイベントリスナーを設定
    setupGuideDetailLinks();
  }

  // ガイド詳細リンクのイベントリスナー設定
  function setupGuideDetailLinks() {
    const detailLinks = document.querySelectorAll('.guide-details-link');
    detailLinks.forEach(link => {
      // 英語モードの場合、ボタンテキストを翻訳
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage === 'en' && link.textContent && link.textContent.trim() === '詳細を見る') {
        link.textContent = 'See Details';
      }
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const guideId = this.getAttribute('data-guide-id');
        
        // 観光客として登録済みかチェック
        const touristData = localStorage.getItem('touristData');
        
        if (touristData) {
          // 観光客として登録済みなら詳細ページへ移動
          window.location.href = `guide-details.html?id=${guideId}`;
        } else {
          // 未ログインなら観光客ログインを促すモーダルを表示
          if (typeof showTouristLoginPrompt === 'function') {
            showTouristLoginPrompt(guideId);
          } else {
            // フォールバック: 観光客ログインモーダルを直接表示
            sessionStorage.setItem('pendingGuideId', guideId);
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
          }
        }
        
        console.log(`ガイドID ${guideId} の詳細を表示`);
      });
    });
  }

  // ページ読み込み時に実行
  document.addEventListener('DOMContentLoaded', function() {
    // 少し遅延してから実行（他のスクリプトの読み込み完了を待つ）
    setTimeout(() => {
      displayGuides();
    }, 500);
  });

})();