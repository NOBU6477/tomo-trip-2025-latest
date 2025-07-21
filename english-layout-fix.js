// 英語版レイアウト修正システム - サイズと表示の統一
console.log('🎨 英語版レイアウト修正システム開始');

class EnglishLayoutFix {
    constructor() {
        this.init();
    }
    
    init() {
        // 英語版でのみ実行
        if (window.location.pathname.includes('index-en.html') || 
            document.documentElement.lang === 'en' ||
            document.title.includes('English')) {
            
            this.fixModalSizes();
            this.fixFloatingToolbar();
            this.fixPagePagination();
            this.fixResponsiveLayout();
            
            // DOM変更を監視して継続的に修正
            this.setupContinuousMonitoring();
        }
    }
    
    fixModalSizes() {
        // モーダルサイズを日本語版と統一
        const style = document.createElement('style');
        style.textContent = `
            /* 英語版モーダル統一スタイル */
            .modal-dialog.modal-lg {
                max-width: 900px !important;
                width: 90% !important;
            }
            
            .modal-content {
                border-radius: 15px !important;
                border: none !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
            }
            
            .modal-header {
                padding: 20px 25px !important;
                border-bottom: 1px solid #e9ecef !important;
                border-radius: 15px 15px 0 0 !important;
            }
            
            .modal-body {
                padding: 25px !important;
                max-height: 60vh !important;
                overflow-y: auto !important;
            }
            
            .modal-footer {
                padding: 15px 25px !important;
                border-top: 1px solid #e9ecef !important;
                border-radius: 0 0 15px 15px !important;
            }
            
            /* ガイド管理項目のスタイル統一 */
            .guide-management-item {
                border-radius: 8px !important;
                margin-bottom: 8px !important;
                transition: all 0.2s ease !important;
            }
            
            .guide-management-item:hover {
                background-color: #f8f9fa !important;
            }
            
            .guide-management-item img {
                border: 2px solid #e9ecef !important;
                transition: border-color 0.2s ease !important;
            }
            
            .guide-management-item:hover img {
                border-color: #007bff !important;
            }
            
            /* ボタンスタイル統一 */
            .modal-footer .btn {
                border-radius: 25px !important;
                padding: 8px 20px !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
            }
            
            .remove-guide-btn {
                border-radius: 20px !important;
                padding: 4px 12px !important;
                font-size: 12px !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 英語版モーダルサイズを修正');
    }
    
    fixFloatingToolbar() {
        // フローティングツールバーのサイズと位置を調整
        const toolbarStyle = document.createElement('style');
        toolbarStyle.textContent = `
            /* 英語版フローティングツールバー修正 */
            .floating-toolbar {
                position: fixed !important;
                bottom: 20px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                border-radius: 50px !important;
                padding: 8px 16px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                z-index: 1030 !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                max-width: 90vw !important;
                overflow-x: auto !important;
            }
            
            .floating-toolbar .btn {
                border-radius: 25px !important;
                padding: 6px 14px !important;
                font-size: 13px !important;
                white-space: nowrap !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                transition: all 0.2s ease !important;
            }
            
            .floating-toolbar .btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            }
            
