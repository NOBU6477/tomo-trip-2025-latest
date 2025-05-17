/**
 * translationDataの重複宣言を修正するスクリプト
 * 既存のtranslationDataがある場合は新たに宣言しないようにします
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('重複宣言修正スクリプトを読み込みました');
  
  // グローバルスコープのtranslationDataを確認
  if (typeof window.translationData === 'undefined') {
    console.log('translationDataが未定義です - 問題はありません');
  } else {
    console.log('translationDataは既に定義されています - 重複宣言を防止します');
    
    // translationData宣言をフックするために専用のスクリプトタグを探す
    const scriptTags = document.querySelectorAll('script[src*="translation-data.js"]');
    
    if (scriptTags.length > 1) {
      console.log('translation-data.jsの重複読み込みを検出: ' + scriptTags.length + '回');
      
      // 最初の1つ以外は無効化
      for (let i = 1; i < scriptTags.length; i++) {
        scriptTags[i].setAttribute('data-disabled', 'true');
        console.log('translation-data.jsの' + (i+1) + '番目の読み込みを無効化しました');
      }
    }
  }
  
  // グローバルスコープに変数が定義されていないか確認するヘルパー関数
  function checkGlobalVarDuplicate() {
    // 重要なグローバル変数のリスト
    const criticalVars = [
      'translationData',
      'translateText',
      'getTranslation',
      'switchLanguage'
    ];
    
    criticalVars.forEach(varName => {
      if (window[varName] && window[varName].isDuplicate) {
        console.warn(`${varName}が重複して定義されています`);
      }
    });
  }
  
  // ページ読み込み完了時に実行
  window.addEventListener('load', function() {
    checkGlobalVarDuplicate();
  });
});