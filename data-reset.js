/**
 * ガイド詳細ページ用データリセットスクリプト
 * ローカルストレージのガイドデータをクリアして正しいデータを設定する
 */

// DOMの準備ができたら実行
/**
 * data-reset.js
 * このスクリプトはデータのデバッグや追跡を支援します
 * ガイドデータを変更せず、元のデータが正しく表示されていることを確認します
 */
document.addEventListener('DOMContentLoaded', function() {
  // 現在のページを確認
  const isDetailPage = window.location.pathname.includes('guide-details.html');
  
  // ガイド詳細ページの場合、表示されているデータをログに出力
  if (isDetailPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const guideId = urlParams.get('id');
    
    // ガイドIDが指定されている場合
    if (guideId) {
      console.log(`ガイドID=${guideId}のページを表示中`);
      
      // ページのロード完了を待ってからデータ表示を確認
      setTimeout(() => {
        const nameElement = document.getElementById('guide-name');
        const locationElement = document.getElementById('guide-location');
        const bioElement = document.getElementById('guide-bio');
        
        if (nameElement && locationElement) {
          console.log(`表示中のガイド名: ${nameElement.textContent}`);
          console.log(`表示中の地域: ${locationElement.textContent}`);
          
          // 保存されているガイドのデータをチェック
          try {
            const storedData = localStorage.getItem('guide_list_data');
            if (storedData) {
              const guides = JSON.parse(storedData);
              const currentGuide = guides.find(g => g.id === guideId);
              if (currentGuide) {
                console.log('ローカルストレージのガイドデータ:', currentGuide);
                
                // データと表示の一致を確認
                if (currentGuide.name !== nameElement.textContent) {
                  console.warn('警告: ガイド名が一致しません');
                  console.warn(`ストレージ: ${currentGuide.name} vs 表示: ${nameElement.textContent}`);
                }
                
                if (currentGuide.location !== locationElement.textContent) {
                  console.warn('警告: 地域が一致しません');
                  console.warn(`ストレージ: ${currentGuide.location} vs 表示: ${locationElement.textContent}`);
                }
              } else {
                console.log(`ID=${guideId}のガイドデータがローカルストレージに見つかりません`);
              }
            }
          } catch (e) {
            console.error('ガイドデータの取得エラー:', e);
          }
        }
      }, 1000);
    }
  }
});