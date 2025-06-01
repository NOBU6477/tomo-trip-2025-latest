/**
 * ツアープラン修正スクリプト
 * guide-details.htmlページのツアープラン情報を正確に更新
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ツアープラン修正スクリプトを開始');
  
  // すぐに実行するのではなく、ページが完全に読み込まれるまで待つ
  setTimeout(fixTourPlans, 1000);
});

/**
 * ツアープラン修正処理
 */
function fixTourPlans() {
  // ガイドID確認
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('id');
  
  if (!guideId) {
    console.warn('ガイドIDが見つかりませんでした');
    return;
  }
  
  console.log(`ガイドID=${guideId}のツアープラン情報を修正します`);
  
  // ガイドデータを取得
  let guideData;
  try {
    // localStorage から直接データを取得
    const guideKey = `guide_${guideId}`;
    const savedDataJson = localStorage.getItem(guideKey);
    
    if (savedDataJson) {
      try {
        guideData = JSON.parse(savedDataJson);
        console.log('ガイドデータをストレージから取得:', guideData.name);
      } catch (e) {
        console.error('ガイドデータのJSON解析に失敗:', e);
      }
    }
    
    // データが取得できない場合は表示中のHTMLから取得
    if (!guideData) {
      guideData = extractGuideDataFromPage();
    }
    
    if (!guideData || !guideData.location) {
      console.error('ガイド情報が不完全です');
      return;
    }
    
    // ツアープランコンテナを取得
    const tourPlanContainer = document.getElementById('tour-plans-container');
    if (!tourPlanContainer) {
      console.error('ツアープランコンテナが見つかりません');
      return;
    }
    
    // ローディングアニメーションを削除
    tourPlanContainer.innerHTML = '';
    
    // 地域情報から都道府県と市区町村を抽出
    const location = guideData.location;
    const locationParts = location.split(' ');
    const prefecture = locationParts[0] || '';
    const city = locationParts[1] || '';
    
    // ツアープランを作成
    const tourPlans = generateTourPlans(prefecture, city, guideData.name, guideData.fee);
    
    // ツアープランをコンテナに追加
    tourPlanContainer.appendChild(tourPlans);
    
    console.log(`${prefecture} ${city}のツアープラン情報を挿入しました`);
    
  } catch (e) {
    console.error('ツアープラン修正エラー:', e);
  }
}

/**
 * 表示されているページからガイド情報を抽出
 * @returns {Object} ガイドデータ
 */
function extractGuideDataFromPage() {
  const nameElement = document.getElementById('guide-name');
  const locationElement = document.getElementById('guide-location');
  const feeElement = document.getElementById('guide-fee');
  
  const name = nameElement ? nameElement.textContent.trim() : '';
  
  // 地域情報からアイコンを除去
  const locationText = locationElement ? 
    locationElement.textContent.replace('', '').trim() : '';
  
  // 料金文字列から数値のみを抽出
  const feeText = feeElement ? feeElement.textContent : '';
  const feeMatch = feeText.match(/¥([\d,]+)/);
  const fee = feeMatch ? parseInt(feeMatch[1].replace(/,/g, ''), 10) : 6000;
  
  return {
    name: name,
    location: locationText,
    fee: fee
  };
}

/**
 * ツアープランを生成
 * @param {string} prefecture 都道府県
 * @param {string} city 市町村
 * @param {string} guideName ガイド名
 * @param {number} baseFee 基本料金
 * @returns {HTMLElement} ツアープラン要素
 */
function generateTourPlans(prefecture, city, guideName, baseFee) {
  const container = document.createElement('div');
  
  // 現在の言語設定を取得
  const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
  const isEnglish = currentLang === 'en';
  
  // 地域名が空白の場合は代替テキストを使用
  const areaName = city || prefecture || (isEnglish ? 'Local Area' : '地元');
  const prefName = prefecture || (isEnglish ? 'Region' : '地域');
  
  // 翻訳テキストの定義
  const translations = {
    ja: {
      highlightTitle: `${areaName}ハイライトツアー`,
      highlightDesc: `${prefName}の魅力が詰まった${areaName}を巡る特別なツアーです。地元の人だけが知る隠れた名所や、観光客に人気のスポットをバランスよくご案内します。`,
      gourmetTitle: `${areaName}グルメ満喫ツアー`,
      gourmetDesc: `${prefName}${areaName}の美味しいグルメスポットを巡るフードツアーです。地元の人だけが知る店や、最新のトレンド店など、様々な食べ物を楽しむことができます。`,
      duration: '所要時間',
      about3hours: '約3時間',
      about4hours: '約4時間',
      groupSize: '対応人数',
      people14: '1～4人',
      people13: '1～3人',
      fee: '料金',
      person: '人',
      transportFood: '交通費・食事代別',
      mealIncluded: '食事代3店舗分込み'
    },
    en: {
      highlightTitle: `${areaName} Highlights Tour`,
      highlightDesc: `A special tour exploring ${areaName} filled with ${prefName}'s charm. We guide you through hidden gems known only to locals and popular tourist spots in a well-balanced way.`,
      gourmetTitle: `${areaName} Gourmet Experience Tour`,
      gourmetDesc: `A food tour exploring delicious gourmet spots in ${prefName}${areaName}. Enjoy various foods from famous restaurants known only to locals to the latest trendy spots.`,
      duration: 'Duration',
      about3hours: 'About 3 hours',
      about4hours: 'About 4 hours',
      groupSize: 'Group Size',
      people14: '1-4 people',
      people13: '1-3 people',
      fee: 'Fee',
      person: 'person',
      transportFood: 'Transportation and meals not included',
      mealIncluded: 'Meals at 3 restaurants included'
    }
  };
  
  const t = translations[currentLang] || translations.ja;
  
  // ツアープラン1: ハイライトツアー
  const plan1 = document.createElement('div');
  plan1.className = 'card mb-3';
  plan1.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${t.highlightTitle}</h5>
      <p class="card-text">${t.highlightDesc}</p>
      <hr>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-clock me-2"></i>
        <span>${t.duration}: ${t.about3hours}</span>
      </div>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-people me-2"></i>
        <span>${t.groupSize}: ${t.people14}</span>
      </div>
      <div class="d-flex align-items-center">
        <i class="bi bi-cash me-2"></i>
        <span>${t.fee}: ¥${baseFee.toLocaleString()}/${t.person} (${t.transportFood})</span>
      </div>
    </div>
  `;
  
  // ツアープラン2: グルメツアー
  const plan2 = document.createElement('div');
  plan2.className = 'card mb-3';
  plan2.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${t.gourmetTitle}</h5>
      <p class="card-text">${t.gourmetDesc}</p>
      <hr>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-clock me-2"></i>
        <span>${t.duration}: ${t.about4hours}</span>
      </div>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-people me-2"></i>
        <span>${t.groupSize}: ${t.people13}</span>
      </div>
      <div class="d-flex align-items-center">
        <i class="bi bi-cash me-2"></i>
        <span>${t.fee}: ¥${(baseFee * 1.2).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')}/${t.person} (${t.mealIncluded})</span>
      </div>
    </div>
  `;
  
  container.appendChild(plan1);
  container.appendChild(plan2);
  
  return container;
}