            /* レスポンシブ調整 */
            @media (max-width: 768px) {
                .floating-toolbar {
                    bottom: 15px !important;
                    padding: 6px 12px !important;
                    gap: 8px !important;
                }
                
                .floating-toolbar .btn {
                    padding: 4px 10px !important;
                    font-size: 12px !important;
                }
            }
        `;
        
        document.head.appendChild(toolbarStyle);
        console.log('✅ 英語版フローティングツールバーを修正');
    }
    
    fixPagePagination() {
        // ページ遷移表示の修正
        const paginationStyle = document.createElement('style');
        paginationStyle.textContent = `
            /* 英語版ページネーション修正 */
            .pagination-preview {
                background: linear-gradient(135deg, #28a745, #20c997) !important;
                border-radius: 15px !important;
                padding: 15px !important;
                margin: 15px 0 !important;
                color: white !important;
                text-align: center !important;
                font-weight: 500 !important;
            }
            
            .pagination-preview h5 {
                margin: 0 0 10px 0 !important;
                font-size: 16px !important;
                font-weight: 600 !important;
            }
            
            .guide-preview-grid {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
                margin-top: 15px !important;
            }
            
            .guide-preview-item {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 10px !important;
                padding: 10px !important;
                text-align: center !important;
                backdrop-filter: blur(5px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .guide-preview-item img {
                width: 50px !important;
                height: 50px !important;
                border-radius: 50% !important;
                border: 2px solid rgba(255, 255, 255, 0.3) !important;
                margin-bottom: 8px !important;
            }
            
            .guide-preview-item h6 {
                font-size: 12px !important;
                margin: 0 !important;
                color: white !important;
                font-weight: 500 !important;
            }
            
            .pagination-navigation {
                background: linear-gradient(135deg, #17a2b8, #007bff) !important;
                border-radius: 15px !important;
                padding: 12px !important;
                text-align: center !important;
                margin-top: 15px !important;
            }
            
            .pagination-navigation .btn {
                border-radius: 25px !important;
                padding: 8px 20px !important;
                font-weight: 500 !important;
                border: 2px solid rgba(255, 255, 255, 0.3) !important;
                color: white !important;
                background: rgba(255, 255, 255, 0.1) !important;
                margin: 0 5px !important;
            }
            
            .pagination-navigation .btn:hover {
                background: rgba(255, 255, 255, 0.2) !important;
                border-color: rgba(255, 255, 255, 0.5) !important;
                transform: translateY(-2px) !important;
            }
        `;
        
        document.head.appendChild(paginationStyle);
        console.log('✅ 英語版ページネーション表示を修正');
    }
    
    fixResponsiveLayout() {
        // レスポンシブレイアウトの修正
        const responsiveStyle = document.createElement('style');
        responsiveStyle.textContent = `
            /* 英語版レスポンシブ修正 */
            @media (max-width: 992px) {
                .modal-dialog.modal-lg {
                    max-width: 95% !important;
                    margin: 10px auto !important;
                }
                
                .guide-preview-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 10px !important;
                }
                
                .guide-management-item {
                    flex-direction: column !important;
                    align-items: center !important;
                    text-align: center !important;
                    padding: 15px !important;
                }
                
                .guide-management-item .d-flex {
                    flex-direction: column !important;
                    align-items: center !important;
                    width: 100% !important;
                }
                
                .remove-guide-btn {
                    margin-top: 10px !important;
                    width: 120px !important;
                }
            }
            
            @media (max-width: 576px) {
                .modal-dialog.modal-lg {
                    max-width: 98% !important;
                    margin: 5px auto !important;
                }
                
                .guide-preview-grid {
                    grid-template-columns: 1fr !important;
                }
                
                .modal-header {
                    padding: 15px 20px !important;
                }
                
                .modal-body {
                    padding: 20px !important;
                }
                
                .modal-footer {
                    padding: 12px 20px !important;
                    flex-direction: column !important;
                    gap: 8px !important;
                }
                
                .modal-footer .btn {
                    width: 100% !important;
                    margin: 0 !important;
                }
            }
        `;
        
        document.head.appendChild(responsiveStyle);
        console.log('✅ 英語版レスポンシブレイアウトを修正');
    }
    
    setupContinuousMonitoring() {
        // DOM変更を監視して継続的に修正を適用
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 新しいモーダルが追加された場合
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            (node.classList?.contains('modal') || node.querySelector?.('.modal'))) {
                            this.adjustNewModal(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ 継続的なレイアウト監視を開始');
    }
    
    adjustNewModal(modalElement) {
        // 新しく追加されたモーダルの調整
        setTimeout(() => {
            const modal = modalElement.classList?.contains('modal') ? 
                         modalElement : modalElement.querySelector('.modal');
            
            if (modal) {
                // モーダルサイズ調整
                const dialog = modal.querySelector('.modal-dialog');
                if (dialog) {
                    dialog.style.maxWidth = '900px';
                    dialog.style.width = '90%';
                }
                
                // コンテンツ調整
                const content = modal.querySelector('.modal-content');
                if (content) {
                    content.style.borderRadius = '15px';
                    content.style.border = 'none';
                    content.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }
                
                console.log('🔧 新しいモーダルのレイアウトを調整');
            }
        }, 100);
    }
}

// 英語版でのみ実行
if (window.location.pathname.includes('index-en.html') || 
    document.documentElement.lang === 'en' ||
    document.querySelector('html[lang="en"]')) {
    
    window.englishLayoutFix = new EnglishLayoutFix();
    console.log('✅ English Layout Fix Loaded - 英語版のレイアウトを日本語版と統一');
} else {
    console.log('ℹ️ English Layout Fix - 日本語版では無効');
}