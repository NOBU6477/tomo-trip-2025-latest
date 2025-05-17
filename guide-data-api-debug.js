/**
 * ガイドデータ取得用デバッグAPI
 * JSON解析エラー対策を強化したバージョン
 */

// デバッグモード - 変数名競合を避けるためグローバルスコープに移動
if (typeof window.GUIDE_DEBUG_MODE === 'undefined') {
  window.GUIDE_DEBUG_MODE = true;
}

// ガイドデータAPI（デバッグ版）
const GuideDataDebugAPI = {
  
  /**
   * ログを出力
   */
  log: function(message, data) {
    if (window.GUIDE_DEBUG_MODE) {
      console.log(`[GuideDataDebugAPI] ${message}`, data || '');
    }
  },
  
  /**
   * エラーログを出力
   */
  error: function(message, error) {
    console.error(`[GuideDataDebugAPI] ${message}`, error || '');
  },
  
  /**
   * 文字列のエンコード
   */
  safeEncode: function(str) {
    if (typeof str !== 'string') return '';
    return encodeURIComponent(str);
  },
  
  /**
   * 文字列のデコード
   */
  safeDecode: function(str) {
    if (typeof str !== 'string') return '';
    
    try {
      // 既にデコードされている場合は再デコードしない
      if (!str.includes('%')) return str;
      return decodeURIComponent(str);
    } catch (e) {
      this.error('デコードエラー:', e);
      return str; // エラー時は元の文字列を返す
    }
  },
  
  /**
   * JSON文字列の安全な解析
   */
  safeParse: function(jsonStr) {
    if (!jsonStr) return null;
    
    try {
      // デバッグ用に文字列を表示
      if (window.GUIDE_DEBUG_MODE) {
        const preview = jsonStr.length > 100 ? jsonStr.substring(0, 100) + '...' : jsonStr;
        this.log(`JSON解析対象: ${preview}`);
      }
      
      // 特殊なエスケープ問題を修正
      let cleanedStr = jsonStr;
      
      // 不正な文字を置換
      cleanedStr = cleanedStr.replace(/\\"/g, '"');
      cleanedStr = cleanedStr.replace(/\\\\/g, '\\');
      
      // 最後に解析
      return JSON.parse(cleanedStr);
    } catch (e) {
      this.error('JSON解析エラー:', e);
      
      // エラー詳細を表示
      if (window.GUIDE_DEBUG_MODE && jsonStr) {
        const errorPos = e.message.match(/position\s+(\d+)/);
        if (errorPos && errorPos[1]) {
          const pos = parseInt(errorPos[1], 10);
          const start = Math.max(0, pos - 20);
          const end = Math.min(jsonStr.length, pos + 20);
          const errorContext = jsonStr.substring(start, end);
          this.error(`エラー位置周辺: ${errorContext}`);
          this.error(`エラー位置: ${pos}, 文字: "${jsonStr.charAt(pos)}"`);
        }
      }
      
      return null;
    }
  },
  
  /**
   * オブジェクトの安全なシリアライズ
   */
  safeStringify: function(obj) {
    if (!obj) return '';
    
    try {
      return JSON.stringify(obj);
    } catch (e) {
      this.error('JSONシリアライズエラー:', e);
      return '';
    }
  },
  
  /**
   * ガイドIDからデータを取得
   */
  getGuideData: function(guideId) {
    if (!guideId) {
      this.error('無効なガイドID');
      return null;
    }
    
    // オブジェクトの場合はidプロパティを使用
    if (typeof guideId === 'object' && guideId !== null) {
      if (guideId.id) {
        this.log(`オブジェクトからIDを抽出: ${guideId.id}`);
        guideId = guideId.id;
      } else {
        this.error('ガイドIDオブジェクトにidプロパティがありません', guideId);
        return null;
      }
    }
    
    this.log(`ガイドID=${guideId}のデータを取得中...`);
    
    try {
      // 1. 個別データを取得
      const specificGuideKey = `guide_${guideId}`;
      const specificGuideJson = localStorage.getItem(specificGuideKey);
      
      if (specificGuideJson) {
        this.log(`個別キー[${specificGuideKey}]のJSONデータ: 長さ=${specificGuideJson.length}`);
        const guideData = this.safeParse(specificGuideJson);
        
        if (guideData) {
          this.log(`個別ガイドデータ解析成功: ${guideData.name || 'Unknown'}`);
          return guideData;
        }
      }
      
      // 2. ガイドリストから取得
      const guidesListJson = localStorage.getItem('guidesData');
      
      if (guidesListJson) {
        this.log(`ガイドリストJSONデータ: 長さ=${guidesListJson.length}`);
        const guidesList = this.safeParse(guidesListJson);
        
        if (guidesList && Array.isArray(guidesList)) {
          const matchedGuide = guidesList.find(g => g.id && g.id.toString() === guideId.toString());
          
          if (matchedGuide) {
            this.log(`ガイドリストから一致するデータを発見: ${matchedGuide.name || 'Unknown'}`);
            return matchedGuide;
          }
        }
      }
      
      // 3. ページのDOM要素から直接取得
      this.log('DOM要素からガイドデータの取得を試みます...');
      return this.getGuideDataFromDOM(guideId);
      
    } catch (e) {
      this.error('ガイドデータの取得に失敗しました:', e);
      return null;
    }
  },
  
  /**
   * DOM要素からガイドデータを抽出
   */
  getGuideDataFromDOM: function(guideId) {
    try {
      // HTML要素を探す - guideIdが文字列でない場合の対応
      let querySelector = '.guide-card';
      if (guideId) {
        // 検索用のセレクタを作成
        querySelector = `.guide-card[data-guide-id="${guideId}"]`;
      }
      
      this.log(`カード要素の検索: ${querySelector}`);
      const cardElement = document.querySelector(querySelector);
      
      if (cardElement) {
        this.log('ガイドカード要素を発見:', cardElement);
        
        // カードからデータを抽出
        const location = cardElement.getAttribute('data-location') || '';
        const languages = cardElement.getAttribute('data-languages') || '';
        const fee = cardElement.getAttribute('data-fee') || '6000';
        const keywords = cardElement.getAttribute('data-keywords') || '';
        
        let name = '';
        let imageUrl = '';
        
        // 画像とガイド名を取得
        const imageElement = cardElement.querySelector('.guide-image');
        if (imageElement) {
          imageUrl = imageElement.getAttribute('src') || '';
          name = (imageElement.getAttribute('alt') || '').replace('のガイド写真', '');
        }
        
        // 名前が取得できなかった場合、カードタイトルから取得
        if (!name || name.trim() === '') {
          const titleElement = cardElement.querySelector('.card-title');
          if (titleElement) {
            name = titleElement.textContent.trim();
          }
        }
        
        // データを構築
        if (name) {
          const guideData = {
            id: guideId,
            name: name,
            location: this.safeDecode(location),
            languages: languages ? this.safeDecode(languages).split(',') : ['日本語'],
            fee: parseInt(fee, 10) || 6000,
            keywords: keywords ? this.safeDecode(keywords).split(',') : [],
            imageUrl: imageUrl,
            rating: 4.0 + (Math.random() * 1.0),
            reviewCount: 5 + Math.floor(Math.random() * 20),
            bio: `こんにちは！${this.safeDecode(location)}在住の${name}です。地元の魅力をご案内いたします。`
          };
          
          this.log('DOM要素から抽出したデータ:', guideData);
          return guideData;
        }
      }
      
      this.error(`ガイドID=${guideId}のカード要素が見つかりません`);
      return null;
    } catch (e) {
      this.error('DOM要素からのデータ抽出エラー:', e);
      return null;
    }
  },
  
  /**
   * エラー回避のためのデータをガイドIDから生成
   */
  getFallbackData: function(guideId) {
    this.log(`フォールバックデータを生成: ID=${guideId}`);
    
    return {
      id: guideId,
      name: `ガイド${guideId}`,
      location: '東京都 新宿区',
      languages: ['日本語', '英語'],
      fee: 6000,
      keywords: ['観光', 'グルメ', '文化'],
      rating: 4.0,
      reviewCount: 5,
      bio: 'こんにちは！地元の魅力をご案内いたします。'
    };
  }
};

// グローバルに公開
window.GuideDataDebugAPI = GuideDataDebugAPI;