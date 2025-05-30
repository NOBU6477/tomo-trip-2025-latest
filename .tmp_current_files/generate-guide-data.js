/**
 * テスト用ガイドデータの生成スクリプト
 * 様々な地域、言語、料金、キーワードを持つガイドを30名ほど生成します
 */

// 日本の地域データ
const regions = [
  "北海道 札幌市", "北海道 函館市", "青森県 青森市", "宮城県 仙台市", "秋田県 秋田市",
  "山形県 山形市", "福島県 会津若松市", "茨城県 水戸市", "栃木県 日光市", "群馬県 前橋市",
  "埼玉県 川越市", "千葉県 千葉市", "東京都 新宿区", "東京都 渋谷区", "東京都 台東区",
  "神奈川県 横浜市", "神奈川県 鎌倉市", "新潟県 新潟市", "富山県 富山市", "石川県 金沢市",
  "福井県 福井市", "山梨県 甲府市", "長野県 松本市", "岐阜県 高山市", "静岡県 静岡市",
  "愛知県 名古屋市", "三重県 伊勢市", "滋賀県 大津市", "京都府 京都市", "大阪府 大阪市",
  "兵庫県 神戸市", "奈良県 奈良市", "和歌山県 和歌山市", "鳥取県 鳥取市", "島根県 松江市",
  "岡山県 岡山市", "広島県 広島市", "山口県 下関市", "徳島県 徳島市", "香川県 高松市",
  "愛媛県 松山市", "高知県 高知市", "福岡県 福岡市", "佐賀県 佐賀市", "長崎県 長崎市",
  "熊本県 熊本市", "大分県 別府市", "宮崎県 宮崎市", "鹿児島県 鹿児島市", "沖縄県 那覇市"
];

// 離島データ
const islands = [
  "沖縄県 石垣島", "沖縄県 宮古島", "沖縄県 竹富島", "沖縄県 西表島", "沖縄県 与那国島",
  "東京都 小笠原諸島", "鹿児島県 屋久島", "鹿児島県 種子島", "鹿児島県 奄美大島",
  "長崎県 壱岐", "長崎県 対馬", "島根県 隠岐諸島", "新潟県 佐渡島"
];

// すべての地域を結合
const allRegions = [...regions, ...islands];

// 言語データ
const languages = [
  ["日本語"],
  ["日本語", "英語"],
  ["日本語", "中国語"],
  ["日本語", "韓国語"],
  ["日本語", "英語", "中国語"],
  ["日本語", "英語", "フランス語"],
  ["日本語", "英語", "スペイン語"],
  ["日本語", "英語", "ドイツ語"],
  ["日本語", "英語", "イタリア語"]
];

// キーワードデータ
const keywordSets = [
  ["ナイトツアー", "グルメ"],
  ["写真スポット", "観光"],
  ["料理", "文化体験"],
  ["アクティビティ", "自然"],
  ["歴史", "寺院"],
  ["ショッピング", "ファッション"],
  ["伝統文化", "祭り"],
  ["音楽", "エンターテイメント"],
  ["アート", "博物館"],
  ["温泉", "リラクゼーション"],
  ["登山", "トレッキング"],
  ["マリンスポーツ", "ビーチ"],
  ["建築", "街歩き"],
  ["酒蔵巡り", "地酒"],
  ["工芸品", "お土産"]
];

// 名前データ
const firstNames = [
  "太郎", "次郎", "三郎", "四郎", "五郎", "六郎", "七郎", "八郎", "九郎", "十郎",
  "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
  "春", "夏", "秋", "冬", "朝", "昼", "夕", "夜", "朔", "望"
];

const lastNames = [
  "佐藤", "鈴木", "高橋", "田中", "伊藤", "山本", "渡辺", "中村", "小林", "加藤",
  "吉田", "山田", "佐々木", "山口", "松本", "井上", "木村", "林", "斎藤", "清水",
  "山崎", "森", "池田", "橋本", "阿部", "石川", "山下", "中島", "石井", "小川"
];

// ガイド説明文のテンプレート
const descriptionTemplates = [
  "{region}の魅力を知り尽くしたローカルガイドです。{keyword1}や{keyword2}のスポットをご案内します。",
  "{region}出身のガイドが地元の隠れた名所をご紹介。特に{keyword1}スポットが充実しています。",
  "{region}在住10年以上のガイドが、観光客だけでは見つけられない{keyword1}や{keyword2}の場所にご案内します。",
  "{region}のローカルフードやトレンドスポットを知り尽くしています。{keyword1}好きの方におすすめです。",
  "{keyword1}と{keyword2}を中心に、{region}の魅力をお伝えします。現地の生活や文化も体験できます。",
  "{region}の歴史と文化に精通したガイドです。{keyword1}から{keyword2}まで幅広くご案内します。",
  "{region}で育った地元民ならではの視点で、{keyword1}の名所や{keyword2}スポットを案内します。",
  "{region}の{keyword1}に特化したツアーを提供しています。{keyword2}も併せてお楽しみいただけます。",
  "生まれも育ちも{region}の地元っ子。{keyword1}や{keyword2}など、あなたの興味に合わせたプランをご提案します。",
  "{region}の自然や文化を愛する地元ガイド。特に{keyword1}の魅力をお伝えします。{keyword2}にもご案内可能です。"
];

