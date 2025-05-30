/**
 * ガイドデータを初期化および修正するスクリプト
 * 不完全なガイドデータを検出し、必要なフィールドを補完する
 */
document.addEventListener('DOMContentLoaded', function() {
  // ガイドデータを初期化
  initializeGuideData();
  
  // 北海道ガイドデータを追加
  ensureHokkaidoGuideData();
  
  // 既存のガイドデータをチェックして修正
  fixIncompleteGuideData();
});

/**
 * 主要ガイドデータの初期化とリストの同期
 */
function initializeGuideData() {
  console.log('ガイドデータ初期化を開始...');
  
  // テスト用ガイドデータ
  const guideData = {
    id: "7",
    name: "井上 六郎",
    location: "埼玉県 川越市",
    languages: ["日本語", "英語", "スペイン語"],
    fee: 20000,
    keywords: ["写真スポット", "観光"],
    imageUrl: "https://placehold.co/400x300?text=%E5%9F%BC%E7%8E%89%E7%9C%8Cガイド",
    specialties: ["グルメ", "写真スポット"],
    rating: 4.5,
    reviewCount: 12,
    bio: "こんにちは！埼玉県川越市在住の井上六郎です。10年間で100人以上の外国人の方々に川越の魅力をご案内してきました。特に蔵造りの街並みや時の鐘、菓子屋横丁などのエリアに詳しく、観光スポットだけでなく、地元の人しか知らない隠れた名所や美味しいお店もご紹介できます。日本語、英語、スペイン語でのガイドが可能で、写真撮影も得意なので、旅の思い出作りもお手伝いします。お客様のリクエストに柔軟に対応し、あなただけの特別な川越観光をご提案します。"
  };
  
  // ガイドデータを整理して保存
  const guideKey = `guide_${guideData.id}`;
  const guideDataJson = JSON.stringify(guideData);
  localStorage.setItem(guideKey, guideDataJson);
  
  console.log(`ガイドID=${guideData.id}のデータを初期化しました: ${guideData.name}`);
  
  // guidesDataリストに反映させる（一覧と詳細の同期を確保）
  updateGuideDataInList(guideData);
  
  // すでにデータがある場合は確認
  const savedDataJson = localStorage.getItem(guideKey);
  if (savedDataJson) {
    try {
      const savedData = JSON.parse(savedDataJson);
      console.log(`保存されたデータ確認: ${savedData.name}`);
    } catch (e) {
      console.error('保存データの解析エラー:', e);
    }
  }
}

/**
 * ガイドデータをguidesDataリストにも反映させる
 * @param {Object} guideData 更新するガイドデータ
 */
function updateGuideDataInList(guideData) {
  if (!guideData || !guideData.id) return;
  
  try {
    // guidesDataを取得
    const guidesDataJson = localStorage.getItem('guidesData');
    if (!guidesDataJson) return;
    
    let guidesList = JSON.parse(guidesDataJson);
    if (!Array.isArray(guidesList)) return;
    
    // idが一致するガイドを更新または追加
    let found = false;
    for (let i = 0; i < guidesList.length; i++) {
      if (guidesList[i].id === guideData.id) {
        guidesList[i] = { ...guideData };
        found = true;
        break;
      }
    }
    
    // 見つからなければ追加
    if (!found) {
      guidesList.push(guideData);
    }
    
    // 更新したリストを保存
    localStorage.setItem('guidesData', JSON.stringify(guidesList));
    console.log(`ガイドID=${guideData.id}のデータをリストにも同期しました`);
  } catch (e) {
    console.error('guidesDataリスト更新エラー:', e);
  }
}

/**
 * 不完全なガイドデータを検出して修正
 */
function fixIncompleteGuideData() {
  // ガイドデータの全体リストを取得
  const guidesDataJson = localStorage.getItem('guidesData');
  if (!guidesDataJson) return;
  
  try {
    const guidesData = JSON.parse(guidesDataJson);
    if (!Array.isArray(guidesData)) return;
    
    let hasChanges = false;
    
    // 各ガイドのデータをチェック
    guidesData.forEach(guide => {
      let guideModified = false;
      
      // IDが存在しない場合、新しく割り当て
      if (!guide.id) {
        guide.id = generateUniqueId(guidesData);
        guideModified = true;
      }
      
      // 必須フィールドの欠落をチェック
      if (!guide.location || guide.location.trim() === '') {
        guide.location = getDefaultLocationForPrefecture(guide.id);
        console.log(`ガイドID=${guide.id} (${guide.name})の地域情報を追加: ${guide.location}`);
        guideModified = true;
      }
      
      if (!guide.languages || !Array.isArray(guide.languages) || guide.languages.length === 0) {
        guide.languages = ["日本語"];
        guideModified = true;
      }
      
      if (!guide.fee || typeof guide.fee !== 'number' || guide.fee < 0) {
        guide.fee = 6000;
        guideModified = true;
      }
      
      // 個別のガイドストレージも更新
      if (guideModified) {
        const guideKey = `guide_${guide.id}`;
        localStorage.setItem(guideKey, JSON.stringify(guide));
        hasChanges = true;
      }
    });
    
    // 変更があれば全体リストも更新
    if (hasChanges) {
      localStorage.setItem('guidesData', JSON.stringify(guidesData));
      console.log('不完全なガイドデータを修正しました');
    }
  } catch (e) {
    console.error('ガイドデータの修正中にエラー:', e);
  }
}

