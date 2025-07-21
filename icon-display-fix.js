// アイコン表示修正システム - ブックマークとチェックマークの強制表示
console.log('アイコン表示修正システム - 初期化開始');

class IconDisplayFix {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔧 アイコン表示修正システム開始');
        
        // 即座に実行
        this.forceDisplayIcons();
        
        // DOMContentLoaded後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.forceDisplayIcons(), 500);
                setTimeout(() => this.forceDisplayIcons(), 1000);
                setTimeout(() => this.forceDisplayIcons(), 2000);
            });
        } else {
            setTimeout(() => this.forceDisplayIcons(), 500);
            setTimeout(() => this.forceDisplayIcons(), 1000);
            setTimeout(() => this.forceDisplayIcons(), 2000);
        }

        // ガイド表示イベントに応答
        document.addEventListener('guidesDisplayed', () => {
            setTimeout(() => this.forceDisplayIcons(), 100);
        });

        // DOM変更監視
        this.observeDOM();
        
        console.log('✅ アイコン表示修正システム初期化完了');
    }

    forceDisplayIcons() {
        console.log('🎯 アイコン強制表示開始');
        
        // 全てのガイドカードを検索
        const guideCards = document.querySelectorAll('.guide-card, .card');
        console.log(`📋 検出されたガイドカード数: ${guideCards.length}`);

        if (guideCards.length === 0) {
            console.warn('⚠️ ガイドカードが見つかりません');
            return;
        }

        let addedIcons = 0;

        guideCards.forEach((card, index) => {
            try {
                // 既にアイコンが存在するかチェック
                const existingIcons = card.querySelector('.bookmark-btn, .compare-btn');
                if (existingIcons) {
                    console.log(`✓ カード${index + 1}: アイコン既存`);
                    return;
                }

                // ガイドIDを取得または生成
                let guideId = card.getAttribute('data-guide-id') || 
                             card.closest('[data-guide-id]')?.getAttribute('data-guide-id') ||
                             (index + 1);

                // 画像コンテナを検索
                const imageContainer = card.querySelector('.position-relative') || 
                                      card.querySelector('.card-img-top')?.parentElement ||
                                      card.querySelector('img')?.parentElement;

                if (!imageContainer) {
                    console.warn(`⚠️ カード${index + 1}: 画像コンテナが見つかりません`);
                    return;
                }

                // アイコンコンテナを作成
                const iconContainer = document.createElement('div');
                iconContainer.className = 'position-absolute top-0 start-0 m-2';
                iconContainer.style.zIndex = '10';

                // ブックマークボタン作成
                const bookmarkBtn = this.createIconButton('bookmark', guideId, {
                    icon: 'bi-star',
                    color: '#ffc107',
                    title: 'このガイドをブックマーク'
                });

                // 比較ボタン作成
                const compareBtn = this.createIconButton('compare', guideId, {
                    icon: 'bi-check-circle',
                    color: '#28a745',
                    title: '比較に追加'
                });

                // アイコンをコンテナに追加
                iconContainer.appendChild(bookmarkBtn);
                iconContainer.appendChild(compareBtn);

                // position-relativeクラスを確保
                if (!imageContainer.classList.contains('position-relative')) {
                    imageContainer.classList.add('position-relative');
                }

                // アイコンコンテナを画像コンテナに追加
                imageContainer.appendChild(iconContainer);

                addedIcons++;
                console.log(`✅ カード${index + 1}: アイコン追加完了 (ID: ${guideId})`);

            } catch (error) {
                console.error(`❌ カード${index + 1}のアイコン追加エラー:`, error);
            }
        });

        console.log(`🎉 アイコン追加完了: ${addedIcons}/${guideCards.length}枚のカードに追加`);
        
        // イベント通知
        document.dispatchEvent(new CustomEvent('iconsDisplayed', {
            detail: { addedIcons, totalCards: guideCards.length }
        }));
    }

    createIconButton(type, guideId, config) {
        const button = document.createElement('button');
        button.className = `btn btn-sm btn-light ${type}-btn ${type === 'bookmark' ? 'me-1' : ''}`;
        button.setAttribute('data-guide-id', guideId);
        button.setAttribute('title', config.title);
        button.style.cssText = `
            border-radius: 50%; 
            width: 35px; 
            height: 35px; 
            padding: 0;
            border: 1px solid #dee2e6;
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            transition: all 0.2s ease;
            cursor: pointer;
        `;

        const icon = document.createElement('i');
        icon.className = `bi ${config.icon}`;
        icon.style.color = config.color;
        icon.style.fontSize = '16px';

        button.appendChild(icon);

        // ホバーエフェクト
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        });

        return button;
    }

    observeDOM() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // ガイドカードが追加された場合
                            if (node.classList?.contains('guide-card') || 
                                node.classList?.contains('card') ||
                                node.querySelector?.('.guide-card, .card')) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck) {
                console.log('🔄 DOM変更検出 - アイコン再表示');
                setTimeout(() => this.forceDisplayIcons(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('👀 DOM変更監視開始');
    }
}

// Bootstrap Iconsの読み込み確認
function checkBootstrapIcons() {
    const iconTest = document.createElement('i');
    iconTest.className = 'bi bi-star';
    iconTest.style.position = 'absolute';
    iconTest.style.left = '-9999px';
    document.body.appendChild(iconTest);

    const computed = window.getComputedStyle(iconTest);
    const hasIcons = computed.fontFamily.includes('bootstrap-icons') || 
                     computed.content !== 'none' ||
                     iconTest.offsetWidth > 0;

    document.body.removeChild(iconTest);

    if (!hasIcons) {
        console.warn('⚠️ Bootstrap Icons が正しく読み込まれていない可能性があります');
        
        // CDNから強制読み込み
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
        document.head.appendChild(link);
        
        console.log('🔄 Bootstrap Icons をCDNから強制読み込みしました');
    } else {
        console.log('✅ Bootstrap Icons 読み込み確認完了');
    }

    return hasIcons;
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    checkBootstrapIcons();
    new IconDisplayFix();
});

// 即座に実行
if (document.readyState !== 'loading') {
    checkBootstrapIcons();
    new IconDisplayFix();
}

console.log('📱 アイコン表示修正システム読み込み完了');