/**
 * 翻訳データの重複宣言を防止するスクリプト
 * translationDataが複数回宣言されるのを防ぎ、「99」エラーを解消します
 */

(function() {
  // 既に実行済みかチェック
  if (window.translationDataProtected) {
    return;
  }
  
  // グローバルフラグを設定
  window.translationDataProtected = true;
  
  // オリジナルの翻訳データを保存
  const originalTranslationData = window.translationData || {};
  
  // 既存のtranslationDataを保持するだけの方式に変更
  // Object.definePropertyの問題を回避
  
  // 新しい翻訳データがセットされた場合の処理
  window.updateTranslationData = function(newData) {
    if (!newData || typeof newData !== 'object') return;
    
    // 既存のデータにマージするだけ
    try {
      Object.keys(newData).forEach(function(key) {
        if (!window.translationData[key]) {
          window.translationData[key] = newData[key];
        }
      });
      
      console.log('翻訳データが安全に更新されました');
    } catch (e) {
      console.error('翻訳データの更新中にエラーが発生しました:', e);
    }
  };
  
  // 既存のスクリプトが window.translationData = {...} と書いていても動作するように
  // 1秒おきにチェックして修復する非同期パッチを適用
  const translationDataChecker = setInterval(function() {
    // translationDataがnullまたはundefinedになってしまった場合に復旧
    if (!window.translationData) {
      console.warn('translationDataが失われました。復元します...');
      window.translationData = originalTranslationData;
    }
  }, 1000);
  
  console.log('翻訳データ保護が有効化されました');
})();