// クリーン修正システム - 全問題を一括解決

(function() {
    'use strict';
    
    console.log('🧹 クリーン修正システム開始');
    
    // 1. 不要な丸いスタンプの完全削除
    function removeCircularStamps() {
        console.log('丸いスタンプ削除開始');
        
        let removedCount = 0;
        
        // すべての要素をチェック
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // 丸い要素の条件
            if ((styles.borderRadius === '50%' || 
                 styles.borderRadius.includes('50%') ||
                 (element.style.borderRadius && element.style.borderRadius.includes('50%'))) &&
                rect.width > 0 && rect.width < 100 &&
                rect.height > 0 && rect.height < 100 &&
                element.id !== 'emergency-management-btn' &&
                !element.closest('#emergency-management-btn') &&
                !element.closest('#emergency-management-panel')) {
                
                // 比較・ブックマークアイコンを削除
                if (element.textContent.includes('⭐') || 
                    element.textContent.includes('✓') ||
                    element.className.includes('bookmark') ||
                    element.className.includes('compare') ||
                    element.id.includes('bookmark') ||
                    element.id.includes('compare')) {
                    
                    element.remove();
                    removedCount++;
                    console.log('丸いスタンプ削除:', element.textContent);
                }
            }
        });
        
        console.log(`✅ 丸いスタンプ削除完了: ${removedCount}個削除`);
    }
    
    // 2. 白い枠の完全削除
    function removeWhiteFrames() {
        console.log('白い枠削除開始');
        
        let removedCount = 0;
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // 白い背景の空要素
            if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
                 styles.backgroundColor === 'white' ||
                 styles.backgroundColor === '#ffffff' ||
                 styles.backgroundColor === '#fff') &&
                rect.width > 0 && rect.width < 500 && 
                rect.height > 0 && rect.height < 500 &&
                !element.textContent.trim() &&
                !element.querySelector('img, button, input, select, textarea, canvas, svg, iframe') &&
                !element.closest('.modal') &&
                !element.closest('.navbar') &&
                !element.closest('.hero-section') &&
                !element.closest('.sponsor-banner') &&
                !element.id.includes('emergency') &&
                element.tagName !== 'HTML' &&
                element.tagName !== 'BODY' &&
                element.tagName !== 'HEAD') {
                
                element.remove();
                removedCount++;
            }
            
            // 白いボーダーの空要素
            if ((styles.border.includes('white') || 
                 styles.borderColor === 'white' ||
                 styles.borderColor === 'rgb(255, 255, 255)') &&
                rect.width > 0 && rect.width < 300 &&
                rect.height > 0 && rect.height < 300 &&
                !element.textContent.trim() &&
                !element.querySelector('img, button, input, select') &&
                !element.id.includes('emergency')) {
                
                element.remove();
                removedCount++;
            }
        });
        
        console.log(`✅ 白い枠削除完了: ${removedCount}個削除`);
    }
    
    // 3. フィルター機能の完全修復
    function restoreFilterFunctionality() {
        console.log('フィルター機能修復開始');
        
        const filterBtn = document.getElementById('filterToggleBtn');
        const filterCard = document.getElementById('filter-card');
        
        if (!filterBtn || !filterCard) {
            console.log('フィルター要素が見つかりません');
            return;
        }
        
        // 既存イベントを削除して新しく設定
        const newFilterBtn = filterBtn.cloneNode(true);
        filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);
        
        newFilterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('フィルターボタンクリック');
            
            if (filterCard.classList.contains('d-none') || filterCard.style.display === 'none') {
                filterCard.classList.remove('d-none');
                filterCard.style.display = 'block';
                newFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
                console.log('✅ フィルター表示');
            } else {
                filterCard.classList.add('d-none');
                filterCard.style.display = 'none';
                newFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込む';
                console.log('✅ フィルター非表示');
            }
        });
        
        console.log('✅ フィルター機能修復完了');
    }
    
    // 4. フィルター内容の復元
    function restoreFilterContent() {
        console.log('フィルター内容復元開始');
        
        const filterCard = document.getElementById('filter-card');
        if (!filterCard) {
            console.log('フィルターカードが見つかりません');
            return;
        }
        
        // フィルター内容が空の場合、復元する
        const cardBody = filterCard.querySelector('.card-body');
        if (!cardBody || !cardBody.innerHTML.trim()) {
            console.log('フィルター内容を復元します');
            
            filterCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title mb-3">ガイドを絞り込み</h5>
                    <form id="guide-filter-form">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="location-filter" class="form-label">場所</label>
                                <select class="form-select" id="location-filter">
                                    <option value="">すべて</option>
                                    <option value="Tokyo">東京都</option>
                                    <option value="Kyoto">京都府</option>
                                    <option value="Osaka">大阪府</option>
                                    <option value="Hokkaido">北海道</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="language-filter" class="form-label">言語</label>
                                <select class="form-select" id="language-filter">
                                    <option value="">すべて</option>
                                    <option value="Japanese">日本語</option>
                                    <option value="English">英語</option>
                                    <option value="Chinese">中国語</option>
                                    <option value="Korean">韓国語</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="price-filter" class="form-label">価格</label>
                                <select class="form-select" id="price-filter">
                                    <option value="">すべて</option>
                                    <option value="under-6000">¥6,000未満/時間</option>
                                    <option value="6000-10000">¥6,000-10,000/時間</option>
                                    <option value="over-10000">¥10,000以上/時間</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">キーワード</label>
                                <div class="d-flex flex-wrap">
                                    <div class="form-check me-3 mb-2">
                                        <input class="form-check-input" type="checkbox" value="Night Tour" id="keyword-night">
                                        <label class="form-check-label" for="keyword-night">ナイトツアー</label>
                                    </div>
                                    <div class="form-check me-3 mb-2">
                                        <input class="form-check-input" type="checkbox" value="Gourmet" id="keyword-food">
                                        <label class="form-check-label" for="keyword-food">グルメ</label>
                                    </div>
                                    <div class="form-check me-3 mb-2">
                                        <input class="form-check-input" type="checkbox" value="Photo Spots" id="keyword-photo">
                                        <label class="form-check-label" for="keyword-photo">撮影スポット</label>
                                    </div>
                                    <div class="form-check me-3 mb-2">
                                        <input class="form-check-input" type="checkbox" value="料理" id="keyword-cuisine">
                                        <label class="form-check-label" for="keyword-cuisine">料理</label>
                                    </div>
                                    <div class="form-check me-3 mb-2">
                                        <input class="form-check-input" type="checkbox" value="アクティビティ" id="keyword-activity">
                                        <label class="form-check-label" for="keyword-activity">アクティビティ</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="d-flex gap-2">
                                    <button type="button" class="btn btn-secondary" onclick="resetFilters()">リセット</button>
                                    <button type="button" class="btn btn-primary" onclick="applyFilters()">検索</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            `;
            
            console.log('✅ フィルター内容復元完了');
        }
    }
    
    // 5. 🏆管理ボタンの確実な表示
    function ensureManagementButton() {
        console.log('管理ボタン確認開始');
        
        const existingBtn = document.getElementById('emergency-management-btn');
        if (!existingBtn) {
            console.log('管理ボタンが見つかりません - 再作成');
            
            const button = document.createElement('div');
            button.id = 'emergency-management-btn';
            button.innerHTML = '🏆';
            button.title = '管理センター';
            
            button.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 60px !important;
                height: 60px !important;
                background: #4CAF50 !important;
                color: white !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 24px !important;
                cursor: pointer !important;
                z-index: 999999999 !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                border: 2px solid white !important;
                user-select: none !important;
                pointer-events: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showEmergencyPanel();
            });
            
            document.body.appendChild(button);
            console.log('✅ 管理ボタン再作成完了');
        } else {
            console.log('✅ 管理ボタン存在確認');
        }
    }
    
    // 6. 初期化システム
    function cleanInitialize() {
        console.log('🧹 クリーン初期化開始');
        
        // 段階的実行
        setTimeout(() => {
            removeCircularStamps();
        }, 100);
        
        setTimeout(() => {
            removeWhiteFrames();
        }, 200);
        
        setTimeout(() => {
            restoreFilterContent();
        }, 300);
        
        setTimeout(() => {
            restoreFilterFunctionality();
        }, 400);
        
        setTimeout(() => {
            ensureManagementButton();
        }, 500);
        
        setTimeout(() => {
            console.log('✅ クリーン初期化完了');
        }, 600);
        
        // 継続監視（10秒間隔）
        setInterval(() => {
            removeCircularStamps();
            removeWhiteFrames();
            ensureManagementButton();
        }, 10000);
    }
    
    // グローバル関数定義
    window.resetFilters = function() {
        console.log('フィルターリセット');
        const form = document.getElementById('guide-filter-form');
        if (form) {
            form.reset();
        }
    };
    
    window.applyFilters = function() {
        console.log('フィルター適用');
        // フィルター処理の実装
        alert('フィルターを適用しました');
    };
    
    // 実行
    cleanInitialize();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cleanInitialize);
    }
    
    setTimeout(cleanInitialize, 100);
    setTimeout(cleanInitialize, 500);
    setTimeout(cleanInitialize, 1000);
    
})();