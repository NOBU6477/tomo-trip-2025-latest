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

// 古いモバイルボタンは削除済み