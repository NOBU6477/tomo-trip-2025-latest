// 日本語版アイコン修正システム - 英語版と同じデザインで常時表示
console.log('日本語版アイコン修正システム - 初期化開始');

class JapaneseIconFix {
    constructor() {
        this.isRunning = false;
        this.maxRetries = 10;
        this.retryCount = 0;
        this.init();
    }

    init() {
        console.log('🇯🇵 日本語版アイコン修正システム開始');
        
        // 英語版と同じスタイルでアイコンを強制表示
        this.forceShowIcons();
        
        // 定期的な監視と修正
        setInterval(() => {
            this.forceShowIcons();
        }, 2000);

        // DOM変更監視
        this.observeAndFix();
        
        // ページ読み込み完了後の追加修正
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.forceShowIcons(), 100);
                setTimeout(() => this.forceShowIcons(), 500);
                setTimeout(() => this.forceShowIcons(), 1000);
            });
        } else {
            setTimeout(() => this.forceShowIcons(), 100);
            setTimeout(() => this.forceShowIcons(), 500);
            setTimeout(() => this.forceShowIcons(), 1000);
        }

        console.log('✅ 日本語版アイコン修正システム初期化完了');
    }

    forceShowIcons() {
        if (this.isRunning) return;
        this.isRunning = true;

        try {
            console.log('🎯 日本語版アイコン強制表示開始');
            
            // 全てのガイドカードを取得
            const guideCards = document.querySelectorAll('.guide-card, .card, .guide-item');
            console.log(`📋 検出されたガイドカード数: ${guideCards.length}`);

            if (guideCards.length === 0) {
                console.warn('⚠️ ガイドカードが見つかりません');
                this.isRunning = false;
                return;
            }

            let processedCards = 0;

            guideCards.forEach((card, index) => {
                try {
                    // ガイドIDを取得
                    let guideId = card.getAttribute('data-guide-id') || 
                                 card.closest('[data-guide-id]')?.getAttribute('data-guide-id') ||
                                 (index + 1);

                    // 既存のアイコンを削除（競合防止）
                    const existingIcons = card.querySelectorAll('.bookmark-btn, .compare-btn, .icon-container-jp');
                    existingIcons.forEach(icon => icon.remove());

                    // 画像要素を検索
                    const imageElement = card.querySelector('.card-img-top, .guide-image, img');
                    if (!imageElement) {
                        console.warn(`⚠️ カード${index + 1}: 画像要素が見つかりません`);
                        return;
                    }

                    // 画像の親要素を取得（position-relativeコンテナ）
                    let imageContainer = imageElement.parentElement;
                    
                    // position-relativeクラスを確保
                    if (!imageContainer.classList.contains('position-relative')) {
                        imageContainer.classList.add('position-relative');
                    }

                    // 英語版と同じスタイルのアイコンコンテナを作成
                    const iconContainer = document.createElement('div');
                    iconContainer.className = 'icon-container-jp position-absolute top-0 start-0 m-2';
                    iconContainer.style.cssText = `
                        z-index: 1000 !important;
                        position: absolute !important;
                        top: 8px !important;
                        left: 8px !important;
                        display: flex !important;
                        gap: 4px !important;
                        pointer-events: auto !important;
                    `;

                    // ブックマークボタン（英語版と同じデザイン）
                    const bookmarkBtn = this.createJapaneseIconButton('bookmark', guideId, {
                        icon: 'bi-star',
                        color: '#ffc107',
                        title: 'このガイドをブックマーク'
                    });

                    // 比較ボタン（英語版と同じデザイン）
                    const compareBtn = this.createJapaneseIconButton('compare', guideId, {
                        icon: 'bi-check-circle',
                        color: '#28a745',
                        title: '比較に追加'
                    });

                    // アイコンをコンテナに追加
                    iconContainer.appendChild(bookmarkBtn);
                    iconContainer.appendChild(compareBtn);

                    // コンテナを画像エリアに追加
                    imageContainer.appendChild(iconContainer);

                    processedCards++;
                    console.log(`✅ カード${index + 1}: 日本語版アイコン追加完了 (ID: ${guideId})`);

                } catch (error) {
                    console.error(`❌ カード${index + 1}のアイコン処理エラー:`, error);
                }
            });

            console.log(`🎉 日本語版アイコン処理完了: ${processedCards}/${guideCards.length}枚`);

        } catch (error) {
            console.error('❌ 日本語版アイコン処理エラー:', error);
        } finally {
            this.isRunning = false;
        }
    }

    createJapaneseIconButton(type, guideId, config) {
        const button = document.createElement('button');
        button.className = `btn btn-sm btn-light ${type}-btn`;
        button.setAttribute('data-guide-id', guideId);
        button.setAttribute('title', config.title);
        
        // 英語版と同じスタイル設定
        button.style.cssText = `
            border-radius: 50% !important;
            width: 35px !important;
            height: 35px !important;
            padding: 0 !important;
            border: 1px solid #dee2e6 !important;
            background-color: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(4px) !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            z-index: 1001 !important;
            pointer-events: auto !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        `;

        // アイコン要素作成
        const icon = document.createElement('i');
        icon.className = `bi ${config.icon}`;
        icon.style.cssText = `
            color: ${config.color} !important;
            font-size: 16px !important;
            line-height: 1 !important;
            pointer-events: none !important;
        `;

        button.appendChild(icon);

        // クリックイベント（英語版と同じ機能）
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🎯 ${type}ボタンクリック - ガイドID: ${guideId}`);
            
            if (type === 'bookmark') {
                this.handleBookmarkClick(button, guideId, icon);
            } else if (type === 'compare') {
                this.handleCompareClick(button, guideId, icon);
            }
        });

        // ホバーエフェクト（英語版と同じ）
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });

        return button;
    }

    handleBookmarkClick(button, guideId, icon) {
        // ブックマーク状態をトグル
        const isBookmarked = icon.classList.contains('bi-star-fill');
        
        if (isBookmarked) {
            // ブックマーク解除
            icon.className = 'bi bi-star';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('ブックマークから削除しました', 'info');
        } else {
            // ブックマーク追加
            icon.className = 'bi bi-star-fill';
            button.style.backgroundColor = 'rgba(255, 243, 205, 0.95)';
            this.showAlert('ブックマークに追加しました！', 'success');
        }
        
        console.log(`📌 ガイド${guideId}: ブックマーク${isBookmarked ? '解除' : '追加'}`);
    }

    handleCompareClick(button, guideId, icon) {
        // 比較状態をトグル
        const isCompared = icon.classList.contains('bi-check-circle-fill');
        
        if (isCompared) {
            // 比較解除
            icon.className = 'bi bi-check-circle';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.showAlert('比較から削除しました', 'info');
        } else {
            // 比較追加
            icon.className = 'bi bi-check-circle-fill';
            button.style.backgroundColor = 'rgba(212, 237, 218, 0.95)';
            this.showAlert('比較に追加しました！', 'success');
        }
        
        console.log(`🔍 ガイド${guideId}: 比較${isCompared ? '解除' : '追加'}`);
    }

    showAlert(message, type = 'info') {
        // 簡単なアラート表示
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : '#0c5460'};
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid ${type === 'success' ? '#28a745' : '#17a2b8'};
        `;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }

    observeAndFix() {
        // 強力なMutationObserver
        const observer = new MutationObserver((mutations) => {
            let shouldFix = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList?.contains('guide-card') || 
                                node.classList?.contains('card') ||
                                node.querySelector?.('.guide-card, .card')) {
                                shouldFix = true;
                            }
                        }
                    });
                }
            });

            if (shouldFix) {
                console.log('🔄 DOM変更検出 - 日本語版アイコン再表示');
                setTimeout(() => this.forceShowIcons(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('👀 日本語版DOM変更監視開始');
    }
}

// 日本語サイトでのみ実行
if (!window.location.pathname.includes('index-en')) {
    console.log('🇯🇵 日本語サイト検出 - アイコン修正システム開始');
    
    // 即座に実行
    new JapaneseIconFix();
    
    // DOMContentLoaded後にも実行
    document.addEventListener('DOMContentLoaded', () => {
        new JapaneseIconFix();
    });
} else {
    console.log('🇺🇸 英語サイト検出 - 日本語版修正システムをスキップ');
}

console.log('📱 日本語版アイコン修正システム読み込み完了');