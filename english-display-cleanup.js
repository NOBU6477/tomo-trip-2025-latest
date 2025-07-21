// 英語版表示重複修復システム
console.log('🇺🇸 英語版表示重複修復開始');

class EnglishDisplayCleanup {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🔧 英語版表示クリーンアップ初期化');
        
        // DOMContentLoaded後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.cleanup());
        } else {
            this.cleanup();
        }
        
        // 定期的にクリーンアップ
        setInterval(() => this.cleanup(), 5000);
    }
    
    cleanup() {
        console.log('🧹 英語版表示クリーンアップ実行');
        
        // 重複モーダルを削除
        this.removeDuplicateModals();
        
        // 重複フローティングツールバーを削除
        this.removeDuplicateToolbars();
        
        // 重複アイコンコンテナを削除
        this.removeDuplicateIcons();
        
        // Z-index競合を修正
        this.fixZIndexConflicts();
        
        // 英語版デザインを日本語版に統一
        this.unifyDesignWithJapanese();
    }
    
    removeDuplicateModals() {
        // 同じIDや機能の重複モーダルを削除
        const modalSelectors = [
            '.modal[id*="management"]',
            '.modal[id*="bookmark"]',
            '.modal[id*="comparison"]'
        ];
        
        modalSelectors.forEach(selector => {
            const modals = document.querySelectorAll(selector);
            if (modals.length > 1) {
                console.log(`🗑️ 重複モーダル削除: ${selector} (${modals.length}個)`);
                // 最初以外を削除
                for (let i = 1; i < modals.length; i++) {
                    modals[i].remove();
                }
            }
        });
        
        // 孤立したモーダル背景を削除
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length > 1) {
            for (let i = 1; i < backdrops.length; i++) {
                backdrops[i].remove();
            }
        }
    }
    
    removeDuplicateToolbars() {
        const toolbars = document.querySelectorAll('.floating-toolbar, [class*="toolbar"]');
        if (toolbars.length > 1) {
            console.log(`🗑️ 重複ツールバー削除: ${toolbars.length}個`);
            // 最新のもの以外を削除
            for (let i = 0; i < toolbars.length - 1; i++) {
                toolbars[i].remove();
            }
        }
    }
    
    removeDuplicateIcons() {
        // 同じガイドカードに複数のアイコンコンテナがある場合
        const guideCards = document.querySelectorAll('.guide-card, .card');
        
        guideCards.forEach(card => {
            const iconContainers = card.querySelectorAll('[class*="icon-container"]');
            if (iconContainers.length > 1) {
                console.log('🗑️ 重複アイコンコンテナ削除');
                // 最初以外を削除
                for (let i = 1; i < iconContainers.length; i++) {
                    iconContainers[i].remove();
                }
            }
        });
    }
    
    fixZIndexConflicts() {
        // Z-index階層の修正
        const elements = {
            '.floating-toolbar': '1040',
            '.modal': '1055',
            '.modal-backdrop': '1050',
            '.dropdown-menu': '1000',
            '.btn': '1',
            '.alert': '1060'
        };
        
        Object.entries(elements).forEach(([selector, zIndex]) => {
            const elems = document.querySelectorAll(selector);
            elems.forEach(elem => {
                elem.style.zIndex = zIndex;
            });
        });
    }
    
    unifyDesignWithJapanese() {
        // フローティングツールバーのデザイン統一
        const toolbar = document.querySelector('.floating-toolbar');
        if (toolbar) {
            toolbar.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                border-radius: 25px !important;
                padding: 10px 20px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                display: flex !important;
                align-items: center !important;
                gap: 15px !important;
                z-index: 1040 !important;
                font-size: 14px !important;
                white-space: nowrap !important;
            `;
            
            // ボタンスタイル統一
            const buttons = toolbar.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.style.cssText = `
                    border-radius: 20px !important;
                    padding: 8px 16px !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    border: 1px solid rgba(0,0,0,0.1) !important;
                    transition: all 0.2s ease !important;
                `;
                
                // ホバーエフェクト
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = 'none';
                });
            });
        }
        
        // ページジャンプセレクトのスタイル統一
        const pageJump = document.querySelector('.floating-toolbar select');
        if (pageJump) {
            pageJump.style.cssText = `
                border-radius: 20px !important;
                padding: 6px 12px !important;
                font-size: 13px !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                background: white !important;
            `;
        }
    }
    
    // 強制クリーンアップ関数（デバッグ用）
    forceCleanup() {
        console.log('🚨 強制クリーンアップ実行');
        
        // 全てのモーダル関連要素を削除
        const modalsToRemove = document.querySelectorAll('.modal, .modal-backdrop');
        modalsToRemove.forEach(modal => modal.remove());
        
        // body クラスをクリーンアップ
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // 重複要素を全て削除
        this.cleanup();
        
        console.log('✅ 強制クリーンアップ完了');
    }
}

// 英語版でのみ実行
if (window.location.pathname.includes('index-en') || window.location.pathname.endsWith('index-en.html')) {
    const cleanup = new EnglishDisplayCleanup();
    
    // グローバル関数として公開（デバッグ用）
    window.englishDisplayCleanup = cleanup;
    window.forceEnglishCleanup = () => cleanup.forceCleanup();
    
    console.log('✅ English Display Cleanup System Loaded');
    console.log('💡 Debug: コンソールでforceEnglishCleanup()を実行できます');
}