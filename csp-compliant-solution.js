// CSP準拠解決システム - eval使用禁止対応

console.log('🔐 CSP準拠解決システム開始');

// CSP準拠の安全な実装（eval不使用）
(function() {
    'use strict';
    
    // 1. 安全なDOM操作関数
    function safeCreateElement(tagName, options) {
        const element = document.createElement(tagName);
        
        if (options.id) element.id = options.id;
        if (options.className) element.className = options.className;
        if (options.innerHTML) element.innerHTML = options.innerHTML;
        if (options.textContent) element.textContent = options.textContent;
        
        // スタイル設定（eval不使用）
        if (options.styles) {
            Object.keys(options.styles).forEach(function(key) {
                element.style[key] = options.styles[key];
            });
        }
        
        return element;
    }
    
    // 2. 管理ボタンの安全な作成
    function createSafeManagementButton() {
        console.log('CSP準拠管理ボタン作成');
        
        // 既存ボタン削除
        const existingButtons = document.querySelectorAll('[id*="management"], [id*="emergency"]');
        existingButtons.forEach(function(btn) {
            btn.remove();
        });
        
        // ボタン作成
        const button = safeCreateElement('div', {
            id: 'csp-safe-button',
            innerHTML: '🏆',
            styles: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                cursor: 'pointer',
                zIndex: '2147483647',
                boxShadow: '0 10px 30px rgba(255, 107, 107, 0.6)',
                border: '4px solid white',
                userSelect: 'none',
                pointerEvents: 'auto',
                visibility: 'visible',
                opacity: '1',
                transition: 'all 0.3s ease',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center'
            }
        });
        
        // 安全なイベントリスナー追加
        button.addEventListener('click', handleButtonClick);
        button.addEventListener('mouseenter', handleButtonHover);
        button.addEventListener('mouseleave', handleButtonLeave);
        
        document.body.appendChild(button);
        console.log('✅ CSP準拠ボタン作成完了');
        
        return button;
    }
    
    // 3. 管理パネルの安全な作成
    function createSafeManagementPanel() {
        console.log('CSP準拠パネル作成');
        
        // 既存パネル削除
        const existingPanels = document.querySelectorAll('[id*="panel"]');
        existingPanels.forEach(function(panel) {
            if (panel.id.includes('management') || panel.id.includes('emergency')) {
                panel.remove();
            }
        });
        
        const panel = safeCreateElement('div', {
            id: 'csp-safe-panel',
            styles: {
                display: 'none',
                position: 'fixed',
                bottom: '100px',
                right: '20px',
                background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                color: 'white',
                padding: '25px',
                borderRadius: '20px',
                zIndex: '2147483646',
                minWidth: '350px',
                maxWidth: '90vw',
                textAlign: 'center',
                boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
                border: '4px solid white',
                backdropFilter: 'blur(15px)'
            }
        });
        
        // パネル内容を安全に設定
        const panelContent = document.createElement('div');
        
        // タイトル
        const title = safeCreateElement('h4', {
            textContent: '📋 管理センター',
            styles: {
                margin: '0 0 20px 0',
                fontWeight: 'bold',
                fontSize: '20px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }
        });
        
        // カウンター表示
        const counterDiv = safeCreateElement('div', {
            styles: {
                margin: '20px 0',
                padding: '20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '15px',
                backdropFilter: 'blur(5px)'
            }
        });
        
        const comparisonCount = safeCreateElement('div', {
            styles: {
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
            }
        });
        comparisonCount.innerHTML = '<span style="font-size: 16px; font-weight: 600;">比較中:</span><span id="csp-comparison-count" style="font-size: 16px; font-weight: 600; color: #FFE55C;">0/3人</span>';
        
        const bookmarkCount = safeCreateElement('div', {
            styles: {
                display: 'flex',
                justifyContent: 'space-between'
            }
        });
        bookmarkCount.innerHTML = '<span style="font-size: 16px; font-weight: 600;">ブックマーク:</span><span id="csp-bookmark-count" style="font-size: 16px; font-weight: 600; color: #FFE55C;">0人</span>';
        
        counterDiv.appendChild(comparisonCount);
        counterDiv.appendChild(bookmarkCount);
        
        // ボタンコンテナ
        const buttonContainer = safeCreateElement('div', {
            styles: {
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                margin: '20px 0'
            }
        });
        
        // 比較ボタン
        const comparisonBtn = safeCreateElement('button', {
            id: 'csp-comparison-btn',
            textContent: '📊 比較表示',
            styles: {
                background: 'rgba(255,255,255,0.3)',
                border: 'none',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }
        });
        comparisonBtn.addEventListener('click', showSafeComparison);
        
        // ブックマークボタン
        const bookmarkBtn = safeCreateElement('button', {
            id: 'csp-bookmark-btn',
            textContent: '⭐ ブックマーク表示',
            styles: {
                background: 'rgba(255,255,255,0.3)',
                border: 'none',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }
        });
        bookmarkBtn.addEventListener('click', showSafeBookmarks);
        
        // 削除ボタン
        const clearBtn = safeCreateElement('button', {
            id: 'csp-clear-btn',
            textContent: '🗑️ 全て削除',
            styles: {
                background: 'rgba(220,53,69,0.8)',
                border: 'none',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }
        });
        clearBtn.addEventListener('click', clearSafeAll);
        
        // 閉じるボタン
        const closeBtn = safeCreateElement('button', {
            textContent: '×',
            styles: {
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'rgba(255,255,255,0.3)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
            }
        });
        closeBtn.addEventListener('click', hideSafePanel);
        
        buttonContainer.appendChild(comparisonBtn);
        buttonContainer.appendChild(bookmarkBtn);
        buttonContainer.appendChild(clearBtn);
        
        panelContent.appendChild(title);
        panelContent.appendChild(counterDiv);
        panelContent.appendChild(buttonContainer);
        panelContent.appendChild(closeBtn);
        
        panel.appendChild(panelContent);
        document.body.appendChild(panel);
        
        console.log('✅ CSP準拠パネル作成完了');
        return panel;
    }
    
    // 4. イベントハンドラー（安全な実装）
    function handleButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();
        showSafePanel();
        console.log('CSP準拠ボタンクリック成功');
    }
    
    function handleButtonHover(event) {
        event.target.style.transform = 'scale(1.2)';
        event.target.style.boxShadow = '0 20px 50px rgba(255, 107, 107, 0.9)';
    }
    
    function handleButtonLeave(event) {
        event.target.style.transform = 'scale(1)';
        event.target.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.6)';
    }
    
    function showSafePanel() {
        let panel = document.getElementById('csp-safe-panel');
        if (!panel) {
            panel = createSafeManagementPanel();
        }
        panel.style.display = 'block';
        updateSafeCounters();
        console.log('CSP準拠パネル表示');
    }
    
    function hideSafePanel() {
        const panel = document.getElementById('csp-safe-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }
    
    function showSafeComparison() {
        const comparisonList = JSON.parse(localStorage.getItem('csp-comparisonList') || '[]');
        if (comparisonList.length === 0) {
            alert('📊 比較機能\n\n現在比較するガイドが選択されていません。\n\nガイドカードから「比較追加」ボタンをクリックして、最大3人までのガイドを選択してください。\n\n選択したガイドの詳細情報を比較表示できます。');
            return;
        }
        
        let message = '【📊 比較中のガイド一覧】\n\n';
        comparisonList.forEach(function(guide, index) {
            message += (index + 1) + '. ' + (guide.name || '名前不明') + '\n';
            message += '   📍 場所: ' + (guide.location || '場所不明') + '\n';
            message += '   💰 料金: ¥' + (guide.price || '6000') + '/セッション\n';
            message += '   ⭐ 評価: ' + (guide.rating || '4.5') + '★\n';
            message += '   🗣️ 言語: ' + (guide.languages || '日本語') + '\n\n';
        });
        
        message += '合計 ' + comparisonList.length + ' 人のガイドを比較中です。';
        alert(message);
    }
    
    function showSafeBookmarks() {
        const bookmarkList = JSON.parse(localStorage.getItem('csp-bookmarkList') || '[]');
        if (bookmarkList.length === 0) {
            alert('⭐ ブックマーク機能\n\nブックマークされたガイドはまだありません。\n\nガイドカードの「ブックマーク」ボタン（⭐）をクリックして、お気に入りのガイドを保存してください。\n\nブックマークしたガイドはいつでもこちらから確認できます。');
            return;
        }
        
        let message = '【⭐ ブックマーク済みガイド一覧】\n\n';
        bookmarkList.forEach(function(guide, index) {
            message += (index + 1) + '. ' + (guide.name || '名前不明') + '\n';
            message += '   📍 場所: ' + (guide.location || '場所不明') + '\n';
            message += '   💰 料金: ¥' + (guide.price || '6000') + '/セッション\n';
            message += '   ⭐ 評価: ' + (guide.rating || '4.5') + '★\n';
            message += '   🗣️ 言語: ' + (guide.languages || '日本語') + '\n\n';
        });
        
        message += '合計 ' + bookmarkList.length + ' 人のガイドをブックマーク中です。';
        alert(message);
    }
    
    function clearSafeAll() {
        const bookmarkList = JSON.parse(localStorage.getItem('csp-bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('csp-comparisonList') || '[]');
        const total = bookmarkList.length + comparisonList.length;
        
        if (total === 0) {
            alert('🗑️ 削除機能\n\n削除する項目がありません。\n\nブックマークや比較リストに項目がある場合のみ削除できます。');
            return;
        }
        
        const confirmMessage = '🗑️ 全ての選択を削除\n\n以下の項目を削除しますか？\n• ブックマーク: ' + bookmarkList.length + '人\n• 比較リスト: ' + comparisonList.length + '人\n\nこの操作は取り消せません。';
        
        if (confirm(confirmMessage)) {
            localStorage.removeItem('csp-bookmarkList');
            localStorage.removeItem('csp-comparisonList');
            updateSafeCounters();
            alert('✅ 削除完了\n\n全ての選択（ブックマーク・比較リスト）を削除しました。');
        }
    }
    
    function updateSafeCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('csp-bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('csp-comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('csp-bookmark-count');
        const comparisonCounter = document.getElementById('csp-comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length + '人';
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length + '/3人';
    }
    
    // 5. 初期化（安全な実行）
    function initializeSafeSystem() {
        console.log('CSP準拠システム初期化');
        
        if (!document.body) {
            console.log('body未準備 - 再試行');
            setTimeout(initializeSafeSystem, 100);
            return;
        }
        
        createSafeManagementButton();
        createSafeManagementPanel();
        updateSafeCounters();
        
        console.log('✅ CSP準拠システム初期化完了');
    }
    
    // 6. 実行開始
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSafeSystem);
    } else {
        initializeSafeSystem();
    }
    
    // 遅延実行
    setTimeout(initializeSafeSystem, 100);
    setTimeout(initializeSafeSystem, 500);
    setTimeout(initializeSafeSystem, 1000);
    
    // 継続監視
    setInterval(function() {
        const button = document.getElementById('csp-safe-button');
        const panel = document.getElementById('csp-safe-panel');
        
        if (!button) {
            console.log('CSP準拠ボタン消失 - 再作成');
            createSafeManagementButton();
        }
        
        if (!panel) {
            console.log('CSP準拠パネル消失 - 再作成');
            createSafeManagementPanel();
        }
        
        updateSafeCounters();
    }, 3000);
    
})();

console.log('✅ CSP準拠解決システム完全初期化完了');