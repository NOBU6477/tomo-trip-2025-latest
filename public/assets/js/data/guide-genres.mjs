export const GUIDE_GENRES = [
  { value: 'beach_views', label: 'ビーチ・絶景案内' },
  { value: 'cafe_sweets', label: 'カフェ巡り＆スイーツ案内' },
  { value: 'local_bar', label: 'ローカル居酒屋・バー案内' },
  { value: 'market_walk', label: '朝市・市場・商店街さんぽ案内' },
  { value: 'history_culture', label: '歴史・文化・世界遺産案内' },
  { value: 'traditional_music', label: '三線・エイサー・伝統芸能体験案内' },
  { value: 'marine_activity', label: 'マリンアクティビティ案内' },
  { value: 'fishing_boat', label: '釣り・ボート・海あそび案内' },
  { value: 'drive_photo', label: 'ドライブ＆フォトスポット案内' },
  { value: 'nature_trek', label: '自然・トレッキング・滝案内' },
  { value: 'family_friendly', label: 'ファミリー向け案内' },
  { value: 'rainy_day', label: '雨の日でも楽しめる案内' },
  { value: 'nightlife', label: 'ナイトライフ案内' },
  { value: 'local_gourmet', label: 'ローカルグルメ食べ歩き案内' },
  { value: 'agri_experience', label: '農業体験・フルーツ狩り案内' },
  { value: 'events_festivals', label: 'イベント・ローカル祭り案内' },
  { value: 'workation', label: 'ワーケーション・長期滞在案内' },
  { value: 'photo_support', label: '写真・動画撮影サポート案内' },
  { value: 'first_time', label: '初めての沖縄向け案内' },
  { value: 'deep_local', label: 'ディープローカル・ディープ飲み案内' }
];

const normalizeText = (text = '') => text
  .toString()
  .toLowerCase()
  .replace(/[\s\u3000・,、/＆&]+/g, '');

export function normalizeGenreValue(value) {
  const normalized = normalizeText(value);
  const match = GUIDE_GENRES.find(genre => normalizeText(genre.label) === normalized || normalizeText(genre.value) === normalized);
  return match ? match.value : null;
}

export function getGenreLabel(value) {
  const found = GUIDE_GENRES.find(genre => genre.value === value);
  return found ? found.label : value;
}

export function extractGuideGenres(guide = {}) {
  const rawGenres = guide.genres ?? guide.specialties ?? [];
  const genreArray = Array.isArray(rawGenres)
    ? rawGenres
    : String(rawGenres || '')
      .split(/[,、・/\n]/)
      .map(item => item.trim())
      .filter(Boolean);

  const normalized = genreArray
    .map(item => normalizeGenreValue(item) || normalizeText(item))
    .filter(Boolean);

  return Array.from(new Set(normalized));
}
