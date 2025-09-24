// 統一地域正規化ユーティリティ - すべての地域マッピングの統一API
import { prefecturesData, locationToCodeMap } from '../data/prefectures-data.mjs';

/**
 * 都道府県名をコードに変換（統一API）
 * @param {string} prefectureName - 都道府県名（例：東京都、沖縄県）
 * @returns {string} 都道府県コード（例：tokyo, okinawa）
 */
export function convertPrefectureNameToCode(prefectureName) {
    if (!prefectureName) return '';
    
    // 直接的なマッピング
    const directCode = locationToCodeMap[prefectureName];
    if (directCode) return directCode;
    
    // 都道府県名から接尾辞を除去してマッチング
    const nameWithoutSuffix = prefectureName.replace(/[都道府県]/g, '');
    for (const [code, data] of Object.entries(prefecturesData)) {
        const prefNameWithoutSuffix = data.name.replace(/[都道府県]/g, '');
        if (nameWithoutSuffix === prefNameWithoutSuffix) {
            return code;
        }
    }
    
    return prefectureName; // フォールバック
}

/**
 * 都道府県コードから名前を取得（統一API）
 * @param {string} code - 都道府県コード（例：tokyo, okinawa）
 * @returns {string} 都道府県名（例：東京都、沖縄県）
 */
export function convertCodeToPrefectureName(code) {
    return prefecturesData[code]?.name || code;
}

/**
 * 地域文字列を正規化してコードに変換（統一API）
 * @param {string} locationString - 地域文字列（様々な形式に対応）
 * @returns {string} 正規化された都道府県コード
 */
export function normalizeLocationToCode(locationString) {
    if (!locationString) return '';
    
    // 1. 完全一致を最初に試行
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
    
    // 2. 部分一致（都道府県名を含む場合）
    for (const [code, data] of Object.entries(prefecturesData)) {
        const prefNameWithoutSuffix = data.name.replace(/[都道府県]/g, '');
        if (locationString.includes(prefNameWithoutSuffix)) {
            return code;
        }
    }
    
    // 3. 直接的なコードマッピング確認
    const directCode = locationToCodeMap[locationString];
    if (directCode) return directCode;
    
    return locationString; // フォールバック
}

/**
 * 地域コードを表示用の名前に変換（統一API）
 * @param {string} code - 地域コード
 * @returns {string} 表示用の地域名
 */
export function convertCodeToDisplayName(code) {
    const data = prefecturesData[code];
    return data ? data.name : code;
}

/**
 * 2つの地域値が同じかどうか比較（統一API）
 * @param {string} location1 - 地域1（コードまたは名前）
 * @param {string} location2 - 地域2（コードまたは名前）
 * @returns {boolean} 同じ地域かどうか
 */
export function compareLocations(location1, location2) {
    if (!location1 || !location2) return false;
    
    const code1 = normalizeLocationToCode(location1);
    const code2 = normalizeLocationToCode(location2);
    
    return code1 === code2;
}

/**
 * 全都道府県の名前→コードマッピング取得（統一API）
 * @returns {Object} 名前→コードのマッピングオブジェクト
 */
export function getAllLocationMappings() {
    return locationToCodeMap;
}

/**
 * 全都道府県データ取得（統一API）
 * @returns {Object} 都道府県データ
 */
export function getAllPrefecturesData() {
    return prefecturesData;
}

// 下位互換性のためのエクスポート
export const locationNames = {};
Object.entries(prefecturesData).forEach(([code, data]) => {
    locationNames[code] = data.name;
});

// デバッグ用
console.log('🗾 Location Utils loaded:', {
    prefectures: Object.keys(prefecturesData).length,
    mappings: Object.keys(locationToCodeMap).length
});