// 画像URL設定
const imageBaseUrl = "https://placehold.co/400x300?text=";

// 料金設定 (6,000円〜20,000円)
const fees = [6000, 7000, 8000, 9000, 10000, 12000, 15000, 18000, 20000];

// 評価設定 (3.5〜5.0)
const ratings = [3.5, 3.8, 4.0, 4.2, 4.5, 4.7, 4.8, 4.9, 5.0];

/**
 * 0〜max-1の範囲でランダムな整数を返す
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * 配列からランダムな要素を返す
 */
function getRandomElement(array) {
  return array[getRandomInt(array.length)];
}

/**
 * ガイドデータを生成する
 * @param {number} count 生成するガイド数
 * @returns {Array} ガイドデータの配列
 */
function generateGuideData(count) {
  const guides = [];
  
  for (let i = 0; i < count; i++) {
    // 基本情報の生成
    const guideId = i + 7; // 既存の6ガイドの後から
    const region = getRandomElement(allRegions);
    const langSet = getRandomElement(languages);
    const keywordSet = getRandomElement(keywordSets);
    const fee = getRandomElement(fees);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const name = lastName + " " + firstName;
    const rating = getRandomElement(ratings);
    
    // 地域名からシンプルな地名を抽出（画像テキスト用）
    const regionShort = region.split(" ")[0];
    const imageUrl = `${imageBaseUrl}${encodeURIComponent(regionShort)}ガイド`;
    
    // 説明文の生成
    let description = getRandomElement(descriptionTemplates)
      .replace("{region}", region.split(" ")[0])
      .replace("{keyword1}", keywordSet[0])
      .replace("{keyword2}", keywordSet[1]);
    
    // ガイドデータオブジェクトの作成
    guides.push({
      id: guideId,
      name: name,
      region: region,
      languages: langSet,
      keywords: keywordSet,
      fee: fee,
      description: description,
      imageUrl: imageUrl,
      rating: rating
    });
  }
  
  return guides;
}

/**
 * ガイドデータからHTMLを生成する
 * @param {Array} guides ガイドデータの配列
 * @returns {string} ガイドカードのHTML
 */
function generateGuideCardsHTML(guides) {
  let html = '';
  
  guides.forEach(guide => {
    // 言語バッジHTML
    const languageBadgesHTML = guide.languages.map(lang => 
      `<span class="badge bg-light text-dark guide-lang me-1">${lang}</span>`
    ).join('');
    
    // キーワードバッジHTML
    const keywordBadgesHTML = guide.keywords.map(keyword => 
      `<span class="badge bg-info text-dark me-1">${keyword}</span>`
    ).join('');
    
    // 評価星HTML
    const fullStars = Math.floor(guide.rating);
    const halfStar = guide.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="bi bi-star-fill"></i>';
    }
    if (halfStar) {
      starsHTML += '<i class="bi bi-star-half"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="bi bi-star"></i>';
    }
    
    // カードHTML生成
    html += `
        <div class="col-md-4 guide-item">
          <div class="card guide-card shadow-sm" data-guide-id="${String(guide.id)}" data-location="${encodeURIComponent(guide.region)}" data-languages="${encodeURIComponent(guide.languages.join(','))}" data-fee="${String(guide.fee)}" data-keywords="${encodeURIComponent(guide.keywords.join(','))}">
            <img src="${guide.imageUrl}" class="card-img-top guide-image" alt="${guide.name}のガイド写真">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">${guide.name}</h5>
                <span class="badge bg-primary guide-fee">¥${guide.fee.toLocaleString()}/セッション</span>
              </div>
              <p class="card-text text-muted mb-2 guide-location">
                <i class="bi bi-geo-alt-fill me-1"></i>${guide.region}
              </p>
              <p class="card-text mb-3">${guide.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="guide-languages">
                  ${languageBadgesHTML}
                </div>
                <div class="text-warning">
                  ${starsHTML}
                  <span class="text-dark ms-1">${guide.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div class="card-footer bg-white border-0 pt-0">
              <a href="#" class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${String(guide.id)}">詳細を見る</a>
            </div>
          </div>
        </div>
    `;
  });
  
  return html;
}

// 30名のガイドデータを生成
const guides = generateGuideData(30);

// HTMLを生成して出力
const guideCardsHTML = generateGuideCardsHTML(guides);
console.log(guideCardsHTML);

// この関数を呼び出すとHTMLを生成できる
window.generateAdditionalGuideCards = function() {
  return generateGuideCardsHTML(guides);
};