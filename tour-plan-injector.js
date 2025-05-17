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
  
  // 地域名が空白の場合は代替テキストを使用
  const areaName = city || prefecture || '地元';
  const prefName = prefecture || '地域';
  
  // ツアープラン1: ハイライトツアー
  const plan1 = document.createElement('div');
  plan1.className = 'card mb-3';
  plan1.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${areaName}ハイライトツアー</h5>
      <p class="card-text">${prefName}の魅力が詰まった${areaName}を巡る特別なツアーです。地元の人だけが知る隠れた名所や、観光客に人気のスポットをバランスよくご案内します。</p>
      <hr>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-clock me-2"></i>
        <span>所要時間: 約3時間</span>
      </div>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-people me-2"></i>
        <span>対応人数: 1～4人</span>
      </div>
      <div class="d-flex align-items-center">
        <i class="bi bi-cash me-2"></i>
        <span>料金: ¥${baseFee.toLocaleString()}／人（交通費・食事代別）</span>
      </div>
    </div>
  `;
  
  // ツアープラン2: グルメツアー
  const plan2 = document.createElement('div');
  plan2.className = 'card mb-3';
  plan2.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${areaName}グルメ満喫ツアー</h5>
      <p class="card-text">${prefName}${areaName}の美味しいグルメスポットを巡るフードツアーです。地元の人だけが知る店や、最新のトレンド店など、様々な食べ物を楽しむことができます。</p>
      <hr>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-clock me-2"></i>
        <span>所要時間: 約4時間</span>
      </div>
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-people me-2"></i>
        <span>対応人数: 1～3人</span>
      </div>
      <div class="d-flex align-items-center">
        <i class="bi bi-cash me-2"></i>
        <span>料金: ¥${(baseFee * 1.2).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')}／人（食事代3店舗分込み）</span>
      </div>
    </div>
  `;
  
  container.appendChild(plan1);
  container.appendChild(plan2);
  
  return container;
}