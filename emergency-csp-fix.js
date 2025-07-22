// 緊急CSP修正システム
console.log('🚨 緊急CSP修正開始');

function emergencyCSPFix() {
    console.log('🚨 CSP問題緊急修正');
    
    // インライン onclick の削除と置換
    function removeInlineClickHandlers() {
        console.log('🔧 インライン onclick 削除');
        
        // すべてのonclick属性を検索
        const elementsWithOnclick = document.querySelectorAll('[onclick]');
        console.log(`🔍 見つかったonclick要素: ${elementsWithOnclick.length}個`);
        
        elementsWithOnclick.forEach((element, index) => {
            const onclickCode = element.getAttribute('onclick');
            console.log(`🔧 要素${index + 1}: onclick="${onclickCode}"`);
            
            // onclick削除
            element.removeAttribute('onclick');
            
            // data属性に変換
            element.setAttribute('data-original-onclick', onclickCode);
            element.setAttribute('data-csp-fixed', 'true');
            
            // 新しいイベントリスナー追加
            element.addEventListener('click', function(e) {
                console.log('📍 CSP修正済みクリック:', onclickCode);
                
                // 安全な関数実行
                try {
                    if (onclickCode.includes('enhancedManagementSystem.')) {
                        const methodName = onclickCode.match(/enhancedManagementSystem\.(\w+)/);
                        if (methodName && window.enhancedManagementSystem) {
                            const method = methodName[1];
                            if (typeof window.enhancedManagementSystem[method] === 'function') {
                                window.enhancedManagementSystem[method]();
                            }
                        }
                    } else if (onclickCode.includes('document.getElementById')) {
                        // DOM操作系
                        const elementId = onclickCode.match(/getElementById\('([^']+)'\)/);
                        if (elementId) {
                            const targetElement = document.getElementById(elementId[1]);
                            if (targetElement) {
                                if (onclickCode.includes('.remove()')) {
                                    targetElement.remove();
                                } else if (onclickCode.includes('.style.display')) {
                                    targetElement.style.display = 'none';
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log('⚠️ CSP修正済みクリック実行エラー:', error);
                }
            });
        });
        
        console.log(`✅ ${elementsWithOnclick.length}個のonclick属性を修正`);
    }
    
    // 強制ガイダンスパネル作成
    function forceCreateGuidancePanel() {
        console.log('🎯 強制ガイダンスパネル作成');
        
        // 既存削除
        const existing = document.getElementById('emergency-guidance-panel');
        if (existing) existing.remove();
        
        // パネル作成
        const panel = document.createElement('div');
        panel.id = 'emergency-guidance-panel';
        
        // スタイル設定
        Object.assign(panel.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '999999',
            background: 'linear-gradient(45deg, #28a745, #20c997)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(40, 167, 69, 0.4)',
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 'bold',
            maxWidth: '350px',
            border: '3px solid white',
            visibility: 'visible',
            opacity: '1',
            pointerEvents: 'auto',
            display: 'block'
        });
        
        // LocalStorageデータ取得
        let bookmarkCount = 0;
        let compareCount = 0;
        try {
            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
            const compares = JSON.parse(localStorage.getItem('comparedGuides') || '[]');
            bookmarkCount = bookmarks.length;
            compareCount = compares.length;
        } catch (e) {
            console.log('⚠️ LocalStorage読み込みエラー:', e);
        }
        
        // 内容作成
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display: flex; align-items: center; margin-bottom: 15px;';
        
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = 'font-size: 24px; margin-right: 10px;';
        iconDiv.textContent = '🎯';
        
        const titleDiv = document.createElement('div');
        const titleText = document.createElement('div');
        titleText.style.cssText = 'font-size: 18px; font-weight: bold;';
        titleText.textContent = '次のステップガイド (CSP修正版)';
        
        const subtitleText = document.createElement('div');
        subtitleText.style.cssText = 'font-size: 12px; opacity: 0.9;';
        subtitleText.textContent = '何をしますか？';
        
        titleDiv.appendChild(titleText);
        titleDiv.appendChild(subtitleText);
        headerDiv.appendChild(iconDiv);
        headerDiv.appendChild(titleDiv);
        panel.appendChild(headerDiv);
        
        // ステータス表示
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 10px;';
        
        const statusTitle = document.createElement('div');
        statusTitle.style.cssText = 'font-size: 16px; margin-bottom: 10px;';
        statusTitle.textContent = bookmarkCount === 0 && compareCount === 0 ? '📚 ステップ1: ガイドを選択' : '📊 現在の選択状況';
        
        const statusContent = document.createElement('div');
        statusContent.style.cssText = 'font-size: 14px; line-height: 1.4;';
        
        if (bookmarkCount === 0 && compareCount === 0) {
            statusContent.innerHTML = '• ガイドカードの左上⭐でブックマーク<br>• ガイドカードの左上✓で比較対象選択<br>• 最大3人まで比較可能';
        } else {
            statusContent.innerHTML = `⭐ ブックマーク: ${bookmarkCount}件<br>✓ 比較対象: ${compareCount}/3件`;
        }
        
        statusDiv.appendChild(statusTitle);
        statusDiv.appendChild(statusContent);
        panel.appendChild(statusDiv);
        
        // アクションボタン
        if (bookmarkCount > 0 || compareCount > 0) {
            const actionDiv = document.createElement('div');
            actionDiv.style.cssText = 'margin-bottom: 15px;';
            
            const actionTitle = document.createElement('div');
            actionTitle.style.cssText = 'font-size: 16px; margin-bottom: 10px;';
            actionTitle.textContent = '🎯 次にできること:';
            actionDiv.appendChild(actionTitle);
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
            
            if (bookmarkCount > 0) {
                const bookmarkBtn = document.createElement('button');
                bookmarkBtn.style.cssText = 'background: #ffc107; color: #000; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;';
                bookmarkBtn.textContent = `📚 ブックマーク管理 (${bookmarkCount}件)`;
                bookmarkBtn.addEventListener('click', () => {
                    alert(`📚 ブックマーク管理センター\n\n現在のブックマーク: ${bookmarkCount}件\n\n機能開発中です。`);
                });
                buttonContainer.appendChild(bookmarkBtn);
            }
            
            if (compareCount > 0) {
                const compareBtn = document.createElement('button');
                compareBtn.style.cssText = 'background: #17a2b8; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;';
                compareBtn.textContent = `🔍 ガイド比較 (${compareCount}件)`;
                compareBtn.addEventListener('click', () => {
                    alert(`🔍 ガイド比較センター\n\n比較中: ${compareCount}件\n\n機能開発中です。`);
                });
                buttonContainer.appendChild(compareBtn);
            }
            
            if (compareCount >= 2) {
                const bookingBtn = document.createElement('button');
                bookingBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; border: 2px solid white;';
                bookingBtn.textContent = '🚀 予約プロセス開始';
                bookingBtn.addEventListener('click', () => {
                    alert('🚀 予約プロセスを開始します。\n\n詳細機能開発中です。');
                });
                buttonContainer.appendChild(bookingBtn);
            }
            
            actionDiv.appendChild(buttonContainer);
            panel.appendChild(actionDiv);
        }
        
        // 閉じるボタン
        const closeDiv = document.createElement('div');
        closeDiv.style.cssText = 'text-align: center; margin-top: 15px;';
        
        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'background: rgba(255,255,255,0.3); color: white; border: 1px solid white; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 12px;';
        closeBtn.textContent = 'ガイドを閉じる';
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        closeDiv.appendChild(closeBtn);
        panel.appendChild(closeDiv);
        
        // DOM追加
        document.body.appendChild(panel);
        
        console.log('✅ 緊急ガイダンスパネル作成完了');
        return panel;
    }
    
    // CSP検証
    function verifyCSPCompliance() {
        console.log('🔍 CSP準拠検証');
        
        // eval使用チェック
        const scripts = document.getElementsByTagName('script');
        let evalCount = 0;
        
        for (let script of scripts) {
            if (script.src && script.src.includes('.js')) {
                // 外部スクリプトファイルのチェックはスキップ
                continue;
            }
            
            if (script.innerHTML.includes('eval(')) {
                evalCount++;
                console.log('⚠️ eval使用発見:', script.src || 'inline');
            }
        }
        
        // onclick属性チェック
        const onclickElements = document.querySelectorAll('[onclick]');
        
        console.log(`📊 CSP検証結果:
        - eval使用: ${evalCount}箇所
        - onclick属性: ${onclickElements.length}箇所`);
        
        return { evalCount, onclickCount: onclickElements.length };
    }
    
    // 初期化
    function init() {
        console.log('🚨 緊急CSP修正初期化');
        
        // CSP検証
        const compliance = verifyCSPCompliance();
        
        // onclick修正
        removeInlineClickHandlers();
        
        // ガイダンスパネル強制作成
        forceCreateGuidancePanel();
        
        // 定期更新
        setInterval(() => {
            const panel = document.getElementById('emergency-guidance-panel');
            if (!panel) {
                console.log('🔄 ガイダンスパネル再作成');
                forceCreateGuidancePanel();
            }
        }, 10000);
        
        console.log('✅ 緊急CSP修正完了');
    }
    
    // 実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

// 即座に実行
emergencyCSPFix();

console.log('✅ 緊急CSP修正システム準備完了');