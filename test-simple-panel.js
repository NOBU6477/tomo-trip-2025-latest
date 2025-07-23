// テストシンプルパネル - 動作確認用
console.log('🟢 シンプルテストパネル開始');

// 最もシンプルな実装
setTimeout(function() {
    console.log('🟢 シンプルパネル作成中');
    
    // 既存の削除
    const existing = document.getElementById('test-simple-panel');
    if (existing) existing.remove();
    
    // HTML作成
    const html = `
    <div id="test-simple-panel" style="position:fixed;top:100px;right:20px;background:#28a745;color:white;padding:20px;border-radius:10px;z-index:999999;border:3px solid white;max-width:300px;">
        <h3 style="margin:0 0 10px 0;">🟢 シンプルテスト</h3>
        <p style="margin:0 0 10px 0;font-size:14px;">このパネルが表示されていますか？</p>
        <button onclick="this.parentElement.remove()" style="background:white;color:#28a745;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;font-weight:bold;">削除</button>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', html);
    console.log('🟢 シンプルパネル作成完了');
}, 1000);