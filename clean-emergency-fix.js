/**
 * 緊急クリーン修復
 * すべてのタイマーとイベントを即座停止
 */

// 即座にすべてのタイマーを停止
window.addEventListener('DOMContentLoaded', function() {
  // 1000個のタイマーIDまでクリア
  for (let i = 1; i < 1000; i++) {
    clearInterval(i);
    clearTimeout(i);
  }
  
  console.log('✅ 緊急修復: すべてのタイマー停止');
});

// モバイル用協賛店ボタンのシンプル実装
if (window.innerWidth <= 768) {
  document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
      .mobile-sponsor-fix {
        position: fixed;
        bottom: 20px;
        right: 15px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .mobile-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        min-width: 110px;
      }
      .mobile-btn.login {
        background: linear-gradient(135deg, #f093fb, #f5576c);
      }
      @media (min-width: 769px) {
        .mobile-sponsor-fix { display: none; }
      }
    `;
    document.head.appendChild(style);
    
    const container = document.createElement('div');
    container.className = 'mobile-sponsor-fix';
    container.innerHTML = `
      <button class="mobile-btn" onclick="location.href='/sponsor-registration.html'">🏪 協賛店登録</button>
      <button class="mobile-btn login" onclick="alert('ログイン機能は開発中です')">🔑 ログイン</button>
    `;
    document.body.appendChild(container);
  });
}