/**
 * 一意のIDを生成
 * @param {Array} existingGuides 既存のガイド配列
 * @returns {string} 一意のID
 */
function generateUniqueId(existingGuides) {
  const existingIds = existingGuides.map(g => parseInt(g.id)).filter(id => !isNaN(id));
  const maxId = Math.max(...existingIds, 0);
  return String(maxId + 1);
}

/**
 * ガイドIDに基づいてデフォルトの地域を取得
 * @param {string} guideId ガイドID
 * @returns {string} デフォルトの地域
 */
function getDefaultLocationForPrefecture(guideId) {
  // IDの数値に基づいて主要都市を割り当て
  const id = parseInt(guideId);
  const locations = [
    "東京都 新宿区",
    "東京都 渋谷区",
    "大阪府 大阪市",
    "北海道 札幌市",
    "福岡県 福岡市",
    "京都府 京都市",
    "沖縄県 那覇市",
    "神奈川県 横浜市",
    "愛知県 名古屋市",
    "宮城県 仙台市"
  ];
  
  return locations[id % locations.length];
}

/**
 * ページロード後に実行する処理
 */
setTimeout(function() {
  checkPageAndReload();
}, 1500);

/**
 * 現在のページがガイド詳細ページかをチェックしてリロード
 */
function checkPageAndReload() {
  // 現在ページがガイド詳細ページの場合は再読み込み
  const urlParams = new URLSearchParams(window.location.search);
  const currentGuideId = urlParams.get('id');
  
  if (currentGuideId && window.location.pathname.includes('guide-details.html')) {
    const guideKey = `guide_${currentGuideId}`;
    const guideDataJson = localStorage.getItem(guideKey);
    
    if (guideDataJson) {
      try {
        const guideData = JSON.parse(guideDataJson);
        console.log('ガイド詳細ページを検出: データを適用するためページをリロードします');
        // リロードせずにデータを適用する
        if (window.updateGuideDetails) {
          window.updateGuideDetails(guideData);
        }
      } catch (e) {
        console.error('ガイドデータの解析エラー:', e);
      }
    }
  }
}

/**
 * 北海道のガイドデータをシステムに追加する
 * 北海道のガイドが存在しない場合に追加する
 */
function ensureHokkaidoGuideData() {
  try {
    // guidesDataを取得
    const guidesDataJson = localStorage.getItem('guidesData');
    if (!guidesDataJson) {
      console.log('ガイドデータリストが見つかりません');
      return;
    }
    
    let guidesList = JSON.parse(guidesDataJson);
    if (!Array.isArray(guidesList)) {
      console.log('ガイドデータリストが配列ではありません');
      return;
    }
    
    // 既存の北海道ガイドを検索
    const hasHokkaidoGuide = guidesList.some(guide => {
      if (!guide.location) return false;
      const location = guide.location.toLowerCase();
      return location.includes('北海道') || 
             location.includes('札幌') || 
             location.includes('函館') || 
             location.includes('旭川');
    });
    
    // 北海道ガイドが存在しない場合、新しく追加
    if (!hasHokkaidoGuide) {
      console.log('北海道のガイドデータが見つからないため、追加します');
      
      // 新しいIDを生成
      const newId = generateUniqueId(guidesList);
      
      // 北海道ガイドデータ
      const hokkaidoGuideData = {
        id: newId,
        name: "佐藤 雪",
        location: "北海道 札幌市",
        languages: ["日本語", "英語"],
        fee: 8000,
        keywords: ["自然", "雪景色", "温泉"],
        imageUrl: "https://placehold.co/400x300?text=%E5%8C%97%E6%B5%B7%E9%81%93ガイド",
        specialties: ["アウトドア", "温泉", "グルメ"],
        rating: 4.8,
        reviewCount: 15,
        bio: "北海道札幌市出身の佐藤雪です。北海道の四季折々の自然と文化をお伝えします。夏は爽やかな自然、冬は幻想的な雪景色、そして年間を通じて楽しめる温泉とグルメをご案内します。特に小樽、富良野、ニセコなどの人気エリアに詳しく、写真スポットや地元民だけが知る隠れた名所もご紹介できます。ご要望に合わせたプランをご提案しますので、お気軽にご相談ください。"
      };
      
      // ガイドリストに追加
      guidesList.push(hokkaidoGuideData);
      
      // リストを更新
      localStorage.setItem('guidesData', JSON.stringify(guidesList));
      
      // 個別データも保存
      const guideKey = `guide_${hokkaidoGuideData.id}`;
      localStorage.setItem(guideKey, JSON.stringify(hokkaidoGuideData));
      
      console.log(`北海道ガイド (ID: ${hokkaidoGuideData.id}) を追加しました`);
    } else {
      console.log('北海道のガイドデータは既に存在します');
    }
  } catch (e) {
    console.error('北海道ガイドデータ追加エラー:', e);
  }
}