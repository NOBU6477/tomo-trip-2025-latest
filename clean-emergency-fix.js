// 究極クリーンシステム - 最小限で確実動作
console.log('🧹 クリーンシステム開始');

// 即座実行
(() => {
    // 管理パネル作成
    const panel = document.createElement('div');
    panel.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:#2E7D32;color:white;padding:8px;border-radius:6px;z-index:99999;font-size:11px;box-shadow:0 2px 10px rgba(0,0,0,0.3);">
        <div style="font-weight:bold;margin-bottom:4px;text-align:center;">🏆管理センター</div>
        <div style="display:flex;gap:4px;">
            <button onclick="alert('比較機能が選択されました')" style="padding:3px 6px;border:none;border-radius:3px;background:rgba(255,255,255,0.25);color:white;cursor:pointer;font-size:9px;">比較</button>
            <button onclick="alert('お気に入り機能が選択されました')" style="padding:3px 6px;border:none;border-radius:3px;background:rgba(255,255,255,0.25);color:white;cursor:pointer;font-size:9px;">⭐</button>
            <button onclick="alert('履歴機能が選択されました')" style="padding:3px 6px;border:none;border-radius:3px;background:rgba(255,255,255,0.25);color:white;cursor:pointer;font-size:9px;">履歴</button>
        </div>
    </div>`;
    document.body.appendChild(panel);
    console.log('🧹 クリーン管理パネル作成完了');
})();