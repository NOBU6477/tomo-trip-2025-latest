// 超軽量管理パネル - 最小限の機能で確実に動作
(function() {
    'use strict';
    
    // 既存パネル削除
    const existing = document.querySelectorAll('[id*="management"], [id*="center"], [style*="position: fixed"]');
    existing.forEach(el => {
        if (el.textContent && (el.textContent.includes('管理') || el.textContent.includes('比較') || el.textContent.includes('お気に入り'))) {
            el.remove();
        }
    });
    
    // シンプルパネル作成
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div style="position:fixed;bottom:20px;right:20px;background:#4CAF50;color:white;padding:10px;border-radius:8px;z-index:9999;font-size:12px;min-width:150px;text-align:center;">
            <div style="font-weight:bold;margin-bottom:5px;">🏆管理センター</div>
            <div style="display:flex;gap:5px;justify-content:center;">
                <button onclick="alert('比較機能')" style="padding:4px 8px;border:none;border-radius:4px;background:rgba(255,255,255,0.3);color:white;cursor:pointer;font-size:10px;">比較</button>
                <button onclick="alert('お気に入り機能')" style="padding:4px 8px;border:none;border-radius:4px;background:rgba(255,255,255,0.3);color:white;cursor:pointer;font-size:10px;">★</button>
                <button onclick="alert('履歴機能')" style="padding:4px 8px;border:none;border-radius:4px;background:rgba(255,255,255,0.3);color:white;cursor:pointer;font-size:10px;">履歴</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
})();