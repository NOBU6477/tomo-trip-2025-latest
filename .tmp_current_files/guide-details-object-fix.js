/**
 * ガイド詳細画面で [object Object] 問題を修正するスクリプト
 * 複数のスクリプトが競合して詳細画面が点滅する問題を解決
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド詳細オブジェクト修正スクリプトを適用...');
  
  // URLパラメータからガイドIDを取得
  const urlParams = new URLSearchParams(window.location.search);
  const guideId = urlParams.get('id');
  
  // ガイドIDが存在する場合、データソースの同期を実行
  if (guideId) {
    synchronizeGuideSources(guideId);
  }
  
  // オリジナルの displayGuideDetails 関数をバックアップ
  if (window.displayGuideDetails && typeof window.displayGuideDetails === 'function') {
    const originalDisplayGuideDetails = window.displayGuideDetails;
    
    // ラッパー関数で置き換え
    window.displayGuideDetails = function(guideId) {
      // guideId が Object の場合は、そのプロパティを抽出
      if (guideId !== null && typeof guideId === 'object') {
        console.log('ガイドIDがオブジェクトとして渡されました。プロパティ抽出を実行...');
        if (guideId.id) {
          console.log(`オブジェクトからID ${guideId.id} を抽出しました`);
          guideId = guideId.id;
        } else {
          console.error('ガイドIDオブジェクトからIDを抽出できません:', guideId);
          // URLからIDを再取得
          const urlParams = new URLSearchParams(window.location.search);
          guideId = urlParams.get('id') || '1';
          console.log(`URLから代替のガイドID ${guideId} を取得しました`);
        }
      }
      
      // ID文字列を整形（必要に応じてデコード）
      if (typeof guideId === 'string' && guideId.includes('%')) {
        try {
          guideId = decodeURIComponent(guideId);
        } catch (e) {
          console.error('ガイドIDのデコードに失敗:', e);
        }
      }
      
      // オリジナルの関数を安全なIDで呼び出し
      return originalDisplayGuideDetails(guideId);
    };
    
    console.log('displayGuideDetails関数を安全に拡張しました');
  } else {
    console.warn('displayGuideDetails関数が見つかりません');
  }
  
  // GuideDataDebugAPI の修正
  if (window.GuideDataDebugAPI) {
    console.log('GuideDataDebugAPIを修正中...');
    const originalGetGuideData = window.GuideDataDebugAPI.getGuideData;
    
    if (originalGetGuideData && typeof originalGetGuideData === 'function') {
      window.GuideDataDebugAPI.getGuideData = function(guideId) {
        // IDオブジェクトの安全な抽出
        if (guideId !== null && typeof guideId === 'object') {
          console.log('GuideDataDebugAPI: IDオブジェクトを検出 - 安全に抽出します');
          if (guideId.id) {
            guideId = guideId.id;
          } else {
            const urlParams = new URLSearchParams(window.location.search);
            guideId = urlParams.get('id') || '1';
          }
        }
        
        return originalGetGuideData.call(window.GuideDataDebugAPI, guideId);
      };
      
      console.log('GuideDataDebugAPI.getGuideData関数を安全に拡張しました');
    }
  }
  
  // guide-details-unified.js の fetchGuideDetails 関数も修正
  if (window.fetchGuideDetails && typeof window.fetchGuideDetails === 'function') {
    const originalFetchGuideDetails = window.fetchGuideDetails;
    
    window.fetchGuideDetails = function(guideId) {
      // guideId が Object の場合は、そのプロパティを抽出
      if (guideId !== null && typeof guideId === 'object') {
        console.log('fetchGuideDetails: IDオブジェクトを検出 - 安全に抽出します');
        if (guideId.id) {
          guideId = guideId.id;
        } else {
          const urlParams = new URLSearchParams(window.location.search);
          guideId = urlParams.get('id') || '1';
        }
      }
      
      return originalFetchGuideDetails(guideId);
    };
    
    console.log('fetchGuideDetails関数を安全に拡張しました');
  }
  
  console.log('オブジェクト処理の修正が完了しました');
});

/**
 * ガイドデータのソースを同期する
 * localStorage内の異なる場所に保存されたガイドデータを同期して一致させる
 * @param {string} guideId ガイドID
 */
function synchronizeGuideSources(guideId) {
  if (!guideId) return;
  
  try {
    console.log(`ガイドID=${guideId}のデータソースを同期...`);
    
    // 個別保存されたガイドデータを優先
    const specificGuideKey = `guide_${guideId}`;
    const specificGuideJson = localStorage.getItem(specificGuideKey);
    
    if (specificGuideJson) {
      // 個別データが存在する場合、それをguidesDataリストにも反映
      try {
        const guideData = JSON.parse(specificGuideJson);
        
        // guidesDataリストを取得
        const guidesDataJson = localStorage.getItem('guidesData');
        if (guidesDataJson) {
          let guidesList = JSON.parse(guidesDataJson);
          
          if (Array.isArray(guidesList)) {
            // 対象のガイドデータを更新または追加
            let found = false;
            for (let i = 0; i < guidesList.length; i++) {
              if (guidesList[i].id === guideId) {
                guidesList[i] = { ...guideData };
                found = true;
                console.log(`一覧内のガイドID=${guideId}のデータを更新: ${guideData.name}`);
                break;
              }
            }
            
            if (!found) {
              guidesList.push(guideData);
              console.log(`一覧にガイドID=${guideId}のデータを追加: ${guideData.name}`);
            }
            
            // 更新したリストを保存
            localStorage.setItem('guidesData', JSON.stringify(guidesList));
          }
        }
      } catch (e) {
        console.error('ガイドデータの解析エラー:', e);
      }
    } else {
      // 個別データがない場合、guidesDataから取得して保存
      const guidesDataJson = localStorage.getItem('guidesData');
      if (guidesDataJson) {
        try {
          const guidesList = JSON.parse(guidesDataJson);
          
          if (Array.isArray(guidesList)) {
            const matchedGuide = guidesList.find(g => g.id === guideId);
            
            if (matchedGuide) {
              // 見つかったデータを個別保存
              localStorage.setItem(specificGuideKey, JSON.stringify(matchedGuide));
              console.log(`一覧からガイドID=${guideId}のデータを個別保存: ${matchedGuide.name}`);
            } else {
              console.warn(`ガイドID=${guideId}のデータが一覧にも見つかりません`);
            }
          }
        } catch (e) {
          console.error('guidesDataリストの解析エラー:', e);
        }
      }
    }
  } catch (e) {
    console.error('データソース同期エラー:', e);
  }
}