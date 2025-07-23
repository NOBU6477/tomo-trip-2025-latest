// 強化された管理パネル - 確実動作版
(function() {
    'use strict';
    
    console.log('管理パネル初期化開始');
    
    // 遅延実行で確実に動作
    function initializePanel() {
        // 既存パネル削除
        const existing = document.querySelectorAll('[id*="management"], [id*="center"], [style*="position: fixed"]');
        existing.forEach(el => {
            if (el.textContent && (el.textContent.includes('管理') || el.textContent.includes('比較') || el.textContent.includes('お気に入り'))) {
                el.remove();
            }
        });
        
        // 強化されたパネル作成
        const panel = document.createElement('div');
        panel.id = 'management-center-panel';
        panel.innerHTML = `
            <div style="position:fixed;bottom:20px;right:20px;background:#4CAF50;color:white;padding:12px;border-radius:10px;z-index:99999;font-size:12px;min-width:160px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                <div style="font-weight:bold;margin-bottom:8px;">🏆管理センター</div>
                <div style="display:flex;gap:6px;justify-content:center;margin-bottom:4px;">
                    <button id="compare-btn" onclick="handleCompare()" style="padding:5px 10px;border:none;border-radius:4px;background:rgba(255,255,255,0.3);color:white;cursor:pointer;font-size:10px;font-weight:bold;">✓比較</button>
                    <button id="bookmark-btn" onclick="handleBookmark()" style="padding:5px 10px;border:none;border-radius:4px;background:rgba(255,255,255,0.3);color:white;cursor:pointer;font-size:10px;font-weight:bold;">⭐お気に入り</button>
                    <button id="history-btn" onclick="handleHistory()" style="padding:5px 10px;border:none;border-radius:4px;background:rgba(255,255,255,0.3);color:white;cursor:pointer;font-size:10px;font-weight:bold;">📚履歴</button>
                </div>
                <div style="font-size:10px;color:rgba(255,255,255,0.8);">比較中: 0/3人</div>
            </div>
        `;
        
        document.body.appendChild(panel);
        console.log('管理パネル作成完了');
        
        // ボタンイベントハンドラを確実に設定
        setTimeout(() => {
            const compareBtn = document.getElementById('compare-btn');
            const bookmarkBtn = document.getElementById('bookmark-btn');
            const historyBtn = document.getElementById('history-btn');
            
            if (compareBtn) {
                compareBtn.onclick = function() {
                    alert('比較機能：選択したガイドを比較します\n\n現在の選択：0/3人\n\n使い方：\n1. ガイドカードの✓アイコンをクリック\n2. 最大3人まで選択可能\n3. 料金・評価・特技を比較表示');
                };
            }
            
            if (bookmarkBtn) {
                bookmarkBtn.onclick = function() {
                    alert('お気に入り機能：保存したガイドを管理します\n\n現在の保存数：0人\n\n使い方：\n1. ガイドカードの⭐アイコンをクリック\n2. お気に入りに保存\n3. 後で簡単にアクセス可能');
                };
            }
            
            if (historyBtn) {
                historyBtn.onclick = function() {
                    alert('履歴機能：閲覧履歴を確認できます\n\n機能：\n• 最近見たガイド\n• 検索履歴\n• 予約履歴\n• 連絡履歴');
                };
            }
            
            console.log('管理パネルイベントハンドラ設定完了');
        }, 500);
    }
    
    // DOM読み込み後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePanel);
    } else {
        initializePanel();
    }
    
    // フォールバック：2秒後に再実行
    setTimeout(initializePanel, 2000);
})();