/**
 * 右固定ボタンデバッグ用スクリプト
 */

console.log('=== 右固定ボタンデバッグ開始 ===');

// DOM読み込み状況確認
console.log('DOMContentLoaded:', document.readyState);
console.log('Bootstrap アクセス可能:', typeof bootstrap !== 'undefined');

// 既存の固定ボタンを検索
const existingButtons = document.querySelectorAll('.fixed-right-buttons, .top-right-buttons');
console.log('既存固定ボタン数:', existingButtons.length);
existingButtons.forEach((btn, index) => {
  console.log(`既存ボタン ${index}:`, btn.className, btn.style.cssText);
});

// CSS z-index競合チェック
const allFixedElements = document.querySelectorAll('*');
const highZIndexElements = [];
allFixedElements.forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.position === 'fixed' && parseInt(style.zIndex) > 9000) {
    highZIndexElements.push({
      element: el,
      zIndex: style.zIndex,
      className: el.className
    });
  }
});
console.log('高z-index固定要素:', highZIndexElements);

// 強制ボタン作成関数
function forceCreateButtons() {
  console.log('強制ボタン作成開始');
  
  // 全ての既存ボタンを削除
  document.querySelectorAll('.fixed-right-buttons, .top-right-buttons').forEach(el => {
    el.remove();
    console.log('既存ボタン削除:', el.className);
  });
  
  // 新しいコンテナ作成
  const container = document.createElement('div');
  container.id = 'debug-fixed-buttons';
  container.className = 'fixed-right-buttons';
  
  // 超高優先度スタイル
  container.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    right: 20px !important;
    transform: translateY(-50%) !important;
    z-index: 999999 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 15px !important;
    pointer-events: auto !important;
    visibility: visible !important;
    opacity: 1 !important;
    background: rgba(255,0,0,0.1) !important;
    padding: 5px !important;
  `;
  
  // 協賛店登録ボタン
  const sponsorBtn = document.createElement('button');
  sponsorBtn.textContent = '協賛店登録';
  sponsorBtn.style.cssText = `
    background: linear-gradient(135deg, #ff6b6b, #feca57) !important;
    border: none !important;
    color: white !important;
    padding: 12px 20px !important;
    border-radius: 25px !important;
    font-size: 14px !important;
    font-weight: bold !important;
    cursor: pointer !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
    min-width: 140px !important;
    white-space: nowrap !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  `;
  sponsorBtn.onclick = () => alert('協賛店登録機能は準備中です');
  
  // ログインボタン
  const loginBtn = document.createElement('button');
  loginBtn.textContent = 'ログイン';
  loginBtn.style.cssText = `
    background: linear-gradient(135deg, #4ecdc4, #44a08d) !important;
    border: none !important;
    color: white !important;
    padding: 12px 20px !important;
    border-radius: 25px !important;
    font-size: 14px !important;
    font-weight: bold !important;
    cursor: pointer !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
    min-width: 140px !important;
    white-space: nowrap !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  `;
  loginBtn.onclick = () => alert('ログイン機能は準備中です');
  
  // ボタン追加
  container.appendChild(sponsorBtn);
  container.appendChild(loginBtn);
  
  // body に追加
  document.body.appendChild(container);
  
  console.log('強制ボタン作成完了');
  console.log('コンテナ位置:', container.getBoundingClientRect());
  console.log('協賛店ボタン位置:', sponsorBtn.getBoundingClientRect());
  console.log('ログインボタン位置:', loginBtn.getBoundingClientRect());
  
  return container;
}

// 即座に実行
const buttons = forceCreateButtons();

// 5秒間隔で再作成（テスト用）
let attempts = 0;
const interval = setInterval(() => {
  attempts++;
  if (attempts > 3) {
    clearInterval(interval);
    return;
  }
  
  console.log(`再作成試行 ${attempts}`);
  if (!document.getElementById('debug-fixed-buttons')) {
    forceCreateButtons();
  }
}, 5000);

console.log('=== 右固定ボタンデバッグ完了 ===');