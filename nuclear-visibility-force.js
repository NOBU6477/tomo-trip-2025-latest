// 核レベル可視化強制システム
console.log('💥 核レベル可視化強制開始');

(function nuclearVisibilityForce() {
    console.log('💥 即座実行開始');
    
    // 即座にパネル作成
    createNuclearPanel();
    
    // 0.5秒ごとに強制チェック
    const nuclearInterval = setInterval(createNuclearPanel, 500);
    
    // 30秒後に間隔を延ばす
    setTimeout(() => {
        clearInterval(nuclearInterval);
        setInterval(createNuclearPanel, 5000);
        console.log('💥 核レベル監視を5秒間隔に変更');
    }, 30000);
    
    function createNuclearPanel() {
        // 既存パネルチェック
        const existing = document.getElementById('nuclear-panel');
        if (existing && existing.style.display !== 'none') {
            return; // 既に表示中
        }
        
        if (existing) {
            existing.remove();
        }
        
        console.log('💥 核パネル強制作成');
        
        // パネル作成
        const panel = document.createElement('div');
        panel.id = 'nuclear-panel';
        
        // 核レベルスタイル強制適用
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '2147483647'; // 最大z-index
        panel.style.background = '#dc3545';
        panel.style.color = 'white';
        panel.style.padding = '25px';
        panel.style.borderRadius = '20px';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.fontWeight = 'bold';
        panel.style.maxWidth = '400px';
        panel.style.border = '5px solid #fff';
        panel.style.boxShadow = '0 0 50px rgba(220, 53, 69, 0.8)';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.display = 'block';
        panel.style.pointerEvents = 'auto';
        panel.style.transform = 'scale(1)';
        panel.style.animation = 'none';
        panel.style.width = 'auto';
        panel.style.height = 'auto';
        panel.style.overflow = 'visible';
        
        // CSS属性を強制固定
        panel.setAttribute('style', `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            background: #dc3545 !important;
            color: white !important;
            padding: 25px !important;
            border-radius: 20px !important;
            font-family: Arial, sans-serif !important;
            font-weight: bold !important;
            max-width: 400px !important;
            border: 5px solid #fff !important;
            box-shadow: 0 0 50px rgba(220, 53, 69, 0.8) !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            pointer-events: auto !important;
        `);
        
        // LocalStorageデータ取得
        let bookmarks = [];
        let compares = [];
        try {
            bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
        } catch (e) {
            console.log('💥 LocalStorage読み込みエラー:', e);
        }
        
        // 内容作成
        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 32px; margin-bottom: 10px;">💥</div>
                <div style="font-size: 20px; margin-bottom: 5px;">核レベル強制表示</div>
                <div style="font-size: 14px; opacity: 0.9;">システム動作確認</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <div style="font-size: 16px; margin-bottom: 10px;">📊 データ状況</div>
                <div style="font-size: 14px;">
                    ⭐ ブックマーク: ${bookmarks.length}件<br>
                    ✓ 比較対象: ${compares.length}件<br>
                    🕒 時刻: ${new Date().toLocaleTimeString()}
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <div style="font-size: 16px; margin-bottom: 10px;">🔧 システム状態</div>
                <div style="font-size: 12px; line-height: 1.4;">
                    • 核パネル: 動作中<br>
                    • 可視化: 強制実行<br>
                    • 更新間隔: 0.5秒<br>
                    • Z-Index: 最大値適用
                </div>
            </div>
            
            <div style="text-align: center;">
                <button id="nuclear-close-btn" style="
                    background: rgba(255,255,255,0.3); 
                    color: white; 
                    border: 2px solid white; 
                    padding: 12px 20px; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    font-size: 14px;
                    font-weight: bold;
                ">パネルを閉じる</button>
            </div>
        `;
        
        // DOM追加
        document.body.appendChild(panel);
        
        // 閉じるボタンイベント
        const closeBtn = panel.querySelector('#nuclear-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.style.display = 'none';
                console.log('💥 核パネル手動で閉じられました');
            });
        }
        
        // CSS干渉防止
        preventCSSInterference(panel);
        
        console.log('💥 核パネル作成完了 - 可視性確認');
        
        // 可視性検証
        setTimeout(() => verifyVisibility(panel), 100);
    }
    
    function preventCSSInterference(panel) {
        // CSS変更を監視し強制復元
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // スタイルが変更された場合、強制復元
                    panel.setAttribute('style', `
                        position: fixed !important;
                        top: 20px !important;
                        right: 20px !important;
                        z-index: 2147483647 !important;
                        background: #dc3545 !important;
                        color: white !important;
                        padding: 25px !important;
                        border-radius: 20px !important;
                        font-family: Arial, sans-serif !important;
                        font-weight: bold !important;
                        max-width: 400px !important;
                        border: 5px solid #fff !important;
                        box-shadow: 0 0 50px rgba(220, 53, 69, 0.8) !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        display: block !important;
                        pointer-events: auto !important;
                    `);
                    console.log('💥 CSS干渉を検知し強制復元');
                }
            });
        });
        
        observer.observe(panel, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }
    
    function verifyVisibility(panel) {
        const rect = panel.getBoundingClientRect();
        const styles = window.getComputedStyle(panel);
        
        console.log('💥 可視性検証結果:', {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            zIndex: styles.zIndex,
            position: styles.position,
            top: styles.top,
            right: styles.right,
            width: rect.width,
            height: rect.height,
            inViewport: rect.top >= 0 && rect.right <= window.innerWidth
        });
        
        if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
            console.log('💥 可視性問題検出 - 強制修正');
            panel.style.display = 'block';
            panel.style.visibility = 'visible';
            panel.style.opacity = '1';
        }
    }
    
    // DOMが変更された場合の強制再作成
    const bodyObserver = new MutationObserver(function() {
        const panel = document.getElementById('nuclear-panel');
        if (!panel) {
            console.log('💥 パネル消失検出 - 再作成');
            createNuclearPanel();
        }
    });
    
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('💥 核レベル可視化システム起動完了');
})();