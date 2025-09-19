// 都道府県選択UI生成モジュール
import { prefecturesData, regionTypes } from '../data/prefectures-data.mjs';

// 地域別にグループ化した都道府県選択HTMLを生成
export function generatePrefectureOptions() {
  const regions = {
    "北海道地方": ["hokkaido"],
    "東北地方": ["aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima"], 
    "関東地方": ["ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa"],
    "中部地方": ["niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano", "gifu", "shizuoka", "aichi"],
    "近畿地方": ["mie", "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama"], 
    "中国地方": ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"],
    "四国地方": ["tokushima", "kagawa", "ehime", "kochi"],
    "九州地方": ["fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima"],
    "沖縄・離島": ["okinawa", "remote_islands"]
  };

  let optionsHTML = '<option value="">活動地域を選択してください</option>\n';

  Object.entries(regions).forEach(([regionName, prefectureCodes]) => {
    optionsHTML += `<optgroup label="${regionName}">\n`;
    
    prefectureCodes.forEach(code => {
      const prefecture = prefecturesData[code];
      if (prefecture) {
        optionsHTML += `    <option value="${code}" data-region="${prefecture.region}" data-attributes='${JSON.stringify(prefecture.attributes)}'>${prefecture.name}</option>\n`;
      }
    });
    
    optionsHTML += `</optgroup>\n`;
  });

  return optionsHTML;
}

// 地域属性フィルター用のチェックボックス生成
export function generateAttributeFilters() {
  const allAttributes = new Set();
  Object.values(prefecturesData).forEach(prefecture => {
    prefecture.attributes.forEach(attr => allAttributes.add(attr));
  });

  let attributeHTML = '';
  [...allAttributes].sort().forEach(attribute => {
    attributeHTML += `
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="attr-${attribute}" value="${attribute}">
        <label class="form-check-label" for="attr-${attribute}">${attribute}</label>
      </div>
    `;
  });

  return attributeHTML;
}

// 都道府県コードから名前を取得
export function getPrefectureName(code) {
  return prefecturesData[code]?.name || code;
}

// 地域マッチング関数（API responseの地域文字列をコードにマッピング）
export function matchLocationToCode(locationString) {
  if (!locationString) return null;
  
  // 完全一致を最初に試行
  for (const [code, data] of Object.entries(prefecturesData)) {
    if (locationString === data.name) {
      return code;
    }
    
    // "都道府県 市区町村" 形式での一致
    if (locationString.startsWith(data.name + ' ')) {
      return code;
    }
    
    // 市区町村リストとの照合
    for (const city of data.cities) {
      if (locationString === `${data.name} ${city}`) {
        return code;
      }
    }
  }
  
  // 部分一致（都道府県名を含む場合）
  for (const [code, data] of Object.entries(prefecturesData)) {
    if (locationString.includes(data.name.replace(/[都道府県]/g, ''))) {
      return code;
    }
  }
  
  return null;
}