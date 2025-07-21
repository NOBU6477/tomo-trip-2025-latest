// 日本語版強制アイコン表示システム
console.log('日本語版強制アイコン表示システム開始');

function forceJapaneseIcons() {
    console.log('🎯 日本語版アイコン強制表示開始');
    
    // 全てのガイドカードを検索
    const guideCards = document.querySelectorAll('.guide-card, .card');
    console.log(`📋 検出されたガイドカード: ${guideCards.length}枚`);
    
    if (guideCards.length === 0) {
        console.warn('⚠️ ガイドカードが見つかりません');
        return;
    }
    
    guideCards.forEach((card, index) => {
        try {
            // 既存のアイコンを確認
            const existingIcons = card.querySelector('.bookmark-btn, .compare-btn');
            if (existingIcons) {
                console.log(`✓ カード${index + 1}: アイコン既存`);
                return;
            }
            
            // ガイドIDを取得
            const guideId = index + 1;
            
            // 画像要素を検索
            const img = card.querySelector('.card-img-top, .guide-image, img');
            if (!img) {
                console.warn(`⚠️ カード${index + 1}: 画像が見つかりません`);
                return;
            }
            
            // 画像の親要素
            const imgContainer = img.parentElement;
            if (!imgContainer.classList.contains('position-relative')) {
                imgContainer.classList.add('position-relative');
            }
            
            // アイコンコンテナを作成
            const iconContainer = document.createElement('div');
            iconContainer.className = 'position-absolute top-0 start-0 m-2';
            iconContainer.style.cssText = `
                z-index: 1050 !important;
                display: flex !important;
                gap: 4px !important;
            `;
            
            // ブックマークボタン
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'btn btn-sm btn-light bookmark-btn me-1';
            bookmarkBtn.setAttribute('data-guide-id', guideId);
            bookmarkBtn.setAttribute('title', 'このガイドをブックマーク');
            bookmarkBtn.style.cssText = `
                border-radius: 50% !important;
                width: 35px !important;
                height: 35px !important;
                padding: 0 !important;
                border: 1px solid #dee2e6 !important;
                background-color: rgba(255, 255, 255, 0.9) !important;
                backdrop-filter: blur(4px) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            `;
            
            const bookmarkIcon = document.createElement('i');
            bookmarkIcon.className = 'bi bi-star';
            bookmarkIcon.style.cssText = 'color: #ffc107 !important; font-size: 16px !important;';
            bookmarkBtn.appendChild(bookmarkIcon);
            
            // 比較ボタン
            const compareBtn = document.createElement('button');
            compareBtn.className = 'btn btn-sm btn-light compare-btn';
            compareBtn.setAttribute('data-guide-id', guideId);
            compareBtn.setAttribute('title', '比較に追加');
            compareBtn.style.cssText = `
                border-radius: 50% !important;
                width: 35px !important;
                height: 35px !important;
                padding: 0 !important;
                border: 1px solid #dee2e6 !important;
                background-color: rgba(255, 255, 255, 0.9) !important;
                backdrop-filter: blur(4px) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            `;
            
            const compareIcon = document.createElement('i');
            compareIcon.className = 'bi bi-check-circle';
            compareIcon.style.cssText = 'color: #28a745 !important; font-size: 16px !important;';
            compareBtn.appendChild(compareIcon);
            
            // コンテナに追加
            iconContainer.appendChild(bookmarkBtn);
            iconContainer.appendChild(compareBtn);
            imgContainer.appendChild(iconContainer);
            
            console.log(`✅ カード${index + 1}: アイコン追加完了`);
            
        } catch (error) {
            console.error(`❌ カード${index + 1}: エラー`, error);
        }
    });
    
    console.log('🎉 日本語版アイコン表示完了');
}

// 即座に実行
forceJapaneseIcons();

// DOMContentLoaded後に実行
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(forceJapaneseIcons, 100);
    setTimeout(forceJapaneseIcons, 500);
    setTimeout(forceJapaneseIcons, 1000);
});

// 定期的に実行
setInterval(forceJapaneseIcons, 3000);

// ガイド表示イベントに応答
document.addEventListener('guidesDisplayed', () => {
    setTimeout(forceJapaneseIcons, 200);
});

console.log('📱 日本語版強制アイコンシステム読み込み完了');