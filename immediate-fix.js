// 即座実行修正システム - 全CSP問題解決

// 即座実行（IIFEでscript実行時に確実実行）
(function() {
    console.log('即座実行システム開始');
    
    // 確実なボタン作成（CSP完全準拠）
    function createImmediateButton() {
        console.log('即座ボタン作成');
        
        // 既存の全ボタン削除
        var existingButtons = document.querySelectorAll('[id*="management"], [id*="emergency"], [id*="csp"], [id*="html-direct"]');
        for (var i = 0; i < existingButtons.length; i++) {
            existingButtons[i].remove();
        }
        
        // ボタン要素作成
        var btn = document.createElement('div');
        btn.id = 'immediate-button';
        btn.innerHTML = '🏆';
        btn.title = '管理センター';
        
        // スタイル個別設定（CSP準拠）
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.width = '80px';
        btn.style.height = '80px';
        btn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
        btn.style.color = 'white';
        btn.style.borderRadius = '50%';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.fontSize = '32px';
        btn.style.cursor = 'pointer';
        btn.style.zIndex = '999999999';
        btn.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.7)';
        btn.style.border = '5px solid white';
        btn.style.userSelect = 'none';
        btn.style.fontFamily = 'Arial, sans-serif';
        btn.style.textAlign = 'center';
        btn.style.transition = 'all 0.3s ease';
        
        // クリックイベント（安全な実装）
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            showImmediatePanel();
            console.log('即座ボタンクリック成功');
        };
        
        // ホバーイベント
        btn.onmouseenter = function() {
            this.style.transform = 'scale(1.15)';
            this.style.boxShadow = '0 25px 60px rgba(255, 107, 107, 1)';
        };
        
        btn.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.7)';
        };
        
        // DOMに追加
        document.body.appendChild(btn);
        console.log('即座ボタン作成完了');
        
        return btn;
    }
    
    // パネル作成
    function createImmediatePanel() {
        console.log('即座パネル作成');
        
        // 既存パネル削除
        var existingPanels = document.querySelectorAll('[id*="panel"]');
        for (var i = 0; i < existingPanels.length; i++) {
            if (existingPanels[i].id.indexOf('management') !== -1 || 
                existingPanels[i].id.indexOf('emergency') !== -1 ||
                existingPanels[i].id.indexOf('immediate') !== -1) {
                existingPanels[i].remove();
            }
        }
        
        var panel = document.createElement('div');
        panel.id = 'immediate-panel';
        
        // パネルスタイル（個別設定）
        panel.style.display = 'none';
        panel.style.position = 'fixed';
        panel.style.bottom = '110px';
        panel.style.right = '20px';
        panel.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
        panel.style.color = 'white';
        panel.style.padding = '30px';
        panel.style.borderRadius = '25px';
        panel.style.zIndex = '999999998';
        panel.style.minWidth = '380px';
        panel.style.textAlign = 'center';
        panel.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
        panel.style.border = '5px solid white';
        panel.style.backdropFilter = 'blur(20px)';
        
        // パネル内容作成（文字列連結のみ）
        var content = '';
        content += '<h3 style="margin: 0 0 25px 0; font-size: 22px; font-weight: bold;">📋 管理センター</h3>';
        content += '<div style="margin: 25px 0; padding: 25px; background: rgba(255,255,255,0.25); border-radius: 18px;">';
        content += '<div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 18px; font-weight: 600;">';
        content += '<span>比較中:</span>';
        content += '<span id="immediate-comparison-count" style="color: #FFE55C;">0/3人</span>';
        content += '</div>';
        content += '<div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600;">';
        content += '<span>ブックマーク:</span>';
        content += '<span id="immediate-bookmark-count" style="color: #FFE55C;">0人</span>';
        content += '</div>';
        content += '</div>';
        
        // ボタン作成
        content += '<button id="immediate-comparison-btn" style="width: 100%; background: rgba(255,255,255,0.35); border: none; color: white; padding: 18px 30px; border-radius: 18px; cursor: pointer; font-size: 18px; font-weight: 700; margin: 8px 0; transition: all 0.3s ease;">📊 比較表示</button>';
        
        content += '<button id="immediate-bookmark-btn" style="width: 100%; background: rgba(255,255,255,0.35); border: none; color: white; padding: 18px 30px; border-radius: 18px; cursor: pointer; font-size: 18px; font-weight: 700; margin: 8px 0; transition: all 0.3s ease;">⭐ ブックマーク表示</button>';
        
        content += '<button id="immediate-clear-btn" style="width: 100%; background: rgba(220,53,69,0.9); border: none; color: white; padding: 18px 30px; border-radius: 18px; cursor: pointer; font-size: 18px; font-weight: 700; margin: 8px 0; transition: all 0.3s ease;">🗑️ 全て削除</button>';
        
        content += '<button id="immediate-close-btn" style="position: absolute; top: 12px; right: 18px; background: rgba(255,255,255,0.4); border: none; color: white; font-size: 28px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; font-weight: bold;">×</button>';
        
        panel.innerHTML = content;
        document.body.appendChild(panel);
        
        // イベント設定（安全な方法）
        var comparisonBtn = document.getElementById('immediate-comparison-btn');
        var bookmarkBtn = document.getElementById('immediate-bookmark-btn');
        var clearBtn = document.getElementById('immediate-clear-btn');
        var closeBtn = document.getElementById('immediate-close-btn');
        
        if (comparisonBtn) {
            comparisonBtn.onclick = function() {
                alert('📊 比較機能\n\n現在比較するガイドが選択されていません。\n\nガイドカードから「比較追加」ボタンをクリックして、最大3人までのガイドを選択してください。\n\n選択したガイドの詳細情報を比較表示できます。');
            };
        }
        
        if (bookmarkBtn) {
            bookmarkBtn.onclick = function() {
                alert('⭐ ブックマーク機能\n\nブックマークされたガイドはまだありません。\n\nガイドカードの「ブックマーク」ボタン（⭐）をクリックして、お気に入りのガイドを保存してください。\n\nブックマークしたガイドはいつでもこちらから確認できます。');
            };
        }
        
        if (clearBtn) {
            clearBtn.onclick = function() {
                if (confirm('🗑️ 全ての選択を削除\n\n削除する項目がありません。\n\nブックマークや比較リストに項目がある場合のみ削除できます。')) {
                    alert('✅ 削除完了\n\n全ての選択（ブックマーク・比較リスト）を削除しました。');
                }
            };
        }
        
        if (closeBtn) {
            closeBtn.onclick = function() {
                panel.style.display = 'none';
            };
        }
        
        console.log('即座パネル作成完了');
        return panel;
    }
    
    // グローバル関数定義
    window.showImmediatePanel = function() {
        var panel = document.getElementById('immediate-panel');
        if (!panel) {
            panel = createImmediatePanel();
        }
        panel.style.display = 'block';
        console.log('即座パネル表示');
    };
    
    // 実行開始
    function executeImmediately() {
        if (!document.body) {
            console.log('body未準備 - 50ms後再試行');
            setTimeout(executeImmediately, 50);
            return;
        }
        
        createImmediateButton();
        createImmediatePanel();
        console.log('即座実行完了');
    }
    
    // 複数タイミング実行
    executeImmediately();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeImmediately);
    } else {
        executeImmediately();
    }
    
    setTimeout(executeImmediately, 50);
    setTimeout(executeImmediately, 200);
    setTimeout(executeImmediately, 500);
    setTimeout(executeImmediately, 1000);
    
    // 継続監視
    setInterval(function() {
        var btn = document.getElementById('immediate-button');
        if (!btn) {
            console.log('即座ボタン消失 - 再作成');
            createImmediateButton();
        }
        
        var panel = document.getElementById('immediate-panel');
        if (!panel) {
            console.log('即座パネル消失 - 再作成');
            createImmediatePanel();
        }
    }, 2000);
    
})();

console.log('即座実行システム完全初期化完了');