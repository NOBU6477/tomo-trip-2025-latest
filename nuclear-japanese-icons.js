// 日本語版アイコン核レベル強制表示システム
console.log('🇯🇵 核レベル日本語アイコン強制表示開始');

function nuclearForceJapaneseIcons() {
    console.log('🎯 核レベルアイコン強制表示実行');
    
    // 全てのガイドカードを強制検索
    const selectors = [
        '.guide-card',
        '.card',
        '[class*="card"]',
        '[class*="guide"]',
        '.col-md-4',
        '.col-lg-4',
        '.col-6'
    ];
    
    let allCards = [];
    selectors.forEach(selector => {
        const cards = document.querySelectorAll(selector);
        cards.forEach(card => {
            if (card.querySelector('img') && !allCards.includes(card)) {
                allCards.push(card);
            }
        });
    });
    
    console.log(`📋 検出されたカード: ${allCards.length}枚`);
    
    if (allCards.length === 0) {
        console.warn('⚠️ ガイドカードが見つかりません');
        return;
    }
    
    allCards.forEach((card, index) => {
        try {
            // 既存のアイコンを完全削除
            const existingIcons = card.querySelectorAll('.bookmark-btn, .compare-btn, .icon-container-jp, .position-absolute .btn');
            existingIcons.forEach(icon => {
                if (icon.querySelector('.bi-star') || icon.querySelector('.bi-check-circle')) {
                    icon.remove();
                }
            });
            
            const guideId = index + 1;
            
            // 画像要素を検索
            const img = card.querySelector('img, .card-img-top, .guide-image');
            if (!img) {
                console.warn(`⚠️ カード${index + 1}: 画像が見つかりません`);
                return;
            }
            
            // 画像の親要素を取得
            let imgContainer = img.parentElement;
            
            // position-relativeを強制追加
            imgContainer.style.position = 'relative';
            imgContainer.classList.add('position-relative');
            
            // 新しいアイコンコンテナ作成
            const iconContainer = document.createElement('div');
            iconContainer.className = 'japanese-icon-container position-absolute top-0 start-0 m-2';
            iconContainer.style.cssText = `
                position: absolute !important;
                top: 8px !important;
                left: 8px !important;
                z-index: 2000 !important;
                display: flex !important;
                gap: 4px !important;
                pointer-events: auto !important;
            `;
            
            // ブックマークボタン作成
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'btn btn-sm btn-light bookmark-btn';
            bookmarkBtn.setAttribute('data-guide-id', guideId);
            bookmarkBtn.setAttribute('title', 'このガイドをブックマーク');
            bookmarkBtn.style.cssText = `
                border-radius: 50% !important;
                width: 35px !important;
                height: 35px !important;
                padding: 0 !important;
                margin-right: 4px !important;
                border: 1px solid #dee2e6 !important;
                background-color: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(4px) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            `;
            
            const bookmarkIcon = document.createElement('i');
            bookmarkIcon.className = 'bi bi-star';
            bookmarkIcon.style.cssText = `
                color: #ffc107 !important;
                font-size: 16px !important;
                line-height: 1 !important;
            `;
            bookmarkBtn.appendChild(bookmarkIcon);
            
            // 比較ボタン作成
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
                background-color: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(4px) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            `;
            
            const compareIcon = document.createElement('i');
            compareIcon.className = 'bi bi-check-circle';
            compareIcon.style.cssText = `
                color: #28a745 !important;
                font-size: 16px !important;
                line-height: 1 !important;
            `;
            compareBtn.appendChild(compareIcon);
            
            // コンテナに追加
            iconContainer.appendChild(bookmarkBtn);
            iconContainer.appendChild(compareBtn);
            
            // 画像コンテナに追加
            imgContainer.appendChild(iconContainer);
            
            console.log(`✅ カード${index + 1}: 核レベルアイコン追加完了`);
            
        } catch (error) {
            console.error(`❌ カード${index + 1}: エラー`, error);
        }
    });
    
    console.log('🎉 核レベル日本語アイコン表示完了');
}

// 複数の方法で強制実行
nuclearForceJapaneseIcons();

// DOMContentLoaded後
document.addEventListener('DOMContentLoaded', () => {
    nuclearForceJapaneseIcons();
    setTimeout(nuclearForceJapaneseIcons, 500);
    setTimeout(nuclearForceJapaneseIcons, 1000);
    setTimeout(nuclearForceJapaneseIcons, 2000);
});

// 即座に実行
setTimeout(nuclearForceJapaneseIcons, 100);
setTimeout(nuclearForceJapaneseIcons, 500);
setTimeout(nuclearForceJapaneseIcons, 1000);
setTimeout(nuclearForceJapaneseIcons, 2000);

// 定期実行
setInterval(nuclearForceJapaneseIcons, 5000);

// ガイド表示イベント
document.addEventListener('guidesDisplayed', () => {
    setTimeout(nuclearForceJapaneseIcons, 200);
});

// DOM変更監視
const observer = new MutationObserver(() => {
    setTimeout(nuclearForceJapaneseIcons, 100);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('📱 核レベル日本語アイコンシステム読み込み完了');